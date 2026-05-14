# CV Builder — Conventions & Patterns

## Export dei componenti

Named export ovunque, tranne `App.jsx` che usa default:

```jsx
// ✓ Pattern standard nel progetto
export function ExperienceForm({ ... }) { }
export function SectionCard({ title, icon, children }) { }

// Solo App.jsx
export default function App() { }
```

Template memoizzati per performance (evitano re-render a ogni keystroke nell'editor):

```jsx
export const TechDeveloper = memo(function TechDeveloper() {
  // legge da useCVStore
})
```

---

## Uso di Zustand Store

```jsx
import { useCVStore } from '../store/useCVStore'

// ✓ Corretto: destructure solo ciò che serve
const { experience, addExperience, updateExperience, removeExperience } = useCVStore()

// ✗ Evitare: subscription all'intero store causa re-render su qualsiasi cambio
const store = useCVStore()
```

Pattern azioni per sezioni con array:
- `addXxx()` — aggiunge entry vuota con uuid
- `updateXxx(id, partial)` — merge parziale per ID
- `removeXxx(id)` — rimuove per ID
- `setXxx(value)` — replace completo (per oggetti come `personal`)

---

## Aggiungere una nuova sezione CV

Checklist ordinata:

1. **Store** — `src/store/useCVStore.js`: aggiungi slice nello stato iniziale + azioni (add/update/remove/set)
2. **Form** — `src/components/editor/NuovaSezioneForm.jsx`: crea il form che legge/scrive dallo store
3. **EditorPanel** — `src/components/editor/EditorPanel.jsx`: aggiungi il case per la nuova sezione
4. **Sidebar** — `src/components/ui/Sidebar.jsx`: aggiungi voce di navigazione con icona
5. **Template** — `src/components/preview/templates/*.jsx`: aggiungi il rendering della sezione
6. **Exporters** — `src/exporters/exportPDF*.jsx` e `exportDOCX.js`: aggiungi la sezione all'export
7. **i18n** — `src/i18n/cv/{it,en,de,es}.json`: aggiungi le stringhe in tutte le lingue

---

## i18n: quando usare quale namespace

```jsx
// Stringhe template CV (nomi sezioni, livelli lingua, "Presente", mesi)
const { t } = useTranslation('cv')
t('cv:sections.experience')

// Stringhe UI (label form, bottoni, sidebar, messaggi)
const { t } = useTranslation()
t('toolbar.exportPDF')
```

---

## Rich Text (Tiptap)

Descrizioni experience e projects sono **HTML** (non plain text):

```jsx
// Store: description è una stringa HTML es. "<p>Ho lavorato su...</p><ul><li>feat A</li></ul>"
// Leggere con:
<RichTextEditor value={description} onChange={(html) => updateExperience(id, { description: html })} />

// Export DOCX: exportDOCX.js converte HTML → docx nodes (gestisce p, ul, ol, li, strong, em, u)
// Export PDF: exportPDF*.jsx parsa HTML e usa componenti @react-pdf/renderer
```

---

## Date

Formato date nello store: stringa `"YYYY-MM"` o stringa vuota `""`.

`"present"` / campo vuoto endDate → "Presente" nel template.

Componente `DateInput` gestisce già il toggle presente.

---

## Icone

Usare sempre `@phosphor-icons/react`:

```jsx
import { Briefcase, GraduationCap, Code } from '@phosphor-icons/react'
<Briefcase size={18} weight="bold" />
```

Non mixare con altre librerie di icone.

---

## Pattern ricorrenti nei form

Ogni form editor segue questo pattern:

```jsx
export function ExperienceForm() {
  const { experience, addExperience, updateExperience, removeExperience } = useCVStore()

  return (
    <SectionCard title="Experience" icon={<Briefcase />}>
      {experience.map((entry) => (
        <ExperienceCard
          key={entry.id}
          entry={entry}
          onChange={(partial) => updateExperience(entry.id, partial)}
          onRemove={() => removeExperience(entry.id)}
        />
      ))}
      <button onClick={addExperience}>Aggiungi</button>
    </SectionCard>
  )
}
```

Stato locale (`useState`) solo per UI effimera: espansione card, editing inline, tooltip visibili.

---

## Cosa non fare

- Non creare un secondo store o Context API — tutto passa per `useCVStore`
- Non modificare direttamente l'array nello store — usare le azioni `updateXxx`/`removeXxx`
- Non usare `useEffect` per sincronizzare stato derivato — calcolare in render o con selector
- Non aggiungere logica di business nei componenti template (`TechDeveloper` ecc.) — sono solo rendering
