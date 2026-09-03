import { Sun, Trash2 } from "lucide-react";

import Card from "../../dashboard/components/Card";
import DataState from "./DataState";

import type {
  Holiday,
  HolidayStatus,
  HolidayType,
} from "../types/academicTypes";


interface HolidaysTableProps {
  holidays: Holiday[];
  loading: boolean;
  error: string | null;
  onDelete: (id: string) => void;
  onReload: () => void;
}

const STATUS_STYLES: Record<HolidayStatus, string> = {
  upcoming: "bg-[#1E3A5F]/10 text-[#1E3A5F]",
  ongoing: "bg-[#166534]/10 text-[#166534]",
  completed: "bg-slate-100 text-slate-500",
  cancelled: "bg-red-50 text-red-600",
};

const TYPE_STYLES: Record<HolidayType, string> = {
  Holiday: "bg-[#1E3A5F]/10 text-[#1E3A5F]",
  Vacation: "bg-[#D4A017]/15 text-[#8A6A0D]",
  Festival: "bg-purple-50 text-purple-600",
  National: "bg-indigo-50 text-indigo-600",
  "School Event": "bg-[#166534]/10 text-[#166534]",
  Other: "bg-slate-100 text-slate-600",
};


const HolidaysTable = ({
  holidays,
  loading,
  error,
  onDelete,
  onReload,
}: HolidaysTableProps) => (
  <Card
    title="Holidays"
    subtitle={`${holidays.length} calendar entries`}
    action={
      !loading && !error && holidays.length > 0 ? (
        <span className="rounded-full bg-[#D4A017]/15 px-3 py-1 text-xs font-semibold text-[#8A6A0D]">
          {holidays.length} Total
        </span>
      ) : undefined
    }
    className="overflow-hidden"
  >
    {loading ? (
      <DataState loading onReload={onReload} />
    ) : error ? (
      <DataState error={error} onReload={onReload} />
    ) : holidays.length === 0 ? (
      <DataState message="No holidays yet. Use 'Add Holiday' to create the first entry." />
    ) : (
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] border-collapse text-sm">
          <thead>
            <tr>
              <th className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Holiday
              </th>
              <th className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Type
              </th>
              <th className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Applies To
              </th>
              <th className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Dates
              </th>
              <th className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Status
              </th>
              <th className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {holidays.map((holiday) => (
              <tr
                key={holiday.id}
                className="border-b border-slate-100 transition last:border-0 hover:bg-slate-50/60"
              >
                <td className="max-w-xs px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Sun size={14} className="shrink-0 text-slate-400" />
                    <div className="min-w-0">
                      <p className="truncate font-medium text-slate-800">
                        {holiday.name}
                      </p>
                      <p className="truncate text-xs text-slate-500">
                        {holiday.occasion ?? holiday.description ?? "—"}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${TYPE_STYLES[holiday.holiday_type] ?? "bg-slate-100 text-slate-600"}`}
                  >
                    {holiday.holiday_type}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-600">
                  {holiday.applies_to}
                </td>
                <td className="px-4 py-3 text-slate-600">
                  <p className="whitespace-nowrap">{holiday.start_date}</p>
                  <p className="whitespace-nowrap text-xs text-slate-400">
                    {holiday.end_date ?? "Single day"}
                  </p>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_STYLES[holiday.status] ?? "bg-slate-100 text-slate-600"}`}
                  >
                    {holiday.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => onDelete(holiday.id)}
                      title="Delete holiday"
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

export default HolidaysTable;