import { useState } from "react";

export default function AddTaskDialog({ onAdd, onClose }) {
  const [title, setTitle] = useState("");
  const [deadline, setDeadline] = useState("");
  const [priority, setPriority] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return alert("Please enter a task title.");
    onAdd({ title, deadline: deadline || null, priority: priority || null });
    onClose();
  };

  return (
    <div
      className="absolute inset-0 z-[50] flex items-center justify-center 
             bg-purple-200/20 backdrop-blur-md transition-opacity duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      <form
        onSubmit={handleSubmit}
        className="bg-gradient-to-br from-purple-50 to-white/90 backdrop-blur-xl 
                   border border-purple-200/50 rounded-2xl shadow-lg p-6 w-96 space-y-5
                   transition-all duration-300"
      >
        {/* Header */}
        <h2 className="text-2xl font-semibold text-purple-700 text-center mb-2">
          New Task
        </h2>

        {/* Input: Title */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-purple-800/80">
            Title
          </label>
          <input
            type="text"
            placeholder="Enter task title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-purple-200 
                       bg-white/80 focus:outline-none focus:ring-2 focus:ring-purple-300/70 
                       text-gray-800 placeholder-gray-400 transition-all"
          />
        </div>

        {/* Input: Deadline */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-purple-800/80">
            Deadline
          </label>
          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-purple-200 
                       bg-white/80 focus:outline-none focus:ring-2 focus:ring-purple-300/70 
                       text-gray-800 transition-all"
          />
        </div>

        {/* Select: Priority */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-purple-800/80">
            Priority
          </label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-purple-200 
                       bg-white/80 focus:outline-none focus:ring-2 focus:ring-purple-300/70 
                       text-gray-800 transition-all"
          >
            <option value="">No priority</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-purple-200/60 text-purple-800 
                       hover:bg-purple-300/80 hover:shadow-md transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-purple-500/80 text-white 
                       hover:bg-purple-600 transition-all shadow-md"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
