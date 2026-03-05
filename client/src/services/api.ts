const BASE = "http://localhost:5000/api";

export const api = {
  // Lists
  getLists: () => fetch(`${BASE}/lists`).then(r => r.json()),
  createList: (name: string) => fetch(`${BASE}/lists`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name })
  }).then(r => r.json()),
  deleteList: (id: string) => fetch(`${BASE}/lists/${id}`, { method: "DELETE" }).then(r => r.json()),

  // Tasks
  getTasks: (listId: string) => fetch(`${BASE}/tasks?list_id=${listId}`).then(r => r.json()),
  createTask: (data: { task: string; priority: string; due_date: string; list_id: string }) =>
    fetch(`${BASE}/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    }).then(r => r.json()),
  updateStatus: (id: string, status: number) => fetch(`${BASE}/tasks/${id}/status`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status })
  }).then(r => r.json()),
  updateTask: (id: string, task: string) => fetch(`${BASE}/tasks/${id}/task`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ task })
  }).then(r => r.json()),
  updatePriority: (id: string, priority: string) => fetch(`${BASE}/tasks/${id}/priority`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ priority })
  }).then(r => r.json()),
  updateDueDate: (id: string, due_date: string) => fetch(`${BASE}/tasks/${id}/due_date`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ due_date })
  }).then(r => r.json()),
  softDelete: (id: string) => fetch(`${BASE}/tasks/${id}/soft-delete`, { method: "PUT" }).then(r => r.json()),
  hardDelete: (id: string) => fetch(`${BASE}/tasks/${id}`, { method: "DELETE" }).then(r => r.json()),
  restoreTask: (id: string) => fetch(`${BASE}/tasks/${id}/restore`, { method: "PUT" }).then(r => r.json()),
};