import { Link } from "react-router-dom";
import {
  BookOpen,
  Clock,
  FileText,
  Megaphone,
  Users,
} from "lucide-react";

import useAuth from "../../auth/hooks/useAuth";
import { useTeacherProfile } from "../hooks/useTeacherProfile";

import Card from "../components/Card";
import StatCard from "../components/StatCard";

import {
  teacherClasses,
  assignmentItems,
  noticeItems,
} from "../utils/mockData";


const TeacherDashboardPage = () => {
  const { user } = useAuth();
  const { profile, assignments } =
    useTeacherProfile();

  const fullName = profile
    ? `${profile.firstName} ${profile.lastName}`.trim()
    : user?.user_metadata?.full_name ?? "Teacher";

  const today = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const totalStudents =
    teacherClasses.reduce(
      (sum, item) => sum + item.students,
      0
    );

  const pendingAssignments =
    assignmentItems.filter(
      (item) => item.status === "Open"
    ).length;

  const recentAssignments =
    assignmentItems.slice(0, 4);

  const latestNotices =
    noticeItems.slice(0, 3);


  return (
    <>
      {/* Welcome banner */}
      <section className="relative mb-6 overflow-hidden rounded-lg bg-slate-900 p-8 text-white animate-fade-up">
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-indigo-500/25 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-10 h-48 w-48 rounded-full bg-blue-500/20 blur-2xl" />

        <div className="relative">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-300">
            Teacher dashboard
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
          label="My Classes"
          value={
            profile
              ? assignments.length
              : teacherClasses.length
          }
          icon={BookOpen}
          accent="bg-indigo-600/10 text-indigo-600"
        />
        <StatCard
          label="Students"
          value={totalStudents}
          icon={Users}
          accent="bg-green-600/10 text-green-600"
        />
        <StatCard
          label="Periods Today"
          value="6"
          icon={Clock}
          accent="bg-amber-600/10 text-amber-600"
        />
        <StatCard
          label="Pending Assignments"
          value={pendingAssignments}
          icon={FileText}
          accent="bg-red-600/10 text-red-600"
        />
      </div>

      {/* My classes - real data from teacher_assignments */}
      {profile && assignments.length > 0 && (
        <div className="mt-6">
          <Card
            title="My Classes"
            subtitle="Class sections assigned to you by the admin"
          >
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {assignments.map((item) => (
                <div
                  key={item.id}
                  className="rounded-lg border border-slate-100 bg-slate-50/60 p-4"
                >
                  <p className="text-sm font-semibold text-slate-900">
                    Class {item.className}
                    {item.section
                      ? `-${item.section}`
                      : ""}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {item.subject}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Recent assignments + notices */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card
          title="Recent Assignments"
          subtitle="Recently created or due soon"
          action={
            <Link
              to="/teacher/assignments"
              className="text-sm font-semibold text-indigo-600 hover:text-indigo-700"
            >
              View all
            </Link>
          }
        >
          <ul className="divide-y divide-slate-100">
            {recentAssignments.map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-900">
                    {item.title}
                  </p>
                  <p className="text-xs text-slate-500">
                    {item.className} - {item.subject}
                  </p>
                </div>
                <span className="shrink-0 text-xs font-medium text-slate-400">
                  Due {item.dueDate}
                </span>
              </li>
            ))}
          </ul>
        </Card>

        <Card
          title="Latest Notices"
          action={
            <Link
              to="/teacher/notices"
              className="text-sm font-semibold text-indigo-600 hover:text-indigo-700"
            >
              View all
            </Link>
          }
        >
          <ul className="space-y-3">
            {latestNotices.map((item) => (
              <li
                key={item.id}
                className="flex items-start gap-3 rounded-lg border border-slate-100 bg-slate-50/60 p-3"
              >
                <Megaphone
                  size={16}
                  className="mt-0.5 shrink-0 text-indigo-600"
                />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-900">
                    {item.title}
                  </p>
                  <p className="text-xs text-slate-500">
                    {item.category} - {item.date}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </>
  );
};

export default TeacherDashboardPage;