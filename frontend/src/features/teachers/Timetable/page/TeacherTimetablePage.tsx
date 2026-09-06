import { motion } from "motion/react";
import type { Variants } from "motion/react";
import { CalendarDays, Clock } from "lucide-react";

import { useTeacherProfile } from "../../hooks/useTeacherProfile";

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

const TeacherTimetablePage = () => {
  const { profile, timetable, loading } =
    useTeacherProfile();

  const today = ALL_DAYS[new Date().getDay()];

  // Period rows sorted by period number.
  const periods = [
    ...new Set(timetable.map((entry) => entry.period)),
  ].sort((a, b) => a - b);

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
            Timetable
          </h1>
          <p className="mt-0.5 text-xs text-slate-500">
            Your weekly class schedule.
          </p>
        </div>

        <span className="w-fit shrink-0 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-semibold text-slate-500">
          {timetable.length}{" "}
          {timetable.length === 1 ? "period" : "periods"} / week
        </span>
      </motion.div>

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
          <span className="flex items-center gap-1.5 rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-semibold text-indigo-600">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
            Today: {today}
          </span>
        </header>

        {loading ? (
          <div className="flex items-center justify-center gap-2 py-10 text-xs text-slate-400">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-600" />
            Loading your timetable...
          </div>
        ) : !profile ? (
          <p className="px-4 py-8 text-center text-xs text-slate-400">
            We could not find your teacher profile. Please
            contact the admin.
          </p>
        ) : timetable.length === 0 ? (
          <div className="flex flex-col items-center gap-2 px-4 py-10 text-center">
            <CalendarDays size={26} className="text-slate-300" />
            <p className="text-sm font-medium text-slate-700">
              No timetable assigned yet.
            </p>
            <p className="text-xs text-slate-400">
              Once the admin adds timetable entries for you,
              they will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[840px] border-collapse text-xs">
              <thead>
                <tr>
                  <th className="border-b border-slate-200 bg-slate-50 px-3 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    Period
                  </th>
                  {DAYS.map((day) => (
                    <th
                      key={day}
                      className={`border-b border-slate-200 px-3 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider ${
                        day === today
                          ? "bg-indigo-50/70 text-indigo-600"
                          : "bg-slate-50 text-slate-400"
                      }`}
                    >
                      {day.slice(0, 3)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {periods.map((period) => {
                  const sample = timetable.find(
                    (entry) => entry.period === period
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
                            {sample.startTime.slice(0, 5)} -{" "}
                            {sample.endTime.slice(0, 5)}
                          </p>
                        )}
                      </td>

                      {DAYS.map((day) => {
                        const entry = timetable.find(
                          (item) =>
                            item.day === day &&
                            item.period === period
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
                                  {entry.subject}
                                </p>
                                <p className="mt-0.5 truncate text-[10px] font-medium text-slate-500">
                                  {entry.className}
                                  {entry.section
                                    ? ` - ${entry.section}`
                                    : ""}
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

export default TeacherTimetablePage;

