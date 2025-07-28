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
  
  return apiFetch(endpoint);
}

export async function getDashboardStats() {
  return apiFetch(config.ENDPOINTS.DASHBOARD_STATS);
} 