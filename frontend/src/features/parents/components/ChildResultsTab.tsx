import { Award, FileCheck2 } from "lucide-react";

import DataStates from "../components/DataStates";
import StatusBadge from "../components/StatusBadge";
import useChildSection from "../hooks/useChildSection";
import {
  fetchChildMarks,
  fetchChildResults,
} from "../services/parentService";
import { formatDate } from "../utils/parentUtils";

interface ChildResultsTabProps {
  studentId: string;
}

const PASS_TONE: Record<string, string> = {
  pass: "green",
  fail: "red",
  absent: "amber",
  incomplete: "slate",
};

const ChildResultsTab = ({ studentId }: ChildResultsTabProps) => {
  const resultsState = useChildSection(studentId, fetchChildResults);
  const marksState = useChildSection(studentId, fetchChildMarks);

  const marksByExam = new Map<string, typeof marksState.rows>();

  marksState.rows.forEach((mark) => {
    const existing = marksByExam.get(mark.exam_id) ?? [];

    existing.push(mark);
    marksByExam.set(mark.exam_id, existing);
  });

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-slate-200 bg-white">
        <header className="flex items-center gap-2 border-b border-slate-100 px-6 py-4">
          <Award size={16} className="text-indigo-500" />
          <h2 className="text-base font-semibold text-slate-900">
            Published exam results
          </h2>
        </header>

        <div className="px-6 py-5">
          <DataStates
            isLoading={resultsState.loading}
            error={resultsState.error}
            empty={
              resultsState.rows.length === 0
                ? "No published results yet. Results appear here once the school publishes them."
                : undefined
            }
          />
        </div>

        {!resultsState.loading &&
          !resultsState.error &&
          resultsState.rows.length > 0 && (
            <div className="divide-y divide-slate-100">
              {resultsState.rows.map((result) => (
                <article
                  key={result.id}
                  className="px-6 py-4 hover:bg-slate-50"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="text-sm font-bold text-slate-900">
                        {result.exam_name}
                      </p>
                      <p className="mt-0.5 text-xs text-slate-500">
                        {result.exam_type} ·{" "}
                        {formatDate(result.start_date)} ·{" "}
                        {result.academic_year}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-slate-900">
                        {result.percentage}%
                      </p>
                      <p className="text-[11px] text-slate-400">
                        {result.obtained_marks}/{result.total_marks} ·{" "}
                        Grade {result.grade ?? "—"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <StatusBadge
                      label={
                        result.result_status === "pass"
                          ? "Passed"
                          : (result.result_status ?? "—")
                      }
                      tone={
                        PASS_TONE[result.result_status] ?? "slate"
                      }
                    />
                    <span className="inline-flex items-center gap-1 text-[11px] text-slate-400">
                      <FileCheck2 size={12} />
                      Published{" "}
                      {formatDate(result.published_at?.slice(0, 10))}
                    </span>
                  </div>

                  {marksByExam.get(result.exam_id)?.length ? (
                    <table className="mt-4 min-w-full divide-y divide-slate-100">
                      <thead>
                        <tr className="bg-slate-50 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                          <th className="px-3 py-2">Subject</th>
                          <th className="px-3 py-2">Marks</th>
                          <th className="px-3 py-2">Grade</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {marksByExam
                          .get(result.exam_id)!
                          .map((mark) => (
                            <tr
                              key={mark.id}
                              className="text-sm text-slate-700"
                            >
                              <td className="px-3 py-2">
                                {mark.subject_name ?? "—"}
                              </td>
                              <td className="px-3 py-2">
                                {mark.marks_obtained}/{mark.total_marks}
                              </td>
                              <td className="px-3 py-2">
                                {mark.grade ?? "—"}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  ) : null}
                </article>
              ))}
            </div>
          )}
      </section>
<section className="rounded-lg border border-slate-200 bg-white">
        <header className="flex items-center gap-2 border-b border-slate-100 px-6 py-4">
          <FileCheck2 size={16} className="text-slate-400" />
          <h2 className="text-base font-semibold text-slate-900">
            All subject marks
          </h2>
        </header>

        <table className="min-w-full divide-y divide-slate-100">
          <thead>
            <tr className="bg-slate-50 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500">
              <th className="px-4 py-3">Exam</th>
              <th className="px-4 py-3">Subject</th>
              <th className="px-4 py-3">Marks</th>
              <th className="px-4 py-3">Grade</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {marksState.rows.map((mark) => (
              <tr key={mark.id} className="text-sm text-slate-700">
                <td className="px-4 py-2.5">{mark.exam_name}</td>
                <td className="px-4 py-2.5">
                  {mark.subject_name ?? "—"}
                  {mark.subject_code
                    ? ` (${mark.subject_code})`
                    : ""}
                </td>
                <td className="px-4 py-2.5">
                  {mark.marks_obtained}/{mark.total_marks}
                </td>
                <td className="px-4 py-2.5">{mark.grade ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="px-4 py-5">
          <DataStates
            isLoading={marksState.loading}
            error={marksState.error}
            empty={
              marksState.rows.length === 0
                ? "No subject marks have been entered yet."
                : undefined
            }
          />
        </div>
      </section>
    </div>
  );
};

export default ChildResultsTab;