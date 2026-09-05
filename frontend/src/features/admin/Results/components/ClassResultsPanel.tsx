import { useCallback, useEffect, useState } from "react";
import {
  BarChart3,
  Download,
  Loader2,
  RefreshCw,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import toast from "react-hot-toast";

import type {
  ClassResultSummaryRow,
  ResultFilters,
} from "../types/resultTypes";
import {
  fetchClassResultSummaries,
} from "../services/resultServices";
import {
  buildClassReportPayload,
} from "../utils/resultReports";
import { exportResultsPdf } from "../utils/resultPdf";

interface ClassResultsPanelProps {
  filters: Pick<
    ResultFilters,
    "academicYear" | "examId" | "classId" | "sectionId"
  >;
}

const fmt = (value: number | null | undefined): string =>
  value === null || value === undefined ? "-" : Number(value).toFixed(2);

const passRateTint = (value: number): string => {
  if (value >= 75) return "bg-emerald-50 text-emerald-600";
  if (value >= 50) return "bg-amber-50 text-amber-600";
  return "bg-rose-50 text-rose-600";
};

const ClassResultsPanel = ({ filters }: ClassResultsPanelProps) => {
  const [rows, setRows] = useState<ClassResultSummaryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchClassResultSummaries({
        academicYear: filters.academicYear,
        examId: filters.examId,
        classId: filters.classId,
        sectionId: filters.sectionId,
      });
      setRows(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load class result summaries."
      );
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [
    filters.academicYear,
    filters.examId,
    filters.classId,
    filters.sectionId,
  ]);

  useEffect(() => {
    void load();
  }, [load]);

  const handleExport = () => {
    if (!filters.examId) {
      toast.error("Select a specific exam in the filters to export the class report.");
      return;
    }

    if (rows.length === 0) {
      toast.error("No class summaries to export for the selected filters.");
      return;
    }

    const scopeLabel = [
      rows[0]?.exam_name ?? "All exams",
      filters.classId ? (rows[0]?.class_name ?? "Class") : "",
      filters.sectionId ? rows[0]?.section_name ?? "" : "",
    ]
      .filter(Boolean)
      .join(" | ");

    exportResultsPdf(buildClassReportPayload(rows, scopeLabel));
    toast.success("Class results report PDF downloaded.");
  };

  const totalStudents = rows.reduce(
    (sum, row) => sum + Number(row.total_students),
    0
  );
  const passed = rows.reduce(
    (sum, row) => sum + Number(row.passed_students),
    0
  );
  const overallPassRate =
    totalStudents > 0 ? Math.round((passed / totalStudents) * 10000) / 100 : 0;

  return (
    <section
      id="class-results-panel"
      className="rounded-lg border border-slate-200 bg-white"
    >
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-6 py-4">
        <div>
          <h2 className="flex items-center gap-2 text-sm font-bold text-slate-800">
            <BarChart3 size={16} className="text-indigo-600" />
            Overall / Class Reports
          </h2>
          <p className="mt-0.5 text-xs text-slate-500">
            Per exam + class + section aggregates (respects the filters above)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => void load()}
            disabled={loading}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:border-indigo-300 hover:text-indigo-600 disabled:opacity-50"
          >
            <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
          <button
            type="button"
            onClick={handleExport}
            disabled={loading || rows.length === 0}
            className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Download size={13} />
            Export PDF
          </button>
        </div>
      </header>
      {loading ? (
        <div className="space-y-3 p-6">
          {[...Array(4)].map((_, index) => (
            <div
              key={index}
              className="h-9 animate-pulse rounded-md bg-slate-100"
            />
          ))}
        </div>
      ) : error ? (
        <div className="p-10 text-center">
          <p className="text-sm font-medium text-rose-600">{error}</p>
          <button
            type="button"
            onClick={() => void load()}
            className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            Retry
          </button>
        </div>
      ) : rows.length === 0 ? (
        <div className="p-12 text-center text-sm text-slate-400">
          No class summaries match the selected filters. They appear once
          results are published.
        </div>
      ) : (
        <>
          {/* Overall strip */}
          <div className="grid gap-3 border-b border-slate-100 bg-slate-50/60 px-6 py-4 sm:grid-cols-2 xl:grid-cols-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                Groups
              </p>
              <p className="mt-0.5 text-lg font-bold text-slate-800">
                {rows.length}
              </p>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                Students
              </p>
              <p className="mt-0.5 text-lg font-bold text-slate-800">
                {totalStudents}
              </p>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                Passed
              </p>
              <p className="mt-0.5 text-lg font-bold text-emerald-600">
                {passed}
              </p>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                Overall Pass Rate
              </p>
              <p
                className={`mt-0.5 inline-flex rounded-full px-2 py-0.5 text-lg font-bold ${passRateTint(overallPassRate)}`}
              >
                {overallPassRate}%
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                  <th className="px-4 py-2.5">Exam</th>
                  <th className="px-4 py-2.5">Class - Section</th>
                  <th className="px-4 py-2.5 text-center">Students</th>
                  <th className="px-4 py-2.5 text-center">Passed</th>
                  <th className="px-4 py-2.5 text-center">Failed</th>
                  <th className="px-4 py-2.5 text-center">Absent</th>
                  <th className="px-4 py-2.5 text-center">Incomplete</th>
                  <th className="px-4 py-2.5 text-center">Avg %</th>
                  <th className="px-4 py-2.5 text-center">Highest</th>
                  <th className="px-4 py-2.5 text-center">Lowest</th>
                  <th className="px-4 py-2.5 text-center">Pass %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {rows.map((row) => (
                  <tr key={`${row.exam_id}-${row.class_id}-${row.section_id}`}>
                    <td className="px-4 py-2.5 font-medium text-slate-800">
                      {row.exam_name}
                    </td>
                    <td className="px-4 py-2.5 text-slate-600">
                      {row.class_name ?? "-"} - {row.section_name ?? "-"}
                    </td>
                    <td className="px-4 py-2.5 text-center text-slate-700">
                      {Number(row.total_students)}
                    </td>
                    <td className="px-4 py-2.5 text-center font-medium text-emerald-600">
                      {Number(row.passed_students)}
                    </td>
                    <td className="px-4 py-2.5 text-center text-slate-500">
                      {Number(row.failed_students)}
                    </td>
                    <td className="px-4 py-2.5 text-center text-slate-500">
                      {Number(row.absent_students)}
                    </td>
                    <td className="px-4 py-2.5 text-center text-slate-500">
                      {Number(row.incomplete_students)}
                    </td>
                    <td className="px-4 py-2.5 text-center text-slate-700">
                      {fmt(row.average_percentage)}
                    </td>
                    <td className="px-4 py-2.5 text-center text-slate-700">
                      <span className="inline-flex items-center gap-1">
                        <TrendingUp size={12} className="text-emerald-500" />
                        {fmt(row.highest_percentage)}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-center text-slate-700">
                      <span className="inline-flex items-center gap-1">
                        <TrendingDown size={12} className="text-rose-400" />
                        {fmt(row.lowest_percentage)}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-center">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-bold ${passRateTint(Number(row.pass_percentage))}`}
                      >
                        {Number(row.pass_percentage).toFixed(2)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {rows.length > 0 && !filters.examId && (
            <p className="border-t border-slate-100 px-6 py-3 text-xs text-slate-400">
              Tip: pick a specific exam in the filters to narrow this report
              and enable the PDF export.
            </p>
          )}
        </>
      )}
    </section>
  );
};

export default ClassResultsPanel;
