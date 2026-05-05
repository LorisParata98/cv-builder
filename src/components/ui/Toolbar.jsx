import { useCVStore } from "../../store/useCVStore";

const TEMPLATES = [
  { id: "tech", label: "Tech" },
  { id: "manager", label: "Manager" },
  { id: "designer", label: "Designer" },
];

const DESIGNER_PALETTES = [
  { id: "noir-gold", label: "Noir & Gold" },
  { id: "indigo-electric", label: "Indigo Electric" },
  { id: "forest-stone", label: "Forest & Stone" },
];

export function Toolbar({ onExportPDF, onExportDOCX, onExportJSON, onImportJSON, exporting }) {
  const template = useCVStore((s) => s.template);
  const designerPalette = useCVStore((s) => s.designerPalette);
  const setTemplate = useCVStore((s) => s.setTemplate);
  const setDesignerPalette = useCVStore((s) => s.setDesignerPalette);

  return (
    <header className="h-12 bg-white border-b border-gray-200 flex items-center px-4 gap-4 flex-shrink-0">
      {/* Template switcher */}
      <div className="flex items-center gap-1">
        <span className="text-xs text-gray-500 mr-2 font-medium">Template:</span>
        {TEMPLATES.map((t) => (
          <button
            key={t.id}
            onClick={() => setTemplate(t.id)}
            className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
              template === t.id ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Sub-palette designer */}
      {template === "designer" && (
        <div className="flex items-center gap-1 border-l border-gray-200 pl-4">
          <span className="text-xs text-gray-500 mr-1">Palette:</span>
          {DESIGNER_PALETTES.map((p) => (
            <button
              key={p.id}
              onClick={() => setDesignerPalette(p.id)}
              className={`px-2 py-1 rounded text-xs transition-colors ${
                designerPalette === p.id ? "bg-purple-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      )}

      <div className="flex-1" />

      {/* Export / Import */}
      <div className="flex items-center gap-2">
        <button
          onClick={onImportJSON}
          disabled={!!exporting}
          className="px-3 py-1.5 rounded text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors border border-gray-300 disabled:opacity-50"
        >
          ↑ Carica CV
        </button>
        <button
          onClick={onExportJSON}
          disabled={!!exporting}
          className="px-3 py-1.5 rounded text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors border border-gray-300 disabled:opacity-50"
        >
          ↓ JSON
        </button>
        <button
          onClick={onExportDOCX}
          disabled={!!exporting}
          className={`px-3 py-1.5 rounded text-xs font-medium transition-colors border disabled:opacity-50 ${
            exporting === 'docx'
              ? "bg-blue-200 text-blue-700 border-blue-300 cursor-wait"
              : "bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200"
          }`}
        >
          {exporting === 'docx' ? '⏳ DOCX…' : '↓ DOCX'}
        </button>
        <button
          onClick={onExportPDF}
          disabled={!!exporting}
          className={`px-3 py-1.5 rounded text-xs font-medium transition-colors disabled:opacity-50 ${
            exporting === 'pdf'
              ? "bg-red-400 text-white cursor-wait"
              : "bg-red-600 text-white hover:bg-red-700"
          }`}
        >
          {exporting === 'pdf' ? '⏳ PDF…' : '↓ PDF'}
        </button>
      </div>
    </header>
  );
}
