import React from "react";
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

  const priorityColor =
    task.priority === "HIGH"
      ? "text-red-400"
      : task.priority === "LOW"
      ? "text-blue-400"
      : task.priority === "MEDIUM"
      ? "text-yellow-400"
      : "text-gray-400";

  const displayDate =
    task.repeatFrequency && task.repeatFrequency !== "NONE"
      ? task.nextOccurrence
      : task.deadline;

  const isDone =
    task.repeatFrequency && task.repeatFrequency !== "NONE" ? false : task.done;

  const openConfirm = (type) => {
    setConfirmMeta({
      type,
      title: type === "delete" ? "Delete Task" : "Archive Task",
      message:
        type === "delete"
          ? "Do you really want to delete this task?"
          : "Do you want to archive this task?",
      confirmLabel: type === "delete" ? "Delete" : "Archive",
      variant: type === "delete" ? "danger" : "primary",
    });
    setConfirmOpen(true);
  };

  return (
    <div
      className={`bg-white/40 backdrop-blur-xl rounded-2xl p-4 mb-4 border border-white/40 
      shadow-md hover:shadow-lg transition-all duration-300 
      ${isDone ? "opacity-80" : ""}`}
    >
      <div className="flex justify-between items-center">
        {/* CLICK TO ACTIVATE TASK */}
        <div
          onClick={() => onSelect(task.id)}
          className="flex-1 cursor-pointer select-none"
        >
          <span
            className={`text-lg font-medium ${
              isDone ? "line-through text-gray-500" : "text-slate-800"
            }`}
          >
            {task.title}
          </span>

          {(task.priority || displayDate) && (
            <span className="ml-2 inline-flex items-center gap-2 text-gray-500 text-sm">
              {task.priority && (
                <span className={priorityColor}>({task.priority})</span>
              )}

              {displayDate && (
                <span className="text-gray-500">
                  {new Date(displayDate).toLocaleDateString("de-DE", {
                    day: "2-digit",
                    month: "short",
                  })}
                </span>
              )}
            </span>
          )}
        </div>

        {/* DONE BUTTON */}
        <button
          onClick={() => onToggle(task.id)}
          className="transition-transform hover:scale-110"
        >
          <span
            className={`material-symbols-outlined text-3xl ${
              isDone ? "text-green-500" : "text-gray-400"
            }`}
          >
            done_outline
          </span>
        </button>
      </div>

      {/* ACTION PANEL */}
      <div
        className={`
    transition-all overflow-hidden
    ${isActive ? "max-h-32 mt-4 opacity-100" : "max-h-0 opacity-0"}
  `}
      >
        <div
          className="
      flex items-center
      bg-white/70 backdrop-blur-xl
      border border-purple-100
      rounded-2xl
      overflow-hidden
      shadow-[0_4px_14px_rgba(0,0,0,0.08)]
    "
        >
          <button
            onClick={() => setEditOpen(true)}
            className="
        flex-1 flex items-center justify-center gap-2
        px-4 py-3
        text-slate-700 hover:text-purple-700
        hover:bg-purple-50/60
        transition-all
      "
          >
            <span className="material-symbols-outlined text-[20px]">edit</span>
            <span className="text-sm font-medium">Edit</span>
          </button>

          <div className="w-px bg-purple-100/60"></div>

          <button
            onClick={() => openConfirm("archive")}
            className="
        flex-1 flex items-center justify-center gap-2
        px-4 py-3
        text-slate-700 hover:text-purple-700
        hover:bg-purple-50/60
        transition-all
      "
          >
            <span className="material-symbols-outlined text-[20px]">
              inventory_2
            </span>
            <span className="text-sm font-medium">Archive</span>
          </button>

          <div className="w-px bg-purple-100/60"></div>

          <button
            onClick={() => openConfirm("delete")}
            className="
        flex-1 flex items-center justify-center gap-2
        px-4 py-3
        text-rose-500 hover:text-rose-700
        hover:bg-rose-50/60
        transition-all
      "
          >
            <span className="material-symbols-outlined text-[20px]">
              delete
            </span>
            <span className="text-sm font-medium">Delete</span>
          </button>
        </div>
      </div>

      {/* DIALOGS */}
      <ConfirmDialog
        open={confirmOpen}
        title={confirmMeta?.title}
        message={confirmMeta?.message}
        confirmLabel={confirmMeta?.confirmLabel}
        variant={confirmMeta?.variant}
        onConfirm={() => {
          if (confirmMeta.type === "delete") onDelete(task.id);
          if (confirmMeta.type === "archive") onArchive(task.id);
          setConfirmOpen(false);
          onSelect(null);
        }}
        onCancel={() => setConfirmOpen(false)}
      />

      {editOpen && (
        <EditTaskDialog
          task={task}
          onEdit={(updated) => {
            onEdit(updated);
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
