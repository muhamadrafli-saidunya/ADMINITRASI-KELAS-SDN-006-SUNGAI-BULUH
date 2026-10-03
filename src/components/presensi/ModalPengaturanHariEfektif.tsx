import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import {
  CalendarDays,
  Check,
  Sparkles,
  Info,
  Calendar,
  Clock,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

interface ModalPengaturanHariEfektifProps {
  isOpen: boolean;
  onClose: () => void;
  selectedMonth?: string;
}

const ALL_DAYS: Array<{ id: string; label: string; fullLabel: string; weekendByDefault5: boolean; weekendByDefault6: boolean }> = [
  { id: 'Senin', label: 'Sen', fullLabel: 'Senin', weekendByDefault5: false, weekendByDefault6: false },
  { id: 'Selasa', label: 'Sel', fullLabel: 'Selasa', weekendByDefault5: false, weekendByDefault6: false },
  { id: 'Rabu', label: 'Rab', fullLabel: 'Rabu', weekendByDefault5: false, weekendByDefault6: false },
  { id: 'Kamis', label: 'Kam', fullLabel: 'Kamis', weekendByDefault5: false, weekendByDefault6: false },
  { id: 'Jumat', label: 'Jum', fullLabel: 'Jumat', weekendByDefault5: false, weekendByDefault6: false },
  { id: 'Sabtu', label: 'Sab', fullLabel: 'Sabtu', weekendByDefault5: true, weekendByDefault6: false },
  { id: 'Minggu', label: 'Min', fullLabel: 'Minggu', weekendByDefault5: true, weekendByDefault6: true }
];

export const ModalPengaturanHariEfektif: React.FC<ModalPengaturanHariEfektifProps> = ({
  isOpen,
  onClose,
  selectedMonth = '2026-08'
}) => {
  const { schoolInfo, updateSchoolInfo, addToast } = useApp();

  const currentDaysCount = schoolInfo.effectiveDaysPerWeek || 5;
  const currentActiveDays = schoolInfo.activeSchoolDays && schoolInfo.activeSchoolDays.length > 0
    ? schoolInfo.activeSchoolDays
    : (currentDaysCount === 6 
        ? ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
        : ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat']);

  const [presetMode, setPresetMode] = useState<'5_hari' | '6_hari' | 'kustom'>(
    currentDaysCount === 6 && currentActiveDays.includes('Sabtu') && !currentActiveDays.includes('Minggu')
      ? '6_hari'
      : currentDaysCount === 5 && !currentActiveDays.includes('Sabtu') && !currentActiveDays.includes('Minggu')
      ? '5_hari'
      : 'kustom'
  );

  const [selectedDays, setSelectedDays] = useState<string[]>(currentActiveDays);

  useEffect(() => {
    if (isOpen) {
      const active = schoolInfo.activeSchoolDays && schoolInfo.activeSchoolDays.length > 0
        ? schoolInfo.activeSchoolDays
        : (schoolInfo.effectiveDaysPerWeek === 6 
            ? ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
            : ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat']);

      setSelectedDays(active);
      if (active.length === 5 && !active.includes('Sabtu') && !active.includes('Minggu')) {
        setPresetMode('5_hari');
      } else if (active.length === 6 && active.includes('Sabtu') && !active.includes('Minggu')) {
        setPresetMode('6_hari');
      } else {
        setPresetMode('kustom');
      }
    }
  }, [isOpen, schoolInfo]);

  // Handle Preset Changes
  const handleSelectPreset = (mode: '5_hari' | '6_hari' | 'kustom') => {
    setPresetMode(mode);
    if (mode === '5_hari') {
      setSelectedDays(['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat']);
    } else if (mode === '6_hari') {
      setSelectedDays(['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']);
    }
  };

  // Toggle individual day
  const handleToggleDay = (dayId: string) => {
    let next: string[];
    if (selectedDays.includes(dayId)) {
      if (selectedDays.length <= 1) {
        addToast('warning', 'Peringatan', 'Minimal harus ada 1 hari efektif sekolah aktif.');
        return;
      }
      next = selectedDays.filter(d => d !== dayId);
    } else {
      next = [...selectedDays, dayId];
    }
    setSelectedDays(next);
    setPresetMode('kustom');
  };

  // Calculate monthly effective days for the selected month
  const [yearStr, monthStr] = selectedMonth.split('-');
  const year = parseInt(yearStr, 10) || 2026;
  const month = parseInt(monthStr, 10) || 8;
  const totalDaysInMonth = new Date(year, month, 0).getDate();

  const dayNamesMap = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  let monthEffectiveDaysCount = 0;
  for (let d = 1; d <= totalDaysInMonth; d++) {
    const dayOfWeekIndex = new Date(year, month - 1, d).getDay();
    const dayName = dayNamesMap[dayOfWeekIndex];
    if (selectedDays.includes(dayName)) {
      monthEffectiveDaysCount++;
    }
  }

  const handleSave = () => {
    const count = selectedDays.length;
    updateSchoolInfo({
      effectiveDaysPerWeek: count,
      activeSchoolDays: selectedDays
    });
    addToast(
      'success',
      'Pengaturan Hari Efektif Disimpan',
      `Pola sekolah diatur menjadi ${count} Hari Efektif per minggu (${selectedDays.join(', ')}).`
    );
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Pengaturan Pilihan Hari Efektif Sekolah per Minggu"
      maxWidth="2xl"
    >
      <div className="space-y-6 text-slate-800 dark:text-slate-200 text-xs">
        {/* Banner Info */}
        <div className="rounded-2xl border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 dark:border-blue-900/50 dark:from-blue-950/40 dark:to-slate-900 p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shrink-0 shadow-md shadow-blue-600/20">
              <CalendarDays className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                Konfigurasi Kalender & Presensi Kelas
              </h4>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">
                Tentukan jumlah hari belajar efektif dalam seminggu untuk menyesuaikan daftar hadir harian,
                matriks absensi bulanan, dan perhitungan persentase kehadiran resmi rapor.
              </p>
            </div>
          </div>
        </div>

        {/* Preset Cards Selection */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-900 dark:text-white">
            Pilih Pola Hari Sekolah:
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* 5 Hari */}
            <button
              type="button"
              onClick={() => handleSelectPreset('5_hari')}
              className={`p-3.5 rounded-2xl border text-left transition-all relative ${
                presetMode === '5_hari'
                  ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/30 ring-2 ring-blue-500/20 shadow-sm'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-slate-900 dark:text-white text-xs">
                  5 Hari Sekolah
                </span>
                {presetMode === '5_hari' && (
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-white">
                    <Check className="h-2.5 w-2.5 stroke-[3]" />
                  </span>
                )}
              </div>
              <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 mb-1">
                Senin - Jumat
              </span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Pola Full Day School. Sabtu & Minggu libur.
              </p>
            </button>

            {/* 6 Hari */}
            <button
              type="button"
              onClick={() => handleSelectPreset('6_hari')}
              className={`p-3.5 rounded-2xl border text-left transition-all relative ${
                presetMode === '6_hari'
                  ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/30 ring-2 ring-blue-500/20 shadow-sm'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-slate-900 dark:text-white text-xs">
                  6 Hari Sekolah
                </span>
                {presetMode === '6_hari' && (
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-white">
                    <Check className="h-2.5 w-2.5 stroke-[3]" />
                  </span>
                )}
              </div>
              <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 mb-1">
                Senin - Sabtu
              </span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Pola Reguler 6 Hari. Hanya Minggu yang libur.
              </p>
            </button>

            {/* Kustom */}
            <button
              type="button"
              onClick={() => setPresetMode('kustom')}
              className={`p-3.5 rounded-2xl border text-left transition-all relative ${
                presetMode === 'kustom'
                  ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30 ring-2 ring-indigo-500/20 shadow-sm'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-slate-900 dark:text-white text-xs">
                  Kustom Hari
                </span>
                {presetMode === 'kustom' && (
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-indigo-600 text-white">
                    <Check className="h-2.5 w-2.5 stroke-[3]" />
                  </span>
                )}
              </div>
              <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 mb-1">
                Pilih Mandiri
              </span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Atur checklist hari aktif sesuai kebijakan sekolah.
              </p>
            </button>
          </div>
        </div>

        {/* Checklist Hari Aktif */}
        <div className="space-y-2 rounded-2xl border border-slate-200 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-900/60">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
              Rincian Hari Efektif Belajar (Centang Hari Aktif):
            </label>
            <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400">
              {selectedDays.length} Hari Terpilih
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-7 gap-2 pt-1">
            {ALL_DAYS.map(day => {
              const isChecked = selectedDays.includes(day.id);
              const isWeekendDay = day.id === 'Minggu' || day.id === 'Sabtu';

              return (
                <button
                  key={day.id}
                  type="button"
                  onClick={() => handleToggleDay(day.id)}
                  className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${
                    isChecked
                      ? 'border-blue-600 bg-blue-600 text-white shadow-sm font-bold'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400'
                  }`}
                >
                  <span className="text-xs">{day.fullLabel}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isChecked
                      ? 'bg-blue-700/60 text-blue-100'
                      : isWeekendDay
                      ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400'
                      : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                  }`}>
                    {isChecked ? 'Efektif' : 'Libur'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Live Calculation Preview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3.5 rounded-2xl bg-emerald-50 text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200 border border-emerald-200/60 dark:border-emerald-800/40 flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-emerald-800 dark:text-emerald-300">Hari Belajar / Minggu</p>
              <p className="text-sm font-black">{selectedDays.length} Hari Efektif</p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-indigo-50 text-indigo-900 dark:bg-indigo-950/40 dark:text-indigo-200 border border-indigo-200/60 dark:border-indigo-800/40 flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-indigo-800 dark:text-indigo-300">
                Estimasi Bulan {month === 8 ? 'Agustus' : `Bulan ke-${month}`} {year}
              </p>
              <p className="text-sm font-black">{monthEffectiveDaysCount} Hari Efektif Belajar</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 rounded-xl transition-colors"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 active:scale-95 rounded-xl shadow-md shadow-blue-600/20 transition-all"
          >
            <Check className="h-4 w-4" />
            <span>Simpan Pengaturan Hari Efektif</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};
