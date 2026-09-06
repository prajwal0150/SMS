import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import type { Variants } from "motion/react";
import {
  BookOpen,
  CalendarCheck,
  ClipboardList,
  Users,
} from "lucide-react";

import { useTeacherProfile } from "../../hooks/useTeacherProfile";

import { fetchStudentCountFor } from "../services/dashboardService";
import { fetchClassAssignments } from "../../Assignment/services/assignmentService";

const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

/* Staggered fade-up entrance for the whole page. */
const pageVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: "easeOut" },
  },
};

const statGridVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const statCardVariants: Variants = {
  hidden: { opacity: 0, y: 12, scale: 0.97 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

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

  const now = new Date();
  const today = DAY_NAMES[now.getDay()];

  const todayLabel = now.toLocaleDateString(undefined, {
    weekday: "long",
    day: "numeric",
    month: "short",
  });

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

  // Weekly period counts per class + section pair
  // (shown as a badge on each class row).
  const weeklyPeriodsByPair = useMemo(() => {
    const counts = new Map<string, number>();

    timetable.forEach((entry) => {
      const key = `${entry.className}|${entry.section ?? ""}`;

      counts.set(key, (counts.get(key) ?? 0) + 1);
    });

    return counts;
  }, [timetable]);

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
            fetchStudentCountFor(pair.className, pair.section)
          )
        );

        if (!cancelled) {
          setStudentTotal(
            counts.reduce((sum, count) => sum + count, 0)
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
        const rows = await fetchClassAssignments(profile.id);

        if (!cancelled) {
          setOpenAssignments(
            rows.filter((row) => row.status === "Open").length
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
        .sort((a, b) => a.period - b.period),
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
      value: studentTotal === null ? "-" : studentTotal,
      icon: Users,
      accent: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "Periods Today",
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

  if (profileLoading) {
    return (
      <div className="flex h-48 items-center justify-center">
        <span className="h-7 w-7 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-600" />
      </div>
    );
  }

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="show"
      className="space-y-4"
    >
      {/* Compact header */}
      <motion.div
        variants={sectionVariants}
        className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between"
      >
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-indigo-600">
            Teacher Dashboard
          </p>
          <h1 className="mt-0.5 truncate text-lg font-bold tracking-tight text-slate-900 sm:text-xl">
            {profile
              ? `Welcome back, ${profile.firstName ?? "Teacher"}`
              : "Teacher Dashboard"}
          </h1>
          <p className="mt-0.5 text-xs text-slate-500">
            Your classes, students and today's schedule.
          </p>
        </div>

        <span className="w-fit shrink-0 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-semibold text-slate-500">
          {todayLabel}
        </span>
      </motion.div>

      {/* Compact stat cards */}
      <motion.div
        variants={statGridVariants}
        className="grid grid-cols-2 gap-3 xl:grid-cols-4"
      >
        {stats.map((stat) => (
          <motion.div
            key={stat.label}
            variants={statCardVariants}
            whileHover={{ y: -2 }}
            className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-3.5"
          >
            <span
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${stat.accent}`}
            >
              <stat.icon size={16} />
            </span>
            <div className="min-w-0">
              <p className="truncate text-lg font-bold leading-tight text-slate-900">
                {stat.value}
              </p>
              <p className="truncate text-[11px] font-medium text-slate-400">
                {stat.label}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>


      {/* Compact panels */}
      <motion.div
        variants={sectionVariants}
        className="grid gap-4 lg:grid-cols-2"
      >
        {/* Today's schedule */}
        <section className="overflow-hidden rounded-lg border border-slate-200 bg-white">
          <header className="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-3">
            <h2 className="flex items-center gap-2 text-sm font-bold text-slate-900">
              <CalendarCheck size={14} className="text-indigo-600" />
              Today's Schedule
            </h2>
            <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-semibold text-indigo-600">
              {todayPeriods.length}{" "}
              {todayPeriods.length === 1 ? "period" : "periods"}
            </span>
          </header>

          <div className="divide-y divide-slate-50">
            {todayPeriods.length === 0 ? (
              <p className="px-4 py-8 text-center text-xs text-slate-400">
                No periods scheduled for today.
              </p>
            ) : (
              todayPeriods.map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between gap-3 px-4 py-2.5 transition-colors hover:bg-slate-50/70"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-800">
                      {entry.subject}
                    </p>
                    <p className="mt-0.5 truncate text-[11px] font-medium text-slate-400">
                      {entry.className}
                      {entry.section ? ` - ${entry.section}` : ""}{" "}
                      - Period {entry.period}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-md bg-slate-50 px-2 py-1 text-[10px] font-semibold text-slate-500">
                    {entry.startTime} - {entry.endTime}
                  </span>
                </div>
              ))
            )}
          </div>
        </section>

        {/* My class sections */}
        <section className="overflow-hidden rounded-lg border border-slate-200 bg-white">
          <header className="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-3">
            <h2 className="flex items-center gap-2 text-sm font-bold text-slate-900">
              <Users size={14} className="text-indigo-600" />
              My Class Sections
            </h2>
            <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-600">
              {uniquePairs.length}{" "}
              {uniquePairs.length === 1 ? "class" : "classes"}
            </span>
          </header>

          <div className="divide-y divide-slate-50">
            {uniquePairs.length === 0 ? (
              <p className="px-4 py-8 text-center text-xs text-slate-400">
                No class sections assigned yet. Ask the admin to
                assign you from Staff Management.
              </p>
            ) : (
              uniquePairs.map((pair) => {
                const pairKey = `${pair.className}|${pair.section}`;
                const weekly =
                  weeklyPeriodsByPair.get(pairKey) ?? 0;

                return (
                  <div
                    key={pairKey}
                    className="flex items-center justify-between gap-3 px-4 py-2.5 transition-colors hover:bg-slate-50/70"
                  >
                    <div className="flex min-w-0 items-center gap-2.5">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                        <BookOpen size={13} />
                      </span>
                      <p className="truncate text-sm font-semibold text-slate-800">
                        {pair.className}
                        {pair.section ? ` - ${pair.section}` : ""}
                      </p>
                    </div>
                    <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-500">
                      {weekly}{" "}
                      {weekly === 1 ? "period" : "periods"}/week
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </section>
      </motion.div>
    </motion.div>
  );
};

export default TeacherDashboardPage;

