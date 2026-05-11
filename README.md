# CV Builder

> A fully client-side resume builder with real-time preview, multi-format export, AI-assisted cover letters, and multilingual support — no account, no server, no data leaves your browser.

![React](https://img.shields.io/badge/React-19-61DAFB?style=flat&logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?style=flat&logo=tailwindcss&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-green?style=flat)

---

## Features

### Templates

| Template | Description |
|---|---|
| **Tech Developer** | Clean two-column layout; skills, tech stacks, projects front and center |
| **Managerial Executive** | Structured single-column; highlights leadership and seniority |
| **Creative Designer** | Accent sidebar with color palettes; stands out visually |

Each template supports **custom color palettes** and **per-template font size tuning**.

### Editor

- **Live preview** — updates in real time as you type
- **Drag & drop** — reorder experiences, education, skills, languages, and certifications
- **Rich text descriptions** — bold, italic, underline, bullet lists via Tiptap
- **Photo upload & repositioning** — drag inside the frame to pick the exact crop
- **Note / additional info section** — freeform field rendered at the bottom of the CV
- **IT / EN editor UI** — switch the entire interface language

### Export

- **PDF** — pixel-accurate, font-embedded, generated in-browser via `@react-pdf/renderer`
- **DOCX** — Word format compatible with ATS recruiting software
- **JSON** — full CV state export/import to save and resume work any time

### Multilingual

- **CV content** in **IT · EN · DE · ES** — switch language to auto-translate fields via DeepL
- **Language levels** auto-localize to the active CV language (Native → Madrelingua → Muttersprache…)
- No raw translated strings stored — levels are stored as keys, rendered in the correct language at display/export time

### Cover Letter

- Dedicated section: target role, key highlights, tone selector
- One-click generation of an AI-ready prompt for Claude or ChatGPT
- Spontaneous application variant included

### Data & Privacy

- All data lives in `localStorage` — nothing sent to any server except DeepL (opt-in, requires your own API key)
- Import/export JSON for local backup

---

## Getting started

**Requirements:** Node.js 18+ and npm

```bash
# Clone
git clone https://github.com/your-username/cv-builder.git
cd cv-builder

# Install
npm install

# Dev server
npm run dev
```

App available at `http://localhost:5173`.

### Production build

```bash
npm run build
npm run preview   # test the build locally
```

### Deploy to Vercel

The project includes a `vercel.json` configured with SPA routing and CSP headers.
Connect the repo to Vercel — deployments trigger automatically on push.

```bash
npx vercel --prod
```

---

## Tech stack

| Technology            | Version | Purpose                      |
|-----------------------|---------|------------------------------|
| React                 | 19      | UI framework                 |
| Vite                  | 5       | Bundler                      |
| Tailwind CSS          | 4       | Styling                      |
| Zustand               | 5       | State management             |
| @react-pdf/renderer   | 4       | In-browser PDF generation    |
| docx                  | 9       | DOCX generation              |
| Tiptap                | 3       | Rich text editor             |
| i18next               | 26      | Editor UI & CV localization  |
| @phosphor-icons/react | 2       | Icons                        |
| DeepL API             | —       | CV content translation       |

---

## Project structure

```
src/
├── components/
│   ├── editor/        # Data entry forms (PersonalInfo, Experience, Skills…)
│   ├── preview/       # CV preview + 3 template implementations
│   └── ui/            # Shared components (Sidebar, SectionCard, RichTextEditor…)
├── data/              # Default CV data, ATS keywords
├── exporters/         # PDF (per template) and DOCX export logic
├── i18n/              # CV content translations (IT, EN, DE, ES)
├── services/          # DeepL integration, cover letter prompt builder
├── store/             # Zustand store with localStorage persistence
└── utils/             # CV locale helpers, translation utilities
```

---

## Support the project

Open source, completely free.
If it saved you time, a coffee is always welcome:

[![Ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/lorisparata)
