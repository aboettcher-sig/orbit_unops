#!/usr/bin/env python3
"""Generic CLI entry-point for any registered SDG indicator pipeline.

Usage
-----
    python -m pipeline.main <indicator_id> --country Colombia --gcs-bucket my-bucket ...

The core Earth Engine logic lives in each indicator's retrieval_method.py.
Hyperparameter defaults are owned by each indicator's config.yaml; this CLI
passes ``None`` for any omitted override, and the retrieval method resolves
the final value from its own config.
"""

import argparse
import json
import sys
from typing import Any, Dict

if __package__:
    # Running as part of the orbit_unops package.
    from .indicators.sdg_11_03_01.v1.retrieval_method import run_11_03_01
    from .indicators.sdg_15_01_01.v1.retrieval_method import run_15_01_01
    from .indicators.sdg_06_06_01.v1.retrieval_method import run_06_06_01
    from .indicators.sdg_15_04_02.v1.retrieval_method import run_15_04_02
    from .indicators.sdg_15_03_01.v1.retrieval_method import run_15_03_01
    from .indicators.sdg_11_01_01.v1.retrieval_method import run_11_01_01
    from .utils.gee_common import get_task_status  # noqa: F401 (re-exported for api.py)
else:
    # Running directly from the pipeline/ folder.
    from indicators.sdg_11_03_01.v1.retrieval_method import run_11_03_01
    from indicators.sdg_15_01_01.v1.retrieval_method import run_15_01_01
    from indicators.sdg_06_06_01.v1.retrieval_method import run_06_06_01
    from indicators.sdg_15_04_02.v1.retrieval_method import run_15_04_02
    from indicators.sdg_15_03_01.v1.retrieval_method import run_15_03_01
    from indicators.sdg_11_01_01.v1.retrieval_method import run_11_01_01
    from utils.gee_common import get_task_status  # noqa: F401

# ---------------------------------------------------------------------------
# Indicator routing registry — mirrors api.py so both layers stay in sync.
# ---------------------------------------------------------------------------
_INDICATOR_REGISTRY: Dict[str, Any] = {
    "11.3.1": {"v1": run_11_03_01, "latest": "v1"},
    "15.1.1": {"v1": run_15_01_01, "latest": "v1"},
    "6.6.1": {"v1": run_06_06_01, "latest": "v1"},
    "15.4.2": {"v1": run_15_04_02, "latest": "v1"},
    "15.3.1": {"v1": run_15_03_01, "latest": "v1"},
    "11.1.1": {"v1": run_11_01_01, "latest": "v1"},
}


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description=(
            "Train an indicator-specific classifier and start EE table export tasks. "
            "Hyperparameter defaults are loaded from each indicator's config.yaml; "
            "only supply overrides here when needed."
        )
    )

    # ------------------------------------------------------------------
    # Required: choose which indicator to run
    # ------------------------------------------------------------------
    parser.add_argument(
        "indicator_id",
        type=str,
        choices=list(_INDICATOR_REGISTRY),
        help="SDG indicator to run, e.g. '11.3.1'",
    )
    
    parser.add_argument(
        "--version",
        type=str,
        default=None,
        help="Methodology version to run. Defaults to latest.",
    )
    
    parser.add_argument(
        "--model-asset-id",
        type=str,
        default=None,
        help="EE Asset ID of a saved ee.Classifier to use for inference",
    )

    # ------------------------------------------------------------------
    # Spatial targets
    # ------------------------------------------------------------------
    parser.add_argument(
        "--country",
        type=str,
        default=None,
        help='Country name matching GAUL ADM0_NAME, e.g. "Colombia"',
    )
    parser.add_argument(
        "--aoi-geojson",
        type=str,
        default=None,
        help="Path to a GeoJSON file describing a custom Area of Interest",
    )

    # ------------------------------------------------------------------
    # Required temporal / export arguments
    # ------------------------------------------------------------------
    parser.add_argument("--map-year", type=int, required=True, help="Reference year used for training")
    parser.add_argument("--year-start", type=int, required=True, help="Start year for output stack")
    parser.add_argument("--year-end", type=int, required=True, help="End year for output stack")
    parser.add_argument("--gcs-bucket", type=str, required=True, help="Google Cloud Storage bucket name")

    # ------------------------------------------------------------------
    # Optional overrides — if omitted, the indicator's config.yaml wins
    # ------------------------------------------------------------------
    parser.add_argument("--sample-points", type=int, default=None, help="Override: number of stratified sample points")
    parser.add_argument("--sample-scale", type=int, default=None, help="Override: scale for sampling WSF labels (m)")
    parser.add_argument("--embedding-scale", type=int, default=None, help="Override: scale for sampling embeddings (m)")
    parser.add_argument("--threshold", type=float, default=None, help="Override: probability threshold (0–1)")
    parser.add_argument("--trees", type=int, default=None, help="Override: number of Random Forest trees")
    parser.add_argument("--seed", type=int, default=None, help="Override: random seed for train/validation split")

    # ------------------------------------------------------------------
    # Other optional arguments
    # ------------------------------------------------------------------
    parser.add_argument("--project", type=str, default=None, help="GCP project for ee.Initialize(project=...)")
    parser.add_argument("--export-name", type=str, default=None, help="Optional export name (auto-generated if omitted)")
    parser.add_argument("--gcs-prefix", type=str, default=None, help="Optional GCS prefix/folder path")

    return parser


def main() -> None:
    parser = build_parser()
    args = parser.parse_args()

    # Parse optional AOI GeoJSON from file path
    aoi_geojson = None
    if args.aoi_geojson:
        with open(args.aoi_geojson, "r") as f:
            aoi_geojson = json.load(f)

    if not args.country and not aoi_geojson:
        parser.error("At least one of --country or --aoi-geojson must be provided.")

    # Build kwargs; None values are intentional — the retrieval method resolves
    # them from its own config.yaml.
    run_kwargs: Dict[str, Any] = {
        "country": args.country,
        "aoi_geojson": aoi_geojson,
        "map_year": args.map_year,
        "year_start": args.year_start,
        "year_end": args.year_end,
        "gcs_bucket": args.gcs_bucket,
        "sample_points": args.sample_points,
        "sample_scale": args.sample_scale,
        "embedding_scale": args.embedding_scale,
        "threshold": args.threshold,
        "trees": args.trees,
        "seed": args.seed,
        "project": args.project,
        "export_name": args.export_name,
        "gcs_prefix": args.gcs_prefix,
        "model_asset_id": args.model_asset_id,
    }

    registry_entry = _INDICATOR_REGISTRY[args.indicator_id]
    version = args.version
    if not version or version == "latest":
        version = registry_entry["latest"]
        
    if version not in registry_entry:
        parser.error(f"Version '{version}' not found for indicator '{args.indicator_id}'.")
        
    indicator_fn = registry_entry[version]
    result = indicator_fn(**run_kwargs)
    print(json.dumps(result, indent=2))


if __name__ == "__main__":
    try:
        main()
    except Exception as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        sys.exit(1)