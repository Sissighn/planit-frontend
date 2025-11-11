import TaskItem from "./TaskItem";

export default function TaskList({ tasks, onToggle, onDelete, onSelect, selectedTask }) {
  if (tasks.length === 0)
    return (
      <div className="text-center text-white/60 italic mt-6">
        Keine Aufgaben vorhanden.
      </div>
    );

  return (
    <div className="mt-4 bg-white/5 backdrop-blur-lg rounded-2xl p-4 border border-white/20 shadow-inner">
      {tasks.map((t) => (
        <div
          key={t.id}
          onClick={() => onSelect(t)} // ⬅️ Klick auf Task selektiert sie
          className={`cursor-pointer rounded-xl transition-all mb-2 ${
            selectedTask?.id === t.id
              ? "bg-purple-500/20 border border-purple-400/40"
              : "hover:bg-white/10"
          }`}
        >
          <TaskItem task={t} onToggle={onToggle} onDelete={onDelete} />
        </div>
      ))}
    </div>
  );
}
