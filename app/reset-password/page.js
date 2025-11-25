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
  const [sessionReady, setSessionReady] = useState(false);

  useEffect(() => {
    const handleSessionFromHash = async () => {
      if (typeof window === "undefined") {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");
      setStatus("");

      try {
        const hashParams = new URLSearchParams(window.location.hash?.slice(1));
        const accessToken = hashParams.get("access_token");
        const refreshToken = hashParams.get("refresh_token");

        if (!accessToken || !refreshToken) {
          setError("Reset link is missing or expired.");
          return;
        }

        const { error } = await supabaseClient.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken
        });

        if (error) {
          setError(error.message);
          return;
        }

        // Remove sensitive tokens from the URL after we store the session
        const cleanUrl = window.location.pathname + window.location.search;
        window.history.replaceState({}, document.title, cleanUrl);
        setSessionReady(true);
        setStatus("Reset link verified. Enter a new password below.");
      } catch (err) {
        setError("Invalid or expired reset link.");
      } finally {
        setLoading(false);
      }
    };

    handleSessionFromHash();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setStatus("");

    if (!sessionReady) {
      setError("Reset link not verified. Please open the link from your email again.");
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabaseClient.auth.updateUser({ password });
      if (error) {
        setError(error.message);
      } else {
        setStatus("Password updated. You can now log in.");
        setPassword("");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
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
        ) : !sessionReady ? (
          <div className="stack">
            <p style={{ color: "var(--danger)" }}>
              {error || "Reset link is missing or expired. Request a new one to continue."}
            </p>
            <Link href="/forgot-password" className="btn btn-primary">
              Request new reset link
            </Link>
          </div>
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
