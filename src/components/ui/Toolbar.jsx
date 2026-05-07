import { ArrowCounterClockwise, UploadSimple, DownloadSimple, FilePdf, FileDoc, CircleNotch } from "@phosphor-icons/react";
import { useCVStore } from "../../store/useCVStore";

const TEMPLATES = [
  { id: "tech",     label: "Tech" },
  { id: "manager",  label: "Manager" },
  { id: "designer", label: "Designer" },
];

const DESIGNER_PALETTES = [
  { id: "noir-gold",        label: "Noir & Gold" },
  { id: "indigo-electric",  label: "Indigo Electric" },
  { id: "forest-stone",     label: "Forest & Stone" },
];

export function Toolbar({ activeSection, onExportPDF, onExportDOCX, onExportJSON, onImportJSON, onExportCoverLetterPDF, onExportCoverLetterDOCX, exporting }) {
  const isCoverLetter = activeSection === "coverLetter";
  const template         = useCVStore((s) => s.template);
  const designerPalette  = useCVStore((s) => s.designerPalette);
  const setTemplate      = useCVStore((s) => s.setTemplate);
  const setDesignerPalette = useCVStore((s) => s.setDesignerPalette);
  const resetCV          = useCVStore((s) => s.resetCV);

  const handleReset = () => {
    if (window.confirm("Resettare il CV ai dati di default? I dati correnti verranno persi.")) {
      resetCV();
    }
  };

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
              template === t.id
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
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
                designerPalette === p.id
                  ? "bg-purple-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
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
        {!isCoverLetter && (
          <>
            <button
              onClick={handleReset}
              disabled={!!exporting}
              title="Ripristina i dati di default"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs font-medium text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-30"
            >
              <ArrowCounterClockwise size={14} />
              Reset
            </button>

            <div className="w-px h-5 bg-gray-200" />

            <button
              onClick={onImportJSON}
              disabled={!!exporting}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors border border-gray-300 disabled:opacity-50"
            >
              <UploadSimple size={14} />
              Carica CV
            </button>
            <button
              onClick={onExportJSON}
              disabled={!!exporting}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors border border-gray-300 disabled:opacity-50"
            >
              <DownloadSimple size={14} />
              JSON
            </button>
            <button
              onClick={onExportDOCX}
              disabled={!!exporting}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-colors border disabled:opacity-50 ${
                exporting === "docx"
                  ? "bg-blue-200 text-blue-700 border-blue-300 cursor-wait"
                  : "bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200"
              }`}
            >
              {exporting === "docx"
                ? <><CircleNotch size={14} className="animate-spin" /> DOCX…</>
                : <><FileDoc size={14} /> DOCX</>
              }
            </button>
            <button
              onClick={onExportPDF}
              disabled={!!exporting}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-colors disabled:opacity-50 ${
                exporting === "pdf"
                  ? "bg-red-400 text-white cursor-wait"
                  : "bg-red-600 text-white hover:bg-red-700"
              }`}
            >
              {exporting === "pdf"
                ? <><CircleNotch size={14} className="animate-spin" /> PDF…</>
                : <><FilePdf size={14} /> PDF</>
              }
            </button>
          </>
        )}

        {isCoverLetter && (
          <>
            <span className="text-xs text-gray-400 font-medium mr-1">Esporta Cover Letter:</span>
            <button
              onClick={onExportCoverLetterDOCX}
              disabled={!!exporting}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-colors border disabled:opacity-50 ${
                exporting === "cl-docx"
                  ? "bg-indigo-200 text-indigo-700 border-indigo-300 cursor-wait"
                  : "bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border-indigo-200"
              }`}
            >
              {exporting === "cl-docx"
                ? <><CircleNotch size={14} className="animate-spin" /> DOCX…</>
                : <><FileDoc size={14} /> DOCX</>
              }
            </button>
            <button
              onClick={onExportCoverLetterPDF}
              disabled={!!exporting}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-colors disabled:opacity-50 ${
                exporting === "cl-pdf"
                  ? "bg-red-400 text-white cursor-wait"
                  : "bg-red-600 text-white hover:bg-red-700"
              }`}
            >
              {exporting === "cl-pdf"
                ? <><CircleNotch size={14} className="animate-spin" /> PDF…</>
                : <><FilePdf size={14} /> PDF</>
              }
            </button>
          </>
        )}
      </div>
    </header>
  );
}
