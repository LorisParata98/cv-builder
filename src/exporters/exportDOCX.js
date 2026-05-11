import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  BorderStyle,
  convertInchesToTwip,
} from "docx";
import { saveAs } from "file-saver";
import { formatDate } from "../utils/translationUtils";
// ─── Colori per template ──────────────────────────────────────────────────────
const DESIGNER_PALETTE_ACCENTS = {
  "noir-gold": "C8B89A",
  "indigo-electric": "5B4FE8",
  "forest-stone": "2D6A4F",
};

const DESIGNER_PALETTE_HEADERS = {
  "noir-gold": "0D0D0D",
  "indigo-electric": "1A1060",
  "forest-stone": "1B4332",
};

function resolveDocxColors(data) {
  const cp = data.customPalettes || {};
  if (data.template === "manager") {
    return {
      headerColor: (cp.manager?.bg || "1e3a5f").replace("#", ""),
      accentColor: (cp.manager?.accent || "c8a951").replace("#", ""),
    };
  }
  if (data.template === "designer") {
    const pal = data.designerPalette || "noir-gold";
    const defAcc = DESIGNER_PALETTE_ACCENTS[pal] || "C8B89A";
    const defHdr = DESIGNER_PALETTE_HEADERS[pal] || "0D0D0D";
    return {
      headerColor: (cp.designer?.bg || defHdr).replace("#", ""),
      accentColor: (cp.designer?.accent || defAcc).replace("#", ""),
    };
  }
  // tech (default)
  return {
    headerColor: (cp.tech?.bg || "0f2644").replace("#", ""),
    accentColor: (cp.tech?.accent || "4ec9b0").replace("#", ""),
  };
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function sectionHeading(text, accentColor = "4ec9b0") {
  return new Paragraph({
    text: text.toUpperCase(),
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 200, after: 80 },
    border: {
      bottom: {
        style: BorderStyle.SINGLE,
        size: 4,
        color: accentColor,
        space: 4,
      },
    },
    run: {
      font: "Courier New",
      size: 16,
      color: "4a5568",
      bold: true,
    },
  });
}

function bullet(text) {
  return new Paragraph({
    text: text,
    bullet: { level: 0 },
    spacing: { after: 40 },
    indent: { left: convertInchesToTwip(0.25) },
    run: { font: "Calibri", size: 18 },
  });
}

// ─── HTML → docx ─────────────────────────────────────────────────────────────
// Converte HTML prodotto da TipTap in Paragraph/TextRun di docx.
// Gestisce: <p>, <ul>/<ol>/<li>, <strong>/<b>, <em>/<i>, <u>.

function getInlineRuns(domNode, baseStyle) {
  const runs = [];
  for (const child of domNode.childNodes) {
    if (child.nodeType === Node.TEXT_NODE) {
      const t = child.textContent;
      if (t) runs.push(new TextRun({ text: t, ...baseStyle }));
    } else if (child.nodeType === Node.ELEMENT_NODE) {
      const tag = child.tagName.toLowerCase();
      const st = { ...baseStyle };
      if (tag === "strong" || tag === "b") st.bold = true;
      if (tag === "em" || tag === "i") st.italics = true;
      if (tag === "u") st.underline = {};
      runs.push(...getInlineRuns(child, st));
    }
  }
  return runs;
}

function htmlToDocxBlocks(html) {
  if (!html) return [];
  const doc = new DOMParser().parseFromString(html, "text/html");
  const container = doc.body;
  const baseStyle = { font: "Calibri", size: 18 };
  const blocks = [];

  for (const node of container.childNodes) {
    if (node.nodeType === Node.TEXT_NODE) {
      const t = node.textContent?.trim();
      if (t) {
        blocks.push(
          new Paragraph({
            children: [new TextRun({ text: t, ...baseStyle })],
            spacing: { after: 40 },
          }),
        );
      }
      continue;
    }
    if (node.nodeType !== Node.ELEMENT_NODE) continue;
    const tag = node.tagName.toLowerCase();

    if (tag === "p") {
      const runs = getInlineRuns(node, baseStyle);
      if (runs.length === 0) continue;
      blocks.push(
        new Paragraph({
          children: runs,
          spacing: { after: 40 },
        }),
      );
    } else if (tag === "ul" || tag === "ol") {
      let num = 1;
      for (const li of node.children) {
        if (li.tagName.toLowerCase() !== "li") continue;
        const liInner = li.querySelector("p") || li;
        const runs = getInlineRuns(liInner, baseStyle);
        if (runs.length === 0) continue;
        if (tag === "ol") {
          blocks.push(
            new Paragraph({
              children: [
                new TextRun({ text: `${num++}. `, ...baseStyle }),
                ...runs,
              ],
              spacing: { after: 40 },
              indent: { left: convertInchesToTwip(0.25) },
            }),
          );
        } else {
          blocks.push(
            new Paragraph({
              children: runs,
              bullet: { level: 0 },
              spacing: { after: 40 },
              indent: { left: convertInchesToTwip(0.25) },
            }),
          );
        }
      }
    }
  }
  return blocks;
}

function spacer(lines = 1) {
  return Array.from(
    { length: lines },
    () => new Paragraph({ text: "", spacing: { after: 60 } }),
  );
}

// Converte base64 in Uint8Array (per l'immagine profilo nel DOCX)
function base64ToUint8Array(base64) {
  const b64 = base64.includes(",") ? base64.split(",")[1] : base64;
  const binary = atob(b64);
  const arr = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) arr[i] = binary.charCodeAt(i);
  return arr;
}

// ─── Generatore documento ─────────────────────────────────────────────────────
export async function exportDOCX(data) {
  const { headerColor, accentColor } = resolveDocxColors(data);

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
  const name = personal.name || "CV";

  const sections = [];

  // ── Header: nome e titolo ──
  sections.push(
    new Paragraph({
      children: [
        new TextRun({
          text: name,
          bold: true,
          size: 48,
          font: "Calibri",
          color: headerColor,
        }),
      ],
      spacing: { after: 60 },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: personal.title || "",
          size: 24,
          font: "Calibri",
          color: accentColor,
          italics: true,
        }),
      ],
      spacing: { after: 80 },
    }),
  );

  // ── Contatti ──
  const contacts = [
    personal.email,
    personal.phone,
    personal.location,
    personal.website,
    personal.linkedin,
  ].filter(Boolean);

  if (contacts.length > 0) {
    sections.push(
      new Paragraph({
        children: contacts.map(
          (c, i) =>
            new TextRun({
              text: (i > 0 ? "  |  " : "") + c,
              size: 16,
              font: "Calibri",
              color: "4a5568",
            }),
        ),
        spacing: { after: 120 },
      }),
    );
  }

  // ── Profilo ──
  if (personal.summary) {
    sections.push(
      sectionHeading("Profilo", accentColor),
      ...htmlToDocxBlocks(personal.summary),
      ...spacer(),
    );
  }

  // ── Competenze ──
  if (skills.length > 0) {
    sections.push(sectionHeading("Competenze Tecniche", accentColor));
    for (const cat of skills) {
      const tagLabels = cat.tags
        .map((t) => t.label + (t.versionsRange ? ` (${t.versionsRange})` : ""))
        .join(", ");
      sections.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `${cat.category}: `,
              bold: true,
              font: "Calibri",
              size: 18,
            }),
            new TextRun({ text: tagLabels, font: "Calibri", size: 18 }),
          ],
          spacing: { after: 60 },
        }),
      );
    }
    sections.push(...spacer());
  }

  // ── Esperienza ──
  if (experience.length > 0) {
    sections.push(sectionHeading("Esperienza Professionale", accentColor));
    for (const exp of experience) {
      const dateStr = `${formatDate(exp.startDate)} – ${formatDate(exp.endDate)}`;
      sections.push(
        new Paragraph({
          children: [
            new TextRun({
              text: exp.role,
              bold: true,
              font: "Calibri",
              size: 20,
            }),
            new TextRun({
              text: `  @  ${exp.company}`,
              font: "Calibri",
              size: 18,
              color: "4a5568",
            }),
            exp.location
              ? new TextRun({
                  text: ` · ${exp.location}`,
                  font: "Calibri",
                  size: 18,
                  color: "4a5568",
                })
              : null,
          ].filter(Boolean),
          spacing: { after: 40 },
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: dateStr,
              font: "Courier New",
              size: 16,
              color: accentColor,
            }),
          ],
          spacing: { after: 60 },
        }),
        ...htmlToDocxBlocks(exp.description),
        ...spacer(),
      );
    }
  }

  // ── Formazione ──
  if (education.length > 0) {
    sections.push(sectionHeading("Formazione", accentColor));
    for (const edu of education) {
      sections.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `${edu.degree}${edu.field ? ` in ${edu.field}` : ""}`,
              bold: true,
              font: "Calibri",
              size: 20,
            }),
          ],
          spacing: { after: 40 },
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: edu.institution,
              font: "Calibri",
              size: 18,
              color: "4a5568",
            }),
            edu.grade
              ? new TextRun({
                  text: ` · ${edu.grade}`,
                  font: "Calibri",
                  size: 18,
                  color: "4a5568",
                })
              : null,
            new TextRun({
              text: `    ${formatDate(edu.startDate)} – ${formatDate(edu.endDate)}`,
              font: "Courier New",
              size: 16,
              color: accentColor,
            }),
          ].filter(Boolean),
          spacing: { after: 40 },
        }),
        ...(edu.thesis
          ? [
              new Paragraph({
                children: [
                  new TextRun({
                    text: `Tesi: ${edu.thesis}`,
                    italics: true,
                    font: "Calibri",
                    size: 16,
                    color: "4a5568",
                  }),
                ],
                spacing: { after: 60 },
              }),
            ]
          : []),
        ...spacer(),
      );
    }
  }

  // ── Certificazioni ──
  const certs = certifications.filter(Boolean);
  if (certs.length > 0) {
    sections.push(
      sectionHeading("Certificazioni", accentColor),
      ...certs.map((c) => bullet(c)),
      ...spacer(),
    );
  }

  // ── Lingue ──
  if (languages.length > 0) {
    sections.push(sectionHeading("Lingue", accentColor));
    sections.push(
      new Paragraph({
        children: languages.flatMap((l, i) =>
          [
            new TextRun({
              text: l.language,
              bold: true,
              font: "Calibri",
              size: 18,
            }),
            l.level
              ? new TextRun({
                  text: ` — ${l.level}`,
                  font: "Calibri",
                  size: 18,
                  color: "4a5568",
                })
              : null,
            i < languages.length - 1
              ? new TextRun({ text: "     ", font: "Calibri", size: 18 })
              : null,
          ].filter(Boolean),
        ),
        spacing: { after: 80 },
      }),
    );
  }

  // ── Progetti ──
  const projs = projects
    .map((p) => {
      if (typeof p === "string") return { title: p, description: "", url: "" };
      if (p.text !== undefined)
        return { title: p.text, description: "", url: p.url || "" };
      return p;
    })
    .filter((p) => p.title || p.description);
  if (projs.length > 0) {
    sections.push(sectionHeading("Progetti", accentColor));
    for (const p of projs) {
      const titleLine = p.url ? `${p.title} (${p.url})` : p.title;
      if (titleLine) sections.push(bullet(titleLine));
      if (p.description) sections.push(...htmlToDocxBlocks(p.description));
    }
  }

  // ── Note ──
  if (note) {
    sections.push(sectionHeading("Note", accentColor));
    sections.push(...htmlToDocxBlocks(note));
  }

  // ── Crea documento ──
  const doc = new Document({
    creator: name,
    title: `CV – ${name}`,
    description: "Curriculum Vitae generato con CV Builder",
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: convertInchesToTwip(0.8),
              bottom: convertInchesToTwip(0.8),
              left: convertInchesToTwip(0.9),
              right: convertInchesToTwip(0.9),
            },
          },
        },
        children: sections,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const filename = (personal.name || "cv").replace(/\s+/g, "-").toLowerCase();
  saveAs(blob, `${filename}.docx`);
}
