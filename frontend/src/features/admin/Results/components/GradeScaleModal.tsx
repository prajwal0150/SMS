import { Loader2, X } from "lucide-react";

import type { GradeScale } from "../types/resultTypes";

interface GradeScaleModalProps {
  open: boolean;
  loading: boolean;
  scales: GradeScale[];
  onClose: () => void;
}

const gradeBadgeClass = (grade: string): string => {
  switch (grade) {
    case "A+":
    case "A":
      return "bg-emerald-50 text-emerald-600";
    case "B+":
    case "B":
      return "bg-indigo-50 text-indigo-600";
    case "C":
      return "bg-amber-50 text-amber-600";
    case "D":
      return "bg-orange-50 text-orange-600";
    default:
      return "bg-rose-50 text-rose-600";
  }
};

/** Read-only view of the grading system (grade_scales table). */
const GradeScaleModal = ({
  open,
  loading,
  scales,
  onClose,
}: GradeScaleModalProps) => {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
      <div className="w-full max-w-md overflow-hidden rounded-xl bg-white shadow-xl">
        <header className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <h2 className="text-sm font-bold text-slate-800">
            Grade Configuration
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          >
            <X size={15} />
          </button>
        </header>

        <div className="p-5">
          {loading ? (
            <div className="flex items-center justify-center gap-2 py-8 text-sm text-slate-400">
              <Loader2 size={16} className="animate-spin" />
              Loading grading system...
            </div>
          ) : scales.length === 0 ? (
            <p className="py-8 text-center text-sm text-slate-400">
              No grade scales configured yet.
            </p>
          ) : (
            <>
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    <th className="py-2 pr-3">Grade</th>
                    <th className="py-2 pr-3">Range (%)</th>
                    <th className="py-2">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {scales.map((scale) => (
                    <tr
                      key={scale.id}
                      className="border-b border-slate-50 last:border-0"
                    >
                      <td className="py-2.5 pr-3">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-bold ${gradeBadgeClass(scale.grade)}`}
                        >
                          {scale.grade}
                        </span>
                      </td>
                      <td className="py-2.5 pr-3 text-slate-600">
                        {Number(scale.min_percentage)} -{" "}
                        {Number(scale.max_percentage)}
                      </td>
                      <td className="py-2.5 text-slate-500">
                        {scale.description ?? "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="mt-4 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-500">
                These ranges (from the grade_scales table) decide the grade
                shown on every result, mark sheet and PDF report.
              </p>
            </>
          )}
        </div>

        <footer className="border-t border-slate-100 px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            Done
          </button>
        </footer>
      </div>
    </div>
  );
};

export default GradeScaleModal;