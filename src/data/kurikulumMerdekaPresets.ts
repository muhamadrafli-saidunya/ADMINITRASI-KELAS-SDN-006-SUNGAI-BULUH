import { Subject, TujuanPembelajaran, GradeRecord, Student, AssessmentType } from '../types';

export type CurriculumPhaseKey = 'fase_a' | 'fase_b' | 'fase_c' | 'fase_d';

export interface CurriculumPhasePreset {
  key: CurriculumPhaseKey;
  label: string;
  shortLabel: string;
  gradeLevels: string;
  defaultClassName: string;
  description: string;
  icon: string;
  colorClass: string;
  subjects: Subject[];
  tujuanPembelajaran: TujuanPembelajaran[];
}

// -------------------------------------------------------------
// 1. FASE A (KELAS 1 - 2 SD)
// -------------------------------------------------------------
const SUBJECTS_FASE_A: Subject[] = [
  {
    id: 'mapel-fa-01',
    kode: 'PAI',
    nama: 'Pendidikan Agama & Budi Pekerti',
    kelompok: 'Umum',
    kktp: 75,
    guruPengampu: 'Ust. Ahmad Fauzan, S.Pd.I',
    iconName: 'HeartHandshake',
    deskripsi: 'Fondasi keimanan, akhlak mulia, dan pembiasaan ibadah harian anak usia dini.'
  },
  {
    id: 'mapel-fa-02',
    kode: 'PPKn',
    nama: 'Pendidikan Pancasila',
    kelompok: 'Umum',
    kktp: 75,
    guruPengampu: 'Sri Wahyuni, S.Pd., Gr.',
    iconName: 'ShieldCheck',
    deskripsi: 'Pengenalan simbol Pancasila, aturan rumah/sekolah, dan sikap gotong royong.'
  },
  {
    id: 'mapel-fa-03',
    kode: 'BIN',
    nama: 'Bahasa Indonesia',
    kelompok: 'Umum',
    kktp: 75,
    guruPengampu: 'Sri Wahyuni, S.Pd., Gr.',
    iconName: 'BookOpen',
    deskripsi: 'Penguatan literasi awal: fonik, merangkai suku kata, menyimak cerita bergambar, dan menulis kata.'
  },
  {
    id: 'mapel-fa-04',
    kode: 'MAT',
    nama: 'Matematika',
    kelompok: 'Umum',
    kktp: 70,
    guruPengampu: 'Sri Wahyuni, S.Pd., Gr.',
    iconName: 'Calculator',
    deskripsi: 'Penguatan numerasi awal: bilangan cacah 1-100, penjumlahan/pengurangan konkret, dan bentuk bangun datar.'
  },
  {
    id: 'mapel-fa-05',
    kode: 'PJOK',
    nama: 'Pendidikan Jasmani, Olahraga, & Kesehatan',
    kelompok: 'Umum',
    kktp: 75,
    guruPengampu: 'Wahyu Hidayat, S.Pd.Jas',
    iconName: 'Activity',
    deskripsi: 'Pengembangan motorik kasar & halus, gerak lokomotor, dan kebiasaan hidup bersih.'
  },
  {
    id: 'mapel-fa-06',
    kode: 'SENI',
    nama: 'Seni Rupa & Prakarya',
    kelompok: 'Pilihan',
    kktp: 75,
    guruPengampu: 'Sri Wahyuni, S.Pd., Gr.',
    iconName: 'Palette',
    deskripsi: 'Eksplorasi garis, warna primer, kolase kertas/bahan alam, dan plastisin kreatif.'
  },
  {
    id: 'mapel-fa-07',
    kode: 'ING',
    nama: 'Bahasa Inggris (Pengenalan)',
    kelompok: 'Muatan Lokal',
    kktp: 70,
    guruPengampu: 'Miss Clarissa Melinda, S.Pd.',
    iconName: 'Languages',
    deskripsi: 'Kosakata dasar sehari-hari: salam, angka 1-20, warna, benda kelas, dan hewan.'
  },
  {
    id: 'mapel-fa-08',
    kode: 'PLBJ',
    nama: 'Pendidikan Lingkungan & Budaya Jakarta (PLBJ)',
    kelompok: 'Muatan Lokal',
    kktp: 75,
    guruPengampu: 'Sri Wahyuni, S.Pd., Gr.',
    iconName: 'Building2',
    deskripsi: 'Mengenal lagu anak daerah, permainan tradisional, makanan khas, dan cinta lingkungan.'
  }
];

const TP_FASE_A: TujuanPembelajaran[] = [
  // PAI Fase A
  {
    id: 'tp-fa-pai-01',
    mapelId: 'mapel-fa-01',
    kode: 'TP 1',
    lingkupMateri: 'Huruf Hijaiyah & Surat Al-Fatihah',
    deskripsi: 'Mengenal dan melafalkan huruf hijaiyah berharakat serta menghafal Q.S. Al-Fatihah dengan lancar.',
    semester: '1 (Ganjil)',
    fase: 'Fase A (Kelas 1 - 2)',
    kktp: 75,
    ringkasanRaporTuntas: 'Sangat lancar melafalkan huruf hijaiyah dan hafal surat Al-Fatihah',
    ringkasanRaporPerluBimbingan: 'Perlu latihan membedakan tanda baca fathah, kasrah, dan dhammah'
  },
  {
    id: 'tp-fa-pai-02',
    mapelId: 'mapel-fa-01',
    kode: 'TP 2',
    lingkupMateri: 'Rukun Iman & Asmaul Husna Dasar',
    deskripsi: 'Menyebutkan rukun iman dan meneladani Asmaul Husna (Ar-Rahman, Ar-Rahim) dalam kasih sayang sesama.',
    semester: '1 (Ganjil)',
    fase: 'Fase A (Kelas 1 - 2)',
    kktp: 75,
    ringkasanRaporTuntas: 'Memahami rukun iman dan menunjukkan sikap penyayang kepada teman',
    ringkasanRaporPerluBimbingan: 'Perlu pembiasaan menyebutkan 6 rukun iman secara urut'
  },
  {
    id: 'tp-fa-pai-03',
    mapelId: 'mapel-fa-01',
    kode: 'TP 3',
    lingkupMateri: 'Adab Harian & Doa Sebelum/Sesudah Makan',
    deskripsi: 'Mempraktikkan adab makan, minum, dan berdoa sebelum serta sesudah makan dengan tertib.',
    semester: '1 (Ganjil)',
    fase: 'Fase A (Kelas 1 - 2)',
    kktp: 75,
    ringkasanRaporTuntas: 'Tertib menjalankan adab makan menggunakan tangan kanan dan rajin berdoa',
    ringkasanRaporPerluBimbingan: 'Perlu diingatkan untuk senantiasa berdoa sebelum makan'
  },
  {
    id: 'tp-fa-pai-04',
    mapelId: 'mapel-fa-01',
    kode: 'TP 4',
    lingkupMateri: 'Kebersihan Diri & Thaharah Sederhana',
    deskripsi: 'Mempraktikkan tata cara mencuci tangan, berwudhu sederhana, dan menjaga kebersihan pakaian.',
    semester: '1 (Ganjil)',
    fase: 'Fase A (Kelas 1 - 2)',
    kktp: 75,
    ringkasanRaporTuntas: 'Mandiri dalam menjaga kebersihan diri dan tertib saat praktik berwudhu',
    ringkasanRaporPerluBimbingan: 'Perlu bimbingan dalam urutan membasuh anggota wudhu'
  },

  // PPKn Fase A
  {
    id: 'tp-fa-ppkn-01',
    mapelId: 'mapel-fa-02',
    kode: 'TP 1',
    lingkupMateri: 'Simbol Sila-Sila Pancasila',
    deskripsi: 'Mengenal simbol dan bunyi sila-sila Pancasila pada lambang Garuda Pancasila.',
    semester: '1 (Ganjil)',
    fase: 'Fase A (Kelas 1 - 2)',
    kktp: 75,
    ringkasanRaporTuntas: 'Sangat hafal bunyi lima sila Pancasila dan mengenali lambang simbolnya',
    ringkasanRaporPerluBimbingan: 'Perlu bimbingan dalam mencocokkan simbol pohon beringin dan padi kapas'
  },
  {
    id: 'tp-fa-ppkn-02',
    mapelId: 'mapel-fa-02',
    kode: 'TP 2',
    lingkupMateri: 'Aturan di Rumah dan di Sekolah',
    deskripsi: 'Mengidentifikasi dan menaati aturan sederhana saat belajar di kelas serta berpamitan kepada orang tua.',
    semester: '1 (Ganjil)',
    fase: 'Fase A (Kelas 1 - 2)',
    kktp: 75,
    ringkasanRaporTuntas: 'Disiplin mematuhi tata tertib kelas dan santun kepada guru',
    ringkasanRaporPerluBimbingan: 'Perlu pembiasaan merapikan kembali alat tulis setelah belajar'
  },
  {
    id: 'tp-fa-ppkn-03',
    mapelId: 'mapel-fa-02',
    kode: 'TP 3',
    lingkupMateri: 'Identitas Diri & Keberagaman Teman',
    deskripsi: 'Menyebutkan identitas diri, ciri fisik, dan menghargai keberagaman teman sekelas.',
    semester: '1 (Ganjil)',
    fase: 'Fase A (Kelas 1 - 2)',
    kktp: 75,
    ringkasanRaporTuntas: 'Percaya diri menceritakan identitas diri dan ramah berteman dengan siapa saja',
    ringkasanRaporPerluBimbingan: 'Perlu dorongan rasa percaya diri saat memperkenalkan diri di depan kelas'
  },
  {
    id: 'tp-fa-ppkn-04',
    mapelId: 'mapel-fa-02',
    kode: 'TP 4',
    lingkupMateri: 'Gotong Royong & Kerja Sama di Kelas',
    deskripsi: 'Membiasakan sikap gotong royong, berbagi alat belajar, dan bekerja sama membersihkan meja belajar.',
    semester: '1 (Ganjil)',
    fase: 'Fase A (Kelas 1 - 2)',
    kktp: 75,
    ringkasanRaporTuntas: 'Sangat peduli, suka berbagi, dan antusias membantu teman yang kesulitan',
    ringkasanRaporPerluBimbingan: 'Perlu pembiasaan untuk bersedia berbagi alat mewarnai bersama teman'
  },

  // Bahasa Indonesia Fase A
  {
    id: 'tp-fa-bin-01',
    mapelId: 'mapel-fa-03',
    kode: 'TP 1',
    lingkupMateri: 'Pengenalan Bunyi Huruf (Fonik) & Suku Kata',
    deskripsi: 'Mengenal bentuk dan bunyi huruf alfabet serta merangkai suku kata menjadi kata sederhana.',
    semester: '1 (Ganjil)',
    fase: 'Fase A (Kelas 1 - 2)',
    kktp: 75,
    ringkasanRaporTuntas: 'Sangat terampil membaca suku kata dan merangkai kata dengan lancar',
    ringkasanRaporPerluBimbingan: 'Perlu bimbingan dalam membedakan bunyi huruf b dan d'
  },
  {
    id: 'tp-fa-bin-02',
    mapelId: 'mapel-fa-03',
    kode: 'TP 2',
    lingkupMateri: 'Menyimak Cerita Gambar & Menjawab Pertanyaan',
    deskripsi: 'Menyimak teks dongeng bergambar dan menceritakan kembali tokoh utama serta alur cerita.',
    semester: '1 (Ganjil)',
    fase: 'Fase A (Kelas 1 - 2)',
    kktp: 75,
    ringkasanRaporTuntas: 'Mampu menyimak cerita dengan saksama dan menjawab pertanyaan isi bacaan',
    ringkasanRaporPerluBimbingan: 'Perlu latihan fokus saat mendengarkan cerita guru'
  },
  {
    id: 'tp-fa-bin-03',
    mapelId: 'mapel-fa-03',
    kode: 'TP 3',
    lingkupMateri: 'Kosakata Benda Sekitar & Kata Ajaib (Tolong, Maaf, Terima Kasih)',
    deskripsi: 'Menggunakan kata tolong, maaf, terima kasih, dan permisi dalam percakapan sopan sehari-hari.',
    semester: '1 (Ganjil)',
    fase: 'Fase A (Kelas 1 - 2)',
    kktp: 75,
    ringkasanRaporTuntas: 'Santun berbahasa dan konsisten mengucapkan kata tolong serta terima kasih',
    ringkasanRaporPerluBimbingan: 'Perlu pembiasaan mengucapkan kata maaf saat berbuat keliru'
  },
  {
    id: 'tp-fa-bin-04',
    mapelId: 'mapel-fa-03',
    kode: 'TP 4',
    lingkupMateri: 'Menulis Huruf Tegak & Kalimat Pendek',
    deskripsi: 'Menulis huruf dan kata sederhana dengan jarak antarhuruf yang rapi serta posisi duduk yang benar.',
    semester: '1 (Ganjil)',
    fase: 'Fase A (Kelas 1 - 2)',
    kktp: 75,
    ringkasanRaporTuntas: 'Tulisan tangan rapi, jelas terbaca, dan memperhatikan posisi spasi kata',
    ringkasanRaporPerluBimbingan: 'Perlu bimbingan dalam kerapian bentuk huruf pada buku garis tiga'
  },

  // Matematika Fase A
  {
    id: 'tp-fa-mat-01',
    mapelId: 'mapel-fa-04',
    kode: 'TP 1',
    lingkupMateri: 'Membilang Bilangan Cacah sampai 20 & 100',
    deskripsi: 'Membilang, membaca, menulis lambang bilangan, dan membandingkan banyak benda sampai 20.',
    semester: '1 (Ganjil)',
    fase: 'Fase A (Kelas 1 - 2)',
    kktp: 70,
    ringkasanRaporTuntas: 'Cepat dan tepat dalam membilang benda serta mengurutkan angka 1 sampai 20',
    ringkasanRaporPerluBimbingan: 'Perlu latihan menggunakan benda konkret untuk membandingkan lebih banyak/sedikit'
  },
  {
    id: 'tp-fa-mat-02',
    mapelId: 'mapel-fa-04',
    kode: 'TP 2',
    lingkupMateri: 'Penjumlahan & Pengurangan Bilangan Dasar',
    deskripsi: 'Menyelesaikan operasi penjumlahan dan pengurangan benda konkret sampai dengan angka 20.',
    semester: '1 (Ganjil)',
    fase: 'Fase A (Kelas 1 - 2)',
    kktp: 70,
    ringkasanRaporTuntas: 'Mahir menghitung penjumlahan dan pengurangan dasar menggunakan jari atau gambar',
    ringkasanRaporPerluBimbingan: 'Perlu latihan berulang pada pengurangan dengan teknik hitung mundur'
  },
  {
    id: 'tp-fa-mat-03',
    mapelId: 'mapel-fa-04',
    kode: 'TP 3',
    lingkupMateri: 'Bentuk Bangun Datar (Segitiga, Segiempat, Lingkaran)',
    deskripsi: 'Mengenal dan mengelompokkan aneka bentuk bangun datar di lingkungan kelas.',
    semester: '1 (Ganjil)',
    fase: 'Fase A (Kelas 1 - 2)',
    kktp: 70,
    ringkasanRaporTuntas: 'Sangat tepat membedakan lingkaran, segitiga, dan persegi di lingkungan sekitar',
    ringkasanRaporPerluBimbingan: 'Perlu bimbingan dalam membedakan persegi dan persegi panjang'
  },
  {
    id: 'tp-fa-mat-04',
    mapelId: 'mapel-fa-04',
    kode: 'TP 4',
    lingkupMateri: 'Pengukuran Panjang & Berat Tidak Baku',
    deskripsi: 'Membandingkan panjang dan berat benda menggunakan satuan tidak baku (jengkal, langkah, timbangan sederhana).',
    semester: '1 (Ganjil)',
    fase: 'Fase A (Kelas 1 - 2)',
    kktp: 70,
    ringkasanRaporTuntas: 'Mampu membandingkan benda lebih panjang/pendek dan lebih berat/ringan',
    ringkasanRaporPerluBimbingan: 'Perlu pendampingan saat mengukur panjang buku dengan klip kertas'
  },

  // PJOK Fase A
  {
    id: 'tp-fa-pjok-01',
    mapelId: 'mapel-fa-05',
    kode: 'TP 1',
    lingkupMateri: 'Pola Gerak Dasar Lokomotor',
    deskripsi: 'Mempraktikkan variasi pola gerak dasar berjalan lurus, berlari pelan, dan melompat melewati rintangan.',
    semester: '1 (Ganjil)',
    fase: 'Fase A (Kelas 1 - 2)',
    kktp: 75,
    ringkasanRaporTuntas: 'Lincah dan terkoordinasi dengan baik saat berjalan, berlari, dan melompat',
    ringkasanRaporPerluBimbingan: 'Perlu latihan menjaga keseimbangan saat mendarat setelah melompat'
  },
  {
    id: 'tp-fa-pjok-02',
    mapelId: 'mapel-fa-05',
    kode: 'TP 2',
    lingkupMateri: 'Pola Gerak Non-Lokomotor & Keseimbangan',
    deskripsi: 'Mempraktikkan gerak menekuk, memutar lengan, mengayun, dan berdiri dengan satu kaki.',
    semester: '1 (Ganjil)',
    fase: 'Fase A (Kelas 1 - 2)',
    kktp: 75,
    ringkasanRaporTuntas: 'Keseimbangan tubuh prima saat berdiri satu kaki dan senam pemanasan',
    ringkasanRaporPerluBimbingan: 'Perlu latihan peregangan otot lengan dan tungkai'
  },
  {
    id: 'tp-fa-pjok-03',
    mapelId: 'mapel-fa-05',
    kode: 'TP 3',
    lingkupMateri: 'Pola Gerak Manipulatif Lempar Tangkap',
    deskripsi: 'Mempraktikkan gerak melempar dan menangkap bola kecil bersama teman secara berpasangan.',
    semester: '1 (Ganjil)',
    fase: 'Fase A (Kelas 1 - 2)',
    kktp: 75,
    ringkasanRaporTuntas: 'Tangkas menangkap bola kecil dan terampil melempar ke arah sasaran',
    ringkasanRaporPerluBimbingan: 'Perlu latihan fokus pandangan mata saat menyambut bola'
  },
  {
    id: 'tp-fa-pjok-04',
    mapelId: 'mapel-fa-05',
    kode: 'TP 4',
    lingkupMateri: 'Menjaga Kebersihan Tubuh & Gigi',
    deskripsi: 'Mengenal cara menggosok gigi yang benar, mencuci tangan memakai sabun, dan memakai baju bersih.',
    semester: '1 (Ganjil)',
    fase: 'Fase A (Kelas 1 - 2)',
    kktp: 75,
    ringkasanRaporTuntas: 'Mandiri dan terbiasa mencuci tangan sebelum makan serta menjaga kerapian pakaian',
    ringkasanRaporPerluBimbingan: 'Perlu pembiasaan menggosok gigi pagi dan sebelum tidur malam'
  },

  // Seni Rupa Fase A
  {
    id: 'tp-fa-seni-01',
    mapelId: 'mapel-fa-06',
    kode: 'TP 1',
    lingkupMateri: 'Eksplorasi Garis & Warna Primer',
    deskripsi: 'Mengenal aneka garis (lurus, lengkung, zigzag) dan mencampur warna primer (merah, kuning, biru).',
    semester: '1 (Ganjil)',
    fase: 'Fase A (Kelas 1 - 2)',
    kktp: 75,
    ringkasanRaporTuntas: 'Kreatif memadukan aneka garis dan warna primer menjadi gambar pemandangan ceria',
    ringkasanRaporPerluBimbingan: 'Perlu ketelitian dalam mewarnai agar tidak keluar dari garis batas gambar'
  },
  {
    id: 'tp-fa-seni-02',
    mapelId: 'mapel-fa-06',
    kode: 'TP 2',
    lingkupMateri: 'Karya Kolase Kertas Origami & Daun Kering',
    deskripsi: 'Membuat karya kolase dengan menempelkan sobekan kertas warna atau dedaunan pada pola gambar hewan/buah.',
    semester: '1 (Ganjil)',
    fase: 'Fase A (Kelas 1 - 2)',
    kktp: 75,
    ringkasanRaporTuntas: 'Sangat rapi dan sabar saat menempelkan sobekan kertas kolase',
    ringkasanRaporPerluBimbingan: 'Perlu bimbingan dalam meratakan penggunaan lem kertas'
  },
  {
    id: 'tp-fa-seni-03',
    mapelId: 'mapel-fa-06',
    kode: 'TP 3',
    lingkupMateri: 'Membentuk Benda dengan Plastisin',
    deskripsi: 'Membuat bentuk 3 dimensi sederhana (buah, hewan, kendaraan) menggunakan lilin mainan/plastisin.',
    semester: '1 (Ganjil)',
    fase: 'Fase A (Kelas 1 - 2)',
    kktp: 75,
    ringkasanRaporTuntas: 'Imaginatif dan terampil meremas plastisin menjadi aneka bentuk buah dan hewan',
    ringkasanRaporPerluBimbingan: 'Perlu latihan kelenturan jemari saat membentuk bulatan halus'
  },
  {
    id: 'tp-fa-seni-04',
    mapelId: 'mapel-fa-06',
    kode: 'TP 4',
    lingkupMateri: 'Cetak Cap Jari & Pelepah Daun',
    deskripsi: 'Membuat pola hiasan dinding dengan teknik cap jari tangan dan penampang sayuran/pelepah pisang.',
    semester: '1 (Ganjil)',
    fase: 'Fase A (Kelas 1 - 2)',
    kktp: 75,
    ringkasanRaporTuntas: 'Antusias bereksperimen dengan cap sidik jari membentuk pola bunga yang indah',
    ringkasanRaporPerluBimbingan: 'Perlu menjaga kebersihan tangan setelah selesai mencap'
  },

  // Bahasa Inggris Fase A
  {
    id: 'tp-fa-ing-01',
    mapelId: 'mapel-fa-07',
    kode: 'TP 1',
    lingkupMateri: 'Greetings & Introducing Myself',
    deskripsi: 'Merespons sapaan ramah (Hello, Good Morning) dan menyebutkan nama dalam bahasa Inggris sederhana.',
    semester: '1 (Ganjil)',
    fase: 'Fase A (Kelas 1 - 2)',
    kktp: 70,
    ringkasanRaporTuntas: 'Percaya diri menyapa guru dan teman dengan ucapan Good Morning dan My name is...',
    ringkasanRaporPerluBimbingan: 'Perlu dorongan rasa percaya diri saat melafalkan sapaan bahasa Inggris'
  },
  {
    id: 'tp-fa-ing-02',
    mapelId: 'mapel-fa-07',
    kode: 'TP 2',
    lingkupMateri: 'Numbers 1 to 20 & Colors',
    deskripsi: 'Menyebutkan angka 1-20 dan warna-warna dasar (red, blue, yellow, green, black) dalam bahasa Inggris.',
    semester: '1 (Ganjil)',
    fase: 'Fase A (Kelas 1 - 2)',
    kktp: 70,
    ringkasanRaporTuntas: 'Cepat menghafal nama warna dan berhitung 1 sampai 20 dalam bahasa Inggris',
    ringkasanRaporPerluBimbingan: 'Perlu latihan pelafalan angka eleven, twelve, dan thirteen'
  },
  {
    id: 'tp-fa-ing-03',
    mapelId: 'mapel-fa-07',
    kode: 'TP 3',
    lingkupMateri: 'Classroom Objects (School Things)',
    deskripsi: 'Menunjukkan dan menyebutkan nama benda-benda di dalam kelas (book, pencil, bag, chair, table).',
    semester: '1 (Ganjil)',
    fase: 'Fase A (Kelas 1 - 2)',
    kktp: 70,
    ringkasanRaporTuntas: 'Mampu menunjuk dan menyebutkan alat tulis dalam kelas dengan tepat',
    ringkasanRaporPerluBimbingan: 'Perlu bimbingan membedakan eraser dan ruler'
  },
  {
    id: 'tp-fa-ing-04',
    mapelId: 'mapel-fa-07',
    kode: 'TP 4',
    lingkupMateri: 'Animals & Fruits Vocabulary',
    deskripsi: 'Mengenal nama-nama hewan peliharaan (cat, dog, bird, fish) dan buah favorit (apple, banana, orange).',
    semester: '1 (Ganjil)',
    fase: 'Fase A (Kelas 1 - 2)',
    kktp: 70,
    ringkasanRaporTuntas: 'Senang bernyanyi lagu hewan dan menyebutkan buah favoritnya dalam bahasa Inggris',
    ringkasanRaporPerluBimbingan: 'Perlu latihan mengingat kosakata nama hewan ternak'
  },

  // PLBJ Fase A
  {
    id: 'tp-fa-plbj-01',
    mapelId: 'mapel-fa-08',
    kode: 'TP 1',
    lingkupMateri: 'Lagu Anak Betawi (Kicir-Kicir / Ondel-Ondel)',
    deskripsi: 'Menyanyikan lagu anak khas Betawi dan mengenal boneka Ondel-Ondel sebagai ikon kota Jakarta.',
    semester: '1 (Ganjil)',
    fase: 'Fase A (Kelas 1 - 2)',
    kktp: 75,
    ringkasanRaporTuntas: 'Ceria menyanyikan lagu Kicir-Kicir dan menceritakan ciri boneka Ondel-Ondel',
    ringkasanRaporPerluBimbingan: 'Perlu dorongan keberanian saat bernyanyi di depan kelas'
  },
  {
    id: 'tp-fa-plbj-02',
    mapelId: 'mapel-fa-08',
    kode: 'TP 2',
    lingkupMateri: 'Permainan Tradisional (Cingciripit & Ular Naga)',
    deskripsi: 'Mempraktikkan aturan permainan tradisional Betawi bersama teman sekelas dengan riang dan rukun.',
    semester: '1 (Ganjil)',
    fase: 'Fase A (Kelas 1 - 2)',
    kktp: 75,
    ringkasanRaporTuntas: 'Sportif dan kompak saat bermain Cingciripit dan Ular Naga bersama teman',
    ringkasanRaporPerluBimbingan: 'Perlu pembiasaan bersikap antre saat giliran bermain'
  },
  {
    id: 'tp-fa-plbj-03',
    mapelId: 'mapel-fa-08',
    kode: 'TP 3',
    lingkupMateri: 'Kuliner Khas (Kue Cucur & Es Selendang Mayang)',
    deskripsi: 'Mengenal aneka jajanan pasar tradisional Betawi dan rasa manisnya.',
    semester: '1 (Ganjil)',
    fase: 'Fase A (Kelas 1 - 2)',
    kktp: 75,
    ringkasanRaporTuntas: 'Mengenali kue tradisional Betawi dan menyukai makanan sehat khas daerah',
    ringkasanRaporPerluBimbingan: 'Perlu pendampingan saat menyebutkan bahan kue cucur'
  },
  {
    id: 'tp-fa-plbj-04',
    mapelId: 'mapel-fa-08',
    kode: 'TP 4',
    lingkupMateri: 'Menjaga Kebersihan Kelas & Membuang Sampah',
    deskripsi: 'Membiasakan membuang sampah pada tempatnya dan merawat tanaman hias di halaman sekolah.',
    semester: '1 (Ganjil)',
    fase: 'Fase A (Kelas 1 - 2)',
    kktp: 75,
    ringkasanRaporTuntas: 'Rajin membuang bungkus makanan ke tempat sampah dan menjaga keasrian kelas',
    ringkasanRaporPerluBimbingan: 'Perlu diingatkan untuk tidak meninggalkan sampah di kolong meja'
  }
];

// -------------------------------------------------------------
// 2. FASE B (KELAS 3 - 4 SD)
// -------------------------------------------------------------
const SUBJECTS_FASE_B: Subject[] = [
  {
    id: 'mapel-fb-01',
    kode: 'PAI',
    nama: 'Pendidikan Agama & Budi Pekerti',
    kelompok: 'Umum',
    kktp: 78,
    guruPengampu: 'Ust. Ahmad Fauzan, S.Pd.I',
    iconName: 'HeartHandshake',
    deskripsi: 'Pemahaman nilai Al-Qur’an, Asmaul Husna, sikap toleransi, dan tata cara ibadah fardhu.'
  },
  {
    id: 'mapel-fb-02',
    kode: 'PPKn',
    nama: 'Pendidikan Pancasila',
    kelompok: 'Umum',
    kktp: 75,
    guruPengampu: 'Sri Wahyuni, S.Pd., Gr.',
    iconName: 'ShieldCheck',
    deskripsi: 'Makna sila-sila Pancasila, norma konstitusi, hak & kewajiban, serta musyawarah mufakat.'
  },
  {
    id: 'mapel-fb-03',
    kode: 'BIN',
    nama: 'Bahasa Indonesia',
    kelompok: 'Umum',
    kktp: 75,
    guruPengampu: 'Sri Wahyuni, S.Pd., Gr.',
    iconName: 'BookOpen',
    deskripsi: 'Teks narasi, ide pokok bacaan, kosakata kamus (KBBI), wawancara, dan teks prosedur.'
  },
  {
    id: 'mapel-fb-04',
    kode: 'MAT',
    nama: 'Matematika',
    kelompok: 'Umum',
    kktp: 70,
    guruPengampu: 'Sri Wahyuni, S.Pd., Gr.',
    iconName: 'Calculator',
    deskripsi: 'Bilangan cacah sampai 10.000, operasi hitung campuran/porogapit, pecahan senilai, dan keliling luas.'
  },
  {
    id: 'mapel-fb-05',
    kode: 'IPAS',
    nama: 'Ilmu Pengetahuan Alam & Sosial (IPAS)',
    kelompok: 'Umum',
    kktp: 72,
    guruPengampu: 'Sri Wahyuni, S.Pd., Gr.',
    iconName: 'Compass',
    deskripsi: 'Bagian tumbuhan & fotosintesis, wujud zat, ragam gaya di sekitar, dan kearifan lokal daerah.'
  },
  {
    id: 'mapel-fb-06',
    kode: 'PJOK',
    nama: 'Pendidikan Jasmani, Olahraga, & Kesehatan',
    kelompok: 'Umum',
    kktp: 75,
    guruPengampu: 'Wahyu Hidayat, S.Pd.Jas',
    iconName: 'Activity',
    deskripsi: 'Variasi gerak lokomotor, permainan bola kecil/besar, senam lantai, dan kesehatan pribadi.'
  },
  {
    id: 'mapel-fb-07',
    kode: 'SENI',
    nama: 'Seni Rupa & Prakarya',
    kelompok: 'Pilihan',
    kktp: 75,
    guruPengampu: 'Sri Wahyuni, S.Pd., Gr.',
    iconName: 'Palette',
    deskripsi: 'Komposisi rupa, cetak cap alami, keseimbangan dekoratif, dan kriya daur ulang 3 dimensi.'
  },
  {
    id: 'mapel-fb-08',
    kode: 'ING',
    nama: 'Bahasa Inggris',
    kelompok: 'Muatan Lokal',
    kktp: 70,
    guruPengampu: 'Miss Clarissa Melinda, S.Pd.',
    iconName: 'Languages',
    deskripsi: 'Aktivitas sehari-hari, waktu/jam, anggota keluarga, ruangan rumah, dan deskripsi hewan.'
  },
  {
    id: 'mapel-fb-09',
    kode: 'PLBJ',
    nama: 'Pendidikan Lingkungan & Budaya Jakarta (PLBJ)',
    kelompok: 'Muatan Lokal',
    kktp: 75,
    guruPengampu: 'Sri Wahyuni, S.Pd., Gr.',
    iconName: 'Building2',
    deskripsi: 'Lagu & tari Sirih Kuning, kuliner tradisional Betawi, rumah adat Kebaya, dan permainan rakyat.'
  }
];

const TP_FASE_B: TujuanPembelajaran[] = [
  // PPKn Fase B
  {
    id: 'tp-fb-ppkn-01',
    mapelId: 'mapel-fb-02',
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
    id: 'tp-fb-ppkn-02',
    mapelId: 'mapel-fb-02',
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
    id: 'tp-fb-ppkn-03',
    mapelId: 'mapel-fb-02',
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
    id: 'tp-fb-ppkn-04',
    mapelId: 'mapel-fb-02',
    kode: 'TP 4',
    lingkupMateri: 'Bab 2: Musyawarah dan Mufakat',
    deskripsi: 'Menyampaikan pendapat secara santun dan menghargai perbedaan pendapat dalam musyawarah kelas.',
    semester: '1 (Ganjil)',
    fase: 'Fase B (Kelas 4)',
    kktp: 75,
    ringkasanRaporTuntas: 'Aktif berpartisipasi dan santun dalam musyawarah penyelesaian masalah kelas',
    ringkasanRaporPerluBimbingan: 'Perlu dorongan rasa percaya diri saat menyampaikan argumen musyawarah'
  },

  // Bahasa Indonesia Fase B
  {
    id: 'tp-fb-bin-01',
    mapelId: 'mapel-fb-03',
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
    id: 'tp-fb-bin-02',
    mapelId: 'mapel-fb-03',
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
    id: 'tp-fb-bin-03',
    mapelId: 'mapel-fb-03',
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
    id: 'tp-fb-bin-04',
    mapelId: 'mapel-fb-03',
    kode: 'TP 4',
    lingkupMateri: 'Bab 4: Teks Prosedur & Presentasi',
    deskripsi: 'Menyajikan teks prosedur langkah-langkah membuat sesuatu secara lisan dan tulisan.',
    semester: '1 (Ganjil)',
    fase: 'Fase B (Kelas 4)',
    kktp: 75,
    ringkasanRaporTuntas: 'Percaya diri mempresentasikan teks petunjuk/prosedur di depan teman sekelas',
    ringkasanRaporPerluBimbingan: 'Perlu latihan menyusun urutan langkah teks petunjuk secara kronologis'
  },

  // Matematika Fase B
  {
    id: 'tp-fb-mat-01',
    mapelId: 'mapel-fb-04',
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
    id: 'tp-fb-mat-02',
    mapelId: 'mapel-fb-04',
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
    id: 'tp-fb-mat-03',
    mapelId: 'mapel-fb-04',
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
    id: 'tp-fb-mat-04',
    mapelId: 'mapel-fb-04',
    kode: 'TP 4',
    lingkupMateri: 'Bab 3: Pola Gambar & Bilangan',
    deskripsi: 'Mengidentifikasi, menduplikasi, dan mengembangkan pola bilangan membesar dan mengecil.',
    semester: '1 (Ganjil)',
    fase: 'Fase B (Kelas 4)',
    kktp: 70,
    ringkasanRaporTuntas: 'Sangat tanggap menemukan keteraturan relasi rumus pola barisan bilangan',
    ringkasanRaporPerluBimbingan: 'Perlu latihan dalam menganalisis selisih deret pola gambar'
  },

  // IPAS Fase B
  {
    id: 'tp-fb-ipas-01',
    mapelId: 'mapel-fb-05',
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
    id: 'tp-fb-ipas-02',
    mapelId: 'mapel-fb-05',
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
    id: 'tp-fb-ipas-03',
    mapelId: 'mapel-fb-05',
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
    id: 'tp-fb-ipas-04',
    mapelId: 'mapel-fb-05',
    kode: 'TP 4',
    lingkupMateri: 'Bab 4: Energi yang Berubah',
    deskripsi: 'Menjelaskan konsep transformasi energi (energi gerak, listrik, panas, cahaya, bunyi).',
    semester: '1 (Ganjil)',
    fase: 'Fase B (Kelas 4)',
    kktp: 72,
    ringkasanRaporTuntas: 'Mampu memetakan alur perubahan bentuk energi pada piranti teknologi sekitar',
    ringkasanRaporPerluBimbingan: 'Perlu bimbingan dalam membedakan sumber energi terbarukan dan fosil'
  },

  // PAI Fase B
  {
    id: 'tp-fb-pai-01',
    mapelId: 'mapel-fb-01',
    kode: 'TP 1',
    lingkupMateri: 'Bab 1: Al-Qur’an Surat Al-Hujurat: 13',
    deskripsi: 'Membaca, menghafal, dan memahami pesan pokok keragaman sebagai sunnatullah.',
    semester: '1 (Ganjil)',
    fase: 'Fase B (Kelas 4)',
    kktp: 78,
    ringkasanRaporTuntas: 'Fasih membaca Al-Qur’an dengan tajwid yang baik dan hafal arti surat',
    ringkasanRaporPerluBimbingan: 'Perlu pembiasaan makhraj huruf dan hukum bacaan ikhfa/idgham'
  },
  {
    id: 'tp-fb-pai-02',
    mapelId: 'mapel-fb-01',
    kode: 'TP 2',
    lingkupMateri: 'Bab 2: Asmaul Husna (Al-Malik, Al-Quddus)',
    deskripsi: 'Meneladani sifat-sifat mulia Allah Swt dalam Asmaul Husna dalam perilaku terpuji sehari-hari.',
    semester: '1 (Ganjil)',
    fase: 'Fase B (Kelas 4)',
    kktp: 78,
    ringkasanRaporTuntas: 'Berakhlak mulia dan mampu mengaitkan asmaul husna dengan kebersihan hati',
    ringkasanRaporPerluBimbingan: 'Perlu dorongan dalam mengamalkan perilaku rendah hati dan ikhlas'
  },
  {
    id: 'tp-fb-pai-03',
    mapelId: 'mapel-fb-01',
    kode: 'TP 3',
    lingkupMateri: 'Bab 3: Indahnya Saling Menghargai & Sikap Toleransi',
    deskripsi: 'Menjelaskan arti keragaman suku dan agama serta menerapkan sikap toleransi antarsesama.',
    semester: '1 (Ganjil)',
    fase: 'Fase B (Kelas 4)',
    kktp: 78,
    ringkasanRaporTuntas: 'Sangat santun dan konsisten menunjukkan sikap toleransi antarteman',
    ringkasanRaporPerluBimbingan: 'Perlu pembiasaan sikap saling menghargai perbedaan pendapat'
  },
  {
    id: 'tp-fb-pai-04',
    mapelId: 'mapel-fb-01',
    kode: 'TP 4',
    lingkupMateri: 'Bab 4: Ketentuan dan Tata Cara Shalat Berjamaah',
    deskripsi: 'Mempraktikkan ketentuan shalat berjamaah, posisi imam dan makmum, serta adab di masjid.',
    semester: '1 (Ganjil)',
    fase: 'Fase B (Kelas 4)',
    kktp: 78,
    ringkasanRaporTuntas: 'Tertib mempraktikkan tata cara shalat berjamaah dan adab di masjid',
    ringkasanRaporPerluBimbingan: 'Perlu bimbingan dalam bacaan doa setelah shalat fardhu'
  },

  // PJOK Fase B
  {
    id: 'tp-fb-pjok-01',
    mapelId: 'mapel-fb-06',
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
    id: 'tp-fb-pjok-02',
    mapelId: 'mapel-fb-06',
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
    id: 'tp-fb-pjok-03',
    mapelId: 'mapel-fb-06',
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
    id: 'tp-fb-pjok-04',
    mapelId: 'mapel-fb-06',
    kode: 'TP 4',
    lingkupMateri: 'Kesehatan Pribadi & Pola Hidup Bersih',
    deskripsi: 'Mengenal bagian tubuh yang boleh dan tidak boleh disentuh serta kebersihan alat reproduksi.',
    semester: '1 (Ganjil)',
    fase: 'Fase B (Kelas 4)',
    kktp: 75,
    ringkasanRaporTuntas: 'Paham pentingnya menjaga kebersihan diri dan kesehatan lingkungan',
    ringkasanRaporPerluBimbingan: 'Perlu pembiasaan konsumsi makanan bergizi seimbang setiap hari'
  },

  // Seni Rupa Fase B
  {
    id: 'tp-fb-seni-01',
    mapelId: 'mapel-fb-07',
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
    id: 'tp-fb-seni-02',
    mapelId: 'mapel-fb-07',
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
    id: 'tp-fb-seni-03',
    mapelId: 'mapel-fb-07',
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
    id: 'tp-fb-seni-04',
    mapelId: 'mapel-fb-07',
    kode: 'TP 4',
    lingkupMateri: 'Kreasi Seni Kriya dan Daur Ulang',
    deskripsi: 'Merancang dan membuat karya 3 dimensi dari bahan daur ulang (kardus, botol plastik) secara fungsional.',
    semester: '1 (Ganjil)',
    fase: 'Fase B (Kelas 4)',
    kktp: 75,
    ringkasanRaporTuntas: 'Inovatif mendaur ulang limbah plastik menjadi benda hias yang bernilai guna',
    ringkasanRaporPerluBimbingan: 'Perlu pendampingan dalam kerapian perekatan dan pemotongan bahan kriya'
  },

  // Bahasa Inggris Fase B
  {
    id: 'tp-fb-ing-01',
    mapelId: 'mapel-fb-08',
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
    id: 'tp-fb-ing-02',
    mapelId: 'mapel-fb-08',
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
    id: 'tp-fb-ing-03',
    mapelId: 'mapel-fb-08',
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
    id: 'tp-fb-ing-04',
    mapelId: 'mapel-fb-08',
    kode: 'TP 4',
    lingkupMateri: 'Unit 4: Describing Animals and Favorite Foods',
    deskripsi: 'Describing characteristics of animals and expressing food likes and dislikes in simple dialogues.',
    semester: '1 (Ganjil)',
    fase: 'Fase B (Kelas 4)',
    kktp: 70,
    ringkasanRaporTuntas: 'Active in short conversational dialogues about favorite animals and snacks',
    ringkasanRaporPerluBimbingan: 'Needs guidance in forming full sentences with like/dislike'
  },

  // PLBJ Fase B
  {
    id: 'tp-fb-plbj-01',
    mapelId: 'mapel-fb-09',
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
    id: 'tp-fb-plbj-02',
    mapelId: 'mapel-fb-09',
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
    id: 'tp-fb-plbj-03',
    mapelId: 'mapel-fb-09',
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
    id: 'tp-fb-plbj-04',
    mapelId: 'mapel-fb-09',
    kode: 'TP 4',
    lingkupMateri: 'Bab 4: Permainan Tradisional Betawi',
    deskripsi: 'Mempraktikkan aturan dan nilai sportivitas dalam permainan tradisional Keripik Jengkol dan Cingciripit.',
    semester: '1 (Ganjil)',
    fase: 'Fase B (Kelas 4)',
    kktp: 75,
    ringkasanRaporTuntas: 'Sportif dan tangkas saat bermain permainan tradisional bersama kelompok',
    ringkasanRaporPerluBimbingan: 'Perlu dorongan kekompakan tim saat permainan Keripik Jengkol'
  }
];

// -------------------------------------------------------------
// 3. FASE C (KELAS 5 - 6 SD)
// -------------------------------------------------------------
const SUBJECTS_FASE_C: Subject[] = [
  {
    id: 'mapel-fc-01',
    kode: 'PAI',
    nama: 'Pendidikan Agama & Budi Pekerti',
    kelompok: 'Umum',
    kktp: 78,
    guruPengampu: 'Ust. Ahmad Fauzan, S.Pd.I',
    iconName: 'HeartHandshake',
    deskripsi: 'Kajian mendalam Al-Qur’an (Q.S. Al-Ma\'un & At-Tin), hari akhir, zakat & infak, serta peradaban Islam.'
  },
  {
    id: 'mapel-fc-02',
    kode: 'PPKn',
    nama: 'Pendidikan Pancasila',
    kelompok: 'Umum',
    kktp: 75,
    guruPengampu: 'Sri Wahyuni, S.Pd., Gr.',
    iconName: 'ShieldCheck',
    deskripsi: 'Pengamalan nilai Pancasila dalam NKRI, keragaman sosial budaya, dan penegakan norma hukum.'
  },
  {
    id: 'mapel-fc-03',
    kode: 'BIN',
    nama: 'Bahasa Indonesia',
    kelompok: 'Umum',
    kktp: 75,
    guruPengampu: 'Sri Wahyuni, S.Pd., Gr.',
    iconName: 'BookOpen',
    deskripsi: 'Teks eksplanasi ilmiah, naskah pidato, laporan investigasi/observasi, dan apresiasi sastra (puisi/pantun).'
  },
  {
    id: 'mapel-fc-04',
    kode: 'MAT',
    nama: 'Matematika',
    kelompok: 'Umum',
    kktp: 72,
    guruPengampu: 'Sri Wahyuni, S.Pd., Gr.',
    iconName: 'Calculator',
    deskripsi: 'Operasi pecahan campuran & desimal, perbandingan/skala, bangun ruang (kubus, balok, tabung), dan statistika.'
  },
  {
    id: 'mapel-fc-05',
    kode: 'IPAS',
    nama: 'Ilmu Pengetahuan Alam & Sosial (IPAS)',
    kelompok: 'Umum',
    kktp: 75,
    guruPengampu: 'Sri Wahyuni, S.Pd., Gr.',
    iconName: 'Compass',
    deskripsi: 'Sistem organ tubuh manusia (pernapasan, pencernaan, darah), ekosistem, energi listrik & magnet, tata surya.'
  },
  {
    id: 'mapel-fc-06',
    kode: 'PJOK',
    nama: 'Pendidikan Jasmani, Olahraga, & Kesehatan',
    kelompok: 'Umum',
    kktp: 75,
    guruPengampu: 'Wahyu Hidayat, S.Pd.Jas',
    iconName: 'Activity',
    deskripsi: 'Taktik permainan bola beregu, senam ketangkasan, renang gaya dada, dan kesehatan reproduksi remaja.'
  },
  {
    id: 'mapel-fc-07',
    kode: 'SENI',
    nama: 'Seni Rupa & Prakarya',
    kelompok: 'Pilihan',
    kktp: 75,
    guruPengampu: 'Sri Wahyuni, S.Pd., Gr.',
    iconName: 'Palette',
    deskripsi: 'Gambar proporsi perspektif, seni batik ikat celup/jumputan, anyaman kriya, dan apresiasi seni Nusantara.'
  },
  {
    id: 'mapel-fc-08',
    kode: 'ING',
    nama: 'Bahasa Inggris',
    kelompok: 'Muatan Lokal',
    kktp: 72,
    guruPengampu: 'Miss Clarissa Melinda, S.Pd.',
    iconName: 'Languages',
    deskripsi: 'Teks deskriptif pengalaman masa lalu (Simple Past), petunjuk arah (Directions), dan dialog interaktif.'
  },
  {
    id: 'mapel-fc-09',
    kode: 'PLBJ',
    nama: 'Pendidikan Lingkungan & Budaya Jakarta (PLBJ)',
    kelompok: 'Muatan Lokal',
    kktp: 75,
    guruPengampu: 'Sri Wahyuni, S.Pd., Gr.',
    iconName: 'Building2',
    deskripsi: 'Sistem transportasi modern Jakarta (MRT/LRT), pelestarian cagar budaya, dan penghijauan perkotaan.'
  }
];

const TP_FASE_C: TujuanPembelajaran[] = [
  // PAI Fase C
  {
    id: 'tp-fc-pai-01',
    mapelId: 'mapel-fc-01',
    kode: 'TP 1',
    lingkupMateri: 'Kajian Q.S. Al-Ma\'un & At-Tin',
    deskripsi: 'Membaca tartil, menghafal, dan mengkaji makna kepedulian terhadap anak yatim dalam Q.S. Al-Ma\'un.',
    semester: '1 (Ganjil)',
    fase: 'Fase C (Kelas 5 - 6)',
    kktp: 78,
    ringkasanRaporTuntas: 'Sangat fasih bertajwid membaca Q.S. Al-Ma\'un dan mengamalkan nilai kepedulian sosial',
    ringkasanRaporPerluBimbingan: 'Perlu bimbingan dalam hukum bacaan mad dan ghunnah'
  },
  {
    id: 'tp-fc-pai-02',
    mapelId: 'mapel-fc-01',
    kode: 'TP 2',
    lingkupMateri: 'Iman Kepada Hari Akhir (Kiamat) & Takdir',
    deskripsi: 'Menjelaskan hikmah beriman kepada hari akhir dan qadha-qadar dalam meningkatkan etos ibadah.',
    semester: '1 (Ganjil)',
    fase: 'Fase C (Kelas 5 - 6)',
    kktp: 78,
    ringkasanRaporTuntas: 'Memahami tanda-tanda hari akhir dan termotivasi senantiasa berbuat kebajikan',
    ringkasanRaporPerluBimbingan: 'Perlu penguatan pemahaman konsep ikhtiar dan tawakal'
  },
  {
    id: 'tp-fc-pai-03',
    mapelId: 'mapel-fc-01',
    kode: 'TP 3',
    lingkupMateri: 'Ketentuan Zakat Fitrah, Zakat Mal & Infak',
    deskripsi: 'Menganalisis ketentuan mustahik zakat, hikmah zakat fitrah, dan gemar berinfak secara ikhlas.',
    semester: '1 (Ganjil)',
    fase: 'Fase C (Kelas 5 - 6)',
    kktp: 78,
    ringkasanRaporTuntas: 'Menguasai perhitungan nisab zakat fitrah dan 8 golongan penerima mustahik zakat',
    ringkasanRaporPerluBimbingan: 'Perlu latihan dalam menghitung takaran zakat beras'
  },
  {
    id: 'tp-fc-pai-04',
    mapelId: 'mapel-fc-01',
    kode: 'TP 4',
    lingkupMateri: 'Keteladanan Khulafaur Rasyidin & Sahabat',
    deskripsi: 'Meneladani kepemimpinan Abu Bakar, Umar bin Khattab, Utsman, dan Ali dalam persatuan umat.',
    semester: '1 (Ganjil)',
    fase: 'Fase C (Kelas 5 - 6)',
    kktp: 78,
    ringkasanRaporTuntas: 'Meneladani sifat adil dan keberanian sahabat Nabi dalam kehidupan sehari-hari',
    ringkasanRaporPerluBimbingan: 'Perlu membaca lebih banyak kisah kepemimpinan sahabat Nabi'
  },

  // PPKn Fase C
  {
    id: 'tp-fc-ppkn-01',
    mapelId: 'mapel-fc-02',
    kode: 'TP 1',
    lingkupMateri: 'Pancasila dalam Mempertahankan NKRI',
    deskripsi: 'Menganalisis penerapan nilai-nilai Pancasila dalam menjaga persatuan dan kesatuan bangsa.',
    semester: '1 (Ganjil)',
    fase: 'Fase C (Kelas 5 - 6)',
    kktp: 75,
    ringkasanRaporTuntas: 'Sangat paham peran Pancasila sebagai pemersatu bangsa dan benteng NKRI',
    ringkasanRaporPerluBimbingan: 'Perlu pendalaman contoh ancaman terhadap persatuan bangsa'
  },
  {
    id: 'tp-fc-ppkn-02',
    mapelId: 'mapel-fc-02',
    kode: 'TP 2',
    lingkupMateri: 'Norma Hukum & Hak Asasi Manusia',
    deskripsi: 'Menjelaskan fungsi norma hukum dan perundang-undangan dalam menjamin ketertiban masyarakat.',
    semester: '1 (Ganjil)',
    fase: 'Fase C (Kelas 5 - 6)',
    kktp: 75,
    ringkasanRaporTuntas: 'Mampu menganalisis pentingnya ketaatan terhadap rambu hukum dan norma masyarakat',
    ringkasanRaporPerluBimbingan: 'Perlu bimbingan dalam membedakan sanksi norma kesusilaan dan norma hukum'
  },
  {
    id: 'tp-fc-ppkn-03',
    mapelId: 'mapel-fc-02',
    kode: 'TP 3',
    lingkupMateri: 'Keragaman Budaya Nusantara & Toleransi Global',
    deskripsi: 'Menghargai keberagaman adat istiadat dan mengkampanyekan semangat Bhinneka Tunggal Ika.',
    semester: '1 (Ganjil)',
    fase: 'Fase C (Kelas 5 - 6)',
    kktp: 75,
    ringkasanRaporTuntas: 'Aktif mengapresiasi keragaman budaya Nusantara dan bersikap toleran tanpa diskriminasi',
    ringkasanRaporPerluBimbingan: 'Perlu pembiasaan menghargai perbedaan latar belakang teman'
  },
  {
    id: 'tp-fc-ppkn-04',
    mapelId: 'mapel-fc-02',
    kode: 'TP 4',
    lingkupMateri: 'Demokrasi & Partisipasi Warga Negara',
    deskripsi: 'Mempraktikkan pemilihan ketua kelas secara demokratis dan menjalankan keputusan mufakat bersama.',
    semester: '1 (Ganjil)',
    fase: 'Fase C (Kelas 5 - 6)',
    kktp: 75,
    ringkasanRaporTuntas: 'Menunjukkan kedewasaan berdemokrasi dan menerima hasil musyawarah dengan lapang dada',
    ringkasanRaporPerluBimbingan: 'Perlu dorongan keberanian saat menyampaikan kritik santun'
  },

  // Bahasa Indonesia Fase C
  {
    id: 'tp-fc-bin-01',
    mapelId: 'mapel-fc-03',
    kode: 'TP 1',
    lingkupMateri: 'Teks Eksplanasi Ilmiah & Fenomena Alam',
    deskripsi: 'Menganalisis struktur teks eksplanasi ilmiah (pernyataan umum, sebab-akibat, interpretasi).',
    semester: '1 (Ganjil)',
    fase: 'Fase C (Kelas 5 - 6)',
    kktp: 75,
    ringkasanRaporTuntas: 'Sangat cermat membedakan fakta ilmiah dan opini dalam teks eksplanasi',
    ringkasanRaporPerluBimbingan: 'Perlu bimbingan dalam menyusun bagan alur sebab-akibat fenomena alam'
  },
  {
    id: 'tp-fc-bin-02',
    mapelId: 'mapel-fc-03',
    kode: 'TP 2',
    lingkupMateri: 'Menulis & Menyampaikan Naskah Pidato',
    deskripsi: 'Menyusun naskah pidato persuasif dan mempraktikkan orasi dengan intonasi serta lafal yang tepat.',
    semester: '1 (Ganjil)',
    fase: 'Fase C (Kelas 5 - 6)',
    kktp: 75,
    ringkasanRaporTuntas: 'Percaya diri dan berwibawa menyampaikan pidato ajakan menjaga lingkungan',
    ringkasanRaporPerluBimbingan: 'Perlu latihan vokal dan penguasaan tatap mata dengan audiens'
  },
  {
    id: 'tp-fc-bin-03',
    mapelId: 'mapel-fc-03',
    kode: 'TP 3',
    lingkupMateri: 'Laporan Hasil Pengamatan (Investigasi)',
    deskripsi: 'Menyusun laporan hasil pengamatan terstruktur menggunakan kosakata baku dan kalimat efektif.',
    semester: '1 (Ganjil)',
    fase: 'Fase C (Kelas 5 - 6)',
    kktp: 75,
    ringkasanRaporTuntas: 'Mampu menyusun laporan observasi runtut dengan ejaan dan tanda baca EYD yang benar',
    ringkasanRaporPerluBimbingan: 'Perlu ketelitian dalam merangkai kalimat majemuk setara'
  },
  {
    id: 'tp-fc-bin-04',
    mapelId: 'mapel-fc-03',
    kode: 'TP 4',
    lingkupMateri: 'Apresiasi Karya Sastra (Puisi & Pantun)',
    deskripsi: 'Membaca indah puisi dan menggubah bait pantun nasihat dengan rima a-b-a-b yang tepat.',
    semester: '1 (Ganjil)',
    fase: 'Fase C (Kelas 5 - 6)',
    kktp: 75,
    ringkasanRaporTuntas: 'Sangat menjiwai pembacaan puisi ekspresif dan kreatif membuat pantun nasihat',
    ringkasanRaporPerluBimbingan: 'Perlu latihan dalam menyesuaikan artikulasi dan mimik wajah saat berpuisi'
  },

  // Matematika Fase C
  {
    id: 'tp-fc-mat-01',
    mapelId: 'mapel-fc-04',
    kode: 'TP 1',
    lingkupMateri: 'Operasi Pecahan Campuran, Desimal & Persen',
    deskripsi: 'Menyelesaikan operasi hitung penjumlahan, pengurangan, perkalian, dan pembagian berbagai bentuk pecahan.',
    semester: '1 (Ganjil)',
    fase: 'Fase C (Kelas 5 - 6)',
    kktp: 72,
    ringkasanRaporTuntas: 'Sangat mahir mengonversi dan menghitung operasi campuran pecahan serta desimal',
    ringkasanRaporPerluBimbingan: 'Perlu pendampingan dalam menyamakan penyebut pecahan campuran tidak sejenis'
  },
  {
    id: 'tp-fc-mat-02',
    mapelId: 'mapel-fc-04',
    kode: 'TP 2',
    lingkupMateri: 'Perbandingan Rasio & Skala Denah/Peta',
    deskripsi: 'Menyelesaikan masalah kontekstual yang berkaitan dengan perbandingan senilai dan skala peta.',
    semester: '1 (Ganjil)',
    fase: 'Fase C (Kelas 5 - 6)',
    kktp: 72,
    ringkasanRaporTuntas: 'Cepat dan tepat menghitung jarak sebenarnya pada peta menggunakan rumus skala',
    ringkasanRaporPerluBimbingan: 'Perlu penguatan konsep perkalian silang pada perbandingan senilai'
  },
  {
    id: 'tp-fc-mat-03',
    mapelId: 'mapel-fc-04',
    kode: 'TP 3',
    lingkupMateri: 'Volume & Luas Permukaan Bangun Ruang',
    deskripsi: 'Menghitung volume dan luas permukaan prisma, tabung, kerucut, serta gabungan bangun ruang.',
    semester: '1 (Ganjil)',
    fase: 'Fase C (Kelas 5 - 6)',
    kktp: 72,
    ringkasanRaporTuntas: 'Mampu memecahkan soal cerita volume tabung dan balok dengan runtut',
    ringkasanRaporPerluBimbingan: 'Perlu ketelitian dalam mengingat rumus luas selimut tabung'
  },
  {
    id: 'tp-fc-mat-04',
    mapelId: 'mapel-fc-04',
    kode: 'TP 4',
    lingkupMateri: 'Pengolahan Data (Mean, Median, Modus)',
    deskripsi: 'Menganalisis dan menyajikan data dalam bentuk tabel, diagram batang, diagram lingkaran, serta menghitung rata-rata.',
    semester: '1 (Ganjil)',
    fase: 'Fase C (Kelas 5 - 6)',
    kktp: 72,
    ringkasanRaporTuntas: 'Sangat terampil membaca diagram lingkaran dan menghitung nilai rata-rata (mean)',
    ringkasanRaporPerluBimbingan: 'Perlu bimbingan dalam menentukan nilai median data berjumlah genap'
  },

  // IPAS Fase C
  {
    id: 'tp-fc-ipas-01',
    mapelId: 'mapel-fc-05',
    kode: 'TP 1',
    lingkupMateri: 'Sistem Organ Tubuh Manusia',
    deskripsi: 'Menganalisis sistem pernapasan, pencernaan, dan peredaran darah manusia serta cara menjaga kesehatannya.',
    semester: '1 (Ganjil)',
    fase: 'Fase C (Kelas 5 - 6)',
    kktp: 75,
    ringkasanRaporTuntas: 'Sangat paham mekanisme peredaran darah besar/kecil dan fungsi alveolus paru-paru',
    ringkasanRaporPerluBimbingan: 'Perlu pendalaman mengenai enzim pencernaan lambung dan usus halus'
  },
  {
    id: 'tp-fc-ipas-02',
    mapelId: 'mapel-fc-05',
    kode: 'TP 2',
    lingkupMateri: 'Ekosistem & Jaring-Jaring Makanan',
    deskripsi: 'Menganalisis hubungan antar-makhluk hidup dalam jaring-jaring makanan dan dampak kepunahan produsen/konsumen.',
    semester: '1 (Ganjil)',
    fase: 'Fase C (Kelas 5 - 6)',
    kktp: 75,
    ringkasanRaporTuntas: 'Mampu memprediksi dampak ketidakseimbangan ekosistem akibat perburuan liar',
    ringkasanRaporPerluBimbingan: 'Perlu latihan dalam mengidentifikasi tingkat trofik konsumen tersier'
  },
  {
    id: 'tp-fc-ipas-03',
    mapelId: 'mapel-fc-05',
    kode: 'TP 3',
    lingkupMateri: 'Magnet, Listrik & Energi Alternatif',
    deskripsi: 'Merancang rangkaian listrik seri-paralel dan menjelaskan pemanfaatan energi alternatif (surya, angin, air).',
    semester: '1 (Ganjil)',
    fase: 'Fase C (Kelas 5 - 6)',
    kktp: 75,
    ringkasanRaporTuntas: 'Mahir merakit rangkaian listrik paralel dan antusias pada inovasi panel surya',
    ringkasanRaporPerluBimbingan: 'Perlu ketelitian dalam merangkai sakelar dan kutub positif-negatif baterai'
  },
  {
    id: 'tp-fc-ipas-04',
    mapelId: 'mapel-fc-05',
    kode: 'TP 4',
    lingkupMateri: 'Sistem Tata Surya & Rotasi Bumi',
    deskripsi: 'Menjelaskan karakteristik planet tata surya, akibat rotasi bumi (siang-malam), dan revolusi bumi.',
    semester: '1 (Ganjil)',
    fase: 'Fase C (Kelas 5 - 6)',
    kktp: 75,
    ringkasanRaporTuntas: 'Sangat menguasai urutan planet tata surya dan penjelasan gerak semu matahari',
    ringkasanRaporPerluBimbingan: 'Perlu bimbingan dalam membedakan akibat rotasi dengan revolusi bumi'
  },

  // PJOK Fase C
  {
    id: 'tp-fc-pjok-01',
    mapelId: 'mapel-fc-06',
    kode: 'TP 1',
    lingkupMateri: 'Taktik Permainan Bola Voli & Sepak Bola',
    deskripsi: 'Mempraktikkan teknik passing bawah voli, shooting sepak bola, dan strategi kerja sama regu.',
    semester: '1 (Ganjil)',
    fase: 'Fase C (Kelas 5 - 6)',
    kktp: 75,
    ringkasanRaporTuntas: 'Memiliki akurasi passing yang tinggi dan jiwa kepemimpinan dalam tim olahraga',
    ringkasanRaporPerluBimbingan: 'Perlu latihan kontrol kekuatan ayunan tangan passing voli'
  },
  {
    id: 'tp-fc-pjok-02',
    mapelId: 'mapel-fc-06',
    kode: 'TP 2',
    lingkupMateri: 'Senam Ketangkasan & Sikap Lilin',
    deskripsi: 'Mempraktikkan gerak sikap lilin, guling lenting, dan menjaga keseimbangan tubuh di atas matras.',
    semester: '1 (Ganjil)',
    fase: 'Fase C (Kelas 5 - 6)',
    kktp: 75,
    ringkasanRaporTuntas: 'Sangat lentur dan kokoh saat menahan tumpuan sikap lilin secara sempurna',
    ringkasanRaporPerluBimbingan: 'Perlu latihan bertahap pada tolakan pinggul saat guling lenting'
  },
  {
    id: 'tp-fc-pjok-03',
    mapelId: 'mapel-fc-06',
    kode: 'TP 3',
    lingkupMateri: 'Renang Gaya Dada & Keselamatan Air',
    deskripsi: 'Mempraktikkan koordinasi gerakan kaki, tangan, dan pengambilan napas renang gaya dada.',
    semester: '1 (Ganjil)',
    fase: 'Fase C (Kelas 5 - 6)',
    kktp: 75,
    ringkasanRaporTuntas: 'Percaya diri di dalam air dan lancar mengayuh renang gaya dada',
    ringkasanRaporPerluBimbingan: 'Perlu pembinaan ritme pernapasan saat kepala muncul ke permukaan air'
  },
  {
    id: 'tp-fc-pjok-04',
    mapelId: 'mapel-fc-06',
    kode: 'TP 4',
    lingkupMateri: 'Kesehatan Reproduksi Remaja & Bahaya Rokok',
    deskripsi: 'Menjelaskan perubahan fisik masa pubertas dan bahaya zat adiktif bagi kesehatan paru-paru.',
    semester: '1 (Ganjil)',
    fase: 'Fase C (Kelas 5 - 6)',
    kktp: 75,
    ringkasanRaporTuntas: 'Paham cara merawat kebersihan organ reproduksi masa pubertas dengan bijak',
    ringkasanRaporPerluBimbingan: 'Perlu pembiasaan gaya hidup higienis dan pemilihan pergaulan positif'
  },

  // Seni Rupa Fase C
  {
    id: 'tp-fc-seni-01',
    mapelId: 'mapel-fc-07',
    kode: 'TP 1',
    lingkupMateri: 'Gambar Perspektif Satu Titik Hilang',
    deskripsi: 'Menggambar suasana ruangan atau lorong sekolah menggunakan prinsip perspektif satu titik lenyap.',
    semester: '1 (Ganjil)',
    fase: 'Fase C (Kelas 5 - 6)',
    kktp: 75,
    ringkasanRaporTuntas: 'Sangat mahir menerapkan garis horizon dan titik lenyap gambar perspektif 3D',
    ringkasanRaporPerluBimbingan: 'Perlu ketelitian dalam menarik garis bantu menuju satu titik lenyap'
  },
  {
    id: 'tp-fc-seni-02',
    mapelId: 'mapel-fc-07',
    kode: 'TP 2',
    lingkupMateri: 'Seni Batik Ikat Celup (Jumputan)',
    deskripsi: 'Mendesain dan membuat kain bermotif menggunakan teknik ikat celup (jumputan) pewarna tekstil.',
    semester: '1 (Ganjil)',
    fase: 'Fase C (Kelas 5 - 6)',
    kktp: 75,
    ringkasanRaporTuntas: 'Inovatif menciptakan pola ikatan jumputan menghasilkan perpaduan warna kontras',
    ringkasanRaporPerluBimbingan: 'Perlu ketat saat mengikat karet agar pola putih tidak rembes'
  },
  {
    id: 'tp-fc-seni-03',
    mapelId: 'mapel-fc-07',
    kode: 'TP 3',
    lingkupMateri: 'Seni Anyaman Tradisional',
    deskripsi: 'Membuat karya anyaman dua sumbu menggunakan pita atau bambu dengan pola silang ganda.',
    semester: '1 (Ganjil)',
    fase: 'Fase C (Kelas 5 - 6)',
    kktp: 75,
    ringkasanRaporTuntas: 'Teliti, sabar, dan rapi dalam menyusun pola anyaman fungsional',
    ringkasanRaporPerluBimbingan: 'Perlu kerapian saat merapatkan sela-sela anyaman'
  },
  {
    id: 'tp-fc-seni-04',
    mapelId: 'mapel-fc-07',
    kode: 'TP 4',
    lingkupMateri: 'Apresiasi Ragam Seni Rupa Daerah Nusantara',
    deskripsi: 'Mengulas keunikan motif ukir Toraja, batik Solo, dan patung Asmat dalam bentuk kliping apresiasi.',
    semester: '1 (Ganjil)',
    fase: 'Fase C (Kelas 5 - 6)',
    kktp: 75,
    ringkasanRaporTuntas: 'Mampu mendeskripsikan filosofi ornamen tradisional daerah dengan wawasan luas',
    ringkasanRaporPerluBimbingan: 'Perlu melengkapi referensi asal daerah pada kliping seni'
  },

  // Bahasa Inggris Fase C
  {
    id: 'tp-fc-ing-01',
    mapelId: 'mapel-fc-08',
    kode: 'TP 1',
    lingkupMateri: 'Recounting Past Holidays (Simple Past Tense)',
    deskripsi: 'Narrating past holiday experiences and daily routines using regular and irregular past verbs.',
    semester: '1 (Ganjil)',
    fase: 'Fase C (Kelas 5 - 6)',
    kktp: 72,
    ringkasanRaporTuntas: 'Fluently recounts memorable holiday stories using past tense verbs accurately',
    ringkasanRaporPerluBimbingan: 'Needs practice with irregular past verbs like went, ate, and bought'
  },
  {
    id: 'tp-fc-ing-02',
    mapelId: 'mapel-fc-08',
    kode: 'TP 2',
    lingkupMateri: 'Giving Directions & Street Locations',
    deskripsi: 'Asking for and giving directions to public places using map prepositions and direction phrases.',
    semester: '1 (Ganjil)',
    fase: 'Fase C (Kelas 5 - 6)',
    kktp: 72,
    ringkasanRaporTuntas: 'Able to give clear step-by-step street directions (turn left, go straight, cross)',
    ringkasanRaporPerluBimbingan: 'Needs practice reading map landmarks accurately in English'
  },
  {
    id: 'tp-fc-ing-03',
    mapelId: 'mapel-fc-08',
    kode: 'TP 3',
    lingkupMateri: 'Comparative & Superlative Adjectives',
    deskripsi: 'Comparing objects, animals, and places using comparative (-er/more) and superlative (-est/most).',
    semester: '1 (Ganjil)',
    fase: 'Fase C (Kelas 5 - 6)',
    kktp: 72,
    ringkasanRaporTuntas: 'Correctly compares animal sizes and city populations in spoken dialogues',
    ringkasanRaporPerluBimbingan: 'Needs guidance differentiating short and long adjective rules'
  },
  {
    id: 'tp-fc-ing-04',
    mapelId: 'mapel-fc-08',
    kode: 'TP 4',
    lingkupMateri: 'Expressing Future Plans (Will & Going to)',
    deskripsi: 'Discussing dream future jobs and weekend plans using simple future tense expressions.',
    semester: '1 (Ganjil)',
    fase: 'Fase C (Kelas 5 - 6)',
    kktp: 72,
    ringkasanRaporTuntas: 'Enthusiastic and articulate when presenting future career aspirations in English',
    ringkasanRaporPerluBimbingan: 'Needs encouragement to speak in complete sentences without hesitating'
  },

  // PLBJ Fase C
  {
    id: 'tp-fc-plbj-01',
    mapelId: 'mapel-fc-09',
    kode: 'TP 1',
    lingkupMateri: 'Transportasi Massal Modern Jakarta (MRT/LRT/TransJakarta)',
    deskripsi: 'Menganalisis rute, etika menumpang, dan peran transportasi ramah lingkungan dalam mengurai kemacetan.',
    semester: '1 (Ganjil)',
    fase: 'Fase C (Kelas 5 - 6)',
    kktp: 75,
    ringkasanRaporTuntas: 'Sangat paham integrasi tiket elektronik dan etika prioritas di dalam gerbong MRT',
    ringkasanRaporPerluBimbingan: 'Perlu latihan membaca peta jaringan transit terintegrasi'
  },
  {
    id: 'tp-fc-plbj-02',
    mapelId: 'mapel-fc-09',
    kode: 'TP 2',
    lingkupMateri: 'Pelestarian Kawasan Cagar Budaya Kota Tua & Monas',
    deskripsi: 'Menganalisis sejarah gedung bersejarah di Kota Tua Jakarta dan pentingnya merawat cagar budaya.',
    semester: '1 (Ganjil)',
    fase: 'Fase C (Kelas 5 - 6)',
    kktp: 75,
    ringkasanRaporTuntas: 'Mampu menjelaskan latar belakang sejarah Museum Fatahillah dan nilai arsitekturnya',
    ringkasanRaporPerluBimbingan: 'Perlu memperdalam wawasan seputar fungsi awal Menara Syahbandar'
  },
  {
    id: 'tp-fc-plbj-03',
    mapelId: 'mapel-fc-09',
    kode: 'TP 3',
    lingkupMateri: 'Penghijauan Urban Farming & RPTRA',
    deskripsi: 'Mempraktikkan teknik menanam sayur hidroponik di pekarangan sekolah dan menjaga fasilitas RPTRA.',
    semester: '1 (Ganjil)',
    fase: 'Fase C (Kelas 5 - 6)',
    kktp: 75,
    ringkasanRaporTuntas: 'Mandiri merawat bibit kangkung hidroponik dan peduli terhadap kebersihan RPTRA',
    ringkasanRaporPerluBimbingan: 'Perlu ketelitian dalam mengukur kepekatan nutrisi air hidroponik'
  },
  {
    id: 'tp-fc-plbj-04',
    mapelId: 'mapel-fc-09',
    kode: 'TP 4',
    lingkupMateri: 'Seni Musik Gambang Kromong & Lenong Betawi',
    deskripsi: 'Mengenal instrumen alat musik Gambang Kromong serta unsur humor edukatif dalam pertunjukan Lenong.',
    semester: '1 (Ganjil)',
    fase: 'Fase C (Kelas 5 - 6)',
    kktp: 75,
    ringkasanRaporTuntas: 'Mengenali keunikan nada tangga pentatonik Gambang Kromong dan alur lakon Lenong',
    ringkasanRaporPerluBimbingan: 'Perlu bimbingan dalam membedakan instrumen tehyan dan kongahyan'
  }
];

// -------------------------------------------------------------
// 4. FASE D (KELAS 7 - 9 SMP/MTs)
// -------------------------------------------------------------
const SUBJECTS_FASE_D: Subject[] = [
  {
    id: 'mapel-fd-01',
    kode: 'PAI',
    nama: 'Pendidikan Agama & Budi Pekerti',
    kelompok: 'Umum',
    kktp: 78,
    guruPengampu: 'Ust. Ahmad Fauzan, S.Pd.I',
    iconName: 'HeartHandshake',
    deskripsi: 'Kajian Al-Qur’an Hadis tematik, akidah Islam, fiqih muamalah, dan sejarah peradaban Islam dunia.'
  },
  {
    id: 'mapel-fd-02',
    kode: 'PPKn',
    nama: 'Pendidikan Pancasila',
    kelompok: 'Umum',
    kktp: 75,
    guruPengampu: 'Sri Wahyuni, S.Pd., Gr.',
    iconName: 'ShieldCheck',
    deskripsi: 'Sejarah perumusan Pancasila, UUD NRI 1945, tata urutan perundang-undangan, dan komitmen kebangsaan.'
  },
  {
    id: 'mapel-fd-03',
    kode: 'BIN',
    nama: 'Bahasa Indonesia',
    kelompok: 'Umum',
    kktp: 75,
    guruPengampu: 'Sri Wahyuni, S.Pd., Gr.',
    iconName: 'BookOpen',
    deskripsi: 'Teks deskripsi, teks prosedur, teks laporan hasil observasi (LHO), teks berita, dan karya fiksi.'
  },
  {
    id: 'mapel-fd-04',
    kode: 'MAT',
    nama: 'Matematika',
    kelompok: 'Umum',
    kktp: 72,
    guruPengampu: 'Sri Wahyuni, S.Pd., Gr.',
    iconName: 'Calculator',
    deskripsi: 'Bilangan bulat & rasional, bentuk aljabar, persamaan linier satu variabel, perbandingan, dan geometri.'
  },
  {
    id: 'mapel-fd-05',
    kode: 'IPA',
    nama: 'Ilmu Pengetahuan Alam (IPA)',
    kelompok: 'Umum',
    kktp: 75,
    guruPengampu: 'Wahyu Hidayat, S.Pd.',
    iconName: 'Compass',
    deskripsi: 'Hakikat sains, pengukuran, zat dan perubahannya, suhu kalor, gerak gaya, serta sel dan organisasi kehidupan.'
  },
  {
    id: 'mapel-fd-06',
    kode: 'IPS',
    nama: 'Ilmu Pengetahuan Sosial (IPS)',
    kelompok: 'Umum',
    kktp: 75,
    guruPengampu: 'Dra. Hj. Nurjanah, M.Pd.',
    iconName: 'Building2',
    deskripsi: 'Keberagaman lingkungan alam & sosial, interaksi antarruang, kegiatan ekonomi, dan dinamika kependudukan.'
  },
  {
    id: 'mapel-fd-07',
    kode: 'ING',
    nama: 'Bahasa Inggris',
    kelompok: 'Umum',
    kktp: 72,
    guruPengampu: 'Miss Clarissa Melinda, S.Pd.',
    iconName: 'Languages',
    deskripsi: 'Transactional and interpersonal conversations, descriptive texts, personal recounts, and daily procedures.'
  },
  {
    id: 'mapel-fd-08',
    kode: 'PJOK',
    nama: 'Pendidikan Jasmani, Olahraga, & Kesehatan',
    kelompok: 'Umum',
    kktp: 75,
    guruPengampu: 'Wahyu Hidayat, S.Pd.Jas',
    iconName: 'Activity',
    deskripsi: 'Keterampilan gerak spesifik cabang olahraga, kebugaran jasmani terukur, dan pencegahan pergaulan bebas.'
  },
  {
    id: 'mapel-fd-09',
    kode: 'INF',
    nama: 'Informatika',
    kelompok: 'Umum',
    kktp: 75,
    guruPengampu: 'Muhammad Rizky, S.Kom.',
    iconName: 'Calculator',
    deskripsi: 'Berpikir komputasional (algoritma/dekomposisi), literasi digital, pengolah data spreadsheet, dan etika siber.'
  },
  {
    id: 'mapel-fd-10',
    kode: 'SENI',
    nama: 'Seni & Prakarya',
    kelompok: 'Pilihan',
    kktp: 75,
    guruPengampu: 'Sri Wahyuni, S.Pd., Gr.',
    iconName: 'Palette',
    deskripsi: 'Menggambar flora fauna geometris, seni kriya limbah keras/lunak, dan apresiasi karya seni modern.'
  },
  {
    id: 'mapel-fd-11',
    kode: 'MULOK',
    nama: 'Bahasa & Sastra Daerah',
    kelompok: 'Muatan Lokal',
    kktp: 75,
    guruPengampu: 'Sri Wahyuni, S.Pd., Gr.',
    iconName: 'BookOpen',
    deskripsi: 'Unggah-ungguh basa, tembang dolanan/pantun daerah, aksara daerah, dan kearifan budaya lokal.'
  }
];

const TP_FASE_D: TujuanPembelajaran[] = [
  // PAI Fase D
  {
    id: 'tp-fd-pai-01',
    mapelId: 'mapel-fd-01',
    kode: 'TP 1',
    lingkupMateri: 'Q.S. An-Nisa: 59 & Q.S. An-Nahl: 64',
    deskripsi: 'Membaca tartil dengan tajwid serta memahami kedudukan Al-Qur\'an dan Hadis sebagai pedoman hidup.',
    semester: '1 (Ganjil)',
    fase: 'Fase D (Kelas 7 - 9)',
    kktp: 78,
    ringkasanRaporTuntas: 'Sangat baik dalam membaca tartil dan menguraikan fungsi Hadis sebagai penjelas Al-Qur\'an',
    ringkasanRaporPerluBimbingan: 'Perlu latihan hukum bacaan al-syamsiyah dan al-qamariyah'
  },
  {
    id: 'tp-fd-pai-02',
    mapelId: 'mapel-fd-01',
    kode: 'TP 2',
    lingkupMateri: 'Meneladani Asmaul Husna & Iman Malaikat',
    deskripsi: 'Meneladani sifat Al-Alim, Al-Khabir, As-Sami\', Al-Bashir dan menumbuhkan sikap jujur serta mawas diri.',
    semester: '1 (Ganjil)',
    fase: 'Fase D (Kelas 7 - 9)',
    kktp: 78,
    ringkasanRaporTuntas: 'Memahami tugas 10 malaikat dan senantiasa berhati-hati dalam berucap serta bertindak',
    ringkasanRaporPerluBimbingan: 'Perlu penguatan kaitan sifat As-Sami\' dengan menjaga lisan'
  },
  {
    id: 'tp-fd-pai-03',
    mapelId: 'mapel-fd-01',
    kode: 'TP 3',
    lingkupMateri: 'Thaharah (Mandi Wajib) & Shalat Jamak Qasar',
    deskripsi: 'Mempraktikkan tata cara bersuci dari hadas besar dan ketentuan shalat jamak-qasar saat musafir.',
    semester: '1 (Ganjil)',
    fase: 'Fase D (Kelas 7 - 9)',
    kktp: 78,
    ringkasanRaporTuntas: 'Menguasai rukun mandi wajib dan lancar mempraktikkan niat serta tata cara shalat jamak',
    ringkasanRaporPerluBimbingan: 'Perlu pendampingan dalam syarat diperbolehkannya qasar shalat'
  },
  {
    id: 'tp-fd-pai-04',
    mapelId: 'mapel-fd-01',
    kode: 'TP 4',
    lingkupMateri: 'Sejarah Dakwah Nabi Muhammad di Madinah',
    deskripsi: 'Menganalisis substansi Piagam Madinah dalam membangun masyarakat toleran dan majemuk.',
    semester: '1 (Ganjil)',
    fase: 'Fase D (Kelas 7 - 9)',
    kktp: 78,
    ringkasanRaporTuntas: 'Mampu menganalisis nilai-nilai toleransi Piagam Madinah dalam kehidupan berbangsa',
    ringkasanRaporPerluBimbingan: 'Perlu membaca lebih runtut kronologi peristiwa hijrah ke Madinah'
  },

  // PPKn Fase D
  {
    id: 'tp-fd-ppkn-01',
    mapelId: 'mapel-fd-02',
    kode: 'TP 1',
    lingkupMateri: 'Sejarah Kelahiran Pancasila & BPUPK',
    deskripsi: 'Menganalisis perumusan dan penetapan Pancasila oleh para pendiri bangsa dalam sidang BPUPK dan PPKI.',
    semester: '1 (Ganjil)',
    fase: 'Fase D (Kelas 7 - 9)',
    kktp: 75,
    ringkasanRaporTuntas: 'Sangat menguasai gagasan rumusan dasar negara Ir. Soekarno, Mr. Soepomo, dan Moh. Yamin',
    ringkasanRaporPerluBimbingan: 'Perlu latihan dalam mengingat tanggal sidang BPUPK pertama dan kedua'
  },
  {
    id: 'tp-fd-ppkn-02',
    mapelId: 'mapel-fd-02',
    kode: 'TP 2',
    lingkupMateri: 'Norma dan Keadilan dalam Masyarakat',
    deskripsi: 'Menganalisis arti penting norma agama, kesusilaan, kesopanan, dan hukum dalam mewujudkan keadilan sosial.',
    semester: '1 (Ganjil)',
    fase: 'Fase D (Kelas 7 - 9)',
    kktp: 75,
    ringkasanRaporTuntas: 'Kritis dalam menganalisis kasus pelanggaran norma dan konsisten menjunjung hukum',
    ringkasanRaporPerluBimbingan: 'Perlu bimbingan dalam membedakan ciri sanksi tegas norma hukum dan sosial'
  },
  {
    id: 'tp-fd-ppkn-03',
    mapelId: 'mapel-fd-02',
    kode: 'TP 3',
    lingkupMateri: 'Kedudukan UUD NRI 1945 sebagai Hukum Tertinggi',
    deskripsi: 'Menjelaskan kedudukan, sistematika, dan sifat konstitusi UUD 1945 dalam hierarki peraturan.',
    semester: '1 (Ganjil)',
    fase: 'Fase D (Kelas 7 - 9)',
    kktp: 75,
    ringkasanRaporTuntas: 'Memahami hierarki peraturan perundang-undangan nasional dari UUD 1945 hingga Perda',
    ringkasanRaporPerluBimbingan: 'Perlu pendampingan mengenai asas lex superior derogat legi inferiori'
  },
  {
    id: 'tp-fd-ppkn-04',
    mapelId: 'mapel-fd-02',
    kode: 'TP 4',
    lingkupMateri: 'Kebinekaan Indonesia & Pencegahan Diskriminasi',
    deskripsi: 'Mengidentifikasi potensi konflik SARA dan merumuskan solusi kolaboratif untuk mempererat persatuan.',
    semester: '1 (Ganjil)',
    fase: 'Fase D (Kelas 7 - 9)',
    kktp: 75,
    ringkasanRaporTuntas: 'Aktif merawat toleransi antarsuku dan menolak perundungan (bullying) di sekolah',
    ringkasanRaporPerluBimbingan: 'Perlu dorongan kepemimpinan saat memediasi perbedaan antarteman'
  },

  // Matematika Fase D
  {
    id: 'tp-fd-mat-01',
    mapelId: 'mapel-fd-04',
    kode: 'TP 1',
    lingkupMateri: 'Operasi Bilangan Bulat & Pecahan Rasional',
    deskripsi: 'Menyelesaikan operasi hitung bilangan bulat positif/negatif, pangkat, dan pecahan rasional kontekstual.',
    semester: '1 (Ganjil)',
    fase: 'Fase D (Kelas 7 - 9)',
    kktp: 72,
    ringkasanRaporTuntas: 'Sangat teliti dalam operasi perkalian bilangan negatif dan sifat distributif',
    ringkasanRaporPerluBimbingan: 'Perlu ketelitian dalam operasi hitung tanda kurung bertingkat'
  },
  {
    id: 'tp-fd-mat-02',
    mapelId: 'mapel-fd-04',
    kode: 'TP 2',
    lingkupMateri: 'Aljabar & Penyederhanaan Suku Sejenis',
    deskripsi: 'Mengenal variabel, koefisien, konstanta, dan melakukan operasi penjumlahan-perkalian bentuk aljabar.',
    semester: '1 (Ganjil)',
    fase: 'Fase D (Kelas 7 - 9)',
    kktp: 72,
    ringkasanRaporTuntas: 'Cepat dan tepat menyederhanakan bentuk suku sejenis dan pemfaktoran aljabar',
    ringkasanRaporPerluBimbingan: 'Perlu latihan pada sifat perkalian dua suku binomial'
  },
  {
    id: 'tp-fd-mat-03',
    mapelId: 'mapel-fd-04',
    kode: 'TP 3',
    lingkupMateri: 'Persamaan & Pertidaksamaan Linier Satu Variabel (PLSV)',
    deskripsi: 'Membuat model matematika dan menyelesaikan masalah kehidupan nyata terkait PLSV dan PtLSV.',
    semester: '1 (Ganjil)',
    fase: 'Fase D (Kelas 7 - 9)',
    kktp: 72,
    ringkasanRaporTuntas: 'Terampil memodelkan soal cerita menjadi persamaan aljabar linier satu variabel',
    ringkasanRaporPerluBimbingan: 'Perlu hati-hati saat membalik tanda pertidaksamaan ketika dibagi bilangan negatif'
  },
  {
    id: 'tp-fd-mat-04',
    mapelId: 'mapel-fd-04',
    kode: 'TP 4',
    lingkupMateri: 'Perbandingan Senilai & Berbalik Nilai',
    deskripsi: 'Menganalisis grafik perbandingan senilai dan menyelesaikan kasus perbandingan berbalik nilai (waktu kerja/kecepatan).',
    semester: '1 (Ganjil)',
    fase: 'Fase D (Kelas 7 - 9)',
    kktp: 72,
    ringkasanRaporTuntas: 'Mampu membedakan dan menghitung perbandingan berbalik nilai proyek kerja secara akurat',
    ringkasanRaporPerluBimbingan: 'Perlu latihan dalam membaca grafik koordinat perbandingan'
  },

  // IPA Fase D
  {
    id: 'tp-fd-ipa-01',
    mapelId: 'mapel-fd-05',
    kode: 'TP 1',
    lingkupMateri: 'Hakikat Sains, Besaran & Pengukuran Laboratorium',
    deskripsi: 'Menerapkan metode ilmiah, keselamatan kerja laboratorium, dan membaca jangka sorong/mikrometer sekrup.',
    semester: '1 (Ganjil)',
    fase: 'Fase D (Kelas 7 - 9)',
    kktp: 75,
    ringkasanRaporTuntas: 'Sangat cermat membaca skala jangka sorong dan tertib menjalankan SOP laboratorium',
    ringkasanRaporPerluBimbingan: 'Perlu latihan membaca skala nonius mikrometer sekrup'
  },
  {
    id: 'tp-fd-ipa-02',
    mapelId: 'mapel-fd-05',
    kode: 'TP 2',
    lingkupMateri: 'Klasifikasi Materi, Unsur, Senyawa, dan Campuran',
    deskripsi: 'Membedakan unsur, senyawa, larutan asam-basa, serta mempraktikkan pemisahan campuran (filtrasi, kromatografi).',
    semester: '1 (Ganjil)',
    fase: 'Fase D (Kelas 7 - 9)',
    kktp: 75,
    ringkasanRaporTuntas: 'Mahir menguji larutan asam-basa memakai kertas lakmus dan indikator alami',
    ringkasanRaporPerluBimbingan: 'Perlu bimbingan dalam membedakan molekul unsur dan molekul senyawa'
  },
  {
    id: 'tp-fd-ipa-03',
    mapelId: 'mapel-fd-05',
    kode: 'TP 3',
    lingkupMateri: 'Suhu, Kalor & Pemuaian Benda',
    deskripsi: 'Menganalisis perpindahan kalor (konduksi, konveksi, radiasi) dan menghitung kalor jenis perubahan wujud.',
    semester: '1 (Ganjil)',
    fase: 'Fase D (Kelas 7 - 9)',
    kktp: 75,
    ringkasanRaporTuntas: 'Menguasai rumus Q = m.c.deltaT dan penjelasan asas Black pada termodinamika dasar',
    ringkasanRaporPerluBimbingan: 'Perlu latihan dalam konversi skala Celcius ke Kelvin dan Fahrenheit'
  },
  {
    id: 'tp-fd-ipa-04',
    mapelId: 'mapel-fd-05',
    kode: 'TP 4',
    lingkupMateri: 'Sel dan Organisasi Kehidupan',
    deskripsi: 'Membandingkan struktur organel sel hewan dan tumbuhan serta hierarki sel-jaringan-organ-sistem organ.',
    semester: '1 (Ganjil)',
    fase: 'Fase D (Kelas 7 - 9)',
    kktp: 75,
    ringkasanRaporTuntas: 'Mampu menjelaskan fungsi mitokondria, dinding sel, kloroplas, dan membran sel secara detail',
    ringkasanRaporPerluBimbingan: 'Perlu pendampingan dalam pengamatan preparat mikroskopis sel gabus'
  },

  // Informatika Fase D
  {
    id: 'tp-fd-inf-01',
    mapelId: 'mapel-fd-09',
    kode: 'TP 1',
    lingkupMateri: 'Berpikir Komputasional (Algoritma & Dekomposisi)',
    deskripsi: 'Menerapkan logika dekomposisi, pengenalan pola, abstraksi, dan flowchart untuk memecahkan masalah.',
    semester: '1 (Ganjil)',
    fase: 'Fase D (Kelas 7 - 9)',
    kktp: 75,
    ringkasanRaporTuntas: 'Sangat logis dan sistematis dalam merancang diagram alir (flowchart) pemecahan masalah',
    ringkasanRaporPerluBimbingan: 'Perlu latihan dalam menyusun percabangan logika if-else'
  },
  {
    id: 'tp-fd-inf-02',
    mapelId: 'mapel-fd-09',
    kode: 'TP 2',
    lingkupMateri: 'Perangkat Keras (Hardware) & Sistem Operasi',
    deskripsi: 'Mengidentifikasi fungsi komponen CPU, RAM, GPU, storage, dan mekanisme interaksi antarmuka pengguna (GUI).',
    semester: '1 (Ganjil)',
    fase: 'Fase D (Kelas 7 - 9)',
    kktp: 75,
    ringkasanRaporTuntas: 'Paham spesifikasi perangkat komputer dan troubleshooting dasar perangkat keras',
    ringkasanRaporPerluBimbingan: 'Perlu memahami fungsi memori cache dan bus data'
  },
  {
    id: 'tp-fd-inf-03',
    mapelId: 'mapel-fd-09',
    kode: 'TP 3',
    lingkupMateri: 'Pengolahan Data Spreadsheet & Rumus Logika',
    deskripsi: 'Mengolah data tabel memakai rumus formula SUM, AVERAGE, IF, VLOOKUP, dan visualisasi grafik.',
    semester: '1 (Ganjil)',
    fase: 'Fase D (Kelas 7 - 9)',
    kktp: 75,
    ringkasanRaporTuntas: 'Sangat mahir membuat tabel keuangan dan grafik batang memakai rumus formula Excel',
    ringkasanRaporPerluBimbingan: 'Perlu ketelitian dalam mengunci referensi sel absolut ($)'
  },
  {
    id: 'tp-fd-inf-04',
    mapelId: 'mapel-fd-09',
    kode: 'TP 4',
    lingkupMateri: 'Keamanan Data, Jejak Digital & Etika Siber',
    deskripsi: 'Menjelaskan proteksi kata sandi, bahaya phishing/malware, dan etika berkomunikasi di media sosial.',
    semester: '1 (Ganjil)',
    fase: 'Fase D (Kelas 7 - 9)',
    kktp: 75,
    ringkasanRaporTuntas: 'Bijak bermedia sosial, paham bahaya kebocoran data, dan menerapkan two-factor authentication',
    ringkasanRaporPerluBimbingan: 'Perlu pembiasaan verifikasi kebenaran sumber informasi (anti hoaks)'
  }
];

// -------------------------------------------------------------
// PRESETS REGISTRY
// -------------------------------------------------------------
export const CURRICULUM_PHASE_PRESETS: Record<CurriculumPhaseKey, CurriculumPhasePreset> = {
  fase_a: {
    key: 'fase_a',
    label: 'Fase A (Kelas 1 - 2 SD)',
    shortLabel: 'Fase A',
    gradeLevels: 'Kelas 1 & 2 SD',
    defaultClassName: 'Kelas 1A (Merdeka)',
    description: 'Fondasi literasi-numerasi awal, pengenalan simbol Pancasila, kebiasaan hidup bersih (tanpa mapel IPAS terpisah).',
    icon: '🌱',
    colorClass: 'from-emerald-500 to-teal-600',
    subjects: SUBJECTS_FASE_A,
    tujuanPembelajaran: TP_FASE_A
  },
  fase_b: {
    key: 'fase_b',
    label: 'Fase B (Kelas 3 - 4 SD)',
    shortLabel: 'Fase B',
    gradeLevels: 'Kelas 3 & 4 SD',
    defaultClassName: 'Kelas 4A (Merdeka)',
    description: 'Pengenalan IPAS terpadu, bilangan cacah 10.000, pecahan senilai, teks narasi & prosedur.',
    icon: '🚀',
    colorClass: 'from-blue-500 to-indigo-600',
    subjects: SUBJECTS_FASE_B,
    tujuanPembelajaran: TP_FASE_B
  },
  fase_c: {
    key: 'fase_c',
    label: 'Fase C (Kelas 5 - 6 SD)',
    shortLabel: 'Fase C',
    gradeLevels: 'Kelas 5 & 6 SD',
    defaultClassName: 'Kelas 6A (Merdeka)',
    description: 'Pendalaman IPAS organ tubuh & tata surya, pecahan desimal/rasio, teks eksplanasi ilmiah & naskah pidato.',
    icon: '🏆',
    colorClass: 'from-purple-500 to-violet-600',
    subjects: SUBJECTS_FASE_C,
    tujuanPembelajaran: TP_FASE_C
  },
  fase_d: {
    key: 'fase_d',
    label: 'Fase D (Kelas 7 - 9 SMP/MTs)',
    shortLabel: 'Fase D',
    gradeLevels: 'Kelas 7, 8, & 9 SMP',
    defaultClassName: 'Kelas 7A (Merdeka SMP)',
    description: 'Pemisahan IPA & IPS, mata pelajaran Informatika, aljabar, metode ilmiah, dan berpikir komputasional.',
    icon: '🎓',
    colorClass: 'from-amber-500 to-orange-600',
    subjects: SUBJECTS_FASE_D,
    tujuanPembelajaran: TP_FASE_D
  }
};

/**
 * Helper to generate standard GradeRecords for any list of students, subjects, and TPs (Standar: nilai setiap TP adalah 0).
 */
export function generateGradesForCurriculumPhase(
  students: Student[],
  subjects: Subject[],
  _tps?: TujuanPembelajaran[]
): GradeRecord[] {
  const grades: GradeRecord[] = [];

  students.forEach((student) => {
    subjects.forEach((subject) => {
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
}

/**
 * Detect which phase key matches a given phase string (e.g. "Fase B (Kelas IV)" -> "fase_b")
 */
export function detectPhaseKey(phaseString?: string): CurriculumPhaseKey {
  if (!phaseString) return 'fase_b';
  const lower = phaseString.toLowerCase();
  if (lower.includes('fase a') || lower.includes('kelas 1') || lower.includes('kelas 2') || lower.includes('kelas i') || lower.includes('kelas ii')) {
    return 'fase_a';
  }
  if (lower.includes('fase c') || lower.includes('kelas 5') || lower.includes('kelas 6') || lower.includes('kelas v') || lower.includes('kelas vi')) {
    return 'fase_c';
  }
  if (lower.includes('fase d') || lower.includes('kelas 7') || lower.includes('kelas 8') || lower.includes('kelas 9') || lower.includes('smp') || lower.includes('mts')) {
    return 'fase_d';
  }
  return 'fase_b';
}
