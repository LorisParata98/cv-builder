// src/locales/index.js
// Traduzioni locali dei titoli sezione per le 4 lingue supportate.
// Caricato da file — aggiornamento istantaneo senza chiamate di rete.

const IT = {
  profile:          'Profilo',
  skills:           'Competenze tecniche',
  skillsShort:      'Competenze',
  experience:       'Esperienza professionale',
  experienceShort:  'Esperienza',
  education:        'Formazione',
  certifications:   'Certificazioni',
  languages:        'Lingue',
  projects:         'Progetti',
  contacts:         'Contatti',
  present:          'Presente',
  thesis:           'Tesi',
  months: ['Gen','Feb','Mar','Apr','Mag','Giu','Lug','Ago','Set','Ott','Nov','Dic'],
};

const EN_GB = {
  profile:          'Profile',
  skills:           'Technical Skills',
  skillsShort:      'Skills',
  experience:       'Professional Experience',
  experienceShort:  'Experience',
  education:        'Education',
  certifications:   'Certifications',
  languages:        'Languages',
  projects:         'Projects',
  contacts:         'Contacts',
  present:          'Present',
  thesis:           'Thesis',
  months: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
};

const DE = {
  profile:          'Profil',
  skills:           'Technische Kenntnisse',
  skillsShort:      'Kenntnisse',
  experience:       'Berufserfahrung',
  experienceShort:  'Erfahrung',
  education:        'Ausbildung',
  certifications:   'Zertifizierungen',
  languages:        'Sprachen',
  projects:         'Projekte',
  contacts:         'Kontakt',
  present:          'Heute',
  thesis:           'Abschlussarbeit',
  months: ['Jan','Feb','Mär','Apr','Mai','Jun','Jul','Aug','Sep','Okt','Nov','Dez'],
};

const ES = {
  profile:          'Perfil',
  skills:           'Competencias técnicas',
  skillsShort:      'Competencias',
  experience:       'Experiencia profesional',
  experienceShort:  'Experiencia',
  education:        'Formación',
  certifications:   'Certificaciones',
  languages:        'Idiomas',
  projects:         'Proyectos',
  contacts:         'Contacto',
  present:          'Presente',
  thesis:           'Tesis',
  months: ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'],
};

const LOCALES = {
  'IT':    IT,
  'EN-GB': EN_GB,
  'DE':    DE,
  'ES':    ES,
};

/** Restituisce il locale per il codice lingua dato. Fallback a IT. */
export function getLocale(lang) {
  return LOCALES[lang] || IT;
}

/** Le 4 lingue supportate per i18n dei titoli sezione E per la traduzione DeepL. */
export const UI_LANGUAGES = [
  { code: 'IT',    label: 'Italiano' },
  { code: 'EN-GB', label: 'Inglese (UK)' },
  { code: 'DE',    label: 'Tedesco' },
  { code: 'ES',    label: 'Spagnolo' },
];
