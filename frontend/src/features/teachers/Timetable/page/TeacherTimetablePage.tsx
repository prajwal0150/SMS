import { CalendarDays } from "lucide-react";

import PageHeader from "../../components/PageHeader";
import Card from "../../components/Card";

import { useTeacherProfile } from "../../hooks/useTeacherProfile";


const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const TeacherTimetablePage = () => {
  const { profile, timetable, loading } =
    useTeacherProfile();

  // Period rows sorted by period number.
  const periods = [
    ...new Set(timetable.map((entry) => entry.period)),
  ].sort((a, b) => a - b);

  return (
    <>
      <PageHeader
        title="Timetable"
        description="Your weekly class schedule."
      />

      <Card title="Weekly Schedule" className="overflow-hidden">
        {loading ? (
          <p className="px-4 py-8 text-center text-sm text-slate-500">
            Loading your timetable...
          </p>
        ) : !profile ? (
          <p className="px-4 py-8 text-center text-sm text-slate-500">
            We could not find your teacher profile. Please contact the admin.
          </p>
        ) : timetable.length === 0 ? (
          <div className="flex flex-col items-center gap-2 px-4 py-10 text-center">
            <CalendarDays size={28} className="text-slate-300" />
            <p className="text-sm font-medium text-slate-700">
              No timetable assigned yet.
            </p>
            <p className="text-xs text-slate-500">
              Once the admin adds timetable entries for you, they will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] border-collapse text-sm">
              <thead>
                <tr>
                  <th className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Period
                  </th>
                  {DAYS.map((day) => (
                    <th
                      key={day}
                      className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500"
                    >
                      {day}
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
                      className="border-b border-slate-100 last:border-0"
                    >
                      <td className="px-4 py-3 align-top">
                        <p className="font-semibold text-slate-700">
                          Period {period}
                        </p>
                        {sample && (
                          <p className="text-xs text-slate-400">
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

                        return (
                          <td
                            key={day}
                            className="px-4 py-3 align-top"
                          >
                            {entry ? (
                              <div className="rounded-lg bg-indigo-50 px-3 py-2">
                                <p className="font-semibold text-indigo-700">
                                  {entry.subject}
                                </p>
                                <p className="text-xs text-slate-500">
                                  Class {entry.className}
                                  {entry.section
                                    ? `-${entry.section}`
                                    : ""}
                                </p>
                                {entry.room && (
                                  <p className="mt-0.5 text-xs text-slate-400">
                                    {entry.room}
                                  </p>
                                )}
                              </div>
                            ) : (
                              <span className="text-slate-300">
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
      </Card>
    </>
  );
};

export default TeacherTimetablePage;
