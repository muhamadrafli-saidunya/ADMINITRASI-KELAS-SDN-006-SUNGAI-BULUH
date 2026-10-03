import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Subject, TujuanPembelajaran, AgamaType, isTPForSemester, normalizeSemester } from '../../types';
import { Modal } from '../common/Modal';
import { KurikulumFaseSelectorModal } from '../common/KurikulumFaseSelectorModal';
import {
  isAgamaSubject,
  AGAMA_LIST,
  AGAMA_DETAILS,
  getAllStandardAgamaTPs
} from '../../utils/agamaHelper';
import {
  detectPhaseKey,
  CURRICULUM_PHASE_PRESETS
} from '../../data/kurikulumMerdekaPresets';
import {
  BookOpen,
  Plus,
  Edit2,
  Trash2,
  RotateCcw,
  Search,
  SlidersHorizontal,
  Layers,
  GraduationCap,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Filter,
  Copy,
  FileText,
  ChevronRight,
  Info,
  Building2,
  Calculator,
  Compass,
  HeartHandshake,
  Activity,
  Palette,
  Languages,
  ShieldCheck,
  Award,
  Check,
  X
} from 'lucide-react';

export const MataPelajaranDanTPSection: React.FC = () => {
  const {
    schoolInfo,
    subjects,
    addSubject,
    updateSubject,
    deleteSubject,
    tujuanPembelajaranList,
    addTP,
    bulkAddTP,
    updateTP,
    deleteTP,
    resetTPToDefault,
    teachers,
    currentUser,
    addToast,
    students
  } = useApp();

  const safeSubjects = subjects || [];
  const safeTeachers = teachers || [];
  const safeTPs = tujuanPembelajaranList || [];
  const safeStudents = students || [];

  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(safeSubjects[0]?.id || 'mapel-05');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterKelompok, setFilterKelompok] = useState<'Semua' | 'Umum' | 'Muatan Lokal' | 'Pilihan'>('Semua');
  const [filterSemester, setFilterSemester] = useState<'Semua' | '1 (Ganjil)' | '2 (Genap)'>('Semua');
  const [filterAgama, setFilterAgama] = useState<'Semua' | AgamaType>('Semua');
  const [isPhaseModalOpen, setIsPhaseModalOpen] = useState(false);

  // Modal State for Subject
  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
  const [subjectModalMode, setSubjectModalMode] = useState<'add' | 'edit'>('add');
  const [editingSubjectId, setEditingSubjectId] = useState<string | null>(null);
  const [subjectFormData, setSubjectFormData] = useState<{
    kode: string;
    nama: string;
    kelompok: 'Umum' | 'Muatan Lokal' | 'Pilihan';
    kktp: number;
    guruPengampu: string;
    iconName: string;
    deskripsi: string;
    jumlahJamPerMinggu: number;
  }>({
    kode: '',
    nama: '',
    kelompok: 'Umum',
    kktp: 75,
    guruPengampu: safeTeachers[0]?.nama || 'Sri Wahyuni, S.Pd., Gr.',
    iconName: 'BookOpen',
    deskripsi: '',
    jumlahJamPerMinggu: 4
  });

  // Modal State for TP
  const [isTPModalOpen, setIsTPModalOpen] = useState(false);
  const [tpModalMode, setTPModalMode] = useState<'add' | 'edit'>('add');
  const [editingTPId, setEditingTPId] = useState<string | null>(null);
  const [tpFormData, setTpFormData] = useState<{
    mapelId: string;
    kode: string;
    lingkupMateri: string;
    deskripsi: string;
    semester: '1 (Ganjil)' | '2 (Genap)' | 'Semua';
    fase: string;
    kktp: number;
    ringkasanRaporTuntas: string;
    ringkasanRaporPerluBimbingan: string;
    agama?: AgamaType | 'Semua';
  }>({
    mapelId: selectedSubjectId,
    kode: 'TP 1',
    lingkupMateri: '',
    deskripsi: '',
    semester: normalizeSemester(schoolInfo?.semester),
    fase: 'Fase B (Kelas 4)',
    kktp: 75,
    ringkasanRaporTuntas: '',
    ringkasanRaporPerluBimbingan: '',
    agama: 'Islam'
  });

  // Confirm delete dialog states
  const [deleteSubjectConfirmId, setDeleteSubjectConfirmId] = useState<string | null>(null);
  const [deleteTPConfirmId, setDeleteTPConfirmId] = useState<string | null>(null);
  const [isResetTPConfirmOpen, setIsResetTPConfirmOpen] = useState(false);

  const isTeacherOrAdmin = currentUser.role !== 'siswa';

  const currentSubject = safeSubjects.find(s => s.id === selectedSubjectId) || safeSubjects[0];
  const isAgama = isAgamaSubject(currentSubject);
  const allTPsForCurrentSubject = safeTPs.filter(tp => tp.mapelId === currentSubject?.id);

  // Student count by religion for class summary
  const agamaStudentCount = React.useMemo(() => {
    const counts: Record<string, number> = { Islam: 0, Kristen: 0, Katolik: 0, Hindu: 0, Buddha: 0, Konghucu: 0 };
    safeStudents.forEach(s => {
      if (counts[s.agama] !== undefined) {
        counts[s.agama]++;
      }
    });
    return counts;
  }, [safeStudents]);

  // Filtered TPs
  const filteredTPs = allTPsForCurrentSubject.filter(tp => {
    const matchesSearch =
      tp.kode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tp.lingkupMateri.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tp.deskripsi.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSemester = filterSemester === 'Semua' ? true : isTPForSemester(tp, filterSemester);
    const matchesAgama =
      !isAgama ||
      filterAgama === 'Semua' ||
      tp.agama === filterAgama ||
      (!tp.agama && filterAgama === 'Islam');
    return matchesSearch && matchesSemester && matchesAgama;
  });

  // Filtered Subjects
  const filteredSubjects = safeSubjects.filter(s => {
    if (filterKelompok === 'Semua') return true;
    return s.kelompok === filterKelompok;
  });

  // Open Add Subject Modal
  const handleOpenAddSubject = () => {
    setSubjectModalMode('add');
    setEditingSubjectId(null);
    setSubjectFormData({
      kode: '',
      nama: '',
      kelompok: 'Umum',
      kktp: 75,
      guruPengampu: teachers[0]?.nama || 'Sri Wahyuni, S.Pd., Gr.',
      iconName: 'BookOpen',
      deskripsi: '',
      jumlahJamPerMinggu: 4
    });
    setIsSubjectModalOpen(true);
  };

  // Open Edit Subject Modal
  const handleOpenEditSubject = (subject: Subject) => {
    setSubjectModalMode('edit');
    setEditingSubjectId(subject.id);
    setSubjectFormData({
      kode: subject.kode,
      nama: subject.nama,
      kelompok: subject.kelompok,
      kktp: subject.kktp,
      guruPengampu: subject.guruPengampu,
      iconName: subject.iconName || 'BookOpen',
      deskripsi: subject.deskripsi || '',
      jumlahJamPerMinggu: subject.jumlahJamPerMinggu || 4
    });
    setIsSubjectModalOpen(true);
  };

  // Save Subject
  const handleSaveSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subjectFormData.nama.trim() || !subjectFormData.kode.trim()) {
      addToast('error', 'Validasi Gagal', 'Nama Mata Pelajaran dan Kode Mapel wajib diisi.');
      return;
    }

    if (subjectModalMode === 'add') {
      addSubject({
        kode: subjectFormData.kode.trim().toUpperCase(),
        nama: subjectFormData.nama.trim(),
        kelompok: subjectFormData.kelompok,
        kktp: Number(subjectFormData.kktp) || 75,
        guruPengampu: subjectFormData.guruPengampu,
        iconName: subjectFormData.iconName,
        deskripsi: subjectFormData.deskripsi.trim(),
        jumlahJamPerMinggu: Number(subjectFormData.jumlahJamPerMinggu) || 4
      });
    } else if (editingSubjectId) {
      updateSubject(editingSubjectId, {
        kode: subjectFormData.kode.trim().toUpperCase(),
        nama: subjectFormData.nama.trim(),
        kelompok: subjectFormData.kelompok,
        kktp: Number(subjectFormData.kktp) || 75,
        guruPengampu: subjectFormData.guruPengampu,
        iconName: subjectFormData.iconName,
        deskripsi: subjectFormData.deskripsi.trim(),
        jumlahJamPerMinggu: Number(subjectFormData.jumlahJamPerMinggu) || 4
      });
    }

    setIsSubjectModalOpen(false);
  };

  // Open Add TP Modal
  const handleOpenAddTP = (targetMapelId?: string) => {
    const mapelIdToUse = targetMapelId || selectedSubjectId;
    const targetMapel = subjects.find(s => s.id === mapelIdToUse);
    const existingCount = tujuanPembelajaranList.filter(tp => tp.mapelId === mapelIdToUse).length;
    const nextKode = `TP ${existingCount + 1}`;

    setTPModalMode('add');
    setEditingTPId(null);
    setTpFormData({
      mapelId: mapelIdToUse,
      kode: nextKode,
      lingkupMateri: '',
      deskripsi: '',
      semester: '1 (Ganjil)',
      fase: targetMapel?.deskripsi || 'Fase B (Kelas 4)',
      kktp: targetMapel?.kktp || 75,
      ringkasanRaporTuntas: '',
      ringkasanRaporPerluBimbingan: '',
      agama: isAgamaSubject(targetMapel) ? (filterAgama !== 'Semua' ? filterAgama : 'Islam') : undefined
    });
    setIsTPModalOpen(true);
  };

  // Open Edit TP Modal
  const handleOpenEditTP = (tp: TujuanPembelajaran) => {
    const parentMapel = subjects.find(s => s.id === tp.mapelId);
    setTPModalMode('edit');
    setEditingTPId(tp.id);
    setTpFormData({
      mapelId: tp.mapelId,
      kode: tp.kode,
      lingkupMateri: tp.lingkupMateri,
      deskripsi: tp.deskripsi,
      semester: tp.semester,
      fase: tp.fase || 'Fase B (Kelas 4)',
      kktp: tp.kktp || 75,
      ringkasanRaporTuntas: tp.ringkasanRaporTuntas || '',
      ringkasanRaporPerluBimbingan: tp.ringkasanRaporPerluBimbingan || '',
      agama: tp.agama || (isAgamaSubject(parentMapel) ? 'Islam' : undefined)
    });
    setIsTPModalOpen(true);
  };

  // Load all standard TPs for all 6 religions
  const handleLoadAllStandardAgamaTPs = () => {
    if (!currentSubject) return;
    const stdTPs = getAllStandardAgamaTPs(currentSubject.id, schoolInfo.phase || 'Fase B (Kelas 4)');
    const existingKeys = new Set(
      allTPsForCurrentSubject.map(t => `${t.agama || 'Islam'}-${t.kode}-${t.semester}`)
    );
    const toAdd: TujuanPembelajaran[] = [];
    stdTPs.forEach((tp, idx) => {
      const key = `${tp.agama || 'Islam'}-${tp.kode}-${tp.semester}`;
      if (!existingKeys.has(key)) {
        toAdd.push({
          ...tp,
          id: `tp-${(tp.agama || 'islam').toLowerCase().slice(0, 3)}-${currentSubject.id}-${idx + 1}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`
        });
      }
    });

    if (toAdd.length > 0) {
      bulkAddTP(toAdd);
    }

    addToast(
      'success',
      'TP Standar 6 Agama Dimuat',
      `Berhasil menambahkan ${toAdd.length} butir TP standar Kurikulum Merdeka untuk 6 agama pada mapel ${currentSubject.nama}.`
    );
  };

  // Duplicate TP
  const handleDuplicateTP = (tp: TujuanPembelajaran) => {
    const existingCount = tujuanPembelajaranList.filter(t => t.mapelId === tp.mapelId).length;
    addTP({
      mapelId: tp.mapelId,
      kode: `TP ${existingCount + 1}`,
      lingkupMateri: `${tp.lingkupMateri} (Salinan)`,
      deskripsi: tp.deskripsi,
      semester: tp.semester,
      fase: tp.fase,
      kktp: tp.kktp,
      ringkasanRaporTuntas: tp.ringkasanRaporTuntas,
      ringkasanRaporPerluBimbingan: tp.ringkasanRaporPerluBimbingan,
      agama: tp.agama
    });
  };

  // Save TP
  const handleSaveTP = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tpFormData.lingkupMateri.trim() || !tpFormData.deskripsi.trim()) {
      addToast('error', 'Validasi Gagal', 'Lingkup Materi/Bab dan Rumusan Tujuan Pembelajaran (TP) wajib diisi.');
      return;
    }

    // Auto generate summary if empty
    const tuntasSummary =
      tpFormData.ringkasanRaporTuntas.trim() ||
      `Sangat menguasai pemahaman materi ${tpFormData.lingkupMateri.toLowerCase()}`;
    const perluBimbinganSummary =
      tpFormData.ringkasanRaporPerluBimbingan.trim() ||
      `Perlu bimbingan dan latihan tambahan pada materi ${tpFormData.lingkupMateri.toLowerCase()}`;

    if (tpModalMode === 'add') {
      addTP({
        mapelId: tpFormData.mapelId,
        kode: tpFormData.kode.trim(),
        lingkupMateri: tpFormData.lingkupMateri.trim(),
        deskripsi: tpFormData.deskripsi.trim(),
        semester: tpFormData.semester,
        fase: tpFormData.fase.trim(),
        kktp: Number(tpFormData.kktp) || 75,
        ringkasanRaporTuntas: tuntasSummary,
        ringkasanRaporPerluBimbingan: perluBimbinganSummary,
        agama: tpFormData.agama
      });
    } else if (editingTPId) {
      updateTP(editingTPId, {
        mapelId: tpFormData.mapelId,
        kode: tpFormData.kode.trim(),
        lingkupMateri: tpFormData.lingkupMateri.trim(),
        deskripsi: tpFormData.deskripsi.trim(),
        semester: tpFormData.semester,
        fase: tpFormData.fase.trim(),
        kktp: Number(tpFormData.kktp) || 75,
        ringkasanRaporTuntas: tuntasSummary,
        ringkasanRaporPerluBimbingan: perluBimbinganSummary,
        agama: tpFormData.agama
      });
    }

    setIsTPModalOpen(false);
  };

  // Helper Icon Renderer
  const renderSubjectIcon = (iconName: string) => {
    switch (iconName) {
      case 'ShieldCheck': return <ShieldCheck className="h-5 w-5" />;
      case 'BookOpen': return <BookOpen className="h-5 w-5" />;
      case 'Calculator': return <Calculator className="h-5 w-5" />;
      case 'Compass': return <Compass className="h-5 w-5" />;
      case 'HeartHandshake': return <HeartHandshake className="h-5 w-5" />;
      case 'Activity': return <Activity className="h-5 w-5" />;
      case 'Palette': return <Palette className="h-5 w-5" />;
      case 'Languages': return <Languages className="h-5 w-5" />;
      case 'Building2': return <Building2 className="h-5 w-5" />;
      default: return <BookOpen className="h-5 w-5" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Overview */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
              <Layers className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Struktur Mata Pelajaran & Tujuan Pembelajaran (TP)
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Pengelolaan kurikulum operasional, kriteria ketercapaian (KKTP), dan modul capaian kompetensi per mata pelajaran
              </p>
            </div>
          </div>

          {/* Action Buttons Header */}
          {isTeacherOrAdmin && (
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setIsPhaseModalOpen(true)}
                className="flex items-center gap-1.5 rounded-xl border border-indigo-200 bg-gradient-to-r from-indigo-50 to-blue-50 px-3.5 py-2 text-xs font-bold text-indigo-700 hover:from-indigo-100 hover:to-blue-100 dark:border-indigo-800 dark:from-indigo-950/60 dark:to-blue-950/60 dark:text-indigo-300 transition-all shadow-xs active:scale-95"
              >
                <Sparkles className="h-4 w-4 text-indigo-600" />
                <span>Otomatis Sesuaikan Fase Kurikulum</span>
              </button>

              <button
                onClick={() => setIsResetTPConfirmOpen(true)}
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition-colors"
                title="Reset seluruh TP ke standar awal Kurikulum Merdeka"
              >
                <RotateCcw className="h-3.5 w-3.5 text-slate-500" />
                <span>Reset Standar TP</span>
              </button>

              <button
                onClick={handleOpenAddSubject}
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>+ Mapel</span>
              </button>

              <button
                onClick={() => handleOpenAddTP(selectedSubjectId)}
                className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-700 active:scale-95 transition-all"
              >
                <Plus className="h-4 w-4" />
                <span>+ TP Baru</span>
              </button>
            </div>
          )}
        </div>

        {/* Global Stats Mini Grid */}
        <div className="mt-5 grid grid-cols-2 sm:grid-cols-5 gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div
            onClick={() => setIsPhaseModalOpen(true)}
            className="p-3 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/40 dark:to-purple-950/40 border border-indigo-200/80 dark:border-indigo-900/60 cursor-pointer hover:border-indigo-400 transition-colors group"
          >
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300">Fase Aktif</p>
              <Sparkles className="h-3 w-3 text-indigo-500 group-hover:rotate-12 transition-transform" />
            </div>
            <p className="text-sm font-extrabold text-indigo-950 dark:text-indigo-200 mt-1 truncate">
              {schoolInfo?.phase || 'Fase B (Kelas IV)'}
            </p>
            <p className="text-[10px] text-indigo-600 dark:text-indigo-400">Klik ganti fase &bull; auto-sync</p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Total Mata Pelajaran</p>
            <p className="text-xl font-extrabold text-slate-900 dark:text-white mt-0.5">{subjects.length}</p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">Umum & Muatan Lokal</p>
          </div>

          <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50">
            <p className="text-[10px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300">Total Tujuan Pembelajaran</p>
            <p className="text-xl font-extrabold text-blue-950 dark:text-white mt-0.5">{tujuanPembelajaranList.length}</p>
            <p className="text-[10px] text-blue-600 dark:text-blue-400">Tersusun aktif di database</p>
          </div>

          <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50">
            <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300">TP Mapel Terpilih</p>
            <p className="text-xl font-extrabold text-indigo-950 dark:text-white mt-0.5">{allTPsForCurrentSubject.length}</p>
            <p className="text-[10px] text-indigo-600 dark:text-indigo-400 truncate">{currentSubject?.nama || '-'}</p>
          </div>

          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/50">
            <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">Rerata KKTP Kelas</p>
            <p className="text-xl font-extrabold text-emerald-950 dark:text-white mt-0.5">
              {(subjects.reduce((acc, s) => acc + s.kktp, 0) / (subjects.length || 1)).toFixed(0)}
            </p>
            <p className="text-[10px] text-emerald-600 dark:text-emerald-400">Batas Minimal Tuntas</p>
          </div>
        </div>
      </div>

      {/* Main Two-Column Layout: Left Subjects List & Right TP Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Subjects Carousel/List (lg:col-span-4) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 shadow-sm">
            <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <BookOpen className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <span>Pilih Mata Pelajaran</span>
              </h3>
              <span className="text-[11px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-full">
                {filteredSubjects.length} Mapel
              </span>
            </div>

            {/* Filter by Category */}
            <div className="flex gap-1.5 overflow-x-auto py-2.5 custom-scrollbar">
              {(['Semua', 'Umum', 'Muatan Lokal', 'Pilihan'] as const).map(kat => (
                <button
                  key={kat}
                  onClick={() => setFilterKelompok(kat)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-colors ${
                    filterKelompok === kat
                      ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
                  }`}
                >
                  {kat}
                </button>
              ))}
            </div>

            {/* Subject Items List */}
            <div className="space-y-2 mt-1 max-h-[560px] overflow-y-auto pr-1 custom-scrollbar">
              {filteredSubjects.map(sub => {
                const isSelected = sub.id === selectedSubjectId;
                const tpCount = tujuanPembelajaranList.filter(t => t.mapelId === sub.id).length;

                return (
                  <div
                    key={sub.id}
                    onClick={() => setSelectedSubjectId(sub.id)}
                    className={`group relative p-3 rounded-xl border text-left cursor-pointer transition-all ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50/70 dark:bg-blue-950/40 dark:border-blue-600 shadow-sm ring-1 ring-blue-500/30'
                        : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900/60 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2.5 min-w-0">
                        <div
                          className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                            isSelected
                              ? 'bg-blue-600 text-white shadow-sm'
                              : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                          }`}
                        >
                          {renderSubjectIcon(sub.iconName)}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                              {sub.nama}
                            </p>
                            <span className="text-[10px] font-bold text-blue-700 dark:text-blue-300 bg-blue-100/70 dark:bg-blue-900/60 px-1.5 py-0.2 rounded shrink-0">
                              {sub.kode}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                            {sub.guruPengampu}
                          </p>
                        </div>
                      </div>

                      {/* Right info & Action Menu */}
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <span className="text-[10px] font-bold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 px-2 py-0.5 rounded-md">
                          {tpCount} TP
                        </span>
                        <span className="text-[9px] font-medium text-slate-400 dark:text-slate-500">
                          KKTP: {sub.kktp}
                        </span>
                      </div>
                    </div>

                    {/* Action buttons on card hover or selected */}
                    {isTeacherOrAdmin && (
                      <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px]">
                        <span className="text-[10px] text-slate-500 dark:text-slate-400">
                          Kelompok: <strong className="text-slate-700 dark:text-slate-200">{sub.kelompok}</strong>
                        </span>

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenEditSubject(sub);
                            }}
                            className="p-1 text-slate-500 hover:text-blue-600 hover:bg-white dark:hover:bg-slate-800 rounded transition-colors"
                            title="Edit Mata Pelajaran"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteSubjectConfirmId(sub.id);
                            }}
                            className="p-1 text-slate-500 hover:text-rose-600 hover:bg-white dark:hover:bg-slate-800 rounded transition-colors"
                            title="Hapus Mata Pelajaran"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Tujuan Pembelajaran (TP) Detail Table & Cards (lg:col-span-8) */}
        <div className="lg:col-span-8 space-y-4">
          {currentSubject ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 shadow-sm space-y-5">
              {/* Selected Subject Banner Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-start gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-md shadow-blue-600/20">
                    {renderSubjectIcon(currentSubject.iconName)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                        {currentSubject.nama}
                      </h3>
                      <span className="text-xs font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 px-2 py-0.5 rounded-lg">
                        Kode: {currentSubject.kode}
                      </span>
                      <span className="text-xs font-bold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 px-2 py-0.5 rounded-lg">
                        {currentSubject.kelompok}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Guru Pengampu: <span className="font-semibold text-slate-700 dark:text-slate-300">{currentSubject.guruPengampu}</span> • KKTP Standar: <span className="font-bold text-blue-600 dark:text-blue-400">{currentSubject.kktp}</span>
                    </p>
                  </div>
                </div>

                {/* Quick actions for selected subject */}
                {isTeacherOrAdmin && (
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleOpenEditSubject(currentSubject)}
                      className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition-colors"
                    >
                      <Edit2 className="h-3.5 w-3.5 text-slate-500" />
                      <span>Edit Mapel</span>
                    </button>
                    <button
                      onClick={() => handleOpenAddTP(currentSubject.id)}
                      className="flex items-center gap-1 rounded-xl bg-blue-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-blue-700 active:scale-95 transition-all"
                    >
                      <Plus className="h-4 w-4" />
                      <span>+ Tambah TP</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Religion Filter Bar for Pendidikan Agama */}
              {isAgama && (
                <div className="p-3.5 rounded-xl bg-gradient-to-r from-emerald-50/70 via-blue-50/70 to-indigo-50/70 dark:from-slate-800/80 dark:to-slate-800/80 border border-indigo-100 dark:border-slate-700 space-y-2.5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                      <Sparkles className="h-4 w-4 text-amber-500" />
                      <span>Pilihan Agama Siswa (Kurikulum Merdeka):</span>
                      <span className="text-[11px] font-normal text-slate-500 dark:text-slate-400 hidden md:inline">
                        (Disesuaikan otomatis dengan agama pada profil siswa)
                      </span>
                    </div>
                    {isTeacherOrAdmin && (
                      <button
                        type="button"
                        onClick={handleLoadAllStandardAgamaTPs}
                        className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-50 dark:hover:bg-slate-800 shadow-2xs transition-all cursor-pointer"
                        title="Muat rumusan TP standar untuk 6 agama sekaligus"
                      >
                        <Sparkles className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                        <span>Muat TP Standar 6 Agama</span>
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar pb-1">
                    <button
                      type="button"
                      onClick={() => setFilterAgama('Semua')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                        filterAgama === 'Semua'
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      Semua Agama ({allTPsForCurrentSubject.length} TP)
                    </button>
                    {AGAMA_LIST.map(agama => {
                      const countTP = allTPsForCurrentSubject.filter(
                        t => t.agama === agama || (!t.agama && agama === 'Islam')
                      ).length;
                      const studentCount = agamaStudentCount[agama] || 0;
                      const detail = AGAMA_DETAILS[agama];

                      return (
                        <button
                          key={agama}
                          type="button"
                          onClick={() => setFilterAgama(agama)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                            filterAgama === agama
                              ? 'bg-blue-600 text-white shadow-xs'
                              : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          <span>{agama} ({detail.kode})</span>
                          <span
                            className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                              filterAgama === agama
                                ? 'bg-white/20 text-white'
                                : `${detail.badgeBg} ${detail.badgeText}`
                            }`}
                          >
                            {countTP} TP &bull; {studentCount} Siswa
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Search & Filter Bar for TPs */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="relative w-full sm:w-72">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Cari rumusan atau materi TP..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/80 py-2 pl-9 pr-3 text-xs text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-100"
                  />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">Semester:</span>
                  <select
                    value={filterSemester}
                    onChange={(e: any) => setFilterSemester(e.target.value)}
                    className="rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                  >
                    <option value="Semua">Semua Semester</option>
                    <option value="1 (Ganjil)">Semester 1 (Ganjil)</option>
                    <option value="2 (Genap)">Semester 2 (Genap)</option>
                  </select>
                </div>
              </div>

              {/* TP Cards List */}
              {filteredTPs.length === 0 ? (
                <div className="text-center py-12 px-4 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                  <FileText className="h-10 w-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                  <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">
                    Belum Ada Tujuan Pembelajaran (TP)
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1">
                    Mata pelajaran ini belum memiliki rumusan TP yang terdaftar. Tambahkan TP untuk mulai menginput nilai asesmen formatif.
                  </p>
                  {isTeacherOrAdmin && (
                    <button
                      onClick={() => handleOpenAddTP(currentSubject.id)}
                      className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow hover:bg-blue-700 transition-all"
                    >
                      <Plus className="h-4 w-4" />
                      <span>+ Buat TP Pertama</span>
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredTPs.map((tp, idx) => (
                    <div
                      key={`${tp.id}-${tp.mapelId || ''}-${idx}`}
                      className="rounded-xl border border-slate-200 bg-slate-50/40 p-4 dark:border-slate-800 dark:bg-slate-800/40 hover:border-slate-300 dark:hover:border-slate-700 transition-all space-y-3"
                    >
                      {/* TP Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="flex items-center justify-center h-6 px-2.5 rounded-md bg-blue-600 text-white font-extrabold text-[11px] shadow-sm">
                            {tp.kode}
                          </span>
                          <h4 className="text-xs font-extrabold text-slate-900 dark:text-white">
                            {tp.lingkupMateri}
                          </h4>
                          <span className="text-[10px] font-semibold bg-slate-200/70 text-slate-700 dark:bg-slate-700 dark:text-slate-300 px-2 py-0.5 rounded">
                            {tp.semester}
                          </span>
                          {tp.agama && (
                            <span
                              className={`text-[10px] font-extrabold px-2 py-0.5 rounded border ${
                                AGAMA_DETAILS[tp.agama]?.badgeBg || 'bg-slate-100'
                              } ${AGAMA_DETAILS[tp.agama]?.badgeText || 'text-slate-700'} ${
                                AGAMA_DETAILS[tp.agama]?.badgeBorder || 'border-slate-300'
                              }`}
                            >
                              Agama: {tp.agama} ({AGAMA_DETAILS[tp.agama]?.kode || 'PAI'})
                            </span>
                          )}
                          {tp.fase && (
                            <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">
                              • {tp.fase}
                            </span>
                          )}
                        </div>

                        {/* Action buttons per TP */}
                        {isTeacherOrAdmin && (
                          <div className="flex items-center gap-1.5 self-end sm:self-auto">
                            <button
                              onClick={() => handleDuplicateTP(tp)}
                              className="p-1.5 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/70 dark:hover:bg-slate-700 rounded-lg transition-colors"
                              title="Duplikat TP"
                            >
                              <Copy className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => handleOpenEditTP(tp)}
                              className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-950/60 rounded-lg transition-colors"
                            >
                              <Edit2 className="h-3 w-3" />
                              <span>Edit</span>
                            </button>
                            <button
                              onClick={() => setDeleteTPConfirmId(tp.id)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/60 rounded-lg transition-colors"
                              title="Hapus TP"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Rumusan Deskripsi TP */}
                      <div className="bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-100 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                        <p className="font-semibold text-slate-900 dark:text-white mb-0.5 text-[11px] uppercase tracking-wider text-slate-400">
                          Rumusan Tujuan Pembelajaran:
                        </p>
                        <p>{tp.deskripsi}</p>
                      </div>

                      {/* Rapor Sentence Preview */}
                      {(tp.ringkasanRaporTuntas || tp.ringkasanRaporPerluBimbingan) && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                          {tp.ringkasanRaporTuntas && (
                            <div className="p-2.5 rounded-lg bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 text-emerald-900 dark:text-emerald-300">
                              <p className="font-bold flex items-center gap-1 text-[10px] uppercase tracking-wide text-emerald-700 dark:text-emerald-400">
                                <CheckCircle2 className="h-3 w-3" /> Deskripsi Rapor (Tuntas):
                              </p>
                              <p className="mt-0.5 italic">{tp.ringkasanRaporTuntas}</p>
                            </div>
                          )}

                          {tp.ringkasanRaporPerluBimbingan && (
                            <div className="p-2.5 rounded-lg bg-amber-50/70 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/40 text-amber-900 dark:text-amber-300">
                              <p className="font-bold flex items-center gap-1 text-[10px] uppercase tracking-wide text-amber-700 dark:text-amber-400">
                                <AlertTriangle className="h-3 w-3" /> Deskripsi Rapor (Perlu Bimbingan):
                              </p>
                              <p className="mt-0.5 italic">{tp.ringkasanRaporPerluBimbingan}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <p className="text-xs text-slate-500">Pilih mata pelajaran di kolom sebelah kiri untuk mengelola Tujuan Pembelajaran.</p>
            </div>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL TAMBAH / EDIT MATA PELAJARAN                                        */}
      {/* ========================================================================= */}
      <Modal
        isOpen={isSubjectModalOpen}
        onClose={() => setIsSubjectModalOpen(false)}
        title={subjectModalMode === 'add' ? 'Tambah Mata Pelajaran Baru' : 'Edit Data Mata Pelajaran'}
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleSaveSubject} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Kode Mapel <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: MAT, IPAS, BIN"
                value={subjectFormData.kode}
                onChange={e => setSubjectFormData(prev => ({ ...prev, kode: e.target.value }))}
                className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-800 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white uppercase font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Kelompok Mapel <span className="text-rose-500">*</span>
              </label>
              <select
                value={subjectFormData.kelompok}
                onChange={(e: any) => setSubjectFormData(prev => ({ ...prev, kelompok: e.target.value }))}
                className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-semibold text-slate-800 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                <option value="Umum">Umum (Wajib Nasional)</option>
                <option value="Muatan Lokal">Muatan Lokal (Mulok)</option>
                <option value="Pilihan">Pilihan / Seni & Prakarya</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Nama Lengkap Mata Pelajaran <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Ilmu Pengetahuan Alam & Sosial (IPAS)"
              value={subjectFormData.nama}
              onChange={e => setSubjectFormData(prev => ({ ...prev, nama: e.target.value }))}
              className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-800 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white font-semibold"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Kriteria Ketuntasan (KKTP) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min="50"
                max="100"
                required
                value={subjectFormData.kktp}
                onChange={e => setSubjectFormData(prev => ({ ...prev, kktp: Number(e.target.value) }))}
                className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-bold text-slate-800 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
              <span className="text-[10px] text-slate-400">Standar sekolah: 70 - 75</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Alokasi Jam/Minggu (JP)
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={subjectFormData.jumlahJamPerMinggu}
                onChange={e => setSubjectFormData(prev => ({ ...prev, jumlahJamPerMinggu: Number(e.target.value) }))}
                className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-800 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Guru Pengampu Mapel <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Nama Guru & Gelar"
              value={subjectFormData.guruPengampu}
              onChange={e => setSubjectFormData(prev => ({ ...prev, guruPengampu: e.target.value }))}
              list="guru-options"
              className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-800 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
            <datalist id="guru-options">
              {teachers.map(t => (
                <option key={t.id} value={t.nama} />
              ))}
            </datalist>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Ikon Mata Pelajaran
            </label>
            <select
              value={subjectFormData.iconName}
              onChange={e => setSubjectFormData(prev => ({ ...prev, iconName: e.target.value }))}
              className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-semibold text-slate-800 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            >
              <option value="BookOpen">Buku / Literasi (Bahasa Indonesia)</option>
              <option value="Calculator">Kalkulator / Hitung (Matematika)</option>
              <option value="Compass">Kompas / Alam & Sosial (IPAS)</option>
              <option value="ShieldCheck">Perisai Garuda (Pendidikan Pancasila)</option>
              <option value="HeartHandshake">Hati & Budi Pekerti (Agama Islam/PAI)</option>
              <option value="Activity">Aktivitas Fisik / Olahraga (PJOK)</option>
              <option value="Palette">Palet Lukis (Seni Rupa & Prakarya)</option>
              <option value="Languages">Bahasa / Multilingual (Bahasa Inggris)</option>
              <option value="Building2">Gedung / Budaya Lokal (PLBJ)</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsSubjectModalOpen(false)}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              Batal
            </button>
            <button
              type="submit"
              className="rounded-xl bg-blue-600 px-5 py-2 text-xs font-bold text-white shadow-md hover:bg-blue-700 transition-all"
            >
              {subjectModalMode === 'add' ? 'Simpan Mata Pelajaran' : 'Simpan Perubahan'}
            </button>
          </div>
        </form>
      </Modal>

      {/* ========================================================================= */}
      {/* MODAL TAMBAH / EDIT TUJUAN PEMBELAJARAN (TP)                              */}
      {/* ========================================================================= */}
      <Modal
        isOpen={isTPModalOpen}
        onClose={() => setIsTPModalOpen(false)}
        title={tpModalMode === 'add' ? 'Tambah Tujuan Pembelajaran (TP)' : 'Edit Tujuan Pembelajaran'}
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleSaveTP} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Mata Pelajaran <span className="text-rose-500">*</span>
              </label>
              <select
                value={tpFormData.mapelId}
                onChange={e => setTpFormData(prev => ({ ...prev, mapelId: e.target.value }))}
                className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-semibold text-slate-800 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                {subjects.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.nama} ({s.kode})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Kode TP <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: TP 1, TP 2, TP 4.1"
                value={tpFormData.kode}
                onChange={e => setTpFormData(prev => ({ ...prev, kode: e.target.value }))}
                className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-bold text-slate-800 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Semester <span className="text-rose-500">*</span>
              </label>
              <select
                value={tpFormData.semester}
                onChange={(e: any) => setTpFormData(prev => ({ ...prev, semester: e.target.value }))}
                className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-semibold text-slate-800 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                <option value="1 (Ganjil)">1 (Ganjil)</option>
                <option value="2 (Genap)">2 (Genap)</option>
                <option value="Semua">Semua Semester</option>
              </select>
            </div>

            {/* Agama Terkait (for Religion Subjects) */}
            {isAgamaSubject(subjects.find(s => s.id === tpFormData.mapelId)) && (
              <div className="col-span-1 sm:col-span-3 pt-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Agama Terkait (Disesuaikan dengan Agama Siswa di Profil) <span className="text-blue-500">*</span>
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-7 gap-1.5">
                  <button
                    type="button"
                    onClick={() => setTpFormData(prev => ({ ...prev, agama: 'Semua' }))}
                    className={`px-2 py-1.5 rounded-lg text-xs font-bold border transition-all text-center ${
                      tpFormData.agama === 'Semua'
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    Semua
                  </button>
                  {AGAMA_LIST.map(a => {
                    const isSelected = tpFormData.agama === a;
                    return (
                      <button
                        key={a}
                        type="button"
                        onClick={() => setTpFormData(prev => ({ ...prev, agama: a }))}
                        className={`px-2 py-1.5 rounded-lg text-xs font-bold border transition-all text-center ${
                          isSelected
                            ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                            : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        {a}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Bab / Lingkup Materi Pokok <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Bab 1: Pancasila Sebagai Nilai Kehidupan"
              value={tpFormData.lingkupMateri}
              onChange={e => setTpFormData(prev => ({ ...prev, lingkupMateri: e.target.value }))}
              className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-800 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white font-semibold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Rumusan Kalimat Tujuan Pembelajaran (TP) <span className="text-rose-500">*</span>
            </label>
            <textarea
              required
              rows={3}
              placeholder="Contoh: Peserta didik mampu menjelaskan makna dan keterkaitan sila-sila Pancasila dalam kehidupan sehari-hari secara kritis dan mandiri."
              value={tpFormData.deskripsi}
              onChange={e => setTpFormData(prev => ({ ...prev, deskripsi: e.target.value }))}
              className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-800 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white leading-relaxed"
            />
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-3">
            <p className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-amber-500" />
              <span>Kustomisasi Deskripsi Rapor Kurikulum Merdeka (Otomatis)</span>
            </p>

            <div>
              <label className="block text-[11px] font-semibold text-emerald-800 dark:text-emerald-300 mb-1">
                Kalimat Capaian Tertinggi (Saat Nilai Siswa Tuntas / Tinggi):
              </label>
              <input
                type="text"
                placeholder="Contoh: Sangat menguasai pemahaman makna simbol dan penerapan sila Pancasila"
                value={tpFormData.ringkasanRaporTuntas}
                onChange={e => setTpFormData(prev => ({ ...prev, ringkasanRaporTuntas: e.target.value }))}
                className="w-full rounded-lg border border-slate-200 bg-white p-2 text-xs text-slate-800 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-amber-800 dark:text-amber-300 mb-1">
                Kalimat Perlu Peningkatan (Saat Siswa Belum Tuntas / Perlu Bimbingan):
              </label>
              <input
                type="text"
                placeholder="Contoh: Perlu bimbingan intensif dalam menerapkan nilai gotong royong sila Pancasila"
                value={tpFormData.ringkasanRaporPerluBimbingan}
                onChange={e => setTpFormData(prev => ({ ...prev, ringkasanRaporPerluBimbingan: e.target.value }))}
                className="w-full rounded-lg border border-slate-200 bg-white p-2 text-xs text-slate-800 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsTPModalOpen(false)}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              Batal
            </button>
            <button
              type="submit"
              className="rounded-xl bg-blue-600 px-5 py-2 text-xs font-bold text-white shadow-md hover:bg-blue-700 transition-all"
            >
              {tpModalMode === 'add' ? 'Simpan Tujuan Pembelajaran' : 'Simpan Perubahan TP'}
            </button>
          </div>
        </form>
      </Modal>

      {/* ========================================================================= */}
      {/* CONFIRM DELETE SUBJECT DIALOG                                             */}
      {/* ========================================================================= */}
      <Modal
        isOpen={deleteSubjectConfirmId !== null}
        onClose={() => setDeleteSubjectConfirmId(null)}
        title="Konfirmasi Hapus Mata Pelajaran"
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border border-rose-100 dark:border-rose-900/50">
            <AlertTriangle className="h-5 w-5 shrink-0 text-rose-600 mt-0.5" />
            <div className="text-xs">
              <p className="font-bold">Apakah Anda yakin ingin menghapus mata pelajaran ini?</p>
              <p className="mt-1 text-rose-700 dark:text-rose-400">
                Seluruh data Tujuan Pembelajaran (TP) dan nilai siswa yang terhubung dengan mata pelajaran ini akan ikut dihapus.
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setDeleteSubjectConfirmId(null)}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={() => {
                if (deleteSubjectConfirmId) {
                  deleteSubject(deleteSubjectConfirmId);
                  setDeleteSubjectConfirmId(null);
                  if (selectedSubjectId === deleteSubjectConfirmId) {
                    const remaining = subjects.filter(s => s.id !== deleteSubjectConfirmId);
                    if (remaining[0]) setSelectedSubjectId(remaining[0].id);
                  }
                }
              }}
              className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white shadow hover:bg-rose-700"
            >
              Ya, Hapus Mapel
            </button>
          </div>
        </div>
      </Modal>

      {/* ========================================================================= */}
      {/* CONFIRM DELETE TP DIALOG                                                  */}
      {/* ========================================================================= */}
      <Modal
        isOpen={deleteTPConfirmId !== null}
        onClose={() => setDeleteTPConfirmId(null)}
        title="Konfirmasi Hapus TP"
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-600 dark:text-slate-300">
            Apakah Anda yakin ingin menghapus rumusan Tujuan Pembelajaran ini dari mata pelajaran?
          </p>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setDeleteTPConfirmId(null)}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={() => {
                if (deleteTPConfirmId) {
                  deleteTP(deleteTPConfirmId);
                  setDeleteTPConfirmId(null);
                }
              }}
              className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white shadow hover:bg-rose-700"
            >
              Hapus TP
            </button>
          </div>
        </div>
      </Modal>

      {/* ========================================================================= */}
      {/* CONFIRM RESET TP TO DEFAULT DIALOG                                        */}
      {/* ========================================================================= */}
      <Modal
        isOpen={isResetTPConfirmOpen}
        onClose={() => setIsResetTPConfirmOpen(false)}
        title="Reset Daftar TP ke Standar Kurikulum"
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-600 dark:text-slate-300">
            Tindakan ini akan mengembalikan seluruh rumusan Tujuan Pembelajaran (TP) untuk seluruh mata pelajaran kelas 4 SD ke konfigurasi standar awal Kurikulum Merdeka.
          </p>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsResetTPConfirmOpen(false)}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={() => {
                resetTPToDefault();
                setIsResetTPConfirmOpen(false);
              }}
              className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow hover:bg-blue-700"
            >
              Reset ke Standar
            </button>
          </div>
        </div>
      </Modal>

      {/* Modal Sinkronisasi Fase Kurikulum Merdeka */}
      <KurikulumFaseSelectorModal
        isOpen={isPhaseModalOpen}
        onClose={() => setIsPhaseModalOpen(false)}
      />
    </div>
  );
};
