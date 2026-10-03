import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CleaningDuty } from '../../types';
import { Modal } from '../common/Modal';
import {
  Brush,
  Plus,
  Edit2,
  Trash2,
  Crown,
  Clock,
  RotateCcw,
  Wand2,
  CheckCircle2,
  Search,
  UserPlus,
  X,
  Check
} from 'lucide-react';

interface ReguPiketTabProps {
  onOpenPrint: () => void;
}

export const ReguPiketTab: React.FC<ReguPiketTabProps> = ({ onOpenPrint }) => {
  const {
    cleaningDuties,
    addDuty,
    updateDuty,
    deleteDuty,
    addStudentToDuty,
    removeStudentFromDuty,
    autoDistributeDuties,
    resetDutiesToDefault,
    students,
    schoolInfo,
    currentUser,
    addToast
  } = useApp();

  const isAdmin = currentUser.role !== 'siswa';
  const daysOfWeek = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

  // Modals state
  const [isEditDutyModalOpen, setIsEditDutyModalOpen] = useState(false);
  const [isAddDutyModalOpen, setIsAddDutyModalOpen] = useState(false);

  // Selected Duty for Edit
  const [editingDuty, setEditingDuty] = useState<{
    hari: string;
    siswaIds: string[];
    ketuaPiket: string;
    tugasSpesifik: string;
    areaTugas: string[];
    waktuPiket: string;
  }>({
    hari: 'Senin',
    siswaIds: [],
    ketuaPiket: '',
    tugasSpesifik: '',
    areaTugas: [],
    waktuPiket: 'Pagi & Siang'
  });

  // State for Add New Duty
  const [newDuty, setNewDuty] = useState<{
    hari: string;
    customHari: string;
    isCustomDay: boolean;
    siswaIds: string[];
    ketuaPiket: string;
    tugasSpesifik: string;
    areaTugas: string[];
    waktuPiket: string;
  }>({
    hari: 'Senin',
    customHari: '',
    isCustomDay: false,
    siswaIds: [],
    ketuaPiket: '',
    tugasSpesifik: 'Membersihkan ruang kelas, merapikan meja kursi, hapus whiteboard, dan buang sampah terpilah.',
    areaTugas: ['Papan Tulis & Spidol', 'Sapu & Pel Lantai', 'Tempat Sampah Terpilah'],
    waktuPiket: 'Pagi & Siang'
  });

  // Search inside modals
  const [studentSearchQuery, setStudentSearchQuery] = useState('');
  const [addStudentSearchQuery, setAddStudentSearchQuery] = useState('');

  // Quick student select for card
  const [quickAddDay, setQuickAddDay] = useState<string | null>(null);

  const availableAreas = [
    'Papan Tulis & Spidol',
    'Sapu & Pel Lantai',
    'Meja & Kursi Siswa',
    'Meja Guru & Dokumen',
    'Tempat Sampah Terpilah',
    'Pojok Baca & Rak Buku',
    'Kaca Jendela & Ventilasi',
    'Teras & Halaman Kelas',
    'Loker & Pojok Kreasi P5'
  ];

  const handleOpenEditDuty = (duty: CleaningDuty) => {
    setEditingDuty({
      hari: duty.hari,
      siswaIds: [...duty.siswaIds],
      ketuaPiket: duty.ketuaPiket || '',
      tugasSpesifik: duty.tugasSpesifik || 'Membersihkan ruang kelas, merapikan meja kursi, dan membuang sampah.',
      areaTugas: duty.areaTugas || ['Papan Tulis & Spidol', 'Sapu & Pel Lantai', 'Tempat Sampah Terpilah'],
      waktuPiket: duty.waktuPiket || 'Pagi & Siang'
    });
    setStudentSearchQuery('');
    setIsEditDutyModalOpen(true);
  };

  const handleOpenAddDuty = () => {
    const existingDays = cleaningDuties.map(d => d.hari);
    const unusedDay = daysOfWeek.find(d => !existingDays.includes(d));

    setNewDuty({
      hari: unusedDay || 'Senin',
      customHari: '',
      isCustomDay: !unusedDay,
      siswaIds: [],
      ketuaPiket: '',
      tugasSpesifik: 'Membersihkan ruang kelas, merapikan meja kursi, hapus whiteboard, dan buang sampah terpilah.',
      areaTugas: ['Papan Tulis & Spidol', 'Sapu & Pel Lantai', 'Tempat Sampah Terpilah'],
      waktuPiket: 'Pagi & Siang'
    });
    setAddStudentSearchQuery('');
    setIsAddDutyModalOpen(true);
  };

  const handleToggleEditStudentSelection = (studentId: string) => {
    setEditingDuty(prev => {
      const isSelected = prev.siswaIds.includes(studentId);
      let newIds: string[];
      let newKetua = prev.ketuaPiket;

      if (isSelected) {
        newIds = prev.siswaIds.filter(id => id !== studentId);
        const removedStudent = students.find(s => s.id === studentId);
        if (removedStudent && prev.ketuaPiket === removedStudent.nama) {
          const firstRemaining = students.find(s => newIds[0] === s.id);
          newKetua = firstRemaining ? firstRemaining.nama : '';
        }
      } else {
        newIds = [...prev.siswaIds, studentId];
        if (!newKetua) {
          const addedStudent = students.find(s => s.id === studentId);
          if (addedStudent) newKetua = addedStudent.nama;
        }
      }

      return {
        ...prev,
        siswaIds: newIds,
        ketuaPiket: newKetua
      };
    });
  };

  const handleToggleAddStudentSelection = (studentId: string) => {
    setNewDuty(prev => {
      const isSelected = prev.siswaIds.includes(studentId);
      let newIds: string[];
      let newKetua = prev.ketuaPiket;

      if (isSelected) {
        newIds = prev.siswaIds.filter(id => id !== studentId);
        const removedStudent = students.find(s => s.id === studentId);
        if (removedStudent && prev.ketuaPiket === removedStudent.nama) {
          const firstRemaining = students.find(s => newIds[0] === s.id);
          newKetua = firstRemaining ? firstRemaining.nama : '';
        }
      } else {
        newIds = [...prev.siswaIds, studentId];
        if (!newKetua) {
          const addedStudent = students.find(s => s.id === studentId);
          if (addedStudent) newKetua = addedStudent.nama;
        }
      }

      return {
        ...prev,
        siswaIds: newIds,
        ketuaPiket: newKetua
      };
    });
  };

  const handleToggleEditArea = (area: string) => {
    setEditingDuty(prev => {
      const exists = prev.areaTugas.includes(area);
      const newAreas = exists
        ? prev.areaTugas.filter(a => a !== area)
        : [...prev.areaTugas, area];
      return { ...prev, areaTugas: newAreas };
    });
  };

  const handleToggleAddArea = (area: string) => {
    setNewDuty(prev => {
      const exists = prev.areaTugas.includes(area);
      const newAreas = exists
        ? prev.areaTugas.filter(a => a !== area)
        : [...prev.areaTugas, area];
      return { ...prev, areaTugas: newAreas };
    });
  };

  const handleSelectAllStudentsInEdit = () => {
    if (editingDuty.siswaIds.length === students.length) {
      setEditingDuty(prev => ({ ...prev, siswaIds: [], ketuaPiket: '' }));
    } else {
      const allIds = students.map(s => s.id);
      setEditingDuty(prev => ({
        ...prev,
        siswaIds: allIds,
        ketuaPiket: prev.ketuaPiket || (students[0]?.nama || '')
      }));
    }
  };

  const handleSelectAllStudentsInAdd = () => {
    if (newDuty.siswaIds.length === students.length) {
      setNewDuty(prev => ({ ...prev, siswaIds: [], ketuaPiket: '' }));
    } else {
      const allIds = students.map(s => s.id);
      setNewDuty(prev => ({
        ...prev,
        siswaIds: allIds,
        ketuaPiket: prev.ketuaPiket || (students[0]?.nama || '')
      }));
    }
  };

  const handleSaveEditDuty = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingDuty.siswaIds.length === 0) {
      addToast('error', 'Peringatan', 'Harap pilih minimal 1 siswa untuk regu piket ini.');
      return;
    }

    const leaderName = editingDuty.ketuaPiket || (students.find(s => s.id === editingDuty.siswaIds[0])?.nama || '');

    updateDuty(editingDuty.hari, {
      siswaIds: editingDuty.siswaIds,
      ketuaPiket: leaderName,
      tugasSpesifik: editingDuty.tugasSpesifik,
      areaTugas: editingDuty.areaTugas,
      waktuPiket: editingDuty.waktuPiket
    });

    setIsEditDutyModalOpen(false);
  };

  const handleSaveAddDuty = (e: React.FormEvent) => {
    e.preventDefault();
    const finalDay = newDuty.isCustomDay ? newDuty.customHari.trim() : newDuty.hari;

    if (!finalDay) {
      addToast('error', 'Peringatan', 'Harap masukkan atau pilih hari piket.');
      return;
    }

    if (newDuty.siswaIds.length === 0) {
      addToast('error', 'Peringatan', 'Harap pilih minimal 1 anggota siswa untuk regu piket.');
      return;
    }

    const leaderName = newDuty.ketuaPiket || (students.find(s => s.id === newDuty.siswaIds[0])?.nama || '');

    const dutyToAdd: CleaningDuty = {
      hari: finalDay,
      siswaIds: newDuty.siswaIds,
      ketuaPiket: leaderName,
      tugasSpesifik: newDuty.tugasSpesifik,
      areaTugas: newDuty.areaTugas,
      waktuPiket: newDuty.waktuPiket
    };

    addDuty(dutyToAdd);
    setIsAddDutyModalOpen(false);
  };

  const handleQuickSetLeader = (hari: string, studentName: string) => {
    const targetDuty = cleaningDuties.find(d => d.hari === hari);
    if (!targetDuty) return;
    updateDuty(hari, {
      siswaIds: targetDuty.siswaIds,
      ketuaPiket: studentName,
      tugasSpesifik: targetDuty.tugasSpesifik,
      areaTugas: targetDuty.areaTugas,
      waktuPiket: targetDuty.waktuPiket
    });
    addToast('success', 'Ketua Piket Diperbarui', `${studentName} ditunjuk sebagai Ketua Regu Piket hari ${hari}.`);
  };

  const handleDeleteDutyCard = (hari: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus jadwal regu piket hari ${hari}?`)) {
      deleteDuty(hari);
    }
  };

  const getDayColor = (day: string) => {
    switch (day) {
      case 'Senin':
        return {
          badge: 'bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300 border-blue-200 dark:border-blue-800',
          border: 'border-blue-200 dark:border-blue-900/60',
          headerBg: 'bg-blue-50/70 dark:bg-blue-950/40',
          accent: 'text-blue-600 dark:text-blue-400'
        };
      case 'Selasa':
        return {
          badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
          border: 'border-emerald-200 dark:border-emerald-900/60',
          headerBg: 'bg-emerald-50/70 dark:bg-emerald-950/40',
          accent: 'text-emerald-600 dark:text-emerald-400'
        };
      case 'Rabu':
        return {
          badge: 'bg-purple-100 text-purple-800 dark:bg-purple-950/80 dark:text-purple-300 border-purple-200 dark:border-purple-800',
          border: 'border-purple-200 dark:border-purple-900/60',
          headerBg: 'bg-purple-50/70 dark:bg-purple-950/40',
          accent: 'text-purple-600 dark:text-purple-400'
        };
      case 'Kamis':
        return {
          badge: 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border-amber-200 dark:border-amber-800',
          border: 'border-amber-200 dark:border-amber-900/60',
          headerBg: 'bg-amber-50/70 dark:bg-amber-950/40',
          accent: 'text-amber-600 dark:text-amber-400'
        };
      case 'Jumat':
        return {
          badge: 'bg-teal-100 text-teal-800 dark:bg-teal-950/80 dark:text-teal-300 border-teal-200 dark:border-teal-800',
          border: 'border-teal-200 dark:border-teal-900/60',
          headerBg: 'bg-teal-50/70 dark:bg-teal-950/40',
          accent: 'text-teal-600 dark:text-teal-400'
        };
      case 'Sabtu':
        return {
          badge: 'bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300 border-rose-200 dark:border-rose-800',
          border: 'border-rose-200 dark:border-rose-900/60',
          headerBg: 'bg-rose-50/70 dark:bg-rose-950/40',
          accent: 'text-rose-600 dark:text-rose-400'
        };
      default:
        return {
          badge: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/80 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
          border: 'border-indigo-200 dark:border-indigo-900/60',
          headerBg: 'bg-indigo-50/70 dark:bg-indigo-950/40',
          accent: 'text-indigo-600 dark:text-indigo-400'
        };
    }
  };

  const safeDuties = cleaningDuties || [];
  const safeStudents = students || [];

  const totalAssignedStudents = new Set(safeDuties.flatMap(d => d.siswaIds || [])).size;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50 via-indigo-50 to-slate-50 p-4 sm:p-5 dark:border-blue-900/40 dark:from-blue-950/40 dark:via-indigo-950/30 dark:to-slate-900/60 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm shadow-blue-600/30">
                <Brush className="h-4 w-4" />
              </span>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                Manajemen & Distribusi Regu Piket Kelas {schoolInfo.className}
              </h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Total <strong className="text-blue-600 dark:text-blue-400">{cleaningDuties.length} Jadwal Hari</strong> Piket • <strong className="text-emerald-600 dark:text-emerald-400">{totalAssignedStudents} dari {students.length} Siswa</strong> Terjadwal
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {isAdmin && (
              <>
                <button
                  type="button"
                  onClick={handleOpenAddDuty}
                  className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-bold text-white shadow-md shadow-blue-600/25 hover:bg-blue-700 active:scale-95 transition-all"
                  title="Tambah hari / jadwal regu piket baru"
                >
                  <Plus className="h-4 w-4" />
                  <span>Tambah Regu Piket</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const firstDuty = cleaningDuties[0];
                    if (firstDuty) handleOpenEditDuty(firstDuty);
                  }}
                  className="flex items-center gap-1.5 rounded-xl border border-blue-200 bg-white px-3.5 py-2 text-xs font-bold text-blue-700 shadow-xs hover:bg-blue-50 dark:border-blue-800 dark:bg-slate-800 dark:text-blue-300 dark:hover:bg-slate-700 active:scale-95 transition-all"
                  title="Ubah dan atur anggota regu piket"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                  <span>Edit Regu Piket</span>
                </button>

                <button
                  type="button"
                  onClick={autoDistributeDuties}
                  className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-bold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700 active:scale-95 transition-all"
                  title="Membagi seluruh siswa kelas secara proporsional ke jadwal piket"
                >
                  <Wand2 className="h-3.5 w-3.5" />
                  <span>Bagi Rata Otomatis</span>
                </button>

                <button
                  type="button"
                  onClick={resetDutiesToDefault}
                  className="flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 transition-colors"
                  title="Kembalikan susunan piket ke awal"
                >
                  <RotateCcw className="h-3.5 w-3.5 text-slate-500" />
                  <span className="hidden sm:inline">Reset</span>
                </button>
              </>
            )}

            <button
              type="button"
              onClick={onOpenPrint}
              className="flex items-center gap-1.5 rounded-xl bg-slate-800 text-white px-3.5 py-2 text-xs font-bold hover:bg-slate-700 transition-colors"
            >
              <span>Cetak Poster Piket</span>
            </button>
          </div>
        </div>
      </div>

      {/* Cards Grid: Semua Hari Piket */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {safeDuties.map((duty, dIdx) => {
          const color = getDayColor(duty.hari);
          const unassignedStudents = safeStudents.filter(s => !(duty.siswaIds || []).includes(s.id));

          return (
            <div
              key={`duty-card-${duty.hari}-${dIdx}`}
              className={`rounded-2xl border ${color.border} bg-white dark:bg-slate-900 shadow-sm overflow-hidden flex flex-col justify-between transition-all hover:shadow-md`}
            >
              {/* Card Header */}
              <div className={`p-4 ${color.headerBg} border-b ${color.border} flex items-center justify-between`}>
                <div className="flex items-center gap-2.5">
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-black tracking-wide border ${color.badge}`}>
                    {duty.hari}
                  </span>
                  <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300">
                    {duty.siswaIds.length} Petugas
                  </span>
                </div>

                {isAdmin && (
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleOpenEditDuty(duty)}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 text-xs font-bold text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/80 hover:bg-blue-50 dark:hover:bg-blue-950/50 transition-all shadow-2xs"
                      title={`Ubah susunan anggota dan tugas piket hari ${duty.hari}`}
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                      <span>Edit</span>
                    </button>

                    {cleaningDuties.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleDeleteDutyCard(duty.hari)}
                        className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                        title={`Hapus jadwal piket hari ${duty.hari}`}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Card Body */}
              <div className="p-4 space-y-3.5 flex-1">
                {/* Waktu & Tugas Info */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <Clock className="h-3 w-3 text-slate-400" />
                      Waktu:
                    </span>
                    <span className="font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md text-[11px]">
                      {duty.waktuPiket || 'Pagi & Siang'}
                    </span>
                  </div>

                  {duty.tugasSpesifik && (
                    <p className="text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 leading-relaxed font-normal">
                      {duty.tugasSpesifik}
                    </p>
                  )}

                  {/* Area Tugas Badges */}
                  {duty.areaTugas && duty.areaTugas.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {duty.areaTugas.map((area, aIdx) => (
                        <span
                          key={`area-tag-${duty.hari}-${area}-${aIdx}`}
                          className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                        >
                          ✓ {area}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Member List */}
                <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    <span>Daftar Siswa Bertugas</span>
                    <span>{duty.siswaIds.length} Siswa</span>
                  </div>

                  {duty.siswaIds.length === 0 ? (
                    <div className="p-3 text-center rounded-xl bg-slate-50 dark:bg-slate-800/40 text-xs text-slate-400 border border-dashed border-slate-200 dark:border-slate-700">
                      Belum ada siswa yang ditugaskan.
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      {duty.siswaIds.map((sId, sIdx) => {
                        const student = students.find(s => s.id === sId);
                        if (!student) return null;
                        const isKetua = duty.ketuaPiket === student.nama || duty.ketuaPiket.includes(student.nama);

                        return (
                          <div
                            key={`member-${duty.hari}-${student.id}-${sIdx}`}
                            className={`flex items-center justify-between p-2 rounded-xl border transition-all ${
                              isKetua
                                ? 'bg-amber-50/80 border-amber-200 dark:bg-amber-950/30 dark:border-amber-800/60 shadow-2xs'
                                : 'bg-slate-50 border-slate-100 dark:bg-slate-800/50 dark:border-slate-800'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <img
                                src={student.fotoUrl}
                                alt={student.nama}
                                className="h-8 w-8 rounded-full object-cover ring-1 ring-slate-300 dark:ring-slate-700 shrink-0"
                              />
                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5">
                                  <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                                    {student.nama}
                                  </p>
                                  {isKetua && (
                                    <span className="inline-flex items-center gap-0.5 rounded-full bg-amber-500 px-1.5 py-0.2 text-[9px] font-black text-white shrink-0 shadow-2xs">
                                      <Crown className="h-2.5 w-2.5" />
                                      Ketua
                                    </span>
                                  )}
                                </div>
                                <p className="text-[10px] text-slate-400">
                                  No. {student.nomorAbsen} • NISN: {student.nisn}
                                </p>
                              </div>
                            </div>

                            {/* Actions per Member for Admin */}
                            {isAdmin && (
                              <div className="flex items-center gap-1 shrink-0">
                                {!isKetua && (
                                  <button
                                    type="button"
                                    onClick={() => handleQuickSetLeader(duty.hari, student.nama)}
                                    className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-100 dark:hover:bg-amber-950/50 transition-colors"
                                    title={`Jadikan ${student.nama} sebagai Ketua Piket hari ${duty.hari}`}
                                  >
                                    <Crown className="h-3.5 w-3.5" />
                                  </button>
                                )}
                                <button
                                  type="button"
                                  onClick={() => removeStudentFromDuty(duty.hari, student.id)}
                                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-100 dark:hover:bg-rose-950/50 transition-colors"
                                  title={`Hapus ${student.nama} dari piket ${duty.hari}`}
                                >
                                  <X className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Card Footer: Quick Add Student */}
              {isAdmin && (
                <div className="p-3 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  {quickAddDay === duty.hari ? (
                    <div className="flex items-center gap-1.5 w-full">
                      <select
                        className="flex-1 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 py-1.5 px-2.5 text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        defaultValue=""
                        onChange={(e) => {
                          if (e.target.value) {
                            addStudentToDuty(duty.hari, e.target.value);
                            setQuickAddDay(null);
                          }
                        }}
                      >
                        <option value="" disabled>Pilih Siswa untuk Ditambahkan...</option>
                        {unassignedStudents.map(s => (
                          <option key={`quick-opt-${duty.hari}-${s.id}`} value={s.id}>
                            No. {s.nomorAbsen} - {s.nama}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={() => setQuickAddDay(null)}
                        className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">
                        {duty.ketuaPiket ? `Ketua: ${duty.ketuaPiket.split(' ')[0]}` : 'Belum ada ketua'}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setQuickAddDay(duty.hari)}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-xs font-bold hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors"
                        >
                          <UserPlus className="h-3.5 w-3.5" />
                          <span>+ Tambah Siswa</span>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* SOP Piket Kebersihan Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-emerald-500" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Tata Tertib & SOP Regu Piket Kebersihan Kelas {schoolInfo.className}
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
            <p className="font-bold text-blue-600 dark:text-blue-400">1. Tugas Pagi (06:30 - 06:50)</p>
            <p className="text-slate-600 dark:text-slate-300">
              Hadir lebih awal, buka jendela ventilasi udara, lap papan tulis, dan siapkan spidol serta penghapus di meja guru.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
            <p className="font-bold text-emerald-600 dark:text-emerald-400">2. Jam Istirahat</p>
            <p className="text-slate-600 dark:text-slate-300">
              Mengingatkan teman-teman membuang sampah makanan ke tempat sampah terpilah (organik & anorganik).
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
            <p className="font-bold text-amber-600 dark:text-amber-400">3. Tugas Siang (Setelah Bel)</p>
            <p className="text-slate-600 dark:text-slate-300">
              Menyapu lantai, mengepel jika kotor, menaikkan kursi ke atas meja, dan merapikan buku pada pojok literasi.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
            <p className="font-bold text-purple-600 dark:text-purple-400">4. Penutupan & Keamanan</p>
            <p className="text-slate-600 dark:text-slate-300">
              Ketua piket memastikan seluruh lampu, kipas angin Tornado, smart monitor mati dan mengunci pintu kelas.
            </p>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL: TAMBAH REGU PIKET BARU */}
      {/* ========================================================================= */}
      {isAddDutyModalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setIsAddDutyModalOpen(false)}
          title="Tambah Jadwal & Regu Piket Baru"
          maxWidth="2xl"
        >
          <form onSubmit={handleSaveAddDuty} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Pilih / Buat Hari Piket
                </label>
                {newDuty.isCustomDay ? (
                  <div className="space-y-1.5">
                    <input
                      type="text"
                      required
                      value={newDuty.customHari}
                      onChange={(e) => setNewDuty(prev => ({ ...prev, customHari: e.target.value }))}
                      placeholder="Contoh: Jumat Bersih / Piket Khusus"
                      className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs sm:text-sm text-slate-900 dark:text-white font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setNewDuty(prev => ({ ...prev, isCustomDay: false }))}
                      className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                    >
                      ← Kembali ke pilihan hari standar
                    </button>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <select
                      value={newDuty.hari}
                      onChange={(e) => {
                        if (e.target.value === '__custom__') {
                          setNewDuty(prev => ({ ...prev, isCustomDay: true, customHari: '' }));
                        } else {
                          setNewDuty(prev => ({ ...prev, hari: e.target.value }));
                        }
                      }}
                      className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs sm:text-sm text-slate-900 dark:text-white font-medium"
                    >
                      {daysOfWeek.map((d) => (
                        <option key={`add-opt-day-${d}`} value={d}>Hari {d}</option>
                      ))}
                      <option value="__custom__">+ Hari / Jadwal Kustom Lainnya...</option>
                    </select>
                    <button
                      type="button"
                      onClick={() => setNewDuty(prev => ({ ...prev, isCustomDay: true, customHari: '' }))}
                      className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                    >
                      + Buat nama hari/jadwal kustom
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Waktu Pelaksanaan
                </label>
                <select
                  value={newDuty.waktuPiket}
                  onChange={(e) => setNewDuty(prev => ({ ...prev, waktuPiket: e.target.value }))}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs sm:text-sm text-slate-900 dark:text-white font-medium"
                >
                  <option value="Pagi & Siang">Pagi (Sebelum Bel) & Siang (Pulang Sekolah)</option>
                  <option value="Pagi (Sebelum Bel)">Pagi (Sebelum Bel Masuk 06.30 - 06.50)</option>
                  <option value="Siang (Pulang Sekolah)">Siang (Setelah Bel Pulang Sekolah)</option>
                </select>
              </div>
            </div>

            {/* Ketua Piket Selector */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Ketua Regu Piket
              </label>
              <select
                value={newDuty.ketuaPiket}
                onChange={(e) => setNewDuty(prev => ({ ...prev, ketuaPiket: e.target.value }))}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs sm:text-sm text-slate-900 dark:text-white font-medium"
              >
                <option value="">Pilih Ketua Regu Piket...</option>
                {newDuty.siswaIds.map((sId, sIdx) => {
                  const student = students.find(s => s.id === sId);
                  if (!student) return null;
                  return (
                    <option key={`new-leader-${student.id}-${sIdx}`} value={student.nama}>
                      👑 {student.nama} (No. Absen {student.nomorAbsen})
                    </option>
                  );
                })}
              </select>
              <p className="text-[11px] text-slate-500 mt-1">
                * Pilih dari daftar siswa yang dicentang di bawah untuk menjadi ketua piket.
              </p>
            </div>

            {/* Anggota Siswa Multi-Select */}
            <div className="space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="flex items-center gap-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Pilih Anggota Siswa ({newDuty.siswaIds.length} Terpilih)
                  </label>
                  <button
                    type="button"
                    onClick={handleSelectAllStudentsInAdd}
                    className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline font-bold"
                  >
                    {newDuty.siswaIds.length === students.length ? 'Batal Semua' : 'Pilih Semua'}
                  </button>
                </div>
                <div className="relative w-full sm:w-48">
                  <Search className="h-3.5 w-3.5 absolute left-2.5 top-2 text-slate-400" />
                  <input
                    type="text"
                    value={addStudentSearchQuery}
                    onChange={(e) => setAddStudentSearchQuery(e.target.value)}
                    placeholder="Cari nama siswa..."
                    className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 py-1 pl-8 pr-2 text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="max-h-48 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-2 p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40">
                {students
                  .filter(s => s.nama.toLowerCase().includes(addStudentSearchQuery.toLowerCase()))
                  .map((student) => {
                    const isSelected = newDuty.siswaIds.includes(student.id);
                    return (
                      <label
                        key={`chk-add-modal-student-${student.id}`}
                        className={`flex items-center gap-2.5 p-2 rounded-xl border cursor-pointer select-none transition-all ${
                          isSelected
                            ? 'bg-blue-50 border-blue-300 text-blue-900 dark:bg-blue-950/60 dark:border-blue-700 dark:text-blue-200 font-bold'
                            : 'bg-white border-slate-200 text-slate-700 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 hover:bg-slate-100'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleAddStudentSelection(student.id)}
                          className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                        <img
                          src={student.fotoUrl}
                          alt={student.nama}
                          className="h-6 w-6 rounded-full object-cover"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs truncate">{student.nama}</p>
                          <p className="text-[10px] text-slate-400 font-normal">Absen {student.nomorAbsen}</p>
                        </div>
                      </label>
                    );
                  })}
              </div>
            </div>

            {/* Checklist Area Kebersihan */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Area Tugas & Fokus Kebersihan
              </label>
              <div className="flex flex-wrap gap-1.5">
                {availableAreas.map((area, aIdx) => {
                  const isChecked = newDuty.areaTugas.includes(area);
                  return (
                    <button
                      key={`add-btn-area-${area}-${aIdx}`}
                      type="button"
                      onClick={() => handleToggleAddArea(area)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
                        isChecked
                          ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                          : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {isChecked ? '✓ ' : '+ '}{area}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Catatan Tugas */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Instruksi Khusus / Catatan Tambahan
              </label>
              <textarea
                rows={2}
                value={newDuty.tugasSpesifik}
                onChange={(e) => setNewDuty(prev => ({ ...prev, tugasSpesifik: e.target.value }))}
                placeholder="Contoh: Menyapu ruang kelas, mengepel teras depan, hapus papan tulis, dan buang sampah..."
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs sm:text-sm text-slate-900 dark:text-white"
              />
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setIsAddDutyModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-blue-600 text-xs font-bold text-white shadow-md shadow-blue-600/30 hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>Tambahkan Jadwal Piket</span>
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* ========================================================================= */}
      {/* MODAL: UBAH / EDIT JADWAL REGU PIKET */}
      {/* ========================================================================= */}
      {isEditDutyModalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setIsEditDutyModalOpen(false)}
          title={`Ubah & Atur Regu Piket Hari ${editingDuty.hari}`}
          maxWidth="2xl"
        >
          <form onSubmit={handleSaveEditDuty} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Hari Piket
                </label>
                <select
                  value={editingDuty.hari}
                  onChange={(e) => {
                    const nextDay = e.target.value;
                    const existingForDay = cleaningDuties.find(d => d.hari === nextDay);
                    if (existingForDay) {
                      setEditingDuty({
                        hari: existingForDay.hari,
                        siswaIds: [...existingForDay.siswaIds],
                        ketuaPiket: existingForDay.ketuaPiket || '',
                        tugasSpesifik: existingForDay.tugasSpesifik || '',
                        areaTugas: existingForDay.areaTugas || ['Papan Tulis & Spidol', 'Sapu & Pel Lantai'],
                        waktuPiket: existingForDay.waktuPiket || 'Pagi & Siang'
                      });
                    } else {
                      setEditingDuty(prev => ({ ...prev, hari: nextDay }));
                    }
                  }}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs sm:text-sm text-slate-900 dark:text-white font-medium"
                >
                  {cleaningDuties.map((d) => (
                    <option key={`edit-opt-duty-day-${d.hari}`} value={d.hari}>Hari {d.hari}</option>
                  ))}
                  {daysOfWeek
                    .filter(d => !cleaningDuties.some(cd => cd.hari === d))
                    .map((d) => (
                      <option key={`edit-opt-free-day-${d}`} value={d}>Hari {d} (Baru)</option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Waktu Pelaksanaan
                </label>
                <select
                  value={editingDuty.waktuPiket}
                  onChange={(e) => setEditingDuty(prev => ({ ...prev, waktuPiket: e.target.value }))}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs sm:text-sm text-slate-900 dark:text-white font-medium"
                >
                  <option value="Pagi & Siang">Pagi (Sebelum Bel) & Siang (Pulang Sekolah)</option>
                  <option value="Pagi (Sebelum Bel)">Pagi (Sebelum Bel Masuk 06.30 - 06.50)</option>
                  <option value="Siang (Pulang Sekolah)">Siang (Setelah Bel Pulang Sekolah)</option>
                </select>
              </div>
            </div>

            {/* Ketua Piket */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Ketua Regu Piket ({editingDuty.hari})
              </label>
              <select
                value={editingDuty.ketuaPiket}
                onChange={(e) => setEditingDuty(prev => ({ ...prev, ketuaPiket: e.target.value }))}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs sm:text-sm text-slate-900 dark:text-white font-medium"
              >
                <option value="">Pilih Ketua Regu Piket...</option>
                {editingDuty.siswaIds.map((sId, sIdx) => {
                  const student = students.find(s => s.id === sId);
                  if (!student) return null;
                  return (
                    <option key={`opt-leader-${student.id}-${sIdx}`} value={student.nama}>
                      👑 {student.nama} (No. Absen {student.nomorAbsen})
                    </option>
                  );
                })}
              </select>
              <p className="text-[11px] text-slate-500 mt-1">
                * Ketua regu bertanggung jawab memeriksa kebersihan akhir dan mematikan peralatan listrik.
              </p>
            </div>

            {/* Anggota Siswa Multi-Select */}
            <div className="space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="flex items-center gap-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Pilih Anggota Siswa ({editingDuty.siswaIds.length} Terpilih)
                  </label>
                  <button
                    type="button"
                    onClick={handleSelectAllStudentsInEdit}
                    className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline font-bold"
                  >
                    {editingDuty.siswaIds.length === students.length ? 'Batal Semua' : 'Pilih Semua'}
                  </button>
                </div>
                <div className="relative w-full sm:w-48">
                  <Search className="h-3.5 w-3.5 absolute left-2.5 top-2 text-slate-400" />
                  <input
                    type="text"
                    value={studentSearchQuery}
                    onChange={(e) => setStudentSearchQuery(e.target.value)}
                    placeholder="Cari nama siswa..."
                    className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 py-1 pl-8 pr-2 text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="max-h-48 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-2 p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40">
                {students
                  .filter(s => s.nama.toLowerCase().includes(studentSearchQuery.toLowerCase()))
                  .map((student) => {
                    const isSelected = editingDuty.siswaIds.includes(student.id);
                    return (
                      <label
                        key={`chk-modal-student-${student.id}`}
                        className={`flex items-center gap-2.5 p-2 rounded-xl border cursor-pointer select-none transition-all ${
                          isSelected
                            ? 'bg-blue-50 border-blue-300 text-blue-900 dark:bg-blue-950/60 dark:border-blue-700 dark:text-blue-200 font-bold'
                            : 'bg-white border-slate-200 text-slate-700 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 hover:bg-slate-100'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleEditStudentSelection(student.id)}
                          className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                        <img
                          src={student.fotoUrl}
                          alt={student.nama}
                          className="h-6 w-6 rounded-full object-cover"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs truncate">{student.nama}</p>
                          <p className="text-[10px] text-slate-400 font-normal">Absen {student.nomorAbsen}</p>
                        </div>
                      </label>
                    );
                  })}
              </div>
            </div>

            {/* Checklist Area Kebersihan */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Area Tugas & Fokus Kebersihan
              </label>
              <div className="flex flex-wrap gap-1.5">
                {availableAreas.map((area, aIdx) => {
                  const isChecked = editingDuty.areaTugas.includes(area);
                  return (
                    <button
                      key={`btn-area-${area}-${aIdx}`}
                      type="button"
                      onClick={() => handleToggleEditArea(area)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
                        isChecked
                          ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                          : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {isChecked ? '✓ ' : '+ '}{area}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Catatan Tugas */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Instruksi Khusus / Catatan Tambahan
              </label>
              <textarea
                rows={2}
                value={editingDuty.tugasSpesifik}
                onChange={(e) => setEditingDuty(prev => ({ ...prev, tugasSpesifik: e.target.value }))}
                placeholder="Contoh: Menyapu ruang kelas, mengepel teras depan, hapus papan tulis, dan buang sampah..."
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs sm:text-sm text-slate-900 dark:text-white"
              />
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-800">
              {cleaningDuties.length > 1 ? (
                <button
                  type="button"
                  onClick={() => {
                    handleDeleteDutyCard(editingDuty.hari);
                    setIsEditDutyModalOpen(false);
                  }}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Hapus Jadwal Hari Ini</span>
                </button>
              ) : <div />}

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditDutyModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-blue-600 text-xs font-bold text-white shadow-md shadow-blue-600/30 hover:bg-blue-700 transition-colors"
                >
                  <Check className="h-4 w-4" />
                  <span>Simpan Perubahan</span>
                </button>
              </div>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
