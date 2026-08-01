"use client";

import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useOrders } from "../../../context/OrdersContext";
import { money } from "../../../lib/storage";

function InvoiceContent() {
  const params = useParams<{ id: string }>();
  const search = useSearchParams();
  const justPlaced = search.get("placed") === "1";
  const { getOrder, loading } = useOrders();
  const order = getOrder(params.id);

  if (loading && !order) {
    return <p>Loading order…</p>;
  }

  if (!order) {
    return (
      <div className="empty-state" style={{ padding: "40px 20px" }}>
        <h3>Order not found</h3>
        <Link href="/dashboard/orders" className="btn btn-primary">Back to Orders</Link>
      </div>
    );
  }

  return (
    <>
      {justPlaced && (
        <div className="form-success" style={{ marginBottom: 20 }}>
          🎉 Your order has been placed successfully! Pay {money(order.total)} in cash upon delivery.
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, marginBottom: 6 }}>
        <h2 style={{ margin: 0 }}>Order #{order.id}</h2>
        <span className={`status-pill ${order.status}`}>{order.status}</span>
      </div>
      <p className="sub">
        Placed on {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
      </p>

      <div className="invoice-box">
        <div className="invoice-head">
          <div>
            <b style={{ fontFamily: "'Playfair Display', serif", fontSize: 18 }}>CYNORA</b>
            <p style={{ margin: "4px 0 0", fontSize: 13, color: "var(--ink-soft)" }}>Elevate Your Clean</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ margin: 0, fontSize: 13, color: "var(--ink-soft)" }}>Invoice #{order.id}</p>
            <p style={{ margin: 0, fontSize: 13, color: "var(--ink-soft)" }}>Payment: Cash on Delivery</p>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 10 }}>
          <div>
            <b style={{ fontSize: 13.5 }}>Deliver To</b>
            <p style={{ fontSize: 13.5, color: "var(--ink-soft)", lineHeight: 1.7, margin: "6px 0 0" }}>
              {order.address.fullName}<br />
              {order.address.line1}{order.address.line2 ? `, ${order.address.line2}` : ""}<br />
              {order.address.city}, {order.address.state} - {order.address.pincode}<br />
              Phone: {order.address.phone}
            </p>
          </div>
        </div>

        <table className="invoice-table">
          <thead>
            <tr><th>Item</th><th className="right">Qty</th><th className="right">Price</th><th className="right">Total</th></tr>
          </thead>
          <tbody>
            {order.items.map((item) => (
              <tr key={item.productId}>
                <td>{item.name}</td>
                <td className="right">{item.qty}</td>
                <td className="right">{money(item.price)}</td>
                <td className="right">{money(item.price * item.qty)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ maxWidth: 280, marginLeft: "auto" }}>
          <div className="summary-row"><span>Subtotal</span><span>{money(order.subtotal)}</span></div>
          <div className="summary-row"><span>Shipping</span><span>{order.shipping === 0 ? "Free" : money(order.shipping)}</span></div>
          <div className="summary-row"><span>Tax</span><span>{money(order.tax)}</span></div>
          <div className="summary-row total"><span>Total (COD)</span><span>{money(order.total)}</span></div>
        </div>
      </div>

      <div style={{ marginTop: 24 }}>
        <Link href="/dashboard/orders" className="btn btn-ghost">← Back to All Orders</Link>
      </div>
    </>
  );
}

export default function OrderDetailPage() {
  return (
    <Suspense fallback={null}>
      <InvoiceContent />
    </Suspense>
  );
}
