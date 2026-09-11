import { useState, useEffect } from 'react';
import './Navbar.css';

const navLinks = [
  { label: 'Solution', href: '#solution' },
  { label: 'Architecture', href: '#architecture' },
  { label: 'Live Simulation', href: '#simulation' },
  { label: 'Impact', href: '#impact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = () => setMobileOpen(false);

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="navbar__inner container">
        <a href="#" className="navbar__brand">
          <div className="navbar__logo">
            <svg viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14 2L26 24H2L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
              <path d="M14 10L20 22H8L14 10Z" fill="currentColor" opacity="0.3"/>
              <circle cx="14" cy="16" r="2" fill="currentColor"/>
            </svg>
          </div>
          <span className="navbar__name">Slope Sentinel</span>
        </a>

        <div className={`navbar__links ${mobileOpen ? 'navbar__links--open' : ''}`}>
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="navbar__link"
              onClick={handleLinkClick}
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="navbar__right">
          <span className="navbar__badge">SIH 2026</span>
          <button
            className={`navbar__hamburger ${mobileOpen ? 'navbar__hamburger--open' : ''}`}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>
    </nav>
  );
}
