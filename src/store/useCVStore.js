import { create } from "zustand";
import { defaultCV } from "../data/defaultCV";
import i18n from "../translation/i18n";

const STORAGE_KEY = "cv-builder:state";
const DEEPL_KEY   = "cv-builder:deepl-key";
const PHOTO_KEY   = "cv-builder:photo";

function debounce(fn, ms) {
  let timer;
  return (...args) => { clearTimeout(timer); timer = setTimeout(() => fn(...args), ms); };
}

const loadFromStorage = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    const photo = localStorage.getItem(PHOTO_KEY) || null;
    return { ...parsed, personal: { ...parsed.personal, photo } };
  } catch {
    return null;
  }
};

const saveToStorage = debounce((state) => {
  try {
    const { deepLApiKey, personal, ...rest } = state;
    const { photo, ...personalRest } = personal || {};
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...rest, personal: personalRest }));
    if (photo) localStorage.setItem(PHOTO_KEY, photo);
    else localStorage.removeItem(PHOTO_KEY);
    if (deepLApiKey) localStorage.setItem(DEEPL_KEY, deepLApiKey);
  } catch {
    // Silenzioso
  }
}, 400);

// ─── Migrazione dati legacy ───────────────────────────────────────────────────
// Converte experience[].bullets (string[]) → experience[].description (HTML)
// per compatibilità con i dati salvati prima dell'introduzione del RTF editor.
function migrateState(state) {
  if (!state) return state;
  let result = state;

  if (result.experience) {
    const migrated = result.experience.map((exp) => {
      if (Array.isArray(exp.bullets) && exp.description === undefined) {
        const items = exp.bullets
          .filter(Boolean)
          .map((b) => `<li><p>${b}</p></li>`)
          .join("");
        const { bullets, ...rest } = exp;
        return { ...rest, description: items ? `<ul>${items}</ul>` : "" };
      }
      return exp;
    });
    result = { ...result, experience: migrated };
  }

  if (result.projects) {
    result = {
      ...result,
      projects: result.projects.map((p) => {
        if (typeof p === "string") return { title: p, description: "", url: "" };
        if (p.text !== undefined) return { title: p.text, description: "", url: p.url || "" };
        return p;
      }),
    };
  }

  return result;
}

const savedState = migrateState(loadFromStorage());
const savedDeepLKey = localStorage.getItem(DEEPL_KEY) || "";

const DEFAULT_CUSTOM_PALETTES = { tech: {}, manager: {}, designer: {} };
const DEFAULT_CUSTOM_FONT_SIZES = { tech: {}, manager: {}, designer: {} };

const DEFAULT_COVER_LETTER = {
  company: "",
  role: "",
  jobDescription: "",
  hiringManager: "",
  tone: "Professionale",
  highlights: ["", "", ""],
  motivation: "",
  letterBody: "",
  date: "",
  closingLine: "Cordiali saluti",
};

const initialState = {
  ...defaultCV,
  ...(savedState || {}),
  deepLApiKey: savedDeepLKey,
  customPalettes: {
    ...DEFAULT_CUSTOM_PALETTES,
    ...((savedState || {}).customPalettes || {}),
  },
  customFontSizes: {
    ...DEFAULT_CUSTOM_FONT_SIZES,
    ...((savedState || {}).customFontSizes || {}),
  },
  targetLanguage: (savedState || {}).targetLanguage || "IT",
  uiLanguage: (savedState || {}).uiLanguage || "IT",
  coverLetter: {
    ...DEFAULT_COVER_LETTER,
    ...((savedState || {}).coverLetter || {}),
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
  setCustomPaletteColor: (template, key, value) => {
    const customPalettes = {
      ...get().customPalettes,
      [template]: { ...get().customPalettes[template], [key]: value },
    };
    set({ customPalettes });
    saveToStorage({ ...get(), customPalettes });
  },

  resetCustomPalette: (template) => {
    const customPalettes = {
      ...get().customPalettes,
      [template]: {},
    };
    set({ customPalettes });
    saveToStorage({ ...get(), customPalettes });
  },

  // ─── Font sizes personalizzati ──────────────────────────────────────────────
  setCustomFontSize: (template, key, value) => {
    const customFontSizes = {
      ...get().customFontSizes,
      [template]: { ...get().customFontSizes[template], [key]: value },
    };
    set({ customFontSizes });
    saveToStorage({ ...get(), customFontSizes });
  },

  resetCustomFontSizes: (template) => {
    const customFontSizes = {
      ...get().customFontSizes,
      [template]: {},
    };
    set({ customFontSizes });
    saveToStorage({ ...get(), customFontSizes });
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

  addSkillCategory: (category = "") => {
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
      i === index ? { ...cat, ...updates } : cat,
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
          ti === tagIndex ? { ...tag, ...updates } : tag,
        ),
      };
    });
    set({ skills });
    saveToStorage({ ...get(), skills });
  },

  reorderSkillTags: (categoryIndex, fromIndex, toIndex) => {
    if (fromIndex === toIndex) return;
    const skills = get().skills.map((cat, i) => {
      if (i !== categoryIndex) return cat;
      const tags = [...cat.tags];
      const [moved] = tags.splice(fromIndex, 1);
      tags.splice(toIndex, 0, moved);
      return { ...cat, tags };
    });
    set({ skills });
    saveToStorage({ ...get(), skills });
  },

  moveSkillTag: (fromCat, fromTag, toCat, toTag) => {
    const skills = get().skills.map((cat) => ({ ...cat, tags: [...cat.tags] }));
    const [tag] = skills[fromCat].tags.splice(fromTag, 1);
    const insertAt = toTag === -1 ? skills[toCat].tags.length : toTag;
    skills[toCat].tags.splice(insertAt, 0, tag);
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
      description: "",
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
      e.id === id ? { ...e, ...updates } : e,
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
      e.id === id ? { ...e, ...updates } : e,
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
      i === index ? value : c,
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
      i === index ? { ...l, ...updates } : l,
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
    const projects = [...get().projects, { title: "", description: "", url: "" }];
    set({ projects });
    saveToStorage({ ...get(), projects });
  },

  removeProject: (index) => {
    const projects = get().projects.filter((_, i) => i !== index);
    set({ projects });
    saveToStorage({ ...get(), projects });
  },

  updateProject: (index, updates) => {
    const projects = get().projects.map((p, i) =>
      i === index ? { ...p, ...updates } : p,
    );
    set({ projects });
    saveToStorage({ ...get(), projects });
  },

  // ─── Note ───────────────────────────────────────────────────────────────────
  setNote: (note) => {
    set({ note });
    saveToStorage({ ...get(), note });
  },

  // ─── Cover Letter ────────────────────────────────────────────────────────────
  updateCoverLetter: (updates) => {
    const coverLetter = { ...get().coverLetter, ...updates };
    set({ coverLetter });
    saveToStorage({ ...get(), coverLetter });
  },

  updateCoverLetterHighlight: (index, value) => {
    const highlights = get().coverLetter.highlights.map((h, i) =>
      i === index ? value : h,
    );
    const coverLetter = { ...get().coverLetter, highlights };
    set({ coverLetter });
    saveToStorage({ ...get(), coverLetter });
  },

  resetCoverLetter: () => {
    const coverLetter = { ...DEFAULT_COVER_LETTER };
    set({ coverLetter });
    saveToStorage({ ...get(), coverLetter });
  },

  // ─── Traduzione ─────────────────────────────────────────────────────────────
  setTargetLanguage: (targetLanguage) => {
    set({ targetLanguage });
    saveToStorage({ ...get(), targetLanguage });
  },

  setUiLanguage: (uiLanguage) => {
    set({ uiLanguage });
    saveToStorage({ ...get(), uiLanguage });
    i18n.changeLanguage(uiLanguage.toLowerCase());
  },

  setDeepLApiKey: (deepLApiKey) => {
    set({ deepLApiKey });
    localStorage.setItem(DEEPL_KEY, deepLApiKey);
  },

  // ─── Reset / Import ──────────────────────────────────────────────────────────
  resetCV: () => {
    const deepLApiKey = get().deepLApiKey;
    const customPalettes = get().customPalettes;
    const newState = { ...defaultCV, deepLApiKey, customPalettes };
    set(newState);
    saveToStorage(newState);
  },

  importCV: (data) => {
    const deepLApiKey = get().deepLApiKey;
    const customPalettes = get().customPalettes;
    const newState = { ...data, deepLApiKey, customPalettes };
    set(newState);
    saveToStorage(newState);
  },
}));
