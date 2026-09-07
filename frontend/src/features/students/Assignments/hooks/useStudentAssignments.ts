import { useCallback, useEffect, useState } from "react";

import {
  fetchStudentAssignments,
  fetchStudentClassInfo,
} from "../services/assignmentService";

import type {
  StudentAssignment,
  StudentClassInfo,
} from "../types/assignmentTypes";

/**
 * Loads the logged-in student's class/section first, then
 * fetches the assignments shared with that class.
 *
 * The class info comes from the auth-scoped
 * student_timetable_class view; the assignments are read from
 * class_assignments and filtered client-side by class and
 * section (the select policy is permissive), mirroring the
 * dashboard's recent-assignment helper.
 */
export const useStudentAssignments = () => {
  const [classInfo, setClassInfo] =
    useState<StudentClassInfo | null>(null);

  const [assignments, setAssignments] =
    useState<StudentAssignment[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Resolve the student's class/section before filtering
      // the (permissively readable) assignments table.
      const classRow = await fetchStudentClassInfo();

      setClassInfo(classRow);

      const rows = await fetchStudentAssignments(
        classRow?.class_name ?? null,
        classRow?.section_name ?? null
      );

      setAssignments(rows);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load your assignments."
      );
    } finally {
      setLoading(false);
    }
  }, []);


  useEffect(() => {
    load();
  }, [load]);


  return {
    classInfo,
    assignments,
    loading,
    error,
    reload: load,
  };
};

