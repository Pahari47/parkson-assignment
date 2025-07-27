// Environment Configuration
export const config = {
  // API Configuration
  API_URL: import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api",
  
  // Environment
  ENV: import.meta.env.VITE_ENV || "development",
  
  // App Configuration
  APP_NAME: "Warehouse Inventory Management",
  APP_VERSION: "1.0.0",
  
  // Feature Flags
  ENABLE_DEBUG: import.meta.env.VITE_ENV === "development",
  
  // API Endpoints
  ENDPOINTS: {
    AUTH: {
      LOGIN: "/auth/login/",
      REGISTER: "/auth/register/",
      REFRESH: "/auth/refresh/",
    },
    PRODUCTS: "/products/",
    TRANSACTIONS: "/transactions/",
    STOCK_DETAILS: "/stock-details/",
    INVENTORY_SUMMARY: "/inventory-summary/",
    DASHBOARD_STATS: "/dashboard-stats/",
  }
};

// Debug logging
console.log('Config loaded:', {
  API_URL: config.API_URL,
  ENV: config.ENV,
  VITE_API_URL: import.meta.env.VITE_API_URL
});

// Helper function to get full API URL
export const getApiUrl = (endpoint = "") => {
  const fullUrl = `${config.API_URL}${endpoint}`;
  console.log('getApiUrl called with endpoint:', endpoint, 'fullUrl:', fullUrl);
  return fullUrl;
};

// Helper function to check if we're in development
export const isDevelopment = () => {
  return config.ENV === "development";
};

// Helper function to check if we're in production
export const isProduction = () => {
  return config.ENV === "production";
}; 