import { useRef, useState } from "react";
import Sidebar from "./Sidebar";
import AppContent from "../AppContent";

export default function DashboardLayout() {
  const appRef = useRef(null);
  const [activeView, setActiveView] = useState("home"); // "home" | "archive"

  const handleAddClick = () => appRef.current?.openAdd?.();

  const handleHomeClick = async () => {
    await appRef.current?.showHomeView?.();
    setActiveView("home");
  };

  const handleArchiveClick = async () => {
    await appRef.current?.showArchiveView?.();
    setActiveView("archive");
  };

  return (
    <div className="flex min-h-screen">
      {/* 🔹 Sidebar */}
      <Sidebar
        onAddClick={handleAddClick}
        onArchiveClick={handleArchiveClick}
        onHomeClick={handleHomeClick}
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
              : "Your active tasks at a glance"}
          </p>
        </header>

        {/* 🔸 Inhalt (Tasks / Add Dialog etc.) */}
        <main className="flex-1 relative overflow-hidden">
          <AppContent ref={appRef} />
        </main>
      </div>
    </div>
  );
}
