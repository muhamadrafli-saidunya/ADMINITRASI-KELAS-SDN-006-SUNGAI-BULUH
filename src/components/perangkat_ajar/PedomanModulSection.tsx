import React from 'react';
import {
  BookOpen,
  HelpCircle,
  Sparkles,
  Layers,
  Target,
  FileCheck2,
  Users,
  Award,
  CheckCircle2,
  Lightbulb
} from 'lucide-react';

export const PedomanModulSection: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Intro Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 text-white shadow-lg">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20">
            <BookOpen className="h-7 w-7 text-amber-300" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-200">
              Panduan Resmi Kurikulum Merdeka
            </span>
            <h2 className="text-xl sm:text-2xl font-black mt-0.5">
              Pedoman Penyusunan Modul Ajar Sekolah Dasar (SD)
            </h2>
            <p className="text-xs sm:text-sm text-indigo-100 mt-2 leading-relaxed max-w-3xl">
              Modul Ajar adalah dokumen perencanaan pembelajaran yang memuat tujuan, langkah, media pembelajaran,
              serta asesmen yang disusun secara sistematis dan menarik sesuai karakteristik peserta didik dan prinsip Pembelajaran Berdiferensiasi.
            </p>
          </div>
        </div>
      </div>

      {/* 3 Komponen Utama Modul Ajar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 flex items-center justify-center font-black text-sm">
              1
            </div>
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
              Informasi Umum
            </h3>
          </div>
          <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>Identitas Modul:</strong> Nama penyusun, instansi, tahun, jenjang/kelas, alokasi waktu.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>Kompetensi Awal:</strong> Pengetahuan prasyarat yang harus dikuasai siswa.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>Profil Pelajar Pancasila:</strong> 1-3 dimensi terpilih yang terintegrasi dalam aktivitas.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>Sarana & Prasarana:</strong> Alat, media, bahan, dan sumber belajar.</span>
            </li>
          </ul>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center font-black text-sm">
              2
            </div>
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
              Komponen Inti
            </h3>
          </div>
          <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>Tujuan Pembelajaran:</strong> Menentukan hasil belajar yang dapat diukur dan diamati.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>Pemahaman Bermakna:</strong> Manfaat esensial ilmu dalam kehidupan nyata.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>Pertanyaan Pemantik:</strong> Memicu rasa ingin tahu dan nalar kritis siswa.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>Kegiatan Berdiferensiasi:</strong> Tahap pendahuluan, inti, penutup sesuai kesiapan murid.</span>
            </li>
          </ul>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600 flex items-center justify-center font-black text-sm">
              3
            </div>
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
              Lampiran & Asesmen
            </h3>
          </div>
          <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>LKPD (Lembar Kerja):</strong> Panduan aktivitas dan tugas eksplorasi siswa.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>Rubrik & Asesmen:</strong> Diagnostik, formatif performa, dan tes sumatif.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>Remedial & Pengayaan:</strong> Intervensi khusus bagi yang belum tuntas/lebih mahir.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>Glosarium & Pustaka:</strong> Penjelasan kosakata dan rujukan sumber resmi.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Pembelajaran Berdiferensiasi Guide */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-amber-500" />
          Penerapan Pembelajaran Berdiferensiasi di Sekolah Dasar
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-indigo-700 dark:text-indigo-400 mb-1">
              1. Diferensiasi Konten
            </h4>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              Menyediakan ragam sumber dan format materi (bacaan teks bergambar, video animasi, benda konkret/alat peraga)
              berdasarkan profil belajar visual, auditori, dan kinestetik murid.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-emerald-700 dark:text-emerald-400 mb-1">
              2. Diferensiasi Proses
            </h4>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              Memberikan scaffolding (bimbingan berjenjang). Kelompok yang butuh bantuan didampingi langsung oleh guru (bimbingan intensif),
              sementara kelompok mandiri diberikan tugas eksplorasi terbuka.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-purple-700 dark:text-purple-400 mb-1">
              3. Diferensiasi Produk
            </h4>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              Memberi kebebasan bagi siswa untuk mendemonstrasikan hasil belajar melalui media yang disukainya
              (misalnya: gambar poster, cerita lisan/video pendek, infografis, atau simulasi gerak).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
