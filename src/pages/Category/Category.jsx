import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams, Link, useParams } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { WFA_PRODUCTS } from '../../data/products-data';
import { getCategories, getProductsByCategory } from '../../api';
import './Category.css';

gsap.registerPlugin(ScrollTrigger);

export default function Category() {
  const [searchParams] = useSearchParams();
  const params = useParams();
  const slug = params.slug || searchParams.get("slug") || '';

  const [categories, setCategories] = useState(WFA_PRODUCTS.categories);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Find category by slug first, then fallback to ID/category matching
  const displayCategory = useMemo(() => {
    const bySlug = categories.find(c => c.slug === slug);
    if (bySlug) return bySlug;
    const byId = categories.find(c => c.id === slug);
    if (byId) return byId;
    return categories[0] || {};
  }, [categories, slug]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    
    Promise.all([
      getCategories(),
      getProductsByCategory(slug)
    ]).then(([cats, catProducts]) => {
      if (active) {
        setCategories(cats);
        setProducts(catProducts);
        setLoading(false);
      }
    });

    return () => { active = false; };
  }, [slug]);

  useEffect(() => {
    if (!displayCategory.name) return;
    document.title = `${displayCategory.name} | Water Filter Africa`;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const revealEls = document.querySelectorAll(".reveal");
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("in-view");
      });
    }, { threshold: 0.14 });
    revealEls.forEach((el) => observer.observe(el));

    if (!reduced) {
      gsap.set(".reveal", { autoAlpha: 0, y: 24, filter: "blur(6px)" });
      gsap.to(".cat-hero .reveal", { autoAlpha: 1, y: 0, filter: "blur(0)", duration: .75, stagger: .08, ease: "power3.out" });
      gsap.to(".product-card", {
        autoAlpha: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.08,
        ease: "power3.out",
        delay: 0.4
      });
    } else {
      document.querySelectorAll(".reveal").forEach(el => {
        el.style.visibility = "visible";
        el.style.opacity = "1";
        el.style.transform = "none";
        el.style.filter = "none";
      });
    }

    const timer1 = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 150);

    const timer2 = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 1000);

    const handleWindowLoad = () => {
      ScrollTrigger.refresh();
    };
    window.addEventListener('load', handleWindowLoad);

    return () => {
      observer.disconnect();
      clearTimeout(timer1);
      clearTimeout(timer2);
      window.removeEventListener('load', handleWindowLoad);
    };
  }, [displayCategory.name, products]);

  return (
    <main id="top" className="category-page">
      <header className="cat-hero">
        <div className="container">
          <nav className="breadcrumb reveal" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <Link to="/product">Products</Link>
            <span>/</span>
            <span id="crumbCategory">{displayCategory.name || 'Category'}</span>
          </nav>
          <span className="eyebrow reveal" id="categoryEyebrow">
            Product Category / {displayCategory.number || ''}
          </span>
          <h1 className="reveal" id="categoryTitle">{displayCategory.name || 'Loading...'}</h1>
          <p className="cat-desc reveal" id="categoryDesc">{displayCategory.description || ''}</p>
        </div>
      </header>
      
      <section className="section">
        <div className="container">
          <div className="product-grid" id="productGrid">
            {products.length > 0 ? (
              products.map((p) => (
                <Link 
                  key={p.id}
                  className="product-card reveal" 
                  to={`/product/${p.slug}`}
                >
                  <div className="product-stage">
                    <img src={p.image || '/storage/products/1787224154_FeTzsn2enx.png'} alt={p.name} />
                  </div>
                  <span className="product-label">{p.technology || displayCategory.label}</span>
                  <h2>{p.name}</h2>
                  <p>{p.shortDescription || ''}</p>
                  <span className="product-cta">
                    View Product <span>&rarr;</span>
                  </span>
                </Link>
              ))
            ) : (
              <div className="empty" id="emptyState">
                No products are currently available in this category.<br />
                <Link to="/product">Back to Products &rarr;</Link>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
