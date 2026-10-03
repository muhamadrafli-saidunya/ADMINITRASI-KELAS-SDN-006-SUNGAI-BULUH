import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ScheduleItem } from '../../types';
import { Modal } from '../common/Modal';
import {
  Plus,
  Edit2,
  Trash2,
  Clock,
  MapPin,
  User,
  Copy,
  RotateCcw,
  Sparkles,
  BookOpen,
  AlertCircle,
  FileSpreadsheet,
  Check,
  Search,
  Filter,
  Layers,
  ChevronRight
} from 'lucide-react';

interface JadwalPelajaranAdminTabProps {
  selectedDay: string;
  setSelectedDay: (day: string) => void;
  onOpenPrint: () => void;
}

const COLOR_PRESETS = [
  { label: 'Biru (Default)', value: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300' },
  { label: 'Hijau (Bahasa / Religi)', value: 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300' },
  { label: 'Merah (Pancasila / Upacara)', value: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-300' },
  { label: 'Kuning / Amber (IPAS / Pramuka)', value: 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300' },
  { label: 'Ungu (Seni / Kreativitas)', value: 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300' },
  { label: 'Orange (PJOK / Olahraga)', value: 'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-950/40 dark:text-orange-300' },
  { label: 'Teal (Muatan Lokal)', value: 'bg-teal-100 text-teal-700 border-teal-200 dark:bg-teal-950/40 dark:text-teal-300' },
  { label: 'Cyan (Bahasa Asing)', value: 'bg-cyan-100 text-cyan-700 border-cyan-200 dark:bg-cyan-950/40 dark:text-cyan-300' }
];

export const JadwalPelajaranAdminTab: React.FC<JadwalPelajaranAdminTabProps> = ({
  selectedDay,
  setSelectedDay,
  onOpenPrint
}) => {
  const {
    schedule,
    addScheduleItem,
    updateScheduleItem,
    deleteScheduleItem,
    resetScheduleToDefault,
    duplicateDaySchedule,
    subjects,
    schoolInfo,
    addToast
  } = useApp();

  const daysOfWeek = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'] as const;

  // View style: 'timeline' or 'matrix'
  const [viewMode, setViewMode] = useState<'timeline' | 'matrix'>('timeline');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDuplicateModalOpen, setIsDuplicateModalOpen] = useState(false);

  // Add Item State
  const [newItem, setNewItem] = useState<{
    hari: 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat' | 'Sabtu';
    jamKe: number;
    waktuMulai: string;
    waktuSelesai: string;
    mapelId: string;
    guruPengampu: string;
    ruang: string;
    warnaBadge: string;
    catatanPerlengkapan: string;
    topikMateri: string;
  }>({
    hari: 'Senin',
    jamKe: 1,
    waktuMulai: '07:00',
    waktuSelesai: '07:35',
    mapelId: subjects[0]?.id || 'mapel-01',
    guruPengampu: subjects[0]?.guruPengampu || schoolInfo.homeroomTeacherName,
    ruang: `Ruang Kelas ${schoolInfo.className}`,
    warnaBadge: COLOR_PRESETS[0].value,
    catatanPerlengkapan: '',
    topikMateri: ''
  });

  // Edit Item State
  const [editingItem, setEditingItem] = useState<{
    id: string;
    hari: 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat' | 'Sabtu';
    jamKe: number;
    waktu: string;
    mapelId: string;
    guruPengampu: string;
    ruang: string;
    warnaBadge: string;
    catatanPerlengkapan: string;
    topikMateri: string;
  } | null>(null);

  // Duplicate Day State
  const [duplicateTargetDay, setDuplicateTargetDay] = useState<'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat' | 'Sabtu'>('Selasa');

  const safeSchedule = schedule || [];
  const safeSubjects = subjects || [];

  // Filtered by selected day and search
  const daySchedule = safeSchedule
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

  const handleOpenAddModal = (targetDay?: 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat' | 'Sabtu') => {
    const day = targetDay || (selectedDay as any);
    const existingInDay = schedule.filter(s => s.hari === day);
    const nextJamKe = existingInDay.length > 0 ? Math.max(...existingInDay.map(s => s.jamKe)) + 1 : 1;

    // Estimate time
    const startHour = 7 + Math.floor((nextJamKe - 1) * 35 / 60);
    const startMin = ((nextJamKe - 1) * 35) % 60;
    const endHour = 7 + Math.floor((nextJamKe * 35) / 60);
    const endMin = (nextJamKe * 35) % 60;

    const pad = (n: number) => n.toString().padStart(2, '0');
    const waktuMulai = `${pad(startHour)}:${pad(startMin)}`;
    const waktuSelesai = `${pad(endHour)}:${pad(endMin)}`;

    const firstSub = subjects[0];
    setNewItem({
      hari: day,
      jamKe: nextJamKe,
      waktuMulai,
      waktuSelesai,
      mapelId: firstSub?.id || 'mapel-01',
      guruPengampu: firstSub?.guruPengampu || schoolInfo.homeroomTeacherName,
      ruang: `Ruang Kelas ${schoolInfo.className}`,
      warnaBadge: COLOR_PRESETS[nextJamKe % COLOR_PRESETS.length].value,
      catatanPerlengkapan: '',
      topikMateri: ''
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (item: ScheduleItem) => {
    setEditingItem({
      id: item.id,
      hari: item.hari,
      jamKe: item.jamKe,
      waktu: item.waktu,
      mapelId: item.mapelId,
      guruPengampu: item.guruPengampu,
      ruang: item.ruang,
      warnaBadge: item.warnaBadge || COLOR_PRESETS[0].value,
      catatanPerlengkapan: item.catatanPerlengkapan || '',
      topikMateri: item.topikMateri || ''
    });
    setIsEditModalOpen(true);
  };

  const handleSaveAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.mapelId) {
      addToast('error', 'Gagal', 'Pilih mata pelajaran terlebih dahulu.');
      return;
    }

    const waktuFormatted = `${newItem.waktuMulai} - ${newItem.waktuSelesai}`;

    addScheduleItem({
      hari: newItem.hari,
      jamKe: Number(newItem.jamKe),
      waktu: waktuFormatted,
      mapelId: newItem.mapelId,
      guruPengampu: newItem.guruPengampu,
      ruang: newItem.ruang,
      warnaBadge: newItem.warnaBadge,
      catatanPerlengkapan: newItem.catatanPerlengkapan.trim() || undefined,
      topikMateri: newItem.topikMateri.trim() || undefined
    });

    setIsAddModalOpen(false);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    updateScheduleItem(editingItem.id, {
      hari: editingItem.hari,
      jamKe: Number(editingItem.jamKe),
      waktu: editingItem.waktu,
      mapelId: editingItem.mapelId,
      guruPengampu: editingItem.guruPengampu,
      ruang: editingItem.ruang,
      warnaBadge: editingItem.warnaBadge,
      catatanPerlengkapan: editingItem.catatanPerlengkapan.trim() || undefined,
      topikMateri: editingItem.topikMateri.trim() || undefined
    });

    setIsEditModalOpen(false);
    setEditingItem(null);
  };

  const handleDelete = (id: string, subName: string, hari: string, jamKe: number) => {
    if (confirm(`Apakah Anda yakin ingin menghapus jadwal ${subName} (Hari ${hari} Jam ke-${jamKe})?`)) {
      deleteScheduleItem(id);
    }
  };

  const handleReset = () => {
    if (confirm('Apakah Anda yakin ingin mengembalikan seluruh jadwal pelajaran ke susunan Kurikulum Merdeka default?')) {
      resetScheduleToDefault();
    }
  };

  const handleDuplicate = (e: React.FormEvent) => {
    e.preventDefault();
    if (duplicateTargetDay === selectedDay) {
      addToast('warning', 'Peringatan', 'Hari tujuan harus berbeda dengan hari sumber.');
      return;
    }
    duplicateDaySchedule(selectedDay as any, duplicateTargetDay);
    setIsDuplicateModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Action & Control Bar */}
      <div className="rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50/90 via-indigo-50/70 to-slate-50 p-4 sm:p-5 dark:border-blue-900/40 dark:from-blue-950/40 dark:via-indigo-950/30 dark:to-slate-900/60 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm shadow-blue-600/30">
                <BookOpen className="h-4 w-4" />
              </span>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                Kelola Jadwal Pelajaran Kurikulum Merdeka - {schoolInfo.className}
              </h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Total <strong className="text-blue-600 dark:text-blue-400">{schedule.length} Jam Pelajaran</strong> teralokasi • Mode Administrator (Akses Penuh Edit & Tambah)
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {/* View Mode Toggle */}
            <div className="flex rounded-xl bg-white p-1 border border-slate-200 dark:border-slate-700 dark:bg-slate-800">
              <button
                type="button"
                onClick={() => setViewMode('timeline')}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  viewMode === 'timeline'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-300'
                }`}
              >
                <span>Harian</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('matrix')}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  viewMode === 'matrix'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-300'
                }`}
              >
                <span>Matriks Mingguan</span>
              </button>
            </div>

            {/* + Tambah Jam */}
            <button
              type="button"
              onClick={() => handleOpenAddModal()}
              className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-bold text-white shadow-md shadow-blue-600/25 hover:bg-blue-700 active:scale-95 transition-all"
            >
              <Plus className="h-4 w-4" />
              <span>+ Tambah Jam Pelajaran</span>
            </button>

            {/* Salin Hari */}
            <button
              type="button"
              onClick={() => setIsDuplicateModalOpen(true)}
              className="flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 transition-colors"
              title="Salin alokasi jam dari hari ini ke hari lain"
            >
              <Copy className="h-3.5 w-3.5 text-slate-500" />
              <span className="hidden sm:inline">Salin Hari</span>
            </button>

            {/* Reset */}
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 transition-colors"
              title="Kembalikan susunan jadwal ke struktur standar"
            >
              <RotateCcw className="h-3.5 w-3.5 text-slate-500" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          </div>
        </div>
      </div>

      {/* Day Selector & Search (For Timeline Mode) */}
      {viewMode === 'timeline' && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {daysOfWeek.map((day) => {
              const count = schedule.filter(s => s.hari === day).length;
              const isSelected = selectedDay === day;
              return (
                <button
                  key={`admin-day-btn-${day}`}
                  type="button"
                  onClick={() => setSelectedDay(day)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                  }`}
                >
                  Hari {day} <span className="ml-1 opacity-80">({count} JP)</span>
                </button>
              );
            })}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="h-3.5 w-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari mapel, guru, ruang..."
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 py-1.5 pl-9 pr-3 text-xs text-slate-900 dark:text-white"
            />
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TIMELINE VIEW (CARD-BASED) */}
      {/* ========================================================================= */}
      {viewMode === 'timeline' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>Jadwal Pelajaran Hari {selectedDay}</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 font-bold border border-blue-200 dark:border-blue-800">
                {daySchedule.length} Jam Pelajaran
              </span>
            </h4>

            <button
              type="button"
              onClick={() => handleOpenAddModal(selectedDay as any)}
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-bold flex items-center gap-1"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>+ Tambah Jam di Hari {selectedDay}</span>
            </button>
          </div>

          {daySchedule.length === 0 ? (
            <div className="p-8 text-center rounded-2xl bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-800 space-y-3">
              <div className="h-12 w-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
                <BookOpen className="h-6 w-6" />
              </div>
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                Belum ada jam pelajaran yang dijadwalkan untuk hari {selectedDay}
              </p>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Klik tombol di bawah untuk menambahkan mata pelajaran pertama Anda atau salin jadwal dari hari lain.
              </p>
              <button
                type="button"
                onClick={() => handleOpenAddModal(selectedDay as any)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 text-xs font-bold text-white shadow-md shadow-blue-600/30 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4" />
                <span>Tambah Jam Pelajaran</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {daySchedule.map((item, idx) => {
                const sub = subjects.find(s => s.id === item.mapelId);
                const subName = sub?.nama || 'Upacara / Pembiasaan';
                const subKode = sub?.kode || 'UPACARA';

                return (
                  <div
                    key={`admin-sch-card-${item.id || idx}`}
                    className="rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-sm p-4 flex flex-col justify-between hover:shadow-md transition-all group"
                  >
                    <div className="space-y-3">
                      {/* Jam Ke & Time Badge */}
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-black px-2.5 py-1 rounded-lg border ${item.warnaBadge || COLOR_PRESETS[0].value}`}>
                          Jam ke-{item.jamKe}
                        </span>

                        <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                          <Clock className="h-3 w-3 text-slate-400" />
                          <span>{item.waktu}</span>
                        </div>
                      </div>

                      {/* Mapel Title */}
                      <div>
                        <div className="flex items-center justify-between gap-1">
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                            {subName}
                          </h4>
                          <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                            {subKode}
                          </span>
                        </div>
                        {item.topikMateri && (
                          <p className="text-[11px] text-blue-600 dark:text-blue-400 font-medium mt-0.5">
                            Materi: {item.topikMateri}
                          </p>
                        )}
                      </div>

                      {/* Info Detail */}
                      <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300 pt-1 border-t border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-2">
                          <User className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                          <span className="truncate font-medium">{item.guruPengampu}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                          <span className="truncate text-[11px] text-slate-500">{item.ruang}</span>
                        </div>

                        {item.catatanPerlengkapan && (
                          <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 text-[11px] text-amber-800 dark:text-amber-300 font-medium leading-tight">
                            📌 {item.catatanPerlengkapan}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Bar (Edit & Delete) */}
                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => handleOpenEditModal(item)}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/60 dark:text-blue-300 transition-colors"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                        <span>Edit</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(item.id, subName, item.hari, item.jamKe)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                        title="Hapus jam ini"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* MATRIX VIEW (ALL DAYS IN A TABLE) */}
      {/* ========================================================================= */}
      {viewMode === 'matrix' && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 shadow-sm overflow-hidden space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Matriks Struktur Jadwal Pelajaran Mingguan Kelas {schoolInfo.className}
            </h4>
            <span className="text-xs text-slate-500">Klik tombol edit pada tiap kartu untuk mengubah</span>
          </div>

          <div className="overflow-x-auto">
            <div className="grid grid-cols-6 gap-3 min-w-[900px]">
              {daysOfWeek.map((day) => {
                const dayItems = schedule.filter(s => s.hari === day).sort((a, b) => a.jamKe - b.jamKe);
                return (
                  <div
                    key={`matrix-col-${day}`}
                    className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 flex flex-col"
                  >
                    <div className="p-2.5 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 rounded-t-xl flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider">{day}</span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                        {dayItems.length} JP
                      </span>
                    </div>

                    <div className="p-2 space-y-2 flex-1">
                      {dayItems.map((item) => {
                        const sub = subjects.find(s => s.id === item.mapelId);
                        return (
                          <div
                            key={`matrix-item-${item.id}`}
                            onClick={() => handleOpenEditModal(item)}
                            className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs hover:border-blue-500 cursor-pointer shadow-2xs transition-all"
                          >
                            <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold mb-1">
                              <span>Jam ke-{item.jamKe}</span>
                              <span>{item.waktu.split('-')[0].trim()}</span>
                            </div>
                            <p className="font-bold text-slate-900 dark:text-white text-[11px] truncate">
                              {sub?.nama || 'Upacara'}
                            </p>
                            <p className="text-[10px] text-slate-500 truncate mt-0.5">
                              {item.guruPengampu.split(',')[0]}
                            </p>
                          </div>
                        );
                      })}

                      <button
                        type="button"
                        onClick={() => handleOpenAddModal(day as any)}
                        className="w-full py-1.5 rounded-lg border border-dashed border-slate-300 dark:border-slate-700 text-[11px] font-semibold text-slate-500 hover:text-blue-600 hover:border-blue-400 transition-colors"
                      >
                        + Tambah
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: TAMBAH JAM PELAJARAN BARU */}
      {/* ========================================================================= */}
      {isAddModalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setIsAddModalOpen(false)}
          title="Tambah Jam Pelajaran Baru"
          maxWidth="2xl"
        >
          <form onSubmit={handleSaveAdd} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Hari */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  Hari Pelajaran
                </label>
                <select
                  value={newItem.hari}
                  onChange={(e) => setNewItem(prev => ({ ...prev, hari: e.target.value as any }))}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-xs sm:text-sm text-slate-900 dark:text-white font-medium"
                >
                  {daysOfWeek.map(d => (
                    <option key={`opt-day-${d}`} value={d}>Hari {d}</option>
                  ))}
                </select>
              </div>

              {/* Jam Ke */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  Jam Ke-
                </label>
                <input
                  type="number"
                  min="1"
                  max="12"
                  required
                  value={newItem.jamKe}
                  onChange={(e) => setNewItem(prev => ({ ...prev, jamKe: parseInt(e.target.value) || 1 }))}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-xs sm:text-sm text-slate-900 dark:text-white font-medium"
                />
              </div>

              {/* Rentang Waktu */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  Waktu (Mulai - Selesai)
                </label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="time"
                    required
                    value={newItem.waktuMulai}
                    onChange={(e) => setNewItem(prev => ({ ...prev, waktuMulai: e.target.value }))}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-xs text-slate-900 dark:text-white font-medium"
                  />
                  <span>-</span>
                  <input
                    type="time"
                    required
                    value={newItem.waktuSelesai}
                    onChange={(e) => setNewItem(prev => ({ ...prev, waktuSelesai: e.target.value }))}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-xs text-slate-900 dark:text-white font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Mata Pelajaran Selector */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Pilih Mata Pelajaran
              </label>
              <select
                value={newItem.mapelId}
                onChange={(e) => {
                  const selSub = subjects.find(s => s.id === e.target.value);
                  setNewItem(prev => ({
                    ...prev,
                    mapelId: e.target.value,
                    guruPengampu: selSub?.guruPengampu || prev.guruPengampu
                  }));
                }}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs sm:text-sm text-slate-900 dark:text-white font-medium"
              >
                {subjects.map(s => (
                  <option key={`opt-sub-${s.id}`} value={s.id}>
                    [{s.kode}] {s.nama} ({s.kelompok})
                  </option>
                ))}
              </select>
            </div>

            {/* Guru Pengampu & Ruang Kelas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  Guru Pengampu / Penanggung Jawab
                </label>
                <input
                  type="text"
                  required
                  value={newItem.guruPengampu}
                  onChange={(e) => setNewItem(prev => ({ ...prev, guruPengampu: e.target.value }))}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs sm:text-sm text-slate-900 dark:text-white font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  Ruang Kelas / Lokasi
                </label>
                <input
                  type="text"
                  required
                  value={newItem.ruang}
                  onChange={(e) => setNewItem(prev => ({ ...prev, ruang: e.target.value }))}
                  placeholder="Contoh: Ruang Kelas 4A / Lapangan / Lab IPA"
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs sm:text-sm text-slate-900 dark:text-white font-medium"
                />
              </div>
            </div>

            {/* Tema Warna Badge */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Pilih Warna Tema Kartu
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {COLOR_PRESETS.map((color, cIdx) => (
                  <button
                    key={`color-preset-${cIdx}`}
                    type="button"
                    onClick={() => setNewItem(prev => ({ ...prev, warnaBadge: color.value }))}
                    className={`p-2 rounded-xl border text-xs font-bold text-left transition-all ${
                      newItem.warnaBadge === color.value
                        ? 'ring-2 ring-blue-500 border-blue-500 scale-[1.02]'
                        : 'border-slate-200 dark:border-slate-700 hover:border-slate-400'
                    } ${color.value}`}
                  >
                    {color.label.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Catatan Perlengkapan / PR Siswa */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Catatan Perlengkapan / Buku yang Perlu Dibawa Siswa (Opsional)
              </label>
              <input
                type="text"
                value={newItem.catatanPerlengkapan}
                onChange={(e) => setNewItem(prev => ({ ...prev, catatanPerlengkapan: e.target.value }))}
                placeholder="Contoh: Baju olahraga, krayon & buku gambar A3, atau penggaris 30cm"
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs sm:text-sm text-slate-900 dark:text-white font-medium"
              />
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Batal
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-blue-600 text-xs font-bold text-white shadow-md shadow-blue-600/30 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4" />
                <span>Simpan Jadwal Pelajaran</span>
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* ========================================================================= */}
      {/* MODAL: EDIT JAM PELAJARAN */}
      {/* ========================================================================= */}
      {isEditModalOpen && editingItem && (
        <Modal
          isOpen={true}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingItem(null);
          }}
          title={`Edit Jadwal Pelajaran (Hari ${editingItem.hari} Jam ke-${editingItem.jamKe})`}
          maxWidth="2xl"
        >
          <form onSubmit={handleSaveEdit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Hari */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  Hari Pelajaran
                </label>
                <select
                  value={editingItem.hari}
                  onChange={(e) => setEditingItem(prev => prev ? ({ ...prev, hari: e.target.value as any }) : null)}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-xs sm:text-sm text-slate-900 dark:text-white font-medium"
                >
                  {daysOfWeek.map(d => (
                    <option key={`edit-opt-day-${d}`} value={d}>Hari {d}</option>
                  ))}
                </select>
              </div>

              {/* Jam Ke */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  Jam Ke-
                </label>
                <input
                  type="number"
                  min="1"
                  max="12"
                  required
                  value={editingItem.jamKe}
                  onChange={(e) => setEditingItem(prev => prev ? ({ ...prev, jamKe: parseInt(e.target.value) || 1 }) : null)}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-xs sm:text-sm text-slate-900 dark:text-white font-medium"
                />
              </div>

              {/* Waktu Jam Pelajaran */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  Waktu Jam Pelajaran
                </label>
                <input
                  type="text"
                  required
                  value={editingItem.waktu}
                  onChange={(e) => setEditingItem(prev => prev ? ({ ...prev, waktu: e.target.value }) : null)}
                  placeholder="07:00 - 07:35"
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-xs sm:text-sm text-slate-900 dark:text-white font-medium"
                />
              </div>
            </div>

            {/* Mata Pelajaran Selector */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Pilih Mata Pelajaran
              </label>
              <select
                value={editingItem.mapelId}
                onChange={(e) => {
                  const selSub = subjects.find(s => s.id === e.target.value);
                  setEditingItem(prev => prev ? ({
                    ...prev,
                    mapelId: e.target.value,
                    guruPengampu: selSub?.guruPengampu || prev.guruPengampu
                  }) : null);
                }}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs sm:text-sm text-slate-900 dark:text-white font-medium"
              >
                {subjects.map(s => (
                  <option key={`edit-opt-sub-${s.id}`} value={s.id}>
                    [{s.kode}] {s.nama} ({s.kelompok})
                  </option>
                ))}
              </select>
            </div>

            {/* Guru & Ruang */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  Guru Pengampu
                </label>
                <input
                  type="text"
                  required
                  value={editingItem.guruPengampu}
                  onChange={(e) => setEditingItem(prev => prev ? ({ ...prev, guruPengampu: e.target.value }) : null)}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs sm:text-sm text-slate-900 dark:text-white font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  Ruang Kelas
                </label>
                <input
                  type="text"
                  required
                  value={editingItem.ruang}
                  onChange={(e) => setEditingItem(prev => prev ? ({ ...prev, ruang: e.target.value }) : null)}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs sm:text-sm text-slate-900 dark:text-white font-medium"
                />
              </div>
            </div>

            {/* Tema Warna Badge */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Pilih Warna Tema Kartu
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {COLOR_PRESETS.map((color, cIdx) => (
                  <button
                    key={`edit-color-preset-${cIdx}`}
                    type="button"
                    onClick={() => setEditingItem(prev => prev ? ({ ...prev, warnaBadge: color.value }) : null)}
                    className={`p-2 rounded-xl border text-xs font-bold text-left transition-all ${
                      editingItem.warnaBadge === color.value
                        ? 'ring-2 ring-blue-500 border-blue-500 scale-[1.02]'
                        : 'border-slate-200 dark:border-slate-700 hover:border-slate-400'
                    } ${color.value}`}
                  >
                    {color.label.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Catatan Perlengkapan */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Catatan Perlengkapan / PR Siswa (Opsional)
              </label>
              <input
                type="text"
                value={editingItem.catatanPerlengkapan}
                onChange={(e) => setEditingItem(prev => prev ? ({ ...prev, catatanPerlengkapan: e.target.value }) : null)}
                placeholder="Contoh: Bawa buku gambar A3 & pensil warna"
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs sm:text-sm text-slate-900 dark:text-white font-medium"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => {
                  const sub = subjects.find(s => s.id === editingItem.mapelId);
                  handleDelete(editingItem.id, sub?.nama || 'Mapel', editingItem.hari, editingItem.jamKe);
                  setIsEditModalOpen(false);
                  setEditingItem(null);
                }}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl"
              >
                <Trash2 className="h-4 w-4" />
                <span>Hapus Jam Ini</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setEditingItem(null);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-blue-600 text-xs font-bold text-white shadow-md shadow-blue-600/30 hover:bg-blue-700"
                >
                  <Check className="h-4 w-4" />
                  <span>Simpan Perubahan</span>
                </button>
              </div>
            </div>
          </form>
        </Modal>
      )}

      {/* ========================================================================= */}
      {/* MODAL: SALIN JADWAL HARI */}
      {/* ========================================================================= */}
      {isDuplicateModalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setIsDuplicateModalOpen(false)}
          title={`Salin Jadwal Hari ${selectedDay}`}
          maxWidth="md"
        >
          <form onSubmit={handleDuplicate} className="space-y-4">
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Anda akan menyalin seluruh susunan jam pelajaran ({schedule.filter(s => s.hari === selectedDay).length} JP) dari <strong>Hari {selectedDay}</strong> ke hari tujuan pilihan Anda di bawah ini:
            </p>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Pilih Hari Tujuan
              </label>
              <select
                value={duplicateTargetDay}
                onChange={(e) => setDuplicateTargetDay(e.target.value as any)}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs sm:text-sm text-slate-900 dark:text-white font-medium"
              >
                {daysOfWeek
                  .filter(d => d !== selectedDay)
                  .map(d => (
                    <option key={`dup-opt-target-${d}`} value={d}>Hari {d}</option>
                  ))}
              </select>
            </div>

            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 text-[11px] text-amber-800 dark:text-amber-300">
              ⚠️ Catatan: Jadwal yang sudah ada di hari tujuan akan ditimpa dengan salinan hari {selectedDay}.
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setIsDuplicateModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Batal
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-blue-600 text-xs font-bold text-white shadow-md shadow-blue-600/30 hover:bg-blue-700"
              >
                <Copy className="h-4 w-4" />
                <span>Salin Sekarang</span>
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
