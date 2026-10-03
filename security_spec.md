# Security Specification for Firestore Rules

## 1. Data Invariants
- `settings/{settingId}`: System configuration and school profile. Validated with `isValidSchoolInfo`.
- `students/{studentId}`: Student records. Validated with `isValidStudent`. Document ID must be alphanumeric/hyphen.
- `teachers/{teacherId}`: Teacher profiles. Validated with `isValidTeacher`.
- `subjects/{subjectId}`: Subject curriculum definitions.
- `tujuanPembelajaran/{tpId}`: Learning objectives with associated mapelId.
- `grades/{gradeId}`: Assessment grades with valid student ID, subject ID, and numeric score (0-100).
- `attendance/{attendanceId}`: Daily student attendance entries.
- `schedule/{scheduleId}`: Class timetable items.
- `cleaningDuties/{dutyId}`: Daily piket cleaning duty team assignments.
- `events/{eventId}`: School agenda events.
- `journals/{journalId}`: Teacher class teaching journals.
- `transactions/{transactionId}`: Classroom cash transactions.
- `weeklyDues/{duesId}`: Student weekly dues status.
- `inventory/{itemId}`: Classroom assets and inventory.
- `studentNotes/{noteId}`: Student achievements and counseling entries.

## 2. Dirty Dozen Payloads Handled
1. Oversized string payload injection (>1000 characters) - Rejected by length guards.
2. Malformed Document IDs (containing invalid characters or length > 128) - Rejected by `isValidId`.
3. Negative or invalid numeric grade values (< 0 or > 100) - Rejected by schema validator.
4. Non-matching enum values in attendance/status - Rejected by enum check.
5. Ghost fields injection during creation/updates - Prevented by explicit schema validation.
