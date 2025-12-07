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
        placeholder="Add a new task and press Enter..."
        className="flex-1 p-3 rounded-xl bg-slate-100 text-slate-700 placeholder-slate-400 shadow-[inset_5px_5px_10px_#d1d9e6,_inset_-5px_-5px_10px_#ffffff] focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all dark:bg-slate-800 dark:text-slate-300 dark:placeholder-slate-500 dark:shadow-[inset_5px_5px_10px_#0f172a,_inset_-5px_-5px_10px_#334155]"
      />
      <button
        type="submit"
        className="px-6 py-3 rounded-xl bg-slate-100 text-purple-800 font-semibold shadow-[5px_5px_10px_#d1d9e6,_-5px_-5px_10px_#ffffff] transition-all hover:shadow-[inset_5px_5px_10px_#d1d9e6,_inset_-5px_-5px_10px_#ffffff] dark:bg-slate-800 dark:text-purple-300 dark:shadow-[5px_5px_10px_#0f172a,_-5px_-5px_10px_#334155] dark:hover:shadow-[inset_5px_5px_10px_#0f172a,_inset_-5px_-5px_10px_#334155]"
      >
        Add
      </button>
    </form>
  );
}
