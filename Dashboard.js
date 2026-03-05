import { useState } from "react";

// ─── Constants ────────────────────────────────────────────────────────────────

const PRIORITIES = ["Low", "Medium", "High"];
const STATUSES = ["Not Started", "In Progress", "Completed"];
const STATUS_ORDER = { "Not Started": 0, "In Progress": 1, Completed: 2 };
const STATUS_COLOR = { "Not Started": "#ff6b6b", "In Progress": "#1ebeea", Completed: "#2ecc71" };
const PRIORITY_COLOR = { Low: "#aaa", Medium: "#1ebeea", High: "#ff6b6b" };

const NAV_ITEMS = [
  { icon: "⊞", label: "Dashboard" },
  { icon: "✓", label: "My Tasks" },
];

const INITIAL_TASKS = [
  {
    id: 1, title: "Attend Nischal's Birthday Party",
    desc: "Buy gifts on the way and pick up cake from the bakery. (6 PM | Fresh Elements)",
    priority: "Medium", status: "Not Started", date: "20/09/2023",
    img: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=80&h=60&fit=crop",
  },
  {
    id: 2, title: "Landing Page Design for TravelDays",
    desc: "Get the work done by 1:00 and discuss with client before leaving. (4 PM | Meeting Room)",
    priority: "Medium", status: "In Progress", date: "20/09/2023",
    img: "https://images.unsplash.com/photo-1488085061387-422e29b40080?w=80&h=60&fit=crop",
  },
  {
    id: 3, title: "Presentation on Final Product",
    desc: "Make sure everything is functioning and all the necessities are properly met.",
    priority: "High", status: "In Progress", date: "30/09/2023",
    img: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=80&h=60&fit=crop",
  },
];

// ─── Shared Styles ────────────────────────────────────────────────────────────

const S = {
  btn: (bg, color) => ({
    padding: "3px 10px", borderRadius: 8, border: "none",
    cursor: "pointer", fontWeight: 700, fontSize: 10, background: bg, color,
  }),
  input: {
    width: "100%", padding: "9px 12px", borderRadius: 10,
    border: "1.5px solid #e0e0e0", fontSize: 13, outline: "none",
    fontFamily: "inherit", boxSizing: "border-box",
  },
  card: {
    background: "#fff", borderRadius: 12, padding: 12,
    boxShadow: "0 2px 8px rgba(0,0,0,0.06)", display: "flex", gap: 10,
  },
  section: { background: "#e3e3e3", borderRadius: 14, padding: 16 },
};

// ─── CircleProgress ───────────────────────────────────────────────────────────

function CircleProgress({ percent, color, label }) {
  const r = 28, circ = 2 * Math.PI * r;
  const offset = circ - (percent / 100) * circ;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
      <svg width="72" height="72" viewBox="0 0 72 72">
        <circle cx="36" cy="36" r={r} fill="none" stroke="#f0f0f0" strokeWidth="7" />
        <circle cx="36" cy="36" r={r} fill="none" stroke={color} strokeWidth="7"
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          transform="rotate(-90 36 36)" style={{ transition: "stroke-dashoffset 0.8s ease" }} />
        <text x="36" y="41" textAnchor="middle" fontSize="13" fontWeight="700" fill="#222">{percent}%</text>
      </svg>
      <span style={{ fontSize: 11, color: "#888", display: "flex", alignItems: "center", gap: 4 }}>
        <span style={{ width: 8, height: 8, borderRadius: "50%", background: color, display: "inline-block" }} />
        {label}
      </span>
    </div>
  );
}

// ─── TaskModal (Add / Edit) ───────────────────────────────────────────────────

function TaskModal({ task, onSave, onClose }) {
  const [form, setForm] = useState(
    task || { title: "", desc: "", priority: "Medium", status: "Not Started", img: "" }
  );
  const [error, setError] = useState("");

  const set = (field, val) => setForm(f => ({ ...f, [field]: val }));

  const handleSave = () => {
    if (!form.title.trim()) return setError("Title is required.");
    onSave(form);
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}
      onClick={onClose}>
      <div style={{ background: "#fff", borderRadius: 16, padding: 28, width: 420, boxShadow: "0 8px 40px rgba(0,0,0,0.18)", display: "flex", flexDirection: "column", gap: 14 }}
        onClick={e => e.stopPropagation()}>

        <div style={{ fontWeight: 800, fontSize: 17, color: "#222" }}>{task ? "Edit Task" : "Add New Task"}</div>

        <div>
          <label style={{ fontSize: 12, fontWeight: 700, color: "#555", display: "block", marginBottom: 4 }}>Title *</label>
          <input style={S.input} value={form.title} onChange={e => set("title", e.target.value)} placeholder="Task title..." />
          {error && <div style={{ color: "#ff6b6b", fontSize: 11, marginTop: 4 }}>{error}</div>}
        </div>

        <div>
          <label style={{ fontSize: 12, fontWeight: 700, color: "#555", display: "block", marginBottom: 4 }}>Description</label>
          <textarea style={{ ...S.input, resize: "vertical", minHeight: 70 }}
            value={form.desc} onChange={e => set("desc", e.target.value)} placeholder="Task description..." />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {[["Priority", "priority", PRIORITIES], ["Status", "status", STATUSES]].map(([lbl, field, opts]) => (
            <div key={field}>
              <label style={{ fontSize: 12, fontWeight: 700, color: "#555", display: "block", marginBottom: 4 }}>{lbl}</label>
              <select style={{ ...S.input, cursor: "pointer" }} value={form[field]} onChange={e => set(field, e.target.value)}>
                {opts.map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
          ))}
        </div>

        <div>
          <label style={{ fontSize: 12, fontWeight: 700, color: "#555", display: "block", marginBottom: 4 }}>Image URL (optional)</label>
          <input style={S.input} value={form.img} onChange={e => set("img", e.target.value)} placeholder="https://..." />
        </div>

        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button onClick={onClose} style={{ padding: "8px 18px", borderRadius: 10, border: "1.5px solid #ddd", background: "#fff", cursor: "pointer", fontWeight: 600, fontSize: 13 }}>Cancel</button>
          <button onClick={handleSave} style={{ padding: "8px 20px", borderRadius: 10, border: "none", background: "#1ebeea", color: "#fff", cursor: "pointer", fontWeight: 700, fontSize: 13 }}>Save Task</button>
        </div>
      </div>
    </div>
  );
}

// ─── ConfirmModal ─────────────────────────────────────────────────────────────

function ConfirmModal({ onConfirm, onClose }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}
      onClick={onClose}>
      <div style={{ background: "#fff", borderRadius: 14, padding: 24, width: 320, boxShadow: "0 8px 32px rgba(0,0,0,0.15)", textAlign: "center" }}
        onClick={e => e.stopPropagation()}>
        <div style={{ fontSize: 32, marginBottom: 10 }}>🗑️</div>
        <div style={{ fontWeight: 800, fontSize: 16, color: "#222", marginBottom: 8 }}>Delete Task?</div>
        <div style={{ fontSize: 13, color: "#888", marginBottom: 20 }}>This action cannot be undone.</div>
        <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
          <button onClick={onClose} style={{ padding: "8px 18px", borderRadius: 10, border: "1.5px solid #ddd", background: "#fff", cursor: "pointer", fontWeight: 600, fontSize: 13 }}>Cancel</button>
          <button onClick={onConfirm} style={{ padding: "8px 20px", borderRadius: 10, border: "none", background: "#ff6b6b", color: "#fff", cursor: "pointer", fontWeight: 700, fontSize: 13 }}>Delete</button>
        </div>
      </div>
    </div>
  );
}

// ─── TaskCard ─────────────────────────────────────────────────────────────────

function TaskCard({ task, onEdit, onDelete, onToggleComplete }) {
  const done = task.status === "Completed";
  return (
    <div style={{ ...S.card, opacity: done ? 0.65 : 1, transition: "opacity 0.2s" }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 700, fontSize: 12, color: "#222", marginBottom: 3, textDecoration: done ? "line-through" : "none" }}>
          {task.title}
        </div>
        <div style={{ fontSize: 10, color: "#999", lineHeight: 1.5, marginBottom: 6 }}>{task.desc}</div>
        <div style={{ display: "flex", gap: 8, fontSize: 10, flexWrap: "wrap", marginBottom: 8 }}>
          <span style={{ color: "#aaa" }}>Priority: <b style={{ color: PRIORITY_COLOR[task.priority] }}>{task.priority}</b></span>
          <span style={{ color: "#aaa" }}>Status: <b style={{ color: STATUS_COLOR[task.status] }}>{task.status}</b></span>
          <span style={{ color: "#aaa" }}>Created: {task.date}</span>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          <button onClick={() => onToggleComplete(task.id)} style={S.btn(done ? "#f0f0f0" : "#e8faf3", done ? "#aaa" : "#2ecc71")}>
            {done ? "↩ Undo" : "✓ Complete"}
          </button>
          <button onClick={() => onEdit(task)} style={S.btn("#e8f6fb", "#1ebeea")}>✏ Edit</button>
          <button onClick={() => onDelete(task.id)} style={S.btn("#fff0f0", "#ff6b6b")}>🗑 Delete</button>
        </div>
      </div>
      {task.img && <img src={task.img} alt="" style={{ width: 60, height: 50, borderRadius: 8, objectFit: "cover", flexShrink: 0 }} />}
    </div>
  );
}

// ─── Dashboard (Main) ─────────────────────────────────────────────────────────

export default function Dashboard() {
  const [activeNav, setActiveNav] = useState("Dashboard");
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [showAdd, setShowAdd] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const isMyTasks = activeNav === "My Tasks";
  const activeTasks = tasks.filter(t => t.status !== "Completed");
  const completedTasks = tasks.filter(t => t.status === "Completed");
  const total = tasks.length || 1;
  const pct = (fn) => Math.round((tasks.filter(fn).length / total) * 100);

  const displayedTasks = isMyTasks
    ? [...tasks].sort((a, b) => STATUS_ORDER[a.status] - STATUS_ORDER[b.status])
    : activeTasks;

  const handleAdd = (form) => {
    setTasks(prev => [...prev, { ...form, id: Date.now(), date: new Date().toLocaleDateString("en-GB") }]);
    setShowAdd(false);
  };

  const handleEdit = (form) => {
    setTasks(prev => prev.map(t => t.id === editTask.id ? { ...t, ...form } : t));
    setEditTask(null);
  };

  const handleDelete = () => {
    setTasks(prev => prev.filter(t => t.id !== deleteId));
    setDeleteId(null);
  };

  const handleToggle = (id) => {
    setTasks(prev => prev.map(t =>
      t.id === id ? { ...t, status: t.status === "Completed" ? "Not Started" : "Completed" } : t
    ));
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0c323f", fontFamily: "'Nunito', 'Segoe UI', sans-serif", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap" rel="stylesheet" />

      {/* Modals */}
      {showAdd  && <TaskModal onSave={handleAdd} onClose={() => setShowAdd(false)} />}
      {editTask && <TaskModal task={editTask} onSave={handleEdit} onClose={() => setEditTask(null)} />}
      {deleteId && <ConfirmModal onConfirm={handleDelete} onClose={() => setDeleteId(null)} />}

      <div style={{ width: "100%", maxWidth: 960, background: "#fff", borderRadius: 20, boxShadow: "0 8px 40px rgba(0,0,0,0.2)", display: "flex", overflow: "hidden", minHeight: 580 }}>

        {/* ── Sidebar ── */}
        <div style={{ width: 200, background: "#fff", borderRight: "1.5px solid #f0f0f0", display: "flex", flexDirection: "column", padding: "24px 0" }}>

          {/* Profile */}
          <div style={{ textAlign: "center", padding: "0 16px 24px" }}>
            <img src="https://i.pravatar.cc/64?img=47" alt="avatar"
              style={{ width: 56, height: 56, borderRadius: "50%", border: "3px solid #1ebeea", marginBottom: 8 }} />
            <div style={{ fontWeight: 800, fontSize: 13, color: "#222" }}>Eloize Vridgerton</div>
            <div style={{ fontSize: 10, color: "#aaa", marginTop: 2 }}>eloizevridgerton@gmail.com</div>
          </div>

          {/* Nav */}
          <nav style={{ flex: 1 }}>
            {NAV_ITEMS.map(({ icon, label }) => (
              <div key={label} onClick={() => setActiveNav(label)} style={{
                display: "flex", alignItems: "center", gap: 10, padding: "11px 20px", cursor: "pointer",
                background: activeNav === label ? "#1ebeea" : "transparent",
                color: activeNav === label ? "#fff" : "#888",
                borderRadius: activeNav === label ? "0 20px 20px 0" : 0,
                marginRight: 12, fontWeight: activeNav === label ? 700 : 500, fontSize: 13, transition: "all 0.2s",
              }}>
                <span style={{ fontSize: 15 }}>{icon}</span>{label}
              </div>
            ))}
          </nav>

          {/* Summary */}
          <div style={{ padding: "12px 20px", borderTop: "1px solid #f0f0f0" }}>
            <div style={{ fontSize: 11, color: "#aaa", marginBottom: 6, fontWeight: 700 }}>SUMMARY</div>
            {[["Total", "#555", tasks.length], ["Done", "#2ecc71", completedTasks.length], ["Active", "#1ebeea", activeTasks.length]].map(([label, color, count]) => (
              <div key={label} style={{ fontSize: 12, color, display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span>{label}</span><span style={{ fontWeight: 700 }}>{count}</span>
              </div>
            ))}
          </div>

          <div onClick={() => alert("Logout clicked!")} style={{ padding: "16px 20px", color: "#1ebeea", fontWeight: 700, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>
            ← Logout
          </div>
        </div>

        {/* ── Main Content ── */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>

          {/* Topbar */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 24px", borderBottom: "1.5px solid #f0f0f0" }}>
            <div style={{ fontWeight: 800, fontSize: 22, color: "#1ebeea", letterSpacing: -0.5 }}>heyToday.</div>
           <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ fontSize: 12, color: "#888", textAlign: "right", lineHeight: 1.4 }}>
                <div style={{ fontWeight: 700, color: "#222" }}>{new Date().toLocaleDateString("en-US", { weekday: "long" })}</div>
                <div>{new Date().toLocaleDateString("en-GB")}</div>
              </div>
            </div>
          </div>

          {/* Body */}
          <div style={{ flex: 1, padding: "20px 24px", overflowY: "auto", display: "flex", flexDirection: "column", gap: 16 }}>

            {/* Welcome */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: "#222", margin: 0 }}>Welcome back, Eloize! </h2>
              <div style={{ fontSize: 12, color: "#aaa" }}>
                {isMyTasks ? "All tasks" : `${activeTasks.length} active task${activeTasks.length !== 1 ? "s" : ""}`}
              </div>
            </div>

            {/* Grid: 1 col on My Tasks, 2 col on Dashboard */}
            <div style={{ display: "grid", gridTemplateColumns: isMyTasks ? "1fr" : "1fr 1fr", gap: 16 }}>

              {/* Task List */}
              <div style={S.section}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                  <div style={{ fontWeight: 800, fontSize: 14, color: "#222" }}>📋 {isMyTasks ? "All Tasks" : "To-Do"}</div>
                  <button onClick={() => setShowAdd(true)} style={{ background: "none", border: "1.5px solid #1ebeea", borderRadius: 12, padding: "3px 10px", color: "#1ebeea", fontWeight: 700, fontSize: 11, cursor: "pointer" }}>
                    + Add task
                  </button>
                </div>
                <div style={{ fontSize: 10, color: "#aaa", marginBottom: 12 }}>
                  {new Date().toLocaleDateString("en-US", { day: "numeric", month: "long" })} • {activeTasks.length} active
                </div>

                {displayedTasks.length === 0 ? (
                  <div style={{ textAlign: "center", color: "#ccc", fontSize: 13, padding: "30px 0" }}>
                    🎉 No tasks here!<br /><span style={{ fontSize: 11 }}>Add a task to get started</span>
                  </div>
                ) : (
                  <div style={{ display: "grid", gridTemplateColumns: isMyTasks ? "repeat(auto-fill, minmax(280px, 1fr))" : "1fr", gap: 10, maxHeight: isMyTasks ? 520 : 380, overflowY: "auto" }}>
                    {displayedTasks.map(task => (
                      <TaskCard key={task.id} task={task} onEdit={setEditTask} onDelete={setDeleteId} onToggleComplete={handleToggle} />
                    ))}
                  </div>
                )}
              </div>

              {/* Right Column — Dashboard only */}
              {!isMyTasks && (
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

                  {/* Task Status */}
                  <div style={S.section}>
                    <div style={{ fontWeight: 800, fontSize: 14, color: "#222", marginBottom: 14 }}>📊 Task Status</div>
                    <div style={{ display: "flex", justifyContent: "space-around" }}>
                      <CircleProgress percent={pct(t => t.status === "Completed")} color="#2ecc71" label="Completed" />
                      <CircleProgress percent={pct(t => t.status === "In Progress")} color="#1ebeea" label="In Progress" />
                      <CircleProgress percent={pct(t => t.status === "Not Started")} color="#ff6b6b" label="Not Started" />
                    </div>
                  </div>

                  {/* Completed Tasks */}
                  <div style={{ ...S.section, flex: 1 }}>
                    <div style={{ fontWeight: 800, fontSize: 14, color: "#222", marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
                      ✅ Completed Tasks
                      <span style={{ marginLeft: "auto", background: "#e8faf3", color: "#2ecc71", borderRadius: 10, padding: "2px 8px", fontSize: 11, fontWeight: 700 }}>
                        {completedTasks.length}
                      </span>
                    </div>

                    {completedTasks.length === 0 ? (
                      <div style={{ textAlign: "center", color: "#888", fontSize: 12, padding: "20px 0" }}>No completed tasks yet</div>
                    ) : (
                      <div style={{ display: "flex", flexDirection: "column", gap: 10, maxHeight: 220, overflowY: "auto" }}>
                        {completedTasks.map(task => (
                          <div key={task.id} style={S.card}>
                            <div style={{ flex: 1 }}>
                              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                                <span style={{ color: "#2ecc71" }}>●</span>
                                <span style={{ fontWeight: 700, fontSize: 12, color: "#222", textDecoration: "line-through" }}>{task.title}</span>
                              </div>
                              <div style={{ fontSize: 10, color: "#999", marginBottom: 4 }}>{task.desc}</div>
                              <div style={{ display: "flex", gap: 6 }}>
                                <span style={{ fontSize: 10, color: "#2ecc71", fontWeight: 600 }}>✓ Completed</span>
                                <button onClick={() => handleToggle(task.id)} style={S.btn("#f0f0f0", "#aaa")}>↩ Undo</button>
                                <button onClick={() => setDeleteId(task.id)} style={S.btn("#fff0f0", "#ff6b6b")}>🗑</button>
                              </div>
                            </div>
                            {task.img && <img src={task.img} alt="" style={{ width: 54, height: 44, borderRadius: 8, objectFit: "cover", flexShrink: 0 }} />}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}