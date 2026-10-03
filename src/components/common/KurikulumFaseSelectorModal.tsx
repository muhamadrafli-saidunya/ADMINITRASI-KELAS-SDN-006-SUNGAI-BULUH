import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  CURRICULUM_PHASE_PRESETS,
  CurriculumPhaseKey,
  detectPhaseKey
} from '../../data/kurikulumMerdekaPresets';
import { Modal } from './Modal';
import {
  GraduationCap,
  Sparkles,
  CheckCircle2,
  BookOpen,
  Layers,
  ChevronRight,
  Calculator,
  Compass,
  HeartHandshake,
  Activity,
  Palette,
  Languages,
  ShieldCheck,
  Building2,
  HelpCircle,
  FileCheck2,
  ArrowRight,
  Check
} from 'lucide-react';

interface KurikulumFaseSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPhaseKey?: CurriculumPhaseKey;
}

export const KurikulumFaseSelectorModal: React.FC<KurikulumFaseSelectorModalProps> = ({
  isOpen,
  onClose,
  initialPhaseKey
}) => {
  const { schoolInfo, applyCurriculumPhasePreset, students } = useApp();

  const currentDetectedKey = detectPhaseKey(schoolInfo?.phase);
  const [selectedPhaseKey, setSelectedPhaseKey] = useState<CurriculumPhaseKey>(
    initialPhaseKey || currentDetectedKey || 'fase_b'
  );

  const [activeTabPreview, setActiveTabPreview] = useState<'mapel' | 'tp' | 'overview'>('overview');
  const [updateClassName, setUpdateClassName] = useState<boolean>(true);
  const [regenerateGrades, setRegenerateGrades] = useState<boolean>(true);
  const [isApplying, setIsApplying] = useState<boolean>(false);

  const selectedPreset = CURRICULUM_PHASE_PRESETS[selectedPhaseKey];

  const handleApply = () => {
    setIsApplying(true);
    setTimeout(() => {
      applyCurriculumPhasePreset(selectedPhaseKey, {
        updateSchoolInfo: true,
        regenerateGrades: regenerateGrades,
        customClassName: updateClassName ? selectedPreset.defaultClassName : undefined
      });
      setIsApplying(false);
      onClose();
    }, 400);
  };

  const getMapelIcon = (iconName: string) => {
    switch (iconName) {
      case 'HeartHandshake':
        return <HeartHandshake className="h-4 w-4 text-emerald-500" />;
      case 'ShieldCheck':
        return <ShieldCheck className="h-4 w-4 text-amber-500" />;
      case 'BookOpen':
        return <BookOpen className="h-4 w-4 text-blue-500" />;
      case 'Calculator':
        return <Calculator className="h-4 w-4 text-indigo-500" />;
      case 'Compass':
        return <Compass className="h-4 w-4 text-cyan-500" />;
      case 'Activity':
        return <Activity className="h-4 w-4 text-rose-500" />;
      case 'Palette':
        return <Palette className="h-4 w-4 text-purple-500" />;
      case 'Languages':
        return <Languages className="h-4 w-4 text-pink-500" />;
      case 'Building2':
        return <Building2 className="h-4 w-4 text-teal-500" />;
      default:
        return <BookOpen className="h-4 w-4 text-blue-500" />;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Penyesuaian Otomatis Fase Kurikulum Merdeka"
      size="xl"
    >
      <div className="space-y-5">
        {/* Banner Penjelasan */}
        <div className="rounded-2xl border border-indigo-200 dark:border-indigo-900/60 bg-gradient-to-r from-indigo-50 via-blue-50 to-sky-50 dark:from-indigo-950/40 dark:via-blue-950/30 dark:to-slate-900 p-4 sm:p-5">
          <div className="flex items-start gap-3.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-600/20">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                Sinkronisasi Otomatis Mata Pelajaran, TP, & Nilai Rapor
              </h4>
              <p className="mt-1 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Pilih fase Kurikulum Merdeka yang diinginkan. Sistem akan secara otomatis mengonfigurasi struktur 
                mata pelajaran resmi, daftar Tujuan Pembelajaran (TP) standar Kemendikbudristek, serta menyusun nilai formatif/sumatif 
                dan deskripsi capaian rapor seluruh siswa.
              </p>
            </div>
          </div>
        </div>

        {/* Pilihan 4 Fase Kurikulum Merdeka */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
            Pilih Fase Kurikulum Merdeka Target:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {(Object.keys(CURRICULUM_PHASE_PRESETS) as CurriculumPhaseKey[]).map(key => {
              const preset = CURRICULUM_PHASE_PRESETS[key];
              const isSelected = selectedPhaseKey === key;
              const isCurrentlyActive = currentDetectedKey === key;

              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSelectedPhaseKey(key)}
                  className={`relative p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/50 ring-2 ring-indigo-600/30 dark:ring-indigo-500/30 shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-300 dark:hover:border-indigo-800'
                  }`}
                >
                  {isCurrentlyActive && (
                    <span className="absolute -top-2.5 right-3 px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-emerald-600 text-white shadow-xs">
                      Fase Aktif Saat Ini
                    </span>
                  )}

                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-xl">{preset.icon}</span>
                      <h5 className="text-xs font-bold text-slate-900 dark:text-white">
                        {preset.shortLabel}
                      </h5>
                    </div>
                    <p className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 mb-1">
                      {preset.gradeLevels}
                    </p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {preset.description}
                    </p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-500">
                    <span>{preset.subjects.length} Mapel</span>
                    <span>{preset.tujuanPembelajaran.length} TP</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Detail Preview Fase Terpilih */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-5">
          <div className="flex items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-lg">{selectedPreset.icon}</span>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                  Pratinjau: {selectedPreset.label}
                </h4>
                <p className="text-[11px] text-slate-500">
                  {selectedPreset.subjects.length} Mata Pelajaran &bull; {selectedPreset.tujuanPembelajaran.length} Tujuan Pembelajaran
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setActiveTabPreview('overview')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTabPreview === 'overview'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Ikhtisar
              </button>
              <button
                type="button"
                onClick={() => setActiveTabPreview('mapel')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTabPreview === 'mapel'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Mata Pelajaran ({selectedPreset.subjects.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTabPreview('tp')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTabPreview === 'tp'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Bank TP ({selectedPreset.tujuanPembelajaran.length})
              </button>
            </div>
          </div>

          <div className="mt-4">
            {/* 1. Overview */}
            {activeTabPreview === 'overview' && (
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 p-3">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      Target Rombel / Kelas
                    </span>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      {selectedPreset.defaultClassName}
                    </span>
                  </div>

                  <div className="rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 p-3">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      Karakteristik Kurikulum
                    </span>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      {selectedPreset.shortLabel === 'Fase A' && 'Tanpa IPAS terpisah (Fondasi Literasi/Numerasi)'}
                      {selectedPreset.shortLabel === 'Fase B' && 'IPAS Terpadu & Pecahan Senilai'}
                      {selectedPreset.shortLabel === 'Fase C' && 'IPAS Tingkat Lanjut & Eksplanasi Ilmiah'}
                      {selectedPreset.shortLabel === 'Fase D' && 'IPA & IPS Terpisah + Informatika'}
                    </span>
                  </div>

                  <div className="rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 p-3">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      Siswa Terdampak Sinkronisasi
                    </span>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      {students.length} Siswa Aktif
                    </span>
                  </div>
                </div>

                <div className="rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/60 dark:bg-amber-950/30 p-3 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2">
                  <FileCheck2 className="h-4 w-4 shrink-0 mt-0.5 text-amber-600" />
                  <div>
                    <strong className="font-bold">Dampak Perubahan:</strong> Saat diterapkan, daftar mata pelajaran dan TP di 
                    menu <em>Penilaian</em>, <em>Leger Nilai</em>, dan <em>Rapor Siswa</em> akan otomatis diperbarui dan 
                    dihitung ulang menggunakan kompetensi {selectedPreset.label}.
                  </div>
                </div>
              </div>
            )}

            {/* 2. Mata Pelajaran List */}
            {activeTabPreview === 'mapel' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-60 overflow-y-auto pr-1">
                {selectedPreset.subjects.map((sub, idx) => (
                  <div
                    key={sub.id}
                    className="flex items-center gap-2.5 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/50"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white dark:bg-slate-700 shadow-xs">
                      {getMapelIcon(sub.iconName)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[11px] font-bold text-slate-900 dark:text-white truncate">
                          {sub.nama}
                        </span>
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300">
                          {sub.kode}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-slate-500">
                        <span>KKTP: {sub.kktp}</span>
                        <span>&bull;</span>
                        <span>{sub.kelompok}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 3. TP List */}
            {activeTabPreview === 'tp' && (
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {selectedPreset.tujuanPembelajaran.slice(0, 8).map((tp, idx) => {
                  const mapelObj = selectedPreset.subjects.find(s => s.id === tp.mapelId);
                  return (
                    <div
                      key={`${tp.id}-${idx}`}
                      className="p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/50 text-xs"
                    >
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="font-bold text-indigo-600 dark:text-indigo-400 text-[11px]">
                          [{mapelObj?.kode || 'MP'}] {tp.kode}: {tp.lingkupMateri}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {tp.semester}
                        </span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                        {tp.deskripsi}
                      </p>
                      {tp.ringkasanRaporTuntas && (
                        <div className="mt-1 text-[10px] text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                          <Check className="h-3 w-3" />
                          <span className="truncate">Rapor Tuntas: {tp.ringkasanRaporTuntas}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
                {selectedPreset.tujuanPembelajaran.length > 8 && (
                  <p className="text-center text-[11px] text-slate-400 py-1 italic">
                    ... dan {selectedPreset.tujuanPembelajaran.length - 8} Tujuan Pembelajaran lainnya.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Opsi Tambahan Sebelum Menerapkan */}
        <div className="space-y-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/50 p-4">
          <h5 className="text-xs font-bold text-slate-800 dark:text-slate-200">
            Opsi Otomatisasi:
          </h5>

          <label className="flex items-start gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={updateClassName}
              onChange={e => setUpdateClassName(e.target.checked)}
              className="rounded mt-0.5 border-slate-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
            />
            <div>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Sesuaikan nama rombel/kelas menjadi "{selectedPreset.defaultClassName}"
              </span>
              <p className="text-[11px] text-slate-500">
                Otomatis memperbarui kolom nama kelas di profil sekolah dan lembar cetak rapor.
              </p>
            </div>
          </label>

          <label className="flex items-start gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={regenerateGrades}
              onChange={e => setRegenerateGrades(e.target.checked)}
              className="rounded mt-0.5 border-indigo-600 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
            />
            <div>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Generate nilai formatif, sumatif STS/SAS & narasi rapor otomatis untuk seluruh siswa ({students.length} siswa)
              </span>
              <p className="text-[11px] text-slate-500">
                Memastikan tidak ada nilai kosong dan seluruh leger rapor langsung terisi rapi dengan variasi nilai yang wajar.
              </p>
            </div>
          </label>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            disabled={isApplying}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleApply}
            disabled={isApplying}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition-all disabled:opacity-50"
          >
            {isApplying ? (
              <>
                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Menerapkan Fase...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                <span>Terapkan {selectedPreset.shortLabel} & Sinkronkan Otomatis</span>
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};
