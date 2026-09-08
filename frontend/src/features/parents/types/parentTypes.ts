/**
 * Parent Portal types.
 *
 * All data is read from `security_invoker` MySQL views that are
 * scoped to the logged-in parent via `parents.auth_user_id =
 * auth.uid()`. The child-specific views (`parent_student_*`) are
 * additionally filtered client-side by `student_id`, which is
 * safe because the parent can never read a view row for a child
 * they are not linked to.
 */

// ============================================================
// STATUS ENUMERATIONS
// ============================================================

export type ParentAttendanceStatus =
  | "present"
  | "absent"
  | "late"
  | "leave";

export type ParentFeeStatus =
  | "pending"
  | "partial"
  | "paid"
  | "waived";

export type ParentInvoiceStatus =
  | "draft"
  | "unpaid"
  | "partial"
  | "paid"
  | "overdue"
  | "cancelled";

export type ParentAssignmentStatus =
  | "Open"
  | "Grading"
  | "Closed";

// ============================================================
// PROFILE
// ============================================================

export interface ParentProfile {
  parent_id: string;
  auth_user_id: string | null;
  first_name: string;
  middle_name: string | null;
  last_name: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  occupation: string | null;
  address: string | null;
  status: "active" | "inactive";
  created_at: string;
  updated_at: string;
}

// ============================================================
// CHILDREN
// ============================================================

export interface ParentChild {
  student_id: string;
  student_auth_user_id: string | null;
  admission_number: string;
  roll_number: string | null;
  student_name: string;
  photo_url: string | null;
  gender: string | null;
  date_of_birth: string | null;
  blood_group: string | null;
  category: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  postal_code: string | null;
  class_name: string | null;
  section_name: string | null;
  class_code: string | null;
  academic_year: string | null;
  relation: string;
  is_primary: boolean;
  status: string;
  father_name: string | null;
  mother_name: string | null;
  guardian_name: string | null;
  guardian_phone: string | null;
  student_email: string | null;
  student_phone: string | null;
}

export interface ParentChildSummary {
  student_id: string;
  student_name: string;
  class_name: string | null;
  section_name: string | null;
  total_days: number;
  present_days: number;
  absent_days: number;
  late_days: number;
  leave_days: number;
  attended_days: number;
  attendance_percent: number | null;
  pending_fees_count: number;
  pending_fees_amount: number;
  published_results: number;
  open_assignments: number;
}
// ============================================================
// ATTENDANCE
// ============================================================

export interface ParentAttendanceRow {
  id: string;
  student_id: string;
  student_name: string;
  attendance_date: string;
  status: ParentAttendanceStatus;
  remarks: string | null;
  subject_name: string | null;
  class_name: string | null;
  section_name: string | null;
}

// ============================================================
// RESULTS & MARKS
// ============================================================

export interface ParentResultRow {
  id: string;
  student_id: string;
  student_name: string;
  exam_id: string;
  exam_name: string;
  exam_type: string;
  start_date: string;
  end_date: string | null;
  class_name: string | null;
  section_name: string | null;
  academic_year: string;
  total_marks: number;
  obtained_marks: number;
  percentage: number;
  grade: string | null;
  result_status: string;
  workflow_status: string;
  published_at: string | null;
}

export interface ParentMarkRow {
  id: string;
  student_id: string;
  student_name: string;
  exam_id: string;
  exam_name: string;
  exam_type: string;
  subject_id: string | null;
  subject_name: string | null;
  subject_code: string | null;
  marks_obtained: number;
  total_marks: number;
  grade: string | null;
  teacher_first_name: string | null;
  teacher_last_name: string | null;
}

// ============================================================
// FEES & INVOICES
// ============================================================

export interface ParentFeeRow {
  fee_id: string;
  student_id: string;
  student_name: string;
  category_name: string;
  category_code: string | null;
  class_name: string;
  section: string | null;
  academic_year: string;
  amount: number;
  discount_amount: number;
  fine_amount: number;
  payable_amount: number;
  due_date: string;
  status: ParentFeeStatus;
  notes: string | null;
  total_paid: number;
  balance: number;
}

export interface ParentInvoiceRow {
  invoice_id: string;
  student_id: string;
  student_name: string;
  invoice_number: string;
  issue_date: string;
  due_date: string;
  total_amount: number;
  discount_amount: number;
  fine_amount: number;
  payable_amount: number;
  paid_amount: number;
  status: ParentInvoiceStatus;
  notes: string | null;
  payment_count: number;
  last_payment_method: string | null;
}
// ============================================================
// ASSIGNMENTS (HOMEWORK)
// ============================================================

export interface ParentAssignmentRow {
  assignment_id: string;
  student_id: string;
  student_name: string;
  title: string;
  description: string | null;
  class_name: string;
  section: string | null;
  subject: string;
  due_date: string;
  status: ParentAssignmentStatus;
  created_at: string;
  teacher_name: string | null;
}

// ============================================================
// TIMETABLE
// ============================================================

export interface ParentTimetableRow {
  timetable_id: string;
  student_id: string;
  student_name: string;
  class_name: string;
  section: string | null;
  day_of_week: string;
  period_number: number;
  start_time: string;
  end_time: string;
  subject: string;
  room: string | null;
  academic_year: string | null;
  teacher_name: string | null;
}

// ============================================================
// EXAMS
// ============================================================

export interface ParentExamRow {
  schedule_id: string;
  student_id: string;
  student_name: string;
  exam_id: string;
  exam_name: string;
  exam_type: string;
  class_name: string;
  section: string | null;
  start_date: string;
  end_date: string | null;
  status: string;
  instructions: string | null;
  subject: string;
  exam_date: string;
  start_time: string | null;
  end_time: string | null;
  room: string | null;
  max_marks: number | null;
  passing_marks: number | null;
}

// ============================================================
// NOTICES
// ============================================================

export interface ParentNoticeRow {
  notice_id: string;
  title: string;
  body: string;
  category: string;
  priority: string;
  notice_date: string;
  attachment_url: string | null;
  attachment_name: string | null;
  created_at: string;
}

// ============================================================
// DASHBOARD BAG
// ============================================================

export interface ParentDashboardData {
  profile: ParentProfile | null;
  children: ParentChild[];
  summaries: ParentChildSummary[];
  notices: ParentNoticeRow[];
}