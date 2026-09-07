/**
 * Student Timetable types.
 *
 * These mirror the columns exposed by the Supabase views defined in
 * /supabase/Student/student-timetable.sql (student_timetable,
 * student_timetable_summary, student_timetable_by_day).
 */

export type TimetableDayOfWeek =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";

/**
 * A single row of the student_weekly_timetable view.
 *
 * The view is already scoped to the logged-in student
 * (students.auth_user_id = auth.uid()), so no client-side
 * filtering is required.
 */
export interface StudentTimetableEntry {
  timetable_id: string;
  day_of_week: TimetableDayOfWeek;
  day_order: number;
  period_number: number;
  start_time: string;
  end_time: string;
  room: string | null;
  academic_year: string | null;
  subject_id: string | null;
  subject_name: string | null;
  subject_code: string | null;
  subject_type: string | null;
  teacher_id: string | null;
  teacher_name: string | null;
  class_id: string | null;
  class_name: string | null;
  section_id: string | null;
  section_name: string | null;
  student_id: string;
  student_name: string;
}

/**
 * Single-row summary for the top of the timetable page.
 *
 * Gives the Student Portal a compact profile header:
 * class, section, academic year, weekly period total and
 * today's period total.
 */
export interface StudentTimetableSummary {
  student_id: string;
  student_name: string;
  photo_url: string | null;
  admission_number: string;
  roll_number: string | null;
  class_id: string | null;
  class_name: string | null;
  class_code: string | null;
  section_id: string | null;
  section_name: string | null;
  academic_year: string | null;
  total_weekly_periods: number;
  today_periods: number;
}

/**
 * Per-day period totals used to render the day header
 * cards above the weekly table.
 */
export interface StudentDaySummary {
  day_of_week: TimetableDayOfWeek;
  day_order: number;
  total_periods: number;
  first_period_start: string | null;
  last_period_end: string | null;
}

/**
 * Everything the student timetable page renders.
 */
export interface StudentTimetableData {
  summary: StudentTimetableSummary | null;
  weekly: StudentTimetableEntry[];
  byDay: StudentDaySummary[];
  loading: boolean;
  error: string | null;
}
