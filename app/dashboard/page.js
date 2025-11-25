"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseClient } from "../../lib/supabaseClient";

const CATEGORY_OPTIONS = [
  { value: "academics", label: "Academics" },
  { value: "career", label: "Career Prep" },
  { value: "case_competition", label: "Case Competitions" },
  { value: "personal", label: "Personal / Wellness" }
];

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "academics",
    deadline: "",
    effort_hours: 1
  });
  const [aiPlan, setAiPlan] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [error, setError] = useState("");
  const completedCount = tasks.filter((t) => t.status === "completed").length;
  const remainingCount = tasks.length - completedCount;
  const totalEffort = tasks.reduce((sum, t) => sum + (t.effort_hours || 0), 0);
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();

  const formatDate = (y, m, d) => `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

  const tasksByDate = useMemo(() => {
    const grouped = {};
    for (const t of tasks) {
      if (t.deadline) {
        grouped[t.deadline] = grouped[t.deadline] || [];
        grouped[t.deadline].push(t);
      }
    }
    return grouped;
  }, [tasks]);

  const monthDays = useMemo(() => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, idx) => {
      const day = idx + 1;
      const dateStr = formatDate(year, month, day);
      return {
        day,
        dateStr,
        tasks: tasksByDate[dateStr] || []
      };
    });
  }, [month, tasksByDate, year]);

  const noDeadlineTasks = tasks.filter((t) => !t.deadline);

  // Check auth
  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabaseClient.auth.getUser();
      if (error || !data?.user) {
        router.push("/login");
        return;
      }
      setUser(data.user);
    };
    getUser();
  }, [router]);

  useEffect(() => {
    if (!user) return;
    const fetchTasks = async () => {
      setLoadingTasks(true);
      const { data, error } = await supabaseClient
        .from("tasks")
        .select("*")
        .eq("user_id", user.id)
        .order("deadline", { ascending: true });
      if (error) {
        console.error(error);
      } else {
        setTasks(data || []);
      }
      setLoadingTasks(false);
    };
    fetchTasks();
  }, [user]);

  const handleLogout = async () => {
    await supabaseClient.auth.signOut();
    router.push("/login");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "effort_hours" ? Number(value) : value
    }));
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!user) return;
    setError("");
    if (!form.title.trim()) {
      setError("Title is required");
      return;
    }
    const { data, error } = await supabaseClient.from("tasks").insert({
      user_id: user.id,
      title: form.title,
      description: form.description,
      category: form.category,
      deadline: form.deadline || null,
      effort_hours: form.effort_hours || null
    });
    if (error) {
      setError(error.message);
      return;
    }
    // Refresh tasks
    const { data: refreshed } = await supabaseClient
      .from("tasks")
      .select("*")
      .eq("user_id", user.id)
      .order("deadline", { ascending: true });
    setTasks(refreshed || []);
    setForm({
      title: "",
      description: "",
      category: "academics",
      deadline: "",
      effort_hours: 1
    });
  };

  const handleDeleteTask = async (id) => {
    if (!confirm("Delete this task?")) return;
    await supabaseClient.from("tasks").delete().eq("id", id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const handleToggleStatus = async (task) => {
    const newStatus = task.status === "completed" ? "in_progress" : "completed";
    const { error } = await supabaseClient
      .from("tasks")
      .update({ status: newStatus })
      .eq("id", task.id);
    if (!error) {
      setTasks((prev) =>
        prev.map((t) => (t.id === task.id ? { ...t, status: newStatus } : t))
      );
    }
  };

  const handleGenerateAiPlan = async () => {
    setAiLoading(true);
    setAiPlan("");
    try {
      const res = await fetch("/api/ai-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tasks })
      });
      const data = await res.json();
      setAiPlan(data.plan || "No plan generated.");
    } catch (err) {
      console.error(err);
      setAiPlan("Error generating AI plan.");
    } finally {
      setAiLoading(false);
    }
  };

  if (!user) {
    return (
      <main className="container">
        <p>Checking authentication...</p>
      </main>
    );
  }

  return (
    <main className="container">
      <header className="navbar animate-rise">
        <div className="brand">MBA CoPilot</div>
        <div className="pill">
          <span role="img" aria-label="spark">⚡</span>
          {user.email}
        </div>
        <button onClick={handleLogout} className="btn btn-secondary">
          Logout
        </button>
      </header>

      <section className="surface hero animate-rise">
        <div>
          <div className="pill">Weekly momentum</div>
          <h1 className="hero-title" style={{ fontSize: "1.9rem", marginTop: "0.4rem" }}>
            Welcome back, {user.email?.split("@")[0] || "teammate"}.
          </h1>
          <p className="muted" style={{ marginTop: "0.35rem" }}>
            Capture tasks, keep deadlines visible, and let AI shape a plan you can actually follow.
          </p>
        </div>
        <div className="grid-2" style={{ marginTop: "0.5rem" }}>
          <div className="card hover-lift animate-rise stagger-1">
            <p className="muted">📌 Open tasks</p>
            <h3 style={{ fontSize: "1.6rem" }}>{remainingCount}</h3>
            <p className="muted" style={{ fontSize: "0.95rem" }}>Awaiting completion</p>
          </div>
          <div className="card hover-lift animate-rise stagger-2">
            <p className="muted">✅ Completed</p>
            <h3 style={{ fontSize: "1.6rem" }}>{completedCount}</h3>
            <p className="muted" style={{ fontSize: "0.95rem" }}>Checked off</p>
          </div>
          <div className="card hover-lift animate-rise stagger-3">
            <p className="muted">⏱ Estimated effort</p>
            <h3 style={{ fontSize: "1.6rem" }}>{totalEffort}h</h3>
            <p className="muted" style={{ fontSize: "0.95rem" }}>Across all tasks</p>
          </div>
          <div className="card hover-lift animate-rise stagger-4">
            <p className="muted">🗂 Categories</p>
            <h3 style={{ fontSize: "1.6rem" }}>{CATEGORY_OPTIONS.length}</h3>
            <p className="muted" style={{ fontSize: "0.95rem" }}>Focus areas</p>
          </div>
        </div>
      </section>

      <div className="grid-2" style={{ marginTop: "1.25rem" }}>
        <section className="card surface hover-lift animate-rise">
          <div className="section-head" style={{ marginBottom: "0.75rem" }}>
            <div>
              <h2>Add a task</h2>
              <p className="muted">Keep it short; add effort hours so AI can schedule realistically.</p>
            </div>
          </div>
          <form onSubmit={handleCreateTask} className="form-grid">
            <div className="field">
              <label className="label" htmlFor="title">Title</label>
              <input
                id="title"
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                className="input"
                placeholder="e.g., Prep Corporate Finance end-term"
              />
            </div>
            <div className="field">
              <label className="label" htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={3}
                className="textarea"
                placeholder="What does done look like?"
              />
            </div>
            <div className="grid-2">
              <div className="field">
                <label className="label" htmlFor="category">Category</label>
                <select
                  id="category"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="select"
                >
                  {CATEGORY_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label className="label" htmlFor="deadline">Deadline</label>
                <input
                  type="date"
                  id="deadline"
                  name="deadline"
                  value={form.deadline}
                  onChange={handleChange}
                  className="input"
                />
              </div>
              <div className="field">
                <label className="label" htmlFor="effort_hours">Effort (hours)</label>
                <input
                  type="number"
                  id="effort_hours"
                  name="effort_hours"
                  min={1}
                  value={form.effort_hours}
                  onChange={handleChange}
                  className="input"
                />
              </div>
            </div>

            {error && <p style={{ color: "var(--danger)" }}>{error}</p>}

            <button type="submit" className="btn btn-primary" style={{ alignSelf: "flex-start" }}>
              Add task
            </button>
          </form>
        </section>

        <section className="card surface hover-lift animate-rise stagger-1">
          <div className="section-head" style={{ marginBottom: "0.75rem" }}>
            <div>
              <h2>AI Weekly Plan</h2>
              <p className="muted">Generate a Monday–Sunday plan directly from your tasks.</p>
            </div>
            <button
              onClick={handleGenerateAiPlan}
              disabled={aiLoading || tasks.length === 0}
              className="btn btn-secondary"
            >
              {aiLoading ? "Generating..." : "Generate plan"}
            </button>
          </div>
          <div className="ai-box">
            {aiLoading && "Thinking with Gemini..."}
            {!aiLoading && aiPlan}
            {!aiLoading && !aiPlan && "No plan yet. Add tasks and generate to see your week."}
          </div>
        </section>
      </div>

      <section className="card surface hover-lift animate-rise" style={{ marginTop: "1.25rem" }}>
        <div className="section-head" style={{ marginBottom: "0.75rem" }}>
          <div>
            <h2>Schedule (This month)</h2>
            <p className="muted">Tasks placed on their deadlines for a quick visual sweep.</p>
          </div>
        </div>
        {tasks.length === 0 ? (
          <p className="muted">No tasks yet—add some to see them on the calendar.</p>
        ) : (
          <>
            <div className="calendar-grid">
              {monthDays.map((item) => {
                const isToday = item.dateStr === formatDate(year, month, today.getDate());
                const tasksForDay = item.tasks;
                const extra = tasksForDay.length > 3 ? tasksForDay.length - 3 : 0;
                return (
                  <div
                    key={item.dateStr}
                    className={`calendar-cell ${isToday ? "calendar-today" : ""}`}
                  >
                    <div className="calendar-day">
                      <span>{item.day}</span>
                      {isToday && <span className="calendar-pill">Today</span>}
                    </div>
                    <div className="calendar-tasks">
                      {tasksForDay.slice(0, 3).map((t) => (
                        <span key={t.id} className="calendar-task">
                          {CATEGORY_OPTIONS.find((c) => c.value === t.category)?.label || t.category} · {t.title}
                        </span>
                      ))}
                      {extra > 0 && <span className="calendar-task">+{extra} more</span>}
                      {tasksForDay.length === 0 && <span className="muted" style={{ fontSize: "0.9rem" }}>No tasks</span>}
                    </div>
                  </div>
                );
              })}
            </div>
            {noDeadlineTasks.length > 0 && (
              <div style={{ marginTop: "0.75rem" }}>
                <p className="muted" style={{ marginBottom: "0.35rem" }}>No deadline</p>
                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                  {noDeadlineTasks.map((t) => (
                    <span key={t.id} className="calendar-task">
                      {t.title}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </section>

      <section className="card surface hover-lift animate-rise" style={{ marginTop: "1.25rem" }}>
        <div className="section-head" style={{ marginBottom: "0.75rem" }}>
          <div>
            <h2>Your tasks</h2>
            <p className="muted">{tasks.length === 0 ? "No tasks yet—start with the form above." : "Tap complete or delete to keep the list fresh."}</p>
          </div>
        </div>
        {loadingTasks ? (
          <p className="muted">Loading tasks...</p>
        ) : tasks.length === 0 ? (
          <p className="muted">No tasks yet. Add your first task to get moving.</p>
        ) : (
          <div className="form-grid">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="task-card hover-lift animate-rise"
                style={{
                  background: task.status === "completed" ? "rgba(34, 197, 94, 0.08)" : undefined,
                  borderColor: task.status === "completed" ? "rgba(34, 197, 94, 0.4)" : "var(--border)"
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3 style={{ margin: 0 }}>{task.title}</h3>
                  <div className="task-meta">
                    <span className="badge">
                      {CATEGORY_OPTIONS.find((c) => c.value === task.category)?.label || task.category}
                    </span>
                    {task.deadline && <span className="badge">Due {task.deadline}</span>}
                    {task.effort_hours ? <span className="badge">~{task.effort_hours}h</span> : null}
                    <span className="badge" style={{ opacity: 0.85 }}>
                      {task.status === "completed" ? "Completed" : "In progress"}
                    </span>
                  </div>
                  {task.description && (
                    <p className="muted" style={{ marginTop: "0.4rem" }}>
                      {task.description}
                    </p>
                  )}
                </div>
                <div className="task-actions">
                  <button
                    onClick={() => handleToggleStatus(task)}
                    className={`pill-btn ${task.status === "completed" ? "warn" : "success"}`}
                  >
                    {task.status === "completed" ? "Mark In Progress" : "Mark Complete"}
                  </button>
                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className="pill-btn danger"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
