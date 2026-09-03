import { Mail, Phone, Trash2 } from "lucide-react";

import Card from "../../dashboard/components/Card";
import DataState from "./DataState";

import type { Teacher } from "../types/staffManagmentTypes";


interface TeachersTableProps {
  teachers: Teacher[];
  loading: boolean;
  error: string | null;
  onDelete: (id: string) => void;
  onReload: () => void;
}

const formatName = (teacher: Teacher): string =>
  `${teacher.first_name} ${teacher.last_name}`;


const getInitials = (teacher: Teacher): string =>
  `${teacher.first_name.charAt(0)}${teacher.last_name.charAt(0)}`.toUpperCase();


const TeachersTable = ({
  teachers,
  loading,
  error,
  onDelete,
  onReload,
}: TeachersTableProps) => (
  <Card
    title="All Teachers"
    subtitle={`${teachers.length} registered teachers`}
    action={
      !loading && !error && teachers.length > 0 ? (
        <span className="rounded-full bg-[#166534]/10 px-3 py-1 text-xs font-semibold text-[#166534]">
          {teachers.length} Total
        </span>
      ) : undefined
    }
    className="overflow-hidden"
  >
    {loading || error || teachers.length === 0 ? (
      <DataState
        loading={loading}
        error={error}
        onReload={onReload}
        message="No teachers yet. Use 'Add Teacher' to create the first one."
      />
    ) : (
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] border-collapse text-sm">
          <thead>
            <tr>
              <th className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Teacher
              </th>
              <th className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Subject
              </th>
              <th className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Qualification
              </th>
              <th className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Joined
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
            {teachers.map((teacher) => (
              <tr
                key={teacher.id}
                className="border-b border-slate-100 transition last:border-0 hover:bg-slate-50/60"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#1E3A5F]/10 text-xs font-bold text-[#1E3A5F]">
                      {getInitials(teacher)}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-slate-900">
                        {formatName(teacher)}
                      </p>
                      <p className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-500">
                        <Mail size={12} className="shrink-0" />
                        <span className="truncate">{teacher.email}</span>
                        {teacher.phone && (
                          <>
                            <span className="text-slate-300">|</span>
                            <Phone size={12} className="shrink-0" />
                            {teacher.phone}
                          </>
                        )}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                    {teacher.subject}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-600">
                  {teacher.qualification ?? "—"}
                </td>
                <td className="px-4 py-3 text-slate-600">
                  {teacher.join_date ?? "—"}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                      teacher.status === "active"
                        ? "bg-[#166534]/10 text-[#166534]"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {teacher.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => onDelete(teacher.id)}
                      title="Delete teacher"
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

export default TeachersTable;