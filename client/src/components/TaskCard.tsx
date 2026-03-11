import { STATUS_COLOR, STATUS_LABEL, PRIORITY_COLOR } from "../constants/taskConstants";

const btn = (bg: string, color: string) => ({
  padding: "4px 11px",
  borderRadius: 8,
  border: "none",
  cursor: "pointer",
  fontWeight: 700,
  fontSize: 10,
  background: bg,
  color,
  fontFamily: "'DM Sans', sans-serif",
} as const);

interface Task {
  id: string;
  task: string;
  priority: string;
  status: number;
  due_date: string;
  deleted?: boolean;
}

interface Props {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onHardDelete?: (id: string) => void;
  onRestore?: (id: string) => void;
  onStatusChange: (id: string, status: number) => void;
}

export default function TaskCard({ task, onEdit, onDelete, onHardDelete, onRestore, onStatusChange }: Props) {
  const done = task.status === 2;
  const priorityColor = PRIORITY_COLOR[task.priority as keyof typeof PRIORITY_COLOR] || "#7d8fa0";
  const statusColor = STATUS_COLOR[task.status as keyof typeof STATUS_COLOR] || "#7d8fa0";
  const statusLabel = STATUS_LABEL[task.status as keyof typeof STATUS_LABEL] || "Unknown";

  // ── Archived task card ──
  if (task.deleted) {
    return (
      <div style={{
        background: "#1a1a2e",
        border: "1px solid #ff6b6b30",
        borderRadius: 12,
        padding: "12px 14px",
        marginBottom: 8,
        fontFamily: "'DM Sans', sans-serif",
        opacity: 0.8,
      }}>
        <div style={{ fontWeight: 600, fontSize: 13, color: "#7d8fa0", marginBottom: 5, textDecoration: "line-through" }}>
          {task.task}
        </div>
        <div style={{ display: "flex", gap: 10, fontSize: 11, flexWrap: "wrap", marginBottom: 9, color: "#7d8fa0" }}>
          <span>Priority: <b style={{ color: priorityColor }}>{task.priority}</b></span>
          {task.due_date && <span>Due: {task.due_date}</span>}
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          <button onClick={() => onRestore?.(task.id)} style={btn("#0d3d2a", "#6bcb77")}>
            ↩ Restore
          </button>
          <button onClick={() => onHardDelete?.(task.id)} style={btn("#3d0d0d", "#ff6b6b")}>
            🗑 Delete Forever
          </button>
        </div>
      </div>
    );
  }

  // ── Normal task card ──
  return (
    <div style={{
      background: "#1c2330",
      border: "1px solid #2a3441",
      borderRadius: 12,
      padding: "12px 14px",
      marginBottom: 8,
      opacity: done ? 0.7 : 1,
      transition: "opacity 0.2s",
      fontFamily: "'DM Sans', sans-serif",
    }}>
      <div style={{ fontWeight: 600, fontSize: 13, color: "#e6edf3", marginBottom: 5, textDecoration: done ? "line-through" : "none" }}>
        {task.task}
      </div>
      <div style={{ display: "flex", gap: 10, fontSize: 11, flexWrap: "wrap", marginBottom: 9, color: "#7d8fa0" }}>
        <span>Priority: <b style={{ color: priorityColor }}>{task.priority}</b></span>
        <span>Status: <b style={{ color: statusColor }}>{statusLabel}</b></span>
        {task.due_date && <span>Due: {task.due_date}</span>}
      </div>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {task.status < 2 && (
          <button onClick={() => onStatusChange(task.id, task.status + 1)} style={btn("#0d3d2a", "#6bcb77")}>
            {task.status === 0 ? "▶ Start" : "✓ Complete"}
          </button>
        )}
        {task.status > 0 && (
          <button onClick={() => onStatusChange(task.id, task.status - 1)} style={btn("#2a3441", "#7d8fa0")}>
            ↩ Undo
          </button>
        )}
        <button onClick={() => onEdit(task)} style={btn("#0d2a3d", "#38bdf8")}>
          ✏ Edit
        </button>
        <button onClick={() => onDelete(task.id)} style={btn("#3d1515", "#ff6b6b")}>
          🗃 Archive
        </button>
      </div>
    </div>
  );
}