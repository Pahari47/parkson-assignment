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

// Helper function to get full API URL
export const getApiUrl = (endpoint = "") => {
  return `${config.API_URL}${endpoint}`;
};

// Helper function to check if we're in development
export const isDevelopment = () => {
  return config.ENV === "development";
};

// Helper function to check if we're in production
export const isProduction = () => {
  return config.ENV === "production";
}; 