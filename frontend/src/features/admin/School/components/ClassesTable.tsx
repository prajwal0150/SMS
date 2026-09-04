import { useState } from "react";
import { ClipboardList, Plus, School, Trash2 } from "lucide-react";

import Card from "../../dashboard/components/Card";
import DataState from "./DataState";

import type {
  NewClassInput,
  SchoolClass,
  ClassSection,
} from "../types/schoolTypes";


const inputClass =
  "h-11 w-full rounded-lg border border-slate-200 bg-slate-50/70 px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#166534] focus:bg-white focus:ring-4 focus:ring-[#166534]/10";


interface ClassesTableProps {
  classes: SchoolClass[];
  sections: ClassSection[];
  loading: boolean;
  saving: boolean;
  error: string | null;
  selectedClassId: string | null;
  onSelect: (id: string) => void;
  onAdd: (input: NewClassInput) => Promise<boolean>;
  onDelete: (id: string) => void;
  onReload: () => void;
}

const ClassesTable = ({
  classes,
  sections,
  loading,
  saving,
  error,
  selectedClassId,
  onSelect,
  onAdd,
  onDelete,
  onReload,
}: ClassesTableProps) => {
  const [className, setClassName] = useState("");
  const [classCode, setClassCode] = useState("");
  const [academicYear, setAcademicYear] = useState("");


  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const success = await onAdd({
      class_name: className.trim(),
      class_code: classCode.trim() || undefined,
      academic_year: academicYear.trim() || undefined,
    });

    if (success) {
      setClassName("");
      setClassCode("");
      setAcademicYear("");
    }
  };


  return (
    <Card
      title="Classes"
      subtitle={`${classes.length} class${classes.length === 1 ? "" : "es"}`}
      action={
        !loading && !error && classes.length > 0 ? (
          <span className="rounded-full bg-[#166534]/10 px-3 py-1 text-xs font-semibold text-[#166534]">
            {classes.length} Total
          </span>
        ) : undefined
     }
      className="overflow-hidden"
    >
      <form
        onSubmit={handleSubmit}
        className="mb-5 grid gap-4 rounded-lg border border-slate-200 bg-slate-50/60 p-4 sm:grid-cols-3"
      >
        <div>
          <label htmlFor="cName" className="mb-2 block text-sm font-semibold text-slate-700">
            Class Name
          </label>
          <input
            id="cName"
            type="text"
            value={className}
            onChange={(event) => setClassName(event.target.value)}
            required
            placeholder="e.g. Class 5"
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="cCode" className="mb-2 block text-sm font-semibold text-slate-700">
            Class Code
          </label>
          <input
            id="cCode"
            type="text"
            value={classCode}
            onChange={(event) => setClassCode(event.target.value)}
            placeholder="e.g. C05"
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="cYear" className="mb-2 block text-sm font-semibold text-slate-700">
            Academic Year
          </label>
          <input
            id="cYear"
            type="text"
            value={academicYear}
            onChange={(event) => setAcademicYear(event.target.value)}
            placeholder="e.g. 2026-2027"
            className={inputClass}
          />
        </div>

        <div className="sm:col-span-3">
          <button
            type="submit"
            disabled={saving}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#166534] px-5 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#14532D] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
          >
            {saving ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Saving...
              </>
            ) : (
              <>
                <Plus size={16} />
                Add Class
              </>
            )}
          </button>
        </div>
      </form>

      {loading ? (
        <DataState loading onReload={onReload} />
      ) : error ? (
        <DataState error={error} onReload={onReload} />
      ) : classes.length === 0 ? (
        <DataState message="No classes yet. Add the first class above." />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] border-collapse text-sm">
            <thead>
              <tr>
                <th className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Class
                </th>
                <th className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Academic Year
                </th>
                <th className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Sections
                </th>
                <th className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {classes.map((item) => (
                <tr
                  key={item.id}
                  className={`border-b border-slate-100 transition last:border-0 hover:bg-slate-50/60 ${
                    selectedClassId === item.id ? "bg-[#166534]/5" : ""
                  }`}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <School size={15} className="shrink-0 text-slate-400" />
                      <div className="min-w-0">
                        <p className="font-medium text-slate-800">
                          {item.class_name}
                        </p>
                        {item.class_code && (
                          <p className="text-xs text-slate-500">
                            {item.class_code}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-3">
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                      {item.academic_year}
                    </span>
                  </td>

                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1 text-sm text-slate-600">
                      <ClipboardList size={14} className="text-slate-400" />
                      {sections.filter((section) => section.class_id === item.id).length}
                    </span>
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1.5">
                      {selectedClassId === item.id ? (
                        <span className="inline-flex items-center rounded-lg bg-[#166534]/10 px-3 py-2 text-xs font-semibold text-[#166534]">
                          Selected
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => onSelect(item.id)}
                          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition-colors hover:border-[#166534]/40 hover:text-[#166534]"
                        >
                          Manage
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => onDelete(item.id)}
                        title="Delete class"
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
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
};

export default ClassesTable;