/** Small helpers shared across the Results feature. */

import type {
  ResultStatus,
  SortOption,
  WorkflowStatus,
} from "../types/resultTypes";

/** "2026 - 2027" style academic year for today's date (Indian session start). */
export const currentAcademicYear = (): string => {
  const now = new Date();
  const startYear = now.getMonth() >= 3 ? now.getFullYear() : now.getFullYear() - 1;
  return `${startYear} - ${startYear + 1}`;
};

export const workflowLabel: Record<WorkflowStatus, string> = {
  draft: "DRAFT",
  submitted: "SUBMITTED",
  reviewed: "APPROVED",
  published: "PUBLISHED",
  rejected: "REJECTED",
};

export const workflowBadgeClass: Record<WorkflowStatus, string> = {
  draft: "bg-slate-100 text-slate-600",
  submitted: "bg-amber-50 text-amber-600",
  reviewed: "bg-sky-50 text-sky-600",
  published: "bg-emerald-50 text-emerald-600",
  rejected: "bg-rose-50 text-rose-600",
};

export const resultStatusLabel: Record<ResultStatus, string> = {
  pass: "PASS",
  fail: "FAIL",
  absent: "ABSENT",
  incomplete: "INCOMPLETE",
};

export const resultStatusBadgeClass: Record<ResultStatus, string> = {
  pass: "bg-emerald-50 text-emerald-600",
  fail: "bg-rose-50 text-rose-600",
  absent: "bg-orange-50 text-orange-600",
  incomplete: "bg-slate-100 text-slate-500",
};

export const gradeBadgeClass = (grade: string | null): string => {
  switch (grade) {
    case "A+":
      return "bg-emerald-100 text-emerald-700";
    case "A":
      return "bg-emerald-50 text-emerald-600";
    case "B+":
      return "bg-sky-50 text-sky-600";
    case "B":
      return "bg-indigo-50 text-indigo-600";
    case "C":
      return "bg-amber-50 text-amber-600";
    case "D":
      return "bg-orange-50 text-orange-600";
    case "F":
      return "bg-rose-50 text-rose-600";
    default:
      return "bg-slate-100 text-slate-500";
  }
};

export const formatNumber = (value: number | null | undefined): string =>
  value === null || value === undefined ? "-" : String(value);

export const formatPercentage = (value: number | null | undefined): string =>
  value === null || value === undefined
    ? "-"
    : `${Number(value).toFixed(2)}%`;

/** Letter grade from a percentage (mirrors the grade_scales defaults). */
export const computeGrade = (marks: number, total: number): string => {
  if (total <= 0) return "F";
  const percent = (marks / total) * 100;
  if (percent >= 90) return "A+";
  if (percent >= 80) return "A";
  if (percent >= 70) return "B+";
  if (percent >= 60) return "B";
  if (percent >= 50) return "C";
  if (percent >= 40) return "D";
  return "F";
};

export const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "roll", label: "Roll Number" },
  { value: "name", label: "Student Name" },
  { value: "percentage", label: "Percentage" },
  { value: "recent", label: "Recently Updated" },
];