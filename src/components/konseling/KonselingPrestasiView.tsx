import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StudentNote } from '../../types';
import { Modal } from '../common/Modal';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { HeaderKopSekolah } from '../common/HeaderKopSekolah';
import { BadgeStatus } from '../common/BadgeStatus';
import {
  HeartHandshake,
  Award,
  Plus,
  Printer,
  Search,
  CheckCircle2,
  AlertCircle,
  Calendar,
  UserCheck,
  Edit2,
  Trash2,
  Check,
  Sparkles
} from 'lucide-react';

export const KonselingPrestasiView: React.FC = () => {
  const {
    studentNotes,
    addStudentNote,
    updateStudentNote,
    deleteStudentNote,
    students,
    schoolInfo,
    currentUser,
    addToast
  } = useApp();

  const [activeTab, setActiveTab] = useState<'konseling' | 'prestasi'>('konseling');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<StudentNote | null>(null);
  const [noteToDelete, setNoteToDelete] = useState<StudentNote | null>(null);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  const [formData, setFormData] = useState<Omit<StudentNote, 'id'>>({
    siswaId: students[0]?.id || 'std-01',
    tanggal: '2026-08-17',
    kategori: 'Bimbingan',
    kasusAtauPrestasi: '',
    tindakLanjut: '',
    hasil: 'Dalam Pemantauan'
  });

  const safeNotes = studentNotes || [];
  const safeStudents = students || [];

  const konselingNotes = safeNotes.filter(n => n.kategori === 'Bimbingan' || n.kategori === 'Pelanggaran' || n.kategori === 'Konseling Ortu');
  const prestasiNotes = safeNotes.filter(n => n.kategori === 'Prestasi');

  const currentNotes = activeTab === 'konseling' ? konselingNotes : prestasiNotes;

  const filteredNotes = currentNotes.filter(n => {
    const student = safeStudents.find(s => s.id === n.siswaId);
    const matchSearch =
      n.kasusAtauPrestasi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.tindakLanjut.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (student && student.nama.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchSearch;
  });

  const handleOpenAdd = (type: 'Bimbingan' | 'Prestasi' = activeTab === 'konseling' ? 'Bimbingan' : 'Prestasi') => {
    setFormData({
      siswaId: students[0]?.id || 'std-01',
      tanggal: '2026-08-17',
      kategori: type,
      kasusAtauPrestasi: '',
      tindakLanjut: '',
      hasil: type === 'Prestasi' ? 'Diberikan Piagam' : 'Dalam Pemantauan'
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (note: StudentNote) => {
    setEditingNote(note);
    setFormData({
      siswaId: note.siswaId,
      tanggal: note.tanggal,
      kategori: note.kategori,
      kasusAtauPrestasi: note.kasusAtauPrestasi,
      tindakLanjut: note.tindakLanjut,
      hasil: note.hasil
    });
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.kasusAtauPrestasi.trim()) {
      addToast('error', 'Uraian Wajib Diisi', 'Silakan masukkan rincian catatan konseling/prestasi.');
      return;
    }

    if (editingNote) {
      updateStudentNote(editingNote.id, formData);
      setEditingNote(null);
    } else {
      addStudentNote(formData);
      setIsAddModalOpen(false);
    }
  };

  const isTeacherOrAdmin = currentUser.role !== 'siswa';

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400">
              <HeartHandshake className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Buku Bimbingan Konseling & Prestasi Siswa
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Pencatatan perkembangan perilaku, pembinaan karakter, dan rekam prestasi peserta didik
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
              <button
                onClick={() => setActiveTab('konseling')}
                className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all ${
                  activeTab === 'konseling'
                    ? 'bg-white text-blue-700 shadow-sm dark:bg-slate-700 dark:text-white'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                Bimbingan & Konseling
              </button>
              <button
                onClick={() => setActiveTab('prestasi')}
                className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all ${
                  activeTab === 'prestasi'
                    ? 'bg-white text-blue-700 shadow-sm dark:bg-slate-700 dark:text-white'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                Buku Prestasi Siswa
              </button>
            </div>

            <button
              onClick={() => setIsPrintModalOpen(true)}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <Printer className="h-4 w-4 text-slate-500" />
              <span className="hidden sm:inline">Cetak</span>
            </button>
          </div>
        </div>

        {/* Filter & Action */}
        <div className="mt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Cari siswa atau uraian..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2 pl-9 pr-3 text-xs text-slate-800 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
          </div>

          {isTeacherOrAdmin && (
            <button
              onClick={() => handleOpenAdd(activeTab === 'konseling' ? 'Bimbingan' : 'Prestasi')}
              className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-700 active:scale-95 transition-all self-start sm:self-auto"
            >
              <Plus className="h-4 w-4" />
              <span>{activeTab === 'konseling' ? 'Tambah Catatan Bimbingan' : 'Catat Prestasi Baru'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Cards List */}
      <div className="space-y-4">
        {filteredNotes.map(note => {
          const student = students.find(s => s.id === note.siswaId);
          if (!student) return null;

          return (
            <div
              key={note.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <img
                    src={student.fotoUrl}
                    alt={student.nama}
                    className="h-10 w-10 rounded-full object-cover ring-2 ring-slate-200 dark:ring-slate-700 shrink-0"
                  />
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                        {student.nama} (Absen {student.nomorAbsen})
                      </h3>
                      <BadgeStatus status={note.kategori} size="sm" />
                      <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {note.tanggal}
                      </span>
                    </div>

                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 pt-1">
                      {note.kasusAtauPrestasi}
                    </p>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 mt-2">
                      <span className="font-bold text-slate-700 dark:text-slate-200">Tindakan / Bimbingan Guru:</span> {note.tindakLanjut}
                    </p>

                    <div className="pt-2 flex items-center gap-2 text-xs">
                      <span className="text-slate-400">Hasil Evaluasi:</span>
                      <span className="font-bold text-blue-700 dark:text-blue-400">{note.hasil}</span>
                    </div>
                  </div>
                </div>

                {isTeacherOrAdmin && (
                  <div className="flex items-center gap-1 self-end sm:self-start shrink-0">
                    <button
                      onClick={() => handleOpenEdit(note)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      title="Edit Catatan"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setNoteToDelete(note)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      title="Hapus Catatan"
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

      {/* Modal Tambah / Edit Catatan */}
      <Modal
        isOpen={isAddModalOpen || editingNote !== null}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingNote(null);
        }}
        title={editingNote ? 'Edit Catatan Siswa' : 'Tambah Catatan Bimbingan / Prestasi'}
        subtitle="Dokumentasikan rekam bimbingan perilaku atau apresiasi prestasi siswa"
        maxWidth="lg"
        icon={<HeartHandshake className="h-5 w-5 text-blue-600" />}
      >
        <form onSubmit={handleSaveForm} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Pilih Siswa *
            </label>
            <select
              value={formData.siswaId}
              onChange={e => setFormData({ ...formData, siswaId: e.target.value })}
              className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-800 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            >
              {students.map(s => (
                <option key={s.id} value={s.id}>
                  {s.nomorAbsen}. {s.nama} ({s.nisn})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Tanggal *
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
                Kategori *
              </label>
              <select
                value={formData.kategori}
                onChange={e => setFormData({ ...formData, kategori: e.target.value as any })}
                className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-800 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                <option value="Bimbingan">Bimbingan Belajar / Sikap</option>
                <option value="Prestasi">Prestasi / Penghargaan</option>
                <option value="Pelanggaran">Pelanggaran Tata Tertib</option>
                <option value="Konseling Ortu">Konseling / Rapat Wali Murid</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Uraian Kejadian / Prestasi / Masalah *
            </label>
            <textarea
              rows={3}
              required
              value={formData.kasusAtauPrestasi}
              onChange={e => setFormData({ ...formData, kasusAtauPrestasi: e.target.value })}
              placeholder="Contoh: Juara 1 Lomba Cerdas Cermat Sains Tingkat Kecamatan / Kesulitan konsentrasi pada jam pelajaran matematika"
              className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-800 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Tindakan / Bimbingan Wali Kelas
            </label>
            <textarea
              rows={2}
              value={formData.tindakLanjut}
              onChange={e => setFormData({ ...formData, tindakLanjut: e.target.value })}
              placeholder="Pendampingan bimbingan khusus tatap muka dan koordinasi dengan orang tua"
              className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-800 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Hasil / Status Perkembangan
            </label>
            <input
              type="text"
              value={formData.hasil}
              onChange={e => setFormData({ ...formData, hasil: e.target.value })}
              placeholder="Contoh: Tuntas / Piagam Diserahkan / Dalam Pemantauan"
              className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-800 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => {
                setIsAddModalOpen(false);
                setEditingNote(null);
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
              <span>{editingNote ? 'Simpan Perubahan' : 'Simpan Catatan'}</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal Cetak Dokumen Konseling / Prestasi */}
      {isPrintModalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setIsPrintModalOpen(false)}
          title="Pratinjau Buku Catatan Bimbingan & Prestasi"
          maxWidth="5xl"
        >
          <div className="space-y-6">
            <div
              id="printable-official-document"
              className="printable-document-sheet p-6 bg-white rounded-2xl border border-slate-200 text-black print:border-none print:shadow-none print:p-0 print:m-0 print:w-full"
            >
              <HeaderKopSekolah
                documentTitle={activeTab === 'konseling' ? "BUKU CATATAN BIMBINGAN & KONSELING SISWA" : "BUKU CATATAN PRESTASI & PENGHARGAAN SISWA"}
                subTitle={`Kelas ${schoolInfo.className} • Tahun Ajaran ${schoolInfo.academicYear} • Semester ${schoolInfo.semester}`}
              />

              <table className="w-full text-left text-[11px] border-collapse border border-black mt-4">
                <thead>
                  <tr className="bg-slate-100 border border-black text-center font-bold">
                    <th className="border border-black p-1.5 w-8">No</th>
                    <th className="border border-black p-1.5 w-24">Tanggal</th>
                    <th className="border border-black p-1.5 w-40 text-left">Nama Siswa</th>
                    <th className="border border-black p-1.5 text-left">Uraian Kasus / Prestasi</th>
                    <th className="border border-black p-1.5 text-left">Tindakan Guru</th>
                    <th className="border border-black p-1.5 w-28 text-center">Status / Hasil</th>
                  </tr>
                </thead>
                <tbody>
                  {currentNotes.map((n, idx) => {
                    const student = students.find(s => s.id === n.siswaId);
                    return (
                      <tr key={n.id} className="border border-black">
                        <td className="border border-black p-1.5 text-center">{idx + 1}</td>
                        <td className="border border-black p-1.5 text-center font-mono">{n.tanggal}</td>
                        <td className="border border-black p-1.5 font-bold">{student?.nama}</td>
                        <td className="border border-black p-1.5">{n.kasusAtauPrestasi}</td>
                        <td className="border border-black p-1.5">{n.tindakLanjut}</td>
                        <td className="border border-black p-1.5 text-center font-semibold">{n.hasil}</td>
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
                  <p>Guru Kelas / Wali Kelas {schoolInfo.className}</p>
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
                <span>Cetak Dokumen</span>
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Confirmation */}
      {noteToDelete && (
        <ConfirmDialog
          isOpen={true}
          onClose={() => setNoteToDelete(null)}
          onConfirm={() => {
            deleteStudentNote(noteToDelete.id);
            setNoteToDelete(null);
          }}
          title="Hapus Catatan Siswa?"
          message="Apakah Anda yakin ingin menghapus catatan bimbingan/prestasi ini secara permanen?"
          confirmText="Ya, Hapus"
          isDestructive={true}
        />
      )}
    </div>
  );
};
