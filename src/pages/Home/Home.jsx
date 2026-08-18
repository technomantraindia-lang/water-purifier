import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BLOG_POSTS } from '../../data/blog-data';
import './Home.css';

gsap.registerPlugin(ScrollTrigger);

const INDUSTRIES_DATA = [
  { id: "01", title: "Agriculture", desc: "High-efficiency irrigation and agricultural crop water filtration systems.", icon: <path d="M5 21a7 7 0 0 1 14 0M12 3v12M8 9a4 4 0 0 1 8 0"/>, note: "Irrigation & crop water" },
  { id: "02", title: "Sea Water", desc: "Reverse osmosis pre-treatment and rugged marine seawater desalination filters.", icon: <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z M3 21h18"/>, note: "Desalination & intake" },
  { id: "03", title: "Mining", desc: "Heavy-duty particulate filtration and scale control for mining process water.", icon: <path d="M14.5 9.5l6 6M9.5 14.5l-6-6M6 4l6 6-4 4-6-6zM18 14l-4 4 6 6 2-2z"/>, note: "Process & heavy-load water" },
  { id: "04", title: "Municipal", desc: "High-capacity filtration systems for public municipal utility and drinking water networks.", icon: <path d="M3 21h18M5 21V10l4-4 4 4v11M13 21V12l3-3 3 3v9M9 14h2M9 17h2M15 15h2"/> },
  { id: "05", title: "Power & Energy", desc: "Conditioning and filtration for power generation and energy facilities.", icon: <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/> },
  { id: "06", title: "Dairy", desc: "Hygienic water solutions for livestock, dairy operations and processing.", icon: <path d="M12 21.5c-3.3 0-6-2.7-6-6v-6c0-3.3 2.7-6 6-6s6 2.7 6 6v6c0 3.3-2.7 6-6 6z M9 9.5h6"/> },
  { id: "07", title: "Hospital & Healthcare", desc: "Controlled high-quality water solutions for hospitals, clinics and healthcare environments.", icon: <path d="M19 10.5V20a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-9.5M12 3v12M8 7h8"/> },
  { id: "08", title: "Metal Reduction", desc: "Specialized treatment for processes requiring reduction of dissolved metals.", icon: <path d="M4 4h16v16H4z M9 9l6 6M15 9l-6 6"/> },
  { id: "09", title: "Restaurant & Hotel", desc: "Reliable filtered water for hospitality, kitchens, guest facilities and commercial operations.", icon: <path d="M3 21h18M5 21V8a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v13M9 10h6M9 14h6"/> },
  { id: "10", title: "Boiler Feed", desc: "Conditioned feed water designed to protect boiler systems and improve operating efficiency.", icon: <path d="M12 2a10 10 0 1 1 0 20 10 10 0 0 1-0-20z M8 12h8M12 8v8"/> },
  { id: "11", title: "Wastewater", desc: "Advanced treatment and recovery solutions for wastewater applications.", icon: <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM12 6v6l4 2"/> },
  { id: "12", title: "Disaster Relief", desc: "Rapid-deployment water purification solutions for emergency and disaster conditions.", icon: <path d="M12 2L2 22h20L12 2zM12 9v4M12 17h.01"/> },
  { id: "13", title: "Marine", desc: "Reliable filtration and treatment technologies for vessels and marine environments.", icon: <path d="M22 12h-4l-3 9L9 3l-3 9H2"/> },
  { id: "14", title: "Spot Free Rinse", desc: "High-purity rinse water for applications requiring residue-free drying.", icon: <path d="M12 2v20M5 12h14M12 2a5 5 0 0 1 5 5M12 22a5 5 0 0 0-5-5"/> },
  { id: "15", title: "Offshore", desc: "Robust water-treatment solutions for offshore facilities and demanding operating conditions.", icon: <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm1 14h-2v-2h2zm0-4h-2V7h2z"/> },
  { id: "16", title: "Environmental", desc: "Responsible water-treatment systems supporting environmental protection and reuse.", icon: <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/> },
  { id: "17", title: "Refinery", desc: "Industrial filtration and conditioning solutions for refinery process-water requirements.", icon: <path d="M4 22V2h16v20H4zm4-4h8v-4H8v4zm0-8h8V6H8v4z"/> },
  { id: "18", title: "Residential", desc: "Safe and dependable filtration for homes, apartments and residential developments.", icon: <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10"/> },
  { id: "19", title: "Industrial", desc: "Heavy-duty treatment systems for manufacturing, processing and industrial operations.", icon: <path d="M19 21V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v16M9 21v-6h6v6M12 7h.01M12 11h.01"/> },
  { id: "20", title: "Iron Reduction", desc: "Water-treatment solutions designed to reduce iron and improve water quality.", icon: <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zm-3-10h6"/> }
];

const TESTIMONIALS_DATA = [
  {
    badge: "Mining Application",
    quote: '"The high-capacity sediment filters installed by Water Filter Africa solved our pipeline clog issues. Their systems handle extremely high flow rates without drop in pressure."',
    author: "Mark Thompson",
    role: "Operations Director, Zambian Copper Corp",
    initials: "MT"
  },
  {
    badge: "Agriculture Infrastructure",
    quote: '"Our greenhouse crop yields increased by 20% after implementing their sand filtration and UV control systems. The water purity is highly consistent."',
    author: "Elena Nkosi",
    role: "Lead Agronomist, African Green Farms",
    initials: "EN"
  },
  {
    badge: "Municipal Utility",
    quote: '"Reliability and scale were our primary concerns for the city intake project. Water Filter Africa delivered robust demineralization plants within budget."',
    author: "David Olatunji",
    role: "Infrastructure Manager, Metropolitan Water Board",
    initials: "DO"
  },
  {
    badge: "Hospitality & Resorts",
    quote: '"Protecting our hotel boiler feeds and offering spot-free guest rinsing water was critical. Their multi-stage softening filters are exceptional."',
    author: "Sophie Dubois",
    role: "General Manager, Blue Horizon Resort",
    initials: "SD"
  }
];

const HERO_BANNERS = [
  { src: "/images/banner .png", alt: "Water Filter Africa banner 1" },
  { src: "/images/2 banner.png", alt: "Water Filter Africa banner 2" }
];

export default function Home() {
  const [activeHeroBanner, setActiveHeroBanner] = useState(0);
  const [activeFeaturedProduct, setActiveFeaturedProduct] = useState(0);
  const [isHoveringFeatured, setIsHoveringFeatured] = useState(false);

  // Stacked tabs state
  const [activeTab, setActiveTab] = useState('mission');

  // Matrix cell preview state
  const [hoveredIndustry, setHoveredIndustry] = useState(0);
  const [displayIndustry, setDisplayIndustry] = useState(0);

  // Testimonials Carousel state
  const [activeTestimonial, setActiveTestimonial] = useState(1);
  const [isHoveringTestimonials, setIsHoveringTestimonials] = useState(false);

  // Contact Form States
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    application: '',
    message: ''
  });
  const [formStatus, setFormStatus] = useState({
    show: false,
    message: ''
  });

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    setFormStatus({
      show: true,
      message: 'Thank you for your message! Our team will get back to you shortly.'
    });
  };

  const cellsGlowRefs = useRef([]);
  const featuredTrackRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveHeroBanner((current) => (current + 1) % HERO_BANNERS.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const track = featuredTrackRef.current;
    if (!track) return;

    const slides = track.querySelectorAll(".product-editorial-row");
    const slide = slides[activeFeaturedProduct];
    if (!slide) return;

    track.scrollTo({
      left: slide.offsetLeft - track.offsetLeft,
      behavior: "smooth"
    });
  }, [activeFeaturedProduct]);

  useEffect(() => {
    if (isHoveringFeatured) return undefined;

    const interval = setInterval(() => {
      setActiveFeaturedProduct((current) => (current + 1) % 4);
    }, 4500);

    return () => clearInterval(interval);
  }, [isHoveringFeatured]);

  const showPrevFeaturedProduct = () => {
    setActiveFeaturedProduct((current) => (current === 0 ? 3 : current - 1));
  };

  const showNextFeaturedProduct = () => {
    setActiveFeaturedProduct((current) => (current + 1) % 4);
  };

  // GSAP animations on mount
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    // Reveal fallbacks
    const revealEls = document.querySelectorAll(".reveal");
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("in-view");
      });
    }, { threshold: 0.14 });
    revealEls.forEach((el) => observer.observe(el));

    // About Section Visual Column Reveal (from Left)
    gsap.from(".about-visual-column", {
      scrollTrigger: {
        trigger: ".about-section",
        start: "top 80%",
      },
      x: -80,
      opacity: 0,
      duration: 1.1,
      ease: "power3.out"
    });

    // About Section Content Column Reveal (from Right)
    gsap.from(".about-content-premium > .eyebrow-premium, .about-content-premium > .title-premium, .about-content-premium > .desc-premium, .about-capabilities, .editorial-tabs, .about-content-premium > .btn-premium-inline", {
      scrollTrigger: {
        trigger: ".about-section",
        start: "top 80%",
      },
      x: 80,
      opacity: 0,
      duration: 0.9,
      stagger: 0.12,
      ease: "power3.out"
    });
    
    // Subtle Parallax Effect for About Section Images
    gsap.to(".about-image-main img", {
      scrollTrigger: {
        trigger: ".about-section",
        start: "top bottom",
        end: "bottom top",
        scrub: true
      },
      y: -30,
      ease: "none"
    });
    
    gsap.to(".about-image-secondary img", {
      scrollTrigger: {
        trigger: ".about-section",
        start: "top bottom",
        end: "bottom top",
        scrub: true
      },
      y: 20,
      ease: "none"
    });

    // Upgraded: Industries Section Split Reveal Timeline
    const introTl = gsap.timeline({
      scrollTrigger: {
        trigger: ".industries-section",
        start: "top 75%"
      }
    });

    introTl.from(".industries-header-left > *", {
      x: -60,
      opacity: 0,
      duration: 0.7,
      stagger: 0.15,
      ease: "power3.out"
    });

    const numVal = { val: 0 };
    introTl.from(".industries-header-right > *", {
      x: 60,
      opacity: 0,
      duration: 0.7,
      stagger: 0.15,
      ease: "power3.out"
    }, "-=0.5");

    introTl.to(numVal, {
      val: 20,
      duration: 1.5,
      ease: "power2.out",
      onUpdate: () => {
        const statNum = document.getElementById("ind-stat-number");
        if (statNum) statNum.textContent = Math.floor(numVal.val);
      }
    }, "-=0.4");

    introTl.from(".matrix-grid", {
      x: 80,
      opacity: 0,
      scale: 0.985,
      duration: 0.8,
      ease: "power3.out"
    }, "-=1.0");

    introTl.fromTo(".matrix-grid", 
      { clipPath: "inset(0 100% 0 0)" },
      { clipPath: "inset(0 0 0 0)", duration: 0.8, ease: "power3.inOut" },
      "-=0.6"
    );

    const cellsArray = Array.from(document.querySelectorAll(".matrix-cell"));
    introTl.from(cellsArray, {
      opacity: 0,
      y: 20,
      duration: 0.4,
      stagger: 0.02,
      ease: "power2.out",
      clearProps: "all"
    }, "-=0.4");

    introTl.from(".matrix-preview-strip", {
      x: 40,
      y: 20,
      opacity: 0,
      duration: 0.6,
      ease: "power3.out"
    }, "-=0.2");
    
    // Parallax background items
    gsap.to(".bg-glow-1, .ripple-1", {
      scrollTrigger: {
        trigger: ".industries-section",
        start: "top bottom",
        end: "bottom top",
        scrub: 1
      },
      y: -40,
      x: 20,
      ease: "none"
    });
    gsap.to(".bg-glow-2, .ripple-2", {
      scrollTrigger: {
        trigger: ".industries-section",
        start: "top bottom",
        end: "bottom top",
        scrub: 1
      },
      y: 40,
      x: -20,
      ease: "none"
    });

    // Testimonials Section Cinematic Reveal
    gsap.from(".testimonials-section .eyebrow-premium, .testimonials-section .title-premium, .testimonials-section .desc-premium", {
      scrollTrigger: {
        trigger: ".testimonials-section",
        start: "top 80%"
      },
      x: 60,
      opacity: 0,
      duration: 1.0,
      stagger: 0.15,
      ease: "power3.out"
    });

    gsap.from(".testimonials-carousel-container", {
      scrollTrigger: {
        trigger: ".testimonials-carousel-container",
        start: "top 75%"
      },
      x: -80,
      opacity: 0,
      duration: 1.2,
      ease: "power3.out"
    });

    // Featured Products Showcase Row reveals
    [1, 2, 3, 4].forEach(num => {
      const row = document.getElementById(`prod-row-${num}`);
      if (row) {
        const visualPanel = row.querySelector(".product-visual-panel");
        const contentPanel = row.querySelector(".product-content-panel");
        const bgNum = contentPanel.querySelector(".content-panel-bg-num");
        const category = contentPanel.querySelector(".product-card-category");
        const heading = contentPanel.querySelector(".product-showcase-heading");
        const desc = contentPanel.querySelector(".product-showcase-desc");
        const metadata = contentPanel.querySelector(".product-metadata-grid");
        const ctaBlock = contentPanel.querySelector(".showcase-cta-block");

        const rowTl = gsap.timeline({
          scrollTrigger: {
            trigger: row,
            start: "top 78%"
          }
        });

        const isEven = num % 2 === 0;
        const visualX = isEven ? 40 : -40;
        const contentX = isEven ? -40 : 40;

        rowTl.from(visualPanel, {
          x: visualX,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out"
        });

        rowTl.from(bgNum, {
          scale: 0.8,
          opacity: 0,
          duration: 0.6,
          ease: "power2.out"
        }, "-=0.7");

        rowTl.from([category, heading, desc], {
          x: contentX,
          opacity: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "power3.out"
        }, "-=0.6");

        rowTl.from(metadata, {
          y: 15,
          opacity: 0,
          duration: 0.5,
          ease: "power2.out"
        }, "-=0.3");

        rowTl.from(ctaBlock, {
          y: 10,
          opacity: 0,
          duration: 0.4,
          ease: "power2.out"
        }, "-=0.2");
      }
    });

    gsap.from(".showcase-range-strip", {
      scrollTrigger: {
        trigger: ".showcase-range-strip",
        start: "top 85%"
      },
      y: 40,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out"
    });

    // Premium Contact Section Reveal
    const contactTl = gsap.timeline({
      scrollTrigger: {
        trigger: ".contact-section",
        start: "top 75%"
      }
    });

    contactTl.from(".contact-left .eyebrow-premium", {
      y: 20,
      opacity: 0,
      duration: 0.4,
      ease: "power2.out"
    });

    contactTl.from(".contact-left .title-premium", {
      clipPath: "inset(100% 0 0 0)",
      y: 20,
      duration: 0.6,
      ease: "power3.out"
    }, "-=0.25");

    contactTl.from(".contact-left p.desc-premium", {
      y: 20,
      opacity: 0,
      duration: 0.5,
      ease: "power2.out"
    }, "-=0.3");

    contactTl.from(".contact-info-row", {
      y: 15,
      opacity: 0,
      duration: 0.5,
      stagger: 0.1,
      ease: "power2.out"
    }, "-=0.2");

    contactTl.from(".contact-quick-actions > *", {
      scale: 0.95,
      opacity: 0,
      duration: 0.4,
      stagger: 0.08,
      ease: "power2.out"
    }, "-=0.2");

    contactTl.from(".contact-form-container", {
      opacity: 0,
      x: 60,
      scale: 0.97,
      duration: 0.8,
      ease: "power3.out"
    }, "-=0.6");

    contactTl.from(".contact-form-container .form-head-premium > *, .contact-form-container .form-field-group, .contact-form-container .form-submit-btn, .contact-form-container .form-trust-note", {
      y: 15,
      opacity: 0,
      duration: 0.5,
      stagger: 0.04,
      ease: "power2.out"
    }, "-=0.4");

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
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      observer.disconnect();
      clearTimeout(timer1);
      clearTimeout(timer2);
      window.removeEventListener('load', handleWindowLoad);
    };
  }, []);

  // Industry connection line & text fade effect
  useEffect(() => {
    const targetElements = [
      document.getElementById("preview-icon-container"),
      document.getElementById("preview-industry-title"),
      document.getElementById("preview-industry-desc")
    ].filter(Boolean);
    if (!targetElements.length) return;

    const tl = gsap.timeline();
    tl.to(targetElements, {
      opacity: 0,
      y: -6,
      duration: 0.11,
      ease: "power2.in",
      stagger: 0.02,
      onComplete: () => {
        setDisplayIndustry(hoveredIndustry);
        gsap.set(targetElements, { y: 6 });
      }
    });
    tl.to(targetElements, {
      opacity: 1,
      y: 0,
      duration: 0.15,
      stagger: 0.02,
      ease: "power2.out"
    });
  }, [hoveredIndustry]);

  // Industry Cell Glow pointer hover tracking
  const handleMouseMove = (e, index) => {
    const glow = cellsGlowRefs.current[index];
    if (window.innerWidth > 768 && glow) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left - 60;
      const y = e.clientY - rect.top - 60;
      
      gsap.to(glow, {
        x: x,
        y: y,
        duration: 0.2,
        ease: "power2.out"
      });
    }
  };

  // Testimonials Carousel updates
  useEffect(() => {
    const cards = document.querySelectorAll('.testimonial-card');
    if (!cards.length) return;
    const total = cards.length;
    let prevIndex = activeTestimonial - 1;
    if (prevIndex < 0) prevIndex = total - 1;
    let rightNextIndex = activeTestimonial + 1;
    if (rightNextIndex >= total) rightNextIndex = 0;

    cards.forEach((card, idx) => {
      if (idx === activeTestimonial) {
        gsap.set(card, { zIndex: 30 });
        gsap.to(card, {
          xPercent: 0,
          z: 0,
          scale: 1,
          rotation: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 0.8,
          ease: "power4.out"
        });

        const badge = card.querySelector(".testimonial-badge");
        const quote = card.querySelector(".testimonial-quote");
        const author = card.querySelector(".testimonial-author");
        gsap.fromTo([badge, quote, author], 
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.4, stagger: 0.08, ease: "power2.out", delay: 0.25 }
        );
      } else if (idx === prevIndex) {
        gsap.set(card, { zIndex: 10 });
        gsap.to(card, {
          xPercent: -62,
          z: -100,
          scale: 0.82,
          rotation: -4,
          opacity: 0.35,
          filter: "blur(3px)",
          duration: 0.8,
          ease: "power4.out"
        });
      } else if (idx === rightNextIndex) {
        gsap.set(card, { zIndex: 10 });
        gsap.to(card, {
          xPercent: 62,
          z: -100,
          scale: 0.82,
          rotation: 4,
          opacity: 0.35,
          filter: "blur(3px)",
          duration: 0.8,
          ease: "power4.out"
        });
      } else {
        gsap.set(card, { zIndex: 0 });
        gsap.to(card, {
          xPercent: 0,
          z: -200,
          scale: 0.7,
          rotation: 0,
          opacity: 0,
          filter: "blur(8px)",
          duration: 0.8,
          ease: "power4.out"
        });
      }
    });

    const progressBar = document.querySelector(".pagination-progress-bar");
    if (progressBar) {
      const progressPct = ((activeTestimonial + 1) / total) * 100;
      gsap.to(progressBar, {
        width: `${progressPct}%`,
        duration: 0.8,
        ease: "power4.out"
      });
    }
  }, [activeTestimonial]);

  // Testimonials autoplay
  useEffect(() => {
    let interval = null;
    if (!isHoveringTestimonials) {
      interval = setInterval(() => {
        setActiveTestimonial((prev) => (prev + 1) % TESTIMONIALS_DATA.length);
      }, 6000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isHoveringTestimonials]);

  const handlePrevTestimonial = () => {
    setActiveTestimonial((prev) => {
      let nextIdx = prev - 1;
      return nextIdx < 0 ? TESTIMONIALS_DATA.length - 1 : nextIdx;
    });
  };

  const handleNextTestimonial = () => {
    setActiveTestimonial((prev) => (prev + 1) % TESTIMONIALS_DATA.length);
  };

  // Touch Swipe on testimonials
  let startX = 0;
  const handleTouchStart = (e) => {
    startX = e.touches[0].clientX;
  };
  const handleTouchEnd = (e) => {
    const endX = e.changedTouches[0].clientX;
    const diff = startX - endX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        handleNextTestimonial();
      } else {
        handlePrevTestimonial();
      }
    }
  };

  const navigateToContact = (e) => {
    e.preventDefault();
    const contactSection = document.getElementById("contact");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const navigateToProductsSection = (e) => {
    e.preventDefault();
    const section = document.getElementById("products");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <main id="home">
      <section className="hero">
        <div className="hero-banner hero-carousel">
          {HERO_BANNERS.map((banner, index) => (
            <img
              key={banner.src}
              src={banner.src}
              alt={banner.alt}
              className={index === activeHeroBanner ? 'active' : ''}
              onLoad={() => ScrollTrigger.refresh()}
            />
          ))}
          <button
            className="hero-carousel-arrow hero-carousel-prev"
            type="button"
            aria-label="Previous banner"
            onClick={() => setActiveHeroBanner((current) => (current - 1 + HERO_BANNERS.length) % HERO_BANNERS.length)}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
          <button
            className="hero-carousel-arrow hero-carousel-next"
            type="button"
            aria-label="Next banner"
            onClick={() => setActiveHeroBanner((current) => (current + 1) % HERO_BANNERS.length)}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
          <div className="hero-carousel-dots" aria-label="Banner slides">
            {HERO_BANNERS.map((banner, index) => (
              <button
                key={banner.src}
                type="button"
                className={index === activeHeroBanner ? 'active' : ''}
                aria-label={`Show banner ${index + 1}`}
                onClick={() => setActiveHeroBanner(index)}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="products-section" id="products">
        <div className="blur-orb-1"></div>
        <div className="blur-orb-2"></div>
        <div className="container">
          <div className="section-header-premium">
            <span className="eyebrow-premium">Water Solutions by Application</span>
            <h2 className="title-premium">Main Product Categories</h2>
            <p className="desc-premium">Water Filter Africa provides high-performance, custom-engineered filtration and purification systems tailored to different environments and water quality requirements.</p>
          </div>
          
          <div className="categories-grid">
            <Link className="category-card" data-grid="industrial" to="/category/industrial-water-filtration">
              <div className="category-card-bg">
                <img src="/images/industrial_filtration.png" alt="Industrial Water Filtration" />
              </div>
              <div className="category-card-overlay"></div>
              <div className="category-card-content">
                <span className="category-card-number">01 / INDUSTRIAL</span>
                <h3 className="category-card-title">Industrial Water Filtration</h3>
                <p className="category-card-desc">High-capacity filtration systems engineered for demanding industrial processes, mining, and power generation.</p>
                <span className="category-card-cta">
                  <span>Explore Systems</span>
                  <svg className="cta-arrow" viewBox="0 0 24 24" width="20" height="20">
                    <path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                  </svg>
                </span>
              </div>
              <div className="category-card-border"></div>
            </Link>

            <Link className="category-card" data-grid="agriculture" to="/category/agriculture-farming-water-filtration">
              <div className="category-card-bg">
                <img src="/images/agriculture_filtration.png" alt="Agriculture Water Filtration" />
              </div>
              <div className="category-card-overlay"></div>
              <div className="category-card-content">
                <span className="category-card-number">02 / AGRICULTURE</span>
                <h3 className="category-card-title">Agriculture Water Filtration</h3>
                <p className="category-card-desc">Optimize irrigation systems, protect farm crops, and improve yield quality with cleaner water source filters.</p>
                <span className="category-card-cta">
                  <span>Explore Systems</span>
                  <svg className="cta-arrow" viewBox="0 0 24 24" width="20" height="20">
                    <path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                  </svg>
                </span>
              </div>
              <div className="category-card-border"></div>
            </Link>

            <Link className="category-card" data-grid="animal-farming" to="/category/animal-farming-water-filtration">
              <div className="category-card-bg">
                <img src="/images/animal_farming_filtration.png" alt="Animal Farming Water Filtration" />
              </div>
              <div className="category-card-overlay"></div>
              <div className="category-card-content">
                <span className="category-card-number">03 / LIVESTOCK</span>
                <h3 className="category-card-title">Animal Farming Water Filtration</h3>
                <p className="category-card-desc">Ensure highly productive livestock with safe, disease-free, and impurity-free water supply.</p>
                <span className="category-card-cta">
                  <span>Explore Systems</span>
                  <svg className="cta-arrow" viewBox="0 0 24 24" width="20" height="20">
                    <path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                  </svg>
                </span>
              </div>
              <div className="category-card-border"></div>
            </Link>

            <Link className="category-card" data-grid="commercial" to="/category/commercial-water-filters">
              <div className="category-card-bg">
                <img src="/images/commercial_filtration.png" alt="Commercial Water Filters" />
              </div>
              <div className="category-card-overlay"></div>
              <div className="category-card-content">
                <span className="category-card-number">04 / COMMERCIAL</span>
                <h3 className="category-card-title">Commercial Water Filters</h3>
                <p className="category-card-desc">Advanced scale and purification solutions tailored for hotels, clinics, offices, and schools.</p>
                <span className="category-card-cta">
                  <span>Explore Systems</span>
                  <svg className="cta-arrow" viewBox="0 0 24 24" width="20" height="20">
                    <path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                  </svg>
                </span>
              </div>
              <div className="category-card-border"></div>
            </Link>

            <Link className="category-card" data-grid="domestic" to="/category/domestic-water-filtration-system">
              <div className="category-card-bg">
                <img src="/images/domestic_filtration.png" alt="Domestic Water Filtration System" />
              </div>
              <div className="category-card-overlay"></div>
              <div className="category-card-content">
                <span className="category-card-number">05 / RESIDENTIAL</span>
                <h3 className="category-card-title">Domestic Water Filtration System</h3>
                <p className="category-card-desc">Whole-house premium water filtration, conditioning, and softeners for household health.</p>
                <span className="category-card-cta">
                  <span>Explore Systems</span>
                  <svg className="cta-arrow" viewBox="0 0 24 24" width="20" height="20">
                    <path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                  </svg>
                </span>
              </div>
              <div className="category-card-border"></div>
            </Link>
          </div>
        </div>
      </section>

      <section className="about-section" id="about">
        <div className="container">
          <div className="about-grid">
            <div className="about-visual-column">
              <div className="about-vertical-label">Water Filter Africa</div>
              <div className="about-image-main">
                <img src="/images/about_engineering.png" alt="Advanced Water Engineering" />
              </div>
              <div className="about-image-secondary">
                <img src="/images/about_clean_water.png" alt="Clean Water Filtration Detail" />
              </div>
              <div className="about-stat-panel">
                <h4>100%</h4>
                <p>Advanced Water Treatment Across Multiple Applications</p>
              </div>
            </div>

            <div className="about-content-premium">
              <span className="eyebrow-premium">About Water Filter Africa</span>
              <h2 className="title-premium">Advanced Water Treatment Built Around Real-World Applications</h2>
              <p className="desc-premium">Joshi Ion Exchange Ltd. operates as Water Filter Africa, supplying application-based, custom-engineered filtration, conditioning, and purification systems for residential, agricultural, livestock, commercial buildings, and heavy industry across Africa.</p>
              
              <div className="about-capabilities">
                <div className="capability-row">
                  <div className="capability-icon">
                    <svg viewBox="0 0 24 24" width="24" height="24">
                      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
                      <path d="M12 18.5a3.5 3.5 0 0 0 3.5-3.5h-7a3.5 3.5 0 0 0 3.5 3.5z" fill="currentColor"/>
                    </svg>
                  </div>
                  <span className="capability-label">Water purification & filtration systems</span>
                </div>
                <div className="capability-row">
                  <div className="capability-icon">
                    <svg viewBox="0 0 24 24" width="24" height="24">
                      <circle cx="12" cy="12" r="6" fill="none" stroke="currentColor" strokeWidth="2"/>
                      <path d="M12 2v2m0 16v2M2 12h2m16 0h2m-3.17-8.83-1.41 1.41m-10.84 10.84-1.41 1.41m0-13.66 1.41 1.41m10.84 10.84 1.41-1.41" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <span className="capability-label">UV disinfection & conditioning technologies</span>
                </div>
                <div className="capability-row">
                  <div className="capability-icon">
                    <svg viewBox="0 0 24 24" width="24" height="24">
                      <path d="M3 21h18M6 21V10m6 11V6m6 15V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span className="capability-label">Solutions from domestic to industrial scale</span>
                </div>
              </div>

              <div className="editorial-tabs">
                <div 
                  className={`tab-item ${activeTab === 'mission' ? 'active' : ''}`} 
                  onClick={() => setActiveTab('mission')}
                  onMouseEnter={() => { if (window.innerWidth > 768) setActiveTab('mission'); }}
                >
                  <div className="tab-header">
                    <span className="tab-number">01</span>
                    <span className="tab-title">Mission</span>
                  </div>
                  <div className="tab-content">
                    <p>Deliver efficient and environmentally responsible water solutions.</p>
                  </div>
                </div>
                <div 
                  className={`tab-item ${activeTab === 'vision' ? 'active' : ''}`} 
                  onClick={() => setActiveTab('vision')}
                  onMouseEnter={() => { if (window.innerWidth > 768) setActiveTab('vision'); }}
                >
                  <div className="tab-header">
                    <span className="tab-number">02</span>
                    <span className="tab-title">Vision</span>
                  </div>
                  <div className="tab-content">
                    <p>Become a trusted African provider of advanced water treatment systems.</p>
                  </div>
                </div>
                <div 
                  className={`tab-item ${activeTab === 'approach' ? 'active' : ''}`} 
                  onClick={() => setActiveTab('approach')}
                  onMouseEnter={() => { if (window.innerWidth > 768) setActiveTab('approach'); }}
                >
                  <div className="tab-header">
                    <span className="tab-number">03</span>
                    <span className="tab-title">Approach</span>
                  </div>
                  <div className="tab-content">
                    <p>Match systems to water source, flow requirement and application.</p>
                  </div>
                </div>
              </div>

              <a href="#contact" onClick={navigateToContact} className="btn-premium-inline">
                <span>Discover Our Company</span>
                <svg className="cta-arrow" viewBox="0 0 24 24" width="20" height="20" style={{ marginLeft: '8px' }}>
                  <path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Showcase Section */}
      <section className="featured-products-section" id="featured-products">
        <div className="container">
          <div className="showcase-header">
            <div className="left-header-block">
              <span className="eyebrow-premium">Featured Solutions</span>
              <h2 className="title-premium" style={{ margin: 0 }}>Engineered Solutions for Every Water Need</h2>
            </div>
            <div className="right-header-block">
              <p style={{ margin: 0 }}>Explore selected technologies across industrial, agricultural, commercial and domestic water-treatment applications.</p>
            </div>
          </div>

          <div className="featured-products-carousel">
            <button className="featured-nav featured-prev" type="button" aria-label="Previous featured product" onClick={showPrevFeaturedProduct}>
              <svg viewBox="0 0 24 24"><path d="M15 18 9 12l6-6"/></svg>
            </button>
            <div
              className="featured-products-scroll"
              aria-label="Featured product solutions"
              ref={featuredTrackRef}
              onMouseEnter={() => setIsHoveringFeatured(true)}
              onMouseLeave={() => setIsHoveringFeatured(false)}
            >
          {/* Product Row 1: Industrial */}
          <div className="product-editorial-row row-odd" id="prod-row-1">
            <div className="product-visual-panel">
              <div className="visual-panel-grid"></div>
              <div className="visual-panel-blueprint">
                <span className="visual-panel-coordinate coordinate-tl">SYS_SERUSUV-1A [N-55]</span>
                <span className="visual-panel-coordinate coordinate-br">44.8°N / 20.4°E</span>
              </div>
              <span className="visual-featured-badge">Featured Technology</span>
              <div className="visual-panel-glow"></div>
              <img src="/images/Ultraviolet Disinfectant-Sterilizer SERUSUV-1A UV transparent.png" alt="Ultraviolet disinfectant-sterilizer - SERUSUV-1A UV" className="visual-panel-equipment" />
              <div className="visual-panel-reflection"></div>
            </div>
            
            <div className="product-content-panel">
              <span className="content-panel-bg-num">01</span>
              <span className="product-card-category">01 / Industrial System</span>
              <h3 className="product-showcase-heading">Ultraviolet<br/>Disinfectant-Sterilizer<br/>SERUSUV-1A UV</h3>
              <p className="product-showcase-desc">Advanced UV disinfection technology designed for high-performance industrial water-treatment applications.</p>
              
              <div className="product-metadata-grid">
                <div className="metadata-grid-row">
                  <span className="metadata-row-label">Application</span>
                  <span className="metadata-row-value">Industrial Water Treatment</span>
                </div>
                <div className="metadata-grid-row">
                  <span className="metadata-row-label">Technology</span>
                  <span className="metadata-row-value">UV Sterilization</span>
                </div>
              </div>
              
              <div className="showcase-cta-block">
                <a href="https://www.waterfilterafrica.com/ultraviolet-disinfectant-sterilizer-serusuv-1a-uv" target="_blank" rel="noreferrer" className="premium-action-explore">
                  <span>Explore Product</span>
                  <svg viewBox="0 0 24 24"><path d="M5 19L19 5M19 5H10M19 5V14" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor" strokeWidth="2.5" fill="none"/></svg>
                </a>
                <a href="#products" onClick={navigateToProductsSection} className="premium-action-category">View Category →</a>
              </div>
            </div>
          </div>

          <div className="row-divider-container">
            <span className="row-divider-number">02 /</span>
            <div className="row-divider-line"></div>
          </div>

          {/* Product Row 2: Agriculture */}
          <div className="product-editorial-row row-even" id="prod-row-2">
            <div className="product-visual-panel">
              <div className="visual-panel-grid"></div>
              <div className="visual-panel-blueprint">
                <span className="visual-panel-coordinate coordinate-tl">SYS_DESALTER [AG-02]</span>
                <span className="visual-panel-coordinate coordinate-br">15.3°S / 28.2°E</span>
              </div>
              <span className="visual-featured-badge">Selected Solution</span>
              <div className="visual-panel-glow"></div>
              <img src="/images/Serus LLC Desalter Water Desalination.png" alt="Serus llc desalter water desalination" className="visual-panel-equipment" />
              <div className="visual-panel-reflection"></div>
            </div>
            
            <div className="product-content-panel">
              <span className="content-panel-bg-num">02</span>
              <span className="product-card-category">02 / Agriculture Filtration</span>
              <h3 className="product-showcase-heading">Serus LLC<br/>Desalter Water<br/>Desalination</h3>
              <p className="product-showcase-desc">Reliable desalination and treatment support for demanding agricultural and farming water needs.</p>
              
              <div className="product-metadata-grid">
                <div className="metadata-grid-row">
                  <span className="metadata-row-label">Application</span>
                  <span className="metadata-row-value">Agricultural & Irrigation</span>
                </div>
                <div className="metadata-grid-row">
                  <span className="metadata-row-label">Technology</span>
                  <span className="metadata-row-value">Structured Desalination</span>
                </div>
              </div>
              
              <div className="showcase-cta-block">
                <a href="https://www.waterfilterafrica.com/serus-llc-desalter-water-desalination" target="_blank" rel="noreferrer" className="premium-action-explore">
                  <span>Explore Product</span>
                  <svg viewBox="0 0 24 24"><path d="M5 19L19 5M19 5H10M19 5V14" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor" strokeWidth="2.5" fill="none"/></svg>
                </a>
                <a href="#products" onClick={navigateToProductsSection} className="premium-action-category">View Category →</a>
              </div>
            </div>
          </div>

          <div className="row-divider-container">
            <span className="row-divider-number">03 /</span>
            <div className="row-divider-line"></div>
          </div>

          {/* Product Row 3: Commercial */}
          <div className="product-editorial-row row-odd" id="prod-row-3">
            <div className="product-visual-panel">
              <div className="visual-panel-grid"></div>
              <div className="visual-panel-blueprint">
                <span className="visual-panel-coordinate coordinate-tl">SYS_SERUSUV-1A [C-88]</span>
                <span className="visual-panel-coordinate coordinate-br">33.9°S / 18.4°E</span>
              </div>
              <span className="visual-featured-badge">Featured Technology</span>
              <div className="visual-panel-glow"></div>
              <img src="/images/Ultraviolet Disinfectant-Sterilizer SERUSUV-1A UV transparent.png" alt="Ultraviolet disinfectant-sterilizer - SERUSUV-1A UV" className="visual-panel-equipment" />
              <div className="visual-panel-reflection"></div>
            </div>
            
            <div className="product-content-panel">
              <span className="content-panel-bg-num">03</span>
              <span className="product-card-category">03 / Commercial Filters</span>
              <h3 className="product-showcase-heading">Ultraviolet<br/>Disinfectant-Sterilizer<br/>SERUSUV-1A UV</h3>
              <p className="product-showcase-desc">Dependable sterilization and water disinfection for commercial and institutional water systems.</p>
              
              <div className="product-metadata-grid">
                <div className="metadata-grid-row">
                  <span className="metadata-row-label">Application</span>
                  <span className="metadata-row-value">Commercial Water Supply</span>
                </div>
                <div className="metadata-grid-row">
                  <span className="metadata-row-label">Technology</span>
                  <span className="metadata-row-value">UV Disinfection</span>
                </div>
              </div>
              
              <div className="showcase-cta-block">
                <a href="https://www.waterfilterafrica.com/ultraviolet-disinfectant-sterilizer-serusuv-1a-uv" target="_blank" rel="noreferrer" className="premium-action-explore">
                  <span>Explore Product</span>
                  <svg viewBox="0 0 24 24"><path d="M5 19L19 5M19 5H10M19 5V14" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor" strokeWidth="2.5" fill="none"/></svg>
                </a>
                <a href="#products" onClick={navigateToProductsSection} className="premium-action-category">View Category →</a>
              </div>
            </div>
          </div>

          <div className="row-divider-container">
            <span className="row-divider-number">04 /</span>
            <div className="row-divider-line"></div>
          </div>

          {/* Product Row 4: Domestic */}
          <div className="product-editorial-row row-even" id="prod-row-4">
            <div className="product-visual-panel">
              <div className="visual-panel-grid"></div>
              <div className="visual-panel-blueprint">
                <span className="visual-panel-coordinate coordinate-tl">SYS_MAGNETIC [D-12]</span>
                <span className="visual-panel-coordinate coordinate-br">1.29°S / 36.8°E</span>
              </div>
              <span className="visual-featured-badge">Selected Solution</span>
              <div className="visual-panel-glow"></div>
              <img src="/images/Magnetic Structured Water Device For 100,000 LPH.png" alt="Magnetic Structured water device for 100,000 LPH" className="visual-panel-equipment" />
              <div className="visual-panel-reflection"></div>
            </div>
            
            <div className="product-content-panel">
              <span className="content-panel-bg-num">04</span>
              <span className="product-card-category">04 / Domestic Filtration</span>
              <h3 className="product-showcase-heading">Magnetic Structured<br/>Water Device<br/>For 100,000 LPH</h3>
              <p className="product-showcase-desc">Engineered water-conditioning technology for advanced residential and domestic filtration requirements.</p>
              
              <div className="product-metadata-grid">
                <div className="metadata-grid-row">
                  <span className="metadata-row-label">Application</span>
                  <span className="metadata-row-value">Residential Water Supply</span>
                </div>
                <div className="metadata-grid-row">
                  <span className="metadata-row-label">Technology</span>
                  <span className="metadata-row-value">Magnetic Structuring</span>
                </div>
              </div>
              
              <div className="showcase-cta-block">
                <a href="https://www.waterfilterafrica.com/magnetic-structured-water-device-for-100000-lph" target="_blank" rel="noreferrer" className="premium-action-explore">
                  <span>Explore Product</span>
                  <svg viewBox="0 0 24 24"><path d="M5 19L19 5M19 5H10M19 5V14" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor" strokeWidth="2.5" fill="none"/></svg>
                </a>
                <a href="#products" onClick={navigateToProductsSection} className="premium-action-category">View Category →</a>
              </div>
            </div>
          </div>
            </div>
            <button className="featured-nav featured-next" type="button" aria-label="Next featured product" onClick={showNextFeaturedProduct}>
              <svg viewBox="0 0 24 24"><path d="m9 18 6-6-6-6"/></svg>
            </button>
            <div className="featured-dots" aria-label="Featured product position">
              {[0, 1, 2, 3].map((index) => (
                <button
                  key={index}
                  type="button"
                  className={activeFeaturedProduct === index ? 'active' : ''}
                  aria-label={`Show featured product ${index + 1}`}
                  onClick={() => setActiveFeaturedProduct(index)}
                />
              ))}
            </div>
          </div>

          <div className="showcase-range-strip">
            <div className="range-strip-text-box">
              <span>Explore the Complete Range</span>
              <h3>Find the Right Technical Solution for Your Project</h3>
              <p>Discover our extensive catalogue of reverse osmosis, UV sterilizers, mechanical sand filters, softeners, and chemical treatment devices.</p>
            </div>
            <div className="range-strip-action-box">
              <a href="#products" onClick={navigateToProductsSection} className="btn-range-browse">
                <span>Browse All Products</span>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14m-6-6 6 6-6 6"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="industries-section" id="applications">
        <div className="bg-radial-glow bg-glow-1"></div>
        <div className="bg-radial-glow bg-glow-2"></div>
        <div className="moving-grid-bg"></div>
        <div className="translucent-ripple ripple-1"></div>
        <div className="translucent-ripple ripple-2"></div>
        
        <div className="container">
          <div className="industries-header-split">
            <div className="industries-header-left">
              <span className="eyebrow-premium">Applications & Industries</span>
              <h2 className="title-premium">Water Solutions Across Every Environment</h2>
            </div>
            <div className="industries-header-right">
              <p>From agriculture and municipal infrastructure to offshore operations, healthcare and industrial processing, our filtration technologies adapt to diverse water conditions.</p>
              <div className="ind-stat-block">
                <span className="ind-stat-number" id="ind-stat-number">20</span>
                <span className="ind-stat-label">Application<br/>Environments</span>
              </div>
            </div>
          </div>

          <div className="industries-wrapper">
            <div className="matrix-grid-container">
              <div className="active-connection-line"></div>
              
              <div className="matrix-grid">
                {INDUSTRIES_DATA.map((ind, index) => (
                  <div 
                    key={ind.id}
                    className={`matrix-cell ${hoveredIndustry === index ? 'active' : ''}`}
                    ref={el => cellsGlowRefs.current[index] = el ? el.querySelector('.cell-glow') : null}
                    onMouseMove={(e) => handleMouseMove(e, index)}
                    onMouseEnter={() => setHoveredIndustry(index)}
                    onClick={navigateToContact}
                  >
                    <div className="cell-glow"></div>
                    <div className="cell-icon-bg"></div>
                    <div className="cell-top">
                      <span className="cell-num">{ind.id}</span>
                      <span className="cell-arrow">↗</span>
                    </div>
                    <div className="cell-body">
                      <div className="cell-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          {ind.icon}
                        </svg>
                      </div>
                      <span className="cell-title">{ind.title}</span>
                    </div>
                    {ind.note && <div className="cell-hover-note">{ind.note}</div>}
                    <div className="cell-bottom-line"></div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="matrix-preview-strip">
              <div className="preview-accent-line"></div>
              <div className="preview-left">
                <div className="preview-icon-wrapper" id="preview-icon-container">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    {INDUSTRIES_DATA[displayIndustry].icon}
                  </svg>
                </div>
                <span className="preview-title" id="preview-industry-title">
                  {INDUSTRIES_DATA[displayIndustry].title}
                </span>
              </div>
              <div className="preview-center">
                <p className="preview-desc" id="preview-industry-desc">
                  {INDUSTRIES_DATA[displayIndustry].desc}
                </p>
              </div>
              <div className="preview-right">
                <a href="#contact" onClick={navigateToContact} className="preview-link">
                  <span>Explore Solutions</span>
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14m-6-6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="testimonials-section">
        <div className="testimonials-decor-ring decor-ring-3"></div>
        <div className="testimonials-caustic-bg"></div>
        
        <div className="container">
          <div className="section-header-premium text-center" style={{ margin: '0 auto 60px', maxWidth: '800px' }}>
            <span className="eyebrow-premium" style={{ justifyContent: 'center' }}>Client Experiences</span>
            <h2 className="title-premium text-white">Trusted Across Industries. <br/>Proven in Practice.</h2>
            <p className="desc-premium text-white-muted" style={{ margin: '0 auto', maxWidth: '60ch' }}>Hear from organizations that rely on Water Filter Africa for dependable filtration, treatment and application-specific water solutions.</p>
          </div>

          <div 
            className="testimonials-carousel-container"
            onMouseEnter={() => setIsHoveringTestimonials(true)}
            onMouseLeave={() => setIsHoveringTestimonials(false)}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <div className="carousel-cards-wrapper">
              {TESTIMONIALS_DATA.map((t, index) => {
                let cardClass = 'hidden';
                const total = TESTIMONIALS_DATA.length;
                let prevIndex = activeTestimonial - 1;
                if (prevIndex < 0) prevIndex = total - 1;
                let rightNextIndex = (activeTestimonial + 1) % total;

                if (index === activeTestimonial) {
                  cardClass = 'active';
                } else if (index === prevIndex) {
                  cardClass = 'prev';
                } else if (index === rightNextIndex) {
                  cardClass = 'next';
                }

                return (
                  <article key={index} className={`testimonial-card ${cardClass}`} data-index={index}>
                    <div className="testimonial-quote-mark">“</div>
                    <span className="testimonial-badge">{t.badge}</span>
                    <p className="testimonial-quote">{t.quote}</p>
                    <div className="testimonial-author">
                      <div className="testimonial-client-image" aria-hidden="true">{t.initials}</div>
                      <div className="testimonial-author-copy">
                        <strong>{t.author}</strong>
                        <span>{t.role}</span>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            <div className="carousel-controls">
              <button className="carousel-btn btn-prev" aria-label="Previous Testimonial" onClick={handlePrevTestimonial}>
                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              
              <div className="carousel-pagination">
                <span className="page-num current-page">0{activeTestimonial + 1}</span>
                <div className="pagination-track">
                  <div className="pagination-progress-bar" style={{ width: `${((activeTestimonial + 1) / TESTIMONIALS_DATA.length) * 100}%` }}></div>
                </div>
                <span className="page-num total-pages">04</span>
              </div>

              <button className="carousel-btn btn-next" aria-label="Next Testimonial" onClick={handleNextTestimonial}>
                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="blog-section" id="blog">
        <div className="container">
          <div className="blog-header">
            <span className="eyebrow-premium">Water Knowledge</span>
            <h2 className="title-premium">Blogs & Latest Insights</h2>
          </div>
          <div className="blog-grid">
            {BLOG_POSTS.slice(0, 3).map((post, index) => (
              <article className="blog-card" key={post.title}>
                <span className="blog-index">0{index + 1}</span>
                <span className="blog-category">{post.category}</span>
                <h3>{post.title}</h3>
                <p>{post.excerpt}</p>
                <Link to="/blog">Read Blog <span>&rarr;</span></Link>
              </article>
            ))}
          </div>
          <Link className="blog-all-link" to="/blog">View All Blogs <span>&rarr;</span></Link>
        </div>
      </section>

      <section className="contact-section" id="contact">
        <div className="contact-decor-glow"></div>
        <div className="contact-decor-grid"></div>
        
        <div className="container">
          <div className="contact-left">
            <div className="map-card">
              <div className="map-card-head">
                <span className="form-label-tag">Find Us</span>
                <h3>Lusaka, Zambia</h3>
                <p>Water Filter Africa supports projects across Africa from our Lusaka office.</p>
              </div>
              <iframe
                title="Water Filter Africa location map"
                src="https://www.google.com/maps?q=Lusaka%2C%20Zambia&output=embed"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>

          <div className="contact-form-container" id="contact-form-box">
            {!formStatus.show ? (
              <>
                <div className="form-head-premium">
                  <span className="form-label-tag">Enquiry Form</span>
                  <h3>Contact Us</h3>
                  <p>Send us a message and our team will get in touch with you shortly.</p>
                </div>
                
                <form onSubmit={handleFormSubmit} className="contact-form" noValidate>
                  <div className="contact-form-grid">
                    <div className="form-field-group">
                      <label htmlFor="home-name">Full Name *</label>
                      <input
                        id="home-name"
                        type="text"
                        className="form-field-input"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>
                    <div className="form-field-group">
                      <label htmlFor="home-email">Email Address *</label>
                      <input
                        id="home-email"
                        type="email"
                        className="form-field-input"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                    <div className="form-field-group">
                      <label htmlFor="home-phone">Phone Number *</label>
                      <input
                        id="home-phone"
                        type="tel"
                        className="form-field-input"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                    <div className="form-field-group">
                      <label htmlFor="home-application">Application / Industry *</label>
                      <select
                        id="home-application"
                        className="form-field-input"
                        required
                        value={formData.application}
                        onChange={(e) => setFormData({ ...formData, application: e.target.value })}
                      >
                        <option value="">Select Application</option>
                        <option>Agriculture</option>
                        <option>Industrial</option>
                        <option>Commercial</option>
                        <option>Domestic</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <div className="form-field-group form-field-group-full">
                      <label htmlFor="home-message">Message / Project Details *</label>
                      <textarea
                        id="home-message"
                        className="form-field-input"
                        required
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      />
                    </div>
                  </div>
                  
                  <button type="submit" className="form-submit-btn">
                    <span>Send Message</span>
                    <svg viewBox="0 0 24 24"><path d="M5 12h14m-6-6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor" strokeWidth="2.5" fill="none"/></svg>
                  </button>
                </form>
              </>
            ) : (
              <div className="form-success-state">
                <div className="success-checkmark-box">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <h3>Message Sent Successfully!</h3>
                <p>Thank you for reaching out. We have received your inquiry and our team will get back to you shortly.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
