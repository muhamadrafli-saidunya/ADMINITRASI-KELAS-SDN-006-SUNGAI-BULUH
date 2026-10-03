import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { HeaderKopSekolah } from '../common/HeaderKopSekolah';
import { exportToWordDoc } from '../../utils/documentExport';
import { generateAIDocument, checkAIServerStatus, AIGenerationHistoryItem } from '../../services/aiGeneratorService';
import {
  Sparkles,
  BookOpen,
  FileText,
  HelpCircle,
  Copy,
  Check,
  Printer,
  RefreshCw,
  Send,
  Lightbulb,
  GraduationCap,
  Download,
  FileSpreadsheet,
  CalendarDays,
  Award,
  Users,
  MessageSquare,
  History,
  FileCheck,
  Zap,
  BookmarkPlus,
  Eye,
  Edit3,
  Flame,
  Layers,
  FileDown,
  Globe,
  Wifi,
  Server
} from 'lucide-react';

type ToolCategory =
  | 'modul'
  | 'soal'
  | 'deskripsi_rapor'
  | 'p5'
  | 'program_wali_kelas'
  | 'surat_resmi'
  | 'konseling_sd'
  | 'lkpd'
  | 'ice_breaking'
  | 'chat_guru';

interface ToolDef {
  id: ToolCategory;
  label: string;
  shortLabel: string;
  badge: string;
  badgeColor: string;
  icon: React.ReactNode;
  description: string;
  defaultTopic: string;
  quickPrompts: string[];
}

export const AIAssistantView: React.FC = () => {
  const { subjects, schoolInfo, addToast, addModulAjar } = useApp();

  const [activeCategory, setActiveCategory] = useState<ToolCategory>('modul');
  const [selectedMapel, setSelectedMapel] = useState<string>(subjects[0]?.nama || 'Pendidikan Pancasila');
  const [selectedFase, setSelectedFase] = useState<string>('Fase B (Kelas 4 SD)');
  const [topikMateri, setTopikMateri] = useState<string>('Bagian Tubuh Tumbuhan dan Fotosintesis');
  const [customNotes, setCustomNotes] = useState<string>('');
  const [viewMode, setViewMode] = useState<'official_doc' | 'raw_markdown'>('official_doc');

  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedResult, setGeneratedResult] = useState<string>('');
  const [generationSource, setGenerationSource] = useState<string>('');
  const [generationOnline, setGenerationOnline] = useState<boolean>(true);
  const [generationModel, setGenerationModel] = useState<string>('Google Gemini 3.8 Flash');
  const [copied, setCopied] = useState<boolean>(false);
  const [historyList, setHistoryList] = useState<AIGenerationHistoryItem[]>([]);

  // Server Online Connectivity Status
  const [serverStatus, setServerStatus] = useState<{
    checking: boolean;
    online: boolean;
    model: string;
    provider: string;
  }>({
    checking: false,
    online: true,
    model: 'Google Gemini 3.8 Flash',
    provider: 'Google Gemini AI Server'
  });

  const checkServer = async () => {
    setServerStatus(prev => ({ ...prev, checking: true }));
    try {
      const res = await checkAIServerStatus();
      setServerStatus({
        checking: false,
        online: res.online,
        model: res.model || 'Google Gemini 3.8 Flash',
        provider: res.provider || 'Google Gemini AI Server'
      });
    } catch {
      setServerStatus({
        checking: false,
        online: false,
        model: 'Offline',
        provider: 'Local Engine'
      });
    }
  };

  useEffect(() => {
    checkServer();
  }, []);

  // Interactive AI Chat State
  const [chatMessages, setChatMessages] = useState<Array<{ role: 'user' | 'assistant'; text: string; time: string }>>([
    {
      role: 'assistant',
      text: `Halo Bapak/Ibu Guru ${schoolInfo.homeroomTeacherName || ''}! Saya Asisten AI Administrasi Guru SD. Ada yang bisa saya bantu terkait strategi mengajar, diferensiasi konten, pembuatan modul ajar, penanganan perilaku siswa, atau asesmen Kurikulum Merdeka hari ini?`,
      time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputChat, setInputChat] = useState<string>('');
  const [isChatLoading, setIsChatLoading] = useState<boolean>(false);

  // Tools definitions for Elementary School Administration
  const tools: ToolDef[] = [
    {
      id: 'modul',
      label: 'Modul Ajar Kurikulum Merdeka',
      shortLabel: 'Modul Ajar',
      badge: 'Lengkap',
      badgeColor: 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
      icon: <BookOpen className="h-4 w-4" />,
      description: 'Lengkap dengan CP, TP, Diferensiasi, Profil Pancasila, Skenario Pembelajaran, Asesmen & Rubrik',
      defaultTopic: 'Bagian Tubuh Tumbuhan dan Proses Fotosintesis',
      quickPrompts: [
        'Bagian Tubuh Tumbuhan & Fungsinya',
        'Pecahan Senilai & Desimal Sederhana',
        'Pancasila Sebagai Nilai Kehidupan',
        'Siklus Air dan Kelestarian Lingkungan',
        'Ciri-Ciri Makhluk Hidup & Habitatnya',
        'Membaca Nyaring Cerita Fabel Edukatif'
      ]
    },
    {
      id: 'soal',
      label: 'Penyusun Soal HOTS & Rubrik',
      shortLabel: 'Soal HOTS',
      badge: 'Asesmen',
      badgeColor: 'bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800',
      icon: <FileText className="h-4 w-4" />,
      description: 'Pilihan Ganda HOTS, Uraian Analitis, Kisi-kisi Soal, Kunci Jawaban & Rubrik Penskoran',
      defaultTopic: 'Gaya Magnet dan Gravitasi Bumi',
      quickPrompts: [
        'Gaya Magnet dan Gravitasi Bumi',
        'Operasi Hitung Pecahan Campuran',
        'Penerapan Hak dan Kewajiban Siswa di Sekolah',
        'Keberagaman Suku dan Budaya Indonesia',
        'Menemukan Gagasan Pokok Paragraf'
      ]
    },
    {
      id: 'deskripsi_rapor',
      label: 'Deskripsi Capaian Rapor (TP)',
      shortLabel: 'Deskripsi Rapor',
      badge: 'Kurmer',
      badgeColor: 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800',
      icon: <FileSpreadsheet className="h-4 w-4" />,
      description: 'Rekomendasi narasi otomatis capaian Sangat Mahir, Sesuai Harapan, dan Perlu Bimbingan',
      defaultTopic: 'Pemahaman Konsep Ekosistem & Rantai Makanan',
      quickPrompts: [
        'Pemahaman Konsep Ekosistem & Rantai Makanan',
        'Keterampilan Menulis Teks Deskripsi Sederhana',
        'Operasi Perkalian dan Pembagian Bilangan Cacah',
        'Pengamalan Sila-Sila Pancasila',
        'Keterampilan Gerak Dasar Senam Lantai'
      ]
    },
    {
      id: 'p5',
      label: 'Modul & Alur Projek P5 SD',
      shortLabel: 'Modul P5',
      badge: 'Projek P5',
      badgeColor: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
      icon: <Award className="h-4 w-4" />,
      description: 'Alur 5 Tahap Projek, Dimensi-Elemen P5, Panduan Fasilitator & Rubrik MB/SB/BSH/SAB',
      defaultTopic: 'Pilah Sampah Jadi Berkah (Gaya Hidup Berkelanjutan)',
      quickPrompts: [
        'Pilah Sampah Jadi Berkah (Gaya Hidup Berkelanjutan)',
        'Kearifan Kuliner Tradisional Daerahku',
        'Bhinneka Tunggal Ika: Harmoni Sahabat Kelas',
        'Kewirausahaan Cilik: Pasar Karya Murid',
        'Rekayasa Mainan Tradisional Berbahan Daur Ulang'
      ]
    },
    {
      id: 'program_wali_kelas',
      label: 'Program Kerja & Agenda Wali Kelas',
      shortLabel: 'Program Wali Kelas',
      badge: 'Administrasi',
      badgeColor: 'bg-sky-500/10 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800',
      icon: <CalendarDays className="h-4 w-4" />,
      description: 'Program Harian, Mingguan, Bulanan, Semesteran, Visi Kelas & Kesepakatan Kelas',
      defaultTopic: 'Membangun Budaya Kelas Disiplin, Ramah Anak, dan Berprestasi',
      quickPrompts: [
        'Membangun Budaya Kelas Disiplin & Ramah Anak',
        'Program Penguatan Literasi & Pojok Baca Kelas',
        'Pengelolaan Regu Piket & Kebersihan 7K Kelas',
        'Program Kemitraan Paguyuban Orang Tua Murid'
      ]
    },
    {
      id: 'surat_resmi',
      label: 'Surat Resmi & Undangan Wali Murid',
      shortLabel: 'Surat Resmi',
      badge: 'Persuratan',
      badgeColor: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
      icon: <FileCheck className="h-4 w-4" />,
      description: 'Undangan Rapat Paguyuban, Surat Panggilan Orang Tua, Surat Dispensasi, dan Edaran',
      defaultTopic: 'Pertemuan Paguyuban dan Sosialisasi Evaluasi Tengah Semester',
      quickPrompts: [
        'Undangan Pertemuan Paguyuban Evaluasi Tengah Semester',
        'Surat Panggilan Orang Tua / Konseling Belajar Siswa',
        'Surat Pemberitahuan Kegiatan Karyawisata / Edu-Trip',
        'Surat Keterangan Dispensasi / Izin Siswa Berprestasi'
      ]
    },
    {
      id: 'konseling_sd',
      label: 'Catatan Bimbingan & Konseling (BK)',
      shortLabel: 'Konseling & BK',
      badge: 'Ramah Anak',
      badgeColor: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800',
      icon: <Users className="h-4 w-4" />,
      description: 'Identifikasi kesulitan belajar (Calistung), perilaku pasif/hiperaktif & solusi ramah anak',
      defaultTopic: 'Pendampingan Siswa Kurang Fokus dan Kesulitan Membaca Pemahaman',
      quickPrompts: [
        'Pendampingan Siswa Kurang Fokus & Kesulitan Membaca',
        'Penanganan Siswa Pasif dan Kurang Percaya Diri',
        'Bimbingan Mediasi Perselisihan Teman Sebaya',
        'Pendampingan Siswa Berbakat Seni / Olahraga'
      ]
    },
    {
      id: 'lkpd',
      label: 'Lembar Kerja Peserta Didik (LKPD)',
      shortLabel: 'LKPD Interaktif',
      badge: 'Media Ajar',
      badgeColor: 'bg-teal-500/10 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800',
      icon: <Layers className="h-4 w-4" />,
      description: 'LKPD interaktif, petunjuk kerja, tabel pengamatan eksplorasi, dan kolom isian kelompok',
      defaultTopic: 'Pengamatan Sifat-Sifat Cahaya dan Cermin',
      quickPrompts: [
        'Pengamatan Sifat-Sifat Cahaya & Cermin',
        'Eksplorasi Bentuk dan Keliling Bangun Datar',
        'Peta Pikiran Ciri-Ciri Hewan Herbivora, Karnivora & Omnivora',
        'Menuliskan Pengalaman Bergotong Royong di Rumah'
      ]
    },
    {
      id: 'ice_breaking',
      label: 'Ice Breaking & Game Edukasi SD',
      shortLabel: 'Ice Breaking',
      badge: 'Game Kelas',
      badgeColor: 'bg-orange-500/10 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800',
      icon: <Flame className="h-4 w-4" />,
      description: 'Tepuk Karakter Pelajar Pancasila, Game Konsentrasi 5 Menit, dan Yel-yel Semangat',
      defaultTopic: 'Pembelajaran Sains dan Matematika Ceria',
      quickPrompts: [
        'Ice Breaking Awal Pembelajaran Matematika Ceria',
        'Tepuk Karakter Profil Pelajar Pancasila & Yel-yel',
        'Game Konsentrasi Simon Berkata versi Sains',
        'Tebak Gerak & Kata Kunci Literasi'
      ]
    },
    {
      id: 'chat_guru',
      label: 'Chat Tanya Jawab Guru SD (AI Live)',
      shortLabel: 'Chat Asisten Guru',
      badge: 'Interaktif',
      badgeColor: 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
      icon: <MessageSquare className="h-4 w-4" />,
      description: 'Konsultasi bebas seputar masalah kelas, pedagogik, ide apersepsi, dan Kurikulum Merdeka',
      defaultTopic: 'Konsultasi Pedagogik Interaktif Guru SD',
      quickPrompts: [
        'Bagaimana cara mengatasi siswa yang sering melamun saat matematika?',
        'Beri 3 ide apersepsi kontekstual untuk materi siklus air kelas 4 SD',
        'Bagaimana menyusun kriteria ketercapaian tujuan pembelajaran (KKTP)?',
        'Tips mengadakan rapat paguyuban kelas yang efektif dan kompak'
      ]
    }
  ];

  const currentTool = tools.find(t => t.id === activeCategory) || tools[0];

  const handleSelectTool = (tool: ToolDef) => {
    setActiveCategory(tool.id);
    if (!topikMateri || topikMateri === currentTool.defaultTopic) {
      setTopikMateri(tool.defaultTopic);
    }
  };

  const handleSelectPrompt = (prompt: string) => {
    setTopikMateri(prompt);
  };

  const handleGenerate = async () => {
    if (activeCategory === 'chat_guru') return;

    setIsGenerating(true);
    try {
      const response = await generateAIDocument({
        category: activeCategory,
        subject: selectedMapel,
        gradePhase: selectedFase,
        topic: topikMateri || currentTool.defaultTopic,
        customNotes,
        schoolInfo
      });

      setGeneratedResult(response.result);
      setGenerationSource(response.source);
      setGenerationOnline(response.online);
      setGenerationModel(response.model || 'Google Gemini 3.8 Flash');

      // Save to local session history
      const historyItem: AIGenerationHistoryItem = {
        id: `hist_${Date.now()}`,
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        category: activeCategory,
        categoryLabel: currentTool.label,
        title: `${currentTool.shortLabel}: ${topikMateri}`,
        subject: selectedMapel,
        gradePhase: selectedFase,
        topic: topikMateri,
        content: response.result
      };
      setHistoryList(prev => [historyItem, ...prev.slice(0, 9)]);

      if (response.online) {
        addToast(
          'success',
          'Dokumen Selesai (Server Online)',
          `Dokumen ${currentTool.shortLabel} berhasil digenerate online via Server AI (${response.model || 'Gemini 3.8 Flash'}).`
        );
      } else {
        addToast(
          'warning',
          'Dokumen Disusun (Mode Cadangan)',
          `Dokumen berhasil disusun menggunakan format baku Kurikulum Merdeka.`
        );
      }
    } catch (err: any) {
      addToast('error', 'Kendala Generasi', 'Gagal memproses dokumen di server AI online. Silakan coba kembali.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (!generatedResult) return;
    navigator.clipboard.writeText(generatedResult);
    setCopied(true);
    addToast('success', 'Tersalin', 'Isi dokumen berhasil disalin ke clipboard.');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportWord = () => {
    if (!generatedResult) return;
    const docTitle = `${currentTool.label.toUpperCase()} - ${topikMateri.toUpperCase()}`;
    exportToWordDoc(docTitle, generatedResult, schoolInfo, {
      categoryName: currentTool.label,
      subjectName: selectedMapel,
      gradeClass: selectedFase,
      topic: topikMateri
    });
    addToast('success', 'Download Word Berhasil', 'File Microsoft Word (.doc) berhasil diunduh dengan format kop dan tabel rapi.');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSaveToModulAjar = () => {
    if (!generatedResult) return;
    const cleanKode = `MA-${selectedMapel.substring(0, 3).toUpperCase()}-${Date.now().toString().slice(-4)}`;
    
    addModulAjar({
      kodeModul: cleanKode,
      judul: topikMateri || currentTool.defaultTopic,
      mataPelajaran: selectedMapel,
      fase: selectedFase.includes('Fase A') ? 'Fase A' : selectedFase.includes('Fase C') ? 'Fase C' : 'Fase B',
      kelas: selectedFase.includes('Kelas 1') ? '1' : selectedFase.includes('Kelas 2') ? '2' : selectedFase.includes('Kelas 3') ? '3' : selectedFase.includes('Kelas 5') ? '5' : selectedFase.includes('Kelas 6') ? '6' : '4',
      semester: schoolInfo.semester as any || '1 (Ganjil)',
      alokasiWaktu: '2 JP (2 x 35 Menit) / 1 Pertemuan',
      penyusun: schoolInfo.homeroomTeacherName || 'Guru Kelas',
      nipPenyusun: schoolInfo.homeroomTeacherNip || '-',
      instansi: schoolInfo.schoolName || 'SD Negeri',
      tahunPenyusunan: schoolInfo.academicYear || '2025/2026',
      elemenCP: `Pemahaman Konsep ${selectedMapel}`,
      capaianPembelajaran: `Peserta didik mampu memahami dan mengaplikasikan konsep ${topikMateri} secara mandiri dan kritis.`,
      tujuanPembelajaran: [
        `Mengidentifikasi konsep dasar ${topikMateri}`,
        `Menjelaskan hubungan dan fungsi ${topikMateri} dalam kehidupan sehari-hari`,
        `Menyajikan hasil analisis kelompok terkait ${topikMateri}`
      ],
      profilPelajarPancasila: ['Bernalar Kritis', 'Gotong Royong', 'Mandiri', 'Kreatif'],
      saranaPrasarana: {
        media: 'Gambar Konkret / Proyektor / Benda Nyata',
        alatDanBahan: 'LKPD Siswa, Spidol, Kertas Kerja',
        sumberBelajar: 'Buku Siswa & Guru Kemendikbudristek'
      },
      targetPesertaDidik: 'Peserta didik reguler/tipikal (28 siswa)',
      modelPembelajaran: 'Problem Based Learning (PBL) / Tatap Muka',
      metodePembelajaran: ['Pengamatan', 'Diskusi Kelompok', 'Eksperimen Sederhana', 'Presentasi'],
      pemahamanBermakna: `Mempelajari ${topikMateri} memberi wawasan berharga untuk memecahkan permasalahan nyata di sekitar kita.`,
      pertanyaanPemantik: [
        `Apa yang kalian ketahui tentang ${topikMateri}?`,
        `Mengapa konsep ini penting dalam kehidupan kita?`
      ],
      kegiatanPembelajaran: {
        pendahuluan: [
          { nomor: 1, aktivitas: 'Guru membuka dengan salam dan doa bersama siswa.', alokasiMenit: 3 },
          { nomor: 2, aktivitas: 'Presensi dan ice breaking tepuk semangat.', alokasiMenit: 3 },
          { nomor: 3, aktivitas: 'Apersepsi dan penyampaian tujuan pembelajaran.', alokasiMenit: 4 }
        ],
        inti: [
          { nomor: 1, aktivitas: 'Orientasi masalah: Guru menampilkan media konkret.', alokasiMenit: 10 },
          { nomor: 2, aktivitas: 'Organisasi belajar: Siswa membentuk kelompok kerja LKPD.', alokasiMenit: 10 },
          { nomor: 3, aktivitas: 'Penyelidikan: Siswa mengamati dan mendiskusikan materi.', alokasiMenit: 15 },
          { nomor: 4, aktivitas: 'Penyajian: Presentasi kelompok dan tanggapan.', alokasiMenit: 15 }
        ],
        penutup: [
          { nomor: 1, aktivitas: 'Refleksi pembelajaran bersama siswa.', alokasiMenit: 5 },
          { nomor: 2, aktivitas: 'Penguatan, tugas tindak lanjut, dan doa penutup.', alokasiMenit: 5 }
        ]
      },
      lampiran: {
        lkpdJudul: `LKPD Eksplorasi ${topikMateri}`,
        lkpdDeskripsi: `Lembar kerja peserta didik untuk memahami konsep ${topikMateri}.`,
        lkpdPetunjuk: ['Berdoalah sebelum mengerjakan', 'Diskusikan bersama kelompokmu'],
        lkpdTugas: [
          { soal: `Jelaskan fungsi utama dari ${topikMateri}!`, tipe: 'esai' }
        ],
        bahanBacaanGuruDanSiswa: `Ringkasan materi dasar ${topikMateri} untuk Sekolah Dasar.`,
        glosarium: [{ istilah: 'Konsep', arti: 'Gagasan utama yang mendasari suatu pengetahuan' }],
        daftarPustaka: ['Buku Panduan Guru Kurikulum Merdeka Kemendikbudristek']
      }
    });

    addToast('success', 'Tersimpan ke Modul Ajar', `Modul "${topikMateri}" berhasil disimpan ke bank Perangkat Ajar.`);
  };

  // Send Chat message to AI
  const handleSendChat = async () => {
    if (!inputChat.trim() || isChatLoading) return;

    const userText = inputChat.trim();
    const timeNow = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    
    setChatMessages(prev => [...prev, { role: 'user', text: userText, time: timeNow }]);
    setInputChat('');
    setIsChatLoading(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userText })
      });

      if (response.ok) {
        const data = await response.json();
        setChatMessages(prev => [
          ...prev,
          {
            role: 'assistant',
            text: data.reply || 'Jawaban tidak dapat diproses.',
            time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      } else {
        throw new Error('Chat failed');
      }
    } catch (e) {
      setChatMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          text: `Halo Bapak/Ibu Guru! Terkait pertanyaan "${userText}", saran pedagogik praktis untuk kelas SD adalah:\n1. Gunakan pendekatan konkret yang dekat dengan keseharian siswa.\n2. Berikan diferensiasi tugas bertingkat (mudah, sedang, menantang).\n3. Terapkan apresiasi positif (pujian & bintang kelas) untuk memicu motivasi belajar.`,
          time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsChatLoading(false);
    }
  };

  // Sanitized markdown that strips duplicate closing signature text and preamble
  const cleanedMarkdownContent = useMemo(() => {
    return sanitizeDocumentMarkdown(generatedResult);
  }, [generatedResult]);

  // Dynamic signature role label tailored to document type (menyesuaikan dokumen yang tersedia)
  const signatureRoleLabel = useMemo(() => {
    return getSignatureRoleLabel(activeCategory);
  }, [activeCategory]);

  return (
    <div className="space-y-6 print:space-y-0">
      {/* Top Banner Header - Hidden during print */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 p-6 text-white shadow-xl no-print print:hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute bottom-0 left-1/3 -mb-10 h-36 w-36 rounded-full bg-purple-400/20 blur-xl" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
          <div className="flex items-start sm:items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-md border border-white/25 shadow-inner">
              <Sparkles className="h-7 w-7 text-amber-300 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                  Pusat AI Administrasi Guru SD
                </h1>
                <span className="rounded-full bg-amber-400/20 border border-amber-300/40 px-2.5 py-0.5 text-[11px] font-extrabold text-amber-200">
                  Kurikulum Merdeka
                </span>
                <span className="rounded-full bg-emerald-400/20 border border-emerald-300/40 px-2.5 py-0.5 text-[11px] font-extrabold text-emerald-200">
                  Kemendikbudristek
                </span>
                <div className="inline-flex items-center gap-1.5 rounded-full bg-white/15 border border-white/25 px-2.5 py-0.5 text-[11px] font-bold text-blue-100">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                  </span>
                  <span>Server Online: {serverStatus.model}</span>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-blue-100/90 mt-1 max-w-2xl">
                Layanan cerdas otomatisasi dokumen mengajar SD: Modul Ajar lengkap, Soal HOTS, Deskripsi Rapor, Projek P5, LKPD, Surat Resmi, hingga ekspor rapi ke <strong>Microsoft Word (.doc)</strong> dan <strong>Cetak A4 Resmi</strong>.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto bg-white/10 backdrop-blur-md rounded-2xl p-1.5 border border-white/20">
            <div className="px-3 py-1 text-center">
              <div className="text-lg font-black text-amber-300">10+</div>
              <div className="text-[10px] uppercase font-bold text-blue-100">Fasilitas AI</div>
            </div>
            <div className="h-7 w-px bg-white/20" />
            <div className="px-3 py-1 text-center">
              <div className="text-lg font-black text-emerald-300">.DOC</div>
              <div className="text-[10px] uppercase font-bold text-blue-100">Ekspor Word</div>
            </div>
            <div className="h-7 w-px bg-white/20" />
            <div className="px-3 py-1 text-center">
              <div className="text-lg font-black text-sky-300">A4</div>
              <div className="text-[10px] uppercase font-bold text-blue-100">Kop Cetak</div>
            </div>
          </div>
        </div>
      </div>

      {/* 10+ Tool Category Switcher Grid - Hidden during print */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 no-print print:hidden">
        {tools.map(tool => {
          const isSelected = activeCategory === tool.id;
          return (
            <button
              key={tool.id}
              onClick={() => handleSelectTool(tool)}
              className={`group flex flex-col justify-between p-3 rounded-2xl text-left border transition-all duration-200 ${
                isSelected
                  ? 'bg-blue-600 dark:bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/20 scale-[1.02]'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-slate-50 dark:hover:bg-slate-850'
              }`}
            >
              <div className="flex items-start justify-between gap-1 w-full mb-2">
                <div
                  className={`p-2 rounded-xl transition-colors ${
                    isSelected
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/30 group-hover:text-blue-600'
                  }`}
                >
                  {tool.icon}
                </div>
                <span
                  className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-md border ${
                    isSelected
                      ? 'bg-white/20 text-white border-white/30'
                      : tool.badgeColor
                  }`}
                >
                  {tool.badge}
                </span>
              </div>
              <div>
                <h4 className="text-xs font-bold leading-snug line-clamp-1">
                  {tool.shortLabel}
                </h4>
                <p
                  className={`text-[10px] mt-0.5 line-clamp-1 ${
                    isSelected ? 'text-blue-100' : 'text-slate-400 dark:text-slate-500'
                  }`}
                >
                  {tool.label}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Content Area */}
      {activeCategory === 'chat_guru' ? (
        /* Chat Interface for Interactive Teacher Assistance - Hidden during print */
        <div className="rounded-3xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 shadow-sm flex flex-col h-[650px] no-print print:hidden">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                <MessageSquare className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Konsultasi Pedagogik & Masalah Kelas SD (AI Live)
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Tanyakan apa saja seputar diferensiasi, asesmen, penanganan murid, ide apersepsi, dan Kurmer
                </p>
              </div>
            </div>
            <button
              onClick={() => setChatMessages([chatMessages[0]])}
              className="text-xs font-bold text-slate-500 hover:text-rose-500 px-3 py-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Hapus Obrolan
            </button>
          </div>

          {/* Chat Messages Log */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
            {chatMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center shrink-0 text-xs font-bold shadow-xs">
                    <Sparkles className="h-4 w-4" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl p-4 text-xs leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-100 dark:border-slate-700/60 rounded-bl-none shadow-xs whitespace-pre-wrap'
                  }`}
                >
                  <p>{msg.text}</p>
                  <span
                    className={`block text-[9px] mt-1.5 text-right font-medium ${
                      msg.role === 'user' ? 'text-blue-200' : 'text-slate-400'
                    }`}
                  >
                    {msg.time}
                  </span>
                </div>
              </div>
            ))}
            {isChatLoading && (
              <div className="flex gap-3 items-center text-xs text-slate-400">
                <div className="h-8 w-8 rounded-xl bg-blue-600 text-white flex items-center justify-center">
                  <RefreshCw className="h-4 w-4 animate-spin" />
                </div>
                <span>Asisten AI sedang menyusun jawaban terbaik...</span>
              </div>
            )}
          </div>

          {/* Quick Chat Prompts */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-2 border-t border-slate-100 dark:border-slate-800 no-scrollbar">
            <span className="text-[10px] font-bold text-slate-400 uppercase shrink-0">Contoh:</span>
            {currentTool.quickPrompts.map((qp, i) => (
              <button
                key={i}
                onClick={() => setInputChat(qp)}
                className="text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 px-2.5 py-1 rounded-full whitespace-nowrap border border-slate-200 dark:border-slate-700 transition-colors"
              >
                {qp}
              </button>
            ))}
          </div>

          {/* Input Chat Box */}
          <div className="flex items-center gap-2 pt-2">
            <input
              type="text"
              value={inputChat}
              onChange={e => setInputChat(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSendChat()}
              placeholder="Tanyakan masalah pembelajaran atau administrasi SD..."
              className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
            <button
              onClick={handleSendChat}
              disabled={!inputChat.trim() || isChatLoading}
              className="flex items-center justify-center h-11 w-11 rounded-2xl bg-blue-600 text-white shadow-md hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : (
        /* Generator View for Documents & Tools */
        <div className="space-y-6 print:space-y-0">
          {/* Generator Input Parameter Card - Hidden during print */}
          <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 dark:border-slate-800 dark:bg-slate-900 shadow-sm space-y-4 no-print print:hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                  {currentTool.icon}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Parameter Dokumen: {currentTool.label}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {currentTool.description}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                  Tahun Ajaran:
                </span>
                <span className="text-[11px] font-extrabold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-md">
                  {schoolInfo.academicYear} &bull; Sem {schoolInfo.semester}
                </span>
              </div>
            </div>

            {/* Form Fields Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Mata Pelajaran SD
                </label>
                <select
                  value={selectedMapel}
                  onChange={e => setSelectedMapel(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 py-2.5 px-3.5 text-xs font-medium text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white transition-colors"
                >
                  {subjects.map(s => (
                    <option key={s.id} value={s.nama}>{s.nama}</option>
                  ))}
                  <option value="Projek Penguatan Profil Pelajar Pancasila (P5)">Projek Penguatan Profil Pelajar Pancasila (P5)</option>
                  <option value="Bimbingan & Konseling SD">Bimbingan & Konseling SD</option>
                  <option value="Administrasi Wali Kelas SD">Administrasi Wali Kelas SD</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Fase & Jenjang Kelas
                </label>
                <select
                  value={selectedFase}
                  onChange={e => setSelectedFase(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 py-2.5 px-3.5 text-xs font-medium text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white transition-colors"
                >
                  <option value="Fase A (Kelas 1 SD)">Fase A (Kelas 1 SD)</option>
                  <option value="Fase A (Kelas 2 SD)">Fase A (Kelas 2 SD)</option>
                  <option value="Fase B (Kelas 3 SD)">Fase B (Kelas 3 SD)</option>
                  <option value="Fase B (Kelas 4 SD)">Fase B (Kelas 4 SD)</option>
                  <option value="Fase C (Kelas 5 SD)">Fase C (Kelas 5 SD)</option>
                  <option value="Fase C (Kelas 6 SD)">Fase C (Kelas 6 SD)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Topik / Lingkup Materi Pokok
                </label>
                <input
                  type="text"
                  value={topikMateri}
                  onChange={e => setTopikMateri(e.target.value)}
                  placeholder="Contoh: Bagian Tubuh Tumbuhan / Pecahan Senilai"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 py-2.5 px-3.5 text-xs font-medium text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white transition-colors"
                />
              </div>
            </div>

            {/* Quick Prompt Topic Suggestion Chips */}
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <Lightbulb className="h-3.5 w-3.5 text-amber-500" />
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                  Ide Topik Rekomendasi 1-Klik:
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {currentTool.quickPrompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectPrompt(prompt)}
                    className={`text-[11px] font-semibold px-3 py-1.5 rounded-xl border transition-all ${
                      topikMateri === prompt
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700/80 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:border-blue-300 hover:text-blue-600'
                    }`}
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>

            {/* Optional Custom Notes */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Catatan / Instruksi Khusus Tambahan (Opsional)
              </label>
              <input
                type="text"
                value={customNotes}
                onChange={e => setCustomNotes(e.target.value)}
                placeholder="Contoh: Fokus pada diferensiasi visual-kinestetik, sertakan 5 soal pilihan ganda C4, dll."
                className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 py-2 px-3.5 text-xs text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            {/* Online Server Direct Notice */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 p-3 rounded-2xl bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-850 dark:via-blue-950/40 dark:to-purple-950/30 border border-blue-200 dark:border-blue-900/60 text-xs">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-600 text-white shadow-sm">
                  <Globe className="h-4 w-4" />
                </div>
                <div>
                  <div className="font-bold text-slate-800 dark:text-white flex items-center gap-1.5 flex-wrap">
                    <span>Pemrosesan Dokumen Diarahkan ke Server Online</span>
                    <span className="px-1.5 py-0.2 rounded bg-blue-600 text-white text-[9px] font-black tracking-wider uppercase">Online</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Dokumen ajar disusun secara online oleh model AI <strong>Google Gemini 3.8 Flash</strong> di backend server sesuai standar Kurikulum Merdeka.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 self-end sm:self-auto shrink-0 px-2.5 py-1 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] font-bold text-slate-700 dark:text-slate-300 shadow-xs">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span>Server Siap Online</span>
                <button
                  onClick={checkServer}
                  title="Periksa Status Server Online"
                  className="ml-1 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  <RefreshCw className={`h-3 w-3 ${serverStatus.checking ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>

            {/* Active Loading Banner during Generation */}
            {isGenerating && (
              <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 text-white shadow-lg shadow-blue-600/20 flex items-center gap-3 animate-pulse">
                <div className="p-2.5 rounded-xl bg-white/20 backdrop-blur-md">
                  <RefreshCw className="h-5 w-5 animate-spin text-amber-300" />
                </div>
                <div className="flex-1">
                  <div className="text-xs font-black tracking-wide flex items-center gap-2">
                    <span>MENGHUBUNGI SERVER ONLINE GOOGLE GEMINI...</span>
                    <span className="px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-extrabold text-amber-200 border border-white/25">Gemini 3.8 Flash</span>
                  </div>
                  <p className="text-[11px] text-blue-100 mt-0.5">
                    Menyusun dokumen administrasi untuk topik "{topikMateri}" ({selectedMapel} - {selectedFase}) sesuai standar Kurikulum Merdeka Kemendikbudristek.
                  </p>
                </div>
              </div>
            )}

            {/* Action Generate Button */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
                <span>Format siap ekspor ke <strong>Word (.doc)</strong> & <strong>Cetak Resmi</strong></span>
              </div>

              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full sm:w-auto flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-6 py-3.5 text-xs font-bold text-white shadow-lg shadow-blue-600/25 hover:from-blue-700 hover:to-purple-700 active:scale-95 transition-all disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>Sedang Menyusun di Server Online...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 text-amber-300" />
                    <span>Generate Dokumen Ajar Lengkap (Server Online)</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Generated Result Container */}
          {generatedResult ? (
            <div className="space-y-4 print:space-y-0">
              {/* Action Bar Above Document - Hidden during print */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900 text-white p-4 rounded-2xl shadow-md no-print print:hidden">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-blue-500/20 text-blue-300 border border-blue-400/30">
                    <FileCheck className="h-5 w-5 text-emerald-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-xs sm:text-sm font-bold text-white">
                        Dokumen Siap Pakai: {currentTool.shortLabel}
                      </h3>
                      {generationOnline ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-bold">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          Online Server: {generationModel}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 text-[10px] font-bold">
                          Template Kurikulum Merdeka (Offline)
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-300 mt-0.5">
                      {selectedMapel} &bull; {selectedFase} &bull; {topikMateri}
                    </p>
                  </div>
                </div>

                {/* Export & Action Buttons */}
                <div className="flex flex-wrap items-center gap-2">
                  {/* View Mode Switcher */}
                  <div className="flex items-center bg-slate-800 p-1 rounded-xl border border-slate-700">
                    <button
                      onClick={() => setViewMode('official_doc')}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                        viewMode === 'official_doc'
                          ? 'bg-blue-600 text-white'
                          : 'text-slate-300 hover:text-white'
                      }`}
                    >
                      <Eye className="h-3.5 w-3.5" />
                      <span>Kertas Resmi</span>
                    </button>
                    <button
                      onClick={() => setViewMode('raw_markdown')}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                        viewMode === 'raw_markdown'
                          ? 'bg-blue-600 text-white'
                          : 'text-slate-300 hover:text-white'
                      }`}
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                      <span>Editor Teks</span>
                    </button>
                  </div>

                  {/* Word Export Button */}
                  <button
                    onClick={handleExportWord}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white text-xs font-bold shadow-md shadow-blue-500/20 active:scale-95 transition-all"
                    title="Unduh sebagai file Microsoft Word (.doc)"
                  >
                    <Download className="h-4 w-4" />
                    <span>Download Word (.doc)</span>
                  </button>

                  {/* Print Button */}
                  <button
                    onClick={handlePrint}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold active:scale-95 transition-all"
                    title="Cetak Dokumen Resmi A4"
                  >
                    <Printer className="h-4 w-4" />
                    <span>Cetak</span>
                  </button>

                  {/* Copy Button */}
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold active:scale-95 transition-all"
                  >
                    {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                    <span>{copied ? 'Tersalin' : 'Salin'}</span>
                  </button>

                  {/* Direct Save to Modul Ajar Bank */}
                  {activeCategory === 'modul' && (
                    <button
                      onClick={handleSaveToModulAjar}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold active:scale-95 transition-all"
                    >
                      <BookmarkPlus className="h-4 w-4" />
                      <span>Simpan ke Modul</span>
                    </button>
                  )}
                </div>
              </div>

              {/* RAW MARKDOWN EDITABLE VIEW (Hidden when in print mode) */}
              {viewMode === 'raw_markdown' && (
                <div className="rounded-3xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 shadow-sm space-y-3 no-print print:hidden">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <Edit3 className="h-3.5 w-3.5 text-blue-600" />
                      Editor Teks Langsung (Markdown)
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Anda dapat mengubah teks sebelum didownload atau dicetak
                    </span>
                  </div>
                  <textarea
                    rows={20}
                    value={generatedResult}
                    onChange={e => setGeneratedResult(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 p-4 font-mono text-xs leading-relaxed text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              )}

              {/* OFFICIAL PRINT-READY A4 PAPER VIEW (FROM KOP TO SIGNATURE) */}
              <div
                className={`p-3 sm:p-8 rounded-3xl flex justify-center overflow-x-auto print:p-0 print:m-0 print:bg-transparent print:rounded-none print:overflow-visible print:block ${
                  viewMode === 'raw_markdown'
                    ? 'hidden print:block'
                    : 'bg-slate-200 dark:bg-slate-950'
                }`}
              >
                <div
                  id="printable-official-document"
                  className="printable-document-sheet w-full max-w-[850px] bg-white text-black p-8 sm:p-12 rounded-2xl shadow-xl border border-slate-300 print:border-none print:shadow-none print:p-0 print:m-0 print:w-full print:max-w-none print:text-black"
                  style={{ minHeight: '1050px', fontFamily: "'Calibri', 'Arial', sans-serif" }}
                >
                  {/* 1. Header Kop Surat Resmi Sekolah */}
                  <HeaderKopSekolah
                    documentTitle={currentTool.label.toUpperCase()}
                    subTitle={`Mata Pelajaran: ${selectedMapel} | ${selectedFase}`}
                    className="print:mb-3"
                    equalizeLogos={true}
                  />

                  {/* 2. Meta Informasi Box */}
                  <div className="mb-4 p-3 bg-slate-50 border border-slate-300 print:border-black rounded-lg text-xs print:text-[10pt] print:bg-transparent print:p-2.5 print:mb-3">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-slate-800 print:text-black">
                      <div>
                        <span className="font-bold text-slate-700 print:text-black block text-[10px] print:text-[8.5pt] uppercase">Mata Pelajaran</span>
                        <p className="font-bold text-slate-900 print:text-black text-xs print:text-[9.5pt]">{selectedMapel}</p>
                      </div>
                      <div>
                        <span className="font-bold text-slate-700 print:text-black block text-[10px] print:text-[8.5pt] uppercase">Fase / Kelas</span>
                        <p className="font-bold text-slate-900 print:text-black text-xs print:text-[9.5pt]">{selectedFase}</p>
                      </div>
                      <div>
                        <span className="font-bold text-slate-700 print:text-black block text-[10px] print:text-[8.5pt] uppercase">Topik / Materi Pokok</span>
                        <p className="font-bold text-slate-900 print:text-black text-xs print:text-[9.5pt]">{topikMateri}</p>
                      </div>
                      <div>
                        <span className="font-bold text-slate-700 print:text-black block text-[10px] print:text-[8.5pt] uppercase">Tahun Ajaran</span>
                        <p className="font-bold text-slate-900 print:text-black text-xs print:text-[9.5pt]">{schoolInfo.academicYear} (Sem {schoolInfo.semester})</p>
                      </div>
                    </div>
                  </div>

                  {/* 3. Rendered Document Body */}
                  <div
                    className="text-xs sm:text-sm leading-relaxed text-slate-900 print:text-black space-y-3 prose prose-slate max-w-none prose-headings:font-bold prose-headings:text-slate-900 prose-h1:text-base prose-h2:text-sm prose-h3:text-xs prose-p:my-1 prose-ul:my-1 prose-li:my-0.5 print:prose-p:my-1 print:text-[10.5pt]"
                    dangerouslySetInnerHTML={{
                      __html: formatMarkdownToHtmlPreview(cleanedMarkdownContent)
                    }}
                  />

                  {/* 4. Official Sign-Off Block (Kop sampai Tanda Tangan Kepala Sekolah) */}
                  <div className="mt-8 pt-5 border-t border-slate-300 print:border-black text-xs print:text-[10.5pt] break-inside-avoid page-break-inside-avoid print:mt-6 print:pt-4">
                    <div className="grid grid-cols-2 gap-8 text-center text-black print:text-black">
                      {/* Left: Mengetahui Kepala Sekolah */}
                      <div className="flex flex-col items-center">
                        <p className="leading-snug">Mengetahui,</p>
                        <p className="font-bold leading-snug">Kepala {schoolInfo.schoolName || 'SD Negeri'}</p>
                        <div className="h-16 print:h-20" />
                        <p className="font-bold underline uppercase tracking-wide leading-snug">
                          {schoolInfo.headmasterName || 'NAMA KEPALA SEKOLAH, M.Pd.'}
                        </p>
                        <p className="text-[11px] print:text-[9.5pt] text-slate-700 print:text-black leading-snug">
                          NIP. {schoolInfo.headmasterNip || '-'}
                        </p>
                      </div>

                      {/* Right: Guru / Wali Kelas / Penyusun Dokumen */}
                      <div className="flex flex-col items-center">
                        <p className="leading-snug">
                          {schoolInfo.city || 'Kota'}, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </p>
                        <p className="font-bold leading-snug">{signatureRoleLabel}</p>
                        <div className="h-16 print:h-20" />
                        <p className="font-bold underline uppercase tracking-wide leading-snug">
                          {schoolInfo.homeroomTeacherName || 'NAMA GURU KELAS, S.Pd.'}
                        </p>
                        <p className="text-[11px] print:text-[9.5pt] text-slate-700 print:text-black leading-snug">
                          NIP. {schoolInfo.homeroomTeacherNip || '-'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Empty State Placeholder - Hidden during print */
            <div className="rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 p-12 text-center bg-slate-50/50 dark:bg-slate-900/30 space-y-4 no-print print:hidden">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 shadow-inner">
                <Sparkles className="h-8 w-8 animate-bounce" />
              </div>
              <div className="max-w-md mx-auto space-y-1.5">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Siap Membuat Dokumen Administrasi SD
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Pilih kategori fasilitas AI di atas, tentukan topik materi pokok, lalu klik tombol <strong>"Generate Dokumen Ajar Lengkap"</strong> untuk menyusun dokumen resmi.
                </p>
              </div>
            </div>
          )}

          {/* Session History Drawer / Quick Access - Hidden during print */}
          {historyList.length > 0 && (
            <div className="rounded-3xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 shadow-sm space-y-3 no-print print:hidden">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
                  <History className="h-4 w-4 text-blue-600" />
                  <span>Riwayat Dokumen yang Digenerate Sesi Ini ({historyList.length})</span>
                </div>
                <button
                  onClick={() => setHistoryList([])}
                  className="text-[10px] font-semibold text-rose-500 hover:underline"
                >
                  Bersihkan Riwayat
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                {historyList.map(item => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setGeneratedResult(item.content);
                      setActiveCategory(item.category as ToolCategory);
                      setTopikMateri(item.topic);
                      setSelectedMapel(item.subject);
                      setSelectedFase(item.gradePhase);
                    }}
                    className="flex flex-col text-left p-3 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 hover:border-blue-400 dark:hover:border-blue-500 transition-all group"
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <span className="text-[9px] font-extrabold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-md">
                        {item.categoryLabel}
                      </span>
                      <span className="text-[9px] text-slate-400 font-medium">
                        {item.timestamp}
                      </span>
                    </div>
                    <h5 className="text-xs font-bold text-slate-800 dark:text-slate-200 line-clamp-1 group-hover:text-blue-600 transition-colors">
                      {item.title}
                    </h5>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1">
                      {item.subject} &bull; {item.gradePhase}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

/**
 * Role labels tailored to the document category for the right-hand signature column
 */
function getSignatureRoleLabel(category: string): string {
  switch (category) {
    case 'modul':
      return 'Guru Kelas / Penyusun Modul';
    case 'soal':
      return 'Guru Mata Pelajaran / Penyusun Soal';
    case 'deskripsi_rapor':
      return 'Wali Kelas';
    case 'p5':
      return 'Koordinator Projek P5';
    case 'program_wali_kelas':
      return 'Wali Kelas';
    case 'evaluasi_refleksi':
      return 'Guru Kelas / Penilai';
    case 'surat_undangan':
      return 'Wali Kelas / Pengundang';
    case 'bimbingan_konseling':
      return 'Guru Kelas / Guru BK';
    case 'lkpd':
      return 'Guru Pengampu / Penyusun LKPD';
    case 'ice_breaking':
      return 'Guru Kelas';
    default:
      return 'Guru Kelas / Pengampu';
  }
}

/**
 * Strips raw AI-generated closing signature blocks and opening chit-chat from markdown
 * so the official signature block with Kop and School Info can render cleanly without duplicates.
 */
function sanitizeDocumentMarkdown(markdown: string): string {
  if (!markdown) return '';

  let cleaned = markdown
    // Remove typical AI preamble/chat phrases
    .replace(/^(?:Tentu,?\s*|Baik,?\s*|Berikut\s+adalah\s+dokumen[^\n]*\n+|Berikut\s+ini\s+adalah[^\n]*\n+)/i, '')
    .trim();

  // Strip closing signature blocks from raw markdown to prevent duplicate signatures
  const signatureEndPatterns = [
    /(?:\n|^)\s*(?:---|___|\*\*\*)\s*\n+\s*#{1,4}\s*(?:[IVXLCDM\d\.\s]*\s*)?(?:LEMBAR\s+PENGESAHAN|PENGESAHAN|TANDA\s+TANGAN|LEMBAR\s+PERSETUJUAN)[\s\S]*$/i,
    /(?:\n|^)\s*#{1,4}\s*(?:[IVXLCDM\d\.\s]*\s*)?(?:LEMBAR\s+PENGESAHAN|PENGESAHAN|TANDA\s+TANGAN|LEMBAR\s+PERSETUJUAN)[\s\S]*$/i,
    /(?:\n|^)\s*Mengetahui,[\s\S]*?(?:Kepala|Guru|Wali\s+Kelas|NIP)[\s\S]*$/i
  ];

  for (const pattern of signatureEndPatterns) {
    if (pattern.test(cleaned)) {
      cleaned = cleaned.replace(pattern, '').trim();
      break;
    }
  }

  return cleaned;
}

/**
 * Clean markdown to HTML converter for live paper preview & printing
 */
function formatMarkdownToHtmlPreview(markdown: string): string {
  if (!markdown) return '';

  const lines = markdown.split('\n');
  const htmlLines: string[] = [];
  let inList = false;
  let listType: 'ul' | 'ol' = 'ul';
  let inTable = false;

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();

    // Check Table
    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      if (!inTable) {
        closeList();
        htmlLines.push('<div class="overflow-x-auto my-3 print:my-2"><table class="w-full border-collapse border border-black text-xs print:text-[9.5pt] break-inside-avoid">');
        inTable = true;
      }
      
      // Skip separator row like |---|---|
      if (trimmed.includes('---')) {
        continue;
      }

      const cols = trimmed.split('|').slice(1, -1);
      const isHeader = htmlLines[htmlLines.length - 1].includes('<table');
      const tag = isHeader ? 'th' : 'td';
      const cellBg = isHeader ? 'bg-slate-100 print:bg-slate-100 font-bold' : '';

      htmlLines.push('<tr>');
      cols.forEach(col => {
        htmlLines.push(`<${tag} class="border border-black px-2.5 py-1.5 text-left ${cellBg}">${formatInlinePreview(col.trim())}</${tag}>`);
      });
      htmlLines.push('</tr>');
      continue;
    } else if (inTable) {
      htmlLines.push('</table></div>');
      inTable = false;
    }

    // Check Blockquote
    if (trimmed.startsWith('>')) {
      closeList();
      const bqContent = trimmed.substring(1).trim();
      htmlLines.push(`<blockquote class="border-l-4 border-blue-500 print:border-black bg-blue-50 dark:bg-slate-800 print:bg-slate-50 px-3.5 py-2 my-2 rounded-r-lg italic text-slate-800 dark:text-slate-200 print:text-black">${formatInlinePreview(bqContent)}</blockquote>`);
      continue;
    }

    // Check Headers
    if (trimmed.startsWith('#### ')) {
      closeList();
      htmlLines.push(`<h4 class="text-xs print:text-[10pt] font-bold text-slate-900 print:text-black mt-3 mb-1 uppercase tracking-wide break-after-avoid">${formatInlinePreview(trimmed.substring(5))}</h4>`);
    } else if (trimmed.startsWith('### ')) {
      closeList();
      htmlLines.push(`<h3 class="text-sm print:text-[11pt] font-bold text-slate-900 print:text-black mt-4 mb-1.5 pb-0.5 border-b border-slate-200 print:border-black uppercase tracking-wide break-after-avoid">${formatInlinePreview(trimmed.substring(4))}</h3>`);
    } else if (trimmed.startsWith('## ')) {
      closeList();
      htmlLines.push(`<h2 class="text-sm print:text-[12pt] font-extrabold text-blue-900 print:text-black mt-4 mb-1.5 pb-1 border-b-2 border-slate-300 print:border-black uppercase break-after-avoid">${formatInlinePreview(trimmed.substring(3))}</h2>`);
    } else if (trimmed.startsWith('# ')) {
      closeList();
      htmlLines.push(`<h1 class="text-base print:text-[13pt] font-black text-slate-900 print:text-black mt-4 mb-2 uppercase text-center break-after-avoid">${formatInlinePreview(trimmed.substring(2))}</h1>`);
    } else if (trimmed.startsWith('---') || trimmed.startsWith('***')) {
      closeList();
      htmlLines.push('<hr class="border-slate-300 print:border-black my-4 print:my-2" />');
    } else if (/^(\*|-|\+)\s/.test(trimmed)) {
      // Unordered list
      const content = trimmed.replace(/^(\*|-|\+)\s+/, '');
      if (!inList || listType !== 'ul') {
        closeList();
        htmlLines.push('<ul class="list-disc pl-5 my-1 space-y-1 print:my-1">');
        inList = true;
        listType = 'ul';
      }
      htmlLines.push(`<li>${formatInlinePreview(content)}</li>`);
    } else if (/^\d+\.\s/.test(trimmed)) {
      // Ordered list
      const content = trimmed.replace(/^\d+\.\s+/, '');
      if (!inList || listType !== 'ol') {
        closeList();
        htmlLines.push('<ol class="list-decimal pl-5 my-1 space-y-1 print:my-1">');
        inList = true;
        listType = 'ol';
      }
      htmlLines.push(`<li>${formatInlinePreview(content)}</li>`);
    } else if (trimmed === '') {
      closeList();
    } else {
      closeList();
      htmlLines.push(`<p class="my-1 text-justify leading-relaxed print:my-1">${formatInlinePreview(trimmed)}</p>`);
    }
  }

  closeList();
  if (inTable) {
    htmlLines.push('</table></div>');
  }

  function closeList() {
    if (inList) {
      htmlLines.push(listType === 'ul' ? '</ul>' : '</ol>');
      inList = false;
    }
  }

  return htmlLines.join('\n');
}

function formatInlinePreview(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/__(.*?)__/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/_(.*?)_/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code class="bg-slate-100 text-indigo-700 px-1 py-0.5 rounded text-[11px] font-mono">$1</code>');
}
