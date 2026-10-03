import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Student, KenaikanStatus, isSemesterGenap, Subject } from '../../types';
import { isAgamaSubject, getReligionSubjectName } from '../../utils/agamaHelper';
import {
  Award,
  GraduationCap,
  TrendingUp,
  Printer,
  Search,
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet,
  Edit3,
  Filter,
  Save,
  RotateCcw,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Info,
  Download,
  Trophy,
  Medal,
  Flame,
  User,
  Star,
  BookOpen,
  ArrowUpDown,
  Check,
  X,
  Eye,
  BarChart3,
  Layers,
  ArrowUpRight,
  SlidersHorizontal
} from 'lucide-react';
import { ModalEditRaporSiswa } from './ModalEditRaporSiswa';
import { ModalDetailNilaiSiswa } from './ModalDetailNilaiSiswa';
import { ModalCetakLeger } from './ModalCetakLeger';

interface RekapLegerRaporTabProps {
  onSelectStudentForReport: (student: Student) => void;
  initialPeriod?: 'semester' | 'mid_semester';
}

type LegerSubView = 'matrix' | 'leaderboard' | 'kenaikan';
type SortOption = 'rank' | 'absen' | 'nama' | 'total' | 'avg' | string; // string for subject ID

export const RekapLegerRaporTab: React.FC<RekapLegerRaporTabProps> = ({
  onSelectStudentForReport,
  initialPeriod = 'semester'
}) => {
  const {
    schoolInfo,
    students,
    subjects,
    grades,
    getStudentReport,
    updateStudentReport,
    bulkAutoCalculateRankings,
    bulkAutoCalculateMidRankings,
    bulkSetKenaikanKelas,
    getAllGradesForStudent,
    getAllMidSemesterGradesForStudent,
    getStudentAttendanceStats,
    getEffectiveStudentAttendance
  } = useApp();

  const isGenap = isSemesterGenap(schoolInfo.semester);

  // Periode Leger: Akhir Semester atau Mid Semester (ASTS)
  const [activePeriod, setActivePeriod] = useState<'semester' | 'mid_semester'>(initialPeriod);
  const [printLegerPeriod, setPrintLegerPeriod] = useState<'semester' | 'mid_semester'>(initialPeriod);

  const isMid = activePeriod === 'mid_semester';

  // Tempat dan tanggal rapor aktif disamakan persis dengan rapor
  const firstStudentReport = students[0] ? getStudentReport(students[0].id) : null;
  const activeLegerDate = isMid
    ? (schoolInfo.tanggalRaporMid || firstStudentReport?.tempatTanggalRaporMid || (isGenap ? `${schoolInfo.city || 'Kota Jakarta Selatan'}, 28 Maret 2027` : `${schoolInfo.city || 'Kota Jakarta Selatan'}, 10 Oktober 2026`))
    : (schoolInfo.tanggalRapor || firstStudentReport?.tempatTanggalRapor || (isGenap ? `${schoolInfo.city || 'Kota Jakarta Selatan'}, 20 Juni 2027` : `${schoolInfo.city || 'Kota Jakarta Selatan'}, 19 Desember 2026`));

  // Sub-view Tab State
  const [activeSubView, setActiveSubView] = useState<LegerSubView>('matrix');

  // Search, Filter & Sort State
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterGender, setFilterGender] = useState<'all' | 'L' | 'P'>('all');
  const [filterTop, setFilterTop] = useState<'all' | 'top3' | 'top5' | 'top10'>('all');
  const [sortBy, setSortBy] = useState<SortOption>('absen');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Modals
  const [detailStudent, setDetailStudent] = useState<Student | null>(null);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [isPrintLegerOpen, setIsPrintLegerOpen] = useState(false);
  const [printLegerMode, setPrintLegerMode] = useState<'matrix' | 'leaderboard' | 'kenaikan'>('matrix');
  const [bulkStatus, setBulkStatus] = useState<KenaikanStatus>('Naik Kelas');
  const [bulkTargetKelas, setBulkTargetKelas] = useState(
    schoolInfo.className.includes('4') ? 'V (Lima)' : schoolInfo.className.includes('5') ? 'VI (Enam)' : 'Kelas Lanjutan'
  );

  // Computed per-student data cache
  const studentDataList = useMemo(() => {
    return students.map(student => {
      const report = getStudentReport(student.id);
      const studentGrades = isMid
        ? getAllMidSemesterGradesForStudent(student.id)
        : getAllGradesForStudent(student.id);

      const attStats = getEffectiveStudentAttendance(student.id, isMid);

      let totalScore = 0;
      let completedCount = 0;
      let bestSubject = '-';
      let maxSubScore = -1;
      const subjectScores: Record<string, number> = {};

      studentGrades.forEach(g => {
        const score = isMid
          ? ('nilaiAkhirMid' in g ? (g as any).nilaiAkhirMid : ('sumatifSts' in g ? (g as any).sumatifSts : 0))
          : ('nilaiAkhir' in g ? (g as any).nilaiAkhir : 0);

        subjectScores[g.subject.id] = score;
        totalScore += score;
        if (score >= (g.subject.kktp || 75)) completedCount++;
        if (score > maxSubScore) {
          maxSubScore = score;
          bestSubject = g.subject.nama;
        }
      });

      const avgScore = studentGrades.length > 0 ? +(totalScore / studentGrades.length).toFixed(1) : 0;

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
        completedCount,
        attStats,
        bestSubject,
        maxSubScore,
        numericRank
      };
    });
  }, [
    students,
    subjects,
    grades,
    isMid,
    getStudentReport,
    getAllGradesForStudent,
    getAllMidSemesterGradesForStudent,
    getEffectiveStudentAttendance
  ]);

  // Filtered & Sorted Student List
  const processedStudents = useMemo(() => {
    let list = studentDataList.filter(item => {
      const s = item.student;
      const r = item.report;

      const matchesSearch =
        s.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.nisn.includes(searchQuery) ||
        s.nomorAbsen.toString().includes(searchQuery);

      const matchesStatus = filterStatus === 'all' || r.statusKenaikan === filterStatus;
      const matchesGender = filterGender === 'all' || s.jenisKelamin === filterGender;

      let matchesTop = true;
      if (filterTop === 'top3') matchesTop = item.numericRank <= 3;
      else if (filterTop === 'top5') matchesTop = item.numericRank <= 5;
      else if (filterTop === 'top10') matchesTop = item.numericRank <= 10;

      return matchesSearch && matchesStatus && matchesGender && matchesTop;
    });

    // Sorting
    list.sort((a, b) => {
      let comparison = 0;

      if (sortBy === 'rank') {
        comparison = a.numericRank - b.numericRank || b.totalScore - a.totalScore;
      } else if (sortBy === 'absen') {
        comparison = (a.student.nomorAbsen || 0) - (b.student.nomorAbsen || 0);
      } else if (sortBy === 'nama') {
        comparison = a.student.nama.localeCompare(b.student.nama);
      } else if (sortBy === 'total') {
        comparison = b.totalScore - a.totalScore;
      } else if (sortBy === 'avg') {
        comparison = b.avgScore - a.avgScore;
      } else if (sortBy.startsWith('subject-')) {
        const subId = sortBy.replace('subject-', '');
        const scoreA = a.subjectScores[subId] || 0;
        const scoreB = b.subjectScores[subId] || 0;
        comparison = scoreB - scoreA;
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return list;
  }, [studentDataList, searchQuery, filterStatus, filterGender, filterTop, sortBy, sortDirection]);

  // Class-wide Statistics Calculations
  const classStats = useMemo(() => {
    const totalStudents = students.length;
    if (totalStudents === 0) {
      return {
        totalStudents: 0,
        countNaik: 0,
        countTinggal: 0,
        countLulus: 0,
        overallAvg: 0,
        highestTotal: 0,
        lowestTotal: 0,
        subjectAverages: {},
        subjectMax: {},
        subjectMin: {},
        subjectPassPercent: {},
        gradeDistribution: { A: 0, B: 0, C: 0, D: 0 }
      };
    }

    let countNaik = 0;
    let countTinggal = 0;
    let countLulus = 0;
    let sumTotalScores = 0;
    let highestTotal = -1;
    let lowestTotal = 999999;
    const gradeDistribution = { A: 0, B: 0, C: 0, D: 0 };

    // Per subject accumulators
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

    studentDataList.forEach(item => {
      if (item.report.statusKenaikan === 'Naik Kelas') countNaik++;
      else if (item.report.statusKenaikan === 'Tinggal Kelas') countTinggal++;
      else if (item.report.statusKenaikan === 'Lulus') countLulus++;

      sumTotalScores += item.totalScore;
      if (item.totalScore > highestTotal) highestTotal = item.totalScore;
      if (item.totalScore < lowestTotal) lowestTotal = item.totalScore;

      // Grade Predicate for overall average
      if (item.avgScore >= 90) gradeDistribution.A++;
      else if (item.avgScore >= 80) gradeDistribution.B++;
      else if (item.avgScore >= 70) gradeDistribution.C++;
      else gradeDistribution.D++;

      // Subject scores
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
      totalStudents,
      countNaik,
      countTinggal,
      countLulus,
      overallAvg,
      highestTotal: highestTotal === -1 ? 0 : highestTotal,
      lowestTotal: lowestTotal === 999999 ? 0 : lowestTotal,
      subjectAverages,
      subjectMax: subMax,
      subjectMin: subMin,
      subjectPassPercent,
      gradeDistribution
    };
  }, [students, subjects, studentDataList]);

  // Top 3 Students for Podium
  const topThreeStudents = useMemo(() => {
    const sorted = [...studentDataList].sort((a, b) => a.numericRank - b.numericRank || b.totalScore - a.totalScore);
    return {
      first: sorted[0] || null,
      second: sorted[1] || null,
      third: sorted[2] || null
    };
  }, [studentDataList]);

  // Export to CSV / Excel
  const handleExportCSV = () => {
    try {
      const headers = isMid
        ? [
            'No Absen',
            'Nama Lengkap',
            'NISN',
            'Jenis Kelamin',
            ...subjects.map(s => `Nilai ASTS ${s.nama} (${s.kode})`),
            'Total Nilai ASTS',
            'Rata-Rata ASTS',
            'Peringkat Mid',
            'Sakit (Hari)',
            'Izin (Hari)',
            'Alpa (Hari)',
            'Catatan Wali Kelas Mid'
          ]
        : [
            'No Absen',
            'Nama Lengkap',
            'NISN',
            'Jenis Kelamin',
            ...subjects.map(s => `Nilai ${s.nama} (${s.kode})`),
            'Total Nilai',
            'Rata-Rata Rapor',
            'Ranking Kelas',
            'Sakit (Hari)',
            'Izin (Hari)',
            'Alpa (Hari)',
            'Status Kenaikan',
            'Target Kelas'
          ];

      const rows = studentDataList.map(item => {
        const s = item.student;
        const r = item.report;
        const subVals = subjects.map(sub => item.subjectScores[sub.id] ?? 0);

        if (isMid) {
          return [
            s.nomorAbsen || '',
            `"${s.nama.replace(/"/g, '""')}"`,
            `'${s.nisn}`,
            s.jenisKelamin === 'L' ? 'Laki-laki' : 'Perempuan',
            ...subVals,
            item.totalScore,
            item.avgScore,
            r.rankingMid ?? item.numericRank,
            item.attStats.sakit,
            item.attStats.izin,
            item.attStats.alpa,
            `"${(r.catatanWaliKelasMid || '').replace(/"/g, '""')}"`
          ];
        }

        return [
          s.nomorAbsen || '',
          `"${s.nama.replace(/"/g, '""')}"`,
          `'${s.nisn}`,
          s.jenisKelamin === 'L' ? 'Laki-laki' : 'Perempuan',
          ...subVals,
          item.totalScore,
          item.avgScore,
          r.ranking ?? item.numericRank,
          item.attStats.sakit,
          item.attStats.izin,
          item.attStats.alpa,
          `"${r.statusKenaikan || 'Naik Kelas'}"`,
          `"${r.targetKelas || ''}"`
        ];
      });

      const csvContent =
        '\uFEFF' + // UTF-8 BOM for Indonesian characters and Excel compatibility
        [headers.join(';'), ...rows.map(row => row.join(';'))].join('\r\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      const periodLabel = isMid ? 'Mid_Semester_ASTS' : `Semester_${schoolInfo.semester.includes('1') ? '1' : '2'}`;
      link.setAttribute(
        'download',
        `Leger_Nilai_${periodLabel}_${schoolInfo.className.replace(/\s+/g, '_')}_${schoolInfo.academicYear.replace(/[/\\?%*:|"<>]/g, '-')}.csv`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Error exporting CSV:', err);
    }
  };

  const handlePrint = (mode?: 'matrix' | 'leaderboard' | 'kenaikan', period?: 'semester' | 'mid_semester') => {
    setPrintLegerMode(mode || activeSubView);
    setPrintLegerPeriod(period || activePeriod);
    setIsPrintLegerOpen(true);
  };

  const handleAutoCalculateRanking = () => {
    if (isMid) {
      bulkAutoCalculateMidRankings();
    } else {
      bulkAutoCalculateRankings();
    }
  };

  const handleApplyBulk = () => {
    bulkSetKenaikanKelas(bulkStatus, bulkStatus === 'Naik Kelas' ? bulkTargetKelas : undefined);
    setIsBulkModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Selector Mode Periode Leger: Akhir Semester vs Mid Semester */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3.5 bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white rounded-2xl shadow-sm print:hidden">
        <div className="flex items-center gap-3">
          <div className={`flex h-10 w-10 items-center justify-center rounded-xl shadow-xs ${isMid ? 'bg-amber-500 text-white' : 'bg-blue-600 text-white'}`}>
            {isMid ? <Sparkles className="h-5 w-5" /> : <BookOpen className="h-5 w-5" />}
          </div>
          <div>
            <h2 className="text-sm font-black flex items-center gap-2">
              <span>{isMid ? 'Leger Nilai Mid Semester (ASTS)' : 'Leger Nilai Akhir Semester (KMPM)'}</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${isMid ? 'bg-amber-400 text-amber-950' : 'bg-blue-400 text-blue-950'}`}>
                {isMid ? 'Mode ASTS' : 'Mode Akhir Semester'}
              </span>
            </h2>
            <p className="text-xs text-slate-300">
              {isMid
                ? 'Menampilkan rekapitulasi nilai Asesmen Sumatif Tengah Semester (ASTS) beserta absensi dan catatan wali kelas mid.'
                : 'Menampilkan rekapitulasi nilai akhir rapor, ketuntasan KKTP, ranking se-kelas, dan kenaikan kelas.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-slate-950/60 rounded-xl border border-white/10 shrink-0">
          <button
            type="button"
            onClick={() => {
              setActivePeriod('semester');
              setPrintLegerPeriod('semester');
            }}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              !isMid
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <BookOpen className="h-3.5 w-3.5" />
            <span>Leger Akhir Semester</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setActivePeriod('mid_semester');
              setPrintLegerPeriod('mid_semester');
            }}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              isMid
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Leger Mid Semester (ASTS)</span>
          </button>
        </div>
      </div>

      {/* 1. Header Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 print:hidden">
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3.5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Total Siswa</span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
              <User className="h-3.5 w-3.5" />
            </div>
          </div>
          <p className="text-xl font-black text-slate-900 dark:text-white mt-1">
            {students.length} <span className="text-xs font-normal text-slate-400">Anak</span>
          </p>
          <p className="text-[10px] text-slate-500 truncate mt-0.5">Kelas {schoolInfo.className}</p>
        </div>

        <div className="rounded-2xl border border-indigo-200 dark:border-indigo-900/50 bg-indigo-50/40 dark:bg-indigo-950/20 p-3.5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-indigo-700 dark:text-indigo-300 uppercase tracking-wider">
              {isMid ? 'Rata-Rata ASTS Mid' : 'Rata-Rata Kelas'}
            </span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300">
              <TrendingUp className="h-3.5 w-3.5" />
            </div>
          </div>
          <p className="text-xl font-black text-indigo-700 dark:text-indigo-300 mt-1">
            {classStats.overallAvg} <span className="text-xs font-normal text-indigo-500">/ 100</span>
          </p>
          <p className="text-[10px] text-indigo-600 dark:text-indigo-400 truncate mt-0.5">
            {subjects.length} Mata Pelajaran {isMid ? '(ASTS)' : ''}
          </p>
        </div>

        <div className="rounded-2xl border border-amber-200 dark:border-amber-900/50 bg-amber-50/40 dark:bg-amber-950/20 p-3.5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-amber-700 dark:text-amber-300 uppercase tracking-wider">
              {isMid ? 'Juara 1 Mid (ASTS)' : 'Juara 1 Kelas'}
            </span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300">
              <Trophy className="h-3.5 w-3.5" />
            </div>
          </div>
          <p className="text-sm font-black text-amber-900 dark:text-amber-200 mt-1 truncate">
            {topThreeStudents.first?.student.nama || '-'}
          </p>
          <p className="text-[10px] text-amber-700 dark:text-amber-400 mt-0.5">
            Total: {topThreeStudents.first?.totalScore || 0} ({topThreeStudents.first?.avgScore || 0})
          </p>
        </div>

        <div className="rounded-2xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/40 dark:bg-emerald-950/20 p-3.5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider">
              {isMid ? 'Nilai Tertinggi ASTS' : 'Nilai Tertinggi'}
            </span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
              <Star className="h-3.5 w-3.5" />
            </div>
          </div>
          <p className="text-xl font-black text-emerald-700 dark:text-emerald-300 mt-1">
            {classStats.highestTotal} <span className="text-xs font-normal text-emerald-600">Poin</span>
          </p>
          <p className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-0.5">Akumulasi Maksimum {isMid ? 'ASTS' : ''}</p>
        </div>

        <div className="rounded-2xl border border-purple-200 dark:border-purple-900/50 bg-purple-50/40 dark:bg-purple-950/20 p-3.5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-purple-700 dark:text-purple-300 uppercase tracking-wider">
              {isMid ? 'Predikat ASTS (A & B)' : 'Predikat A & B'}
            </span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300">
              <Award className="h-3.5 w-3.5" />
            </div>
          </div>
          <p className="text-xl font-black text-purple-700 dark:text-purple-300 mt-1">
            {classStats.gradeDistribution.A + classStats.gradeDistribution.B}{' '}
            <span className="text-xs font-normal text-purple-500">Siswa</span>
          </p>
          <p className="text-[10px] text-purple-600 dark:text-purple-400 mt-0.5">
            A: {classStats.gradeDistribution.A} &bull; B: {classStats.gradeDistribution.B}
          </p>
        </div>

        <div className="rounded-2xl border border-blue-200 dark:border-blue-900/50 bg-blue-50/40 dark:bg-blue-950/20 p-3.5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-blue-700 dark:text-blue-300 uppercase tracking-wider">
              {isMid ? 'Status Asesmen' : isGenap ? 'Kenaikan Kelas' : 'Semester 1'}
            </span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
              <GraduationCap className="h-3.5 w-3.5" />
            </div>
          </div>
          <p className="text-xl font-black text-blue-700 dark:text-blue-300 mt-1">
            {isMid ? 'Mid Smt (ASTS)' : isGenap ? `${classStats.countNaik + classStats.countLulus} Naik` : 'Smt Ganjil'}
          </p>
          <p className="text-[10px] text-blue-600 dark:text-blue-400 mt-0.5">
            {isMid ? 'Asesmen Tengah Smt (ASTS)' : isGenap ? `${classStats.countTinggal} Tinggal Kelas` : 'Penentuan di Smt 2'}
          </p>
        </div>
      </div>

      {/* 2. Sub-View Tab Switcher & Action Toolbar */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-xs space-y-4 print:hidden">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
          {/* Sub Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
            <button
              type="button"
              onClick={() => setActiveSubView('matrix')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeSubView === 'matrix'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <FileSpreadsheet className="h-3.5 w-3.5" />
              <span>{isMid ? 'Matriks Leger Nilai ASTS' : 'Matriks Leger Nilai Mapel'}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSubView('leaderboard')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeSubView === 'leaderboard'
                  ? 'bg-white dark:bg-slate-700 text-amber-600 dark:text-amber-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Trophy className="h-3.5 w-3.5" />
              <span>{isMid ? 'Podium & Peringkat Mid' : 'Podium & Peringkat Kelas'}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSubView('kenaikan')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeSubView === 'kenaikan'
                  ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <GraduationCap className="h-3.5 w-3.5" />
              <span>Rekap Kenaikan Kelas {isGenap ? '' : '(Smt 2)'}</span>
            </button>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleAutoCalculateRanking}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 active:scale-95 text-white rounded-xl text-xs font-bold shadow-xs transition-all"
              title={isMid ? "Hitung ranking mid semester otomatis berdasarkan akumulasi nilai STS" : "Urutkan ranking 1-N otomatis berdasarkan total perolehan nilai rapor"}
            >
              <TrendingUp className="h-3.5 w-3.5" />
              <span>{isMid ? 'Hitung Ranking Mid Otomatis' : 'Hitung Ulang Ranking Otomatis'}</span>
            </button>

            <button
              type="button"
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white rounded-xl text-xs font-bold shadow-xs transition-all"
              title="Unduh leger nilai lengkap format Excel/CSV"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export CSV / Excel</span>
            </button>

            <button
              type="button"
              onClick={() => handlePrint(activeSubView, activePeriod)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold shadow-xs transition-all active:scale-95 text-white ${
                isMid ? 'bg-amber-600 hover:bg-amber-700' : 'bg-slate-800 hover:bg-slate-700'
              }`}
              title={isMid ? "Cetak leger nilai Asesmen Sumatif Tengah Semester (ASTS)" : "Cetak format cetak leger resmi Kurikulum Merdeka Pembelajaran Mendalam (KMPM)"}
            >
              <Printer className="h-3.5 w-3.5" />
              <span>{isMid ? 'Cetak Leger Mid (ASTS)' : 'Cetak Leger'}</span>
            </button>
          </div>
        </div>

        {/* Filter, Search & Sort Control Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1 text-xs">
          <div className="flex flex-wrap items-center gap-2.5 flex-1">
            {/* Search */}
            <div className="relative min-w-[220px] flex-1 sm:flex-initial">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Cari siswa / NISN / No Absen..."
                className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Filter Gender */}
            <select
              value={filterGender}
              onChange={e => setFilterGender(e.target.value as any)}
              className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-200 font-medium outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Semua Gender (L/P)</option>
              <option value="L">Hanya Laki-laki (L)</option>
              <option value="P">Hanya Perempuan (P)</option>
            </select>

            {/* Filter Top */}
            <select
              value={filterTop}
              onChange={e => setFilterTop(e.target.value as any)}
              className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-200 font-medium outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Semua Peringkat</option>
              <option value="top3">Top 3 Besar (Podium)</option>
              <option value="top5">Top 5 Besar</option>
              <option value="top10">Top 10 Besar</option>
            </select>

            {/* Filter Status Kenaikan */}
            {activeSubView === 'kenaikan' && (
              <select
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value)}
                className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-200 font-medium outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Semua Status Kenaikan</option>
                <option value="Naik Kelas">Naik Kelas</option>
                <option value="Tinggal Kelas">Tinggal Kelas</option>
                <option value="Lulus">Lulus</option>
                <option value="Belum Ditentukan">Belum Ditentukan</option>
              </select>
            )}
          </div>

          {/* Sort Controller */}
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-medium text-[11px] flex items-center gap-1">
              <ArrowUpDown className="h-3 w-3 text-slate-400" />
              <span>Urutkan:</span>
            </span>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-200 font-bold outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="absen">Nomor Absen (1 - {students.length})</option>
              <option value="rank">Peringkat / Ranking (1 - {students.length})</option>
              <option value="total">Total Nilai Terbesar</option>
              <option value="avg">Rata-Rata Terbesar</option>
              <option value="nama">Nama Siswa (A - Z)</option>
              <optgroup label="Berdasarkan Nilai Mapel:">
                {subjects.map(s => (
                  <option key={s.id} value={`subject-${s.id}`}>
                    Nilai Mapel: {s.nama} ({s.kode})
                  </option>
                ))}
              </optgroup>
            </select>

            <button
              type="button"
              onClick={() => setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'))}
              className="px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold hover:bg-slate-100 dark:hover:bg-slate-700"
              title={sortDirection === 'asc' ? 'Urutan Meningkat (A-Z / 1-9)' : 'Urutan Menurun (Z-A / 9-1)'}
            >
              {sortDirection === 'asc' ? '▲ ASC' : '▼ DESC'}
            </button>
          </div>
        </div>
      </div>

      {/* 4. SUB-VIEW 1: MATRIKS LEGER NILAI MAPEL LENGKAP */}
      {activeSubView === 'matrix' && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs overflow-hidden">
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  {/* Top Level Header Row */}
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/90 text-slate-700 dark:text-slate-200 font-bold uppercase text-[10px]">
                    <th rowSpan={2} className="py-3 px-2.5 text-center w-10 border-r border-slate-200 dark:border-slate-700">
                      No
                    </th>
                    <th rowSpan={2} className="py-3 px-3 min-w-[180px] border-r border-slate-200 dark:border-slate-700">
                      Nama Peserta Didik
                    </th>
                    <th rowSpan={2} className="py-3 px-2 text-center w-12 border-r border-slate-200 dark:border-slate-700">
                      L/P
                    </th>
                    
                    {/* Dynamic Subject Columns */}
                    <th
                      colSpan={subjects.length}
                      className="py-2 px-3 text-center border-r border-slate-200 dark:border-slate-700 bg-blue-50/80 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200 font-extrabold"
                    >
                      {isMid
                        ? 'Mata Pelajaran (Nilai Asesmen Sumatif Tengah Semester / ASTS)'
                        : 'Mata Pelajaran (Nilai Akhir Rapor & KKTP)'}
                    </th>

                    <th rowSpan={2} className="py-3 px-2.5 text-center w-16 bg-blue-100/70 dark:bg-blue-950/70 text-blue-950 dark:text-blue-200 font-black border-r border-slate-200 dark:border-slate-700">
                      Total
                    </th>
                    <th rowSpan={2} className="py-3 px-2.5 text-center w-16 bg-indigo-100/70 dark:bg-indigo-950/70 text-indigo-950 dark:text-indigo-200 font-black border-r border-slate-200 dark:border-slate-700">
                      Rata²
                    </th>
                    <th rowSpan={2} className="py-3 px-3 text-center min-w-[100px] bg-amber-100/80 dark:bg-amber-950/60 text-amber-950 dark:text-amber-200 font-black border-r border-slate-200 dark:border-slate-700">
                      {isMid ? 'Peringkat Mid' : 'Peringkat'}
                    </th>

                    {/* Presensi Header */}
                    <th colSpan={3} className="py-2 px-2 text-center border-r border-slate-200 dark:border-slate-700 bg-slate-200/60 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold">
                      Kehadiran
                    </th>

                    <th rowSpan={2} className="py-3 px-3 min-w-[130px] bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-bold border-r border-slate-200 dark:border-slate-700">
                      {isMid ? 'Catatan Mid (ASTS)' : `Status ${isGenap ? 'Kenaikan' : 'Capaian'}`}
                    </th>

                    <th rowSpan={2} className="py-3 px-3 text-center min-w-[110px] print:hidden">
                      Aksi
                    </th>
                  </tr>

                  {/* Sub-Header Row for Subjects and Attendance */}
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 text-[9.5px]">
                    {subjects.map(subject => {
                      const isAgm = isAgamaSubject(subject);
                      return (
                        <th
                          key={subject.id}
                          className="py-2 px-1.5 text-center min-w-[62px] border-r border-slate-200/70 dark:border-slate-700/70"
                          title={
                            isAgm
                              ? 'Pendidikan Agama & Budi Pekerti (Nilai disesuaikan dengan agama masing-masing siswa di profil: PAI, PAK, PAKat, PAH, PAB, PAKho)'
                              : `${subject.nama} (KKTP: ${subject.kktp})`
                          }
                        >
                          <div className="font-extrabold text-slate-800 dark:text-slate-200 truncate">
                            {subject.kode}
                          </div>
                          <div className="text-[8.5px] font-mono text-slate-400">
                            ≥{subject.kktp}
                          </div>
                        </th>
                      );
                    })}

                    {/* S, I, A Columns */}
                    <th className="py-2 px-1.5 text-center w-8 border-r border-slate-200/70 dark:border-slate-700/70 font-bold text-amber-700">
                      S
                    </th>
                    <th className="py-2 px-1.5 text-center w-8 border-r border-slate-200/70 dark:border-slate-700/70 font-bold text-blue-700">
                      I
                    </th>
                    <th className="py-2 px-1.5 text-center w-8 border-r border-slate-200/70 dark:border-slate-700/70 font-bold text-rose-700">
                      A
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {processedStudents.map((item, idx) => {
                    const s = item.student;
                    const r = item.report;
                    const isTop1 = item.numericRank === 1;
                    const isTop2 = item.numericRank === 2;
                    const isTop3 = item.numericRank === 3;

                    return (
                      <tr
                        key={s.id}
                        className={`hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors ${
                          isTop1
                            ? 'bg-amber-50/30 dark:bg-amber-950/10'
                            : isTop2 || isTop3
                            ? 'bg-amber-50/15 dark:bg-amber-950/5'
                            : ''
                        }`}
                      >
                        {/* No Absen */}
                        <td className="py-2.5 px-2.5 text-center font-bold text-slate-500 border-r border-slate-100 dark:border-slate-800">
                          {s.nomorAbsen || idx + 1}
                        </td>

                        {/* Nama Siswa */}
                        <td className="py-2.5 px-3 border-r border-slate-100 dark:border-slate-800">
                          <div className="flex items-center gap-2">
                            <div
                              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                                isTop1
                                  ? 'bg-amber-500 text-white ring-2 ring-amber-300'
                                  : isTop2
                                  ? 'bg-slate-400 text-white'
                                  : isTop3
                                  ? 'bg-amber-700 text-white'
                                  : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                              }`}
                            >
                              {isTop1 ? '🥇' : isTop2 ? '🥈' : isTop3 ? '🥉' : s.nama.charAt(0)}
                            </div>
                            <div className="min-w-0">
                              <p
                                onClick={() => setDetailStudent(s)}
                                className="font-bold text-slate-900 dark:text-white truncate cursor-pointer hover:text-blue-600 transition-colors"
                              >
                                {s.nama}
                              </p>
                              <p className="text-[9.5px] text-slate-400 font-mono truncate">
                                NISN: {s.nisn} &bull; <span className="text-slate-500 font-medium">{s.agama}</span>
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Jenis Kelamin */}
                        <td className="py-2.5 px-2 text-center border-r border-slate-100 dark:border-slate-800">
                          <span
                            className={`px-1.5 py-0.5 rounded text-[9.5px] font-bold ${
                              s.jenisKelamin === 'L'
                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300'
                                : 'bg-pink-100 text-pink-800 dark:bg-pink-900/60 dark:text-pink-300'
                            }`}
                          >
                            {s.jenisKelamin}
                          </span>
                        </td>

                        {/* Subject Scores */}
                        {subjects.map(subject => {
                          const score = item.subjectScores[subject.id] ?? 0;
                          const isTuntas = score >= (subject.kktp || 75);

                          return (
                            <td
                              key={subject.id}
                              className="py-2.5 px-1.5 text-center font-mono font-semibold border-r border-slate-100 dark:border-slate-800 text-[11px]"
                            >
                              <span
                                className={
                                  isTuntas
                                    ? 'text-slate-800 dark:text-slate-200'
                                    : 'text-rose-600 dark:text-rose-400 font-bold bg-rose-50 dark:bg-rose-950/40 px-1 py-0.5 rounded'
                                }
                              >
                                {score}
                              </span>
                            </td>
                          );
                        })}

                        {/* Total Nilai */}
                        <td className="py-2.5 px-2.5 text-center font-black text-blue-700 dark:text-blue-300 bg-blue-50/40 dark:bg-blue-950/20 border-r border-slate-100 dark:border-slate-800">
                          {item.totalScore}
                        </td>

                        {/* Rata-Rata */}
                        <td className="py-2.5 px-2.5 text-center font-black text-indigo-700 dark:text-indigo-300 bg-indigo-50/40 dark:bg-indigo-950/20 border-r border-slate-100 dark:border-slate-800">
                          {item.avgScore}
                        </td>

                        {/* Ranking Cell */}
                        <td className="py-2 px-2 text-center bg-amber-50/40 dark:bg-amber-950/20 border-r border-slate-100 dark:border-slate-800">
                          <div className="flex items-center justify-center gap-1">
                            <input
                              type="text"
                              value={isMid ? (r.rankingMid ?? '') : (r.ranking ?? '')}
                              onChange={e => {
                                if (isMid) {
                                  updateStudentReport(s.id, {
                                    rankingMid: e.target.value
                                  });
                                } else {
                                  updateStudentReport(s.id, {
                                    ranking: e.target.value
                                  });
                                }
                              }}
                              placeholder="-"
                              className="w-12 text-center py-1 px-1 rounded-lg border border-amber-300 dark:border-amber-700 bg-white dark:bg-slate-800 text-xs font-black text-amber-950 dark:text-amber-200 focus:ring-2 focus:ring-amber-500 outline-none"
                            />
                            {item.numericRank <= 3 && (
                              <span className="text-xs">
                                {item.numericRank === 1 ? '🥇' : item.numericRank === 2 ? '🥈' : '🥉'}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Presensi S / I / A */}
                        <td className="py-2.5 px-1.5 text-center font-mono text-slate-700 dark:text-slate-300 border-r border-slate-100 dark:border-slate-800">
                          {item.attStats.sakit}
                        </td>
                        <td className="py-2.5 px-1.5 text-center font-mono text-slate-700 dark:text-slate-300 border-r border-slate-100 dark:border-slate-800">
                          {item.attStats.izin}
                        </td>
                        <td className="py-2.5 px-1.5 text-center font-mono text-rose-600 font-bold border-r border-slate-100 dark:border-slate-800">
                          {item.attStats.alpa}
                        </td>

                        {/* Status Kenaikan / Catatan Mid */}
                        <td className="py-2.5 px-3 border-r border-slate-100 dark:border-slate-800">
                          {isMid ? (
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold truncate max-w-[140px] inline-block ${
                                item.avgScore >= 75
                                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                  : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                              }`}
                              title={r.catatanWaliKelasMid || (item.avgScore >= 75 ? 'Tuntas Capaian ASTS' : 'Perlu Pendampingan ASTS')}
                            >
                              {r.catatanWaliKelasMid || (item.avgScore >= 75 ? 'Tuntas ASTS' : 'Perlu Pendampingan')}
                            </span>
                          ) : (
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                r.statusKenaikan === 'Naik Kelas' || r.statusKenaikan === 'Lulus'
                                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                  : r.statusKenaikan === 'Tinggal Kelas'
                                  ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                                  : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                              }`}
                            >
                              {r.statusKenaikan || 'Naik Kelas'}
                            </span>
                          )}
                        </td>

                        {/* Aksi */}
                        <td className="py-2.5 px-3 text-center print:hidden">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              type="button"
                              onClick={() => setDetailStudent(s)}
                              className="p-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 dark:bg-blue-950 dark:hover:bg-blue-900 dark:text-blue-300 transition-colors"
                              title="Rincian Nilai Formatif, STS & SAS Siswa"
                            >
                              <Eye className="h-3.5 w-3.5" />
                            </button>

                            <button
                              type="button"
                              onClick={() => setEditingStudent(s)}
                              className="p-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 transition-colors"
                              title="Edit Catatan Rapor & Ranking"
                            >
                              <Edit3 className="h-3.5 w-3.5" />
                            </button>

                            <button
                              type="button"
                              onClick={() => onSelectStudentForReport(s)}
                              className="flex items-center gap-1 px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[10px] font-bold shadow-xs transition-all active:scale-95"
                              title="Buka Lembar Rapor Siswa"
                            >
                              <span>Rapor</span>
                              <ChevronRight className="h-3 w-3" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>

                {/* Statistical Summary Footer Rows */}
                <tfoot>
                  {/* Rata-Rata Kelas Row */}
                  <tr className="bg-slate-100 dark:bg-slate-800 font-bold text-[10.5px] border-t-2 border-slate-300 dark:border-slate-700">
                    <td colSpan={3} className="py-2.5 px-3 text-right font-black uppercase text-slate-700 dark:text-slate-300 border-r border-slate-200 dark:border-slate-700">
                      Rata-Rata Nilai Mapel:
                    </td>
                    {subjects.map(subject => (
                      <td
                        key={subject.id}
                        className="py-2.5 px-1.5 text-center font-mono font-black text-indigo-700 dark:text-indigo-300 border-r border-slate-200 dark:border-slate-700"
                      >
                        {classStats.subjectAverages[subject.id] ?? '-'}
                      </td>
                    ))}
                    <td className="py-2.5 px-2 text-center font-black text-blue-700 dark:text-blue-300 border-r border-slate-200 dark:border-slate-700">
                      {classStats.highestTotal > 0 ? (classStats.overallAvg * subjects.length).toFixed(0) : '-'}
                    </td>
                    <td className="py-2.5 px-2 text-center font-black text-indigo-700 dark:text-indigo-300 border-r border-slate-200 dark:border-slate-700">
                      {classStats.overallAvg}
                    </td>
                    <td colSpan={5} className="py-2.5 px-3 text-[10px] text-slate-500 font-normal">
                      Rata-rata dari seluruh {students.length} peserta didik
                    </td>
                  </tr>

                  {/* Nilai Tertinggi & Terendah Row */}
                  <tr className="bg-slate-50 dark:bg-slate-800/60 text-[10px] text-slate-600 dark:text-slate-400">
                    <td colSpan={3} className="py-2 px-3 text-right font-bold text-emerald-700 dark:text-emerald-300 border-r border-slate-200 dark:border-slate-700">
                      Nilai Tertinggi (Maks):
                    </td>
                    {subjects.map(subject => (
                      <td
                        key={subject.id}
                        className="py-2 px-1.5 text-center font-mono font-bold text-emerald-600 dark:text-emerald-400 border-r border-slate-200 dark:border-slate-700"
                      >
                        {classStats.subjectMax[subject.id] ?? '-'}
                      </td>
                    ))}
                    <td className="py-2 px-2 text-center font-bold text-emerald-700 dark:text-emerald-300 border-r border-slate-200 dark:border-slate-700">
                      {classStats.highestTotal}
                    </td>
                    <td colSpan={6} className="py-2 px-3 text-[9.5px]">
                      Nilai terendah kelas: Total {classStats.lowestTotal}
                    </td>
                  </tr>

                  {/* Ketuntasan KKTP Row */}
                  <tr className="bg-slate-50/80 dark:bg-slate-800/40 text-[10px] text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
                    <td colSpan={3} className="py-2 px-3 text-right font-bold text-blue-700 dark:text-blue-300 border-r border-slate-200 dark:border-slate-700">
                      Ketuntasan KKTP (%):
                    </td>
                    {subjects.map(subject => (
                      <td
                        key={subject.id}
                        className="py-2 px-1.5 text-center font-mono font-bold text-blue-600 dark:text-blue-400 border-r border-slate-200 dark:border-slate-700"
                      >
                        {classStats.subjectPassPercent[subject.id]}%
                      </td>
                    ))}
                    <td colSpan={7} className="py-2 px-3 text-[9.5px] text-slate-500">
                      Persentase siswa tuntas mencapai KKTP per mapel
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 5. SUB-VIEW 2: PODIUM & PERINGKAT KELAS (LEADERBOARD) */}
      {activeSubView === 'leaderboard' && (
        <div className="space-y-6 print:hidden">
          {/* Top 3 Champion Podium */}
          <div className="rounded-3xl border border-amber-200/80 dark:border-amber-900/40 bg-gradient-to-b from-amber-50/60 via-white to-amber-50/30 dark:from-slate-900 dark:via-slate-900 dark:to-amber-950/20 p-6 shadow-sm">
            <div className="text-center max-w-md mx-auto mb-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-300 text-xs font-black mb-2">
                <Trophy className="h-3.5 w-3.5 text-amber-500" />
                <span>Panggung Juara Kelas</span>
              </div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                Peringkat 3 Besar Kelas {schoolInfo.className}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Berdasarkan akumulasi nilai seluruh {subjects.length} mata pelajaran Tahun Pelajaran {schoolInfo.academicYear}
              </p>
            </div>

            {/* Podium Visual Layout */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end max-w-4xl mx-auto pt-4">
              {/* JUARA 2 (Silver) */}
              <div className="order-2 md:order-1 rounded-2xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 text-center shadow-md relative group hover:-translate-y-1 transition-transform">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex items-center justify-center h-8 w-8 rounded-full bg-slate-400 text-white font-black text-sm shadow-md ring-4 ring-white dark:ring-slate-800">
                  2
                </div>
                <div className="mt-2">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-200 to-slate-400 text-slate-800 font-black text-xl mb-2 shadow-inner">
                    {topThreeStudents.second?.student.nama.charAt(0) || '2'}
                  </div>
                  <h4 className="text-sm font-black text-slate-900 dark:text-white truncate">
                    {topThreeStudents.second?.student.nama || 'Belum Ada'}
                  </h4>
                  <p className="text-[10px] text-slate-500 font-mono">
                    NISN: {topThreeStudents.second?.student.nisn || '-'}
                  </p>

                  <div className="mt-3 p-2 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 space-y-1">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-slate-500">Total:</span>
                      <span className="text-slate-900 dark:text-white font-black">
                        {topThreeStudents.second?.totalScore || 0}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-slate-500">Rata-Rata:</span>
                      <span className="text-indigo-600 dark:text-indigo-400 font-black">
                        {topThreeStudents.second?.avgScore || 0}
                      </span>
                    </div>
                  </div>

                  {topThreeStudents.second && (
                    <button
                      type="button"
                      onClick={() => setDetailStudent(topThreeStudents.second!.student)}
                      className="mt-3 w-full py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors"
                    >
                      Lihat Rincian
                    </button>
                  )}
                </div>
              </div>

              {/* JUARA 1 (Gold - Taller & Highlighted) */}
              <div className="order-1 md:order-2 rounded-3xl border-2 border-amber-400 dark:border-amber-500 bg-gradient-to-b from-amber-50 to-white dark:from-amber-950/40 dark:to-slate-800 p-5 text-center shadow-xl relative -top-3 group hover:-translate-y-1 transition-transform">
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 flex items-center justify-center h-10 w-10 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-400 text-white font-black text-lg shadow-lg ring-4 ring-white dark:ring-slate-900">
                  👑
                </div>
                <div className="mt-3">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-500 text-white font-black text-2xl mb-2 shadow-md shadow-amber-500/30">
                    {topThreeStudents.first?.student.nama.charAt(0) || '1'}
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500 text-white inline-block mb-1">
                    Juara 1 Umum
                  </span>
                  <h4 className="text-base font-black text-slate-900 dark:text-white truncate">
                    {topThreeStudents.first?.student.nama || 'Belum Ada'}
                  </h4>
                  <p className="text-[11px] text-slate-500 font-mono">
                    NISN: {topThreeStudents.first?.student.nisn || '-'}
                  </p>

                  <div className="mt-3 p-3 rounded-2xl bg-white dark:bg-slate-900/80 border border-amber-200 dark:border-amber-900/60 space-y-1.5 shadow-xs">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-slate-500">Total Akumulasi:</span>
                      <span className="text-amber-700 dark:text-amber-300 font-black text-sm">
                        {topThreeStudents.first?.totalScore || 0} Poin
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-slate-500">Rata-Rata Rapor:</span>
                      <span className="text-blue-600 dark:text-blue-400 font-black text-sm">
                        {topThreeStudents.first?.avgScore || 0} / 100
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">Mapel Terbaik:</span>
                      <span className="text-slate-700 dark:text-slate-300 font-semibold truncate">
                        {topThreeStudents.first?.bestSubject || '-'}
                      </span>
                    </div>
                  </div>

                  {topThreeStudents.first && (
                    <button
                      type="button"
                      onClick={() => setDetailStudent(topThreeStudents.first!.student)}
                      className="mt-3 w-full py-2 rounded-xl bg-amber-500 hover:bg-amber-600 active:scale-95 text-white text-xs font-bold shadow-md shadow-amber-500/20 transition-all"
                    >
                      Buka Rincian Juara 1
                    </button>
                  )}
                </div>
              </div>

              {/* JUARA 3 (Bronze) */}
              <div className="order-3 md:order-3 rounded-2xl border-2 border-amber-700/40 dark:border-amber-800 bg-white dark:bg-slate-800 p-4 text-center shadow-md relative group hover:-translate-y-1 transition-transform">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex items-center justify-center h-8 w-8 rounded-full bg-amber-700 text-white font-black text-sm shadow-md ring-4 ring-white dark:ring-slate-800">
                  3
                </div>
                <div className="mt-2">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-600 to-amber-800 text-white font-black text-xl mb-2 shadow-inner">
                    {topThreeStudents.third?.student.nama.charAt(0) || '3'}
                  </div>
                  <h4 className="text-sm font-black text-slate-900 dark:text-white truncate">
                    {topThreeStudents.third?.student.nama || 'Belum Ada'}
                  </h4>
                  <p className="text-[10px] text-slate-500 font-mono">
                    NISN: {topThreeStudents.third?.student.nisn || '-'}
                  </p>

                  <div className="mt-3 p-2 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 space-y-1">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-slate-500">Total:</span>
                      <span className="text-slate-900 dark:text-white font-black">
                        {topThreeStudents.third?.totalScore || 0}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-slate-500">Rata-Rata:</span>
                      <span className="text-indigo-600 dark:text-indigo-400 font-black">
                        {topThreeStudents.third?.avgScore || 0}
                      </span>
                    </div>
                  </div>

                  {topThreeStudents.third && (
                    <button
                      type="button"
                      onClick={() => setDetailStudent(topThreeStudents.third!.student)}
                      className="mt-3 w-full py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors"
                    >
                      Lihat Rincian
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Leaderboard Table Peringkat 1 s/d N */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xs">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Award className="h-4 w-4 text-amber-500" />
                  <span>Daftar Peringkat Lengkap Se-Kelas (1 s/d {students.length})</span>
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Klik nama siswa untuk rincian nilai tiap mata pelajaran
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handlePrint('leaderboard', activePeriod)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-xs transition-all"
                >
                  <Printer className="h-3.5 w-3.5" />
                  <span>Cetak Daftar Peringkat</span>
                </button>
                <span className="text-xs font-bold text-slate-500">
                  Menampilkan {processedStudents.length} siswa
                </span>
              </div>
            </div>

            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 font-bold uppercase text-[10.5px]">
                  <tr className="border-b border-slate-200 dark:border-slate-800">
                    <th className="py-3 px-3 text-center w-16">Peringkat</th>
                    <th className="py-3 px-3 min-w-[200px]">Nama Peserta Didik</th>
                    <th className="py-3 px-2 text-center w-14">Absen</th>
                    <th className="py-3 px-3 text-center w-24">Total Nilai</th>
                    <th className="py-3 px-3 text-center w-24">Rata-Rata</th>
                    <th className="py-3 px-4 min-w-[180px]">Distribusi Nilai Terhadap Kelas</th>
                    <th className="py-3 px-3 text-center w-28">Ketuntasan KKTP</th>
                    <th className="py-3 px-3 min-w-[130px]">Status Kenaikan</th>
                    <th className="py-3 px-3 text-center w-28">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {processedStudents.map((item, idx) => {
                    const s = item.student;
                    const r = item.report;
                    const rank = item.numericRank;
                    const maxPossible = subjects.length * 100;
                    const scorePercent = maxPossible > 0 ? Math.round((item.totalScore / maxPossible) * 100) : 0;
                    const isAboveAvg = item.avgScore >= classStats.overallAvg;

                    return (
                      <tr
                        key={s.id}
                        className={`hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${
                          rank === 1
                            ? 'bg-amber-50/30 dark:bg-amber-950/10 font-medium'
                            : rank === 2 || rank === 3
                            ? 'bg-amber-50/10 dark:bg-amber-950/5'
                            : ''
                        }`}
                      >
                        {/* Peringkat Badge */}
                        <td className="py-2.5 px-3 text-center">
                          <div className="flex items-center justify-center">
                            {rank === 1 ? (
                              <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-amber-500 text-white font-black text-xs shadow-xs">
                                🥇 1
                              </span>
                            ) : rank === 2 ? (
                              <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-slate-400 text-white font-black text-xs shadow-xs">
                                🥈 2
                              </span>
                            ) : rank === 3 ? (
                              <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-amber-700 text-white font-black text-xs shadow-xs">
                                🥉 3
                              </span>
                            ) : (
                              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs">
                                #{rank}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Nama & NISN */}
                        <td className="py-2.5 px-3">
                          <div className="flex items-center gap-2">
                            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold text-[10px]">
                              {s.nama.charAt(0)}
                            </div>
                            <div>
                              <p
                                onClick={() => setDetailStudent(s)}
                                className="font-bold text-slate-900 dark:text-white cursor-pointer hover:text-blue-600 transition-colors"
                              >
                                {s.nama}
                              </p>
                              <p className="text-[10px] text-slate-400 font-mono">
                                NISN: {s.nisn} &bull; {s.jenisKelamin === 'L' ? 'L' : 'P'}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Absen */}
                        <td className="py-2.5 px-2 text-center font-mono text-slate-500">
                          {s.nomorAbsen || idx + 1}
                        </td>

                        {/* Total Nilai */}
                        <td className="py-2.5 px-3 text-center font-black text-blue-700 dark:text-blue-300">
                          {item.totalScore}
                        </td>

                        {/* Rata-Rata */}
                        <td className="py-2.5 px-3 text-center">
                          <span className="font-black text-slate-900 dark:text-white block">
                            {item.avgScore}
                          </span>
                          <span
                            className={`text-[9px] font-bold ${
                              isAboveAvg ? 'text-emerald-600' : 'text-slate-400'
                            }`}
                          >
                            {isAboveAvg ? '▲ Di atas rerata' : '▼ Di bawah rerata'}
                          </span>
                        </td>

                        {/* Visual Progress Bar */}
                        <td className="py-2.5 px-4">
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-[10px]">
                              <span className="text-slate-500 font-medium">Performa</span>
                              <span className="font-bold text-slate-700 dark:text-slate-300">{scorePercent}%</span>
                            </div>
                            <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  rank <= 3
                                    ? 'bg-amber-500'
                                    : item.avgScore >= 80
                                    ? 'bg-blue-600'
                                    : 'bg-indigo-500'
                                }`}
                                style={{ width: `${scorePercent}%` }}
                              />
                            </div>
                          </div>
                        </td>

                        {/* Ketuntasan */}
                        <td className="py-2.5 px-3 text-center">
                          <span
                            className={`px-2 py-0.5 rounded-md font-bold text-[10.5px] ${
                              item.completedCount === subjects.length
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                            }`}
                          >
                            {item.completedCount} / {subjects.length} Tuntas
                          </span>
                        </td>

                        {/* Status */}
                        <td className="py-2.5 px-3">
                          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                            {r.statusKenaikan || 'Naik Kelas'}
                          </span>
                        </td>

                        {/* Aksi */}
                        <td className="py-2.5 px-3 text-center">
                          <button
                            type="button"
                            onClick={() => setDetailStudent(s)}
                            className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 dark:bg-blue-950 dark:hover:bg-blue-900 dark:text-blue-300 text-xs font-bold transition-colors"
                          >
                            Rincian Nilai
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 6. SUB-VIEW 3: REKAP KEPUTUSAN KENAIKAN KELAS / KELULUSAN */}
      {activeSubView === 'kenaikan' && (
        <div className="space-y-4 print:hidden">
          {/* Banner Action Kenaikan Massal */}
          <div className="rounded-2xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/50 dark:bg-emerald-950/20 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-600 text-white">
                <GraduationCap className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Keputusan Kenaikan Kelas & Kelulusan (Semester 2)
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Atur status kenaikan dan narasi otomatis yang tercantum pada lembar rapor resmi seluruh siswa.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handlePrint('kenaikan', activePeriod)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-white text-xs font-bold shadow-xs transition-all"
              >
                <Printer className="h-4 w-4" />
                <span>Cetak Rekap Kenaikan</span>
              </button>

              <button
                type="button"
                onClick={() => setIsBulkModalOpen(true)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all"
              >
                <GraduationCap className="h-4 w-4" />
                <span>Set Kenaikan Massal Se-Kelas</span>
              </button>
            </div>
          </div>

          {/* Table of Decisions */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xs">
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold uppercase text-[10.5px]">
                  <tr className="border-b border-slate-200 dark:border-slate-800">
                    <th className="py-3 px-3 text-center w-12">No</th>
                    <th className="py-3 px-3 min-w-[180px]">Nama Peserta Didik</th>
                    <th className="py-3 px-3 text-center w-24">Rata² Rapor</th>
                    <th className="py-3 px-3 min-w-[160px]">Status Kenaikan</th>
                    <th className="py-3 px-3 min-w-[150px]">Target Kelas</th>
                    <th className="py-3 px-3 min-w-[280px]">Keterangan / Narasi Rapor</th>
                    <th className="py-3 px-3 text-center w-28">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {processedStudents.map((item, idx) => {
                    const s = item.student;
                    const r = item.report;

                    return (
                      <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                        <td className="py-2.5 px-3 text-center font-bold text-slate-500">
                          {s.nomorAbsen || idx + 1}
                        </td>
                        <td className="py-2.5 px-3">
                          <p className="font-bold text-slate-900 dark:text-white">{s.nama}</p>
                          <p className="text-[10px] text-slate-400 font-mono">NISN: {s.nisn}</p>
                        </td>
                        <td className="py-2.5 px-3 text-center font-black text-slate-800 dark:text-slate-200">
                          {item.avgScore}
                        </td>
                        <td className="py-2.5 px-3">
                          <select
                            value={r.statusKenaikan || 'Naik Kelas'}
                            onChange={e => {
                              const newStatus = e.target.value as KenaikanStatus;
                              const targetClass = r.targetKelas || bulkTargetKelas;
                              const ket =
                                newStatus === 'Naik Kelas'
                                  ? `Berdasarkan pencapaian seluruh tujuan pembelajaran pada Tahun Ajaran ${schoolInfo.academicYear}, ananda dinyatakan: NAIK KE KELAS ${targetClass.toUpperCase()}`
                                  : newStatus === 'Tinggal Kelas'
                                  ? `Berdasarkan evaluasi ketercapaian kompetensi pada Tahun Ajaran ${schoolInfo.academicYear}, ananda dinyatakan: TINGGAL DI KELAS ${schoolInfo.className.toUpperCase()}`
                                  : newStatus === 'Lulus'
                                  ? `Berdasarkan kriteria kelulusan akhir jenjang SD, ananda dinyatakan: LULUS DARI SEKOLAH DASAR`
                                  : '';

                              updateStudentReport(s.id, {
                                statusKenaikan: newStatus,
                                keteranganKenaikan: ket
                              });
                            }}
                            className={`w-full py-1.5 px-2.5 rounded-xl border text-xs font-bold outline-none bg-white dark:bg-slate-800 ${
                              r.statusKenaikan === 'Naik Kelas' || r.statusKenaikan === 'Lulus'
                                ? 'border-emerald-300 text-emerald-800 dark:text-emerald-300 dark:border-emerald-700'
                                : r.statusKenaikan === 'Tinggal Kelas'
                                ? 'border-rose-300 text-rose-700 dark:text-rose-300 dark:border-rose-700'
                                : 'border-slate-300 text-slate-700'
                            }`}
                          >
                            <option value="Naik Kelas">Naik Kelas</option>
                            <option value="Tinggal Kelas">Tinggal Kelas</option>
                            <option value="Lulus">Lulus</option>
                            <option value="Tidak Lulus">Tidak Lulus</option>
                            <option value="Belum Ditentukan">Belum Ditentukan</option>
                          </select>
                        </td>

                        <td className="py-2.5 px-3">
                          <input
                            type="text"
                            disabled={r.statusKenaikan !== 'Naik Kelas'}
                            value={r.targetKelas || bulkTargetKelas}
                            onChange={e => {
                              const next = e.target.value;
                              updateStudentReport(s.id, {
                                targetKelas: next,
                                keteranganKenaikan:
                                  r.statusKenaikan === 'Naik Kelas'
                                    ? `Berdasarkan pencapaian seluruh tujuan pembelajaran pada Tahun Ajaran ${schoolInfo.academicYear}, ananda dinyatakan: NAIK KE KELAS ${next.toUpperCase()}`
                                    : r.keteranganKenaikan
                              });
                            }}
                            className="w-full py-1.5 px-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium text-slate-800 dark:text-slate-200 outline-none disabled:opacity-50"
                            placeholder="Target Kelas..."
                          />
                        </td>

                        <td className="py-2.5 px-3 text-[11px] text-slate-600 dark:text-slate-400">
                          <p className="line-clamp-2 leading-relaxed">
                            {r.keteranganKenaikan || '-'}
                          </p>
                        </td>

                        <td className="py-2.5 px-3 text-center">
                          <button
                            type="button"
                            onClick={() => setEditingStudent(s)}
                            className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors"
                          >
                            Edit Lengkap
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 7. Official Signature Footer Block (Muncul di Pratinjau Layar & Cetak) */}
      <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-xs print:shadow-none print:border-t print:border-black print:rounded-none print:p-0 print:bg-transparent">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100 dark:border-slate-800 print:hidden">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
              <span>Tempat & Tanggal Leger: Sama dengan Rapor</span>
            </span>
            <span className="text-xs text-slate-700 dark:text-slate-300 font-semibold">
              ({activeLegerDate})
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              setPrintLegerPeriod(activePeriod);
              setIsPrintLegerOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 text-blue-700 dark:text-blue-300 text-xs font-bold border border-blue-200 dark:border-blue-800 transition-colors"
          >
            <Printer className="h-3.5 w-3.5" />
            <span>Pratinjau & Cetak Leger Resmi</span>
          </button>
        </div>

        <div className="grid grid-cols-2 text-center text-xs text-black dark:text-slate-200 print:text-black">
          <div>
            <p className="text-slate-600 dark:text-slate-400 print:text-black">Mengetahui,</p>
            <p className="font-bold text-slate-900 dark:text-white print:text-black">Kepala {schoolInfo.schoolName}</p>
            <div className="h-16 sm:h-20" />
            <p className="font-bold uppercase underline text-slate-900 dark:text-white print:text-black">
              {schoolInfo.headmasterName || 'NAMA KEPALA SEKOLAH'}
            </p>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 print:text-black font-mono">
              NIP. {schoolInfo.headmasterNip || '-'}
            </p>
          </div>

          <div>
            <p className="font-medium text-slate-800 dark:text-slate-200 print:text-black">
              {activeLegerDate}
            </p>
            <p className="font-bold text-slate-900 dark:text-white print:text-black">Guru Kelas / Wali Kelas {schoolInfo.className}</p>
            <div className="h-16 sm:h-20" />
            <p className="font-bold uppercase underline text-slate-900 dark:text-white print:text-black">
              {schoolInfo.homeroomTeacherName || 'NAMA GURU WALI KELAS'}
            </p>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 print:text-black font-mono">
              NIP. {schoolInfo.homeroomTeacherNip || '-'}
            </p>
          </div>
        </div>
      </div>

      {/* 8. Bulk Kenaikan Modal */}
      {isBulkModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3 text-emerald-600 dark:text-emerald-400 mb-4">
              <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50">
                <GraduationCap className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Set Status Kenaikan Se-Kelas
                </h3>
                <p className="text-xs text-slate-500">Terapkan serentak untuk seluruh {students.length} siswa</p>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  Pilih Status Kenaikan:
                </label>
                <select
                  value={bulkStatus}
                  onChange={e => setBulkStatus(e.target.value as KenaikanStatus)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none font-bold"
                >
                  <option value="Naik Kelas">Naik Kelas (Semua Siswa)</option>
                  <option value="Lulus">Lulus (Tamat Jenjang SD)</option>
                  <option value="Tinggal Kelas">Tinggal Kelas</option>
                  <option value="Belum Ditentukan">Belum Ditentukan</option>
                </select>
              </div>

              {bulkStatus === 'Naik Kelas' && (
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Target Kelas Tujuan:
                  </label>
                  <input
                    type="text"
                    value={bulkTargetKelas}
                    onChange={e => setBulkTargetKelas(e.target.value)}
                    placeholder="Contoh: V (Lima) / VI (Enam)"
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none font-bold"
                  />
                </div>
              )}

              <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200">
                <p className="text-[11px] leading-relaxed">
                  Aksi ini akan memperbarui status keputusan kenaikan dan narasi otomatis seluruh {students.length} peserta didik. Anda tetap dapat mengedit siswa tertentu secara individual setelahnya.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 mt-6">
              <button
                type="button"
                onClick={() => setIsBulkModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleApplyBulk}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md active:scale-95 transition-all"
              >
                Terapkan Massal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 9. Modal Detail Rincian Nilai Siswa */}
      {detailStudent && (
        <ModalDetailNilaiSiswa
          isOpen={!!detailStudent}
          onClose={() => setDetailStudent(null)}
          student={detailStudent}
          onSelectNextStudent={() => {
            const currentIdx = students.findIndex(s => s.id === detailStudent.id);
            if (currentIdx >= 0 && currentIdx < students.length - 1) {
              setDetailStudent(students[currentIdx + 1]);
            }
          }}
          onSelectPrevStudent={() => {
            const currentIdx = students.findIndex(s => s.id === detailStudent.id);
            if (currentIdx > 0) {
              setDetailStudent(students[currentIdx - 1]);
            }
          }}
          onOpenEditRapor={() => {
            const target = detailStudent;
            setDetailStudent(null);
            setEditingStudent(target);
          }}
          onOpenFullRapor={() => {
            const target = detailStudent;
            setDetailStudent(null);
            onSelectStudentForReport(target);
          }}
        />
      )}

      {/* 10. Modal Edit Rapor Siswa */}
      {editingStudent && (
        <ModalEditRaporSiswa
          isOpen={!!editingStudent}
          onClose={() => setEditingStudent(null)}
          student={editingStudent}
        />
      )}

      {/* 11. Modal Cetak Leger & Ranking Se-Kelas */}
      {isPrintLegerOpen && (
        <ModalCetakLeger
          isOpen={isPrintLegerOpen}
          onClose={() => setIsPrintLegerOpen(false)}
          defaultMode={printLegerMode}
          defaultPeriod={printLegerPeriod}
        />
      )}
    </div>
  );
};
