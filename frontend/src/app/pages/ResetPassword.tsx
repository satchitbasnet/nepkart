import { useState, FormEvent } from "react";
import { Link, useNavigate, useLocation } from "react-router";
import { api } from "@/app/services/api";

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,100}$/;

export default function ResetPassword() {
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState((location.state as any)?.email || "");
  const [token, setToken] = useState((location.state as any)?.token || "");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const validatePassword = (p: string) => {
    if (p.length < 8) return "Password must be at least 8 characters.";
    if (!/[a-z]/.test(p)) return "Password must contain lowercase letter.";
    if (!/[A-Z]/.test(p)) return "Password must contain uppercase letter.";
    if (!/\d/.test(p)) return "Password must contain a number.";
    if (!/[@$!%*?&]/.test(p)) return "Password must contain a symbol (@$!%*?&).";
    return null;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const pwError = validatePassword(newPassword);
      if (pwError) {
        setError(pwError);
        setLoading(false);
        return;
      }
      if (newPassword !== confirmPassword) {
        setError("Passwords do not match.");
        setLoading(false);
        return;
      }
      const result = await api.auth.resetPassword(email.trim(), token.trim(), newPassword);
      if (result?.success) {
        navigate("/login", { state: { message: "Password reset! Please log in." } });
      } else {
        setError(result?.message || "Reset failed.");
      }
    } catch (err: any) {
      setError(err?.message || "Reset failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Reset Password</h1>
        <p className="text-sm text-gray-600 mb-6">
          Enter your email, the reset token you received, and your new password.
        </p>
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
            {error}
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
            />
          </div>
          <div>
            <label htmlFor="token" className="block text-sm font-semibold text-gray-700 mb-1">Reset Token</label>
            <input
              id="token"
              type="text"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              required
              disabled={loading}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              placeholder="Paste the token from your email"
            />
          </div>
          <div>
            <label htmlFor="newPassword" className="block text-sm font-semibold text-gray-700 mb-1">New Password</label>
            <input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              disabled={loading}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-1">Confirm New Password</label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={loading}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700 disabled:opacity-50"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
        <p className="mt-6 text-center">
          <Link to="/login" className="text-sm text-orange-600 hover:text-orange-700">← Back to Login</Link>
        </p>
      </div>
    </div>
  );
}
