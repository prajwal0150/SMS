import { Link } from "react-router-dom";
import {
  ArrowRight,
  Bell,
  BookOpen,
  CalendarDays,
  ChevronRight,
  GraduationCap,
  Info,
  Megaphone,
  RefreshCw,
  Trophy,
  User,
  Users,
} from "lucide-react";

import DashboardCard from "../components/DashboardCard";
import DonutChart from "../components/DonutChart";
import StatTile from "../components/StatTile";
import TrendChart from "../components/TrendChart";

import { useStudentDashboard } from "../hooks/useStudentDashboard";


const getGreeting = (): string => {
  const hour = new Date().getHours();

  if (hour < 12) {
    return "Good Morning";
  }

  if (hour < 17) {
    return "Good Afternoon";
  }

  return "Good Evening";
};


const parseDate = (value: string): Date =>
  new Date(`${value}T00:00:00`);


const formatDate = (value: string | null): string => {
  if (!value) {
    return "-";
  }

  const date = value.includes("T") ? new Date(value) : parseDate(value);

  return date.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};


const formatDayMonth = (value: string): string =>
  parseDate(value).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
  });


const formatFullDate = (value: string): string =>
  parseDate(value).toLocaleDateString(undefined, {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });


const formatClock = (value: string | null): string => {
  if (!value) {
    return "-";
  }

  const trimmed = value.trim();

  return /^\d{1,2}:\d{2}(:\d{2})?$/.test(trimmed)
    ? trimmed.slice(0, 5)
    : trimmed;
};


const ATTENDANCE_COLORS: Record<string, string> = {
  present: "#10b981",
  late: "#ec4899",
  absent: "#ef4444",
  leave: "#8b5cf6",
};


const PERIOD_COLORS = [
  "bg-blue-500",
  "bg-emerald-500",
  "bg-violet-500",
  "bg-amber-500",
  "bg-rose-500",
  "bg-teal-500",
];


const CHIP_COLORS = [
  "bg-blue-500",
  "bg-emerald-500",
  "bg-violet-500",
  "bg-rose-500",
];


const EVENT_ICONS = [Trophy, Users, BookOpen, CalendarDays];


const PRIORITY_STYLES: Record<string, string> = {
  high: "bg-rose-50 text-rose-600",
  normal: "bg-emerald-50 text-emerald-600",
  low: "bg-slate-100 text-slate-500",
};


const ASSIGNMENT_STATUS: Record<
  string,
  { label: string; className: string }
> = {
  open: { label: "Pending", className: "bg-amber-50 text-amber-600" },
  grading: { label: "Grading", className: "bg-blue-50 text-blue-600" },
  closed: { label: "Completed", className: "bg-emerald-50 text-emerald-600" },
};


const EmptyState = ({ label }: { label: string }) => (
  <p className="py-8 text-center text-sm text-slate-400">{label}</p>
);


const ViewAllLink = ({ to }: { to: string }) => (
  <Link
    to={to}
    className="flex shrink-0 items-center gap-1 text-xs font-semibold text-indigo-600 transition-colors hover:text-indigo-700"
  >
    View All
    <ArrowRight size={13} />
  </Link>
);


const noticeVisual = (
  priority: string | null
): { Icon: typeof Bell; chip: string } => {
  switch ((priority ?? "").toLowerCase()) {
    case "high":
      return { Icon: Bell, chip: "bg-rose-50 text-rose-500" };

    case "low":
      return { Icon: Info, chip: "bg-amber-50 text-amber-500" };

    default:
      return { Icon: Megaphone, chip: "bg-blue-50 text-blue-500" };
  }
};


const BookStack = () => (
  <svg
    viewBox="0 0 64 64"
    className="h-16 w-16 shrink-0"
    aria-hidden="true"
  >
    <rect x="8" y="44" width="48" height="10" rx="3" fill="#f97316" />
    <rect x="12" y="33" width="44" height="10" rx="3" fill="#0ea5e9" />
    <rect x="10" y="22" width="42" height="10" rx="3" fill="#10b981" />
    <rect x="20" y="10" width="24" height="11" rx="3" fill="#8b5cf6" />
    <line x1="16" y1="49" x2="48" y2="49" stroke="#ffffff" strokeWidth="1.5" opacity="0.6" />
    <line x1="20" y1="38" x2="50" y2="38" stroke="#ffffff" strokeWidth="1.5" opacity="0.6" />
    <line x1="18" y1="27" x2="44" y2="27" stroke="#ffffff" strokeWidth="1.5" opacity="0.6" />
  </svg>
);


const StudentDashboardPage = () => {
  const { data, loading, error, reload } = useStudentDashboard();


  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <span className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-600" />
      </div>
    );
  }


  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
        <p className="text-sm font-semibold text-red-700">{error}</p>
        <p className="mt-1 text-sm text-red-600">
          Make sure the student dashboard SQL
          (supabase/Student/student-dashboard.sql) has been run.
        </p>
        <button
          type="button"
          onClick={reload}
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
        >
          <RefreshCw size={15} />
          Try again
        </button>
      </div>
    );
  }


  if (!data) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 text-center">
        <p className="text-sm font-semibold text-amber-700">
          No student profile is linked to this account yet.
        </p>
        <p className="mt-1 text-sm text-amber-600">
          Please contact the school office so they can link
          your admission record.
        </p>
      </div>
    );
  }


  const {
    profile,
    todayAttendance,
    monthlyAttendance,
    subjectCount,
    attendanceTrend,
    todayTimetable,
    upcomingEvents,
    notices,
    recentResults,
    recentAssignments,
  } = data;

  const classLabel = profile.class_name ?? "-";
  const classValue = profile.section_name
    ? `${classLabel} - ${profile.section_name}`
    : classLabel;

  const donutSegments = [
    {
      label: "Present",
      value: Number(todayAttendance.present_count),
      color: ATTENDANCE_COLORS.present,
    },
    {
      label: "Late",
      value: Number(todayAttendance.late_count),
      color: ATTENDANCE_COLORS.late,
    },
    {
      label: "Absent",
      value: Number(todayAttendance.absent_count),
      color: ATTENDANCE_COLORS.absent,
    },
    {
      label: "Leave",
      value: Number(todayAttendance.leave_count),
      color: ATTENDANCE_COLORS.leave,
    },
  ];

  const trendPoints = attendanceTrend.slice(-7).map((point) => ({
    label: formatDayMonth(point.attendance_date),
    value:
      point.attendance_percentage === null
        ? 0
        : Number(point.attendance_percentage),
  }));


  return (
    <div className="space-y-6">
      {/* Greeting + stat tiles + profile card */}
      <div className="grid gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          <div>
            <p className="text-sm font-semibold text-teal-700">
              {getGreeting()},
            </p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 lg:text-[28px]">
              {profile.student_name}{" "}
              <span aria-hidden="true">👋</span>
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Keep learning, keep growing!
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatTile
              label="Class"
              value={classValue}
              sub={
                profile.section_name
                  ? `Section ${profile.section_name}`
                  : undefined
              }
              icon={GraduationCap}
              iconClassName="bg-blue-500 text-white"
            />
            <StatTile
              label="Roll Number"
              value={profile.roll_number ?? "-"}
              icon={User}
              iconClassName="bg-emerald-500 text-white"
            />
            <StatTile
              label="Attendance (This Month)"
              value={
                monthlyAttendance.attendance_percentage === null
                  ? "-"
                  : `${Number(monthlyAttendance.attendance_percentage)}%`
              }
              sub={`Present Days: ${Number(
                monthlyAttendance.present_count
              )}/${Number(monthlyAttendance.total_records)}`}
              icon={CalendarDays}
              iconClassName="bg-rose-500 text-white"
            />
            <StatTile
              label="Total Subjects"
              value={String(Number(subjectCount.total_subjects))}
              icon={BookOpen}
              iconClassName="bg-violet-500 text-white"
            />
          </div>
        </div>

        <section className="rounded-xl border border-slate-200 bg-white p-6">
          <div className="flex items-center gap-4">
            {profile.photo_url ? (
              <img
                src={profile.photo_url}
                alt={profile.student_name}
                className="h-16 w-16 shrink-0 rounded-full border-2 border-indigo-100 object-cover"
              />
            ) : (
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xl font-bold text-indigo-600">
                {profile.student_name.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="min-w-0">
              <h2 className="truncate text-lg font-bold text-slate-900">
                {profile.student_name}
              </h2>
              <p className="truncate text-sm text-slate-500">
                Class {classValue}
              </p>
              <span className="mt-1 inline-flex rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold capitalize text-emerald-600">
                {profile.status || "active"}
              </span>
            </div>
          </div>

          <div className="mt-5 space-y-2.5 border-t border-slate-100 pt-4">
            <p className="flex items-center justify-between text-sm">
              <span className="text-slate-400">Admission No.</span>
              <span className="font-semibold text-slate-700">
                {profile.admission_number}
              </span>
            </p>
            <p className="flex items-center justify-between text-sm">
              <span className="text-slate-400">Roll No.</span>
              <span className="font-semibold text-slate-700">
                {profile.roll_number ?? "-"}
              </span>
            </p>
          </div>
        </section>
      </div>

      {/* Attendance donut + weekly trend + today's timetable */}
      <div className="grid gap-6 xl:grid-cols-3">
        <DashboardCard
          title="Today's Attendance"
          subtitle={formatFullDate(todayAttendance.attendance_date)}
        >
          <div className="flex flex-col items-center gap-6 sm:flex-row">
            <DonutChart
              segments={donutSegments}
              centerTop="Present"
              centerMain={`${Number(
                todayAttendance.present_count
              )}/${Number(todayAttendance.total_periods)}`}
              centerBottom="Periods"
            />
            <ul className="w-full flex-1 space-y-3">
              {donutSegments.map((segment) => (
                <li
                  key={segment.label}
                  className="flex items-center gap-2.5 text-sm"
                >
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: segment.color }}
                  />
                  <span className="text-slate-500">{segment.label}</span>
                  <span className="ml-auto font-semibold text-slate-800">
                    {segment.value}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </DashboardCard>

        <DashboardCard
          title="Weekly Attendance Trend"
          subtitle="Last 7 recorded days"
        >
          {trendPoints.length ? (
            <TrendChart points={trendPoints} />
          ) : (
            <EmptyState label="No attendance recorded in the last 30 days." />
          )}
        </DashboardCard>

        <DashboardCard
          title="Today's Timetable"
          action={<ViewAllLink to="/student/timetable" />}
        >
          {todayTimetable.length ? (
            <div className="space-y-1.5">
              {todayTimetable.slice(0, 6).map((row, index) => (
                <div
                  key={row.timetable_id}
                  className={`flex items-center gap-3 rounded-lg px-2 py-2 transition-colors ${
                    row.period_status === "ongoing"
                      ? "bg-indigo-50"
                      : "hover:bg-slate-50"
                  }`}
                >
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${
                      PERIOD_COLORS[index % PERIOD_COLORS.length]
                    }`}
                  >
                    {row.period_number}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-slate-800">
                      {row.subject_name ?? "Period"}
                    </p>
                    <p className="text-xs text-slate-400">
                      {formatClock(row.start_time)} -{" "}
                      {formatClock(row.end_time)}
                    </p>
                  </div>
                  <span className="shrink-0 text-xs text-slate-400">
                    {row.room ?? "-"}
                  </span>
                  <ChevronRight
                    size={16}
                    className="shrink-0 text-slate-300"
                  />
                </div>
              ))}
            </div>
          ) : (
            <EmptyState label="No periods scheduled for today." />
          )}
        </DashboardCard>
      </div>

      {/* Events + notices + results */}
      <div className="grid gap-6 xl:grid-cols-3">
        <DashboardCard title="Upcoming Events">
          {upcomingEvents.length ? (
            <div className="space-y-4">
              {upcomingEvents.slice(0, 4).map((event, index) => {
                const EventIcon =
                  EVENT_ICONS[index % EVENT_ICONS.length];

                return (
                  <div key={event.id} className="flex items-center gap-3">
                    <div className="w-12 shrink-0 rounded-lg border border-slate-200 py-1.5 text-center">
                      <p className="text-sm font-bold leading-none text-slate-800">
                        {formatDayMonth(event.date).split(" ")[0]}
                      </p>
                      <p className="mt-0.5 text-[10px] font-semibold uppercase leading-none text-rose-500">
                        {formatDayMonth(event.date).split(" ")[1]}
                      </p>
                    </div>
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white ${
                        CHIP_COLORS[index % CHIP_COLORS.length]
                      }`}
                    >
                      <EventIcon size={16} />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-800">
                        {event.title}
                      </p>
                      <p className="truncate text-xs text-slate-400">
                        {event.location ?? "Venue to be announced"} ·{" "}
                        {event.time ? formatClock(event.time) : "All day"}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <EmptyState label="No upcoming events right now." />
          )}
        </DashboardCard>

        <DashboardCard
          title="Latest Notices"
          action={<ViewAllLink to="/student/notices" />}
        >
          {notices.length ? (
            <div className="space-y-4">
              {notices.slice(0, 4).map((notice) => {
                const { Icon, chip } = noticeVisual(notice.priority);

                return (
                  <div key={notice.id} className="flex items-center gap-3">
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${chip}`}
                    >
                      <Icon size={16} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-slate-800">
                        {notice.title}
                      </p>
                      <p className="truncate text-xs text-slate-400">
                        {notice.category ?? "General"} ·{" "}
                        {formatDate(notice.date)}
                      </p>
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize ${
                        PRIORITY_STYLES[
                          (notice.priority ?? "normal").toLowerCase()
                        ]
                      }`}
                    >
                      {notice.priority ?? "Normal"}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <EmptyState label="No notices published yet." />
          )}
        </DashboardCard>

        <DashboardCard
          title="Recent Results"
          action={<ViewAllLink to="/student/results" />}
        >
          {recentResults.length ? (
            <div className="space-y-4">
              {recentResults.slice(0, 4).map((result, index) => {
                const passed =
                  Number(result.marks_obtained) >=
                  Number(result.total_marks) * 0.33;

                return (
                  <div key={result.id} className="flex items-center gap-3">
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white ${
                        CHIP_COLORS[index % CHIP_COLORS.length]
                      }`}
                    >
                      <BookOpen size={16} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-slate-800">
                        {result.subjects?.subject_name ?? "Subject"}
                      </p>
                      <p className="truncate text-xs text-slate-400">
                        {result.exams?.name ?? "Exam"} ·{" "}
                        {formatDate(result.created_at)}
                      </p>
                    </div>
                    <span className="shrink-0 text-sm font-bold text-slate-900">
                      {Number(result.marks_obtained)}/
                      {Number(result.total_marks)}
                    </span>
                    <span
                      className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                        passed
                          ? "bg-emerald-50 text-emerald-600"
                          : "bg-rose-50 text-rose-600"
                      }`}
                    >
                      {passed ? "Pass" : "Fail"}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <EmptyState label="No results have been published yet." />
          )}
        </DashboardCard>
      </div>

      {/* Assignments + motivation */}
      <div className="grid gap-6 xl:grid-cols-3">
        <DashboardCard
          title="Recent Assignments"
          action={<ViewAllLink to="/student/assignments" />}
          className="xl:col-span-2"
        >
          {recentAssignments.length ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[480px] text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-xs font-semibold uppercase tracking-wide text-slate-400">
                    <th className="pb-2 pr-4">Subject</th>
                    <th className="pb-2 pr-4">Title</th>
                    <th className="pb-2 pr-4">Due Date</th>
                    <th className="pb-2 text-right">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentAssignments.map((assignment) => {
                    const status =
                      ASSIGNMENT_STATUS[assignment.status.toLowerCase()] ?? {
                        label: assignment.status,
                        className: "bg-slate-100 text-slate-500",
                      };

                    return (
                      <tr
                        key={assignment.id}
                        className="border-b border-slate-50 last:border-0"
                      >
                        <td className="py-3 pr-4 text-slate-600">
                          {assignment.subject}
                        </td>
                        <td className="py-3 pr-4 font-medium text-slate-800">
                          {assignment.title}
                        </td>
                        <td className="py-3 pr-4 text-slate-500">
                          {formatDate(assignment.due_date)}
                        </td>
                        <td className="py-3 text-right">
                          <span
                            className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${status.className}`}
                          >
                            {status.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState label="No assignments shared with your class yet." />
          )}
        </DashboardCard>

        <section className="flex flex-col justify-center rounded-xl border border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-emerald-50 p-6">
          <div className="flex items-start gap-4">
            <BookStack />
            <div>
              <p className="text-lg font-bold leading-snug text-slate-900">
                Your future is created by what you do today.
              </p>
              <div className="my-3 h-0.5 w-10 rounded-full bg-indigo-300" />
              <p className="text-sm font-medium text-slate-500">
                Keep going!
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};


export default StudentDashboardPage;






