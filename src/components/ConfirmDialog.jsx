import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export default function ConfirmDialog({
  open,
  title = "Confirm Action",
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "primary",
  onConfirm,
  onCancel,
}) {
  const [visible, setVisible] = useState(open);

  useEffect(() => {
    if (open) setVisible(true);
  }, [open]);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onCancel, 200); // wait for fade-out
  };

  if (!visible && !open) return null;

  const confirmClasses =
    variant === "danger"
      ? "bg-rose-500/80 hover:bg-rose-600"
      : "bg-purple-500/80 hover:bg-purple-600";

  const dialog = (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center 
                  transition-opacity duration-200 
                  ${open ? "opacity-100" : "opacity-0"} 
                  bg-purple-200/30 backdrop-blur-md`}
    >
      <div
        className={`bg-gradient-to-br from-purple-50 to-white/90 backdrop-blur-xl 
                    border border-purple-200/50 rounded-2xl shadow-2xl p-6 w-96 space-y-5
                    transition-all duration-300 animate-modalPop`}
      >
        <h2 className="text-2xl font-semibold text-purple-700 text-center mb-2">
          {title}
        </h2>
        <p className="text-slate-700 text-center leading-relaxed">{message}</p>

        <div className="flex justify-end gap-3 pt-4">
          <button
            onClick={handleClose}
            className="px-4 py-2 rounded-xl bg-purple-200/60 text-purple-800 
                       hover:bg-purple-300/80 hover:shadow-md transition-all"
          >
            {cancelLabel}
          </button>
          <button
            onClick={() => {
              setVisible(false);
              setTimeout(onConfirm, 200);
            }}
            className={`px-4 py-2 rounded-xl text-white shadow-md transition-all ${confirmClasses}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(dialog, document.body);
}
