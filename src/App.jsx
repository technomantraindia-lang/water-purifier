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
import BlogDetail from './pages/Blog/BlogDetail';
import PrivacyPolicy from './pages/PrivacyPolicy/PrivacyPolicy';
import TermsConditions from './pages/TermsConditions/TermsConditions';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    if (window.location.hash) return undefined;

    const scrollToPageTop = () => window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    scrollToPageTop();
    const timer = window.setTimeout(scrollToPageTop, 80);

    return () => window.clearTimeout(timer);
  }, [pathname]);

  return null;
}

export default function App() {
  useEffect(() => {
    var s1 = document.createElement("script");
    s1.async = true;
    s1.src = 'https://embed.tawk.to/64de851394cf5d10a2de2db2/1h82sknsc';
    s1.charset = 'UTF-8';
    s1.setAttribute('crossorigin', '*');
    var s0 = document.getElementsByTagName("script")[0];
    s0.parentNode.insertBefore(s1, s0);

    // Hide default widget launcher bubble
    window.Tawk_API = window.Tawk_API || {};
    window.Tawk_API.onLoad = function() {
      if (window.Tawk_API.hideWidget) {
        window.Tawk_API.hideWidget();
      }
    };
  }, []);

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
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog.html" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogDetail />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/contact.html" element={<Contact />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/privacy-policy.html" element={<PrivacyPolicy />} />
        <Route path="/terms-conditions" element={<TermsConditions />} />
        <Route path="/terms-conditions.html" element={<TermsConditions />} />
        <Route path="/:slug" element={<Category />} />
      </Routes>
      <Footer />
      <div className="floating-actions" aria-label="Quick contact actions">
        <a className="floating-action whatsapp" href="https://wa.me/260969113323" target="_blank" rel="noreferrer" aria-label="Chat on WhatsApp">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12.04 2a9.86 9.86 0 0 0-8.5 14.86L2.4 22l5.28-1.1A9.94 9.94 0 1 0 12.04 2Zm0 1.9a8.03 8.03 0 1 1 0 16.06 8.1 8.1 0 0 1-3.9-1l-.34-.18-3.02.63.65-2.94-.2-.36A8.03 8.03 0 0 1 12.04 3.9Zm-3.5 4.08c-.18 0-.48.07-.73.34-.25.27-.96.94-.96 2.29s.99 2.65 1.12 2.83c.14.18 1.9 3.04 4.72 4.14 2.34.92 2.82.74 3.33.69.51-.05 1.65-.67 1.88-1.32.23-.65.23-1.21.16-1.33-.07-.11-.25-.18-.53-.32-.28-.14-1.65-.81-1.9-.9-.25-.1-.44-.14-.62.14-.18.27-.71.9-.87 1.08-.16.18-.32.2-.6.07-.28-.14-1.18-.44-2.25-1.39-.83-.74-1.39-1.65-1.55-1.93-.16-.27-.02-.42.12-.56.13-.13.28-.32.41-.48.14-.16.18-.27.28-.46.09-.18.05-.34-.02-.48-.07-.14-.62-1.49-.85-2.04-.22-.53-.45-.46-.62-.47h-.53Z"/></svg>
        </a>
        <button 
          className="floating-action chat" 
          onClick={() => {
            if (window.Tawk_API) {
              if (window.Tawk_API.showWidget) window.Tawk_API.showWidget();
              if (window.Tawk_API.maximize) window.Tawk_API.maximize();
              else if (window.Tawk_API.toggle) window.Tawk_API.toggle();
            }
          }}
          aria-label="Open support chat"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        </button>
      </div>
    </BrowserRouter>
  );
}


