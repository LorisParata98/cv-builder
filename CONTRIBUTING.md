# Contributing to CV Builder

Thank you for your interest in contributing! This document explains how to get started and what to expect.

## Table of Contents

- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [How to Contribute](#how-to-contribute)
- [Pull Request Guidelines](#pull-request-guidelines)
- [Code Style](#code-style)
- [Reporting Bugs](#reporting-bugs)
- [Suggesting Features](#suggesting-features)

---

## Getting Started

CV Builder is a client-side web app for building professional CVs with live preview, multiple templates, and export to PDF/DOCX. It is built with:

- **React 19** + **Vite 5**
- **Tailwind CSS v4** (native Vite plugin — no PostCSS config)
- **Zustand 5** for state management
- **@react-pdf/renderer** for PDF export
- **docx** for DOCX export

---

## Development Setup

### Prerequisites

- Node.js 18+
- npm 9+

### Install and run

```bash
git clone https://github.com/LorisParata98/cv-builder.git
cd cv-builder
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

### Build

```bash
npm run build
```

Output goes to `dist/`. The app is a SPA — `vercel.json` handles client-side routing rewrites.

---

## Project Structure

```
src/
  App.jsx                   # Root layout, resize logic, export handlers, toast, DeepL
  main.jsx                  # ReactDOM entry point
  index.css                 # @import "tailwindcss" (Tailwind v4 syntax)
  store/
    useCVStore.js           # Zustand store — all CRUD operations, localStorage persistence
  data/
    defaultCV.js            # Default CV data and template config
    atsKeywords.js          # ATS keyword lists by role (tech / manager / designer)
    frameworkVersions.js    # Framework keyword dictionary
  services/
    translateCV.js          # DeepL batch translation, language list
  exporters/
    exportPDF.jsx           # react-pdf/renderer v4 — PDF generation with ATS hidden text
    exportDOCX.js           # docx v9 — DOCX generation via Packer.toBlob()
  components/
    ui/
      Sidebar.jsx           # Section nav + collapsible DeepL panel
      Toolbar.jsx           # Template switcher, color palette, export, reset
      SectionCard.jsx       # Collapsible section card
    editor/
      EditorPanel.jsx       # Routes section → form component
      PersonalInfoForm.jsx
      SkillsForm.jsx        # Tag editor + ATS hints panel
      ExperienceForm.jsx    # Bullet list editor
      EducationForm.jsx
      CertificationsForm.jsx
      LanguagesForm.jsx
      ProjectsForm.jsx
    preview/
      CVPreview.jsx         # Live preview with correct horizontal scroll
      templates/
        TechDeveloper.jsx
        ManagerialExec.jsx
        CreativeDesigner.jsx
```

**Key architectural notes:**

- All CV data lives in Zustand and is persisted to `localStorage` under the key `cv-builder:state`.
- The DeepL API key is stored separately under `cv-builder:deepl-key`.
- The preview panel enforces a minimum width of 794px (A4) inside a scrollable container — do not break this when editing layout.
- Tailwind v4 uses `@import "tailwindcss"` in `index.css` — do not add `postcss.config.js`.

---

## How to Contribute

### Good first issues

Look for issues tagged `good first issue` — these are self-contained tasks that don't require deep knowledge of the whole codebase.

### Workflow

1. Fork the repository.
2. Create a branch from `main` with a descriptive name:
   ```bash
   git checkout -b feat/my-new-template
   # or
   git checkout -b fix/pdf-export-crash
   ```
3. Make your changes. Keep commits focused — one logical change per commit.
4. Open a Pull Request against `main`.

### Branch naming

| Prefix      | Use for                              |
| ----------- | ------------------------------------ |
| `feat/`     | New features                         |
| `fix/`      | Bug fixes                            |
| `chore/`    | Dependency updates, tooling          |
| `docs/`     | Documentation only                   |
| `refactor/` | Code changes with no behavior change |

---

## Pull Request Guidelines

- Keep PRs focused and small. A PR that does one thing is easier to review.
- Add a clear description of **what** changed and **why**.
- If your PR fixes a bug, link the issue (e.g. `Fixes #42`).
- If your PR changes the UI, include a screenshot or short screen recording.
- Make sure the app builds without errors before opening the PR:
  ```bash
  npm run build
  ```

---

## Code Style

- **Components**: functional components only, no class components.
- **State**: use the existing Zustand store (`useCVStore`). Do not introduce new global state solutions.
- **Styling**: Tailwind utility classes only. Avoid inline styles and custom CSS unless strictly necessary.
- **Exports**: named exports for components; default export as the last line of the file.
- **No TypeScript** (not used in this project — keep it plain JSX).

---

## Reporting Bugs

Open an issue with:

1. What you expected to happen.
2. What actually happened.
3. Steps to reproduce.
4. Browser and OS.

For export bugs (PDF/DOCX), please also mention which template and whether the issue happens with the default data or custom data.

---

## Suggesting Features

Open an issue with the `enhancement` label. Describe the use case — not just the feature — so we can understand the problem being solved.

If you want to add a **new CV template**, please open an issue first to discuss the design before implementing it, as templates have specific layout requirements (A4 dimensions, font loading via Google Fonts in `index.html`, color palette structure).

---

## License

By contributing, you agree that your contributions will be licensed under the same license as this project.
