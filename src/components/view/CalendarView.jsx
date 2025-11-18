import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import deLocale from "@fullcalendar/core/locales/de";
import { useState, useEffect } from "react";
import { HiDotsVertical, HiPlus } from "react-icons/hi";
import DeleteRecurringDialog from "../tasks/DeleteRecurringDialog";

export default function CalendarView({
  tasks = [],
  onQuickAdd,
  onQuickEdit,
  onQuickDelete,
  onQuickArchive,
  onQuickDeleteOne,
  onQuickDeleteFuture,
  onQuickDeleteSeries,
}) {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [dayEvents, setDayEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [openMenuIndex, setOpenMenuIndex] = useState(null);

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // -----------------------------------------------------
  // TAG-KLICK
  // -----------------------------------------------------
  const handleDateClick = (info) => {
    const dateStr = info.dateStr;
    const eventsOnDay = events.filter((ev) => ev.date === dateStr);

    setSelectedDate(dateStr);
    setDayEvents(eventsOnDay);
    setShowModal(true);
    setOpenMenuIndex(null);
  };

  // -----------------------------------------------------
  // EVENTS GENERIEREN
  // -----------------------------------------------------
  useEffect(() => {
    if (!Array.isArray(tasks)) return;

    const today = new Date();
    const oneYearLater = new Date();
    oneYearLater.setFullYear(today.getFullYear() + 1);

    async function buildEvents() {
      const completedMap = {};

      // load completed instances for recurring tasks
      await Promise.all(
        tasks.map(async (t) => {
          if (t.repeatFrequency && t.repeatFrequency !== "NONE") {
            const res = await fetch(
              `http://localhost:8080/api/tasks/${t.id}/completed-instances`
            );
            completedMap[t.id] = await res.json();
          } else {
            completedMap[t.id] = [];
          }
        })
      );

      const built = [];

      for (const t of tasks) {
        const excludedSet = new Set(
          (t.excludedDates || "")
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        );

        const isExcluded = (iso) => excludedSet.has(iso);

        const days = Array.isArray(t.repeatDays)
          ? t.repeatDays
          : (t.repeatDays || "").split(",").filter(Boolean);

        const end = t.repeatUntil ? new Date(t.repeatUntil) : oneYearLater;
        const completedDates = completedMap[t.id] || [];

        // STARTDATE sauber bestimmen
        const start = t.startDate
          ? new Date(t.startDate)
          : t.deadline
          ? new Date(t.deadline)
          : new Date(today);

        // ONE-TIME TASK
        if (!t.repeatFrequency || t.repeatFrequency === "NONE") {
          if (t.deadline && !isExcluded(t.deadline)) {
            built.push({
              taskId: t.id,
              date: t.nextOccurrence || t.deadline,
              title: t.title,
              color: t.done ? "#82ebaf" : "#937ebc",
              task: t,
            });
          }
          continue;
        }

        // RECURRING
        const freq = t.repeatFrequency;
        const interval = Number(t.repeatInterval) || 1;

        // DAILY
        if (freq === "DAILY") {
          let d = new Date(start);
          while (d <= end) {
            const iso = d.toISOString().split("T")[0];
            if (!isExcluded(iso)) {
              built.push({
                taskId: t.id,
                date: iso,
                title: t.title,
                color: completedDates.includes(iso) ? "#82ebaf" : "#c084fc",
                task: t,
              });
            }
            d.setDate(d.getDate() + interval);
          }
        }

        // WEEKLY
        if (freq === "WEEKLY") {
          const map = {
            MON: 1,
            TUE: 2,
            WED: 3,
            THU: 4,
            FRI: 5,
            SAT: 6,
            SUN: 0,
          };

          let d = new Date(start);

          while (d <= end) {
            const iso = d.toISOString().split("T")[0];
            const weekday = Object.keys(map).find((k) => map[k] === d.getDay());

            if (days.includes(weekday) && !isExcluded(iso)) {
              built.push({
                taskId: t.id,
                date: iso,
                title: t.title,
                color: completedDates.includes(iso) ? "#82ebaf" : "#f9a8d4",
                task: t,
              });
            }

            d.setDate(d.getDate() + 1);
          }
        }

        // MONTHLY
        if (freq === "MONTHLY") {
          let d = new Date(start);

          while (d <= end) {
            const iso = d.toISOString().split("T")[0];
            if (!isExcluded(iso)) {
              built.push({
                taskId: t.id,
                date: iso,
                title: t.title,
                color: completedDates.includes(iso) ? "#82ebaf" : "#ffec81",
                task: t,
              });
            }
            d.setMonth(d.getMonth() + interval);
          }
        }

        // YEARLY
        if (freq === "YEARLY") {
          let d = new Date(start);

          while (d <= end) {
            const iso = d.toISOString().split("T")[0];
            if (!isExcluded(iso)) {
              built.push({
                taskId: t.id,
                date: iso,
                title: t.title,
                color: completedDates.includes(iso) ? "#82ebaf" : "#60a5fa",
                task: t,
              });
            }
            d.setFullYear(d.getFullYear() + interval);
          }
        }
      }

      setEvents(built);
    }

    buildEvents();
  }, [tasks]);

  // -----------------------------------------------------
  // DELETE CLICK
  // -----------------------------------------------------
  const handleDeleteClick = (ev) => {
    const task = ev.task;
    const isRecurring =
      task?.repeatFrequency && task.repeatFrequency !== "NONE";

    if (!isRecurring) {
      setShowModal(false);
      setOpenMenuIndex(null);
      onQuickDelete?.(task.id);
      return;
    }

    setDeleteTarget({ task, date: ev.date });
    setShowDeleteDialog(true);
  };

  // -----------------------------------------------------
  // RENDER
  // -----------------------------------------------------
  return (
    <>
      <FullCalendar
        locale={deLocale}
        firstDay={1}
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        dateClick={handleDateClick}
        height="auto"
        headerToolbar={{
          start: "prev,next today",
          center: "title",
          end: "",
        }}
      />

      {/* POPUP */}
      {showModal && (
        <div
          className="fixed inset-0 bg-purple-200/30 backdrop-blur-md flex justify-center items-center z-[99999]"
          onClick={() => {
            setShowModal(false);
            setOpenMenuIndex(null);
          }}
        >
          <div
            className="bg-gradient-to-br from-purple-50 to-white/90
                       border border-purple-200/50 rounded-2xl shadow-2xl 
                       p-6 w-[380px] space-y-4 animate-modalPop"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-purple-700">
                {selectedDate}
              </h2>

              <button
                onClick={() => {
                  setShowModal(false);
                  onQuickAdd?.(selectedDate);
                }}
                className="p-2 rounded-xl bg-purple-200 hover:bg-purple-300 text-purple-700"
              >
                <HiPlus size={18} />
              </button>
            </div>

            {dayEvents.length === 0 && (
              <p className="text-gray-600 text-sm text-center mt-2">
                No tasks for this day.
              </p>
            )}

            <div className="space-y-2">
              {dayEvents.map((ev, i) => (
                <div
                  key={i}
                  className="p-3 rounded-xl border border-purple-200 bg-white shadow-inner relative"
                >
                  <div className="flex justify-between items-start">
                    <p className="font-medium text-purple-800 text-sm">
                      {ev.title}
                    </p>

                    <div className="relative">
                      <button
                        onClick={() =>
                          setOpenMenuIndex(openMenuIndex === i ? null : i)
                        }
                        className="p-1 hover:bg-purple-100 rounded"
                      >
                        <HiDotsVertical size={18} />
                      </button>

                      {openMenuIndex === i && (
                        <div className="absolute right-0 mt-1 w-32 bg-white border border-gray-200 rounded-xl shadow-lg text-sm z-[999999]">
                          <button
                            onClick={() => {
                              setShowModal(false);
                              setOpenMenuIndex(null);
                              onQuickEdit?.(ev.task);
                            }}
                            className="w-full text-left px-3 py-2 hover:bg-gray-100"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => {
                              setShowModal(false);
                              setOpenMenuIndex(null);
                              onQuickArchive?.(ev.task.id);
                            }}
                            className="w-full text-left px-3 py-2 hover:bg-gray-100"
                          >
                            Archive
                          </button>

                          <button
                            onClick={() => handleDeleteClick(ev)}
                            className="w-full text-left px-3 py-2 text-red-500 hover:bg-gray-100"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end mt-3">
              <button
                onClick={() => {
                  setShowModal(false);
                  setOpenMenuIndex(null);
                }}
                className="px-4 py-2 rounded-xl bg-purple-200 text-purple-800 hover:bg-purple-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE RECURRING DIALOG */}
      {showDeleteDialog && deleteTarget && (
        <DeleteRecurringDialog
          date={deleteTarget.date}
          onClose={() => {
            setShowDeleteDialog(false);
            setDeleteTarget(null);
            setOpenMenuIndex(null);
          }}
          onDeleteOne={() => {
            onQuickDeleteOne?.(deleteTarget.task, deleteTarget.date);
            setShowDeleteDialog(false);
            setShowModal(false);
            setDeleteTarget(null);
            setOpenMenuIndex(null);
          }}
          onDeleteFuture={() => {
            onQuickDeleteFuture?.(deleteTarget.task, deleteTarget.date);
            setShowDeleteDialog(false);
            setShowModal(false);
            setDeleteTarget(null);
            setOpenMenuIndex(null);
          }}
          onDeleteSeries={() => {
            onQuickDeleteSeries?.(deleteTarget.task.id);
            setShowDeleteDialog(false);
            setShowModal(false);
            setDeleteTarget(null);
            setOpenMenuIndex(null);
          }}
        />
      )}
    </>
  );
}
