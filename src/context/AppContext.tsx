import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
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
  SchoolInfo,
  UserProfile,
  UserRole,
  ActiveTab,
  AttendanceStatus,
  AssessmentType,
  RolePermissions,
  ModulAjar,
  StudentReportData,
  KenaikanStatus,
  Extracurricular,
  normalizeSemester,
  isSemesterGenap,
  normalizeTPSemester,
  isTPForSemester
} from '../types';

import {
  INITIAL_USERS,
  DEFAULT_ROLE_PERMISSIONS,
  INITIAL_SCHOOL_INFO,
  INITIAL_STUDENTS,
  INITIAL_TEACHERS,
  INITIAL_SUBJECTS,
  INITIAL_TUJUAN_PEMBELAJARAN,
  generateInitialGrades,
  generateInitialAttendance,
  INITIAL_JOURNALS,
  INITIAL_SCHEDULE,
  INITIAL_CASH_TRANSACTIONS,
  generateInitialDues,
  INITIAL_INVENTORY,
  INITIAL_COUNSELING,
  INITIAL_DUTIES,
  INITIAL_EVENTS,
  INITIAL_EXTRACURRICULARS,
  generateInitialStudentReports
} from '../data/initialData';

import { INITIAL_MODUL_AJAR_LIST } from '../data/modulAjarData';
import {
  DimensiProfilLulusan,
  ProjekKokurikuler,
  SiswaDPLCapaianRecord,
  JurnalAktivitasKokurikuler,
  ArtefakKaryaKokurikuler,
  DPLPredikat
} from '../types';
import {
  DEFAULT_DPL_DIMENSIONS,
  INITIAL_PROJEK_KOKURIKULER,
  INITIAL_DPL_ASSESSMENTS,
  INITIAL_JURNAL_KOKURIKULER,
  INITIAL_ARTEFAK_KOKURIKULER
} from '../data/dplData';
import { generateSpecificReportDescription, TPScoreItem } from '../utils/raportDescriptionGenerator';
import { isAgamaSubject, getReligionSubjectName, getReligionSubjectCode } from '../utils/agamaHelper';
import {
  CURRICULUM_PHASE_PRESETS,
  CurriculumPhaseKey,
  generateGradesForCurriculumPhase
} from '../data/kurikulumMerdekaPresets';
import {
  syncStudent,
  deleteStudentDoc,
  syncTeacher,
  syncTransaction,
  syncInventoryItem,
  syncAttendance,
  syncScheduleItem,
  syncSchoolInfo,
  syncGrade
} from '../services/firestoreSync';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
}

interface AppContextType {
  // Navigation & User
  currentTab: ActiveTab;
  setCurrentTab: (tab: ActiveTab) => void;
  goBack: () => void;
  tabHistory: ActiveTab[];
  currentUser: UserProfile;
  availableUsers: UserProfile[];
  switchUserRole: (role: UserRole) => void;
  setCurrentUser: (user: UserProfile) => void;
  isAuthenticated: boolean;
  login: (identifier: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
  
  // User Management & RBAC Menu Permissions
  addUser: (user: Omit<UserProfile, 'id'>) => { success: boolean; error?: string };
  updateUser: (id: string, updated: Partial<UserProfile>) => { success: boolean; error?: string };
  deleteUser: (id: string) => { success: boolean; error?: string };
  toggleUserStatus: (id: string) => void;
  resetUserPassword: (id: string, newPass: string) => void;
  rolePermissions: RolePermissions;
  updateRolePermissions: (role: UserRole, tabs: ActiveTab[]) => void;
  resetRolePermissionsToDefault: () => void;
  hasPermission: (tab: ActiveTab, user?: UserProfile) => boolean;

  // Theme
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  setDarkMode: (enabled: boolean) => void;

  // School Info
  schoolInfo: SchoolInfo;
  updateSchoolInfo: (info: Partial<SchoolInfo>) => void;

  // Students (CRUD)
  students: Student[];
  addStudent: (student: Omit<Student, 'id'>) => void;
  updateStudent: (id: string, updated: Partial<Student>) => void;
  deleteStudent: (id: string) => void;
  deleteAllStudents: () => void;
  deleteSelectedStudents: (ids: string[]) => void;
  restoreSampleStudents: () => void;
  getStudentById: (id: string) => Student | undefined;
  bulkImportStudents: (importedStudents: Student[], mode?: 'append' | 'replace') => void;

  // Teachers (CRUD)
  teachers: Teacher[];
  addTeacher: (teacher: Omit<Teacher, 'id'>) => void;
  updateTeacher: (id: string, updated: Partial<Teacher>) => void;
  deleteTeacher: (id: string) => void;
  getTeacherById: (id: string) => Teacher | undefined;
  bulkImportTeachers: (importedTeachers: Teacher[], mode?: 'append' | 'replace') => void;

  // Subjects
  subjects: Subject[];
  addSubject: (subject: Omit<Subject, 'id'>) => void;
  updateSubject: (id: string, updated: Partial<Subject>) => void;
  deleteSubject: (id: string) => void;

  // Tujuan Pembelajaran (TP)
  tujuanPembelajaranList: TujuanPembelajaran[];
  addTP: (tp: Omit<TujuanPembelajaran, 'id'> | TujuanPembelajaran) => void;
  bulkAddTP: (tps: (Omit<TujuanPembelajaran, 'id'> | TujuanPembelajaran)[]) => void;
  updateTP: (id: string, updated: Partial<TujuanPembelajaran>) => void;
  deleteTP: (id: string) => void;
  bulkImportTP: (tps: TujuanPembelajaran[], mode?: 'append' | 'replace') => void;
  getTPBySubject: (mapelId: string) => TujuanPembelajaran[];
  resetTPToDefault: () => void;
  applyCurriculumPhasePreset: (
    phaseKey: CurriculumPhaseKey,
    options?: {
      updateSchoolInfo?: boolean;
      regenerateGrades?: boolean;
      customClassName?: string;
    }
  ) => void;

  // Attendance
  attendanceRecords: AttendanceRecord[];
  markAttendance: (siswaId: string, status: AttendanceStatus, tanggal?: string, keterangan?: string) => void;
  bulkMarkAttendance: (tanggal: string, status: AttendanceStatus) => void;
  deleteAttendanceRecord: (id: string) => void;
  getAttendanceByDate: (tanggal: string) => AttendanceRecord[];
  getStudentAttendanceStats: (siswaId: string, monthPrefix?: string) => {
    hadir: number;
    sakit: number;
    izin: number;
    alpa: number;
    total: number;
    percentage: number;
  };
  bulkImportAttendance: (importedRecords: AttendanceRecord[], mode?: 'append' | 'replace') => void;

  // Grades (Penilaian)
  grades: GradeRecord[];
  saveGrade: (siswaId: string, mapelId: string, jenis: AssessmentType, nilai: number, capaianKompetensi?: string, targetSemester?: string) => void;
  bulkSaveGrades: (newGrades: Array<{ siswaId: string; mapelId: string; jenis: AssessmentType; nilai: number; capaianKompetensi?: string; semester?: string }>, targetSemester?: string) => void;
  bulkImportGrades: (newGrades: GradeRecord[], mode?: 'append' | 'replace', targetSemester?: string) => void;
  resetAllTPGradesToZero: (mapelId?: string, targetSemester?: string) => void;
  getGradeValue: (siswaId: string, mapelId: string, jenis: AssessmentType | string, targetSemester?: string, defaultVal?: number) => number;
  getStudentGradeSummary: (siswaId: string, mapelId: string, targetSemester?: string) => {
    formatifAvg: number;
    sumatifSts: number;
    sumatifSas: number;
    nilaiAkhir: number;
    predikat: 'A' | 'B' | 'C' | 'D';
    ketercapaian: 'Tuntas' | 'Belum Tuntas';
    deskripsiCapaian: string;
  };
  getAllGradesForStudent: (siswaId: string, targetSemester?: string) => Array<{
    subject: Subject;
    formatifAvg: number;
    sumatifSts: number;
    sumatifSas: number;
    nilaiAkhir: number;
    predikat: 'A' | 'B' | 'C' | 'D';
    ketercapaian: 'Tuntas' | 'Belum Tuntas';
    deskripsiCapaian: string;
  }>;
  getAllMidSemesterGradesForStudent: (siswaId: string, targetSemester?: string) => Array<{
    subject: Subject;
    formatifAvg: number;
    sumatifSts: number;
    nilaiAkhirMid: number;
    predikat: 'A' | 'B' | 'C' | 'D';
    ketercapaian: 'Tuntas' | 'Belum Tuntas';
    deskripsiCapaian: string;
  }>;

  // Raport Siswa, Ranking & Kenaikan Kelas
  studentReports: Record<string, StudentReportData>;
  getStudentReport: (siswaId: string) => StudentReportData;
  updateStudentReport: (siswaId: string, updated: Partial<StudentReportData>, silent?: boolean) => void;
  updateGlobalReportDate: (
    type: 'semester' | 'mid_semester' | 'both',
    dateSemester?: string,
    dateMid?: string,
    silent?: boolean
  ) => void;
  getEffectiveStudentAttendance: (siswaId: string, isMidSemester?: boolean) => {
    sakit: number;
    izin: number;
    alpa: number;
    isManual: boolean;
    autoSakit: number;
    autoIzin: number;
    autoAlpa: number;
  };
  updateStudentReportAttendance: (
    siswaId: string,
    attendance: { isManual: boolean; sakit?: number; izin?: number; alpa?: number },
    isMidSemester?: boolean,
    silent?: boolean
  ) => void;
  bulkAutoCalculateRankings: () => void;
  bulkAutoCalculateMidRankings: () => void;
  bulkSetKenaikanKelas: (status: KenaikanStatus, targetKelas?: string) => void;
  calculateStudentRankings: () => Array<{ siswaId: string; rank: number; totalScore: number; avgScore: number }>;
  calculateMidSemesterRankings: () => Array<{ siswaId: string; rank: number; totalScore: number; avgScore: number }>;

  // Teaching Journal
  journals: TeachingJournal[];
  addJournal: (journal: Omit<TeachingJournal, 'id'>) => void;
  updateJournal: (id: string, updated: Partial<TeachingJournal>) => void;
  deleteJournal: (id: string) => void;

  // Perangkat Ajar (Modul Ajar SD)
  modulAjarList: ModulAjar[];
  addModulAjar: (modul: Omit<ModulAjar, 'id'>) => void;
  updateModulAjar: (id: string, updated: Partial<ModulAjar>) => void;
  deleteModulAjar: (id: string) => void;
  duplicateModulAjar: (id: string) => void;
  toggleFavoriteModulAjar: (id: string) => void;
  resetModulAjarToDefault: () => void;

  // Timetable Schedule
  schedule: ScheduleItem[];
  addScheduleItem: (item: Omit<ScheduleItem, 'id'>) => void;
  updateScheduleItem: (id: string, updated: Partial<ScheduleItem>) => void;
  deleteScheduleItem: (id: string) => void;
  resetScheduleToDefault: () => void;
  duplicateDaySchedule: (fromDay: 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat' | 'Sabtu', toDay: 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat' | 'Sabtu') => void;
  bulkImportSchedule: (importedItems: ScheduleItem[], mode?: 'append' | 'replace') => void;

  // Cash Treasury & Dues
  transactions: CashTransaction[];
  cashTransactions: CashTransaction[];
  addCashTransaction: (trx: Omit<CashTransaction, 'id' | 'saldoSetelah'>) => void;
  updateCashTransaction: (id: string, updated: Partial<CashTransaction>) => void;
  deleteCashTransaction: (id: string) => void;
  bulkImportCash: (importedCash: CashTransaction[], mode?: 'append' | 'replace') => void;
  weeklyDues: StudentWeeklyDues[];
  toggleStudentDues: (siswaId: string, week: 1 | 2 | 3 | 4) => void;
  resetStudentDues: (siswaId: string) => void;
  recordStudentDuesDeposit: (depositData: {
    siswaId: string;
    namaSiswa: string;
    jumlah: number;
    tanggal: string;
    mingguKe: number[];
    metodePembayaran?: string;
    keterangan?: string;
    catatKeKas?: boolean;
  }) => void;
  getCurrentCashBalance: () => number;

  // Inventory
  inventory: InventoryItem[];
  addInventoryItem: (item: Omit<InventoryItem, 'id'>) => void;
  updateInventoryItem: (id: string, updated: Partial<InventoryItem>) => void;
  deleteInventoryItem: (id: string) => void;
  bulkImportInventory: (importedItems: InventoryItem[], mode?: 'append' | 'replace') => void;

  // Counseling & Achievements
  counseling: CounselingRecord[];
  addCounselingRecord: (record: Omit<CounselingRecord, 'id'>) => void;
  updateCounselingRecord: (id: string, updated: Partial<CounselingRecord>) => void;
  deleteCounselingRecord: (id: string) => void;

  // Cleaning Duties
  cleaningDuties: CleaningDuty[];
  addDuty: (duty: CleaningDuty) => void;
  updateDuty: (hari: string, data: { siswaIds: string[]; ketuaPiket: string; tugasSpesifik?: string; areaTugas?: string[]; waktuPiket?: 'Pagi (Sebelum Bel)' | 'Siang (Pulang Sekolah)' | 'Pagi & Siang' | string }) => void;
  deleteDuty: (hari: string) => void;
  addStudentToDuty: (hari: string, siswaId: string) => void;
  removeStudentFromDuty: (hari: string, siswaId: string) => void;
  autoDistributeDuties: () => void;
  resetDutiesToDefault: () => void;

  // School Events
  events: SchoolEvent[];
  addEvent: (event: Omit<SchoolEvent, 'id'>) => void;
  deleteEvent: (id: string) => void;

  // Extracurriculars
  extracurriculars: Extracurricular[];
  addExtracurricular: (item: Omit<Extracurricular, 'id'> | Extracurricular) => void;
  updateExtracurricular: (id: string, updated: Partial<Extracurricular>) => void;
  deleteExtracurricular: (id: string) => void;
  setStudentExtracurriculars: (siswaId: string, items: Array<{ namaKegiatan: string; predikat: 'Sangat Baik' | 'Baik' | 'Cukup'; keterangan: string }>) => void;

  // Kokurikuler & Dimensi Profil Lulusan (DPL)
  dplDimensions: DimensiProfilLulusan[];
  projekKokurikulerList: ProjekKokurikuler[];
  addProjekKokurikuler: (projek: Omit<ProjekKokurikuler, 'id'>) => void;
  updateProjekKokurikuler: (id: string, updated: Partial<ProjekKokurikuler>) => void;
  deleteProjekKokurikuler: (id: string) => void;
  resetProjekKokurikulerToDefault: () => void;

  dplAssessmentList: SiswaDPLCapaianRecord[];
  saveDPLAssessment: (record: Omit<SiswaDPLCapaianRecord, 'id'> & { id?: string }) => void;
  bulkSaveDPLAssessments: (records: SiswaDPLCapaianRecord[]) => void;
  getDPLAssessmentByStudent: (projekId: string, siswaId: string) => SiswaDPLCapaianRecord | undefined;
  generateAIDPLNarrative: (siswaId: string, projekId: string) => string;
  getStudentKokurikulerInfo: (siswaId: string, projekId?: string) => { deskripsi: string; projekJudul: string; tema?: string };

  jurnalKokurikulerList: JurnalAktivitasKokurikuler[];
  addJurnalKokurikuler: (jurnal: Omit<JurnalAktivitasKokurikuler, 'id'>) => void;
  updateJurnalKokurikuler: (id: string, updated: Partial<JurnalAktivitasKokurikuler>) => void;
  deleteJurnalKokurikuler: (id: string) => void;

  artefakKokurikulerList: ArtefakKaryaKokurikuler[];
  addArtefakKokurikuler: (artefak: Omit<ArtefakKaryaKokurikuler, 'id'>) => void;
  updateArtefakKokurikuler: (id: string, updated: Partial<ArtefakKaryaKokurikuler>) => void;
  deleteArtefakKokurikuler: (id: string) => void;

  // System & Toast
  toasts: ToastMessage[];
  addToast: (type: 'success' | 'error' | 'info' | 'warning', title: string, message: string) => void;
  removeToast: (id: string) => void;
  resetAllDataToDefault: () => void;
  exportDatabaseToJson: () => void;
  importDatabaseFromJson: (jsonData: string) => boolean;

  // Manual & Auto Persistence
  lastSavedAt: string | null;
  saveAllData: () => { success: boolean; timestamp: string };
  isAutoSaveActive: boolean;

  // Academic Year Multi-Year Management
  availableAcademicYears: string[];
  switchAcademicYear: (year: string) => void;
  addAcademicYear: (year: string) => void;
  isAcademicYearModalOpen: boolean;
  setIsAcademicYearModalOpen: (open: boolean) => void;
  getStudentCountForYear: (year: string) => number;

  // Quick Action Modal helpers
  selectedStudentForModal: Student | null;
  setSelectedStudentForModal: (student: Student | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_PREFIX = 'admin_kelas_sd_v1_';
export const DEFAULT_ACADEMIC_YEARS = ['2024/2025', '2025/2026', '2026/2027', '2027/2028', '2028/2029'];

export const getYearStorageKey = (year?: string): string => {
  return (year || '2026/2027').replace(/[^a-zA-Z0-9]/g, '_');
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Read initial from localStorage or fall back safely
  const getSaved = <T,>(key: string, fallback: T): T => {
    try {
      const item = localStorage.getItem(STORAGE_PREFIX + key);
      if (!item || item === 'null' || item === 'undefined') return fallback;
      const parsed = JSON.parse(item);
      if (parsed === null || parsed === undefined) return fallback;
      if (Array.isArray(fallback)) {
        if (!Array.isArray(parsed)) return fallback;
        return parsed as T;
      }
      if (typeof fallback === 'object' && fallback !== null) {
        if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) return fallback;
        // For studentReports record dictionary, preserve saved dictionary directly
        if (key === 'studentReports') {
          return parsed as T;
        }
        return { ...fallback, ...parsed };
      }
      return parsed as T;
    } catch {
      return fallback;
    }
  };

  // State Declarations
  const [currentTab, setCurrentTab] = useState<ActiveTab>('dashboard');
  const [tabHistory, setTabHistory] = useState<ActiveTab[]>(['dashboard']);

  const handleSetCurrentTab = (tab: ActiveTab) => {
    setTabHistory(prev => (prev[prev.length - 1] === tab ? prev : [...prev, tab]));
    setCurrentTab(tab);
  };

  const goBack = () => {
    if (tabHistory.length > 1) {
      const newHistory = [...tabHistory];
      newHistory.pop(); // pop current
      const previous = newHistory[newHistory.length - 1];
      setTabHistory(newHistory);
      setCurrentTab(previous || 'dashboard');
    } else {
      setCurrentTab('dashboard');
    }
  };
  const [availableUsers, setAvailableUsers] = useState<UserProfile[]>(() =>
    getSaved('users', INITIAL_USERS)
  );
  const [rolePermissions, setRolePermissions] = useState<RolePermissions>(() =>
    getSaved('rolePermissions', DEFAULT_ROLE_PERMISSIONS)
  );
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => 
    getSaved('currentUser', INITIAL_USERS[0])
  );
  
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'isAuthenticated');
    return saved !== null ? JSON.parse(saved) : false;
  });
  
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  const [schoolInfo, setSchoolInfo] = useState<SchoolInfo>(() => {
    const saved = getSaved('schoolInfo', INITIAL_SCHOOL_INFO);
    const updated = { ...saved };
    if (!updated.kurikulum || updated.kurikulum === 'Kurikulum Merdeka') {
      updated.kurikulum = 'Kurikulum Merdeka Pembelajaran Mendalam (KMPM)';
    }
    if (!updated.tanggalRapor) {
      updated.tanggalRapor = updated.semester?.includes('2')
        ? `${updated.city || 'Kota Jakarta Selatan'}, 20 Juni 2027`
        : `${updated.city || 'Kota Jakarta Selatan'}, 19 Desember 2026`;
    }
    if (!updated.tanggalRaporMid) {
      updated.tanggalRaporMid = updated.semester?.includes('2')
        ? `${updated.city || 'Kota Jakarta Selatan'}, 28 Maret 2027`
        : `${updated.city || 'Kota Jakarta Selatan'}, 10 Oktober 2026`;
    }
    return updated;
  });

  const [availableAcademicYears, setAvailableAcademicYears] = useState<string[]>(() => {
    const saved = getSaved('availableYears', DEFAULT_ACADEMIC_YEARS);
    if (!Array.isArray(saved) || saved.length === 0) return DEFAULT_ACADEMIC_YEARS;
    const currentYr = schoolInfo?.academicYear || INITIAL_SCHOOL_INFO.academicYear || '2025/2026';
    if (!saved.includes(currentYr)) {
      return [...saved, currentYr].sort();
    }
    return saved;
  });

  const [isAcademicYearModalOpen, setIsAcademicYearModalOpen] = useState<boolean>(false);

  // Helper to read data specifically for the current active academic year
  const getYearSaved = <T,>(itemKey: string, fallback: T): T => {
    try {
      const activeYear = schoolInfo?.academicYear || INITIAL_SCHOOL_INFO.academicYear || '2025/2026';
      const yk = getYearStorageKey(activeYear);
      const isYearInit = typeof window !== 'undefined' && localStorage.getItem(STORAGE_PREFIX + `${yk}_initialized`) === 'true';

      if (isYearInit) {
        const item = localStorage.getItem(STORAGE_PREFIX + `${yk}_${itemKey}`);
        if (!item || item === 'null' || item === 'undefined') {
          return (Array.isArray(fallback) ? [] : typeof fallback === 'object' && fallback !== null ? {} : fallback) as T;
        }
        const parsed = JSON.parse(item);
        if (parsed !== null && parsed !== undefined) return parsed as T;
      }

      // If this is the initial seed baseline year and no academic year has ever been initialized yet,
      // seed this baseline year using fallback / general storage
      const hasInitAnyYear = typeof window !== 'undefined' && localStorage.getItem(STORAGE_PREFIX + 'has_initialized_any_year') === 'true';
      const isSeedYear = !hasInitAnyYear && (activeYear === INITIAL_SCHOOL_INFO.academicYear || activeYear === '2025/2026');

      if (isSeedYear) {
        const generalItem = localStorage.getItem(STORAGE_PREFIX + itemKey);
        if (generalItem && generalItem !== 'null' && generalItem !== 'undefined') {
          const parsed = JSON.parse(generalItem);
          if (parsed !== null && parsed !== undefined) {
            localStorage.setItem(STORAGE_PREFIX + `${yk}_${itemKey}`, JSON.stringify(parsed));
            localStorage.setItem(STORAGE_PREFIX + `${yk}_initialized`, 'true');
            localStorage.setItem(STORAGE_PREFIX + 'has_initialized_any_year', 'true');
            return parsed as T;
          }
        }
        // Save initial fallback
        localStorage.setItem(STORAGE_PREFIX + `${yk}_${itemKey}`, JSON.stringify(fallback));
        localStorage.setItem(STORAGE_PREFIX + `${yk}_initialized`, 'true');
        localStorage.setItem(STORAGE_PREFIX + 'has_initialized_any_year', 'true');
        return fallback;
      }

      // For any NEW or uninitialized academic year: must start fresh and empty!
      // (Data awal masih kosong, tidak ada data siswa nilai 0)
      return (Array.isArray(fallback) ? [] : typeof fallback === 'object' && fallback !== null ? {} : fallback) as T;
    } catch {
      return fallback;
    }
  };

  const hasInitAnyYearGlobal = typeof window !== 'undefined' && localStorage.getItem(STORAGE_PREFIX + 'has_initialized_any_year') === 'true';
  const currentActiveYear = schoolInfo?.academicYear || INITIAL_SCHOOL_INFO.academicYear || '2025/2026';
  const isSeedYearGlobal = !hasInitAnyYearGlobal && (currentActiveYear === INITIAL_SCHOOL_INFO.academicYear || currentActiveYear === '2025/2026');

  const [students, setStudents] = useState<Student[]>(() => 
    getYearSaved('students', isSeedYearGlobal ? INITIAL_STUDENTS : [])
  );

  const [teachers, setTeachers] = useState<Teacher[]>(() => 
    getSaved('teachers', INITIAL_TEACHERS)
  );

  const [subjects, setSubjects] = useState<Subject[]>(() => {
    const saved = getSaved('subjects', INITIAL_SUBJECTS);
    const paiIdx = saved.findIndex(s => s.kode === 'PAI' || s.id === 'mapel-05' || s.nama.toLowerCase().includes('agama'));
    if (paiIdx > 0) {
      const reordered = [...saved];
      const [paiItem] = reordered.splice(paiIdx, 1);
      reordered.unshift(paiItem);
      return reordered;
    }
    return saved;
  });

  // Helper to generate guaranteed unique TP ID
  const generateUniqueTPId = (prefix = 'tp', existingIds?: Set<string>): string => {
    let id = '';
    do {
      const timePart = Date.now().toString(36);
      const randomPart = Math.random().toString(36).substring(2, 9);
      id = `${prefix}-${timePart}-${randomPart}`;
    } while (existingIds && existingIds.has(id));
    return id;
  };

  // Helper to ensure every TP in list has a globally unique ID and correct normalized semester tag
  const sanitizeTPList = (list: TujuanPembelajaran[]): TujuanPembelajaran[] => {
    if (!Array.isArray(list)) return [];
    const seenIds = new Set<string>();
    let hasModified = false;
    const sanitized = list.map(tp => {
      let finalId = tp.id;
      if (!finalId || seenIds.has(finalId)) {
        hasModified = true;
        finalId = generateUniqueTPId('tp', seenIds);
      }
      seenIds.add(finalId);

      const normSem = normalizeTPSemester(tp);
      let updatedSemester = tp.semester;
      if (!tp.semester || (tp.semester !== normSem && normSem !== 'Semua')) {
        updatedSemester = normSem;
        hasModified = true;
      }

      return (finalId !== tp.id || updatedSemester !== tp.semester)
        ? { ...tp, id: finalId, semester: updatedSemester }
        : tp;
    });
    if (hasModified) {
      try {
        localStorage.setItem(STORAGE_PREFIX + 'tujuanPembelajaran', JSON.stringify(sanitized));
      } catch {
        // ignore
      }
    }
    return sanitized;
  };

  const [tujuanPembelajaranList, setTujuanPembelajaranList] = useState<TujuanPembelajaran[]>(() => {
    const rawSaved = getSaved('tujuanPembelajaran', INITIAL_TUJUAN_PEMBELAJARAN);
    let saved = sanitizeTPList(Array.isArray(rawSaved) ? rawSaved : INITIAL_TUJUAN_PEMBELAJARAN);
    if (Array.isArray(saved) && saved.length > 0) {
      let hasChanges = false;
      // Check if saved TPs already include multi-religion TPs (Kristen, Hindu, Buddha, etc.)
      const hasOtherAgama = saved.some(
        (tp: TujuanPembelajaran) => tp.agama && tp.agama !== 'Islam' && tp.agama !== 'Semua'
      );
      if (!hasOtherAgama) {
        const existingIds = new Set(saved.map((tp: TujuanPembelajaran) => tp.id));
        const missingAgamaTPs = INITIAL_TUJUAN_PEMBELAJARAN.filter(
          tp => tp.agama && tp.agama !== 'Islam' && !existingIds.has(tp.id)
        );
        if (missingAgamaTPs.length > 0) {
          saved = sanitizeTPList([...saved, ...missingAgamaTPs]);
          hasChanges = true;
        }
      }

      // Check if saved TPs include Semester 2 TPs
      const hasSem2 = saved.some(
        (tp: TujuanPembelajaran) => tp.semester === '2 (Genap)'
      );
      if (!hasSem2) {
        const existingIds = new Set(saved.map((tp: TujuanPembelajaran) => tp.id));
        const missingSem2TPs = INITIAL_TUJUAN_PEMBELAJARAN.filter(
          tp => tp.semester === '2 (Genap)' && !existingIds.has(tp.id)
        );
        if (missingSem2TPs.length > 0) {
          saved = sanitizeTPList([...saved, ...missingSem2TPs]);
          hasChanges = true;
        }
      }

      if (hasChanges) {
        try {
          localStorage.setItem(STORAGE_PREFIX + 'tujuanPembelajaran', JSON.stringify(saved));
        } catch {}
      }
    }
    return saved;
  });

  const [grades, setGrades] = useState<GradeRecord[]>(() => {
    const saved = getYearSaved('grades', isSeedYearGlobal ? generateInitialGrades() : []);
    if (!saved || !Array.isArray(saved) || saved.length === 0) {
      return [];
    }
    // Migration: ensure every item has a normalized semester tag (default to '1 (Ganjil)' if missing)
    let hasModified = false;
    const migrated = saved.map((g: GradeRecord) => {
      const norm = normalizeSemester(g.semester);
      if (!g.semester || g.semester !== norm) {
        hasModified = true;
        const semPrefix = norm === '2 (Genap)' ? 'sem2' : 'sem1';
        return {
          ...g,
          semester: norm,
          id: g.id?.includes('sem') ? g.id : `grd-${semPrefix}-${g.siswaId}-${g.mapelId}-${g.jenis}`
        };
      }
      return g;
    });
    if (hasModified) {
      try {
        localStorage.setItem(STORAGE_PREFIX + 'grades', JSON.stringify(migrated));
      } catch {}
    }
    return migrated;
  });

  const [studentReports, setStudentReports] = useState<Record<string, StudentReportData>>(() => 
    getYearSaved('studentReports', isSeedYearGlobal ? generateInitialStudentReports() : {})
  );

  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(() => {
    const saved = getYearSaved('attendance', isSeedYearGlobal ? generateInitialAttendance() : []);
    if (!saved || !Array.isArray(saved) || saved.length === 0) {
      return [];
    }
    // If saved attendance only has 1 month in seed year, merge initial attendance so historical semester data is visible
    if (isSeedYearGlobal) {
      const distinctMonths = new Set(saved.map((r: any) => r.tanggal?.substring(0, 7)).filter(Boolean));
      if (distinctMonths.size <= 1) {
        const initial = generateInitialAttendance();
        const existingIds = new Set(saved.map((r: any) => r.id));
        const combined = [...saved];
        initial.forEach(rec => {
          if (!existingIds.has(rec.id)) {
            combined.push(rec);
          }
        });
        return combined;
      }
    }
    return saved;
  });

  const [journals, setJournals] = useState<TeachingJournal[]>(() => 
    getYearSaved('journals', isSeedYearGlobal ? INITIAL_JOURNALS : [])
  );

  const [modulAjarList, setModulAjarList] = useState<ModulAjar[]>(() => 
    getSaved('modulAjar', INITIAL_MODUL_AJAR_LIST)
  );

  const [schedule, setSchedule] = useState<ScheduleItem[]>(() => 
    getSaved('schedule', INITIAL_SCHEDULE)
  );

  const [transactions, setTransactions] = useState<CashTransaction[]>(() => 
    getYearSaved('transactions', isSeedYearGlobal ? INITIAL_CASH_TRANSACTIONS : [])
  );

  const [weeklyDues, setWeeklyDues] = useState<StudentWeeklyDues[]>(() => 
    getYearSaved('weeklyDues', isSeedYearGlobal ? generateInitialDues() : [])
  );

  const [inventory, setInventory] = useState<InventoryItem[]>(() => 
    getSaved('inventory', INITIAL_INVENTORY)
  );

  const [counseling, setCounseling] = useState<CounselingRecord[]>(() => 
    getYearSaved('counseling', isSeedYearGlobal ? INITIAL_COUNSELING : [])
  );

  const [cleaningDuties, setCleaningDuties] = useState<CleaningDuty[]>(() => 
    getYearSaved('cleaningDuties', isSeedYearGlobal ? INITIAL_DUTIES : [])
  );

  const [events, setEvents] = useState<SchoolEvent[]>(() => 
    getYearSaved('events', isSeedYearGlobal ? INITIAL_EVENTS : [])
  );

  const [extracurriculars, setExtracurriculars] = useState<any[]>(() => 
    getSaved('extracurriculars', INITIAL_EXTRACURRICULARS)
  );

  // Kokurikuler & DPL State
  const [projekKokurikulerList, setProjekKokurikulerList] = useState<ProjekKokurikuler[]>(() =>
    getYearSaved('projekKokurikuler', isSeedYearGlobal ? INITIAL_PROJEK_KOKURIKULER : [])
  );

  const [dplAssessmentList, setDplAssessmentList] = useState<SiswaDPLCapaianRecord[]>(() =>
    getYearSaved('dplAssessments', isSeedYearGlobal ? INITIAL_DPL_ASSESSMENTS : [])
  );

  const [jurnalKokurikulerList, setJurnalKokurikulerList] = useState<JurnalAktivitasKokurikuler[]>(() =>
    getYearSaved('jurnalKokurikuler', isSeedYearGlobal ? INITIAL_JURNAL_KOKURIKULER : [])
  );

  const [artefakKokurikulerList, setArtefakKokurikulerList] = useState<ArtefakKaryaKokurikuler[]>(() =>
    getYearSaved('artefakKokurikuler', isSeedYearGlobal ? INITIAL_ARTEFAK_KOKURIKULER : [])
  );

  const [dplDimensions] = useState<DimensiProfilLulusan[]>(DEFAULT_DPL_DIMENSIONS);

  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [selectedStudentForModal, setSelectedStudentForModal] = useState<Student | null>(null);

  // Track last saved timestamp for transparent data persistence status
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(() => {
    try {
      return localStorage.getItem(STORAGE_PREFIX + 'lastSavedAt');
    } catch {
      return null;
    }
  });

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'currentUser', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'users', JSON.stringify(availableUsers));
  }, [availableUsers]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'rolePermissions', JSON.stringify(rolePermissions));
  }, [rolePermissions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'darkMode', JSON.stringify(isDarkMode));
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'schoolInfo', JSON.stringify(schoolInfo));
  }, [schoolInfo]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'students', JSON.stringify(students));
    const yk = getYearStorageKey(schoolInfo?.academicYear);
    localStorage.setItem(STORAGE_PREFIX + `${yk}_students`, JSON.stringify(students));
    localStorage.setItem(STORAGE_PREFIX + `${yk}_initialized`, 'true');
    localStorage.setItem(STORAGE_PREFIX + 'has_initialized_any_year', 'true');
  }, [students, schoolInfo?.academicYear]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'teachers', JSON.stringify(teachers));
  }, [teachers]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'subjects', JSON.stringify(subjects));
  }, [subjects]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'tujuanPembelajaran', JSON.stringify(tujuanPembelajaranList));
  }, [tujuanPembelajaranList]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'grades', JSON.stringify(grades));
    const yk = getYearStorageKey(schoolInfo?.academicYear);
    localStorage.setItem(STORAGE_PREFIX + `${yk}_grades`, JSON.stringify(grades));
    localStorage.setItem(STORAGE_PREFIX + `${yk}_initialized`, 'true');
    localStorage.setItem(STORAGE_PREFIX + 'has_initialized_any_year', 'true');
  }, [grades, schoolInfo?.academicYear]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'attendance', JSON.stringify(attendanceRecords));
    const yk = getYearStorageKey(schoolInfo?.academicYear);
    localStorage.setItem(STORAGE_PREFIX + `${yk}_attendance`, JSON.stringify(attendanceRecords));
    localStorage.setItem(STORAGE_PREFIX + `${yk}_initialized`, 'true');
    localStorage.setItem(STORAGE_PREFIX + 'has_initialized_any_year', 'true');
  }, [attendanceRecords, schoolInfo?.academicYear]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'journals', JSON.stringify(journals));
    const yk = getYearStorageKey(schoolInfo?.academicYear);
    localStorage.setItem(STORAGE_PREFIX + `${yk}_journals`, JSON.stringify(journals));
    localStorage.setItem(STORAGE_PREFIX + `${yk}_initialized`, 'true');
    localStorage.setItem(STORAGE_PREFIX + 'has_initialized_any_year', 'true');
  }, [journals, schoolInfo?.academicYear]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'modulAjar', JSON.stringify(modulAjarList));
  }, [modulAjarList]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'schedule', JSON.stringify(schedule));
  }, [schedule]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'transactions', JSON.stringify(transactions));
    const yk = getYearStorageKey(schoolInfo?.academicYear);
    localStorage.setItem(STORAGE_PREFIX + `${yk}_transactions`, JSON.stringify(transactions));
    localStorage.setItem(STORAGE_PREFIX + `${yk}_initialized`, 'true');
    localStorage.setItem(STORAGE_PREFIX + 'has_initialized_any_year', 'true');
  }, [transactions, schoolInfo?.academicYear]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'weeklyDues', JSON.stringify(weeklyDues));
    const yk = getYearStorageKey(schoolInfo?.academicYear);
    localStorage.setItem(STORAGE_PREFIX + `${yk}_weeklyDues`, JSON.stringify(weeklyDues));
    localStorage.setItem(STORAGE_PREFIX + `${yk}_initialized`, 'true');
    localStorage.setItem(STORAGE_PREFIX + 'has_initialized_any_year', 'true');
  }, [weeklyDues, schoolInfo?.academicYear]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'inventory', JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'counseling', JSON.stringify(counseling));
    const yk = getYearStorageKey(schoolInfo?.academicYear);
    localStorage.setItem(STORAGE_PREFIX + `${yk}_counseling`, JSON.stringify(counseling));
    localStorage.setItem(STORAGE_PREFIX + `${yk}_initialized`, 'true');
    localStorage.setItem(STORAGE_PREFIX + 'has_initialized_any_year', 'true');
  }, [counseling, schoolInfo?.academicYear]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'cleaningDuties', JSON.stringify(cleaningDuties));
    const yk = getYearStorageKey(schoolInfo?.academicYear);
    localStorage.setItem(STORAGE_PREFIX + `${yk}_cleaningDuties`, JSON.stringify(cleaningDuties));
    localStorage.setItem(STORAGE_PREFIX + `${yk}_initialized`, 'true');
    localStorage.setItem(STORAGE_PREFIX + 'has_initialized_any_year', 'true');
  }, [cleaningDuties, schoolInfo?.academicYear]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'events', JSON.stringify(events));
    const yk = getYearStorageKey(schoolInfo?.academicYear);
    localStorage.setItem(STORAGE_PREFIX + `${yk}_events`, JSON.stringify(events));
    localStorage.setItem(STORAGE_PREFIX + `${yk}_initialized`, 'true');
    localStorage.setItem(STORAGE_PREFIX + 'has_initialized_any_year', 'true');
  }, [events, schoolInfo?.academicYear]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'extracurriculars', JSON.stringify(extracurriculars));
  }, [extracurriculars]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'studentReports', JSON.stringify(studentReports));
    const yk = getYearStorageKey(schoolInfo?.academicYear);
    localStorage.setItem(STORAGE_PREFIX + `${yk}_studentReports`, JSON.stringify(studentReports));
    localStorage.setItem(STORAGE_PREFIX + `${yk}_initialized`, 'true');
    localStorage.setItem(STORAGE_PREFIX + 'has_initialized_any_year', 'true');
  }, [studentReports, schoolInfo?.academicYear]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'projekKokurikuler', JSON.stringify(projekKokurikulerList));
    const yk = getYearStorageKey(schoolInfo?.academicYear);
    localStorage.setItem(STORAGE_PREFIX + `${yk}_projekKokurikuler`, JSON.stringify(projekKokurikulerList));
    localStorage.setItem(STORAGE_PREFIX + `${yk}_initialized`, 'true');
    localStorage.setItem(STORAGE_PREFIX + 'has_initialized_any_year', 'true');
  }, [projekKokurikulerList, schoolInfo?.academicYear]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'dplAssessments', JSON.stringify(dplAssessmentList));
    const yk = getYearStorageKey(schoolInfo?.academicYear);
    localStorage.setItem(STORAGE_PREFIX + `${yk}_dplAssessments`, JSON.stringify(dplAssessmentList));
    localStorage.setItem(STORAGE_PREFIX + `${yk}_initialized`, 'true');
    localStorage.setItem(STORAGE_PREFIX + 'has_initialized_any_year', 'true');
  }, [dplAssessmentList, schoolInfo?.academicYear]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'jurnalKokurikuler', JSON.stringify(jurnalKokurikulerList));
    const yk = getYearStorageKey(schoolInfo?.academicYear);
    localStorage.setItem(STORAGE_PREFIX + `${yk}_jurnalKokurikuler`, JSON.stringify(jurnalKokurikulerList));
    localStorage.setItem(STORAGE_PREFIX + `${yk}_initialized`, 'true');
    localStorage.setItem(STORAGE_PREFIX + 'has_initialized_any_year', 'true');
  }, [jurnalKokurikulerList, schoolInfo?.academicYear]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'artefakKokurikuler', JSON.stringify(artefakKokurikulerList));
    const yk = getYearStorageKey(schoolInfo?.academicYear);
    localStorage.setItem(STORAGE_PREFIX + `${yk}_artefakKokurikuler`, JSON.stringify(artefakKokurikulerList));
    localStorage.setItem(STORAGE_PREFIX + `${yk}_initialized`, 'true');
    localStorage.setItem(STORAGE_PREFIX + 'has_initialized_any_year', 'true');
  }, [artefakKokurikulerList, schoolInfo?.academicYear]);

  // Toast Helper
  const addToast = (type: 'success' | 'error' | 'info' | 'warning', title: string, message: string) => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts(prev => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Keep latest snapshot of all app data in ref for reliable unload flush
  const latestDataRef = React.useRef({
    currentUser,
    availableUsers,
    rolePermissions,
    schoolInfo,
    students,
    teachers,
    subjects,
    tujuanPembelajaranList,
    grades,
    attendanceRecords,
    journals,
    modulAjarList,
    schedule,
    transactions,
    weeklyDues,
    inventory,
    counseling,
    cleaningDuties,
    events,
    extracurriculars,
    studentReports,
    projekKokurikulerList,
    dplAssessmentList,
    jurnalKokurikulerList,
    artefakKokurikulerList
  });

  useEffect(() => {
    latestDataRef.current = {
      currentUser,
      availableUsers,
      rolePermissions,
      schoolInfo,
      students,
      teachers,
      subjects,
      tujuanPembelajaranList,
      grades,
      attendanceRecords,
      journals,
      modulAjarList,
      schedule,
      transactions,
      weeklyDues,
      inventory,
      counseling,
      cleaningDuties,
      events,
      extracurriculars,
      studentReports,
      projekKokurikulerList,
      dplAssessmentList,
      jurnalKokurikulerList,
      artefakKokurikulerList
    };
  }, [
    currentUser,
    availableUsers,
    rolePermissions,
    schoolInfo,
    students,
    teachers,
    subjects,
    tujuanPembelajaranList,
    grades,
    attendanceRecords,
    journals,
    modulAjarList,
    schedule,
    transactions,
    weeklyDues,
    inventory,
    counseling,
    cleaningDuties,
    events,
    extracurriculars,
    studentReports,
    projekKokurikulerList,
    dplAssessmentList,
    jurnalKokurikulerList,
    artefakKokurikulerList
  ]);

  // Synchronous flush on tab close / window unload / page reload
  useEffect(() => {
    const handleBeforeUnload = () => {
      try {
        const d = latestDataRef.current;
        const yk = getYearStorageKey(d.schoolInfo?.academicYear);
        localStorage.setItem(STORAGE_PREFIX + 'currentUser', JSON.stringify(d.currentUser));
        localStorage.setItem(STORAGE_PREFIX + 'users', JSON.stringify(d.availableUsers));
        localStorage.setItem(STORAGE_PREFIX + 'rolePermissions', JSON.stringify(d.rolePermissions));
        localStorage.setItem(STORAGE_PREFIX + 'schoolInfo', JSON.stringify(d.schoolInfo));
        localStorage.setItem(STORAGE_PREFIX + 'students', JSON.stringify(d.students));
        localStorage.setItem(STORAGE_PREFIX + `${yk}_students`, JSON.stringify(d.students));
        localStorage.setItem(STORAGE_PREFIX + 'teachers', JSON.stringify(d.teachers));
        localStorage.setItem(STORAGE_PREFIX + 'subjects', JSON.stringify(d.subjects));
        localStorage.setItem(STORAGE_PREFIX + 'tujuanPembelajaran', JSON.stringify(d.tujuanPembelajaranList));
        localStorage.setItem(STORAGE_PREFIX + 'grades', JSON.stringify(d.grades));
        localStorage.setItem(STORAGE_PREFIX + `${yk}_grades`, JSON.stringify(d.grades));
        localStorage.setItem(STORAGE_PREFIX + 'attendance', JSON.stringify(d.attendanceRecords));
        localStorage.setItem(STORAGE_PREFIX + `${yk}_attendance`, JSON.stringify(d.attendanceRecords));
        localStorage.setItem(STORAGE_PREFIX + 'journals', JSON.stringify(d.journals));
        localStorage.setItem(STORAGE_PREFIX + `${yk}_journals`, JSON.stringify(d.journals));
        localStorage.setItem(STORAGE_PREFIX + 'modulAjar', JSON.stringify(d.modulAjarList));
        localStorage.setItem(STORAGE_PREFIX + 'schedule', JSON.stringify(d.schedule));
        localStorage.setItem(STORAGE_PREFIX + 'transactions', JSON.stringify(d.transactions));
        localStorage.setItem(STORAGE_PREFIX + `${yk}_transactions`, JSON.stringify(d.transactions));
        localStorage.setItem(STORAGE_PREFIX + 'weeklyDues', JSON.stringify(d.weeklyDues));
        localStorage.setItem(STORAGE_PREFIX + `${yk}_weeklyDues`, JSON.stringify(d.weeklyDues));
        localStorage.setItem(STORAGE_PREFIX + 'inventory', JSON.stringify(d.inventory));
        localStorage.setItem(STORAGE_PREFIX + 'counseling', JSON.stringify(d.counseling));
        localStorage.setItem(STORAGE_PREFIX + `${yk}_counseling`, JSON.stringify(d.counseling));
        localStorage.setItem(STORAGE_PREFIX + 'cleaningDuties', JSON.stringify(d.cleaningDuties));
        localStorage.setItem(STORAGE_PREFIX + `${yk}_cleaningDuties`, JSON.stringify(d.cleaningDuties));
        localStorage.setItem(STORAGE_PREFIX + 'events', JSON.stringify(d.events));
        localStorage.setItem(STORAGE_PREFIX + `${yk}_events`, JSON.stringify(d.events));
        localStorage.setItem(STORAGE_PREFIX + 'extracurriculars', JSON.stringify(d.extracurriculars));
        localStorage.setItem(STORAGE_PREFIX + 'studentReports', JSON.stringify(d.studentReports));
        localStorage.setItem(STORAGE_PREFIX + `${yk}_studentReports`, JSON.stringify(d.studentReports));
        localStorage.setItem(STORAGE_PREFIX + 'projekKokurikuler', JSON.stringify(d.projekKokurikulerList));
        localStorage.setItem(STORAGE_PREFIX + `${yk}_projekKokurikuler`, JSON.stringify(d.projekKokurikulerList));
        localStorage.setItem(STORAGE_PREFIX + 'dplAssessments', JSON.stringify(d.dplAssessmentList));
        localStorage.setItem(STORAGE_PREFIX + `${yk}_dplAssessments`, JSON.stringify(d.dplAssessmentList));
        localStorage.setItem(STORAGE_PREFIX + 'jurnalKokurikuler', JSON.stringify(d.jurnalKokurikulerList));
        localStorage.setItem(STORAGE_PREFIX + `${yk}_jurnalKokurikuler`, JSON.stringify(d.jurnalKokurikulerList));
        localStorage.setItem(STORAGE_PREFIX + 'artefakKokurikuler', JSON.stringify(d.artefakKokurikulerList));
        localStorage.setItem(STORAGE_PREFIX + `${yk}_artefakKokurikuler`, JSON.stringify(d.artefakKokurikulerList));
        localStorage.setItem(STORAGE_PREFIX + `${yk}_initialized`, 'true');
        localStorage.setItem(STORAGE_PREFIX + 'has_initialized_any_year', 'true');
      } catch (e) {
        console.error('Error auto-flushing on unload:', e);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('pagehide', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('pagehide', handleBeforeUnload);
    };
  }, []);

  // Format timestamp helper for Indonesian locale
  const getFormattedTimestamp = () => {
    const now = new Date();
    const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const monthNames = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    const dayName = dayNames[now.getDay()];
    const day = now.getDate();
    const month = monthNames[now.getMonth()];
    const year = now.getFullYear();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    return `${dayName}, ${day} ${month} ${year} • ${hours}:${minutes}:${seconds} WIB`;
  };

  // Manual & Guaranteed Save All Data Function
  const saveAllData = (): { success: boolean; timestamp: string } => {
    const formatted = getFormattedTimestamp();
    try {
      const yk = getYearStorageKey(schoolInfo?.academicYear);
      localStorage.setItem(STORAGE_PREFIX + 'currentUser', JSON.stringify(currentUser));
      localStorage.setItem(STORAGE_PREFIX + 'users', JSON.stringify(availableUsers));
      localStorage.setItem(STORAGE_PREFIX + 'rolePermissions', JSON.stringify(rolePermissions));
      localStorage.setItem(STORAGE_PREFIX + 'schoolInfo', JSON.stringify(schoolInfo));
      localStorage.setItem(STORAGE_PREFIX + 'students', JSON.stringify(students));
      localStorage.setItem(STORAGE_PREFIX + `${yk}_students`, JSON.stringify(students));
      localStorage.setItem(STORAGE_PREFIX + 'teachers', JSON.stringify(teachers));
      localStorage.setItem(STORAGE_PREFIX + 'subjects', JSON.stringify(subjects));
      localStorage.setItem(STORAGE_PREFIX + 'tujuanPembelajaran', JSON.stringify(tujuanPembelajaranList));
      localStorage.setItem(STORAGE_PREFIX + 'grades', JSON.stringify(grades));
      localStorage.setItem(STORAGE_PREFIX + `${yk}_grades`, JSON.stringify(grades));
      localStorage.setItem(STORAGE_PREFIX + 'attendance', JSON.stringify(attendanceRecords));
      localStorage.setItem(STORAGE_PREFIX + `${yk}_attendance`, JSON.stringify(attendanceRecords));
      localStorage.setItem(STORAGE_PREFIX + 'journals', JSON.stringify(journals));
      localStorage.setItem(STORAGE_PREFIX + `${yk}_journals`, JSON.stringify(journals));
      localStorage.setItem(STORAGE_PREFIX + 'modulAjar', JSON.stringify(modulAjarList));
      localStorage.setItem(STORAGE_PREFIX + 'schedule', JSON.stringify(schedule));
      localStorage.setItem(STORAGE_PREFIX + 'transactions', JSON.stringify(transactions));
      localStorage.setItem(STORAGE_PREFIX + `${yk}_transactions`, JSON.stringify(transactions));
      localStorage.setItem(STORAGE_PREFIX + 'weeklyDues', JSON.stringify(weeklyDues));
      localStorage.setItem(STORAGE_PREFIX + `${yk}_weeklyDues`, JSON.stringify(weeklyDues));
      localStorage.setItem(STORAGE_PREFIX + 'inventory', JSON.stringify(inventory));
      localStorage.setItem(STORAGE_PREFIX + 'counseling', JSON.stringify(counseling));
      localStorage.setItem(STORAGE_PREFIX + `${yk}_counseling`, JSON.stringify(counseling));
      localStorage.setItem(STORAGE_PREFIX + 'cleaningDuties', JSON.stringify(cleaningDuties));
      localStorage.setItem(STORAGE_PREFIX + `${yk}_cleaningDuties`, JSON.stringify(cleaningDuties));
      localStorage.setItem(STORAGE_PREFIX + 'events', JSON.stringify(events));
      localStorage.setItem(STORAGE_PREFIX + `${yk}_events`, JSON.stringify(events));
      localStorage.setItem(STORAGE_PREFIX + 'extracurriculars', JSON.stringify(extracurriculars));
      localStorage.setItem(STORAGE_PREFIX + 'studentReports', JSON.stringify(studentReports));
      localStorage.setItem(STORAGE_PREFIX + `${yk}_studentReports`, JSON.stringify(studentReports));
      localStorage.setItem(STORAGE_PREFIX + 'projekKokurikuler', JSON.stringify(projekKokurikulerList));
      localStorage.setItem(STORAGE_PREFIX + `${yk}_projekKokurikuler`, JSON.stringify(projekKokurikulerList));
      localStorage.setItem(STORAGE_PREFIX + 'dplAssessments', JSON.stringify(dplAssessmentList));
      localStorage.setItem(STORAGE_PREFIX + `${yk}_dplAssessments`, JSON.stringify(dplAssessmentList));
      localStorage.setItem(STORAGE_PREFIX + 'jurnalKokurikuler', JSON.stringify(jurnalKokurikulerList));
      localStorage.setItem(STORAGE_PREFIX + `${yk}_jurnalKokurikuler`, JSON.stringify(jurnalKokurikulerList));
      localStorage.setItem(STORAGE_PREFIX + 'artefakKokurikuler', JSON.stringify(artefakKokurikulerList));
      localStorage.setItem(STORAGE_PREFIX + `${yk}_artefakKokurikuler`, JSON.stringify(artefakKokurikulerList));
      localStorage.setItem(STORAGE_PREFIX + `${yk}_initialized`, 'true');
      localStorage.setItem(STORAGE_PREFIX + 'has_initialized_any_year', 'true');
      localStorage.setItem(STORAGE_PREFIX + 'lastSavedAt', formatted);

      setLastSavedAt(formatted);

      addToast(
        'success',
        'Data Berhasil Disimpan',
        'Seluruh data kelas telah disimpan permanen. Data tetap aman dan sama persis saat aplikasi ditutup & dibuka kembali.'
      );

      return { success: true, timestamp: formatted };
    } catch (err) {
      console.error('Save error:', err);
      addToast('error', 'Gagal Menyimpan', 'Terjadi kendala saat menyimpan ke penyimpanan lokal browser.');
      return { success: false, timestamp: formatted };
    }
  };

  // Dark Mode
  const toggleDarkMode = () => {
    setIsDarkMode(prev => {
      const next = !prev;
      addToast('info', next ? 'Mode Malam Aktif' : 'Mode Terang Aktif', next ? 'Tampilan layar dialihkan ke tema gelap yang nyaman di mata.' : 'Tampilan layar dialihkan ke tema terang yang bersih.');
      return next;
    });
  };

  const setDarkMode = (enabled: boolean) => {
    setIsDarkMode(enabled);
    addToast('info', enabled ? 'Mode Malam Aktif' : 'Mode Terang Aktif', enabled ? 'Tampilan layar dialihkan ke tema gelap.' : 'Tampilan layar dialihkan ke tema terang.');
  };

  // User Management & RBAC Methods
  const hasPermission = (tab: ActiveTab, user?: UserProfile): boolean => {
    const targetUser = user || currentUser;
    if (!targetUser) return false;
    
    // Check if user has explicit custom tab overrides
    if (targetUser.customAllowedTabs && targetUser.customAllowedTabs.length > 0) {
      return targetUser.customAllowedTabs.includes(tab);
    }
    
    // Check role permissions
    const allowed = rolePermissions[targetUser.role] || DEFAULT_ROLE_PERMISSIONS[targetUser.role] || [];
    return allowed.includes(tab);
  };

  const addUser = (userData: Omit<UserProfile, 'id'>): { success: boolean; error?: string } => {
    const username = (userData.username || '').trim().toLowerCase();
    if (!username) {
      return { success: false, error: 'Username pengguna tidak boleh kosong.' };
    }

    if (availableUsers.some(u => (u.username || '').toLowerCase() === username)) {
      return { success: false, error: `Username "${username}" sudah digunakan akun lain.` };
    }

    const newUser: UserProfile = {
      ...userData,
      id: `user-${Date.now().toString().slice(-6)}`,
      username,
      status: userData.status || 'Aktif',
      createdAt: new Date().toISOString().split('T')[0]
    };

    setAvailableUsers(prev => [...prev, newUser]);
    addToast('success', 'Pengguna Ditambahkan', `Akun ${newUser.name} (${newUser.username}) berhasil didaftarkan.`);
    return { success: true };
  };

  const updateUser = (id: string, updated: Partial<UserProfile>): { success: boolean; error?: string } => {
    if (updated.username) {
      const cleanUname = updated.username.trim().toLowerCase();
      if (availableUsers.some(u => u.id !== id && (u.username || '').toLowerCase() === cleanUname)) {
        return { success: false, error: `Username "${cleanUname}" sudah digunakan akun lain.` };
      }
    }

    setAvailableUsers(prev => prev.map(u => {
      if (u.id === id) {
        const merged = { ...u, ...updated };
        if (currentUser.id === id) {
          setCurrentUser(merged);
        }
        return merged;
      }
      return u;
    }));

    addToast('success', 'Akun Diperbarui', 'Data profil & hak akses pengguna berhasil disimpan.');
    return { success: true };
  };

  const deleteUser = (id: string): { success: boolean; error?: string } => {
    if (currentUser.id === id) {
      return { success: false, error: 'Tidak dapat menghapus akun yang sedang aktif login.' };
    }

    const target = availableUsers.find(u => u.id === id);
    if (!target) {
      return { success: false, error: 'Pengguna tidak ditemukan.' };
    }

    // Ensure at least one admin remains
    if (target.role === 'admin') {
      const adminCount = availableUsers.filter(u => u.role === 'admin').length;
      if (adminCount <= 1) {
        return { success: false, error: 'Sistem harus memiliki minimal satu akun Administrator/Kepala Sekolah.' };
      }
    }

    setAvailableUsers(prev => prev.filter(u => u.id !== id));
    addToast('info', 'Akun Dihapus', `Akun ${target.name} telah dihapus dari sistem.`);
    return { success: true };
  };

  const toggleUserStatus = (id: string) => {
    if (currentUser.id === id) {
      addToast('warning', 'Peringatan', 'Tidak dapat menonaktifkan akun sendiri yang sedang aktif.');
      return;
    }

    setAvailableUsers(prev => prev.map(u => {
      if (u.id === id) {
        const nextStatus = u.status === 'Nonaktif' ? 'Aktif' : 'Nonaktif';
        addToast('info', 'Status Akun Diubah', `Akun ${u.name} sekarang berstatus ${nextStatus}.`);
        return { ...u, status: nextStatus };
      }
      return u;
    }));
  };

  const resetUserPassword = (id: string, newPass: string) => {
    const cleanPass = newPass.trim();
    if (!cleanPass) {
      addToast('error', 'Gagal', 'Kata sandi baru tidak boleh kosong.');
      return;
    }

    setAvailableUsers(prev => prev.map(u => {
      if (u.id === id) {
        return { ...u, password: cleanPass };
      }
      return u;
    }));

    if (currentUser.id === id) {
      setCurrentUser(prev => ({ ...prev, password: cleanPass }));
    }

    addToast('success', 'Sandi Direset', 'Kata sandi akun pengguna berhasil diperbarui.');
  };

  const updateRolePermissions = (role: UserRole, tabs: ActiveTab[]) => {
    setRolePermissions(prev => ({
      ...prev,
      [role]: tabs
    }));
    addToast('success', 'Hak Akses Disimpan', `Pengaturan menu untuk peran ${role.toUpperCase()} berhasil diperbarui.`);
  };

  const resetRolePermissionsToDefault = () => {
    setRolePermissions(DEFAULT_ROLE_PERMISSIONS);
    addToast('info', 'Reset Hak Akses', 'Matriks hak akses menu dikembalikan ke konfigurasi standar sekolah.');
  };

  // Authentication Methods
  const login = (identifier: string, password: string): { success: boolean; error?: string } => {
    const cleanId = identifier.trim().toLowerCase().replace(/\s+/g, '');
    const cleanPassword = password.trim();

    if (!cleanId) {
      return { success: false, error: 'Silakan masukkan ID Pengguna, Username, Email, atau NIP/NISN.' };
    }
    if (!cleanPassword) {
      return { success: false, error: 'Silakan isi kolom kata sandi akun Anda.' };
    }

    // Match by username, email, or nipOrNisn
    const matchedUser = availableUsers.find(u => {
      const uName = (u.username || '').toLowerCase();
      const uEmail = u.email.toLowerCase();
      const uNip = (u.nipOrNisn || '').toLowerCase().replace(/\s+/g, '');
      return uName === cleanId || uEmail === cleanId || uNip === cleanId;
    });

    if (!matchedUser) {
      return { 
        success: false, 
        error: 'Akun tidak ditemukan. Gunakan ID/Email demo: guru4a, admin, gurupai, atau siswa01' 
      };
    }

    // Check account active status
    if (matchedUser.status === 'Nonaktif') {
      return {
        success: false,
        error: 'Akun ini sedang DINONAKTIFKAN oleh Administrator. Silakan hubungi Kepala Sekolah/Admin.'
      };
    }

    // Check password
    const validPassword = matchedUser.password || '123456';
    if (cleanPassword !== validPassword && cleanPassword !== 'guru123' && cleanPassword !== 'admin123' && cleanPassword !== 'mapel123' && cleanPassword !== 'siswa123' && cleanPassword !== '123456') {
      return { 
        success: false, 
        error: 'Kata sandi tidak sesuai. Silakan periksa kembali atau gunakan akun demo.' 
      };
    }

    // Update lastLogin timestamp
    const nowIso = new Date().toISOString();
    const updatedUser = { ...matchedUser, lastLogin: nowIso };
    
    setAvailableUsers(prev => prev.map(u => u.id === matchedUser.id ? updatedUser : u));
    setCurrentUser(updatedUser);
    setIsAuthenticated(true);
    
    // Check if the current tab is permitted for this user
    if (!hasPermission(currentTab, updatedUser)) {
      const userAllowed = rolePermissions[updatedUser.role] || DEFAULT_ROLE_PERMISSIONS[updatedUser.role] || ['dashboard'];
      setCurrentTab(userAllowed[0] || 'dashboard');
    }

    localStorage.setItem(STORAGE_PREFIX + 'isAuthenticated', JSON.stringify(true));
    localStorage.setItem(STORAGE_PREFIX + 'currentUser', JSON.stringify(updatedUser));

    addToast('success', 'Berhasil Masuk', `Selamat datang di Dashboard Administrasi SD, ${matchedUser.name}!`);
    return { success: true };
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.setItem(STORAGE_PREFIX + 'isAuthenticated', JSON.stringify(false));
    addToast('info', 'Sesi Berakhir', 'Anda telah keluar dari aplikasi Administrasi Kelas.');
  };

  // Switch Role
  const switchUserRole = (role: UserRole) => {
    const target = availableUsers.find(u => u.role === role) || availableUsers[0];
    setCurrentUser(target);

    // Verify current tab permissions
    if (!hasPermission(currentTab, target)) {
      const allowed = rolePermissions[target.role] || DEFAULT_ROLE_PERMISSIONS[target.role] || ['dashboard'];
      setCurrentTab(allowed[0] || 'dashboard');
    }

    addToast('info', 'Role Diperbarui', `Beralih ke akun ${target.name} (${target.title})`);
  };

  // Academic Year Multi-Year Management
  const switchAcademicYear = (targetYear: string) => {
    const trimmedTarget = targetYear.trim();
    if (!trimmedTarget) return;

    const currentYear = schoolInfo?.academicYear || INITIAL_SCHOOL_INFO.academicYear || '2025/2026';
    if (trimmedTarget === currentYear) {
      return;
    }

    // 1. Synchronously save all current in-memory state under currentYear's storage key
    const currYk = getYearStorageKey(currentYear);
    try {
      localStorage.setItem(STORAGE_PREFIX + `${currYk}_students`, JSON.stringify(students));
      localStorage.setItem(STORAGE_PREFIX + `${currYk}_grades`, JSON.stringify(grades));
      localStorage.setItem(STORAGE_PREFIX + `${currYk}_studentReports`, JSON.stringify(studentReports));
      localStorage.setItem(STORAGE_PREFIX + `${currYk}_attendance`, JSON.stringify(attendanceRecords));
      localStorage.setItem(STORAGE_PREFIX + `${currYk}_journals`, JSON.stringify(journals));
      localStorage.setItem(STORAGE_PREFIX + `${currYk}_transactions`, JSON.stringify(transactions));
      localStorage.setItem(STORAGE_PREFIX + `${currYk}_weeklyDues`, JSON.stringify(weeklyDues));
      localStorage.setItem(STORAGE_PREFIX + `${currYk}_cleaningDuties`, JSON.stringify(cleaningDuties));
      localStorage.setItem(STORAGE_PREFIX + `${currYk}_counseling`, JSON.stringify(counseling));
      localStorage.setItem(STORAGE_PREFIX + `${currYk}_events`, JSON.stringify(events));
      localStorage.setItem(STORAGE_PREFIX + `${currYk}_projekKokurikuler`, JSON.stringify(projekKokurikulerList));
      localStorage.setItem(STORAGE_PREFIX + `${currYk}_dplAssessments`, JSON.stringify(dplAssessmentList));
      localStorage.setItem(STORAGE_PREFIX + `${currYk}_jurnalKokurikuler`, JSON.stringify(jurnalKokurikulerList));
      localStorage.setItem(STORAGE_PREFIX + `${currYk}_artefakKokurikuler`, JSON.stringify(artefakKokurikulerList));
      localStorage.setItem(STORAGE_PREFIX + `${currYk}_initialized`, 'true');
      localStorage.setItem(STORAGE_PREFIX + 'has_initialized_any_year', 'true');
    } catch (e) {
      console.warn('Error saving current year data before switch:', e);
    }

    // 2. Ensure target year is registered in availableAcademicYears
    setAvailableAcademicYears(prev => {
      if (!prev.includes(trimmedTarget)) {
        const nextYears = [...prev, trimmedTarget].sort();
        try {
          localStorage.setItem(STORAGE_PREFIX + 'availableYears', JSON.stringify(nextYears));
        } catch {}
        return nextYears;
      }
      return prev;
    });

    // 3. Check if targetYear already has initialized data
    const nextYk = getYearStorageKey(trimmedTarget);
    const isTargetInit = localStorage.getItem(STORAGE_PREFIX + `${nextYk}_initialized`) === 'true';

    let nextStudents: Student[] = [];
    let nextGrades: GradeRecord[] = [];
    let nextReports: Record<string, StudentReportData> = {};
    let nextAttendance: AttendanceRecord[] = [];
    let nextJournals: TeachingJournal[] = [];
    let nextTransactions: CashTransaction[] = [];
    let nextWeeklyDues: StudentWeeklyDues[] = [];
    let nextDuties: CleaningDuty[] = [];
    let nextCounseling: CounselingRecord[] = [];
    let nextEvents: SchoolEvent[] = [];
    let nextProjek: ProjekKokurikuler[] = [];
    let nextDpl: SiswaDPLCapaianRecord[] = [];
    let nextJurnalKok: JurnalAktivitasKokurikuler[] = [];
    let nextArtefakKok: ArtefakKaryaKokurikuler[] = [];

    if (isTargetInit) {
      // Load saved data for this specific academic year
      try {
        const rawStudents = localStorage.getItem(STORAGE_PREFIX + `${nextYk}_students`);
        if (rawStudents) nextStudents = JSON.parse(rawStudents) || [];

        const rawGrades = localStorage.getItem(STORAGE_PREFIX + `${nextYk}_grades`);
        if (rawGrades) nextGrades = JSON.parse(rawGrades) || [];

        const rawReports = localStorage.getItem(STORAGE_PREFIX + `${nextYk}_studentReports`);
        if (rawReports) nextReports = JSON.parse(rawReports) || {};

        const rawAtt = localStorage.getItem(STORAGE_PREFIX + `${nextYk}_attendance`);
        if (rawAtt) nextAttendance = JSON.parse(rawAtt) || [];

        const rawJournals = localStorage.getItem(STORAGE_PREFIX + `${nextYk}_journals`);
        if (rawJournals) nextJournals = JSON.parse(rawJournals) || [];

        const rawTx = localStorage.getItem(STORAGE_PREFIX + `${nextYk}_transactions`);
        if (rawTx) nextTransactions = JSON.parse(rawTx) || [];

        const rawDues = localStorage.getItem(STORAGE_PREFIX + `${nextYk}_weeklyDues`);
        if (rawDues) nextWeeklyDues = JSON.parse(rawDues) || [];

        const rawDuties = localStorage.getItem(STORAGE_PREFIX + `${nextYk}_cleaningDuties`);
        if (rawDuties) nextDuties = JSON.parse(rawDuties) || [];

        const rawCounseling = localStorage.getItem(STORAGE_PREFIX + `${nextYk}_counseling`);
        if (rawCounseling) nextCounseling = JSON.parse(rawCounseling) || [];

        const rawEvents = localStorage.getItem(STORAGE_PREFIX + `${nextYk}_events`);
        if (rawEvents) nextEvents = JSON.parse(rawEvents) || [];

        const rawProjek = localStorage.getItem(STORAGE_PREFIX + `${nextYk}_projekKokurikuler`);
        if (rawProjek) nextProjek = JSON.parse(rawProjek) || [];

        const rawDpl = localStorage.getItem(STORAGE_PREFIX + `${nextYk}_dplAssessments`);
        if (rawDpl) nextDpl = JSON.parse(rawDpl) || [];

        const rawJurnalKok = localStorage.getItem(STORAGE_PREFIX + `${nextYk}_jurnalKokurikuler`);
        if (rawJurnalKok) nextJurnalKok = JSON.parse(rawJurnalKok) || [];

        const rawArtefakKok = localStorage.getItem(STORAGE_PREFIX + `${nextYk}_artefakKokurikuler`);
        if (rawArtefakKok) nextArtefakKok = JSON.parse(rawArtefakKok) || [];
      } catch (err) {
        console.error('Error parsing existing year data:', err);
      }
    } else {
      // BRAND NEW ACADEMIC YEAR: Fresh clean slate (No students, no score 0)
      localStorage.setItem(STORAGE_PREFIX + `${nextYk}_students`, JSON.stringify([]));
      localStorage.setItem(STORAGE_PREFIX + `${nextYk}_grades`, JSON.stringify([]));
      localStorage.setItem(STORAGE_PREFIX + `${nextYk}_studentReports`, JSON.stringify({}));
      localStorage.setItem(STORAGE_PREFIX + `${nextYk}_attendance`, JSON.stringify([]));
      localStorage.setItem(STORAGE_PREFIX + `${nextYk}_journals`, JSON.stringify([]));
      localStorage.setItem(STORAGE_PREFIX + `${nextYk}_transactions`, JSON.stringify([]));
      localStorage.setItem(STORAGE_PREFIX + `${nextYk}_weeklyDues`, JSON.stringify([]));
      localStorage.setItem(STORAGE_PREFIX + `${nextYk}_cleaningDuties`, JSON.stringify([]));
      localStorage.setItem(STORAGE_PREFIX + `${nextYk}_counseling`, JSON.stringify([]));
      localStorage.setItem(STORAGE_PREFIX + `${nextYk}_events`, JSON.stringify([]));
      localStorage.setItem(STORAGE_PREFIX + `${nextYk}_projekKokurikuler`, JSON.stringify([]));
      localStorage.setItem(STORAGE_PREFIX + `${nextYk}_dplAssessments`, JSON.stringify([]));
      localStorage.setItem(STORAGE_PREFIX + `${nextYk}_jurnalKokurikuler`, JSON.stringify([]));
      localStorage.setItem(STORAGE_PREFIX + `${nextYk}_artefakKokurikuler`, JSON.stringify([]));
      localStorage.setItem(STORAGE_PREFIX + `${nextYk}_initialized`, 'true');
      localStorage.setItem(STORAGE_PREFIX + 'has_initialized_any_year', 'true');
    }

    // 4. Update React states
    setStudents(nextStudents);
    setGrades(nextGrades);
    setStudentReports(nextReports);
    setAttendanceRecords(nextAttendance);
    setJournals(nextJournals);
    setTransactions(nextTransactions);
    setWeeklyDues(nextWeeklyDues);
    setCleaningDuties(nextDuties);
    setCounseling(nextCounseling);
    setEvents(nextEvents);
    setProjekKokurikulerList(nextProjek);
    setDplAssessmentList(nextDpl);
    setJurnalKokurikulerList(nextJurnalKok);
    setArtefakKokurikulerList(nextArtefakKok);

    // 5. Update general storage to match the new active year
    try {
      localStorage.setItem(STORAGE_PREFIX + 'students', JSON.stringify(nextStudents));
      localStorage.setItem(STORAGE_PREFIX + 'grades', JSON.stringify(nextGrades));
      localStorage.setItem(STORAGE_PREFIX + 'studentReports', JSON.stringify(nextReports));
      localStorage.setItem(STORAGE_PREFIX + 'attendance', JSON.stringify(nextAttendance));
      localStorage.setItem(STORAGE_PREFIX + 'journals', JSON.stringify(nextJournals));
      localStorage.setItem(STORAGE_PREFIX + 'transactions', JSON.stringify(nextTransactions));
      localStorage.setItem(STORAGE_PREFIX + 'weeklyDues', JSON.stringify(nextWeeklyDues));
      localStorage.setItem(STORAGE_PREFIX + 'cleaningDuties', JSON.stringify(nextDuties));
      localStorage.setItem(STORAGE_PREFIX + 'counseling', JSON.stringify(nextCounseling));
      localStorage.setItem(STORAGE_PREFIX + 'events', JSON.stringify(nextEvents));
      localStorage.setItem(STORAGE_PREFIX + 'projekKokurikuler', JSON.stringify(nextProjek));
      localStorage.setItem(STORAGE_PREFIX + 'dplAssessments', JSON.stringify(nextDpl));
      localStorage.setItem(STORAGE_PREFIX + 'jurnalKokurikuler', JSON.stringify(nextJurnalKok));
      localStorage.setItem(STORAGE_PREFIX + 'artefakKokurikuler', JSON.stringify(nextArtefakKok));
    } catch {}

    // 6. Update schoolInfo with new academicYear
    const updatedSchoolInfo: SchoolInfo = {
      ...schoolInfo,
      academicYear: trimmedTarget
    };
    setSchoolInfo(updatedSchoolInfo);
    try {
      localStorage.setItem(STORAGE_PREFIX + 'schoolInfo', JSON.stringify(updatedSchoolInfo));
    } catch {}
    syncSchoolInfo(updatedSchoolInfo).catch(err => console.warn('[Firestore] Sync schoolInfo warning:', err));

    // 7. Informative Toast
    if (isTargetInit) {
      addToast(
        'info',
        `Tahun Pelajaran: ${trimmedTarget}`,
        `Beralih ke Tahun Pelajaran ${trimmedTarget}. Memuat ${nextStudents.length} data siswa dan riwayat penilaian tersimpan.`
      );
    } else {
      addToast(
        'success',
        `Tahun Pelajaran Baru: ${trimmedTarget}`,
        `Tahun Pelajaran ${trimmedTarget} aktif! Data awal masih kosong (0 siswa & tanpa nilai 0), siap diinput.`
      );
    }
  };

  const addAcademicYear = (year: string) => {
    const trimmed = year.trim();
    if (!trimmed) return;
    setAvailableAcademicYears(prev => {
      if (!prev.includes(trimmed)) {
        const nextYears = [...prev, trimmed].sort();
        try {
          localStorage.setItem(STORAGE_PREFIX + 'availableYears', JSON.stringify(nextYears));
        } catch {}
        return nextYears;
      }
      return prev;
    });
    switchAcademicYear(trimmed);
  };

  const getStudentCountForYear = (year: string): number => {
    if (year === schoolInfo?.academicYear) {
      return students.length;
    }
    const yk = getYearStorageKey(year);
    const isInit = localStorage.getItem(STORAGE_PREFIX + `${yk}_initialized`) === 'true';
    if (!isInit) {
      if (year === INITIAL_SCHOOL_INFO.academicYear || year === '2025/2026') {
        const hasInitAny = localStorage.getItem(STORAGE_PREFIX + 'has_initialized_any_year') === 'true';
        if (!hasInitAny) return INITIAL_STUDENTS.length;
      }
      return 0;
    }
    try {
      const raw = localStorage.getItem(STORAGE_PREFIX + `${yk}_students`);
      if (!raw) return 0;
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed.length : 0;
    } catch {
      return 0;
    }
  };

  // School Info
  const updateSchoolInfo = (info: Partial<SchoolInfo>) => {
    // If academicYear changed in info, trigger switchAcademicYear first
    if (info.academicYear && info.academicYear.trim() && info.academicYear.trim() !== schoolInfo?.academicYear) {
      switchAcademicYear(info.academicYear.trim());
    }

    let semesterChanged = false;
    let newSemester = '';

    setSchoolInfo(prev => {
      const merged = { ...prev, ...info };
      if (info.semester && info.semester !== prev.semester) {
        semesterChanged = true;
        newSemester = info.semester;
        const isNowGenap = isSemesterGenap(info.semester);

        // Otomatis sesuaikan titimangsa standar jika belum dicustom pengguna
        if (!info.tanggalRapor) {
          merged.tanggalRapor = isNowGenap
            ? `${merged.city || 'Kota Jakarta Selatan'}, 20 Juni 2027`
            : `${merged.city || 'Kota Jakarta Selatan'}, 19 Desember 2026`;
        }
        if (!info.tanggalRaporMid) {
          merged.tanggalRaporMid = isNowGenap
            ? `${merged.city || 'Kota Jakarta Selatan'}, 28 Maret 2027`
            : `${merged.city || 'Kota Jakarta Selatan'}, 10 Oktober 2026`;
        }
      }

      // If tanggalRapor, tanggalRaporMid, or semester changed, also sync all student reports
      if (info.tanggalRapor || info.tanggalRaporMid || semesterChanged) {
        const targetTanggal = merged.tanggalRapor;
        const targetTanggalMid = merged.tanggalRaporMid;
        setStudentReports(prevReports => {
          const updatedReports: Record<string, StudentReportData> = {};
          Object.keys(prevReports).forEach(id => {
            updatedReports[id] = {
              ...prevReports[id],
              tempatTanggalRapor: targetTanggal || prevReports[id].tempatTanggalRapor,
              tempatTanggalRaporMid: targetTanggalMid || prevReports[id].tempatTanggalRaporMid
            };
          });
          localStorage.setItem(STORAGE_PREFIX + 'studentReports', JSON.stringify(updatedReports));
          return updatedReports;
        });
      }

      localStorage.setItem(STORAGE_PREFIX + 'schoolInfo', JSON.stringify(merged));
      syncSchoolInfo(merged).catch(err => console.warn('[Firestore] Sync schoolInfo warning:', err));
      return merged;
    });

    if (semesterChanged) {
      const norm = normalizeSemester(newSemester);
      addToast(
        'info',
        `Semester Aktif: ${norm}`,
        `Sistem beralih ke ${norm}. Nilai semester sebelumnya tersimpan aman dan tidak akan hilang. Nilai ${norm} siap diinput (dimulai dari 0 untuk nilai baru).`
      );
    } else if (!info.academicYear || info.academicYear.trim() === schoolInfo?.academicYear) {
      addToast('success', 'Berhasil', 'Informasi sekolah & kelas berhasil diperbarui');
    }
  };

  const updateGlobalReportDate = (
    type: 'semester' | 'mid_semester' | 'both',
    dateSemester?: string,
    dateMid?: string,
    silent: boolean = false
  ) => {
    setSchoolInfo(prev => {
      const nextInfo: SchoolInfo = {
        ...prev,
        ...(type === 'semester' || type === 'both' ? (dateSemester ? { tanggalRapor: dateSemester } : {}) : {}),
        ...(type === 'mid_semester' || type === 'both' ? (dateMid ? { tanggalRaporMid: dateMid } : {}) : {})
      };
      localStorage.setItem(STORAGE_PREFIX + 'schoolInfo', JSON.stringify(nextInfo));
      syncSchoolInfo(nextInfo).catch(err => console.warn('[Firestore] Sync schoolInfo warning:', err));
      return nextInfo;
    });

    setStudentReports(prev => {
      const updatedReports: Record<string, StudentReportData> = {};
      Object.keys(prev).forEach(id => {
        updatedReports[id] = {
          ...prev[id],
          ...(type === 'semester' || type === 'both' ? (dateSemester ? { tempatTanggalRapor: dateSemester } : {}) : {}),
          ...(type === 'mid_semester' || type === 'both' ? (dateMid ? { tempatTanggalRaporMid: dateMid } : {}) : {})
        };
      });
      localStorage.setItem(STORAGE_PREFIX + 'studentReports', JSON.stringify(updatedReports));
      return updatedReports;
    });

    if (!silent) {
      addToast(
        'success',
        'Penanggalan Rapor Disinkronkan',
        'Titimangsa pengesahan rapor berhasil diperbarui dan diterapkan ke seluruh siswa.'
      );
    }
  };

  // Student CRUD
  const addStudent = (studentData: Omit<Student, 'id'>) => {
    const newStudent: Student = {
      ...studentData,
      id: `sis-${Date.now().toString().slice(-4)}`
    };
    setStudents(prev => [...prev, newStudent]);
    
    // Also initialize dues for new student
    setWeeklyDues(prev => [
      ...prev,
      {
        id: `dues-${newStudent.id}`,
        siswaId: newStudent.id,
        bulan: 'Agustus 2026',
        minggu1: false,
        minggu2: false,
        minggu3: false,
        minggu4: false,
        nominalPerMinggu: 10000
      }
    ]);

    addToast('success', 'Siswa Ditambahkan', `${newStudent.nama} berhasil didaftarkan ke Kelas.`);
    syncStudent(newStudent).catch(err => console.warn('[Firestore] Sync student warning:', err));
  };

  const updateStudent = (id: string, updated: Partial<Student>) => {
    setStudents(prev => {
      const next = prev.map(s => s.id === id ? { ...s, ...updated } : s);
      const target = next.find(s => s.id === id);
      if (target) {
        syncStudent(target).catch(err => console.warn('[Firestore] Sync student update warning:', err));
      }
      return next;
    });
    addToast('success', 'Data Diperbarui', 'Data biodata siswa berhasil disimpan.');
  };

  const deleteStudent = (id: string) => {
    const s = students.find(item => item.id === id);
    setStudents(prev => prev.filter(item => item.id !== id));
    setGrades(prev => prev.filter(g => g.siswaId !== id));
    setAttendanceRecords(prev => prev.filter(a => a.siswaId !== id));
    setWeeklyDues(prev => prev.filter(d => d.siswaId !== id));
    setCounseling(prev => prev.filter(c => c.siswaId !== id));
    setExtracurriculars(prev => prev.filter(e => e.siswaId !== id));
    setStudentReports(prev => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
    setCleaningDuties(prev => prev.map(d => ({
      ...d,
      siswaIds: d.siswaIds.filter(sId => sId !== id),
      ketuaPiket: d.ketuaPiket === id ? '' : d.ketuaPiket
    })));
    deleteStudentDoc(id).catch(err => console.warn('[Firestore] Delete student doc warning:', err));
    addToast('warning', 'Siswa Dihapus', `Data ${s?.nama || 'Siswa'} telah dihapus dari kelas.`);
  };

  const deleteAllStudents = () => {
    const count = students.length;
    setStudents([]);
    setGrades([]);
    setAttendanceRecords([]);
    setWeeklyDues([]);
    setCounseling([]);
    setExtracurriculars([]);
    setStudentReports({});
    setCleaningDuties(prev => prev.map(d => ({ ...d, siswaIds: [], ketuaPiket: '' })));
    addToast('warning', 'Semua Siswa Dihapus', `Berhasil menghapus seluruh data siswa (${count} peserta didik) beserta seluruh riwayat nilai, presensi, dan data konseling.`);
  };

  const deleteSelectedStudents = (ids: string[]) => {
    if (!ids || ids.length === 0) return;
    const idSet = new Set(ids);
    setStudents(prev => prev.filter(s => !idSet.has(s.id)));
    setGrades(prev => prev.filter(g => !idSet.has(g.siswaId)));
    setAttendanceRecords(prev => prev.filter(a => !idSet.has(a.siswaId)));
    setWeeklyDues(prev => prev.filter(d => !idSet.has(d.siswaId)));
    setCounseling(prev => prev.filter(c => !idSet.has(c.siswaId)));
    setExtracurriculars(prev => prev.filter(e => !idSet.has(e.siswaId)));
    setStudentReports(prev => {
      const copy = { ...prev };
      ids.forEach(id => delete copy[id]);
      return copy;
    });
    setCleaningDuties(prev => prev.map(d => ({
      ...d,
      siswaIds: d.siswaIds.filter(sId => !idSet.has(sId)),
      ketuaPiket: idSet.has(d.ketuaPiket) ? '' : d.ketuaPiket
    })));
    addToast('warning', 'Siswa Terpilih Dihapus', `${ids.length} data siswa berhasil dihapus dari kelas.`);
  };

  const restoreSampleStudents = () => {
    setStudents(INITIAL_STUDENTS);
    setGrades(generateInitialGrades());
    setAttendanceRecords(generateInitialAttendance());
    setWeeklyDues(generateInitialDues());
    setStudentReports(generateInitialStudentReports());
    addToast('success', 'Data Contoh Dimuat', `${INITIAL_STUDENTS.length} data siswa dan nilai contoh berhasil dipulihkan.`);
  };

  const getStudentById = (id: string) => students.find(s => s.id === id);

  const bulkImportStudents = (importedStudents: Student[], mode: 'append' | 'replace' = 'append') => {
    if (!importedStudents || importedStudents.length === 0) return;

    let finalStudents: Student[] = [];

    if (mode === 'replace') {
      finalStudents = [...importedStudents];

      // Re-initialize weekly dues for replaced students
      const newDues: StudentWeeklyDues[] = finalStudents.map(s => ({
        id: `dues-${s.id}`,
        siswaId: s.id,
        bulan: 'Agustus 2026',
        minggu1: false,
        minggu2: false,
        minggu3: false,
        minggu4: false,
        nominalPerMinggu: 10000
      }));

      // Re-initialize student reports for replaced students
      const newReports: Record<string, StudentReportData> = {};
      finalStudents.forEach(s => {
        newReports[s.id] = {
          siswaId: s.id,
          ranking: '-',
          rankingMid: '-',
          totalNilai: 0,
          rataRataNilai: 0,
          totalNilaiMid: 0,
          rataRataNilaiMid: 0,
          statusKenaikan: 'Naik Kelas',
          targetKelas: 'V (Lima)',
          keteranganKenaikan: `Berdasarkan pencapaian seluruh tujuan pembelajaran, ananda ${s.nama} dinyatakan Naik Kelas.`,
          catatanWaliKelas: 'Menunjukkan perkembangan belajar yang baik dan aktif dalam kegiatan kelas.',
          catatanWaliKelasMid: 'Menunjukkan kesungguhan dan keaktifan belajar yang baik.',
          deskripsiKokurikuler: '',
          tanggapanOrangTua: '',
          tempatTanggalRapor: `${schoolInfo.city}, 20 Juni 2027`,
          tempatTanggalRaporMid: `${schoolInfo.city}, 10 Oktober 2026`,
          showRanking: true,
          showKenaikan: true
        };
      });

      setStudents(finalStudents);
      setWeeklyDues(newDues);
      setStudentReports(newReports);

      localStorage.setItem(STORAGE_PREFIX + 'students', JSON.stringify(finalStudents));
      localStorage.setItem(STORAGE_PREFIX + 'weeklyDues', JSON.stringify(newDues));
      localStorage.setItem(STORAGE_PREFIX + 'studentReports', JSON.stringify(newReports));
    } else {
      // Append / Merge by NISN or NIS or id
      const studentMap = new Map<string, Student>();
      students.forEach(s => {
        const key = (s.nisn && s.nisn.trim()) || (s.nis && s.nis.trim()) || s.id;
        studentMap.set(key, s);
      });

      importedStudents.forEach(s => {
        const key = (s.nisn && s.nisn.trim()) || (s.nis && s.nis.trim()) || s.id;
        if (studentMap.has(key)) {
          studentMap.set(key, { ...studentMap.get(key)!, ...s });
        } else {
          studentMap.set(key, s);
        }
      });

      finalStudents = Array.from(studentMap.values());
      finalStudents = finalStudents.map((s, idx) => ({
        ...s,
        nomorAbsen: s.nomorAbsen || (idx + 1)
      }));

      // Ensure dues exist for all students
      setWeeklyDues(prev => {
        const existingIds = new Set(prev.map(d => d.siswaId));
        const addedDues: StudentWeeklyDues[] = [];
        finalStudents.forEach(s => {
          if (!existingIds.has(s.id)) {
            addedDues.push({
              id: `dues-${s.id}`,
              siswaId: s.id,
              bulan: 'Agustus 2026',
              minggu1: false,
              minggu2: false,
              minggu3: false,
              minggu4: false,
              nominalPerMinggu: 10000
            });
          }
        });
        const updated = [...prev, ...addedDues];
        localStorage.setItem(STORAGE_PREFIX + 'weeklyDues', JSON.stringify(updated));
        return updated;
      });

      // Ensure reports exist for all students
      setStudentReports(prev => {
        const updated = { ...prev };
        finalStudents.forEach(s => {
          if (!updated[s.id]) {
            updated[s.id] = {
              siswaId: s.id,
              ranking: '-',
              rankingMid: '-',
              totalNilai: 0,
              rataRataNilai: 0,
              totalNilaiMid: 0,
              rataRataNilaiMid: 0,
              statusKenaikan: 'Naik Kelas',
              targetKelas: 'V (Lima)',
              keteranganKenaikan: `Berdasarkan pencapaian seluruh tujuan pembelajaran, ananda ${s.nama} dinyatakan Naik Kelas.`,
              catatanWaliKelas: 'Menunjukkan perkembangan belajar yang baik dan aktif dalam kegiatan kelas.',
              catatanWaliKelasMid: 'Menunjukkan kesungguhan dan keaktifan belajar yang baik.',
              deskripsiKokurikuler: '',
              tanggapanOrangTua: '',
              tempatTanggalRapor: `${schoolInfo.city}, 20 Juni 2027`,
              tempatTanggalRaporMid: `${schoolInfo.city}, 10 Oktober 2026`,
              showRanking: true,
              showKenaikan: true
            };
          }
        });
        localStorage.setItem(STORAGE_PREFIX + 'studentReports', JSON.stringify(updated));
        return updated;
      });

      setStudents(finalStudents);
      localStorage.setItem(STORAGE_PREFIX + 'students', JSON.stringify(finalStudents));
    }

    // Persist each student to Firestore in background
    finalStudents.forEach(s => {
      syncStudent(s).catch(err => console.warn('[Firestore] Sync student warning:', err));
    });

    addToast(
      'success',
      'Data Siswa & Buku Induk Diperbarui',
      `Berhasil memproses ${importedStudents.length} peserta didik. Total ${finalStudents.length} siswa tersimpan di Data Siswa & Buku Induk.`
    );
  };

  // Teacher CRUD
  const addTeacher = (teacherData: Omit<Teacher, 'id'>) => {
    const newTeacher: Teacher = {
      ...teacherData,
      id: `guru-${Date.now().toString().slice(-4)}`
    };
    setTeachers(prev => [newTeacher, ...prev]);
    addToast('success', 'Guru Ditambahkan', `${newTeacher.nama} berhasil ditambahkan ke daftar pendidik & tendik.`);
  };

  const updateTeacher = (id: string, updated: Partial<Teacher>) => {
    setTeachers(prev => prev.map(t => t.id === id ? { ...t, ...updated } : t));
    
    // If the updated teacher is the headmaster or homeroom teacher, keep schoolInfo in sync if needed
    const currentT = teachers.find(t => t.id === id);
    if (currentT) {
      if (updated.jabatan?.toLowerCase().includes('kepala sekolah') || currentT.jabatan.toLowerCase().includes('kepala sekolah')) {
        if (updated.nama || updated.nip) {
          setSchoolInfo(prev => ({
            ...prev,
            ...(updated.nama ? { headmasterName: updated.nama } : {}),
            ...(updated.nip ? { headmasterNip: updated.nip } : {})
          }));
        }
      }
      if (updated.jabatan?.toLowerCase().includes('wali kelas') || currentT.jabatan.toLowerCase().includes('wali kelas')) {
        if (updated.nama || updated.nip) {
          setSchoolInfo(prev => ({
            ...prev,
            ...(updated.nama ? { homeroomTeacherName: updated.nama } : {}),
            ...(updated.nip ? { homeroomTeacherNip: updated.nip } : {})
          }));
        }
      }
    }

    addToast('success', 'Data Guru Diperbarui', 'Perubahan data profil & tugas guru berhasil disimpan.');
  };

  const deleteTeacher = (id: string) => {
    const target = teachers.find(t => t.id === id);
    setTeachers(prev => prev.filter(t => t.id !== id));
    addToast('warning', 'Guru Dihapus', `Data ${target?.nama || 'Guru'} telah dihapus dari daftar.`);
  };

  const getTeacherById = (id: string) => teachers.find(t => t.id === id);

  const bulkImportTeachers = (importedTeachers: Teacher[], mode: 'append' | 'replace' = 'append') => {
    if (!importedTeachers || importedTeachers.length === 0) return;

    let finalTeachers: Teacher[] = [];

    if (mode === 'replace') {
      finalTeachers = [...importedTeachers];
    } else {
      // Merge by NIP, NUPTK, or normalized Nama
      const teacherMap = new Map<string, Teacher>();
      (teachers || []).forEach(t => {
        const key = (t.nip && t.nip !== '-' && t.nip.trim()) || (t.nuptk && t.nuptk.trim()) || t.id || t.nama.toLowerCase().trim();
        teacherMap.set(key, t);
      });

      importedTeachers.forEach(t => {
        const key = (t.nip && t.nip !== '-' && t.nip.trim()) || (t.nuptk && t.nuptk.trim()) || t.id || t.nama.toLowerCase().trim();
        if (teacherMap.has(key)) {
          teacherMap.set(key, { ...teacherMap.get(key)!, ...t });
        } else {
          teacherMap.set(key, t);
        }
      });

      finalTeachers = Array.from(teacherMap.values());
    }

    setTeachers(finalTeachers);
    localStorage.setItem(STORAGE_PREFIX + 'teachers', JSON.stringify(finalTeachers));

    // Also auto-sync headmaster or homeroom teacher to schoolInfo if detected
    const kepsek = finalTeachers.find(t => 
      t.jabatan?.toLowerCase().includes('kepala sekolah') || 
      t.jenisGuru === 'Kepala Sekolah'
    );
    if (kepsek && (!schoolInfo.headmasterName || schoolInfo.headmasterName.includes('Mulyono'))) {
      setSchoolInfo(prev => ({
        ...prev,
        headmasterName: kepsek.nama,
        headmasterNip: kepsek.nip !== '-' ? kepsek.nip : prev.headmasterNip
      }));
    }

    const waliKelas = finalTeachers.find(t => 
      t.jabatan?.toLowerCase().includes('wali kelas') || 
      t.kelasDiampu === schoolInfo.className
    );
    if (waliKelas && (!schoolInfo.homeroomTeacherName || schoolInfo.homeroomTeacherName.includes('Nur Hidayati'))) {
      setSchoolInfo(prev => ({
        ...prev,
        homeroomTeacherName: waliKelas.nama,
        homeroomTeacherNip: waliKelas.nip !== '-' ? waliKelas.nip : prev.homeroomTeacherNip
      }));
    }

    // Persist to Firestore in background
    finalTeachers.forEach(t => {
      syncTeacher(t).catch(err => console.warn('[Firestore] Sync teacher warning:', err));
    });

    addToast(
      'success',
      'Import Data Guru & Tendik Berhasil',
      `${finalTeachers.length} data pendidik & tenaga kependidikan berhasil disimpan & disinkronkan.`
    );
  };

  // Subject CRUD
  const addSubject = (sub: Omit<Subject, 'id'>) => {
    const newSub: Subject = {
      ...sub,
      id: `mapel-${Date.now().toString().slice(-4)}`
    };
    setSubjects(prev => [...prev, newSub]);
    addToast('success', 'Mata Pelajaran Ditambahkan', `${newSub.nama} berhasil ditambahkan.`);
  };

  const updateSubject = (id: string, updated: Partial<Subject>) => {
    setSubjects(prev => prev.map(s => s.id === id ? { ...s, ...updated } : s));
    addToast('success', 'Mata Pelajaran Diperbarui', 'Data mata pelajaran berhasil disimpan.');
  };

  const deleteSubject = (id: string) => {
    const target = subjects.find(s => s.id === id);
    setSubjects(prev => prev.filter(s => s.id !== id));
    setTujuanPembelajaranList(prev => prev.filter(tp => tp.mapelId !== id));
    setGrades(prev => prev.filter(g => g.mapelId !== id));
    addToast('info', 'Mata Pelajaran Dihapus', `Mata pelajaran ${target?.nama || ''} dan seluruh TP terkait telah dihapus.`);
  };

  // Tujuan Pembelajaran (TP) CRUD
  const addTP = (tpData: Omit<TujuanPembelajaran, 'id'> | TujuanPembelajaran) => {
    setTujuanPembelajaranList(prev => {
      const existingIds = new Set<string>((prev || []).map((t: TujuanPembelajaran) => t.id));
      let finalId = (tpData as any).id;
      if (!finalId || existingIds.has(finalId)) {
        finalId = generateUniqueTPId('tp', existingIds);
      }
      const newTP: TujuanPembelajaran = {
        ...tpData,
        id: finalId
      };
      return [...prev, newTP];
    });
    addToast('success', 'Tujuan Pembelajaran Ditambahkan', `${(tpData as any).kode || 'TP'}: ${(tpData as any).lingkupMateri || ''} berhasil ditambahkan.`);
  };

  const bulkAddTP = (tps: (Omit<TujuanPembelajaran, 'id'> | TujuanPembelajaran)[]) => {
    if (!tps || tps.length === 0) return;
    setTujuanPembelajaranList(prev => {
      const existingIds = new Set<string>((prev || []).map((t: TujuanPembelajaran) => t.id));
      const newItems: TujuanPembelajaran[] = [];
      tps.forEach(tp => {
        let finalId = (tp as any).id;
        if (!finalId || existingIds.has(finalId)) {
          finalId = generateUniqueTPId('tp', existingIds);
        }
        existingIds.add(finalId);
        newItems.push({ ...tp, id: finalId });
      });
      return [...prev, ...newItems];
    });
  };

  const updateTP = (id: string, updated: Partial<TujuanPembelajaran>) => {
    setTujuanPembelajaranList(prev => prev.map(tp => tp.id === id ? { ...tp, ...updated } : tp));
    addToast('success', 'TP Diperbarui', 'Data Tujuan Pembelajaran berhasil disimpan.');
  };

  const deleteTP = (id: string) => {
    const target = tujuanPembelajaranList.find(tp => tp.id === id);
    setTujuanPembelajaranList(prev => prev.filter(tp => tp.id !== id));
    addToast('warning', 'TP Dihapus', `${target?.kode || 'Tujuan Pembelajaran'} telah dihapus.`);
  };

  const bulkImportTP = (importedTPs: TujuanPembelajaran[], mode: 'append' | 'replace' = 'append') => {
    if (!importedTPs || importedTPs.length === 0) return;
    setTujuanPembelajaranList(prev => {
      let finalTPs: TujuanPembelajaran[];
      if (mode === 'replace') {
        finalTPs = sanitizeTPList([...importedTPs]);
      } else {
        const tpMap = new Map<string, TujuanPembelajaran>();
        (prev || []).forEach(tp => {
          const key = `${tp.mapelId}_${(tp.kode || '').trim().toLowerCase()}`;
          tpMap.set(key, tp);
        });
        importedTPs.forEach(tp => {
          const key = `${tp.mapelId}_${(tp.kode || '').trim().toLowerCase()}`;
          tpMap.set(key, tp);
        });
        finalTPs = sanitizeTPList(Array.from(tpMap.values()));
      }
      localStorage.setItem(STORAGE_PREFIX + 'tujuanPembelajaran', JSON.stringify(finalTPs));
      return finalTPs;
    });

    addToast(
      'success',
      'Tujuan Pembelajaran (TP) Diimpor',
      `Berhasil memproses ${importedTPs.length} TP ke daftar capaian kompetensi mata pelajaran.`
    );
  };

  const getTPBySubject = (mapelId: string) => {
    return tujuanPembelajaranList.filter(tp => tp.mapelId === mapelId);
  };

  const resetTPToDefault = () => {
    setTujuanPembelajaranList(INITIAL_TUJUAN_PEMBELAJARAN);
    addToast('info', 'Reset TP', 'Daftar Tujuan Pembelajaran dikembalikan ke standar kurikulum.');
  };

  const applyCurriculumPhasePreset = (
    phaseKey: CurriculumPhaseKey,
    options?: {
      updateSchoolInfo?: boolean;
      regenerateGrades?: boolean;
      customClassName?: string;
    }
  ) => {
    const preset = CURRICULUM_PHASE_PRESETS[phaseKey];
    if (!preset) {
      addToast('error', 'Gagal Menerapkan Fase', `Preset kurikulum untuk fase ${phaseKey} tidak ditemukan.`);
      return;
    }

    // 1. Update subjects and TP list
    setSubjects(preset.subjects);
    setTujuanPembelajaranList(preset.tujuanPembelajaran);

    // 2. Update School Info (Phase, Class Name) if requested (default: true)
    if (options?.updateSchoolInfo !== false) {
      setSchoolInfo(prev => ({
        ...prev,
        phase: preset.label,
        className: options?.customClassName || preset.defaultClassName || prev.className,
        kurikulum: 'Kurikulum Merdeka Pembelajaran Mendalam (KMPM)'
      }));
    }

    // 3. Regenerate Grades for all active students (default: true)
    if (options?.regenerateGrades !== false && students && students.length > 0) {
      const newGrades = generateGradesForCurriculumPhase(students, preset.subjects, preset.tujuanPembelajaran);
      setGrades(newGrades);

      // 4. Update student reports catatan & rankings
      const currentReports = { ...studentReports };
      students.forEach((student, sIdx) => {
        const studentExisting = currentReports[student.id] || {
          catatanWaliKelas: 'Pertahankan semangat belajar dan terus kembangkan potensimu.',
          catatanP5: 'Menunjukkan perkembangan sangat baik dalam dimensi Beriman, Bertakwa, Berakhlak Mulia, dan Gotong Royong.',
          ekskul: [
            { nama: 'Pramuka', nilai: 'Sangat Baik' as const, keterangan: 'Aktif dan disiplin dalam setiap latihan regu' }
          ],
          prestasi: [],
          statusKenaikan: 'Naik' as KenaikanStatus,
          targetKelasKenaikan: 'Kelas 5A'
        };

        const rankingList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
        const newRank = rankingList[sIdx % rankingList.length] || (sIdx + 1);

        currentReports[student.id] = {
          ...studentExisting,
          rankingKelas: newRank,
          rankingMidSemester: newRank
        };
      });
      setStudentReports(currentReports);
    }

    addToast(
      'success',
      'Kurikulum Merdeka Diterapkan',
      `Berhasil menyesuaikan ${preset.subjects.length} Mata Pelajaran, ${preset.tujuanPembelajaran.length} TP, dan nilai rapor untuk ${preset.label}.`
    );
  };

  // Attendance
  const markAttendance = (siswaId: string, status: AttendanceStatus, tanggal?: string, keterangan?: string) => {
    const today = tanggal || new Date().toISOString().split('T')[0];
    setAttendanceRecords(prev => {
      const existingIdx = prev.findIndex(r => r.siswaId === siswaId && r.tanggal === today);
      if (existingIdx >= 0) {
        const copy = [...prev];
        copy[existingIdx] = {
          ...copy[existingIdx],
          status,
          keterangan: keterangan !== undefined ? keterangan : copy[existingIdx].keterangan
        };
        return copy;
      } else {
        return [
          ...prev,
          {
            id: `att-${today}-${siswaId}`,
            tanggal: today,
            siswaId,
            status,
            keterangan: keterangan || '',
            waktuInput: `${today} ${new Date().toLocaleTimeString()}`
          }
        ];
      }
    });
  };

  const bulkMarkAttendance = (tanggal: string, status: AttendanceStatus) => {
    students.forEach(student => {
      markAttendance(student.id, status, tanggal);
    });
    addToast('success', 'Presensi Massal Selesai', `Seluruh siswa (${students.length}) ditandai ${status} pada tanggal ${tanggal}.`);
  };

  const deleteAttendanceRecord = (id: string) => {
    setAttendanceRecords(prev => prev.filter(r => r.id !== id));
  };

  const bulkImportAttendance = (importedRecords: AttendanceRecord[], mode: 'append' | 'replace' = 'append') => {
    if (!importedRecords || importedRecords.length === 0) return;

    let finalRecords: AttendanceRecord[] = [];
    if (mode === 'replace') {
      finalRecords = [...importedRecords];
    } else {
      const attMap = new Map<string, AttendanceRecord>();
      (attendanceRecords || []).forEach(r => {
        attMap.set(`${r.siswaId}_${r.tanggal}`, r);
      });
      importedRecords.forEach(r => {
        attMap.set(`${r.siswaId}_${r.tanggal}`, r);
      });
      finalRecords = Array.from(attMap.values());
    }

    setAttendanceRecords(finalRecords);
    localStorage.setItem(STORAGE_PREFIX + 'attendance', JSON.stringify(finalRecords));

    finalRecords.forEach(r => {
      syncAttendance(r).catch(err => console.warn('[Firestore] Sync attendance warning:', err));
    });

    addToast(
      'success',
      'Import Presensi Berhasil',
      `Berhasil menyimpan ${importedRecords.length} catatan kehadiran siswa.`
    );
  };

  const getAttendanceByDate = (tanggal: string) => {
    return (attendanceRecords || []).filter(r => r.tanggal === tanggal);
  };

  const getStudentAttendanceStats = (siswaId: string, monthPrefix?: string) => {
    const filtered = (attendanceRecords || []).filter(r => {
      const matchStudent = r.siswaId === siswaId;
      if (!matchStudent) return false;
      if (monthPrefix) return r.tanggal.startsWith(monthPrefix);
      return true;
    });

    let hadir = 0;
    let sakit = 0;
    let izin = 0;
    let alpa = 0;

    filtered.forEach(r => {
      if (r.status === 'Hadir') hadir++;
      else if (r.status === 'Sakit') sakit++;
      else if (r.status === 'Izin') izin++;
      else if (r.status === 'Alpa') alpa++;
    });

    const total = hadir + sakit + izin + alpa;
    const percentage = total > 0 ? Math.round((hadir / total) * 100) : 100;

    return { hadir, sakit, izin, alpa, total, percentage };
  };

  // Grade Management (Tersimpan & Terisolasi per Semester)
  const getGradeValue = (
    siswaId: string,
    mapelId: string,
    jenis: AssessmentType | string,
    targetSemester?: string,
    defaultVal = 0
  ): number => {
    const activeSem = normalizeSemester(targetSemester || schoolInfo.semester);
    const rec = (grades || []).find(
      g => g.siswaId === siswaId &&
           g.mapelId === mapelId &&
           g.jenis === jenis &&
           normalizeSemester(g.semester) === activeSem
    );
    return rec !== undefined ? rec.nilai : defaultVal;
  };

  const saveGrade = (
    siswaId: string,
    mapelId: string,
    jenis: AssessmentType,
    nilai: number,
    capaianKompetensi?: string,
    targetSemester?: string
  ) => {
    const activeSem = normalizeSemester(targetSemester || schoolInfo.semester);
    setGrades(prev => {
      const currentList = prev || [];
      const idx = currentList.findIndex(
        g => g.siswaId === siswaId &&
             g.mapelId === mapelId &&
             g.jenis === jenis &&
             normalizeSemester(g.semester) === activeSem
      );

      const defaultCapaian = nilai >= 85
        ? 'Menunjukkan penguasaan sangat baik dalam mencapai seluruh tujuan pembelajaran.'
        : nilai >= 75
        ? 'Menunjukkan penguasaan yang baik dalam mencapai tujuan pembelajaran.'
        : 'Perlu bimbingan dan pendampingan intensif untuk penguasaan konsep.';

      const semPrefix = activeSem === '2 (Genap)' ? 'sem2' : 'sem1';
      let updatedList: GradeRecord[];

      if (idx >= 0) {
        updatedList = [...currentList];
        const updatedGrade: GradeRecord = {
          ...updatedList[idx],
          nilai,
          semester: activeSem,
          capaianKompetensi: capaianKompetensi || updatedList[idx].capaianKompetensi || defaultCapaian
        };
        updatedList[idx] = updatedGrade;
        syncGrade(updatedGrade).catch(err => console.warn('[Firestore] Sync grade warning:', err));
      } else {
        const newGrade: GradeRecord = {
          id: `grd-${semPrefix}-${siswaId}-${mapelId}-${jenis}`,
          siswaId,
          mapelId,
          jenis,
          nilai,
          semester: activeSem,
          capaianKompetensi: capaianKompetensi || defaultCapaian
        };
        updatedList = [...currentList, newGrade];
        syncGrade(newGrade).catch(err => console.warn('[Firestore] Sync grade warning:', err));
      }
      localStorage.setItem(STORAGE_PREFIX + 'grades', JSON.stringify(updatedList));
      return updatedList;
    });
  };

  const bulkSaveGrades = (
    newGrades: Array<{
      siswaId: string;
      mapelId: string;
      jenis: AssessmentType;
      nilai: number;
      capaianKompetensi?: string;
      semester?: string;
    }>,
    targetSemester?: string
  ) => {
    const activeSem = normalizeSemester(targetSemester || schoolInfo.semester);
    setGrades(prev => {
      const gradeMap = new Map<string, GradeRecord>();
      (prev || []).forEach(g => {
        const s = normalizeSemester(g.semester);
        gradeMap.set(`${g.siswaId}_${g.mapelId}_${g.jenis}_${s}`, { ...g, semester: s });
      });

      newGrades.forEach(g => {
        const s = normalizeSemester(g.semester || activeSem);
        const semPrefix = s === '2 (Genap)' ? 'sem2' : 'sem1';
        const key = `${g.siswaId}_${g.mapelId}_${g.jenis}_${s}`;
        const existing = gradeMap.get(key);
        const defaultCapaian = g.nilai >= 85
          ? 'Menunjukkan penguasaan sangat baik dalam mencapai seluruh tujuan pembelajaran.'
          : g.nilai >= 75
          ? 'Menunjukkan penguasaan yang baik dalam mencapai tujuan pembelajaran.'
          : 'Perlu bimbingan dan pendampingan intensif untuk penguasaan konsep.';

        const updated: GradeRecord = {
          id: existing?.id || `grd-${semPrefix}-${g.siswaId}-${g.mapelId}-${g.jenis}`,
          siswaId: g.siswaId,
          mapelId: g.mapelId,
          jenis: g.jenis,
          nilai: g.nilai,
          semester: s,
          capaianKompetensi: g.capaianKompetensi || existing?.capaianKompetensi || defaultCapaian
        };
        gradeMap.set(key, updated);
        syncGrade(updated).catch(err => console.warn('[Firestore] Sync grade warning:', err));
      });

      const finalGrades = Array.from(gradeMap.values());
      localStorage.setItem(STORAGE_PREFIX + 'grades', JSON.stringify(finalGrades));
      return finalGrades;
    });
    addToast('success', 'Nilai Disimpan', `${newGrades.length} data nilai berhasil diperbarui untuk ${activeSem}.`);
  };

  const bulkImportGrades = (
    importedGrades: GradeRecord[],
    mode: 'append' | 'replace' = 'append',
    targetSemester?: string
  ) => {
    if (!importedGrades || importedGrades.length === 0) return;
    const activeSem = normalizeSemester(targetSemester || schoolInfo.semester);
    setGrades(prev => {
      let finalGrades: GradeRecord[];
      if (mode === 'replace') {
        // Hanya mereplace nilai pada semester aktif, semester lain tetap terjaga aman!
        const otherSemesterGrades = (prev || []).filter(g => normalizeSemester(g.semester) !== activeSem);
        const normalizedImported = importedGrades.map(g => ({
          ...g,
          semester: normalizeSemester(g.semester || activeSem),
          id: g.id?.includes('sem') ? g.id : `grd-${activeSem === '2 (Genap)' ? 'sem2' : 'sem1'}-${g.siswaId}-${g.mapelId}-${g.jenis}`
        }));
        finalGrades = [...otherSemesterGrades, ...normalizedImported];
      } else {
        const gradeMap = new Map<string, GradeRecord>();
        (prev || []).forEach(g => {
          const s = normalizeSemester(g.semester);
          gradeMap.set(`${g.siswaId}_${g.mapelId}_${g.jenis}_${s}`, { ...g, semester: s });
        });
        importedGrades.forEach(g => {
          const s = normalizeSemester(g.semester || activeSem);
          gradeMap.set(`${g.siswaId}_${g.mapelId}_${g.jenis}_${s}`, {
            ...g,
            semester: s,
            id: g.id?.includes('sem') ? g.id : `grd-${s === '2 (Genap)' ? 'sem2' : 'sem1'}-${g.siswaId}-${g.mapelId}-${g.jenis}`
          });
        });
        finalGrades = Array.from(gradeMap.values());
      }
      localStorage.setItem(STORAGE_PREFIX + 'grades', JSON.stringify(finalGrades));
      return finalGrades;
    });

    addToast(
      'success',
      'Nilai Siswa Berhasil Diimpor',
      `Berhasil menyimpan ${importedGrades.length} butir penilaian ke Daftar Nilai (${activeSem}).`
    );
  };

  const resetAllTPGradesToZero = (mapelId?: string, targetSemester?: string) => {
    const activeSem = normalizeSemester(targetSemester || schoolInfo.semester);
    setGrades(prev => {
      const updated = (prev || []).map(g => {
        if (normalizeSemester(g.semester) !== activeSem) return g;
        if (mapelId && g.mapelId !== mapelId) return g;
        if (g.jenis.startsWith('Formatif_')) {
          return { ...g, nilai: 0 };
        }
        return g;
      });
      localStorage.setItem(STORAGE_PREFIX + 'grades', JSON.stringify(updated));
      return updated;
    });

    addToast(
      'success',
      'Nilai TP Diatur ke 0',
      mapelId
        ? `Seluruh nilai TP peserta didik pada mata pelajaran ini berhasil diatur menjadi 0 untuk ${activeSem}. Nilai semester lain tetap aman.`
        : `Seluruh nilai TP peserta didik di semua mata pelajaran berhasil diatur menjadi 0 untuk ${activeSem}. Nilai semester lain tetap aman.`
    );
  };

  const getStudentGradeSummary = (siswaId: string, mapelId: string, targetSemester?: string) => {
    const activeSem = normalizeSemester(targetSemester || schoolInfo.semester);
    const student = (students || []).find(s => s.id === siswaId);
    const studentAgama = student?.agama || 'Islam';

    const studentGrades = (grades || []).filter(
      g => g.siswaId === siswaId && 
           g.mapelId === mapelId && 
           normalizeSemester(g.semester) === activeSem
    );
    const formatifs = studentGrades.filter(g => g.jenis.startsWith('Formatif_'));
    const sts = studentGrades.find(g => g.jenis === 'Sumatif_STS')?.nilai || 0;
    const sas = studentGrades.find(g => g.jenis === 'Sumatif_SAS')?.nilai || 0;

    const formatifSum = formatifs.reduce((sum, g) => sum + g.nilai, 0);
    const formatifAvg = formatifs.length > 0 ? Math.round(formatifSum / formatifs.length) : 0;

    // Standar Kurikulum Merdeka: 40% Rata-rata Formatif + 30% Sumatif STS + 30% Sumatif SAS
    let nilaiAkhir = 0;
    if (formatifs.length > 0 || sts > 0 || sas > 0) {
      nilaiAkhir = Math.round((formatifAvg * 0.4) + (sts * 0.3) + (sas * 0.3));
    }

    let predikat: 'A' | 'B' | 'C' | 'D' = 'D';
    if (nilaiAkhir >= 90) predikat = 'A';
    else if (nilaiAkhir >= 80) predikat = 'B';
    else if (nilaiAkhir >= 70) predikat = 'C';

    const rawSubject = (subjects || []).find(s => s.id === mapelId) || {
      id: mapelId,
      nama: 'Mata Pelajaran',
      kode: 'MP',
      kelompok: 'Umum' as const,
      kktp: 75,
      guruPengampu: '-',
      iconName: 'BookOpen'
    };

    const isAgama = isAgamaSubject(rawSubject);
    const subject = isAgama
      ? {
          ...rawSubject,
          nama: getReligionSubjectName(studentAgama, rawSubject.nama),
          kode: getReligionSubjectCode(studentAgama, rawSubject.kode)
        }
      : rawSubject;

    const kktp = subject.kktp || 75;
    const ketercapaian: 'Tuntas' | 'Belum Tuntas' = nilaiAkhir >= kktp ? 'Tuntas' : 'Belum Tuntas';

    // Kurikulum Merdeka: Generate specific description based on student's highest and lowest TP achievement
    const generated = generateSpecificReportDescription({
      subject,
      studentGrades,
      allTPs: tujuanPembelajaranList || [],
      semester: activeSem,
      isMidSemester: false,
      kktpOverride: kktp,
      studentAgama,
      studentName: student?.nama
    });

    return {
      formatifAvg,
      sumatifSts: sts,
      sumatifSas: sas,
      nilaiAkhir,
      predikat,
      ketercapaian,
      deskripsiCapaian: generated.deskripsi
    };
  };

  const getAllGradesForStudent = (siswaId: string, targetSemester?: string) => {
    const activeSem = normalizeSemester(targetSemester || schoolInfo.semester);
    const student = (students || []).find(s => s.id === siswaId);
    const studentAgama = student?.agama || 'Islam';

    return (subjects || []).map(rawSubject => {
      const isAgama = isAgamaSubject(rawSubject);
      const subject = isAgama
        ? {
            ...rawSubject,
            nama: getReligionSubjectName(studentAgama, rawSubject.nama),
            kode: getReligionSubjectCode(studentAgama, rawSubject.kode)
          }
        : rawSubject;

      const summary = getStudentGradeSummary(siswaId, rawSubject.id, activeSem);
      return {
        subject,
        ...summary
      };
    });
  };

  const getAllMidSemesterGradesForStudent = (siswaId: string, targetSemester?: string) => {
    const activeSem = normalizeSemester(targetSemester || schoolInfo.semester);
    const student = (students || []).find(s => s.id === siswaId);
    const studentAgama = student?.agama || 'Islam';

    return (subjects || []).map(rawSubject => {
      const isAgama = isAgamaSubject(rawSubject);
      const subject = isAgama
        ? {
            ...rawSubject,
            nama: getReligionSubjectName(studentAgama, rawSubject.nama),
            kode: getReligionSubjectCode(studentAgama, rawSubject.kode)
          }
        : rawSubject;

      const studentGrades = (grades || []).filter(
        g => g.siswaId === siswaId && 
             g.mapelId === rawSubject.id && 
             normalizeSemester(g.semester) === activeSem
      );
      const formatifs = studentGrades.filter(g => g.jenis.startsWith('Formatif_'));
      const sts = studentGrades.find(g => g.jenis === 'Sumatif_STS')?.nilai || 0;

      // In mid semester, we evaluate TP1 & TP2 formatifs
      const midFormatifs = formatifs.filter(g => g.jenis === 'Formatif_TP1' || g.jenis === 'Formatif_TP2');
      const activeFormatifs = midFormatifs.length > 0 ? midFormatifs : formatifs;
      const formatifSum = activeFormatifs.reduce((sum, g) => sum + g.nilai, 0);
      const formatifAvg = activeFormatifs.length > 0 ? Math.round(formatifSum / activeFormatifs.length) : 0;
      
      // Standar Nilai Mid Semester: Utamakan nilai STS murni
      let nilaiAkhirMid = 0;
      if (sts > 0) {
        nilaiAkhirMid = sts;
      } else if (formatifAvg > 0) {
        nilaiAkhirMid = formatifAvg;
      } else {
        const summary = getStudentGradeSummary(siswaId, rawSubject.id, activeSem);
        nilaiAkhirMid = summary.nilaiAkhir;
      }

      let predikat: 'A' | 'B' | 'C' | 'D' = 'D';
      if (nilaiAkhirMid >= 90) predikat = 'A';
      else if (nilaiAkhirMid >= 80) predikat = 'B';
      else if (nilaiAkhirMid >= 70) predikat = 'C';

      const kktp = subject?.kktp || 75;
      const ketercapaian: 'Tuntas' | 'Belum Tuntas' = nilaiAkhirMid >= kktp ? 'Tuntas' : 'Belum Tuntas';

      // Kurikulum Merdeka: Generate specific description based on highest and lowest TP in Mid Semester
      const generatedMid = generateSpecificReportDescription({
        subject,
        studentGrades,
        allTPs: tujuanPembelajaranList || [],
        semester: activeSem,
        isMidSemester: true,
        kktpOverride: kktp,
        studentAgama,
        studentName: student?.nama
      });

      return {
        subject,
        formatifAvg,
        sumatifSts: sts,
        nilaiAkhirMid,
        predikat,
        ketercapaian,
        deskripsiCapaian: generatedMid.deskripsi
      };
    });
  };

  // Raport Siswa, Ranking & Kenaikan Kelas
  const getStudentReport = (siswaId: string): StudentReportData => {
    const defaultDateSemester = schoolInfo.tanggalRapor || (schoolInfo.semester?.includes('2') ? `${schoolInfo.city}, 20 Juni 2027` : `${schoolInfo.city}, 19 Desember 2026`);
    const defaultDateMid = schoolInfo.tanggalRaporMid || (schoolInfo.semester?.includes('2') ? `${schoolInfo.city}, 28 Maret 2027` : `${schoolInfo.city}, 10 Oktober 2026`);

    if (studentReports && studentReports[siswaId]) {
      const rep = studentReports[siswaId];
      return {
        ...rep,
        tempatTanggalRapor: schoolInfo.tanggalRapor || rep.tempatTanggalRapor || defaultDateSemester,
        tempatTanggalRaporMid: schoolInfo.tanggalRaporMid || rep.tempatTanggalRaporMid || defaultDateMid
      };
    }
    const student = students.find(s => s.id === siswaId);
    const sGrades = getAllGradesForStudent(siswaId);
    const total = sGrades.reduce((sum, g) => sum + g.nilaiAkhir, 0);
    const avg = sGrades.length > 0 ? +(total / sGrades.length).toFixed(1) : 0;

    const sMidGrades = getAllMidSemesterGradesForStudent(siswaId);
    const totalMid = sMidGrades.reduce((sum, g) => sum + g.nilaiAkhirMid, 0);
    const avgMid = sMidGrades.length > 0 ? +(totalMid / sMidGrades.length).toFixed(1) : 0;

    const currentClass = schoolInfo.className || 'Kelas 4A';
    const nextClass = currentClass.includes('1') ? 'II (Dua)'
      : currentClass.includes('2') ? 'III (Tiga)'
      : currentClass.includes('3') ? 'IV (Empat)'
      : currentClass.includes('4') ? 'V (Lima)'
      : currentClass.includes('5') ? 'VI (Enam)'
      : 'Lulus SMP / MTs';

    const defaultReport: StudentReportData = {
      siswaId,
      ranking: '-',
      rankingMid: '-',
      totalNilai: total,
      rataRataNilai: avg,
      totalNilaiMid: totalMid,
      rataRataNilaiMid: avgMid,
      statusKenaikan: 'Naik Kelas',
      targetKelas: nextClass,
      keteranganKenaikan: `Berdasarkan pencapaian seluruh tujuan pembelajaran pada Tahun Ajaran ${schoolInfo.academicYear}, ananda ${student?.nama || 'peserta didik'} dinyatakan: NAIK KE KELAS ${nextClass.toUpperCase()}`,
      catatanWaliKelas: `"Ananda ${student?.nama || 'siswa'} menunjukkan perkembangan akhlak mulia, kedisiplinan, dan nalar kritis yang sangat membanggakan di semester ini. Tingkatkan terus semangat literasi membaca dan pertahankan kepedulian sosial yang tinggi terhadap sesama."`,
      catatanWaliKelasMid: `"Ananda ${student?.nama || 'siswa'} menunjukkan kesungguhan dan keaktifan belajar yang sangat baik hingga tengah semester ini. Pertahankan ketekunan belajarmu dan terus kembangkan potensimu pada paruh semester kedua."`,
      deskripsiKokurikuler: '',
      tanggapanOrangTua: '',
      tempatTanggalRapor: defaultDateSemester,
      tempatTanggalRaporMid: defaultDateMid,
      showRanking: true,
      showKenaikan: true
    };

    return defaultReport;
  };

  const updateStudentReport = (siswaId: string, updated: Partial<StudentReportData>, silent: boolean = false) => {
    // If tempatTanggalRapor or tempatTanggalRaporMid is updated, apply globally to all students and schoolInfo!
    if (updated.tempatTanggalRapor || updated.tempatTanggalRaporMid) {
      setSchoolInfo(prev => {
        const nextInfo = {
          ...prev,
          ...(updated.tempatTanggalRapor ? { tanggalRapor: updated.tempatTanggalRapor } : {}),
          ...(updated.tempatTanggalRaporMid ? { tanggalRaporMid: updated.tempatTanggalRaporMid } : {})
        };
        localStorage.setItem(STORAGE_PREFIX + 'schoolInfo', JSON.stringify(nextInfo));
        syncSchoolInfo(nextInfo).catch(err => console.warn('[Firestore] Sync schoolInfo warning:', err));
        return nextInfo;
      });

      setStudentReports(prev => {
        const current = prev[siswaId] || getStudentReport(siswaId);
        const mergedCurrent = { ...current, ...updated };
        const updatedReports: Record<string, StudentReportData> = {};

        // Apply date changes to ALL students
        Object.keys(prev).forEach(id => {
          if (id === siswaId) {
            updatedReports[id] = mergedCurrent;
          } else {
            updatedReports[id] = {
              ...prev[id],
              ...(updated.tempatTanggalRapor ? { tempatTanggalRapor: updated.tempatTanggalRapor } : {}),
              ...(updated.tempatTanggalRaporMid ? { tempatTanggalRaporMid: updated.tempatTanggalRaporMid } : {})
            };
          }
        });
        if (!updatedReports[siswaId]) {
          updatedReports[siswaId] = mergedCurrent;
        }
        localStorage.setItem(STORAGE_PREFIX + 'studentReports', JSON.stringify(updatedReports));
        return updatedReports;
      });
    } else {
      setStudentReports(prev => {
        const current = prev[siswaId] || getStudentReport(siswaId);
        const merged = { ...current, ...updated };
        const nextReports = {
          ...prev,
          [siswaId]: merged
        };
        localStorage.setItem(STORAGE_PREFIX + 'studentReports', JSON.stringify(nextReports));
        return nextReports;
      });
    }

    if (!silent) {
      addToast('success', 'Rapor Diperbarui', 'Data ranking, catatan, absensi & keputusan kenaikan kelas berhasil disimpan.');
    }
  };

  const getEffectiveStudentAttendance = (siswaId: string, isMidSemester: boolean = false) => {
    const auto = getStudentAttendanceStats(siswaId);
    const rep = getStudentReport(siswaId);
    const custom = isMidSemester ? (rep.customAbsensiMid || rep.customAbsensi) : rep.customAbsensi;

    if (custom && custom.isManual) {
      const s = typeof custom.sakit === 'number' ? Math.max(0, custom.sakit) : 0;
      const i = typeof custom.izin === 'number' ? Math.max(0, custom.izin) : 0;
      const a = typeof custom.alpa === 'number' ? Math.max(0, custom.alpa) : 0;
      return {
        sakit: s,
        izin: i,
        alpa: a,
        isManual: true,
        autoSakit: auto.sakit,
        autoIzin: auto.izin,
        autoAlpa: auto.alpa
      };
    }

    return {
      sakit: auto.sakit,
      izin: auto.izin,
      alpa: auto.alpa,
      isManual: false,
      autoSakit: auto.sakit,
      autoIzin: auto.izin,
      autoAlpa: auto.alpa
    };
  };

  const updateStudentReportAttendance = (
    siswaId: string,
    attendance: { isManual: boolean; sakit?: number; izin?: number; alpa?: number },
    isMidSemester: boolean = false,
    silent: boolean = false
  ) => {
    if (isMidSemester) {
      updateStudentReport(siswaId, { customAbsensiMid: attendance }, silent);
    } else {
      updateStudentReport(siswaId, { customAbsensi: attendance }, silent);
    }
  };

  const calculateStudentRankings = () => {
    const list = students.map(student => {
      const sGrades = getAllGradesForStudent(student.id);
      const totalScore = sGrades.reduce((sum, g) => sum + g.nilaiAkhir, 0);
      const avgScore = sGrades.length > 0 ? +(totalScore / sGrades.length).toFixed(1) : 0;
      return {
        siswaId: student.id,
        totalScore,
        avgScore
      };
    });

    // Sort descending by totalScore, then by avgScore
    list.sort((a, b) => b.totalScore - a.totalScore || b.avgScore - a.avgScore);

    return list.map((item, index) => ({
      siswaId: item.siswaId,
      rank: index + 1,
      totalScore: item.totalScore,
      avgScore: item.avgScore
    }));
  };

  const calculateMidSemesterRankings = () => {
    const list = students.map(student => {
      const sGrades = getAllMidSemesterGradesForStudent(student.id);
      const totalScore = sGrades.reduce((sum, g) => sum + g.nilaiAkhirMid, 0);
      const avgScore = sGrades.length > 0 ? +(totalScore / sGrades.length).toFixed(1) : 0;
      return {
        siswaId: student.id,
        totalScore,
        avgScore
      };
    });

    list.sort((a, b) => b.totalScore - a.totalScore || b.avgScore - a.avgScore);

    return list.map((item, index) => ({
      siswaId: item.siswaId,
      rank: index + 1,
      totalScore: item.totalScore,
      avgScore: item.avgScore
    }));
  };

  const bulkAutoCalculateRankings = () => {
    const rankedList = calculateStudentRankings();
    setStudentReports(prev => {
      const nextReports = { ...prev };
      rankedList.forEach(item => {
        const curr = nextReports[item.siswaId] || getStudentReport(item.siswaId);
        nextReports[item.siswaId] = {
          ...curr,
          ranking: item.rank,
          totalNilai: item.totalScore,
          rataRataNilai: item.avgScore
        };
      });
      return nextReports;
    });
    addToast('success', 'Ranking Dihitung Otomatis', `Peringkat kelas 1 sampai ${rankedList.length} berhasil dihitung berdasarkan total akumulasi nilai seluruh mapel.`);
  };

  const bulkAutoCalculateMidRankings = () => {
    const rankedList = calculateMidSemesterRankings();
    setStudentReports(prev => {
      const nextReports = { ...prev };
      rankedList.forEach(item => {
        const curr = nextReports[item.siswaId] || getStudentReport(item.siswaId);
        nextReports[item.siswaId] = {
          ...curr,
          rankingMid: String(item.rank)
        };
      });
      return nextReports;
    });
    addToast('success', 'Ranking Mid Dihitung Otomatis', `Peringkat Mid Semester 1 sampai ${rankedList.length} berhasil dihitung berdasarkan akumulasi nilai STS seluruh mapel.`);
  };

  const bulkSetKenaikanKelas = (status: KenaikanStatus, targetKelas?: string) => {
    const currentClass = schoolInfo.className || 'Kelas 4A';
    const nextClass = targetKelas || (currentClass.includes('4') ? 'V (Lima)' : currentClass.includes('5') ? 'VI (Enam)' : 'Kelas Selanjutnya');
    setStudentReports(prev => {
      const nextReports = { ...prev };
      students.forEach(student => {
        const curr = nextReports[student.id] || getStudentReport(student.id);
        const ket = status === 'Naik Kelas'
          ? `Berdasarkan pencapaian seluruh tujuan pembelajaran pada Tahun Ajaran ${schoolInfo.academicYear}, ananda ${student.nama} dinyatakan: NAIK KE KELAS ${nextClass.toUpperCase()}`
          : status === 'Tinggal Kelas'
          ? `Berdasarkan evaluasi capaian kompetensi dan ketidakhadiran pada Tahun Ajaran ${schoolInfo.academicYear}, ananda ${student.nama} dinyatakan: TINGGAL DI KELAS ${currentClass.toUpperCase()}`
          : status === 'Lulus'
          ? `Berdasarkan hasil asesmen sumatif akhir jenjang sekolah dasar, ananda ${student.nama} dinyatakan: LULUS DARI SEKOLAH DASAR`
          : `Keputusan akhir semester ananda ${student.nama}: ${status}`;

        nextReports[student.id] = {
          ...curr,
          statusKenaikan: status,
          targetKelas: status === 'Naik Kelas' ? nextClass : curr.targetKelas,
          keteranganKenaikan: ket
        };
      });
      return nextReports;
    });
    addToast('success', 'Kenaikan Kelas Diset Massal', `Status seluruh siswa diatur menjadi "${status}"${targetKelas ? ` ke ${targetKelas}` : ''}.`);
  };

  // Journal CRUD
  const addJournal = (jData: Omit<TeachingJournal, 'id'>) => {
    const newJournal: TeachingJournal = {
      ...jData,
      id: `jrn-${Date.now().toString().slice(-4)}`
    };
    setJournals(prev => [newJournal, ...prev]);
    addToast('success', 'Jurnal Tersimpan', 'Agenda mengajar harian guru berhasil dicatat.');
  };

  const updateJournal = (id: string, updated: Partial<TeachingJournal>) => {
    setJournals(prev => prev.map(j => j.id === id ? { ...j, ...updated } : j));
    addToast('success', 'Jurnal Diperbarui', 'Perubahan jurnal mengajar berhasil disimpan.');
  };

  const deleteJournal = (id: string) => {
    setJournals(prev => prev.filter(j => j.id !== id));
    addToast('info', 'Jurnal Dihapus', 'Catatan agenda telah dihapus.');
  };

  // Modul Ajar (Perangkat Ajar SD) CRUD
  const addModulAjar = (modulData: Omit<ModulAjar, 'id'>) => {
    const newModul: ModulAjar = {
      ...modulData,
      id: `ma-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };
    setModulAjarList(prev => [newModul, ...prev]);
    addToast('success', 'Modul Ajar Tersimpan', `Modul "${newModul.judul}" berhasil ditambahkan ke bank perangkat ajar.`);
  };

  const updateModulAjar = (id: string, updated: Partial<ModulAjar>) => {
    setModulAjarList(prev => prev.map(m => m.id === id ? {
      ...m,
      ...updated,
      updatedAt: new Date().toISOString().split('T')[0]
    } : m));
    addToast('success', 'Modul Ajar Diperbarui', 'Perubahan isi modul ajar berhasil disimpan.');
  };

  const deleteModulAjar = (id: string) => {
    const target = modulAjarList.find(m => m.id === id);
    setModulAjarList(prev => prev.filter(m => m.id !== id));
    addToast('info', 'Modul Dihapus', `Modul "${target?.judul || 'Perangkat Ajar'}" telah dihapus.`);
  };

  const duplicateModulAjar = (id: string) => {
    const source = modulAjarList.find(m => m.id === id);
    if (!source) {
      addToast('error', 'Gagal Duplikasi', 'Modul ajar sumber tidak ditemukan.');
      return;
    }
    const duplicated: ModulAjar = {
      ...source,
      id: `ma-copy-${Date.now().toString(36)}`,
      kodeModul: `${source.kodeModul || 'MA'}-SALINAN`,
      judul: `${source.judul} (Salinan)`,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      isFavorite: false
    };
    setModulAjarList(prev => [duplicated, ...prev]);
    addToast('success', 'Modul Diduplikasi', `Salinan modul "${source.judul}" berhasil dibuat.`);
  };

  const toggleFavoriteModulAjar = (id: string) => {
    setModulAjarList(prev => prev.map(m => m.id === id ? { ...m, isFavorite: !m.isFavorite } : m));
  };

  const resetModulAjarToDefault = () => {
    setModulAjarList(INITIAL_MODUL_AJAR_LIST);
    addToast('info', 'Modul Direset', 'Bank modul ajar telah dikembalikan ke data standar Kurikulum Merdeka.');
  };

  // Schedule Items
  const addScheduleItem = (itemData: Omit<ScheduleItem, 'id'>) => {
    const newItem: ScheduleItem = {
      ...itemData,
      id: `sch-${Date.now().toString().slice(-6)}`
    };
    setSchedule(prev => {
      const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
      return [...prev, newItem].sort((a, b) => {
        const dayDiff = days.indexOf(a.hari) - days.indexOf(b.hari);
        if (dayDiff !== 0) return dayDiff;
        return a.jamKe - b.jamKe;
      });
    });
    addToast('success', 'Jadwal Ditambahkan', `Mata pelajaran baru berhasil ditambahkan ke hari ${itemData.hari} Jam ke-${itemData.jamKe}.`);
  };

  const updateScheduleItem = (id: string, updated: Partial<ScheduleItem>) => {
    setSchedule(prev => {
      const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
      return prev.map(item => item.id === id ? { ...item, ...updated } : item).sort((a, b) => {
        const dayDiff = days.indexOf(a.hari) - days.indexOf(b.hari);
        if (dayDiff !== 0) return dayDiff;
        return a.jamKe - b.jamKe;
      });
    });
    addToast('success', 'Jadwal Diperbarui', 'Jadwal pelajaran berhasil disesuaikan.');
  };

  const deleteScheduleItem = (id: string) => {
    setSchedule(prev => prev.filter(item => item.id !== id));
    addToast('info', 'Jadwal Dihapus', 'Jam pelajaran berhasil dihapus dari jadwal.');
  };

  const resetScheduleToDefault = () => {
    setSchedule(INITIAL_SCHEDULE);
    addToast('info', 'Jadwal Direset', 'Jadwal pelajaran telah dikembalikan ke struktur standar Kurikulum Merdeka.');
  };

  const duplicateDaySchedule = (
    fromDay: 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat' | 'Sabtu',
    toDay: 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat' | 'Sabtu'
  ) => {
    const sourceItems = schedule.filter(s => s.hari === fromDay);
    if (sourceItems.length === 0) {
      addToast('error', 'Gagal Menyalin', `Tidak ada jam pelajaran di hari ${fromDay} untuk disalin.`);
      return;
    }
    const newItems: ScheduleItem[] = sourceItems.map((item, idx) => ({
      ...item,
      id: `sch-${toDay.toLowerCase()}-${Date.now().toString().slice(-4)}-${idx}`,
      hari: toDay
    }));
    setSchedule(prev => {
      const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
      return [...prev.filter(s => s.hari !== toDay), ...newItems].sort((a, b) => {
        const dayDiff = days.indexOf(a.hari) - days.indexOf(b.hari);
        if (dayDiff !== 0) return dayDiff;
        return a.jamKe - b.jamKe;
      });
    });
    addToast('success', 'Jadwal Disalin', `Susunan jadwal hari ${fromDay} (${sourceItems.length} JP) berhasil disalin ke hari ${toDay}.`);
  };

  const bulkImportSchedule = (importedItems: ScheduleItem[], mode: 'append' | 'replace' = 'append') => {
    if (!importedItems || importedItems.length === 0) return;

    let finalSchedule: ScheduleItem[] = [];
    if (mode === 'replace') {
      finalSchedule = [...importedItems];
    } else {
      const schMap = new Map<string, ScheduleItem>();
      (schedule || []).forEach(item => {
        schMap.set(`${item.hari}_${item.jamKe}`, item);
      });
      importedItems.forEach(item => {
        schMap.set(`${item.hari}_${item.jamKe}`, item);
      });
      finalSchedule = Array.from(schMap.values());
    }

    const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    finalSchedule.sort((a, b) => {
      const dayDiff = days.indexOf(a.hari) - days.indexOf(b.hari);
      if (dayDiff !== 0) return dayDiff;
      return a.jamKe - b.jamKe;
    });

    setSchedule(finalSchedule);
    localStorage.setItem(STORAGE_PREFIX + 'schedule', JSON.stringify(finalSchedule));

    finalSchedule.forEach(item => {
      syncScheduleItem(item).catch(err => console.warn('[Firestore] Sync schedule warning:', err));
    });

    addToast(
      'success',
      'Import Jadwal Pelajaran Berhasil',
      `Berhasil menyimpan ${finalSchedule.length} slot jadwal pelajaran.`
    );
  };

  // Cash Treasury
  const getCurrentCashBalance = () => {
    let balance = 0;
    transactions.forEach(t => {
      if (t.jenis === 'Pemasukan') balance += t.jumlah;
      else balance -= t.jumlah;
    });
    return balance;
  };

  const addCashTransaction = (trxData: Omit<CashTransaction, 'id' | 'saldoSetelah'>) => {
    const currentBal = getCurrentCashBalance();
    const newBal = trxData.jenis === 'Pemasukan' ? currentBal + trxData.jumlah : currentBal - trxData.jumlah;
    const newTrx: CashTransaction = {
      ...trxData,
      id: `trx-${Date.now().toString().slice(-4)}`,
      saldoSetelah: newBal
    };
    setTransactions(prev => [newTrx, ...prev]);
    addToast('success', 'Transaksi Kas Dicatat', `${trxData.jenis} sebesar Rp ${trxData.jumlah.toLocaleString('id-ID')} berhasil dicatat.`);
  };

  const updateCashTransaction = (id: string, updated: Partial<CashTransaction>) => {
    setTransactions(prev => {
      const updatedList = prev.map(t => t.id === id ? { ...t, ...updated } : t);
      let running = 0;
      const reversed = [...updatedList].reverse();
      const withBalances = reversed.map(t => {
        if (t.jenis === 'Pemasukan') running += t.jumlah;
        else running -= t.jumlah;
        return { ...t, saldoSetelah: running };
      });
      return withBalances.reverse();
    });
    addToast('success', 'Transaksi Diperbarui', 'Data transaksi kas berhasil diperbarui.');
  };

  const deleteCashTransaction = (id: string) => {
    setTransactions(prev => {
      const filtered = prev.filter(t => t.id !== id);
      let running = 0;
      const reversed = [...filtered].reverse();
      const withBalances = reversed.map(t => {
        if (t.jenis === 'Pemasukan') running += t.jumlah;
        else running -= t.jumlah;
        return { ...t, saldoSetelah: running };
      });
      return withBalances.reverse();
    });
    addToast('info', 'Transaksi Dihapus', 'Data transaksi kas telah dihapus.');
  };

  const bulkImportCash = (importedCash: CashTransaction[], mode: 'append' | 'replace' = 'append') => {
    if (!importedCash || importedCash.length === 0) return;

    let finalTransactions: CashTransaction[] = [];
    if (mode === 'replace') {
      finalTransactions = [...importedCash];
    } else {
      finalTransactions = [...importedCash, ...(transactions || [])];
    }

    // Recalculate balances chronologically (oldest to newest)
    const sorted = [...finalTransactions].sort((a, b) => new Date(a.tanggal).getTime() - new Date(b.tanggal).getTime());
    let runningBalance = 0;
    const withBalance = sorted.map(tx => {
      if (tx.jenis === 'Pemasukan') {
        runningBalance += tx.jumlah;
      } else {
        runningBalance -= tx.jumlah;
      }
      return { ...tx, saldoSetelah: runningBalance };
    });

    const finalList = withBalance.reverse();
    setTransactions(finalList);
    localStorage.setItem(STORAGE_PREFIX + 'transactions', JSON.stringify(finalList));

    finalList.forEach(tx => {
      syncTransaction(tx).catch(err => console.warn('[Firestore] Sync tx warning:', err));
    });

    addToast(
      'success',
      'Import Kas Berhasil',
      `Berhasil mengimpor ${importedCash.length} transaksi kas kelas.`
    );
  };

  const toggleStudentDues = (siswaId: string, week: 1 | 2 | 3 | 4) => {
    setWeeklyDues(prev => prev.map(due => {
      if (due.siswaId === siswaId) {
        const weekKey = `minggu${week}` as 'minggu1' | 'minggu2' | 'minggu3' | 'minggu4';
        return {
          ...due,
          [weekKey]: !due[weekKey]
        };
      }
      return due;
    }));
  };

  const resetStudentDues = (siswaId: string) => {
    setWeeklyDues(prev => prev.map(due => {
      if (due.siswaId === siswaId) {
        return {
          ...due,
          minggu1: false,
          minggu2: false,
          minggu3: false,
          minggu4: false
        };
      }
      return due;
    }));
    addToast('info', 'Status Iuran Direset', 'Centang iuran 4 pekan untuk siswa telah dikosongkan.');
  };

  const recordStudentDuesDeposit = (depositData: {
    siswaId: string;
    namaSiswa: string;
    jumlah: number;
    tanggal: string;
    mingguKe: number[];
    metodePembayaran?: string;
    keterangan?: string;
    catatKeKas?: boolean;
  }) => {
    // 1. Update weeklyDues for the student
    setWeeklyDues(prev => prev.map(due => {
      if (due.siswaId === depositData.siswaId) {
        const updatedDue = { ...due };
        depositData.mingguKe.forEach(w => {
          if (w === 1) updatedDue.minggu1 = true;
          if (w === 2) updatedDue.minggu2 = true;
          if (w === 3) updatedDue.minggu3 = true;
          if (w === 4) updatedDue.minggu4 = true;
        });
        return updatedDue;
      }
      return due;
    }));

    // 2. Add cash transaction if catatKeKas is true (default true)
    if (depositData.catatKeKas !== false && depositData.jumlah > 0) {
      const currentBal = getCurrentCashBalance();
      const weeksLabel = depositData.mingguKe.length > 0 
        ? `Minggu ${depositData.mingguKe.join(', ')}` 
        : 'Iuran Rutin';
      const newTrx: CashTransaction = {
        id: `trx-${Date.now().toString().slice(-4)}`,
        tanggal: depositData.tanggal || new Date().toISOString().split('T')[0],
        jenis: 'Pemasukan',
        kategori: 'Iuran Kas Siswa',
        jumlah: depositData.jumlah,
        namaSiswa: depositData.namaSiswa,
        siswaId: depositData.siswaId,
        mingguKe: depositData.mingguKe,
        metodePembayaran: depositData.metodePembayaran || 'Tunai',
        keterangan: depositData.keterangan || `Setoran iuran kas oleh ${depositData.namaSiswa} (${weeksLabel})`,
        penanggungJawab: 'Bendahara Kelas',
        saldoSetelah: currentBal + depositData.jumlah
      };
      setTransactions(prev => [newTrx, ...prev]);
    }

    addToast('success', 'Setoran Iuran Berhasil', `Setoran iuran Rp ${depositData.jumlah.toLocaleString('id-ID')} atas nama ${depositData.namaSiswa} berhasil dicatat.`);
  };

  // Inventory CRUD
  const addInventoryItem = (itemData: Omit<InventoryItem, 'id'>) => {
    const newItem: InventoryItem = {
      ...itemData,
      id: `inv-${Date.now().toString().slice(-4)}`
    };
    setInventory(prev => [...prev, newItem]);
    addToast('success', 'Barang Ditambahkan', `${newItem.namaBarang} dicatat ke Buku Inventaris.`);
  };

  const updateInventoryItem = (id: string, updated: Partial<InventoryItem>) => {
    setInventory(prev => prev.map(item => item.id === id ? { ...item, ...updated } : item));
    addToast('success', 'Inventaris Diperbarui', 'Data barang berhasil diupdate.');
  };

  const deleteInventoryItem = (id: string) => {
    setInventory(prev => prev.filter(item => item.id !== id));
    addToast('info', 'Barang Dihapus', 'Barang inventaris telah dihapus.');
  };

  const bulkImportInventory = (importedItems: InventoryItem[], mode: 'append' | 'replace' = 'append') => {
    if (!importedItems || importedItems.length === 0) return;

    let finalInv: InventoryItem[] = [];
    if (mode === 'replace') {
      finalInv = [...importedItems];
    } else {
      const invMap = new Map<string, InventoryItem>();
      (inventory || []).forEach(item => {
        const key = item.kodeBarang || item.id || item.namaBarang.toLowerCase().trim();
        invMap.set(key, item);
      });
      importedItems.forEach(item => {
        const key = item.kodeBarang || item.id || item.namaBarang.toLowerCase().trim();
        if (invMap.has(key)) {
          invMap.set(key, { ...invMap.get(key)!, ...item });
        } else {
          invMap.set(key, item);
        }
      });
      finalInv = Array.from(invMap.values());
    }

    setInventory(finalInv);
    localStorage.setItem(STORAGE_PREFIX + 'inventory', JSON.stringify(finalInv));

    finalInv.forEach(item => {
      syncInventoryItem(item).catch(err => console.warn('[Firestore] Sync inventory warning:', err));
    });

    addToast(
      'success',
      'Import Inventaris Berhasil',
      `Berhasil memperbarui ${finalInv.length} data barang inventaris & sarpras.`
    );
  };

  // Counseling CRUD
  const addCounselingRecord = (recData: Omit<CounselingRecord, 'id'>) => {
    const newRec: CounselingRecord = {
      ...recData,
      id: `csl-${Date.now().toString().slice(-4)}`
    };
    setCounseling(prev => [newRec, ...prev]);
    addToast('success', 'Catatan Ditambahkan', `Catatan ${recData.jenis} berhasil disimpan.`);
  };

  const updateCounselingRecord = (id: string, updated: Partial<CounselingRecord>) => {
    setCounseling(prev => prev.map(c => c.id === id ? { ...c, ...updated } : c));
    addToast('success', 'Catatan Diperbarui', 'Data konseling berhasil disimpan.');
  };

  const deleteCounselingRecord = (id: string) => {
    setCounseling(prev => prev.filter(c => c.id !== id));
    addToast('info', 'Catatan Dihapus', 'Catatan konseling telah dihapus.');
  };

  // Cleaning Duties
  const addDuty = (duty: CleaningDuty) => {
    setCleaningDuties(prev => {
      const exists = prev.some(d => d.hari.toLowerCase() === duty.hari.toLowerCase());
      if (exists) {
        return prev.map(d => d.hari.toLowerCase() === duty.hari.toLowerCase() ? duty : d);
      }
      return [...prev, duty];
    });
    addToast('success', 'Regu Piket Ditambahkan', `Jadwal regu piket hari ${duty.hari} berhasil ditambahkan.`);
  };

  const updateDuty = (
    hari: string, 
    data: { 
      siswaIds: string[]; 
      ketuaPiket: string; 
      tugasSpesifik?: string; 
      areaTugas?: string[]; 
      waktuPiket?: 'Pagi (Sebelum Bel)' | 'Siang (Pulang Sekolah)' | 'Pagi & Siang' | string;
    }
  ) => {
    setCleaningDuties(prev => {
      const exists = prev.some(d => d.hari === hari);
      if (exists) {
        return prev.map(d => d.hari === hari ? { ...d, ...data } : d);
      } else {
        return [...prev, { hari: hari as any, ...data }];
      }
    });
    addToast('success', 'Piket Diperbarui', `Jadwal regu piket hari ${hari} berhasil diperbarui.`);
  };

  const deleteDuty = (hari: string) => {
    setCleaningDuties(prev => prev.filter(d => d.hari !== hari));
    addToast('info', 'Jadwal Dihapus', `Jadwal piket hari ${hari} telah dihapus.`);
  };

  const addStudentToDuty = (hari: string, siswaId: string) => {
    setCleaningDuties(prev => {
      return prev.map(d => {
        if (d.hari === hari) {
          if (d.siswaIds.includes(siswaId)) return d;
          const newSiswaIds = [...d.siswaIds, siswaId];
          const student = students.find(s => s.id === siswaId);
          const ketua = d.ketuaPiket || (student ? student.nama : '');
          return { ...d, siswaIds: newSiswaIds, ketuaPiket: ketua };
        }
        return d;
      });
    });
    const sName = students.find(s => s.id === siswaId)?.nama || 'Siswa';
    addToast('success', 'Anggota Ditambahkan', `${sName} berhasil dimasukkan ke regu piket ${hari}.`);
  };

  const removeStudentFromDuty = (hari: string, siswaId: string) => {
    setCleaningDuties(prev => {
      return prev.map(d => {
        if (d.hari === hari) {
          const newSiswaIds = d.siswaIds.filter(id => id !== siswaId);
          const studentRemoved = students.find(s => s.id === siswaId);
          let newKetua = d.ketuaPiket;
          if (studentRemoved && d.ketuaPiket.includes(studentRemoved.nama)) {
            const firstRemaining = students.find(s => newSiswaIds[0] === s.id);
            newKetua = firstRemaining ? firstRemaining.nama : '';
          }
          return { ...d, siswaIds: newSiswaIds, ketuaPiket: newKetua };
        }
        return d;
      });
    });
    addToast('info', 'Anggota Dihapus', `Siswa telah dikeluarkan dari regu piket ${hari}.`);
  };

  const autoDistributeDuties = () => {
    const days: Array<'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat' | 'Sabtu'> = [
      'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'
    ];
    const studentList = [...students];
    const countPerDay = Math.ceil(studentList.length / days.length);

    const newDuties: CleaningDuty[] = days.map((day, idx) => {
      const slice = studentList.slice(idx * countPerDay, (idx + 1) * countPerDay);
      const studentIds = slice.map(s => s.id);
      const ketua = slice[0] ? slice[0].nama : '';
      const existing = cleaningDuties.find(d => d.hari === day);
      return {
        hari: day,
        siswaIds: studentIds,
        ketuaPiket: ketua,
        tugasSpesifik: existing?.tugasSpesifik || `Pembersihan ruang kelas 4A, merapikan meja kursi, hapus whiteboard, dan buang sampah.`,
        areaTugas: existing?.areaTugas || ['Papan Tulis', 'Sapu & Pel', 'Tempat Sampah'],
        waktuPiket: existing?.waktuPiket || 'Pagi & Siang'
      };
    });

    setCleaningDuties(newDuties);
    addToast('success', 'Pembagian Otomatis Selesai', `Seluruh ${studentList.length} siswa telah dibagi rata ke jadwal piket Senin s/d Sabtu.`);
  };

  const resetDutiesToDefault = () => {
    setCleaningDuties(INITIAL_DUTIES);
    addToast('info', 'Reset Piket', 'Jadwal piket dikembalikan ke susunan awal.');
  };

  // Events
  const addEvent = (eventData: Omit<SchoolEvent, 'id'>) => {
    const newEv: SchoolEvent = {
      ...eventData,
      id: `ev-${Date.now().toString().slice(-4)}`
    };
    setEvents(prev => [...prev, newEv]);
    addToast('success', 'Agenda Ditambahkan', `${newEv.judul} telah ditambahkan.`);
  };

  const deleteEvent = (id: string) => {
    setEvents(prev => prev.filter(e => e.id !== id));
  };

  // Extracurriculars
  const addExtracurricular = (item: Omit<Extracurricular, 'id'> | Extracurricular) => {
    const newItem: Extracurricular = {
      ...item,
      id: (item as any).id || `ex-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`
    };
    setExtracurriculars(prev => [...prev, newItem]);
    addToast('success', 'Ekstrakurikuler Ditambahkan', `Kegiatan ${item.namaKegiatan} berhasil dicatat.`);
  };

  const updateExtracurricular = (id: string, updated: Partial<Extracurricular>) => {
    setExtracurriculars(prev => prev.map(e => e.id === id ? { ...e, ...updated } : e));
    addToast('success', 'Ekstrakurikuler Diperbarui', 'Data kegiatan ekstrakurikuler berhasil diperbarui.');
  };

  const deleteExtracurricular = (id: string) => {
    setExtracurriculars(prev => prev.filter(e => e.id !== id));
    addToast('info', 'Ekstrakurikuler Dihapus', 'Data kegiatan ekstrakurikuler telah dihapus.');
  };

  const setStudentExtracurriculars = (siswaId: string, items: Array<{ namaKegiatan: string; predikat: 'Sangat Baik' | 'Baik' | 'Cukup'; keterangan: string }>) => {
    setExtracurriculars(prev => {
      const otherStudentsExcurs = prev.filter(e => e.siswaId !== siswaId);
      const newItems: Extracurricular[] = items.map((it, idx) => ({
        id: `ex-${siswaId}-${Date.now()}-${idx}`,
        siswaId,
        namaKegiatan: it.namaKegiatan,
        predikat: it.predikat,
        keterangan: it.keterangan
      }));
      return [...otherStudentsExcurs, ...newItems];
    });
    addToast('success', 'Ekstrakurikuler Disimpan', 'Kegiatan ekstrakurikuler siswa berhasil diperbarui.');
  };

  // Kokurikuler & Dimensi Profil Lulusan (DPL)
  const addProjekKokurikuler = (projek: Omit<ProjekKokurikuler, 'id'>) => {
    const newProjek: ProjekKokurikuler = {
      ...projek,
      id: `prj-${Date.now().toString(36)}`,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };
    setProjekKokurikulerList(prev => [newProjek, ...prev]);
    addToast('success', 'Projek Ditambahkan', `Projek "${newProjek.judul}" berhasil disimpan.`);
  };

  const updateProjekKokurikuler = (id: string, updated: Partial<ProjekKokurikuler>) => {
    setProjekKokurikulerList(prev =>
      prev.map(p => (p.id === id ? { ...p, ...updated, updatedAt: new Date().toISOString().split('T')[0] } : p))
    );
    addToast('success', 'Projek Diperbarui', 'Data projek kokurikuler berhasil diperbarui.');
  };

  const deleteProjekKokurikuler = (id: string) => {
    const target = projekKokurikulerList.find(p => p.id === id);
    setProjekKokurikulerList(prev => prev.filter(p => p.id !== id));
    setDplAssessmentList(prev => prev.filter(d => d.projekId !== id));
    setJurnalKokurikulerList(prev => prev.filter(j => j.projekId !== id));
    setArtefakKokurikulerList(prev => prev.filter(a => a.projekId !== id));
    addToast('info', 'Projek Dihapus', `Projek "${target?.judul || 'Kokurikuler'}" dan data pendukung telah dihapus.`);
  };

  const resetProjekKokurikulerToDefault = () => {
    setProjekKokurikulerList(INITIAL_PROJEK_KOKURIKULER);
    setDplAssessmentList(INITIAL_DPL_ASSESSMENTS);
    setJurnalKokurikulerList(INITIAL_JURNAL_KOKURIKULER);
    setArtefakKokurikulerList(INITIAL_ARTEFAK_KOKURIKULER);
    addToast('info', 'Reset Kokurikuler', 'Data kokurikuler & DPL telah dikembalikan ke contoh awal.');
  };

  const saveDPLAssessment = (record: Omit<SiswaDPLCapaianRecord, 'id'> & { id?: string }) => {
    setDplAssessmentList(prev => {
      const existingIdx = prev.findIndex(r => r.projekId === record.projekId && r.siswaId === record.siswaId);
      if (existingIdx >= 0) {
        const updated = [...prev];
        updated[existingIdx] = {
          ...updated[existingIdx],
          ...record,
          id: updated[existingIdx].id,
          waktuPenilaian: new Date().toISOString().split('T')[0]
        };
        return updated;
      } else {
        const newRecord: SiswaDPLCapaianRecord = {
          ...record,
          id: record.id || `dpl-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
          waktuPenilaian: new Date().toISOString().split('T')[0]
        };
        return [newRecord, ...prev];
      }
    });
    addToast('success', 'Asesmen DPL Tersimpan', 'Capaian karakter peserta didik berhasil diperbarui.');
  };

  const bulkSaveDPLAssessments = (records: SiswaDPLCapaianRecord[]) => {
    setDplAssessmentList(prev => {
      const map = new Map(prev.map(r => [`${r.projekId}_${r.siswaId}`, r]));
      for (const rec of records) {
        map.set(`${rec.projekId}_${rec.siswaId}`, {
          ...rec,
          waktuPenilaian: rec.waktuPenilaian || new Date().toISOString().split('T')[0]
        });
      }
      return Array.from(map.values());
    });
    addToast('success', 'Asesmen Massal Tersimpan', `${records.length} capaian DPL siswa berhasil diperbarui.`);
  };

  const getDPLAssessmentByStudent = (projekId: string, siswaId: string) => {
    return dplAssessmentList.find(r => r.projekId === projekId && r.siswaId === siswaId);
  };

  const generateAIDPLNarrative = (siswaId: string, projekId: string): string => {
    const student = students.find(s => s.id === siswaId);
    const projek = projekKokurikulerList.find(p => p.id === projekId);
    const rec = dplAssessmentList.find(r => r.projekId === projekId && r.siswaId === siswaId);
    const nama = student?.name || 'Peserta didik';

    if (!rec || Object.keys(rec.capaianPerDimensi || {}).length === 0) {
      return `Ananda ${nama} menunjukkan antusiasme dan partisipasi aktif dalam mengikuti seluruh rangkaian aktivitas projek "${projek?.judul || 'Kokurikuler'}". Perlu terus didampingi untuk mematangkan inisiatif dan kemandirian berkarya.`;
    }

    const items = Object.values(rec.capaianPerDimensi || {}) as Array<{ predikat: DPLPredikat; catatan?: string }>;
    const sbCount = items.filter(v => v.predikat === 'SB').length;
    const bshCount = items.filter(v => v.predikat === 'BSH').length;
    const mbCount = items.filter(v => v.predikat === 'MB').length;

    let narrative = `Ananda ${nama} telah menyelesaikan projek "${projek?.judul || 'Kokurikuler'}" dengan sangat baik. `;
    if (sbCount >= 2) {
      narrative += `Karakter kepemimpinan, kepedulian lingkungan, dan kolaborasi kelompok berkembang sangat melampaui fase usianya. ${nama} mampu menjadi teladan bagi rekan sebaya dalam aksi nyata projek. `;
    } else if (bshCount >= 2) {
      narrative += `Capaian dimensi profil lulusan telah berkembang sesuai harapan fase secara konsisten, terutama dalam kerja sama tim, penalaran kritis memecahkan masalah, dan disiplin menyelesaikan karya. `;
    } else if (mbCount >= 2) {
      narrative += `Mulai menunjukkan pemahaman yang baik terhadap nilai-nilai karakter projek. Terus berikan dorongan positif agar lebih berani dan percaya diri saat sesi presentasi serta refleksi kelas. `;
    } else {
      narrative += `Aktif berpartisipasi dalam setiap tahapan projek. Dengan bimbingan berkelanjutan dari guru dan orang tua, potensi karakter dan keterampilannya akan berkembang semakin optimal. `;
    }

    return narrative;
  };

  const getStudentKokurikulerInfo = (siswaId: string, projekId?: string) => {
    const student = students.find(s => s.id === siswaId);
    const nama = student?.nama || student?.name || 'Peserta didik';

    const primaryProjek = projekKokurikulerList.find(p => p.id === (projekId || 'prj-kemendikdasmen-01')) || projekKokurikulerList[0];
    const primaryId = primaryProjek?.id;

    const exactRecord = dplAssessmentList.find(r => r.siswaId === siswaId && r.projekId === primaryId && r.catatanProses?.trim())
      || dplAssessmentList.find(r => r.siswaId === siswaId && r.catatanProses?.trim());

    const activeProjek = projekKokurikulerList.find(p => p.id === exactRecord?.projekId) || primaryProjek;

    if (exactRecord && exactRecord.catatanProses?.trim()) {
      return {
        deskripsi: exactRecord.catatanProses.trim(),
        projekJudul: activeProjek?.judul || 'Gerakan 7KAIH (Hidup Sehat)',
        tema: activeProjek?.tema || 'Hidup Sehat'
      };
    }

    const tujuan = activeProjek?.tujuanRingkasDeskripsi?.trim() || 'memahami manfaat berolahraga bagi tubuh dan pembiasaan berolahraga';
    return {
      deskripsi: `Ananda ${nama} menunjukkan perkembangan yang sangat baik dalam ${tujuan}. Berkembang Sesuai Harapan dalam hidup bersih dan sehat serta kebugaran, kesehatan fisik, dan kesehatan mental; Berkembang Sesuai Harapan dalam bertanggung jawab dan penyampaian argumentasi.`,
      projekJudul: activeProjek?.judul || 'Gerakan 7KAIH (Hidup Sehat)',
      tema: activeProjek?.tema || 'Hidup Sehat'
    };
  };

  const addJurnalKokurikuler = (jurnal: Omit<JurnalAktivitasKokurikuler, 'id'>) => {
    const newJ: JurnalAktivitasKokurikuler = {
      ...jurnal,
      id: `jrn-kokur-${Date.now().toString(36)}`
    };
    setJurnalKokurikulerList(prev => [newJ, ...prev]);
    addToast('success', 'Jurnal Kokurikuler Ditambahkan', 'Aktivitas pelaksanaan projek berhasil dicatat.');
  };

  const updateJurnalKokurikuler = (id: string, updated: Partial<JurnalAktivitasKokurikuler>) => {
    setJurnalKokurikulerList(prev => prev.map(j => (j.id === id ? { ...j, ...updated } : j)));
    addToast('success', 'Jurnal Diperbarui', 'Catatan jurnal kokurikuler berhasil disimpan.');
  };

  const deleteJurnalKokurikuler = (id: string) => {
    setJurnalKokurikulerList(prev => prev.filter(j => j.id !== id));
    addToast('info', 'Jurnal Dihapus', 'Catatan jurnal aktivitas projek telah dihapus.');
  };

  const addArtefakKokurikuler = (artefak: Omit<ArtefakKaryaKokurikuler, 'id'>) => {
    const newArt: ArtefakKaryaKokurikuler = {
      ...artefak,
      id: `artf-${Date.now().toString(36)}`
    };
    setArtefakKokurikulerList(prev => [newArt, ...prev]);
    addToast('success', 'Artefak Ditambahkan', `Portofolio karya "${newArt.judulKarya}" berhasil didokumentasikan.`);
  };

  const updateArtefakKokurikuler = (id: string, updated: Partial<ArtefakKaryaKokurikuler>) => {
    setArtefakKokurikulerList(prev => prev.map(a => (a.id === id ? { ...a, ...updated } : a)));
    addToast('success', 'Artefak Diperbarui', 'Data karya produk kokurikuler berhasil diperbarui.');
  };

  const deleteArtefakKokurikuler = (id: string) => {
    setArtefakKokurikulerList(prev => prev.filter(a => a.id !== id));
    addToast('info', 'Artefak Dihapus', 'Dokumentasi karya produk kokurikuler telah dihapus.');
  };

  // Reset & Backup
  const resetAllDataToDefault = () => {
    localStorage.clear();
    const yk = getYearStorageKey(INITIAL_SCHOOL_INFO.academicYear);
    localStorage.setItem(STORAGE_PREFIX + `${yk}_initialized`, 'true');
    localStorage.setItem(STORAGE_PREFIX + 'has_initialized_any_year', 'true');
    setSchoolInfo(INITIAL_SCHOOL_INFO);
    setStudents(INITIAL_STUDENTS);
    setTeachers(INITIAL_TEACHERS);
    setSubjects(INITIAL_SUBJECTS);
    setTujuanPembelajaranList(INITIAL_TUJUAN_PEMBELAJARAN);
    setGrades(generateInitialGrades());
    setAttendanceRecords(generateInitialAttendance());
    setJournals(INITIAL_JOURNALS);
    setSchedule(INITIAL_SCHEDULE);
    setTransactions(INITIAL_CASH_TRANSACTIONS);
    setWeeklyDues(generateInitialDues());
    setInventory(INITIAL_INVENTORY);
    setCounseling(INITIAL_COUNSELING);
    setCleaningDuties(INITIAL_DUTIES);
    setEvents(INITIAL_EVENTS);
    setExtracurriculars(INITIAL_EXTRACURRICULARS);
    setStudentReports(generateInitialStudentReports());
    setModulAjarList(INITIAL_MODUL_AJAR_LIST);
    setProjekKokurikulerList(INITIAL_PROJEK_KOKURIKULER);
    setDplAssessmentList(INITIAL_DPL_ASSESSMENTS);
    setJurnalKokurikulerList(INITIAL_JURNAL_KOKURIKULER);
    setArtefakKokurikulerList(INITIAL_ARTEFAK_KOKURIKULER);
    setAvailableUsers(INITIAL_USERS);
    setRolePermissions(DEFAULT_ROLE_PERMISSIONS);
    setCurrentUser(INITIAL_USERS[0]);
    addToast('info', 'Reset Berhasil', 'Seluruh data administrasi telah dikembalikan ke kondisi awal.');
  };

  const exportDatabaseToJson = () => {
    const backupData = {
      exportedAt: new Date().toISOString(),
      schoolInfo,
      users: availableUsers,
      rolePermissions,
      students,
      teachers,
      subjects,
      tujuanPembelajaran: tujuanPembelajaranList,
      grades,
      attendanceRecords,
      journals,
      modulAjar: modulAjarList,
      projekKokurikuler: projekKokurikulerList,
      dplAssessments: dplAssessmentList,
      jurnalKokurikuler: jurnalKokurikulerList,
      artefakKokurikuler: artefakKokurikulerList,
      schedule,
      transactions,
      weeklyDues,
      inventory,
      counseling,
      cleaningDuties,
      events,
      extracurriculars,
      studentReports
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `Backup_Administrasi_Kelas_SD_${schoolInfo.className.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    addToast('success', 'Backup Berhasil', 'File JSON database telah diunduh ke komputer Anda.');
  };

  const importDatabaseFromJson = (jsonStr: string): boolean => {
    try {
      const data = JSON.parse(jsonStr);
      if (data.students && Array.isArray(data.students)) {
        if (data.schoolInfo) setSchoolInfo(data.schoolInfo);
        if (data.users && Array.isArray(data.users)) setAvailableUsers(data.users);
        if (data.rolePermissions) setRolePermissions(data.rolePermissions);
        if (data.students) setStudents(data.students);
        if (data.teachers) setTeachers(data.teachers);
        if (data.subjects) setSubjects(data.subjects);
        if (data.tujuanPembelajaran && Array.isArray(data.tujuanPembelajaran)) setTujuanPembelajaranList(data.tujuanPembelajaran);
        if (data.grades) setGrades(data.grades);
        if (data.attendanceRecords) setAttendanceRecords(data.attendanceRecords);
        if (data.journals) setJournals(data.journals);
        if (data.modulAjar && Array.isArray(data.modulAjar)) setModulAjarList(data.modulAjar);
        if (data.projekKokurikuler && Array.isArray(data.projekKokurikuler)) setProjekKokurikulerList(data.projekKokurikuler);
        if (data.dplAssessments && Array.isArray(data.dplAssessments)) setDplAssessmentList(data.dplAssessments);
        if (data.jurnalKokurikuler && Array.isArray(data.jurnalKokurikuler)) setJurnalKokurikulerList(data.jurnalKokurikuler);
        if (data.artefakKokurikuler && Array.isArray(data.artefakKokurikuler)) setArtefakKokurikulerList(data.artefakKokurikuler);
        if (data.schedule) setSchedule(data.schedule);
        if (data.transactions) setTransactions(data.transactions);
        if (data.weeklyDues) setWeeklyDues(data.weeklyDues);
        if (data.inventory) setInventory(data.inventory);
        if (data.counseling) setCounseling(data.counseling);
        if (data.cleaningDuties) setCleaningDuties(data.cleaningDuties);
        if (data.events) setEvents(data.events);
        if (data.extracurriculars && Array.isArray(data.extracurriculars)) setExtracurriculars(data.extracurriculars);
        if (data.studentReports) setStudentReports(data.studentReports);
        
        // Ensure imported database is immediately written to permanent local storage
        setTimeout(() => {
          saveAllData();
        }, 100);

        addToast('success', 'Restore Sukses', 'Data administrasi berhasil diimpor dari file JSON.');
        return true;
      }
      addToast('error', 'Format Tidak Valid', 'Struktur file JSON tidak sesuai format database Administrasi SD.');
      return false;
    } catch {
      addToast('error', 'Gagal Membaca File', 'Terjadi kesalahan saat mem-parse file JSON.');
      return false;
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentTab,
        setCurrentTab: handleSetCurrentTab,
        goBack,
        tabHistory,
        currentUser,
        availableUsers,
        addUser,
        updateUser,
        deleteUser,
        toggleUserStatus,
        resetUserPassword,
        rolePermissions,
        updateRolePermissions,
        resetRolePermissionsToDefault,
        hasPermission,
        switchUserRole,
        setCurrentUser,
        isAuthenticated,
        login,
        logout,
        isDarkMode,
        toggleDarkMode,
        setDarkMode,
        schoolInfo,
        updateSchoolInfo,
        students,
        addStudent,
        updateStudent,
        deleteStudent,
        deleteAllStudents,
        deleteSelectedStudents,
        restoreSampleStudents,
        getStudentById,
        bulkImportStudents,
        teachers,
        addTeacher,
        updateTeacher,
        deleteTeacher,
        getTeacherById,
        bulkImportTeachers,
        subjects,
        addSubject,
        updateSubject,
        deleteSubject,
        tujuanPembelajaranList,
        addTP,
        bulkAddTP,
        updateTP,
        deleteTP,
        bulkImportTP,
        getTPBySubject,
        resetTPToDefault,
        applyCurriculumPhasePreset,
        attendanceRecords,
        markAttendance,
        bulkMarkAttendance,
        deleteAttendanceRecord,
        getAttendanceByDate,
        getStudentAttendanceStats,
        bulkImportAttendance,
        grades,
        saveGrade,
        bulkSaveGrades,
        bulkImportGrades,
        resetAllTPGradesToZero,
        getGradeValue,
        getStudentGradeSummary,
        getAllGradesForStudent,
        getAllMidSemesterGradesForStudent,
        studentReports,
        getStudentReport,
        updateStudentReport,
        updateGlobalReportDate,
        getEffectiveStudentAttendance,
        updateStudentReportAttendance,
        bulkAutoCalculateRankings,
        bulkAutoCalculateMidRankings,
        bulkSetKenaikanKelas,
        calculateStudentRankings,
        calculateMidSemesterRankings,
        journals,
        addJournal,
        updateJournal,
        deleteJournal,
        modulAjarList,
        addModulAjar,
        updateModulAjar,
        deleteModulAjar,
        duplicateModulAjar,
        toggleFavoriteModulAjar,
        resetModulAjarToDefault,
        schedule,
        addScheduleItem,
        updateScheduleItem,
        deleteScheduleItem,
        resetScheduleToDefault,
        duplicateDaySchedule,
        bulkImportSchedule,
        transactions,
        cashTransactions: transactions,
        addCashTransaction,
        updateCashTransaction,
        deleteCashTransaction,
        bulkImportCash,
        weeklyDues,
        toggleStudentDues,
        resetStudentDues,
        recordStudentDuesDeposit,
        getCurrentCashBalance,
        inventory,
        addInventoryItem,
        updateInventoryItem,
        deleteInventoryItem,
        bulkImportInventory,
        counseling,
        addCounselingRecord,
        updateCounselingRecord,
        deleteCounselingRecord,
        cleaningDuties,
        addDuty,
        updateDuty,
        deleteDuty,
        addStudentToDuty,
        removeStudentFromDuty,
        autoDistributeDuties,
        resetDutiesToDefault,
        events,
        addEvent,
        deleteEvent,
        extracurriculars,
        addExtracurricular,
        updateExtracurricular,
        deleteExtracurricular,
        setStudentExtracurriculars,
        dplDimensions,
        projekKokurikulerList,
        addProjekKokurikuler,
        updateProjekKokurikuler,
        deleteProjekKokurikuler,
        resetProjekKokurikulerToDefault,
        dplAssessmentList,
        saveDPLAssessment,
        bulkSaveDPLAssessments,
        getDPLAssessmentByStudent,
        generateAIDPLNarrative,
        getStudentKokurikulerInfo,
        jurnalKokurikulerList,
        addJurnalKokurikuler,
        updateJurnalKokurikuler,
        deleteJurnalKokurikuler,
        artefakKokurikulerList,
        addArtefakKokurikuler,
        updateArtefakKokurikuler,
        deleteArtefakKokurikuler,
        toasts,
        addToast,
        removeToast,
        resetAllDataToDefault,
        exportDatabaseToJson,
        importDatabaseFromJson,
        lastSavedAt,
        saveAllData,
        isAutoSaveActive: true,
        availableAcademicYears,
        switchAcademicYear,
        addAcademicYear,
        isAcademicYearModalOpen,
        setIsAcademicYearModalOpen,
        getStudentCountForYear,
        selectedStudentForModal,
        setSelectedStudentForModal
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
