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

export async function createTransaction(transactionData) {
  return apiFetch(config.ENDPOINTS.TRANSACTIONS, {
    method: 'POST',
    body: JSON.stringify(transactionData),
  });
}

export async function deleteTransaction(id) {
  return apiFetch(`${config.ENDPOINTS.TRANSACTIONS}${id}/`, {
    method: 'DELETE',
  });
} 