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
        <div>
          <div className="pill">AI planner for MBA students</div>
          <h1 className="hero-title">Balance academics, recruiting, and case competitions with clarity.</h1>
          <p style={{ maxWidth: "720px", lineHeight: 1.7 }}>
            MBA CoPilot keeps your classes, assignments, case competitions, recruiting tasks, and personal goals in one place.
            Turn your to-dos into a realistic weekly plan with AI.
          </p>
          <div className="hero-actions" style={{ marginTop: "1rem" }}>
            <Link href="/signup" className="btn btn-primary">
              Get started free
            </Link>
            <Link href="/login" className="btn btn-secondary">
              I already have an account
            </Link>
          </div>
        </div>
        <div className="card hover-lift animate-rise stagger-1">
          <h3 style={{ marginBottom: "0.5rem" }}>What you get</h3>
          <ul style={{ margin: 0, paddingLeft: "1.1rem", lineHeight: 1.7, color: "var(--muted)" }}>
            <li>Weekly AI plan grounded in your deadlines and effort estimates</li>
            <li>Categories for academics, career prep, case competitions, and personal wellness</li>
            <li>Fast task capture with status toggles and time estimates</li>
            <li>Secure login backed by Supabase Auth</li>
          </ul>
        </div>
      </section>

      <div className="grid-2" style={{ marginTop: "1.5rem" }}>
        <section className="card surface hover-lift animate-rise stagger-2">
          <h3 style={{ marginBottom: "0.5rem" }}>Why MBA CoPilot?</h3>
          <p className="muted" style={{ marginBottom: "0.75rem" }}>
            Purpose-built for the MBA juggling act—courses, recruiting, cases, and personal time.
          </p>
          <ul style={{ margin: 0, paddingLeft: "1.1rem", lineHeight: 1.7, color: "var(--muted)" }}>
            <li>See everything in one dashboard with priorities and deadlines.</li>
            <li>AI-generated weekly plan you can follow without overcommitting.</li>
            <li>Lightweight workflow: add, complete, or delete tasks in seconds.</li>
          </ul>
        </section>

        <section className="card surface hover-lift animate-rise stagger-3">
          <h3 style={{ marginBottom: "0.5rem" }}>How it works</h3>
          <ol style={{ margin: 0, paddingLeft: "1.1rem", lineHeight: 1.7, color: "var(--muted)" }}>
            <li>Sign up and log in to your dashboard.</li>
            <li>Create tasks across Academics, Career, Case Competitions, and Personal.</li>
            <li>Click “Generate AI Plan” to get a realistic week schedule.</li>
            <li>Mark tasks done or in progress as you move through the week.</li>
          </ol>
        </section>
      </div>
    </main>
  );
}
