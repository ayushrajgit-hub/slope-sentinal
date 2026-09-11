import { useState, useCallback, useRef, useMemo } from 'react';
import { motion, useInView } from 'framer-motion';
import ControlPanel from './ControlPanel';
import GISMap from './GISMap';
import './Simulation.css';

function getTimeStr() {
  const d = new Date();
  return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

/* ── Legacy Heuristic Risk ─────────────────────────────────── */
function computeLegacyRisk(rainfall, soilMoisture) {
  const rainfallFactor = Math.pow(rainfall / 200, 1.3) * 60;
  const soilFactor = Math.pow(soilMoisture / 100, 1.2) * 40;
  return Math.min(100, Math.max(0, rainfallFactor + soilFactor));
}

/* ── Stage 1: Atmospheric Transformer (mock) ────────────────── */
function predictRainfall(temperature, humidity) {
  const t = Math.max(-10, Math.min(50, temperature));
  const h = Math.max(0, Math.min(100, humidity));

  // Simplified Tetens formula for saturated vapor pressure
  const es = 6.112 * Math.exp((17.67 * t) / (t + 243.5));
  const ea = es * (h / 100.0);

  // Base rainfall potential: exponential rise as humidity → 100%
  const hNorm = Math.min(h / 100.0, 1.0);
  const basePotential = 200.0 * Math.pow(hNorm, 3.5);

  // Temperature amplification (warmer air → more moisture capacity)
  const tempFactor = Math.max(0.1, 0.3 + 0.7 * Math.min(Math.max((t + 10) / 60.0, 0), 1.0));

  const r6h = Math.round(Math.min(200, basePotential * tempFactor * 0.5) * 10) / 10;
  const r12h = Math.round(Math.min(200, basePotential * tempFactor * 0.75) * 10) / 10;
  const r24h = Math.round(Math.min(200, basePotential * tempFactor * 1.0) * 10) / 10;

  // Convert intensity → rainfall probability (sigmoid: 0mm→~5%, 100mm→~75%, 200mm→~95%)
  const toProb = (mm) => Math.round(Math.min(98, Math.max(2, 100 / (1 + Math.exp(-(mm - 60) / 30)))));

  return {
    r6h, r12h, r24h,
    p6h: toProb(r6h),
    p12h: toProb(r12h),
    p24h: toProb(r24h),
  };
}

/* ── Stage 2: Context-Aware Risk (XGBoost / LightGBM) ───────── */
function computeXGBoostRisk(predictedRainfall24h, slopeAngle, elevation = 1500, soilCohesion = 25, ndvi = 0.5, deforestation = 0) {
  // 1. Predicted Rainfall Intensity feature (0–200 mm/hr from Stage 1 Transformer)
  const rainNorm = Math.min(predictedRainfall24h / 200.0, 1.0);
  const rainFeature = Math.pow(rainNorm, 1.2);

  // 2. Slope angle feature (15°–60° from DEM)
  const slopeNorm = Math.min(Math.max((slopeAngle - 15) / 45.0, 0), 1.0);
  const slopeFeature = Math.pow(slopeNorm, 1.1);

  // 3. Elevation feature (200m–3000m from DEM)
  const elevNorm = Math.min(Math.max((elevation - 200) / 2800.0, 0), 1.0);

  // 4. Soil properties (Cohesion c': 5–50 kPa; lower cohesion = higher vulnerability)
  const soilNorm = Math.min(Math.max((50 - soilCohesion) / 45.0, 0), 1.0);

  // 5. NDVI vegetation cover (0.2–0.8; lower NDVI = barren slope = higher vulnerability)
  const vegNorm = Math.min(Math.max((0.8 - ndvi) / 0.6, 0), 1.0);

  // 6. Deforestation / Land Cover Change (0–100%; higher loss = higher vulnerability)
  const deforestNorm = Math.min(Math.max(deforestation / 100.0, 0), 1.0);

  // 7. Historical landslide data prior (spatial recurrence baseline for NH-29 corridor, 127 events)
  const historyPrior = 0.45;

  // Multi-factor gradient boosting logit combination
  const logit = (
    rainFeature * 3.2 +
    slopeFeature * 2.6 +
    soilNorm * 1.8 +
    deforestNorm * 1.6 +
    elevNorm * 1.2 +
    vegNorm * 1.1 +
    historyPrior * 0.8 -
    3.4 // model calibration bias
  );

  // Sigmoid activation mapping logit to Landslide Probability (0–100%)
  const probability = 1.0 / (1.0 + Math.exp(-logit));
  const riskScore = Math.round(Math.min(100, Math.max(0, probability * 100)) * 10) / 10;

  return { riskScore };
}

function getRiskBand(score) {
  if (score < 30) return 'Low Risk Zone';
  if (score < 60) return 'Medium Risk Zone';
  if (score < 85) return 'High Risk Zone';
  return 'Critical Risk Zone';
}

export default function Simulation() {
  /* ── Engine Mode ─────────────────────────────────── */
  const [engineMode, setEngineMode] = useState('piml'); // 'piml' | 'legacy'

  /* ── Legacy Inputs ────────────────────────────────── */
  const [rainfall, setRainfall] = useState(15);
  const [soilMoisture, setSoilMoisture] = useState(20);

  /* ── PIML Stage 1 Inputs ──────────────────────────── */
  const [temperature, setTemperature] = useState(25);
  const [humidity, setHumidity] = useState(45);

  /* ── PIML Stage 2 Inputs ──────────────────────────── */
  const [slopeAngle, setSlopeAngle] = useState(30);
  const [soilCohesion, setSoilCohesion] = useState(25);
  const [ndvi, setNdvi] = useState(0.5);
  const [elevation, setElevation] = useState(1500);
  const [deforestation, setDeforestation] = useState(0);

  /* ── Shared ───────────────────────────────────────── */
  const [logEntries, setLogEntries] = useState([]);
  const prevBandRef = useRef('LOW');

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  /* ── Computed Values ──────────────────────────────── */
  const predicted = useMemo(
    () => predictRainfall(temperature, humidity),
    [temperature, humidity]
  );

  const mlResult = useMemo(
    () => computeXGBoostRisk(predicted.r24h, slopeAngle, elevation, soilCohesion, ndvi, deforestation),
    [predicted.r24h, slopeAngle, elevation, soilCohesion, ndvi, deforestation]
  );

  const riskScore = engineMode === 'piml'
    ? mlResult.riskScore
    : computeLegacyRisk(rainfall, soilMoisture);

  const riskBand = getRiskBand(riskScore);

  /* ── Logger ──────────────────────────────────────── */
  const addLog = useCallback((message, type = 'info') => {
    setLogEntries(prev => {
      const next = [...prev, { time: getTimeStr(), message, type }];
      return next.slice(-50);
    });
  }, []);

  /* ── Risk band change handler ────────────────────── */
  const checkBandChange = useCallback((newScore) => {
    const band = getRiskBand(newScore);
    if (band !== prevBandRef.current) {
      prevBandRef.current = band;
      if (band === 'Critical Risk Zone') {
        addLog(`⚠ CRITICAL RISK ZONE. Triggering DEOC SMS payload & CAP v1.2 broadcast.`, 'critical');
        addLog(`Cell broadcasting initiated for sectors NH-29 Km 12-62. Evacuation advisory.`, 'critical');
      } else if (band === 'High Risk Zone') {
        addLog(`Risk escalated → High Risk Zone. Generating 10×10m heatmap overlay.`, 'warning');
      } else if (band === 'Medium Risk Zone') {
        addLog(`Medium Risk Zone. Enhanced monitoring active. Sensor polling → 30s interval.`, 'info');
      } else {
        addLog(`De-escalated → Low Risk Zone. Nominal monitoring resumed.`, 'success');
      }
    }
  }, [addLog]);

  /* ── Legacy Handlers ──────────────────────────────── */
  const handleRainfallChange = useCallback((value) => {
    setRainfall(value);
    const risk = computeLegacyRisk(value, soilMoisture);
    if (value > 150) addLog(`Rainfall intensity: ${value}mm/hr. EXTREME threshold exceeded.`, 'critical');
    else if (value > 100) addLog(`Rainfall intensity: ${value}mm/hr. HIGH threshold exceeded.`, 'warning');
    else if (value > 50) addLog(`Rainfall intensity: ${value}mm/hr. Moderate alert threshold.`, 'warning');
    checkBandChange(risk);
  }, [soilMoisture, addLog, checkBandChange]);

  const handleSoilMoistureChange = useCallback((value) => {
    setSoilMoisture(value);
    const risk = computeLegacyRisk(rainfall, value);
    if (value > 80) addLog(`Soil saturation: ${value}%. Critical permeability threshold breached.`, 'critical');
    else if (value > 60) addLog(`Soil saturation: ${value}%. Transient seepage risk elevated.`, 'warning');
    checkBandChange(risk);
  }, [rainfall, addLog, checkBandChange]);

  /* ── AI Cascade Stage 1 Handlers ──────────────────── */
  const handleTemperatureChange = useCallback((value) => {
    setTemperature(value);
    const pred = predictRainfall(value, humidity);
    addLog(`Pre-Rainfall Intelligence: T=${value}°C, RH=${humidity}% → Rainfall probability +24h = ${pred.p24h}%`, 'info');
    const result = computeXGBoostRisk(pred.r24h, slopeAngle, elevation, soilCohesion, ndvi, deforestation);
    checkBandChange(result.riskScore);
  }, [humidity, slopeAngle, elevation, soilCohesion, ndvi, deforestation, addLog, checkBandChange]);

  const handleHumidityChange = useCallback((value) => {
    setHumidity(value);
    const pred = predictRainfall(temperature, value);
    addLog(`Pre-Rainfall Intelligence: T=${temperature}°C, RH=${value}% → Rainfall probability +24h = ${pred.p24h}%`, 'info');
    if (value > 85) addLog(`Humidity ${value}% approaching saturation. High convective activity expected.`, 'warning');
    const result = computeXGBoostRisk(pred.r24h, slopeAngle, elevation, soilCohesion, ndvi, deforestation);
    checkBandChange(result.riskScore);
  }, [temperature, slopeAngle, elevation, soilCohesion, ndvi, deforestation, addLog, checkBandChange]);

  /* ── AI Cascade Stage 2 Handlers (Multi-Factor XGBoost) ── */
  const handleSlopeAngleChange = useCallback((value) => {
    setSlopeAngle(value);
    const result = computeXGBoostRisk(predicted.r24h, value, elevation, soilCohesion, ndvi, deforestation);
    addLog(`Context-Aware Risk: Slope=${value}°, Landslide Risk=${result.riskScore}%`, 'info');
    if (value > 45) addLog(`Slope angle ${value}° exceeds critical threshold. Gravitational stress dominant.`, 'warning');
    checkBandChange(result.riskScore);
  }, [predicted.r24h, elevation, soilCohesion, ndvi, deforestation, addLog, checkBandChange]);

  const handleSoilCohesionChange = useCallback((value) => {
    setSoilCohesion(value);
    const result = computeXGBoostRisk(predicted.r24h, slopeAngle, elevation, value, ndvi, deforestation);
    addLog(`Context-Aware Risk: Soil c'=${value} kPa, Landslide Risk=${result.riskScore}%`, 'info');
    if (value < 12) addLog(`Soil cohesion ${value} kPa critically low. Shear strength compromised.`, 'critical');
    checkBandChange(result.riskScore);
  }, [predicted.r24h, slopeAngle, elevation, ndvi, deforestation, addLog, checkBandChange]);

  const handleNdviChange = useCallback((value) => {
    setNdvi(value);
    const result = computeXGBoostRisk(predicted.r24h, slopeAngle, elevation, soilCohesion, value, deforestation);
    addLog(`Context-Aware Risk: NDVI=${value.toFixed(2)}, Landslide Risk=${result.riskScore}%`, 'info');
    if (value < 0.3) addLog(`NDVI ${value.toFixed(2)} — Barren slope. Root reinforcement negligible.`, 'warning');
    checkBandChange(result.riskScore);
  }, [predicted.r24h, slopeAngle, elevation, soilCohesion, deforestation, addLog, checkBandChange]);

  const handleElevationChange = useCallback((value) => {
    setElevation(value);
    const result = computeXGBoostRisk(predicted.r24h, slopeAngle, value, soilCohesion, ndvi, deforestation);
    addLog(`Context-Aware Risk: Elev=${value}m, Landslide Risk=${result.riskScore}%`, 'info');
    if (value > 2500) addLog(`Elevation ${value}m — High-altitude zone. Enhanced gravitational gradient.`, 'warning');
    checkBandChange(result.riskScore);
  }, [predicted.r24h, slopeAngle, soilCohesion, ndvi, deforestation, addLog, checkBandChange]);

  const handleDeforestationChange = useCallback((value) => {
    setDeforestation(value);
    const result = computeXGBoostRisk(predicted.r24h, slopeAngle, elevation, soilCohesion, ndvi, value);
    addLog(`Context-Aware Risk: Deforestation=${value}%, Landslide Risk=${result.riskScore}%`, 'info');
    if (value > 60) addLog(`Deforestation ${value}% — Severe vegetation loss. Root cohesion critically degraded.`, 'critical');
    checkBandChange(result.riskScore);
  }, [predicted.r24h, slopeAngle, elevation, soilCohesion, ndvi, addLog, checkBandChange]);

  /* ── Engine Mode Switch ──────────────────────────── */
  const handleEngineToggle = useCallback((mode) => {
    setEngineMode(mode);
    if (mode === 'piml') {
      addLog(`Engine switched to AI Cascade. Two-stage prediction pipeline active.`, 'success');
      addLog(`Stage 1: Pre-Rainfall Intelligence (Transformer) → Stage 2: Context-Aware Risk (XGBoost/LightGBM)`, 'info');
    } else {
      addLog(`Engine switched to Legacy Heuristic. Direct rainfall/saturation mode.`, 'info');
    }
  }, [addLog]);

  return (
    <section className="simulation section" id="simulation" ref={ref}>
      <div className="container">
        <motion.div
          className="simulation__header"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <span className="section-label">Interactive Demo</span>
          <h2>Live Simulation Dashboard</h2>
          <p className="simulation__subtitle">
            Toggle between AI Cascade (Transformer + XGBoost) and Legacy Heuristic engines.
            Adjust Pre-Rainfall Intelligence and Context-Aware Risk parameters in real-time.
          </p>
        </motion.div>

        <motion.div
          className="simulation__split"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Left: Scrollable Controls */}
          <div className="simulation__controls">
            <ControlPanel
              engineMode={engineMode}
              onEngineToggle={handleEngineToggle}
              rainfall={rainfall}
              soilMoisture={soilMoisture}
              onRainfallChange={handleRainfallChange}
              onSoilMoistureChange={handleSoilMoistureChange}
              temperature={temperature}
              humidity={humidity}
              onTemperatureChange={handleTemperatureChange}
              onHumidityChange={handleHumidityChange}
              predicted={predicted}
              slopeAngle={slopeAngle}
              soilCohesion={soilCohesion}
              ndvi={ndvi}
              elevation={elevation}
              deforestation={deforestation}
              onSlopeAngleChange={handleSlopeAngleChange}
              onSoilCohesionChange={handleSoilCohesionChange}
              onNdviChange={handleNdviChange}
              onElevationChange={handleElevationChange}
              onDeforestationChange={handleDeforestationChange}
              riskScore={riskScore}
              logEntries={logEntries}
            />
          </div>

          {/* Right: Sticky Pinned Map */}
          <div className="simulation__map">
            <GISMap
              rainfall={engineMode === 'piml' ? predicted.r24h : rainfall}
              soilMoisture={engineMode === 'piml' ? 50 : soilMoisture}
              riskScore={riskScore}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
