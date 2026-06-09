"""SDG 15.1.1 — Forest area as a proportion of total land area.

NOTE: This is a scaffold / routing-proof stub.  Replace the body of
``run_15_01_01`` with real Earth Engine logic when the indicator is
ready for implementation.
"""

from typing import Any, Dict, Optional


def run_15_01_01(
    map_year: int,
    year_start: int,
    year_end: int,
    gcs_bucket: str,
    country: Optional[str] = None,
    aoi_geojson: Optional[Dict[str, Any]] = None,
    **kwargs: Any,
) -> Dict[str, Any]:
    """Stub implementation – returns a mock success payload.

    This proves that the API routing layer correctly dispatches
    requests with ``indicator_id == '15.1.1'`` to this function.
    Replace with real Earth Engine retrieval logic.
    """
    # -----------------------------------------------------------------------
    # Implementation Note:
    # When implementing the Earth Engine logic, use the shared utilities:
    # 
    # From `utils.gee_common` (Export & EE Tools):
    # - export_table_to_gcs()  -> For CSV stats
    # - export_vector_to_gcs() -> For GeoJSON polygons
    # - export_image_to_gcs()  -> For GeoTIFF maps
    #
    # From `utils.ae_specific` (AlphaEarth Core):
    # - embeddings_by_year()         -> To filter AE embeddings
    # - generate_stratified_sample() -> For ML training points
    # 
    # See `sdg_11_03_01/retrieval_method.py` for a complete working example.
    # -----------------------------------------------------------------------
    return {
        "status": "success",
        "indicator": "15.1.1",
        "country": country,
        "aoi_geojson": aoi_geojson,
        "map_year": map_year,
        "year_start": year_start,
        "year_end": year_end,
        "gcs_bucket": gcs_bucket,
        "note": "Stub implementation for SDG 15.1.1 — no EE tasks were started.",
    }
