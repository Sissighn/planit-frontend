import TaskItem from "./TaskItem";

export default function TaskList({ tasks, onToggle, onDelete }) {
  if (tasks.length === 0)
    return (
      <div className="text-center text-white/60 italic mt-6">
        Keine Aufgaben vorhanden.
      </div>
    );

  return (
    <div className="mt-4 bg-white/5 backdrop-blur-lg rounded-2xl p-4 border border-white/20 shadow-inner">
      {tasks.map((t) => (
        <TaskItem key={t.id} task={t} onToggle={onToggle} onDelete={onDelete} />
      ))}
    </div>
  );
}
