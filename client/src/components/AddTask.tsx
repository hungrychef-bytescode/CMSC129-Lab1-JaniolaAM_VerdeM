import { useState } from "react";
import API from "../services/api";

interface Props {
  listId: string
  refresh: () => void
}

export default function AddTask({ listId, refresh }: Props) {

  const [task, setTask] = useState("");
  const [priority, setPriority] = useState("Low");
  const [dueDate, setDueDate] = useState("");

  const addTask = async () => {

    if (!task) return;

    await API.post("/tasks", {
      task,
      priority,
      due_date: dueDate,
      list_id: listId
    });

    setTask("");
    setPriority("Low");
    setDueDate("");

    refresh();
  };

  return (

    <div>

      <h3>Add Task</h3>

      <input
        placeholder="Task"
        value={task}
        onChange={(e) => setTask(e.target.value)}
      />

      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
      >
        <option>Low</option>
        <option>Medium</option>
        <option>High</option>
      </select>

      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
      />

      <button onClick={addTask}>
        Add
      </button>

    </div>

  );
}