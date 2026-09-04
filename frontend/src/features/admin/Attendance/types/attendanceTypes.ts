/**
 * Attendance Management — shared types.
 *
 * Backed by supabase/Admin/attendance-managhement.sql:
 *  - student_attendance table + student_attendance_report view
 *  - staff_attendance table + teacher_attendance_report view
 *  - class_attendance_summary / low_attendance_students views
 */

export type AttendanceTab = "student" | "staff";

export type AttendanceStatus = "present" | "absent" | "late" | "leave";

export const ATTENDANCE_STATUSES: AttendanceStatus[] = [
  "present",
  "absent",
  "late",
  "leave",
];

export interface AttendanceFilters {
  date: string; // yyyy-mm-dd (exact day, matches the UI date picker)
  classId: string; // "" = all
  sectionId: string; // "" = all
  subjectId: string; // "" = all
  teacherId: string; // "" = all
  status: string; // "" = all
}

export interface StudentAttendanceRow {
  id: string;
  student_id: string;
  admission_number: string | null;
  roll_number: number | string | null;
  student_name: string;
  class_id: string;
  class_name: string | null;
  section_id: string;
  section_name: string | null;
  subject_id: string | null;
  subject_name: string | null;
  teacher_id: string | null;
  teacher_name: string | null;
  attendance_date: string;
  status: AttendanceStatus;
  remarks: string | null;
}

export interface StaffAttendanceRow {
  id: string;
  teacher_id: string;
  teacher_name: string;
  email: string | null;
  phone: string | null;
  primary_subject: string | null;
  qualification: string | null;
  attendance_date: string;
  status: AttendanceStatus;
  remarks: string | null;
}

export interface ClassAttendanceSummaryRow {
  class_id: string;
  class_name: string | null;
  section_id: string;
  section_name: string | null;
  total_records: number;
  total_students: number;
  present_records: number;
  absent_records: number;
  late_records: number;
  leave_records: number;
  attendance_percentage: number | null;
}

export interface LowAttendanceStudent {
  student_id: string;
  admission_number: string | null;
  roll_number: number | string | null;
  student_name: string;
  class_name: string | null;
  section_name: string | null;
  total_days: number;
  present_days: number;
  absent_days: number;
  late_days: number;
  leave_days: number;
  attendance_percentage: number | null;
}

export interface TeacherOption {
  id: string;
  first_name: string;
  last_name: string | null;
  email: string | null;
}

export interface StudentOption {
  id: string;
  admission_number: string | null;
  roll_number: number | string | null;
  first_name: string;
  middle_name: string | null;
  last_name: string | null;
  class_id: string | null;
  section_id: string | null;
}

export interface AttendanceStats {
  total: number;
  present: number;
  absent: number;
  late: number;
  rate: number; // percentage (present + late count as attended)
}

export type ReportTargetType = "student" | "staff";

export interface ReportOptions {
  targetType: ReportTargetType;
  studentId: string; // "" = every student in scope
  teacherId: string; // "" = every teacher
  classId: string;
  sectionId: string;
  fromDate: string;
  toDate: string;
  /** Human-readable scope shown on the PDF (e.g. "Student: Aarav Sharma"). */
  label?: string;
}