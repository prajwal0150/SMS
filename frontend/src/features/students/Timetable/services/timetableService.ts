import { supabase } from "../../../../lib/supabase";

import type {
  StudentTimetableEntry,
  StudentTimetableSummary,
  StudentDaySummary,
} from "../types/timetableTypes";

/**
 * Reads a single row from a view that is scoped to the
 * logged-in student (security_invoker = true, auth.uid()).
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
 * Reads all rows from a student-scoped view.
 */
const readMany = async <T>(view: string): Promise<T[]> => {
  const { data, error } = await supabase
    .from(view)
    .select("*");

  if (error) {
    throw new Error(`${view}: ${error.message}`);
  }

  return (data ?? []) as T[];
};

/**
 * The student's class / section / academic-year summary.
 *
 * Throws when the summary view is unavailable; the hook
 * catches it and falls back to the weekly rows so the page
 * still renders.
 */
export const fetchStudentTimetableSummary =
  async (): Promise<StudentTimetableSummary | null> => {
    try {
      return await readSingle<StudentTimetableSummary>(
        "student_timetable_summary"
      );
    } catch {
      // The summary view is convenience metadata - the weekly
      // table is the source of truth, so fail soft here.
      return null;
    }
  };

/**
 * The student's full weekly timetable (Mon-Sat), ordered
 * by day then period then start time.
 */
export const fetchStudentWeeklyTimetable =
  async (): Promise<StudentTimetableEntry[]> => {
    return readMany<StudentTimetableEntry>("student_timetable");
  };

/**
 * Per-day period counts used for the day header cards.
 */
export const fetchStudentTimetableByDay =
  async (): Promise<StudentDaySummary[]> => {
    try {
      return await readMany<StudentDaySummary>(
        "student_timetable_by_day"
      );
    } catch {
      // Derived data is optional - the page can compute
      // empty day counts from the weekly rows if needed.
      return [];
    }
  };
