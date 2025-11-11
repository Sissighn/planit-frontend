import { useEffect, useState } from "react";
import TaskList from "./TaskList";
import ActionButtons from "./ActionButtons";

export default function AppContent() {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);

  const baseUrl = "http://localhost:8080/api/tasks";

  // 🔹 Beim Start Tasks vom Backend laden
  useEffect(() => {
    fetch(baseUrl)
      .then((res) => res.json())
      .then((data) => setTasks(data))
      .catch((err) => console.error("Fehler beim Laden der Tasks:", err));
  }, []);

  const handleToggle = async (id) => {
    await fetch(`${baseUrl}/${id}/done`, { method: "PUT" });
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  };

  const handleDelete = async (id) => {
    await fetch(`${baseUrl}/${id}`, { method: "DELETE" });
    setTasks((prev) => prev.filter((t) => t.id !== id));
    if (selectedTask?.id === id) setSelectedTask(null);
  };

  return (
    <div className="text-white">
      <TaskList
        tasks={tasks}
        onToggle={handleToggle}
        onDelete={handleDelete}
        onSelect={setSelectedTask} // ⬅️ NEU
        selectedTask={selectedTask}
      />
      <ActionButtons
        onAction={() => {}}
        selectedTask={selectedTask} // ⬅️ NEU
      />
    </div>
  );
}
