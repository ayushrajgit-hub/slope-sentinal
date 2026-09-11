import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import './Innovation.css';

const innovations = [
  {
    badge: 'Stage 1 • Time-Series ML',
    title: 'Pre-Rainfall Intelligence',
    formula: 'Temperature + Humidity → Transformer → Rainfall Probability',
    desc: 'Uses ambient temperature and relative humidity time-series data with a Transformer model to forecast rainfall probability across 6, 12, and 24-hour lead times before storms arrive.',
  },
  {
    badge: 'Stage 2 • Multi-Factor ML',
    title: 'Context-Aware Risk',
    formula: 'Rainfall + Terrain + Vegetation + History → Failure Probability',
    desc: 'Combines forecasted rainfall with slope angle, elevation, soil cohesion, vegetation cover (NDVI), deforestation, and historical landslide data to predict 0–100% landslide probability.',
  },
  {
    badge: 'Impact • Decision Support',
    title: 'Measurable Early Warning',
    formula: 'High Lead Time + High F1-Score + Low False Alarms',
    desc: 'Replaces static rainfall thresholds with hyper-local GIS danger zones and CAP v1.2 alerts, providing emergency authorities and communities quantifiable evacuation windows.',
  },
];

export default function Innovation() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="innovation section" id="solution" ref={ref}>
      <div className="container">
        <motion.div
          className="innovation__content"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="section-label">Proposed Solution & NER Problem Fit</span>
          <h2 className="innovation__headline">
            One continuous early-warning pipeline.
          </h2>
          <p className="innovation__text">
            From atmospheric pre-rainfall forecasting to location-specific GIS risk zones and automated alerts.
          </p>
        </motion.div>

        <motion.div
          className="innovation__line-wrapper"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="innovation__line">
            <div className="innovation__particle" />
          </div>
        </motion.div>

        {/* 3-Column Innovation Pillars */}
        <div className="innovation__grid">
          {innovations.map((item, i) => (
            <motion.div
              key={item.title}
              className="innovation__card"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.15 }}
            >
              <span className="innovation__card-badge">{item.badge}</span>
              <h3 className="innovation__card-title">{item.title}</h3>
              <div className="innovation__card-formula">{item.formula}</div>
              <p className="innovation__card-desc">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

