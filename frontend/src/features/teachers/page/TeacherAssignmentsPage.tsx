import { Plus } from "lucide-react";

import PageHeader from "../components/PageHeader";
import Card from "../components/Card";

import type { AssignmentItem } from "../types/teacherTypes";

import { assignmentItems } from "../utils/mockData";


const STATUS_STYLES: Record<
  AssignmentItem["status"],
  string
> = {
  Open: "bg-indigo-50 text-indigo-700",
  Grading: "bg-amber-50 text-amber-600",
  Closed: "bg-slate-100 text-slate-600",
};


const TeacherAssignmentsPage = () => (
  <>
    <PageHeader
      title="Assignments"
      description="Create and track assignments for your classes."
      actions={
        <button
          type="button"
          className="flex h-11 items-center gap-2 rounded-lg bg-indigo-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
        >
          <Plus size={16} />
          New Assignment
        </button>
      }
    />

    <Card title="All Assignments" className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] border-collapse text-sm">
          <thead>
            <tr>
              <th className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Assignment
              </th>
              <th className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Class
              </th>
              <th className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Subject
              </th>
              <th className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Due Date
              </th>
              <th className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Submissions
              </th>
              <th className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {assignmentItems.map((item) => (
              <tr
                key={item.id}
                className="border-b border-slate-100 transition hover:bg-slate-50/60 last:border-0"
              >
                <td className="px-4 py-3 font-semibold text-slate-900">
                  {item.title}
                </td>
                <td className="px-4 py-3 text-slate-600">
                  {item.className}
                </td>
                <td className="px-4 py-3 text-slate-600">
                  {item.subject}
                </td>
                <td className="px-4 py-3 text-slate-600">
                  {item.dueDate}
                </td>
                <td className="px-4 py-3 text-slate-600">
                  {item.submissions}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLES[item.status]}`}
                  >
                    {item.status}
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

export default TeacherAssignmentsPage;