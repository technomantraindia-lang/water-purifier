import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { getCountries, getCountryDetails, getActiveCountryCode } from '../api';

export default function Footer() {
  const navigate = useNavigate();
  const location = useLocation();
  const [countries, setCountries] = useState([]);
  const [countryDetails, setCountryDetails] = useState(null);

  const getCountryFromLocation = () => {
    if (location.pathname.startsWith('/country/')) {
      return location.pathname.split('/')[2] || '';
    }
    return getActiveCountryCode();
  };

  const currentCountry = getCountryFromLocation();

  useEffect(() => {
    let active = true;
    getCountries().then(data => {
      if (active) setCountries(data);
    });

    if (currentCountry) {
      getCountryDetails(currentCountry).then(details => {
        if (active) setCountryDetails(details);
      });
    } else {
      setCountryDetails(null);
    }

    return () => { active = false; };
  }, [currentCountry, location.pathname]);

  const handleCountryClick = (e, countryCode) => {
    e.preventDefault();
    localStorage.setItem('selected_country', countryCode);
    navigate(`/country/${countryCode}`);
    window.location.reload();
  };

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
          <React.Fragment key="africa">
            <a 
              href="/" 
              onClick={(e) => {
                e.preventDefault();
                localStorage.setItem('selected_country', 'africa');
                navigate('/');
                window.location.reload();
              }}
              style={{ textTransform: 'uppercase', fontWeight: 'bold', color: '#ffea00' }}
            >
              Water Filter Africa
            </a>
            {countries.length > 0 && <span className="bar-separator">||</span>}
          </React.Fragment>

          {countries.map((c, index) => (
            <React.Fragment key={c.code}>
              <a 
                href={`https://${c.code}.waterfilterafrica.com/`} 
                onClick={(e) => handleCountryClick(e, c.code)}
                style={{ textTransform: 'uppercase' }}
              >
                {c.name}
              </a>
              {index < countries.length - 1 && <span className="bar-separator">||</span>}
            </React.Fragment>
          ))}
        </div>

        <div className="footer-grid">
          <div>
            <div className="brand" style={{ marginBottom: '12px' }}>
              <img src="/images/bg remove ogo.png" alt="Water Filter Africa logo" />
              <span>WATER FILTER AFRICA</span>
            </div>
            <p>Advanced water filtration, purification, conditioning and treatment solutions for residential, agricultural, commercial and industrial applications across Africa.</p>
            <div className="socials" aria-label="Social links">
              <a href="https://www.facebook.com/WaterFilterAfrica#" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="social-facebook"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 13.5h2.5l1-3H14V8.5c0-.8.2-1.1 1-1.1h1.5v-3h-2.5c-3 0-4.5 1.5-4.5 4.5v2.1H7.5v3H9.5v8h4.5v-8z"/></svg></a>
              <a href="https://www.instagram.com/africawaterfilters/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="social-instagram"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051C.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg></a>
              <a href="#" aria-label="YouTube" className="social-youtube"><svg viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" clipRule="evenodd" d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.107C19.518 3.545 12 3.545 12 3.545s-7.518 0-9.388.511a3.002 3.002 0 0 0-2.11 2.107C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.107C4.482 20.455 12 20.455 12 20.455s7.518 0 9.388-.511a3.003 3.003 0 0 0 2.11-2.107C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg></a>
            </div>
          </div>
          <div>
            <h4>Products</h4>
            <Link to="/industrial-water-filtration">Industrial Water Filtration System</Link>
            <Link to="/agriculture-farming-water-filtration">Agriculture Farming Water Filtration</Link>
            <Link to="/animal-farming-water-filtration">Animals Farming Water Filtration System</Link>
            <Link to="/commercial-water-filters">Commercial Water Filters</Link>
            <Link to="/domestic-water-filtration-system">Domestic Water Filtration System</Link>
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
            <p>{(countryDetails && countryDetails.address) || 'P.O Box 32014, Lusaka, Zambia, Africa'}</p>
            <p><a href={`tel:${(countryDetails && countryDetails.phone) || '+260969113323'}`} style={{ color: 'inherit', textDecoration: 'none' }}>{(countryDetails && countryDetails.phone) || '+260969113323'}</a></p>
            <p><a href={`mailto:${(countryDetails && countryDetails.email) || 'office@waterfilterafrica.com'}`} style={{ color: 'inherit', textDecoration: 'none' }}>{(countryDetails && countryDetails.email) || 'office@waterfilterafrica.com'}</a></p>
            <p><a href="mailto:joshiionexchangeltd@gmail.com" style={{ color: 'inherit', textDecoration: 'none' }}>joshiionexchangeltd@gmail.com</a></p>
          </div>
        </div>
        <div className="copyright">© 2026 Water Filter Africa. All Rights Reserved.</div>
      </div>
    </footer>
  );
}
