import { useState } from "react";
import ConfirmDialog from "./ConfirmDialog";

export default function TaskItem({
  task,
  isActive,
  onToggle,
  onDelete,
  onArchive,
  onEdit,
  onSelect,
}) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmMeta, setConfirmMeta] = useState(null);

  const priorityColor =
    task.priority === "HIGH"
      ? "text-red-400"
      : task.priority === "LOW"
      ? "text-blue-400"
      : "text-yellow-400";

  const openConfirm = (type) => {
    if (type === "delete") {
      setConfirmMeta({
        type: "delete",
        title: "Delete Task",
        message: "Do you really want to delete this task? This action cannot be undone.",
        confirmLabel: "Delete",
        variant: "danger",
      });
    } else if (type === "archive") {
      setConfirmMeta({
        type: "archive",
        title: "Archive Task",
        message: "Do you want to archive this task?",
        confirmLabel: "Archive",
        variant: "primary",
      });
    }
    setConfirmOpen(true);
  };

  const handleConfirm = () => {
    if (confirmMeta?.type === "delete") onDelete(task.id);
    if (confirmMeta?.type === "archive") onArchive(task.id);
    setConfirmOpen(false);
    onSelect(null);
  };

  return (
    <div
      className={`bg-white/40 backdrop-blur-xl rounded-2xl p-4 mb-4 border border-white/40 
                  shadow-md hover:shadow-lg transition-all duration-300 
                  ${task.done ? "opacity-80" : ""} ${isActive ? "task-item-active" : ""}`}
    >
      {/* 🔹 Main Task Row */}
      <div className="flex justify-between items-center">
       <div
  onClick={() => onSelect(task.id)}
  className="flex-1 cursor-pointer select-none"
>
  <span
    className={`text-lg font-medium transition-all ${
      task.done ? "line-through text-gray-500" : "text-slate-800"
    }`}
  >
    {task.title}
  </span>{" "}
  {task.priority && (
    <span className={`text-sm ${priorityColor}`}>({task.priority})</span>
  )}
</div>


        <div className="flex items-center space-x-3">
          <button
            onClick={() => onToggle(task.id)}
            className="transition-transform hover:scale-110"
            title={task.done ? "Mark as undone" : "Mark as done"}
          >
            <span
              className={`material-symbols-outlined text-3xl transition-all duration-300 ${
                task.done ? "text-green-500" : "text-gray-400"
              }`}
            >
              done_outline
            </span>
          </button>
        </div>
      </div>

      {/* 🔸 Inline Options Panel */}
      <div
        className={`option-panel ${isActive ? "open" : ""} 
                    bg-gradient-to-br from-white/80 to-purple-50/80
                    backdrop-blur-xl border border-white/50 shadow-inner
                    rounded-xl flex justify-around items-center`}
      >
        <button
          onClick={() => {
            onEdit?.(task);
            onSelect(null);
          }}
          className="flex items-center gap-1 text-slate-700 hover:text-purple-700 transition-all"
        >
          <span className="material-symbols-outlined text-2xl">edit</span>
          <span className="font-medium text-sm">Edit</span>
        </button>

        <button
          onClick={() => openConfirm("archive")}
          className="flex items-center gap-1 text-slate-700 hover:text-purple-700 transition-all"
        >
          <span className="material-symbols-outlined text-2xl">archive</span>
          <span className="font-medium text-sm">Archive</span>
        </button>

        <button
          onClick={() => openConfirm("delete")}
          className="flex items-center gap-1 text-rose-500 hover:text-rose-700 transition-all"
        >
          <span className="material-symbols-outlined text-2xl">delete</span>
          <span className="font-medium text-sm">Delete</span>
        </button>
      </div>

      {/* 🧊 ConfirmDialog */}
      <ConfirmDialog
        open={confirmOpen}
        title={confirmMeta?.title}
        message={confirmMeta?.message}
        confirmLabel={confirmMeta?.confirmLabel}
        variant={confirmMeta?.variant}
        onConfirm={handleConfirm}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
}
