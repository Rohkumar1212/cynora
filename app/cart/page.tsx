"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { money } from "../lib/storage";
import { fetchSettings } from "../lib/settings";

const TAX_RATE = 0.05;

export default function CartPage() {
  const { lines, subtotal, setQty, removeFromCart, count, loading } = useCart();
  const [shippingFee, setShippingFee] = useState(79);
  const [shippingThreshold, setShippingThreshold] = useState(999);

  useEffect(() => {
    fetchSettings().then((s) => {
      setShippingFee(s.shipping_charges);
      setShippingThreshold(s.free_shipping_limit);
    });
  }, []);

  if (loading) {
    return (
      <section className="section">
        <div className="container"><p>Loading your cart…</p></div>
      </section>
    );
  }

  if (lines.length === 0) {
    return (
      <section className="section">
        <div className="container">
          <div className="empty-state">
            <div className="icon-circle">
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6" />
              </svg>
            </div>
            <h3>Your cart is empty</h3>
            <p>Looks like you haven&apos;t added anything yet. Start shopping to fill it up!</p>
            <Link href="/products" className="btn btn-primary">Browse Products</Link>
          </div>
        </div>
      </section>
    );
  }

  const shipping = subtotal >= shippingThreshold ? 0 : shippingFee;
  const tax = Math.round(subtotal * TAX_RATE);
  const total = subtotal + shipping + tax;

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb"><Link href="/">Home</Link><span>/</span>Cart</div>
          <h1>Your Shopping Cart</h1>
          <p style={{ color: "var(--ink-soft)" }}>{count} item{count !== 1 ? "s" : ""} in your cart</p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 40 }}>
        <div className="container">
          <div className="cart-layout">
            <div className="cart-list">
              {lines.map((line) => (
                <div className="cart-row" key={line.productId}>
                  <Link href={`/products/${line.product.id}`} className="cr-visual" style={{ background: line.product.gradient }}>
                    <Image src={line.product.image} alt={line.product.name} fill sizes="88px" style={{ objectFit: "cover" }} />
                  </Link>
                  <div>
                    <Link href={`/products/${line.product.id}`}><p className="cr-name">{line.product.name}</p></Link>
                    <p className="cr-meta">{line.product.meta}</p>
                    <span className="cr-price">{money(line.product.price)}</span>
                    <br />
                    <button className="cr-remove" onClick={() => removeFromCart(line.productId)}>Remove</button>
                  </div>
                  <div className="qty-stepper">
                    <button onClick={() => setQty(line.productId, line.qty - 1)} aria-label="Decrease quantity">−</button>
                    <span>{line.qty}</span>
                    <button onClick={() => setQty(line.productId, Math.min(line.product.stock || line.qty + 1, line.qty + 1))} aria-label="Increase quantity">+</button>
                  </div>
                  <span className="cr-line-total">{money(line.product.price * line.qty)}</span>
                </div>
              ))}
              <div style={{ marginTop: 8 }}>
                <Link href="/products" className="btn btn-ghost">← Continue Shopping</Link>
              </div>
            </div>

            <div className="summary-card">
              <h3>Order Summary</h3>
              <div className="summary-row"><span>Subtotal</span><span>{money(subtotal)}</span></div>
              <div className="summary-row"><span>Shipping</span><span>{shipping === 0 ? "Free" : money(shipping)}</span></div>
              <div className="summary-row"><span>Tax (5%)</span><span>{money(tax)}</span></div>
              {shipping > 0 && (
                <p className="field-hint" style={{ marginBottom: 14 }}>
                  Add {money(shippingThreshold - subtotal)} more for free shipping.
                </p>
              )}
              <div className="summary-row total"><span>Total</span><span>{money(total)}</span></div>
              <Link href="/checkout" className="btn btn-primary btn-block" style={{ marginTop: 20 }}>
                Proceed to Checkout
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
