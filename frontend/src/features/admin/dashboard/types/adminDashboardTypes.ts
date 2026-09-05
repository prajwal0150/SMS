export interface AdminNotice {
  id: string;
  title: string;
  date: string;
  category: "Academic" | "Event" | "Staff" | "General";
}

export interface AdminEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
}

export interface DashboardStatistics {
  academic_year: string;
  active_students: number;
  total_students: number;
  active_teachers: number;
  total_teachers: number;
  active_classes: number;
  active_sections: number;
  active_subjects: number;
  published_notices: number;
  published_announcements: number;
  published_events: number;
}

export interface DashboardTodayAttendance {
  attendance_date: string;
  total_records: number;
  students_present_today: number;
  students_absent_today: number;
  students_late_today: number;
  students_on_leave_today: number;
  attendance_percentage: number;
}

export interface DashboardAttendanceStatus {
  status: "present" | "late" | "absent" | "leave";
  total_records: number;
  percentage: number;
}

export interface DashboardClassSummary {
  class_id: string;
  class_name: string;
  class_code: string | null;
  academic_year: string;
  total_students: number;
}

export interface DashboardRecentStudent {
  id: string;
  student_name: string;
  class_name: string | null;
  section_name: string | null;
  admission_date: string;
  created_at: string;
}

export interface AdminDashboardData {
  statistics: DashboardStatistics;
  todayAttendance: DashboardTodayAttendance;
  attendance: DashboardAttendanceStatus[];
  classes: DashboardClassSummary[];
  notices: AdminNotice[];
  events: AdminEvent[];
  recentStudents: DashboardRecentStudent[];
}