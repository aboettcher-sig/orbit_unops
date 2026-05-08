"""Aerial/satellite embedding utilities specific to the Google embedding dataset."""

# NOTE: Functions here assume the Google Satellite Embedding V1 schema.

import ee


def embeddings_by_year(embeddings_ic: ee.ImageCollection, boundary: ee.FeatureCollection, year: int) -> ee.Image:
    """Return annual embedding mosaic for a given year and boundary."""
    return (
        embeddings_ic
        .filterDate(f"{year}-01-01", f"{year + 1}-01-01")
        .filterBounds(boundary)
        .mosaic()
    )


def generate_stratified_sample(
    image: ee.Image,
    num_points: int,
    bbox: ee.FeatureCollection,
    scale: int,
    boundary: ee.FeatureCollection,
) -> ee.FeatureCollection:
    """Return a stratified random sample clipped to a boundary.

    Args:
        image: The labelled image to sample (e.g. WSF binary mask).
        num_points: Number of points **per class** to sample.
        bbox: Bounding-box feature collection used as the sampling region.
        scale: Nominal resolution in metres used during sampling.
        boundary: The precise boundary used to filter sampled points.

    Returns:
        An ``ee.FeatureCollection`` of sample points within *boundary*.
    """
    return (
        image.stratifiedSample(
            numPoints=num_points,
            region=bbox,
            scale=scale,
            geometries=True,
        )
        .filterBounds(boundary)
    )
