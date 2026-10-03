import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { Teacher } from '../../types';
import {
  GraduationCap,
  School,
  UserCheck,
  Users,
  Check,
  Sparkles,
  Save,
  BookOpen,
  Calendar,
  Layers,
  Award,
  AlertCircle,
  Plus,
  Edit2,
  Trash2,
  Phone,
  Mail,
  ShieldCheck
} from 'lucide-react';

interface ModalEditKelasFaseGuruProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'kelas_fase' | 'wali_kelas' | 'daftar_guru';
}

export const ModalEditKelasFaseGuru: React.FC<ModalEditKelasFaseGuruProps> = ({
  isOpen,
  onClose,
  initialTab = 'kelas_fase'
}) => {
  const {
    schoolInfo,
    updateSchoolInfo,
    teachers,
    addTeacher,
    updateTeacher,
    deleteTeacher,
    currentUser,
    setCurrentTab,
    addToast
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'kelas_fase' | 'wali_kelas' | 'daftar_guru'>('kelas_fase');

  // Form State for Class & Phase
  const [formData, setFormData] = useState({
    className: schoolInfo.className || '4A',
    phase: schoolInfo.phase || 'Fase B (Kelas 3-4)',
    semester: schoolInfo.semester || '1 (Ganjil)',
    academicYear: schoolInfo.academicYear || '2026/2027',
    kurikulum: schoolInfo.kurikulum || 'Kurikulum Merdeka',
    schoolName: schoolInfo.schoolName || '',
    npsn: schoolInfo.npsn || '',
    homeroomTeacherName: schoolInfo.homeroomTeacherName || '',
    homeroomTeacherNip: schoolInfo.homeroomTeacherNip || '',
    headmasterName: schoolInfo.headmasterName || '',
    headmasterNip: schoolInfo.headmasterNip || ''
  });

  // Quick Teacher Form State
  const [isAddTeacherOpen, setIsAddTeacherOpen] = useState(false);
  const [editingTeacherId, setEditingTeacherId] = useState<string | null>(null);
  const [teacherForm, setTeacherForm] = useState<Omit<Teacher, 'id'>>({
    nama: '',
    nip: '-',
    jenisKelamin: 'L',
    jabatan: 'Guru Mata Pelajaran',
    jenisGuru: 'Guru Mapel',
    statusKepegawaian: 'PNS',
    statusAktif: 'Aktif',
    pendidikanTerakhir: 'S1 PGSD',
    noHp: '',
    email: '',
    alamat: 'Jakarta',
    fotoUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80'
  });

  // Sync state when modal opens
  useEffect(() => {
    if (isOpen) {
      setActiveSubTab(initialTab);
      setFormData({
        className: schoolInfo.className || '4A',
        phase: schoolInfo.phase || 'Fase B (Kelas 3-4)',
        semester: schoolInfo.semester || '1 (Ganjil)',
        academicYear: schoolInfo.academicYear || '2026/2027',
        kurikulum: schoolInfo.kurikulum || 'Kurikulum Merdeka',
        schoolName: schoolInfo.schoolName || '',
        npsn: schoolInfo.npsn || '',
        homeroomTeacherName: schoolInfo.homeroomTeacherName || '',
        homeroomTeacherNip: schoolInfo.homeroomTeacherNip || '',
        headmasterName: schoolInfo.headmasterName || '',
        headmasterNip: schoolInfo.headmasterNip || ''
      });
      setIsAddTeacherOpen(false);
      setEditingTeacherId(null);
    }
  }, [isOpen, schoolInfo, initialTab]);

  // Preset Phase Options
  const phaseOptions = [
    {
      id: 'Fase A (Kelas 1-2)',
      label: 'Fase A (Kelas 1 & 2)',
      desc: 'Fondasi literasi, numerasi awal, dan pembiasaan karakter peserta didik baru.',
      gradeLevels: ['1A', '1B', '2A', '2B']
    },
    {
      id: 'Fase B (Kelas 3-4)',
      label: 'Fase B (Kelas 3 & 4)',
      desc: 'Pengembangan pemahaman konseptual, literasi teks narasi, dan IPAS dasar.',
      gradeLevels: ['3A', '3B', '4A', '4B']
    },
    {
      id: 'Fase C (Kelas 5-6)',
      label: 'Fase C (Kelas 5 & 6)',
      desc: 'Penguatan analisis, pemecahan masalah, kemandirian belajar, & persiapan jenjang SMP.',
      gradeLevels: ['5A', '5B', '6A', '6B']
    }
  ];

  const handleSelectHomeroomTeacherPreset = (teacher: Teacher) => {
    setFormData(prev => ({
      ...prev,
      homeroomTeacherName: teacher.nama,
      homeroomTeacherNip: teacher.nip || '-'
    }));
    addToast('info', 'Wali Kelas Dipilih', `Data wali kelas otomatis disesuaikan dengan profil ${teacher.nama}.`);
  };

  const handleSelectHeadmasterPreset = (teacher: Teacher) => {
    setFormData(prev => ({
      ...prev,
      headmasterName: teacher.nama,
      headmasterNip: teacher.nip || '-'
    }));
    addToast('info', 'Kepala Sekolah Dipilih', `Data kepala sekolah disesuaikan dengan profil ${teacher.nama}.`);
  };

  const handleSaveAll = (e: React.FormEvent) => {
    e.preventDefault();
    updateSchoolInfo({
      className: formData.className.trim(),
      phase: formData.phase,
      semester: formData.semester as '1 (Ganjil)' | '2 (Genap)',
      academicYear: formData.academicYear.trim(),
      kurikulum: formData.kurikulum as 'Kurikulum Merdeka' | 'Kurikulum 2013',
      schoolName: formData.schoolName.trim(),
      npsn: formData.npsn.trim(),
      homeroomTeacherName: formData.homeroomTeacherName.trim(),
      homeroomTeacherNip: formData.homeroomTeacherNip.trim(),
      headmasterName: formData.headmasterName.trim(),
      headmasterNip: formData.headmasterNip.trim()
    });

    // Also update matching teacher entry in teachers list if exists
    const matchingHomeroom = teachers.find(
      t => t.jabatan.toLowerCase().includes('wali') || t.nama.toLowerCase() === formData.homeroomTeacherName.toLowerCase()
    );
    if (matchingHomeroom && formData.homeroomTeacherName) {
      updateTeacher(matchingHomeroom.id, {
        nama: formData.homeroomTeacherName,
        nip: formData.homeroomTeacherNip
      });
    }

    addToast('success', 'Perubahan Disimpan', `Data Kelas ${formData.className}, ${formData.phase}, dan Guru berhasil diperbarui!`);
    onClose();
  };

  const handleSaveTeacherForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teacherForm.nama.trim()) {
      addToast('error', 'Nama Wajib Diisi', 'Silakan masukkan nama lengkap dan gelar guru.');
      return;
    }

    if (editingTeacherId) {
      updateTeacher(editingTeacherId, teacherForm);
      addToast('success', 'Guru Diperbarui', `Data ${teacherForm.nama} berhasil disimpan.`);
    } else {
      addTeacher(teacherForm);
      addToast('success', 'Guru Ditambahkan', `${teacherForm.nama} berhasil ditambahkan ke daftar pendidik.`);
    }

    setIsAddTeacherOpen(false);
    setEditingTeacherId(null);
  };

  const handleEditTeacherClick = (teacher: Teacher) => {
    setEditingTeacherId(teacher.id);
    setTeacherForm({
      nama: teacher.nama,
      nip: teacher.nip || '-',
      jenisKelamin: teacher.jenisKelamin,
      jabatan: teacher.jabatan,
      jenisGuru: teacher.jenisGuru,
      statusKepegawaian: teacher.statusKepegawaian || 'PNS',
      statusAktif: teacher.statusAktif || 'Aktif',
      pendidikanTerakhir: teacher.pendidikanTerakhir || 'S1 PGSD',
      noHp: teacher.noHp || '',
      email: teacher.email || '',
      alamat: teacher.alamat || 'Jakarta',
      fotoUrl: teacher.fotoUrl || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80'
    });
    setIsAddTeacherOpen(true);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Pengaturan Kelas, Fase & Guru"
      subtitle="Edit identitas rombongan belajar, fase Kurikulum Merdeka, data wali kelas, dan daftar pendidik pengampu."
      icon={<School className="h-6 w-6 text-blue-600 dark:text-blue-400" />}
      maxWidth="3xl"
    >
      {/* Sub Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 -mx-6 px-6 mb-6 gap-2 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveSubTab('kelas_fase')}
          className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
            activeSubTab === 'kelas_fase'
              ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
        >
          <GraduationCap className="h-4 w-4" />
          <span>1. Kelas & Fase Kurikulum</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('wali_kelas')}
          className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
            activeSubTab === 'wali_kelas'
              ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
        >
          <UserCheck className="h-4 w-4" />
          <span>2. Wali Kelas & Kepala Sekolah</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('daftar_guru')}
          className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
            activeSubTab === 'daftar_guru'
              ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
        >
          <Users className="h-4 w-4" />
          <span>3. Daftar Guru & Pendidik ({teachers.length})</span>
        </button>
      </div>

      {/* Content Form */}
      <form onSubmit={handleSaveAll} className="space-y-6">
        {/* TAB 1: KELAS & FASE */}
        {activeSubTab === 'kelas_fase' && (
          <div className="space-y-5">
            {/* Banner info */}
            <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-100 dark:bg-blue-950/40 dark:border-blue-900/60 text-xs text-blue-800 dark:text-blue-300 flex items-start gap-2.5">
              <Sparkles className="h-4 w-4 shrink-0 mt-0.5 text-blue-600 dark:text-blue-400" />
              <div>
                <p className="font-bold">Konfigurasi Rombongan Belajar & Fase Kurikulum Merdeka</p>
                <p className="mt-0.5 text-blue-700/80 dark:text-blue-300/80">
                  Perubahan nama kelas dan fase akan otomatis menyesuaikan header aplikasi, kop dokumen cetak, raport, buku induk, dan kartu penilaian siswa.
                </p>
              </div>
            </div>

            {/* Baris 1: Rombel Kelas (Lega & Terlihat Semua) + Tahun Pelajaran (Ramping Sesuai Kebutuhan) */}
            <div className="flex flex-col lg:flex-row gap-4 items-start">
              {/* Kolom Nama / Nomor Rombel Kelas - Diberikan porsi utama yang lega agar seluruh pilihan terlihat semua */}
              <div className="flex-1 w-full">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Nama / Nomor Rombel Kelas <span className="text-rose-500">*</span>
                  </label>
                  <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400">
                    Terpilih: Kelas <span className="font-black underline">{formData.className || '-'}</span>
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center">
                  {/* Input Teks untuk Kustom Nama Rombel */}
                  <div className="relative w-full sm:w-32 shrink-0">
                    <input
                      type="text"
                      required
                      placeholder="Cth: 4A"
                      value={formData.className}
                      onChange={e => setFormData({ ...formData, className: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs text-slate-800 dark:text-white font-bold text-center focus:outline-none focus:border-blue-500 shadow-xs"
                    />
                  </div>

                  {/* Pilihan Cepat Rombel Kelas - Terlihat Semua dan Tidak Terpotong */}
                  <div className="flex-1 flex flex-wrap items-center gap-1.5">
                    {/* Grup Rombel A (1A - 6A) */}
                    <div className="flex items-center gap-1 bg-slate-100/90 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
                      <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 px-1">Rombel A:</span>
                      {['1A', '2A', '3A', '4A', '5A', '6A'].map(cls => (
                        <button
                          key={cls}
                          type="button"
                          onClick={() => {
                            const updated: any = { className: cls };
                            if (cls.startsWith('1') || cls.startsWith('2')) updated.phase = 'Fase A (Kelas 1-2)';
                            else if (cls.startsWith('3') || cls.startsWith('4')) updated.phase = 'Fase B (Kelas 3-4)';
                            else if (cls.startsWith('5') || cls.startsWith('6')) updated.phase = 'Fase C (Kelas 5-6)';
                            setFormData({ ...formData, ...updated });
                          }}
                          className={`px-2 py-1 text-[11px] font-bold rounded-lg border transition-all cursor-pointer ${
                            formData.className === cls
                              ? 'bg-blue-600 text-white border-blue-600 shadow-xs ring-1 ring-blue-500/40'
                              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:text-blue-600 hover:border-blue-300'
                          }`}
                          title={`Pilih Rombel ${cls}`}
                        >
                          {cls}
                        </button>
                      ))}
                    </div>

                    {/* Grup Rombel B (1B - 6B) */}
                    <div className="flex items-center gap-1 bg-slate-100/90 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
                      <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 px-1">Rombel B:</span>
                      {['1B', '2B', '3B', '4B', '5B', '6B'].map(cls => (
                        <button
                          key={cls}
                          type="button"
                          onClick={() => {
                            const updated: any = { className: cls };
                            if (cls.startsWith('1') || cls.startsWith('2')) updated.phase = 'Fase A (Kelas 1-2)';
                            else if (cls.startsWith('3') || cls.startsWith('4')) updated.phase = 'Fase B (Kelas 3-4)';
                            else if (cls.startsWith('5') || cls.startsWith('6')) updated.phase = 'Fase C (Kelas 5-6)';
                            setFormData({ ...formData, ...updated });
                          }}
                          className={`px-2 py-1 text-[11px] font-bold rounded-lg border transition-all cursor-pointer ${
                            formData.className === cls
                              ? 'bg-blue-600 text-white border-blue-600 shadow-xs ring-1 ring-blue-500/40'
                              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:text-blue-600 hover:border-blue-300'
                          }`}
                          title={`Pilih Rombel ${cls}`}
                        >
                          {cls}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-[11px] text-slate-400 mt-1.5">
                  Klik tombol rombel kelas di atas (1A–6A / 1B–6B) atau ketik kustom di kolom sebelah kiri.
                </p>
              </div>

              {/* Kolom Tahun Pelajaran - Dirapikan lebih kecil & proporsional sesuai kebutuhan isi teks */}
              <div className="w-full lg:w-44 shrink-0">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Tahun Pelajaran <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="2026/2027"
                  value={formData.academicYear}
                  onChange={e => setFormData({ ...formData, academicYear: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs text-slate-800 dark:text-white font-mono font-bold text-center tracking-wide focus:outline-none focus:border-blue-500 shadow-xs"
                />
                <div className="flex items-center justify-between gap-1 mt-1.5">
                  {['2025/2026', '2026/2027', '2027/2028'].map(yr => (
                    <button
                      key={yr}
                      type="button"
                      onClick={() => setFormData({ ...formData, academicYear: yr })}
                      className={`flex-1 py-0.5 px-1 text-[10px] font-mono rounded-md border text-center transition-all cursor-pointer ${
                        formData.academicYear === yr
                          ? 'bg-blue-50 border-blue-300 text-blue-700 dark:bg-blue-950 dark:border-blue-700 dark:text-blue-300 font-bold'
                          : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                      }`}
                      title={`Pilih Tahun Pelajaran ${yr}`}
                    >
                      {yr.split('/')[0].slice(2)}/{yr.split('/')[1].slice(2)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Baris 2: Semester Aktif & Kurikulum Digunakan */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Semester Aktif <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.semester}
                  onChange={e => setFormData({ ...formData, semester: e.target.value as '1 (Ganjil)' | '2 (Genap)' })}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs text-slate-800 dark:text-white font-semibold focus:outline-none focus:border-blue-500 shadow-sm"
                >
                  <option value="1 (Ganjil)">Semester 1 (Ganjil)</option>
                  <option value="2 (Genap)">Semester 2 (Genap)</option>
                </select>
                <p className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-1 font-medium">
                  ✓ Nilai terisolasi aman: Nilai semester sebelumnya tidak hilang saat beralih semester.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Kurikulum Digunakan <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.kurikulum}
                  onChange={e => setFormData({ ...formData, kurikulum: e.target.value as any })}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs text-slate-800 dark:text-white font-semibold focus:outline-none focus:border-blue-500 shadow-sm"
                >
                  <option value="Kurikulum Merdeka">Kurikulum Merdeka (Capaian Pembelajaran & TP)</option>
                  <option value="Kurikulum 2013">Kurikulum 2013 (Kompetensi Dasar / KD)</option>
                </select>
              </div>
            </div>

            {/* Pilihan Fase Kurikulum Merdeka Cards */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                Pilih Fase Kurikulum Merdeka <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {phaseOptions.map(option => {
                  const isSelected = formData.phase === option.id || formData.phase.includes(option.id.substring(0, 6));
                  return (
                    <div
                      key={option.id}
                      onClick={() => setFormData({ ...formData, phase: option.id })}
                      className={`cursor-pointer rounded-2xl p-4 border-2 transition-all relative ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/70 dark:border-blue-500 dark:bg-blue-950/50 shadow-sm ring-2 ring-blue-500/20'
                          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className={`text-xs font-black ${
                          isSelected ? 'text-blue-700 dark:text-blue-300' : 'text-slate-800 dark:text-slate-200'
                        }`}>
                          {option.label}
                        </span>
                        {isSelected && (
                          <div className="h-5 w-5 rounded-full bg-blue-600 text-white flex items-center justify-center">
                            <Check className="h-3 w-3" />
                          </div>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed mb-3">
                        {option.desc}
                      </p>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-semibold text-slate-400">Rekomendasi Kelas:</span>
                        <div className="flex gap-1">
                          {option.gradeLevels.map(lvl => (
                            <span
                              key={lvl}
                              className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                formData.className === lvl
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                              }`}
                            >
                              {lvl}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* School Name & NPSN quick field */}
            <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <School className="h-3.5 w-3.5 text-slate-500" />
                  Nama Satuan Pendidikan
                </span>
                <span className="text-[11px] text-slate-400">Tampil pada Kop Surat & Rapor</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <input
                    type="text"
                    required
                    placeholder="Nama Sekolah Dasar"
                    value={formData.schoolName}
                    onChange={e => setFormData({ ...formData, schoolName: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs text-slate-800 dark:text-white font-medium focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="NPSN Sekolah (cth: 20101234)"
                    value={formData.npsn}
                    onChange={e => setFormData({ ...formData, npsn: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs text-slate-800 dark:text-white font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: WALI KELAS & KEPALA SEKOLAH */}
        {activeSubTab === 'wali_kelas' && (
          <div className="space-y-5">
            {/* Quick Picker from Teacher List */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 p-4">
              <div className="flex items-center justify-between mb-2.5">
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  Pilih Cepat dari Daftar Guru Sekolah
                </h4>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  Klik untuk mengisi nama & NIP secara instan
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {teachers.slice(0, 6).map(t => (
                  <div
                    key={t.id}
                    className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-xs"
                  >
                    <div className="truncate pr-2">
                      <p className="font-bold text-slate-800 dark:text-white truncate">{t.nama}</p>
                      <p className="text-[10px] text-slate-400 truncate">{t.jabatan}</p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleSelectHomeroomTeacherPreset(t)}
                        title="Jadikan Wali Kelas"
                        className="px-2 py-1 text-[10px] font-bold rounded-lg bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/60 dark:hover:bg-blue-900 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
                      >
                        Wali Kls
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSelectHeadmasterPreset(t)}
                        title="Jadikan Kepala Sekolah"
                        className="px-2 py-1 text-[10px] font-bold rounded-lg bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:hover:bg-emerald-900 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                      >
                        Kepsek
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Wali Kelas Fields */}
            <div className="rounded-2xl border border-blue-100 dark:border-blue-900/60 bg-blue-50/40 dark:bg-blue-950/20 p-4 space-y-3">
              <div className="flex items-center gap-2 text-blue-900 dark:text-blue-300">
                <UserCheck className="h-4 w-4" />
                <h4 className="text-xs font-bold uppercase tracking-wider">Identitas Wali Kelas</h4>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Nama Lengkap & Gelar Wali Kelas <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Sri Wahyuni, S.Pd., Gr."
                    value={formData.homeroomTeacherName}
                    onChange={e => setFormData({ ...formData, homeroomTeacherName: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs text-slate-800 dark:text-white font-semibold focus:outline-none focus:border-blue-500 shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    NIP / NUPTK Wali Kelas
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: 19880415 201201 2 004 atau '-'"
                    value={formData.homeroomTeacherNip}
                    onChange={e => setFormData({ ...formData, homeroomTeacherNip: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs text-slate-800 dark:text-white font-mono focus:outline-none focus:border-blue-500 shadow-sm"
                  />
                </div>
              </div>
            </div>

            {/* Kepala Sekolah Fields */}
            <div className="rounded-2xl border border-emerald-100 dark:border-emerald-900/60 bg-emerald-50/40 dark:bg-emerald-950/20 p-4 space-y-3">
              <div className="flex items-center gap-2 text-emerald-900 dark:text-emerald-300">
                <Award className="h-4 w-4" />
                <h4 className="text-xs font-bold uppercase tracking-wider">Identitas Kepala Sekolah</h4>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Nama Lengkap & Gelar Kepala Sekolah <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Drs. H. Bambang Sudarmono, M.Pd."
                    value={formData.headmasterName}
                    onChange={e => setFormData({ ...formData, headmasterName: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs text-slate-800 dark:text-white font-semibold focus:outline-none focus:border-emerald-500 shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    NIP Kepala Sekolah
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: 19680512 199303 1 003 atau '-'"
                    value={formData.headmasterNip}
                    onChange={e => setFormData({ ...formData, headmasterNip: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs text-slate-800 dark:text-white font-mono focus:outline-none focus:border-emerald-500 shadow-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: DAFTAR GURU & PENDIDIK */}
        {activeSubTab === 'daftar_guru' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 dark:bg-slate-900/60 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800">
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Users className="h-4 w-4 text-blue-600" />
                  Daftar Pendidik & Tenaga Kependidikan ({teachers.length} Orang)
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Guru kelas, guru bidang studi / mapel, dan tendik yang bertugas di satuan pendidikan.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setEditingTeacherId(null);
                    setTeacherForm({
                      nama: '',
                      nip: '-',
                      jenisKelamin: 'L',
                      jabatan: 'Guru Mata Pelajaran',
                      jenisGuru: 'Guru Mapel',
                      statusKepegawaian: 'PNS',
                      statusAktif: 'Aktif',
                      pendidikanTerakhir: 'S1 PGSD',
                      noHp: '',
                      email: '',
                      alamat: 'Jakarta',
                      fotoUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80'
                    });
                    setIsAddTeacherOpen(true);
                  }}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl bg-blue-600 text-white hover:bg-blue-700 shadow-sm transition-all"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Tambah Guru Baru</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    setCurrentTab('guru');
                  }}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 transition-all"
                >
                  <BookOpen className="h-3.5 w-3.5" />
                  <span>Buka Menu Buku Guru</span>
                </button>
              </div>
            </div>

            {/* Quick Add/Edit Teacher Inline Subform */}
            {isAddTeacherOpen && (
              <div className="p-4 rounded-2xl border-2 border-blue-400/50 bg-blue-50/50 dark:bg-blue-950/40 space-y-3">
                <div className="flex items-center justify-between">
                  <h5 className="text-xs font-bold text-blue-900 dark:text-blue-300 flex items-center gap-1.5">
                    <Edit2 className="h-3.5 w-3.5" />
                    {editingTeacherId ? 'Edit Data Pendidik / Guru' : 'Form Tambah Guru Baru'}
                  </h5>
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddTeacherOpen(false);
                      setEditingTeacherId(null);
                    }}
                    className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-semibold"
                  >
                    Batal
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Nama Lengkap & Gelar *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Ust. Ahmad Fauzan, S.Pd.I"
                      value={teacherForm.nama}
                      onChange={e => setTeacherForm({ ...teacherForm, nama: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-xs font-semibold text-slate-800 dark:text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                      NIP / NUPTK
                    </label>
                    <input
                      type="text"
                      placeholder="NIP atau '-'"
                      value={teacherForm.nip}
                      onChange={e => setTeacherForm({ ...teacherForm, nip: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-xs font-mono text-slate-800 dark:text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Jabatan Tugas *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="cth: Guru PAI & BP / Guru PJOK"
                      value={teacherForm.jabatan}
                      onChange={e => setTeacherForm({ ...teacherForm, jabatan: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Jenis Guru *
                    </label>
                    <select
                      value={teacherForm.jenisGuru}
                      onChange={e => setTeacherForm({ ...teacherForm, jenisGuru: e.target.value as any })}
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-blue-500"
                    >
                      <option value="Guru Kelas">Guru Kelas</option>
                      <option value="Guru Mapel">Guru Mata Pelajaran</option>
                      <option value="Kepala Sekolah">Kepala Sekolah</option>
                      <option value="Guru BK">Guru BK / Bimbingan</option>
                      <option value="Tenaga Kependidikan">Tenaga Kependidikan / TU</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Status Kepegawaian
                    </label>
                    <select
                      value={teacherForm.statusKepegawaian}
                      onChange={e => setTeacherForm({ ...teacherForm, statusKepegawaian: e.target.value as any })}
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-blue-500"
                    >
                      <option value="PNS">PNS / ASN</option>
                      <option value="PPPK">PPPK</option>
                      <option value="Guru Tetap Yayasan">Guru Tetap Yayasan (GTY)</option>
                      <option value="GTT / Honorer">GTT / Honorer</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={handleSaveTeacherForm}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-blue-600 text-white hover:bg-blue-700"
                  >
                    <Check className="h-3.5 w-3.5" />
                    <span>{editingTeacherId ? 'Simpan Guru' : 'Tambahkan Guru'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* List of Teachers */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-72 overflow-y-auto pr-1">
              {(teachers || []).map(t => {
                const isHomeroom = t.nama.toLowerCase() === formData.homeroomTeacherName.toLowerCase() || t.jabatan.toLowerCase().includes('wali');
                const isHeadmaster = t.nama.toLowerCase() === formData.headmasterName.toLowerCase() || t.jabatan.toLowerCase().includes('kepala sekolah');

                return (
                  <div
                    key={t.id}
                    className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm"
                  >
                    <div className="flex items-center gap-2.5 truncate pr-2">
                      <div className="h-9 w-9 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden shrink-0 border border-slate-200 dark:border-slate-700">
                        {t.fotoUrl ? (
                          <img src={t.fotoUrl} alt={t.nama} className="h-full w-full object-cover" />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center font-bold text-slate-500">
                            {t.nama.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div className="truncate">
                        <div className="flex items-center gap-1.5">
                          <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{t.nama}</p>
                          {isHomeroom && (
                            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                              Wali Kelas
                            </span>
                          )}
                          {isHeadmaster && (
                            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                              Kepsek
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                          {t.jabatan} • NIP: {t.nip}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleEditTeacherClick(t)}
                        title="Edit Data Guru"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/60 transition-colors"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
          <div className="text-[11px] text-slate-500 dark:text-slate-400">
            Perubahan otomatis tersimpan ke memori aplikasi.
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Tutup
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold rounded-xl bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-500/20 active:scale-95 transition-all"
            >
              <Save className="h-4 w-4" />
              <span>Simpan Perubahan</span>
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
};
