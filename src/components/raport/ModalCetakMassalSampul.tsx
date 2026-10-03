import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Student } from '../../types';
import {
  CoverPrintSettings,
  CoverPageSection,
  CoverBorderStyle,
  CoverBorderColor
} from './StudentCoverAndBiodataSheet';
import {
  X,
  Printer,
  CheckSquare,
  Square,
  Layers,
  FileText,
  UserCheck,
  CheckCircle2,
  Info,
  Sparkles
} from 'lucide-react';

interface ModalCetakMassalSampulProps {
  isOpen: boolean;
  onClose: () => void;
  onStartBatchPrint: (selectedStudents: Student[], settings: CoverPrintSettings) => void;
  defaultSettings: CoverPrintSettings;
}

const FRAME_OPTIONS: { id: CoverBorderStyle; label: string; icon: string }[] = [
  { id: 'batik_nusantara', label: 'Batik Nusantara', icon: '🎨' },
  { id: 'classic', label: 'Klasik Kemdikbud', icon: '🏛️' },
  { id: 'certificate_royal', label: 'Sertifikat Royal', icon: '👑' },
  { id: 'geometric_art', label: 'Geometris Art Deco', icon: '💎' },
  { id: 'vintage_ornate', label: 'Vintage Floral', icon: '🌿' },
  { id: 'minimal_clean', label: 'Modern Minimalis', icon: '📐' }
];

const COLOR_OPTIONS: { id: CoverBorderColor; label: string; colorHex: string }[] = [
  { id: 'monochrome', label: 'Hitam Formal', colorHex: '#0f172a' },
  { id: 'navy', label: 'Biru Navy', colorHex: '#1e3a8a' },
  { id: 'gold', label: 'Emas Antik', colorHex: '#92400e' },
  { id: 'emerald', label: 'Hijau Zamrud', colorHex: '#065f46' }
];

export const ModalCetakMassalSampul: React.FC<ModalCetakMassalSampulProps> = ({
  isOpen,
  onClose,
  onStartBatchPrint,
  defaultSettings
}) => {
  const { students, schoolInfo } = useApp();

  const [selectedIds, setSelectedIds] = useState<string[]>(students.map(s => s.id));
  const [sortBy, setSortBy] = useState<'absen' | 'nama' | 'nisn'>('absen');
  const [settings, setSettings] = useState<CoverPrintSettings>(defaultSettings);

  if (!isOpen) return null;

  const handleToggleSelectAll = () => {
    if (selectedIds.length === students.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(students.map(s => s.id));
    }
  };

  const handleToggleStudent = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const sortedStudents = [...students].sort((a, b) => {
    if (sortBy === 'absen') return (a.nomorAbsen || 0) - (b.nomorAbsen || 0);
    if (sortBy === 'nama') return a.nama.localeCompare(b.nama);
    if (sortBy === 'nisn') return a.nisn.localeCompare(b.nisn);
    return 0;
  });

  const studentsToPrint = sortedStudents.filter(s => selectedIds.includes(s.id));

  const handleExecutePrint = () => {
    if (studentsToPrint.length === 0) return;
    onStartBatchPrint(studentsToPrint, settings);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300">
              <Printer className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                Cetak Massal Sampul & Biodata Siswa
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Kelas {schoolInfo.className} • {studentsToPrint.length} dari {students.length} Siswa Terpilih
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Pilihan Gaya Bingkai & Warna */}
          <div className="rounded-xl bg-purple-50/50 dark:bg-purple-950/20 p-4 border border-purple-200 dark:border-purple-800/50 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-purple-600" />
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-purple-900 dark:text-purple-200">
                  Gaya Bingkai & Warna Sampul
                </h3>
              </div>
              <div className="flex items-center gap-1.5">
                {COLOR_OPTIONS.map(c => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setSettings({ ...settings, coverBorderColor: c.id })}
                    className={`w-5 h-5 rounded-full border-2 transition-all ${
                      settings.coverBorderColor === c.id
                        ? 'border-purple-600 scale-110 ring-2 ring-purple-400/40'
                        : 'border-white dark:border-slate-800 opacity-60 hover:opacity-100'
                    }`}
                    style={{ backgroundColor: c.colorHex }}
                    title={c.label}
                  />
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {FRAME_OPTIONS.map(frame => {
                const isSelected = settings.coverStyle === frame.id;
                return (
                  <button
                    key={frame.id}
                    type="button"
                    onClick={() => setSettings({ ...settings, coverStyle: frame.id })}
                    className={`p-2 rounded-lg border text-left text-xs font-bold transition-all flex items-center gap-2 ${
                      isSelected
                        ? 'border-purple-600 bg-white dark:bg-slate-800 text-purple-700 dark:text-purple-300 shadow-xs'
                        : 'border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 hover:border-purple-300'
                    }`}
                  >
                    <span>{frame.icon}</span>
                    <span className="truncate">{frame.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Opsi Halaman yang Dicetak */}
          <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 p-4 border border-slate-200 dark:border-slate-700 space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Pilihan Lembar Dokumen yang Dicetak
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <label className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 cursor-pointer hover:border-purple-500 transition-colors">
                <input
                  type="radio"
                  name="coverSection"
                  checked={settings.section === 'all'}
                  onChange={() => setSettings({ ...settings, section: 'all' })}
                  className="text-purple-600 focus:ring-purple-500"
                />
                <div>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Semua Halaman (Lengkap)</p>
                  <p className="text-[10px] text-slate-500">Cover + Identitas Sekolah + Biodata</p>
                </div>
              </label>

              <label className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 cursor-pointer hover:border-purple-500 transition-colors">
                <input
                  type="radio"
                  name="coverSection"
                  checked={settings.section === 'cover'}
                  onChange={() => setSettings({ ...settings, section: 'cover' })}
                  className="text-purple-600 focus:ring-purple-500"
                />
                <div>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Hanya Cover Depan</p>
                  <p className="text-[10px] text-slate-500">Sampul luar judul & nama siswa</p>
                </div>
              </label>

              <label className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 cursor-pointer hover:border-purple-500 transition-colors">
                <input
                  type="radio"
                  name="coverSection"
                  checked={settings.section === 'biodata'}
                  onChange={() => setSettings({ ...settings, section: 'biodata' })}
                  className="text-purple-600 focus:ring-purple-500"
                />
                <div>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Hanya Biodata Siswa</p>
                  <p className="text-[10px] text-slate-500">Keterangan lengkap diri peserta didik</p>
                </div>
              </label>

              <label className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 cursor-pointer hover:border-purple-500 transition-colors">
                <input
                  type="radio"
                  name="coverSection"
                  checked={settings.section === 'school_identity'}
                  onChange={() => setSettings({ ...settings, section: 'school_identity' })}
                  className="text-purple-600 focus:ring-purple-500"
                />
                <div>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Hanya Identitas Sekolah</p>
                  <p className="text-[10px] text-slate-500">Profil & data satuan pendidikan</p>
                </div>
              </label>
            </div>

            {/* Opsi Tambahan */}
            <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex flex-wrap items-center gap-4 text-xs">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.showPhoto}
                  onChange={e => setSettings({ ...settings, showPhoto: e.target.checked })}
                  className="rounded text-purple-600 focus:ring-purple-500"
                />
                <span className="text-slate-700 dark:text-slate-300">Tampilkan Pas Foto 3x4</span>
              </label>
              
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.showSignature}
                  onChange={e => setSettings({ ...settings, showSignature: e.target.checked })}
                  className="rounded text-purple-600 focus:ring-purple-500"
                />
                <span className="text-slate-700 dark:text-slate-300">Tanda Tangan Kepala Sekolah</span>
              </label>
            </div>
          </div>

          {/* Daftar Siswa */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-slate-700 dark:text-slate-300">
                Pilih Peserta Didik ({selectedIds.length} Siswa)
              </span>
              <button
                type="button"
                onClick={handleToggleSelectAll}
                className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline"
              >
                {selectedIds.length === students.length ? 'Batal Pilih Semua' : 'Pilih Semua Siswa'}
              </button>
            </div>

            <div className="max-h-56 overflow-y-auto rounded-xl border border-slate-200 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900">
              {sortedStudents.map(student => {
                const isSelected = selectedIds.includes(student.id);
                return (
                  <div
                    key={student.id}
                    onClick={() => handleToggleStudent(student.id)}
                    className={`flex items-center justify-between p-2.5 px-3 cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-purple-50/50 dark:bg-purple-950/20'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-purple-600 dark:text-purple-400">
                        {isSelected ? <CheckSquare className="h-4 w-4" /> : <Square className="h-4 w-4 text-slate-400" />}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900 dark:text-white">
                          {student.nomorAbsen ? `${student.nomorAbsen}. ` : ''}{student.nama}
                        </p>
                        <p className="text-[10px] text-slate-500 font-mono">
                          NIS: {student.nis || '-'} • NISN: {student.nisn || '-'}
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      {student.jenisKelamin === 'L' ? 'L' : 'P'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-800 px-6 py-4 bg-slate-50 dark:bg-slate-900/80 rounded-b-2xl">
          <p className="text-xs text-slate-500">
            Total Dokumen: <strong>{studentsToPrint.length} Siswa</strong>
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleExecutePrint}
              disabled={studentsToPrint.length === 0}
              className="flex items-center gap-2 rounded-xl bg-purple-600 hover:bg-purple-700 active:scale-95 px-5 py-2 text-xs font-bold text-white shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Printer className="h-4 w-4" />
              <span>Cetak {studentsToPrint.length} Dokumen</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
