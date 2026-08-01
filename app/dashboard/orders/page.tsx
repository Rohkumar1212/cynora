"use client";

import Link from "next/link";
import { useOrders } from "../../context/OrdersContext";
import { money } from "../../lib/storage";

export default function OrdersPage() {
  const { orders } = useOrders();

  return (
    <>
      <h2>My Orders</h2>
      <p className="sub">Track and review all your past orders.</p>

      {orders.length === 0 ? (
        <div className="empty-state" style={{ padding: "40px 20px" }}>
          <p>You haven&apos;t placed any orders yet.</p>
          <Link href="/products" className="btn btn-primary">Start Shopping</Link>
        </div>
      ) : (
        orders.map((o) => (
          <div className="order-card" key={o.id}>
            <div className="order-card-head">
              <b>Order #{o.id}</b>
              <span className={`status-pill ${o.status}`}>{o.status}</span>
            </div>
            <p className="date" style={{ marginBottom: 12 }}>
              Placed on {new Date(o.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
            </p>
            <p style={{ fontSize: 13.5, color: "var(--ink-soft)", marginBottom: 12 }}>
              {o.items.map((i) => i.name).join(", ")}
            </p>
            <div className="order-card-foot">
              <span>Total ({o.paymentMethod}): <b>{money(o.total)}</b></span>
              <Link href={`/dashboard/orders/${o.id}`} className="btn btn-ghost">View Bill</Link>
            </div>
          </div>
        ))
      )}
    </>
  );
}
