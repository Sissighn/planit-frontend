import { useState } from "react";

export default function AddTaskDialog({ onAdd, onClose }) {
  const [title, setTitle] = useState("");
  const [deadline, setDeadline] = useState("");
  const [priority, setPriority] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return alert("Bitte einen Titel eingeben.");
    onAdd({ title, deadline: deadline || null, priority: priority || null });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white/70 backdrop-blur-xl rounded-soft shadow-soft p-6 w-80 space-y-4 border border-white/40"
      >
        <h2 className="text-xl font-semibold text-slate-800">Neue Aufgabe</h2>

        <input
          type="text"
          placeholder="Titel"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 rounded-soft border border-white/40 bg-white/60 focus:outline-none focus:ring-2 focus:ring-softPurple/50"
        />

        <input
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          className="w-full px-3 py-2 rounded-soft border border-white/40 bg-white/60 focus:outline-none focus:ring-2 focus:ring-softPurple/50"
        />

        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="w-full px-3 py-2 rounded-soft border border-white/40 bg-white/60 focus:outline-none focus:ring-2 focus:ring-softPurple/50"
        >
          <option value="">Keine Priorität</option>
          <option value="LOW">Niedrig</option>
          <option value="MEDIUM">Mittel</option>
          <option value="HIGH">Hoch</option>
        </select>

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1 rounded-soft bg-red-400/70 hover:bg-red-400/90 text-white transition-all"
          >
            Abbrechen
          </button>
          <button
            type="submit"
            className="px-3 py-1 rounded-soft bg-green-400/70 hover:bg-green-400/90 text-white transition-all"
          >
            Speichern
          </button>
        </div>
      </form>
    </div>
  );
}
