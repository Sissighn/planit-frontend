import { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import TaskList from "../tasks/TaskList";
import AddTaskDialog from "../tasks/AddTaskDialog";
import EditTaskDialog from "../tasks/EditTaskDialog";
import Dashboard from "./Dashboard";

const AppContent = forwardRef(function AppContent({ onTasksUpdate }, ref) {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [presetDate, setPresetDate] = useState(null);
  const [showArchive, setShowArchive] = useState(false);
  const [archivedCount, setArchivedCount] = useState(0);

  const baseUrl = "http://localhost:8080/api/tasks";

  const fetchTasks = async (archived = false) => {
    try {
      const url = archived ? `${baseUrl}/archive` : baseUrl;
      const res = await fetch(url);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setTasks(data);
      onTasksUpdate?.(data);
    } catch (_) {}
  };

  const fetchArchivedCount = async () => {
    try {
      const res = await fetch(`${baseUrl}/archive`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setArchivedCount(data.length);
    } catch (_) {}
  };

  useEffect(() => {
    fetchTasks(false);
    fetchArchivedCount();
  }, []);

  useImperativeHandle(ref, () => ({
    openAdd: () => {
      setPresetDate(null);
      setShowAddDialog(true);
    },
    quickAdd: (date) => {
      setPresetDate(date);
      setShowAddDialog(true);
    },
    quickEdit: (task) => {
      setSelectedTask(task);
      setShowEditDialog(true);
    },
    quickDelete: async (id) => {
      await handleDelete(id);
    },
    quickArchive: async (id) => {
      await handleArchive(id);
    },
    showArchiveView: async () => {
      setShowArchive(true);
      await fetchTasks(true);
    },
    showHomeView: async () => {
      setShowArchive(false);
      await fetchTasks(false);
    },
    quickDeleteOne: (task, date) => quickDeleteOne(task, date),
    quickDeleteFuture: (task, date) => quickDeleteFuture(task, date),
    quickDeleteSeries: (id) => quickDeleteSeries(id),
    isArchiveView: () => showArchive,
  }));

  const handleAdd = async (taskData) => {
    try {
      const res = await fetch(baseUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskData),
      });
      if (!res.ok) throw new Error();
      await fetchTasks(showArchive);
      setShowAddDialog(false);
      setPresetDate(null);
    } catch (_) {}
  };

  const handleEdit = async (updatedTask) => {
    try {
      const res = await fetch(`${baseUrl}/${updatedTask.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedTask),
      });
      if (!res.ok) throw new Error();
      await fetchTasks(showArchive);
      setShowEditDialog(false);
      setSelectedTask(null);
    } catch (_) {}
  };

  const handleArchive = async (id) => {
    try {
      const res = await fetch(`${baseUrl}/${id}/archive`, { method: "POST" });
      if (!res.ok) throw new Error();
      await fetchTasks();
      await fetchArchivedCount();
    } catch (_) {}
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`${baseUrl}/${id}`, { method: "DELETE" });
      await fetchTasks(showArchive);
      if (selectedTask?.id === id) setSelectedTask(null);
    } catch (_) {}
  };

  const quickDeleteOne = async (task, date) => {
    try {
      const res = await fetch(`${baseUrl}/${task.id}/exclude-date`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date }),
      });
      if (!res.ok) throw new Error();
      await fetchTasks(showArchive);
    } catch (_) {}
  };

  const quickDeleteFuture = async (task, date) => {
    try {
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() - 1);
      const formatted = endDate.toISOString().split("T")[0];
      const updated = { ...task, repeatUntil: formatted };

      const res = await fetch(`${baseUrl}/${task.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
      if (!res.ok) throw new Error();
      await fetchTasks(showArchive);
    } catch (_) {}
  };

  const quickDeleteSeries = async (id) => {
    try {
      const res = await fetch(`${baseUrl}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      await fetchTasks(showArchive);
    } catch (_) {}
  };

  const handleToggle = async (id) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;

    const today = new Date().toISOString().split("T")[0];

    try {
      if (task.repeatFrequency && task.repeatFrequency !== "NONE") {
        await fetch(`${baseUrl}/${id}/complete/${today}`, { method: "POST" });
        const endpoint = task.done ? "undone" : "done";
        await fetch(`${baseUrl}/${id}/${endpoint}`, { method: "PUT" });
      } else {
        const endpoint = task.done ? "undone" : "done";
        await fetch(`${baseUrl}/${id}/${endpoint}`, { method: "PUT" });
      }
      await fetchTasks(showArchive);
    } catch (_) {}
  };

  const visibleTasks = tasks.filter((t) => !t.archived);

  const stats = !showArchive
    ? {
        dueToday: tasks.filter((t) => {
          if (!t.deadline || t.archived) return false;
          const today = new Date().toISOString().split("T")[0];
          return t.deadline.startsWith(today);
        }).length,
        completedThisWeek: tasks.filter((t) => {
          if (!t.done || t.archived) return false;
          const updated = new Date(t.updatedAt || Date.now());
          const now = new Date();
          const weekAgo = new Date(now.setDate(now.getDate() - 7));
          return updated >= weekAgo;
        }).length,
        archived: archivedCount,
      }
    : null;

  return (
    <div className="text-gray-800">
      <div className="max-w-3xl mx-auto w-full flex flex-col gap-8">
        {stats && <Dashboard stats={stats} />}

        <TaskList
          tasks={visibleTasks}
          onToggle={handleToggle}
          onDelete={handleDelete}
          onArchive={handleArchive}
          onSelect={setSelectedTask}
          selectedTask={selectedTask}
        />
      </div>

      {showAddDialog && (
        <AddTaskDialog
          onAdd={handleAdd}
          onClose={() => setShowAddDialog(false)}
          presetDate={presetDate}
        />
      )}

      {showEditDialog && selectedTask && (
        <EditTaskDialog
          task={selectedTask}
          onEdit={handleEdit}
          onClose={() => setShowEditDialog(false)}
        />
      )}
    </div>
  );
});

export default AppContent;
