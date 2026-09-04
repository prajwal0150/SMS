import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import type {
  AttendanceFilters,
  AttendanceStats,
  AttendanceTab,
  ReportOptions,
  StaffAttendanceRow,
  StudentAttendanceRow,
  StudentOption,
  TeacherOption,
} from "../types/attendanceTypes";

import {
  fetchStaffAttendance,
  fetchStaffAttendanceRange,
  fetchStudentAttendance,
  fetchStudentAttendanceRange,
  fetchStudentOptions,
  fetchTeacherOptions,
} from "../services/attendanceServices";

import { todayISO } from "../utils/attendanceUtils";
import { exportAttendancePdf } from "../utils/attendancePdf";
import {
  buildStaffReportPayload,
  buildStudentReportPayload,
} from "../utils/attendanceReports";


const EMPTY_FILTERS: AttendanceFilters = {
  date: todayISO(),
  classId: "",
  sectionId: "",
  subjectId: "",
  teacherId: "",
  status: "",
};


const computeStats = (rows: { status: string }[]): AttendanceStats => {
  const total = rows.length;
  const present = rows.filter((row) => row.status === "present").length;
  const absent = rows.filter((row) => row.status === "absent").length;
  const late = rows.filter((row) => row.status === "late").length;

  // present + late both count as attended (same rule as the SQL views).
  const rate =
    total > 0 ? Math.round(((present + late) / total) * 10000) / 100 : 0;

  return { total, present, absent, late, rate };
};


export const useAttendance = () => {
  const [tab, setTab] = useState<AttendanceTab>("student");
  const [filters, setFilters] = useState<AttendanceFilters>(EMPTY_FILTERS);
  const [studentRows, setStudentRows] = useState<StudentAttendanceRow[]>([]);
  const [staffRows, setStaffRows] = useState<StaffAttendanceRow[]>([]);
  const [students, setStudents] = useState<StudentOption[]>([]);
  const [teachers, setTeachers] = useState<TeacherOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);

  // Lookup options for the report modal — loaded once on mount.
  useEffect(() => {
    let cancelled = false;

    Promise.all([fetchStudentOptions(), fetchTeacherOptions()])
      .then(([studentList, teacherList]) => {
        if (!cancelled) {
          setStudents(studentList);
          setTeachers(teacherList);
        }
      })
      .catch(() => {
        // Options only power the report modal; the daily tables keep
        // working even if they fail (e.g. empty tables).
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // Attendance rows follow the current filters.
  useEffect(() => {
    let cancelled = false;

    const loadRows = async () => {
      setLoading(true);
      setError(null);

      try {
        const [studentData, staffData] = await Promise.all([
          fetchStudentAttendance(filters),
          fetchStaffAttendance({
            date: filters.date,
            status: filters.status,
            teacherId: filters.teacherId,
          }),
        ]);

        if (!cancelled) {
          setStudentRows(studentData);
          setStaffRows(staffData);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Failed to load attendance."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void loadRows();

    return () => {
      cancelled = true;
    };
  }, [filters]);

  const setFilter = useCallback(
    (key: keyof AttendanceFilters, value: string) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const resetFilters = useCallback(() => {
    setFilters({ ...EMPTY_FILTERS, date: todayISO() });
  }, []);

  /** Re-runs the current query (new object identity re-triggers the effect). */
  const refresh = useCallback(() => {
    setFilters((prev) => ({ ...prev }));
  }, []);

  const studentStats = useMemo(() => computeStats(studentRows), [studentRows]);
  const staffStats = useMemo(() => computeStats(staffRows), [staffRows]);

  /** Fetches the selected range and downloads the PDF immediately. */
  const generateReport = useCallback(async (options: ReportOptions) => {
    setGenerating(true);

    try {
      if (options.targetType === "student") {
        const rows = await fetchStudentAttendanceRange(options);
        exportAttendancePdf(buildStudentReportPayload(rows, options));
      } else {
        const rows = await fetchStaffAttendanceRange(options);
        exportAttendancePdf(buildStaffReportPayload(rows, options));
      }

      toast.success("Attendance report PDF downloaded.");
      return true;
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Failed to generate the attendance report."
      );
      return false;
    } finally {
      setGenerating(false);
    }
  }, []);

  return {
    tab,
    setTab,
    filters,
    setFilter,
    resetFilters,
    studentRows,
    staffRows,
    studentStats,
    staffStats,
    students,
    teachers,
    loading,
    error,
    generating,
    refresh,
    generateReport,
  };
};