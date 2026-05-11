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
import { exportManagerPDF } from "./exportPDF_manager.jsx";
import { exportDesignerPDF } from "./exportPDF_designer.jsx";
import { getCVLocale, translateLevel } from "../utils/cvLocales.js";

// ─── Colori default (TechDeveloper) ──────────────────────────────────────────
const C_DEFAULT = {
  navy:      "#0f2644",
  navyLight: "#162f52",
  teal:      "#4ec9b0",
  white:     "#ffffff",
  textMuted: "#8fa8c8",
  body:      "#1a1a2e",
  bodyMuted: "#4a5568",
  tagBg:     "#1a3a60",
  tagText:   "#ffffff",
  border:    "#dde3ed",
};

// ─── Font size default (TechDeveloper) ───────────────────────────────────────
const FS_DEFAULT = { name: 26, role: 12, sectionHeader: 10, body: 11 };

function resolveC(customPalette) {
  const cp = customPalette || {};
  return {
    ...C_DEFAULT,
    ...(cp.bg     ? { navy: cp.bg, navyLight: cp.bg } : {}),
    ...(cp.accent ? { teal: cp.accent }               : {}),
  };
}

function resolveFS(customFS) {
  return { ...FS_DEFAULT, ...(customFS || {}) };
}

// ─── Stili (generati con C e fs dinamici) ────────────────────────────────────
function makeStyles(C, fs) {
  const b  = fs.body;
  const sh = fs.sectionHeader;
  return StyleSheet.create({
    page: {
      fontFamily: "Helvetica",
      fontSize: b,
      color: C.body,
      backgroundColor: C.white,
      paddingTop: 20,
      paddingBottom: 40,
    },
    // Header
    header: {
      backgroundColor: C.navy,
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
      fontSize: fs.name,
      color: C.white,
      marginBottom: 4,
    },
    title: {
      fontFamily: "Courier",
      fontSize: fs.role,
      color: C.teal,
      marginBottom: 8,
    },
    contactRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
      marginBottom: 4,
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
      gap: 2,
    },
    contact: {
      fontSize: Math.max(7, b - 3),
      color: C.textMuted,
    },
    contactAccent: {
      fontSize: Math.max(7, b - 3),
      color: C.teal,
      textDecoration: "none",
    },
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
      fontSize: Math.max(6, sh - 2),
      color: C.teal,
      marginRight: 5,
    },
    sectionLabel: {
      fontFamily: "Courier-Bold",
      fontSize: Math.max(6, sh - 3),
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
    summary: { fontSize: Math.max(8, b - 1.5), lineHeight: 1.65, color: C.body },
    // Skills
    skillRow: {
      flexDirection: "row",
      alignItems: "flex-start",
      marginBottom: 5,
    },
    skillCategory: {
      fontFamily: "Courier-Bold",
      fontSize: Math.max(7, b - 3),
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
      fontSize: Math.max(7, b - 3.5),
      color: C.tagText,
    },
    tagVersion: {
      fontFamily: "Courier",
      fontSize: Math.max(6, b - 4.5),
      color: C.textMuted,
    },
    // Experience
    expHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: 6,
    },
    expRole: { fontFamily: "Helvetica-Bold", fontSize: b, color: C.body },
    expCompany: { fontSize: Math.max(8, b - 2), color: C.bodyMuted, marginTop: 1 },
    expDate: {
      fontFamily: "Courier",
      fontSize: Math.max(7, b - 3),
      color: C.teal,
    },
    bulletList: {
      marginTop: 0,
      marginLeft: 2,
    },
    bullet: {
      flexDirection: "row",
      marginBottom: 4,
      alignItems: "flex-start",
    },
    bulletDot: {
      color: C.teal,
      fontSize: Math.max(8, b - 1),
      marginRight: 6,
      marginTop: 1,
      fontFamily: "Helvetica-Bold",
      flexShrink: 0,
    },
    bulletText: {
      flex: 1,
      fontSize: Math.max(8, b - 2),
      lineHeight: 1.65,
      color: C.body,
    },
    expBlock: { marginBottom: 14 },
    // Education
    eduHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: 3,
    },
    eduDegree: { fontFamily: "Helvetica-Bold", fontSize: b, color: C.body },
    eduInstitution: { fontSize: Math.max(8, b - 2), color: C.bodyMuted, marginTop: 1 },
    eduDate: { fontFamily: "Courier", fontSize: Math.max(7, b - 3), color: C.teal },
    eduThesis: {
      fontSize: Math.max(7, b - 3),
      color: C.bodyMuted,
      fontStyle: "italic",
      marginTop: 4,
    },
    eduBlock: { marginBottom: 11 },
    // Certs / Lang / Projects
    listItem: {
      flexDirection: "row",
      marginBottom: 4,
      alignItems: "flex-start",
    },
    listDot: {
      color: C.teal,
      fontSize: Math.max(8, b - 1),
      marginRight: 6,
      marginTop: 1,
      fontFamily: "Helvetica-Bold",
      flexShrink: 0,
    },
    listText: { flex: 1, fontSize: Math.max(8, b - 2), lineHeight: 1.6, color: C.body },
    listUrl: { flex: 1, fontSize: Math.max(7, b - 3.5), color: C.teal, marginTop: 1 },
    langRow: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
    langItem: { fontSize: Math.max(8, b - 2), color: C.body },
    langLevel: { fontSize: Math.max(8, b - 2), color: C.bodyMuted },
    // ATS keywords invisibili (testo bianco su bianco)
    atsHidden: {
      fontSize: 1,
      color: C.white,
      position: "absolute",
      bottom: 0,
      left: 0,
    },
  });
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function formatDate(d, L) {
  if (!d) return "";
  if (d === "present") return L?.present || "Presente";
  const [y, m] = d.split("-");
  if (!m) return y;
  const months = L?.months || ["Gen","Feb","Mar","Apr","Mag","Giu","Lug","Ago","Set","Ott","Nov","Dic"];
  return `${months[parseInt(m, 10) - 1]} ${y}`;
}

const ICONS = {
  profile: "</>",
  skills:  "$_",
  exp:     ">>",
  edu:     "[]",
  certs:   "[*]",
  langs:   "Aa",
  projects: ">",
  notes:   "--",
  bullet:  "-",
  email:   "@",
};

// ─── HTML → react-pdf ─────────────────────────────────────────────────────────
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

function htmlToPdfBlocks(html, textStyle, s) {
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

// ─── Documento PDF (TechDeveloper) ───────────────────────────────────────────
function CVDocument({ data }) {
  const C  = resolveC(data.customPalettes?.tech);
  const fs = resolveFS(data.customFontSizes?.tech);
  const s  = makeStyles(C, fs);
  const L  = getCVLocale(data.targetLanguage || "IT");

  const {
    personal,
    skills,
    experience,
    education,
    certifications,
    languages,
    projects,
    note,
  } = data;

  const { t } = useTranslation();

  function SectionHeader({ icon, label }) {
    return (
      <View style={s.sectionRow}>
        <Text style={s.sectionIcon}>{icon}</Text>
        <Text style={s.sectionLabel}>{label}</Text>
        <View style={s.sectionLine} />
      </View>
    );
  }

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
        {/* ── Header navy ── */}
        <View style={s.header}>
          {personal.photo && (
            <Image
              src={personal.photo}
              style={[s.photo, {
                objectPosition: `${personal.photoPosition?.x ?? 50}% ${personal.photoPosition?.y ?? 50}%`,
              }]}
            />
          )}
          <View style={s.headerInfo}>
            <Text style={s.name}>{personal.name}</Text>
            <Text style={s.title}>{personal.title}</Text>

            <View style={s.contactRow}>
              {personal.email && (
                <Text style={s.contact}>
                  {t("editor.personal.email")}: {personal.email}
                </Text>
              )}
              {personal.phone && (
                <Text style={s.contact}>
                  {" "}
                  {t("editor.personal.phone")}: {personal.phone}
                </Text>
              )}
              {personal.location && (
                <Text style={s.contact}>
                  {t("editor.personal.place")}: {personal.location}
                </Text>
              )}
            </View>

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
                label={L.profile}
              />
              {htmlToPdfBlocks(personal.summary, s.summary, s)}
            </View>
          ) : null}

          {/* Competenze */}
          {skills.length > 0 && (
            <View style={s.section}>
              <SectionHeader
                icon={ICONS.skills}
                label={L.skills}
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
                label={L.experience}
              />
              {experience.map((exp) => (
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
                      {formatDate(exp.startDate, L)} - {formatDate(exp.endDate, L)}
                    </Text>
                  </View>
                  {exp.description ? (
                    <View style={s.bulletList}>
                      {htmlToPdfBlocks(exp.description, s.bulletText, s)}
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
                label={L.education}
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
                      {formatDate(edu.startDate, L)} - {formatDate(edu.endDate, L)}
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
                label={L.certifications}
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
                label={L.languages}
              />
              <View style={s.langRow}>
                {languages.map((l, i) => (
                  <Text key={i} style={s.langItem}>
                    <Text style={{ fontFamily: "Helvetica-Bold" }}>
                      {l.language}
                    </Text>
                    {l.level ? (
                      <Text style={s.langLevel}> - {translateLevel(l.level, L.lang)}</Text>
                    ) : null}
                  </Text>
                ))}
              </View>
            </View>
          )}

          {/* Progetti */}
          {(() => {
            const norm = (p) => {
              if (typeof p === "string") return { title: p, description: "", url: "" };
              if (p.text !== undefined) return { title: p.text, description: "", url: p.url || "" };
              return p;
            };
            const items = projects.map(norm).filter((p) => p.title || p.description);
            if (items.length === 0) return null;
            return (
              <View style={s.section}>
                <SectionHeader icon={ICONS.projects} label={L.projects} />
                {items.map((proj, i) => (
                  <View key={i} style={s.listItem} wrap={false}>
                    <Text style={s.listDot}>{ICONS.bullet}</Text>
                    <View style={{ flex: 1 }}>
                      {proj.title ? (
                        <Text style={[s.listText, { fontFamily: "Courier-Bold" }]}>{proj.title}</Text>
                      ) : null}
                      {proj.url ? <Text style={s.listUrl}>{proj.url}</Text> : null}
                      {proj.description ? (
                        <View style={{ marginTop: 2 }}>
                          {htmlToPdfBlocks(proj.description, s.bulletText, s)}
                        </View>
                      ) : null}
                    </View>
                  </View>
                ))}
              </View>
            );
          })()}
        </View>

        {/* Note */}
        {note ? (
          <View style={s.section} wrap={false}>
            <SectionHeader icon={ICONS.notes} label={L.notes} />
            {htmlToPdfBlocks(note, s.summary, s)}
          </View>
        ) : null}

        {/* ATS keywords invisibili */}
        {allAtsKeywords && <Text style={s.atsHidden}>{allAtsKeywords}</Text>}
      </Page>
    </Document>
  );
}

// ─── Funzione export ──────────────────────────────────────────────────────────
export async function exportPDF(data) {
  if (data.template === "manager") return exportManagerPDF(data);
  if (data.template === "designer") return exportDesignerPDF(data);
  const blob = await pdf(<CVDocument data={data} />).toBlob();
  const name = (data.personal.name || "cv").replace(/\s+/g, "-").toLowerCase();
  saveAs(blob, `${name}.pdf`);
}
