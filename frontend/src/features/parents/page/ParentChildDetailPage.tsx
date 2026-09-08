import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Award,
  BookOpen,
  CalendarDays,
  ClipboardCheck,
  FileText,
  IndianRupee,
  LayoutDashboard,
  Megaphone,
  UserX,
} from "lucide-react";

import ChildAvatar from "../components/ChildAvatar";
import StatusBadge from "../components/StatusBadge";
import ChildAttendanceTab from "../components/ChildAttendanceTab";
import ChildExamsTab from "../components/ChildExamsTab";
import ChildFeesTab from "../components/ChildFeesTab";
import ChildHomeworkTab from "../components/ChildHomeworkTab";
import ChildNoticesTab from "../components/ChildNoticesTab";
import ChildOverviewTab from "../components/ChildOverviewTab";
import ChildResultsTab from "../components/ChildResultsTab";
import ChildTimetableTab from "../components/ChildTimetableTab";
import useParentData from "../hooks/useParentData";
import { formatNpr } from "../utils/parentUtils";

type TabId =
  | "overview"
  | "attendance"
  | "results"
  | "fees"
  | "homework"
  | "timetable"
  | "exams"
  | "notices";

const TABS: { id: TabId; label: string; icon: typeof LayoutDashboard }[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "attendance", label: "Attendance", icon: ClipboardCheck },
  { id: "results", label: "Results", icon: Award },
  { id: "fees", label: "Fees & receipts", icon: IndianRupee },
  { id: "homework", label: "Homework", icon: BookOpen },
  { id: "timetable", label: "Timetable", icon: CalendarDays },
  { id: "exams", label: "Exam schedule", icon: FileText },
  { id: "notices", label: "Notices", icon: Megaphone },
];

const ParentChildDetailPage = () => {
  const { studentId } = useParams<{ studentId: string }>();
  const { loading, error, children, summaries } = useParentData();
  const [tab, setTab] = useState<TabId>("overview");

  const child = useMemo(
    () =>
      studentId
        ? children.find((row) => row.student_id === studentId) ??
          null
        : null,
    [children, studentId]
  );

  const summary = useMemo(
    () =>
      summaries.find((row) => row.student_id === studentId) ?? null,
    [summaries, studentId]
  );

  if (loading) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-12 text-center text-sm text-slate-500">
        Loading child details...
      </div>
    );
  }

  // A URL that points at a child you are NOT linked to resolves
  // to a not-found state - never to another student's data.
  if (error || !child) {
    return (
      <div className="rounded-xl border border-rose-200 bg-white p-10 text-center">
        <UserX size={28} className="mx-auto text-slate-300" />
        <p className="mt-3 text-base font-semibold text-slate-900">
          Child not found
        </p>
        <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
          This child is not linked to your account. Please use the
          link in your children list.
        </p>
        <Link
          to="/parent/children"
          className="mt-5 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          <ArrowLeft size={15} /> Back to my children
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link
        to="/parent/children"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700"
      >
        <ArrowLeft size={14} /> My children
      </Link>
<header className="flex flex-col gap-4 rounded-lg border border-slate-200 bg-white p-5 sm:flex-row sm:items-center">
        <ChildAvatar
          name={child.student_name}
          photoUrl={child.photo_url}
          size="lg"
        />
        <div className="min-w-0 flex-1">
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            {child.student_name}
          </h1>
          <p className="mt-0.5 text-sm text-slate-500">
            {[child.class_name, child.section_name]
              .filter(Boolean)
              .join(" - ") || "Class not set"}
            {child.admission_number
              ? ` · ${child.admission_number}`
              : ""}
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            <StatusBadge
              label={`${child.relation ?? "Child"} · ${
                child.academic_year ?? "—"
              }`}
              tone="blue"
            />
            {summary?.attendance_percent !== null &&
              summary?.attendance_percent !== undefined && (
                <StatusBadge
                  label={`${summary.attendance_percent}% attendance`}
                  tone="green"
                />
              )}
            {(Number(summary?.pending_fees_amount ?? 0) || 0) > 0 && (
              <StatusBadge
                label={`${formatNpr(
                  summary?.pending_fees_amount ?? 0
                )} pending`}
                tone="amber"
              />
            )}
          </div>
        </div>

        {children.length > 1 && (
          <div className="sm:w-64">
            <label className="sr-only" htmlFor="child-switcher">
              Switch child
            </label>
            <select
              id="child-switcher"
              value={child.student_id}
              onChange={(event) => {
                setTab("overview");
                window.location.href = `/parent/children/${event.target.value}`;
              }}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
            >
              {children.map((item) => (
                <option key={item.student_id} value={item.student_id}>
                  {item.student_name}
                </option>
              ))}
            </select>
          </div>
        )}
      </header>

      <div className="flex flex-wrap gap-1 rounded-lg border border-slate-200 bg-white p-1.5">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
              tab === id
                ? "bg-indigo-600 text-white"
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
            }`}
          >
            <Icon size={14} />
            <span className={tab === id ? "" : "hidden sm:inline"}>
              {label}
            </span>
          </button>
        ))}
      </div>

      {tab === "overview" && (
        <ChildOverviewTab
          child={child}
          attendancePercent={summary?.attendance_percent ?? null}
        />
      )}
      {tab === "attendance" && (
        <ChildAttendanceTab studentId={child.student_id} />
      )}
      {tab === "results" && (
        <ChildResultsTab studentId={child.student_id} />
      )}
      {tab === "fees" && <ChildFeesTab studentId={child.student_id} />}
      {tab === "homework" && (
        <ChildHomeworkTab studentId={child.student_id} />
      )}
      {tab === "timetable" && (
        <ChildTimetableTab studentId={child.student_id} />
      )}
      {tab === "exams" && <ChildExamsTab studentId={child.student_id} />}
      {tab === "notices" && (
        <ChildNoticesTab studentId={child.student_id} />
      )}
    </div>
  );
};

export default ParentChildDetailPage;