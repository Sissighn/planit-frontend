export default function Dashboard({ stats }) {
  return (
    <div className="w-full mb-6">
      <div
        className="grid grid-cols-1 sm:grid-cols-3 gap-4 
                   bg-gradient-to-r from-purple-50/60 to-white/80 
                   backdrop-blur-xl border border-purple-200/40 
                   rounded-2xl shadow-sm p-4"
      >
        {/* Tasks due today */}
        <div className="flex flex-col items-center justify-center text-center">
          <span className="text-3xl">📅</span>
          <p className="text-lg font-cormorant text-slate-800 mt-1">
            <strong>{stats.dueToday} tasks</strong>
          </p>
          <p className="text-sm text-slate-500">Due today</p>
        </div>

        {/* Completed this week */}
        <div className="flex flex-col items-center justify-center text-center">
          <span className="text-3xl">✅</span>
          <p className="text-lg font-cormorant text-slate-800 mt-1">
            <strong>{stats.completedThisWeek} done</strong>
          </p>
          <p className="text-sm text-slate-500">This week</p>
        </div>

        {/* Archived tasks */}
        <div className="flex flex-col items-center justify-center text-center">
          <span className="text-3xl">🗂️</span>
          <p className="text-lg font-cormorant text-slate-800 mt-1">
            <strong>{stats.archived} archived</strong>
          </p>
          <p className="text-sm text-slate-500">Total archived</p>
        </div>
      </div>
    </div>
  );
}
