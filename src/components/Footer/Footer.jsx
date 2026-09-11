import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__brand">
          <svg width="20" height="20" viewBox="0 0 28 28" fill="none">
            <path d="M14 2L26 24H2L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
            <circle cx="14" cy="16" r="2" fill="currentColor"/>
          </svg>
          <span>Slope Sentinel</span>
        </div>
        <p className="footer__copy">
          SIH 2026 Prototype — AI-Powered Landslide Early Warning System for India's NER
        </p>
        <div className="footer__links">
          <a href="#hero">Home</a>
          <a href="#solution">Solution</a>
          <a href="#architecture">Architecture</a>
          <a href="#simulation">Simulation</a>
          <a href="#impact">Impact</a>
        </div>
        <p className="footer__legal">
          © 2026 Slope Sentinel. Built for Smart India Hackathon.
        </p>
      </div>
    </footer>
  );
}
