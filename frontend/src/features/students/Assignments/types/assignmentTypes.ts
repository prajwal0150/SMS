/**
 * Student Assignments types.
 *
 * Reads from the `class_assignments` table (RLS `using(true)`
 * for authenticated users) filtered client-side by the
 * student's class/section - the same approach the student
 * dashboard uses for its recent-assignment widget.
 *
 * Teacher names come from the embedded `teachers` table
 * (also readable by authenticated users).
 */

/** Raw assignment status set by the teacher. */
export type AssignmentRawStatus = "Open" | "Grading" | "Closed";

/** Student-facing assignment status, derived in the UI. */
export type StudentAssignmentStatus = "pending" | "submitted" | "overdue";

/** A class_assignment row enriched with the teacher name. */
export interface StudentAssignment {
  id: string;
  title: string;
  description: string | null;
  subject: string;
  class_name: string;
  section: string | null;
  due_date: string;
  status: AssignmentRawStatus;
  teacher_id: string | null;
  teacher_name: string | null;
  created_at: string;
  /** Derived from `status` and `due_date`. */
  studentStatus: StudentAssignmentStatus;
}

/** The student's current class/section, from
 * the student_timetable_class view (scoped to auth.uid()). */
export interface StudentClassInfo {
  student_id: string;
  student_name: string;
  class_name: string | null;
  section_name: string | null;
  class_code: string | null;
  academic_year: string | null;
  class_teacher_name: string | null;
}
