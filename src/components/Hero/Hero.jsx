import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './Hero.css';

/* Simulate realistic sensor jitter */
function jitter(base, range) {
  return +(base + (Math.random() - 0.5) * range).toFixed(1);
}

function getRiskBand(score) {
  if (score < 30) return { label: 'LOW RISK', color: 'var(--risk-low)' };
  if (score < 60) return { label: 'MEDIUM RISK', color: 'var(--risk-moderate)' };
  if (score < 85) return { label: 'HIGH RISK', color: 'var(--risk-high)' };
  return { label: 'CRITICAL RISK', color: 'var(--risk-critical)' };
}

export default function Hero() {
  const [telemetry, setTelemetry] = useState({
    temperature: 24.5,
    humidity: 78.0,
    rainfallProb: 72,
    riskScore: 28,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setTelemetry({
        temperature: jitter(24.5, 3),
        humidity: jitter(78.0, 6),
        rainfallProb: Math.min(98, Math.max(10, Math.round(jitter(72, 8)))),
        riskScore: Math.min(95, Math.max(15, Math.round(jitter(28, 6)))),
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const risk = getRiskBand(telemetry.riskScore);

  return (
    <section className="hero section" id="hero">
      <div className="bg-particles" />
      <div className="hero__grid container">
        <motion.div
          className="hero__content"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <span className="section-label">Early Warning Intelligence</span>
          <h1 className="hero__headline">
            Predicting slope failure{' '}
            <span className="hero__accent">before the fracture.</span>
          </h1>
          <p className="hero__subheadline">
            Fusing Time-Series Transformer weather forecasting with multi-factor
            machine learning (XGBoost / LightGBM) to provide North-East India (NER)
            with fail-safe, localized early warning windows.
          </p>
          <div className="hero__ctas">
            <a href="#simulation" className="btn btn-primary">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 2l10 6-10 6V2z" fill="currentColor"/></svg>
              Launch GIS Simulation
            </a>
            <a href="#architecture" className="btn btn-outline">
              View Technical Pipeline
            </a>
          </div>
        </motion.div>

        <motion.div
          className="hero__telemetry"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: 'easeOut' }}
        >
          <div className="telemetry-card glass-card">
            <div className="telemetry-card__header">
              <div className="telemetry-card__station">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <circle cx="7" cy="7" r="3" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M7 1v2M7 11v2M1 7h2M11 7h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                NH-29 Kohima Corridor
              </div>
              <span className="live-indicator">
                <span className="live-dot" />
                LIVE
              </span>
            </div>

            <div className="telemetry-card__grid">
              <TelemetryField
                label="Ambient Temperature"
                value={telemetry.temperature}
                unit="°C"
                icon="🌡️"
              />
              <TelemetryField
                label="Relative Humidity"
                value={telemetry.humidity}
                unit="%"
                icon="💧"
              />
              <TelemetryField
                label="Predicted Rain (+24h)"
                value={telemetry.rainfallProb}
                unit="%"
                icon="🌧️"
              />
              <TelemetryField
                label="Landslide Probability"
                value={telemetry.riskScore}
                unit="%"
                icon="⛰️"
              />
            </div>

            <div className="telemetry-card__risk">
              <span className="telemetry-card__risk-label">Current Risk Zone</span>
              <div className="telemetry-card__risk-bar">
                <div
                  className="telemetry-card__risk-fill"
                  style={{
                    width: `${telemetry.riskScore}%`,
                    background: `linear-gradient(90deg, var(--risk-low), ${risk.color})`,
                  }}
                />
              </div>
              <span
                className="telemetry-card__risk-badge"
                style={{ color: risk.color, borderColor: risk.color }}
              >
                {risk.label}
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="hero__scroll"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M10 4v12M4 12l6 6 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </motion.div>
    </section>
  );
}

function TelemetryField({ label, value, unit, icon }) {
  return (
    <div className="telemetry-field">
      <span className="telemetry-field__icon">{icon}</span>
      <div className="telemetry-field__info">
        <span className="telemetry-field__label">{label}</span>
        <span className="telemetry-field__value">
          {value}
          <span className="telemetry-field__unit">{unit}</span>
        </span>
      </div>
    </div>
  );
}
