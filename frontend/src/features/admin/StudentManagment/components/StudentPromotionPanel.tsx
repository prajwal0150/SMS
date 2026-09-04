import { useMemo, useState } from "react";
import { GraduationCap, Search } from "lucide-react";

import Card from "../../dashboard/components/Card";
import DataState from "./DataState";

import { useSchoolLookups } from "../../School/hooks/useSchoolLookups";

import type {
  Student,
  StudentPromotion,
  PromotionInput,
} from "../types/studentManagmentTypes";


const inputClass =
  "h-11 w-full rounded-lg border border-slate-200 bg-slate-50/70 px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#166534] focus:bg-white focus:ring-4 focus:ring-[#166534]/10";


interface StudentPromotionPanelProps {
  students: Student[];
  promotions: StudentPromotion[];
  loading: boolean;
  promotionsLoading: boolean;
  saving: boolean;
  onPromote: (input: PromotionInput) => Promise<boolean>;
  onReload: () => void;
  onReloadPromotions: () => void;
}

const fullName = (student: Student): string =>
  [student.first_name, student.middle_name, student.last_name]
    .filter(Boolean)
    .join(" ");

const formatClassName = (student: Student): string =>
  student.section
    ? `${student.class_name} - ${student.section}`
    : student.class_name;

const currentAcademicYear = (): string => {
  const now = new Date();
  const current = now.getFullYear();
  const next = current + 1;
  return `${String(current).slice(2)}-${String(next).slice(2)}`;
};


const StudentPromotionPanel = ({
  students,
  promotions,
  loading,
  promotionsLoading,
  saving,
  onPromote,
  onReload,
  onReloadPromotions,
}: StudentPromotionPanelProps) => {

  const [query, setQuery] = useState("");
  const [selected, setSelected] =
    useState<Set<string>>(new Set());
  const [classId, setClassId] = useState("");
  const [section, setSection] = useState("");
  const [academicYear, setAcademicYear] =
    useState(currentAcademicYear());
  const [notes, setNotes] = useState("");

  const { classes, classSections, loading: classesLoading } =
    useSchoolLookups(classId);

  const selectedClassName =
    classes.find((item) => item.id === classId)?.class_name ?? "";


  const filteredStudents = useMemo(() => {
    const term = query.trim().toLowerCase();

    if (!term) {
      return students;
    }

    return students.filter((student) =>
      fullName(student).toLowerCase().includes(term) ||
      student.admission_number.toLowerCase().includes(term) ||
      student.class_name.toLowerCase().includes(term)
    );
  }, [students, query]);


  const toggleStudent = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);

      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }

      return next;
    });
  };


  const toggleAll = () => {
    setSelected((prev) => {
      const next = new Set(prev);

      if (
        filteredStudents.length > 0 &&
        filteredStudents.every((student) => next.has(student.id))
      ) {
        filteredStudents.forEach((student) => next.delete(student.id));
      } else {
        filteredStudents.forEach((student) => next.add(student.id));
      }

      return next;
    });
  };


  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (selected.size === 0) {
      return;
    }

    const success = await onPromote({
      student_ids: Array.from(selected),
      class_name: selectedClassName,
      section: section || undefined,
      academic_year: academicYear.trim(),
      notes: notes.trim() || undefined,
    });

    if (success) {
      setSelected(new Set());
      setNotes("");
    }
  };


  return (
    <div className="space-y-6">
      <Card
        title="Promote Students"
        subtitle="Move selected students to a new class and record promotion history"
        className="overflow-hidden"
      >
        <form onSubmit={handleSubmit}><div className="grid gap-4 lg:grid-cols-4">
          <div>
            <label htmlFor="pClass" className="mb-2 block text-sm font-semibold text-slate-700">
              Target class
            </label>
            <select
              id="pClass"
              value={classId}
              onChange={(event) => {
                setClassId(event.target.value);
                setSection("");
              }}
              required
              className={inputClass}
            >
              <option value="">
                {classesLoading ? "Loading classes..." : "Select class"}
              </option>
              {classes.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.class_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="pSection" className="mb-2 block text-sm font-semibold text-slate-700">
              Section
            </label>
            <select
              id="pSection"
              value={section}
              onChange={(event) => setSection(event.target.value)}
              disabled={!classId}
              className={inputClass}
            >
              <option value="">Select section</option>
              {classSections.map((item) => (
                <option key={item.id} value={item.section_name}>
                  {item.section_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="pYear" className="mb-2 block text-sm font-semibold text-slate-700">
              Academic year
            </label>
            <input
              id="pYear"
              type="text"
              value={academicYear}
              onChange={(event) => setAcademicYear(event.target.value)}
              required
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="pNotes" className="mb-2 block text-sm font-semibold text-slate-700">
              Notes
            </label>
            <input
              id="pNotes"
              type="text"
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Optional"
              className={inputClass}
            />
          </div>
        </div>

        {/* Student selection */}
        <div className="mt-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="relative flex-1 sm:max-w-xs">
              <Search size={15} className="pointer-events-none absolute left-3 top-3.5 text-slate-400" />
              <input
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search students..."
                className="h-11 w-full rounded-lg border border-slate-200 bg-slate-50/70 pl-9 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#166534] focus:bg-white focus:ring-4 focus:ring-[#166534]/10"
              />
            </div>
            <span className="text-xs font-medium text-slate-500">
              {selected.size} selected
            </span>
          </div>

          {loading ? (
            <DataState loading onReload={onReload} />
          ) : filteredStudents.length === 0 ? (
            <DataState message="No students match your search." />
          ) : (
            <div className="mt-4 max-h-96 overflow-y-auto rounded-lg border border-slate-200">
              <table className="w-full min-w-[560px] border-collapse bg-white text-sm">
                <thead className="sticky top-0 z-10">
                  <tr>
                    <th className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={
                          filteredStudents.length > 0 &&
                          filteredStudents.every(
                            (student) => selected.has(student.id)
                          )
                        }
                        onChange={toggleAll}
                        className="h-4 w-4 rounded border-slate-300 accent-[#166534]"
                      />
                    </th>
                    <th className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Student
                    </th>
                    <th className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Current class
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student) => (
                    <tr
                      key={student.id}
                      className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60"
                    >
                      <td className="px-4 py-2.5">
                        <input
                          type="checkbox"
                          checked={selected.has(student.id)}
                          onChange={() => toggleStudent(student.id)}
                          className="h-4 w-4 rounded border-slate-300 accent-[#166534]"
                        />
                      </td>
                      <td className="px-4 py-2.5">
                        <p className="font-semibold text-slate-900">
                          {fullName(student)}
                        </p>
                        <p className="text-xs text-slate-500">
                          {student.admission_number}
                        </p>
                      </td>
                      <td className="px-4 py-2.5">
                        <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                          {formatClassName(student)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-5">
          <p className="text-sm text-slate-500">
            {selected.size === 0
              ? "Select at least one student to promote."
              : `${selected.size} student(s) will be moved to ${selectedClassName || "target class"}.`}
          </p>
          <button
            type="submit"
            disabled={saving || selected.size === 0}
            className="inline-flex h-11 items-center gap-2 rounded-lg bg-[#1E3A5F] px-5 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#162E4C] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
          >
            {saving ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Promoting...
              </>
            ) : (
              <>
                <GraduationCap size={16} />
                Promote {selected.size > 0 ? selected.size : ""} Student(s)
              </>
            )}
          </button>
        </div>
      </form>
      </Card>

      {/* Recent promotion history */}
      <Card
        title="Promotion History"
        subtitle="Recent class promotions"
        className="overflow-hidden"
      >
        {promotionsLoading || promotions.length === 0 ? (
          <DataState
            loading={promotionsLoading}
            onReload={onReloadPromotions}
            message="No promotions yet. Promote students above."
          />
        ) : (
          <ul className="divide-y divide-slate-100">
            {promotions.slice(0, 10).map((promotion) => (
              <li
                key={promotion.id}
                className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0"
              >
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-900">
                    {promotion.from_class}
                    {promotion.from_section ? ` - ${promotion.from_section}` : ""}
                    {" → "}
                    {promotion.to_class}
                    {promotion.to_section ? ` - ${promotion.to_section}` : ""}
                  </p>
                  <p className="text-xs text-slate-500">
                    {promotion.academic_year}
                    {promotion.notes ? ` · ${promotion.notes}` : ""}
                  </p>
                </div>
                <span className="shrink-0 text-xs font-medium text-slate-400">
                  {promotion.promoted_at.slice(0, 10)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
};

export default StudentPromotionPanel;