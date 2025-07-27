import { apiFetch } from "./api";
import { config } from "../config";

// Inventory and Reporting APIs
export async function getInventorySummary(params = {}) {
  const queryParams = new URLSearchParams();
  if (params.category) queryParams.append('category', params.category);
  if (params.low_stock_only) queryParams.append('low_stock_only', params.low_stock_only);
  if (params.sort_by) queryParams.append('sort_by', params.sort_by);
  if (params.reverse) queryParams.append('reverse', params.reverse);
  
  const queryString = queryParams.toString();
  const endpoint = queryString ? `${config.ENDPOINTS.INVENTORY_SUMMARY}?${queryString}` : config.ENDPOINTS.INVENTORY_SUMMARY;
  
  try {
    const data = await apiFetch(endpoint);
    console.log('Inventory API response:', data);
    return data;
  } catch (error) {
    console.error('Error fetching inventory:', error);
    throw error;
  }
}

export async function getDashboardStats() {
  return apiFetch(config.ENDPOINTS.DASHBOARD_STATS);
} 