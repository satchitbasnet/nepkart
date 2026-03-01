import { useEffect, useState } from "react";
import { api } from "@/app/services/api";

type CustomerRow = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  isActive: boolean;
  createdAt: string;
};

export default function Customers() {
  const [customers, setCustomers] = useState<CustomerRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      const list = await api.customers.list();
      setCustomers(list);
      setError(null);
    } catch (e: any) {
      setError(e?.message || "Failed to load customers");
    } finally {
      setLoading(false);
    }
  };

  const toggleActive = async (id: number, current: boolean) => {
    try {
      await api.customers.setActive(id, !current);
      setCustomers((prev) =>
        prev.map((c) => (c.id === id ? { ...c, isActive: !current } : c))
      );
    } catch (e: any) {
      setError(e?.message || "Failed to update");
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse text-gray-600">Loading customers...</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Customers</h1>
      <p className="text-sm text-gray-600 mb-6">
        Registered customer accounts. Passwords are never displayed for privacy.
      </p>
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}
      <div className="bg-white border border-gray-200 rounded-lg overflow-x-auto">
        <table className="min-w-[600px] w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr className="text-left">
              <th className="p-3 font-semibold text-gray-700">Name</th>
              <th className="p-3 font-semibold text-gray-700">Email</th>
              <th className="p-3 font-semibold text-gray-700">Status</th>
              <th className="p-3 font-semibold text-gray-700">Joined</th>
              <th className="p-3 font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-500">
                  No registered customers yet.
                </td>
              </tr>
            ) : (
              customers.map((c) => (
                <tr key={c.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="p-3">
                    {c.firstName} {c.lastName}
                  </td>
                  <td className="p-3">{c.email}</td>
                  <td className="p-3">
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                        c.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}
                    >
                      {c.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="p-3 text-gray-600">
                    {new Date(c.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => toggleActive(c.id, c.isActive)}
                      className={`px-3 py-1 rounded text-sm font-semibold ${
                        c.isActive
                          ? "bg-red-100 text-red-700 hover:bg-red-200"
                          : "bg-green-100 text-green-700 hover:bg-green-200"
                      }`}
                    >
                      {c.isActive ? "Deactivate" : "Activate"}
                    </button>
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
