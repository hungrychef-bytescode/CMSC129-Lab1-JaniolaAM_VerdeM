import { useEffect, useState } from "react";
import API from "../services/api";

interface Task {
  id: string
  task: string
  priority: string
  due_date: string
  status: number
  deleted?: boolean
}

interface Props {
  listId: string
}

export default function TaskList({ listId }: Props) {

  const [tasks, setTasks] = useState<Task[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");

  const [sortField, setSortField] = useState("createdAt");
  const [order, setOrder] = useState("asc");

  const [showDeleted, setShowDeleted] = useState(false);

  const fetchTasks = async () => {

    const res = await API.get(
      `/tasks?list_id=${listId}&sort=${sortField}&order=${order}&deleted=${showDeleted}`
    );

    setTasks(res.data);
  };

  useEffect(() => {
    if (listId) fetchTasks();
  }, [listId, sortField, order, showDeleted]);



  const toggleStatus = async (id: string, status: number) => {

    const newStatus = status === 1 ? 0 : 1;

    await API.put(`/tasks/${id}/status`, {
      status: newStatus
    });

    fetchTasks();
  };



  const updateTask = async (id: string) => {

    await API.put(`/tasks/${id}/task`, {
      task: editText
    });

    setEditingId(null);
    fetchTasks();
  };



  const deleteTask = async (id: string) => {

    await API.put(`/tasks/${id}/soft-delete`);
    fetchTasks();
  };



  const hardDeleteTask = async (id: string) => {

    if (!confirm("This will permanently delete the task")) return;

    await API.delete(`/tasks/${id}`);

    fetchTasks();
  };



  const restoreTask = async (id: string) => {

    await API.put(`/tasks/${id}/restore`);
    fetchTasks();
  };



  return (

    <div>

      <h3>Tasks</h3>

      <div>

        <label>Sort:</label>

        <select onChange={(e) => setSortField(e.target.value)}>
          <option value="createdAt">Created</option>
          <option value="priority">Priority</option>
          <option value="due_date">Due Date</option>
        </select>

        <select onChange={(e) => setOrder(e.target.value)}>
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>

        <label style={{ marginLeft: "10px" }}>
          <input
            type="checkbox"
            checked={showDeleted}
            onChange={() => setShowDeleted(!showDeleted)}
          />
          Show Deleted
        </label>

      </div>



      {tasks.map(task => (

        <div key={task.id}>

          <input
            type="checkbox"
            checked={task.status === 1}
            onChange={() => toggleStatus(task.id, task.status)}
          />



          {editingId === task.id ? (

            <>

              <input
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
              />

              <button onClick={() => updateTask(task.id)}>
                Save
              </button>

            </>

          ) : (

            <>

              <b
                style={{
                  textDecoration:
                    task.status === 1 ? "line-through" : "none"
                }}
              >
                {task.task}
              </b>

              <button
                onClick={() => {
                  setEditingId(task.id);
                  setEditText(task.task);
                }}
              >
                Edit
              </button>

            </>

          )}



          <p>Priority: {task.priority}</p>
          <p>Due: {task.due_date}</p>



          {!task.deleted ? (

            <button onClick={() => deleteTask(task.id)}>
              Soft Delete
            </button>

          ) : (

            <>

              <button onClick={() => restoreTask(task.id)}>
                Restore
              </button>

              <button
                style={{ marginLeft: "10px", color: "red" }}
                onClick={() => hardDeleteTask(task.id)}
              >
                Hard Delete
              </button>

            </>

          )}

          <hr />

        </div>

      ))}

    </div>

  );

}