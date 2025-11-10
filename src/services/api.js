// Handles all backend communication
const API_URL = "http://localhost:8080/api/tasks";

export async function getTasks() {
  const res = await fetch(API_URL);
  return await res.json();
}

export async function addTask(task) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(task),
  });
  return await res.json();
}

export async function updateTask(id, updates) {
  await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
}

export async function deleteTask(id) {
  await fetch(`${API_URL}/${id}`, { method: "DELETE" });
}
