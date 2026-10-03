import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Student } from '../../types';
import { Modal } from '../common/Modal';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { BadgeStatus } from '../common/BadgeStatus';
import { EmptyState } from '../common/EmptyState';
import { HeaderKopSekolah } from '../common/HeaderKopSekolah';
import { ImageUploadAvatar } from '../common/ImageUploadAvatar';
import { SchoolLogoRenderer } from '../common/SchoolLogoRenderer';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  ArrowUpDown,
  Printer,
  Download,
  FileSpreadsheet,
  Eye,
  Edit2,
  Trash2,
  Phone,
  MapPin,
  Calendar,
  CreditCard,
  Check,
  ShieldAlert,
  GraduationCap,
  QrCode,
  Sparkles,
  AlertTriangle,
  CheckSquare,
  Upload,
  CheckCircle2,
  FileUp,
  RefreshCw
} from 'lucide-react';
import {
  downloadWorkbook,
  generateStudentTemplate,
  parseExcelFile,
  findStudentWorksheet,
  parseStudentsFromSheet
} from '../../utils/excelHelper';

export const DataSiswaView: React.FC = () => {
  const {
    students,
    addStudent,
    updateStudent,
    deleteStudent,
    deleteAllStudents,
    deleteSelectedStudents,
    restoreSampleStudents,
    getStudentAttendanceStats,
    getAllGradesForStudent,
    currentUser,
    schoolInfo,
    setCurrentTab,
    addToast,
    bulkImportStudents
  } = useApp();

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [genderFilter, setGenderFilter] = useState<'Semua' | 'L' | 'P'>('Semua');
  const [statusFilter, setStatusFilter] = useState<'Semua' | 'Aktif' | 'Mutasi' | 'Lulus'>('Semua');
  const [sortBy, setSortBy] = useState<'absen' | 'nama' | 'nisn'>('absen');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [viewingStudent, setViewingStudent] = useState<Student | null>(null);
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);
  const [isDeleteAllModalOpen, setIsDeleteAllModalOpen] = useState(false);
  const [isDeleteSelectedModalOpen, setIsDeleteSelectedModalOpen] = useState(false);
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [confirmDeleteInput, setConfirmDeleteInput] = useState('');
  const [isPrintBukuIndukOpen, setIsPrintBukuIndukOpen] = useState(false);
  const [studentForCardPrint, setStudentForCardPrint] = useState<Student | null>(null);
  const [cardPrintSide, setCardPrintSide] = useState<'both' | 'front' | 'back'>('both');
  const [cardTheme, setCardTheme] = useState<'blue' | 'maroon' | 'green' | 'dark'>('blue');

  // Excel Import Modal States
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importMode, setImportMode] = useState<'append' | 'replace'>('append');
  const [isParsingImport, setIsParsingImport] = useState(false);
  const [parsedImportStudents, setParsedImportStudents] = useState<Partial<Student>[] | null>(null);
  const [importErrors, setImportErrors] = useState<string[]>([]);
  const [importTotalRows, setImportTotalRows] = useState(0);

  const handleFileSelectForImport = async (file: File) => {
    setImportFile(file);
    setIsParsingImport(true);
    setImportErrors([]);
    setParsedImportStudents(null);

    try {
      const wb = await parseExcelFile(file);
      let ws = wb.Sheets[wb.SheetNames[0]];
      const found = findStudentWorksheet(wb);
      if (found) {
        ws = found.ws;
      }
      if (!ws) {
        throw new Error('Lembar data siswa tidak ditemukan dalam file Excel.');
      }
      const result = parseStudentsFromSheet(ws, schoolInfo.className);
      setParsedImportStudents(result.data);
      setImportErrors(result.errors);
      setImportTotalRows(result.totalRows);

      if (result.validRows > 0) {
        addToast(
          'info',
          'File Excel Siap',
          `Ditemukan ${result.validRows} data siswa siap masuk ke Data Siswa & Buku Induk.`
        );
      } else {
        addToast(
          'warning',
          'Format Kolom Tidak Cocok',
          'Pastikan Anda menggunakan Template Data Siswa resmi (.xlsx).'
        );
      }
    } catch (err: any) {
      console.error(err);
      addToast('error', 'Gagal Membaca File', err.message || 'File Excel tidak dapat diproses.');
    } finally {
      setIsParsingImport(false);
    }
  };

  const handleApplyImportedStudents = () => {
    if (!parsedImportStudents || parsedImportStudents.length === 0) return;
    bulkImportStudents(parsedImportStudents as Student[], importMode);
    setIsImportModalOpen(false);
    setImportFile(null);
    setParsedImportStudents(null);
    setImportErrors([]);
  };

  const handleDownloadStudentTemplate = () => {
    const wb = generateStudentTemplate();
    downloadWorkbook(wb, `Template_Data_Siswa_${schoolInfo.className.replace(/\s+/g, '_')}.xlsx`);
    addToast('success', 'Template Diunduh', 'Gunakan template ini untuk mengisi data siswa & buku induk.');
  };

  // Form State
  const [formData, setFormData] = useState<Omit<Student, 'id'>>({
    nisn: '',
    nis: '',
    nama: '',
    jenisKelamin: 'L',
    tempatLahir: '',
    tanggalLahir: '2015-01-01',
    agama: 'Islam',
    alamat: '',
    namaAyah: '',
    namaIbu: '',
    pekerjaanOrtu: '',
    noHpOrtu: '',
    fotoUrl: 'https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?w=150&auto=format&fit=crop&q=80',
    status: 'Aktif',
    nomorAbsen: students.length + 1,
    kelas: '4A',
    catatanKhusus: '',
    statusDalamKeluarga: 'Anak Kandung',
    anakKe: 1,
    sekolahAsal: '',
    diterimaDiKelas: '1',
    diterimaTanggal: '2024-07-15'
  });

  // Filter & Sorting Logic
  const safeStudents = students || [];
  const filteredStudents = safeStudents
    .filter(s => {
      const matchQuery =
        s.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.nisn.includes(searchQuery) ||
        s.nis.includes(searchQuery);
      const matchGender = genderFilter === 'Semua' || s.jenisKelamin === genderFilter;
      const matchStatus = statusFilter === 'Semua' || s.status === statusFilter;
      return matchQuery && matchGender && matchStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'absen') return a.nomorAbsen - b.nomorAbsen;
      if (sortBy === 'nama') return a.nama.localeCompare(b.nama);
      if (sortBy === 'nisn') return a.nisn.localeCompare(b.nisn);
      return 0;
    });

  const handleOpenAdd = () => {
    const rawClassNumber = schoolInfo.className ? schoolInfo.className.replace(/[^0-9]/g, '') : '1';
    setFormData({
      nisn: '012384' + Math.floor(1000 + Math.random() * 9000),
      nis: '40' + (students.length + 21),
      nama: '',
      jenisKelamin: 'L',
      tempatLahir: 'Jakarta',
      tanggalLahir: '2015-05-15',
      agama: 'Islam',
      alamat: '',
      namaAyah: '',
      namaIbu: '',
      pekerjaanOrtu: '',
      noHpOrtu: '0812-',
      fotoUrl: 'https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?w=150&auto=format&fit=crop&q=80',
      status: 'Aktif',
      nomorAbsen: students.length + 1,
      kelas: schoolInfo.className || '4A',
      catatanKhusus: '',
      statusDalamKeluarga: 'Anak Kandung',
      anakKe: 1,
      sekolahAsal: '',
      diterimaDiKelas: rawClassNumber || '1',
      diterimaTanggal: '2024-07-15'
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (student: Student) => {
    setEditingStudent(student);
    setFormData({
      nisn: student.nisn,
      nis: student.nis,
      nama: student.nama,
      jenisKelamin: student.jenisKelamin,
      tempatLahir: student.tempatLahir,
      tanggalLahir: student.tanggalLahir,
      agama: student.agama,
      alamat: student.alamat,
      namaAyah: student.namaAyah,
      namaIbu: student.namaIbu,
      pekerjaanOrtu: student.pekerjaanOrtu,
      noHpOrtu: student.noHpOrtu,
      fotoUrl: student.fotoUrl,
      status: student.status,
      nomorAbsen: student.nomorAbsen,
      kelas: student.kelas,
      catatanKhusus: student.catatanKhusus || '',
      statusDalamKeluarga: student.statusDalamKeluarga || 'Anak Kandung',
      anakKe: student.anakKe !== undefined ? student.anakKe : 1,
      sekolahAsal: student.sekolahAsal || '',
      diterimaDiKelas: student.diterimaDiKelas || student.kelas || '1',
      diterimaTanggal: student.diterimaTanggal || '2024-07-15'
    });
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nama.trim()) {
      addToast('error', 'Nama Wajib Diisi', 'Silakan masukkan nama lengkap siswa.');
      return;
    }
    if (!formData.nisn.trim()) {
      addToast('error', 'NISN Wajib Diisi', 'Silakan masukkan 10 digit NISN.');
      return;
    }

    if (editingStudent) {
      updateStudent(editingStudent.id, formData);
      setEditingStudent(null);
    } else {
      addStudent(formData);
      setIsAddModalOpen(false);
    }
  };

  const handleExportCsv = () => {
    const headers = ['No Absen', 'NISN', 'NIS', 'Nama Siswa', 'JK', 'Tempat Lahir', 'Tanggal Lahir', 'Agama', 'Nama Ayah', 'Nama Ibu', 'No HP Ortu', 'Alamat', 'Status'];
    const rows = students.map(s => [
      s.nomorAbsen,
      `'${s.nisn}`,
      s.nis,
      `"${s.nama}"`,
      s.jenisKelamin === 'L' ? 'Laki-laki' : 'Perempuan',
      s.tempatLahir,
      s.tanggalLahir,
      s.agama,
      `"${s.namaAyah}"`,
      `"${s.namaIbu}"`,
      `'${s.noHpOrtu}`,
      `"${s.alamat}"`,
      s.status
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Buku_Induk_Siswa_${schoolInfo.className.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    addToast('success', 'Ekspor Berhasil', 'File CSV Buku Induk Siswa telah berhasil diunduh.');
  };

  const isTeacherOrAdmin = currentUser.role !== 'siswa';

  return (
    <div className="space-y-6">
      {/* Top Header Card with Quick Stats */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Buku Induk Siswa {schoolInfo.className}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Total {students.length} Peserta Didik • {students.filter(s => s.jenisKelamin === 'L').length} Laki-laki • {students.filter(s => s.jenisKelamin === 'P').length} Perempuan
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {isTeacherOrAdmin && (
              <>
                <button
                  onClick={handleOpenAdd}
                  className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-700 active:scale-95 transition-all cursor-pointer"
                >
                  <UserPlus className="h-4 w-4" />
                  <span>Tambah Siswa</span>
                </button>

                <button
                  onClick={() => setIsImportModalOpen(true)}
                  className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 active:scale-95 transition-all cursor-pointer"
                >
                  <FileSpreadsheet className="h-4 w-4" />
                  <span>Import / Template Excel</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setConfirmDeleteInput('');
                    setIsDeleteAllModalOpen(true);
                  }}
                  disabled={students.length === 0}
                  className="flex items-center gap-1.5 rounded-xl border border-rose-300 bg-rose-50 px-3.5 py-2 text-xs font-bold text-rose-700 hover:bg-rose-100 hover:border-rose-400 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-300 dark:hover:bg-rose-900/60 active:scale-95 transition-all shadow-2xs disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  title="Hapus seluruh data peserta didik dari buku induk kelas"
                >
                  <Trash2 className="h-4 w-4 text-rose-600 dark:text-rose-400" />
                  <span>Hapus Semua</span>
                </button>
              </>
            )}

            <button
              onClick={() => setIsPrintBukuIndukOpen(true)}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            >
              <Printer className="h-4 w-4 text-slate-500" />
              <span>Cetak Buku Induk</span>
            </button>

            <button
              onClick={handleExportCsv}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            >
              <Download className="h-4 w-4 text-slate-500" />
              <span>Ekspor CSV</span>
            </button>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          {/* Search Input */}
          <div className="relative lg:col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Cari Nama, NISN, atau NIS..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2 pl-9 pr-3 text-xs text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
          </div>

          {/* Gender Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 whitespace-nowrap">JK:</span>
            <select
              value={genderFilter}
              onChange={e => setGenderFilter(e.target.value as any)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2 px-3 text-xs text-slate-800 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            >
              <option value="Semua">Semua JK</option>
              <option value="L">Laki-laki</option>
              <option value="P">Perempuan</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 whitespace-nowrap">Status:</span>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value as any)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2 px-3 text-xs text-slate-800 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            >
              <option value="Semua">Semua Status</option>
              <option value="Aktif">Aktif</option>
              <option value="Mutasi">Mutasi</option>
              <option value="Lulus">Lulus</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 whitespace-nowrap">Urut:</span>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2 px-3 text-xs text-slate-800 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            >
              <option value="absen">No. Absen</option>
              <option value="nama">Nama (A-Z)</option>
              <option value="nisn">NISN</option>
            </select>
          </div>
        </div>
        {/* Batch Selection Banner */}
        {isTeacherOrAdmin && selectedStudentIds.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-rose-50 border border-rose-200 dark:bg-rose-950/40 dark:border-rose-900/60">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-rose-600 text-white text-[11px] font-bold">
                {selectedStudentIds.length}
              </span>
              <span className="text-xs font-bold text-rose-900 dark:text-rose-200">
                siswa dipilih dari total {students.length}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSelectedStudentIds([])}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Batalkan Pilihan
              </button>
              <button
                type="button"
                onClick={() => setSelectedStudentIds(filteredStudents.map(s => s.id))}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-blue-700 dark:text-blue-300 hover:bg-blue-100/60 dark:hover:bg-blue-950 transition-colors cursor-pointer"
              >
                Pilih Semua Hasil Filter ({filteredStudents.length})
              </button>
              <button
                type="button"
                onClick={() => setIsDeleteSelectedModalOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-rose-600 text-white hover:bg-rose-700 shadow-xs active:scale-95 transition-all cursor-pointer"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Hapus Terpilih ({selectedStudentIds.length})</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main Student List View */}
      {students.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center dark:border-slate-800 dark:bg-slate-900">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-50 text-rose-500 dark:bg-rose-950/50 dark:text-rose-400 mb-4">
            <Users className="h-8 w-8" />
          </div>
          <h3 className="text-base font-bold text-slate-800 dark:text-white">
            Buku Induk Siswa Masih Kosong
          </h3>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            Seluruh data siswa saat ini telah dibersihkan atau belum diinput. Anda dapat menambahkan siswa baru secara mandiri, mengimpor dari file Excel Dapodik, atau memuat ulang 28 data siswa contoh.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5">
            {isTeacherOrAdmin && (
              <>
                <button
                  onClick={handleOpenAdd}
                  className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-700 active:scale-95 transition-all cursor-pointer"
                >
                  <UserPlus className="h-4 w-4" />
                  <span>Tambah Siswa Baru</span>
                </button>
                <button
                  onClick={() => setIsImportModalOpen(true)}
                  className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 active:scale-95 transition-all cursor-pointer"
                >
                  <FileSpreadsheet className="h-4 w-4" />
                  <span>Import dari Excel</span>
                </button>
                <button
                  onClick={restoreSampleStudents}
                  className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 active:scale-95 transition-all cursor-pointer"
                >
                  <Sparkles className="h-4 w-4 text-amber-500" />
                  <span>Muat Ulang Data Sampel (28 Siswa)</span>
                </button>
              </>
            )}
          </div>
        </div>
      ) : filteredStudents.length === 0 ? (
        <EmptyState
          title="Tidak Ada Siswa Ditemukan"
          description="Kriteria pencarian atau filter yang Anda gunakan tidak cocok dengan data siswa mana pun."
          actionText="Reset Pencarian"
          onAction={() => {
            setSearchQuery('');
            setGenderFilter('Semua');
            setStatusFilter('Semua');
          }}
        />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
              <thead className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-800/80 dark:text-slate-400">
                <tr>
                  {isTeacherOrAdmin && (
                    <th className="px-3 py-3.5 text-center w-10">
                      <input
                        type="checkbox"
                        checked={filteredStudents.length > 0 && filteredStudents.every(s => selectedStudentIds.includes(s.id))}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedStudentIds(filteredStudents.map(s => s.id));
                          } else {
                            setSelectedStudentIds([]);
                          }
                        }}
                        className="h-4 w-4 rounded border-slate-300 text-rose-600 focus:ring-rose-500 dark:border-slate-700 dark:bg-slate-800 cursor-pointer"
                        title="Pilih Semua Siswa di Daftar"
                      />
                    </th>
                  )}
                  <th className="px-4 py-3.5 text-center w-12">No</th>
                  <th className="px-4 py-3.5">Identitas Siswa</th>
                  <th className="px-4 py-3.5">NISN / NIS</th>
                  <th className="px-4 py-3.5">L/P</th>
                  <th className="px-4 py-3.5">Tempat & Tgl Lahir</th>
                  <th className="px-4 py-3.5">Orang Tua / Kontak</th>
                  <th className="px-4 py-3.5 text-center">Kehadiran</th>
                  <th className="px-4 py-3.5 text-center">Status</th>
                  <th className="px-4 py-3.5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {filteredStudents.map(student => {
                  const stats = getStudentAttendanceStats(student.id);
                  const isSelected = selectedStudentIds.includes(student.id);
                  return (
                    <tr
                      key={student.id}
                      className={`transition-colors ${
                        isSelected
                          ? 'bg-rose-50/50 dark:bg-rose-950/20'
                          : 'hover:bg-slate-50/70 dark:hover:bg-slate-800/50'
                      }`}
                    >
                      {isTeacherOrAdmin && (
                        <td className="px-3 py-3.5 text-center">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedStudentIds(prev => [...prev, student.id]);
                              } else {
                                setSelectedStudentIds(prev => prev.filter(id => id !== student.id));
                              }
                            }}
                            className="h-4 w-4 rounded border-slate-300 text-rose-600 focus:ring-rose-500 dark:border-slate-700 dark:bg-slate-800 cursor-pointer"
                          />
                        </td>
                      )}
                      {/* No Absen */}
                      <td className="px-4 py-3.5 text-center font-bold text-slate-900 dark:text-white">
                        {student.nomorAbsen}
                      </td>

                      {/* Avatar & Nama */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <img
                            src={student.fotoUrl}
                            alt={student.nama}
                            className="h-9 w-9 rounded-full object-cover ring-2 ring-slate-200 dark:ring-slate-700 shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="font-bold text-slate-900 dark:text-white truncate max-w-[180px]">
                              {student.nama}
                            </p>
                            <p className="text-[11px] text-slate-400 truncate">
                              Agama: {student.agama}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* NISN & NIS */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <p className="font-semibold text-slate-800 dark:text-slate-200">
                          {student.nisn}
                        </p>
                        <p className="text-[11px] text-slate-400">NIS: {student.nis}</p>
                      </td>

                      {/* Gender */}
                      <td className="px-4 py-3.5">
                        <span className={`inline-flex items-center justify-center h-6 w-6 rounded-full text-xs font-bold ${
                          student.jenisKelamin === 'L'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                            : 'bg-pink-100 text-pink-800 dark:bg-pink-950 dark:text-pink-300'
                        }`}>
                          {student.jenisKelamin}
                        </span>
                      </td>

                      {/* TTL */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <p className="text-slate-800 dark:text-slate-200">{student.tempatLahir}</p>
                        <p className="text-[11px] text-slate-400">{student.tanggalLahir}</p>
                      </td>

                      {/* Ortu & Kontak */}
                      <td className="px-4 py-3.5">
                        <p className="font-medium text-slate-800 dark:text-slate-200 truncate max-w-[140px]">
                          {student.namaAyah || student.namaIbu}
                        </p>
                        <p className="text-[11px] text-blue-600 dark:text-blue-400 flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {student.noHpOrtu}
                        </p>
                      </td>

                      {/* Kehadiran Rate */}
                      <td className="px-4 py-3.5 text-center">
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">
                          {stats.percentage}%
                        </span>
                        <p className="text-[10px] text-slate-400">
                          {stats.hadir} H • {stats.izin} I • {stats.sakit} S
                        </p>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3.5 text-center">
                        <BadgeStatus status={student.status} size="sm" />
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3.5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setViewingStudent(student)}
                            className="p-1.5 rounded-lg text-slate-500 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-slate-800 dark:hover:text-blue-400 transition-colors"
                            title="Lihat Detail Biodata"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setStudentForCardPrint(student)}
                            className="p-1.5 rounded-lg text-slate-500 hover:bg-orange-50 hover:text-orange-600 dark:hover:bg-slate-800 dark:hover:text-orange-400 transition-colors"
                            title="Cetak Kartu Pelajar"
                          >
                            <CreditCard className="h-4 w-4" />
                          </button>
                          {isTeacherOrAdmin && (
                            <>
                              <button
                                onClick={() => handleOpenEdit(student)}
                                className="p-1.5 rounded-lg text-slate-500 hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-slate-800 dark:hover:text-emerald-400 transition-colors"
                                title="Edit Biodata"
                              >
                                <Edit2 className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => setStudentToDelete(student)}
                                className="p-1.5 rounded-lg text-slate-500 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-slate-800 dark:hover:text-rose-400 transition-colors"
                                title="Hapus Siswa"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Tambah / Edit Siswa */}
      <Modal
        isOpen={isAddModalOpen || editingStudent !== null}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingStudent(null);
        }}
        title={editingStudent ? `Edit Biodata Siswa: ${editingStudent.nama}` : 'Tambah Siswa Baru ke Kelas'}
        subtitle="Lengkapi data profil siswa sesuai data resmi Dapodik & Kartu Keluarga"
        maxWidth="3xl"
        icon={<UserPlus className="h-5 w-5 text-blue-600" />}
      >
        <form onSubmit={handleSaveForm} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Foto Profil / Pasfoto Siswa */}
            <div className="sm:col-span-2">
              <ImageUploadAvatar
                label="Pasfoto Siswa / Foto Profil Resmi Peserta Didik"
                description="Unggah pasfoto resmi siswa (seragam merah-putih), ambil foto via kamera perangkat, atau pilih avatar siswa."
                type="student"
                gender={formData.jenisKelamin}
                aspectRatio="1:1"
                value={formData.fotoUrl}
                onChange={(newUrl) => setFormData({ ...formData, fotoUrl: newUrl })}
              />
            </div>

            {/* Nama Lengkap */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Nama Lengkap Siswa *
              </label>
              <input
                type="text"
                required
                value={formData.nama}
                onChange={e => setFormData({ ...formData, nama: e.target.value })}
                placeholder="Contoh: Ahmad Fauzi Rahman"
                className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-800 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            {/* NISN */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                NISN (10 Digit) *
              </label>
              <input
                type="text"
                required
                value={formData.nisn}
                onChange={e => setFormData({ ...formData, nisn: e.target.value })}
                placeholder="0012345678"
                className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-800 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            {/* NIS */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                NIS Lokal Sekolah
              </label>
              <input
                type="text"
                value={formData.nis}
                onChange={e => setFormData({ ...formData, nis: e.target.value })}
                placeholder="4021"
                className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-800 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            {/* No Absen */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Nomor Absen
              </label>
              <input
                type="number"
                min="1"
                max="50"
                value={formData.nomorAbsen}
                onChange={e => setFormData({ ...formData, nomorAbsen: parseInt(e.target.value) || 1 })}
                className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-800 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            {/* Gender */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Jenis Kelamin
              </label>
              <select
                value={formData.jenisKelamin}
                onChange={e => setFormData({ ...formData, jenisKelamin: e.target.value as 'L' | 'P' })}
                className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-800 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                <option value="L">Laki-laki (L)</option>
                <option value="P">Perempuan (P)</option>
              </select>
            </div>

            {/* Tempat Lahir */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Tempat Lahir
              </label>
              <input
                type="text"
                value={formData.tempatLahir}
                onChange={e => setFormData({ ...formData, tempatLahir: e.target.value })}
                placeholder="Jakarta"
                className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-800 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            {/* Tanggal Lahir */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Tanggal Lahir
              </label>
              <input
                type="date"
                value={formData.tanggalLahir}
                onChange={e => setFormData({ ...formData, tanggalLahir: e.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-800 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            {/* Agama */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Agama
              </label>
              <select
                value={formData.agama}
                onChange={e => setFormData({ ...formData, agama: e.target.value as any })}
                className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-800 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                <option value="Islam">Islam</option>
                <option value="Kristen">Kristen</option>
                <option value="Katolik">Katolik</option>
                <option value="Hindu">Hindu</option>
                <option value="Buddha">Buddha</option>
                <option value="Konghucu">Konghucu</option>
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Status Keaktifan
              </label>
              <select
                value={formData.status}
                onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-800 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                <option value="Aktif">Aktif</option>
                <option value="Mutasi">Mutasi</option>
                <option value="Lulus">Lulus</option>
                <option value="Non-aktif">Non-aktif</option>
              </select>
            </div>

            {/* Sub-header: Riwayat Masuk Sekolah & Data Keluarga */}
            <div className="sm:col-span-2 pt-3 pb-1 border-t border-slate-100 dark:border-slate-800">
              <h4 className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
                <GraduationCap className="h-4 w-4" />
                <span>Riwayat Masuk Sekolah & Status Keluarga</span>
              </h4>
            </div>

            {/* Status dalam keluarga */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Status dalam Keluarga
              </label>
              <input
                type="text"
                list="list-status-keluarga"
                value={formData.statusDalamKeluarga || ''}
                onChange={e => setFormData({ ...formData, statusDalamKeluarga: e.target.value })}
                placeholder="Contoh: Anak Kandung / Anak Angkat"
                className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-800 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
              <datalist id="list-status-keluarga">
                <option value="Anak Kandung" />
                <option value="Anak Angkat" />
                <option value="Anak Tiri" />
                <option value="Anak Asuh" />
              </datalist>
            </div>

            {/* Anak Ke */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Anak Ke
              </label>
              <input
                type="text"
                value={formData.anakKe !== undefined ? formData.anakKe : ''}
                onChange={e => setFormData({ ...formData, anakKe: e.target.value })}
                placeholder="Contoh: 1 atau 1 (Satu)"
                className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-800 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            {/* Sekolah Asal (TK/PAUD) */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Sekolah Asal (TK/PAUD)
              </label>
              <input
                type="text"
                value={formData.sekolahAsal || ''}
                onChange={e => setFormData({ ...formData, sekolahAsal: e.target.value })}
                placeholder="Contoh: TK Pembina / TK Pertiwi / PAUD Bintang Terpadu"
                className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-800 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            {/* Diterima di Sekolah Ini */}
            <div className="sm:col-span-2 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 p-3.5 border border-blue-100 dark:border-blue-900/40 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                  <span>Diterima di Sekolah Ini:</span>
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">
                  Data masuk peserta didik ke sekolah
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* a. Di kelas */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    a. Di Kelas
                  </label>
                  <input
                    type="text"
                    value={formData.diterimaDiKelas || ''}
                    onChange={e => setFormData({ ...formData, diterimaDiKelas: e.target.value })}
                    placeholder="Contoh: 1 (Satu) atau 4A"
                    className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-800 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>

                {/* b. Pada Tanggal */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    b. Pada Tanggal
                  </label>
                  <input
                    type="date"
                    value={formData.diterimaTanggal || ''}
                    onChange={e => setFormData({ ...formData, diterimaTanggal: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-800 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* Sub-header: Data Orang Tua */}
            <div className="sm:col-span-2 pt-3 pb-1 border-t border-slate-100 dark:border-slate-800">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <span>Data Orang Tua & Wali Murid</span>
              </h4>
            </div>

            {/* Nama Ayah */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Nama Ayah Kandung
              </label>
              <input
                type="text"
                value={formData.namaAyah}
                onChange={e => setFormData({ ...formData, namaAyah: e.target.value })}
                placeholder="Nama Ayah"
                className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-800 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            {/* Nama Ibu */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Nama Ibu Kandung
              </label>
              <input
                type="text"
                value={formData.namaIbu}
                onChange={e => setFormData({ ...formData, namaIbu: e.target.value })}
                placeholder="Nama Ibu"
                className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-800 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            {/* Pekerjaan Ortu */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Pekerjaan Orang Tua
              </label>
              <input
                type="text"
                value={formData.pekerjaanOrtu}
                onChange={e => setFormData({ ...formData, pekerjaanOrtu: e.target.value })}
                placeholder="PNS / Swasta / Wiraswasta"
                className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-800 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            {/* No HP Ortu */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                No. HP / WhatsApp Wali Murid
              </label>
              <input
                type="text"
                value={formData.noHpOrtu}
                onChange={e => setFormData({ ...formData, noHpOrtu: e.target.value })}
                placeholder="0812-3456-7890"
                className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-800 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            {/* Alamat Lengkap */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Alamat Tempat Tinggal
              </label>
              <textarea
                rows={2}
                value={formData.alamat}
                onChange={e => setFormData({ ...formData, alamat: e.target.value })}
                placeholder="Jl. Merdeka No. 123, RT/RW, Kelurahan, Kecamatan"
                className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-800 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            {/* Catatan Khusus */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Catatan Karakter / Prestasi Khusus
              </label>
              <input
                type="text"
                value={formData.catatanKhusus}
                onChange={e => setFormData({ ...formData, catatanKhusus: e.target.value })}
                placeholder="Contoh: Pengurus kelas, gemar membaca, juara catur"
                className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-800 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => {
                setIsAddModalOpen(false);
                setEditingStudent(null);
              }}
              className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md transition-all active:scale-95"
            >
              <Check className="h-4 w-4" />
              <span>{editingStudent ? 'Simpan Perubahan' : 'Daftarkan Siswa'}</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal Detail Biodata Siswa */}
      {viewingStudent && (
        <Modal
          isOpen={true}
          onClose={() => setViewingStudent(null)}
          title={`Buku Induk: ${viewingStudent.nama}`}
          subtitle={`NISN: ${viewingStudent.nisn} • NIS: ${viewingStudent.nis} • Kelas ${schoolInfo.className}`}
          maxWidth="4xl"
        >
          <div className="space-y-6">
            {/* Profile Banner */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-5 p-5 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50/50 dark:from-slate-800 dark:to-blue-950/30 border border-blue-100 dark:border-slate-700">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left min-w-0">
                <img
                  src={viewingStudent.fotoUrl}
                  alt={viewingStudent.nama}
                  className="h-24 w-24 rounded-2xl object-cover ring-4 ring-white dark:ring-slate-800 shadow-md shrink-0"
                />
                <div className="space-y-1.5 min-w-0">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                      {viewingStudent.nama}
                    </h3>
                    <BadgeStatus status={viewingStudent.status} size="sm" />
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    Nomor Absen: <span className="font-bold text-blue-700 dark:text-blue-400">{viewingStudent.nomorAbsen}</span> • Jenis Kelamin: <span className="font-semibold">{viewingStudent.jenisKelamin === 'L' ? 'Laki-laki' : 'Perempuan'}</span> • Agama: <span className="font-semibold">{viewingStudent.agama}</span>
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-center sm:justify-start gap-1">
                    <MapPin className="h-3.5 w-3.5 text-rose-500 shrink-0" />
                    <span className="truncate">{viewingStudent.alamat}</span>
                  </p>
                </div>
              </div>

              {/* Action Buttons: Cetak Kartu & Edit */}
              <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    const s = viewingStudent;
                    setStudentForCardPrint(s);
                  }}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-md shadow-amber-500/20 transition-all shrink-0 active:scale-95"
                >
                  <CreditCard className="h-3.5 w-3.5" />
                  <span>Cetak Kartu Pelajar</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const s = viewingStudent;
                    setViewingStudent(null);
                    handleOpenEdit(s);
                  }}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all shrink-0 active:scale-95"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                  <span>Ganti Foto / Edit Data</span>
                </button>
              </div>
            </div>

            {/* Detailed Metadata Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {/* Kolom 1: Data Pribadi & Kelahiran */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
                <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] text-blue-600 dark:text-blue-400">
                  Data Pribadi & Tempat Lahir
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-400">Tempat, Tgl Lahir</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{viewingStudent.tempatLahir}, {viewingStudent.tanggalLahir}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-400">NISN</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{viewingStudent.nisn}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-400">NIS Lokal</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{viewingStudent.nis}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-400">Status dlm Keluarga</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{viewingStudent.statusDalamKeluarga || 'Anak Kandung'} (Anak Ke-{viewingStudent.anakKe !== undefined ? viewingStudent.anakKe : 1})</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-400">Sekolah Asal (TK/PAUD)</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[180px]">{viewingStudent.sekolahAsal || '-'}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-400">Diterima di Sekolah</span>
                    <span className="font-semibold text-blue-600 dark:text-blue-400">Kelas {viewingStudent.diterimaDiKelas || viewingStudent.kelas || '-'} ({viewingStudent.diterimaTanggal || '-'})</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-400">Catatan Karakter</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 text-right">{viewingStudent.catatanKhusus || '-'}</span>
                  </div>
                </div>
              </div>

              {/* Kolom 2: Data Orang Tua & Kontak */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
                <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] text-orange-600 dark:text-orange-400">
                  Data Orang Tua & Kontak Wali
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-400">Nama Ayah</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{viewingStudent.namaAyah}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-400">Nama Ibu</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{viewingStudent.namaIbu}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-400">Pekerjaan</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{viewingStudent.pekerjaanOrtu}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-400">No. HP / WhatsApp</span>
                    <span className="font-semibold text-blue-600 dark:text-blue-400">{viewingStudent.noHpOrtu}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Riwayat Nilai Singkat */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
              <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] text-emerald-600 dark:text-emerald-400">
                Ringkasan Nilai Akhir Semester (Kurikulum Merdeka)
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 text-xs">
                {getAllGradesForStudent(viewingStudent.id).map(g => (
                  <div key={g.subject.id} className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                    <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 truncate">
                      {g.subject.kode}
                    </p>
                    <div className="flex items-baseline justify-between mt-1">
                      <span className="text-sm font-bold text-slate-900 dark:text-white">
                        {g.nilaiAkhir}
                      </span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        g.ketercapaian === 'Tuntas' 
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' 
                          : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                      }`}>
                        {g.predikat}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal Cetak Kartu Pelajar */}
      {studentForCardPrint && (() => {
        const themeStyles = {
          blue: {
            bg: 'bg-gradient-to-br from-blue-950 via-indigo-900 to-slate-950 border-blue-400/40 text-white',
            accent: 'text-amber-300',
            sub: 'text-blue-200',
            border: 'border-blue-300/30',
            glow: 'bg-blue-500/20'
          },
          maroon: {
            bg: 'bg-gradient-to-br from-rose-950 via-red-900 to-slate-950 border-rose-400/40 text-white',
            accent: 'text-amber-300',
            sub: 'text-rose-200',
            border: 'border-rose-300/30',
            glow: 'bg-rose-500/20'
          },
          green: {
            bg: 'bg-gradient-to-br from-emerald-950 via-teal-900 to-slate-950 border-emerald-400/40 text-white',
            accent: 'text-amber-300',
            sub: 'text-emerald-200',
            border: 'border-emerald-300/30',
            glow: 'bg-emerald-500/20'
          },
          dark: {
            bg: 'bg-gradient-to-br from-slate-950 via-zinc-900 to-black border-slate-600/50 text-white',
            accent: 'text-amber-300',
            sub: 'text-slate-300',
            border: 'border-slate-600/40',
            glow: 'bg-slate-500/20'
          }
        }[cardTheme];

        const showLeft = schoolInfo.showLogoLeft !== false;
        const showRight = schoolInfo.showLogoRight !== false;

        return (
          <Modal
            isOpen={true}
            onClose={() => setStudentForCardPrint(null)}
            title="Pratinjau Kartu Pelajar Siswa"
            maxWidth="3xl"
          >
            <div className="space-y-5">
              {/* Controls Toolbar (No Print) */}
              <div className="no-print p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-3 text-xs">
                {/* Sisi Tampilan */}
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-slate-700 dark:text-slate-300">Tampilan:</span>
                  <div className="flex bg-slate-200 dark:bg-slate-700 p-0.5 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setCardPrintSide('both')}
                      className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                        cardPrintSide === 'both'
                          ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                      }`}
                    >
                      Dua Sisi (Depan & Belakang)
                    </button>
                    <button
                      type="button"
                      onClick={() => setCardPrintSide('front')}
                      className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                        cardPrintSide === 'front'
                          ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                      }`}
                    >
                      Tampak Depan
                    </button>
                    <button
                      type="button"
                      onClick={() => setCardPrintSide('back')}
                      className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                        cardPrintSide === 'back'
                          ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                      }`}
                    >
                      Tampak Belakang
                    </button>
                  </div>
                </div>

                {/* Tema Warna */}
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-slate-700 dark:text-slate-300">Tema Warna:</span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setCardTheme('blue')}
                      className={`h-6 w-6 rounded-full bg-blue-700 border-2 transition-transform ${
                        cardTheme === 'blue' ? 'border-white ring-2 ring-blue-500 scale-110' : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                      title="Biru Kemendikbud"
                    />
                    <button
                      type="button"
                      onClick={() => setCardTheme('maroon')}
                      className={`h-6 w-6 rounded-full bg-red-800 border-2 transition-transform ${
                        cardTheme === 'maroon' ? 'border-white ring-2 ring-red-500 scale-110' : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                      title="Merah Nasional"
                    />
                    <button
                      type="button"
                      onClick={() => setCardTheme('green')}
                      className={`h-6 w-6 rounded-full bg-emerald-800 border-2 transition-transform ${
                        cardTheme === 'green' ? 'border-white ring-2 ring-emerald-500 scale-110' : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                      title="Hijau Madrasah"
                    />
                    <button
                      type="button"
                      onClick={() => setCardTheme('dark')}
                      className={`h-6 w-6 rounded-full bg-slate-900 border-2 transition-transform ${
                        cardTheme === 'dark' ? 'border-white ring-2 ring-slate-400 scale-110' : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                      title="Elegan Hitam"
                    />
                  </div>
                </div>
              </div>

              {/* Informational Sync Banner */}
              <div className="no-print flex items-center gap-2 px-3.5 py-2 rounded-xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 text-[11px] text-blue-700 dark:text-blue-300">
                <Sparkles className="h-4 w-4 shrink-0 text-blue-600 dark:text-blue-400" />
                <span>
                  Logo kiri dan logo kanan pada kartu pelajar otomatis sinkron dengan pengaturan <strong>Kop Surat & Logo Sekolah</strong>.
                </span>
              </div>

              {/* Printable ID Card Container */}
              <div
                id="printable-official-document"
                className="printable-document-sheet p-2 sm:p-4 bg-slate-100 dark:bg-slate-950/50 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-center gap-6 print:border-none print:shadow-none print:p-0 print:m-0 print:bg-white"
              >
                {/* 1. TAMPAK DEPAN KARTU */}
                {(cardPrintSide === 'both' || cardPrintSide === 'front') && (
                  <div className={`w-full max-w-[390px] rounded-2xl p-4 shadow-xl border relative overflow-hidden flex flex-col justify-between select-none ${themeStyles.bg}`}>
                    {/* Background Ambient Glow & Watermark Pattern */}
                    <div className={`absolute -right-8 -top-8 h-40 w-40 rounded-full ${themeStyles.glow} blur-2xl pointer-events-none no-print`} />
                    <div className="absolute -left-10 -bottom-10 h-36 w-36 rounded-full bg-amber-500/10 blur-xl pointer-events-none no-print" />

                    {/* CARD HEADER: LOGO KIRI - TEKS KOP - LOGO KANAN */}
                    <div className={`flex items-center justify-between gap-2 border-b ${themeStyles.border} pb-2.5 relative z-10`}>
                      {/* Logo Kiri Kop Surat */}
                      <div className="flex shrink-0 items-center justify-center">
                        {showLeft ? (
                          <div className="h-10 w-10 rounded-full bg-white p-0.5 shadow-md flex items-center justify-center overflow-hidden border border-white/80 shrink-0">
                            <SchoolLogoRenderer
                              preset={schoolInfo.logoLeftPreset || 'tutwuri'}
                              customUrl={schoolInfo.logoLeft}
                              width={36}
                              alt="Logo Kiri Kop"
                            />
                          </div>
                        ) : (
                          <div className="w-10 h-10 shrink-0" />
                        )}
                      </div>

                      {/* Header Kop Text */}
                      <div className="flex-1 text-center min-w-0 px-1">
                        <p className={`text-[7px] font-bold uppercase tracking-wider ${themeStyles.sub} truncate leading-tight`}>
                          {schoolInfo.kopLine1 || 'PEMERINTAH KABUPATEN KUANTAN SINGINGI'}
                        </p>
                        <p className={`text-[6.5px] font-semibold uppercase tracking-wider ${themeStyles.sub} truncate leading-tight`}>
                          {schoolInfo.kopLine2 || 'DINAS PENDIDIKAN DAN KEBUDAYAAN'}
                        </p>
                        <h4 className={`text-[11px] font-extrabold uppercase tracking-wide ${themeStyles.accent} drop-shadow-sm leading-tight my-0.5`}>
                          KARTU TANDA PELAJAR
                        </h4>
                        <p className="text-[9.5px] font-extrabold text-white uppercase truncate leading-tight">
                          {schoolInfo.schoolName}
                        </p>
                        <p className={`text-[7px] ${themeStyles.sub} leading-tight truncate`}>
                          NPSN: {schoolInfo.npsn} • {schoolInfo.city}
                        </p>
                      </div>

                      {/* Logo Kanan Kop Surat */}
                      <div className="flex shrink-0 items-center justify-center">
                        {showRight ? (
                          <div className="h-10 w-10 rounded-full bg-white p-0.5 shadow-md flex items-center justify-center overflow-hidden border border-white/80 shrink-0">
                            <SchoolLogoRenderer
                              preset={schoolInfo.logoRightPreset || 'merdeka'}
                              customUrl={schoolInfo.logoRight}
                              width={36}
                              alt="Logo Kanan Kop"
                            />
                          </div>
                        ) : (
                          <div className="w-10 h-10 shrink-0" />
                        )}
                      </div>
                    </div>

                    {/* CARD BODY: FOTO SISWA & BIODATA LENGKAP */}
                    <div className="mt-3 flex items-start gap-3.5 relative z-10">
                      {/* Pasfoto Siswa */}
                      <div className="shrink-0 flex flex-col items-center">
                        <div className="h-24 w-20 rounded-xl overflow-hidden ring-2 ring-white/80 shadow-lg bg-slate-800 shrink-0 border border-white/40">
                          <img
                            src={studentForCardPrint.fotoUrl}
                            alt={studentForCardPrint.nama}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <span className={`mt-1 text-[8px] font-extrabold px-1.5 py-0.5 rounded-md bg-white/20 text-white tracking-widest uppercase`}>
                          {schoolInfo.className}
                        </span>
                      </div>

                      {/* Identitas Siswa */}
                      <div className="space-y-1 text-xs min-w-0 flex-1 leading-snug">
                        <div>
                          <p className={`text-[8.5px] uppercase font-bold tracking-wider ${themeStyles.sub}`}>
                            Nama Peserta Didik
                          </p>
                          <p className="font-extrabold text-sm text-white uppercase truncate">
                            {studentForCardPrint.nama}
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 text-[10px] pt-0.5">
                          <div>
                            <span className={themeStyles.sub}>NISN: </span>
                            <span className={`font-extrabold ${themeStyles.accent}`}>{studentForCardPrint.nisn}</span>
                          </div>
                          <div>
                            <span className={themeStyles.sub}>NIS: </span>
                            <span className="font-bold text-white">{studentForCardPrint.nis || '-'}</span>
                          </div>
                          <div>
                            <span className={themeStyles.sub}>Gender: </span>
                            <span className="font-semibold text-white">{studentForCardPrint.jenisKelamin === 'L' ? 'Laki-laki' : 'Perempuan'}</span>
                          </div>
                          <div>
                            <span className={themeStyles.sub}>Agama: </span>
                            <span className="font-semibold text-white">{studentForCardPrint.agama}</span>
                          </div>
                        </div>

                        <div className="text-[9.5px] pt-0.5">
                          <span className={themeStyles.sub}>TTL: </span>
                          <span className="font-medium text-white truncate">
                            {studentForCardPrint.tempatLahir}, {studentForCardPrint.tanggalLahir}
                          </span>
                        </div>

                        <div className="text-[9px] pt-0.5 truncate">
                          <span className={themeStyles.sub}>Alamat: </span>
                          <span className="font-normal text-white/90 truncate">
                            {studentForCardPrint.alamat || '-'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* CARD FOOTER: BARCODE & TANDA TANGAN KEPALA SEKOLAH */}
                    <div className={`mt-3 flex items-end justify-between border-t ${themeStyles.border} pt-2 text-[8px] ${themeStyles.sub} relative z-10`}>
                      {/* Barcode Simulator */}
                      <div className="space-y-0.5">
                        <div className="h-6 w-28 bg-white/95 px-1 py-0.5 rounded flex items-center justify-center">
                          <svg className="w-full h-full" viewBox="0 0 100 24">
                            <rect x="0" y="0" width="3" height="24" fill="#000" />
                            <rect x="5" y="0" width="2" height="24" fill="#000" />
                            <rect x="9" y="0" width="4" height="24" fill="#000" />
                            <rect x="15" y="0" width="2" height="24" fill="#000" />
                            <rect x="19" y="0" width="5" height="24" fill="#000" />
                            <rect x="26" y="0" width="2" height="24" fill="#000" />
                            <rect x="30" y="0" width="3" height="24" fill="#000" />
                            <rect x="35" y="0" width="4" height="24" fill="#000" />
                            <rect x="41" y="0" width="2" height="24" fill="#000" />
                            <rect x="45" y="0" width="5" height="24" fill="#000" />
                            <rect x="52" y="0" width="3" height="24" fill="#000" />
                            <rect x="57" y="0" width="2" height="24" fill="#000" />
                            <rect x="61" y="0" width="4" height="24" fill="#000" />
                            <rect x="67" y="0" width="3" height="24" fill="#000" />
                            <rect x="72" y="0" width="2" height="24" fill="#000" />
                            <rect x="76" y="0" width="5" height="24" fill="#000" />
                            <rect x="83" y="0" width="2" height="24" fill="#000" />
                            <rect x="87" y="0" width="4" height="24" fill="#000" />
                            <rect x="93" y="0" width="3" height="24" fill="#000" />
                            <rect x="98" y="0" width="2" height="24" fill="#000" />
                          </svg>
                        </div>
                        <p className="text-[7px] text-center font-mono text-white/80 tracking-wider">
                          *{studentForCardPrint.nisn}*
                        </p>
                        <p className="text-[7px] text-white/70">
                          Berlaku s.d: <span className="font-bold text-white">Juni 2028</span>
                        </p>
                      </div>

                      {/* Pengesahan Kepala Sekolah */}
                      <div className="text-right leading-tight">
                        <p>{schoolInfo.city}, 15 Juli 2025</p>
                        <p className="font-semibold text-white/90">Kepala Sekolah,</p>
                        <div className="h-5 my-0.5" />
                        <p className="font-bold text-white underline text-[8.5px] uppercase">
                          {schoolInfo.headmasterName}
                        </p>
                        <p className="text-[7px] text-blue-200">
                          NIP. {schoolInfo.headmasterNip}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. TAMPAK BELAKANG KARTU */}
                {(cardPrintSide === 'both' || cardPrintSide === 'back') && (
                  <div className={`w-full max-w-[390px] rounded-2xl p-4 shadow-xl border relative overflow-hidden flex flex-col justify-between select-none ${themeStyles.bg}`}>
                    {/* Background Watermark Pattern */}
                    <div className={`absolute -left-8 -top-8 h-40 w-40 rounded-full ${themeStyles.glow} blur-2xl pointer-events-none no-print`} />

                    {/* Header Tampak Belakang */}
                    <div className={`flex items-center justify-between gap-2 border-b ${themeStyles.border} pb-2 relative z-10`}>
                      <div className="flex shrink-0 items-center justify-center">
                        {showLeft && (
                          <div className="h-8 w-8 rounded-full bg-white p-0.5 shadow-sm flex items-center justify-center overflow-hidden border border-white/80">
                            <SchoolLogoRenderer
                              preset={schoolInfo.logoLeftPreset || 'tutwuri'}
                              customUrl={schoolInfo.logoLeft}
                              width={28}
                              alt="Logo Kiri"
                            />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 text-center min-w-0 px-1">
                        <h4 className={`text-[10px] font-extrabold uppercase tracking-wider ${themeStyles.accent} leading-tight`}>
                          KETENTUAN DAN TATA TERTIB
                        </h4>
                        <p className="text-[8.5px] font-bold text-white uppercase truncate">
                          KARTU PELAJAR {schoolInfo.schoolName}
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center justify-center">
                        {showRight && (
                          <div className="h-8 w-8 rounded-full bg-white p-0.5 shadow-sm flex items-center justify-center overflow-hidden border border-white/80">
                            <SchoolLogoRenderer
                              preset={schoolInfo.logoRightPreset || 'merdeka'}
                              customUrl={schoolInfo.logoRight}
                              width={28}
                              alt="Logo Kanan"
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Point-Point Tata Tertib Resmi */}
                    <div className="my-2.5 space-y-1.5 text-[8.5px] leading-relaxed relative z-10">
                      <div className="flex items-start gap-1.5">
                        <span className={`font-bold ${themeStyles.accent} shrink-0`}>1.</span>
                        <p className="text-white/95">
                          Kartu ini merupakan tanda pengenal sah peserta didik <strong>{schoolInfo.schoolName}</strong>.
                        </p>
                      </div>
                      <div className="flex items-start gap-1.5">
                        <span className={`font-bold ${themeStyles.accent} shrink-0`}>2.</span>
                        <p className="text-white/95">
                          Wajib dibawa setiap hari saat mengikuti kegiatan pembelajaran dan presensi sekolah.
                        </p>
                      </div>
                      <div className="flex items-start gap-1.5">
                        <span className={`font-bold ${themeStyles.accent} shrink-0`}>3.</span>
                        <p className="text-white/95">
                          Dapat dipergunakan untuk peminjaman buku perpustakaan dan fasilitas resmi sekolah.
                        </p>
                      </div>
                      <div className="flex items-start gap-1.5">
                        <span className={`font-bold ${themeStyles.accent} shrink-0`}>4.</span>
                        <p className="text-white/95">
                          Dilarang meminjamkan atau memindahtangankan kartu ini kepada orang lain.
                        </p>
                      </div>
                      <div className="flex items-start gap-1.5">
                        <span className={`font-bold ${themeStyles.accent} shrink-0`}>5.</span>
                        <p className="text-white/95">
                          Bila menemukan kartu ini, mohon diserahkan ke alamat sekolah di bawah ini.
                        </p>
                      </div>
                    </div>

                    {/* Footer Tampak Belakang: Alamat & QR Code */}
                    <div className={`mt-2 pt-2 border-t ${themeStyles.border} flex items-center justify-between gap-3 text-[7.5px] relative z-10`}>
                      <div className={`space-y-0.5 text-left flex-1 min-w-0 ${themeStyles.sub}`}>
                        <p className="font-bold text-white truncate">{schoolInfo.schoolName}</p>
                        <p className="truncate">{schoolInfo.address}, Kec. {schoolInfo.subdistrict}, {schoolInfo.city}</p>
                        <p className="truncate">Telp: {schoolInfo.phoneNumber} • Email: {schoolInfo.email}</p>
                        <p className="font-mono text-white/80">Website: www.{schoolInfo.schoolName.toLowerCase().replace(/[^a-z0-9]/g, '')}.sch.id</p>
                      </div>

                      {/* Simulated QR Code */}
                      <div className="shrink-0 flex flex-col items-center">
                        <div className="h-11 w-11 bg-white p-1 rounded-lg shadow-md flex items-center justify-center">
                          <QrCode className="h-9 w-9 text-slate-900" />
                        </div>
                        <span className="text-[6.5px] font-mono text-white/70 mt-0.5">SCAN AUTH</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 no-print">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Format kartu standar siap cetak (kertas foto / kartu PVC A4).
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setStudentForCardPrint(null)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
                  >
                    Tutup
                  </button>
                  <button
                    onClick={() => {
                      window.print();
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-500/20 active:scale-95 transition-all"
                  >
                    <Printer className="h-4 w-4" />
                    <span>Cetak Kartu Pelajar</span>
                  </button>
                </div>
              </div>
            </div>
          </Modal>
        );
      })()}

      {/* Modal Cetak Buku Induk Lengkap */}
      {isPrintBukuIndukOpen && (
        <Modal
          isOpen={true}
          onClose={() => setIsPrintBukuIndukOpen(false)}
          title="Pratinjau Cetak Buku Induk Siswa"
          maxWidth="5xl"
        >
          <div className="space-y-6">
            <div
              id="printable-official-document"
              className="printable-document-sheet p-6 bg-white rounded-2xl border border-slate-200 text-black print:border-none print:shadow-none print:p-0 print:m-0 print:w-full"
            >
              <HeaderKopSekolah
                documentTitle="BUKU INDUK SISWA KELAS SEKOLAH DASAR"
                subTitle={`Tahun Ajaran ${schoolInfo.academicYear} • ${schoolInfo.className} • ${schoolInfo.kurikulum}`}
              />

              <div className="overflow-x-auto mt-4">
                <table className="w-full text-left text-[11px] border-collapse border border-black">
                  <thead>
                    <tr className="bg-slate-100 border border-black text-center font-bold">
                      <th className="border border-black p-1.5">No</th>
                      <th className="border border-black p-1.5">NISN</th>
                      <th className="border border-black p-1.5">NIS</th>
                      <th className="border border-black p-1.5">Nama Lengkap</th>
                      <th className="border border-black p-1.5">L/P</th>
                      <th className="border border-black p-1.5">Tempat & Tgl Lahir</th>
                      <th className="border border-black p-1.5">Agama</th>
                      <th className="border border-black p-1.5">Nama Orang Tua</th>
                      <th className="border border-black p-1.5">No. HP</th>
                      <th className="border border-black p-1.5">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((s, idx) => (
                      <tr key={s.id} className="border border-black">
                        <td className="border border-black p-1.5 text-center">{s.nomorAbsen}</td>
                        <td className="border border-black p-1.5 font-mono">{s.nisn}</td>
                        <td className="border border-black p-1.5 text-center font-mono">{s.nis}</td>
                        <td className="border border-black p-1.5 font-bold">{s.nama}</td>
                        <td className="border border-black p-1.5 text-center">{s.jenisKelamin}</td>
                        <td className="border border-black p-1.5">{s.tempatLahir}, {s.tanggalLahir}</td>
                        <td className="border border-black p-1.5">{s.agama}</td>
                        <td className="border border-black p-1.5">{s.namaAyah} / {s.namaIbu}</td>
                        <td className="border border-black p-1.5">{s.noHpOrtu}</td>
                        <td className="border border-black p-1.5 text-center">{s.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

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
                onClick={() => setIsPrintBukuIndukOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Tutup
              </button>
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md"
              >
                <Printer className="h-4 w-4" />
                <span>Cetak Dokumen Sekarang</span>
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Single Student Confirmation */}
      {studentToDelete && (
        <ConfirmDialog
          isOpen={true}
          onClose={() => setStudentToDelete(null)}
          onConfirm={() => {
            deleteStudent(studentToDelete.id);
            setStudentToDelete(null);
          }}
          title={`Hapus Siswa: ${studentToDelete.nama}?`}
          message={`Apakah Anda yakin ingin menghapus data siswa ${studentToDelete.nama} (NISN: ${studentToDelete.nisn})? Semua data absensi, nilai, dan rekam konseling terkait akan dihapus secara permanen.`}
          confirmText="Ya, Hapus Data"
          isDestructive={true}
        />
      )}

      {/* Delete Selected Students Confirmation */}
      {isDeleteSelectedModalOpen && (
        <ConfirmDialog
          isOpen={true}
          onClose={() => setIsDeleteSelectedModalOpen(false)}
          onConfirm={() => {
            deleteSelectedStudents(selectedStudentIds);
            setSelectedStudentIds([]);
            setIsDeleteSelectedModalOpen(false);
          }}
          title={`Hapus ${selectedStudentIds.length} Siswa Terpilih?`}
          message={`Apakah Anda yakin ingin menghapus ${selectedStudentIds.length} data siswa yang telah dipilih? Semua riwayat nilai, presensi, dan rekam konseling siswa terpilih akan dihapus secara permanen.`}
          confirmText={`Ya, Hapus ${selectedStudentIds.length} Siswa`}
          isDestructive={true}
        />
      )}

      {/* Modal Hapus Semua Siswa & Buku Induk */}
      {isDeleteAllModalOpen && (
        <Modal
          isOpen={isDeleteAllModalOpen}
          onClose={() => {
            setIsDeleteAllModalOpen(false);
            setConfirmDeleteInput('');
          }}
          title="Hapus Semua Data Siswa & Buku Induk"
          subtitle={`Konfirmasi penghapusan massal seluruh peserta didik ${schoolInfo.className}`}
          maxWidth="md"
          icon={<Trash2 className="h-5 w-5 text-rose-600 dark:text-rose-400" />}
        >
          <div className="space-y-4">
            <div className="rounded-xl border border-rose-200 bg-rose-50/90 p-4 dark:border-rose-900/60 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200 space-y-2.5">
              <div className="flex items-center gap-2 font-bold text-sm text-rose-700 dark:text-rose-300">
                <AlertTriangle className="h-5 w-5 shrink-0 text-rose-600 dark:text-rose-400" />
                <span>Peringatan: Tindakan Ini Tidak Dapat Dibatalkan!</span>
              </div>
              <p className="text-xs leading-relaxed text-rose-800 dark:text-rose-200">
                Anda akan menghapus seluruh data siswa sebanyak <strong>{students.length} peserta didik</strong> dari Buku Induk kelas <strong>{schoolInfo.className}</strong>.
              </p>
              <div className="pt-2 border-t border-rose-200/70 dark:border-rose-900/60 text-[11px] space-y-1.5 text-rose-800 dark:text-rose-300">
                <p className="font-bold">Data terkait yang otomatis ikut dibersihkan:</p>
                <ul className="list-disc list-inside space-y-0.5 ml-1">
                  <li>Seluruh profil & biodata Buku Induk siswa</li>
                  <li>Rekam nilai asesmen formatif (TP 1-4) & sumatif (STS/SAS)</li>
                  <li>Rekapitulasi presensi harian & kehadiran kelas</li>
                  <li>Catatan iuran & pembukuan kas mingguan siswa</li>
                  <li>Rekam catatan konseling, ekstrakurikuler, & piket kelas</li>
                </ul>
              </div>
            </div>

            <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 p-3.5 border border-slate-200 dark:border-slate-800 text-xs space-y-2">
              <p className="font-semibold text-slate-700 dark:text-slate-200">
                Ketik kata <span className="font-mono font-bold text-rose-600 dark:text-rose-400 bg-rose-100 dark:bg-rose-950/60 px-1.5 py-0.5 rounded">HAPUS</span> untuk konfirmasi:
              </p>
              <input
                type="text"
                value={confirmDeleteInput}
                onChange={e => setConfirmDeleteInput(e.target.value)}
                placeholder='Ketik "HAPUS" disini...'
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs text-slate-900 dark:text-white font-mono tracking-wider focus:outline-none focus:border-rose-500"
                autoFocus
              />
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setIsDeleteAllModalOpen(false);
                  setConfirmDeleteInput('');
                }}
                className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={confirmDeleteInput.trim().toUpperCase() !== 'HAPUS'}
                onClick={() => {
                  deleteAllStudents();
                  setIsDeleteAllModalOpen(false);
                  setSelectedStudentIds([]);
                  setConfirmDeleteInput('');
                }}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-rose-600 hover:bg-rose-700 text-white shadow-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer active:scale-95"
              >
                <Trash2 className="h-4 w-4" />
                <span>Hapus Semua Siswa ({students.length})</span>
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal Import Excel Data Siswa & Buku Induk */}
      {isImportModalOpen && (
        <Modal
          isOpen={isImportModalOpen}
          onClose={() => {
            setIsImportModalOpen(false);
            setImportFile(null);
            setParsedImportStudents(null);
            setImportErrors([]);
          }}
          title="Import Data Siswa & Buku Induk (.xlsx)"
          maxWidth="max-w-4xl"
        >
          <div className="space-y-5">
            {/* Top Instruction & Template Download */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-blue-500/10 border border-emerald-200 dark:border-emerald-800/60">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-xs">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    <span>Terhubung Otomatis ke Data Siswa & Buku Induk</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 max-w-xl">
                    Data yang diimpor akan langsung melengkapi NISN, NIS, Tempat Tanggal Lahir, Orang Tua, Kontak, dan status peserta didik baik di tabel siswa maupun lembar Buku Induk.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleDownloadStudentTemplate}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-all active:scale-95 shrink-0 cursor-pointer"
                >
                  <Download className="h-4 w-4" />
                  <span>Unduh Template Siswa (.xlsx)</span>
                </button>
              </div>
            </div>

            {/* Mode selection */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Mode Penanganan Data:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                <label
                  className={`flex items-start gap-2.5 p-3 rounded-xl border cursor-pointer transition-all ${
                    importMode === 'append'
                      ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-500 text-emerald-900 dark:text-emerald-200'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <input
                    type="radio"
                    name="importMode"
                    value="append"
                    checked={importMode === 'append'}
                    onChange={() => setImportMode('append')}
                    className="mt-0.5"
                  />
                  <div>
                    <div className="font-bold">Gabungkan / Update (Append)</div>
                    <div className="text-[11px] opacity-80 mt-0.5">
                      Menambah siswa baru dan memperbarui siswa lama berdasarkan NISN/NIS tanpa menghapus data yang ada.
                    </div>
                  </div>
                </label>

                <label
                  className={`flex items-start gap-2.5 p-3 rounded-xl border cursor-pointer transition-all ${
                    importMode === 'replace'
                      ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-500 text-amber-900 dark:text-amber-200'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <input
                    type="radio"
                    name="importMode"
                    value="replace"
                    checked={importMode === 'replace'}
                    onChange={() => setImportMode('replace')}
                    className="mt-0.5"
                  />
                  <div>
                    <div className="font-bold">Ganti Seluruh Data Siswa (Replace)</div>
                    <div className="text-[11px] opacity-80 mt-0.5">
                      Menggantikan semua siswa di kelas ini dengan daftar peserta didik baru dari file Excel.
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* Upload Box */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Pilih atau Tarik File Excel (.xlsx / .xls):
              </label>
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const file = e.dataTransfer.files?.[0];
                  if (file) handleFileSelectForImport(file);
                }}
                className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-emerald-500 dark:hover:border-emerald-500 rounded-2xl p-6 text-center transition-colors bg-white dark:bg-slate-900/50"
              >
                <input
                  type="file"
                  id="siswa-excel-input"
                  accept=".xlsx, .xls, .csv"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileSelectForImport(file);
                  }}
                  className="hidden"
                />
                <label
                  htmlFor="siswa-excel-input"
                  className="cursor-pointer flex flex-col items-center justify-center gap-2"
                >
                  <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    <FileUp className="h-6 w-6" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline">
                      Klik untuk memilih file
                    </span>{' '}
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      atau tarik & letakkan file Excel di sini
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Format yang didukung: .xlsx, .xls (Otomatis mendeteksi kolom Dapodik & Buku Induk)
                  </p>
                  {importFile && (
                    <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-200 text-xs font-semibold">
                      <FileSpreadsheet className="h-4 w-4" />
                      <span>{importFile.name} ({(importFile.size / 1024).toFixed(1)} KB)</span>
                    </div>
                  )}
                </label>
              </div>
            </div>

            {/* Parsing Indicator */}
            {isParsingImport && (
              <div className="flex items-center justify-center gap-2.5 py-6 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
                <RefreshCw className="h-5 w-5 animate-spin" />
                <span>Membaca dan memverifikasi data siswa dari Excel...</span>
              </div>
            )}

            {/* Live Preview Table */}
            {parsedImportStudents && parsedImportStudents.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-800 dark:text-white">
                      Pratinjau Hasil Pembacaan:
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800">
                      {parsedImportStudents.length} Siswa Siap Diimpor
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500">
                    Total {importTotalRows} baris di Excel
                  </span>
                </div>

                <div className="overflow-x-auto max-h-64 border border-slate-200 dark:border-slate-800 rounded-xl">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-slate-50 dark:bg-slate-800/80 sticky top-0 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300">
                      <tr>
                        <th className="px-3 py-2 text-center w-12 font-bold">No</th>
                        <th className="px-3 py-2 font-bold">NISN</th>
                        <th className="px-3 py-2 font-bold">NIS</th>
                        <th className="px-3 py-2 font-bold">Nama Siswa</th>
                        <th className="px-2 py-2 text-center font-bold">L/P</th>
                        <th className="px-3 py-2 font-bold">Tempat, Tgl Lahir</th>
                        <th className="px-3 py-2 font-bold">Agama</th>
                        <th className="px-3 py-2 font-bold">Nama Ayah / Ibu</th>
                        <th className="px-3 py-2 font-bold">No HP</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                      {parsedImportStudents.map((s, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                          <td className="px-3 py-2 text-center font-medium text-slate-400">{s.nomorAbsen || idx + 1}</td>
                          <td className="px-3 py-2 font-mono text-[11px] text-blue-600 dark:text-blue-400">{s.nisn || '-'}</td>
                          <td className="px-3 py-2 font-mono text-[11px]">{s.nis || '-'}</td>
                          <td className="px-3 py-2 font-semibold text-slate-900 dark:text-white">{s.nama}</td>
                          <td className="px-2 py-2 text-center font-bold">
                            <span className={`px-1.5 py-0.5 rounded text-[10px] ${s.jenisKelamin === 'P' ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300' : 'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300'}`}>
                              {s.jenisKelamin}
                            </span>
                          </td>
                          <td className="px-3 py-2 text-[11px]">{s.tempatLahir}, {s.tanggalLahir}</td>
                          <td className="px-3 py-2 text-[11px]">{s.agama}</td>
                          <td className="px-3 py-2 text-[11px]">{s.namaAyah} / {s.namaIbu}</td>
                          <td className="px-3 py-2 font-mono text-[11px]">{s.noHpOrtu || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {importErrors.length > 0 && (
                  <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-[11px] text-amber-800 dark:text-amber-200 space-y-1 max-h-24 overflow-y-auto">
                    <div className="font-bold flex items-center gap-1.5">
                      <AlertTriangle className="h-3.5 w-3.5" />
                      <span>Catatan Pembacaan ({importErrors.length} baris dilewati):</span>
                    </div>
                    {importErrors.map((err, i) => (
                      <div key={i} className="pl-5">• {err}</div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setIsImportModalOpen(false);
                  setCurrentTab('import_excel');
                }}
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1 self-start cursor-pointer"
              >
                <span>Buka Pusat Import/Export Seluruh Modul</span>
              </button>

              <div className="flex items-center gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setIsImportModalOpen(false);
                    setImportFile(null);
                    setParsedImportStudents(null);
                    setImportErrors([]);
                  }}
                  className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="button"
                  disabled={!parsedImportStudents || parsedImportStudents.length === 0}
                  onClick={handleApplyImportedStudents}
                  className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer active:scale-95"
                >
                  <Check className="h-4 w-4" />
                  <span>Simpan ke Data Siswa & Buku Induk ({parsedImportStudents?.length || 0})</span>
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
