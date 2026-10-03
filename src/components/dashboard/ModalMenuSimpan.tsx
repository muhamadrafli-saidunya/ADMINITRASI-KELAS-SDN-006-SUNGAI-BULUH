import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Save,
  ShieldCheck,
  Download,
  Upload,
  Clock,
  CheckCircle2,
  HardDrive,
  Users,
  GraduationCap,
  Award,
  BookOpenCheck,
  CalendarCheck2,
  WalletCards,
  BookOpen,
  FileCheck,
  X,
  Sparkles,
  AlertCircle
} from 'lucide-react';

interface ModalMenuSimpanProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ModalMenuSimpan: React.FC<ModalMenuSimpanProps> = ({ isOpen, onClose }) => {
  const {
    students,
    teachers,
    grades,
    studentReports,
    attendanceRecords,
    modulAjarList,
    journals,
    getCurrentCashBalance,
    lastSavedAt,
    saveAllData,
    exportDatabaseToJson,
    importDatabaseFromJson,
    schoolInfo
  } = useApp();

  const [isSaving, setIsSaving] = useState(false);
  const [justSaved, setJustSaved] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleManualSave = () => {
    setIsSaving(true);
    setJustSaved(false);
    setTimeout(() => {
      saveAllData();
      setIsSaving(false);
      setJustSaved(true);
      setTimeout(() => setJustSaved(false), 3500);
    }, 300);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const success = importDatabaseFromJson(content);
        if (success) {
          setImportError(null);
          setJustSaved(true);
          setTimeout(() => setJustSaved(false), 3000);
        } else {
          setImportError('Berkas cadangan tidak valid atau rusak. Pastikan berkas berformat .json.');
        }
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const safeReportsCount = Object.keys(studentReports || {}).length;
  const cashBalance = getCurrentCashBalance ? getCurrentCashBalance() : 0;

  return (
    <div
      id="modal-menu-simpan-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="modal-menu-simpan-content"
        className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 text-white shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center border border-white/30 shadow-xs">
              <Save className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black tracking-tight flex items-center gap-2">
                Menu SIMPAN & Keamanan Data
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-white/25 text-white border border-white/40">
                  Permanen
                </span>
              </h2>
              <p className="text-xs text-emerald-100">
                Penyimpanan lokal persisten • Data dipertahankan saat aplikasi ditutup
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-1.5 text-white/80 hover:text-white hover:bg-white/20 transition-colors cursor-pointer"
            aria-label="Tutup Modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Status Banner */}
          <div className="rounded-xl border border-emerald-200 dark:border-emerald-800/80 bg-emerald-50/80 dark:bg-emerald-950/40 p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <h3 className="text-sm font-bold text-emerald-900 dark:text-emerald-200">
                      Penyimpanan Otomatis Aktif (Terlindungi)
                    </h3>
                  </div>
                  <p className="text-xs text-emerald-800 dark:text-emerald-300 mt-1 leading-relaxed">
                    Setiap perubahan data siswa, nilai, presensi, rapor, dan modul langsung disimpan ke penyimpanan lokal peramban. Saat aplikasi atau browser ditutup dan dibuka kembali, <strong>data akan tetap sama persis</strong> dengan sebelumnya.
                  </p>
                </div>
              </div>
            </div>

            {/* Last Saved Time */}
            <div className="mt-3 pt-3 border-t border-emerald-200/80 dark:border-emerald-800/50 flex flex-wrap items-center justify-between gap-2 text-xs text-emerald-800 dark:text-emerald-300">
              <span className="flex items-center gap-1.5 font-medium">
                <Clock className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                Terakhir Disimpan:
              </span>
              <span className="font-bold bg-white dark:bg-slate-900 px-2.5 py-0.5 rounded-md border border-emerald-300 dark:border-emerald-800 text-emerald-950 dark:text-emerald-200 shadow-2xs">
                {lastSavedAt || 'Tersimpan Otomatis (Sesi Ini)'}
              </span>
            </div>
          </div>

          {/* Primary Action: Simpan Sekarang */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-4 bg-slate-50/70 dark:bg-slate-800/40">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <HardDrive className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  Simpan Manual Seluruh Database
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Klik tombol ini untuk memastikan seluruh 20+ kategori administrasi tersinkronisasi ke memori perangkat.
                </p>
              </div>

              <button
                id="btn-simpan-sekarang-modal"
                onClick={handleManualSave}
                disabled={isSaving}
                className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all active:scale-95 shrink-0 ${
                  justSaved
                    ? 'bg-emerald-600 text-white ring-2 ring-emerald-400'
                    : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white cursor-pointer'
                }`}
              >
                {justSaved ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 animate-bounce" />
                    <span>Tersimpan Sukses!</span>
                  </>
                ) : isSaving ? (
                  <>
                    <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    <span>Menyimpan...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    <span>SIMPAN SEKARANG</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Ringkasan Data yang Aman Tersimpan */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2.5 flex items-center gap-1.5">
              <FileCheck className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
              Rekapitulasi Data yang Tersimpan Saat Ini
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-2.5 bg-white dark:bg-slate-900">
                <div className="flex items-center gap-1.5 text-slate-400 text-[11px] mb-1">
                  <Users className="h-3.5 w-3.5 text-blue-500" />
                  <span>Data Siswa</span>
                </div>
                <p className="text-base font-bold text-slate-900 dark:text-white">
                  {students.length} <span className="text-xs font-normal text-slate-500">Siswa</span>
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-2.5 bg-white dark:bg-slate-900">
                <div className="flex items-center gap-1.5 text-slate-400 text-[11px] mb-1">
                  <GraduationCap className="h-3.5 w-3.5 text-indigo-500" />
                  <span>Pendidik</span>
                </div>
                <p className="text-base font-bold text-slate-900 dark:text-white">
                  {teachers.length} <span className="text-xs font-normal text-slate-500">Guru</span>
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-2.5 bg-white dark:bg-slate-900">
                <div className="flex items-center gap-1.5 text-slate-400 text-[11px] mb-1">
                  <Award className="h-3.5 w-3.5 text-amber-500" />
                  <span>Nilai & Asesmen</span>
                </div>
                <p className="text-base font-bold text-slate-900 dark:text-white">
                  {grades.length} <span className="text-xs font-normal text-slate-500">Rekaman</span>
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-2.5 bg-white dark:bg-slate-900">
                <div className="flex items-center gap-1.5 text-slate-400 text-[11px] mb-1">
                  <BookOpenCheck className="h-3.5 w-3.5 text-emerald-500" />
                  <span>Rapor KMPM</span>
                </div>
                <p className="text-base font-bold text-slate-900 dark:text-white">
                  {safeReportsCount} <span className="text-xs font-normal text-slate-500">Rapor</span>
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-2.5 bg-white dark:bg-slate-900">
                <div className="flex items-center gap-1.5 text-slate-400 text-[11px] mb-1">
                  <CalendarCheck2 className="h-3.5 w-3.5 text-rose-500" />
                  <span>Presensi</span>
                </div>
                <p className="text-base font-bold text-slate-900 dark:text-white">
                  {attendanceRecords.length} <span className="text-xs font-normal text-slate-500">Catatan</span>
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-2.5 bg-white dark:bg-slate-900">
                <div className="flex items-center gap-1.5 text-slate-400 text-[11px] mb-1">
                  <BookOpen className="h-3.5 w-3.5 text-teal-500" />
                  <span>Modul Ajar</span>
                </div>
                <p className="text-base font-bold text-slate-900 dark:text-white">
                  {modulAjarList.length} <span className="text-xs font-normal text-slate-500">Modul</span>
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-2.5 bg-white dark:bg-slate-900">
                <div className="flex items-center gap-1.5 text-slate-400 text-[11px] mb-1">
                  <BookOpenCheck className="h-3.5 w-3.5 text-cyan-500" />
                  <span>Jurnal Guru</span>
                </div>
                <p className="text-base font-bold text-slate-900 dark:text-white">
                  {journals.length} <span className="text-xs font-normal text-slate-500">Agenda</span>
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-2.5 bg-white dark:bg-slate-900">
                <div className="flex items-center gap-1.5 text-slate-400 text-[11px] mb-1">
                  <WalletCards className="h-3.5 w-3.5 text-violet-500" />
                  <span>Saldo Kas</span>
                </div>
                <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                  Rp {cashBalance.toLocaleString('id-ID')}
                </p>
              </div>
            </div>
          </div>

          {/* Backup & Restore Section */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-4 bg-white dark:bg-slate-900 space-y-3">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Download className="h-3.5 w-3.5 text-blue-600" />
                Cadangkan & Pulihkan Berkas (Perlindungan Ganda)
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Unduh salinan fisik database ke laptop Anda untuk cadangan di Flashdisk/Google Drive, atau pulihkan jika berganti komputer.
              </p>
            </div>

            {importError && (
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 text-xs border border-rose-200 dark:border-rose-800">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{importError}</span>
              </div>
            )}

            <div className="flex flex-wrap gap-2.5">
              <button
                onClick={exportDatabaseToJson}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/60 border border-blue-200 dark:border-blue-800 text-xs font-bold transition-all cursor-pointer"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Unduh File Cadangan (.JSON)</span>
              </button>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-xs font-bold transition-all cursor-pointer"
              >
                <Upload className="h-3.5 w-3.5" />
                <span>Pulihkan dari File Cadangan</span>
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept=".json,application/json"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
          </div>

          {/* Tips Jaminan */}
          <div className="rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/40 p-3.5 text-xs text-amber-900 dark:text-amber-300 space-y-1">
            <p className="font-bold flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-amber-600" />
              Jaminan Keamanan Saat Aplikasi Ditutup:
            </p>
            <p className="text-[11px] leading-relaxed text-amber-800/90 dark:text-amber-300/90">
              Aplikasi ini dilengkapi pengunci data otomatis (unload sync). Ketika Anda menutup tab browser atau laptop dimatikan, semua data yang telah diinput otomatis tersimpan dan akan kembali tampil sama persis saat dibuka lagi di peramban ini.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/50 shrink-0">
          <span className="text-[11px] text-slate-500 dark:text-slate-400">
            {schoolInfo.schoolName} • Kelas {schoolInfo.className}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
