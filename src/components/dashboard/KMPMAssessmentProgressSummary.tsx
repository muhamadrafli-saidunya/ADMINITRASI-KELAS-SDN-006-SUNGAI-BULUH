import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Student, Subject, GradeRecord, normalizeSemester } from '../../types';
import { ModalDetailNilaiSiswa } from '../raport/ModalDetailNilaiSiswa';
import {
  BrainCircuit,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  BarChart3,
  Sparkles,
  GraduationCap,
  Search,
  Filter,
  ArrowUpRight,
  Users,
  Target,
  Award,
  BookOpen,
  Layers,
  ChevronRight,
  RefreshCw,
  FileSpreadsheet,
  CheckCheck,
  Activity,
  Lightbulb,
  SlidersHorizontal,
  ChevronDown,
  ArrowUpDown,
  UserCheck,
  FileText
} from 'lucide-react';

export const KMPMAssessmentProgressSummary: React.FC = () => {
  const {
    students,
    subjects,
    grades,
    schoolInfo,
    setCurrentTab,
    tujuanPembelajaranList
  } = useApp();

  const safeStudents = students || [];
  const safeSubjects = subjects || [];
  const safeGrades = grades || [];
  const safeTPs = tujuanPembelajaranList || [];

  // Local Tab Selection
  const [activeTab, setActiveTab] = useState<'matriks_siswa' | 'analisis_mapel' | 'intervensi_diferensiasi'>('matriks_siswa');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'mahir' | 'cakap' | 'layak' | 'intervensi' | 'incomplete'>('all');
  const [subjectFilter, setSubjectFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'rank_desc' | 'rank_asc' | 'progress_desc' | 'name_asc'>('rank_desc');

  // Selected Student for Detail Modal
  const [selectedStudentForModal, setSelectedStudentForModal] = useState<Student | null>(null);

  // -------------------------------------------------------------
  // Calculations: Real-time KMPM Progress Across All Students
  // -------------------------------------------------------------
  const totalStudents = safeStudents.length;
  const totalSubjects = safeSubjects.length;

  // Formatif assessment types (usually TP1, TP2, TP3, TP4)
  const formatifTypes = ['Formatif_TP1', 'Formatif_TP2', 'Formatif_TP3', 'Formatif_TP4'];
  const expectedAssessmentsPerSubject = formatifTypes.length + 2; // Formatif TPs + STS + SAS = 6
  const totalExpectedPerStudent = totalSubjects * expectedAssessmentsPerSubject;
  const totalExpectedClassAssessments = totalStudents * totalExpectedPerStudent;

  // Student-by-student compiled progress
  const studentMetrics = useMemo(() => {
    const activeSem = normalizeSemester(schoolInfo.semester);
    return safeStudents.map((student, idx) => {
      const studentGrades = safeGrades.filter(
        g => g.siswaId === student.id && normalizeSemester(g.semester) === activeSem
      );
      const totalGradesFilled = studentGrades.length;
      const progressPercent = totalExpectedPerStudent > 0 
        ? Math.min(100, Math.round((totalGradesFilled / totalExpectedPerStudent) * 100))
        : 100;

      // Subject summaries
      const subjectResults = safeSubjects.map(sub => {
        const subGrades = studentGrades.filter(g => g.mapelId === sub.id);
        const formatifs = subGrades.filter(g => g.jenis.startsWith('Formatif_'));
        const sts = subGrades.find(g => g.jenis === 'Sumatif_STS')?.nilai || 0;
        const sas = subGrades.find(g => g.jenis === 'Sumatif_SAS')?.nilai || 0;

        const formatifAvg = formatifs.length > 0 
          ? Math.round(formatifs.reduce((sum, g) => sum + g.nilai, 0) / formatifs.length) 
          : 0;

        // KMPM Standard Weight: 40% Formatif (proses mendalam) + 30% STS + 30% SAS
        let finalScore = 0;
        if (formatifs.length > 0 || sts > 0 || sas > 0) {
          finalScore = Math.round((formatifAvg * 0.4) + (sts * 0.3) + (sas * 0.3));
        }

        const isTuntas = finalScore >= (sub.kktp || 75);
        const isComplete = subGrades.length >= expectedAssessmentsPerSubject;

        return {
          subjectId: sub.id,
          subjectName: sub.nama,
          subjectCode: sub.kode,
          kktp: sub.kktp || 75,
          finalScore,
          formatifAvg,
          sts,
          sas,
          isTuntas,
          isComplete,
          gradesCount: subGrades.length
        };
      });

      // Overall average across subjects
      const validScores = subjectResults.filter(s => s.finalScore > 0);
      const overallAvg = validScores.length > 0 
        ? +(validScores.reduce((sum, s) => sum + s.finalScore, 0) / validScores.length).toFixed(1)
        : 0;

      // KMPM Predicate Level
      let predicate: 'Mahir' | 'Cakap' | 'Layak' | 'Perlu Bimbingan' = 'Perlu Bimbingan';
      let predicateColor = 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-800';
      if (overallAvg >= 90) {
        predicate = 'Mahir';
        predicateColor = 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800';
      } else if (overallAvg >= 80) {
        predicate = 'Cakap';
        predicateColor = 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
      } else if (overallAvg >= 70) {
        predicate = 'Layak';
        predicateColor = 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800';
      }

      const completedSubjectsCount = subjectResults.filter(s => s.isComplete).length;
      const tuntasSubjectsCount = subjectResults.filter(s => s.isTuntas).length;
      const needInterventionSubjects = subjectResults.filter(s => !s.isTuntas && s.finalScore > 0);

      // Formatif overall average
      const allFormatifs = studentGrades.filter(g => g.jenis.startsWith('Formatif_'));
      const formatifClassAvg = allFormatifs.length > 0 
        ? Math.round(allFormatifs.reduce((sum, g) => sum + g.nilai, 0) / allFormatifs.length)
        : 0;

      // STS overall average
      const allSTS = studentGrades.filter(g => g.jenis === 'Sumatif_STS');
      const stsClassAvg = allSTS.length > 0 
        ? Math.round(allSTS.reduce((sum, g) => sum + g.nilai, 0) / allSTS.length)
        : 0;

      // SAS overall average
      const allSAS = studentGrades.filter(g => g.jenis === 'Sumatif_SAS');
      const sasClassAvg = allSAS.length > 0 
        ? Math.round(allSAS.reduce((sum, g) => sum + g.nilai, 0) / allSAS.length)
        : 0;

      return {
        student,
        totalGradesFilled,
        progressPercent,
        overallAvg,
        predicate,
        predicateColor,
        subjectResults,
        completedSubjectsCount,
        tuntasSubjectsCount,
        needInterventionSubjects,
        formatifAvg: formatifClassAvg,
        stsAvg: stsClassAvg,
        sasAvg: sasClassAvg,
        isFullyComplete: progressPercent >= 95,
        isAllTuntas: tuntasSubjectsCount === totalSubjects && totalSubjects > 0
      };
    });
  }, [safeStudents, safeSubjects, safeGrades, totalExpectedPerStudent, totalSubjects, expectedAssessmentsPerSubject]);

  // Aggregate Class KPIs
  const classAggregate = useMemo(() => {
    const totalFilledGrades = safeGrades.length;
    const completionRate = totalExpectedClassAssessments > 0 
      ? Math.min(100, Math.round((totalFilledGrades / totalExpectedClassAssessments) * 100))
      : 100;

    const allAverages = studentMetrics.map(m => m.overallAvg).filter(avg => avg > 0);
    const classAvg = allAverages.length > 0 
      ? +(allAverages.reduce((a, b) => a + b, 0) / allAverages.length).toFixed(1)
      : 85.0;

    const mahirCount = studentMetrics.filter(m => m.predicate === 'Mahir').length;
    const cakapCount = studentMetrics.filter(m => m.predicate === 'Cakap').length;
    const layakCount = studentMetrics.filter(m => m.predicate === 'Layak').length;
    const intervensiCount = studentMetrics.filter(m => m.predicate === 'Perlu Bimbingan' || m.needInterventionSubjects.length > 0).length;

    const allTuntasCount = studentMetrics.filter(m => m.isAllTuntas).length;
    const tuntasRate = totalStudents > 0 ? Math.round((allTuntasCount / totalStudents) * 100) : 100;

    const fullyCompletedStudents = studentMetrics.filter(m => m.isFullyComplete).length;
    const reportReadyRate = totalStudents > 0 ? Math.round((fullyCompletedStudents / totalStudents) * 100) : 100;

    // Stage level calculations
    const formatifGrades = safeGrades.filter(g => g.jenis.startsWith('Formatif_'));
    const totalExpectedFormatif = totalStudents * totalSubjects * formatifTypes.length;
    const formatifProgress = totalExpectedFormatif > 0 
      ? Math.min(100, Math.round((formatifGrades.length / totalExpectedFormatif) * 100))
      : 100;
    const formatifAvg = formatifGrades.length > 0 
      ? Math.round(formatifGrades.reduce((sum, g) => sum + g.nilai, 0) / formatifGrades.length)
      : 84;

    const stsGrades = safeGrades.filter(g => g.jenis === 'Sumatif_STS');
    const totalExpectedSTS = totalStudents * totalSubjects;
    const stsProgress = totalExpectedSTS > 0 
      ? Math.min(100, Math.round((stsGrades.length / totalExpectedSTS) * 100))
      : 100;
    const stsAvg = stsGrades.length > 0 
      ? Math.round(stsGrades.reduce((sum, g) => sum + g.nilai, 0) / stsGrades.length)
      : 85;

    const sasGrades = safeGrades.filter(g => g.jenis === 'Sumatif_SAS');
    const totalExpectedSAS = totalStudents * totalSubjects;
    const sasProgress = totalExpectedSAS > 0 
      ? Math.min(100, Math.round((sasGrades.length / totalExpectedSAS) * 100))
      : 100;
    const sasAvg = sasGrades.length > 0 
      ? Math.round(sasGrades.reduce((sum, g) => sum + g.nilai, 0) / sasGrades.length)
      : 86;

    return {
      totalFilledGrades,
      totalExpectedClassAssessments,
      completionRate,
      classAvg,
      mahirCount,
      cakapCount,
      layakCount,
      intervensiCount,
      allTuntasCount,
      tuntasRate,
      reportReadyRate,
      fullyCompletedStudents,
      formatifProgress,
      formatifAvg,
      stsProgress,
      stsAvg,
      sasProgress,
      sasAvg
    };
  }, [safeGrades, totalExpectedClassAssessments, studentMetrics, totalStudents, totalSubjects, formatifTypes.length]);

  // Subject Metrics
  const subjectMetrics = useMemo(() => {
    return safeSubjects.map(sub => {
      const subGrades = safeGrades.filter(g => g.mapelId === sub.id);
      const expectedTotal = totalStudents * expectedAssessmentsPerSubject;
      const progressPercent = expectedTotal > 0 
        ? Math.min(100, Math.round((subGrades.length / expectedTotal) * 100))
        : 100;

      const formatifs = subGrades.filter(g => g.jenis.startsWith('Formatif_'));
      const formatifAvg = formatifs.length > 0 
        ? Math.round(formatifs.reduce((sum, g) => sum + g.nilai, 0) / formatifs.length)
        : 0;

      const sts = subGrades.filter(g => g.jenis === 'Sumatif_STS');
      const stsAvg = sts.length > 0 
        ? Math.round(sts.reduce((sum, g) => sum + g.nilai, 0) / sts.length)
        : 0;

      const sas = subGrades.filter(g => g.jenis === 'Sumatif_SAS');
      const sasAvg = sas.length > 0 
        ? Math.round(sas.reduce((sum, g) => sum + g.nilai, 0) / sas.length)
        : 0;

      // Overall final scores per student for this subject
      const studentFinals = safeStudents.map(st => {
        const stSubGrades = subGrades.filter(g => g.siswaId === st.id);
        const stF = stSubGrades.filter(g => g.jenis.startsWith('Formatif_'));
        const stSTS = stSubGrades.find(g => g.jenis === 'Sumatif_STS')?.nilai || 0;
        const stSAS = stSubGrades.find(g => g.jenis === 'Sumatif_SAS')?.nilai || 0;

        const fAvg = stF.length > 0 ? Math.round(stF.reduce((s, g) => s + g.nilai, 0) / stF.length) : 0;
        let final = 0;
        if (stF.length > 0 || stSTS > 0 || stSAS > 0) {
          final = Math.round((fAvg * 0.4) + (stSTS * 0.3) + (stSAS * 0.3));
        }
        return { student: st, final, isTuntas: final >= (sub.kktp || 75) };
      });

      const avgFinal = studentFinals.length > 0 
        ? Math.round(studentFinals.reduce((sum, s) => sum + s.final, 0) / studentFinals.length)
        : 80;

      const tuntasStudents = studentFinals.filter(s => s.isTuntas && s.final > 0);
      const needInterventionStudents = studentFinals.filter(s => !s.isTuntas && s.final > 0);
      const tuntasRate = totalStudents > 0 ? Math.round((tuntasStudents.length / totalStudents) * 100) : 100;

      return {
        subject: sub,
        progressPercent,
        avgFinal,
        formatifAvg,
        stsAvg,
        sasAvg,
        tuntasRate,
        tuntasCount: tuntasStudents.length,
        interventionCount: needInterventionStudents.length,
        interventionList: needInterventionStudents
      };
    });
  }, [safeSubjects, safeGrades, totalStudents, expectedAssessmentsPerSubject, safeStudents]);

  // Filtered and Sorted Students
  const filteredStudents = useMemo(() => {
    let list = [...studentMetrics];

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(m => 
        m.student.nama.toLowerCase().includes(q) ||
        m.student.nisn?.toLowerCase().includes(q) ||
        m.student.nis?.toLowerCase().includes(q)
      );
    }

    // Status / Predicate filter
    if (statusFilter === 'mahir') {
      list = list.filter(m => m.predicate === 'Mahir');
    } else if (statusFilter === 'cakap') {
      list = list.filter(m => m.predicate === 'Cakap');
    } else if (statusFilter === 'layak') {
      list = list.filter(m => m.predicate === 'Layak');
    } else if (statusFilter === 'intervensi') {
      list = list.filter(m => m.predicate === 'Perlu Bimbingan' || m.needInterventionSubjects.length > 0);
    } else if (statusFilter === 'incomplete') {
      list = list.filter(m => !m.isFullyComplete);
    }

    // Subject specific filter
    if (subjectFilter !== 'all') {
      list = list.filter(m => {
        const subRes = m.subjectResults.find(s => s.subjectId === subjectFilter);
        return subRes && subRes.finalScore > 0;
      });
    }

    // Sorting
    list.sort((a, b) => {
      if (sortBy === 'rank_desc') return b.overallAvg - a.overallAvg;
      if (sortBy === 'rank_asc') return a.overallAvg - b.overallAvg;
      if (sortBy === 'progress_desc') return b.progressPercent - a.progressPercent;
      if (sortBy === 'name_asc') return a.student.nama.localeCompare(b.student.nama);
      return 0;
    });

    return list;
  }, [studentMetrics, searchQuery, statusFilter, subjectFilter, sortBy]);

  // Students requiring deep learning intervention
  const interventionStudents = useMemo(() => {
    return studentMetrics.filter(m => m.needInterventionSubjects.length > 0 || m.predicate === 'Perlu Bimbingan');
  }, [studentMetrics]);

  // Students ready for advanced enrichment (Mahir)
  const enrichmentStudents = useMemo(() => {
    return studentMetrics.filter(m => m.predicate === 'Mahir');
  }, [studentMetrics]);

  return (
    <div className="space-y-5">
      {/* 1. KMPM Header & Real-Time Sync Banner */}
      <div className="rounded-3xl border border-indigo-200/80 dark:border-indigo-900/60 bg-gradient-to-br from-indigo-900 via-blue-900 to-slate-900 text-white p-5 sm:p-6 shadow-md relative overflow-hidden">
        {/* Glow decoration */}
        <div className="absolute -right-10 -top-10 h-44 w-44 rounded-full bg-blue-500/20 blur-2xl pointer-events-none" />
        <div className="absolute right-40 -bottom-10 h-36 w-36 rounded-full bg-indigo-500/20 blur-xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                Real-Time Asesmen KMPM
              </span>
              <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white/10 text-white border border-white/15">
                {schoolInfo.phase || 'Fase B (Kelas IV)'} &bull; {schoolInfo.className}
              </span>
              <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white/10 text-blue-200 border border-white/15">
                Semester {schoolInfo.semester}
              </span>
            </div>

            <h2 className="text-lg sm:text-xl font-black tracking-tight text-white flex items-center gap-2">
              <BrainCircuit className="h-5 w-5 text-indigo-400" />
              Progres Asesmen Pembelajaran Mendalam (KMPM)
            </h2>
            <p className="text-xs sm:text-[13px] text-blue-100/90 leading-relaxed">
              Monitoring real-time ketercapaian asesmen proses (formatif bermakna), sumatif tengah semester (ASTS), dan sumatif akhir (SAS) seluruh peserta didik kelas {schoolInfo.className}.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={() => setCurrentTab('nilai')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white text-blue-900 hover:bg-blue-50 text-xs font-bold transition-all shadow-sm active:scale-95"
            >
              <GraduationCap className="h-4 w-4 text-blue-600" />
              <span>Input / Edit Nilai</span>
            </button>
            <button
              onClick={() => setCurrentTab('raport')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-sm active:scale-95"
            >
              <FileSpreadsheet className="h-4 w-4 text-indigo-200" />
              <span>Cetak Rapor KMPM</span>
            </button>
          </div>
        </div>

        {/* 4 Core KMPM Live Metrics Bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-5 pt-4 border-t border-white/15">
          {/* Metric 1 */}
          <div className="rounded-2xl bg-white/10 backdrop-blur-xs p-3 border border-white/10">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-200 flex items-center gap-1">
              <Activity className="h-3.5 w-3.5 text-emerald-400" />
              Kelengkapan Asesmen
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-xl sm:text-2xl font-black text-white">
                {classAggregate.completionRate}%
              </span>
              <span className="text-[11px] text-emerald-300 font-semibold">
                {classAggregate.totalFilledGrades}/{classAggregate.totalExpectedClassAssessments} Terisi
              </span>
            </div>
            <div className="w-full bg-white/20 h-1.5 rounded-full mt-2 overflow-hidden">
              <div 
                className="bg-emerald-400 h-full rounded-full transition-all duration-500" 
                style={{ width: `${classAggregate.completionRate}%` }} 
              />
            </div>
          </div>

          {/* Metric 2 */}
          <div className="rounded-2xl bg-white/10 backdrop-blur-xs p-3 border border-white/10">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-200 flex items-center gap-1">
              <Sparkles className="h-3.5 w-3.5 text-indigo-300" />
              Rerata KMPM Kelas
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-xl sm:text-2xl font-black text-white">
                {classAggregate.classAvg}
              </span>
              <span className="text-[11px] text-blue-200 font-semibold">
                Skala 100 &bull; Predikat B+
              </span>
            </div>
            <p className="text-[10px] text-blue-200/80 mt-1.5 truncate">
              {classAggregate.mahirCount} Mahir &bull; {classAggregate.cakapCount} Cakap
            </p>
          </div>

          {/* Metric 3 */}
          <div className="rounded-2xl bg-white/10 backdrop-blur-xs p-3 border border-white/10">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-200 flex items-center gap-1">
              <Target className="h-3.5 w-3.5 text-amber-300" />
              Ketuntasan KKTP
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-xl sm:text-2xl font-black text-white">
                {classAggregate.tuntasRate}%
              </span>
              <span className="text-[11px] text-amber-300 font-semibold">
                {classAggregate.allTuntasCount}/{totalStudents} Siswa
              </span>
            </div>
            <p className="text-[10px] text-blue-200/80 mt-1.5 truncate">
              {classAggregate.intervensiCount > 0 
                ? `${classAggregate.intervensiCount} siswa perlu perancah` 
                : 'Semua siswa tuntas KKTP'}
            </p>
          </div>

          {/* Metric 4 */}
          <div className="rounded-2xl bg-white/10 backdrop-blur-xs p-3 border border-white/10">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-200 flex items-center gap-1">
              <CheckCheck className="h-3.5 w-3.5 text-teal-300" />
              Kesiapan Rapor KMPM
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-xl sm:text-2xl font-black text-white">
                {classAggregate.reportReadyRate}%
              </span>
              <span className="text-[11px] text-teal-300 font-semibold">
                {classAggregate.fullyCompletedStudents}/{totalStudents} Siap Cetak
              </span>
            </div>
            <p className="text-[10px] text-blue-200/80 mt-1.5 truncate">
              {totalStudents - classAggregate.fullyCompletedStudents > 0 
                ? `${totalStudents - classAggregate.fullyCompletedStudents} siswa menunggu nilai akhir`
                : '100% Siap Dicetak'}
            </p>
          </div>
        </div>
      </div>

      {/* 2. Three-Stage KMPM Assessment Flow (Formatif, STS, SAS) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Stage 1: Formatif (Proses & Refleksi Pembelajaran Mendalam) */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs font-black">
                1
              </span>
              <div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                  Asesmen Formatif (TP 1 - 4)
                </h3>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">
                  Refleksi & proses pembelajaran mendalam
                </p>
              </div>
            </div>
            <span className="text-xs font-black text-blue-600 dark:text-blue-400">
              {classAggregate.formatifProgress}%
            </span>
          </div>

          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden mb-2.5">
            <div 
              className="bg-blue-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${classAggregate.formatifProgress}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
            <span>Rerata Nilai Formatif:</span>
            <span className="font-bold text-slate-900 dark:text-white">
              {classAggregate.formatifAvg} / 100
            </span>
          </div>
        </div>

        {/* Stage 2: Sumatif Tengah Semester (ASTS) */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 text-xs font-black">
                2
              </span>
              <div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                  Sumatif Tengah Semester (ASTS)
                </h3>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">
                  Uji pemahaman konsep mendalam ASTS
                </p>
              </div>
            </div>
            <span className="text-xs font-black text-amber-600 dark:text-amber-400">
              {classAggregate.stsProgress}%
            </span>
          </div>

          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden mb-2.5">
            <div 
              className="bg-amber-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${classAggregate.stsProgress}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
            <span>Rerata Nilai STS:</span>
            <span className="font-bold text-slate-900 dark:text-white">
              {classAggregate.stsAvg} / 100
            </span>
          </div>
        </div>

        {/* Stage 3: Sumatif Akhir Semester (SAS / SAT) */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-xs font-black">
                3
              </span>
              <div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                  Sumatif Akhir Semester (SAS)
                </h3>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">
                  Capaian akhir kompetensi & rapor
                </p>
              </div>
            </div>
            <span className="text-xs font-black text-indigo-600 dark:text-indigo-400">
              {classAggregate.sasProgress}%
            </span>
          </div>

          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden mb-2.5">
            <div 
              className="bg-indigo-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${classAggregate.sasProgress}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
            <span>Rerata Nilai SAS:</span>
            <span className="font-bold text-slate-900 dark:text-white">
              {classAggregate.sasAvg} / 100
            </span>
          </div>
        </div>
      </div>

      {/* 3. Interactive Main Section (Tabs: Matriks Siswa, Analisis Mapel, Diferensiasi) */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs overflow-hidden">
        {/* Navigation Sub-Tabs */}
        <div className="border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 pt-4 flex flex-wrap items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-800/30">
          <div className="flex items-center gap-2 overflow-x-auto pb-3 sm:pb-0">
            <button
              onClick={() => setActiveTab('matriks_siswa')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'matriks_siswa'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Users className="h-4 w-4" />
              <span>Matriks Progres Siswa</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                activeTab === 'matriks_siswa' ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
              }`}>
                {totalStudents}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('analisis_mapel')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'analisis_mapel'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <BarChart3 className="h-4 w-4" />
              <span>Analisis per Mata Pelajaran</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                activeTab === 'analisis_mapel' ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
              }`}>
                {totalSubjects}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('intervensi_diferensiasi')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'intervensi_diferensiasi'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Lightbulb className="h-4 w-4" />
              <span>Diferensiasi & Intervensi KMPM</span>
              {interventionStudents.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-rose-500 text-white font-extrabold">
                  {interventionStudents.length}
                </span>
              )}
            </button>
          </div>

          <div className="pb-3 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              Standar Capaian Pembelajaran Mendalam
            </span>
          </div>
        </div>

        {/* Tab 1: Matriks Progres Siswa */}
        {activeTab === 'matriks_siswa' && (
          <div className="p-4 sm:p-6 space-y-4">
            {/* Search, Status Filter & Sorting Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari siswa berdasarkan nama atau NIS..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:border-indigo-500"
                />
              </div>

              {/* Filters & Sorting */}
              <div className="flex flex-wrap items-center gap-2">
                {/* Status Filter */}
                <select
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value as any)}
                  className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-hidden focus:border-indigo-500"
                >
                  <option value="all">Semua Status Tingkat</option>
                  <option value="mahir">Tingkat Mahir (≥90)</option>
                  <option value="cakap">Tingkat Cakap (80-89)</option>
                  <option value="layak">Tingkat Layak (70-79)</option>
                  <option value="intervensi">Butuh Intervensi / Perancah</option>
                  <option value="incomplete">Nilai Belum Lengkap</option>
                </select>

                {/* Mapel Filter */}
                <select
                  value={subjectFilter}
                  onChange={e => setSubjectFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-hidden focus:border-indigo-500"
                >
                  <option value="all">Semua Mata Pelajaran</option>
                  {safeSubjects.map(s => (
                    <option key={s.id} value={s.id}>{s.nama}</option>
                  ))}
                </select>

                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value as any)}
                  className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-hidden focus:border-indigo-500"
                >
                  <option value="rank_desc">Nilai Rata-rata Tertinggi</option>
                  <option value="rank_asc">Nilai Rata-rata Terendah</option>
                  <option value="progress_desc">Kelengkapan Asesmen</option>
                  <option value="name_asc">Nama Siswa (A-Z)</option>
                </select>
              </div>
            </div>

            {/* List / Table of Students */}
            <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-bold uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-3.5 text-center w-12">No</th>
                    <th className="py-3 px-3.5">Peserta Didik</th>
                    <th className="py-3 px-3.5 w-48">Kelengkapan Nilai</th>
                    <th className="py-3 px-3.5 text-center">Formatif</th>
                    <th className="py-3 px-3.5 text-center">STS</th>
                    <th className="py-3 px-3.5 text-center">SAS</th>
                    <th className="py-3 px-3.5 text-center">Rerata Akhir</th>
                    <th className="py-3 px-3.5 text-center">Tingkat KMPM</th>
                    <th className="py-3 px-3.5 text-center">Ketuntasan</th>
                    <th className="py-3 px-3.5 text-right w-32">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="py-8 text-center text-slate-400 dark:text-slate-500 text-xs">
                        Tidak ada siswa yang sesuai dengan filter pencarian.
                      </td>
                    </tr>
                  ) : (
                    filteredStudents.map((metric, idx) => {
                      const { student } = metric;
                      return (
                        <tr
                          key={student.id}
                          className="hover:bg-indigo-50/30 dark:hover:bg-indigo-950/20 transition-colors"
                        >
                          {/* Rank / Index */}
                          <td className="py-3 px-3.5 text-center font-bold text-slate-500">
                            {idx + 1}
                          </td>

                          {/* Student Info */}
                          <td className="py-3 px-3.5">
                            <div className="flex items-center gap-2.5">
                              {student.foto ? (
                                <img
                                  src={student.foto}
                                  alt={student.nama}
                                  referrerPolicy="no-referrer"
                                  className="h-8 w-8 rounded-full object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                                />
                              ) : (
                                <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold flex items-center justify-center text-[11px] shrink-0">
                                  {student.nama.charAt(0)}
                                </div>
                              )}
                              <div className="min-w-0">
                                <p className="font-bold text-slate-900 dark:text-white truncate">
                                  {student.nama}
                                </p>
                                <p className="text-[10.5px] text-slate-500 dark:text-slate-400">
                                  NIS: {student.nis || '-'} &bull; Absen {student.nomorAbsen}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* Assessment Progress */}
                          <td className="py-3 px-3.5">
                            <div className="space-y-1">
                              <div className="flex items-center justify-between text-[11px]">
                                <span className="font-semibold text-slate-700 dark:text-slate-300">
                                  {metric.progressPercent}%
                                </span>
                                <span className="text-slate-400 text-[10px]">
                                  {metric.totalGradesFilled}/{totalExpectedPerStudent} Nilai
                                </span>
                              </div>
                              <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full transition-all ${
                                    metric.progressPercent >= 90
                                      ? 'bg-emerald-500'
                                      : metric.progressPercent >= 70
                                      ? 'bg-blue-500'
                                      : 'bg-amber-500'
                                  }`}
                                  style={{ width: `${metric.progressPercent}%` }}
                                />
                              </div>
                            </div>
                          </td>

                          {/* Formatif Avg */}
                          <td className="py-3 px-3.5 text-center font-semibold text-slate-700 dark:text-slate-300">
                            {metric.formatifAvg || '-'}
                          </td>

                          {/* STS */}
                          <td className="py-3 px-3.5 text-center font-semibold text-slate-700 dark:text-slate-300">
                            {metric.stsAvg || '-'}
                          </td>

                          {/* SAS */}
                          <td className="py-3 px-3.5 text-center font-semibold text-slate-700 dark:text-slate-300">
                            {metric.sasAvg || '-'}
                          </td>

                          {/* Nilai Rerata Akhir */}
                          <td className="py-3 px-3.5 text-center">
                            <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                              {metric.overallAvg}
                            </span>
                          </td>

                          {/* Tingkat KMPM Predicate */}
                          <td className="py-3 px-3.5 text-center">
                            <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10.5px] font-bold border ${metric.predicateColor}`}>
                              {metric.predicate}
                            </span>
                          </td>

                          {/* Ketuntasan */}
                          <td className="py-3 px-3.5 text-center">
                            {metric.isAllTuntas ? (
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                                <CheckCircle2 className="h-3.5 w-3.5" />
                                {metric.tuntasSubjectsCount}/{totalSubjects} Mapel
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 dark:text-amber-400" title={`${metric.needInterventionSubjects.length} mapel perlu pendampingan`}>
                                <AlertTriangle className="h-3.5 w-3.5" />
                                {metric.tuntasSubjectsCount}/{totalSubjects} Tuntas
                              </span>
                            )}
                          </td>

                          {/* Quick Actions */}
                          <td className="py-3 px-3.5 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => setSelectedStudentForModal(student)}
                                className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-300 text-[11px] font-bold transition-all"
                                title="Lihat rincian nilai per mata pelajaran"
                              >
                                Rincian
                              </button>
                              <button
                                onClick={() => setCurrentTab('raport')}
                                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white transition-all"
                                title="Buka lembar cetak rapor siswa"
                              >
                                <FileSpreadsheet className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Analisis per Mata Pelajaran */}
        {activeTab === 'analisis_mapel' && (
          <div className="p-4 sm:p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {subjectMetrics.map(subMetric => {
                const { subject } = subMetric;
                return (
                  <div
                    key={subject.id}
                    className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4.5 shadow-xs space-y-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                          {subject.kode} &bull; KKTP {subject.kktp}
                        </span>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                          {subject.nama}
                        </h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          Guru: {subject.guruPengampu || '-'}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-base font-black text-slate-900 dark:text-white">
                          {subMetric.avgFinal}
                        </span>
                        <span className="block text-[10px] text-slate-400">
                          Rerata Mapel
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar of Filled Grades */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-500 dark:text-slate-400">
                          Kelengkapan Nilai
                        </span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                          {subMetric.progressPercent}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                          style={{ width: `${subMetric.progressPercent}%` }}
                        />
                      </div>
                    </div>

                    {/* Three Breakdown Mini Pills */}
                    <div className="grid grid-cols-3 gap-1.5 pt-2 border-t border-slate-100 dark:border-slate-800 text-center">
                      <div className="p-1.5 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                        <span className="block text-[9.5px] text-slate-400">Formatif</span>
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                          {subMetric.formatifAvg}
                        </span>
                      </div>
                      <div className="p-1.5 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                        <span className="block text-[9.5px] text-slate-400">STS</span>
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                          {subMetric.stsAvg}
                        </span>
                      </div>
                      <div className="p-1.5 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                        <span className="block text-[9.5px] text-slate-400">SAS</span>
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                          {subMetric.sasAvg}
                        </span>
                      </div>
                    </div>

                    {/* Ketuntasan Status & Link */}
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        {subMetric.tuntasCount}/{totalStudents} Tuntas ({subMetric.tuntasRate}%)
                      </span>

                      <button
                        onClick={() => setCurrentTab('nilai')}
                        className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-0.5"
                      >
                        <span>Input Nilai</span>
                        <ArrowUpRight className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 3: Diferensiasi & Intervensi KMPM */}
        {activeTab === 'intervensi_diferensiasi' && (
          <div className="p-4 sm:p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Box 1: Siswa Butuh Pendampingan / Perancah (Scaffolding) */}
              <div className="rounded-2xl border border-rose-200 dark:border-rose-900/40 bg-rose-50/40 dark:bg-rose-950/20 p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-rose-100 dark:bg-rose-900/50 text-rose-700 dark:text-rose-300">
                      <AlertTriangle className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-rose-900 dark:text-rose-200">
                        Siswa Butuh Intervensi & Perancah
                      </h4>
                      <p className="text-xs text-rose-700 dark:text-rose-300">
                        {interventionStudents.length} peserta didik memerlukan bimbingan konsep mendalam
                      </p>
                    </div>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-200 text-rose-800 dark:bg-rose-900 dark:text-rose-200">
                    Prioritas Pembelajaran
                  </span>
                </div>

                {interventionStudents.length === 0 ? (
                  <div className="p-4 rounded-xl bg-white dark:bg-slate-800 text-center text-xs text-slate-500">
                    Luar biasa! Seluruh peserta didik telah mencapai nilai di atas batas KKTP.
                  </div>
                ) : (
                  <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
                    {interventionStudents.map(m => (
                      <div
                        key={m.student.id}
                        className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-rose-100 dark:border-rose-900/30 flex items-center justify-between gap-3 shadow-2xs"
                      >
                        <div>
                          <p className="text-xs font-bold text-slate-900 dark:text-white">
                            {m.student.nama}
                          </p>
                          <p className="text-[11px] text-rose-600 dark:text-rose-400 font-medium">
                            Rerata: {m.overallAvg} &bull; Butuh bimbingan di: {m.needInterventionSubjects.map(s => s.subjectName).join(', ') || 'Pemahaman Dasar'}
                          </p>
                        </div>
                        <button
                          onClick={() => setSelectedStudentForModal(m.student)}
                          className="px-2.5 py-1 rounded-lg bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 text-[11px] font-bold hover:bg-rose-100 transition-all shrink-0"
                        >
                          Rencana Intervensi
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Pedagogical Tip for Scaffolding */}
                <div className="p-3 rounded-xl bg-white/70 dark:bg-slate-900/70 border border-rose-200/60 dark:border-rose-900/40 text-[11.5px] text-slate-700 dark:text-slate-300 leading-relaxed">
                  <strong>💡 Strategi Pembelajaran Mendalam (KMPM):</strong> Berikan bimbingan terstruktur dengan teknik scaffolding, gunakan media visual nyata/konkret, dan libatkan tutor sebaya untuk memperdalam pemahaman konsep kunci.
                </div>
              </div>

              {/* Box 2: Siswa Siap Pengayaan & Proyek Riset Mandiri (Tingkat Mahir) */}
              <div className="rounded-2xl border border-indigo-200 dark:border-indigo-900/40 bg-indigo-50/40 dark:bg-indigo-950/20 p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300">
                      <Award className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-indigo-900 dark:text-indigo-200">
                        Siswa Siap Pengayaan Mendalam
                      </h4>
                      <p className="text-xs text-indigo-700 dark:text-indigo-300">
                        {enrichmentStudents.length} peserta didik berpencapaian Mahir (≥90)
                      </p>
                    </div>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-200 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
                    Level Mahir
                  </span>
                </div>

                {enrichmentStudents.length === 0 ? (
                  <div className="p-4 rounded-xl bg-white dark:bg-slate-800 text-center text-xs text-slate-500">
                    Belum ada siswa yang mencapai predikat Mahir (≥90).
                  </div>
                ) : (
                  <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
                    {enrichmentStudents.map(m => (
                      <div
                        key={m.student.id}
                        className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-indigo-100 dark:border-indigo-900/30 flex items-center justify-between gap-3 shadow-2xs"
                      >
                        <div>
                          <p className="text-xs font-bold text-slate-900 dark:text-white">
                            {m.student.nama}
                          </p>
                          <p className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium">
                            Rerata: {m.overallAvg} &bull; Seluruh {m.tuntasSubjectsCount} mata pelajaran tuntas sempurna
                          </p>
                        </div>
                        <button
                          onClick={() => setSelectedStudentForModal(m.student)}
                          className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-[11px] font-bold hover:bg-indigo-100 transition-all shrink-0"
                        >
                          Lihat Prestasi
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Pedagogical Tip for Enrichment */}
                <div className="p-3 rounded-xl bg-white/70 dark:bg-slate-900/70 border border-indigo-200/60 dark:border-indigo-900/40 text-[11.5px] text-slate-700 dark:text-slate-300 leading-relaxed">
                  <strong>🚀 Strategi Pengayaan KMPM:</strong> Berikan tantangan penyelidikan kontekstual, pemecahan masalah multidisiplin, serta jadikan sebagai model tutor sebaya untuk memantik nalar kritis kelas.
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal Detail Nilai Siswa */}
      {selectedStudentForModal && (
        <ModalDetailNilaiSiswa
          isOpen={!!selectedStudentForModal}
          onClose={() => setSelectedStudentForModal(null)}
          student={selectedStudentForModal}
          onOpenFullRapor={() => {
            setSelectedStudentForModal(null);
            setCurrentTab('raport');
          }}
          onOpenEditRapor={() => {
            setSelectedStudentForModal(null);
            setCurrentTab('raport');
          }}
        />
      )}
    </div>
  );
};
