import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BLOG_POSTS } from '../../data/blog-data';
import './Blog.css';

gsap.registerPlugin(ScrollTrigger);

export default function Blog() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = gsap.context(() => {
      gsap.set(".reveal-blog, .blog-feature-card, .blog-list-card", {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        filter: "blur(0px)"
      });

      if (!reduced) {
        gsap.fromTo(".blog-page-hero .reveal-blog",
          { autoAlpha: 0, y: 22, filter: "blur(4px)" },
          {
            autoAlpha: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.68,
            stagger: 0.07,
            ease: "power3.out",
            clearProps: "opacity,visibility,transform,filter"
          }
        );

        gsap.fromTo(".blog-list-card",
          { autoAlpha: 0, y: 24 },
          {
            scrollTrigger: { trigger: ".blog-list-grid", start: "top 86%", once: true },
            autoAlpha: 1,
            y: 0,
            duration: 0.62,
            stagger: 0.06,
            ease: "power3.out",
            clearProps: "opacity,visibility,transform"
          }
        );
      }
    });

    const timer = setTimeout(() => ScrollTrigger.refresh(), 250);

    return () => {
      clearTimeout(timer);
      ctx.revert();
    };
  }, []);

  return (
    <main className="blog-page">
      <section className="blog-page-hero">
        <div className="blog-hero-grid" aria-hidden="true"></div>
        <div className="blog-hero-glow blog-hero-glow-one" aria-hidden="true"></div>
        <div className="blog-hero-glow blog-hero-glow-two" aria-hidden="true"></div>
        <div className="container">
          <nav className="blog-breadcrumb reveal-blog" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <span>Blogs</span>
          </nav>
          <span className="blog-eyebrow reveal-blog">Water Filter Africa Knowledge Hub</span>
          <h1 className="reveal-blog">Blogs</h1>
          <p className="reveal-blog">Practical water-treatment insights for homes, farms, commercial facilities and industrial operations across Africa.</p>
        </div>
      </section>

      <section className="blog-list-section">
        <div className="container">
          <div className="blog-list-header">
            <span className="blog-eyebrow">All Blogs</span>
            <h2>Explore Water Treatment Topics</h2>
          </div>
          <div className="blog-list-grid">
            {BLOG_POSTS.map((post, index) => (
              <article className="blog-list-card" key={post.title}>
                <div className="blog-list-copy">
                  <div className="blog-card-meta">
                    <span>{post.category}</span>
                  </div>
                  <h3>{post.title}</h3>
                  <p>{post.excerpt}</p>
                  <div className="blog-tags">
                    {post.points.map((point) => <span key={point}>{point}</span>)}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
