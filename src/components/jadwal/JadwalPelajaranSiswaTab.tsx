import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { ScheduleItem } from '../../types';
import {
  Clock,
  MapPin,
  User,
  BookOpen,
  Calendar,
  Sparkles,
  Search,
  CheckCircle2,
  Brush,
  Printer,
  Compass,
  AlertCircle,
  HelpCircle,
  FileText
} from 'lucide-react';

interface JadwalPelajaranSiswaTabProps {
  selectedDay: string;
  setSelectedDay: (day: string) => void;
  onOpenPrint: () => void;
}

export const JadwalPelajaranSiswaTab: React.FC<JadwalPelajaranSiswaTabProps> = ({
  selectedDay,
  setSelectedDay,
  onOpenPrint
}) => {
  const {
    schedule,
    subjects,
    cleaningDuties,
    currentUser,
    students,
    schoolInfo
  } = useApp();

  const daysOfWeek = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'] as const;
  const [viewMode, setViewMode] = useState<'daily' | 'weekly'>('daily');
  const [searchQuery, setSearchQuery] = useState('');

  // Find currently logged-in student info (if role is siswa)
  const currentStudent = useMemo(() => {
    const safeStudents = students || [];
    if (currentUser.role !== 'siswa') return null;
    return (
      safeStudents.find(s => s.id === currentUser.id) ||
      safeStudents.find(s => s.nama.toLowerCase().includes(currentUser.name.toLowerCase())) ||
      safeStudents[0]
    );
  }, [currentUser, students]);

  // Determine current day of week in Indonesian
  const todayIndonesian = useMemo(() => {
    const dayIndex = new Date().getDay(); // 0 = Minggu, 1 = Senin, ...
    const indonesianDays = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    return indonesianDays[dayIndex] || 'Senin';
  }, []);

  // Today's schedule items
  const todaySchedule = useMemo(() => {
    const safeSchedule = schedule || [];
    const target = daysOfWeek.includes(todayIndonesian as any) ? todayIndonesian : 'Senin';
    return safeSchedule.filter(s => s.hari === target).sort((a, b) => a.jamKe - b.jamKe);
  }, [schedule, todayIndonesian]);

  // Is current student on cleaning duty today?
  const todayDuty = useMemo(() => {
    const safeDuties = cleaningDuties || [];
    const target = daysOfWeek.includes(todayIndonesian as any) ? todayIndonesian : 'Senin';
    return safeDuties.find(d => d.hari === target);
  }, [cleaningDuties, todayIndonesian]);

  const isStudentDutyToday = useMemo(() => {
    if (!currentStudent || !todayDuty || !Array.isArray(todayDuty.siswaIds)) return false;
    return todayDuty.siswaIds.includes(currentStudent.id);
  }, [currentStudent, todayDuty]);

  // Filtered schedule for display
  const filteredDailySchedule = useMemo(() => {
    const safeSchedule = schedule || [];
    const safeSubjects = subjects || [];
    return safeSchedule
      .filter(s => s.hari === selectedDay)
      .filter(s => {
        if (!searchQuery.trim()) return true;
        const sub = safeSubjects.find(item => item.id === s.mapelId);
        const subName = sub?.nama || '';
        return (
          subName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.guruPengampu.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.ruang.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (s.catatanPerlengkapan && s.catatanPerlengkapan.toLowerCase().includes(searchQuery.toLowerCase()))
        );
      })
      .sort((a, b) => a.jamKe - b.jamKe);
  }, [schedule, selectedDay, searchQuery, subjects]);

  return (
    <div className="space-y-6">
      {/* Student Welcome & Live Today Overview Banner */}
      <div className="rounded-3xl border border-blue-200/80 bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 p-6 text-white shadow-xl relative overflow-hidden">
        {/* Background decorative circles */}
        <div className="absolute -right-10 -bottom-10 h-48 w-48 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="absolute left-1/2 -top-10 h-32 w-32 rounded-full bg-indigo-400/20 blur-xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold">
              <Sparkles className="h-3.5 w-3.5 text-amber-300" />
              <span>Jadwal Pelajaran Siswa • Kelas {schoolInfo.className}</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black tracking-tight">
              {currentStudent ? `Halo, ${currentStudent.nama}!` : 'Selamat Datang, Siswa Kelas 4A!'}
            </h2>

            <p className="text-xs sm:text-sm text-blue-100 max-w-xl leading-relaxed">
              Hari ini adalah <strong>Hari {todayIndonesian}</strong>. Persiapkan buku pelajaran, perlengkapan tugas, dan cek tugas piket harianmu di bawah ini.
            </p>
          </div>

          {/* Quick Stat Pill & Print Button */}
          <div className="flex flex-wrap items-center gap-3">
            {todayDuty && isStudentDutyToday && (
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-amber-400 text-amber-950 font-bold text-xs shadow-lg animate-pulse">
                <Brush className="h-4 w-4" />
                <span>Kamu Bertugas Piket Hari Ini!</span>
              </div>
            )}

            <button
              type="button"
              onClick={onOpenPrint}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white text-blue-700 font-bold text-xs shadow-lg hover:bg-blue-50 active:scale-95 transition-all"
            >
              <Printer className="h-4 w-4" />
              <span>Cetak Jadwal Pelajaran</span>
            </button>
          </div>
        </div>

        {/* Live Today's Schedule Quick Cards */}
        <div className="mt-6 pt-5 border-t border-white/20 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {todaySchedule.slice(0, 6).map((item, idx) => {
            const sub = subjects.find(s => s.id === item.mapelId);
            return (
              <div
                key={`today-mini-${item.id || idx}`}
                className="bg-white/10 hover:bg-white/15 backdrop-blur-md rounded-2xl p-2.5 border border-white/15 transition-all"
              >
                <div className="flex items-center justify-between text-[10px] text-blue-200 font-semibold mb-1">
                  <span>Jam {item.jamKe}</span>
                  <span>{item.waktu.split('-')[0].trim()}</span>
                </div>
                <p className="text-xs font-black text-white truncate">
                  {sub?.nama || 'Upacara'}
                </p>
                <p className="text-[10px] text-blue-100 truncate mt-0.5 opacity-90">
                  {item.ruang}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main View Selector & Filter Tabs */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* View Mode Toggle */}
        <div className="flex items-center gap-2">
          <div className="flex rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
            <button
              type="button"
              onClick={() => setViewMode('daily')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'daily'
                  ? 'bg-white text-blue-700 shadow-sm dark:bg-slate-700 dark:text-white'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-300'
              }`}
            >
              <Calendar className="h-3.5 w-3.5" />
              <span>Tampilan Harian</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('weekly')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'weekly'
                  ? 'bg-white text-blue-700 shadow-sm dark:bg-slate-700 dark:text-white'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-300'
              }`}
            >
              <BookOpen className="h-3.5 w-3.5" />
              <span>Matriks Mingguan</span>
            </button>
          </div>
        </div>

        {/* Search Field */}
        <div className="relative w-full sm:w-72">
          <Search className="h-4 w-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama pelajaran / guru..."
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 py-1.5 pl-9 pr-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Day Selector Buttons for Daily Mode */}
      {viewMode === 'daily' && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {daysOfWeek.map((day) => {
            const isSelected = selectedDay === day;
            const count = schedule.filter(s => s.hari === day).length;
            const isToday = todayIndonesian === day;

            return (
              <button
                key={`stu-day-${day}`}
                type="button"
                onClick={() => setSelectedDay(day)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 scale-100'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200'
                }`}
              >
                <span>{day}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                }`}>
                  {count} JP
                </span>
                {isToday && (
                  <span className="h-2 w-2 rounded-full bg-emerald-400" title="Hari Ini" />
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* ========================================================================= */}
      {/* DAILY VIEW: INTERACTIVE CARDS FOR STUDENTS */}
      {/* ========================================================================= */}
      {viewMode === 'daily' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>Jadwal Hari {selectedDay}</span>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                ({filteredDailySchedule.length} Mata Pelajaran)
              </span>
            </h3>
          </div>

          {filteredDailySchedule.length === 0 ? (
            <div className="p-8 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
              <BookOpen className="h-10 w-10 text-slate-300 mx-auto" />
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                Tidak ada jadwal pelajaran yang ditemukan
              </p>
              <p className="text-xs text-slate-500">
                Coba ubah kata kunci pencarian atau pilih hari lainnya.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDailySchedule.map((item, idx) => {
                const sub = subjects.find(s => s.id === item.mapelId);
                const subName = sub?.nama || 'Upacara / Pembiasaan';
                const subKode = sub?.kode || 'UPACARA';

                return (
                  <div
                    key={`stu-sch-card-${item.id || idx}`}
                    className="rounded-3xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div className="space-y-3.5">
                      {/* Top Header with Jam Ke & Time */}
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-black px-3 py-1 rounded-xl border ${item.warnaBadge || 'bg-blue-100 text-blue-700 border-blue-200'}`}>
                          Jam ke-{item.jamKe}
                        </span>

                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-xl">
                          <Clock className="h-3.5 w-3.5 text-blue-500" />
                          <span>{item.waktu}</span>
                        </div>
                      </div>

                      {/* Mapel Title */}
                      <div>
                        <div className="flex items-center justify-between gap-1">
                          <h4 className="text-base font-black text-slate-900 dark:text-white leading-tight">
                            {subName}
                          </h4>
                          <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                            {subKode}
                          </span>
                        </div>

                        {item.topikMateri && (
                          <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold mt-1">
                            📖 Topik: {item.topikMateri}
                          </p>
                        )}
                      </div>

                      {/* Info Detail (Teacher & Room) */}
                      <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300 pt-2 border-t border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-slate-400 shrink-0" />
                          <span className="font-semibold">{item.guruPengampu}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
                          <span className="text-slate-500">{item.ruang}</span>
                        </div>
                      </div>

                      {/* Checklist Perlengkapan Siswa */}
                      {item.catatanPerlengkapan ? (
                        <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-xs text-amber-900 dark:text-amber-200 space-y-1">
                          <div className="flex items-center gap-1.5 font-bold">
                            <AlertCircle className="h-3.5 w-3.5 text-amber-600" />
                            <span>Perlengkapan yang Perlu Dibawa:</span>
                          </div>
                          <p className="text-[11px] leading-relaxed pl-5 font-medium">
                            {item.catatanPerlengkapan}
                          </p>
                        </div>
                      ) : (
                        <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                          <span>Membawa buku paket & buku catatan {subName}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* WEEKLY MATRIX VIEW (COMPLETE TIMETABLE FOR STUDENTS) */}
      {/* ========================================================================= */}
      {viewMode === 'weekly' && (
        <div className="rounded-3xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 shadow-sm overflow-hidden space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                Tabel Lengkap Jadwal Pelajaran Mingguan (Senin - Sabtu)
              </h3>
              <p className="text-xs text-slate-500">
                Susunan alokasi mata pelajaran lengkap kelas {schoolInfo.className}
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <div className="grid grid-cols-6 gap-3 min-w-[850px]">
              {daysOfWeek.map((day) => {
                const dayItems = schedule.filter(s => s.hari === day).sort((a, b) => a.jamKe - b.jamKe);
                const isToday = todayIndonesian === day;

                return (
                  <div
                    key={`stu-matrix-col-${day}`}
                    className={`rounded-2xl border flex flex-col transition-all ${
                      isToday
                        ? 'border-blue-400 bg-blue-50/40 dark:border-blue-700 dark:bg-blue-950/20 shadow-xs'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/30'
                    }`}
                  >
                    <div className={`p-3 border-b rounded-t-2xl flex items-center justify-between ${
                      isToday
                        ? 'bg-blue-600 text-white'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white'
                    }`}>
                      <span className="font-bold text-xs uppercase tracking-wider">{day}</span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        isToday ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                      }`}>
                        {dayItems.length} JP
                      </span>
                    </div>

                    <div className="p-2 space-y-2 flex-1">
                      {dayItems.map((item) => {
                        const sub = subjects.find(s => s.id === item.mapelId);
                        return (
                          <div
                            key={`stu-matrix-item-${item.id}`}
                            className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs shadow-2xs space-y-1"
                          >
                            <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold">
                              <span>Jam {item.jamKe}</span>
                              <span>{item.waktu.split('-')[0].trim()}</span>
                            </div>
                            <p className="font-bold text-slate-900 dark:text-white text-xs truncate">
                              {sub?.nama || 'Upacara'}
                            </p>
                            <p className="text-[10px] text-slate-500 truncate">
                              {item.guruPengampu.split(',')[0]}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Info Card: Tips Belajar & Jadwal Meja */}
      <div className="rounded-3xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
            <BookOpen className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
              Siapkan Buku Pelajaran di Malam Hari Sebelum Tidur
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Merapikan tas sekolah sesuai jadwal pelajaran dapat mencegah ketinggalan buku dan tugas PR.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenPrint}
          className="shrink-0 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-200 transition-colors flex items-center gap-1.5"
        >
          <Printer className="h-3.5 w-3.5" />
          <span>Cetak Jadwal</span>
        </button>
      </div>
    </div>
  );
};
