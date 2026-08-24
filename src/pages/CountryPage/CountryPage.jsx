import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProducts, getCountryDetails } from '../../api';
import '../Category/Category.css'; // Reuse category page styling

export default function CountryPage() {
  const params = useParams();
  const countryCode = params.countryCode || '';
  
  const [countryDetails, setCountryDetails] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    
    // Save selected country in localStorage so the header/footer updates
    localStorage.setItem('selected_country', countryCode);
    
    // Dispatch localstorage change event to update other components immediately if listening
    window.dispatchEvent(new Event('storage'));

    Promise.all([
      getCountryDetails(countryCode),
      getProducts() // This automatically uses the active country code set in localStorage above
    ]).then(([details, countryProducts]) => {
      if (active) {
        setCountryDetails(details);
        setProducts(countryProducts);
        setLoading(false);
      }
    });

    return () => { active = false; };
  }, [countryCode]);

  const countryName = countryDetails ? countryDetails.name : countryCode.toUpperCase();
  const countryDesc = countryDetails ? countryDetails.about_text : `Water Filter Africa provides residential, commercial, agricultural, and industrial water treatment solutions in ${countryName}.`;

  useEffect(() => {
    document.title = `Water Filter ${countryName} | Water Filter Africa`;
  }, [countryName]);

  return (
    <main id="top" className="category-page">
      <header className="cat-hero">
        <div className="container">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <span>Countries</span>
            <span>/</span>
            <span style={{ color: 'var(--accent)' }}>{countryName}</span>
          </nav>
          <span className="eyebrow">
            Our Markets
          </span>
          <h1>Water Filter {countryName}</h1>
          <p className="cat-desc">{countryDesc}</p>
        </div>
      </header>
      
      <section className="section">
        <div className="container">
          <h2 style={{ marginBottom: '32px', fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-dark)' }}>
            Available Products in {countryName}
          </h2>
          <div className="product-grid">
            {loading ? (
              <div className="empty">Loading products...</div>
            ) : products.length > 0 ? (
              products.map((p) => (
                <Link 
                  key={p.id}
                  className="product-card" 
                  to={`/product/${p.slug}`}
                >
                  <div className="product-stage">
                    <img src={p.image || '/images/logo.png'} alt={p.name} />
                  </div>
                  <span className="product-label">{p.technology || p.brand}</span>
                  <h2>{p.name}</h2>
                  <p>{p.shortDescription || p.short_description || ''}</p>
                  <span className="product-cta">
                    View Product <span>&rarr;</span>
                  </span>
                </Link>
              ))
            ) : (
              <div className="empty">
                No products are currently assigned to {countryName} in the admin panel.<br />
                <Link to="/product" style={{ color: 'var(--accent)', textDecoration: 'underline', marginTop: '12px', display: 'inline-block' }}>Browse all products &rarr;</Link>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
