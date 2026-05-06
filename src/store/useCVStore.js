import { create } from "zustand";
import { defaultCV } from "../data/defaultCV";

// Chiave localStorage
const STORAGE_KEY = "cv-builder:state";
const DEEPL_KEY = "cv-builder:deepl-key";

// Carica stato da localStorage (se presente)
const loadFromStorage = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

// Salva stato su localStorage (esclusa deepLApiKey — ha chiave dedicata)
const saveToStorage = (state) => {
  try {
    const { deepLApiKey, ...rest } = state;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rest));
    if (deepLApiKey) {
      localStorage.setItem(DEEPL_KEY, deepLApiKey);
    }
  } catch {
    // Silenzioso — localStorage potrebbe non essere disponibile
  }
};

const savedState = loadFromStorage();
const savedDeepLKey = localStorage.getItem(DEEPL_KEY) || "";

// Palette custom di default (vuote = usa i colori predefiniti del template)
const DEFAULT_CUSTOM_PALETTES = { tech: {}, manager: {}, designer: {} };

const initialState = {
  ...defaultCV,
  ...(savedState || {}),
  deepLApiKey: savedDeepLKey,
  // Assicura che customPalettes sia sempre presente anche su stato salvato vecchio
  customPalettes: {
    ...DEFAULT_CUSTOM_PALETTES,
    ...((savedState || {}).customPalettes || {}),
  },
};

export const useCVStore = create((set, get) => ({
  ...initialState,

  // ─── Metadati ───────────────────────────────────────────────────────────────
  setTemplate: (template) => {
    set({ template });
    saveToStorage({ ...get(), template });
  },

  setDesignerPalette: (designerPalette) => {
    set({ designerPalette });
    saveToStorage({ ...get(), designerPalette });
  },

  // ─── Palette personalizzate ─────────────────────────────────────────────────
  // Imposta un singolo colore custom per un template
  // template: "tech" | "manager" | "designer"
  // key: chiave colore (es. "bg", "accent")
  // value: stringa hex (es. "#ff0000")
  setCustomPaletteColor: (template, key, value) => {
    const customPalettes = {
      ...get().customPalettes,
      [template]: { ...get().customPalettes[template], [key]: value },
    };
    set({ customPalettes });
    saveToStorage({ ...get(), customPalettes });
  },

  // Resetta tutti i colori custom di un template ai default
  resetCustomPalette: (template) => {
    const customPalettes = {
      ...get().customPalettes,
      [template]: {},
    };
    set({ customPalettes });
    saveToStorage({ ...get(), customPalettes });
  },

  // ─── Dati personali ─────────────────────────────────────────────────────────
  setPersonal: (updates) => {
    const personal = { ...get().personal, ...updates };
    set({ personal });
    saveToStorage({ ...get(), personal });
  },

  // ─── Skills ─────────────────────────────────────────────────────────────────
  setSkills: (skills) => {
    set({ skills });
    saveToStorage({ ...get(), skills });
  },

  addSkillCategory: (category = "Nuova categoria") => {
    const skills = [...get().skills, { category, tags: [] }];
    set({ skills });
    saveToStorage({ ...get(), skills });
  },

  removeSkillCategory: (index) => {
    const skills = get().skills.filter((_, i) => i !== index);
    set({ skills });
    saveToStorage({ ...get(), skills });
  },

  updateSkillCategory: (index, updates) => {
    const skills = get().skills.map((cat, i) =>
      i === index ? { ...cat, ...updates } : cat
    );
    set({ skills });
    saveToStorage({ ...get(), skills });
  },

  addSkillTag: (categoryIndex, tag) => {
    const skills = get().skills.map((cat, i) => {
      if (i !== categoryIndex) return cat;
      return { ...cat, tags: [...cat.tags, tag] };
    });
    set({ skills });
    saveToStorage({ ...get(), skills });
  },

  removeSkillTag: (categoryIndex, tagIndex) => {
    const skills = get().skills.map((cat, i) => {
      if (i !== categoryIndex) return cat;
      return { ...cat, tags: cat.tags.filter((_, ti) => ti !== tagIndex) };
    });
    set({ skills });
    saveToStorage({ ...get(), skills });
  },

  updateSkillTag: (categoryIndex, tagIndex, updates) => {
    const skills = get().skills.map((cat, i) => {
      if (i !== categoryIndex) return cat;
      return {
        ...cat,
        tags: cat.tags.map((tag, ti) =>
          ti === tagIndex ? { ...tag, ...updates } : tag
        ),
      };
    });
    set({ skills });
    saveToStorage({ ...get(), skills });
  },

  // ─── Experience ─────────────────────────────────────────────────────────────
  setExperience: (experience) => {
    set({ experience });
    saveToStorage({ ...get(), experience });
  },

  addExperience: () => {
    const newExp = {
      id: `exp-${Date.now()}`,
      company: "",
      role: "",
      location: "",
      startDate: "",
      endDate: "",
      bullets: [""],
    };
    const experience = [...get().experience, newExp];
    set({ experience });
    saveToStorage({ ...get(), experience });
  },

  removeExperience: (id) => {
    const experience = get().experience.filter((e) => e.id !== id);
    set({ experience });
    saveToStorage({ ...get(), experience });
  },

  updateExperience: (id, updates) => {
    const experience = get().experience.map((e) =>
      e.id === id ? { ...e, ...updates } : e
    );
    set({ experience });
    saveToStorage({ ...get(), experience });
  },

  // ─── Education ──────────────────────────────────────────────────────────────
  setEducation: (education) => {
    set({ education });
    saveToStorage({ ...get(), education });
  },

  addEducation: () => {
    const newEdu = {
      id: `edu-${Date.now()}`,
      institution: "",
      degree: "",
      field: "",
      grade: "",
      startDate: "",
      endDate: "",
      thesis: "",
    };
    const education = [...get().education, newEdu];
    set({ education });
    saveToStorage({ ...get(), education });
  },

  removeEducation: (id) => {
    const education = get().education.filter((e) => e.id !== id);
    set({ education });
    saveToStorage({ ...get(), education });
  },

  updateEducation: (id, updates) => {
    const education = get().education.map((e) =>
      e.id === id ? { ...e, ...updates } : e
    );
    set({ education });
    saveToStorage({ ...get(), education });
  },

  // ─── Certifications ─────────────────────────────────────────────────────────
  setCertifications: (certifications) => {
    set({ certifications });
    saveToStorage({ ...get(), certifications });
  },

  addCertification: () => {
    const certifications = [...get().certifications, ""];
    set({ certifications });
    saveToStorage({ ...get(), certifications });
  },

  removeCertification: (index) => {
    const certifications = get().certifications.filter((_, i) => i !== index);
    set({ certifications });
    saveToStorage({ ...get(), certifications });
  },

  updateCertification: (index, value) => {
    const certifications = get().certifications.map((c, i) =>
      i === index ? value : c
    );
    set({ certifications });
    saveToStorage({ ...get(), certifications });
  },

  // ─── Languages ──────────────────────────────────────────────────────────────
  setLanguages: (languages) => {
    set({ languages });
    saveToStorage({ ...get(), languages });
  },

  addLanguage: () => {
    const languages = [...get().languages, { language: "", level: "" }];
    set({ languages });
    saveToStorage({ ...get(), languages });
  },

  removeLanguage: (index) => {
    const languages = get().languages.filter((_, i) => i !== index);
    set({ languages });
    saveToStorage({ ...get(), languages });
  },

  updateLanguage: (index, updates) => {
    const languages = get().languages.map((l, i) =>
      i === index ? { ...l, ...updates } : l
    );
    set({ languages });
    saveToStorage({ ...get(), languages });
  },

  // ─── Projects ───────────────────────────────────────────────────────────────
  setProjects: (projects) => {
    set({ projects });
    saveToStorage({ ...get(), projects });
  },

  addProject: () => {
    const projects = [...get().projects, ""];
    set({ projects });
    saveToStorage({ ...get(), projects });
  },

  removeProject: (index) => {
    const projects = get().projects.filter((_, i) => i !== index);
    set({ projects });
    saveToStorage({ ...get(), projects });
  },

  updateProject: (index, value) => {
    const projects = get().projects.map((p, i) =>
      i === index ? value : p
    );
    set({ projects });
    saveToStorage({ ...get(), projects });
  },

  // ─── Traduzione ─────────────────────────────────────────────────────────────
  setTargetLanguage: (targetLanguage) => {
    set({ targetLanguage });
    saveToStorage({ ...get(), targetLanguage });
  },

  setDeepLApiKey: (deepLApiKey) => {
    set({ deepLApiKey });
    localStorage.setItem(DEEPL_KEY, deepLApiKey);
  },

  // ─── Reset / Import ──────────────────────────────────────────────────────────
  resetCV: () => {
    const deepLApiKey = get().deepLApiKey;
    const customPalettes = get().customPalettes; // preserva customizzazioni palette
    const newState = { ...defaultCV, deepLApiKey, customPalettes };
    set(newState);
    saveToStorage(newState);
  },

  importCV: (data) => {
    const deepLApiKey = get().deepLApiKey;
    const customPalettes = get().customPalettes; // preserva customizzazioni palette
    const newState = { ...data, deepLApiKey, customPalettes };
    set(newState);
    saveToStorage(newState);
  },
}));
