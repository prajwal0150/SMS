import { motion } from "motion/react";
import type { Variants } from "motion/react";
import { CalendarDays, Clock, User } from "lucide-react";

import { useStudentTimetable } from "../hooks/useStudentTimetable";

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const ALL_DAYS = [
  "Sunday",
  ...DAYS,
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

const formatTime = (value: string): string => value.slice(0, 5);

const StudentTimetablePage = () => {
  const { summary, weekly, byDay, loading, error } =
    useStudentTimetable();

  const today = ALL_DAYS[new Date().getDay()];

  // Period rows sorted by period number (mirrors the teacher view).
  const periods = [
    ...new Set(weekly.map((entry) => entry.period_number)),
  ].sort((a, b) => a - b);

  // Today's classes, derived from the weekly rows.
  const todayEntries = weekly
    .filter((entry) => entry.day_of_week === today)
    .sort((a, b) => a.period_number - b.period_number);

  const dayCounts = (day: string): number =>
    byDay.find((d) => d.day_of_week === day)?.total_periods ?? 0;


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
            Student Portal
          </p>
          <h1 className="mt-0.5 truncate text-lg font-bold tracking-tight text-slate-900 sm:text-xl">
            Timetable
          </h1>
          <p className="mt-0.5 truncate text-xs text-slate-500">
            {summary?.class_name
              ? `${summary.class_name}${summary.section_name ? ` - ${summary.section_name}` : ""}`
              : "Your weekly class schedule."}
          </p>
        </div>

        <span className="w-fit shrink-0 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-semibold text-slate-500">
          {weekly.length} period{weekly.length === 1 ? "" : "s"} / week
        </span>
      </motion.div>

      {/* Error state */}
      {error && (
        <motion.p
          variants={sectionVariants}
          className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-xs text-rose-700"
        >
          {error}
        </motion.p>
      )}

      {/* Today's classes */}
      {!error && todayEntries.length > 0 && (
        <motion.section
          variants={sectionVariants}
          className="rounded-lg border border-slate-200 bg-white"
        >
          <header className="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-3">
            <h2 className="flex items-center gap-2 text-sm font-bold text-slate-900">
              <Clock size={14} className="text-indigo-600" />
              Today's Classes
            </h2>
            <span className="flex items-center gap-1.5 rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-semibold text-indigo-600">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
              {today}
            </span>
          </header>

          <ul className="divide-y divide-slate-50">
            {todayEntries.map((entry) => (
              <li
                key={entry.timetable_id}
                className="flex items-center justify-between px-4 py-2.5"
              >
                <div className="min-w-0">
                  <p className="truncate text-xs font-semibold text-indigo-700">
                    {entry.subject_name ?? entry.subject_code ?? "Subject"}
                  </p>
                  <p className="mt-0.5 truncate text-[10px] text-slate-500">
                    Period {entry.period_number}
                  </p>
                  {entry.teacher_name && (
                    <p className="mt-0.5 flex items-center gap-1 truncate text-[10px] text-slate-400">
                      <User size={9} />
                      {entry.teacher_name}
                    </p>
                  )}
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-[10px] font-medium text-slate-500">
                    {formatTime(entry.start_time)} -{ " " }
                    {formatTime(entry.end_time)}
                  </p>
                  {entry.room && (
                    <p className="mt-0.5 truncate text-[10px] text-slate-400">
                      {entry.room}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </motion.section>
      )}


      {/* Weekly schedule */}
      <motion.section
        variants={sectionVariants}
        className="overflow-hidden rounded-lg border border-slate-200 bg-white"
      >
        <header className="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-3">
          <h2 className="flex items-center gap-2 text-sm font-bold text-slate-900">
            <CalendarDays size={14} className="text-indigo-600" />
            Weekly Schedule
          </h2>
          {summary && (
            <span className="flex items-center gap-1.5 rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-semibold text-indigo-600">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
              {summary.total_weekly_periods} period{summary.total_weekly_periods === 1 ? "" : "s"} / week
            </span>
          )}
        </header>

        {loading ? (
          <div className="flex items-center justify-center gap-2 py-10 text-xs text-slate-400">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-600" />
            Loading your timetable...
          </div>
        ) : !summary && !error ? (
          <p className="px-4 py-8 text-center text-xs text-slate-400">
            We could not find your student profile. Please
            contact the admin.
          </p>
        ) : weekly.length === 0 ? (
          <div className="flex flex-col items-center gap-2 px-4 py-10 text-center">
            <CalendarDays size={28} className="text-slate-300" />
            <p className="text-xs text-slate-400">
              No timetable has been published for your class yet.
            </p>
          </div>
        ) : (
          <div className="min-w-full overflow-x-auto">
            <table className="w-full min-w-[640px] table-fixed text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-xs font-semibold uppercase tracking-wide text-slate-400">
                  <th className="w-12 px-3 py-2 align-top">Period</th>
                  {DAYS.map((day) => (
                    <th key={day} className="px-2 py-2 align-top">
                      <p className="truncate text-[10px]">{day.slice(0, 3)}</p>
                      <p className="text-[10px] font-normal text-slate-400">
                        {dayCounts(day)} period{dayCounts(day) === 1 ? "" : "s"}
                      </p>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {periods.map((period) => {
                  const sample = weekly.find(
                    (entry) => entry.period_number === period
                  );

                  return (
                    <tr
                      key={period}
                      className="border-b border-slate-50 last:border-0"
                    >
                      <td className="px-3 py-2 align-top">
                        <p className="text-xs font-bold text-slate-700">
                          P{period}
                        </p>
                        {sample && (
                          <p className="mt-0.5 whitespace-nowrap text-[10px] font-medium text-slate-400">
                            <Clock size={9} className="mr-1 inline" />
                            {formatTime(sample.start_time)} -{ " " }
                            {formatTime(sample.end_time)}
                          </p>
                        )}
                      </td>

                      {DAYS.map((day) => {
                        const entry = weekly.find(
                          (item) =>
                            item.day_of_week === day &&
                            item.period_number === period
                        );

                        const isToday = day === today;

                        return (
                          <td
                            key={day}
                            className={`px-2 py-1.5 align-top ${
                              isToday ? "bg-indigo-50/40" : ""
                            }`}
                          >
                            {entry ? (
                              <div
                                className={`rounded-lg px-2.5 py-1.5 ${
                                  isToday
                                    ? "bg-indigo-100/80 ring-1 ring-indigo-200"
                                    : "bg-indigo-50"
                                }`}
                              >
                                <p className="truncate text-xs font-semibold text-indigo-700">
                                  {entry.subject_name ?? "Subject"}
                                </p>
                                <p className="mt-0.5 truncate text-[10px] font-medium text-slate-500">
                                  {entry.teacher_name ?? ""}
                                </p>
                                {entry.room && (
                                  <p className="mt-0.5 truncate text-[10px] text-slate-400">
                                    {entry.room}
                                  </p>
                                )}
                              </div>
                            ) : (
                              <span className="text-[10px] text-slate-300">
                                -
                              </span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </motion.section>
    </motion.div>
  );
};

export default StudentTimetablePage;
