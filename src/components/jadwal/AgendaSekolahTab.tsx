import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SchoolEvent } from '../../types';
import { Modal } from '../common/Modal';
import {
  Calendar,
  Clock,
  Plus,
  Trash2,
  Sparkles,
  Search,
  Filter,
  Tag,
  AlertCircle,
  CheckCircle2,
  CalendarDays
} from 'lucide-react';

export const AgendaSekolahTab: React.FC = () => {
  const {
    events,
    addEvent,
    deleteEvent,
    schoolInfo,
    currentUser,
    addToast
  } = useApp();

  const isAdmin = currentUser.role !== 'siswa';
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [isAddEventModalOpen, setIsAddEventModalOpen] = useState(false);

  const [newEvent, setNewEvent] = useState<{
    tanggal: string;
    waktu: string;
    judul: string;
    kategori: 'Sekolah' | 'Kelas' | 'Ujian' | 'Libur' | 'P5';
    deskripsi: string;
  }>({
    tanggal: new Date().toISOString().split('T')[0],
    waktu: '07:00 - 12:00 WIB',
    judul: '',
    kategori: 'Sekolah',
    deskripsi: ''
  });

  const categories = ['Semua', 'Sekolah', 'Kelas', 'Ujian', 'Libur', 'P5'];

  const getCategoryBadgeClass = (kategori: string) => {
    switch (kategori) {
      case 'Sekolah':
        return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950 dark:text-blue-300';
      case 'Kelas':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300';
      case 'Ujian':
        return 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-950 dark:text-purple-300';
      case 'Libur':
        return 'bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-950 dark:text-rose-300';
      case 'P5':
        return 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950 dark:text-amber-300';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-800 dark:text-slate-300';
    }
  };

  const safeEvents = events || [];

  const filteredEvents = safeEvents
    .filter(ev => {
      if (selectedCategory !== 'Semua' && ev.kategori !== selectedCategory) return false;
      if (!searchQuery.trim()) return true;
      return (
        ev.judul.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ev.deskripsi.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ev.tanggal.includes(searchQuery)
      );
    })
    .sort((a, b) => new Date(a.tanggal).getTime() - new Date(b.tanggal).getTime());

  const handleSaveAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvent.judul.trim()) {
      addToast('error', 'Peringatan', 'Judul agenda tidak boleh kosong.');
      return;
    }

    addEvent({
      tanggal: newEvent.tanggal,
      waktu: newEvent.waktu,
      judul: newEvent.judul.trim(),
      kategori: newEvent.kategori,
      deskripsi: newEvent.deskripsi.trim()
    });

    setIsAddEventModalOpen(false);
    setNewEvent({
      tanggal: new Date().toISOString().split('T')[0],
      waktu: '07:00 - 12:00 WIB',
      judul: '',
      kategori: 'Sekolah',
      deskripsi: ''
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50 via-indigo-50 to-slate-50 p-4 sm:p-5 dark:border-blue-900/40 dark:from-blue-950/40 dark:via-indigo-950/30 dark:to-slate-900/60 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm shadow-blue-600/30">
                <CalendarDays className="h-4 w-4" />
              </span>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                Agenda Kegiatan & Kalender Akademik SD
              </h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Menampilkan <strong className="text-blue-600 dark:text-blue-400">{events.length} Agenda Penting</strong> semester ini untuk kelas {schoolInfo.className}.
            </p>
          </div>

          {isAdmin && (
            <button
              type="button"
              onClick={() => setIsAddEventModalOpen(true)}
              className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-bold text-white shadow-md shadow-blue-600/25 hover:bg-blue-700 active:scale-95 transition-all"
            >
              <Plus className="h-4 w-4" />
              <span>+ Tambah Agenda Kegiatan</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={`cat-pill-${cat}`}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="h-3.5 w-3.5 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari judul / keterangan..."
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 py-1.5 pl-9 pr-3 text-xs text-slate-900 dark:text-white"
          />
        </div>
      </div>

      {/* Agenda Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredEvents.length === 0 ? (
          <div className="col-span-full p-8 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
            <Calendar className="h-10 w-10 text-slate-300 mx-auto" />
            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
              Tidak ada agenda kegiatan yang ditemukan
            </p>
          </div>
        ) : (
          filteredEvents.map((ev) => (
            <div
              key={`event-card-${ev.id}`}
              className="rounded-2xl border border-slate-200 bg-white p-4.5 dark:border-slate-800 dark:bg-slate-900 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-md border ${getCategoryBadgeClass(ev.kategori)}`}>
                    {ev.kategori}
                  </span>

                  <div className="flex items-center gap-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
                    <Calendar className="h-3.5 w-3.5 text-blue-500" />
                    <span>{ev.tanggal}</span>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-tight">
                    {ev.judul}
                  </h4>
                  {ev.waktu && (
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                      <Clock className="h-3 w-3 text-slate-400" />
                      <span>{ev.waktu}</span>
                    </div>
                  )}
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                  {ev.deskripsi || 'Tidak ada deskripsi rinci.'}
                </p>
              </div>

              {isAdmin && (
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`Hapus agenda "${ev.judul}"?`)) {
                        deleteEvent(ev.id);
                      }
                    }}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Hapus</span>
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* ========================================================================= */}
      {/* MODAL: TAMBAH AGENDA */}
      {/* ========================================================================= */}
      {isAddEventModalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setIsAddEventModalOpen(false)}
          title="Tambah Agenda / Kalender Sekolah"
          maxWidth="lg"
        >
          <form onSubmit={handleSaveAddEvent} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Judul Agenda Kegiatan
              </label>
              <input
                type="text"
                required
                value={newEvent.judul}
                onChange={(e) => setNewEvent(prev => ({ ...prev, judul: e.target.value }))}
                placeholder="Contoh: Asesmen Sumatif Tengah Semester / Gelar Karya P5"
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs sm:text-sm text-slate-900 dark:text-white font-medium"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  Tanggal Kegiatan
                </label>
                <input
                  type="date"
                  required
                  value={newEvent.tanggal}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, tanggal: e.target.value }))}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-xs sm:text-sm text-slate-900 dark:text-white font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  Kategori Agenda
                </label>
                <select
                  value={newEvent.kategori}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, kategori: e.target.value as any }))}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-xs sm:text-sm text-slate-900 dark:text-white font-medium"
                >
                  <option value="Sekolah">Kegiatan Sekolah</option>
                  <option value="Kelas">Kegiatan Kelas</option>
                  <option value="Ujian">Ujian / Asesmen</option>
                  <option value="Libur">Libur Nasional / Semester</option>
                  <option value="P5">Projek P5</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Waktu Pelaksanaan
              </label>
              <input
                type="text"
                value={newEvent.waktu}
                onChange={(e) => setNewEvent(prev => ({ ...prev, waktu: e.target.value }))}
                placeholder="Contoh: 07:30 - 12:00 WIB"
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs sm:text-sm text-slate-900 dark:text-white font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Deskripsi Rinci / Keterangan
              </label>
              <textarea
                rows={3}
                value={newEvent.deskripsi}
                onChange={(e) => setNewEvent(prev => ({ ...prev, deskripsi: e.target.value }))}
                placeholder="Tuliskan petunjuk teknis, peserta, lokasi, atau dresscode kegiatan..."
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs sm:text-sm text-slate-900 dark:text-white"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setIsAddEventModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Batal
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-blue-600 text-xs font-bold text-white shadow-md shadow-blue-600/30 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4" />
                <span>Simpan Agenda</span>
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
