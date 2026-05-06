import { useState } from "react";

export function SectionCard({ title, icon, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden mb-3">
      {/* Header collassabile */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
      >
        <span className="flex items-center gap-2 text-sm font-semibold text-gray-800">
          {icon && <span className="text-base">{icon}</span>}
          {title}
        </span>
        <span className="text-gray-400 text-xs">{open ? "▲" : "▼"}</span>
      </button>

      {/* Contenuto */}
      {open && (
        <div className="px-4 py-5 bg-white">
          {children}
        </div>
      )}
    </div>
  );
}
