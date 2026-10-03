import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Extracurricular, Student } from '../../types';
import { Modal } from '../common/Modal';
import { HeaderKopSekolah } from '../common/HeaderKopSekolah';
import {
  Trophy,
  Plus,
  Edit2,
  Trash2,
  Search,
  Printer,
  Sparkles,
  Users,
  Award,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Star,
  Check,
  X,
  Compass,
  Activity,
  Music,
  HeartHandshake,
  BookOpen,
  Laptop,
  Palette,
  ShieldCheck,
  ChevronRight,
  UserCheck,
  Zap,
  Filter
} from 'lucide-react';

interface ExtracurricularPreset {
  nama: string;
  kategori: 'Kepramukaan' | 'Olahraga' | 'Seni & Budaya' | 'Keagamaan' | 'Sains & Teknologi' | 'Bahasa';
  icon: React.ReactNode;
  deskripsiTemplate: {
    'Sangat Baik': string;
    'Baik': string;
    'Cukup': string;
  };
}

const PRESET_EXTRACURRICULARS: ExtracurricularPreset[] = [
  {
    nama: 'Pramuka Siaga / Penggalang',
    kategori: 'Kepramukaan',
    icon: <Compass className="h-4 w-4 text-amber-600" />,
    deskripsiTemplate: {
      'Sangat Baik': 'Sangat aktif, disiplin, dan terampil dalam tali-temali, semaphore, serta kepemimpinan regu.',
      'Baik': 'Aktif mengikuti latihan kepramukaan, disiplin, dan mampu bekerjasama dalam kegiatan regu.',
      'Cukup': 'Cukup aktif mengikuti kegiatan kepramukaan dan perlu peningkatan kemandirian dalam perkemahan.'
    }
  },
  {
    nama: 'Dokter Kecil (UKS)',
    kategori: 'Olahraga',
    icon: <ShieldCheck className="h-4 w-4 text-emerald-600" />,
    deskripsiTemplate: {
      'Sangat Baik': 'Sangat terampil memahami prinsip P3K, tanggap dalam menjaga kebersihan dan kesehatan lingkungan sekolah.',
      'Baik': 'Mampu mempraktikkan dasar-dasar pertolongan pertama dan aktif menjaga kebersihan ruang UKS.',
      'Cukup': 'Cukup memahami dasar-dasar kebersihan dan kesehatan diri di lingkungan sekolah.'
    }
  },
  {
    nama: 'Seni Tari Tradisional',
    kategori: 'Seni & Budaya',
    icon: <Palette className="h-4 w-4 text-pink-600" />,
    deskripsiTemplate: {
      'Sangat Baik': 'Sangat luwes, percaya diri, dan menguasai ragam gerak tari tradisional daerah dengan harmonisasi irama yang indah.',
      'Baik': 'Mampu menirukan dan memperagakan rangkaian gerak tari tradisional dengan ritme yang baik.',
      'Cukup': 'Cukup antusias mengikuti latihan gerak dasar tari dan perlu melatih kelenturan gerak.'
    }
  },
  {
    nama: 'Klub Catur Prestasi',
    kategori: 'Olahraga',
    icon: <Trophy className="h-4 w-4 text-indigo-600" />,
    deskripsiTemplate: {
      'Sangat Baik': 'Memiliki daya analisis taktis tinggi, ketenangan bermain prima, dan mahir menyusun strategi pembukaan catur.',
      'Baik': 'Menguasai langkah taktis dasar dan mampu menyelesaikan problem catur dengan konsentrasi baik.',
      'Cukup': 'Cukup menguasai aturan dasar langkah catur dan perlu melatih kesabaran dalam membaca langkah lawan.'
    }
  },
  {
    nama: 'Robotika & Coding Dasar',
    kategori: 'Sains & Teknologi',
    icon: <Laptop className="h-4 w-4 text-blue-600" />,
    deskripsiTemplate: {
      'Sangat Baik': 'Sangat kreatif merakit modul sensorik dan mahir menyusun logika pemrograman visual Scratch secara mandiri.',
      'Baik': 'Mampu merangkai sirkuit dasar dan menjalankan instruksi blok coding dengan baik.',
      'Cukup': 'Cukup memahami konsep logika blok dan perlu bimbingan dalam pemecahan masalah algoritma sederhana.'
    }
  },
  {
    nama: 'Klub Sains & Olimpiade IPA',
    kategori: 'Sains & Teknologi',
    icon: <Sparkles className="h-4 w-4 text-cyan-600" />,
    deskripsiTemplate: {
      'Sangat Baik': 'Daya nalar kritis dan rasa ingin tahu ilmiah sangat tinggi serta tekun dalam eksperimen sains terapan.',
      'Baik': 'Tertarik melakukan uji coba ilmiah dan mampu menjelaskan fenomena sains sederhana dengan logis.',
      'Cukup': 'Cukup antusias mengikuti pengamatan sains dan perlu peningkatan ketelitian saat mencatat data.'
    }
  },
  {
    nama: 'BTQ & Tahfidz Quran',
    kategori: 'Keagamaan',
    icon: <BookOpen className="h-4 w-4 text-emerald-700" />,
    deskripsiTemplate: {
      'Sangat Baik': 'Fasih dalam makharijul huruf, menguasai kaidah tajwid, dan lancar menghafal surat-surat pendek Juz 30.',
      'Baik': 'Mampu membaca Al-Quran/Iqro sesuai makhraj dan aktif menambah hafalan ayat pilihan.',
      'Cukup': 'Cukup lancar dalam membaca ayat dan perlu bimbingan rutin penguatan hukum tajwid.'
    }
  },
  {
    nama: 'Futsal & Atletik Siswa',
    kategori: 'Olahraga',
    icon: <Activity className="h-4 w-4 text-orange-600" />,
    deskripsiTemplate: {
      'Sangat Baik': 'Memiliki stamina prima, kelincahan teknik mengolah bola tinggi, dan menjunjung tinggi sportivitas regu.',
      'Baik': 'Aktif, bugar, serta mampu mengaplikasikan teknik dasar dribbling dan passing dengan baik.',
      'Cukup': 'Cukup bersemangat saat bermain dan perlu melatih koordinasi fisik serta kerjasama tim.'
    }
  },
  {
    nama: 'Seni Musik & Angklung',
    kategori: 'Seni & Budaya',
    icon: <Music className="h-4 w-4 text-purple-600" />,
    deskripsiTemplate: {
      'Sangat Baik': 'Peka terhadap nada (pitch), sangat kompak dalam ansambel musik daerah, dan percaya diri tampil di panggung.',
      'Baik': 'Mampu memainkan instrumen musik dengan tempo dan harmonisasi nada yang selaras.',
      'Cukup': 'Cukup mampu memainkan alat musik sederhana dan perlu melatih kepekaan ketukan ritmis.'
    }
  },
  {
    nama: 'Klub Bahasa Inggris Cilik (English Club)',
    kategori: 'Bahasa',
    icon: <Award className="h-4 w-4 text-teal-600" />,
    deskripsiTemplate: {
      'Sangat Baik': 'Percaya diri berbicara bahasa Inggris sederhana, perbendaharaan kosakata luas, dan pelafalan (pronunciation) sangat baik.',
      'Baik': 'Mampu memahami percakapan instruksional sehari-hari dan merespons pertanyaan bahasa Inggris dengan tepat.',
      'Cukup': 'Cukup berani melafalkan salam dan kosakata dasar dalam bahasa Inggris.'
    }
  }
];

export const EkstrakurikulerSection: React.FC = () => {
  const {
    students,
    extracurriculars,
    addExtracurricular,
    updateExtracurricular,
    deleteExtracurricular,
    schoolInfo,
    currentUser,
    addToast
  } = useApp();

  const safeStudents = students || [];
  const safeExtracurriculars = extracurriculars || [];

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPredicate, setFilterPredicate] = useState<'Semua' | 'Sangat Baik' | 'Baik' | 'Cukup'>('Semua');
  const [filterCategory, setFilterCategory] = useState<string>('Semua');
  const [viewMode, setViewMode] = useState<'per_siswa' | 'per_kegiatan'>('per_siswa');

  // Modal State for Single Item Add/Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Extracurricular | null>(null);
  const [formData, setFormData] = useState<{
    siswaId: string;
    namaKegiatan: string;
    predikat: 'Sangat Baik' | 'Baik' | 'Cukup';
    keterangan: string;
  }>({
    siswaId: safeStudents[0]?.id || '',
    namaKegiatan: PRESET_EXTRACURRICULARS[0].nama,
    predikat: 'Sangat Baik',
    keterangan: PRESET_EXTRACURRICULARS[0].deskripsiTemplate['Sangat Baik']
  });

  // Modal State for Batch Assign
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);
  const [batchSelectedStudentIds, setBatchSelectedStudentIds] = useState<string[]>([]);
  const [batchActivityName, setBatchActivityName] = useState<string>('Pramuka Siaga / Penggalang');
  const [batchPredicate, setBatchPredicate] = useState<'Sangat Baik' | 'Baik' | 'Cukup'>('Sangat Baik');
  const [batchDescription, setBatchDescription] = useState<string>(
    PRESET_EXTRACURRICULARS[0].deskripsiTemplate['Sangat Baik']
  );

  // Delete Confirmation Modal State
  const [itemToDelete, setItemToDelete] = useState<Extracurricular | null>(null);

  // Print Modal State
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  const isTeacherOrAdmin = currentUser.role !== 'siswa';

  // Analytics
  const studentMap = useMemo(() => {
    const map = new Map<string, Student>();
    safeStudents.forEach(s => map.set(s.id, s));
    return map;
  }, [safeStudents]);

  const studentActivitiesMap = useMemo(() => {
    const map = new Map<string, Extracurricular[]>();
    safeStudents.forEach(s => map.set(s.id, []));
    safeExtracurriculars.forEach(ex => {
      const list = map.get(ex.siswaId) || [];
      list.push(ex);
      map.set(ex.siswaId, list);
    });
    return map;
  }, [safeStudents, safeExtracurriculars]);

  const totalRegisteredActivities = safeExtracurriculars.length;
  const studentsWithActivitiesCount = safeStudents.filter(
    s => (studentActivitiesMap.get(s.id)?.length || 0) > 0
  ).length;
  const uniqueActivitiesList = Array.from(new Set(safeExtracurriculars.map(e => e.namaKegiatan)));

  // Filtered Students
  const filteredStudents = useMemo(() => {
    return safeStudents.filter(student => {
      const matchesSearch =
        student.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.nisn.includes(searchQuery);

      if (!matchesSearch) return false;

      const studentExcurs = studentActivitiesMap.get(student.id) || [];

      if (filterPredicate !== 'Semua') {
        const hasPred = studentExcurs.some(e => e.predikat === filterPredicate);
        if (!hasPred) return false;
      }

      if (filterCategory !== 'Semua') {
        const hasCat = studentExcurs.some(e => e.namaKegiatan === filterCategory);
        if (!hasCat) return false;
      }

      return true;
    });
  }, [safeStudents, searchQuery, filterPredicate, filterCategory, studentActivitiesMap]);

  // Grouped by Activity
  const activityGroupMap = useMemo(() => {
    const map = new Map<string, Array<{ student: Student; ex: Extracurricular }>>();
    safeExtracurriculars.forEach(ex => {
      const student = studentMap.get(ex.siswaId);
      if (student) {
        const list = map.get(ex.namaKegiatan) || [];
        list.push({ student, ex });
        map.set(ex.namaKegiatan, list);
      }
    });
    return map;
  }, [safeExtracurriculars, studentMap]);

  // Handlers for Add/Edit
  const handleOpenAddModal = (targetStudentId?: string) => {
    const studentId = targetStudentId || safeStudents[0]?.id || '';
    const preset = PRESET_EXTRACURRICULARS[0];
    setEditingItem(null);
    setFormData({
      siswaId: studentId,
      namaKegiatan: preset.nama,
      predikat: 'Sangat Baik',
      keterangan: preset.deskripsiTemplate['Sangat Baik']
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: Extracurricular) => {
    setEditingItem(item);
    setFormData({
      siswaId: item.siswaId,
      namaKegiatan: item.namaKegiatan,
      predikat: item.predikat,
      keterangan: item.keterangan
    });
    setIsModalOpen(true);
  };

  const handleActivityNameChange = (name: string) => {
    const matchedPreset = PRESET_EXTRACURRICULARS.find(p => p.nama === name);
    setFormData(prev => ({
      ...prev,
      namaKegiatan: name,
      keterangan: matchedPreset
        ? matchedPreset.deskripsiTemplate[prev.predikat]
        : prev.keterangan || `Aktif dan berpartisipasi dengan ${prev.predikat.toLowerCase()} dalam kegiatan ${name}.`
    }));
  };

  const handlePredicateChange = (predikat: 'Sangat Baik' | 'Baik' | 'Cukup') => {
    const matchedPreset = PRESET_EXTRACURRICULARS.find(p => p.nama === formData.namaKegiatan);
    setFormData(prev => ({
      ...prev,
      predikat,
      keterangan: matchedPreset
        ? matchedPreset.deskripsiTemplate[predikat]
        : prev.keterangan
    }));
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.siswaId) {
      addToast('error', 'Validasi Gagal', 'Silakan pilih siswa.');
      return;
    }
    if (!formData.namaKegiatan.trim()) {
      addToast('error', 'Validasi Gagal', 'Nama kegiatan ekstrakurikuler wajib diisi.');
      return;
    }

    if (editingItem) {
      updateExtracurricular(editingItem.id, {
        siswaId: formData.siswaId,
        namaKegiatan: formData.namaKegiatan.trim(),
        predikat: formData.predikat,
        keterangan: formData.keterangan.trim()
      });
    } else {
      // Check if student already has this exact extracurricular
      const existing = safeExtracurriculars.find(
        e => e.siswaId === formData.siswaId && e.namaKegiatan.toLowerCase() === formData.namaKegiatan.trim().toLowerCase()
      );
      if (existing) {
        updateExtracurricular(existing.id, {
          predikat: formData.predikat,
          keterangan: formData.keterangan.trim()
        });
      } else {
        addExtracurricular({
          siswaId: formData.siswaId,
          namaKegiatan: formData.namaKegiatan.trim(),
          predikat: formData.predikat,
          keterangan: formData.keterangan.trim()
        });
      }
    }

    setIsModalOpen(false);
  };

  // Batch Pramuka Quick Assign
  const handleQuickAssignPramuka = () => {
    let addedCount = 0;
    const preset = PRESET_EXTRACURRICULARS[0];

    safeStudents.forEach(student => {
      const studentExcurs = studentActivitiesMap.get(student.id) || [];
      const hasPramuka = studentExcurs.some(e => e.namaKegiatan.toLowerCase().includes('pramuka'));
      if (!hasPramuka) {
        addExtracurricular({
          siswaId: student.id,
          namaKegiatan: preset.nama,
          predikat: 'Sangat Baik',
          keterangan: preset.deskripsiTemplate['Sangat Baik']
        });
        addedCount++;
      }
    });

    if (addedCount > 0) {
      addToast(
        'success',
        'Pramuka Wajib Ditetapkan',
        `Berhasil menambahkan kegiatan Pramuka untuk ${addedCount} siswa yang belum terdaftar.`
      );
    } else {
      addToast('info', 'Semua Siswa Terdaftar', 'Seluruh siswa kelas sudah memiliki catatan kegiatan Pramuka.');
    }
  };

  // Batch Modal Handlers
  const handleOpenBatchModal = () => {
    setBatchSelectedStudentIds(safeStudents.map(s => s.id));
    const preset = PRESET_EXTRACURRICULARS[0];
    setBatchActivityName(preset.nama);
    setBatchPredicate('Sangat Baik');
    setBatchDescription(preset.deskripsiTemplate['Sangat Baik']);
    setIsBatchModalOpen(true);
  };

  const handleSaveBatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (batchSelectedStudentIds.length === 0) {
      addToast('error', 'Validasi Gagal', 'Pilih minimal 1 siswa untuk input massal.');
      return;
    }

    batchSelectedStudentIds.forEach(sId => {
      const existing = safeExtracurriculars.find(
        e => e.siswaId === sId && e.namaKegiatan.toLowerCase() === batchActivityName.trim().toLowerCase()
      );
      if (existing) {
        updateExtracurricular(existing.id, {
          predikat: batchPredicate,
          keterangan: batchDescription.trim()
        });
      } else {
        addExtracurricular({
          siswaId: sId,
          namaKegiatan: batchActivityName.trim(),
          predikat: batchPredicate,
          keterangan: batchDescription.trim()
        });
      }
    });

    addToast(
      'success',
      'Input Massal Berhasil',
      `Kegiatan ${batchActivityName} berhasil disimpan untuk ${batchSelectedStudentIds.length} siswa.`
    );
    setIsBatchModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Metric Summary */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300">
                <Trophy className="h-4 w-4" />
              </span>
              <h2 className="text-base font-black text-slate-900 dark:text-white">
                Pengelolaan & Isian Kegiatan Ekstrakurikuler
              </h2>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Mencatat partisipasi, nilai predikat, dan narasi deskripsi capaian kegiatan ekstrakurikuler peserta didik. Data otomatis tampil pada <strong className="text-blue-600 dark:text-blue-400">Tabel B Lembar Rapor Siswa</strong>.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {isTeacherOrAdmin && (
              <>
                <button
                  type="button"
                  onClick={handleQuickAssignPramuka}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-amber-200 bg-amber-50 text-amber-800 hover:bg-amber-100 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-300 text-xs font-bold transition-colors shadow-sm"
                  title="Otomatis mendaftarkan Pramuka Siaga/Penggalang untuk semua siswa yang belum terdata"
                >
                  <Compass className="h-3.5 w-3.5 text-amber-600" />
                  <span>+ Pramuka Wajib Se-Kelas</span>
                </button>

                <button
                  type="button"
                  onClick={handleOpenBatchModal}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 text-xs font-bold transition-colors shadow-sm"
                >
                  <Zap className="h-3.5 w-3.5 text-blue-600" />
                  <span>Input Massal (Batch)</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleOpenAddModal()}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 text-xs font-bold shadow-md shadow-blue-600/30 transition-colors"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>+ Catat Ekstrakurikuler</span>
                </button>
              </>
            )}

            <button
              type="button"
              onClick={() => setIsPrintModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 text-xs font-bold transition-colors shadow-sm"
            >
              <Printer className="h-3.5 w-3.5 text-slate-500" />
              <span>Cetak Rekap Ekskul</span>
            </button>
          </div>
        </div>

        {/* Mini Stats Bar */}
        <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3 border-t border-slate-100 pt-4 dark:border-slate-800/80">
          <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/50">
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Total Siswa Kelas</span>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-lg font-black text-slate-900 dark:text-white">{safeStudents.length}</span>
              <span className="text-[10px] text-slate-500">anak</span>
            </div>
          </div>

          <div className="rounded-xl bg-blue-50/60 p-3 dark:bg-blue-950/30">
            <span className="text-[11px] font-medium text-blue-700 dark:text-blue-400">Siswa Ber-Ekskul</span>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-lg font-black text-blue-700 dark:text-blue-300">{studentsWithActivitiesCount}</span>
              <span className="text-[10px] text-blue-600/80 dark:text-blue-400">
                ({safeStudents.length > 0 ? Math.round((studentsWithActivitiesCount / safeStudents.length) * 100) : 0}%)
              </span>
            </div>
          </div>

          <div className="rounded-xl bg-emerald-50/60 p-3 dark:bg-emerald-950/30">
            <span className="text-[11px] font-medium text-emerald-700 dark:text-emerald-400">Total Isian Ekskul</span>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-lg font-black text-emerald-700 dark:text-emerald-300">{totalRegisteredActivities}</span>
              <span className="text-[10px] text-emerald-600/80">entri terdata</span>
            </div>
          </div>

          <div className="rounded-xl bg-amber-50/60 p-3 dark:bg-amber-950/30">
            <span className="text-[11px] font-medium text-amber-700 dark:text-amber-400">Variasi Kegiatan</span>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-lg font-black text-amber-700 dark:text-amber-300">{uniqueActivitiesList.length}</span>
              <span className="text-[10px] text-amber-600/80">cabang aktif</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter & View Switcher Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-3.5 dark:border-slate-800 dark:bg-slate-900 shadow-sm">
        <div className="flex flex-wrap items-center gap-2.5 flex-1">
          {/* Search Box */}
          <div className="relative min-w-[220px] flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Cari siswa atau NISN..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:focus:bg-slate-900"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>

          {/* Filter Predikat */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold text-slate-500">Predikat:</span>
            <select
              value={filterPredicate}
              onChange={e => setFilterPredicate(e.target.value as any)}
              className="rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-semibold text-slate-700 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              <option value="Semua">Semua Predikat</option>
              <option value="Sangat Baik">Sangat Baik</option>
              <option value="Baik">Baik</option>
              <option value="Cukup">Cukup</option>
            </select>
          </div>

          {/* Filter Cabang Kegiatan */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold text-slate-500">Cabang:</span>
            <select
              value={filterCategory}
              onChange={e => setFilterCategory(e.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-semibold text-slate-700 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 max-w-[180px]"
            >
              <option value="Semua">Semua Ekskul ({uniqueActivitiesList.length})</option>
              {uniqueActivitiesList.map(act => (
                <option key={act} value={act}>
                  {act}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl self-start md:self-auto">
          <button
            type="button"
            onClick={() => setViewMode('per_siswa')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'per_siswa'
                ? 'bg-white text-blue-600 shadow-sm dark:bg-slate-900 dark:text-blue-400'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            <Users className="h-3.5 w-3.5" />
            <span>Matriks Per Siswa</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('per_kegiatan')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'per_kegiatan'
                ? 'bg-white text-blue-600 shadow-sm dark:bg-slate-900 dark:text-blue-400'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            <Trophy className="h-3.5 w-3.5" />
            <span>Per Cabang Ekskul</span>
          </button>
        </div>
      </div>

      {/* MAIN VIEW CONTENT */}
      {viewMode === 'per_siswa' ? (
        /* MODE 1: MATRIKS PER SISWA */
        <div className="space-y-4">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/80 dark:border-slate-800 dark:bg-slate-800/40 text-[11px] font-extrabold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                    <th className="px-4 py-3.5 text-center w-12">No</th>
                    <th className="px-4 py-3.5 w-64">Nama Peserta Didik</th>
                    <th className="px-4 py-3.5">Kegiatan Ekstrakurikuler & Deskripsi Capaian</th>
                    <th className="px-4 py-3.5 text-center w-28">Status Ekskul</th>
                    {isTeacherOrAdmin && <th className="px-4 py-3.5 text-right w-36">Aksi</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan={isTeacherOrAdmin ? 5 : 4} className="py-12 text-center text-slate-500">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <AlertCircle className="h-6 w-6 text-slate-400" />
                          <p className="text-xs font-semibold">Tidak ditemukan siswa dengan kriteria filter tersebut.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredStudents.map((student, idx) => {
                      const studentExcurs = studentActivitiesMap.get(student.id) || [];
                      const hasActivities = studentExcurs.length > 0;

                      return (
                        <tr
                          key={student.id}
                          className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                        >
                          <td className="px-4 py-3.5 text-center font-bold text-slate-400">{idx + 1}</td>
                          <td className="px-4 py-3.5">
                            <div className="flex items-center gap-2.5">
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-700 font-bold text-xs dark:bg-blue-950 dark:text-blue-300">
                                {student.nama.charAt(0)}
                              </div>
                              <div>
                                <div className="font-bold text-slate-900 dark:text-white leading-tight">
                                  {student.nama}
                                </div>
                                <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                                  NISN: {student.nisn} • {student.jenisKelamin === 'L' ? 'Laki-laki' : 'Perempuan'}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3.5">
                            {hasActivities ? (
                              <div className="space-y-2.5">
                                {studentExcurs.map(ex => (
                                  <div
                                    key={ex.id}
                                    className="group relative rounded-xl border border-slate-200/80 bg-slate-50/50 p-2.5 dark:border-slate-800 dark:bg-slate-800/40 flex flex-col sm:flex-row sm:items-start justify-between gap-2"
                                  >
                                    <div className="space-y-1 flex-1 pr-2">
                                      <div className="flex items-center gap-2 flex-wrap">
                                        <span className="font-bold text-slate-900 dark:text-white text-xs">
                                          {ex.namaKegiatan}
                                        </span>
                                        <span
                                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-extrabold ${
                                            ex.predikat === 'Sangat Baik'
                                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                              : ex.predikat === 'Baik'
                                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                                              : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                                          }`}
                                        >
                                          <Star className="h-2.5 w-2.5 fill-current" />
                                          <span>{ex.predikat}</span>
                                        </span>
                                      </div>
                                      <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed italic">
                                        "{ex.keterangan || 'Tidak ada catatan deskripsi tambahan.'}"
                                      </p>
                                    </div>

                                    {isTeacherOrAdmin && (
                                      <div className="flex items-center gap-1 self-end sm:self-start opacity-80 group-hover:opacity-100 transition-opacity">
                                        <button
                                          type="button"
                                          onClick={() => handleOpenEditModal(ex)}
                                          className="p-1 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-slate-800 transition-colors"
                                          title="Edit Catatan Ekskul"
                                        >
                                          <Edit2 className="h-3.5 w-3.5" />
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => setItemToDelete(ex)}
                                          className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-800 transition-colors"
                                          title="Hapus Dari Ekskul"
                                        >
                                          <Trash2 className="h-3.5 w-3.5" />
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="flex items-center gap-2 py-1 text-slate-400 italic text-[11px]">
                                <AlertCircle className="h-3.5 w-3.5 text-amber-500" />
                                <span>Belum ada kegiatan ekstrakurikuler yang dicatat untuk siswa ini.</span>
                              </div>
                            )}
                          </td>
                          <td className="px-4 py-3.5 text-center">
                            {hasActivities ? (
                              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-extrabold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                                <Check className="h-3 w-3" />
                                <span>{studentExcurs.length} Kegiatan</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-extrabold text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                                <span>Belum Ada</span>
                              </span>
                            )}
                          </td>
                          {isTeacherOrAdmin && (
                            <td className="px-4 py-3.5 text-right">
                              <button
                                type="button"
                                onClick={() => handleOpenAddModal(student.id)}
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 dark:border-blue-900/50 dark:bg-blue-950/40 dark:text-blue-300 text-[11px] font-bold transition-colors shadow-sm"
                              >
                                <Plus className="h-3 w-3" />
                                <span>Tambah Ekskul</span>
                              </button>
                            </td>
                          )}
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* MODE 2: PER CABANG EKSTRAKURIKULER */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from(activityGroupMap.entries()).length === 0 ? (
            <div className="col-span-full rounded-2xl border border-slate-200 bg-white p-12 text-center text-slate-500 dark:border-slate-800 dark:bg-slate-900">
              <Trophy className="mx-auto h-8 w-8 text-slate-400 mb-2" />
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Belum ada data ekstrakurikuler yang tersimpan.</p>
              <p className="text-[11px] text-slate-500 mt-1">Klik tombol "+ Catat Ekstrakurikuler" atau "+ Pramuka Wajib Se-Kelas" untuk memulai.</p>
            </div>
          ) : (
            Array.from(activityGroupMap.entries()).map(([activityName, members]) => {
              const matchedPreset = PRESET_EXTRACURRICULARS.find(p => p.nama === activityName);

              return (
                <div
                  key={activityName}
                  className="rounded-2xl border border-slate-200 bg-white p-4.5 dark:border-slate-800 dark:bg-slate-900 shadow-sm flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3 dark:border-slate-800">
                      <div className="flex items-center gap-2.5">
                        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                          {matchedPreset?.icon || <Trophy className="h-4 w-4" />}
                        </span>
                        <div>
                          <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                            {activityName}
                          </h3>
                          <span className="text-[10px] font-semibold text-slate-500">
                            {matchedPreset?.kategori || 'Ekstrakurikuler Pilihan'}
                          </span>
                        </div>
                      </div>
                      <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-black text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                        {members.length} Siswa
                      </span>
                    </div>

                    <div className="mt-3 space-y-2 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
                      {members.map(({ student, ex }) => (
                        <div
                          key={ex.id}
                          className="flex items-center justify-between gap-2 rounded-xl bg-slate-50/80 p-2 text-xs dark:bg-slate-800/40"
                        >
                          <div className="space-y-0.5">
                            <span className="font-bold text-slate-900 dark:text-white">
                              {student.nama}
                            </span>
                            <div className="flex items-center gap-1.5">
                              <span
                                className={`inline-block px-1.5 py-0.2 rounded text-[9px] font-extrabold ${
                                  ex.predikat === 'Sangat Baik'
                                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                    : ex.predikat === 'Baik'
                                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                                    : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                                }`}
                              >
                                {ex.predikat}
                              </span>
                              <span className="text-[10px] text-slate-500 truncate max-w-[200px]">
                                {ex.keterangan}
                              </span>
                            </div>
                          </div>

                          {isTeacherOrAdmin && (
                            <div className="flex items-center gap-0.5">
                              <button
                                type="button"
                                onClick={() => handleOpenEditModal(ex)}
                                className="p-1 text-slate-400 hover:text-amber-600"
                                title="Edit"
                              >
                                <Edit2 className="h-3 w-3" />
                              </button>
                              <button
                                type="button"
                                onClick={() => setItemToDelete(ex)}
                                className="p-1 text-slate-400 hover:text-rose-600"
                                title="Hapus"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {isTeacherOrAdmin && (
                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                      <button
                        type="button"
                        onClick={() => {
                          setFormData({
                            siswaId: safeStudents[0]?.id || '',
                            namaKegiatan: activityName,
                            predikat: 'Sangat Baik',
                            keterangan: matchedPreset
                              ? matchedPreset.deskripsiTemplate['Sangat Baik']
                              : `Aktif dan terampil dalam kegiatan ${activityName}.`
                          });
                          setEditingItem(null);
                          setIsModalOpen(true);
                        }}
                        className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400"
                      >
                        <Plus className="h-3 w-3" />
                        <span>Tambah Anggota Siswa</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* MODAL 1: ADD / EDIT SINGLE EXTRACURRICULAR */}
      {isModalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setIsModalOpen(false)}
          title={editingItem ? 'Edit Isian Kegiatan Ekstrakurikuler' : 'Catat Kegiatan Ekstrakurikuler Siswa'}
          subtitle="Isikan nama kegiatan, nilai predikat, dan catatan deskripsi capaian untuk lembar rapor"
          maxWidth="lg"
          icon={<Trophy className="h-5 w-5 text-amber-600" />}
        >
          <form onSubmit={handleSaveForm} className="space-y-4">
            {/* Siswa Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Pilih Peserta Didik <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.siswaId}
                onChange={e => setFormData({ ...formData, siswaId: e.target.value })}
                disabled={!!editingItem}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-800 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white disabled:bg-slate-100 dark:disabled:bg-slate-900"
              >
                {safeStudents.map(student => (
                  <option key={student.id} value={student.id}>
                    {student.nama} (NISN: {student.nisn})
                  </option>
                ))}
              </select>
            </div>

            {/* Nama Kegiatan */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Nama Kegiatan Ekstrakurikuler <span className="text-rose-500">*</span>
                </label>
                <span className="text-[10px] text-slate-400">Pilih rekomendasi atau ketik nama kegiatan</span>
              </div>

              {/* Quick Preset Buttons */}
              <div className="mb-2 flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-1 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/60 dark:border-slate-700">
                {PRESET_EXTRACURRICULARS.map(preset => (
                  <button
                    key={preset.nama}
                    type="button"
                    onClick={() => handleActivityNameChange(preset.nama)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors ${
                      formData.namaKegiatan === preset.nama
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
                    }`}
                  >
                    {preset.nama}
                  </button>
                ))}
              </div>

              <input
                type="text"
                value={formData.namaKegiatan}
                onChange={e => handleActivityNameChange(e.target.value)}
                placeholder="Contoh: Pramuka Siaga, Dokter Kecil, Karate..."
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                required
              />
            </div>

            {/* Predikat */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Predikat Capaian <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['Sangat Baik', 'Baik', 'Cukup'] as const).map(pred => (
                  <button
                    key={pred}
                    type="button"
                    onClick={() => handlePredicateChange(pred)}
                    className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                      formData.predikat === pred
                        ? pred === 'Sangat Baik'
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                          : pred === 'Baik'
                          ? 'border-blue-500 bg-blue-50 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300'
                          : 'border-amber-500 bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
                    }`}
                  >
                    <Star className="h-3.5 w-3.5 fill-current" />
                    <span>{pred}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Keterangan / Deskripsi Capaian */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Keterangan / Deskripsi Capaian Rapor
                </label>
                <button
                  type="button"
                  onClick={() => {
                    const matchedPreset = PRESET_EXTRACURRICULARS.find(p => p.nama === formData.namaKegiatan);
                    if (matchedPreset) {
                      setFormData(prev => ({
                        ...prev,
                        keterangan: matchedPreset.deskripsiTemplate[prev.predikat]
                      }));
                    }
                  }}
                  className="text-[10px] font-bold text-blue-600 hover:underline flex items-center gap-1"
                >
                  <Sparkles className="h-3 w-3" />
                  <span>Gunakan Template Capaian</span>
                </button>
              </div>

              <textarea
                rows={3}
                value={formData.keterangan}
                onChange={e => setFormData({ ...formData, keterangan: e.target.value })}
                placeholder="Deskripsikan keaktifan, keterampilan, dan sikap siswa dalam kegiatan ini..."
                className="w-full rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-800 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-4 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
              >
                Batal
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-blue-600 text-xs font-bold text-white shadow-md shadow-blue-600/30 hover:bg-blue-700 transition-colors"
              >
                <Check className="h-4 w-4" />
                <span>{editingItem ? 'Simpan Perubahan' : 'Simpan Isian Ekskul'}</span>
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* MODAL 2: BATCH ASSIGN MODAL */}
      {isBatchModalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setIsBatchModalOpen(false)}
          title="Input Massal Kegiatan Ekstrakurikuler"
          subtitle="Terapkan satu kegiatan ekskul sekaligus untuk beberapa siswa yang dipilih"
          maxWidth="lg"
          icon={<Zap className="h-5 w-5 text-blue-600" />}
        >
          <form onSubmit={handleSaveBatch} className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Pilih Siswa ({batchSelectedStudentIds.length} dari {safeStudents.length} dipilih)
                </label>
                <div className="flex items-center gap-2 text-[10px] font-bold">
                  <button
                    type="button"
                    onClick={() => setBatchSelectedStudentIds(safeStudents.map(s => s.id))}
                    className="text-blue-600 hover:underline"
                  >
                    Pilih Semua
                  </button>
                  <span>•</span>
                  <button
                    type="button"
                    onClick={() => setBatchSelectedStudentIds([])}
                    className="text-slate-500 hover:underline"
                  >
                    Kosongkan
                  </button>
                </div>
              </div>

              <div className="max-h-40 overflow-y-auto rounded-xl border border-slate-200 bg-slate-50 p-2 dark:border-slate-700 dark:bg-slate-800/60 grid grid-cols-1 sm:grid-cols-2 gap-1.5 custom-scrollbar">
                {safeStudents.map(s => {
                  const isChecked = batchSelectedStudentIds.includes(s.id);
                  return (
                    <label
                      key={s.id}
                      className={`flex items-center gap-2 p-1.5 rounded-lg text-xs cursor-pointer select-none transition-colors ${
                        isChecked
                          ? 'bg-blue-50 text-blue-900 dark:bg-blue-950/60 dark:text-blue-200 font-bold'
                          : 'hover:bg-slate-200/50 dark:hover:bg-slate-700/50 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={e => {
                          if (e.target.checked) {
                            setBatchSelectedStudentIds(prev => [...prev, s.id]);
                          } else {
                            setBatchSelectedStudentIds(prev => prev.filter(id => id !== s.id));
                          }
                        }}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="truncate">{s.nama}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Nama Kegiatan */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Nama Kegiatan
              </label>
              <select
                value={batchActivityName}
                onChange={e => {
                  const name = e.target.value;
                  const matched = PRESET_EXTRACURRICULARS.find(p => p.nama === name);
                  setBatchActivityName(name);
                  if (matched) {
                    setBatchDescription(matched.deskripsiTemplate[batchPredicate]);
                  }
                }}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-800 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                {PRESET_EXTRACURRICULARS.map(p => (
                  <option key={p.nama} value={p.nama}>
                    {p.nama} ({p.kategori})
                  </option>
                ))}
              </select>
            </div>

            {/* Predikat */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Predikat Capaian
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['Sangat Baik', 'Baik', 'Cukup'] as const).map(pred => (
                  <button
                    key={pred}
                    type="button"
                    onClick={() => {
                      setBatchPredicate(pred);
                      const matched = PRESET_EXTRACURRICULARS.find(p => p.nama === batchActivityName);
                      if (matched) {
                        setBatchDescription(matched.deskripsiTemplate[pred]);
                      }
                    }}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                      batchPredicate === pred
                        ? 'border-blue-500 bg-blue-50 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
                    }`}
                  >
                    {pred}
                  </button>
                ))}
              </div>
            </div>

            {/* Deskripsi */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Deskripsi Capaian Rapor
              </label>
              <textarea
                rows={2}
                value={batchDescription}
                onChange={e => setBatchDescription(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-800 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-4 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setIsBatchModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={batchSelectedStudentIds.length === 0}
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-blue-600 text-xs font-bold text-white shadow-md shadow-blue-600/30 hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                <Check className="h-4 w-4" />
                <span>Simpan Massal ({batchSelectedStudentIds.length} Siswa)</span>
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* MODAL 3: DELETE CONFIRMATION */}
      {itemToDelete && (
        <Modal
          isOpen={true}
          onClose={() => setItemToDelete(null)}
          title="Konfirmasi Hapus Isian Ekstrakurikuler"
          maxWidth="sm"
          icon={<Trash2 className="h-5 w-5 text-rose-600" />}
        >
          <div className="space-y-3">
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Apakah Anda yakin ingin menghapus kegiatan <strong>"{itemToDelete.namaKegiatan}"</strong> untuk siswa <strong>{studentMap.get(itemToDelete.siswaId)?.nama}</strong>?
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setItemToDelete(null)}
                className="px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteExtracurricular(itemToDelete.id);
                  setItemToDelete(null);
                }}
                className="px-4 py-1.5 rounded-xl bg-rose-600 text-xs font-bold text-white hover:bg-rose-700 shadow-sm"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* MODAL 4: PRINT REKAPITULASI EKSTRAKURIKULER KELAS */}
      {isPrintModalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setIsPrintModalOpen(false)}
          title="Pratinjau Rekapitulasi Kegiatan Ekstrakurikuler"
          subtitle="Format cetak resmi rekapitulasi penilaian ekstrakurikuler peserta didik"
          maxWidth="2xl"
          icon={<Printer className="h-5 w-5 text-blue-600" />}
        >
          <div className="space-y-4">
            <div className="max-h-[68vh] overflow-y-auto p-4 border border-slate-200 rounded-xl bg-white text-black print:p-0 print:border-0 print:m-0">
              <HeaderKopSekolah
                documentTitle="REKAPITULASI NILAI & KEGIATAN EKSTRAKURIKULER"
                subTitle={`TAHUN PELAJARAN ${schoolInfo.academicYear} • SEMESTER ${schoolInfo.semester.toUpperCase()}`}
              />

              <div className="my-4 grid grid-cols-2 text-[11px]">
                <div>
                  <p><strong>Satuan Pendidikan:</strong> {schoolInfo.name}</p>
                  <p><strong>Kelas / Fase:</strong> {schoolInfo.className} (Fase B/C)</p>
                </div>
                <div className="text-right">
                  <p><strong>Wali Kelas:</strong> {schoolInfo.teacherName}</p>
                  <p><strong>NIP:</strong> {schoolInfo.teacherNip || '-'}</p>
                </div>
              </div>

              <table className="w-full text-[10.5px] border-collapse border border-slate-900 mt-2">
                <thead>
                  <tr className="bg-slate-100 font-bold text-center">
                    <th className="border border-slate-900 p-1.5 w-8">No</th>
                    <th className="border border-slate-900 p-1.5 w-24">NISN</th>
                    <th className="border border-slate-900 p-1.5 text-left w-48">Nama Peserta Didik</th>
                    <th className="border border-slate-900 p-1.5 text-left">Nama Ekstrakurikuler</th>
                    <th className="border border-slate-900 p-1.5 w-24">Predikat</th>
                    <th className="border border-slate-900 p-1.5 text-left">Catatan Capaian</th>
                  </tr>
                </thead>
                <tbody>
                  {safeStudents.map((student, sIdx) => {
                    const studentExcurs = studentActivitiesMap.get(student.id) || [];
                    if (studentExcurs.length === 0) {
                      return (
                        <tr key={student.id}>
                          <td className="border border-slate-900 p-1 text-center font-bold">{sIdx + 1}</td>
                          <td className="border border-slate-900 p-1 text-center font-mono">{student.nisn}</td>
                          <td className="border border-slate-900 p-1 font-semibold">{student.nama}</td>
                          <td colSpan={3} className="border border-slate-900 p-1 text-center italic text-slate-500">
                            - Belum ada kegiatan ekstrakurikuler -
                          </td>
                        </tr>
                      );
                    }

                    return studentExcurs.map((ex, exIdx) => (
                      <tr key={ex.id}>
                        {exIdx === 0 && (
                          <>
                            <td
                              rowSpan={studentExcurs.length}
                              className="border border-slate-900 p-1 text-center font-bold"
                            >
                              {sIdx + 1}
                            </td>
                            <td
                              rowSpan={studentExcurs.length}
                              className="border border-slate-900 p-1 text-center font-mono"
                            >
                              {student.nisn}
                            </td>
                            <td
                              rowSpan={studentExcurs.length}
                              className="border border-slate-900 p-1 font-semibold"
                            >
                              {student.nama}
                            </td>
                          </>
                        )}
                        <td className="border border-slate-900 p-1 font-medium">{ex.namaKegiatan}</td>
                        <td className="border border-slate-900 p-1 text-center font-bold">{ex.predikat}</td>
                        <td className="border border-slate-900 p-1 text-[9.5px] leading-tight">{ex.keterangan}</td>
                      </tr>
                    ));
                  })}
                </tbody>
              </table>

              {/* Tanda Tangan */}
              <div className="mt-8 grid grid-cols-2 text-[11px] text-center">
                <div>
                  <p>Mengetahui,</p>
                  <p className="font-bold">Kepala Sekolah</p>
                  <div className="h-16" />
                  <p className="font-bold underline">{schoolInfo.headmasterName || 'NAMA KEPALA SEKOLAH'}</p>
                  <p>NIP. {schoolInfo.headmasterNip || '----------------------'}</p>
                </div>
                <div>
                  <p>{schoolInfo.city}, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  <p className="font-bold">Guru Kelas / Wali Kelas</p>
                  <div className="h-16" />
                  <p className="font-bold underline">{schoolInfo.teacherName}</p>
                  <p>NIP. {schoolInfo.teacherNip || '----------------------'}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-3 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setIsPrintModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
              >
                Tutup
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-blue-600 text-xs font-bold text-white shadow-md shadow-blue-600/30 hover:bg-blue-700 transition-colors"
              >
                <Printer className="h-4 w-4" />
                <span>Cetak Rekap (PDF / Print)</span>
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
