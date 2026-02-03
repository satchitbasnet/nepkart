export type BackendProduct = {
  id: number;
  sku: string;
  name: string;
  category: string; // Food, Clothing, Decor
  price: string | number;
  stock: number;
  lowStockThreshold: number;
  weight: string | number;
  origin: string;
  description?: string | null;
  imageUrl?: string | null;
};

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

async function http<T>(path: string, init?: RequestInit): Promise<T> {
  const url = `${API_BASE}${path}`;
  console.log(`[API] ${init?.method || 'GET'} ${url}`);
  
  try {
    const res = await fetch(url, {
      credentials: "include", // Include cookies for session management
      headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
      ...init,
    });
    
    console.log(`[API] Response status: ${res.status} ${res.statusText} for ${url}`);
    
    // Handle 204 No Content (DELETE responses)
    if (res.status === 204) {
      return undefined as T;
    }
    
    // Read response body once
    const contentType = res.headers.get("content-type");
    const isJson = contentType && contentType.includes("application/json");
    
    let jsonData: any = null;
    let textData: string = "";
    
    try {
      if (isJson) {
        jsonData = await res.json();
        console.log(`[API] Response JSON:`, jsonData);
      } else {
        textData = await res.text();
        console.log(`[API] Response text:`, textData.substring(0, 200));
        // Try to parse as JSON even if content-type doesn't say so
        if (textData) {
          try {
            jsonData = JSON.parse(textData);
            console.log(`[API] Parsed JSON from text:`, jsonData);
          } catch {
            // Not JSON, keep as text
          }
        }
      }
    } catch (parseError) {
      console.error("[API] Error parsing response:", parseError);
      textData = await res.text().catch(() => "");
    }
    
    if (!res.ok) {
      // If we have JSON with a message, use it
      if (jsonData) {
        const errorMessage = jsonData.message || jsonData.error || `${res.status} ${res.statusText}`;
        console.error(`[API] Error response:`, errorMessage);
        const error = new Error(errorMessage);
        (error as any).status = res.status;
        (error as any).data = jsonData;
        throw error;
      }
      // Otherwise use text or status text
      const errorMessage = textData || `${res.status} ${res.statusText}`;
      console.error(`[API] Error:`, errorMessage);
      throw new Error(errorMessage);
    }
    
    return jsonData as T;
  } catch (error: any) {
    // Handle network errors (backend not running, CORS, etc.)
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      const networkError = new Error(
        `Failed to connect to backend at ${API_BASE}. ` +
        `Make sure the backend is running on http://localhost:8080`
      );
      console.error("[API] Network error:", networkError.message);
      throw networkError;
    }
    // Re-throw other errors
    console.error("[API] Request failed:", error);
    throw error;
  }
}

export const api = {
  products: {
    list: (params?: { category?: string; search?: string }) => {
      const qs = new URLSearchParams();
      if (params?.category) qs.set("category", params.category);
      if (params?.search) qs.set("search", params.search);
      const suffix = qs.toString() ? `?${qs.toString()}` : "";
      return http<BackendProduct[]>(`/products${suffix}`);
    },
    get: (id: string | number) => http<BackendProduct>(`/products/${id}`),
    create: (product: Omit<BackendProduct, "id">) =>
      http<BackendProduct>(`/products`, {
        method: "POST",
        body: JSON.stringify(product),
      }),
    update: (id: number, product: BackendProduct) =>
      http<BackendProduct>(`/products/${id}`, {
        method: "PUT",
        body: JSON.stringify(product),
      }),
  },
  tax: {
    rate: (zip?: string, state?: string) => {
      const qs = new URLSearchParams();
      if (zip) qs.set("zip", zip);
      if (state) qs.set("state", state);
      return http<{ rate: number | string }>(`/tax/rate?${qs.toString()}`);
    },
  },
  shipping: {
    calculate: (items: Array<{ quantity: number; weight: number }>) =>
      http<{ shippingCost: number | string }>(`/shipping/calculate`, {
        method: "POST",
        body: JSON.stringify(items),
      }),
  },
  orders: {
    list: () => http<any[]>(`/orders`),
    get: (id: string | number) => http<any>(`/orders/${id}`),
    create: (payload: {
      customer: {
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        address: string;
        city: string;
        state?: string;
        zipCode: string;
      };
      productQuantities: Record<number, number>;
    }) =>
      http<any>(`/orders`, {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    updateStatus: (id: number, status: string) =>
      http<any>(`/orders/${id}/status`, {
        method: "PUT",
        body: JSON.stringify({ status }),
      }),
    delete: (id: number) =>
      http<void>(`/orders/${id}`, {
        method: "DELETE",
      }),
  },
  auth: {
    login: async (username: string, password: string) => {
      try {
        console.log("Calling login API:", `${API_BASE}/auth/login`);
        // Special handling for login - 401 is a valid response
        const res = await fetch(`${API_BASE}/auth/login`, {
          credentials: "include",
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        });
        
        console.log("Login response status:", res.status, res.statusText);
        
        const contentType = res.headers.get("content-type");
        const isJson = contentType && contentType.includes("application/json");
        
        let jsonData: any = null;
        if (isJson) {
          jsonData = await res.json();
          console.log("Login response JSON:", jsonData);
        } else {
          const text = await res.text();
          console.log("Login response text:", text);
          try {
            jsonData = JSON.parse(text);
            console.log("Parsed JSON from text:", jsonData);
          } catch (parseError) {
            console.error("Failed to parse response as JSON:", parseError);
            // If it's not JSON and status is not ok, throw error
            if (!res.ok) {
              throw new Error(text || `Server error: ${res.status} ${res.statusText}`);
            }
            throw new Error(`Unexpected response format: ${text}`);
          }
        }
        
        // Ensure we have a valid response object
        if (!jsonData) {
          throw new Error(`Empty response from server: ${res.status} ${res.statusText}`);
        }
        
        // Log the response for debugging
        console.log("Returning login response:", {
          success: jsonData.success,
          message: jsonData.message,
          hasMessage: !!jsonData.message
        });
        
        // Return the JSON response even for 401 (unauthorized)
        // The calling code will check result.success
        return jsonData as { success: boolean; message: string; sessionId?: string };
      } catch (error: any) {
        console.error("Login API call failed:", error);
        // Handle network errors
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
          throw new Error("Cannot connect to server. Please make sure the backend is running on http://localhost:8080");
        }
        throw error;
      }
    },
    logout: () =>
      http<{ success: boolean; message: string }>(`/auth/logout`, {
        method: "POST",
      }),
    check: () => http<{ authenticated: boolean; username?: string }>(`/auth/check`),
  },
};

