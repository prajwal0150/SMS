import DataStates from "../components/DataStates";
import StatusBadge from "../components/StatusBadge";
import useChildSection from "../hooks/useChildSection";
import { fetchChildAttendance } from "../services/parentService";
import { formatDate } from "../utils/parentUtils";

import type { ParentAttendanceStatus } from "../types/parentTypes";

const ATTENDANCE_TONES: Record<ParentAttendanceStatus, string> = {
  present: "green",
  absent: "red",
  late: "amber",
  leave: "blue",
};

const ATTENDANCE_LABELS: Record<ParentAttendanceStatus, string> = {
  present: "Present",
  absent: "Absent",
  late: "Late",
  leave: "Leave",
};

interface ChildAttendanceTabProps {
  studentId: string;
}

const ChildAttendanceTab = ({
  studentId,
}: ChildAttendanceTabProps) => {
  const { loading, error, rows } = useChildSection(
    studentId,
    fetchChildAttendance
  );

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      <table className="min-w-full divide-y divide-slate-100">
        <thead>
          <tr className="bg-slate-50 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            <th className="px-4 py-3">Date</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Subject</th>
            <th className="px-4 py-3">Remarks</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.slice(0, 60).map((row) => (
            <tr
              key={row.id}
              className="text-sm text-slate-700 hover:bg-slate-50"
            >
              <td className="whitespace-nowrap px-4 py-2.5">
                {formatDate(row.attendance_date)}
              </td>
              <td className="whitespace-nowrap px-4 py-2.5">
                <StatusBadge
                  label={
                    ATTENDANCE_LABELS[row.status] ?? row.status
                  }
                  tone={ATTENDANCE_TONES[row.status] ?? "slate"}
                />
              </td>
              <td className="px-4 py-2.5">
                {row.subject_name ?? "Daily attendance"}
              </td>
              <td className="px-4 py-2.5 text-xs text-slate-400">
                {row.remarks || "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="px-4 py-5">
        <DataStates
          isLoading={loading}
          error={error}
          empty={
            rows.length === 0
              ? "No attendance has been recorded for this child yet."
              : undefined
          }
        />
      </div>

      {!loading && !error && rows.length > 60 && (
        <p className="px-4 py-2 text-center text-[11px] text-slate-400">
          Showing the most recent 60 records of {rows.length}.
        </p>
      )}
    </div>
  );
};

export default ChildAttendanceTab;