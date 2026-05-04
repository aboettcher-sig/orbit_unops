# Literature — AlphaEarth Embedding Utility Studies

This file collects peer-reviewed papers, preprints, technical blog
posts, and engineering notes that bear on the feasibility of using
`GOOGLE/SATELLITE_EMBEDDING/V1/ANNUAL` embeddings for SDG indicator
classification. Items are grouped by relevance to specific Study 01
candidates; cross-references are noted.

Quality tiers used:

- **[peer-reviewed]** — published in a journal or accepted conference.
- **[preprint]** — arXiv, bioRxiv, preprints.org; not yet
  peer-reviewed.
- **[technical blog]** — engineering writeups from Google, DeepMind,
  Element 84, CARTO, Urban AI, OSU eMapR Lab, etc.
- **[announcement]** — corporate announcements (DeepMind, Google
  Earth) that frame the dataset but do not benchmark it.

---

## Foundational

- **[preprint]** Brown, C.F. *et al.* (2025). *AlphaEarth Foundations:
  An embedding field model for accurate and efficient global mapping
  from sparse label data.* arXiv:2507.22291.
  https://arxiv.org/abs/2507.22291
  - Reports ~24% lower error rate than baselines on average across
    diverse mapping tasks; ~1.4× error magnitude reduction. AE is the
    only task-agnostic featurisation tested that consistently
    outperforms previous featurisation methods without re-training,
    while maintaining 10 m spatial resolution.
  - **Anchors all Study 01 candidate writeups.**

- **[technical blog]** Google DeepMind (2025). *AlphaEarth Foundations
  helps map our planet in unprecedented detail.*
  https://deepmind.google/blog/alphaearth-foundations-helps-map-our-planet-in-unprecedented-detail/
  - Announcement-tier; explicit framing of food security,
    deforestation, urban expansion, water resources as target
    applications.

- **[technical blog]** Google Earth (March 2026). *AlphaEarth
  Foundations Satellite Embeddings: A Look at Our Planet in 2025.*
  https://medium.com/google-earth/alphaearth-foundations-satellite-embeddings-a-look-at-our-planet-in-2025-f23349370399
  - 2025 retrospective; example use cases.

- **[technical blog]** GEE Community Tutorial. *Introduction to the
  Satellite Embedding Dataset.*
  https://developers.google.com/earth-engine/tutorials/community/satellite-embedding-01-introduction
  - Reference implementation and band-naming conventions.

## Change-detection feature design (relevant to all candidates;
   especially 11.5.3, any change-map-deliverable indicator)

- **[technical blog]** Burns, M. & Kennedy, R. (2026, April 13).
  *Rethinking change detection and attribution: how you compare
  satellite embeddings matters.* Google Earth (Medium).
  https://medium.com/google-earth/rethinking-change-detection-and-attribution-how-you-compare-satellite-embeddings-matters-858f17f577d7
  - Oregon State University eMapR Lab. Five feature configurations
    compared (delta-only, dot-product-only, stacked, baseline+delta,
    baseline+dot-product). Baseline-preserving configs (3–5)
    spatially coherent; magnitude-only configs fragment.
    ~200 stable + 200 change points per class is sufficient.
  - **Adopted as methodological default** (`methodology.md`).

## Land-cover classification benchmarks (relevant to 15.1.1, 15.3.1,
   15.4.2, 11.3.1)

- **[preprint]** *Evaluating AlphaEarth Foundation Embeddings for
  Pixel- and Object-Based Land Cover Classification in Google Earth
  Engine.* preprints.org 202511.2172.
  https://www.preprints.org/manuscript/202511.2172
  - AE embeddings improve overall accuracy by ~5 percentage points
    and Kappa by ~3 over spectral-index models.

- **[preprint]** *What on Earth is AlphaEarth? Hierarchical structure
  and functional interpretability for global land cover.*
  arXiv:2603.16911. https://arxiv.org/html/2603.16911v1
  - Interpretability angle; useful for defending classifier choices
    in candidate writeups.

- **[peer-reviewed]** *Boosting Algorithm: An Ensemble Learning Tool
  for Land Use Land Cover Classification Using Google Alpha Earth
  Foundations Satellite Embeddings.* SCIRP.
  https://www.scirp.org/journal/paperinformation?paperid=148760
  - Demonstrates non-RF classifier (gradient boosting) on AE for
    LULC. Confirms `methodology.md`'s position that any supervised
    classifier on the embedding vector is admissible.

## Forest / tree-species classification (relevant to 15.1.1, 15.4.2)

- **[preprint]** *Geospatial foundation models enable data-efficient
  tree species mapping in temperate mountain forests.* bioRxiv
  2026.02.23.707022.
  https://www.biorxiv.org/content/10.64898/2026.02.23.707022v3.full
  - AE and Tessera embeddings evaluated for tree-species
    classification in Trentino, northern Italy, against parcel-level
    forest inventories. **Most directly relevant published
    benchmark for 15.1.1 and 15.4.2(a).**

## Wetland / surface water classification (relevant to 6.6.1)

- **[peer-reviewed]** *Streamlining Wetland Vegetation Mapping with
  AlphaEarth Embeddings: Comparable Accuracy to Traditional Methods
  with Cleaner Maps and Minimal Preprocessing.* *Remote Sensing*
  18(2):293 (2026). https://www.mdpi.com/2072-4292/18/2/293
  - Conventional multi-sensor RF vs cluster-guided AE-RF on Narran
    Lake (NSW, Australia) dynamic wetland system. AE matches
    accuracy with smoother boundaries, reduced salt-and-pepper
    noise, and most preprocessing eliminated. **Strongest published
    benchmark for SDG 6.6.1.**

## Urban / built-up classification (relevant to 11.3.1, 11.1.1)

- **[technical blog]** Urban AI (2026). *AlphaEarth Foundations:
  Implications for Cities and Urban Planners.* Medium.
  https://medium.com/@urban-ai/alphaearth-foundations-implications-for-cities-and-urban-planners-b2125805124f
  - Qualitative; framing for urban use cases.

- **[dataset / engineering]** Geographic Data Service (UK). *Using
  AlphaEarth Foundations Embeddings for Building Analysis.*
  https://data.geods.ac.uk/dataset/using-alphaearth-foundations-embeddings-for-building-analysis
  - UK pilot for building-extent analysis using AE.

- **[technical blog]** CARTO (2026). *From Imagery to Insight: Google
  AlphaEarth Foundations in CARTO.*
  https://carto.com/blog/google-alphaearth-foundations-in-carto/
  - Engineering notes for AE consumption in cloud GIS workflows.

- **[technical blog]** Element 84 (2026). *Exploring AlphaEarth
  Embeddings.*
  https://element84.com/machine-learning/exploring-alphaearth-embeddings/
  - Hands-on engineering walk-through; useful for sampling and
    classifier-fitting workflow design.

- **[technical blog]** Heiman, A. *AlphaEarth: A Peek into the
  Potential of Geospatial Satellite Embeddings.*
  https://aliceheiman.github.io/posts/alphaearth-intro.html
  - Introductory; framing for newcomers.

## Air quality / urban exposure (relevant to Study 02 11.6.2 / 7.1.1)

- **[peer-reviewed]** *Machine Learning for Urban Air Quality
  Prediction Using Google AlphaEarth Foundations Satellite
  Embeddings: A Case Study of Quito, Ecuador.* *Remote Sensing*
  17(20):3472 (2025). https://www.mdpi.com/2072-4292/17/20/3472
  - AE embeddings used as features for ML air-quality regression in
    Quito. Relevant to Study 02 Architecture E framing.

## Generative / scalable label workflows

- **[preprint]** *Scalable Geospatial Data Generation Using AlphaEarth
  Foundations Model.* arXiv:2508.11739.
  https://arxiv.org/html/2508.11739v1
  - Methods for label bootstrapping using AE; relevant when label
    data are sparse.

- **[preprint]** *Subsurface Property Mapping using Google AlphaEarth
  Foundations.* arXiv:2604.14756.
  https://arxiv.org/html/2604.14756v1
  - Out-of-scope domain (subsurface) but relevant for understanding
    what AE embeddings encode about non-direct-observable
    properties.

## Hosting / availability

- **[engineering]** AWS Open Data Registry. *Google Satellite
  Embedding V1.*
  https://registry.opendata.aws/aef-source/
  - Mirrored hosting; relevant for non-GEE workflows or backup
    access.

- **[engineering]** Source.coop / TGE Labs. *AlphaEarth Foundations
  Satellite Embedding Dataset.*
  https://source.coop/tge-labs/aef
  - Alternate host.

---

## How findings shape Study 01 candidate writeups

- **6.6.1**: anchored to the *Streamlining Wetland Vegetation Mapping
  with AE* paper (Narran Lake benchmark). The salt-and-pepper-noise
  reduction finding is cited in the candidate file's "validation"
  section.
- **11.3.1**: anchored to Brown et al. 2025 + Urban AI framing.
  Non-RF classifier admissibility supported by the SCIRP boosting
  paper.
- **11.1.1**: anchored to Urban AI framing; IDEAMAPS literature
  carries the morphology-based label methodology.
- **15.1.1**: anchored to the Trentino tree-species bioRxiv paper +
  the LC classification preprint (preprints.org 202511.2172).
- **15.3.1 / 15.4.2**: anchored to the LC classification preprint;
  Trends.Earth as the operational reference UNCCD implementation.
- **All candidates**: Burns & Kennedy 2026 establishes that
  classifier choice and training-sample design matter more than
  sample size, and that baseline-preserving features outperform
  magnitude-only features for change-detection deliverables.

## Open literature gaps

- No published benchmark of AE-classified built-up vs GHSL Built-S at
  national scale was found in this search. Worth running as a Study
  01 follow-up experiment.
- No published benchmark of AE-classified surface water against JRC
  GSW Yearly History was found, despite the Narran-wetland paper
  covering the vegetated-wetland sub-task.
- No peer-reviewed Trends.Earth-vs-AE 15.3.1 comparison.
- No published study on AE classification stability across years
  (year-to-year repeatability of independently classified annual
  embeddings).
