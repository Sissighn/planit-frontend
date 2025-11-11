export default function TaskItem({ task, onToggle, onDelete }) {
  const priorityColor =
    task.priority === "HIGH"
      ? "text-red-400"
      : task.priority === "LOW"
      ? "text-blue-400"
      : "text-yellow-400";

  return (
    <div
      className={`flex justify-between items-center bg-white/10 backdrop-blur-md rounded-xl p-4 mb-3 border border-white/20 shadow-sm transition-all ${
        task.done ? "opacity-50 line-through" : ""
      }`}
    >
      <div>
<span className="text-lg font-medium text-slate-700">{task.title}</span>
        <span className={`text-sm ${priorityColor}`}>({task.priority})</span>
      </div>
      <div className="space-x-2">
        <button
          onClick={() => onToggle(task.id)}
className="bg-green-400/70 hover:bg-green-400/90 text-white font-medium px-3 py-1 rounded-lg shadow-soft transition-all duration-200"
        >
          {task.done ? "Undo" : "Done"}
        </button>
        <button
          onClick={() => onDelete(task.id)}
className="bg-red-600/70 hover:bg-red-600/70 text-white font-medium px-3 py-1 rounded-lg shadow-soft transition-all duration-200"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
