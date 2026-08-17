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
        <div className="footer-grid">
          <div>
            <div className="brand" style={{ marginBottom: '12px' }}>
              <img src="/images/bg remove ogo.png" alt="Water Filter Africa logo" />
              <span>WATER FILTER AFRICA</span>
            </div>
            <p>Advanced water filtration, purification, conditioning and treatment solutions for residential, agricultural, commercial and industrial applications across Africa.</p>
            <div className="socials" aria-label="Social links">
              <a href="#" aria-label="Facebook" className="social-facebook">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 8h3V4h-3c-3.3 0-5 2-5 5v3H6v4h3v4h4v-4h3.2l.8-4h-4V9c0-.7.3-1 1-1Z"/></svg>
              </a>
              <a href="#" aria-label="Instagram" className="social-instagram">
                <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="4" width="16" height="16" rx="5"/><circle cx="12" cy="12" r="3.5"/><path d="M17.3 6.8h.01"/></svg>
              </a>
              <a href="#" aria-label="LinkedIn" className="social-linkedin">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.5 10v9M6.5 6.5h.01M11 19v-9h4.2c2.2 0 3.8 1.4 3.8 4.2V19M11 14.2c0-2.7 1.5-4.2 3.5-4.2"/></svg>
              </a>
              <a href="#" aria-label="YouTube" className="social-youtube">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 12s0-3.3-.4-4.8c-.2-.8-.8-1.4-1.6-1.6C17.5 5.2 12 5.2 12 5.2s-5.5 0-7 .4c-.8.2-1.4.8-1.6 1.6C3 8.7 3 12 3 12s0 3.3.4 4.8c.2.8.8 1.4 1.6 1.6 1.5.4 7 .4 7 .4s5.5 0 7-.4c.8-.2 1.4-.8 1.6-1.6.4-1.5.4-4.8.4-4.8Z"/><path d="m10 9 5 3-5 3Z"/></svg>
              </a>
              <a href="#" aria-label="X" className="social-x">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4l16 16M20 4 4 20"/></svg>
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
