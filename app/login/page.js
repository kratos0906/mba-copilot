"use client";

import { useState } from "react";
import { supabaseClient } from "../../lib/supabaseClient";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email: form.email,
      password: form.password
    });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    router.push("/dashboard");
  };

  return (
    <main className="container">
      <div className="navbar animate-rise">
        <div className="brand">MBA CoPilot</div>
        <Link href="/signup" className="btn btn-secondary">
          Create account
        </Link>
      </div>

      <section className="card surface hover-lift animate-rise" style={{ maxWidth: "520px", margin: "0 auto" }}>
        <div className="section-head" style={{ marginBottom: "0.75rem" }}>
          <div>
            <h1 style={{ fontSize: "1.6rem" }}>Welcome back</h1>
            <p className="muted">Log in to pick up where you left off.</p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="form-grid">
          <div className="field">
            <label className="label" htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={form.email}
              onChange={handleChange}
              className="input"
              placeholder="you@school.edu"
            />
          </div>
          <div className="field">
            <label className="label" htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={form.password}
              onChange={handleChange}
              className="input"
              placeholder="••••••••"
            />
          </div>
          {error && <p style={{ color: "var(--danger)" }}>{error}</p>}
          <button type="submit" disabled={loading} className="btn btn-primary">
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <div style={{ marginTop: "1rem", display: "flex", gap: "0.75rem", flexWrap: "wrap", justifyContent: "space-between" }}>
          <Link href="/forgot-password" className="muted">Forgot your password?</Link>
          <Link href="/signup" className="muted">Need an account? Sign up</Link>
        </div>
      </section>
    </main>
  );
}
