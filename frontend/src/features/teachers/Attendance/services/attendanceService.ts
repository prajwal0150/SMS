import { supabase } from "../../../../lib/supabase";

export interface StudentRow {
  id: string;
  roll_number: string | null;
  first_name: string;
  middle_name: string | null;
  last_name: string;
}

export interface ExistingAttendanceRow {
  student_id: string;
  status: string;
}

/**
 * Real student list added by the admin for a class + section.
 */
export const fetchClassStudents = async (
  className: string,
  section: string
): Promise<StudentRow[]> => {
  const { data, error } = await supabase
    .from("students")
    .select("id, roll_number, first_name, middle_name, last_name")
    .eq("class_name", className)
    .eq("section", section)
    .eq("status", "active")
    .order("roll_number", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as StudentRow[];
};

/**
 * Existing attendance rows for a class + section + subject on a date.
 *
 * Reads the real `student_attendance` table created by
 * supabase/Admin/attendance-managhement.sql (the previous
 * "attendance" table name does not exist in the schema, which
 * caused the "could not find the table 'public.attendance'"
 * error when loading students).
 */
export const fetchAttendanceForClass = async (input: {
  classId: string;
  sectionId: string;
  subjectId: string | null;
  date: string;
}): Promise<ExistingAttendanceRow[]> => {
  const { classId, sectionId, subjectId, date } = input;

  let query = supabase
    .from("student_attendance")
    .select("student_id, status")
    .eq("class_id", classId)
    .eq("section_id", sectionId)
    .eq("attendance_date", date);

  if (subjectId) {
    query = query.eq("subject_id", subjectId);
  } else {
    query = query.is("subject_id", null);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((row) => ({
    student_id: row.student_id,
    status: row.status,
  }));
};

/**
 * Save attendance for a class + section + subject + date.
 *
 * `student_attendance` carries a unique index on
 * (student_id, attendance_date, coalesce(subject_id, uuid)),
 * which PostgREST upserts cannot target, so saved days are
 * replaced: existing rows for the same class + section +
 * subject + date are deleted first, then the new rows are
 * inserted. Re-saving a day therefore updates the marks
 * instead of failing with a duplicate-key error.
 */
export const saveStudentAttendance = async (
  rows: {
    student_id: string;
    teacher_id: string;
    class_id: string;
    section_id: string;
    subject_id: string | null;
    attendance_date: string;
    status: "present" | "absent";
  }[]
): Promise<number> => {
  if (rows.length === 0) {
    return 0;
  }

  const {
    class_id: classId,
    section_id: sectionId,
    subject_id: subjectId,
    attendance_date: date,
  } = rows[0];

  // Remove the previous marks for this exact lesson slot.
  let deleteQuery = supabase
    .from("student_attendance")
    .delete()
    .eq("class_id", classId)
    .eq("section_id", sectionId)
    .eq("attendance_date", date);

  if (subjectId) {
    deleteQuery = deleteQuery.eq("subject_id", subjectId);
  } else {
    deleteQuery = deleteQuery.is("subject_id", null);
  }

  const { error: deleteError } = await deleteQuery;

  if (deleteError) {
    throw new Error(deleteError.message);
  }

  const { error } = await supabase
    .from("student_attendance")
    .insert(rows);

  if (error) {
    throw new Error(error.message);
  }

  return rows.length;
};
