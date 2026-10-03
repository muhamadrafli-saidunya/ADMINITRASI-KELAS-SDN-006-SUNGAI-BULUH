import { ModulAjar } from '../types';

export const INITIAL_MODUL_AJAR_LIST: ModulAjar[] = [
  {
    id: 'ma-ipas-4-01',
    kodeModul: 'MA-IPAS-4-01',
    judul: 'Bagian Tubuh Tumbuhan dan Proses Fotosintesis',
    mataPelajaran: 'Ilmu Pengetahuan Alam & Sosial (IPAS)',
    mapelKode: 'IPAS',
    fase: 'Fase B',
    kelas: '4',
    semester: '1 (Ganjil)',
    alokasiWaktu: '3 JP (3 x 35 Menit) / 1 Pertemuan',
    jumlahPertemuan: 1,
    penyusun: 'Sri Wahyuni, S.Pd., Gr.',
    nipPenyusun: '19880412 201201 2 018',
    instansi: 'SD Negeri Nusantara 01',
    tahunPenyusunan: '2025/2026',
    elemenCP: 'Pemahaman IPAS (Sains dan Sosial)',
    capaianPembelajaran: 'Peserta didik menganalisis hubungan antara bentuk serta fungsi bagian tubuh pada manusia dan tumbuhan; peserta didik dapat membuat simulasi menggunakan bagan/alat bantu sederhana tentang siklus hidup tumbuhan dan proses fotosintesis.',
    tujuanPembelajaran: [
      'Mengidentifikasi bagian-bagian tubuh tumbuhan (akar, batang, daun, bunga, buah, biji) beserta fungsi utamanya bagi kelangsungan hidup tumbuhan.',
      'Menjelaskan proses fotosintesis pada daun serta mengaitkan pentingnya peran cahaya matahari, air, klorofil, dan karbon dioksida bagi ekosistem bumi.',
      'Melakukan penyelidikan sederhana pengangkutan air melalui batang tumbuhan seledri/sawar putih dengan pewarna makanan.'
    ],
    alurTujuanPembelajaran: 'ATP IPAS Fase B - Elemen Sains: 4.1 Mengamati morfologi tumbuhan -> 4.2 Menganalisis fungsi organ tumbuhan -> 4.3 Menyelidiki reaksi fotosintesis sederhana.',
    profilPelajarPancasila: [
      'Bernalar Kritis (Memproses informasi dan menganalisis hubungan sebab-akibat fotosintesis)',
      'Gotong Royong (Bekerja sama dalam penyelidikan kelompok dan eksperimen sederhana)',
      'Kreatif (Membuat bagan visual/sketsa alur fotosintesis)',
      'Mandiri (Bertanggung jawab menyelesaikan LKPD mandiri)'
    ],
    saranaPrasarana: {
      media: 'Slide PowerPoint Interaktif, Video Animasi Fotosintesis Kemendikbudristek, Poster Anatomi Tumbuhan, Kartu Kata Bagian Tumbuhan.',
      alatDanBahan: 'Tanaman pacar air/seledri segar, gelas kaca bening, pewarna makanan merah/biru, pisau plastik cutter, lup (kaca pembesar), daun segar, alkohol 70%, iodin/betadine.',
      sumberBelajar: 'Buku Siswa & Guru IPAS Kelas 4 Kurikulum Merdeka (Kemendikbud 2022), Lingkungan Taman Sekolah, Ensiklopedia Sains Anak.',
      lingkunganBelajar: 'Ruang Kelas & Taman Sekolah (Outdoor Learning)'
    },
    targetPesertaDidik: 'Peserta didik reguler/tipikal kelas 4 (28 siswa), termasuk diferensiasi bagi pembelajar visual, auditori, dan kinestetik.',
    modelPembelajaran: 'Problem Based Learning (PBL) berbasis Inkuiri Terbimbing',
    metodePembelajaran: ['Pengamatan Langsung', 'Eksperimen Kelompok', 'Tanya Jawab Terarah', 'Diskusi', 'Presentasi Karya'],
    pemahamanBermakna: 'Tumbuhan adalah produsen utama di bumi yang menghasilkan oksigen dan makanan bagi manusia dan hewan melalui proses fotosintesis. Merawat tumbuhan berarti menjaga nafas kehidupan bumi.',
    pertanyaanPemantik: [
      'Apakah tumbuhan makan dan minum seperti kita manusia? Bagaimana caranya tumbuhan makan tanpa memiliki mulut?',
      'Mengapa sebagian besar daun tumbuhan berwarna hijau? Apa yang terjadi jika bumi tidak memiliki sinar matahari sama sekali?',
      'Bagaimana air dari dalam tanah bisa sampai ke pucuk daun pohon yang sangat tinggi?'
    ],
    kegiatanPembelajaran: {
      pendahuluan: [
        {
          sintaks: 'Pembukaan & Doa',
          menit: 5,
          deskripsi: 'Guru membuka pembelajaran dengan salam ramah, menunjuk ketua kelas memimpin doa bersama, dan memeriksa presensi siswa.'
        },
        {
          sintaks: 'Apersepsi & Motivasi',
          menit: 5,
          deskripsi: 'Guru membawa satu pot tanaman hias hidup ke depan kelas. Guru bertanya: "Anak-anak, mengapa tanaman di pot ini bisa tetap segar dan tumbuh tinggi walau hanya kita siram air di tanahnya?" Siswa merespon secara aktif.'
        },
        {
          sintaks: 'Tujuan & Asesmen Awal',
          menit: 5,
          deskripsi: 'Guru menyampaikan tujuan pembelajaran, kegiatan eksperimen yang akan dilakukan, pembagian kelompok, dan kriteria penilaian Profil Pelajar Pancasila.'
        }
      ],
      inti: [
        {
          sintaks: 'Fase 1: Orientasi Siswa pada Masalah',
          menit: 15,
          deskripsi: 'Guru menampilkan video pendek tentang pohon beringin raksasa dan tanaman sayur di kebun hidroponik. Guru memantik rasa ingin tahu: "Bagaimana pabrik makanan di dalam daun bekerja mengubah sinar matahari dan air menjadi zat gula & oksigen?"',
          diferensiasi: 'Siswa visual menyimak infografis bagian daun; siswa auditori mendengarkan dongeng sains "Perjalanan Si Butir Air".'
        },
        {
          sintaks: 'Fase 2: Mengorganisasikan Siswa untuk Belajar',
          menit: 15,
          deskripsi: 'Guru membagi kelas menjadi 5 kelompok heterogen (5-6 siswa). Setiap kelompok menerima LKPD 1 (Morfologi Tumbuhan) dan perangkat eksperimen kapilaritas batang seledri berwarna.',
          diferensiasi: 'Kelompok dengan pemahaman awal cepat diberikan tantangan menganalisis stomata dan klorofil; kelompok yang memerlukan bimbingan didampingi guru membaca bagan organ dasar.'
        },
        {
          sintaks: 'Fase 3: Membimbing Penyelidikan Mandiri & Kelompok',
          menit: 25,
          deskripsi: 'Siswa melakukan pengamatan pada batang seledri yang telah direndam air pewarna merah selama 1 jam. Siswa memotong melintang batang dengan pisau plastik dan mengamati pembuluh xilem menggunakan kaca pembesar. Siswa mencatat hasil di LKPD.',
          diferensiasi: 'Siswa kinestetik mempraktikkan pemotongan dan pengamatan mikroskop/lup; siswa visual menggambar diagram penampang batang di lembar kerja.'
        },
        {
          sintaks: 'Fase 4: Mengembangkan & Menyajikan Hasil Karya',
          menit: 15,
          deskripsi: 'Setiap kelompok menyusun poster alur "Dapur Ajaib Daun: Rumus Fotosintesis" (Air + Karbon Dioksida + Cahaya + Klorofil = Glukosa + Oksigen). Perwakilan 2 kelompok mempresentasikan temuan mereka di depan kelas.'
        },
        {
          sintaks: 'Fase 5: Menganalisis & Mengevaluasi Proses Pemecahan Masalah',
          menit: 10,
          deskripsi: 'Guru bersama seluruh siswa menyimpulkan keterkaitan fungsi akar (penyerap), batang (pengangkut), dan daun (dapur fotosintesis). Guru memberikan apresiasi "Tepuk Apresiasi Juara" kepada seluruh kelompok.'
        }
      ],
      penutup: [
        {
          sintaks: 'Refleksi Pembelajaran',
          menit: 5,
          deskripsi: 'Siswa dan guru melakukan refleksi bersama dengan mengisi lembar "Emoticon Belajarku" (Apa hal paling seru yang kupelajari hari ini? Bagian mana yang masih membingungkan?).'
        },
        {
          sintaks: 'Evaluasi & Tindak Lanjut',
          menit: 5,
          deskripsi: 'Guru memberikan kuis singkat 3 butir soal pemahaman formatif (Exit Ticket) dan menugaskan siswa menyiram tanaman di rumah masing-masing.'
        },
        {
          sintaks: 'Doa & Penutup',
          menit: 5,
          deskripsi: 'Menyanyikan lagu daerah "Gundul-Gundul Pacul" dan menutup pembelajaran dengan doa syukur serta salam hangat.'
        }
      ]
    },
    asesmen: {
      diagnostik: 'Tanya jawab lisan di awal pembelajaran mengenai pengalaman merawat tanaman di rumah dan menebak nama bagian tumbuhan dari gambar.',
      formatif: 'Observasi keaktifan diskusi kelompok, penilaian unjuk kerja saat eksperimen kapilaritas batang, dan kelengkapan lembar kerja siswa (LKPD).',
      sumatif: 'Tes tertulis di akhir lingkup materi Bab 1 (Pilihan Ganda beralasan dan uraian analisis peran klorofil dalam fotosintesis).',
      rubrikPenilaian: 'Rubrik Penilaian Sikap Gotong Royong (Skor 1-4), Rubrik Keterampilan Eksperimen Sains (Ketelitian, Kebersihan, Ketepatan Analisis), Rubrik Presentasi Lisan.',
      teknikPenilaian: ['Tes Tertulis', 'Observasi Sikap', 'Unjuk Kerja / Praktik Sains', 'Produk Poster'],
      instrumenPenilaian: ['Lembar Observasi Profil Pancasila', 'Lembar Kerja Peserta Didik (LKPD)', 'Soal Evaluasi Formatif', 'Kunci Jawaban & Rubrik']
    },
    remedialDanPengayaan: {
      remedial: 'Bagi peserta didik yang belum memahami fungsi organ tumbuhan, guru memberikan bimbingan khusus menggunakan flashcard bergambar dan pendampingan tutor sebaya.',
      pengayaan: 'Bagi peserta didik dengan capaian tinggi, diberikan tugas proyek meneliti pengaruh intensitas cahaya matahari terhadap laju kesegaran kecambah kacang hijau.'
    },
    refleksi: {
      guru: [
        'Apakah seluruh peserta didik aktif terlibat dalam kegiatan penyelidikan kelompok?',
        'Kendala apa yang muncul saat pelaksanaan eksperimen kapilaritas batang seledri?',
        'Bagaimana efektivitas manajemen waktu pada tahap presentasi kelompok?'
      ],
      siswa: [
        'Bagian kegiatan mana yang paling menyenangkan menurutmu?',
        'Apakah kamu sudah bisa menjelaskan mengapa daun bisa menghasilkan oksigen bagi kita?',
        'Sikap baik apa yang sudah kamu tunjukkan saat bekerja bersama teman sekelompok?'
      ]
    },
    lampiran: {
      lkpdJudul: 'Lembar Kerja Peserta Didik (LKPD): Membuktikan Pengangkutan Air & Dapur Daun',
      lkpdDeskripsi: 'Petunjuk praktikum pengamatan kapilaritas batang seledri dan penyusunan bagan fotosintesis tumbuhan hijau.',
      lkpdPetunjuk: [
        'Tuliskan nama anggota kelompokmu pada kolom yang tersedia.',
        'Lakukan pemotongan melintang batang seledri yang sudah direndam air pewarna secara hati-hati.',
        'Amati bintik-bintik merah/biru pada penampang batang menggunakan kaca pembesar.',
        'Diskusikan pertanyaan analisis nomor 1 - 4 bersama teman sekelompokmu.'
      ],
      lkpdTugas: [
        {
          soal: 'Sebutkan 5 bagian utama pada tumbuhan lengkap beserta fungsi pokoknya masing-masing!',
          tipe: 'esai',
          kunciJawaban: 'Akar (menyerap air & mineral), Batang (menopang & mengangkut zat makanan), Daun (tempat fotosintesis), Bunga (alat perkembangbiakan), Buah/Biji (menyimpan cadangan makanan & calon individu baru).'
        },
        {
          soal: 'Berdasarkan hasil pengamatan pada batang seledri, apa yang menyebabkan warna batang berubah menjadi merah/biru?',
          tipe: 'analisis',
          kunciJawaban: 'Karena air berwarna diserap dan diangkut ke atas melalui pembuluh kayu (xilem) yang ada di dalam batang.'
        },
        {
          soal: 'Tuliskan bahan-bahan yang dibutuhkan daun untuk fotosintesis dan hasil yang dikeluarkannya!',
          tipe: 'esai',
          kunciJawaban: 'Bahan yang dibutuhkan: Air (dari akar), Karbon Dioksida (dari udara), Cahaya Matahari, dan Klorofil (zat hijau daun). Hasilnya: Karbohidrat/Glukosa (makanan tumbuhan) dan Oksigen (O2) yang dilepaskan ke udara.'
        }
      ],
      bahanBacaanGuruDanSiswa: 'Buku Panduan Guru & Siswa IPAS Kelas IV Bab 1 "Tumbuhan, Sumber Kehidupan di Bumi", Badan Standar, Kurikulum, dan Asesmen Pendidikan Kemendikbudristek 2022. Artikel Sains Anak: Mengenal Misteri Klorofil.',
      glosarium: [
        { istilah: 'Fotosintesis', arti: 'Proses pembentukan makanan oleh tumbuhan hijau dengan bantuan energi cahaya matahari.' },
        { istilah: 'Klorofil', arti: 'Zat hijau daun yang berfungsi menangkap energi cahaya matahari untuk fotosintesis.' },
        { istilah: 'Xilem', arti: 'Jaringan pembuluh pengangkut pada tumbuhan yang membawa air dan mineral dari akar ke daun.' },
        { istilah: 'Stomata', arti: 'Mulut daun tempat terjadinya pertukaran gas oksigen dan karbon dioksida.' }
      ],
      daftarPustaka: [
        'Fitri, Amalia, dkk. (2022). Ilmu Pengetahuan Alam dan Sosial untuk SD Kelas IV. Jakarta: Kementerian Pendidikan, Kebudayaan, Riset, dan Teknologi.',
        'BSKAP Kemendikbudristek. (2024). Capaian Pembelajaran Mata Pelajaran IPAS Fase B Jenjang SD/MI.',
        'Campbell, Neil A., dkk. (2020). Biology: Concepts and Connections. Pearson Education.'
      ]
    },
    kategori: 'Modul Pokok',
    tags: ['IPAS', 'Fase B', 'Kelas 4', 'Tumbuhan', 'Fotosintesis', 'PBL', 'Kurikulum Merdeka'],
    createdAt: '2025-07-15',
    updatedAt: '2025-08-10',
    isFavorite: true
  },
  {
    id: 'ma-mat-4-01',
    kodeModul: 'MA-MAT-4-01',
    judul: 'Pecahan Senilai dengan Model Konkret dan Gambar Berarsir',
    mataPelajaran: 'Matematika',
    mapelKode: 'MAT',
    fase: 'Fase B',
    kelas: '4',
    semester: '1 (Ganjil)',
    alokasiWaktu: '3 JP (3 x 35 Menit) / 1 Pertemuan',
    jumlahPertemuan: 1,
    penyusun: 'Sri Wahyuni, S.Pd., Gr.',
    nipPenyusun: '19880412 201201 2 018',
    instansi: 'SD Negeri Nusantara 01',
    tahunPenyusunan: '2025/2026',
    elemenCP: 'Bilangan',
    capaianPembelajaran: 'Peserta didik dapat membandingkan dan mengurutkan berbagai pecahan termasuk pecahan senilai menggunakan gambar dan benda konkret; menyelesaikan masalah yang berkaitan dengan pecahan senilai dalam kehidupan sehari-hari.',
    tujuanPembelajaran: [
      'Menjelaskan konsep pecahan senilai menggunakan representasi benda konkret (kertas lipat origami/pizza pecahan).',
      'Menentukan beberapa pecahan senilai dari suatu pecahan melalui perkalian atau pembagian pembilang dan penyebut dengan angka yang sama.',
      'Memecahkan masalah kontekstual sehari-hari yang berkaitan dengan perbandingan pecahan senilai.'
    ],
    alurTujuanPembelajaran: 'ATP Matematika Fase B: 4.1 Memahami makna pembilang & penyebut -> 4.2 Menemukan pecahan senilai melalui model konkret -> 4.3 Mengurutkan pecahan berpenyebut tidak sama.',
    profilPelajarPancasila: [
      'Bernalar Kritis (Menganalisis perbandingan luas daerah arsiran pada bentuk geometri)',
      'Gotong Royong (Berdiskusi membagi kertas origami bersama pasangan kerja)',
      'Mandiri (Menyelesaikan soal latihan pecahan secara cermat)'
    ],
    saranaPrasarana: {
      media: 'Media Manipulatif Pizza Pecahan, Kertas Origami Warna-warni, Papan Pecahan Magnetik, Ppt Interaktif.',
      alatDanBahan: 'Kertas origami (2 lembar per anak), gunting anak, spidol warna, penggaris, lem kertas.',
      sumberBelajar: 'Buku Siswa Matematika Kelas 4 Kurikulum Merdeka (Kemendikbudristek), Lembar Aktivitas Eksplorasi.',
      lingkunganBelajar: 'Ruang Kelas (Pengaturan Meja Formasi Tapal Kuda / U-Shape)'
    },
    targetPesertaDidik: 'Peserta didik reguler/tipikal (28 siswa) dengan tingkat penguasaan konsep pecahan awal beragam.',
    modelPembelajaran: 'Discovery Learning dengan Pendekatan Konkret-Piktorial-Abstrak (CPA Approach)',
    metodePembelajaran: ['Eksplorasi Origami', 'Demonstrasi', 'Penugasan Berpasangan', 'Game Tebak Pecahan'],
    pemahamanBermakna: 'Pecahan senilai menunjukkan nilai bagian yang sama besar meskipun dituliskan dengan angka pembilang dan penyebut yang berbeda.',
    pertanyaanPemantik: [
      'Jika kamu memiliki 1/2 loyang martabak dan temanmu memiliki 2/4 loyang martabak yang sama besar, siapakah yang mendapatkan bagian lebih banyak?',
      'Bagaimana cara membuktikan bahwa 1/2 itu sama persis ukurannya dengan 2/4, 3/6, atau 4/8?'
    ],
    kegiatanPembelajaran: {
      pendahuluan: [
        {
          sintaks: 'Apersepsi Kontekstual',
          menit: 10,
          deskripsi: 'Guru memperagakan membagi selembar roti tawar menjadi 2 potong sama besar (1/2), dan roti kedua dipotong menjadi 4 bagian sama besar lalu mengambil 2 bagian (2/4). Guru menanyakan perbandingan kedua bagian roti.'
        }
      ],
      inti: [
        {
          sintaks: 'Tahap 1: Pengalaman Konkret (Concrete)',
          menit: 25,
          deskripsi: 'Siswa melipat kertas origami menjadi 2 bagian lalu mengarsir 1 bagian (1/2). Selanjutnya melipat origami kedua dengan ukuran sama menjadi 4 bagian lalu mengarsir 2 bagian (2/4). Siswa menumpuk kedua kertas untuk membandingkan luasan arsiran.'
        },
        {
          sintaks: 'Tahap 2: Representasi Gambar (Pictorial)',
          menit: 20,
          deskripsi: 'Siswa menggambar lingkaran pecahan dan persegi panjang pada LKPD lalu membuktikan bahwa 1/3 = 2/6 = 3/9 melalui arsiran warna yang sejajar.'
        },
        {
          sintaks: 'Tahap 3: Simbolik Abstrak (Abstract)',
          menit: 20,
          deskripsi: 'Guru membimbing siswa merumuskan rumus pecahan senilai: Mengalikan atau membagi pembilang dan penyebut dengan bilangan bulat yang sama bukan nol (a/b = (a x n)/(b x n)).'
        }
      ],
      penutup: [
        {
          sintaks: 'Kesimpulan & Refleksi',
          menit: 15,
          deskripsi: 'Siswa mempresentasikan kesimpulan, melakukan kuis cepat 3 soal di papan tulis, dan mencatat pekerjaan rumah kreatif.'
        }
      ]
    },
    asesmen: {
      diagnostik: 'Pre-test pengenalan pembilang dan penyebut pada gambar pizza 4 potong.',
      formatif: 'Keterampilan melipat origami, lembar kerja pecahan senilai, dan unjuk kerja penjelasan lisan.',
      sumatif: 'Tes tertulis 10 butir soal pecahan senilai dan penyelesaian soal cerita.',
      rubrikPenilaian: 'Rubrik Ketepatan Melipat dan Mengarsir (1-4), Rubrik Perhitungan Simbolik (1-4).',
      teknikPenilaian: ['Tes Tertulis', 'Observasi Kinerja', 'Portofolio Lipat Kertas'],
      instrumenPenilaian: ['LKPD Pecahan', 'Lembar Soal Uji Kompetensi']
    },
    remedialDanPengayaan: {
      remedial: 'Bimbingan khusus menggunakan blok pecahan plastik untuk anak yang kesulitan membandingkan nilai arsiran.',
      pengayaan: 'Menyederhanakan pecahan besar (misal 36/48) ke bentuk paling sederhana menggunakan FPB.'
    },
    refleksi: {
      guru: ['Apakah media origami membantu siswa memahami luas daerah pecahan senilai secara nyata?'],
      siswa: ['Apakah sekarang aku sudah bisa mencari 3 pecahan yang senilai dengan 2/5?']
    },
    lampiran: {
      lkpdJudul: 'LKPD Matematika: Menemukan Rahasia Pecahan Senilai',
      lkpdDeskripsi: 'Aktivitas eksplorasi gambar berarsir dan melengkapi pecahan senilai.',
      lkpdPetunjuk: ['Arsirlah gambar sesuai nilai pecahan!', 'Tentukan nilai pecahan yang senilai pada kotak titik-titik!'],
      lkpdTugas: [
        {
          soal: 'Tentukan 3 pecahan yang senilai dengan pecahan 3/4!',
          tipe: 'esai',
          kunciJawaban: '6/8 (dikali 2), 9/12 (dikali 3), 12/16 (dikali 4).'
        },
        {
          soal: 'Ibu memiliki kue bolu. Ibu memotongnya menjadi 8 bagian sama besar dan memberikan 4 bagian kepada Dika. Berapa pecahan paling sederhana dari bagian kue Dika?',
          tipe: 'esai',
          kunciJawaban: '4/8 = 1/2 bagian kue.'
        }
      ],
      bahanBacaanGuruDanSiswa: 'Buku Matematika Vol 1 Kelas IV Kurikulum Merdeka Kemendikbudristek 2022.',
      glosarium: [
        { istilah: 'Pembilang', arti: 'Angka di bagian atas pecahan yang menunjukkan banyaknya bagian yang diambil.' },
        { istilah: 'Penyebut', arti: 'Angka di bagian bawah pecahan yang menunjukkan jumlah seluruh bagian sama besar.' },
        { istilah: 'Pecahan Senilai', arti: 'Dua atau lebih pecahan yang memiliki nilai atau perbandingan yang sama besar.' }
      ],
      daftarPustaka: [
        'Hobri, dkk. (2022). Matematika untuk SD/MI Kelas IV. Jakarta: Kemendikbudristek.'
      ]
    },
    kategori: 'Modul Pokok',
    tags: ['Matematika', 'Fase B', 'Kelas 4', 'Pecahan Senilai', 'CPA Approach'],
    createdAt: '2025-07-20',
    updatedAt: '2025-08-11',
    isFavorite: true
  },
  {
    id: 'ma-bin-4-01',
    kodeModul: 'MA-BIN-4-01',
    judul: 'Menemukan Ide Pokok dan Ide Pendukung dalam Teks Narasi Cerita Rakyat',
    mataPelajaran: 'Bahasa Indonesia',
    mapelKode: 'BIN',
    fase: 'Fase B',
    kelas: '4',
    semester: '1 (Ganjil)',
    alokasiWaktu: '3 JP (3 x 35 Menit)',
    jumlahPertemuan: 1,
    penyusun: 'Sri Wahyuni, S.Pd., Gr.',
    nipPenyusun: '19880412 201201 2 018',
    instansi: 'SD Negeri Nusantara 01',
    tahunPenyusunan: '2025/2026',
    elemenCP: 'Membaca dan Memirsa',
    capaianPembelajaran: 'Peserta didik mampu memahami pesan dan informasi tentang kehidupan sehari-hari, teks narasi, dan puisi anak dalam bentuk cetak atau elektronik; mampu mengidentifikasi ide pokok dan ide pendukung pada setiap paragraf teks bacaan.',
    tujuanPembelajaran: [
      'Menjelaskan pengertian dan ciri-ciri ide pokok serta kalimat pengembang/pendukung dalam suatu paragraf.',
      'Menemukan ide pokok pada paragraf deduktif dan induktif dari teks cerita rakyat Nusantara "Legenda Danau Toba".',
      'Menceritakan kembali isi teks narasi secara lisan dengan runtut menggunakan kosakata baku.'
    ],
    alurTujuanPembelajaran: 'ATP B. Indonesia Fase B: 4.1 Membaca intensif teks narasi -> 4.2 Menentukan kalimat utama & ide pokok -> 4.3 Menyusun ringkasan paragraf.',
    profilPelajarPancasila: [
      'Bernalar Kritis (Menganalisis inti gagasan kalimat dalam paragraf)',
      'Berkebinekaan Global (Menghargai warisan budaya cerita rakyat nusantara)',
      'Mandiri (Membaca mandiri dengan teknik membaca intensif)'
    ],
    saranaPrasarana: {
      media: 'Buku Cerita Bergambar Nusantara, Teks Bacaan Cerita Rakyat Danau Toba, Kartu Paragraf Warna, Audio Cerita Rakyat.',
      alatDanBahan: 'Stabilo warna / highlighter, lembar kerja siswa, proyektor LCD.',
      sumberBelajar: 'Buku Siswa Bahasa Indonesia "Lihat Sekitar" Kelas IV Kemendikbudristek 2022, Cerita Rakyat Nusantara.',
      lingkunganBelajar: 'Ruang Kelas & Pojok Literasi Kelas'
    },
    targetPesertaDidik: 'Peserta didik reguler (28 siswa) dengan kemampuan membaca lancar dan pemahaman isi.',
    modelPembelajaran: 'Cooperative Learning tipe Think-Pair-Share (TPS)',
    metodePembelajaran: ['Membaca Nyaring', 'Membaca Intensif', 'Think-Pair-Share', 'Penugasan Analisis Teks'],
    pemahamanBermakna: 'Kemampuan menemukan ide pokok membantu kita memahami inti sari buku bacaan, artikel ilmu pengetahuan, dan pesan penting secara cepat dan akurat.',
    pertanyaanPemantik: [
      'Pernahkah kamu membaca buku tebal? Bagaimana cara mengetahui inti cerita buku tersebut tanpa harus menghafal setiap katanya?',
      'Di mana biasanya kalimat utama yang menyimpan ide pokok dalam sebuah paragraf diletakkan?'
    ],
    kegiatanPembelajaran: {
      pendahuluan: [
        {
          sintaks: 'Literasi Pembuka',
          menit: 10,
          deskripsi: 'Membaca senyap 5 menit cerita fabel di pojok baca, guru bertanya apa inti pesan dari fabel tersebut.'
        }
      ],
      inti: [
        {
          sintaks: 'Think (Berpikir Mandiri)',
          menit: 25,
          deskripsi: 'Siswa membaca teks narasi "Legenda Danau Toba". Siswa menandai kalimat yang menurutnya menjadi inti pembahasan setiap paragraf menggunakan stabilo warna.'
        },
        {
          sintaks: 'Pair (Berpasangan)',
          menit: 20,
          deskripsi: 'Siswa berdiskusi dengan teman sebangkunya untuk mencocokkan ide pokok yang ditemukan dan membedakannya dari kalimat penjelas.'
        },
        {
          sintaks: 'Share (Berbagi ke Kelas)',
          menit: 20,
          deskripsi: 'Tiga pasang siswa maju ke depan kelas mempresentasikan tabel analisis ide pokok paragraf 1 sampai 4.'
        }
      ],
      penutup: [
        {
          sintaks: 'Refleksi & Apresiasi',
          menit: 15,
          deskripsi: 'Guru memberikan penguatan teknik menemukan ide pokok (Paragraf Deduktif di awal, Induktif di akhir, Campuran di awal dan akhir).'
        }
      ]
    },
    asesmen: {
      diagnostik: 'Tes membaca pemahaman cepat 1 paragraf sederhana.',
      formatif: 'Tabel analisis ide pokok dan ide penjelas pada teks Danau Toba.',
      sumatif: 'Uji kompetensi membaca 3 paragraf baru dan memilih ide pokok yang tepat.',
      rubrikPenilaian: 'Rubrik Ketepatan Menemukan Ide Pokok (1-4), Rubrik Keterampilan Berbicara & Berbagi (1-4).',
      teknikPenilaian: ['Tes Tertulis', 'Unjuk Kerja Membaca'],
      instrumenPenilaian: ['Teks Bacaan', 'Lembar Kerja Analisis Paragraf']
    },
    remedialDanPengayaan: {
      remedial: 'Latihan membaca terbimbing pada paragraf pendek (2-3 kalimat) untuk mengidentifikasi siapa dan apa yang sedang dibahas.',
      pengayaan: 'Menyusun sebuah paragraf narasi karya sendiri yang memiliki ide pokok jelas dan 3 kalimat pengembang.'
    },
    refleksi: {
      guru: ['Apakah metode Think-Pair-Share efektif meningkatkan keaktifan siswa yang pendiam?'],
      siswa: ['Apakah aku sudah bisa membedakan mana kalimat inti dan mana kalimat pendukung?']
    },
    lampiran: {
      lkpdJudul: 'LKPD Bahasa Indonesia: Menemukan Inti Cerita Rakyat',
      lkpdDeskripsi: 'Menganalisis ide pokok dan kalimat penjelas pada teks Legenda Danau Toba.',
      lkpdPetunjuk: ['Bacalah teks dengan seksama!', 'Isikan ide pokok dan ide pendukung pada tabel yang disediakan!'],
      lkpdTugas: [
        {
          soal: 'Tuliskan ide pokok pada paragraf pertama teks Legenda Danau Toba!',
          tipe: 'esai',
          kunciJawaban: 'Kehidupan Toba sebagai seorang petani dan pemancing yang rajin di sebuah desa di Sumatera Utara.'
        }
      ],
      bahanBacaanGuruDanSiswa: 'Buku Siswa Bahasa Indonesia Kelas IV Kemendikbudristek 2022.',
      glosarium: [
        { istilah: 'Ide Pokok', arti: 'Gagasan utama atau inti dari suatu paragraf yang menjadi dasar pengembangan bacaan.' },
        { istilah: 'Ide Pendukung', arti: 'Gagasan penjelas yang menguraikan, memperjelas, atau memberi contoh pada ide pokok.' }
      ],
      daftarPustaka: ['Eva Yulia Nukman, dkk. (2022). Bahasa Indonesia: Lihat Sekitar untuk SD Kelas IV. Jakarta: Kemendikbudristek.']
    },
    kategori: 'Modul Pokok',
    tags: ['Bahasa Indonesia', 'Fase B', 'Kelas 4', 'Ide Pokok', 'Teks Narasi', 'Literasi'],
    createdAt: '2025-07-25',
    updatedAt: '2025-08-12',
    isFavorite: true
  },
  {
    id: 'ma-ppkn-4-01',
    kodeModul: 'MA-PPKN-4-01',
    judul: 'Makna Sila-Sila Pancasila dan Penerapannya dalam Kehidupan Sehari-Hari',
    mataPelajaran: 'Pendidikan Pancasila',
    mapelKode: 'PPKn',
    fase: 'Fase B',
    kelas: '4',
    semester: '1 (Ganjil)',
    alokasiWaktu: '2 JP (2 x 35 Menit)',
    jumlahPertemuan: 1,
    penyusun: 'Sri Wahyuni, S.Pd., Gr.',
    nipPenyusun: '19880412 201201 2 018',
    instansi: 'SD Negeri Nusantara 01',
    tahunPenyusunan: '2025/2026',
    elemenCP: 'Pancasila',
    capaianPembelajaran: 'Peserta didik mampu memahami makna sila-sila Pancasila serta menerapkan nilai-nilai Pancasila dalam kehidupan sehari-hari di lingkungan keluarga, sekolah, dan masyarakat; menunjukkan sikap toleransi dan gotong royong.',
    tujuanPembelajaran: [
      'Menghubungkan lambang/simbol Garuda Pancasila dengan bunyi dan makna kelima sila Pancasila.',
      'Memberikan contoh konkret perilaku pengamalan sila ke-1 sampai ke-5 Pancasila di lingkungan sekolah dan rumah.',
      'Menunjukkan sikap gotong royong dan musyawarah saat menyelesaikan tugas penataan pojok kelas.'
    ],
    alurTujuanPembelajaran: 'ATP Pendidikan Pancasila Fase B: 4.1 Makna Sila Pancasila -> 4.2 Pengamalan Nilai Pancasila -> 4.3 Musyawarah dan Mufakat.',
    profilPelajarPancasila: [
      'Beriman, Bertakwa kepada Tuhan YME dan Berakhlak Mulia',
      'Gotong Royong',
      'Berkebinekaan Global'
    ],
    saranaPrasarana: {
      media: 'Gambar Burung Garuda Pancasila Ukuran Besar, Kartu Kasus Sikap, Video Profil Pelajar Pancasila.',
      alatDanBahan: 'Kertas manila, lem, gunting, kartu simbol sila.',
      sumberBelajar: 'Buku Siswa Pendidikan Pancasila Kelas IV Kemendikbudristek 2023.',
      lingkunganBelajar: 'Ruang Kelas'
    },
    targetPesertaDidik: 'Peserta didik reguler (28 siswa).',
    modelPembelajaran: 'Project Based Learning (PjBL) sederhana / Role Playing',
    metodePembelajaran: ['Simulasi Kasus', 'Permainan Cocok Simbol', 'Diskusi Reflektif'],
    pemahamanBermakna: 'Pancasila bukan sekadar hafalan, melainkan pedoman hidup yang membimbing kita saling menghargai teman yang berbeda agama, adil kepada sesama, dan suka menolong.',
    pertanyaanPemantik: [
      'Apa yang kamu lakukan jika melihat temanmu terjatuh saat bermain di halaman sekolah?',
      'Mengapa musyawarah untuk mufakat lebih baik daripada bertengkar mempertahankan pendapat sendiri?'
    ],
    kegiatanPembelajaran: {
      pendahuluan: [
        {
          sintaks: 'Menyanyikan Lagu Wajib',
          menit: 10,
          deskripsi: 'Menyanyikan lagu "Garuda Pancasila" dengan penuh semangat dan mengamati 5 perisai pada dada burung Garuda.'
        }
      ],
      inti: [
        {
          sintaks: 'Eksplorasi Kasus',
          menit: 25,
          deskripsi: 'Siswa dibagikan kartu kasus: "Andi menolong Made yang beragama Hindu membersihkan sampah". Siswa menentukan tindakan tersebut mencerminkan sila ke berapa.'
        },
        {
          sintaks: 'Pohon Nilai Pancasila',
          menit: 20,
          deskripsi: 'Setiap kelompok membuat "Pohon Nilai Pancasila" di kertas manila dengan menempelkan daun-daun berisi contoh perilaku baik yang sudah mereka lakukan.'
        }
      ],
      penutup: [
        {
          sintaks: 'Ikrar Komitmen',
          menit: 15,
          deskripsi: 'Siswa membacakan ikrar bersama untuk selalu rukun dan tidak mengejek teman di kelas.'
        }
      ]
    },
    asesmen: {
      diagnostik: 'Tanya jawab simbol perisai Pancasila (Bintang, Rantai, Pohon Beringin, Kepala Banteng, Padi & Kapas).',
      formatif: 'Produk Pohon Nilai Pancasila dan observasi sikap empati selama pembelajaran.',
      sumatif: 'Tes pemahaman 10 butir pengelompokan perilaku berdasarkan sila Pancasila.',
      rubrikPenilaian: 'Rubrik Sikap Toleransi, Rubrik Produk Pohon Nilai.',
      teknikPenilaian: ['Observasi', 'Tes Tertulis', 'Produk Kreatif'],
      instrumenPenilaian: ['Lembar Observasi Sikap', 'Kuis Pancasila']
    },
    remedialDanPengayaan: {
      remedial: 'Mencocokkan kartu simbol sila dengan gambar tindakan sehari-hari.',
      pengayaan: 'Membuat komik pendek 4 panel tentang penerapan sila kedua (Kemanusiaan yang Adil dan Beradab).'
    },
    refleksi: {
      guru: ['Apakah siswa sudah mampu menghubungkan simbol dengan perilaku nyata?'],
      siswa: ['Sila mana yang paling sering aku terapkan hari ini di sekolah?']
    },
    lampiran: {
      lkpdJudul: 'LKPD Pendidikan Pancasila: Menjodohkan Perilaku dan Sila Pancasila',
      lkpdDeskripsi: 'Lembar aktivitas menghubungkan 10 contoh perbuatan baik dengan sila Pancasila yang sesuai.',
      lkpdPetunjuk: ['Tarik garis penghubung dari gambar perbuatan ke simbol sila yang tepat!'],
      lkpdTugas: [
        {
          soal: 'Menghormati teman yang sedang menjalankan ibadah sholat atau kebaktian adalah wujud pengamalan sila ke-...?',
          tipe: 'pilihan_ganda',
          kunciJawaban: 'Sila Ke-1: Ketuhanan Yang Maha Esa (Simbol Bintang Emas).'
        },
        {
          soal: 'Melakukan pemilihan ketua kelas secara tertib dan musyawarah adalah wujud pengamalan sila ke-...?',
          tipe: 'pilihan_ganda',
          kunciJawaban: 'Sila Ke-4: Kerakyatan yang Dipimpin oleh Hikmat Kebijaksanaan dalam Permusyawaratan/Perwakilan (Simbol Kepala Banteng).'
        }
      ],
      bahanBacaanGuruDanSiswa: 'Buku Siswa Pendidikan Pancasila Kelas IV Kemendikbudristek 2023.',
      glosarium: [
        { istilah: 'Musyawarah', arti: 'Pembahasan bersama dengan maksud mencapai keputusan atas penyelesaian masalah secara mufakat.' },
        { istilah: 'Toleransi', arti: 'Sikap saling menghargai dan menghormati perbedaan suku, agama, dan adat istiadat.' }
      ],
      daftarPustaka: ['Dede Kurniawan, dkk. (2023). Pendidikan Pancasila untuk SD/MI Kelas IV. Jakarta: Kemendikbudristek.']
    },
    kategori: 'Modul Pokok',
    tags: ['Pendidikan Pancasila', 'Fase B', 'Kelas 4', 'Sila Pancasila', 'Karakter'],
    createdAt: '2025-08-01',
    updatedAt: '2025-08-14',
    isFavorite: false
  },
  {
    id: 'ma-pai-4-01',
    kodeModul: 'MA-PAI-4-01',
    judul: 'Meneladani Asmaul Husna: Al-Malik, Al-Quddus, As-Salam, Al-Mu\'min, Al-Aziz',
    mataPelajaran: 'Pendidikan Agama Islam & Budi Pekerti',
    mapelKode: 'PAI',
    fase: 'Fase B',
    kelas: '4',
    semester: '1 (Ganjil)',
    alokasiWaktu: '3 JP (3 x 35 Menit)',
    jumlahPertemuan: 1,
    penyusun: 'Ust. Ahmad Fauzan, S.Pd.I',
    nipPenyusun: '19900820 201903 1 008',
    instansi: 'SD Negeri Nusantara 01',
    tahunPenyusunan: '2025/2026',
    elemenCP: 'Akidah',
    capaianPembelajaran: 'Peserta didik memahami sifat-sifat Allah Swt., beberapa asmaulhusna (Al-Malik, Al-Quddus, As-Salam, Al-Mu\'min, Al-Aziz), dan mengenal kitab-kitab Allah Swt.; serta mampu meneladani asmaulhusna dalam perbuatan nyata.',
    tujuanPembelajaran: [
      'Menyebutkan arti dan makna 5 Asmaul Husna: Al-Malik, Al-Quddus, As-Salam, Al-Mu\'min, Al-Aziz dengan fasih dan benar.',
      'Meneladani nilai-nilai mulia Asmaul Husna dalam perilaku disiplin, menjaga kebersihan diri, dan menciptakan rasa aman bagi sesama.',
      'Membuat kaligrafi sederhana salah satu Asmaul Husna dengan rapi dan indah.'
    ],
    alurTujuanPembelajaran: 'ATP PAI-BP Fase B: 4.1 Mengenal makna Asmaul Husna -> 4.2 Meneladani akhlak Asmaul Husna -> 4.3 Membuat kreasi seni kaligrafi Asmaul Husna.',
    profilPelajarPancasila: ['Beriman, Bertakwa kepada Tuhan YME dan Berakhlak Mulia', 'Mandiri', 'Kreatif'],
    saranaPrasarana: {
      media: 'Audio murottal Asmaul Husna, Kartu Pasangan Nama & Arti, Contoh Kaligrafi.',
      alatDanBahan: 'Kertas gambar, pensil warna/krayon, spidol hitam.',
      sumberBelajar: 'Buku Siswa PAI & BP Kelas 4 Kemendikbudristek 2022.',
      lingkunganBelajar: 'Ruang Kelas / Mushola Sekolah'
    },
    targetPesertaDidik: 'Peserta didik beragama Islam kelas 4 (24 siswa).',
    modelPembelajaran: 'Make a Match (Mencari Pasangan Kartu) & Project Kaligrafi',
    metodePembelajaran: ['Tanya Jawab', 'Make a Match', 'Praktik Kaligrafi'],
    pemahamanBermakna: 'Mengenal nama-nama indah Allah membuat hati kita semakin cinta kepada Allah dan terdorong menjadi pribadi yang menjaga kebersihan (Al-Quddus) dan pembawa kedamaian (As-Salam).',
    pertanyaanPemantik: [
      'Tahukah kamu apa artinya jika Allah itu Maha Merajai (Al-Malik) dan Maha Suci (Al-Quddus)?',
      'Bagaimana cara kita meneladani sifat As-Salam (Maha Pemberi Keselamatan) saat bermain dengan teman?'
    ],
    kegiatanPembelajaran: {
      pendahuluan: [{ sintaks: 'Tadarus & Salam', menit: 10, deskripsi: 'Melafalkan bersama 5 Asmaul Husna dengan irama merdu.' }],
      inti: [
        { sintaks: 'Game Make a Match', menit: 30, deskripsi: 'Siswa saling mencari teman yang memegang kartu arti dari nama Asmaul Husna yang dipegangnya.' },
        { sintaks: 'Kreasi Kaligrafi', menit: 30, deskripsi: 'Siswa mewarnai dan menghias kaligrafi Asmaul Husna pilihan.' }
      ],
      penutup: [{ sintaks: 'Doa & Peneguhan', menit: 15, deskripsi: 'Menyimpulkan hikmah meneladani Asmaul Husna dalam menjaga ketertiban kelas.' }]
    },
    asesmen: {
      diagnostik: 'Tes lisan menyebutkan arti Asmaul Husna yang diketahui.',
      formatif: 'Kesesuaian pasangan kartu Make a Match dan kerapian kaligrafi.',
      sumatif: 'Tes tertulis 5 soal menjodohkan dan 2 soal uraian.',
      rubrikPenilaian: 'Rubrik Hafalan Arti Asmaul Husna, Rubrik Kerapian Karya Kaligrafi.',
      teknikPenilaian: ['Tes Lisan', 'Tes Tertulis', 'Unjuk Kerja Produk'],
      instrumenPenilaian: ['Kartu Pasangan', 'Lembar Soal PAI']
    },
    remedialDanPengayaan: {
      remedial: 'Mengulang hafalan 5 nama dan arti Asmaul Husna dengan bantuan lagu ceria.',
      pengayaan: 'Mencari kisah teladan nabi yang mencerminkan sifat Al-Aziz (Maha Perkasa/Mulia).'
    },
    refleksi: {
      guru: ['Apakah seluruh siswa antusias saat permainan kartu Make a Match?'],
      siswa: ['Sifat Asmaul Husna mana yang ingin paling aku tiru dalam perilakuku?']
    },
    lampiran: {
      lkpdJudul: 'LKPD PAI: Pasangkan Nama Asmaul Husna dan Maknanya',
      lkpdDeskripsi: 'Latihan menghubungkan nama Asmaul Husna dengan arti dan contoh perbuatannya.',
      lkpdPetunjuk: ['Jodohkan kolom kiri dan kanan secara tepat!'],
      lkpdTugas: [
        { soal: 'Al-Quddus artinya ... dan contoh perilakunya adalah ...', tipe: 'esai', kunciJawaban: 'Maha Suci, contohnya menjaga kebersihan badan, pakaian, tempat ibadah, serta menjaga lisan dari perkataan kotor.' }
      ],
      bahanBacaanGuruDanSiswa: 'Buku Siswa PAI & BP Kelas 4 Kemendikbudristek 2022.',
      glosarium: [
        { istilah: 'Asmaul Husna', arti: 'Nama-nama Allah yang terbaik, terindah, dan paling agung.' }
      ],
      daftarPustaka: ['Ahmad Faozan, dkk. (2022). Pendidikan Agama Islam dan Budi Pekerti untuk SD Kelas IV. Jakarta: Kemendikbudristek.']
    },
    kategori: 'Modul Pokok',
    tags: ['PAI', 'Fase B', 'Kelas 4', 'Asmaul Husna', 'Akidah'],
    createdAt: '2025-08-02',
    updatedAt: '2025-08-15',
    isFavorite: false
  },
  {
    id: 'ma-ipas-4-02',
    kodeModul: 'MA-IPAS-4-02',
    judul: 'Wujud Zat dan Perubahannya (Mencair, Membeku, Menguap, Mengembun, Menyublim)',
    mataPelajaran: 'Ilmu Pengetahuan Alam & Sosial (IPAS)',
    mapelKode: 'IPAS',
    fase: 'Fase B',
    kelas: '4',
    semester: '1 (Ganjil)',
    alokasiWaktu: '3 JP (3 x 35 Menit)',
    jumlahPertemuan: 1,
    penyusun: 'Sri Wahyuni, S.Pd., Gr.',
    nipPenyusun: '19880412 201201 2 018',
    instansi: 'SD Negeri Nusantara 01',
    tahunPenyusunan: '2025/2026',
    elemenCP: 'Pemahaman IPAS (Sains dan Sosial)',
    capaianPembelajaran: 'Peserta didik mengidentifikasi proses perubahan wujud zat dan perubahan bentuk energi dalam kehidupan sehari-hari; memanfaatkan energi dalam kehidupan sehari-hari.',
    tujuanPembelajaran: [
      'Mengenali karakteristik wujud zat (padat, cair, dan gas) berdasarkan bentuk, volume, dan susunan partikelnya.',
      'Menganalisis 6 jenis perubahan wujud benda (mencair, membeku, menguap, mengembun, menyublim, mengkristal) akibat pelepasan atau penyerapan kalor/panas.',
      'Melakukan percobaan membuktikan proses mencairnya es batu dan menyublimnya kapur barus.'
    ],
    alurTujuanPembelajaran: 'ATP IPAS Fase B: 4.4 Karakteristik zat padat, cair, gas -> 4.5 Eksperimen perubahan wujud zat -> 4.6 Pemanfaatan perubahan wujud zat di kehidupan manusia.',
    profilPelajarPancasila: ['Bernalar Kritis', 'Gotong Royong', 'Kreatif'],
    saranaPrasarana: {
      media: 'Bagan Perubahan Wujud Zat, Video Simulasi Partikel Zat, Pembakar Spiritus / Lilin Aman.',
      alatDanBahan: 'Es batu, lilin, korek api, sendok logam, kapur barus (kamper), kaleng bekas, es batu di atas kaleng.',
      sumberBelajar: 'Buku Siswa IPAS Kelas 4 Kurikulum Merdeka Kemendikbud 2022.',
      lingkunganBelajar: 'Laboratorium Mini / Meja Percobaan Kelas'
    },
    targetPesertaDidik: 'Peserta didik reguler (28 siswa).',
    modelPembelajaran: 'Inquiry-Based Learning Terbimbing',
    metodePembelajaran: ['Demonstrasi Guru Terbimbing', 'Eksperimen Kelompok', 'Diskusi Analisis Data'],
    pemahamanBermakna: 'Perubahan wujud zat terjadi di sekitar kita setiap hari: saat es krim mencair, air mendidih, embun pagi terbentuk, dan pembuatan garam laut.',
    pertanyaanPemantik: [
      'Mengapa es batu yang ditaruh di mangkok terbuka lama-kelamaan menjadi air dan ukurannya mengecil?',
      'Dari manakah asal titik-titik air di bagian luar gelas yang berisi air es dingin?'
    ],
    kegiatanPembelajaran: {
      pendahuluan: [{ sintaks: 'Apersepsi Es Krim', menit: 10, deskripsi: 'Guru menceritakan es krim yang dibeli lalu mencair di bawah terik matahari.' }],
      inti: [
        { sintaks: 'Percobaan 1: Mencair & Membeku', menit: 25, deskripsi: 'Siswa mengamati lilin yang dipanaskan di sendok lalu didiamkan hingga padat kembali.' },
        { sintaks: 'Percobaan 2: Menyublim Kapur Barus', menit: 25, deskripsi: 'Guru mendemonstrasikan kapur barus dalam kaleng yang dipanaskan di bawah es batu.' }
      ],
      penutup: [{ sintaks: 'Simpulan Segitiga Perubahan Wujud', menit: 15, deskripsi: 'Menyusun bagan segitiga perubahan wujud zat bersama di papan tulis.' }]
    },
    asesmen: {
      diagnostik: 'Tebak benda padat, cair, dan gas dari benda-benda di kelas.',
      formatif: 'Laporan pengamatan eksperimen perubahan wujud zat di LKPD.',
      sumatif: 'Tes tertulis 10 butir soal pilihan ganda dan analisis diagram wujud zat.',
      rubrikPenilaian: 'Rubrik Keterampilan Praktikum Sains, Rubrik Analisis Data.',
      teknikPenilaian: ['Praktik Eksperimen', 'Tes Tertulis'],
      instrumenPenilaian: ['Lembar Pengamatan', 'Soal Evaluasi Bab 2']
    },
    remedialDanPengayaan: {
      remedial: 'Mengelompokkan contoh peristiwa sehari-hari ke dalam jenis perubahan wujud zat dengan bantuan kartu gambar.',
      pengayaan: 'Meneliti bagaimana proses pembuatan dry ice (karbon dioksida padat) dan siklus air hujan di atmosfer.'
    },
    refleksi: {
      guru: ['Apakah prosedur keselamatan eksperimen dengan lilin terlaksana secara aman dan tertib?'],
      siswa: ['Peristiwa perubahan wujud apa yang sering kamu temui di dapur rumahmu?']
    },
    lampiran: {
      lkpdJudul: 'LKPD IPAS: Menyelidiki Perubahan Wujud Benda Disekitar Kita',
      lkpdDeskripsi: 'Panduan praktikum mencair, membeku, dan menyublim.',
      lkpdPetunjuk: ['Catat perubahan yang terjadi pada setiap menit pengamatan!'],
      lkpdTugas: [
        { soal: 'Jelaskan perbedaan antara proses mencair dan menyublim!', tipe: 'esai', kunciJawaban: 'Mencair adalah perubahan wujud dari padat menjadi cair (memerlukan panas), sedangkan menyublim adalah perubahan wujud dari padat langsung menjadi gas tanpa melewati fase cair (memerlukan panas).' }
      ],
      bahanBacaanGuruDanSiswa: 'Buku IPAS Kelas IV Bab 2 "Wujud Zat dan Perubahannya".',
      glosarium: [
        { istilah: 'Menyublim', arti: 'Perubahan wujud benda dari padat menjadi gas.' },
        { istilah: 'Mengembun', arti: 'Perubahan wujud benda dari gas menjadi cair.' },
        { istilah: 'Mengkristal', arti: 'Perubahan wujud benda dari gas menjadi padat.' }
      ],
      daftarPustaka: ['Fitri, Amalia, dkk. (2022). IPAS untuk SD Kelas IV. Kemendikbudristek.']
    },
    kategori: 'Modul Pokok',
    tags: ['IPAS', 'Fase B', 'Kelas 4', 'Wujud Zat', 'Sains SD'],
    createdAt: '2025-08-05',
    updatedAt: '2025-08-16',
    isFavorite: false
  },
  {
    id: 'ma-p5-4-01',
    kodeModul: 'MA-P5-4-01',
    judul: 'Proyek P5: Sampah Plastik Jadi Berkah (Kreasi Ecobrick & Kompos)',
    mataPelajaran: 'Projek Penguatan Profil Pelajar Pancasila (P5)',
    mapelKode: 'P5',
    fase: 'Fase B',
    kelas: '4',
    semester: '1 (Ganjil)',
    alokasiWaktu: '6 JP (Terbagi dalam 3 Pekan Aksi)',
    jumlahPertemuan: 3,
    penyusun: 'Tim Fasilitator P5 Kelas 4 SDN Nusantara 01',
    nipPenyusun: '19880412 201201 2 018',
    instansi: 'SD Negeri Nusantara 01',
    tahunPenyusunan: '2025/2026',
    elemenCP: 'Tema: Gaya Hidup Berkelanjutan',
    capaianPembelajaran: 'Peserta didik memahami dampak aktivitas manusia terhadap lingkungan hidup serta merancang dan mempraktikkan aksi nyata pengelolaan sampah anorganik dan organik di lingkungan sekolah.',
    tujuanPembelajaran: [
      'Mengidentifikasi jenis-jenis sampah (organik, anorganik, B3) yang dihasilkan dari kantin dan ruang kelas.',
      'Membuat produk inovatif ramah lingkungan berupa bangku mini dari botol plastik ecobrick.',
      'Mengkampanyekan gerakan "Bawa Botol Minum (Tumbler) & Wadah Sendiri" di lingkungan sekolah.'
    ],
    alurTujuanPembelajaran: 'Tahap Pengenalan (Eksplorasi Isu) -> Tahap Kontekstualisasi (Audit Sampah) -> Tahap Aksi (Pembuatan Ecobrick) -> Tahap Refleksi & Pameran Karya (Gelar Karya P5).',
    profilPelajarPancasila: [
      'Beriman, Bertakwa kepada Tuhan YME dan Berakhlak Mulia (Menjaga alam lingkungan)',
      'Gotong Royong (Bekerja sama memadatkan plastik ke dalam botol ecobrick)',
      'Kreatif (Menghasilkan karya fungsional bernilai estetika)'
    ],
    saranaPrasarana: {
      media: 'Video Dokumenter Bahaya Sampah Plastik di Lautan, Timbangan Gantung, Poster Pemilahan Sampah.',
      alatDanBahan: 'Botol plastik bekas 600ml yang bersih dan kering, sampah plastik kemasan makanan ringan yang dipotong kecil-kecil, tongkat kayu pemadat, lem tembak / lakban tebal.',
      sumberBelajar: 'Panduan Pengembangan Projek Penguatan Profil Pelajar Pancasila BSKAP Kemendikbudristek 2024.',
      lingkunganBelajar: 'Halaman Sekolah & Ruang Serbaguna'
    },
    targetPesertaDidik: 'Seluruh peserta didik rombel kelas 4 (28 siswa).',
    modelPembelajaran: 'Project-Based Learning Berbasis Aksi Komunitas Nyata',
    metodePembelajaran: ['Audit Sampah Nyata', 'Aksi Pemadatan Ecobrick', 'Kampanye Poster', 'Gelar Karya Festival'],
    pemahamanBermakna: 'Bumi hanya ada satu. Sampah plastik membutuhkan ratusan tahun untuk terurai. Mengolah sampah plastik menjadi ecobrick adalah langkah nyata kecil kita untuk menyelamatkan bumi.',
    pertanyaanPemantik: [
      'Berapa banyak sampah plastik yang kamu buang setiap hari setelah jajan di kantin?',
      'Bisakah sampah botol plastik bekas diubah menjadi meja dan kursi yang kuat untuk kita duduki?'
    ],
    kegiatanPembelajaran: {
      pendahuluan: [{ sintaks: 'Sosialisasi & Nonton Video', menit: 20, deskripsi: 'Menyaksikan dampak sampah plastik terhadap satwa penyu laut dan ekosistem.' }],
      inti: [
        { sintaks: 'Aksi Audit Sampah', menit: 40, deskripsi: 'Siswa memilah sampah anorganik di kelas dan mencuci bersih plastik bekas jajanan.' },
        { sintaks: 'Produksi Ecobrick', menit: 80, deskripsi: 'Siswa memasukkan dan memadatkan potongan plastik ke dalam botol hingga beratnya mencapai standar minimal 200 gram per botol.' }
      ],
      penutup: [{ sintaks: 'Gelar Karya Sederhana', menit: 30, deskripsi: 'Merakit 7 botol ecobrick menjadi modul bangku mini hexagonal dan menampilkannya di lorong kelas.' }]
    },
    asesmen: {
      diagnostik: 'Kuesioner kebiasaan membuang sampah di rumah dan sekolah.',
      formatif: 'Lembar observasi dimensi Gotong Royong dan Kreativitas selama pembuatan ecobrick.',
      sumatif: 'Penilaian produk akhir (kepadatan botol ecobrick, kerapian, kekokohan bangku).',
      rubrikPenilaian: 'Rubrik Penilaian Dimensi Profil Pelajar Pancasila (Mulai Berkembang, Sedang Berkembang, Berkembang Sesuai Harapan, Sangat Berkembang).',
      teknikPenilaian: ['Penilaian Produk', 'Observasi Sikap P5', 'Penilaian Diri (Self Assessment)'],
      instrumenPenilaian: ['Rubrik P5 BSKAP', 'Lembar Refleksi Siswa']
    },
    remedialDanPengayaan: {
      remedial: 'Mendapat bimbingan teknik memadatkan plastik menggunakan stik kayu agar botol tidak mudah kempes saat diduduki.',
      pengayaan: 'Menjadi duta cilik lingkungan yang memimpin kampanye pemilahan sampah di upacara bendera hari Senin.'
    },
    refleksi: {
      guru: ['Bagaimana dampak proyek ini terhadap kebersihan ruang kelas dalam 2 minggu terakhir?'],
      siswa: ['Apa komitmen nyataku untuk mengurangi jajan makanan berkemasan plastik sekali pakai?']
    },
    lampiran: {
      lkpdJudul: 'Lembar Jurnal Refleksi Proyek P5: Sahabat Bumi',
      lkpdDeskripsi: 'Jurnal harian pencatatan jumlah sampah plastik yang berhasil diselamatkan menjadi ecobrick.',
      lkpdPetunjuk: ['Timbang botol ecobrick yang telah selesai dan catat beratnya pada tabel!'],
      lkpdTugas: [
        { soal: 'Tuliskan 3 manfaat pembuatan ecobrick bagi lingkungan sekolah!', tipe: 'esai', kunciJawaban: '1. Mengurangi volume sampah plastik yang masuk ke TPA, 2. Menciptakan barang daur ulang yang bermanfaat seperti bangku/meja, 3. Menumbuhkan kesadaran peduli lingkungan sejak dini.' }
      ],
      bahanBacaanGuruDanSiswa: 'Panduan Ecobrick Global (Global Ecobrick Alliance).',
      glosarium: [
        { istilah: 'Ecobrick', arti: 'Botol plastik yang diisi padat dengan sampah plastik bersih dan kering hingga menjadi balok bangunan ramah lingkungan.' },
        { istilah: 'Sampah Anorganik', arti: 'Sampah yang tidak mudah membusuk dan sulit terurai secara alami oleh tanah.' }
      ],
      daftarPustaka: ['Kemendikbudristek. (2024). Panduan Projek Penguatan Profil Pelajar Pancasila SD/MI. BSKAP.']
    },
    kategori: 'Modul P5',
    tags: ['P5', 'Fase B', 'Gaya Hidup Berkelanjutan', 'Ecobrick', 'Lingkungan Hidup'],
    createdAt: '2025-08-10',
    updatedAt: '2025-08-18',
    isFavorite: true
  }
];
