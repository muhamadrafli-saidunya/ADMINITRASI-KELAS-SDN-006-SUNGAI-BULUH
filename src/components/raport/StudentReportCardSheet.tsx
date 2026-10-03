import React from 'react';
import { Edit3, RotateCcw, Check, Eye, EyeOff, FileText } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Student, isSemesterGenap, ReportType } from '../../types';
import { HeaderKopSekolah } from '../common/HeaderKopSekolah';
import { isAgamaSubject, getReligionSubjectName } from '../../utils/agamaHelper';

export interface PrintSettings {
  paperSize: 'A4' | 'F4';
  density: 'normal' | 'compact' | 'spacious';
  pageBreakMode?: 'standard_2page' | 'continuous';
  showKop: boolean;
  showWatermark: boolean;
  showSignature: boolean;
  showRanking: boolean;
  reportType?: ReportType;
  equalizeLogos?: boolean;
  logoSize?: number;
  parentSignatureChoice?: 'ayah' | 'ibu' | 'dots';
  showMidDeskripsi?: boolean;
}

interface StudentReportCardSheetProps {
  student: Student;
  printSettings?: Partial<PrintSettings>;
  className?: string;
  isPageBreakAfter?: boolean;
  onToggleShowMidDeskripsi?: (val: boolean) => void;
}

export const StudentReportCardSheet: React.FC<StudentReportCardSheetProps> = ({
  student,
  printSettings,
  className = '',
  isPageBreakAfter = false,
  onToggleShowMidDeskripsi
}: StudentReportCardSheetProps) => {
  const {
    schoolInfo,
    students,
    getAllGradesForStudent,
    getAllMidSemesterGradesForStudent,
    getStudentAttendanceStats,
    extracurriculars,
    getStudentReport,
    getStudentKokurikulerInfo,
    getEffectiveStudentAttendance,
    updateStudentReportAttendance,
    updateStudentReport
  } = useApp();

  const isGenap = isSemesterGenap(schoolInfo.semester);
  const isMidSemester = printSettings?.reportType === 'mid_semester';
  const reportData = getStudentReport(student.id);

  // Effective attendance: manual overrides or calculated from daily records
  const effectiveAttendance = getEffectiveStudentAttendance(student.id, isMidSemester);

  // Page break mode: standard 2 pages for semester report (Page 1: Nilai, Page 2: Catatan/TTD)
  const pageBreakMode = printSettings?.pageBreakMode || (isMidSemester ? 'continuous' : 'standard_2page');
  const shouldBreakToPage2 = !isMidSemester && pageBreakMode === 'standard_2page';

  // Choose grade calculation based on report type
  const fullGrades = getAllGradesForStudent(student.id);
  const midGrades = getAllMidSemesterGradesForStudent(student.id);
  const studentGrades = isMidSemester ? midGrades : fullGrades;
  const attendanceStats = getStudentAttendanceStats(student.id);

  const totalScore = isMidSemester
    ? midGrades.reduce((sum, g) => sum + (g.sumatifSts > 0 ? g.sumatifSts : (g.nilaiAkhirMid || 0)), 0)
    : fullGrades.reduce((sum, g) => sum + g.nilaiAkhir, 0);
  const avgScore = studentGrades.length > 0 ? +(totalScore / studentGrades.length).toFixed(1) : 0;

  // Filter extracurriculars for this student
  const studentExcurs = (extracurriculars || []).filter(e =>
    e.siswaId === student.id || (e.members && e.members.includes(student.id))
  );

  const kokurInfo = getStudentKokurikulerInfo(student.id);
  const kokurikulerDeskripsi = reportData.deskripsiKokurikuler?.trim() || kokurInfo.deskripsi;

  const density = printSettings?.density || 'normal';
  const showKop = printSettings?.showKop !== false;
  const showSignature = printSettings?.showSignature !== false;
  const showRanking = printSettings?.showRanking !== false && reportData.showRanking !== false;
  // Pilihan memunculkan atau menyembunyikan deskripsi capaian pembelajaran mendalam di rapor mid semester
  const showMidDeskripsi = printSettings?.showMidDeskripsi !== false && reportData.showMidDeskripsi !== false;

  const handleToggleDeskripsi = () => {
    const nextVal = !showMidDeskripsi;
    if (onToggleShowMidDeskripsi) {
      onToggleShowMidDeskripsi(nextVal);
    }
    updateStudentReport(student.id, { showMidDeskripsi: nextVal }, true);
  };

  // Adjust text & padding sizing based on density
  const tableTextSize = density === 'compact' ? 'text-[10px]' : density === 'spacious' ? 'text-[12px]' : 'text-[11px]';
  const tableDescSize = density === 'compact' ? 'text-[9.5px] leading-tight' : density === 'spacious' ? 'text-[11.5px] leading-relaxed' : 'text-[10.5px] leading-relaxed';
  const cellPadding = density === 'compact' ? 'p-1' : density === 'spacious' ? 'p-2.5' : 'p-1.5';
  const headerPadding = density === 'compact' ? 'p-1.5' : density === 'spacious' ? 'p-2.5' : 'p-2';
  const sectionSpacing = density === 'compact' ? 'mb-3.5 print:mb-2.5' : density === 'spacious' ? 'mb-7 print:mb-4' : 'mb-5 print:mb-3';

  const defaultMidTanggal = schoolInfo.semester?.includes('2')
    ? `${schoolInfo.city || 'Kota Jakarta Selatan'}, 28 Maret 2027`
    : `${schoolInfo.city || 'Kota Jakarta Selatan'}, 10 Oktober 2026`;

  const defaultSemesterTanggal = schoolInfo.semester?.includes('2')
    ? `${schoolInfo.city || 'Kota Jakarta Selatan'}, 20 Juni 2027`
    : `${schoolInfo.city || 'Kota Jakarta Selatan'}, 19 Desember 2026`;

  // Pilihan nama orang tua pada tanda tangan rapor KMPM
  const effectiveParentChoice = (() => {
    if (reportData.parentSignatureChoice && reportData.parentSignatureChoice !== 'auto') {
      return reportData.parentSignatureChoice;
    }
    return printSettings?.parentSignatureChoice || 'ayah';
  })();

  const { parentSignatureName, parentRoleSubtitle } = (() => {
    if (effectiveParentChoice === 'dots') {
      return {
        parentSignatureName: '......................................................',
        parentRoleSubtitle: 'Orang Tua / Wali'
      };
    }
    if (effectiveParentChoice === 'custom' && reportData.parentCustomName?.trim()) {
      return {
        parentSignatureName: reportData.parentCustomName.trim(),
        parentRoleSubtitle: 'Wali Peserta Didik'
      };
    }
    if (effectiveParentChoice === 'ibu') {
      const name = student.namaIbu?.trim() || student.namaAyah?.trim();
      return {
        parentSignatureName: name || '......................................................',
        parentRoleSubtitle: student.namaIbu?.trim() ? 'Orang Tua (Ibu)' : 'Orang Tua / Wali'
      };
    }
    // Default 'ayah'
    const name = student.namaAyah?.trim() || student.namaIbu?.trim();
    return {
      parentSignatureName: name || '......................................................',
      parentRoleSubtitle: student.namaAyah?.trim() ? 'Orang Tua (Ayah)' : 'Orang Tua / Wali'
    };
  })();

  return (
    <div
      className={`student-rapor-page bg-white text-black print:text-black w-full ${
        isPageBreakAfter ? 'print-page-break' : ''
      } ${className}`}
    >
      {/* ========================================================================= */}
      {/* LEMBAR 1: KOP RESMI, IDENTITAS, DAN TABEL A (NILAI MATA PELAJARAN)         */}
      {/* ========================================================================= */}
      <div className="report-sheet-page-1">
        {/* Kop Surat Resmi Sekolah */}
        {showKop ? (
          <HeaderKopSekolah
            equalizeLogos={printSettings?.equalizeLogos !== false}
            logoSize={printSettings?.logoSize}
            documentTitle={
              isMidSemester
                ? 'LAPORAN HASIL BELAJAR TENGAH SEMESTER (RAPOR ASTS KMPM)'
                : 'LAPORAN HASIL BELAJAR (RAPOR PESERTA DIDIK KMPM)'
            }
            subTitle={
              isMidSemester
                ? `KURIKULUM MERDEKA PEMBELAJARAN MENDALAM (KMPM) • ASESMEN SUMATIF TENGAH SEMESTER (ASTS) • TAHUN PELAJARAN ${schoolInfo.academicYear}`
                : 'KURIKULUM MERDEKA PEMBELAJARAN MENDALAM (KMPM) - KEMENDIKDASMEN RI'
            }
          />
        ) : (
          <div className="mb-4 print:mb-2 pb-2 border-b-2 border-slate-900 print:border-black text-center">
            <h2 className="text-base font-black uppercase tracking-wider text-black">
              {isMidSemester
                ? 'LAPORAN HASIL BELAJAR TENGAH SEMESTER (RAPOR ASTS KMPM)'
                : 'LAPORAN HASIL BELAJAR (RAPOR PESERTA DIDIK KMPM)'}
            </h2>
            <p className="text-xs font-semibold text-slate-700 print:text-black">
              KURIKULUM MERDEKA PEMBELAJARAN MENDALAM (KMPM) • {schoolInfo.schoolName.toUpperCase()}
            </p>
          </div>
        )}

        {/* Identitas Peserta Didik */}
        <div className={`my-3 print:my-2 rounded-xl print:rounded-none border border-slate-400 print:border-black ${density === 'compact' ? 'p-2.5 text-[11px]' : 'p-3.5 print:p-2.5 text-xs'}`}>
          <div className="grid grid-cols-2 gap-x-6 sm:gap-x-8 gap-y-1 sm:gap-y-1.5 print:grid-cols-2 print:gap-y-1 print:gap-x-6">
            <div className="flex">
              <span className="w-32 sm:w-36 print:w-36 text-slate-700 print:text-black font-medium shrink-0">Nama Peserta Didik</span>
              <span className="mr-1.5">:</span>
              <span className="font-extrabold uppercase text-slate-900 print:text-black truncate">{student.nama}</span>
            </div>
            <div className="flex">
              <span className="w-32 sm:w-36 print:w-36 text-slate-700 print:text-black font-medium shrink-0">Kelas / Fase</span>
              <span className="mr-1.5">:</span>
              <span className="font-bold text-slate-900 print:text-black">{schoolInfo.className} / {schoolInfo.phase}</span>
            </div>
            <div className="flex">
              <span className="w-32 sm:w-36 print:w-36 text-slate-700 print:text-black font-medium shrink-0">NISN / NIS</span>
              <span className="mr-1.5">:</span>
              <span className="font-mono font-bold text-slate-900 print:text-black">{student.nisn} / {student.nis || '-'}</span>
            </div>
            <div className="flex">
              <span className="w-32 sm:w-36 print:w-36 text-slate-700 print:text-black font-medium shrink-0">Semester</span>
              <span className="mr-1.5">:</span>
              <span className="font-bold text-slate-900 print:text-black">
                {schoolInfo.semester || '1 (Ganjil)'} {isMidSemester && '(Tengah Semester)'}
              </span>
            </div>
            <div className="flex">
              <span className="w-32 sm:w-36 print:w-36 text-slate-700 print:text-black font-medium shrink-0">Nama Sekolah</span>
              <span className="mr-1.5">:</span>
              <span className="font-bold text-slate-900 print:text-black truncate">{schoolInfo.schoolName}</span>
            </div>
            <div className="flex">
              <span className="w-32 sm:w-36 print:w-36 text-slate-700 print:text-black font-medium shrink-0">Tahun Pelajaran</span>
              <span className="mr-1.5">:</span>
              <span className="font-bold text-slate-900 print:text-black">{schoolInfo.academicYear}</span>
            </div>
            <div className="flex col-span-2 pt-1 border-t border-slate-200 print:border-black text-[10.5px] print:text-[10px]">
              <span className="w-32 sm:w-36 print:w-36 text-slate-700 print:text-black font-medium shrink-0">Kurikulum</span>
              <span className="mr-1.5">:</span>
              <span className="font-bold text-slate-900 print:text-black">
                {schoolInfo.kurikulum || 'Kurikulum Merdeka Pembelajaran Mendalam (KMPM)'}
              </span>
            </div>
          </div>

          {/* Optional Quick Ranking / GPA in Identity Box */}
          {showRanking && (
            <div className="mt-2 pt-1.5 border-t border-slate-300 print:border-black flex flex-wrap items-center justify-between text-xs print:text-[10px]">
              <div className="flex items-center gap-2">
                <span className="text-slate-700 print:text-black font-medium">
                  {isMidSemester ? 'Peringkat Tengah Semester:' : 'Peringkat / Ranking Kelas:'}
                </span>
                <span className="px-2 py-0.5 rounded-md print:rounded-none bg-amber-100 print:bg-gray-100 text-amber-950 print:text-black font-black border border-amber-300 print:border-black">
                  Ke - {isMidSemester ? (reportData.rankingMid || reportData.ranking || 1) : (reportData.ranking ?? 1)} dari {students.length} Siswa
                </span>
              </div>
              <div className="flex items-center gap-3 text-[11px] print:text-[10px] text-slate-700 print:text-black font-medium">
                <span>Total Nilai: <strong className="text-black">{totalScore}</strong></span>
                <span>•</span>
                <span>Nilai Rata-rata: <strong className="text-black">{avgScore}</strong></span>
              </div>
            </div>
          )}
        </div>

        {/* TABEL A: LAPORAN HASIL BELAJAR (NILAI & CAPAIAN KOMPETENSI) */}
        <div className={sectionSpacing}>
          <div className="flex items-center justify-between gap-2 mb-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 print:text-black">
              {isMidSemester
                ? (showMidDeskripsi
                    ? 'A. Nilai Capaian Pembelajaran Mendalam Tengah Semester (ASTS KMPM)'
                    : 'A. Rekapitulasi Nilai Asesmen Sumatif Tengah Semester (ASTS)')
                : 'A. Nilai Capaian Pembelajaran Mendalam Peserta Didik (KMPM)'}
            </h3>
            {isMidSemester && (
              <div className="print:hidden flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={handleToggleDeskripsi}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all cursor-pointer shadow-2xs ${
                    showMidDeskripsi
                      ? 'bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950/60 dark:text-amber-200 dark:border-amber-700'
                      : 'bg-blue-50 hover:bg-blue-100 text-blue-900 border-blue-300 dark:bg-blue-950/60 dark:text-blue-200 dark:border-blue-700'
                  }`}
                  title={
                    showMidDeskripsi
                      ? 'Klik untuk menyembunyikan kolom deskripsi capaian pembelajaran mendalam'
                      : 'Klik untuk memunculkan kembali kolom deskripsi capaian pembelajaran mendalam'
                  }
                >
                  {showMidDeskripsi ? (
                    <>
                      <EyeOff className="h-3.5 w-3.5 text-amber-700 dark:text-amber-400" />
                      <span>Deskripsi: Muncul</span>
                      <span className="text-[10px] font-normal opacity-75 hidden sm:inline">(Klik Sembunyikan)</span>
                    </>
                  ) : (
                    <>
                      <Eye className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                      <span>Deskripsi: Disembunyikan</span>
                      <span className="text-[10px] font-normal opacity-75 hidden sm:inline">(Klik Munculkan)</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
          <table className={`w-full border-collapse border border-slate-800 print:border-black ${tableTextSize}`}>
            <thead>
              <tr className="bg-slate-100 print:bg-gray-100 text-center font-bold">
                <th className={`border border-slate-800 print:border-black ${headerPadding} w-9 print:w-8 text-black`}>No</th>
                <th className={`border border-slate-800 print:border-black ${headerPadding} text-left ${(!isMidSemester || showMidDeskripsi) ? 'w-48 sm:w-52 print:w-44' : ''} text-black`}>Muatan Mata Pelajaran</th>
                <th className={`border border-slate-800 print:border-black ${headerPadding} ${(!isMidSemester || showMidDeskripsi) ? 'w-16' : 'w-32 sm:w-40 print:w-36'} text-black`}>
                  {isMidSemester ? 'Nilai ASTS' : 'Nilai Akhir'}
                </th>
                {(!isMidSemester || showMidDeskripsi) && (
                  <th className={`border border-slate-800 print:border-black ${headerPadding} text-left text-black`}>
                    {isMidSemester
                      ? 'Capaian Pembelajaran Mendalam Tengah Semester (Deskripsi Kemajuan Belajar)'
                      : 'Capaian Kompetensi & Pembelajaran Mendalam (Deskripsi Kemajuan Belajar)'}
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {isMidSemester
                ? midGrades.map((g, idx) => {
                    const rawName = g.subject?.nama || (g.subject as any)?.name || 'Mata Pelajaran';
                    const subjectName = isAgamaSubject(g.subject)
                      ? getReligionSubjectName(student.agama, rawName)
                      : rawName;
                    const scoreSTS = g.sumatifSts > 0 ? g.sumatifSts : (g.nilaiAkhirMid || '-');
                    return (
                      <tr key={g.subject?.id || idx} className="align-top print-avoid-break">
                        <td className={`border border-slate-800 print:border-black ${cellPadding} text-center font-semibold text-black`}>{idx + 1}</td>
                        <td className={`border border-slate-800 print:border-black ${cellPadding} font-bold text-black`}>
                          <div>{subjectName}</div>
                          {g.subject?.kelompok && g.subject.kelompok !== 'Umum' && (
                            <span className="inline-block text-[9px] font-normal text-slate-600 print:text-black">({g.subject.kelompok})</span>
                          )}
                        </td>
                        <td className={`border border-slate-800 print:border-black ${cellPadding} text-center font-extrabold text-black`}>
                          {scoreSTS}
                        </td>
                        {showMidDeskripsi && (
                          <td className={`border border-slate-800 print:border-black ${cellPadding} text-justify ${tableDescSize} text-black`}>
                            {g.deskripsiCapaian || `Peserta didik menunjukkan pemahaman konsep yang sangat mendalam dan bermakna dalam materi pembelajaran ${subjectName} hingga tengah semester.`}
                          </td>
                        )}
                      </tr>
                    );
                  })
                : fullGrades.map((g, idx) => {
                    const rawName = g.subject?.nama || (g.subject as any)?.name || 'Mata Pelajaran';
                    const subjectName = isAgamaSubject(g.subject)
                      ? getReligionSubjectName(student.agama, rawName)
                      : rawName;
                    return (
                      <tr key={g.subject?.id || idx} className="align-top print-avoid-break">
                        <td className={`border border-slate-800 print:border-black ${cellPadding} text-center font-semibold text-black`}>{idx + 1}</td>
                        <td className={`border border-slate-800 print:border-black ${cellPadding} font-bold text-black`}>
                          <div>{subjectName}</div>
                          {g.subject?.kelompok && g.subject.kelompok !== 'Umum' && (
                            <span className="inline-block text-[9px] font-normal text-slate-600 print:text-black">({g.subject.kelompok})</span>
                          )}
                        </td>
                        <td className={`border border-slate-800 print:border-black ${cellPadding} text-center font-extrabold text-black`}>{g.nilaiAkhir}</td>
                        <td className={`border border-slate-800 print:border-black ${cellPadding} text-justify ${tableDescSize} text-black`}>
                          {g.deskripsiCapaian || `Peserta didik menunjukkan penguasaan konsep yang mendalam, bermakna, dan mampu merefleksikan materi pembelajaran ${subjectName}.`}
                        </td>
                      </tr>
                    );
                  })}
              {/* Summary row */}
              {(!isMidSemester || showMidDeskripsi) ? (
                <tr className="bg-slate-50 print:bg-gray-100 font-bold print-avoid-break">
                  <td colSpan={2} className={`border border-slate-800 print:border-black ${cellPadding} text-right text-black`}>
                    Jumlah / Total Nilai & Rata-rata :
                  </td>
                  <td className={`border border-slate-800 print:border-black ${cellPadding} text-center font-black text-xs text-black`}>
                    {totalScore}
                  </td>
                  <td className={`border border-slate-800 print:border-black ${cellPadding} text-left text-xs font-bold text-black`}>
                    Rata-rata Nilai: {avgScore}
                  </td>
                </tr>
              ) : (
                <>
                  <tr className="bg-slate-50 print:bg-gray-100 font-bold print-avoid-break">
                    <td colSpan={2} className={`border border-slate-800 print:border-black ${cellPadding} text-right text-black`}>
                      Jumlah / Total Nilai ASTS :
                    </td>
                    <td className={`border border-slate-800 print:border-black ${cellPadding} text-center font-black text-xs text-black`}>
                      {totalScore}
                    </td>
                  </tr>
                  <tr className="bg-slate-50 print:bg-gray-100 font-bold print-avoid-break">
                    <td colSpan={2} className={`border border-slate-800 print:border-black ${cellPadding} text-right text-black`}>
                      Nilai Rata-rata ASTS :
                    </td>
                    <td className={`border border-slate-800 print:border-black ${cellPadding} text-center font-black text-xs text-black`}>
                      {avgScore}
                    </td>
                  </tr>
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* LEMBAR 2: EKSTRAKURIKULER, PRESENSI, CATATAN WALI KELAS, & TANDA TANGAN   */}
      {/* ========================================================================= */}
      <div className={`report-sheet-page-2 ${shouldBreakToPage2 ? 'print:break-before-page break-before-page pt-3 print:pt-0' : ''}`}>
        {/* Mini Header Halaman 2 (Hanya muncul saat cetak jika terpisah ke Halaman 2) */}
        {shouldBreakToPage2 && (
          <div className="hidden print:flex items-center justify-between border-b-2 border-black pb-1.5 mb-3 text-[10px] font-semibold text-black">
            <span>Nama Peserta Didik: <strong>{student.nama.toUpperCase()}</strong> ({student.nisn})</span>
            <span>Kelas: <strong>{schoolInfo.className}</strong> • Semester: <strong>{schoolInfo.semester}</strong></span>
            <span>Halaman 2</span>
          </div>
        )}

        {/* TABEL B: EKSTRAKURIKULER & TABEL C: PRESENSI */}
        {!isMidSemester ? (
          /* Tampilan Rapor Semester: Menampilkan Ekstrakurikuler dan Presensi berdampingan secara rapi */
          <div className={`grid grid-cols-1 md:grid-cols-2 print:grid-cols-2 gap-4 ${sectionSpacing} print-avoid-break`}>
            {/* Ekstrakurikuler */}
            <div>
              <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-900 print:text-black">
                B. Kegiatan Ekstrakurikuler
              </h3>
              <table className={`w-full border-collapse border border-slate-800 print:border-black ${tableTextSize}`}>
                <thead>
                  <tr className="bg-slate-100 print:bg-gray-100 text-center font-bold">
                    <th className={`border border-slate-800 print:border-black ${cellPadding} w-8 text-black`}>No</th>
                    <th className={`border border-slate-800 print:border-black ${cellPadding} text-left text-black`}>Nama Kegiatan</th>
                    <th className={`border border-slate-800 print:border-black ${cellPadding} text-black`}>Predikat / Keterangan</th>
                  </tr>
                </thead>
                <tbody>
                  {studentExcurs.length > 0 ? (
                    studentExcurs.map((ex, i) => (
                      <tr key={ex.id || i} className="print-avoid-break">
                        <td className={`border border-slate-800 print:border-black ${cellPadding} text-center text-black`}>{i + 1}</td>
                        <td className={`border border-slate-800 print:border-black ${cellPadding} font-semibold text-black`}>
                          {ex.namaKegiatan || ex.name || 'Ekstrakurikuler'}
                        </td>
                        <td className={`border border-slate-800 print:border-black ${cellPadding} text-center text-black`}>
                          {ex.predikat || 'Sangat Baik'}{ex.keterangan ? ` (${ex.keterangan})` : ''}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <>
                      <tr className="print-avoid-break">
                        <td className={`border border-slate-800 print:border-black ${cellPadding} text-center text-black`}>1</td>
                        <td className={`border border-slate-800 print:border-black ${cellPadding} font-semibold text-black`}>Pramuka Siaga / Penggalang</td>
                        <td className={`border border-slate-800 print:border-black ${cellPadding} text-center text-black`}>Sangat Baik (Aktif)</td>
                      </tr>
                      <tr className="print-avoid-break">
                        <td className={`border border-slate-800 print:border-black ${cellPadding} text-center text-black`}>2</td>
                        <td className={`border border-slate-800 print:border-black ${cellPadding} font-semibold text-black`}>Seni Tari & Musik Daerah</td>
                        <td className={`border border-slate-800 print:border-black ${cellPadding} text-center text-black`}>Baik</td>
                      </tr>
                    </>
                  )}
                </tbody>
              </table>
            </div>

            {/* Rekapitulasi Presensi */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 print:text-black">
                  C. Ketidakhadiran (Presensi)
                </h3>
                {/* Mode Status & Interactive Switcher (Screen-Only) */}
                <div className="print:hidden flex items-center gap-1.5">
                  {effectiveAttendance.isManual ? (
                    <>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
                        <Edit3 className="h-2.5 w-2.5" />
                        <span>Input Sendiri</span>
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          updateStudentReportAttendance(
                            student.id,
                            { isManual: false },
                            false
                          )
                        }
                        className="flex items-center gap-1 text-[10px] text-blue-700 hover:text-blue-900 font-semibold underline cursor-pointer"
                        title="Kembalikan ke hitungan presensi harian otomatis"
                      >
                        <RotateCcw className="h-2.5 w-2.5" />
                        <span>Reset Otomatis</span>
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() =>
                        updateStudentReportAttendance(
                          student.id,
                          {
                            isManual: true,
                            sakit: effectiveAttendance.autoSakit,
                            izin: effectiveAttendance.autoIzin,
                            alpa: effectiveAttendance.autoAlpa
                          },
                          false
                        )
                      }
                      className="flex items-center gap-1 px-2 py-0.5 rounded-md text-[10.5px] font-bold bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 transition-colors shadow-2xs cursor-pointer"
                      title="Klik untuk mengubah nilai absensi secara manual / input sendiri"
                    >
                      <Edit3 className="h-3 w-3" />
                      <span>Input Sendiri</span>
                    </button>
                  )}
                </div>
              </div>

              <table className={`w-full border-collapse border border-slate-800 print:border-black ${tableTextSize}`}>
                <thead>
                  <tr className="bg-slate-100 print:bg-gray-100 text-center font-bold">
                    <th className={`border border-slate-800 print:border-black ${cellPadding} w-8 text-black`}>No</th>
                    <th className={`border border-slate-800 print:border-black ${cellPadding} text-left text-black`}>Alasan Ketidakhadiran</th>
                    <th className={`border border-slate-800 print:border-black ${cellPadding} w-28 text-black`}>Jumlah Hari</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="print-avoid-break">
                    <td className={`border border-slate-800 print:border-black ${cellPadding} text-center text-black`}>1</td>
                    <td className={`border border-slate-800 print:border-black ${cellPadding} text-black`}>Sakit (S)</td>
                    <td className={`border border-slate-800 print:border-black ${cellPadding} text-center font-bold text-black`}>
                      <span className="hidden print:inline">{effectiveAttendance.sakit} hari</span>
                      <div className="print:hidden flex items-center justify-center gap-1">
                        {effectiveAttendance.isManual ? (
                          <>
                            <input
                              type="number"
                              min="0"
                              max="365"
                              value={effectiveAttendance.sakit}
                              onChange={e =>
                                updateStudentReportAttendance(
                                  student.id,
                                  {
                                    isManual: true,
                                    sakit: Math.max(0, parseInt(e.target.value) || 0),
                                    izin: effectiveAttendance.izin,
                                    alpa: effectiveAttendance.alpa
                                  },
                                  false,
                                  true
                                )
                              }
                              className="w-14 px-1 py-0.5 text-center font-bold border border-amber-400 bg-amber-50 rounded text-xs text-amber-950 outline-none focus:ring-1 focus:ring-amber-500 shadow-2xs"
                              title="Ketik jumlah hari sakit"
                            />
                            <span className="text-[11px] font-semibold text-slate-700">hari</span>
                          </>
                        ) : (
                          <span>{effectiveAttendance.sakit} hari</span>
                        )}
                      </div>
                    </td>
                  </tr>
                  <tr className="print-avoid-break">
                    <td className={`border border-slate-800 print:border-black ${cellPadding} text-center text-black`}>2</td>
                    <td className={`border border-slate-800 print:border-black ${cellPadding} text-black`}>Izin (I)</td>
                    <td className={`border border-slate-800 print:border-black ${cellPadding} text-center font-bold text-black`}>
                      <span className="hidden print:inline">{effectiveAttendance.izin} hari</span>
                      <div className="print:hidden flex items-center justify-center gap-1">
                        {effectiveAttendance.isManual ? (
                          <>
                            <input
                              type="number"
                              min="0"
                              max="365"
                              value={effectiveAttendance.izin}
                              onChange={e =>
                                updateStudentReportAttendance(
                                  student.id,
                                  {
                                    isManual: true,
                                    sakit: effectiveAttendance.sakit,
                                    izin: Math.max(0, parseInt(e.target.value) || 0),
                                    alpa: effectiveAttendance.alpa
                                  },
                                  false,
                                  true
                                )
                              }
                              className="w-14 px-1 py-0.5 text-center font-bold border border-amber-400 bg-amber-50 rounded text-xs text-amber-950 outline-none focus:ring-1 focus:ring-amber-500 shadow-2xs"
                              title="Ketik jumlah hari izin"
                            />
                            <span className="text-[11px] font-semibold text-slate-700">hari</span>
                          </>
                        ) : (
                          <span>{effectiveAttendance.izin} hari</span>
                        )}
                      </div>
                    </td>
                  </tr>
                  <tr className="print-avoid-break">
                    <td className={`border border-slate-800 print:border-black ${cellPadding} text-center text-black`}>3</td>
                    <td className={`border border-slate-800 print:border-black ${cellPadding} text-black`}>Tanpa Keterangan (A)</td>
                    <td className={`border border-slate-800 print:border-black ${cellPadding} text-center font-bold text-black`}>
                      <span className="hidden print:inline">{effectiveAttendance.alpa} hari</span>
                      <div className="print:hidden flex items-center justify-center gap-1">
                        {effectiveAttendance.isManual ? (
                          <>
                            <input
                              type="number"
                              min="0"
                              max="365"
                              value={effectiveAttendance.alpa}
                              onChange={e =>
                                updateStudentReportAttendance(
                                  student.id,
                                  {
                                    isManual: true,
                                    sakit: effectiveAttendance.sakit,
                                    izin: effectiveAttendance.izin,
                                    alpa: Math.max(0, parseInt(e.target.value) || 0)
                                  },
                                  false,
                                  true
                                )
                              }
                              className="w-14 px-1 py-0.5 text-center font-bold border border-amber-400 bg-amber-50 rounded text-xs text-amber-950 outline-none focus:ring-1 focus:ring-amber-500 shadow-2xs"
                              title="Ketik jumlah hari alpa / tanpa keterangan"
                            />
                            <span className="text-[11px] font-semibold text-slate-700">hari</span>
                          </>
                        ) : (
                          <span>{effectiveAttendance.alpa} hari</span>
                        )}
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>

              {effectiveAttendance.isManual && (
                <p className="print:hidden text-[10px] text-amber-700 font-medium mt-1 italic">
                  * Input absensi sendiri aktif untuk {student.nama}. Data disimpan otomatis dan dicetak rapi pada lembar rapor.
                </p>
              )}
            </div>
          </div>
        ) : (
          /* Tampilan Rapor Mid Semester: Ekstrakurikuler dihilangkan, hanya menampilkan Presensi */
          <div className={`${sectionSpacing} print-avoid-break`}>
            <div className="w-full max-w-md">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 print:text-black">
                  B. Ketidakhadiran (Presensi)
                </h3>
                {/* Mode Status & Interactive Switcher for Mid Semester (Screen-Only) */}
                <div className="print:hidden flex items-center gap-1.5">
                  {effectiveAttendance.isManual ? (
                    <>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
                        <Edit3 className="h-2.5 w-2.5" />
                        <span>Input Sendiri</span>
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          updateStudentReportAttendance(
                            student.id,
                            { isManual: false },
                            true
                          )
                        }
                        className="flex items-center gap-1 text-[10px] text-blue-700 hover:text-blue-900 font-semibold underline cursor-pointer"
                        title="Kembalikan ke hitungan presensi harian otomatis"
                      >
                        <RotateCcw className="h-2.5 w-2.5" />
                        <span>Reset Otomatis</span>
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() =>
                        updateStudentReportAttendance(
                          student.id,
                          {
                            isManual: true,
                            sakit: effectiveAttendance.autoSakit,
                            izin: effectiveAttendance.autoIzin,
                            alpa: effectiveAttendance.autoAlpa
                          },
                          true
                        )
                      }
                      className="flex items-center gap-1 px-2 py-0.5 rounded-md text-[10.5px] font-bold bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 transition-colors shadow-2xs cursor-pointer"
                      title="Klik untuk mengubah nilai absensi secara manual / input sendiri"
                    >
                      <Edit3 className="h-3 w-3" />
                      <span>Input Sendiri</span>
                    </button>
                  )}
                </div>
              </div>

              <table className={`w-full border-collapse border border-slate-800 print:border-black ${tableTextSize}`}>
                <thead>
                  <tr className="bg-slate-100 print:bg-gray-100 text-center font-bold">
                    <th className={`border border-slate-800 print:border-black ${cellPadding} w-8 text-black`}>No</th>
                    <th className={`border border-slate-800 print:border-black ${cellPadding} text-left text-black`}>Alasan Ketidakhadiran</th>
                    <th className={`border border-slate-800 print:border-black ${cellPadding} w-28 text-black`}>Jumlah Hari</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="print-avoid-break">
                    <td className={`border border-slate-800 print:border-black ${cellPadding} text-center text-black`}>1</td>
                    <td className={`border border-slate-800 print:border-black ${cellPadding} text-black`}>Sakit (S)</td>
                    <td className={`border border-slate-800 print:border-black ${cellPadding} text-center font-bold text-black`}>
                      <span className="hidden print:inline">{effectiveAttendance.sakit} hari</span>
                      <div className="print:hidden flex items-center justify-center gap-1">
                        {effectiveAttendance.isManual ? (
                          <>
                            <input
                              type="number"
                              min="0"
                              max="365"
                              value={effectiveAttendance.sakit}
                              onChange={e =>
                                updateStudentReportAttendance(
                                  student.id,
                                  {
                                    isManual: true,
                                    sakit: Math.max(0, parseInt(e.target.value) || 0),
                                    izin: effectiveAttendance.izin,
                                    alpa: effectiveAttendance.alpa
                                  },
                                  true,
                                  true
                                )
                              }
                              className="w-14 px-1 py-0.5 text-center font-bold border border-amber-400 bg-amber-50 rounded text-xs text-amber-950 outline-none focus:ring-1 focus:ring-amber-500 shadow-2xs"
                              title="Ketik jumlah hari sakit"
                            />
                            <span className="text-[11px] font-semibold text-slate-700">hari</span>
                          </>
                        ) : (
                          <span>{effectiveAttendance.sakit} hari</span>
                        )}
                      </div>
                    </td>
                  </tr>
                  <tr className="print-avoid-break">
                    <td className={`border border-slate-800 print:border-black ${cellPadding} text-center text-black`}>2</td>
                    <td className={`border border-slate-800 print:border-black ${cellPadding} text-black`}>Izin (I)</td>
                    <td className={`border border-slate-800 print:border-black ${cellPadding} text-center font-bold text-black`}>
                      <span className="hidden print:inline">{effectiveAttendance.izin} hari</span>
                      <div className="print:hidden flex items-center justify-center gap-1">
                        {effectiveAttendance.isManual ? (
                          <>
                            <input
                              type="number"
                              min="0"
                              max="365"
                              value={effectiveAttendance.izin}
                              onChange={e =>
                                updateStudentReportAttendance(
                                  student.id,
                                  {
                                    isManual: true,
                                    sakit: effectiveAttendance.sakit,
                                    izin: Math.max(0, parseInt(e.target.value) || 0),
                                    alpa: effectiveAttendance.alpa
                                  },
                                  true,
                                  true
                                )
                              }
                              className="w-14 px-1 py-0.5 text-center font-bold border border-amber-400 bg-amber-50 rounded text-xs text-amber-950 outline-none focus:ring-1 focus:ring-amber-500 shadow-2xs"
                              title="Ketik jumlah hari izin"
                            />
                            <span className="text-[11px] font-semibold text-slate-700">hari</span>
                          </>
                        ) : (
                          <span>{effectiveAttendance.izin} hari</span>
                        )}
                      </div>
                    </td>
                  </tr>
                  <tr className="print-avoid-break">
                    <td className={`border border-slate-800 print:border-black ${cellPadding} text-center text-black`}>3</td>
                    <td className={`border border-slate-800 print:border-black ${cellPadding} text-black`}>Tanpa Keterangan (A)</td>
                    <td className={`border border-slate-800 print:border-black ${cellPadding} text-center font-bold text-black`}>
                      <span className="hidden print:inline">{effectiveAttendance.alpa} hari</span>
                      <div className="print:hidden flex items-center justify-center gap-1">
                        {effectiveAttendance.isManual ? (
                          <>
                            <input
                              type="number"
                              min="0"
                              max="365"
                              value={effectiveAttendance.alpa}
                              onChange={e =>
                                updateStudentReportAttendance(
                                  student.id,
                                  {
                                    isManual: true,
                                    sakit: effectiveAttendance.sakit,
                                    izin: effectiveAttendance.izin,
                                    alpa: Math.max(0, parseInt(e.target.value) || 0)
                                  },
                                  true,
                                  true
                                )
                              }
                              className="w-14 px-1 py-0.5 text-center font-bold border border-amber-400 bg-amber-50 rounded text-xs text-amber-950 outline-none focus:ring-1 focus:ring-amber-500 shadow-2xs"
                              title="Ketik jumlah hari alpa / tanpa keterangan"
                            />
                            <span className="text-[11px] font-semibold text-slate-700">hari</span>
                          </>
                        ) : (
                          <span>{effectiveAttendance.alpa} hari</span>
                        )}
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>

              {effectiveAttendance.isManual && (
                <p className="print:hidden text-[10px] text-amber-700 font-medium mt-1 italic">
                  * Input absensi sendiri aktif untuk {student.nama}. Data disimpan otomatis dan dicetak rapi pada lembar rapor mid semester.
                </p>
              )}
            </div>
          </div>
        )}

        {/* TABEL D: DESKRIPSI KOKURIKULER (HANYA RAPOR SEMESTER 1 & 2, TIDAK MUNCUL DI RAPOR MID) */}
        {!isMidSemester && (
          <div className={`${sectionSpacing} print-avoid-break`}>
            <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-900 print:text-black flex items-center justify-between">
              <span>D. Deskripsi Kokurikuler</span>
              {kokurInfo.tema && (
                <span className="text-[10px] font-normal text-slate-600 print:text-black">
                  Tema: {kokurInfo.tema}
                </span>
              )}
            </h3>
            <table className={`w-full border-collapse border border-slate-800 print:border-black ${tableTextSize}`}>
              <thead>
                <tr className="bg-slate-100 print:bg-gray-100 text-left font-bold">
                  <th className={`border border-slate-800 print:border-black ${headerPadding} w-44 sm:w-56 print:w-44 text-black`}>
                    Projek / Kegiatan Kokurikuler
                  </th>
                  <th className={`border border-slate-800 print:border-black ${headerPadding} text-left text-black`}>
                    Deskripsi Capaian Pembelajaran Kokurikuler
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="align-top print-avoid-break">
                  <td className={`border border-slate-800 print:border-black ${cellPadding} font-bold text-black`}>
                    <div className="text-slate-900 print:text-black">{kokurInfo.projekJudul}</div>
                    {kokurInfo.tema && (
                      <span className="inline-block text-[9.5px] font-normal text-slate-600 print:text-black mt-0.5">
                        {kokurInfo.tema}
                      </span>
                    )}
                  </td>
                  <td className={`border border-slate-800 print:border-black ${cellPadding} text-justify ${tableDescSize} text-black leading-relaxed italic`}>
                    {kokurikulerDeskripsi}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* TABEL CATATAN WALI KELAS */}
        <div className={`${sectionSpacing} print-avoid-break`}>
          <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-900 print:text-black">
            {isMidSemester ? 'C.' : 'E.'} Catatan Wali Kelas & Karakter Pembelajaran Mendalam {isMidSemester && '(Tengah Semester)'}
          </h3>
          <div className={`rounded-xl print:rounded-none border border-slate-700 print:border-black ${density === 'compact' ? 'p-2.5 text-[11px]' : 'p-3.5 print:p-3 text-xs'} italic leading-relaxed text-black bg-slate-50/50 print:bg-white`}>
            {isMidSemester
              ? (reportData.catatanWaliKelasMid ||
                  reportData.catatanWaliKelas ||
                  `"Ananda ${student.nama} menunjukkan kesungguhan dan keaktifan belajar yang bermakna hingga tengah semester ini. Pertahankan ketekunan serta pemahaman mendalammu pada paruh semester berikutnya."`)
              : (reportData.catatanWaliKelas ||
                  `"Ananda ${student.nama} menunjukkan budi pekerti yang luhur, kedisiplinan tinggi, serta pemahaman materi yang mendalam dan bermakna. Kemampuan bernalar kritis dan refleksi belajarnya berkembang sangat pesat."`)}
          </div>
        </div>

        {/* TABEL F: TANGGAPAN ORANG TUA / WALI MURID (HANYA RAPOR SEMESTER 1 & 2, FORMAT KOSONG) */}
        {!isMidSemester && (
          <div className={`${sectionSpacing} print-avoid-break`}>
            <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-900 print:text-black">
              F. Tanggapan Orang Tua / Wali Murid
            </h3>
            <div className={`rounded-xl print:rounded-none border border-slate-700 print:border-black ${density === 'compact' ? 'p-2.5 text-[11px] min-h-[55px]' : 'p-3.5 print:p-3 text-xs min-h-[70px]'} text-black bg-slate-50/30 print:bg-white flex flex-col justify-between`}>
              {reportData.tanggapanOrangTua ? (
                <p className="italic text-black leading-relaxed">{reportData.tanggapanOrangTua}</p>
              ) : (
                <div className="py-1 flex flex-col justify-between h-12 sm:h-14 print:h-12">
                  <div className="border-b border-dotted border-slate-400 print:border-slate-500 w-full" />
                  <div className="border-b border-dotted border-slate-400 print:border-slate-500 w-full" />
                  <div className="border-b border-dotted border-slate-400 print:border-slate-500 w-full" />
                </div>
              )}
            </div>
          </div>
        )}

        {/* TABEL G: KEPUTUSAN KENAIKAN KELAS / KELULUSAN (HANYA MUNCUL DI RAPOR AKHIR SEMESTER 2 / GENAP) */}
        {!isMidSemester && isGenap && reportData.showKenaikan !== false && (
          <div className={`${sectionSpacing} print-avoid-break`}>
            <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-900 print:text-black">
              G. Keputusan Kenaikan Kelas / Akhir Tahun Ajaran
            </h3>
            <div className={`rounded-xl print:rounded-none border-2 border-slate-800 print:border-black ${density === 'compact' ? 'p-3 text-[11px]' : 'p-4 print:p-3 text-xs'} bg-slate-50/70 print:bg-white`}>
              <p className="font-semibold text-black mb-2">
                Berdasarkan pencapaian seluruh tujuan pembelajaran pada Tahun Pelajaran {schoolInfo.academicYear}:
              </p>

              <div className="p-2.5 my-2 text-center rounded-lg print:rounded-none border border-slate-800 print:border-black bg-white">
                {reportData.statusKenaikan === 'Naik Kelas' && (
                  <p className="text-sm font-black text-black tracking-wide">
                    NAIK KE KELAS : {reportData.targetKelas ? reportData.targetKelas.toUpperCase() : 'V (LIMA)'}
                  </p>
                )}
                {reportData.statusKenaikan === 'Tinggal Kelas' && (
                  <p className="text-sm font-black text-black tracking-wide">
                    TINGGAL DI KELAS : {schoolInfo.className.toUpperCase()}
                  </p>
                )}
                {reportData.statusKenaikan === 'Lulus' && (
                  <p className="text-sm font-black text-black tracking-wide">
                    LULUS DARI SATUAN PENDIDIKAN DASAR
                  </p>
                )}
                {reportData.statusKenaikan === 'Tidak Lulus' && (
                  <p className="text-sm font-black text-black tracking-wide">
                    TIDAK LULUS
                  </p>
                )}
                {(!reportData.statusKenaikan || reportData.statusKenaikan === 'Belum Ditentukan') && (
                  <p className="text-sm font-black text-black tracking-wide">
                    NAIK KE KELAS : {reportData.targetKelas ? reportData.targetKelas.toUpperCase() : 'V (LIMA)'}
                  </p>
                )}
              </div>

              {showRanking && (
                <div className="mt-2 text-center text-xs text-black font-semibold">
                  Peringkat Kelas Ke : <span className="font-black underline">{reportData.ranking ?? 1}</span> dari <span className="font-black">{students.length}</span> Peserta Didik
                </div>
              )}
            </div>
          </div>
        )}

        {/* TANDA TANGAN RESMI 3 PIHAK */}
        {showSignature && (
          <div className={`mt-6 print:mt-4 pt-2 ${tableTextSize} sign-block print-avoid-break`}>
            <div className="grid grid-cols-3 text-center gap-3 sm:gap-4 print:gap-4 text-black">
              <div>
                <p className="text-slate-700 print:text-black">Mengetahui,</p>
                <p className="font-bold text-black">Orang Tua / Wali Peserta Didik,</p>
                <div className="h-16 sm:h-20 print:h-16" />
                <p className="font-bold underline text-black">{parentSignatureName}</p>
                <p className="text-[10px] text-slate-700 print:text-black">{parentRoleSubtitle}</p>
              </div>

              <div>
                <p className="text-slate-700 print:text-black">Mengetahui,</p>
                <p className="font-bold text-black">Kepala Sekolah,</p>
                <div className="h-16 sm:h-20 print:h-16" />
                <p className="font-bold underline text-black">{schoolInfo.headmasterName}</p>
                <p className="text-[10px] text-slate-700 print:text-black">NIP. {schoolInfo.headmasterNip}</p>
              </div>

              <div>
                <p className="text-slate-700 print:text-black">
                  {isMidSemester
                    ? (schoolInfo.tanggalRaporMid || reportData.tempatTanggalRaporMid || defaultMidTanggal)
                    : (schoolInfo.tanggalRapor || reportData.tempatTanggalRapor || defaultSemesterTanggal)}
                </p>
                <p className="font-bold text-black">Wali Kelas,</p>
                <div className="h-16 sm:h-20 print:h-16" />
                <p className="font-bold underline text-black">{schoolInfo.homeroomTeacherName}</p>
                <p className="text-[10px] text-slate-700 print:text-black">NIP. {schoolInfo.homeroomTeacherNip}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
