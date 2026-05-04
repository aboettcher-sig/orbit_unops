# `pipeline/sdg_lib/` — Engineering Spec

**Status:** spec only; no code committed.
**Drives:** the downstream function library that implements the
indicator computations classified in `indicators.md`.

## Goal

One library function per primary architecture letter (A–F). Each
function takes an indicator-specific config and returns either an
annual time series of indicator values per AOI or, for Architecture
B, a change map.

## Module layout

```
pipeline/
  sdg_lib/
    __init__.py
    arch_a.py        # AE-classification, annual area
    arch_b.py        # AE-classification, change map (Burns & Kennedy)
    arch_c.py        # Direct catalog aggregation
    arch_d.py        # Vector overlay + raster aggregation
    arch_e.py        # Population-weighted exposure
    arch_f.py        # Composite multi-function (composer)
    indicators/
      sdg_06_06_01.py
      sdg_11_03_01.py
      sdg_15_01_01.py
      sdg_15_03_01.py
      sdg_15_04_02.py
      sdg_11_01_01.py
      sdg_09_01_01.py
      sdg_11_06_02.py
      ...
    common/
      aoi.py
      labels.py
      validation.py
```

Each `indicators/sdg_<code>.py` is a thin config that wires up the
right architecture function with the right catalog datasets, AOI
handling, and aggregation rules. The architecture functions are
indicator-agnostic.

## Architecture A — `arch_a.py`

```python
def classify_annual_area(
    aoi: ee.FeatureCollection,
    years: range,
    label_image: ee.Image,                    # binary or multi-class label raster
    label_class_codes: list[int],             # which label codes are the target class
    classifier_factory: Callable,             # default: smileRandomForest(numberOfTrees=200)
    embedding_scale: int = 10,
    sampling_strategy: dict = {"stable": 200, "change": 200},
) -> ee.FeatureCollection:
    """Returns one feature per (AOI, year) with classified area in m²."""
```

Defaults follow Burns & Kennedy 2026 (200 stable + 200 change points
per class). Classifier-factory is parameterised so any supervised
classifier in EE can be substituted. The function does **not**
hardcode random forest.

## Architecture B — `arch_b.py`

```python
def classify_change_map(
    aoi: ee.FeatureCollection,
    year_t0: int,
    year_t1: int,
    label_change_points: ee.FeatureCollection,   # labelled change/no-change points
    feature_config: Literal["stacked", "baseline+delta", "baseline+dot"],
    classifier_factory: Callable,
) -> ee.Image:
    """Returns a per-pixel change-map image for the AOI."""
```

`feature_config` selects one of Burns & Kennedy's three
baseline-preserving configurations (3, 4, or 5). Magnitude-only
configurations (1 = delta-only, 2 = dot-only) are intentionally
excluded as defaults; they are reachable only via an explicit
override flag.

## Architecture C — `arch_c.py`

```python
def aggregate_catalog(
    aoi: ee.FeatureCollection,
    years: range,
    catalog_image_collection: ee.ImageCollection,
    class_codes: list[int],                   # which catalog classes are the target class
    aggregation: Literal["area", "count", "mean"],
) -> ee.FeatureCollection:
    """Returns one feature per (AOI, year) with the aggregation result."""
```

The simplest function in the library: parameterised by catalog
asset ID, AOI, year range, and class set.

## Architecture D — `arch_d.py`

```python
def overlay_aggregate(
    aoi: ee.FeatureCollection,
    years: range,
    vector_layer: ee.FeatureCollection,
    buffer_m: float,                          # 0 if no buffer
    weight_image: ee.Image | None,            # e.g., WorldPop; None = pure area
    aggregation: Literal["area", "weighted_sum", "weighted_mean"],
) -> ee.FeatureCollection:
    """Rasterise vector_layer; buffer; intersect with weight_image; aggregate per AOI per year."""
```

## Architecture E — `arch_e.py`

```python
def population_weighted_exposure(
    aoi: ee.FeatureCollection,
    years: range,
    exposure_image_collection: ee.ImageCollection,   # PM2.5, NTL, etc.
    population_image_collection: ee.ImageCollection, # WorldPop
    threshold: float | None,                  # None = mean; threshold = exceedance count
) -> ee.FeatureCollection:
    """Population-weighted mean exposure or population above threshold."""
```

## Architecture F — `arch_f.py`

```python
def compose(
    aoi: ee.FeatureCollection,
    years: range,
    sub_indicators: list[Callable],           # each returns ee.FeatureCollection
    composition_rule: Literal["one_out_all_out", "weighted", "min", "max"],
    weights: list[float] | None = None,
) -> ee.FeatureCollection:
    """Run sub-indicator functions and compose per the rule (e.g., UNCCD one-out-all-out for 15.3.1)."""
```

## Common utilities — `common/`

- `aoi.py`: AOI loading from country code, GADM admin level, GHSL
  city polygon, KBA polygon, etc.
- `labels.py`: catalog-label sampling helpers, with stratified-by-
  homogeneity-neighbourhood sampling (mitigates spatial-support
  mismatch).
- `validation.py`: confusion matrix, accuracy, Kappa,
  user's/producer's accuracy, plus visual-diagnostic helpers per
  Burns & Kennedy 2026.

## Per-indicator config files — `indicators/sdg_*.py`

Each file declares:

```python
INDICATOR = {
    "code": "11.3.1",
    "name": "Land consumption rate to population growth rate",
    "custodian": "UN-Habitat",
    "architecture": "A",
    "labels": [
        {"asset": "JRC/GHSL/P2023A/GHS_BUILT_S", "class_codes": [...], "year_map": {...}},
        {"asset": "ESA/WorldCover/v200", "class_codes": [50], "year_map": {2021: 2021}},
    ],
    "ancillary": [
        {"asset": "WorldPop/GP/100m/pop", "role": "population_denominator"},
    ],
    "aoi_handler": "ghsl_city_or_country",
    "report_cadence": "annual",
}
```

The architecture functions consume this config — no architecture-
function code is indicator-specific.

## Validation discipline

Per Burns & Kennedy 2026, every implemented indicator must:

1. Report quantitative metrics (overall accuracy, Kappa,
   user's/producer's per-class).
2. Produce a visual diagnostic (annual classified-area map, change
   map where applicable).
3. Document spatial-support mismatch where label resolution is
   coarser than 10 m.
4. Document label-provenance circularity where labels derive from
   the same imagery feeding AE.
5. Document threshold choices (continuous → discrete) where applicable.

A `validation_report.md` template lives under each indicator config.

## What this spec does not cover

- Concurrency / parallel run management. EE handles asynchronous
  task submission; the existing `pipeline/api.py` provides the
  outer wrapping.
- Caching of intermediate results.
- A web interface beyond `pipeline/api.py`'s current FastAPI surface.

## Build order

1. `arch_a.py` (highest priority — already partly implemented in
   `pipeline/main.py` for 11.3.1; refactor into the library).
2. `arch_c.py` (cheapest; covers 6.4.2, 6.6.1-alternative,
   15.1.1-alternative).
3. `arch_d.py` (covers the largest count of OUT→D indicators).
4. `arch_e.py` (covers 7.1.1 and 11.6.2).
5. `arch_f.py` (composer; consumes outputs of A–E).
6. `arch_b.py` (lowest priority — Burns & Kennedy regime is
   theoretically motivated but only 11.5.3 is queued for it now).
