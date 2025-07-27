import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthModal from "./AuthModal";
import Notification from "./Notification";

export default function Navbar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [notification, setNotification] = useState({
    message: "",
    type: "success",
    isVisible: false
  });

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    setIsAuthenticated(!!token);
  }, []);

  function handleLogout() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setIsAuthenticated(false);
    navigate("/");
    showNotification("Logged out successfully", "success");
  }

  const showNotification = (message, type = "success") => {
    setNotification({
      message,
      type,
      isVisible: true
    });
  };

  const hideNotification = () => {
    setNotification(prev => ({ ...prev, isVisible: false }));
  };

  const handleAuthSuccess = (message) => {
    showNotification(message, "success");
    setIsAuthenticated(true);
    setIsAuthModalOpen(false);
  };

  return (
    <>
      <nav className="flex items-center justify-between px-6 py-3 bg-gray-800 text-white">
        <div className="font-bold text-lg">
          <Link to="/">Warehouse Inventory</Link>
        </div>
        <div className="space-x-4">
          {isAuthenticated ? (
            <>
              <Link to="/" className="hover:text-gray-300">Dashboard</Link>
              <Link to="/products" className="hover:text-gray-300">Products</Link>
              <Link to="/transactions" className="hover:text-gray-300">Transactions</Link>
              <Link to="/inventory" className="hover:text-gray-300">Inventory</Link>
              <button onClick={handleLogout} className="ml-2 underline hover:text-gray-300">Logout</button>
            </>
          ) : (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
            >
              Sign In
            </button>
          )}
        </div>
      </nav>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />

      {/* Notification */}
      <Notification
        message={notification.message}
        type={notification.type}
        isVisible={notification.isVisible}
        onClose={hideNotification}
      />
    </>
  );
} 