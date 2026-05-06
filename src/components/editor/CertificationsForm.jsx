import { useRef, useState } from "react";
import { DotsSixVertical, Certificate, Star } from "@phosphor-icons/react";
import { useCVStore } from "../../store/useCVStore";
import { SectionCard } from "../ui/SectionCard";

export function CertificationsForm() {
  const certifications      = useCVStore((s) => s.certifications);
  const setCertifications   = useCVStore((s) => s.setCertifications);
  const addCertification    = useCVStore((s) => s.addCertification);
  const removeCertification = useCVStore((s) => s.removeCertification);
  const updateCertification = useCVStore((s) => s.updateCertification);

  const dragIndex = useRef(null);
  const [dragOver, setDragOver] = useState(null);

  const reorder = (from, to) => {
    if (from === to || from === null) return;
    const arr = [...certifications];
    const [moved] = arr.splice(from, 1);
    arr.splice(to, 0, moved);
    setCertifications(arr);
  };

  return (
    <SectionCard title="Certificazioni" icon={<Certificate size={15} weight="duotone" />}>
      <div className="space-y-2.5">
        {certifications.map((cert, i) => (
          <div
            key={i}
            draggable
            onDragStart={() => { dragIndex.current = i; }}
            onDragOver={(e) => { e.preventDefault(); setDragOver(i); }}
            onDrop={() => { reorder(dragIndex.current, i); setDragOver(null); dragIndex.current = null; }}
            onDragEnd={() => { setDragOver(null); dragIndex.current = null; }}
            style={{ opacity: dragIndex.current === i ? 0.4 : 1 }}
            className={`flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors ${
              dragOver === i && dragIndex.current !== i ? "bg-blue-50 ring-1 ring-blue-300" : ""
            }`}
          >
            <span
              title="Trascina per riordinare"
              className="text-gray-300 hover:text-gray-500 cursor-grab active:cursor-grabbing flex-shrink-0 select-none flex items-center"
            >
              <DotsSixVertical size={18} weight="bold" />
            </span>
            <Star size={13} weight="fill" className="text-blue-400 flex-shrink-0" />
            <input
              type="text"
              value={cert}
              onChange={(e) => updateCertification(i, e.target.value)}
              placeholder="Es. AWS Certified Developer – Associate (2023)"
              className="flex-1 border border-gray-300 rounded px-2.5 py-2 text-xs text-gray-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            {certifications.length > 1 && (
              <button
                onClick={() => removeCertification(i)}
                className="text-gray-300 hover:text-red-400 text-sm flex-shrink-0"
              >
                ✕
              </button>
            )}
          </div>
        ))}
      </div>
      <button
        onClick={addCertification}
        className="mt-3.5 w-full text-sm py-2.5 border-2 border-dashed border-gray-300 text-gray-500 rounded-lg hover:border-blue-400 hover:text-blue-500 transition-colors"
      >
        + Aggiungi certificazione
      </button>
    </SectionCard>
  );
}
