import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { WFA_PRODUCTS } from '../../data/products-data';
import { CONTACT_PHONE, getCategories, getProductBySlug, getProductsByCategory, getActiveCountryCode, getCountryDetails, getEmbedMapUrl, submitEnquiry } from '../../api';
import './ProductDetail.css';
import FormattedContent from '../../components/FormattedContent';

gsap.registerPlugin(ScrollTrigger);

function getSpecificationEntry(specs, requestedLabel) {
  const requested = String(requestedLabel || '').trim().toLowerCase();
  return (specs || []).find((item) => {
    const label = Array.isArray(item) ? item[0] : (typeof item === 'object' ? item.label || item.key : item);
    return String(label || '').trim().toLowerCase() === requested;
  });
}

function getSpecificationValue(specs, requestedLabel) {
  const entry = getSpecificationEntry(specs, requestedLabel);
  if (Array.isArray(entry)) return entry[1] || '';
  if (entry && typeof entry === 'object') return entry.value || '';
  return '';
}

function getSpecificationLabel(specs, requestedLabel) {
  const entry = getSpecificationEntry(specs, requestedLabel);
  if (Array.isArray(entry)) return entry[0] || '';
  if (entry && typeof entry === 'object') return entry.label || entry.key || '';
  return '';
}

export default function ProductDetail() {
  const { slug, countryCode } = useParams();
  const navigate = useNavigate();
  const [activeImage, setActiveImage] = useState(0);
  const [showBrochureForm, setShowBrochureForm] = useState(false);
  const [brochureData, setBrochureData] = useState({ name: '', email: '', phone: '' });
  const [countryDetails, setCountryDetails] = useState(null);
  const [contactData, setContactData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    country: '',
    application: '',
    source: '',
    message: ''
  });
  const [contactStatus, setContactStatus] = useState({ show: false, success: false, message: '' });
  const [isSubmittingContact, setIsSubmittingContact] = useState(false);

  const [categories, setCategories] = useState(WFA_PRODUCTS.categories);
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (countryCode) return;
    const activeCountry = getActiveCountryCode();
    if (activeCountry) {
      navigate('/country/' + activeCountry + '/products/' + slug, { replace: true });
    }
  }, [countryCode, navigate, slug]);

  useEffect(() => {
    let active = true;
    const activeCountry = countryCode || getActiveCountryCode();

    if (!activeCountry) {
      setCountryDetails(null);
      return () => { active = false; };
    }

    getCountryDetails(activeCountry).then((details) => {
      if (!active) return;
      setCountryDetails(details);
      setContactData((current) => ({
        ...current,
        country: current.country || details?.name || activeCountry
      }));
    });

    return () => { active = false; };
  }, [countryCode]);

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

  const specificationLabels = useMemo(() => {
    const labels = product?.specLabels || product?.spec_labels || {};
    return {
      section: labels.section || (product?.name ? `${product.name} specifications` : ''),
      brand: labels.brand || getSpecificationLabel(specs, 'brand'),
      model: labels.model || (product?.model ? getSpecificationLabel(specs, 'model') : ''),
      capacity: labels.capacity || (product?.capacity ? getSpecificationLabel(specs, 'capacity') : ''),
      technology: labels.technology || product?.technology || product?.type || '',
      type: labels.type || getSpecificationLabel(specs, 'type')
    };
  }, [product, specs]);

  const productCopy = useMemo(() => {
    if (!product) return {};

    const productName = product.name || product.label || product.slug || '';
    const summary = product.shortDescription || product.description || productName;
    const technology = product.technology || product.type || product.category || productName;

    return {
      technology,
      detailsLabel: product.detailsLabel || product.details_label || technology,
      detailsHeading: product.detailsHeading || product.details_heading || summary,
      galleryLabel: product.detailImagesLabel || product.detail_images_label || `${productName} gallery`,
      galleryHeading: product.detailImagesHeading || product.detail_images_heading || `${productName} details`,
      galleryDescription: product.detailImagesDescription || product.detail_images_description || summary,
      specificationsLabel: product.specificationsLabel || product.specifications_label || `${productName} specifications`,
      specificationsHeading: product.specificationsHeading || product.specifications_heading || summary,
      supportLabel: product.supportLabel || product.support_label || technology,
      supportHeading: product.supportHeading || product.support_heading || `${productName} support`,
      supportDescription: product.supportDescription || product.support_description || summary,
      enquiryLabel: product.enquiryLabel || product.enquiry_label || `${productName} enquiry`,
      enquiryHeading: product.enquiryHeading || product.enquiry_heading || `${productName} requirements`,
      mapLabel: product.mapLabel || product.map_label || technology,
      mapHeading: countryDetails?.name
        ? `${productName} support in ${countryDetails.name}`
        : `${productName} support`
    };
  }, [product, countryDetails]);

  const warranty = useMemo(
    () => product?.warranty || getSpecificationValue(specs, 'warranty'),
    [product, specs]
  );

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

  const descriptionImages = useMemo(() => {
    const images = product?.descriptionImages ?? product?.description_images;
    if (Array.isArray(images)) return images.filter(Boolean);
    if (typeof images === 'string') {
      try {
        const parsed = JSON.parse(images);
        return Array.isArray(parsed) ? parsed.filter(Boolean) : [];
      } catch {
        return [];
      }
    }
    return [];
  }, [product]);

  const detailImages = useMemo(() => {
    const images = product?.detailImages ?? product?.detail_images;
    if (Array.isArray(images)) return images.filter(Boolean);
    if (typeof images === 'string') {
      try {
        const parsed = JSON.parse(images);
        return Array.isArray(parsed) ? parsed.filter(Boolean) : [];
      } catch {
        return [];
      }
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
    if (product.brochure) {
      const link = document.createElement('a');
      link.href = product.brochure;
      link.download = product.brochure.split('/').pop() || (product.slug || 'product') + '-brochure';
      link.target = '_blank';
      link.rel = 'noopener';
      document.body.appendChild(link);
      link.click();
      link.remove();
      return;
    }

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

  const handleProductContactSubmit = async (event) => {
    event.preventDefault();
    setIsSubmittingContact(true);
    setContactStatus({ show: false, success: false, message: '' });

    try {
      const response = await submitEnquiry({
        ...contactData,
        country: contactData.country || countryDetails?.name || countryCode || getActiveCountryCode(),
        product_name: product?.name || '',
        message: `Product enquiry for ${product?.name || 'Water Filter System'}\n\n${contactData.message}`
      });

      setContactStatus({
        show: true,
        success: true,
        message: response.message || 'Thank you. Your product enquiry has been submitted successfully.'
      });
      setContactData((current) => ({
        ...current,
        name: '',
        company: '',
        email: '',
        phone: '',
        application: '',
        source: '',
        message: ''
      }));
    } catch (error) {
      setContactStatus({
        show: true,
        success: false,
        message: error.message || 'Unable to submit your enquiry. Please try again.'
      });
    } finally {
      setIsSubmittingContact(false);
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

  const categoryLabel = useMemo(() => {
    const category = categories.find(c => c.id === product?.category);
    return category?.label || category?.name || product?.category || '';
  }, [product, categories]);

  const productPath = (productSlug) => (countryCode || getActiveCountryCode())
    ? '/country/' + (countryCode || getActiveCountryCode()) + '/products/' + productSlug
    : '/products/' + productSlug;

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
            </nav>
            <h1>Product not found</h1>
            <p><Link to="/">Back to Home &rarr;</Link></p>
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
              <Link to={`/${categorySlug}`}>{categoryLabel}</Link>
            </nav>
            <span className="eyebrow detail-reveal">{productCopy.technology}</span>
            <h1 className="detail-reveal">{product.name}</h1>
            <FormattedContent as="p" className="detail-lead detail-reveal" value={product.shortDescription || product.description} format={product.shortDescription ? (product.shortDescriptionFormat || 'plain') : (product.descriptionFormat || 'plain')} />
            <span className="eyebrow detail-reveal">{specificationLabels.section}</span>
            <div className="hero-facts detail-reveal">
              <div><span>{specificationLabels.brand}</span><strong>{product.brand}</strong></div>
              <div><span>{specificationLabels.type}</span><strong>{product.type}</strong></div>
              <div><span>{specificationLabels.capacity}</span><strong>{product.capacity}</strong></div>
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
            <p className="brochure-consent">By downloading this brochure, I agree to receive promotional emails and marketing communications from you.</p>
            <button type="submit">Submit & Download</button>
          </form>
        </div>
      )}

      <section className="detail-content">
        <div className="container detail-content-grid">
          <aside className="product-snapshot detail-reveal">
            <span>{specificationLabels.model}</span>
            <strong>{product.model}</strong>
            <span>{specificationLabels.capacity}</span>
            <strong>{product.capacity}</strong>
            {warranty && <><span>{getSpecificationLabel(specs, 'warranty') || 'Warranty'}</span><strong>{warranty}</strong></>}
          </aside>

          <div className="product-story">
            <section className="detail-panel detail-reveal">
              <span className="eyebrow">{productCopy.detailsLabel}</span>
              <h2>{productCopy.detailsHeading}</h2>
              <FormattedContent as="p" value={product.description} format={product.descriptionFormat || 'plain'} />
              {descriptionImages.length > 0 && (
                <div className="description-images" aria-label="Product description images">
                  {descriptionImages.map((image, index) => (
                    <img key={image} src={image} alt={`${product.name} description ${index + 1}`} loading="lazy" />
                  ))}
                </div>
              )}
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

          {detailImages.length > 0 && (
            <section className="detail-images-showcase full-width detail-reveal" aria-labelledby="detail-images-title">
              <div className="detail-images-heading">
                <span className="eyebrow">{productCopy.galleryLabel}</span>
                <h2 id="detail-images-title">{productCopy.galleryHeading}</h2>
                <p>{productCopy.galleryDescription}</p>
              </div>
              <div className="detail-images-grid">
                {detailImages.map((image, index) => (
                  <figure className="detail-image-card" key={`${image}-${index}`}>
                    <div className="detail-image-frame">
                      <img src={image} alt={`${product.name} product detail ${index + 1}`} loading="lazy" />
                      <span className="detail-image-number">{String(index + 1).padStart(2, '0')}</span>
                    </div>
                    <figcaption>Product detail <span aria-hidden="true">↗</span></figcaption>
                  </figure>
                ))}
              </div>
            </section>
          )}

          <section className="detail-panel spec-panel full-width detail-reveal">
            <div>
                <span className="eyebrow">{productCopy.specificationsLabel}</span>
                <h2>{productCopy.specificationsHeading}</h2>
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
                        <th scope="row">{label || productCopy.specificationsLabel}</th>
                        <td>{value || ''}</td>
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

      <section className="product-contact-section detail-reveal" aria-labelledby="product-contact-title">
        <div className="container">
          <div className="product-contact-grid">
            <aside className="product-contact-info">
              <span className="eyebrow">{productCopy.supportLabel}</span>
              <h2 id="product-contact-title">{productCopy.supportHeading}</h2>
              <p>{productCopy.supportDescription}</p>
              <div className="product-contact-details">
                <div>
                  <span>Office</span>
                  <strong>{countryDetails?.company_name || countryDetails?.name || product.brand || ''}</strong>
                </div>
                <div>
                  <span>Address</span>
                  <strong>{countryDetails?.address || ''}</strong>
                </div>
                <div>
                  <span>Email</span>
                  <a href={countryDetails?.email ? `mailto:${countryDetails.email}` : undefined}>
                    {countryDetails?.email || ''}
                  </a>
                </div>
                <div>
                  <span>Phone</span>
                  <a href={`tel:${CONTACT_PHONE}`}>
                    {CONTACT_PHONE}
                  </a>
                </div>
              </div>
            </aside>

            <div className="product-contact-form-wrap">
              <span className="eyebrow">{productCopy.enquiryLabel}</span>
              <h2>{productCopy.enquiryHeading}</h2>
              <form className="product-contact-form" onSubmit={handleProductContactSubmit}>
                <label>
                  Full Name *
                  <input required value={contactData.name} onChange={(e) => setContactData({ ...contactData, name: e.target.value })} />
                </label>
                <label>
                  Company / Organization
                  <input value={contactData.company} onChange={(e) => setContactData({ ...contactData, company: e.target.value })} />
                </label>
                <label>
                  Email Address *
                  <input required type="email" value={contactData.email} onChange={(e) => setContactData({ ...contactData, email: e.target.value })} />
                </label>
                <label>
                  Phone Number *
                  <input required type="tel" value={contactData.phone} onChange={(e) => setContactData({ ...contactData, phone: e.target.value })} />
                </label>
                <label>
                  Application / Industry
                  <input value={contactData.application} onChange={(e) => setContactData({ ...contactData, application: e.target.value })} placeholder={product.technology || product.category || ''} />
                </label>
                <label>
                  Water Source / Requirement
                  <input value={contactData.source} onChange={(e) => setContactData({ ...contactData, source: e.target.value })} />
                </label>
                <label className="product-contact-full">
                  Message / Project Details *
                  <textarea required rows="5" value={contactData.message} onChange={(e) => setContactData({ ...contactData, message: e.target.value })} />
                </label>
                <button className="product-contact-submit product-contact-full" type="submit" disabled={isSubmittingContact}>
                  {isSubmittingContact ? 'Sending Enquiry...' : 'Send Product Enquiry →'}
                </button>
              </form>
              {contactStatus.show && (
                <div className={`product-contact-status ${contactStatus.success ? 'success' : 'error'}`} role="status" aria-live="polite">
                  {contactStatus.message}
                </div>
              )}
            </div>
          </div>

          <div className="product-contact-map">
            <div>
              <span className="eyebrow">{productCopy.mapLabel}</span>
              <h2>{productCopy.mapHeading}</h2>
              <p>{countryDetails?.address || ''}</p>
            </div>
            {(countryDetails?.map_link || countryDetails?.address) && (
              <iframe
                title={`${countryDetails?.name || product.name} office map`}
                src={getEmbedMapUrl(countryDetails.map_link || countryDetails.address)}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            )}
          </div>
        </div>
      </section>

      {relatedProducts.length > 0 && (
        <section className="section related-products-section detail-reveal">
          <div className="container">
            <span className="eyebrow">Related Solutions</span>
            <h2>Products in the Same Category</h2>
            <div className="related-products-grid">
              {relatedProducts.map((p) => (
                <Link to={productPath(p.slug)} key={p.id} className="related-product-card">
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
