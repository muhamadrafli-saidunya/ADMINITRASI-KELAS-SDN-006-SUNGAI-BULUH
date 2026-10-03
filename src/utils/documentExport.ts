import { SchoolInfo } from '../types';

/**
 * Helper to export formatted content to a clean, official Microsoft Word (.doc) document
 * with official school letterhead (Kop Surat), neat tables, typography, and signature block.
 */
export const exportToWordDoc = (
  title: string,
  contentMarkdownOrHtml: string,
  schoolInfo: SchoolInfo,
  additionalMeta?: {
    categoryName?: string;
    subjectName?: string;
    gradeClass?: string;
    topic?: string;
  }
) => {
  const currentDate = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  // Convert markdown-like syntax to clean HTML for Word
  const formattedBody = formatMarkdownToHtml(contentMarkdownOrHtml);

  const headerLine1 = schoolInfo.kopLine1 || 'PEMERINTAH KABUPATEN KUANTAN SINGINGI';
  const headerLine2 = schoolInfo.kopLine2 || 'DINAS PENDIDIKAN DAN KEBUDAYAAN';

  const wordHtml = `
<!DOCTYPE html>
<html xmlns:o="urn:schemas-microsoft-com:office:office" 
      xmlns:w="urn:schemas-microsoft-com:office:word" 
      xmlns="http://www.w3.org/TR/REC-html40">
<head>
  <meta charset="utf-8">
  <title>${title}</title>
  <!--[if gte mso 9]>
  <xml>
    <w:WordDocument>
      <w:View>Print</w:View>
      <w:Zoom>100</w:Zoom>
      <w:DoNotOptimizeForBrowser/>
    </w:WordDocument>
  </xml>
  <![endif]-->
  <style>
    @page {
      size: A4 portrait;
      margin: 2.5cm 2.0cm 2.0cm 2.5cm;
      mso-page-orientation: portrait;
    }
    body {
      font-family: 'Calibri', 'Arial', sans-serif;
      font-size: 11pt;
      line-height: 1.35;
      color: #1a1a1a;
      margin: 0;
      padding: 0;
    }
    .kop-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 12pt;
      border-bottom: 3pt double #000000;
      padding-bottom: 8pt;
    }
    .kop-table td {
      vertical-align: middle;
      text-align: center;
    }
    .kop-title-1 {
      font-size: 13pt;
      font-weight: 800;
      text-transform: uppercase;
      margin: 0;
      color: #000000;
      letter-spacing: 0.5pt;
    }
    .kop-title-2 {
      font-size: 13pt;
      font-weight: 800;
      text-transform: uppercase;
      margin: 2pt 0;
      color: #000000;
      letter-spacing: 0.5pt;
    }
    .kop-school-name {
      font-size: 16pt;
      font-weight: 900;
      color: #0b3c5d;
      text-transform: uppercase;
      margin: 2pt 0;
    }
    .kop-address {
      font-size: 9pt;
      color: #333333;
      margin: 2pt 0;
    }
    .doc-title-box {
      text-align: center;
      margin-top: 10pt;
      margin-bottom: 14pt;
      padding-bottom: 6pt;
      border-bottom: 1pt solid #cccccc;
    }
    .doc-title {
      font-size: 13pt;
      font-weight: bold;
      text-transform: uppercase;
      text-decoration: underline;
      margin: 0;
      color: #000000;
    }
    .doc-subtitle {
      font-size: 10pt;
      color: #444444;
      margin: 3pt 0 0 0;
      font-style: italic;
    }
    .meta-box {
      background-color: #f8fafc;
      border: 1pt solid #cbd5e1;
      padding: 6pt 10pt;
      margin-bottom: 14pt;
      font-size: 10pt;
    }
    h1 {
      font-size: 13pt;
      font-weight: bold;
      color: #1e3a8a;
      margin-top: 14pt;
      margin-bottom: 4pt;
      border-bottom: 1pt solid #cbd5e1;
      padding-bottom: 2pt;
    }
    h2 {
      font-size: 12pt;
      font-weight: bold;
      color: #1e293b;
      margin-top: 10pt;
      margin-bottom: 3pt;
    }
    h3 {
      font-size: 11pt;
      font-weight: bold;
      color: #334155;
      margin-top: 8pt;
      margin-bottom: 2pt;
    }
    h4 {
      font-size: 10.5pt;
      font-weight: bold;
      color: #475569;
      margin-top: 6pt;
      margin-bottom: 2pt;
    }
    p {
      margin-top: 0;
      margin-bottom: 6pt;
      text-align: justify;
    }
    ul, ol {
      margin-top: 2pt;
      margin-bottom: 6pt;
      padding-left: 20pt;
    }
    li {
      margin-bottom: 3pt;
    }
    blockquote {
      border-left: 3pt solid #3b82f6;
      background-color: #eff6ff;
      padding: 6pt 10pt;
      margin: 6pt 0;
      font-style: italic;
    }
    table.content-table {
      width: 100%;
      border-collapse: collapse;
      margin: 8pt 0;
      font-size: 10pt;
    }
    table.content-table th, table.content-table td {
      border: 1pt solid #64748b;
      padding: 5pt 7pt;
      text-align: left;
    }
    table.content-table th {
      background-color: #f1f5f9;
      font-weight: bold;
    }
    .signature-table {
      width: 100%;
      margin-top: 25pt;
      border-collapse: collapse;
      page-break-inside: avoid;
    }
    .signature-table td {
      vertical-align: top;
      text-align: center;
      width: 50%;
      font-size: 10pt;
    }
    .sign-space {
      height: 60pt;
    }
    .sign-name {
      font-weight: bold;
      text-decoration: underline;
    }
  </style>
</head>
<body>

  <!-- KOP SURAT RESMI SEKOLAH DASAR -->
  <table class="kop-table">
    <tr>
      <td style="width: 100%;">
        <div class="kop-title-1">${headerLine1}</div>
        <div class="kop-title-2">${headerLine2}</div>
        <div class="kop-school-name">${schoolInfo.schoolName}</div>
        <div class="kop-address">
          ${schoolInfo.address}, Kec. ${schoolInfo.subdistrict}, ${schoolInfo.city}, Kode Pos ${schoolInfo.postalCode}
        </div>
        <div class="kop-address">
          NPSN: ${schoolInfo.npsn} | Telp: ${schoolInfo.phoneNumber} | Email: ${schoolInfo.email}
        </div>
      </td>
    </tr>
  </table>

  <!-- JUDUL DOKUMEN -->
  <div class="doc-title-box">
    <div class="doc-title">${title}</div>
    ${additionalMeta?.categoryName ? `<div class="doc-subtitle">${additionalMeta.categoryName} &bull; Tahun Ajaran ${schoolInfo.academicYear}</div>` : ''}
  </div>

  ${additionalMeta?.subjectName || additionalMeta?.gradeClass ? `
  <div class="meta-box">
    <table style="width: 100%; border: none;">
      <tr>
        <td style="width: 20%; font-weight: bold;">Mata Pelajaran</td>
        <td style="width: 30%;">: ${additionalMeta?.subjectName || '-'}</td>
        <td style="width: 20%; font-weight: bold;">Fase / Kelas</td>
        <td style="width: 30%;">: ${additionalMeta?.gradeClass || '-'}</td>
      </tr>
      <tr>
        <td style="font-weight: bold;">Topik / Materi</td>
        <td>: ${additionalMeta?.topic || '-'}</td>
        <td style="font-weight: bold;">Semester / TP</td>
        <td>: ${schoolInfo.semester} / ${schoolInfo.academicYear}</td>
      </tr>
    </table>
  </div>
  ` : ''}

  <!-- ISI KONTEN DOKUMEN -->
  <div class="document-body">
    ${formattedBody}
  </div>

  <!-- LEMBAR PENGESAHAN / TANDA TANGAN -->
  <table class="signature-table">
    <tr>
      <td>
        <br />
        Mengetahui,<br />
        <strong>Kepala ${schoolInfo.schoolName}</strong>
        <div class="sign-space"></div>
        <span class="sign-name">${schoolInfo.headmasterName}</span><br />
        NIP. ${schoolInfo.headmasterNip || '-'}
      </td>
      <td>
        ${schoolInfo.city}, ${currentDate}<br />
        Guru Kelas / Pengampu,
        <div class="sign-space"></div>
        <span class="sign-name">${schoolInfo.homeroomTeacherName}</span><br />
        NIP. ${schoolInfo.homeroomTeacherNip || '-'}
      </td>
    </tr>
  </table>

</body>
</html>
  `.trim();

  // Create downloadable blob
  const blob = new Blob(['\ufeff' + wordHtml], {
    type: 'application/msword;charset=utf-8'
  });

  const cleanFilename = `${title.replace(/[^a-zA-Z0-9_-]/g, '_')}_${Date.now()}.doc`;
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = cleanFilename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Format markdown string to rich HTML tags for Word & Printable DOM
 */
export const formatMarkdownToHtml = (markdown: string): string => {
  if (!markdown) return '';

  const lines = markdown.split('\n');
  const htmlLines: string[] = [];
  let inList = false;
  let listType: 'ul' | 'ol' = 'ul';
  let inBlockquote = false;

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();

    // Check Blockquote
    if (trimmed.startsWith('>')) {
      const bqContent = trimmed.substring(1).trim();
      if (!inBlockquote) {
        htmlLines.push('<blockquote>');
        inBlockquote = true;
      }
      htmlLines.push(`<p>${formatInline(bqContent)}</p>`);
      continue;
    } else if (inBlockquote) {
      htmlLines.push('</blockquote>');
      inBlockquote = false;
    }

    // Check Headers
    if (trimmed.startsWith('#### ')) {
      closeList();
      htmlLines.push(`<h4>${formatInline(trimmed.substring(5))}</h4>`);
    } else if (trimmed.startsWith('### ')) {
      closeList();
      htmlLines.push(`<h3>${formatInline(trimmed.substring(4))}</h3>`);
    } else if (trimmed.startsWith('## ')) {
      closeList();
      htmlLines.push(`<h2>${formatInline(trimmed.substring(3))}</h2>`);
    } else if (trimmed.startsWith('# ')) {
      closeList();
      htmlLines.push(`<h1>${formatInline(trimmed.substring(2))}</h1>`);
    } else if (trimmed.startsWith('---') || trimmed.startsWith('***')) {
      closeList();
      htmlLines.push('<hr style="border: none; border-top: 1pt solid #cbd5e1; margin: 10pt 0;" />');
    } else if (/^(\*|-|\+)\s/.test(trimmed)) {
      // Unordered list
      const content = trimmed.replace(/^(\*|-|\+)\s+/, '');
      if (!inList || listType !== 'ul') {
        closeList();
        htmlLines.push('<ul>');
        inList = true;
        listType = 'ul';
      }
      htmlLines.push(`<li>${formatInline(content)}</li>`);
    } else if (/^\d+\.\s/.test(trimmed)) {
      // Ordered list
      const content = trimmed.replace(/^\d+\.\s+/, '');
      if (!inList || listType !== 'ol') {
        closeList();
        htmlLines.push('<ol>');
        inList = true;
        listType = 'ol';
      }
      htmlLines.push(`<li>${formatInline(content)}</li>`);
    } else if (trimmed === '') {
      closeList();
    } else {
      closeList();
      htmlLines.push(`<p>${formatInline(trimmed)}</p>`);
    }
  }

  closeList();
  if (inBlockquote) {
    htmlLines.push('</blockquote>');
  }

  function closeList() {
    if (inList) {
      htmlLines.push(listType === 'ul' ? '</ul>' : '</ol>');
      inList = false;
    }
  }

  return htmlLines.join('\n');
};

function formatInline(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/__(.*?)__/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/_(.*?)_/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code style="background-color: #f1f5f9; padding: 2px 4px; border-radius: 4px; font-family: monospace; font-size: 9.5pt;">$1</code>');
}
