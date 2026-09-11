import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import './Impact.css';

const feasibilityPoints = [
  {
    icon: '📊',
    title: 'Data Availability',
    text: 'Accessible temperature, humidity, rainfall, soil, terrain, satellite vegetation (NDVI) and historical landslide datasets support model development and validation.',
  },
  {
    icon: '💻',
    title: 'Software-Based Prototype',
    text: 'Can be developed and deployed rapidly using Python, ML frameworks (Transformers, XGBoost/LightGBM), and Web GIS tools without large-scale physical deployment.',
  },
  {
    icon: '🧩',
    title: 'Modular Architecture',
    text: 'Separate rainfall-prediction and landslide-risk models allow independent testing, tuning, and continuous improvement.',
  },
  {
    icon: '📍',
    title: 'NER Focus & Regional Problem Fit',
    text: 'The system is initially validated using selected landslide-prone vulnerable corridors of North-East India (e.g. NH-29 Kohima-Dimapur).',
  },
];

const mitigationPoints = [
  {
    icon: '🤖',
    title: 'Rainfall Uncertainty ➔ Model Comparison',
    text: 'Compare Transformer with LSTM, GRU, and baseline models to select the most reliable rainfall-prediction approach under varying terrain conditions.',
  },
  {
    icon: '🔄',
    title: 'Data Gaps ➔ Multi-Source Data Fusion',
    text: 'Combine temperature, humidity, rainfall, terrain, vegetation, and historical landslide data to improve prediction reliability and prevent single-source failure.',
  },
  {
    icon: '📐',
    title: 'Mismatch ➔ Spatio-Temporal Preprocessing',
    text: 'Handle missing/noisy data, normalize features, and align datasets across disparate geographic resolutions and time intervals.',
  },
  {
    icon: '🎯',
    title: 'False Alarms ➔ Threshold Management',
    text: 'Use prediction confidence intervals and carefully tuned risk thresholds (Low / Medium / High) to minimize false alarms and maintain public trust.',
  },
  {
    icon: '📈',
    title: 'Continuous Validation & Monitoring',
    text: 'Evaluate the system continuously using accuracy, F1-score, false-alarm rate, and warning lead time, updating models as new data becomes available.',
  },
];

const stakeholders = [
  {
    icon: '🏘️',
    title: 'NER Communities',
    desc: 'Provides earlier and location-specific warnings for landslide-prone areas, allowing residents vital lead time to prepare and evacuate.',
  },
  {
    icon: '🏛️',
    title: 'Disaster Authorities',
    desc: 'Provides rainfall and landslide risk levels with GIS-based information for faster, data-driven decision-making.',
  },
  {
    icon: '🚨',
    title: 'Emergency Responders',
    desc: 'Helps prioritize evacuation zones, rescue team deployments, and emergency resources based on predicted risk zones.',
  },
  {
    icon: '🌲',
    title: 'Forest & Environment',
    desc: 'Supports monitoring of vegetation loss, deforestation, and vulnerable slope catchments for preventive planning.',
  },
  {
    icon: '🛣️',
    title: 'Transport Authorities',
    desc: 'Identifies national highways (like NH-29) and critical transit corridors exposed to elevated landslide failure risk.',
  },
];

export default function Impact() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section className="impact section" id="impact" ref={ref}>
      <div className="container">
        <motion.div
          className="impact__header"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <span className="section-label">Feasibility, Risks & Mitigation</span>
          <h2>System Viability & Strategic Impact</h2>
          <p className="impact__subtitle">
            Rigorous technical feasibility, proactive risk mitigation strategies, and multi-dimensional stakeholder benefits designed for North-East India.
          </p>
        </motion.div>

        <div className="impact__panels">
          {/* Feasibility & Viability */}
          <motion.div
            className="impact__panel impact__panel--feasibility"
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="impact__panel-title">
              <span className="impact__panel-icon">⚡</span>
              Feasibility & Viability
            </h3>
            <div className="impact__points">
              {feasibilityPoints.map((point, i) => (
                <div key={i} className="impact__point">
                  <span className="impact__point-icon">{point.icon}</span>
                  <div>
                    <h4 className="impact__point-title">{point.title}</h4>
                    <p className="impact__point-text">{point.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Risks & Mitigation Strategies */}
          <motion.div
            className="impact__panel impact__panel--resilience"
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h3 className="impact__panel-title">
              <span className="impact__panel-icon">🛡️</span>
              Challenges & Mitigation Strategies
            </h3>
            <div className="impact__points">
              {mitigationPoints.map((point, i) => (
                <div key={i} className="impact__point">
                  <span className="impact__point-icon">{point.icon}</span>
                  <div>
                    <h4 className="impact__point-title">{point.title}</h4>
                    <p className="impact__point-text">{point.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Stakeholder Impact & Broader Benefits (Slide 5) */}
        <motion.div
          className="impact__stakeholders"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h3 className="impact__stakeholders-title">
            <span>🎯</span>
            Impact on Target Stakeholders & Communities
          </h3>
          <div className="impact__stakeholders-grid">
            {stakeholders.map((s, i) => (
              <div key={i} className="impact__stakeholder-card">
                <div className="impact__stakeholder-header">
                  <span>{s.icon}</span>
                  <span>{s.title}</span>
                </div>
                <p className="impact__stakeholder-desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

