import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createTransaction } from "../services/transactions";
import { getProducts } from "../services/products";

export default function TransactionForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [products, setProducts] = useState([]);
  const [transaction, setTransaction] = useState({
    transaction_type: "IN",
    transaction_date: new Date().toISOString().split('T')[0],
    reference_number: "",
    supplier_customer: "",
    notes: "",
    total_amount: 0,
    created_by: "",
    details: [
      {
        product: "",
        quantity: "",
        unit_price: "",
        batch_number: "",
        expiry_date: "",
        notes: ""
      }
    ]
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await getProducts({ is_active: true });
      setProducts(data);
    } catch (err) {
      setError("Failed to load products");
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Calculate total amount
      const total = transaction.details.reduce((sum, detail) => {
        return sum + (parseFloat(detail.quantity) * parseFloat(detail.unit_price));
      }, 0);

      const transactionData = {
        ...transaction,
        total_amount: total,
        details: transaction.details.filter(d => d.product && d.quantity && d.unit_price)
      };

      await createTransaction(transactionData);
      navigate("/transactions");
    } catch (err) {
      setError("Failed to create transaction");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setTransaction(prev => ({ ...prev, [field]: value }));
  };

  const handleDetailChange = (index, field, value) => {
    setTransaction(prev => ({
      ...prev,
      details: prev.details.map((detail, i) => 
        i === index ? { ...detail, [field]: value } : detail
      )
    }));
  };

  const addDetail = () => {
    setTransaction(prev => ({
      ...prev,
      details: [...prev.details, {
        product: "",
        quantity: "",
        unit_price: "",
        batch_number: "",
        expiry_date: "",
        notes: ""
      }]
    }));
  };

  const removeDetail = (index) => {
    if (transaction.details.length > 1) {
      setTransaction(prev => ({
        ...prev,
        details: prev.details.filter((_, i) => i !== index)
      }));
    }
  };

  const getProductPrice = (productId) => {
    const product = products.find(p => p.product_id === parseInt(productId));
    return product ? product.unit_price : 0;
  };

  if (loading) return <div className="text-center mt-8">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto mt-8 p-6">
      <h2 className="text-2xl font-bold mb-6">New Transaction</h2>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow">
        {/* Transaction Header */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Transaction Type *
            </label>
            <select
              value={transaction.transaction_type}
              onChange={(e) => handleChange("transaction_type", e.target.value)}
              className="w-full border p-2 rounded"
              required
            >
              <option value="IN">Stock In</option>
              <option value="OUT">Stock Out</option>
              <option value="ADJUST">Stock Adjustment</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Transaction Date *
            </label>
            <input
              type="date"
              value={transaction.transaction_date}
              onChange={(e) => handleChange("transaction_date", e.target.value)}
              className="w-full border p-2 rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reference Number
            </label>
            <input
              type="text"
              value={transaction.reference_number}
              onChange={(e) => handleChange("reference_number", e.target.value)}
              className="w-full border p-2 rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Supplier/Customer
            </label>
            <input
              type="text"
              value={transaction.supplier_customer}
              onChange={(e) => handleChange("supplier_customer", e.target.value)}
              className="w-full border p-2 rounded"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes
            </label>
            <textarea
              value={transaction.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
              className="w-full border p-2 rounded"
              rows="3"
            />
          </div>
        </div>

        {/* Transaction Details */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Transaction Details</h3>
            <button
              type="button"
              onClick={addDetail}
              className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
            >
              Add Item
            </button>
          </div>

          {transaction.details.map((detail, index) => (
            <div key={index} className="border p-4 rounded mb-4">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-medium">Item {index + 1}</h4>
                {transaction.details.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeDetail(index)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Remove
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product *
                  </label>
                  <select
                    value={detail.product}
                    onChange={(e) => {
                      handleDetailChange(index, "product", e.target.value);
                      handleDetailChange(index, "unit_price", getProductPrice(e.target.value));
                    }}
                    className="w-full border p-2 rounded"
                    required
                  >
                    <option value="">Select Product</option>
                    {products.map(product => (
                      <option key={product.product_id} value={product.product_id}>
                        {product.product_name} ({product.product_code})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={detail.quantity}
                    onChange={(e) => handleDetailChange(index, "quantity", e.target.value)}
                    className="w-full border p-2 rounded"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Unit Price *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={detail.unit_price}
                    onChange={(e) => handleDetailChange(index, "unit_price", e.target.value)}
                    className="w-full border p-2 rounded"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Batch Number
                  </label>
                  <input
                    type="text"
                    value={detail.batch_number}
                    onChange={(e) => handleDetailChange(index, "batch_number", e.target.value)}
                    className="w-full border p-2 rounded"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expiry Date
                  </label>
                  <input
                    type="date"
                    value={detail.expiry_date}
                    onChange={(e) => handleDetailChange(index, "expiry_date", e.target.value)}
                    className="w-full border p-2 rounded"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes
                  </label>
                  <input
                    type="text"
                    value={detail.notes}
                    onChange={(e) => handleDetailChange(index, "notes", e.target.value)}
                    className="w-full border p-2 rounded"
                  />
                </div>
              </div>

              {detail.quantity && detail.unit_price && (
                <div className="mt-2 text-sm text-gray-600">
                  Total: ${(parseFloat(detail.quantity) * parseFloat(detail.unit_price)).toFixed(2)}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Total Amount */}
        <div className="mb-6 p-4 bg-gray-50 rounded">
          <div className="text-lg font-semibold">
            Total Amount: $
            {transaction.details
              .reduce((sum, detail) => {
                return sum + (parseFloat(detail.quantity || 0) * parseFloat(detail.unit_price || 0));
              }, 0)
              .toFixed(2)}
          </div>
        </div>

        {error && (
          <div className="text-red-500 mb-4">{error}</div>
        )}

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate("/transactions")}
            className="px-4 py-2 border rounded hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Transaction"}
          </button>
        </div>
      </form>
    </div>
  );
} 