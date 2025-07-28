import { apiFetch } from "./api";
import { config } from "../config";

// Product Management APIs
export async function getProducts(params = {}) {
  const queryParams = new URLSearchParams();
  if (params.category) queryParams.append('category', params.category);
  if (params.is_active !== undefined) queryParams.append('is_active', params.is_active);
  if (params.search) queryParams.append('search', params.search);
  
  const queryString = queryParams.toString();
  const endpoint = queryString ? `${config.ENDPOINTS.PRODUCTS}?${queryString}` : config.ENDPOINTS.PRODUCTS;
  
  return apiFetch(endpoint);
}

export async function getProduct(id) {
  return apiFetch(`${config.ENDPOINTS.PRODUCTS}${id}/`);
}

export async function createProduct(productData) {
  return apiFetch(config.ENDPOINTS.PRODUCTS, {
    method: 'POST',
    body: JSON.stringify(productData),
  });
}

export async function updateProduct(id, productData) {
  return apiFetch(`${config.ENDPOINTS.PRODUCTS}${id}/`, {
    method: 'PUT',
    body: JSON.stringify(productData),
  });
}

export async function deleteProduct(id) {
  return apiFetch(`${config.ENDPOINTS.PRODUCTS}${id}/`, {
    method: 'DELETE',
  });
} 