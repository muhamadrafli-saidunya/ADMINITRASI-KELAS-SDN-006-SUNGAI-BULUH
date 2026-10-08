import React from 'react';
import { useApp } from '../../context/AppContext';
import { Student } from '../../types';
import { SchoolLogoRenderer } from '../common/SchoolLogoRenderer';
import {
  CoverBorderStyle,
  CoverBorderColor,
  CoverFrameDecorator,
  getBorderColorClasses
} from './CoverDecorations';

export type CoverPageSection = 'all' | 'cover' | 'school_identity' | 'biodata';
export type { CoverBorderStyle, CoverBorderColor };

export interface CoverPrintSettings {
  section: CoverPageSection;
  coverStyle: CoverBorderStyle;
  coverBorderColor?: CoverBorderColor;
  showPhoto: boolean;
  showSignature: boolean;
  paperSize: 'A4' | 'F4';
  admissionDate?: string;
  reportDate?: string;
}

interface StudentCoverAndBiodataSheetProps {
  student: Student;
  settings?: Partial<CoverPrintSettings>;
  className?: string;
  isPageBreakAfter?: boolean;
}

/**
 * Format date to standard Indonesian long format e.g. "14 Mei 2014"
 */
function formatIndonesianDate(dateStr: string): string {
  if (!dateStr) return '-';
  try {
    const months = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const year = parts[0];
      const monthIdx = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      if (monthIdx >= 0 && monthIdx < 12 && !isNaN(day)) {
        return `${day} ${months[monthIdx]} ${year}`;
      }
    }
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) {
      return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
    }
    return dateStr;
  } catch {
    return dateStr;
  }
}

export const StudentCoverAndBiodataSheet: React.FC<StudentCoverAndBiodataSheetProps> = ({
  student,
  settings,
  className = '',
  isPageBreakAfter = false
}) => {
  const { schoolInfo, getStudentReport } = useApp();
  const studentReport = getStudentReport ? getStudentReport(student.id) : undefined;

  const section: CoverPageSection = settings?.section || 'all';
  const coverStyle: CoverBorderStyle = settings?.coverStyle || 'batik_nusantara';
  const coverBorderColor: CoverBorderColor = settings?.coverBorderColor || 'monochrome';
  const showPhoto = settings?.showPhoto !== false;
  const showSignature = settings?.showSignature !== false;
  const isF4 = settings?.paperSize === 'F4';
  const paperSize = settings?.paperSize || 'A4';
  const admissionDate = settings?.admissionDate || `15 Juli ${parseInt(schoolInfo.academicYear.split('/')[0] || '2024', 10)}`;

  // Default tanggal rapor semester sesuai semester aktif
  const defaultSemesterTanggal = schoolInfo.semester?.includes('2')
    ? `${schoolInfo.city || 'Kota Jakarta Selatan'}, 20 Juni 2027`
    : `${schoolInfo.city || 'Kota Jakarta Selatan'}, 19 Desember 2026`;

  // Tanggal & tempat titimangsa pengesahan di atas kepala sekolah (disamakan dengan lembar rapor siswa)
  const reportReleaseDate = settings?.reportDate
    || schoolInfo.tanggalRapor
    || studentReport?.tempatTanggalRapor
    || defaultSemesterTanggal;

  const shouldRenderCover = section === 'all' || section === 'cover';
  const shouldRenderSchool = section === 'all' || section === 'school_identity';
  const shouldRenderBiodata = section === 'all' || section === 'biodata';

  const colorTheme = getBorderColorClasses(coverBorderColor);

  // Ukuran dan padding bingkai menyesuaikan ukuran kertas yang dipilih (A4 vs F4 Folio)
  const coverScreenHeightClass = isF4 ? 'min-h-[1180px]' : 'min-h-[1050px]';
  const coverPaddingClass = isF4 ? 'p-8 sm:p-14' : 'p-6 sm:p-10';
  const middleSpacingClass = isF4 ? 'my-8 sm:my-12' : 'my-6 sm:my-8';

  // Frame styling classes for Cover Depan
  const getCoverFrameClass = () => {
    switch (coverStyle) {
      case 'batik_nusantara':
        return `border-[5px] ${colorTheme.border} ${coverPaddingClass} relative shadow-xs`;
      case 'certificate_royal':
        return `border-[6px] border-double ${colorTheme.border} ${coverPaddingClass} relative shadow-xs`;
      case 'geometric_art':
        return `border-4 ${colorTheme.border} outline outline-2 outline-offset-2 ${colorTheme.border} ${coverPaddingClass} relative shadow-xs`;
      case 'vintage_ornate':
        return `border-[5px] ${colorTheme.border} ${coverPaddingClass} relative shadow-xs`;
      case 'minimal_clean':
        return `border-2 ${colorTheme.border} ${coverPaddingClass} relative shadow-xs`;
      case 'classic':
      default:
        return `border-4 ${colorTheme.border} outline outline-2 outline-offset-4 ${colorTheme.border} ${coverPaddingClass} relative shadow-xs`;
    }
  };

  return (
    <div className={`student-cover-biodata-container text-black print:text-black w-full ${className}`}>
      {/* Dynamic Print CSS for chosen paper size and frame fitting */}
      <style>{`
        @media print {
          @page {
            size: ${isF4 ? '215mm 330mm' : '210mm 297mm'} !important;
            margin: 8mm !important;
          }
          .cover-page {
            height: ${isF4 ? '314mm' : '281mm'} !important;
            min-height: ${isF4 ? '314mm' : '281mm'} !important;
            max-height: ${isF4 ? '314mm' : '281mm'} !important;
            width: 100% !important;
            padding: ${isF4 ? '18mm 14mm' : '14mm 12mm'} !important;
            box-sizing: border-box !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
            page-break-after: always !important;
            break-after: page !important;
          }
          .school-identity-page {
            min-height: ${isF4 ? '314mm' : '281mm'} !important;
            box-sizing: border-box !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
            page-break-after: always !important;
            break-after: page !important;
            padding: 12mm 14mm !important;
          }
          .student-biodata-page {
            min-height: ${isF4 ? '314mm' : '281mm'} !important;
            box-sizing: border-box !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
            padding: 12mm 14mm !important;
          }
        }
      `}</style>
      
      {/* ========================================================================= */}
      {/* HALAMAN 1: COVER DEPAN RAPOR (SAMPUL LUAR)                                */}
      {/* ========================================================================= */}
      {shouldRenderCover && (
        <div
          className={`cover-page bg-white ${coverScreenHeightClass} flex flex-col justify-between items-center text-center ${getCoverFrameClass()} ${
            (shouldRenderSchool || shouldRenderBiodata || isPageBreakAfter) ? 'print-page-break mb-12 print:mb-0' : ''
          }`}
        >
          {/* Ornamen Bingkai Vektor Eksklusif */}
          <CoverFrameDecorator style={coverStyle} colorTheme={coverBorderColor} />

          {/* Bagian Atas: Lambang & Judul */}
          <div className="w-full flex flex-col items-center pt-4 z-10">
            <div className="mb-4">
              <SchoolLogoRenderer
                preset={schoolInfo.logoLeftPreset || 'tutwuri'}
                customUrl={schoolInfo.logoLeft}
                width={90}
                alt="Logo Tut Wuri Handayani"
              />
            </div>

            <h1 className="text-xl sm:text-2xl font-black tracking-widest uppercase" style={{ color: colorTheme.stroke }}>
              LAPORAN HASIL BELAJAR
            </h1>
            <h2 className="text-lg sm:text-xl font-bold tracking-wider uppercase mt-1" style={{ color: colorTheme.stroke }}>
              SEKOLAH DASAR (SD)
            </h2>
            <div
              className="mt-3 inline-block px-4 py-1 border rounded-full text-xs font-bold tracking-wider uppercase"
              style={{ borderColor: colorTheme.stroke, color: colorTheme.stroke }}
            >
              {schoolInfo.kurikulum || 'Kurikulum Merdeka Pembelajaran Mendalam (KMPM)'}
            </div>
          </div>

          {/* Bagian Tengah: Box Nama Siswa & Identitas */}
          <div className={`w-full max-w-lg ${middleSpacingClass} z-10`}>
            <div className="text-xs sm:text-sm font-semibold tracking-wider uppercase text-slate-600 mb-2">
              Nama Peserta Didik:
            </div>
            <div
              className={`border-2 p-5 rounded-xl shadow-xs transition-all ${colorTheme.accentBg}`}
              style={{ borderColor: colorTheme.stroke }}
            >
              <p
                className="text-lg sm:text-2xl font-black tracking-wide uppercase"
                style={{ color: colorTheme.stroke }}
              >
                {student.nama}
              </p>
              <div
                className="mt-3 flex items-center justify-center gap-6 text-xs sm:text-sm font-bold border-t pt-2.5"
                style={{ borderColor: `${colorTheme.stroke}40`, color: colorTheme.stroke }}
              >
                <span>NIS: <strong className="font-mono">{student.nis || '-'}</strong></span>
                <span>•</span>
                <span>NISN: <strong className="font-mono">{student.nisn || '-'}</strong></span>
              </div>
            </div>

            <div className="mt-6 text-xs font-semibold uppercase tracking-wider text-slate-700">
              Kelas: <strong className="font-bold text-sm" style={{ color: colorTheme.stroke }}>{student.kelas || schoolInfo.className}</strong>
              {schoolInfo.phase ? ` (${schoolInfo.phase})` : ' (Fase B)'}
            </div>
          </div>

          {/* Bagian Bawah: Data Satuan Pendidikan & Kementerian */}
          <div
            className="w-full flex flex-col items-center pb-4 border-t pt-6 z-10"
            style={{ borderColor: `${colorTheme.stroke}30` }}
          >
            <h3
              className="text-base sm:text-lg font-black tracking-wider uppercase"
              style={{ color: colorTheme.stroke }}
            >
              {schoolInfo.schoolName}
            </h3>
            <p className="text-xs sm:text-sm font-bold text-slate-700 mt-1">
              NPSN: <span className="font-mono font-bold">{schoolInfo.npsn || '20100000'}</span>
            </p>
            <p className="text-[11px] sm:text-xs text-slate-600 max-w-md mt-1">
              {schoolInfo.address}{schoolInfo.village ? `, ${schoolInfo.village}` : ''}, {schoolInfo.subdistrict}, {schoolInfo.city}, {schoolInfo.province} {schoolInfo.postalCode ? `Kode Pos ${schoolInfo.postalCode}` : ''}
            </p>

            <div
              className="mt-6 pt-4 border-t w-3/4"
              style={{ borderColor: `${colorTheme.stroke}40` }}
            >
              <p
                className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest"
                style={{ color: colorTheme.stroke }}
              >
                KEMENTERIAN PENDIDIKAN DASAR DAN MENENGAH (KEMENDIKDASMEN)
              </p>
              <p
                className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest mt-0.5 opacity-90"
                style={{ color: colorTheme.stroke }}
              >
                REPUBLIK INDONESIA
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* HALAMAN 2: IDENTITAS SATUAN PENDIDIKAN (PROFIL SEKOLAH)                   */}
      {/* ========================================================================= */}
      {shouldRenderSchool && (
        <div
          className={`school-identity-page bg-white min-h-[960px] p-6 sm:p-10 ${
            (shouldRenderBiodata || isPageBreakAfter) ? 'print-page-break mb-12 print:mb-0' : ''
          }`}
        >
          {/* Header Identitas Sekolah */}
          <div className="text-center pb-3 mb-6">
            <h2 className="text-base sm:text-lg font-black tracking-wider text-slate-900 uppercase">
              RAPOR PESERTA DIDIK (KMPM)
            </h2>
            <h3 className="text-sm sm:text-base font-bold tracking-wide text-slate-800 uppercase mt-0.5">
              SEKOLAH DASAR (SD) • KURIKULUM MERDEKA PEMBELAJARAN MENDALAM
            </h3>
            <div className="mt-2 inline-block text-xs font-bold uppercase tracking-widest text-slate-800">
              IDENTITAS SATUAN PENDIDIKAN
            </div>
            <div className="w-full border-b border-slate-300 mt-3" />
          </div>

          {/* Tabel Detail Profil Sekolah - Cukup Garis Tipis Horizontal */}
          <div className="max-w-2xl mx-auto my-6">
            <table className="school-identity-table w-full text-xs sm:text-sm border-collapse border-none">
              <tbody>
                <tr className="border-b border-slate-200 print:border-slate-300">
                  <td className="py-2.5 w-8 font-semibold text-slate-800 align-top border-none">1.</td>
                  <td className="py-2.5 w-52 sm:w-60 font-semibold text-slate-800 align-top border-none">Nama Sekolah</td>
                  <td className="py-2.5 w-4 text-center font-semibold text-slate-800 align-top border-none">:</td>
                  <td className="py-2.5 font-bold text-slate-900 uppercase align-top border-none">{schoolInfo.schoolName}</td>
                </tr>
                <tr className="border-b border-slate-200 print:border-slate-300">
                  <td className="py-2.5 font-semibold text-slate-800 align-top border-none">2.</td>
                  <td className="py-2.5 font-semibold text-slate-800 align-top border-none">NPSN</td>
                  <td className="py-2.5 text-center font-semibold text-slate-800 align-top border-none">:</td>
                  <td className="py-2.5 font-mono font-bold text-slate-900 align-top border-none">{schoolInfo.npsn || '-'}</td>
                </tr>
                <tr className="border-b border-slate-200 print:border-slate-300">
                  <td className="py-2.5 font-semibold text-slate-800 align-top border-none">3.</td>
                  <td className="py-2.5 font-semibold text-slate-800 align-top border-none">Nomor Statistik Sekolah (NSS)</td>
                  <td className="py-2.5 text-center font-semibold text-slate-800 align-top border-none">:</td>
                  <td className="py-2.5 font-mono text-slate-900 align-top border-none">101016001001</td>
                </tr>
                <tr className="border-b border-slate-200 print:border-slate-300">
                  <td className="py-2.5 font-semibold text-slate-800 align-top border-none">4.</td>
                  <td className="py-2.5 font-semibold text-slate-800 align-top border-none">Alamat Sekolah</td>
                  <td className="py-2.5 text-center font-semibold text-slate-800 align-top border-none">:</td>
                  <td className="py-2.5 text-slate-900 align-top border-none">{schoolInfo.address}</td>
                </tr>
                <tr className="border-b border-slate-200 print:border-slate-300">
                  <td className="py-2.5 font-semibold text-slate-800 align-top border-none">5.</td>
                  <td className="py-2.5 font-semibold text-slate-800 align-top border-none">Kelurahan / Desa</td>
                  <td className="py-2.5 text-center font-semibold text-slate-800 align-top border-none">:</td>
                  <td className="py-2.5 text-slate-900 align-top border-none">{schoolInfo.village || schoolInfo.subdistrict || '-'}</td>
                </tr>
                <tr className="border-b border-slate-200 print:border-slate-300">
                  <td className="py-2.5 font-semibold text-slate-800 align-top border-none">6.</td>
                  <td className="py-2.5 font-semibold text-slate-800 align-top border-none">Kecamatan</td>
                  <td className="py-2.5 text-center font-semibold text-slate-800 align-top border-none">:</td>
                  <td className="py-2.5 text-slate-900 align-top border-none">{schoolInfo.subdistrict}</td>
                </tr>
                <tr className="border-b border-slate-200 print:border-slate-300">
                  <td className="py-2.5 font-semibold text-slate-800 align-top border-none">7.</td>
                  <td className="py-2.5 font-semibold text-slate-800 align-top border-none">Kabupaten / Kota</td>
                  <td className="py-2.5 text-center font-semibold text-slate-800 align-top border-none">:</td>
                  <td className="py-2.5 text-slate-900 align-top border-none">{schoolInfo.city}</td>
                </tr>
                <tr className="border-b border-slate-200 print:border-slate-300">
                  <td className="py-2.5 font-semibold text-slate-800 align-top border-none">8.</td>
                  <td className="py-2.5 font-semibold text-slate-800 align-top border-none">Provinsi</td>
                  <td className="py-2.5 text-center font-semibold text-slate-800 align-top border-none">:</td>
                  <td className="py-2.5 text-slate-900 align-top border-none">{schoolInfo.province}</td>
                </tr>
                <tr className="border-b border-slate-200 print:border-slate-300">
                  <td className="py-2.5 font-semibold text-slate-800 align-top border-none">9.</td>
                  <td className="py-2.5 font-semibold text-slate-800 align-top border-none">Kode Pos</td>
                  <td className="py-2.5 text-center font-semibold text-slate-800 align-top border-none">:</td>
                  <td className="py-2.5 font-mono text-slate-900 align-top border-none">{schoolInfo.postalCode || '-'}</td>
                </tr>
                <tr className="border-b border-slate-200 print:border-slate-300">
                  <td className="py-2.5 font-semibold text-slate-800 align-top border-none">10.</td>
                  <td className="py-2.5 font-semibold text-slate-800 align-top border-none">Nomor Telepon / Fax</td>
                  <td className="py-2.5 text-center font-semibold text-slate-800 align-top border-none">:</td>
                  <td className="py-2.5 font-mono text-slate-900 align-top border-none">{schoolInfo.phoneNumber || '-'}</td>
                </tr>
                <tr className="border-b border-slate-200 print:border-slate-300">
                  <td className="py-2.5 font-semibold text-slate-800 align-top border-none">11.</td>
                  <td className="py-2.5 font-semibold text-slate-800 align-top border-none">Pos-el (E-mail)</td>
                  <td className="py-2.5 text-center font-semibold text-slate-800 align-top border-none">:</td>
                  <td className="py-2.5 text-slate-900 align-top border-none">{schoolInfo.email || '-'}</td>
                </tr>
                <tr className="border-b border-slate-200 print:border-slate-300">
                  <td className="py-2.5 font-semibold text-slate-800 align-top border-none">12.</td>
                  <td className="py-2.5 font-semibold text-slate-800 align-top border-none">Laman (Website)</td>
                  <td className="py-2.5 text-center font-semibold text-slate-800 align-top border-none">:</td>
                  <td className="py-2.5 text-blue-700 underline align-top border-none">{schoolInfo.website || '-'}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-12 text-center text-xs text-slate-500">
            Dokumen resmi identitas satuan pendidikan Kurikulum Merdeka Pembelajaran Mendalam (KMPM)
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* HALAMAN 3: IDENTITAS PESERTA DIDIK (BIODATA SISWA LENGKAP)                */}
      {/* ========================================================================= */}
      {shouldRenderBiodata && (
        <div
          className={`student-biodata-page bg-white min-h-[960px] p-6 sm:p-10 ${
            isPageBreakAfter ? 'print-page-break' : ''
          }`}
        >
          {/* Header Lembar Biodata Siswa */}
          <div className="text-center pb-2 mb-6">
            <h2 className="text-base sm:text-lg font-black tracking-wider text-slate-900 uppercase">
              KETERANGAN TENTANG DIRI PESERTA DIDIK
            </h2>
            <h3 className="text-xs sm:text-sm font-bold tracking-wide text-slate-700 uppercase mt-0.5">
              (BIODATA LENGKAP PESERTA DIDIK)
            </h3>
          </div>

          {/* Tabel Isi Biodata Siswa - Bersih Tanpa Garis atau Kolom */}
          <div className="text-xs sm:text-[13px] leading-relaxed my-4">
            <table className="student-biodata-clean-table w-full border-collapse border-none border-0">
              <tbody>
                {/* 1. Nama Siswa */}
                <tr className="border-none border-0">
                  <td className="py-1 w-7 font-semibold text-slate-900 align-top border-none border-0">1.</td>
                  <td className="py-1 w-52 sm:w-60 font-semibold text-slate-900 align-top border-none border-0">Nama Peserta Didik (Lengkap)</td>
                  <td className="py-1 w-3 text-center font-semibold text-slate-900 align-top border-none border-0">:</td>
                  <td className="py-1 font-black text-slate-900 uppercase align-top border-none border-0">{student.nama}</td>
                </tr>

                {/* 2. Nomor Induk Siswa */}
                <tr className="border-none border-0">
                  <td className="py-1 font-semibold text-slate-900 align-top border-none border-0">2.</td>
                  <td className="py-1 font-semibold text-slate-900 align-top border-none border-0">Nomor Induk Siswa (NIS)</td>
                  <td className="py-1 text-center font-semibold text-slate-900 align-top border-none border-0">:</td>
                  <td className="py-1 font-mono font-bold text-slate-900 align-top border-none border-0">{student.nis || '-'}</td>
                </tr>

                {/* 3. NISN */}
                <tr className="border-none border-0">
                  <td className="py-1 font-semibold text-slate-900 align-top border-none border-0">3.</td>
                  <td className="py-1 font-semibold text-slate-900 align-top border-none border-0">Nomor Induk Siswa Nasional (NISN)</td>
                  <td className="py-1 text-center font-semibold text-slate-900 align-top border-none border-0">:</td>
                  <td className="py-1 font-mono font-bold text-slate-900 align-top border-none border-0">{student.nisn || '-'}</td>
                </tr>

                {/* 4. TTL */}
                <tr className="border-none border-0">
                  <td className="py-1 font-semibold text-slate-900 align-top border-none border-0">4.</td>
                  <td className="py-1 font-semibold text-slate-900 align-top border-none border-0">Tempat, Tanggal Lahir</td>
                  <td className="py-1 text-center font-semibold text-slate-900 align-top border-none border-0">:</td>
                  <td className="py-1 text-slate-900 align-top border-none border-0">
                    {student.tempatLahir ? `${student.tempatLahir}, ` : ''}{formatIndonesianDate(student.tanggalLahir)}
                  </td>
                </tr>

                {/* 5. Jenis Kelamin */}
                <tr className="border-none border-0">
                  <td className="py-1 font-semibold text-slate-900 align-top border-none border-0">5.</td>
                  <td className="py-1 font-semibold text-slate-900 align-top border-none border-0">Jenis Kelamin</td>
                  <td className="py-1 text-center font-semibold text-slate-900 align-top border-none border-0">:</td>
                  <td className="py-1 text-slate-900 align-top border-none border-0">
                    {student.jenisKelamin === 'L' ? 'Laki-laki' : 'Perempuan'}
                  </td>
                </tr>

                {/* 6. Agama */}
                <tr className="border-none border-0">
                  <td className="py-1 font-semibold text-slate-900 align-top border-none border-0">6.</td>
                  <td className="py-1 font-semibold text-slate-900 align-top border-none border-0">Agama dan Kepercayaan</td>
                  <td className="py-1 text-center font-semibold text-slate-900 align-top border-none border-0">:</td>
                  <td className="py-1 text-slate-900 align-top border-none border-0">{student.agama || 'Islam'}</td>
                </tr>

                {/* 7. Status dalam Keluarga */}
                <tr className="border-none border-0">
                  <td className="py-1 font-semibold text-slate-900 align-top border-none border-0">7.</td>
                  <td className="py-1 font-semibold text-slate-900 align-top border-none border-0">Status dalam Keluarga</td>
                  <td className="py-1 text-center font-semibold text-slate-900 align-top border-none border-0">:</td>
                  <td className="py-1 text-slate-900 align-top border-none border-0">{student.statusDalamKeluarga || 'Anak Kandung'}</td>
                </tr>

                {/* 8. Anak Ke- */}
                <tr className="border-none border-0">
                  <td className="py-1 font-semibold text-slate-900 align-top border-none border-0">8.</td>
                  <td className="py-1 font-semibold text-slate-900 align-top border-none border-0">Anak Ke-</td>
                  <td className="py-1 text-center font-semibold text-slate-900 align-top border-none border-0">:</td>
                  <td className="py-1 text-slate-900 align-top border-none border-0">{student.anakKe !== undefined && student.anakKe !== '' ? `${student.anakKe}` : '1 (Satu)'}</td>
                </tr>

                {/* 9. Alamat Siswa */}
                <tr className="border-none border-0">
                  <td className="py-1 font-semibold text-slate-900 align-top border-none border-0">9.</td>
                  <td className="py-1 font-semibold text-slate-900 align-top border-none border-0">Alamat Peserta Didik</td>
                  <td className="py-1 text-center font-semibold text-slate-900 align-top border-none border-0">:</td>
                  <td className="py-1 text-slate-900 align-top border-none border-0">{student.alamat || '-'}</td>
                </tr>

                {/* 10. Nomor Telepon */}
                <tr className="border-none border-0">
                  <td className="py-1 font-semibold text-slate-900 align-top border-none border-0">10.</td>
                  <td className="py-1 font-semibold text-slate-900 align-top border-none border-0">Nomor Telepon Rumah / HP</td>
                  <td className="py-1 text-center font-semibold text-slate-900 align-top border-none border-0">:</td>
                  <td className="py-1 font-mono text-slate-900 align-top border-none border-0">{student.noHpOrtu || '-'}</td>
                </tr>

                {/* 11. Sekolah Asal */}
                <tr className="border-none border-0">
                  <td className="py-1 font-semibold text-slate-900 align-top border-none border-0">11.</td>
                  <td className="py-1 font-semibold text-slate-900 align-top border-none border-0">Sekolah Asal (TK / PAUD)</td>
                  <td className="py-1 text-center font-semibold text-slate-900 align-top border-none border-0">:</td>
                  <td className="py-1 text-slate-900 align-top border-none border-0">{student.sekolahAsal || '-'}</td>
                </tr>

                {/* 12. Diterima di Sekolah ini */}
                <tr className="border-none border-0">
                  <td className="py-1 font-semibold text-slate-900 align-top border-none border-0">12.</td>
                  <td className="py-1 font-semibold text-slate-900 align-top border-none border-0" colSpan={3}>
                    Diterima di sekolah ini:
                  </td>
                </tr>
                <tr className="border-none border-0">
                  <td className="py-0.5 border-none border-0"></td>
                  <td className="py-0.5 pl-4 text-slate-800 border-none border-0">a. Di kelas</td>
                  <td className="py-0.5 text-center font-semibold text-slate-800 border-none border-0">:</td>
                  <td className="py-0.5 text-slate-900 font-semibold border-none border-0">{student.diterimaDiKelas || student.kelas || schoolInfo.className}</td>
                </tr>
                <tr className="border-none border-0">
                  <td className="py-0.5 border-none border-0"></td>
                  <td className="py-0.5 pl-4 text-slate-800 border-none border-0">b. Pada tanggal</td>
                  <td className="py-0.5 text-center font-semibold text-slate-800 border-none border-0">:</td>
                  <td className="py-0.5 text-slate-900 font-semibold border-none border-0">{student.diterimaTanggal ? formatIndonesianDate(student.diterimaTanggal) : admissionDate}</td>
                </tr>

                {/* 13. Data Orang Tua */}
                <tr className="border-none border-0">
                  <td className="py-1 font-semibold text-slate-900 align-top border-none border-0">13.</td>
                  <td className="py-1 font-semibold text-slate-900 align-top border-none border-0" colSpan={3}>
                    Data Orang Tua:
                  </td>
                </tr>
                <tr className="border-none border-0">
                  <td className="py-0.5 border-none border-0"></td>
                  <td className="py-0.5 pl-4 text-slate-800 border-none border-0">a. Nama Ayah Kandung</td>
                  <td className="py-0.5 text-center font-semibold text-slate-800 border-none border-0">:</td>
                  <td className="py-0.5 font-bold text-slate-900 uppercase border-none border-0">{student.namaAyah || '-'}</td>
                </tr>
                <tr className="border-none border-0">
                  <td className="py-0.5 border-none border-0"></td>
                  <td className="py-0.5 pl-4 text-slate-800 border-none border-0">b. Nama Ibu Kandung</td>
                  <td className="py-0.5 text-center font-semibold text-slate-800 border-none border-0">:</td>
                  <td className="py-0.5 font-bold text-slate-900 uppercase border-none border-0">{student.namaIbu || '-'}</td>
                </tr>
                <tr className="border-none border-0">
                  <td className="py-0.5 border-none border-0"></td>
                  <td className="py-0.5 pl-4 text-slate-800 border-none border-0">c. Pekerjaan Orang Tua</td>
                  <td className="py-0.5 text-center font-semibold text-slate-800 border-none border-0">:</td>
                  <td className="py-0.5 text-slate-900 border-none border-0">{student.pekerjaanOrtu || 'Karyawan Swasta / Wiraswasta'}</td>
                </tr>
                <tr className="border-none border-0">
                  <td className="py-0.5 border-none border-0"></td>
                  <td className="py-0.5 pl-4 text-slate-800 border-none border-0">d. Alamat Orang Tua</td>
                  <td className="py-0.5 text-center font-semibold text-slate-800 border-none border-0">:</td>
                  <td className="py-0.5 text-slate-900 border-none border-0">{student.alamat || '-'}</td>
                </tr>
                <tr className="border-none border-0">
                  <td className="py-0.5 border-none border-0"></td>
                  <td className="py-0.5 pl-4 text-slate-800 border-none border-0">e. No. HP / WhatsApp Orang Tua</td>
                  <td className="py-0.5 text-center font-semibold text-slate-800 border-none border-0">:</td>
                  <td className="py-0.5 font-mono text-slate-900 border-none border-0">{student.noHpOrtu || '-'}</td>
                </tr>

                {/* 14. Data Wali */}
                <tr className="border-none border-0">
                  <td className="py-1 font-semibold text-slate-900 align-top border-none border-0">14.</td>
                  <td className="py-1 font-semibold text-slate-900 align-top border-none border-0" colSpan={3}>
                    Data Wali Peserta Didik (Bila Ada):
                  </td>
                </tr>
                <tr className="border-none border-0">
                  <td className="py-0.5 border-none border-0"></td>
                  <td className="py-0.5 pl-4 text-slate-800 border-none border-0">a. Nama Wali</td>
                  <td className="py-0.5 text-center font-semibold text-slate-800 border-none border-0">:</td>
                  <td className="py-0.5 text-slate-900 border-none border-0">-</td>
                </tr>
                <tr className="border-none border-0">
                  <td className="py-0.5 border-none border-0"></td>
                  <td className="py-0.5 pl-4 text-slate-800 border-none border-0">b. Pekerjaan Wali</td>
                  <td className="py-0.5 text-center font-semibold text-slate-800 border-none border-0">:</td>
                  <td className="py-0.5 text-slate-900 border-none border-0">-</td>
                </tr>
                <tr className="border-none border-0">
                  <td className="py-0.5 border-none border-0"></td>
                  <td className="py-0.5 pl-4 text-slate-800 border-none border-0">c. Alamat Wali</td>
                  <td className="py-0.5 text-center font-semibold text-slate-800 border-none border-0">:</td>
                  <td className="py-0.5 text-slate-900 border-none border-0">-</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Bagian Bawah: Pas Foto 3x4 & Tanda Tangan Kepala Sekolah (Tanpa Garis Pembatas) */}
          {showSignature && (
            <div className="mt-8 pt-4 flex items-end justify-between">
              {/* Kotak Pas Foto 3 x 4 cm */}
              <div className="flex flex-col items-center">
                {showPhoto ? (
                  <div className="w-[110px] h-[145px] border-2 border-dashed border-slate-700 flex flex-col items-center justify-center p-1 bg-slate-50 relative overflow-hidden rounded">
                    {student.fotoUrl && !student.fotoUrl.includes('placeholder') ? (
                      <img
                        src={student.fotoUrl}
                        alt={student.nama}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="text-center p-2">
                        <span className="text-[10px] font-bold text-slate-500 uppercase block">PAS FOTO</span>
                        <span className="text-xs font-black text-slate-700 block">3 x 4 cm</span>
                        <span className="text-[9px] text-slate-400 mt-1 block">Cap Tindih</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="w-[110px] h-[145px] border-2 border-dashed border-slate-400 flex items-center justify-center text-center p-2 text-slate-400 text-[10px] font-bold">
                    PAS FOTO<br/>3 x 4 cm
                  </div>
                )}
              </div>

              {/* Titimangsa & Tanda Tangan Kepala Sekolah (Sesuai Titimangsa Rapor) */}
              <div className="text-center text-xs sm:text-sm min-w-[240px]">
                <p className="text-slate-800 font-semibold">{reportReleaseDate}</p>
                <p className="font-bold text-slate-900 mt-1">Kepala Sekolah,</p>
                
                {/* Ruang Tanda Tangan & Stempel */}
                <div className="h-20" />

                <p className="font-black text-slate-900 uppercase underline tracking-wide">
                  {schoolInfo.headmasterName}
                </p>
                <p className="text-xs font-bold text-slate-800 mt-0.5">
                  NIP. <span className="font-mono">{schoolInfo.headmasterNip || '-'}</span>
                </p>
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
};
