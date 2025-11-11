import { useEffect, useState } from "react";
import TaskList from "./TaskList";
import ActionButtons from "./ActionButtons";

export default function AppContent() {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);

  const baseUrl = "http://localhost:8080/api/tasks";

  const fetchTasks = async () => {
    try {
      const res = await fetch(baseUrl);
      if (!res.ok) throw new Error("Fehler beim Laden der Tasks");
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      console.error("❌ Fehler beim Laden der Tasks:", err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

 const handleToggle = async (id) => {
  const task = tasks.find((t) => t.id === id);
  if (!task) return;

  const endpoint = task.done ? "undone" : "done";

  await fetch(`${baseUrl}/${id}/${endpoint}`, { method: "PUT" });
  await fetchTasks(); 
};


  // 🔹 Task löschen
  const handleDelete = async (id) => {
    try {
      await fetch(`${baseUrl}/${id}`, { method: "DELETE" });
      await fetchTasks(); // nach Löschung neu laden
      if (selectedTask?.id === id) setSelectedTask(null);
    } catch (err) {
      console.error("❌ Fehler beim Löschen:", err);
    }
  };

  return (
    <div className="text-gray-800"> {/* Textfarbe angepasst für helles UI */}
      <TaskList
        tasks={tasks}
        onToggle={handleToggle}
        onDelete={handleDelete}
        onSelect={setSelectedTask}
        selectedTask={selectedTask}
      />
      <ActionButtons
        onAction={fetchTasks}        // ✅ ruft jetzt Liste neu ab
        selectedTask={selectedTask}
      />
    </div>
  );
}
