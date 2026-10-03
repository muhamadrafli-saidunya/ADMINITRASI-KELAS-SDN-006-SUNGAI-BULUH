import React, { useState } from 'react';
import { ModulAjar, SchoolInfo, TeachingJournal } from '../../types';
import { ModulPrintView } from './ModulPrintView';
import {
  X,
  Printer,
  FileText,
  Copy,
  Edit,
  Sparkles,
  ClipboardList,
  CheckCircle2,
  Calendar,
  Layers,
  BookOpen,
  Share2,
  Award,
  ChevronRight
} from 'lucide-react';

interface ModulDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  modul: ModulAjar | null;
  schoolInfo: SchoolInfo;
  onEdit: (modul: ModulAjar) => void;
  onDuplicate: (id: string) => void;
  onAddJournalFromModul?: (journal: Omit<TeachingJournal, 'id'>) => void;
}

export const ModulDetailModal: React.FC<ModulDetailModalProps> = ({
  isOpen,
  onClose,
  modul,
  schoolInfo,
  onEdit,
  onDuplicate,
  onAddJournalFromModul
}) => {
  const [viewMode, setViewMode] = useState<'official' | 'skenario' | 'asesmen' | 'lkpd'>('official');

  if (!isOpen || !modul) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCreateJournalEntry = () => {
    if (onAddJournalFromModul) {
      const today = new Date().toISOString().split('T')[0];
      onAddJournalFromModul({
        tanggal: today,
        jamKe: 1,
        mataPelajaran: modul.mataPelajaran,
        kelas: modul.kelas,
        materi: modul.judul,
        tujuanPembelajaran: modul.tujuanPembelajaran?.[0] || modul.capaianPembelajaran || '',
        kegiatan: `${modul.kegiatanPembelajaran?.pendahuluan?.[0]?.deskripsi || ''} dilanjutkan ${modul.kegiatanPembelajaran?.inti?.[0]?.deskripsi || ''}`,
        penilaian: modul.asesmen?.formatif || 'Penilaian unjuk kerja & LKPD',
        hambatan: '',
        pemecahanMasalah: '',
        guruPengampu: modul.penyusun
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto">
      <div className="bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-5xl max-h-[95vh] shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Top Sticky Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900 no-print">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-600 text-white shadow-sm">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                  {modul.fase} • Kelas {modul.kelas}
                </span>
                <span className="text-[11px] font-mono text-slate-500">
                  {modul.kodeModul}
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 line-clamp-1 mt-0.5">
                {modul.judul}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onEdit(modul);
                onClose();
              }}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold"
            >
              <Edit className="h-3.5 w-3.5" /> Edit
            </button>
            <button
              onClick={() => onDuplicate(modul.id)}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold"
            >
              <Copy className="h-3.5 w-3.5" /> Duplikat
            </button>
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm transition-all"
            >
              <Printer className="h-4 w-4" /> Cetak / Simpan PDF
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* View Switcher Sub-Tabs */}
        <div className="px-6 py-2.5 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 overflow-x-auto no-print">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setViewMode('official')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'official'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800'
              }`}
            >
              📄 Dokumen Resmi Lengkap (Kop & TTD)
            </button>
            <button
              onClick={() => setViewMode('skenario')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'skenario'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800'
              }`}
            >
              ⏱️ Skenario & Diferensiasi
            </button>
            <button
              onClick={() => setViewMode('asesmen')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'asesmen'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800'
              }`}
            >
              📊 Rubrik Asesmen & Remedial
            </button>
            <button
              onClick={() => setViewMode('lkpd')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'lkpd'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800'
              }`}
            >
              📝 Lembar Kerja Siswa (LKPD Siap Cetak)
            </button>
          </div>

          {onAddJournalFromModul && (
            <button
              onClick={handleCreateJournalEntry}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline shrink-0"
              title="Salin isi modul ini ke Jurnal Mengajar Harian Guru"
            >
              <Sparkles className="h-3.5 w-3.5" /> Catat ke Jurnal Guru
            </button>
          )}
        </div>

        {/* Document Content Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8">
          {viewMode === 'official' && (
            <ModulPrintView modul={modul} schoolInfo={schoolInfo} onPrint={handlePrint} printMode="full" />
          )}

          {viewMode === 'lkpd' && (
            <div className="max-w-4xl mx-auto shadow-md rounded-2xl overflow-hidden border border-slate-200">
              <ModulPrintView modul={modul} schoolInfo={schoolInfo} onPrint={handlePrint} printMode="lkpd_only" />
            </div>
          )}

          {viewMode === 'skenario' && (
            <div className="max-w-4xl mx-auto space-y-6">
              {/* Timeline Header Card */}
              <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <Layers className="h-5 w-5 text-indigo-600" />
                    Detail Skenario Pembelajaran Berdiferensiasi
                  </h3>
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                    Model: {modul.modelPembelajaran}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <p className="font-bold text-slate-700 dark:text-slate-300 mb-1">💡 Pemahaman Bermakna</p>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{modul.pemahamanBermakna}</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <p className="font-bold text-slate-700 dark:text-slate-300 mb-1">❓ Pertanyaan Pemantik</p>
                    <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-300">
                      {modul.pertanyaanPemantik?.map((pm, i) => (
                        <li key={i}>{pm}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Skenario Breakdown Cards */}
              <div className="space-y-4">
                {/* 1. Pendahuluan */}
                <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-blue-200 dark:border-blue-900 shadow-sm">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-3">
                    <span className="font-bold text-blue-900 dark:text-blue-300 text-sm">
                      1. Kegiatan Pendahuluan
                    </span>
                    <span className="text-xs font-semibold bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 px-2.5 py-0.5 rounded-full">
                      10 - 15 Menit
                    </span>
                  </div>
                  <div className="space-y-2.5 text-xs">
                    {modul.kegiatanPembelajaran?.pendahuluan?.map((k, idx) => (
                      <div key={idx} className="flex gap-3 items-start p-2.5 rounded-lg bg-blue-50/40 dark:bg-blue-950/20">
                        <span className="h-5 w-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                          {idx + 1}
                        </span>
                        <div>
                          {k.sintaks && <span className="font-bold text-slate-900 dark:text-slate-100">{k.sintaks}: </span>}
                          <span className="text-slate-700 dark:text-slate-300">{k.deskripsi}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. Inti */}
                <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-900 shadow-sm">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-3">
                    <span className="font-bold text-emerald-900 dark:text-emerald-300 text-sm">
                      2. Kegiatan Inti (Sintaks & Diferensiasi)
                    </span>
                    <span className="text-xs font-semibold bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 px-2.5 py-0.5 rounded-full">
                      50 - 70 Menit
                    </span>
                  </div>
                  <div className="space-y-3 text-xs">
                    {modul.kegiatanPembelajaran?.inti?.map((k, idx) => (
                      <div key={idx} className="p-3.5 rounded-xl border border-emerald-100 dark:border-emerald-900/60 bg-emerald-50/30 dark:bg-emerald-950/20 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-emerald-950 dark:text-emerald-200">
                            {idx + 1}. {k.sintaks || `Langkah ${idx + 1}`}
                          </span>
                          {k.menit && (
                            <span className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400">
                              {k.menit} Menit
                            </span>
                          )}
                        </div>
                        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{k.deskripsi}</p>
                        {k.diferensiasi && (
                          <div className="p-2 rounded-lg bg-emerald-100/70 dark:bg-emerald-900/40 text-emerald-900 dark:text-emerald-200 text-[11px] font-medium mt-2">
                            🌱 <strong>Diferensiasi:</strong> {k.diferensiasi}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. Penutup */}
                <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-900 shadow-sm">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-3">
                    <span className="font-bold text-purple-900 dark:text-purple-300 text-sm">
                      3. Kegiatan Penutup & Refleksi
                    </span>
                    <span className="text-xs font-semibold bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 px-2.5 py-0.5 rounded-full">
                      10 - 15 Menit
                    </span>
                  </div>
                  <div className="space-y-2.5 text-xs">
                    {modul.kegiatanPembelajaran?.penutup?.map((k, idx) => (
                      <div key={idx} className="flex gap-3 items-start p-2.5 rounded-lg bg-purple-50/40 dark:bg-purple-950/20">
                        <span className="h-5 w-5 rounded-full bg-purple-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                          {idx + 1}
                        </span>
                        <div>
                          {k.sintaks && <span className="font-bold text-slate-900 dark:text-slate-100">{k.sintaks}: </span>}
                          <span className="text-slate-700 dark:text-slate-300">{k.deskripsi}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {viewMode === 'asesmen' && (
            <div className="max-w-4xl mx-auto space-y-6">
              {/* Asesmen Triad */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-900 shadow-sm space-y-2">
                  <span className="inline-block px-2.5 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold text-xs">
                    1. Asesmen Diagnostik
                  </span>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                    {modul.asesmen?.diagnostik || 'Tanya jawab awal pembelajaran untuk memetakan kesiapan peserta didik.'}
                  </p>
                </div>
                <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-900 shadow-sm space-y-2">
                  <span className="inline-block px-2.5 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-xs">
                    2. Asesmen Formatif
                  </span>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                    {modul.asesmen?.formatif || 'Observasi performa diskusi, ketepatan LKPD, dan keaktifan kelas.'}
                  </p>
                </div>
                <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-900 shadow-sm space-y-2">
                  <span className="inline-block px-2.5 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-bold text-xs">
                    3. Asesmen Sumatif
                  </span>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                    {modul.asesmen?.sumatif || 'Tes tertulis dan tugas presentasi akhir modul pembelajaran.'}
                  </p>
                </div>
              </div>

              {/* Remedial & Pengayaan */}
              <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
                  <Award className="h-4 w-4 text-amber-500" />
                  Rencana Tindak Lanjut: Remedial dan Pengayaan
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <p className="font-bold text-rose-700 dark:text-rose-400 mb-1">📘 Program Remedial</p>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                      {modul.remedialDanPengayaan?.remedial}
                    </p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <p className="font-bold text-indigo-700 dark:text-indigo-400 mb-1">🚀 Program Pengayaan</p>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                      {modul.remedialDanPengayaan?.pengayaan}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
