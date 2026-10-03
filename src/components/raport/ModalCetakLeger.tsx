import React, { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useApp } from '../../context/AppContext';
import { isSemesterGenap } from '../../types';
import { HeaderKopSekolah } from '../common/HeaderKopSekolah';
import { isAgamaSubject } from '../../utils/agamaHelper';
import {
  Printer,
  X,
  FileSpreadsheet,
  Trophy,
  GraduationCap,
  Calendar,
  SlidersHorizontal,
  Info,
  Clock,
  BookOpen,
  Sparkles,
  CheckCircle2,
  RotateCcw,
  Save
} from 'lucide-react';

interface ModalCetakLegerProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'matrix' | 'leaderboard' | 'kenaikan';
  defaultPeriod?: 'semester' | 'mid_semester';
}

export const ModalCetakLeger: React.FC<ModalCetakLegerProps> = ({
  isOpen,
  onClose,
  defaultMode = 'matrix',
  defaultPeriod = 'semester'
}) => {
  const {
    schoolInfo,
    students,
    subjects,
    getStudentReport,
    getAllGradesForStudent,
    getAllMidSemesterGradesForStudent,
    getEffectiveStudentAttendance,
    updateGlobalReportDate,
    addToast
  } = useApp();

  const isGenap = isSemesterGenap(schoolInfo.semester);

  // Periode Leger: Akhir Semester atau Mid Semester (STS)
  const [reportPeriod, setReportPeriod] = useState<'semester' | 'mid_semester'>(defaultPeriod);

  // Tab format mode
  const [printMode, setPrintMode] = useState<'matrix' | 'leaderboard' | 'kenaikan'>(defaultMode);

  // Orientation & paper options
  const [pageOrientation, setPageOrientation] = useState<'landscape' | 'portrait'>(
    defaultMode === 'matrix' ? 'landscape' : 'portrait'
  );
  const [paperSize, setPaperSize] = useState<'a4' | 'f4'>('a4');
  const [printScale, setPrintScale] = useState<'normal' | 'compact' | 'ultra_compact'>('compact');

  // Print customization options
  const [showSignature, setShowSignature] = useState(true);
  const [showAttendance, setShowAttendance] = useState(true);
  const [showStatsFooter, setShowStatsFooter] = useState(true);
  const [showNisn, setShowNisn] = useState(true);
  const [showRankColumn, setShowRankColumn] = useState(false);
  const [showStatusColumn, setShowStatusColumn] = useState(false);
  const [sortBy, setSortBy] = useState<'absen' | 'rank' | 'nama' | 'total'>('absen');

  const isMid = reportPeriod === 'mid_semester';

  // Tempat dan tanggal rapor aktif yang tercantum di lembar rapor siswa (disamakan dengan rapor)
  const defaultMidTanggal = isGenap
    ? `${schoolInfo.city || 'Kota Jakarta Selatan'}, 28 Maret 2027`
    : `${schoolInfo.city || 'Kota Jakarta Selatan'}, 10 Oktober 2026`;
  const defaultSemesterTanggal = isGenap
    ? `${schoolInfo.city || 'Kota Jakarta Selatan'}, 20 Juni 2027`
    : `${schoolInfo.city || 'Kota Jakarta Selatan'}, 19 Desember 2026`;

  const firstStudentReport = students[0] ? getStudentReport(students[0].id) : null;

  const raporDate = isMid
    ? (schoolInfo.tanggalRaporMid || firstStudentReport?.tempatTanggalRaporMid || defaultMidTanggal)
    : (schoolInfo.tanggalRapor || firstStudentReport?.tempatTanggalRapor || defaultSemesterTanggal);

  const [customReportDate, setCustomReportDate] = useState<string>(raporDate);

  // Format titimangsa: jika sudah menyertakan nama kota/tempat, gunakan langsung; jika hanya tanggal, tambahkan kota
  const getFormattedTitimangsa = (val: string) => {
    const str = val?.trim() || '';
    if (!str) return raporDate;
    if (str.includes(',')) return str;
    return `${schoolInfo.city || 'Kota Jakarta Selatan'}, ${str}`;
  };

  // Otomatis sinkronkan tempat dan tanggal leger dengan tempat dan tanggal rapor ketika modal dibuka atau periode berganti
  useEffect(() => {
    if (isOpen) {
      setCustomReportDate(raporDate);
    }
  }, [isOpen, reportPeriod, raporDate]);

  // Sync with default props when opening
  useEffect(() => {
    if (isOpen) {
      if (defaultPeriod) setReportPeriod(defaultPeriod);
      if (defaultMode) {
        setPrintMode(defaultMode);
        setPageOrientation(defaultMode === 'matrix' ? 'landscape' : 'portrait');
        setSortBy(defaultMode === 'leaderboard' ? 'rank' : 'absen');
      }
    }
  }, [isOpen, defaultPeriod, defaultMode]);

  // Isolate body during print modal
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('print-modal-active');
      return () => {
        document.body.classList.remove('print-modal-active');
      };
    }
  }, [isOpen]);

  // If mid semester is selected, prevent kenaikan mode (only available in full semester)
  useEffect(() => {
    if (reportPeriod === 'mid_semester' && printMode === 'kenaikan') {
      setPrintMode('matrix');
    }
  }, [reportPeriod, printMode]);

  // Computed per-student dataset based on selected period
  const computedList = useMemo(() => {
    return students.map(student => {
      const report = getStudentReport(student.id);
      const studentGrades = isMid
        ? getAllMidSemesterGradesForStudent(student.id)
        : getAllGradesForStudent(student.id);

      const attStats = getEffectiveStudentAttendance(student.id, isMid);

      const subjectScores: Record<string, number> = {};
      let totalScore = 0;
      let completedCount = 0;
      let bestSubject = '-';
      let maxScore = -1;

      studentGrades.forEach(g => {
        // For mid semester: use nilaiAkhirMid / sumatifSts
        const score = isMid
          ? ('nilaiAkhirMid' in g ? (g as any).nilaiAkhirMid : ('sumatifSts' in g ? (g as any).sumatifSts : 0))
          : ('nilaiAkhir' in g ? (g as any).nilaiAkhir : 0);

        subjectScores[g.subject.id] = score;
        totalScore += score;
        if (score >= (g.subject.kktp || 75)) {
          completedCount++;
        }
        if (score > maxScore) {
          maxScore = score;
          bestSubject = g.subject.nama;
        }
      });

      const avgScore =
        studentGrades.length > 0 ? +(totalScore / studentGrades.length).toFixed(1) : 0;

      // Predicate based on average
      let predicate = 'C';
      if (avgScore >= 90) predicate = 'A';
      else if (avgScore >= 80) predicate = 'B';
      else if (avgScore >= 70) predicate = 'C';
      else predicate = 'D';

      const numericRank = isMid
        ? (report.rankingMid && !isNaN(Number(report.rankingMid)) ? Number(report.rankingMid) : 999)
        : (report.ranking && !isNaN(Number(report.ranking)) ? Number(report.ranking) : 999);

      return {
        student,
        report,
        studentGrades,
        subjectScores,
        totalScore,
        avgScore,
        predicate,
        completedCount,
        attStats,
        bestSubject,
        maxScore,
        numericRank
      };
    });
  }, [
    students,
    subjects,
    isMid,
    getStudentReport,
    getAllGradesForStudent,
    getAllMidSemesterGradesForStudent,
    getEffectiveStudentAttendance
  ]);

  // Sorted list for printout
  const sortedStudents = useMemo(() => {
    const list = [...computedList];
    list.sort((a, b) => {
      if (sortBy === 'rank') {
        return a.numericRank - b.numericRank || b.totalScore - a.totalScore;
      }
      if (sortBy === 'total') {
        return b.totalScore - a.totalScore;
      }
      if (sortBy === 'nama') {
        return a.student.nama.localeCompare(b.student.nama);
      }
      // default: absen
      return (a.student.nomorAbsen || 0) - (b.student.nomorAbsen || 0);
    });
    return list;
  }, [computedList, sortBy]);

  // Class statistics
  const classStats = useMemo(() => {
    const totalStudents = students.length;
    if (totalStudents === 0) {
      return {
        overallAvg: 0,
        highestTotal: 0,
        lowestTotal: 0,
        subjectAverages: {},
        subjectMax: {},
        subjectMin: {},
        subjectPassPercent: {},
        countNaik: 0,
        countTinggal: 0,
        countLulus: 0
      };
    }

    let sumTotalScores = 0;
    let highestTotal = -1;
    let lowestTotal = 999999;
    let countNaik = 0;
    let countTinggal = 0;
    let countLulus = 0;

    const subSums: Record<string, number> = {};
    const subMax: Record<string, number> = {};
    const subMin: Record<string, number> = {};
    const subPassCount: Record<string, number> = {};

    subjects.forEach(sub => {
      subSums[sub.id] = 0;
      subMax[sub.id] = -1;
      subMin[sub.id] = 999;
      subPassCount[sub.id] = 0;
    });

    computedList.forEach(item => {
      if (item.report.statusKenaikan === 'Naik Kelas') countNaik++;
      else if (item.report.statusKenaikan === 'Tinggal Kelas') countTinggal++;
      else if (item.report.statusKenaikan === 'Lulus') countLulus++;

      sumTotalScores += item.totalScore;
      if (item.totalScore > highestTotal) highestTotal = item.totalScore;
      if (item.totalScore < lowestTotal) lowestTotal = item.totalScore;

      subjects.forEach(sub => {
        const score = item.subjectScores[sub.id] || 0;
        subSums[sub.id] += score;
        if (score > subMax[sub.id]) subMax[sub.id] = score;
        if (score < subMin[sub.id]) subMin[sub.id] = score;
        if (score >= (sub.kktp || 75)) subPassCount[sub.id]++;
      });
    });

    const subjectAverages: Record<string, number> = {};
    const subjectPassPercent: Record<string, number> = {};

    subjects.forEach(sub => {
      subjectAverages[sub.id] = +(subSums[sub.id] / totalStudents).toFixed(1);
      subjectPassPercent[sub.id] = Math.round((subPassCount[sub.id] / totalStudents) * 100);
      if (subMin[sub.id] === 999) subMin[sub.id] = 0;
      if (subMax[sub.id] === -1) subMax[sub.id] = 0;
    });

    const overallAvg =
      subjects.length > 0 ? +(sumTotalScores / (totalStudents * subjects.length)).toFixed(1) : 0;

    return {
      overallAvg,
      highestTotal: highestTotal === -1 ? 0 : highestTotal,
      lowestTotal: lowestTotal === 999999 ? 0 : lowestTotal,
      subjectAverages,
      subjectMax: subMax,
      subjectMin: subMin,
      subjectPassPercent,
      countNaik,
      countTinggal,
      countLulus
    };
  }, [students, subjects, computedList]);

  if (!isOpen) return null;

  const handlePrintDocument = () => {
    setTimeout(() => {
      window.print();
    }, 60);
  };

  const getDocTitle = () => {
    if (isMid) {
      if (printMode === 'matrix') return 'LEGER NILAI ASESMEN SUMATIF TENGAH SEMESTER (ASTS)';
      if (printMode === 'leaderboard') return 'DAFTAR PERINGKAT & PRESTASI MID SEMESTER (ASTS)';
      return 'LEGER NILAI MID SEMESTER (ASTS)';
    }
    if (printMode === 'matrix') return 'LEGER NILAI & REKAPITULASI HASIL BELAJAR PESERTA DIDIK (KMPM)';
    if (printMode === 'leaderboard') return 'DAFTAR PERINGKAT & PRESTASI HASIL BELAJAR SE-KELAS (KMPM)';
    return 'REKAPITULASI KEPUTUSAN KENAIKAN KELAS & KELULUSAN (KMPM)';
  };

  const getDocSubtitle = () => {
    const semText = isMid ? `Tengah Semester ${schoolInfo.semester}` : `Semester ${schoolInfo.semester}`;
    return `KURIKULUM MERDEKA PEMBELAJARAN MENDALAM (KMPM) • Kelas: ${schoolInfo.className} • Fase: ${schoolInfo.phase || 'B'} • ${semText} • Tahun Ajaran: ${schoolInfo.academicYear}`;
  };

  // Dimensions for @page in CSS
  const pageDimensionStr = paperSize === 'f4'
    ? (pageOrientation === 'landscape' ? '330mm 215mm' : '215mm 330mm')
    : (pageOrientation === 'landscape' ? '297mm 210mm' : '210mm 297mm');

  // Font sizing and density classes
  const getScaleStyles = () => {
    if (printScale === 'ultra_compact') {
      return {
        tableText: 'text-[7.5px] leading-tight',
        thPad: 'p-0.5',
        tdPad: 'p-0.5',
        mapelColWidth: 'min-w-[24px] max-w-[32px] p-0.5',
        nameText: 'text-[8.5px] font-bold leading-tight',
        nisnText: 'text-[7px] text-slate-500 font-mono',
        badgeText: 'text-[7px]',
        signGap: 'h-11'
      };
    }
    if (printScale === 'compact') {
      return {
        tableText: 'text-[8.5px] leading-tight',
        thPad: 'p-1',
        tdPad: 'p-0.5 sm:p-1',
        mapelColWidth: 'min-w-[28px] max-w-[38px] p-0.5',
        nameText: 'text-[9.5px] font-bold leading-tight',
        nisnText: 'text-[7.5px] text-slate-500 font-mono',
        badgeText: 'text-[7.5px]',
        signGap: 'h-14'
      };
    }
    // Normal
    return {
      tableText: 'text-[9.5px] leading-snug',
      thPad: 'p-1 sm:p-1.5',
      tdPad: 'p-1 sm:p-1.5',
      mapelColWidth: 'min-w-[34px] max-w-[44px] p-1',
      nameText: 'text-[10px] font-bold leading-tight',
      nisnText: 'text-[8px] text-slate-500 font-mono',
      badgeText: 'text-[8px]',
      signGap: 'h-16'
    };
  };

  const scale = getScaleStyles();
  const trailingExtraCols = (showRankColumn ? 1 : 0) + (showAttendance ? 3 : 0) + (showStatusColumn ? 1 : 0);

  const modalContent = (
    <div
      id="modal-cetak-leger-root"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-2 sm:p-4 backdrop-blur-xs print:p-0 print:m-0 print:static print:block print:overflow-visible print:bg-transparent print:z-auto"
    >
      {/* Dynamic Print CSS for Page Sizing, Paper Fitting & Repeating Headers */}
      <style>{`
        @media print {
          @page {
            size: ${pageDimensionStr} !important;
            margin: 5mm 6mm 5mm 6mm !important;
          }
          *, *::before, *::after {
            color-adjust: exact !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          html, body {
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            background: #ffffff !important;
            background-color: #ffffff !important;
            color: #000000 !important;
          }
          /* Sembunyikan container app utama saat modal cetak aktif */
          body.print-modal-active > #root {
            display: none !important;
            visibility: hidden !important;
            height: 0 !important;
            overflow: hidden !important;
          }
          /* Pastikan modal cetak tampil penuh dan tidak terpotong */
          body.print-modal-active #modal-cetak-leger-root {
            display: block !important;
            position: static !important;
            width: 100% !important;
            min-width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            background: transparent !important;
            overflow: visible !important;
          }
          body.print-modal-active #modal-cetak-leger-root .print-modal-card {
            display: block !important;
            position: static !important;
            width: 100% !important;
            max-width: none !important;
            max-height: none !important;
            margin: 0 !important;
            padding: 0 !important;
            border: none !important;
            border-radius: 0 !important;
            box-shadow: none !important;
            background: transparent !important;
            overflow: visible !important;
          }
          body.print-modal-active #modal-cetak-leger-root .print-modal-scroll-area {
            display: block !important;
            position: static !important;
            width: 100% !important;
            height: auto !important;
            max-height: none !important;
            margin: 0 !important;
            padding: 0 !important;
            background: transparent !important;
            overflow: visible !important;
          }
          body.print-modal-active #printable-official-document,
          body.print-modal-active .printable-document-sheet {
            display: block !important;
            visibility: visible !important;
            width: 100% !important;
            min-width: 100% !important;
            max-width: none !important;
            margin: 0 !important;
            padding: 0 !important;
            border: none !important;
            border-radius: 0 !important;
            box-shadow: none !important;
            background: #ffffff !important;
            color: #000000 !important;
            overflow: visible !important;
          }
          body.print-modal-active #printable-official-document * {
            visibility: visible !important;
          }
          table {
            width: 100% !important;
            table-layout: auto !important;
            border-collapse: collapse !important;
            page-break-inside: auto !important;
          }
          thead {
            display: table-header-group !important;
          }
          tfoot {
            display: table-footer-group !important;
          }
          tr {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
          th, td {
            border: 1px solid #000000 !important;
            color: #000000 !important;
          }
          .page-break-inside-avoid {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
        }
      `}</style>

      <div className="print-modal-card relative w-full max-w-6xl max-h-[96vh] flex flex-col rounded-2xl bg-slate-100 dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-150 print:max-h-none print:w-full print:max-w-none print:border-none print:shadow-none print:rounded-none print:m-0 print:p-0 print:static print:bg-transparent print:overflow-visible print:animate-none">
        {/* Top Header Toolbar */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 sm:px-5 py-3 no-print print:hidden shrink-0">
          <div className="flex items-center gap-3">
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${isMid ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' : 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'}`}>
              <Printer className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black text-slate-900 dark:text-white">
                  Pratinjau & Cetak Leger Rapor Kelas
                </h2>
                <span className={`text-[10.5px] font-bold px-2 py-0.5 rounded-full ${isMid ? 'bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-200 border border-amber-300' : 'bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-200 border border-blue-300'}`}>
                  {isMid ? 'Tengah Semester (ASTS)' : 'Akhir Semester'}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Format resmi Kurikulum Merdeka Pembelajaran Mendalam (KMPM) • Kelas {schoolInfo.className} • {schoolInfo.academicYear}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrintDocument}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-white text-xs font-bold shadow-md transition-all cursor-pointer ${
                isMid
                  ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-600/20 active:scale-95'
                  : 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/20 active:scale-95'
              }`}
            >
              <Printer className="h-4 w-4" />
              <span>Cetak Sekarang (Print / PDF)</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Options & Tab Bar */}
        <div className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 p-3 sm:px-5 no-print print:hidden space-y-3 shrink-0 text-xs">
          {/* Row 1: Periode & Format Selection */}
          <div className="flex flex-wrap items-center justify-between gap-2.5">
            {/* Periode Switcher */}
            <div className="flex items-center gap-1 p-1 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xs">
              <span className="text-[11px] font-bold text-slate-500 px-2 flex items-center gap-1">
                <Clock className="h-3.5 w-3.5 text-slate-400" />
                <span>Periode:</span>
              </span>
              <button
                type="button"
                onClick={() => setReportPeriod('semester')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-xs transition-all ${
                  reportPeriod === 'semester'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <BookOpen className="h-3.5 w-3.5" />
                <span>Rapor Akhir Semester</span>
              </button>
              <button
                type="button"
                onClick={() => setReportPeriod('mid_semester')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-xs transition-all ${
                  reportPeriod === 'mid_semester'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>Mid Semester (ASTS)</span>
              </button>
            </div>

            {/* Format Selection Tabs */}
            <div className="flex items-center gap-1 bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs">
              <button
                type="button"
                onClick={() => {
                  setPrintMode('matrix');
                  setSortBy('absen');
                  setPageOrientation('landscape');
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
                  printMode === 'matrix'
                    ? (isMid ? 'bg-amber-600 text-white shadow-xs' : 'bg-blue-600 text-white shadow-xs')
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <FileSpreadsheet className="h-3.5 w-3.5" />
                <span>{isMid ? 'Leger Mid Lengkap' : 'Leger Nilai Lengkap'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setPrintMode('leaderboard');
                  setSortBy('rank');
                  setPageOrientation('portrait');
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
                  printMode === 'leaderboard'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Trophy className="h-3.5 w-3.5" />
                <span>Daftar Peringkat</span>
              </button>

              {!isMid && (
                <button
                  type="button"
                  onClick={() => {
                    setPrintMode('kenaikan');
                    setSortBy('absen');
                    setPageOrientation('portrait');
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
                    printMode === 'kenaikan'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <GraduationCap className="h-3.5 w-3.5" />
                  <span>Kenaikan / Kelulusan</span>
                </button>
              )}
            </div>
          </div>

          {/* Row 2: Page Fitting & Layout Tuning Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-slate-200 dark:border-slate-700">
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Orientasi Kertas */}
              <div className="flex items-center gap-1.5">
                <span className="text-slate-500 font-semibold">Orientasi:</span>
                <select
                  value={pageOrientation}
                  onChange={e => setPageOrientation(e.target.value as any)}
                  className="rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-2 py-1 text-xs font-bold text-slate-800 dark:text-slate-200 outline-none"
                >
                  <option value="landscape">Lanskap (Landscape - Disarankan)</option>
                  <option value="portrait">Tegak (Portrait)</option>
                </select>
              </div>

              {/* Ukuran Kertas */}
              <div className="flex items-center gap-1.5">
                <span className="text-slate-500 font-semibold">Kertas:</span>
                <select
                  value={paperSize}
                  onChange={e => setPaperSize(e.target.value as any)}
                  className="rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-2 py-1 text-xs font-bold text-slate-800 dark:text-slate-200 outline-none"
                >
                  <option value="a4">A4 (210 × 297 mm)</option>
                  <option value="f4">F4 / Folio (215 × 330 mm)</option>
                </select>
              </div>

              {/* Kerapatan / Skala Cetak agar Muat Halaman */}
              <div className="flex items-center gap-1.5" title="Atur kerapatan font dan padding agar tabel muat sempurna di 1 lembar">
                <SlidersHorizontal className="h-3.5 w-3.5 text-slate-400" />
                <span className="text-slate-500 font-semibold">Kerapatan:</span>
                <select
                  value={printScale}
                  onChange={e => setPrintScale(e.target.value as any)}
                  className="rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-2 py-1 text-xs font-bold text-slate-800 dark:text-slate-200 outline-none"
                >
                  <option value="compact">Kompak (Sesuai Standar Mapel)</option>
                  <option value="ultra_compact">Sangat Kompak (Banyak Mapel/Siswa)</option>
                  <option value="normal">Normal</option>
                </select>
              </div>

              {/* Urutan */}
              <div className="flex items-center gap-1.5">
                <span className="text-slate-500 font-semibold">Urutkan:</span>
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value as any)}
                  className="rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-2 py-1 text-xs font-bold text-slate-800 dark:text-slate-200 outline-none"
                >
                  <option value="absen">No. Absen</option>
                  <option value="rank">Peringkat / Rank</option>
                  <option value="total">Total Nilai</option>
                  <option value="nama">Nama Siswa</option>
                </select>
              </div>
            </div>

            {/* Print Feature Toggles */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Tanggal Titimangsa Rapor */}
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                  <span className="text-slate-700 dark:text-slate-300 font-bold text-xs whitespace-nowrap">
                    Tempat & Tanggal:
                  </span>
                  <input
                    type="text"
                    value={customReportDate}
                    onChange={e => setCustomReportDate(e.target.value)}
                    placeholder={`Contoh: ${raporDate}`}
                    title="Tempat dan tanggal penandatanganan leger (disamakan dengan rapor)"
                    className="w-56 sm:w-64 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-2.5 py-1 text-xs font-semibold text-slate-800 dark:text-slate-100 shadow-2xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>

                {customReportDate === raporDate ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10.5px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                    <span>Sama dengan Rapor</span>
                  </span>
                ) : (
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setCustomReportDate(raporDate)}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10.5px] font-bold bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/60 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 transition-colors cursor-pointer"
                      title="Kembalikan agar sama persis dengan tempat & tanggal di rapor siswa"
                    >
                      <RotateCcw className="h-3 w-3" />
                      <span>Samakan dg Rapor</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        updateGlobalReportDate(
                          reportPeriod,
                          reportPeriod === 'semester' ? customReportDate : undefined,
                          reportPeriod === 'mid_semester' ? customReportDate : undefined
                        );
                        addToast(
                          'success',
                          'Titimangsa Disinkronkan',
                          `Tempat dan tanggal "${customReportDate}" telah diterapkan ke lembar rapor seluruh siswa.`
                        );
                      }}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10.5px] font-bold bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 transition-colors cursor-pointer"
                      title="Terapkan tanggal ini ke lembar rapor seluruh siswa"
                    >
                      <Save className="h-3 w-3" />
                      <span>Terapkan ke Rapor</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Toggle NISN */}
              <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 dark:text-slate-300 font-medium select-none">
                <input
                  type="checkbox"
                  checked={showNisn}
                  onChange={e => setShowNisn(e.target.checked)}
                  className="rounded text-blue-600"
                />
                <span>NISN</span>
              </label>

              {/* Toggle Tanda Tangan */}
              <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 dark:text-slate-300 font-medium select-none">
                <input
                  type="checkbox"
                  checked={showSignature}
                  onChange={e => setShowSignature(e.target.checked)}
                  className="rounded text-blue-600"
                />
                <span>Tanda Tangan</span>
              </label>

              {printMode === 'matrix' && (
                <>
                  <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 dark:text-slate-300 font-medium select-none" title="Tampilkan kolom Presensi (Sakit, Izin, Alpa)">
                    <input
                      type="checkbox"
                      checked={showAttendance}
                      onChange={e => setShowAttendance(e.target.checked)}
                      className="rounded text-blue-600"
                    />
                    <span>Presensi (S/I/A)</span>
                  </label>

                  <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 dark:text-slate-300 font-medium select-none" title="Tampilkan ringkasan statistik kelas di bawah tabel">
                    <input
                      type="checkbox"
                      checked={showStatsFooter}
                      onChange={e => setShowStatsFooter(e.target.checked)}
                      className="rounded text-blue-600"
                    />
                    <span>Statistik</span>
                  </label>

                  <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 dark:text-slate-300 font-medium select-none" title="Opsional: Tampilkan kolom Ranking di leger nilai (bawaan terpisah di tab Daftar Peringkat)">
                    <input
                      type="checkbox"
                      checked={showRankColumn}
                      onChange={e => setShowRankColumn(e.target.checked)}
                      className="rounded text-blue-600"
                    />
                    <span>Sertakan Ranking</span>
                  </label>

                  {!isMid && (
                    <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 dark:text-slate-300 font-medium select-none" title="Opsional: Tampilkan kolom Status Kenaikan di leger nilai (bawaan terpisah di tab Kenaikan/Kelulusan)">
                      <input
                        type="checkbox"
                        checked={showStatusColumn}
                        onChange={e => setShowStatusColumn(e.target.checked)}
                        className="rounded text-blue-600"
                      />
                      <span>Sertakan Status Kenaikan</span>
                    </label>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Scrollable Printable Document View */}
        <div className="print-modal-scroll-area flex-1 overflow-y-auto p-3 sm:p-6 custom-scrollbar bg-slate-200/60 dark:bg-slate-950 print:p-0 print:m-0 print:overflow-visible print:bg-transparent print:block">
          {/* Active Mode Notice */}
          <div className="max-w-[1150px] mx-auto mb-2 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 print:hidden">
            <div className="flex items-center gap-1.5">
              <Info className="h-3.5 w-3.5 text-blue-500 shrink-0" />
              <span>
                Format Cetak Aktif: <strong className="text-slate-800 dark:text-slate-200">{printMode === 'matrix' ? (isMid ? 'Leger Nilai Mid Semester (ASTS)' : 'Leger Nilai Lengkap (SAS)') : printMode === 'leaderboard' ? 'Daftar Peringkat & Prestasi Se-Kelas' : 'Rekapitulasi Kenaikan Kelas & Kelulusan'}</strong> — Hasil cetak terisolasi khusus format ini saja.
              </span>
            </div>
            <span className="text-[10px] text-slate-400">
              {pageOrientation === 'landscape' ? '📄 Lanskap' : '📄 Tegak (Portrait)'} &bull; {paperSize.toUpperCase()}
            </span>
          </div>

          <div
            id="printable-official-document"
            className="printable-document-sheet max-w-[1150px] mx-auto bg-white p-5 sm:p-8 rounded-2xl shadow-md border border-slate-300 text-black print:border-none print:shadow-none print:p-0 print:m-0 print:w-full print:max-w-none font-sans print:text-black print:bg-white"
          >
            {/* 1. Header Kop Surat Resmi */}
            <HeaderKopSekolah
              documentTitle={getDocTitle()}
              subTitle={getDocSubtitle()}
              logoSize={pageOrientation === 'landscape' ? 56 : 64}
            />

            {/* 2. Metadata Information Block */}
            <div className="grid grid-cols-2 text-[10px] sm:text-[10.5px] leading-tight mb-2.5 text-black border-b border-black pb-1.5">
              <div className="space-y-0.5">
                <p>
                  <strong>Satuan Pendidikan:</strong> {schoolInfo.schoolName}
                </p>
                <p>
                  <strong>Kelas / Fase:</strong> {schoolInfo.className} / {schoolInfo.phase || 'Fase B'}
                </p>
                <p>
                  <strong>Periode Penilaian:</strong> {isMid ? `Tengah Semester (ASTS) ${schoolInfo.semester}` : `${schoolInfo.semester} (${isGenap ? 'Semester Genap' : 'Semester Ganjil'})`}
                </p>
              </div>
              <div className="space-y-0.5 text-right">
                <p>
                  <strong>Tahun Ajaran:</strong> {schoolInfo.academicYear}
                </p>
                <p>
                  <strong>Tempat & Tanggal:</strong> {getFormattedTitimangsa(customReportDate)}
                </p>
                <p>
                  <strong>Guru / Wali Kelas:</strong> {schoolInfo.homeroomTeacherName}
                </p>
                <p>
                  <strong>NIP:</strong> {schoolInfo.homeroomTeacherNip || '-'}
                </p>
              </div>
            </div>

            {/* ========================================================================= */}
            {/* FORMAT 1: LEGER NILAI & PRESENSI LENGKAP (AKHIR / MID SEMESTER)           */}
            {/* ========================================================================= */}
            {printMode === 'matrix' && (
              <div className="overflow-x-auto print:overflow-visible">
                <table className={`w-full text-left ${scale.tableText} border-collapse border border-black text-black`}>
                  <thead>
                    <tr className="bg-slate-100 border border-black text-center font-bold">
                      <th rowSpan={2} className={`border border-black ${scale.thPad} w-6 text-center`}>
                        No
                      </th>
                      <th rowSpan={2} className={`border border-black ${scale.thPad} text-left min-w-[120px]`}>
                        Nama Peserta Didik
                      </th>
                      <th rowSpan={2} className={`border border-black ${scale.thPad} w-6 text-center`}>
                        L/P
                      </th>

                      {/* Mapel Columns */}
                      <th colSpan={subjects.length} className={`border border-black ${scale.thPad} ${isMid ? 'bg-amber-100/70' : 'bg-slate-200'}`}>
                        {isMid ? 'Mata Pelajaran (Nilai ASTS Tengah Semester)' : 'Mata Pelajaran (Nilai Akhir Rapor KMPM)'}
                      </th>

                      <th rowSpan={2} className={`border border-black ${scale.thPad} w-10 font-extrabold ${isMid ? 'bg-amber-100/70' : 'bg-slate-200'}`}>
                        Total
                      </th>
                      <th rowSpan={2} className={`border border-black ${scale.thPad} w-10 font-extrabold ${isMid ? 'bg-amber-100/70' : 'bg-slate-200'}`}>
                        Rata²
                      </th>

                      {showRankColumn && (
                        <th rowSpan={2} className={`border border-black ${scale.thPad} w-8 font-extrabold bg-amber-100`}>
                          Rank
                        </th>
                      )}

                      {showAttendance && (
                        <th colSpan={3} className={`border border-black ${scale.thPad}`}>
                          {isMid ? 'Absensi Mid' : 'Ketidakhadiran'}
                        </th>
                      )}

                      {showStatusColumn && (
                        <th rowSpan={2} className={`border border-black ${scale.thPad} min-w-[75px]`}>
                          {isMid ? 'Catatan Mid' : `Status ${isGenap ? 'Kenaikan' : 'Capaian'}`}
                        </th>
                      )}
                    </tr>

                    <tr className="bg-slate-50 border border-black text-center font-bold text-[8px]">
                      {subjects.map(sub => {
                        const isAgm = isAgamaSubject(sub);
                        return (
                          <th
                            key={sub.id}
                            className={`border border-black ${scale.mapelColWidth}`}
                            title={isAgm ? `Pendidikan Agama & Budi Pekerti (Sesuai agama siswa, KKTP: ${sub.kktp})` : `${sub.nama} (KKTP: ${sub.kktp})`}
                          >
                            <div className="font-bold truncate">{isAgm ? 'Agama' : sub.kode}</div>
                            <div className="text-[7px] font-normal text-slate-600">≥{sub.kktp}</div>
                          </th>
                        );
                      })}

                      {showAttendance && (
                        <>
                          <th className="border border-black p-0.5 w-5 font-bold">S</th>
                          <th className="border border-black p-0.5 w-5 font-bold">I</th>
                          <th className="border border-black p-0.5 w-5 font-bold">A</th>
                        </>
                      )}
                    </tr>
                  </thead>

                  <tbody>
                    {sortedStudents.map((item, idx) => {
                      const s = item.student;
                      const r = item.report;
                      const isTop3 = item.numericRank <= 3;
                      const rankValue = isMid
                        ? (r.rankingMid || (item.numericRank < 999 ? item.numericRank : '-'))
                        : (r.ranking || (item.numericRank < 999 ? item.numericRank : '-'));

                      const noteDisplay = isMid
                        ? (r.catatanWaliKelasMid
                            ? (r.catatanWaliKelasMid.length > 55 ? r.catatanWaliKelasMid.slice(0, 52) + '...' : r.catatanWaliKelasMid)
                            : (item.avgScore >= 75 ? 'Tuntas ASTS' : 'Perlu Bimbingan ASTS'))
                        : (r.statusKenaikan || 'Naik Kelas');

                      return (
                        <tr
                          key={s.id}
                          className={`border border-black text-center ${
                            isTop3 ? 'bg-amber-50/40' : ''
                          }`}
                        >
                          <td className={`border border-black ${scale.tdPad} font-bold text-center`}>
                            {s.nomorAbsen || idx + 1}
                          </td>
                          <td className={`border border-black ${scale.tdPad} text-left whitespace-normal break-words`}>
                            <div className={scale.nameText}>{s.nama}</div>
                            {showNisn && (
                              <div className={scale.nisnText}>
                                {s.nisn ? `NISN: ${s.nisn} • ` : ''}{s.agama}
                              </div>
                            )}
                          </td>
                          <td className={`border border-black ${scale.tdPad} text-center`}>
                            {s.jenisKelamin}
                          </td>

                          {/* Scores */}
                          {subjects.map(sub => {
                            const score = item.subjectScores[sub.id] ?? 0;
                            const isTuntas = score >= (sub.kktp || 75);

                            return (
                              <td
                                key={sub.id}
                                className={`border border-black ${scale.tdPad} font-semibold text-center ${
                                  !isTuntas && score > 0 ? 'text-rose-700 font-bold bg-rose-50' : ''
                                }`}
                              >
                                {score > 0 ? score : '-'}
                              </td>
                            );
                          })}

                          {/* Total & Average */}
                          <td className={`border border-black ${scale.tdPad} font-black text-center bg-slate-50`}>
                            {item.totalScore}
                          </td>
                          <td className={`border border-black ${scale.tdPad} font-black text-center bg-slate-50`}>
                            {item.avgScore}
                          </td>

                          {showRankColumn && (
                            <td className={`border border-black ${scale.tdPad} font-black text-center bg-amber-50`}>
                              {rankValue}
                            </td>
                          )}

                          {/* Attendance */}
                          {showAttendance && (
                            <>
                              <td className={`border border-black ${scale.tdPad} text-center font-mono`}>
                                {item.attStats.sakit}
                              </td>
                              <td className={`border border-black ${scale.tdPad} text-center font-mono`}>
                                {item.attStats.izin}
                              </td>
                              <td className={`border border-black ${scale.tdPad} text-center font-mono font-bold ${item.attStats.alpa > 0 ? 'text-rose-700' : ''}`}>
                                {item.attStats.alpa}
                              </td>
                            </>
                          )}

                          {/* Status / Catatan */}
                          {showStatusColumn && (
                            <td className={`border border-black ${scale.tdPad} font-medium text-left leading-tight text-[8px]`}>
                              {noteDisplay}
                            </td>
                          )}
                        </tr>
                      );
                    })}
                  </tbody>

                  {/* Summary Footer */}
                  {showStatsFooter && (
                    <tfoot>
                      {/* Rata-Rata */}
                      <tr className="bg-slate-100 font-bold border-t-2 border-black">
                        <td colSpan={3} className={`border border-black ${scale.tdPad} text-right font-black`}>
                          RATA-RATA KELAS:
                        </td>
                        {subjects.map(sub => (
                          <td key={sub.id} className={`border border-black ${scale.tdPad} text-center font-mono font-bold`}>
                            {classStats.subjectAverages[sub.id] ?? '-'}
                          </td>
                        ))}
                        <td className={`border border-black ${scale.tdPad} text-center font-black`}>
                          {(classStats.overallAvg * subjects.length).toFixed(0)}
                        </td>
                        <td className={`border border-black ${scale.tdPad} text-center font-black`}>
                          {classStats.overallAvg}
                        </td>
                        {trailingExtraCols > 0 && (
                          <td colSpan={trailingExtraCols} className={`border border-black ${scale.tdPad} text-[8px] text-left`}>
                            Rerata dari {students.length} Peserta Didik ({isMid ? 'Mid ASTS' : 'Akhir Smt'})
                          </td>
                        )}
                      </tr>

                      {/* Tertinggi */}
                      <tr className="bg-slate-50 text-[8px]">
                        <td colSpan={3} className={`border border-black ${scale.tdPad} text-right font-bold text-emerald-800`}>
                          NILAI TERTINGGI:
                        </td>
                        {subjects.map(sub => (
                          <td key={sub.id} className={`border border-black ${scale.tdPad} text-center font-mono font-bold text-emerald-800`}>
                            {classStats.subjectMax[sub.id] ?? '-'}
                          </td>
                        ))}
                        <td className={`border border-black ${scale.tdPad} text-center font-bold text-emerald-800`}>
                          {classStats.highestTotal}
                        </td>
                        <td colSpan={1 + trailingExtraCols} className={`border border-black ${scale.tdPad} text-[8px] text-left`}>
                          Total Terendah: {classStats.lowestTotal}
                        </td>
                      </tr>

                      {/* % Tuntas */}
                      <tr className="bg-slate-50 text-[8px]">
                        <td colSpan={3} className={`border border-black ${scale.tdPad} text-right font-bold text-blue-800`}>
                          KETUNTASAN KKTP (%):
                        </td>
                        {subjects.map(sub => (
                          <td key={sub.id} className={`border border-black ${scale.tdPad} text-center font-mono font-bold text-blue-800`}>
                            {classStats.subjectPassPercent[sub.id]}%
                          </td>
                        ))}
                        <td colSpan={2 + trailingExtraCols} className={`border border-black ${scale.tdPad} text-[8px] text-left`}>
                          Target Ketercapaian Pembelajaran Mendalam (KMPM) 100%
                        </td>
                      </tr>
                    </tfoot>
                  )}
                </table>
              </div>
            )}

            {/* ========================================================================= */}
            {/* FORMAT 2: DAFTAR PERINGKAT & PRESTASI SE-KELAS                            */}
            {/* ========================================================================= */}
            {printMode === 'leaderboard' && (
              <div className="overflow-x-auto print:overflow-visible space-y-3">
                <table className="w-full text-left text-[9.5px] border-collapse border border-black text-black">
                  <thead>
                    <tr className="bg-slate-100 border border-black text-center font-bold">
                      <th className="border border-black p-1.5 w-12 bg-amber-100 font-black">
                        Peringkat
                      </th>
                      <th className="border border-black p-1.5 w-10">Absen</th>
                      {showNisn && <th className="border border-black p-1.5 w-24">NISN</th>}
                      <th className="border border-black p-1.5 text-left min-w-[150px]">
                        Nama Peserta Didik
                      </th>
                      <th className="border border-black p-1.5 w-8">L/P</th>
                      <th className="border border-black p-1.5 w-16 font-extrabold bg-slate-200">
                        {isMid ? 'Total ASTS' : 'Total Nilai'}
                      </th>
                      <th className="border border-black p-1.5 w-16 font-extrabold bg-slate-200">
                        Rata-Rata
                      </th>
                      <th className="border border-black p-1.5 w-14">Predikat</th>
                      <th className="border border-black p-1.5 text-left min-w-[120px]">
                        Mapel Tertinggi
                      </th>
                      <th className="border border-black p-1.5 w-20">Ketuntasan</th>
                      <th className="border border-black p-1.5 text-left min-w-[140px]">
                        Catatan Prestasi & Rekomendasi
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedStudents.map((item, idx) => {
                      const s = item.student;
                      const r = item.report;
                      const rankDisplay = isMid
                        ? (r.rankingMid || item.numericRank)
                        : (r.ranking || item.numericRank);
                      const isTop1 = item.numericRank === 1;
                      const isTop2 = item.numericRank === 2;
                      const isTop3 = item.numericRank === 3;

                      const noteText = isMid
                        ? (r.catatanWaliKelasMid || (item.numericRank <= 3 ? 'Prestasi gemilang di paruh semester ini.' : 'Tingkatkan ketekunan belajar di paruh semester kedua.'))
                        : (r.catatanWaliKelas || (item.numericRank <= 3 ? 'Prestasi istimewa, pertahankan capaian belajar.' : 'Tingkatkan keaktifan dan ketuntasan belajar.'));

                      return (
                        <tr
                          key={s.id}
                          className={`border border-black text-center ${
                            isTop1
                              ? 'bg-amber-100/60 font-medium'
                              : isTop2 || isTop3
                              ? 'bg-amber-50/50'
                              : ''
                          }`}
                        >
                          <td className="border border-black p-1.5 font-black text-center text-xs">
                            {isTop1 ? '🥇 1' : isTop2 ? '🥈 2' : isTop3 ? '🥉 3' : rankDisplay}
                          </td>
                          <td className="border border-black p-1.5 font-bold">
                            {s.nomorAbsen || idx + 1}
                          </td>
                          {showNisn && <td className="border border-black p-1.5 font-mono">{s.nisn}</td>}
                          <td className="border border-black p-1.5 text-left font-bold">{s.nama}</td>
                          <td className="border border-black p-1.5">{s.jenisKelamin}</td>
                          <td className="border border-black p-1.5 font-black bg-slate-50">
                            {item.totalScore}
                          </td>
                          <td className="border border-black p-1.5 font-black bg-slate-50">
                            {item.avgScore}
                          </td>
                          <td className="border border-black p-1.5 font-bold">
                            {item.predicate}
                          </td>
                          <td className="border border-black p-1.5 text-left text-[9px]">
                            {item.bestSubject} ({item.maxScore})
                          </td>
                          <td className="border border-black p-1.5 text-[9px] font-semibold">
                            {item.completedCount}/{subjects.length} Tuntas
                          </td>
                          <td className="border border-black p-1.5 text-left text-[8.5px] leading-tight">
                            {noteText.length > 75 ? noteText.slice(0, 72) + '...' : noteText}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* ========================================================================= */}
            {/* FORMAT 3: REKAP KEPUTUSAN KENAIKAN KELAS & KELULUSAN                      */}
            {/* ========================================================================= */}
            {printMode === 'kenaikan' && !isMid && (
              <div className="overflow-x-auto print:overflow-visible space-y-4">
                <table className="w-full text-left text-[9.5px] border-collapse border border-black text-black">
                  <thead>
                    <tr className="bg-slate-100 border border-black text-center font-bold">
                      <th className="border border-black p-1.5 w-10">No</th>
                      {showNisn && <th className="border border-black p-1.5 w-24">NISN</th>}
                      <th className="border border-black p-1.5 text-left min-w-[150px]">
                        Nama Peserta Didik
                      </th>
                      <th className="border border-black p-1.5 w-8">L/P</th>
                      <th className="border border-black p-1.5 w-16">Rata² Nilai</th>
                      <th className="border border-black p-1.5 min-w-[100px] font-extrabold bg-slate-200">
                        Keputusan Status
                      </th>
                      <th className="border border-black p-1.5 min-w-[90px]">Target Kelas</th>
                      <th className="border border-black p-1.5 text-left min-w-[220px]">
                        Narasi Keputusan Resmi Rapor
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedStudents.map((item, idx) => {
                      const s = item.student;
                      const r = item.report;
                      const status = r.statusKenaikan || 'Naik Kelas';

                      return (
                        <tr key={s.id} className="border border-black text-center">
                          <td className="border border-black p-1.5 font-bold">
                            {s.nomorAbsen || idx + 1}
                          </td>
                          {showNisn && <td className="border border-black p-1.5 font-mono">{s.nisn}</td>}
                          <td className="border border-black p-1.5 text-left font-bold">{s.nama}</td>
                          <td className="border border-black p-1.5">{s.jenisKelamin}</td>
                          <td className="border border-black p-1.5 font-bold">{item.avgScore}</td>
                          <td className="border border-black p-1.5 font-black uppercase text-[9.5px]">
                            {status}
                          </td>
                          <td className="border border-black p-1.5 font-semibold text-[9px]">
                            {r.targetKelas || '-'}
                          </td>
                          <td className="border border-black p-1.5 text-left text-[8.5px] leading-tight">
                            {r.keteranganKenaikan ||
                              `Berdasarkan pencapaian seluruh tujuan pembelajaran pada Tahun Ajaran ${schoolInfo.academicYear}, ananda dinyatakan: NAIK KELAS.`}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                {/* Ringkasan Jumlah */}
                <div className="border border-black p-2.5 bg-slate-50 text-[9.5px] grid grid-cols-3 text-center font-bold">
                  <div>Naik Kelas: {classStats.countNaik} Siswa</div>
                  <div>Tinggal Kelas: {classStats.countTinggal} Siswa</div>
                  <div>Lulus: {classStats.countLulus} Siswa</div>
                </div>
              </div>
            )}

            {/* 3. Tanda Tangan Resmi 2 Pihak */}
            {showSignature && (
              <div className="mt-6 sm:mt-8 grid grid-cols-2 text-[10.5px] text-center text-black page-break-inside-avoid">
                <div>
                  <p>Mengetahui,</p>
                  <p className="font-bold">Kepala Sekolah {schoolInfo.schoolName}</p>
                  <div className={scale.signGap} />
                  <p className="font-bold uppercase underline">
                    {schoolInfo.headmasterName || 'NAMA KEPALA SEKOLAH'}
                  </p>
                  <p className="font-mono text-[9.5px]">
                    NIP. {schoolInfo.headmasterNip || '----------------------'}
                  </p>
                </div>

                <div>
                  <p className="font-medium text-black">
                    {getFormattedTitimangsa(customReportDate)}
                  </p>
                  <p className="font-bold">Guru Kelas / Wali Kelas {schoolInfo.className}</p>
                  <div className={scale.signGap} />
                  <p className="font-bold uppercase underline">
                    {schoolInfo.homeroomTeacherName || 'NAMA GURU WALI KELAS'}
                  </p>
                  <p className="font-mono text-[9.5px]">
                    NIP. {schoolInfo.homeroomTeacherNip || '----------------------'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 sm:px-5 py-3 no-print print:hidden shrink-0">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Info className="h-4 w-4 text-blue-500" />
            <span>Format cetak dioptimalkan untuk kertas A4 / F4 (Folio) {pageOrientation === 'landscape' ? 'Lanskap' : 'Tegak'}.</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors"
            >
              Tutup
            </button>
            <button
              type="button"
              onClick={handlePrintDocument}
              className={`flex items-center gap-1.5 px-5 py-2 rounded-xl text-white text-xs font-bold shadow-md transition-all cursor-pointer ${
                isMid
                  ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-600/20 active:scale-95'
                  : 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/20 active:scale-95'
              }`}
            >
              <Printer className="h-4 w-4" />
              <span>Cetak Leger Resmi {isMid ? 'Mid Semester' : 'Akhir Semester'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : modalContent;
};
