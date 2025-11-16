import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import RepeatSection from "./RepeatSection";

export default function EditTaskDialog({ task, onEdit, onClose }) {
  const [title, setTitle] = useState("");
  const [deadline, setDeadline] = useState("");
  const [time, setTime] = useState("");
  const [priority, setPriority] = useState("");

  const [repeatFrequency, setRepeatFrequency] = useState("NONE");
  const [repeatDays, setRepeatDays] = useState([]);
  const [repeatInterval, setRepeatInterval] = useState(1);
  const [repeatUntil, setRepeatUntil] = useState("");

  useEffect(() => {
    if (!task) return;

    setTitle(task.title);
    setDeadline(task.deadline || "");
    setTime(task.time || "");
    setPriority(task.priority || "");

    setRepeatFrequency(task.repeatFrequency || "NONE");
    setRepeatDays(task.repeatDays ? task.repeatDays.split(",") : []);
    setRepeatInterval(task.repeatInterval || 1);
    setRepeatUntil(task.repeatUntil || "");
  }, [task]);

  const handleSubmit = (e) => {
    e.preventDefault();

    onEdit({
      ...task,
      title,
      deadline: deadline || null,
      time,
      priority: priority || null,
      repeatFrequency,
      repeatDays: repeatDays.join(","),
      repeatInterval,
      repeatUntil: repeatUntil || null,
    });

    onClose();
  };

  const inputClass =
    "w-full px-4 py-3 rounded-2xl border border-purple-200 bg-white/70 " +
    "focus:outline-none focus:ring-2 focus:ring-purple-300 shadow-inner text-gray-800";
  const labelClass = "text-sm font-medium text-purple-700";

  const dialog = (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center 
                 bg-purple-200/30 backdrop-blur-md"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <form
        onSubmit={handleSubmit}
        className="bg-gradient-to-br from-purple-50 to-white/90
                   border border-purple-200/50 rounded-2xl shadow-2xl 
                   p-8 w-[420px] space-y-6 animate-modalPop"
      >
        <h2 className="text-2xl font-semibold text-purple-700 text-center mb-2">
          Edit Task
        </h2>

        {/* Title */}
        <div className="flex flex-col gap-1">
          <label className={labelClass}>Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={inputClass}
          />
        </div>

        {/* Deadline */}
        <div className="flex flex-col gap-1">
          <label className={labelClass}>Deadline</label>
          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className={inputClass}
          />
        </div>

        {/* Time */}
        <div className="flex flex-col gap-1">
          <label className={labelClass}>Time</label>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className={inputClass}
          />
        </div>

        {/* Priority */}
        <div className="flex flex-col gap-1">
          <label className={labelClass}>Priority</label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className={inputClass}
          >
            <option value="">No priority</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>
        </div>

        {/* Repeat Section */}
        <RepeatSection
          repeatFrequency={repeatFrequency}
          setRepeatFrequency={setRepeatFrequency}
          repeatDays={repeatDays}
          setRepeatDays={setRepeatDays}
          repeatInterval={repeatInterval}
          setRepeatInterval={setRepeatInterval}
          repeatUntil={repeatUntil}
          setRepeatUntil={setRepeatUntil}
        />

        {/* Buttons */}
        <div className="flex justify-end gap-4 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-purple-200 text-purple-800 hover:bg-purple-300"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="px-5 py-2 rounded-xl bg-purple-500 text-white hover:bg-purple-600"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );

  return createPortal(dialog, document.body);
}
