# Architecture Screen — All SDG Indicators × GEE Architectures (A–G)

**Spine:** post-2025-review framework, 232 unique indicators. See
`../01_sdg_alphaearth_screen/indicators_master.md` for verbatim official
text.

**Letter taxonomy:** A (AE-classification annual area), B (AE-
classification change map), C (direct catalog aggregation), D (vector
overlay + raster aggregation), E (population-weighted exposure), F
(composite multi-function), G (out of scope under any GEE architecture).
See `methodology.md`.

For non-G rows, the row notes the GEE primitive (asset IDs are noted
where high-confidence; flagged `[unverified]` where the asset ID needs
live confirmation per `../01_sdg_alphaearth_screen/catalog_inventory.md`).
For F rows, sub-component letters are listed.

---

## Goal 1. Poverty

| Code | Letter | Primitive / Reason |
|---|---|---|
| 1.1.1 | G | Income survey + price data. |
| 1.2.1 | G | National poverty line; income survey. |
| 1.2.2 | G | Multidimensional poverty index; survey. |
| 1.3.1 | G | Social protection coverage; admin. |
| 1.4.1 | G | Access to basic services; survey ("safely managed" criteria). |
| 1.4.2 | D | (Potential.) Cadastral overlay × population to estimate documented-tenure proportion. Custodian methodology accepts admin/survey only; D is a research-stage alternative, not the official primitive. Honest verdict: G in custodian terms, D as a feasible-on-GEE alternative. |
| 1.5.1 | G | Disaster mortality; vital statistics. *(repeats as 11.5.1, 13.1.1)* |
| 1.5.2 | G | Direct economic loss; admin/insurance. |
| 1.5.3 | G | National DRR strategy adoption. *(repeats as 11.b.1, 13.1.2)* |
| 1.5.4 | G | Local DRR strategy adoption. *(repeats as 11.b.2, 13.1.3)* |
| 1.a.1 | G | ODA grants; finance. |
| 1.a.2 | G | Government essential-services spending; finance. |
| 1.b.1 | G | Pro-poor public social spending; finance. |

## Goal 2. Hunger / Sustainable Agriculture

| Code | Letter | Primitive / Reason |
|---|---|---|
| 2.1.1 | G | Undernourishment prevalence; FAO food balance sheets. |
| 2.1.2 | G | FIES survey. |
| 2.2.1–2.2.4 | G | Anthropometric / dietary surveys. |
| 2.3.1, 2.3.2 | G | Production and income; admin/survey. |
| 2.4.1 | F | Composite of 11 sub-themes (FAO methodology). Cropland-extent denominator: A or C (ESA WorldCereal, ESA WorldCover crop class, USDA CDL, Canada AAFC ACI). Sustainability sub-themes: mostly G (admin/survey); some EO components possible (irrigation, productivity). |
| 2.5.1, 2.5.2 | G | Genetic resources / breed risk; admin/veterinary. |
| 2.a.1, 2.a.2 | G | Agriculture finance. |
| 2.b.1 | G | Trade admin. |
| 2.c.1 | G | Market data. |

## Goal 3. Health

All Goal 3 indicators are mortality, incidence, or service-coverage rates from vital statistics, surveillance, and surveys. **All G.**

Notes: 3.9.1 (air pollution mortality) takes PM2.5 exposure as model input — same EO primitive as 11.6.2 (Architecture E) — but the indicator value itself is a mortality rate, not classified area. Same for 3.9.2 (WASH mortality).

Codes (all G): 3.1.1, 3.1.2, 3.2.1, 3.2.2, 3.3.1–3.3.5, 3.4.1, 3.4.2, 3.5.1, 3.5.2, 3.6.1, 3.7.1, 3.7.2, 3.8.1, 3.8.2, 3.9.1, 3.9.2, 3.9.3, 3.a.1, 3.b.1, 3.b.2, 3.b.3, 3.c.1, 3.d.1, 3.d.2.

## Goal 4. Education

All G. Codes: 4.1.1, 4.1.2, 4.2.1, 4.2.2, 4.3.1, 4.4.1, 4.5.1, 4.6.1, 4.7.1, 4.a.1, 4.b.1, 4.c.1.

## Goal 5. Gender Equality

All G; 5.a.1(a)+(b) (women's land ownership) is sometimes paired with cadastral mapping (potential D), but custodian methodology is sex-disaggregated agricultural population, not area. Codes: 5.1.1, 5.2.1, 5.2.2, 5.3.1, 5.3.2, 5.4.1, 5.5.1, 5.5.2, 5.6.1, 5.6.2, 5.a.1, 5.a.2, 5.b.1, 5.c.1.

## Goal 6. Water and Sanitation

| Code | Letter | Primitive / Reason |
|---|---|---|
| 6.1.1 | G | JMP household survey (drinking water). |
| 6.2.1 | G | JMP household survey (sanitation). |
| 6.3.1 | G | Wastewater treated; admin. |
| 6.3.2 | C | Catalog aggregation: thresholded EO chl-a / turbidity / TSS products to derive water-quality classes per water body. JRC GSW provides the water-body mask; chl-a from Sentinel-3 OLCI / MODIS / OC-CCI. Custodian methodology (UNEP) accepts EO-derived classes as one input; in-situ chemistry remains primary. F if combined with in-situ. |
| 6.4.1 | G | Water-use efficiency; admin/economic. |
| 6.4.2 | C | Direct aggregation of modeled withdrawal/availability per basin (FAO AQUASTAT + EO inputs). Some EO inputs (precipitation, ET) feed the model; output is continuous and aggregated. |
| 6.5.1 | G | IWRM degree; institutional self-reporting. |
| 6.5.2 | G | Transboundary basin operational arrangements; institutional. |
| **6.6.1** | **A** (or **C**) | Change in extent of water-related ecosystems. **A** with AE classification of GSW + GMW + wetland classes; **C** as alternative directly aggregating JRC GSW Yearly History (`JRC/GSW1_4/YearlyHistory`). Primary: A per Study 01. |
| 6.a.1 | G | Water/sanitation ODA. |
| 6.b.1 | G | Local participation policies; institutional. |

## Goal 7. Energy

| Code | Letter | Primitive / Reason |
|---|---|---|
| 7.1.1 | E | Population with electricity access. EO proxy: VIIRS night-time lights (`NOAA/VIIRS/DNB/MONTHLY_V1/VCMSLCFG`) + WorldPop. HREA (Falchetta et al.) is a published implementation. Custodian (IEA/WHO/WBG) accepts EO as proxy when admin/survey unavailable. |
| 7.1.2 | G | Clean fuels; survey. |
| 7.2.1 | G | Renewable energy share; energy balance admin. |
| 7.3.1 | G | Energy intensity; admin. |
| 7.a.1 | G | Clean-energy international finance. |
| 7.b.1 | G | Installed renewable capacity; admin. |

## Goal 8. Economic Growth

All G. Codes: 8.1.1, 8.2.1, 8.3.1, 8.4.1, 8.4.2, 8.5.1, 8.5.2, 8.6.1, 8.7.1, 8.8.1, 8.8.2, 8.9.1, 8.9.2, 8.10.1, 8.10.2, 8.a.1, 8.b.1.

## Goal 9. Infrastructure and Industrialisation

| Code | Letter | Primitive / Reason |
|---|---|---|
| 9.1.1 | D | Rural population within 2 km of all-season road. Rasterise OSM/GRIP roads → 2 km buffer → intersect with WorldPop (`WorldPop/GP/100m/pop`) → aggregate per AOI. |
| 9.1.2 | G | Passenger/freight volumes; transport admin. |
| 9.2.1, 9.2.2 | G | Manufacturing accounts; admin. |
| 9.3.1, 9.3.2 | G | Small-scale industry credit; admin. |
| 9.4.1 | G | CO₂ per unit value added; emissions inventory ÷ GDP. |
| 9.5.1, 9.5.2 | G | R&D / researchers; admin. |
| 9.a.1 | G | International infrastructure support; finance. |
| 9.b.1 | G | High-tech industry share; admin. |
| 9.c.1 | G | Mobile network coverage; operator/admin data. |

## Goal 10. Inequality

All G. Codes: 10.1.1, 10.2.1, 10.3.1, 10.4.1, 10.4.2, 10.5.1, 10.6.1, 10.7.1, 10.7.2, 10.7.3, 10.7.4, 10.a.1, 10.b.1, 10.c.1.

## Goal 11. Sustainable Cities

| Code | Letter | Primitive / Reason |
|---|---|---|
| 11.1.1 | A (proxy) | Urban population in slums / informal settlements / inadequate housing. EO classification of *physical informal-settlement extent* via AE; labels from WSF deprived-area products, IDEAMAPS pilots. Custodian (UN-Habitat) defines slums by 5 household-level criteria; EO produces a *physical-extent proxy*. F if combined with non-EO deprivation criteria. |
| 11.2.1 | D | Convenient access to public transport. WorldPop × transit catchment polygons (where transit network is available; OSM `route=*` tags as proxy). |
| **11.3.1** | **A** | Land consumption rate / population growth rate. Built-up labels (GHSL Built-S, WSF, ESA WorldCover) × WorldPop / GPW denominator. Demonstrated case in `pipeline/main.py`. |
| 11.3.2 | G | Civil-society participation in planning; institutional. |
| 11.4.1 | G | Heritage expenditure; finance. |
| 11.5.1 | G | *Repeat of 1.5.1.* |
| 11.5.2 | G | Direct economic loss; admin. |
| 11.5.3 | B (partial) | Damage to critical infrastructure / disruptions. EO post-disaster damage mapping (Copernicus EMS, AE change-detection per Burns & Kennedy regime) is operational research; custodian counts reported damage events. B as proxy. |
| 11.6.1 | G | Municipal solid waste; admin. |
| 11.6.2 | E | Annual mean PM2.5 / PM10 in cities (population-weighted). Continuous raster from MODIS AOD / Sentinel-5P / MERRA-2 × WorldPop, aggregated by city. |
| 11.7.1 | F | Built-up area open as public space. Sub-components: A (built-up classification of city extent) + D (OSM rasterisation of public open-space tags). |
| 11.7.2 | G | Harassment victimisation; survey. |
| 11.a.1 | G | National urban policies; institutional. |
| 11.b.1 | G | *Repeat of 1.5.3.* |
| 11.b.2 | G | *Repeat of 1.5.4.* |
| 11.c.1 | G | Urban infrastructure ODA; finance. |

## Goal 12. Sustainable Consumption and Production

All G; mostly admin and corporate disclosure. Codes: 12.1.1, 12.2.1, 12.2.2, 12.3.1, 12.4.1, 12.4.2, 12.5.1, 12.6.1, 12.7.1, 12.8.1, 12.a.1, 12.b.1, 12.c.1.

## Goal 13. Climate Action

| Code | Letter | Primitive / Reason |
|---|---|---|
| 13.1.1, 13.1.2, 13.1.3 | G | Repeats of 1.5.1, 1.5.3, 1.5.4. |
| 13.2.1 | G | NDCs/LTSs/NAPs reported to UNFCCC; institutional. |
| 13.2.2 | G (with C-stage research) | Total GHG emissions per year. National inventories are primary; EO methane (TROPOMI), CO₂ (OCO-2/3) are research-stage and not yet accepted as the official primitive. C if the IPCC inventory framework integrates EO inversions. |
| 13.3.1 | G | Education curricula on climate; institutional. |
| 13.a.1, 13.b.1 | G | Climate finance. |

## Goal 14. Life Below Water

| Code | Letter | Primitive / Reason |
|---|---|---|
| 14.1.1 | F | (a) Coastal eutrophication index — C (catalog aggregation of thresholded chl-a anomaly from MODIS / Sentinel-3 OLCI / OC-CCI). (b) Plastic debris density — research-stage; no GEE catalog primitive yet. F overall; (a) component is C-tractable today. |
| 14.2.1 | G | Ecosystem-based marine management adoption; institutional. |
| 14.3.1 | G | Marine acidity (pH); in-situ stations. |
| 14.4.1 | G | Fish stock assessments; non-EO. |
| 14.5.1 | D | MPA × marine area. WDPA marine polygons × EEZ; rasterise both, aggregate. |
| 14.6.1 | G | IUU fishing instrument implementation; institutional. |
| 14.7.1 | G | Sustainable fisheries % GDP; admin. |
| 14.a.1 | G | Marine research budget; admin. |
| 14.b.1 | G | Small-scale fisheries access framework; institutional. |
| 14.c.1 | G | UNCLOS implementation; institutional. |

## Goal 15. Life on Land

| Code | Letter | Primitive / Reason |
|---|---|---|
| **15.1.1** | **A** (or **C**) | Forest area / total land area. **A** with AE classification of forest/non-forest using Hansen GFC, JRC GFC2020, WorldCover labels. **C** as alternative aggregating Hansen tree-cover threshold + loss series directly. Primary: A or C depending on whether local label customisation matters. |
| 15.1.2 | D | Important sites for terrestrial / freshwater biodiversity covered by PAs. KBA polygons × WDPA polygons. |
| 15.2.1 | F | Sustainable forest management. Sub-components: forest area trend (= 15.1.1, A or C); biomass stock (C — GEDI L4 / ESA Biomass CCI continuous, threshold or aggregate); protected forest area (D — WDPA × forest mask); long-term management plan (G — admin); independent certification (G — admin). |
| 15.3.1 | F | Land degradation. Custodian (UNCCD) one-out-all-out across (i) trends in land cover (A or C), (ii) trends in land productivity (C — MODIS NDVI / Copernicus, continuous trend), (iii) trends in carbon stocks (C — SoilGrids continuous / IPCC defaults). Primary letter F; (i) is the AE-classifiable feeder. |
| 15.4.1 | D | KBA mountain × WDPA. |
| **15.4.2(a)** | **A** | Mountain Green Cover Index. AE classification of vegetation/non-vegetation within UNEP-WCMC mountain mask. Labels: ESA WorldCover, Copernicus CGLS-LC100. |
| **15.4.2(b)** | **A** | Proportion of degraded mountain land (added 2025). Same AE classification primitive as 15.3.1(i), restricted to mountain mask. |
| 15.5.1 | G | Red List Index; species assessments. |
| 15.6.1 | G | ABS frameworks; institutional. |
| 15.7.1 | G | Wildlife trade; admin. *(repeats as 15.c.1)* |
| 15.8.1 | G | IAS legislation; institutional. |
| 15.9.1 | G | KMGBF Target 14 alignment; institutional / national accounting. |
| 15.a.1, 15.b.1 | G | Biodiversity ODA + biodiversity-relevant economic instruments; finance. |
| 15.c.1 | G | *Repeat of 15.7.1.* |

## Goal 16. Peace, Justice, Strong Institutions

All G; victimisation surveys, criminal-justice admin, institutional self-reporting. Codes: 16.1.1, 16.1.2, 16.1.3, 16.1.4, 16.2.1, 16.2.2, 16.2.3, 16.3.1, 16.3.2, 16.3.3, 16.4.1, 16.4.2, 16.5.1, 16.5.2, 16.6.1, 16.6.2, 16.7.1, 16.7.2, 16.8.1, 16.9.1, 16.10.1, 16.10.2, 16.a.1, 16.b.1.

## Goal 17. Means of Implementation

All G; finance, trade, technology, capacity, partnership, statistical-capacity metrics from national accounts and admin sources. Codes: 17.1.1, 17.1.2, 17.2.1, 17.3.1, 17.3.2, 17.4.1, 17.5.1, 17.6.1, 17.7.1, 17.8.1, 17.9.1, 17.10.1, 17.11.1, 17.12.1, 17.13.1, 17.14.1, 17.15.1, 17.16.1, 17.17.1, 17.18.1, 17.18.2, 17.18.3, 17.19.1, 17.19.2.

---

## Tally by primary architecture

| Letter | Count | Indicators |
|---|---|---|
| **A** | **6** | 6.6.1, 11.1.1 (proxy), 11.3.1, 15.1.1, 15.4.2(a), 15.4.2(b) |
| **B** | **1** | 11.5.3 (proxy) |
| **C** | **3** | 6.3.2, 6.4.2, (alternative for 6.6.1, 15.1.1) |
| **D** | **6** | 1.4.2 (potential), 5.a.1 (potential), 9.1.1, 11.2.1, 14.5.1, 15.1.2, 15.4.1 — count of 6 if 1.4.2/5.a.1 are excluded as G-primary |
| **E** | **2** | 7.1.1, 11.6.2 |
| **F** | **5** | 2.4.1, 11.7.1, 14.1.1, 15.2.1, 15.3.1 |
| **G** | **~209** | All Goals 3, 4, 5, 8, 10, 12, 16, 17; rest of 1, 2, 6, 7, 9, 11, 13, 14, 15 |

**Non-G total**: ~23 indicators have a defensible GEE-resident primary architecture.

## Notes for the downstream library spec (`library_spec.md`, planned)

- Architecture A and B share the same primitive (AE-classification on
  `GOOGLE/SATELLITE_EMBEDDING/V1/ANNUAL`). One library function with two
  feature-design modes (annual-area vs. baseline-preserving change).
- Architecture C is the cheapest function: parameterised by catalog
  asset ID, AOI, year range, and class set.
- Architecture D needs a vector ingestion + rasterisation utility; OSM
  exports require region/tag scoping; WDPA and KBA are continuously
  updated.
- Architecture E is C plus a population-weighting step.
- Architecture F is a composer: it calls the per-component letter
  functions and combines per the custodian rule (one-out-all-out for
  15.3.1; weighted average for SFM; etc.).

## Comparison to Study 01

Study 01's strict AE-classification screen produced 5–7 IN. Study 02
produces ~6 A indicators (close agreement) plus ~17 indicators tractable
under B–F that Study 01 marked OUT-A-but-flagged-for-Study-02.

The non-trivial finding: AE-classification (A) is the right primary
architecture for ~6 of the 232 indicators. The broader question — "how
much of the SDG framework can we monitor on GEE+GCP" — answers
~23 of 232 (~10%), with the bulk of the EO-tractable indicators sitting
in C, D, and F rather than A.

## Next steps

1. Per-architecture library spec (`library_spec.md`).
2. Confirm letter assignments against the live custodian methodology
   PDFs from the UN SDG Indicators Metadata Repository (presently rely
   on training-cutoff knowledge for several of the C/F decisions).
3. Re-examine the ~12 borderline G-or-D / G-or-E rows (e.g., 1.4.2,
   5.a.1, 13.2.2) once research literature on those EO-proxy approaches
   is reviewed.
