# Study 02 — SDG × GEE Architecture Screen

**Status: in progress (started 2026-04-28).** Runs in parallel with
Study 01 (`../01_sdg_alphaearth_screen/`). Study 01 applies a strict
AE-classification screen; this study assigns every indicator a primary
GEE architecture letter regardless of whether AE is involved.

## Premise

Study 01 evaluates SDG indicators against a single architecture: per-pixel
classification of AlphaEarth annual embeddings using GEE catalog
datasets as training masks. Many indicators are tractable on GEE under
a *different* architecture — for example, 9.1.1 (rural population within
2 km of an all-season road) is a buffer-and-aggregate computation over
WorldPop and OSM/GRIP roads, not a classification problem. Study 02
systematises this by classifying every SDG indicator under the
architecture taxonomy below.

## Architecture taxonomy (working draft)

| Letter | Architecture | Primitive | Example indicators |
|--------|--------------|-----------|---------------------|
| A | AE-classification, annual area | per-pixel supervised classification of AE embedding → annual area aggregation | 11.3.1, 15.1.1 (built from labels), 15.4.2(b) |
| B | AE-classification, change map (Burns & Kennedy regime) | single change classifier on baseline-preserving AE features (configs 3–5 of Burns & Kennedy 2026) | candidates where the deliverable is "where did class change," not "how much class is there" |
| C | Direct catalog aggregation, no re-classification | sum/threshold a catalog product's discrete classes per AOI per year | 6.6.1 with JRC GSW; 15.1.1 with Hansen GFC if the product is accepted as authoritative |
| D | Vector overlay + raster aggregation | rasterise vector layer(s); intersect with raster (often population); aggregate per AOI | 9.1.1 (WorldPop + OSM/GRIP), 14.5.1 (MPA × EEZ), 15.1.2 / 15.4.1 (KBA × WDPA) |
| E | Population-weighted exposure | continuous raster × population raster, aggregated per AOI | 11.6.2 (PM2.5 × WorldPop), 11.2.1 (transit catchment × WorldPop) |
| F | Composite multi-function | custodian methodology specifies multiple sub-indicators combined under a one-out-all-out or weighted rule | 15.3.1 (LULC change ⊕ NDVI productivity ⊕ SOC) |
| G | Out of scope under any GEE architecture | survey-, admin-, legislation-, finance-derived; no plausible EO architecture | most of Goals 4, 5, 16, 17 |

## Deliverables (planned)

- `methodology.md` — taxonomy definitions, screening procedure, criteria
  for assigning a primary architecture letter, treatment of indicators
  that fit more than one architecture.
- `indicators.md` — all 232 unique indicators with primary architecture
  letter and one-line reasoning.
- `candidates/<arch>/<indicator>.md` — per-indicator implementation
  notes organised by architecture letter.
- `library_spec.md` — engineering spec for the downstream
  `pipeline/sdg_lib/` function library: one function per primary
  architecture; indicator-specific config wires up the right catalog
  datasets, AOI handling, AE bands (where applicable), aggregation
  rules, and ancillary-data dependencies.

## Carry-overs from Study 01

Study 01's screen identified the following indicators as out of scope
for the AE-classification architecture but tractable under another
GEE architecture; they receive a primary architecture letter in this
study's `indicators.md`:

| Indicator | Letter | Note |
|---|---|---|
| 1.4.2 | D | Tenure-rights cadastral overlay (research-stage; custodian methodology is survey-primary) |
| 5.a.1 | D | Women's land ownership cadastral × sex (research-stage) |
| 6.4.2 | C | Water stress modelled withdrawal/availability per basin |
| 7.1.1 | E | Electricity access via VIIRS night-lights × WorldPop |
| 9.1.1 | D | Rural population within 2 km road (WorldPop + OSM/GRIP) |
| 11.2.1 | D | Public transport access (WorldPop + transit catchment) |
| 11.5.3 | B | Damage to critical infrastructure (Burns & Kennedy change-map regime; proxy) |
| 11.6.2 | E | PM2.5 in cities × WorldPop |
| 13.2.2 | C | GHG emissions (research-stage; custodian methodology is national inventory) |
| 14.1.1 | F | Coastal eutrophication (a) + plastic debris (b); (a) is C-tractable today |
| 14.5.1 | D | MPA × marine area vector overlay |
| 15.1.2 | D | KBA × WDPA terrestrial vector overlay |
| 15.4.1 | D | KBA mountain × WDPA |

## Out-of-scope for this study

Operational deployment of the `pipeline/sdg_lib/` library is downstream
of Study 02. Study 02 produces the screen and the library spec; the
library itself is built against that spec in a separate workstream.
