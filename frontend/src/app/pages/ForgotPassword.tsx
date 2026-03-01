import { useState, FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import { api } from "@/app/services/api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);
    try {
      const result = await api.auth.forgotPassword(email.trim());
      if (result?.success) {
        setSuccess(true);
        if (result.token) {
          navigate("/reset-password", { state: { email: email.trim(), token: result.token } });
        } else {
          setError("Check your email for the reset link.");
        }
      } else {
        setError(result?.message || "Could not process request.");
      }
    } catch (err: any) {
      setError(err?.message || "Request failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Forgot Password</h1>
        <p className="text-sm text-gray-600 mb-6">
          Enter your email and we&apos;ll send you a reset token. Use it on the next page to set a new password.
        </p>
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}
        {success && !token && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 text-sm">
            Check your email for the reset link.
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              placeholder="you@example.com"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700 disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send Reset Token"}
          </button>
        </form>
        <p className="mt-6 text-center">
          <Link to="/login" className="text-sm text-orange-600 hover:text-orange-700">← Back to Login</Link>
        </p>
      </div>
    </div>
  );
}
