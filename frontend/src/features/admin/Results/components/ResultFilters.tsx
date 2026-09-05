import { ArrowUpDown, RotateCcw, Search } from "lucide-react";

import type {
  ResultFilters as ResultFilterState,
  SortOption,
} from "../types/resultTypes";
import type { ClassSection, SchoolClass } from "../../School/types/schoolTypes";
import type { ExamOption } from "../types/resultTypes";
import { RESULT_STATUSES, WORKFLOW_STATUSES } from "../types/resultTypes";
import {
  resultStatusLabel,
  SORT_OPTIONS,
  workflowLabel,
} from "../utils/resultUtils";

interface ResultFiltersProps {
  filters: ResultFilterState;
  exams: ExamOption[];
  classes: SchoolClass[];
  sections: ClassSection[];
  academicYears: string[];
  onChange: (key: keyof ResultFilterState, value: string) => void;
  onReset: () => void;
  onApply: () => void;
}

const inputClass =
  "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100";

const labelClass = "mb-1 block text-xs font-medium text-slate-500";

const ResultFilters = ({
  filters,
  exams,
  classes,
  sections,
  academicYears,
  onChange,
  onReset,
  onApply,
}: ResultFiltersProps) => {
  const classSections = filters.classId
    ? sections.filter((section) => section.class_id === filters.classId)
    : sections;

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {/* Academic Year */}
        <label className="block">
          <span className={labelClass}>Academic Year</span>
          <select
            value={filters.academicYear}
            onChange={(event) => onChange("academicYear", event.target.value)}
            className={inputClass}
          >
            <option value="">All Years</option>
            {academicYears.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </label>

        {/* Exam */}
        <label className="block">
          <span className={labelClass}>Exam</span>
          <select
            value={filters.examId}
            onChange={(event) => onChange("examId", event.target.value)}
            className={inputClass}
          >
            <option value="">All Exams</option>
            {exams.map((exam) => (
              <option key={exam.id} value={exam.id}>
                {exam.name}
              </option>
            ))}
          </select>
        </label>

        {/* Class */}
        <label className="block">
          <span className={labelClass}>Class</span>
          <select
            value={filters.classId}
            onChange={(event) => {
              onChange("sectionId", "");
              onChange("classId", event.target.value);
            }}
            className={inputClass}
          >
            <option value="">All Classes</option>
            {classes.map((item) => (
              <option key={item.id} value={item.id}>
                {item.class_name}
              </option>
            ))}
          </select>
        </label>

        {/* Section */}
        <label className="block">
          <span className={labelClass}>Section</span>
          <select
            value={filters.sectionId}
            onChange={(event) => onChange("sectionId", event.target.value)}
            disabled={!filters.classId}
            className={`${inputClass} disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400`}
          >
            <option value="">All Sections</option>
            {classSections.map((section) => (
              <option key={section.id} value={section.id}>
                {section.section_name}
              </option>
            ))}
          </select>
        </label>

        {/* Result Status */}
        <label className="block">
          <span className={labelClass}>Result Status</span>
          <select
            value={filters.resultStatus}
            onChange={(event) => onChange("resultStatus", event.target.value)}
            className={inputClass}
          >
            <option value="">All Status</option>
            {RESULT_STATUSES.map((status) => (
              <option key={status} value={status}>
                {resultStatusLabel[status]}
              </option>
            ))}
          </select>
        </label>

        {/* Workflow Status */}
        <label className="block">
          <span className={labelClass}>Workflow Status</span>
          <select
            value={filters.workflowStatus}
            onChange={(event) => onChange("workflowStatus", event.target.value)}
            className={inputClass}
          >
            <option value="">All Stages</option>
            {WORKFLOW_STATUSES.map((status) => (
              <option key={status} value={status}>
                {workflowLabel[status]}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Search */}
        <label className="block lg:col-span-2">
          <span className={labelClass}>Search Student</span>
          <div className="relative">
            <Search
              size={15}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              value={filters.search}
              onChange={(event) => onChange("search", event.target.value)}
              placeholder="Search by name, roll no. or admission no..."
              className={`${inputClass} pl-9`}
            />
          </div>
        </label>

        {/* Sort */}
        <label className="block">
          <span className={labelClass}>Sort By</span>
          <div className="flex items-center gap-2">
            <select
              value={filters.sortBy}
              onChange={(event) =>
                onChange("sortBy", event.target.value as SortOption)
              }
              className={inputClass}
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <button
              type="button"
              title="Toggle sort direction"
              onClick={() =>
                onChange("sortDir", filters.sortDir === "asc" ? "desc" : "asc")
              }
              className="flex h-[38px] w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-indigo-300 hover:text-indigo-600"
            >
              <ArrowUpDown size={15} />
            </button>
          </div>
        </label>

        {/* Actions */}
        <div className="flex items-end gap-2">
          <button
            type="button"
            onClick={onReset}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
          >
            <span className="flex items-center gap-2">
              <RotateCcw size={14} />
              Reset
            </span>
          </button>
          <button
            type="button"
            onClick={onApply}
            className="flex-1 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
          >
            Filter
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultFilters;

