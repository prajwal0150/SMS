import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookMarked,
  BookOpen,
  CalendarDays,
  GraduationCap,
  Megaphone,
  Users,
} from "lucide-react";

import useAuth from "../../../auth/hooks/useAuth";

import { adminNavGroups } from "../../../../layouts/AdminLayout/navConfig";

import Card from "../components/Card";
import StatCard from "../components/StatCard";

import {
  academyStats,
  adminNotices,
  adminEvents,
} from "../utils/mockData";


const CATEGORY_STYLES: Record<string, string> = {
  Academic: "bg-indigo-50 text-indigo-600",
  Event: "bg-green-50 text-green-600",
  Staff: "bg-amber-50 text-amber-600",
  General: "bg-slate-100 text-slate-600",
};


const AdminDashboardPage = () => {
  const { user } = useAuth();

  const fullName =
    user?.user_metadata?.full_name ?? "Admin";

  const today = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const recentNotices = adminNotices.slice(0, 4);

  const upcomingEvents = adminEvents.slice(0, 4);


  return (
    <>
      {/* Welcome banner */}
      <section className="relative mb-6 overflow-hidden rounded-lg bg-slate-900 p-8 text-white animate-fade-up">
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-indigo-500/25 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-10 h-48 w-48 rounded-full bg-blue-500/20 blur-2xl" />

        <div className="relative">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-300">
            Admin dashboard
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">
            Welcome back, {fullName}
          </h1>
          <p className="mt-2 text-sm text-slate-300">
            {today}
          </p>
        </div>
      </section>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Students"
          value={academyStats.students}
          icon={Users}
          accent="bg-indigo-600/10 text-indigo-600"
        />
        <StatCard
          label="Teachers"
          value={academyStats.teachers}
          icon={GraduationCap}
          accent="bg-green-600/10 text-green-600"
        />
        <StatCard
          label="Classes"
          value={academyStats.classes}
          icon={BookOpen}
          accent="bg-amber-600/10 text-amber-600"
        />
        <StatCard
          label="Subjects"
          value={academyStats.subjects}
          icon={BookMarked}
          accent="bg-red-600/10 text-red-600"
        />
      </div>

      {/* Quick access */}
      <div className="mt-8">
        <div className="mb-4 flex items-end justify-between">
          <h2 className="text-lg font-bold tracking-tight text-slate-900">
            Portal Modules
          </h2>
          <span className="text-xs font-medium text-slate-500">
            {adminNavGroups.reduce(
              (sum, group) => sum + group.children.length,
              0
            )}{" "}
            sections available
          </span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
          {adminNavGroups.map((group) => {
            const Icon = group.icon;

            return (
              <Link
                key={group.id}
                to={`/admin/${group.id}`}
                className="group rounded-lg border border-slate-200 bg-white p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-200"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-indigo-600/10 text-indigo-600 transition-colors group-hover:bg-indigo-600 group-hover:text-white">
                  <Icon size={20} />
                </div>
                <p className="mt-4 text-sm font-semibold text-slate-900">
                  {group.label}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  {group.children.length > 0
                    ? `${group.children.length} sections`
                    : "Manage staff"}
                </p>
                <span className="mt-3 flex items-center gap-1 text-xs font-semibold text-indigo-600">
                  Open
                  <ArrowRight
                    size={13}
                    className="transition-transform duration-200 group-hover:translate-x-0.5"
                  />
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Notices + events */}
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Card
          title="Latest Notices"
          subtitle="Announcements across the school"
          action={
            <Link
              to="/admin/communication/notices"
              className="text-sm font-semibold text-indigo-600 hover:text-indigo-700"
            >
              View all
            </Link>
          }
        >
          <ul className="space-y-3">
            {recentNotices.map((notice) => (
              <li
                key={notice.id}
                className="flex items-start gap-3 rounded-lg border border-slate-100 bg-slate-50/60 p-3"
              >
                <Megaphone
                  size={16}
                  className="mt-0.5 shrink-0 text-indigo-600"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-900">
                    {notice.title}
                  </p>
                  <p className="text-xs text-slate-500">
                    {notice.date}
                  </p>
                </div>
                <span
                  className={`inline-flex shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${CATEGORY_STYLES[notice.category] ?? ""}`}
                >
                  {notice.category}
                </span>
              </li>
            ))}
          </ul>
        </Card>

        <Card
          title="Upcoming Events"
          subtitle="Calendar highlights"
          action={
            <Link
              to="/admin/communication/events"
              className="text-sm font-semibold text-indigo-600 hover:text-indigo-700"
            >
              View calendar
            </Link>
          }
        >
          <ul className="space-y-3">
            {upcomingEvents.map((event) => (
              <li
                key={event.id}
                className="flex items-center gap-4 rounded-lg border border-slate-100 bg-slate-50/60 p-3"
              >
                <div className="flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-lg border border-slate-200 bg-white">
                  <span className="text-xs font-bold text-indigo-600">
                    {event.date.slice(8, 10)}
                  </span>
                  <span className="text-[10px] font-medium uppercase text-slate-400">
                    {new Date(
                      event.date
                    ).toLocaleDateString(undefined, {
                      month: "short",
                    })}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-900">
                    {event.title}
                  </p>
                  <p className="text-xs text-slate-500">
                    {event.time} · {event.location}
                  </p>
                </div>
                <CalendarDays
                  size={16}
                  className="shrink-0 text-slate-300"
                />
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </>
  );
};

export default AdminDashboardPage;