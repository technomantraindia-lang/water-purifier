import React, { useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './About.css';

gsap.registerPlugin(ScrollTrigger);

const ABOUT_COUNTRIES = [
  ["South Africa", "We provide residential, commercial, agricultural and industrial water filtration solutions for different water treatment requirements in South Africa."],
  ["Zambia", "Our water filtration and treatment solutions are available for residential, commercial, agricultural and industrial applications in Zambia."],
  ["Zimbabwe", "We provide water filtration and purification solutions designed for homes, businesses, farms and industrial applications in Zimbabwe."],
  ["Namibia", "Our solutions support different water treatment requirements in Namibia, including residential, commercial, agricultural and industrial applications."],
  ["Congo", "Water Filter Africa provides filtration and water treatment solutions for different applications and water quality requirements in Congo."],
  ["Botswana", "We provide water filtration and treatment solutions for residential, commercial, agricultural, livestock and industrial applications in Botswana."],
  ["Angola", "Our water filtration and purification solutions are available for different residential, commercial, agricultural and industrial water treatment requirements in Angola."]
];

const ICON_SVG = (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" width="24" height="24">
    <path d="M4 15c4-7 12-7 16 0M7 18c3-4 7-4 10 0M12 3v18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
);

export default function About() {
  const [activeCountryIndex, setActiveCountryIndex] = useState(0);
  const [displayCountryIndex, setDisplayCountryIndex] = useState(0);

  // Tech showcase hover index
  const [activeTechIndex, setActiveTechIndex] = useState(null);

  // Sync active country detail with GSAP crossfade
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
          setDisplayCountryIndex(activeCountryIndex);
          gsap.set([appTitle, appDesc], { y: 0 });
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
      setDisplayCountryIndex(activeCountryIndex);
    }
  }, [activeCountryIndex]);

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
            <span className="eyebrow reveal">About Water Filter Africa</span>
            <h2 className="reveal">Water Filtration & Water Treatment Solutions Across Africa</h2>
            <p className="copy reveal">Water Filter Africa is a water filtration and water treatment solutions provider serving residential, commercial, agricultural, livestock and industrial customers across South Africa, Zambia, Zimbabwe, Namibia, Congo, Botswana and Angola.</p>
            <p className="copy reveal">We provide a wide range of water filtration, purification and treatment solutions designed to address different water quality requirements. Our solutions are suitable for homes, businesses, farms, commercial facilities and industrial operations where reliable water treatment is essential.</p>
            <p className="copy reveal">Our goal is to make effective and practical water filtration and water treatment solutions accessible across Africa, helping customers manage their water quality with suitable technologies for their specific applications.</p>
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
            <span className="eyebrow reveal">Solutions</span>
            <h2 className="reveal">Our Water Filtration & Treatment Solutions</h2>
            <p className="copy reveal">Water quality can vary considerably depending on the source, location and intended use. Water from municipal supplies, boreholes, groundwater, rivers and other sources may require different filtration or treatment processes.</p>
            <div className="story-points">
              <span className="reveal">Whole-house water filtration systems</span>
              <span className="reveal">Domestic and residential water filters</span>
              <span className="reveal">Commercial water filtration systems</span>
              <span className="reveal">Industrial water treatment systems</span>
              <span className="reveal">Self-cleaning water filtration systems</span>
              <span className="reveal">Automatic water filtration systems</span>
              <span className="reveal">Agricultural and irrigation water filtration</span>
              <span className="reveal">Livestock and poultry water filtration systems</span>
              <span className="reveal">UV water disinfection systems</span>
              <span className="reveal">Water softening and conditioning systems</span>
              <span className="reveal">Seawater desalination systems</span>
            </div>
            <p className="copy reveal" style={{ marginTop: '20px' }}>Each application may require a different combination of filtration and treatment technologies. The appropriate solution depends on factors such as water source, water quality, flow rate, application and treatment objectives.</p>
          </div>
        </div>
      </section>

      <section className="section pale2">
        <div className="container">
          <span className="eyebrow reveal">Our Approach</span>
          <h2 className="reveal">Our Approach to Water Treatment</h2>
          <div className="panel-stack">
            <article className="mission-panel reveal" tabIndex="0">
              <div className="mission-num">01</div>
              <div className="mission-label">Water Quality & Sources</div>
              <p className="mission-statement">We understand that there is no single water treatment solution that is suitable for every application. Water quality, water source, flow rate and intended use can all influence the type of filtration or treatment system required.</p>
            </article>
            <article className="mission-panel reveal" tabIndex="0">
              <div className="mission-num">02</div>
              <div className="mission-label">Our Approach</div>
              <p className="mission-statement">Our approach is to understand the application and water treatment requirements before recommending an appropriate solution.</p>
            </article>
            <article className="mission-panel reveal" tabIndex="0">
              <div className="mission-num">03</div>
              <div className="mission-label">Our Focus</div>
              <p className="mission-statement">We focus on providing practical, efficient and reliable water filtration and water treatment systems that can be used across a wide range of residential, commercial, agricultural and industrial applications.</p>
            </article>
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
          <span className="eyebrow reveal">Markets</span>
          <h2 className="reveal">Serving Customers Across Africa</h2>
          <div className="apps-layout">
            <aside className="app-detail reveal" aria-live="polite">
              <div>
                <span className="app-kicker">Selected Country</span>
                <h3 id="appTitle">{ABOUT_COUNTRIES[displayCountryIndex][0]}</h3>
                <p id="appDesc">{ABOUT_COUNTRIES[displayCountryIndex][1]}</p>
              </div>
              <p>Move through the country matrix to see how our water-treatment and filtration solutions serve South Africa, Zambia, Zimbabwe, Namibia, Congo, Botswana and Angola.</p>
            </aside>
            <div className="industry-matrix" id="industryMatrix">
              {ABOUT_COUNTRIES.map(([title], index) => (
                <button 
                  key={index}
                  type="button"
                  className={`industry-item reveal ${activeCountryIndex === index ? 'active' : ''}`}
                  onMouseEnter={() => setActiveCountryIndex(index)}
                  onFocus={() => setActiveCountryIndex(index)}
                  onClick={() => setActiveCountryIndex(index)}
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
          <span className="eyebrow reveal">Commitment</span>
          <h2 className="reveal">Our Commitment to Water Filtration in Africa</h2>
          <p className="lead reveal" style={{ color: 'rgba(255,255,255,0.72)', marginBottom: '40px' }}>Our commitment is to provide customers across South Africa, Zambia, Zimbabwe, Namibia, Congo, Botswana and Angola with access to suitable water filtration and water treatment technologies. From residential water filters and whole-house filtration systems to commercial, agricultural and industrial water treatment solutions, we aim to help customers find an appropriate solution for their specific water quality and application requirements.</p>
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
          <span className="eyebrow reveal">Applications</span>
          <h2 className="reveal">Water Treatment Solutions for Homes, Businesses & Industries</h2>
          <p className="lead reveal" style={{ marginBottom: '40px' }}>Our water filtration solutions are designed for a broad range of applications.</p>
          <div className="why-grid">
            <article className="why-block reveal"><b>01</b><h3>Residential Water Filtration</h3><p>We provide water filtration and purification solutions for homes, apartments and residential properties. These can include whole-house filtration, domestic water filters and other solutions designed around household water requirements.</p></article>
            <article className="why-block reveal"><b>02</b><h3>Commercial Water Treatment</h3><p>Businesses such as hotels, restaurants, hospitals, schools and commercial facilities can require dependable water filtration and treatment systems. We provide solutions designed to support different commercial water requirements and water usage levels.</p></article>
            <article className="why-block reveal"><b>03</b><h3>Agricultural & Livestock Water Filtration</h3><p>Water quality is important for agricultural and livestock operations. Our filtration solutions can be used for irrigation, farming, poultry, dairy and livestock applications where managing water quality is an important operational requirement.</p></article>
            <article className="why-block reveal"><b>04</b><h3>Industrial Water Treatment</h3><p>Industrial facilities often have specific water treatment requirements based on their processes and water sources. Water Filter Africa provides filtration and treatment solutions for industrial applications, helping businesses select technologies appropriate for their particular requirements.</p></article>
          </div>
        </div>
      </section>

      <section className="final-cta" id="contact">
        <div className="container cta-grid">
          <div>
            <span className="eyebrow reveal">Contact Us</span>
            <h2 className="reveal">Contact Water Filter Africa</h2>
            <p className="reveal">If you need a water filtration or water treatment solution for your home, business, farm or industrial facility, contact Water Filter Africa to discuss your requirements and identify a suitable solution for your application.</p>
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

