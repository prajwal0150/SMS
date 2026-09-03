import {
  Mail,
  Phone,
  Trash2,
} from "lucide-react";

import Card from "../../dashboard/components/Card";
import DataState from "./DataState";

import type {
  Student,
  StudentStatus,
} from "../types/studentManagmentTypes";


interface StudentsTableProps {
  students: Student[];
  loading: boolean;
  error: string | null;
  onDelete: (id: string) => void;
  onReload: () => void;
}

const fullName = (student: Student): string =>
  [student.first_name, student.middle_name, student.last_name]
    .filter(Boolean)
    .join(" ");

const getInitials = (student: Student): string =>
  `${student.first_name.charAt(0)}${student.last_name.charAt(0)}`.toUpperCase();

const formatClassName = (student: Student): string =>
  student.section
    ? `${student.class_name} - ${student.section}`
    : student.class_name;

const STATUS_STYLES: Record<StudentStatus, string> = {
  active: "bg-[#166534]/10 text-[#166534]",
  inactive: "bg-slate-100 text-slate-500",
  transferred: "bg-[#D4A017]/15 text-[#8A6A0D]",
  graduated: "bg-[#1E3A5F]/10 text-[#1E3A5F]",
  alumni: "bg-indigo-50 text-indigo-600",
};


const StudentsTable = ({
  students,
  loading,
  error,
  onDelete,
  onReload,
}: StudentsTableProps) => (
  <Card
    title="All Students"
    subtitle={`${students.length} registered students`}
    action={
      !loading && !error && students.length > 0 ? (
        <span className="rounded-full bg-[#166534]/10 px-3 py-1 text-xs font-semibold text-[#166534]">
          {students.length} Total
        </span>
      ) : undefined
    }
    className="overflow-hidden"
  >
    {loading || error || students.length === 0 ? (
      <DataState
        loading={loading}
        error={error}
        onReload={onReload}
        message="No students yet. Use 'Add Student' to create the first one."
      />
    ) : (
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] border-collapse text-sm">
          <thead>
            <tr>
              <th className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Student
              </th>
              <th className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Class
              </th>
              <th className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Gender
              </th>
              <th className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Guardian
              </th>
              <th className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Admission
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
            {students.map((student) => (
              <tr
                key={student.id}
                className="border-b border-slate-100 transition last:border-0 hover:bg-slate-50/60"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#1E3A5F]/10 text-xs font-bold text-[#1E3A5F]">
                      {getInitials(student)}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-slate-900">
                        {fullName(student)}
                      </p>
                      <p className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-500">
                        <span className="truncate">
                          {student.admission_number}
                        </span>
                        {student.email && (
                          <>
                            <span className="text-slate-300">|</span>
                            <Mail size={12} className="shrink-0" />
                            <span className="truncate">
                              {student.email}
                            </span>
                          </>
                        )}
                        {student.phone && (
                          <>
                            <span className="text-slate-300">|</span>
                            <Phone size={12} className="shrink-0" />
                            {student.phone}
                          </>
                        )}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                    {formatClassName(student)}
                  </span>
                </td>
                <td className="px-4 py-3 capitalize text-slate-600">
                  {student.gender ?? "—"}
                </td>
                <td className="px-4 py-3 text-slate-600">
                  {student.guardian_name ?? "—"}
                  {student.guardian_phone && (
                    <span className="block text-xs text-slate-400">
                      {student.guardian_phone}
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-slate-600">
                  {student.admission_date ?? `${student.admission_year}`}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLES[student.status]}`}
                  >
                    {student.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => onDelete(student.id)}
                      title="Delete student"
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

export default StudentsTable;