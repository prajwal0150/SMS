import { useState } from "react";
import {
  AlertCircle,
  FileDown,
  GraduationCap,
  User,
  Users,
  X,
} from "lucide-react";

import type {
  AttendanceTab,
  ReportOptions,
  ReportTargetType,
  StudentOption,
  TeacherOption,
} from "../types/attendanceTypes";
import type {
  ClassSection,
  SchoolClass,
} from "../../School/types/schoolTypes";
import { monthStartISO, todayISO } from "../utils/attendanceUtils";

interface ReportGeneratorModalProps {
  open: boolean;
  onClose: () => void;
  /** Tab the user was on when they clicked "Generate Report". */
  defaultTarget: AttendanceTab;
  classes: SchoolClass[];
  sections: ClassSection[];
  students: StudentOption[];
  teachers: TeacherOption[];
  generating: boolean;
  onGenerate: (options: ReportOptions) => Promise<boolean>;
}

/** individual = one student/teacher, group = whole class / all staff. */
type Scope = "individual" | "group";

const inputClass =
  "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400";

const studentFullName = (student: StudentOption): string =>
  [student.first_name, student.middle_name, student.last_name]
    .filter(Boolean)
    .join(" ");

const teacherFullName = (teacher: TeacherOption): string =>
  [teacher.first_name, teacher.last_name].filter(Boolean).join(" ");

const scopeButtonClass = (active: boolean): string =>
  `flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-2 text-xs font-medium transition ${
    active
      ? "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200"
      : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
  }`;

/**
 * Small popup that collects "whose attendance" + date range,
 * then triggers the immediate PDF download.
 */
const ReportGeneratorModal = ({
  open,
  onClose,
  defaultTarget,
  classes,
  sections,
  students,
  teachers,
  generating,
  onGenerate,
}: ReportGeneratorModalProps) => {
  const [targetType, setTargetType] = useState<ReportTargetType>("student");
  const [scope, setScope] = useState<Scope>("individual");
  const [studentId, setStudentId] = useState("");
  const [classId, setClassId] = useState("");
  const [sectionId, setSectionId] = useState("");
  const [teacherId, setTeacherId] = useState("");
  const [fromDate, setFromDate] = useState(monthStartISO());
  const [toDate, setToDate] = useState(todayISO());

  // Fresh form every time the popup opens, pre-set to the active tab.
  // (State adjusted during render — the React-recommended pattern for
  // reacting to a prop change, instead of a setState inside an effect.)
  const [prevOpen, setPrevOpen] = useState(open);

  if (open !== prevOpen) {
    setPrevOpen(open);

    if (open) {
      setTargetType(defaultTarget);
      setScope(defaultTarget === "student" ? "individual" : "group");
      setStudentId("");
      setClassId("");
      setSectionId("");
      setTeacherId("");
      setFromDate(monthStartISO());
      setToDate(todayISO());
    }
  }

  const classSections = classId
    ? sections.filter((section) => section.class_id === classId)
    : sections;

  const studentPool = classId
    ? students.filter((student) => student.class_id === classId)
    : students;

  const selectedStudent = students.find((s) => s.id === studentId) ?? null;
  const selectedTeacher = teachers.find((t) => t.id === teacherId) ?? null;
  const selectedClass = classes.find((c) => c.id === classId) ?? null;
  const selectedSection = sections.find((s) => s.id === sectionId) ?? null;

  const rangeInvalid = fromDate > toDate;
  const selectionMissing =
    targetType === "student"
      ? scope === "individual"
        ? !studentId
        : !classId
      : scope === "individual"
        ? !teacherId
        : false;
  const invalid = rangeInvalid || selectionMissing;

  const handleTargetChange = (value: ReportTargetType) => {
    setTargetType(value);
    setScope(value === "student" ? "individual" : "group");
  };

  const handleClassChange = (value: string) => {
    setClassId(value);
    setSectionId("");
    setStudentId("");
  };

  const buildLabel = (): string => {
    if (targetType === "student") {
      if (scope === "individual" && selectedStudent) {
        const className = classes.find(
          (c) => c.id === selectedStudent.class_id
        )?.class_name;
        const sectionName = sections.find(
          (s) => s.id === selectedStudent.section_id
        )?.section_name;
        const group = className
          ? ` (${className}${sectionName ? `-${sectionName}` : ""})`
          : "";
        const admission = selectedStudent.admission_number
          ? ` — Adm ${selectedStudent.admission_number}`
          : "";

        return `Student: ${studentFullName(selectedStudent)}${admission}${group}`;
      }

      if (selectedClass) {
        return `Class: ${selectedClass.class_name}${
          selectedSection ? ` — Section ${selectedSection.section_name}` : ""
        }`;
      }

      return "All students";
    }

    if (scope === "individual" && selectedTeacher) {
      return `Teacher: ${teacherFullName(selectedTeacher)}`;
    }

    return "All staff";
  };

  const handleGenerate = async () => {
    if (invalid || generating) return;

    await onGenerate({
      targetType,
      studentId:
        targetType === "student" && scope === "individual" ? studentId : "",
      teacherId:
        targetType === "staff" && scope === "individual" ? teacherId : "",
      classId: targetType === "student" && scope === "group" ? classId : "",
      sectionId:
        targetType === "student" && scope === "group" ? sectionId : "",
      fromDate,
      toDate,
      label: buildLabel(),
    });
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={generating ? undefined : onClose}
    >
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-[2px]" />

      <div
        className="relative w-full max-w-md overflow-hidden rounded-xl bg-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 px-5 py-4">
          <div>
            <h2 className="text-base font-semibold text-slate-900">
              Generate Attendance Report
            </h2>
            <p className="mt-0.5 text-xs text-slate-500">
              Choose whose attendance to export and the date range.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={generating}
            aria-label="Close"
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="space-y-4 px-5 py-4">
          {/* Student / Staff */}
          <div>
            <p className="mb-1.5 text-xs font-medium text-slate-500">
              Report for
            </p>
            <div className="flex gap-2 rounded-lg bg-slate-100 p-1">
              <button
                type="button"
                onClick={() => handleTargetChange("student")}
                className={scopeButtonClass(targetType === "student")}
              >
                <GraduationCap size={14} />
                Students
              </button>
              <button
                type="button"
                onClick={() => handleTargetChange("staff")}
                className={scopeButtonClass(targetType === "staff")}
              >
                <Users size={14} />
                Staff
              </button>
            </div>
          </div>

          {/* Individual vs group scope */}
          <div>
            <p className="mb-1.5 text-xs font-medium text-slate-500">
              {targetType === "student" ? "Student scope" : "Staff scope"}
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setScope("individual")}
                className={scopeButtonClass(scope === "individual")}
              >
                <User size={14} />
                {targetType === "student" ? "Single student" : "Single teacher"}
              </button>
              <button
                type="button"
                onClick={() => setScope("group")}
                className={scopeButtonClass(scope === "group")}
              >
                <Users size={14} />
                {targetType === "student" ? "Whole class" : "All staff"}
              </button>
            </div>
          </div>

          {/* Selections */}
          {targetType === "student" ? (
            scope === "individual" ? (
              <div className="grid gap-3">
                <label className="block">
                  <span className="mb-1.5 block text-xs font-medium text-slate-500">
                    Class (optional filter)
                  </span>
                  <select
                    value={classId}
                    onChange={(event) => handleClassChange(event.target.value)}
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

                <label className="block">
                  <span className="mb-1.5 block text-xs font-medium text-slate-500">
                    Student
                  </span>
                  <select
                    value={studentId}
                    onChange={(event) => setStudentId(event.target.value)}
                    className={inputClass}
                  >
                    <option value="">Select a student</option>
                    {studentPool.map((student) => {
                      const className = classes.find(
                        (c) => c.id === student.class_id
                      )?.class_name;
                      const sectionName = sections.find(
                        (s) => s.id === student.section_id
                      )?.section_name;
                      const group = className
                        ? ` — ${className}${sectionName ? `-${sectionName}` : ""}`
                        : "";
                      const admission = student.admission_number
                        ? ` (${student.admission_number})`
                        : "";

                      return (
                        <option key={student.id} value={student.id}>
                          {studentFullName(student)}
                          {admission}
                          {group}
                        </option>
                      );
                    })}
                  </select>
                </label>
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1.5 block text-xs font-medium text-slate-500">
                    Class
                  </span>
                  <select
                    value={classId}
                    onChange={(event) => handleClassChange(event.target.value)}
                    className={inputClass}
                  >
                    <option value="">Select a class</option>
                    {classes.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.class_name}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className="mb-1.5 block text-xs font-medium text-slate-500">
                    Section (optional)
                  </span>
                  <select
                    value={sectionId}
                    onChange={(event) => setSectionId(event.target.value)}
                    disabled={!classId}
                    className={inputClass}
                  >
                    <option value="">All Sections</option>
                    {classSections.map((section) => (
                      <option key={section.id} value={section.id}>
                        {section.section_name}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            )
          ) : scope === "individual" ? (
            <label className="block">
              <span className="mb-1.5 block text-xs font-medium text-slate-500">
                Teacher
              </span>
              <select
                value={teacherId}
                onChange={(event) => setTeacherId(event.target.value)}
                className={inputClass}
              >
                <option value="">Select a teacher</option>
                {teachers.map((teacher) => (
                  <option key={teacher.id} value={teacher.id}>
                    {teacherFullName(teacher)}
                    {teacher.email ? ` (${teacher.email})` : ""}
                  </option>
                ))}
              </select>
            </label>
          ) : (
            <p className="rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-500">
              The report will include attendance records for every staff
              member.
            </p>
          )}

          {/* Date range */}
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-xs font-medium text-slate-500">
                From date
              </span>
              <input
                type="date"
                value={fromDate}
                onChange={(event) => setFromDate(event.target.value)}
                className={inputClass}
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-medium text-slate-500">
                To date
              </span>
              <input
                type="date"
                value={toDate}
                onChange={(event) => setToDate(event.target.value)}
                className={inputClass}
              />
            </label>
          </div>

          {rangeInvalid && (
            <p className="flex items-center gap-1.5 text-xs font-medium text-rose-600">
              <AlertCircle size={13} />
              The end date cannot be before the start date.
            </p>
          )}

          {/* Scope preview */}
          <p className="truncate rounded-lg bg-indigo-50 px-3 py-2 text-xs font-medium text-indigo-700">
            Export: {buildLabel()}
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center gap-3 border-t border-slate-100 px-5 py-4">
          {selectionMissing && !generating && (
            <p className="mr-auto flex items-center gap-1.5 text-xs font-medium text-rose-600">
              <AlertCircle size={13} />
              {targetType === "student"
                ? scope === "individual"
                  ? "Select a student to continue."
                  : "Select a class to continue."
                : "Select a teacher to continue."}
            </p>
          )}

          <button
            type="button"
            onClick={onClose}
            disabled={generating}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleGenerate}
            disabled={invalid || generating}
            className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-indigo-300"
          >
            {generating ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                Generating...
              </>
            ) : (
              <>
                <FileDown size={16} />
                Generate &amp; Download
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportGeneratorModal;

