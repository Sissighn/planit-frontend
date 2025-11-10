import { LayoutDashboard, ListTodo, Archive, Settings } from "lucide-react";

export default function Sidebar() {
  return (
    <div className="w-64 bg-base-100 shadow-xl min-h-screen p-6 flex flex-col gap-6">
      <h2 className="text-2xl font-bold text-primary mb-4">PlanIt ✨</h2>
      <nav className="flex flex-col gap-3">
        <button className="btn btn-ghost justify-start gap-2">
          <LayoutDashboard size={18}/> Dashboard
        </button>
        <button className="btn btn-ghost justify-start gap-2">
          <ListTodo size={18}/> Tasks
        </button>
        <button className="btn btn-ghost justify-start gap-2">
          <Archive size={18}/> Archive
        </button>
        <button className="btn btn-ghost justify-start gap-2">
          <Settings size={18}/> Settings
        </button>
      </nav>
    </div>
  );
}
