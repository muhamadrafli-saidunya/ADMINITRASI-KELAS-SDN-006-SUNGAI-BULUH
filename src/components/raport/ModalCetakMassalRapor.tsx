import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Student } from '../../types';
import { PrintSettings } from './StudentReportCardSheet';
import {
  X,
  Printer,
  CheckSquare,
  Square,
  Settings,
  Layers,
  ArrowUpDown,
  FileText,
  CheckCircle2,
  Info,
  UserCheck,
  Calendar,
  Users
} from 'lucide-react';

interface ModalCetakMassalRaporProps {
  isOpen: boolean;
  onClose: () => void;
  onStartBatchPrint: (selectedStudents: Student[], settings: PrintSettings) => void;
  defaultSettings: PrintSettings;
}

export const ModalCetakMassalRapor: React.FC<ModalCetakMassalRaporProps> = ({
  isOpen,
  onClose,
  onStartBatchPrint,
  defaultSettings
}) => {
  const { students, schoolInfo, updateGlobalReportDate } = useApp();

  const [selectedIds, setSelectedIds] = useState<string[]>(students.map(s => s.id));
  const [sortBy, setSortBy] = useState<'absen' | 'nama' | 'nisn'>('absen');
  const [settings, setSettings] = useState<PrintSettings>({
    ...defaultSettings,
    parentSignatureChoice: defaultSettings?.parentSignatureChoice || 'ayah',
    showMidDeskripsi: defaultSettings?.showMidDeskripsi !== false
  });

  const activeDefaultDate = settings.reportType === 'mid_semester'
    ? (schoolInfo.tanggalRaporMid || `${schoolInfo.city || 'Kota Jakarta Selatan'}, 10 Oktober 2026`)
    : (schoolInfo.tanggalRapor || `${schoolInfo.city || 'Kota Jakarta Selatan'}, 20 Juni 2027`);

  const [customReportDate, setCustomReportDate] = useState<string>(activeDefaultDate);

  // Sync date if report type toggled
  const handleSelectReportType = (type: 'semester' | 'mid_semester') => {
    setSettings({ ...settings, reportType: type });
    if (type === 'mid_semester') {
      setCustomReportDate(schoolInfo.tanggalRaporMid || `${schoolInfo.city || 'Kota Jakarta Selatan'}, 10 Oktober 2026`);
    } else {
      setCustomReportDate(schoolInfo.tanggalRapor || `${schoolInfo.city || 'Kota Jakarta Selatan'}, 20 Juni 2027`);
    }
  };

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

  // Sort students according to selected criterion
  const sortedStudents = [...students].sort((a, b) => {
    if (sortBy === 'absen') {
      return (a.nomorAbsen || 0) - (b.nomorAbsen || 0);
    }
    if (sortBy === 'nama') {
      return a.nama.localeCompare(b.nama);
    }
    if (sortBy === 'nisn') {
      return a.nisn.localeCompare(b.nisn);
    }
    return 0;
  });

  const studentsToPrint = sortedStudents.filter(s => selectedIds.includes(s.id));

  const handleExecutePrint = () => {
    if (studentsToPrint.length === 0) return;
    if (customReportDate.trim()) {
      updateGlobalReportDate(
        settings.reportType === 'mid_semester' ? 'mid' : 'semester',
        customReportDate.trim()
      );
    }
    onStartBatchPrint(studentsToPrint, settings);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
              <Printer className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                Cetak Rapor Massal (Seluruh Kelas)
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Kelas {schoolInfo.className} • Tahun Ajaran {schoolInfo.academicYear}
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

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 custom-scrollbar">
          {/* Info Notice */}
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-200 text-xs">
            <Info className="h-4 w-4 shrink-0 text-blue-600 mt-0.5" />
            <p className="leading-relaxed">
              Fitur ini akan merender lembar rapor untuk seluruh siswa yang dipilih dalam satu dokumen cetak berurutan. Masing-masing siswa otomatis terpisah dengan pemisah halaman (*page-break*) sehingga siap dicetak ke printer atau disimpan sebagai satu file PDF utuh.
            </p>
          </div>

          {/* Print Options & Layout Settings */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-4 bg-slate-50/60 dark:bg-slate-800/40 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-900 dark:text-white">
              <div className="flex items-center gap-2">
                <Settings className="h-4 w-4 text-blue-600" />
                <span>Opsi & Tata Letak Cetak</span>
              </div>
            </div>

            {/* Pilihan Jenis Rapor */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Jenis Dokumen Rapor:
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleSelectReportType('semester')}
                  className={`flex items-center justify-center gap-2 p-2 rounded-xl text-xs font-bold border transition-all ${
                    settings.reportType !== 'mid_semester'
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/60 text-blue-900 dark:text-blue-200 shadow-xs'
                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                  }`}
                >
                  <FileText className="h-4 w-4 text-blue-600" />
                  <span>Rapor Akhir Semester (SAS)</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectReportType('mid_semester')}
                  className={`flex items-center justify-center gap-2 p-2 rounded-xl text-xs font-bold border transition-all ${
                    settings.reportType === 'mid_semester'
                      ? 'border-amber-600 bg-amber-50 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 shadow-xs'
                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                  }`}
                >
                  <FileText className="h-4 w-4 text-amber-600" />
                  <span>Rapor Mid Semester (ASTS)</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Ukuran Kertas:
                </label>
                <select
                  value={settings.paperSize}
                  onChange={e => setSettings({ ...settings, paperSize: e.target.value as 'A4' | 'F4' })}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="A4">A4 (21.0 x 29.7 cm) - Standar</option>
                  <option value="F4">F4 / Folio (21.5 x 33.0 cm)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Kerapatan Lembar / Ukuran Font:
                </label>
                <select
                  value={settings.density}
                  onChange={e => setSettings({ ...settings, density: e.target.value as 'normal' | 'compact' | 'spacious' })}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="normal">Normal (Standar Kurikulum)</option>
                  <option value="compact">Padat / Ramping (Hemat Kertas)</option>
                  <option value="spacious">Lebar / Longgar</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-200 dark:border-slate-700 text-xs">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={settings.showKop}
                  onChange={e => setSettings({ ...settings, showKop: e.target.checked })}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <span className="text-slate-700 dark:text-slate-300 text-[11.5px]">
                  Cetak Kop Sekolah
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={settings.showRanking}
                  onChange={e => setSettings({ ...settings, showRanking: e.target.checked })}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <span className="text-slate-700 dark:text-slate-300 text-[11.5px]">
                  Cetak Ranking Kelas
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={settings.showSignature}
                  onChange={e => setSettings({ ...settings, showSignature: e.target.checked })}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <span className="text-slate-700 dark:text-slate-300 text-[11.5px]">
                  Cetak Tanda Tangan
                </span>
              </label>
            </div>

            {/* Opsi Khusus Rapor Mid Semester: Toggle Deskripsi Capaian */}
            {settings.reportType === 'mid_semester' && (
              <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                <label className="flex items-start gap-2.5 p-2.5 rounded-xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={settings.showMidDeskripsi !== false}
                    onChange={e => setSettings({ ...settings, showMidDeskripsi: e.target.checked })}
                    className="rounded text-amber-600 focus:ring-amber-500 mt-0.5"
                  />
                  <div>
                    <span className="font-bold text-xs text-amber-900 dark:text-amber-200 block">
                      Cetak Kolom Deskripsi Capaian Pembelajaran Mendalam
                    </span>
                    <span className="text-[11px] text-amber-700 dark:text-amber-300 block mt-0.5">
                      Hilangkan centang jika ingin mencetak format ringkas (hanya tabel nilai tanpa uraian deskripsi panjang).
                    </span>
                  </div>
                </label>
              </div>
            )}

            {/* Pilihan Nama Orang Tua pada Tanda Tangan Cetak Massal */}
            {settings.showSignature && (
              <div className="pt-2.5 mt-2 border-t border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl">
                <div>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <UserCheck className="h-4 w-4 text-blue-600" />
                    <span>Nama Orang Tua pada Kolom Tanda Tangan:</span>
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">
                    Pilih nama yang otomatis dicetak pada lembar rapor seluruh siswa yang dipilih
                  </span>
                </div>
                <div className="inline-flex rounded-xl p-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs shrink-0 shadow-2xs">
                  <button
                    type="button"
                    onClick={() => setSettings({ ...settings, parentSignatureChoice: 'ayah' })}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      (settings.parentSignatureChoice || 'ayah') === 'ayah'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    Nama Ayah
                  </button>
                  <button
                    type="button"
                    onClick={() => setSettings({ ...settings, parentSignatureChoice: 'ibu' })}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      settings.parentSignatureChoice === 'ibu'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    Nama Ibu
                  </button>
                  <button
                    type="button"
                    onClick={() => setSettings({ ...settings, parentSignatureChoice: 'dots' })}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      settings.parentSignatureChoice === 'dots'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    Titik-titik (Manual)
                  </button>
                </div>
              </div>
            )}

            {/* Tempat & Tanggal Rapor (Titimangsa Cetak Massal - Berlaku untuk Seluruh Siswa) */}
            <div className="pt-2.5 mt-2 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl space-y-2">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <span>Tempat & Tanggal Pengesahan Rapor (Titimangsa):</span>
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-200">
                  <Users className="h-3 w-3" />
                  <span>Berlaku Semua Siswa yang Dicetak</span>
                </span>
              </div>
              <div>
                <input
                  type="text"
                  value={customReportDate}
                  onChange={e => setCustomReportDate(e.target.value)}
                  placeholder="Contoh: Kota Jakarta Selatan, 20 Juni 2027"
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Student Selection List */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleToggleSelectAll}
                  className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-bold transition-colors"
                >
                  {selectedIds.length === students.length ? (
                    <>
                      <CheckSquare className="h-3.5 w-3.5 text-blue-600" />
                      <span>Batal Pilih Semua</span>
                    </>
                  ) : (
                    <>
                      <Square className="h-3.5 w-3.5" />
                      <span>Pilih Semua ({students.length})</span>
                    </>
                  )}
                </button>

                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Terpilih: <strong className="text-blue-600 dark:text-blue-400">{selectedIds.length}</strong> dari {students.length} siswa
                </span>
              </div>

              {/* Sort selector */}
              <div className="flex items-center gap-1 text-xs">
                <ArrowUpDown className="h-3.5 w-3.5 text-slate-400" />
                <span className="text-slate-500">Urutkan:</span>
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value as any)}
                  className="px-2 py-0.5 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-[11px] font-semibold text-slate-800 dark:text-slate-200 outline-none"
                >
                  <option value="absen">Nomor Absen</option>
                  <option value="nama">Nama (A-Z)</option>
                  <option value="nisn">NISN</option>
                </select>
              </div>
            </div>

            {/* List Table */}
            <div className="max-h-60 overflow-y-auto rounded-xl border border-slate-200 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800 custom-scrollbar">
              {sortedStudents.map((s, idx) => {
                const isChecked = selectedIds.includes(s.id);
                return (
                  <label
                    key={s.id}
                    className={`flex items-center justify-between p-2.5 cursor-pointer transition-colors ${
                      isChecked
                        ? 'bg-blue-50/40 dark:bg-blue-950/20'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/50 opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleToggleStudent(s.id)}
                        className="rounded text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-xs font-mono text-slate-400 w-6">
                        #{s.nomorAbsen || idx + 1}
                      </span>
                      <div>
                        <p className="text-xs font-bold text-slate-900 dark:text-white">
                          {s.nama}
                        </p>
                        <p className="text-[10.5px] font-mono text-slate-500">
                          NISN: {s.nisn} • {s.jenisKelamin === 'L' ? 'Laki-laki' : 'Perempuan'}
                        </p>
                      </div>
                    </div>

                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold">
                      Hal {idx + 1}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-800 px-6 py-4 bg-slate-50/80 dark:bg-slate-800/50 rounded-b-2xl">
          <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
            <Layers className="h-4 w-4 text-blue-600" />
            <span>Total Dokumen: <strong>{studentsToPrint.length} Lembar Rapor</strong></span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              Batal
            </button>
            <button
              type="button"
              disabled={studentsToPrint.length === 0}
              onClick={handleExecutePrint}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-extrabold shadow-md shadow-blue-500/20 disabled:opacity-50 disabled:pointer-events-none transition-all"
            >
              <Printer className="h-4 w-4" />
              <span>Buka Dialog Cetak ({studentsToPrint.length} Siswa)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
