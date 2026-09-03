export type TeacherStatus = "active" | "inactive";

export interface Teacher {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  subject: string;
  qualification: string | null;
  join_date: string | null;
  status: TeacherStatus;
  created_at: string;
}

export interface NewTeacherInput {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  subject: string;
  qualification?: string;
  join_date?: string;
  status?: TeacherStatus;
}


export interface TeacherAssignment {
  id: string;
  teacher_id: string;
  class_name: string;
  section: string | null;
  subject: string;
  created_at: string;
}

export interface NewAssignmentInput {
  teacher_id: string;
  class_name: string;
  section?: string;
  subject: string;
}


export type AttendanceStatus =
  | "present"
  | "absent"
  | "late"
  | "leave";

export interface StaffAttendance {
  id: string;
  teacher_id: string;
  date: string;
  status: AttendanceStatus;
  created_at: string;
}

export interface NewAttendanceInput {
  teacher_id: string;
  date: string;
  status: AttendanceStatus;
}


export type StaffManagementView =
  | "teachers"
  | "add-teacher"
  | "assignments"
  | "attendance";
