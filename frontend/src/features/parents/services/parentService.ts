import { supabase } from "../../../lib/supabase";

import type {
  ParentAssignmentRow,
  ParentAttendanceRow,
  ParentChild,
  ParentChildSummary,
  ParentExamRow,
  ParentFeeRow,
  ParentInvoiceRow,
  ParentMarkRow,
  ParentNoticeRow,
  ParentProfile,
  ParentResultRow,
  ParentTimetableRow,
} from "../types/parentTypes";

/**
 * Reads a single row from a view scoped to the logged-in parent
 * (security_invoker = true, auth.uid()). Fails soft (null) when
 * the view has not been created yet so sibling views still
 * render.
 */
const readSingle = async <T>(view: string): Promise<T | null> => {
  try {
    const { data, error } = await supabase
      .from(view)
      .select("*")
      .single();

    if (error) {
      return null;
    }

    return (data ?? null) as T | null;
  } catch {
    return null;
  }
};

/**
 * Reads every row from a parent-scoped view. Fails soft ([]) when
 * the view is unavailable.
 */
const readMany = async <T>(view: string): Promise<T[]> => {
  try {
    const { data, error } = await supabase
      .from(view)
      .select("*");

    if (error) {
      return [];
    }

    return (data ?? []) as T[];
  } catch {
    return [];
  }
};

/**
 * Keeps the fetch filtered by the selected child. The views are
 * already limited to the logged-in parent's children, so this
 * only narrows them further (never widens access).
 */
const forStudent = <T extends { student_id: string }>(
  rows: T[],
  studentId: string
): T[] => rows.filter((row) => row.student_id === studentId);

// ============================================================
// PROFILE
// ============================================================

export const fetchParentProfile =
  async (): Promise<ParentProfile | null> =>
    readSingle<ParentProfile>("parent_profile");

// ============================================================
// CHILDREN
// ============================================================

export const fetchParentChildren =
  async (): Promise<ParentChild[]> =>
    readMany<ParentChild>("parent_children");

export const fetchParentSummaries =
  async (): Promise<ParentChildSummary[]> =>
    readMany<ParentChildSummary>("parent_student_summary");

// ============================================================
// CHILD-SCOPED DATA
// ============================================================

export const fetchChildAttendance = async (
  studentId: string
): Promise<ParentAttendanceRow[]> =>
  forStudent(
    await readMany<ParentAttendanceRow>("parent_student_attendance"),
    studentId
  );

export const fetchChildResults = async (
  studentId: string
): Promise<ParentResultRow[]> =>
  forStudent(
    await readMany<ParentResultRow>("parent_student_results"),
    studentId
  );

export const fetchChildMarks = async (
  studentId: string
): Promise<ParentMarkRow[]> =>
  forStudent(
    await readMany<ParentMarkRow>("parent_student_marks"),
    studentId
  );

export const fetchChildFees = async (
  studentId: string
): Promise<ParentFeeRow[]> =>
  forStudent(
    await readMany<ParentFeeRow>("parent_student_fees"),
    studentId
  );

export const fetchChildInvoices = async (
  studentId: string
): Promise<ParentInvoiceRow[]> =>
  forStudent(
    await readMany<ParentInvoiceRow>("parent_student_invoices"),
    studentId
  );

export const fetchChildAssignments = async (
  studentId: string
): Promise<ParentAssignmentRow[]> =>
  forStudent(
    await readMany<ParentAssignmentRow>("parent_student_assignments"),
    studentId
  );

export const fetchChildTimetable = async (
  studentId: string
): Promise<ParentTimetableRow[]> =>
  forStudent(
    await readMany<ParentTimetableRow>("parent_student_timetable"),
    studentId
  );

export const fetchChildExams = async (
  studentId: string
): Promise<ParentExamRow[]> =>
  forStudent(
    await readMany<ParentExamRow>("parent_student_exams"),
    studentId
  );

// ============================================================
// NOTICES (school-wide)
// ============================================================

export const fetchParentNotices =
  async (): Promise<ParentNoticeRow[]> =>
    readMany<ParentNoticeRow>("parent_student_notices");