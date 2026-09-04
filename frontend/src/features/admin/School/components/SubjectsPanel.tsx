import { useState } from "react";
import { FileText, ClipboardList, Plus, Trash2 } from "lucide-react";

import Card from "../../dashboard/components/Card";
import DataState from "./DataState";

import type {
  AttachSubjectInput,
  ClassSubject,
  Subject,
  SubjectType,
} from "../types/schoolTypes";


const inputClass =
  "h-11 w-full rounded-lg border border-slate-200 bg-slate-50/70 px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#166534] focus:bg-white focus:ring-4 focus:ring-[#166534]/10";


const TYPE_STYLES: Record<SubjectType, string> = {
  core: "bg-[#166534]/10 text-[#166534]",
  elective: "bg-indigo-50 text-indigo-600",
  language: "bg-[#1E3A5F]/10 text-[#1E3A5F]",
  practical: "bg-amber-50 text-amber-700",
  activity: "bg-purple-50 text-purple-600",
};


interface SubjectsPanelProps {
  classId: string;
  className: string;
  classSubjects: ClassSubject[];
  subjects: Subject[];
  loading: boolean;
  saving: boolean;
  error: string | null;
  onAdd: (input: AttachSubjectInput) => Promise<boolean>;
  onRemove: (id: string) => void;
  onReload: () => void;
}

const SubjectsPanel = ({
  classId,
  className,
  classSubjects,
  subjects,
  loading,
  saving,
  error,
  onAdd,
  onRemove,
  onReload,
}: SubjectsPanelProps) => {
  const [mode, setMode] = useState<"existing" | "new">("existing");
  const [subjectId, setSubjectId] = useState("");
  const [subjectName, setSubjectName] = useState("");
  const [subjectCode, setSubjectCode] = useState("");
  const [subjectType, setSubjectType] = useState<SubjectType>("core");
  const [isCompulsory, setIsCompulsory] = useState(true);
  const [weeklyPeriods, setWeeklyPeriods] = useState("5");


  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const input: AttachSubjectInput = {
      class_id: classId,
      subject_id: subjectId,
      is_compulsory: isCompulsory,
      weekly_periods: weeklyPeriods.trim() ? Number(weeklyPeriods) : 5,
    };

    if (mode === "new") {
      input.newSubject = {
        subject_name: subjectName.trim(),
        subject_code: subjectCode.trim(),
        subject_type: subjectType,
      };
    }

    const success = await onAdd(input);

    if (success) {
      setSubjectId("");
      setSubjectName("");
      setSubjectCode("");
      setSubjectType("core");
      setIsCompulsory(true);
      setWeeklyPeriods("5");
    }
  };


  const alreadyAssignedIds = new Set(
    classSubjects.map((item) => item.subject_id)
  );

  const availableSubjects = subjects.filter(
    (subject) => !alreadyAssignedIds.has(subject.id)
  );


  return (
    <Card
      title="Subjects"
      subtitle={`${classSubjects.length} subject${classSubjects.length === 1 ? "" : "s"} in ${className}`}
      action={
        !loading && !error && classSubjects.length > 0 ? (
          <span className="rounded-full bg-[#D4A017]/15 px-3 py-1 text-xs font-semibold text-[#8A6A0D]">
            {classSubjects.length} Total
          </span>
        ) : undefined
      }
      className="h-full overflow-hidden"
    >
      <form
        onSubmit={handleSubmit}
        className="mb-5 space-y-4 rounded-lg border border-slate-200 bg-slate-50/60 p-4"
      >
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setMode("existing")}
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition ${
              mode === "existing"
                ? "bg-[#166534] text-white"
                : "bg-white text-slate-600 hover:text-[#166534]"
            }`}
          >
            <ClipboardList size={13} />
            Existing subject
          </button>
          <button
            type="button"
            onClick={() => setMode("new")}
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition ${
              mode === "new"
                ? "bg-[#166534] text-white"
                : "bg-white text-slate-600 hover:text-[#166534]"
            }`}
          >
            <Plus size={13} />
            Create new
          </button>
        </div>

        {mode === "existing" ? (
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label htmlFor="subSelect" className="mb-2 block text-sm font-semibold text-slate-700">
                Subject
              </label>
              <select
                id="subSelect"
                value={subjectId}
                onChange={(event) => setSubjectId(event.target.value)}
                required
                className={inputClass}
              >
                <option value="">Select a subject</option>
                {availableSubjects.map((subject) => (
                  <option key={subject.id} value={subject.id}>
                    {subject.subject_name} ({subject.subject_code})
                  </option>
                ))}
                {availableSubjects.length === 0 && (
                  <option value="" disabled>
                    All subjects already assigned
                  </option>
                )}
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Weekly Periods
              </label>
              <input
                type="number"
                min={1}
                value={weeklyPeriods}
                onChange={(event) => setWeeklyPeriods(event.target.value)}
                className={inputClass}
              />
            </div>
            <div className="flex items-end">
              <label className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700">
                <input
                  type="checkbox"
                  checked={isCompulsory}
                  onChange={(event) => setIsCompulsory(event.target.checked)}
                  className="h-4 w-4 accent-[#166534]"
                />
                Compulsory
              </label>
            </div>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label htmlFor="nSubName" className="mb-2 block text-sm font-semibold text-slate-700">
                Subject Name
              </label>
              <input
                id="nSubName"
                type="text"
                value={subjectName}
                onChange={(event) => setSubjectName(event.target.value)}
                required
                placeholder="e.g. Physics"
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="nSubCode" className="mb-2 block text-sm font-semibold text-slate-700">
                Subject Code
              </label>
              <input
                id="nSubCode"
                type="text"
                value={subjectCode}
                onChange={(event) => setSubjectCode(event.target.value)}
                required
                placeholder="e.g. PHY"
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="nSubType" className="mb-2 block text-sm font-semibold text-slate-700">
                Subject Type
              </label>
              <select
                id="nSubType"
                value={subjectType}
                onChange={(event) => setSubjectType(event.target.value as SubjectType)}
                className={inputClass}
              >
                <option value="core">Core</option>
                <option value="elective">Elective</option>
                <option value="language">Language</option>
                <option value="practical">Practical</option>
                <option value="activity">Activity</option>
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Weekly Periods
              </label>
              <input
                type="number"
                min={1}
                value={weeklyPeriods}
                onChange={(event) => setWeeklyPeriods(event.target.value)}
                className={inputClass}
              />
            </div>
            <div className="flex items-end">
              <label className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700">
                <input
                  type="checkbox"
                  checked={isCompulsory}
                  onChange={(event) => setIsCompulsory(event.target.checked)}
                  className="h-4 w-4 accent-[#166534]"
                />
                Compulsory
              </label>
            </div>
            <div>
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
                    Create & Assign
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {mode === "existing" && (
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
                <ClipboardList size={16} />
                Assign Subject
              </>
            )}
          </button>
        )}
      </form>

      {loading ? (
        <DataState loading onReload={onReload} />
      ) : error ? (
        <DataState error={error} onReload={onReload} />
      ) : classSubjects.length === 0 ? (
        <DataState message="No subjects assigned yet. Assign or create one above." />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr>
                <th className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Subject
                </th>
                <th className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Type
                </th>
                <th className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Details
                </th>
                <th className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
            {classSubjects.map((assignment) => {
              const subject = assignment.subjects;

              return (
                <tr
                  key={assignment.id}
                  className="border-b border-slate-100 transition last:border-0 hover:bg-slate-50/60"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <FileText size={15} className="shrink-0 text-slate-400" />
                      <div className="min-w-0">
                        <p className="font-medium text-slate-800">
                          {subject?.subject_name ?? "—"}
                        </p>
                        {subject?.subject_code && (
                          <p className="text-xs text-slate-500">
                            {subject.subject_code}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-3">
                    {subject ? (
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                          TYPE_STYLES[subject.subject_type] ?? "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {subject.subject_type}
                      </span>
                    ) : (
                      <span className="text-xs text-slate-400">—</span>
                    )}
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                        assignment.is_compulsory
                          ? "bg-[#166534]/10 text-[#166534]"
                          : "bg-slate-100 text-slate-600"
                      }`}>
                        {assignment.is_compulsory ? "Compulsory" : "Optional"}
                      </span>
                      <span className="inline-flex rounded-full bg-[#1E3A5F]/10 px-2.5 py-1 text-xs font-semibold text-[#1E3A5F]">
                        {assignment.weekly_periods} periods/wk
                      </span>
                    </div>
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => onRemove(assignment.id)}
                        title="Remove subject from class"
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
};

export default SubjectsPanel;
