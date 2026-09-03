import type {
  TeacherClass,
  TimetableEntry,
  AttendanceRecord,
  StudentAttendance,
  AssignmentItem,
  ResultRow,
  NoticeItem,
} from "../types/teacherTypes";


// ==============================
// MY CLASSES
// ==============================

export const teacherClasses: TeacherClass[] = [
  { id: "c1", name: "Class 8-A", subject: "Mathematics", students: 32, schedule: "Mon / Wed / Fri - Period 2", periodsPerWeek: 5 },
  { id: "c2", name: "Class 8-B", subject: "Mathematics", students: 30, schedule: "Mon / Wed / Fri - Period 4", periodsPerWeek: 5 },
  { id: "c3", name: "Class 9-A", subject: "Mathematics", students: 34, schedule: "Tue / Thu - Period 1", periodsPerWeek: 4 },
  { id: "c4", name: "Class 9-B", subject: "Mathematics", students: 29, schedule: "Tue / Thu - Period 3", periodsPerWeek: 4 },
  { id: "c5", name: "Class 10-A", subject: "Mathematics", students: 31, schedule: "Wed / Fri - Period 5", periodsPerWeek: 3 },
  { id: "c6", name: "Class 10-B", subject: "Mathematics", students: 28, schedule: "Mon / Tue / Fri - Period 6", periodsPerWeek: 4 },
];


// ==============================
// TIMETABLE
// ==============================

const TIMETABLE_DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
];

const TIMETABLE_PERIODS = [
  { period: "Period 1", time: "08:30 - 09:15" },
  { period: "Period 2", time: "09:20 - 10:05" },
  { period: "Period 3", time: "10:10 - 10:55" },
  { period: "Period 4", time: "11:00 - 11:45" },
  { period: "Period 5", time: "12:30 - 13:15" },
  { period: "Period 6", time: "13:20 - 14:05" },
];

const TIMETABLE_SUBJECTS = [
  "Mathematics",
  "Science",
  "English",
  "History",
  "Geography",
  "Physical Education",
];

export const timetable: TimetableEntry[] = TIMETABLE_DAYS.flatMap(
  (day, dayIndex) =>
    TIMETABLE_PERIODS.map((slot) => {
      const subjectIndex =
        (dayIndex + slot.period.length) % TIMETABLE_SUBJECTS.length;

      return {
        id: `${day}-${slot.period}`,
        day,
        period: slot.period,
        time: slot.time,
        subject: TIMETABLE_SUBJECTS[subjectIndex],
        className: "8-A",
      } as TimetableEntry;
    })
);


// ==============================
// ATTENDANCE
// ==============================

export const attendanceRecords: AttendanceRecord[] = [
  { id: "a1", className: "8-A", date: "2026-09-02", present: 30, absent: 2, status: "Completed" },
  { id: "a2", className: "8-B", date: "2026-09-02", present: 28, absent: 2, status: "Completed" },
  { id: "a3", className: "9-A", date: "2026-09-01", present: 33, absent: 1, status: "Completed" },
  { id: "a4", className: "9-B", date: "2026-09-01", present: 27, absent: 2, status: "Completed" },
  { id: "a5", className: "10-A", date: "2026-09-03", present: 0, absent: 0, status: "Pending" },
  { id: "a6", className: "10-B", date: "2026-09-03", present: 0, absent: 0, status: "Pending" },
];

const STUDENT_NAMES = [
  "Rahul",
  "Priya",
  "Aman",
  "Neha",
  "Karan",
  "Sneha",
  "Vikram",
  "Anita",
  "Rohit",
  "Divya",
  "Arjun",
  "Pooja",
];

const buildStudents = (
  className: string
): StudentAttendance[] =>
  STUDENT_NAMES.map((name, index) => ({
    id: `${className}-${index + 1}`,
    roll: String(index + 1).padStart(2, "0"),
    name,
    status: "Present",
  }));

export const classStudents: Record<
  string,
  StudentAttendance[]
> = {
  "Class 8-A": buildStudents("Class 8-A"),
  "Class 8-B": buildStudents("Class 8-B"),
  "Class 9-A": buildStudents("Class 9-A"),
  "Class 9-B": buildStudents("Class 9-B"),
  "Class 10-A": buildStudents("Class 10-A"),
  "Class 10-B": buildStudents("Class 10-B"),
};


// ==============================
// ASSIGNMENTS
// ==============================

export const assignmentItems: AssignmentItem[] = [
  { id: "as1", title: "Algebra - Quadratic Equations", className: "9-A", subject: "Mathematics", dueDate: "2026-09-08", status: "Open", submissions: 8 },
  { id: "as2", title: "Geometry Worksheet 3", className: "8-A", subject: "Mathematics", dueDate: "2026-09-10", status: "Open", submissions: 12 },
  { id: "as3", title: "Fractions & Decimals Quiz Prep", className: "8-B", subject: "Mathematics", dueDate: "2026-09-06", status: "Grading", submissions: 30 },
  { id: "as4", title: "Trigonometry Basics Homework", className: "10-A", subject: "Mathematics", dueDate: "2026-09-12", status: "Open", submissions: 5 },
  { id: "as5", title: "Statistics Project Outline", className: "9-B", subject: "Mathematics", dueDate: "2026-09-05", status: "Closed", submissions: 29 },
];


// ==============================
// RESULTS
// ==============================

export const resultRows: ResultRow[] = [
  { id: "r1", student: "Aarav Sharma", className: "8-A", subject: "Mathematics", marks: 92, totalMarks: 100, grade: "A+" },
  { id: "r2", student: "Ananya Iyer", className: "8-A", subject: "Mathematics", marks: 88, totalMarks: 100, grade: "A" },
  { id: "r3", student: "Rohan Verma", className: "8-A", subject: "Mathematics", marks: 74, totalMarks: 100, grade: "B" },
  { id: "r4", student: "Meera Nair", className: "8-A", subject: "Mathematics", marks: 65, totalMarks: 100, grade: "C+" },
  { id: "r5", student: "Kabir Mehta", className: "8-A", subject: "Mathematics", marks: 45, totalMarks: 100, grade: "D" },
  { id: "r6", student: "Ishita Rao", className: "8-A", subject: "Mathematics", marks: 96, totalMarks: 100, grade: "A+" },
];


// ==============================
// NOTICES
// ==============================

export const noticeItems: NoticeItem[] = [
  {
    id: "n1",
    title: "Parent-Teacher Meeting",
    date: "2026-09-06",
    category: "Event",
    body: "Annual parent-teacher meeting for grades 8-10. Please ensure all grade sheets and attendance records are up to date.",
  },
  {
    id: "n2",
    title: "Staff Meeting - Friday",
    date: "2026-09-04",
    category: "Staff",
    body: "Weekly staff meeting in the faculty lounge at 3 PM. Agenda: term plan and examination schedule.",
  },
  {
    id: "n3",
    title: "Mid-Term Exam Schedule",
    date: "2026-09-01",
    category: "Academic",
    body: "Mid-term examinations for grades 9 and 10 start on 22 September. Submit question papers by 12 September.",
  },
  {
    id: "n4",
    title: "Science Fair Registration",
    date: "2026-08-28",
    category: "General",
    body: "Register your students for the annual science fair before 15 September.",
  },
];