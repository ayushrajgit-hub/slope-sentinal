import RiskGauge from './RiskGauge';
import SystemLog from './SystemLog';

export default function ControlPanel({
  engineMode,
  onEngineToggle,
  /* Legacy */
  rainfall,
  soilMoisture,
  onRainfallChange,
  onSoilMoistureChange,
  /* PIML Stage 1 */
  temperature,
  humidity,
  onTemperatureChange,
  onHumidityChange,
  predicted,
  /* PIML Stage 2 — Context-Aware Risk */
  slopeAngle,
  soilCohesion,
  ndvi,
  elevation,
  deforestation,
  onSlopeAngleChange,
  onSoilCohesionChange,
  onNdviChange,
  onElevationChange,
  onDeforestationChange,
  /* Shared */
  riskScore,
  logEntries,
}) {
  const isPiml = engineMode === 'piml';

  return (
    <div className="control-panel">
      {/* ── Engine Toggle ───────────────────────────────────── */}
      <div className="engine-toggle">
        <span className="engine-toggle__label">Engine Mode</span>
        <div className="engine-toggle__switch">
          <button
            className={`engine-toggle__btn ${isPiml ? 'engine-toggle__btn--active' : ''}`}
            onClick={() => onEngineToggle('piml')}
          >
            <span className="engine-toggle__dot" />
            AI Cascade (ML)
          </button>
          <button
            className={`engine-toggle__btn ${!isPiml ? 'engine-toggle__btn--active engine-toggle__btn--legacy' : ''}`}
            onClick={() => onEngineToggle('legacy')}
          >
            <span className="engine-toggle__dot" />
            Legacy Heuristic
          </button>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════
          PIML CASCADE MODE
          ═══════════════════════════════════════════════════════ */}
      {isPiml ? (
        <>
          {/* ── Stage 1: Atmospheric Transformer ────────────── */}
          <div className="stage-card">
            <div className="stage-card__number">01</div>
            <div className="stage-card__header">
              <h4 className="stage-card__title">Pre-Rainfall Intelligence</h4>
              <div className="processing-badge">
                <span className="processing-badge__dot" />
                <span>Transformer (Time-Series ML)</span>
              </div>
            </div>

            <div className="control-panel__sliders">
              <div className="slider-group">
                <div className="slider-group__header">
                  <label className="slider-group__label">Ambient Temperature</label>
                  <span className="slider-group__value">
                    {temperature} <small>°C</small>
                  </span>
                </div>
                <input
                  type="range"
                  min="-10"
                  max="50"
                  value={temperature}
                  onChange={(e) => onTemperatureChange(Number(e.target.value))}
                  className="slider slider--cyan"
                  id="temperature-slider"
                />
                <div className="slider-group__ticks">
                  <span>-10</span><span>10</span><span>25</span><span>40</span><span>50</span>
                </div>
              </div>

              <div className="slider-group">
                <div className="slider-group__header">
                  <label className="slider-group__label">Relative Humidity</label>
                  <span className="slider-group__value">
                    {humidity} <small>%</small>
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={humidity}
                  onChange={(e) => onHumidityChange(Number(e.target.value))}
                  className="slider slider--cyan"
                  id="humidity-slider"
                />
                <div className="slider-group__ticks">
                  <span>0</span><span>25</span><span>50</span><span>75</span><span>100</span>
                </div>
              </div>
            </div>

            {/* Predicted Rainfall Output Row */}
            <div className="predicted-row">
              <span className="predicted-row__label">Predicted Rainfall Probability</span>
              <div className="predicted-row__chips">
                <div className="horizon-chip">
                  <span className="horizon-chip__label">+6 hrs</span>
                  <span className="horizon-chip__value">{predicted.p6h}<small>%</small></span>
                </div>
                <div className="horizon-chip">
                  <span className="horizon-chip__label">+12 hrs</span>
                  <span className="horizon-chip__value">{predicted.p12h}<small>%</small></span>
                </div>
                <div className="horizon-chip horizon-chip--primary">
                  <span className="horizon-chip__label">+24 hrs</span>
                  <span className="horizon-chip__value">{predicted.p24h}<small>%</small></span>
                </div>
              </div>
            </div>

            {/* Connector line between stages */}
            <div className="stage-connector">
              <div className="stage-connector__line" />
              <span className="stage-connector__label">AUTO-BIND ▼</span>
              <div className="stage-connector__line" />
            </div>
          </div>

          {/* ── Stage 2: Geotechnical XGBoost ──────────────── */}
          <div className="stage-card stage-card--stage2">
            <div className="stage-card__number">02</div>
            <div className="stage-card__header">
              <h4 className="stage-card__title">Context-Aware Risk (Multi-Factor ML)</h4>
              <div className="processing-badge processing-badge--amber">
                <span className="processing-badge__dot" />
                <span>XGBoost / LightGBM</span>
              </div>
            </div>

            {/* Auto-bound rainfall + historical data readout */}
            <div className="auto-bind-readout">
              <span className="auto-bind-readout__label">Predicted Rainfall (from Stage 1)</span>
              <span className="auto-bind-readout__value">{predicted.r24h} <small>mm/hr (+24h)</small></span>
            </div>
            <div className="auto-bind-readout auto-bind-readout--historical">
              <span className="auto-bind-readout__label">Historical Landslide Records</span>
              <span className="auto-bind-readout__value">127 <small>events (2015–2025)</small></span>
            </div>

            <div className="control-panel__sliders">
              <div className="slider-group">
                <div className="slider-group__header">
                  <label className="slider-group__label">Slope (DEM)</label>
                  <span className="slider-group__value">
                    {slopeAngle} <small>°</small>
                  </span>
                </div>
                <input
                  type="range"
                  min="15"
                  max="60"
                  value={slopeAngle}
                  onChange={(e) => onSlopeAngleChange(Number(e.target.value))}
                  className="slider slider--cyan"
                  id="slope-angle-slider"
                />
                <div className="slider-group__ticks">
                  <span>15°</span><span>25°</span><span>35°</span><span>45°</span><span>60°</span>
                </div>
              </div>

              <div className="slider-group">
                <div className="slider-group__header">
                  <label className="slider-group__label">Elevation (DEM)</label>
                  <span className="slider-group__value">
                    {elevation} <small>m</small>
                  </span>
                </div>
                <input
                  type="range"
                  min="200"
                  max="3000"
                  step="50"
                  value={elevation}
                  onChange={(e) => onElevationChange(Number(e.target.value))}
                  className="slider slider--cyan"
                  id="elevation-slider"
                />
                <div className="slider-group__ticks">
                  <span>200m</span><span>900m</span><span>1500m</span><span>2200m</span><span>3000m</span>
                </div>
              </div>

              <div className="slider-group">
                <div className="slider-group__header">
                  <label className="slider-group__label">Soil / Geology (c′)</label>
                  <span className="slider-group__value">
                    {soilCohesion} <small>kPa</small>
                  </span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="50"
                  value={soilCohesion}
                  onChange={(e) => onSoilCohesionChange(Number(e.target.value))}
                  className="slider slider--cyan"
                  id="soil-cohesion-slider"
                />
                <div className="slider-group__ticks">
                  <span>5</span><span>15</span><span>25</span><span>35</span><span>50</span>
                </div>
              </div>

              <div className="slider-group">
                <div className="slider-group__header">
                  <label className="slider-group__label">Vegetation Cover (NDVI)</label>
                  <span className="slider-group__value">
                    {ndvi.toFixed(2)} <small>{ndvi < 0.35 ? 'Barren' : ndvi < 0.55 ? 'Sparse' : 'Dense'}</small>
                  </span>
                </div>
                <input
                  type="range"
                  min="0.2"
                  max="0.8"
                  step="0.01"
                  value={ndvi}
                  onChange={(e) => onNdviChange(Number(e.target.value))}
                  className="slider slider--green"
                  id="ndvi-slider"
                />
                <div className="slider-group__ticks">
                  <span>0.2</span><span>0.35</span><span>0.5</span><span>0.65</span><span>0.8</span>
                </div>
              </div>

              <div className="slider-group">
                <div className="slider-group__header">
                  <label className="slider-group__label">Deforestation / Land Cover Change</label>
                  <span className="slider-group__value">
                    {deforestation} <small>%</small>
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={deforestation}
                  onChange={(e) => onDeforestationChange(Number(e.target.value))}
                  className="slider slider--red"
                  id="deforestation-slider"
                />
                <div className="slider-group__ticks">
                  <span>0%</span><span>25%</span><span>50%</span><span>75%</span><span>100%</span>
                </div>
                <div className="slider-group__tooltip">
                  🌿 Monitoring vegetation loss assists <strong>Forest & Environment Departments</strong> in preventive planning.
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        /* ═══════════════════════════════════════════════════════
           LEGACY HEURISTIC MODE
           ═══════════════════════════════════════════════════════ */
        <div className="stage-card stage-card--legacy">
          <div className="stage-card__header">
            <h4 className="stage-card__title">Direct Heuristic Controls</h4>
            <div className="processing-badge processing-badge--dim">
              <span className="processing-badge__dot" />
              <span>Backup Mode</span>
            </div>
          </div>

          <div className="control-panel__sliders">
            <div className="slider-group">
              <div className="slider-group__header">
                <label className="slider-group__label">Simulate Rainfall Intensity</label>
                <span className="slider-group__value">{rainfall} <small>mm/hr</small></span>
              </div>
              <input
                type="range"
                min="0"
                max="200"
                value={rainfall}
                onChange={(e) => onRainfallChange(Number(e.target.value))}
                className="slider slider--cyan"
                id="rainfall-slider"
              />
              <div className="slider-group__ticks">
                <span>0</span><span>50</span><span>100</span><span>150</span><span>200</span>
              </div>
            </div>

            <div className="slider-group">
              <div className="slider-group__header">
                <label className="slider-group__label">Soil Moisture Saturation</label>
                <span className="slider-group__value">{soilMoisture} <small>%</small></span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={soilMoisture}
                onChange={(e) => onSoilMoistureChange(Number(e.target.value))}
                className="slider slider--cyan"
                id="soil-moisture-slider"
              />
              <div className="slider-group__ticks">
                <span>0</span><span>25</span><span>50</span><span>75</span><span>100</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Risk Gauge (always visible) ─────────────────── */}
      <div className="control-panel__gauge">
        <RiskGauge value={riskScore} />
      </div>

      {/* ── System Log (always visible) ─────────────────── */}
      <SystemLog entries={logEntries} />
    </div>
  );
}
