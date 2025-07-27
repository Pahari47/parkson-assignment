import { apiFetch } from "./api";
import { config } from "../config";

// Transaction Management APIs
export async function getTransactions(params = {}) {
  const queryParams = new URLSearchParams();
  if (params.transaction_type) queryParams.append('transaction_type', params.transaction_type);
  if (params.start_date) queryParams.append('start_date', params.start_date);
  if (params.end_date) queryParams.append('end_date', params.end_date);
  
  const queryString = queryParams.toString();
  const endpoint = queryString ? `${config.ENDPOINTS.TRANSACTIONS}?${queryString}` : config.ENDPOINTS.TRANSACTIONS;
  
  return apiFetch(endpoint);
}

export async function getTransaction(id) {
  return apiFetch(`${config.ENDPOINTS.TRANSACTIONS}${id}/`);
}

export async function createTransaction(transactionData) {
  return apiFetch(config.ENDPOINTS.TRANSACTIONS, {
    method: 'POST',
    body: JSON.stringify(transactionData),
  });
}

export async function updateTransaction(id, transactionData) {
  return apiFetch(`${config.ENDPOINTS.TRANSACTIONS}${id}/`, {
    method: 'PUT',
    body: JSON.stringify(transactionData),
  });
}

export async function deleteTransaction(id) {
  return apiFetch(`${config.ENDPOINTS.TRANSACTIONS}${id}/`, {
    method: 'DELETE',
  });
}

export async function getTransactionDetails(id) {
  return apiFetch(`${config.ENDPOINTS.TRANSACTIONS}${id}/details/`);
}

// Stock Detail APIs
export async function getStockDetails(params = {}) {
  const queryParams = new URLSearchParams();
  if (params.product) queryParams.append('product', params.product);
  if (params.transaction) queryParams.append('transaction', params.transaction);
  
  const queryString = queryParams.toString();
  const endpoint = queryString ? `${config.ENDPOINTS.STOCK_DETAILS}?${queryString}` : config.ENDPOINTS.STOCK_DETAILS;
  
  return apiFetch(endpoint);
}

export async function getStockDetail(id) {
  return apiFetch(`${config.ENDPOINTS.STOCK_DETAILS}${id}/`);
}

export async function createStockDetail(stockDetailData) {
  return apiFetch(config.ENDPOINTS.STOCK_DETAILS, {
    method: 'POST',
    body: JSON.stringify(stockDetailData),
  });
}

export async function updateStockDetail(id, stockDetailData) {
  return apiFetch(`${config.ENDPOINTS.STOCK_DETAILS}${id}/`, {
    method: 'PUT',
    body: JSON.stringify(stockDetailData),
  });
}

export async function deleteStockDetail(id) {
  return apiFetch(`${config.ENDPOINTS.STOCK_DETAILS}${id}/`, {
    method: 'DELETE',
  });
} 