import { useRef, useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import AppContent from "./AppContent";
import CalendarView from "../view/CalendarView";

export default function DashboardLayout() {
  const appRef = useRef(null);
  const [activeView, setActiveView] = useState("home");

  // 🔹 Globale States
  const [tasks, setTasks] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  // 🔹 Tasks aus Backend laden
  useEffect(() => {
    fetch("http://localhost:8080/api/tasks")
      .then((res) => res.json())
      .then(setTasks)
      .catch((err) => console.error("Failed to load tasks:", err));
  }, []);

  // 🔹 Filter: sichtbare Tasks je nach ausgewählter Kategorie
  const visibleTasks = selectedCategoryId
    ? tasks.filter((t) => t.groupId === Number(selectedCategoryId))
    : tasks;

  // 🔹 Sidebar-Actions
  const handleAddClick = () => appRef.current?.openAdd?.();
  const handleHomeClick = async () => {
    await appRef.current?.showHomeView?.();
    setActiveView("home");
  };

  const handleArchiveClick = async () => {
    await appRef.current?.showArchiveView?.();
    setActiveView("archive");
  };

  const handleCalendarClick = async () => setActiveView("calendar");

  const handleSelectGroup = (groupId) => {
    console.log("Selected category ID:", groupId);
    setSelectedCategoryId(groupId);
    setActiveView("home");
  };

  return (
    <div className="flex min-h-screen">
      {/* 🔹 Sidebar */}
      <Sidebar
        onAddClick={handleAddClick}
        onArchiveClick={handleArchiveClick}
        onHomeClick={handleHomeClick}
        onCalendarClick={handleCalendarClick}
        onSelectGroup={handleSelectGroup}
        activeView={activeView}
      />

      {/* 🔸 Hauptbereich */}
      <div className="flex-1 flex flex-col bg-white/70 backdrop-blur-md">
        {/* 🟣 Header */}
        <header className="p-6 border-b border-purple-200 bg-gradient-to-r from-purple-50 to-purple-100">
          <h1 className="text-3xl font-dms text-soft-purple tracking-wide">
            <strong>Dashboard Overview</strong>
          </h1>
          <p className="text-slate-600 mt-1">
            {activeView === "archive"
              ? "Viewing archived tasks"
              : activeView === "calendar"
              ? "Calendar view"
              : selectedCategoryId
              ? "Tasks in selected category"
              : "Your active tasks at a glance"}
          </p>
        </header>

        {/* 🔸 Inhalt */}
        <main
          className="
            flex-1 grid gap-6 p-6
            grid-cols-1
            lg:grid-cols-[2fr_1.3fr]
            items-start
          "
        >
          {/* 📝 Task Content */}
          <div className="relative">
            <AppContent
              ref={appRef}
              onTasksUpdate={setTasks}
              filteredTasks={visibleTasks}
            />
          </div>

          {/* 🗓️ Calendar View */}
          {activeView === "home" && (
            <div
              className="
                bg-white/80 backdrop-blur-md rounded-2xl shadow-md p-4 
                w-full sm:min-h-[400px] transition-all
              "
            >
              <CalendarView tasks={visibleTasks} />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
