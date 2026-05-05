import {
  Document, Packer, Paragraph, TextRun, HeadingLevel,
  AlignmentType, BorderStyle, ShadingType,
  TableRow, TableCell, Table, WidthType,
  ImageRun, convertInchesToTwip,
} from 'docx';
import { saveAs } from 'file-saver';

// ─── Helpers ─────────────────────────────────────────────────────────────────
function formatDate(d) {
  if (!d) return '';
  if (d === 'present') return 'Presente';
  const [y, m] = d.split('-');
  if (!m) return y;
  const months = ['Gen','Feb','Mar','Apr','Mag','Giu','Lug','Ago','Set','Ott','Nov','Dic'];
  return `${months[parseInt(m,10)-1]} ${y}`;
}

function sectionHeading(text) {
  return new Paragraph({
    text: text.toUpperCase(),
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 200, after: 80 },
    border: {
      bottom: { style: BorderStyle.SINGLE, size: 4, color: '4ec9b0', space: 4 },
    },
    run: {
      font: 'Courier New',
      size: 16,
      color: '4a5568',
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
    run: { font: 'Calibri', size: 18 },
  });
}

function spacer(lines = 1) {
  return Array.from({ length: lines }, () =>
    new Paragraph({ text: '', spacing: { after: 60 } })
  );
}

// Converte base64 in Uint8Array (per l'immagine profilo nel DOCX)
function base64ToUint8Array(base64) {
  const b64 = base64.includes(',') ? base64.split(',')[1] : base64;
  const binary = atob(b64);
  const arr = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) arr[i] = binary.charCodeAt(i);
  return arr;
}

// ─── Generatore documento ─────────────────────────────────────────────────────
export async function exportDOCX(data) {
  const { personal, skills, experience, education, certifications, languages, projects } = data;
  const name = personal.name || 'CV';

  const sections = [];

  // ── Header: nome e titolo ──
  sections.push(
    new Paragraph({
      children: [
        new TextRun({ text: name, bold: true, size: 48, font: 'Calibri', color: '0f2644' }),
      ],
      spacing: { after: 60 },
    }),
    new Paragraph({
      children: [
        new TextRun({ text: personal.title || '', size: 24, font: 'Calibri', color: '4ec9b0', italics: true }),
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
        children: contacts.map((c, i) => new TextRun({
          text: (i > 0 ? '  |  ' : '') + c,
          size: 16,
          font: 'Calibri',
          color: '4a5568',
        })),
        spacing: { after: 120 },
      }),
    );
  }

  // ── Profilo ──
  if (personal.summary) {
    sections.push(
      sectionHeading('Profilo'),
      new Paragraph({
        text: personal.summary,
        spacing: { after: 80 },
        run: { font: 'Calibri', size: 18 },
      }),
      ...spacer(),
    );
  }

  // ── Competenze ──
  if (skills.length > 0) {
    sections.push(sectionHeading('Competenze Tecniche'));
    for (const cat of skills) {
      const tagLabels = cat.tags.map(t => t.label + (t.versionsRange ? ` (${t.versionsRange})` : '')).join(', ');
      sections.push(
        new Paragraph({
          children: [
            new TextRun({ text: `${cat.category}: `, bold: true, font: 'Calibri', size: 18 }),
            new TextRun({ text: tagLabels, font: 'Calibri', size: 18 }),
          ],
          spacing: { after: 60 },
        }),
      );
    }
    sections.push(...spacer());
  }

  // ── Esperienza ──
  if (experience.length > 0) {
    sections.push(sectionHeading('Esperienza Professionale'));
    for (const exp of experience) {
      const dateStr = `${formatDate(exp.startDate)} – ${formatDate(exp.endDate)}`;
      sections.push(
        new Paragraph({
          children: [
            new TextRun({ text: exp.role, bold: true, font: 'Calibri', size: 20 }),
            new TextRun({ text: `  @  ${exp.company}`, font: 'Calibri', size: 18, color: '4a5568' }),
            exp.location ? new TextRun({ text: ` · ${exp.location}`, font: 'Calibri', size: 18, color: '4a5568' }) : null,
          ].filter(Boolean),
          spacing: { after: 40 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: dateStr, font: 'Courier New', size: 16, color: '4ec9b0' }),
          ],
          spacing: { after: 60 },
        }),
        ...exp.bullets.filter(Boolean).map(b => bullet(b)),
        ...spacer(),
      );
    }
  }

  // ── Formazione ──
  if (education.length > 0) {
    sections.push(sectionHeading('Formazione'));
    for (const edu of education) {
      sections.push(
        new Paragraph({
          children: [
            new TextRun({ text: `${edu.degree}${edu.field ? ` in ${edu.field}` : ''}`, bold: true, font: 'Calibri', size: 20 }),
          ],
          spacing: { after: 40 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: edu.institution, font: 'Calibri', size: 18, color: '4a5568' }),
            edu.grade ? new TextRun({ text: ` · ${edu.grade}`, font: 'Calibri', size: 18, color: '4a5568' }) : null,
            new TextRun({ text: `    ${formatDate(edu.startDate)} – ${formatDate(edu.endDate)}`, font: 'Courier New', size: 16, color: '4ec9b0' }),
          ].filter(Boolean),
          spacing: { after: 40 },
        }),
        ...(edu.thesis ? [new Paragraph({
          children: [new TextRun({ text: `Tesi: ${edu.thesis}`, italics: true, font: 'Calibri', size: 16, color: '4a5568' })],
          spacing: { after: 60 },
        })] : []),
        ...spacer(),
      );
    }
  }

  // ── Certificazioni ──
  const certs = certifications.filter(Boolean);
  if (certs.length > 0) {
    sections.push(
      sectionHeading('Certificazioni'),
      ...certs.map(c => bullet(c)),
      ...spacer(),
    );
  }

  // ── Lingue ──
  if (languages.length > 0) {
    sections.push(sectionHeading('Lingue'));
    sections.push(
      new Paragraph({
        children: languages.flatMap((l, i) => [
          new TextRun({ text: l.language, bold: true, font: 'Calibri', size: 18 }),
          l.level ? new TextRun({ text: ` — ${l.level}`, font: 'Calibri', size: 18, color: '4a5568' }) : null,
          i < languages.length - 1 ? new TextRun({ text: '     ', font: 'Calibri', size: 18 }) : null,
        ].filter(Boolean)),
        spacing: { after: 80 },
      }),
    );
  }

  // ── Progetti ──
  const projs = projects.filter(Boolean);
  if (projs.length > 0) {
    sections.push(
      sectionHeading('Progetti'),
      ...projs.map(p => bullet(p)),
    );
  }

  // ── Crea documento ──
  const doc = new Document({
    creator: name,
    title: `CV – ${name}`,
    description: 'Curriculum Vitae generato con CV Builder',
    sections: [{
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
    }],
  });

  const blob = await Packer.toBlob(doc);
  const filename = (personal.name || 'cv').replace(/\s+/g, '-').toLowerCase();
  saveAs(blob, `${filename}.docx`);
}
