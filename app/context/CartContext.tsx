"use client";

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import { CartLine, Product, mapApiCartItem } from "../lib/types";
import { readJSON, writeJSON } from "../lib/storage";
import { apiGetCart, apiRemoveCartItem, apiUpsertCartItem, ApiError } from "../lib/api";
import { useAuth } from "./AuthContext";

const CART_KEY = "cynora_guest_cart";

interface CartContextValue {
  lines: CartLine[];
  count: number;
  subtotal: number;
  loading: boolean;
  addToCart: (product: Product, qty?: number) => Promise<void>;
  removeFromCart: (productDbId: string) => Promise<void>;
  setQty: (productDbId: string, qty: number) => Promise<void>;
  clearCart: () => Promise<void>;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const { user, ready } = useAuth();
  const [lines, setLines] = useState<CartLine[]>([]);
  const [loading, setLoading] = useState(true);

  const loadServerCart = useCallback(async () => {
    setLoading(true);
    try {
      const items = await apiGetCart();
      setLines(items.map(mapApiCartItem));
    } catch {
      setLines([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!ready) return;
    if (user) {
      // If items were added before logging in, merge them into the
      // account's server-side cart instead of silently discarding them
      // (this was causing "my product disappeared / cart looked wrong"
      // after logging in).
      const guestCart = readJSON<CartLine[]>(CART_KEY, []);
      if (guestCart.length > 0) {
        (async () => {
          try {
            const serverItems = await apiGetCart();
            for (const line of guestCart) {
              const existing = serverItems.find((i) => i.productId === line.productId);
              const nextQty = (existing?.quantity || 0) + line.qty;
              await apiUpsertCartItem(line.productId, nextQty);
            }
          } catch {
            /* best effort merge — fall through to loading whatever the server has */
          } finally {
            writeJSON(CART_KEY, []);
            loadServerCart();
          }
        })();
      } else {
        loadServerCart();
      }
    } else {
      setLines(readJSON<CartLine[]>(CART_KEY, []));
      setLoading(false);
    }
  }, [ready, user, loadServerCart]);

  function persistGuestCart(next: CartLine[]) {
    setLines(next);
    writeJSON(CART_KEY, next);
  }

  async function addToCart(product: Product, qty = 1) {
    if (user) {
      const existing = lines.find((l) => l.productId === product.dbId);
      const nextQty = (existing?.qty || 0) + qty;
      try {
        await apiUpsertCartItem(product.dbId, nextQty);
        await loadServerCart();
      } catch (err) {
        if (err instanceof ApiError) console.error(err.message);
      }
      return;
    }
    const existing = lines.find((l) => l.productId === product.dbId);
    if (existing) {
      persistGuestCart(lines.map((l) => (l.productId === product.dbId ? { ...l, qty: l.qty + qty } : l)));
    } else {
      persistGuestCart([...lines, { productId: product.dbId, qty, product }]);
    }
  }

  async function removeFromCart(productDbId: string) {
    if (user) {
      try {
        await apiRemoveCartItem(productDbId);
        await loadServerCart();
      } catch (err) {
        if (err instanceof ApiError) console.error(err.message);
      }
      return;
    }
    persistGuestCart(lines.filter((l) => l.productId !== productDbId));
  }

  async function setQty(productDbId: string, qty: number) {
    if (qty <= 0) return removeFromCart(productDbId);
    if (user) {
      try {
        await apiUpsertCartItem(productDbId, qty);
        await loadServerCart();
      } catch (err) {
        if (err instanceof ApiError) console.error(err.message);
      }
      return;
    }
    persistGuestCart(lines.map((l) => (l.productId === productDbId ? { ...l, qty } : l)));
  }

  async function clearCart() {
    if (user) {
      try {
        await apiRemoveCartItem();
      } catch (err) {
        if (err instanceof ApiError) console.error(err.message);
      }
      setLines([]);
      return;
    }
    persistGuestCart([]);
  }

  const count = lines.reduce((sum, l) => sum + l.qty, 0);
  const subtotal = lines.reduce((sum, l) => sum + l.qty * l.product.price, 0);

  return (
    <CartContext.Provider value={{ lines, count, subtotal, loading, addToCart, removeFromCart, setQty, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
