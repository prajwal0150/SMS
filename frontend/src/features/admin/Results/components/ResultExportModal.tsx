import { useState } from "react";
import { AlertCircle, FileDown, GraduationCap, X } from "lucide-react";

import type {
  ResultExportOptions,
  ResultExportScope,
} from "../types/resultTypes";
import type { ExamOption } from "../types/resultTypes";
import type {
  ClassSection,
  SchoolClass,
} from "../../School/types/schoolTypes";
import type { StudentOption } from "../../Attendance/types/attendanceTypes";

interface ResultExportModalProps {
  open: boolean;
  onClose: () => void;
  exams: ExamOption[];
  classes: SchoolClass[];
  sections: ClassSection[];
  students: StudentOption[];
  generating: boolean;
  onGenerate: (options: ResultExportOptions) => Promise<boolean>;
}

const inputClass =
  "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400";

const scopeButtonClass = (active: boolean): string =>
  `flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-2 text-xs font-medium transition ${
    active
      ? "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200"
      : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
  }`;

const studentFullName = (student: StudentOption): string =>
  [student.first_name, student.middle_name, student.last_name]
    .filter(Boolean)
    .join(" ");

/**
 * Small popup that collects "whose results" to export,
 * then triggers the immediate PDF download.
 */
const ResultExportModal = ({
  open,
  onClose,
  exams,
  classes,
  sections,
  students,
  generating,
  onGenerate,
}: ResultExportModalProps) => {
  const [scope, setScope] = useState<ResultExportScope>("exam");
  const [examId, setExamId] = useState("");
  const [classId, setClassId] = useState("");
  const [sectionId, setSectionId] = useState("");
  const [studentId, setStudentId] = useState("");

  // Fresh form every time the popup opens.
  const [prevOpen, setPrevOpen] = useState(open);

  if (open !== prevOpen) {
    setPrevOpen(open);

    if (open) {
      setScope("exam");
      setExamId("");
      setClassId("");
      setSectionId("");
      setStudentId("");
    }
  }

  const classSections = classId
    ? sections.filter((section) => section.class_id === classId)
    : sections;

  const studentPool = classId
    ? students.filter((student) => student.class_id === classId)
    : students;

  const selectedExam = exams.find((exam) => exam.id === examId);
  const selectedClass = classes.find((item) => item.id === classId);
  const selectedSection = sections.find((item) => item.id === sectionId);
  const selectedStudent = students.find((item) => item.id === studentId);

  const scopeLabel = (): string => {
    const examName = selectedExam?.name ?? "all exams";
    if (scope === "exam") {
      return `Whole exam: ${examName}`;
    }
    if (scope === "class") {
      const classPart = selectedClass?.class_name ?? "all classes";
      const sectionPart = selectedSection
        ? ` - ${selectedSection.section_name}`
        : " (all sections)";
      return `Class: ${classPart}${sectionPart} - ${examName}`;
    }
    return `Student: ${selectedStudent ? studentFullName(selectedStudent) : "unknown"} - ${examName}`;
  };

  const examMissing = !examId;
  const classMissing = scope === "class" && !classId;
  const studentMissing = scope === "student" && (!studentId || !classId);
  const invalid = examMissing || classMissing || studentMissing;

  const handleGenerate = async () => {
    if (invalid) {
      return;
    }

    const options: ResultExportOptions = {
      scope,
      examId,
      classId,
      sectionId,
      studentId,
      label: scopeLabel(),
    };

    const success = await onGenerate(options);

    if (success) {
      onClose();
    }
  };

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
      <div className="w-full max-w-md overflow-hidden rounded-xl bg-white shadow-xl">
        <header className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <h2 className="flex items-center gap-2 text-sm font-bold text-slate-800">
            <FileDown size={16} className="text-indigo-600" />
            Export Results Report
          </h2>
          <button
            type="button"
            onClick={onClose}
            disabled={generating}
            className="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          >
            <X size={15} />
          </button>
        </header>

        <div className="space-y-4 p-5">
          {/* Report scope */}
          <div>
            <span className="mb-1.5 block text-xs font-medium text-slate-500">
              Report for
            </span>
            <div className="flex gap-1 rounded-lg bg-slate-100 p-1">
              <button
                type="button"
                onClick={() => setScope("exam")}
                className={scopeButtonClass(scope === "exam")}
              >
                Entire Exam
              </button>
              <button
                type="button"
                onClick={() => {
                  setScope("class");
                  setStudentId("");
                }}
                className={scopeButtonClass(scope === "class")}
              >
                Class / Section
              </button>
              <button
                type="button"
                onClick={() => setScope("student")}
                className={scopeButtonClass(scope === "student")}
              >
                <GraduationCap size={13} />
                Student
              </button>
            </div>
          </div>

          {/* Exam */}
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-slate-500">
              Exam
            </span>
            <select
              value={examId}
              onChange={(event) => setExamId(event.target.value)}
              className={inputClass}
            >
              <option value="">Select exam</option>
              {exams.map((exam) => (
                <option key={exam.id} value={exam.id}>
                  {exam.name} ({exam.class_name}
                  {exam.section ? ` - ${exam.section}` : ""})
                </option>
              ))}
            </select>
          </label>

          {/* Class + section (class / student scope) */}
          {scope !== "exam" && (
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1.5 block text-xs font-medium text-slate-500">
                  Class
                </span>
                <select
                  value={classId}
                  onChange={(event) => {
                    setSectionId("");
                    setStudentId("");
                    setClassId(event.target.value);
                  }}
                  className={inputClass}
                >
                  <option value="">Select class</option>
                  {classes.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.class_name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="mb-1.5 block text-xs font-medium text-slate-500">
                  Section
                </span>
                <select
                  value={sectionId}
                  onChange={(event) => {
                    setStudentId("");
                    setSectionId(event.target.value);
                  }}
                  disabled={!classId}
                  className={`${inputClass} disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400`}
                >
                  <option value="">All sections</option>
                  {classSections.map((section) => (
                    <option key={section.id} value={section.id}>
                      {section.section_name}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          )}

          {/* Student (student scope) */}
          {scope === "student" && (
            <label className="block">
              <span className="mb-1.5 block text-xs font-medium text-slate-500">
                Student
              </span>
              <select
                value={studentId}
                onChange={(event) => setStudentId(event.target.value)}
                disabled={!classId}
                className={`${inputClass} disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400`}
              >
                <option value="">
                  {classId ? "Select student" : "Select a class first"}
                </option>
                {studentPool.map((student) => (
                  <option key={student.id} value={student.id}>
                    {studentFullName(student)}
                    {student.admission_number
                      ? ` (${student.admission_number})`
                      : ""}
                  </option>
                ))}
              </select>
            </label>
          )}

          {/* Scope preview */}
          <p className="truncate rounded-lg bg-indigo-50 px-3 py-2 text-xs font-medium text-indigo-700">
            Export: {scopeLabel()}
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center gap-3 border-t border-slate-100 px-5 py-4">
          {invalid && !generating && (
            <p className="mr-auto flex items-center gap-1.5 text-xs font-medium text-rose-600">
              <AlertCircle size={13} />
              {examMissing
                ? "Select an exam to continue."
                : scope === "class"
                  ? "Select a class to continue."
                  : "Select a class and student to continue."}
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

export default ResultExportModal;

