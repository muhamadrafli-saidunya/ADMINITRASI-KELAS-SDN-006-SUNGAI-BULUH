import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sun,
  Moon,
  Monitor,
  CheckCircle2,
  Sparkles,
  Eye,
  Printer,
  Palette,
  ShieldCheck,
  Check
} from 'lucide-react';

export const TemaDanTampilanSection: React.FC = () => {
  const { isDarkMode, setDarkMode, schoolInfo } = useApp();

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400">
              <Palette className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Pengaturan Tema & Tampilan Layar
                </h3>
                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                  isDarkMode
                    ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300'
                    : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                }`}>
                  {isDarkMode ? 'Mode Malam Aktif' : 'Mode Terang Aktif'}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Pilih kenyamanan visual aplikasi administrasi kelas sesuai pencahayaan ruangan dan preferensi kerja Anda.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setDarkMode(!isDarkMode)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all cursor-pointer active:scale-95"
            >
              {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              <span>{isDarkMode ? 'Ganti ke Mode Terang' : 'Ganti ke Mode Malam'}</span>
            </button>
          </div>
        </div>

        {/* Theme Cards Grid */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card 1: Mode Terang */}
          <div
            onClick={() => setDarkMode(false)}
            className={`group relative rounded-2xl border p-5 cursor-pointer transition-all ${
              !isDarkMode
                ? 'border-amber-500 bg-amber-50/20 ring-2 ring-amber-500/20 shadow-md dark:border-amber-500'
                : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-800/40 dark:hover:border-slate-700'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl ${!isDarkMode ? 'bg-amber-500 text-white shadow-sm' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'}`}>
                  <Sun className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    Mode Terang (Light Mode)
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Latar putih bersih dengan kontras tajam
                  </p>
                </div>
              </div>

              {!isDarkMode ? (
                <span className="flex items-center gap-1 text-[11px] font-bold text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/60 px-2 py-0.5 rounded-full">
                  <Check className="h-3 w-3" />
                  <span>Aktif</span>
                </span>
              ) : (
                <span className="text-[11px] font-medium text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  Pilih
                </span>
              )}
            </div>

            <p className="mt-3 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Sangat dianjurkan untuk penggunaan pada siang hari, ruang kelas dengan pencahayaan terang, presentasi menggunakan proyektor, serta penyesuaian dokumen fisik.
            </p>

            {/* Visual Mini Preview Light */}
            <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3 text-[10px] space-y-2 select-none pointer-events-none">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="font-bold text-slate-800">Contoh Tampilan Terang</span>
                <span className="bg-blue-600 text-white px-1.5 py-0.2 rounded font-semibold text-[9px]">Kelas 4</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-white p-2 rounded-lg border border-slate-200 text-slate-700">
                  <span className="font-semibold block">Presensi Siswa</span>
                  <span className="text-emerald-600 font-bold">100% Hadir</span>
                </div>
                <div className="bg-white p-2 rounded-lg border border-slate-200 text-slate-700">
                  <span className="font-semibold block">Rata-rata Kelas</span>
                  <span className="text-blue-600 font-bold">88.5 (Tuntas)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Mode Malam */}
          <div
            onClick={() => setDarkMode(true)}
            className={`group relative rounded-2xl border p-5 cursor-pointer transition-all ${
              isDarkMode
                ? 'border-indigo-500 bg-indigo-50/10 ring-2 ring-indigo-500/20 shadow-md dark:border-indigo-500 dark:bg-indigo-950/20'
                : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-800/40 dark:hover:border-slate-700'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl ${isDarkMode ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'}`}>
                  <Moon className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    Mode Malam (Dark Mode)
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Latar gelap elegan yang ramah bagi mata
                  </p>
                </div>
              </div>

              {isDarkMode ? (
                <span className="flex items-center gap-1 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-950/60 px-2 py-0.5 rounded-full">
                  <Check className="h-3 w-3" />
                  <span>Aktif</span>
                </span>
              ) : (
                <span className="text-[11px] font-medium text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  Pilih
                </span>
              )}
            </div>

            <p className="mt-3 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Mengurangi paparan cahaya biru (blue light) dan kelelahan mata saat guru menyusun modul ajar atau menginput nilai asesmen pada malam hari. Lebih hemat daya baterai perangkat.
            </p>

            {/* Visual Mini Preview Dark */}
            <div className="mt-4 rounded-xl border border-slate-700 bg-slate-900 p-3 text-[10px] space-y-2 select-none pointer-events-none text-slate-200">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="font-bold text-white">Contoh Tampilan Malam</span>
                <span className="bg-indigo-600 text-white px-1.5 py-0.2 rounded font-semibold text-[9px]">Kelas 4</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-slate-800 p-2 rounded-lg border border-slate-700 text-slate-200">
                  <span className="font-semibold block text-slate-300">Presensi Siswa</span>
                  <span className="text-emerald-400 font-bold">100% Hadir</span>
                </div>
                <div className="bg-slate-800 p-2 rounded-lg border border-slate-700 text-slate-200">
                  <span className="font-semibold block text-slate-300">Rata-rata Kelas</span>
                  <span className="text-indigo-400 font-bold">88.5 (Tuntas)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Information Highlights */}
        <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
            <Eye className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Kenyamanan Visual</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Standar kontras WCAG AA memastikan teks mudah dibaca di mode manapun.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
            <Printer className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Cetak Rapor Otomatis</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Cetak dokumen resmi selalu dioptimalkan berlatar putih bersih hemat tinta.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
            <Sparkles className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Tersimpan Permanen</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Pilihan tema Anda otomatis diingat dan langsung aktif saat membuka kembali aplikasi.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
