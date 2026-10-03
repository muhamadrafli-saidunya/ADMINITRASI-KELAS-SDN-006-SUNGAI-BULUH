import { AgamaType, TujuanPembelajaran, Subject } from '../types';

export const AGAMA_LIST: AgamaType[] = [
  'Islam',
  'Kristen',
  'Katolik',
  'Hindu',
  'Buddha',
  'Konghucu'
];

export const AGAMA_DETAILS: Record<
  AgamaType,
  {
    namaLengkap: string;
    kode: string;
    sebutanIbadah: string;
    warnaBadge: string;
    badgeBg: string;
    badgeText: string;
    badgeBorder: string;
  }
> = {
  Islam: {
    namaLengkap: 'Pendidikan Agama Islam & Budi Pekerti',
    kode: 'PAI',
    sebutanIbadah: 'Shalat dan Membaca Al-Qur’an',
    warnaBadge: 'emerald',
    badgeBg: 'bg-emerald-50 dark:bg-emerald-950/40',
    badgeText: 'text-emerald-700 dark:text-emerald-300',
    badgeBorder: 'border-emerald-200 dark:border-emerald-800'
  },
  Kristen: {
    namaLengkap: 'Pendidikan Agama Kristen & Budi Pekerti',
    kode: 'PAK',
    sebutanIbadah: 'Ibadah Kebaktian dan Alkitab',
    warnaBadge: 'blue',
    badgeBg: 'bg-blue-50 dark:bg-blue-950/40',
    badgeText: 'text-blue-700 dark:text-blue-300',
    badgeBorder: 'border-blue-200 dark:border-blue-800'
  },
  Katolik: {
    namaLengkap: 'Pendidikan Agama Katolik & Budi Pekerti',
    kode: 'PAKat',
    sebutanIbadah: 'Ekaristi dan Doa Rosario',
    warnaBadge: 'indigo',
    badgeBg: 'bg-indigo-50 dark:bg-indigo-950/40',
    badgeText: 'text-indigo-700 dark:text-indigo-300',
    badgeBorder: 'border-indigo-200 dark:border-indigo-800'
  },
  Hindu: {
    namaLengkap: 'Pendidikan Agama Hindu & Budi Pekerti',
    kode: 'PAH',
    sebutanIbadah: 'Sembahyang Tri Sandhya & Dainika Upasana',
    warnaBadge: 'amber',
    badgeBg: 'bg-amber-50 dark:bg-amber-950/40',
    badgeText: 'text-amber-700 dark:text-amber-300',
    badgeBorder: 'border-amber-200 dark:border-amber-800'
  },
  Buddha: {
    namaLengkap: 'Pendidikan Agama Buddha & Budi Pekerti',
    kode: 'PAB',
    sebutanIbadah: 'Puja Bakti dan Meditasi Bhavana',
    warnaBadge: 'orange',
    badgeBg: 'bg-orange-50 dark:bg-orange-950/40',
    badgeText: 'text-orange-700 dark:text-orange-300',
    badgeBorder: 'border-orange-200 dark:border-orange-800'
  },
  Konghucu: {
    namaLengkap: 'Pendidikan Agama Khonghucu & Budi Pekerti',
    kode: 'PAKho',
    sebutanIbadah: 'Kebaktian dan Laku Bakti (Xiao)',
    warnaBadge: 'rose',
    badgeBg: 'bg-rose-50 dark:bg-rose-950/40',
    badgeText: 'text-rose-700 dark:text-rose-300',
    badgeBorder: 'border-rose-200 dark:border-rose-800'
  }
};

/**
 * Checks whether a subject is a Religion & Character Education subject
 */
export function isAgamaSubject(
  subject?: { id?: string; kode?: string; nama?: string } | null
): boolean {
  if (!subject) return false;
  const kode = (subject.kode || '').toUpperCase();
  const nama = (subject.nama || '').toLowerCase();
  const id = (subject.id || '').toLowerCase();

  return (
    id === 'mapel-05' ||
    id.includes('pai') ||
    id.includes('agama') ||
    ['PAI', 'PAK', 'PAKAT', 'PAH', 'PAB', 'PAKHO', 'AGM'].includes(kode) ||
    nama.includes('agama') ||
    nama.includes('budi pekerti')
  );
}

/**
 * Returns customized subject name based on student religion
 */
export function getReligionSubjectName(
  studentAgama?: string,
  defaultName = 'Pendidikan Agama & Budi Pekerti'
): string {
  if (!studentAgama) return defaultName;
  const normalized = studentAgama.trim();
  const detail = AGAMA_DETAILS[normalized as AgamaType];
  return detail ? detail.namaLengkap : defaultName;
}

/**
 * Returns customized subject code based on student religion
 */
export function getReligionSubjectCode(studentAgama?: string, defaultCode = 'PAI'): string {
  if (!studentAgama) return defaultCode;
  const normalized = studentAgama.trim();
  const detail = AGAMA_DETAILS[normalized as AgamaType];
  return detail ? detail.kode : defaultCode;
}

/**
 * Comprehensive Kurikulum Merdeka standard TPs for all 6 religions
 */
export const STANDARD_AGAMA_TPS_BY_RELIGION: Record<
  AgamaType,
  Array<{
    kode: string;
    lingkupMateri: string;
    deskripsi: string;
    semester: '1 (Ganjil)' | '2 (Genap)' | 'Semua';
    kktp: number;
    ringkasanRaporTuntas: string;
    ringkasanRaporPerluBimbingan: string;
  }>
> = {
  Islam: [
    {
      kode: 'TP 1',
      lingkupMateri: 'Bab 1: Al-Qur’an Surat Al-Hujurat: 13 & Keragaman',
      deskripsi:
        'Membaca, menghafal, dan memahami pesan pokok Q.S. Al-Hujurat: 13 tentang keragaman manusia sebagai sunnatullah untuk saling mengenal.',
      semester: '1 (Ganjil)',
      kktp: 78,
      ringkasanRaporTuntas:
        'Fasih membaca Al-Qur’an dengan tajwid yang baik dan memahami pesan keragaman sebagai ketetapan Allah',
      ringkasanRaporPerluBimbingan:
        'Perlu pembiasaan makhraj huruf dan kelancaran membaca Al-Qur’an secara tertib'
    },
    {
      kode: 'TP 2',
      lingkupMateri: 'Bab 2: Asmaul Husna (Al-Malik, Al-Quddus, As-Salam)',
      deskripsi:
        'Meneladani sifat-sifat mulia Allah Swt dalam Asmaul Husna (Al-Malik, Al-Quddus, As-Salam, Al-Mu’min, Al-Aziz) dalam kehidupan sehari-hari.',
      semester: '1 (Ganjil)',
      kktp: 78,
      ringkasanRaporTuntas:
        'Mampu meneladani Asmaul Husna dalam menjaga kebersihan hati, kejujuran, dan kesantunan',
      ringkasanRaporPerluBimbingan:
        'Perlu dorongan dalam mengamalkan perilaku rendah hati dan ikhlas dalam pergaulan'
    },
    {
      kode: 'TP 3',
      lingkupMateri: 'Bab 3: Indahnya Saling Menghargai & Toleransi',
      deskripsi:
        'Menjelaskan arti keragaman suku dan agama serta menerapkan sikap toleransi, persaudaraan, dan saling menghormati antarsesama.',
      semester: '1 (Ganjil)',
      kktp: 78,
      ringkasanRaporTuntas:
        'Konsisten menunjukkan sikap toleransi, ramah, dan saling menghargai perbedaan antarteman',
      ringkasanRaporPerluBimbingan:
        'Perlu pembiasaan sikap saling menghargai perbedaan pendapat dan latar belakang'
    },
    {
      kode: 'TP 4',
      lingkupMateri: 'Bab 4: Ketentuan dan Tata Cara Shalat Berjamaah',
      deskripsi:
        'Mempraktikkan ketentuan shalat berjamaah, posisi imam dan makmum, adab di masjid, serta zikir doa sesudah shalat.',
      semester: '1 (Ganjil)',
      kktp: 78,
      ringkasanRaporTuntas:
        'Tertib mempraktikkan tata cara shalat berjamaah dengan khusyuk dan tertib di masjid',
      ringkasanRaporPerluBimbingan:
        'Perlu bimbingan dalam bacaan doa dan ketertiban gerakan shalat fardhu'
    },
    {
      kode: 'TP 5',
      lingkupMateri: 'Bab 5: Kisah Hijrah Nabi Muhammad saw ke Madinah',
      deskripsi:
        'Meneladani kisah perjuangan hijrah Rasulullah saw ke Madinah, persaudaraan kaum Muhajirin dan Anshar, serta Piagam Madinah.',
      semester: '2 (Genap)',
      kktp: 78,
      ringkasanRaporTuntas:
        'Mampu meneladani keteguhan iman, kesabaran, dan semangat persaudaraan dari kisah hijrah Nabi',
      ringkasanRaporPerluBimbingan:
        'Perlu memperdalam kronologi dan hikmah perjuangan Nabi Muhammad saw'
    },
    {
      kode: 'TP 6',
      lingkupMateri: 'Bab 6: Zakat Fitrah, Infak, dan Sedekah',
      deskripsi:
        'Memahami ketentuan zakat fitrah, infak, dan sedekah serta mempraktikkannya sebagai wujud kepedulian sosial.',
      semester: '2 (Genap)',
      kktp: 78,
      ringkasanRaporTuntas:
        'Memahami ketentuan zakat fitrah dan gemar berbagi infak sedekah untuk sesama',
      ringkasanRaporPerluBimbingan:
        'Perlu penguatan pemahaman ketentuan mustahik dan perhitungan zakat'
    }
  ],

  Kristen: [
    {
      kode: 'TP 1',
      lingkupMateri: 'Bab 1: Mensyukuri Kebaikan Allah dalam Ciptaan',
      deskripsi:
        'Mensyukuri kemurahan dan kebaikan Allah melalui alam ciptaan-Nya serta keberagaman sesama manusia sebagai wujud kasih-Nya.',
      semester: '1 (Ganjil)',
      kktp: 78,
      ringkasanRaporTuntas:
        'Mampu mensyukuri kebaikan Allah atas alam ciptaan-Nya dan mengasihi sesama tanpa membeda-bedakan',
      ringkasanRaporPerluBimbingan:
        'Perlu bimbingan dalam merawat lingkungan sebagai ungkapan syukur atas ciptaan Tuhan'
    },
    {
      kode: 'TP 2',
      lingkupMateri: 'Bab 2: Meneladani Kasih dan Pengampunan Kristus',
      deskripsi:
        'Meneladani keteladanan Yesus Kristus dalam mengasihi, mengampuni kesalahan sesama, dan bersikap rendah hati dalam pergaulan.',
      semester: '1 (Ganjil)',
      kktp: 78,
      ringkasanRaporTuntas:
        'Meneladani kasih Kristus dengan berlapang dada memaafkan dan suka menolong teman',
      ringkasanRaporPerluBimbingan:
        'Perlu pembiasaan untuk bersabar dan tulus memaafkan saat terjadi perselisihan antarteman'
    },
    {
      kode: 'TP 3',
      lingkupMateri: 'Bab 3: Hidup Rukun dan Toleran di Tengah Perbedaan',
      deskripsi:
        'Mempraktikkan hidup rukun, bersikap toleran terhadap teman yang berbeda agama/budaya, dan menciptakan suasana damai sejahtera.',
      semester: '1 (Ganjil)',
      kktp: 78,
      ringkasanRaporTuntas:
        'Aktif mempraktikkan hidup rukun dan menghargai keragaman teman di sekolah dan rumah',
      ringkasanRaporPerluBimbingan:
        'Perlu pembiasaan untuk lebih aktif bergaul dan berempati dengan teman yang berbeda latar belakang'
    },
    {
      kode: 'TP 4',
      lingkupMateri: 'Bab 4: Kedisiplinan Berdoa dan Membaca Alkitab',
      deskripsi:
        'Memahami makna ibadah, membiasakan doa harian, membaca Kitab Suci Alkitab, serta mengekspresikan syukur dalam kehidupan beriman.',
      semester: '1 (Ganjil)',
      kktp: 78,
      ringkasanRaporTuntas:
        'Tertib dan khidmat dalam berdoa harian serta gemar membaca renungan Alkitab',
      ringkasanRaporPerluBimbingan:
        'Perlu dorongan untuk lebih disiplin dalam meluangkan waktu berdoa dan membaca firman Tuhan'
    },
    {
      kode: 'TP 5',
      lingkupMateri: 'Bab 5: Pemeliharaan Allah bagi Keluarga dan Sekolah',
      deskripsi:
        'Memahami karya pemeliharaan Allah dalam kehidupan keluarga dan sekolah, serta menghormati orang tua dan bapak/ibu guru.',
      semester: '2 (Genap)',
      kktp: 78,
      ringkasanRaporTuntas:
        'Sangat santun menghormati orang tua dan guru sebagai wakil Allah di bumi',
      ringkasanRaporPerluBimbingan:
        'Perlu pembiasaan sikap patuh dan mendengarkan nasihat orang tua dengan tekun'
    },
    {
      kode: 'TP 6',
      lingkupMateri: 'Bab 6: Buah-Buah Roh dalam Kehidupan Sehari-hari',
      deskripsi:
        'Menerapkan buah-buah Roh (kasih, sukacita, damai sejahtera, kesabaran, kemurahan, kebaikan, kesetiaan, kelemahlembutan, penguasaan diri).',
      semester: '2 (Genap)',
      kktp: 78,
      ringkasanRaporTuntas:
        'Konsisten memancarkan karakter buah Roh dalam interaksi belajar dan bermain',
      ringkasanRaporPerluBimbingan:
        'Perlu bimbingan dalam penguasaan diri dan mengendalikan emosi saat bermain'
    }
  ],

  Katolik: [
    {
      kode: 'TP 1',
      lingkupMateri: 'Bab 1: Aku Pribadi Unik Citra Allah (Imago Dei)',
      deskripsi:
        'Mengagumi dan mensyukuri diri sebagai pribadi yang unik yang diciptakan Allah menurut citra-Nya (Imago Dei) dengan talenta istimewa.',
      semester: '1 (Ganjil)',
      kktp: 78,
      ringkasanRaporTuntas:
        'Percaya diri mensyukuri keunikan dirinya dan menghargai talenta anugerah Allah pada sesama',
      ringkasanRaporPerluBimbingan:
        'Perlu dorongan untuk lebih percaya diri dalam mengekspresikan potensi dan bakat diri'
    },
    {
      kode: 'TP 2',
      lingkupMateri: 'Bab 2: Meneladani Yesus Mewartakan Kerajaan Allah',
      deskripsi:
        'Meneladani pribadi Yesus Kristus yang mewartakan Kerajaan Allah melalui perbuatan kasih, belas kasih kepada kaum lemah, dan kejujuran.',
      semester: '1 (Ganjil)',
      kktp: 78,
      ringkasanRaporTuntas:
        'Meneladani belas kasih Yesus dengan peduli dan menolong teman yang kesulitan',
      ringkasanRaporPerluBimbingan:
        'Perlu pendampingan dalam menumbuhkan empati dan kepekaan sosial terhadap teman sebaya'
    },
    {
      kode: 'TP 3',
      lingkupMateri: 'Bab 3: Membangun Persaudaraan Sejati di Tengah Keragaman',
      deskripsi:
        'Mengembangkan sikap hormat terhadap keragaman agama, suku, dan budaya serta aktif mewujudkan persaudaraan sejati yang harmonis.',
      semester: '1 (Ganjil)',
      kktp: 78,
      ringkasanRaporTuntas:
        'Sangat ramah dan aktif membangun persaudaraan sejati tanpa membedakan suku dan agama',
      ringkasanRaporPerluBimbingan:
        'Perlu pembiasaan sikap terbuka dan menghargai keragaman tradisi teman'
    },
    {
      kode: 'TP 4',
      lingkupMateri: 'Bab 4: Sakramen Gereja dan Kehidupan Doa Katolik',
      deskripsi:
        'Mengenal sakramen-sakramen inisiasi Gereja Katolik, tata perayaan Ekaristi, dan tekun dalam doa harian bersama keluarga.',
      semester: '1 (Ganjil)',
      kktp: 78,
      ringkasanRaporTuntas:
        'Memahami makna sakramen Gereja dan tertib mengikuti perayaan Ekaristi dengan khidmat',
      ringkasanRaporPerluBimbingan:
        'Perlu bimbingan dalam menghafal doa-doa pokok Katolik dan tata gerak liturgi'
    },
    {
      kode: 'TP 5',
      lingkupMateri: 'Bab 5: Keteladanan Bunda Maria dan Orang Kudus',
      deskripsi:
        'Meneladani keteladanan Bunda Maria dan para kudus dalam kesetiaan, kerendahan hati, dan ketaatan menjalankan kehendak Allah.',
      semester: '2 (Genap)',
      kktp: 78,
      ringkasanRaporTuntas:
        'Meneladani kerendahan hati Bunda Maria dalam ketaatan dan kesetiaan iman',
      ringkasanRaporPerluBimbingan:
        'Perlu memperdalam kisah hidup orang kudus pelindung dan keteladanan imannya'
    },
    {
      kode: 'TP 6',
      lingkupMateri: 'Bab 6: Karya Pelayanan Kasih dalam Komunitas',
      deskripsi:
        'Berpartisipasi dalam karya pelayanan Gereja dan masyarakat dengan tindakan konkret peduli sesama dan pelestarian alam.',
      semester: '2 (Genap)',
      kktp: 78,
      ringkasanRaporTuntas:
        'Antusias berpartisipasi dalam karya amal kasih dan kepedulian lingkungan hidup',
      ringkasanRaporPerluBimbingan:
        'Perlu dorongan untuk berinisiatif membantu tugas-tugas bersama secara ikhlas'
    }
  ],

  Hindu: [
    {
      kode: 'TP 1',
      lingkupMateri: 'Bab 1: Panca Sradha sebagai Fondasi Keyakinan',
      deskripsi:
        'Memahami dan meyakini ajaran Panca Sradha (Brahman, Atman, Karmaphala, Samsara, Moksha) sebagai fondasi keimanan umat Hindu.',
      semester: '1 (Ganjil)',
      kktp: 78,
      ringkasanRaporTuntas:
        'Memahami ajaran Panca Sradha dan meyakini kemahakuasaan Hyang Widhi Wasa dengan tulus',
      ringkasanRaporPerluBimbingan:
        'Perlu penguatan pemahaman konsep lima keyakinan Panca Sradha secara runtut'
    },
    {
      kode: 'TP 2',
      lingkupMateri: 'Bab 2: Pengamalan Ajaran Tri Kaya Parisudha',
      deskripsi:
        'Menerapkan ajaran Tri Kaya Parisudha (Manacika/berpikir baik, Wacika/berkata baik, Kayika/berbuat baik) dalam kehidupan sehari-hari.',
      semester: '1 (Ganjil)',
      kktp: 78,
      ringkasanRaporTuntas:
        'Konsisten berucap santun, berpikir positif, dan berbuat baik sesuai Tri Kaya Parisudha',
      ringkasanRaporPerluBimbingan:
        'Perlu pembiasaan mengendalikan ucapan dan perilaku agar selaras dengan nilai kebajikan'
    },
    {
      kode: 'TP 3',
      lingkupMateri: 'Bab 3: Sembahyang Tri Sandhya dan Dainika Upasana',
      deskripsi:
        'Mempraktikkan tata cara sembahyang Tri Sandhya dengan sikap asana, pranayama, dan doa sehari-hari (Dainika Upasana) secara tertib.',
      semester: '1 (Ganjil)',
      kktp: 78,
      ringkasanRaporTuntas:
        'Tertib dan khusyuk mempraktikkan mantram Tri Sandhya serta doa sehari-hari',
      ringkasanRaporPerluBimbingan:
        'Perlu bimbingan dalam pengucapan lafal mantram Tri Sandhya yang benar'
    },
    {
      kode: 'TP 4',
      lingkupMateri: 'Bab 4: Nilai Dharma dan Ajaran Tat Twam Asi',
      deskripsi:
        'Meneladani nilai-nilai Dharma, mengamalkan ajaran Tat Twam Asi (ia adalah kamu), serta menjunjung tinggi toleransi kerukunan antarsesama.',
      semester: '1 (Ganjil)',
      kktp: 78,
      ringkasanRaporTuntas:
        'Mengamalkan nilai Tat Twam Asi dengan penuh rasa persaudaraan dan toleransi antarteman',
      ringkasanRaporPerluBimbingan:
        'Perlu pembiasaan empati untuk saling mengasihi sesama makhluk ciptaan Tuhan'
    },
    {
      kode: 'TP 5',
      lingkupMateri: 'Bab 5: Keteladanan Tokoh Cerita Ramayana dan Mahabharata',
      deskripsi:
        'Memetik keteladanan moral, kesetiaan, dan kejujuran dari para tokoh kebajikan dalam kisah epos Ramayana dan Mahabharata.',
      semester: '2 (Genap)',
      kktp: 78,
      ringkasanRaporTuntas:
        'Mampu meneladani sikap ksatria, kejujuran, dan kesetiaan tokoh Dharma dalam Ramayana',
      ringkasanRaporPerluBimbingan:
        'Perlu memperdalam pesan moral dari kisah-kisah epos keagamaan Hindu'
    },
    {
      kode: 'TP 6',
      lingkupMateri: 'Bab 6: Hari Suci Keagamaan Hindu dan Maknanya',
      deskripsi:
        'Mengenal makna perayaan hari suci Hindu (Galungan, Kuningan, Nyepi, Saraswati, Siwaratri) bagi keharmonisan alam dan manusia.',
      semester: '2 (Genap)',
      kktp: 78,
      ringkasanRaporTuntas:
        'Memahami makna kemenangan Dharma atas Adharma dalam hari suci keagamaan Hindu',
      ringkasanRaporPerluBimbingan:
        'Perlu penguatan pemahaman tata upakara dan filosofi hari raya suci keagamaan'
    }
  ],

  Buddha: [
    {
      kode: 'TP 1',
      lingkupMateri: 'Bab 1: Meneladani Sifat Luhur Tiratana (Tri Ratna)',
      deskripsi:
        'Memahami dan meneladani sifat-sifat luhur Buddha, Dhamma, dan Sangha (Tiratana) sebagai perlindungan utama dalam kehidupan.',
      semester: '1 (Ganjil)',
      kktp: 78,
      ringkasanRaporTuntas:
        'Menghayati sifat luhur Tiratana dan menunjukkan rasa hormat yang mendalam kepada Triratna',
      ringkasanRaporPerluBimbingan:
        'Perlu penguatan pemahaman akan makna perlindungan Tiratana dalam kehidupan sehari-hari'
    },
    {
      kode: 'TP 2',
      lingkupMateri: 'Bab 2: Pengamalan Pancasila Buddhis sebagai Moralitas',
      deskripsi:
        'Menerapkan lima sila dalam Pancasila Buddhis (tidak membunuh, tidak mencuri, tidak berbuat asusila, tidak berdusta, tidak mabuk) sebagai pedoman hidup.',
      semester: '1 (Ganjil)',
      kktp: 78,
      ringkasanRaporTuntas:
        'Mampu mempraktikkan Pancasila Buddhis dengan menjaga kejujuran dan welas asih antarmakhluk',
      ringkasanRaporPerluBimbingan:
        'Perlu pembiasaan disiplin moral dan kehati-hatian dalam bertutur kata jujur'
    },
    {
      kode: 'TP 3',
      lingkupMateri: 'Bab 3: Kebaktian Puja Bakti dan Meditasi Bhavana',
      deskripsi:
        'Mempraktikkan kebaktian Puja Bakti, membaca paritta/gatha dengan hormat, serta meditasi pernapasan (Anapanasati) untuk ketenangan batin.',
      semester: '1 (Ganjil)',
      kktp: 78,
      ringkasanRaporTuntas:
        'Khidmat dalam kebaktian Puja Bakti dan tenang berkonsentrasi saat latihan meditasi',
      ringkasanRaporPerluBimbingan:
        'Perlu bimbingan ketenangan duduk dan pelafalan paritta suci dengan khidmat'
    },
    {
      kode: 'TP 4',
      lingkupMateri: 'Bab 4: Cinta Kasih (Metta) dan Welas Asih (Karuna)',
      deskripsi:
        'Mengembangkan empat sifat luhur batin (Brahmavihara: Metta/cinta kasih, Karuna/kasih sayang, Mudita/simpati, Upekkha/keseimbangan batin).',
      semester: '1 (Ganjil)',
      kktp: 78,
      ringkasanRaporTuntas:
        'Sangat ramah, berbelas kasih (Karuna), dan peduli tanpa membedakan sesama makhluk',
      ringkasanRaporPerluBimbingan:
        'Perlu pembiasaan memancarkan pikiran cinta kasih saat menghadapi situasi yang kurang menyenangkan'
    },
    {
      kode: 'TP 5',
      lingkupMateri: 'Bab 5: Riwayat Hidup Pangeran Siddhartha Gautama',
      deskripsi:
        'Meneladani keteladanan pangeran Siddhartha dalam kerendahan hati, semangat belajar, dan tekad pengorbanan luhur demi pembebasan.',
      semester: '2 (Genap)',
      kktp: 78,
      ringkasanRaporTuntas:
        'Mampu memetik keteladanan tekad pantang menyerah dan kerendahan hati Pangeran Siddhartha',
      ringkasanRaporPerluBimbingan:
        'Perlu memperdalam kronologi peristiwa agung dalam riwayat hidup Buddha Gautama'
    },
    {
      kode: 'TP 6',
      lingkupMateri: 'Bab 6: Hukum Kamma dan Hari Raya Waisak',
      deskripsi:
        'Memahami hukum sebab-akibat perbuatan (Hukum Kamma) serta makna tiga peristiwa agung dalam Hari Raya Suci Waisak.',
      semester: '2 (Genap)',
      kktp: 78,
      ringkasanRaporTuntas:
        'Menyadari pentingnya menanam benih kebajikan (Kamma baik) demi kebahagiaan bersama',
      ringkasanRaporPerluBimbingan:
        'Perlu penguatan pemahaman hubungan antara niat, perbuatan, dan akibatnya'
    }
  ],

  Konghucu: [
    {
      kode: 'TP 1',
      lingkupMateri: 'Bab 1: Meyakini Tian Yang Maha Esa dan Kebajikan (De)',
      deskripsi:
        'Meyakini dan mensyukuri kemahakuasaan Tian Yang Maha Esa serta benih kebajikan (De) yang dianugerahkan kepada setiap manusia.',
      semester: '1 (Ganjil)',
      kktp: 78,
      ringkasanRaporTuntas:
        'Mampu mensyukuri anugerah Kebajikan dari Tian dan membiasakan hidup selaras dengan alam',
      ringkasanRaporPerluBimbingan:
        'Perlu penguatan pemahaman makna rasa syukur kepada Tian dalam keseharian'
    },
    {
      kode: 'TP 2',
      lingkupMateri: 'Bab 2: Pengamalan Lima Sifat Mulia (Wu Chang)',
      deskripsi:
        'Memahami dan mengamalkan Lima Sifat Mulia (Wu Chang: Ren/cinta kasih, Yi/kebenaran, Li/kesusilaan, Zhi/kebijaksanaan, Xin/dapat dipercaya).',
      semester: '1 (Ganjil)',
      kktp: 78,
      ringkasanRaporTuntas:
        'Menunjukkan perilaku yang dapat dipercaya (Xin) dan menjunjung tinggi kesusilaan (Li)',
      ringkasanRaporPerluBimbingan:
        'Perlu pembiasaan bersikap adil dan menjaga integritas kejujuran saat bermain bersama'
    },
    {
      kode: 'TP 3',
      lingkupMateri: 'Bab 3: Laku Bakti (Xiao) dan Adab Sopan Santun',
      deskripsi:
        'Mempraktikkan laku bakti kepada orang tua (Xiao), menghormati guru dan orang yang lebih tua, serta menjaga tata krama pergaulan.',
      semester: '1 (Ganjil)',
      kktp: 78,
      ringkasanRaporTuntas:
        'Sangat berbakti kepada orang tua dan bertutur kata santun penuh tata krama',
      ringkasanRaporPerluBimbingan:
        'Perlu pembiasaan untuk lebih sabar dan mendengarkan bimbingan orang tua di rumah'
    },
    {
      kode: 'TP 4',
      lingkupMateri: 'Bab 4: Keteladanan Nabi Kongzi dalam Belajar',
      deskripsi:
        'Meneladani keteladanan Nabi Kongzi dalam ketekunan menuntut ilmu, gemar bertanya, kerendahan hati, dan tiada jemu membimbing sesama.',
      semester: '1 (Ganjil)',
      kktp: 78,
      ringkasanRaporTuntas:
        'Tekun belajar dan tidak jemu menuntut ilmu sesuai teladan luhur Nabi Kongzi',
      ringkasanRaporPerluBimbingan:
        'Perlu dorongan untuk lebih antusias dan aktif bertanya hal yang belum dipahami'
    },
    {
      kode: 'TP 5',
      lingkupMateri: 'Bab 5: Membentuk Karakter Insan Berbudi Luhur (Junzi)',
      deskripsi:
        'Memahami cita-cita menjadi insan berbudi luhur (Junzi) yang senantiasa mawas diri, intropeksi, dan mengutamakan kepentingan bersama.',
      semester: '2 (Genap)',
      kktp: 78,
      ringkasanRaporTuntas:
        'Senantiasa mawas diri dan memiliki integritas mulia sebagai calon insan Junzi',
      ringkasanRaporPerluBimbingan:
        'Perlu dorongan dalam mengutamakan kepentingan kelompok di atas kepentingan pribadi'
    },
    {
      kode: 'TP 6',
      lingkupMateri: 'Bab 6: Makna Sembahyang dan Hari Raya Khonghucu',
      deskripsi:
        'Memahami tata cara kebaktian di Litang/Klenteng, makna hormat leluhur, serta perayaan hari raya keagamaan (Tahun Baru Imlek, Qingming).',
      semester: '2 (Genap)',
      kktp: 78,
      ringkasanRaporTuntas:
        'Khidmat dalam tata upacara kebaktian dan memahami makna penghormatan kepada leluhur',
      ringkasanRaporPerluBimbingan:
        'Perlu bimbingan dalam tata krama upacara sembahyang dan pelafalan doa suci'
    }
  ]
};

/**
 * Creates standard TujuanPembelajaran objects for a given religion and subject ID
 */
export function getStandardTPsForAgama(
  agama: AgamaType,
  mapelId = 'mapel-05',
  fase = 'Fase B (Kelas 4)'
): TujuanPembelajaran[] {
  const templates = STANDARD_AGAMA_TPS_BY_RELIGION[agama] || STANDARD_AGAMA_TPS_BY_RELIGION.Islam;
  const prefix = agama.toLowerCase().slice(0, 3);

  return templates.map((t, idx) => ({
    id: `tp-${prefix}-${mapelId}-${idx + 1}`,
    mapelId,
    kode: t.kode,
    lingkupMateri: t.lingkupMateri,
    deskripsi: t.deskripsi,
    semester: t.semester,
    fase,
    kktp: t.kktp,
    ringkasanRaporTuntas: t.ringkasanRaporTuntas,
    ringkasanRaporPerluBimbingan: t.ringkasanRaporPerluBimbingan,
    agama
  }));
}

/**
 * Generates all standard TPs for all 6 religions for a given subject
 */
export function getAllStandardAgamaTPs(
  mapelId = 'mapel-05',
  fase = 'Fase B (Kelas 4)'
): TujuanPembelajaran[] {
  const results: TujuanPembelajaran[] = [];
  AGAMA_LIST.forEach(agama => {
    results.push(...getStandardTPsForAgama(agama, mapelId, fase));
  });
  return results;
}

/**
 * Filter TPs for a specific student considering their religion
 */
export function filterTPsForStudent(
  tps: TujuanPembelajaran[],
  subject: Subject,
  studentAgama?: string
): TujuanPembelajaran[] {
  if (!isAgamaSubject(subject)) {
    return tps.filter(tp => tp.mapelId === subject.id);
  }

  const normalizedAgama: AgamaType = (
    AGAMA_LIST.includes(studentAgama as any) ? studentAgama : 'Islam'
  ) as AgamaType;

  // Find TPs explicitly matching student religion
  const matched = tps.filter(
    tp =>
      tp.mapelId === subject.id &&
      (tp.agama === normalizedAgama || (!tp.agama && normalizedAgama === 'Islam'))
  );

  if (matched.length > 0) {
    return matched;
  }

  // Fallback to standard preset for this religion
  return getStandardTPsForAgama(normalizedAgama, subject.id, subject.deskripsi || 'Fase B (Kelas 4)');
}

/**
 * Provides an authentic narrative fallback for religion subject if no TP scores exist
 */
export function getFallbackReligionNarrative(
  studentAgama = 'Islam',
  isMidSemester = false,
  finalScore = 85,
  kktp = 78
): string {
  const normalized: AgamaType = (
    AGAMA_LIST.includes(studentAgama as any) ? studentAgama : 'Islam'
  ) as AgamaType;
  const detail = AGAMA_DETAILS[normalized] || AGAMA_DETAILS.Islam;
  const subjectName = detail.namaLengkap;

  if (finalScore >= 88) {
    return isMidSemester
      ? `Menunjukkan pemahaman konsep yang sangat mendalam dan bermakna dalam materi ${subjectName}, aktif menerapkan nilai budi pekerti luhur, dan disiplin dalam ${detail.sebutanIbadah} hingga tengah semester.`
      : `Menunjukkan penguasaan yang sangat optimal dan berbudi pekerti luhur dalam pembelajaran ${subjectName}, tekun beribadah ${detail.sebutanIbadah}, serta konsisten mengamalkan nilai toleransi dan kasih antarsesama.`;
  } else if (finalScore >= kktp) {
    return isMidSemester
      ? `Menunjukkan pemahaman konsep yang baik dan memenuhi kriteria ketuntasan dalam materi ${subjectName} serta rajin mengikuti kegiatan pembelajaran hingga tengah semester.`
      : `Menunjukkan pemahaman yang baik dan telah mencapai kriteria ketuntasan pada tujuan pembelajaran ${subjectName}, terutama dalam pembiasaan akhlak mulia dan ibadah harian.`;
  } else {
    return `Perlu bimbingan dan pendampingan terstruktur dalam meningkatkan pemahaman konsep materi ${subjectName} dan pembiasaan ibadah ${detail.sebutanIbadah}.`;
  }
}
