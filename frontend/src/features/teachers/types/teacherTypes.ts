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
