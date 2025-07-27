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
  
  try {
    const data = await apiFetch(endpoint);
    console.log('Products API response:', data);
    return data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
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

export async function getProductStockMovements(id, params = {}) {
  const queryParams = new URLSearchParams();
  if (params.start_date) queryParams.append('start_date', params.start_date);
  if (params.end_date) queryParams.append('end_date', params.end_date);
  
  const queryString = queryParams.toString();
  const endpoint = queryString 
    ? `${config.ENDPOINTS.PRODUCTS}${id}/stock_movements/?${queryString}` 
    : `${config.ENDPOINTS.PRODUCTS}${id}/stock_movements/`;
  
  return apiFetch(endpoint);
} 