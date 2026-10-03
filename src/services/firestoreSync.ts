import {
  collection,
  doc,
  setDoc,
  getDocs,
  deleteDoc,
  onSnapshot,
  writeBatch
} from 'firebase/firestore';
import { db, auth, handleFirestoreError, OperationType, testConnection } from '../firebase';
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
  SchoolInfo
} from '../types';

export interface FirebaseSyncStatus {
  isConnected: boolean;
  isSyncing: boolean;
  lastSyncedAt: Date | null;
  error: string | null;
}

// Collections Names constants
export const COLLECTIONS = {
  SETTINGS: 'settings',
  STUDENTS: 'students',
  TEACHERS: 'teachers',
  SUBJECTS: 'subjects',
  TP: 'tujuanPembelajaran',
  GRADES: 'grades',
  ATTENDANCE: 'attendance',
  SCHEDULE: 'schedule',
  DUTIES: 'cleaningDuties',
  EVENTS: 'events',
  JOURNALS: 'journals',
  TRANSACTIONS: 'transactions',
  DUES: 'weeklyDues',
  INVENTORY: 'inventory',
  NOTES: 'studentNotes'
};

// Generic single document save with error handling
export async function saveDocument<T extends Record<string, any>>(collectionName: string, docId: string, data: T) {
  try {
    const docRef = doc(db, collectionName, docId);
    await setDoc(docRef, data, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${collectionName}/${docId}`);
  }
}

// Generic single document delete with error handling
export async function removeDocument(collectionName: string, docId: string) {
  try {
    const docRef = doc(db, collectionName, docId);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${collectionName}/${docId}`);
  }
}

// Bulk seed if collection is empty
export async function seedCollectionIfEmpty<T extends { id?: string }>(
  collectionName: string,
  initialItems: T[],
  getId: (item: T) => string
) {
  try {
    const colRef = collection(db, collectionName);
    const snapshot = await getDocs(colRef);
    if (snapshot.empty && initialItems.length > 0) {
      const batch = writeBatch(db);
      for (const item of initialItems) {
        const id = getId(item);
        const docRef = doc(db, collectionName, id);
        batch.set(docRef, item);
      }
      await batch.commit();
      console.log(`[Firebase] Initialized collection ${collectionName} with ${initialItems.length} records.`);
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, collectionName);
  }
}

// Sync School Info
export async function syncSchoolInfo(info: SchoolInfo) {
  await saveDocument(COLLECTIONS.SETTINGS, 'schoolInfo', info);
}

// Sync Student
export async function syncStudent(student: Student) {
  await saveDocument(COLLECTIONS.STUDENTS, student.id, student);
}
export async function deleteStudentDoc(studentId: string) {
  await removeDocument(COLLECTIONS.STUDENTS, studentId);
}

// Sync Teacher
export async function syncTeacher(teacher: Teacher) {
  await saveDocument(COLLECTIONS.TEACHERS, teacher.id, teacher);
}
export async function deleteTeacherDoc(teacherId: string) {
  await removeDocument(COLLECTIONS.TEACHERS, teacherId);
}

// Sync Subject
export async function syncSubject(subject: Subject) {
  await saveDocument(COLLECTIONS.SUBJECTS, subject.id, subject);
}
export async function deleteSubjectDoc(subjectId: string) {
  await removeDocument(COLLECTIONS.SUBJECTS, subjectId);
}

// Sync TP
export async function syncTP(tp: TujuanPembelajaran) {
  await saveDocument(COLLECTIONS.TP, tp.id, tp);
}
export async function deleteTPDoc(tpId: string) {
  await removeDocument(COLLECTIONS.TP, tpId);
}

// Sync Grade
export async function syncGrade(grade: GradeRecord) {
  await saveDocument(COLLECTIONS.GRADES, grade.id, grade);
}

// Sync Attendance
export async function syncAttendance(record: AttendanceRecord) {
  await saveDocument(COLLECTIONS.ATTENDANCE, record.id, record);
}
export async function deleteAttendanceDoc(recordId: string) {
  await removeDocument(COLLECTIONS.ATTENDANCE, recordId);
}

// Sync Schedule
export async function syncScheduleItem(item: ScheduleItem) {
  await saveDocument(COLLECTIONS.SCHEDULE, item.id, item);
}
export async function deleteScheduleItemDoc(itemId: string) {
  await removeDocument(COLLECTIONS.SCHEDULE, itemId);
}

// Sync Cleaning Duty
export async function syncDuty(duty: CleaningDuty) {
  await saveDocument(COLLECTIONS.DUTIES, duty.hari, duty);
}
export async function deleteDutyDoc(hari: string) {
  await removeDocument(COLLECTIONS.DUTIES, hari);
}

// Sync Event
export async function syncEvent(event: SchoolEvent) {
  await saveDocument(COLLECTIONS.EVENTS, event.id, event);
}
export async function deleteEventDoc(eventId: string) {
  await removeDocument(COLLECTIONS.EVENTS, eventId);
}

// Sync Journal
export async function syncJournal(journal: TeachingJournal) {
  await saveDocument(COLLECTIONS.JOURNALS, journal.id, journal);
}
export async function deleteJournalDoc(journalId: string) {
  await removeDocument(COLLECTIONS.JOURNALS, journalId);
}

// Sync Transaction
export async function syncTransaction(tx: CashTransaction) {
  await saveDocument(COLLECTIONS.TRANSACTIONS, tx.id, tx);
}
export async function deleteTransactionDoc(txId: string) {
  await removeDocument(COLLECTIONS.TRANSACTIONS, txId);
}

// Sync Weekly Dues
export async function syncWeeklyDues(dues: StudentWeeklyDues) {
  await saveDocument(COLLECTIONS.DUES, `${dues.siswaId}_${dues.bulan}`, dues);
}

// Sync Inventory Item
export async function syncInventoryItem(item: InventoryItem) {
  await saveDocument(COLLECTIONS.INVENTORY, item.id, item);
}
export async function deleteInventoryDoc(itemId: string) {
  await removeDocument(COLLECTIONS.INVENTORY, itemId);
}

// Sync Counseling / Student Note
export async function syncStudentNote(note: CounselingRecord) {
  await saveDocument(COLLECTIONS.NOTES, note.id, note);
}
export async function deleteStudentNoteDoc(noteId: string) {
  await removeDocument(COLLECTIONS.NOTES, noteId);
}
