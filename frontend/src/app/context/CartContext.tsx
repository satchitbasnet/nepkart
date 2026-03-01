import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { Product } from "@/app/data/products";
import { useAuth } from "@/app/contexts/AuthContext";
import { api } from "@/app/services/api";

export interface CartItem extends Product {
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

function toProduct(item: { product: any }): Product {
  const p = item.product;
  return {
    id: p.id,
    sku: p.sku || "",
    name: p.name,
    description: p.description || "",
    price: Number(p.price),
    category: (p.category || "Food") as "Food" | "Clothing" | "Decor",
    image: p.imageUrl || "",
    origin: p.origin || "",
    weight: Number(p.weight || 0),
    stock: p.stock ?? 0,
    lowStockThreshold: p.lowStockThreshold ?? 0,
    inStock: (p.stock ?? 0) > 0,
  };
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { customerId } = useAuth();
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });
  const initialLoadDone = useRef(false);
  const prevCustomerId = useRef<number | null>(null);

  useEffect(() => {
    if (!customerId) {
      initialLoadDone.current = false;
      if (prevCustomerId.current != null) {
        setCart([]);
        localStorage.removeItem("cart");
      }
      prevCustomerId.current = null;
      return;
    }
    prevCustomerId.current = customerId;
    (async () => {
      try {
        const serverRes = await api.cart.get();
        const serverItems: CartItem[] = (serverRes.items || []).map((it: any) => ({
          ...toProduct(it),
          quantity: it.quantity,
        }));
        const merged = new Map<number, { item: CartItem; qty: number }>();
        serverItems.forEach((it) => {
          merged.set(it.id, { item: it, qty: it.quantity });
        });
        cart.forEach((it) => {
          const existing = merged.get(it.id);
          const stock = it.stock ?? 999;
          const newQty = Math.min(stock, (existing?.qty ?? 0) + it.quantity);
          merged.set(it.id, { item: { ...it }, qty: newQty });
        });
        const quantities: Record<number, number> = {};
        merged.forEach((v, id) => {
          quantities[id] = v.qty;
        });
        const res = await api.cart.sync(quantities);
        const items: CartItem[] = (res.items || []).map((it: any) => ({
          ...toProduct(it),
          quantity: it.quantity,
        }));
        setCart(items);
        initialLoadDone.current = true;
      } catch {
        initialLoadDone.current = true;
      }
    })();
  }, [customerId]);

  useEffect(() => {
    if (!customerId) {
      localStorage.setItem("cart", JSON.stringify(cart));
      return;
    }
    if (!initialLoadDone.current) return;
    const quantities: Record<number, number> = {};
    cart.forEach((it) => {
      quantities[it.id] = it.quantity;
    });
    api.cart.sync(quantities).catch(() => {});
  }, [cart, customerId]);

  useEffect(() => {
    if (!customerId) {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart, customerId]);

  const addToCart = (product: Product) => {
    setCart((prev) => {
      if (!product.inStock || product.stock <= 0) return prev;
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: Math.min(item.quantity + 1, item.stock),
              }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: number) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.id === productId
          ? { ...item, quantity: Math.min(quantity, item.stock) }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}
