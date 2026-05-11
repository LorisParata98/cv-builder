import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Link,
  pdf,
} from "@react-pdf/renderer";
import {
  makeHref,
  shortenWebsite,
  shortenLinkedIn,
} from "../utils/urlUtils.js";
import { saveAs } from "file-saver";
import { useTranslation } from "react-i18next";
import { useEditorLabels } from "../locales/editorLabels.js";

// ─── Font registration ────────────────────────────────────────────────────────
// Usiamo font system-safe: Helvetica (sans) già built-in in react-pdf
// Per monospace usiamo Courier (built-in)
// NOTA: Helvetica usa WinAnsiEncoding → supporta solo Latin-1 (U+0000-U+00FF)
//       Tutti i simboli/emoji Unicode vanno sostituiti con ASCII puro

// ─── Colori (stessa palette TechDeveloper HTML) ───────────────────────────────
const C = {
  navy: "#0f2644",
  navyLight: "#162f52",
  teal: "#4ec9b0",
  white: "#ffffff",
  textMuted: "#8fa8c8",
  body: "#1a1a2e",
  bodyMuted: "#4a5568",
  tagBg: "#1a3a60",
  tagText: "#ffffff",
  border: "#dde3ed",
};

// ─── Stili ────────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 10,
    color: C.body,
    backgroundColor: C.white,
    // paddingTop: margine superiore sulle pagine di continuazione (pag. 2+)
    // Sulla pag. 1 crea uno spazio bianco minimo sopra l'header — accettabile
    paddingTop: 20,
    // paddingBottom: impedisce che il contenuto tocchi il bordo inferiore
    // su ogni pagina, incluse quelle di overflow
    paddingBottom: 40,
  },
  // Header
  header: {
    backgroundColor: C.navy,
    // Compensiamo il paddingTop della Page con un margine negativo
    // così l'header rimane a filo del bordo superiore su pag. 1
    marginTop: -20,
    padding: "24 32 20 32",
    flexDirection: "row",
    gap: 16,
  },
  photo: {
    width: 64,
    height: 64,
    objectFit: "cover",
  },
  headerInfo: { flex: 1 },
  name: {
    fontFamily: "Courier-Bold",
    fontSize: 20,
    color: C.white,
    marginBottom: 4,
  },
  title: {
    fontFamily: "Courier",
    fontSize: 10,
    color: C.teal,
    marginBottom: 8,
  },
  contactRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 4, // Spazio tra la riga contatti e la riga link
    marginLeft: 0,
  },
  linkRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  contactGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2, // Spazio minimo tra "Portfolio:" e il link vero e proprio
  },
  contact: {
    fontSize: 8,
    color: C.textMuted,
  },
  contactAccent: {
    fontSize: 8,
    color: C.teal,
    textDecoration: "none",
  },
  // Body — paddingTop ridotto: lo spazio superiore su pag. 1 viene dal padding
  // dell'header; su pag. 2+ la Page.paddingTop da già 20pt
  body: { paddingHorizontal: 32, paddingTop: 20, paddingBottom: 8 },
  // Section header
  sectionRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    marginTop: 4,
  },
  sectionIcon: {
    fontFamily: "Courier-Bold",
    fontSize: 8,
    color: C.teal,
    marginRight: 5,
  },
  sectionLabel: {
    fontFamily: "Courier-Bold",
    fontSize: 7,
    color: C.bodyMuted,
    textTransform: "uppercase",
    letterSpacing: 1.2,
    marginRight: 6,
  },
  sectionLine: {
    flex: 1,
    height: 1,
    backgroundColor: C.border,
  },
  section: { marginBottom: 16 },
  // Summary
  summary: { fontSize: 9.5, lineHeight: 1.65, color: C.body },
  // Skills
  skillRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 5,
  },
  skillCategory: {
    fontFamily: "Courier-Bold",
    fontSize: 8,
    color: C.bodyMuted,
    width: 80,
    paddingTop: 2,
  },
  skillTags: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 3,
  },
  tag: {
    backgroundColor: C.tagBg,
    borderRadius: 2,
    paddingHorizontal: 5,
    paddingVertical: 2,
    marginRight: 3,
    marginBottom: 3,
  },
  tagText: {
    fontFamily: "Courier",
    fontSize: 7.5,
    color: C.tagText,
  },
  tagVersion: {
    fontFamily: "Courier",
    fontSize: 6.5,
    color: C.textMuted,
  },
  // Experience
  expHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    // Più spazio sotto l'intestazione role/azienda prima dei bullet
    marginBottom: 6,
  },
  expRole: { fontFamily: "Helvetica-Bold", fontSize: 10, color: C.body },
  expCompany: { fontSize: 9, color: C.bodyMuted, marginTop: 1 },
  expDate: {
    fontFamily: "Courier",
    fontSize: 8,
    color: C.teal,
  },
  // Contenitore della lista bullet — stacca visivamente dall'intestazione
  bulletList: {
    marginTop: 0,
    marginLeft: 2,
  },
  bullet: {
    flexDirection: "row",
    // Spaziatura verticale tra bullet aumentata
    marginBottom: 4,
    alignItems: "flex-start",
  },
  bulletDot: {
    color: C.teal,
    // Dimensione dot allineata alla text size del bullet
    fontSize: 9,
    marginRight: 6,
    marginTop: 1,
    fontFamily: "Helvetica-Bold",
    flexShrink: 0,
  },
  bulletText: {
    flex: 1,
    fontSize: 9,
    // Line-height aumentato per leggibilità e respiro tra le righe
    lineHeight: 1.65,
    color: C.body,
  },
  // expBlock: wrap=false è messo come prop JSX per impedire split a cavallo di pagina
  expBlock: { marginBottom: 14 },
  // Education
  eduHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 3,
  },
  eduDegree: { fontFamily: "Helvetica-Bold", fontSize: 10, color: C.body },
  eduInstitution: { fontSize: 9, color: C.bodyMuted, marginTop: 1 },
  eduDate: { fontFamily: "Courier", fontSize: 8, color: C.teal },
  eduThesis: {
    fontSize: 8,
    color: C.bodyMuted,
    fontStyle: "italic",
    marginTop: 4,
  },
  // eduBlock: wrap=false come prop JSX
  eduBlock: { marginBottom: 11 },
  // Certs / Lang / Projects
  listItem: {
    flexDirection: "row",
    marginBottom: 4,
    alignItems: "flex-start",
  },
  listDot: {
    color: C.teal,
    fontSize: 9,
    marginRight: 6,
    marginTop: 1,
    fontFamily: "Helvetica-Bold",
    flexShrink: 0,
  },
  listText: { flex: 1, fontSize: 9, lineHeight: 1.6, color: C.body },
  langRow: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  langItem: { fontSize: 9, color: C.body },
  langLevel: { fontSize: 9, color: C.bodyMuted },
  // ATS keywords invisibili (testo bianco su bianco)
  atsHidden: {
    fontSize: 1,
    color: C.white,
    position: "absolute",
    bottom: 0,
    left: 0,
  },
});

// ─── Helpers ─────────────────────────────────────────────────────────────────
function formatDate(d) {
  if (!d) return "";
  if (d === "present") return "Presente";
  const [y, m] = d.split("-");
  if (!m) return y;
  const months = [
    "Gen",
    "Feb",
    "Mar",
    "Apr",
    "Mag",
    "Giu",
    "Lug",
    "Ago",
    "Set",
    "Ott",
    "Nov",
    "Dic",
  ];
  return `${months[parseInt(m, 10) - 1]} ${y}`;
}

// Icone ASCII-safe per Helvetica/Courier (WinAnsiEncoding, max U+00FF)
const ICONS = {
  profile: "</>",
  skills: "$_",
  exp: ">>",
  edu: "[]",
  certs: "[*]",
  langs: "Aa",
  projects: ">",
  bullet: "-",
  email: "@",
};

function SectionHeader({ icon, label }) {
  return (
    <View style={s.sectionRow}>
      <Text style={s.sectionIcon}>{icon}</Text>
      <Text style={s.sectionLabel}>{label}</Text>
      <View style={s.sectionLine} />
    </View>
  );
}

// ─── HTML → react-pdf ─────────────────────────────────────────────────────────
// Converte HTML prodotto da TipTap in nodi react-pdf.
// Gestisce: <p>, <ul>/<ol>/<li>, <strong>, <em>, <u>, text node.

function getInlineText(domNode, baseStyle, keyBase) {
  const items = [];
  let i = 0;
  for (const child of domNode.childNodes) {
    const k = `${keyBase}-i${i++}`;
    if (child.nodeType === Node.TEXT_NODE) {
      const t = child.textContent;
      if (t)
        items.push(
          <Text key={k} style={baseStyle}>
            {t}
          </Text>,
        );
    } else if (child.nodeType === Node.ELEMENT_NODE) {
      const tag = child.tagName.toLowerCase();
      const st = { ...baseStyle };
      if (tag === "strong" || tag === "b") st.fontFamily = "Helvetica-Bold";
      if (tag === "em" || tag === "i") st.fontFamily = "Helvetica-Oblique";
      if (tag === "u") st.textDecoration = "underline";
      items.push(...getInlineText(child, st, k));
    }
  }
  return items;
}

function htmlToPdfBlocks(html, textStyle) {
  if (!html) return null;
  const container = document.createElement("div");
  container.innerHTML = html;
  const blocks = [];
  let ki = 0;

  for (const node of container.childNodes) {
    if (node.nodeType === Node.TEXT_NODE) {
      const t = node.textContent?.trim();
      if (t)
        blocks.push(
          <Text key={ki++} style={textStyle}>
            {t}
          </Text>,
        );
      continue;
    }
    if (node.nodeType !== Node.ELEMENT_NODE) continue;
    const tag = node.tagName.toLowerCase();

    if (tag === "p") {
      const text = node.textContent?.trim();
      if (!text) {
        ki++;
        continue;
      }
      const inline = getInlineText(node, textStyle, String(ki));
      blocks.push(
        <Text key={ki++} style={{ ...textStyle, marginBottom: 3 }}>
          {inline.length > 0 ? inline : text}
        </Text>,
      );
    } else if (tag === "ul" || tag === "ol") {
      let num = 1;
      for (const li of node.children) {
        if (li.tagName.toLowerCase() !== "li") continue;
        const liInner = li.querySelector("p") || li;
        const text = liInner.textContent?.trim();
        if (!text) {
          ki++;
          continue;
        }
        const inline = getInlineText(
          liInner,
          { ...textStyle, flex: 1 },
          String(ki),
        );
        const dot = tag === "ol" ? `${num++}.` : ICONS.bullet;
        blocks.push(
          <View key={ki++} style={s.bullet}>
            <Text style={s.bulletDot}>{dot}</Text>
            <Text style={{ ...textStyle, flex: 1 }}>
              {inline.length > 0 ? inline : text}
            </Text>
          </View>,
        );
      }
    }
  }
  return blocks.length > 0 ? blocks : null;
}

// ─── Documento PDF ────────────────────────────────────────────────────────────
function CVDocument({ data }) {
  const {
    personal,
    skills,
    experience,
    education,
    certifications,
    languages,
    projects,
  } = data;

  const {
    personal: personalLabels,
    skills: skillsLabels,
    experience: experienceLabels,
    education: educationLabels,
    certifications: certificationsLabels,
    languages: languagesLabels,
    projects: projectsLabels,
  } = useEditorLabels();

  const { t } = useTranslation();

  const allAtsKeywords = skills
    .flatMap((cat) => cat.tags.flatMap((tag) => tag.atsKeywords || []))
    .filter(Boolean)
    .join(" ");

  return (
    <Document
      title={personal.name || "CV"}
      author={personal.name}
      subject="Curriculum Vitae"
    >
      <Page size="A4" style={s.page}>
        {/* ── Header navy — marginTop:-20 annulla il paddingTop della Page ── */}
        <View style={s.header}>
          {personal.photo && <Image src={personal.photo} style={s.photo} />}
          <View style={s.headerInfo}>
            <Text style={s.name}>{personal.name}</Text>
            <Text style={s.title}>{personal.title}</Text>

            {/* Prima riga: Email, Telefono, Location */}
            <View style={s.contactRow}>
              {personal.email && (
                <Text style={s.contact}>
                  {t(personalLabels.email)}: {personal.email}
                </Text>
              )}
              {personal.phone && (
                <Text style={s.contact}>
                  {" "}
                  {t(personalLabels.phone)}: {personal.phone}
                </Text>
              )}
              {personal.location && (
                <Text style={s.contact}>
                  {t(personalLabels.place)}: {personal.location}
                </Text>
              )}
            </View>

            {/* Seconda riga: Portfolio e LinkedIn */}
            <View style={s.linkRow}>
              {personal.website && (
                <View style={s.contactGroup}>
                  <Text style={s.contact}>Portfolio:</Text>
                  <Link
                    src={makeHref(personal.website)}
                    style={s.contactAccent}
                  >
                    {shortenWebsite(personal.website)}
                  </Link>
                </View>
              )}

              {personal.linkedin && (
                <View style={s.contactGroup}>
                  <Text style={s.contact}>Linkedin:</Text>
                  <Link
                    src={makeHref(personal.linkedin)}
                    style={s.contactAccent}
                  >
                    {shortenLinkedIn(personal.linkedin)}
                  </Link>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* ── Body ── */}
        <View style={s.body}>
          {/* Profilo */}
          {personal.summary ? (
            <View style={s.section} wrap={false}>
              <SectionHeader
                icon={ICONS.profile}
                label={t(personalLabels.summary)}
              />
              {htmlToPdfBlocks(personal.summary, s.summary)}
            </View>
          ) : null}

          {/* Competenze */}
          {skills.length > 0 && (
            <View style={s.section}>
              <SectionHeader
                icon={ICONS.skills}
                label={t(skillsLabels.title)}
              />
              {skills.map((cat, i) => (
                <View key={i} style={s.skillRow} wrap={false}>
                  <Text style={s.skillCategory}>{cat.category}</Text>
                  <View style={s.skillTags}>
                    {cat.tags.map((tag, ti) => (
                      <View key={ti} style={s.tag}>
                        <Text style={s.tagText}>
                          {tag.label}
                          {tag.versionsRange ? (
                            <Text style={s.tagVersion}>
                              {" "}
                              {tag.versionsRange}
                            </Text>
                          ) : null}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Esperienza */}
          {experience.length > 0 && (
            <View style={s.section}>
              <SectionHeader
                icon={ICONS.exp}
                label={t(experienceLabels.title)}
              />
              {experience.map((exp) => (
                // wrap={false}: impedisce che un singolo blocco esperienza
                // venga spezzato a cavallo di due pagine
                <View key={exp.id} style={s.expBlock} wrap={false}>
                  <View style={s.expHeader}>
                    <View>
                      <Text style={s.expRole}>{exp.role}</Text>
                      <Text style={s.expCompany}>
                        {exp.company}
                        {exp.location ? ` · ${exp.location}` : ""}
                      </Text>
                    </View>
                    <Text style={s.expDate}>
                      {formatDate(exp.startDate)} - {formatDate(exp.endDate)}
                    </Text>
                  </View>
                  {exp.description ? (
                    <View style={s.bulletList}>
                      {htmlToPdfBlocks(exp.description, s.bulletText)}
                    </View>
                  ) : null}
                </View>
              ))}
            </View>
          )}

          {/* Formazione */}
          {education.length > 0 && (
            <View style={s.section}>
              <SectionHeader
                icon={ICONS.edu}
                label={t(educationLabels.title)}
              />
              {education.map((edu) => (
                <View key={edu.id} style={s.eduBlock} wrap={false}>
                  <View style={s.eduHeader}>
                    <View>
                      <Text style={s.eduDegree}>
                        {edu.degree}
                        {edu.field ? ` in ${edu.field}` : ""}
                      </Text>
                      <Text style={s.eduInstitution}>
                        {edu.institution}
                        {edu.grade ? ` · ${edu.grade}` : ""}
                      </Text>
                    </View>
                    <Text style={s.eduDate}>
                      {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                    </Text>
                  </View>
                  {edu.thesis ? (
                    <Text style={s.eduThesis}>Tesi: {edu.thesis}</Text>
                  ) : null}
                </View>
              ))}
            </View>
          )}

          {/* Certificazioni */}
          {certifications.filter(Boolean).length > 0 && (
            <View style={s.section} wrap={false}>
              <SectionHeader
                icon={ICONS.certs}
                label={t(certificationsLabels.title)}
              />
              {certifications.filter(Boolean).map((c, i) => (
                <View key={i} style={s.listItem}>
                  <Text style={s.listDot}>{ICONS.bullet}</Text>
                  <Text style={s.listText}>{c}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Lingue */}
          {languages.length > 0 && (
            <View style={s.section} wrap={false}>
              <SectionHeader
                icon={ICONS.langs}
                label={t(languagesLabels.title)}
              />
              <View style={s.langRow}>
                {languages.map((l, i) => (
                  <Text key={i} style={s.langItem}>
                    <Text style={{ fontFamily: "Helvetica-Bold" }}>
                      {l.language}
                    </Text>
                    {l.level ? (
                      <Text style={s.langLevel}> - {l.level}</Text>
                    ) : null}
                  </Text>
                ))}
              </View>
            </View>
          )}

          {/* Progetti */}
          {projects.filter(Boolean).length > 0 && (
            <View style={s.section}>
              <SectionHeader
                icon={ICONS.projects}
                label={t(projectsLabels.title)}
              />
              {projects.filter(Boolean).map((p, i) => (
                <View key={i} style={s.listItem} wrap={false}>
                  <Text style={s.listDot}>{ICONS.bullet}</Text>
                  <Text style={s.listText}>{p}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* ATS keywords invisibili — testo bianco su bianco */}
        {allAtsKeywords && <Text style={s.atsHidden}>{allAtsKeywords}</Text>}
      </Page>
    </Document>
  );
}

// ─── Funzione export ──────────────────────────────────────────────────────────
export async function exportPDF(data) {
  const blob = await pdf(<CVDocument data={data} />).toBlob();
  const name = (data.personal.name || "cv").replace(/\s+/g, "-").toLowerCase();
  saveAs(blob, `${name}.pdf`);
}
