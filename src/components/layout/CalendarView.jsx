import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useState, useEffect } from "react";

export default function CalendarView({ tasks = [] }) {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    if (!Array.isArray(tasks)) return;
    const mapped = tasks
      .filter((t) => t.deadline)
      .map((t) => ({
        title: t.title,
        date: t.deadline,
        color: t.done ? "#82ebafff" : "#937ebcff",
      }));
    setEvents(mapped);
    console.log("📅 Tasks received in CalendarView:", tasks);
  }, [tasks]);

  const handleDateClick = (info) => {
    alert(`Clicked on ${info.dateStr}`);
  };

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-md p-4 transition-all duration-300 hover:scale-[1.01]">
      <FullCalendar
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
    </div>
  );
}
