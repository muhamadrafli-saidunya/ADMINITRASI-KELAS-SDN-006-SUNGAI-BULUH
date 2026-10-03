import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { JadwalPelajaranAdminTab } from './JadwalPelajaranAdminTab';
import { JadwalPelajaranSiswaTab } from './JadwalPelajaranSiswaTab';
import { ReguPiketTab } from './ReguPiketTab';
import { AgendaSekolahTab } from './AgendaSekolahTab';
import { PrintJadwalModal } from './PrintJadwalModal';
import { PrintPiketModal } from './PrintPiketModal';
import {
  CalendarDays,
  Brush,
  Calendar,
  Printer,
  ShieldCheck,
  User,
  Sparkles,
  BookOpen
} from 'lucide-react';

export const JadwalPelajaranView: React.FC = () => {
  const { currentUser, schoolInfo } = useApp();

  // Navigation tab: default to 'jadwal'
  const [activeTab, setActiveTab] = useState<'jadwal' | 'piket' | 'agenda'>('jadwal');
  const [selectedDay, setSelectedDay] = useState<string>('Senin');

  // Print Modals
  const [isPrintTimetableOpen, setIsPrintTimetableOpen] = useState(false);
  const [isPrintPiketOpen, setIsPrintPiketOpen] = useState(false);

  const isAdmin = currentUser.role !== 'siswa';

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header & Role Indicator */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              Jadwal & Agenda Kelas
            </h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
              Kelas {schoolInfo.className}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Jadwal pelajaran Kurikulum Merdeka, pembagian regu piket kebersihan, dan kalender kegiatan sekolah.
          </p>
        </div>

        {/* User Role Badge & Print Shortcut */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-300">
            {isAdmin ? (
              <>
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <span>Mode: <strong>Admin / Wali Kelas</strong></span>
              </>
            ) : (
              <>
                <User className="h-4 w-4 text-blue-600" />
                <span>Mode: <strong>Siswa ({currentUser.name})</strong></span>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={() => {
              if (activeTab === 'piket') setIsPrintPiketOpen(true);
              else setIsPrintTimetableOpen(true);
            }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-700 shadow-xs hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 transition-colors"
          >
            <Printer className="h-4 w-4 text-slate-500" />
            <span className="hidden sm:inline">Cetak</span>
          </button>
        </div>
      </div>

      {/* Main Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 overflow-x-auto pb-0">
        <button
          type="button"
          onClick={() => setActiveTab('jadwal')}
          className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'jadwal'
              ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
        >
          <CalendarDays className="h-4 w-4" />
          <span>Jadwal Pelajaran</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('piket')}
          className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'piket'
              ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
        >
          <Brush className="h-4 w-4" />
          <span>Regu Piket Kebersihan</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('agenda')}
          className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'agenda'
              ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
        >
          <Calendar className="h-4 w-4" />
          <span>Agenda & Kalender Sekolah</span>
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === 'jadwal' && (
        isAdmin ? (
          <JadwalPelajaranAdminTab
            selectedDay={selectedDay}
            setSelectedDay={setSelectedDay}
            onOpenPrint={() => setIsPrintTimetableOpen(true)}
          />
        ) : (
          <JadwalPelajaranSiswaTab
            selectedDay={selectedDay}
            setSelectedDay={setSelectedDay}
            onOpenPrint={() => setIsPrintTimetableOpen(true)}
          />
        )
      )}

      {activeTab === 'piket' && (
        <ReguPiketTab onOpenPrint={() => setIsPrintPiketOpen(true)} />
      )}

      {activeTab === 'agenda' && (
        <AgendaSekolahTab />
      )}

      {/* Print Modals */}
      <PrintJadwalModal
        isOpen={isPrintTimetableOpen}
        onClose={() => setIsPrintTimetableOpen(false)}
      />

      <PrintPiketModal
        isOpen={isPrintPiketOpen}
        onClose={() => setIsPrintPiketOpen(false)}
      />
    </div>
  );
};
