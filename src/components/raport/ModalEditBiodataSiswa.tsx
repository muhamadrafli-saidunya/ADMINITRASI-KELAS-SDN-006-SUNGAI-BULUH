import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Student } from '../../types';
import { X, Save, User, MapPin, Phone, Users, CheckCircle2, AlertCircle } from 'lucide-react';

interface ModalEditBiodataSiswaProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student;
}

export const ModalEditBiodataSiswa: React.FC<ModalEditBiodataSiswaProps> = ({
  isOpen,
  onClose,
  student
}) => {
  const { updateStudent, addToast } = useApp();

  const [formData, setFormData] = useState<Partial<Student>>({
    nama: student.nama,
    nis: student.nis,
    nisn: student.nisn,
    tempatLahir: student.tempatLahir,
    tanggalLahir: student.tanggalLahir,
    jenisKelamin: student.jenisKelamin,
    agama: student.agama,
    alamat: student.alamat,
    namaAyah: student.namaAyah,
    namaIbu: student.namaIbu,
    pekerjaanOrtu: student.pekerjaanOrtu,
    noHpOrtu: student.noHpOrtu,
    kelas: student.kelas,
    nomorAbsen: student.nomorAbsen,
    statusDalamKeluarga: student.statusDalamKeluarga || 'Anak Kandung',
    anakKe: student.anakKe !== undefined ? student.anakKe : 1,
    sekolahAsal: student.sekolahAsal || '',
    diterimaDiKelas: student.diterimaDiKelas || student.kelas || '1',
    diterimaTanggal: student.diterimaTanggal || '2024-07-15'
  });

  useEffect(() => {
    if (student) {
      setFormData({
        nama: student.nama,
        nis: student.nis,
        nisn: student.nisn,
        tempatLahir: student.tempatLahir,
        tanggalLahir: student.tanggalLahir,
        jenisKelamin: student.jenisKelamin,
        agama: student.agama,
        alamat: student.alamat,
        namaAyah: student.namaAyah,
        namaIbu: student.namaIbu,
        pekerjaanOrtu: student.pekerjaanOrtu,
        noHpOrtu: student.noHpOrtu,
        kelas: student.kelas,
        nomorAbsen: student.nomorAbsen,
        statusDalamKeluarga: student.statusDalamKeluarga || 'Anak Kandung',
        anakKe: student.anakKe !== undefined ? student.anakKe : 1,
        sekolahAsal: student.sekolahAsal || '',
        diterimaDiKelas: student.diterimaDiKelas || student.kelas || '1',
        diterimaTanggal: student.diterimaTanggal || '2024-07-15'
      });
    }
  }, [student]);

  if (!isOpen) return null;

  const handleChange = (field: keyof Student, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nama || !formData.nama.trim()) {
      addToast('error', 'Validasi Gagal', 'Nama lengkap peserta didik wajib diisi.');
      return;
    }

    updateStudent(student.id, formData);
    addToast('success', 'Biodata Disimpan', `Biodata ${formData.nama} berhasil diperbarui.`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="relative w-full max-w-3xl max-h-[90vh] flex flex-col rounded-2xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
              <User className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                Edit Biodata Peserta Didik (Sampul & Rapor)
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {student.nama} • Absen {student.nomorAbsen || '-'} • NISN: {student.nisn || '-'}
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

        {/* Modal Form Body */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Section 1: Identitas Pokok Siswa */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
              <User className="h-4 w-4" />
              <span>Identitas Pokok Siswa</span>
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Nama Lengkap Siswa <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.nama || ''}
                  onChange={e => handleChange('nama', e.target.value)}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs font-bold text-slate-900 dark:text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Nomor Induk Siswa (NIS)
                </label>
                <input
                  type="text"
                  value={formData.nis || ''}
                  onChange={e => handleChange('nis', e.target.value)}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs font-mono text-slate-900 dark:text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  NISN (10 Digit)
                </label>
                <input
                  type="text"
                  value={formData.nisn || ''}
                  onChange={e => handleChange('nisn', e.target.value)}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs font-mono text-slate-900 dark:text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Tempat Lahir
                </label>
                <input
                  type="text"
                  value={formData.tempatLahir || ''}
                  onChange={e => handleChange('tempatLahir', e.target.value)}
                  placeholder="Contoh: Jakarta"
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Tanggal Lahir (YYYY-MM-DD)
                </label>
                <input
                  type="date"
                  value={formData.tanggalLahir || ''}
                  onChange={e => handleChange('tanggalLahir', e.target.value)}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Jenis Kelamin
                </label>
                <select
                  value={formData.jenisKelamin || 'L'}
                  onChange={e => handleChange('jenisKelamin', e.target.value as 'L' | 'P')}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                >
                  <option value="L">Laki-laki (L)</option>
                  <option value="P">Perempuan (P)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Agama & Kepercayaan
                </label>
                <select
                  value={formData.agama || 'Islam'}
                  onChange={e => handleChange('agama', e.target.value)}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                >
                  <option value="Islam">Islam</option>
                  <option value="Kristen">Kristen Protestan</option>
                  <option value="Katolik">Katolik</option>
                  <option value="Hindu">Hindu</option>
                  <option value="Buddha">Buddha</option>
                  <option value="Konghucu">Konghucu</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Status dalam Keluarga
                </label>
                <input
                  type="text"
                  value={formData.statusDalamKeluarga || ''}
                  onChange={e => handleChange('statusDalamKeluarga', e.target.value)}
                  placeholder="Contoh: Anak Kandung / Anak Angkat"
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Anak Ke-
                </label>
                <input
                  type="text"
                  value={formData.anakKe !== undefined ? formData.anakKe : ''}
                  onChange={e => handleChange('anakKe', e.target.value)}
                  placeholder="Contoh: 1 atau 1 (Satu)"
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Sekolah Asal (TK / PAUD)
                </label>
                <input
                  type="text"
                  value={formData.sekolahAsal || ''}
                  onChange={e => handleChange('sekolahAsal', e.target.value)}
                  placeholder="Contoh: TK Pertiwi / PAUD Kasih Bunda"
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* Diterima di Sekolah Ini */}
              <div className="sm:col-span-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 p-3 border border-slate-200 dark:border-slate-700 space-y-2">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Diterima di Sekolah ini:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                      a. Di Kelas
                    </label>
                    <input
                      type="text"
                      value={formData.diterimaDiKelas || ''}
                      onChange={e => handleChange('diterimaDiKelas', e.target.value)}
                      placeholder="Contoh: 1 (Satu) atau 4A"
                      className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs text-slate-900 dark:text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                      b. Pada Tanggal
                    </label>
                    <input
                      type="date"
                      value={formData.diterimaTanggal || ''}
                      onChange={e => handleChange('diterimaTanggal', e.target.value)}
                      className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs text-slate-900 dark:text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Alamat & Kontak */}
          <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
              <MapPin className="h-4 w-4" />
              <span>Alamat Tempat Tinggal & Kontak</span>
            </h3>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Alamat Lengkap Siswa
                </label>
                <textarea
                  rows={2}
                  value={formData.alamat || ''}
                  onChange={e => handleChange('alamat', e.target.value)}
                  placeholder="Contoh: Jl. Menteng Raya No. 45, RT 02/RW 03, Jakarta Pusat"
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Data Orang Tua */}
          <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
              <Users className="h-4 w-4" />
              <span>Data Orang Tua / Wali</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Nama Ayah Kandung
                </label>
                <input
                  type="text"
                  value={formData.namaAyah || ''}
                  onChange={e => handleChange('namaAyah', e.target.value)}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-900 dark:text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Nama Ibu Kandung
                </label>
                <input
                  type="text"
                  value={formData.namaIbu || ''}
                  onChange={e => handleChange('namaIbu', e.target.value)}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-900 dark:text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Pekerjaan Orang Tua
                </label>
                <input
                  type="text"
                  value={formData.pekerjaanOrtu || ''}
                  onChange={e => handleChange('pekerjaanOrtu', e.target.value)}
                  placeholder="Contoh: Karyawan Swasta / Wiraswasta"
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  No. Telepon / WhatsApp Orang Tua
                </label>
                <input
                  type="text"
                  value={formData.noHpOrtu || ''}
                  onChange={e => handleChange('noHpOrtu', e.target.value)}
                  placeholder="Contoh: 081234567890"
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs font-mono text-slate-900 dark:text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Modal Actions */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-5 py-2 text-xs font-bold text-white shadow-md hover:bg-blue-700 active:scale-95 transition-all"
            >
              <Save className="h-4 w-4" />
              <span>Simpan Perubahan Biodata</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
