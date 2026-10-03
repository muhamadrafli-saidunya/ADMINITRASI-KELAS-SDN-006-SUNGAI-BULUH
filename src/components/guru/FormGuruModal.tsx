import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Teacher } from '../../types';
import { Modal } from '../common/Modal';
import { ImageUploadAvatar } from '../common/ImageUploadAvatar';
import {
  UserCheck,
  Briefcase,
  GraduationCap,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Save,
  Sparkles,
  Camera,
  Layers,
  Award,
  BookOpen
} from 'lucide-react';

interface FormGuruModalProps {
  isOpen: boolean;
  onClose: () => void;
  teacherToEdit?: Teacher | null;
}

export const FormGuruModal: React.FC<FormGuruModalProps> = ({
  isOpen,
  onClose,
  teacherToEdit
}) => {
  const { addTeacher, updateTeacher, addToast } = useApp();
  const isEditing = !!teacherToEdit;

  const [formData, setFormData] = useState<Omit<Teacher, 'id'>>({
    nama: '',
    nip: '',
    nuptk: '',
    jenisKelamin: 'L',
    jabatan: 'Guru Kelas 4A',
    jenisGuru: 'Guru Kelas',
    statusKepegawaian: 'PNS',
    golonganPangkat: 'III/c - Penata',
    pendidikanTerakhir: 'S1 PGSD',
    jurusan: 'Pendidikan Guru Sekolah Dasar',
    noHp: '',
    email: '',
    alamat: '',
    fotoUrl: '',
    statusAktif: 'Aktif',
    mataPelajaranUtama: ['Bahasa Indonesia', 'Matematika', 'IPAS'],
    kelasDiampu: 'Kelas 4A',
    tugasTambahan: 'Wali Kelas & Pembina Pramuka',
    tanggalBergabung: new Date().toISOString().split('T')[0],
    tempatLahir: '',
    tanggalLahir: '1990-01-01',
    catatanKhusus: ''
  });

  const [mapelInput, setMapelInput] = useState<string>('Bahasa Indonesia, Matematika, IPAS');

  useEffect(() => {
    if (teacherToEdit) {
      setFormData({
        nama: teacherToEdit.nama || '',
        nip: teacherToEdit.nip || '-',
        nuptk: teacherToEdit.nuptk || '',
        jenisKelamin: teacherToEdit.jenisKelamin || 'L',
        jabatan: teacherToEdit.jabatan || '',
        jenisGuru: teacherToEdit.jenisGuru || 'Guru Kelas',
        statusKepegawaian: teacherToEdit.statusKepegawaian || 'PNS',
        golonganPangkat: teacherToEdit.golonganPangkat || '-',
        pendidikanTerakhir: teacherToEdit.pendidikanTerakhir || 'S1 PGSD',
        jurusan: teacherToEdit.jurusan || '',
        noHp: teacherToEdit.noHp || '',
        email: teacherToEdit.email || '',
        alamat: teacherToEdit.alamat || '',
        fotoUrl: teacherToEdit.fotoUrl || '',
        statusAktif: teacherToEdit.statusAktif || 'Aktif',
        mataPelajaranUtama: teacherToEdit.mataPelajaranUtama || [],
        kelasDiampu: teacherToEdit.kelasDiampu || '',
        tugasTambahan: teacherToEdit.tugasTambahan || '',
        tanggalBergabung: teacherToEdit.tanggalBergabung || '',
        tempatLahir: teacherToEdit.tempatLahir || '',
        tanggalLahir: teacherToEdit.tanggalLahir || '',
        catatanKhusus: teacherToEdit.catatanKhusus || ''
      });
      setMapelInput((teacherToEdit.mataPelajaranUtama || []).join(', '));
    } else {
      setFormData({
        nama: '',
        nip: '',
        nuptk: '',
        jenisKelamin: 'L',
        jabatan: 'Guru Kelas',
        jenisGuru: 'Guru Kelas',
        statusKepegawaian: 'PNS',
        golonganPangkat: 'III/a - Penata Muda',
        pendidikanTerakhir: 'S1 PGSD',
        jurusan: 'Pendidikan Guru Sekolah Dasar',
        noHp: '',
        email: '',
        alamat: '',
        fotoUrl: '',
        statusAktif: 'Aktif',
        mataPelajaranUtama: ['Bahasa Indonesia', 'Matematika'],
        kelasDiampu: 'Kelas 4A',
        tugasTambahan: '',
        tanggalBergabung: new Date().toISOString().split('T')[0],
        tempatLahir: '',
        tanggalLahir: '1990-01-01',
        catatanKhusus: ''
      });
      setMapelInput('Bahasa Indonesia, Matematika');
    }
  }, [teacherToEdit, isOpen]);

  const defaultAvatar = formData.jenisKelamin === 'L'
    ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80'
    : 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&auto=format&fit=crop&q=80';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nama.trim()) {
      addToast('error', 'Validasi Gagal', 'Nama lengkap guru wajib diisi.');
      return;
    }

    const mapelList = mapelInput
      .split(',')
      .map(m => m.trim())
      .filter(m => m.length > 0);

    const payload = {
      ...formData,
      nama: formData.nama.trim(),
      nip: formData.nip.trim() || '-',
      nuptk: formData.nuptk?.trim() || '-',
      noHp: formData.noHp.trim(),
      email: formData.email.trim(),
      fotoUrl: formData.fotoUrl.trim() || defaultAvatar,
      mataPelajaranUtama: mapelList
    };

    if (isEditing && teacherToEdit) {
      updateTeacher(teacherToEdit.id, payload);
    } else {
      addTeacher(payload);
    }

    onClose();
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? `Edit Data Guru: ${teacherToEdit?.nama}` : 'Tambah Guru / Tenaga Pendidik Baru'}
      maxWidth="3xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Banner */}
        <div className="flex items-center gap-3 p-3.5 bg-gradient-to-r from-purple-50 via-indigo-50 to-blue-50 dark:from-purple-950/40 dark:via-indigo-950/30 dark:to-blue-950/30 rounded-2xl border border-purple-100 dark:border-purple-900/40">
          <div className="h-10 w-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-sm">
            <UserCheck className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-900 dark:text-white">
              {isEditing ? 'Perbarui Profil & Penugasan Pendidik' : 'Pendaftaran Pendidik & Tenaga Kependidikan (PTK)'}
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Isi data pokok kepegawaian, kontak, kualifikasi akademik, serta alokasi tugas mengajar SD.
            </p>
          </div>
        </div>

        {/* Section 1: Identitas Pribadi */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800 pb-1.5">
            <UserCheck className="h-4 w-4 text-purple-600" />
            <span>1. Identitas & Biodata Pribadi</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Nama Lengkap & Gelar Akademik *
              </label>
              <input
                type="text"
                required
                value={formData.nama}
                onChange={e => setFormData({ ...formData, nama: e.target.value })}
                placeholder="Contoh: Drs. H. Bambang Sutrisno, M.Pd. / Siti Aminah, S.Pd., Gr."
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs sm:text-sm text-slate-900 dark:text-white font-medium focus:border-purple-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Jenis Kelamin *
              </label>
              <select
                value={formData.jenisKelamin}
                onChange={e => setFormData({ ...formData, jenisKelamin: e.target.value as 'L' | 'P' })}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs sm:text-sm text-slate-900 dark:text-white font-medium"
              >
                <option value="L">Laki-Laki (L)</option>
                <option value="P">Perempuan (P)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Status Keaktifan *
              </label>
              <select
                value={formData.statusAktif}
                onChange={e => setFormData({ ...formData, statusAktif: e.target.value as any })}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs sm:text-sm text-slate-900 dark:text-white font-medium"
              >
                <option value="Aktif">Aktif Mengajar</option>
                <option value="Cuti">Cuti / Sakit Panjang</option>
                <option value="Mutasi">Mutasi / Pindah Tugas</option>
                <option value="Pensiun">Purna Tugas / Pensiun</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Tempat Lahir
              </label>
              <input
                type="text"
                value={formData.tempatLahir}
                onChange={e => setFormData({ ...formData, tempatLahir: e.target.value })}
                placeholder="Contoh: Jakarta / Surakarta"
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Tanggal Lahir
              </label>
              <input
                type="date"
                value={formData.tanggalLahir}
                onChange={e => setFormData({ ...formData, tanggalLahir: e.target.value })}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs text-slate-900 dark:text-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Alamat Tempat Tinggal
              </label>
              <input
                type="text"
                value={formData.alamat}
                onChange={e => setFormData({ ...formData, alamat: e.target.value })}
                placeholder="Jl. Nama Jalan No. RT/RW, Kelurahan, Kecamatan, Kota"
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs text-slate-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Kepegawaian & Jabatan */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800 pb-1.5">
            <Briefcase className="h-4 w-4 text-blue-600" />
            <span>2. Data Kepegawaian & Status Kedinasan</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                NIP (Nomor Induk Pegawai)
              </label>
              <input
                type="text"
                value={formData.nip}
                onChange={e => setFormData({ ...formData, nip: e.target.value })}
                placeholder="Contoh: 19880412 201201 2 018 (atau - jika honorer)"
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs text-slate-900 dark:text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                NUPTK (16 Digit)
              </label>
              <input
                type="text"
                value={formData.nuptk}
                onChange={e => setFormData({ ...formData, nuptk: e.target.value })}
                placeholder="Contoh: 8452766668210023"
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs text-slate-900 dark:text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Status Kepegawaian *
              </label>
              <select
                value={formData.statusKepegawaian}
                onChange={e => setFormData({ ...formData, statusKepegawaian: e.target.value as any })}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs text-slate-900 dark:text-white font-semibold"
              >
                <option value="PNS">PNS (Pegawai Negeri Sipil)</option>
                <option value="PPPK">PPPK (Pegawai Pemerintah dg Perjanjian Kerja)</option>
                <option value="GTT / Honorer">GTT / Guru Honorer Sekolah</option>
                <option value="Guru Tetap Yayasan">Guru Tetap Yayasan</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Jabatan / Posisi di Sekolah *
              </label>
              <input
                type="text"
                required
                value={formData.jabatan}
                onChange={e => setFormData({ ...formData, jabatan: e.target.value })}
                placeholder="Contoh: Kepala Sekolah / Wali Kelas 4A / Guru PAI"
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs text-slate-900 dark:text-white font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Jenis Penugasan Guru *
              </label>
              <select
                value={formData.jenisGuru}
                onChange={e => setFormData({ ...formData, jenisGuru: e.target.value as any })}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs text-slate-900 dark:text-white font-medium"
              >
                <option value="Guru Kelas">Guru Kelas (Tematik/Kurmer)</option>
                <option value="Guru Mapel">Guru Mata Pelajaran (PAI, PJOK, B.Inggris, Seni)</option>
                <option value="Kepala Sekolah">Kepala Sekolah</option>
                <option value="Guru BK">Guru BK / Konselor</option>
                <option value="Tenaga Kependidikan">Tenaga Kependidikan / Operator / TU</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Pangkat / Golongan Ruang
              </label>
              <input
                type="text"
                value={formData.golonganPangkat}
                onChange={e => setFormData({ ...formData, golonganPangkat: e.target.value })}
                placeholder="Contoh: IV/b, III/c - Penata, IX (PPPK), -"
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs text-slate-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Akademik & Alokasi Mengajar */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800 pb-1.5">
            <GraduationCap className="h-4 w-4 text-emerald-600" />
            <span>3. Kualifikasi Pendidikan & Alokasi Mengajar</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Pendidikan Terakhir *
              </label>
              <input
                type="text"
                required
                value={formData.pendidikanTerakhir}
                onChange={e => setFormData({ ...formData, pendidikanTerakhir: e.target.value })}
                placeholder="Contoh: S1 PGSD / S2 Pendidikan Dasar"
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Program Studi / Jurusan
              </label>
              <input
                type="text"
                value={formData.jurusan}
                onChange={e => setFormData({ ...formData, jurusan: e.target.value })}
                placeholder="Contoh: Pendidikan Guru Sekolah Dasar"
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Kelas yang Diampu
              </label>
              <input
                type="text"
                value={formData.kelasDiampu}
                onChange={e => setFormData({ ...formData, kelasDiampu: e.target.value })}
                placeholder="Contoh: Kelas 4A / Kelas 1-6"
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs text-slate-900 dark:text-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Mata Pelajaran Utama (Pisahkan dengan koma)
              </label>
              <input
                type="text"
                value={mapelInput}
                onChange={e => setMapelInput(e.target.value)}
                placeholder="Contoh: Bahasa Indonesia, Matematika, IPAS, Pendidikan Pancasila"
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Tugas Tambahan Sekolah
              </label>
              <input
                type="text"
                value={formData.tugasTambahan}
                onChange={e => setFormData({ ...formData, tugasTambahan: e.target.value })}
                placeholder="Contoh: Wali Kelas 4A / Pembina Pramuka / Bendahara BOS"
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs text-slate-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Kontak & Foto */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800 pb-1.5">
            <Phone className="h-4 w-4 text-amber-600" />
            <span>4. Kontak Cepat & Pasfoto</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Nomor WhatsApp / HP Aktif *
              </label>
              <input
                type="text"
                required
                value={formData.noHp}
                onChange={e => setFormData({ ...formData, noHp: e.target.value })}
                placeholder="Contoh: 081234567890"
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Alamat Email Kedinasan / Belajar.id
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                placeholder="guru@sdn.sch.id / nama@guru.sd.belajar.id"
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs text-slate-900 dark:text-white"
              />
            </div>

            <div className="sm:col-span-2">
              <ImageUploadAvatar
                label="Pasfoto Resmi Guru / Tenaga Pendidik"
                description="Unggah pasfoto resmi guru, ambil via kamera, atau pilih avatar siap pakai."
                type="user"
                gender={formData.jenisKelamin}
                value={formData.fotoUrl}
                onChange={(newUrl) => setFormData({ ...formData, fotoUrl: newUrl })}
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Catatan Khusus / Prestasi Guru
              </label>
              <textarea
                rows={2}
                value={formData.catatanKhusus}
                onChange={e => setFormData({ ...formData, catatanKhusus: e.target.value })}
                placeholder="Contoh: Guru Penggerak Angkatan 7, Penulis Modul Ajar, Pelatih Pramuka Berlisensi KMD..."
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs text-slate-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Batal
          </button>
          <button
            type="submit"
            className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold rounded-xl bg-purple-600 hover:bg-purple-700 text-white shadow-md shadow-purple-600/30 active:scale-95 transition-all"
          >
            <Save className="h-4 w-4" />
            <span>{isEditing ? 'Simpan Perubahan Guru' : 'Simpan Data Guru'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
