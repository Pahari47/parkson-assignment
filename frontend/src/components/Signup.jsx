import { useState } from "react";
import { signup } from "../services/auth";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      await signup(email, password);
      setSuccess("Signup successful! Please login.");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      console.error('Signup error:', err);
      if (err.email) {
        setError(err.email[0]);
      } else if (err.password) {
        setError(err.password[0]);
      } else if (err.username) {
        setError(err.username[0]);
      } else if (err.message) {
        setError(err.message);
      } else {
        setError("Signup failed. Please check your input and try again.");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl mb-4 font-bold">Sign Up</h2>
      <input
        className="input w-full mb-2 border p-2 rounded"
        type="email"
        placeholder="Gmail"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
      />
      <input
        className="input w-full mb-2 border p-2 rounded"
        type="password"
        placeholder="Password (min 8 chars)"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
      />
      {error && <div className="text-red-500 mb-2">{error}</div>}
      {success && <div className="text-green-600 mb-2">{success}</div>}
      <button className="btn w-full bg-green-600 text-white py-2 rounded" type="submit">Sign Up</button>
    </form>
  );
} 