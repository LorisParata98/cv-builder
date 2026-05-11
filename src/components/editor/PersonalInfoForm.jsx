import { useRef, useCallback } from "react";
import { User, ArrowsOutCardinal } from "@phosphor-icons/react";
import { useCVStore } from "../../store/useCVStore";
import { SectionCard } from "../ui/SectionCard";
import { RichTextEditor } from "../ui/RichTextEditor";
import { useEditorLabels } from "../../locales/editorLabels";

const CIRCLE_PX = 96;

function PhotoPositioner({ photo, position, onChange, L }) {
  const dragging   = useRef(false);
  const lastClient = useRef({ x: 0, y: 0 });
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
      <div
        onMouseDown={handleMouseDown}
        title={L.photoTitle}
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
        {L.photoDragHint}
      </span>
    </div>
  );
}

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

export function PersonalInfoForm() {
  const personal    = useCVStore((s) => s.personal);
  const setPersonal = useCVStore((s) => s.setPersonal);
  const { personal: L, common: LC } = useEditorLabels();

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return;
    if (file.size > 2 * 1024 * 1024) {
      alert(L.photoTooBig);
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
    <SectionCard title={L.title} icon={<User size={15} weight="duotone" />}>
      <div className="flex items-center gap-4 mb-6">
        {personal.photo ? (
          <PhotoPositioner
            photo={personal.photo}
            position={personal.photoPosition || { x: 50, y: 50 }}
            onChange={handlePositionChange}
            L={L}
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden flex-shrink-0 border-2 border-gray-300 flex items-center justify-center text-gray-400">
            <User size={28} weight="light" />
          </div>
        )}

        <div className="flex flex-col gap-1">
          <label className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-xs font-medium text-gray-700 rounded cursor-pointer border border-gray-300 text-center">
            {personal.photo ? L.changePhoto : L.uploadPhoto}
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
              {L.removePhoto}
            </button>
          )}
        </div>
      </div>

      <Field label={L.fullName}  value={personal.name}     onChange={(v) => setPersonal({ name: v })}     placeholder={L.fullNamePh} />
      <Field label={L.jobTitle}  value={personal.title}    onChange={(v) => setPersonal({ title: v })}    placeholder={L.jobTitlePh} />
      <Field label={L.email}     value={personal.email}    onChange={(v) => setPersonal({ email: v })}    type="email" placeholder={L.emailPh} />
      <Field label={L.phone}     value={personal.phone}    onChange={(v) => setPersonal({ phone: v })}    placeholder={L.phonePh} />
      <Field label={L.location}  value={personal.location} onChange={(v) => setPersonal({ location: v })} placeholder={L.locationPh} />
      <Field label={L.website}   value={personal.website}  onChange={(v) => setPersonal({ website: v })}  placeholder={L.websitePh} />
      <Field label={L.linkedin}  value={personal.linkedin} onChange={(v) => setPersonal({ linkedin: v })} placeholder={L.linkedinPh} />

      <div className="mb-4">
        <label className="block text-xs font-medium text-gray-600 mb-1.5">
          {L.summary}
        </label>
        <RichTextEditor
          value={personal.summary}
          onChange={(html) => setPersonal({ summary: html })}
          placeholder={L.summaryPh}
          minHeight={90}
        />
      </div>
    </SectionCard>
  );
}
