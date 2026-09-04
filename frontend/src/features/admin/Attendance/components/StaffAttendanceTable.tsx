import { ClipboardList, RotateCcw } from "lucide-react";

import type { StaffAttendanceRow } from "../types/attendanceTypes";
import { capitalize, statusBadgeClass } from "../utils/attendanceUtils";

interface StaffAttendanceTableProps {
  rows: StaffAttendanceRow[];
  loading: boolean;
  error: string | null;
  onRetry: () => void;
}

const StaffAttendanceTable = ({
  rows,
  loading,
  error,
  onRetry,
}: StaffAttendanceTableProps) => (
  <section className="overflow-hidden rounded-lg border border-slate-200 bg-white">
    <header className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
      <div>
        <h2 className="text-base font-semibold text-slate-900">
          Staff Attendance
        </h2>
        <p className="mt-0.5 text-xs text-slate-500">
          {loading
            ? "Loading records..."
            : `${rows.length} record${rows.length === 1 ? "" : "s"} for the selected day`}
        </p>
      </div>
      <button
        type="button"
        onClick={onRetry}
        className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:border-indigo-300 hover:text-indigo-600"
      >
        <RotateCcw size={13} />
        Refresh
      </button>
    </header>

    {error ? (
      <div className="p-10 text-center">
        <p className="text-sm font-medium text-rose-600">{error}</p>
        <button
          type="button"
          onClick={onRetry}
          className="mt-3 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:border-indigo-300 hover:text-indigo-600"
        >
          Try again
        </button>
      </div>
    ) : loading ? (
      <div className="flex items-center justify-center gap-3 p-12 text-sm text-slate-500">
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-600" />
        Loading attendance...
      </div>
    ) : rows.length === 0 ? (
      <div className="p-12 text-center">
        <ClipboardList size={28} className="mx-auto text-slate-300" />
        <p className="mt-3 text-sm font-semibold text-slate-700">
          No staff attendance recorded for this day
        </p>
        <p className="mt-1 text-xs text-slate-500">
          Adjust the filters or pick another date to see records.
        </p>
      </div>
    ) : (
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-6 py-3 font-medium">Teacher</th>
              <th className="px-4 py-3 font-medium">Subject</th>
              <th className="px-4 py-3 font-medium">Qualification</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-6 py-3 font-medium">Remarks</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((row) => (
              <tr key={row.id} className="transition hover:bg-slate-50/70">
                <td className="px-6 py-3">
                  <p className="font-medium text-slate-900">
                    {row.teacher_name}
                  </p>
                  <p className="text-xs text-slate-400">{row.email ?? "—"}</p>
                </td>
                <td className="px-4 py-3 text-slate-600">
                  {row.primary_subject ?? "—"}
                </td>
                <td className="px-4 py-3 text-slate-600">
                  {row.qualification ?? "—"}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      statusBadgeClass[row.status] ??
                      "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {capitalize(row.status)}
                  </span>
                </td>
                <td
                  className="max-w-[200px] truncate px-6 py-3 text-slate-500"
                  title={row.remarks ?? undefined}
                >
                  {row.remarks ?? "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </section>
);

export default StaffAttendanceTable;