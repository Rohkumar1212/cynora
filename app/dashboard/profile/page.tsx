"use client";

import { useAuth } from "../../context/AuthContext";

export default function ProfilePage() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <>
      <h2>Profile Settings</h2>
      <p className="sub">Your account details on file.</p>

      <div style={{ maxWidth: 480 }}>
        <div className="form-group">
          <label>Full Name</label>
          <input value={user.name} disabled style={{ background: "var(--paper)", cursor: "not-allowed" }} />
        </div>
        <div className="form-group">
          <label>Email Address</label>
          <input value={user.email} disabled style={{ background: "var(--paper)", cursor: "not-allowed" }} />
        </div>
        <div className="form-group">
          <label>Phone Number</label>
          <input value={user.phone || "—"} disabled style={{ background: "var(--paper)", cursor: "not-allowed" }} />
        </div>
        <p className="field-hint">
          Profile editing isn&apos;t available yet — the API doesn&apos;t expose an update-profile endpoint. Once
          it does, this form will submit directly to it.
        </p>
      </div>
    </>
  );
}
