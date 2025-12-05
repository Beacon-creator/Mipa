// src/context/CartContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";

export type CartItem = {
  menuItemId: string;
  title: string;
  price: number; // numeric price for sums
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

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) setItems(JSON.parse(raw));
      } catch (e) {
        console.warn("Failed to load cart", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const persist = async (nextItems: CartItem[]) => {
    setItems(nextItems);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(nextItems));
    } catch (e) {
      console.warn("Failed to save cart", e);
    }
  };

const addToCart = (item: Omit<CartItem, "quantity">, qty = 1) => {
  setItems((prev) => {
    // enforce same restaurant
    if (prev.length > 0 && prev[0].restaurantId !== item.restaurantId) {
      Alert.alert("Cart Error", "You can only add items from one restaurant at a time.");
      return prev;
    }

    const exists = prev.find((p) => p.menuItemId === item.menuItemId);
    let next: CartItem[];
    if (exists) {
      next = prev.map((p) =>
        p.menuItemId === item.menuItemId ? { ...p, quantity: p.quantity + qty } : p
      );
    } else {
      next = [...prev, { ...item, quantity: qty }];
    }
    persist(next); // async save
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
    return items.reduce((s, it) => s + it.price * it.quantity, 0);
  };

  const saveToStorage = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.warn("saveToStorage error", e);
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
