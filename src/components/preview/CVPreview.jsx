import { useState } from "react";
import { useCVStore } from "../../store/useCVStore";
import { TechDeveloper } from "./templates/TechDeveloper";
import { ManagerialExec } from "./templates/ManagerialExec";
import { CreativeDesigner } from "./templates/CreativeDesigner";

// Livelli di zoom predefiniti (snap)
const ZOOM_STEPS = [0.4, 0.5, 0.6, 0.7, 0.75, 0.8, 0.9, 1.0, 1.1, 1.25, 1.5, 1.75, 2.0];

function TemplateRouter({ template, designerPalette, data, customColors }) {
  if (template === "tech")     return <TechDeveloper data={data} customColors={customColors} />;
  if (template === "manager")  return <ManagerialExec data={data} customColors={customColors} />;
  if (template === "designer") return <CreativeDesigner data={data} palette={designerPalette} customColors={customColors} />;
  return <TechDeveloper data={data} customColors={customColors} />;
}

// ─── Controlli zoom ──────────────────────────────────────────────────────────
function ZoomControls({ zoom, onZoom, onReset }) {
  const pct = Math.round(zoom * 100);
  const canZoomIn  = zoom < ZOOM_STEPS[ZOOM_STEPS.length - 1];
  const canZoomOut = zoom > ZOOM_STEPS[0];

  const btnBase = "w-7 h-7 flex items-center justify-center rounded-full text-sm font-bold transition-colors select-none";

  return (
    <div style={{
      position: "absolute",
      bottom: 16,
      right: 20,
      zIndex: 10,
      display: "flex",
      alignItems: "center",
      gap: 4,
      backgroundColor: "rgba(15, 20, 30, 0.78)",
      borderRadius: 24,
      padding: "4px 6px",
      backdropFilter: "blur(6px)",
      boxShadow: "0 2px 8px rgba(0,0,0,0.35)",
      userSelect: "none",
    }}>
      {/* Zoom out */}
      <button
        onClick={onZoom(-1)}
        disabled={!canZoomOut}
        title="Rimpicciolisci (−)"
        className={`${btnBase} ${canZoomOut ? "text-gray-200 hover:bg-white/20" : "text-gray-600 cursor-not-allowed"}`}
      >
        −
      </button>

      {/* Percentuale — clic resetta a 100% */}
      <button
        onClick={onReset}
        title="Reimposta a 100%"
        style={{
          minWidth: 44,
          fontSize: 11,
          fontWeight: 600,
          color: zoom === 1 ? "#9ca3af" : "#e2e8f0",
          letterSpacing: "0.02em",
          padding: "0 4px",
          background: "none",
          border: "none",
          cursor: zoom === 1 ? "default" : "pointer",
          fontFamily: "monospace",
        }}
      >
        {pct}%
      </button>

      {/* Zoom in */}
      <button
        onClick={onZoom(+1)}
        disabled={!canZoomIn}
        title="Ingrandisci (+)"
        className={`${btnBase} ${canZoomIn ? "text-gray-200 hover:bg-white/20" : "text-gray-600 cursor-not-allowed"}`}
      >
        +
      </button>
    </div>
  );
}

// ─── Preview ─────────────────────────────────────────────────────────────────
export function CVPreview() {
  const template        = useCVStore((s) => s.template);
  const designerPalette = useCVStore((s) => s.designerPalette);
  const customPalettes  = useCVStore((s) => s.customPalettes);
  const data            = useCVStore((s) => s);

  const customColors = (customPalettes && customPalettes[template]) || {};

  // Zoom state locale — non serve persistenza nello store
  const [zoomIndex, setZoomIndex] = useState(
    ZOOM_STEPS.indexOf(1.0)   // parte a 100%
  );
  const zoom = ZOOM_STEPS[zoomIndex];

  // Funzione per spostarsi di uno step (+1 o -1)
  const handleZoom = (dir) => () => {
    setZoomIndex((i) => Math.max(0, Math.min(ZOOM_STEPS.length - 1, i + dir)));
  };
  const handleReset = () => setZoomIndex(ZOOM_STEPS.indexOf(1.0));

  // Dimensioni del documento scalato
  const DOC_W = 794;
  const DOC_H = 1123;
  const scaledW = DOC_W * zoom;
  const scaledH = DOC_H * zoom;
  const PAD_H   = 48; // 2 × 24px padding verticale
  const PAD_V   = 64; // 2 × 32px padding orizzontale

  return (
    // Contenitore principale: flex column per separare i controlli dal pannello scroll
    <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", position: "relative" }}>

      {/* Area scrollabile con il documento */}
      <div style={{ flex: 1, overflow: "auto", backgroundColor: "#d1d5db" }}>
        {/*
          Centering wrapper: la larghezza minima si adatta allo zoom
          così lo scrolling orizzontale è corretto a qualsiasi livello
        */}
        <div style={{
          minWidth: `${scaledW + PAD_H}px`,
          minHeight: `${scaledH + PAD_V}px`,
          padding: "32px 24px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          boxSizing: "border-box",
        }}>
          {/*
            Placeholder: occupa esattamente lo spazio del documento scalato.
            Il documento reale è 794×1123 e viene scalato via transform;
            senza questo placeholder il layout si baserebbe sulle dimensioni
            pre-transform (794px), lasciando spazio bianco in eccesso o
            mancante al cambio di zoom.
          */}
          <div style={{ width: scaledW, minHeight: scaledH, position: "relative", flexShrink: 0 }}>
            <div style={{
              width: DOC_W,
              minHeight: DOC_H,
              backgroundColor: "#ffffff",
              boxShadow: "0 4px 24px rgba(0,0,0,0.18)",
              transformOrigin: "top left",
              transform: `scale(${zoom})`,
            }}>
              <TemplateRouter
                template={template}
                designerPalette={designerPalette}
                data={data}
                customColors={customColors}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Pill zoom — in basso a destra, sopra l'area scroll */}
      <ZoomControls zoom={zoom} onZoom={handleZoom} onReset={handleReset} />
    </div>
  );
}
