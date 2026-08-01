"use client";

import Image from "next/image";
import Link from "next/link";
import { MouseEvent, useState } from "react";
import { Product } from "../lib/types";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { money } from "../lib/storage";

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const [justAdded, setJustAdded] = useState(false);
  const wishlisted = isWishlisted(product.dbId);

  function handleMove(e: MouseEvent<HTMLDivElement>) {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    card.style.setProperty("--x", `${x}%`);
    card.style.setProperty("--y", `${y}%`);
  }

  function handleAdd() {
    addToCart(product, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1400);
  }

  return (
    <div className="product-card" onMouseMove={handleMove}>
      {product.badge && <span className="badge">{product.badge}</span>}
      <button
        className={`wish-btn ${wishlisted ? "active" : ""}`}
        aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
        onClick={() => toggleWishlist(product)}
      >
        <svg width="17" height="17" viewBox="0 0 24 24" fill={wishlisted ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
          <path d="M12 20s-7-4.35-9.5-8.5C.6 8 2 4.5 5.5 3.6 8 3 10.3 4 12 6.3 13.7 4 16 3 18.5 3.6 22 4.5 23.4 8 21.5 11.5 19 15.65 12 20 12 20z" />
        </svg>
      </button>

      <Link href={`/products/${product.id}`} className="product-visual-link">
        <div className="product-visual" style={{ background: product.gradient }}>
          <Image src={product.image} alt={product.name} fill sizes="(max-width: 640px) 100vw, 320px" style={{ objectFit: "cover" }} />
        </div>
      </Link>

      <Link href={`/products/${product.id}`}>
        <h3 className="product-name">{product.name}</h3>
      </Link>
      <p className="product-meta">{product.meta}</p>
      <div className="product-rating">
        <span className="stars-sm">★★★★★</span>
        <span className="rating-count">({product.reviews})</span>
      </div>
      <div className="product-foot">
        <span className="price">
          {money(product.price)}
          {product.oldPrice && <small>{money(product.oldPrice)}</small>}
        </span>
        <button className={`add-btn ${justAdded ? "added" : ""}`} aria-label="Add to cart" onClick={handleAdd} disabled={product.stock <= 0}>
          {justAdded ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6">
              <path d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
              <path d="M12 5v14M5 12h14" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
