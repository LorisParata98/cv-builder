import { useCVStore } from "../../store/useCVStore";

const SECTIONS = [
  { id: "personal", label: "Dati Personali", icon: "👤" },
  { id: "skills", label: "Competenze", icon: "⚡" },
  { id: "experience", label: "Esperienza", icon: "💼" },
  { id: "education", label: "Formazione", icon: "🎓" },
  { id: "certifications", label: "Certificazioni", icon: "🏆" },
  { id: "languages", label: "Lingue", icon: "🌍" },
  { id: "projects", label: "Progetti", icon: "🚀" },
];

export function Sidebar({ activeSection, onSectionChange }) {
  return (
    <aside className="w-[220px] flex-shrink-0 bg-gray-900 text-white flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-4 border-b border-gray-700">
        <h1 className="text-base font-semibold text-white tracking-tight">
          CV Builder
        </h1>
        <p className="text-xs text-gray-400 mt-0.5">Editor professionale</p>
      </div>

      {/* Navigazione sezioni */}
      <nav className="flex-1 py-3 overflow-y-auto">
        <p className="px-5 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
          Sezioni
        </p>
        {SECTIONS.map((section) => (
          <button
            key={section.id}
            onClick={() => onSectionChange(section.id)}
            className={`w-full flex items-center gap-3 px-5 py-2.5 text-sm transition-colors text-left ${
              activeSection === section.id
                ? "bg-blue-600 text-white"
                : "text-gray-300 hover:bg-gray-800 hover:text-white"
            }`}
          >
            <span className="text-base leading-none">{section.icon}</span>
            <span>{section.label}</span>
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-gray-700 text-xs text-gray-500">
        v1.0.0 · Client-side
      </div>
    </aside>
  );
}
