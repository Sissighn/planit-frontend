export default function ActionButtons({ onAction, selectedTask }) {
  const baseUrl = "http://localhost:8080/api/tasks";

  const handleClick = async (label) => {
    if (!selectedTask && ["Edit", "Delete", "Done/Undone", "Archive"].includes(label)) {
      alert("⚠️ Bitte zuerst eine Aufgabe auswählen!");
      return;
    }

    const id = selectedTask?.id;
    try {
      let response;

      switch (label) {
        case "Add":
          response = await fetch(baseUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              title: "New Task from Frontend",
              deadline: new Date().toISOString().slice(0, 10),
              priority: "MEDIUM",
            }),
          });
          break;

        case "Edit":
          response = await fetch(`${baseUrl}/${selectedTaskId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title: "Updated Task Title" }),
          });
          break;

        case "Delete":
          response = await fetch(`${baseUrl}/${selectedTaskId}`, {
            method: "DELETE",
          });
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
    "Edit",
    "Done/Undone",
    "Delete",
    "Archive",
    "View Archive",
    "Clear completed",
    "Sorting",
    "Settings",
    "Exit",
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-8">
      {buttons.map((label, i) => (
        <button
          key={i}
          onClick={() => handleClick(label)}
          className="rounded-soft bg-gradient-to-r from-softPink via-softPurple to-softYellow
                     text-slate-800 font-semibold py-3 shadow-soft
                     hover:shadow-inner hover:scale-105 transition-all duration-300
                     backdrop-blur-lg border border-white/40"
        >
          {label}
        </button>
      ))}
    </div>
  );
}
