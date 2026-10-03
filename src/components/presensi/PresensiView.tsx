import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { AttendanceStatus } from '../../types';
import { Modal } from '../common/Modal';
import { HeaderKopSekolah } from '../common/HeaderKopSekolah';
import { ModalPengaturanHariEfektif } from './ModalPengaturanHariEfektif';
import {
  CalendarCheck2,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Clock,
  Printer,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  Search,
  Sparkles,
  FileSpreadsheet,
  Settings2,
  SlidersHorizontal,
  Info,
  CalendarDays,
  Check,
  CalendarRange
} from 'lucide-react';

const INDO_DAYS = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
const INDO_DAYS_SHORT = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
const INDO_MONTHS = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

export const PresensiView: React.FC = () => {
  const {
    students,
    attendanceRecords,
    markAttendance,
    bulkMarkAttendance,
    getAttendanceByDate,
    getStudentAttendanceStats,
    schoolInfo,
    updateSchoolInfo,
    currentUser,
    addToast
  } = useApp();

  const safeStudents = students || [];

  const [activeSubTab, setActiveSubTab] = useState<'harian' | 'bulanan'>('harian');
  const [selectedDate, setSelectedDate] = useState<string>('2026-08-17');
  const [selectedMonth, setSelectedMonth] = useState<string>('2026-08');
  const [searchQuery, setSearchQuery] = useState('');
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [isEffectiveDaysModalOpen, setIsEffectiveDaysModalOpen] = useState(false);

  // Effective days configuration from SchoolInfo
  const effectiveDaysPerWeek = schoolInfo.effectiveDaysPerWeek || 5;
  const activeSchoolDays = (schoolInfo.activeSchoolDays && schoolInfo.activeSchoolDays.length > 0)
    ? schoolInfo.activeSchoolDays
    : (effectiveDaysPerWeek === 6
        ? ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
        : ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat']);

  // Selected date Day Name & Effective check
  const selectedDateObj = useMemo(() => {
    const [y, m, d] = selectedDate.split('-').map(Number);
    return new Date(y || 2026, (m || 8) - 1, d || 17);
  }, [selectedDate]);

  const selectedDayName = INDO_DAYS[selectedDateObj.getDay()];
  const isSelectedDateEffective = activeSchoolDays.includes(selectedDayName);

  // Month parsing for Rekap Bulanan
  const { year: selectedYear, month: selectedMonthNum, daysInMonth, monthDaysInfo } = useMemo(() => {
    const [yStr, mStr] = selectedMonth.split('-');
    const y = parseInt(yStr, 10) || 2026;
    const m = parseInt(mStr, 10) || 8;
    const totalDays = new Date(y, m, 0).getDate();

    const days = [];
    for (let d = 1; d <= totalDays; d++) {
      const dateObj = new Date(y, m - 1, d);
      const dayIdx = dateObj.getDay();
      const dayName = INDO_DAYS[dayIdx];
      const dayShort = INDO_DAYS_SHORT[dayIdx];
      const isEffective = activeSchoolDays.includes(dayName);
      const isSunday = dayIdx === 0;
      const isSaturday = dayIdx === 6;

      days.push({
        day: d,
        dateStr: `${y}-${m.toString().padStart(2, '0')}-${d.toString().padStart(2, '0')}`,
        dayName,
        dayShort,
        isEffective,
        isSunday,
        isSaturday
      });
    }

    return {
      year: y,
      month: m,
      daysInMonth: totalDays,
      monthDaysInfo: days
    };
  }, [selectedMonth, activeSchoolDays]);

  const monthEffectiveDaysCount = useMemo(() => {
    return monthDaysInfo.filter(d => d.isEffective).length;
  }, [monthDaysInfo]);

  const monthNonEffectiveDaysCount = daysInMonth - monthEffectiveDaysCount;

  // Today / Selected Date Attendance Records
  const dateRecords = getAttendanceByDate(selectedDate) || [];
  const getStatusForStudent = (siswaId: string): { status: AttendanceStatus; keterangan?: string } => {
    const rec = dateRecords.find(r => r.siswaId === siswaId);
    return rec ? { status: rec.status, keterangan: rec.keterangan } : { status: 'Hadir', keterangan: '' };
  };

  const hadirCount = dateRecords.filter(r => r.status === 'Hadir').length || (dateRecords.length === 0 && isSelectedDateEffective ? safeStudents.length : 0);
  const sakitCount = dateRecords.filter(r => r.status === 'Sakit').length;
  const izinCount = dateRecords.filter(r => r.status === 'Izin').length;
  const alpaCount = dateRecords.filter(r => r.status === 'Alpa').length;
  const attendanceRate = safeStudents.length > 0 ? Math.round((hadirCount / safeStudents.length) * 100) : 100;

  const handleStatusChange = (siswaId: string, status: AttendanceStatus, keterangan?: string) => {
    markAttendance(siswaId, status, selectedDate, keterangan);
  };

  const handleSetAllHadir = () => {
    bulkMarkAttendance(selectedDate, 'Hadir');
  };

  // Quick switch between 5 and 6 days
  const handleQuickSwitchDays = (days: 5 | 6) => {
    const active = days === 6
      ? ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
      : ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'];
    updateSchoolInfo({
      effectiveDaysPerWeek: days,
      activeSchoolDays: active
    });
    addToast('success', 'Pola Hari Efektif Diperbarui', `Pola sekolah diatur ke ${days} Hari Belajar per Minggu (${active.join(', ')}).`);
  };

  // Date Navigation Helpers
  const handlePrevDay = () => {
    const prev = new Date(selectedDateObj);
    prev.setDate(prev.getDate() - 1);
    const y = prev.getFullYear();
    const m = (prev.getMonth() + 1).toString().padStart(2, '0');
    const d = prev.getDate().toString().padStart(2, '0');
    setSelectedDate(`${y}-${m}-${d}`);
  };

  const handleNextDay = () => {
    const next = new Date(selectedDateObj);
    next.setDate(next.getDate() + 1);
    const y = next.getFullYear();
    const m = (next.getMonth() + 1).toString().padStart(2, '0');
    const d = next.getDate().toString().padStart(2, '0');
    setSelectedDate(`${y}-${m}-${d}`);
  };

  const handlePrevMonth = () => {
    let m = selectedMonthNum - 1;
    let y = selectedYear;
    if (m < 1) {
      m = 12;
      y -= 1;
    }
    setSelectedMonth(`${y}-${m.toString().padStart(2, '0')}`);
  };

  const handleNextMonth = () => {
    let m = selectedMonthNum + 1;
    let y = selectedYear;
    if (m > 12) {
      m = 1;
      y += 1;
    }
    setSelectedMonth(`${y}-${m.toString().padStart(2, '0')}`);
  };

  const filteredStudents = safeStudents.filter(s =>
    s.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.nisn.includes(searchQuery)
  );

  const isTeacherOrAdmin = currentUser.role !== 'siswa';

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 shrink-0">
              <CalendarCheck2 className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Buku Presensi & Kehadiran Siswa
                </h2>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                  {schoolInfo.className}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Pencatatan daftar hadir harian dan rekapitulasi matriks bulanan semester {schoolInfo.semester}
              </p>
            </div>
          </div>

          {/* Action Buttons & Sub-tab Switcher */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Setting Button for Effective School Days */}
            <button
              type="button"
              onClick={() => setIsEffectiveDaysModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-all active:scale-95 shadow-xs"
              title="Atur jumlah hari efektif belajar per minggu"
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span>Hari Efektif: <strong>{activeSchoolDays.length} Hari/Minggu</strong></span>
            </button>

            {/* Sub-tab Switcher */}
            <div className="flex rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
              <button
                onClick={() => setActiveSubTab('harian')}
                className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all ${
                  activeSubTab === 'harian'
                    ? 'bg-white text-blue-700 shadow-sm dark:bg-slate-700 dark:text-white'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                Presensi Harian
              </button>
              <button
                onClick={() => setActiveSubTab('bulanan')}
                className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all ${
                  activeSubTab === 'bulanan'
                    ? 'bg-white text-blue-700 shadow-sm dark:bg-slate-700 dark:text-white'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                Rekap Bulanan
              </button>
            </div>

            <button
              onClick={() => setIsPrintModalOpen(true)}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition-colors shadow-xs"
            >
              <Printer className="h-4 w-4 text-slate-500" />
              <span className="hidden sm:inline">Cetak Rekap</span>
            </button>
          </div>
        </div>

        {/* Setting Toolbar: Quick Effective Days Toggle & Status */}
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-50/70 dark:bg-slate-800/40 p-3.5 rounded-2xl">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
              <CalendarDays className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <span>Pengaturan Hari Efektif Sekolah:</span>
            </div>

            {/* Quick 5-day / 6-day Toggle Buttons */}
            <div className="inline-flex rounded-xl bg-white dark:bg-slate-900 p-0.5 border border-slate-200 dark:border-slate-700 shadow-2xs">
              <button
                type="button"
                onClick={() => handleQuickSwitchDays(5)}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                  effectiveDaysPerWeek === 5 && !activeSchoolDays.includes('Sabtu')
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                5 Hari (Senin - Jumat)
              </button>
              <button
                type="button"
                onClick={() => handleQuickSwitchDays(6)}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                  effectiveDaysPerWeek === 6 && activeSchoolDays.includes('Sabtu')
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                6 Hari (Senin - Sabtu)
              </button>
            </div>

            <button
              type="button"
              onClick={() => setIsEffectiveDaysModalOpen(true)}
              className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 ml-1"
            >
              <Settings2 className="h-3.5 w-3.5" />
              <span>Kustomisasi Hari...</span>
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              Hari Aktif:
            </span>
            <div className="flex items-center gap-1">
              {['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'].map(day => {
                const isActive = activeSchoolDays.includes(day);
                return (
                  <span
                    key={day}
                    className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                      isActive
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                        : 'bg-slate-200 text-slate-500 dark:bg-slate-700/60 dark:text-slate-400 line-through opacity-60'
                    }`}
                    title={isActive ? `${day}: Hari Belajar Efektif` : `${day}: Hari Libur`}
                  >
                    {day.slice(0, 3)}
                  </span>
                );
              })}
            </div>
          </div>
        </div>

        {/* Date Selector & Stats Summary Row */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          {/* Date Picker (for Harian) or Month (for Bulanan) */}
          <div className="sm:col-span-2 flex items-center gap-2">
            {activeSubTab === 'harian' ? (
              <div className="flex items-center gap-1.5 w-full">
                <button
                  type="button"
                  onClick={handlePrevDay}
                  className="p-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
                  title="Hari Sebelumnya"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <div className="relative flex-1">
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={e => setSelectedDate(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-1.5 px-3 text-xs font-bold text-slate-800 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleNextDay}
                  className="p-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
                  title="Hari Berikutnya"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 w-full">
                <button
                  type="button"
                  onClick={handlePrevMonth}
                  className="p-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
                  title="Bulan Sebelumnya"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <div className="relative flex-1">
                  <input
                    type="month"
                    value={selectedMonth}
                    onChange={e => setSelectedMonth(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-1.5 px-3 text-xs font-bold text-slate-800 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleNextMonth}
                  className="p-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
                  title="Bulan Berikutnya"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          {/* Quick Stats on Selected Date */}
          <div className="flex items-center justify-between p-2 rounded-xl bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/40">
            <span className="text-xs font-bold">Hadir:</span>
            <span className="text-sm font-extrabold">{hadirCount} Siswa</span>
          </div>

          <div className="flex items-center justify-between p-2 rounded-xl bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/40">
            <span className="text-xs font-bold">Sakit / Izin:</span>
            <span className="text-sm font-extrabold">{sakitCount + izinCount} Siswa</span>
          </div>

          <div className="flex items-center justify-between p-2 rounded-xl bg-blue-50 text-blue-800 dark:bg-blue-950/40 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/40">
            <span className="text-xs font-bold">Tingkat Hadir:</span>
            <span className="text-sm font-extrabold">{attendanceRate}%</span>
          </div>
        </div>
      </div>

      {/* VIEW MODE 1: HARIAN */}
      {activeSubTab === 'harian' && (
        <div className="space-y-4">
          {/* Day Status Notice Banner */}
          <div className={`p-3.5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
            isSelectedDateEffective
              ? 'bg-emerald-50/70 border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-900/50 text-emerald-900 dark:text-emerald-200'
              : 'bg-amber-50/70 border-amber-200 dark:bg-amber-950/30 dark:border-amber-900/50 text-amber-900 dark:text-amber-200'
          }`}>
            <div className="flex items-center gap-3">
              <div className={`h-8 w-8 rounded-xl flex items-center justify-center font-bold text-white shrink-0 ${
                isSelectedDateEffective ? 'bg-emerald-600' : 'bg-amber-600'
              }`}>
                {isSelectedDateEffective ? <CheckCircle2 className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-extrabold">
                    {selectedDayName}, {selectedDateObj.getDate()} {INDO_MONTHS[selectedDateObj.getMonth()]} {selectedDateObj.getFullYear()}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isSelectedDateEffective
                      ? 'bg-emerald-200 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200'
                      : 'bg-amber-200 text-amber-900 dark:bg-amber-900 dark:text-amber-200'
                  }`}>
                    {isSelectedDateEffective ? 'Hari Belajar Efektif' : `Hari Libur / Non-Efektif (Pola ${effectiveDaysPerWeek} Hari)`}
                  </span>
                </div>
                <p className="text-[11px] opacity-80 mt-0.5">
                  {isSelectedDateEffective
                    ? `Hari ini termasuk dalam ${activeSchoolDays.length} hari belajar aktif mingguan.`
                    : `Hari ${selectedDayName} bukan hari belajar aktif pada pola ${effectiveDaysPerWeek} hari sekolah (${activeSchoolDays.join(', ')}). Anda tetap dapat mencatat presensi jika terdapat kegiatan ekskul/tambahan.`}
                </p>
              </div>
            </div>

            {!isSelectedDateEffective && (
              <button
                type="button"
                onClick={() => handleQuickSwitchDays(6)}
                className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all shrink-0 active:scale-95 shadow-xs"
              >
                Ubah ke 6 Hari Sekolah
              </button>
            )}
          </div>

          {/* Quick Bulk Action & Search */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative max-w-sm w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Cari siswa..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-xs text-slate-800 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              />
            </div>

            {isTeacherOrAdmin && (
              <button
                onClick={handleSetAllHadir}
                className="flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 active:scale-95 transition-all self-start sm:self-auto"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>Tandai Semua Hadir (1-Klik)</span>
              </button>
            )}
          </div>

          {/* Interactive Attendance Table */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
                <thead className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-800/80 dark:text-slate-400">
                  <tr>
                    <th className="px-4 py-3.5 text-center w-12">No</th>
                    <th className="px-4 py-3.5">Nama Siswa</th>
                    <th className="px-4 py-3.5">NISN / JK</th>
                    <th className="px-4 py-3.5 text-center">Status Kehadiran Hari Ini</th>
                    <th className="px-4 py-3.5">Keterangan / Alasan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {filteredStudents.map(student => {
                    const { status, keterangan } = getStatusForStudent(student.id);

                    return (
                      <tr
                        key={student.id}
                        className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
                      >
                        {/* No */}
                        <td className="px-4 py-3 text-center font-bold text-slate-900 dark:text-white">
                          {student.nomorAbsen}
                        </td>

                        {/* Name & Photo */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={student.fotoUrl}
                              alt={student.nama}
                              className="h-8 w-8 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                            />
                            <div>
                              <p className="font-bold text-slate-900 dark:text-white">
                                {student.nama}
                              </p>
                              <p className="text-[10px] text-slate-400">{student.kelas}</p>
                            </div>
                          </div>
                        </td>

                        {/* NISN & JK */}
                        <td className="px-4 py-3">
                          <span className="font-mono text-slate-700 dark:text-slate-300">{student.nisn}</span>
                          <span className="ml-2 text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                            {student.jenisKelamin}
                          </span>
                        </td>

                        {/* 4 Interactive Buttons (H, S, I, A) */}
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-center gap-1 sm:gap-2">
                            {/* Hadir */}
                            <button
                              disabled={!isTeacherOrAdmin}
                              onClick={() => handleStatusChange(student.id, 'Hadir')}
                              className={`flex items-center gap-1 px-3 py-1.5 rounded-xl font-bold text-xs transition-all ${
                                status === 'Hadir'
                                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 ring-2 ring-emerald-400'
                                  : 'bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700'
                              }`}
                            >
                              <span>H</span>
                              <span className="hidden sm:inline text-[10px]">Hadir</span>
                            </button>

                            {/* Sakit */}
                            <button
                              disabled={!isTeacherOrAdmin}
                              onClick={() => handleStatusChange(student.id, 'Sakit')}
                              className={`flex items-center gap-1 px-3 py-1.5 rounded-xl font-bold text-xs transition-all ${
                                status === 'Sakit'
                                  ? 'bg-amber-500 text-white shadow-md shadow-amber-500/30 ring-2 ring-amber-300'
                                  : 'bg-slate-100 text-slate-600 hover:bg-amber-50 hover:text-amber-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700'
                              }`}
                            >
                              <span>S</span>
                              <span className="hidden sm:inline text-[10px]">Sakit</span>
                            </button>

                            {/* Izin */}
                            <button
                              disabled={!isTeacherOrAdmin}
                              onClick={() => handleStatusChange(student.id, 'Izin')}
                              className={`flex items-center gap-1 px-3 py-1.5 rounded-xl font-bold text-xs transition-all ${
                                status === 'Izin'
                                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 ring-2 ring-blue-300'
                                  : 'bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-blue-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700'
                              }`}
                            >
                              <span>I</span>
                              <span className="hidden sm:inline text-[10px]">Izin</span>
                            </button>

                            {/* Alpa */}
                            <button
                              disabled={!isTeacherOrAdmin}
                              onClick={() => handleStatusChange(student.id, 'Alpa')}
                              className={`flex items-center gap-1 px-3 py-1.5 rounded-xl font-bold text-xs transition-all ${
                                status === 'Alpa'
                                  ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30 ring-2 ring-rose-400'
                                  : 'bg-slate-100 text-slate-600 hover:bg-rose-50 hover:text-rose-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700'
                              }`}
                            >
                              <span>A</span>
                              <span className="hidden sm:inline text-[10px]">Alpa</span>
                            </button>
                          </div>
                        </td>

                        {/* Keterangan */}
                        <td className="px-4 py-3">
                          <input
                            type="text"
                            disabled={!isTeacherOrAdmin}
                            placeholder="Catatan surat dokter / acara..."
                            value={keterangan || ''}
                            onChange={e => handleStatusChange(student.id, status, e.target.value)}
                            className="w-full rounded-lg border border-slate-200 bg-slate-50/50 p-1.5 text-xs text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                          />
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

      {/* VIEW MODE 2: REKAP BULANAN MATRIX */}
      {activeSubTab === 'bulanan' && (
        <div className="space-y-4">
          {/* Top Metrics Info Bar */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div>
              <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                Matriks Presensi Bulan {INDO_MONTHS[selectedMonthNum - 1]} {selectedYear}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Pola Sekolah: <strong>{activeSchoolDays.length} Hari Efektif/Minggu</strong> ({activeSchoolDays.join(', ')}) &bull; Total <strong>{monthEffectiveDaysCount} Hari Belajar Efektif</strong>
              </p>
            </div>

            <div className="flex items-center gap-3 text-xs flex-wrap">
              <span className="flex items-center gap-1 text-emerald-600 font-bold">
                <span className="h-2 w-2 rounded-full bg-emerald-500" /> H: Hadir
              </span>
              <span className="flex items-center gap-1 text-amber-600 font-bold">
                <span className="h-2 w-2 rounded-full bg-amber-500" /> S: Sakit
              </span>
              <span className="flex items-center gap-1 text-blue-600 font-bold">
                <span className="h-2 w-2 rounded-full bg-blue-500" /> I: Izin
              </span>
              <span className="flex items-center gap-1 text-rose-600 font-bold">
                <span className="h-2 w-2 rounded-full bg-rose-500" /> A: Alpa
              </span>
              <span className="flex items-center gap-1 text-slate-400 font-medium">
                <span className="h-2 w-2 rounded-full bg-slate-300 dark:bg-slate-600" /> -: Libur / Non-Efektif
              </span>
            </div>
          </div>

          {/* Matrix Table */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[11px] text-slate-600 dark:text-slate-300 border-collapse">
                <thead className="border-b border-slate-200 bg-slate-50/90 text-center font-bold text-slate-700 dark:border-slate-800 dark:bg-slate-800/90 dark:text-slate-300">
                  <tr>
                    <th className="p-2 border-r border-slate-200 dark:border-slate-800 sticky left-0 bg-slate-50 dark:bg-slate-800 z-10 w-8">No</th>
                    <th className="p-2 border-r border-slate-200 dark:border-slate-800 sticky left-8 bg-slate-50 dark:bg-slate-800 z-10 text-left min-w-[140px]">Nama Siswa</th>
                    {monthDaysInfo.map(dayInfo => (
                      <th
                        key={dayInfo.day}
                        className={`p-1 border-r border-slate-200 dark:border-slate-800 min-w-[28px] ${
                          !dayInfo.isEffective
                            ? 'bg-rose-50/80 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400'
                            : ''
                        }`}
                        title={`${dayInfo.dayName}, ${dayInfo.day} ${INDO_MONTHS[selectedMonthNum - 1]} ${selectedYear} (${dayInfo.isEffective ? 'Hari Belajar Efektif' : 'Hari Libur'})`}
                      >
                        <div className="text-[10px] leading-tight font-extrabold">{dayInfo.day}</div>
                        <div className="text-[9px] font-medium opacity-75">{dayInfo.dayShort}</div>
                      </th>
                    ))}
                    <th className="p-2 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 font-extrabold w-8">H</th>
                    <th className="p-2 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 font-extrabold w-8">S</th>
                    <th className="p-2 bg-blue-50 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300 font-extrabold w-8">I</th>
                    <th className="p-2 bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 font-extrabold w-8">A</th>
                    <th className="p-2 bg-slate-100 dark:bg-slate-800 font-extrabold w-12">%</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-center">
                  {students.map(student => {
                    const stats = getStudentAttendanceStats(student.id, selectedMonth);

                    return (
                      <tr key={student.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                        {/* No */}
                        <td className="p-2 border-r border-slate-100 dark:border-slate-800 font-bold sticky left-0 bg-white dark:bg-slate-900 z-10">
                          {student.nomorAbsen}
                        </td>

                        {/* Name */}
                        <td className="p-2 border-r border-slate-100 dark:border-slate-800 text-left font-semibold text-slate-900 dark:text-white sticky left-8 bg-white dark:bg-slate-900 z-10 truncate">
                          {student.nama}
                        </td>

                        {/* Dynamic Days in Month */}
                        {monthDaysInfo.map(dayInfo => {
                          const dateStr = dayInfo.dateStr;
                          const rec = attendanceRecords.find(r => r.siswaId === student.id && r.tanggal === dateStr);

                          if (!dayInfo.isEffective) {
                            return (
                              <td
                                key={dayInfo.day}
                                className="p-1 border-r border-slate-100 dark:border-slate-800 bg-rose-50/30 dark:bg-rose-950/20 text-rose-400/60 font-mono"
                                title={`Hari Libur / Non-Efektif (${dayInfo.dayName})`}
                              >
                                -
                              </td>
                            );
                          }

                          let badgeColor = 'text-slate-400';
                          let char = '•';

                          if (rec) {
                            if (rec.status === 'Hadir') {
                              badgeColor = 'text-emerald-600 font-bold bg-emerald-50 dark:bg-emerald-950/30';
                              char = 'H';
                            } else if (rec.status === 'Sakit') {
                              badgeColor = 'text-amber-600 font-bold bg-amber-100 dark:bg-amber-950/50 rounded';
                              char = 'S';
                            } else if (rec.status === 'Izin') {
                              badgeColor = 'text-blue-600 font-bold bg-blue-100 dark:bg-blue-950/50 rounded';
                              char = 'I';
                            } else if (rec.status === 'Alpa') {
                              badgeColor = 'text-rose-600 font-bold bg-rose-100 dark:bg-rose-950/50 rounded';
                              char = 'A';
                            }
                          }

                          return (
                            <td
                              key={dayInfo.day}
                              className={`p-1 border-r border-slate-100 dark:border-slate-800 ${badgeColor}`}
                              title={`${student.nama} - ${dayInfo.dayName}, ${dayInfo.day} ${INDO_MONTHS[selectedMonthNum - 1]}: ${rec?.status || 'Belum diisi'}`}
                            >
                              {char}
                            </td>
                          );
                        })}

                        {/* Stats Summary */}
                        <td className="p-2 bg-emerald-50/50 dark:bg-emerald-950/20 font-bold text-emerald-700 dark:text-emerald-400">
                          {stats.hadir}
                        </td>
                        <td className="p-2 bg-amber-50/50 dark:bg-amber-950/20 font-bold text-amber-700 dark:text-amber-400">
                          {stats.sakit}
                        </td>
                        <td className="p-2 bg-blue-50/50 dark:bg-blue-950/20 font-bold text-blue-700 dark:text-blue-400">
                          {stats.izin}
                        </td>
                        <td className="p-2 bg-rose-50/50 dark:bg-rose-950/20 font-bold text-rose-700 dark:text-rose-400">
                          {stats.alpa}
                        </td>
                        <td className="p-2 bg-slate-50 dark:bg-slate-800/80 font-extrabold text-slate-800 dark:text-slate-200">
                          {stats.percentage}%
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

      {/* Modal Pengaturan Hari Efektif Sekolah */}
      <ModalPengaturanHariEfektif
        isOpen={isEffectiveDaysModalOpen}
        onClose={() => setIsEffectiveDaysModalOpen(false)}
        selectedMonth={selectedMonth}
      />

      {/* Modal Cetak Laporan Presensi Resmi */}
      {isPrintModalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setIsPrintModalOpen(false)}
          title="Pratinjau Cetak Rekapitulasi Presensi Kelas"
          maxWidth="5xl"
        >
          <div className="space-y-6">
            <div
              id="printable-official-document"
              className="printable-document-sheet p-6 bg-white rounded-2xl border border-slate-200 text-black print:border-none print:shadow-none print:p-0 print:m-0 print:w-full"
            >
              <HeaderKopSekolah
                documentTitle="REKAPITULASI PRESENSI / DAFTAR HADIR SISWA"
                subTitle={`Bulan: ${INDO_MONTHS[selectedMonthNum - 1]} ${selectedYear} • ${schoolInfo.className} • Tahun Ajaran ${schoolInfo.academicYear}`}
              />

              {/* Information Strip */}
              <div className="mt-4 p-2.5 bg-slate-50 border border-black rounded text-xs grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div>
                  <span className="text-slate-600 block text-[10px]">Kelas & Fase:</span>
                  <span className="font-bold">{schoolInfo.className} / {schoolInfo.phase}</span>
                </div>
                <div>
                  <span className="text-slate-600 block text-[10px]">Pola Hari Sekolah:</span>
                  <span className="font-bold">{effectiveDaysPerWeek} Hari Belajar / Minggu</span>
                </div>
                <div>
                  <span className="text-slate-600 block text-[10px]">Hari Aktif Sekolah:</span>
                  <span className="font-bold">{activeSchoolDays.join(', ')}</span>
                </div>
                <div>
                  <span className="text-slate-600 block text-[10px]">Jumlah Hari Efektif:</span>
                  <span className="font-bold">{monthEffectiveDaysCount} Hari Kerja</span>
                </div>
              </div>

              <table className="w-full text-left text-[11px] border-collapse border border-black mt-4">
                <thead>
                  <tr className="bg-slate-100 border border-black text-center font-bold">
                    <th className="border border-black p-2 w-10">No</th>
                    <th className="border border-black p-2">NISN</th>
                    <th className="border border-black p-2 text-left">Nama Siswa</th>
                    <th className="border border-black p-2 w-10">L/P</th>
                    <th className="border border-black p-2 w-16">Hadir</th>
                    <th className="border border-black p-2 w-16">Sakit</th>
                    <th className="border border-black p-2 w-16">Izin</th>
                    <th className="border border-black p-2 w-16">Alpa</th>
                    <th className="border border-black p-2 w-20">Persentase</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map(s => {
                    const stats = getStudentAttendanceStats(s.id, selectedMonth);
                    return (
                      <tr key={s.id} className="border border-black text-center">
                        <td className="border border-black p-1.5">{s.nomorAbsen}</td>
                        <td className="border border-black p-1.5 font-mono">{s.nisn}</td>
                        <td className="border border-black p-1.5 text-left font-bold">{s.nama}</td>
                        <td className="border border-black p-1.5">{s.jenisKelamin}</td>
                        <td className="border border-black p-1.5 font-semibold text-black">{stats.hadir}</td>
                        <td className="border border-black p-1.5">{stats.sakit}</td>
                        <td className="border border-black p-1.5">{stats.izin}</td>
                        <td className="border border-black p-1.5">{stats.alpa}</td>
                        <td className="border border-black p-1.5 font-bold">{stats.percentage}%</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* Tanda Tangan */}
              <div className="mt-8 flex justify-between text-xs text-black pt-4 page-break-inside-avoid">
                <div className="text-center">
                  <p>Mengetahui,</p>
                  <p>Kepala Sekolah {schoolInfo.schoolName}</p>
                  <div className="h-16" />
                  <p className="font-bold underline">{schoolInfo.headmasterName}</p>
                  <p>NIP. {schoolInfo.headmasterNip}</p>
                </div>
                <div className="text-center">
                  <p>{schoolInfo.city}, {daysInMonth} {INDO_MONTHS[selectedMonthNum - 1]} {selectedYear}</p>
                  <p>Wali Kelas {schoolInfo.className}</p>
                  <div className="h-16" />
                  <p className="font-bold underline">{schoolInfo.homeroomTeacherName}</p>
                  <p>NIP. {schoolInfo.homeroomTeacherNip}</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 no-print">
              <button
                onClick={() => setIsPrintModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Tutup
              </button>
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md"
              >
                <Printer className="h-4 w-4" />
                <span>Cetak Rekap Presensi</span>
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

