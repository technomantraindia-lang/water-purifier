import React, { useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getActiveCountryCode, getCountryDetails } from '../../api';
import './Contact.css';

gsap.registerPlugin(ScrollTrigger);

export default function Contact() {
  const [countryDetails, setCountryDetails] = useState(null);

  useEffect(() => {
    let active = true;
    const code = getActiveCountryCode();
    getCountryDetails(code).then(details => {
      if (active && details) setCountryDetails(details);
    });
    return () => { active = false; };
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    country: '',
    application: '',
    source: '',
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
      message: 'This form is ready for backend integration. Connect it to your enquiry handler to submit project details.'
    });
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

    if (!reduced && window.ScrollTrigger) {
      gsap.set(".reveal", { autoAlpha: 0, y: 24, filter: "blur(6px)" });
      gsap.set(".clip-reveal", { autoAlpha: 0, clipPath: "inset(0 100% 0 0)", scale: 1.04 });
      gsap.to(".hero-banner", { autoAlpha: 1, clipPath: "inset(0 0% 0 0)", scale: 1, duration: 1, ease: "power4.out" });
      
      gsap.set(".info-panel.reveal", { x: -40, y: 0 });
      gsap.set(".form-shell.reveal", { x: 40, y: 0, scale: .98 });
      
      document.querySelectorAll(".section, .trust-strip").forEach(section => {
        const tl = gsap.timeline({ scrollTrigger: { trigger: section, start: "top 76%", once: true } });
        const items = section.querySelectorAll(".eyebrow.reveal, h2.reveal, p.reveal, .lead.reveal, .intro-note.reveal, .info-panel.reveal, .contact-row.reveal, .form-shell.reveal");
        const clips = section.querySelectorAll(".clip-reveal");
        if (items.length) tl.to(items, { autoAlpha: 1, x: 0, y: 0, scale: 1, filter: "blur(0px)", duration: .74, stagger: .075, ease: "power3.out" });
        if (clips.length) tl.to(clips, { autoAlpha: 1, clipPath: "inset(0 0% 0 0)", scale: 1, duration: .95, stagger: .1, ease: "power4.out" }, "-=.45");
      });

      gsap.from(".form-grid .field", {
        scrollTrigger: { trigger: ".form-shell", start: "top 74%", once: true },
        autoAlpha: 0,
        y: 18,
        duration: .58,
        stagger: .045,
        ease: "power3.out"
      });
    } else {
      document.querySelectorAll(".reveal, .clip-reveal").forEach(el => {
        el.style.visibility = "visible";
        el.style.opacity = "1";
        el.style.transform = "none";
        el.style.clipPath = "none";
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
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      observer.disconnect();
      clearTimeout(timer1);
      clearTimeout(timer2);
      window.removeEventListener('load', handleWindowLoad);
    };
  }, []);

  return (
    <main id="top" className="contact-page">
      <section className="hero-banner clip-reveal" aria-label="Contact Water Filter Africa banner">
        <img 
          src="/images/contact banner.png" 
          alt="Contact Water Filter Africa banner" 
          onLoad={() => ScrollTrigger.refresh()}
        />
      </section>

      <section className="section">
        <div className="container intro-wrap">
          <div>
            <span className="eyebrow reveal">Let's Talk Water Solutions</span>
            <h2 className="reveal">Tell Us About Your Water Treatment Requirement</h2>
            <p className="lead reveal">Share your water source, application and treatment requirements with our team. We'll use the information to understand your enquiry and identify a suitable direction for your water-treatment needs.</p>
          </div>
          <p className="intro-note reveal">Water Filter Africa supports enquiries across filtration, purification, conditioning, UV disinfection, desalination and application-specific treatment needs.</p>
        </div>
      </section>

      <section className="section pale" id="enquiry">
        <div className="contact-wrap">
          <div className="contact-grid">
            <aside className="info-panel reveal">
              <span className="eyebrow">Contact Information</span>
              <h2>Speak With Our Team</h2>
              <p className="copy">Reach out to Water Filter Africa for product enquiries, application guidance and water-treatment requirements.</p>
              <div className="contact-rows">
                <div className="contact-row reveal">
                  <span className="contact-icon">⌖</span>
                  <div>
                    <small>Head Office</small>
                    <address className="office-address">
                      <strong>JOSHI ION EXCHANGE LTD</strong>
                      <span>P.O Box 32014, Lusaka</span>
                      <span>Zambia, Africa</span>
                    </address>
                  </div>
                </div>
                <div className="contact-row reveal">
                  <span className="contact-icon">@</span>
                  <div>
                    <small>Email</small>
                    <a href="mailto:office@waterfilterafrica.com">office@waterfilterafrica.com</a>
                    <a href="mailto:joshiionexchangeltd@gmail.com">joshiionexchangeltd@gmail.com</a>
                  </div>
                </div>
                <div className="contact-row reveal">
                  <span className="contact-icon">☎</span>
                  <div>
                    <small>Phone</small>
                    <a href="tel:+260969113323">+260969113323</a>
                  </div>
                </div>
              </div>
            </aside>

            <section className="form-shell reveal" aria-labelledby="formTitle">
              <span className="eyebrow">Project Enquiry</span>
              <h2 id="formTitle">Tell Us What You Need</h2>
              <p className="copy">Share your water source, application and treatment requirement so our team can understand your project better.</p>
              <form id="contactForm" className="form-grid" onSubmit={handleFormSubmit} noValidate>
                <div className="field">
                  <label htmlFor="name">Full Name *</label>
                  <input 
                    id="name" 
                    name="name" 
                    required 
                    autoComplete="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="field">
                  <label htmlFor="company">Company / Organization</label>
                  <input 
                    id="company" 
                    name="company" 
                    autoComplete="organization"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  />
                </div>
                <div className="field">
                  <label htmlFor="email">Email Address *</label>
                  <input 
                    id="email" 
                    name="email" 
                    type="email" 
                    required 
                    autoComplete="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div className="field">
                  <label htmlFor="phone">Phone Number *</label>
                  <input 
                    id="phone" 
                    name="phone" 
                    type="tel" 
                    required 
                    autoComplete="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div className="field">
                  <label htmlFor="country">Country</label>
                  <input 
                    id="country" 
                    name="country" 
                    autoComplete="country-name"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  />
                </div>
                <div className="field">
                  <label htmlFor="application">Application / Industry *</label>
                  <select 
                    id="application" 
                    name="application" 
                    required
                    value={formData.application}
                    onChange={(e) => setFormData({ ...formData, application: e.target.value })}
                  >
                    <option value="">Select application</option>
                    <option>Agriculture</option>
                    <option>Sea Water</option>
                    <option>Mining</option>
                    <option>Municipal</option>
                    <option>Power & Energy</option>
                    <option>Dairy</option>
                    <option>Hospital & Healthcare</option>
                    <option>Metal Reduction</option>
                    <option>Restaurant & Hotel</option>
                    <option>Boiler Feed</option>
                    <option>Wastewater</option>
                    <option>Disaster Relief</option>
                    <option>Marine</option>
                    <option>Spot Free Rinse</option>
                    <option>Offshore</option>
                    <option>Environmental</option>
                    <option>Refinery</option>
                    <option>Residential</option>
                    <option>Industrial</option>
                    <option>Iron Reduction</option>
                    <option>Other</option>
                  </select>
                </div>
                <div className="field full">
                  <label htmlFor="source">Water Source / Requirement</label>
                  <input 
                    id="source" 
                    name="source"
                    value={formData.source}
                    onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                  />
                </div>
                <div className="field full">
                  <label htmlFor="message">Message / Project Details *</label>
                  <textarea 
                    id="message" 
                    name="message" 
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  ></textarea>
                </div>
                <div className="field full">
                  <button className="btn" type="submit">
                    Send Enquiry <span className="arrow">&rarr;</span>
                  </button>
                </div>
              </form>
              <div 
                className="form-status" 
                id="formStatus" 
                role="status" 
                aria-live="polite"
                style={{ display: formStatus.show ? 'block' : 'none' }}
              >
                <strong>Backend Ready</strong><br />
                {formStatus.message}
              </div>
            </section>
          </div>
        </div>
      </section>

      <section className="contact-map-section" aria-label="Water Filter Africa location map">
        <div className="container">
          <div className="contact-map-card reveal">
            <div className="contact-map-copy">
              <span className="eyebrow">Find Us</span>
              <h2>{(countryDetails && countryDetails.name) ? `Water Treatment Support From ${countryDetails.name}` : 'Water Treatment Support From Lusaka'}</h2>
              <p className="copy">{(countryDetails && countryDetails.name) ? `Visit or contact our ${countryDetails.name} office for water filtration, purification and treatment requirements.` : 'Visit or contact our Zambia office for water filtration, purification and treatment requirements across Africa.'}</p>
              <address>
                <strong>JOSHI ION EXCHANGE LTD</strong>
                <span>{(countryDetails && countryDetails.address) || 'P.O Box 32014, Lusaka, Zambia, Africa'}</span>
              </address>
            </div>
            <div className="contact-map-frame">
              <iframe
                title="Water Filter Africa office map"
                src={(countryDetails && countryDetails.map_link) || 'https://www.google.com/maps?q=Lusaka%2C%20Zambia&output=embed'}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      </section>

      <section className="trust-strip">
        <div className="container">
          <strong>Need to discuss your requirement directly?</strong>
          <span>Call <a href="tel:+260969113323">+260969113323</a></span>
          <span>or email <a href="mailto:office@waterfilterafrica.com">office@waterfilterafrica.com</a></span>
        </div>
      </section>
    </main>
  );
}
