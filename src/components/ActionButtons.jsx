export default function ActionButtons({ onAction }) {
  const buttons = [
    "Add", "Edit", "Done/Undone", "Delete", "Archive",
    "View Archive", "Clear completed", "Sorting", "Settings", "Exit"
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mt-6">
      {buttons.map((label, i) => (
        <button
          key={i}
          onClick={() => onAction(label)}
          className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-indigo-600 hover:to-purple-500 text-white font-semibold py-2 rounded-xl shadow-md border border-white/20 transition-all"
        >
          {label}
        </button>
      ))}
    </div>
  );
}
