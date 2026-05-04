# Catalog Inventory — Candidate Training-Mask Sources

**Status: PRELIMINARY.** This inventory was assembled from research-agent
training knowledge of the GEE Data Catalog and the Awesome GEE Community
Catalog and has **not been live-verified**. Entries marked `[unverified]`
need confirmation against the live catalogs before being cited as label
sources in any per-candidate writeup. Category-level coverage (i.e., which
phenomena have at least one viable label dataset) is high confidence;
specific asset IDs and upper-bound coverage years are not.

AlphaEarth temporal anchor: 2017–2024 annual. Datasets included only if
they have at least one year of overlap with this window, or are static
products whose single timestamp is informative. Datasets whose entire
documented coverage predates 2017 are noted but flagged for drop.

---

## 1. Built-up / Settlements / Impervious Surface

- **Global Human Settlement Layer — Built-up Surface (GHSL Built-S, multitemporal)**
  - Asset ID: `JRC/GHSL/P2023A/GHS_BUILT_S` `[unverified exact path]`
  - Provider: European Commission JRC
  - Coverage: 1975–2030 in 5-year epochs (P2023A release); 2020 epoch overlaps; 2025 projection available
  - Resolution: 100 m (also 10 m derivative in some releases)
  - Extent: Global
  - Schema: Continuous built-up surface fraction (m²/cell). Thresholdable to binary built/non-built; JRC provides recommended thresholds. Borderline as a discrete label source — usable only after thresholding.
  - URL: https://developers.google.com/earth-engine/datasets/catalog/JRC_GHSL_P2023A_GHS_BUILT_S

- **GHSL Built-up Characteristics (built height & built volume)**
  - Asset ID: `JRC/GHSL/P2023A/GHS_BUILT_H` and `..._BUILT_V` `[unverified]`
  - Provider: JRC
  - Coverage: 2018, plus historical epochs
  - Resolution: 100 m
  - Extent: Global
  - Schema: Continuous (height in m, volume in m³). Borderline — only a label source if thresholded into height classes.
  - URL: https://developers.google.com/earth-engine/datasets/catalog/JRC_GHSL_P2023A_GHS_BUILT_H

- **GHSL Settlement Model grid (SMOD) — degree of urbanisation**
  - Asset ID: `JRC/GHSL/P2023A/GHS_SMOD` `[unverified]`
  - Provider: JRC
  - Coverage: 1975–2030 in 5-year epochs
  - Resolution: 1 km
  - Extent: Global
  - Schema: Discrete classes — Urban Centre (30), Dense Urban Cluster (23), Semi-dense Urban Cluster (22), Suburban/peri-urban (21), Rural cluster (13), Low density rural (12), Very low density rural (11), Water (10). Coarse for 10 m masking but useful as stratifier.
  - URL: https://developers.google.com/earth-engine/datasets/catalog/JRC_GHSL_P2023A_GHS_SMOD

- **World Settlement Footprint (WSF) 2015 / WSF Evolution / WSF 2019**
  - Asset ID: `DLR/WSF/WSF2015/v1`, `DLR/WSF/WSF2019/v1` `[unverified]`
  - Provider: DLR
  - Coverage: WSF 2015 (static, 2015), WSF 2019 (static, 2019), WSF Evolution (1985–2015). Only WSF 2019 overlaps 2017–2024.
  - Resolution: 10 m
  - Extent: Global
  - Schema: Binary settlement / no settlement.

- **Dynamic World V1 — built class**
  - Asset ID: `GOOGLE/DYNAMICWORLD/V1`
  - Provider: Google / WRI
  - Coverage: 2015-06 to present, near-real-time per Sentinel-2 scene
  - Resolution: 10 m
  - Extent: Global
  - Schema: 9-class probabilistic land cover (water, trees, grass, flooded vegetation, crops, shrub & scrub, built, bare, snow & ice). "Built" can be extracted as binary mask.
  - **Caveat**: itself a Sentinel-2-derived classifier; using it to label an embedding-based classifier is closer to label distillation than independent supervision. Flag in any candidate writeup.

- **ESA WorldCover 10 m — built-up class**
  - Asset ID: `ESA/WorldCover/v100` (2020), `ESA/WorldCover/v200` (2021)
  - Provider: ESA
  - Coverage: 2020 (v100), 2021 (v200)
  - Resolution: 10 m
  - Extent: Global
  - Schema: 11 classes; class 50 = Built-up.

- **Global Artificial Impervious Area (GAIA) — community catalog**
  - Catalog ID: `projects/sat-io/open-datasets/GAIA` `[unverified path]`
  - Provider: Tsinghua / Gong et al.
  - Coverage: 1985–2018 annual. Overlaps 2017–2018 only — borderline.
  - Resolution: 30 m
  - Extent: Global
  - Schema: Year of first impervious detection (categorical by year).

---

## 2. Forest Cover / Forest Change / Tree Canopy / Mangroves

- **Hansen Global Forest Change**
  - Asset ID: `UMD/hansen/global_forest_change_2023_v1_11` (latest at agent's training; check for newer release)
  - Provider: Hansen / UMD / Google
  - Coverage: 2000 baseline; loss year 2001–2023 (annual); gain 2000–2012
  - Resolution: 30 m
  - Extent: Global
  - Schema: `treecover2000` (continuous % canopy, thresholdable), `loss` (binary), `lossyear` (year code 1–23), `gain` (binary).

- **JRC Global Forest Cover (GFC) 2020**
  - Asset ID: `JRC/GFC2020/V1` or `V2`
  - Provider: JRC
  - Coverage: Static, 2020 (with V2 update)
  - Resolution: 10 m
  - Extent: Global
  - Schema: Binary forest / non-forest (FAO-aligned definition).

- **JRC Tropical Moist Forest (TMF) — annual change**
  - Asset ID: `projects/JRC/TMF/v1_2023/AnnualChanges` `[unverified path]`
  - Provider: JRC
  - Coverage: 1990–2023 annual
  - Resolution: 30 m
  - Extent: Pan-tropics (regional)
  - Schema: Discrete classes per year — undisturbed TMF, degraded TMF, deforested land, forest regrowth, water, other land cover.

- **MODIS Vegetation Continuous Fields (MOD44B)**
  - Asset ID: `MODIS/006/MOD44B` or `MODIS/061/MOD44B`
  - Coverage: 2000–present, annual
  - Resolution: 250 m
  - Schema: Continuous % tree cover, % non-tree veg, % non-vegetated. Thresholdable; coarse.

- **Global Mangrove Watch (GMW) — annual extent**
  - Catalog ID: `projects/sat-io/open-datasets/GMW` `[unverified]`. Hosted via community catalog primarily.
  - Provider: Aberystwyth / soloEO / GMW partnership
  - Coverage: 1996, 2007–2010, 2015–2020 annual (v3); v4 may extend further `[unverified]`
  - Resolution: ~25 m (ALOS PALSAR-derived)
  - Extent: Global tropics/subtropics
  - Schema: Binary mangrove extent per year.

- **Mangrove Forests of the World (Giri 2011)**
  - Asset ID: `LANDSAT/MANGROVE_FORESTS` `[unverified]`
  - Coverage: Static, ~2000. **Predates AE; drop unless used as legacy reference.**

- **Global Forest Canopy Height (Potapov et al. 2019; Lang et al. 2022)**
  - Asset IDs: `[unverified — both as user-asset paths]`
  - Coverage: 2019 (Potapov), 2020 (Lang) — static
  - Resolution: 30 m (Potapov), 10 m (Lang)
  - Schema: Continuous canopy height (m). Threshold to height classes.

- **TanDEM-X Forest/Non-Forest Map (community catalog)**
  - Catalog ID: `projects/sat-io/open-datasets/FNF/TDM_FNF_2019` `[unverified]`
  - Coverage: 2019 (static)
  - Resolution: 50 m
  - Schema: Binary forest/non-forest.

- **PALSAR-2 Global Forest/Non-Forest (JAXA FNF)**
  - Asset ID: `JAXA/ALOS/PALSAR/YEARLY/FNF4` (4-class) and older `FNF`
  - Coverage: 2007–2010 (PALSAR-1) and 2015–present (PALSAR-2, annual). Overlaps 2017–present.
  - Resolution: 25 m
  - Schema (FNF4): dense forest, non-dense forest, non-forest, water.

- **Tree Cover Loss Drivers (Curtis et al., WRI/GFW)**
  - Catalog ID: `WRI/GFW/dataset_drivers_of_loss` `[unverified]`
  - Coverage: 2001–2022 `[unverified]`
  - Schema: Driver classes (commodity-driven deforestation, shifting agriculture, forestry, wildfire, urbanisation). Auxiliary label.

---

## 3. Cropland / Agriculture / Irrigation

- **ESA WorldCereal — global crop mask + crop type**
  - Catalog ID: `ESA/WorldCereal/2021/MODELS/v100` `[unverified]`
  - Provider: ESA
  - Coverage: 2021 (single year v100); v200 may extend `[unverified]`
  - Resolution: 10 m
  - Extent: Global
  - Schema: Per-pixel binary masks for temporary crops, maize, winter cereals, spring cereals, irrigation, active cropland — multiple bands.

- **GFSAD30 Global Cropland Extent at 30 m**
  - Asset ID: `USGS/GFSAD1000_V1` (1 km, predates) and 30 m regional tiles
  - Coverage: ~2015 nominal (static). **Borderline — predates AE.**

- **USDA Cropland Data Layer (CDL)**
  - Asset ID: `USDA/NASS/CDL`
  - Coverage: 1997–present (CONUS), annual
  - Resolution: 30 m
  - Extent: CONUS (regional)
  - Schema: ~130 crop and land cover classes.

- **Canada AAFC Annual Crop Inventory**
  - Asset ID: `AAFC/ACI`
  - Coverage: 2009–present annual
  - Resolution: 30 m (some years 56 m)
  - Extent: Canada
  - Schema: ~70+ crop and land cover classes.

- **EU Crop Map (JRC)**
  - Catalog ID: community `projects/sat-io/open-datasets/EU_CROP_MAP_2018` `[unverified]`
  - Coverage: 2018 (static initially)
  - Resolution: 10 m
  - Extent: EU
  - Schema: 19 crop classes.

- **LGRIP30 Global Rainfed/Irrigated Cropland 2015**
  - Catalog ID: `projects/sat-io/open-datasets/LGRIP30` `[unverified]`
  - Coverage: 2015 (static) — borderline; useful as static reference.
  - Resolution: 30 m
  - Schema: Non-cropland, irrigated, rainfed.

- **Copernicus Global Land Service — Crop Type / Cropland 100 m (CGLS-LC100)**
  - Asset ID: `COPERNICUS/Landcover/100m/Proba-V-C3/Global`
  - Coverage: 2015–2019 annual
  - Resolution: 100 m
  - Schema: 23 discrete classes including "cropland" (also relevant to §6).

---

## 4. Grassland / Rangeland / Pasture

- **Rangeland Analysis Platform (RAP) — Vegetation Cover (US)**
  - Catalog ID (community): `projects/rap-data-365417/assets/vegetation-cover-v3` `[unverified]`
  - Coverage: 1986–present annual
  - Resolution: 30 m
  - Extent: CONUS
  - Schema: Per-pixel % cover for annual forbs/grasses, perennial forbs/grasses, shrubs, trees, bare ground, litter. Continuous; thresholdable.

- **Global Pasture Watch — grasslands (Parente et al.)**
  - Catalog ID: `projects/global-pasture-watch/...` `[unverified]`
  - Coverage: 2000–2022 `[unverified]`
  - Resolution: 30 m
  - Extent: Global
  - Schema: Cultivated and natural/semi-natural grassland classes.

- **WorldCover grassland class** — see §1 (class 30).
- **Dynamic World grass + shrub & scrub classes** — see §1.
- **MODIS MCD12Q1 grassland (IGBP class 10)** — see §6.

---

## 5. Surface Water / Wetlands / Inland & Coastal Water

- **JRC Global Surface Water (GSW) — Yearly History**
  - Asset ID: `JRC/GSW1_4/YearlyHistory` (and Monthly, Transitions, GlobalSurfaceWater)
  - Provider: JRC / EC
  - Coverage: 1984–2022 (v1.4) annual; updates pending
  - Resolution: 30 m
  - Extent: Global
  - Schema: Per-pixel discrete classes — no data, not water, seasonal water, permanent water; transition classes (permanent, new permanent, lost permanent, seasonal, new seasonal, lost seasonal, seasonal-to-permanent).

- **JRC GSW Monthly History**
  - Asset ID: `JRC/GSW1_4/MonthlyHistory`
  - Coverage: 1984–2022 monthly
  - Schema: 0=no data, 1=not water, 2=water.

- **HydroLAKES (vector → rasterised)**
  - Catalog ID (community): `projects/sat-io/open-datasets/HydroLakes/lakes_polygons` `[unverified]`
  - Coverage: Static (~2018 release)
  - Schema: Lake polygons; rasterise to binary lake mask.

- **Global River Widths from Landsat (GRWL)**
  - Catalog ID: `projects/sat-io/open-datasets/GRWL` `[unverified]`
  - Coverage: ~2000–2015 (static). **Predates AE.**

- **Ramsar Sites (vector)**
  - Catalog ID: community-hosted `[unverified]`
  - Coverage: continuously updated
  - Schema: Wetland polygons by type.

- **GLAD Global Land Cover and Land Use Change (Potapov et al. 2022) — wetland & water classes**
  - Asset ID: `projects/glad/GLCLU2020` and updates `[unverified]`
  - Coverage: 2000, 2005, 2010, 2015, 2020 (5-year)
  - Resolution: 30 m
  - Schema: Multi-class including stable forest, forest gain, forest loss, short veg, water, wetlands, cropland, built-up.

- **Global Tidal Flats (Murray et al. 2019)**
  - Asset ID: `UQ/murray/Intertidal/v1_1/global_intertidal` `[unverified]`
  - Coverage: 1984–2016 in epochs — **borderline; final epoch ends 2016**. Drop unless using as static reference. v2 may extend to ~2019 `[unverified]`.

---

## 6. Land Cover (general multi-class)

- **ESA WorldCover v100 (2020) and v200 (2021)** — see §1. 11-class global LC at 10 m.
- **Dynamic World V1** — see §1. 9-class probabilistic LC at 10 m, near-real-time.
- **Copernicus Global Land Service — Land Cover 100 m (CGLS-LC100) Collection 3**
  - Asset ID: `COPERNICUS/Landcover/100m/Proba-V-C3/Global`
  - Coverage: 2015–2019 annual
  - Resolution: 100 m
  - Schema: 23 discrete classes.

- **MODIS MCD12Q1 — annual land cover**
  - Asset ID: `MODIS/006/MCD12Q1` and `MODIS/061/MCD12Q1`
  - Coverage: 2001–present annual
  - Resolution: 500 m
  - Schema: Multiple legends (IGBP 17-class, UMD, LAI, BGC, PFT, FAO-LCCS1/2/3). Coarse.

- **ESA CCI Land Cover**
  - Asset ID: `ESA/CCI/LandCover_300m` `[unverified exact]`. Hosted via community catalog as `projects/sat-io/open-datasets/ESA/ESA_CCI_LANDCOVER`.
  - Coverage: 1992–2020 annual
  - Resolution: 300 m
  - Schema: 22 LCCS-aligned classes.

- **GlobeLand30**
  - Catalog ID: community `projects/sat-io/open-datasets/GLOBELAND30` `[unverified]`
  - Coverage: 2000, 2010, 2020 (epochs)
  - Resolution: 30 m
  - Schema: 10 classes.

- **FROM-GLC10 (Tsinghua)**
  - Catalog ID: community `projects/sat-io/open-datasets/FROM-GLC10` `[unverified]`
  - Coverage: 2017 (and updates) `[unverified]`
  - Resolution: 10 m
  - Schema: 10 classes.

- **GLAD Global Land Cover and Land Use Change** — see §5.

- **Esri 10 m Annual Land Cover (Sentinel-2) / Impact Observatory IO-LULC**
  - Catalog ID: `projects/sat-io/open-datasets/landcover/ESRI_Global-LULC_10m_TS` `[unverified]`
  - Provider: Esri / Impact Observatory
  - Coverage: 2017–2023 annual `[unverified upper]`
  - Resolution: 10 m
  - Schema: 9 classes.

- **NLCD (National Land Cover Database) — CONUS**
  - Asset ID: `USGS/NLCD_RELEASES/2019_REL/NLCD` and `2021_REL`
  - Coverage: 2001, 2004, 2006, 2008, 2011, 2013, 2016, 2019, 2021
  - Resolution: 30 m
  - Schema: 16 LC classes.

- **CORINE Land Cover (Europe)**
  - Asset ID: `COPERNICUS/CORINE/V20/100m`
  - Coverage: 1990, 2000, 2006, 2012, 2018 (and 2024 v21 release `[unverified]`)
  - Resolution: 100 m
  - Schema: 44 hierarchical CLC classes.

- **MapBiomas — Brazil, Amazon, Chaco, Pampa, Atlantic Forest, Indonesia, etc.**
  - Catalog ID: community `projects/mapbiomas-workspace/...` `[unverified]`
  - Coverage: 1985–present annual (Brazil collection 8/9)
  - Resolution: 30 m
  - Schema: Multi-level hierarchical LC classes.

- **JAXA High-Resolution Land Use/Land Cover (Japan)** `[unverified asset ID]`
- **China Land Cover Dataset (CLCD, Yang & Huang)** — community `projects/sat-io/open-datasets/CLCD` `[unverified]`; 1985–2022 annual.
- **CCI High Resolution Land Cover (HRLC) — regional pilots** `[unverified]`.

---

## 7. Burned Area / Fire

- **MODIS MCD64A1 Burned Area Monthly**
  - Asset ID: `MODIS/006/MCD64A1` and `MODIS/061/MCD64A1`
  - Coverage: 2000-11–present monthly
  - Resolution: 500 m
  - Schema: Burn date (DOY) per pixel; convert to binary burned/unburned per period.

- **MODIS MOD14A1 Active Fire**
  - Asset ID: `MODIS/061/MOD14A1`
  - Coverage: 2000–present daily
  - Resolution: 1 km
  - Schema: Fire mask with categorical confidence.

- **FIRMS (active fire points, MODIS + VIIRS)**
  - Asset ID: `FIRMS`
  - Coverage: 2000–present
  - Resolution: 1 km / 375 m (VIIRS)
  - Schema: Fire detection confidence; categorical. Mainly point-like.

- **FireCCI51 (ESA CCI Fire)**
  - Asset ID: `ESA/CCI/FireCCI/5_1`
  - Coverage: 2001–2020 monthly `[unverified upper]`
  - Resolution: 250 m
  - Schema: Burn date and confidence; thresholdable to binary.

- **GlobFire (final perimeters)**
  - Catalog ID: community `projects/sat-io/open-datasets/GLOBFIRE` `[unverified]`
  - Coverage: 2001–present
  - Schema: Fire event polygons.

- **MTBS (Monitoring Trends in Burn Severity, US)**
  - Catalog ID: community `projects/sat-io/open-datasets/MTBS` `[unverified]`
  - Coverage: 1984–2022 `[unverified]`
  - Resolution: 30 m
  - Schema: Burn severity classes.

- **Canada NBAC / BA datasets** — community-hosted, regional `[unverified]`.

---

## 8. Snow / Ice / Glaciers

- **MODIS MOD10A1 / MYD10A1 Snow Cover**
  - Asset ID: `MODIS/006/MOD10A1` and `MODIS/061/MOD10A1`
  - Coverage: 2000–present daily
  - Resolution: 500 m
  - Schema: NDSI snow cover (continuous %), discrete flags (snow, no snow, cloud, water, missing).

- **MOD10A2 8-day max snow extent**
  - Asset ID: `MODIS/061/MOD10A2`
  - Schema: Discrete max snow flags.

- **Randolph Glacier Inventory (RGI)**
  - Catalog ID: community `projects/sat-io/open-datasets/RGI` `[unverified]`
  - Coverage: v6 (2017), v7 (2023 release)
  - Schema: Glacier polygons.

- **GLIMS Glacier Database** — community `[unverified]`.

- **NSIDC Sea Ice Concentration (CDR)** — 25 km, very coarse for AE; flag out of scope.

- **Greenland / Antarctic ice sheet masks (MEaSUREs)** — static, regional.

---

## 9. Soil / Soil Moisture / Soil Erosion (discrete-class only)

Most soil products are continuous (SoilGrids properties, SMAP soil moisture).

- **SoilGrids 2.0 — WRB soil class probabilities (most likely class)**
  - Catalog ID: community `projects/soilgrids-isric/wrb_classes` `[unverified]`
  - Provider: ISRIC
  - Coverage: ~2020 (static)
  - Resolution: 250 m
  - Schema: Most-probable WRB Reference Soil Group per pixel (32 classes).

- **OpenLandMap Soil Texture Class (USDA)**
  - Catalog ID: `OpenLandMap/SOL/SOL_TEXTURE-CLASS_USDA-TT_M/v02` `[unverified]`
  - Coverage: static (~2018)
  - Resolution: 250 m
  - Schema: 12 USDA texture classes per depth.

- **GloSEM / Global Soil Erosion (JRC)**
  - Coverage: 2012, 2015 epochs — borderline pre-2017; outputs continuous (t/ha/yr).

- **SMAP / GLDAS soil moisture** — continuous; not a discrete label source.

**Caveat**: at 10 m, 250 m soil class labels heavily over-smooth; document spatial-support mismatch in any candidate using these.

---

## 10. Protected Areas / Conservation

- **WDPA (World Database on Protected Areas)**
  - Asset ID: `WCMC/WDPA/current/polygons` and `..._points`
  - Coverage: continuously updated; monthly releases
  - Resolution: vector
  - Schema: IUCN management categories (Ia, Ib, II, III, IV, V, VI, Not Reported, Not Applicable, Not Assigned).

- **WDPA OECMs** — separate layer if hosted `[unverified]`.
- **Key Biodiversity Areas (KBA)** — typically licensed `[unverified]`.

---

## 11. Coastal / Mangrove / Tidal Flats

- **Global Mangrove Watch** — see §2.
- **Murray Global Tidal Flats** — see §5; ends 2016, borderline.
- **Allen Coral Atlas**
  - Catalog ID: community `projects/sat-io/open-datasets/ACA` `[unverified]`
  - Coverage: ~2020–2022
  - Resolution: 5 m
  - Extent: Global tropical reefs
  - Schema: Geomorphic and benthic classes.
- **Global Coastlines / OSM coastline** — vector reference.

---

## 12. Crops by Type

- **USDA CDL** — see §3.
- **AAFC ACI** — see §3.
- **EU Crop Map (JRC, 2018)** — see §3.
- **WorldCereal** — see §3.
- **MapBiomas Agriculture** — sub-classes for soy, sugarcane, cotton, rice, perennial vs temporary crops in Brazil collections — see §6.
- **Brazil — Pasture/Soy Maps (Trase / Agrosatélite via community)** `[unverified]`.
- **France RPG (Registre Parcellaire Graphique)** — typically not in EE primary catalog `[unverified]`.

---

## 13. Pollution / Air Quality (discrete-class only)

Standard products (Sentinel-5P, MODIS AOD, MERRA-2) are continuous. No
widely-used discrete-class air quality label products are hosted in either
catalog. WHO ambient air quality categorical exceedance maps exist but
are not in GEE.

**Recommendation**: drop unless the study defines its own thresholds (a
methodological choice, not a catalog dataset).

---

## 14. Roads / Infrastructure

- **OpenStreetMap (community-hosted exports)**
  - Catalog ID: community `projects/sat-io/open-datasets/OSM/...` `[unverified]`
  - Coverage: continuously updated
  - Schema: Vector classes by `highway`, `building`, `railway` tags. Vector → rasterise. Completeness varies by region.

- **GRIP Global Roads Inventory Project**
  - Catalog ID: community `projects/sat-io/open-datasets/GRIP4` `[unverified]`
  - Coverage: ~2018 (static)
  - Schema: Road classes 1–5.

- **Microsoft Global Building Footprints**
  - Catalog ID: community `projects/sat-io/open-datasets/MSBuildings/...`
  - Coverage: ongoing releases (2018–present)
  - Schema: Building polygons (binary).

- **Google Open Buildings**
  - Asset ID: `GOOGLE/Research/open-buildings/v3/polygons`
  - Coverage: v3 release ~2023; covers Africa, S/SE Asia, Latin America (regional)
  - Schema: Polygons with confidence.

- **Open Buildings Temporal V1**
  - Asset ID: `GOOGLE/Research/open-buildings-temporal/v1` `[unverified]`
  - Coverage: 2016–2023 annual
  - Resolution: ~4 m raster
  - Schema: Annual building presence/height.

- **Overture Maps (community)** `[unverified]`.

- **Power lines / transmission infrastructure (gridfinder)**
  - Catalog ID: community `projects/sat-io/open-datasets/GRIDFINDER` `[unverified]`
  - Coverage: ~2018–2020 (static)
  - Schema: Predicted MV/HV grid lines.

---

## 15. Marine / Chlorophyll / Ocean (discrete-class only)

Most ocean products are continuous and not appropriate as discrete labels.

- **Allen Coral Atlas** — see §11. Discrete benthic and geomorphic classes; main marine discrete-class product.
- **Global Distribution of Seagrasses (UNEP-WCMC)** — vector, community-hosted `[unverified]`.

Otherwise drop.

---

## Cross-cutting borderline / supporting products

- **WWF HydroSHEDS basin and river layers** — vector hydrography; mask only.
- **Global Surface Water Explorer transitions** — see §5.
- **HydroATLAS** — attribute-rich watershed polygons; mostly continuous.

---

## Summary methodological caveats

1. **Spatial-support mismatch**: many strongest discrete-class products are at 30 m, 100 m, 250 m, or 500 m. Used as labels for 10 m AlphaEarth pixels, they produce mixed-pixel label noise. The screen weights datasets by native resolution.
2. **Label provenance circularity**: Dynamic World, Esri/IO LULC, ESA WorldCover, JRC GFC2020 are themselves Sentinel-2 reflectance derivatives — the same data AlphaEarth embeds. Using them as supervision distils existing classifiers rather than providing independent supervision. Flag prominently per candidate.
3. **Temporal alignment**: many products are static or epoch-based. Pairing 2017–2024 annual embeddings with a single-year label is acceptable for static phenomena but biased for dynamic ones.
4. **Threshold-derived labels**: GHSL Built-S, canopy height, MODIS VCF, soil moisture etc. only become label sources after a thresholding choice — each threshold is a methodological assumption.
5. **Vector-to-raster conversion**: WDPA, OSM, GRIP, HydroLAKES, Open Buildings introduce rasterisation choices that should be documented.
6. **Unverified entries**: items marked `[unverified]` need confirmation against the live catalogs before being cited in per-candidate writeups. This applies especially to exact community-catalog asset paths and to upper-bound years on annually updated products.
