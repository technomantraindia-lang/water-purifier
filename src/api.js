import { WFA_PRODUCTS } from './data/products-data';
import { BLOG_POSTS } from './data/blog-data';

const BASE_URL = '/api';

export async function getCategories() {
  try {
    const res = await fetch(`${BASE_URL}/v1/categories`);
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
    const res = await fetch(`${BASE_URL}/v1/products`);
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
    const res = await fetch(`${BASE_URL}/v1/products/category/${categoryCode}`);
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
    const res = await fetch(`${BASE_URL}/v1/products/${slug}`);
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