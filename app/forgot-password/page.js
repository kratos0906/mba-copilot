"use client";

import { useState } from "react";
import { supabaseClient } from "../../lib/supabaseClient";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("");
    setError("");
    const { data, error } = await supabaseClient.auth.resetPasswordForEmail(email, {
      redirectTo: typeof window !== "undefined" ? `${window.location.origin}/reset-password` : undefined
    });
    if (error) {
      setError(error.message);
    } else {
      setStatus("Password reset email sent. Check your inbox.");
    }
  };

  return (
    <main className="container">
      <div className="navbar animate-rise">
        <div className="brand">MBA CoPilot</div>
        <Link href="/login" className="btn btn-secondary">
          Back to login
        </Link>
      </div>

      <section className="card surface hover-lift animate-rise" style={{ maxWidth: "520px", margin: "0 auto" }}>
        <div className="section-head" style={{ marginBottom: "0.75rem" }}>
          <div>
            <h1 style={{ fontSize: "1.6rem" }}>Reset your password</h1>
            <p className="muted">Enter your email and we’ll send a reset link.</p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="form-grid">
          <div className="field">
            <label className="label" htmlFor="reset-email">Email</label>
            <input
              id="reset-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
              placeholder="you@school.edu"
            />
          </div>
          {error && <p style={{ color: "var(--danger)" }}>{error}</p>}
          {status && <p style={{ color: "var(--accent-strong)" }}>{status}</p>}
          <button type="submit" className="btn btn-primary">
            Send reset link
          </button>
        </form>
        <div style={{ marginTop: "1rem" }}>
          <Link href="/login" className="muted">Back to login</Link>
        </div>
      </section>
    </main>
  );
}
