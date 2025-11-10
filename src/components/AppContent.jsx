import Dashboard from "./Dashboard";
import TaskList from "./TaskList";
import ActionButtons from "./ActionButtons";

export default function AppContent() {
  return (
    <div className="space-y-8">
      <Dashboard stats={{ archived: 1, done: 2, total: 5 }} />
      <TaskList
        tasks={[{ id: 1, title: "Example", priority: "HIGH", done: false }]}
        onToggle={() => {}}
        onDelete={() => {}}
      />
      <ActionButtons onAction={(a) => console.log(a)} />
    </div>
  );
}
