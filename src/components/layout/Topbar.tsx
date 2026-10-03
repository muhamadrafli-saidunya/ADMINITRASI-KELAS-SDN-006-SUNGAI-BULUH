import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Menu,
  Moon,
  Sun,
  ShieldCheck,
  LogOut,
  Sparkles,
  PanelLeftClose,
  PanelLeftOpen,
  Save,
  CheckCircle2
} from 'lucide-react';

interface TopbarProps {
  isSidebarOpen?: boolean;
  onToggleSidebar: () => void;
  onOpenRoleModal: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({
  isSidebarOpen = true,
  onToggleSidebar,
  onOpenRoleModal
}) => {
  const {
    currentTab,
    setCurrentTab,
    currentUser,
    isDarkMode,
    toggleDarkMode,
    schoolInfo,
    logout,
    saveAllData,
    lastSavedAt
  } = useApp();

  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleTopbarSave = () => {
    setIsSaving(true);
    setSavedSuccess(false);
    setTimeout(() => {
      saveAllData();
      setIsSaving(false);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    }, 200);
  };

  const tabTitles: Record<string, { title: string; subtitle: string }> = {
    dashboard: { title: 'Dashboard Utama', subtitle: 'Ringkasan aktivitas dan administrasi kelas terpadu' },
    siswa: { title: 'Buku Induk & Data Siswa', subtitle: 'Kelola data identitas dan biodata peserta didik' },
    guru: { title: 'Buku Guru & Tenaga Kependidikan', subtitle: 'Direktori pendidik, jabatan, dan riwayat tugas' },
    presensi: { title: 'Presensi & Kehadiran', subtitle: 'Pencatatan daftar hadir harian dan rekap bulanan' },
    perangkat_ajar: { title: 'Perangkat Ajar Kurikulum Merdeka', subtitle: 'Modul Ajar, CP, TP, dan LKPD tematik SD' },
    kokurikuler_dpl: { title: 'Dimensi Profil Lulusan (DPL) Kokurikuler', subtitle: 'Pengelolaan kegiatan kokurikuler, pemetaan karakter, dan asesmen capaian DPL' },
    nilai: { title: 'Daftar Nilai & Asesmen', subtitle: 'Penilaian formatif & sumatif Kurikulum Merdeka' },
    raport: { title: 'Cetak Rapor KMPM', subtitle: 'Laporan Hasil Belajar Kurikulum Merdeka Pembelajaran Mendalam' },
    jurnal: { title: 'Buku Jurnal Mengajar Guru', subtitle: 'Agenda harian pelaksanaan pembelajaran dan evaluasi' },
    jadwal: { title: 'Jadwal Pelajaran & Piket', subtitle: 'Matriks jam belajar mingguan dan regu piket kelas' },
    kas: { title: 'Kas Kelas & Iuran', subtitle: 'Pencatatan keuangan transparan dan kas paguyuban' },
    inventaris: { title: 'Inventaris Sarana Kelas', subtitle: 'Buku inventaris barang dan Kartu Inventaris Ruangan (KIR)' },
    konseling: { title: 'Bimbingan & Prestasi', subtitle: 'Catatan perkembangan perilaku dan prestasi siswa' },
    import_excel: { title: 'Pusat Import & Template Excel', subtitle: 'Unduh template resmi .xlsx dan import data instan' },
    ai_assistant: { title: 'AI Asisten Wali Kelas', subtitle: 'Generator modul ajar, soal HOTS, dan catatan rapor' },
    pengaturan: { title: 'Pengaturan & Backup Data', subtitle: 'Konfigurasi identitas sekolah dan manajemen database' }
  };

  const currentInfo = tabTitles[currentTab] || { title: 'Administrasi Kelas SD', subtitle: 'Sistem Terpadu' };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200/80 bg-white/95 px-4 sm:px-6 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95 no-print transition-colors">
      {/* Left section: Hamburger & Title */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={onToggleSidebar}
          className={`rounded-xl p-2 transition-all flex items-center gap-1.5 cursor-pointer ${
            !isSidebarOpen
              ? 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 dark:bg-blue-950/70 dark:text-blue-300 dark:border-blue-800/80 shadow-xs'
              : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
          }`}
          aria-label="Toggle Menu Samping"
          title={isSidebarOpen ? 'Sembunyikan menu samping (Perlebar ruang kerja)' : 'Tampilkan menu samping'}
        >
          {isSidebarOpen ? (
            <PanelLeftClose className="h-5 w-5" />
          ) : (
            <>
              <PanelLeftOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <span className="hidden sm:inline-block text-xs font-bold">Menu</span>
            </>
          )}
        </button>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="truncate text-base font-bold text-slate-900 dark:text-white">
              {currentInfo.title}
            </h2>
            <span className="hidden sm:inline-flex items-center rounded-md bg-blue-50 px-2 py-0.5 text-[11px] font-bold text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60">
              {schoolInfo.className}
            </span>
          </div>
          <p className="hidden md:block truncate text-xs text-slate-500 dark:text-slate-400">
            {currentInfo.subtitle}
          </p>
        </div>
      </div>

      {/* Right Action Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick Save All Data Action */}
        <button
          id="btn-topbar-save"
          onClick={handleTopbarSave}
          disabled={isSaving}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-bold transition-all shadow-xs cursor-pointer ${
            savedSuccess
              ? 'bg-emerald-600 border-emerald-500 text-white shadow-emerald-500/20'
              : 'bg-emerald-50 hover:bg-emerald-100 border-emerald-300 text-emerald-800 dark:bg-emerald-950/50 dark:border-emerald-800 dark:text-emerald-300'
          }`}
          title={lastSavedAt ? `Terakhir disimpan: ${lastSavedAt}` : 'Simpan seluruh data ke penyimpanan lokal'}
          aria-label="Simpan seluruh data kelas"
        >
          {savedSuccess ? (
            <>
              <CheckCircle2 className="h-3.5 w-3.5 text-white animate-bounce" />
              <span className="hidden sm:inline">Tersimpan</span>
            </>
          ) : isSaving ? (
            <>
              <span className="h-3.5 w-3.5 rounded-full border-2 border-emerald-600 dark:border-emerald-400 border-t-transparent animate-spin" />
              <span className="hidden sm:inline">Menyimpan...</span>
            </>
          ) : (
            <>
              <Save className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              <span className="hidden sm:inline">Simpan</span>
            </>
          )}
        </button>

        {/* Quick AI Assistant Shortcut Pill */}
        {currentTab !== 'ai_assistant' && (
          <button
            onClick={() => setCurrentTab('ai_assistant')}
            className="flex items-center gap-1.5 rounded-xl border border-amber-300/80 bg-amber-50/80 px-2.5 py-1.5 text-xs font-bold text-amber-800 hover:bg-amber-100 dark:border-amber-700/50 dark:bg-amber-950/40 dark:text-amber-300 transition-colors shadow-xs"
            title="Buka AI Asisten Gemini"
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-500 fill-amber-400" />
            <span className="hidden sm:inline">AI Guru</span>
          </button>
        )}

        {/* Dark/Light Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-bold transition-all shadow-xs cursor-pointer ${
            isDarkMode
              ? 'bg-slate-800 border-amber-500/40 text-amber-300 hover:bg-slate-700/80'
              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300'
          }`}
          title={isDarkMode ? 'Klik untuk beralih ke Mode Terang' : 'Klik untuk beralih ke Mode Malam'}
          aria-label={isDarkMode ? 'Beralih ke Mode Terang' : 'Beralih ke Mode Malam'}
        >
          {isDarkMode ? (
            <>
              <Moon className="h-4 w-4 text-amber-400 fill-amber-400/20" />
              <span className="hidden sm:inline text-[11px] font-semibold">Mode Malam</span>
            </>
          ) : (
            <>
              <Sun className="h-4 w-4 text-amber-500 fill-amber-500/20" />
              <span className="hidden sm:inline text-[11px] font-semibold">Mode Terang</span>
            </>
          )}
        </button>

        {/* User Role Card & Switcher Trigger */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
          <button
            onClick={onOpenRoleModal}
            className="flex items-center gap-2 rounded-xl p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left"
            title="Klik untuk beralih akun / role"
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="h-8 w-8 rounded-full object-cover ring-2 ring-blue-500/40 shrink-0"
            />
            <div className="hidden sm:block min-w-0">
              <p className="truncate text-xs font-bold text-slate-900 dark:text-white leading-tight">
                {currentUser.name}
              </p>
              <div className="flex items-center gap-1">
                <ShieldCheck className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                  {currentUser.role === 'wali_kelas'
                    ? 'Wali Kelas'
                    : currentUser.role === 'admin'
                    ? 'Kepala Sekolah'
                    : currentUser.role === 'guru_mapel'
                    ? 'Guru Mapel'
                    : 'Siswa'}
                </span>
              </div>
            </div>
          </button>

          {/* Logout Button */}
          <button
            onClick={logout}
            className="rounded-xl p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 dark:hover:text-rose-400 transition-colors"
            title="Keluar dari sesi"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
