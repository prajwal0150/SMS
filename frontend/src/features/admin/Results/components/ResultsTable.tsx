import { useState } from "react";
import { ChevronLeft, ChevronRight, Eye, Inbox } from "lucide-react";

import type {
  ResultSummaryRow,
  WorkflowStatus,
} from "../types/resultTypes";
import {
  gradeBadgeClass,
  resultStatusBadgeClass,
  resultStatusLabel,
  workflowBadgeClass,
  workflowLabel,
} from "../utils/resultUtils";

interface ResultsTableProps {
  rows: ResultSummaryRow[];
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  onView: (row: ResultSummaryRow) => void;
  onRowClick: (row: ResultSummaryRow) => void;
}

const PAGE_SIZES = [10, 25, 50];

const ResultsTable = ({
  rows,
  loading,
  error,
  onRetry,
  onView,
  onRowClick,
}: ResultsTableProps) => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));

  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * pageSize;
  const pageRows = rows.slice(start, start + pageSize);

  const goToPage = (next: number) => {
    setPage(Math.min(Math.max(1, next), totalPages));
  };

  const pageButtons: number[] = [];
  for (
    let p = Math.max(1, safePage - 2);
    p <= Math.min(totalPages, safePage + 2);
    p += 1
  ) {
    pageButtons.push(p);
  }

  if (error) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-10 text-center">
        <p className="text-sm font-medium text-rose-600">{error}</p>
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white">
      <header className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
        <h2 className="text-sm font-semibold text-slate-800">
          Results List{" "}
          <span className="font-normal text-slate-400">({rows.length})</span>
        </h2>
        <label className="flex items-center gap-2 text-xs text-slate-500">
          Rows per page
          <select
            value={pageSize}
            onChange={(event) => {
              setPageSize(Number(event.target.value));
              setPage(1);
            }}
            className="rounded-md border border-slate-200 px-2 py-1 text-xs outline-none focus:border-indigo-500"
          >
            {PAGE_SIZES.map((size) => (
              <option key={size} value={size}>
                {size} / page
              </option>
            ))}
          </select>
        </label>
      </header>

      {loading ? (
        <div className="space-y-3 p-6">
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className="h-10 animate-pulse rounded-md bg-slate-100"
            />
          ))}
        </div>
      ) : rows.length === 0 ? (
        <div className="flex flex-col items-center gap-3 p-12 text-center">
          <Inbox size={32} className="text-slate-300" />
          <p className="text-sm text-slate-400">
            No results found for the selected filters. Results appear here once
            teachers submit marks for review.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/60 text-xs font-semibold uppercase tracking-wide text-slate-500">
                <th className="px-6 py-3">Roll No</th>
                <th className="px-6 py-3">Student Name</th>
                <th className="px-6 py-3">Class - Section</th>
                <th className="px-6 py-3">Total Marks</th>
                <th className="px-6 py-3">Obtained</th>
                <th className="px-6 py-3">Percentage</th>
                <th className="px-6 py-3">Grade</th>
                <th className="px-6 py-3">Result Status</th>
                <th className="px-6 py-3">Workflow Status</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pageRows.map((row) => (
                <tr
                  key={row.result_id}
                  onClick={() => onRowClick(row)}
                  className="cursor-pointer border-b border-slate-50 transition last:border-0 hover:bg-indigo-50/40"
                >
                  <td className="px-6 py-3 font-medium text-slate-500">
                    {row.roll_number ?? "-"}
                  </td>
                  <td className="px-6 py-3">
                    <p className="font-semibold text-slate-900">
                      {row.student_name}
                    </p>
                    <p className="text-xs text-slate-400">
                      {row.admission_number ?? "-"}
                    </p>
                  </td>
                  <td className="px-6 py-3 text-slate-600">
                    {row.class_name ?? "-"} - {row.section_name ?? "-"}
                  </td>
                  <td className="px-6 py-3 text-slate-600">
                    {row.total_marks || "-"}
                  </td>
                  <td className="px-6 py-3 font-semibold text-slate-800">
                    {row.obtained_marks || "-"}
                  </td>
                  <td className="px-6 py-3 text-slate-600">
                    {row.total_marks > 0
                      ? `${Number(row.percentage ?? 0).toFixed(2)}%`
                      : "-"}
                  </td>
                  <td className="px-6 py-3">
                    {row.grade ? (
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-bold ${gradeBadgeClass(row.grade)}`}
                      >
                        {row.grade}
                      </span>
                    ) : (
                      <span className="text-xs text-slate-300">-</span>
                    )}
                  </td>
                  <td className="px-6 py-3">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-bold ${resultStatusBadgeClass[row.result_status] ?? "bg-slate-100 text-slate-500"}`}
                    >
                      {resultStatusLabel[row.result_status] ?? row.result_status}
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-bold ${workflowBadgeClass[row.workflow_status as WorkflowStatus] ?? "bg-slate-100 text-slate-500"}`}
                    >
                      {workflowLabel[row.workflow_status] ??
                        row.workflow_status}
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    <button
                      type="button"
                      title="View result details"
                      onClick={(event) => {
                        event.stopPropagation();
                        onView(row);
                      }}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-indigo-300 hover:text-indigo-600"
                    >
                      <Eye size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}


      {rows.length > 0 && (
        <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-6 py-3 text-xs text-slate-500">
          <span>
            Showing {start + 1} to {Math.min(start + pageSize, rows.length)} of{" "}
            {rows.length} results
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => goToPage(safePage - 1)}
              disabled={safePage === 1}
              className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft size={14} />
            </button>
            {pageButtons.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => goToPage(p)}
                className={`h-8 min-w-8 rounded-md border px-2 transition ${
                  p === safePage
                    ? "border-indigo-600 bg-indigo-600 text-white"
                    : "border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                {p}
              </button>
            ))}
            {totalPages > safePage + 2 && (
              <span className="px-1 text-slate-400">...</span>
            )}
            <button
              type="button"
              onClick={() => goToPage(safePage + 1)}
              disabled={safePage === totalPages}
              className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </footer>
      )}
    </div>
  );
};

export default ResultsTable;

