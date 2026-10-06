import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from './Modal';
import {
  Calendar,
  CheckCircle2,
  Plus,
  ArrowRight,
  Info,
  Users,
  Sparkles,
  ShieldCheck,
  FolderOpen
} from 'lucide-react';

export const AcademicYearSwitcherModal: React.FC = () => {
  const {
    schoolInfo,
    availableAcademicYears,
    switchAcademicYear,
    addAcademicYear,
    isAcademicYearModalOpen,
    setIsAcademicYearModalOpen,
    getStudentCountForYear,
    students
  } = useApp();

  const [newYearInput, setNewYearInput] = useState('');
  const [inputError, setInputError] = useState('');

  const currentYear = schoolInfo.academicYear || '2026/2027';

  // Quick suggestions for next academic years
  const getNextYearSuggestions = () => {
    const years = [...availableAcademicYears];
    const currentYearNum = parseInt(currentYear.split('/')[0], 10);
    const suggestions: string[] = [];

    if (!isNaN(currentYearNum)) {
      const next1 = `${currentYearNum + 1}/${currentYearNum + 2}`;
      const next2 = `${currentYearNum + 2}/${currentYearNum + 3}`;
      const prev1 = `${currentYearNum - 1}/${currentYearNum}`;
      [prev1, next1, next2].forEach(y => {
        if (!years.includes(y) && !suggestions.includes(y)) {
          suggestions.push(y);
        }
      });
    }
    return suggestions;
  };

  const handleSelectYear = (year: string) => {
    if (year === currentYear) {
      setIsAcademicYearModalOpen(false);
      return;
    }
    switchAcademicYear(year);
    setIsAcademicYearModalOpen(false);
  };

  const handleAddNewYear = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newYearInput.trim();
    if (!trimmed) {
      setInputError('Tahun pelajaran wajib diisi.');
      return;
    }

    // Format validation like "2027/2028" or similar
    const regex = /^\d{4}\/\d{4}$/;
    if (!regex.test(trimmed)) {
      setInputError('Format tahun pelajaran harus YYYY/YYYY (contoh: 2027/2028)');
      return;
    }

    setInputError('');
    addAcademicYear(trimmed);
    setNewYearInput('');
    setIsAcademicYearModalOpen(false);
  };

  const suggestions = getNextYearSuggestions();

  return (
    <Modal
      isOpen={isAcademicYearModalOpen}
      onClose={() => {
        setIsAcademicYearModalOpen(false);
        setInputError('');
      }}
      title="Pilih / Ganti Tahun Pelajaran"
      size="lg"
    >
      <div className="space-y-5">
        {/* Active Year Highlight Banner */}
        <div className="rounded-2xl border border-indigo-200 dark:border-indigo-800/70 bg-gradient-to-r from-indigo-50/90 via-blue-50/70 to-indigo-50/90 dark:from-indigo-950/40 dark:via-blue-950/30 dark:to-indigo-950/40 p-4 sm:p-5 shadow-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3.5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-md shadow-indigo-600/25">
                <Calendar className="h-6 w-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300">
                  Tahun Pelajaran Aktif Saat Ini
                </span>
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-0.5">
                  {currentYear}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                  Semester <strong>{schoolInfo.semester}</strong> • Kelas <strong>{schoolInfo.className}</strong>
                </p>
              </div>
            </div>

            <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-indigo-200/60 dark:border-indigo-800/60 gap-1.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-xs font-bold border border-emerald-300 dark:border-emerald-800">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                <span>Sedang Digunakan</span>
              </span>
              <span className="text-[11px] font-semibold text-indigo-700 dark:text-indigo-300 flex items-center gap-1">
                <Users className="h-3 w-3" />
                <span>{students.length} Siswa Terdaftar</span>
              </span>
            </div>
          </div>
        </div>

        {/* List of Registered Academic Years */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <FolderOpen className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <span>Daftar Tahun Pelajaran Tersedia</span>
            </label>
            <span className="text-[11px] text-slate-400 font-medium">
              Klik tahun pelajaran untuk beralih
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {availableAcademicYears.map(yr => {
              const isActive = yr === currentYear;
              const studentCount = getStudentCountForYear(yr);
              const isEmpty = studentCount === 0;

              return (
                <div
                  key={yr}
                  onClick={() => handleSelectYear(yr)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 text-left group ${
                    isActive
                      ? 'border-indigo-500 bg-indigo-50/60 dark:bg-indigo-950/40 dark:border-indigo-600 shadow-sm ring-2 ring-indigo-500/20'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-xs'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 font-bold ${
                        isActive
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 group-hover:bg-indigo-100 group-hover:text-indigo-700 dark:group-hover:bg-indigo-900/50 dark:group-hover:text-indigo-300'
                      }`}
                    >
                      <Calendar className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                          {yr}
                        </span>
                        {isActive && (
                          <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-indigo-600 text-white">
                            Aktif
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {isEmpty ? (
                          <span className="italic text-slate-400">Kosong (Belum ada siswa)</span>
                        ) : (
                          <span><strong>{studentCount}</strong> Siswa tersimpan</span>
                        )}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={isActive}
                    className={`shrink-0 px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all ${
                      isActive
                        ? 'bg-emerald-600 text-white cursor-default'
                        : 'bg-slate-100 group-hover:bg-indigo-600 group-hover:text-white text-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:group-hover:bg-indigo-600'
                    }`}
                  >
                    {isActive ? (
                      <>
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>Aktif</span>
                      </>
                    ) : (
                      <>
                        <span>Pilih</span>
                        <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section: Tambah Tahun Pelajaran Baru */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 p-4 space-y-3">
          <div className="flex items-center gap-2">
            <Plus className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-200">
              Buat / Aktifkan Tahun Pelajaran Baru
            </h4>
          </div>

          <form onSubmit={handleAddNewYear} className="space-y-2.5">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Contoh: 2027/2028"
                  value={newYearInput}
                  onChange={e => {
                    setNewYearInput(e.target.value);
                    if (inputError) setInputError('');
                  }}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs font-mono font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 shadow-2xs"
                />
              </div>

              <button
                type="submit"
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>Aktifkan Tahun Baru (Mulai Kosong)</span>
              </button>
            </div>

            {inputError && (
              <p className="text-[11px] text-rose-600 dark:text-rose-400 font-semibold">
                {inputError}
              </p>
            )}

            {suggestions.length > 0 && (
              <div className="flex items-center gap-1.5 flex-wrap pt-1">
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                  Saran Cepat:
                </span>
                {suggestions.map(sug => (
                  <button
                    key={sug}
                    type="button"
                    onClick={() => setNewYearInput(sug)}
                    className="px-2 py-0.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-[11px] font-mono font-bold text-slate-700 dark:text-slate-300 hover:border-indigo-400 hover:text-indigo-600 transition-colors cursor-pointer"
                  >
                    + {sug}
                  </button>
                ))}
              </div>
            )}
          </form>
        </div>

        {/* Informational Guidance Box */}
        <div className="rounded-xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/70 dark:bg-blue-950/30 p-3.5 space-y-1.5 text-xs text-blue-900 dark:text-blue-200">
          <div className="flex items-center gap-2 font-bold text-blue-800 dark:text-blue-300">
            <ShieldCheck className="h-4 w-4 text-blue-600 dark:text-blue-400 shrink-0" />
            <span>Karakteristik Penyimpanan Antar Tahun Pelajaran</span>
          </div>
          <ul className="space-y-1 text-[11px] leading-relaxed text-blue-800/90 dark:text-blue-300/90 pl-5 list-disc">
            <li>
              <strong>Penyimpanan Terisolasi:</strong> Seluruh data siswa, nilai asesmen, presensi harian, jurnal mengajar, catatan rapor, dan kas kelas tersimpan aman terpisah per tahun pelajaran.
            </li>
            <li>
              <strong>Tahun Pelajaran Baru Masih Kosong:</strong> Saat memilih tahun pelajaran baru, lembar kerja dimulai bersih tanpa siswa dan tanpa nilai 0, siap untuk input atau import siswa baru.
            </li>
            <li>
              <strong>Riwayat Tersimpan Utuh:</strong> Data tahun pelajaran sebelumnya tidak akan terhapus dan akan otomatis muncul kembali saat tahun tersebut dipilih kembali.
            </li>
          </ul>
        </div>
      </div>
    </Modal>
  );
};
