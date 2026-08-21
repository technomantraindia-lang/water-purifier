import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BLOG_POSTS } from '../../data/blog-data';
import { getBlogs } from '../../api';
import './Blog.css';

gsap.registerPlugin(ScrollTrigger);

export default function Blog() {
  const [blogs, setBlogs] = useState(BLOG_POSTS);

  useEffect(() => {
    let active = true;
    getBlogs().then(data => {
      if (active) setBlogs(data);
    });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    
    const ctx = gsap.context(() => {
      gsap.set(".blog-list-card", {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        filter: "blur(0px)"
      });

      if (!reduced) {
        gsap.fromTo(".blog-list-card",
          { autoAlpha: 0, y: 24 },
          {
            scrollTrigger: { trigger: ".blog-list-grid", start: "top 86%", once: true },
            autoAlpha: 1,
            y: 0,
            duration: 0.62,
            stagger: 0.06,
            ease: "power3.out"
          }
        );
      }
    });

    const timer = setTimeout(() => ScrollTrigger.refresh(), 250);

    return () => {
      clearTimeout(timer);
      ctx.revert();
    };
  }, [blogs.length]);

  return (
    <main className="blog-page">
      <section className="hero-banner" aria-label="Blog banner">
        <img 
          src="/images/blogs.png" 
          alt="Water Filter Africa blog banner" 
          onLoad={() => ScrollTrigger.refresh()}
        />
      </section>

      <section className="blog-section">
        <div className="container">
          <div className="blog-grid-header">
            <span className="eyebrow">Insights &amp; Case Studies</span>
            <h2>Our Blog &amp; Updates</h2>
            <p className="lead">Technical guides, water-quality insights, and field installation updates from our engineering teams.</p>
          </div>

          <div className="blog-list-grid">
            {blogs.map((blog) => (
              <Link to={`/blog/${blog.slug}`} key={blog.id} className="blog-list-card">
                <div className="blog-card-image">
                  <img src={blog.image || '/images/logo.png'} alt={blog.title} />
                </div>
                <div className="blog-card-content">
                  <span className="blog-card-date">{blog.date}</span>
                  <h3>{blog.title}</h3>
                  <p>{blog.excerpt}</p>
                  <span className="blog-card-cta">Read Article &rarr;</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}