# CV Builder — Project Overview

## Cosa fa

App web per creare, editare e esportare CV professionali. Editor + anteprima live side-by-side. 3 template grafici. Export in PDF e DOCX. Traduzione automatica via DeepL.

**Sezioni CV gestite:** Personal Info, Skills, Experience, Education, Certifications, Languages, Projects, Cover Letter, Note.

---

## Stack

| Layer | Libreria | Versione |
|---|---|---|
| Framework | React | 19.2.5 |
| Bundler | Vite | 5.4.21 |
| State | Zustand | 5.0.13 |
| Styling | Tailwind CSS | 4.2.4 |
| Rich text | Tiptap | 3.23.1 |
| PDF export | @react-pdf/renderer | 4.5.1 |
| DOCX export | docx | 9.6.1 |
| i18n | i18next + react-i18next | 26 / 17 |
| Icons | @phosphor-icons/react | 2.1.10 |
| IDs | uuid | 14.0.0 |

---

## Script

```bash
npm run dev      # dev server su localhost:5173
npm run build    # build produzione → dist/
npm run preview  # anteprima build locale
npm run lint     # ESLint
```

---

## Struttura `src/`

```
src/
├── components/
│   ├── editor/          # Form per ogni sezione CV (input utente)
│   ├── preview/         # Anteprima live + 3 template
│   │   └── templates/   # TechDeveloper, ManagerialExec, CreativeDesigner
│   └── ui/              # Componenti riusabili (SectionCard, RichTextEditor, DateInput…)
├── store/
│   └── useCVStore.js    # ← unica fonte di verità (Zustand)
├── exporters/           # Logica export PDF + DOCX per ogni template
├── i18n/cv/             # Stringhe CV (sezioni, livelli) in IT/EN/DE/ES
│   └── {it,en,de,es}.json
├── translation/
│   └── i18n.js          # Setup i18next (stringhe UI)
├── services/            # translateCV.js (DeepL), PromptBuilder.js
├── utils/               # urlUtils.js, cvLocales.js, translationUtils.jsx
├── data/                # defaultCV.js, atsKeywords.js, frameworkVersions.js
├── App.jsx              # Root: layout, navigazione sezioni, toast, export handlers
└── main.jsx             # Entry point (createRoot)
```

---

## Backend / Deploy

- Deploy: **Vercel** (`vercel.json` in root)
- Serverless function: `api/translate.js` — proxy per DeepL API
- In dev: Vite proxia `/api` → `http://localhost:3000`
- `.env.local` contiene `VITE_DEEPL_API_KEY` o simili

---

## Persistenza dati

- Zustand salva su `localStorage` con debounce 400ms
- Key principale: `"cv-builder:state"`
- Foto profilo separata: `"cv-builder:photo"` (base64)
- DeepL API key: `"cv-builder:deepl-key"`
- JSON import/export disponibile dalla toolbar
