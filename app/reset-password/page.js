"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabaseClient } from "../../lib/supabaseClient";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const handleSessionFromUrl = async () => {
      try {
        // Supabase can send either hash tokens (#access_token) or a code param (?code=)
        const url = new URL(window.location.href);
        const hasCode = url.searchParams.get("code");
        if (hasCode) {
          const { error } = await supabaseClient.auth.exchangeCodeForSession(hasCode);
          if (error) setError(error.message);
        } else if (window.location.hash) {
          const { error } = await supabaseClient.auth.getSessionFromUrl({ storeSession: true });
          if (error) setError(error.message);
        } else {
          setError("Reset link is missing or expired.");
        }
      } catch (err) {
        setError("Invalid or expired reset link.");
      } finally {
        setLoading(false);
      }
    };

    if (typeof window !== "undefined") {
      handleSessionFromUrl();
    } else {
      setLoading(false);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setStatus("");
    setSubmitting(true);
    const { error } = await supabaseClient.auth.updateUser({ password });
    setSubmitting(false);
    if (error) {
      setError(error.message);
    } else {
      setStatus("Password updated. You can now log in.");
      setPassword("");
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
            <p className="muted">Choose a new password below.</p>
          </div>
        </div>
        {loading ? (
          <p className="muted">Verifying reset link...</p>
        ) : (
          <form onSubmit={handleSubmit} className="form-grid">
            <div className="field">
              <label className="label" htmlFor="password">New password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
                placeholder="••••••••"
              />
            </div>
            {error && <p style={{ color: "var(--danger)" }}>{error}</p>}
            {status && <p style={{ color: "var(--accent-strong)" }}>{status}</p>}
            <button type="submit" disabled={submitting} className="btn btn-primary">
              {submitting ? "Updating..." : "Update password"}
            </button>
          </form>
        )}
      </section>
    </main>
  );
}
