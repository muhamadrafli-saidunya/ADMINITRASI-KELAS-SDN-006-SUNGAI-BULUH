import {
  DimensiProfilLulusan,
  ProjekKokurikuler,
  SiswaDPLCapaianRecord,
  JurnalAktivitasKokurikuler,
  ArtefakKaryaKokurikuler
} from '../types';

// ============================================================================
// 8 DIMENSI PROFIL LULUSAN (DPL) - PEMBELAJARAN MENDALAM & KURIKULUM MERDEKA
// ============================================================================
export const DEFAULT_DPL_DIMENSIONS: DimensiProfilLulusan[] = [
  {
    id: 'dpl-1',
    kode: 'DPL-1',
    nomor: 1,
    nama: 'Keimanan, Ketakwaan kepada Tuhan YME, dan Berakhlak Mulia',
    tagline: 'Memiliki spiritualitas kokoh, integritas moral, dan cinta sesama makhluk ciptaan-Nya',
    deskripsi: 'Peserta didik memahami ajaran agama/kepercayaan serta menerapkannya dalam pemahaman diri, perilaku berakhlak mulia terhadap diri sendiri, sesama manusia, alam sekitar, dan bangsa.',
    warna: 'indigo',
    iconName: 'HeartHandshake',
    elemen: [
      {
        id: 'elm-1-1',
        kode: 'E1.1',
        nama: 'Akhlak Beragama & Pribadi',
        subElemen: [
          {
            id: 'sub-1-1-1',
            kode: 'DPL1.1',
            nama: 'Integritas & Kejujuran Diri',
            targetFase: 'Membiasakan bersikap jujur, menepati janji, dan berani mengakui kesalahan dalam aktivitas harian.',
            deskripsiBB: 'Belum membiasakan bersikap jujur tanpa diingatkan guru.',
            deskripsiMB: 'Mulai menunjukkan kejujuran ketika ada teguran atau pengawasan.',
            deskripsiBSH: 'Konsisten bersikap jujur, amanah, dan berani menyampaikan kebenaran.',
            deskripsiSB: 'Menjadi teladan kejujuran dan mampu mengajak rekan sebaya bertindak sportif.'
          }
        ]
      },
      {
        id: 'elm-1-2',
        kode: 'E1.2',
        nama: 'Akhlak kepada Alam Lingkungan',
        subElemen: [
          {
            id: 'sub-1-2-1',
            kode: 'DPL1.2',
            nama: 'Menjaga & Menyayangi Lingkungan Hidup',
            targetFase: 'Memahami keterhubungan ekosistem bumi dan merawat lingkungan sekitar sekolah dengan kesadaran penuh.',
            deskripsiBB: 'Perlu bimbingan intensif dalam membuang sampah pada tempatnya.',
            deskripsiMB: 'Mulai memilah sampah dan merawat tanaman jika diingatkan.',
            deskripsiBSH: 'Terbiasa menjaga kebersihan, memilah sampah, dan merawat tanaman sekolah.',
            deskripsiSB: 'Mampu menginisiasi gerakan peduli lingkungan dan mengedukasi kawan sekelas.'
          }
        ]
      }
    ]
  },
  {
    id: 'dpl-2',
    kode: 'DPL-2',
    nomor: 2,
    nama: 'Kewargaan & Kebinekaan Global',
    tagline: 'Menghargai keberagaman budaya nusantara dan dunia dengan keterbukaan berpikir',
    deskripsi: 'Peserta didik mempertahankan budaya luhur, lokalitas, dan identitasnya, serta tetap berpikiran terbuka dalam berinteraksi dengan budaya lain.',
    warna: 'blue',
    iconName: 'Globe2',
    elemen: [
      {
        id: 'elm-2-1',
        kode: 'E2.1',
        nama: 'Mengenal dan Menghargai Budaya',
        subElemen: [
          {
            id: 'sub-2-1-1',
            kode: 'DPL2.1',
            nama: 'Eksplorasi Keragaman Budaya Nusantara',
            targetFase: 'Mengidentifikasi dan mendeskripsikan ragam tradisi, bahasa, kuliner, dan kearifan lokal di Indonesia.',
            deskripsiBB: 'Belum mengenali keberagaman adat dan budaya daerah lain.',
            deskripsiMB: 'Mulai tertarik mempelajari keunikan budaya lokal di nusantara.',
            deskripsiBSH: 'Mampu menjelaskan kearifan lokal daerah dan menghormati perbedaan tradisi.',
            deskripsiSB: 'Aktif mempromosikan nilai-nilai budaya nusantara dan mengapresiasi keragaman.'
          }
        ]
      }
    ]
  },
  {
    id: 'dpl-3',
    kode: 'DPL-3',
    nomor: 3,
    nama: 'Penalaran Kritis (Critical Thinking)',
    tagline: 'Mampu memproses informasi objektif, membedakan fakta dan opini, serta merefleksi penalaran',
    deskripsi: 'Peserta didik mampu secara objektif memproses informasi kualitatif maupun kuantitatif, membangun keterkaitan antara berbagai informasi, menganalisis, dan mengevaluasinya.',
    warna: 'amber',
    iconName: 'BrainCircuit',
    elemen: [
      {
        id: 'elm-3-1',
        kode: 'E3.1',
        nama: 'Memperoleh dan Memproses Informasi',
        subElemen: [
          {
            id: 'sub-3-1-1',
            kode: 'DPL3.1',
            nama: 'Mengajukan Pertanyaan Pemantik & Analisis Bukti',
            targetFase: 'Mengajukan pertanyaan mendalam untuk mengidentifikasi penyebab suatu masalah serta memverifikasi kebenaran informasi.',
            deskripsiBB: 'Hanya bertanya hal-hal permukaan saat menerima penjelasan.',
            deskripsiMB: 'Mulai mengajukan pertanyaan klarifikasi terkait topik yang dihadapi.',
            deskripsiBSH: 'Kritis mengajukan pertanyaan mengapa dan bagaimana serta mengecek kebenaran data.',
            deskripsiSB: 'Mampu menghubungkan konsep rumit dan membedakan fakta dengan asumsi secara tajam.'
          }
        ]
      }
    ]
  },
  {
    id: 'dpl-4',
    kode: 'DPL-4',
    nomor: 4,
    nama: 'Kreativitas & Inovasi (Creativity)',
    tagline: 'Menghasilkan gagasan orisinal, karya aplikatif, dan alternatif solusi orisinal yang bermakna',
    deskripsi: 'Peserta didik yang kreatif mampu memodifikasi dan menghasilkan sesuatu yang orisinal, bermakna, bermanfaat, dan berdampak.',
    warna: 'purple',
    iconName: 'Sparkles',
    elemen: [
      {
        id: 'elm-4-1',
        kode: 'E4.1',
        nama: 'Menghasilkan Karya dan Tindakan Orisinal',
        subElemen: [
          {
            id: 'sub-4-1-1',
            kode: 'DPL4.1',
            nama: 'Kreasi Produk & Solusi Alternatif Masalah',
            targetFase: 'Mengeksplorasi dan mengekspresikan pikiran atau perasaannya dalam bentuk karya orisinal serta mengapresiasi karya orang lain.',
            deskripsiBB: 'Cenderung meniru persis karya teman tanpa modifikasi sendiri.',
            deskripsiMB: 'Mulai menambahkan ide baru pada karya yang telah ada.',
            deskripsiBSH: 'Menghasilkan karya orisinal yang fungsional dan estetis sesuai tema projek.',
            deskripsiSB: 'Menciptakan inovasi karya unik dengan daya guna tinggi dan menginspirasi lingkungan.'
          }
        ]
      }
    ]
  },
  {
    id: 'dpl-5',
    kode: 'DPL-5',
    nomor: 5,
    nama: 'Kemandirian & Regulasi Diri (Self-Reliance)',
    tagline: 'Bertanggung jawab atas proses dan hasil belajar serta mengelola emosi dan tujuan secara adaptif',
    deskripsi: 'Peserta didik yang mandiri memiliki pemahaman diri dan situasi yang dihadapi serta regulasi diri yang terarah.',
    warna: 'emerald',
    iconName: 'UserCheck',
    elemen: [
      {
        id: 'elm-5-1',
        kode: 'E5.1',
        nama: 'Regulasi Diri & Disiplin Belajar',
        subElemen: [
          {
            id: 'sub-5-1-1',
            kode: 'DPL5.1',
            nama: 'Pengelolaan Waktu & Tanggung Jawab Tugas',
            targetFase: 'Menyelesaikan tugas-tugas projek secara mandiri, tepat waktu, dan tidak mudah menyerah saat menghadapi tantangan.',
            deskripsiBB: 'Memerlukan dorongan berulang untuk menyelesaikan tugas kelompok/individu.',
            deskripsiMB: 'Mampu menyelesaikan tugas namun masih sering terlambat atau terdistraksi.',
            deskripsiBSH: 'Mandiri merencanakan langkah belajar dan tekun menuntaskan tugas hingga tuntas.',
            deskripsiSB: 'Menunjukkan inisiatif tinggi, mampu mengatur ritme kerja mandiri dengan mutu unggul.'
          }
        ]
      }
    ]
  },
  {
    id: 'dpl-6',
    kode: 'DPL-6',
    nomor: 6,
    nama: 'Kolaborasi & Gotong Royong (Collaboration)',
    tagline: 'Bekerja sama secara sukarela, saling menghargai peran, dan peduli terhadap kemaslahatan bersama',
    deskripsi: 'Peserta didik memiliki kemampuan untuk melakukan kegiatan secara bersama-sama dengan sukarela agar kegiatan yang dikerjakan dapat berjalan lancar, mudah dan ringan.',
    warna: 'teal',
    iconName: 'Users2',
    elemen: [
      {
        id: 'elm-6-1',
        kode: 'E6.1',
        nama: 'Kerja Sama & Berbagi',
        subElemen: [
          {
            id: 'sub-6-1-1',
            kode: 'DPL6.1',
            nama: 'Partisipasi Aktif & Pembagian Peran Kelompok',
            targetFase: 'Menyelaraskan tindakan sendiri dengan tindakan orang lain untuk melaksanakan kegiatan dan mencapai tujuan kelompok di lingkungan sekitar.',
            deskripsiBB: 'Sering bekerja individual dan enggan membagi tugas dengan teman.',
            deskripsiMB: 'Mulai mau berdiskusi dan menerima giliran tugas dalam kelompok.',
            deskripsiBSH: 'Aktif berkolaborasi, menghargai pendapat teman, dan saling membantu dalam tim.',
            deskripsiSB: 'Mampu memimpin kelompok secara demokratis, mencairkan konflik, dan merangkul semua kawan.'
          }
        ]
      }
    ]
  },
  {
    id: 'dpl-7',
    kode: 'DPL-7',
    nomor: 7,
    nama: 'Komunikasi Efektif (Communication)',
    tagline: 'Menyampaikan gagasan secara lisan dan tulisan dengan santun, lugas, dan menyimak secara empatik',
    deskripsi: 'Peserta didik mampu menyampaikan gagasan, pandangan, dan perasaannya secara terstruktur dan santun, serta menyimak secara aktif dalam berbagai konteks sosial.',
    warna: 'sky',
    iconName: 'MessageSquareShare',
    elemen: [
      {
        id: 'elm-7-1',
        kode: 'E7.1',
        nama: 'Artikulasi Ide & Menyimak Aktif',
        subElemen: [
          {
            id: 'sub-7-1-1',
            kode: 'DPL7.1',
            nama: 'Presentasi Karya & Keterampilan Dialog',
            targetFase: 'Menyajikan hasil karya kokurikuler dengan intonasi jelas, santun, dan mampu menjawab umpan balik secara konstruktif.',
            deskripsiBB: 'Gugup dan sulit mengungkapkan gagasan di depan forum kecil.',
            deskripsiMB: 'Mulai berani berbicara di depan kelompok dengan teks panduan.',
            deskripsiBSH: 'Lancar mempresentasikan karya projek dengan bahasa santun dan menyimak tanggapan.',
            deskripsiSB: 'Komunikator persuasif yang sangat artikulatif, ekspresif, dan terbuka pada kritik saran.'
          }
        ]
      }
    ]
  },
  {
    id: 'dpl-8',
    kode: 'DPL-8',
    nomor: 8,
    nama: 'Kesehatan Raga & Kesejahteraan Jiwa (Well-being)',
    tagline: 'Menjaga kebugaran jasmani, ketahanan mental, dan keseimbangan emosional dalam keseharian',
    deskripsi: 'Peserta didik menghargai tubuh dan kesehatan fisiknya, mempraktikkan kebiasaan hidup bersih sehat, serta mampu mengelola emosi secara positif.',
    warna: 'rose',
    iconName: 'ActivitySquare',
    elemen: [
      {
        id: 'elm-8-1',
        kode: 'E8.1',
        nama: 'Perilaku Hidup Bersih & Sehat (PHBS)',
        subElemen: [
          {
            id: 'sub-8-1-1',
            kode: 'DPL8.1',
            nama: 'Kebiasaan Higienis & Ketahanan Mental',
            targetFase: 'Menerapkan pola hidup higienis, menjaga kebersihan diri dan lingkungan projek, serta mengelola rasa cemas dengan positif.',
            deskripsiBB: 'Kurang memperhatikan kebersihan tangan dan alat setelah berkegiatan.',
            deskripsiMB: 'Mulai membiasakan cuci tangan dan merapikan alat kerja jika diingatkan.',
            deskripsiBSH: 'Konsisten menerapkan pola hidup sehat, bersih, dan bersemangat selama projek.',
            deskripsiSB: 'Menjadi pelopor kebersihan dan kebugaran, serta memiliki ketahanan mental yang tangguh.'
          }
        ]
      }
    ]
  }
];

// ============================================================================
// INITIAL PROJEK KOKURIKULER KELAS (FORMAT E-RAPOR KEMENDIKDASMEN)
// ============================================================================
export const INITIAL_PROJEK_KOKURIKULER: ProjekKokurikuler[] = [
  {
    id: 'prj-kemendikdasmen-01',
    kodeProjek: 'KOKUR-HS-01',
    judul: 'Gerakan 7KAIH (Hidup Sehat)',
    tema: 'Hidup Sehat',
    namaKegiatan: 'Gerakan 7KAIH',
    bentukKegiatan: 'Pembiasaan Berolahraga dan Pola Hidup Bersih & Sehat (PHBS)',
    tujuanRingkasDeskripsi: 'memahami manfaat berolahraga bagi tubuh dan pembiasaan berolahraga',
    dimensiSubdimensiMapping: [
      {
        id: 'dim-1',
        dimensi: 'kesehatan',
        warna: '#cfe2f3',
        subdimensi: [
          'hidup bersih dan sehat',
          'kebugaran, kesehatan fisik, dan kesehatan mental'
        ]
      },
      {
        id: 'dim-2',
        dimensi: 'kemandirian',
        warna: '#fff2cc',
        subdimensi: [
          'bertanggung jawab'
        ]
      },
      {
        id: 'dim-3',
        dimensi: 'penalaran kritis',
        warna: '#d9d9d9',
        subdimensi: [
          'penyampaian argumentasi'
        ]
      }
    ],
    deskripsi: 'Kegiatan kokurikuler pembiasaan hidup sehat melalui Gerakan 7KAIH untuk menumbuhkan kebiasaan olahraga harian, menjaga kebugaran fisik dan mental, serta pembentukan karakter mandiri dan kritis.',
    latarBelakang: 'Pentingnya menanamkan kebiasaan hidup bersih dan aktif sejak dini bagi peserta didik Sekolah Dasar.',
    tujuanProjek: 'Peserta didik memahami manfaat berolahraga bagi tubuh dan mempraktikkan pembiasaan berolahraga teratur di sekolah maupun di rumah.',
    fase: 'Fase B (Kelas IV)',
    kelas: 'IV-A',
    semester: '1 (Ganjil)',
    tahunAjaran: '2024/2025',
    totalAlokasiJP: 36,
    koordinator: 'Sri Wahyuni, S.Pd., Gr.',
    fasilitator: [
      'Sri Wahyuni, S.Pd., Gr.',
      'Ahmad Fauzi, S.Pd.I',
      'Dewi Lestari, S.Pd.'
    ],
    dimensiTargetIds: ['dpl-8', 'dpl-5', 'dpl-3'],
    elemenTargetIds: ['sub-8-1-1', 'sub-5-1-1', 'sub-3-1-1'],
    tahapan: [
      {
        id: 'thp-hs-1',
        namaTahap: 'Pengenalan',
        deskripsiKegiatan: 'Edukasi pentingnya nutrisi seimbang, hidrasi, dan manfaat olahraga untuk fungsi otak dan jantung.',
        alokasiJP: 8,
        tanggalMulai: '2024-08-05',
        tanggalSelesai: '2024-08-12',
        status: 'Selesai'
      },
      {
        id: 'thp-hs-2',
        namaTahap: 'Kontekstualisasi',
        deskripsiKegiatan: 'Pengukuran kebugaran awal, pencatatan detak nadi istirahat, dan dialog tentang kebiasaan gerak harian.',
        alokasiJP: 8,
        tanggalMulai: '2024-08-19',
        tanggalSelesai: '2024-08-26',
        status: 'Selesai'
      },
      {
        id: 'thp-hs-3',
        namaTahap: 'Aksi',
        deskripsiKegiatan: 'Pelaksanaan Gerakan 7KAIH: Senam pagi bersama, peregangan di sela jam belajar, dan log harian jalan 6.000 langkah.',
        alokasiJP: 14,
        tanggalMulai: '2024-09-02',
        tanggalSelesai: '2024-09-23',
        status: 'Sedang Berjalan'
      },
      {
        id: 'thp-hs-4',
        namaTahap: 'Refleksi & Tindak Lanjut',
        deskripsiKegiatan: 'Refleksi kebugaran, presentasi jurnal olahraga siswa, serta pemberian apresiasi duta siswa bugar.',
        alokasiJP: 6,
        tanggalMulai: '2024-10-07',
        tanggalSelesai: '2024-10-14',
        status: 'Belum'
      }
    ],
    status: 'Sedang Berjalan',
    createdAt: '2024-08-01',
    updatedAt: '2024-09-10'
  },
  {
    id: 'prj-01',
    kodeProjek: 'PRJ-GHB-01',
    judul: 'Pilah Sampah, Rawat Bumi: Kompos & Biopori Cilik',
    tema: 'Gaya Hidup Berkelanjutan',
    namaKegiatan: 'Pilah Sampah & Kompos Cilik',
    bentukKegiatan: 'Aksi Nyata Lingkungan Hidup',
    tujuanRingkasDeskripsi: 'memahami pemilahan sampah dan pembiasaan merawat lingkungan sekitar',
    dimensiSubdimensiMapping: [
      {
        id: 'dim-ghb-1',
        dimensi: 'keimanan dan akhlak alam',
        warna: '#cfe2f3',
        subdimensi: ['menjaga dan menyayangi lingkungan']
      },
      {
        id: 'dim-ghb-2',
        dimensi: 'gotong royong',
        warna: '#fff2cc',
        subdimensi: ['partisipasi aktif kelompok']
      },
      {
        id: 'dim-ghb-3',
        dimensi: 'penalaran kritis',
        warna: '#d9d9d9',
        subdimensi: ['analisis siklus sampah']
      }
    ],
    deskripsi: 'Projek kokurikuler berbasis aksi nyata untuk menumbuhkan kepedulian lingkungan melalui pemilahan sampah organik dan anorganik di sekolah, pembuatan pupuk kompos takakura cilik, serta pemasangan lubang biopori resapan air.',
    latarBelakang: 'Volume sampah plastik dan sisa makanan kantin sekolah yang belum terkelola optimal menimbulkan bau dan genangan air saat musim hujan.',
    tujuanProjek: 'Peserta didik memahami siklus sampah organik, mampu mempraktikkan pengomposan mandiri, dan menumbuhkan karakter cinta lingkungan serta gotong royong.',
    fase: 'Fase B (Kelas IV)',
    kelas: 'IV-A',
    semester: '1 (Ganjil)',
    tahunAjaran: '2024/2025',
    totalAlokasiJP: 48,
    koordinator: 'Sri Wahyuni, S.Pd., Gr.',
    fasilitator: [
      'Sri Wahyuni, S.Pd., Gr.',
      'Ahmad Fauzi, S.Pd.I',
      'Dewi Lestari, S.Pd.'
    ],
    dimensiTargetIds: ['dpl-1', 'dpl-3', 'dpl-4', 'dpl-6'],
    elemenTargetIds: ['sub-1-2-1', 'sub-3-1-1', 'sub-4-1-1', 'sub-6-1-1'],
    tahapan: [
      {
        id: 'thp-1',
        namaTahap: 'Pengenalan',
        deskripsiKegiatan: 'Sosialisasi jenis sampah, jejak karbon, pemutaran video kerusakan alam, dan pengamatan timbulan sampah di kantin.',
        alokasiJP: 10,
        tanggalMulai: '2024-08-05',
        tanggalSelesai: '2024-08-12',
        status: 'Selesai'
      },
      {
        id: 'thp-2',
        namaTahap: 'Kontekstualisasi',
        deskripsiKegiatan: 'Wawancara dengan penjaga kantin dan petugas kebersihan, audit sampah harian kelas, serta eksplorasi teknologi komposter Takakura.',
        alokasiJP: 12,
        tanggalMulai: '2024-08-19',
        tanggalSelesai: '2024-08-26',
        status: 'Selesai'
      },
      {
        id: 'thp-3',
        namaTahap: 'Aksi',
        deskripsiKegiatan: 'Praktik pencacahan sampah organik, fermentasi EM4, pengisian komposter, pembuatan poster kampanye pilah sampah, dan pengeboran biopori.',
        alokasiJP: 18,
        tanggalMulai: '2024-09-02',
        tanggalSelesai: '2024-09-23',
        status: 'Sedang Berjalan'
      },
      {
        id: 'thp-4',
        namaTahap: 'Refleksi & Tindak Lanjut',
        deskripsiKegiatan: 'Pameran gelar karya "Green School Festival", panen kompos perdana untuk tanaman toga, dan penyusunan jurnal refleksi diri siswa.',
        alokasiJP: 8,
        tanggalMulai: '2024-10-07',
        tanggalSelesai: '2024-10-14',
        status: 'Belum'
      }
    ],
    status: 'Sedang Berjalan',
    createdAt: '2024-07-28',
    updatedAt: '2024-09-10'
  },
  {
    id: 'prj-02',
    kodeProjek: 'PRJ-KLB-02',
    judul: 'Jelajah Rasa & Warisan Leluhur: Festival Kuliner Tradisional Nusantara',
    tema: 'Kearifan Lokal',
    deskripsi: 'Projek penyelidikan dan pelestarian kuliner tradisional daerah, menggali sejarah asal-usul jajanan pasar nusantara, nilai gizi, serta praktik pembuatan dan penyajian dalam festival kuliner kelas.',
    latarBelakang: 'Banyak anak saat ini lebih mengenal makanan cepat saji (junk food) daripada jajanan tradisional lokal yang kaya filosofi dan rempah nusantara.',
    tujuanProjek: 'Mengenalkan kekayaan ragam kuliner nusantara, melatih keterampilan wawancara budayawan/orang tua, serta menguatkan kemandirian dan kebinekaan global.',
    fase: 'Fase B (Kelas IV)',
    kelas: 'IV-A',
    semester: '2 (Genap)',
    tahunAjaran: '2024/2025',
    totalAlokasiJP: 36,
    koordinator: 'Sri Wahyuni, S.Pd., Gr.',
    fasilitator: [
      'Sri Wahyuni, S.Pd., Gr.',
      'Siti Rahmawati, S.Pd.',
      'Budi Santoso, S.Pd.'
    ],
    dimensiTargetIds: ['dpl-2', 'dpl-5', 'dpl-6', 'dpl-7'],
    elemenTargetIds: ['sub-2-1-1', 'sub-5-1-1', 'sub-6-1-1', 'sub-7-1-1'],
    tahapan: [
      {
        id: 'thp-2-1',
        namaTahap: 'Pengenalan',
        deskripsiKegiatan: 'Pengenalan aneka ragam kuliner khas nusantara, rempah tradisional, dan nilai budaya melalui media audiovisual.',
        alokasiJP: 8,
        tanggalMulai: '2025-01-13',
        tanggalSelesai: '2025-01-20',
        status: 'Belum'
      },
      {
        id: 'thp-2-2',
        namaTahap: 'Kontekstualisasi',
        deskripsiKegiatan: 'Kunjungan ke sentra jajanan pasar lokal, wawancara pembuat klepon/getuk, dan riset resep warisan keluarga.',
        alokasiJP: 10,
        tanggalMulai: '2025-01-27',
        tanggalSelesai: '2025-02-03',
        status: 'Belum'
      },
      {
        id: 'thp-2-3',
        namaTahap: 'Aksi',
        deskripsiKegiatan: 'Praktik memasak kuliner tradisional secara higienis bersama kelompok, pembuatan kemasan ramah lingkungan dari daun pisang.',
        alokasiJP: 12,
        tanggalMulai: '2025-02-10',
        tanggalSelesai: '2025-02-24',
        status: 'Belum'
      },
      {
        id: 'thp-2-4',
        namaTahap: 'Refleksi & Tindak Lanjut',
        deskripsiKegiatan: 'Gelar festival bazar kuliner untuk seluruh warga sekolah dan penulisan buku kompilasi resep warisan leluhur kelas IV.',
        alokasiJP: 6,
        tanggalMulai: '2025-03-03',
        tanggalSelesai: '2025-03-10',
        status: 'Belum'
      }
    ],
    status: 'Perencanaan',
    createdAt: '2024-08-01',
    updatedAt: '2024-08-01'
  }
];

// ============================================================================
// INITIAL ASESMEN CAPAIAN DPL SISWA UNTUK PROJEK 1 & KEMENDIKDASMEN
// ============================================================================
export const INITIAL_DPL_ASSESSMENTS: SiswaDPLCapaianRecord[] = [
  // E-Rapor Kemendikdasmen Kokurikuler: Gerakan 7KAIH (Hidup Sehat)
  {
    id: 'dpl-rec-hs-001',
    projekId: 'prj-kemendikdasmen-01',
    siswaId: 'sis-0001', // Ahmad Dani Pratama
    capaianPerDimensi: {
      'kesehatan_0': { predikat: 'SB', catatan: 'Konsisten melakukan pembiasaan cuci tangan dan membawa bekal sehat bergizi.' },
      'kesehatan_1': { predikat: 'SB', catatan: 'Sangat bugar dan bersemangat memimpin senam pagi di barisan depan.' },
      'kemandirian_0': { predikat: 'BSH', catatan: 'Bertanggung jawab menyiapkan matras dan botol minum sendiri.' },
      'penalaran_kritis_0': { predikat: 'BSH', catatan: 'Mampu menjelaskan korelasi denyut nadi sebelum dan sesudah berolahraga.' }
    },
    catatanProses: 'Ananda Ahmad Dani Pratama menunjukkan perkembangan yang sangat baik dalam memahami manfaat berolahraga bagi tubuh dan pembiasaan berolahraga. Sangat Berkembang dalam hidup bersih dan sehat serta kebugaran, kesehatan fisik, dan kesehatan mental; Berkembang Sesuai Harapan dalam bertanggung jawab dan penyampaian argumentasi.',
    rekomendasiTindakLanjut: 'Diberikan kesempatan memimpin senam peregangan di sela pergantian jam pelajaran.',
    produkKarya: 'Jurnal Harian Gerak 6000 Langkah & Poster Manfaat Air Putih',
    keaktifan: 'Sangat Aktif',
    waktuPenilaian: '2024-09-10'
  },
  {
    id: 'dpl-rec-hs-002',
    projekId: 'prj-kemendikdasmen-01',
    siswaId: 'sis-0002', // Aisyah Humaira
    capaianPerDimensi: {
      'kesehatan_0': { predikat: 'SB', catatan: 'Sangat disiplin menjaga kebersihan ruang kelas dan membiasakan sarapan sehat.' },
      'kesehatan_1': { predikat: 'BSH', catatan: 'Bugar dan rutin mengikuti rangkaian senam kesegaran jasmani.' },
      'kemandirian_0': { predikat: 'SB', catatan: 'Mandiri dan tanggap merapikan perlengkapan olahraga bersama.' },
      'penalaran_kritis_0': { predikat: 'BSH', catatan: 'Aktif bertanya tentang jenis makanan bergizi seimbang.' }
    },
    catatanProses: 'Ananda Aisyah Humaira menunjukkan perkembangan yang sangat baik dalam memahami manfaat berolahraga bagi tubuh dan pembiasaan berolahraga. Sangat Berkembang dalam hidup bersih dan sehat serta bertanggung jawab; Berkembang Sesuai Harapan dalam kebugaran fisik dan penyampaian argumentasi.',
    rekomendasiTindakLanjut: 'Pertahankan kebiasaan baik sarapan sehat dan ajak teman sebangku berolahraga bersama.',
    produkKarya: 'Buku Catatan Menu Sehat Gizi Seimbang',
    keaktifan: 'Sangat Aktif',
    waktuPenilaian: '2024-09-10'
  },
  {
    id: 'dpl-rec-hs-003',
    projekId: 'prj-kemendikdasmen-01',
    siswaId: 'sis-0003', // Budi Santoso
    capaianPerDimensi: {
      'kesehatan_0': { predikat: 'BSH', catatan: 'Mulai terbiasa membuang sampah sisa makanan dan mencuci tangan pakai sabun.' },
      'kesehatan_1': { predikat: 'SB', catatan: 'Memiliki stamina fisik yang sangat prima saat aktivitas senam pagi.' },
      'kemandirian_0': { predikat: 'BSH', catatan: 'Tepat waktu mengikuti kegiatan olahraga pagi.' },
      'penalaran_kritis_0': { predikat: 'MB', catatan: 'Perlu bimbingan dalam menyampaikan alasan mengapa tubuh butuh istirahat cukup.' }
    },
    catatanProses: 'Ananda Budi Santoso berkembang dengan baik dalam memahami manfaat berolahraga bagi tubuh dan pembiasaan berolahraga. Sangat Berkembang dalam kebugaran fisik; Berkembang Sesuai Harapan dalam hidup bersih dan bertanggung jawab; Mulai Berkembang dalam penyampaian argumentasi.',
    rekomendasiTindakLanjut: 'Bimbing untuk mengutarakan pendapat secara runtut saat sesi refleksi olahraga.',
    produkKarya: 'Kartu Ceklis Kebiasaan Minum Air Putih 8 Gelas',
    keaktifan: 'Aktif',
    waktuPenilaian: '2024-09-10'
  },
  {
    id: 'dpl-rec-hs-004',
    projekId: 'prj-kemendikdasmen-01',
    siswaId: 'sis-0004', // Citra Dewi Lestari
    capaianPerDimensi: {
      'kesehatan_0': { predikat: 'BSH', catatan: 'Membawa botol minum sendiri dan rajin mencuci tangan.' },
      'kesehatan_1': { predikat: 'BSH', catatan: 'Mengikuti senam dengan tertib dan ceria.' },
      'kemandirian_0': { predikat: 'BSH', catatan: 'Mandiri dalam menyiapkan sepatu dan seragam olahraga.' },
      'penalaran_kritis_0': { predikat: 'SB', catatan: 'Mampu menjelaskan secara logis pentingnya pemanasan sebelum senam.' }
    },
    catatanProses: 'Ananda Citra Dewi Lestari menunjukkan perkembangan yang sangat baik dalam memahami manfaat berolahraga bagi tubuh dan pembiasaan berolahraga. Sangat Berkembang dalam penyampaian argumentasi; Berkembang Sesuai Harapan dalam hidup bersih dan sehat, kebugaran fisik, dan bertanggung jawab.',
    rekomendasiTindakLanjut: 'Didorong untuk membagikan wawasan tentang hidup sehat dalam majalah dinding kelas.',
    produkKarya: 'Infografis Sederhana 5 Manfaat Peregangan Otot',
    keaktifan: 'Sangat Aktif',
    waktuPenilaian: '2024-09-10'
  },
  {
    id: 'dpl-rec-hs-005',
    projekId: 'prj-kemendikdasmen-01',
    siswaId: 'sis-0005', // Dika Pratama
    capaianPerDimensi: {
      'kesehatan_0': { predikat: 'MB', catatan: 'Perlu terus diingatkan mencuci tangan sebelum memakan bekal.' },
      'kesehatan_1': { predikat: 'BSH', catatan: 'Aktif bergerak dan bersemangat selama senam ceria.' },
      'kemandirian_0': { predikat: 'MB', catatan: 'Kadang masih perlu diarahkan untuk merapikan kembali botol minum.' },
      'penalaran_kritis_0': { predikat: 'MB', catatan: 'Mulai mengenali hubungan antara tidur larut malam dengan rasa lelah di pagi hari.' }
    },
    catatanProses: 'Ananda Dika Pratama mulai berkembang dalam memahami manfaat berolahraga bagi tubuh dan pembiasaan berolahraga. Berkembang Sesuai Harapan dalam kebugaran fisik; Mulai Berkembang dalam hidup bersih dan sehat, bertanggung jawab, dan penyampaian argumentasi.',
    rekomendasiTindakLanjut: 'Diberi pendampingan teman sebangku untuk membiasakan cuci tangan secara teratur.',
    produkKarya: 'Poster Coretan Kartun Gerak Ceria Anak Sehat',
    keaktifan: 'Cukup',
    waktuPenilaian: '2024-09-10'
  },
  {
    id: 'dpl-rec-001',
    projekId: 'prj-01',
    siswaId: 'sis-0001', // Ahmad Dani Pratama
    capaianPerDimensi: {
      'sub-1-2-1': { predikat: 'SB', catatan: 'Sangat peduli kebersihan komposter dan rutin mengingatkan teman membuang sampah organik ke ember khusus.' },
      'sub-3-1-1': { predikat: 'BSH', catatan: 'Mampu menganalisis mengapa kompos berbau dan mengusulkan penambahan sekam kering.' },
      'sub-4-1-1': { predikat: 'BSH', catatan: 'Mendesain poster pemilahan sampah tiga dimensi yang menarik dan komunikatif.' },
      'sub-6-1-1': { predikat: 'SB', catatan: 'Memimpin kelompok dengan sabar, membagi tugas mencacah sampah dan membersihkan alat kerja.' }
    },
    catatanProses: 'Ahmad menunjukkan ketertarikan tinggi pada sains lingkungan. Sikap gotong royong dan kecintaannya pada kebersihan lingkungan sangat menonjol. Perlu terus didorong untuk membagikan pengalamannya kepada adik kelas.',
    rekomendasiTindakLanjut: 'Dilibatkan sebagai duta cilik Adiwiyata sekolah dan fasilitator sebaya pada kegiatan pemilahan sampah.',
    produkKarya: 'Poster 3D Edukasi Pilah Sampah & Kotak Komposter Takakura Mini',
    keaktifan: 'Sangat Aktif',
    waktuPenilaian: '2024-09-08'
  },
  {
    id: 'dpl-rec-002',
    projekId: 'prj-01',
    siswaId: 'sis-0002', // Aisyah Humaira
    capaianPerDimensi: {
      'sub-1-2-1': { predikat: 'BSH', catatan: 'Disiplin membuang sisa buah ke komposter dan menjaga kebersihan area sekitar.' },
      'sub-3-1-1': { predikat: 'BSH', catatan: 'Mencatat perubahan suhu dan warna kompos setiap pagi dengan teliti.' },
      'sub-4-1-1': { predikat: 'SB', catatan: 'Menghias wadah kompos dengan lukisan edukatif berbahan cat ramah lingkungan.' },
      'sub-6-1-1': { predikat: 'BSH', catatan: 'Kooperatif dalam kelompok dan selalu membantu kawan yang kesulitan menimbang sampah.' }
    },
    catatanProses: 'Aisyah sangat tekun dalam observasi harian. Kreativitas seninya memperkaya tampilan produk kompos kelompok sehingga terlihat bersih dan indah.',
    rekomendasiTindakLanjut: 'Tingkatkan kepercayaan diri saat mempresentasikan hasil pengamatan suhu komposter di hadapan kelas.',
    produkKarya: 'Buku Jurnal Harian Pengamatan Suhu Kompos Takakura',
    keaktifan: 'Sangat Aktif',
    waktuPenilaian: '2024-09-08'
  },
  {
    id: 'dpl-rec-003',
    projekId: 'prj-01',
    siswaId: 'sis-0003', // Budi Santoso
    capaianPerDimensi: {
      'sub-1-2-1': { predikat: 'MB', catatan: 'Mulai mau mencuci tangan setelah mengaduk kompos, perlu terus diingatkan soal sarung tangan.' },
      'sub-3-1-1': { predikat: 'MB', catatan: 'Mulai memahami beda sampah daun kering dan plastik pembungkus makanan.' },
      'sub-4-1-1': { predikat: 'BSH', catatan: 'Membantu membuat lubang biopori menggunakan bor tanah dengan gigih.' },
      'sub-6-1-1': { predikat: 'BSH', catatan: 'Senang membantu tugas fisik kelompok seperti mengangkat karung sekam.' }
    },
    catatanProses: 'Budi menunjukkan perkembangan positif dalam kerja kelompok. Energi fisiknya tersalurkan dengan baik dalam pembuatan lubang biopori.',
    rekomendasiTindakLanjut: 'Perlu bimbingan lanjutan dalam ketelitian mencatat data pengamatan dan kesabaran saat berdiskusi.',
    produkKarya: 'Pipa Biopori Resapan Air Berlubang dengan Tutup Kasa',
    keaktifan: 'Aktif',
    waktuPenilaian: '2024-09-08'
  },
  {
    id: 'dpl-rec-004',
    projekId: 'prj-01',
    siswaId: 'sis-0004', // Citra Dewi Lestari
    capaianPerDimensi: {
      'sub-1-2-1': { predikat: 'BSH', catatan: 'Membawa bekal dengan wadah guna ulang dan mengajak teman mengurangi sedotan plastik.' },
      'sub-3-1-1': { predikat: 'SB', catatan: 'Mampu menyusun hipotesis perbedaan waktu penguraian kulit pisang vs daun kering.' },
      'sub-4-1-1': { predikat: 'BSH', catatan: 'Merancang infografis digital sederhana tentang manfaat pupuk organik cair.' },
      'sub-6-1-1': { predikat: 'BSH', catatan: 'Berbagi peran secara adil dan menghargai masukan teman sekelompok.' }
    },
    catatanProses: 'Citra menunjukkan kemampuan penalaran kritis yang kuat. Argumen ilmiahnya tentang dekomposisi mikroorganisme sangat logis untuk anak kelas IV.',
    rekomendasiTindakLanjut: 'Bimbing untuk menjadi juru bicara utama kelompok pada gelar karya Green School Festival.',
    produkKarya: 'Infografis Manfaat Cairan Pupuk Organik Hasil Dekomposisi',
    keaktifan: 'Sangat Aktif',
    waktuPenilaian: '2024-09-08'
  },
  {
    id: 'dpl-rec-005',
    projekId: 'prj-01',
    siswaId: 'sis-0005', // Dika Pratama
    capaianPerDimensi: {
      'sub-1-2-1': { predikat: 'BB', catatan: 'Masih sering lupa mencuci tangan dan meletakkan alat bor sembarangan.' },
      'sub-3-1-1': { predikat: 'MB', catatan: 'Mulai dapat membedakan sampah basah dan kering setelah dibimbing fasilitator.' },
      'sub-4-1-1': { predikat: 'MB', catatan: 'Membantu menempelkan label tulisan pada ember komposter.' },
      'sub-6-1-1': { predikat: 'MB', catatan: 'Kadang asyik sendiri, namun mau bergabung jika diajak teman kelompoknya.' }
    },
    catatanProses: 'Dika membutuhkan pendampingan perancah (scaffolding) terkait konsentrasi dan keselamatan kerja saat praktikum luar ruangan.',
    rekomendasiTindakLanjut: 'Diberikan pasangan teman belajar (buddy system) yang teliti untuk mengingatkan keselamatan dan kebersihan kerja.',
    produkKarya: 'Labelisasi Wadah Pemilah Sampah Organik & Anorganik',
    keaktifan: 'Cukup',
    waktuPenilaian: '2024-09-08'
  }
];

// ============================================================================
// INITIAL LOG JURNAL AKTIVITAS KOKURIKULER
// ============================================================================
export const INITIAL_JURNAL_KOKURIKULER: JurnalAktivitasKokurikuler[] = [
  {
    id: 'jrn-kokur-01',
    projekId: 'prj-01',
    tanggal: '2024-08-05',
    tahap: 'Pengenalan',
    materiAktivitas: 'Nonton Bareng Film Dokumenter Edukatif "Bumi Kita & Bahaya Plastik", dilanjutkan curah gagasan ide solusi.',
    alokasiJP: 4,
    fasilitator: 'Sri Wahyuni, S.Pd., Gr.',
    lokasi: 'Ruang Kelas IV-A & Lab Komputer',
    alatDanBahan: 'Proyektor LCD, Laptop, Lembar Kerja Refleksi Peserta Didik (LKPD)',
    catatanRefleksi: 'Peserta didik sangat antusias melihat penyu laut yang tertelan sedotan plastik. Timbul rasa empati mendalam untuk mengurangi sampah plastik sekali pakai.',
    kendalaDanSolusi: 'Koneksi internet sempat melambat saat streaming video; diatasi dengan beralih ke video cadangan di flashdisk.',
    kehadiranPesertaPersen: 100
  },
  {
    id: 'jrn-kokur-02',
    projekId: 'prj-01',
    tanggal: '2024-08-19',
    tahap: 'Kontekstualisasi',
    materiAktivitas: 'Audit Sampah Harian Sekolah: Peserta didik mengumpulkan dan menimbang sampah kantin sekolah selama jam istirahat.',
    alokasiJP: 4,
    fasilitator: 'Ahmad Fauzi, S.Pd.I',
    lokasi: 'Area Kantin Sehat SDN & Tempat Penampungan Sementara',
    alatDanBahan: 'Timbangan gantung, sarung tangan karet, masker medis, lembar audit sampah',
    catatanRefleksi: 'Ditemukan bahwa 65% sampah kantin adalah sisa makanan (daun pisang, sisa nasi, kulit buah) yang sangat berpotensi menjadi kompos.',
    kendalaDanSolusi: 'Beberapa siswa merasa geli dengan sisa makanan berkuah; fasilitator membimbing menggunakan penjepit sampah higienis.',
    kehadiranPesertaPersen: 96
  },
  {
    id: 'jrn-kokur-03',
    projekId: 'prj-01',
    tanggal: '2024-09-02',
    tahap: 'Aksi',
    materiAktivitas: 'Praktik Pembuatan Komposter Takakura Cilik: Merakit bantalan sekam padi, kain penutup, dan memasukkan mikroorganisme EM4.',
    alokasiJP: 6,
    fasilitator: 'Sri Wahyuni, S.Pd., Gr.',
    lokasi: 'Taman Toga & Halaman Belakang Sekolah',
    alatDanBahan: 'Keranjang plastik berpori, bantal sekam, kardus bekas, cairan EM4, gula merah, air, pisau potong tumpul',
    catatanRefleksi: 'Anak-anak bekerja sama dalam kelompok beranggotakan 4-5 orang. Kerjasama dan pembagian peran berjalan sangat tertib.',
    kendalaDanSolusi: 'Cairan EM4 harus diencerkan dengan takaran pas; didampingi guru mapel IPAS.',
    kehadiranPesertaPersen: 100
  }
];

// ============================================================================
// INITIAL ARTEFAK / PORTOFOLIO KARYA SISWA KOKURIKULER
// ============================================================================
export const INITIAL_ARTEFAK_KOKURIKULER: ArtefakKaryaKokurikuler[] = [
  {
    id: 'artf-01',
    projekId: 'prj-01',
    judulKarya: 'Kotak Komposter Takakura Mini Ramah Lingkungan',
    jenisKarya: 'Produk Daur Ulang',
    siswaPenyusun: ['Ahmad Dani Pratama', 'Aisyah Humaira', 'Budi Santoso'],
    kelompok: 'Kelompok 1 (Sahabat Bumi)',
    deskripsi: 'Keranjang komposter portable yang dilapisi kardus isolator dan bantal sekam, siap memproses 1 kg sisa makanan per hari tanpa menimbulkan bau tak sedap.',
    nilaiKreativitas: 92,
    fotoUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400&auto=format&fit=crop&q=80',
    tanggalKarya: '2024-09-03'
  },
  {
    id: 'artf-02',
    projekId: 'prj-01',
    judulKarya: 'Poster 3D Edukasi Pemilahan Sampah Organik & Anorganik',
    jenisKarya: 'Poster/Infografis',
    siswaPenyusun: ['Citra Dewi Lestari', 'Dika Pratama'],
    kelompok: 'Kelompok 2 (Green Warriors)',
    deskripsi: 'Poster interaktif bergambar animasi tiga dimensi dari kertas daur ulang yang memandu cara membedakan sampah yang bisa dikompos dan didaur ulang.',
    nilaiKreativitas: 88,
    fotoUrl: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=400&auto=format&fit=crop&q=80',
    tanggalKarya: '2024-09-04'
  },
  {
    id: 'artf-03',
    projekId: 'prj-01',
    judulKarya: 'Pipa Biopori Resapan Air & Penyubur Tanah Kelas',
    jenisKarya: 'Model/Prototipe',
    siswaPenyusun: ['Fajar Nugraha', 'Gilang Ramadhan'],
    kelompok: 'Kelompok 3 (Penyelamat Air)',
    deskripsi: 'Modifikasi pipa PVC bekas berlubang yang ditanam sedalam 80 cm di halaman kelas untuk menampung sampah dedaunan kering dan menyerap air hujan.',
    nilaiKreativitas: 90,
    fotoUrl: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=400&auto=format&fit=crop&q=80',
    tanggalKarya: '2024-09-05'
  }
];
