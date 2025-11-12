import { useState } from "react";

export default function TaskForm({ onAdd }) {
  const [title, setTitle] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd({ title, priority: "MEDIUM" });
    setTitle("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Add a new task..."
        className="flex-1 p-3 rounded-xl bg-slate-800/60 text-white placeholder-gray-400 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
      />
      <button
        type="submit"
        className="px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl font-semibold hover:opacity-90 transition-all shadow-md"
      >
        Add
      </button>
    </form>
  );
}
