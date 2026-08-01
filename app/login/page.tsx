"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Logo from "../components/Logo";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    const res = await login(email, password);
    setSubmitting(false);
    if (!res.ok) {
      setError(res.error || "Login failed.");
      return;
    }
    router.push(params.get("next") || "/dashboard");
  }

  return (
    <section className="auth-wrap">
      <div className="auth-card">
        <div className="auth-logo-row"><Logo size={48} /></div>
        <h1>Welcome Back</h1>
        <p className="sub">Log in to manage your orders, cart &amp; wishlist.</p>

        {error && <div className="form-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
          </div>
          <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>{submitting ? "Logging in…" : "Log In"}</button>
        </form>

        <p className="auth-switch">
          Don&apos;t have an account? <Link href="/signup">Create one</Link>
        </p>

      </div>
    </section>
  );
}
