import { getApiUrl, config } from "../config";

export const getToken = () => localStorage.getItem("access_token");
export const getRefreshToken = () => localStorage.getItem("refresh_token");

export async function apiFetch(endpoint, options = {}) {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };
  
  try {
    const res = await fetch(getApiUrl(endpoint), { ...options, headers });
    
    // If token is expired, try to refresh it
    if (res.status === 401 && token) {
      const refreshed = await refreshToken();
      if (refreshed) {
        // Retry the original request with new token
        const newToken = getToken();
        const newHeaders = {
          "Content-Type": "application/json",
          ...(newToken && { Authorization: `Bearer ${newToken}` }),
          ...options.headers,
        };
        const retryRes = await fetch(getApiUrl(endpoint), { ...options, headers: newHeaders });
        if (!retryRes.ok) {
          const error = await retryRes.json().catch(() => ({}));
          throw error;
        }
        return retryRes.json();
      }
    }
    
    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw error;
    }
    return res.json();
  } catch (error) {
    throw error;
  }
}

export async function refreshToken() {
  const refresh = getRefreshToken();
  if (!refresh) return false;
  
  try {
    const res = await fetch(getApiUrl(config.ENDPOINTS.AUTH.REFRESH), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh }),
    });
    
    if (res.ok) {
      const data = await res.json();
      localStorage.setItem("access_token", data.access);
      return true;
    }
    return false;
  } catch {
    return false;
  }
} 