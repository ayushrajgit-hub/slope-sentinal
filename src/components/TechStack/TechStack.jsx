import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import './TechStack.css';

const techCategories = [
  {
    title: 'Frontend UI',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M9 3v18M3 9h18" />
      </svg>
    ),
    tags: ['React.js', 'Leaflet', 'Framer Motion'],
  },
  {
    title: 'Backend & DB',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="6" rx="2" />
        <rect x="2" y="15" width="20" height="6" rx="2" />
        <circle cx="6" cy="6" r="1" fill="currentColor" />
        <circle cx="6" cy="18" r="1" fill="currentColor" />
        <path d="M12 9v6" />
      </svg>
    ),
    tags: ['Python', 'FastAPI', 'PostgreSQL', 'PostGIS'],
  },
  {
    title: 'AI Engine',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
      </svg>
    ),
    tags: ['PyTorch (Transformers)', 'XGBoost', 'LightGBM'],
  },
  {
    title: 'Data Preprocessing',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 6h16M4 12h16M4 18h10" />
        <path d="M18 16l2 2 4-4" />
      </svg>
    ),
    tags: ['Pandas', 'NumPy', 'GeoPandas', 'Scikit-Learn'],
  },
  {
    title: 'Spatial Storage',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="12" cy="5" rx="9" ry="3" />
        <path d="M21 5v6c0 1.66-4.03 3-9 3S3 12.66 3 11V5" />
        <path d="M21 11v6c0 1.66-4.03 3-9 3s-9-1.34-9-3v-6" />
      </svg>
    ),
    tags: ['PostgreSQL', 'PostGIS Spatial Indexing'],
  },
  {
    title: 'Dissemination APIs',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 2L11 13" />
        <path d="M22 2L15 22l-4-9-9-4z" />
      </svg>
    ),
    tags: ['CAP v1.2 Broadcast', 'SMS Alerts', 'Public Siren / PA'],
  },
];

export default function TechStack() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section className="techstack section" id="techstack" ref={ref}>
      <div className="container">
        <motion.div
          className="techstack__header"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <span className="section-label">Enterprise-Grade Stack</span>
          <h2>Technical Stack & Deployment</h2>
          <p className="techstack__subtitle">
            Built on proven, open-source technologies engineered for scalability,
            resilience, and rapid deployment.
          </p>
        </motion.div>

        <div className="techstack__grid">
          {techCategories.map((cat, i) => (
            <motion.div
              key={cat.title}
              className="techstack__card glass-card"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <div className="techstack__card-icon">{cat.icon}</div>
              <h3 className="techstack__card-title">{cat.title}</h3>
              <div className="techstack__tags">
                {cat.tags.map((tag) => (
                  <span key={tag} className="techstack__tag">{tag}</span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
