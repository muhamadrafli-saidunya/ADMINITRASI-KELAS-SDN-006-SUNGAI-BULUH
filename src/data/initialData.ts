import { 
  SchoolInfo, 
  Student, 
  Teacher,
  Subject, 
  TujuanPembelajaran,
  GradeRecord, 
  AttendanceRecord, 
  TeachingJournal, 
  ScheduleItem, 
  CashTransaction, 
  StudentWeeklyDues, 
  InventoryItem, 
  CounselingRecord, 
  SchoolEvent, 
  CleaningDuty,
  UserProfile,
  Extracurricular,
  AssessmentType,
  RolePermissions,
  MenuItemPermission,
  StudentReportData
} from '../types';

export const INITIAL_USERS: UserProfile[] = [
  {
    id: 'user-admin-1',
    username: 'admin',
    password: 'admin123',
    name: 'Drs. H. Bambang Sutrisno, M.Pd.',
    email: 'kepsek@sdn.sch.id',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    title: 'Kepala Sekolah / Pengawas Dapodik',
    nipOrNisn: '19680315 199303 1 005',
    classAssigned: 'Semua Kelas (1-6)',
    status: 'Aktif',
    phone: '081234567890',
    createdAt: '2024-01-10'
  },
  {
    id: 'user-guru-1',
    username: 'guru4a',
    password: 'guru123',
    name: 'Sri Wahyuni, S.Pd., Gr.',
    email: 'sri.wahyuni@sdn.sch.id',
    role: 'wali_kelas',
    avatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80',
    title: 'Wali Kelas 4A & Guru Pembina',
    nipOrNisn: '19880412 201201 2 018',
    classAssigned: 'Kelas 4A',
    status: 'Aktif',
    phone: '081398765432',
    createdAt: '2024-01-12'
  },
  {
    id: 'user-mapel-1',
    username: 'gurupai',
    password: 'mapel123',
    name: 'Muhammad Hidayat, S.Pd.I.',
    email: 'hidayat.pai@sdn.sch.id',
    role: 'guru_mapel',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    title: 'Guru Pendidikan Agama Islam & BP',
    nipOrNisn: '19900820 201903 1 008',
    classAssigned: 'Kelas 1-6 (Mapel PAI)',
    status: 'Aktif',
    phone: '081287654321',
    createdAt: '2024-01-15'
  },
  {
    id: 'user-siswa-1',
    username: 'siswa01',
    password: 'siswa123',
    name: 'Ahmad Fauzi & Wali Murid',
    email: 'fauzi.ahmad@siswa.sdn.sch.id',
    role: 'siswa',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    title: 'Siswa Kelas 4A (No. Absen 01)',
    nipOrNisn: '0123849102',
    classAssigned: 'Kelas 4A',
    status: 'Aktif',
    phone: '085712345678',
    createdAt: '2024-01-20'
  }
];

export const DEFAULT_ROLE_PERMISSIONS: RolePermissions = {
  admin: [
    'dashboard',
    'siswa',
    'guru',
    'presensi',
    'perangkat_ajar',
    'kokurikuler_dpl',
    'nilai',
    'raport',
    'jurnal',
    'jadwal',
    'kas',
    'inventaris',
    'konseling',
    'import_excel',
    'ai_assistant',
    'pengaturan'
  ],
  wali_kelas: [
    'dashboard',
    'siswa',
    'guru',
    'presensi',
    'perangkat_ajar',
    'kokurikuler_dpl',
    'nilai',
    'raport',
    'jurnal',
    'jadwal',
    'kas',
    'inventaris',
    'konseling',
    'import_excel',
    'ai_assistant',
    'pengaturan'
  ],
  guru_mapel: [
    'dashboard',
    'siswa',
    'guru',
    'presensi',
    'perangkat_ajar',
    'kokurikuler_dpl',
    'nilai',
    'jurnal',
    'jadwal',
    'import_excel'
  ],
  siswa: [
    'dashboard',
    'siswa',
    'presensi',
    'perangkat_ajar',
    'kokurikuler_dpl',
    'nilai',
    'raport',
    'jadwal',
    'kas',
    'konseling'
  ]
};

export const MENU_PERMISSIONS_LIST: MenuItemPermission[] = [
  {
    id: 'dashboard',
    label: 'Dashboard Utama',
    category: 'Utama',
    description: 'Ringkasan statistik kelas, kehadiran harian, grafik nilai, dan agenda aktif',
    defaultRoles: ['admin', 'wali_kelas', 'guru_mapel', 'siswa']
  },
  {
    id: 'siswa',
    label: 'Data Siswa & Buku Induk',
    category: 'Akademik',
    description: 'Buku induk siswa, biodata lengkap, data orang tua, dan mutasi',
    defaultRoles: ['admin', 'wali_kelas', 'guru_mapel', 'siswa']
  },
  {
    id: 'guru',
    label: 'Data Guru & DUK Tendik',
    category: 'Administrasi',
    description: 'Daftar urut kepegawaian pendidik, profil guru kelas & mapel, SK, dan NIP',
    defaultRoles: ['admin', 'wali_kelas', 'guru_mapel']
  },
  {
    id: 'presensi',
    label: 'Presensi & Absensi Siswa',
    category: 'Akademik',
    description: 'Pencatatan kehadiran harian (H/S/I/A), rekap bulanan, dan cetak persentase',
    defaultRoles: ['admin', 'wali_kelas', 'guru_mapel', 'siswa']
  },
  {
    id: 'perangkat_ajar',
    label: 'Perangkat Ajar SD (Modul Ajar)',
    category: 'Akademik',
    description: 'Perangkat ajar lengkap Kurikulum Merdeka: Modul Ajar SD, CP/TP, sintaks kegiatan, LKPD, rubrik asesmen, dan cetak resmi A4',
    defaultRoles: ['admin', 'wali_kelas', 'guru_mapel', 'siswa']
  },
  {
    id: 'kokurikuler_dpl',
    label: 'Kokurikuler & Dimensi Profil Lulusan (DPL)',
    category: 'Akademik',
    description: 'Pengelolaan projek kokurikuler, pemetaan 8 Dimensi Profil Lulusan (DPL), asesmen capaian (BB/MB/BSH/SB), dan cetak rapor projek',
    defaultRoles: ['admin', 'wali_kelas', 'guru_mapel', 'siswa']
  },
  {
    id: 'nilai',
    label: 'Daftar Nilai & Capaian TP',
    category: 'Akademik',
    description: 'Penginputan asesmen formatif, sumatif STS/SAS, rentang nilai, dan predikat',
    defaultRoles: ['admin', 'wali_kelas', 'guru_mapel', 'siswa']
  },
  {
    id: 'raport',
    label: 'Cetak Rapor KMPM (Pembelajaran Mendalam)',
    category: 'Akademik',
    description: 'Cetak lembar laporan hasil belajar (rapor KMPM), deskripsi capaian pembelajaran mendalam, dan ekskul',
    defaultRoles: ['admin', 'wali_kelas', 'siswa']
  },
  {
    id: 'jurnal',
    label: 'Buku Jurnal Mengajar Harian',
    category: 'Akademik',
    description: 'Catatan materi ajar, tujuan pembelajaran harian, dan tindak lanjut guru',
    defaultRoles: ['admin', 'wali_kelas', 'guru_mapel']
  },
  {
    id: 'jadwal',
    label: 'Jadwal Pelajaran & Regu Piket',
    category: 'Administrasi',
    description: 'Jadwal pelajaran mingguan, kalender pendidikan, dan pembagian tugas piket kelas',
    defaultRoles: ['admin', 'wali_kelas', 'guru_mapel', 'siswa']
  },
  {
    id: 'kas',
    label: 'Buku Kas & Iuran Kelas',
    category: 'Layanan',
    description: 'Pencatatan kas masuk/keluar, tabungan/iuran siswa mingguan, dan laporan saldo',
    defaultRoles: ['admin', 'wali_kelas', 'siswa']
  },
  {
    id: 'inventaris',
    label: 'Inventaris Ruang Kelas (KIR)',
    category: 'Administrasi',
    description: 'Kartu inventaris sarana prasarana kelas, kondisi barang, dan pelaporan',
    defaultRoles: ['admin', 'wali_kelas']
  },
  {
    id: 'konseling',
    label: 'Catatan Bimbingan & Prestasi',
    category: 'Layanan',
    description: 'Buku bimbingan perilaku, penanganan kasus, dan pencatatan piagam prestasi siswa',
    defaultRoles: ['admin', 'wali_kelas', 'siswa']
  },
  {
    id: 'import_excel',
    label: 'Import & Template Excel',
    category: 'Administrasi',
    description: 'Pusat unduh template resmi Excel (.xlsx) dan import data siswa, guru, nilai, kas & inventaris',
    defaultRoles: ['admin', 'wali_kelas', 'guru_mapel']
  },
  {
    id: 'ai_assistant',
    label: 'AI Asisten Mengajar & Rapor',
    category: 'Layanan',
    description: 'Generator modul ajar cerdas, narasi deskripsi rapor, dan penyusun soal otomatis',
    defaultRoles: ['admin', 'wali_kelas']
  },
  {
    id: 'pengaturan',
    label: 'Pengaturan, Akun & Hak Akses',
    category: 'Sistem',
    description: 'Manajemen pengguna login, matriks hak akses menu (RBAC), dan backup database',
    defaultRoles: ['admin', 'wali_kelas']
  }
];

export const INITIAL_SCHOOL_INFO: SchoolInfo = {
  npsn: '20104829',
  schoolName: 'SD NEGERI NUSANTARA 01',
  address: 'Jl. Merdeka Pendidikan No. 45, Kebayoran Baru',
  village: 'Kebayoran Baru',
  subdistrict: 'Kebayoran Baru',
  city: 'Kota Jakarta Selatan',
  province: 'DKI Jakarta',
  postalCode: '12160',
  phoneNumber: '(021) 7203491',
  email: 'sdn.nusantara01@dki.belajar.id',
  website: 'https://sdnnusantara01.sch.id',
  headmasterName: 'Drs. H. Bambang Sutrisno, M.Pd.',
  headmasterNip: '19680315 199303 1 005',
  homeroomTeacherName: 'Sri Wahyuni, S.Pd., Gr.',
  homeroomTeacherNip: '19880412 201201 2 018',
  className: 'Kelas 4A (Merdeka)',
  phase: 'Fase B (Kelas IV)',
  academicYear: '2025/2026',
  semester: '2 (Genap)',
  kurikulum: 'Kurikulum Merdeka Pembelajaran Mendalam (KMPM)',
  effectiveDaysPerWeek: 5,
  activeSchoolDays: ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'],
  tanggalRapor: 'Kota Jakarta Selatan, 20 Juni 2027',
  tanggalRaporMid: 'Kota Jakarta Selatan, 28 Maret 2027',

  // Logo & Kop Surat Configuration
  logoLeft: '',
  logoLeftPreset: 'tutwuri',
  logoLeftWidth: 72,
  showLogoLeft: true,

  logoRight: '',
  logoRightPreset: 'merdeka',
  logoRightWidth: 72,
  showLogoRight: true,

  kopLine1: 'PEMERINTAH KABUPATEN KUANTAN SINGINGI',
  kopLine2: 'DINAS PENDIDIKAN DAN KEBUDAYAAN',
  kopBorderStyle: 'double'
};

export const INITIAL_STUDENTS: Student[] = [
  {
    id: 'sis-01',
    nisn: '0123849102',
    nis: '4021',
    nama: 'Ahmad Fauzi Rahman',
    jenisKelamin: 'L',
    tempatLahir: 'Jakarta',
    tanggalLahir: '2015-04-12',
    agama: 'Islam',
    alamat: 'Jl. Pangeran Antasari No. 12, Jakarta Selatan',
    namaAyah: 'Hendra Gunawan',
    namaIbu: 'Siti Maryam',
    pekerjaanOrtu: 'Wiraswasta / Arsitek',
    noHpOrtu: '0812-8921-3301',
    fotoUrl: 'https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?w=150&auto=format&fit=crop&q=80',
    status: 'Aktif',
    nomorAbsen: 1,
    kelas: '4A',
    catatanKhusus: 'Ketua Kelas 4A, aktif dalam kegiatan literasi dan dokter kecil.'
  },
  {
    id: 'sis-02',
    nisn: '0123849103',
    nis: '4022',
    nama: 'Aisyah Putri Azzahra',
    jenisKelamin: 'P',
    tempatLahir: 'Bandung',
    tanggalLahir: '2015-06-25',
    agama: 'Islam',
    alamat: 'Jl. Fatmawati Raya No. 45, Jakarta Selatan',
    namaAyah: 'Rahmat Hidayat',
    namaIbu: 'Nurhasanah',
    pekerjaanOrtu: 'PNS Guru',
    noHpOrtu: '0813-1122-4455',
    fotoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    status: 'Aktif',
    nomorAbsen: 2,
    kelas: '4A',
    catatanKhusus: 'Sangat berbakat di bidang seni tari dan Bahasa Indonesia.'
  },
  {
    id: 'sis-03',
    nisn: '0123849104',
    nis: '4023',
    nama: 'Budi Santoso',
    jenisKelamin: 'L',
    tempatLahir: 'Surakarta',
    tanggalLahir: '2015-01-18',
    agama: 'Islam',
    alamat: 'Jl. Cipete Utara No. 8, Jakarta Selatan',
    namaAyah: 'Joko Santoso',
    namaIbu: 'Sri Mulyani',
    pekerjaanOrtu: 'Karyawan Swasta',
    noHpOrtu: '0857-4433-2211',
    fotoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    status: 'Aktif',
    nomorAbsen: 3,
    kelas: '4A',
    catatanKhusus: 'Juara 2 Catur Tingkat Kecamatan, antusias dalam Matematika.'
  },
  {
    id: 'sis-04',
    nisn: '0123849105',
    nis: '4024',
    nama: 'Citra Dewi Lestari',
    jenisKelamin: 'P',
    tempatLahir: 'Jakarta',
    tanggalLahir: '2015-09-03',
    agama: 'Kristen',
    alamat: 'Jl. Gandaria Tengah II No. 19, Jakarta Selatan',
    namaAyah: 'Samuel Lestari',
    namaIbu: 'Maria Natalia',
    pekerjaanOrtu: 'Akuntan',
    noHpOrtu: '0818-0909-8877',
    fotoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    status: 'Aktif',
    nomorAbsen: 4,
    kelas: '4A',
    catatanKhusus: 'Sekretaris kelas yang rapi, mahir dalam membaca puisi.'
  },
  {
    id: 'sis-05',
    nisn: '0123849106',
    nis: '4025',
    nama: 'Dimas Anggara Saputra',
    jenisKelamin: 'L',
    tempatLahir: 'Bogor',
    tanggalLahir: '2015-03-14',
    agama: 'Islam',
    alamat: 'Jl. Radio Dalam No. 33, Jakarta Selatan',
    namaAyah: 'Bambang Saputra',
    namaIbu: 'Kartika Sari',
    pekerjaanOrtu: 'Wirausaha Kuliner',
    noHpOrtu: '0821-3344-5566',
    fotoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    status: 'Aktif',
    nomorAbsen: 5,
    kelas: '4A',
    catatanKhusus: 'Anggota tim inti sepak bola SD, disiplin dan solutif.'
  },
  {
    id: 'sis-06',
    nisn: '0123849107',
    nis: '4026',
    nama: 'Farhan Maulana Malik',
    jenisKelamin: 'L',
    tempatLahir: 'Jakarta',
    tanggalLahir: '2015-11-20',
    agama: 'Islam',
    alamat: 'Jl. Haji Nawi No. 14, Jakarta Selatan',
    namaAyah: 'Malik Ibrahim',
    namaIbu: 'Fatimah',
    pekerjaanOrtu: 'Teknisi Komputer',
    noHpOrtu: '0812-7788-9900',
    fotoUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    status: 'Aktif',
    nomorAbsen: 6,
    kelas: '4A',
    catatanKhusus: 'Sangat berminat pada sains, eksperimen IPAS dan coding robotik dasar.'
  },
  {
    id: 'sis-07',
    nisn: '0123849108',
    nis: '4027',
    nama: 'Gita Maharani',
    jenisKelamin: 'P',
    tempatLahir: 'Semarang',
    tanggalLahir: '2015-08-10',
    agama: 'Islam',
    alamat: 'Jl. Darmawangsa X No. 5, Jakarta Selatan',
    namaAyah: 'Sugeng Widodo',
    namaIbu: 'Endang Purwanti',
    pekerjaanOrtu: 'Dokter Gigi',
    noHpOrtu: '0813-9988-7766',
    fotoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    status: 'Aktif',
    nomorAbsen: 7,
    kelas: '4A',
    catatanKhusus: 'Bendahara kelas yang teliti dan ramah.'
  },
  {
    id: 'sis-08',
    nisn: '0123849109',
    nis: '4028',
    nama: 'I Made Raditya Wibawa',
    jenisKelamin: 'L',
    tempatLahir: 'Denpasar',
    tanggalLahir: '2015-05-02',
    agama: 'Hindu',
    alamat: 'Jl. Wijaya Kusuma No. 27, Jakarta Selatan',
    namaAyah: 'I Wayan Sudira',
    namaIbu: 'Ni Ketut Astuti',
    pekerjaanOrtu: 'Seniman / Arsitek Lansekap',
    noHpOrtu: '0817-6655-4433',
    fotoUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80',
    status: 'Aktif',
    nomorAbsen: 8,
    kelas: '4A',
    catatanKhusus: 'Juara menggambar poster tingkat kota, ramah dan supel.'
  },
  {
    id: 'sis-09',
    nisn: '0123849110',
    nis: '4029',
    nama: 'Kevin Jonathan Tan',
    jenisKelamin: 'L',
    tempatLahir: 'Jakarta',
    tanggalLahir: '2015-12-08',
    agama: 'Buddha',
    alamat: 'Jl. Panglima Polim Raya No. 89, Jakarta Selatan',
    namaAyah: 'David Jonathan',
    namaIbu: 'Susanti Tan',
    pekerjaanOrtu: 'Pengusaha Ekspedisi',
    noHpOrtu: '0812-4455-6677',
    fotoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    status: 'Aktif',
    nomorAbsen: 9,
    kelas: '4A',
    catatanKhusus: 'Sangat aktif dalam percakapan Bahasa Inggris dan matematika mental.'
  },
  {
    id: 'sis-10',
    nisn: '0123849111',
    nis: '4030',
    nama: 'Nadia Zahra Kamila',
    jenisKelamin: 'P',
    tempatLahir: 'Yogyakarta',
    tanggalLahir: '2015-02-19',
    agama: 'Islam',
    alamat: 'Jl. Barito II No. 11, Jakarta Selatan',
    namaAyah: 'dr. Agus Setiawan, Sp.A',
    namaIbu: 'Ratna Kartika',
    pekerjaanOrtu: 'Dokter Spesialis Anak',
    noHpOrtu: '0811-2233-4455',
    fotoUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80',
    status: 'Aktif',
    nomorAbsen: 10,
    kelas: '4A',
    catatanKhusus: 'Juara olimpiade sains SD dan fasih melafalkan ayat suci Al-Qur\'an.'
  },
  {
    id: 'sis-11',
    nisn: '0123849112',
    nis: '4031',
    nama: 'Rizky Pratama Yudha',
    jenisKelamin: 'L',
    tempatLahir: 'Jakarta',
    tanggalLahir: '2015-07-30',
    agama: 'Islam',
    alamat: 'Jl. Melawai Raya No. 62, Jakarta Selatan',
    namaAyah: 'Yudha Pratama',
    namaIbu: 'Dian Anggraini',
    pekerjaanOrtu: 'Wartawan Media Nasional',
    noHpOrtu: '0856-1122-3344',
    fotoUrl: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=150&auto=format&fit=crop&q=80',
    status: 'Aktif',
    nomorAbsen: 11,
    kelas: '4A',
    catatanKhusus: 'Memiliki kemampuan vokal musik dan menyanyi lagu-lagu nasional yang baik.'
  },
  {
    id: 'sis-12',
    nisn: '0123849113',
    nis: '4032',
    nama: 'Tiara Anindya Putri',
    jenisKelamin: 'P',
    tempatLahir: 'Surabaya',
    tanggalLahir: '2015-10-15',
    agama: 'Islam',
    alamat: 'Jl. Kramat Pela No. 4, Jakarta Selatan',
    namaAyah: 'Anwar Sadat',
    namaIbu: 'Maya Kusuma',
    pekerjaanOrtu: 'Apoteker',
    noHpOrtu: '0878-5566-7788',
    fotoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    status: 'Aktif',
    nomorAbsen: 12,
    kelas: '4A',
    catatanKhusus: 'Penjaga pojok bacaan kelas, rajin merangkum isi buku bacaan.'
  }
];

export const INITIAL_SUBJECTS: Subject[] = [
  {
    id: 'mapel-05',
    kode: 'PAI',
    nama: 'Pendidikan Agama & Budi Pekerti',
    kelompok: 'Umum',
    kktp: 78,
    guruPengampu: 'Ust. Ahmad Fauzan, S.Pd.I',
    iconName: 'HeartHandshake'
  },
  {
    id: 'mapel-01',
    kode: 'PPKn',
    nama: 'Pendidikan Pancasila',
    kelompok: 'Umum',
    kktp: 75,
    guruPengampu: 'Sri Wahyuni, S.Pd., Gr.',
    iconName: 'ShieldCheck'
  },
  {
    id: 'mapel-02',
    kode: 'BIN',
    nama: 'Bahasa Indonesia',
    kelompok: 'Umum',
    kktp: 75,
    guruPengampu: 'Sri Wahyuni, S.Pd., Gr.',
    iconName: 'BookOpen'
  },
  {
    id: 'mapel-03',
    kode: 'MAT',
    nama: 'Matematika',
    kelompok: 'Umum',
    kktp: 70,
    guruPengampu: 'Sri Wahyuni, S.Pd., Gr.',
    iconName: 'Calculator'
  },
  {
    id: 'mapel-04',
    kode: 'IPAS',
    nama: 'Ilmu Pengetahuan Alam & Sosial (IPAS)',
    kelompok: 'Umum',
    kktp: 72,
    guruPengampu: 'Sri Wahyuni, S.Pd., Gr.',
    iconName: 'Compass'
  },
  {
    id: 'mapel-06',
    kode: 'PJOK',
    nama: 'Pendidikan Jasmani, Olahraga, & Kesehatan',
    kelompok: 'Umum',
    kktp: 75,
    guruPengampu: 'Wahyu Hidayat, S.Pd.Jas',
    iconName: 'Activity'
  },
  {
    id: 'mapel-07',
    kode: 'SENI',
    nama: 'Seni Rupa & Prakarya',
    kelompok: 'Pilihan',
    kktp: 75,
    guruPengampu: 'Sri Wahyuni, S.Pd., Gr.',
    iconName: 'Palette'
  },
  {
    id: 'mapel-08',
    kode: 'ING',
    nama: 'Bahasa Inggris',
    kelompok: 'Muatan Lokal',
    kktp: 70,
    guruPengampu: 'Miss Clarissa Melinda, S.Pd.',
    iconName: 'Languages'
  },
  {
    id: 'mapel-09',
    kode: 'PLBJ',
    nama: 'Pendidikan Lingkungan & Budaya Jakarta',
    kelompok: 'Muatan Lokal',
    kktp: 75,
    guruPengampu: 'Sri Wahyuni, S.Pd., Gr.',
    iconName: 'Building2'
  }
];

export const INITIAL_TUJUAN_PEMBELAJARAN: TujuanPembelajaran[] = [
  // PPKn (mapel-01)
  {
    id: 'tp-ppkn-01',
    mapelId: 'mapel-01',
    kode: 'TP 1',
    lingkupMateri: 'Bab 1: Pancasila Sebagai Nilai Kehidupan',
    deskripsi: 'Menjelaskan makna dan keterkaitan sila-sila Pancasila dalam kehidupan sehari-hari.',
    semester: '1 (Ganjil)',
    fase: 'Fase B (Kelas 4)',
    kktp: 75,
    ringkasanRaporTuntas: 'Sangat menguasai pemahaman makna dan keterkaitan sila-sila Pancasila',
    ringkasanRaporPerluBimbingan: 'Perlu bimbingan dalam menerapkan nilai sila-sila Pancasila sehari-hari'
  },
  {
    id: 'tp-ppkn-02',
    mapelId: 'mapel-01',
    kode: 'TP 2',
    lingkupMateri: 'Bab 1: Penerapan Nilai Pancasila',
    deskripsi: 'Menerapkan nilai-nilai Pancasila di lingkungan keluarga, sekolah, dan masyarakat.',
    semester: '1 (Ganjil)',
    fase: 'Fase B (Kelas 4)',
    kktp: 75,
    ringkasanRaporTuntas: 'Menunjukkan penerapan nilai Pancasila di lingkungan sekolah secara konsisten',
    ringkasanRaporPerluBimbingan: 'Perlu pembiasaan dalam mengamalkan nilai gotong royong dan musyawarah'
  },
  {
    id: 'tp-ppkn-03',
    mapelId: 'mapel-01',
    kode: 'TP 3',
    lingkupMateri: 'Bab 2: Konstitusi & Norma',
    deskripsi: 'Mengidentifikasi aturan, hak, dan kewajiban sebagai peserta didik dan anggota keluarga.',
    semester: '1 (Ganjil)',
    fase: 'Fase B (Kelas 4)',
    kktp: 75,
    ringkasanRaporTuntas: 'Mampu membedakan hak dan kewajiban di rumah serta di sekolah dengan tepat',
    ringkasanRaporPerluBimbingan: 'Perlu bimbingan dalam menjalankan kewajiban piket dan tata tertib kelas'
  },
  {
    id: 'tp-ppkn-04',
    mapelId: 'mapel-01',
    kode: 'TP 4',
    lingkupMateri: 'Bab 2: Musyawarah dan Mufakat',
    deskripsi: 'Menyampaikan pendapat secara santun dan menghargai perbedaan pendapat dalam musyawarah kelas.',
    semester: '1 (Ganjil)',
    fase: 'Fase B (Kelas 4)',
    kktp: 75,
    ringkasanRaporTuntas: 'Aktif berpartisipasi dan santun dalam musyawarah penyelesaian masalah kelas',
    ringkasanRaporPerluBimbingan: 'Perlu dorongan rasa percaya diri saat menyampaikan argumen musyawarah'
  },

  // Bahasa Indonesia (mapel-02)
  {
    id: 'tp-bin-01',
    mapelId: 'mapel-02',
    kode: 'TP 1',
    lingkupMateri: 'Bab 1: Menyimak & Teks Narasi',
    deskripsi: 'Memahami ide pokok dan ide pendukung dari teks narasi yang dibacakan.',
    semester: '1 (Ganjil)',
    fase: 'Fase B (Kelas 4)',
    kktp: 75,
    ringkasanRaporTuntas: 'Sangat terampil menemukan gagasan pokok dan tokoh utama teks narasi',
    ringkasanRaporPerluBimbingan: 'Perlu latihan membedakan gagasan pokok dengan kalimat penjelas'
  },
  {
    id: 'tp-bin-02',
    mapelId: 'mapel-02',
    kode: 'TP 2',
    lingkupMateri: 'Bab 2: Kosakata & Kamus (KBBI)',
    deskripsi: 'Menggunakan kosakata baru bermakna denotatif dan konotatif serta mencari arti kata di kamus.',
    semester: '1 (Ganjil)',
    fase: 'Fase B (Kelas 4)',
    kktp: 75,
    ringkasanRaporTuntas: 'Kaya akan penguasaan kosakata baru dan mandiri dalam membuka kamus/KBBI',
    ringkasanRaporPerluBimbingan: 'Perlu bimbingan dalam menelusuri kata dasar dan makna imbuhan'
  },
  {
    id: 'tp-bin-03',
    mapelId: 'mapel-02',
    kode: 'TP 3',
    lingkupMateri: 'Bab 3: Kalimat Majemuk & Wawancara',
    deskripsi: 'Menulis teks deskripsi sederhana dan melakukan wawancara singkat dengan narasumber.',
    semester: '1 (Ganjil)',
    fase: 'Fase B (Kelas 4)',
    kktp: 75,
    ringkasanRaporTuntas: 'Mampu menyusun kalimat laporan deskriptif runtut dengan tanda baca tepat',
    ringkasanRaporPerluBimbingan: 'Perlu bimbingan dalam merangkai kalimat majemuk bertingkat'
  },
  {
    id: 'tp-bin-04',
    mapelId: 'mapel-02',
    kode: 'TP 4',
    lingkupMateri: 'Bab 4: Teks Prosedur & Presentasi',
    deskripsi: 'Menyajikan teks prosedur langkah-langkah membuat sesuatu secara lisan dan tulisan.',
    semester: '1 (Ganjil)',
    fase: 'Fase B (Kelas 4)',
    kktp: 75,
    ringkasanRaporTuntas: 'Percaya diri mempresentasikan teks petunjuk/prosedur di depan teman sekelas',
    ringkasanRaporPerluBimbingan: 'Perlu latihan menyusun urutan langkah teks petunjuk secara kronologis'
  },

  // Matematika (mapel-03)
  {
    id: 'tp-mat-01',
    mapelId: 'mapel-03',
    kode: 'TP 1',
    lingkupMateri: 'Bab 1: Bilangan Cacah sampai 10.000',
    deskripsi: 'Membaca, menulis, menentukan nilai tempat, dan membandingkan bilangan cacah sampai 10.000.',
    semester: '1 (Ganjil)',
    fase: 'Fase B (Kelas 4)',
    kktp: 70,
    ringkasanRaporTuntas: 'Sangat mahir membaca, menulis, dan mengurutkan bilangan cacah puluhan ribu',
    ringkasanRaporPerluBimbingan: 'Perlu pendampingan dalam menentukan nilai tempat ribuan dan ratusan'
  },
  {
    id: 'tp-mat-02',
    mapelId: 'mapel-03',
    kode: 'TP 2',
    lingkupMateri: 'Bab 1: Operasi Hitung Campuran',
    deskripsi: 'Menyelesaikan operasi penjumlahan, pengurangan, perkalian, dan pembagian bilangan cacah.',
    semester: '1 (Ganjil)',
    fase: 'Fase B (Kelas 4)',
    kktp: 70,
    ringkasanRaporTuntas: 'Cepat dan teliti dalam perhitungan perkalian susun dan pembagian bersusun (porogapit)',
    ringkasanRaporPerluBimbingan: 'Perlu penguatan konsep dasar pembagian bersusun panjang'
  },
  {
    id: 'tp-mat-03',
    mapelId: 'mapel-03',
    kode: 'TP 3',
    lingkupMateri: 'Bab 2: Pecahan Senilai & Desimal',
    deskripsi: 'Membandingkan pecahan senilai dengan gambar dan mengubah bentuk pecahan biasa ke desimal.',
    semester: '1 (Ganjil)',
    fase: 'Fase B (Kelas 4)',
    kktp: 70,
    ringkasanRaporTuntas: 'Memahami konsep pecahan senilai dan konversi desimal dengan visualisasi konkret',
    ringkasanRaporPerluBimbingan: 'Perlu bantuan dalam menyederhanakan pecahan berpenyebut tidak sama'
  },
  {
    id: 'tp-mat-04',
    mapelId: 'mapel-03',
    kode: 'TP 4',
    lingkupMateri: 'Bab 3: Pola Gambar & Bilangan',
    deskripsi: 'Mengidentifikasi, menduplikasi, dan mengembangkan pola bilangan membesar dan mengecil.',
    semester: '1 (Ganjil)',
    fase: 'Fase B (Kelas 4)',
    kktp: 70,
    ringkasanRaporTuntas: 'Sangat tanggap menemukan keteraturan relasi rumus pola barisan bilangan',
    ringkasanRaporPerluBimbingan: 'Perlu latihan dalam menganalisis selisih deret pola gambar'
  },

  // IPAS (mapel-04)
  {
    id: 'tp-ipas-01',
    mapelId: 'mapel-04',
    kode: 'TP 1',
    lingkupMateri: 'Bab 1: Tumbuhan Sumber Kehidupan',
    deskripsi: 'Mengidentifikasi bagian tubuh tumbuhan (akar, batang, daun, bunga) dan fungsinya dalam fotosintesis.',
    semester: '1 (Ganjil)',
    fase: 'Fase B (Kelas 4)',
    kktp: 72,
    ringkasanRaporTuntas: 'Sangat memahami anatomi organ tumbuhan serta proses fotosintesis',
    ringkasanRaporPerluBimbingan: 'Perlu bimbingan dalam menjelaskan fungsi stomata dan klorofil'
  },
  {
    id: 'tp-ipas-02',
    mapelId: 'mapel-04',
    kode: 'TP 2',
    lingkupMateri: 'Bab 2: Wujud Zat & Perubahannya',
    deskripsi: 'Menganalisis karakteristik zat padat, cair, gas serta perubahan wujud benda dalam kehidupan.',
    semester: '1 (Ganjil)',
    fase: 'Fase B (Kelas 4)',
    kktp: 72,
    ringkasanRaporTuntas: 'Mampu membuktikan perubahan wujud zat melalui eksperimen sederhana mandiri',
    ringkasanRaporPerluBimbingan: 'Perlu bimbingan dalam membedakan proses menyublim dan mengkristal'
  },
  {
    id: 'tp-ipas-03',
    mapelId: 'mapel-04',
    kode: 'TP 3',
    lingkupMateri: 'Bab 3: Gaya di Sekitar Kita',
    deskripsi: 'Mengidentifikasi ragam gaya (otot, gesek, magnet, gravitasi) dan pengaruhnya terhadap gerak benda.',
    semester: '1 (Ganjil)',
    fase: 'Fase B (Kelas 4)',
    kktp: 72,
    ringkasanRaporTuntas: 'Sangat paham prinsip interaksi gaya gesek dan percepatan gerak benda',
    ringkasanRaporPerluBimbingan: 'Perlu latihan soal kontekstual pengaruh gaya magnetik dan gravitasi'
  },
  {
    id: 'tp-ipas-04',
    mapelId: 'mapel-04',
    kode: 'TP 4',
    lingkupMateri: 'Bab 4: Energi yang Berubah',
    deskripsi: 'Menjelaskan konsep transformasi energi (energi gerak, listrik, panas, cahaya, bunyi).',
    semester: '1 (Ganjil)',
    fase: 'Fase B (Kelas 4)',
    kktp: 72,
    ringkasanRaporTuntas: 'Mampu memetakan alur perubahan bentuk energi pada piranti teknologi sekitar',
    ringkasanRaporPerluBimbingan: 'Perlu bimbingan dalam membedakan sumber energi terbarukan dan fosil'
  },

  // PAI (mapel-05) - Islam
  {
    id: 'tp-pai-01',
    mapelId: 'mapel-05',
    kode: 'TP 1',
    lingkupMateri: 'Bab 1: Al-Qur’an Surat Al-Hujurat: 13',
    deskripsi: 'Membaca, menghafal, dan memahami pesan pokok keragaman sebagai sunnatullah.',
    semester: '1 (Ganjil)',
    fase: 'Fase B (Kelas 4)',
    kktp: 78,
    ringkasanRaporTuntas: 'Fasih membaca Al-Qur’an dengan tajwid yang baik dan hafal arti surat',
    ringkasanRaporPerluBimbingan: 'Perlu pembiasaan makhraj huruf dan hukum bacaan ikhfa/idgham',
    agama: 'Islam'
  },
  {
    id: 'tp-pai-02',
    mapelId: 'mapel-05',
    kode: 'TP 2',
    lingkupMateri: 'Bab 2: Asmaul Husna (Al-Malik, Al-Quddus)',
    deskripsi: 'Meneladani sifat-sifat mulia Allah Swt dalam Asmaul Husna dalam perilaku terpuji sehari-hari.',
    semester: '1 (Ganjil)',
    fase: 'Fase B (Kelas 4)',
    kktp: 78,
    ringkasanRaporTuntas: 'Berakhlak mulia dan mampu mengaitkan asmaul husna dengan kebersihan hati',
    ringkasanRaporPerluBimbingan: 'Perlu dorongan dalam mengamalkan perilaku rendah hati dan ikhlas',
    agama: 'Islam'
  },
  {
    id: 'tp-pai-03',
    mapelId: 'mapel-05',
    kode: 'TP 3',
    lingkupMateri: 'Bab 3: Indahnya Saling Menghargai & Sikap Toleransi',
    deskripsi: 'Menjelaskan arti keragaman suku dan agama serta menerapkan sikap toleransi antarsesama.',
    semester: '1 (Ganjil)',
    fase: 'Fase B (Kelas 4)',
    kktp: 78,
    ringkasanRaporTuntas: 'Sangat santun dan konsisten menunjukkan sikap toleransi antarteman',
    ringkasanRaporPerluBimbingan: 'Perlu pembiasaan sikap saling menghargai perbedaan pendapat',
    agama: 'Islam'
  },
  {
    id: 'tp-pai-04',
    mapelId: 'mapel-05',
    kode: 'TP 4',
    lingkupMateri: 'Bab 4: Ketentuan dan Tata Cara Shalat Berjamaah',
    deskripsi: 'Mempraktikkan ketentuan shalat berjamaah, posisi imam dan makmum, serta adab di masjid.',
    semester: '1 (Ganjil)',
    fase: 'Fase B (Kelas 4)',
    kktp: 78,
    ringkasanRaporTuntas: 'Tertib mempraktikkan tata cara shalat berjamaah dan adab di masjid',
    ringkasanRaporPerluBimbingan: 'Perlu bimbingan dalam bacaan doa setelah shalat fardhu',
    agama: 'Islam'
  },

  // PAK (mapel-05) - Kristen
  {
    id: 'tp-pak-01',
    mapelId: 'mapel-05',
    kode: 'TP 1',
    lingkupMateri: 'Bab 1: Mensyukuri Kebaikan Allah dalam Ciptaan',
    deskripsi: 'Mensyukuri kemurahan dan kebaikan Allah melalui alam ciptaan-Nya serta keberagaman sesama manusia sebagai wujud kasih-Nya.',
    semester: '1 (Ganjil)',
    fase: 'Fase B (Kelas 4)',
    kktp: 78,
    ringkasanRaporTuntas: 'Mampu mensyukuri kebaikan Allah atas alam ciptaan-Nya dan mengasihi sesama tanpa membeda-bedakan',
    ringkasanRaporPerluBimbingan: 'Perlu bimbingan dalam merawat lingkungan sebagai ungkapan syukur atas ciptaan Tuhan',
    agama: 'Kristen'
  },
  {
    id: 'tp-pak-02',
    mapelId: 'mapel-05',
    kode: 'TP 2',
    lingkupMateri: 'Bab 2: Meneladani Kasih dan Pengampunan Kristus',
    deskripsi: 'Meneladani keteladanan Yesus Kristus dalam mengasihi, mengampuni kesalahan sesama, dan bersikap rendah hati dalam pergaulan.',
    semester: '1 (Ganjil)',
    fase: 'Fase B (Kelas 4)',
    kktp: 78,
    ringkasanRaporTuntas: 'Meneladani kasih Kristus dengan berlapang dada memaafkan dan suka menolong teman',
    ringkasanRaporPerluBimbingan: 'Perlu pembiasaan untuk bersabar dan tulus memaafkan saat terjadi perselisihan antarteman',
    agama: 'Kristen'
  },
  {
    id: 'tp-pak-03',
    mapelId: 'mapel-05',
    kode: 'TP 3',
    lingkupMateri: 'Bab 3: Hidup Rukun dan Toleran di Tengah Perbedaan',
    deskripsi: 'Mempraktikkan hidup rukun, bersikap toleran terhadap teman yang berbeda agama/budaya, dan menciptakan suasana damai sejahtera.',
    semester: '1 (Ganjil)',
    fase: 'Fase B (Kelas 4)',
    kktp: 78,
    ringkasanRaporTuntas: 'Aktif mempraktikkan hidup rukun dan menghargai keragaman teman di sekolah dan rumah',
    ringkasanRaporPerluBimbingan: 'Perlu pembiasaan untuk lebih aktif bergaul dan berempati dengan teman yang berbeda latar belakang',
    agama: 'Kristen'
  },
  {
    id: 'tp-pak-04',
    mapelId: 'mapel-05',
    kode: 'TP 4',
    lingkupMateri: 'Bab 4: Kedisiplinan Berdoa dan Membaca Alkitab',
    deskripsi: 'Memahami makna ibadah, membiasakan doa harian, membaca Kitab Suci Alkitab, serta mengekspresikan syukur dalam kehidupan beriman.',
    semester: '1 (Ganjil)',
    fase: 'Fase B (Kelas 4)',
    kktp: 78,
    ringkasanRaporTuntas: 'Tertib dan khidmat dalam berdoa harian serta gemar membaca renungan Alkitab',
    ringkasanRaporPerluBimbingan: 'Perlu dorongan untuk lebih disiplin dalam meluangkan waktu berdoa dan membaca firman Tuhan',
    agama: 'Kristen'
  },

  // PAKat (mapel-05) - Katolik
  {
    id: 'tp-pakat-01',
    mapelId: 'mapel-05',
    kode: 'TP 1',
    lingkupMateri: 'Bab 1: Aku Pribadi Unik Citra Allah (Imago Dei)',
    deskripsi: 'Mengagumi dan mensyukuri diri sebagai pribadi unik yang diciptakan Allah menurut citra-Nya (Imago Dei) dengan talenta istimewa.',
    semester: '1 (Ganjil)',
    fase: 'Fase B (Kelas 4)',
    kktp: 78,
    ringkasanRaporTuntas: 'Percaya diri mensyukuri keunikan dirinya dan menghargai talenta anugerah Allah pada sesama',
    ringkasanRaporPerluBimbingan: 'Perlu dorongan untuk lebih percaya diri dalam mengekspresikan potensi dan bakat diri',
    agama: 'Katolik'
  },
  {
    id: 'tp-pakat-02',
    mapelId: 'mapel-05',
    kode: 'TP 2',
    lingkupMateri: 'Bab 2: Meneladani Yesus Mewartakan Kerajaan Allah',
    deskripsi: 'Meneladani pribadi Yesus Kristus yang mewartakan Kerajaan Allah melalui perbuatan kasih, belas kasih kepada kaum lemah, dan kejujuran.',
    semester: '1 (Ganjil)',
    fase: 'Fase B (Kelas 4)',
    kktp: 78,
    ringkasanRaporTuntas: 'Meneladani belas kasih Yesus dengan peduli dan menolong teman yang kesulitan',
    ringkasanRaporPerluBimbingan: 'Perlu pendampingan dalam menumbuhkan empati dan kepekaan sosial terhadap teman sebaya',
    agama: 'Katolik'
  },
  {
    id: 'tp-pakat-03',
    mapelId: 'mapel-05',
    kode: 'TP 3',
    lingkupMateri: 'Bab 3: Membangun Persaudaraan Sejati di Tengah Keragaman',
    deskripsi: 'Mengembangkan sikap hormat terhadap keragaman agama, suku, dan budaya serta aktif mewujudkan persaudaraan sejati yang harmonis.',
    semester: '1 (Ganjil)',
    fase: 'Fase B (Kelas 4)',
    kktp: 78,
    ringkasanRaporTuntas: 'Sangat ramah dan aktif membangun persaudaraan sejati tanpa membedakan suku dan agama',
    ringkasanRaporPerluBimbingan: 'Perlu pembiasaan sikap terbuka dan menghargai keragaman tradisi teman',
    agama: 'Katolik'
  },
  {
    id: 'tp-pakat-04',
    mapelId: 'mapel-05',
    kode: 'TP 4',
    lingkupMateri: 'Bab 4: Sakramen Gereja dan Kehidupan Doa Katolik',
    deskripsi: 'Mengenal sakramen-sakramen inisiasi Gereja Katolik, tata perayaan Ekaristi, dan tekun dalam doa harian bersama keluarga.',
    semester: '1 (Ganjil)',
    fase: 'Fase B (Kelas 4)',
    kktp: 78,
    ringkasanRaporTuntas: 'Memahami makna sakramen Gereja dan tertib mengikuti perayaan Ekaristi dengan khidmat',
    ringkasanRaporPerluBimbingan: 'Perlu bimbingan dalam menghafal doa-doa pokok Katolik dan tata gerak liturgi',
    agama: 'Katolik'
  },

  // PAH (mapel-05) - Hindu
  {
    id: 'tp-pah-01',
    mapelId: 'mapel-05',
    kode: 'TP 1',
    lingkupMateri: 'Bab 1: Panca Sradha sebagai Fondasi Keyakinan',
    deskripsi: 'Memahami dan meyakini ajaran Panca Sradha (Brahman, Atman, Karmaphala, Samsara, Moksha) sebagai fondasi keimanan umat Hindu.',
    semester: '1 (Ganjil)',
    fase: 'Fase B (Kelas 4)',
    kktp: 78,
    ringkasanRaporTuntas: 'Memahami ajaran Panca Sradha dan meyakini kemahakuasaan Hyang Widhi Wasa dengan tulus',
    ringkasanRaporPerluBimbingan: 'Perlu penguatan pemahaman konsep lima keyakinan Panca Sradha secara runtut',
    agama: 'Hindu'
  },
  {
    id: 'tp-pah-02',
    mapelId: 'mapel-05',
    kode: 'TP 2',
    lingkupMateri: 'Bab 2: Pengamalan Ajaran Tri Kaya Parisudha',
    deskripsi: 'Menerapkan ajaran Tri Kaya Parisudha (Manacika/berpikir baik, Wacika/berkata baik, Kayika/berbuat baik) dalam kehidupan sehari-hari.',
    semester: '1 (Ganjil)',
    fase: 'Fase B (Kelas 4)',
    kktp: 78,
    ringkasanRaporTuntas: 'Konsisten berucap santun, berpikir positif, dan berbuat baik sesuai Tri Kaya Parisudha',
    ringkasanRaporPerluBimbingan: 'Perlu pembiasaan mengendalikan ucapan dan perilaku agar selaras dengan nilai kebajikan',
    agama: 'Hindu'
  },
  {
    id: 'tp-pah-03',
    mapelId: 'mapel-05',
    kode: 'TP 3',
    lingkupMateri: 'Bab 3: Sembahyang Tri Sandhya dan Dainika Upasana',
    deskripsi: 'Mempraktikkan tata cara sembahyang Tri Sandhya dengan sikap asana, pranayama, dan doa sehari-hari (Dainika Upasana) secara tertib.',
    semester: '1 (Ganjil)',
    fase: 'Fase B (Kelas 4)',
    kktp: 78,
    ringkasanRaporTuntas: 'Tertib dan khusyuk mempraktikkan mantram Tri Sandhya serta doa sehari-hari',
    ringkasanRaporPerluBimbingan: 'Perlu bimbingan dalam pengucapan lafal mantram Tri Sandhya yang benar',
    agama: 'Hindu'
  },
  {
    id: 'tp-pah-04',
    mapelId: 'mapel-05',
    kode: 'TP 4',
    lingkupMateri: 'Bab 4: Nilai Dharma dan Ajaran Tat Twam Asi',
    deskripsi: 'Meneladani nilai-nilai Dharma, mengamalkan ajaran Tat Twam Asi (ia adalah kamu), serta menjunjung tinggi toleransi kerukunan antarsesama.',
    semester: '1 (Ganjil)',
    fase: 'Fase B (Kelas 4)',
    kktp: 78,
    ringkasanRaporTuntas: 'Mengamalkan nilai Tat Twam Asi dengan penuh rasa persaudaraan dan toleransi antarteman',
    ringkasanRaporPerluBimbingan: 'Perlu pembiasaan empati untuk saling mengasihi sesama makhluk ciptaan Tuhan',
    agama: 'Hindu'
  },

  // PAB (mapel-05) - Buddha
  {
    id: 'tp-pab-01',
    mapelId: 'mapel-05',
    kode: 'TP 1',
    lingkupMateri: 'Bab 1: Meneladani Sifat Luhur Tiratana (Tri Ratna)',
    deskripsi: 'Memahami dan meneladani sifat-sifat luhur Buddha, Dhamma, dan Sangha (Tiratana) sebagai perlindungan utama dalam kehidupan.',
    semester: '1 (Ganjil)',
    fase: 'Fase B (Kelas 4)',
    kktp: 78,
    ringkasanRaporTuntas: 'Menghayati sifat luhur Tiratana dan menunjukkan rasa hormat yang mendalam kepada Triratna',
    ringkasanRaporPerluBimbingan: 'Perlu penguatan pemahaman akan makna perlindungan Tiratana dalam kehidupan sehari-hari',
    agama: 'Buddha'
  },
  {
    id: 'tp-pab-02',
    mapelId: 'mapel-05',
    kode: 'TP 2',
    lingkupMateri: 'Bab 2: Pengamalan Pancasila Buddhis sebagai Moralitas',
    deskripsi: 'Menerapkan lima sila dalam Pancasila Buddhis (tidak membunuh, tidak mencuri, tidak berbuat asusila, tidak berdusta, tidak mabuk) sebagai pedoman hidup.',
    semester: '1 (Ganjil)',
    fase: 'Fase B (Kelas 4)',
    kktp: 78,
    ringkasanRaporTuntas: 'Mampu mempraktikkan Pancasila Buddhis dengan menjaga kejujuran dan welas asih antarmakhluk',
    ringkasanRaporPerluBimbingan: 'Perlu pembiasaan disiplin moral dan kehati-hatian dalam bertutur kata jujur',
    agama: 'Buddha'
  },
  {
    id: 'tp-pab-03',
    mapelId: 'mapel-05',
    kode: 'TP 3',
    lingkupMateri: 'Bab 3: Kebaktian Puja Bakti dan Meditasi Bhavana',
    deskripsi: 'Mempraktikkan kebaktian Puja Bakti, membaca paritta/gatha dengan hormat, serta meditasi pernapasan (Anapanasati) untuk ketenangan batin.',
    semester: '1 (Ganjil)',
    fase: 'Fase B (Kelas 4)',
    kktp: 78,
    ringkasanRaporTuntas: 'Khidmat dalam kebaktian Puja Bakti dan tenang berkonsentrasi saat latihan meditasi',
    ringkasanRaporPerluBimbingan: 'Perlu bimbingan ketenangan duduk dan pelafalan paritta suci dengan khidmat',
    agama: 'Buddha'
  },
  {
    id: 'tp-pab-04',
    mapelId: 'mapel-05',
    kode: 'TP 4',
    lingkupMateri: 'Bab 4: Cinta Kasih (Metta) dan Welas Asih (Karuna)',
    deskripsi: 'Mengembangkan empat sifat luhur batin (Brahmavihara: Metta/cinta kasih, Karuna/kasih sayang, Mudita/simpati, Upekkha/keseimbangan batin).',
    semester: '1 (Ganjil)',
    fase: 'Fase B (Kelas 4)',
    kktp: 78,
    ringkasanRaporTuntas: 'Sangat ramah, berbelas kasih (Karuna), dan peduli tanpa membedakan sesama makhluk',
    ringkasanRaporPerluBimbingan: 'Perlu pembiasaan memancarkan pikiran cinta kasih saat menghadapi situasi yang kurang menyenangkan',
    agama: 'Buddha'
  },

  // PAKho (mapel-05) - Konghucu
  {
    id: 'tp-pakho-01',
    mapelId: 'mapel-05',
    kode: 'TP 1',
    lingkupMateri: 'Bab 1: Meyakini Tian Yang Maha Esa dan Kebajikan (De)',
    deskripsi: 'Meyakini dan mensyukuri kemahakuasaan Tian Yang Maha Esa serta benih kebajikan (De) yang dianugerahkan kepada setiap manusia.',
    semester: '1 (Ganjil)',
    fase: 'Fase B (Kelas 4)',
    kktp: 78,
    ringkasanRaporTuntas: 'Mampu mensyukuri anugerah Kebajikan dari Tian dan membiasakan hidup selaras dengan alam',
    ringkasanRaporPerluBimbingan: 'Perlu penguatan pemahaman makna rasa syukur kepada Tian dalam keseharian',
    agama: 'Konghucu'
  },
  {
    id: 'tp-pakho-02',
    mapelId: 'mapel-05',
    kode: 'TP 2',
    lingkupMateri: 'Bab 2: Pengamalan Lima Sifat Mulia (Wu Chang)',
    deskripsi: 'Memahami dan mengamalkan Lima Sifat Mulia (Wu Chang: Ren/cinta kasih, Yi/kebenaran, Li/kesusilaan, Zhi/kebijaksanaan, Xin/dapat dipercaya).',
    semester: '1 (Ganjil)',
    fase: 'Fase B (Kelas 4)',
    kktp: 78,
    ringkasanRaporTuntas: 'Menunjukkan perilaku yang dapat dipercaya (Xin) dan menjunjung tinggi kesusilaan (Li)',
    ringkasanRaporPerluBimbingan: 'Perlu pembiasaan bersikap adil dan menjaga integritas kejujuran saat bermain bersama',
    agama: 'Konghucu'
  },
  {
    id: 'tp-pakho-03',
    mapelId: 'mapel-05',
    kode: 'TP 3',
    lingkupMateri: 'Bab 3: Laku Bakti (Xiao) dan Adab Sopan Santun',
    deskripsi: 'Mempraktikkan laku bakti kepada orang tua (Xiao), menghormati guru dan orang yang lebih tua, serta menjaga tata krama pergaulan.',
    semester: '1 (Ganjil)',
    fase: 'Fase B (Kelas 4)',
    kktp: 78,
    ringkasanRaporTuntas: 'Sangat berbakti kepada orang tua dan bertutur kata santun penuh tata krama',
    ringkasanRaporPerluBimbingan: 'Perlu pembiasaan untuk lebih sabar dan mendengarkan bimbingan orang tua di rumah',
    agama: 'Konghucu'
  },
  {
    id: 'tp-pakho-04',
    mapelId: 'mapel-05',
    kode: 'TP 4',
    lingkupMateri: 'Bab 4: Keteladanan Nabi Kongzi dalam Belajar',
    deskripsi: 'Meneladani keteladanan Nabi Kongzi dalam ketekunan menuntut ilmu, gemar bertanya, kerendahan hati, dan tiada jemu membimbing sesama.',
    semester: '1 (Ganjil)',
    fase: 'Fase B (Kelas 4)',
    kktp: 78,
    ringkasanRaporTuntas: 'Tekun belajar dan tidak jemu menuntut ilmu sesuai teladan luhur Nabi Kongzi',
    ringkasanRaporPerluBimbingan: 'Perlu dorongan untuk lebih antusias dan aktif bertanya hal yang belum dipahami',
    agama: 'Konghucu'
  },

  // PJOK (mapel-06)
  {
    id: 'tp-pjok-01',
    mapelId: 'mapel-06',
    kode: 'TP 1',
    lingkupMateri: 'Aktivitas Pola Gerak Dasar Lokomotor',
    deskripsi: 'Mempraktikkan variasi pola gerak dasar jalan, lari, lompat, dan loncat dengan koordinasi baik.',
    semester: '1 (Ganjil)',
    fase: 'Fase B (Kelas 4)',
    kktp: 75,
    ringkasanRaporTuntas: 'Memiliki kelincahan fisik dan koordinasi motorik lokomotor yang prima',
    ringkasanRaporPerluBimbingan: 'Perlu pembinaan ritme pernapasan dan ketahanan saat lari estafet'
  },
  {
    id: 'tp-pjok-02',
    mapelId: 'mapel-06',
    kode: 'TP 2',
    lingkupMateri: 'Permainan Bola Besar & Kecil',
    deskripsi: 'Mempraktikkan keterampilan manipulatif menendang, mengoper bola, dan kerja sama tim sportif.',
    semester: '1 (Ganjil)',
    fase: 'Fase B (Kelas 4)',
    kktp: 75,
    ringkasanRaporTuntas: 'Menunjukkan sportivitas tinggi dan penguasaan teknik dasar operan bola',
    ringkasanRaporPerluBimbingan: 'Perlu latihan kontrol akurasi tendangan dan kekompakan tim'
  },
  {
    id: 'tp-pjok-03',
    mapelId: 'mapel-06',
    kode: 'TP 3',
    lingkupMateri: 'Aktivitas Senam Lantai & Kebugaran Jasmani',
    deskripsi: 'Mempraktikkan variasi gerak bertumpu, bergantung, keseimbangan, dan berguling senam lantai.',
    semester: '1 (Ganjil)',
    fase: 'Fase B (Kelas 4)',
    kktp: 75,
    ringkasanRaporTuntas: 'Sangat lentur dan percaya diri saat mempraktikkan gerakan guling lentik senam',
    ringkasanRaporPerluBimbingan: 'Perlu latihan bertahap pada penguatan tumpuan tangan guling depan'
  },
  {
    id: 'tp-pjok-04',
    mapelId: 'mapel-06',
    kode: 'TP 4',
    lingkupMateri: 'Kesehatan Pribadi & Pola Hidup Bersih',
    deskripsi: 'Mengenal bagian tubuh yang boleh dan tidak boleh disentuh serta kebersihan alat reproduksi.',
    semester: '1 (Ganjil)',
    fase: 'Fase B (Kelas 4)',
    kktp: 75,
    ringkasanRaporTuntas: 'Paham pentingnya menjaga kebersihan diri dan kesehatan lingkungan',
    ringkasanRaporPerluBimbingan: 'Perlu pembiasaan konsumsi makanan bergizi seimbang setiap hari'
  },

  // Seni Rupa (mapel-07)
  {
    id: 'tp-seni-01',
    mapelId: 'mapel-07',
    kode: 'TP 1',
    lingkupMateri: 'Eksplorasi Garis, Bentuk & Warna',
    deskripsi: 'Menciptakan komposisi gambar kreatif dengan memadukan unsur garis, bidang, tekstur, dan warna primer-sekunder.',
    semester: '1 (Ganjil)',
    fase: 'Fase B (Kelas 4)',
    kktp: 75,
    ringkasanRaporTuntas: 'Kreatif dalam memadukan gradasi warna dan eksplorasi bentuk geometris',
    ringkasanRaporPerluBimbingan: 'Perlu bimbingan dalam teknik arsiran bayangan dan ketebalan garis'
  },
  {
    id: 'tp-seni-02',
    mapelId: 'mapel-07',
    kode: 'TP 2',
    lingkupMateri: 'Kreasi Tekstur dan Cetak Cap Alami',
    deskripsi: 'Membuat karya seni cetak cap menggunakan bahan alam (daun, pelepah pisang, umbi-umbian).',
    semester: '1 (Ganjil)',
    fase: 'Fase B (Kelas 4)',
    kktp: 75,
    ringkasanRaporTuntas: 'Sangat mahir merangkai pola cetak cap bahan alami menjadi motif estetis',
    ringkasanRaporPerluBimbingan: 'Perlu ketelitian dalam meratakan ketebalan cat pada permukaan cap'
  },
  {
    id: 'tp-seni-03',
    mapelId: 'mapel-07',
    kode: 'TP 3',
    lingkupMateri: 'Prinsip Keseimbangan dan Pola Organis',
    deskripsi: 'Menggambar dekoratif dengan memperhatikan prinsip irama, proporsi, dan keseimbangan simetris/asimetris.',
    semester: '1 (Ganjil)',
    fase: 'Fase B (Kelas 4)',
    kktp: 75,
    ringkasanRaporTuntas: 'Mampu menyusun proporsi gambar dekoratif simetris secara rapi dan seimbang',
    ringkasanRaporPerluBimbingan: 'Perlu latihan dalam membuat sketsa awal bidang organis'
  },
  {
    id: 'tp-seni-04',
    mapelId: 'mapel-07',
    kode: 'TP 4',
    lingkupMateri: 'Kreasi Seni Kriya dan Daur Ulang',
    deskripsi: 'Merancang dan membuat karya 3 dimensi dari bahan daur ulang (kardus, botol plastik) secara fungsional.',
    semester: '1 (Ganjil)',
    fase: 'Fase B (Kelas 4)',
    kktp: 75,
    ringkasanRaporTuntas: 'Inovatif mendaur ulang limbah plastik menjadi benda hias yang bernilai guna',
    ringkasanRaporPerluBimbingan: 'Perlu pendampingan dalam kerapian perekatan dan pemotongan bahan kriya'
  },

  // Bahasa Inggris (mapel-08)
  {
    id: 'tp-ing-01',
    mapelId: 'mapel-08',
    kode: 'TP 1',
    lingkupMateri: 'Unit 1: What Are You Doing? (Activities)',
    deskripsi: 'Expressing present continuous activities and daily classroom routines in simple English phrases.',
    semester: '1 (Ganjil)',
    fase: 'Fase B (Kelas 4)',
    kktp: 70,
    ringkasanRaporTuntas: 'Fluent in speaking basic everyday classroom commands and verbs',
    ringkasanRaporPerluBimbingan: 'Needs practice with English pronunciation and spelling verbs'
  },
  {
    id: 'tp-ing-02',
    mapelId: 'mapel-08',
    kode: 'TP 2',
    lingkupMateri: 'Unit 2: Numbers & Time in Daily Routine',
    deskripsi: 'Telling time, counting numbers up to 100, and describing daily schedules in simple English.',
    semester: '1 (Ganjil)',
    fase: 'Fase B (Kelas 4)',
    kktp: 70,
    ringkasanRaporTuntas: 'Able to tell time accurately and express hourly schedules in English',
    ringkasanRaporPerluBimbingan: 'Needs assistance in using half-past and quarter-to phrases'
  },
  {
    id: 'tp-ing-03',
    mapelId: 'mapel-08',
    kode: 'TP 3',
    lingkupMateri: 'Unit 3: My Family and Rooms in the House',
    deskripsi: 'Identifying family members, describing rooms in a house, and using prepositions of place.',
    semester: '1 (Ganjil)',
    fase: 'Fase B (Kelas 4)',
    kktp: 70,
    ringkasanRaporTuntas: 'Confidently names family relations and describes household locations',
    ringkasanRaporPerluBimbingan: 'Needs practice differentiating prepositions like between and behind'
  },
  {
    id: 'tp-ing-04',
    mapelId: 'mapel-08',
    kode: 'TP 4',
    lingkupMateri: 'Unit 4: Describing Animals and Favorite Foods',
    deskripsi: 'Describing characteristics of animals and expressing food likes and dislikes in simple dialogues.',
    semester: '1 (Ganjil)',
    fase: 'Fase B (Kelas 4)',
    kktp: 70,
    ringkasanRaporTuntas: 'Active in short conversational dialogues about favorite animals and snacks',
    ringkasanRaporPerluBimbingan: 'Needs guidance in forming full sentences with like/dislike'
  },

  // PLBJ (mapel-09)
  {
    id: 'tp-plbj-01',
    mapelId: 'mapel-09',
    kode: 'TP 1',
    lingkupMateri: 'Bab 1: Lagu & Gerak Tari Sirih Kuning',
    deskripsi: 'Mengenal sejarah, menyanyikan lagu Sirih Kuning, dan mempraktikkan ragam gerak tari Betawi.',
    semester: '1 (Ganjil)',
    fase: 'Fase B (Kelas 4)',
    kktp: 75,
    ringkasanRaporTuntas: 'Hafal syair lagu Sirih Kuning dan luwes memperagakan tarian khas Betawi',
    ringkasanRaporPerluBimbingan: 'Perlu bimbingan dalam tempo ketukan musik dan kelenturan gerak'
  },
  {
    id: 'tp-plbj-02',
    mapelId: 'mapel-09',
    kode: 'TP 2',
    lingkupMateri: 'Bab 2: Kuliner Khas Betawi (Bir Pletok & Kerak Telor)',
    deskripsi: 'Mengenal bahan rempah, sejarah, dan proses pembuatan minuman tradisional Bir Pletok khas Betawi.',
    semester: '1 (Ganjil)',
    fase: 'Fase B (Kelas 4)',
    kktp: 75,
    ringkasanRaporTuntas: 'Sangat paham khasiat ragam rempah dan sejarah kuliner tradisional Betawi',
    ringkasanRaporPerluBimbingan: 'Perlu pendampingan dalam mengidentifikasi jenis rempah kapulaga dan kayu manis'
  },
  {
    id: 'tp-plbj-03',
    mapelId: 'mapel-09',
    kode: 'TP 3',
    lingkupMateri: 'Bab 3: Rumah Adat Kebaya & Ornamen Gigi Balang',
    deskripsi: 'Menggambar dan menjelaskan makna filosofis arsitektur rumah adat Kebaya dan ornamen Gigi Balang.',
    semester: '1 (Ganjil)',
    fase: 'Fase B (Kelas 4)',
    kktp: 75,
    ringkasanRaporTuntas: 'Mampu menggambar motif Gigi Balang dengan rapi dan memahami makna kejujuran',
    ringkasanRaporPerluBimbingan: 'Perlu bimbingan dalam membedakan bagian paseban dan pangkeng rumah adat'
  },
  {
    id: 'tp-plbj-04',
    mapelId: 'mapel-09',
    kode: 'TP 4',
    lingkupMateri: 'Bab 4: Permainan Tradisional Betawi',
    deskripsi: 'Mempraktikkan aturan dan nilai sportivitas dalam permainan tradisional Keripik Jengkol dan Cingciripit.',
    semester: '1 (Ganjil)',
    fase: 'Fase B (Kelas 4)',
    kktp: 75,
    ringkasanRaporTuntas: 'Sportif dan tangkas saat bermain permainan tradisional bersama kelompok',
    ringkasanRaporPerluBimbingan: 'Perlu dorongan kekompakan tim saat permainan Keripik Jengkol'
  },

  // -------------------------------------------------------------
  // TUJUAN PEMBELAJARAN (TP) RESMI SEMESTER 2 (GENAP) - FASE B
  // -------------------------------------------------------------
  // Pendidikan Pancasila (PPKn - mapel-01) Semester 2
  {
    id: 'tp-ppkn-s2-01',
    mapelId: 'mapel-01',
    kode: 'TP 1',
    lingkupMateri: 'Bab 3: Membangun Jati Diri dalam Kebhinekaan',
    deskripsi: 'Mengidentifikasi keragaman identitas diri, keluarga, dan teman sesuai budaya, suku bangsa, dan agama.',
    semester: '2 (Genap)',
    fase: 'Fase B (Kelas 4)',
    kktp: 75,
    ringkasanRaporTuntas: 'Sangat menghargai keragaman suku, budaya, dan identitas teman sekelas',
    ringkasanRaporPerluBimbingan: 'Perlu bimbingan dalam mengenal kekhasan budaya suku lain di Indonesia'
  },
  {
    id: 'tp-ppkn-s2-02',
    mapelId: 'mapel-01',
    kode: 'TP 2',
    lingkupMateri: 'Bab 3: Menghargai Keragaman di Lingkungan Sekitar',
    deskripsi: 'Menerapkan sikap toleransi, persaudaraan, dan gotong royong di tengah keberagaman lingkungan sekolah.',
    semester: '2 (Genap)',
    fase: 'Fase B (Kelas 4)',
    kktp: 75,
    ringkasanRaporTuntas: 'Aktif bergotong royong dan menunjukkan sikap toleransi antarsesama',
    ringkasanRaporPerluBimbingan: 'Perlu pembiasaan sikap saling menghargai saat berdiskusi kelompok'
  },
  {
    id: 'tp-ppkn-s2-03',
    mapelId: 'mapel-01',
    kode: 'TP 3',
    lingkupMateri: 'Bab 4: Negaraku Kesatuan Republik Indonesia (NKRI)',
    deskripsi: 'Mengidentifikasi batas wilayah desa/kelurahan, kecamatan, dan kabupaten/kota sebagai bagian NKRI.',
    semester: '2 (Genap)',
    fase: 'Fase B (Kelas 4)',
    kktp: 75,
    ringkasanRaporTuntas: 'Mampu memetakan susunan wilayah administratif tempat tinggalnya dengan benar',
    ringkasanRaporPerluBimbingan: 'Perlu pemahaman lebih lanjut tentang pembagian wilayah administratif'
  },
  {
    id: 'tp-ppkn-s2-04',
    mapelId: 'mapel-01',
    kode: 'TP 4',
    lingkupMateri: 'Bab 4: Menjaga Persatuan & Keutuhan NKRI',
    deskripsi: 'Menunjukkan contoh perilaku menjaga persatuan dan keutuhan NKRI dalam kehidupan sehari-hari.',
    semester: '2 (Genap)',
    fase: 'Fase B (Kelas 4)',
    kktp: 75,
    ringkasanRaporTuntas: 'Konsisten menunjukkan cinta tanah air dan menjaga keharmonisan kelas',
    ringkasanRaporPerluBimbingan: 'Perlu dorongan untuk lebih aktif dalam kegiatan peringatan hari nasional'
  },

  // Bahasa Indonesia (BIN - mapel-02) Semester 2
  {
    id: 'tp-bin-s2-01',
    mapelId: 'mapel-02',
    kode: 'TP 1',
    lingkupMateri: 'Bab 5: Bertukar atau Membayar (Literasi Keuangan)',
    deskripsi: 'Memahami ide pokok teks narasi/informasi sejarah uang dan menggunakan istilah nilai mata uang serta menabung.',
    semester: '2 (Genap)',
    fase: 'Fase B (Kelas 4)',
    kktp: 75,
    ringkasanRaporTuntas: 'Sangat paham fungsi nilai uang dan mampu menulis pengalaman menabung mandiri',
    ringkasanRaporPerluBimbingan: 'Perlu latihan membedakan kebutuhan dan keinginan dalam penggunaan uang'
  },
  {
    id: 'tp-bin-s2-02',
    mapelId: 'mapel-02',
    kode: 'TP 2',
    lingkupMateri: 'Bab 6: Satu Titik (Mengapresiasi Keindahan Alam)',
    deskripsi: 'Membaca puisi dan teks deskripsi bentang alam Indonesia serta menggunakan majas personifikasi dan metafora sederhana.',
    semester: '2 (Genap)',
    fase: 'Fase B (Kelas 4)',
    kktp: 75,
    ringkasanRaporTuntas: 'Kreatif menyusun bait puisi pemandangan dan fasih berdeklamasi di depan kelas',
    ringkasanRaporPerluBimbingan: 'Perlu bimbingan dalam mengenali gaya bahasa personifikasi pada puisi'
  },
  {
    id: 'tp-bin-s2-03',
    mapelId: 'mapel-02',
    kode: 'TP 3',
    lingkupMateri: 'Bab 7: Asal-Usul (Ragam Budaya & Naskah Wawancara)',
    deskripsi: 'Menyusun daftar pertanyaan dan mempraktikkan wawancara sederhana mengenai tradisi dan kearifan lokal.',
    semester: '2 (Genap)',
    fase: 'Fase B (Kelas 4)',
    kktp: 75,
    ringkasanRaporTuntas: 'Percaya diri melakukan wawancara dengan narasumber menggunakan kalimat efektif',
    ringkasanRaporPerluBimbingan: 'Perlu latihan dalam merumuskan pertanyaan wawancara dengan kata tanya Mengapa/Bagaimana'
  },
  {
    id: 'tp-bin-s2-04',
    mapelId: 'mapel-02',
    kode: 'TP 4',
    lingkupMateri: 'Bab 8: Sehatlah Ragaku (Laporan Investigasi)',
    deskripsi: 'Menulis teks laporan hasil pengamatan pola hidup sehat dan menyajikan informasi dalam bentuk infografis.',
    semester: '2 (Genap)',
    fase: 'Fase B (Kelas 4)',
    kktp: 75,
    ringkasanRaporTuntas: 'Mampu menyusun laporan observasi kesehatan lingkungan sekolah dengan rapi dan runtut',
    ringkasanRaporPerluBimbingan: 'Perlu bimbingan dalam menyusun kerangka tulisan laporan pengamatan'
  },

  // Matematika (MAT - mapel-03) Semester 2
  {
    id: 'tp-mat-s2-01',
    mapelId: 'mapel-03',
    kode: 'TP 1',
    lingkupMateri: 'Bab 5: Bangun Datar dan Ciri-Ciri Geometris',
    deskripsi: 'Mengidentifikasi berbagai bentuk bangun datar (segitiga, segi empat) berdasarkan sifat sisi dan sudutnya.',
    semester: '2 (Genap)',
    fase: 'Fase B (Kelas 4)',
    kktp: 70,
    ringkasanRaporTuntas: 'Sangat terampil menganalisis sifat rusuk, simetri lipat, dan sudut bangun datar',
    ringkasanRaporPerluBimbingan: 'Perlu bimbingan dalam mengukur besar sudut menggunakan busur derajat'
  },
  {
    id: 'tp-mat-s2-02',
    mapelId: 'mapel-03',
    kode: 'TP 2',
    lingkupMateri: 'Bab 6: Piktogram & Diagram Batang',
    deskripsi: 'Menyajikan dan menginterpretasikan data hasil pengukuran atau sensus kelas ke dalam diagram batang.',
    semester: '2 (Genap)',
    fase: 'Fase B (Kelas 4)',
    kktp: 70,
    ringkasanRaporTuntas: 'Mahir membaca dan menggambar diagram batang data frekuensi dengan skala presisi',
    ringkasanRaporPerluBimbingan: 'Perlu latihan dalam menentukan sumbu horizontal dan vertikal pada diagram'
  },
  {
    id: 'tp-mat-s2-03',
    mapelId: 'mapel-03',
    kode: 'TP 3',
    lingkupMateri: 'Bab 7: Pecahan Desimal & Nilai Tempat',
    deskripsi: 'Menyatakan pecahan persepuluhan dan perseratusan ke dalam bentuk desimal serta membandingkan nilainya.',
    semester: '2 (Genap)',
    fase: 'Fase B (Kelas 4)',
    kktp: 70,
    ringkasanRaporTuntas: 'Cepat dan tepat dalam mengubah pecahan biasa ke desimal dan mengurutkan nilai desimal',
    ringkasanRaporPerluBimbingan: 'Perlu pendampingan pada operasi penjumlahan pecahan desimal'
  },
  {
    id: 'tp-mat-s2-04',
    mapelId: 'mapel-03',
    kode: 'TP 4',
    lingkupMateri: 'Bab 8: Pengukuran Luas & Volume Satuan Baku',
    deskripsi: 'Mengukur luas bangun datar dengan petak satuan dan menghitung volume kubus/balok menggunakan kubus satuan.',
    semester: '2 (Genap)',
    fase: 'Fase B (Kelas 4)',
    kktp: 70,
    ringkasanRaporTuntas: 'Memahami konsep luas area permukaan dan mampu menghitung volume secara mandiri',
    ringkasanRaporPerluBimbingan: 'Perlu latihan menghitung luas bangun gabungan dengan petak persegi'
  },

  // IPAS (mapel-04) Semester 2
  {
    id: 'tp-ipas-s2-01',
    mapelId: 'mapel-04',
    kode: 'TP 1',
    lingkupMateri: 'Bab 5: Cerita Tentang Daerahku',
    deskripsi: 'Menceritakan perkembangan sejarah asal-usul daerah tempat tinggal dan tokoh sejarah lokal.',
    semester: '2 (Genap)',
    fase: 'Fase B (Kelas 4)',
    kktp: 72,
    ringkasanRaporTuntas: 'Fasih mengisahkan sejarah lokal dan peninggalan kerajaan di daerah asalnya',
    ringkasanRaporPerluBimbingan: 'Perlu bimbingan dalam mengurutkan linimasa peristiwa sejarah daerah'
  },
  {
    id: 'tp-ipas-s2-02',
    mapelId: 'mapel-04',
    kode: 'TP 2',
    lingkupMateri: 'Bab 6: Indonesiaku Kaya Budaya',
    deskripsi: 'Mengidentifikasi warisan kearifan lokal, rumah adat, tarian tradisional, dan pakaian daerah nusantara.',
    semester: '2 (Genap)',
    fase: 'Fase B (Kelas 4)',
    kktp: 72,
    ringkasanRaporTuntas: 'Bangga dan menguasai wawasan keragaman warisan budaya nusantara',
    ringkasanRaporPerluBimbingan: 'Perlu pembiasaan mengenal kekhasan budaya suku-suku di luar pulau Jawa'
  },
  {
    id: 'tp-ipas-s2-03',
    mapelId: 'mapel-04',
    kode: 'TP 3',
    lingkupMateri: 'Bab 7: Bagaimana Mendapatkan Semua Keperluan Kita',
    deskripsi: 'Menganalisis alur kegiatan ekonomi (produksi, distribusi, konsumsi) dan profesi pelaku ekonomi di masyarakat.',
    semester: '2 (Genap)',
    fase: 'Fase B (Kelas 4)',
    kktp: 72,
    ringkasanRaporTuntas: 'Sangat paham alur rantai distribusi barang dari produsen hingga konsumen',
    ringkasanRaporPerluBimbingan: 'Perlu bimbingan dalam membedakan peranan agen, distributor, dan pengecer'
  },
  {
    id: 'tp-ipas-s2-04',
    mapelId: 'mapel-04',
    kode: 'TP 4',
    lingkupMateri: 'Bab 8: Membangun Masyarakat yang Beradab',
    deskripsi: 'Membedakan norma tertulis dan tidak tertulis serta mematuhi peraturan hukum di lingkungan masyarakat.',
    semester: '2 (Genap)',
    fase: 'Fase B (Kelas 4)',
    kktp: 72,
    ringkasanRaporTuntas: 'Tertib mematuhi tata tertib dan memiliki kesadaran hukum sosial yang tinggi',
    ringkasanRaporPerluBimbingan: 'Perlu penguatan pemahaman mengenai sanksi pelanggaran norma kesopanan'
  },

  // PAI (mapel-05) Semester 2
  {
    id: 'tp-pai-s2-01',
    mapelId: 'mapel-05',
    kode: 'TP 1',
    lingkupMateri: 'Bab 6: Kisah Nabi Muhammad SAW Membangun Madinah',
    deskripsi: 'Meneladani peristiwa hijrah Rasulullah saw dan persaudaraan kaum Muhajirin serta Anshar.',
    semester: '2 (Genap)',
    fase: 'Fase B (Kelas 4)',
    kktp: 78,
    ringkasanRaporTuntas: 'Menghayati nilai perjuangan Nabi Muhammad saw dalam mempersaudarakan sesama',
    ringkasanRaporPerluBimbingan: 'Perlu penguatan hafalan tahun dan urutan peristiwa hijrah ke Madinah',
    agama: 'Islam'
  },
  {
    id: 'tp-pai-s2-02',
    mapelId: 'mapel-05',
    kode: 'TP 2',
    lingkupMateri: 'Bab 7: Mengenal Malaikat Allah dan Tugasnya',
    deskripsi: 'Meyakini rukun iman kepada Malaikat Allah dan meneladani ketaatan para malaikat.',
    semester: '2 (Genap)',
    fase: 'Fase B (Kelas 4)',
    kktp: 78,
    ringkasanRaporTuntas: 'Hafal 10 nama malaikat beserta tugasnya dan bersikap waspada berbuat kebaikan',
    ringkasanRaporPerluBimbingan: 'Perlu bimbingan dalam memasangkan nama malaikat Munkar, Nakir, dan Malik',
    agama: 'Islam'
  },
  {
    id: 'tp-pai-s2-03',
    mapelId: 'mapel-05',
    kode: 'TP 3',
    lingkupMateri: 'Bab 8: Mari Berperilaku Terpuji (Salam & Senyum)',
    deskripsi: 'Menerapkan adab bertamu, menebarkan salam, dan gemar menolong teman tanpa pamrih.',
    semester: '2 (Genap)',
    fase: 'Fase B (Kelas 4)',
    kktp: 78,
    ringkasanRaporTuntas: 'Santun, murah senyum, dan terbiasa mengucapkan salam saat berpapasan',
    ringkasanRaporPerluBimbingan: 'Perlu dorongan untuk berinisiatif menolong teman yang sedang kesulitan',
    agama: 'Islam'
  },
  {
    id: 'tp-pai-s2-04',
    mapelId: 'mapel-05',
    kode: 'TP 4',
    lingkupMateri: 'Bab 9: Ketentuan Shalat Jumat & Shalat Dhuha',
    deskripsi: 'Memahami tata cara shalat Jumat, adab mendengarkan khutbah, dan shalat sunnah Dhuha.',
    semester: '2 (Genap)',
    fase: 'Fase B (Kelas 4)',
    kktp: 78,
    ringkasanRaporTuntas: 'Khidmat mendengarkan khutbah Jumat dan rutin menjalankan shalat dhuha di sekolah',
    ringkasanRaporPerluBimbingan: 'Perlu pembiasaan tertib tidak berbicara saat khutbah Jumat berlangsung',
    agama: 'Islam'
  },

  // PJOK (mapel-06) Semester 2
  {
    id: 'tp-pjok-s2-01',
    mapelId: 'mapel-06',
    kode: 'TP 1',
    lingkupMateri: 'Aktivitas Senam Lantai & Keseimbangan Statis',
    deskripsi: 'Mempraktikkan variasi guling depan, sikap lilin, dan kayang dengan keselamatan terjamin.',
    semester: '2 (Genap)',
    fase: 'Fase B (Kelas 4)',
    kktp: 75,
    ringkasanRaporTuntas: 'Sangat lentur dan percaya diri mempraktikkan gerakan guling depan di atas matras',
    ringkasanRaporPerluBimbingan: 'Perlu pendampingan dalam menjaga tumpuan tengkuk saat guling depan'
  },
  {
    id: 'tp-pjok-s2-02',
    mapelId: 'mapel-06',
    kode: 'TP 2',
    lingkupMateri: 'Aktivitas Gerak Berirama (Senam SKJ)',
    deskripsi: 'Mempraktikkan gerak langkah kaki dan ayunan lengan berirama mengikuti ketukan musik.',
    semester: '2 (Genap)',
    fase: 'Fase B (Kelas 4)',
    kktp: 75,
    ringkasanRaporTuntas: 'Kompak dan lincah mengikuti ritme ketukan musik senam berirama',
    ringkasanRaporPerluBimbingan: 'Perlu latihan keselarasan antara ayunan lengan dan langkah kaki'
  },
  {
    id: 'tp-pjok-s2-03',
    mapelId: 'mapel-06',
    kode: 'TP 3',
    lingkupMateri: 'Aktivitas Kebugaran & Daya Tahan Tubuh',
    deskripsi: 'Mempraktikkan latihan kekuatan otot (push-up, sit-up) dan kelincahan lari zig-zag.',
    semester: '2 (Genap)',
    fase: 'Fase B (Kelas 4)',
    kktp: 75,
    ringkasanRaporTuntas: 'Memiliki stamina fisik yang tangguh dan prima saat tes kebugaran jasmani',
    ringkasanRaporPerluBimbingan: 'Perlu latihan teratur untuk meningkatkan kekuatan otot lengan'
  },
  {
    id: 'tp-pjok-s2-04',
    mapelId: 'mapel-06',
    kode: 'TP 4',
    lingkupMateri: 'Pemeliharaan Kebersihan Alat Reproduksi & Pola Hidup Sehat',
    deskripsi: 'Menerapkan cara merawat kebersihan pakaian dalam dan mengenali makanan bergizi seimbang.',
    semester: '2 (Genap)',
    fase: 'Fase B (Kelas 4)',
    kktp: 75,
    ringkasanRaporTuntas: 'Sangat paham prinsip kebersihan higienis pribadi dan memilih jajanan sehat',
    ringkasanRaporPerluBimbingan: 'Perlu pembiasaan mencuci tangan memakai sabun sebelum makan'
  },

  // Seni Rupa (mapel-07) Semester 2
  {
    id: 'tp-seni-s2-01',
    mapelId: 'mapel-07',
    kode: 'TP 1',
    lingkupMateri: 'Anyaman Tradisional Kertas & Bahan Alam',
    deskripsi: 'Membuat anyaman pola tunggal dan ganda menggunakan kertas warna atau daun kelapa.',
    semester: '2 (Genap)',
    fase: 'Fase B (Kelas 4)',
    kktp: 75,
    ringkasanRaporTuntas: 'Karya anyaman sangat rapi, berpola teratur, dan memiliki kombinasi warna apik',
    ringkasanRaporPerluBimbingan: 'Perlu ketelitian dalam memasukkan lungsi dan pakan pada pola anyaman'
  },
  {
    id: 'tp-seni-s2-02',
    mapelId: 'mapel-07',
    kode: 'TP 2',
    lingkupMateri: 'Mengenal Motif Batik Tradisional Nusantara',
    deskripsi: 'Menggambar ragam hias motif batik kawung atau parang pada bidang kertas gambar.',
    semester: '2 (Genap)',
    fase: 'Fase B (Kelas 4)',
    kktp: 75,
    ringkasanRaporTuntas: 'Kreatif menggambar motif batik nusantara dengan proporsi bidang yang simetris',
    ringkasanRaporPerluBimbingan: 'Perlu latihan dalam membuat garis lengkung motif batik agar lebih luwes'
  },
  {
    id: 'tp-seni-s2-03',
    mapelId: 'mapel-07',
    kode: 'TP 3',
    lingkupMateri: 'Karya Seni 3 Dimensi dari Bahan Bekas (Daur Ulang)',
    deskripsi: 'Menciptakan model patung atau diorama dari kardus, botol plastik, dan barang bekas pakai.',
    semester: '2 (Genap)',
    fase: 'Fase B (Kelas 4)',
    kktp: 75,
    ringkasanRaporTuntas: 'Inovatif memanfaatkan limbah botol plastik menjadi karya seni pajang fungsional',
    ringkasanRaporPerluBimbingan: 'Perlu pendampingan dalam teknik perekatan lem pada bahan plastik'
  },
  {
    id: 'tp-seni-s2-04',
    mapelId: 'mapel-07',
    kode: 'TP 4',
    lingkupMateri: 'Pameran Kelas & Apresiasi Seni Teman',
    deskripsi: 'Menata karya seni rupa dalam pajangan galeri kelas serta mengapresiasi karya teman sekelas.',
    semester: '2 (Genap)',
    fase: 'Fase B (Kelas 4)',
    kktp: 75,
    ringkasanRaporTuntas: 'Aktif menata pameran seni dan memberikan ulasan apresiatif yang santun',
    ringkasanRaporPerluBimbingan: 'Perlu dorongan untuk berani menyampaikan komentar karya seni teman'
  },

  // Bahasa Inggris (ING - mapel-08) Semester 2
  {
    id: 'tp-ing-s2-01',
    mapelId: 'mapel-08',
    kode: 'TP 1',
    lingkupMateri: 'Unit 5: Where are You Going? (Places in School and Town)',
    deskripsi: 'Identifying names of places in town (market, hospital, school, library) in simple sentences.',
    semester: '2 (Genap)',
    fase: 'Fase B (Kelas 4)',
    kktp: 70,
    ringkasanRaporTuntas: 'Fluent in asking and telling directions to popular public places in simple English',
    ringkasanRaporPerluBimbingan: 'Needs practice with prepositions of place (next to, opposite, behind)'
  },
  {
    id: 'tp-ing-s2-02',
    mapelId: 'mapel-08',
    kode: 'TP 2',
    lingkupMateri: 'Unit 6: What Time is It? (Daily Routines)',
    deskripsi: 'Telling time using o\'clock and half past, and describing daily morning-to-night routines.',
    semester: '2 (Genap)',
    fase: 'Fase B (Kelas 4)',
    kktp: 70,
    ringkasanRaporTuntas: 'Accurately reads clock times and speaks confidently about daily schedule',
    ringkasanRaporPerluBimbingan: 'Needs guidance in using third-person singular verbs in simple present tense'
  },
  {
    id: 'tp-ing-s2-03',
    mapelId: 'mapel-08',
    kode: 'TP 3',
    lingkupMateri: 'Unit 7: I Can Play the Guitar (Talents and Hobbies)',
    deskripsi: 'Expressing abilities using modal auxiliary "can / cannot" regarding sports, music, and skills.',
    semester: '2 (Genap)',
    fase: 'Fase B (Kelas 4)',
    kktp: 70,
    ringkasanRaporTuntas: 'Expresses talents and abilities enthusiastically using modal "can/cannot"',
    ringkasanRaporPerluBimbingan: 'Needs practice in formulating interrogative sentences with "Can you...?"'
  },
  {
    id: 'tp-ing-s2-04',
    mapelId: 'mapel-08',
    kode: 'TP 4',
    lingkupMateri: 'Unit 8: Weather and Clothes (Rainy & Sunny Days)',
    deskripsi: 'Describing weather conditions (rainy, sunny, cloudy, windy) and appropriate clothing items.',
    semester: '2 (Genap)',
    fase: 'Fase B (Kelas 4)',
    kktp: 70,
    ringkasanRaporTuntas: 'Masters rich vocabulary for weather and matching seasonal clothing outfits',
    ringkasanRaporPerluBimbingan: 'Needs practice in pronouncing words ending in -y (windy, cloudy, rainy)'
  },

  // PLBJ (mapel-09) Semester 2
  {
    id: 'tp-plbj-s2-01',
    mapelId: 'mapel-09',
    kode: 'TP 1',
    lingkupMateri: 'Bab 5: Transportasi Massal Jakarta (MRT, LRT, Transjakarta)',
    deskripsi: 'Mengenal rute, aturan keselamatan, dan etika menaiki moda transportasi massal modern Jakarta.',
    semester: '2 (Genap)',
    fase: 'Fase B (Kelas 4)',
    kktp: 75,
    ringkasanRaporTuntas: 'Sangat paham tata tertib etika antre di halte dan stasiun MRT/Transjakarta',
    ringkasanRaporPerluBimbingan: 'Perlu bimbingan dalam membaca peta rute koridor Transjakarta'
  },
  {
    id: 'tp-plbj-s2-02',
    mapelId: 'mapel-09',
    kode: 'TP 2',
    lingkupMateri: 'Bab 6: Cerita Rakyat Si Pitung Tokoh Betawi',
    deskripsi: 'Meneladani nilai kejujuran, keberanian membela kebenaran, dan kegemaran mengaji Si Pitung.',
    semester: '2 (Genap)',
    fase: 'Fase B (Kelas 4)',
    kktp: 75,
    ringkasanRaporTuntas: 'Mampu menceritakan kembali kisah kepahlawanan Si Pitung dengan penuh ekspresi',
    ringkasanRaporPerluBimbingan: 'Perlu pendalaman pesan moral kepedulian sosial terhadap kaum yang lemah'
  },
  {
    id: 'tp-plbj-s2-03',
    mapelId: 'mapel-09',
    kode: 'TP 3',
    lingkupMateri: 'Bab 7: Musik Tradisional Tanjidor & Gambang Kromong',
    deskripsi: 'Mengenal aneka instrumen musik tradisional Betawi (terompet piston, tehyan, gong, gambang).',
    semester: '2 (Genap)',
    fase: 'Fase B (Kelas 4)',
    kktp: 75,
    ringkasanRaporTuntas: 'Sangat mengenal nama dan bentuk alat musik orkes Tanjidor dan Gambang Kromong',
    ringkasanRaporPerluBimbingan: 'Perlu bimbingan dalam membedakan bunyi instrumen tehyan dan sukong'
  },
  {
    id: 'tp-plbj-s2-04',
    mapelId: 'mapel-09',
    kode: 'TP 4',
    lingkupMateri: 'Bab 8: Menjaga Kelestarian Lingkungan Kali & Sungai Jakarta',
    deskripsi: 'Menerapkan aksi nyata tidak membuang sampah ke sungai dan menjaga kebersihan bantaran kali.',
    semester: '2 (Genap)',
    fase: 'Fase B (Kelas 4)',
    kktp: 75,
    ringkasanRaporTuntas: 'Peduli lingkungan hidup dan aktif memilah sampah organik/anorganik di sekolah',
    ringkasanRaporPerluBimbingan: 'Perlu pembiasaan konsisten untuk memungut sampah tercecer di lingkungan'
  }
];

// Helper to generate realistic initial grades (Standar: nilai anak di setiap TP adalah 0 per semester)
export const generateInitialGrades = (): GradeRecord[] => {
  const grades: GradeRecord[] = [];

  INITIAL_STUDENTS.forEach((student) => {
    INITIAL_SUBJECTS.forEach((subject) => {
      const types: AssessmentType[] = [
        'Formatif_TP1',
        'Formatif_TP2',
        'Formatif_TP3',
        'Formatif_TP4',
        'Sumatif_STS',
        'Sumatif_SAS'
      ];

      (['1 (Ganjil)', '2 (Genap)'] as const).forEach((sem) => {
        const semPrefix = sem === '2 (Genap)' ? 'sem2' : 'sem1';
        types.forEach((type) => {
          grades.push({
            id: `grd-${semPrefix}-${student.id}-${subject.id}-${type}`,
            siswaId: student.id,
            mapelId: subject.id,
            jenis: type,
            nilai: 0,
            semester: sem,
            capaianKompetensi: 'Perlu bimbingan dan pendampingan lebih lanjut pada penguasaan konsep dasar.'
          });
        });
      });
    });
  });

  return grades;
};

// Generate realistic attendance for Semester 1 (Juli, Agustus, September 2026)
export const generateInitialAttendance = (): AttendanceRecord[] => {
  const records: AttendanceRecord[] = [];
  const dates = [
    // Juli 2026 (Minggu Masuk KBM Awal Semester)
    '2026-07-20',
    '2026-07-21',
    '2026-07-22',
    '2026-07-23',
    '2026-07-24',
    // Agustus 2026
    '2026-08-10',
    '2026-08-11',
    '2026-08-12',
    '2026-08-13',
    '2026-08-14',
    '2026-08-17',
    // September 2026 (Bulan Berjalan)
    '2026-09-07',
    '2026-09-08',
    '2026-09-09',
    '2026-09-10',
    '2026-09-11'
  ];

  dates.forEach((date) => {
    INITIAL_STUDENTS.forEach((student) => {
      let status: 'Hadir' | 'Sakit' | 'Izin' | 'Alpa' = 'Hadir';
      let keterangan = '';

      if (date === '2026-07-22' && student.id === 'sis-08') {
        status = 'Sakit';
        keterangan = 'Demam paska imunisasi';
      } else if (date === '2026-07-24' && student.id === 'sis-15') {
        status = 'Izin';
        keterangan = 'Menemani orang tua keperluan dinas';
      } else if (date === '2026-08-12' && student.id === 'sis-05') {
        status = 'Sakit';
        keterangan = 'Demam dan flu (Surat Dokter)';
      } else if (date === '2026-08-14' && student.id === 'sis-03') {
        status = 'Izin';
        keterangan = 'Menghadiri acara keluarga ke luar kota';
      } else if (date === '2026-08-17' && student.id === 'sis-11') {
        status = 'Izin';
        keterangan = 'Izin latihan vokal persiapan lomba paduan suara';
      } else if (date === '2026-09-08' && student.id === 'sis-02') {
        status = 'Sakit';
        keterangan = 'Radang tenggorokan';
      } else if (date === '2026-09-09' && student.id === 'sis-19') {
        status = 'Alpa';
        keterangan = 'Tanpa keterangan (orang tua dihubungi)';
      } else if (date === '2026-09-11' && student.id === 'sis-24') {
        status = 'Izin';
        keterangan = 'Mewakili sekolah lomba sains tingkat kecamatan';
      }

      records.push({
        id: `att-${date}-${student.id}`,
        tanggal: date,
        siswaId: student.id,
        status,
        keterangan,
        waktuInput: `${date} 07:15:00`
      });
    });
  });

  return records;
};

export const INITIAL_JOURNALS: TeachingJournal[] = [
  {
    id: 'jrn-01',
    tanggal: '2026-08-17',
    jamKe: '1 - 2',
    mapelId: 'mapel-01',
    materi: 'Makna Simbol Sila-Sila Pancasila dalam Kehidupan Sehari-hari',
    tujuanPembelajaran: 'Peserta didik mampu mengidentifikasi dan menceritakan implementasi nilai sila ke-3 dan ke-4 Pancasila di lingkungan sekolah.',
    kegiatan: 'Diskusi kelompok studi kasus musyawarah kelas, presentasi poster pohon Pancasila, dan bermain peran (role-playing).',
    evaluasi: 'Semua siswa aktif berpartisipasi dalam diskusi. Kelompok 2 menunjukkan pemahaman sangat baik.',
    siswaTidakHadir: ['Rizky Pratama Yudha (Izin)'],
    status: 'Selesai'
  },
  {
    id: 'jrn-02',
    tanggal: '2026-08-17',
    jamKe: '3 - 4',
    mapelId: 'mapel-03',
    materi: 'Pecahan Senilai dan Operasi Penjumlahan Pecahan Berpenyebut Sama',
    tujuanPembelajaran: 'Peserta didik dapat memvisualisasikan dan menyelesaikan soal cerita penjumlahan pecahan berpenyebut sama.',
    kegiatan: 'Praktik menggunakan media kertas lipat origami warna-warni dan menyelesaikan 5 soal tantangan kontekstual.',
    evaluasi: '90% siswa tuntas KKTP (di atas 70). Dimas dan Rizky perlu pendampingan tambahan pada soal pecahan campuran.',
    siswaTidakHadir: [],
    status: 'Selesai'
  },
  {
    id: 'jrn-03',
    tanggal: '2026-08-14',
    jamKe: '1 - 3',
    mapelId: 'mapel-04',
    materi: 'Bagian Tubuh Tumbuhan dan Fungsinya (Fotosintesis)',
    tujuanPembelajaran: 'Mengamati struktur daun, batang, dan akar di kebun sekolah serta menjelaskan proses fotosintesis.',
    kegiatan: 'Outdoor learning di taman sekolah, observasi menggunakan kaca pembesar, dan pencatatan lembar kerja observasi.',
    evaluasi: 'Siswa sangat antusias dengan pembelajaran luar kelas. LKS dikumpulkan lengkap.',
    siswaTidakHadir: ['Budi Santoso (Izin)'],
    status: 'Selesai'
  },
  {
    id: 'jrn-04',
    tanggal: '2026-08-13',
    jamKe: '2 - 3',
    mapelId: 'mapel-02',
    materi: 'Menemukan Ide Pokok dan Informasi Penting dalam Teks Narasi',
    tujuanPembelajaran: 'Membaca intensif cerita rakyat "Timun Mas" dan menuliskan ide pokok tiap paragraf.',
    kegiatan: 'Membaca nyaring bergantian, membuat peta pikiran (mind map) ide pokok paragraf.',
    evaluasi: 'Aisyah dan Nadia memberikan presentasi analisis teks yang sangat runtut.',
    siswaTidakHadir: [],
    status: 'Selesai'
  }
];

export const INITIAL_SCHEDULE: ScheduleItem[] = [
  // Senin
  { id: 'sch-01', hari: 'Senin', jamKe: 1, waktu: '07:00 - 07:45', mapelId: 'mapel-01', guruPengampu: 'Upacara & Sri Wahyuni, S.Pd.', ruang: 'Lap. Upacara & Ruang 4A', warnaBadge: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-300' },
  { id: 'sch-02', hari: 'Senin', jamKe: 2, waktu: '07:45 - 08:30', mapelId: 'mapel-01', guruPengampu: 'Sri Wahyuni, S.Pd.', ruang: 'Ruang Kelas 4A', warnaBadge: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-300' },
  { id: 'sch-03', hari: 'Senin', jamKe: 3, waktu: '08:45 - 09:30', mapelId: 'mapel-03', guruPengampu: 'Sri Wahyuni, S.Pd.', ruang: 'Ruang Kelas 4A', warnaBadge: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300' },
  { id: 'sch-04', hari: 'Senin', jamKe: 4, waktu: '09:30 - 10:15', mapelId: 'mapel-03', guruPengampu: 'Sri Wahyuni, S.Pd.', ruang: 'Ruang Kelas 4A', warnaBadge: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300' },
  { id: 'sch-05', hari: 'Senin', jamKe: 5, waktu: '10:30 - 11:15', mapelId: 'mapel-07', guruPengampu: 'Sri Wahyuni, S.Pd.', ruang: 'Ruang Kesenian', warnaBadge: 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300' },
  { id: 'sch-06', hari: 'Senin', jamKe: 6, waktu: '11:15 - 12:00', mapelId: 'mapel-07', guruPengampu: 'Sri Wahyuni, S.Pd.', ruang: 'Ruang Kesenian', warnaBadge: 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300' },

  // Selasa
  { id: 'sch-07', hari: 'Selasa', jamKe: 1, waktu: '07:00 - 07:45', mapelId: 'mapel-02', guruPengampu: 'Sri Wahyuni, S.Pd.', ruang: 'Ruang Kelas 4A', warnaBadge: 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300' },
  { id: 'sch-08', hari: 'Selasa', jamKe: 2, waktu: '07:45 - 08:30', mapelId: 'mapel-02', guruPengampu: 'Sri Wahyuni, S.Pd.', ruang: 'Ruang Kelas 4A', warnaBadge: 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300' },
  { id: 'sch-09', hari: 'Selasa', jamKe: 3, waktu: '08:45 - 09:30', mapelId: 'mapel-04', guruPengampu: 'Sri Wahyuni, S.Pd.', ruang: 'Lab Sains / Kelas 4A', warnaBadge: 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300' },
  { id: 'sch-10', hari: 'Selasa', jamKe: 4, waktu: '09:30 - 10:15', mapelId: 'mapel-04', guruPengampu: 'Sri Wahyuni, S.Pd.', ruang: 'Lab Sains / Kelas 4A', warnaBadge: 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300' },
  { id: 'sch-11', hari: 'Selasa', jamKe: 5, waktu: '10:30 - 11:15', mapelId: 'mapel-08', guruPengampu: 'Miss Clarissa Melinda, S.Pd.', ruang: 'Ruang Kelas 4A', warnaBadge: 'bg-cyan-100 text-cyan-700 border-cyan-200 dark:bg-cyan-950/40 dark:text-cyan-300' },
  { id: 'sch-12', hari: 'Selasa', jamKe: 6, waktu: '11:15 - 12:00', mapelId: 'mapel-08', guruPengampu: 'Miss Clarissa Melinda, S.Pd.', ruang: 'Ruang Kelas 4A', warnaBadge: 'bg-cyan-100 text-cyan-700 border-cyan-200 dark:bg-cyan-950/40 dark:text-cyan-300' },

  // Rabu
  { id: 'sch-13', hari: 'Rabu', jamKe: 1, waktu: '07:00 - 07:45', mapelId: 'mapel-06', guruPengampu: 'Wahyu Hidayat, S.Pd.Jas', ruang: 'Lapangan Olahraga', warnaBadge: 'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-950/40 dark:text-orange-300' },
  { id: 'sch-14', hari: 'Rabu', jamKe: 2, waktu: '07:45 - 08:30', mapelId: 'mapel-06', guruPengampu: 'Wahyu Hidayat, S.Pd.Jas', ruang: 'Lapangan Olahraga', warnaBadge: 'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-950/40 dark:text-orange-300' },
  { id: 'sch-15', hari: 'Rabu', jamKe: 3, waktu: '08:45 - 09:30', mapelId: 'mapel-06', guruPengampu: 'Wahyu Hidayat, S.Pd.Jas', ruang: 'Lapangan Olahraga', warnaBadge: 'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-950/40 dark:text-orange-300' },
  { id: 'sch-16', hari: 'Rabu', jamKe: 4, waktu: '09:30 - 10:15', mapelId: 'mapel-02', guruPengampu: 'Sri Wahyuni, S.Pd.', ruang: 'Ruang Kelas 4A', warnaBadge: 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300' },
  { id: 'sch-17', hari: 'Rabu', jamKe: 5, waktu: '10:30 - 11:15', mapelId: 'mapel-09', guruPengampu: 'Sri Wahyuni, S.Pd.', ruang: 'Ruang Kelas 4A', warnaBadge: 'bg-teal-100 text-teal-700 border-teal-200 dark:bg-teal-950/40 dark:text-teal-300' },
  { id: 'sch-18', hari: 'Rabu', jamKe: 6, waktu: '11:15 - 12:00', mapelId: 'mapel-09', guruPengampu: 'Sri Wahyuni, S.Pd.', ruang: 'Ruang Kelas 4A', warnaBadge: 'bg-teal-100 text-teal-700 border-teal-200 dark:bg-teal-950/40 dark:text-teal-300' },

  // Kamis
  { id: 'sch-19', hari: 'Kamis', jamKe: 1, waktu: '07:00 - 07:45', mapelId: 'mapel-05', guruPengampu: 'Ust. Ahmad Fauzan, S.Pd.I', ruang: 'Musholla & Kelas 4A', warnaBadge: 'bg-green-100 text-green-700 border-green-200 dark:bg-green-950/40 dark:text-green-300' },
  { id: 'sch-20', hari: 'Kamis', jamKe: 2, waktu: '07:45 - 08:30', mapelId: 'mapel-05', guruPengampu: 'Ust. Ahmad Fauzan, S.Pd.I', ruang: 'Musholla & Kelas 4A', warnaBadge: 'bg-green-100 text-green-700 border-green-200 dark:bg-green-950/40 dark:text-green-300' },
  { id: 'sch-21', hari: 'Kamis', jamKe: 3, waktu: '08:45 - 09:30', mapelId: 'mapel-05', guruPengampu: 'Ust. Ahmad Fauzan, S.Pd.I', ruang: 'Musholla & Kelas 4A', warnaBadge: 'bg-green-100 text-green-700 border-green-200 dark:bg-green-950/40 dark:text-green-300' },
  { id: 'sch-22', hari: 'Kamis', jamKe: 4, waktu: '09:30 - 10:15', mapelId: 'mapel-04', guruPengampu: 'Sri Wahyuni, S.Pd.', ruang: 'Ruang Kelas 4A', warnaBadge: 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300' },
  { id: 'sch-23', hari: 'Kamis', jamKe: 5, waktu: '10:30 - 11:15', mapelId: 'mapel-03', guruPengampu: 'Sri Wahyuni, S.Pd.', ruang: 'Ruang Kelas 4A', warnaBadge: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300' },
  { id: 'sch-24', hari: 'Kamis', jamKe: 6, waktu: '11:15 - 12:00', mapelId: 'mapel-03', guruPengampu: 'Sri Wahyuni, S.Pd.', ruang: 'Ruang Kelas 4A', warnaBadge: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300' },

  // Jumat
  { id: 'sch-25', hari: 'Jumat', jamKe: 1, waktu: '07:00 - 07:45', mapelId: 'mapel-01', guruPengampu: 'Literasi & P5 Pembiasaan', ruang: 'Ruang Kelas 4A', warnaBadge: 'bg-indigo-100 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300' },
  { id: 'sch-26', hari: 'Jumat', jamKe: 2, waktu: '07:45 - 08:30', mapelId: 'mapel-02', guruPengampu: 'Sri Wahyuni, S.Pd.', ruang: 'Ruang Kelas 4A', warnaBadge: 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300' },
  { id: 'sch-27', hari: 'Jumat', jamKe: 3, waktu: '08:45 - 09:30', mapelId: 'mapel-04', guruPengampu: 'Sri Wahyuni, S.Pd.', ruang: 'Ruang Kelas 4A', warnaBadge: 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300' },
  { id: 'sch-28', hari: 'Jumat', jamKe: 4, waktu: '09:30 - 10:15', mapelId: 'mapel-01', guruPengampu: 'Pramuka Siaga / Penggalang', ruang: 'Halaman Sekolah', warnaBadge: 'bg-amber-200 text-amber-800 border-amber-300 dark:bg-amber-900/50 dark:text-amber-200' }
];

export const INITIAL_CASH_TRANSACTIONS: CashTransaction[] = [
  {
    id: 'trx-01',
    tanggal: '2026-08-01',
    jenis: 'Pemasukan',
    kategori: 'Iuran Kas Mingguan',
    jumlah: 120000,
    keterangan: 'Iuran kas minggu ke-1 bulan Agustus (12 siswa @ Rp 10.000)',
    penanggungJawab: 'Gita Maharani (Bendahara)',
    saldoSetelah: 120000
  },
  {
    id: 'trx-02',
    tanggal: '2026-08-03',
    jenis: 'Pengeluaran',
    kategori: 'ATK / Spidol',
    jumlah: 45000,
    keterangan: 'Pembelian 3 spidol whiteboard Snowman (Hitam, Biru, Merah) & penghapus magnet',
    penanggungJawab: 'Sri Wahyuni, S.Pd.',
    saldoSetelah: 75000
  },
  {
    id: 'trx-03',
    tanggal: '2026-08-05',
    jenis: 'Pemasukan',
    kategori: 'Donasi Paguyuban',
    jumlah: 350000,
    keterangan: 'Bantuan paguyuban orang tua murid untuk perlengkapan Pojok Bacaan Kelas 4A',
    penanggungJawab: 'Bapak Hendra (Ketua Paguyuban)',
    saldoSetelah: 425000
  },
  {
    id: 'trx-04',
    tanggal: '2026-08-08',
    jenis: 'Pemasukan',
    kategori: 'Iuran Kas Mingguan',
    jumlah: 120000,
    keterangan: 'Iuran kas minggu ke-2 bulan Agustus',
    penanggungJawab: 'Gita Maharani',
    saldoSetelah: 545000
  },
  {
    id: 'trx-05',
    tanggal: '2026-08-10',
    jenis: 'Pengeluaran',
    kategori: 'Fotocopy Tugas',
    jumlah: 36000,
    keterangan: 'Fotocopy lembar kerja asesmen formatif IPAS (12 rangkap x 3 lembar)',
    penanggungJawab: 'Citra Dewi Lestari (Sekretaris)',
    saldoSetelah: 509000
  },
  {
    id: 'trx-06',
    tanggal: '2026-08-12',
    jenis: 'Pengeluaran',
    kategori: 'Santunan / Sosial',
    jumlah: 50000,
    keterangan: 'Bingkisan buah untuk ananda Dimas Anggara (sakit demam)',
    penanggungJawab: 'Ahmad Fauzi & Gita Maharani',
    saldoSetelah: 459000
  },
  {
    id: 'trx-07',
    tanggal: '2026-08-15',
    jenis: 'Pemasukan',
    kategori: 'Iuran Kas Mingguan',
    jumlah: 110000,
    keterangan: 'Iuran kas minggu ke-3 bulan Agustus (11 siswa)',
    penanggungJawab: 'Gita Maharani',
    saldoSetelah: 569000
  }
];

export const generateInitialDues = (): StudentWeeklyDues[] => {
  return INITIAL_STUDENTS.map((student, idx) => ({
    id: `dues-${student.id}`,
    siswaId: student.id,
    bulan: 'Agustus 2026',
    minggu1: true,
    minggu2: true,
    minggu3: idx !== 10, // all except Rizky on w3
    minggu4: false,
    nominalPerMinggu: 10000
  }));
};

export const INITIAL_INVENTORY: InventoryItem[] = [
  {
    id: 'inv-01',
    kodeBarang: 'INV-4A-001',
    namaBarang: 'Meja dan Kursi Siswa Kayu Jati',
    kategori: 'Perabot',
    jumlah: 12,
    satuan: 'Set',
    kondisi: 'Baik',
    sumberDana: 'BOS',
    tanggalPengadaan: '2024-07-10',
    keterangan: 'Kondisi kokoh, tertata rapi sesuai protokol kelas'
  },
  {
    id: 'inv-02',
    kodeBarang: 'INV-4A-002',
    namaBarang: 'Meja & Kursi Guru Kelas',
    kategori: 'Perabot',
    jumlah: 1,
    satuan: 'Set',
    kondisi: 'Baik',
    sumberDana: 'BOS',
    tanggalPengadaan: '2024-07-10',
    keterangan: 'Dilengkapi laci berkas administrasi dan taplak batik'
  },
  {
    id: 'inv-03',
    kodeBarang: 'INV-4A-003',
    namaBarang: 'Papan Tulis Whiteboard Magnetik (240x120 cm)',
    kategori: 'Perabot',
    jumlah: 1,
    satuan: 'Unit',
    kondisi: 'Baik',
    sumberDana: 'BOS',
    tanggalPengadaan: '2023-01-15',
    keterangan: 'Terpasang di dinding depan kelas'
  },
  {
    id: 'inv-04',
    kodeBarang: 'INV-4A-004',
    namaBarang: 'Kipas Angin Dinding Tornado 18"',
    kategori: 'Elektronik',
    jumlah: 2,
    satuan: 'Unit',
    kondisi: 'Baik',
    sumberDana: 'Kas Paguyuban',
    tanggalPengadaan: '2024-09-05',
    keterangan: 'Berfungsi dengan baik untuk sirkulasi udara'
  },
  {
    id: 'inv-05',
    kodeBarang: 'INV-4A-005',
    namaBarang: 'Smart TV & Soundbar Monitor Pembelajaran 43"',
    kategori: 'Elektronik',
    jumlah: 1,
    satuan: 'Unit',
    kondisi: 'Baik',
    sumberDana: 'Bantuan Pemerintah',
    tanggalPengadaan: '2025-02-20',
    keterangan: 'Digunakan untuk video edukasi interaktif dan presentasi P5'
  },
  {
    id: 'inv-06',
    kodeBarang: 'INV-4A-006',
    namaBarang: 'Rak Buku Pojok Literasi Kayu 4 Susun',
    kategori: 'Pojok Baca',
    jumlah: 2,
    satuan: 'Unit',
    kondisi: 'Baik',
    sumberDana: 'Kas Paguyuban',
    tanggalPengadaan: '2025-08-01',
    keterangan: 'Memuat 65 judul buku ensiklopedia anak dan cerita rakyat'
  },
  {
    id: 'inv-07',
    kodeBarang: 'INV-4A-007',
    namaBarang: 'Globe Bola Dunia & Peta NKRI Dinding',
    kategori: 'Alat Peraga',
    jumlah: 1,
    satuan: 'Set',
    kondisi: 'Baik',
    sumberDana: 'BOS',
    tanggalPengadaan: '2023-11-12',
    keterangan: 'Alat peraga mata pelajaran IPAS Geografi'
  },
  {
    id: 'inv-08',
    kodeBarang: 'INV-4A-008',
    namaBarang: 'Set Alat Kebersihan (Sapu, Pel, Tempat Sampah 3 Warna)',
    kategori: 'Kebersihan',
    jumlah: 1,
    satuan: 'Set',
    kondisi: 'Baik',
    sumberDana: 'BOS',
    tanggalPengadaan: '2026-01-05',
    keterangan: 'Tempat sampah terpilah: Organik, Anorganik, dan Kertas'
  },
  {
    id: 'inv-09',
    kodeBarang: 'INV-4A-009',
    namaBarang: 'Kotak P3K Lengkap + Termometer Digital',
    kategori: 'Alat Peraga',
    jumlah: 1,
    satuan: 'Paket',
    kondisi: 'Baik',
    sumberDana: 'BOS',
    tanggalPengadaan: '2025-07-20',
    keterangan: 'Berisi plester, betadine, minyak kayu putih, kasa steril, parasetamol anak'
  }
];

export const INITIAL_COUNSELING: CounselingRecord[] = [
  {
    id: 'csl-01',
    tanggal: '2026-08-15',
    siswaId: 'sis-01',
    jenis: 'Prestasi',
    judul: 'Apresiasi Kepemimpinan & Inisiatif Gemar Membaca',
    deskripsi: 'Ahmad Fauzi berhasil memimpin teman-temannya dalam mengorganisasi pojok bacaan kelas serta tertib saat jam istirahat.',
    tindakLanjut: 'Diberikan sertifikat Bintang Teladan Bulan Agustus dan ditunjuk mewakili kelas dalam Forum Anak Sekolah.',
    status: 'Selesai',
    pembimbing: 'Sri Wahyuni, S.Pd.'
  },
  {
    id: 'csl-02',
    tanggal: '2026-08-11',
    siswaId: 'sis-03',
    jenis: 'Prestasi',
    judul: 'Juara 2 Turnamen Catur Tingkat Pelajar SD',
    deskripsi: 'Budi Santoso meraih medali perak dalam Kejuaraan Catur Pelajar Tingkat Wilayah II Jakarta Selatan.',
    tindakLanjut: 'Pemberian piagam penghargaan di depan upacara bendera hari Senin dan pembinaan lanjutan.',
    status: 'Selesai',
    pembimbing: 'Wahyu Hidayat, S.Pd.Jas'
  },
  {
    id: 'csl-03',
    tanggal: '2026-08-06',
    siswaId: 'sis-05',
    jenis: 'Akademik',
    judul: 'Pendampingan Konsentrasi & Pemahaman Konsep Pecahan',
    deskripsi: 'Dimas tampak kurang fokus pada jam pelajaran Matematika sesi siang dan merasa kesulitan dengan pecahan campuran.',
    tindakLanjut: 'Telah dilakukan bimbingan personal 20 menit setelah pulang sekolah dengan media visual benda konkret. Menginformasikan orang tua untuk mendampingi review 10 menit di rumah.',
    status: 'Dalam Pantauan',
    pembimbing: 'Sri Wahyuni, S.Pd.'
  },
  {
    id: 'csl-04',
    tanggal: '2026-08-04',
    siswaId: 'sis-10',
    jenis: 'Prestasi',
    judul: 'Lolos Seleksi Olimpiade Sains Nasional (OSN) Tingkat Kota',
    deskripsi: 'Nadia Zahra Kamila berhasil meraih skor tertinggi seleksi internal sekolah untuk bidang IPA SD.',
    tindakLanjut: 'Dijadwalkan bimbingan intensif setiap hari Selasa & Kamis sore bersama tim pembina sains.',
    status: 'Selesai',
    pembimbing: 'Sri Wahyuni, S.Pd.'
  }
];

export const INITIAL_DUTIES: CleaningDuty[] = [
  {
    hari: 'Senin',
    siswaIds: ['sis-01', 'sis-02'],
    ketuaPiket: 'Ahmad Fauzi Rahman',
    tugasSpesifik: 'Menyiapkan papan tulis, spidol & penghapus, menyapu lantai kelas dan menyiram tanaman teras depan.',
    areaTugas: ['Papan Tulis & Meja Guru', 'Sapu & Pel Lantai', 'Teras Depan'],
    waktuPiket: 'Pagi & Siang'
  },
  {
    hari: 'Selasa',
    siswaIds: ['sis-03', 'sis-04'],
    ketuaPiket: 'Budi Santoso',
    tugasSpesifik: 'Menyapu lorong kelas, merapikan meja kursi siswa, dan membuang sampah ke bak terpilah.',
    areaTugas: ['Meja & Kursi Siswa', 'Tempat Sampah Terpilah', 'Sapu Lantai'],
    waktuPiket: 'Pagi & Siang'
  },
  {
    hari: 'Rabu',
    siswaIds: ['sis-05', 'sis-06'],
    ketuaPiket: 'Farhan Maulana Malik',
    tugasSpesifik: 'Merapikan pojok bacaan & buku literasi, membersihkan debu jendela dan kipas angin dinding.',
    areaTugas: ['Pojok Baca & Rak Buku', 'Kaca Jendela & Ventilasi', 'Sapu Lantai'],
    waktuPiket: 'Siang (Pulang Sekolah)'
  },
  {
    hari: 'Kamis',
    siswaIds: ['sis-07', 'sis-08'],
    ketuaPiket: 'Gita Maharani',
    tugasSpesifik: 'Menyapu lantai, memeriksa kelengkapan spidol & isi tinta, serta merapikan taplak meja guru.',
    areaTugas: ['Meja Guru & Dokumen', 'Papan Tulis', 'Sapu & Pel Lantai'],
    waktuPiket: 'Pagi & Siang'
  },
  {
    hari: 'Jumat',
    siswaIds: ['sis-09', 'sis-10'],
    ketuaPiket: 'Nadia Zahra Kamila',
    tugasSpesifik: 'Operasi Semut bersih-bersih kelas menjelang ibadah/pembiasaan Jumat, mengepel lantai dan lap kaca.',
    areaTugas: ['Operasi Semut Kelas', 'Pel Lantai Menyeluruh', 'Tempat Sampah Organik/Anorganik'],
    waktuPiket: 'Pagi (Sebelum Bel)'
  },
  {
    hari: 'Sabtu',
    siswaIds: ['sis-11', 'sis-12'],
    ketuaPiket: 'Tiara Anindya Putri',
    tugasSpesifik: 'Pembersihan menyeluruh akhir pekan, merapikan loker siswa, pojok kreasi P5, dan mematikan seluruh aliran listrik/kipas.',
    areaTugas: ['Loker & Pojok Hasil Karya P5', 'Pojok Bacaan', 'Saklar Listrik & Kipas'],
    waktuPiket: 'Siang (Pulang Sekolah)'
  }
];

export const INITIAL_EVENTS: SchoolEvent[] = [
  {
    id: 'ev-01',
    tanggal: '2026-08-17',
    judul: 'Upacara HUT Kemerdekaan RI ke-81',
    kategori: 'Sekolah',
    deskripsi: 'Upacara bendera gabungan seluruh siswa dan guru dengan seragam adat daerah nusantara.',
    waktu: '07:00 - 09:30 WIB'
  },
  {
    id: 'ev-02',
    tanggal: '2026-08-25',
    judul: 'Gelar Karya P5 (Projek Penguatan Profil Pelajar Pancasila)',
    kategori: 'P5',
    deskripsi: 'Pameran kreasi ecobrick dan daur ulang sampah plastik bertema "Gaya Hidup Berkelanjutan".',
    waktu: '08:00 - 12:00 WIB'
  },
  {
    id: 'ev-03',
    tanggal: '2026-09-15',
    judul: 'Asesmen Sumatif Tengah Semester (STS) Ganjil',
    kategori: 'Ujian',
    deskripsi: 'Pelaksanaan asesmen tengah semester untuk mengukur ketercapaian tujuan pembelajaran.',
    waktu: '07:30 - 11:30 WIB'
  },
  {
    id: 'ev-04',
    tanggal: '2026-09-26',
    judul: 'Pertemuan Paguyuban Orang Tua Murid & Pembagian Laporan Kemajuan',
    kategori: 'Kelas',
    deskripsi: 'Diskusi bersama wali murid mengenai capaian perkembangan belajar dan persiapan lomba sekolah.',
    waktu: '09:00 - 11:30 WIB'
  }
];

export const INITIAL_EXTRACURRICULARS: Extracurricular[] = [
  {
    id: 'ex-01',
    siswaId: 'sis-01',
    namaKegiatan: 'Pramuka Siaga / Penggalang',
    predikat: 'Sangat Baik',
    keterangan: 'Aktif, disiplin, dan terampil dalam tali-temali serta semaphore.'
  },
  {
    id: 'ex-02',
    siswaId: 'sis-01',
    namaKegiatan: 'Dokter Kecil (UKS)',
    predikat: 'Sangat Baik',
    keterangan: 'Memahami prinsip pertolongan pertama pada kecelakaan ringan di sekolah.'
  },
  {
    id: 'ex-03',
    siswaId: 'sis-02',
    namaKegiatan: 'Seni Tari Tradisional',
    predikat: 'Sangat Baik',
    keterangan: 'Menguasai gerak dasar tari Jaipong dan Saman dengan kelenturan yang bagus.'
  },
  {
    id: 'ex-04',
    siswaId: 'sis-03',
    namaKegiatan: 'Klub Catur Prestasi',
    predikat: 'Sangat Baik',
    keterangan: 'Memiliki pemikiran taktis dan ketenangan tinggi dalam strategi catur.'
  },
  {
    id: 'ex-05',
    siswaId: 'sis-06',
    namaKegiatan: 'Robotika & Coding Dasar',
    predikat: 'Sangat Baik',
    keterangan: 'Mampu merakit sirkuit sederhana dan algoritma pemrograman visual Scratch.'
  },
  {
    id: 'ex-06',
    siswaId: 'sis-10',
    namaKegiatan: 'Klub Sains & Olimpiade IPA',
    predikat: 'Sangat Baik',
    keterangan: 'Daya analisis eksperimen sangat tinggi dan tekun dalam pemecahan masalah ilmiah.'
  }
];

export const INITIAL_TEACHERS: Teacher[] = [
  {
    id: 'guru-01',
    nip: '19680315 199303 1 005',
    nuptk: '3456746648200012',
    nama: 'Drs. H. Bambang Sutrisno, M.Pd.',
    jenisKelamin: 'L',
    jabatan: 'Kepala Sekolah',
    jenisGuru: 'Kepala Sekolah',
    statusKepegawaian: 'PNS',
    golonganPangkat: 'IV/b - Pembina Tingkat I',
    pendidikanTerakhir: 'S2 Manajemen Pendidikan',
    jurusan: 'Manajemen Pendidikan',
    noHp: '081234567890',
    email: 'bambang.sutrisno@sdn.sch.id',
    alamat: 'Jl. Wijaya Kusuma No. 12, Kebayoran Baru, Jakarta Selatan',
    fotoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80',
    statusAktif: 'Aktif',
    mataPelajaranUtama: ['Manajemen Sekolah', 'Supervisi Akademik'],
    kelasDiampu: 'Semua Kelas (1-6)',
    tugasTambahan: 'Ketua K3S Kecamatan Kebayoran Baru',
    tanggalBergabung: '2018-07-15',
    tempatLahir: 'Semarang',
    tanggalLahir: '1968-03-15',
    catatanKhusus: 'Pembina Pembelajaran Kurikulum Merdeka & Assessor Akreditasi Sekolah.'
  },
  {
    id: 'guru-02',
    nip: '19880412 201201 2 018',
    nuptk: '8452766668210023',
    nama: 'Sri Wahyuni, S.Pd., Gr.',
    jenisKelamin: 'P',
    jabatan: 'Wali Kelas 4A & Guru Kelas',
    jenisGuru: 'Guru Kelas',
    statusKepegawaian: 'PNS',
    golonganPangkat: 'III/c - Penata',
    pendidikanTerakhir: 'S1 PGSD',
    jurusan: 'Pendidikan Guru Sekolah Dasar',
    noHp: '081398765432',
    email: 'sri.wahyuni@sdn.sch.id',
    alamat: 'Jl. Melati Raya No. 45, Cilandak, Jakarta Selatan',
    fotoUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&auto=format&fit=crop&q=80',
    statusAktif: 'Aktif',
    mataPelajaranUtama: ['Bahasa Indonesia', 'Matematika', 'IPAS', 'Pendidikan Pancasila'],
    kelasDiampu: 'Kelas 4A',
    tugasTambahan: 'Wali Kelas 4A & Koordinator Tim P5 Fase B',
    tanggalBergabung: '2019-01-02',
    tempatLahir: 'Surakarta',
    tanggalLahir: '1988-04-12',
    catatanKhusus: 'Guru Penggerak Angkatan 7 & Penulis Modul Ajar Merdeka Belajar.'
  },
  {
    id: 'guru-03',
    nip: '19850620 200902 1 004',
    nuptk: '1245763665200034',
    nama: 'Rahmat Hidayat, S.Pd.I., M.Pd.',
    jenisKelamin: 'L',
    jabatan: 'Guru Pendidikan Agama Islam & Budi Pekerti',
    jenisGuru: 'Guru Mapel',
    statusKepegawaian: 'PNS',
    golonganPangkat: 'III/d - Penata Tingkat I',
    pendidikanTerakhir: 'S2 Pendidikan Agama Islam',
    jurusan: 'Pendidikan Agama Islam',
    noHp: '081287654321',
    email: 'rahmat.hidayat@sdn.sch.id',
    alamat: 'Jl. Masjid Al-Ikhlas No. 8, Mampang Prapatan, Jakarta Selatan',
    fotoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    statusAktif: 'Aktif',
    mataPelajaranUtama: ['Pendidikan Agama Islam & Budi Pekerti'],
    kelasDiampu: 'Kelas 1 - 6 (Fase A, B, C)',
    tugasTambahan: 'Pembina Rohis & Ekstrakurikuler BTQ',
    tanggalBergabung: '2015-08-01',
    tempatLahir: 'Bandung',
    tanggalLahir: '1985-06-20',
    catatanKhusus: 'Koordinator Pembiasaan Ibadah Pagi & Sholat Dhuha Bersama.'
  },
  {
    id: 'guru-04',
    nip: '19920815 202221 1 007',
    nuptk: '9845770671130045',
    nama: 'Budi Santoso, S.Pd.',
    jenisKelamin: 'L',
    jabatan: 'Guru PJOK (Pendidikan Jasmani, Olahraga, & Kesehatan)',
    jenisGuru: 'Guru Mapel',
    statusKepegawaian: 'PPPK',
    golonganPangkat: 'Golongan IX (PPPK)',
    pendidikanTerakhir: 'S1 Pendidikan Jasmani Kesehatan & Rekreasi',
    jurusan: 'PJKR',
    noHp: '085712349876',
    email: 'budi.santoso@sdn.sch.id',
    alamat: 'Jl. Fatmawati Permai No. 22, Cilandak, Jakarta Selatan',
    fotoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    statusAktif: 'Aktif',
    mataPelajaranUtama: ['PJOK'],
    kelasDiampu: 'Kelas 1 - 6 (Fase A, B, C)',
    tugasTambahan: 'Pembina Ekstrakurikuler Futsal, Atletik, & UKS Sekolah',
    tanggalBergabung: '2022-03-01',
    tempatLahir: 'Yogyakarta',
    tanggalLahir: '1992-08-15',
    catatanKhusus: 'Pelatih Berlisensi Atletik Pelajar Daerah DKI Jakarta.'
  },
  {
    id: 'guru-05',
    nip: '19750912 200003 2 003',
    nuptk: '4562753654300056',
    nama: 'Siti Aminah, S.Pd., M.Si.',
    jenisKelamin: 'P',
    jabatan: 'Wali Kelas 1A & Guru Kelas',
    jenisGuru: 'Guru Kelas',
    statusKepegawaian: 'PNS',
    golonganPangkat: 'IV/a - Pembina',
    pendidikanTerakhir: 'S2 Pendidikan Dasar',
    jurusan: 'Pendidikan Dasar',
    noHp: '081345678901',
    email: 'siti.aminah@sdn.sch.id',
    alamat: 'Jl. Kemang Timur No. 19, Pasar Minggu, Jakarta Selatan',
    fotoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    statusAktif: 'Aktif',
    mataPelajaranUtama: ['Tematik Fase A', 'Bahasa Indonesia', 'Matematika Awal'],
    kelasDiampu: 'Kelas 1A',
    tugasTambahan: 'Koordinator Literasi Awal / Transisi PAUD ke SD',
    tanggalBergabung: '2008-01-10',
    tempatLahir: 'Bogor',
    tanggalLahir: '1975-09-12',
    catatanKhusus: 'Ahli Pendampingan Transisi PAUD ke SD Menyenangkan.'
  },
  {
    id: 'guru-06',
    nip: '19941103 202321 2 015',
    nuptk: '7654872673230067',
    nama: 'Dewi Sartika, S.Pd.',
    jenisKelamin: 'P',
    jabatan: 'Wali Kelas 2A & Guru Kelas',
    jenisGuru: 'Guru Kelas',
    statusKepegawaian: 'PPPK',
    golonganPangkat: 'Golongan IX (PPPK)',
    pendidikanTerakhir: 'S1 PGSD',
    jurusan: 'Pendidikan Guru Sekolah Dasar',
    noHp: '087812345678',
    email: 'dewi.sartika@sdn.sch.id',
    alamat: 'Jl. Terogong Raya No. 14, Pondok Pinang, Jakarta Selatan',
    fotoUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80',
    statusAktif: 'Aktif',
    mataPelajaranUtama: ['Tematik Fase A', 'Pendidikan Pancasila', 'Matematika'],
    kelasDiampu: 'Kelas 2A',
    tugasTambahan: 'Pengelola Pojok Literasi Sekolah',
    tanggalBergabung: '2023-04-01',
    tempatLahir: 'Cirebon',
    tanggalLahir: '1994-11-03',
    catatanKhusus: 'Kreator Media Pembelajaran Interaktif Berbasis Canva for Education.'
  },
  {
    id: 'guru-07',
    nip: '-',
    nuptk: '5432871672300078',
    nama: 'Hendra Gunawan, S.Pd.',
    jenisKelamin: 'L',
    jabatan: 'Wali Kelas 3A & Guru Kelas',
    jenisGuru: 'Guru Kelas',
    statusKepegawaian: 'GTT / Honorer',
    golonganPangkat: '-',
    pendidikanTerakhir: 'S1 PGSD',
    jurusan: 'Pendidikan Guru Sekolah Dasar',
    noHp: '085890123456',
    email: 'hendra.gunawan@sdn.sch.id',
    alamat: 'Jl. Radio Dalam No. 50, Gandaria Utara, Jakarta Selatan',
    fotoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&auto=format&fit=crop&q=80',
    statusAktif: 'Aktif',
    mataPelajaranUtama: ['Bahasa Indonesia', 'IPAS', 'Seni Rupa'],
    kelasDiampu: 'Kelas 3A',
    tugasTambahan: 'Pembina Pramuka Siaga',
    tanggalBergabung: '2021-07-15',
    tempatLahir: 'Tangerang',
    tanggalLahir: '1996-02-18',
    catatanKhusus: 'Aktif dalam kegiatan KKG Gugus dan Pramuka Kwartir Ranting.'
  },
  {
    id: 'guru-08',
    nip: '19820310 200801 1 009',
    nuptk: '6543760662200089',
    nama: 'Agus Setiawan, S.Pd., M.Pd.',
    jenisKelamin: 'L',
    jabatan: 'Wali Kelas 5A & Guru Kelas',
    jenisGuru: 'Guru Kelas',
    statusKepegawaian: 'PNS',
    golonganPangkat: 'III/d - Penata Tingkat I',
    pendidikanTerakhir: 'S2 Pendidikan Matematika',
    jurusan: 'Pendidikan Matematika',
    noHp: '081298765401',
    email: 'agus.setiawan@sdn.sch.id',
    alamat: 'Jl. Tebet Barat Dalam No. 33, Tebet, Jakarta Selatan',
    fotoUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=200&auto=format&fit=crop&q=80',
    statusAktif: 'Aktif',
    mataPelajaranUtama: ['Matematika', 'IPAS Fase C', 'Bahasa Indonesia'],
    kelasDiampu: 'Kelas 5A',
    tugasTambahan: 'Pembimbing Olimpiade Sains Nasional (OSN) Matematika',
    tanggalBergabung: '2016-01-04',
    tempatLahir: 'Malang',
    tanggalLahir: '1982-03-10',
    catatanKhusus: 'Instruktur Nasional Bimbingan Olimpiade Sains & Numerasi SD.'
  },
  {
    id: 'guru-09',
    nip: '19790514 200501 2 006',
    nuptk: '2345757659200090',
    nama: 'Ratna Nurjanah, S.Pd., Gr.',
    jenisKelamin: 'P',
    jabatan: 'Wali Kelas 6A & Guru Kelas',
    jenisGuru: 'Guru Kelas',
    statusKepegawaian: 'PNS',
    golonganPangkat: 'IV/a - Pembina',
    pendidikanTerakhir: 'S1 PGSD',
    jurusan: 'Pendidikan Guru Sekolah Dasar',
    noHp: '081567890123',
    email: 'ratna.nurjanah@sdn.sch.id',
    alamat: 'Jl. Panglima Polim No. 71, Kebayoran Baru, Jakarta Selatan',
    fotoUrl: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=200&auto=format&fit=crop&q=80',
    statusAktif: 'Aktif',
    mataPelajaranUtama: ['Bahasa Indonesia', 'IPAS', 'Persiapan Asesmen Standarisasi Pendidikan'],
    kelasDiampu: 'Kelas 6A',
    tugasTambahan: 'Ketua Tim Asesmen Sekolah & Koordinator Kelulusan Kelas 6',
    tanggalBergabung: '2012-07-09',
    tempatLahir: 'Sukabumi',
    tanggalLahir: '1979-05-14',
    catatanKhusus: 'Pengembang Bank Soal Asesmen Sumatif Akhir Jenjang Sekolah Dasar.'
  },
  {
    id: 'guru-10',
    nip: '-',
    nuptk: '8765874675230101',
    nama: 'Nurul Fauziyah, S.Pd.',
    jenisKelamin: 'P',
    jabatan: 'Guru Bahasa Inggris & Seni Rupa',
    jenisGuru: 'Guru Mapel',
    statusKepegawaian: 'GTT / Honorer',
    golonganPangkat: '-',
    pendidikanTerakhir: 'S1 Pendidikan Bahasa Inggris',
    jurusan: 'Bahasa & Sastra Inggris',
    noHp: '087789012345',
    email: 'nurul.fauziyah@sdn.sch.id',
    alamat: 'Jl. Gandaria Tengah No. 11, Kramat Pela, Jakarta Selatan',
    fotoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    statusAktif: 'Aktif',
    mataPelajaranUtama: ['Bahasa Inggris', 'Seni Rupa & Prakarya'],
    kelasDiampu: 'Kelas 1 - 6 (Fase A, B, C)',
    tugasTambahan: 'Pembina English Club & Sanggar Seni Rupa Siswa',
    tanggalBergabung: '2022-08-01',
    tempatLahir: 'Jakarta',
    tanggalLahir: '1997-09-24',
    catatanKhusus: 'Koordinator Dekorasi Kreatif Sekolah & Pameran Karya Seni P5.'
  },
  {
    id: 'guru-11',
    nip: '-',
    nuptk: '9988776655440112',
    nama: 'Dimas Prasetyo, S.Kom.',
    jenisKelamin: 'L',
    jabatan: 'Operator Dapodik & Tenaga Administrasi Sekolah',
    jenisGuru: 'Tenaga Kependidikan',
    statusKepegawaian: 'GTT / Honorer',
    golonganPangkat: '-',
    pendidikanTerakhir: 'S1 Sistem Informasi',
    jurusan: 'Teknologi Informasi & Komputer',
    noHp: '081901234567',
    email: 'operator.sdn01@dki.belajar.id',
    alamat: 'Jl. Bangka Raya No. 40, Mampang, Jakarta Selatan',
    fotoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80',
    statusAktif: 'Aktif',
    mataPelajaranUtama: ['Manajemen Data Pendidikan', 'Dapodikmen'],
    kelasDiampu: '-',
    tugasTambahan: 'Operator Dapodikdasmen, Pengelola Inventaris Aset, & IT Support',
    tanggalBergabung: '2020-02-15',
    tempatLahir: 'Jakarta',
    tanggalLahir: '1995-12-05',
    catatanKhusus: 'Pengelola Sinkronisasi Data Pokok Pendidikan (Dapodik) & ANBK.'
  }
];

export const generateInitialStudentReports = (): Record<string, StudentReportData> => {
  const reports: Record<string, StudentReportData> = {};

  const defaultComments = [
    "menunjukkan perkembangan akhlak mulia dan nalar kritis yang sangat membanggakan di semester ini. Tingkatkan terus semangat literasi membaca dan pertahankan kepedulian sosial yang tinggi terhadap teman sekelas.",
    "memiliki kemampuan akademik yang sangat baik dan konsisten. Sangat aktif dalam diskusi kelas serta menunjukkan kepemimpinan yang santun dan bertanggung jawab.",
    "menunjukkan kemajuan yang pesat dalam pemahaman numerasi dan sains. Perlu terus didukung minat dan bakatnya dalam kegiatan eksperimen ilmiah.",
    "sangat berbakat dalam seni dan kebahasaan. Sikap disiplin, sopan santun, dan kerja sama dalam kelompok sangat patut dicontoh oleh rekan-rekannya.",
    "menunjukkan semangat belajar yang tinggi dan rasa ingin tahu yang luas. Diharapkan terus menjaga konsistensi belajar serta ketelitian saat evaluasi."
  ];

  INITIAL_STUDENTS.forEach((student, index) => {
    const rank = index + 1;
    const comment = defaultComments[index % defaultComments.length] || defaultComments[0];
    
    reports[student.id] = {
      siswaId: student.id,
      ranking: rank,
      totalNilai: 780 + ((28 - index) * 4),
      rataRataNilai: +(86.5 + ((28 - index) * 0.4)).toFixed(1),
      statusKenaikan: 'Naik Kelas',
      targetKelas: 'V (Lima)',
      keteranganKenaikan: `Berdasarkan pencapaian seluruh tujuan pembelajaran pada Tahun Ajaran 2026/2027, ananda ${student.nama} dinyatakan: NAIK KE KELAS V (LIMA)`,
      catatanWaliKelas: `"Ananda ${student.nama} ${comment}"`,
      tempatTanggalRapor: 'Jakarta, 20 Juni 2027',
      showRanking: true,
      showKenaikan: true
    };
  });

  return reports;
};


