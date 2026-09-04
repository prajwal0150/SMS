export type AttendanceStatus = "Present" | "Absent";

export interface StudentAttendance {
  id: string;
  roll: string;
  name: string;
  status: AttendanceStatus;
}

// A homework / classwork assignment created by the
// teacher (from the `class_assignments` table).
export type ClassAssignmentStatus = "Open" | "Grading" | "Closed";

export interface ClassAssignmentItem {
  id: string;
  teacher_id: string;
  title: string;
  description: string | null;
  class_name: string;
  section: string | null;
  subject: string;
  due_date: string;
  status: ClassAssignmentStatus;
  created_at: string;
}

export interface NewClassAssignmentInput {
  teacher_id: string;
  title: string;
  description?: string | null;
  class_name: string;
  section?: string | null;
  subject: string;
  due_date: string;
  status?: ClassAssignmentStatus;
}

// One saved marks row for an exam
// (from the `exam_results` table).
export interface ExamResultRecord {
  id: string;
  student_id: string;
  marks_obtained: number;
  total_marks: number;
  grade: string | null;
}

// A minimal exam shape used by the teacher
// results filters (from the `exams` table).
export interface TeacherExamOption {
  id: string;
  name: string;
  exam_type: string;
  class_name: string;
  section: string | null;
  start_date: string;
  end_date: string | null;
  status: string;
}

// Unified feed shown on the teacher Notices page —
// combines everything the admin publishes on the
// Communication page (notices, announcements
// targeted at teachers, and events).
export type TeacherFeedItem = {
  kind: "Notice" | "Announcement" | "Event";
  id: string;
  title: string;
  body: string;
  date: string;
  // Category (notices) or audience (announcements).
  tag?: string;
  priority?: string;
  // Event-only details.
  time?: string | null;
  location?: string | null;
  organizer?: string | null;
};

// The logged-in teacher's own record from the
// `teachers` table (matched by email).
export interface TeacherProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
  status: string;
}

// A class section assigned to the teacher
// from the `teacher_assignments` table.
export interface TeacherClassAssignment {
  id: string;
  className: string;
  section: string | null;
  subject: string;
}

// One period of the logged-in teacher's weekly
// timetable (from the `timetable` table, matched
// by teacher_id).
export interface TeacherTimetableEntry {
  id: string;
  day: string;
  period: number;
  startTime: string;
  endTime: string;
  subject: string;
  className: string;
  section: string | null;
  room: string | null;
}
