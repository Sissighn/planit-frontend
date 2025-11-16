export default function RepeatSection({
  repeatFrequency,
  setRepeatFrequency,
  repeatDays,
  setRepeatDays,
  repeatInterval,
  setRepeatInterval,
  repeatUntil,
  setRepeatUntil,
}) {
  const toggleDay = (day) => {
    setRepeatDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const inputClass =
    "w-full px-4 py-3 rounded-2xl border border-purple-200 bg-white/70 " +
    "focus:outline-none focus:ring-2 focus:ring-purple-300 shadow-inner text-gray-800";

  const labelClass = "text-sm font-medium text-purple-700";

  return (
    <div className="space-y-4">
      {/* Repeat dropdown */}
      <div className="flex flex-col gap-1">
        <label className={labelClass}>Repeat</label>
        <select
          value={repeatFrequency}
          onChange={(e) => setRepeatFrequency(e.target.value)}
          className={inputClass}
        >
          <option value="NONE">No repeat</option>
          <option value="DAILY">Daily</option>
          <option value="WEEKLY">Weekly</option>
          <option value="MONTHLY">Monthly</option>
          <option value="YEARLY">Yearly</option>
        </select>
      </div>

      {/* Weekly buttons */}
      {repeatFrequency === "WEEKLY" && (
        <div className="flex flex-wrap gap-2 mt-1">
          {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map((day) => (
            <button
              type="button"
              key={day}
              onClick={() => toggleDay(day)}
              className={
                "px-3 py-1.5 rounded-lg border text-[13px] transition-all " +
                (repeatDays.includes(day)
                  ? "bg-purple-500 text-white border-purple-600 shadow"
                  : "bg-white border-purple-200 text-purple-700 shadow-inner")
              }
            >
              {day}
            </button>
          ))}
        </div>
      )}

      {/* Interval + Until in one row */}
      {repeatFrequency !== "NONE" && (
        <div className="grid grid-cols-2 gap-4">
          {/* Interval */}
          <div className="flex flex-col gap-1">
            <label className={labelClass}>Repeat every (interval)</label>
            <input
              type="number"
              min="1"
              value={repeatInterval}
              onChange={(e) => setRepeatInterval(Number(e.target.value))}
              className={inputClass}
            />
          </div>

          {/* Until */}
          <div className="flex flex-col gap-1">
            <label className={labelClass}>Until (optional)</label>
            <input
              type="date"
              value={repeatUntil}
              onChange={(e) => setRepeatUntil(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>
      )}
    </div>
  );
}
