# Methodology — SDG × AlphaEarth Screening Study

**Study ID:** `01_sdg_alphaearth_screen`
**Status:** in progress
**Last updated:** 2026-04-28

## Purpose

Comprehensively screen all 169 indicators of the UN SDG Global Indicator
Framework against a single architecture — annual per-pixel classification of
Google's AlphaEarth Satellite Embeddings — to identify the subset of
indicators for which interannual change in classified land-surface area is a
defensible measurement, and for which a Google Earth Engine catalog dataset
(official catalog or Awesome GEE Community Catalog) can supply training
labels.

## Reference architecture

The architecture is the one demonstrated in `pipeline/main.py` for SDG 11.3.1
(land consumption rate). Core elements:

1. **Input stack:** `GOOGLE/SATELLITE_EMBEDDING/V1/ANNUAL` — annual mosaics of
   64-band per-pixel embedding vectors at ~10 m resolution.
2. **Training labels:** an external raster product, queried at sample point
   locations within an AOI, defining one or more discrete classes for the
   indicator's target land-surface phenomenon.
3. **Classifier:** any supervised pixel-level classifier operating on the
   64-band embedding vector. The demonstrated case uses
   `ee.Classifier.smileRandomForest`; gradient boosting, k-NN, shallow neural
   nets, and other supervised classifiers available in or callable from EE
   are equally admissible.
4. **Inference:** apply the trained classifier to each annual embedding image
   in the reporting period.
5. **Aggregation:** sum classified pixel area per AOI per year, producing an
   annual time series.
6. **Indicator value:** the indicator is — or directly derives from — the
   annual area, the change in annual area, or a ratio in which annual area is
   the numerator or denominator (e.g., land consumption rate ÷ population
   growth rate for 11.3.1).

## Screening criteria

An SDG indicator is **in scope** only if **all five** of the following hold.

| # | Criterion | Test |
|---|-----------|------|
| C1 | Discrete-class target | The indicator target can be defined as one or more discrete land-surface classes (binary or multi-class). Continuous biophysical variables, counts, indices derived from non-EO sources, and survey-based statistics are excluded. |
| C2 | Embedding-encodable signal | Class membership is plausibly encoded in AlphaEarth annual embeddings. AE embeddings are derived from optical, SAR, thermal, and elevation inputs at ~10 m, so phenomena visible in those modalities are candidates; phenomena requiring sub-10 m structure, spectral bands AE excludes, or non-EO information are not. |
| C3 | Annual cadence acceptable | The custodian methodology accepts or expects updates at annual or coarser cadence. Indicators whose official methodology requires monthly, weekly, or sub-annual reporting are out of scope unless an annual aggregate is also acceptable. |
| C4 | Area-derived value | The indicator value is, or directly derives from, the area (or area ratio, or change in area) of the discrete class within the AOI. |
| C5 | Catalog label availability with AE temporal overlap | At least one dataset in the GEE official catalog or the Awesome GEE Community Catalog can supply training labels for the target class, **and** that dataset has at least one year of coverage that overlaps AlphaEarth's annual coverage (currently 2017–2024; verify against catalog page). |

Indicators that depend on **ancillary non-EE data only as a denominator or
contextual divisor** (the way 11.3.1 uses population for the
land-consumption-rate-to-population-growth-rate ratio) remain in scope; the
ancillary dependency is recorded but does not disqualify the indicator. The
classification step itself, however, must run entirely on AE embeddings with
catalog-derived labels.

## Verdict taxonomy

- **In scope** — passes C1–C5 with no significant caveats. Full per-candidate
  file written under `candidates/`.
- **Partial** — passes C1–C4 but fails C5 (no catalog-resident label source
  with AE temporal overlap), or passes C5 with significant caveats (e.g.,
  label dataset is a single static year, label classes only partially align
  with the indicator target, or AE coverage covers only the tail of the
  indicator's reporting period). Documented with reasoning; revisitable if a
  new catalog dataset becomes available.
- **Out of scope** — fails one or more of C1–C4 in a way that no catalog
  dataset could remedy. Single-line entry in the master table.

## Search procedure

The screen proceeds indicator by indicator against the canonical inputs:

1. **Spine:** the UN Global Indicator Framework as published by the UN
   Statistics Division, taken as the authoritative list of 17 goals, 169
   indicators, custodian agencies, and tier classification at the time of
   this study.
2. **Indicator metadata:** for each indicator, the custodian's published
   methodology document (the per-indicator metadata PDFs in the UN
   Statistics Division SDG Indicators Metadata Repository) is consulted to
   identify the measurement target — i.e., what is being counted, where, at
   what cadence, and at what spatial unit.
3. **Catalog label lookup:** for indicators that pass C1–C4, candidate label
   datasets are sought in the GEE Data Catalog and the Awesome GEE Community
   Catalog. For each candidate dataset the EE asset ID, documented temporal
   coverage, native resolution, and class schema are recorded. The
   "≥1-year AE overlap" test (C5) is applied against documented coverage.
4. **AE coverage anchor:** AlphaEarth temporal coverage is taken from the
   `GOOGLE/SATELLITE_EMBEDDING/V1/ANNUAL` catalog page at the time of the
   study and recorded in `references.md`.

## Treatment of AE-utility prior literature

Where peer-reviewed studies, preprints, or technical blog posts assess the
performance of AE embeddings against task-specific products already in the
GEE catalog (e.g., AE-classified built-up area vs. GHSL; AE-classified
forest vs. Hansen GFC; AE-classified surface water vs. JRC GSW), those
findings are summarised in `literature.md` and cited per candidate where
they bear on feasibility.

### Burns & Kennedy (2026) — change-detection feature design

Burns and Kennedy (Oregon State eMapR Lab; Google Earth Medium,
13 April 2026) compare five ways of structuring AE annual embeddings as
features for change-detection classifiers:

1. **Delta only** — pixel-wise difference between two annual embeddings.
2. **Dot product only** — a single similarity scalar between two annual
   embeddings.
3. **Stacked embeddings** — concatenation of two (or more) annual
   embedding vectors.
4. **Baseline + delta** — the baseline-year embedding alongside the
   interannual difference.
5. **Baseline + dot product** — the baseline-year embedding alongside a
   similarity scalar.

Key findings adopted as methodological defaults for this study:

- **Aggregate metrics conceal spatially important differences.** Two
  feature configurations can post similar overall accuracy or Kappa while
  producing visibly different spatial structure. Per-candidate work
  therefore reports both quantitative metrics and visual/spatial
  diagnostics.
- **Baseline-preserving representations (configs 3–5) outperform
  magnitude-only representations (configs 1–2) on spatial coherence.**
  Delta-only and dot-product-only fragment in heterogeneous landscapes;
  baseline-anchored representations yield coherent, interpretable change
  maps.
- **Modest, balanced training sets suffice.** ~200 stable + 200 change
  training points per class was sufficient; larger training sets did not
  reliably improve spatial coherence. Sampling design matters more than
  sample size.

### Implication for the reference architecture

The pipeline demonstrated for SDG 11.3.1 in `pipeline/main.py` classifies
each annual embedding **independently** and derives change from differences
in *classified area*. This is appropriate for indicators in which the
indicator value is an annual *area* time series (and change is computed by
the indicator's own formula on the area trajectory). For indicators in
which the indicator value is a *change map* — i.e., where the deliverable
is "where did class X gain or lose ground between year t₀ and year t₁" —
Burns & Kennedy's findings argue for fitting a single change-detection
classifier on a baseline-preserving change feature (config 3, 4, or 5)
rather than differencing two independent annual classifications. Each
in-scope candidate writeup specifies which of the two regimes applies and
which feature configuration is recommended.

## Out-of-scope for this study

This screen establishes **feasibility only**. It does not assess:

- Statistical power, training-sample size requirements, or expected
  classification accuracy per indicator.
- Operational cost on EE.
- Validation strategy in detail beyond noting candidate validation datasets.
- Indicator-level reporting protocols beyond the custodian methodology cited.

Each in-scope candidate is therefore a *recommendation to develop a study*,
not a finished implementation plan.

## Reproducibility

All canonical inputs (UN indicator list, AE catalog page, EE official
catalog entries, community catalog entries, literature) are cited in
`references.md` with retrieval URLs and the date of access. Where a
catalog's documented temporal range could not be verified live during the
screen, the entry is marked `[unverified]` rather than asserted.
