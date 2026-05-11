import { NotePencil } from "@phosphor-icons/react";
import { useTranslation } from "react-i18next";
import { useCVStore } from "../../store/useCVStore";
import { SectionCard } from "../ui/SectionCard";
import { RichTextEditor } from "../ui/RichTextEditor";

export function NoteForm() {
  const note    = useCVStore((s) => s.note);
  const setNote = useCVStore((s) => s.setNote);
  const { t } = useTranslation();

  return (
    <SectionCard title={t("editor.note.title")} icon={<NotePencil size={15} weight="duotone" />}>
      <RichTextEditor
        value={note}
        onChange={setNote}
        placeholder={t("editor.note.notePh")}
        minHeight={120}
      />
    </SectionCard>
  );
}
