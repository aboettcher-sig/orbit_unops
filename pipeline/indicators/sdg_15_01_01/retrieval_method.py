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
    return {
        "status": "success",
        "indicator": "15.1.1",
        "country": country,
        "aoi_geojson": aoi_geojson,
        "map_year": map_year,
        "year_start": year_start,
        "year_end": year_end,
        "gcs_bucket": gcs_bucket,
        "note": "Stub implementation — no EE tasks were started.",
    }
