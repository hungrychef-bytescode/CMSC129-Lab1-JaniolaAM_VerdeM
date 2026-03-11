const BASE = "http://localhost:5000/api";

async function request(endpoint: string, options: RequestInit = {}) {
  const res = await fetch(`${BASE}${endpoint}`, {
    headers: { "Content-Type": "application/json" },
    ...options
  });

  return res.json();
}

export const api = {

  // Lists
  getLists: () => request("/lists"),

  createList: (name: string) =>
    request("/lists", {
      method: "POST",
      body: JSON.stringify({ name })
    }),

  deleteList: (id: string) =>
    request(`/lists/${id}`, { method: "DELETE" }),

  // Tasks
  getTasks: (listId: string, sortField = "createdAt", order = "asc", showDeleted = false) =>
    request(`/tasks?list_id=${listId}&sort=${sortField}&order=${order}&deleted=${showDeleted}`),
  
  createTask: (data: {
    task: string;
    priority: string;
    due_date: string;
    list_id: string;
  }) =>
    request("/tasks", {
      method: "POST",
      body: JSON.stringify(data)
    }),

  updateStatus: (id: string, status: number) =>
    request(`/tasks/${id}/status`, {
      method: "PUT",
      body: JSON.stringify({ status })
    }),

  updateTask: (id: string, task: string) =>
    request(`/tasks/${id}/task`, {
      method: "PUT",
      body: JSON.stringify({ task })
    }),

  updatePriority: (id: string, priority: string) =>
    request(`/tasks/${id}/priority`, {
      method: "PUT",
      body: JSON.stringify({ priority })
    }),

  updateDueDate: (id: string, due_date: string) =>
    request(`/tasks/${id}/due_date`, {
      method: "PUT",
      body: JSON.stringify({ due_date })
    }),

  softDelete: (id: string) =>
    request(`/tasks/${id}/soft-delete`, { method: "PUT" }),

  hardDelete: (id: string) =>
    request(`/tasks/${id}`, { method: "DELETE" }),

  restoreTask: (id: string) =>
    request(`/tasks/${id}/restore`, { method: "PUT" }),

};