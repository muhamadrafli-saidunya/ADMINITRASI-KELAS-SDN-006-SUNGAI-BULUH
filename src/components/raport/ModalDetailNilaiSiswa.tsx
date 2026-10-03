import React from 'react';
import { useApp } from '../../context/AppContext';
import { Student, normalizeSemester } from '../../types';
import { Modal } from '../common/Modal';
import { isAgamaSubject, getReligionSubjectName, getReligionSubjectCode } from '../../utils/agamaHelper';
import {
  Award,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  User,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Edit3,
  Printer,
  Sparkles,
  FileSpreadsheet,
  MessageSquare
} from 'lucide-react';

interface ModalDetailNilaiSiswaProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student;
  onSelectNextStudent?: () => void;
  onSelectPrevStudent?: () => void;
  onOpenEditRapor?: () => void;
  onOpenFullRapor?: () => void;
}

export const ModalDetailNilaiSiswa: React.FC<ModalDetailNilaiSiswaProps> = ({
  isOpen,
  onClose,
  student,
  onSelectNextStudent,
  onSelectPrevStudent,
  onOpenEditRapor,
  onOpenFullRapor
}) => {
  const {
    schoolInfo,
    subjects,
    getAllGradesForStudent,
    getStudentReport,
    getStudentAttendanceStats,
    getStudentKokurikulerInfo,
    grades
  } = useApp();

  const studentGrades = getAllGradesForStudent(student.id);
  const report = getStudentReport(student.id);
  const attStats = getStudentAttendanceStats(student.id);
  const kokurInfo = getStudentKokurikulerInfo(student.id);
  const kokurDesc = report.deskripsiKokurikuler?.trim() || kokurInfo.deskripsi;

  const totalScore = studentGrades.reduce((sum, g) => sum + g.nilaiAkhir, 0);
  const avgScore = studentGrades.length > 0 ? +(totalScore / studentGrades.length).toFixed(1) : 0;
  const completedSubjectsCount = studentGrades.filter(g => g.ketercapaian === 'Tuntas').length;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Rincian Rekapitulasi Nilai: ${student.nama}`}
      size="xl"
    >
      <div className="space-y-5">
        {/* Header Siswa & Ranking Badge */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-gradient-to-r from-blue-50/80 via-indigo-50/60 to-purple-50/60 dark:from-blue-950/40 dark:via-indigo-950/30 dark:to-purple-950/30 p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-black text-lg shadow-md shadow-blue-600/20">
                {student.nomorAbsen || student.nama.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                    {student.nama}
                  </h3>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    student.jenisKelamin === 'L' 
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300'
                      : 'bg-pink-100 text-pink-800 dark:bg-pink-900/60 dark:text-pink-300'
                  }`}>
                    {student.jenisKelamin === 'L' ? 'Laki-laki' : 'Perempuan'}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                    Agama: {student.agama || 'Islam'}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 font-mono mt-0.5">
                  NISN: {student.nisn} &bull; NIS: {student.nis || '-'} &bull; Kelas {schoolInfo.className} ({schoolInfo.phase || 'Fase B'})
                </p>
              </div>
            </div>

            {/* Ranking Pill & Navigation */}
            <div className="flex items-center gap-2 self-stretch sm:self-auto justify-between sm:justify-end">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/15 border border-amber-300 dark:border-amber-700/60 text-amber-900 dark:text-amber-300 text-xs font-black">
                <Award className="h-4 w-4 text-amber-500" />
                <span>Peringkat #{report.ranking || '-'} Se-Kelas</span>
              </div>

              <div className="flex items-center gap-1">
                {onSelectPrevStudent && (
                  <button
                    type="button"
                    onClick={onSelectPrevStudent}
                    className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
                    title="Siswa Sebelumnya"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                )}
                {onSelectNextStudent && (
                  <button
                    type="button"
                    onClick={onSelectNextStudent}
                    className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
                    title="Siswa Berikutnya"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-4 pt-3 border-t border-slate-200/70 dark:border-slate-800">
            <div className="bg-white/80 dark:bg-slate-900/80 rounded-xl p-2.5 border border-slate-200/50 dark:border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Total Akumulasi</span>
              <span className="text-base font-black text-blue-600 dark:text-blue-400">{totalScore}</span>
              <span className="text-[10px] text-slate-400 ml-1">poin</span>
            </div>

            <div className="bg-white/80 dark:bg-slate-900/80 rounded-xl p-2.5 border border-slate-200/50 dark:border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Rata-Rata Rapor</span>
              <span className="text-base font-black text-slate-900 dark:text-white">{avgScore}</span>
              <span className="text-[10px] text-slate-400 ml-1">/ 100</span>
            </div>

            <div className="bg-white/80 dark:bg-slate-900/80 rounded-xl p-2.5 border border-slate-200/50 dark:border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Ketuntasan KKTP</span>
              <span className="text-base font-black text-emerald-600 dark:text-emerald-400">
                {completedSubjectsCount} / {studentGrades.length}
              </span>
              <span className="text-[10px] text-slate-400 ml-1">Mapel</span>
            </div>

            <div className="bg-white/80 dark:bg-slate-900/80 rounded-xl p-2.5 border border-slate-200/50 dark:border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Presensi (S/I/A)</span>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                S: {attStats.sakit} &bull; I: {attStats.izin} &bull; A: {attStats.alpa}
              </span>
              <span className="text-[10px] text-emerald-600 block font-semibold">{attStats.percentage}% Hadir</span>
            </div>
          </div>
        </div>

        {/* Tabel Komponen Formatif, Sumatif STS, SAS & Nilai Akhir */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
          <div className="p-3.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <BookOpen className="h-4 w-4 text-blue-600" />
              <span>Rincian Asesmen Formatif (TP) & Sumatif per Mata Pelajaran</span>
            </h4>
            <span className="text-[11px] text-slate-500">
              Formula: 40% Rata-rata Formatif + 30% ASTS + 30% SAS
            </span>
          </div>

          <div className="overflow-x-auto max-h-72 custom-scrollbar">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 text-[10.5px] font-bold uppercase sticky top-0 z-10">
                <tr className="border-b border-slate-200 dark:border-slate-800">
                  <th className="py-2.5 px-3 w-10 text-center">No</th>
                  <th className="py-2.5 px-3 min-w-[160px]">Mata Pelajaran</th>
                  <th className="py-2.5 px-2 text-center w-14">KKTP</th>
                  <th className="py-2.5 px-2 text-center w-16">TP 1</th>
                  <th className="py-2.5 px-2 text-center w-16">TP 2</th>
                  <th className="py-2.5 px-2 text-center w-16">TP 3</th>
                  <th className="py-2.5 px-2 text-center w-16">TP 4</th>
                  <th className="py-2.5 px-2 text-center w-16 bg-blue-50/50 dark:bg-blue-950/20 text-blue-900 dark:text-blue-300">
                    ASTS
                  </th>
                  <th className="py-2.5 px-2 text-center w-16 bg-indigo-50/50 dark:bg-indigo-950/20 text-indigo-900 dark:text-indigo-300">
                    SAS
                  </th>
                  <th className="py-2.5 px-3 text-center w-20 bg-slate-100 dark:bg-slate-800 font-black">
                    Nilai Akhir
                  </th>
                  <th className="py-2.5 px-2 text-center w-14">Predikat</th>
                  <th className="py-2.5 px-3 min-w-[220px]">Capaian Kompetensi (Deskripsi Rapor)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {studentGrades.map((item, idx) => {
                  const activeSem = normalizeSemester(schoolInfo.semester);
                  const subjectGrades = grades.filter(
                    g => g.siswaId === student.id && 
                         g.mapelId === item.subject.id &&
                         normalizeSemester(g.semester) === activeSem
                  );
                  const tp1 = subjectGrades.find(g => g.jenis === 'Formatif_TP1')?.nilai ?? '-';
                  const tp2 = subjectGrades.find(g => g.jenis === 'Formatif_TP2')?.nilai ?? '-';
                  const tp3 = subjectGrades.find(g => g.jenis === 'Formatif_TP3')?.nilai ?? '-';
                  const tp4 = subjectGrades.find(g => g.jenis === 'Formatif_TP4')?.nilai ?? '-';

                  const isTuntas = item.nilaiAkhir >= item.subject.kktp;

                  return (
                    <tr
                      key={item.subject.id}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="py-2.5 px-3 text-center font-bold text-slate-500">
                        {idx + 1}
                      </td>
                      <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-slate-100">
                        <div className="flex items-center gap-1.5">
                          <span className="truncate">
                            {isAgamaSubject(item.subject)
                              ? getReligionSubjectName(student.agama, item.subject.nama)
                              : item.subject.nama}
                          </span>
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 font-mono text-slate-500">
                            {isAgamaSubject(item.subject)
                              ? getReligionSubjectCode(student.agama, item.subject.kode)
                              : item.subject.kode}
                          </span>
                        </div>
                      </td>
                      <td className="py-2.5 px-2 text-center font-mono text-slate-500">
                        {item.subject.kktp}
                      </td>
                      <td className="py-2.5 px-2 text-center font-mono">{tp1}</td>
                      <td className="py-2.5 px-2 text-center font-mono">{tp2}</td>
                      <td className="py-2.5 px-2 text-center font-mono">{tp3}</td>
                      <td className="py-2.5 px-2 text-center font-mono">{tp4}</td>
                      <td className="py-2.5 px-2 text-center font-mono font-bold text-blue-700 dark:text-blue-300 bg-blue-50/30 dark:bg-blue-950/10">
                        {item.sumatifSts}
                      </td>
                      <td className="py-2.5 px-2 text-center font-mono font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50/30 dark:bg-indigo-950/10">
                        {item.sumatifSas}
                      </td>
                      <td className="py-2.5 px-3 text-center font-black text-sm bg-slate-50/80 dark:bg-slate-800/60">
                        <span className={isTuntas ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}>
                          {item.nilaiAkhir}
                        </span>
                      </td>
                      <td className="py-2.5 px-2 text-center">
                        <span className={`px-2 py-0.5 rounded-md font-bold text-[10.5px] ${
                          item.predikat === 'A'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : item.predikat === 'B'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                            : item.predikat === 'C'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                            : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                        }`}>
                          {item.predikat}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                        {item.deskripsiCapaian || '-'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Catatan Wali Kelas & Keputusan Kenaikan */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60 p-3.5 space-y-1.5">
            <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
              <span>Catatan Wali Kelas di Lembar Rapor:</span>
            </span>
            <p className="text-xs text-slate-600 dark:text-slate-300 italic leading-relaxed bg-white dark:bg-slate-800/80 p-2.5 rounded-xl border border-slate-200/60 dark:border-slate-700">
              {report.catatanWaliKelas || 'Belum ada catatan wali kelas.'}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60 p-3.5 space-y-1.5">
            <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
              <span>Keputusan Kenaikan Kelas / Kelulusan:</span>
            </span>
            <div className="bg-white dark:bg-slate-800/80 p-2.5 rounded-xl border border-slate-200/60 dark:border-slate-700 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300">
                  Status: {report.statusKenaikan || 'Naik Kelas'}
                </span>
                <span className="text-[10px] text-slate-500 font-medium">
                  Target: {report.targetKelas || 'V (Lima)'}
                </span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2">
                {report.keteranganKenaikan || '-'}
              </p>
            </div>
          </div>
        </div>

        {/* Deskripsi Kokurikuler & Tanggapan Orang Tua (Semester 1 & 2) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div className="rounded-2xl border border-purple-200/70 dark:border-purple-850 bg-purple-50/40 dark:bg-purple-950/20 p-3.5 space-y-1.5">
            <span className="text-[11px] font-bold text-purple-900 dark:text-purple-300 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-purple-600" />
                <span>Deskripsi Kokurikuler (Kolom D):</span>
              </span>
              <span className="text-[9.5px] bg-purple-100 dark:bg-purple-900/60 px-2 py-0.5 rounded text-purple-800 dark:text-purple-200 font-semibold truncate max-w-[140px]">
                {kokurInfo.projekJudul}
              </span>
            </span>
            <p className="text-xs text-slate-700 dark:text-slate-300 italic leading-relaxed bg-white dark:bg-slate-800/80 p-2.5 rounded-xl border border-purple-200/60 dark:border-purple-800/40">
              {kokurDesc}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60 p-3.5 space-y-1.5">
            <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <MessageSquare className="h-3.5 w-3.5 text-emerald-600" />
              <span>Tanggapan Orang Tua / Wali Murid:</span>
            </span>
            <div className="bg-white dark:bg-slate-800/80 p-2.5 rounded-xl border border-slate-200/60 dark:border-slate-700 min-h-[58px] flex items-center">
              {report.tanggapanOrangTua ? (
                <p className="text-xs text-slate-700 dark:text-slate-300 italic leading-relaxed">
                  {report.tanggapanOrangTua}
                </p>
              ) : (
                <p className="text-xs text-slate-400 italic">
                  Format bergaris kosong pada lembar cetak rapor (untuk tulisan tangan orang tua/wali).
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Action Footer */}
        <div className="flex items-center justify-between gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Tutup
          </button>

          <div className="flex items-center gap-2">
            {onOpenEditRapor && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenEditRapor();
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                <Edit3 className="h-3.5 w-3.5" />
                <span>Edit Catatan & Ranking</span>
              </button>
            )}

            {onOpenFullRapor && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenFullRapor();
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-bold shadow-md shadow-blue-600/20 transition-all"
              >
                <Printer className="h-3.5 w-3.5" />
                <span>Buka Lembar Rapor Lengkap</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};
