"use client";

import { useState } from "react";
import Link from "next/link";
import Reveal from "../components/Reveal";

const FAQ_SHORT = [
  { q: "What's the fastest way to reach support?", a: "Email is checked daily on weekdays; for anything urgent (a damaged delivery, a payment issue), calling us directly gets the quickest response." },
  { q: "Do you handle bulk or distributor enquiries here?", a: "Yes — mention quantities and your city in the form below and our sales team will follow up with pricing." },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  function update(key: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    // No contact-form endpoint is documented in the backend API yet, so this
    // opens a pre-filled email to the team as the most reliable fallback.
    const body = encodeURIComponent(
      `Name: ${form.name}\nPhone: ${form.phone}\n\n${form.message}`
    );
    window.location.href = `mailto:info@sanctumchem.com?subject=${encodeURIComponent(form.subject || "Website Enquiry")}&body=${body}`;
    setTimeout(() => {
      setSending(false);
      setSubmitted(true);
    }, 400);
  }

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb"><Link href="/">Home</Link><span>/</span>Contact Us</div>
          <h1>Get in Touch</h1>
          <p style={{ color: "var(--ink-soft)", maxWidth: 600 }}>
            Questions about an order, a product, or a bulk enquiry — we read every message ourselves.
            Reach us directly, or send a note below.
          </p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 30 }}>
        <div className="container">
          <div className="checkout-grid">
            <div>
              <div className="checkout-card">
                <h3><span className="step-badge">✆</span>Direct Contact</h3>
                <div style={{ display: "grid", gap: 18, marginTop: 6 }}>
                  <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                    <span className="feature-icon" style={{ width: 40, height: 40, fontSize: 16 }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" /></svg>
                    </span>
                    <div>
                      <b style={{ display: "block", marginBottom: 2 }}>Phone</b>
                      <a href="tel:+917290925552" style={{ color: "var(--ink-soft)" }}>+91 72909 25552</a>
                      <p style={{ margin: "2px 0 0", fontSize: 12.5, color: "var(--ink-soft)" }}>Mon–Sat, 10am–7pm IST</p>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                    <span className="feature-icon" style={{ width: 40, height: 40, fontSize: 16 }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16v16H4z" /><path d="M22 6l-10 7L2 6" /></svg>
                    </span>
                    <div>
                      <b style={{ display: "block", marginBottom: 2 }}>Email</b>
                      <a href="mailto:info@sanctumchem.com" style={{ color: "var(--ink-soft)" }}>info@sanctumchem.com</a>
                      <p style={{ margin: "2px 0 0", fontSize: 12.5, color: "var(--ink-soft)" }}>We reply within one business day</p>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                    <span className="feature-icon" style={{ width: 40, height: 40, fontSize: 16 }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>
                    </span>
                    <div>
                      <b style={{ display: "block", marginBottom: 2 }}>Based In</b>
                      <span style={{ color: "var(--ink-soft)" }}>Plot No: 432, IMT Industrial Area, Sector-68, Faridabad, Haryana-121004</span>
                      <p style={{ margin: "2px 0 0", fontSize: 12.5, color: "var(--ink-soft)" }}>Shipping across India</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="checkout-card">
                <h3><span className="step-badge">?</span>Quick Answers</h3>
                {FAQ_SHORT.map((f) => (
                  <div key={f.q} style={{ marginBottom: 14 }}>
                    <b style={{ display: "block", fontSize: 14, marginBottom: 4 }}>{f.q}</b>
                    <p style={{ margin: 0, fontSize: 13.5, color: "var(--ink-soft)", lineHeight: 1.6 }}>{f.a}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="summary-card">
              <h3>Send a Message</h3>
              {submitted ? (
                <div className="form-success">
                  Thanks, {form.name.split(" ")[0] || "there"}! Your email client should have opened with your
                  message pre-filled — just hit send. We&apos;ll get back to you shortly.
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label>Full Name</label>
                    <input required value={form.name} onChange={(e) => update("name", e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label>Email Address</label>
                    <input required type="email" value={form.email} onChange={(e) => update("email", e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label>Phone Number</label>
                    <input value={form.phone} onChange={(e) => update("phone", e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label>Subject</label>
                    <input value={form.subject} onChange={(e) => update("subject", e.target.value)} placeholder="Order enquiry, bulk pricing, feedback…" />
                  </div>
                  <div className="form-group">
                    <label>Message</label>
                    <textarea required rows={5} value={form.message} onChange={(e) => update("message", e.target.value)} />
                  </div>
                  <button type="submit" className="btn btn-primary btn-block" disabled={sending}>
                    {sending ? "Opening your email app…" : "Send Message"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
