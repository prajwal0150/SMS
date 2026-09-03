import { CalendarClock, Trash2 } from "lucide-react";

import Card from "../../dashboard/components/Card";
import DataState from "./DataState";

import type { DayOfWeek, TimetableEntry } from "../types/academicTypes";


interface TimetableTableProps {
  entries: TimetableEntry[];
  loading: boolean;
  error: string | null;
  onDelete: (id: string) => void;
  onReload: () => void;
}

const DAY_STYLES: Record<DayOfWeek, string> = {
  Monday: "bg-slate-100 text-slate-600",
  Tuesday: "bg-indigo-50 text-indigo-600",
  Wednesday: "bg-[#1E3A5F]/10 text-[#1E3A5F]",
  Thursday: "bg-[#D4A017]/15 text-[#8A6A0D]",
  Friday: "bg-emerald-50 text-emerald-700",
  Saturday: "bg-purple-50 text-purple-600",
  Sunday: "bg-red-50 text-red-600",
};


const TimetableTable = ({
  entries,
  loading,
  error,
  onDelete,
  onReload,
}: TimetableTableProps) => (
  <Card
    title="Timetable"
    subtitle={`${entries.length} weekly periods`}
    action={
      !loading && !error && entries.length > 0 ? (
        <span className="rounded-full bg-[#1E3A5F]/10 px-3 py-1 text-xs font-semibold text-[#1E3A5F]">
          {entries.length} Periods
        </span>
      ) : undefined
    }
    className="overflow-hidden"
  >
    {loading ? (
      <DataState loading onReload={onReload} />
    ) : error ? (
      <DataState error={error} onReload={onReload} />
    ) : entries.length === 0 ? (
      <DataState message="No timetable entries yet. Use 'Add Timetable' to create the first period." />
    ) : (
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] border-collapse text-sm">
          <thead>
            <tr>
              <th className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Class
              </th>
              <th className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Day
              </th>
              <th className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Period
              </th>
              <th className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Time
              </th>
              <th className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Subject / Teacher
              </th>
              <th className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <tr
                key={entry.id}
                className="border-b border-slate-100 transition last:border-0 hover:bg-slate-50/60"
              >
                <td className="px-4 py-3">
                  <span className="font-medium text-slate-700">
                    {entry.class_name}
                  </span>
                  <span className="ml-1 text-xs text-slate-400">
                    {entry.section ?? ""}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${DAY_STYLES[entry.day_of_week] ?? "bg-slate-100 text-slate-600"}`}
                  >
                    {entry.day_of_week}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-md bg-slate-100 text-xs font-bold text-slate-600">
                    {entry.period_number}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-600">
                  <p className="whitespace-nowrap">{entry.start_time}</p>
                  <p className="whitespace-nowrap text-xs text-slate-400">
                    {entry.end_time}
                  </p>
                </td>
                <td className="max-w-xs px-4 py-3">
                  <div className="flex items-center gap-2">
                    <CalendarClock size={14} className="shrink-0 text-slate-400" />
                    <div className="min-w-0">
                      <p className="truncate font-medium text-slate-800">
                        {entry.subject}
                      </p>
                      <p className="truncate text-xs text-slate-500">
                        {entry.teacher_name ?? "—"}
                        {entry.room ? ` • ${entry.room}` : ""}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => onDelete(entry.id)}
                      title="Delete period"
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </Card>
);

export default TimetableTable;