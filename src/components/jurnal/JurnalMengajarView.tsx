import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { JournalEntry } from '../../types';
import { Modal } from '../common/Modal';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { HeaderKopSekolah } from '../common/HeaderKopSekolah';
import {
  BookOpenCheck,
  Plus,
  Printer,
  Search,
  Calendar,
  Clock,
  Check,
  Edit2,
  Trash2,
  BookOpen,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

export const JurnalMengajarView: React.FC = () => {
  const {
    journals,
    subjects,
    addJournal,
    updateJournal,
    deleteJournal,
    schoolInfo,
    currentUser,
    addToast
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('Semua');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingJournal, setEditingJournal] = useState<JournalEntry | null>(null);
  const [journalToDelete, setJournalToDelete] = useState<JournalEntry | null>(null);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  const [formData, setFormData] = useState<Omit<JournalEntry, 'id'>>({
    tanggal: '2026-08-17',
    jamKe: '1-2',
    mapelId: subjects[0]?.id || 'mapel-01',
    materi: '',
    tujuanPembelajaran: '',
    kegiatan: '',
    kehadiran: 'Hadir 12/12 Siswa Lengkap',
    catatan: 'Pembelajaran berjalan lancar dan aktif.',
    status: 'Terlaksana'
  });

  const handleOpenAdd = () => {
    setFormData({
      tanggal: '2026-08-17',
      jamKe: '1-2',
      mapelId: subjects[0]?.id || 'mapel-01',
      materi: '',
      tujuanPembelajaran: '',
      kegiatan: '',
      kehadiran: 'Hadir 12/12 Siswa Lengkap',
      catatan: 'Peserta didik antusias dan aktif berdiskusi dalam kelompok.',
      status: 'Terlaksana'
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (journal: JournalEntry) => {
    setEditingJournal(journal);
    setFormData({
      tanggal: journal.tanggal,
      jamKe: journal.jamKe,
      mapelId: journal.mapelId,
      materi: journal.materi,
      tujuanPembelajaran: journal.tujuanPembelajaran,
      kegiatan: journal.kegiatan,
      kehadiran: journal.kehadiran,
      catatan: journal.catatan,
      status: journal.status
    });
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.materi.trim()) {
      addToast('error', 'Materi Wajib Diisi', 'Silakan masukkan materi pembelajaran.');
      return;
    }

    if (editingJournal) {
      updateJournal(editingJournal.id, formData);
      setEditingJournal(null);
    } else {
      addJournal(formData);
      setIsAddModalOpen(false);
    }
  };

  const safeJournals = journals || [];
  const safeSubjects = subjects || [];

  const filteredJournals = safeJournals.filter(j => {
    const sub = safeSubjects.find(s => s.id === j.mapelId);
    const matchSearch =
      j.materi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.kegiatan.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (sub && sub.nama.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchSubject = subjectFilter === 'Semua' || j.mapelId === subjectFilter;
    return matchSearch && matchSubject;
  });

  const isTeacherOrAdmin = currentUser.role !== 'siswa';

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-600 dark:bg-cyan-950/60 dark:text-cyan-400">
              <BookOpenCheck className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Buku Agenda & Jurnal Harian Guru
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Pencatatan kegiatan belajar mengajar harian, tujuan pembelajaran, dan evaluasi kelas
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {isTeacherOrAdmin && (
              <button
                onClick={handleOpenAdd}
                className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-700 active:scale-95 transition-all"
              >
                <Plus className="h-4 w-4" />
                <span>Tambah Jurnal Harian</span>
              </button>
            )}

            <button
              onClick={() => setIsPrintModalOpen(true)}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <Printer className="h-4 w-4 text-slate-500" />
              <span>Cetak Buku Jurnal</span>
            </button>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="relative sm:col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Cari materi, kegiatan, atau mata pelajaran..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2 pl-9 pr-3 text-xs text-slate-800 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
          </div>

          <div>
            <select
              value={subjectFilter}
              onChange={e => setSubjectFilter(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2 px-3 text-xs text-slate-800 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            >
              <option value="Semua">Semua Mata Pelajaran</option>
              {subjects.map(s => (
                <option key={s.id} value={s.id}>{s.nama}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Journal Cards List */}
      <div className="space-y-4">
        {filteredJournals.map(journal => {
          const subject = subjects.find(s => s.id === journal.mapelId);

          return (
            <div
              key={journal.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-all"
            >
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-xs px-2.5 py-1 rounded-lg bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                      {subject?.nama || 'Mata Pelajaran'} ({subject?.kode})
                    </span>
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-blue-600" />
                      {journal.tanggal} • Jam ke-{journal.jamKe}
                    </span>
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-300 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      {journal.status}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 dark:text-white pt-1">
                    Materi: {journal.materi}
                  </h3>

                  <p className="text-xs text-blue-700 dark:text-blue-400 font-medium">
                    Tujuan Pembelajaran: {journal.tujuanPembelajaran}
                  </p>

                  <div className="pt-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                    <span className="font-bold text-slate-800 dark:text-slate-200">Sintaks / Kegiatan Pembelajaran:</span>
                    <p className="mt-1">{journal.kegiatan}</p>
                  </div>

                  {/* Refleksi & Kehadiran */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 text-xs text-slate-500 dark:text-slate-400">
                    <span>Kehadiran: <strong className="text-slate-700 dark:text-slate-200">{journal.kehadiran}</strong></span>
                    <span>Refleksi: <em className="text-slate-600 dark:text-slate-300">"{journal.catatan}"</em></span>
                  </div>
                </div>

                {/* Actions */}
                {isTeacherOrAdmin && (
                  <div className="flex items-center gap-1 self-end md:self-start shrink-0">
                    <button
                      onClick={() => handleOpenEdit(journal)}
                      className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-blue-600 dark:hover:bg-slate-800 dark:hover:text-blue-400"
                      title="Edit Jurnal"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setJournalToDelete(journal)}
                      className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-rose-600 dark:hover:bg-slate-800 dark:hover:text-rose-400"
                      title="Hapus Jurnal"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Tambah / Edit Jurnal */}
      <Modal
        isOpen={isAddModalOpen || editingJournal !== null}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingJournal(null);
        }}
        title={editingJournal ? 'Edit Jurnal Harian Mengajar' : 'Catat Jurnal Mengajar Baru'}
        subtitle="Dokumentasikan proses pembelajaran di kelas sesuai Modul Ajar"
        maxWidth="2xl"
        icon={<BookOpenCheck className="h-5 w-5 text-blue-600" />}
      >
        <form onSubmit={handleSaveForm} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Tanggal Pembelajaran *
              </label>
              <input
                type="date"
                required
                value={formData.tanggal}
                onChange={e => setFormData({ ...formData, tanggal: e.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-800 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Jam Pelajaran Ke-
              </label>
              <input
                type="text"
                value={formData.jamKe}
                onChange={e => setFormData({ ...formData, jamKe: e.target.value })}
                placeholder="Contoh: 1-2 (07.00 - 08.10)"
                className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-800 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Mata Pelajaran *
              </label>
              <select
                value={formData.mapelId}
                onChange={e => setFormData({ ...formData, mapelId: e.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-800 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                {subjects.map(s => (
                  <option key={s.id} value={s.id}>{s.nama} ({s.kode})</option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Materi Pokok / Bab *
              </label>
              <input
                type="text"
                required
                value={formData.materi}
                onChange={e => setFormData({ ...formData, materi: e.target.value })}
                placeholder="Contoh: Bagian Tubuh Tumbuhan dan Fungsinya (Akar, Batang, Daun)"
                className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-800 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Tujuan Pembelajaran (TP)
              </label>
              <input
                type="text"
                value={formData.tujuanPembelajaran}
                onChange={e => setFormData({ ...formData, tujuanPembelajaran: e.target.value })}
                placeholder="Peserta didik mampu mengidentifikasi dan menjelaskan fungsi bagian tumbuhan"
                className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-800 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Ringkasan Kegiatan Pembelajaran (Pendahuluan, Inti, Penutup)
              </label>
              <textarea
                rows={3}
                value={formData.kegiatan}
                onChange={e => setFormData({ ...formData, kegiatan: e.target.value })}
                placeholder="Guru membuka pelajaran dengan apersepsi, pengamatan spesimen nyata di halaman sekolah, diskusi kelompok, dan presentasi..."
                className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-800 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Kehadiran Siswa
              </label>
              <input
                type="text"
                value={formData.kehadiran}
                onChange={e => setFormData({ ...formData, kehadiran: e.target.value })}
                placeholder="Hadir 12/12 Siswa"
                className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-800 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Catatan Refleksi Guru
              </label>
              <input
                type="text"
                value={formData.catatan}
                onChange={e => setFormData({ ...formData, catatan: e.target.value })}
                placeholder="Siswa sangat antusias saat praktik langsung"
                className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-800 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => {
                setIsAddModalOpen(false);
                setEditingJournal(null);
              }}
              className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 rounded-xl"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md"
            >
              <Check className="h-4 w-4" />
              <span>{editingJournal ? 'Simpan Perubahan' : 'Catat Jurnal'}</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal Cetak Jurnal Mengajar Lengkap */}
      {isPrintModalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setIsPrintModalOpen(false)}
          title="Pratinjau Buku Agenda & Jurnal Guru"
          maxWidth="5xl"
        >
          <div className="space-y-6">
            <div
              id="printable-official-document"
              className="printable-document-sheet p-6 bg-white rounded-2xl border border-slate-200 text-black print:border-none print:shadow-none print:p-0 print:m-0 print:w-full"
            >
              <HeaderKopSekolah
                documentTitle="BUKU AGENDA & JURNAL HARIAN GURU KELAS"
                subTitle={`Kelas ${schoolInfo.className} • Tahun Ajaran ${schoolInfo.academicYear} • Semester ${schoolInfo.semester}`}
              />

              <table className="w-full text-left text-[10.5px] border-collapse border border-black mt-4">
                <thead>
                  <tr className="bg-slate-100 border border-black text-center font-bold">
                    <th className="border border-black p-1.5 w-8">No</th>
                    <th className="border border-black p-1.5 w-24">Hari / Tanggal</th>
                    <th className="border border-black p-1.5 w-12">Jam</th>
                    <th className="border border-black p-1.5 w-32">Mata Pelajaran</th>
                    <th className="border border-black p-1.5 text-left">Materi Pokok & Kegiatan</th>
                    <th className="border border-black p-1.5 w-24">Kehadiran</th>
                    <th className="border border-black p-1.5 w-32">Refleksi / Catatan</th>
                  </tr>
                </thead>
                <tbody>
                  {journals.map((j, idx) => {
                    const sub = subjects.find(s => s.id === j.mapelId);
                    return (
                      <tr key={j.id} className="border border-black">
                        <td className="border border-black p-1.5 text-center">{idx + 1}</td>
                        <td className="border border-black p-1.5 text-center">{j.tanggal}</td>
                        <td className="border border-black p-1.5 text-center">{j.jamKe}</td>
                        <td className="border border-black p-1.5 font-bold">{sub?.nama}</td>
                        <td className="border border-black p-1.5">
                          <p className="font-bold">{j.materi}</p>
                          <p className="text-[9.5px] text-slate-700">{j.kegiatan}</p>
                        </td>
                        <td className="border border-black p-1.5 text-center">{j.kehadiran}</td>
                        <td className="border border-black p-1.5 italic text-[9.5px]">{j.catatan}</td>
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
                  <p>{schoolInfo.city}, 17 Agustus 2026</p>
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
                <span>Cetak Buku Agenda</span>
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Confirmation */}
      {journalToDelete && (
        <ConfirmDialog
          isOpen={true}
          onClose={() => setJournalToDelete(null)}
          onConfirm={() => {
            deleteJournal(journalToDelete.id);
            setJournalToDelete(null);
          }}
          title="Hapus Sesi Jurnal Pembelajaran?"
          message={`Apakah Anda yakin ingin menghapus catatan jurnal materi "${journalToDelete.materi}" pada tanggal ${journalToDelete.tanggal}?`}
          confirmText="Ya, Hapus Jurnal"
          isDestructive={true}
        />
      )}
    </div>
  );
};
