import { createPortal } from "react-dom";

export default function DeleteRecurringDialog({
  date,
  onDeleteOne,
  onDeleteFuture,
  onDeleteSeries,
  onClose,
}) {
  const dialog = (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center 
                 bg-purple-200/30 backdrop-blur-md"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="bg-gradient-to-br from-purple-50 to-white/90
                   border border-purple-200/50 rounded-2xl shadow-2xl 
                   p-8 w-[420px] space-y-6 animate-modalPop"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-semibold text-purple-700 text-center">
          Delete recurring task
        </h2>

        <p className="text-gray-700 text-center">
          This task repeats. What do you want to delete?
          <br />
          <span className="text-purple-600 font-medium">{date}</span>
        </p>

        <div className="space-y-3">
          <button
            className="w-full px-5 py-3 rounded-xl bg-purple-200 text-purple-800 hover:bg-purple-300"
            onClick={onDeleteOne}
          >
            Delete only this event
          </button>

          <button
            className="w-full px-5 py-3 rounded-xl bg-purple-200 text-purple-800 hover:bg-purple-300"
            onClick={onDeleteFuture}
          >
            Delete this and all future events
          </button>

          <button
            className="w-full px-5 py-3 rounded-xl bg-red-500 text-white hover:bg-red-600"
            onClick={onDeleteSeries}
          >
            Delete entire series
          </button>
        </div>

        <div className="flex justify-end pt-2">
          <button
            className="px-4 py-2 rounded-xl bg-purple-200 text-purple-800 hover:bg-purple-300"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(dialog, document.body);
}
