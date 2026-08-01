"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Logo from "../components/Logo";
import { useAuth } from "../context/AuthContext";

export default function SignupPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirm: "" });
  const [error, setError] = useState("");

  function update(key: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (form.password !== form.confirm) {
      setError("Passwords do not match.");
      return;
    }
    setSubmitting(true);
    const res = await register(form);
    setSubmitting(false);
    if (!res.ok) {
      setError(res.error || "Could not create account.");
      return;
    }
    router.push("/dashboard");
  }

  return (
    <section className="auth-wrap">
      <div className="auth-card">
        <div className="auth-logo-row"><Logo size={48} /></div>
        <h1>Create Your Account</h1>
        <p className="sub">Join Cynora for faster checkout &amp; order tracking.</p>

        {error && <div className="form-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input id="name" required value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Your name" />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input id="email" type="email" required value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="you@example.com" />
          </div>
          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input id="phone" type="tel" required value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="+91 98765 43210" />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input id="password" type="password" required value={form.password} onChange={(e) => update("password", e.target.value)} placeholder="••••••••" />
            </div>
            <div className="form-group">
              <label htmlFor="confirm">Confirm Password</label>
              <input id="confirm" type="password" required value={form.confirm} onChange={(e) => update("confirm", e.target.value)} placeholder="••••••••" />
            </div>
          </div>
          <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>{submitting ? "Creating Account…" : "Create Account"}</button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link href="/login">Log in</Link>
        </p>

      </div>
    </section>
  );
}
