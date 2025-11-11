export default function TaskItem({ task, onToggle, onDelete }) {
  const priorityColor =
    task.priority === "HIGH"
      ? "text-red-400"
      : task.priority === "LOW"
      ? "text-blue-400"
      : "text-yellow-400";

  return (
    <div
      className={`flex justify-between items-center bg-white/40 backdrop-blur-xl rounded-2xl p-4 mb-3 border border-white/40 shadow-md hover:shadow-lg transition-all duration-300 ${
        task.done ? "opacity-80" : ""
      }`}
    >
      {/* Titel + Priority */}
      <div>
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

      {/* Icons */}
      <div className="flex items-center space-x-3">
        {/* Häkchen: done ↔ undone */}
        <button
          onClick={() => onToggle(task.id)}
          className="transition-transform hover:scale-110"
          title={task.done ? "Als unerledigt markieren" : "Als erledigt markieren"}
        >
          <span
            className={`material-symbols-outlined text-3xl transition-all duration-300 ${
              task.done ? "text-green-500" : "text-gray-400"
            }`}
          >
            done_outline
          </span>
        </button>

        {/* Delete */}
        <button
          onClick={() => onDelete(task.id)}
          className="transition-transform hover:scale-110"
          title="Aufgabe löschen"
        >
          <span className="material-symbols-outlined text-3xl text-rose-400 hover:text-rose-600 transition-colors duration-300">
            delete
          </span>
        </button>
      </div>
    </div>
  );
}
