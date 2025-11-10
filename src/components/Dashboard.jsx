export default function Dashboard({ stats }) {
  return (
    <div className="flex justify-center gap-6 mb-6 text-sm md:text-base">
      <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl shadow-md border border-white/20">
        📦 Archiviert: <span className="text-indigo-300 font-semibold">{stats.archived}</span>
      </div>
      <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl shadow-md border border-white/20">
        ✅ Erledigt: <span className="text-emerald-300 font-semibold">{stats.done}</span>
      </div>
      <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl shadow-md border border-white/20">
        🗒️ Gesamt: <span className="text-yellow-300 font-semibold">{stats.total}</span>
      </div>
    </div>
  );
}
