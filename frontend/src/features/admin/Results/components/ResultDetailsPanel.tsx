import { useState } from "react";
import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  FileText,
  Loader2,
  Printer,
  X,
  XCircle,
} from "lucide-react";

import type {
  ResultReportRow,
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

interface ResultDetailsPanelProps {
  summary: ResultSummaryRow | null;
  details: ResultReportRow[];
  loading: boolean;
  actionBusy: boolean;
  onClose: () => void;
  onApprove: () => void;
  onReject: (remark: string) => void;
  onPublish: () => void;
  onDownloadPdf: () => void;
  onPrint: () => void;
}

const InfoRow = ({
  label,
  value,
}: {
  label: string;
  value: string;
}) => (
  <div className="flex items-baseline justify-between gap-3 py-1">
    <span className="text-xs text-slate-400">{label}</span>
    <span className="text-right text-xs font-medium text-slate-700">
      {value}
    </span>
  </div>
);

const ResultDetailsPanel = ({
  summary,
  details,
  loading,
  actionBusy,
  onClose,
  onApprove,
  onReject,
  onPublish,
  onDownloadPdf,
  onPrint,
}: ResultDetailsPanelProps) => {
  const [rejecting, setRejecting] = useState(false);
  const [remark, setRemark] = useState("");

  const workflow: WorkflowStatus | null = summary?.workflow_status ?? null;
  const canReview = workflow === "submitted";
  const canPublish = workflow === "reviewed";

  const handleReject = () => {
    onReject(remark.trim());
    setRemark("");
    setRejecting(false);
  };

  return (
    <aside className="flex max-h-[calc(100vh-13rem)] flex-col overflow-hidden rounded-lg border border-slate-200 bg-white">
      <header className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
        <h2 className="flex items-center gap-2 text-sm font-bold text-slate-800">
          <FileText size={16} className="text-indigo-600" />
          Result Details
        </h2>
        <button
          type="button"
          onClick={onClose}
          title="Close panel"
          className="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
        >
          <X size={15} />
        </button>
      </header>

      {!summary ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-2 p-10 text-center">
          <FileText size={30} className="text-slate-200" />
          <p className="text-xs text-slate-400">
            Select a result from the list to view the full mark sheet and
            review actions.
          </p>
        </div>
      ) : (
        <div className="flex-1 space-y-5 overflow-y-auto p-5">
          {/* Student header */}
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-sm font-bold text-white">
              {summary.student_name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-slate-900">
                {summary.student_name}
              </p>
              <p className="truncate text-xs text-slate-400">
                {summary.admission_number ?? "-"} · Roll {summary.roll_number ?? "-"}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-bold ${resultStatusBadgeClass[summary.result_status] ?? "bg-slate-100 text-slate-500"}`}
            >
              {resultStatusLabel[summary.result_status] ?? summary.result_status}
            </span>
            {summary.grade && (
              <span
                className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-bold ${gradeBadgeClass(summary.grade)}`}
              >
                Grade {summary.grade}
              </span>
            )}
            <span
              className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-bold ${workflowBadgeClass[workflow ?? "draft"]}`}
            >
              {workflowLabel[workflow ?? "draft"]}
            </span>
          </div>

          {/* Exam information */}
          <section>
            <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-500">
              Exam Information
            </h3>
            <div className="rounded-lg border border-slate-100 bg-slate-50/60 px-4 py-2">
              <InfoRow label="Exam Name" value={summary.exam_name} />
              <InfoRow
                label="Class - Section"
                value={`${summary.class_name ?? "-"} - ${summary.section_name ?? "-"}`}
              />
              <InfoRow label="Academic Year" value={summary.academic_year} />
              <InfoRow label="Subjects" value={String(summary.subject_count)} />
            </div>
          </section>

          {/* Subject marks */}
          <section>
            <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-500">
              Subject Marks
            </h3>
            {loading ? (
              <div className="flex items-center justify-center gap-2 rounded-lg border border-dashed border-slate-200 py-8 text-xs text-slate-400">
                <Loader2 size={14} className="animate-spin" />
                Loading marks...
              </div>
            ) : details.length === 0 ? (
              <p className="rounded-lg border border-dashed border-slate-200 py-6 text-center text-xs text-slate-400">
                No subject marks recorded yet.
              </p>
            ) : (
              <div className="overflow-hidden rounded-lg border border-slate-100">
                <table className="min-w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                      <th className="px-3 py-2">Subject</th>
                      <th className="px-3 py-2">Max</th>
                      <th className="px-3 py-2">Obt.</th>
                      <th className="px-3 py-2">Grade</th>
                      <th className="px-3 py-2">Teacher</th>
                    </tr>
                  </thead>
                  <tbody>
                    {details
                      .filter((row) => row.result_mark_id)
                      .map((row) => (
                        <tr
                          key={row.result_mark_id}
                          className="border-b border-slate-50 last:border-0"
                        >
                          <td className="px-3 py-2 font-medium text-slate-700">
                            {row.subject_name ?? "-"}
                          </td>
                          <td className="px-3 py-2 text-slate-500">
                            {row.maximum_marks ?? "-"}
                          </td>
                          <td className="px-3 py-2 font-semibold text-slate-800">
                            {row.subject_obtained_marks ?? "-"}
                          </td>
                          <td className="px-3 py-2">
                            {row.subject_grade ? (
                              <span
                                className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold ${gradeBadgeClass(row.subject_grade)}`}
                              >
                                {row.subject_grade}
                              </span>
                            ) : (
                              <span className="text-slate-300">-</span>
                            )}
                          </td>
                          <td className="max-w-24 truncate px-3 py-2 text-slate-500">
                            {row.teacher_name ?? "-"}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>


          {/* Result summary */}
          <section>
            <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-500">
              Result Summary
            </h3>
            <div className="rounded-lg border border-slate-100 bg-slate-50/60 px-4 py-2">
              <InfoRow
                label="Total Marks"
                value={String(summary.total_marks || "-")}
              />
              <InfoRow
                label="Obtained Marks"
                value={String(summary.obtained_marks || "-")}
              />
              <InfoRow
                label="Percentage"
                value={
                  summary.total_marks > 0
                    ? `${Number(summary.percentage ?? 0).toFixed(2)}%`
                    : "-"
                }
              />
              <InfoRow label="Grade" value={summary.grade ?? "-"} />
              <InfoRow
                label="Result Status"
                value={
                  resultStatusLabel[summary.result_status] ??
                  summary.result_status
                }
              />
              <InfoRow
                label="Workflow Status"
                value={workflowLabel[workflow ?? "draft"]}
              />
            </div>
          </section>

          {/* Review actions */}
          {canReview && (
            <section className="rounded-lg border border-amber-200 bg-amber-50/60 p-4">
              <p className="flex items-center gap-2 text-xs font-semibold text-amber-700">
                <AlertCircle size={14} />
                Submitted for review — approve to publish later or reject to
                send back.
              </p>
              {rejecting ? (
                <div className="mt-3 space-y-2">
                  <textarea
                    value={remark}
                    onChange={(event) => setRemark(event.target.value)}
                    rows={2}
                    placeholder="Reason for rejection (shared with the teacher)..."
                    className="w-full rounded-md border border-slate-200 px-3 py-2 text-xs outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleReject}
                      disabled={actionBusy}
                      className="flex items-center gap-1.5 rounded-md bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-rose-700 disabled:opacity-50"
                    >
                      <XCircle size={13} />
                      Confirm Reject
                    </button>
                    <button
                      type="button"
                      onClick={() => setRejecting(false)}
                      className="rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-white"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mt-3 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={onApprove}
                    disabled={actionBusy}
                    className="flex items-center gap-1.5 rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-50"
                  >
                    <CheckCircle2 size={13} />
                    Approve
                  </button>
                  <button
                    type="button"
                    onClick={() => setRejecting(true)}
                    disabled={actionBusy}
                    className="flex items-center gap-1.5 rounded-md bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-rose-700 disabled:opacity-50"
                  >
                    <XCircle size={13} />
                    Reject
                  </button>
                </div>
              )}
            </section>
          )}

          {canPublish && (
            <button
              type="button"
              onClick={onPublish}
              disabled={actionBusy}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:opacity-50"
            >
              <CheckCircle2 size={16} />
              {actionBusy ? "Publishing..." : "Publish Result"}
            </button>
          )}


          {workflow === "published" && (
            <p className="flex items-center justify-center gap-2 rounded-lg bg-emerald-50 py-2.5 text-xs font-semibold text-emerald-700">
              <CalendarDays size={14} />
              This result is published and visible to the student.
            </p>
          )}

          {workflow === "rejected" && (
            <p className="rounded-lg bg-rose-50 px-3 py-2.5 text-xs font-medium text-rose-600">
              Rejected
              {details[0]?.result_remarks
                ? `: ${details[0].result_remarks}`
                : " — sent back to the teacher for correction."}
            </p>
          )}

          {workflow === "draft" && (
            <p className="rounded-lg bg-slate-50 px-3 py-2.5 text-xs font-medium text-slate-500">
              The teacher is still preparing this result. Review actions unlock
              once it is submitted.
            </p>
          )}
        </div>
      )}

      {/* Footer actions */}
      {summary && (
        <footer className="space-y-2 border-t border-slate-100 p-4">
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={onPrint}
              disabled={loading || details.length === 0}
              className="flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 px-2 py-2 text-xs font-medium text-slate-600 transition hover:border-indigo-300 hover:text-indigo-600 disabled:opacity-40"
            >
              <Printer size={13} />
              Print
            </button>
            <button
              type="button"
              onClick={onDownloadPdf}
              disabled={loading || details.length === 0}
              className="flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 px-2 py-2 text-xs font-medium text-slate-600 transition hover:border-indigo-300 hover:text-indigo-600 disabled:opacity-40"
            >
              <FileText size={13} />
              PDF
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-200 px-2 py-2 text-xs font-medium text-slate-600 transition hover:bg-slate-50"
            >
              Close
            </button>
          </div>
        </footer>
      )}
    </aside>
  );
};

export default ResultDetailsPanel;

