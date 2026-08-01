"use client";

import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import { useOrders } from "../context/OrdersContext";
import { useWishlist } from "../context/WishlistContext";
import { money } from "../lib/storage";

export default function DashboardOverview() {
  const { user } = useAuth();
  const { orders } = useOrders();
  const { count: wishCount } = useWishlist();

  if (!user) return null;

  const totalSpent = orders.reduce((sum, o) => sum + o.total, 0);

  return (
    <>
      <h2>Welcome back, {user.name.split(" ")[0]} 👋</h2>
      <p className="sub">Here&apos;s a quick look at your account activity.</p>

      <div className="stat-cards">
        <div className="stat-card"><b>{orders.length}</b><span>Total Orders</span></div>
        <div className="stat-card"><b>{wishCount}</b><span>Wishlist Items</span></div>
        <div className="stat-card"><b>{money(totalSpent)}</b><span>Total Spent</span></div>
      </div>

      <h3 style={{ fontSize: 17, marginBottom: 16 }}>Recent Orders</h3>
      {orders.length === 0 ? (
        <div className="empty-state" style={{ padding: "40px 20px" }}>
          <p>You haven&apos;t placed any orders yet.</p>
          <Link href="/products" className="btn btn-primary">Start Shopping</Link>
        </div>
      ) : (
        orders.slice(0, 3).map((o) => (
          <div className="order-card" key={o.id}>
            <div className="order-card-head">
              <b>Order #{o.id}</b>
              <span className={`status-pill ${o.status}`}>{o.status}</span>
            </div>
            <p className="date" style={{ marginBottom: 12 }}>{new Date(o.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })} · {o.items.reduce((s, i) => s + i.qty, 0)} item(s)</p>
            <div className="order-card-foot">
              <span>Total: <b>{money(o.total)}</b></span>
              <Link href={`/dashboard/orders/${o.id}`} className="btn btn-ghost">View Bill</Link>
            </div>
          </div>
        ))
      )}
      {orders.length > 3 && (
        <Link href="/dashboard/orders" className="btn btn-ghost">View All Orders →</Link>
      )}
    </>
  );
}
