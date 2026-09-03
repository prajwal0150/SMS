export interface TeacherClass {
  id: string;
  name: string;
  subject: string;
  students: number;
  schedule: string;
  periodsPerWeek: number;
}

export interface TimetableEntry {
  id: string;
  day: string;
  period: string;
  time: string;
  subject: string;
  className: string;
}

export interface AttendanceRecord {
  id: string;
  className: string;
  date: string;
  present: number;
  absent: number;
  status: "Completed" | "Pending";
}

export type AttendanceStatus = "Present" | "Absent";

export interface StudentAttendance {
  id: string;
  roll: string;
  name: string;
  status: AttendanceStatus;
}

export interface AssignmentItem {
  id: string;
  title: string;
  className: string;
  subject: string;
  dueDate: string;
  status: "Open" | "Grading" | "Closed";
  submissions: number;
}

export interface ResultRow {
  id: string;
  student: string;
  className: string;
  subject: string;
  marks: number;
  totalMarks: number;
  grade: string;
}

export interface NoticeItem {
  id: string;
  title: string;
  date: string;
  category: "Academic" | "Event" | "Staff" | "General";
  body: string;
}
