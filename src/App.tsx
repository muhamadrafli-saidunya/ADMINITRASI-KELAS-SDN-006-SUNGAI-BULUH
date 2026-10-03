import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { Topbar } from './components/layout/Topbar';
import { RoleSwitcherModal } from './components/auth/RoleSwitcherModal';
import { ToastContainer } from './components/common/ToastContainer';
import { SubMenuHeader } from './components/common/SubMenuHeader';

import { WelcomeSplashScreen } from './components/auth/WelcomeSplashScreen';
import { LoginView } from './components/auth/LoginView';

// Module Views
import { DashboardView } from './components/dashboard/DashboardView';
import { DataSiswaView } from './components/siswa/DataSiswaView';
import { DataGuruView } from './components/guru/DataGuruView';
import { PresensiView } from './components/presensi/PresensiView';
import { PerangkatAjarView } from './components/perangkat_ajar/PerangkatAjarView';
import { PenilaianView } from './components/nilai/PenilaianView';
import { RaportView } from './components/raport/RaportView';
import { JurnalMengajarView } from './components/jurnal/JurnalMengajarView';
import { JadwalPelajaranView } from './components/jadwal/JadwalPelajaranView';
import { KasKelasView } from './components/kas/KasKelasView';
import { InventarisView } from './components/inventaris/InventarisView';
import { KonselingPrestasiView } from './components/konseling/KonselingPrestasiView';
import { ImportExcelView } from './components/excel/ImportExcelView';
import { AIAssistantView } from './components/ai/AIAssistantView';
import { PengaturanView } from './components/pengaturan/PengaturanView';
import { KokurikulerDPLView } from './components/kokurikuler/KokurikulerDPLView';

const MainLayout: React.FC = () => {
  const { currentTab, schoolInfo } = useApp();
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sidebar_expanded');
      if (saved !== null) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          // ignore
        }
      }
      return window.innerWidth >= 1024;
    }
    return true;
  });
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);

  const handleToggleSidebar = () => {
    setIsSidebarOpen(prev => {
      const next = !prev;
      try {
        localStorage.setItem('sidebar_expanded', JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  };

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
    try {
      localStorage.setItem('sidebar_expanded', JSON.stringify(false));
    } catch (e) {}
  };

  const renderActiveView = () => {
    switch (currentTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'siswa':
        return <DataSiswaView />;
      case 'guru':
        return <DataGuruView />;
      case 'presensi':
        return <PresensiView />;
      case 'perangkat_ajar':
        return <PerangkatAjarView />;
      case 'nilai':
        return <PenilaianView />;
      case 'kokurikuler_dpl':
        return <KokurikulerDPLView />;
      case 'raport':
        return <RaportView />;
      case 'jurnal':
        return <JurnalMengajarView />;
      case 'jadwal':
        return <JadwalPelajaranView />;
      case 'kas':
        return <KasKelasView />;
      case 'inventaris':
        return <InventarisView />;
      case 'konseling':
        return <KonselingPrestasiView />;
      case 'import_excel':
        return <ImportExcelView />;
      case 'ai_assistant':
        return <AIAssistantView />;
      case 'pengaturan':
        return <PengaturanView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans antialiased selection:bg-blue-600 selection:text-white transition-colors duration-200">
      {/* Toast Notification Layer */}
      <ToastContainer />

      {/* Role Switcher Modal (Multi-user Simulation) */}
      <RoleSwitcherModal
        isOpen={isRoleModalOpen}
        onClose={() => setIsRoleModalOpen(false)}
      />

      {/* Main Structural Layout */}
      <div className="flex flex-1 relative overflow-x-hidden print:block print:overflow-visible print:static">
        {/* Left Navigation Sidebar */}
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={handleCloseSidebar}
          onOpenRoleModal={() => setIsRoleModalOpen(true)}
        />

        {/* Right Main Content Area (Bergeser mulus menyesuaikan ketersediaan ruang) */}
        <div
          className={`flex flex-1 flex-col w-full min-w-0 transition-all duration-300 ease-in-out ${
            isSidebarOpen ? 'lg:pl-72' : 'lg:pl-0'
          } print:pl-0 print:p-0 print:m-0 print:w-full print:block print:static`}
        >
          {/* Topbar Header */}
          <Topbar
            isSidebarOpen={isSidebarOpen}
            onToggleSidebar={handleToggleSidebar}
            onOpenRoleModal={() => setIsRoleModalOpen(true)}
          />

          {/* Dynamic Module Canvas */}
          <main
            className={`flex-1 p-4 sm:p-6 lg:p-8 w-full mx-auto transition-all duration-300 ease-in-out ${
              isSidebarOpen ? 'max-w-7xl' : 'max-w-[1600px]'
            } print:p-0 print:m-0 print:max-w-none print:w-full print:block print:static`}
          >
            <SubMenuHeader />
            {renderActiveView()}
          </main>

          {/* Footer */}
          <footer className="border-t border-slate-200/80 bg-white/60 dark:border-slate-800 dark:bg-slate-900/40 py-4 px-6 text-center text-xs text-slate-500 dark:text-slate-400 no-print">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 max-w-7xl mx-auto">
              <p>
                <strong>Administrasi Kelas SD</strong> • Sistem Informasi Pengelolaan Dokumen & Rapor Kurikulum Merdeka
              </p>
              <p className="text-[11px] text-slate-400">
                {schoolInfo.schoolName} • Versi 1.0.0 Siap Cetak
              </p>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};

const AppContent: React.FC = () => {
  const { isAuthenticated } = useApp();
  const [authStage, setAuthStage] = useState<'splash' | 'login'>('splash');

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 overflow-hidden">
        <ToastContainer />
        <AnimatePresence mode="wait">
          {authStage === 'splash' ? (
            <motion.div
              key="splash-stage"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.35 }}
              className="w-full min-h-screen"
            >
              <WelcomeSplashScreen onContinue={() => setAuthStage('login')} />
            </motion.div>
          ) : (
            <motion.div
              key="login-stage"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.35 }}
              className="w-full min-h-screen"
            >
              <LoginView onBackToSplash={() => setAuthStage('splash')} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <motion.div
      key="app-main-layout"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <MainLayout />
    </motion.div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
