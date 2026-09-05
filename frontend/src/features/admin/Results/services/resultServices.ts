import { supabase } from "../../../../lib/supabase";

import type {
  ClassResultSummaryRow,
  ExamOption,
  GradeScale,
  ResultExportOptions,
  ResultFilters,
  ResultReportRow,
  ResultSummaryRow,
  WorkflowStatus,
} from "../types/resultTypes";


// ==============================
// RESULT LIST (result_summary view)
// ==============================

/**
 * One row per student per exam. Filtered server-side where the
 * view exposes the column; search + sort happen client-side.
 */
export const fetchResultSummaries = async (
  filters: Pick<
    ResultFilters,
    "academicYear" | "examId" | "classId" | "sectionId" | "resultStatus" | "workflowStatus"
  >
): Promise<ResultSummaryRow[]> => {
  let query = supabase.from("result_summary").select("*");

  if (filters.academicYear) {
    query = query.eq("academic_year", filters.academicYear);
  }
  if (filters.examId) {
    query = query.eq("exam_id", filters.examId);
  }
  if (filters.classId) {
    query = query.eq("class_id", filters.classId);
  }
  if (filters.sectionId) {
    query = query.eq("section_id", filters.sectionId);
  }
  if (filters.resultStatus) {
    query = query.eq("result_status", filters.resultStatus);
  }
  if (filters.workflowStatus) {
    query = query.eq("workflow_status", filters.workflowStatus);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as ResultSummaryRow[];
};


// ==============================
// RESULT DETAIL (result_report view)
// ==============================

/**
 * Every subject-mark row of one student's result, with the
 * joined student / exam / class / subject names.
 */
export const fetchResultReport = async (
  resultId: string
): Promise<ResultReportRow[]> => {
  const { data, error } = await supabase
    .from("result_report")
    .select("*")
    .eq("result_id", resultId);

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as ResultReportRow[];
};


/** Full detail rows for a whole exam / class / single student (PDF export). */
export const fetchResultSummariesForExport = async (
  options: ResultExportOptions
): Promise<ResultSummaryRow[]> => {
  let query = supabase
    .from("result_summary")
    .select("*")
    .order("class_name", { ascending: true })
    .order("roll_number", { ascending: true });

  if (options.examId) {
    query = query.eq("exam_id", options.examId);
  }
  if (options.scope === "class" || options.scope === "student") {
    if (options.classId) {
      query = query.eq("class_id", options.classId);
    }
    if (options.sectionId) {
      query = query.eq("section_id", options.sectionId);
    }
  }
  if (options.scope === "student" && options.studentId) {
    query = query.eq("student_id", options.studentId);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as ResultSummaryRow[];
};


// ==============================
// WORKFLOW (admin review actions)
// ==============================

export interface WorkflowUpdate {
  workflow_status: WorkflowStatus;
  reviewed_by?: string | null;
  reviewed_at?: string | null;
  published_by?: string | null;
  published_at?: string | null;
  remarks?: string | null;
}

/** Applies one workflow transition to a set of result rows. */
export const updateResultsWorkflow = async (
  resultIds: string[],
  update: WorkflowUpdate
): Promise<void> => {
  if (resultIds.length === 0) {
    return;
  }

  const { error } = await supabase
    .from("results")
    .update({ ...update, updated_at: new Date().toISOString() })
    .in("id", resultIds);

  if (error) {
    throw new Error(error.message);
  }
};


// ==============================
// LOOKUPS
// ==============================

export const fetchExamOptions = async (): Promise<ExamOption[]> => {
  const { data, error } = await supabase
    .from("exams")
    .select(
      "id, name, exam_type, class_name, section, start_date, end_date, status"
    )
    .order("start_date", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as ExamOption[];
};

export const fetchGradeScales = async (): Promise<GradeScale[]> => {
  const { data, error } = await supabase
    .from("grade_scales")
    .select(
      "id, grade, min_percentage, max_percentage, description, status"
    )
    .order("min_percentage", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as GradeScale[];
};

// ==============================
// CLASS / OVERALL SUMMARY (class_result_summary view)
// ==============================

/**
 * Per exam + class + section aggregates (students, pass/fail/absent/
 * incomplete counts, averages, pass rate). Used by the Class/Overall
 * Reports panel so the admin can see the health of any exam.
 */
export const fetchClassResultSummaries = async (filters: {
  academicYear?: string;
  examId?: string;
  classId?: string;
  sectionId?: string;
}): Promise<ClassResultSummaryRow[]> => {
  let query = supabase
    .from("class_result_summary")
    .select("*")
    .order("exam_name", { ascending: true })
    .order("class_name", { ascending: true })
    .order("section_name", { ascending: true });

  if (filters.academicYear) {
    query = query.eq("academic_year", filters.academicYear);
  }
  if (filters.examId) {
    query = query.eq("exam_id", filters.examId);
  }
  if (filters.classId) {
    query = query.eq("class_id", filters.classId);
  }
  if (filters.sectionId) {
    query = query.eq("section_id", filters.sectionId);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as ClassResultSummaryRow[];
};
