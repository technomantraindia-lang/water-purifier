import React, { useEffect, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BLOG_POSTS } from '../../data/blog-data';
import { getBlogBySlug, getBlogs } from '../../api';
import './BlogDetail.css';

gsap.registerPlugin(ScrollTrigger);

export default function BlogDetail() {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [allBlogs, setAllBlogs] = useState(BLOG_POSTS);
  const [loading, setLoading] = useState(true);

  // Find recent posts (excluding current post, max 5)
  const recentPosts = useMemo(() => {
    if (!blog) return allBlogs.slice(0, 5);
    return allBlogs.filter(b => b.id !== blog.id).slice(0, 5);
  }, [blog, allBlogs]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    Promise.all([
      getBlogBySlug(slug),
      getBlogs()
    ]).then(([currentBlog, list]) => {
      if (active) {
        setBlog(currentBlog);
        setAllBlogs(list);
        setLoading(false);
      }
    });
    return () => { active = false; };
  }, [slug]);

  useEffect(() => {
    if (!blog) return;
    document.title = `${blog.title} | Water Filter Africa`;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!reduced) {
      gsap.fromTo(".blog-detail-grid", 
        { autoAlpha: 0, y: 24 },
        { autoAlpha: 1, y: 0, duration: 0.7, ease: "power3.out" }
      );
    }
    
    window.scrollTo(0, 0);
  }, [blog]);

  if (loading) {
    return (
      <main className="blog-detail-page flex items-center justify-center min-h-screen">
        <div className="text-xl font-bold text-gray-500 animate-pulse">Loading blog details...</div>
      </main>
    );
  }

  if (!blog) {
    return (
      <main className="blog-detail-page">
        <section className="blog-section">
          <div className="container">
            <h2>Blog post not found</h2>
            <p><Link to="/blog">&larr; Back to Blogs</Link></p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="blog-detail-page">


      {/* Content Grid */}
      <section className="blog-detail-section">
        <div className="container blog-detail-grid">
          
          {/* Main Article Column */}
          <article className="blog-main-content">
            <nav className="breadcrumb" aria-label="Breadcrumb">
              <Link to="/">Home</Link>
              <span>/</span>
              <Link to="/blog">Blog</Link>
              <span>/</span>
              <span className="crumb-active">{blog.title}</span>
            </nav>

            <span className="blog-detail-category">{blog.category}</span>
            <h1 className="blog-detail-title">{blog.title}</h1>
            <div className="blog-detail-date">Published: {blog.date}</div>

            <div className="blog-detail-featured-image">
              <img src={blog.image || '/images/logo.png'} alt={blog.title} />
            </div>

            <div 
              className="blog-detail-body"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />
          </article>

          {/* Sidebar Column */}
          <aside className="blog-sidebar">
            <div className="sidebar-widget">
              <h3>Recent Post</h3>
              <div className="recent-posts-list">
                {recentPosts.map((post) => (
                  <div key={post.id} className="recent-post-item">
                    <div className="recent-post-thumb">
                      <img src={post.image || '/images/logo.png'} alt="" />
                    </div>
                    <div className="recent-post-info">
                      <Link to={`/blog/${post.slug}`} className="recent-post-title-link">
                        {post.title}
                      </Link>
                      <span className="recent-post-date">{post.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>

        </div>
      </section>
    </main>
  );
}
