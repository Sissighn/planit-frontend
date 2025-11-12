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

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".task-item-container")) {
        setActiveTaskId(null);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div>
      {tasks.map((task) => (
        <div key={task.id} className="task-item-container">
          <TaskItem
            task={task}
            onToggle={onToggle}
            onDelete={onDelete}
            onArchive={onArchive}
            onEdit={onEdit}
            onSelect={(id) =>
              setActiveTaskId((prev) => (prev === id ? null : id))
            }
            isActive={activeTaskId === task.id}
          />
        </div>
      ))}
    </div>
  );
}
