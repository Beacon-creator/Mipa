// src/shared/ui/CartContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type CartItem = {
  menuItemId: string;
  title: string;
  price: number;
  img?: string;
  quantity: number;
  notes?: string;
  restaurantId?: string;
};

type CartState = {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity">, qty?: number) => void;
  removeFromCart: (menuItemId: string) => void;
  updateQty: (menuItemId: string, qty: number) => void;
  clearCart: () => void;
  totalAmount: () => number;
  saveToStorage: () => Promise<void>;
  loading: boolean;
};

const CartCtx = createContext<CartState | undefined>(undefined);

const STORAGE_KEY = "cart_v1";

const parsePrice = (price: number | string): number => {
  if (typeof price === "number") return price;
  const parsed = parseFloat(price);
  return isNaN(parsed) ? 0 : parsed;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Load from storage once on mount
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as CartItem[];
          setItems(parsed);
        }
      } catch{
        alert("Failed to load cart from storage");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // persist helper (defined before use)
  const persist = async (nextItems: CartItem[]) => {
    // update local state once
    setItems(nextItems);
    // persist to AsyncStorage (fire-and-forget-ish but we await to log errors)
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(nextItems));
    } catch {
        alert("Failed to save cart to storage");
    }
  };

const addToCart = (item: Omit<CartItem, "quantity">, qty = 1) => {
  const safePrice = parsePrice(item.price);

  setItems((prev) => {
    const exists = prev.find((p) => p.menuItemId === item.menuItemId);
    let next: CartItem[];

    if (exists) {
      next = prev.map((p) =>
        p.menuItemId === item.menuItemId
          ? { ...p, quantity: p.quantity + qty }
          : p
      );
    } else {
      next = [...prev, { ...item, price: safePrice, quantity: qty }];
    }

    return next;
  });
};


  const removeFromCart = (menuItemId: string) => {
    setItems((prev) => {
      const next = prev.filter((p) => p.menuItemId !== menuItemId);
      persist(next);
      return next;
    });
  };

  const updateQty = (menuItemId: string, qty: number) => {
    if (qty <= 0) return removeFromCart(menuItemId);
    setItems((prev) => {
      const next = prev.map((p) => (p.menuItemId === menuItemId ? { ...p, quantity: qty } : p));
      persist(next);
      return next;
    });
  };

  const clearCart = () => {
    persist([]);
  };

const totalAmount = () => {
  return items.reduce((s, it) => s + parsePrice(it.price) * it.quantity, 0);
};

  const saveToStorage = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      alert("Failed to save cart to storage");
    }
  };

  return (
    <CartCtx.Provider
      value={{ items, addToCart, removeFromCart, updateQty, clearCart, totalAmount, saveToStorage, loading }}
    >
      {children}
    </CartCtx.Provider>
  );
};

export function useCart() {
  const ctx = useContext(CartCtx);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
