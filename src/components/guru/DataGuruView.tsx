import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Teacher } from '../../types';
import { FormGuruModal } from './FormGuruModal';
import { DetailGuruModal } from './DetailGuruModal';
import { PrintGuruModal } from './PrintGuruModal';
import {
  UserCheck,
  UserPlus,
  Search,
  Filter,
  Printer,
  Edit3,
  Trash2,
  Phone,
  Mail,
  Briefcase,
  GraduationCap,
  LayoutGrid,
  List,
  Sparkles,
  BookOpen,
  Award,
  ShieldCheck,
  MessageCircle,
  Eye,
  CheckCircle2,
  Building2,
  Users,
  FileSpreadsheet
} from 'lucide-react';

export const DataGuruView: React.FC = () => {
  const { teachers, deleteTeacher, currentUser, schoolInfo, setCurrentTab } = useApp();

  // State Management
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedJenisGuru, setSelectedJenisGuru] = useState<string>('Semua');
  const [selectedKepegawaian, setSelectedKepegawaian] = useState<string>('Semua');
  const [selectedStatusAktif, setSelectedStatusAktif] = useState<string>('Semua');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Modals
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [teacherToEdit, setTeacherToEdit] = useState<Teacher | null>(null);

  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedTeacherForDetail, setSelectedTeacherForDetail] = useState<Teacher | null>(null);

  const [isPrintOpen, setIsPrintOpen] = useState(false);
  const [selectedTeacherForPrint, setSelectedTeacherForPrint] = useState<Teacher | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<Teacher | null>(null);

  const isAdmin = currentUser.role === 'admin';

  // Metrics Calculation
  const metrics = useMemo(() => {
    const safeTeachers = teachers || [];
    const total = safeTeachers.length;
    const pns = safeTeachers.filter(t => t.statusKepegawaian === 'PNS').length;
    const pppk = safeTeachers.filter(t => t.statusKepegawaian === 'PPPK').length;
    const honorer = safeTeachers.filter(t => t.statusKepegawaian === 'GTT / Honorer' || t.statusKepegawaian === 'Guru Tetap Yayasan').length;
    const aktif = safeTeachers.filter(t => t.statusAktif === 'Aktif').length;
    const guruKelas = safeTeachers.filter(t => t.jenisGuru === 'Guru Kelas').length;
    const guruMapel = safeTeachers.filter(t => t.jenisGuru === 'Guru Mapel').length;

    return { total, pns, pppk, honorer, aktif, guruKelas, guruMapel };
  }, [teachers]);

  // Filtering Logic
  const filteredTeachers = useMemo(() => {
    const safeTeachers = teachers || [];
    return safeTeachers.filter(teacher => {
      const q = searchQuery.toLowerCase();
      const matchSearch =
        teacher.nama.toLowerCase().includes(q) ||
        teacher.nip.toLowerCase().includes(q) ||
        (teacher.nuptk || '').toLowerCase().includes(q) ||
        teacher.jabatan.toLowerCase().includes(q) ||
        (teacher.jurusan || '').toLowerCase().includes(q) ||
        (teacher.kelasDiampu || '').toLowerCase().includes(q) ||
        (teacher.mataPelajaranUtama || []).some(m => m.toLowerCase().includes(q));

      const matchJenis = selectedJenisGuru === 'Semua' || teacher.jenisGuru === selectedJenisGuru;
      const matchKepegawaian = selectedKepegawaian === 'Semua' || teacher.statusKepegawaian === selectedKepegawaian;
      const matchAktif = selectedStatusAktif === 'Semua' || teacher.statusAktif === selectedStatusAktif;

      return matchSearch && matchJenis && matchKepegawaian && matchAktif;
    });
  }, [teachers, searchQuery, selectedJenisGuru, selectedKepegawaian, selectedStatusAktif]);

  const handleOpenAdd = () => {
    setTeacherToEdit(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (teacher: Teacher) => {
    setTeacherToEdit(teacher);
    setIsFormOpen(true);
  };

  const handleOpenDetail = (teacher: Teacher) => {
    setSelectedTeacherForDetail(teacher);
    setIsDetailOpen(true);
  };

  const handleOpenPrint = (teacher?: Teacher) => {
    setSelectedTeacherForPrint(teacher || null);
    setIsPrintOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (deleteTarget) {
      deleteTeacher(deleteTarget.id);
      setDeleteTarget(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Aktif':
        return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
      case 'Cuti':
        return 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200 dark:border-amber-800';
      case 'Mutasi':
        return 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border-blue-200 dark:border-blue-800';
      default:
        return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700';
    }
  };

  const getKepegawaianBadge = (status: string) => {
    switch (status) {
      case 'PNS':
        return 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800';
      case 'PPPK':
        return 'bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300 border-purple-200 dark:border-purple-800';
      case 'GTT / Honorer':
        return 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200 dark:border-amber-800';
      default:
        return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="h-10 w-10 rounded-xl bg-purple-600/10 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
              <UserCheck className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Manajemen Guru & Tenaga Kependidikan</span>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                  {teachers.length} PTK
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Kelola profil pendidik, data NIP/NUPTK, status SK kepegawaian, beban mengajar, dan buku induk guru SD.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => setCurrentTab('import_excel')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-950/40 hover:bg-purple-100 dark:hover:bg-purple-900/50 text-purple-700 dark:text-purple-300 text-xs font-bold shadow-sm transition-all active:scale-95"
            title="Import data guru dari template Excel atau unduh template resmi"
          >
            <FileSpreadsheet className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            <span>Import / Ekspor Excel</span>
          </button>

          <button
            type="button"
            onClick={() => handleOpenPrint()}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold shadow-sm transition-all active:scale-95"
          >
            <Printer className="h-4 w-4 text-slate-500 dark:text-slate-400" />
            <span>Cetak DUK Guru</span>
          </button>

          <button
            type="button"
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md shadow-purple-600/25 transition-all active:scale-95"
          >
            <UserPlus className="h-4 w-4" />
            <span>Tambah Guru Baru</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold">Total Guru & Tendik</span>
            <Users className="h-4 w-4 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {metrics.total}
          </div>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
            {metrics.aktif} Aktif Mengajar
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold">Aparatur PNS</span>
            <ShieldCheck className="h-4 w-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
            {metrics.pns}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Pegawai Negeri Sipil
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold">Pegawai PPPK</span>
            <Award className="h-4 w-4 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {metrics.pppk}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            PPPK Kemendikbud
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold">GTT / Honorer</span>
            <Briefcase className="h-4 w-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
            {metrics.honorer}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Guru Tidak Tetap / Sekolah
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Cari nama guru, NIP, NUPTK, mapel, jurusan, jabatan..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-purple-500"
            />
          </div>

          {/* View mode */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-slate-700 text-purple-600 dark:text-purple-300 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Tampilan Kartu Grid"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === 'table'
                  ? 'bg-white dark:bg-slate-700 text-purple-600 dark:text-purple-300 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Tampilan Tabel Lengkap"
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
          <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 font-semibold mr-1">
            <Filter className="h-3.5 w-3.5" />
            <span>Filter:</span>
          </div>

          <select
            value={selectedJenisGuru}
            onChange={e => setSelectedJenisGuru(e.target.value)}
            className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs text-slate-800 dark:text-slate-200"
          >
            <option value="Semua">Semua Jenis Tugas</option>
            <option value="Kepala Sekolah">Kepala Sekolah</option>
            <option value="Guru Kelas">Guru Kelas</option>
            <option value="Guru Mapel">Guru Mata Pelajaran</option>
            <option value="Guru BK">Guru BK / Konselor</option>
            <option value="Tenaga Kependidikan">Tenaga Kependidikan / TU</option>
          </select>

          <select
            value={selectedKepegawaian}
            onChange={e => setSelectedKepegawaian(e.target.value)}
            className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs text-slate-800 dark:text-slate-200"
          >
            <option value="Semua">Semua Kepegawaian</option>
            <option value="PNS">PNS</option>
            <option value="PPPK">PPPK</option>
            <option value="GTT / Honorer">GTT / Honorer</option>
            <option value="Guru Tetap Yayasan">Yayasan</option>
          </select>

          <select
            value={selectedStatusAktif}
            onChange={e => setSelectedStatusAktif(e.target.value)}
            className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs text-slate-800 dark:text-slate-200"
          >
            <option value="Semua">Semua Status Aktif</option>
            <option value="Aktif">Aktif Mengajar</option>
            <option value="Cuti">Cuti</option>
            <option value="Mutasi">Mutasi</option>
            <option value="Pensiun">Purna Tugas</option>
          </select>

          {(searchQuery || selectedJenisGuru !== 'Semua' || selectedKepegawaian !== 'Semua' || selectedStatusAktif !== 'Semua') && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedJenisGuru('Semua');
                setSelectedKepegawaian('Semua');
                setSelectedStatusAktif('Semua');
              }}
              className="text-xs text-purple-600 dark:text-purple-400 hover:underline ml-auto font-medium"
            >
              Reset Filter
            </button>
          )}
        </div>
      </div>

      {/* Main Content: Grid vs Table */}
      {filteredTeachers.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center space-y-3">
          <div className="h-12 w-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 mx-auto flex items-center justify-center">
            <UserCheck className="h-6 w-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
            Tidak Ada Data Guru yang Sesuai
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            Coba ubah kata kunci pencarian atau reset filter untuk menampilkan seluruh data pendidik & tenaga kependidikan.
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTeachers.map(teacher => {
            const cleanPhone = teacher.noHp.replace(/\D/g, '');
            const waUrl = cleanPhone.startsWith('0')
              ? `https://wa.me/62${cleanPhone.slice(1)}`
              : `https://wa.me/${cleanPhone}`;

            return (
              <div
                key={teacher.id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
              >
                <div className="p-5 space-y-4">
                  {/* Top Bar with Avatar & Tags */}
                  <div className="flex items-start gap-3.5">
                    <div className="relative flex-shrink-0">
                      <img
                        src={teacher.fotoUrl || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&auto=format&fit=crop&q=80'}
                        alt={teacher.nama}
                        className="h-14 w-14 rounded-2xl object-cover border border-slate-200 dark:border-slate-700 shadow-sm"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&auto=format&fit=crop&q=80';
                        }}
                      />
                      <span className={`absolute -bottom-1 -right-1 px-1.5 py-0.2 rounded-md text-[9px] font-bold border ${getStatusBadge(teacher.statusAktif)}`}>
                        {teacher.statusAktif}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${getKepegawaianBadge(teacher.statusKepegawaian)}`}>
                          {teacher.statusKepegawaian}
                        </span>
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          {teacher.jenisGuru}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                        {teacher.nama}
                      </h4>
                      <p className="text-xs text-purple-600 dark:text-purple-400 font-medium truncate">
                        {teacher.jabatan}
                      </p>
                    </div>
                  </div>

                  {/* Info Snippets */}
                  <div className="space-y-1.5 text-[11px] bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800/60">
                    <div className="flex justify-between">
                      <span className="text-slate-500 dark:text-slate-400">NIP:</span>
                      <span className="font-mono font-semibold text-slate-900 dark:text-white">{teacher.nip || '-'}</span>
                    </div>
                    {teacher.nuptk && teacher.nuptk !== '-' && (
                      <div className="flex justify-between">
                        <span className="text-slate-500 dark:text-slate-400">NUPTK:</span>
                        <span className="font-mono text-slate-700 dark:text-slate-300">{teacher.nuptk}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-slate-500 dark:text-slate-400">Pendidikan:</span>
                      <span className="font-medium text-slate-800 dark:text-slate-200 truncate max-w-[170px]">
                        {teacher.pendidikanTerakhir}
                      </span>
                    </div>
                    {teacher.kelasDiampu && (
                      <div className="flex justify-between">
                        <span className="text-slate-500 dark:text-slate-400">Kelas Diampu:</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{teacher.kelasDiampu}</span>
                      </div>
                    )}
                  </div>

                  {/* Mapel Tags */}
                  {teacher.mataPelajaranUtama && teacher.mataPelajaranUtama.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {teacher.mataPelajaranUtama.slice(0, 3).map((mapel, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-md bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 text-[10px] font-medium border border-purple-100 dark:border-purple-900/30"
                        >
                          {mapel}
                        </span>
                      ))}
                      {teacher.mataPelajaranUtama.length > 3 && (
                        <span className="px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 text-[10px]">
                          +{teacher.mataPelajaranUtama.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Footer Action Buttons */}
                <div className="px-5 py-3 bg-slate-50/80 dark:bg-slate-850 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1">
                    {teacher.noHp && (
                      <a
                        href={waUrl}
                        target="_blank"
                        rel="noreferrer"
                        title="Chat WhatsApp"
                        className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 hover:bg-emerald-100 transition-colors"
                      >
                        <MessageCircle className="h-4 w-4" />
                      </a>
                    )}
                    <button
                      type="button"
                      onClick={() => handleOpenPrint(teacher)}
                      title="Cetak Profil Guru"
                      className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition-colors"
                    >
                      <Printer className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleOpenDetail(teacher)}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      <span>Detail</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenEdit(teacher)}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 hover:bg-purple-100 transition-colors"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                      <span>Edit</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeleteTarget(teacher)}
                      title="Hapus Data Guru"
                      className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="p-3.5 text-center w-10">No</th>
                  <th className="p-3.5">Nama & NIP</th>
                  <th className="p-3.5">Jabatan & Tugas</th>
                  <th className="p-3.5">Kepegawaian</th>
                  <th className="p-3.5">Pendidikan</th>
                  <th className="p-3.5">Kontak</th>
                  <th className="p-3.5 text-center">Status</th>
                  <th className="p-3.5 text-center w-28">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredTeachers.map((teacher, index) => {
                  const cleanPhone = teacher.noHp.replace(/\D/g, '');
                  const waUrl = cleanPhone.startsWith('0')
                    ? `https://wa.me/62${cleanPhone.slice(1)}`
                    : `https://wa.me/${cleanPhone}`;

                  return (
                    <tr key={teacher.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="p-3.5 text-center font-semibold text-slate-500">{index + 1}</td>
                      <td className="p-3.5">
                        <div className="flex items-center gap-3">
                          <img
                            src={teacher.fotoUrl || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&auto=format&fit=crop&q=80'}
                            alt={teacher.nama}
                            className="h-9 w-9 rounded-xl object-cover border border-slate-200 dark:border-slate-700 flex-shrink-0"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&auto=format&fit=crop&q=80';
                            }}
                          />
                          <div>
                            <div className="font-bold text-slate-900 dark:text-white hover:text-purple-600 cursor-pointer" onClick={() => handleOpenDetail(teacher)}>
                              {teacher.nama}
                            </div>
                            <div className="font-mono text-[11px] text-slate-500">
                              NIP: {teacher.nip || '-'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-3.5">
                        <div className="font-semibold text-slate-800 dark:text-slate-200">{teacher.jabatan}</div>
                        <div className="text-[11px] text-slate-500">{teacher.kelasDiampu || teacher.jenisGuru}</div>
                      </td>
                      <td className="p-3.5">
                        <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold border ${getKepegawaianBadge(teacher.statusKepegawaian)}`}>
                          {teacher.statusKepegawaian}
                        </span>
                        {teacher.golonganPangkat && teacher.golonganPangkat !== '-' && (
                          <div className="text-[10px] text-slate-500 mt-0.5">{teacher.golonganPangkat}</div>
                        )}
                      </td>
                      <td className="p-3.5">
                        <div className="font-medium text-slate-800 dark:text-slate-200">{teacher.pendidikanTerakhir}</div>
                        <div className="text-[11px] text-slate-500">{teacher.jurusan || '-'}</div>
                      </td>
                      <td className="p-3.5">
                        <div className="flex items-center gap-1.5">
                          {teacher.noHp && (
                            <a
                              href={waUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="font-mono text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
                            >
                              <MessageCircle className="h-3 w-3" />
                              <span>{teacher.noHp}</span>
                            </a>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400 truncate max-w-[150px]">{teacher.email}</div>
                      </td>
                      <td className="p-3.5 text-center">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${getStatusBadge(teacher.statusAktif)}`}>
                          {teacher.statusAktif}
                        </span>
                      </td>
                      <td className="p-3.5 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleOpenDetail(teacher)}
                            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400"
                            title="Lihat Detail"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(teacher)}
                            className="p-1.5 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-950/40 text-purple-600 dark:text-purple-400"
                            title="Edit Guru"
                          >
                            <Edit3 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteTarget(teacher)}
                            className="p-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-950/40 text-red-600 dark:text-red-400"
                            title="Hapus"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
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

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <div className="h-10 w-10 rounded-xl bg-red-100 dark:bg-red-950/50 flex items-center justify-center">
                <Trash2 className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Hapus Data Guru / Tendik?
                </h3>
                <p className="text-xs text-slate-500">Tindakan ini akan menghapus data guru dari sistem.</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-xs space-y-1">
              <p className="font-bold text-slate-900 dark:text-white">{deleteTarget.nama}</p>
              <p className="text-slate-500">NIP: {deleteTarget.nip} • {deleteTarget.jabatan}</p>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 text-xs font-bold rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-600/20 active:scale-95 transition-all"
              >
                Ya, Hapus Data Guru
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Form Modal (Add / Edit) */}
      <FormGuruModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setTeacherToEdit(null);
        }}
        teacherToEdit={teacherToEdit}
      />

      {/* Detail Modal */}
      <DetailGuruModal
        isOpen={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false);
          setSelectedTeacherForDetail(null);
        }}
        teacher={selectedTeacherForDetail}
        onEdit={(t) => {
          setIsDetailOpen(false);
          handleOpenEdit(t);
        }}
        onPrintSingle={(t) => {
          setIsDetailOpen(false);
          handleOpenPrint(t);
        }}
      />

      {/* Print Modal */}
      <PrintGuruModal
        isOpen={isPrintOpen}
        onClose={() => {
          setIsPrintOpen(false);
          setSelectedTeacherForPrint(null);
        }}
        selectedTeacher={selectedTeacherForPrint}
      />
    </div>
  );
};
