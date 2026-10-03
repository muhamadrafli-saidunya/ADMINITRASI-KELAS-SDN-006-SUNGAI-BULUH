import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ActiveTab } from '../../types';
import { PintasanWaliKelasModal } from './PintasanWaliKelasModal';
import { SchoolLogoRenderer } from '../common/SchoolLogoRenderer';
import {
  LayoutDashboard,
  Users,
  UserCheck,
  CalendarCheck2,
  BookMarked,
  GraduationCap,
  FileSpreadsheet,
  BookOpenCheck,
  CalendarDays,
  WalletCards,
  Boxes,
  Award,
  Sparkles,
  Settings,
  LogOut,
  ChevronRight,
  ShieldCheck,
  FolderSync,
  Layers,
  Sun,
  Moon,
  PanelLeftClose,
  Target
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenRoleModal: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  onOpenRoleModal
}) => {
  const {
    currentTab,
    setCurrentTab,
    currentUser,
    schoolInfo,
    students,
    teachers,
    modulAjarList,
    projekKokurikulerList,
    getCurrentCashBalance,
    logout,
    hasPermission,
    isDarkMode,
    setDarkMode,
    toggleDarkMode
  } = useApp();

  const [isPintasanModalOpen, setIsPintasanModalOpen] = useState(false);

  // Categorized Navigation Items
  const mainNavItems: Array<{
    id: ActiveTab;
    label: string;
    icon: React.ReactNode;
  }> = [
    {
      id: 'dashboard',
      label: 'Dashboard Utama',
      icon: <LayoutDashboard className="h-4.5 w-4.5" />
    }
  ];

  const administrasiKelasItems: Array<{
    id: ActiveTab;
    label: string;
    icon: React.ReactNode;
    badge?: string | number;
    badgeColor?: string;
  }> = [
    {
      id: 'siswa',
      label: '1. Data Siswa & Induk',
      icon: <Users className="h-4.5 w-4.5" />,
      badge: students.length,
      badgeColor: 'bg-blue-600/25 text-blue-300'
    },
    {
      id: 'presensi',
      label: '2. Presensi & Kehadiran',
      icon: <CalendarCheck2 className="h-4.5 w-4.5" />,
      badgeColor: 'bg-emerald-500/20 text-emerald-300'
    },
    {
      id: 'perangkat_ajar',
      label: '3. Perangkat Ajar SD',
      icon: <BookMarked className="h-4.5 w-4.5 text-indigo-400" />,
      badge: modulAjarList.length,
      badgeColor: 'bg-indigo-500/20 text-indigo-300'
    },
    {
      id: 'kokurikuler_dpl',
      label: '4. Kokurikuler & DPL',
      icon: <Target className="h-4.5 w-4.5 text-pink-400" />,
      badge: `${projekKokurikulerList.length} Projek`,
      badgeColor: 'bg-pink-500/20 text-pink-300'
    },
    {
      id: 'nilai',
      label: '5. Daftar Nilai & TP',
      icon: <GraduationCap className="h-4.5 w-4.5" />,
      badgeColor: 'bg-purple-500/20 text-purple-300'
    },
    {
      id: 'raport',
      label: '6. Cetak Rapor KMPM',
      icon: <FileSpreadsheet className="h-4.5 w-4.5" />,
      badgeColor: 'bg-rose-500/20 text-rose-300'
    },
    {
      id: 'jurnal',
      label: '7. Jurnal Mengajar Guru',
      icon: <BookOpenCheck className="h-4.5 w-4.5" />,
      badgeColor: 'bg-amber-500/20 text-amber-300'
    },
    {
      id: 'jadwal',
      label: '8. Jadwal & Piket Kelas',
      icon: <CalendarDays className="h-4.5 w-4.5" />,
      badgeColor: 'bg-sky-500/20 text-sky-300'
    },
    {
      id: 'kas',
      label: '9. Kas Kelas & Iuran',
      icon: <WalletCards className="h-4.5 w-4.5" />,
      badge: `Rp ${(getCurrentCashBalance() / 1000).toFixed(0)}k`,
      badgeColor: 'bg-emerald-500/20 text-emerald-300'
    },
    {
      id: 'inventaris',
      label: '10. Inventaris Ruang (KIR)',
      icon: <Boxes className="h-4.5 w-4.5" />,
      badgeColor: 'bg-slate-700 text-slate-300'
    },
    {
      id: 'konseling',
      label: '11. Konseling & Prestasi',
      icon: <Award className="h-4.5 w-4.5" />,
      badgeColor: 'bg-amber-500/20 text-amber-300'
    }
  ];

  const dataMasterItems: Array<{
    id: ActiveTab;
    label: string;
    icon: React.ReactNode;
    badge?: string | number;
    badgeColor?: string;
  }> = [
    {
      id: 'guru',
      label: 'Data Guru & Pegawai',
      icon: <UserCheck className="h-4.5 w-4.5" />,
      badge: teachers.length,
      badgeColor: 'bg-purple-500/20 text-purple-300'
    },
    {
      id: 'import_excel',
      label: 'Import & Template Excel',
      icon: <FolderSync className="h-4.5 w-4.5 text-emerald-400" />,
      badge: 'XLSX',
      badgeColor: 'bg-emerald-500/25 text-emerald-300 font-bold'
    }
  ];

  const sistemItems: Array<{
    id: ActiveTab;
    label: string;
    icon: React.ReactNode;
    badge?: string | number;
    badgeColor?: string;
  }> = [
    {
      id: 'ai_assistant',
      label: 'AI Asisten Wali Kelas',
      icon: <Sparkles className="h-4.5 w-4.5 text-amber-400" />,
      badge: 'Gemini',
      badgeColor: 'bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold'
    },
    {
      id: 'pengaturan',
      label: 'Pengaturan & Backup',
      icon: <Settings className="h-4.5 w-4.5" />
    }
  ];

  const handleNavClick = (tab: ActiveTab) => {
    setCurrentTab(tab);
    // Auto-close drawer on mobile devices when selecting a menu
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      onClose();
    }
  };

  const renderNavList = (items: Array<{ id: ActiveTab; label: string; icon: React.ReactNode; badge?: string | number; badgeColor?: string }>) => {
    return items.filter(item => hasPermission(item.id)).map(item => {
      const isActive = currentTab === item.id;
      return (
        <button
          key={item.id}
          onClick={() => handleNavClick(item.id)}
          className={`group flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold transition-all duration-150 ${
            isActive
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
              : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
          }`}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <span className={`${isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-400 transition-colors shrink-0'}`}>
              {item.icon}
            </span>
            <span className="truncate">{item.label}</span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {item.badge !== undefined && (
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full ${
                  isActive
                    ? 'bg-white/20 text-white font-bold'
                    : item.badgeColor || 'bg-slate-800 text-slate-300'
                }`}
              >
                {item.badge}
              </span>
            )}
            {isActive && <ChevronRight className="h-3.5 w-3.5 text-blue-200" />}
          </div>
        </button>
      );
    });
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-sm lg:hidden no-print"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 flex w-72 flex-col bg-slate-900 text-slate-200 shadow-2xl transition-all duration-300 ease-in-out border-r border-slate-800 no-print ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* School Branding Header */}
        <div className="flex items-center gap-3 border-b border-slate-800/80 px-4 py-4 bg-gradient-to-r from-blue-950/80 to-slate-900">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-800/90 p-1 ring-1 ring-blue-400/30 shadow-md shadow-blue-950/40">
            <SchoolLogoRenderer
              preset={schoolInfo.logoLeftPreset || 'tutwuri'}
              customUrl={schoolInfo.logoLeft}
              width={34}
              alt={schoolInfo.schoolName}
              className="drop-shadow-xs"
            />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="text-[9px] font-extrabold uppercase tracking-wider text-orange-400 bg-orange-950/80 px-1.5 py-0.5 rounded border border-orange-800/60">
                SD MERDEKA
              </span>
              <span className="text-[10px] font-semibold text-slate-400">
                {schoolInfo.phase}
              </span>
            </div>
            <h1 className="truncate text-xs font-bold text-white mt-0.5">
              {schoolInfo.schoolName}
            </h1>
            <p className="truncate text-[11px] text-blue-300/90 font-medium">
              Kelas {schoolInfo.className}
            </p>
          </div>

          {/* Tombol Sembunyikan Menu / Geser Tampilan */}
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/90 transition-colors cursor-pointer shrink-0"
            title="Sembunyikan menu samping (Perlebar ruang kerja)"
            aria-label="Sembunyikan menu samping"
          >
            <PanelLeftClose className="h-4.5 w-4.5" />
          </button>
        </div>

        {/* Pintasan 15 Buku Modal Banner */}
        <div className="px-3 pt-3">
          <button
            onClick={() => setIsPintasanModalOpen(true)}
            className="w-full flex items-center justify-between p-2.5 rounded-xl bg-gradient-to-r from-indigo-950/90 via-blue-950/70 to-slate-900 border border-indigo-500/30 hover:border-indigo-400/60 text-slate-200 hover:text-white transition-all shadow-xs group"
          >
            <div className="flex items-center gap-2 min-w-0">
              <div className="p-1 rounded-lg bg-indigo-600/30 text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <Layers className="h-3.5 w-3.5" />
              </div>
              <div className="text-left min-w-0">
                <p className="text-xs font-bold text-white truncate">15 Buku Administrasi</p>
                <p className="text-[10px] text-slate-400">Standar Supervisi & Akreditasi</p>
              </div>
            </div>
            <span className="text-[10px] font-bold text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/30">
              Buka
            </span>
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3.5 custom-scrollbar">
          {/* 1. Menu Utama */}
          <div className="space-y-0.5">
            <p className="px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
              Menu Utama
            </p>
            {renderNavList(mainNavItems)}
          </div>

          {/* 2. Administrasi Wali Kelas (10 Menu Inti) */}
          <div className="space-y-0.5">
            <p className="px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-indigo-300">
              Administrasi Kelas SD
            </p>
            {renderNavList(administrasiKelasItems)}
          </div>

          {/* 3. Kepegawaian & Data Master */}
          <div className="space-y-0.5">
            <p className="px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
              Kepegawaian & Data
            </p>
            {renderNavList(dataMasterItems)}
          </div>

          {/* 4. Asisten AI & Sistem */}
          <div className="space-y-0.5">
            <p className="px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
              Layanan & Sistem
            </p>
            {renderNavList(sistemItems)}
          </div>
        </div>

        {/* Sidebar Footer Info */}
        <div className="border-t border-slate-800 p-3 bg-slate-950/80 space-y-2.5">
          {/* Theme Quick Switcher in Sidebar */}
          <div className="flex items-center justify-between bg-slate-900/90 p-1 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 font-semibold px-2 flex items-center gap-1.5">
              {isDarkMode ? <Moon className="h-3 w-3 text-amber-400" /> : <Sun className="h-3 w-3 text-amber-500" />}
              <span>Mode Tampilan</span>
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setDarkMode(false)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                  !isDarkMode
                    ? 'bg-amber-500 text-slate-950 shadow-xs'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
                title="Aktifkan Mode Terang (Light Mode)"
              >
                <Sun className="h-3 w-3" />
                <span>Terang</span>
              </button>
              <button
                type="button"
                onClick={() => setDarkMode(true)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                  isDarkMode
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
                title="Aktifkan Mode Malam (Dark Mode)"
              >
                <Moon className="h-3 w-3" />
                <span>Malam</span>
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-0.5">
            <div>
              <p className="font-semibold text-slate-300">TA {schoolInfo.academicYear}</p>
              <p className="text-[10px] text-slate-500">Sem. {schoolInfo.semester}</p>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-1.5 text-slate-400 hover:text-rose-400 transition-colors text-xs font-medium px-2 py-1 rounded-lg hover:bg-slate-800 cursor-pointer"
              title="Keluar dari akun"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Keluar</span>
            </button>
          </div>
        </div>
      </aside>

      {/* 15 Buku Administrasi Wali Kelas Modal */}
      <PintasanWaliKelasModal
        isOpen={isPintasanModalOpen}
        onClose={() => setIsPintasanModalOpen(false)}
      />
    </>
  );
};
