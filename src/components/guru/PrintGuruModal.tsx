import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Teacher } from '../../types';
import { Modal } from '../common/Modal';
import { HeaderKopSekolah } from '../common/HeaderKopSekolah';
import {
  Printer,
  FileSpreadsheet,
  Building2,
  Calendar,
  UserCheck,
  CheckCircle2,
  Filter
} from 'lucide-react';

interface PrintGuruModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTeacher?: Teacher | null;
}

export const PrintGuruModal: React.FC<PrintGuruModalProps> = ({
  isOpen,
  onClose,
  selectedTeacher
}) => {
  const { schoolInfo, teachers } = useApp();

  const [printMode, setPrintMode] = useState<'rekap' | 'single'>(
    selectedTeacher ? 'single' : 'rekap'
  );
  const [filterKepegawaian, setFilterKepegawaian] = useState<string>('Semua');
  const [filterStatus, setFilterStatus] = useState<string>('Semua');
  const [targetTeacherId, setTargetTeacherId] = useState<string>(
    selectedTeacher?.id || (teachers[0]?.id || '')
  );

  if (!isOpen) return null;

  const filteredTeachers = teachers.filter(t => {
    if (filterKepegawaian !== 'Semua' && t.statusKepegawaian !== filterKepegawaian) return false;
    if (filterStatus !== 'Semua' && t.statusAktif !== filterStatus) return false;
    return true;
  });

  const activeTeacher = teachers.find(t => t.id === targetTeacherId) || teachers[0];

  const handlePrint = () => {
    window.print();
  };

  const currentDate = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Cetak Buku Induk & Data Kepegawaian Guru"
      maxWidth="4xl"
    >
      <div className="space-y-6">
        {/* Controls Bar (Hidden during window.print) */}
        <div className="no-print p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPrintMode('rekap')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  printMode === 'rekap'
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
                    : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                }`}
              >
                Daftar Rekapitulasi (DUK Guru & Tendik)
              </button>
              <button
                type="button"
                onClick={() => setPrintMode('single')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  printMode === 'single'
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
                    : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                }`}
              >
                Lembar Profil Individu Guru
              </button>
            </div>

            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 text-xs font-bold shadow transition-all active:scale-95"
            >
              <Printer className="h-4 w-4" />
              <span>Cetak Sekarang (Print / PDF)</span>
            </button>
          </div>

          {printMode === 'rekap' ? (
            <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-slate-200 dark:border-slate-700 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-600 dark:text-slate-400">Filter Kepegawaian:</span>
                <select
                  value={filterKepegawaian}
                  onChange={e => setFilterKepegawaian(e.target.value)}
                  className="rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-2.5 py-1 text-xs"
                >
                  <option value="Semua">Semua Status</option>
                  <option value="PNS">PNS</option>
                  <option value="PPPK">PPPK</option>
                  <option value="GTT / Honorer">GTT / Honorer</option>
                  <option value="Guru Tetap Yayasan">Yayasan</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-600 dark:text-slate-400">Status Keaktifan:</span>
                <select
                  value={filterStatus}
                  onChange={e => setFilterStatus(e.target.value)}
                  className="rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-2.5 py-1 text-xs"
                >
                  <option value="Semua">Semua</option>
                  <option value="Aktif">Aktif Saja</option>
                  <option value="Cuti">Cuti</option>
                  <option value="Mutasi">Mutasi</option>
                  <option value="Pensiun">Purna Tugas</option>
                </select>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 pt-2 border-t border-slate-200 dark:border-slate-700 text-xs">
              <span className="font-semibold text-slate-600 dark:text-slate-400">Pilih Guru:</span>
              <select
                value={targetTeacherId}
                onChange={e => setTargetTeacherId(e.target.value)}
                className="flex-1 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-1.5 text-xs font-medium"
              >
                {teachers.map(t => (
                  <option key={t.id} value={t.id}>
                    {t.nama} ({t.jabatan}) - {t.statusKepegawaian}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Printable Area */}
        <div
          id="printable-official-document"
          className="printable-document-sheet bg-white text-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm print:p-0 print:border-none print:shadow-none font-sans text-xs print:m-0 print:w-full"
        >
          {/* Kop Sekolah */}
          <HeaderKopSekolah
            documentTitle={
              printMode === 'rekap'
                ? "DAFTAR URUT KEPEGAWAIAN (DUK) & BUKU INDUK PENDIDIK / TENDIK"
                : "LEMBAR BIODATA & RIWAYAT PENUGASAN GURU"
            }
            subTitle={
              printMode === 'rekap'
                ? `Tahun Ajaran ${schoolInfo.academicYear} • Semester ${schoolInfo.semester}`
                : `Nomor Induk PTK: ${activeTeacher.id} • Status: ${activeTeacher.statusAktif}`
            }
          />

          {/* Document Content */}
          {printMode === 'rekap' ? (
            <div className="space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-black text-[10px]">
                  <thead>
                    <tr className="bg-slate-100 text-slate-900">
                      <th className="border border-black p-1.5 text-center w-8">No</th>
                      <th className="border border-black p-1.5 text-left">Nama Lengkap & Gelar</th>
                      <th className="border border-black p-1.5 text-center">NIP / NUPTK</th>
                      <th className="border border-black p-1.5 text-center w-8">L/P</th>
                      <th className="border border-black p-1.5 text-left">Jabatan & Tugas</th>
                      <th className="border border-black p-1.5 text-center">Status</th>
                      <th className="border border-black p-1.5 text-left">Gol / Pangkat</th>
                      <th className="border border-black p-1.5 text-left">Pendidikan</th>
                      <th className="border border-black p-1.5 text-center">No. Kontak</th>
                      <th className="border border-black p-1.5 text-center">Keaktifan</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTeachers.map((t, idx) => (
                      <tr key={t.id} className={idx % 2 === 1 ? 'bg-slate-50' : ''}>
                        <td className="border border-black p-1.5 text-center font-bold">{idx + 1}</td>
                        <td className="border border-black p-1.5 font-bold">{t.nama}</td>
                        <td className="border border-black p-1.5 text-center font-mono">
                          <div>{t.nip !== '-' ? t.nip : '-'}</div>
                          {t.nuptk && t.nuptk !== '-' && (
                            <div className="text-[9px] text-slate-500">NUPTK: {t.nuptk}</div>
                          )}
                        </td>
                        <td className="border border-black p-1.5 text-center font-bold">{t.jenisKelamin}</td>
                        <td className="border border-black p-1.5">
                          <div className="font-semibold">{t.jabatan}</div>
                          {t.kelasDiampu && <div className="text-[9px] text-slate-600">{t.kelasDiampu}</div>}
                        </td>
                        <td className="border border-black p-1.5 text-center font-semibold">{t.statusKepegawaian}</td>
                        <td className="border border-black p-1.5">{t.golonganPangkat || '-'}</td>
                        <td className="border border-black p-1.5">
                          <div>{t.pendidikanTerakhir}</div>
                          {t.jurusan && <div className="text-[9px] text-slate-500">{t.jurusan}</div>}
                        </td>
                        <td className="border border-black p-1.5 text-center font-mono">{t.noHp || '-'}</td>
                        <td className="border border-black p-1.5 text-center font-bold">{t.statusAktif}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="text-[10px] text-slate-500 italic mt-2">
                Total Tenaga Pendidik & Kependidikan: {filteredTeachers.length} Orang
              </div>
            </div>
          ) : (
            /* Single Teacher Dossier */
            <div className="space-y-5">
              <div className="flex items-start gap-6 border border-black p-4 rounded-xl">
                <div className="w-28 text-center space-y-2 flex-shrink-0">
                  <img
                    src={activeTeacher.fotoUrl || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&auto=format&fit=crop&q=80'}
                    alt={activeTeacher.nama}
                    className="w-28 h-36 object-cover border border-black rounded-lg"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&auto=format&fit=crop&q=80';
                    }}
                  />
                  <span className="block text-[9px] font-bold text-slate-600 uppercase border border-slate-300 py-0.5 rounded">
                    Pasfoto 3x4
                  </span>
                </div>

                <div className="flex-1 grid grid-cols-2 gap-y-2 text-xs">
                  <div className="col-span-2 flex border-b border-slate-200 pb-1">
                    <span className="w-40 font-bold">Nama Lengkap & Gelar:</span>
                    <span className="flex-1 font-bold text-sm">{activeTeacher.nama}</span>
                  </div>
                  <div className="flex">
                    <span className="w-40 font-semibold">NIP:</span>
                    <span className="font-mono">{activeTeacher.nip || '-'}</span>
                  </div>
                  <div className="flex">
                    <span className="w-40 font-semibold">NUPTK:</span>
                    <span className="font-mono">{activeTeacher.nuptk || '-'}</span>
                  </div>
                  <div className="flex">
                    <span className="w-40 font-semibold">Jenis Kelamin:</span>
                    <span>{activeTeacher.jenisKelamin === 'L' ? 'Laki-Laki (L)' : 'Perempuan (P)'}</span>
                  </div>
                  <div className="flex">
                    <span className="w-40 font-semibold">Tempat, Tgl Lahir:</span>
                    <span>{activeTeacher.tempatLahir ? `${activeTeacher.tempatLahir}, ` : ''}{activeTeacher.tanggalLahir || '-'}</span>
                  </div>
                  <div className="flex">
                    <span className="w-40 font-semibold">Status Kepegawaian:</span>
                    <span className="font-bold">{activeTeacher.statusKepegawaian}</span>
                  </div>
                  <div className="flex">
                    <span className="w-40 font-semibold">Pangkat / Golongan:</span>
                    <span>{activeTeacher.golonganPangkat || '-'}</span>
                  </div>
                  <div className="flex">
                    <span className="w-40 font-semibold">Jabatan di Sekolah:</span>
                    <span className="font-semibold">{activeTeacher.jabatan}</span>
                  </div>
                  <div className="flex">
                    <span className="w-40 font-semibold">Jenis Guru:</span>
                    <span>{activeTeacher.jenisGuru}</span>
                  </div>
                  <div className="flex">
                    <span className="w-40 font-semibold">Pendidikan Terakhir:</span>
                    <span>{activeTeacher.pendidikanTerakhir} ({activeTeacher.jurusan || '-'})</span>
                  </div>
                  <div className="flex">
                    <span className="w-40 font-semibold">Kelas yang Diampu:</span>
                    <span>{activeTeacher.kelasDiampu || '-'}</span>
                  </div>
                  <div className="col-span-2 flex border-t border-slate-200 pt-1">
                    <span className="w-40 font-semibold">Mata Pelajaran:</span>
                    <span className="flex-1 font-medium">
                      {(activeTeacher.mataPelajaranUtama || []).join(', ') || '-'}
                    </span>
                  </div>
                  <div className="col-span-2 flex">
                    <span className="w-40 font-semibold">Tugas Tambahan:</span>
                    <span className="flex-1">{activeTeacher.tugasTambahan || '-'}</span>
                  </div>
                  <div className="col-span-2 flex">
                    <span className="w-40 font-semibold">No. HP / WhatsApp:</span>
                    <span className="font-mono">{activeTeacher.noHp}</span>
                  </div>
                  <div className="col-span-2 flex">
                    <span className="w-40 font-semibold">Email:</span>
                    <span>{activeTeacher.email}</span>
                  </div>
                  <div className="col-span-2 flex">
                    <span className="w-40 font-semibold">Alamat Lengkap:</span>
                    <span className="flex-1">{activeTeacher.alamat || '-'}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tanda Tangan */}
          <div className="grid grid-cols-2 gap-8 mt-12 pt-4 text-center text-xs page-break-inside-avoid">
            <div className="space-y-16">
              <p className="font-semibold">
                Mengetahui,<br />
                Kepala Sekolah {schoolInfo.schoolName}
              </p>
              <div>
                <p className="font-bold underline uppercase">{schoolInfo.headmasterName}</p>
                <p className="text-[11px] text-slate-600 font-mono">NIP. {schoolInfo.headmasterNip}</p>
              </div>
            </div>

            <div className="space-y-16">
              <p className="font-semibold">
                {schoolInfo.city}, {currentDate}<br />
                {printMode === 'single' ? 'Pendidik / Tenaga Kependidikan' : 'Petugas Administrasi / Operator'}
              </p>
              <div>
                <p className="font-bold underline uppercase">
                  {printMode === 'single' ? activeTeacher.nama : schoolInfo.homeroomTeacherName}
                </p>
                <p className="text-[11px] text-slate-600 font-mono">
                  NIP. {printMode === 'single' ? activeTeacher.nip : schoolInfo.homeroomTeacherNip}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

