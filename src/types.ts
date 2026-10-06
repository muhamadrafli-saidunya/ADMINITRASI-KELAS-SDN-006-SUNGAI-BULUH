export type UserRole = 'admin' | 'wali_kelas' | 'guru_mapel' | 'siswa';

export interface UserProfile {
  id: string;
  username?: string;
  password?: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  title: string;
  nipOrNisn: string;
  classAssigned: string;
  status?: 'Aktif' | 'Nonaktif';
  phone?: string;
  lastLogin?: string;
  createdAt?: string;
  customAllowedTabs?: ActiveTab[];
}

export type RolePermissions = Record<UserRole, ActiveTab[]>;

export interface MenuItemPermission {
  id: ActiveTab;
  label: string;
  category: 'Utama' | 'Akademik' | 'Administrasi' | 'Layanan' | 'Sistem';
  description: string;
  defaultRoles: UserRole[];
}

export interface SchoolInfo {
  npsn: string;
  schoolName: string;
  address: string;
  village?: string; // Desa / Kelurahan
  subdistrict: string;
  city: string;
  province: string;
  postalCode: string;
  phoneNumber: string;
  email: string;
  website: string;
  headmasterName: string;
  headmasterNip: string;
  homeroomTeacherName: string;
  homeroomTeacherNip: string;
  teacherName?: string; // Alias for homeroom teacher name
  teacherNip?: string; // Alias for homeroom teacher NIP
  className: string;
  phase: string; // Fase B (Kelas 3-4)
  academicYear: string;
  semester: '1 (Ganjil)' | '2 (Genap)';
  kurikulum: 'Kurikulum Merdeka Pembelajaran Mendalam (KMPM)' | 'Kurikulum Merdeka' | 'Kurikulum 2013' | string;
  effectiveDaysPerWeek?: 5 | 6 | number; // 5 atau 6 hari kerja/sekolah per minggu
  activeSchoolDays?: string[]; // e.g. ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat']

  // Penanggalan / Titimangsa Rapor (Berlaku untuk semua siswa)
  tanggalRapor?: string; // Tempat & tanggal pengesahan rapor akhir semester berlaku untuk semua siswa (misal: "Jakarta, 20 Juni 2027")
  tanggalRaporMid?: string; // Tempat & tanggal pengesahan rapor tengah semester berlaku untuk semua siswa (misal: "Jakarta, 10 Oktober 2026")

  // Logo & Kop Surat Configuration
  logoLeft?: string; // Base64 data URL or Image URL
  logoLeftPreset?: string; // 'tutwuri' | 'kemdikbud' | 'kemenag' | 'garuda' | 'pemda_dki' | 'pemda_jabar' | 'pemda_jateng' | 'pemda_jatim' | 'sd_nasional' | 'custom'
  logoLeftWidth?: number; // In px, e.g. 70
  showLogoLeft?: boolean; // default true

  logoRight?: string; // Base64 data URL or Image URL
  logoRightPreset?: string; // 'merdeka' | 'tutwuri' | 'sd_nasional' | 'pramuka' | 'uks' | 'adiwiyata' | 'custom'
  logoRightWidth?: number; // In px, e.g. 70
  showLogoRight?: boolean; // default true

  kopLine1?: string; // e.g. 'PEMERINTAH PROVINSI DKI JAKARTA'
  kopLine2?: string; // e.g. 'DINAS PENDIDIKAN DAN KEBUDAYAAN'
  kopBorderStyle?: 'double' | 'solid' | 'dashed' | 'none'; // default 'double'
}

export type AgamaType = 'Islam' | 'Kristen' | 'Katolik' | 'Hindu' | 'Buddha' | 'Konghucu';

export interface Student {
  id: string;
  nisn: string;
  nis: string;
  nama: string;
  jenisKelamin: 'L' | 'P';
  tempatLahir: string;
  tanggalLahir: string;
  agama: AgamaType;
  alamat: string;
  namaAyah: string;
  namaIbu: string;
  pekerjaanOrtu: string;
  noHpOrtu: string;
  fotoUrl: string;
  status: 'Aktif' | 'Mutasi' | 'Lulus' | 'Non-aktif';
  nomorAbsen: number;
  kelas: string;
  catatanKhusus?: string;
  statusDalamKeluarga?: string;
  anakKe?: number | string;
  sekolahAsal?: string;
  diterimaDiKelas?: string;
  diterimaTanggal?: string;
}

export type AttendanceStatus = 'Hadir' | 'Sakit' | 'Izin' | 'Alpa';

export interface AttendanceRecord {
  id: string;
  tanggal: string; // YYYY-MM-DD
  siswaId: string;
  status: AttendanceStatus;
  keterangan?: string;
  waktuInput: string;
}

export interface Subject {
  id: string;
  kode: string;
  nama: string;
  kelompok: 'Umum' | 'Muatan Lokal' | 'Pilihan';
  kktp: number; // Kriteria Ketercapaian Tujuan Pembelajaran (min score e.g. 75)
  guruPengampu: string;
  iconName: string;
  deskripsi?: string;
  jumlahJamPerMinggu?: number;
  agama?: AgamaType | 'Semua';
}

export interface TujuanPembelajaran {
  id: string;
  mapelId: string;
  kode: string; // e.g. "TP 1", "TP 2", "TP 3", "TP 4", "TP 4.1"
  lingkupMateri: string; // e.g. "Bab 1: Pancasila Sebagai Nilai Kehidupan"
  deskripsi: string; // Rumusan kalimat TP
  semester: '1 (Ganjil)' | '2 (Genap)' | 'Semua';
  fase?: string; // e.g. "Fase B (Kelas 4)"
  kktp?: number; // Target nilai ketuntasan khusus TP ini
  ringkasanRaporTuntas?: string;
  ringkasanRaporPerluBimbingan?: string;
  agama?: AgamaType | 'Semua';
}

export type AssessmentType = 
  | 'Formatif_TP1' 
  | 'Formatif_TP2' 
  | 'Formatif_TP3' 
  | 'Formatif_TP4' 
  | 'Formatif_TP5' 
  | 'Formatif_TP6' 
  | 'Formatif_TP7' 
  | 'Formatif_TP8' 
  | 'Sumatif_STS' 
  | 'Sumatif_SAS'
  | (string & {});

export interface GradeRecord {
  id: string;
  siswaId: string;
  mapelId: string;
  jenis: AssessmentType;
  nilai: number; // 0-100
  semester?: '1 (Ganjil)' | '2 (Genap)' | string;
  capaianKompetensi?: string;
  tanggal?: string;
}

export interface TeachingJournal {
  id: string;
  tanggal: string;
  jamKe: string; // e.g. "1 - 2"
  mapelId: string;
  materi: string;
  tujuanPembelajaran: string;
  kegiatan: string;
  evaluasi: string;
  kehadiran?: string;
  catatan?: string;
  siswaTidakHadir?: string[];
  status?: 'Selesai' | 'Tertunda' | 'Pengganti' | string;
}

export interface ScheduleItem {
  id: string;
  hari: 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat' | 'Sabtu';
  jamKe: number;
  waktu: string;
  mapelId: string;
  guruPengampu: string;
  ruang: string;
  warnaBadge: string;
  catatanPerlengkapan?: string;
  topikMateri?: string;
}

export interface CashTransaction {
  id: string;
  tanggal: string;
  jenis: 'Pemasukan' | 'Pengeluaran';
  kategori: 'Iuran Kas Siswa' | 'Iuran Kas Mingguan' | 'Donasi Paguyuban' | 'ATK / Spidol' | 'Fotocopy Tugas' | 'Kegiatan Kelas' | 'Santunan / Sosial' | 'Lainnya' | string;
  jumlah: number;
  keterangan: string;
  penanggungJawab: string;
  saldoSetelah: number;
  namaSiswa?: string;
  siswaId?: string;
  mingguKe?: number[] | number | string;
  metodePembayaran?: 'Tunai' | 'Transfer' | 'QRIS' | string;
}

export interface StudentWeeklyDues {
  id: string;
  siswaId: string;
  bulan: string; // e.g. "Agustus 2026"
  minggu1: boolean;
  minggu2: boolean;
  minggu3: boolean;
  minggu4: boolean;
  nominalPerMinggu: number;
  totalDisetor?: number;
}

export interface InventoryItem {
  id: string;
  kodeBarang: string;
  namaBarang: string;
  spesifikasi?: string;
  kategori?: 'Perabot' | 'Elektronik' | 'Pojok Baca' | 'Alat Peraga' | 'Kebersihan' | string;
  jumlah: number;
  satuan?: string;
  kondisi: 'Baik' | 'Rusak Ringan' | 'Rusak Berat';
  sumberDana?: 'BOS' | 'BOS Reguler' | 'BOS Kinerja' | 'Kas Paguyuban' | 'Bantuan Pemerintah' | 'Swadaya' | string;
  tahunPengadaan?: number;
  tanggalPengadaan?: string;
  keterangan?: string;
}

export interface CounselingRecord {
  id: string;
  tanggal: string;
  siswaId: string;
  jenis?: 'Prestasi' | 'Perilaku' | 'Akademik' | 'Sosial / Emosional' | 'Bimbingan Khusus' | string;
  kategori?: 'Bimbingan' | 'Prestasi' | 'Pelanggaran' | 'Konseling Ortu' | string;
  kasusAtauPrestasi?: string;
  judul?: string;
  deskripsi?: string;
  tindakLanjut: string;
  hasil?: string;
  status?: 'Selesai' | 'Dalam Pantauan' | 'Perlu Kerjasama Ortu' | string;
  pembimbing?: string;
}

export type StudentNote = CounselingRecord;
export type JournalEntry = TeachingJournal;

export interface SchoolEvent {
  id: string;
  tanggal: string;
  judul: string;
  kategori: 'Sekolah' | 'Kelas' | 'Ujian' | 'Libur' | 'P5';
  deskripsi: string;
  waktu: string;
}

export interface CleaningDuty {
  hari: 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat' | 'Sabtu' | string;
  siswaIds: string[];
  ketuaPiket: string;
  tugasSpesifik?: string;
  areaTugas?: string[];
  waktuPiket?: 'Pagi (Sebelum Bel)' | 'Siang (Pulang Sekolah)' | 'Pagi & Siang' | string;
}

export interface Teacher {
  id: string;
  nip: string; // NIP or '-'
  nuptk?: string;
  nama: string; // Nama Lengkap & Gelar
  jenisKelamin: 'L' | 'P';
  jabatan: string; // e.g. 'Kepala Sekolah', 'Guru Kelas 4A', 'Guru PAI & BP', 'Guru PJOK', 'Operator Dapodik'
  jenisGuru: 'Kepala Sekolah' | 'Guru Kelas' | 'Guru Mapel' | 'Guru BK' | 'Tenaga Kependidikan';
  statusKepegawaian: 'PNS' | 'PPPK' | 'GTT / Honorer' | 'Guru Tetap Yayasan';
  golonganPangkat?: string; // e.g. 'IV/b - Pembina Tk. I', 'III/c - Penata', 'IX (PPPK)', '-'
  pendidikanTerakhir: string; // e.g. 'S1 PGSD', 'S2 Manajemen Pendidikan', etc.
  jurusan?: string;
  noHp: string;
  email: string;
  alamat: string;
  fotoUrl?: string;
  statusAktif: 'Aktif' | 'Cuti' | 'Pensiun' | 'Mutasi';
  mataPelajaranUtama?: string[];
  kelasDiampu?: string;
  tugasTambahan?: string;
  tanggalBergabung?: string;
  tempatLahir?: string;
  tanggalLahir?: string;
  catatanKhusus?: string;
}

export type KenaikanStatus = 'Naik Kelas' | 'Tinggal Kelas' | 'Lulus' | 'Tidak Lulus' | 'Belum Ditentukan';

export type ReportType = 'semester' | 'mid_semester';

export interface ReportAttendanceData {
  isManual: boolean;
  sakit?: number;
  izin?: number;
  alpa?: number;
}

export interface StudentReportData {
  siswaId: string;
  ranking?: number | string;
  rankingMid?: number | string;
  totalNilai?: number;
  rataRataNilai?: number;
  totalNilaiMid?: number;
  rataRataNilaiMid?: number;
  statusKenaikan: KenaikanStatus;
  targetKelas: string; // e.g. "V (Lima)" atau "Kelas 5A"
  keteranganKenaikan?: string;
  catatanWaliKelas: string;
  catatanWaliKelasMid?: string;
  deskripsiKokurikuler?: string;
  tanggapanOrangTua?: string;
  tempatTanggalRapor?: string;
  tempatTanggalRaporMid?: string;
  showRanking?: boolean;
  showKenaikan?: boolean;
  parentSignatureChoice?: 'auto' | 'ayah' | 'ibu' | 'custom' | 'dots';
  parentCustomName?: string;
  customAbsensi?: ReportAttendanceData;
  customAbsensiMid?: ReportAttendanceData;
  showMidDeskripsi?: boolean;
}

export interface Extracurricular {
  id: string;
  siswaId: string;
  namaKegiatan: string;
  predikat: 'Sangat Baik' | 'Baik' | 'Cukup';
  keterangan: string;
}

export interface LearningActivityStep {
  sintaks?: string;
  tahapan?: string;
  deskripsi: string;
  menit?: number;
  diferensiasi?: string;
}

export interface LearningAssessment {
  diagnostik: string;
  formatif: string;
  sumatif: string;
  rubrikPenilaian?: string;
  teknikPenilaian?: string[];
  instrumenPenilaian?: string[];
}

export interface LearningAppendix {
  lkpdJudul: string;
  lkpdDeskripsi: string;
  lkpdPetunjuk: string[];
  lkpdTugas: Array<{
    soal: string;
    tipe?: 'esai' | 'pilihan_ganda' | 'praktik' | 'analisis';
    kunciJawaban?: string;
  }>;
  bahanBacaanGuruDanSiswa: string;
  glosarium: Array<{ istilah: string; arti: string }>;
  daftarPustaka: string[];
}

export interface ModulAjar {
  id: string;
  kodeModul: string; // e.g. "MA-IPAS-4-01"
  judul: string; // e.g. "Bagian Tubuh Tumbuhan dan Proses Fotosintesis"
  mataPelajaran: string;
  mapelKode?: string;
  fase: 'Fase A' | 'Fase B' | 'Fase C' | string;
  kelas: '1' | '2' | '3' | '4' | '5' | '6' | string;
  semester: '1 (Ganjil)' | '2 (Genap)' | 'Semua';
  alokasiWaktu: string; // e.g. "2 JP (2 x 35 Menit) / 1 Pertemuan"
  jumlahPertemuan?: number;
  penyusun: string;
  nipPenyusun?: string;
  instansi: string;
  tahunPenyusunan: string;
  
  // Komponen Kurikulum Merdeka
  elemenCP: string; // e.g. "Pemahaman IPAS (Sains dan Sosial)"
  capaianPembelajaran: string;
  tujuanPembelajaran: string[];
  alurTujuanPembelajaran?: string;
  profilPelajarPancasila: string[]; // ['Bernalar Kritis', 'Gotong Royong', 'Kreatif', 'Mandiri']
  
  // Sarana & Prasarana
  saranaPrasarana: {
    media: string;
    alatDanBahan: string;
    sumberBelajar: string;
    lingkunganBelajar?: string;
  };
  
  // Model & Pendekatan
  targetPesertaDidik: string; // "Peserta didik reguler/tipikal (28 siswa)"
  modelPembelajaran: string; // "Problem Based Learning (PBL) / Tatap Muka"
  metodePembelajaran: string[]; // ['Pengamatan', 'Diskusi Kelompok', 'Eksperimen', 'Presentasi']
  
  // Inti Pembelajaran
  pemahamanBermakna: string;
  pertanyaanPemantik: string[];
  
  // Skenario Pembelajaran
  kegiatanPembelajaran: {
    pendahuluan: LearningActivityStep[];
    inti: LearningActivityStep[];
    penutup: LearningActivityStep[];
  };
  
  // Asesmen & Penilaian
  asesmen: LearningAssessment;
  
  // Pengayaan & Remedial
  remedialDanPengayaan: {
    remedial: string;
    pengayaan: string;
  };
  
  // Refleksi
  refleksi: {
    guru: string[];
    siswa: string[];
  };
  
  // Lampiran
  lampiran: LearningAppendix;
  
  // Meta
  kategori: 'Modul Pokok' | 'Modul Suplemen' | 'Modul P5' | 'Muatan Lokal';
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
  isFavorite?: boolean;
}

// ==========================================
// KOKURIKULER & DIMENSI PROFIL LULUSAN (DPL)
// ==========================================

export type DPLPredikat = 'BB' | 'MB' | 'BSH' | 'SB';
// BB = Belum Berkembang
// MB = Mulai Berkembang
// BSH = Berkembang Sesuai Harapan
// SB = Sangat Berkembang

export interface DPLSubElemen {
  id: string;
  kode: string; // misal 'DPL1.1', 'DPL2.1', dst
  nama: string;
  targetFase: string; // Deskripsi capaian fase B (Kelas 3-4 SD)
  deskripsiBB?: string;
  deskripsiMB?: string;
  deskripsiBSH?: string;
  deskripsiSB?: string;
}

export interface DPLElemen {
  id: string;
  kode: string;
  nama: string;
  subElemen: DPLSubElemen[];
}

export interface DimensiProfilLulusan {
  id: string;
  kode: string; // 'DPL-1' s/d 'DPL-8'
  nomor: number;
  nama: string;
  tagline: string;
  deskripsi: string;
  warna: string;
  iconName: string;
  elemen: DPLElemen[];
}

export type TemaKokurikuler = 
  | 'Gaya Hidup Berkelanjutan'
  | 'Kearifan Lokal'
  | 'Bhinneka Tunggal Ika'
  | 'Bangunlah Jiwa dan Raganya'
  | 'Rekayasa dan Teknologi'
  | 'Kewirausahaan'
  | 'Suara Demokrasi';

export interface TahapanProjekKokurikuler {
  id: string;
  namaTahap: 'Pengenalan' | 'Kontekstualisasi' | 'Aksi' | 'Refleksi & Tindak Lanjut' | string;
  deskripsiKegiatan: string;
  alokasiJP: number;
  tanggalMulai?: string;
  tanggalSelesai?: string;
  status: 'Belum' | 'Berjalan' | 'Sedang Berjalan' | 'Selesai';
}

export interface KokurikulerDimensiMapping {
  id: string;
  dimensi: string; // e.g. 'kesehatan', 'kemandirian', 'penalaran kritis'
  warna?: string; // e.g. '#cfe2f3' (blue), '#fff2cc' (yellow), '#d9d9d9' (gray)
  subdimensi: string[]; // e.g. ['hidup bersih dan sehat', 'kebugaran, kesehatan fisik, dan kesehatan mental']
}

export interface ProjekKokurikuler {
  id: string;
  kodeProjek: string;
  judul: string;
  tema: TemaKokurikuler | string;
  namaKegiatan?: string; // Format E-Rapor Kemendikdasmen, e.g. "Gerakan 7KAIH"
  bentukKegiatan?: string; // e.g. "Pembiasaan", "Aksi Nyata", "Gelar Karya"
  tujuanRingkasDeskripsi?: string; // e.g. "memahami manfaat berolahraga bagi tubuh dan pembiasaan berolahraga"
  dimensiSubdimensiMapping?: KokurikulerDimensiMapping[];
  deskripsi: string;
  latarBelakang?: string;
  tujuanProjek?: string;
  fase: string;
  kelas: string;
  semester: '1 (Ganjil)' | '2 (Genap)';
  tahunAjaran: string;
  totalAlokasiJP: number;
  koordinator: string;
  fasilitator: string[];
  dimensiTargetIds: string[]; // List of DimensiProfilLulusan ids
  elemenTargetIds: string[]; // List of sub-elemen ids
  tahapan: TahapanProjekKokurikuler[];
  status: 'Perencanaan' | 'Sedang Berjalan' | 'Selesai';
  createdAt?: string;
  updatedAt?: string;
}

// Penilaian Capaian DPL Kokurikuler per Siswa
export interface SiswaDPLCapaianRecord {
  id: string;
  projekId: string;
  siswaId: string;
  capaianPerDimensi: Record<string, {
    predikat: DPLPredikat;
    catatan?: string;
  }>;
  catatanProses: string;
  rekomendasiTindakLanjut?: string;
  produkKarya?: string;
  keaktifan?: 'Sangat Aktif' | 'Aktif' | 'Cukup' | 'Perlu Motivasi';
  waktuPenilaian?: string;
}

// Isian Pendukung: Log / Jurnal Pelaksanaan Kokurikuler
export interface JurnalAktivitasKokurikuler {
  id: string;
  projekId: string;
  tanggal: string;
  tahap: string;
  materiAktivitas: string;
  alokasiJP: number;
  fasilitator: string;
  lokasi: string;
  alatDanBahan?: string;
  catatanRefleksi: string;
  kendalaDanSolusi?: string;
  kehadiranPesertaPersen?: number;
  dokumentasiFoto?: string;
}

// Isian Pendukung: Portofolio / Artefak Karya Kokurikuler Siswa
export interface ArtefakKaryaKokurikuler {
  id: string;
  projekId: string;
  judulKarya: string;
  jenisKarya: 'Poster/Infografis' | 'Produk Daur Ulang' | 'Laporan Proyek' | 'Video/Audio' | 'Pementasan Seni' | 'Model/Prototipe' | 'Olahan Pangan/Bibit' | string;
  siswaPenyusun: string[];
  kelompok?: string;
  deskripsi: string;
  nilaiKreativitas?: number;
  fotoUrl?: string;
  tanggalKarya: string;
}

export type ActiveTab = 
  | 'dashboard'
  | 'siswa'
  | 'guru'
  | 'presensi'
  | 'perangkat_ajar'
  | 'kokurikuler_dpl'
  | 'nilai'
  | 'raport'
  | 'jurnal'
  | 'jadwal'
  | 'kas'
  | 'inventaris'
  | 'konseling'
  | 'import_excel'
  | 'ai_assistant'
  | 'pengaturan';

export const isSemesterGenap = (semester?: string): boolean => {
  if (!semester) return false;
  const s = semester.toLowerCase();
  return s.includes('2') || s.includes('genap');
};

export const normalizeSemester = (semester?: string): '1 (Ganjil)' | '2 (Genap)' => {
  if (!semester) return '1 (Ganjil)';
  const s = semester.toLowerCase();
  return (s.includes('2') || s.includes('genap')) ? '2 (Genap)' : '1 (Ganjil)';
};

/**
 * Normalizes a Tujuan Pembelajaran (TP) semester tag reliably
 */
export const normalizeTPSemester = (tp: {
  id?: string;
  semester?: string;
  lingkupMateri?: string;
  deskripsi?: string;
}): '1 (Ganjil)' | '2 (Genap)' | 'Semua' => {
  const idLower = (tp.id || '').toLowerCase();
  const semStr = (tp.semester || '').toLowerCase().trim();
  const contentStr = `${tp.lingkupMateri || ''} ${tp.deskripsi || ''}`.toLowerCase();

  // Strong Semester 2 indicators (ID or content or explicit tag)
  if (
    idLower.includes('-s2-') ||
    idLower.includes('sem2') ||
    idLower.includes('s2-') ||
    semStr.includes('2') ||
    semStr.includes('genap') ||
    /\b(bab|unit)\s*[5-9]\b/i.test(contentStr)
  ) {
    return '2 (Genap)';
  }

  // Strong Semester 1 indicators
  if (
    idLower.includes('-s1-') ||
    idLower.includes('sem1') ||
    idLower.includes('s1-') ||
    semStr.includes('1') ||
    semStr.includes('ganjil') ||
    /\b(bab|unit)\s*[1-4]\b/i.test(contentStr)
  ) {
    return '1 (Ganjil)';
  }

  if (semStr === 'semua' || semStr === 'all') return 'Semua';

  return '1 (Ganjil)';
};

/**
 * Checks whether a Tujuan Pembelajaran (TP) belongs to the given target semester
 */
export const isTPForSemester = (
  tp: {
    id?: string;
    semester?: string;
    lingkupMateri?: string;
    deskripsi?: string;
  },
  targetSem?: string
): boolean => {
  const normTarget = normalizeSemester(targetSem);
  const isTargetGanjil = normTarget === '1 (Ganjil)';

  const semStr = (tp.semester || '').toLowerCase().trim();
  const idLower = (tp.id || '').toLowerCase();
  const contentStr = `${tp.lingkupMateri || ''} ${tp.deskripsi || ''}`.toLowerCase();

  // Explicit Semester 2 indicators (ID or explicit semester tag or higher chapters)
  const isGenapIndicator =
    semStr.includes('2') ||
    semStr.includes('genap') ||
    idLower.includes('-s2-') ||
    idLower.includes('sem2') ||
    idLower.includes('s2-') ||
    /\b(bab|unit)\s*[5-9]\b/i.test(contentStr);

  // Explicit Semester 1 indicators (ID or explicit semester tag or lower chapters)
  const isGanjilIndicator =
    semStr.includes('1') ||
    semStr.includes('ganjil') ||
    idLower.includes('-s1-') ||
    idLower.includes('sem1') ||
    idLower.includes('s1-') ||
    (/\b(bab|unit)\s*[1-4]\b/i.test(contentStr) && !isGenapIndicator);

  if (isGenapIndicator && !isGanjilIndicator) {
    return !isTargetGanjil;
  }

  if (isGanjilIndicator && !isGenapIndicator) {
    return isTargetGanjil;
  }

  if (isGenapIndicator) {
    return !isTargetGanjil;
  }

  if (semStr === 'semua' || semStr === 'all') return true;

  return isTargetGanjil;
};

