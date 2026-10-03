import { SchoolInfo } from '../types';

export interface AIGenerateParams {
  category: string;
  subject: string;
  gradePhase: string;
  topic: string;
  customNotes?: string;
  detailLevel?: 'standard' | 'lengkap' | 'ringkas';
  schoolInfo: SchoolInfo;
}

export interface AIGenerationHistoryItem {
  id: string;
  timestamp: string;
  category: string;
  categoryLabel: string;
  title: string;
  subject: string;
  gradePhase: string;
  topic: string;
  content: string;
}

export interface AIGenerationResponse {
  result: string;
  source: string;
  online: boolean;
  model?: string;
  timestamp?: string;
}

/**
 * Checks if the backend AI server is online and connected to Gemini
 */
export async function checkAIServerStatus(): Promise<{ online: boolean; model?: string; provider?: string; status?: string }> {
  try {
    const response = await fetch('/api/ai/status', { method: 'GET' });
    if (response.ok) {
      return await response.json();
    }
  } catch (err) {
    // Offline status check fallback
  }
  return { online: false, status: 'offline' };
}

/**
 * Service to generate rich educational documents for Indonesian Elementary School (SD)
 * Calls the online backend Gemini API `/api/ai/generate` with thorough Kurikulum Merdeka prompt engineering
 */
export async function generateAIDocument(params: AIGenerateParams): Promise<AIGenerationResponse> {
  const { category, subject, gradePhase, topic, customNotes, schoolInfo } = params;

  // Tailor instructions by category for deep, exhaustive document generation
  let categoryInstructions = '';
  switch (category) {
    case 'modul':
      categoryInstructions = `Dokumen yang harus dihasilkan adalah MODUL AJAR KURIKULUM MERDEKA LENGKAP & UTUH, memuat:
1. INFORMASI UMUM (Identitas Satuan Pendidikan, Fase/Kelas, Semester, Alokasi Waktu 2 JP, Kompetensi Awal, Profil Pelajar Pancasila, Sarana & Prasarana, Target Siswa 28 anak, Model Pembelajaran PBL/PjBL).
2. KOMPONEN INTI:
   - Capaian Pembelajaran (CP) dan Tujuan Pembelajaran (TP) terukur (ABCD: Audience, Behavior, Condition, Degree).
   - Pemahaman Bermakna dan 3 Pertanyaan Pemantik kontekstual.
   - Persiapan Pembelajaran.
   - Skenario Kegiatan Pembelajaran Terperinci dengan alokasi menit (Kegiatan Awal, Kegiatan Inti dengan diferensiasi konten/proses/produk, Kegiatan Penutup/Refleksi).
3. ASESMEN & EVALUASI:
   - Asesmen Awal / Diagnostik non-kognitif & kognitif.
   - Asesmen Formatif (Rubrik Observasi Profil Pancasila & Lembar Performa).
   - Asesmen Sumatif (5 butir soal pilihan ganda & uraian).
4. PENGAYAAN & REMEDIAL: Rencana tindak lanjut terarah.
5. REFLEKSI: Panduan refleksi guru dan lembar refleksi murid.
6. LAMPIRAN: LKPD siap cetak, bahan bacaan guru & murid, Glosarium, Daftar Pustaka, serta Lembar Pengesahan Tanda Tangan Guru Kelas dan Kepala Sekolah.`;
      break;

    case 'soal':
      categoryInstructions = `Dokumen yang harus dihasilkan adalah PERANGKAT ASESMEN SOAL HOTS & KISI-KISI LENGKAP, memuat:
1. Tabel Kisi-Kisi Penulisan Soal (Capaian Pembelajaran, Tujuan Pembelajaran, Materi, Indikator Soal, Level Kognitif C4/C5/C6, Bentuk Soal).
2. Naskah 5 Soal Pilihan Ganda HOTS (Pilihan A, B, C, D) dengan stimulus nyata kontekstual anak SD (cerita, data tabel, infografis, atau kasus lingkungan).
3. Naskah 3 Soal Uraian Terstruktur Berpikir Kritis & Pemecahan Masalah.
4. Kunci Jawaban Lengkap & Pembahasan Pedagogik Mendalam.
5. Pedoman Penskoran & Rubrik Penilaian Analitik (Skor Maksimal & Konversi Nilai 0-100).
6. Lembar Pengesahan Penguji/Guru Kelas dan Kepala Sekolah.`;
      break;

    case 'deskripsi_rapor':
      categoryInstructions = `Dokumen yang harus dihasilkan adalah PANDUAN NARASI DESKRIPSI CAPAIAN RAPOR KURIKULUM MERDEKA, memuat:
1. Matriks Tujuan Pembelajaran (TP) semester aktif untuk mata pelajaran ${subject}.
2. Formula perumusan deskripsi rapor berbasis capaian TP tertinggi dan TP yang masih membutuhkan bimbingan.
3. Contoh Narasi Rapor Siap Salin untuk 3 Kategori Capaian Siswa:
   - Kategori Sangat Mahir (Istimewa/Tuntas Melampaui)
   - Kategori Sesuai Harapan (Mahir/Tuntas)
   - Kategori Perlu Bimbingan Khusus (Belum Tuntas)
4. Rekomendasi Tindak Lanjut & Catatan Motivasi Wali Kelas untuk Buku Raport.
5. Format Pengesahan Wali Kelas dan Kepala Sekolah.`;
      break;

    case 'p5':
      categoryInstructions = `Dokumen yang harus dihasilkan adalah MODUL & ALUR PROJEK PENGUATAN PROFIL PELAJAR PANCASILA (P5) SD LENGKAP, memuat:
1. Profil Projek (Tema, Topik Projek, Alokasi Waktu 1 Semester, Fase/Kelas).
2. Tujuan & Relevansi Projek bagi Satuan Pendidikan & Lingkungan Sekolah.
3. Dimensi, Elemen, dan Subelemen Profil Pelajar Pancasila yang disasar beserta target capaian akhir fase.
4. Alur Aktivitas Projek Terperinci dalam 5 Tahap:
   - Tahap Pengenalan (Eksplorasi isu)
   - Tahap Kontekstualisasi (Observasi lapangan / lingkungan)
   - Tahap Aksi Nyata (Pembuatan produk/karya nyata)
   - Tahap Refleksi (Evaluasi diri & kelompok)
   - Tahap Tindak Lanjut & Pameran Karya (Gelar Karya Kelas)
5. Rubrik Penilaian Asesmen Projek (Mulai Berkembang, Sedang Berkembang, Berkembang Sesuai Harapan, Sangat Berkembang).
6. Lembar Pengesahan Fasilitator P5 dan Koordinator/Kepala Sekolah.`;
      break;

    case 'program_wali_kelas':
      categoryInstructions = `Dokumen yang harus dihasilkan adalah PROGRAM KERJA & ADMINISTRASI WALI KELAS SD LENGKAP, memuat:
1. Visi, Misi, dan Motto Kelas Ramah Anak.
2. Struktur Organisasi Kelas (Ketua, Wakil, Sekretaris, Bendahara, Seksi-seksi).
3. Jadwal Piket & Pembiasaan 7K (Keamanan, Kebersihan, Ketertiban, Keindahan, Kekeluargaan, Kerindangan, Kesehatan).
4. Kesepakatan Belajar Kelas Bersama (Keyakinan Kelas Berbasis Disiplin Positif).
5. Rencana Program Kerja:
   - Program Harian (Presensi, literasi pagi, doa bersama)
   - Program Mingguan (Pojok baca, senam sehat, evaluasi pekanan)
   - Program Bulanan (Pemberian reward bintang prestasi, koordinasi paguyuban)
   - Program Semesteran (Laporan P5, pembagian rapor, karyawisata)
6. Program Kemitraan Orang Tua & Paguyuban Kelas.
7. Lembar Pengesahan Wali Kelas dan Kepala Sekolah.`;
      break;

    case 'surat_resmi':
      categoryInstructions = `Dokumen yang harus dihasilkan adalah NASKAH SURAT RESMI KEDINASAN SEKOLAH DASAR LENGKAP, memuat:
1. Format Kop Surat Sekolah Resmi.
2. Nomor Surat Kedinasan, Lampiran, dan Perihal Surat.
3. Salam Pembuka Formal & Santun.
4. Bagian Isi: Menjelaskan maksud dan rincian teknis (Hari, Tanggal, Waktu, Tempat, Agenda Kegiatan, Hal yang Perlu Disiapkan Wali Murid).
5. Salam Penutup Formal & Ucapan Terima Kasih.
6. Titimangsa Surat, Kolom Tanda Tangan Wali Kelas/Guru Kelas dan Diketahui oleh Kepala Sekolah lengkap dengan Nama dan NIP.`;
      break;

    case 'konseling_sd':
      categoryInstructions = `Dokumen yang harus dihasilkan adalah CATATAN BIMBINGAN & KONSELING (BK) SISWA SD RAMAH ANAK LENGKAP, memuat:
1. Identitas Peserta Didik (Nama, NISN, Kelas, Usia).
2. Latar Belakang & Identifikasi Perilaku/Kendala Belajar (Pengamatan di kelas, interaksi sosial, tugas).
3. Analisis Faktor Penyebab (Faktor internal & eksternal/keluarga).
4. Pendekatan Konseling & Solusi Humanis (Segitiga Restitusi, penguatan emosional, pendampingan belajar ramah anak).
5. Bentuk Kesepakatan / Komitmen Bersama Siswa & Orang Tua.
6. Jadwal Evaluasi & Monitoring Perkembangan Mingguan.
7. Kolom Tanda Tangan Guru BK / Wali Kelas, Orang Tua, dan Kepala Sekolah.`;
      break;

    case 'lkpd':
      categoryInstructions = `Dokumen yang harus dihasilkan adalah LEMBAR KERJA PESERTA DIDIK (LKPD) INTERAKTIF SD, memuat:
1. Header Lembar Kerja (Identitas Mata Pelajaran, Fase/Kelas, Anggota Kelompok/Nama Siswa, Tanggal).
2. Tujuan Pembelajaran Khusus Kegiatan.
3. Alat & Bahan Praktik Sederhana yang mudah didapat.
4. Petunjuk Kerja Langkah Demi Langkah yang jelas dan ramah anak.
5. Tabel Kerja / Lembar Pengamatan untuk mencatat hasil eksplorasi siswa.
6. Pertanyaan Pemantik Diskusi Kelompok.
7. Kolom Kesimpulan Belajar & Refleksi Senyum Emotikon.
8. Kolom Penilaian Guru Kelas (Catatan Apresiasi & Nilai Akhir).`;
      break;

    case 'ice_breaking':
      categoryInstructions = `Dokumen yang harus dihasilkan adalah PANDUAN 3 ICE BREAKING & GAME EDUKASI KELAS SD, memuat:
1. Ice Breaking 1: Tepuk Karakter & Yel-yel Semangat Berirama (Lirik jelas, gerakan tangan, dan manfaat keceriaan).
2. Ice Breaking 2: Game Konsentrasi & Fokus Cepat 3 Menit (Aturan main, aba-aba guru, dan trik agar suasana kelas kembali kondusif).
3. Ice Breaking 3: Game Edukasi Terkait Materi Pokok (Aktivitas kinestetik ringan dan pertanyaan seru).
4. Panduan Fasilitasi Guru agar semua anak terlibat tanpa ada yang merasa malu atau tersisih.`;
      break;

    default:
      categoryInstructions = `Susun dokumen administrasi guru kelas SD yang sangat lengkap, sistematis, dan berpedoman teguh pada Kurikulum Merdeka Kemendikbudristek.`;
  }

  // Specialized prompt sent to online server
  const prompt = `Anda bertindak sebagai Asisten Ahli Kurikulum Merdeka & Administrasi Pendidikan Sekolah Dasar (SD) Indonesia.
Silakan susun dokumen resmi berikut secara SANGAT LENGKAP, MENDALAM, DAN SIAP PAKAI:

IDENTITAS DOKUMEN:
- Kategori Dokumen: ${category}
- Mata Pelajaran: ${subject}
- Fase & Kelas: ${gradePhase}
- Topik / Materi Pokok: ${topic}
- Satuan Pendidikan: ${schoolInfo.schoolName || 'SD Negeri Unggulan'}
- Nama Guru Kelas / Wali Kelas: ${schoolInfo.homeroomTeacherName || 'Guru Kelas'} (NIP: ${schoolInfo.homeroomTeacherNip || '-'})
- Nama Kepala Sekolah: ${schoolInfo.headmasterName || 'Kepala Sekolah'} (NIP: ${schoolInfo.headmasterNip || '-'})
- Tahun Ajaran: ${schoolInfo.academicYear || '2025/2026'} | Semester: ${schoolInfo.semester || '1 (Ganjil)'}
${customNotes ? `- Catatan Khusus & Arahan Guru: ${customNotes}` : ''}

PETUNJUK KHUSUS KONTEN:
${categoryInstructions}

FORMAT KELUARAN:
- Gunakan Markdown profesional dengan heading hierarkis (#, ##, ###).
- Gunakan tabel terformat rapi bila menyajikan kisi-kisi, alur waktu, rubrik asesmen, atau data.
- Sertakan lembar pengesahan resmi di bagian bawah dokumen dengan format tanggal hari ini, tanda tangan Guru Kelas dan Kepala Sekolah.
- Jangan berikan kalimat pembuka meta seperti "Baik, berikut adalah dokumennya", langsung sajikan judul utama dokumen (# ...) hingga selesai.`;

  // Explicitly call the Online Server Endpoint
  try {
    const response = await fetch('/api/ai/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt,
        category,
        contextData: { subject, gradePhase, topic, schoolInfo, customNotes }
      })
    });

    if (response.ok) {
      const data = await response.json();
      if (data.result && data.result.trim().length > 50) {
        return {
          result: data.result,
          source: data.source || 'gemini-3.8-flash',
          online: true,
          model: data.model || 'Google Gemini 3.8 Flash',
          timestamp: data.timestamp || new Date().toISOString()
        };
      }
    }
  } catch (error) {
    // Graceful offline/local mode fallback without noisy console warning
  }

  // Local rich fallback template engine tailored for Indonesian SD if server is unreachable or under high demand
  const fallbackResult = generateLocalSDFallback(params);
  return {
    result: fallbackResult,
    source: 'template_kurmer_sd',
    online: false,
    model: 'Template Kurikulum Merdeka (Cadangan Otomatis)'
  };
}

/**
 * Rich Fallback Template Engine for all 10+ Elementary School Administration Tools
 */
function generateLocalSDFallback(params: AIGenerateParams): string {
  const { category, subject, gradePhase, topic, schoolInfo, customNotes } = params;
  const teacher = schoolInfo.homeroomTeacherName || 'Guru Kelas';
  const school = schoolInfo.schoolName || 'SD Negeri Unggulan';
  const year = schoolInfo.academicYear || '2025/2026';
  const sem = schoolInfo.semester || '1 (Ganjil)';

  switch (category) {
    case 'modul':
      return `# MODUL AJAR KURIKULUM MERDEKA (LENGKAP)
## TAHUN PELAJARAN ${year} &bull; SEMESTER ${sem}

---

### I. INFORMASI UMUM
- **Nama Penyusun:** ${teacher}
- **Satuan Pendidikan:** ${school}
- **Fase / Kelas:** ${gradePhase}
- **Mata Pelajaran:** ${subject}
- **Alokasi Waktu:** 2 x 35 Menit (1 Pertemuan Pembelajaran)
- **Topik / Materi Pokok:** ${topic}
- **Target Peserta Didik:** Reguler / Tipikal (28 Siswa)
- **Model Pembelajaran:** Tatap Muka dengan Pendekatan Saintifik & Problem Based Learning (PBL)
- **Sarana & Prasarana:** Papan Tulis, Proyektor/Media Gambar Konkret, LKPD Kelompok, Spesimen/Benda Nyata di Lingkungan Sekolah.

---

### II. KOMPONEN INTI

#### A. Capaian Pembelajaran (CP)
Peserta didik menunjukkan kemampuan pemahaman mendalam, menganalisis hubungan konsep, serta mengaplikasikan pengetahuan tentang **${topic}** dalam konteks kehidupan sehari-hari secara kritis dan kreatif.

#### B. Tujuan Pembelajaran (TP)
1. **TP 1:** Peserta didik mampu mengidentifikasi karakteristik dan konsep dasar **${topic}** melalui pengamatan media konkret secara tepat.
2. **TP 2:** Peserta didik mampu mendiskusikan dan menjelaskan fungsi serta hubungan sebab-akibat terkait **${topic}** menggunakan bahasa sendiri dengan runtut.
3. **TP 3:** Peserta didik mampu mempresentasikan hasil lembar kerja kelompok terkait **${topic}** dengan penuh percaya diri dan menghargai pendapat teman.

#### C. Dimensi Profil Pelajar Pancasila
- **1. Beriman, Bertakwa kepada Tuhan YME, dan Berakhlak Mulia:** Membiasakan berdoa sebelum dan sesudah kegiatan belajar serta mensyukuri karunia alam.
- **2. Gotong Royong:** Bekerja sama secara aktif dan berbagi peran dalam menyelesaikan LKPD kelompok.
- **3. Bernalar Kritis:** Memproses informasi, mengajukan pertanyaan analitis, dan menarik kesimpulan berdasarkan bukti pengamatan.
- **4. Kreatif:** Menghasilkan gagasan dan karya visual sederhana terkait materi pembelajaran.

#### D. Pemahaman Bermakna & Pertanyaan Pemantik
- **Pemahaman Bermakna:** Pemahaman tentang ${topic} membantu kita memahami cara kerja lingkungan sekitar dan memecahkan permasalahan sehari-hari secara bijak.
- **Pertanyaan Pemantik:**
  1. *"Apa yang kalian amati ketika melihat fenomena ${topic} di sekitar rumah atau sekolah kita?"*
  2. *"Mengapa kita perlu mempelajari ${topic} dan bagaimana jika hal tersebut tidak berjalan dengan baik?"*

---

### III. KEGIATAN PEMBELAJARAN (BERDIFERENSIASI)

#### 1. Kegiatan Awal (10 Menit)
1. Guru mengucapkan salam pembuka dengan hangat, menyapa peserta didik, dan mengajak salah satu siswa memimpin doa bersama.
2. Guru memeriksa kehadiran siswa dan mengecek kerapian kelas (Pembiasaan 7K).
3. **Ice Breaking / Apersepsi:** Guru melakukan "Tepuk Semangat Kurmer" dan mengaitkan materi pertemuan sebelumnya dengan topik hari ini (**${topic}**).
4. Guru menyampaikan tujuan pembelajaran, alur kegiatan, dan manfaat belajar hari ini.

#### 2. Kegiatan Inti (50 Menit) - Sintaks Problem Based Learning
- **Tahap 1: Orientasi Siswa pada Masalah (Diferensiasi Konten)**
  - Guru menampilkan gambar/video atau benda nyata yang relevan dengan ${topic}.
  - Siswa mengamati dengan seksama dan mencatat hal-hal menarik yang mereka temukan.
- **Tahap 2: Mengorganisasikan Siswa untuk Belajar (Diferensiasi Proses)**
  - Siswa dibagi menjadi 5-6 kelompok heterogen (masing-masing 4-5 anak).
  - Guru membagikan LKPD (Lembar Kerja Peserta Didik) sesuai topik ${topic}.
  - Guru memberikan bimbingan lebih intensif bagi kelompok yang membutuhkan pendampingan (*scaffolding*).
- **Tahap 3: Membimbing Penyelidikan Kelompok**
  - Siswa berdiskusi, mencari data, dan menguji pemahaman konsep ${topic} pada LKPD.
  - Guru berkeliling melakukan asesmen formatif proses dan mencatat keaktifan siswa.
- **Tahap 4: Mengembangkan dan Menyajikan Hasil Karya (Diferensiasi Produk)**
  - Perwakilan kelompok mempresentasikan hasil diskusi di depan kelas.
  - Kelompok lain menyimak dan memberikan tanggapan positif dengan bimbingan guru.
- **Tahap 5: Menganalisis dan Mengevaluasi Proses Pemecahan Masalah**
  - Guru memberikan penguatan materi dan apresiasi bintang penghargaan (*Reward Star*) kepada seluruh kelompok.

#### 3. Kegiatan Penutup (10 Menit)
1. Siswa bersama guru menyimpulkan poin-poin utama materi **${topic}**.
2. **Refleksi Pembelajaran:** Siswa mengungkapkan perasaan belajar hari ini (menempelkan stiker emotikon senang/paham di papan refleksi).
3. Guru memberikan tindak lanjut tugas mandiri sederhana serta menyampaikan topik untuk pertemuan berikutnya.
4. Kelas ditutup dengan doa bersama dan salam penutup.

---

### IV. ASESMEN & EVALUASI
- **1. Asesmen Diagnostik (Awal):** Pertanyaan lisan pemantik untuk memetakan kesiapan awal siswa.
- **2. Asesmen Formatif (Proses):** Lembar observasi sikap Profil Pelajar Pancasila dan rubrik performa diskusi LKPD.
- **3. Asesmen Sumatif (Akhir):** Tes tertulis 5 butir soal pilihan ganda HOTS dan 2 soal uraian pemahaman konsep.

---

### V. PENGAYAAN & REMEDIAL
- **Pengayaan:** Diberikan kepada siswa dengan capaian tinggi untuk menganalisis studi kasus lanjutan ${topic}.
- **Remedial:** Bimbingan tutor sebaya dan latihan terbimbing khusus untuk konsep dasar ${topic} yang belum tuntas.`;

    case 'soal':
      return `# KISI-KISI, BUTIR SOAL HOTS & PEDOMAN PENSKORAN
## ASESMEN SUMATIF KURIKULUM MERDEKA SD
**Mata Pelajaran:** ${subject} | **Fase / Kelas:** ${gradePhase}
**Materi Pokok:** ${topic} | **Tahun Ajaran:** ${year}

---

### A. KISI-KISI PENULISAN SOAL
| No | Capaian / Indikator Soal | Bentuk Soal | Tingkat Kognitif | No. Soal |
|---|---|---|---|---|
| 1 | Siswa mampu mengidentifikasi fakta dasar tentang ${topic} | Pilihan Ganda | C2 (Memahami) | 1 |
| 2 | Siswa mampu menganalisis hubungan konsep ${topic} pada situasi nyata | Pilihan Ganda | C4 (Menganalisis) | 2 |
| 3 | Siswa mampu memprediksi akibat dari perubahan kondisi terkait ${topic} | Pilihan Ganda | C4 (HOTS) | 3 |
| 4 | Siswa mampu mengevaluasi solusi paling tepat terkait studi kasus ${topic} | Pilihan Ganda | C5 (Mengevaluasi) | 4 |
| 5 | Siswa mampu menyimpulkan data kontekstual terkait ${topic} | Pilihan Ganda | C4 (Menganalisis) | 5 |
| 6 | Siswa mampu menjelaskan konsep dan memberikan 2 contoh konkret ${topic} | Uraian | C3 (Menerapkan) | 6 |
| 7 | Siswa mampu merumuskan solusi pemecahan masalah terkait ${topic} | Uraian | C6 (Mencipta/HOTS) | 7 |

---

### B. NASKAH BUTIR SOAL

#### BAGIAN I: PILIHAN GANDA (Pilihlah salah satu jawaban A, B, C, atau D yang paling tepat!)

**1.** Konsep utama yang mendasari materi **${topic}** adalah ...
- A. Perubahan yang terjadi secara acak tanpa adanya aturan tertentu
- B. Suatu keteraturan hubungan fungsi yang saling mendukung satu sama lain
- C. Peristiwa yang hanya terjadi di laboratorium sekolah
- D. Aktivitas yang tidak memiliki pengaruh terhadap kehidupan sehari-hari
*(Kunci Jawaban: B | Skor: 1)*

**2.** Perhatikan narasi berikut!
> *"Sekelompok siswa kelas ${gradePhase} melakukan pengamatan langsung mengenai ${topic} di lingkungan sekolah. Mereka menemukan bahwa terjadi perbedaan hasil saat variabel utama diubah."*

Berdasarkan narasi di atas, sikap ilmiah yang paling tepat untuk dilakukan oleh para siswa adalah ...
- A. Mengabaikan perbedaan data dan langsung menyalin catatan teman
- B. Menghapus data yang tidak sesuai dengan dugaan awal
- C. Mencatat fakta apa adanya, mendiskusikan penyebab perbedaan, dan menarik kesimpulan bersama
- D. Menghentikan pengamatan karena dianggap gagal
*(Kunci Jawaban: C | Skor: 1)*

**3.** Mengapa pemahaman yang mendalam mengenai **${topic}** sangat penting dalam kehidupan bermasyarakat?
- A. Karena dapat membantu kita mengambil keputusan secara kritis dan bertanggung jawab
- B. Karena hanya berguna pada saat menghadapi ujian semester
- C. Supaya mendapatkan pujian dari teman sekelas
- D. Agar dapat mengerjakan tugas tanpa bantuan guru
*(Kunci Jawaban: A | Skor: 1)*

**4.** Jika terjadi gangguan atau hambatan pada sistem **${topic}**, dampak jangka panjang yang paling mungkin dirasakan adalah ...
- A. Keseimbangan proses akan terganggu dan membutuhkan waktu pemulihan
- B. Semua aktivitas langsung berhenti permanen tanpa solusi
- C. Tidak ada dampak sama sekali yang perlu dikhawatirkan
- D. Hasil akhir otomatis meningkat dua kali lipat
*(Kunci Jawaban: A | Skor: 1)*

**5.** Langkah pertama yang paling bijak dan terstruktur dalam menganalisis permasalahan terkait **${topic}** adalah ...
- A. Langsung membuat kesimpulan akhir
- B. Mengidentifikasi pokok masalah dan mengumpulkan data yang valid
- C. Menyalahkan kondisi lingkungan yang ada
- D. Mengubah seluruh prosedur kerja tanpa rencana
*(Kunci Jawaban: B | Skor: 1)*

---

#### BAGIAN II: SOAL URAIAN ANALISIS & HOTS

**6.** Jelaskan pemahamanmu mengenai keterkaitan konsep **${topic}** dengan lingkungan sekitar kita, dan sebutkan minimal 2 (dua) contoh nyata yang sering kamu jumpai dalam kehidupan sehari-hari!

**7.** Apabila kamu dihadapkan pada suatu permasalahan nyata di mana **${topic}** mengalami kendala di lingkungan sekolahmu, rancanglah 3 (tiga) langkah solutif yang kreatif dan dapat diterapkan bersama teman-teman sekelasmu!

---

### C. PEDOMAN PENSKORAN & RUBRIK PENILAIAN
1. **Pilihan Ganda (5 Soal):** Setiap jawaban benar = 10 poin (Total Maksimal: 50 poin).
2. **Soal Uraian No. 6 (Maksimal 25 poin):**
   - Skor 25: Penjelasan sangat runtut, konsep tepat, dan menyertakan 2 contoh nyata yang relevan.
   - Skor 15: Penjelasan cukup baik namun hanya menyebutkan 1 contoh atau contoh kurang tepat.
   - Skor 5: Jawaban sangat singkat dan kurang tepat.
3. **Soal Uraian No. 7 (Maksimal 25 poin):**
   - Skor 25: Memberikan 3 langkah solusi yang logis, kreatif, dan realistis untuk siswa SD.
   - Skor 15: Memberikan 2 langkah solusi yang masuk akal.
   - Skor 5: Hanya memberikan 1 solusi sederhana.

**Rumus Nilai Akhir:**
$$\text{Nilai Akhir (NA)} = \frac{\text{Skor Pilihan Ganda} + \text{Skor Uraian}}{100} \times 100$$`;

    case 'deskripsi_rapor':
      return `# BANK NARASI DESKRIPSI RAPOR CAPAIAN KOMPETENSI (TP)
## KURIKULUM MERDEKA &bull; SEKOLAH DASAR
**Mata Pelajaran:** ${subject} | **Fase / Kelas:** ${gradePhase}
**Tujuan Pembelajaran (TP):** Memahami dan mengaplikasikan konsep ${topic}

---

### 1. KATEGORI: CAPAIAN SANGAT BAIK / SANGAT MAHIR (Rentang Nilai 88 - 100)
> *"Menunjukkan penguasaan yang sangat istimewa dalam menganalisis dan mengaplikasikan materi **${topic}** secara mandiri, kritis, dan mampu membimbing teman sejawat dalam kegiatan belajar kelompok."*

- **Opsi Narasi Alternatif 1:** *"Sangat terampil dan percaya diri dalam menjelaskan konsep **${topic}** serta menyajikan karya hasil pengamatan dengan argumentasi yang sangat logis dan sistematis."*
- **Opsi Narasi Alternatif 2:** *"Menunjukkan pemahaman konsep **${topic}** yang melampaui capaian rata-rata kelas, aktif memberikan solusi kreatif saat diskusi, serta berakhlak mulia."*

---

### 2. KATEGORI: CAPAIAN BAIK / BERKEMBANG SESUAI HARAPAN (Rentang Nilai 75 - 87)
> *"Menunjukkan pemahaman yang baik dalam mengidentifikasi dan menerapkan konsep **${topic}**, mampu bekerja sama secara aktif, dan menyelesaikan tugas-tugas terstruktur dengan tepat waktu."*

- **Opsi Narasi Alternatif 1:** *"Mampu memahami konsep dasar **${topic}** dengan baik serta menunjukkan antusiasme yang konsisten dalam pembelajaran kelas."*
- **Opsi Narasi Alternatif 2:** *"Mencapai ketuntasan tujuan pembelajaran materi **${topic}** dengan hasil memuaskan dan berpartisipasi aktif dalam kegiatan gotong royong kelas."*

---

### 3. KATEGORI: PERLU BIMBINGAN / PENINGKATAN (Rentang Nilai < 75)
> *"Perlu bimbingan dan pendampingan lebih intensif dalam memperkuat pemahaman konsep dasar **${topic}**, terutama dalam menarik kesimpulan mandiri dan penyelesaian latihan lanjutan."*

- **Opsi Narasi Alternatif 1:** *"Menunjukkan kemauan belajar yang baik, namun masih membutuhkan penguatan konsep prasyarat dan latihan terbimbing pada materi **${topic}**."*
- **Opsi Narasi Alternatif 2:** *"Disarankan untuk meningkatkan konsentrasi dan rutin mengulang materi **${topic}** di rumah dengan pendampingan orang tua."*

---

### 4. REKOMENDASI CATATAN WALI KELAS UNTUK RAPOR
> *"Ananda menunjukkan perkembangan karakter Profil Pelajar Pancasila yang membanggakan. Teruslah rajin beribadah, tingkatkan rasa percaya diri dalam mengemukakan pendapat, dan pertahankan semangat gotong royong bersama teman-teman di kelas!"*`;

    case 'p5':
      return `# MODUL PROJEK PENGUATAN PROFIL PELAJAR PANCASILA (P5)
## TAHUN PELAJARAN ${year}
**Satuan Pendidikan:** ${school}
**Fase / Kelas:** ${gradePhase} | **Alokasi Waktu:** 36 JP (6 Minggu Pelaksanaan)

---

### I. PROFIL PROJEK
- **Tema Utama:** Gaya Hidup Berkelanjutan / Kearifan Lokal
- **Topik Projek:** *"Generasi Hijau Berkarakter: Aksi Cilik Berdampak Nyata pada ${topic}"*
- **Target Capaian:** Peserta didik mampu membangun kesadaran lingkungan, empati sosial, dan kemampuan bekerja sama untuk menghasilkan solusi nyata di lingkungan sekolah.

---

### II. DIMENSI, ELEMEN, DAN SUB-ELEMEN
| Dimensi Profil Pelajar Pancasila | Elemen | Sub-Elemen | Target Akhir Fase |
|---|---|---|---|
| **Beriman & Bertakwa kepada Tuhan YME** | Akhlak kepada Alam | Menjaga Lingkungan Alam Sekitar | Membiasakan bersyukur dan merawat kebersihan alam di sekitar kelas & rumah. |
| **Gotong Royong** | Kolaborasi | Kerja Sama & Komunikasi Positif | Menerima dan melaksanakan peran dalam kelompok untuk mencapai tujuan bersama. |
| **Kreatif** | Menghasilkan Karya Orisinal | Mengeksplorasi Ide Solutif | Menggabungkan ide-ide sederhana menjadi karya nyata dari bahan daur ulang/konsep ${topic}. |

---

### III. ALUR TAHAPAN PROJEK (5 TAHAP)
1. **Tahap 1: Pengenalan / Temukan (6 JP)**
   - Sosialisasi tema projek kepada siswa dan orang tua.
   - Eksplorasi isu kontekstual dan video inspiratif mengenai ${topic}.
2. **Tahap 2: Kontekstualisasi / Bayangkan (8 JP)**
   - Observasi lapangan di area sekolah & wawancara narasumber (guru/petugas kebersihan).
   - Analisis masalah dan pemetaan ide solusi kelompok.
3. **Tahap 3: Aksi Nyata / Lakukan (12 JP)**
   - Pembuatan karya nyata atau pameran mini terkait topik ${topic}.
   - Simulasi presentasi dan persiapan gelar karya (*Gelar Karya P5*).
4. **Tahap 4: Refleksi & Evaluasi (6 JP)**
   - Siswa mengisi lembar refleksi diri (*Self-Assessment*) dan umpan balik teman sebaya (*Peer Assessment*).
5. **Tahap 5: Tindak Lanjut & Berbagi (4 JP)**
   - Pameran gelar karya di hadapan seluruh warga sekolah dan paguyuban orang tua.

---

### IV. RUBRIK ASESMEN PERKEMBANGAN P5
- **Mulai Berkembang (MB):** Menunjukkan minat pada aktivitas ${topic} namun membutuhkan bimbingan penuh.
- **Sedang Berkembang (SB):** Mampu menyelesaikan tugas kelompok dengan sedikit arahan guru.
- **Berkembang Sesuai Harapan (BSH):** Mandiri, aktif bekerja sama, dan mampu mengomunikasikan gagasan dengan baik.
- **Sangat Berkembang (SAB):** Mampu menginspirasi teman, memimpin inisiatif positif, dan menghasilkan karya kreatif melebihi ekspektasi.`;

    case 'program_wali_kelas':
      return `# PROGRAM KERJA & AGENDA WALI KELAS SD
## TAHUN PELAJARAN ${year} &bull; SEMESTER ${sem}
**Satuan Pendidikan:** ${school} | **Kelas / Rombel:** ${gradePhase}
**Wali Kelas:** ${teacher}

---

### I. VISI & MISI KELAS
- **Visi Kelas:** *"Mewujudkan Ruang Kelas yang Ramah Anak, Disiplin, Kreatif, dan Berakhlak Mulia Berlandaskan Nilai Profil Pelajar Pancasila."*
- **Misi Kelas:**
  1. Menanamkan nilai religius melalui pembiasaan doa harian dan adab sopan santun.
  2. Menciptakan iklim kelas yang inklusif, bebas perundungan (*Zero Bullying*), dan saling menghargai.
  3. Meningkatkan literasi dan numerasi siswa melalui pojok baca kelas yang nyaman.
  4. Menjalin kemitraan erat dengan paguyuban orang tua/wali murid secara transparan.

---

### II. MATRIKS PROGRAM KERJA PERIODIK

#### A. Program Harian
1. Pembiasaan 7S (Senyum, Salam, Sapa, Sopan, Santun, Semangat, Syukur) di pintu kelas.
2. Memeriksa kehadiran (presensi harian) dan mengecek jurnal piket kebersihan kelas.
3. Melaksanakan kegiatan literasi 15 menit sebelum pembelajaran dimulai.
4. Menangani insiden atau catatan perilaku siswa secara persuasif dan mendidik.

#### B. Program Mingguan
1. Rekapitulasi presensi mingguan dan identifikasi siswa yang membutuhkan perhatian khusus.
2. Pembinaan regu piket dan evaluasi kerapian kelas (KIR).
3. Pengelolaan dan pencatatan kas kelas bersama bendahara cilik kelas.
4. Pembelajaran kontekstual bertema **${topic}**.

#### C. Program Bulanan
1. Pertemuan koordinasi dan laporan perkembangan kelas bersama pengurus Paguyuban Orang Tua.
2. Penataan ulang pajangan hasil karya siswa di mading kelas (*Student Work Display*).
3. Evaluasi capaian asesmen formatif dan sumatif bulanan.
4. Pemilihan "Bintang Teladan Kelas" (*Student of the Month*) untuk mengapresiasi karakter baik.

#### D. Program Semesteran & Tahunan
1. Pengolahan nilai akhir dan penyusunan Buku Laporan Hasil Belajar (Rapor Kurmer).
2. Pembagian rapor bersama orang tua/wali murid.
3. Evaluasi ketercapaian program kerja kelas dan penyusunan laporan pertanggungjawaban kepada Kepala Sekolah.`;

    case 'surat_resmi':
      return `# FORMAT SURAT RESMI WALI KELAS SD
## SURAT PEMBERITAHUAN & UNDANGAN PERTEMUAN WALI MURID

---

**Nomor:** 421.2 / 087 / SD-WK / ${new Date().getFullYear()}  
**Lampiran:** -  
**Perihal:** Undangan Pertemuan Paguyuban & Sosialisasi Pembelajaran **${topic}**

Kepada Yth.  
**Bapak/Ibu Orang Tua / Wali Murid Kelas ${gradePhase}**  
di Tempat

*Assalamu’alaikum Warahmatullahi Wabarakatuh,*  
Salam sejahtera untuk kita semua,

Puji syukur senantiasa kita panjatkan ke hadirat Tuhan Yang Maha Esa atas limpahan rahmat dan karunia-Nya. Semoga Bapak/Ibu beserta keluarga selalu berada dalam keadaan sehat dan penuh keberkahan.

Sehubungan dengan agenda evaluasi pembelajaran tengah semester serta sosialisasi program kegiatan kelas terkait topik **${topic}**, kami mengundang Bapak/Ibu Orang Tua/Wali Murid untuk hadir pada:

- **Hari / Tanggal:** Sabtu, ${new Date(Date.now() + 6 * 86400000).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
- **Waktu:** Pukul 08.30 – 10.30 WIB
- **Tempat:** Ruang Kelas ${gradePhase} - ${school}
- **Agenda:** 
  1. Laporan perkembangan belajar dan karakter peserta didik.
  2. Sosialisasi kegiatan dan dukungan belajar materi ${topic}.
  3. Pembentukan kesepakatan paguyuban dan program jeda semester.

Mengingat pentingnya agenda tersebut demi kemajuan pendidikan putra/putri kita tercinta, kami sangat mengharapkan kehadiran Bapak/Ibu tepat pada waktunya.

Demikian surat undangan ini kami sampaikan. Atas perhatian, kerja sama, dan kehadiran Bapak/Ibu, kami ucapkan terima kasih yang sebesar-besarnya.

*Wassalamu’alaikum Warahmatullahi Wabarakatuh.*`;

    case 'konseling_sd':
      return `# LEMBAR CATATAN BIMBINGAN & KONSELING (BK SD)
## FORMAT PEMBINAAN & PENDAMPINGAN RAMAH ANAK
**Satuan Pendidikan:** ${school} | **Kelas:** ${gradePhase}

---

### I. IDENTITAS SISWA & WAKTU KONSELING
- **Hari / Tanggal:** ${new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
- **Nama Guru / Konselor:** ${teacher}
- **Topik / Fokus Masalah:** Pendampingan Belajar & Perkembangan Karakter terkait ${topic}

---

### II. DESKRIPSI KASUS / PERILAKU YANG DIAMATI
Siswa menunjukkan gejala kesulitan dalam mengikuti alur pembelajaran materi **${topic}**, sering terlihat melamun pada saat diskusi kelompok, serta enggan mengajukan pertanyaan meskipun belum memahami instruksi tugas.

---

### III. FAKTOR PENYEBAB YANG DIIDENTIFIKASI
1. **Faktor Internal:** Rasa kurang percaya diri untuk berbicara di depan teman sekelas karena takut salah.
2. **Faktor Eksternal:** Gaya belajar siswa cenderung visual-kinestetik, sedangkan penyampaian materi sebelumnya didominasi metode ceramah/auditori.

---

### IV. LANGKAH PENANGANAN & TINDAK LANJUT RAMAH ANAK
1. **Pendekatan Personal:** Guru melakukan dialog santai dari hati ke hati saat jam istirahat untuk mendengarkan keluh kesah siswa tanpa menghakimi.
2. **Diferensiasi Pembelajaran:** Guru menyediakan media gambar berwarna dan benda konkret saat menjelaskan ${topic}.
3. **Pemberian Peran Khusus:** Memberikan tugas kecil yang memicu rasa tanggung jawab siswa dalam kelompok belajar (misal: penanggung jawab media).
4. **Komunikasi dengan Orang Tua:** Memberikan catatan apresiasi positif dan meminta orang tua mendampingi latihan ringan di rumah tanpa membebani anak.`;

    case 'lkpd':
      return `# LEMBAR KERJA PESERTA DIDIK (LKPD) INTERAKTIF
## KURIKULUM MERDEKA &bull; SEKOLAH DASAR
**Mata Pelajaran:** ${subject} | **Fase / Kelas:** ${gradePhase}
**Topik Pembelajaran:** ${topic} | **Nama Kelompok:** ........................................
**Anggota Kelompok:**
1. ..................................................... 3. .....................................................
2. ..................................................... 4. .....................................................

---

### PETUNJUK KERJA:
1. Bacalah basmalah atau berdoalah sebelum memulai mengerjakan LKPD ini.
2. Amati dengan cermat media/instruksi yang diberikan oleh Bapak/Ibu Guru.
3. Diskusikan bersama teman sekelompokmu dan tuliskan jawabanmu pada kolom yang disediakan.
4. Tanyakan kepada guru jika ada langkah kegiatan yang belum kamu pahami.

---

### AKTIVITAS 1: EKSPLORASI & PENGAMATAN KONSEP
Perhatikan gambar atau fenomena terkait **${topic}** di meja kelompokmu! Tuliskan 3 hal menarik yang kamu temukan:

| No | Hal yang Diamati terkait ${topic} | Apa yang Terjadi? | Mengapa Hal Tersebut Terjadi? |
|---|---|---|---|
| 1 | ................................................................. | ................................................................. | ................................................................. |
| 2 | ................................................................. | ................................................................. | ................................................................. |
| 3 | ................................................................. | ................................................................. | ................................................................. |

---

### AKTIVITAS 2: TANTANGAN ANALISIS BERSAMA
1. Berdasarkan pengamatan kelompokmu, apa hubungan antara **${topic}** dengan kehidupan kita sehari-hari?  
   *Jawaban:*  
   ....................................................................................................................................................  
   ....................................................................................................................................................

2. Buatlah gambar atau diagram alur sederhana yang menjelaskan cara kerja **${topic}** pada kotak di bawah ini:  
   +---------------------------------------------------------------------------------------------------+  
   |                                                                                                   |  
   |                                 [ KOTAK GAMBAR KELOMPOK ]                                         |  
   |                                                                                                   |  
   +---------------------------------------------------------------------------------------------------+  

---

### KESIMPULAN KELOMPOK:
Hari ini kelompok kami belajar bahwa **${topic}** adalah .......................................................................  
........................................................................................................................................................`;

    case 'ice_breaking':
    default:
      return `# KUMPULAN ICE BREAKING, TEPUK SEMANGAT & GAMES EDUKASI SD
## EDISI KURIKULUM MERDEKA UNTUK MATERI: ${topic.toUpperCase()}

---

### 1. TEPUK KARAKTER PELAJAR PANCASILA (Waktu: 2 Menit)
- *Guru:* "Tepuk Pelajar Pancasila!"
- *Siswa:* *(Tepuk 3x)* Beriman!
- *Siswa:* *(Tepuk 3x)* Bertakwa!
- *Siswa:* *(Tepuk 3x)* Berakhlak Mulia!
- *Siswa:* *(Tepuk 3x)* Mandiri!
- *Siswa:* *(Tepuk 3x)* Bernalar Kritis!
- *Siswa:* *(Tepuk 3x)* Kreatif!
- *Siswa:* *(Tepuk 3x)* Gotong Royong!
- *Semua:* *(Tangan di atas)* "SD Juara... Luar Biasa, Yes Yes Yes!"

---

### 2. GAME EDUKATIF: "KATA KUNCI ${topic.toUpperCase()}" (Waktu: 5 Menit)
- **Tujuan:** Melatih kecepatan berpikir dan konsentrasi terhadap materi pembelajaran.
- **Cara Bermain:**
  1. Guru menyebutkan berbagai kata secara acak.
  2. Jika kata yang diucapkan berkaitan dengan **${topic}**, seluruh siswa harus berdiri tegak sambil berkata *"Tepat!"*.
  3. Jika kata yang diucapkan bukan bagian dari materi ${topic}, siswa tetap duduk tenang dan menyilangkan tangan di dada.
  4. Siswa yang salah gerak diberikan tantangan menjawab satu pertanyaan ringan dengan penuh keceriaan.

---

### 3. TEPUK FOKUS & KONSENTRASI KELAS
- *Melihat! (Tepuk 2x - Tangan di samping mata)*
- *Mendengar! (Tepuk 2x - Tangan di samping telinga)*
- *Mengingat! (Tepuk 2x - Jari telunjuk di kening)*
- *Fokus! (Tepuk 3x - Siap belajar!)*

---

### 4. YEL-YEL SEMANGAT KELAS ${gradePhase}
*(Dengan nada lagu anak-anak gembira)*  
*"Kami anak pintar, kami anak hebat,*  
*Belajar ${topic} bersama kawan-kawan.*  
*Tak pernah mengeluh, selalu bersemangat,*  
*Meraih masa depan yang terang benderang!"*`;
  }
}
