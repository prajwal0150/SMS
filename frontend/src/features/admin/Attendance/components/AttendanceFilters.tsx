import type { ReactNode } from "react";
import { RotateCcw } from "lucide-react";

import type {
  AttendanceFilters as AttendanceFilterState,
  TeacherOption,
} from "../types/attendanceTypes";
import { ATTENDANCE_STATUSES } from "../types/attendanceTypes";
import type {
  ClassSection,
  SchoolClass,
  Subject,
} from "../../School/types/schoolTypes";
import { capitalize } from "../utils/attendanceUtils";

interface AttendanceFiltersProps {
  filters: AttendanceFilterState;
  classes: SchoolClass[];
  sections: ClassSection[];
  subjects: Subject[];
  teachers: TeacherOption[];
  onChange: (key: keyof AttendanceFilterState, value: string) => void;
  onReset: () => void;
}

const selectClass =
  "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400";

const Field = ({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) => (
  <label className="block">
    <span className="mb-1.5 block text-xs font-medium text-slate-500">
      {label}
    </span>
    {children}
  </label>
);

const AttendanceFilters = ({
  filters,
  classes,
  sections,
  subjects,
  teachers,
  onChange,
  onReset,
}: AttendanceFiltersProps) => {
  const classSections = filters.classId
    ? sections.filter((section) => section.class_id === filters.classId)
    : [];

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-900">
          Filter attendance
        </h2>
        <button
          type="button"
          onClick={onReset}
          className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-medium text-slate-500 transition hover:bg-slate-50 hover:text-indigo-600"
        >
          <RotateCcw size={13} />
          Reset
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <Field label="Date">
          <input
            type="date"
            value={filters.date}
            onChange={(event) => onChange("date", event.target.value)}
            className={selectClass}
          />
        </Field>

        <Field label="Class">
          <select
            value={filters.classId}
            onChange={(event) => onChange("classId", event.target.value)}
            className={selectClass}
          >
            <option value="">All Classes</option>
            {classes.map((item) => (
              <option key={item.id} value={item.id}>
                {item.class_name}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Section">
          <select
            value={filters.sectionId}
            onChange={(event) => onChange("sectionId", event.target.value)}
            className={selectClass}
            disabled={!filters.classId}
          >
            <option value="">All Sections</option>
            {classSections.map((section) => (
              <option key={section.id} value={section.id}>
                {section.section_name}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Subject">
          <select
            value={filters.subjectId}
            onChange={(event) => onChange("subjectId", event.target.value)}
            className={selectClass}
          >
            <option value="">All Subjects</option>
            {subjects.map((subject) => (
              <option key={subject.id} value={subject.id}>
                {subject.subject_name}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Status">
          <select
            value={filters.status}
            onChange={(event) => onChange("status", event.target.value)}
            className={selectClass}
          >
            <option value="">All Statuses</option>
            {ATTENDANCE_STATUSES.map((status) => (
              <option key={status} value={status}>
                {capitalize(status)}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Marked By">
          <select
            value={filters.teacherId}
            onChange={(event) => onChange("teacherId", event.target.value)}
            className={selectClass}
          >
            <option value="">All Teachers</option>
            {teachers.map((teacher) => (
              <option key={teacher.id} value={teacher.id}>
                {[teacher.first_name, teacher.last_name]
                  .filter(Boolean)
                  .join(" ")}
              </option>
            ))}
          </select>
        </Field>
      </div>
    </section>
  );
};

export default AttendanceFilters;