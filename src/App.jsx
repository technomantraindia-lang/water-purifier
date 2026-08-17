import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home/Home';
import About from './pages/About/About';
import Product from './pages/Product/Product';
import ProductDetail from './pages/ProductDetail/ProductDetail';
import Category from './pages/Category/Category';
import Contact from './pages/Contact/Contact';
import Blog from './pages/Blog/Blog';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll to top on route change unless hash is present
    if (!window.location.hash) {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Header />
      <Routes>
        {/* Forward-compatible routes */}
        <Route path="/" element={<Home />} />
        <Route path="/index.html" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/about.html" element={<About />} />
        <Route path="/product" element={<Product />} />
        <Route path="/product.html" element={<Product />} />
        <Route path="/product/:slug" element={<ProductDetail />} />
        <Route path="/category" element={<Category />} />
        <Route path="/category.html" element={<Category />} />
        <Route path="/category/:slug" element={<Category />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog.html" element={<Blog />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/contact.html" element={<Contact />} />
      </Routes>
      <Footer />
      <div className="floating-actions" aria-label="Quick contact actions">
        <a className="floating-action whatsapp" href="https://wa.me/260969113323" target="_blank" rel="noreferrer" aria-label="Chat on WhatsApp">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12.04 2a9.86 9.86 0 0 0-8.5 14.86L2.4 22l5.28-1.1A9.94 9.94 0 1 0 12.04 2Zm0 1.9a8.03 8.03 0 1 1 0 16.06 8.1 8.1 0 0 1-3.9-1l-.34-.18-3.02.63.65-2.94-.2-.36A8.03 8.03 0 0 1 12.04 3.9Zm-3.5 4.08c-.18 0-.48.07-.73.34-.25.27-.96.94-.96 2.29s.99 2.65 1.12 2.83c.14.18 1.9 3.04 4.72 4.14 2.34.92 2.82.74 3.33.69.51-.05 1.65-.67 1.88-1.32.23-.65.23-1.21.16-1.33-.07-.11-.25-.18-.53-.32-.28-.14-1.65-.81-1.9-.9-.25-.1-.44-.14-.62.14-.18.27-.71.9-.87 1.08-.16.18-.32.2-.6.07-.28-.14-1.18-.44-2.25-1.39-.83-.74-1.39-1.65-1.55-1.93-.16-.27-.02-.42.12-.56.13-.13.28-.32.41-.48.14-.16.18-.27.28-.46.09-.18.05-.34-.02-.48-.07-.14-.62-1.49-.85-2.04-.22-.53-.45-.46-.62-.47h-.53Z"/></svg>
        </a>
        <a className="floating-action call" href="tel:+260969113323" aria-label="Call Water Filter Africa">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.35 1.9.66 2.81a2 2 0 0 1-.45 2.11L8.05 9.91a16 16 0 0 0 6.04 6.04l1.27-1.27a2 2 0 0 1 2.11-.45c.91.31 1.85.53 2.81.66A2 2 0 0 1 22 16.92Z"/></svg>
        </a>
      </div>
    </BrowserRouter>
  );
}
