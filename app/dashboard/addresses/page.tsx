"use client";

import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Address } from "../../lib/types";

const EMPTY = { fullName: "", phone: "", line1: "", line2: "", city: "", state: "", pincode: "" };

export default function AddressesPage() {
  const { user, addresses, addAddress, updateAddress, removeAddress } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY);

  if (!user) return null;

  function startAdd() {
    setForm(EMPTY);
    setEditingId(null);
    setShowForm(true);
  }

  function startEdit(a: Address) {
    setForm({ fullName: a.fullName, phone: a.phone, line1: a.line1, line2: a.line2 || "", city: a.city, state: a.state, pincode: a.pincode });
    setEditingId(a.id);
    setShowForm(true);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (editingId) {
      updateAddress({ ...form, id: editingId });
    } else {
      addAddress(form);
    }
    setShowForm(false);
    setForm(EMPTY);
    setEditingId(null);
  }

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h2 style={{ marginBottom: 4 }}>Saved Addresses</h2>
          <p className="sub" style={{ marginBottom: 0 }}>Manage delivery addresses for faster checkout.</p>
        </div>
        {!showForm && <button className="btn btn-primary" onClick={startAdd}>+ Add Address</button>}
      </div>

      <div style={{ marginTop: 24 }}>
        {addresses.length === 0 && !showForm && (
          <div className="empty-state" style={{ padding: "40px 20px" }}>
            <p>No saved addresses yet.</p>
          </div>
        )}

        {addresses.map((a) => (
          <div className="address-card selected" key={a.id} style={{ cursor: "default" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginTop: 2, flexShrink: 0 }}>
              <path d="M12 21s7-6.6 7-12A7 7 0 105 9c0 5.4 7 12 7 12z" /><circle cx="12" cy="9" r="2.5" />
            </svg>
            <div style={{ flex: 1 }}>
              <b>{a.fullName}</b> — {a.phone}
              <p>{a.line1}{a.line2 ? `, ${a.line2}` : ""}, {a.city}, {a.state} - {a.pincode}</p>
              <div className="address-actions">
                <button onClick={() => startEdit(a)}>Edit</button>
                <button onClick={() => removeAddress(a.id)}>Delete</button>
              </div>
            </div>
          </div>
        ))}

        {showForm && (
          <form onSubmit={handleSubmit} className="checkout-card" style={{ boxShadow: "none", border: "1.5px solid var(--line)", marginTop: 20 }}>
            <h3 style={{ fontSize: 16 }}>{editingId ? "Edit Address" : "New Address"}</h3>
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
              <input required value={form.line1} onChange={(e) => setForm({ ...form, line1: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Address Line 2 (Optional)</label>
              <input value={form.line2} onChange={(e) => setForm({ ...form, line2: e.target.value })} />
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
              <button type="button" className="btn btn-ghost" onClick={() => { setShowForm(false); setEditingId(null); }}>Cancel</button>
            </div>
          </form>
        )}
      </div>
    </>
  );
}
