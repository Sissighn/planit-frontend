import { useState, useEffect } from "react";
import TaskItem from "./TaskItem";

export default function TaskList({
  tasks,
  onToggle,
  onDelete,
  onArchive,
  onEdit,
  selectedTask,
  onSelect,
}) {
  const [activeTaskId, setActiveTaskId] = useState(null);

  // Sync activeTaskId with selectedTask prop
  useEffect(() => {
    setActiveTaskId(selectedTask?.id || null);
  }, [selectedTask]);

  // -----------------------------------------------------
  // KLICK AUSSERHALB SCHLIESST ACTIVE TASK
  // -----------------------------------------------------
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".task-item-container")) {
        setActiveTaskId(null);
        onSelect?.(null);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [onSelect]);

  // -----------------------------------------------------
  // WENN TASK GELÖSCHT/ARCHIVIERT IST → PANEL SCHLIESSEN
  // -----------------------------------------------------
  useEffect(() => {
    if (!tasks.some((t) => t.id === activeTaskId)) {
      setActiveTaskId(null);
      onSelect?.(null);
    }
  }, [tasks, activeTaskId, onSelect]);

  // -----------------------------------------------------
  // RENDER
  // -----------------------------------------------------
  return (
    <div>
      {tasks
        .slice()
        .sort((a, b) => {
          const da =
            a.repeatFrequency && a.repeatFrequency !== "NONE"
              ? a.nextOccurrence
              : a.deadline;

          const db =
            b.repeatFrequency && b.repeatFrequency !== "NONE"
              ? b.nextOccurrence
              : b.deadline;

          if (da == null && db == null) return 0;
          if (da == null) return 1;
          if (db == null) return -1;

          return da.localeCompare(db);
        })
        .map((task) => (
          <div key={task.id} className="task-item-container">
            <TaskItem
              task={task}
              isActive={activeTaskId === task.id}
              onToggle={onToggle}
              onDelete={(id) => {
                onDelete(id);
                setActiveTaskId(null);
                onSelect?.(null);
              }}
              onArchive={(id) => {
                onArchive(id);
                setActiveTaskId(null);
                onSelect?.(null);
              }}
              onEdit={onEdit}
              onSelect={(id) => {
                const newId = activeTaskId === id ? null : id;
                setActiveTaskId(newId);
                onSelect?.(newId);
              }}
            />
          </div>
        ))}
    </div>
  );
}
