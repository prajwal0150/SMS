import { useMemo } from "react";
import { motion } from "motion/react";
import type { Variants } from "motion/react";
import {
  BookOpen,
  CalendarCheck,
  CalendarDays,
  Clock,
} from "lucide-react";

import { useTeacherProfile } from "../../hooks/useTeacherProfile";

import type { TeacherTimetableEntry } from "../../types/teacherTypes";

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

const assignmentKey = (
  className: string,
  section: string | null,
  subject: string
): string => `${className}|${section ?? ""}|${subject}`;

const toMinutes = (time: string): number => {
  const [hours = 0, minutes = 0] = time
    .split(":")
    .map((part) => Number(part));

  return hours * 60 + minutes;
};

const formatTime = (time: string): string =>
  /^\d{1,2}:\d{2}/.test(time) ? time.slice(0, 5) : time;

interface AssignmentStat {
  weekly: number;
  todayCount: number;
  next: TeacherTimetableEntry | null;
}

const TeacherClassesPage = () => {
  const { profile, assignments, timetable, loading } =
    useTeacherProfile();

  const now = new Date();
  const today = DAY_NAMES[now.getDay()];
  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  // Real period stats per assignment, matched from the
  // teacher's timetable (class + section + subject).
  const statsByAssignment = useMemo(() => {
    const stats = new Map<string, AssignmentStat>();

    assignments.forEach((item) => {
      const key = assignmentKey(
        item.className,
        item.section,
        item.subject
      );

      const matches = timetable.filter(
        (entry) =>
          entry.className === item.className &&
          (entry.section ?? "") === (item.section ?? "") &&
          entry.subject === item.subject
      );

      const todayEntries = matches
        .filter((entry) => entry.day === today)
        .sort((a, b) => a.period - b.period);

      const upcoming =
        todayEntries.find(
          (entry) => toMinutes(entry.startTime) >= nowMinutes
        ) ?? null;

      stats.set(key, {
        weekly: matches.length,
        todayCount: todayEntries.length,
        next: upcoming,
      });
    });

    return stats;
  }, [assignments, timetable, today, nowMinutes]);

  if (loading) {
    return (
      <div className="flex h-48 items-center justify-center">
        <span className="h-7 w-7 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-600" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-6 text-center">
        <p className="text-sm font-semibold text-amber-700">
          We could not find your teacher profile.
        </p>
        <p className="mt-1 text-xs text-amber-600">
          Please contact the admin.
        </p>
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
            Teacher Portal
          </p>
          <h1 className="mt-0.5 truncate text-lg font-bold tracking-tight text-slate-900 sm:text-xl">
            My Classes
          </h1>
          <p className="mt-0.5 text-xs text-slate-500">
            Classes you are currently teaching.
          </p>
        </div>

        <span className="w-fit shrink-0 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-semibold text-slate-500">
          {assignments.length}{" "}
          {assignments.length === 1 ? "assignment" : "assignments"}
        </span>
      </motion.div>

      {assignments.length === 0 ? (
        /* Empty state */
        <motion.div
          variants={sectionVariants}
          className="rounded-lg border border-slate-200 bg-white px-4 py-10 text-center"
        >
          <BookOpen size={26} className="mx-auto text-slate-300" />
          <p className="mt-2 text-sm font-medium text-slate-700">
            No classes assigned yet.
          </p>
          <p className="mt-1 text-xs text-slate-400">
            Once the admin assigns you a class, section and
            subject, it will appear here.
          </p>
        </motion.div>
      ) : (
        /* Compact class cards */
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">

          {assignments.map((item) => {
            const stat = statsByAssignment.get(
              assignmentKey(
                item.className,
                item.section,
                item.subject
              )
            );

            const weekly = stat?.weekly ?? 0;
            const todayCount = stat?.todayCount ?? 0;

            const nextLabel = stat?.next
              ? `Next today - Period ${stat.next.period}, ${formatTime(stat.next.startTime)} - ${formatTime(stat.next.endTime)}`
              : todayCount > 0
                ? "Today's periods are done"
                : "No period scheduled today";

            return (
              <article
                key={item.id}
                className="animate-fade-up rounded-lg border border-slate-200 bg-white p-4 transition-colors hover:-translate-y-0.5 hover:border-indigo-200"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-[11px] font-semibold uppercase tracking-wider text-indigo-600">
                      {item.subject}
                    </p>
                    <h3 className="mt-0.5 truncate text-base font-bold text-slate-900">
                      Class {item.className}
                      {item.section ? ` - ${item.section}` : ""}
                    </h3>
                  </div>
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                    <BookOpen size={16} />
                  </span>
                </div>

                {/* Mini period stats */}
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <div className="rounded-lg bg-slate-50 px-2.5 py-2">
                    <p className="text-sm font-bold leading-tight text-slate-900">
                      {weekly}
                    </p>
                    <p className="mt-0.5 text-[10px] font-medium text-slate-400">
                      periods / week
                    </p>
                  </div>
                  <div
                    className={`rounded-lg px-2.5 py-2 ${
                      todayCount > 0
                        ? "bg-emerald-50"
                        : "bg-slate-50"
                    }`}
                  >
                    <p className="text-sm font-bold leading-tight text-slate-900">
                      {todayCount}
                    </p>
                    <p className="mt-0.5 text-[10px] font-medium text-slate-400">
                      periods today
                    </p>
                  </div>
                </div>

                {/* Next period */}
                <p className="mt-3 flex items-center gap-1.5 text-[11px] font-medium text-slate-500">
                  {stat?.next ? (
                    <Clock size={12} className="shrink-0 text-slate-400" />
                  ) : (
                    <CalendarDays
                      size={12}
                      className="shrink-0 text-slate-400"
                    />
                  )}
                  <span className="truncate">{nextLabel}</span>
                  {stat?.next?.room && (
                    <span className="hidden shrink-0 rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-500 sm:inline">
                      {stat.next.room}
                    </span>
                  )}
                </p>

                <p className="mt-2 hidden items-center gap-1.5 text-[10px] font-medium text-slate-400 sm:flex">
                  <CalendarCheck
                    size={12}
                    className="shrink-0 text-slate-300"
                  />
                  Scheduled by the admin timetable
                </p>
              </article>
            );
          })}
        </div>
      )}
    </motion.div>
  );
};

export default TeacherClassesPage;

