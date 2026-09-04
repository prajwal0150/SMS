import { useEffect, useMemo, useState } from "react";
import {
  BookOpen,
  CalendarCheck,
  ClipboardList,
  Users,
} from "lucide-react";

import PageHeader from "../components/PageHeader";

import { useTeacherProfile } from "../hooks/useTeacherProfile";

import {
  fetchClassAssignments,
  fetchStudentCountFor,
} from "../services/teacherService";

const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const TeacherDashboardPage = () => {
  const {
    profile,
    assignments,
    timetable,
    loading: profileLoading,
  } = useTeacherProfile();

  const [studentTotal, setStudentTotal] =
    useState<number | null>(null);
  const [openAssignments, setOpenAssignments] =
    useState(0);

  const today = DAY_NAMES[new Date().getDay()];

  // Unique class + section pairs the teacher is
  // assigned to (used for the student count).
  const uniquePairs = useMemo(() => {
    const seen = new Set<string>();

    return assignments
      .filter((item) => {
        const key = `${item.className}|${item.section ?? ""}`;

        if (seen.has(key)) {
          return false;
        }

        seen.add(key);
        return true;
      })
      .map((item) => ({
        className: item.className,
        section: item.section ?? "",
      }));
  }, [assignments]);

  // Students actually added by the admin for
  // those class + section pairs.
  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      if (uniquePairs.length === 0) {
        setStudentTotal(0);
        return;
      }

      try {
        const counts = await Promise.all(
          uniquePairs.map((pair) =>
            fetchStudentCountFor(
              pair.className,
              pair.section
            )
          )
        );

        if (!cancelled) {
          setStudentTotal(
            counts.reduce(
              (sum, count) => sum + count,
              0
            )
          );
        }
      } catch {
        if (!cancelled) {
          setStudentTotal(null);
        }
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [uniquePairs]);

  // Open homework created by this teacher.
  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      if (!profile) {
        setOpenAssignments(0);
        return;
      }

      try {
        const rows =
          await fetchClassAssignments(
            profile.id
          );

        if (!cancelled) {
          setOpenAssignments(
            rows.filter(
              (row) => row.status === "Open"
            ).length
          );
        }
      } catch {
        if (!cancelled) {
          setOpenAssignments(0);
        }
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [profile]);

  // Today's periods from the timetable the admin built.
  const todayPeriods = useMemo(
    () =>
      timetable
        .filter((entry) => entry.day === today)
        .sort(
          (a, b) => a.period - b.period
        ),
    [timetable, today]
  );

  const stats = [
    {
      label: "My Classes",
      value: uniquePairs.length,
      icon: BookOpen,
      accent: "bg-indigo-50 text-indigo-600",
    },
    {
      label: "My Students",
      value:
        studentTotal === null
          ? "—"
          : studentTotal,
      icon: Users,
      accent: "bg-green-50 text-green-600",
    },
    {
      label: `Periods Today`,
      value: todayPeriods.length,
      icon: CalendarCheck,
      accent: "bg-amber-50 text-amber-600",
    },
    {
      label: "Open Assignments",
      value: openAssignments,
      icon: ClipboardList,
      accent: "bg-rose-50 text-rose-600",
    },
  ];

  return (
    <>
      <PageHeader
        title={
          profile
            ? `Welcome back, ${profile.firstName ?? "Teacher"}`
            : "Teacher Dashboard"
        }
        description="Your classes, students and today's schedule — all from the admin setup."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-lg border border-slate-200 bg-white p-5"
          >
            <div
              className={`inline-flex rounded-lg p-2.5 ${stat.accent}`}
            >
              <stat.icon size={20} />
            </div>
            <p className="mt-3 text-2xl font-bold text-slate-900">
              {profileLoading
                ? "..."
                : stat.value}
            </p>
            <p className="text-xs font-medium text-slate-400">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section className="rounded-lg border border-slate-200 bg-white">
          <div className="border-b border-slate-200 px-6 py-4">
            <h3 className="font-bold text-slate-900">
              Today · {today}
            </h3>
          </div>

          <div className="divide-y divide-slate-100">
            {todayPeriods.length === 0 ? (
              <p className="px-6 py-8 text-center text-sm text-slate-400">
                No periods scheduled for today.
              </p>
            ) : (
              todayPeriods.map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between px-6 py-3"
                >
                  <div>
                    <p className="font-semibold text-slate-900">
                      {entry.subject}
                    </p>
                    <p className="text-xs font-medium text-slate-500">
                      {entry.className}
                      {entry.section
                        ? ` - ${entry.section}`
                        : ""}{" "}
                      · Period {entry.period}
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-slate-500">
                    {entry.startTime} -{" "}
                    {entry.endTime}
                  </span>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="rounded-lg border border-slate-200 bg-white">
          <div className="border-b border-slate-200 px-6 py-4">
            <h3 className="font-bold text-slate-900">
              My class sections
            </h3>
          </div>

          <div className="divide-y divide-slate-100">
            {uniquePairs.length === 0 ? (
              <p className="px-6 py-8 text-center text-sm text-slate-400">
                No class sections assigned yet. Ask
                the admin to assign you from Staff
                Management.
              </p>
            ) : (
              uniquePairs.map((pair) => (
                <div
                  key={`${pair.className}-${pair.section}`}
                  className="flex items-center justify-between px-6 py-3"
                >
                  <p className="font-semibold text-slate-900">
                    {pair.className}
                    {pair.section
                      ? ` - ${pair.section}`
                      : ""}
                  </p>
                  <span className="text-xs font-medium text-slate-500">
                    {pair.className}/{pair.section}
                  </span>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </>
  );
};

export default TeacherDashboardPage;
