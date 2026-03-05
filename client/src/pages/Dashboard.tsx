import { useState, useEffect } from "react";
import { api } from "../services/api";
import { STATUS_COLOR, STATUS_LABEL } from "../constants/taskConstants";
import CircleProgress from "../components/CircleProgress";
import TaskCard from "../components/TaskCard";
import TaskModal from "../components/TaskModal";
import ConfirmModal from "../components/ConfirmModal";

interface List { id: string; name: string; }
interface Task { id: string; task: string; priority: string; status: number; due_date: string; }

// ── tiny style helpers ──────────────────────────────────────────────────────
const pill = (bg: string, color: string): React.CSSProperties => ({
  background: bg, color, fontSize: 11, fontWeight: 700,
  padding: "2px 9px", borderRadius: 20, display: "inline-block",
});

const navBtn = (active: boolean): React.CSSProperties => ({
  display: "flex", alignItems: "center", gap: 10,
  width: "100%", padding: "10px 14px", borderRadius: 10,
  background: active ? "#1ebeea" : "transparent",
  color: active ? "#fff" : "#555",
  fontWeight: active ? 700 : 500, fontSize: 13,
  border: "none", cursor: "pointer", marginBottom: 4,
  transition: "background 0.18s, color 0.18s",
  textAlign: "left",
});

// ── component ───────────────────────────────────────────────────────────────
export default function Dashboard() {
  const [activeNav, setActiveNav]       = useState("Dashboard");
  const [lists, setLists]               = useState<List[]>([]);
  const [selectedList, setSelectedList] = useState<List | null>(null);
  const [tasks, setTasks]               = useState<Task[]>([]);
  const [showAdd, setShowAdd]           = useState(false);
  const [editTask, setEditTask]         = useState<Task | null>(null);
  const [deleteId, setDeleteId]         = useState<string | null>(null);
  const [newListName, setNewListName]   = useState("");
  const [deleteListId, setDeleteListId] = useState<string | null>(null);
  const [loading, setLoading]           = useState(false);

  // mock user – replace with your auth context / Firebase user
  const user = { name: "Eloize", email: "eloize@gmail.com", avatar: "https://i.pravatar.cc/80?img=47" };

  const notStarted  = tasks.filter(t => t.status === 0);
  const inProgress  = tasks.filter(t => t.status === 1);
  const completed   = tasks.filter(t => t.status === 2);
  const activeTasks = tasks.filter(t => t.status !== 2);
  const total       = tasks.length || 1;
  const pct         = (n: number) => Math.round((n / total) * 100);

  const todayLabel = new Date().toLocaleDateString("en-GB", { weekday: "long", day: "2-digit", month: "2-digit", year: "numeric" });

  useEffect(() => { api.getLists().then(setLists); }, []);
  useEffect(() => {
    if (!selectedList) return;
    setLoading(true);
    api.getTasks(selectedList.id).then(data => { setTasks(data); setLoading(false); });
  }, [selectedList]);

  const refreshTasks = () => selectedList && api.getTasks(selectedList.id).then(setTasks);

  const handleCreateList = async () => {
    if (!newListName.trim()) return;
    await api.createList(newListName.trim());
    setNewListName("");
    api.getLists().then(setLists);
  };
  const handleDeleteList = async () => {
    if (!deleteListId) return;
    await api.deleteList(deleteListId);
    if (selectedList?.id === deleteListId) { setSelectedList(null); setTasks([]); }
    setDeleteListId(null);
    api.getLists().then(setLists);
  };
  const handleAddTask = async (form: { task: string; priority: string; due_date: string }) => {
    if (!selectedList) return;
    await api.createTask({ ...form, list_id: selectedList.id });
    setShowAdd(false);
    refreshTasks();
  };
  const handleEditTask = async (form: { task: string; priority: string; due_date: string }) => {
    if (!editTask) return;
    await api.updateTask(editTask.id, form.task);
    await api.updatePriority(editTask.id, form.priority);
    await api.updateDueDate(editTask.id, form.due_date);
    setEditTask(null);
    refreshTasks();
  };
  const handleDelete = async () => {
    if (!deleteId) return;
    await api.hardDelete(deleteId);
    setDeleteId(null);
    refreshTasks();
  };
  const handleStatusChange = async (id: string, status: number) => {
    await api.updateStatus(id, status);
    refreshTasks();
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg,#cff4fc 0%,#e8f5e9 100%)",
      fontFamily: "'Nunito', sans-serif",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 24,
    }}>
      {/* ── Modals ── */}
      {showAdd     && <TaskModal onSave={handleAddTask}   onClose={() => setShowAdd(false)} />}
      {editTask    && <TaskModal initial={editTask} onSave={handleEditTask} onClose={() => setEditTask(null)} />}
      {deleteId    && <ConfirmModal message="Delete task?"  onConfirm={handleDelete}     onClose={() => setDeleteId(null)} />}
      {deleteListId && <ConfirmModal message="Delete list?" onConfirm={handleDeleteList} onClose={() => setDeleteListId(null)} />}

      <div style={{
        width: "100%", maxWidth: 1020,
        background: "#fff", borderRadius: 22,
        display: "flex", overflow: "hidden",
        minHeight: 620,
        boxShadow: "0 12px 48px rgba(0,0,0,0.13)",
      }}>

        {/* ══ SIDEBAR ═════════════════════════════════════════════════════ */}
        <div style={{
          width: 230, borderRight: "1.5px solid #f0f0f0",
          display: "flex", flexDirection: "column",
          padding: "28px 0", flexShrink: 0,
        }}>
          {/* Profile */}
          <div style={{ textAlign: "center", padding: "0 16px 24px", borderBottom: "1px solid #f4f4f4" }}>
            <img src={user.avatar} alt="avatar" style={{
              width: 64, height: 64, borderRadius: "50%",
              objectFit: "cover", border: "3px solid #1ebeea", marginBottom: 10,
            }} />
            <p style={{ fontWeight: 800, fontSize: 13, color: "#111", margin: "0 0 2px" }}>{user.name}</p>
            <p style={{ fontSize: 11, color: "#aaa", margin: 0 }}>{user.email}</p>
          </div>

          {/* Lists */}
          <div style={{ flex: 1, padding: "18px 14px 0" }}>
            <div style={{ fontSize: 11, color: "#bbb", fontWeight: 700, marginBottom: 10, letterSpacing: 0.8 }}>MY LISTS</div>
            {lists.map(list => (
              <div key={list.id} onClick={() => setSelectedList(list)} style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "9px 10px", borderRadius: 10, cursor: "pointer", marginBottom: 4,
                background: selectedList?.id === list.id ? "#e8f9fd" : "transparent",
                color: selectedList?.id === list.id ? "#1ebeea" : "#555",
                fontWeight: selectedList?.id === list.id ? 700 : 500, fontSize: 13,
                transition: "background 0.15s",
              }}>
                <span>📋 {list.name}</span>
                <span onClick={e => { e.stopPropagation(); setDeleteListId(list.id); }}
                  style={{ opacity: 0.4, fontSize: 14, cursor: "pointer" }}>🗑</span>
              </div>
            ))}
            <div style={{ marginTop: 10, display: "flex", gap: 6 }}>
              <input
                value={newListName} onChange={e => setNewListName(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleCreateList()}
                placeholder="New list..."
                style={{ flex: 1, padding: "6px 8px", borderRadius: 7, border: "1.5px solid #b3a7a7", fontSize: 12, outline: "none" }}
              />
              <button onClick={handleCreateList} style={{
                background: "#1ebeea", color: "#fff", border: "none",
                borderRadius: 7, padding: "0 12px", cursor: "pointer", fontSize: 18, fontWeight: 700,
              }}>+</button>
            </div>
          </div>

          {/* Summary */}
          <div style={{ padding: "16px 18px 0", borderTop: "1px solid #f4f4f4", marginTop: 16 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: "#bbb", letterSpacing: 0.8, marginBottom: 10 }}>SUMMARY</p>
            {[["Total", tasks.length], ["Done", completed.length], ["Active", activeTasks.length]].map(([label, val]) => (
              <div key={label as string} style={{
                display: "flex", justifyContent: "space-between",
                fontSize: 13, color: "#444", marginBottom: 6,
              }}>
                <span>{label}</span>
                <span style={{ fontWeight: 700, color: "#1ebeea" }}>{val}</span>
              </div>
            ))}
          </div>

          <div style={{ padding: "14px 14px 0" }}>
            <button style={{
              width: "100%", padding: "8px", borderRadius: 9,
              background: "transparent", border: "1.5px solid #eee",
              color: "#999", fontSize: 13, cursor: "pointer", fontWeight: 600,
            }}>← Logout</button>
          </div>
        </div>

        {/* ══ MAIN ════════════════════════════════════════════════════════ */}
        <div style={{ flex: 1, padding: "28px 30px", overflowY: "auto", background: "#fafcfe" }}>

          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
            <div>
              <p style={{ fontSize: 11, color: "#bbb", margin: "0 0 3px" }}>{todayLabel}</p>
              <h2 style={{ fontSize: 22, fontWeight: 900, color: "#111", margin: 0 }}>
                Welcome back, {user.name}!
              </h2>
            </div>
            <span style={pill("#dff6fb", "#0e9dba")}>{activeTasks.length} active tasks</span>
          </div>

          {selectedList ? (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>

              {/* ── To-Do Column ── */}
              <div style={{ background: "#fff", borderRadius: 16, padding: 20, boxShadow: "0 1px 8px rgba(0,0,0,0.06)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span>📋</span>
                    <span style={{ fontWeight: 800, fontSize: 15, color: "#111" }}>{selectedList.name}</span>
                  </div>
                  <button onClick={() => setShowAdd(true)} style={{
                    background: "#1ebeea", color: "#fff", border: "none",
                    borderRadius: 8, padding: "5px 13px", fontSize: 12,
                    fontWeight: 700, cursor: "pointer",
                  }}>+ Add task</button>
                </div>
                <p style={{ fontSize: 11, color: "#bbb", marginBottom: 14 }}>
                  {new Date().toLocaleDateString("en-GB", { month: "long", day: "numeric" })} • {activeTasks.length} active
                </p>

                <div style={{ maxHeight: 380, overflowY: "auto", paddingRight: 4 }}>
                  {loading && <p style={{ color: "#bbb", fontSize: 13, textAlign: "center" }}>Loading…</p>}
                  {!loading && activeTasks.length === 0 && (
                    <p style={{ color: "#ccc", fontSize: 13, textAlign: "center", paddingTop: 24 }}>No active tasks 🎉</p>
                  )}
                  {activeTasks.map(t => (
                    <TaskCard key={t.id} task={t} onEdit={setEditTask} onDelete={setDeleteId} onStatusChange={handleStatusChange} />
                  ))}
                </div>
              </div>

              {/* ── Right Column ── */}
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

                {/* Task Status */}
                <div style={{ background: "#fff", borderRadius: 16, padding: 20, boxShadow: "0 1px 8px rgba(0,0,0,0.06)" }}>
                  <p style={{ fontWeight: 800, fontSize: 15, color: "#111", marginBottom: 18 }}>📊 Task Status</p>
                  <div style={{ display: "flex", justifyContent: "space-around" }}>
                    <CircleProgress percent={pct(completed.length)}  color="#22c55e" label="Completed"   />
                    <CircleProgress percent={pct(inProgress.length)} color="#1ebeea" label="In Progress" />
                    <CircleProgress percent={pct(notStarted.length)} color="#f87171" label="Not Started" />
                  </div>
                </div>

                {/* Completed Tasks */}
                <div style={{ background: "#fff", borderRadius: 16, padding: 20, boxShadow: "0 1px 8px rgba(0,0,0,0.06)", flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                    <p style={{ fontWeight: 800, fontSize: 15, color: "#111", margin: 0 }}>✅ Completed Tasks</p>
                    <span style={pill("#f0fdf4", "#16a34a")}>{completed.length}</span>
                  </div>
                  <div style={{ maxHeight: 260, overflowY: "auto" }}>
                    {completed.length === 0 ? (
                      <p style={{ color: "#ccc", fontSize: 13, textAlign: "center", paddingTop: 20 }}>No completed tasks yet.</p>
                    ) : (
                      completed.map(t => (
                        <TaskCard key={t.id} task={t} onEdit={setEditTask} onDelete={setDeleteId} onStatusChange={handleStatusChange} />
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* No list selected */
            <div style={{
              height: "calc(100% - 80px)", display: "flex",
              flexDirection: "column", alignItems: "center", justifyContent: "center",
              color: "#ccc", gap: 10,
            }}>
              <span style={{ fontSize: 48 }}>📋</span>
              <p style={{ fontSize: 15, fontWeight: 600 }}>Select a list to get started</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
