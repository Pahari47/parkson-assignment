import { useState, useEffect } from "react";
import { getTransactions, deleteTransaction } from "../services/transactions";
import { Link } from "react-router-dom";

export default function TransactionList() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    transaction_type: "",
    start_date: "",
    end_date: ""
  });

  useEffect(() => {
    loadTransactions();
  }, [filters]);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getTransactions(filters);
      
      console.log('TransactionList received data:', data);
      
      // Ensure data is an array
      if (Array.isArray(data)) {
        setTransactions(data);
      } else if (data && Array.isArray(data.results)) {
        // Handle paginated response
        setTransactions(data.results);
      } else if (data && typeof data === 'object') {
        // Handle case where API returns an object with data
        console.error('Unexpected data format:', data);
        setTransactions([]);
        setError("Invalid data format received from server");
      } else {
        console.error('Unexpected data format:', data);
        setTransactions([]);
        setError("Invalid data format received from server");
      }
    } catch (err) {
      console.error('Error loading transactions:', err);
      setTransactions([]);
      if (err.message) {
        setError(`Failed to load transactions: ${err.message}`);
      } else {
        setError("Failed to load transactions. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      try {
        await deleteTransaction(id);
        setTransactions(transactions.filter(t => t.transaction_id !== id));
      } catch (err) {
        setError("Failed to delete transaction");
        console.error(err);
      }
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const getTransactionTypeColor = (type) => {
    switch (type) {
      case 'IN': return 'bg-green-100 text-green-800';
      case 'OUT': return 'bg-red-100 text-red-800';
      case 'ADJUST': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) return <div className="text-center mt-8">Loading transactions...</div>;
  if (error) return (
    <div className="text-center mt-8">
      <div className="text-red-500 mb-4">{error}</div>
      <button
        onClick={loadTransactions}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Retry
      </button>
    </div>
  );
  
  // Ensure transactions is always an array
  const transactionsArray = Array.isArray(transactions) ? transactions : [];

  return (
    <div className="max-w-6xl mx-auto mt-8 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Transactions</h2>
        <Link 
          to="/transactions/new" 
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add New Transaction
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select
            value={filters.transaction_type}
            onChange={(e) => handleFilterChange("transaction_type", e.target.value)}
            className="border p-2 rounded"
          >
            <option value="">All Types</option>
            <option value="IN">Stock In</option>
            <option value="OUT">Stock Out</option>
            <option value="ADJUST">Stock Adjustment</option>
          </select>
          <input
            type="date"
            value={filters.start_date}
            onChange={(e) => handleFilterChange("start_date", e.target.value)}
            className="border p-2 rounded"
            placeholder="Start Date"
          />
          <input
            type="date"
            value={filters.end_date}
            onChange={(e) => handleFilterChange("end_date", e.target.value)}
            className="border p-2 rounded"
            placeholder="End Date"
          />
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Transaction
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Reference
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Items
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {transactionsArray.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                  <div className="flex flex-col items-center">
                    <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-lg font-medium">No transactions found</p>
                    <p className="text-sm">Try adjusting your filters or create a new transaction.</p>
                  </div>
                </td>
              </tr>
            ) : (
              transactionsArray.map((transaction) => (
              <tr key={transaction.transaction_id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {transaction.transaction_code}
                    </div>
                    <div className="text-sm text-gray-500">
                      {transaction.supplier_customer || "N/A"}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTransactionTypeColor(transaction.transaction_type)}`}>
                    {transaction.transaction_type_display}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Date(transaction.transaction_date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {transaction.reference_number || "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ${transaction.total_amount}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {transaction.details_count} items
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <Link
                      to={`/transactions/${transaction.transaction_id}`}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      View
                    </Link>
                    <Link
                      to={`/transactions/${transaction.transaction_id}/edit`}
                      className="text-green-600 hover:text-green-900"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(transaction.transaction_id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
} 