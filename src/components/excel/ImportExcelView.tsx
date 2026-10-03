import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import {
  FileSpreadsheet,
  Download,
  Upload,
  CheckCircle2,
  AlertTriangle,
  FileUp,
  RefreshCw,
  Users,
  UserCheck,
  GraduationCap,
  CalendarCheck,
  CalendarDays,
  WalletCards,
  Boxes,
  Target,
  Sparkles,
  Info,
  Layers,
  ArrowRight,
  Database,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  downloadWorkbook,
  generateStudentTemplate,
  generateTeacherTemplate,
  generateGradeTemplate,
  generateAttendanceTemplate,
  generateCashTemplate,
  generateInventoryTemplate,
  generateScheduleTemplate,
  generateTPTemplate,
  exportAllDataToExcel,
  parseExcelFile,
  findStudentWorksheet,
  findTeacherWorksheet,
  findGradeWorksheet,
  findTPWorksheet,
  findCashWorksheet,
  findInventoryWorksheet,
  findAttendanceWorksheet,
  findScheduleWorksheet,
  parseStudentsFromSheet,
  parseTeachersFromSheet,
  parseGradesFromSheet,
  parseTPFromSheet,
  parseCashFromSheet,
  parseInventoryFromSheet,
  parseAttendanceFromSheet,
  parseScheduleFromSheet
} from '../../utils/excelHelper';
import { Student, Teacher, GradeRecord, CashTransaction, InventoryItem, TujuanPembelajaran, AttendanceRecord, ScheduleItem } from '../../types';
import { syncTeacher, syncGrade, syncTransaction, syncInventoryItem } from '../../services/firestoreSync';

type ImportCategory = 
  | 'siswa' 
  | 'guru' 
  | 'nilai' 
  | 'presensi' 
  | 'jadwal' 
  | 'kas' 
  | 'inventaris' 
  | 'tp';

export const ImportExcelView: React.FC = () => {
  const {
    students,
    teachers,
    subjects,
    grades,
    cashTransactions,
    inventory,
    schedule,
    tujuanPembelajaranList,
    schoolInfo,
    attendanceRecords,
    addToast,
    bulkImportStudents,
    bulkImportTeachers,
    bulkImportGrades,
    bulkImportTP,
    bulkImportAttendance,
    bulkImportSchedule,
    bulkImportCash,
    bulkImportInventory,
    setCurrentTab
  } = useApp();

  const [activeCategory, setActiveCategory] = useState<ImportCategory>('siswa');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('');
  const [importMode, setImportMode] = useState<'append' | 'replace'>('append');
  const [isParsing, setIsParsing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [parsedFileName, setParsedFileName] = useState<string | null>(null);
  const [importSuccessNotice, setImportSuccessNotice] = useState<{ count: number; category: string } | null>(null);
  
  // Parsed Preview States
  const [parsedData, setParsedData] = useState<any[] | null>(null);
  const [companionTPData, setCompanionTPData] = useState<TujuanPembelajaran[] | null>(null);
  const [companionGradesData, setCompanionGradesData] = useState<GradeRecord[] | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [totalRows, setTotalRows] = useState(0);
  const [validRows, setValidRows] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories: Array<{
    id: ImportCategory;
    title: string;
    description: string;
    icon: React.ReactNode;
    color: string;
    activeBg: string;
    currentCount: number;
  }> = [
    {
      id: 'siswa',
      title: 'Data Siswa & Induk',
      description: 'NISN, NIS, nama siswa, JK, orang tua, alamat, kelas',
      icon: <Users className="h-5 w-5" />,
      color: 'text-blue-500',
      activeBg: 'bg-blue-50 dark:bg-blue-950/40 border-blue-500 text-blue-700 dark:text-blue-300',
      currentCount: students.length
    },
    {
      id: 'guru',
      title: 'Data Guru & Tendik',
      description: 'NIP, NUPTK, nama guru, jabatan, status kepegawaian',
      icon: <UserCheck className="h-5 w-5" />,
      color: 'text-purple-500',
      activeBg: 'bg-purple-50 dark:bg-purple-950/40 border-purple-500 text-purple-700 dark:text-purple-300',
      currentCount: teachers.length
    },
    {
      id: 'nilai',
      title: 'Daftar Nilai Siswa',
      description: 'Formatif TP 1-4, Sumatif STS & SAS per mata pelajaran',
      icon: <GraduationCap className="h-5 w-5" />,
      color: 'text-emerald-500',
      activeBg: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-700 dark:text-emerald-300',
      currentCount: grades.length
    },
    {
      id: 'presensi',
      title: 'Presensi Harian',
      description: 'Rekap kehadiran siswa (Hadir, Sakit, Izin, Alpa)',
      icon: <CalendarCheck className="h-5 w-5" />,
      color: 'text-amber-500',
      activeBg: 'bg-amber-50 dark:bg-amber-950/40 border-amber-500 text-amber-700 dark:text-amber-300',
      currentCount: attendanceRecords.length
    },
    {
      id: 'jadwal',
      title: 'Jadwal Pelajaran',
      description: 'Hari, jam pelajaran, mata pelajaran, guru pengampu',
      icon: <CalendarDays className="h-5 w-5" />,
      color: 'text-indigo-500',
      activeBg: 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-500 text-indigo-700 dark:text-indigo-300',
      currentCount: schedule.length
    },
    {
      id: 'kas',
      title: 'Buku Kas & Iuran',
      description: 'Pemasukan, pengeluaran, iuran kas siswa mingguan',
      icon: <WalletCards className="h-5 w-5" />,
      color: 'text-teal-500',
      activeBg: 'bg-teal-50 dark:bg-teal-950/40 border-teal-500 text-teal-700 dark:text-teal-300',
      currentCount: cashTransactions.length
    },
    {
      id: 'inventaris',
      title: 'Inventaris Kelas (KIR)',
      description: 'Daftar sarana prasarana, kode barang, kondisi & jumlah',
      icon: <Boxes className="h-5 w-5" />,
      color: 'text-rose-500',
      activeBg: 'bg-rose-50 dark:bg-rose-950/40 border-rose-500 text-rose-700 dark:text-rose-300',
      currentCount: inventory.length
    },
    {
      id: 'tp',
      title: 'Tujuan Pembelajaran',
      description: 'Rumusan TP Kurikulum Merdeka, lingkup materi, KKTP',
      icon: <Target className="h-5 w-5" />,
      color: 'text-cyan-500',
      activeBg: 'bg-cyan-50 dark:bg-cyan-950/40 border-cyan-500 text-cyan-700 dark:text-cyan-300',
      currentCount: tujuanPembelajaranList.length
    }
  ];

  // 1. Download Template Handler
  const handleDownloadTemplate = () => {
    try {
      let wb;
      const subObj = subjects.find(s => s.id === selectedSubjectId);
      const subSuffix = (activeCategory === 'nilai' || activeCategory === 'tp') && subObj ? `_${subObj.kode}` : '';
      let filename = `Template_Import_${activeCategory.toUpperCase()}${subSuffix}_SD_Merdeka_${schoolInfo.className.replace(/\s+/g, '_')}.xlsx`;

      switch (activeCategory) {
        case 'siswa':
          wb = generateStudentTemplate(subjects);
          break;
        case 'guru':
          wb = generateTeacherTemplate();
          break;
        case 'nilai':
          wb = generateGradeTemplate(students, subjects, selectedSubjectId || undefined, tujuanPembelajaranList);
          break;
        case 'presensi':
          wb = generateAttendanceTemplate(students, new Date().toISOString().split('T')[0]);
          break;
        case 'jadwal':
          wb = generateScheduleTemplate(subjects);
          break;
        case 'kas':
          wb = generateCashTemplate();
          break;
        case 'inventaris':
          wb = generateInventoryTemplate();
          break;
        case 'tp':
          wb = generateTPTemplate(subjects, selectedSubjectId || undefined, tujuanPembelajaranList);
          break;
        default:
          wb = generateStudentTemplate(subjects);
      }

      downloadWorkbook(wb, filename);
      addToast(
        'success',
        'Template Excel Berhasil Diunduh',
        `File ${filename} siap diisi di Microsoft Excel atau Google Spreadsheet.`
      );
    } catch (error) {
      console.error(error);
      addToast('error', 'Gagal Mengunduh', 'Terjadi kesalahan saat membuat template Excel.');
    }
  };

  // 2. Export Current Live Data to Excel
  const handleExportAllToExcel = () => {
    try {
      const wb = exportAllDataToExcel(
        students,
        teachers,
        subjects,
        grades,
        cashTransactions,
        inventory,
        schedule,
        tujuanPembelajaranList
      );
      const filename = `Master_Data_Administrasi_Kelas_${schoolInfo.className.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.xlsx`;
      downloadWorkbook(wb, filename);
      addToast('success', 'Ekspor Excel Berhasil', `Seluruh data tersimpan dalam file ${filename}.`);
    } catch (error) {
      console.error(error);
      addToast('error', 'Gagal Ekspor', 'Terjadi kesalahan saat mengekspor data ke Excel.');
    }
  };

  // 3. Handle File Upload & Parse
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setParsedFileName(file.name);
    setIsParsing(true);
    setValidationErrors([]);
    setParsedData(null);
    setCompanionTPData(null);
    setCompanionGradesData(null);

    try {
      const wb = await parseExcelFile(file);

      let result: { data: any[]; errors: string[]; totalRows: number; validRows: number } = {
        data: [],
        errors: [],
        totalRows: 0,
        validRows: 0
      };

      if (activeCategory === 'siswa') {
        const found = findStudentWorksheet(wb);
        const ws = found ? found.ws : wb.Sheets[wb.SheetNames[0]];
        if (!ws) throw new Error('Lembar sheet Excel Siswa tidak ditemukan.');
        result = parseStudentsFromSheet(ws, schoolInfo.className);
      } else if (activeCategory === 'guru') {
        const found = findTeacherWorksheet(wb);
        const ws = found ? found.ws : wb.Sheets[wb.SheetNames[0]];
        if (!ws) throw new Error('Lembar sheet Excel Guru & Tendik tidak ditemukan.');
        result = parseTeachersFromSheet(ws);
      } else if (activeCategory === 'nilai') {
        // Intelligently find grade worksheet
        const gradeFound = findGradeWorksheet(wb);
        const gradeWs = gradeFound ? gradeFound.ws : wb.Sheets[wb.SheetNames[0]];
        if (!gradeWs) throw new Error('Lembar sheet Nilai tidak ditemukan dalam file Excel.');
        result = parseGradesFromSheet(gradeWs, students, subjects, selectedSubjectId || undefined);

        // Also check if workbook contains TP sheet
        const tpFound = findTPWorksheet(wb);
        if (tpFound && tpFound.ws !== gradeWs) {
          const tpRes = parseTPFromSheet(tpFound.ws, subjects, selectedSubjectId || undefined);
          if (tpRes.validRows > 0) {
            setCompanionTPData(tpRes.data);
          }
        }
      } else if (activeCategory === 'tp') {
        // Intelligently find TP worksheet
        const tpFound = findTPWorksheet(wb);
        const tpWs = tpFound ? tpFound.ws : wb.Sheets[wb.SheetNames[0]];
        if (!tpWs) throw new Error('Lembar sheet Tujuan Pembelajaran (TP) tidak ditemukan dalam file Excel.');
        result = parseTPFromSheet(tpWs, subjects, selectedSubjectId || undefined);

        // Also check if workbook contains grade sheet
        const gradeFound = findGradeWorksheet(wb);
        if (gradeFound && gradeFound.ws !== tpWs) {
          const gradeRes = parseGradesFromSheet(gradeFound.ws, students, subjects, selectedSubjectId || undefined);
          if (gradeRes.validRows > 0) {
            setCompanionGradesData(gradeRes.data);
          }
        }
      } else if (activeCategory === 'presensi') {
        const found = findAttendanceWorksheet(wb);
        const ws = found ? found.ws : wb.Sheets[wb.SheetNames[0]];
        if (!ws) throw new Error('Lembar sheet Presensi tidak ditemukan dalam file Excel.');
        result = parseAttendanceFromSheet(ws, students);
      } else if (activeCategory === 'jadwal') {
        const found = findScheduleWorksheet(wb);
        const ws = found ? found.ws : wb.Sheets[wb.SheetNames[0]];
        if (!ws) throw new Error('Lembar sheet Jadwal Pelajaran tidak ditemukan dalam file Excel.');
        result = parseScheduleFromSheet(ws, subjects);
      } else if (activeCategory === 'kas') {
        const found = findCashWorksheet(wb);
        const ws = found ? found.ws : wb.Sheets[wb.SheetNames[0]];
        if (!ws) throw new Error('Lembar sheet Kas Kelas tidak ditemukan dalam file Excel.');
        result = parseCashFromSheet(ws);
      } else if (activeCategory === 'inventaris') {
        const found = findInventoryWorksheet(wb);
        const ws = found ? found.ws : wb.Sheets[wb.SheetNames[0]];
        if (!ws) throw new Error('Lembar sheet Inventaris tidak ditemukan dalam file Excel.');
        result = parseInventoryFromSheet(ws);
      } else {
        const ws = wb.Sheets[wb.SheetNames[0]];
        result = parseStudentsFromSheet(ws, schoolInfo.className);
      }

      setParsedData(result.data);
      setValidationErrors(result.errors);
      setTotalRows(result.totalRows);
      setValidRows(result.validRows);

      if (result.validRows > 0) {
        addToast(
          'info',
          'File Excel Berhasil Dibaca',
          `Ditemukan ${result.validRows} data valid dari total ${result.totalRows} baris.`
        );
      } else {
        addToast(
          'warning',
          'Tidak Ada Data Valid',
          'Format kolom tidak cocok dengan template. Pastikan menggunakan template resmi.'
        );
      }
    } catch (err: any) {
      console.error(err);
      addToast('error', 'Gagal Membaca File', err.message || 'File Excel rusak atau format tidak didukung.');
    } finally {
      setIsParsing(false);
    }
  };

  // 4. Save Parsed Data into Context / Firestore
  const handleSaveImportedData = async () => {
    if (!parsedData || parsedData.length === 0) return;

    setIsSubmitting(true);
    const count = parsedData.length;
    try {
      if (activeCategory === 'siswa') {
        bulkImportStudents(parsedData as Student[], importMode);
      } else if (activeCategory === 'guru') {
        bulkImportTeachers(parsedData as Teacher[], importMode);
      } else if (activeCategory === 'nilai') {
        bulkImportGrades(parsedData as GradeRecord[], importMode);
        if (companionTPData && companionTPData.length > 0) {
          bulkImportTP(companionTPData, importMode);
        }
      } else if (activeCategory === 'tp') {
        bulkImportTP(parsedData as TujuanPembelajaran[], importMode);
        if (companionGradesData && companionGradesData.length > 0) {
          bulkImportGrades(companionGradesData, importMode);
        }
      } else if (activeCategory === 'presensi') {
        bulkImportAttendance(parsedData as AttendanceRecord[], importMode);
      } else if (activeCategory === 'jadwal') {
        bulkImportSchedule(parsedData as ScheduleItem[], importMode);
      } else if (activeCategory === 'kas') {
        bulkImportCash(parsedData as CashTransaction[], importMode);
      } else if (activeCategory === 'inventaris') {
        bulkImportInventory(parsedData as InventoryItem[], importMode);
      }

      // Celebrate
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });

      setImportSuccessNotice({ count, category: activeCategory });

      addToast(
        'success',
        'Import Excel Berhasil Disimpan!',
        `Sebanyak ${count} data ${activeCategory.toUpperCase()} telah berhasil diimpor ke sistem.`
      );

      // Reset preview state
      setParsedData(null);
      setParsedFileName(null);
      setValidationErrors([]);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err: any) {
      console.error(err);
      addToast('error', 'Gagal Menyimpan', err.message || 'Terjadi kesalahan saat menyimpan data import.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedCategoryObj = categories.find(c => c.id === activeCategory)!;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Banner & Header */}
      <div className="rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-blue-700/40">
        <div className="absolute right-0 top-0 -mt-8 -mr-8 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-bold mb-3">
              <FileSpreadsheet className="h-3.5 w-3.5" />
              <span>Modul Import & Template Excel Resmi (.xlsx)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Pusat Import & Template Excel
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              Unduh format template Excel resmi, isi data offline di laptop/komputer, dan unggah langsung ke sistem kelas dengan verifikasi data otomatis dan sinkronisasi cloud.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleExportAllToExcel}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Download className="h-4 w-4 text-emerald-300" />
              <span>Download Master Data (.xlsx)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Category Grid Navigation */}
      <div>
        <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 px-1">
          1. Pilih Jenis Data Yang Akan Di-Import / Diunduh Templatenya
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-3">
          {categories.map((cat) => {
            const isSelected = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCategory(cat.id);
                  setParsedData(null);
                  setParsedFileName(null);
                  setValidationErrors([]);
                  if (fileInputRef.current) fileInputRef.current.value = '';
                }}
                className={`flex flex-col text-left p-4 rounded-2xl border transition-all duration-200 relative ${
                  isSelected
                    ? `${cat.activeBg} shadow-md ring-2 ring-blue-500/20`
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-2">
                  <div className={`p-2 rounded-xl ${isSelected ? 'bg-white/80 dark:bg-slate-800' : 'bg-slate-100 dark:bg-slate-800'}`}>
                    <span className={cat.color}>{cat.icon}</span>
                  </div>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                    {cat.currentCount} data
                  </span>
                </div>
                <h3 className="text-xs font-bold truncate">{cat.title}</h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                  {cat.description}
                </p>
                {isSelected && (
                  <div className="absolute top-2 right-2 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Import Success Banner */}
      {importSuccessNotice && (
        <div className="rounded-2xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 p-5 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-emerald-500 text-white shrink-0 mt-0.5 sm:mt-0">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-emerald-900 dark:text-emerald-200">
                  Data Berhasil Diimpor ke Sistem!
                </h3>
                <p className="text-xs text-emerald-700 dark:text-emerald-300/90 mt-0.5">
                  Sebanyak <strong>{importSuccessNotice.count}</strong> data {importSuccessNotice.category === 'siswa' ? 'siswa telah berhasil tersimpan ke dalam Data Siswa & Buku Induk' : importSuccessNotice.category === 'nilai' ? 'nilai telah berhasil tersimpan ke Daftar Nilai & Rapor' : importSuccessNotice.category === 'tp' ? 'Tujuan Pembelajaran telah tersimpan ke sistem TP & Asesmen' : `telah berhasil tersimpan ke dalam kategori ${importSuccessNotice.category}`}.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 self-end sm:self-center">
              {importSuccessNotice.category === 'siswa' && (
                <button
                  onClick={() => setCurrentTab('siswa')}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-all active:scale-95 cursor-pointer"
                >
                  <span>Buka Data Siswa & Buku Induk</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              )}
              {(importSuccessNotice.category === 'nilai' || importSuccessNotice.category === 'tp') && (
                <button
                  onClick={() => setCurrentTab('nilai')}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-all active:scale-95 cursor-pointer"
                >
                  <GraduationCap className="h-4 w-4" />
                  <span>Buka Daftar Nilai & TP</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              )}
              <button
                onClick={() => setImportSuccessNotice(null)}
                className="px-3 py-2 rounded-xl border border-emerald-300 dark:border-emerald-800 text-xs font-medium text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100/50 dark:hover:bg-emerald-900/40 transition-all cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Action Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Download Template & Guidelines */}
        <div className="lg:col-span-5 space-y-6">
          {/* Card: Download Template */}
          <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                <Download className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Unduh Template Resmi
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Format Excel {selectedCategoryObj.title}
                </p>
              </div>
            </div>

            {(activeCategory === 'nilai' || activeCategory === 'tp') && (
              <div className="mb-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Pilih Mata Pelajaran:
                </label>
                <select
                  value={selectedSubjectId}
                  onChange={(e) => setSelectedSubjectId(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">-- Semua Mata Pelajaran --</option>
                  {subjects.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.kode} - {s.nama} (KKTP: {s.kktp})
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  Template akan memuat format lengkap sesuai mata pelajaran terpilih.
                </p>
              </div>
            )}

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 space-y-2 mb-4">
              <div className="flex items-center gap-2 font-semibold text-slate-800 dark:text-slate-200">
                <Sparkles className="h-4 w-4 text-amber-500" />
                <span>Fitur Template Otomatis:</span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-500 dark:text-slate-400 pl-1">
                <li>Kolom tersusun rapi dengan lebar kolom presisi</li>
                <li>Sudah dilengkapi contoh baris data realistis</li>
                <li>Dilengkapi lembar panduan pengisian kolom</li>
                <li>Kompatibel dengan MS Excel, WPS Office & Google Sheets</li>
              </ul>
            </div>

            <button
              onClick={handleDownloadTemplate}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
            >
              <Download className="h-4 w-4" />
              <span>Download Template {selectedCategoryObj.title} (.xlsx)</span>
            </button>
          </div>

          {/* Card: Important Guidelines */}
          <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
            <div className="flex items-center gap-2.5 text-slate-800 dark:text-slate-200 font-bold text-xs mb-3">
              <Info className="h-4 w-4 text-blue-500" />
              <span>Panduan & Syarat Pengisian:</span>
            </div>
            
            <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400 text-[11px]">
              <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 text-amber-800 dark:text-amber-300 flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>
                  Jangan mengubah atau menghapus <strong>Nama Kolom pada Baris 1 (Header)</strong> agar sistem dapat memetakan data dengan benar.
                </span>
              </div>
              <p className="leading-relaxed">
                • <strong>Format Tanggal</strong>: Gunakan format standar <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded text-blue-600">YYYY-MM-DD</code> (contoh: <code>2015-05-12</code>).
              </p>
              <p className="leading-relaxed">
                • <strong>Jenis Kelamin</strong>: Cukup ketik <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">L</code> untuk Laki-laki atau <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">P</code> untuk Perempuan.
              </p>
              <p className="leading-relaxed">
                • <strong>Nilai Siswa</strong>: Masukkan angka bulat antara <code>0 - 100</code>.
              </p>
              <p className="leading-relaxed">
                • <strong>Presensi</strong>: Pilihan status yang diakui: <code className="text-emerald-600">Hadir</code>, <code className="text-amber-600">Sakit</code>, <code className="text-blue-600">Izin</code>, atau <code className="text-rose-600">Alpa</code>.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Upload Zone & Preview */}
        <div className="lg:col-span-7 space-y-6">
          {/* Card: Upload Area */}
          <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                  <FileUp className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    2. Unggah File Excel Yang Telah Diisi
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Mendukung format .xlsx, .xls, dan .csv
                  </p>
                </div>
              </div>

              {/* Mode Switcher */}
              <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs">
                <button
                  type="button"
                  onClick={() => setImportMode('append')}
                  className={`px-3 py-1 rounded-lg font-bold transition-all ${
                    importMode === 'append'
                      ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-300 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                  }`}
                  title="Menambahkan data baru dan memperbarui data lama jika NISN/NIP sama"
                >
                  Gabungkan (Merge)
                </button>
                <button
                  type="button"
                  onClick={() => setImportMode('replace')}
                  className={`px-3 py-1 rounded-lg font-bold transition-all ${
                    importMode === 'replace'
                      ? 'bg-rose-600 text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                  }`}
                  title="Menghapus semua data lama dan menggantikannya dengan isi file Excel baru"
                >
                  Timpa Semua
                </button>
              </div>
            </div>

            {/* Drag & Drop Box */}
            <label
              htmlFor="excel-file-input"
              className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-400 bg-slate-50/50 dark:bg-slate-800/30 hover:bg-blue-50/30 dark:hover:bg-blue-950/20 rounded-2xl p-8 cursor-pointer transition-all text-center group"
            >
              <input
                ref={fileInputRef}
                id="excel-file-input"
                type="file"
                accept=".xlsx, .xls, .csv"
                onChange={handleFileUpload}
                className="hidden"
              />

              <div className="p-4 rounded-2xl bg-blue-600/10 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform mb-3">
                <Upload className="h-8 w-8" />
              </div>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Klik untuk memilih file atau seret file Excel ke sini
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                Pastikan format file sesuai dengan template {selectedCategoryObj.title}
              </p>
            </label>

            {isParsing && (
              <div className="flex items-center justify-center gap-2 p-4 text-xs font-semibold text-blue-600 dark:text-blue-400 mt-3">
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>Memproses dan menganalisis file Excel...</span>
              </div>
            )}
          </div>

          {/* Card: Preview Data & Execution */}
          {parsedData && parsedData.length > 0 && (
            <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      Hasil Pemeriksaan Data: {parsedFileName}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Terdeteksi <strong>{validRows}</strong> baris valid dari total {totalRows} baris
                  </p>
                </div>

                <button
                  disabled={isSubmitting}
                  onClick={handleSaveImportedData}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold shadow-lg shadow-blue-600/25 transition-all hover:scale-105 active:scale-95"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      <span>Menyimpan ke Database...</span>
                    </>
                  ) : (
                    <>
                      <Database className="h-4 w-4" />
                      <span>Simpan {parsedData.length} Data ke Sistem</span>
                    </>
                  )}
                </button>
              </div>

              {/* Validation Warnings if any */}
              {validationErrors.length > 0 && (
                <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 text-amber-800 dark:text-amber-300 text-xs space-y-1 max-h-32 overflow-y-auto">
                  <p className="font-bold flex items-center gap-1 text-[11px]">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    <span>Catatan Validasi ({validationErrors.length} baris dilewati / diperbaiki):</span>
                  </p>
                  <ul className="list-disc list-inside text-[11px] space-y-0.5 text-amber-700 dark:text-amber-400">
                    {validationErrors.slice(0, 5).map((err, i) => (
                      <li key={i}>{err}</li>
                    ))}
                    {validationErrors.length > 5 && (
                      <li>...dan {validationErrors.length - 5} baris lainnya</li>
                    )}
                  </ul>
                </div>
              )}

              {/* Companion Notification if file contains both TP and Grades */}
              {companionTPData && companionTPData.length > 0 && (
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 text-emerald-800 dark:text-emerald-300 text-xs flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>
                      <strong>Bonus Terdeteksi:</strong> Ditemukan <strong>{companionTPData.length}</strong> butir Tujuan Pembelajaran (TP) dalam lembar TP. Keduanya akan otomatis tersimpan bersamaan!
                    </span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-200 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 shrink-0">
                    Auto-Sync TP & Nilai
                  </span>
                </div>
              )}

              {companionGradesData && companionGradesData.length > 0 && (
                <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800/40 text-purple-800 dark:text-purple-300 text-xs flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-purple-600 shrink-0" />
                    <span>
                      <strong>Bonus Terdeteksi:</strong> Ditemukan <strong>{companionGradesData.length}</strong> data Nilai Siswa dalam lembar Nilai. Keduanya akan otomatis tersimpan bersamaan!
                    </span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-200 dark:bg-purple-900 text-purple-800 dark:text-purple-200 shrink-0">
                    Auto-Sync Nilai & TP
                  </span>
                </div>
              )}

              {/* Table Preview */}
              <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden max-h-64 overflow-y-auto custom-scrollbar">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 font-bold sticky top-0">
                    <tr>
                      <th className="p-2.5">#</th>
                      {activeCategory === 'siswa' && (
                        <>
                          <th className="p-2.5">NISN</th>
                          <th className="p-2.5">Nama Siswa</th>
                          <th className="p-2.5">JK</th>
                          <th className="p-2.5">Orang Tua</th>
                          <th className="p-2.5">Kelas</th>
                        </>
                      )}
                      {activeCategory === 'guru' && (
                        <>
                          <th className="p-2.5">NIP</th>
                          <th className="p-2.5">Nama Guru</th>
                          <th className="p-2.5">Jabatan</th>
                          <th className="p-2.5">Status</th>
                        </>
                      )}
                      {activeCategory === 'nilai' && (
                        <>
                          <th className="p-2.5">NISN</th>
                          <th className="p-2.5">Nama Siswa</th>
                          <th className="p-2.5">Mata Pelajaran</th>
                          <th className="p-2.5">Asesmen</th>
                          <th className="p-2.5 text-center">Nilai</th>
                        </>
                      )}
                      {activeCategory === 'tp' && (
                        <>
                          <th className="p-2.5">Mapel</th>
                          <th className="p-2.5">Kode</th>
                          <th className="p-2.5">Lingkup Materi</th>
                          <th className="p-2.5">Rumusan TP</th>
                          <th className="p-2.5 text-center">KKTP</th>
                        </>
                      )}
                      {activeCategory === 'kas' && (
                        <>
                          <th className="p-2.5">Tanggal</th>
                          <th className="p-2.5">Jenis</th>
                          <th className="p-2.5">Keterangan</th>
                          <th className="p-2.5">Jumlah</th>
                        </>
                      )}
                      {activeCategory === 'inventaris' && (
                        <>
                          <th className="p-2.5">Kode</th>
                          <th className="p-2.5">Nama Barang</th>
                          <th className="p-2.5">Jumlah</th>
                          <th className="p-2.5">Kondisi</th>
                        </>
                      )}
                      {activeCategory === 'presensi' && (
                        <>
                          <th className="p-2.5">Tanggal</th>
                          <th className="p-2.5">Nama Siswa</th>
                          <th className="p-2.5">Status</th>
                          <th className="p-2.5">Keterangan</th>
                        </>
                      )}
                      {activeCategory === 'jadwal' && (
                        <>
                          <th className="p-2.5">Hari</th>
                          <th className="p-2.5 text-center">Jam Ke</th>
                          <th className="p-2.5">Waktu</th>
                          <th className="p-2.5">Mata Pelajaran</th>
                          <th className="p-2.5">Guru Pengampu</th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-600 dark:text-slate-300">
                    {parsedData.slice(0, 15).map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                        <td className="p-2.5 font-bold text-slate-400">{idx + 1}</td>
                        {activeCategory === 'siswa' && (
                          <>
                            <td className="p-2.5 font-mono text-[11px]">{row.nisn}</td>
                            <td className="p-2.5 font-bold text-slate-800 dark:text-slate-100">{row.nama}</td>
                            <td className="p-2.5">
                              <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${row.jenisKelamin === 'L' ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-600' : 'bg-pink-100 dark:bg-pink-900/40 text-pink-600'}`}>
                                {row.jenisKelamin}
                              </span>
                            </td>
                            <td className="p-2.5 text-[11px]">{row.namaAyah || row.namaIbu || '-'}</td>
                            <td className="p-2.5">{row.kelas}</td>
                          </>
                        )}
                        {activeCategory === 'guru' && (
                          <>
                            <td className="p-2.5 font-mono text-[11px]">{row.nip}</td>
                            <td className="p-2.5 font-bold text-slate-800 dark:text-slate-100">{row.nama}</td>
                            <td className="p-2.5">{row.jabatan}</td>
                            <td className="p-2.5">{row.statusKepegawaian}</td>
                          </>
                        )}
                        {activeCategory === 'nilai' && (
                          <>
                            <td className="p-2.5 font-mono text-[11px]">
                              {students.find(s => s.id === row.siswaId)?.nisn || '-'}
                            </td>
                            <td className="p-2.5 font-bold text-slate-800 dark:text-slate-100">
                              {students.find(s => s.id === row.siswaId)?.nama || row.siswaId}
                            </td>
                            <td className="p-2.5">
                              {subjects.find(s => s.id === row.mapelId)?.nama || row.mapelId}
                            </td>
                            <td className="p-2.5 font-semibold text-blue-600">
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
                                {row.jenis}
                              </span>
                            </td>
                            <td className="p-2.5 text-center">
                              <span className={`font-bold px-2 py-0.5 rounded text-xs ${Number(row.nilai) >= 75 ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300' : 'bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300'}`}>
                                {row.nilai}
                              </span>
                            </td>
                          </>
                        )}
                        {activeCategory === 'tp' && (
                          <>
                            <td className="p-2.5 font-bold text-slate-800 dark:text-slate-100">
                              {subjects.find(s => s.id === row.mapelId)?.nama || row.mapelId}
                            </td>
                            <td className="p-2.5 font-mono font-bold text-blue-600">{row.kode}</td>
                            <td className="p-2.5 text-[11px]">{row.lingkupMateri}</td>
                            <td className="p-2.5 text-[11px] line-clamp-2 max-w-xs">{row.deskripsi}</td>
                            <td className="p-2.5 text-center font-bold text-emerald-600">{row.kktp || 75}</td>
                          </>
                        )}
                        {activeCategory === 'kas' && (
                          <>
                            <td className="p-2.5 font-mono text-[11px]">{row.tanggal}</td>
                            <td className="p-2.5">
                              <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${row.jenis === 'Pemasukan' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                                {row.jenis}
                              </span>
                            </td>
                            <td className="p-2.5">{row.keterangan}</td>
                            <td className="p-2.5 font-bold">Rp {Number(row.jumlah).toLocaleString('id-ID')}</td>
                          </>
                        )}
                        {activeCategory === 'inventaris' && (
                          <>
                            <td className="p-2.5 font-mono text-[11px]">{row.kodeBarang}</td>
                            <td className="p-2.5 font-bold">{row.namaBarang}</td>
                            <td className="p-2.5">{row.jumlah} {row.satuan}</td>
                            <td className="p-2.5">{row.kondisi}</td>
                          </>
                        )}
                        {activeCategory === 'presensi' && (
                          <>
                            <td className="p-2.5 font-mono text-[11px]">{row.tanggal}</td>
                            <td className="p-2.5 font-bold text-slate-800 dark:text-slate-100">
                              {students.find(s => s.id === row.siswaId)?.nama || row.siswaId}
                            </td>
                            <td className="p-2.5">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                row.status === 'Hadir' ? 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300' :
                                row.status === 'Sakit' ? 'bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300' :
                                row.status === 'Izin' ? 'bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300' :
                                'bg-rose-100 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300'
                              }`}>
                                {row.status}
                              </span>
                            </td>
                            <td className="p-2.5 text-[11px]">{row.keterangan || '-'}</td>
                          </>
                        )}
                        {activeCategory === 'jadwal' && (
                          <>
                            <td className="p-2.5 font-bold text-slate-800 dark:text-slate-100">{row.hari}</td>
                            <td className="p-2.5 text-center font-mono font-bold text-indigo-600 dark:text-indigo-400">JP {row.jamKe}</td>
                            <td className="p-2.5 font-mono text-[11px]">{row.waktuMulai} - {row.waktuSelesai}</td>
                            <td className="p-2.5 font-bold">{row.mataPelajaran}</td>
                            <td className="p-2.5 text-[11px]">{row.guruPengampu || '-'}</td>
                          </>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {parsedData.length > 15 && (
                <p className="text-[11px] text-center text-slate-400">
                  Menampilkan 15 dari total {parsedData.length} baris data yang siap diimpor.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
