import { useState } from "react";
import { useCVStore } from "../../store/useCVStore";

// ─── Palette per template ────────────────────────────────────────────────────
const DESIGNER_PALETTES_COLORS = {
  "noir-gold":       { bg: "#0D0D0D", accent: "#C8B89A", text: "#E8E0D5" },
  "indigo-electric": { bg: "#1a1a2e", accent: "#7c3aed", text: "#e2e8f0" },
  "forest-stone":    { bg: "#1c2b1c", accent: "#8fa87c", text: "#e8ede5" },
};

function getTemplateColors(template, designerPalette, customColors = {}) {
  if (template === "tech") {
    return {
      bg:      customColors.bg     || "#0f2644",
      accent:  customColors.accent || "#4ec9b0",
      text:    "#ffffff",
      font:    "'JetBrains Mono', monospace",
      bodyFont:"inherit",
    };
  }
  if (template === "manager") {
    return {
      bg:      customColors.bg     || "#1e3a5f",
      accent:  customColors.accent || "#c8a951",
      text:    "#ffffff",
      font:    "'Playfair Display', serif",
      bodyFont:"inherit",
    };
  }
  if (template === "designer") {
    const p = DESIGNER_PALETTES_COLORS[designerPalette] || DESIGNER_PALETTES_COLORS["noir-gold"];
    return {
      bg:      customColors.bg     || p.bg,
      accent:  customColors.accent || p.accent,
      text:    p.text,
      font:    "'Fraunces', serif",
      bodyFont:"inherit",
    };
  }
  return { bg: "#0f2644", accent: "#4ec9b0", text: "#ffffff", font: "sans-serif", bodyFont: "inherit" };
}

// ─── Zoom steps (stessi di CVPreview) ────────────────────────────────────────
const ZOOM_STEPS = [0.4, 0.5, 0.6, 0.7, 0.75, 0.8, 0.9, 1.0, 1.1, 1.25, 1.5, 1.75, 2.0];

function ZoomControls({ zoom, onZoom, onReset }) {
  const pct = Math.round(zoom * 100);
  const canZoomIn  = zoom < ZOOM_STEPS[ZOOM_STEPS.length - 1];
  const canZoomOut = zoom > ZOOM_STEPS[0];
  const btnBase = "w-7 h-7 flex items-center justify-center rounded-full text-sm font-bold transition-colors select-none";
  return (
    <div
      style={{
        position: "absolute",
        bottom: 16, right: 20, zIndex: 10,
        display: "flex", alignItems: "center", gap: 4,
        backgroundColor: "rgba(15,20,30,0.78)",
        borderRadius: 24, padding: "4px 6px",
        backdropFilter: "blur(6px)",
        boxShadow: "0 2px 8px rgba(0,0,0,0.35)",
        userSelect: "none",
      }}
    >
      <button onClick={onZoom(-1)} disabled={!canZoomOut} title="Rimpicciolisci"
        className={`${btnBase} ${canZoomOut ? "text-gray-200 hover:bg-white/20" : "text-gray-600 cursor-not-allowed"}`}>−</button>
      <button onClick={onReset} title="Reimposta a 100%"
        style={{ minWidth: 44, fontSize: 11, fontWeight: 600, color: zoom === 1 ? "#9ca3af" : "#e2e8f0",
          letterSpacing: "0.02em", padding: "0 4px", background: "none", border: "none",
          cursor: zoom === 1 ? "default" : "pointer", fontFamily: "monospace" }}>
        {pct}%
      </button>
      <button onClick={onZoom(+1)} disabled={!canZoomIn} title="Ingrandisci"
        className={`${btnBase} ${canZoomIn ? "text-gray-200 hover:bg-white/20" : "text-gray-600 cursor-not-allowed"}`}>+</button>
    </div>
  );
}

// ─── Documento A4 cover letter ────────────────────────────────────────────────
function CoverLetterDocument({ data, colors }) {
  const { personal, coverLetter } = data;
  const cl = coverLetter || {};

  const today = new Date().toLocaleDateString("it-IT", {
    day: "numeric", month: "long", year: "numeric",
  });

  const dateLabel = cl.date
    ? new Date(cl.date + "T00:00:00").toLocaleDateString("it-IT", {
        day: "numeric", month: "long", year: "numeric",
      })
    : today;

  // Paragrafi del body (split su doppio a-capo)
  const paragraphs = (cl.letterBody || "")
    .split(/\n{2,}/)
    .map((p) => p.replace(/\n/g, " ").trim())
    .filter(Boolean);

  const hasContent = paragraphs.length > 0;

  return (
    <div
      style={{
        width: "794px",
        minHeight: "1123px",
        backgroundColor: "#ffffff",
        fontFamily: "'Inter', sans-serif",
        fontSize: "13.5px",
        color: "#1e293b",
        display: "flex",
        flexDirection: "column",
        boxSizing: "border-box",
      }}
    >
      {/* ── Header ── */}
      <div
        style={{
          backgroundColor: colors.bg,
          padding: "28px 40px 22px",
          display: "flex",
          alignItems: "center",
          gap: "18px",
        }}
      >
        {personal?.photo && (
          <img
            src={personal.photo}
            alt=""
            style={{
              width: "58px", height: "58px",
              borderRadius: "50%", objectFit: "cover",
              border: `2px solid ${colors.accent}`,
              flexShrink: 0,
            }}
          />
        )}
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontFamily: colors.font,
              fontSize: "22px",
              fontWeight: 700,
              color: colors.text,
              letterSpacing: "-0.01em",
              lineHeight: 1.15,
            }}
          >
            {personal?.name || "Nome Cognome"}
          </div>
          {(personal?.role || personal?.title) && (
            <div style={{ fontSize: "12px", color: colors.accent, marginTop: "4px", fontWeight: 500 }}>
              {personal.role || personal.title}
            </div>
          )}
          {/* Contatti in riga */}
          <div
            style={{
              marginTop: "8px",
              display: "flex",
              flexWrap: "wrap",
              gap: "12px",
              fontSize: "10.5px",
              color: "rgba(255,255,255,0.65)",
            }}
          >
            {personal?.email && <span>{personal.email}</span>}
            {personal?.phone && <span>{personal.phone}</span>}
            {personal?.location && <span>{personal.location}</span>}
            {personal?.linkedin && <span>{personal.linkedin}</span>}
          </div>
        </div>
      </div>

      {/* ── Riga accento ── */}
      <div style={{ height: "3px", backgroundColor: colors.accent }} />

      {/* ── Corpo lettera ── */}
      <div style={{ flex: 1, padding: "36px 48px 40px" }}>
        {/* Data */}
        <div
          style={{
            fontSize: "11.5px",
            color: "#64748b",
            marginBottom: "24px",
            textAlign: "right",
          }}
        >
          {dateLabel}
        </div>

        {/* Destinatario */}
        {(cl.company || cl.role || cl.hiringManager) && (
          <div style={{ marginBottom: "28px", fontSize: "13px", lineHeight: 1.6, color: "#334155" }}>
            {cl.hiringManager && (
              <div style={{ fontWeight: 600 }}>{cl.hiringManager}</div>
            )}
            {cl.company && <div>{cl.company}</div>}
            {cl.role && (
              <div style={{ fontSize: "12px", color: "#64748b" }}>
                Rif.: {cl.role}
              </div>
            )}
          </div>
        )}

        {/* Apertura formula */}
        {cl.hiringManager ? (
          <div style={{ marginBottom: "18px", fontWeight: 500, color: "#1e293b" }}>
            Gentile {cl.hiringManager},
          </div>
        ) : (
          <div style={{ marginBottom: "18px", fontWeight: 500, color: "#1e293b" }}>
            Gentile Team {cl.company || "Hiring"},
          </div>
        )}

        {/* Body */}
        {hasContent ? (
          paragraphs.map((para, i) => (
            <p
              key={i}
              style={{
                marginBottom: i < paragraphs.length - 1 ? "16px" : 0,
                lineHeight: 1.75,
                color: "#1e293b",
              }}
            >
              {para}
            </p>
          ))
        ) : (
          <div
            style={{
              padding: "32px",
              border: "2px dashed #e2e8f0",
              borderRadius: "8px",
              textAlign: "center",
              color: "#94a3b8",
              fontSize: "12.5px",
              lineHeight: 1.7,
            }}
          >
            <div style={{ fontSize: "24px", marginBottom: "8px" }}>✦</div>
            <div style={{ fontWeight: 600, marginBottom: "6px" }}>Testo non ancora inserito</div>
            <div>
              Usa il form a sinistra per generare il prompt AI,
              <br />poi incolla il testo nel campo "Corpo della lettera".
            </div>
          </div>
        )}

        {/* Chiusura */}
        {hasContent && (
          <div style={{ marginTop: "32px", lineHeight: 1.7, color: "#1e293b" }}>
            <div style={{ marginBottom: "24px" }}>
              {cl.closingLine || "Cordiali saluti"},
            </div>
            <div
              style={{
                fontFamily: colors.font,
                fontSize: "15px",
                fontWeight: 700,
                color: colors.bg,
              }}
            >
              {personal?.name || ""}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Export ───────────────────────────────────────────────────────────────────
export function CoverLetterPreview() {
  const template       = useCVStore((s) => s.template);
  const designerPalette= useCVStore((s) => s.designerPalette);
  const customPalettes = useCVStore((s) => s.customPalettes);
  const data           = useCVStore((s) => s);

  const customColors = (customPalettes && customPalettes[template]) || {};
  const colors = getTemplateColors(template, designerPalette, customColors);

  const [zoomIndex, setZoomIndex] = useState(ZOOM_STEPS.indexOf(1.0));
  const zoom = ZOOM_STEPS[zoomIndex];

  const handleZoom = (dir) => () => {
    setZoomIndex((i) => Math.max(0, Math.min(ZOOM_STEPS.length - 1, i + dir)));
  };
  const handleReset = () => setZoomIndex(ZOOM_STEPS.indexOf(1.0));

  const DOC_W = 794;
  const DOC_H = 1123;
  const scaledW = DOC_W * zoom;
  const scaledH = DOC_H * zoom;

  return (
    <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", position: "relative" }}>
      <div style={{ flex: 1, overflow: "auto", backgroundColor: "#d1d5db" }}>
        <div
          style={{
            minWidth: `${scaledW + 48}px`,
            minHeight: `${scaledH + 64}px`,
            padding: "32px 24px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            boxSizing: "border-box",
          }}
        >
          <div style={{ width: scaledW, minHeight: scaledH, position: "relative", flexShrink: 0 }}>
            <div
              style={{
                width: DOC_W,
                minHeight: DOC_H,
                backgroundColor: "#ffffff",
                boxShadow: "0 4px 24px rgba(0,0,0,0.18)",
                transformOrigin: "top left",
                transform: `scale(${zoom})`,
              }}
            >
              <CoverLetterDocument data={data} colors={colors} />
            </div>
          </div>
        </div>
      </div>
      <ZoomControls zoom={zoom} onZoom={handleZoom} onReset={handleReset} />
    </div>
  );
}
