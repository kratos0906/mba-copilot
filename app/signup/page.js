"use client";

import { useState } from "react";
import { supabaseClient } from "../../lib/supabaseClient";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignupPage() {
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
    const { data, error } = await supabaseClient.auth.signUp({
      email: form.email,
      password: form.password
    });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    router.push("/login");
  };

  return (
    <main className="container">
      <div className="navbar animate-rise">
        <div className="brand">MBA CoPilot</div>
        <Link href="/login" className="btn btn-secondary">
          Login
        </Link>
      </div>

      <section className="card surface hover-lift animate-rise" style={{ maxWidth: "520px", margin: "0 auto" }}>
        <div className="section-head" style={{ marginBottom: "0.75rem" }}>
          <div>
            <h1 style={{ fontSize: "1.6rem" }}>Create your account</h1>
            <p className="muted">Set a password to unlock your AI planner.</p>
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
              minLength={6}
              value={form.password}
              onChange={handleChange}
              className="input"
              placeholder="At least 6 characters"
            />
          </div>
          {error && <p style={{ color: "var(--danger)" }}>{error}</p>}
          <button type="submit" disabled={loading} className="btn btn-primary">
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>
        <div style={{ marginTop: "1rem", display: "flex", justifyContent: "space-between", gap: "0.5rem", flexWrap: "wrap" }}>
          <span className="muted">Already have an account?</span>
          <Link href="/login" className="muted">Login</Link>
        </div>
      </section>
    </main>
  );
}
