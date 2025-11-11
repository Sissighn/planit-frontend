import { LayoutDashboard, ListTodo, Archive, Settings } from "lucide-react";

export default function Sidebar() {
  return (
    <div className="w-64 bg-purple-100/80 backdrop-blur-md 
                    shadow-lg min-h-screen p-6 flex flex-col gap-6
                    border-r border-white/40">
      <h1 className="font-tempting text-3xl text-purple-700 tracking-wide mb-2">
        PlanIt
      </h1>

      <nav className="flex flex-col gap-3">
        <button className="btn btn-ghost justify-start gap-2 text-slate-700 hover:bg-purple-200/80 rounded-lg transition-all">
          <LayoutDashboard size={18}/> Dashboard
        </button>
        <button className="btn btn-ghost justify-start gap-2 text-slate-700 hover:bg-purple-200/80 rounded-lg transition-all">
          <ListTodo size={18}/> Tasks
        </button>
        <button className="btn btn-ghost justify-start gap-2 text-slate-700 hover:bg-purple-200/80 rounded-lg transition-all">
          <Archive size={18}/> Archive
        </button>
        <button className="btn btn-ghost justify-start gap-2 text-slate-700 hover:bg-purple-200/80 rounded-lg transition-all">
          <Settings size={18}/> Settings
        </button>
      </nav>
    </div>
  );
}
