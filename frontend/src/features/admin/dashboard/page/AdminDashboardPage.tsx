import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  ClipboardCheck,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Megaphone,
  RefreshCw,
  Users,
} from "lucide-react";

import useAuth from "../../../auth/hooks/useAuth";
import { adminNavGroups } from "../../../../layouts/AdminLayout/navConfig";
import Card from "../components/Card";
import StatCard from "../components/StatCard";
import useDashboard from "../hooks/useDashbord";
import type { DashboardAttendanceStatus } from "../types/adminDashboardTypes";

const statusColors: Record<DashboardAttendanceStatus["status"], string> = {
  present: "#37b878",
  late: "#4b82e8",
  absent: "#f6a623",
  leave: "#ed4b51",
};

const formatDate = (value: string, options?: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat(undefined, options).format(new Date(`${value}T00:00:00`));

const formatNumber = (value: number) => new Intl.NumberFormat().format(value);

const getCalendarDays = (month: Date) => {
  const year = month.getFullYear();
  const monthIndex = month.getMonth();
  const firstDay = new Date(year, monthIndex, 1).getDay();
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

  return Array.from({ length: firstDay + daysInMonth }, (_, index) =>
    index < firstDay ? null : index - firstDay + 1,
  );
};

const EmptyState = ({ label }: { label: string }) => (
  <p className="py-8 text-center text-sm text-slate-400">{label}</p>
);

const AdminDashboardPage = () => {
  const { user } = useAuth();
  const { data, loading, error } = useDashboard();
  const [calendarMonth, setCalendarMonth] = useState(() => new Date());
  const fullName = user?.user_metadata?.full_name ?? "Admin";

  if (loading) {
    return <div className="rounded-xl border border-slate-200 bg-white p-12 text-center text-sm text-slate-500">Loading dashboard data...</div>;
  }

  if (error || !data) {
    return (
      <div className="rounded-xl border border-red-100 bg-white p-8 text-center">
        <p className="text-base font-semibold text-slate-900">Dashboard data is unavailable</p>
        <p className="mx-auto mt-2 max-w-xl text-sm text-slate-500">{error ?? "The dashboard could not be loaded."} Make sure the supplied Supabase dashboard SQL has been run.</p>
        <button onClick={() => window.location.reload()} className="mt-5 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700">
          <RefreshCw size={15} /> Retry
        </button>
      </div>
    );
  }

  const { statistics, todayAttendance, attendance, classes, notices, events, recentStudents } = data;
  const attendanceTotal = attendance.reduce((sum, item) => sum + Number(item.total_records), 0);
  const attendanceStyle = attendanceTotal
    ? `conic-gradient(${attendance.map((item, index) => {
        const start = attendance.slice(0, index).reduce((sum, entry) => sum + (Number(entry.total_records) / attendanceTotal) * 100, 0);
        const end = start + (Number(item.total_records) / attendanceTotal) * 100;
        return `${statusColors[item.status]} ${start}% ${end}%`;
      }).join(", ")})`
    : "#e2e8f0";
  const maxClassCount = Math.max(...classes.map((item) => Number(item.total_students)), 1);
  const calendarDays = getCalendarDays(calendarMonth);
  const eventDates = new Set(events.map((event) => event.date));
  const todayKey = new Date().toISOString().slice(0, 10);
  const calendarMonthLabel = new Intl.DateTimeFormat(undefined, {
    month: "long",
    year: "numeric",
  }).format(calendarMonth);

  return (
    <div className="space-y-4">
      <section className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-600">School overview</p>
          <h1 className="mt-1 text-xl font-bold tracking-tight text-slate-900">Welcome back, {fullName}</h1>
          <p className="mt-1 text-xs text-slate-500">Here is what is happening across your school today.</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-right shadow-sm">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Academic year</p>
          <p className="mt-0.5 text-sm font-semibold text-slate-700">{statistics.academic_year}</p>
        </div>
      </section>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
        <StatCard label="Total Students" value={formatNumber(statistics.active_students)} icon={Users} accent="bg-indigo-600/10 text-indigo-600" />
        <StatCard label="Total Teachers" value={formatNumber(statistics.active_teachers)} icon={GraduationCap} accent="bg-emerald-600/10 text-emerald-600" />
        <StatCard label="Total Classes" value={formatNumber(statistics.active_classes)} icon={BookOpen} accent="bg-orange-500/10 text-orange-600" />
        <StatCard label="Total Subjects" value={formatNumber(statistics.active_subjects)} icon={BookOpen} accent="bg-blue-600/10 text-blue-600" />
        <StatCard label="Today's Attendance" value={`${Number(todayAttendance.attendance_percentage ?? 0).toFixed(1)}%`} icon={ClipboardCheck} accent="bg-violet-600/10 text-violet-600" />
        <StatCard label="Published Notices" value={formatNumber(statistics.published_notices)} icon={Megaphone} accent="bg-cyan-600/10 text-cyan-600" />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.05fr_1.45fr_1.05fr]">
        <Card title="Student attendance" subtitle="Current month">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <div className="relative h-28 w-28 shrink-0 rounded-full" style={{ background: attendanceStyle }}>
              <div className="absolute inset-4 flex flex-col items-center justify-center rounded-full bg-white text-center">
                <strong className="text-lg text-slate-900">{Number(todayAttendance.attendance_percentage ?? 0).toFixed(1)}%</strong>
                <span className="text-[10px] text-slate-500">today</span>
              </div>
            </div>
            <div className="space-y-2 text-xs">
              {attendance.map((item) => <div key={item.status} className="flex items-center justify-between gap-5"><span className="flex items-center gap-2 capitalize text-slate-600"><i className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: statusColors[item.status] }} />{item.status}</span><strong className="text-slate-800">{formatNumber(Number(item.total_records))} ({Number(item.percentage).toFixed(1)}%)</strong></div>)}
              {!attendance.length && <EmptyState label="No attendance records this month." />}
            </div>
          </div>
          <div className="mt-6 rounded-lg bg-indigo-50 px-3 py-2 text-xs text-indigo-700">{todayAttendance.total_records ? `${formatNumber(Number(todayAttendance.total_records))} attendance records were captured today.` : "No attendance has been recorded today."}</div>
        </Card>

        <Card title="Students by class" subtitle="Active students in the current register">
          {classes.length ? <div className="space-y-3">{classes.slice(0, 7).map((item) => <div key={item.class_id}><div className="mb-1 flex justify-between text-xs"><span className="font-medium text-slate-600">{item.class_name}</span><span className="text-slate-400">{formatNumber(Number(item.total_students))}</span></div><div className="h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-indigo-500" style={{ width: `${(Number(item.total_students) / maxClassCount) * 100}%` }} /></div></div>)}</div> : <EmptyState label="No active classes found." />}
        </Card>

        <Card title="Upcoming events" subtitle="Published school calendar">
          <div className="space-y-3">{events.length ? events.slice(0, 4).map((event) => <div key={event.id} className="flex items-center gap-3"><div className="flex h-10 w-10 shrink-0 flex-col items-center justify-center rounded-lg bg-indigo-50 text-indigo-600"><strong className="text-sm">{formatDate(event.date, { day: "2-digit" })}</strong><span className="text-[9px] uppercase">{formatDate(event.date, { month: "short" })}</span></div><div className="min-w-0"><p className="truncate text-sm font-semibold text-slate-800">{event.title}</p><p className="truncate text-xs text-slate-400">{event.time || "Time not set"} · {event.location || "Location not set"}</p></div></div>) : <EmptyState label="No upcoming events." />}</div>
          <Link to="/admin/communication/events" className="mt-5 flex items-center justify-end gap-1 text-xs font-semibold text-indigo-600">View calendar <ArrowRight size={13} /></Link>
        </Card>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.35fr_1fr]">
        <Card title="Recent admissions" subtitle="Latest students added to the register" action={<Link to="/admin/students" className="text-xs font-semibold text-indigo-600">View all</Link>}>
          {recentStudents.length ? <div className="divide-y divide-slate-100">{recentStudents.slice(0, 5).map((student) => <div key={student.id} className="flex items-center justify-between gap-4 py-3"><div className="min-w-0"><p className="truncate text-sm font-semibold text-slate-800">{student.student_name}</p><p className="text-xs text-slate-400">{student.class_name ?? "Class not assigned"}{student.section_name ? ` · ${student.section_name}` : ""}</p></div><span className="shrink-0 text-xs text-slate-400">{formatDate(student.admission_date, { day: "2-digit", month: "short" })}</span></div>)}</div> : <EmptyState label="No recent admissions." />}
        </Card>
        <Card title="Latest notices" subtitle="Published announcements" action={<Link to="/admin/communication/notices" className="text-xs font-semibold text-indigo-600">View all</Link>}>
          {notices.length ? <div className="space-y-3">{notices.slice(0, 5).map((notice) => <div key={notice.id} className="flex gap-3"><div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-indigo-500" /><div className="min-w-0"><p className="truncate text-sm font-semibold text-slate-800">{notice.title}</p><p className="text-xs text-slate-400">{formatDate(notice.date, { day: "2-digit", month: "short", year: "numeric" })} · {notice.category}</p></div></div>)}</div> : <EmptyState label="No published notices." />}
        </Card>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
        <Card
          title="Calendar"
          subtitle="Published events from the school calendar"
          action={
            <div className="flex items-center gap-1">
              <button type="button" title="Previous month" aria-label="Previous month" onClick={() => setCalendarMonth((month) => new Date(month.getFullYear(), month.getMonth() - 1, 1))} className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"><ChevronLeft size={15} /></button>
              <button type="button" title="Next month" aria-label="Next month" onClick={() => setCalendarMonth((month) => new Date(month.getFullYear(), month.getMonth() + 1, 1))} className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"><ChevronRight size={15} /></button>
            </div>
          }
        >
          <div className="mx-auto max-w-md">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-800">{calendarMonthLabel}</p>
              <button type="button" onClick={() => setCalendarMonth(new Date())} className="text-xs font-semibold text-indigo-600 hover:text-indigo-700">Today</button>
            </div>
            <div className="grid grid-cols-7 gap-0.5 text-center text-[9px] font-semibold uppercase tracking-wide text-slate-400">
              {(["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const).map((day) => <span key={day} className="py-1">{day}</span>)}
              {calendarDays.map((day, index) => {
                const dateKey = day === null ? "" : `${calendarMonth.getFullYear()}-${String(calendarMonth.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                const hasEvent = eventDates.has(dateKey);
                const isToday = dateKey === todayKey;

                return <div key={`${dateKey}-${index}`} className={`relative flex h-8 items-center justify-center rounded-md text-xs ${isToday ? "bg-indigo-600 font-bold text-white" : day ? "text-slate-600 hover:bg-slate-50" : ""}`}>{day}{hasEvent && <span className={`absolute bottom-0.5 h-1 w-1 rounded-full ${isToday ? "bg-white" : "bg-orange-500"}`} />}</div>;
              })}
            </div>
            <div className="mt-3 flex items-center gap-4 text-[10px] text-slate-500"><span className="flex items-center gap-1.5"><i className="h-1.5 w-1.5 rounded-full bg-orange-500" /> Published event</span><span className="flex items-center gap-1.5"><i className="h-1.5 w-1.5 rounded-full bg-indigo-600" /> Today</span></div>
          </div>
        </Card>

        <Card title="Today's events" subtitle="Upcoming published events" action={<Link to="/admin/communication/events" className="text-xs font-semibold text-indigo-600">View all</Link>}>
          {events.length ? <div className="space-y-3">{events.slice(0, 4).map((event) => <div key={event.id} className="flex gap-3"><span className="w-12 shrink-0 pt-0.5 text-[10px] font-semibold text-slate-400">{event.time || "All day"}</span><div className="relative border-l-2 border-indigo-100 pl-3"><span className="absolute -left-1.25 top-1 h-2 w-2 rounded-full bg-indigo-500" /><p className="text-sm font-semibold text-slate-800">{event.title}</p><p className="mt-0.5 text-xs text-slate-400">{formatDate(event.date, { day: "2-digit", month: "short" })} · {event.location || "Location not set"}</p></div></div>)}</div> : <EmptyState label="No upcoming events." />}
        </Card>
      </div>

      <section>
        <div className="mb-2 flex items-center justify-between"><h2 className="text-sm font-bold text-slate-900">Portal modules</h2><span className="text-xs text-slate-400">{adminNavGroups.length} sections</span></div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">{adminNavGroups.slice(0, 10).map((group) => { const Icon = group.icon; return <Link key={group.id} to={`/admin/${group.id}`} className="group flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-3 transition hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-sm"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-500 group-hover:bg-indigo-50 group-hover:text-indigo-600"><Icon size={17} /></span><span className="min-w-0 flex-1 truncate text-xs font-semibold text-slate-700">{group.label}</span><ArrowRight size={14} className="text-slate-300 group-hover:text-indigo-500" /></Link>; })}</div>
      </section>
    </div>
  );
};

export default AdminDashboardPage;
