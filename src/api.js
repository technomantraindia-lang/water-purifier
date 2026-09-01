import { WFA_PRODUCTS } from './data/products-data';
import { BLOG_POSTS } from './data/blog-data';

const BASE_URL = '/api';

export function getActiveCountryCode() {
  if (typeof window !== 'undefined') {
    const pathParts = window.location.pathname.split('/').filter(Boolean);
    if (pathParts[0] === 'country' && pathParts[1]) {
      return pathParts[1].toLowerCase();
    }
    
    const host = window.location.hostname;
    const parts = host.split('.');
    
    if (parts.length >= 3) {
      const subdomain = parts[0] === 'www' ? parts[1] : parts[0];
      const knownCodes = ['angola', 'southafrica', 'zimbabwe', 'namibia', 'congo', 'botswana', 'zambia', 'india'];
      if (knownCodes.includes(subdomain.toLowerCase())) {
        return subdomain.toLowerCase();
      }
    }
    
    const local = localStorage.getItem('selected_country');
    if (local === 'africa' || !local) return '';
    return local;
  }
  return '';
}

export async function getCountries() {
  try {
    const res = await fetch(`${BASE_URL}/v1/countries`);
    if (!res.ok) throw new Error('API error');
    const data = await res.json();
    return data.countries ? data.countries : data;
  } catch (error) {
    console.warn('Failed to fetch countries from backend:', error);
    return [
      { name: 'Angola', code: 'angola' },
      { name: 'South Africa', code: 'southafrica' },
      { name: 'Zimbabwe', code: 'zimbabwe' },
      { name: 'Namibia', code: 'namibia' },
      { name: 'Congo', code: 'congo' },
      { name: 'Botswana', code: 'botswana' },
      { name: 'Zambia', code: 'zambia' }
    ];
  }
}

export async function getCountryDetails(countryCode) {
  try {
    const res = await fetch(`${BASE_URL}/v1/countries/${countryCode}`);
    if (!res.ok) throw new Error('API error');
    const data = await res.json();
    return data.country ? data.country : data;
  } catch (error) {
    console.warn('Failed to fetch country details from backend:', error);
    return null;
  }
}

export async function getCategories(countryCode) {
  try {
    const country = countryCode !== undefined ? countryCode : getActiveCountryCode();
    const res = await fetch(`${BASE_URL}/v1/categories?country=${country}`);
    if (!res.ok) throw new Error('API error');
    const data = await res.json();
    return data.categories ? data.categories : data;
  } catch (error) {
    console.warn('Failed to fetch categories from backend, using local data fallback:', error);
    return WFA_PRODUCTS.categories;
  }
}

export async function getProducts() {
  try {
    const country = getActiveCountryCode();
    const res = await fetch(`${BASE_URL}/v1/products?country=${country}`);
    if (!res.ok) throw new Error('API error');
    const data = await res.json();
    return data.products ? data.products : data;
  } catch (error) {
    console.warn('Failed to fetch products from backend, using local data fallback:', error);
    return WFA_PRODUCTS.products;
  }
}

export async function getProductsByCategory(categoryCode) {
  try {
    if (!categoryCode) return [];
    const country = getActiveCountryCode();
    const res = await fetch(`${BASE_URL}/v1/products/category/${categoryCode}?country=${country}`);
    if (!res.ok) throw new Error('API error');
    const data = await res.json();
    return data.products ? data.products : data;
  } catch (error) {
    console.warn(`Failed to fetch products for category ${categoryCode}, using local data fallback:`, error);
    const code = categoryCode || '';
    return WFA_PRODUCTS.products.filter(
      p => p.category === code || p.category === code.replace('-water-filtration', '')
    );
  }
}

export async function getProductBySlug(slug) {
  try {
    const country = getActiveCountryCode();
    const res = await fetch(`${BASE_URL}/v1/products/${slug}?country=${country}`);
    if (!res.ok) throw new Error('API error');
    const data = await res.json();
    return data.product ? data.product : data;
  } catch (error) {
    console.warn(`Failed to fetch product ${slug}, using local data fallback:`, error);
    return WFA_PRODUCTS.products.find(p => p.slug === slug || p.id === slug) || null;
  }
}

export async function getBlogs() {
  try {
    const res = await fetch(`${BASE_URL}/v1/blogs`);
    if (!res.ok) throw new Error('API error');
    const data = await res.json();
    return data.blogs ? data.blogs : data;
  } catch (error) {
    console.warn('Failed to fetch blogs from backend, using local data fallback:', error);
    return BLOG_POSTS;
  }
}

export async function getBlogBySlug(slug) {
  try {
    const res = await fetch(`${BASE_URL}/v1/blogs/${slug}`);
    if (!res.ok) throw new Error('API error');
    const data = await res.json();
    return data.blog ? data.blog : data;
  } catch (error) {
    console.warn(`Failed to fetch blog ${slug}, using local data fallback:`, error);
    return BLOG_POSTS.find(b => b.slug === slug || b.id === slug) || null;
  }
}

export async function getBanners() {
  try {
    const res = await fetch(`${BASE_URL}/v1/banners`);
    if (!res.ok) throw new Error('API error');
    const data = await res.json();
    return data.banners ? data.banners : data;
  } catch (error) {
    console.warn('Failed to fetch banners from backend, using local data fallback:', error);
    return [
      { image: '/images/short banner 1.png', alt: 'Water Filter Africa banner 1' },
      { image: '/images/image.png', alt: 'Water Filter Africa banner 2' }
    ];
  }
}

export function getEmbedMapUrl(url) {
  if (!url) return '';

  // 1. Check if it's an iframe snippet
  const iframeMatch = url.match(/<iframe[^>]+src=["']([^"']+)["']/i);
  if (iframeMatch) {
    url = iframeMatch[1];
  }

  url = url.trim();

  // 2. If it's already an embed URL, return it
  if (url.includes('/maps/embed') || url.includes('output=embed')) {
    return url;
  }

  // 3. Parse coordinates first if present anywhere in the URL (@lat,lng)
  const coordMatch = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (coordMatch) {
    const lat = coordMatch[1];
    const lng = coordMatch[2];
    return `https://maps.google.com/maps?q=${lat},${lng}&output=embed`;
  }

  // 4. Parse standard place maps URL
  const placeMatch = url.match(/\/maps\/place\/([^/@?#]+)/i);
  if (placeMatch) {
    const query = decodeURIComponent(placeMatch[1].replace(/\+/g, ' '));
    return `https://maps.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
  }

  // 5. Parse standard search maps URL
  const searchMatch = url.match(/\/maps\/search\/([^/@?#]+)/i);
  if (searchMatch) {
    const query = decodeURIComponent(searchMatch[1].replace(/\+/g, ' '));
    return `https://maps.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
  }

  // 6. Plain text address (not starting with http)
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return `https://maps.google.com/maps?q=${encodeURIComponent(url)}&output=embed`;
  }

  // 7. Fallback if it's a google map domain
  if (url.includes('google.') && url.includes('/maps')) {
    if (url.includes('?')) {
      return url.includes('output=embed') ? url : `${url}&output=embed`;
    } else {
      return `${url}?output=embed`;
    }
  }

  return `https://maps.google.com/maps?q=${encodeURIComponent(url)}&output=embed`;
}