import { ClipboardList, Trash2 } from "lucide-react";

import Card from "../../dashboard/components/Card";
import DataState from "./DataState";

import type { Exam, ExamStatus, ExamType } from "../types/academicTypes";


interface ExamsTableProps {
  exams: Exam[];
  loading: boolean;
  error: string | null;
  onDelete: (id: string) => void;
  onReload: () => void;
}

const STATUS_STYLES: Record<ExamStatus, string> = {
  draft: "bg-slate-100 text-slate-500",
  upcoming: "bg-[#1E3A5F]/10 text-[#1E3A5F]",
  ongoing: "bg-[#166534]/10 text-[#166534]",
  completed: "bg-indigo-50 text-indigo-600",
  cancelled: "bg-red-50 text-red-600",
};

const TYPE_STYLES: Record<ExamType, string> = {
  "Unit Test": "bg-[#D4A017]/15 text-[#8A6A0D]",
  "Term Exam": "bg-[#166534]/10 text-[#166534]",
  "Mid Term": "bg-[#1E3A5F]/10 text-[#1E3A5F]",
  "Half Yearly": "bg-indigo-50 text-indigo-600",
  "Annual": "bg-emerald-50 text-emerald-700",
  "Final": "bg-purple-50 text-purple-600",
  "Practical": "bg-teal-50 text-teal-600",
  "Other": "bg-slate-100 text-slate-600",
};


const ExamsTable = ({
  exams,
  loading,
  error,
  onDelete,
  onReload,
}: ExamsTableProps) => (
  <Card
    title="Exams"
    subtitle={`${exams.length} scheduled exams`}
    action={
      !loading && !error && exams.length > 0 ? (
        <span className="rounded-full bg-[#166534]/10 px-3 py-1 text-xs font-semibold text-[#166534]">
          {exams.length} Total
        </span>
      ) : undefined
    }
    className="overflow-hidden"
  >
    {loading ? (
      <DataState loading onReload={onReload} />
    ) : error ? (
      <DataState error={error} onReload={onReload} />
    ) : exams.length === 0 ? (
      <DataState message="No exams yet. Use 'Add Exam' to schedule the first one." />
    ) : (
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] border-collapse text-sm">
          <thead>
            <tr>
              <th className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Exam
              </th>
              <th className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Class
              </th>
              <th className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Type
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
            {exams.map((exam) => (
              <tr
                key={exam.id}
                className="border-b border-slate-100 transition last:border-0 hover:bg-slate-50/60"
              >
<td className="max-w-xs px-4 py-3">
                  <div className="flex items-center gap-2">
                    <ClipboardList size={14} className="shrink-0 text-slate-400" />
                    <div className="min-w-0">
                      <p className="truncate font-medium text-slate-800">
                        {exam.name}
                      </p>
                      <p className="truncate text-xs text-slate-500">
                        {exam.description ?? exam.instructions ?? "—"}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="font-medium text-slate-700">
                    {exam.class_name}
                  </span>
                  <span className="ml-1 text-xs text-slate-400">
                    {exam.section ?? ""}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${TYPE_STYLES[exam.exam_type] ?? "bg-slate-100 text-slate-600"}`}
                  >
                    {exam.exam_type}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-600">
                  <p className="whitespace-nowrap">{exam.start_date}</p>
                  <p className="whitespace-nowrap text-xs text-slate-400">
                    {exam.end_date ?? "Single day"}
                  </p>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_STYLES[exam.status] ?? "bg-slate-100 text-slate-600"}`}
                  >
                    {exam.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => onDelete(exam.id)}
                      title="Delete exam"
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

export default ExamsTable;