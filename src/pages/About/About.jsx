import React, { useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './About.css';

gsap.registerPlugin(ScrollTrigger);

const ABOUT_INDUSTRIES = [
  ["Agriculture", "Reliable filtration for irrigation, crop production and agricultural water management."],
  ["Sea Water", "Treatment approaches for challenging high-salinity source water applications."],
  ["Mining", "Robust water treatment support for demanding industrial operating environments."],
  ["Municipal", "Practical treatment systems for public and infrastructure water needs."],
  ["Power & Energy", "Water quality support for power, utilities and energy applications."],
  ["Dairy", "Filtration and water-treatment support for dairy operations."],
  ["Hospital & Healthcare", "Treatment approaches for healthcare water-quality requirements."],
  ["Metal Reduction", "Water treatment support for applications affected by metal content."],
  ["Restaurant & Hotel", "Commercial water filtration for hospitality environments."],
  ["Boiler Feed", "Conditioning and filtration for boiler feed water requirements."],
  ["Wastewater", "Treatment and recovery support for wastewater applications."],
  ["Disaster Relief", "Practical water-treatment approaches for urgent operating conditions."],
  ["Marine", "Water-treatment solutions for marine environments and vessel applications."],
  ["Spot Free Rinse", "High-purity rinse water for residue-sensitive applications."],
  ["Offshore", "Treatment capability for offshore operating environments."],
  ["Environmental", "Water technologies for environmental and quality-focused applications."],
  ["Refinery", "Industrial water treatment for refinery operating conditions."],
  ["Residential / House & Apartment Building", "Domestic and building-scale purification and filtration systems."],
  ["Industrial", "High-capacity treatment systems for process and plant requirements."],
  ["Iron Reduction", "Treatment approaches for water affected by iron content."]
];

const ICON_SVG = (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" width="24" height="24">
    <path d="M4 15c4-7 12-7 16 0M7 18c3-4 7-4 10 0M12 3v18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
);

export default function About() {
  const [activeIndustryIndex, setActiveIndustryIndex] = useState(0);
  const [displayIndustryIndex, setDisplayIndustryIndex] = useState(0);

  // Tech showcase hover index
  const [activeTechIndex, setActiveTechIndex] = useState(null);

  // Sync active industry detail with GSAP crossfade
  useEffect(() => {
    const appTitle = document.getElementById("appTitle");
    const appDesc = document.getElementById("appDesc");
    if (!appTitle || !appDesc) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!prefersReducedMotion) {
      gsap.to([appTitle, appDesc], {
        opacity: 0,
        y: 8,
        duration: 0.16,
        onComplete: () => {
          setDisplayIndustryIndex(activeIndustryIndex);
          gsap.set([appTitle, appDesc], { y: 0 }); // Note: script set y to 6, then animated to 0
          gsap.to([appTitle, appDesc], {
            opacity: 1,
            y: 0,
            duration: 0.28,
            stagger: 0.04,
            ease: "power3.out"
          });
        }
      });
    } else {
      setDisplayIndustryIndex(activeIndustryIndex);
    }
  }, [activeIndustryIndex]);

  // GSAP ScrollTriggers on mount
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Reveal fallbacks
    const revealEls = document.querySelectorAll(".reveal");
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("in-view");
      });
    }, { threshold: 0.14 });
    revealEls.forEach((el) => observer.observe(el));

    if (!prefersReducedMotion) {
      gsap.set(".reveal", { autoAlpha: 0, y: 24, filter: "blur(6px)" });
      gsap.set("h2.reveal", { autoAlpha: 0, y: 35, filter: "blur(4px)" });
      gsap.set(".contact-block.reveal", { x: 34, y: 0 });
      gsap.set(".clip-reveal", { autoAlpha: 0, clipPath: "inset(0 100% 0 0)", scale: 1.05 });
      gsap.set(".story-tech-line", { scaleX: 0 });
      gsap.from(".hero", { autoAlpha: 0, duration: .65, ease: "power3.out" });

      document.querySelectorAll(".section, .final-cta").forEach(section => {
        const tl = gsap.timeline({
          scrollTrigger: { trigger: section, start: "top 76%", once: true }
        });
        const eyebrow = section.querySelector(".eyebrow.reveal");
        const heading = section.querySelector("h2.reveal");
        const copy = section.querySelectorAll("p.reveal, .lead.reveal, .copy.reveal");
        const clips = section.querySelectorAll(".clip-reveal");
        const components = section.querySelectorAll(".hover-line.reveal, .mission-panel.reveal, .tech-node.reveal, .process-step.reveal, .industry-item.reveal, .tech-label.reveal, .why-block.reveal, .story-points .reveal, .actions.reveal, .contact-block.reveal, .app-detail.reveal, .story-float.reveal");

        if (eyebrow) tl.to(eyebrow, { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: .55, ease: "power3.out" });
        if (heading) tl.to(heading, { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: .82, ease: "power4.out" }, "-=.18");
        if (copy.length) tl.to(copy, { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: .68, stagger: .08, ease: "power3.out" }, "-=.28");
        if (clips.length) tl.to(clips, { autoAlpha: 1, clipPath: "inset(0 0% 0 0)", scale: 1, duration: 1.05, stagger: .1, ease: "power4.out" }, "-=.22");
        if (components.length) tl.to(components, { autoAlpha: 1, x: 0, y: 0, filter: "blur(0px)", duration: .72, stagger: .075, ease: "power3.out" }, "-=.42");

        if (section.querySelector(".story-tech-line")) {
          tl.to(section.querySelector(".story-tech-line"), { scaleX: 1, duration: .7, ease: "power3.out" }, "-=.2");
        }
      });

      document.querySelectorAll(".reveal").forEach(el => {
        el.addEventListener("transitionend", () => { el.style.filter = "none"; }, { once: true });
      });

      const processTl = gsap.timeline({
        scrollTrigger: {
          trigger: ".process-track",
          start: "top 76%",
          once: true,
          onEnter: () => document.querySelector(".process-track")?.classList.add("is-lit")
        }
      });
      processTl.from(".process-orbit", { autoAlpha: 0, scale: .82, duration: .75, ease: "power3.out" })
        .from(".process-scan", { autoAlpha: 0, y: -24, duration: .65, ease: "power3.out" }, "-=.48")
        .to(".process-line span", { scaleX: 1, scaleY: 1, duration: 1.2, ease: "power3.out" }, "-=.28")
        .to(".process-pulse", { opacity: 1, x: () => {
          const track = document.querySelector(".process-track");
          return track ? track.offsetWidth - 70 : 0;
        }, duration: 1.05, ease: "power2.inOut" }, "-=.9")
        .to(".process-pulse", { opacity: 0, duration: .25 }, "-=.1");

      gsap.to(".stage-product", { y: -18, stagger: .08, scrollTrigger: { trigger: ".dark-stage", start: "top bottom", end: "bottom top", scrub: 1 } });
      
      gsap.from(".stage-metric", {
        scrollTrigger: { trigger: ".dark-stage", start: "top 76%", once: true },
        autoAlpha: 0,
        y: 18,
        duration: .62,
        stagger: .08,
        delay: .35,
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
      const processLine = document.querySelector(".process-line span");
      if (processLine) processLine.style.transform = "scaleX(1)";
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
    <main id="top" className="about-page">
      <section className="hero hero-banner" aria-label="About Water Filter Africa banner">
        <img 
          src="/images/abou us banner.png" 
          alt="Water Filter Africa water-treatment banner" 
          onLoad={() => ScrollTrigger.refresh()}
        />
      </section>

      <section className="section pale" id="who">
        <div className="container intro-grid">
          <div className="image-stack clip-reveal">
            <div className="vertical-mark">Water Engineering</div>
            <div className="image-main"><img src="/images/about_engineering.png" alt="Water treatment engineering system" /></div>
            <div className="image-float"><img src="/images/about_clean_water.png" alt="Clean water filtration detail" /></div>
          </div>
          <div>
            <span className="eyebrow reveal">Who We Are</span>
            <h2 className="reveal">Practical Water Treatment Backed by Advanced Technology</h2>
            <p className="copy reveal">Joshi Ion Exchange Ltd. operates as Water Filter Africa, supplying application-based water-treatment and filtration solutions for households, agriculture, livestock, commercial buildings and industry across Africa.</p>
            <p className="copy reveal">Our focus is not simply on supplying equipment. We match treatment technologies to the water source, flow requirement, application and operating environment so each solution is practical, scalable and fit for purpose.</p>
            <div className="capability-rows">
              <div className="hover-line reveal"><span className="icon">≈</span><div><h3>Water Purification & Filtration</h3><p>Source-specific filtration approaches for cleaner, more reliable water.</p></div><span className="arrow">→</span></div>
              <div className="hover-line reveal"><span class="icon">UV</span><div><h3>UV Disinfection & Conditioning</h3><p>Treatment technologies for disinfection, conditioning and operational needs.</p></div><span className="arrow">→</span></div>
              <div className="hover-line reveal"><span className="icon">↕</span><div><h3>Domestic to Industrial-Scale Solutions</h3><p>Systems selected around flow, application and installation environment.</p></div><span className="arrow">→</span></div>
            </div>
          </div>
        </div>
      </section>

      <section className="section white">
        <div className="container story-grid">
          <div className="story-visual clip-reveal">
            <div className="story-main">
              <img src="/images/about_story_facility.png" alt="Engineer inspecting stainless-steel water-treatment filtration equipment" />
            </div>
            <div className="story-float reveal">
              <img src="/images/about_clean_water.png" alt="Close-up detail of clean water filtration" />
            </div>
            <div className="story-tech-line" aria-hidden="true"></div>
          </div>
          <div>
            <span className="eyebrow reveal">Our Story</span>
            <h2 className="reveal">From Water Challenges to Practical Solutions</h2>
            <p className="copy reveal">Water Filter Africa focuses on the development, implementation and operation of advanced technological solutions for water quality, filtration, disinfection, conditioning, desalination and application-specific treatment.</p>
            <p className="copy reveal">The company works from the practical reality of each application: the source water, the demand profile, the operating environment and the treatment outcome required.</p>
            <div className="story-points">
              <span className="reveal">Water quality and filtration challenges</span>
              <span className="reveal">Disinfection, conditioning and desalination needs</span>
              <span className="reveal">Application-specific treatment implementation</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section pale2">
        <div className="container">
          <span className="eyebrow reveal">Mission / Vision / Approach</span>
          <h2 className="reveal">Built Around Performance, Scale and Support</h2>
          <div className="panel-stack">
            <article className="mission-panel reveal" tabIndex="0"><div className="mission-num">01</div><div className="mission-label">Mission</div><p className="mission-statement">Deliver efficient and environmentally responsible water solutions.</p></article>
            <article className="mission-panel reveal" tabIndex="0"><div className="mission-num">02</div><div className="mission-label">Vision</div><p className="mission-statement">Become a trusted African provider of advanced water-treatment systems.</p></article>
            <article className="mission-panel reveal" tabIndex="0"><div className="mission-num">03</div><div className="mission-label">Approach</div><p className="mission-statement">Match systems to water source, flow requirement and application.</p></article>
          </div>
        </div>
      </section>

      <section className="section white" id="capabilities">
        <div className="container">
          <span className="eyebrow reveal">What We Do</span>
          <h2 className="reveal">Water Treatment Across Multiple Scales</h2>
          <p className="lead reveal">Each capability is treated as an engineered response to a real water condition, not a one-size-fits-all product category.</p>
          <div className="capability-map">
            <div className="cap-list">
              <div className="tech-node reveal"><span>Industrial Water Filtration</span><small>01</small></div>
              <div className="tech-node reveal"><span>Agriculture Farming Water Filtration</span><small>02</small></div>
              <div className="tech-node reveal"><span>Commercial Water Filters</span><small>03</small></div>
              <div className="tech-node reveal"><span>Domestic Water Filtration Systems</span><small>04</small></div>
            </div>
            <div className="central-visual clip-reveal"><span className="visual-glow" aria-hidden="true"></span><img src="/images/industrial_filtration.png" alt="Industrial filtration equipment visual" /></div>
            <div className="cap-list">
              <div className="tech-node reveal"><span>UV Disinfection</span><small>05</small></div>
              <div className="tech-node reveal"><span>Water Conditioning</span><small>06</small></div>
              <div className="tech-node reveal"><span>Desalination</span><small>07</small></div>
              <div className="tech-node reveal"><span>High-Capacity Treatment Systems</span><small>08</small></div>
            </div>
          </div>
        </div>
      </section>

      <section className="section dark process-dark">
        <div className="container">
          <span className="eyebrow reveal">How We Work</span>
          <h2 className="reveal">From Water Source to the Right Treatment System</h2>
          <div className="process-track">
            <span className="process-orbit" aria-hidden="true"></span>
            <span className="process-scan" aria-hidden="true"></span>
            <div className="process-line" aria-hidden="true"><span style={{ transformOrigin: 'left', transform: 'scaleX(0)', display: 'block', height: '100%', width: '100%', background: 'currentColor' }}></span><i className="process-pulse"></i></div>
            <article className="process-step reveal" data-num="01"><h3>Understand the Water Source</h3><p>Identify the source condition and the treatment challenge it creates.</p></article>
            <article className="process-step reveal" data-num="02"><h3>Define Flow & Application Requirements</h3><p>Clarify capacity, usage profile, environment and operating needs.</p></article>
            <article className="process-step reveal" data-num="03"><h3>Select the Appropriate Treatment Technology</h3><p>Match filtration, disinfection, conditioning or desalination to the requirement.</p></article>
            <article className="process-step reveal" data-num="04"><h3>Implement a Practical, Scalable Solution</h3><p>Configure systems for dependable real-world operation and future scale.</p></article>
          </div>
        </div>
      </section>

      <section className="section pale2">
        <div className="container">
          <span className="eyebrow reveal">Applications & Industries</span>
          <h2 className="reveal">Supporting Water Needs Across Diverse Environments</h2>
          <div className="apps-layout">
            <aside className="app-detail reveal" aria-live="polite">
              <div>
                <span className="app-kicker">Selected Application</span>
                <h3 id="appTitle">{ABOUT_INDUSTRIES[displayIndustryIndex][0]}</h3>
                <p id="appDesc">{ABOUT_INDUSTRIES[displayIndustryIndex][1]}</p>
              </div>
              <p>Move through the application matrix to see how water-treatment needs shift across source, setting and operating demand.</p>
            </aside>
            <div className="industry-matrix" id="industryMatrix">
              {ABOUT_INDUSTRIES.map(([title], index) => (
                <button 
                  key={index}
                  type="button"
                  className={`industry-item reveal ${activeIndustryIndex === index ? 'active' : ''}`}
                  onMouseEnter={() => setActiveIndustryIndex(index)}
                  onFocus={() => setActiveIndustryIndex(index)}
                  onClick={() => setActiveIndustryIndex(index)}
                >
                  {ICON_SVG}
                  <span>{title}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section dark">
        <div className="container">
          <span className="eyebrow reveal">Technology / Capability Showcase</span>
          <h2 className="reveal">Technology Built for Different Water Conditions</h2>
          <div className="tech-showcase">
            <div 
              className={`dark-stage clip-reveal ${activeTechIndex !== null ? 'is-active' : ''}`}
              data-active={activeTechIndex !== null ? activeTechIndex : undefined}
            >
              <span className="visual-glow" aria-hidden="true"></span>
              <span className="stage-orbit" aria-hidden="true"></span>
              <span className="stage-scan" aria-hidden="true"></span>
              <img className="stage-product main" src="/images/Serus LLC Desalter Water Desalinationt.png" alt="Desalination equipment" />
              <img className="stage-product side" src="/images/Ultraviolet Disinfectant-Sterilizer SERUSUV-1A UV.png" alt="UV disinfection equipment" />
              <img className="stage-product small" src="/images/Magnetic Structured Water Device For 100,000 LPH .png" alt="Magnetic structured water treatment device" />
              <div className="stage-metrics" aria-hidden="true">
                <div className="stage-metric">Process<span>Filtration</span></div>
                <div className="stage-metric">Control<span>UV + RO</span></div>
                <div className="stage-metric">Scale<span>Industrial</span></div>
              </div>
            </div>
            <div className="tech-labels">
              <div className="tech-label reveal" onMouseEnter={() => setActiveTechIndex(0)} onMouseLeave={() => setActiveTechIndex(null)}>
                <strong>01</strong>
                <div>
                  <h3>UV Disinfection</h3>
                  <p>Disinfection technology for treatment applications where microbial control is required.</p>
                </div>
              </div>
              <div className="tech-label reveal" onMouseEnter={() => setActiveTechIndex(1)} onMouseLeave={() => setActiveTechIndex(null)}>
                <strong>02</strong>
                <div>
                  <h3>Filtration</h3>
                  <p>Filtration systems selected around source water, application and flow demand.</p>
                </div>
              </div>
              <div className="tech-label reveal" onMouseEnter={() => setActiveTechIndex(2)} onMouseLeave={() => setActiveTechIndex(null)}>
                <strong>03</strong>
                <div>
                  <h3>Desalination</h3>
                  <p>Treatment capability for demanding water conditions including seawater applications.</p>
                </div>
              </div>
              <div className="tech-label reveal" onMouseEnter={() => setActiveTechIndex(3)} onMouseLeave={() => setActiveTechIndex(null)}>
                <strong>04</strong>
                <div>
                  <h3>Water Conditioning</h3>
                  <p>Conditioning technologies for practical operating environments and system protection.</p>
                </div>
              </div>
              <div className="tech-label reveal" onMouseEnter={() => setActiveTechIndex(4)} onMouseLeave={() => setActiveTechIndex(null)}>
                <strong>05</strong>
                <div>
                  <h3>Magnetic / Structured Water Treatment</h3>
                  <p>High-capacity treatment devices for specific conditioning requirements.</p>
                </div>
              </div>
              <div className="tech-label reveal" onMouseEnter={() => setActiveTechIndex(5)} onMouseLeave={() => setActiveTechIndex(null)}>
                <strong>06</strong>
                <div>
                  <h3>High-Capacity Industrial Systems</h3>
                  <p>Scalable systems for industrial, commercial and infrastructure applications.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section white">
        <div className="container">
          <span className="eyebrow reveal">Why Water Filter Africa</span>
          <h2 className="reveal">Designed Around the Application, Not Just the Equipment</h2>
          <div className="why-grid">
            <article className="why-block reveal"><b>01</b><h3>Application-Based Solutions</h3><p>Treatment choices are guided by source water, flow requirement and usage context.</p></article>
            <article className="why-block reveal"><b>02</b><h3>Technology Across Multiple Treatment Methods</h3><p>Filtration, UV disinfection, conditioning, desalination and high-capacity treatment options.</p></article>
            <article className="why-block reveal"><b>03</b><h3>Scalable Systems from Domestic to Industrial</h3><p>Solutions can be matched to household, commercial, agricultural and industrial scale.</p></article>
            <article className="why-block reveal"><b>04</b><h3>Support for Diverse Operating Environments</h3><p>Practical implementation for different African water-quality challenges and applications.</p></article>
          </div>
        </div>
      </section>

      <section className="final-cta" id="contact">
        <div className="container cta-grid">
          <div>
            <span className="eyebrow reveal">Contact Water Filter Africa</span>
            <h2 className="reveal">Let's Find the Right Water Solution for Your Application.</h2>
            <p className="reveal">Tell us about your water source, flow requirement and application. Our team can help you identify the appropriate treatment approach.</p>
            <div className="actions reveal">
              <a className="btn btn-primary" href="mailto:office@waterfilterafrica.com">Send an Enquiry <span className="arrow">→</span></a>
              <a className="btn btn-secondary" href="tel:+260969113323">Call Us</a>
            </div>
          </div>
          <address className="contact-block reveal">
            <strong>JOSHI ION EXCHANGE LTD</strong><br />
            P.O Box 32014,<br />
            Lusaka, Zambia, Africa<br /><br />
            <a href="mailto:office@waterfilterafrica.com">office@waterfilterafrica.com</a><br />
            <a href="mailto:joshiionexchangeltd@gmail.com">joshiionexchangeltd@gmail.com</a><br />
            <a href="tel:+260969113323">+260969113323</a>
          </address>
        </div>
      </section>
    </main>
  );
}

