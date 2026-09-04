import { useState } from "react";
import { ClipboardList } from "lucide-react";

import Card from "../../dashboard/components/Card";
import DataState from "./DataState";

import { useSchoolLookups } from "../../School/hooks/useSchoolLookups";

import type {
  Teacher,
  TeacherAssignment,
  NewAssignmentInput,
} from "../types/staffManagmentTypes";


const inputClass =
  "h-11 w-full rounded-lg border border-slate-200 bg-slate-50/70 px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#166534] focus:bg-white focus:ring-4 focus:ring-[#166534]/10";


interface TeacherAssignmentsPanelProps {
  teachers: Teacher[];
  assignments: TeacherAssignment[];
  loading: boolean;
  saving: boolean;
  onCreate: (input: NewAssignmentInput) => Promise<boolean>;
  onReload: () => void;
}

const teacherName = (
  teachers: Teacher[],
  id: string
): string => {
  const teacher = teachers.find((item) => item.id === id);

  return teacher
    ? `${teacher.first_name} ${teacher.last_name}`
    : "Unknown teacher";
};


const TeacherAssignmentsPanel = ({
  teachers,
  assignments,
  loading,
  saving,
  onCreate,
  onReload,
}: TeacherAssignmentsPanelProps) => {

  const [teacherId, setTeacherId] = useState("");
  const [classId, setClassId] = useState("");
  const [section, setSection] = useState("");
  const [subject, setSubject] = useState("");

  const { classes, classSections, classSubjectNames, loading: schoolLoading } =
    useSchoolLookups(classId);

  const selectedClassName =
    classes.find((item) => item.id === classId)?.class_name ?? "";


  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!teacherId) {
      return;
    }

    const success = await onCreate({
      teacher_id: teacherId,
      class_name: selectedClassName,
      section: section || undefined,
      subject,
    });

    if (success) {
      setClassId("");
      setSection("");
      setSubject("");
    }
  };


  return (
    <Card
      title="Teacher Assignments"
      subtitle="Assign classes and subjects to teachers"
      className="overflow-hidden"
    >
      {/* Assignment form */}
      <form
        onSubmit={handleSubmit}
        className="mb-6 grid gap-4 rounded-lg border border-slate-200 bg-slate-50/60 p-4 sm:grid-cols-2 sm:p-5 lg:grid-cols-5"
      >
        <div>
          <label
            htmlFor="aTeacher"
            className="mb-2 block text-sm font-semibold text-slate-700"
          >
            Teacher
          </label>
          <select
            id="aTeacher"
            value={teacherId}
            onChange={(event) =>
              setTeacherId(event.target.value)
            }
            required
            className={inputClass}
          >
            <option value="">Select teacher</option>
            {teachers.map((teacher) => (
              <option key={teacher.id} value={teacher.id}>
                {teacher.first_name} {teacher.last_name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="aClass"
            className="mb-2 block text-sm font-semibold text-slate-700"
          >
            Class
          </label>
          <select
            id="aClass"
            value={classId}
            onChange={(event) => {
              setClassId(event.target.value);
              setSection("");
              setSubject("");
            }}
            required
            className={inputClass}
          >
            <option value="">
              {schoolLoading ? "Loading classes..." : "Select class"}
            </option>
            {classes.map((item) => (
              <option key={item.id} value={item.id}>
                {item.class_name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="aSection"
            className="mb-2 block text-sm font-semibold text-slate-700"
          >
            Section
          </label>
          <select
            id="aSection"
            value={section}
            onChange={(event) =>
              setSection(event.target.value)
            }
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
          <label
            htmlFor="aSubject"
            className="mb-2 block text-sm font-semibold text-slate-700"
          >
            Subject
          </label>
          <select
            id="aSubject"
            value={subject}
            onChange={(event) =>
              setSubject(event.target.value)
            }
            required
            disabled={!classId}
            className={inputClass}
          >
            <option value="">
              {classId
                ? "Select subject"
                : "Select a class first"}
            </option>
            {classSubjectNames.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
            {classId && classSubjectNames.length === 0 && (
              <option value="" disabled>
                No subjects assigned to this class yet
              </option>
            )}
          </select>
        </div>

        <div className="flex items-end">
          <button
            type="submit"
            disabled={saving}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#166534] px-4 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#14532D] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
          >
            <ClipboardList size={16} />
            {saving ? "Saving..." : "Assign"}
          </button>
        </div>
      </form>

      {/* Assignment list */}
      {loading || assignments.length === 0 ? (
        <DataState
          loading={loading}
          onReload={onReload}
          message="No assignments yet. Assign a class and subject above."
        />
      ) : (
        <ul className="divide-y divide-slate-100">
          {assignments.map((assignment) => (
            <li
              key={assignment.id}
              className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-900">
                  {teacherName(teachers, assignment.teacher_id)}
                </p>
                <p className="text-xs text-slate-500">
                  {assignment.class_name}
                  {assignment.section
                    ? ` - ${assignment.section}`
                    : ""}{" "}
                  · {assignment.subject}
                </p>
              </div>
              <span className="shrink-0 text-xs font-medium text-slate-400">
                {assignment.created_at.slice(0, 10)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
};

export default TeacherAssignmentsPanel;