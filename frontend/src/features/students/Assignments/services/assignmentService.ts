import { supabase } from "../../../../lib/supabase";

import type {
  AssignmentRawStatus,
  StudentAssignment,
  StudentAssignmentStatus,
  StudentClassInfo,
} from "../types/assignmentTypes";

/**
 * Reads a single row from a view scoped to the logged-in
 * student (security_invoker = true, auth.uid()).
 */
const readSingle = async <T>(view: string): Promise<T> => {
  const { data, error } = await supabase
    .from(view)
    .select("*")
    .single();

  if (error) {
    throw new Error(`${view}: ${error.message}`);
  }

  return data as T;
};

/**
 * PostgREST may deliver an embedded row as an object or a
 * single-element array depending on relationship detection.
 */
const pickOne = <T,>(value: T | T[] | null): T | null =>
  Array.isArray(value) ? (value[0] ?? null) : (value ?? null);

/**
 * The student's current class / section. Comes from the
 * student_timetable_class view, so it is already scoped to
 * the logged-in student and needs no client-side filtering.
 */
export const fetchStudentClassInfo =
  async (): Promise<StudentClassInfo | null> => {
    try {
      return await readSingle<StudentClassInfo>(
        "student_timetable_class"
      );
    } catch {
      // Optional metadata - the page still renders with the
      // assignments table as the source of truth.
      return null;
    }
  };

/**
 * Derives a student-facing status from the data that exists:
 *
 *  - Overdue  : the assignment is still "Open" but the due
 *               date has passed (the student should have
 *               turned it in).
 *  - Submitted: the teacher has moved it to "Grading" or
 *               "Closed" (the submission window is over).
 *  - Pending  : still "Open" and the due date has not passed.
 */
const deriveStatus = (
  dueDate: string,
  status: AssignmentRawStatus
): StudentAssignmentStatus => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);

  if (status === "Open" && due < today) {
    return "overdue";
  }

  if (status !== "Open") {
    return "submitted";
  }

  return "pending";
};

/**
 * Assignments shared with the student's class.
 *
 * The class_assignments select policy is permissive
 * (`using(true)`), so the filtering by class/section is
 * performed client-side - identical to the dashboard helper.
 * Section is a soft filter because teachers may leave it
 * blank (assignment applies to the whole class).
 */
export const fetchStudentAssignments = async (
  className: string | null,
  sectionName: string | null
): Promise<StudentAssignment[]> => {
  const { data, error } = await supabase
    .from("class_assignments")
    .select(
      "id, title, description, class_name, section, subject, due_date, status, teacher_id, created_at, teachers:teacher_id(first_name, last_name)"
    )
    .order("due_date", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return ((data ?? []) as Array<{
    id: string;
    title: string;
    description: string | null;
    class_name: string;
    section: string | null;
    subject: string;
    due_date: string;
    status: string;
    teacher_id: string | null;
    created_at: string;
    teachers: { first_name: string; last_name: string } | { first_name: string; last_name: string }[] | null;
  }>)
    .filter(
      (row) =>
        (!className || row.class_name === className) &&
        (!sectionName || !row.section || row.section === sectionName)
    )
    .map((row) => {
      const teacher = pickOne(row.teachers);

      return {
        id: row.id,
        title: row.title,
        description: row.description,
        subject: row.subject,
        class_name: row.class_name,
        section: row.section,
        due_date: row.due_date,
        status: row.status as AssignmentRawStatus,
        teacher_id: row.teacher_id,
        teacher_name: teacher
          ? [teacher.first_name, teacher.last_name]
              .filter(Boolean)
              .join(" ")
          : null,
        created_at: row.created_at,
        studentStatus: deriveStatus(row.due_date, row.status as AssignmentRawStatus),
      };
    });
};
