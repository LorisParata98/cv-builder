# CV Builder

A web application for creating professional resumes, with real-time preview, PDF and DOCX export, automatic translation via DeepL, and an AI-assisted Cover Letter builder.

---

## What it does

CV Builder is a fully client-side tool for building your resume visually and interactively — no account required, no data sent to third-party servers.

**Key features:**

- **3 professional templates** — Tech Developer, Managerial Executive, Creative Designer
- **Live preview** — the preview updates in real time as you fill in the fields
- **PDF export** — pixel-accurate PDF generation directly in the browser
- **DOCX export** — Word format export compatible with ATS recruiting software
- **JSON export / import** — save and reload your CV at any time
- **Automatic translation** — DeepL integration to translate CV content (IT, EN, DE, ES)
- **Custom color palette** — per-template color customization
- **Custom font sizes** — per-template font size tuning via range sliders
- **Drag & drop** — reorder experiences, education, skills and certifications by dragging
- **Photo repositioning** — drag your photo inside the frame to pick the perfect crop
- **Local persistence** — data is automatically saved in localStorage
- **IT / EN editor UI** — the entire editor interface can be switched between Italian and English
- **Cover Letter builder** — dedicated section to compile target role, highlights and tone; generates an AI-ready prompt for Claude or ChatGPT to produce a tailored cover letter
- **Spontaneous application prompt** — one-click prompt generation for unsolicited applications
- **Phosphor icons** — clean, consistent iconography throughout the UI

---

## Getting started

**Requirements:** Node.js 18+ and npm

```bash
# 1. Clone the repository
git clone https://github.com/your-username/cv-builder.git
cd cv-builder

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`.

### Production build

```bash
npm run build
npm run preview   # to test the build locally
```

### Deploy to Vercel

The project already includes a `vercel.json` configured with SPA routing and CSP security headers.
Just connect the repository to Vercel — deployments happen automatically on every push.

```bash
# or via CLI
npx vercel --prod
```

---

## Tech stack

| Technology            | Version | Purpose             |
| --------------------- | ------- | ------------------- |
| React                 | 19      | UI framework        |
| Vite                  | 5       | Bundler             |
| Tailwind CSS          | 4       | Styling             |
| Zustand               | 5       | State management    |
| @react-pdf/renderer   | 4       | PDF generation      |
| docx                  | 9       | DOCX generation     |
| @phosphor-icons/react | 2       | Icons               |
| DeepL API             | —       | Content translation |

---

## Project structure

```
src/
├── components/
│   ├── editor/        # Data entry forms
│   ├── preview/       # CV preview and templates
│   └── ui/            # Shared UI components (Sidebar, Toolbar...)
├── data/              # Default data and ATS keywords
├── exporters/         # PDF and DOCX export logic
├── locales/           # Section translations (IT, EN-GB, DE, ES) + editor UI labels (IT/EN)
├── services/          # DeepL integration, cover letter prompt builder
└── store/             # Zustand store with localStorage persistence
```

---

## Support the project

This project is open source and completely free to use.
If you found it helpful and want to buy me a coffee, you can do so here:

**Ko-fi:** https://ko-fi.com/lorisparata

<!-- **PayPal:** https://paypal.me/lorisparata -->

Any contribution is appreciated and helps keep the project alive. Thank you!
