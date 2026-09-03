import type { LucideIcon } from "lucide-react";
import {
  Award,
  BarChart3,
  CalendarDays,
  ClipboardCheck,
  FileText,
  FolderOpen,
  GraduationCap,
  Megaphone,
  School,
  Users,
} from "lucide-react";


export interface AdminNavChild {
  label: string;
  path: string;
}

export interface AdminNavGroup {
  id: string;
  label: string;
  icon: LucideIcon;
  children: AdminNavChild[];
}


export const adminNavGroups: AdminNavGroup[] = [
  {
    id: "school",
    label: "School Management",
    icon: School,
    children: [
      { label: "School Profile", path: "/admin/school/profile" },
      { label: "Academic Year", path: "/admin/school/academic-year" },
      { label: "Classes", path: "/admin/school/classes" },
      { label: "Sections", path: "/admin/school/sections" },
      { label: "Subjects", path: "/admin/school/subjects" },
    ],
  },
  {
    id: "staff",
    label: "Staff Management",
    icon: Users,
    children: [],
  },
  {
    id: "students",
    label: "Student Management",
    icon: GraduationCap,
    children: [],
  },
  {
    id: "communication",
    label: "Communication",
    icon: Megaphone,
    children: [],
  },
  {
    id: "academic",
    label: "Academic",
    icon: CalendarDays,
    children: [
      { label: "Academic Calendar", path: "/admin/academic/calendar" },
      { label: "Timetable", path: "/admin/academic/timetable" },
      { label: "Exams", path: "/admin/academic/exams" },
      { label: "Holidays", path: "/admin/academic/holidays" },
    ],
  },
  {
    id: "attendance",
    label: "Attendance",
    icon: ClipboardCheck,
    children: [
      { label: "Student Attendance", path: "/admin/attendance/students" },
      { label: "Teacher Attendance", path: "/admin/attendance/teachers" },
      { label: "Attendance Reports", path: "/admin/attendance/reports" },
    ],
  },
  {
    id: "assignments",
    label: "Assignments",
    icon: FileText,
    children: [
      { label: "All Assignments", path: "/admin/assignments/all" },
      { label: "Assignment Reports", path: "/admin/assignments/reports" },
    ],
  },
  {
    id: "results",
    label: "Results",
    icon: Award,
    children: [
      { label: "Exam Results", path: "/admin/results/exams" },
      { label: "Mark Sheets", path: "/admin/results/mark-sheets" },
      { label: "Result Reports", path: "/admin/results/reports" },
    ],
  },
  {
    id: "resources",
    label: "Resources",
    icon: FolderOpen,
    children: [
      { label: "Study Materials", path: "/admin/resources/study-materials" },
      { label: "Documents", path: "/admin/resources/documents" },
      { label: "Downloads", path: "/admin/resources/downloads" },
    ],
  },
  {
    id: "reports",
    label: "Reports",
    icon: BarChart3,
    children: [
      { label: "Student Reports", path: "/admin/reports/students" },
      { label: "Teacher Reports", path: "/admin/reports/teachers" },
      { label: "Attendance Reports", path: "/admin/reports/attendance" },
      { label: "Academic Reports", path: "/admin/reports/academic" },
    ],
  },
];