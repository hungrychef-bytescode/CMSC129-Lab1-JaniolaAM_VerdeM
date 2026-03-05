import { STATUS_COLOR, STATUS_LABEL, PRIORITY_COLOR } from "../constants/taskConstants";

const btn = (bg: string, color: string) => ({
  padding: "3px 10px",
  borderRadius: 8,
  border: "none",
  cursor: "pointer",
  fontWeight: 700,
  fontSize: 10,
  background: bg,
  color,
} as const);

interface Task {
  id: string;
  task: string;
  priority: string;
  status: number;
  due_date: string;
}

interface Props {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: number) => void;
}

export default function TaskCard({ task, onEdit, onDelete, onStatusChange }: Props) {
  const done = task.status === 2;
  const priorityColor = PRIORITY_COLOR[task.priority as keyof typeof PRIORITY_COLOR] || "#aaa";
  const statusColor = STATUS_COLOR[task.status as keyof typeof STATUS_COLOR] || "#aaa";
  const statusLabel = STATUS_LABEL[task.status as keyof typeof STATUS_LABEL] || "Unknown";

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 12,
        padding: 12,
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        display: "flex",
        gap: 10,
        opacity: done ? 0.65 : 1,
        transition: "opacity 0.2s",
      }}
    >
      <div style={{ flex: 1 }}>
        <div
          style={{
            fontWeight: 700,
            fontSize: 12,
            color: "#222",
            marginBottom: 3,
            textDecoration: done ? "line-through" : "none",
          }}
        >
          {task.task}
        </div>
        <div style={{ display: "flex", gap: 8, fontSize: 10, flexWrap: "wrap", marginBottom: 8 }}>
          <span style={{ color: "#aaa" }}>
            Priority: <b style={{ color: priorityColor }}>{task.priority}</b>
          </span>
          <span style={{ color: "#aaa" }}>
            Status: <b style={{ color: statusColor }}>{statusLabel}</b>
          </span>
          {task.due_date && <span style={{ color: "#aaa" }}>Due: {task.due_date}</span>}
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {task.status < 2 && (
            <button onClick={() => onStatusChange(task.id, task.status + 1)} style={btn("#e8faf3", "#2ecc71")}>
              {task.status === 0 ? "▶ Start" : "✓ Complete"}
            </button>
          )}
          {task.status > 0 && (
            <button onClick={() => onStatusChange(task.id, task.status - 1)} style={btn("#f0f0f0", "#aaa")}>
              ↩ Undo
            </button>
          )}
          <button onClick={() => onEdit(task)} style={btn("#e8f6fb", "#1ebeea")}>
            ✏ Edit
          </button>
          <button onClick={() => onDelete(task.id)} style={btn("#fff0f0", "#ff6b6b")}>
            🗑 Delete
          </button>
        </div>
      </div>
    </div>
  );
}
