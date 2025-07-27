import { useState, useEffect } from "react";
import { getInventorySummary } from "../services/inventory";
import { Link } from "react-router-dom";

export default function InventorySummary() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    category: "",
    low_stock_only: false,
    sort_by: "product_name",
    reverse: false
  });

  useEffect(() => {
    loadInventory();
  }, [filters]);

  const loadInventory = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getInventorySummary(filters);
      
      console.log('InventorySummary received data:', data);
      
      // Ensure data is an array
      if (Array.isArray(data)) {
        setInventory(data);
      } else if (data && Array.isArray(data.results)) {
        // Handle paginated response
        setInventory(data.results);
      } else if (data && typeof data === 'object') {
        // Handle case where API returns an object with data
        console.error('Unexpected data format:', data);
        setInventory([]);
        setError("Invalid data format received from server");
      } else {
        console.error('Unexpected data format:', data);
        setInventory([]);
        setError("Invalid data format received from server");
      }
    } catch (err) {
      console.error('Error loading inventory:', err);
      setInventory([]);
      if (err.message) {
        setError(`Failed to load inventory: ${err.message}`);
      } else {
        setError("Failed to load inventory. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const getStockStatusColor = (stock, isLowStock) => {
    if (isLowStock) return 'bg-red-100 text-red-800';
    if (stock > 50) return 'bg-green-100 text-green-800';
    return 'bg-yellow-100 text-yellow-800';
  };

  if (loading) return <div className="text-center mt-8">Loading inventory...</div>;
  if (error) return (
    <div className="text-center mt-8">
      <div className="text-red-500 mb-4">{error}</div>
      <button
        onClick={loadInventory}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Retry
      </button>
    </div>
  );
  
  // Ensure inventory is always an array
  const inventoryArray = Array.isArray(inventory) ? inventory : [];

  return (
    <div className="max-w-6xl mx-auto mt-8 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Inventory Summary</h2>
        <Link 
          to="/transactions/new" 
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          New Transaction
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Filter by category..."
            value={filters.category}
            onChange={(e) => handleFilterChange("category", e.target.value)}
            className="border p-2 rounded"
          />
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={filters.low_stock_only}
              onChange={(e) => handleFilterChange("low_stock_only", e.target.checked)}
              className="mr-2"
            />
            Low Stock Only
          </label>
          <select
            value={filters.sort_by}
            onChange={(e) => handleFilterChange("sort_by", e.target.value)}
            className="border p-2 rounded"
          >
            <option value="product_name">Sort by Name</option>
            <option value="current_stock">Sort by Stock</option>
            <option value="total_value">Sort by Value</option>
          </select>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={filters.reverse}
              onChange={(e) => handleFilterChange("reverse", e.target.checked)}
              className="mr-2"
            />
            Reverse Sort
          </label>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Current Stock
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Unit Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Value
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Movement
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {inventoryArray.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                  <div className="flex flex-col items-center">
                    <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <p className="text-lg font-medium">No inventory items found</p>
                    <p className="text-sm">Try adjusting your filters or add some products.</p>
                  </div>
                </td>
              </tr>
            ) : (
              inventoryArray.map((item) => (
              <tr key={item.product_id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {item.product_name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {item.product_code}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {item.category || "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStockStatusColor(item.current_stock, item.is_low_stock)}`}>
                    {item.current_stock} {item.unit}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ${item.unit_price}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ${item.total_value}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {item.last_movement_date 
                    ? new Date(item.last_movement_date).toLocaleDateString()
                    : "N/A"
                  }
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <Link
                      to={`/products/${item.product_id}`}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      View
                    </Link>
                    <Link
                      to={`/products/${item.product_id}/stock-movements`}
                      className="text-green-600 hover:text-green-900"
                    >
                      Movements
                    </Link>
                  </div>
                </td>
              </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {inventory.length === 0 && (
        <div className="text-center mt-8 text-gray-500">
          No inventory items found matching your filters.
        </div>
      )}
    </div>
  );
} 