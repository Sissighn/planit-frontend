import { LayoutDashboard, ListTodo, Settings } from "lucide-react";

export default function Sidebar({
  onAddClick,
  onArchiveClick,
  onHomeClick,
  activeView,
}) {
  const safe = (fn) => (e) => {
    if (typeof fn === "function") fn(e);
  };

  const isActive = (view) =>
    activeView === view
      ? "bg-purple-300/50 shadow-inner scale-[1.03]"
      : "hover:scale-105";

  return (
    <div className="w-64 bg-purple-100/80 backdrop-blur-md 
                    shadow-lg min-h-screen p-6 flex flex-col gap-6
                    border-r border-white/40">
      <h1 className="font-tempting text-3xl text-purple-700 tracking-wide mb-2">
        PlanIT
      </h1>

      {/* 🔸 Aktionen */}
      <div className="mt-8 flex flex-col items-start gap-4 border-t border-white/40 pt-6">
        {/* 🏠 Home */}
        <button
          onClick={safe(onHomeClick)}
          className={`flex items-center gap-2 text-black transition-all rounded-lg px-2 py-1 ${isActive(
            "home"
          )}`}
        >
          <span className="material-symbols-outlined text-3xl text-black">home</span>
          <span className="font-medium text-slate-700">Home</span>
        </button>

        {/* ➕ Add */}
        <button
          onClick={safe(onAddClick)}
          className="flex items-center gap-2 text-black hover:scale-105 transition-transform rounded-lg px-2 py-1"
        >
          <span className="material-symbols-outlined text-3xl text-black">add_circle</span>
          <span className="font-medium text-slate-700">Add Task</span>
        </button>

        {/* 📦 Archive */}
        <button
          onClick={safe(onArchiveClick)}
          className={`flex items-center gap-2 text-black transition-all rounded-lg px-2 py-1 ${isActive(
            "archive"
          )}`}
        >
          <span className="material-symbols-outlined text-3xl text-black">archive</span>
          <span className="font-medium text-slate-700">Archive</span>
        </button>
      </div>
    </div>
  );
}
