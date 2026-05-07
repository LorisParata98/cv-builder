import {
  Document, Packer, Paragraph, TextRun,
  AlignmentType, BorderStyle, convertInchesToTwip,
} from 'docx';
import { saveAs } from 'file-saver';

function formatDate(isoDate) {
  if (!isoDate) return new Date().toLocaleDateString("it-IT", { day: "numeric", month: "long", year: "numeric" });
  try {
    return new Date(isoDate + "T00:00:00").toLocaleDateString("it-IT", {
      day: "numeric", month: "long", year: "numeric",
    });
  } catch {
    return isoDate;
  }
}

// Converte hex #rrggbb -> "rrggbb" (senza #)
function hex(color) {
  return (color || "#0f2644").replace(/^#/, "");
}

function spacer() {
  return new Paragraph({ text: "", spacing: { after: 60 } });
}

export async function exportCoverLetterDOCX(data) {
  const { personal = {}, coverLetter: cl = {}, template, designerPalette, customPalettes } = data;

  // ─── Risolve colori ─────────────────────────────────────────────────────────
  const DESIGNER_PALETTE_COLORS = {
    "noir-gold":       { bg: "#0D0D0D", accent: "#C8B89A" },
    "indigo-electric": { bg: "#1a1a2e", accent: "#7c3aed" },
    "forest-stone":    { bg: "#1c2b1c", accent: "#8fa87c" },
  };
  const customColors = (customPalettes && customPalettes[template]) || {};

  let bgHex, accentHex;
  if (template === "tech") {
    bgHex     = hex(customColors.bg     || "#0f2644");
    accentHex = hex(customColors.accent || "#4ec9b0");
  } else if (template === "manager") {
    bgHex     = hex(customColors.bg     || "#1e3a5f");
    accentHex = hex(customColors.accent || "#c8a951");
  } else {
    const p = DESIGNER_PALETTE_COLORS[designerPalette] || DESIGNER_PALETTE_COLORS["noir-gold"];
    bgHex     = hex(customColors.bg     || p.bg);
    accentHex = hex(customColors.accent || p.accent);
  }

  const paragraphsBody = (cl.letterBody || "")
    .split(/\n{2,}/)
    .map((p) => p.replace(/\n/g, " ").trim())
    .filter(Boolean);

  const salutation = cl.hiringManager
    ? `Gentile ${cl.hiringManager},`
    : `Gentile Team ${cl.company || "Hiring"},`;

  // ─── Costruisce i paragrafi ─────────────────────────────────────────────────
  const children = [];

  // Header — nome
  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: personal.name || "Nome Cognome",
          bold: true,
          size: 38,
          color: bgHex,
          font: "Calibri",
        }),
      ],
      spacing: { after: 60 },
      border: {
        bottom: { style: BorderStyle.THICK, size: 6, color: accentHex, space: 4 },
      },
    })
  );

  // Ruolo
  if (personal.role || personal.title) {
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: personal.role || personal.title,
            size: 20,
            color: accentHex,
            font: "Calibri",
          }),
        ],
        spacing: { after: 80 },
      })
    );
  }

  // Contatti
  const contacts = [personal.email, personal.phone, personal.location, personal.linkedin]
    .filter(Boolean)
    .join("   |   ");
  if (contacts) {
    children.push(
      new Paragraph({
        children: [new TextRun({ text: contacts, size: 17, color: "64748b", font: "Calibri" })],
        spacing: { after: 240 },
      })
    );
  }

  // Data
  children.push(
    new Paragraph({
      children: [new TextRun({ text: formatDate(cl.date), size: 19, color: "64748b", font: "Calibri" })],
      alignment: AlignmentType.RIGHT,
      spacing: { after: 200 },
    })
  );

  // Destinatario
  if (cl.hiringManager) {
    children.push(
      new Paragraph({
        children: [new TextRun({ text: cl.hiringManager, bold: true, size: 22, font: "Calibri" })],
        spacing: { after: 40 },
      })
    );
  }
  if (cl.company) {
    children.push(
      new Paragraph({
        children: [new TextRun({ text: cl.company, size: 22, font: "Calibri" })],
        spacing: { after: 40 },
      })
    );
  }
  if (cl.role) {
    children.push(
      new Paragraph({
        children: [new TextRun({ text: `Rif.: ${cl.role}`, size: 19, color: "64748b", font: "Calibri" })],
        spacing: { after: 160 },
      })
    );
  }

  // Saluto
  children.push(
    new Paragraph({
      children: [new TextRun({ text: salutation, bold: true, size: 22, font: "Calibri" })],
      spacing: { after: 160 },
    })
  );

  // Body paragraphs
  paragraphsBody.forEach((para) => {
    children.push(
      new Paragraph({
        children: [new TextRun({ text: para, size: 22, font: "Calibri" })],
        spacing: { after: 160 },
        indent: { left: 0 },
      })
    );
  });

  // Chiusura
  if (paragraphsBody.length > 0) {
    children.push(spacer());
    children.push(
      new Paragraph({
        children: [
          new TextRun({ text: `${cl.closingLine || "Cordiali saluti"},`, size: 22, font: "Calibri" }),
        ],
        spacing: { after: 240 },
      })
    );
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: personal.name || "",
            bold: true,
            size: 26,
            color: bgHex,
            font: "Calibri",
          }),
        ],
      })
    );
  }

  // ─── Documento ──────────────────────────────────────────────────────────────
  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top:    convertInchesToTwip(1.0),
              bottom: convertInchesToTwip(1.0),
              left:   convertInchesToTwip(1.1),
              right:  convertInchesToTwip(1.1),
            },
          },
        },
        children,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const name = (personal.name || "cover-letter").replace(/\s+/g, "-").toLowerCase();
  saveAs(blob, `cover-letter-${name}.docx`);
}
