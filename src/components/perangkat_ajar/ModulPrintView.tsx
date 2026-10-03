import React from 'react';
import { ModulAjar, SchoolInfo } from '../../types';
import {
  BookOpen,
  Calendar,
  Clock,
  User,
  GraduationCap,
  Target,
  Sparkles,
  Layers,
  HelpCircle,
  ClipboardList,
  CheckCircle2,
  FileText,
  Printer
} from 'lucide-react';

interface ModulPrintViewProps {
  modul: ModulAjar;
  schoolInfo: SchoolInfo;
  onPrint?: () => void;
  printMode?: 'full' | 'lkpd_only';
}

export const ModulPrintView: React.FC<ModulPrintViewProps> = ({
  modul,
  schoolInfo,
  onPrint,
  printMode = 'full'
}) => {
  // Preset Logos Resolver
  const getPresetLogoUrl = (presetKey?: string) => {
    switch (presetKey) {
      case 'tutwuri':
      case 'kemdikbud':
        return 'https://upload.wikimedia.org/wikipedia/commons/9/9c/Logo_of_Ministry_of_Education_and_Culture_of_Indonesia.svg';
      case 'kemenag':
        return 'https://upload.wikimedia.org/wikipedia/commons/f/fe/Kementerian_Agama_Indonesia_logo.png';
      case 'garuda':
        return 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Coat_of_arms_of_Indonesia.svg/800px-Coat_of_arms_of_Indonesia.svg.png';
      case 'merdeka':
        return 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Logo_of_Ministry_of_Education_and_Culture_of_Indonesia.svg/800px-Logo_of_Ministry_of_Education_and_Culture_of_Indonesia.svg.png';
      default:
        return 'https://upload.wikimedia.org/wikipedia/commons/9/9c/Logo_of_Ministry_of_Education_and_Culture_of_Indonesia.svg';
    }
  };

  const leftLogoSrc = modul ? (schoolInfo.logoLeft || (schoolInfo.logoLeftPreset ? getPresetLogoUrl(schoolInfo.logoLeftPreset) : getPresetLogoUrl('tutwuri'))) : '';
  const rightLogoSrc = modul ? (schoolInfo.logoRight || (schoolInfo.logoRightPreset ? getPresetLogoUrl(schoolInfo.logoRightPreset) : '')) : '';

  const getBorderClass = () => {
    switch (schoolInfo.kopBorderStyle) {
      case 'solid':
        return 'border-b-2 border-slate-900';
      case 'dashed':
        return 'border-b-2 border-dashed border-slate-900';
      case 'none':
        return '';
      case 'double':
      default:
        return 'border-b-4 border-double border-slate-900';
    }
  };

  if (printMode === 'lkpd_only') {
    return (
      <div
        id="printable-official-document"
        className="printable-document-sheet bg-white text-slate-900 p-6 sm:p-10 font-sans print:p-0 print:border-none print:shadow-none print:bg-white text-sm leading-relaxed print:m-0 print:w-full"
      >
        {/* Kop Surat Sekolah */}
        <div className={`pb-4 mb-6 ${getBorderClass()} flex items-center justify-between gap-4`}>
          {schoolInfo.showLogoLeft !== false && leftLogoSrc && (
            <img
              src={leftLogoSrc}
              alt="Logo Kiri"
              className="h-16 w-16 sm:h-20 sm:w-20 object-contain shrink-0"
              referrerPolicy="no-referrer"
            />
          )}
          <div className="flex-1 text-center">
            {schoolInfo.kopLine1 && (
              <p className="text-xs uppercase tracking-wider font-semibold text-slate-700">
                {schoolInfo.kopLine1}
              </p>
            )}
            {schoolInfo.kopLine2 && (
              <p className="text-xs uppercase tracking-wider font-semibold text-slate-700">
                {schoolInfo.kopLine2}
              </p>
            )}
            <h1 className="text-base sm:text-lg font-black uppercase text-slate-950 tracking-wide mt-0.5">
              {schoolInfo.schoolName}
            </h1>
            <p className="text-[11px] text-slate-600">
              {schoolInfo.address}, {schoolInfo.subdistrict}, {schoolInfo.city}, {schoolInfo.province} {schoolInfo.postalCode}
            </p>
            <p className="text-[10px] text-slate-500">
              Telp: {schoolInfo.phoneNumber} | Email: {schoolInfo.email} | NPSN: {schoolInfo.npsn}
            </p>
          </div>
          {schoolInfo.showLogoRight !== false && rightLogoSrc && (
            <img
              src={rightLogoSrc}
              alt="Logo Kanan"
              className="h-16 w-16 sm:h-20 sm:w-20 object-contain shrink-0"
              referrerPolicy="no-referrer"
            />
          )}
        </div>

        {/* LKPD Header */}
        <div className="border-2 border-indigo-900 rounded-xl p-4 mb-6 bg-indigo-50/40 text-center">
          <span className="inline-block px-3 py-1 rounded-full bg-indigo-600 text-white font-bold text-xs uppercase tracking-wider mb-1">
            Lembar Kerja Peserta Didik (LKPD)
          </span>
          <h2 className="text-lg sm:text-xl font-black text-indigo-950">
            {modul.lampiran?.lkpdJudul || modul.judul}
          </h2>
          <p className="text-xs text-indigo-800 mt-1">
            Mata Pelajaran: <strong>{modul.mataPelajaran}</strong> • {modul.fase} (Kelas {modul.kelas}) • Semester {modul.semester}
          </p>
        </div>

        {/* Identitas Siswa Box */}
        <div className="grid grid-cols-2 gap-4 border border-slate-300 rounded-lg p-3.5 mb-6 text-xs bg-slate-50">
          <div>
            <p className="flex py-1 border-b border-dashed border-slate-200">
              <span className="w-28 font-semibold text-slate-700">Nama Kelompok:</span>
              <span className="flex-1 font-mono">....................................................</span>
            </p>
            <p className="flex py-1">
              <span className="w-28 font-semibold text-slate-700">Anggota Regu:</span>
              <span className="flex-1 font-mono">1. .................................................</span>
            </p>
            <p className="flex py-1 pl-28">
              <span className="flex-1 font-mono">2. .................................................</span>
            </p>
          </div>
          <div>
            <p className="flex py-1 border-b border-dashed border-slate-200">
              <span className="w-20 font-semibold text-slate-700">Kelas / No:</span>
              <span className="flex-1 font-mono">{modul.kelas} / ....................................</span>
            </p>
            <p className="flex py-1">
              <span className="w-20 font-semibold text-slate-700">Hari/Tgl:</span>
              <span className="flex-1 font-mono">....................................................</span>
            </p>
            <p className="flex py-1 pl-28">
              <span className="flex-1 font-mono">3. .................................................</span>
            </p>
          </div>
        </div>

        {/* Petunjuk Belajar */}
        <div className="mb-6">
          <h3 className="font-bold text-slate-900 text-sm mb-2 flex items-center gap-1.5">
            <ClipboardList className="h-4 w-4 text-indigo-600" />
            A. Petunjuk Pengerjaan
          </h3>
          <ol className="list-decimal list-inside space-y-1 text-xs text-slate-700 pl-2 bg-slate-50 p-3 rounded-lg border border-slate-200">
            {modul.lampiran?.lkpdPetunjuk?.map((p, idx) => (
              <li key={idx} className="leading-normal">{p}</li>
            )) || (
              <>
                <li>Berdoalah sebelum memulai kegiatan belajar dan diskusi.</li>
                <li>Bacalah setiap instruksi dan teks pengantar dengan seksama.</li>
                <li>Diskusikan bersama teman sekelompokmu secara aktif dan kompak.</li>
              </>
            )}
          </ol>
        </div>

        {/* Soal & Tugas Penyelidikan */}
        <div className="mb-6">
          <h3 className="font-bold text-slate-900 text-sm mb-3 flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            B. Lembar Aktivitas & Soal Pemahaman
          </h3>
          <div className="space-y-4">
            {modul.lampiran?.lkpdTugas?.map((tugas, idx) => (
              <div key={idx} className="border border-slate-300 rounded-lg p-4 bg-white">
                <p className="font-semibold text-slate-900 text-xs mb-2">
                  {idx + 1}. {tugas.soal}
                </p>
                <div className="mt-3 min-h-[90px] border border-dashed border-slate-300 rounded-md p-2 bg-slate-50/50 flex flex-col justify-between">
                  <span className="text-[10px] text-slate-400 font-mono italic">
                    [Tuliskan jawaban / hasil analisis kelompokmu di sini]:
                  </span>
                  <div className="space-y-3 pt-4">
                    <div className="border-b border-dashed border-slate-200" />
                    <div className="border-b border-dashed border-slate-200" />
                    <div className="border-b border-dashed border-slate-200" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Refleksi & Penilaian Mandiri */}
        <div className="mt-8 border-t border-slate-300 pt-4 grid grid-cols-2 gap-6 text-xs">
          <div className="border border-slate-200 p-3 rounded-lg text-center">
            <p className="font-semibold text-slate-800 mb-1">Nilai & Paraf Guru Pengampu</p>
            <div className="h-16 flex items-center justify-center font-bold text-slate-400">
              [ ................................ ]
            </div>
            <p className="text-[11px] font-medium text-slate-700">{modul.penyusun}</p>
          </div>
          <div className="border border-slate-200 p-3 rounded-lg text-center">
            <p className="font-semibold text-slate-800 mb-1">Tanda Tangan Ketua Kelompok</p>
            <div className="h-16 flex items-center justify-center font-bold text-slate-400">
              ( ................................ )
            </div>
            <p className="text-[11px] text-slate-500">Ketua Regu</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      id="printable-official-document"
      className="printable-document-sheet bg-white text-slate-900 p-6 sm:p-12 font-sans print:p-0 print:border-none print:shadow-none print:bg-white text-sm leading-relaxed max-w-4xl mx-auto shadow-md rounded-2xl border border-slate-200 print:m-0 print:w-full"
    >
      {/* 1. KOP SURAT RESMI */}
      <div className={`pb-4 mb-6 ${getBorderClass()} flex items-center justify-between gap-4`}>
        {schoolInfo.showLogoLeft !== false && leftLogoSrc && (
          <img
            src={leftLogoSrc}
            alt="Logo Kiri"
            className="h-16 w-16 sm:h-20 sm:w-20 object-contain shrink-0"
            referrerPolicy="no-referrer"
          />
        )}
        <div className="flex-1 text-center">
          {schoolInfo.kopLine1 && (
            <p className="text-xs uppercase tracking-wider font-semibold text-slate-700">
              {schoolInfo.kopLine1}
            </p>
          )}
          {schoolInfo.kopLine2 && (
            <p className="text-xs uppercase tracking-wider font-semibold text-slate-700">
              {schoolInfo.kopLine2}
            </p>
          )}
          <h1 className="text-base sm:text-xl font-black uppercase text-slate-950 tracking-wide mt-0.5">
            {schoolInfo.schoolName}
          </h1>
          <p className="text-[11px] text-slate-600">
            {schoolInfo.address}, {schoolInfo.subdistrict}, {schoolInfo.city}, {schoolInfo.province} {schoolInfo.postalCode}
          </p>
          <p className="text-[10px] text-slate-500">
            Telp: {schoolInfo.phoneNumber} | Email: {schoolInfo.email} | NPSN: {schoolInfo.npsn}
          </p>
        </div>
        {schoolInfo.showLogoRight !== false && rightLogoSrc && (
          <img
            src={rightLogoSrc}
            alt="Logo Kanan"
            className="h-16 w-16 sm:h-20 sm:w-20 object-contain shrink-0"
            referrerPolicy="no-referrer"
          />
        )}
      </div>

      {/* JUDUL DOKUMEN MODUL */}
      <div className="text-center mb-8">
        <h2 className="text-lg sm:text-2xl font-black uppercase tracking-wide text-slate-900">
          MODUL AJAR KURIKULUM MERDEKA
        </h2>
        <p className="text-xs sm:text-sm font-bold text-indigo-700 uppercase tracking-wider mt-1">
          {modul.mataPelajaran} • {modul.fase} (KELAS {modul.kelas})
        </p>
        <div className="inline-block mt-2 px-3 py-0.5 rounded-full bg-slate-100 border border-slate-300 text-[11px] font-semibold text-slate-700">
          Kode Modul: {modul.kodeModul} • Tahun Pelajaran {modul.tahunPenyusunan || schoolInfo.academicYear}
        </div>
      </div>

      {/* BAGIAN A: INFORMASI UMUM */}
      <div className="mb-6">
        <h3 className="text-sm font-black uppercase bg-slate-800 text-white px-3 py-1.5 rounded-md mb-3">
          A. INFORMASI UMUM
        </h3>
        <table className="w-full text-xs border border-slate-300 rounded-md overflow-hidden mb-4">
          <tbody>
            <tr className="border-b border-slate-200">
              <td className="w-1/3 py-2 px-3 bg-slate-50 font-semibold text-slate-700">1. Nama Penyusun / Guru</td>
              <td className="py-2 px-3 font-medium text-slate-900">{modul.penyusun} {modul.nipPenyusun ? `(NIP. ${modul.nipPenyusun})` : ''}</td>
            </tr>
            <tr className="border-b border-slate-200">
              <td className="py-2 px-3 bg-slate-50 font-semibold text-slate-700">2. Satuan Pendidikan (Instansi)</td>
              <td className="py-2 px-3 font-medium text-slate-900">{modul.instansi || schoolInfo.schoolName}</td>
            </tr>
            <tr className="border-b border-slate-200">
              <td className="py-2 px-3 bg-slate-50 font-semibold text-slate-700">3. Jenjang / Fase / Kelas</td>
              <td className="py-2 px-3 font-medium text-slate-900">Sekolah Dasar (SD) / {modul.fase} / Kelas {modul.kelas}</td>
            </tr>
            <tr className="border-b border-slate-200">
              <td className="py-2 px-3 bg-slate-50 font-semibold text-slate-700">4. Mata Pelajaran</td>
              <td className="py-2 px-3 font-medium text-slate-900">{modul.mataPelajaran}</td>
            </tr>
            <tr className="border-b border-slate-200">
              <td className="py-2 px-3 bg-slate-50 font-semibold text-slate-700">5. Alokasi Waktu / Semester</td>
              <td className="py-2 px-3 font-medium text-slate-900">{modul.alokasiWaktu} / Semester {modul.semester}</td>
            </tr>
            <tr className="border-b border-slate-200">
              <td className="py-2 px-3 bg-slate-50 font-semibold text-slate-700">6. Elemen Capaian Pembelajaran</td>
              <td className="py-2 px-3 font-medium text-slate-900">{modul.elemenCP}</td>
            </tr>
            <tr className="border-b border-slate-200">
              <td className="py-2 px-3 bg-slate-50 font-semibold text-slate-700">7. Profil Pelajar Pancasila</td>
              <td className="py-2 px-3 font-medium text-slate-900">
                <ul className="list-disc list-inside space-y-0.5">
                  {modul.profilPelajarPancasila?.map((p, i) => (
                    <li key={i}>{p}</li>
                  ))}
                </ul>
              </td>
            </tr>
            <tr className="border-b border-slate-200">
              <td className="py-2 px-3 bg-slate-50 font-semibold text-slate-700">8. Sarana dan Prasarana</td>
              <td className="py-2 px-3 text-slate-800 space-y-1">
                <p><strong>Media:</strong> {modul.saranaPrasarana?.media}</p>
                <p><strong>Alat & Bahan:</strong> {modul.saranaPrasarana?.alatDanBahan}</p>
                <p><strong>Sumber Belajar:</strong> {modul.saranaPrasarana?.sumberBelajar}</p>
              </td>
            </tr>
            <tr className="border-b border-slate-200">
              <td className="py-2 px-3 bg-slate-50 font-semibold text-slate-700">9. Target Peserta Didik</td>
              <td className="py-2 px-3 font-medium text-slate-900">{modul.targetPesertaDidik}</td>
            </tr>
            <tr>
              <td className="py-2 px-3 bg-slate-50 font-semibold text-slate-700">10. Model & Metode Pembelajaran</td>
              <td className="py-2 px-3 font-medium text-slate-900">
                <p><strong>Model:</strong> {modul.modelPembelajaran}</p>
                <p className="mt-0.5"><strong>Metode:</strong> {modul.metodePembelajaran?.join(', ')}</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* BAGIAN B: KOMPONEN INTI */}
      <div className="mb-6">
        <h3 className="text-sm font-black uppercase bg-slate-800 text-white px-3 py-1.5 rounded-md mb-3">
          B. KOMPONEN INTI
        </h3>

        {/* 1. Capaian & Tujuan */}
        <div className="mb-4 space-y-2 text-xs">
          <div className="border border-slate-200 rounded-lg p-3 bg-slate-50">
            <h4 className="font-bold text-slate-900 mb-1">1. Capaian Pembelajaran (CP)</h4>
            <p className="text-slate-800 leading-relaxed italic">"{modul.capaianPembelajaran}"</p>
          </div>

          <div className="border border-slate-200 rounded-lg p-3 bg-slate-50">
            <h4 className="font-bold text-slate-900 mb-1">2. Tujuan Pembelajaran (TP)</h4>
            <ol className="list-decimal list-inside space-y-1 text-slate-800">
              {modul.tujuanPembelajaran?.map((tp, idx) => (
                <li key={idx} className="leading-normal">{tp}</li>
              ))}
            </ol>
          </div>

          <div className="border border-slate-200 rounded-lg p-3 bg-slate-50">
            <h4 className="font-bold text-slate-900 mb-1">3. Pemahaman Bermakna</h4>
            <p className="text-slate-800 leading-relaxed">{modul.pemahamanBermakna}</p>
          </div>

          <div className="border border-slate-200 rounded-lg p-3 bg-slate-50">
            <h4 className="font-bold text-slate-900 mb-1">4. Pertanyaan Pemantik</h4>
            <ul className="list-disc list-inside space-y-1 text-slate-800">
              {modul.pertanyaanPemantik?.map((pm, idx) => (
                <li key={idx}>{pm}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* 5. Urutan Kegiatan Pembelajaran */}
        <div className="mb-4">
          <h4 className="font-bold text-slate-900 text-xs mb-2 uppercase tracking-wider">
            5. Urutan Skenario Kegiatan Pembelajaran
          </h4>

          {/* Kegiatan Pendahuluan */}
          <div className="border border-blue-200 rounded-lg p-3 mb-2 bg-blue-50/40 text-xs">
            <h5 className="font-bold text-blue-900 mb-1.5 flex items-center justify-between">
              <span>a. Kegiatan Pendahuluan</span>
              <span className="text-[11px] font-semibold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                (10 - 15 Menit)
              </span>
            </h5>
            <div className="space-y-1.5">
              {modul.kegiatanPembelajaran?.pendahuluan?.map((k, idx) => (
                <div key={idx} className="flex gap-2">
                  <span className="font-semibold text-blue-800 shrink-0">•</span>
                  <div>
                    {k.sintaks && <span className="font-semibold text-slate-900">{k.sintaks}: </span>}
                    <span className="text-slate-800">{k.deskripsi}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Kegiatan Inti */}
          <div className="border border-emerald-200 rounded-lg p-3 mb-2 bg-emerald-50/40 text-xs">
            <h5 className="font-bold text-emerald-900 mb-1.5 flex items-center justify-between">
              <span>b. Kegiatan Inti (Sintaks Model Pembelajaran & Diferensiasi)</span>
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                (50 - 70 Menit)
              </span>
            </h5>
            <div className="space-y-2">
              {modul.kegiatanPembelajaran?.inti?.map((k, idx) => (
                <div key={idx} className="border-l-2 border-emerald-500 pl-2.5 py-0.5">
                  <p className="font-bold text-emerald-950 text-[11px]">
                    {k.sintaks || `Langkah ${idx + 1}`} {k.menit ? `(${k.menit} Menit)` : ''}
                  </p>
                  <p className="text-slate-800 mt-0.5">{k.deskripsi}</p>
                  {k.diferensiasi && (
                    <p className="text-[11px] text-emerald-800 bg-emerald-100/70 p-1.5 rounded mt-1 font-medium">
                      💡 <strong>Diferensiasi:</strong> {k.diferensiasi}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Kegiatan Penutup */}
          <div className="border border-purple-200 rounded-lg p-3 bg-purple-50/40 text-xs">
            <h5 className="font-bold text-purple-900 mb-1.5 flex items-center justify-between">
              <span>c. Kegiatan Penutup & Refleksi</span>
              <span className="text-[11px] font-semibold text-purple-700 bg-purple-100 px-2 py-0.5 rounded">
                (10 - 15 Menit)
              </span>
            </h5>
            <div className="space-y-1.5">
              {modul.kegiatanPembelajaran?.penutup?.map((k, idx) => (
                <div key={idx} className="flex gap-2">
                  <span className="font-semibold text-purple-800 shrink-0">•</span>
                  <div>
                    {k.sintaks && <span className="font-semibold text-slate-900">{k.sintaks}: </span>}
                    <span className="text-slate-800">{k.deskripsi}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 6. Asesmen & Penilaian */}
        <div className="mb-4 border border-slate-200 rounded-lg p-3 bg-slate-50 text-xs">
          <h4 className="font-bold text-slate-900 mb-2 uppercase tracking-wider">
            6. Asesmen / Penilaian Pembelajaran
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <div className="p-2.5 bg-white rounded border border-slate-200">
              <p className="font-bold text-indigo-900">a. Asesmen Diagnostik</p>
              <p className="text-slate-700 text-[11px] mt-1">{modul.asesmen?.diagnostik}</p>
            </div>
            <div className="p-2.5 bg-white rounded border border-slate-200">
              <p className="font-bold text-emerald-900">b. Asesmen Formatif</p>
              <p className="text-slate-700 text-[11px] mt-1">{modul.asesmen?.formatif}</p>
            </div>
            <div className="p-2.5 bg-white rounded border border-slate-200">
              <p className="font-bold text-amber-900">c. Asesmen Sumatif</p>
              <p className="text-slate-700 text-[11px] mt-1">{modul.asesmen?.sumatif}</p>
            </div>
          </div>
        </div>

        {/* 7. Remedial & Pengayaan */}
        <div className="mb-4 border border-slate-200 rounded-lg p-3 bg-slate-50 text-xs">
          <h4 className="font-bold text-slate-900 mb-1.5 uppercase tracking-wider">
            7. Program Remedial dan Pengayaan
          </h4>
          <p className="text-slate-800 mb-1">
            <strong>Remedial:</strong> {modul.remedialDanPengayaan?.remedial}
          </p>
          <p className="text-slate-800">
            <strong>Pengayaan:</strong> {modul.remedialDanPengayaan?.pengayaan}
          </p>
        </div>
      </div>

      {/* BAGIAN C: LAMPIRAN & GLOSARIUM */}
      <div className="mb-8">
        <h3 className="text-sm font-black uppercase bg-slate-800 text-white px-3 py-1.5 rounded-md mb-3">
          C. LAMPIRAN DOKUMEN
        </h3>
        <div className="space-y-3 text-xs">
          {modul.lampiran?.glosarium && modul.lampiran.glosarium.length > 0 && (
            <div className="border border-slate-200 rounded-lg p-3 bg-slate-50">
              <h4 className="font-bold text-slate-900 mb-1">1. Glosarium Istilah</h4>
              <ul className="list-disc list-inside space-y-0.5 text-slate-700">
                {modul.lampiran.glosarium.map((g, idx) => (
                  <li key={idx}>
                    <strong>{g.istilah}:</strong> {g.arti}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {modul.lampiran?.daftarPustaka && modul.lampiran.daftarPustaka.length > 0 && (
            <div className="border border-slate-200 rounded-lg p-3 bg-slate-50">
              <h4 className="font-bold text-slate-900 mb-1">2. Daftar Pustaka</h4>
              <ul className="list-disc list-inside space-y-0.5 text-slate-700">
                {modul.lampiran.daftarPustaka.map((dp, idx) => (
                  <li key={idx}>{dp}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* TANDA TANGAN RESMI */}
      <div className="mt-10 pt-6 border-t-2 border-slate-300 text-xs page-break-inside-avoid">
        <div className="flex justify-between items-start">
          <div className="text-center w-60">
            <p className="text-slate-600 mb-1">Mengetahui,</p>
            <p className="font-bold text-slate-900 uppercase">Kepala {schoolInfo.schoolName}</p>
            <div className="h-20" />
            <p className="font-bold text-slate-950 underline">{schoolInfo.headmasterName}</p>
            <p className="text-slate-600">NIP. {schoolInfo.headmasterNip}</p>
          </div>

          <div className="text-center w-60">
            <p className="text-slate-600 mb-1">
              {schoolInfo.city || 'Jakarta'}, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
            <p className="font-bold text-slate-900">Guru Pengampu / Penyusun</p>
            <div className="h-20" />
            <p className="font-bold text-slate-950 underline">{modul.penyusun}</p>
            <p className="text-slate-600">NIP. {modul.nipPenyusun || '-'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
