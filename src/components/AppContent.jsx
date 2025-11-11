import { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import TaskList from "./TaskList";
import ActionButtons from "./ActionButtons";
import AddTaskDialog from "./AddTaskDialog";

const AppContent = forwardRef(function AppContent(_, ref) {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showArchive, setShowArchive] = useState(false);

  const baseUrl = "http://localhost:8080/api/tasks";

  const fetchTasks = async (archived = false) => {
    try {
      const url = archived ? `${baseUrl}/archive` : baseUrl;
      const res = await fetch(url);
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

  useImperativeHandle(ref, () => ({
    openAdd: () => setShowAddDialog(true),
    showArchiveView: async () => {
      setShowArchive(true);
      await fetchTasks(true);
    },
    showHomeView: async () => {
      setShowArchive(false);
      await fetchTasks(false);
    },
    isArchiveView: () => showArchive,
  }));

  const handleAdd = async (taskData) => {
    try {
      const response = await fetch(baseUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskData),
      });
      if (!response.ok) throw new Error(`Backend error ${response.status}`);
      await fetchTasks(showArchive);
      setShowAddDialog(false);
    } catch (err) {
      console.error("❌ Fehler beim Hinzufügen:", err);
      alert("Fehler beim Hinzufügen der Aufgabe.");
    }
  };

  const handleToggle = async (id) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    const endpoint = task.done ? "undone" : "done";
    await fetch(`${baseUrl}/${id}/${endpoint}`, { method: "PUT" });
    await fetchTasks(showArchive);
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`${baseUrl}/${id}`, { method: "DELETE" });
      await fetchTasks(showArchive);
      if (selectedTask?.id === id) setSelectedTask(null);
    } catch (err) {
      console.error("❌ Fehler beim Löschen:", err);
    }
  };

  return (
    <div className="text-gray-800">
      <TaskList
        tasks={tasks}
        onToggle={handleToggle}
        onDelete={handleDelete}
        onSelect={setSelectedTask}
        selectedTask={selectedTask}
      />
      <ActionButtons onAction={() => fetchTasks(showArchive)} selectedTask={selectedTask} />

      {showAddDialog && (
        <AddTaskDialog onAdd={handleAdd} onClose={() => setShowAddDialog(false)} />
      )}
    </div>
  );
});

export default AppContent;
