import { useEffect } from "react";

export default function Toast({ message, type = "info", onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 2500);
    return () => clearTimeout(timer);
  }, [onClose]);

  const colors = {
    info: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
    success: "bg-green-500/15 text-green-300 border-green-500/30",
    error: "bg-red-500/15 text-red-300 border-red-500/30",
    warning: "bg-yellow-500/15 text-yellow-300 border-yellow-500/30",
  };

  return (
    <div className="fixed top-4 right-4 z-100 animate-slide-in">
      <div
        className={`px-4 py-2.5 rounded-lg border text-sm font-medium ${colors[type]}`}
      >
        {message}
      </div>
    </div>
  );
}
