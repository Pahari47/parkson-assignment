import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import LandingPage from "./components/LandingPage";
import DashboardStats from "./components/DashboardStats";
import ProductList from "./components/ProductList";
import ProductForm from "./components/ProductForm";
import TransactionList from "./components/TransactionList";
import TransactionForm from "./components/TransactionForm";
import InventorySummary from "./components/InventorySummary";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    setIsAuthenticated(!!token);
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Public Route - Landing Page */}
        <Route
          path="/"
          element={
            isAuthenticated ? <DashboardStats /> : <LandingPage />
          }
        />
        
        {/* Protected Routes */}
        {isAuthenticated && (
          <>
            <Route path="/products" element={<ProductList />} />
            <Route path="/products/new" element={<ProductForm />} />
            <Route path="/products/:id/edit" element={<ProductForm />} />
            <Route path="/transactions" element={<TransactionList />} />
            <Route path="/transactions/new" element={<TransactionForm />} />
            <Route path="/inventory" element={<InventorySummary />} />
          </>
        )}
      </Routes>
    </Router>
  );
}
