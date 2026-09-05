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


export interface AdminNavGroup {
  id: string;
  label: string;
  icon: LucideIcon;
}


export const adminNavGroups: AdminNavGroup[] = [
  {
    id: "school",
    label: "School Management",
    icon: School,
  },
  {
    id: "staff",
    label: "Staff Management",
    icon: Users,
  },
  {
    id: "students",
    label: "Student Management",
    icon: GraduationCap,
  },
  {
    id: "communication",
    label: "Communication",
    icon: Megaphone,
  },
  {
    id: "academic",
    label: "Academic",
    icon: CalendarDays,
  },
  {
    id: "attendance",
    label: "Attendance",
    icon: ClipboardCheck,
  },
  {
    id: "assignments",
    label: "Assignments",
    icon: FileText,
  },
  {
    id: "results",
    label: "Results",
    icon: Award,
  },
  {
    id: "resources",
    label: "Resources",
    icon: FolderOpen,
  },
  {
    id: "reports",
    label: "Reports",
    icon: BarChart3,
  },
];