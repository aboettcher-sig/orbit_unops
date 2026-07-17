/**** Ireland built-area + SDG 11.3.1 (LCRPGR) -- Google Earth Engine Code Editor script
 *
 * Paste into https://code.earthengine.google.com and Run. Runs natively in the
 * Code Editor (no Cloud project / Python auth to configure).
 *
 * Mirrors the Python notebook / markdown cells, with two additions:
 *   - MULTIPLE population estimates : World Bank, GHS-POP, WorldPop, GPW v4.11
 *   - MULTIPLE urban-expansion estimates : Random Forest and Dynamic World
 * and a final block computing the SDG 11.3.1 metric for every combination.
 *
 * SDG 11.3.1 (UN-Habitat):
 *   LCR    = (Urb_t1 - Urb_t0) / (Urb_t0 * y)      <- arithmetic, NO log on LCR
 *   PGR    = ln(Pop_t1 / Pop_t0) / y
 *   LCRPGR = LCR / PGR        ( > 1 = sprawl, < 1 = densification )
 *
 * Analysis half runs on a 3-year centered rolling mean of each urban series.
 * LCRPGR is reported both as an ANNUAL time series (consecutive smoothed windows)
 * and over a single ~5-year SPAN. Interactive charts use AREA_SCALE (100 m). The
 * considered final number is produced at AREA_SCALE_BATCH (10 m) by the batch cell,
 * which exports CSVs to Drive. Secondary indicators (built-up per capita, total
 * built-up change) are reported alongside the ratio.
 ****/

// =====================================================================
// Cell 1 -- Config + datasets + Ireland AOI (GAUL level 0)
// =====================================================================
var COUNTRY  = 'Ireland';
var MAP_YEAR = 2018;
// YEARS is set data-driven below (only years AlphaEarth actually has over the AOI),
// so the urban loop never runs on an empty mosaic.
var YEARS;

var SAMPLE_POINTS_PER_CLASS = 1000;      // per class, full-AOI stratified
var SAMPLE_SCALE = 190;                  // ~sqrt(AOI_area_m2 / 2e6); Ireland ~70,000 km^2
var EMBEDDING_SCALE = 10;
var AREA_SCALE = 100;                    // interactive quick-check scale (m); cheap, keeps Code Editor live
var AREA_SCALE_BATCH = 10;               // considered final scale (m); batch export only (heavier compute)
var SPAN_TARGET = 5;                     // desired LCRPGR span length (years), post-smoothing
var TREES = 100;
var SEED  = 42;

var embeddings   = ee.ImageCollection('GOOGLE/SATELLITE_EMBEDDING/V1/ANNUAL');
var ghsBuilt     = ee.Image('JRC/GHSL/P2023A/GHS_BUILT_S_10m/2018').select('built_surface');
var dynamicWorld = ee.ImageCollection('GOOGLE/DYNAMICWORLD/V1');   // 'built' = class-6 probability

// Gridded population products (native to the EE catalog -> real multi-source estimates)
var GHS_POP  = 'JRC/GHSL/P2023A/GHS_POP';                 // 100 m, 'population_count', 5-yr epochs
var WORLDPOP = 'WorldPop/GP/100m/pop';                    // 100 m, 'population', annual
var GPW411   = 'CIESIN/GPWv411/GPW_Population_Count';     // ~1 km, 'population_count', 5-yr epochs

// World Bank SP.POP.TOTL national totals for Ireland.
// NOTE: the Code Editor cannot call the World Bank HTTP API, so these are entered
// manually. The Python notebook fetches them automatically. VERIFY / UPDATE before use.
var WB_POP = {
  2018: 4867309, 2019: 4934340, 2020: 4985382,
  2021: 5028230, 2022: 5127170, 2023: 5223100, 2024: 5308039
};

var aoiFC = ee.FeatureCollection('FAO/GAUL/2015/level0')
              .filter(ee.Filter.eq('ADM0_NAME', COUNTRY));
var aoi = aoiFC.geometry();
Map.setCenter(-8.0, 53.4, 7);   // Ireland center; avoids centroid/ErrorMargin computation

// Data-driven year list: only AlphaEarth years that actually exist over the AOI, >= MAP_YEAR.
// Pull raw millisecond timestamps and extract the year in plain JS (no ee.Date methods).
var _ts = embeddings.filterBounds(aoi).aggregate_array('system:time_start').getInfo();
var _yset = {};
_ts.forEach(function (t) { _yset[new Date(t).getUTCFullYear()] = true; });
YEARS = Object.keys(_yset).map(Number)
          .filter(function (y) { return y >= MAP_YEAR; })
          .sort(function (a, b) { return a - b; });
print('AlphaEarth years available over AOI (>= ' + MAP_YEAR + '):', YEARS);
Map.addLayer(aoi, {color: 'white'}, 'Ireland AOI', false);

// =====================================================================
// Cell 2 -- Helpers
// =====================================================================
function embeddingsByYear(year) {
  var s = ee.Date.fromYMD(year, 1, 1);
  return embeddings.filterDate(s, s.advance(1, 'year')).filterBounds(aoi).mosaic().clip(aoi);
}

function dwBuiltYear(year) {
  var s = ee.Date.fromYMD(year, 1, 1);
  return dynamicWorld.filterDate(s, s.advance(1, 'year')).filterBounds(aoi)
           .select('built').median().gte(0.5).rename('dw').toByte();
}

// national sum of (mask * pixel area), km^2, at a caller-supplied scale
function urbanKm2(mask, scale) {
  scale = scale || AREA_SCALE;
  var m2 = mask.multiply(ee.Image.pixelArea()).reduceRegion({
    reducer: ee.Reducer.sum(), geometry: aoi, scale: scale,
    maxPixels: 1e13, bestEffort: true, tileScale: 8
  }).values().get(0);
  return ee.Number(m2).divide(1e6);
}

// national population sum for one image band
function popSum(img, band, scale) {
  var v = img.select(band).reduceRegion({
    reducer: ee.Reducer.sum(), geometry: aoi, scale: scale,
    maxPixels: 1e13, bestEffort: true, tileScale: 8
  }).get(band);
  return ee.Number(v);
}

// linear interpolation / extrapolation across anchor points [[year, eeNumber], ...]
function interpVal(points, year) {
  var n = points.length;
  function seg(i, j) {
    var y0 = points[i][0], y1 = points[j][0];
    var f = (year - y0) / (y1 - y0);
    return points[i][1].add(points[j][1].subtract(points[i][1]).multiply(f));
  }
  if (year <= points[0][0])   return seg(0, 1);          // extrapolate below first anchor
  if (year >= points[n-1][0]) return seg(n-2, n-1);      // extrapolate above last anchor
  for (var i = 0; i < n - 1; i++) {
    if (year >= points[i][0] && year <= points[i+1][0]) return seg(i, i+1);
  }
  return points[n-1][1];
}

// 3-year centered rolling mean over a {year: ee.Number} dict.
// Drops first and last year (unusable as centers); returns smoothed dict + year list.
function smooth3(rawDict, yearsArr) {
  var out = {}, sm = [];
  for (var i = 1; i < yearsArr.length - 1; i++) {
    var y = yearsArr[i];
    out[y] = rawDict[yearsArr[i-1]].add(rawDict[y]).add(rawDict[yearsArr[i+1]]).divide(3);
    sm.push(y);
  }
  return {dict: out, years: sm};
}

// largest smoothed year <= start + target (falls back to last available smoothed year)
function spanEnd(smYears, startYr, target) {
  var s1 = smYears[smYears.length - 1];
  for (var k = 0; k < smYears.length; k++) {
    if (smYears[k] <= startYr + target) s1 = smYears[k];
  }
  return s1;
}

// ANNUAL LCRPGR on the smoothed series: one row per consecutive smoothed window
// x (method x pop source). Carries LCR, PGR, LCRPGR so the annual ratio is a
// proper time series and its components are inspectable.
function annualLcrpgrRows(method, Usm, smYears, popKeys, popSources) {
  var rows = [];
  for (var i = 0; i < smYears.length - 1; i++) {
    var y0 = smYears[i], y1 = smYears[i+1], span = y1 - y0;
    var lcr = Usm[y1].subtract(Usm[y0]).divide(Usm[y0].multiply(span));
    popKeys.forEach(function (ps) {
      var P0 = popSources[ps](y0), P1 = popSources[ps](y1);
      var pgr = P1.divide(P0).log().divide(span);
      rows.push(ee.Feature(null, {
        id: (y0 + '-' + y1) + '  ' + method + ' / ' + ps,
        label: method + ' / ' + ps,
        window: y0 + '-' + y1,
        mid_year: y0,
        urban_method: method,
        pop_source: ps,
        LCR: lcr, PGR: pgr, LCRPGR: lcr.divide(pgr)
      }));
    });
  }
  return rows;
}

// ~5-year SPAN row per (method x pop source): LCR, PGR, LCRPGR + secondary
// indicators (built-up per capita m^2/person at both ends, total built-up change)
function spanRows(method, Usm, smYears, popKeys, popSources, target) {
  var t0 = smYears[0], t1 = spanEnd(smYears, t0, target), span = t1 - t0;
  var U0 = Usm[t0], U1 = Usm[t1];
  var lcr = U1.subtract(U0).divide(U0.multiply(span));
  var totChg = U1.subtract(U0).divide(U0);          // total change in built-up over span
  var rows = [];
  popKeys.forEach(function (ps) {
    var P0 = popSources[ps](t0), P1 = popSources[ps](t1);
    var pgr = P1.divide(P0).log().divide(span);
    rows.push(ee.Feature(null, {
      label: method + ' / ' + ps, window: t0 + '-' + t1, span: span,
      urban_method: method, pop_source: ps,
      LCR: lcr, PGR: pgr, LCRPGR: lcr.divide(pgr),
      BUpc_t0_m2: U0.multiply(1e6).divide(P0),       // built-up per capita, start
      BUpc_t1_m2: U1.multiply(1e6).divide(P1),       // built-up per capita, end
      BU_total_change: totChg
    }));
  });
  return rows;
}

// accuracy summary for a scored FC: overall accuracy, kappa, and built-class
// producer's / consumer's accuracy, returned as one labelled row
function cmMetrics(name, fc, actualProp, predProp) {
  var cm = fc.errorMatrix(actualProp, predProp, [0, 1]);
  return ee.Feature(null, {
    classifier: name,
    n: fc.size(),
    overall_acc: cm.accuracy(),
    kappa: cm.kappa(),
    PA_built: ee.Array(cm.producersAccuracy()).get([1, 0]),   // reference (GHS) built recall
    CA_built: ee.Array(cm.consumersAccuracy()).get([0, 1])    // predicted built reliability
  });
}

// a confusion matrix rendered as a labelled 2x2 (rows = GHS, cols = prediction)
function cmTable(fc, actualProp, predProp) {
  var a = ee.Array(fc.errorMatrix(actualProp, predProp, [0, 1]).array());
  return ee.FeatureCollection([
    ee.Feature(null, {GHS: '0 not-built', pred_0_notbuilt: a.get([0, 0]), pred_1_built: a.get([0, 1])}),
    ee.Feature(null, {GHS: '1 built',     pred_0_notbuilt: a.get([1, 0]), pred_1_built: a.get([1, 1])})
  ]);
}

// =====================================================================
// Cell 3 -- Train RF on MAP_YEAR GHS labels, then validate RF AND Dynamic World
//           against the held-out GHS labels (same 30% points)
// =====================================================================
var mapImg   = embeddingsByYear(MAP_YEAR);
var bands    = mapImg.bandNames();
var labelImg = ghsBuilt.gt(0).unmask(0).rename('b1').toByte();

var sample = mapImg.addBands(labelImg).stratifiedSample({
  numPoints: SAMPLE_POINTS_PER_CLASS,
  classBand: 'b1',
  classValues: [0, 1],
  classPoints: [SAMPLE_POINTS_PER_CLASS, SAMPLE_POINTS_PER_CLASS],
  region: aoi,
  scale: SAMPLE_SCALE,
  geometries: true,
  seed: SEED,
  tileScale: 16
}).filter(ee.Filter.notNull(bands));

var labeled    = sample.randomColumn('random', SEED);
var training   = labeled.filter(ee.Filter.lt('random', 0.7));
var validation = labeled.filter(ee.Filter.gte('random', 0.7));

// smileRandomForest takes POSITIONAL args:
// (numberOfTrees, variablesPerSplit, minLeafPopulation, bagFraction, maxNodes, seed)
var classifier = ee.Classifier.smileRandomForest(TREES, null, 1, 0.5, null, SEED)
                   .train({features: training, classProperty: 'b1', inputProperties: bands});

// ---- Held-out validation: RF and DW judged at the same 30% points ----
// RF predicts on the held-out split; DW(MAP_YEAR) is then sampled at those same
// points, so both are scored against identical GHS labels on identical geometries.
var valScored = validation.classify(classifier, 'pred');
var valBoth   = dwBuiltYear(MAP_YEAR).sampleRegions({
  collection: valScored, scale: EMBEDDING_SCALE, geometries: false, tileScale: 16
});  // adds 'dw'; drops any point where DW has no data that year

// labelled confusion matrices (rows = GHS label, cols = prediction)
print(ui.Chart.feature.byFeature(cmTable(valBoth, 'b1', 'pred'),
      'GHS', ['pred_0_notbuilt', 'pred_1_built'])
  .setChartType('Table')
  .setOptions({title: 'Confusion matrix: RF vs GHS ' + MAP_YEAR + ' (held-out)'}));
print(ui.Chart.feature.byFeature(cmTable(valBoth, 'b1', 'dw'),
      'GHS', ['pred_0_notbuilt', 'pred_1_built'])
  .setChartType('Table')
  .setOptions({title: 'Confusion matrix: Dynamic World vs GHS ' + MAP_YEAR + ' (held-out)'}));

// side-by-side accuracy summary: overall accuracy, kappa, built-class PA / CA
var accFC = ee.FeatureCollection([
  cmMetrics('RF vs GHS', valBoth, 'b1', 'pred'),
  cmMetrics('DW vs GHS', valBoth, 'b1', 'dw')
]);
print(ui.Chart.feature.byFeature(accFC, 'classifier',
      ['overall_acc', 'kappa', 'PA_built', 'CA_built', 'n'])
  .setChartType('Table')
  .setOptions({title: 'Held-out accuracy vs GHS ' + MAP_YEAR + ' labels: RF and Dynamic World'}));

// =====================================================================
// Cell 4 -- Urban area per year (RF, DW) at AREA_SCALE, plus 3-yr smoothing
//   Interactive quick-look at AREA_SCALE (100 m). The considered 10 m number
//   comes from the batch cell below. Raw and smoothed are charted separately
//   (smoothed has fewer years) so no series mixes numbers with nulls.
// =====================================================================
var urbRF = {}, urbDW = {};
YEARS.forEach(function (y) {
  var rfMask = embeddingsByYear(y).classify(classifier).rename('built');
  urbRF[y] = urbanKm2(rfMask, AREA_SCALE);
  urbDW[y] = urbanKm2(dwBuiltYear(y), AREA_SCALE);
});

// 3-year centered rolling mean (first and last year drop out as centers)
var smRF = smooth3(urbRF, YEARS), smDW = smooth3(urbDW, YEARS);
var SM_YEARS = smRF.years;
var urbRFs = smRF.dict, urbDWs = smDW.dict;
print('Smoothed years (3-yr centered):', SM_YEARS);

var urbanRawFC = ee.FeatureCollection(YEARS.map(function (y) {
  return ee.Feature(null, {year: y, RF_raw: urbRF[y], DW_raw: urbDW[y]});
}));
var urbanSmFC = ee.FeatureCollection(SM_YEARS.map(function (y) {
  return ee.Feature(null, {year: y, RF_sm: urbRFs[y], DW_sm: urbDWs[y]});
}));

print(ui.Chart.feature.byFeature(urbanRawFC, 'year', ['RF_raw', 'DW_raw'])
  .setChartType('LineChart')
  .setOptions({
    title: 'Annual urban area, Ireland (km^2) -- RAW @ ' + AREA_SCALE + ' m',
    hAxis: {title: 'Year', format: '####'},
    vAxis: {title: 'Urban area (km^2)'},
    series: {0: {color: '#fdae61'}, 1: {color: '#abd9e9'}},
    lineWidth: 2, pointSize: 5
  }));

print(ui.Chart.feature.byFeature(urbanSmFC, 'year', ['RF_sm', 'DW_sm'])
  .setChartType('LineChart')
  .setOptions({
    title: 'Annual urban area, Ireland (km^2) -- 3-yr SMOOTHED @ ' + AREA_SCALE + ' m',
    hAxis: {title: 'Year', format: '####'},
    vAxis: {title: 'Urban area (km^2)'},
    series: {0: {color: '#d7191c'}, 1: {color: '#2c7bb6'}},
    lineWidth: 2, pointSize: 5
  }));

print(ui.Chart.feature.byFeature(urbanRawFC, 'year', ['RF_raw', 'DW_raw'])
  .setChartType('Table').setOptions({title: 'Urban area by year (km^2): raw'}));
print(ui.Chart.feature.byFeature(urbanSmFC, 'year', ['RF_sm', 'DW_sm'])
  .setChartType('Table').setOptions({title: 'Urban area by year (km^2): 3-yr smoothed'}));

// optional: visualize first/last RF built maps
Map.addLayer(embeddingsByYear(YEARS[0]).classify(classifier).selfMask(),
             {palette: ['#d7191c']}, 'RF built ' + YEARS[0], false);
Map.addLayer(embeddingsByYear(YEARS[YEARS.length-1]).classify(classifier).selfMask(),
             {palette: ['#2c7bb6']}, 'RF built ' + YEARS[YEARS.length-1], false);

// =====================================================================
// Cell 5 -- Population per year: World Bank + GHS-POP + WorldPop + GPW v4.11
//   Gridded products are summed at two anchor epochs (2015, 2020) and
//   linearly inter/extrapolated to each year, so trajectories are comparable.
// =====================================================================
var ghsAnchors = [
  [2015, popSum(ee.ImageCollection(GHS_POP).filterDate('2015-01-01','2016-01-01').first(), 'population_count', 100)],
  [2020, popSum(ee.ImageCollection(GHS_POP).filterDate('2020-01-01','2021-01-01').first(), 'population_count', 100)]
];
var gpwAnchors = [
  [2015, popSum(ee.ImageCollection(GPW411).filterDate('2015-01-01','2016-01-01').first(), 'population_count', 1000)],
  [2020, popSum(ee.ImageCollection(GPW411).filterDate('2020-01-01','2021-01-01').first(), 'population_count', 1000)]
];
var wpAnchors = [
  [2015, popSum(ee.ImageCollection(WORLDPOP).filterBounds(aoi).filter(ee.Filter.eq('year', 2015)).select('population').mosaic(), 'population', 100)],
  [2020, popSum(ee.ImageCollection(WORLDPOP).filterBounds(aoi).filter(ee.Filter.eq('year', 2020)).select('population').mosaic(), 'population', 100)]
];

// pop source -> function(year) -> ee.Number
// WorldBank is a manual dict; if a (data-driven) year is missing from it, fall back
// to the nearest year present so the script never hits ee.Number(undefined).
function wbPop(y) {
  if (WB_POP[y] !== undefined) return ee.Number(WB_POP[y]);
  var ks = Object.keys(WB_POP).map(Number);
  var nearest = ks.reduce(function (a, b) { return Math.abs(b - y) < Math.abs(a - y) ? b : a; });
  print('WorldBank: no entry for ' + y + '; using nearest year ' + nearest +
        ' (add ' + y + ' to WB_POP for an exact value).');
  return ee.Number(WB_POP[nearest]);
}

var popSources = {
  'WorldBank': function (y) { return wbPop(y); },
  'GHS_POP':   function (y) { return interpVal(ghsAnchors, y); },
  'WorldPop':  function (y) { return interpVal(wpAnchors,  y); },
  'GPW_v411':  function (y) { return interpVal(gpwAnchors, y); }
};
var POP_KEYS = ['WorldBank', 'GHS_POP', 'WorldPop', 'GPW_v411'];   // no dots/hyphens (EE property-name rule)

var popFC = ee.FeatureCollection(YEARS.map(function (y) {
  var props = {year: y};
  POP_KEYS.forEach(function (k) { props[k] = popSources[k](y); });
  return ee.Feature(null, props);
}));

print(ui.Chart.feature.byFeature(popFC, 'year', POP_KEYS)
  .setChartType('LineChart')
  .setOptions({
    title: 'Annual population, Ireland (persons)',
    hAxis: {title: 'Year', format: '####'},
    vAxis: {title: 'Population'},
    lineWidth: 2, pointSize: 5
  }));

print(ui.Chart.feature.byFeature(popFC, 'year', POP_KEYS)
  .setChartType('Table')
  .setOptions({title: 'Population by year (persons): 4 sources'}));

// =====================================================================
// Cell 6 -- SDG 11.3.1 LCRPGR on the 3-yr smoothed series
//   (a) ANNUAL : LCRPGR time series over consecutive smoothed windows
//   (b) ~5-YEAR : single-span LCRPGR + secondary indicators
//   Both per (urban method x population source). Interactive view uses the
//   AREA_SCALE (100 m) smoothed series from Cell 4.
// =====================================================================

// (a) ANNUAL LCRPGR time series
var annualFC = ee.FeatureCollection(
  annualLcrpgrRows('RF', urbRFs, SM_YEARS, POP_KEYS, popSources)
   .concat(annualLcrpgrRows('DW', urbDWs, SM_YEARS, POP_KEYS, popSources))
);
print(ui.Chart.feature.groups(annualFC, 'mid_year', 'LCRPGR', 'label')
  .setChartType('LineChart')
  .setOptions({
    title: 'ANNUAL LCRPGR (3-yr smoothed)  (>1 sprawl, <1 densification)',
    hAxis: {title: 'Window start year', format: '####'},
    vAxis: {title: 'LCRPGR'},
    lineWidth: 2, pointSize: 4, interpolateNulls: true
  }));
print(ui.Chart.feature.byFeature(annualFC, 'id', ['LCR', 'PGR', 'LCRPGR'])
  .setChartType('Table')
  .setOptions({title: 'ANNUAL LCRPGR components by window / method / pop source'}));

// (b) ~5-YEAR SPAN LCRPGR + secondary indicators
var spanFC = ee.FeatureCollection(
  spanRows('RF', urbRFs, SM_YEARS, POP_KEYS, popSources, SPAN_TARGET)
   .concat(spanRows('DW', urbDWs, SM_YEARS, POP_KEYS, popSources, SPAN_TARGET))
);
print(ui.Chart.feature.groups(spanFC, 'pop_source', 'LCRPGR', 'urban_method')
  .setChartType('ColumnChart')
  .setOptions({
    title: '~5-YEAR SPAN LCRPGR (smoothed)  (>1 sprawl, <1 densification)',
    hAxis: {title: 'Population source'}, vAxis: {title: 'LCRPGR'},
    series: {0: {color: '#d7191c'}, 1: {color: '#2c7bb6'}}
  }));
print(ui.Chart.feature.byFeature(spanFC, 'label',
      ['LCR', 'PGR', 'LCRPGR', 'BUpc_t0_m2', 'BUpc_t1_m2', 'BU_total_change'])
  .setChartType('Table')
  .setOptions({title: '~5-YEAR SPAN: LCRPGR + secondary indicators (built-up per capita m^2/person, total change)'}));

print('Reading: annual LCRPGR is a year-over-year series on the smoothed areas; ' +
      'the ~5-year span is the single considered ratio. >1 = sprawl, <1 = densification. ' +
      'Secondary indicators (built-up per capita, total change) are steadier than the ratio when PGR is near zero. ' +
      'Span actually used is the "span" column (falls back below ' + SPAN_TARGET +
      ' if the smoothed series is shorter).');

// =====================================================================
// Cell 7 -- BATCH: considered 10 m SDG numbers -> Drive CSV
//   10 m reduceRegion is too heavy to print, so the smoothed series, annual
//   LCRPGR, and ~5-yr span are assembled server-side and exported. Run the
//   tasks from the Tasks tab.
// =====================================================================
var DO_BATCH_10M = true;
if (DO_BATCH_10M) {
  var urbRF10 = {}, urbDW10 = {};
  YEARS.forEach(function (y) {
    var rfMask = embeddingsByYear(y).classify(classifier).rename('built');
    urbRF10[y] = urbanKm2(rfMask, AREA_SCALE_BATCH);
    urbDW10[y] = urbanKm2(dwBuiltYear(y), AREA_SCALE_BATCH);
  });
  var smRF10 = smooth3(urbRF10, YEARS), smDW10 = smooth3(urbDW10, YEARS);
  var SMY10 = smRF10.years;

  // per-year smoothed areas (km^2) at 10 m
  var area10FC = ee.FeatureCollection(SMY10.map(function (y) {
    return ee.Feature(null, {year: y, RF_sm_km2: smRF10.dict[y], DW_sm_km2: smDW10.dict[y]});
  }));

  // annual LCRPGR at 10 m
  var annual10FC = ee.FeatureCollection(
    annualLcrpgrRows('RF', smRF10.dict, SMY10, POP_KEYS, popSources)
     .concat(annualLcrpgrRows('DW', smDW10.dict, SMY10, POP_KEYS, popSources))
  );

  // ~5-yr span LCRPGR + secondary indicators at 10 m
  var span10FC = ee.FeatureCollection(
    spanRows('RF', smRF10.dict, SMY10, POP_KEYS, popSources, SPAN_TARGET)
     .concat(spanRows('DW', smDW10.dict, SMY10, POP_KEYS, popSources, SPAN_TARGET))
  );

  Export.table.toDrive({collection: area10FC,   description: 'ireland_area10m_smoothed',  fileFormat: 'CSV'});
  Export.table.toDrive({collection: annual10FC, description: 'ireland_LCRPGR_annual_10m', fileFormat: 'CSV'});
  Export.table.toDrive({collection: span10FC,   description: 'ireland_LCRPGR_5yr_10m',    fileFormat: 'CSV'});
  print('Batch 10 m: three export tasks created. Open the Tasks tab and Run them.');
}

// =====================================================================
// Cell 8 -- OPTIONAL : export the per-year RF built layers as one asset
//   Off by default. Set DO_EXPORT = true to submit (batch compute cost applies).
// =====================================================================
var DO_EXPORT = false;
if (DO_EXPORT) {
  var stack = null;
  YEARS.forEach(function (y) {
    var b = embeddingsByYear(y).classify(classifier).rename('built_' + y).toByte();
    stack = stack ? stack.addBands(b) : b;
  });
  Export.image.toAsset({
    image: stack.clip(aoi),
    description: 'ireland_built_predicted',
    assetId: 'projects/REPLACE-WITH-YOUR-PROJECT/assets/ireland_built_predicted',
    region: aoi,
    scale: EMBEDDING_SCALE,
    maxPixels: 1e13
  });
  print('Export task created -> open the Tasks tab and click Run.');
}
