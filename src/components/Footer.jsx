import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

export default function Footer() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLinkClick = (e, path, hash) => {
    if (hash) {
      e.preventDefault();
      if (location.pathname === path || (path === '/' && location.pathname === '/index.html')) {
        const el = document.querySelector(hash);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        navigate(path);
        setTimeout(() => {
          const el = document.querySelector(hash);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      }
    }
  };

  return (
    <footer id="footer">
      <div className="container">
        
        {/* Country Subdomains Navigation Bar */}
        <div className="footer-country-bar">
          <a href="https://www.angola.waterfilterafrica.com/" target="_blank" rel="noreferrer">ANGOLA</a>
          <span className="bar-separator">||</span>
          <a href="https://www.southafrica.waterfilterafrica.com/" target="_blank" rel="noreferrer">SOUTHAFRICA</a>
          <span className="bar-separator">||</span>
          <a href="https://www.zimbabwe.waterfilterafrica.com/" target="_blank" rel="noreferrer">ZIMBABWE</a>
          <span className="bar-separator">||</span>
          <a href="https://www.namibia.waterfilterafrica.com/" target="_blank" rel="noreferrer">NAMIBIA</a>
          <span className="bar-separator">||</span>
          <a href="https://www.congo.waterfilterafrica.com/" target="_blank" rel="noreferrer">CONGO</a>
          <span className="bar-separator">||</span>
          <a href="https://www.botswana.waterfilterafrica.com/" target="_blank" rel="noreferrer">BOTSWANA</a>
          <span className="bar-separator">||</span>
        </div>

        <div className="footer-grid">
          <div>
            <div className="brand" style={{ marginBottom: '12px' }}>
              <img src="/images/bg remove ogo.png" alt="Water Filter Africa logo" />
              <span>WATER FILTER AFRICA</span>
            </div>
            <p>Advanced water filtration, purification, conditioning and treatment solutions for residential, agricultural, commercial and industrial applications across Africa.</p>
            <div className="socials" aria-label="Social links">
              <a href="#" aria-label="Facebook" className="social-facebook">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9.101 23.685v-9.695H6.602v-3.85h2.499v-2.883c0-2.478 1.48-3.834 3.702-3.834 1.065 0 2.18.19 2.18.19v2.402h-1.226c-1.225 0-1.608.759-1.608 1.54v2.585h2.696l-.43 3.85h-2.266v9.695H9.101z"/></svg>
              </a>
              <a href="#" aria-label="Instagram" className="social-instagram">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051C.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>
              </a>
              <a href="#" aria-label="LinkedIn" className="social-linkedin">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
              </a>
              <a href="#" aria-label="YouTube" className="social-youtube">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" clipRule="evenodd" d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.107C19.518 3.545 12 3.545 12 3.545s-7.518 0-9.388.511a3.002 3.002 0 0 0-2.11 2.107C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.107C4.482 20.455 12 20.455 12 20.455s7.518 0 9.388-.511a3.003 3.003 0 0 0 2.11-2.107C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
              <a href="#" aria-label="X" className="social-x">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
            </div>
          </div>
          <div>
            <h4>Products</h4>
            <Link to="/category/industrial-water-filtration">Industrial Water Filtration</Link>
            <Link to="/category/agriculture-farming-water-filtration">Agriculture Water Filtration</Link>
            <Link to="/category/animal-farming-water-filtration">Livestock Water Filtration</Link>
            <Link to="/category/commercial-water-filters">Commercial Water Filters</Link>
            <Link to="/category/domestic-water-filtration-system">Domestic Water Filtration</Link>
          </div>
          <div>
            <h4>Information</h4>
            <Link to="/about">About Us</Link>
            <Link to="/" onClick={(e) => handleLinkClick(e, '/', '#applications')}>Industries</Link>
            <Link to="/blog">Blogs</Link>
            <Link to="/contact">Contact Us</Link>
            <Link to="/privacy-policy">Privacy Policy</Link>
            <Link to="/terms-conditions">Terms & Conditions</Link>
          </div>
          <div>
            <h4>Contact</h4>
            <p><strong>Joshi Ion Exchange Ltd.</strong></p>
            <p>P.O Box 32014,<br/>Lusaka, Zambia, Africa</p>
            <p><a href="tel:+260969113323" style={{ color: 'inherit', textDecoration: 'none' }}>+260969113323</a></p>
            <p><a href="mailto:office@waterfilterafrica.com" style={{ color: 'inherit', textDecoration: 'none' }}>office@waterfilterafrica.com</a></p>
            <p><a href="mailto:joshiionexchangeltd@gmail.com" style={{ color: 'inherit', textDecoration: 'none' }}>joshiionexchangeltd@gmail.com</a></p>
          </div>
        </div>
        <div className="copyright">© 2026 Water Filter Africa. All Rights Reserved.</div>
      </div>
    </footer>
  );
}
