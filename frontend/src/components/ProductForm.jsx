import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { createProduct, updateProduct, getProduct } from "../services/products";

export default function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [product, setProduct] = useState({
    product_code: "",
    product_name: "",
    description: "",
    category: "",
    unit: "PCS",
    unit_price: "",
    is_active: true
  });

  useEffect(() => {
    if (id && id !== "new") {
      loadProduct();
    }
  }, [id]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const data = await getProduct(id);
      setProduct(data);
    } catch (err) {
      setError("Failed to load product");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (id && id !== "new") {
        await updateProduct(id, product);
      } else {
        await createProduct(product);
      }
      navigate("/products");
    } catch (err) {
      setError(err.product_code?.[0] || err.product_name?.[0] || "Failed to save product");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setProduct(prev => ({ ...prev, [field]: value }));
  };

  if (loading && id !== "new") {
    return <div className="text-center mt-8">Loading product...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto mt-8 p-6">
      <h2 className="text-2xl font-bold mb-6">
        {id && id !== "new" ? "Edit Product" : "Add New Product"}
      </h2>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Code *
            </label>
            <input
              type="text"
              value={product.product_code}
              onChange={(e) => handleChange("product_code", e.target.value)}
              className="w-full border p-2 rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Name *
            </label>
            <input
              type="text"
              value={product.product_name}
              onChange={(e) => handleChange("product_name", e.target.value)}
              className="w-full border p-2 rounded"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={product.description}
              onChange={(e) => handleChange("description", e.target.value)}
              className="w-full border p-2 rounded"
              rows="3"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <input
              type="text"
              value={product.category}
              onChange={(e) => handleChange("category", e.target.value)}
              className="w-full border p-2 rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Unit
            </label>
            <select
              value={product.unit}
              onChange={(e) => handleChange("unit", e.target.value)}
              className="w-full border p-2 rounded"
            >
              <option value="PCS">PCS</option>
              <option value="KG">KG</option>
              <option value="L">L</option>
              <option value="M">M</option>
              <option value="BOX">BOX</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Unit Price *
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={product.unit_price}
              onChange={(e) => handleChange("unit_price", parseFloat(e.target.value) || 0)}
              className="w-full border p-2 rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={product.is_active}
              onChange={(e) => handleChange("is_active", e.target.value === "true")}
              className="w-full border p-2 rounded"
            >
              <option value={true}>Active</option>
              <option value={false}>Inactive</option>
            </select>
          </div>
        </div>

        {error && (
          <div className="text-red-500 mt-4">{error}</div>
        )}

        <div className="flex justify-end space-x-4 mt-6">
          <button
            type="button"
            onClick={() => navigate("/products")}
            className="px-4 py-2 border rounded hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Product"}
          </button>
        </div>
      </form>
    </div>
  );
} 