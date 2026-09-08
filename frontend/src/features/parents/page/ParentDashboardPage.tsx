import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpenCheck,
  CalendarClock,
  ClipboardCheck,
  GraduationCap,
  IndianRupee,
  Megaphone,
  RefreshCw,
} from "lucide-react";

import ChildAvatar from "../components/ChildAvatar";
import useParentData from "../hooks/useParentData";
import { formatDate, formatNpr } from "../utils/parentUtils";

const ParentDashboardPage = () => {
  const { loading, error, profile, children, summaries, notices } =
    useParentData();

  const summaryByStudent = new Map(
    summaries.map((item) => [item.student_id, item] as const)
  );

  const summaryFor = (studentId: string) =>
    summaryByStudent.get(studentId);

  const totalPendingAmount = summaries.reduce(
    (sum, item) => sum + Number(item.pending_fees_amount || 0),
    0
  );

  const openAssignments = summaries.reduce(
    (sum, item) => sum + Number(item.open_assignments || 0),
    0
  );

  const attendancePercentages = summaries
    .map((item) => Number(item.attendance_percent))
    .filter((value) => !Number.isNaN(value));

  const averageAttendance = attendancePercentages.length
    ? Math.round(
        attendancePercentages.reduce((sum, value) => sum + value, 0) /
          attendancePercentages.length
      )
    : null;

  if (loading) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-12 text-center text-sm text-slate-500">
        Loading your children's information...
      </div>
    );
  }

  if (error || (!profile && loading === false)) {
    return (
      <div className="rounded-xl border border-rose-200 bg-white p-8 text-center">
        <p className="text-base font-semibold text-slate-900">
          Parent dashboard is unavailable
        </p>
        <p className="mx-auto mt-2 max-w-xl text-sm text-slate-500">
          {error ??
            "No parent profile is linked to this account. Ask the school to link your profile."}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-5 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          <RefreshCw size={15} /> Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Welcome back, {profile?.first_name ?? "Parent"}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Here is what is happening with your children at school.
          </p>
        </div>
        <Link
          to="/parent/children"
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
        >
          View my children <ArrowRight size={15} />
        </Link>
      </header>
<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
              <GraduationCap size={19} />
            </span>
            <div>
              <p className="text-2xl font-bold text-slate-900">
                {children.length}
              </p>
              <p className="text-xs text-slate-500">
                {children.length === 1 ? "Child" : "Children"}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <ClipboardCheck size={19} />
            </span>
            <div>
              <p className="text-2xl font-bold text-slate-900">
                {averageAttendance === null
                  ? "—"
                  : `${averageAttendance}%`}
              </p>
              <p className="text-xs text-slate-500">Attendance (avg)</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
              <IndianRupee size={19} />
            </span>
            <div>
              <p className="text-2xl font-bold text-slate-900">
                {formatNpr(totalPendingAmount)}
              </p>
              <p className="text-xs text-slate-500">Pending fees</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-50 text-sky-600">
              <BookOpenCheck size={19} />
            </span>
            <div>
              <p className="text-2xl font-bold text-slate-900">
                {openAssignments}
              </p>
              <p className="text-xs text-slate-500">Open homework</p>
            </div>
          </div>
        </div>
      </div>
<div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">
              My children
            </h2>
            <Link
              to="/parent/children"
              className="text-xs font-semibold text-indigo-600"
            >
              View all
            </Link>
          </div>

          {children.length === 0 ? (
            <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50/60 px-6 py-12 text-center">
              <GraduationCap size={28} className="mx-auto text-slate-300" />
              <p className="mt-3 text-sm font-semibold text-slate-700">
                No children linked yet
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Contact the school office to link your child's record
                to your parent account.
              </p>
            </div>
          ) : (
            children.map((child) => {
              const summary = summaryFor(child.student_id);

              return (
                <Link
                  key={child.student_id}
                  to={`/parent/children/${child.student_id}`}
                  className="group flex items-center gap-4 rounded-lg border border-slate-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-sm"
                >
                  <ChildAvatar
                    name={child.student_name}
                    photoUrl={child.photo_url}
                    size="lg"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-slate-900">
                      {child.student_name}
                    </p>
                    <p className="mt-0.5 truncate text-xs text-slate-500">
                      {[child.class_name, child.section_name]
                        .filter(Boolean)
                        .join(" - ") || "Class not set"}
                      {child.admission_number
                        ? ` · ${child.admission_number}`
                        : ""}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-slate-500">
                      <span className="inline-flex items-center gap-1">
                        <ClipboardCheck size={12} />
                        {summary?.attendance_percent ?? "—"}% attendance
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <IndianRupee size={12} />
                        {formatNpr(summary?.pending_fees_amount ?? 0)}
                        pending
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <BookOpenCheck size={12} />
                        {summary?.open_assignments ?? 0} homework open
                      </span>
                    </div>
                  </div>
                  <ArrowRight
                    size={16}
                    className="text-slate-300 group-hover:text-indigo-500"
                  />
                </Link>
              );
            })
          )}
        </div>

        <div>
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">
              Recent notices
            </h2>
            <Megaphone size={15} className="text-slate-400" />
          </div>

          {notices.length === 0 ? (
            <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50/60 px-6 py-10 text-center text-sm text-slate-500">
              No published notices.
            </div>
          ) : (
            <ul className="mt-2 space-y-3">
              {notices.slice(0, 6).map((notice) => (
                <li
                  key={notice.notice_id}
                  className="rounded-lg border border-slate-200 bg-white p-3"
                >
                  <p className="text-sm font-semibold text-slate-800">
                    {notice.title}
                  </p>
                  <p className="mt-1 line-clamp-2 text-xs text-slate-500">
                    {notice.body}
                  </p>
                  <p className="mt-1.5 flex items-center gap-1 text-[11px] text-slate-400">
                    <CalendarClock size={12} />
                    {formatDate(notice.notice_date)} ·{" "}
                    {notice.category ?? "General"}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default ParentDashboardPage;