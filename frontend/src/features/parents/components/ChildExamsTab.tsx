import { CalendarDays } from "lucide-react";

import DataStates from "../components/DataStates";
import StatusBadge from "../components/StatusBadge";
import useChildSection from "../hooks/useChildSection";
import { fetchChildExams } from "../services/parentService";
import { formatDate, formatTime } from "../utils/parentUtils";

const EXAM_TONES: Record<string, string> = {
  upcoming: "blue",
  ongoing: "amber",
  completed: "slate",
  draft: "slate",
  cancelled: "red",
};

interface ChildExamsTabProps {
  studentId: string;
}

const ChildExamsTab = ({ studentId }: ChildExamsTabProps) => {
  const { loading, error, rows } = useChildSection(
    studentId,
    fetchChildExams
  );

  return (
    <div className="space-y-4">
      <DataStates
        isLoading={loading}
        error={error}
        empty={
          rows.length === 0
            ? "No exam schedule has been published for this class yet."
            : undefined
        }
      />

      {!loading && !error && rows.length > 0 && (
        <section className="overflow-hidden rounded-lg border border-slate-200 bg-white">
          <table className="min-w-full divide-y divide-slate-100">
            <thead>
              <tr className="bg-slate-50 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                <th className="px-4 py-3">Exam</th>
                <th className="px-4 py-3">Subject</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Time</th>
                <th className="px-4 py-3">Room</th>
                <th className="px-4 py-3">Max</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((exam) => (
                <tr key={exam.schedule_id} className="text-sm text-slate-700">
                  <td className="px-4 py-2.5">
                    <p className="font-semibold text-slate-800">
                      {exam.exam_name}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {exam.exam_type}
                    </p>
                  </td>
                  <td className="px-4 py-2.5">{exam.subject}</td>
                  <td className="whitespace-nowrap px-4 py-2.5">
                    {formatDate(exam.exam_date)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-2.5">
                    {exam.start_time
                      ? `${formatTime(exam.start_time)} - ${formatTime(exam.end_time)}`
                      : "—"}
                  </td>
                  <td className="px-4 py-2.5">{exam.room ?? "—"}</td>
                  <td className="px-4 py-2.5">
                    {exam.max_marks ?? "—"}
                  </td>
                  <td className="px-4 py-2.5">
                    <StatusBadge
                      label={
                        exam.status === "ongoing"
                          ? "Ongoing"
                          : (exam.status ?? "—")
                      }
                      tone={EXAM_TONES[exam.status] ?? "slate"}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {rows.some((exam) => exam.instructions) && (
            <div className="border-t border-slate-100 px-6 py-4 text-xs text-slate-500">
              {rows
                .filter((exam) => exam.instructions)
                .map((exam) => (
                  <p key={exam.schedule_id}>
                    <span className="font-bold text-slate-700">
                      {exam.subject}:
                    </span>{" "}
                    {exam.instructions}
                  </p>
                ))}
            </div>
          )}
        </section>
      )}

      {!loading && !error && rows.length > 0 && (
        <p className="flex items-center gap-1.5 px-1 text-xs text-slate-400">
          <CalendarDays size={13} />
          Schedule shown for {rows[0]?.class_name ?? "your child's class"}.
        </p>
      )}
    </div>
  );
};

export default ChildExamsTab;