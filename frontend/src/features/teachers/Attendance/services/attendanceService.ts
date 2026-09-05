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
 */
export const fetchAttendanceForClass = async (input: {
  classId: string;
  sectionId: string;
  subjectId: string | null;
  date: string;
}): Promise<ExistingAttendanceRow[]> => {
  const { classId, sectionId, subjectId, date } = input;

  let query = supabase
    .from("attendance")
    .select("student_id, status")
    .eq("class_id", classId)
    .eq("section_id", sectionId)
    .eq("attendance_date", date);

  if (subjectId) {
    query = query.eq("subject_id", subjectId);
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
 * Insert new attendance rows directly for a class + section + subject + date.
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
  const { error } = await supabase.from("attendance").insert(rows);

  if (error) {
    throw new Error(error.message);
  }

  return rows.length;
};


