import Link from "next/link";

export default function Home() {
  return (
    <main className="container">
      <header className="navbar animate-rise">
        <div className="brand">MBA CoPilot</div>
        <nav className="hero-actions">
          <Link href="/login" className="btn btn-secondary">
            Login
          </Link>
          <Link href="/signup" className="btn btn-primary">
            Sign Up
          </Link>
        </nav>
      </header>

      <section className="surface hero animate-rise">
        <div className="glow a" aria-hidden="true" />
        <div className="glow b" aria-hidden="true" />
        <div>
          <div className="pill">AI planner for MBA students</div>
          <h1 className="hero-title" style={{ fontSize: "2.8rem", maxWidth: "820px" }}>
            Command your MBA week with clarity and momentum.
          </h1>
          <p style={{ maxWidth: "640px", lineHeight: 1.7 }}>
            Capture tasks, see deadlines, and let AI balance academics, cases, and recruiting.
          </p>
          <div className="hero-actions" style={{ marginTop: "1rem" }}>
            <Link href="/signup" className="btn btn-primary">
              Get started free
            </Link>
            <Link href="/login" className="btn btn-secondary">
              Sign in
            </Link>
            <span className="icon-chip" style={{ color: "var(--muted)" }}>
              🌿 Balanced week · ⚡ AI planning
            </span>
          </div>
        </div>
        <div className="card hover-lift animate-rise stagger-1">
          <h3 style={{ marginBottom: "0.5rem" }}>What you get</h3>
          <ul style={{ margin: 0, paddingLeft: "1.1rem", lineHeight: 1.7, color: "var(--muted)" }}>
            <li>AI weekly plan grounded in your deadlines and effort</li>
            <li>Clear categories for academics, career, cases, personal</li>
            <li>Fast task capture with effort and status</li>
          </ul>
        </div>
      </section>

      <div className="grid-2" style={{ marginTop: "1.5rem" }}>
        <section className="card surface hover-lift animate-rise stagger-2">
          <h3 style={{ marginBottom: "0.5rem" }}>Why students love it</h3>
          <p className="muted" style={{ marginBottom: "0.75rem" }}>
            Built for the MBA juggle.
          </p>
          <div style={{ display: "grid", gap: "0.65rem" }}>
            <div className="icon-chip">📌 One dashboard for every track</div>
            <div className="icon-chip">🧠 Plans that respect deadlines and effort</div>
            <div className="icon-chip">🧭 Daily focus without overload</div>
          </div>
        </section>

        <section className="card surface hover-lift animate-rise stagger-3">
          <h3 style={{ marginBottom: "0.5rem" }}>How it works</h3>
          <ol style={{ margin: 0, paddingLeft: "1.1rem", lineHeight: 1.7, color: "var(--muted)" }}>
            <li>Sign up and add tasks with deadlines and effort.</li>
            <li>Tap “Generate AI Plan” to shape your week.</li>
            <li>Check off, edit, or delete as you go.</li>
          </ol>
        </section>
      </div>

      <section className="card surface hover-lift animate-rise" style={{ marginTop: "2rem" }}>
        <div className="section-title" style={{ marginBottom: "0.5rem" }}>
          <h2>Built for MBA momentum</h2>
        </div>
        <div className="grid-2" style={{ marginTop: "1rem" }}>
          <div className="feature-frame">
            <div>
              <p className="muted">Dashboard snapshot</p>
              <h3 style={{ marginTop: "0.3rem" }}>See tasks, effort, and AI plan in one sweep</h3>
            </div>
          </div>
          <div className="feature-frame">
            <div>
              <p className="muted">Calendar view</p>
              <h3 style={{ marginTop: "0.3rem" }}>Deadlines plotted by day with a “no deadline” lane</h3>
            </div>
          </div>
        </div>
      </section>

      <section className="card surface hover-lift animate-rise" style={{ marginTop: "1.5rem" }}>
        <div className="section-title" style={{ marginBottom: "0.5rem" }}>
          <h2>Everything in one flow</h2>
        </div>
        <div className="grid-2" style={{ marginTop: "1rem" }}>
          <div>
            <div className="icon-chip" style={{ marginBottom: "0.5rem" }}>🗂 Categories</div>
            <p className="muted">Academics, career, case competitions, personal—keep them separated but visible.</p>
          </div>
          <div>
            <div className="icon-chip" style={{ marginBottom: "0.5rem" }}>⚡ AI planning</div>
            <p className="muted">Weekly plan grounded in your deadlines and effort hours.</p>
          </div>
          <div>
            <div className="icon-chip" style={{ marginBottom: "0.5rem" }}>✅ Task states</div>
            <p className="muted">Mark complete/in progress with one tap.</p>
          </div>
          <div>
            <div className="icon-chip" style={{ marginBottom: "0.5rem" }}>🔒 Supabase Auth</div>
            <p className="muted">Secure email login; your data stays yours.</p>
          </div>
        </div>
      </section>

      <section className="card surface hover-lift animate-rise" style={{ marginTop: "1.5rem" }}>
        <div className="section-title" style={{ marginBottom: "0.5rem" }}>
          <h2>Ready to plan your week?</h2>
        </div>
        <div className="hero-actions" style={{ marginTop: "0.75rem" }}>
          <Link href="/signup" className="btn btn-primary">
            Start now
          </Link>
          <Link href="/login" className="btn btn-secondary">
            Sign in
          </Link>
        </div>
      </section>
    </main>
  );
}
