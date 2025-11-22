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

  const safeTasks = Array.isArray(tasks) ? tasks : [];

  useEffect(() => {
    setActiveTaskId(selectedTask ?? null);
  }, [selectedTask]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".task-item-container")) {
        setActiveTaskId(null);
        onSelect?.(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onSelect]);

  useEffect(() => {
    if (!safeTasks.some((t) => t.id === activeTaskId)) {
      setActiveTaskId(null);
      onSelect?.(null);
    }
  }, [safeTasks, activeTaskId, onSelect]);

  return (
    <div>
      {safeTasks
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

          if (!da && !db) return 0;
          if (!da) return 1;
          if (!db) return -1;

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
