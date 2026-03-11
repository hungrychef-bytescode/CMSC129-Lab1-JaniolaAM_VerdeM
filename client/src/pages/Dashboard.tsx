import { useState, useEffect } from "react";
import { api } from "../services/api";
import CircleProgress from "../components/CircleProgress";
import TaskCard from "../components/TaskCard";
import TaskModal from "../components/TaskModal";
import ConfirmModal from "../components/ConfirmModal";

interface List { id: string; name: string; }
interface Task { id: string; task: string; priority: string; status: number; due_date: string; deleted?: boolean }

const priorityColor: Record<string, string> = {
  High: "#ff6b6b", Medium: "#ffd93d", Low: "#6bcb77",
};

export default function Dashboard() {
  const [lists, setLists]               = useState<List[]>([]);
  const [selectedList, setSelectedList] = useState<List | null>(null);
  const [tasks, setTasks]               = useState<Task[]>([]);
  const [showAdd, setShowAdd]           = useState(false);
  const [editTask, setEditTask]         = useState<Task | null>(null);
  const [deleteId, setDeleteId]         = useState<string | null>(null);
  const [hardDeleteId, setHardDeleteId] = useState<string | null>(null); // NEW
  const [newListName, setNewListName]   = useState("");
  const [deleteListId, setDeleteListId] = useState<string | null>(null);
  const [loading, setLoading]           = useState(false);
  const [showDeleted, setShowDeleted]   = useState(false);
  const [sortField, setSortField]       = useState("createdAt");
  const [order, setOrder]               = useState("asc");

  const deletedTasks = tasks.filter(t => t.deleted); // NEW
  const notStarted  = tasks.filter(t => t.status === 0 && !t.deleted);
  const inProgress  = tasks.filter(t => t.status === 1 && !t.deleted);
  const completed   = tasks.filter(t => t.status === 2 && !t.deleted);
  const activeTasks = tasks.filter(t => t.status !== 2 && !t.deleted);
  const total       = tasks.filter(t => !t.deleted).length || 1;
  const pct         = (n: number) => Math.round((n / total) * 100);

  const todayLabel = new Date().toLocaleDateString("en-GB", {
    weekday: "long", day: "2-digit", month: "long", year: "numeric"
  });

  useEffect(() => { api.getLists().then(setLists); }, []);
  useEffect(() => {
    if (!selectedList) return;
    setLoading(true);
    api.getTasks(selectedList.id, sortField, order, true).then(data => {
      setTasks(data);
      setLoading(false);
    });
  }, [selectedList, sortField, order]);

  const refreshTasks = () => {
    if (!selectedList) return;
    api.getTasks(selectedList.id, sortField, order, true).then(setTasks);
  };

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
    await api.softDelete(deleteId);
    setDeleteId(null);
    setShowDeleted(true); // automatically open archived section
    refreshTasks();
  };
  // NEW
  const handleHardDelete = async () => {
    if (!hardDeleteId) return;
    await api.hardDelete(hardDeleteId);
    setHardDeleteId(null);
    refreshTasks();
  };
  const handleRestore = async (id: string) => {
    await api.restoreTask(id);
    refreshTasks();
  };
  const handleStatusChange = async (id: string, status: number) => {
    await api.updateStatus(id, status);
    refreshTasks();
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&family=Nunito:wght@800;900&display=swap');

        * { margin: 0; padding: 0; box-sizing: border-box; }
        html, body, #root { width: 100%; height: 100%; }

        :root {
          --bg: #0d1117;
          --surface: #161b22;
          --surface2: #1c2330;
          --border: #2a3441;
          --teal: #f6ff00;
          --teal-dim: #00c9a720;
          --teal-mid: #00c9a740;
          --coral: #ff6b6b;
          --gold: #ffd93d;
          --green: #6bcb77;
          --text: #e6edf3;
          --muted: #7d8fa0;
          --sidebar-w: 240px;
        }

        .dashboard {
          width: 100vw;
          height: 100vh;
          background: var(--bg);
          font-family: 'DM Sans', sans-serif;
          display: flex;
          overflow: hidden;
          color: var(--text);
        }

        /* ── SIDEBAR ── */
        .sidebar {
          width: var(--sidebar-w);
          background: var(--surface);
          border-right: 1px solid var(--border);
          display: flex;
          flex-direction: column;
          flex-shrink: 0;
          overflow: hidden;
        }

        .sidebar-logo {
          padding: 24px 20px 16px;
          border-bottom: 1px solid var(--border);
        }

        .sidebar-logo h1 {
          font-family: 'Nunito', sans-serif;
          font-size: 20px;
          font-weight: 900;
          color: var(--teal);
          letter-spacing: -0.5px;
        }

        .sidebar-logo p {
          font-size: 11px;
          color: var(--muted);
          margin-top: 2px;
        }

        .sidebar-section-label {
          font-size: 10px;
          font-weight: 700;
          color: var(--muted);
          letter-spacing: 1.2px;
          text-transform: uppercase;
          padding: 18px 20px 8px;
        }

        .list-items {
          flex: 1;
          overflow-y: auto;
          padding: 0 10px;
        }

        .list-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 9px 12px;
          border-radius: 10px;
          cursor: pointer;
          margin-bottom: 3px;
          transition: all 0.15s;
          font-size: 13px;
          font-weight: 500;
          color: var(--muted);
        }

        .list-item:hover { background: var(--surface2); color: var(--text); }
        .list-item.active { background: var(--teal-dim); color: var(--teal); border: 1px solid var(--teal-mid); }

        .list-item-delete {
          opacity: 0;
          background: none;
          border: none;
          color: var(--coral);
          cursor: pointer;
          font-size: 13px;
          padding: 2px 4px;
          border-radius: 4px;
          transition: opacity 0.15s;
        }
        .list-item:hover .list-item-delete { opacity: 1; }

        .new-list-row {
          padding: 12px 10px;
          display: flex;
          gap: 6px;
          border-top: 1px solid var(--border);
        }

        .new-list-input {
          flex: 1;
          background: var(--surface2);
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 7px 10px;
          font-size: 12px;
          color: var(--text);
          outline: none;
          font-family: 'DM Sans', sans-serif;
          transition: border-color 0.15s;
        }
        .new-list-input::placeholder { color: var(--muted); }
        .new-list-input:focus { border-color: var(--teal); }

        .btn-add-list {
          background: var(--teal);
          color: #0d1117;
          border: none;
          border-radius: 8px;
          width: 32px;
          height: 32px;
          font-size: 20px;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: opacity 0.15s, transform 0.1s;
          flex-shrink: 0;
        }
        .btn-add-list:hover { opacity: 0.85; transform: scale(1.05); }

        /* Summary */
        .summary {
          padding: 14px 20px 20px;
          border-top: 1px solid var(--border);
        }
        .summary-row {
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          color: var(--muted);
          margin-bottom: 7px;
        }
        .summary-val { font-weight: 700; color: var(--teal); }

        /* ── MAIN ── */
        .main {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          background: var(--bg);
        }

        .topbar {
          padding: 20px 30px;
          border-bottom: 1px solid var(--border);
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: var(--surface);
        }

        .topbar-date {
          font-size: 12px;
          color: var(--muted);
          font-weight: 400;
        }

        .topbar-title {
          font-family: 'Syne', sans-serif;
          font-size: 20px;
          font-weight: 700;
          color: var(--text);
          margin-top: 2px;
        }

        .active-badge {
          background: var(--teal-dim);
          color: var(--teal);
          border: 1px solid var(--teal-mid);
          font-size: 11px;
          font-weight: 700;
          padding: 4px 12px;
          border-radius: 20px;
        }

        .content {
          flex: 1;
          overflow-y: auto;
          padding: 24px 30px;
        }

        /* Cards */
        .card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 22px;
        }

        .card-title {
          font-family: 'Syne', sans-serif;
          font-size: 15px;
          font-weight: 700;
          color: var(--text);
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .col-right {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        /* Toolbar */
        .toolbar {
          display: flex;
          gap: 8px;
          align-items: center;
          margin-bottom: 14px;
          flex-wrap: wrap;
        }

        .toolbar select {
          background: var(--surface2);
          border: 1px solid var(--border);
          color: var(--text);
          border-radius: 8px;
          padding: 5px 10px;
          font-size: 12px;
          font-family: 'DM Sans', sans-serif;
          outline: none;
          cursor: pointer;
        }

        .toolbar label {
          font-size: 12px;
          color: var(--muted);
          display: flex;
          align-items: center;
          gap: 5px;
          cursor: pointer;
        }

        .btn-add-task {
          background: var(--teal);
          color: #0d1117;
          border: none;
          border-radius: 9px;
          padding: 7px 16px;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          transition: opacity 0.15s, transform 0.1s;
          margin-left: auto;
        }
        .btn-add-task:hover { opacity: 0.85; transform: translateY(-1px); }

        .task-list { max-height: 360px; overflow-y: auto; padding-right: 2px; }
        .task-list::-webkit-scrollbar { width: 4px; }
        .task-list::-webkit-scrollbar-track { background: transparent; }
        .task-list::-webkit-scrollbar-thumb { background: var(--border); border-radius: 4px; }

        .empty-state {
          text-align: center;
          padding: 40px 0;
          color: var(--muted);
          font-size: 13px;
        }
        .empty-state span { font-size: 32px; display: block; margin-bottom: 8px; }

        /* Status circles */
        .circles-row {
          display: flex;
          justify-content: space-around;
          padding: 8px 0;
        }

        /* Empty screen */
        .no-list {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: var(--muted);
          gap: 12px;
        }
        .no-list span { font-size: 52px; }
        .no-list p { font-size: 15px; font-weight: 500; }
        .no-list small { font-size: 12px; opacity: 0.6; }

        /* Scrollbar global */
        .content::-webkit-scrollbar { width: 5px; }
        .content::-webkit-scrollbar-track { background: transparent; }
        .content::-webkit-scrollbar-thumb { background: var(--border); border-radius: 4px; }

        /* NEW - Archived section */
        .archived-section { grid-column: 1 / -1; margin-top: 0; }
        .archived-badge { background: #ff6b6b20; color: #ff6b6b; border: 1px solid #ff6b6b40; font-size: 11px; font-weight: 700; padding: 3px 10px; border-radius: 20px; }
      `}</style>

      {showAdd      && <TaskModal onSave={handleAddTask}   onClose={() => setShowAdd(false)} />}
      {editTask     && <TaskModal initial={editTask} onSave={handleEditTask} onClose={() => setEditTask(null)} />}
      {deleteId     && <ConfirmModal message="Archive this task? This can be restored anytime." confirmLabel="Archive" confirmColor="#f59e0b"  onConfirm={handleDelete} onClose={() => setDeleteId(null)} />}
      {hardDeleteId && <ConfirmModal message="Delete forever? This cannot be undone." onConfirm={handleHardDelete} onClose={() => setHardDeleteId(null)} />}
      {deleteListId && <ConfirmModal message="Delete list?" onConfirm={handleDeleteList} onClose={() => setDeleteListId(null)} />}

      <div className="dashboard">

        {/* ── SIDEBAR ── */}
        <div className="sidebar">
          <div className="sidebar-logo">
            <h1>ִ ࣪𖤐 heyToday!</h1>
            <p>Stay focused, get it done.</p>
          </div>

          <div className="sidebar-section-label">My Lists</div>

          <div className="list-items">
            {lists.map(list => (
              <div
                key={list.id}
                className={`list-item ${selectedList?.id === list.id ? "active" : ""}`}
                onClick={() => setSelectedList(list)}
              >
                <span>📋 {list.name}</span>
                <button
                  className="list-item-delete"
                  onClick={e => { e.stopPropagation(); setDeleteListId(list.id); }}
                >✕</button>
              </div>
            ))}
          </div>

          <div className="new-list-row">
            <input
              className="new-list-input"
              value={newListName}
              onChange={e => setNewListName(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleCreateList()}
              placeholder="New list..."
            />
            <button className="btn-add-list" onClick={handleCreateList}>+</button>
          </div>

          <div className="summary">
            <div className="sidebar-section-label" style={{ padding: "0 0 8px" }}>Summary</div>
            {[["Total", tasks.length], ["Done", completed.length], ["Active", activeTasks.length]].map(([label, val]) => (
              <div key={label as string} className="summary-row">
                <span>{label}</span>
                <span className="summary-val">{val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── MAIN ── */}
        <div className="main">
          <div className="topbar">
            <div>
              <div className="topbar-date">{todayLabel}</div>
              <div className="topbar-title">
                {selectedList ? `📋 ${selectedList.name}` : "Dashboard"}
              </div>
            </div>
            <span className="active-badge">{activeTasks.length} active tasks</span>
          </div>

          <div className="content">
            {selectedList ? (
              <div className="grid-2">

                {/* ── Left: Tasks ── */}
                <div className="card">
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                    <span className="card-title" style={{ margin: 0 }}>Active Tasks</span>
                    <button className="btn-add-task" onClick={() => setShowAdd(true)}>+ Add task</button>
                  </div>

                  <div className="toolbar">
                    <select value={sortField} onChange={e => setSortField(e.target.value)}>
                      <option value="createdAt">Created</option>
                      <option value="priority">Priority</option>
                      <option value="due_date">Due Date</option>
                    </select>
                    <select value={order} onChange={e => setOrder(e.target.value)}>
                      <option value="asc">Ascending</option>
                      <option value="desc">Descending</option>
                    </select>
                    <label style={{
                      display: "flex", alignItems: "center", gap: 6,
                      fontSize: 12, color: showDeleted ? "#38bdf8" : "#7d8fa0",
                      cursor: "pointer", userSelect: "none",
                      background: showDeleted ? "#38bdf820" : "#1c2330",
                      border: `1px solid ${showDeleted ? "#38bdf840" : "#2a3441"}`,
                      padding: "5px 10px", borderRadius: 8,
                      transition: "all 0.15s",
                    }}>
                      <input
                        type="checkbox"
                        checked={showDeleted}
                        onChange={() => setShowDeleted(!showDeleted)}
                        style={{ accentColor: "#38bdf8", cursor: "pointer" }}
                      />
                      Show Archived
                    </label>
                  </div>

                  <div className="task-list">
                    {loading && <div className="empty-state"><span>⏳</span>Loading…</div>}
                    {!loading && activeTasks.length === 0 && (
                      <div className="empty-state"><span>🎉</span>No active tasks!</div>
                    )}
                    {activeTasks.map(t => (
                      <TaskCard key={t.id} task={t} onEdit={setEditTask} onDelete={setDeleteId} onStatusChange={handleStatusChange} onRestore={handleRestore} />
                    ))}
                  </div>
                </div>

                {/* ── Right ── */}
                <div className="col-right">

                  {/* Status */}
                  <div className="card">
                    <div className="card-title">📊 Task Status</div>
                    <div className="circles-row">
                      <CircleProgress percent={pct(completed.length)}  color="#6bcb77" label="Completed" />
                      <CircleProgress percent={pct(inProgress.length)} color="#00c9a7" label="In Progress" />
                      <CircleProgress percent={pct(notStarted.length)} color="#ff6b6b" label="Not Started" />
                    </div>
                  </div>

                  {/* Completed */}
                  <div className="card" style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                      <span className="card-title" style={{ margin: 0 }}>✅ Completed Tasks</span>
                      <span style={{
                        background: "#6bcb7720", color: "#6bcb77",
                        border: "1px solid #6bcb7740",
                        fontSize: 11, fontWeight: 700,
                        padding: "3px 10px", borderRadius: 20
                      }}>{completed.length}</span>
                    </div>
                    <div className="task-list" style={{ maxHeight: 240 }}>
                      {completed.length === 0 ? (
                        <div className="empty-state"><span>📭</span>No completed tasks yet.</div>
                      ) : (
                        completed.map(t => (
                          <TaskCard key={t.id} task={t} onEdit={setEditTask} onDelete={setDeleteId} onRestore={handleRestore} onStatusChange={handleStatusChange} />
                        ))
                      )}
                    </div>
                  </div>
                </div>

                {/*Archived Section*/}
                {showDeleted && (
                  <div className="card archived-section">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                      <span className="card-title" style={{ margin: 0 }}>🗃 Archived Tasks</span>
                      <span className="archived-badge">{deletedTasks.length}</span>
                    </div>
                    <div className="task-list" style={{ maxHeight: 260 }}>
                      {deletedTasks.length === 0
                        ? <div className="empty-state"><span>✨</span>No archived tasks.</div>
                        : deletedTasks.map(t => (
                            <TaskCard
                              key={t.id} task={t}
                              onEdit={setEditTask}
                              onDelete={setDeleteId}
                              onHardDelete={setHardDeleteId}
                              onRestore={handleRestore}
                              onStatusChange={handleStatusChange}
                            />
                          ))
                      }
                    </div>
                  </div>
                )}

              </div>
            ) : (
              <div className="no-list">
                <span>📋</span>
                <p>Select a list to get started</p>
                <small>Or create a new list from the sidebar</small>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}