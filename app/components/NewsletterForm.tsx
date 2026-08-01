"use client";

import { useState } from "react";

export default function NewsletterForm() {
  const [done, setDone] = useState(false);

  if (done) {
    return <p className="form-success">🎉 Thanks for subscribing! Watch your inbox for offers.</p>;
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setDone(true);
      }}
    >
      <input type="email" placeholder="Enter your email" required />
      <button type="submit" className="btn btn-dark">
        Subscribe
      </button>
    </form>
  );
}
