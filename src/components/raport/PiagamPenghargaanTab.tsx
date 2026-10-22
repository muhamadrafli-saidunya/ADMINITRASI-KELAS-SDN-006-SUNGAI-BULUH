import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Student } from '../../types';
import { SchoolLogoRenderer } from '../common/SchoolLogoRenderer';
import { HeaderKopSekolah } from '../common/HeaderKopSekolah';
import {
  PiagamBorderStyle,
  PiagamColorTheme,
  PiagamSealType,
  FRAME_STYLE_OPTIONS,
  COLOR_THEME_OPTIONS,
  getColorTheme,
  PiagamFrameDecorator,
  PiagamSealDecorator
} from './PiagamFrameDecorations';
import {
  Trophy,
  Medal,
  Star,
  Printer,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  FileText,
  Crown,
  Edit3,
  RotateCcw,
  Check,
  Palette,
  ShieldCheck,
  Layers
} from 'lucide-react';

export type { PiagamBorderStyle, PiagamColorTheme, PiagamSealType };
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

  // Rankings map from Leger
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

  // Selected Student
  const [selectedStudentId, setSelectedStudentId] = useState<string>(
    initialStudentId || sortedStudentsByRank[0]?.id || students[0]?.id || ''
  );

  // Frame & Appearance State
  const [borderStyle, setBorderStyle] = useState<PiagamBorderStyle>('royal_baroque');
  const [colorTheme, setColorTheme] = useState<PiagamColorTheme>('gold');
  const [sealType, setSealType] = useState<PiagamSealType>('ribbon_medal');
  const [paperSize, setPaperSize] = useState<PiagamPaperSize>('A4');
  const [filterMode, setFilterMode] = useState<'all' | 'top3' | 'top5' | 'top10'>('top3');
  const [frameCategoryFilter, setFrameCategoryFilter] = useState<string>('all');
  const [showWatermark, setShowWatermark] = useState<boolean>(true);

  // Batch Print & Custom Data State
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);
  const [batchPrintStudents, setBatchPrintStudents] = useState<Student[] | null>(null);
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

  // Default tanggal piagam (disamakan persis dengan tanggal rapor siswa)
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

  // Student Navigations
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

  // Filtered students for dropdown
  const displayedStudents = useMemo(() => {
    if (filterMode === 'top3') return sortedStudentsByRank.slice(0, 3);
    if (filterMode === 'top5') return sortedStudentsByRank.slice(0, 5);
    if (filterMode === 'top10') return sortedStudentsByRank.slice(0, 10);
    return sortedStudentsByRank;
  }, [sortedStudentsByRank, filterMode]);

  // Filtered Frame Options
  const displayedFrameOptions = useMemo(() => {
    if (frameCategoryFilter === 'all') return FRAME_STYLE_OPTIONS;
    return FRAME_STYLE_OPTIONS.filter(f => f.category === frameCategoryFilter);
  }, [frameCategoryFilter]);

  // Active Theme Config
  const activeThemeConfig = useMemo(() => getColorTheme(colorTheme), [colorTheme]);

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

  const isF4 = paperSize === 'F4';

  return (
    <div className="space-y-6">
      {/* Dynamic Print CSS for Piagam (Landscape Orientation) */}
      <style>{`
        @media print {
          @page {
            size: ${isF4 ? '330mm 215mm' : '297mm 210mm'} landscape !important;
            margin: 5mm !important;
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
            height: ${isF4 ? '205mm' : '200mm'} !important;
            max-height: ${isF4 ? '205mm' : '200mm'} !important;
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
                Pilih dari 9 koleksi bingkai mewah, 6 tema warna, dan 4 model lencana resmi untuk mencetak piagam penghargaan berstandar nasional.
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

        {/* ========================================================================= */}
        {/* PANEL PILIHAN BINGKAI PIAGAM MENARIK (9 MODEL BINGKAI EKSKLUSIF)          */}
        {/* ========================================================================= */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-600" />
              <span className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">
                Pilihan Model Bingkai Piagam ({FRAME_STYLE_OPTIONS.length} Desain Menarik):
              </span>
            </div>

            {/* Filter Kategori Bingkai */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
              {['all', 'Klasik & Kerajaan', 'Tradisi Nusantara', 'Resmi & Kedinasan', 'Modern & Prestisius'].map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setFrameCategoryFilter(cat)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-colors ${
                    frameCategoryFilter === cat
                      ? 'bg-amber-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                  }`}
                >
                  {cat === 'all' ? 'Semua Model' : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Grid 9 Model Bingkai Eksklusif */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {displayedFrameOptions.map(frame => {
              const isSelected = borderStyle === frame.id;
              return (
                <button
                  key={frame.id}
                  type="button"
                  onClick={() => {
                    setBorderStyle(frame.id);
                    // Optionally suggest matching color theme
                    if (frame.recommendedColor) {
                      setColorTheme(frame.recommendedColor);
                    }
                  }}
                  className={`p-3 rounded-xl border text-left transition-all relative overflow-hidden flex flex-col justify-between ${
                    isSelected
                      ? 'border-amber-600 bg-amber-50/80 dark:bg-amber-950/40 shadow-sm ring-2 ring-amber-500/40'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 hover:border-amber-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/60 px-2 py-0.5 rounded-md">
                      {frame.category}
                    </span>
                    {isSelected && (
                      <span className="flex items-center gap-1 text-[11px] font-black text-amber-700 dark:text-amber-300">
                        <Check className="h-4 w-4 text-amber-600" />
                        Aktif
                      </span>
                    )}
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-900 dark:text-white leading-tight">
                      {frame.name}
                    </h4>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {frame.tagline}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Baris Pilihan: Warna Tema, Model Lencana Stempel, Ukuran Kertas & Watermark */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs">
            {/* Pilihan Warna & Aksen */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300 flex items-center gap-1">
                <Palette className="h-3.5 w-3.5 text-amber-600" />
                Warna & Aksen:
              </span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {COLOR_THEME_OPTIONS.map(c => {
                  const isSelected = colorTheme === c.id;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setColorTheme(c.id)}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition-all ${
                        isSelected
                          ? 'border-amber-600 bg-white dark:bg-slate-800 shadow-xs ring-1 ring-amber-500 font-bold text-slate-900 dark:text-white'
                          : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-400'
                      }`}
                      title={c.name}
                    >
                      <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: c.primary }} />
                      <span className="text-[11px]">{c.name.split('(')[0].trim()}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Pilihan Model Lencana Stempel Bawah */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300 flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5 text-amber-600" />
                Model Lencana / Seal:
              </span>
              <select
                value={sealType}
                onChange={e => setSealType(e.target.value as PiagamSealType)}
                className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-[11px] font-bold text-slate-900 dark:text-white outline-none"
              >
                <option value="ribbon_medal">🥇 Medali Emas Pita Menjuntai</option>
                <option value="wax_seal">★ Stempel Emboss Emas Klasik</option>
                <option value="star_excellence">⭐ Bintang Kehormatan 3D</option>
                <option value="tutwuri_crest">📖 Lambang Tut Wuri Kemendikbud</option>
                <option value="none">Tanpa Lencana Stempel</option>
              </select>
            </div>

            {/* Ukuran Kertas Selector & Watermark Toggle */}
            <div className="flex items-center gap-3 flex-wrap">
              {/* Paper Size selector (A4 vs F4) */}
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300 px-1.5 flex items-center gap-1">
                  <FileText className="h-3 w-3 text-amber-600" />
                  Kertas:
                </span>
                <button
                  type="button"
                  onClick={() => setPaperSize('A4')}
                  className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all ${
                    paperSize === 'A4'
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'text-slate-700 dark:text-slate-300 hover:text-amber-600'
                  }`}
                  title="A4 Landscape: 29.7 x 21.0 cm"
                >
                  A4
                </button>
                <button
                  type="button"
                  onClick={() => setPaperSize('F4')}
                  className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all ${
                    paperSize === 'F4'
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'text-slate-700 dark:text-slate-300 hover:text-amber-600'
                  }`}
                  title="F4 / Folio Landscape: 33.0 x 21.5 cm"
                >
                  F4 (Folio)
                </button>
              </div>

              {/* Watermark Toggle */}
              <label className="flex items-center gap-1.5 cursor-pointer text-[11px] text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={showWatermark}
                  onChange={e => setShowWatermark(e.target.checked)}
                  className="rounded text-amber-600 focus:ring-amber-500"
                />
                <span>Watermark Lambang</span>
              </label>
            </div>
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
                <Layers className="h-3.5 w-3.5 text-amber-600" />
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
            borderStyle={borderStyle}
            colorTheme={colorTheme}
            themeConfig={activeThemeConfig}
            sealType={sealType}
            paperSize={paperSize}
            showWatermark={showWatermark}
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
          borderStyle={borderStyle}
          colorTheme={colorTheme}
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
                borderStyle={borderStyle}
                colorTheme={colorTheme}
                themeConfig={activeThemeConfig}
                sealType={sealType}
                paperSize={paperSize}
                showWatermark={showWatermark}
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
  borderStyle: PiagamBorderStyle;
  colorTheme: PiagamColorTheme;
  themeConfig: any;
  sealType: PiagamSealType;
  paperSize: PiagamPaperSize;
  showWatermark: boolean;
  nomorPiagam: string;
  kategoriPrestasi: string;
  catatanApresiasi: string;
  tanggalPiagam: string;
}

const PiagamCertificateCard: React.FC<PiagamCertificateCardProps> = ({
  student,
  rank,
  score,
  borderStyle,
  colorTheme,
  themeConfig,
  sealType,
  paperSize,
  showWatermark,
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
      className={`piagam-single-card bg-white relative text-slate-900 ${widthStyle} ${heightStyle} p-6 sm:p-9 shadow-xl rounded-sm print:rounded-none overflow-hidden flex flex-col justify-between border-[6px] ${themeConfig.borderOuter}`}
      style={{
        boxSizing: 'border-box',
        backgroundColor: '#ffffff'
      }}
    >
      {/* Dekorasi Bingkai Vektor Eksklusif Sesuai Model Terpilih */}
      <PiagamFrameDecorator style={borderStyle} colorTheme={colorTheme} />

      {/* Watermark Logo Tut Wuri Handayani di Tengah Piagam (Transparan) */}
      {showWatermark && (
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.045] pointer-events-none select-none z-0">
          <SchoolLogoRenderer
            preset={schoolInfo.logoLeftPreset || 'tutwuri'}
            customUrl={schoolInfo.logoLeft}
            width={380}
            alt="Watermark Tut Wuri Handayani"
          />
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. KOP RESMI PIAGAM PENGHARGAAN (SESUAI LEMBAR RAPOR SISWA)               */}
      {/* ========================================================================= */}
      <HeaderKopSekolah
        equalizeLogos={true}
        logoSize={64}
        borderColor={themeConfig.gold}
        schoolNameColor={themeConfig.primary}
        className="relative z-10 w-full mb-2 sm:mb-2.5 print:mb-2 pb-2 print:pb-1"
      />

      {/* ========================================================================= */}
      {/* 2. JUDUL PIAGAM PENGHARGAAN & NOMOR RESMI                                 */}
      {/* ========================================================================= */}
      <div className="relative z-10 text-center my-2 sm:my-3">
        <h1
          className="text-2xl sm:text-3xl font-serif font-black tracking-widest uppercase"
          style={{ color: themeConfig.titleColor }}
        >
          PIAGAM PENGHARGAAN
        </h1>
        <p className="text-[11px] font-serif italic text-slate-500 tracking-wider -mt-0.5">
          Certificate of Achievement & Excellence
        </p>

        {/* Garis Pembatas Ornamen */}
        <div className="flex items-center justify-center gap-2 mt-1">
          <div className="h-[2px] w-20 sm:w-32" style={{ backgroundColor: themeConfig.gold }} />
          <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
          <div className="h-[2px] w-20 sm:w-32" style={{ backgroundColor: themeConfig.gold }} />
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
            style={{ color: themeConfig.titleColor }}
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
              borderColor: themeConfig.gold,
              backgroundColor: `${themeConfig.primary}08`
            }}
          >
            <Trophy className="h-5 w-5 text-amber-600 shrink-0" />
            <div className="text-center">
              <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500 block">
                Atas Prestasi Membanggakan Sebagai:
              </span>
              <span
                className="text-sm sm:text-base font-black uppercase tracking-wider block"
                style={{ color: themeConfig.primary }}
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
      <div className="relative z-10 w-full pt-3 mt-2 border-t" style={{ borderColor: `${themeConfig.gold}40` }}>
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

          {/* Lencana Stempel Piagam di Tengah (Dynamic Seal Decorator) */}
          <PiagamSealDecorator
            sealType={sealType}
            theme={themeConfig}
            academicYear={schoolInfo.academicYear}
          />

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
// MODAL CETAK MASSAL PIAGAM PENGHARGAAN
// ===============================================================================

interface ModalCetakMassalPiagamProps {
  isOpen: boolean;
  onClose: () => void;
  students: Student[];
  rankingsMap: Map<string, number>;
  scoresMap: Map<string, { total: number; avg: number }>;
  paperSize: PiagamPaperSize;
  borderStyle: PiagamBorderStyle;
  colorTheme: PiagamColorTheme;
  onConfirmBatchPrint: (selectedStudents: Student[]) => void;
}

const ModalCetakMassalPiagam: React.FC<ModalCetakMassalPiagamProps> = ({
  isOpen,
  onClose,
  students,
  rankingsMap,
  scoresMap,
  paperSize,
  borderStyle,
  colorTheme,
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
                Kertas: <strong>{paperSize} Landscape</strong> • Bingkai: <strong>{borderStyle}</strong> • Warna: <strong>{colorTheme}</strong>
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
