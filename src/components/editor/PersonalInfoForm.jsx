import { useRef, useCallback } from "react";
import { User, ArrowsOutCardinal } from "@phosphor-icons/react";
import { useCVStore } from "../../store/useCVStore";
import { SectionCard } from "../ui/SectionCard";
import { AutoTextarea } from "../ui/AutoTextarea";

// ─── Drag-to-reposition foto ──────────────────────────────────────────────────
// Permette all'utente di trascinare la foto dentro il cerchio per scegliere
// quale parte dell'immagine viene mostrata (objectPosition CSS).
// Sensibilità: trascinare tutto il diametro del cerchio = 100% di spostamento.
const CIRCLE_PX = 96;

function PhotoPositioner({ photo, position, onChange }) {
  const dragging   = useRef(false);
  const lastClient = useRef({ x: 0, y: 0 });
  // ref che rispecchia sempre il valore corrente di position (evita stale closure)
  const posRef     = useRef(position);
  posRef.current   = position;

  const handleMouseDown = useCallback((e) => {
    e.preventDefault();
    dragging.current    = true;
    lastClient.current  = { x: e.clientX, y: e.clientY };
    document.body.style.cursor     = "grabbing";
    document.body.style.userSelect = "none";

    const onMove = (e) => {
      if (!dragging.current) return;
      const dx = e.clientX - lastClient.current.x;
      const dy = e.clientY - lastClient.current.y;
      lastClient.current = { x: e.clientX, y: e.clientY };
      // Dragging right → vediamo la parte sinistra dell'immagine → x diminuisce
      onChange({
        x: Math.min(100, Math.max(0, posRef.current.x - (dx / CIRCLE_PX) * 100)),
        y: Math.min(100, Math.max(0, posRef.current.y - (dy / CIRCLE_PX) * 100)),
      });
    };

    const onUp = () => {
      dragging.current               = false;
      document.body.style.cursor     = "";
      document.body.style.userSelect = "";
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup",   onUp);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup",   onUp);
  }, [onChange]);

  const pos = position || { x: 50, y: 50 };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
      {/* Cerchio draggable */}
      <div
        onMouseDown={handleMouseDown}
        title="Trascina per riposizionare la foto"
        style={{
          width:        CIRCLE_PX,
          height:       CIRCLE_PX,
          borderRadius: "50%",
          overflow:     "hidden",
          border:       "2px solid #3b82f6",
          cursor:       "grab",
          position:     "relative",
          flexShrink:   0,
          userSelect:   "none",
        }}
      >
        <img
          src={photo}
          alt="Anteprima"
          style={{
            width:          "100%",
            height:         "100%",
            objectFit:      "cover",
            objectPosition: `${pos.x}% ${pos.y}%`,
            pointerEvents:  "none",
            display:        "block",
          }}
        />
        {/* Overlay con icona — sempre visibile, bassa opacità */}
        <div style={{
          position:       "absolute",
          inset:          0,
          borderRadius:   "50%",
          background:     "rgba(0,0,0,0.22)",
          display:        "flex",
          alignItems:     "center",
          justifyContent: "center",
          pointerEvents:  "none",
        }}>
          <ArrowsOutCardinal size={22} color="white" weight="bold" />
        </div>
      </div>
      <span style={{ fontSize: 10, color: "#9ca3af", lineHeight: 1.3, textAlign: "center" }}>
        Trascina per<br />riposizionare
      </span>
    </div>
  );
}

// ─── Campo generico ───────────────────────────────────────────────────────────
function Field({ label, value, onChange, type = "text", placeholder = "" }) {
  return (
    <div className="mb-4">
      <label className="block text-xs font-medium text-gray-600 mb-1.5">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full border border-gray-300 rounded px-2.5 py-2 text-sm text-gray-800 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
      />
    </div>
  );
}

// ─── Form principale ──────────────────────────────────────────────────────────
export function PersonalInfoForm() {
  const personal    = useCVStore((s) => s.personal);
  const setPersonal = useCVStore((s) => s.setPersonal);

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return;
    if (file.size > 2 * 1024 * 1024) {
      alert("Foto troppo grande (max 2MB)");
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) =>
      setPersonal({ photo: ev.target.result, photoPosition: { x: 50, y: 50 } });
    reader.readAsDataURL(file);
  };

  const handlePositionChange = useCallback((newPos) => {
    setPersonal({ photoPosition: newPos });
  }, [setPersonal]);

  return (
    <SectionCard title="Dati Personali" icon={<User size={15} weight="duotone" />}>
      {/* Foto + controlli */}
      <div className="flex items-center gap-4 mb-6">
        {personal.photo ? (
          <PhotoPositioner
            photo={personal.photo}
            position={personal.photoPosition || { x: 50, y: 50 }}
            onChange={handlePositionChange}
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden flex-shrink-0 border-2 border-gray-300 flex items-center justify-center text-gray-400">
            <User size={28} weight="light" />
          </div>
        )}

        <div className="flex flex-col gap-1">
          <label className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-xs font-medium text-gray-700 rounded cursor-pointer border border-gray-300 text-center">
            {personal.photo ? "Cambia foto" : "Carica foto"}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoUpload}
            />
          </label>
          {personal.photo && (
            <button
              onClick={() => setPersonal({ photo: null, photoPosition: { x: 50, y: 50 } })}
              className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-xs font-medium text-red-600 rounded border border-red-200"
            >
              Rimuovi
            </button>
          )}
        </div>
      </div>

      <Field label="Nome completo"        value={personal.name}     onChange={(v) => setPersonal({ name: v })}     placeholder="Es. Mario Rossi" />
      <Field label="Titolo professionale" value={personal.title}    onChange={(v) => setPersonal({ title: v })}    placeholder="Es. Senior Frontend Developer" />
      <Field label="Email"                value={personal.email}    onChange={(v) => setPersonal({ email: v })}    type="email" placeholder="mario@esempio.it" />
      <Field label="Telefono"             value={personal.phone}    onChange={(v) => setPersonal({ phone: v })}    placeholder="+39 333 000 0000" />
      <Field label="Città / Nazione"      value={personal.location} onChange={(v) => setPersonal({ location: v })} placeholder="Milano, Italia" />
      <Field label="Sito web / GitHub"    value={personal.website}  onChange={(v) => setPersonal({ website: v })}  placeholder="github.com/tuoprofilo" />
      <Field label="LinkedIn"             value={personal.linkedin} onChange={(v) => setPersonal({ linkedin: v })} placeholder="linkedin.com/in/tuoprofilo" />

      <div className="mb-4">
        <label className="block text-xs font-medium text-gray-600 mb-1.5">
          Sommario professionale
        </label>
        <AutoTextarea
          value={personal.summary}
          onChange={(e) => setPersonal({ summary: e.target.value })}
          placeholder="Breve descrizione del tuo profilo..."
          rows={4}
          className="w-full border border-gray-300 rounded px-2.5 py-2 text-sm text-gray-800 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
    </SectionCard>
  );
}
