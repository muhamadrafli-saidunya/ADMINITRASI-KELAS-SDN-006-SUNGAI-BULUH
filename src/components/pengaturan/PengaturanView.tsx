import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { SchoolInfo } from '../../types';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { UserManagementSection } from './UserManagementSection';
import { RolePermissionsMatrixSection } from './RolePermissionsMatrixSection';
import { LogoKopSection } from './LogoKopSection';
import { TemaDanTampilanSection } from './TemaDanTampilanSection';
import { KurikulumFaseSelectorModal } from '../common/KurikulumFaseSelectorModal';
import {
  CURRICULUM_PHASE_PRESETS,
  CurriculumPhaseKey,
  detectPhaseKey
} from '../../data/kurikulumMerdekaPresets';
import {
  Settings,
  Building2,
  GraduationCap,
  Save,
  RotateCcw,
  Download,
  Upload,
  Check,
  ShieldCheck,
  Sparkles,
  UserCheck,
  ArrowRight,
  Users,
  Calendar,
  SlidersHorizontal,
  Database,
  FileJson,
  BookOpen,
  Image as ImageIcon,
  Sun,
  Moon,
  Palette,
  Award,
  User,
  Clock,
  FileText,
  CheckCircle2
} from 'lucide-react';

export const PengaturanView: React.FC = () => {
  const {
    schoolInfo,
    updateSchoolInfo,
    resetAllDataToDefault,
    exportDatabaseToJson,
    importDatabaseFromJson,
    teachers,
    students,
    availableUsers,
    setCurrentTab,
    currentUser,
    addToast
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'profil' | 'logo_kop' | 'tema' | 'pengguna' | 'hak_akses' | 'database'>('profil');
  const [formData, setFormData] = useState<SchoolInfo>({ ...schoolInfo });
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [isPhaseModalOpen, setIsPhaseModalOpen] = useState(false);
  const [selectedPhaseForModal, setSelectedPhaseForModal] = useState<CurriculumPhaseKey>('fase_b');

  useEffect(() => {
    setFormData({ ...schoolInfo });
  }, [schoolInfo]);

  const activeDetectedPhaseKey = detectPhaseKey(formData.phase);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSchoolInfo(formData);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const success = importDatabaseFromJson(content);
        if (success) {
          setFormData({ ...schoolInfo });
        }
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 shadow-sm">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
              <Settings className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Pengaturan Sistem & Hak Akses
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Konfigurasi identitas sekolah, logo kop dokumen, akun login pengguna, hak akses menu, dan database
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCurrentTab('nilai')}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 transition-colors"
            >
              <BookOpen className="h-4 w-4" />
              <span>Mata Pelajaran & TP</span>
            </button>
            <button
              type="button"
              onClick={() => setCurrentTab('guru')}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl border border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 hover:bg-purple-100 transition-colors"
            >
              <UserCheck className="h-4 w-4" />
              <span>Data Guru & Tendik ({teachers.length})</span>
            </button>
          </div>
        </div>

        {/* Sub-Navigation Tabs */}
        <div className="flex items-center gap-2 mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveSubTab('profil')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeSubTab === 'profil'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Building2 className="h-4 w-4" />
            <span>Profil Sekolah & Kelas</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('logo_kop')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeSubTab === 'logo_kop'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <ImageIcon className="h-4 w-4" />
            <span>Logo & Kop Sekolah (Kiri-Kanan)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('tema')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeSubTab === 'tema'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Palette className="h-4 w-4" />
            <span>Tema & Tampilan (Mode Malam/Terang)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('pengguna')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeSubTab === 'pengguna'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Users className="h-4 w-4" />
            <span>Manajemen Pengguna</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
              activeSubTab === 'pengguna' ? 'bg-blue-700 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
            }`}>
              {availableUsers.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('hak_akses')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeSubTab === 'hak_akses'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <SlidersHorizontal className="h-4 w-4" />
            <span>Hak Akses Menu Login</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('database')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeSubTab === 'database'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Database className="h-4 w-4" />
            <span>Cadangan & Database</span>
          </button>
        </div>
      </div>

      {/* Subtab 1: Logo & Kop Surat Section */}
      {activeSubTab === 'logo_kop' && <LogoKopSection />}

      {/* Subtab: Tema & Tampilan Layar (Mode Malam & Terang) */}
      {activeSubTab === 'tema' && <TemaDanTampilanSection />}

      {/* Subtab 2: User Management */}
      {activeSubTab === 'pengguna' && <UserManagementSection />}

      {/* Subtab 3: Role Permissions Matrix */}
      {activeSubTab === 'hak_akses' && <RolePermissionsMatrixSection />}

      {/* Subtab 4: School Profile & Curriculum */}
      {activeSubTab === 'profil' && (
        <form onSubmit={handleSave} className="space-y-6">
          {/* Quick banner to Logo Kop */}
          <div className="rounded-2xl border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 dark:border-blue-900/50 dark:from-blue-950/40 dark:to-slate-900 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="h-10 w-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-600/20">
                <ImageIcon className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                  Kustomisasi Logo Kop Surat (Kiri & Kanan)
                </h4>
                <p className="text-[11px] text-slate-600 dark:text-slate-300">
                  Ganti logo resmi Tut Wuri Handayani, Kemenag, Pemda, atau unggah logo khas sekolah sendiri.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setActiveSubTab('logo_kop')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition-all whitespace-nowrap active:scale-95"
            >
              <span>Atur Logo Kop</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Card 1: Identitas Resmi Sekolah & Kop Dokumen */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <Building2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Identitas Resmi Sekolah & Header Kop Dokumen
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Nama Sekolah Dasar *
                </label>
                <input
                  type="text"
                  required
                  value={formData.schoolName}
                  onChange={e => setFormData({ ...formData, schoolName: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  NPSN Sekolah
                </label>
                <input
                  type="text"
                  value={formData.npsn}
                  onChange={e => setFormData({ ...formData, npsn: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Desa / Kelurahan
                </label>
                <input
                  type="text"
                  value={formData.village || ''}
                  onChange={e => setFormData({ ...formData, village: e.target.value })}
                  placeholder="Contoh: Kebayoran Baru / Selong"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Kecamatan
                </label>
                <input
                  type="text"
                  value={formData.subdistrict}
                  onChange={e => setFormData({ ...formData, subdistrict: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Kabupaten / Kota *
                </label>
                <input
                  type="text"
                  required
                  value={formData.city}
                  onChange={e => setFormData({ ...formData, city: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Provinsi *
                </label>
                <input
                  type="text"
                  required
                  value={formData.province}
                  onChange={e => setFormData({ ...formData, province: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Alamat Lengkap Sekolah *
                </label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={e => setFormData({ ...formData, address: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Kode Pos
                </label>
                <input
                  type="text"
                  value={formData.postalCode}
                  onChange={e => setFormData({ ...formData, postalCode: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Nomor Telepon Sekolah
                </label>
                <input
                  type="text"
                  value={formData.phoneNumber}
                  onChange={e => setFormData({ ...formData, phoneNumber: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Email Sekolah
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Situs Web
                </label>
                <input
                  type="text"
                  value={formData.website}
                  onChange={e => setFormData({ ...formData, website: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Card 2: Periode Akademik & Penandatangan Rapor */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-sm space-y-5">
            <div className="flex items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3 flex-wrap">
              <div className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Struktur Kelas, Semester, & Pejabat Penandatangan
                </h3>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSelectedPhaseForModal(activeDetectedPhaseKey || 'fase_b');
                  setIsPhaseModalOpen(true);
                }}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-xs font-bold transition-all active:scale-95 shadow-xs"
              >
                <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
                <span>Otomatis Sesuaikan Fase Kurikulum</span>
              </button>
            </div>

            {/* Banner Quick Phase Switcher */}
            <div className="rounded-2xl border border-indigo-100 dark:border-indigo-900/40 bg-indigo-50/40 dark:bg-indigo-950/30 p-4">
              <div className="flex items-center justify-between gap-2 mb-2.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-900 dark:text-indigo-200">
                    Pilihan Cepat Fase Kurikulum Merdeka (KMPM):
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-600 text-white">
                    Aktif: {formData.phase || 'Fase B'}
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  Klik kartu untuk sinkronkan otomatis
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {(Object.keys(CURRICULUM_PHASE_PRESETS) as CurriculumPhaseKey[]).map(key => {
                  const preset = CURRICULUM_PHASE_PRESETS[key];
                  const isActive = activeDetectedPhaseKey === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => {
                        setSelectedPhaseForModal(key);
                        setIsPhaseModalOpen(true);
                      }}
                      className={`p-2.5 rounded-xl border text-left transition-all relative ${
                        isActive
                          ? 'border-indigo-600 bg-white dark:bg-slate-800 shadow-sm ring-1 ring-indigo-500'
                          : 'border-indigo-100 dark:border-slate-800 bg-white/70 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 hover:border-indigo-300'
                      }`}
                    >
                      {isActive && (
                        <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-800" />
                      )}
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="text-base">{preset.icon}</span>
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          {preset.shortLabel}
                        </span>
                      </div>
                      <p className="text-[10px] font-medium text-indigo-600 dark:text-indigo-400 truncate">
                        {preset.gradeLevels}
                      </p>
                      <p className="text-[9px] text-slate-500 mt-1">
                        {preset.subjects.length} Mapel &bull; {preset.tujuanPembelajaran.length} TP
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              {/* Kolom Rombel Kelas */}
              <div className="lg:col-span-8">
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Nama Rombongan Belajar (Kelas) *
                  </label>
                  <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400">
                    Aktif: Kelas <span className="font-bold underline">{formData.className}</span>
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
                  <input
                    type="text"
                    required
                    placeholder="Cth: 4A"
                    value={formData.className}
                    onChange={e => setFormData({ ...formData, className: e.target.value })}
                    className="w-full sm:w-28 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs text-slate-800 dark:text-white font-bold text-center focus:outline-none focus:border-blue-500 shrink-0"
                  />
                  <div className="flex-1 flex flex-wrap items-center gap-1">
                    {['1A', '2A', '3A', '4A', '5A', '6A', '1B', '2B', '3B', '4B', '5B', '6B'].map(cls => (
                      <button
                        key={cls}
                        type="button"
                        onClick={() => setFormData({ ...formData, className: cls })}
                        className={`px-2 py-1 text-[11px] font-bold rounded-lg border transition-all cursor-pointer ${
                          formData.className === cls
                            ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                            : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-blue-50 hover:text-blue-600'
                        }`}
                      >
                        {cls}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Kolom Tahun Ajaran (Ukuran Disesuaikan Rapi & Lebih Kecil) */}
              <div className="lg:col-span-4">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Tahun Ajaran *
                </label>
                <input
                  type="text"
                  required
                  placeholder="2026/2027"
                  value={formData.academicYear}
                  onChange={e => setFormData({ ...formData, academicYear: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs text-slate-800 dark:text-white font-mono font-bold text-center tracking-wide focus:outline-none focus:border-blue-500"
                />
                <div className="flex items-center gap-1 mt-1">
                  {['2025/2026', '2026/2027', '2027/2028'].map(yr => (
                    <button
                      key={yr}
                      type="button"
                      onClick={() => setFormData({ ...formData, academicYear: yr })}
                      className={`flex-1 py-0.5 text-[10px] font-mono rounded border text-center transition-all cursor-pointer ${
                        formData.academicYear === yr
                          ? 'bg-blue-50 border-blue-300 text-blue-700 font-bold'
                          : 'bg-slate-50 border-slate-200 text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      {yr.split('/')[0].slice(2)}/{yr.split('/')[1].slice(2)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-4">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Semester Aktif *
                </label>
                <select
                  value={formData.semester}
                  onChange={e => setFormData({ ...formData, semester: e.target.value as '1 (Ganjil)' | '2 (Genap)' })}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="1 (Ganjil)">Semester 1 (Ganjil)</option>
                  <option value="2 (Genap)">Semester 2 (Genap)</option>
                </select>
                <p className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-1 font-medium">
                  ✓ Nilai terisolasi aman per semester: Nilai semester sebelumnya tidak akan hilang saat berpindah semester.
                </p>
              </div>

              <div className="lg:col-span-4">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Fase Kurikulum Merdeka (KMPM) *
                </label>
                <input
                  type="text"
                  value={formData.phase}
                  onChange={e => setFormData({ ...formData, phase: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="lg:col-span-4">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Kurikulum Digunakan *
                </label>
                <select
                  value={formData.kurikulum}
                  onChange={e => setFormData({ ...formData, kurikulum: e.target.value as any })}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-blue-500 font-semibold"
                >
                  <option value="Kurikulum Merdeka Pembelajaran Mendalam (KMPM)">
                    Kurikulum Merdeka Pembelajaran Mendalam (KMPM)
                  </option>
                  <option value="Kurikulum Merdeka">Kurikulum Merdeka (KUMER Standar)</option>
                  <option value="Kurikulum 2013">Kurikulum 2013 (K13)</option>
                </select>
              </div>

              {/* Hari Efektif Sekolah per Minggu */}
              <div className="lg:col-span-12 pt-3 border-t border-slate-100 dark:border-slate-800">
                <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/40 p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                        <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        <span>Hari Efektif Sekolah per Minggu</span>
                      </label>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        Menentukan perhitungan hari efektif pada modul absensi siswa dan kalender jurnal mengajar guru
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setFormData({
                            ...formData,
                            effectiveDaysPerWeek: 5,
                            activeSchoolDays: ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat']
                          });
                        }}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                          (formData.effectiveDaysPerWeek || 5) === 5
                            ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                            : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                        }`}
                      >
                        5 Hari (Senin - Jumat)
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setFormData({
                            ...formData,
                            effectiveDaysPerWeek: 6,
                            activeSchoolDays: ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
                          });
                        }}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                          formData.effectiveDaysPerWeek === 6
                            ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                            : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                        }`}
                      >
                        6 Hari (Senin - Sabtu)
                      </button>
                    </div>
                  </div>

                  {/* Active Days Badges */}
                  <div className="flex items-center gap-1.5 flex-wrap mt-3 pt-3 border-t border-slate-200/80 dark:border-slate-700/80">
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold mr-1">
                      Hari Pembelajaran Aktif:
                    </span>
                    {['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'].map(day => (
                      <span
                        key={day}
                        className="px-2.5 py-0.5 rounded-lg text-[11px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                      >
                        {day}
                      </span>
                    ))}
                    {formData.effectiveDaysPerWeek === 6 ? (
                      <span className="px-2.5 py-0.5 rounded-lg text-[11px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                        Sabtu (Aktif)
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-lg text-[11px] font-semibold bg-slate-200/80 dark:bg-slate-700/70 text-slate-500 dark:text-slate-400 border border-dashed border-slate-300 dark:border-slate-600">
                        Sabtu (Libur)
                      </span>
                    )}
                    <span className="px-2.5 py-0.5 rounded-lg text-[11px] font-semibold bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/40">
                      Minggu (Libur Nasional)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Pejabat Penandatangan Dokumen & Lembar Rapor */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-sm space-y-4">
            <div className="flex items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3 flex-wrap">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
                  <UserCheck className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Pejabat Penandatangan Dokumen & Lembar Rapor
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Nama dan NIP Kepala Sekolah serta Wali Kelas yang tercantum pada lembar tanda tangan rapor, buku induk, dan surat keputusan resmi
                  </p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300">
                <Award className="h-3.5 w-3.5" />
                <span>Pengesahan Sah</span>
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-1">
              {/* Box 1: Kepala Sekolah */}
              <div className="rounded-2xl border border-blue-200 dark:border-blue-900/50 bg-blue-50/40 dark:bg-blue-950/20 p-4 space-y-3.5">
                <div className="flex items-center justify-between pb-2 border-b border-blue-200/60 dark:border-blue-800/40">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                      KS
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold text-blue-950 dark:text-blue-200">
                        Kepala Sekolah
                      </h4>
                      <p className="text-[10.5px] text-blue-700/80 dark:text-blue-300/80">
                        Penandatangan Lembar Pengesahan Rapor
                      </p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-200/80 dark:bg-blue-900/60 text-blue-800 dark:text-blue-200">
                    Pimpinan Satuan
                  </span>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                      Nama Lengkap & Gelar Kepala Sekolah *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Dra. Hj. Siti Rahmah, M.Pd."
                      value={formData.headmasterName}
                      onChange={e => setFormData({ ...formData, headmasterName: e.target.value })}
                      className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-2.5 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                      NIP Kepala Sekolah
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: 19750812 200003 2 001"
                      value={formData.headmasterNip}
                      onChange={e => setFormData({ ...formData, headmasterNip: e.target.value })}
                      className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-2.5 text-xs font-mono font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Signature Preview */}
                  <div className="p-3 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-blue-100 dark:border-slate-800 text-center">
                    <p className="text-[10px] text-slate-400 font-medium">Format Kolom TTD Rapor:</p>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200 underline mt-2">
                      {formData.headmasterName || 'Nama Kepala Sekolah'}
                    </p>
                    <p className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                      NIP. {formData.headmasterNip || '-'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Box 2: Wali Kelas */}
              <div className="rounded-2xl border border-indigo-200 dark:border-indigo-900/50 bg-indigo-50/40 dark:bg-indigo-950/20 p-4 space-y-3.5">
                <div className="flex items-center justify-between pb-2 border-b border-indigo-200/60 dark:border-indigo-800/40">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                      WK
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold text-indigo-950 dark:text-indigo-200">
                        Guru Kelas / Wali Kelas
                      </h4>
                      <p className="text-[10.5px] text-indigo-700/80 dark:text-indigo-300/80">
                        Penandatangan Langsung Rapor Kelas {formData.className}
                      </p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-200/80 dark:bg-indigo-900/60 text-indigo-800 dark:text-indigo-200">
                    Wali Kelas
                  </span>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                      Nama Lengkap & Gelar Wali Kelas *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Ahmad Fauzi, S.Pd."
                      value={formData.homeroomTeacherName}
                      onChange={e => setFormData({ ...formData, homeroomTeacherName: e.target.value })}
                      className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-2.5 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                      NIP Wali Kelas
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: 19880415 201402 1 003"
                      value={formData.homeroomTeacherNip}
                      onChange={e => setFormData({ ...formData, homeroomTeacherNip: e.target.value })}
                      className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-2.5 text-xs font-mono font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  {/* Signature Preview */}
                  <div className="p-3 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-indigo-100 dark:border-slate-800 text-center">
                    <p className="text-[10px] text-slate-400 font-medium">Format Kolom TTD Rapor:</p>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200 underline mt-2">
                      {formData.homeroomTeacherName || 'Nama Wali Kelas'}
                    </p>
                    <p className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                      NIP. {formData.homeroomTeacherNip || '-'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 4: Penanggalan & Titimangsa Rapor (Berlaku Serentak Seluruh Siswa) */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-sm space-y-4">
            <div className="flex items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3 flex-wrap">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Penanggalan / Titimangsa Rapor (Berlaku Serentak untuk Seluruh Siswa)
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Tempat dan tanggal pembagian rapor ini otomatis diberlakukan ke semua lembar rapor siswa tanpa perlu diisi satu per satu
                  </p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-200">
                <Users className="h-3.5 w-3.5" />
                <span>Berlaku Semua Siswa</span>
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              {/* Rapor Akhir Semester (SAS) */}
              <div className="rounded-2xl border border-blue-200 dark:border-blue-900/50 bg-blue-50/30 dark:bg-blue-950/20 p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-blue-950 dark:text-blue-200">
                    Rapor Akhir Semester (SAS / Kenaikan Kelas):
                  </label>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-600 text-white">
                    Semester 1 & 2
                  </span>
                </div>
                <input
                  type="text"
                  value={formData.tanggalRapor || ''}
                  onChange={e => setFormData({ ...formData, tanggalRapor: e.target.value })}
                  placeholder={`Contoh: ${formData.city || 'Kota Jakarta Selatan'}, 20 Juni 2027`}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-2.5 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex items-center gap-1.5 flex-wrap pt-1">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, tanggalRapor: `${formData.city || 'Kota Jakarta Selatan'}, 20 Juni 2027` })}
                    className="text-[10px] px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-blue-600 font-semibold transition-colors cursor-pointer"
                  >
                    Smt 2 (20 Juni 2027)
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, tanggalRapor: `${formData.city || 'Kota Jakarta Selatan'}, 19 Desember 2026` })}
                    className="text-[10px] px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-blue-600 font-semibold transition-colors cursor-pointer"
                  >
                    Smt 1 (19 Des 2026)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const todayStr = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
                      setFormData({ ...formData, tanggalRapor: `${formData.city || 'Kota Jakarta Selatan'}, ${todayStr}` });
                    }}
                    className="text-[10px] px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-blue-600 font-semibold transition-colors cursor-pointer"
                  >
                    Hari Ini
                  </button>
                </div>
              </div>

              {/* Rapor Tengah Semester (ASTS) */}
              <div className="rounded-2xl border border-amber-200 dark:border-amber-900/50 bg-amber-50/30 dark:bg-amber-950/20 p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-amber-950 dark:text-amber-200">
                    Rapor Tengah Semester (ASTS / Mid):
                  </label>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-600 text-white">
                    Mid Semester
                  </span>
                </div>
                <input
                  type="text"
                  value={formData.tanggalRaporMid || ''}
                  onChange={e => setFormData({ ...formData, tanggalRaporMid: e.target.value })}
                  placeholder={`Contoh: ${formData.city || 'Kota Jakarta Selatan'}, 10 Oktober 2026`}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-2.5 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <div className="flex items-center gap-1.5 flex-wrap pt-1">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, tanggalRaporMid: `${formData.city || 'Kota Jakarta Selatan'}, 28 Maret 2027` })}
                    className="text-[10px] px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-amber-600 font-semibold transition-colors cursor-pointer"
                  >
                    Mid Smt 2 (28 Maret 2027)
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, tanggalRaporMid: `${formData.city || 'Kota Jakarta Selatan'}, 10 Oktober 2026` })}
                    className="text-[10px] px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-amber-600 font-semibold transition-colors cursor-pointer"
                  >
                    Mid Smt 1 (10 Okt 2026)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const todayStr = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
                      setFormData({ ...formData, tanggalRaporMid: `${formData.city || 'Kota Jakarta Selatan'}, ${todayStr}` });
                    }}
                    className="text-[10px] px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-amber-600 font-semibold transition-colors cursor-pointer"
                  >
                    Hari Ini
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Card 5: Pusat Cadangan & Pemulihan Basis Data (Backup & Restore) di Bagian Bawah */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-sm space-y-4">
            <div className="flex items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3 flex-wrap">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                  <Database className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Cadangan & Pemulihan Basis Data (Backup & Restore)
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Amankan seluruh data buku administrasi kelas, peserta didik ({students.length}), guru ({teachers.length}), nilai, absensi, profil sekolah, dan logo ke berkas JSON
                  </p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Penyimpanan Aman</span>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
              {/* Unduh Backup JSON */}
              <div className="p-4 rounded-2xl border border-blue-200 dark:border-blue-900/40 bg-blue-50/40 dark:bg-blue-950/20 flex flex-col justify-between">
                <div>
                  <div className="h-9 w-9 rounded-xl bg-blue-600 text-white flex items-center justify-center mb-2.5 shadow-md shadow-blue-600/20">
                    <Download className="h-4 w-4" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Unduh Cadangan JSON</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    Simpan berkas backup lengkap (.json) ke komputer / laptop untuk arsip sewaktu-waktu.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={exportDatabaseToJson}
                  className="mt-3.5 w-full flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-all cursor-pointer active:scale-95"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Download Backup</span>
                </button>
              </div>

              {/* Restore JSON */}
              <div className="p-4 rounded-2xl border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50/40 dark:bg-emerald-950/20 flex flex-col justify-between">
                <div>
                  <div className="h-9 w-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center mb-2.5 shadow-md shadow-emerald-600/20">
                    <Upload className="h-4 w-4" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Pulihkan Data JSON</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    Unggah berkas JSON cadangan yang pernah diunduh untuk memulihkan seluruh data kelas.
                  </p>
                </div>
                <label className="mt-3.5 w-full flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-all cursor-pointer active:scale-95">
                  <Upload className="h-3.5 w-3.5" />
                  <span>Pilih File Backup</span>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Reset to Default */}
              <div className="p-4 rounded-2xl border border-rose-200 dark:border-rose-900/40 bg-rose-50/40 dark:bg-rose-950/20 flex flex-col justify-between">
                <div>
                  <div className="h-9 w-9 rounded-xl bg-rose-600 text-white flex items-center justify-center mb-2.5 shadow-md shadow-rose-600/20">
                    <RotateCcw className="h-4 w-4" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Reset ke Data Awal</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    Kembalikan seluruh data siswa, nilai, jurnal, logo, dan profil ke simulasi standar awal.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsResetConfirmOpen(true)}
                  className="mt-3.5 w-full flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl border border-rose-200 dark:border-rose-900 bg-white dark:bg-slate-800 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-all cursor-pointer active:scale-95"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Reset Simulasi</span>
                </button>
              </div>
            </div>
          </div>

          {/* Sticky Bottom Action Bar */}
          <div className="sticky bottom-4 z-20 rounded-2xl border border-blue-200/80 dark:border-blue-900/60 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-4 shadow-xl flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                Perubahan pada form profil, pejabat penandatangan, dan titimangsa rapor akan disimpan ke sistem.
              </span>
            </div>

            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-extrabold text-xs shadow-lg shadow-blue-600/25 transition-all cursor-pointer"
            >
              <Save className="h-4 w-4" />
              <span>Simpan Seluruh Pengaturan</span>
            </button>
          </div>
        </form>
      )}

      {/* Subtab 5: Database & Backup */}
      {activeSubTab === 'database' && (
        <div className="space-y-6">
          {/* Status Ringkasan Data */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-2xl border border-blue-100 dark:border-blue-900/40 bg-white dark:bg-slate-900 shadow-xs">
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Total Siswa Aktif</span>
              <p className="text-xl font-extrabold text-blue-600 dark:text-blue-400 mt-1">{students.length} Siswa</p>
            </div>
            <div className="p-4 rounded-2xl border border-purple-100 dark:border-purple-900/40 bg-white dark:bg-slate-900 shadow-xs">
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Guru & Tendik</span>
              <p className="text-xl font-extrabold text-purple-600 dark:text-purple-400 mt-1">{teachers.length} Pendidik</p>
            </div>
            <div className="p-4 rounded-2xl border border-emerald-100 dark:border-emerald-900/40 bg-white dark:bg-slate-900 shadow-xs">
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Akun Pengguna</span>
              <p className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">{availableUsers.length} Akun</p>
            </div>
            <div className="p-4 rounded-2xl border border-amber-100 dark:border-amber-900/40 bg-white dark:bg-slate-900 shadow-xs">
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Status Penyimpanan</span>
              <p className="text-xs font-bold text-amber-600 dark:text-amber-400 mt-2 flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Offline LocalStorage</span>
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-sm space-y-4">
            <div className="flex items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3 flex-wrap">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                  <Database className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Pusat Cadangan & Pemulihan Data (Backup & Restore)
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Amankan seluruh berkas administrasi dan nilai atau pulihkan data dari file JSON
                  </p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Penyimpanan Aman</span>
              </span>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Semua data buku administrasi kelas, data guru, logo kop surat, akun pengguna, nilai, absensi, jurnal, dan matriks hak akses tersimpan secara offline & aman di penyimpanan peramban (Local Storage). Anda dapat mengunduh berkas cadangan sewaktu-waktu.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              {/* Export JSON */}
              <div className="p-4 rounded-2xl border border-blue-100 dark:border-blue-900/40 bg-blue-50/40 dark:bg-blue-950/20 flex flex-col justify-between">
                <div>
                  <div className="h-10 w-10 rounded-xl bg-blue-600 text-white flex items-center justify-center mb-3 shadow-md shadow-blue-600/20">
                    <Download className="h-5 w-5" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Unduh Backup JSON</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    Simpan salinan seluruh database dan konfigurasi logo ke berkas JSON di komputer Anda.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={exportDatabaseToJson}
                  className="mt-4 w-full flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all cursor-pointer active:scale-95"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Download Backup</span>
                </button>
              </div>

              {/* Import JSON */}
              <div className="p-4 rounded-2xl border border-emerald-100 dark:border-emerald-900/40 bg-emerald-50/40 dark:bg-emerald-950/20 flex flex-col justify-between">
                <div>
                  <div className="h-10 w-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center mb-3 shadow-md shadow-emerald-600/20">
                    <Upload className="h-5 w-5" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Restore Data JSON</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    Pulihkan seluruh basis data dan konfigurasi kop surat dari berkas JSON yang pernah diunduh.
                  </p>
                </div>
                <label className="mt-4 w-full flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-all cursor-pointer active:scale-95">
                  <Upload className="h-3.5 w-3.5" />
                  <span>Pilih File Backup</span>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Reset to Default */}
              <div className="p-4 rounded-2xl border border-rose-100 dark:border-rose-900/40 bg-rose-50/40 dark:bg-rose-950/20 flex flex-col justify-between">
                <div>
                  <div className="h-10 w-10 rounded-xl bg-rose-600 text-white flex items-center justify-center mb-3 shadow-md shadow-rose-600/20">
                    <RotateCcw className="h-5 w-5" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Reset ke Data Awal</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    Kembalikan seluruh data siswa, nilai, logo kop, guru, dan akun ke simulasi standar.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsResetConfirmOpen(true)}
                  className="mt-4 w-full flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl border border-rose-200 dark:border-rose-900 text-rose-600 hover:bg-rose-100 dark:hover:bg-rose-950/50 transition-all cursor-pointer active:scale-95"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Reset Simulasi</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Reset Dialog */}
      {isResetConfirmOpen && (
        <ConfirmDialog
          isOpen={true}
          onClose={() => setIsResetConfirmOpen(false)}
          onConfirm={() => {
            resetAllDataToDefault();
            setIsResetConfirmOpen(false);
            setFormData({ ...schoolInfo });
          }}
          title="Reset Semua Data ke Pengaturan Awal?"
          message="Tindakan ini akan mengembalikan data seluruh pendidik/guru, siswa, absensi, nilai, kas, akun login, logo kop surat, dan jadwal ke data awal."
          confirmText="Ya, Reset Sekarang"
          type="danger"
        />
      )}

      {/* Modal Sinkronisasi Fase Kurikulum Merdeka */}
      <KurikulumFaseSelectorModal
        isOpen={isPhaseModalOpen}
        onClose={() => setIsPhaseModalOpen(false)}
        initialPhaseKey={selectedPhaseForModal}
      />
    </div>
  );
};


