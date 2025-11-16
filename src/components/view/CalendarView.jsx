import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import deLocale from "@fullcalendar/core/locales/de";
import { useState, useEffect } from "react";

export default function CalendarView({ tasks = [], onQuickAdd }) {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [dayEvents, setDayEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);

  // -----------------------------------------------------
  // DATE CLICK → OPEN POPUP
  // -----------------------------------------------------
  const handleDateClick = (info) => {
    const dateStr = info.dateStr;

    const eventsOnThatDay = events.filter((ev) => ev.date === dateStr);

    setSelectedDate(dateStr);
    setDayEvents(eventsOnThatDay);
    setShowModal(true);
  };

  // -----------------------------------------------------
  // GENERATE EVENTS (RECURRING + ONE-TIME)
  // -----------------------------------------------------
  useEffect(() => {
    if (!Array.isArray(tasks)) return;

    const today = new Date();
    const oneYearLater = new Date(today);
    oneYearLater.setFullYear(today.getFullYear() + 1);

    const events = [];

    tasks.forEach((t) => {
      // repeatDays can be ["MON","TUE"] or "MON,TUE"
      const selectedDays = Array.isArray(t.repeatDays)
        ? t.repeatDays
        : (t.repeatDays || "")
            .split(",")
            .filter((d) => d && d.trim().length > 0);

      // Start date
      const startDate = t.deadline
        ? new Date(t.deadline)
        : new Date(today.getFullYear(), today.getMonth(), today.getDate());

      const endDate = t.repeatUntil ? new Date(t.repeatUntil) : oneYearLater;

      // -----------------------------------------------------
      // ONE-TIME TASK
      // -----------------------------------------------------
      if (t.deadline && (!t.repeatFrequency || t.repeatFrequency === "NONE")) {
        events.push({
          title: t.title,
          date: t.deadline,
          color: t.done ? "#82ebaf" : "#937ebc",
          extendedProps: { time: t.time || null },
        });
      }

      // -----------------------------------------------------
      // RECURRING TASKS
      // -----------------------------------------------------
      if (t.repeatFrequency && t.repeatFrequency !== "NONE") {
        const freq = t.repeatFrequency;
        const interval = Number(t.repeatInterval) || 1;

        // DAILY
        if (freq === "DAILY") {
          let d = new Date(startDate);
          while (d <= endDate) {
            events.push({
              title: t.title,
              date: d.toISOString().split("T")[0],
              color: "#c084fc",
              extendedProps: { time: t.time || null },
            });
            d.setDate(d.getDate() + interval);
          }
        }

        // WEEKLY
        if (freq === "WEEKLY") {
          const dayToNumber = {
            MON: 1,
            TUE: 2,
            WED: 3,
            THU: 4,
            FRI: 5,
            SAT: 6,
            SUN: 0,
          };

          let d = new Date(startDate);

          while (d <= endDate) {
            const weekdayStr = Object.keys(dayToNumber).find(
              (key) => dayToNumber[key] === d.getDay()
            );

            if (selectedDays.includes(weekdayStr)) {
              events.push({
                title: t.title,
                date: d.toISOString().split("T")[0],
                color: "#f9a8d4",
                extendedProps: { time: t.time || null },
              });
            }

            d.setDate(d.getDate() + 1);
          }
        }

        // MONTHLY
        if (freq === "MONTHLY") {
          let d = new Date(startDate);
          while (d <= endDate) {
            events.push({
              title: t.title,
              date: d.toISOString().split("T")[0],
              color: "#ffec81",
              extendedProps: { time: t.time || null },
            });
            d.setMonth(d.getMonth() + interval);
          }
        }

        // YEARLY
        if (freq === "YEARLY") {
          let d = new Date(startDate);
          while (d <= endDate) {
            events.push({
              title: t.title,
              date: d.toISOString().split("T")[0],
              color: "#60a5fa",
              extendedProps: { time: t.time || null },
            });
            d.setFullYear(d.getFullYear() + interval);
          }
        }
      }
    });

    setEvents(events);
  }, [tasks]);

  // -----------------------------------------------------
  // RENDER
  // -----------------------------------------------------
  return (
    <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-md p-4 transition-all duration-300 hover:scale-[1.01]">
      <FullCalendar
        locale={deLocale}
        firstDay={1}
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView={"dayGridMonth"}
        events={events}
        dateClick={handleDateClick}
        height="auto"
        headerToolbar={{
          start: "prev,next today",
          center: "title",
          end: "",
        }}
      />

      {/* -----------------------------------------------------
           POPUP (IDENTICAL STYLE TO ADD/EDIT TASK DIALOG)
         ----------------------------------------------------- */}
      {showModal && (
        <div
          className="fixed inset-0 bg-purple-200/30 backdrop-blur-md 
                     flex justify-center items-center z-[99999]"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-gradient-to-br from-purple-50 to-white/90
                       border border-purple-200/50 rounded-2xl shadow-2xl 
                       p-8 w-[420px] space-y-6 animate-modalPop"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-semibold text-purple-700 text-center">
              Tasks on {selectedDate}
            </h2>

            {dayEvents.length === 0 && (
              <p className="text-gray-600 text-sm text-center">
                No tasks on this day.
              </p>
            )}

            <div className="space-y-3">
              {dayEvents.map((ev, i) => (
                <div
                  key={i}
                  className="p-4 rounded-2xl border border-purple-200 bg-white/70 shadow-inner"
                >
                  <p className="font-medium text-purple-800">{ev.title}</p>
                  {ev.extendedProps?.time && (
                    <p className="text-xs text-gray-600 mt-1">
                      Time: {ev.extendedProps.time}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* -----------------------------------------------------
                 Add task for this date
               ----------------------------------------------------- */}
            <div className="flex justify-between pt-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-5 py-2 rounded-xl bg-purple-200 text-purple-800 hover:bg-purple-300"
              >
                Close
              </button>

              <button
                onClick={() => {
                  setShowModal(false);
                  setTimeout(() => onQuickAdd(selectedDate), 100);
                }}
                className="px-5 py-2 rounded-xl bg-purple-500 text-white hover:bg-purple-600"
              >
                Add task for this date
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
