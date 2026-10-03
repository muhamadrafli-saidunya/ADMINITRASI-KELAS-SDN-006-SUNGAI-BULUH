import React from 'react';
import { Teacher } from '../../types';
import { Modal } from '../common/Modal';
import {
  UserCheck,
  Briefcase,
  GraduationCap,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Award,
  BookOpen,
  MessageCircle,
  Edit3,
  Printer,
  ShieldCheck,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface DetailGuruModalProps {
  isOpen: boolean;
  onClose: () => void;
  teacher: Teacher | null;
  onEdit: (teacher: Teacher) => void;
  onPrintSingle?: (teacher: Teacher) => void;
}

export const DetailGuruModal: React.FC<DetailGuruModalProps> = ({
  isOpen,
  onClose,
  teacher,
  onEdit,
  onPrintSingle
}) => {
  if (!isOpen || !teacher) return null;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Aktif':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
      case 'Cuti':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200 dark:border-amber-800';
      case 'Mutasi':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950/40 dark:text-blue-300 border-blue-200 dark:border-blue-800';
      default:
        return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700';
    }
  };

  const getKepegawaianBadge = (status: string) => {
    switch (status) {
      case 'PNS':
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/40 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800';
      case 'PPPK':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-950/40 dark:text-purple-300 border-purple-200 dark:border-purple-800';
      case 'GTT / Honorer':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200 dark:border-amber-800';
      default:
        return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700';
    }
  };

  const cleanPhone = teacher.noHp.replace(/\D/g, '');
  const waUrl = cleanPhone.startsWith('0')
    ? `https://wa.me/62${cleanPhone.slice(1)}`
    : `https://wa.me/${cleanPhone}`;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Buku Induk & Profil Pendidik"
      maxWidth="3xl"
    >
      <div className="space-y-6">
        {/* Header Profile Card */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white p-5 sm:p-6 shadow-md">
          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
            <div className="relative">
              <img
                src={teacher.fotoUrl || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&auto=format&fit=crop&q=80'}
                alt={teacher.nama}
                className="h-20 w-20 sm:h-24 sm:w-24 rounded-2xl object-cover border-2 border-white/30 shadow-lg"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&auto=format&fit=crop&q=80';
                }}
              />
              <span className={`absolute -bottom-1.5 -right-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadge(teacher.statusAktif)}`}>
                {teacher.statusAktif}
              </span>
            </div>

            <div className="flex-1 space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold border ${getKepegawaianBadge(teacher.statusKepegawaian)}`}>
                  {teacher.statusKepegawaian}
                </span>
                <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-bold bg-white/10 text-purple-200 border border-white/15">
                  {teacher.jenisGuru}
                </span>
                {teacher.golonganPangkat && teacher.golonganPangkat !== '-' && (
                  <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-medium bg-white/10 text-slate-200 border border-white/15">
                    Gol. {teacher.golonganPangkat}
                  </span>
                )}
              </div>

              <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                {teacher.nama}
              </h3>

              <p className="text-xs sm:text-sm text-purple-200 font-medium flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-purple-300" />
                <span>{teacher.jabatan}</span>
                {teacher.kelasDiampu && (
                  <span className="text-slate-300">• {teacher.kelasDiampu}</span>
                )}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-300 pt-1">
                <span>NIP: <strong className="font-mono text-white">{teacher.nip || '-'}</strong></span>
                <span>NUPTK: <strong className="font-mono text-white">{teacher.nuptk || '-'}</strong></span>
              </div>
            </div>

            {/* Quick Action in Header */}
            {teacher.noHp && (
              <a
                href={waUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold shadow-md transition-all active:scale-95 self-stretch sm:self-auto justify-center"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Hubungi WA</span>
              </a>
            )}
          </div>
        </div>

        {/* 4 Information Blocks */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Block 1: Identitas & Kontak */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 p-4 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 border-b border-slate-200 dark:border-slate-700/60 pb-2">
              <UserCheck className="h-4 w-4 text-purple-600" />
              <span>Biodata & Kontak Guru</span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400">Jenis Kelamin:</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {teacher.jenisKelamin === 'L' ? 'Laki-Laki' : 'Perempuan'}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400">Tempat, Tgl Lahir:</span>
                <span className="font-medium text-slate-900 dark:text-white text-right">
                  {teacher.tempatLahir ? `${teacher.tempatLahir}, ` : ''}{teacher.tanggalLahir || '-'}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400">No. WhatsApp / HP:</span>
                <span className="font-mono font-bold text-purple-600 dark:text-purple-400">
                  {teacher.noHp || '-'}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400">Email Dinas / Akun:</span>
                <span className="font-medium text-slate-900 dark:text-white truncate max-w-[180px]">
                  {teacher.email || '-'}
                </span>
              </div>
              <div className="py-1">
                <span className="text-slate-500 dark:text-slate-400 block mb-0.5">Alamat Lengkap:</span>
                <span className="font-medium text-slate-800 dark:text-slate-200">
                  {teacher.alamat || 'Belum dicantumkan'}
                </span>
              </div>
            </div>
          </div>

          {/* Block 2: Kepegawaian & Kualifikasi */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 p-4 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 border-b border-slate-200 dark:border-slate-700/60 pb-2">
              <GraduationCap className="h-4 w-4 text-indigo-600" />
              <span>Akademik & Status SK</span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400">Pendidikan Terakhir:</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {teacher.pendidikanTerakhir}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400">Jurusan / Prodi:</span>
                <span className="font-medium text-slate-900 dark:text-white">
                  {teacher.jurusan || '-'}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400">Status Kepegawaian:</span>
                <span className="font-bold text-indigo-600 dark:text-indigo-400">
                  {teacher.statusKepegawaian}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400">Pangkat & Golongan:</span>
                <span className="font-medium text-slate-900 dark:text-white">
                  {teacher.golonganPangkat || '-'}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500 dark:text-slate-400">Tanggal Mulai Tugas:</span>
                <span className="font-medium text-slate-800 dark:text-slate-200">
                  {teacher.tanggalBergabung || '-'}
                </span>
              </div>
            </div>
          </div>

          {/* Block 3: Penugasan & Mata Pelajaran */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 p-4 space-y-3 md:col-span-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 border-b border-slate-200 dark:border-slate-700/60 pb-2">
              <BookOpen className="h-4 w-4 text-emerald-600" />
              <span>Alokasi Penugasan & Catatan Sekolah</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-2">
                <div>
                  <span className="text-slate-500 dark:text-slate-400 block text-[11px] mb-1 font-semibold">
                    Mata Pelajaran yang Diampu:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {teacher.mataPelajaranUtama && teacher.mataPelajaranUtama.length > 0 ? (
                      teacher.mataPelajaranUtama.map((mapel, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 font-semibold text-[11px] border border-emerald-200 dark:border-emerald-800"
                        >
                          {mapel}
                        </span>
                      ))
                    ) : (
                      <span className="text-slate-400">Belum diatur</span>
                    )}
                  </div>
                </div>

                <div className="pt-2">
                  <span className="text-slate-500 dark:text-slate-400 block text-[11px] mb-0.5 font-semibold">
                    Tugas Tambahan Sekolah:
                  </span>
                  <p className="font-medium text-slate-900 dark:text-white bg-white dark:bg-slate-800 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700">
                    {teacher.tugasTambahan || 'Tidak ada tugas tambahan'}
                  </p>
                </div>
              </div>

              <div>
                <span className="text-slate-500 dark:text-slate-400 block text-[11px] mb-1 font-semibold">
                  Catatan Khusus / Prestasi Pendidik:
                </span>
                <div className="p-3 rounded-xl bg-purple-50/60 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/40 text-purple-950 dark:text-purple-200 min-h-[90px]">
                  <p className="italic text-[11px] leading-relaxed">
                    {teacher.catatanKhusus || 'Belum ada catatan khusus yang ditambahkan untuk guru ini.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
          <div className="text-[11px] text-slate-500 dark:text-slate-400">
            ID Sistem: <span className="font-mono">{teacher.id}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Tutup
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                onEdit(teacher);
              }}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-purple-600 hover:bg-purple-700 text-white shadow-md shadow-purple-600/20 active:scale-95 transition-all"
            >
              <Edit3 className="h-3.5 w-3.5" />
              <span>Edit Data Guru</span>
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
