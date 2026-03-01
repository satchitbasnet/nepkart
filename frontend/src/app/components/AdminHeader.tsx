import { Link, useLocation, useNavigate } from "react-router";
import { useAuth } from "@/app/contexts/AuthContext";

export function AdminHeader() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, username } = useAuth();
  const isActive = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    await logout();
    navigate("/admin/login");
  };

  return (
    <header className="bg-white border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/admin/inventory" className="flex items-center">
            <img
              src="/nepkart-logo.png"
              alt="Nepkart logo"
              className="h-14 w-auto"
            />
          </Link>

          <nav className="flex items-center gap-6">
            <Link
              to="/admin/inventory"
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                isActive("/admin/inventory")
                  ? "bg-orange-600 text-white"
                  : "text-gray-700 hover:text-orange-600 hover:bg-orange-50"
              }`}
            >
              Inventory
            </Link>
            <Link
              to="/admin/orders"
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                isActive("/admin/orders")
                  ? "bg-orange-600 text-white"
                  : "text-gray-700 hover:text-orange-600 hover:bg-orange-50"
              }`}
            >
              Order Received
            </Link>
            <Link
              to="/admin/customers"
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                isActive("/admin/customers")
                  ? "bg-orange-600 text-white"
                  : "text-gray-700 hover:text-orange-600 hover:bg-orange-50"
              }`}
            >
              Customers
            </Link>
            <Link
              to="/"
              className="px-4 py-2 text-gray-600 hover:text-orange-600 transition text-sm"
            >
              View Store →
            </Link>
            {username && (
              <div className="flex items-center gap-3 pl-4 border-l border-gray-300">
                <span className="text-sm text-gray-600">Welcome, {username}</span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold text-sm"
                >
                  Logout
                </button>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
