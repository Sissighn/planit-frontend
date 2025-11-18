import { useState } from "react";
import ConfirmDialog from "../common/ConfirmDialog";
import EditTaskDialog from "./EditTaskDialog";

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
  const [editOpen, setEditOpen] = useState(false);

  // -----------------------------
  // COLORS
  // -----------------------------
  const priorityColor =
    task.priority === "HIGH"
      ? "text-red-400"
      : task.priority === "LOW"
      ? "text-blue-400"
      : task.priority === "MEDIUM"
      ? "text-yellow-400"
      : "text-gray-400";

  // -----------------------------
  // FRONTEND DISPLAY DATE
  // -----------------------------
  const displayDate = (() => {
    if (task.repeatFrequency && task.repeatFrequency !== "NONE") {
      return task.nextOccurrence || null;
    }
    return task.deadline || null;
  })();

  // -----------------------------
  // CHECK IF TASK IS DONE
  // For one-time tasks: check task.done
  // For recurring tasks: we show nextOccurrence, so it's never "done" in UI
  // -----------------------------
  const isDone =
    task.repeatFrequency && task.repeatFrequency !== "NONE"
      ? false // Recurring tasks are never shown as "done"
      : task.done;

  // -----------------------------
  // CONFIRM DELETE / ARCHIVE
  // -----------------------------
  const openConfirm = (type) => {
    if (type === "delete") {
      setConfirmMeta({
        type: "delete",
        title: "Delete Task",
        message:
          "Do you really want to delete this task? This action cannot be undone.",
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

  // -----------------------------
  // HANDLE TOGGLE (DONE) ✅ VEREINFACHT
  // -----------------------------
  const handleToggle = async () => {
    // Simply call parent's onToggle with the task ID
    // Parent handles all the logic
    onToggle(task.id);
  };

  // -----------------------------
  // RENDER
  // -----------------------------
  return (
    <div
      className={`bg-white/40 backdrop-blur-xl rounded-2xl p-4 mb-4 border border-white/40 
      shadow-md hover:shadow-lg transition-all duration-300 
      ${isDone ? "opacity-80" : ""} ${isActive ? "task-item-active" : ""}`}
    >
      <div className="flex justify-between items-center">
        <div
          onClick={() => onSelect(task.id)}
          className="flex-1 cursor-pointer select-none"
        >
          {/* TITLE */}
          <span
            className={`text-lg font-medium transition-all ${
              isDone ? "line-through text-gray-500" : "text-slate-800"
            }`}
          >
            {task.title}
          </span>

          {/* META INFO */}
          {(task.priority || displayDate) && (
            <span className="ml-2 inline-flex items-center gap-2 text-gray-500 text-sm">
              {/* PRIORITY */}
              {task.priority && (
                <span className={priorityColor}>({task.priority})</span>
              )}

              {/* DATE */}
              {displayDate && (
                <span className="text-gray-500">
                  {new Date(displayDate).toLocaleDateString("de-DE", {
                    day: "2-digit",
                    month: "short",
                  })}
                </span>
              )}

              {/* REPEAT ICON */}
              {task.repeatFrequency && task.repeatFrequency !== "NONE" && (
                <span className="inline-flex items-center gap-1 text-gray-500 text-xs">
                  <span className="material-symbols-outlined text-[15px] leading-none">
                    repeat
                  </span>
                  <span className="capitalize">
                    {task.repeatFrequency.toLowerCase()}
                  </span>
                </span>
              )}
            </span>
          )}
        </div>

        {/* DONE BUTTON */}
        <div className="flex items-center space-x-3">
          <button
            onClick={handleToggle}
            className="transition-transform hover:scale-110"
            title={isDone ? "Mark as undone" : "Mark as done"}
          >
            <span
              className={`material-symbols-outlined text-3xl transition-all duration-300 ${
                isDone ? "text-green-500" : "text-gray-400"
              }`}
            >
              done_outline
            </span>
          </button>
        </div>
      </div>

      {/* ACTION PANEL */}
      <div
        className={`option-panel ${isActive ? "open" : ""} 
                    bg-gradient-to-br from-white/80 to-purple-50/80
                    backdrop-blur-xl border border-white/50 shadow-inner
                    rounded-xl flex justify-around items-center`}
      >
        <button
          onClick={() => setEditOpen(true)}
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

      <ConfirmDialog
        open={confirmOpen}
        title={confirmMeta?.title}
        message={confirmMeta?.message}
        confirmLabel={confirmMeta?.confirmLabel}
        variant={confirmMeta?.variant}
        onConfirm={handleConfirm}
        onCancel={() => setConfirmOpen(false)}
      />

      {editOpen && (
        <EditTaskDialog
          task={task}
          onEdit={(updatedTask) => {
            onEdit(updatedTask);
            onSelect(null);
            setEditOpen(false);
          }}
          onClose={() => {
            setEditOpen(false);
            onSelect(null);
          }}
        />
      )}
    </div>
  );
}
