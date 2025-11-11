import { useState } from "react";
import AddTaskDialog from "./AddTaskDialog";

export default function ActionButtons({ onAction, selectedTask }) {
  const baseUrl = "http://localhost:8080/api/tasks";
  const [showAddDialog, setShowAddDialog] = useState(false);

  //Add Task Handler
const handleAdd = async (taskData) => {
  try {
    const response = await fetch(baseUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(taskData),
    });

    const text = await response.text();
    console.log("🔍 Backend response:", response.status, text);

    if (!response.ok) throw new Error(`Backend error ${response.status}: ${text}`);

    console.log("✅ Task added:", taskData);
    onAction("Add");
  } catch (err) {
    console.error("❌ Error calling backend:", err);
    alert("Fehler beim Hinzufügen der Aufgabe.\n" + err.message);
  }
};
  
  const handleClick = async (label) => {
    if (!selectedTask && ["Archive"].includes(label)) {
      alert("⚠️ Bitte zuerst eine Aufgabe auswählen!");
      return;
    }

    const id = selectedTask?.id;
    try {
      let response;

       switch (label) {
        case "Add":
          return setShowAddDialog(true);

        case "Archive":
          response = await fetch(`${baseUrl}/${id}/archive`, { method: "POST" });
          break;

        case "View Archive":
          response = await fetch(`${baseUrl}/archive`);
          console.log("📦 Archived tasks:", await response.json());
          break;

        case "Clear completed":
          response = await fetch(`${baseUrl}/clear-completed`, { method: "DELETE" });
          break;

        case "Sorting":
          response = await fetch(`${baseUrl}/sorted?by=priority`);
          console.log("📋 Sorted tasks:", await response.json());
          break;

        case "Settings":
          console.log("⚙️ Settings clicked");
          break;

        case "Exit":
          console.log("👋 Exit clicked");
          break;

        default:
          console.log(`⚙️ No backend action for ${label}`);
      }
      if (response?.ok) console.log(`✅ ${label} success`);
      onAction(label);
    } catch (err) {
      console.error("❌ Error calling backend:", err);
    }
  };

  const buttons = [
    "Add",
    "Archive",
    "View Archive",
    "Clear completed",
    "Sorting",
    "Settings",
  ];

   return (
    <div className="mt-8">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {buttons.map((label, i) => (
          <button
            key={i}
            onClick={() => handleClick(label)}
            className="rounded-soft font-semibold py-3 transition-all duration-300 shadow-soft border border-white/40
                       bg-gradient-to-r from-softPink via-softPurple to-softYellow text-slate-800 
                       hover:shadow-inner hover:scale-[1.02]"
          >
            {label}
          </button>
        ))}
      </div>

      {showAddDialog && (
        <AddTaskDialog onAdd={handleAdd} onClose={() => setShowAddDialog(false)} />
      )}
    </div>
  );
}
