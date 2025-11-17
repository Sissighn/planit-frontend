import { useRef, useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import AppContent from "./AppContent";
import CalendarView from "../view/CalendarView";

export default function DashboardLayout() {
  const appRef = useRef(null);
  const [activeView, setActiveView] = useState("home");

  // Global states
  const [tasks, setTasks] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  // Load all tasks from backend
  const loadTasks = () => {
    fetch("http://localhost:8080/api/tasks")
      .then((res) => res.json())
      .then(setTasks)
      .catch((err) => console.error("Failed to load tasks:", err));
  };

  useEffect(() => {
    loadTasks();
  }, []);

  // Filter: visible tasks based on selected category
  const visibleTasks = selectedCategoryId
    ? tasks.filter((t) => t.groupId === Number(selectedCategoryId))
    : tasks;

  // Sidebar actions
  const handleAddClick = () => appRef.current?.openAdd?.();
  const handleHomeClick = async () => {
    await appRef.current?.showHomeView?.();
    setActiveView("home");
  };

  const handleArchiveClick = async () => {
    await appRef.current?.showArchiveView?.();
    setActiveView("archive");
  };

  const handleCalendarClick = () => {
    setActiveView("calendar");
  };

  const handleSelectGroup = (groupId) => {
    console.log("Selected category ID:", groupId);
    setSelectedCategoryId(groupId);
    setActiveView("home");
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar
        onAddClick={handleAddClick}
        onArchiveClick={handleArchiveClick}
        onHomeClick={handleHomeClick}
        onCalendarClick={handleCalendarClick}
        onSelectGroup={handleSelectGroup}
        activeView={activeView}
      />

      {/* Main area */}
      <div className="flex-1 flex flex-col bg-white/70 backdrop-blur-md">
        {/* Header */}
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

        {/* Content area */}
        <main className="flex-1 p-6 space-y-6">
          {/* Home + Archive views */}
          <div
            className={
              activeView === "calendar"
                ? "hidden"
                : "grid gap-6 grid-cols-1 lg:grid-cols-[2fr_1.3fr] items-start"
            }
          >
            {/* Full AppContent (task list + dialogs + stats) */}
            <div className="relative">
              <AppContent ref={appRef} onTasksUpdate={setTasks} />
            </div>

            {/* Small calendar inside Home view only */}
            {activeView === "home" && (
              <div
                className="
                  bg-white/80 backdrop-blur-md rounded-2xl shadow-md p-4 
                  w-full sm:min-h-[400px] transition-all
                "
              >
                <CalendarView
                  tasks={visibleTasks}
                  onQuickAdd={(date) => appRef.current?.quickAdd(date)}
                  onQuickEdit={(task) => appRef.current?.quickEdit(task)}
                  onQuickDelete={(id) => appRef.current?.quickDelete(id)}
                  onQuickArchive={(id) => appRef.current?.quickArchive(id)}
                  onQuickDeleteOne={(task, date) =>
                    appRef.current?.quickDeleteOne(task, date)
                  }
                  onQuickDeleteFuture={(task, date) =>
                    appRef.current?.quickDeleteFuture(task, date)
                  }
                  onQuickDeleteSeries={(id) =>
                    appRef.current?.quickDeleteSeries(id)
                  }
                />
              </div>
            )}
          </div>

          {/* Fullscreen calendar view */}
          {activeView === "calendar" && (
            <div
              className="
                bg-white/80 backdrop-blur-md rounded-2xl shadow-md p-4 
                w-full min-h-[650px]
              "
            >
              <CalendarView
                tasks={visibleTasks}
                onQuickAdd={(date) => appRef.current?.quickAdd(date)}
                onQuickEdit={(task) => appRef.current?.quickEdit(task)}
                onQuickDelete={(id) => appRef.current?.quickDelete(id)}
                onQuickArchive={(id) => appRef.current?.quickArchive(id)}
                onQuickDeleteOne={(task, date) =>
                  appRef.current?.quickDeleteOne(task, date)
                }
                onQuickDeleteFuture={(task, date) =>
                  appRef.current?.quickDeleteFuture(task, date)
                }
                onQuickDeleteSeries={(id) =>
                  appRef.current?.quickDeleteSeries(id)
                }
              />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
