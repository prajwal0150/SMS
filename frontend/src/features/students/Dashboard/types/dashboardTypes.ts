// Student record shown on the student dashboard.
export interface CurrentStudent {
  id: string;
  first_name: string;
  middle_name: string | null;
  last_name: string;
  email: string | null;
  phone: string | null;
  roll_number: string | null;
  admission_number: string;
  class_name: string;
  section: string | null;
  admission_year: number;
  admission_date: string | null;
  gender: string | null;
  status: string;
  photo_url: string | null;
}

// Row of the student_dashboard_profile view.
export interface StudentProfile {
  student_id: string;
  student_name: string;
  photo_url: string | null;
  email: string | null;
  phone: string | null;
  admission_number: string;
  roll_number: string | null;
  class_name: string | null;
  section_name: string | null;
  class_teacher_name: string | null;
  academic_year: string | null;
  admission_year: number | null;
  status: string;
}

// Row of the student_dashboard_today_attendance view.
export interface TodayAttendance {
  student_id: string;
  attendance_date: string;
  total_periods: number;
  present_count: number;
  late_count: number;
  absent_count: number;
  leave_count: number;
  attendance_percentage: number | null;
}

// Row of the student_dashboard_monthly_attendance view.
export interface MonthlyAttendance {
  student_id: string;
  month_start: string;
  total_records: number;
  present_count: number;
  absent_count: number;
  late_count: number;
  leave_count: number;
  attendance_percentage: number | null;
}

// Row of the student_dashboard_subject_count view.
export interface SubjectCount {
  student_id: string;
  total_subjects: number;
  compulsory_subjects: number;
  optional_subjects: number;
}

// Row of the student_dashboard_attendance_trend view.
export interface AttendanceTrendPoint {
  attendance_date: string;
  total_records: number;
  present_count: number;
  absent_count: number;
  late_count: number;
  leave_count: number;
  attendance_percentage: number | null;
}

// Row of the student_dashboard_today_timetable view.
export interface TodayTimetableRow {
  timetable_id: string;
  period_number: number;
  start_time: string;
  end_time: string;
  subject_name: string | null;
  subject_code: string | null;
  teacher_name: string | null;
  room: string | null;
  period_status: "upcoming" | "ongoing" | "completed";
}

// Row of the student_dashboard_upcoming_events view.
export interface UpcomingEvent {
  id: string;
  title: string;
  date: string;
  time: string | null;
  location: string | null;
  organizer: string | null;
}

// Row of the student_dashboard_notices view.
export interface LatestNotice {
  id: string;
  title: string;
  category: string | null;
  date: string;
  priority: string | null;
}

// Recent mark entered by a teacher (exam_results table).
export interface RecentResult {
  id: string;
  marks_obtained: number;
  total_marks: number;
  grade: string | null;
  created_at: string;
  exams: { name: string } | null;
  subjects: { subject_name: string } | null;
}

// Assignment shared with the class (class_assignments table).
export interface RecentAssignment {
  id: string;
  title: string;
  subject: string;
  due_date: string;
  status: string;
}

// Everything the student dashboard page renders.
export interface StudentDashboardData {
  profile: StudentProfile;
  todayAttendance: TodayAttendance;
  monthlyAttendance: MonthlyAttendance;
  subjectCount: SubjectCount;
  attendanceTrend: AttendanceTrendPoint[];
  todayTimetable: TodayTimetableRow[];
  upcomingEvents: UpcomingEvent[];
  notices: LatestNotice[];
  recentResults: RecentResult[];
  recentAssignments: RecentAssignment[];
}
