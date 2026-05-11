export const defaultCV = {
  template: "tech",
  designerPalette: "noir-gold",

  personal: {
    name: "John Doe",
    title: "Senior Frontend Developer",
    email: "test@yopmail.com",
    phone: "+39 333 000 0000",
    location: "Milano, Italia",
    website: "github.com/johndoe",
    linkedin: "linkedin.com/in/johndoe",
    summary:
      "<p>Frontend developer con oltre 5 anni di esperienza nella progettazione e sviluppo di applicazioni web scalabili. Specializzato in <strong>Angular</strong>, <strong>React</strong> e architetture component-based. Appassionato di performance, accessibilità e developer experience.</p>",
    photo: null,
    photoPosition: { x: 50, y: 50 },
  },

  skills: [
    {
      category: "Frontend",
      tags: [
        { label: "Angular",      versionsRange: "v8–v20", atsKeywords: ["Angular","Angular 8","Angular 11","Angular 14","Angular 17","Angular 18","Angular 20"] },
        { label: "React",        versionsRange: "16–19",  atsKeywords: ["React","React 16","React 18","React 19","React.js"] },
        { label: "TypeScript",   versionsRange: null,     atsKeywords: ["TypeScript","TypeScript 5"] },
        { label: "Vue.js",       versionsRange: "2 & 3",  atsKeywords: ["Vue.js","Vue 2","Vue 3","Vue.js 2","Vue.js 3"] },
        { label: "HTML5 / CSS3", versionsRange: null,     atsKeywords: ["HTML5","CSS3","HTML","CSS"] },
        { label: "Tailwind CSS", versionsRange: null,     atsKeywords: ["Tailwind CSS","Tailwind"] },
      ],
    },
    {
      category: "Backend & Tools",
      tags: [
        { label: "Node.js",  versionsRange: null, atsKeywords: ["Node.js","Node","NodeJS"] },
        { label: "REST API", versionsRange: null, atsKeywords: ["REST API","RESTful API","REST"] },
        { label: "Git",      versionsRange: null, atsKeywords: ["Git","GitHub","GitLab"] },
        { label: "Docker",   versionsRange: null, atsKeywords: ["Docker","Docker Compose"] },
      ],
    },
    {
      category: "Testing",
      tags: [
        { label: "Jest",    versionsRange: null, atsKeywords: ["Jest","unit testing"] },
        { label: "Cypress", versionsRange: null, atsKeywords: ["Cypress","E2E testing","end-to-end testing"] },
      ],
    },
  ],

  experience: [
    {
      id: "exp-1",
      company: "Acme Corp",
      role: "Senior Frontend Developer",
      location: "Milano, Italia",
      startDate: "2022-03",
      endDate: "present",
      description: "<ul><li><p>Sviluppato e mantenuto un'applicazione <strong>Angular enterprise</strong> con oltre 50 moduli e 200k+ utenti attivi mensili</p></li><li><p>Migrato il codebase da Angular 11 a Angular 18, riducendo il bundle size del <strong>35%</strong></p></li><li><p>Introdotto Cypress per i test E2E, portando la copertura dal 20% all'<strong>80%</strong></p></li><li><p>Guidato un team di 4 sviluppatori frontend su architettura micro-frontend</p></li></ul>",
    },
    {
      id: "exp-2",
      company: "StartupXYZ",
      role: "Frontend Developer",
      location: "Remote",
      startDate: "2019-09",
      endDate: "2022-02",
      description: "<ul><li><p>Realizzato da zero una <strong>SPA React</strong> con TypeScript per la gestione di workflow aziendali</p></li><li><p>Implementato design system condiviso con Storybook, adottato da 3 team di prodotto</p></li><li><p>Integrato API REST e GraphQL, gestendo stato applicativo con Redux Toolkit</p></li><li><p>Collaborato con il team UX in cicli Agile bi-settimanali</p></li></ul>",
    },
  ],

  education: [
    {
      id: "edu-1",
      institution: "Politecnico di Milano",
      degree: "Laurea Triennale",
      field: "Ingegneria Informatica",
      grade: "110/110",
      startDate: "2015-09",
      endDate: "2019-07",
      thesis: "Sviluppo di un'applicazione web per la visualizzazione di dati IoT in tempo reale",
    },
  ],

  certifications: [
    "AWS Certified Developer – Associate (2023)",
    "Google UX Design Certificate (2022)",
  ],

  languages: [
    { language: "Italiano", level: "Madrelingua" },
    { language: "Inglese",  level: "C1 – Avanzato" },
  ],

  projects: [
    "CV Builder — Webapp React per la generazione di CV professionali con export PDF/DOCX (github.com/lorisparata/cv-builder)",
    "IoT Dashboard — Dashboard Angular per il monitoraggio di sensori industriali in real-time",
  ],

  targetLanguage: null,
  deepLApiKey: "",
};
