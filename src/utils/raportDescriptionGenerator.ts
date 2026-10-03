import { AssessmentType, GradeRecord, Subject, TujuanPembelajaran, AgamaType, isTPForSemester } from '../types';
import {
  isAgamaSubject,
  getReligionSubjectName,
  getStandardTPsForAgama,
  getFallbackReligionNarrative,
  AGAMA_LIST
} from './agamaHelper';

export interface TPScoreItem {
  tp: TujuanPembelajaran;
  assessmentType: AssessmentType;
  score: number;
  label: string;
}

export interface GeneratedReportDescription {
  deskripsi: string;
  highestTP?: TPScoreItem;
  lowestTP?: TPScoreItem;
  allTPScores: TPScoreItem[];
}

/**
 * Cleans a TP phrase to blend smoothly into narrative sentences:
 * e.g., "Menjelaskan makna dan keterkaitan..." -> "menjelaskan makna dan keterkaitan..."
 * e.g., "Sangat menguasai pemahaman..." -> "memahami..."
 */
function cleanTPText(text: string, mode: 'tuntas' | 'bimbingan'): string {
  if (!text) return '';
  let cleaned = text.trim();

  // Remove trailing periods
  cleaned = cleaned.replace(/\.+$/, '');

  if (mode === 'tuntas') {
    // Remove redundant introductory words if present in ringkasan
    cleaned = cleaned
      .replace(/^Sangat\s+(menguasai|terampil|mahir|paham|memahami)\s+/i, 'memahami dan menguasai ')
      .replace(/^Menunjukkan\s+(penguasaan|pemahaman|penerapan)\s+/i, 'menerapkan ')
      .replace(/^Mampu\s+/i, '')
      .replace(/^Percaya diri\s+/i, 'terampil ')
      .replace(/^Kaya akan\s+/i, 'mengembangkan ')
      .replace(/^Fasih\s+/i, 'fasih ')
      .replace(/^Aktif\s+/i, 'aktif ');
  } else {
    // For bimbingan / perlu peningkatan
    cleaned = cleaned
      .replace(/^Perlu\s+(bimbingan|pendampingan|bantuan|latihan|pembiasaan|penguatan|dorongan|pembinaan)\s+(dalam|saat)?\s*/i, '')
      .replace(/^Needs practice with\s*/i, 'practicing ')
      .replace(/^Disarankan\s+untuk\s*/i, '');
  }

  // Lowercase first letter if it's not a proper noun or acronym
  if (cleaned.length > 0 && !/^[A-Z]{2,}/.test(cleaned) && !/^(Al-|Betawi|KBBI|IPA|IPS|Pancasila|Al-Qur|Kristus|Yesus|Allah|Tian|Buddha|Dharma|Sangha|Hyang|Tri Kaya|Panca Sradha)/i.test(cleaned)) {
    cleaned = cleaned.charAt(0).toLowerCase() + cleaned.slice(1);
  }

  return cleaned;
}

/**
 * Generates specific, rich Kurikulum Merdeka description for a student's subject,
 * based on highest and lowest TP achievement scores.
 */
export function generateSpecificReportDescription(params: {
  subject: Subject;
  studentGrades: GradeRecord[];
  allTPs: TujuanPembelajaran[];
  semester?: string;
  isMidSemester?: boolean;
  kktpOverride?: number;
  studentAgama?: string;
  studentName?: string;
}): GeneratedReportDescription {
  const { subject, studentGrades, allTPs, semester = '1 (Ganjil)', isMidSemester = false, studentAgama } = params;
  const kktp = params.kktpOverride || subject.kktp || 75;

  const isAgama = isAgamaSubject(subject);
  const normalizedAgama: AgamaType = (
    AGAMA_LIST.includes(studentAgama as any) ? studentAgama : 'Islam'
  ) as AgamaType;
  const displaySubjectName = isAgama ? getReligionSubjectName(studentAgama, subject.nama) : subject.nama;

  // Filter TPs for this subject, factoring in student's religion if it's a religion subject
  let subjectTPs = (allTPs || []).filter(tp => {
    if (tp.mapelId !== subject.id) return false;
    if (isAgama) {
      if (tp.agama && tp.agama !== 'Semua' && tp.agama !== normalizedAgama) {
        return false;
      }
      if (!tp.agama && normalizedAgama !== 'Islam') {
        return false; // Untagged legacy TPs default to Islam
      }
    }
    if (!isTPForSemester(tp, semester)) return false;
    return true;
  });

  // If this is a religion subject and no specific TPs were registered for this religion in allTPs,
  // load standard Kurikulum Merdeka TPs for this religion
  if (isAgama && subjectTPs.length === 0) {
    const stdAgamaTPs = getStandardTPsForAgama(normalizedAgama, subject.id, subject.deskripsi || 'Fase B (Kelas 4)');
    subjectTPs = stdAgamaTPs.filter(tp => {
      if (!isTPForSemester(tp, semester)) return false;
      return true;
    });
  }

  // Map assessment types to TPs dynamically based on active subjectTPs
  const activeTPList = isMidSemester && subjectTPs.length > 2
    ? subjectTPs.slice(0, Math.max(2, Math.ceil(subjectTPs.length / 2)))
    : subjectTPs;

  const tpScores: TPScoreItem[] = [];

  if (activeTPList.length > 0) {
    activeTPList.forEach((tp, idx) => {
      const type: AssessmentType = `Formatif_TP${idx + 1}` as AssessmentType;
      
      // Find student's grade for this TP by Formatif_TP{N}, Formatif_{id}, or tp.kode
      const gradeRecord = studentGrades.find(
        g => (g.jenis === type || g.jenis === `Formatif_${tp.id}` || g.jenis === tp.kode) && g.mapelId === subject.id
      ) || studentGrades.find(g => g.jenis === type && g.mapelId === subject.id);

      const score = gradeRecord ? gradeRecord.nilai : 80;
      tpScores.push({
        tp,
        assessmentType: type,
        score,
        label: `${tp.kode || `TP ${idx + 1}`} (${tp.lingkupMateri || tp.deskripsi.slice(0, 30)}...)`
      });
    });
  } else {
    // Fallback standard Formatif TP1..TP4 if no subjectTPs configured yet
    const fallbackTypes: Array<{ type: AssessmentType; code: string }> = [
      { type: 'Formatif_TP1', code: 'TP 1' },
      { type: 'Formatif_TP2', code: 'TP 2' },
      { type: 'Formatif_TP3', code: 'TP 3' },
      { type: 'Formatif_TP4', code: 'TP 4' }
    ];

    fallbackTypes.forEach(({ type, code }) => {
      const gradeRecord = studentGrades.find(g => g.jenis === type && g.mapelId === subject.id);
      if (gradeRecord) {
        tpScores.push({
          tp: {
            id: `tp-fallback-${code}`,
            mapelId: subject.id,
            kode: code,
            lingkupMateri: `Materi ${code}`,
            deskripsi: `Mencapai kompetensi ${code} pada mata pelajaran ${displaySubjectName}`,
            semester: 'Semua'
          },
          assessmentType: type,
          score: gradeRecord.nilai,
          label: code
        });
      }
    });
  }

  // If no specific TPs were matched (e.g. newly created subject with no TP entries yet),
  // fallback to generic yet structured description
  if (tpScores.length === 0) {
    const sts = studentGrades.find(g => g.jenis === 'Sumatif_STS' && g.mapelId === subject.id)?.nilai || 0;
    const sas = studentGrades.find(g => g.jenis === 'Sumatif_SAS' && g.mapelId === subject.id)?.nilai || 0;
    const formatifs = studentGrades.filter(g => g.jenis.startsWith('Formatif_') && g.mapelId === subject.id);
    const avgF = formatifs.length > 0 ? Math.round(formatifs.reduce((a, b) => a + b.nilai, 0) / formatifs.length) : 80;
    const finalScore = isMidSemester
      ? Math.round(sts > 0 && avgF > 0 ? (avgF * 0.5 + sts * 0.5) : (sts || avgF || 80))
      : Math.round((avgF * 0.4) + (sts * 0.3) + (sas * 0.3)) || avgF;

    if (isAgama) {
      return {
        deskripsi: getFallbackReligionNarrative(normalizedAgama, isMidSemester, finalScore, kktp),
        allTPScores: []
      };
    }

    if (finalScore >= 88) {
      return {
        deskripsi: `Menunjukkan pemahaman konsep yang sangat mendalam dan bermakna dalam materi pembelajaran ${displaySubjectName}, serta mampu mengaitkan pengetahuan dengan pemecahan masalah nyata secara mandiri dan kritis.`,
        allTPScores: []
      };
    } else if (finalScore >= kktp) {
      return {
        deskripsi: `Menunjukkan pemahaman konsep yang baik dan bermakna dalam mencapai tujuan pembelajaran ${displaySubjectName}, serta telah memenuhi kriteria ketuntasan secara memuaskan.`,
        allTPScores: []
      };
    } else {
      return {
        deskripsi: `Perlu bimbingan dan pendampingan terstruktur dalam meningkatkan pemahaman mendalam pada materi pembelajaran ${displaySubjectName}.`,
        allTPScores: []
      };
    }
  }

  // Sort scores to find highest and lowest TP
  const sortedByScore = [...tpScores].sort((a, b) => b.score - a.score);
  const highestTP = sortedByScore[0];
  const lowestTP = sortedByScore[sortedByScore.length - 1];

  const highestScore = highestTP.score;
  const lowestScore = lowestTP.score;
  const scoreDiff = highestScore - lowestScore;

  // Extract phrases for Highest TP
  const highestTPText =
    highestTP.tp.ringkasanRaporTuntas ||
    highestTP.tp.deskripsi ||
    highestTP.tp.lingkupMateri;
  const cleanedHighest = cleanTPText(highestTPText, 'tuntas');

  // Extract phrases for Lowest TP
  const lowestTPTextBimbingan =
    lowestTP.tp.ringkasanRaporPerluBimbingan ||
    lowestTP.tp.deskripsi ||
    lowestTP.tp.lingkupMateri;
  const cleanedLowest = cleanTPText(lowestTPTextBimbingan, 'bimbingan');

  let narrative = '';

  // Case 1: Only 1 TP evaluated
  if (tpScores.length === 1) {
    if (highestScore >= 88) {
      narrative = `Menunjukkan penguasaan yang sangat optimal dalam ${cleanedHighest}.`;
    } else if (highestScore >= kktp) {
      narrative = `Menunjukkan penguasaan yang baik dalam ${cleanedHighest}.`;
    } else {
      narrative = `Perlu bimbingan dan latihan lebih lanjut dalam ${cleanedLowest}.`;
    }
    return {
      deskripsi: narrative,
      highestTP,
      lowestTP,
      allTPScores: tpScores
    };
  }

  // Case 2: All TPs have virtually identical scores (diff <= 2)
  if (scoreDiff <= 2) {
    if (highestScore >= 88) {
      const tpListText = tpScores.map(t => cleanTPText(t.tp.ringkasanRaporTuntas || t.tp.deskripsi, 'tuntas')).join(' dan ');
      narrative = `Menunjukkan pemahaman konsep yang sangat mendalam dan bermakna dalam ${tpListText}, serta konsisten bernalar kritis dan berbudi pekerti luhur.`;
    } else if (highestScore >= kktp) {
      narrative = `Menunjukkan pemahaman yang baik dan telah mencapai kriteria ketuntasan pada seluruh tujuan pembelajaran ${displaySubjectName}, terutama dalam ${cleanedHighest}.`;
    } else {
      narrative = `Perlu bimbingan dan penguatan secara terstruktur pada seluruh tujuan pembelajaran ${displaySubjectName}, terutama dalam ${cleanedLowest}.`;
    }
    return {
      deskripsi: narrative,
      highestTP,
      lowestTP,
      allTPScores: tpScores
    };
  }

  // Case 3: Standard Kurikulum Merdeka Dual-Component (Capaian Tertinggi + Capaian Terendah)
  // 1. Clause for Highest TP
  let clauseHighest = '';
  if (highestScore >= 90) {
    clauseHighest = `Menunjukkan pemahaman yang sangat mendalam dan bermakna dalam ${cleanedHighest}`;
  } else if (highestScore >= 80) {
    clauseHighest = `Menunjukkan penguasaan yang baik dalam ${cleanedHighest}`;
  } else if (highestScore >= kktp) {
    clauseHighest = `Menunjukkan pemahaman yang cukup dalam ${cleanedHighest}`;
  } else {
    clauseHighest = `Mulai menunjukkan pemahaman dalam ${cleanedHighest}`;
  }

  // 2. Clause for Lowest TP
  let clauseLowest = '';
  if (lowestScore < kktp) {
    // Below KKTP: needs guidance/remediation
    if (lowestScore < 70) {
      clauseLowest = `, namun perlu bimbingan intensif dan latihan terstruktur dalam ${cleanedLowest}.`;
    } else {
      clauseLowest = `, namun perlu bimbingan dan pendampingan dalam ${cleanedLowest}.`;
    }
  } else if (lowestScore < 80) {
    // Passed KKTP but lowest among student's scores
    clauseLowest = `, serta perlu bimbingan dalam ${cleanedLowest} agar capaian semakin optimal.`;
  } else if (lowestScore < 88 && highestScore >= 90) {
    // Student scored very high in one, and good in the other
    clauseLowest = `, serta perlu mempertahankan dan meningkatkan ketelitian dalam ${cleanedLowest}.`;
  } else {
    // Both highest and lowest are high (> 88)
    clauseLowest = `, serta cukup terampil dalam ${cleanedLowest}.`;
  }

  narrative = clauseHighest + clauseLowest;

  return {
    deskripsi: narrative,
    highestTP,
    lowestTP,
    allTPScores: tpScores
  };
}
