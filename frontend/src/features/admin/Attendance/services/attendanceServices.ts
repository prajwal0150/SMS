import { supabase } from "../../../../lib/supabase";

import type {
  AttendanceFilters,
  ReportOptions,
  StaffAttendanceRow,
  StudentAttendanceRow,
  StudentOption,
  TeacherOption,
} from "../types/attendanceTypes";


// ==============================
// DAILY ATTENDANCE (page tables)
// ==============================

/**
 * Student attendance for one day.
 * Reads the `student_attendance_report` view so class / section /
 * subject / teacher names arrive already joined.
 */
export const fetchStudentAttendance = async (
  filters: AttendanceFilters
): Promise<StudentAttendanceRow[]> => {
  let query = supabase
    .from("student_attendance_report")
    .select("*")
    .eq("attendance_date", filters.date)
    .order("class_name", { ascending: true })
    .order("section_name", { ascending: true })
    .order("student_name", { ascending: true });

  if (filters.classId) {
    query = query.eq("class_id", filters.classId);
  }
  if (filters.sectionId) {
    query = query.eq("section_id", filters.sectionId);
  }
  if (filters.subjectId) {
    query = query.eq("subject_id", filters.subjectId);
  }
  if (filters.teacherId) {
    query = query.eq("teacher_id", filters.teacherId);
  }
  if (filters.status) {
    query = query.eq("status", filters.status);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as StudentAttendanceRow[];
};


/**
 * Staff attendance for one day.
 * Reads the `teacher_attendance_report` view (staff_attendance joined
 * with the teachers table).
 */
export const fetchStaffAttendance = async (
  filters: Pick<AttendanceFilters, "date" | "status" | "teacherId">
): Promise<StaffAttendanceRow[]> => {
  let query = supabase
    .from("teacher_attendance_report")
    .select("*")
    .eq("attendance_date", filters.date)
    .order("teacher_name", { ascending: true });

  if (filters.teacherId) {
    query = query.eq("teacher_id", filters.teacherId);
  }
  if (filters.status) {
    query = query.eq("status", filters.status);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as StaffAttendanceRow[];
};


// ==============================
// LOOKUP OPTIONS (report modal)
// ==============================

export const fetchStudentOptions = async (): Promise<StudentOption[]> => {
  const { data, error } = await supabase
    .from("students")
    .select(
      "id, admission_number, roll_number, first_name, middle_name, last_name, class_id, section_id"
    )
    .order("first_name", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as StudentOption[];
};


export const fetchTeacherOptions = async (): Promise<TeacherOption[]> => {
  const { data, error } = await supabase
    .from("teachers")
    .select("id, first_name, last_name, email")
    .order("first_name", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as TeacherOption[];
};


// ==============================
// RANGE QUERIES (PDF reports)
// ==============================

export const fetchStudentAttendanceRange = async (
  options: ReportOptions
): Promise<StudentAttendanceRow[]> => {
  let query = supabase
    .from("student_attendance_report")
    .select("*")
    .gte("attendance_date", options.fromDate)
    .lte("attendance_date", options.toDate)
    .order("attendance_date", { ascending: true })
    .order("class_name", { ascending: true })
    .order("student_name", { ascending: true });

  if (options.studentId) {
    query = query.eq("student_id", options.studentId);
  }
  if (options.classId) {
    query = query.eq("class_id", options.classId);
  }
  if (options.sectionId) {
    query = query.eq("section_id", options.sectionId);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as StudentAttendanceRow[];
};


export const fetchStaffAttendanceRange = async (
  options: ReportOptions
): Promise<StaffAttendanceRow[]> => {
  let query = supabase
    .from("teacher_attendance_report")
    .select("*")
    .gte("attendance_date", options.fromDate)
    .lte("attendance_date", options.toDate)
    .order("attendance_date", { ascending: true })
    .order("teacher_name", { ascending: true });

  if (options.teacherId) {
    query = query.eq("teacher_id", options.teacherId);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as StaffAttendanceRow[];
};