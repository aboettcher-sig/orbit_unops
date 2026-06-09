"""SDG 11.3.1 — Urban Land Consumption retrieval method.

Trains a Random Forest classifier on Google Satellite Embeddings to
estimate annual urban extent, then exports prediction stats and yearly
urban-area CSVs to Google Cloud Storage via Earth Engine batch tasks.
"""

import json
import os
from typing import Any, Dict, Optional

import ee
import yaml

if __package__:
    # Running as part of the orbit_unops package.
    from ....utils.gee_common import (
        _validate_inputs,
        aggregate_regional_stats,
        export_image_to_gcs,
        export_table_to_gcs,
        export_vector_to_gcs,
        initialize_ee,
    )
    from ....utils.ae_specific import embeddings_by_year, generate_stratified_sample
else:
    # Running directly from the sdg_11_03_01/ folder.
    from utils.gee_common import (
        _validate_inputs,
        aggregate_regional_stats,
        export_image_to_gcs,
        export_table_to_gcs,
        export_vector_to_gcs,
        initialize_ee,
    )
    from utils.ae_specific import embeddings_by_year, generate_stratified_sample

# ---------------------------------------------------------------------------
# Load dataset config (config.yaml lives next to this file)
# ---------------------------------------------------------------------------
_CONFIG_PATH = os.path.join(os.path.dirname(__file__), "config.yaml")
with open(_CONFIG_PATH, "r") as _f:
    _CONFIG = yaml.safe_load(_f)
_DATASETS = _CONFIG["datasets"]
_PARAMS = _CONFIG["parameters"]


def run_11_03_01(
    map_year: int,
    year_start: int,
    year_end: int,
    gcs_bucket: str,
    country: Optional[str] = None,
    aoi_geojson: Optional[Dict[str, Any]] = None,
    sample_points: Optional[int] = None,
    sample_scale: Optional[int] = None,
    embedding_scale: Optional[int] = None,
    threshold: Optional[float] = None,
    trees: Optional[int] = None,
    seed: Optional[int] = None,
    project: Optional[str] = None,
    export_name: Optional[str] = None,
    gcs_prefix: Optional[str] = None,
    export_formats: Optional[list[str]] = None,
    model_asset_id: Optional[str] = None,
    **kwargs: Any,
) -> Dict[str, Any]:
    """Run the classification pipeline and start GCS table export tasks.

    Accepts either a ``country`` name (resolved via GAUL) or a custom
    ``aoi_geojson`` GeoJSON geometry.  When both are supplied,
    ``aoi_geojson`` takes precedence.
    """
    # Resolve hyperparameters: use caller-supplied value or fall back to config defaults.
    sample_points = sample_points if sample_points is not None else _PARAMS["sample_points"]
    sample_scale = sample_scale if sample_scale is not None else _PARAMS["sample_scale"]
    embedding_scale = embedding_scale if embedding_scale is not None else _PARAMS["embedding_scale"]
    threshold = threshold if threshold is not None else _PARAMS["threshold"]
    trees = trees if trees is not None else _PARAMS["trees"]
    seed = seed if seed is not None else _PARAMS["seed"]

    _validate_inputs(country, year_start, year_end, threshold, gcs_bucket)
    initialize_ee(project=project)

    # Datasets (paths loaded from config.yaml)
    countries = ee.FeatureCollection(_DATASETS["countries"])
    wsf2019 = ee.ImageCollection(_DATASETS["wsf2019"])
    embeddings = ee.ImageCollection(_DATASETS["embeddings"])

    # ---------------------------------------------------------------------------
    # Resolve spatial boundary – prefer aoi_geojson over country lookup
    # ---------------------------------------------------------------------------
    if aoi_geojson:
        boundary_geometry = ee.Geometry(aoi_geojson)
        boundary = ee.FeatureCollection([ee.Feature(boundary_geometry)])
        bbox = boundary
        region_label = "custom_aoi"
    else:
        boundary = countries.filter(ee.Filter.eq("ADM0_NAME", country))
        boundary_size = boundary.size().getInfo()
        if boundary_size == 0:
            raise ValueError(f'No country found with ADM0_NAME="{country}"')
        bbox = boundary.bounds()
        boundary_geometry = boundary.geometry()
        region_label = country.lower().replace(" ", "_").replace("-", "_")

    # Ground truth from WSF 2019
    filtered_wsf = wsf2019.filterBounds(bbox).mosaic().gt(0).unmask()

    # Stratified sample using the shared helper (Step 2)
    sample = generate_stratified_sample(
        image=filtered_wsf,
        num_points=sample_points,
        bbox=bbox,
        scale=sample_scale,
        boundary=boundary,
    )

    # Join labels with embedding vectors
    map_year_embeddings = embeddings_by_year(embeddings, boundary, map_year)
    labels_and_vectors = map_year_embeddings.sampleRegions(
        collection=sample,
        properties=["b1"],
        scale=embedding_scale,
    )

    # Train/validation split
    collection_with_random = labels_and_vectors.randomColumn(columnName="random", seed=seed)
    training_set = collection_with_random.filter(ee.Filter.lt("random", 0.7))
    validation_set = collection_with_random.filter(ee.Filter.gte("random", 0.7))

    binary_filter = ee.Filter.inList("b1", [0, 1])
    filtered_collection = training_set.filter(binary_filter)

    # Use selected map-year embedding band names as model inputs
    input_properties = map_year_embeddings.bandNames()

    default_export_name = f"urban_extent_{region_label}_{year_start}-{year_end}"
    final_export_name = export_name or default_export_name

    classifier_export_task = None
    if model_asset_id:
        classifier = ee.Classifier.load(model_asset_id)
    else:
        classifier = (
            ee.Classifier.smileRandomForest(numberOfTrees=trees)
            .train(
                features=filtered_collection,
                classProperty="b1",
                inputProperties=input_properties,
            )
        )
        assetId = f"projects/{project}/assets/{final_export_name}_classifier" if project else f"{final_export_name}_classifier"
        classifier_export_task = ee.batch.Export.classifier.toAsset(
            classifier=classifier, 
            description=f"{final_export_name}_classifier_export", 
            assetId=assetId
        )
        classifier_export_task.start()

    probability_classifier = classifier.setOutputMode("PROBABILITY")

    # Multi-year stack
    year_list = list(range(year_start, year_end + 1))
    year_names = [f"Y{year}" for year in year_list]
    yearly_images = [
        embeddings_by_year(embeddings, boundary, year).classify(probability_classifier)
        for year in year_list
    ]
    all_year_results = ee.ImageCollection(yearly_images).toBands().rename(year_names)
    output_image = all_year_results.gte(threshold).toByte()

    normalized_prefix = (gcs_prefix or "").strip().strip("/")
    base_prefix = f"{normalized_prefix}/{final_export_name}" if normalized_prefix else final_export_name
    stats_file_name_prefix = f"{base_prefix}_prediction_stats"
    yearly_area_file_name_prefix = f"{base_prefix}_yearly_urban_area"

    result: Dict[str, Any] = {
        "country": country,
        "aoi_geojson": aoi_geojson,
        "project": project,
        "training_year": map_year,
        "year_start": year_start,
        "year_end": year_end,
        "threshold": threshold,
        "export_name": final_export_name,
        "export_started": False,
        "export_target": "gcs_tables",
        "gcs_bucket": gcs_bucket,
        "gcs_prefix": normalized_prefix or None,
        "stats_file_name_prefix": stats_file_name_prefix,
        "yearly_area_file_name_prefix": yearly_area_file_name_prefix,
    }

    metrics_for_export: Dict[str, Any] = {
        "training_accuracy": None,
        "validation_accuracy": None,
        "validation_kappa": None,
        "training_confusion_matrix": None,
        "validation_confusion_matrix": None,
    }

    # Optional diagnostics (best-effort)
    try:
        result["training_samples"] = training_set.size().getInfo()
        result["validation_samples"] = validation_set.size().getInfo()
        result["filtered_training_samples"] = filtered_collection.size().getInfo()
    except Exception:
        pass

    # Model diagnostics (best-effort)
    try:
        filtered_validation_set = validation_set.filter(binary_filter)
        validation_classified = filtered_validation_set.classify(classifier)
        training_confusion = classifier.confusionMatrix()
        validation_confusion = validation_classified.errorMatrix("b1", "classification")

        training_accuracy = training_confusion.accuracy().getInfo()
        validation_accuracy = validation_confusion.accuracy().getInfo()
        validation_kappa = validation_confusion.kappa().getInfo()
        training_confusion_matrix = training_confusion.getInfo()
        validation_confusion_matrix = validation_confusion.getInfo()

        metrics_for_export = {
            "training_accuracy": training_accuracy,
            "validation_accuracy": validation_accuracy,
            "validation_kappa": validation_kappa,
            "training_confusion_matrix": json.dumps(training_confusion_matrix),
            "validation_confusion_matrix": json.dumps(validation_confusion_matrix),
        }

        result["metrics"] = {
            "training_accuracy": training_accuracy,
            "validation_accuracy": validation_accuracy,
            "validation_kappa": validation_kappa,
            "training_confusion_matrix": training_confusion_matrix,
            "validation_confusion_matrix": validation_confusion_matrix,
        }
    except Exception:
        pass

    stats_properties = {
        "country": country or "",
        "project": project or "",
        "training_year": map_year,
        "year_start": year_start,
        "year_end": year_end,
        "threshold": threshold,
        "sample_points": sample_points,
        "sample_scale": sample_scale,
        "embedding_scale": embedding_scale,
        "trees": trees,
        "seed": seed,
        "training_samples": training_set.size(),
        "validation_samples": validation_set.size(),
        "filtered_training_samples": filtered_collection.size(),
        "training_accuracy": metrics_for_export["training_accuracy"],
        "validation_accuracy": metrics_for_export["validation_accuracy"],
        "validation_kappa": metrics_for_export["validation_kappa"],
        "training_confusion_matrix": metrics_for_export["training_confusion_matrix"],
        "validation_confusion_matrix": metrics_for_export["validation_confusion_matrix"],
    }

    stats_feature_collection = ee.FeatureCollection([ee.Feature(None, stats_properties)])

    # Build yearly urban-area features using the shared aggregation helper (Step 1)
    yearly_area_features = []
    for year, year_name in zip(year_list, year_names):
        area_image = (
            ee.Image.pixelArea()
            .updateMask(output_image.select(year_name))
            .rename("area")
        )
        urban_area_m2 = aggregate_regional_stats(
            image=area_image,
            geometry=boundary_geometry,
            scale=10,
        )
        yearly_area_features.append(
            ee.Feature(
                None,
                {
                    "country": country or "",
                    "year": year,
                    "urban_area_m2": ee.Number(urban_area_m2),
                },
            )
        )

    yearly_area_collection = ee.FeatureCollection(yearly_area_features)

    # Initialise tracking dicts – populated below per requested format.
    task_ids: Dict[str, Any] = {}
    task_states: Dict[str, Any] = {}
    task_descriptions: Dict[str, Any] = {}

    if classifier_export_task:
        classifier_status = classifier_export_task.status()
        task_ids["classifier_export"] = classifier_status.get("id")
        task_states["classifier_export"] = classifier_status.get("state")
        task_descriptions["classifier_export"] = classifier_status.get("description")

    # CSV export – runs when explicitly requested or when no formats are specified (fallback).
    if not export_formats or any(fmt.lower() == "csv" for fmt in export_formats):
        stats_task = export_table_to_gcs(
            collection=stats_feature_collection,
            description=f"{final_export_name}_prediction_stats",
            bucket=gcs_bucket,
            filename_prefix=stats_file_name_prefix,
        )
        yearly_area_task = export_table_to_gcs(
            collection=yearly_area_collection,
            description=f"{final_export_name}_yearly_urban_area",
            bucket=gcs_bucket,
            filename_prefix=yearly_area_file_name_prefix,
        )
        stats_status = stats_task.status()
        yearly_area_status = yearly_area_task.status()
        task_ids["prediction_stats"] = stats_status.get("id")
        task_ids["yearly_urban_area_csv"] = yearly_area_status.get("id")
        task_states["prediction_stats"] = stats_status.get("state")
        task_states["yearly_urban_area_csv"] = yearly_area_status.get("state")
        task_descriptions["prediction_stats"] = stats_status.get("description")
        task_descriptions["yearly_urban_area_csv"] = yearly_area_status.get("description")

    # Optional GeoJSON export.
    if export_formats and any(fmt.lower() == "geojson" for fmt in export_formats):
        stats_geojson_prefix = f"{stats_file_name_prefix}_geojson"
        yearly_area_geojson_prefix = f"{yearly_area_file_name_prefix}_geojson"
        stats_geojson_task = export_vector_to_gcs(
            collection=stats_feature_collection,
            description=f"{final_export_name}_prediction_stats_geojson",
            bucket=gcs_bucket,
            filename_prefix=stats_geojson_prefix,
        )
        yearly_area_geojson_task = export_vector_to_gcs(
            collection=yearly_area_collection,
            description=f"{final_export_name}_yearly_urban_area_geojson",
            bucket=gcs_bucket,
            filename_prefix=yearly_area_geojson_prefix,
        )
        stats_geojson_status = stats_geojson_task.status()
        yearly_area_geojson_status = yearly_area_geojson_task.status()
        task_ids["prediction_stats_geojson"] = stats_geojson_status.get("id")
        task_ids["yearly_urban_area_geojson"] = yearly_area_geojson_status.get("id")
        task_states["prediction_stats_geojson"] = stats_geojson_status.get("state")
        task_states["yearly_urban_area_geojson"] = yearly_area_geojson_status.get("state")
        task_descriptions["prediction_stats_geojson"] = stats_geojson_status.get("description")
        task_descriptions["yearly_urban_area_geojson"] = yearly_area_geojson_status.get("description")
        result["stats_geojson_prefix"] = stats_geojson_prefix
        result["yearly_area_geojson_prefix"] = yearly_area_geojson_prefix

    # Optional GeoTIFF export.
    if export_formats and any(fmt.lower() == "geotiff" for fmt in export_formats):
        geotiff_file_name_prefix = f"{base_prefix}_urban_extent"
        geotiff_task = export_image_to_gcs(
            image=output_image,
            description=f"{final_export_name}_urban_extent_geotiff",
            bucket=gcs_bucket,
            filename_prefix=geotiff_file_name_prefix,
            scale=10,
            region=boundary_geometry,
        )
        geotiff_status = geotiff_task.status()
        task_ids["urban_extent_geotiff"] = geotiff_status.get("id")
        task_states["urban_extent_geotiff"] = geotiff_status.get("state")
        task_descriptions["urban_extent_geotiff"] = geotiff_status.get("description")
        result["geotiff_file_name_prefix"] = geotiff_file_name_prefix

    result.update(
        {
            "export_started": True,
            "task_ids": task_ids,
            "task_states": task_states,
            "task_descriptions": task_descriptions,
        }
    )

    return result
