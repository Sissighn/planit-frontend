import { useRef, useState } from "react";
import Sidebar from "./Sidebar";
import AppContent from "../AppContent";
import CalendarView from "./CalendarView";

export default function DashboardLayout() {
  const appRef = useRef(null);
  const [activeView, setActiveView] = useState("home");
  const [tasks, setTasks] = useState([]); // 🔹 globale Tasks

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

  return (
    <div className="flex min-h-screen">
      <Sidebar
        onAddClick={handleAddClick}
        onArchiveClick={handleArchiveClick}
        onHomeClick={handleHomeClick}
        onCalendarClick={handleCalendarClick}
        activeView={activeView}
      />

      <div className="flex-1 flex flex-col bg-white/70 backdrop-blur-md">
        <header className="p-6 border-b border-purple-200 bg-gradient-to-r from-purple-50 to-purple-100">
          <h1 className="text-3xl font-orange text-soft-purple tracking-wide">
            <strong>Dashboard Overview</strong>
          </h1>
          <p className="text-slate-600 mt-1">
            {activeView === "archive"
              ? "Viewing archived tasks"
              : activeView === "calendar"
              ? "Calendar view"
              : "Your active tasks at a glance"}
          </p>
        </header>

        <main className="flex-1 grid grid-cols-[2fr_1.3fr] gap-6 p-6 overflow-hidden">
          <div className="relative">
            {/* 🔹 AppContent sendet Tasks nach oben */}
            <AppContent ref={appRef} onTasksUpdate={setTasks} />
          </div>

          {/* 🔹 Kalender immer aktuell */}
          {activeView === "home" && (
            <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-md p-4 overflow-y-auto">
              <CalendarView tasks={tasks} />
            </div>
          )}
        </main>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen">
      {/* 🔹 Sidebar */}
      <Sidebar
        onAddClick={handleAddClick}
        onArchiveClick={handleArchiveClick}
        onHomeClick={handleHomeClick}
        onCalendarClick={() => setActiveView("calendar")}
        activeView={activeView}
      />

      {/* 🔸 Hauptbereich */}
      <div className="flex-1 flex flex-col bg-white/70 backdrop-blur-md">
        {/* 🟣 Dashboard Header */}
        <header className="p-6 border-b border-purple-200 bg-gradient-to-r from-purple-50 to-purple-100">
          <h1 className="text-3xl font-orange text-soft-purple tracking-wide">
            <strong>Dashboard Overview</strong>
          </h1>
          <p className="text-slate-600 mt-1">
            {activeView === "archive"
              ? "Viewing archived tasks"
              : activeView === "calendar"
              ? "Calendar view"
              : "Your active tasks at a glance"}
          </p>
        </header>

        {/* 🔸 Inhalt: Tasks + Calendar nebeneinander */}
        <main className="flex-1 grid grid-cols-[2fr_1.3fr] gap-6 p-6 overflow-hidden">
          {/* 📝 Task Content */}
          <div className="relative">
            <AppContent ref={appRef} />
          </div>

          {/* 🗓️ Calendar rechts (nur im Home-View sichtbar) */}
          {activeView === "home" && (
            <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-md p-4 overflow-y-auto">
              <CalendarView />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
