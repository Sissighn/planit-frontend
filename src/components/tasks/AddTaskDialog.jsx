import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import RepeatSection from "./RepeatSection";

export default function AddTaskDialog({ onAdd, onClose, presetDate }) {
  // ------------------------------
  // State
  // ------------------------------
  const [title, setTitle] = useState("");
  const [deadline, setDeadline] = useState("");
  const [time, setTime] = useState("");
  const [priority, setPriority] = useState("");

  const [groups, setGroups] = useState([]);
  const [groupId, setGroupId] = useState("");

  const [repeatFrequency, setRepeatFrequency] = useState("NONE");
  const [repeatDays, setRepeatDays] = useState([]);
  const [repeatInterval, setRepeatInterval] = useState(1);
  const [repeatUntil, setRepeatUntil] = useState("");

  const [startDate, setStartDate] = useState("");

  // ------------------------------
  // Load groups
  // ------------------------------
  useEffect(() => {
    fetch("http://localhost:8080/api/groups")
      .then((res) => res.json())
      .then(setGroups)
      .catch(console.error);
  }, []);

  // ------------------------------
  // Preset date
  // ------------------------------
  useEffect(() => {
    if (presetDate) {
      setDeadline(presetDate);
    }
  }, [presetDate]);

  // ------------------------------
  // Submit handler
  // ------------------------------
  const handleSubmit = (e) => {
    e.preventDefault();

    onAdd({
      title,
      deadline: deadline || null,
      time: time || null,
      priority: priority || null,
      groupId: groupId || null,
      repeatFrequency,
      repeatDays: repeatDays.join(","),
      repeatInterval,
      repeatUntil: repeatUntil || null,
      startDate: repeatFrequency !== "NONE" ? startDate || null : null,
    });

    onClose();
  };

  // ------------------------------
  // Styling helpers
  // ------------------------------
  const inputClass =
    "w-full px-4 py-2.5 rounded-xl border border-purple-200 bg-white/70 " +
    "focus:outline-none focus:ring-2 focus:ring-purple-300 shadow-inner text-gray-800";

  const labelClass = "text-sm font-medium text-purple-700";

  // ------------------------------
  // Dialog Layout (New structure)
  // ------------------------------
  const dialog = (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center 
                 bg-purple-200/30 backdrop-blur-md"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <form
        onSubmit={handleSubmit}
        className="
          bg-gradient-to-br from-purple-50 to-white/90
          border border-purple-200/50 rounded-2xl shadow-2xl
          w-[560px] max-h-[85vh] flex flex-col overflow-hidden animate-modalPop
        "
      >
        {/* HEADER (fixed) */}
        <div className="px-8 py-6 border-b border-purple-200/40 bg-white/60 backdrop-blur-sm">
          <h2 className="text-2xl font-semibold text-purple-700 text-center">
            New Task
          </h2>
        </div>

        {/* CONTENT (scrollable) */}
        <div className="px-8 py-6 space-y-4 overflow-y-auto">
          {/* Title */}
          <div className="flex flex-col gap-1">
            <label className={labelClass}>Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={inputClass}
              placeholder="Enter task title…"
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

          {/* Group */}
          <div className="flex flex-col gap-1">
            <label className={labelClass}>Group</label>
            <select
              value={groupId}
              onChange={(e) => setGroupId(e.target.value)}
              className={inputClass}
            >
              <option value="">No group</option>
              {groups.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
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

          {/* Start Date (only if repeating) */}
          {repeatFrequency !== "NONE" && (
            <div className="flex flex-col gap-1">
              <label className={labelClass}>Start date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className={inputClass}
              />
            </div>
          )}
        </div>

        {/* FOOTER (fixed) */}
        <div className="px-8 py-4 border-t border-purple-200/40 bg-white/60 backdrop-blur-sm flex justify-end gap-4">
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
