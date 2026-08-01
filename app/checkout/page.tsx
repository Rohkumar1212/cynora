"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useOrders } from "../context/OrdersContext";
import { money } from "../lib/storage";
import { fetchSettings } from "../lib/settings";
import { payWithRazorpay } from "../lib/razorpay";

const TAX_RATE = 0.05;

export default function CheckoutPage() {
  const { user, ready, addresses, addAddress } = useAuth();
  const { lines, subtotal, clearCart, loading: cartLoading } = useCart();
  const { placeOrder } = useOrders();
  const router = useRouter();

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ fullName: "", phone: "", line1: "", line2: "", city: "", state: "", pincode: "" });
  const [placing, setPlacing] = useState(false);
  const [orderError, setOrderError] = useState("");
  const [shippingFee, setShippingFee] = useState(79);
  const [shippingThreshold, setShippingThreshold] = useState(999);
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "RAZORPAY">("RAZORPAY");

  useEffect(() => {
    fetchSettings().then((s) => {
      setShippingFee(s.shipping_charges);
      setShippingThreshold(s.free_shipping_limit);
    });
  }, []);

  useEffect(() => {
    if (!ready) return;
    if (!user) {
      router.push("/login?next=/checkout");
      return;
    }
    if (addresses.length > 0 && !selectedId) {
      setSelectedId(addresses[0].id);
    } else if (addresses.length === 0) {
      setShowForm(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, user, addresses]);

  useEffect(() => {
    if (ready && user && !cartLoading && lines.length === 0 && !placing) {
      router.push("/cart");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, user, cartLoading, lines.length]);

  if (!ready || !user || cartLoading) {
    return <section className="section"><div className="container"><p>Loading…</p></div></section>;
  }

  const shipping = subtotal >= shippingThreshold ? 0 : shippingFee;
  const tax = Math.round(subtotal * TAX_RATE);
  const total = subtotal + shipping + tax;
  const selectedAddress = addresses.find((a) => a.id === selectedId) || null;

  function handleAddAddress(e: React.FormEvent) {
    e.preventDefault();
    const newAddr = addAddress(form);
    setSelectedId(newAddr.id);
    setShowForm(false);
    setForm({ fullName: "", phone: "", line1: "", line2: "", city: "", state: "", pincode: "" });
  }

  async function handlePlaceOrder() {
    if (!selectedAddress) return;
    setPlacing(true);
    setOrderError("");

    if (paymentMethod === "RAZORPAY") {
      try {
        const payment = await payWithRazorpay(total, {
          name: user.name,
          email: user.email,
          contact: user.phone || selectedAddress.phone,
        });
        const res = await placeOrder(selectedAddress, "RAZORPAY", {
          razorpayOrderId: payment.razorpay_order_id,
          razorpayPaymentId: payment.razorpay_payment_id,
          razorpaySignature: payment.razorpay_signature,
        });
        if (!res.ok || !res.order) {
          setOrderError(res.error || "Payment succeeded but the order could not be recorded. Contact support.");
          setPlacing(false);
          return;
        }
        await clearCart();
        router.push(`/dashboard/orders/${res.order.id}?placed=1`);
      } catch (err) {
        setOrderError(err instanceof Error ? err.message : "Payment was not completed.");
        setPlacing(false);
      }
      return;
    }

    const res = await placeOrder(selectedAddress, "COD");
    if (!res.ok || !res.order) {
      setOrderError(res.error || "Could not place order. Please try again.");
      setPlacing(false);
      if (res.error?.includes("session has expired")) {
        setTimeout(() => router.push("/login?next=/checkout"), 1500);
      }
      return;
    }
    await clearCart();
    router.push(`/dashboard/orders/${res.order.id}?placed=1`);
  }

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb"><Link href="/">Home</Link><span>/</span><Link href="/cart">Cart</Link><span>/</span>Checkout</div>
          <h1>Checkout</h1>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 40 }}>
        <div className="container">
          <div className="checkout-grid">
            <div>
              {/* ADDRESS */}
              <div className="checkout-card">
                <h3><span className="step-badge">1</span>Delivery Address</h3>

                {addresses.map((a) => (
                  <label className={`address-card ${selectedId === a.id ? "selected" : ""}`} key={a.id}>
                    <input type="radio" name="address" checked={selectedId === a.id} onChange={() => setSelectedId(a.id)} />
                    <div>
                      <b>{a.fullName}</b> — {a.phone}
                      <p>{a.line1}{a.line2 ? `, ${a.line2}` : ""}, {a.city}, {a.state} - {a.pincode}</p>
                    </div>
                  </label>
                ))}

                {!showForm ? (
                  <button className="btn btn-ghost" onClick={() => setShowForm(true)} type="button" style={{ marginTop: 8 }}>
                    + Add New Address
                  </button>
                ) : (
                  <form onSubmit={handleAddAddress} style={{ marginTop: 12, borderTop: addresses.length ? "1px solid var(--line)" : "none", paddingTop: addresses.length ? 20 : 0 }}>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Full Name</label>
                        <input required value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
                      </div>
                      <div className="form-group">
                        <label>Phone Number</label>
                        <input required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Address Line 1</label>
                      <input required value={form.line1} onChange={(e) => setForm({ ...form, line1: e.target.value })} placeholder="House no., street" />
                    </div>
                    <div className="form-group">
                      <label>Address Line 2 (Optional)</label>
                      <input value={form.line2} onChange={(e) => setForm({ ...form, line2: e.target.value })} placeholder="Landmark, area" />
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>City</label>
                        <input required value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
                      </div>
                      <div className="form-group">
                        <label>State</label>
                        <input required value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} />
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Pincode</label>
                      <input required value={form.pincode} onChange={(e) => setForm({ ...form, pincode: e.target.value })} />
                    </div>
                    <div className="address-form-actions">
                      <button type="submit" className="btn btn-primary">Save Address</button>
                      {addresses.length > 0 && (
                        <button type="button" className="btn btn-ghost" onClick={() => setShowForm(false)}>Cancel</button>
                      )}
                    </div>
                  </form>
                )}
              </div>

              {/* PAYMENT */}
              <div className="checkout-card">
                <h3><span className="step-badge">2</span>Payment Method</h3>

                <label className={`pay-option pay-option-select ${paymentMethod === "RAZORPAY" ? "selected" : ""}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === "RAZORPAY"}
                    onChange={() => setPaymentMethod("RAZORPAY")}
                  />
                  <span className="pay-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 2L4 14h6l-1 8 9-12h-6z" /></svg>
                  </span>
                  <span>
                    <b>Pay Online</b>
                    <p className="field-hint" style={{ margin: "2px 0 0" }}>Cards, UPI, Netbanking &amp; wallets via Razorpay — secure &amp; instant.</p>
                  </span>
                </label>

                <label className={`pay-option pay-option-select ${paymentMethod === "COD" ? "selected" : ""}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === "COD"}
                    onChange={() => setPaymentMethod("COD")}
                  />
                  <span className="pay-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="6" width="20" height="12" rx="2" /><path d="M2 10h20" /></svg>
                  </span>
                  <span>
                    <b>Cash on Delivery</b>
                    <p className="field-hint" style={{ margin: "2px 0 0" }}>Pay in cash when your order arrives.</p>
                  </span>
                </label>
              </div>

              {/* BILL SUMMARY (ITEMIZED) */}
              <div className="checkout-card">
                <h3><span className="step-badge">3</span>Order Items</h3>
                {lines.map((l) => (
                  <div key={l.productId} className="summary-row">
                    <span>{l.product.name} × {l.qty}</span>
                    <span>{money(l.product.price * l.qty)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="summary-card">
              <h3>Bill Details</h3>
              <div className="summary-row"><span>Item Subtotal</span><span>{money(subtotal)}</span></div>
              <div className="summary-row"><span>Shipping Fee</span><span>{shipping === 0 ? "Free" : money(shipping)}</span></div>
              <div className="summary-row"><span>Tax (5%)</span><span>{money(tax)}</span></div>
              <div className="summary-row total"><span>Total Payable</span><span>{money(total)}</span></div>
              {orderError && <div className="form-error">{orderError}</div>}
              <button className="btn btn-primary btn-block" style={{ marginTop: 20 }} disabled={!selectedAddress || placing} onClick={handlePlaceOrder}>
                {placing
                  ? paymentMethod === "RAZORPAY" ? "Opening Payment…" : "Placing Order…"
                  : paymentMethod === "RAZORPAY"
                    ? `Pay ${money(total)} Online`
                    : `Place Order — ${money(total)} COD`}
              </button>
              {!selectedAddress && <p className="field-hint">Select or add a delivery address to continue.</p>}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
