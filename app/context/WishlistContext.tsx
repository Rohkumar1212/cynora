"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Product } from "../lib/types";
import { readJSON, writeJSON } from "../lib/storage";

const WISHLIST_KEY = "cynora_wishlist";

interface WishlistContextValue {
  products: Product[];
  count: number;
  isWishlisted: (dbId: string) => boolean;
  toggleWishlist: (product: Product) => void;
  removeFromWishlist: (dbId: string) => void;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setProducts(readJSON<Product[]>(WISHLIST_KEY, []));
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) writeJSON(WISHLIST_KEY, products);
  }, [products, loaded]);

  function isWishlisted(dbId: string) {
    return products.some((p) => p.dbId === dbId);
  }

  function toggleWishlist(product: Product) {
    setProducts((prev) =>
      prev.some((p) => p.dbId === product.dbId) ? prev.filter((p) => p.dbId !== product.dbId) : [...prev, product]
    );
  }

  function removeFromWishlist(dbId: string) {
    setProducts((prev) => prev.filter((p) => p.dbId !== dbId));
  }

  return (
    <WishlistContext.Provider value={{ products, count: products.length, isWishlisted, toggleWishlist, removeFromWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}
