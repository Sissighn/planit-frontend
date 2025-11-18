import { useState, useEffect } from "react";
import TaskItem from "./TaskItem";

export default function TaskList({
  tasks,
  onToggle,
  onDelete,
  onArchive,
  onEdit,
}) {
  const [activeTaskId, setActiveTaskId] = useState(null);

  // -----------------------------------------------------
  // KLICK AUSSERHALB SCHLIESST ACTIVE TASK
  // -----------------------------------------------------
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".task-item-container")) {
        setActiveTaskId(null);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // -----------------------------------------------------
  // WENN TASK GELÖSCHT/ARCHIVIERT IST → PANEL SCHLIEßEN
  // -----------------------------------------------------
  useEffect(() => {
    if (!tasks.some((t) => t.id === activeTaskId)) {
      setActiveTaskId(null);
    }
  }, [tasks]);

  // -----------------------------------------------------
  // RENDER
  // -----------------------------------------------------
  return (
    <div>
      {tasks.map((task) => (
        <div key={task.id} className="task-item-container">
          <TaskItem
            task={task}
            isActive={activeTaskId === task.id}
            onToggle={onToggle}
            onDelete={(id) => {
              onDelete(id);
              setActiveTaskId(null);
            }}
            onArchive={(id) => {
              onArchive(id);
              setActiveTaskId(null);
            }}
            onEdit={onEdit}
            onSelect={(id) =>
              setActiveTaskId((prev) => (prev === id ? null : id))
            }
          />
        </div>
      ))}
    </div>
  );
}
