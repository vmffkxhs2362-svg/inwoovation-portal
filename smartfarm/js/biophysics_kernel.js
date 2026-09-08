/**
 * OpenCEA Biophysics & Controlled Environment Agriculture (CEA) Domain Kernel
 * Single Source of Truth (SSOT) for pure thermodynamic, psychrometric, and agronomic calculations.
 * 
 * Standards & References:
 * - DIN V 18599: Energy efficiency of buildings (Greenhouse thermal envelope)
 * - ASAE EP411: Guidelines for Measuring and Reporting Environmental Parameters for Plant Experiments
 * - FAO Irrigation and Drainage Paper No. 56: Penman-Monteith Evapotranspiration
 * - Farquhar, von Caemmerer & Berry (1980): Biochemical model of photosynthetic CO2 assimilation
 * 
 * Architecture Principle: Clean Architecture & Deep Modules
 * - Zero DOM / UI dependencies.
 * - Pure, deterministic, side-effect-free functions.
 * - Universal Module Definition (UMD) compatible with Browser and Node.js.
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.BiophysicsKernel = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  /**
   * Helper: Defensively clamp a number within [min, max], replacing NaN/Infinite with fallback.
   */
  function clamp(val, min, max, fallback) {
    if (typeof val !== 'number' || isNaN(val) || !isFinite(val)) {
      return fallback !== undefined ? fallback : min;
    }
    return Math.max(min, Math.min(max, val));
  }

  /**
   * 1. Vapor Pressure Deficit (VPD)
   * Tetens equation for saturation vapor pressure over water.
   * @param {number} airTempC - Air dry-bulb temperature (°C)
   * @param {number} relativeHumidityPct - Relative humidity (%) [0 - 100]
   * @param {number} leafTempOffsetC - Leaf temperature offset from air temp (°C), typically 0 to 3°C
   * @returns {Object} { airVpdKpa, leafVpdKpa, svpAirKpa, svpLeafKpa, avpKpa }
   */
  function computeVPD(airTempC, relativeHumidityPct, leafTempOffsetC = 2.0) {
    const tAir = clamp(airTempC, -40, 70, 25.0);
    const rh = clamp(relativeHumidityPct, 0, 100, 60.0);
    const offset = clamp(leafTempOffsetC, -10, 10, 2.0);
    const tLeaf = tAir - offset;

    // Tetens formula: SVP = 0.61078 * exp((17.27 * T) / (T + 237.3)) in kPa
    const svpAir = 0.61078 * Math.exp((17.27 * tAir) / (tAir + 237.3));
    const svpLeaf = 0.61078 * Math.exp((17.27 * tLeaf) / (tLeaf + 237.3));
    const avp = svpAir * (rh / 100.0);

    const airVpd = Math.max(0, svpAir - avp);
    const leafVpd = Math.max(0, svpLeaf - avp);

    return {
      airVpdKpa: Number(airVpd.toFixed(3)),
      leafVpdKpa: Number(leafVpd.toFixed(3)),
      svpAirKpa: Number(svpAir.toFixed(3)),
      svpLeafKpa: Number(svpLeaf.toFixed(3)),
      avpKpa: Number(avp.toFixed(3)),
      dewPointC: Number(((237.3 * Math.log(avp / 0.61078)) / (17.27 - Math.log(avp / 0.61078))).toFixed(1))
    };
  }

  /**
   * 2. Daily Light Integral (DLI)
   * Converts instantaneous PPFD to cumulative daily photon fluence.
   * @param {number} ppfd - Photosynthetic Photon Flux Density (µmol/m²/s)
   * @param {number} photoperiodHours - Hours of lighting per 24h cycle (h) [0 - 24]
   * @returns {Object} { dliMolM2Day, totalMicromolesPerDay }
   */
  function computeDLI(ppfd, photoperiodHours) {
    const p = clamp(ppfd, 0, 3000, 300);
    const h = clamp(photoperiodHours, 0, 24, 16);

    // Formula: DLI = PPFD * (photoperiod * 3600) / 1,000,000
    const dli = (p * (h * 3600)) / 1000000.0;
    return {
      dliMolM2Day: Number(dli.toFixed(2)),
      totalMicromolesPerDay: Math.round(p * h * 3600)
    };
  }

  /**
   * 3. Greenhouse Heating Load (DIN V 18599 & NEN 3859 Thermodynamic Kernel)
   * Computes peak transmission heat loss, infiltration air exchange, and thermal screen savings.
   * @param {Object} params
   * @param {number} params.floorAreaM2 - Ground floor area (m²)
   * @param {number} params.gutterHeightM - Gutter height (m)
   * @param {number} params.insideTempC - Inside heating setpoint (°C)
   * @param {number} params.outsideTempC - Outside design winter temperature (°C)
   * @param {number} params.screenClosurePct - Thermal screen closure ratio (%) [0 - 100]
   * @param {string} params.glazingType - Glazing code: 'single_glass', 'double_ar', 'poly_double', 'polycarb_16'
   * @param {number} params.airExchangeRatePerHour - Infiltration air changes per hour (ACH, typically 0.3 - 1.5)
   * @returns {Object} Peak thermal demand, specific load, energy savings, boiler capacity
   */
  function computeHeatingLoad(params = {}) {
    const area = clamp(params.floorAreaM2, 10, 500000, 10000);
    const height = clamp(params.gutterHeightM, 2.0, 15.0, 6.5);
    const tIn = clamp(params.insideTempC, 5.0, 35.0, 18.0);
    const tOut = clamp(params.outsideTempC, -40.0, 30.0, -10.0);
    const screenPct = clamp(params.screenClosurePct, 0, 100, 0);
    const ach = clamp(params.airExchangeRatePerHour, 0.1, 5.0, 0.5);

    // Base U-values (W/m²·K)
    const uValues = {
      single_glass: 6.5,
      double_ar: 3.2,
      poly_double: 4.2,
      polycarb_16: 2.4
    };
    const uBase = uValues[params.glazingType] || 6.5;

    const roofArea = area * 1.15; // standard Venlo roof slope factor (22°)
    const wallArea = 4 * Math.sqrt(area) * height; // perimeter * height
    const totalEnvelopeArea = roofArea + wallArea;

    // Thermal screen energy reduction factor (up to 45% reduction on roof transmission)
    const screenFactor = 1.0 - (screenPct / 100.0) * 0.45;
    const effectiveU = (roofArea * uBase * screenFactor + wallArea * uBase) / totalEnvelopeArea;

    const deltaT = Math.max(0, tIn - tOut);
    const qTransW = totalEnvelopeArea * effectiveU * deltaT;

    // Infiltration loss: Q_inf = rho * Cp * (Volume * ACH / 3600) * deltaT
    // Air density rho = 1.204 kg/m³, Specific heat Cp = 1005 J/kg·K
    const volume = area * height;
    const qInfW = 1.204 * 1005 * (volume * ach / 3600.0) * deltaT;

    const totalPeakW = qTransW + qInfW;
    const peakKw = totalPeakW / 1000.0;
    const specLoadWPerM2 = totalPeakW / area;

    // Unscreened baseline calculation for energy savings comparison
    const unscreenedW = (totalEnvelopeArea * uBase * deltaT) + qInfW;
    const savingsPct = unscreenedW > 0 ? ((unscreenedW - totalPeakW) / unscreenedW) * 100 : 0;
    const boilerBtuPerHour = (totalPeakW * 3.412142) / 1000000.0; // MMBtu/h

    return {
      peakKw: Number(peakKw.toFixed(1)),
      specLoadWPerM2: Number(specLoadWPerM2.toFixed(1)),
      screenSavingsPct: Number(savingsPct.toFixed(1)),
      boilerRatingMMBtu: Number(boilerBtuPerHour.toFixed(2)),
      transmissionLossKw: Number((qTransW / 1000.0).toFixed(1)),
      infiltrationLossKw: Number((qInfW / 1000.0).toFixed(1)),
      totalEnvelopeAreaM2: Math.round(totalEnvelopeArea),
      effectiveUKwM2K: Number(effectiveU.toFixed(2))
    };
  }

  /**
   * 4. CO2 Enrichment Mass Balance Injection
   * @param {Object} params
   * @param {number} params.targetPpm - Desired CO2 concentration (ppm) [400 - 2500]
   * @param {number} params.ambientPpm - Ambient CO2 concentration (ppm) [350 - 600]
   * @param {number} params.greenhouseVolumeM3 - Total greenhouse air volume (m³)
   * @param {number} params.airExchangeRatePerHour - Ventilation air change rate (ACH)
   * @param {number} params.canopyAssimilationRateGPerM2H - Crop net CO2 uptake (g/m²·h, default 3.5)
   * @param {number} params.floorAreaM2 - Crop canopy floor area (m²)
   * @returns {Object} Injection rate in kg/h and g/m²·h
   */
  function computeCO2Injection(params = {}) {
    const target = clamp(params.targetPpm, 400, 2500, 1000);
    const ambient = clamp(params.ambientPpm, 350, 600, 420);
    const volume = clamp(params.greenhouseVolumeM3, 100, 10000000, 65000);
    const ach = clamp(params.airExchangeRatePerHour, 0.05, 30.0, 0.5);
    const area = clamp(params.floorAreaM2, 10, 500000, 10000);
    const cropAssimGPerM2H = clamp(params.canopyAssimilationRateGPerM2H, 0, 15, 3.5);

    const deltaPpm = Math.max(0, target - ambient);
    const co2DensityKgPerM3Ppm = 1.84e-6; // 1.84 kg/m³ at standard room conditions

    // Ventilation leakage loss per hour (kg/h)
    const ventLossKgPerHour = volume * ach * deltaPpm * co2DensityKgPerM3Ppm;
    // Crop canopy uptake per hour (kg/h)
    const cropUptakeKgPerHour = (area * cropAssimGPerM2H) / 1000.0;

    const totalInjectionKgPerHour = ventLossKgPerHour + cropUptakeKgPerHour;
    const injectionGPerM2H = (totalInjectionKgPerHour * 1000.0) / area;

    return {
      injectionKgPerHour: Number(totalInjectionKgPerHour.toFixed(2)),
      injectionGPerM2H: Number(injectionGPerM2H.toFixed(2)),
      ventLossKgPerHour: Number(ventLossKgPerHour.toFixed(2)),
      cropUptakeKgPerHour: Number(cropUptakeKgPerHour.toFixed(2)),
      deltaPpm: Math.round(deltaPpm)
    };
  }

  /**
   * 5. Stock Tank Fertigation & EC Blending Engine
   * @param {Object} params
   * @param {number} params.targetEcMscm - Target dripper EC (mS/cm or dS/m)
   * @param {number} params.rawWaterEcMscm - Source raw water EC (mS/cm)
   * @param {number} params.dilutionRatio - Injector dilution ratio (e.g., 100 for 1:100 stock tanks)
   * @param {number} params.dailyIrrigationLiters - Total irrigation volume per day (L)
   * @returns {Object} Stock tank dosage, total stock concentrate volume needed
   */
  function computeFertigationDilution(params = {}) {
    const targetEc = clamp(params.targetEcMscm, 0.5, 6.0, 2.4);
    const rawEc = clamp(params.rawWaterEcMscm, 0.0, 2.5, 0.3);
    const ratio = clamp(params.dilutionRatio, 10, 1000, 100);
    const waterVol = clamp(params.dailyIrrigationLiters, 100, 10000000, 50000);

    const deltaEc = Math.max(0, targetEc - rawEc);
    const fertilizerGramsPerLiter = deltaEc / 1.2;
    const stockTankConcentrationGPerL = fertilizerGramsPerLiter * ratio;
    const stockTankVolumeNeededLiters = waterVol / ratio;

    return {
      deltaEc: Number(deltaEc.toFixed(2)),
      fertilizerGramsPerLiterDripper: Number(fertilizerGramsPerLiter.toFixed(2)),
      stockConcentrationGPerL: Number(stockTankConcentrationGPerL.toFixed(1)),
      dailyStockConcentrateLiters: Number(stockTankVolumeNeededLiters.toFixed(1)),
      totalDryFertilizerKg: Number(((waterVol * fertilizerGramsPerLiter) / 1000.0).toFixed(1))
    };
  }

  /**
   * 6. LED Supplemental Lighting Efficacy & Heat Dissipation
   * @param {Object} params
   * @param {number} params.targetPpfd - Target photosynthetic photon flux density (µmol/m²/s)
   * @param {number} params.fixtureEfficiency - Fixture efficacy (µmol/J) [typically 2.2 - 3.8]
   * @param {number} params.areaM2 - Growing canopy floor area (m²)
   * @param {number} params.photoperiodHours - Daily operating hours (h)
   * @returns {Object} Connected electrical load (kW), thermal heat dissipation (kW), daily energy (kWh)
   */
  function computeLEDEfficacy(params = {}) {
    const ppfd = clamp(params.targetPpfd, 10, 2000, 220);
    const efficiency = clamp(params.fixtureEfficiency, 1.5, 4.5, 3.2);
    const area = clamp(params.areaM2, 10, 500000, 10000);
    const hours = clamp(params.photoperiodHours, 0, 24, 16);

    const totalMicromolesPerSec = ppfd * area;
    const totalWatts = totalMicromolesPerSec / efficiency;
    const totalKw = totalWatts / 1000.0;
    const specificWattsPerM2 = totalWatts / area;

    const directSensibleHeatKw = totalKw * 0.45;
    const dailyKwh = totalKw * hours;

    return {
      totalElectricalKw: Number(totalKw.toFixed(1)),
      specificElectricalWPerM2: Number(specificWattsPerM2.toFixed(1)),
      sensibleHeatGainKw: Number(directSensibleHeatKw.toFixed(1)),
      dailyEnergyKwh: Number(dailyKwh.toFixed(1)),
      annualMwh: Number(((dailyKwh * 365) / 1000.0).toFixed(1))
    };
  }

  // Public API Export
  return {
    version: '1.0.0',
    clamp: clamp,
    computeVPD: computeVPD,
    computeDLI: computeDLI,
    computeHeatingLoad: computeHeatingLoad,
    computeCO2Injection: computeCO2Injection,
    computeFertigationDilution: computeFertigationDilution,
    computeLEDEfficacy: computeLEDEfficacy
  };
}));
