import { CalendarDays } from "lucide-react";

import DataStates from "../components/DataStates";
import useChildSection from "../hooks/useChildSection";
import { fetchChildTimetable } from "../services/parentService";
import { DAY_ORDER, formatTime } from "../utils/parentUtils";

import type { ParentTimetableRow } from "../types/parentTypes";

interface ChildTimetableTabProps {
  studentId: string;
}

const ChildTimetableTab = ({ studentId }: ChildTimetableTabProps) => {
  const { loading, error, rows } = useChildSection(
    studentId,
    fetchChildTimetable
  );

  const byDay = (day: string): ParentTimetableRow[] =>
    rows
      .filter((row) => row.day_of_week === day)
      .sort((a, b) => a.period_number - b.period_number);

  return (
    <div className="space-y-4">
      <DataStates
        isLoading={loading}
        error={error}
        empty={
          rows.length === 0
            ? "No timetable has been published for this class yet."
            : undefined
        }
      />

      {!loading && !error && rows.length > 0 && (
        <div className="grid gap-4 lg:grid-cols-2">
          {DAY_ORDER.map((day) => {
            const periods = byDay(day);

            if (periods.length === 0) {
              return null;
            }

            return (
              <section
                key={day}
                className="overflow-hidden rounded-lg border border-slate-200 bg-white"
              >
                <header className="flex items-center gap-2 border-b border-slate-100 bg-slate-50 px-4 py-3">
                  <CalendarDays size={15} className="text-slate-400" />
                  <h3 className="text-sm font-bold text-slate-900">
                    {day}
                  </h3>
                  <span className="ml-auto text-[11px] text-slate-400">
                    {periods.length} periods
                  </span>
                </header>

                <table className="min-w-full divide-y divide-slate-100">
                  <tbody className="divide-y divide-slate-100">
                    {periods.map((period) => (
                      <tr key={period.timetable_id} className="text-sm">
                        <td className="whitespace-nowrap px-4 py-2.5 text-slate-400">
                          <span className="font-semibold text-slate-600">
                            {period.period_number}
                          </span>
                          <span className="block text-[11px]">
                            {formatTime(period.start_time)}
                          </span>
                        </td>
                        <td className="px-4 py-2.5">
                          <p className="font-semibold text-slate-800">
                            {period.subject}
                          </p>
                          <p className="text-[11px] text-slate-400">
                            {[period.teacher_name, period.room]
                              .filter(Boolean)
                              .join(" · ") || "—"}
                          </p>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ChildTimetableTab;