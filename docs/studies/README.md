## Background

Two screens were run in April 2026 against the post-2025-revision UN
SDG Global Indicator Framework (232 unique indicators).

- **Study 01 — `01_sdg_alphaearth_screen/`** asked the narrow question:
  which indicators are amenable to per-pixel supervised classification
  of AlphaEarth annual embeddings (`GOOGLE/SATELLITE_EMBEDDING/V1/ANNUAL`)
  using GEE catalog datasets as training labels. The reference
  architecture is the one in `pipeline/main.py` for SDG 11.3.1.
- **Study 02 — `02_sdg_gee_architecture_screen/`** asked the broader
  question: how much of the SDG framework is monitorable on GEE+GCP
  under *any* architecture, not only AE-classification. It assigns
  every indicator a primary architecture letter A–G.

## Findings, condensed

| Verdict | Count |
|---|---|
| Study 01 — IN under AE-classification | 6 (11.3.1, 6.6.1, 11.1.1 proxy, 15.1.1, 15.3.1 LULC sub, 15.4.2 a+b) |
| Study 01 — PARTIAL | 5 (2.4.1, 6.3.2, 11.7.1, 14.1.1, 15.2.1) |
| Study 02 — tractable on GEE under some architecture (A–F) | ~23 |
| Study 02 — out of scope under any GEE architecture (G) | ~209 |

Three findings drive the proposal below.

1. **AE-classification is the right primary for ~6 indicators, not the
   bulk.** The majority of EO-tractable SDG indicators sit in catalog
   aggregation (C), vector-overlay aggregation (D), or composite
   multi-function (F). Building the repo around AE-classification
   conflates the demonstrated module (11.3.1) with the general shape.
2. **The reusable artefact is the runner, not the SDG framing.** What
   `pipeline/main.py` + `pipeline/api.py` already do — auth, AOI
   handling, EE graph construction, asynchronous task submission, GCS
   export, status polling — is generic. The SDG-specific parts are
   the label datasets, class codes, AOI handler, and aggregation rule.
3. **Methods freeze at different rates than the codebase ships.**
   Burns & Kennedy 2026's change-detection findings, the IPCC
   custodian-methodology revisions, and per-indicator literature all
   evolve continuously. The repo needs a way to accept a frozen method
   as an immutable, versioned recipe without rewriting the runner each
   time.

## Proposed pivot

Reframe the repo from *"an SDG-AE pipeline plus a planned SDG library"*
to *"a curated GEE compute service that runs versioned recipes."*

- A **recipe** is a curated, in-repo Python module that declares
  inputs (catalog assets, AOI handler), the EE computation, the
  output schema, and the validation contract. Recipes are not
  user-uploaded; they are added to the repo only after a method is
  frozen, written up as a study, and reviewed.
- The **runner** is the generic infrastructure that loads a recipe
  by id, executes it on EE, exports derived data to GCS, and serves
  status via FastAPI. The runner is recipe-agnostic.
- SDG 11.3.1 becomes the first recipe under the new layout, ported
  from `pipeline/main.py`. Subsequent recipes — additional SDG
  indicators, conflict-damage products, biodiversity signals,
  bespoke research outputs — are added the same way regardless of
  whether they use AlphaEarth.

This preserves the validation discipline and per-indicator config
pattern from `02_sdg_gee_architecture_screen/library_spec.md`. It drops
the A–F architecture letters as the *organising principle of the core*
— A–F remain useful as a taxonomy in the SDG screen and as helper
utilities (`runner/common/`) callable from any recipe.

## Proposed scaffolding

```
pipeline/
  runner/                          # recipe-agnostic infrastructure
    __init__.py
    auth.py                        # EE + GCS auth
    aoi.py                         # AOI handlers (country, GADM, GHSL city, KBA, ...)
    export.py                      # GCS export + manifest
    tasks.py                       # EE task submission + status polling
    registry.py                    # recipe discovery + versioning
    validation.py                  # confusion matrix, accuracy, Burns & Kennedy diagnostics
    common/                        # reusable EE primitives
      ae_classify.py               # AE-embedding classification (was arch_a)
      ae_change.py                 # AE change-map (was arch_b)
      catalog_aggregate.py         # direct catalog aggregation (was arch_c)
      overlay_aggregate.py         # vector × raster (was arch_d)
      pop_weighted.py              # population-weighted exposure (was arch_e)
      compose.py                   # composite multi-function (was arch_f)
  recipes/
    sdg_11_03_01/                  # FIRST RECIPE — ported from pipeline/main.py
      __init__.py
      recipe.py                    # declares Recipe object
      config.yaml                  # catalog asset ids, class codes, AOI handler, cadence
      methodology.md               # frozen method writeup; cites Study 01/02
      validation_report.md         # accuracy, Kappa, diagnostics per Burns & Kennedy
    <next_recipe>/
      ...
  api.py                           # FastAPI; serves recipes by id; thin wrapper over runner
  main.py                          # DEPRECATED — kept until 11.3.1 recipe is ported
```

### Recipe contract (sketch)

Each recipe declares a single object the runner can consume:

```python
# pipeline/recipes/sdg_11_03_01/recipe.py
from pipeline.runner import Recipe
from pipeline.runner.common import ae_classify

RECIPE = Recipe(
    id="sdg_11_03_01",
    version="2026.05.0",                # frozen; bump for any methodology change
    title="SDG 11.3.1 Land Consumption Rate to Population Growth Rate",
    method_summary="AE-embedding supervised classification of built-up area; ...",
    citation="Study 01 candidate writeup; Burns & Kennedy 2026.",
    inputs={
        "embedding": "GOOGLE/SATELLITE_EMBEDDING/V1/ANNUAL",
        "labels": [{"asset": "JRC/GHSL/P2023A/GHS_BUILT_S", "class_codes": [...]}],
        "ancillary": [{"asset": "WorldPop/GP/100m/pop", "role": "denominator"}],
    },
    aoi_handler="ghsl_city_or_country",
    compute=ae_classify.classify_annual_area,    # function from runner/common
    cadence="annual",
    output_schema={...},                          # column names, units, dtypes
    validation_required=["overall_accuracy", "kappa", "per_class_user_producer"],
)
```

The runner introspects `RECIPE`, builds the EE graph, submits the task,
exports to GCS, and writes a manifest alongside. Once a recipe's
`version` is published, it is immutable; methodology changes ship as
a new version (`2026.05.0` → `2026.07.0`) so historical outputs remain
reproducible.

## Concrete next steps

| # | Step | Output | Rough effort |
|---|---|---|---|
| 1 | Define the `Recipe` dataclass and `runner/registry.py`. Document the contract in `pipeline/runner/README.md`. | Runner contract committed. | 0.5 day |
| 2 | Extract generic plumbing from `pipeline/main.py` into `pipeline/runner/{auth,aoi,export,tasks}.py`. No behaviour change. | Runner skeleton, tests pass. | 1–2 days |
| 3 | Port the 11.3.1 logic into `pipeline/recipes/sdg_11_03_01/`. Keep outputs byte-identical to current `main.py`. | First working recipe; deprecate `main.py`. | 1 day |
| 4 | Refactor `pipeline/api.py` to serve recipes by id (`GET /recipes`, `POST /recipes/{id}/run`) instead of hardcoding 11.3.1. | API surface generalised. | 0.5 day |
| 5 | Move A–F utilities from `library_spec.md` into `runner/common/` as the helpers recipes call. Mark `library_spec.md` superseded; link to this README. | Common helpers available; spec retired. | 0.5 day |
| 6 | Write the recipe-contribution checklist: how a method graduates from a study writeup → frozen recipe (review, validation report, version assignment). | `docs/studies/recipe_contribution.md`. | 0.5 day |
| 7 | Pick the second recipe to seed the pattern. Candidates ordered by leverage: 15.1.1 (large literature, multiple labels — exercises catalog-vs-AE comparison) or 9.1.1 (Architecture D — exercises a non-AE recipe early, proving the runner is signal-agnostic). | Second recipe scoped. | scoping only |

Steps 1–4 are the minimum viable pivot — after step 4, the repo is a
generic GEE recipe runner with one recipe (11.3.1). Steps 5–7 lock in
the contribution pathway for everything that follows.

## What this changes vs prior plans

- `02_sdg_gee_architecture_screen/library_spec.md` is **superseded** as
  the organising spec for the codebase. Its A–F functions remain
  valid; they move from being the top-level library to being
  utilities under `runner/common/`. The two studies remain the
  canonical research record for the SDG-specific question.
- The Study 01 carry-over candidates (15.1.1, 6.6.1, 15.4.2, etc.)
  and Study 02 carry-overs (9.1.1, 11.6.2, 7.1.1, etc.) become a
  prioritised **recipe backlog**, not a library to be built up-front.
  Recipes are added one at a time, each with its own frozen
  methodology and validation report.

## Open questions for the meeting

1. **Recipe versioning policy.** Semver (`MAJOR.MINOR.PATCH`) or
   date-based (`YYYY.MM.N`)? The latter is friendlier for "the
   methodology was frozen this month."
2. **AOI catalogue.** Do we ship a curated AOI library
   (countries, GHSL cities, KBAs, ...) inside `runner/aoi.py`, or
   require each recipe to specify AOIs explicitly?
3. **Output destination.** Stay on GCS exclusively, or also support
   BigQuery / Earth Engine assets / direct download for some recipes?
4. **Recipe-contribution review.** Who is the named reviewer when a
   new method graduates from a study to a recipe? Solo-author OK,
   or two-person review required?
5. **Backwards compatibility.** Does the existing 11.3.1 endpoint in
   `api.py` need to keep working during the port (one release of
   dual support), or can we cut over in one PR?
