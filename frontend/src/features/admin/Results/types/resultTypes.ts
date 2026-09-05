/**
 * Results Management — shared types.
 *
 * Backed by supabase/Admin/result-management.sql:
 *  - results table (one row per student per exam) with the
 *    draft -> submitted -> reviewed -> published / rejected workflow
 *  - result_marks table (one row per subject per result)
 *  - result_summary / result_report views
 *  - grade_scales table
 */

export type ResultStatus = "pass" | "fail" | "absent" | "incomplete";

export type WorkflowStatus =
  | "draft"
  | "submitted"
  | "reviewed"
  | "published"
  | "rejected";

export const RESULT_STATUSES: ResultStatus[] = [
  "pass",
  "fail",
  "absent",
  "incomplete",
];

export const WORKFLOW_STATUSES: WorkflowStatus[] = [
  "draft",
  "submitted",
  "reviewed",
  "published",
  "rejected",
];

// Workflow statuses a teacher is allowed to keep editing.
export const EDITABLE_WORKFLOW: WorkflowStatus[] = ["draft", "submitted", "rejected"];

/** One row per student per exam (from the result_summary view). */
export interface ResultSummaryRow {
  result_id: string;
  student_id: string;
  admission_number: string | null;
  roll_number: number | string | null;
  student_name: string;
  exam_id: string;
  exam_name: string;
  class_id: string;
  class_name: string | null;
  section_id: string;
  section_name: string | null;
  academic_year: string;
  total_marks: number;
  obtained_marks: number;
  percentage: number;
  grade: string | null;
  result_status: ResultStatus;
  workflow_status: WorkflowStatus;
  subject_count: number;
}

/** One row per subject mark (from the result_report view). */
export interface ResultReportRow {
  result_id: string;
  student_id: string;
  admission_number: string | null;
  roll_number: number | string | null;
  student_name: string;
  class_id: string;
  class_name: string | null;
  section_id: string;
  section_name: string | null;
  exam_id: string;
  exam_name: string;
  academic_year: string;
  total_marks: number;
  obtained_marks: number;
  percentage: number;
  grade: string | null;
  result_status: ResultStatus;
  workflow_status: WorkflowStatus;
  result_remarks: string | null;
  result_mark_id: string | null;
  subject_id: string | null;
  subject_name: string | null;
  teacher_id: string | null;
  teacher_name: string | null;
  maximum_marks: number | null;
  pass_marks: number | null;
  subject_obtained_marks: number | null;
  subject_grade: string | null;
  subject_remarks: string | null;
  updated_at: string;
}

export interface ExamOption {
  id: string;
  name: string;
  exam_type: string;
  class_name: string;
  section: string | null;
  start_date: string;
  end_date: string | null;
  status: string;
}

export interface GradeScale {
  id: string;
  grade: string;
  min_percentage: number;
  max_percentage: number;
  description: string | null;
  status: string;
}

export interface ResultFilters {
  academicYear: string; // "" = all
  examId: string; // "" = all
  classId: string; // "" = all
  sectionId: string; // "" = all
  resultStatus: string; // "" = all
  workflowStatus: string; // "" = all
  search: string; // free text on name / admission no / roll
  sortBy: SortOption;
  sortDir: "asc" | "desc";
}

export type SortOption = "roll" | "name" | "percentage" | "recent";

export interface ResultStats {
  total: number;
  published: number;
  pendingReview: number;
  drafts: number;
  passPercentage: number;
}

/** Scope options for the PDF export popup. */
export type ResultExportScope = "exam" | "class" | "student";

export interface ResultExportOptions {
  scope: ResultExportScope;
  examId: string;
  classId: string;
  sectionId: string;
  studentId: string;
  /** Human readable scope shown on the PDF header. */
  label: string;
}
/** One row per exam + class + section aggregate (from class_result_summary view). */
export interface ClassResultSummaryRow {
  exam_id: string;
  exam_name: string;
  class_id: string;
  class_name: string | null;
  section_id: string;
  section_name: string | null;
  academic_year: string;
  total_students: number;
  passed_students: number;
  failed_students: number;
  absent_students: number;
  incomplete_students: number;
  average_percentage: number;
  highest_percentage: number;
  lowest_percentage: number;
  pass_percentage: number;
}
