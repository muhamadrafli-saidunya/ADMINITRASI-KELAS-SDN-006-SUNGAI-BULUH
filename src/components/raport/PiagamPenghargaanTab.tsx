import React, { useState, useMemo, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { Student } from '../../types';
import { SchoolLogoRenderer } from '../common/SchoolLogoRenderer';
import {
  Award,
  Trophy,
  Medal,
  Star,
  Printer,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Calendar,
  CheckCircle2,
  SlidersHorizontal,
  FileText,
  User,
  Crown,
  Layers,
  Edit3,
  RotateCcw,
  Check
} from 'lucide-react';

export type PiagamTheme = 'royal_gold' | 'batik_nusantara' | 'emerald_prestige' | 'ruby_excellence' | 'classic_diplomat';
export type PiagamPaperSize = 'A4' | 'F4';

export interface PiagamCustomData {
  nomorPiagam?: string;
  kategoriPrestasi?: string;
  catatanApresiasi?: string;
  tanggalPiagam?: string;
}

interface PiagamPenghargaanTabProps {
  initialStudentId?: string;
  onSelectStudentId?: (id: string) => void;
}

// Preset Frame Themes
const THEME_OPTIONS: { id: PiagamTheme; label: string; desc: string; color: string; bgBadge: string }[] = [
  {
    id: 'royal_gold',
    label: 'Royal Gold (Emas Kemewahan)',
    desc: 'Bingkai keemasan berornamen klasik dengan medali emas megah',
    color: '#b45309',
    bgBadge: 'bg-amber-100 text-amber-900 border-amber-300'
  },
  {
    id: 'batik_nusantara',
    label: 'Batik Nusantara (Navy & Gold)',
    desc: 'Nuansa resmi Kemendikbud perpaduan biru kehormatan dan ornamen emas',
    color: '#1e3a8a',
    bgBadge: 'bg-blue-100 text-blue-900 border-blue-300'
  },
  {
    id: 'emerald_prestige',
    label: 'Emerald Prestige (Zamrud Juara)',
    desc: 'Warna hijau zamrud mulia dengan ornamen geometris dan bintang emas',
    color: '#065f46',
    bgBadge: 'bg-emerald-100 text-emerald-900 border-emerald-300'
  },
  {
    id: 'ruby_excellence',
    label: 'Ruby Excellence (Marun Mulia)',
    desc: 'Warna merah marun prestisius dengan aksen perunggu dan mahkota',
    color: '#991b1b',
    bgBadge: 'bg-rose-100 text-rose-900 border-rose-300'
  },
  {
    id: 'classic_diplomat',
    label: 'Classic Diplomat (Monokrom Elegan)',
    desc: 'Format hitam-putih formal elegan, tajam dan hemat tinta',
    color: '#0f172a',
    bgBadge: 'bg-slate-100 text-slate-900 border-slate-300'
  }
];

export const PiagamPenghargaanTab: React.FC<PiagamPenghargaanTabProps> = ({
  initialStudentId,
  onSelectStudentId
}) => {
  const {
    schoolInfo,
    students,
    subjects,
    getAllGradesForStudent,
    getStudentReport,
    calculateStudentRankings
  } = useApp();

  // Rankings map
  const rankings = useMemo(() => calculateStudentRankings(), [students, subjects]);
  const rankingsMap = useMemo(() => {
    const map = new Map<string, number>();
    rankings.forEach(r => map.set(r.studentId, r.rank));
    return map;
  }, [rankings]);

  // Total scores and average map
  const studentScoresMap = useMemo(() => {
    const map = new Map<string, { total: number; avg: number }>();
    students.forEach(s => {
      const gList = getAllGradesForStudent(s.id);
      const total = gList.reduce((acc, g) => acc + (g.nilaiAkhir || 0), 0);
      const avg = gList.length > 0 ? +(total / gList.length).toFixed(1) : 0;
      map.set(s.id, { total, avg });
    });
    return map;
  }, [students, getAllGradesForStudent]);

  // Sort students by rank for easy discovery
  const sortedStudentsByRank = useMemo(() => {
    return [...students].sort((a, b) => {
      const rankA = rankingsMap.get(a.id) ?? 999;
      const rankB = rankingsMap.get(b.id) ?? 999;
      return rankA - rankB;
    });
  }, [students, rankingsMap]);

  // State
  const [selectedStudentId, setSelectedStudentId] = useState<string>(
    initialStudentId || sortedStudentsByRank[0]?.id || students[0]?.id || ''
  );
  const [theme, setTheme] = useState<PiagamTheme>('royal_gold');
  const [paperSize, setPaperSize] = useState<PiagamPaperSize>('A4');
  const [filterMode, setFilterMode] = useState<'all' | 'top3' | 'top5' | 'top10'>('top3');
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);
  const [batchPrintStudents, setBatchPrintStudents] = useState<Student[] | null>(null);

  // Custom Piagam Overrides per student ID
  const [customDataMap, setCustomDataMap] = useState<Record<string, PiagamCustomData>>({});
  const [isEditingCustom, setIsEditingCustom] = useState(false);

  // Active student object
  const selectedStudent = useMemo(() => {
    return students.find(s => s.id === selectedStudentId) || sortedStudentsByRank[0] || students[0];
  }, [students, selectedStudentId, sortedStudentsByRank]);

  const activeStudentRank = rankingsMap.get(selectedStudent?.id || '') ?? 1;
  const activeStudentScore = studentScoresMap.get(selectedStudent?.id || '') ?? { total: 0, avg: 0 };

  // Generate default Piagam Number
  const defaultNomorPiagam = useMemo(() => {
    const cleanSchool = (schoolInfo.schoolName || 'SD').replace(/[^a-zA-Z0-9]/g, '').slice(0, 6).toUpperCase();
    const rankStr = String(activeStudentRank).padStart(2, '0');
    const smtRomawi = schoolInfo.semester?.includes('1') ? 'XII' : 'VI';
    const year = schoolInfo.academicYear?.split('/')[0] || '2025';
    return `421.2/${rankStr}/${cleanSchool}/PP/${smtRomawi}/${year}`;
  }, [activeStudentRank, schoolInfo.schoolName, schoolInfo.semester, schoolInfo.academicYear]);

  // Generate default Achievement category
  const defaultKategoriPrestasi = useMemo(() => {
    if (activeStudentRank === 1) {
      return `JUARA I (PERTAMA) KELAS ${schoolInfo.className.toUpperCase()}`;
    } else if (activeStudentRank === 2) {
      return `JUARA II (KEDUA) KELAS ${schoolInfo.className.toUpperCase()}`;
    } else if (activeStudentRank === 3) {
      return `JUARA III (KETIGA) KELAS ${schoolInfo.className.toUpperCase()}`;
    } else if (activeStudentRank <= 10) {
      return `PERINGKAT ${activeStudentRank} (SEPULUH BESAR) KELAS ${schoolInfo.className.toUpperCase()}`;
    }
    return `PRESTASI AKADEMIK & KARAKTER TERPUJI KELAS ${schoolInfo.className.toUpperCase()}`;
  }, [activeStudentRank, schoolInfo.className]);

  // Default tanggal piagam (disamakan dengan tanggal rapor siswa)
  const defaultTanggalPiagam = useMemo(() => {
    if (schoolInfo.tanggalRapor) return schoolInfo.tanggalRapor;
    const rep = selectedStudent ? getStudentReport(selectedStudent.id) : null;
    if (rep?.tempatTanggalRapor) return rep.tempatTanggalRapor;
    const isGenap = schoolInfo.semester?.includes('2');
    return isGenap
      ? `${schoolInfo.city || 'Kota Jakarta Selatan'}, 20 Juni 2027`
      : `${schoolInfo.city || 'Kota Jakarta Selatan'}, 19 Desember 2026`;
  }, [schoolInfo.tanggalRapor, schoolInfo.city, schoolInfo.semester, selectedStudent, getStudentReport]);

  const defaultCatatanApresiasi = useMemo(() => {
    return `Atas dedikasi, kedisiplinan, serta prestasi akademik yang sangat membanggakan dengan perolehan Rata-Rata Nilai ${activeStudentScore.avg} (Total Skor: ${activeStudentScore.total}) pada Semester ${schoolInfo.semester} Tahun Pelajaran ${schoolInfo.academicYear}.`;
  }, [activeStudentScore, schoolInfo.semester, schoolInfo.academicYear]);

  // Current active student custom or default data
  const currentCustom = customDataMap[selectedStudent?.id || ''] || {};
  const currentNomor = currentCustom.nomorPiagam || defaultNomorPiagam;
  const currentKategori = currentCustom.kategoriPrestasi || defaultKategoriPrestasi;
  const currentTanggal = currentCustom.tanggalPiagam || defaultTanggalPiagam;
  const currentCatatan = currentCustom.catatanApresiasi || defaultCatatanApresiasi;

  const handleUpdateCurrentStudentCustom = (fields: Partial<PiagamCustomData>) => {
    if (!selectedStudent) return;
    setCustomDataMap(prev => ({
      ...prev,
      [selectedStudent.id]: {
        ...(prev[selectedStudent.id] || {}),
        ...fields
      }
    }));
  };

  const handleResetCurrentStudentCustom = () => {
    if (!selectedStudent) return;
    setCustomDataMap(prev => {
      const copy = { ...prev };
      delete copy[selectedStudent.id];
      return copy;
    });
  };

  // Navigations
  const currentRankIndex = sortedStudentsByRank.findIndex(s => s.id === selectedStudentId);
  const handlePrevStudent = () => {
    if (currentRankIndex > 0) {
      const nextId = sortedStudentsByRank[currentRankIndex - 1].id;
      setSelectedStudentId(nextId);
      if (onSelectStudentId) onSelectStudentId(nextId);
    }
  };

  const handleNextStudent = () => {
    if (currentRankIndex < sortedStudentsByRank.length - 1) {
      const nextId = sortedStudentsByRank[currentRankIndex + 1].id;
      setSelectedStudentId(nextId);
      if (onSelectStudentId) onSelectStudentId(nextId);
    }
  };

  // Filtered students for list/select
  const displayedStudents = useMemo(() => {
    if (filterMode === 'top3') return sortedStudentsByRank.slice(0, 3);
    if (filterMode === 'top5') return sortedStudentsByRank.slice(0, 5);
    if (filterMode === 'top10') return sortedStudentsByRank.slice(0, 10);
    return sortedStudentsByRank;
  }, [sortedStudentsByRank, filterMode]);

  // Single Print handler
  const handlePrintSingle = () => {
    setBatchPrintStudents(null);
    setTimeout(() => {
      window.print();
    }, 150);
  };

  // Batch Print handler
  const handleStartBatchPrint = (studentsList: Student[]) => {
    setBatchPrintStudents(studentsList);
    setIsBatchModalOpen(false);
    setTimeout(() => {
      window.print();
    }, 200);
  };

  // Color scheme based on theme
  const themeStyles = useMemo(() => {
    switch (theme) {
      case 'batik_nusantara':
        return {
          primary: '#1e3a8a',
          gold: '#b45309',
          borderOuter: 'border-[#1e3a8a]',
          borderInner: 'border-[#b45309]',
          badgeBg: 'from-blue-900 to-indigo-950',
          titleColor: '#1e3a8a',
          ribbonColor: '#b45309',
          gradientBg: 'from-blue-50/40 via-white to-amber-50/30',
          sealColor: '#b45309',
          accentText: 'text-blue-950'
        };
      case 'emerald_prestige':
        return {
          primary: '#065f46',
          gold: '#d97706',
          borderOuter: 'border-[#065f46]',
          borderInner: 'border-[#d97706]',
          badgeBg: 'from-emerald-900 to-teal-950',
          titleColor: '#065f46',
          ribbonColor: '#d97706',
          gradientBg: 'from-emerald-50/40 via-white to-amber-50/30',
          sealColor: '#d97706',
          accentText: 'text-emerald-950'
        };
      case 'ruby_excellence':
        return {
          primary: '#991b1b',
          gold: '#b45309',
          borderOuter: 'border-[#991b1b]',
          borderInner: 'border-[#b45309]',
          badgeBg: 'from-rose-900 to-red-950',
          titleColor: '#991b1b',
          ribbonColor: '#b45309',
          gradientBg: 'from-rose-50/40 via-white to-amber-50/30',
          sealColor: '#b45309',
          accentText: 'text-rose-950'
        };
      case 'classic_diplomat':
        return {
          primary: '#0f172a',
          gold: '#475569',
          borderOuter: 'border-slate-900',
          borderInner: 'border-slate-600',
          badgeBg: 'from-slate-800 to-slate-950',
          titleColor: '#0f172a',
          ribbonColor: '#475569',
          gradientBg: 'from-slate-50 via-white to-slate-50',
          sealColor: '#475569',
          accentText: 'text-slate-950'
        };
      case 'royal_gold':
      default:
        return {
          primary: '#854d0e',
          gold: '#b45309',
          borderOuter: 'border-[#92400e]',
          borderInner: 'border-[#b45309]',
          badgeBg: 'from-amber-800 via-amber-900 to-yellow-950',
          titleColor: '#854d0e',
          ribbonColor: '#b45309',
          gradientBg: 'from-amber-50/50 via-white to-yellow-50/40',
          sealColor: '#b45309',
          accentText: 'text-amber-950'
        };
    }
  }, [theme]);

  const isF4 = paperSize === 'F4';

  return (
    <div className="space-y-6">
      {/* Dynamic Print CSS for Piagam (Landscape Orientation) */}
      <style>{`
        @media print {
          @page {
            size: ${isF4 ? '330mm 215mm' : '297mm 210mm'} landscape !important;
            margin: 6mm !important;
          }
          body {
            background-color: white !important;
            color: black !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .print-hidden-piagam {
            display: none !important;
          }
          .piagam-single-card {
            width: 100% !important;
            height: ${isF4 ? '203mm' : '198mm'} !important;
            max-height: ${isF4 ? '203mm' : '198mm'} !important;
            box-sizing: border-box !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
            page-break-after: always !important;
            break-after: page !important;
            margin: 0 !important;
            box-shadow: none !important;
          }
          .piagam-batch-container .piagam-single-card:last-child {
            page-break-after: auto !important;
            break-after: auto !important;
          }
        }
      `}</style>

      {/* ========================================================================= */}
      {/* 1. BILAH KONTROL PIAGAM PENGHARGAAN (INTERAKTIF & RESPONSIF)              */}
      {/* ========================================================================= */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm space-y-4 print-hidden-piagam">
        {/* Banner Utama Piagam */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 p-4 rounded-2xl bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-700 text-white shadow-md">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md text-white shadow-inner shrink-0 ring-2 ring-white/30">
              <Trophy className="h-6 w-6 text-yellow-200" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-white/25 text-white border border-white/30 shadow-xs">
                  Apresiasi & Prestasi Siswa
                </span>
                <span className="text-xs font-bold text-amber-100 flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 fill-yellow-300 text-yellow-300" />
                  Kelas {schoolInfo.className} • TP {schoolInfo.academicYear}
                </span>
              </div>
              <h1 className="text-lg sm:text-xl font-black tracking-tight text-white mt-1">
                Format Piagam Penghargaan Siswa Berprestasi
              </h1>
              <p className="text-xs text-amber-100/90 leading-relaxed mt-0.5">
                Cetak piagam penghargaan resmi nan mewah untuk siswa berprestasi di kelas (Juara 1, 2, 3, 10 besar, nilai terbaik mapel, maupun siswa teladan).
              </p>
            </div>
          </div>

          {/* Quick Print Actions */}
          <div className="flex items-center gap-2 flex-wrap shrink-0">
            <button
              type="button"
              onClick={handlePrintSingle}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-amber-950 font-black text-xs shadow-md hover:bg-amber-50 active:scale-95 transition-all cursor-pointer"
              title="Cetak piagam siswa aktif saat ini"
            >
              <Printer className="h-4 w-4 text-amber-700" />
              <span>Cetak Piagam Siswa Ini</span>
            </button>

            <button
              type="button"
              onClick={() => setIsBatchModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs shadow-md active:scale-95 transition-all border border-amber-300/40 cursor-pointer"
              title="Cetak massal piagam untuk Top 3, Top 10, atau seluruh siswa"
            >
              <Medal className="h-4 w-4 text-yellow-400" />
              <span>Cetak Massal Piagam</span>
            </button>
          </div>
        </div>

        {/* Baris Navigasi Siswa & Filter Cepat */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 pt-1">
          {/* Filter Cepat Juara */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 px-2 flex items-center gap-1">
              <Crown className="h-3.5 w-3.5 text-amber-500" />
              Filter Cepat:
            </span>
            <button
              type="button"
              onClick={() => setFilterMode('top3')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filterMode === 'top3'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'text-slate-700 dark:text-slate-300 hover:text-amber-600'
              }`}
            >
              Juara 1-3 (Podium)
            </button>
            <button
              type="button"
              onClick={() => setFilterMode('top5')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filterMode === 'top5'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'text-slate-700 dark:text-slate-300 hover:text-amber-600'
              }`}
            >
              5 Besar
            </button>
            <button
              type="button"
              onClick={() => setFilterMode('top10')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filterMode === 'top10'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'text-slate-700 dark:text-slate-300 hover:text-amber-600'
              }`}
            >
              10 Besar
            </button>
            <button
              type="button"
              onClick={() => setFilterMode('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filterMode === 'all'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'text-slate-700 dark:text-slate-300 hover:text-amber-600'
              }`}
            >
              Semua ({students.length})
            </button>
          </div>

          {/* Student Selector Dropdown with Prev/Next buttons */}
          <div className="flex items-center gap-2 flex-1 max-w-md">
            <button
              type="button"
              onClick={handlePrevStudent}
              disabled={currentRankIndex <= 0}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              title="Siswa Sebelumnya"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <select
              value={selectedStudentId}
              onChange={e => {
                setSelectedStudentId(e.target.value);
                if (onSelectStudentId) onSelectStudentId(e.target.value);
              }}
              className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs font-bold text-slate-900 dark:text-white shadow-xs focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
            >
              {displayedStudents.map((s) => {
                const r = rankingsMap.get(s.id) ?? '-';
                const sc = studentScoresMap.get(s.id) ?? { avg: 0, total: 0 };
                const medalIcon = r === 1 ? '🥇' : r === 2 ? '🥈' : r === 3 ? '🥉' : `#${r}`;
                return (
                  <option key={s.id} value={s.id}>
                    {medalIcon} Peringkat {r}: {s.nama} (Rata-rata: {sc.avg} • Nilai: {sc.total})
                  </option>
                );
              })}
            </select>

            <button
              type="button"
              onClick={handleNextStudent}
              disabled={currentRankIndex >= sortedStudentsByRank.length - 1}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              title="Siswa Selanjutnya"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Pilihan Gaya Bingkai & Ukuran Kertas */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-600" />
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                Pilih Desain Bingkai Piagam:
              </span>
            </div>

            {/* Paper Size selector (A4 vs F4) */}
            <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
              <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300 px-2 flex items-center gap-1">
                <FileText className="h-3.5 w-3.5 text-amber-600" />
                Ukuran Kertas:
              </span>
              <button
                type="button"
                onClick={() => setPaperSize('A4')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  paperSize === 'A4'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-slate-700 dark:text-slate-300 hover:text-amber-600'
                }`}
                title="A4 Landscape: 29.7 x 21.0 cm"
              >
                A4 (29.7 x 21 cm)
              </button>
              <button
                type="button"
                onClick={() => setPaperSize('F4')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  paperSize === 'F4'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-slate-700 dark:text-slate-300 hover:text-amber-600'
                }`}
                title="F4 / Folio Landscape: 33.0 x 21.5 cm"
              >
                F4 / Folio (33 x 21.5 cm)
              </button>
            </div>
          </div>

          {/* Theme Badges Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
            {THEME_OPTIONS.map(opt => {
              const isSelected = theme === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setTheme(opt.id)}
                  className={`p-2.5 rounded-xl border text-left transition-all relative overflow-hidden flex flex-col justify-between ${
                    isSelected
                      ? 'border-amber-600 bg-amber-50/70 dark:bg-amber-950/40 shadow-xs ring-2 ring-amber-500/40'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 hover:border-amber-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: opt.color }} />
                    {isSelected && <Check className="h-3.5 w-3.5 text-amber-600" />}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                      {opt.label.split('(')[0]}
                    </h4>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                      {opt.desc}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tombol Kustomisasi Isi Piagam (Nomor, Kategori Juara, Catatan) */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Kategori Terpilih: <strong className="text-amber-700 dark:text-amber-400">{currentKategori}</strong>
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500 font-mono">No: {currentNomor}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsEditingCustom(!isEditingCustom)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 text-xs font-bold hover:bg-amber-100 transition-colors cursor-pointer"
            >
              <Edit3 className="h-3.5 w-3.5" />
              <span>{isEditingCustom ? 'Tutup Pengaturan Teks' : 'Kustomisasi Teks & Kategori'}</span>
            </button>

            {Boolean(customDataMap[selectedStudent?.id || '']) && (
              <button
                type="button"
                onClick={handleResetCurrentStudentCustom}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-slate-500 hover:text-rose-600 text-xs font-bold transition-colors"
                title="Kembalikan nomor & teks piagam ke format otomatis"
              >
                <RotateCcw className="h-3 w-3" />
                <span>Reset Default</span>
              </button>
            )}
          </div>
        </div>

        {/* Panel Form Edit Kustomisasi Piagam */}
        {isEditingCustom && (
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3 animate-in fade-in duration-150">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <SlidersHorizontal className="h-3.5 w-3.5 text-amber-600" />
                Kustomisasi Format Piagam: {selectedStudent?.nama}
              </h3>
              <span className="text-[11px] text-slate-500">
                Peringkat {activeStudentRank} di Leger Nilai
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Kategori Prestasi / Gelar Juara:
                </label>
                <div className="space-y-1.5">
                  <input
                    type="text"
                    value={currentKategori}
                    onChange={e => handleUpdateCurrentStudentCustom({ kategoriPrestasi: e.target.value })}
                    placeholder="Contoh: JUARA I (PERTAMA) KELAS IV"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-xs font-bold text-slate-900 dark:text-white"
                  />
                  {/* Preset Kategori Cepat */}
                  <div className="flex flex-wrap items-center gap-1">
                    {[
                      `JUARA I (PERTAMA) KELAS ${schoolInfo.className.toUpperCase()}`,
                      `JUARA II (KEDUA) KELAS ${schoolInfo.className.toUpperCase()}`,
                      `JUARA III (KETIGA) KELAS ${schoolInfo.className.toUpperCase()}`,
                      `PERINGKAT ${activeStudentRank} KELAS ${schoolInfo.className.toUpperCase()}`,
                      'TERBAIK MATA PELAJARAN MATEMATIKA',
                      'TERBAIK MATA PELAJARAN IPAS',
                      'SISWA TELADAN & BERAKHLAK MULIA',
                      'KEHADIRAN DISIPLIN 100% (TERAJIN)'
                    ].map(p => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => handleUpdateCurrentStudentCustom({ kategoriPrestasi: p })}
                        className="px-2 py-0.5 rounded bg-slate-200/80 dark:bg-slate-700 text-[10px] font-semibold text-slate-700 dark:text-slate-300 hover:bg-amber-200 hover:text-amber-900 transition-colors"
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Nomor Surat Piagam:
                </label>
                <input
                  type="text"
                  value={currentNomor}
                  onChange={e => handleUpdateCurrentStudentCustom({ nomorPiagam: e.target.value })}
                  placeholder="Nomor Piagam Resmi..."
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-xs font-mono font-bold text-slate-900 dark:text-white"
                />

                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mt-2 mb-1">
                  Titimangsa Pengesahan (Tempat & Tanggal):
                </label>
                <input
                  type="text"
                  value={currentTanggal}
                  onChange={e => handleUpdateCurrentStudentCustom({ tanggalPiagam: e.target.value })}
                  placeholder="Contoh: Kota Banjarbaru, 20 Juni 2027"
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-900 dark:text-white"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Kalimat Apresiasi & Catatan Prestasi:
                </label>
                <textarea
                  rows={2}
                  value={currentCatatan}
                  onChange={e => handleUpdateCurrentStudentCustom({ catatanApresiasi: e.target.value })}
                  placeholder="Tuliskan catatan apresiasi atas prestasi yang diraih..."
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white resize-none"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 2. LEMBAR PREVIEW PIAGAM PENGHARGAAN (LANDSCAPE RESMI NAN MEWAH)          */}
      {/* ========================================================================= */}
      {selectedStudent && (
        <div className="flex justify-center overflow-x-auto pb-8 print:p-0">
          <PiagamCertificateCard
            student={selectedStudent}
            rank={activeStudentRank}
            score={activeStudentScore}
            theme={theme}
            themeStyles={themeStyles}
            paperSize={paperSize}
            nomorPiagam={currentNomor}
            kategoriPrestasi={currentKategori}
            catatanApresiasi={currentCatatan}
            tanggalPiagam={currentTanggal}
          />
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. MODAL CETAK MASSAL PIAGAM PENGHARGAAN                                  */}
      {/* ========================================================================= */}
      {isBatchModalOpen && (
        <ModalCetakMassalPiagam
          isOpen={isBatchModalOpen}
          onClose={() => setIsBatchModalOpen(false)}
          students={sortedStudentsByRank}
          rankingsMap={rankingsMap}
          scoresMap={studentScoresMap}
          paperSize={paperSize}
          theme={theme}
          onConfirmBatchPrint={handleStartBatchPrint}
        />
      )}

      {/* ========================================================================= */}
      {/* 4. WADAH RENDER CETAK MASSAL (HANYA MUNCUL SAAT PRINT MASSAL AKTIF)       */}
      {/* ========================================================================= */}
      {batchPrintStudents && batchPrintStudents.length > 0 && (
        <div className="hidden print:block piagam-batch-container">
          {batchPrintStudents.map((st) => {
            const r = rankingsMap.get(st.id) ?? 1;
            const sc = studentScoresMap.get(st.id) ?? { total: 0, avg: 0 };
            const cust = customDataMap[st.id] || {};
            
            const cleanSchool = (schoolInfo.schoolName || 'SD').replace(/[^a-zA-Z0-9]/g, '').slice(0, 6).toUpperCase();
            const rankStr = String(r).padStart(2, '0');
            const smtRomawi = schoolInfo.semester?.includes('1') ? 'XII' : 'VI';
            const year = schoolInfo.academicYear?.split('/')[0] || '2025';
            const nom = cust.nomorPiagam || `421.2/${rankStr}/${cleanSchool}/PP/${smtRomawi}/${year}`;
            
            const kat = cust.kategoriPrestasi || (
              r === 1 ? `JUARA I (PERTAMA) KELAS ${schoolInfo.className.toUpperCase()}` :
              r === 2 ? `JUARA II (KEDUA) KELAS ${schoolInfo.className.toUpperCase()}` :
              r === 3 ? `JUARA III (KETIGA) KELAS ${schoolInfo.className.toUpperCase()}` :
              r <= 10 ? `PERINGKAT ${r} (SEPULUH BESAR) KELAS ${schoolInfo.className.toUpperCase()}` :
              `PRESTASI AKADEMIK & KARAKTER TERPUJI KELAS ${schoolInfo.className.toUpperCase()}`
            );

            const cat = cust.catatanApresiasi || `Atas dedikasi, kedisiplinan, serta prestasi akademik yang sangat membanggakan dengan perolehan Rata-Rata Nilai ${sc.avg} (Total Skor: ${sc.total}) pada Semester ${schoolInfo.semester} Tahun Pelajaran ${schoolInfo.academicYear}.`;
            const tgl = cust.tanggalPiagam || defaultTanggalPiagam;

            return (
              <PiagamCertificateCard
                key={st.id}
                student={st}
                rank={r}
                score={sc}
                theme={theme}
                themeStyles={themeStyles}
                paperSize={paperSize}
                nomorPiagam={nom}
                kategoriPrestasi={kat}
                catatanApresiasi={cat}
                tanggalPiagam={tgl}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

// ===============================================================================
// KOMPONEN LEMBAR PIAGAM RESMI (LANDSCAPE DESIGN STANDAR NASIONAL)
// ===============================================================================

interface PiagamCertificateCardProps {
  student: Student;
  rank: number;
  score: { total: number; avg: number };
  theme: PiagamTheme;
  themeStyles: any;
  paperSize: PiagamPaperSize;
  nomorPiagam: string;
  kategoriPrestasi: string;
  catatanApresiasi: string;
  tanggalPiagam: string;
}

const PiagamCertificateCard: React.FC<PiagamCertificateCardProps> = ({
  student,
  rank,
  score,
  theme,
  themeStyles,
  paperSize,
  nomorPiagam,
  kategoriPrestasi,
  catatanApresiasi,
  tanggalPiagam
}) => {
  const { schoolInfo, currentUser } = useApp();

  const isF4 = paperSize === 'F4';
  const widthStyle = isF4 ? 'w-[1120px]' : 'w-[1040px]';
  const heightStyle = isF4 ? 'min-h-[730px]' : 'min-h-[700px]';

  // Wali Kelas data
  const waliKelasName = schoolInfo.homeroomTeacherName || schoolInfo.teacherName || currentUser.name || 'Wali Kelas';
  const waliKelasNip = schoolInfo.homeroomTeacherNip || schoolInfo.teacherNip || currentUser.nipOrNisn || '-';

  return (
    <div
      className={`piagam-single-card bg-white relative text-slate-900 ${widthStyle} ${heightStyle} p-6 sm:p-9 shadow-xl rounded-sm print:rounded-none overflow-hidden flex flex-col justify-between border-[6px] ${themeStyles.borderOuter}`}
      style={{
        boxSizing: 'border-box',
        backgroundColor: '#ffffff'
      }}
    >
      {/* Ornamen Bingkai Vektor Eksklusif Piagam */}
      <div className={`absolute inset-2 sm:inset-3 border-2 ${themeStyles.borderInner} pointer-events-none`} />
      <div className={`absolute inset-3 sm:inset-4 border border-dashed opacity-60 ${themeStyles.borderInner} pointer-events-none`} />

      {/* Sudut Ornamen Vektor (Corner Ornaments) */}
      <CornerOrnament position="top-left" color={themeStyles.primary} goldColor={themeStyles.gold} />
      <CornerOrnament position="top-right" color={themeStyles.primary} goldColor={themeStyles.gold} />
      <CornerOrnament position="bottom-left" color={themeStyles.primary} goldColor={themeStyles.gold} />
      <CornerOrnament position="bottom-right" color={themeStyles.primary} goldColor={themeStyles.gold} />

      {/* Watermark Logo Tut Wuri Handayani di Tengah Piagam (Transparan) */}
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.045] pointer-events-none select-none z-0">
        <SchoolLogoRenderer
          preset={schoolInfo.logoLeftPreset || 'tutwuri'}
          customUrl={schoolInfo.logoLeft}
          width={380}
          alt="Watermark Tut Wuri Handayani"
        />
      </div>

      {/* ========================================================================= */}
      {/* 1. KOP RESMI PIAGAM PENGHARGAAN (ATAS)                                    */}
      {/* ========================================================================= */}
      <div className="relative z-10 w-full flex items-center justify-between border-b-2 pb-3" style={{ borderColor: `${themeStyles.gold}80` }}>
        {/* Logo Kiri (Tut Wuri Handayani) */}
        <div className="w-20 flex justify-center">
          <SchoolLogoRenderer
            preset={schoolInfo.logoLeftPreset || 'tutwuri'}
            customUrl={schoolInfo.logoLeft}
            width={72}
            alt="Logo Kemendikbud"
          />
        </div>

        {/* Identitas Instansi & Sekolah */}
        <div className="flex-1 text-center px-4">
          <h4 className="text-[11px] sm:text-xs font-black tracking-widest uppercase text-slate-700">
            {schoolInfo.province ? `PEMERINTAH ${schoolInfo.province.toUpperCase()}` : 'PEMERINTAH DAERAH'}
          </h4>
          <h3 className="text-xs sm:text-sm font-black tracking-wider uppercase text-slate-800">
            {schoolInfo.city ? `DINAS PENDIDIKAN DAN KEBUDAYAAN ${schoolInfo.city.toUpperCase()}` : 'DINAS PENDIDIKAN'}
          </h3>
          <h2
            className="text-base sm:text-xl font-black tracking-wide uppercase mt-0.5"
            style={{ color: themeStyles.primary }}
          >
            {schoolInfo.schoolName || 'SEKOLAH DASAR'}
          </h2>
          <p className="text-[10px] text-slate-600 mt-0.5 max-w-xl mx-auto truncate font-medium">
            {schoolInfo.address} {schoolInfo.subdistrict ? `• Kec. ${schoolInfo.subdistrict}` : ''} {schoolInfo.city ? `• ${schoolInfo.city}` : ''} {schoolInfo.postalCode ? `Pos ${schoolInfo.postalCode}` : ''}
          </p>
        </div>

        {/* Logo Kanan (Logo Sekolah / Garuda) */}
        <div className="w-20 flex justify-center">
          <SchoolLogoRenderer
            preset={schoolInfo.logoRightPreset || 'kemdikbud'}
            customUrl={schoolInfo.logoRight}
            width={72}
            alt="Logo Sekolah"
          />
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. JUDUL PIAGAM PENGHARGAAN & NOMOR RESMI                                 */}
      {/* ========================================================================= */}
      <div className="relative z-10 text-center my-2 sm:my-3">
        <h1
          className="text-2xl sm:text-3xl font-serif font-black tracking-widest uppercase"
          style={{ color: themeStyles.titleColor }}
        >
          PIAGAM PENGHARGAAN
        </h1>
        <p className="text-[11px] font-serif italic text-slate-500 tracking-wider -mt-0.5">
          Certificate of Achievement & Excellence
        </p>

        {/* Garis Pembatas Ornamen */}
        <div className="flex items-center justify-center gap-2 mt-1">
          <div className="h-[2px] w-20 sm:w-32" style={{ backgroundColor: themeStyles.gold }} />
          <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
          <div className="h-[2px] w-20 sm:w-32" style={{ backgroundColor: themeStyles.gold }} />
        </div>

        <p className="text-[11px] font-mono font-bold text-slate-700 tracking-wide mt-1">
          NOMOR: {nomorPiagam}
        </p>
      </div>

      {/* ========================================================================= */}
      {/* 3. PERNYATAAN PENERIMA & PRESTASI SISWA (TENGAH)                          */}
      {/* ========================================================================= */}
      <div className="relative z-10 text-center space-y-2">
        <p className="text-xs sm:text-sm font-serif italic text-slate-700">
          Diberikan dengan penuh rasa bangga dan apresiasi setinggi-tingginya kepada:
        </p>

        {/* Nama Siswa Besar & Elegan */}
        <div className="my-1">
          <h2
            className="text-xl sm:text-2xl lg:text-3xl font-black tracking-wider uppercase font-serif"
            style={{ color: themeStyles.titleColor }}
          >
            {student.nama}
          </h2>
          <div className="flex items-center justify-center gap-4 text-xs font-bold text-slate-700 mt-1">
            <span>NIS: <strong className="font-mono">{student.nis || '-'}</strong></span>
            <span>•</span>
            <span>NISN: <strong className="font-mono">{student.nisn || '-'}</strong></span>
            <span>•</span>
            <span>Kelas: <strong>{schoolInfo.className} ({schoolInfo.phase})</strong></span>
          </div>
        </div>

        {/* Box Gelar Prestasi / Juara */}
        <div className="max-w-2xl mx-auto my-2">
          <div
            className="py-2.5 px-6 rounded-xl border-2 shadow-xs flex items-center justify-center gap-3"
            style={{
              borderColor: themeStyles.gold,
              backgroundColor: `${themeStyles.primary}08`
            }}
          >
            <Trophy className="h-5 w-5 text-amber-600 shrink-0" />
            <div className="text-center">
              <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500 block">
                Atas Prestasi Membanggakan Sebagai:
              </span>
              <span
                className="text-sm sm:text-base font-black uppercase tracking-wider block"
                style={{ color: themeStyles.primary }}
              >
                {kategoriPrestasi}
              </span>
            </div>
            <Medal className="h-5 w-5 text-amber-600 shrink-0" />
          </div>
        </div>

        {/* Catatan Apresiasi & Motivasi Belajar */}
        <p className="text-xs text-slate-700 max-w-2xl mx-auto leading-relaxed italic px-4 font-serif">
          "{catatanApresiasi}"
        </p>
        <p className="text-[10px] text-slate-500 max-w-2xl mx-auto">
          Semoga keberhasilan ini senantiasa menjadi inspirasi, pemacu semangat belajar tanpa henti, serta menjadi bekal luhur dalam menggapai cita-cita mulia di masa depan.
        </p>
      </div>

      {/* ========================================================================= */}
      {/* 4. PENGESAHAN & TANDA TANGAN (BAWAH)                                       */}
      {/* ========================================================================= */}
      <div className="relative z-10 w-full pt-3 mt-2 border-t" style={{ borderColor: `${themeStyles.gold}40` }}>
        <div className="flex items-end justify-between px-6 text-center text-xs">
          {/* Tanda Tangan Wali Kelas (Kiri) */}
          <div className="w-56">
            <p className="text-slate-700 font-medium">Mengetahui,</p>
            <p className="font-bold text-slate-900">Wali Kelas {schoolInfo.className}</p>

            {/* Ruang TTD */}
            <div className="h-16 flex items-center justify-center">
              <span className="text-[10px] text-slate-300 italic select-none">Tanda Tangan</span>
            </div>

            <p className="font-black text-slate-900 uppercase underline tracking-wide">
              {waliKelasName}
            </p>
            <p className="text-[11px] font-bold text-slate-700 mt-0.5">
              NIP. <span className="font-mono">{waliKelasNip}</span>
            </p>
          </div>

          {/* Lencana Stempel Emas Piagam di Tengah (Gold Ribbon Seal) */}
          <div className="flex flex-col items-center justify-center pb-1">
            <div
              className="w-18 h-18 rounded-full border-2 border-dashed flex flex-col items-center justify-center p-1 relative shadow-inner"
              style={{
                borderColor: themeStyles.gold,
                backgroundColor: `${themeStyles.gold}15`
              }}
            >
              <Award className="h-6 w-6 text-amber-600" />
              <span className="text-[8px] font-black uppercase tracking-wider text-amber-900 mt-0.5">
                TERBAIK
              </span>
              <span className="text-[7px] font-bold text-amber-700 font-mono">
                {schoolInfo.academicYear}
              </span>
            </div>
          </div>

          {/* Tanda Tangan Kepala Sekolah (Kanan) */}
          <div className="w-56">
            <p className="text-slate-800 font-semibold">{tanggalPiagam}</p>
            <p className="font-bold text-slate-900">Kepala Sekolah,</p>

            {/* Ruang TTD & Stempel */}
            <div className="h-16 flex items-center justify-center">
              <span className="text-[10px] text-slate-300 italic select-none">Tanda Tangan & Cap</span>
            </div>

            <p className="font-black text-slate-900 uppercase underline tracking-wide">
              {schoolInfo.headmasterName || 'Kepala Sekolah'}
            </p>
            <p className="text-[11px] font-bold text-slate-700 mt-0.5">
              NIP. <span className="font-mono">{schoolInfo.headmasterNip || '-'}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// ===============================================================================
// CORNER ORNAMENT VECTOR SVG
// ===============================================================================

const CornerOrnament: React.FC<{
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  color: string;
  goldColor: string;
}> = ({ position, color, goldColor }) => {
  const getTransforms = () => {
    switch (position) {
      case 'top-left':
        return 'top-2 left-2';
      case 'top-right':
        return 'top-2 right-2 scale-x-[-1]';
      case 'bottom-left':
        return 'bottom-2 left-2 scale-y-[-1]';
      case 'bottom-right':
        return 'bottom-2 right-2 scale-[-1]';
    }
  };

  return (
    <div className={`absolute ${getTransforms()} pointer-events-none select-none z-10 w-12 h-12`}>
      <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
        {/* Sudut luar tebal */}
        <path d="M2 24 L2 2 L24 2" stroke={color} strokeWidth="3" strokeLinecap="round" />
        {/* Sudut dalam aksen emas */}
        <path d="M6 20 L6 6 L20 6" stroke={goldColor} strokeWidth="1.5" strokeLinecap="round" />
        {/* Hiasan floral ornamen */}
        <circle cx="10" cy="10" r="2.5" fill={goldColor} />
        <path d="M12 12 Q 22 14, 28 8" stroke={goldColor} strokeWidth="1" strokeLinecap="round" />
        <path d="M12 12 Q 14 22, 8 28" stroke={goldColor} strokeWidth="1" strokeLinecap="round" />
      </svg>
    </div>
  );
};

// ===============================================================================
// MODAL CETAK MASSAL PIAGAM PENGHARGAAN
// ===============================================================================

interface ModalCetakMassalPiagamProps {
  isOpen: boolean;
  onClose: () => void;
  students: Student[];
  rankingsMap: Map<string, number>;
  scoresMap: Map<string, { total: number; avg: number }>;
  paperSize: PiagamPaperSize;
  theme: PiagamTheme;
  onConfirmBatchPrint: (selectedStudents: Student[]) => void;
}

const ModalCetakMassalPiagam: React.FC<ModalCetakMassalPiagamProps> = ({
  isOpen,
  onClose,
  students,
  rankingsMap,
  scoresMap,
  paperSize,
  theme,
  onConfirmBatchPrint
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>(
    students.slice(0, 3).map(s => s.id) // Default juara 1-3
  );

  if (!isOpen) return null;

  const handleSelectTop = (count: number) => {
    setSelectedIds(students.slice(0, count).map(s => s.id));
  };

  const handleSelectAll = () => {
    if (selectedIds.length === students.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(students.map(s => s.id));
    }
  };

  const handleToggle = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const selectedStudentsToPrint = students.filter(s => selectedIds.includes(s.id));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="relative w-full max-w-xl max-h-[90vh] flex flex-col rounded-2xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-150">
        {/* Header Modal */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300">
              <Printer className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                Cetak Massal Piagam Penghargaan
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Kertas: <strong>{paperSize} Landscape</strong> • Tema: <strong>{theme}</strong>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Quick Preset Buttons */}
          <div className="flex items-center justify-between gap-2 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Pilih Cepat:</span>
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                type="button"
                onClick={() => handleSelectTop(3)}
                className="px-2.5 py-1 rounded-lg bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-200 text-xs font-bold hover:bg-amber-200 transition-colors"
              >
                Juara 1 - 3 (Top 3)
              </button>
              <button
                type="button"
                onClick={() => handleSelectTop(5)}
                className="px-2.5 py-1 rounded-lg bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-200 text-xs font-bold hover:bg-amber-200 transition-colors"
              >
                Top 5
              </button>
              <button
                type="button"
                onClick={() => handleSelectTop(10)}
                className="px-2.5 py-1 rounded-lg bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-200 text-xs font-bold hover:bg-amber-200 transition-colors"
              >
                Top 10
              </button>
              <button
                type="button"
                onClick={handleSelectAll}
                className="px-2.5 py-1 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold hover:bg-slate-300 transition-colors"
              >
                {selectedIds.length === students.length ? 'Batal Semua' : 'Semua Siswa'}
              </button>
            </div>
          </div>

          {/* Student Checkboxes List */}
          <div className="border border-slate-200 dark:border-slate-700 rounded-xl divide-y divide-slate-100 dark:divide-slate-800 max-h-60 overflow-y-auto">
            {students.map((st) => {
              const isChecked = selectedIds.includes(st.id);
              const r = rankingsMap.get(st.id) ?? '-';
              const sc = scoresMap.get(st.id) ?? { total: 0, avg: 0 };
              return (
                <label
                  key={st.id}
                  className={`flex items-center justify-between p-2.5 cursor-pointer text-xs transition-colors ${
                    isChecked
                      ? 'bg-amber-50/70 dark:bg-amber-950/30'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleToggle(st.id)}
                      className="rounded text-amber-600 focus:ring-amber-500"
                    />
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {st.nama}
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 ml-2">
                        NISN: {st.nisn}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300">
                      Rata-rata: {sc.avg}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                      r === 1 ? 'bg-amber-200 text-amber-900' :
                      r === 2 ? 'bg-slate-200 text-slate-800' :
                      r === 3 ? 'bg-orange-200 text-orange-900' :
                      'bg-slate-100 dark:bg-slate-800 text-slate-600'
                    }`}>
                      Peringkat #{r}
                    </span>
                  </div>
                </label>
              );
            })}
          </div>

          <p className="text-xs text-slate-500">
            Terpilih: <strong className="text-amber-600">{selectedStudentsToPrint.length} dari {students.length}</strong> siswa. Setiap siswa akan dicetak pada 1 lembar piagam terpisah secara rapi.
          </p>
        </div>

        {/* Footer Modal */}
        <div className="flex items-center justify-end gap-3 border-t border-slate-200 dark:border-slate-800 px-6 py-4 bg-slate-50/50 dark:bg-slate-800/50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 transition-colors"
          >
            Batal
          </button>
          <button
            type="button"
            disabled={selectedStudentsToPrint.length === 0}
            onClick={() => onConfirmBatchPrint(selectedStudentsToPrint)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs shadow-md disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            <Printer className="h-4 w-4" />
            <span>Mulai Cetak ({selectedStudentsToPrint.length} Piagam)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
