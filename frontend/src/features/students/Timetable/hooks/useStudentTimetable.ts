import { useCallback, useEffect, useState } from "react";

import {
  fetchStudentTimetableSummary,
  fetchStudentWeeklyTimetable,
  fetchStudentTimetableByDay,
} from "../services/timetableService";

import type {
  StudentTimetableEntry,
  StudentTimetableSummary,
  StudentDaySummary,
} from "../types/timetableTypes";

/**
 * Loads the logged-in student's timetable.
 *
 * All three views (student_timetable_summary, student_timetable,
 * student_timetable_by_day) are already scoped to the logged in
 * account through RLS (security_invoker = true, auth.uid()),
 * so the student's email / id never has to leave the server.
 */
export const useStudentTimetable = () => {
  const [summary, setSummary] =
    useState<StudentTimetableSummary | null>(null);

  const [weekly, setWeekly] =
    useState<StudentTimetableEntry[]>([]);

  const [byDay, setByDay] =
    useState<StudentDaySummary[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [summaryRow, weeklyRows, byDayRows] =
        await Promise.all([
          fetchStudentTimetableSummary(),
          fetchStudentWeeklyTimetable(),
          fetchStudentTimetableByDay(),
        ]);

      setSummary(summaryRow);
      setWeekly(weeklyRows);
      setByDay(byDayRows);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load your timetable."
      );
    } finally {
      setLoading(false);
    }
  }, []);


  useEffect(() => {
    load();
  }, [load]);


  return { summary, weekly, byDay, loading, error, reload: load };
};
