# Methodology — SDG × GEE Architecture Screen

**Study ID:** `02_sdg_gee_architecture_screen`
**Status:** in progress
**Started:** 2026-04-28

## Purpose

Comprehensively classify all 232 unique indicators of the post-2025-review
UN SDG Global Indicator Framework against a seven-letter taxonomy of
GEE-resident architectures, regardless of whether AlphaEarth (AE)
embeddings are involved. The deliverable is a coverage map of which
indicators are tractable on Google Earth Engine + GCP under *some*
architecture and which are not, plus a primary architecture letter per
indicator that becomes the spec for a downstream `pipeline/sdg_lib/`
function library.

## Relationship to Study 01

Study 01 (`../01_sdg_alphaearth_screen/`) tests strict AE-classification
feasibility (criteria C1–C5). It is a narrow methodological screen that
grounds the demonstrated AE pipeline (`pipeline/main.py` for SDG 11.3.1).

Study 02 is broader and operationally framed: AE-classification is one
of seven architecture letters, not the test. An indicator that fails
Study 01's C1–C5 may be in scope here under a different letter.

## Architecture taxonomy

| Letter | Architecture | Primitive | Indicator-value form |
|--------|--------------|-----------|----------------------|
| **A** | AE-classification, annual area | Per-pixel supervised classification of `GOOGLE/SATELLITE_EMBEDDING/V1/ANNUAL` using a catalog dataset as training labels; aggregate classified pixels per AOI per year. | Annual area (or area ratio, or change in area) of a discrete class. |
| **B** | AE-classification, change map (Burns & Kennedy regime) | Single change-detection classifier on a baseline-preserving feature derived from two AE annual embeddings (Burns & Kennedy 2026 configs 3–5: stacked, baseline+delta, baseline+dot product). | Per-pixel change map; counts/area of change. |
| **C** | Direct catalog aggregation (no re-classification) | Sum, threshold, or aggregate an existing discrete-class catalog product per AOI per year. AE adds no value because the catalog product is already authoritative. | Annual area, area ratio, or thresholded count from an existing product. |
| **D** | Vector overlay + raster aggregation | Rasterise vector layer(s); intersect with a raster (often population); aggregate per AOI. | Population proportion, area proportion, or count, derived from a buffer/overlay. |
| **E** | Population-weighted exposure | Continuous raster (PM2.5, NTL, model output) × population raster; aggregate per AOI. | Population-weighted mean, exposure proportion, or threshold-exceedance count. |
| **F** | Composite multi-function | Custodian methodology specifies multiple sub-indicators combined under a one-out-all-out, weighted, or hierarchical rule. Each sub-indicator uses one of A–E. | Composite verdict or weighted score. |
| **G** | Out of scope under any GEE architecture | Survey-, admin-, legislation-, finance-, or census-derived. No plausible EO/GEE primitive. | n/a |

### Notes on letter boundaries

- **A vs C:** A is justified when no global catalog product exists at
  the indicator's required spatial/temporal/class resolution, *or* when
  local label customisation matters more than catalog-default class
  schemas. C is the right choice when an authoritative global product
  (e.g., Hansen GFC, JRC GSW, ESA WorldCover) already provides the
  classified output the indicator needs and re-classification adds
  nothing. Many indicators admit both paths; the *primary* letter is
  the one matching typical national reporting practice.
- **A vs B:** Same primitive (AE classification) but different feature
  framing. A produces an annual area time series; B produces a change
  map. Use B when the indicator deliverable is "where did class change"
  rather than "how much class is there."
- **D vs E:** D is buffer/overlay of *vector* layers with a raster
  (e.g., 2 km buffer of roads × WorldPop). E is raster-on-raster
  population weighting (e.g., PM2.5 × WorldPop). Where both apply
  (e.g., transit catchment polygons × WorldPop), the primary letter is
  the more visible primitive in the custodian methodology.
- **F:** assigned when the custodian methodology *itself* is a
  composite (e.g., SDG 15.3.1's one-out-all-out rule across LULC change,
  productivity, and SOC). Do not assign F merely because an indicator
  has a numerator and denominator from different sources.

## Screening procedure

For each indicator:

1. Read the official indicator text (from `../01_sdg_alphaearth_screen/indicators_master.md`).
2. Read or recall the custodian methodology where the indicator's
   measurement target is not unambiguous from the title.
3. Identify the dominant primitive needed to compute the indicator
   value.
4. Assign the *primary* architecture letter.
5. Where two letters could apply (e.g., 15.1.1 by A or C), record the
   primary letter and note the alternative.
6. For F: list the per-component letters.
7. For G: state the reason (survey / admin / legislation / finance /
   census / institutional / vital statistics) so the verdict is
   inspectable.

## Out-of-scope for this study

- Operational deployment of `pipeline/sdg_lib/`.
- Per-architecture engineering specs (deferred to `library_spec.md`).
- Statistical power, sample-size, and accuracy expectations per
  indicator.
- Per-indicator long-form writeups; this study produces the screen and
  primary letter assignments. Long-form writeups for in-scope
  Architecture-A indicators live in Study 01's `candidates/`.

## Reproducibility

The indicator spine, AE catalog page, GEE official catalog index, and
Awesome GEE Community Catalog are anchored to the same canonical sources
listed in `../01_sdg_alphaearth_screen/methodology.md` and (eventually)
`../01_sdg_alphaearth_screen/references.md`. Architecture-letter
assignments cite the custodian methodology where the dominant primitive
is non-obvious.
