import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Student, KenaikanStatus, isSemesterGenap, ReportType } from '../../types';
import { ModalEditRaporSiswa } from './ModalEditRaporSiswa';
import { RekapLegerRaporTab } from './RekapLegerRaporTab';
import { SampulBiodataTab } from './SampulBiodataTab';
import { StudentReportCardSheet, PrintSettings } from './StudentReportCardSheet';
import { ModalCetakMassalRapor } from './ModalCetakMassalRapor';
import { ModalTitimangsaRapor } from './ModalTitimangsaRapor';
import { KurikulumFaseSelectorModal } from '../common/KurikulumFaseSelectorModal';
import {
  FileSpreadsheet,
  Printer,
  ChevronLeft,
  ChevronRight,
  Edit3,
  Award,
  GraduationCap,
  Sparkles,
  TrendingUp,
  UserCheck,
  Calendar,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  Layers,
  Info,
  Settings,
  FileCheck,
  Copy,
  Maximize2,
  FileText,
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff
} from 'lucide-react';

export const RaportView: React.FC = () => {
  const {
    schoolInfo,
    updateSchoolInfo,
    students,
    subjects,
    getAllGradesForStudent,
    getAllMidSemesterGradesForStudent,
    getStudentAttendanceStats,
    extracurriculars,
    getStudentReport,
    updateStudentReport,
    calculateStudentRankings,
    calculateMidSemesterRankings
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'cover_biodata' | 'individual' | 'rekap_leger'>('individual');
  const [selectedStudentId, setSelectedStudentId] = useState<string>(students[0]?.id || '');
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isBatchModalOpen, setIsBatchModalOpen] = useState<boolean>(false);
  const [isPhaseModalOpen, setIsPhaseModalOpen] = useState<boolean>(false);
  const [isTitimangsaModalOpen, setIsTitimangsaModalOpen] = useState<boolean>(false);
  const [batchPrintStudents, setBatchPrintStudents] = useState<Student[] | null>(null);

  // Print settings
  const [printSettings, setPrintSettings] = useState<PrintSettings>({
    paperSize: 'A4',
    density: 'normal',
    pageBreakMode: 'standard_2page',
    showKop: true,
    showWatermark: false,
    showSignature: true,
    showRanking: true,
    reportType: 'semester',
    equalizeLogos: true,
    parentSignatureChoice: 'ayah',
    showMidDeskripsi: true
  });

  const isGenap = isSemesterGenap(schoolInfo.semester);
  const isMidSemester = printSettings.reportType === 'mid_semester';

  const currentStudentIndex = students.findIndex(s => s.id === selectedStudentId);
  const selectedStudent = students[currentStudentIndex] || students[0];

  // Global Ctrl+P handler to open print dialog smoothly
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        if (activeSubTab === 'individual') {
          e.preventDefault();
          handlePrintSingle();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeSubTab, selectedStudent]);

  // Navigation handlers
  const handlePrevStudent = () => {
    if (currentStudentIndex > 0) {
      setSelectedStudentId(students[currentStudentIndex - 1].id);
    }
  };

  const handleNextStudent = () => {
    if (currentStudentIndex < students.length - 1) {
      setSelectedStudentId(students[currentStudentIndex + 1].id);
    }
  };

  const handlePrintSingle = () => {
    setBatchPrintStudents(null);
    setTimeout(() => {
      window.print();
    }, 50);
  };

  const handleStartBatchPrint = (selectedStudents: Student[], settings: PrintSettings) => {
    setPrintSettings(settings);
    setBatchPrintStudents(selectedStudents);
    // Give state a tick to render all student sheets before invoking print
    setTimeout(() => {
      window.print();
    }, 150);
  };

  const handleToggleSemester = (newSemester: '1 (Ganjil)' | '2 (Genap)') => {
    updateSchoolInfo({ semester: newSemester });
  };

  const handleSetReportType = (type: ReportType) => {
    setPrintSettings(prev => ({ ...prev, reportType: type }));
  };

  if (!selectedStudent) {
    return (
      <div className="p-8 text-center text-slate-500">
        <FileSpreadsheet className="h-12 w-12 mx-auto text-slate-400 mb-3" />
        <p className="font-semibold">Belum ada data siswa untuk membuat rapor.</p>
      </div>
    );
  }

  // Data for current student report
  const reportData = getStudentReport(selectedStudent.id);
  const studentGrades = getAllGradesForStudent(selectedStudent.id);
  const totalScore = studentGrades.reduce((sum, g) => sum + g.nilaiAkhir, 0);
  const avgScore = studentGrades.length > 0 ? +(totalScore / studentGrades.length).toFixed(1) : 0;

  const studentMidGrades = getAllMidSemesterGradesForStudent(selectedStudent.id);
  const totalScoreMid = studentMidGrades.reduce((sum, g) => sum + g.nilaiAkhirMid, 0);
  const avgScoreMid = studentMidGrades.length > 0 ? +(totalScoreMid / studentMidGrades.length).toFixed(1) : 0;

  // Penentuan nama orang tua aktif untuk siswa yang sedang dipilih
  const currentParentChoice = (reportData.parentSignatureChoice && reportData.parentSignatureChoice !== 'auto')
    ? reportData.parentSignatureChoice
    : (printSettings.parentSignatureChoice || 'ayah');

  const currentParentName = (() => {
    if (currentParentChoice === 'dots') return '............................ (Manual)';
    if (currentParentChoice === 'custom' && reportData.parentCustomName?.trim()) {
      return reportData.parentCustomName.trim();
    }
    if (currentParentChoice === 'ibu') {
      return selectedStudent.namaIbu || selectedStudent.namaAyah || '(Belum Ada Data)';
    }
    return selectedStudent.namaAyah || selectedStudent.namaIbu || '(Belum Ada Data)';
  })();

  const handleQuickRankCalc = () => {
    if (isMidSemester) {
      const rankings = calculateMidSemesterRankings();
      const myRank = rankings.find(r => r.siswaId === selectedStudent.id);
      if (myRank) {
        updateStudentReport(selectedStudent.id, {
          rankingMid: myRank.rank,
          totalNilaiMid: totalScoreMid,
          rataRataNilaiMid: avgScoreMid
        });
      }
    } else {
      const rankings = calculateStudentRankings();
      const myRank = rankings.find(r => r.siswaId === selectedStudent.id);
      if (myRank) {
        updateStudentReport(selectedStudent.id, {
          ranking: myRank.rank,
          totalNilai: totalScore,
          rataRataNilai: avgScore
        });
      }
    }
  };

  const handleQuickStatusChange = (status: KenaikanStatus) => {
    const nextClass = reportData.targetKelas || 'V (Lima)';
    const ket =
      status === 'Naik Kelas'
        ? `Berdasarkan pencapaian seluruh tujuan pembelajaran pada Tahun Pelajaran ${schoolInfo.academicYear}, ananda ${selectedStudent.nama} dinyatakan: NAIK KE KELAS ${nextClass.toUpperCase()}`
        : status === 'Tinggal Kelas'
        ? `Berdasarkan evaluasi ketercapaian kompetensi pada Tahun Pelajaran ${schoolInfo.academicYear}, ananda ${selectedStudent.nama} dinyatakan: TINGGAL DI KELAS ${schoolInfo.className.toUpperCase()}`
        : status === 'Lulus'
        ? `Berdasarkan kriteria kelulusan akhir jenjang, ananda ${selectedStudent.nama} dinyatakan: LULUS DARI SATUAN PENDIDIKAN DASAR`
        : `Keputusan akhir semester ananda ${selectedStudent.nama}: ${status}`;

    updateStudentReport(selectedStudent.id, {
      statusKenaikan: status,
      keteranganKenaikan: ket
    });
  };

  return (
    <div className="space-y-6">
      {/* Tabs Navigation (Sampul & Biodata Siswa, Lembar Rapor Siswa, Rekap Leger & Ranking) */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 print:hidden">
        <button
          onClick={() => setActiveSubTab('cover_biodata')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === 'cover_biodata'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
          }`}
        >
          <UserCheck className="h-4 w-4" />
          <span>Sampul & Biodata Siswa</span>
        </button>

        <button
          onClick={() => setActiveSubTab('individual')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === 'individual'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
          }`}
        >
          <BookOpen className="h-4 w-4" />
          <span>{isMidSemester ? 'Lembar Rapor Mid Semester' : 'Lembar Rapor Siswa'}</span>
        </button>

        <button
          onClick={() => setActiveSubTab('rekap_leger')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === 'rekap_leger'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
          }`}
        >
          <Award className="h-4 w-4" />
          <span>Rekap Leger & Ranking Se-Kelas</span>
        </button>

        {/* Quick Phase & Titimangsa Global Synchronizer Triggers */}
        <div className="ml-auto flex items-center gap-2 flex-wrap">
          <button
            id="btn-open-titimangsa-header"
            type="button"
            onClick={() => setIsTitimangsaModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50/70 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 text-xs font-bold hover:bg-blue-100 dark:hover:bg-blue-900/60 transition-all shadow-xs active:scale-95 cursor-pointer"
            title="Atur penanggalan rapor yang berlaku serentak untuk seluruh siswa"
          >
            <Calendar className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
            <span className="hidden sm:inline">Titimangsa:</span>
            <span className="font-extrabold max-w-[130px] truncate">
              {isMidSemester
                ? (schoolInfo.tanggalRaporMid || 'Mid Smt')
                : (schoolInfo.tanggalRapor || 'Akhir Smt')}
            </span>
            <span className="px-1.5 py-0.2 rounded-full text-[9px] font-extrabold bg-blue-200/80 dark:bg-blue-800 text-blue-900 dark:text-blue-100">
              Semua
            </span>
          </button>

          <button
            type="button"
            onClick={() => setIsPhaseModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 text-xs font-bold hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-all shadow-xs active:scale-95"
            title="Ubah otomatis mata pelajaran, TP, dan nilai rapor sesuai Fase Kurikulum Merdeka Pembelajaran Mendalam (KMPM)"
          >
            <Sparkles className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>Fase: {schoolInfo.phase || 'Fase B (Kelas IV)'}</span>
          </button>
        </div>
      </div>

      {activeSubTab === 'cover_biodata' ? (
        <SampulBiodataTab
          initialStudentId={selectedStudentId}
          onSelectStudentId={id => setSelectedStudentId(id)}
        />
      ) : activeSubTab === 'rekap_leger' ? (
        <RekapLegerRaporTab
          onSelectStudentForReport={student => {
            setSelectedStudentId(student.id);
            setActiveSubTab('individual');
          }}
        />
      ) : (
        <>
          {/* Quick Editing & Student Selector Bar (Interactive, Non-Print) */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-xs space-y-4 print:hidden">
            {/* Header Mode Banner */}
            <div className={`p-3 rounded-xl flex items-center justify-between gap-3 ${
              isMidSemester
                ? 'bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800'
                : isGenap
                ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800'
                : 'bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800'
            }`}>
              <div className="flex items-center gap-2.5">
                <div className={`p-2 rounded-lg ${
                  isMidSemester 
                    ? 'bg-amber-600 text-white' 
                    : isGenap
                    ? 'bg-emerald-600 text-white'
                    : 'bg-blue-600 text-white'
                }`}>
                  {isMidSemester ? <FileText className="h-4 w-4" /> : isGenap ? <GraduationCap className="h-4 w-4" /> : <BookOpen className="h-4 w-4" />}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Mode Rapor Aktif
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      isGenap
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200'
                        : 'bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-200'
                    }`}>
                      {schoolInfo.semester}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    {isMidSemester
                      ? `Rapor Mid Semester (ASTS KMPM) • TP ${schoolInfo.academicYear}`
                      : isGenap
                      ? `Rapor Akhir Semester 2 KMPM (Genap & Kenaikan Kelas) • TP ${schoolInfo.academicYear}`
                      : `Rapor Akhir Semester 1 KMPM (Ganjil) • TP ${schoolInfo.academicYear}`}
                  </h4>
                </div>
              </div>

              {/* Action Buttons: Quick Semester Toggle & Report Type Pill */}
              <div className="flex items-center gap-2 flex-wrap">
                {/* Tombol Cepat Pindah Semester (Ke Smt 1 saat posisi Genap/2) */}
                {isGenap ? (
                  <button
                    type="button"
                    onClick={() => handleToggleSemester('1 (Ganjil)')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                    title="Beralih kembali ke Rapor Semester 1 (Ganjil)"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    <span>Ke Smt 1</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleToggleSemester('2 (Genap)')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                    title="Beralih ke format Rapor Semester 2 (Genap & Kenaikan Kelas)"
                  >
                    <span>Ke Smt 2</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                )}

                {/* Toggle Mode Pill */}
                <div className="flex items-center gap-1 bg-white/80 dark:bg-slate-800 p-0.5 rounded-xl border border-slate-200 dark:border-slate-700">
                  <button
                    type="button"
                    onClick={() => handleSetReportType('semester')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      !isMidSemester
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    Akhir Smt (SAS)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSetReportType('mid_semester')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      isMidSemester
                        ? 'bg-amber-600 text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    Mid Smt (ASTS)
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
              {/* Student Selector */}
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={handlePrevStudent}
                  disabled={currentStudentIndex === 0}
                  className="rounded-xl border border-slate-200 dark:border-slate-700 p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  title="Siswa Sebelumnya"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>

                <select
                  value={selectedStudentId}
                  onChange={e => setSelectedStudentId(e.target.value)}
                  className="rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2 text-xs font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {students.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.nomorAbsen}. {s.nama} ({s.nisn})
                    </option>
                  ))}
                </select>

                <button
                  onClick={handleNextStudent}
                  disabled={currentStudentIndex === students.length - 1}
                  className="rounded-xl border border-slate-200 dark:border-slate-700 p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  title="Siswa Berikutnya"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>

                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 ml-1">
                  Siswa ke-<strong>{currentStudentIndex + 1}</strong> dari <strong>{students.length}</strong>
                </span>
              </div>

              {/* Action Buttons & Quick Parent Signature Toggle */}
              <div className="flex items-center gap-2 flex-wrap">
                {/* Pilihan Cepat TTD Orang Tua untuk Siswa Terpilih */}
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100/90 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs">
                  <UserCheck className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                  <span className="text-slate-500 dark:text-slate-400 text-[11px] font-medium whitespace-nowrap">TTD Ortu:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 max-w-[130px] truncate" title={currentParentName}>
                    {currentParentName}
                  </span>
                  <div className="inline-flex rounded-lg p-0.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 ml-1">
                    <button
                      type="button"
                      onClick={() => {
                        updateStudentReport(selectedStudent.id, { parentSignatureChoice: 'ayah' });
                        setPrintSettings(prev => ({ ...prev, parentSignatureChoice: 'ayah' }));
                      }}
                      className={`px-2 py-0.5 rounded text-[10.5px] font-bold transition-all cursor-pointer ${
                        currentParentChoice === 'ayah'
                          ? 'bg-blue-600 text-white shadow-2xs'
                          : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                      }`}
                      title={`Pilih Nama Ayah: ${selectedStudent.namaAyah || '-'}`}
                    >
                      Ayah
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        updateStudentReport(selectedStudent.id, { parentSignatureChoice: 'ibu' });
                        setPrintSettings(prev => ({ ...prev, parentSignatureChoice: 'ibu' }));
                      }}
                      className={`px-2 py-0.5 rounded text-[10.5px] font-bold transition-all cursor-pointer ${
                        currentParentChoice === 'ibu'
                          ? 'bg-blue-600 text-white shadow-2xs'
                          : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                      }`}
                      title={`Pilih Nama Ibu: ${selectedStudent.namaIbu || '-'}`}
                    >
                      Ibu
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsBatchModalOpen(true)}
                  className="flex items-center gap-1.5 rounded-xl border border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-2 text-xs font-bold text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 active:scale-95 transition-all"
                >
                  <Layers className="h-4 w-4" />
                  <span>Cetak Massal Seluruh Kelas</span>
                </button>

                <button
                  id="btn-open-titimangsa-bar"
                  type="button"
                  onClick={() => setIsTitimangsaModalOpen(true)}
                  className="flex items-center gap-1.5 rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/40 px-3 py-2 text-xs font-bold text-blue-800 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50 active:scale-95 transition-all cursor-pointer"
                  title="Atur tempat dan tanggal pengesahan rapor serentak untuk seluruh siswa"
                >
                  <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <span>Titimangsa (Semua Siswa)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(true)}
                  className="flex items-center gap-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95 transition-all"
                >
                  <Edit3 className="h-4 w-4" />
                  <span>Edit Data Rapor</span>
                </button>
              </div>
            </div>

            {/* Quick Status Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
              {/* Ranking Widget */}
              <div className="p-3 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/70 dark:border-amber-800/40">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1">
                    <Award className="h-3.5 w-3.5" />
                    <span>{isMidSemester ? 'Ranking Mid Semester' : 'Ranking Kelas (SAS)'}</span>
                  </span>
                  <button
                    onClick={handleQuickRankCalc}
                    className="text-[10px] text-amber-700 dark:text-amber-400 font-bold hover:underline"
                    title="Hitung otomatis ranking siswa"
                  >
                    Otomatis
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    max={students.length}
                    value={(isMidSemester ? reportData.rankingMid ?? reportData.ranking : reportData.ranking) ?? ''}
                    onChange={e => {
                      const val = e.target.value ? parseInt(e.target.value) : undefined;
                      if (isMidSemester) {
                        updateStudentReport(selectedStudent.id, { rankingMid: val });
                      } else {
                        updateStudentReport(selectedStudent.id, { ranking: val });
                      }
                    }}
                    placeholder="Rank..."
                    className="w-20 px-2 py-1 rounded-lg border border-amber-300 dark:border-amber-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <span className="text-slate-500">dari {students.length}</span>
                  <label className="flex items-center gap-1 text-[11px] text-slate-600 dark:text-slate-300 cursor-pointer ml-auto">
                    <input
                      type="checkbox"
                      checked={reportData.showRanking !== false}
                      onChange={e => {
                        updateStudentReport(selectedStudent.id, {
                          showRanking: e.target.checked
                        });
                      }}
                      className="rounded text-amber-600"
                    />
                    <span>Cetak</span>
                  </label>
                </div>
              </div>

              {/* Conditional Kenaikan Kelas Controls or Mid Summary */}
              {isMidSemester ? (
                /* Mid Semester Stat Card */
                <div className="p-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/70 dark:border-emerald-800/40">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-emerald-900 dark:text-emerald-300 flex items-center gap-1">
                      <TrendingUp className="h-3.5 w-3.5" />
                      <span>Rata-Rata Nilai ASTS</span>
                    </span>
                    <span className="text-[10px] text-emerald-600 font-bold">Sumatif ASTS</span>
                  </div>
                  <div className="flex items-center justify-between pt-0.5">
                    <span className="text-slate-600 dark:text-slate-300 font-semibold">Total: <strong>{totalScoreMid}</strong></span>
                    <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/60 px-2 py-0.5 rounded-md">
                      Rata: {avgScoreMid}
                    </span>
                  </div>
                </div>
              ) : isGenap ? (
                <>
                  {/* Quick Status Kenaikan Select (Genap) */}
                  <div className="p-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/70 dark:border-emerald-800/40">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-emerald-900 dark:text-emerald-300 flex items-center gap-1">
                        <GraduationCap className="h-3.5 w-3.5" />
                        <span>Status Kenaikan</span>
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-emerald-700 dark:text-emerald-300 font-bold bg-emerald-100 dark:bg-emerald-900/60 px-1.5 py-0.5 rounded">
                          Smt 2
                        </span>
                        <button
                          type="button"
                          onClick={() => handleToggleSemester('1 (Ganjil)')}
                          className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-[10px] font-bold transition-all shadow-2xs cursor-pointer"
                          title="Beralih kembali ke Semester 1 (Ganjil)"
                        >
                          <ArrowLeft className="h-3 w-3" />
                          <span>Ke Smt 1</span>
                        </button>
                      </div>
                    </div>
                    <select
                      value={reportData.statusKenaikan || 'Naik Kelas'}
                      onChange={e => handleQuickStatusChange(e.target.value as KenaikanStatus)}
                      className="w-full px-2 py-1 rounded-lg border border-emerald-300 dark:border-emerald-700 bg-white dark:bg-slate-800 text-xs font-bold text-emerald-900 dark:text-emerald-200 outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="Naik Kelas">Naik Kelas</option>
                      <option value="Tinggal Kelas">Tinggal Kelas</option>
                      <option value="Lulus">Lulus</option>
                      <option value="Tidak Lulus">Tidak Lulus</option>
                      <option value="Belum Ditentukan">Belum Ditentukan</option>
                    </select>
                  </div>

                  {/* Quick Target Kelas Input (Genap) */}
                  <div className="p-3 rounded-xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200/70 dark:border-blue-800/40">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-blue-900 dark:text-blue-300 flex items-center gap-1">
                        <TrendingUp className="h-3.5 w-3.5" />
                        <span>Target Kelas</span>
                      </span>
                      <span className="text-[10px] text-blue-600 font-semibold">Smt 2 (Akhir Tahun)</span>
                    </div>
                    <input
                      type="text"
                      disabled={reportData.statusKenaikan !== 'Naik Kelas'}
                      value={reportData.targetKelas || 'V (Lima)'}
                      onChange={e => {
                        const next = e.target.value;
                        updateStudentReport(selectedStudent.id, {
                          targetKelas: next,
                          keteranganKenaikan:
                            reportData.statusKenaikan === 'Naik Kelas'
                              ? `Berdasarkan pencapaian seluruh tujuan pembelajaran pada Tahun Pelajaran ${schoolInfo.academicYear}, ananda ${selectedStudent.nama} dinyatakan: NAIK KE KELAS ${next.toUpperCase()}`
                              : reportData.keteranganKenaikan
                        });
                      }}
                      placeholder="Target Kelas..."
                      className="w-full px-2.5 py-1 rounded-lg border border-blue-300 dark:border-blue-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                    />
                  </div>
                </>
              ) : (
                /* Semester 1 (Ganjil) Notice Card - Replacing 2 columns */
                <div className="sm:col-span-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-dashed border-slate-300 dark:border-slate-700 flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 flex items-center justify-center shrink-0">
                    <Info className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-slate-800 dark:text-slate-200 text-xs">
                      Semester 1 (Ganjil) Aktif
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight mt-0.5">
                      Kolom keputusan kenaikan kelas otomatis disembunyikan di Semester 1 dan akan muncul di Semester 2 (Genap).
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggleSemester('2 (Genap)')}
                    className="flex items-center gap-1 shrink-0 px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-[11px] font-bold transition-all shadow-xs cursor-pointer"
                    title="Beralih ke format Rapor Semester 2 (Genap)"
                  >
                    <span>Ke Smt 2</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              )}

              {isMidSemester && (
                <div className="p-3 rounded-xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200/70 dark:border-blue-800/40">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-blue-900 dark:text-blue-300 flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>Periode Rapor Mid</span>
                    </span>
                    <span className="text-[10px] text-blue-600 font-bold">Aktif</span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1 font-medium">
                    Tahun Pelajaran <strong>{schoolInfo.academicYear}</strong> Semester <strong>{schoolInfo.semester}</strong>
                  </p>
                </div>
              )}

              {/* Edit Detail Button Card */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex flex-col justify-between">
                <span className="font-bold text-slate-700 dark:text-slate-300 text-[11px]">
                  Catatan Guru & Opsi Lengkap
                </span>
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(true)}
                  className="mt-1 flex items-center justify-center gap-1.5 w-full py-1 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-colors"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                  <span>Buka Form Edit Lengkap</span>
                </button>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* BILAH PERINTAH CETAK LANGSUNG (PRINT COMMAND TOOLBAR) DI ATAS LEMBAR RAPOR */}
          {/* ========================================================================= */}
          <div className="rounded-2xl border-2 border-blue-500/30 bg-gradient-to-r from-blue-50/80 via-indigo-50/50 to-white dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 p-4 shadow-sm space-y-3 print:hidden">
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
              {/* Info Siswa & Perintah Utama */}
              <div className="flex items-center gap-3">
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-md shrink-0 ${
                  isMidSemester ? 'bg-amber-600 shadow-amber-500/20' : 'bg-blue-600 shadow-blue-500/20'
                }`}>
                  <Printer className="h-6 w-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-black uppercase tracking-wider text-blue-900 dark:text-blue-300">
                      {isMidSemester ? 'Cetak Lembar Rapor Mid Semester (ASTS)' : 'Cetak Lembar Rapor Siswa (SAS)'}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      isMidSemester
                        ? 'bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-200'
                        : isGenap
                        ? 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200'
                        : 'bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-200'
                    }`}>
                      Hal #{currentStudentIndex + 1}
                    </span>
                    {isGenap && (
                      <button
                        type="button"
                        onClick={() => handleToggleSemester('1 (Ganjil)')}
                        className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-[10px] font-bold transition-all shadow-xs cursor-pointer"
                        title="Beralih kembali ke Rapor Semester 1 (Ganjil)"
                      >
                        <ArrowLeft className="h-2.5 w-2.5" />
                        <span>Ke Smt 1</span>
                      </button>
                    )}
                  </div>
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                    {selectedStudent.nama} <span className="text-xs font-normal text-slate-500 font-mono">({selectedStudent.nisn})</span>
                  </h3>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 flex-wrap">
                {/* Tombol Cetak Satu Siswa */}
                <button
                  type="button"
                  onClick={handlePrintSingle}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl active:scale-95 text-white font-extrabold text-xs shadow-md transition-all ${
                    isMidSemester
                      ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-500/25'
                      : 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/25'
                  }`}
                  title="Cetak atau Simpan PDF Lembar Rapor Siswa Ini"
                >
                  <Printer className="h-4 w-4" />
                  <span>{isMidSemester ? 'Cetak Rapor Mid Siswa Ini' : 'Cetak Rapor Siswa Ini'}</span>
                  <span className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-black/20 text-[10px] font-mono">
                    Ctrl + P
                  </span>
                </button>

                {/* Tombol Cetak Massal Seluruh Siswa */}
                <button
                  type="button"
                  onClick={() => setIsBatchModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-extrabold text-xs shadow-md shadow-emerald-500/20 transition-all"
                  title="Cetak Semua Siswa Kelas Sekaligus"
                >
                  <Layers className="h-4 w-4" />
                  <span>Cetak Semua ({students.length} Siswa)</span>
                </button>
              </div>
            </div>

            {/* Quick Print Formatting Preferences Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2.5 border-t border-blue-200/60 dark:border-slate-800 text-xs">
              <div className="flex items-center gap-4 flex-wrap">
                <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Settings className="h-3.5 w-3.5 text-blue-600" />
                  <span>Format Cetakan:</span>
                </span>

                {/* Jenis Rapor Selector */}
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-500 text-[11px]">Jenis:</span>
                  <select
                    value={printSettings.reportType || 'semester'}
                    onChange={e => handleSetReportType(e.target.value as ReportType)}
                    className="px-2 py-0.5 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 outline-none"
                  >
                    <option value="semester">Rapor Akhir Semester (SAS)</option>
                    <option value="mid_semester">Rapor Mid Semester (ASTS)</option>
                  </select>
                </div>

                {/* Paper Size Selector */}
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-500 text-[11px]">Kertas:</span>
                  <select
                    value={printSettings.paperSize}
                    onChange={e => setPrintSettings({ ...printSettings, paperSize: e.target.value as any })}
                    className="px-2 py-0.5 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 outline-none"
                  >
                    <option value="A4">A4 (21 x 29.7 cm)</option>
                    <option value="F4">F4 / Folio (21.5 x 33 cm)</option>
                  </select>
                </div>

                {/* Density Selector */}
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-500 text-[11px]">Kerapatan:</span>
                  <select
                    value={printSettings.density}
                    onChange={e => setPrintSettings({ ...printSettings, density: e.target.value as any })}
                    className="px-2 py-0.5 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 outline-none"
                  >
                    <option value="normal">Normal</option>
                    <option value="compact">Padat / Ramping</option>
                    <option value="spacious">Longgar</option>
                  </select>
                </div>

                {/* Toggle Kop */}
                <label className="flex items-center gap-1.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={printSettings.showKop}
                    onChange={e => setPrintSettings({ ...printSettings, showKop: e.target.checked })}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-slate-700 dark:text-slate-300 text-[11.5px]">
                    Kop Surat
                  </span>
                </label>

                {/* Toggle Logo Kanan-Kiri Sama */}
                {printSettings.showKop && (
                  <label className="flex items-center gap-1.5 cursor-pointer select-none" title="Pastikan ukuran gambar logo kanan dan kiri seragam & simetris saat dicetak">
                    <input
                      type="checkbox"
                      checked={printSettings.equalizeLogos !== false}
                      onChange={e => setPrintSettings({ ...printSettings, equalizeLogos: e.target.checked })}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-blue-700 dark:text-blue-300 font-semibold text-[11.5px]">
                      Logo Kanan Kiri Sama
                    </span>
                  </label>
                )}

                {/* Toggle Tanda Tangan */}
                <label className="flex items-center gap-1.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={printSettings.showSignature}
                    onChange={e => setPrintSettings({ ...printSettings, showSignature: e.target.checked })}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-slate-700 dark:text-slate-300 text-[11.5px]">
                    Tanda Tangan
                  </span>
                </label>

                {/* Pilihan Nama Orang Tua pada Tanda Tangan */}
                {printSettings.showSignature && (
                  <div className="flex items-center gap-1.5 pl-1.5 border-l border-slate-300 dark:border-slate-700">
                    <span className="text-slate-500 dark:text-slate-400 text-[11px] font-semibold whitespace-nowrap flex items-center gap-1">
                      <UserCheck className="h-3 w-3 text-blue-600" />
                      <span>Nama TTD Ortu:</span>
                    </span>
                    <div className="inline-flex rounded-lg p-0.5 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs">
                      <button
                        type="button"
                        onClick={() => setPrintSettings({ ...printSettings, parentSignatureChoice: 'ayah' })}
                        className={`px-2.5 py-0.5 rounded text-xs font-bold transition-all cursor-pointer ${
                          (printSettings.parentSignatureChoice || 'ayah') === 'ayah'
                            ? 'bg-blue-600 text-white shadow-2xs'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                        }`}
                        title="Tampilkan nama Ayah di tanda tangan seluruh lembar cetak rapor"
                      >
                        Ayah
                      </button>
                      <button
                        type="button"
                        onClick={() => setPrintSettings({ ...printSettings, parentSignatureChoice: 'ibu' })}
                        className={`px-2.5 py-0.5 rounded text-xs font-bold transition-all cursor-pointer ${
                          printSettings.parentSignatureChoice === 'ibu'
                            ? 'bg-blue-600 text-white shadow-2xs'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                        }`}
                        title="Tampilkan nama Ibu di tanda tangan seluruh lembar cetak rapor"
                      >
                        Ibu
                      </button>
                      <button
                        type="button"
                        onClick={() => setPrintSettings({ ...printSettings, parentSignatureChoice: 'dots' })}
                        className={`px-2.5 py-0.5 rounded text-xs font-bold transition-all cursor-pointer ${
                          printSettings.parentSignatureChoice === 'dots'
                            ? 'bg-blue-600 text-white shadow-2xs'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                        }`}
                        title="Format titik-titik kosong untuk tanda tangan manual"
                      >
                        Titik-titik
                      </button>
                    </div>
                  </div>
                )}

                {/* Toggle Deskripsi Capaian Pembelajaran Mendalam (Khusus Rapor Mid Semester) */}
                {isMidSemester && (
                  <label
                    className={`flex items-center gap-1.5 cursor-pointer select-none px-2.5 py-1 rounded-lg border transition-all text-xs font-bold ${
                      printSettings.showMidDeskripsi !== false
                        ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-200'
                        : 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                    title="Centang untuk menampilkan kolom deskripsi capaian pembelajaran mendalam, atau hilangkan centang untuk mencetak rapor mid ringkas (hanya nilai ASTS)"
                  >
                    <input
                      type="checkbox"
                      checked={printSettings.showMidDeskripsi !== false}
                      onChange={e => setPrintSettings({ ...printSettings, showMidDeskripsi: e.target.checked })}
                      className="rounded text-amber-600 focus:ring-amber-500"
                    />
                    <span className="flex items-center gap-1 text-[11.5px]">
                      {printSettings.showMidDeskripsi !== false ? (
                        <Eye className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                      ) : (
                        <EyeOff className="h-3.5 w-3.5 text-slate-500" />
                      )}
                      <span>Deskripsi Capaian</span>
                    </span>
                  </label>
                )}
              </div>

              {/* Quick Navigation in Print Toolbar */}
              <div className="flex items-center gap-1.5 ml-auto">
                <button
                  type="button"
                  onClick={handlePrevStudent}
                  disabled={currentStudentIndex === 0}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                  <span>Sebelumnya</span>
                </button>
                <button
                  type="button"
                  onClick={handleNextStudent}
                  disabled={currentStudentIndex === students.length - 1}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <span>Selanjutnya</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* OFFICIAL PRINTABLE REPORT CARD SHEET CONTAINER                            */}
          {/* ========================================================================= */}
          <div
            id="printable-official-document"
            className="mx-auto max-w-4xl rounded-2xl bg-white p-6 sm:p-10 text-black shadow-xl border border-slate-200 print:max-w-none print:border-none print:shadow-none print:p-0 print:m-0"
          >
            {/* If Batch printing is active, render sheets for all selected students */}
            {batchPrintStudents && batchPrintStudents.length > 0 ? (
              batchPrintStudents.map((s, idx) => (
                <StudentReportCardSheet
                  key={s.id}
                  student={s}
                  printSettings={printSettings}
                  isPageBreakAfter={idx < batchPrintStudents.length - 1}
                  onToggleShowMidDeskripsi={val => setPrintSettings(prev => ({ ...prev, showMidDeskripsi: val }))}
                />
              ))
            ) : (
              /* Otherwise render current selected student */
              <StudentReportCardSheet
                student={selectedStudent}
                printSettings={printSettings}
                onToggleShowMidDeskripsi={val => setPrintSettings(prev => ({ ...prev, showMidDeskripsi: val }))}
              />
            )}
          </div>

          {/* ========================================================================= */}
          {/* FOOTER PERINTAH CETAK (PRINT COMMAND BAR DI BAWAH LEMBAR RAPOR)           */}
          {/* ========================================================================= */}
          <div className="mx-auto max-w-4xl rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3 print:hidden">
            <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
              <FileCheck className="h-4 w-4 text-emerald-600" />
              <span>Selesai memeriksa rapor {isMidSemester ? 'Mid Semester' : 'Akhir Semester'} <strong>{selectedStudent.nama}</strong>?</span>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={handlePrintSingle}
                className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl active:scale-95 text-white font-extrabold text-xs shadow-sm transition-all ${
                  isMidSemester ? 'bg-amber-600 hover:bg-amber-700' : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                <Printer className="h-4 w-4" />
                <span>{isMidSemester ? 'Cetak Rapor Mid Ini' : 'Cetak Rapor Ini'}</span>
              </button>

              <button
                type="button"
                onClick={() => setIsBatchModalOpen(true)}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-extrabold text-xs shadow-sm transition-all"
              >
                <Layers className="h-4 w-4" />
                <span>Cetak Semua</span>
              </button>

              {currentStudentIndex < students.length - 1 && (
                <button
                  type="button"
                  onClick={handleNextStudent}
                  className="flex items-center justify-center gap-1 px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                  <span>Siswa Berikutnya</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* FLOATING QUICK PRINT BUTTON (FIXED ON BOTTOM RIGHT VIEWPORT) */}
          <div className="fixed bottom-6 right-6 z-40 print:hidden flex items-center gap-2 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <button
              type="button"
              onClick={handlePrintSingle}
              className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-extrabold text-xs shadow-xl shadow-blue-500/30 border border-blue-400/40 transition-all hover:pr-5 group"
              title="Cetak Lembar Rapor Siswa Ini Langsung (Ctrl + P)"
            >
              <Printer className="h-4 w-4 group-hover:scale-110 transition-transform" />
              <span>Cetak Rapor</span>
            </button>
          </div>
        </>
      )}

      {/* Modal Edit Detail Rapor */}
      {isEditModalOpen && selectedStudent && (
        <ModalEditRaporSiswa
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          student={selectedStudent}
          onSelectStudentId={id => setSelectedStudentId(id)}
        />
      )}

      {/* Modal Cetak Massal Rapor Seluruh Kelas */}
      {isBatchModalOpen && (
        <ModalCetakMassalRapor
          isOpen={isBatchModalOpen}
          onClose={() => setIsBatchModalOpen(false)}
          onStartBatchPrint={handleStartBatchPrint}
          defaultSettings={printSettings}
        />
      )}

      {/* Modal Titimangsa / Penanggalan Rapor Semua Siswa */}
      <ModalTitimangsaRapor
        isOpen={isTitimangsaModalOpen}
        onClose={() => setIsTitimangsaModalOpen(false)}
      />

      {/* Modal Sinkronisasi Fase Kurikulum Merdeka */}
      <KurikulumFaseSelectorModal
        isOpen={isPhaseModalOpen}
        onClose={() => setIsPhaseModalOpen(false)}
      />
    </div>
  );
};
