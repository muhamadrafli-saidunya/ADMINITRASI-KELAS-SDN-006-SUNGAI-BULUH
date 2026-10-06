import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from './Modal';
import {
  Calendar,
  CheckCircle2,
  Plus,
  ArrowRight,
  Users,
  Sparkles,
  ShieldCheck,
  FolderOpen,
  GraduationCap,
  Edit3,
  Save,
  X,
  Copy,
  Layers,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export const AcademicYearSwitcherModal: React.FC = () => {
  const {
    schoolInfo,
    availableAcademicYears,
    switchAcademicYear,
    addAcademicYear,
    updateSchoolInfoForYear,
    isAcademicYearModalOpen,
    setIsAcademicYearModalOpen,
    getStudentCountForYear,
    getSchoolInfoForYear,
    students,
    teachers
  } = useApp();

  // State for new academic year creation
  const [newYearInput, setNewYearInput] = useState('');
  const [newClassNameInput, setNewClassNameInput] = useState('Kelas 4-A');
  const [newPhaseInput, setNewPhaseInput] = useState('Fase B (Kelas 3-4)');
  const [newTeacherNameInput, setNewTeacherNameInput] = useState('');
  const [newTeacherNipInput, setNewTeacherNipInput] = useState('');
  const [newSemesterInput, setNewSemesterInput] = useState<'1 (Ganjil)' | '2 (Genap)'>('1 (Ganjil)');
  const [studentOption, setStudentOption] = useState<'empty' | 'copy'>('empty');
  const [isAddingNewYear, setIsAddingNewYear] = useState(false);
  const [inputError, setInputError] = useState('');

  // State for editing an existing registered year's class & homeroom teacher
  const [editingYear, setEditingYear] = useState<string | null>(null);
  const [editYearForm, setEditYearForm] = useState({
    className: '',
    phase: 'Fase B (Kelas 3-4)',
    homeroomTeacherName: '',
    homeroomTeacherNip: '',
    semester: '1 (Ganjil)' as '1 (Ganjil)' | '2 (Genap)'
  });

  const currentYear = schoolInfo.academicYear || '2025/2026';

  // Helper to guess next class
  const getNextClassSuggestion = (currClass: string) => {
    const match = currClass.match(/(\d+)/);
    if (match) {
      const num = parseInt(match[1], 10);
      if (num < 6) {
        return currClass.replace(String(num), String(num + 1));
      }
    }
    return currClass || 'Kelas 4-A';
  };

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
    setEditingYear(null);
  };

  const handleOpenAddNewYear = () => {
    const suggestions = getNextYearSuggestions();
    const suggestedYear = suggestions[0] || '';
    setNewYearInput(suggestedYear);
    const nextClass = getNextClassSuggestion(schoolInfo.className || '');
    setNewClassNameInput(nextClass);

    // Auto-detect phase for next class
    if (nextClass.includes('1') || nextClass.includes('2')) {
      setNewPhaseInput('Fase A (Kelas 1-2)');
    } else if (nextClass.includes('3') || nextClass.includes('4')) {
      setNewPhaseInput('Fase B (Kelas 3-4)');
    } else if (nextClass.includes('5') || nextClass.includes('6')) {
      setNewPhaseInput('Fase C (Kelas 5-6)');
    } else {
      setNewPhaseInput(schoolInfo.phase || 'Fase B (Kelas 3-4)');
    }

    setNewTeacherNameInput(schoolInfo.homeroomTeacherName || schoolInfo.teacherName || '');
    setNewTeacherNipInput(schoolInfo.homeroomTeacherNip || schoolInfo.teacherNip || '');
    setNewSemesterInput('1 (Ganjil)');
    setStudentOption('empty');
    setIsAddingNewYear(true);
    setInputError('');
  };

  const handleStartEditYear = (e: React.MouseEvent, yr: string) => {
    e.stopPropagation();
    const info = getSchoolInfoForYear(yr) || {};
    setEditYearForm({
      className: info.className || schoolInfo.className || '',
      phase: info.phase || schoolInfo.phase || 'Fase B (Kelas 3-4)',
      homeroomTeacherName: info.homeroomTeacherName || info.teacherName || schoolInfo.homeroomTeacherName || '',
      homeroomTeacherNip: info.homeroomTeacherNip || info.teacherNip || schoolInfo.homeroomTeacherNip || '',
      semester: (info.semester as '1 (Ganjil)' | '2 (Genap)') || '1 (Ganjil)'
    });
    setEditingYear(yr);
  };

  const handleSaveEditYear = (e: React.FormEvent, yr: string) => {
    e.preventDefault();
    e.stopPropagation();
    updateSchoolInfoForYear(yr, {
      className: editYearForm.className.trim(),
      phase: editYearForm.phase,
      homeroomTeacherName: editYearForm.homeroomTeacherName.trim(),
      homeroomTeacherNip: editYearForm.homeroomTeacherNip.trim(),
      semester: editYearForm.semester
    });
    setEditingYear(null);
  };

  const handleAddNewYear = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newYearInput.trim();
    if (!trimmed) {
      setInputError('Tahun pelajaran wajib diisi.');
      return;
    }

    const regex = /^\d{4}\/\d{4}$/;
    if (!regex.test(trimmed)) {
      setInputError('Format tahun pelajaran harus YYYY/YYYY (contoh: 2027/2028)');
      return;
    }

    setInputError('');
    addAcademicYear(trimmed, {
      className: newClassNameInput.trim() || undefined,
      phase: newPhaseInput || undefined,
      homeroomTeacherName: newTeacherNameInput.trim() || undefined,
      homeroomTeacherNip: newTeacherNipInput.trim() || undefined,
      semester: newSemesterInput,
      copyStudentsFromYear: studentOption === 'copy' ? currentYear : undefined
    });

    setNewYearInput('');
    setIsAddingNewYear(false);
    setIsAcademicYearModalOpen(false);
  };

  const suggestions = getNextYearSuggestions();

  return (
    <Modal
      isOpen={isAcademicYearModalOpen}
      onClose={() => {
        setIsAcademicYearModalOpen(false);
        setInputError('');
        setEditingYear(null);
        setIsAddingNewYear(false);
      }}
      title="Pilih / Ganti Tahun Pelajaran"
      size="xl"
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
                <div className="flex items-center gap-2 mt-1 flex-wrap text-xs text-slate-600 dark:text-slate-300">
                  <span className="font-bold text-indigo-900 dark:text-indigo-200 bg-white/80 dark:bg-slate-900/80 px-2 py-0.5 rounded-md border border-indigo-200 dark:border-indigo-800">
                    Kelas: {schoolInfo.className || '-'}
                  </span>
                  <span className="text-slate-400">•</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    Wali Kelas: {schoolInfo.homeroomTeacherName || schoolInfo.teacherName || '-'}
                  </span>
                  <span className="text-slate-400">•</span>
                  <span className="text-slate-600 dark:text-slate-400">
                    {schoolInfo.semester}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-indigo-200/60 dark:border-indigo-800/60 gap-1.5 shrink-0">
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
        <div className="space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <FolderOpen className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <span>Daftar Tahun Pelajaran Tersimpan</span>
              </label>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Klik kartu tahun pelajaran untuk beralih. Kelas, wali kelas, siswa, nilai, rapor, dan absensi akan otomatis menyesuaikan.
              </p>
            </div>

            {!isAddingNewYear && (
              <button
                type="button"
                onClick={handleOpenAddNewYear}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Tambah Tahun Pelajaran Baru</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {availableAcademicYears.map(yr => {
              const isActive = yr === currentYear;
              const studentCount = getStudentCountForYear(yr);
              const yearInfo = getSchoolInfoForYear(yr) || {};
              const className = yearInfo.className || (isActive ? schoolInfo.className : 'Kelas belum diset');
              const teacherName = yearInfo.homeroomTeacherName || yearInfo.teacherName || (isActive ? schoolInfo.homeroomTeacherName || schoolInfo.teacherName : 'Wali kelas belum diset');
              const semester = yearInfo.semester || (isActive ? schoolInfo.semester : '1 (Ganjil)');
              const phase = yearInfo.phase || (isActive ? schoolInfo.phase : '-');
              const isEditingThis = editingYear === yr;

              return (
                <div
                  key={yr}
                  className={`p-4 rounded-2xl border transition-all text-left group flex flex-col justify-between ${
                    isActive
                      ? 'border-indigo-500 bg-indigo-50/60 dark:bg-indigo-950/40 dark:border-indigo-600 shadow-sm ring-2 ring-indigo-500/20'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-xs'
                  }`}
                >
                  <div>
                    {/* Header: Year & Status */}
                    <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 font-bold ${
                            isActive
                              ? 'bg-indigo-600 text-white shadow-xs'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 group-hover:bg-indigo-100 group-hover:text-indigo-700 dark:group-hover:bg-indigo-900/50 dark:group-hover:text-indigo-300'
                          }`}
                        >
                          <Calendar className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="font-extrabold text-sm text-slate-900 dark:text-white font-mono">
                              {yr}
                            </span>
                            {isActive && (
                              <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-indigo-600 text-white">
                                Aktif
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400">
                            Semester {semester}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={(e) => handleStartEditYear(e, yr)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title="Sesuaikan Kelas & Wali Kelas tahun ini"
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                        </button>

                        <button
                          type="button"
                          disabled={isActive}
                          onClick={() => handleSelectYear(yr)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                            isActive
                              ? 'bg-emerald-600 text-white cursor-default'
                              : 'bg-indigo-50 hover:bg-indigo-600 hover:text-white text-indigo-700 dark:bg-slate-800 dark:text-indigo-300 dark:hover:bg-indigo-600'
                          }`}
                        >
                          {isActive ? (
                            <>
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              <span>Digunakan</span>
                            </>
                          ) : (
                            <>
                              <span>Pilih</span>
                              <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Content Details: Kelas, Wali Kelas, Siswa, Data */}
                    {!isEditingThis ? (
                      <div className="pt-3 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5 font-medium">
                            <GraduationCap className="h-3.5 w-3.5 text-blue-500" />
                            <span>Rombel Kelas:</span>
                          </span>
                          <span className="font-bold text-slate-800 dark:text-slate-200">
                            {className} {phase && phase !== '-' ? `(${phase.split(' ')[0]} ${phase.split(' ')[1] || ''})` : ''}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5 font-medium truncate mr-2">
                            <Users className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
                            <span className="truncate">Wali Kelas:</span>
                          </span>
                          <span className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[180px]" title={teacherName}>
                            {teacherName}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-xs pt-1 border-t border-dashed border-slate-100 dark:border-slate-800 text-[11px]">
                          <span className="text-slate-500 dark:text-slate-400">
                            Data Tersimpan:
                          </span>
                          <span className={`font-bold ${studentCount > 0 ? 'text-emerald-700 dark:text-emerald-300' : 'text-slate-400 italic'}`}>
                            {studentCount > 0 ? `${studentCount} Siswa • Nilai, Rapor & Absensi` : '0 Siswa (Lembar Kosong)'}
                          </span>
                        </div>
                      </div>
                    ) : (
                      /* Inline Quick Edit for this Year's Class & Teacher */
                      <form onSubmit={(e) => handleSaveEditYear(e, yr)} className="pt-3 space-y-2.5">
                        <div className="flex items-center justify-between pb-1 border-b border-indigo-100 dark:border-indigo-900">
                          <span className="text-[11px] font-bold text-indigo-700 dark:text-indigo-300">
                            Edit Pengaturan TP {yr}
                          </span>
                          <button
                            type="button"
                            onClick={() => setEditingYear(null)}
                            className="text-slate-400 hover:text-slate-600"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[10px] font-bold text-slate-600 dark:text-slate-400 mb-0.5">
                              Nama Kelas
                            </label>
                            <input
                              type="text"
                              value={editYearForm.className}
                              onChange={e => setEditYearForm({ ...editYearForm, className: e.target.value })}
                              placeholder="Contoh: Kelas 4-A"
                              className="w-full px-2 py-1 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold text-slate-600 dark:text-slate-400 mb-0.5">
                              Semester
                            </label>
                            <select
                              value={editYearForm.semester}
                              onChange={e => setEditYearForm({ ...editYearForm, semester: e.target.value as any })}
                              className="w-full px-2 py-1 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                            >
                              <option value="1 (Ganjil)">Semester 1 (Ganjil)</option>
                              <option value="2 (Genap)">Semester 2 (Genap)</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-600 dark:text-slate-400 mb-0.5">
                            Wali Kelas
                          </label>
                          <input
                            type="text"
                            value={editYearForm.homeroomTeacherName}
                            onChange={e => setEditYearForm({ ...editYearForm, homeroomTeacherName: e.target.value })}
                            placeholder="Nama Lengkap Wali Kelas"
                            className="w-full px-2 py-1 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                          />
                        </div>

                        <div className="flex items-center justify-end gap-1.5 pt-1">
                          <button
                            type="button"
                            onClick={() => setEditingYear(null)}
                            className="px-2.5 py-1 text-xs rounded-lg border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400"
                          >
                            Batal
                          </button>
                          <button
                            type="submit"
                            className="px-3 py-1 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1 cursor-pointer"
                          >
                            <Save className="h-3 w-3" />
                            <span>Simpan</span>
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section: Tambah / Buat Tahun Pelajaran Baru */}
        {isAddingNewYear ? (
          <div className="rounded-2xl border-2 border-indigo-200 dark:border-indigo-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                <div>
                  <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
                    Form Pembuatan & Penyesuaian Tahun Pelajaran Baru
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Atur kelas, wali kelas, semester, dan opsi siswa untuk tahun pelajaran baru
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsAddingNewYear(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleAddNewYear} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {/* Tahun Pelajaran */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Tahun Pelajaran *
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: 2027/2028"
                    value={newYearInput}
                    onChange={e => {
                      setNewYearInput(e.target.value);
                      if (inputError) setInputError('');
                    }}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                  />
                  {suggestions.length > 0 && (
                    <div className="flex items-center gap-1 flex-wrap mt-1">
                      <span className="text-[10px] text-slate-400">Saran:</span>
                      {suggestions.map(s => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setNewYearInput(s)}
                          className="px-1.5 py-0.5 text-[10px] font-mono rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-indigo-100 hover:text-indigo-700"
                        >
                          +{s}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Nama Kelas */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Nama Rombel Kelas *
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Kelas 5-A"
                    value={newClassNameInput}
                    onChange={e => setNewClassNameInput(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                  />
                  <div className="flex items-center gap-1 mt-1 flex-wrap">
                    {['3A', '4A', '5A', '6A', '3B', '4B', '5B', '6B'].map(k => (
                      <button
                        key={k}
                        type="button"
                        onClick={() => {
                          setNewClassNameInput(`Kelas ${k[0]}-${k[1]}`);
                          if (k.startsWith('1') || k.startsWith('2')) setNewPhaseInput('Fase A (Kelas 1-2)');
                          else if (k.startsWith('3') || k.startsWith('4')) setNewPhaseInput('Fase B (Kelas 3-4)');
                          else setNewPhaseInput('Fase C (Kelas 5-6)');
                        }}
                        className="px-1.5 py-0.5 text-[10px] rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-indigo-100 hover:text-indigo-700"
                      >
                        {k}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Fase Kurikulum */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Fase Kurikulum *
                  </label>
                  <select
                    value={newPhaseInput}
                    onChange={e => setNewPhaseInput(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Fase A (Kelas 1-2)">Fase A (Kelas 1-2)</option>
                    <option value="Fase B (Kelas 3-4)">Fase B (Kelas 3-4)</option>
                    <option value="Fase C (Kelas 5-6)">Fase C (Kelas 5-6)</option>
                  </select>
                </div>

                {/* Wali Kelas */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Wali Kelas untuk Tahun Pelajaran Baru
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Nama Lengkap & Gelar Wali Kelas"
                      value={newTeacherNameInput}
                      onChange={e => setNewTeacherNameInput(e.target.value)}
                      className="flex-1 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                    />
                    {teachers && teachers.length > 0 && (
                      <select
                        onChange={e => {
                          const t = teachers.find(tch => tch.id === e.target.value);
                          if (t) {
                            setNewTeacherNameInput(t.nama);
                            setNewTeacherNipInput(t.nip || '-');
                          }
                        }}
                        className="rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-2.5 py-2 text-xs text-slate-700 dark:text-slate-300"
                      >
                        <option value="">Pilih Guru...</option>
                        {teachers.map(t => (
                          <option key={t.id} value={t.id}>
                            {t.nama}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>

                {/* Semester Awal */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Semester Awal *
                  </label>
                  <select
                    value={newSemesterInput}
                    onChange={e => setNewSemesterInput(e.target.value as any)}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="1 (Ganjil)">Semester 1 (Ganjil)</option>
                    <option value="2 (Genap)">Semester 2 (Genap)</option>
                  </select>
                </div>
              </div>

              {/* Pilihan Siswa: Lembar Kosong vs Salin Siswa */}
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 p-3.5 space-y-2">
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                  Opsi Data Siswa pada Tahun Pelajaran Baru:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <label
                    onClick={() => setStudentOption('empty')}
                    className={`flex items-start gap-2.5 p-3 rounded-xl border cursor-pointer transition-all ${
                      studentOption === 'empty'
                        ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 ring-1 ring-emerald-500'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900'
                    }`}
                  >
                    <input
                      type="radio"
                      name="studentOption"
                      checked={studentOption === 'empty'}
                      onChange={() => setStudentOption('empty')}
                      className="mt-0.5 text-emerald-600"
                    />
                    <div>
                      <span className="block text-xs font-bold text-slate-900 dark:text-white">
                        Mulai Lembar Bersih (0 Siswa)
                      </span>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        Direkomendasikan untuk tahun baru: tanpa siswa bawaan dan tanpa nilai dummy 0. Siap input atau impor siswa baru.
                      </p>
                    </div>
                  </label>

                  <label
                    onClick={() => setStudentOption('copy')}
                    className={`flex items-start gap-2.5 p-3 rounded-xl border cursor-pointer transition-all ${
                      studentOption === 'copy'
                        ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/30 ring-1 ring-indigo-500'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900'
                    }`}
                  >
                    <input
                      type="radio"
                      name="studentOption"
                      checked={studentOption === 'copy'}
                      onChange={() => setStudentOption('copy')}
                      className="mt-0.5 text-indigo-600"
                    />
                    <div>
                      <span className="block text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1">
                        <Copy className="h-3 w-3 text-indigo-600" />
                        <span>Salin Siswa TP Aktif (Kenaikan Kelas)</span>
                      </span>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        Menyalin nama dan biodata {students.length} siswa dari TP {currentYear}. Lembar nilai, absensi, dan rapor dimulai baru.
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {inputError && (
                <p className="text-xs text-rose-600 dark:text-rose-400 font-semibold">
                  {inputError}
                </p>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddingNewYear(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>Aktifkan & Beralih ke Tahun Pelajaran Baru</span>
                </button>
              </div>
            </form>
          </div>
        ) : null}

        {/* Informational Guidance Box */}
        <div className="rounded-xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/70 dark:bg-blue-950/30 p-3.5 space-y-1.5 text-xs text-blue-900 dark:text-blue-200">
          <div className="flex items-center gap-2 font-bold text-blue-800 dark:text-blue-300">
            <ShieldCheck className="h-4 w-4 text-blue-600 dark:text-blue-400 shrink-0" />
            <span>Karakteristik Penyesuaian Antar Tahun Pelajaran</span>
          </div>
          <ul className="space-y-1 text-[11px] leading-relaxed text-blue-800/90 dark:text-blue-300/90 pl-5 list-disc">
            <li>
              <strong>Penyimpanan Terisolasi Penuh:</strong> Setiap tahun pelajaran menyimpan Kelas, Wali Kelas, Siswa, Nilai, Rapor, Presensi, Jurnal, dan Kas secara mandiri.
            </li>
            <li>
              <strong>Penyesuaian Otomatis:</strong> Saat beralih tahun pelajaran, identitas kelas, wali kelas yang bertugas, serta rekaman siswa dan nilai pada tahun tersebut langsung dimuat ke layar.
            </li>
            <li>
              <strong>Riwayat Aman:</strong> Data tahun sebelumnya tidak akan terhapus dan dapat diakses kembali kapan saja dengan memilih tahun bersangkutan.
            </li>
          </ul>
        </div>
      </div>
    </Modal>
  );
};
