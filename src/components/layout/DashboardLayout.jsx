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
      {/* 🔹 Sidebar */}
      <Sidebar
        onAddClick={handleAddClick}
        onArchiveClick={handleArchiveClick}
        onHomeClick={handleHomeClick}
        onCalendarClick={handleCalendarClick}
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
              : "Your active tasks at a glance"}
          </p>
        </header>

        {/* 🔸 Inhalt: Responsive Grid */}
        <main
          className="
            flex-1 grid gap-6 p-6
            grid-cols-1               /* Standard: untereinander */
            lg:grid-cols-[2fr_1.3fr]  /* Ab large-screen: nebeneinander */
            items-start
          "
        >
          {/* 📝 Task Content */}
          <div className="relative">
            <AppContent ref={appRef} onTasksUpdate={setTasks} />
          </div>

          {/* 🗓️ Calendar View */}
          {activeView === "home" && (
            <div
              className="
                bg-white/80 backdrop-blur-md rounded-2xl shadow-md p-4 
                w-full
                sm:min-h-[400px]
                transition-all
              "
            >
              <CalendarView tasks={tasks} />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
