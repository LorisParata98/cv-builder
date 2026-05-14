# CV Builder — Architecture

## Data Flow

```
┌─────────────────────────────────────┐
│  Editor Forms (src/components/editor)│
│  PersonalInfoForm, ExperienceForm… │
└──────────────┬──────────────────────┘
               │ store.setXxx() / store.addXxx()
               ▼
┌─────────────────────────────────────┐
│  useCVStore  (src/store/useCVStore) │  ← Zustand store
│  Unica fonte di verità              │
│  Auto-save → localStorage (400ms)  │
└──────────┬──────────────────────────┘
           │ componenti leggono stato direttamente
     ┌─────┴─────┐
     ▼           ▼
CVPreview    CoverLetterPreview
(preview     (preview live
 live)        cover letter)
     │
     ▼
Template router
  ├─ TechDeveloper.jsx
  ├─ ManagerialExec.jsx
  └─ CreativeDesigner.jsx
           │
           ▼ (on export click)
┌──────────────────────────┐
│  useExportHandlers()     │  ← custom hook in App.jsx
│  exportPDF*.jsx          │  → @react-pdf/renderer (JSX→PDF)
│  exportDOCX.js           │  → docx lib (HTML Tiptap → DOCX)
└──────────────────────────┘
```

---

## State: Zustand Store

**File:** [src/store/useCVStore.js](../src/store/useCVStore.js)

### Struttura stato

```js
{
  // Template e tema
  template: "tech" | "manager" | "designer",
  designerPalette: "noir-gold" | "indigo-electric" | "forest-stone",
  customPalettes: { tech: {}, manager: {}, designer: {} },
  customFontSizes: { tech: {}, manager: {}, designer: {} },

  // Dati CV
  personal: { name, title, email, phone, location, website, linkedin, summary, photo, photoPosition },
  skills: [{ category, tags: [{ label, versionsRange, atsKeywords }] }],
  experience: [{ id, company, role, location, startDate, endDate, description }],  // description = HTML
  education: [{ id, institution, degree, field, grade, startDate, endDate, thesis }],
  certifications: [string],
  languages: [{ language, level }],
  projects: [{ title, description, url }],  // description = HTML
  note: string,
  coverLetter: { company, role, jobDescription, hiringManager, tone, highlights, motivation, letterBody, date, closingLine },

  // Impostazioni
  uiLanguage: "IT" | "EN" | "DE" | "ES",
  targetLanguage: "IT" | "EN-GB" | "DE" | "ES",
  deepLApiKey: string,
}
```

### Azioni principali

- `setPersonal(partial)` — merge parziale su `personal`
- `setSkills(skills)` — replace array
- `addExperience()` — aggiunge entry vuota
- `updateExperience(id, partial)` — update per ID
- `removeExperience(id)` — rimuove per ID
- Pattern identico per education, certifications, languages, projects

---

## Componenti

### Layout generale (App.jsx)

```
App.jsx
├── Sidebar          (navigazione sezioni, palette customizer, DeepL panel)
├── SidebarDivider   (toggle collapse sidebar)
├── Toolbar          (template switcher, bottoni export/import)
└── Content Row
    ├── EditorPanel  (mostra il form attivo basandosi su activeSection)
    ├── ResizeHandle (drag-to-resize pannello editor)
    └── CVPreview / CoverLetterPreview
```

### Editor (`src/components/editor/`)

Ogni file = un form per una sezione. `EditorPanel.jsx` fa il routing:

```jsx
// EditorPanel.jsx — pattern switch/case su activeSection
if (activeSection === 'experience') return <ExperienceForm />
if (activeSection === 'skills') return <SkillsForm />
// …
```

Ogni form legge/scrive direttamente da `useCVStore`.

### Preview (`src/components/preview/`)

- `CVPreview.jsx` — wrapper con zoom controls, fa routing al template
- Template wrapped in `memo()` per evitare re-render a ogni keystroke
- Ogni template è puro rendering: legge da store, non ha stato locale

### UI riusabili (`src/components/ui/`)

| Componente | Uso |
|---|---|
| `SectionCard` | Wrapper collassabile per sezioni del form |
| `RichTextEditor` | Editor Tiptap (bold, italic, liste) per description |
| `DateInput` | Date picker con toggle "presente" |
| `AutoTextarea` | Textarea che cresce automaticamente |
| `LanguagePicker` | Dropdown selezione lingua UI |
| `Toolbar` | Barra superiore con template switcher + export |
| `Sidebar` | Nav + settings + DeepL |

---

## Export

### PDF (`exporters/exportPDF*.jsx`)

- Usa `@react-pdf/renderer`: scrivi JSX speciale → genera PDF
- **Non** usa html2canvas o screenshot del DOM
- Ogni template ha il suo exporter con stili dedicati
- Colori risolti da `customPalettes` dello store
- File-saver triggera il download browser

### DOCX (`exporters/exportDOCX.js`)

- Usa libreria `docx`
- Converte HTML da Tiptap → docx nodes manualmente
- Gestisce: `<p>`, `<ul>/<ol>/<li>`, `<strong>`, `<em>`, `<u>`

---

## i18n

Due namespace separati:

| Namespace | File | Uso |
|---|---|---|
| `cv` | `src/i18n/cv/{it,en,de,es}.json` | Stringhe nei template CV (nomi sezioni, livelli lingua, mesi) |
| `translation` | caricato via HTTP backend | Stringhe UI (sidebar, bottoni, form label) |

```jsx
const { t } = useTranslation('cv')      // → stringhe template
const { t } = useTranslation()          // → stringhe UI
```

Lingua UI: `useCVStore().uiLanguage` → cambia i18next language  
Lingua CV export: `useCVStore().targetLanguage` → usata da DeepL

---

## Standard React rispettati

| Pratica | Stato |
|---|---|
| Functional components | ✓ Ovunque |
| Hooks (useState, useEffect, useRef, memo) | ✓ Corretta |
| State management moderno (Zustand) | ✓ No Redux boilerplate |
| Feature-based directory structure | ✓ |
| Named exports (tranne root App) | ✓ |
| memo() su componenti pesanti | ✓ Template tutti memoizzati |
| React 19 (latest) | ✓ |
| Vite (bundler moderno) | ✓ |
| TypeScript | ✗ Solo JSX (scelta progetto small-medium) |
| PropTypes | ✗ Assenti (rilevante se chiesto) |
| Test (unit/integration) | ✗ Nessun file .test.js |

### Note su scelte non standard

**No React Router** — navigazione custom con `activeSection` stato locale in App.jsx. Funziona bene per SPA senza URL routing. Se l'app crescesse con URL condivisibili o deep-link, si aggiungerebbe.

**App.jsx 434 righe** — un po' grande. La logica export è già isolata in `useExportHandlers()`. Ulteriore split possibile ma non urgente.

**Mix Tailwind + inline styles** — Tailwind per component styling, inline styles per layout dinamico (larghezze calcolate JS per il resize panel). Non ideale ma comune per layout interattivi.
