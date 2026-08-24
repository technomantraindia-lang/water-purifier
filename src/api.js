import { WFA_PRODUCTS } from './data/products-data';
import { BLOG_POSTS } from './data/blog-data';

const BASE_URL = '/api';

export function getActiveCountryCode() {
  const host = window.location.hostname;
  const parts = host.split('.');
  
  if (parts.length >= 3) {
    const subdomain = parts[0] === 'www' ? parts[1] : parts[0];
    const knownCodes = ['angola', 'southafrica', 'zimbabwe', 'namibia', 'congo', 'botswana', 'zambia'];
    if (knownCodes.includes(subdomain.toLowerCase())) {
      return subdomain.toLowerCase();
    }
  }
  
  const local = localStorage.getItem('selected_country');
  if (local === 'africa' || !local) return '';
  return local;
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