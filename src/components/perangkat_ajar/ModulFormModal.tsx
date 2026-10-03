import React, { useState, useEffect } from 'react';
import { ModulAjar, SchoolInfo, Teacher } from '../../types';
import {
  X,
  Save,
  BookOpen,
  Target,
  Sparkles,
  Layers,
  ClipboardList,
  FileText,
  Plus,
  Trash2,
  HelpCircle,
  Clock,
  User,
  GraduationCap
} from 'lucide-react';

interface ModulFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (modul: Omit<ModulAjar, 'id'> | ModulAjar) => void;
  initialData?: ModulAjar | null;
  schoolInfo: SchoolInfo;
  teachers: Teacher[];
}

export const ModulFormModal: React.FC<ModulFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  schoolInfo,
  teachers
}) => {
  const [activeTab, setActiveTab] = useState<'umum' | 'cp_tp' | 'kegiatan' | 'asesmen' | 'lampiran'>('umum');

  // Form State
  const [kodeModul, setKodeModul] = useState('');
  const [judul, setJudul] = useState('');
  const [mataPelajaran, setMataPelajaran] = useState('Ilmu Pengetahuan Alam & Sosial (IPAS)');
  const [mapelKode, setMapelKode] = useState('IPAS');
  const [fase, setFase] = useState('Fase B');
  const [kelas, setKelas] = useState('4');
  const [semester, setSemester] = useState<'1 (Ganjil)' | '2 (Genap)' | 'Semua'>('1 (Ganjil)');
  const [alokasiWaktu, setAlokasiWaktu] = useState('2 JP (2 x 35 Menit) / 1 Pertemuan');
  const [penyusun, setPenyusun] = useState(schoolInfo.homeroomTeacherName || 'Sri Wahyuni, S.Pd., Gr.');
  const [nipPenyusun, setNipPenyusun] = useState(schoolInfo.homeroomTeacherNip || '19880412 201201 2 018');
  const [instansi, setInstansi] = useState(schoolInfo.schoolName || 'SD Negeri Nusantara 01');
  const [tahunPenyusunan, setTahunPenyusunan] = useState(schoolInfo.academicYear || '2025/2026');

  // CP & TP
  const [elemenCP, setElemenCP] = useState('Pemahaman IPAS (Sains dan Sosial)');
  const [capaianPembelajaran, setCapaianPembelajaran] = useState('');
  const [tujuanPembelajaran, setTujuanPembelajaran] = useState<string[]>(['']);
  const [alurTujuanPembelajaran, setAlurTujuanPembelajaran] = useState('');
  const [profilPelajarPancasila, setProfilPelajarPancasila] = useState<string[]>([
    'Bernalar Kritis',
    'Gotong Royong',
    'Mandiri'
  ]);

  // Sarpras & Model
  const [media, setMedia] = useState('Slide Presentasi Interaktif, Gambar/Video Ilustrasi, Papan Tulis.');
  const [alatDanBahan, setAlatDanBahan] = useState('Lembar Kerja Siswa (LKPD), Alat Tulis, Gunting, Lem, Kertas Manila.');
  const [sumberBelajar, setSumberBelajar] = useState('Buku Siswa & Panduan Guru Kurikulum Merdeka Kemendikbudristek.');
  const [targetPesertaDidik, setTargetPesertaDidik] = useState('Peserta didik reguler/tipikal (28 siswa).');
  const [modelPembelajaran, setModelPembelajaran] = useState('Problem Based Learning (PBL) / Tatap Muka');
  const [metodePembelajaran, setMetodePembelajaran] = useState<string[]>(['Diskusi', 'Tanya Jawab', 'Presentasi', 'Eksplorasi']);

  // Inti
  const [pemahamanBermakna, setPemahamanBermakna] = useState('');
  const [pertanyaanPemantik, setPertanyaanPemantik] = useState<string[]>(['']);

  // Skenario Kegiatan
  const [pendahuluan, setPendahuluan] = useState<Array<{ sintaks?: string; deskripsi: string; menit?: number }>>([
    { sintaks: 'Pembukaan & Doa', menit: 5, deskripsi: 'Guru membuka pelajaran dengan salam, memeriksa kehadiran, dan memimpin doa.' },
    { sintaks: 'Apersepsi & Motivasi', menit: 5, deskripsi: 'Guru mengajukan pertanyaan pemantik kontekstual dan mengaitkan materi sebelumnya.' }
  ]);
  const [inti, setInti] = useState<Array<{ sintaks?: string; deskripsi: string; menit?: number; diferensiasi?: string }>>([
    { sintaks: 'Orientasi pada Masalah', menit: 15, deskripsi: 'Siswa mengamati tayangan/masalah kontekstual di depan kelas.' },
    { sintaks: 'Penyelidikan Kelompok', menit: 30, deskripsi: 'Siswa berdiskusi dalam kelompok mengerjakan LKPD dengan bimbingan guru.', diferensiasi: 'Bimbingan bertahap sesuai kesiapan belajar siswa.' },
    { sintaks: 'Presentasi & Evaluasi', menit: 15, deskripsi: 'Perwakilan kelompok menyajikan hasil temuan di depan kelas.' }
  ]);
  const [penutup, setPenutup] = useState<Array<{ sintaks?: string; deskripsi: string; menit?: number }>>([
    { sintaks: 'Refleksi & Kesimpulan', menit: 5, deskripsi: 'Siswa dan guru menyimpulkan poin penting pembelajaran hari ini.' },
    { sintaks: 'Evaluasi & Doa Penutup', menit: 5, deskripsi: 'Kuis formatif singkat (Exit Ticket) dan doa penutup.' }
  ]);

  // Asesmen
  const [diagnostik, setDiagnostik] = useState('Tanya jawab lisan di awal pembelajaran untuk mengecek pemahaman awal.');
  const [formatif, setFormatif] = useState('Observasi keaktifan diskusi dan ketepatan pengerjaan LKPD.');
  const [sumatif, setSumatif] = useState('Tes tertulis pilihan ganda dan uraian di akhir bab.');
  const [remedial, setRemedial] = useState('Bimbingan khusus materi esensial dan tutor sebaya.');
  const [pengayaan, setPengayaan] = useState('Penugasan studi kasus lebih mendalam atau proyek mandiri kreatif.');

  // Lampiran LKPD
  const [lkpdJudul, setLkpdJudul] = useState('');
  const [lkpdDeskripsi, setLkpdDeskripsi] = useState('');
  const [lkpdTugas, setLkpdTugas] = useState<Array<{ soal: string; kunciJawaban?: string }>>([
    { soal: 'Jelaskan pemahamanmu tentang materi yang telah dipelajari!', kunciJawaban: '' }
  ]);

  useEffect(() => {
    if (initialData) {
      setKodeModul(initialData.kodeModul || '');
      setJudul(initialData.judul || '');
      setMataPelajaran(initialData.mataPelajaran || '');
      setMapelKode(initialData.mapelKode || '');
      setFase(initialData.fase || 'Fase B');
      setKelas(initialData.kelas || '4');
      setSemester(initialData.semester || '1 (Ganjil)');
      setAlokasiWaktu(initialData.alokasiWaktu || '');
      setPenyusun(initialData.penyusun || '');
      setNipPenyusun(initialData.nipPenyusun || '');
      setInstansi(initialData.instansi || schoolInfo.schoolName);
      setTahunPenyusunan(initialData.tahunPenyusunan || schoolInfo.academicYear);
      setElemenCP(initialData.elemenCP || '');
      setCapaianPembelajaran(initialData.capaianPembelajaran || '');
      setTujuanPembelajaran(initialData.tujuanPembelajaran?.length ? initialData.tujuanPembelajaran : ['']);
      setAlurTujuanPembelajaran(initialData.alurTujuanPembelajaran || '');
      setProfilPelajarPancasila(initialData.profilPelajarPancasila || ['Bernalar Kritis', 'Gotong Royong']);
      setMedia(initialData.saranaPrasarana?.media || '');
      setAlatDanBahan(initialData.saranaPrasarana?.alatDanBahan || '');
      setSumberBelajar(initialData.saranaPrasarana?.sumberBelajar || '');
      setTargetPesertaDidik(initialData.targetPesertaDidik || '');
      setModelPembelajaran(initialData.modelPembelajaran || '');
      setMetodePembelajaran(initialData.metodePembelajaran || ['Diskusi']);
      setPemahamanBermakna(initialData.pemahamanBermakna || '');
      setPertanyaanPemantik(initialData.pertanyaanPemantik?.length ? initialData.pertanyaanPemantik : ['']);
      setPendahuluan(initialData.kegiatanPembelajaran?.pendahuluan || []);
      setInti(initialData.kegiatanPembelajaran?.inti || []);
      setPenutup(initialData.kegiatanPembelajaran?.penutup || []);
      setDiagnostik(initialData.asesmen?.diagnostik || '');
      setFormatif(initialData.asesmen?.formatif || '');
      setSumatif(initialData.asesmen?.sumatif || '');
      setRemedial(initialData.remedialDanPengayaan?.remedial || '');
      setPengayaan(initialData.remedialDanPengayaan?.pengayaan || '');
      setLkpdJudul(initialData.lampiran?.lkpdJudul || '');
      setLkpdDeskripsi(initialData.lampiran?.lkpdDeskripsi || '');
      setLkpdTugas(initialData.lampiran?.lkpdTugas || [{ soal: '', kunciJawaban: '' }]);
    } else {
      // Default reset
      setKodeModul(`MA-${Date.now().toString().slice(-4)}`);
      setJudul('');
      setTujuanPembelajaran(['']);
      setPertanyaanPemantik(['']);
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleAddTP = () => setTujuanPembelajaran(prev => [...prev, '']);
  const handleRemoveTP = (idx: number) => setTujuanPembelajaran(prev => prev.filter((_, i) => i !== idx));

  const handleAddPemantik = () => setPertanyaanPemantik(prev => [...prev, '']);
  const handleRemovePemantik = (idx: number) => setPertanyaanPemantik(prev => prev.filter((_, i) => i !== idx));

  const handleAddIntiStep = () => {
    setInti(prev => [...prev, { sintaks: 'Aktivitas Baru', menit: 15, deskripsi: '', diferensiasi: '' }]);
  };
  const handleRemoveIntiStep = (idx: number) => setInti(prev => prev.filter((_, i) => i !== idx));

  const handleAddLkpdTugas = () => setLkpdTugas(prev => [...prev, { soal: '', kunciJawaban: '' }]);
  const handleRemoveLkpdTugas = (idx: number) => setLkpdTugas(prev => prev.filter((_, i) => i !== idx));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!judul.trim()) {
      alert('Mohon isi Judul Modul Ajar!');
      return;
    }

    const payload: Omit<ModulAjar, 'id'> | ModulAjar = {
      ...(initialData ? { id: initialData.id } : {}),
      kodeModul: kodeModul || `MA-${Date.now().toString().slice(-4)}`,
      judul,
      mataPelajaran,
      mapelKode: mapelKode || mataPelajaran.substring(0, 4).toUpperCase(),
      fase,
      kelas,
      semester,
      alokasiWaktu,
      penyusun,
      nipPenyusun,
      instansi,
      tahunPenyusunan,
      elemenCP,
      capaianPembelajaran,
      tujuanPembelajaran: tujuanPembelajaran.filter(t => t.trim().length > 0),
      alurTujuanPembelajaran,
      profilPelajarPancasila,
      saranaPrasarana: {
        media,
        alatDanBahan,
        sumberBelajar
      },
      targetPesertaDidik,
      modelPembelajaran,
      metodePembelajaran,
      pemahamanBermakna,
      pertanyaanPemantik: pertanyaanPemantik.filter(p => p.trim().length > 0),
      kegiatanPembelajaran: {
        pendahuluan,
        inti,
        penutup
      },
      asesmen: {
        diagnostik,
        formatif,
        sumatif
      },
      remedialDanPengayaan: {
        remedial,
        pengayaan
      },
      refleksi: {
        guru: ['Apakah tujuan pembelajaran tercapai optimal?', 'Bagaimana partisipasi aktif peserta didik?'],
        siswa: ['Apa hal paling berharga yang saya pelajari hari ini?', 'Bagian mana yang perlu saya latih kembali?']
      },
      lampiran: {
        lkpdJudul: lkpdJudul || `LKPD: ${judul}`,
        lkpdDeskripsi: lkpdDeskripsi || 'Lembar aktivitas kerja eksplorasi kelompok dan individu siswa.',
        lkpdPetunjuk: [
          'Berdoalah sebelum mengerjakan lembar kerja.',
          'Baca setiap petunjuk soal dengan cermat bersama kelompokmu.',
          'Tuliskan jawaban yang runtut dan rapi.'
        ],
        lkpdTugas: lkpdTugas.filter(t => t.soal.trim().length > 0),
        bahanBacaanGuruDanSiswa: `Buku Panduan Guru & Siswa ${mataPelajaran} Kelas ${kelas} Kurikulum Merdeka.`,
        glosarium: [
          { istilah: 'Modul Ajar', arti: 'Dokumen perencanaan pembelajaran yang disusun secara sistematis dan menarik.' }
        ],
        daftarPustaka: [
          `Kementerian Pendidikan, Kebudayaan, Riset, dan Teknologi. (2024). Buku Panduan Guru ${mataPelajaran} SD Kelas ${kelas}.`
        ]
      },
      kategori: 'Modul Pokok',
      isFavorite: initialData?.isFavorite || false
    } as any;

    onSave(payload);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto no-print">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header Modal */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-800/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-600 text-white shadow-sm">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
                {initialData ? 'Edit Modul Ajar SD' : 'Susun Modul Ajar Baru (Kurikulum Merdeka)'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Format lengkap standar BSKAP Kemendikbudristek untuk Sekolah Dasar
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 px-6 pt-3 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-x-auto text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('umum')}
            className={`pb-3 px-3 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'umum'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            1. Informasi Umum
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('cp_tp')}
            className={`pb-3 px-3 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'cp_tp'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            2. Capaian & Tujuan (TP)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('kegiatan')}
            className={`pb-3 px-3 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'kegiatan'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            3. Skenario Kegiatan
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('asesmen')}
            className={`pb-3 px-3 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'asesmen'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            4. Asesmen & Rubrik
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('lampiran')}
            className={`pb-3 px-3 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'lampiran'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            5. LKPD & Lampiran
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5 text-xs">
          {/* TAB 1: INFORMASI UMUM */}
          {activeTab === 'umum' && (
            <div className="space-y-4 animate-in fade-in-50">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Judul Modul Ajar <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={judul}
                    onChange={e => setJudul(e.target.value)}
                    placeholder="Contoh: Mengenal Bagian Tubuh Tumbuhan dan Fotosintesis"
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-xs text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Kode Modul
                  </label>
                  <input
                    type="text"
                    value={kodeModul}
                    onChange={e => setKodeModul(e.target.value)}
                    placeholder="MA-IPAS-4-01"
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-xs font-mono text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Mata Pelajaran
                  </label>
                  <input
                    type="text"
                    value={mataPelajaran}
                    onChange={e => setMataPelajaran(e.target.value)}
                    placeholder="Ilmu Pengetahuan Alam & Sosial (IPAS)"
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-xs text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Fase & Jenjang
                  </label>
                  <select
                    value={fase}
                    onChange={e => setFase(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                    <option value="Fase A">Fase A (Kelas 1-2)</option>
                    <option value="Fase B">Fase B (Kelas 3-4)</option>
                    <option value="Fase C">Fase C (Kelas 5-6)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Kelas & Semester
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={kelas}
                      onChange={e => setKelas(e.target.value)}
                      className="w-1/2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-2 py-2 text-xs text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none"
                    >
                      <option value="1">Kls 1</option>
                      <option value="2">Kls 2</option>
                      <option value="3">Kls 3</option>
                      <option value="4">Kls 4</option>
                      <option value="5">Kls 5</option>
                      <option value="6">Kls 6</option>
                    </select>
                    <select
                      value={semester}
                      onChange={e => setSemester(e.target.value as any)}
                      className="w-1/2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-1 py-2 text-[11px] text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none"
                    >
                      <option value="1 (Ganjil)">Sem 1</option>
                      <option value="2 (Genap)">Sem 2</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Alokasi Waktu
                  </label>
                  <input
                    type="text"
                    value={alokasiWaktu}
                    onChange={e => setAlokasiWaktu(e.target.value)}
                    placeholder="2 JP (2 x 35 Menit)"
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-xs text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Guru Penyusun
                  </label>
                  <input
                    type="text"
                    value={penyusun}
                    onChange={e => setPenyusun(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-xs text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    NIP Penyusun
                  </label>
                  <input
                    type="text"
                    value={nipPenyusun}
                    onChange={e => setNipPenyusun(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-xs text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>

              {/* Model & Sarpras */}
              <div className="border-t border-slate-200 dark:border-slate-800 pt-4 space-y-4">
                <h4 className="font-bold text-slate-900 dark:text-slate-100 text-xs">
                  Sarana, Prasarana & Pendekatan Model Pembelajaran
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Model Pembelajaran
                    </label>
                    <input
                      type="text"
                      value={modelPembelajaran}
                      onChange={e => setModelPembelajaran(e.target.value)}
                      placeholder="Problem Based Learning (PBL) / Discovery Learning"
                      className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-xs text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Target Peserta Didik
                    </label>
                    <input
                      type="text"
                      value={targetPesertaDidik}
                      onChange={e => setTargetPesertaDidik(e.target.value)}
                      placeholder="Peserta didik reguler / tipikal (28 siswa)"
                      className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-xs text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Media Pembelajaran
                    </label>
                    <textarea
                      rows={2}
                      value={media}
                      onChange={e => setMedia(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Alat dan Bahan
                    </label>
                    <textarea
                      rows={2}
                      value={alatDanBahan}
                      onChange={e => setAlatDanBahan(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Sumber Belajar
                    </label>
                    <textarea
                      rows={2}
                      value={sumberBelajar}
                      onChange={e => setSumberBelajar(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CP & TP */}
          {activeTab === 'cp_tp' && (
            <div className="space-y-4 animate-in fade-in-50">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Elemen Capaian Pembelajaran (CP)
                </label>
                <input
                  type="text"
                  value={elemenCP}
                  onChange={e => setElemenCP(e.target.value)}
                  placeholder="Contoh: Pemahaman IPAS (Sains dan Sosial)"
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-xs text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Rumusan Capaian Pembelajaran (CP) Lengkap
                </label>
                <textarea
                  rows={3}
                  value={capaianPembelajaran}
                  onChange={e => setCapaianPembelajaran(e.target.value)}
                  placeholder="Salin teks capaian pembelajaran fase dari SK BSKAP..."
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 text-xs text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="font-bold text-slate-700 dark:text-slate-300">
                    Tujuan Pembelajaran (TP)
                  </label>
                  <button
                    type="button"
                    onClick={handleAddTP}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    <Plus className="h-3.5 w-3.5" /> Tambah TP
                  </button>
                </div>
                <div className="space-y-2">
                  {tujuanPembelajaran.map((tp, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="font-mono text-slate-400 text-xs w-6">{idx + 1}.</span>
                      <input
                        type="text"
                        value={tp}
                        onChange={e => {
                          const val = e.target.value;
                          setTujuanPembelajaran(prev => prev.map((t, i) => i === idx ? val : t));
                        }}
                        placeholder={`Rumusan Tujuan Pembelajaran ${idx + 1}...`}
                        className="flex-1 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                      {tujuanPembelajaran.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveTP(idx)}
                          className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Pemahaman Bermakna
                </label>
                <textarea
                  rows={2}
                  value={pemahamanBermakna}
                  onChange={e => setPemahamanBermakna(e.target.value)}
                  placeholder="Contoh: Tumbuhan adalah penghasil oksigen dan makanan utama bagi manusia di bumi..."
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 text-xs text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="font-bold text-slate-700 dark:text-slate-300">
                    Pertanyaan Pemantik
                  </label>
                  <button
                    type="button"
                    onClick={handleAddPemantik}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    <Plus className="h-3.5 w-3.5" /> Tambah Pertanyaan
                  </button>
                </div>
                <div className="space-y-2">
                  {pertanyaanPemantik.map((pm, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="font-mono text-slate-400 text-xs w-6">?{idx + 1}</span>
                      <input
                        type="text"
                        value={pm}
                        onChange={e => {
                          const val = e.target.value;
                          setPertanyaanPemantik(prev => prev.map((p, i) => i === idx ? val : p));
                        }}
                        placeholder="Contoh: Mengapa daun tumbuhan sebagian besar berwarna hijau?"
                        className="flex-1 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                      {pertanyaanPemantik.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemovePemantik(idx)}
                          className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: KEGIATAN */}
          {activeTab === 'kegiatan' && (
            <div className="space-y-5 animate-in fade-in-50">
              {/* Pendahuluan */}
              <div className="p-3.5 border border-blue-200 dark:border-blue-800 rounded-xl bg-blue-50/30 dark:bg-blue-950/20">
                <h4 className="font-bold text-blue-900 dark:text-blue-300 mb-2">
                  A. Kegiatan Pendahuluan (10 - 15 Menit)
                </h4>
                <div className="space-y-2">
                  {pendahuluan.map((p, idx) => (
                    <div key={idx} className="flex gap-2">
                      <input
                        type="text"
                        value={p.sintaks || ''}
                        onChange={e => {
                          const val = e.target.value;
                          setPendahuluan(prev => prev.map((item, i) => i === idx ? { ...item, sintaks: val } : item));
                        }}
                        placeholder="Sintaks"
                        className="w-1/3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-2 py-1 text-xs"
                      />
                      <input
                        type="text"
                        value={p.deskripsi}
                        onChange={e => {
                          const val = e.target.value;
                          setPendahuluan(prev => prev.map((item, i) => i === idx ? { ...item, deskripsi: val } : item));
                        }}
                        placeholder="Deskripsi kegiatan pendahuluan..."
                        className="flex-1 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-2.5 py-1 text-xs"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Inti */}
              <div className="p-3.5 border border-emerald-200 dark:border-emerald-800 rounded-xl bg-emerald-50/30 dark:bg-emerald-950/20">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-emerald-900 dark:text-emerald-300">
                    B. Kegiatan Inti (50 - 70 Menit)
                  </h4>
                  <button
                    type="button"
                    onClick={handleAddIntiStep}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-400 hover:underline"
                  >
                    <Plus className="h-3.5 w-3.5" /> Tambah Tahap
                  </button>
                </div>
                <div className="space-y-3">
                  {inti.map((step, idx) => (
                    <div key={idx} className="p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <input
                          type="text"
                          value={step.sintaks || ''}
                          onChange={e => {
                            const val = e.target.value;
                            setInti(prev => prev.map((item, i) => i === idx ? { ...item, sintaks: val } : item));
                          }}
                          placeholder="Nama Sintaks (e.g. Orientasi Masalah)"
                          className="font-bold rounded-md border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 px-2 py-1 text-xs flex-1"
                        />
                        {inti.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveIntiStep(idx)}
                            className="p-1 text-rose-500 hover:bg-rose-50 rounded"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                      <textarea
                        rows={2}
                        value={step.deskripsi}
                        onChange={e => {
                          const val = e.target.value;
                          setInti(prev => prev.map((item, i) => i === idx ? { ...item, deskripsi: val } : item));
                        }}
                        placeholder="Deskripsi kegiatan siswa dan guru..."
                        className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-2 text-xs"
                      />
                      <input
                        type="text"
                        value={step.diferensiasi || ''}
                        onChange={e => {
                          const val = e.target.value;
                          setInti(prev => prev.map((item, i) => i === idx ? { ...item, diferensiasi: val } : item));
                        }}
                        placeholder="Catatan diferensiasi konten / proses (opsional)..."
                        className="w-full rounded-md border border-emerald-300 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/40 px-2 py-1 text-[11px] text-emerald-900 dark:text-emerald-200"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Penutup */}
              <div className="p-3.5 border border-purple-200 dark:border-purple-800 rounded-xl bg-purple-50/30 dark:bg-purple-950/20">
                <h4 className="font-bold text-purple-900 dark:text-purple-300 mb-2">
                  C. Kegiatan Penutup & Refleksi (10 - 15 Menit)
                </h4>
                <div className="space-y-2">
                  {penutup.map((p, idx) => (
                    <div key={idx} className="flex gap-2">
                      <input
                        type="text"
                        value={p.sintaks || ''}
                        onChange={e => {
                          const val = e.target.value;
                          setPenutup(prev => prev.map((item, i) => i === idx ? { ...item, sintaks: val } : item));
                        }}
                        placeholder="Sintaks"
                        className="w-1/3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-2 py-1 text-xs"
                      />
                      <input
                        type="text"
                        value={p.deskripsi}
                        onChange={e => {
                          const val = e.target.value;
                          setPenutup(prev => prev.map((item, i) => i === idx ? { ...item, deskripsi: val } : item));
                        }}
                        placeholder="Deskripsi penutup..."
                        className="flex-1 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-2.5 py-1 text-xs"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: ASESMEN */}
          {activeTab === 'asesmen' && (
            <div className="space-y-4 animate-in fade-in-50">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-indigo-900 dark:text-indigo-300 mb-1">
                    Asesmen Diagnostik (Awal)
                  </label>
                  <textarea
                    rows={4}
                    value={diagnostik}
                    onChange={e => setDiagnostik(e.target.value)}
                    placeholder="Tanya jawab, kuis singkat pengenalan awal..."
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-emerald-900 dark:text-emerald-300 mb-1">
                    Asesmen Formatif (Proses)
                  </label>
                  <textarea
                    rows={4}
                    value={formatif}
                    onChange={e => setFormatif(e.target.value)}
                    placeholder="Observasi unjuk kerja, LKPD, keaktifan diskusi..."
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-amber-900 dark:text-amber-300 mb-1">
                    Asesmen Sumatif (Akhir)
                  </label>
                  <textarea
                    rows={4}
                    value={sumatif}
                    onChange={e => setSumatif(e.target.value)}
                    placeholder="Tes tertulis, ujian harian, produk poster..."
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-200 dark:border-slate-800 pt-4">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Program Remedial
                  </label>
                  <textarea
                    rows={2}
                    value={remedial}
                    onChange={e => setRemedial(e.target.value)}
                    placeholder="Bimbingan kelompok kecil dan pemanfaatan tutor sebaya..."
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Program Pengayaan
                  </label>
                  <textarea
                    rows={2}
                    value={pengayaan}
                    onChange={e => setPengayaan(e.target.value)}
                    placeholder="Tugas eksplorasi tingkat lanjut dan proyek mandiri..."
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: LAMPIRAN LKPD */}
          {activeTab === 'lampiran' && (
            <div className="space-y-4 animate-in fade-in-50">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Judul LKPD Siswa
                </label>
                <input
                  type="text"
                  value={lkpdJudul}
                  onChange={e => setLkpdJudul(e.target.value)}
                  placeholder="Lembar Kerja Peserta Didik (LKPD): Membuktikan Pengangkutan Air"
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-xs text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Deskripsi / Pengantar LKPD
                </label>
                <textarea
                  rows={2}
                  value={lkpdDeskripsi}
                  onChange={e => setLkpdDeskripsi(e.target.value)}
                  placeholder="Petunjuk praktikum pengamatan dan lembar diskusi kelompok..."
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="font-bold text-slate-700 dark:text-slate-300">
                    Daftar Soal / Tugas Penyelidikan LKPD
                  </label>
                  <button
                    type="button"
                    onClick={handleAddLkpdTugas}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    <Plus className="h-3.5 w-3.5" /> Tambah Soal LKPD
                  </button>
                </div>
                <div className="space-y-3">
                  {lkpdTugas.map((t, idx) => (
                    <div key={idx} className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-bold text-indigo-600 mt-1">Soal {idx + 1}:</span>
                        <input
                          type="text"
                          value={t.soal}
                          onChange={e => {
                            const val = e.target.value;
                            setLkpdTugas(prev => prev.map((item, i) => i === idx ? { ...item, soal: val } : item));
                          }}
                          placeholder="Tuliskan pertanyaan / instruksi tugas..."
                          className="flex-1 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-2 text-xs text-slate-900 dark:text-slate-100"
                        />
                        {lkpdTugas.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveLkpdTugas(idx)}
                            className="p-1.5 text-rose-500 hover:bg-rose-100 rounded"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                      <input
                        type="text"
                        value={t.kunciJawaban || ''}
                        onChange={e => {
                          const val = e.target.value;
                          setLkpdTugas(prev => prev.map((item, i) => i === idx ? { ...item, kunciJawaban: val } : item));
                        }}
                        placeholder="Kunci jawaban / pedoman penskoran (opsional)..."
                        className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-2.5 py-1.5 text-[11px] text-slate-600 dark:text-slate-300 italic"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {activeTab !== 'umum' && (
                <button
                  type="button"
                  onClick={() => {
                    const tabs: Array<'umum' | 'cp_tp' | 'kegiatan' | 'asesmen' | 'lampiran'> = ['umum', 'cp_tp', 'kegiatan', 'asesmen', 'lampiran'];
                    const currentIdx = tabs.indexOf(activeTab);
                    if (currentIdx > 0) setActiveTab(tabs[currentIdx - 1]);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold"
                >
                  ← Langkah Sebelumnya
                </button>
              )}
              {activeTab !== 'lampiran' && (
                <button
                  type="button"
                  onClick={() => {
                    const tabs: Array<'umum' | 'cp_tp' | 'kegiatan' | 'asesmen' | 'lampiran'> = ['umum', 'cp_tp', 'kegiatan', 'asesmen', 'lampiran'];
                    const currentIdx = tabs.indexOf(activeTab);
                    if (currentIdx < tabs.length - 1) setActiveTab(tabs[currentIdx + 1]);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 text-xs font-bold"
                >
                  Lanjut ke Langkah Berikutnya →
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 text-xs font-semibold transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 text-xs font-bold transition-all shadow-md active:scale-95"
              >
                <Save className="h-4 w-4" />
                <span>Simpan Modul Ajar</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
