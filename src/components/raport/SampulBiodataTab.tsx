import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Student } from '../../types';
import {
  StudentCoverAndBiodataSheet,
  CoverPrintSettings,
  CoverPageSection,
  CoverBorderStyle,
  CoverBorderColor
} from './StudentCoverAndBiodataSheet';
import { ModalEditBiodataSiswa } from './ModalEditBiodataSiswa';
import { ModalCetakMassalSampul } from './ModalCetakMassalSampul';
import {
  Printer,
  ChevronLeft,
  ChevronRight,
  Edit3,
  Layers,
  FileText,
  User,
  School,
  FileCheck,
  CheckCircle2,
  Sparkles,
  Settings,
  Layout,
  Palette,
  Eye
} from 'lucide-react';

interface SampulBiodataTabProps {
  initialStudentId?: string;
  onSelectStudentId?: (id: string) => void;
}

const FRAME_OPTIONS: { id: CoverBorderStyle; label: string; desc: string; icon: string }[] = [
  { id: 'batik_nusantara', label: 'Batik Nusantara', desc: 'Sudut Ukir Tradisional Indonesia', icon: '🎨' },
  { id: 'classic', label: 'Klasik Kemdikbud', desc: 'Garis Ganda Formal Geometris', icon: '🏛️' },
  { id: 'certificate_royal', label: 'Sertifikat Royal', desc: 'Filigree Piagam & Ijazah Mewah', icon: '👑' },
  { id: 'geometric_art', label: 'Geometris Art Deco', desc: 'Garis Berlian & Presisi Modern', icon: '💎' },
  { id: 'vintage_ornate', label: 'Vintage Floral', desc: 'Renda Bunga Anggun Klasik', icon: '🌿' },
  { id: 'minimal_clean', label: 'Modern Minimalis', desc: 'Garis Bersih & Elegan', icon: '📐' }
];

const COLOR_OPTIONS: { id: CoverBorderColor; label: string; colorHex: string; textClass: string }[] = [
  { id: 'monochrome', label: 'Hitam Formal', colorHex: '#0f172a', textClass: 'text-slate-900 dark:text-white' },
  { id: 'navy', label: 'Biru Navy', colorHex: '#1e3a8a', textClass: 'text-blue-700 dark:text-blue-300' },
  { id: 'gold', label: 'Emas Antik', colorHex: '#92400e', textClass: 'text-amber-700 dark:text-amber-300' },
  { id: 'emerald', label: 'Hijau Zamrud', colorHex: '#065f46', textClass: 'text-emerald-700 dark:text-emerald-300' }
];

export const SampulBiodataTab: React.FC<SampulBiodataTabProps> = ({
  initialStudentId,
  onSelectStudentId
}) => {
  const { students, schoolInfo } = useApp();

  const [selectedStudentId, setSelectedStudentId] = useState<string>(
    initialStudentId || students[0]?.id || ''
  );
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isBatchModalOpen, setIsBatchModalOpen] = useState<boolean>(false);
  const [batchPrintStudents, setBatchPrintStudents] = useState<Student[] | null>(null);
  const [isStylePickerOpen, setIsStylePickerOpen] = useState<boolean>(false);

  // Settings
  const [settings, setSettings] = useState<CoverPrintSettings>({
    section: 'all',
    coverStyle: 'batik_nusantara',
    coverBorderColor: 'monochrome',
    showPhoto: true,
    showSignature: true,
    paperSize: 'A4',
    admissionDate: `15 Juli ${parseInt(schoolInfo.academicYear.split('/')[0] || '2024', 10)}`
  });

  const currentStudentIndex = students.findIndex(s => s.id === selectedStudentId);
  const selectedStudent = students[currentStudentIndex] || students[0];

  // Notify parent if student changes
  const handleSelectStudent = (id: string) => {
    setSelectedStudentId(id);
    if (onSelectStudentId) onSelectStudentId(id);
  };

  const handlePrevStudent = () => {
    if (currentStudentIndex > 0) {
      handleSelectStudent(students[currentStudentIndex - 1].id);
    }
  };

  const handleNextStudent = () => {
    if (currentStudentIndex < students.length - 1) {
      handleSelectStudent(students[currentStudentIndex + 1].id);
    }
  };

  const handlePrintSingle = () => {
    setBatchPrintStudents(null);
    setTimeout(() => {
      window.print();
    }, 150);
  };

  const handleStartBatchPrint = (targetStudents: Student[], printConfig: CoverPrintSettings) => {
    setSettings(printConfig);
    setBatchPrintStudents(targetStudents);
    setTimeout(() => {
      window.print();
    }, 250);
  };

  // Keyboard shortcut Ctrl+P
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        handlePrintSingle();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedStudent, settings]);

  if (!selectedStudent) {
    return (
      <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
        <p className="text-slate-500">Belum ada data peserta didik untuk ditampilkan.</p>
      </div>
    );
  }

  const selectedFrame = FRAME_OPTIONS.find(f => f.id === settings.coverStyle) || FRAME_OPTIONS[0];

  return (
    <div className="space-y-6">
      
      {/* ========================================================================= */}
      {/* TOP CONTROLS & STUDENT SELECTOR (NON-PRINT)                               */}
      {/* ========================================================================= */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-xs space-y-4 print:hidden">
        
        {/* Banner Info */}
        <div className="p-3.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-600 text-white shadow-xs">
              <User className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-purple-900 dark:text-purple-200">
                Lembar Sampul & Biodata Peserta Didik (Kurikulum Merdeka Pembelajaran Mendalam - KMPM)
              </h3>
              <p className="text-[11px] text-purple-700 dark:text-purple-300">
                Mencakup Cover Depan Rapor Resmi dengan Pilihan Bingkai Vektor Mewah, Profil Satuan Pendidikan, dan Lembar Biodata Siswa.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={() => setIsEditModalOpen(true)}
              className="flex items-center gap-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 active:scale-95 px-3.5 py-2 text-xs font-bold text-white shadow-xs transition-all"
            >
              <Edit3 className="h-3.5 w-3.5" />
              <span>Edit Biodata</span>
            </button>
            <button
              type="button"
              onClick={handlePrintSingle}
              className="flex items-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 px-4 py-2 text-xs font-extrabold text-white shadow-md shadow-blue-500/20 transition-all"
            >
              <Printer className="h-4 w-4" />
              <span>Cetak (Ctrl+P)</span>
            </button>
            <button
              type="button"
              onClick={() => setIsBatchModalOpen(true)}
              className="flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 px-3.5 py-2 text-xs font-bold text-white shadow-xs transition-all"
              title="Cetak Sampul & Biodata untuk Seluruh Siswa di Kelas"
            >
              <Layers className="h-4 w-4" />
              <span>Cetak Massal</span>
            </button>
          </div>
        </div>

        {/* Bar Pemilih Siswa & Sub-Lembar Selector */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 pt-2 border-t border-slate-100 dark:border-slate-800">
          
          {/* Student Selector */}
          <div className="flex items-center gap-2 flex-1 max-w-xl">
            <button
              type="button"
              onClick={handlePrevStudent}
              disabled={currentStudentIndex === 0}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              title="Siswa Sebelumnya"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <select
              value={selectedStudentId}
              onChange={e => handleSelectStudent(e.target.value)}
              className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs font-bold text-slate-900 dark:text-white shadow-xs focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
            >
              {students.map((student, idx) => (
                <option key={student.id} value={student.id}>
                  {student.nomorAbsen ? `${student.nomorAbsen}. ` : `${idx + 1}. `}
                  {student.nama} ({student.jenisKelamin === 'L' ? 'L' : 'P'}) — NISN: {student.nisn || '-'}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={handleNextStudent}
              disabled={currentStudentIndex === students.length - 1}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              title="Siswa Selanjutnya"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Sub-Section Filter Buttons */}
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={() => setSettings({ ...settings, section: 'all' })}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                settings.section === 'all'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-slate-700 dark:text-slate-300 hover:text-purple-600'
              }`}
            >
              Semua Halaman (3 Lembar)
            </button>
            <button
              type="button"
              onClick={() => setSettings({ ...settings, section: 'cover' })}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                settings.section === 'cover'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-slate-700 dark:text-slate-300 hover:text-purple-600'
              }`}
            >
              1. Cover Depan
            </button>
            <button
              type="button"
              onClick={() => setSettings({ ...settings, section: 'school_identity' })}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                settings.section === 'school_identity'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-slate-700 dark:text-slate-300 hover:text-purple-600'
              }`}
            >
              2. Identitas Sekolah
            </button>
            <button
              type="button"
              onClick={() => setSettings({ ...settings, section: 'biodata' })}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                settings.section === 'biodata'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-slate-700 dark:text-slate-300 hover:text-purple-600'
              }`}
            >
              3. Biodata Siswa
            </button>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* PANEL PILIHAN BINGKAI SAMPUL MEWAH & WARNA                                */}
        {/* ========================================================================= */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-purple-600" />
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                Pilihan Bingkai Sampul Rapor: <strong className="text-purple-600 dark:text-purple-400">{selectedFrame.label}</strong>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold text-slate-500">Warna Aksen:</span>
              <div className="flex items-center gap-1">
                {COLOR_OPTIONS.map(c => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setSettings({ ...settings, coverBorderColor: c.id })}
                    className={`w-6 h-6 rounded-full border-2 transition-all flex items-center justify-center ${
                      settings.coverBorderColor === c.id
                        ? 'border-purple-600 scale-110 shadow-xs ring-2 ring-purple-400/30'
                        : 'border-white dark:border-slate-800 opacity-70 hover:opacity-100'
                    }`}
                    style={{ backgroundColor: c.colorHex }}
                    title={c.label}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Grid Pilihan Bingkai Visual */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {FRAME_OPTIONS.map(frame => {
              const isSelected = settings.coverStyle === frame.id;
              return (
                <button
                  key={frame.id}
                  type="button"
                  onClick={() => setSettings({ ...settings, coverStyle: frame.id })}
                  className={`p-2.5 rounded-xl border text-left transition-all relative overflow-hidden flex flex-col justify-between ${
                    isSelected
                      ? 'border-purple-600 bg-purple-50/70 dark:bg-purple-950/40 shadow-xs ring-1 ring-purple-600'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 hover:border-purple-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-base">{frame.icon}</span>
                    {isSelected && (
                      <CheckCircle2 className="h-3.5 w-3.5 text-purple-600 shrink-0" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                      {frame.label}
                    </h4>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                      {frame.desc}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Toggle Foto & TTD */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2 text-xs">
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-1.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={settings.showPhoto}
                  onChange={e => setSettings({ ...settings, showPhoto: e.target.checked })}
                  className="rounded text-purple-600 focus:ring-purple-500"
                />
                <span className="text-slate-700 dark:text-slate-300">Tampilkan Pas Foto 3x4</span>
              </label>

              <label className="flex items-center gap-1.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={settings.showSignature}
                  onChange={e => setSettings({ ...settings, showSignature: e.target.checked })}
                  className="rounded text-purple-600 focus:ring-purple-500"
                />
                <span className="text-slate-700 dark:text-slate-300">Tanda Tangan Kepala Sekolah</span>
              </label>
            </div>

            <div className="text-xs text-slate-500 font-medium">
              Siswa ke-<strong>{currentStudentIndex + 1}</strong> dari <strong>{students.length}</strong>
            </div>
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* PRINTABLE OFFICIAL COVER & BIODATA SHEET CONTAINER                        */}
      {/* ========================================================================= */}
      <div
        id="printable-official-document"
        className="mx-auto max-w-4xl rounded-2xl bg-white p-6 sm:p-10 text-black shadow-xl border border-slate-200 print:max-w-none print:border-none print:shadow-none print:p-0 print:m-0"
      >
        {batchPrintStudents && batchPrintStudents.length > 0 ? (
          batchPrintStudents.map((s, idx) => (
            <StudentCoverAndBiodataSheet
              key={s.id}
              student={s}
              settings={settings}
              isPageBreakAfter={idx < batchPrintStudents.length - 1}
            />
          ))
        ) : (
          <StudentCoverAndBiodataSheet
            student={selectedStudent}
            settings={settings}
          />
        )}
      </div>

      {/* ========================================================================= */}
      {/* FOOTER ACTION BAR DI BAWAH PREVIEW DOKUMEN                                */}
      {/* ========================================================================= */}
      <div className="mx-auto max-w-4xl rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3 print:hidden">
        <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
          <FileCheck className="h-4 w-4 text-purple-600" />
          <span>Sampul & Biodata <strong>{selectedStudent.nama}</strong> ({selectedFrame.label}) siap dicetak.</span>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            type="button"
            onClick={handlePrintSingle}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 active:scale-95 text-white font-extrabold text-xs shadow-sm transition-all"
          >
            <Printer className="h-4 w-4" />
            <span>Cetak Dokumen Ini</span>
          </button>

          {currentStudentIndex < students.length - 1 && (
            <button
              type="button"
              onClick={handleNextStudent}
              className="flex items-center justify-center gap-1 px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              <span>Siswa Berikutnya</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Modal Edit Biodata Siswa */}
      {isEditModalOpen && selectedStudent && (
        <ModalEditBiodataSiswa
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          student={selectedStudent}
        />
      )}

      {/* Modal Cetak Massal Sampul & Biodata */}
      {isBatchModalOpen && (
        <ModalCetakMassalSampul
          isOpen={isBatchModalOpen}
          onClose={() => setIsBatchModalOpen(false)}
          onStartBatchPrint={handleStartBatchPrint}
          defaultSettings={settings}
        />
      )}

    </div>
  );
};
