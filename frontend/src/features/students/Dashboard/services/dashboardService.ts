import { supabase } from "../../../../lib/supabase";

import type {
  AttendanceTrendPoint,
  CurrentStudent,
  LatestNotice,
  MonthlyAttendance,
  RecentAssignment,
  RecentResult,
  StudentDashboardData,
  StudentProfile,
  SubjectCount,
  TodayAttendance,
  TodayTimetableRow,
  UpcomingEvent,
} from "../types/dashboardTypes";

const STUDENT_COLUMNS =
  "id, first_name, middle_name, last_name, email, phone, roll_number, admission_number, class_name, section, admission_year, admission_date, gender, status, photo_url";

/**
 * The student record that belongs to the currently
 * logged in student account.
 *
 * Matched by the auth user id written when the admin
 * admitted the student, with the email as a fallback
 * for older records.
 */
export const fetchCurrentStudent =
  async (): Promise<CurrentStudent | null> => {
    const { data: userData, error: userError } =
      await supabase.auth.getUser();

    if (userError) {
      throw new Error(userError.message);
    }

    const user = userData.user;

    if (!user) {
      return null;
    }

    // 1. Preferred lookup - the linked auth account.
    const { data: byId, error: byIdError } =
      await supabase
        .from("students")
        .select(STUDENT_COLUMNS)
        .eq("auth_user_id", user.id)
        .maybeSingle();

    if (byIdError) {
      throw new Error(byIdError.message);
    }

    if (byId) {
      return byId as CurrentStudent;
    }

    // 2. Fallback - records linked by email only.
    if (!user.email) {
      return null;
    }

    const { data: byEmail, error: byEmailError } =
      await supabase
        .from("students")
        .select(STUDENT_COLUMNS)
        .ilike("email", user.email)
        .maybeSingle();

    if (byEmailError) {
      throw new Error(byEmailError.message);
    }

    return (byEmail as CurrentStudent) ?? null;
  };

const readSingle = async <T>(view: string): Promise<T> => {
  const { data, error } = await supabase.from(view).select("*").single();

  if (error) {
    throw new Error(`${view}: ${error.message}`);
  }

  return data as T;
};

const readMany = async <T>(view: string): Promise<T[]> => {
  const { data, error } = await supabase.from(view).select("*");

  if (error) {
    throw new Error(`${view}: ${error.message}`);
  }

  return (data ?? []) as T[];
};

/**
 * Recent marks entered by teachers. The student dashboard
 * SQL does not ship a results view yet, so this reads the
 * exam_results table directly and fails soft to an empty
 * list when it is unavailable.
 */
type RawResultRow = {
  id: string;
  marks_obtained: number | string | null;
  total_marks: number | string | null;
  grade: string | null;
  created_at: string;
  exams: { name: string } | { name: string }[] | null;
  subjects:
    | { subject_name: string }
    | { subject_name: string }[]
    | null;
};

// PostgREST may deliver an embedded row as an object or a
// single-element array depending on relationship detection.
const pickOne = <T,>(value: T | T[] | null): T | null =>
  Array.isArray(value) ? (value[0] ?? null) : (value ?? null);

const fetchRecentResults = async (
  studentId: string
): Promise<RecentResult[]> => {
  try {
    const { data, error } = await supabase
      .from("exam_results")
      .select(
        "id, marks_obtained, total_marks, grade, created_at, exams:exam_id(name), subjects:subject_id(subject_name)"
      )
      .eq("student_id", studentId)
      .order("created_at", { ascending: false })
      .limit(6);

    if (error) {
      return [];
    }

    return ((data ?? []) as unknown as RawResultRow[]).map((row) => ({
      id: row.id,
      marks_obtained: Number(row.marks_obtained ?? 0),
      total_marks: Number(row.total_marks ?? 0),
      grade: row.grade,
      created_at: row.created_at,
      exams: pickOne(row.exams),
      subjects: pickOne(row.subjects),
    }));
  } catch {
    // Results are optional for the dashboard.
    return [];
  }
};

/**
 * Assignments shared with the student's class. Matched on
 * class name with the section as a soft filter, because
 * teachers may leave the section blank.
 */
const fetchRecentAssignments = async (
  className: string | null,
  sectionName: string | null
): Promise<RecentAssignment[]> => {
  try {
    const { data, error } = await supabase
      .from("class_assignments")
      .select("id, title, subject, class_name, section, due_date, status")
      .order("due_date", { ascending: false })
      .limit(30);

    if (error) {
      return [];
    }

    return ((data ?? []) as (RecentAssignment & {
      class_name: string | null;
      section: string | null;
    })[])
      .filter(
        (row) =>
          (!className || row.class_name === className) &&
          (!sectionName || !row.section || row.section === sectionName)
      )
      .slice(0, 5)
      .map((row) => ({
        id: row.id,
        title: row.title,
        subject: row.subject,
        due_date: row.due_date,
        status: row.status,
      }));
  } catch {
    // Assignments are optional for the dashboard.
    return [];
  }
};

/**
 * Everything the student dashboard page renders, fetched
 * in parallel from the student_dashboard_* views.
 */
export const fetchStudentDashboard =
  async (): Promise<StudentDashboardData> => {
    const [
      profileRow,
      studentRow,
      todayAttendance,
      monthlyAttendance,
      subjectCount,
      attendanceTrend,
      todayTimetable,
      upcomingEvents,
      notices,
    ] = await Promise.all([
      readSingle<StudentProfile>("student_dashboard_profile").catch(
        () => null
      ),
      fetchCurrentStudent().catch(() => null),
      readSingle<TodayAttendance>("student_dashboard_today_attendance"),
      readSingle<MonthlyAttendance>("student_dashboard_monthly_attendance"),
      readSingle<SubjectCount>("student_dashboard_subject_count"),
      readMany<AttendanceTrendPoint>("student_dashboard_attendance_trend"),
      readMany<TodayTimetableRow>("student_dashboard_today_timetable"),
      readMany<UpcomingEvent>("student_dashboard_upcoming_events"),
      readMany<LatestNotice>("student_dashboard_notices"),
    ]);

    let profile: StudentProfile;

    if (profileRow) {
      // The view derives class / section from class_id and
      // section_id. Students admitted before those columns
      // were filled only carry the text columns, so fall
      // back to them when the join came up empty.
      profile = {
        ...profileRow,
        class_name:
          profileRow.class_name ?? studentRow?.class_name ?? null,
        section_name:
          profileRow.section_name ?? studentRow?.section ?? null,
      };
    } else if (studentRow) {
      // The dashboard view is unavailable or has no row for
      // this account - build the profile from the raw
      // students table instead.
      profile = {
        student_id: studentRow.id,
        student_name: [
          studentRow.first_name,
          studentRow.middle_name,
          studentRow.last_name,
        ]
          .filter(Boolean)
          .join(" "),
        photo_url: studentRow.photo_url,
        email: studentRow.email,
        phone: studentRow.phone,
        admission_number: studentRow.admission_number,
        roll_number: studentRow.roll_number,
        class_name: studentRow.class_name,
        section_name: studentRow.section,
        class_teacher_name: null,
        academic_year: null,
        admission_year: studentRow.admission_year,
        status: studentRow.status,
      };
    } else {
      throw new Error(
        "No student profile is linked to this account yet."
      );
    }

    const [recentResults, recentAssignments] = await Promise.all([
      fetchRecentResults(profile.student_id),
      fetchRecentAssignments(profile.class_name, profile.section_name),
    ]);

    return {
      profile,
      todayAttendance,
      monthlyAttendance,
      subjectCount,
      attendanceTrend,
      todayTimetable,
      upcomingEvents,
      notices,
      recentResults,
      recentAssignments,
    };
  };
