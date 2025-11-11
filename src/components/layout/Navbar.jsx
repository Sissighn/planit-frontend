export default function Navbar() {
  return (
    <div
      className="flex justify-between items-center
                 bg-purple-50/80 backdrop-blur-md
                 shadow-md px-8 py-4
                 border-b border-white/40 transition-all duration-300"
    >
      <h1 className="font-cormorant text-2xl text-slate-800">
        Dashboard Overview
      </h1>

      <div className="flex items-center gap-4">
        <input
          type="text"
          placeholder="Search..."
          className="bg-white/60 text-slate-700 placeholder-slate-400 rounded-lg
                     border-none focus:ring-2 focus:ring-purple-300 px-3 py-1.5 transition-all"
        />
        <div className="avatar placeholder">
          <div className="bg-purple-400 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-sm">
            <span>S</span>
          </div>
        </div>
      </div>
    </div>
  );
}
