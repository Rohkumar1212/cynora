"use client";

import Link from "next/link";
import ProductCard from "../components/ProductCard";
import { useWishlist } from "../context/WishlistContext";

export default function WishlistPage() {
  const { products } = useWishlist();

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb"><Link href="/">Home</Link><span>/</span>Wishlist</div>
          <h1>Your Wishlist</h1>
          <p style={{ color: "var(--ink-soft)" }}>{products.length} saved item{products.length !== 1 ? "s" : ""}</p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 40 }}>
        <div className="container">
          {products.length === 0 ? (
            <div className="empty-state">
              <div className="icon-circle">
                <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 20s-7-4.35-9.5-8.5C.6 8 2 4.5 5.5 3.6 8 3 10.3 4 12 6.3 13.7 4 16 3 18.5 3.6 22 4.5 23.4 8 21.5 11.5 19 15.65 12 20 12 20z" />
                </svg>
              </div>
              <h3>Your wishlist is empty</h3>
              <p>Tap the heart icon on any product to save it here for later.</p>
              <Link href="/products" className="btn btn-primary">Browse Products</Link>
            </div>
          ) : (
            <div className="wishlist-grid">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
