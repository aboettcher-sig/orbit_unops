# Study 01 — SDG × AlphaEarth Annual Classification Feasibility Screen

**Status:** screen complete; per-candidate writeups complete; library
implementation pending.
**Authored:** 2026-04-28.

## Question

Of the 232 unique indicators of the post-2025-Comprehensive-Review UN
SDG Global Indicator Framework, which are amenable to per-pixel
supervised classification of `GOOGLE/SATELLITE_EMBEDDING/V1/ANNUAL`
(AlphaEarth annual embeddings) using GEE catalog datasets as training
labels, with the indicator value derived from annual classified-area
aggregation?

The reference architecture is the one demonstrated in
`pipeline/main.py` for SDG 11.3.1.

## Method (one paragraph)

Five binary screening criteria (C1–C5 in `methodology.md`) — discrete
class target, AE-encodable signal, annual cadence, area-derived
value, catalog label dataset with ≥ 1-year overlap with AE. Indicators
that pass all five are IN; that pass C1–C4 with a significant caveat
on C5 are PARTIAL; otherwise OUT. Indicators that fail Study 01 but
are tractable on GEE under another architecture are flagged for
Study 02. Burns & Kennedy 2026's findings on change-detection feature
design inform per-candidate regime choice.

## Findings

| Verdict | Count | Indicators |
|---|---|---|
| **IN** | **6** (or 7 with sub-components split) | 6.6.1, 11.1.1 (proxy), 11.3.1, 15.1.1, 15.3.1 (LULC sub-indicator), 15.4.2 (a) Mountain Green Cover Index + (b) proportion of degraded mountain land |
| **PARTIAL** | **5** | 2.4.1, 6.3.2, 11.7.1, 14.1.1, 15.2.1 |
| **OUT → carry to Study 02** | ~12 | 1.4.2, 5.a.1 (potential), 6.4.2, 7.1.1, 9.1.1, 11.2.1, 11.5.3, 11.6.2, 13.2.2 (research-stage), 14.5.1, 15.1.2, 15.4.1 |
| **OUT-A** | ~209 | All Goals 3, 4, 5, 8, 10, 12, 16, 17 in full; remainder of 1, 2, 6, 7, 9, 11, 13, 14, 15 |

The full, indicator-by-indicator screen is in `indicators.md`. Each
IN and PARTIAL indicator has a candidate writeup in `candidates/`.
Cross-architecture coverage (the broader question — how much of the
SDG framework is monitorable on GEE+GCP under any architecture) is
addressed in Study 02 (`../02_sdg_gee_architecture_screen/`); that
study finds ~23 indicators with a defensible primary GEE architecture
across A–F.

## Recommended priority order for implementation

1. **11.3.1** — already demonstrated in `pipeline/main.py`. Operational
   baseline; treat as the methodological anchor for evaluating
   subsequent candidates.
2. **15.1.1** — large literature, multiple high-quality catalog
   labels (Hansen, JRC GFC2020, ESA WorldCover, JAXA FNF4). Run
   side-by-side AE-classification (A) vs Hansen-thresholded (C) to
   characterise the discrepancy.
3. **6.6.1** — strong literature anchor (Narran Lake AE-wetland paper,
   *Remote Sensing* 18(2):293, 2026). Strong catalog labels for
   open-water classes (JRC GSW); weaker for vegetated wetland.
4. **15.4.2(a)+(b)** — small AOI (mountain mask only), simpler class
   schema (green / non-green; degraded / not-degraded). Good first
   end-to-end test of the multi-class regime.
5. **15.3.1 (LULC sub-indicator)** — substantial label-mapping work
   needed (UNCCD class aggregation); meaningful only when
   sub-indicators 2 and 3 (productivity, SOC) are available via
   Study 02. Defer behind 15.1.1.
6. **11.1.1** — proxy framing requires careful documentation; label
   dataset (WSF Deprived Area) coverage is limited. Run as a pilot
   in cities where IDEAMAPS reference data exist.

## Open methodological tensions surfaced by this screen

1. **Architecture A vs Architecture C overlap.** For 15.1.1 and 6.6.1
   in particular, a global catalog product (Hansen GFC; JRC GSW)
   already provides the indicator's classified output. AE
   re-classification is justified only by specific value-adds:
   annual cadence vs epoch cadence, local label customisation,
   sub-pixel improvement at 10 m. Decide per-AOI which axis matters.
2. **Label-provenance circularity.** Dynamic World, ESA WorldCover,
   JRC GFC2020 are Sentinel-2 reflectance derivatives. AE includes
   Sentinel-2 among inputs. Using these as labels for AE
   classification distils existing classifiers rather than providing
   independent supervision. Independent labels (Hansen — Landsat;
   JAXA FNF4 — L-band SAR) are preferable when available.
3. **Spatial-support mismatch.** Most strong label datasets are at
   30 m or 100 m. Used as labels for 10 m AE pixels, mixed-pixel
   labels at the coarser grid pollute training. Mitigation:
   homogeneous-neighbourhood label sampling.
4. **Pre-2017 baseline gap.** AE coverage starts 2017. Indicators
   reporting against pre-2017 baselines (15.1.1's FAO 1990 baseline,
   15.3.1's typical 2000 baseline, 6.6.1's 2001–2005 baseline) must
   splice AE-era trajectory onto Landsat-era baseline products.
   Each splice is a methodological assumption that should be flagged.
5. **Annual-area regime vs change-map regime (Burns & Kennedy
   2026).** All Study 01 IN candidates are annual-area indicators
   (the indicator value is area or area ratio per year). Burns &
   Kennedy's change-detection findings apply when the deliverable
   is a change map — which is more relevant under Study 02's
   Architecture B (e.g., 11.5.3 disaster damage).

## Carry-overs to Study 02

The following indicators were marked OUT in Study 01 but flagged as
tractable under another architecture; they carry to
`../02_sdg_gee_architecture_screen/`:

| Indicator | Architecture (Study 02) |
|---|---|
| 6.4.2 Water stress | C |
| 7.1.1 Electricity access | E (VIIRS × WorldPop) |
| 9.1.1 Rural population near roads | D |
| 11.2.1 Public transport access | D |
| 11.5.3 Damage to critical infrastructure | B (proxy) |
| 11.6.2 PM2.5 in cities | E |
| 13.2.2 Total GHG emissions | C (research-stage) |
| 14.5.1 MPA coverage | D |
| 15.1.2 KBA × WDPA terrestrial | D |
| 15.4.1 KBA mountain × WDPA | D |
| 1.4.2 / 5.a.1 (potential D) | D (research-stage) |

## Outputs

- `methodology.md` — screening criteria, regimes, Burns & Kennedy
  findings.
- `indicators_master.md` — verbatim 2025-revised SDG indicator list
  (all 232 unique).
- `indicators.md` — master screen with verdict and one-line reasoning
  per indicator.
- `catalog_inventory.md` — preliminary GEE official + community
  catalog inventory by phenomenon (entries marked `[unverified]`
  pending live confirmation per use).
- `candidates/<code>.md` — per-candidate writeups for the 6 IN
  + 5 PARTIAL indicators.
- `literature.md` — peer-reviewed papers, preprints, and technical
  blog posts on AE utility, organised by indicator relevance.
- `references.md` — all sources cited, with retrieval URLs and
  access dates.

## What this study does not do

- It does not assess statistical power, training-sample-size
  requirements, or expected accuracy per indicator. Each in-scope
  candidate is a *recommendation to develop a study*, not a finished
  implementation plan.
- It does not provide engineering specs for the function library —
  see Study 02's `library_spec.md` (planned).
- It does not benchmark AE-classification against catalog products
  empirically. The literature appendix collects published benchmarks
  but does not run new ones.

## Reproducibility

All canonical inputs (UN indicator list, AE catalog page, EE official
catalog entries, AE-utility literature) are cited in `references.md`
with retrieval URLs. Where a catalog page's documented coverage could
not be verified live during the study, the inline citation is marked
`[unverified]` rather than asserted.
