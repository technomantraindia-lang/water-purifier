import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { WFA_PRODUCTS } from '../../data/products-data';
import './ProductDetail.css';

gsap.registerPlugin(ScrollTrigger);

export default function ProductDetail() {
  const { slug } = useParams();
  const product = useMemo(
    () => WFA_PRODUCTS.products.find((item) => item.slug === slug) || WFA_PRODUCTS.products[0],
    [slug]
  );
  const category = WFA_PRODUCTS.categories.find((item) => item.id === product.category);
  const galleryImages = useMemo(() => {
    const fallbackImages = [product.heroImage, product.image, category?.image].filter(Boolean);
    return Array.from(new Set(product.gallery?.length ? product.gallery : fallbackImages)).slice(0, 3);
  }, [product, category]);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    setActiveImage(0);
  }, [product]);

  const showPreviousImage = () => {
    setActiveImage((current) => (current - 1 + galleryImages.length) % galleryImages.length);
  };

  const showNextImage = () => {
    setActiveImage((current) => (current + 1) % galleryImages.length);
  };

  useEffect(() => {
    document.title = `${product.name} | Water Filter Africa`;
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
      gsap.set(".product-orbit, .hero-product-image", { autoAlpha: 0, scale: .94, y: 18 });
      gsap.to(".detail-hero .detail-reveal", {
        autoAlpha: 1,
        y: 0,
        filter: "blur(0)",
        duration: .82,
        stagger: .08,
        ease: "power3.out"
      });
      gsap.to(".product-orbit, .hero-product-image", {
        autoAlpha: 1,
        scale: 1,
        y: 0,
        duration: 1,
        stagger: .08,
        ease: "power4.out"
      });
      gsap.to(".product-orbit", {
        rotate: 360,
        duration: 34,
        repeat: -1,
        ease: "none"
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
      document.querySelectorAll(".detail-reveal, .product-orbit, .hero-product-image").forEach((el) => {
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

  return (
    <main className="product-detail-page">
      <section className="detail-hero">
        <div className="detail-hero-bg" aria-hidden="true" />
        <div className="container detail-hero-grid">
          <div className="detail-product-stage" aria-label={`${product.name} product image`}>
            <div className="product-orbit" aria-hidden="true" />
            <div className="product-carousel">
              <div className="hero-product-image">
                <img src={galleryImages[activeImage] || product.heroImage || product.image} alt={`${product.name} view ${activeImage + 1}`} />
              </div>
              {galleryImages.length > 1 && (
                <>
                  <button className="carousel-arrow carousel-arrow-prev" type="button" onClick={showPreviousImage} aria-label="Show previous product image">
                    <span aria-hidden="true">&lt;</span>
                  </button>
                  <button className="carousel-arrow carousel-arrow-next" type="button" onClick={showNextImage} aria-label="Show next product image">
                    <span aria-hidden="true">&gt;</span>
                  </button>
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
                </>
              )}
            </div>
          </div>
          <div className="detail-copy product-info-card">
            <nav className="breadcrumb detail-reveal" aria-label="Breadcrumb">
              <Link to="/">Home</Link>
              <span>/</span>
              <Link to="/product">Products</Link>
              <span>/</span>
              <Link to={`/category/${category?.slug || WFA_PRODUCTS.categories[0].slug}`}>{category?.name || "Product Category"}</Link>
            </nav>
            <span className="eyebrow detail-reveal">{product.technology}</span>
            <h1 className="detail-reveal">{product.name}</h1>
            <p className="detail-lead detail-reveal">{product.shortDescription}</p>
            <div className="hero-facts detail-reveal">
              <div><span>Brand</span><strong>{product.brand}</strong></div>
              <div><span>Type</span><strong>{product.type}</strong></div>
              <div><span>Capacity</span><strong>{product.capacity}</strong></div>
              <div><span>Origin</span><strong>{product.origin}</strong></div>
            </div>
            <div className="hero-actions detail-reveal">
              <a href="https://wa.me/260969113323" target="_blank" rel="noreferrer">Request Quote</a>
              <Link to="/contact">Contact Team</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="detail-content">
        <div className="container detail-content-grid">
          <aside className="product-snapshot detail-reveal">
            <span>Model</span>
            <strong>{product.model}</strong>
            <span>Capacity</span>
            <strong>{product.capacity}</strong>
            <span>Origin</span>
            <strong>{product.origin}</strong>
            <span>Warranty</span>
            <strong>10 Year Warranty</strong>
          </aside>

          <div className="product-story">
            <section className="detail-panel detail-reveal">
              <span className="eyebrow">Engineered Disinfection</span>
              <h2>Ultraviolet water disinfection built for reliable operation.</h2>
              <p>{product.description}</p>
              <div className="highlight-grid">
                {product.highlights?.map((item) => (
                  <div className="highlight-card" key={item}>
                    <span aria-hidden="true" />
                    <p>{item}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="detail-panel spec-panel detail-reveal">
              <div>
                <span className="eyebrow">Product Details</span>
                <h2>Built for chemical-free water sterilization.</h2>
              </div>
              <div className="product-table-wrap">
                <table className="product-spec-table">
                  <tbody>
                    {product.specs?.map(([label, value]) => (
                      <tr key={label}>
                        <th scope="row">{label}</th>
                        <td>{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="tech-strip detail-reveal">
              {product.technicalDetails?.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}
