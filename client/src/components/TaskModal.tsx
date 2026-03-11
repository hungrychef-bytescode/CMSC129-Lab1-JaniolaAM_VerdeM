import { useState } from "react";
import { PRIORITIES } from "../constants/taskConstants";

const input: React.CSSProperties = {
  width: "100%",
  padding: "9px 12px",
  borderRadius: 10,
  border: "1.5px solid #2a3441",
  fontSize: 13,
  outline: "none",
  fontFamily: "'DM Sans', sans-serif",
  boxSizing: "border-box",
  background: "#0d1117",
  color: "#e6edf3",
};

interface FormState { task: string; priority: string; due_date: string; }
interface Props { onSave: (data: FormState) => void; onClose: () => void; initial?: FormState; }

export default function TaskModal({ onSave, onClose, initial }: Props) {
  const [form, setForm] = useState<FormState>(initial || { task: "", priority: "Medium", due_date: "" });
  const [error, setError] = useState("");

  const set = (field: keyof FormState, val: string) => {
    setForm(f => ({ ...f, [field]: val }));
    if (field === "task") setError("");
  };

  const handleSave = () => {
    if (!form.task.trim()) { setError("Task name is required."); return; }
    onSave(form);
  };

  return (
    <div style={{
      position: "fixed", inset: 0,
      background: "rgba(0,0,0,0.6)",
      display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100,
    }} onClick={onClose}>
      <div style={{
        background: "#161b22",
        border: "1px solid #2a3441",
        borderRadius: 16, padding: 28, width: 420,
        boxShadow: "0 8px 40px rgba(0,0,0,0.5)",
        display: "flex", flexDirection: "column", gap: 16,
        fontFamily: "'DM Sans', sans-serif",
      }} onClick={e => e.stopPropagation()}>

        <div style={{ fontWeight: 800, fontSize: 17, color: "#e6edf3" }}>
          {initial ? "✏️ Edit Task" : "✦ Add New Task"}
        </div>

        <div>
          <label style={{ fontSize: 12, fontWeight: 700, color: "#7d8fa0", display: "block", marginBottom: 5 }}>Task *</label>
          <input
            style={input}
            value={form.task}
            onChange={e => set("task", e.target.value)}
            placeholder="Task name..."
          />
          {error && <div style={{ color: "#ff6b6b", fontSize: 11, marginTop: 4 }}>{error}</div>}
        </div>

        <div>
          <label style={{ fontSize: 12, fontWeight: 700, color: "#7d8fa0", display: "block", marginBottom: 5 }}>Priority</label>
          <select style={{ ...input, cursor: "pointer" }} value={form.priority} onChange={e => set("priority", e.target.value)}>
            {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>

        <div>
          <label style={{ fontSize: 12, fontWeight: 700, color: "#7d8fa0", display: "block", marginBottom: 5 }}>Due Date</label>
          <input type="date" style={input} value={form.due_date} onChange={e => set("due_date", e.target.value)} />
        </div>

        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 4 }}>
          <button onClick={onClose} style={{
            padding: "8px 18px", borderRadius: 10,
            border: "1.5px solid #2a3441", background: "transparent",
            cursor: "pointer", fontWeight: 600, fontSize: 13,
            color: "#7d8fa0", fontFamily: "'DM Sans', sans-serif",
          }}>Cancel</button>
          <button onClick={handleSave} style={{
            padding: "8px 20px", borderRadius: 10, border: "none",
            background: "#38bdf8", color: "#0d1117",
            cursor: "pointer", fontWeight: 700, fontSize: 13,
            fontFamily: "'DM Sans', sans-serif",
          }}>Save Task</button>
        </div>
      </div>
    </div>
  );
}