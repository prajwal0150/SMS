import { Download } from "lucide-react";

import PageHeader from "../components/PageHeader";
import Card from "../components/Card";

import { resultRows } from "../utils/mockData";


const gradeStyle = (grade: string): string => {
  if (grade.startsWith("A")) {
    return "bg-green-50 text-green-600";
  }

  if (grade.startsWith("B")) {
    return "bg-amber-50 text-amber-600";
  }

  return "bg-red-50 text-red-600";
};


const TeacherResultsPage = () => (
  <>
    <PageHeader
      title="Results"
      description="Student results and grade sheets."
      actions={
        <button
          type="button"
          className="flex h-11 items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
        >
          <Download size={16} />
          Export
        </button>
      }
    />

    <Card title="Grade Sheet" className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] border-collapse text-sm">
          <thead>
            <tr>
              <th className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Student
              </th>
              <th className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Class
              </th>
              <th className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Subject
              </th>
              <th className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Marks
              </th>
              <th className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Grade
              </th>
            </tr>
          </thead>
          <tbody>
            {resultRows.map((row) => (
              <tr
                key={row.id}
                className="border-b border-slate-100 transition hover:bg-slate-50/60 last:border-0"
              >
                <td className="px-4 py-3 font-semibold text-slate-900">
                  {row.student}
                </td>
                <td className="px-4 py-3 text-slate-600">
                  {row.className}
                </td>
                <td className="px-4 py-3 text-slate-600">
                  {row.subject}
                </td>
                <td className="px-4 py-3 text-slate-600">
                  <span className="font-semibold text-slate-900">
                    {row.marks}
                  </span>
                  {" / "}
                  {row.totalMarks}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${gradeStyle(row.grade)}`}
                  >
                    {row.grade}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  </>
);

export default TeacherResultsPage;