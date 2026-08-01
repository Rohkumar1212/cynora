"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { money } from "../../lib/storage";

export default function DashboardWishlistPage() {
  const { products, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  return (
    <>
      <h2>My Wishlist</h2>
      <p className="sub">Products you&apos;ve saved for later.</p>

      {products.length === 0 ? (
        <div className="empty-state" style={{ padding: "40px 20px" }}>
          <p>Your wishlist is empty.</p>
          <Link href="/products" className="btn btn-primary">Browse Products</Link>
        </div>
      ) : (
        products.map((p) => (
          <div className="cart-row" key={p.dbId} style={{ marginBottom: 16 }}>
            <Link href={`/products/${p.id}`} className="cr-visual" style={{ background: p.gradient }}>
              <Image src={p.image} alt={p.name} fill sizes="88px" style={{ objectFit: "cover" }} />
            </Link>
            <div>
              <Link href={`/products/${p.id}`}><p className="cr-name">{p.name}</p></Link>
              <p className="cr-meta">{p.meta}</p>
              <span className="cr-price">{money(p.price)}</span>
              <br />
              <button className="cr-remove" onClick={() => removeFromWishlist(p.dbId)}>Remove</button>
            </div>
            <button className="btn btn-primary" onClick={() => addToCart(p, 1)}>Add to Cart</button>
          </div>
        ))
      )}
    </>
  );
}
