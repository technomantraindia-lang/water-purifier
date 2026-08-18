import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { WFA_PRODUCTS } from '../../data/products-data';
import './Product.css';

gsap.registerPlugin(ScrollTrigger);

const ICONS = {
  industrial: (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 21h18M5 21V9l5 3V9l5 3V7h4v14M8 17h1M12 17h1M16 17h1"/>
    </svg>
  ),
  agriculture: (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 20c8-1 13-6 14-15-8 1-13 6-14 15ZM5 20c2-5 6-8 11-10M4 14H2m20 0h-2M12 22v-2"/>
    </svg>
  ),
  "animal-farming": (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 12c2-4 6-6 10-4 3 1 5 4 5 8v3M7 13h.01M10 19v-3M16 19v-3M18 11l3-2M6 9 4 6"/>
    </svg>
  ),
  commercial: (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 21V5h10v16M14 9h6v12M8 9h2M8 13h2M8 17h2M17 13h1M17 17h1"/>
    </svg>
  ),
  domestic: (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 11 12 4l9 7M5 10v11h14V10M9 21v-6h6v6M12 9c2 2 3 4 3 6a3 3 0 0 1-6 0c0-2 1-4 3-6Z"/>
    </svg>
  ),
  "ro-machine": (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 3h12v18H6zM9 7h6M9 11h6M10 16h4M4 8h2m12 0h2M4 16h2m12 0h2"/>
    </svg>
  ),
  "pressure-tank-accessories": (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 4h8c2 0 3 2 3 8s-1 8-3 8H8c-2 0-3-2-3-8s1-8 3-8ZM8 8h8M8 16h8"/>
    </svg>
  ),
  "filter-softener-valves": (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 12h16M8 8v8m8-8v8M9 6h6a3 3 0 0 1 0 12H9a3 3 0 0 1 0-12Z"/>
    </svg>
  ),
  "ozone-generator": (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3a5 5 0 0 0-5 5c0 5 5 13 5 13s5-8 5-13a5 5 0 0 0-5-5Zm0 7h.01M4 18c2-2 4-3 8-3s6 1 8 3"/>
    </svg>
  ),
  default: (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 11 12 4l9 7M5 10v11h14V10M9 21v-6h6v6M12 9c2 2 3 4 3 6a3 3 0 0 1-6 0c0-2 1-4 3-6Z" />
    </svg>
  )
};

export default function Product() {
  const categories = WFA_PRODUCTS.categories;

  // Helper to get icon by category slug (backend returns numeric IDs)
  const getIconKey = (category) => {
    const slug = category.slug || '';
    // Map slug patterns to icon keys
    if (slug.includes('industrial')) return 'industrial';
    if (slug.includes('agriculture')) return 'agriculture';
    if (slug.includes('animal')) return 'animal-farming';
    if (slug.includes('commercial')) return 'commercial';
    if (slug.includes('domestic')) return 'domestic';
    if (slug.includes('ro-machine')) return 'ro-machine';
    if (slug.includes('pressure')) return 'pressure-tank-accessories';
    if (slug.includes('filter') || slug.includes('valve')) return 'filter-softener-valves';
    if (slug.includes('ozone')) return 'ozone-generator';
    // Fallback to raw slug if it matches directly
    return slug || 'default';
  };

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    
    // Reveal fallbacks
    const revealEls = document.querySelectorAll(".reveal");
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("in-view");
      });
    }, { threshold: 0.14 });
    revealEls.forEach((el) => observer.observe(el));

    if (!reduced) {
      gsap.set(".reveal", { autoAlpha: 0, y: 35, scale: .97, filter: "blur(6px)" });
      gsap.set(".clip-reveal", { autoAlpha: 0, scale: 1.03 });
      
      gsap.to(".clip-reveal", { autoAlpha: 1, scale: 1, duration: 1, ease: "power4.out" });
      gsap.to(".eyebrow.reveal, h2.reveal, .lead.reveal", { autoAlpha: 1, y: 0, scale: 1, filter: "blur(0)", duration: .75, stagger: .08, ease: "power3.out" });
      gsap.to(".category-card", { autoAlpha: 1, y: 0, scale: 1, filter: "blur(0)", duration: .82, stagger: .1, delay: .22, ease: "power3.out" });
    } else {
      document.querySelectorAll(".reveal, .clip-reveal").forEach(el => {
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
  }, []);

  return (
    <main>
      <section className="hero-banner clip-reveal" aria-label="Products banner">
        <img 
          src="/images/product banner .png" 
          alt="Water Filter Africa products banner" 
          onLoad={() => ScrollTrigger.refresh()}
        />
      </section>
      <section className="section">
        <div className="container">
          <span className="eyebrow reveal">Our Product Range</span>
          <h2 className="reveal">Explore Water Solutions by Application</h2>
          <p className="lead reveal">Browse our water-treatment technologies by category to find solutions suited to industrial, agricultural, commercial, livestock and domestic applications.</p>
          
          <div className="category-grid" id="categoryGrid">
            {categories.map((category) => (
                <Link 
                  key={category.id} 
                  className="category-card reveal" 
                  to={`/category/${category.slug}`}
                >
                  <div className="category-image">
                    <img src={category.image || '/images/logo.png'} alt={category.name} />
                  </div>
                  <div className="category-content">
                    <div className="category-meta">
                      <span className="category-icon">{ICONS[getIconKey(category)] || ICONS['default']}</span>
                      <span className="category-num">{category.number || '0'} / {category.label || category.name}</span>
                    </div>
                    <h3>{category.name}</h3>
                    <p>{category.description}</p>
                    <span className="category-cta">
                      Explore Category <span>&rarr;</span>
                    </span>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </section>
    </main>
  );
}