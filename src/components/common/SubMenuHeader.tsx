import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  ArrowLeft,
  ChevronRight,
  LayoutDashboard,
  Users,
  UserCheck,
  CalendarCheck2,
  GraduationCap,
  FileSpreadsheet,
  BookOpenCheck,
  Calendar,
  WalletCards,
  Package,
  HeartHandshake,
  Bot,
  Settings,
  FolderSync,
  BookMarked,
  Target
} from 'lucide-react';
import { ActiveTab } from '../../types';

interface SubMenuHeaderProps {
  title?: string;
  subtitle?: string;
  category?: string;
  badge?: string;
  actions?: React.ReactNode;
}

const TAB_CONFIG: Record<ActiveTab, { name: string; category: string; icon: React.FC<{ className?: string }> }> = {
  dashboard: { name: 'Dashboard', category: 'Utama', icon: LayoutDashboard },
  siswa: { name: 'Data Siswa & Buku Induk', category: 'Administrasi Siswa', icon: Users },
  guru: { name: 'Data Guru & Tenaga Kependidikan', category: 'Kepegawaian', icon: UserCheck },
  presensi: { name: 'Presensi & Kehadiran', category: 'Akademik', icon: CalendarCheck2 },
  perangkat_ajar: { name: 'Perangkat Ajar SD (Modul Ajar)', category: 'Kurikulum Merdeka', icon: BookMarked },
  kokurikuler_dpl: { name: 'Kokurikuler & Dimensi Profil Lulusan (DPL)', category: 'Kurikulum Merdeka', icon: Target },
  nilai: { name: 'Daftar Nilai & Asesmen', category: 'Kurikulum Merdeka', icon: GraduationCap },
  raport: { name: 'Cetak Rapor KMPM (Pembelajaran Mendalam)', category: 'Laporan', icon: FileSpreadsheet },
  jurnal: { name: 'Buku Jurnal Mengajar Guru', category: 'Pembelajaran', icon: BookOpenCheck },
  jadwal: { name: 'Jadwal & Regu Piket', category: 'Administrasi', icon: Calendar },
  kas: { name: 'Buku Kas & Iuran Kelas', category: 'Keuangan', icon: WalletCards },
  inventaris: { name: 'Inventaris Sarana Ruang (KIR)', category: 'Sarpras', icon: Package },
  konseling: { name: 'Bimbingan & Prestasi Siswa', category: 'Kesiswaan', icon: HeartHandshake },
  import_excel: { name: 'Pusat Import & Template Excel', category: 'Data Master', icon: FolderSync },
  ai_assistant: { name: 'AI Asisten Wali Kelas', category: 'AI Tools', icon: Bot },
  pengaturan: { name: 'Pengaturan & Backup Data', category: 'Sistem', icon: Settings }
};

export const SubMenuHeader: React.FC<SubMenuHeaderProps> = ({
  title,
  subtitle,
  category,
  badge,
  actions
}) => {
  const { currentTab, setCurrentTab, goBack, schoolInfo } = useApp();

  if (currentTab === 'dashboard') {
    return null;
  }

  const currentConfig = TAB_CONFIG[currentTab] || {
    name: 'Sub Menu',
    category: 'Administrasi',
    icon: LayoutDashboard
  };

  const IconComponent = currentConfig.icon;
  const displayTitle = title || currentConfig.name;
  const displayCategory = category || currentConfig.category;

  return (
    <div className="mb-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs p-3.5 sm:p-4 no-print transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Left Section: Back Button & Breadcrumbs + Title */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={goBack}
            className="group inline-flex items-center gap-1.5 rounded-xl bg-slate-100 hover:bg-blue-600 text-slate-700 hover:text-white dark:bg-slate-800 dark:hover:bg-blue-600 dark:text-slate-200 dark:hover:text-white px-3 py-2 text-xs font-bold transition-all shadow-xs active:scale-95 border border-slate-200 dark:border-slate-700 shrink-0"
            title="Kembali ke Dashboard / Halaman Sebelumnya"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
            <span>Kembali</span>
          </button>

          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/70 border border-blue-200 dark:border-blue-800/80 text-blue-600 dark:text-blue-400 shrink-0">
              <IconComponent className="h-4 w-4" />
            </div>

            <div className="min-w-0">
              <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
                <button
                  onClick={() => setCurrentTab('dashboard')}
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Dashboard
                </button>
                <ChevronRight className="h-2.5 w-2.5 text-slate-400 shrink-0" />
                <span className="text-slate-500 dark:text-slate-400 truncate">{displayCategory}</span>
              </nav>
              <h1 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-tight truncate">
                {displayTitle}
              </h1>
            </div>
          </div>

          {badge && (
            <span className="hidden md:inline-flex items-center rounded-lg bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              {badge}
            </span>
          )}
        </div>

        {/* Right Section: Actions & Class Meta */}
        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
          {actions}
          <div className="hidden lg:flex items-center gap-2 text-right border-l border-slate-200 dark:border-slate-800 pl-3">
            <div>
              <p className="text-[11px] font-bold text-slate-700 dark:text-slate-200">
                {schoolInfo.className} • {schoolInfo.academicYear}
              </p>
              <p className="text-[10px] text-slate-400">
                Semester {schoolInfo.semester}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
