# Master Screen — SDG Indicators × AlphaEarth Annual Classification

**Spine:** post-2025-review framework, 232 unique indicators (244 with
repeats; 12 indicator codes repeat across two or three targets and are
counted once). See `indicators_master.md` for the verbatim official text
of every indicator; this file applies the C1–C5 screen from
`methodology.md`.

## Verdict legend

| Tag | Meaning |
|-----|---------|
| **IN** | Passes C1–C5. AE classification is the appropriate primitive; per-candidate writeup in `candidates/`. |
| **PARTIAL** | Passes C1–C4 but fails C5 (no catalog label with AE temporal overlap, or label dataset has significant caveats), or passes C5 only after a methodologically loaded threshold or definitional choice. Per-candidate writeup with caveats. |
| **OUT-A** | Fails C1–C4 in a way no catalog dataset could remedy. No path under any GEE architecture. |
| **OUT→Bn** | Fails the AE-classification screen but is plausibly tractable under another GEE architecture. Letter (B–F) refers to the Study 02 taxonomy in `../02_sdg_gee_architecture_screen/README.md`. Carried forward there; not pursued here. |

Indicators tagged `*(repeats)*` are evaluated once on first appearance and
cross-referenced where they recur.

---

## Goal 1. Poverty

| Code | Verdict | Reasoning |
|---|---|---|
| 1.1.1 | OUT-A | International poverty line is income survey + price data; no EO architecture. |
| 1.2.1 | OUT-A | National poverty line; survey-derived. |
| 1.2.2 | OUT-A | Multidimensional poverty index; non-EO components dominate. |
| 1.3.1 | OUT-A | Social protection coverage; admin records. |
| 1.4.1 | OUT-A | Access to basic services; survey-derived ("safely managed" criteria). |
| 1.4.2 | OUT→D | Tenure rights; cadastral data + survey. Possible cadastral-overlay framing under D, but the indicator value is a survey-perception proportion; flag for Study 02. |
| 1.5.1 | OUT-A | Disaster mortality; vital statistics. *(repeats as 11.5.1, 13.1.1)* |
| 1.5.2 | OUT-A | Direct economic loss; admin/insurance records. |
| 1.5.3 | OUT-A | National DRR strategy adoption; institutional. *(repeats as 11.b.1, 13.1.2)* |
| 1.5.4 | OUT-A | Local DRR strategy adoption; institutional. *(repeats as 11.b.2, 13.1.3)* |
| 1.a.1 | OUT-A | ODA grants share of GNI; finance. |
| 1.a.2 | OUT-A | Government spending on essential services; finance. |
| 1.b.1 | OUT-A | Pro-poor public social spending; finance. |

## Goal 2. Hunger / Food Security / Sustainable Agriculture

| Code | Verdict | Reasoning |
|---|---|---|
| 2.1.1 | OUT-A | Undernourishment prevalence; FAO food balance sheets. |
| 2.1.2 | OUT-A | Food Insecurity Experience Scale; survey. |
| 2.2.1 | OUT-A | Stunting; anthropometric survey. |
| 2.2.2 | OUT-A | Wasting/overweight; anthropometric survey. |
| 2.2.3 | OUT-A | Anaemia prevalence; clinical survey. |
| 2.2.4 | OUT-A | Minimum dietary diversity; dietary survey. |
| 2.3.1 | OUT-A | Production per labour unit; admin/census. |
| 2.3.2 | OUT-A | Income of small-scale producers; admin/survey. |
| **2.4.1** | **PARTIAL** | "Proportion of agricultural area under productive and sustainable agriculture": agricultural area component is EO-classifiable (cropland mask from WorldCereal, ESA WorldCover crop class, CDL/AAFC), but custodian methodology (FAO) is a composite of 11 sub-themes including economic and social dimensions. The land-cover component is in scope but only as a feeder to a Study 02 Architecture-F composite. |
| 2.5.1 | OUT-A | Genetic resources in conservation facilities; admin. |
| 2.5.2 | OUT-A | Local breeds at risk; veterinary survey. |
| 2.a.1 | OUT-A | Agriculture orientation index; finance. |
| 2.a.2 | OUT-A | Official flows to agriculture; finance. |
| 2.b.1 | OUT-A | Export subsidies; trade admin. |
| 2.c.1 | OUT-A | Food price anomalies; market data. |

## Goal 3. Health and Well-Being

All Goal 3 indicators are mortality, incidence, or coverage rates derived from vital statistics, surveillance, or surveys; none have a per-pixel land-surface classification primitive. **All OUT-A** (3.1.1, 3.1.2, 3.2.1, 3.2.2, 3.3.1–3.3.5, 3.4.1, 3.4.2, 3.5.1, 3.5.2, 3.6.1, 3.7.1, 3.7.2, 3.8.1, 3.8.2, 3.9.1, 3.9.2, 3.9.3, 3.a.1, 3.b.1, 3.b.2, 3.b.3, 3.c.1, 3.d.1, 3.d.2). Note: 3.9.1 (mortality from air pollution) and 3.9.2 (mortality from unsafe WASH) have spatial exposure layers as inputs to the *exposure* models (see 11.6.2 for PM2.5; 6.1.1/6.2.1 for WASH) but the indicator itself is a mortality rate, not a classified area.

## Goal 4. Education

All Goal 4 indicators are participation, completion, proficiency, or service-coverage rates from education ministries and household surveys. **All OUT-A** (4.1.1, 4.1.2, 4.2.1, 4.2.2, 4.3.1, 4.4.1, 4.5.1, 4.6.1, 4.7.1, 4.a.1, 4.b.1, 4.c.1).

## Goal 5. Gender Equality

All Goal 5 indicators are survey-, legal-framework-, or admin-derived. **All OUT-A** (5.1.1, 5.2.1, 5.2.2, 5.3.1, 5.3.2, 5.4.1, 5.5.1, 5.5.2, 5.6.1, 5.6.2, 5.a.1, 5.a.2, 5.b.1, 5.c.1). 5.a.1(a) (women's land ownership) is sometimes paired with cadastral mapping in research literature, but the indicator value is a sex-disaggregated proportion of *agricultural population*, not of land area; OUT-A here, possibly OUT→D in Study 02 if a cadastral-overlay framing is adopted.

## Goal 6. Water and Sanitation

| Code | Verdict | Reasoning |
|---|---|---|
| 6.1.1 | OUT-A | Safely managed drinking water services; JMP household-survey methodology. |
| 6.2.1 | OUT-A | Safely managed sanitation; JMP survey. |
| 6.3.1 | OUT-A | Wastewater treated; admin. |
| 6.3.2 | PARTIAL | "Bodies of water with good ambient water quality": custodian (UNEP) accepts EO-derived chl-a and turbidity proxies as one input class, but the rated quality classification follows in-situ chemistry. Per-pixel classification of inland water bodies into "good / not good" via AE is technically possible but C5 weak: catalog label products at the resolution and frequency the custodian methodology requires are absent. Flag and watch. |
| 6.4.1 | OUT-A | Water-use efficiency; admin/economic. |
| 6.4.2 | OUT→E | Water stress; modeled withdrawal/availability ratio. Architecture E in Study 02. |
| 6.5.1 | OUT-A | IWRM degree; institutional self-reporting. |
| 6.5.2 | OUT-A | Transboundary basin operational arrangements; institutional. |
| **6.6.1** | **IN** | "Change in the extent of water-related ecosystems over time": custodian (UNEP) defines the indicator as area of permanent surface water, seasonal water, vegetated wetlands, mangroves, and rivers/estuaries — five discrete classes, all per-pixel-classifiable from AE embeddings. Catalog labels for AE training: JRC GSW Yearly History (`JRC/GSW1_4/YearlyHistory`, 1984–2022, 30 m), Global Mangrove Watch annual (community catalog, 2015–2020), and global wetland products. AE temporal overlap holds (2017–2022 with GSW). |
| 6.a.1 | OUT-A | Water/sanitation ODA; finance. |
| 6.b.1 | OUT-A | Local participation policies; institutional. |

## Goal 7. Energy

| Code | Verdict | Reasoning |
|---|---|---|
| 7.1.1 | OUT→D | Population with electricity access. VIIRS night-lights products + WorldPop pairings exist (e.g., HREA — Falchetta et al.) but custodian methodology (IEA/WHO/WBG) accepts these only as proxies; primary source is admin/survey. Architecture D/E in Study 02. |
| 7.1.2 | OUT-A | Clean fuels & technology; survey. |
| 7.2.1 | OUT-A | Renewable energy share; energy balance admin. |
| 7.3.1 | OUT-A | Energy intensity; energy + GDP admin. |
| 7.a.1 | OUT-A | International financial flows for clean energy; finance. |
| 7.b.1 | OUT-A | Installed renewable capacity; admin. |

## Goal 8. Economic Growth and Decent Work

All Goal 8 indicators are macroeconomic, labour-market, or financial-inclusion metrics from national accounts and labour surveys. **All OUT-A** (8.1.1, 8.2.1, 8.3.1, 8.4.1, 8.4.2, 8.5.1, 8.5.2, 8.6.1, 8.7.1, 8.8.1, 8.8.2, 8.9.1, 8.9.2, 8.10.1, 8.10.2, 8.a.1, 8.b.1). 8.4.1 and 8.4.2 (material footprint, domestic material consumption) repeat as 12.2.1 and 12.2.2 and are derived from material flow accounts, not EO.

## Goal 9. Infrastructure and Industrialisation

| Code | Verdict | Reasoning |
|---|---|---|
| 9.1.1 | OUT→D | Rural population within 2 km of all-season road. Tractable on GEE: rasterise OSM/GRIP roads, compute 2 km buffer, intersect with WorldPop (`WorldPop/GP/100m/pop`), aggregate per AOI. Architecture D in Study 02. |
| 9.1.2 | OUT-A | Passenger and freight volumes; transport admin. |
| 9.2.1 | OUT-A | Manufacturing value added; national accounts. |
| 9.2.2 | OUT-A | Manufacturing employment; labour stats. |
| 9.3.1 | OUT-A | Small-scale industries' share of value added; admin. |
| 9.3.2 | OUT-A | Small-scale industries with credit; admin. |
| 9.4.1 | OUT-A | CO₂ per unit value added; emissions inventory ÷ GDP. |
| 9.5.1 | OUT-A | R&D expenditure; admin. |
| 9.5.2 | OUT-A | Researchers per million; admin. |
| 9.a.1 | OUT-A | International support to infrastructure; finance. |
| 9.b.1 | OUT-A | Medium- and high-tech industry share; admin. |
| 9.c.1 | OUT-A | Population covered by mobile network; operator/admin data. |

## Goal 10. Inequality

All Goal 10 indicators are income/income-distribution, financial-soundness, migration-policy, or remittance metrics from surveys, administrative records, and international organisations. **All OUT-A** (10.1.1, 10.2.1, 10.3.1, 10.4.1, 10.4.2, 10.5.1, 10.6.1, 10.7.1, 10.7.2, 10.7.3, 10.7.4, 10.a.1, 10.b.1, 10.c.1). 10.7.4 (refugees by country of origin) is admin (UNHCR), not EO; refugee-camp mapping research exists but is not the indicator.

## Goal 11. Sustainable Cities and Communities

| Code | Verdict | Reasoning |
|---|---|---|
| 11.1.1 | PARTIAL | "Urban population in slums, informal settlements or inadequate housing": EO mapping of deprived urban areas is an active research literature (e.g., IDEAMAPS, WSF deprived-area products), and AE classification of informal-settlement morphology is plausible. C1 challenge: custodian (UN-Habitat) defines slums by five household-level deprivation criteria; classifying *physical* informal settlement is not the same as classifying *slum* in the indicator sense. C5: no catalog label dataset implements the UN-Habitat definition globally. Flag. |
| 11.2.1 | OUT→D | Convenient access to public transport. WorldPop + transit catchment polygons (where available); Architecture D/E in Study 02. |
| **11.3.1** | **IN** | Ratio of land consumption rate to population growth rate. Demonstrated case in `pipeline/main.py`. Built-up labels: GHSL Built-S (`JRC/GHSL/P2023A/...`), WSF 2019 (`DLR/WSF/...`), ESA WorldCover built class (`ESA/WorldCover/v200`). Population denominator from WorldPop or Gridded Population of the World. |
| 11.3.2 | OUT-A | Cities with civil-society participation in planning; institutional. |
| 11.4.1 | OUT-A | Heritage expenditure; finance. |
| 11.5.1 | OUT-A | *Repeat of 1.5.1.* |
| 11.5.2 | OUT-A | Direct economic loss; admin. |
| 11.5.3 | OUT-A | Damage to critical infrastructure / disruptions. EO post-disaster damage mapping is operational (e.g., Copernicus Emergency Mapping Service) but indicator value is reported damage counts and disruption events, not classified area; OUT-A here. |
| 11.6.1 | OUT-A | Municipal solid waste collected & managed; admin. |
| 11.6.2 | OUT→E | Annual mean PM2.5/PM10 in cities. Continuous raster (Sentinel-5P, MODIS AOD-derived, MERRA-2); population-weighted exposure. Architecture E in Study 02. |
| 11.7.1 | PARTIAL | Built-up area open as public space, by AOI. Built-up component AE-classifiable (see 11.3.1); "open space for public use" component requires either OSM tag-based rasterisation (Architecture D) or contested classification of recreational/green vs. private/non-public; UN-Habitat methodology accepts OSM-based open-space mapping. Mixed AE + D; flag for hybrid treatment. |
| 11.7.2 | OUT-A | Harassment victimisation; survey. |
| 11.a.1 | OUT-A | Countries with national urban policies; institutional. |
| 11.b.1 | OUT-A | *Repeat of 1.5.3.* |
| 11.b.2 | OUT-A | *Repeat of 1.5.4.* |
| 11.c.1 | OUT-A | ODA in support of urban infrastructure; finance. |

## Goal 12. Sustainable Consumption and Production

All Goal 12 indicators are policy adoption, material flow, hazardous waste, recycling, sustainability reporting, and procurement metrics from admin and corporate disclosures. **All OUT-A** (12.1.1, 12.2.1, 12.2.2, 12.3.1, 12.4.1, 12.4.2, 12.5.1, 12.6.1, 12.7.1, 12.8.1, 12.a.1, 12.b.1, 12.c.1).

## Goal 13. Climate Action

| Code | Verdict | Reasoning |
|---|---|---|
| 13.1.1 | OUT-A | *Repeat of 1.5.1.* |
| 13.1.2 | OUT-A | *Repeat of 1.5.3.* |
| 13.1.3 | OUT-A | *Repeat of 1.5.4.* |
| 13.2.1 | OUT-A | Countries with NDCs/LTSs/NAPs reported to UNFCCC; institutional. |
| 13.2.2 | OUT-A | Total GHG emissions per year. Reported national inventories; EO-derived flux estimates exist (TROPOMI, OCO-2/3) but custodian methodology is the inventory. OUT-A; possibly OUT→C in a future architecture if EO inventories are accepted. |
| 13.3.1 | OUT-A | Education curricula on climate; institutional. |
| 13.a.1 | OUT-A | $100B mobilisation; finance. |
| 13.b.1 | OUT-A | Support to LDCs/SIDS; finance. |

## Goal 14. Life Below Water

| Code | Verdict | Reasoning |
|---|---|---|
| 14.1.1 | PARTIAL | (a) Coastal eutrophication index (chl-a anomaly): continuous EO product (MODIS, Sentinel-3 OLCI), Architecture C/E. (b) Floating plastic debris density: not yet operational from EE catalog; active research. AE classification adds little to either component. Flag; mostly OUT→C/E in Study 02. |
| 14.2.1 | OUT-A | Countries using ecosystem-based marine management; institutional. |
| 14.3.1 | OUT-A | Marine acidity (pH) at sampling stations; in-situ. |
| 14.4.1 | OUT-A | Fish stocks within sustainable levels; stock assessments. |
| 14.5.1 | OUT→D | MPA coverage of marine areas. Vector overlay: WDPA marine + EEZ. Architecture D in Study 02. |
| 14.6.1 | OUT-A | IUU fishing instrument implementation; institutional. |
| 14.7.1 | OUT-A | Sustainable fisheries % GDP; admin. |
| 14.a.1 | OUT-A | Marine research budget %; admin. |
| 14.b.1 | OUT-A | Small-scale fisheries access framework; institutional. |
| 14.c.1 | OUT-A | UNCLOS implementation; institutional. |

## Goal 15. Life on Land

| Code | Verdict | Reasoning |
|---|---|---|
| **15.1.1** | **IN** | Forest area as proportion of total land area. Custodian (FAO) accepts global EO products as inputs to FRA reporting. Catalog labels for AE training: Hansen Global Forest Change (`UMD/hansen/global_forest_change_2023_v1_11`), JRC GFC2020 (`JRC/GFC2020/V1`), JRC TMF (regional, pan-tropics), ESA WorldCover tree class. AE temporal overlap holds. The "direct catalog aggregation" alternative (Hansen tree-cover threshold + loss series) is also valid and is the typical implementation today; AE re-classification is justified where higher per-pixel separability or local label customisation is needed. |
| 15.1.2 | OUT→D | KBA × WDPA terrestrial overlay; Architecture D in Study 02. |
| 15.2.1 | PARTIAL | "Progress towards sustainable forest management": composite of five sub-indicators (forest area trend, biomass stock, protected forest area, forest under long-term management plan, forest under independent certification). Forest-area-trend sub-indicator overlaps 15.1.1; biomass is continuous EO (GEDI, ESA Biomass CCI) and not classification; remaining three are admin. Architecture F in Study 02; OUT-A under narrow Study 01 scope except for the area-trend feeder. |
| **15.3.1** | **IN** (LULC component) | Proportion of land that is degraded over total land area. Custodian (UNCCD) methodology is one-out-all-out across three sub-indicators: (i) trends in land cover; (ii) trends in land productivity; (iii) trends in carbon stocks above and below ground. **The land-cover sub-indicator (i) is per-pixel-classifiable from AE embeddings** with catalog labels (ESA CCI LC, Copernicus CGLS-LC100, MapBiomas, NLCD, CORINE) covering AE-overlapping years. Sub-indicators (ii) and (iii) are continuous and non-AE; full indicator is Architecture F in Study 02. Per Study 01 scope, mark IN for the (i) sub-indicator only and reference Study 02 for the composite. |
| 15.4.1 | OUT→D | KBA mountain × WDPA overlay; Architecture D in Study 02. |
| **15.4.2(a)** | **IN** | Mountain Green Cover Index. Custodian (FAO) defines the index as the ratio of green vegetation pixels to total mountain pixels per UNEP-WCMC mountain classification, year-over-year. Vegetation-vs-non-vegetation is per-pixel-classifiable from AE embeddings; mountain mask is fixed (UNEP-WCMC). Catalog labels for vegetation/non-vegetation training: ESA WorldCover, Copernicus CGLS-LC100, MapBiomas (where regional). |
| **15.4.2(b)** | **IN** | Proportion of degraded mountain land (added in 2025 review). Same architecture as 15.3.1 sub-indicator (i), restricted to the UNEP-WCMC mountain mask. |
| 15.5.1 | OUT-A | Red List Index; species assessments. |
| 15.6.1 | OUT-A | ABS frameworks; institutional. |
| 15.7.1 | OUT-A | Wildlife poaching/trafficking; admin. *(repeats as 15.c.1)* |
| 15.8.1 | OUT-A | IAS legislation; institutional. |
| 15.9.1 | OUT-A | KMGBF Target 14 alignment; institutional/national accounting. |
| 15.a.1 | OUT-A | ODA on biodiversity; finance. |
| 15.b.1 | OUT-A | ODA on biodiversity; finance. |
| 15.c.1 | OUT-A | *Repeat of 15.7.1.* |

## Goal 16. Peace, Justice and Strong Institutions

All Goal 16 indicators are crime/victimisation, justice, governance, corruption, or institutional metrics from victimisation surveys, criminal-justice admin, and institutional self-reporting. **All OUT-A** (16.1.1, 16.1.2, 16.1.3, 16.1.4, 16.2.1, 16.2.2, 16.2.3, 16.3.1, 16.3.2, 16.3.3, 16.4.1, 16.4.2, 16.5.1, 16.5.2, 16.6.1, 16.6.2, 16.7.1, 16.7.2, 16.8.1, 16.9.1, 16.10.1, 16.10.2, 16.a.1, 16.b.1).

## Goal 17. Means of Implementation

All Goal 17 indicators are finance, trade, technology, capacity, partnership, and statistical-capacity metrics from national accounts, customs, telecoms admin, OECD DAC reporting, and ministry self-reporting. **All OUT-A** (17.1.1, 17.1.2, 17.2.1, 17.3.1, 17.3.2, 17.4.1, 17.5.1, 17.6.1, 17.7.1, 17.8.1, 17.9.1, 17.10.1, 17.11.1, 17.12.1, 17.13.1, 17.14.1, 17.15.1, 17.16.1, 17.17.1, 17.18.1, 17.18.2, 17.18.3, 17.19.1, 17.19.2).

---

## Tally

| Verdict | Count | Notes |
|---|---|---|
| **IN** | **5** | 6.6.1, 11.3.1, 15.1.1, 15.3.1 (LULC sub-indicator), 15.4.2 (a) Mountain Green Cover Index + (b) proportion of degraded mountain land. The 5th counts the (a)+(b) of 15.4.2 as a single indicator code with two AE-classifiable components. |
| **PARTIAL** | **6** | 2.4.1 (composite — feeder only), 6.3.2 (water quality, weak C5), 11.1.1 (slums — definitional), 11.7.1 (built-up open space — hybrid), 14.1.1 (continuous + research-stage components), 15.2.1 (forest mgmt composite). |
| **OUT→B–F** (carries to Study 02) | **~12** | 1.4.2 (D), 5.a.1 (D — possibly), 6.4.2 (E), 7.1.1 (D/E), 9.1.1 (D), 11.2.1 (D/E), 11.6.2 (E), 13.2.2 (C — speculative), 14.1.1 (C/E partial overlap), 14.5.1 (D), 15.1.2 (D), 15.4.1 (D). |
| **OUT-A** | **~209** | All Goals 3, 4, 5, 8, 10, 12, 16, 17 in full; remainder of Goals 1, 2, 6, 7, 9, 11, 13, 14, 15. |

Counts are approximate at the boundary between OUT-A and OUT→B–F because
some judgements are debatable (e.g., 1.4.2 and 5.a.1 are listed twice in
narrative form but each gets a single verdict line above). The
authoritative entries are the per-indicator rows; the tally is an aid
to the reader.

## Next steps in Study 01

1. Per-candidate writeups for the 5 IN indicators in `candidates/`.
2. Per-candidate writeups for the 6 PARTIAL indicators in `candidates/`,
   each with explicit C5 caveats.
3. `literature.md` — peer-reviewed and preprint AE-utility studies, with
   benchmark notes per IN/PARTIAL indicator where applicable.
4. `references.md` — every UN methodology PDF, EE catalog page, and
   literature item cited, with retrieval URLs and access dates.
5. `README.md` — synthesis: priority order for IN candidates,
   recommended next experiment, key dependencies on Study 02.
