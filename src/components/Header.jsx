import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { WFA_PRODUCTS } from '../data/products-data';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLinkClick = (e, path, hash) => {
    setMenuOpen(false);
    if (hash) {
      e.preventDefault();
      // If we are already on that path, just scroll
      if (location.pathname === path || (path === '/' && location.pathname === '/index.html')) {
        const el = document.querySelector(hash);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      } else {
        navigate(path);
        // Wait for page load and scroll
        setTimeout(() => {
          const el = document.querySelector(hash);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
          } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }, 100);
      }
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setMenuOpen(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <header className={`site-header ${menuOpen ? 'menu-open' : ''}`}>
      <div className="contact-strip">
        <div className="contact-strip-inner">
          <div className="contact-strip-left">
            <a href="tel:+260969113323" aria-label="Call Water Filter Africa">
              <span className="strip-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.35 1.9.66 2.81a2 2 0 0 1-.45 2.11L8.05 9.91a16 16 0 0 0 6.04 6.04l1.27-1.27a2 2 0 0 1 2.11-.45c.91.31 1.85.53 2.81.66A2 2 0 0 1 22 16.92Z"/></svg>
              </span>
              +260969113323
            </a>
            <a href="mailto:office@waterfilterafrica.com" aria-label="Email Water Filter Africa">
              <span className="strip-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24"><path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Zm0 4 8 5 8-5"/></svg>
              </span>
              office@waterfilterafrica.com
            </a>
          </div>
          <div className="contact-strip-right">
            <span className="strip-location">
              <span className="strip-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24"><path d="M12 21s7-4.8 7-11a7 7 0 1 0-14 0c0 6.2 7 11 7 11Zm0-8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/></svg>
              </span>
              Lusaka, Zambia, Africa
            </span>
            <span className="strip-socials" aria-label="Social links">
              <a href="#" aria-label="LinkedIn">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
              </a>
              <a href="#" aria-label="X">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href="#" aria-label="Facebook">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9.101 23.685v-9.695H6.602v-3.85h2.499v-2.883c0-2.478 1.48-3.834 3.702-3.834 1.065 0 2.18.19 2.18.19v2.402h-1.226c-1.225 0-1.608.759-1.608 1.54v2.585h2.696l-.43 3.85h-2.266v9.695H9.101z"/></svg>
              </a>
            </span>
          </div>
        </div>
      </div>
      <div className="topbar">
        <div className="nav-container">
        <Link 
          className="brand" 
          to="/" 
          aria-label="Water Filter Africa home"
          onClick={(e) => handleLinkClick(e, '/', '#home')}
        >
          <img src="/images/bg remove ogo.png" alt="Water Filter Africa logo" />
          <span>WATER FILTER AFRICA</span>
        </Link>
        <button 
          className="mobile-menu-toggle" 
          type="button" 
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
        <nav className="nav-links" aria-label="Primary">
          <Link to="/" onClick={(e) => handleLinkClick(e, '/', '#home')}>Home</Link>
          <Link to="/about" onClick={(e) => handleLinkClick(e, '/about', '#top')}>About</Link>
          <div className="nav-dropdown">
            <a href="#" onClick={(e) => e.preventDefault()}>
              Product
              <svg className="dropdown-arrow-icon" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '6px', transition: 'transform 0.2s ease' }}><polyline points="6 9 12 15 18 9"></polyline></svg>
            </a>
            <div className="nav-dropdown-menu" aria-label="Product categories">
              {WFA_PRODUCTS.categories.map((category) => (
                <Link
                  key={category.id}
                  to={`/category/${category.slug}`}
                  onClick={(e) => handleLinkClick(e, `/category/${category.slug}`, '#top')}
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>
          <Link to="/blog" onClick={(e) => handleLinkClick(e, '/blog', '#top')}>Blog</Link>
          <Link to="/contact" onClick={(e) => handleLinkClick(e, '/contact', '#top')}>Contact</Link>
        </nav>
        <Link 
          className="nav-cta" 
          to="/contact"
          onClick={(e) => handleLinkClick(e, '/contact', '#enquiry')}
        >
          Request Consultation
        </Link>
        </div>
      </div>
    </header>
  );
}



