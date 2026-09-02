import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { WFA_PRODUCTS } from '../../data/products-data';
import { getCategories, getProductBySlug, getProductsByCategory, getActiveCountryCode, submitEnquiry } from '../../api';
import './ProductDetail.css';

gsap.registerPlugin(ScrollTrigger);

export default function ProductDetail() {
  const { slug } = useParams();
  const [activeImage, setActiveImage] = useState(0);
  const [showBrochureForm, setShowBrochureForm] = useState(false);
  const [brochureData, setBrochureData] = useState({ name: '', email: '', phone: '' });

  const [categories, setCategories] = useState(WFA_PRODUCTS.categories);
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    
    Promise.all([
      getCategories(),
      getProductBySlug(slug)
    ]).then(async ([cats, prod]) => {
      if (!active) return;
      setCategories(cats);
      setProduct(prod);
      
      if (prod) {
        const rel = await getProductsByCategory(prod.category);
        if (active) {
          const relArray = Array.isArray(rel) ? rel : (rel && Array.isArray(rel.products) ? rel.products : []);
          setRelatedProducts(relArray.filter(p => p.slug !== prod.slug).slice(0, 3));
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    });

    return () => { active = false; };
  }, [slug]);

  const galleryImages = useMemo(() => {
    if (!product) return [];
    const fallbackImages = [product.image, product.heroImage].filter(Boolean);
    let gallery = [];
    if (product.gallery && Array.isArray(product.gallery)) {
      gallery = product.gallery;
    } else if (typeof product.gallery === 'string') {
      try {
        const parsed = JSON.parse(product.gallery);
        gallery = Array.isArray(parsed) ? parsed : [];
      } catch {
        gallery = [];
      }
    }
    const combined = Array.from(new Set([...gallery, ...fallbackImages])).filter(Boolean).slice(0, 5);
    if (combined.length === 0) {
      combined.push('/storage/products/1787224154_FeTzsn2enx.png');
    }
    return combined;
  }, [product]);

  const specs = useMemo(() => {
    if (!product) return [];
    let list = [];
    if (Array.isArray(product.specs)) list = product.specs;
    else if (typeof product.specs === 'string') {
      try {
        const parsed = JSON.parse(product.specs);
        if (Array.isArray(parsed)) list = parsed;
      } catch (e) {}
    }
    return list.filter((item) => {
      if (!item) return false;
      const label = Array.isArray(item) ? item[0] : (typeof item === 'object' ? item.label || item.key : item);
      if (!label) return true;
      const lower = String(label).trim().toLowerCase();
      return lower !== 'origin' && lower !== 'place of origin';
    });
  }, [product]);

  const highlights = useMemo(() => {
    if (!product) return [];
    if (Array.isArray(product.highlights)) return product.highlights;
    if (typeof product.highlights === 'string') {
      try {
        const parsed = JSON.parse(product.highlights);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {}
      return product.highlights.split(',').map(s => s.trim()).filter(Boolean);
    }
    return [];
  }, [product]);

  const technicalDetails = useMemo(() => {
    if (!product) return [];
    if (Array.isArray(product.technicalDetails)) return product.technicalDetails;
    if (typeof product.technicalDetails === 'string') {
      try {
        const parsed = JSON.parse(product.technicalDetails);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {}
      return product.technicalDetails.split(',').map(s => s.trim()).filter(Boolean);
    }
    return [];
  }, [product]);

  const showPreviousImage = () => {
    if (!galleryImages.length) return;
    setActiveImage((current) => (current - 1 + galleryImages.length) % galleryImages.length);
  };

  const showNextImage = () => {
    if (!galleryImages.length) return;
    setActiveImage((current) => (current + 1) % galleryImages.length);
  };

  const downloadBrochure = () => {
    if (!product) return;
    const lines = [
      'Water Filter Africa Product Brochure',
      '',
      product.name,
      product.shortDescription || product.description || '',
      '',
      `Brand: ${product.brand || 'Water Filter Africa'}`,
      `Type: ${product.type || '-'}`,
      `Capacity: ${product.capacity || '-'}`,
      '',
      'Specifications:',
      ...(specs || []).map((item) => {
        if (!item) return '';
        const label = Array.isArray(item) ? item[0] : (typeof item === 'object' ? item.label || item.key : item);
        const value = Array.isArray(item) ? item[1] : (typeof item === 'object' ? item.value : '');
        return `${label || 'Specification'}: ${value || '-'}`;
      }),
      '',
      'Contact: office@waterfilterafrica.com | +260 969 113 323'
    ];
    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${product.slug || 'water-filter-africa-product'}-brochure.txt`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const handleBrochureSubmit = async (event) => {
    event.preventDefault();
    const dataToSend = { ...brochureData };
    setShowBrochureForm(false);
    setBrochureData({ name: '', email: '', phone: '' });
    downloadBrochure();

    try {
      await submitEnquiry({
        name: dataToSend.name,
        email: dataToSend.email,
        phone: dataToSend.phone,
        product_name: product ? product.name : '',
        message: `Product brochure & details download request for: ${product ? product.name : 'Water Filter System'}`
      });
    } catch (e) {
      console.warn('Could not store brochure request:', e);
    }
  };

  useEffect(() => {
    if (!product) return;
    
    // Find meta tags for active country
    const countryCode = getActiveCountryCode() || 'default';
    const activeCountryCode = countryCode.toLowerCase();
    
    let metaTitle = product.name ? `${product.name} | Water Filter Africa` : 'Water Filter Africa';
    let metaDescription = product.shortDescription || product.description || '';
    let metaKeywords = '';
    
    if (product.meta_tags) {
      let metaTags = product.meta_tags;
      if (typeof metaTags === 'string') {
        try { metaTags = JSON.parse(metaTags); } catch (e) {}
      }
      if (metaTags && typeof metaTags === 'object') {
        // Look up by country code
        const countryMeta = metaTags[activeCountryCode] || metaTags[countryCode];
        if (countryMeta) {
          if (countryMeta.title) metaTitle = countryMeta.title;
          if (countryMeta.description) metaDescription = countryMeta.description;
          if (countryMeta.keywords) metaKeywords = countryMeta.keywords;
        }
      }
    }
    
    document.title = metaTitle;
    
    // Dynamically update/create meta tags in the document head
    let metaDescTag = document.querySelector('meta[name="description"]');
    if (!metaDescTag) {
      metaDescTag = document.createElement('meta');
      metaDescTag.name = 'description';
      document.head.appendChild(metaDescTag);
    }
    metaDescTag.content = metaDescription;
    
    if (metaKeywords) {
      let metaKeysTag = document.querySelector('meta[name="keywords"]');
      if (!metaKeysTag) {
        metaKeysTag = document.createElement('meta');
        metaKeysTag.name = 'keywords';
        document.head.appendChild(metaKeysTag);
      }
      metaKeysTag.content = metaKeywords;
    }

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const revealEls = document.querySelectorAll(".detail-reveal");
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("in-view");
      });
    }, { threshold: 0.16 });

    revealEls.forEach((el) => observer.observe(el));

    if (!reduced) {
      gsap.set(".detail-reveal", { autoAlpha: 0, y: 28, filter: "blur(8px)" });
      gsap.set(".hero-product-image", { autoAlpha: 0, scale: .94, y: 18 });
      gsap.to(".detail-hero .detail-reveal", {
        autoAlpha: 1,
        y: 0,
        filter: "blur(0)",
        duration: .82,
        stagger: .08,
        ease: "power3.out"
      });
      gsap.to(".hero-product-image", {
        autoAlpha: 1,
        scale: 1,
        y: 0,
        duration: 1,
        stagger: .08,
        ease: "power4.out"
      });
      gsap.to(".hero-product-image img", {
        y: -10,
        duration: 2.7,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
      gsap.to(".detail-reveal:not(.detail-hero .detail-reveal)", {
        autoAlpha: 1,
        y: 0,
        filter: "blur(0)",
        duration: .7,
        stagger: .06,
        scrollTrigger: {
          trigger: ".detail-content",
          start: "top 76%"
        }
      });
    } else {
      document.querySelectorAll(".detail-reveal, .hero-product-image").forEach((el) => {
        el.style.visibility = "visible";
        el.style.opacity = "1";
        el.style.transform = "none";
        el.style.filter = "none";
      });
    }

    const refreshTimer = setTimeout(() => ScrollTrigger.refresh(), 180);

    return () => {
      observer.disconnect();
      clearTimeout(refreshTimer);
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [product]);

  const categorySlug = useMemo(() => {
    if (!product) return 'categories';
    const cat = categories.find(c => c.id === product.category);
    return cat ? cat.slug : product.category;
  }, [product, categories]);

  if (loading) {
    return (
      <main id="top" className="product-detail-page flex items-center justify-center min-h-screen">
        <div className="text-xl font-bold text-gray-500 animate-pulse">Loading product details...</div>
      </main>
    );
  }

  if (!product) {
    return (
      <main id="top" className="product-detail-page">
        <section className="detail-hero" id="product-detail-banner">
          <div className="container">
            <nav className="breadcrumb detail-reveal" aria-label="Breadcrumb">
              <Link to="/">Home</Link>
              <span>/</span>
              <Link to="/product">Products</Link>
            </nav>
            <h1>Product not found</h1>
            <p><Link to="/product">Back to Products &rarr;</Link></p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main id="top" className="product-detail-page">
      <section className="detail-hero" id="product-detail-banner">
        <div className="detail-hero-bg" aria-hidden="true" />
        <div className="container detail-hero-grid">
          <div className="detail-product-stage" aria-label={`${product.name} product image`}>
            <div className="product-carousel">
              <div className="hero-product-image">
                <img src={(galleryImages.length ? galleryImages[activeImage] : null) || product.image || '/images/logo.png'} alt={`${product.name} view ${activeImage + 1}`} />
                {galleryImages.length > 1 && (
                  <>
                    <button className="carousel-arrow carousel-arrow-prev" type="button" onClick={showPreviousImage} aria-label="Show previous product image">
                      <span aria-hidden="true">{'\u003C'}</span>
                    </button>
                    <button className="carousel-arrow carousel-arrow-next" type="button" onClick={showNextImage} aria-label="Show next product image">
                      <span aria-hidden="true">{'\u003E'}</span>
                    </button>
                  </>
                )}
              </div>
              {galleryImages.length > 1 && (
                <div className="carousel-thumbs" aria-label="Product image thumbnails">
                  {galleryImages.map((image, index) => (
                    <button
                      className={index === activeImage ? "carousel-thumb active" : "carousel-thumb"}
                      type="button"
                      key={image}
                      onClick={() => setActiveImage(index)}
                      aria-label={`Show product image ${index + 1}`}
                      aria-current={index === activeImage}
                    >
                      <img src={image} alt="" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="detail-copy product-info-card">
            <nav className="breadcrumb detail-reveal" aria-label="Breadcrumb">
              <Link to="/">Home</Link>
              <span>/</span>
              <Link to="/product">Products</Link>
              <span>/</span>
              <Link to={`/${categorySlug}`}>{product.category || "Product Category"}</Link>
            </nav>
            <span className="eyebrow detail-reveal">{product.technology}</span>
            <h1 className="detail-reveal">{product.name}</h1>
            <p className="detail-lead detail-reveal">{product.shortDescription || product.description}</p>
            <div className="hero-facts detail-reveal">
              <div><span>Brand</span><strong>{product.brand}</strong></div>
              <div><span>Type</span><strong>{product.type}</strong></div>
              <div><span>Capacity</span><strong>{product.capacity}</strong></div>
            </div>
            <div className="hero-actions detail-reveal">
              <a href="https://wa.me/260969113323" target="_blank" rel="noreferrer">Request Quote</a>
              <button type="button" onClick={() => setShowBrochureForm(true)}>Download Brochure</button>
            </div>
          </div>
        </div>
      </section>

      {showBrochureForm && (
        <div className="brochure-modal" role="dialog" aria-modal="true" aria-labelledby="brochureTitle">
          <div className="brochure-modal-backdrop" onClick={() => setShowBrochureForm(false)} />
          <form className="brochure-form" onSubmit={handleBrochureSubmit}>
            <button className="brochure-close" type="button" onClick={() => setShowBrochureForm(false)} aria-label="Close brochure form">x</button>
            <span className="eyebrow">Brochure Access</span>
            <h2 id="brochureTitle">Download Brochure</h2>
            <label>
              Full Name *
              <input required value={brochureData.name} onChange={(e) => setBrochureData({ ...brochureData, name: e.target.value })} />
            </label>
            <label>
              Email Address *
              <input required type="email" value={brochureData.email} onChange={(e) => setBrochureData({ ...brochureData, email: e.target.value })} />
            </label>
            <label>
              Phone Number *
              <input required type="tel" value={brochureData.phone} onChange={(e) => setBrochureData({ ...brochureData, phone: e.target.value })} />
            </label>
            <button type="submit">Submit & Download</button>
          </form>
        </div>
      )}

      <section className="detail-content">
        <div className="container detail-content-grid">
          <aside className="product-snapshot detail-reveal">
            <span>Model</span>
            <strong>{product.model}</strong>
            <span>Capacity</span>
            <strong>{product.capacity}</strong>
            <span>Warranty</span>
            <strong>10 Year Warranty</strong>
          </aside>

          <div className="product-story">
            <section className="detail-panel detail-reveal">
              <span className="eyebrow">Engineered Disinfection</span>
              <h2>Ultraviolet water disinfection built for reliable operation.</h2>
              <p>{product.description}</p>
              <div className="highlight-grid">
                {(highlights || []).map((item, idx) => (
                  <div className="highlight-card" key={(item || '') + idx}>
                    <span aria-hidden="true" />
                    <p>{item}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <section className="detail-panel spec-panel full-width detail-reveal">
            <div>
              <span className="eyebrow">Product Details</span>
              <h2>Built for chemical-free water sterilization.</h2>
            </div>
            <div className="product-table-wrap">
              <table className="product-spec-table">
                <tbody>
                  {(specs || []).map((item, idx) => {
                    if (!item) return null;
                    const label = Array.isArray(item) ? item[0] : (typeof item === 'object' ? item.label || item.key : item);
                    const value = Array.isArray(item) ? item[1] : (typeof item === 'object' ? item.value : '');
                    return (
                      <tr key={(label || '') + idx}>
                        <th scope="row">{label || 'Specification'}</th>
                        <td>{value || '-'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>

          <section className="tech-strip full-width detail-reveal">
            {(technicalDetails || []).map((item, idx) => (
              <span key={(item || '') + idx}>{item}</span>
            ))}
          </section>
        </div>
      </section>

      {relatedProducts.length > 0 && (
        <section className="section related-products-section detail-reveal">
          <div className="container">
            <span className="eyebrow">Related Solutions</span>
            <h2>Products in the Same Category</h2>
            <div className="related-products-grid">
              {relatedProducts.map((p) => (
                <Link to={`/product/${p.slug}`} key={p.id} className="related-product-card">
                  <div className="related-product-image">
                    <img src={p.image || '/storage/products/1787224154_FeTzsn2enx.png'} alt={p.name} />
                  </div>
                  <div className="related-product-content">
                    <span className="related-tech">{p.technology}</span>
                    <h3>{p.name}</h3>
                    <span className="related-link">View Details &rarr;</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
