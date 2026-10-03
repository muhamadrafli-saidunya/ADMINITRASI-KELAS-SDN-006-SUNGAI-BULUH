import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ActiveTab } from '../../types';
import {
  BookOpenCheck,
  Users,
  CalendarCheck2,
  BookMarked,
  GraduationCap,
  FileSpreadsheet,
  CalendarDays,
  WalletCards,
  Boxes,
  Award,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Clock,
  Zap,
  School,
  X,
  FileText,
  Search,
  Target
} from 'lucide-react';

interface PintasanWaliKelasModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PintasanWaliKelasModal: React.FC<PintasanWaliKelasModalProps> = ({
  isOpen,
  onClose
}) => {
  const {
    setCurrentTab,
    schoolInfo,
    students,
    teachers,
    modulAjarList,
    projekKokurikulerList,
    journals,
    getCurrentCashBalance,
    events
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  if (!isOpen) return null;

  const handleNavigate = (tab: ActiveTab) => {
    setCurrentTab(tab);
    onClose();
  };

  const cashBalance = getCurrentCashBalance();

  // 15 Buku Administrasi Wali Kelas SD
  const administrasiItems = [
    {
      no: 1,
      title: 'Buku Induk & Biodata Siswa',
      category: 'Data Pokok Siswa',
      description: 'Kelola data 28 siswa, NISN, data orang tua/wali, mutasi, dan cetak lembar biodata.',
      tab: 'siswa' as ActiveTab,
      icon: <Users className="h-5 w-5 text-blue-500" />,
      badge: `${students.length} Siswa`,
      badgeColor: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
      actionLabel: 'Buka Buku Induk'
    },
    {
      no: 2,
      title: 'Buku Presensi / Absensi Harian',
      category: 'Pembelajaran & Kegiatan',
      description: 'Pencatatan kehadiran harian siswa, rekap persentase bulanan, surat izin sakit/alpa.',
      tab: 'presensi' as ActiveTab,
      icon: <CalendarCheck2 className="h-5 w-5 text-emerald-500" />,
      badge: 'Input Cepat Harian',
      badgeColor: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
      actionLabel: 'Isi Presensi'
    },
    {
      no: 3,
      title: 'Buku Perangkat Ajar & Modul Kurmer',
      category: 'Kurikulum Merdeka',
      description: 'Bank Modul Ajar Fase A/B/C, Capaian Pembelajaran (CP), TP, alur, dan LKPD siap cetak.',
      tab: 'perangkat_ajar' as ActiveTab,
      icon: <BookMarked className="h-5 w-5 text-indigo-500" />,
      badge: `${modulAjarList.length} Modul Ajar`,
      badgeColor: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300',
      actionLabel: 'Kelola Modul'
    },
    {
      no: 4,
      title: 'Kokurikuler & Dimensi Profil Lulusan (DPL)',
      category: 'Kurikulum Merdeka (KMPM)',
      description: 'Manajemen projek kokurikuler, pemetaan dimensi karakter DPL (Beriman, Mandiri, Gotong Royong, Bernalar Kritis, Kreatif), asesmen siswa, jurnal pelaksanaan, dan artefak karya.',
      tab: 'kokurikuler_dpl' as ActiveTab,
      icon: <Target className="h-5 w-5 text-pink-500" />,
      badge: `${projekKokurikulerList.length} Projek Aktif`,
      badgeColor: 'bg-pink-100 text-pink-700 dark:bg-pink-950 dark:text-pink-300',
      actionLabel: 'Kelola DPL'
    },
    {
      no: 5,
      title: 'Buku Daftar Nilai & Asesmen TP',
      category: 'Kurikulum Merdeka',
      description: 'Rekap penilaian formatif TP 1-4, sumatif STS/SAS, KKTP mata pelajaran, dan analisis ketercapaian.',
      tab: 'nilai' as ActiveTab,
      icon: <GraduationCap className="h-5 w-5 text-purple-500" />,
      badge: 'Formatif & Sumatif',
      badgeColor: 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300',
      actionLabel: 'Input Nilai'
    },
    {
      no: 6,
      title: 'Buku Rapor KMPM (Pembelajaran Mendalam)',
      category: 'Kurikulum Merdeka (KMPM)',
      description: 'Cetak lembar rapor siswa format resmi ber-kop sekolah, deskripsi capaian pembelajaran mendalam otomatis, dan rekap ranking.',
      tab: 'raport' as ActiveTab,
      icon: <FileSpreadsheet className="h-5 w-5 text-rose-500" />,
      badge: 'Siap Cetak PDF',
      badgeColor: 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300',
      actionLabel: 'Cetak Rapor'
    },
    {
      no: 7,
      title: 'Buku Jurnal Mengajar Harian Guru',
      category: 'Pembelajaran & Kegiatan',
      description: 'Agenda materi harian, pencapaian TP, diferensiasi kegiatan, dan evaluasi hasil belajar.',
      tab: 'jurnal' as ActiveTab,
      icon: <BookOpenCheck className="h-5 w-5 text-amber-500" />,
      badge: `${journals.length} Jurnal Tercatat`,
      badgeColor: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
      actionLabel: 'Tulis Jurnal'
    },
    {
      no: 7,
      title: 'Buku Jadwal Pelajaran Mingguan',
      category: 'Pembelajaran & Kegiatan',
      description: 'Struktur jam belajar Senin-Sabtu, alokasi jam tatap muka, dan jadwal guru pengampu.',
      tab: 'jadwal' as ActiveTab,
      icon: <CalendarDays className="h-5 w-5 text-sky-500" />,
      badge: 'Senin - Sabtu',
      badgeColor: 'bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300',
      actionLabel: 'Lihat Jadwal'
    },
    {
      no: 8,
      title: 'Buku Regu Piket Kebersihan Kelas',
      category: 'Ketertiban & Sarana',
      description: 'Daftar pembagian 6 regu piket harian siswa, ketua piket, dan cek kepatuhan kebersihan kelas.',
      tab: 'jadwal' as ActiveTab,
      icon: <CheckCircle2 className="h-5 w-5 text-teal-500" />,
      badge: '6 Regu Terbagi',
      badgeColor: 'bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-300',
      actionLabel: 'Atur Piket'
    },
    {
      no: 9,
      title: 'Buku Kas Kelas & Iuran Paguyuban',
      category: 'Keuangan & Sarana',
      description: 'Pencatatan arus kas masuk/keluar transparan, kwitansi, dan laporan pertanggungjawaban kas.',
      tab: 'kas' as ActiveTab,
      icon: <WalletCards className="h-5 w-5 text-emerald-600" />,
      badge: `Saldo Rp ${cashBalance.toLocaleString('id-ID')}`,
      badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200 font-bold',
      actionLabel: 'Kelola Kas'
    },
    {
      no: 10,
      title: 'Buku Inventaris Ruang Kelas (KIR)',
      category: 'Ketertiban & Sarana',
      description: 'Kartu Inventaris Ruangan: data aset meja, kursi, papan tulis, media belajar, kondisi baik/rusak.',
      tab: 'inventaris' as ActiveTab,
      icon: <Boxes className="h-5 w-5 text-indigo-600" />,
      badge: 'KIR Lengkap',
      badgeColor: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300',
      actionLabel: 'Cek Inventaris'
    },
    {
      no: 11,
      title: 'Buku Catatan Bimbingan & Konseling',
      category: 'Kesiswaan & Karakter',
      description: 'Catatan pembinaan sikap, penanganan perilaku, bimbingan belajar, dan tindak lanjut orang tua.',
      tab: 'konseling' as ActiveTab,
      icon: <Award className="h-5 w-5 text-orange-500" />,
      badge: 'Catatan Perilaku',
      badgeColor: 'bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300',
      actionLabel: 'Catat Konseling'
    },
    {
      no: 12,
      title: 'Buku Catatan Prestasi Siswa',
      category: 'Kesiswaan & Karakter',
      description: 'Rekap kejuaraan akademik, olahraga, seni, hafalan tahfidz, dan bakat istimewa siswa.',
      tab: 'konseling' as ActiveTab,
      icon: <Award className="h-5 w-5 text-yellow-500" />,
      badge: 'Prestasi & Bakat',
      badgeColor: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300',
      actionLabel: 'Lihat Prestasi'
    },
    {
      no: 13,
      title: 'Pusat Import & Template Excel',
      category: 'Alat & Layanan',
      description: 'Unduh format template resmi Excel .xlsx untuk data siswa, presensi, nilai, dan import otomatis.',
      tab: 'import_excel' as ActiveTab,
      icon: <FileText className="h-5 w-5 text-emerald-500" />,
      badge: 'XLSX Terintegrasi',
      badgeColor: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 font-bold',
      actionLabel: 'Import Data'
    },
    {
      no: 14,
      title: 'AI Asisten Wali Kelas (Gemini)',
      category: 'Alat & Layanan',
      description: 'Generate narasi rapor siswa otomatis, rekomendasi ide kegiatan P5, penyusun rubrik, dan modul.',
      tab: 'ai_assistant' as ActiveTab,
      icon: <Sparkles className="h-5 w-5 text-amber-500" />,
      badge: 'Gemini AI Pro',
      badgeColor: 'bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold',
      actionLabel: 'Buka Asisten AI'
    },
    {
      no: 15,
      title: 'Buku Induk Guru & DUK Pegawai',
      category: 'Data Pokok Guru',
      description: 'Daftar Urut Kepangkatan (DUK), biodata GTK, jabatan, dan riwayat penugasan sekolah.',
      tab: 'guru' as ActiveTab,
      icon: <Users className="h-5 w-5 text-purple-600" />,
      badge: `${teachers.length} Guru & Tendik`,
      badgeColor: 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300',
      actionLabel: 'Buka Data GTK'
    }
  ];

  const categories = [
    'all',
    'Data Pokok Siswa',
    'Kurikulum Merdeka',
    'Pembelajaran & Kegiatan',
    'Keuangan & Sarana',
    'Ketertiban & Sarana',
    'Kesiswaan & Karakter',
    'Alat & Layanan'
  ];

  const filteredItems = administrasiItems.filter(item => {
    if (selectedCategory !== 'all' && item.category !== selectedCategory) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative flex max-h-[90vh] w-full max-w-4xl flex-col rounded-2xl bg-white shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200/80 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 px-6 py-4 text-white">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-amber-300 shadow-md">
              <BookOpenCheck className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-200 bg-blue-800/60 px-2 py-0.5 rounded border border-blue-600/40">
                  Pintasan Lengkap
                </span>
                <span className="text-xs text-slate-300">
                  {schoolInfo.className} • {schoolInfo.schoolName}
                </span>
              </div>
              <h2 className="text-lg font-black text-white mt-0.5 flex items-center gap-2">
                15 Buku Administrasi Wali Kelas SD
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-2 text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Search & Filter bar */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 space-y-3">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Cari buku administrasi, fitur, atau keperluan wali kelas..."
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Category selection */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 custom-scrollbar text-xs">
              <select
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
                className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs text-slate-700 dark:text-slate-200 font-medium focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="all">Semua Kategori (15 Buku)</option>
                <option value="Data Pokok Siswa">Data Pokok Siswa</option>
                <option value="Kurikulum Merdeka">Kurikulum Merdeka</option>
                <option value="Pembelajaran & Kegiatan">Pembelajaran & Kegiatan</option>
                <option value="Keuangan & Sarana">Keuangan & Sarana</option>
                <option value="Ketertiban & Sarana">Ketertiban & Sarana</option>
                <option value="Kesiswaan & Karakter">Kesiswaan & Karakter</option>
                <option value="Alat & Layanan">Alat & Layanan</option>
              </select>
            </div>
          </div>
        </div>

        {/* List of 15 Books with Quick Jump */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3 custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {filteredItems.map(item => (
              <div
                key={item.no}
                onClick={() => handleNavigate(item.tab)}
                className="group relative flex items-start gap-3.5 p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 hover:border-blue-500 dark:hover:border-blue-500 shadow-xs hover:shadow-md transition-all cursor-pointer hover:-translate-y-0.5"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-700/60 group-hover:bg-blue-50 dark:group-hover:bg-blue-950 transition-colors">
                  {item.icon}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                      Buku No. {item.no}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mt-0.5 line-clamp-1">
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>

                  <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-700/50">
                    <span className="text-[10px] text-slate-400 font-medium">
                      Kategori: {item.category}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 group-hover:translate-x-0.5 transition-transform">
                      <span>{item.actionLabel}</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredItems.length === 0 && (
            <div className="py-12 text-center text-slate-500">
              <BookOpenCheck className="h-10 w-10 mx-auto text-slate-400 mb-2" />
              <p className="font-semibold text-sm">Tidak ada buku administrasi yang cocok</p>
              <p className="text-xs mt-1">Coba gunakan kata kunci pencarian yang lain.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200/80 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/90 px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <Zap className="h-4 w-4 text-amber-500" />
            <span>Format baku sesuai ketentuan <strong>Kemendikdasmen & Kurikulum Merdeka Pembelajaran Mendalam (KMPM)</strong></span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
