import { useRef, useCallback } from "react";
import { User, ArrowsOutCardinal } from "@phosphor-icons/react";
import { useTranslation } from "react-i18next";
import { useCVStore } from "../../store/useCVStore";
import { SectionCard } from "../ui/SectionCard";
import { RichTextEditor } from "../ui/RichTextEditor";

const CIRCLE_PX = 96;

function PhotoPositioner({ photo, position, onChange }) {
  const { t } = useTranslation();
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
        title={t("editor.personal.photoTitle")}
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
        {t("editor.personal.photoDragHint")}
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
  const { t } = useTranslation();

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return;
    if (file.size > 2 * 1024 * 1024) {
      alert(t("editor.personal.photoTooBig"));
      return;
    }
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      const MAX = 400;
      const scale = Math.min(1, MAX / Math.max(img.width, img.height));
      const w = Math.round(img.width * scale);
      const h = Math.round(img.height * scale);
      const canvas = document.createElement("canvas");
      canvas.width  = w;
      canvas.height = h;
      canvas.getContext("2d").drawImage(img, 0, 0, w, h);
      const compressed = canvas.toDataURL("image/jpeg", 0.82);
      setPersonal({ photo: compressed, photoPosition: { x: 50, y: 50 } });
    };
    img.src = objectUrl;
  };

  const handlePositionChange = useCallback((newPos) => {
    setPersonal({ photoPosition: newPos });
  }, [setPersonal]);

  return (
    <SectionCard title={t("editor.personal.title")} icon={<User size={15} weight="duotone" />}>
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
            {personal.photo ? t("editor.personal.changePhoto") : t("editor.personal.uploadPhoto")}
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
              {t("editor.personal.removePhoto")}
            </button>
          )}
        </div>
      </div>

      <Field label={t("editor.personal.fullName")}  value={personal.name}     onChange={(v) => setPersonal({ name: v })}     placeholder={t("editor.personal.fullNamePh")} />
      <Field label={t("editor.personal.jobTitle")}  value={personal.title}    onChange={(v) => setPersonal({ title: v })}    placeholder={t("editor.personal.jobTitlePh")} />
      <Field label={t("editor.personal.email")}     value={personal.email}    onChange={(v) => setPersonal({ email: v })}    type="email" placeholder={t("editor.personal.emailPh")} />
      <Field label={t("editor.personal.phone")}     value={personal.phone}    onChange={(v) => setPersonal({ phone: v })}    placeholder={t("editor.personal.phonePh")} />
      <Field label={t("editor.personal.location")}  value={personal.location} onChange={(v) => setPersonal({ location: v })} placeholder={t("editor.personal.locationPh")} />
      <Field label={t("editor.personal.website")}   value={personal.website}  onChange={(v) => setPersonal({ website: v })}  placeholder={t("editor.personal.websitePh")} />
      <Field label={t("editor.personal.linkedin")}  value={personal.linkedin} onChange={(v) => setPersonal({ linkedin: v })} placeholder={t("editor.personal.linkedinPh")} />

      <div className="mb-4">
        <label className="block text-xs font-medium text-gray-600 mb-1.5">
          {t("editor.personal.summary")}
        </label>
        <RichTextEditor
          value={personal.summary}
          onChange={(html) => setPersonal({ summary: html })}
          placeholder={t("editor.personal.summaryPh")}
          minHeight={90}
        />
      </div>
    </SectionCard>
  );
}
