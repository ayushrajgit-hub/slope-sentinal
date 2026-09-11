import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import './Pipeline.css';

const stages = [
  {
    num: 1,
    title: 'Data Collection',
    tag: 'Multi-Source Telemetry',
    description: 'Atmospheric (Temp, Humidity), Terrain (Slope, Elevation, Soil Type), Land Cover (NDVI, Deforestation) & Historical Landslide Events.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v6M12 22v-6M2 12h6M22 12h-6" />
        <circle cx="12" cy="12" r="4" />
      </svg>
    ),
  },
  {
    num: 2,
    title: 'Data Preprocessing',
    tag: 'Cleaning & Fusion',
    description: 'Data cleaning, missing value handling, feature extraction, normalization and spatio-temporal alignment across sensors and satellites.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    num: 3,
    title: 'Rainfall Prediction',
    tag: 'Transformer (Time-Series ML)',
    description: 'Processes temperature and humidity time-series data to forecast predicted rainfall probability for +6h, +12h, and +24h windows.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a4 4 0 014 4c0 2-2 3-2 5h-4c0-2-2-3-2-5a4 4 0 014-4z" />
        <path d="M10 17h4M11 21h2" />
        <path d="M8 11l-3 2M16 11l3 2" />
      </svg>
    ),
  },
  {
    num: 4,
    title: 'Landslide Risk Prediction',
    tag: 'XGBoost / LightGBM',
    description: 'Fuses predicted rainfall with terrain slope, elevation, soil cohesion, NDVI vegetation, deforestation, and historical events (0–100% probability).',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 3v18h18" />
        <path d="M18 9l-5 5-4-4-3 3" />
      </svg>
    ),
  },
  {
    num: 5,
    title: 'Risk Mapping & Visualization',
    tag: 'Web GIS Dashboard',
    description: 'Translates machine learning failure probabilities into interactive GIS risk maps (Low, Medium, and High Risk Zones) for vulnerable corridors.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12,2 22,8 22,16 12,22 2,16 2,8" />
        <line x1="12" y1="2" x2="12" y2="22" />
        <line x1="2" y1="8" x2="22" y2="8" />
        <line x1="2" y1="16" x2="22" y2="16" />
      </svg>
    ),
  },
  {
    num: 6,
    title: 'Alert Generation & Dissemination',
    tag: 'Multi-Channel Broadcast',
    description: 'Dispatches automated warnings via mobile app push, SMS, siren / public announcement, email, and CAP v1.2 emergency feeds to disaster authorities.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 01-3.46 0" />
        <line x1="12" y1="2" x2="12" y2="4" />
      </svg>
    ),
  },
  {
    num: 7,
    title: 'Testing, Deployment & Monitoring',
    tag: 'Continuous Model Update',
    description: 'Historical event benchmarking, live model calibration, and closed-loop continuous updates to deliver measurable early warning.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 12l2 2 4-4" />
        <path d="M12 3a9 9 0 11-9 9" />
        <path d="M3 12h3" />
      </svg>
    ),
  },
  {
    num: 8,
    title: 'Safer Communities & Action',
    tag: 'Disaster Resilience',
    description: 'Empowers local NER communities and district authorities with actionable evacuation windows, protecting lives and highways.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 00-3-3.87" />
        <path d="M16 3.13a4 4 0 010 7.75" />
      </svg>
    ),
  },
];

export default function Pipeline() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section className="pipeline section" id="architecture" ref={ref}>
      <div className="container">
        <motion.div
          className="pipeline__header"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <span className="section-label">Technical Approach & Data Pipeline</span>
          <h2>The 8-Stage Implementation Workflow</h2>
          <p className="pipeline__subtitle">
            From multi-source meteorological and geospatial inputs to verified early warning alerts — perfectly mirroring our SIH 2026 architecture.
          </p>
        </motion.div>

        <div className="pipeline__track">
          {stages.map((stage, i) => (
            <motion.div
              key={stage.num}
              className="pipeline__card glass-card"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <div className="pipeline__card-num">{stage.num}</div>
              <div className="pipeline__card-icon">{stage.icon}</div>
              {stage.tag && <div className="pipeline__card-tag">{stage.tag}</div>}
              <h3 className="pipeline__card-title">{stage.title}</h3>
              <p className="pipeline__card-desc">{stage.description}</p>
              {i < stages.length - 1 && (
                <div className="pipeline__connector" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
