import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { api } from "@/app/services/api";

export type UserType = "admin" | "customer" | null;

interface AuthContextType {
  userType: UserType;
  isAuthenticated: boolean;
  username: string | null;
  customerId: number | null;
  customerEmail: string | null;
  customerName: string | null;
  adminLogin: (username: string, password: string) => Promise<boolean>;
  customerLogin: (email: string, password: string) => Promise<boolean>;
  customerRegister: (data: { firstName: string; lastName: string; email: string; password: string }) => Promise<void>;
  setAuthenticated: (username: string) => void;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [userType, setUserType] = useState<UserType>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [customerId, setCustomerId] = useState<number | null>(null);
  const [customerEmail, setCustomerEmail] = useState<string | null>(null);
  const [customerName, setCustomerName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const isAuthenticated = userType !== null;

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const result = await api.auth.check();
      if (result.authenticated) {
        if (result.userType === "admin") {
          setUserType("admin");
          setUsername(result.username || null);
          setCustomerId(null);
          setCustomerEmail(null);
          setCustomerName(null);
        } else if (result.userType === "customer") {
          setUserType("customer");
          setUsername(null);
          setCustomerId(result.customerId ?? null);
          setCustomerEmail(result.customerEmail ?? null);
          setCustomerName(result.customerName ?? null);
        }
      } else {
        setUserType(null);
        setUsername(null);
        setCustomerId(null);
        setCustomerEmail(null);
        setCustomerName(null);
      }
    } catch {
      setUserType(null);
      setUsername(null);
      setCustomerId(null);
      setCustomerEmail(null);
      setCustomerName(null);
    } finally {
      setLoading(false);
    }
  };

  const adminLogin = async (username: string, password: string): Promise<boolean> => {
    const result = await api.auth.adminLogin(username, password);
    if (result?.success) {
      setUserType("admin");
      setUsername(username);
      setCustomerId(null);
      setCustomerEmail(null);
      setCustomerName(null);
      return true;
    }
    const err: any = new Error(result?.message || "Invalid credentials");
    err.status = 401;
    throw err;
  };

  const customerLogin = async (email: string, password: string): Promise<boolean> => {
    const result = await api.auth.customerLogin(email, password);
    if (result?.success) {
      setUserType("customer");
      setUsername(null);
      setCustomerId(result.customer?.id ?? null);
      setCustomerEmail(result.customer?.email ?? email);
      setCustomerName(result.customer ? `${result.customer.firstName} ${result.customer.lastName}` : null);
      return true;
    }
    const err: any = new Error(result?.message || "Invalid email or password");
    err.status = 401;
    throw err;
  };

  const customerRegister = async (data: { firstName: string; lastName: string; email: string; password: string }) => {
    const result = await api.auth.customerRegister(data);
    if (!result?.success) {
      throw new Error(result?.message || "Registration failed");
    }
  };

  const setAuthenticated = (username: string) => {
    setUserType("admin");
    setUsername(username);
    setCustomerId(null);
    setCustomerEmail(null);
    setCustomerName(null);
  };

  const logout = async () => {
    try {
      await api.auth.logout();
    } catch {
      // ignore
    } finally {
      setUserType(null);
      setUsername(null);
      setCustomerId(null);
      setCustomerEmail(null);
      setCustomerName(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        userType,
        isAuthenticated,
        username,
        customerId,
        customerEmail,
        customerName,
        adminLogin,
        customerLogin,
        customerRegister,
        setAuthenticated,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
