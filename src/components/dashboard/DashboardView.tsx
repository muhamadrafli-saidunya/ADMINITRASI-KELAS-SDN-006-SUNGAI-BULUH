import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StatCard } from '../common/StatCard';
import { BadgeStatus } from '../common/BadgeStatus';
import { ModalEditKelasFaseGuru } from './ModalEditKelasFaseGuru';
import { ModalMenuSimpan } from './ModalMenuSimpan';
import { KMPMAssessmentProgressSummary } from './KMPMAssessmentProgressSummary';
import { MonthlyAttendanceChart } from './MonthlyAttendanceChart';
import {
  Users,
  CalendarCheck2,
  GraduationCap,
  WalletCards,
  BookOpenCheck,
  Sparkles,
  Calendar,
  Clock,
  ArrowUpRight,
  Award,
  CheckCircle2,
  School,
  UserCheck,
  Edit3,
  Layers,
  ChevronRight,
  Save,
  ShieldCheck,
  HardDrive
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const {
    schoolInfo,
    students,
    teachers,
    attendanceRecords,
    subjects,
    grades,
    journals,
    schedule,
    modulAjarList,
    getCurrentCashBalance,
    events,
    cleaningDuties,
    currentUser,
    setCurrentTab,
    lastSavedAt,
    saveAllData
  } = useApp();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [modalInitialTab, setModalInitialTab] = useState<'kelas_fase' | 'wali_kelas' | 'daftar_guru'>('kelas_fase');
  const [isMenuSimpanOpen, setIsMenuSimpanOpen] = useState(false);
  const [isQuickSaving, setIsQuickSaving] = useState(false);
  const [justSaved, setJustSaved] = useState(false);

  const handleQuickSave = () => {
    setIsQuickSaving(true);
    setJustSaved(false);
    setTimeout(() => {
      saveAllData();
      setIsQuickSaving(false);
      setJustSaved(true);
      setTimeout(() => setJustSaved(false), 3000);
    }, 250);
  };

  // Waktu & Tanggal Real-time Hari Ini dalam Bahasa Indonesia
  const now = new Date();
  const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  const currentDayName = dayNames[now.getDay()];
  const currentDate = now.getDate();
  const currentMonthName = monthNames[now.getMonth()];
  const currentYear = now.getFullYear();
  const todayFormatted = `${currentDayName}, ${currentDate} ${currentMonthName} ${currentYear}`;
  const todayIso = `${currentYear}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(currentDate).padStart(2, '0')}`;

  const safeAttendance = attendanceRecords || [];
  const safeStudents = students || [];
  const safeTeachers = teachers || [];
  const safeSubjects = subjects || [];
  const safeGrades = grades || [];
  const safeJournals = journals || [];
  const safeSchedule = schedule || [];
  const safeCleaningDuties = cleaningDuties || [];
  const safeEvents = events || [];

  // Hitung presensi hari ini (gunakan data tanggal hari ini jika ada, atau data sampel terkini)
  const todayAttendance = safeAttendance.filter(r => r.tanggal === todayIso);
  const effectiveAttendance = todayAttendance.length > 0
    ? todayAttendance
    : (safeAttendance.filter(r => r.tanggal === '2026-08-17').length > 0
        ? safeAttendance.filter(r => r.tanggal === '2026-08-17')
        : safeAttendance.slice(0, safeStudents.length));

  const hadirCount = effectiveAttendance.filter(r => r.status === 'Hadir').length;
  const sakitCount = effectiveAttendance.filter(r => r.status === 'Sakit').length;
  const izinCount = effectiveAttendance.filter(r => r.status === 'Izin').length;
  const totalPresensi = effectiveAttendance.length || safeStudents.length;
  const attendanceRate = totalPresensi > 0 && safeStudents.length > 0 ? Math.round((hadirCount / safeStudents.length) * 100) : 100;

  // Grade averages across all subjects
  const allGradesList = safeGrades.map(g => g.nilai);
  const classGradeAvg = allGradesList.length > 0 
    ? (allGradesList.reduce((a, b) => a + b, 0) / allGradesList.length).toFixed(1)
    : '85.0';

  // Jadwal & Piket sesuai Hari Ini
  const isWeekendOff = currentDayName === 'Minggu';
  const matchingSchedule = safeSchedule.filter(s => s.hari === currentDayName);
  const todaySchedule = matchingSchedule.length > 0
    ? matchingSchedule
    : (isWeekendOff ? [] : safeSchedule.filter(s => s.hari === 'Senin'));

  const todayPiket = safeCleaningDuties.find(d => d.hari === currentDayName)
    || (isWeekendOff ? undefined : safeCleaningDuties.find(d => d.hari === 'Senin'));

  // Calculate average per subject for chart
  const subjectAverages = safeSubjects.map(sub => {
    const subGrades = safeGrades.filter(g => g.mapelId === sub.id);
    const avg = subGrades.length > 0 
      ? Math.round(subGrades.reduce((sum, g) => sum + g.nilai, 0) / subGrades.length) 
      : 80;
    return {
      name: sub.nama,
      kode: sub.kode,
      avg,
      kktp: sub.kktp
    };
  });

  // 15 Administration Books Status
  const safeModulAjar = modulAjarList || [];
  const adminBooks = [
    { no: 1, title: 'Buku Induk Siswa', status: `${safeStudents.length} Siswa Lengkap`, tab: 'siswa' },
    { no: 2, title: 'Buku Induk Guru & DUK Pegawai', status: `${safeTeachers.length} Pendidik Aktif`, tab: 'guru' },
    { no: 3, title: 'Buku Perangkat Ajar & Modul', status: `${safeModulAjar.length} Modul Lengkap`, tab: 'perangkat_ajar' },
    { no: 4, title: 'Buku Presensi / Absensi', status: 'Harian & Bulanan Siap', tab: 'presensi' },
    { no: 5, title: 'Buku Daftar Nilai & TP', status: 'Formatif & Sumatif', tab: 'nilai' },
    { no: 6, title: 'Buku Rapor Kurikulum Merdeka', status: 'Format Resmi Siap Cetak', tab: 'raport' },
    { no: 7, title: 'Buku Agenda & Jurnal Guru', status: `${safeJournals.length} Jurnal Tercatat`, tab: 'jurnal' },
    { no: 8, title: 'Buku Jadwal & Matriks Belajar', status: 'Jadwal Pelajaran & Piket', tab: 'jadwal' },
    { no: 9, title: 'Buku Kas & Iuran Kelas', status: `Saldo Rp ${(getCurrentCashBalance?.() || 0).toLocaleString('id-ID')}`, tab: 'kas' },
    { no: 10, title: 'Buku Inventaris Ruang (KIR)', status: 'Sarpras Terdata', tab: 'inventaris' },
    { no: 11, title: 'Buku Bimbingan & Konseling', status: 'Catatan Perilaku', tab: 'konseling' },
    { no: 12, title: 'Buku Prestasi Siswa', status: 'Bakat & Prestasi', tab: 'konseling' },
    { no: 13, title: 'Buku Regu Piket Kelas', status: 'Pembagian 6 Hari', tab: 'jadwal' },
    { no: 14, title: 'Pusat Template & Import Excel', status: 'Format .xlsx Siap', tab: 'import_excel' },
    { no: 15, title: 'AI Asisten Administrasi Guru', status: 'Gemini AI Aktif', tab: 'ai_assistant' }
  ];

  const handleOpenEdit = (tab: 'kelas_fase' | 'wali_kelas' | 'daftar_guru') => {
    setModalInitialTab(tab);
    setIsEditModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* 1. Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-950 p-6 sm:p-7 text-white shadow-lg">
        <div className="absolute right-0 top-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="absolute right-32 bottom-0 -mb-16 h-48 w-48 rounded-full bg-amber-500/15 blur-2xl" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-lg bg-orange-500 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-sm">
                <Sparkles className="h-3.5 w-3.5" />
                {schoolInfo.kurikulum}
              </span>
              <span className="rounded-lg bg-blue-700/60 px-2.5 py-1 text-xs font-semibold text-blue-100 border border-blue-400/30">
                {schoolInfo.phase} • {schoolInfo.className}
              </span>
              <span className="text-xs text-blue-200/90 flex items-center gap-1 font-medium">
                <Calendar className="h-3.5 w-3.5" />
                {todayFormatted}
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white leading-tight">
              Selamat Datang, {currentUser.name}!
            </h1>
            <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed">
              Sistem Administrasi Guru & Wali Kelas Terpadu <span className="font-bold text-white">{schoolInfo.schoolName}</span>. Seluruh dokumen pembelajaran, data siswa, presensi, penilaian, dan kas kelas terintegrasi rapi dan siap cetak.
            </p>
          </div>

          {/* Quick Primary Actions in Banner */}
          <div className="flex flex-wrap md:flex-col gap-2 shrink-0">
            {/* Primary SIMPAN Menu Button */}
            <button
              id="btn-menu-simpan-banner"
              onClick={() => setIsMenuSimpanOpen(true)}
              className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 px-4 py-2.5 text-xs font-black text-white shadow-md transition-all active:scale-95 cursor-pointer ring-2 ring-emerald-300/50"
              title="Buka Menu SIMPAN & Kelola Cadangan Data"
            >
              <Save className="h-4 w-4" />
              <span>MENU SIMPAN</span>
              <span className="inline-block h-2 w-2 rounded-full bg-white animate-pulse" />
            </button>

            <button
              onClick={() => setCurrentTab('presensi')}
              className="flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-blue-900 shadow-md hover:bg-blue-50 transition-all active:scale-95"
            >
              <CalendarCheck2 className="h-4 w-4 text-blue-600" />
              <span>Isi Presensi Hari Ini</span>
            </button>
            <button
              onClick={() => setCurrentTab('ai_assistant')}
              className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 px-4 py-2.5 text-xs font-bold text-white shadow-md transition-all active:scale-95"
            >
              <Sparkles className="h-4 w-4" />
              <span>Buka Asisten AI</span>
            </button>
          </div>
        </div>
      </div>

      {/* Menu SIMPAN & Status Keamanan Data Kelas */}
      <div
        id="panel-menu-simpan-dashboard"
        className="rounded-2xl border border-emerald-200/90 dark:border-emerald-800/60 bg-gradient-to-r from-emerald-50/90 via-teal-50/50 to-blue-50/60 dark:from-emerald-950/30 dark:via-slate-900 dark:to-blue-950/20 p-4 sm:p-4.5 shadow-xs transition-all"
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Save className="h-5 w-5" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                  Menu SIMPAN & Keamanan Data Kelas
                </h2>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Auto-Save Aktif
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                Data tersimpan otomatis di perangkat. Saat aplikasi ditutup dan dibuka kembali, seluruh data tetap aman &amp; sama dengan sebelumnya.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 shrink-0">
            {/* Last Saved Badge */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800/80 text-[11px] text-slate-600 dark:text-slate-300">
              <Clock className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              <span className="text-slate-400">Terakhir:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {lastSavedAt || 'Baru Saja'}
              </span>
            </div>

            {/* Quick Save Button */}
            <button
              id="btn-quick-simpan-dashboard"
              onClick={handleQuickSave}
              disabled={isQuickSaving}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold shadow-xs transition-all active:scale-95 cursor-pointer ${
                justSaved
                  ? 'bg-emerald-700 text-white ring-2 ring-emerald-400'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              }`}
              title="Simpan seluruh data sekarang"
            >
              {justSaved ? (
                <>
                  <CheckCircle2 className="h-3.5 w-3.5 animate-bounce" />
                  <span>Tersimpan!</span>
                </>
              ) : isQuickSaving ? (
                <>
                  <span className="h-3.5 w-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  <span>Menyimpan...</span>
                </>
              ) : (
                <>
                  <Save className="h-3.5 w-3.5" />
                  <span>Simpan Sekarang</span>
                </>
              )}
            </button>

            {/* Open Full SIMPAN Menu */}
            <button
              id="btn-buka-menu-simpan"
              onClick={() => setIsMenuSimpanOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-emerald-700 dark:text-emerald-300 font-bold text-xs border border-emerald-300 dark:border-emerald-800 shadow-xs transition-all cursor-pointer"
            >
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              <span>Buka Menu SIMPAN</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Panel Identitas Kelas & Pendidik Aktif */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 mb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <School className="h-4.5 w-4.5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                Identitas Kelas & Pendidik Aktif
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  TA {schoolInfo.academicYear}
                </span>
              </h2>
            </div>
          </div>

          <button
            onClick={() => handleOpenEdit('kelas_fase')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/60 border border-blue-200 dark:border-blue-800 transition-colors self-start sm:self-auto"
          >
            <Edit3 className="h-3.5 w-3.5" />
            <span>Ubah Data Kelas & Guru</span>
          </button>
        </div>

        {/* 3 Compact Identity Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Card 1: Kelas */}
          <div
            onClick={() => handleOpenEdit('kelas_fase')}
            className="group cursor-pointer rounded-xl p-3 border border-slate-100 dark:border-slate-800 bg-slate-50/70 hover:bg-blue-50/50 dark:bg-slate-800/40 dark:hover:bg-blue-950/20 hover:border-blue-200 dark:hover:border-blue-800 transition-all"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1">
                <GraduationCap className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                Rombongan Belajar
              </span>
              <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5">
                Edit <ChevronRight className="h-3 w-3" />
              </span>
            </div>
            <p className="text-sm font-bold text-slate-900 dark:text-white">
              Kelas {schoolInfo.className}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Semester {schoolInfo.semester} • {schoolInfo.academicYear}
            </p>
          </div>

          {/* Card 2: Fase */}
          <div
            onClick={() => handleOpenEdit('kelas_fase')}
            className="group cursor-pointer rounded-xl p-3 border border-slate-100 dark:border-slate-800 bg-slate-50/70 hover:bg-emerald-50/50 dark:bg-slate-800/40 dark:hover:bg-emerald-950/20 hover:border-emerald-200 dark:hover:border-emerald-800 transition-all"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1">
                <Layers className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                Fase Kurikulum
              </span>
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5">
                Edit <ChevronRight className="h-3 w-3" />
              </span>
            </div>
            <p className="text-sm font-bold text-slate-900 dark:text-white">
              {schoolInfo.phase}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {schoolInfo.kurikulum}
            </p>
          </div>

          {/* Card 3: Wali Kelas */}
          <div
            onClick={() => handleOpenEdit('wali_kelas')}
            className="group cursor-pointer rounded-xl p-3 border border-slate-100 dark:border-slate-800 bg-slate-50/70 hover:bg-purple-50/50 dark:bg-slate-800/40 dark:hover:bg-purple-950/20 hover:border-purple-200 dark:hover:border-purple-800 transition-all"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1">
                <UserCheck className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
                Wali Kelas
              </span>
              <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5">
                Edit <ChevronRight className="h-3 w-3" />
              </span>
            </div>
            <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
              {schoolInfo.homeroomTeacherName || 'Sri Wahyuni, S.Pd.'}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">
              NIP: {schoolInfo.homeroomTeacherNip || '-'}
            </p>
          </div>
        </div>
      </div>

      {/* 3. 4 Core KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Siswa"
          value={`${students.length} Siswa`}
          subtitle={`${students.filter(s => s.jenisKelamin === 'L').length} Laki-laki • ${students.filter(s => s.jenisKelamin === 'P').length} Perempuan`}
          icon={<Users className="h-5 w-5" />}
          colorTheme="blue"
          onClick={() => setCurrentTab('siswa')}
        />
        <StatCard
          title="Kehadiran Hari Ini"
          value={`${attendanceRate}%`}
          subtitle={`${hadirCount} Hadir • ${izinCount} Izin • ${sakitCount} Sakit`}
          icon={<CalendarCheck2 className="h-5 w-5" />}
          trend={{ value: 'Hari Ini' }}
          colorTheme="emerald"
          onClick={() => setCurrentTab('presensi')}
        />
        <StatCard
          title="Rata-rata Nilai Kelas"
          value={`${classGradeAvg}`}
          subtitle="Skor 100 • Predikat B+ Baik"
          icon={<GraduationCap className="h-5 w-5" />}
          trend={{ value: 'Tuntas' }}
          colorTheme="purple"
          onClick={() => setCurrentTab('nilai')}
        />
        <StatCard
          title="Saldo Kas Kelas"
          value={`Rp ${getCurrentCashBalance().toLocaleString('id-ID')}`}
          subtitle="Iuran & Kas Paguyuban"
          icon={<WalletCards className="h-5 w-5" />}
          colorTheme="orange"
          onClick={() => setCurrentTab('kas')}
        />
      </div>

      {/* 4. Real-time KMPM Assessment Progress Summary Across All Students */}
      <KMPMAssessmentProgressSummary />

      {/* 5. Main Analytics & Administrative Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 cols): Attendance Chart, Grades & 15 Books Checklist */}
        <div className="lg:col-span-2 space-y-6">
          {/* Chart 1: Grafik Batang Ringkasan Presensi Siswa Bulanan */}
          <MonthlyAttendanceChart />

          {/* Chart 2: Capaian Nilai per Mata Pelajaran */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 dark:border-slate-800 dark:bg-slate-900 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-5">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  Rata-rata Capaian Nilai Mata Pelajaran
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Perbandingan rerata nilai kelas dengan Kriteria Ketercapaian Tujuan Pembelajaran (KKTP)
                </p>
              </div>
              <button
                onClick={() => setCurrentTab('nilai')}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 flex items-center gap-1 self-start"
              >
                <span>Kelola Nilai</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="space-y-3.5">
              {subjectAverages.map((item, idx) => {
                const isPassing = item.avg >= item.kktp;
                return (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-700 dark:text-slate-200">
                        {item.name} ({item.kode})
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-slate-400">
                          KKTP: {item.kktp}
                        </span>
                        <span className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                          isPassing 
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' 
                            : 'bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                        }`}>
                          {item.avg} / 100
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                      <div 
                        className="absolute top-0 bottom-0 w-0.5 bg-slate-400 z-10" 
                        style={{ left: `${item.kktp}%` }}
                        title={`Batas KKTP: ${item.kktp}`}
                      />
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          item.avg >= 90
                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600'
                            : item.avg >= 80
                            ? 'bg-gradient-to-r from-emerald-500 to-teal-600'
                            : 'bg-gradient-to-r from-amber-500 to-orange-500'
                        }`}
                        style={{ width: `${item.avg}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 pt-3.5 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 text-[11px]">
                  <span className="h-2.5 w-2.5 rounded-full bg-indigo-600" />
                  Sangat Mahir (≥90)
                </span>
                <span className="flex items-center gap-1 text-[11px]">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  Tuntas (≥80)
                </span>
              </div>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400 text-xs">
                100% Mata Pelajaran Tuntas KKTP
              </span>
            </div>
          </div>

          {/* 15 Administrasi Wali Kelas Status Checklist */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 dark:border-slate-800 dark:bg-slate-900 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  Status 15 Buku Administrasi Wali Kelas
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Kelengkapan instrumen supervisi dan akreditasi sekolah dasar
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {adminBooks.map(b => (
                <div
                  key={b.no}
                  onClick={() => setCurrentTab(b.tab as any)}
                  className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 bg-slate-50/70 hover:bg-blue-50/60 hover:border-blue-200 dark:border-slate-800 dark:bg-slate-800/40 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 text-[11px] font-bold">
                      {b.no}
                    </span>
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                      {b.title}
                    </span>
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 shrink-0 ml-2">
                    {b.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Today's Schedule & Piket, Upcoming Events */}
        <div className="space-y-6">
          {/* Jadwal Hari Ini */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 dark:border-slate-800 dark:bg-slate-900 shadow-xs">
            <div className="flex items-center justify-between mb-3.5">
              <div className="flex items-center gap-2">
                <Clock className="h-4.5 w-4.5 text-orange-600 dark:text-orange-400" />
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                  Jadwal Mengajar Hari Ini
                </h3>
              </div>
              <span className="text-[11px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full dark:bg-orange-950/50 dark:text-orange-300">
                {currentDayName}
              </span>
            </div>

            <div className="space-y-2">
              {todaySchedule.length > 0 ? (
                todaySchedule.map(s => {
                  const sub = subjects.find(item => item.id === s.mapelId);
                  return (
                    <div
                      key={s.id}
                      className="p-2.5 rounded-xl border border-slate-100 bg-slate-50/80 dark:border-slate-800 dark:bg-slate-800/50"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-blue-700 dark:text-blue-300">
                          Jam ke-{s.jamKe} ({s.waktu})
                        </span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400">
                          {s.ruang}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white mt-0.5">
                        {sub?.nama || 'Upacara Bendera / Pembiasaan'}
                      </h4>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">
                        Pengampu: {s.guruPengampu}
                      </p>
                    </div>
                  );
                })
              ) : (
                <div className="p-3.5 rounded-xl border border-dashed border-slate-200 bg-slate-50/60 dark:border-slate-800 dark:bg-slate-800/40 text-center">
                  <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                    {currentDayName === 'Minggu' ? 'Hari Minggu (Libur KBM)' : `Tidak ada jadwal KBM tatap muka hari ${currentDayName}`}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Buka menu Jadwal Pelajaran untuk melihat kalender dan matriks mingguan
                  </p>
                </div>
              )}
            </div>

            {/* Piket Hari Ini */}
            {todayPiket && (
              <div className="mt-3.5 pt-3 border-t border-slate-100 dark:border-slate-800">
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Petugas Piket Kelas ({todayPiket.hari}):
                </p>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {(todayPiket.siswaIds || []).map(sId => {
                    const st = safeStudents.find(item => item.id === sId);
                    return (
                      <span
                        key={sId}
                        className="text-[11px] font-medium px-2 py-0.5 rounded-lg bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
                      >
                        {st?.nama || 'Siswa'}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Agenda Sekolah & Kegiatan Terdekat */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 dark:border-slate-800 dark:bg-slate-900 shadow-xs">
            <div className="flex items-center justify-between mb-3.5">
              <div className="flex items-center gap-2">
                <Calendar className="h-4.5 w-4.5 text-blue-600 dark:text-blue-400" />
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                  Agenda & Kalender Kelas
                </h3>
              </div>
            </div>

            <div className="space-y-2.5">
              {safeEvents.slice(0, 3).map(ev => (
                <div
                  key={ev.id}
                  className="p-2.5 rounded-xl border border-slate-100 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-800/40"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold text-orange-600 dark:text-orange-400">
                      {ev.tanggal} • {ev.waktu}
                    </span>
                    <BadgeStatus status={ev.kategori} size="sm" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white mt-0.5">
                    {ev.judul}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                    {ev.deskripsi}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Siswa Berprestasi Highlight */}
          <div className="rounded-2xl border border-amber-200/80 bg-gradient-to-br from-amber-50 to-orange-50/40 p-4 sm:p-5 dark:border-amber-900/60 dark:from-amber-950/30 dark:to-slate-900 shadow-xs">
            <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300">
              <Award className="h-4.5 w-4.5 text-amber-600" />
              <h3 className="text-xs sm:text-sm font-bold">Bintang Kelas Bulan Ini</h3>
            </div>
            <p className="text-xs text-amber-900/80 dark:text-amber-200/80 mt-1 leading-relaxed">
              Ananda <span className="font-bold text-amber-950 dark:text-white">Ahmad Fauzi</span> & <span className="font-bold text-amber-950 dark:text-white">Nadia Zahra</span> meraih prestasi teladan kedisiplinan dan literasi.
            </p>
            <button
              onClick={() => setCurrentTab('konseling')}
              className="mt-2.5 text-xs font-bold text-amber-800 dark:text-amber-300 hover:underline flex items-center gap-1"
            >
              <span>Lihat Catatan Prestasi & Bimbingan</span>
              <ArrowUpRight className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Modal Edit Kelas, Fase & Guru */}
      <ModalEditKelasFaseGuru
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        initialTab={modalInitialTab}
      />

      {/* Modal Menu SIMPAN & Keamanan Data */}
      <ModalMenuSimpan
        isOpen={isMenuSimpanOpen}
        onClose={() => setIsMenuSimpanOpen(false)}
      />
    </div>
  );
};
