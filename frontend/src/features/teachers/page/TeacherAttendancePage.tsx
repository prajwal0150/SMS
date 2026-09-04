import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { UserCheck } from "lucide-react";

import PageHeader from "../components/PageHeader";
import Card from "../components/Card";

import { useTeacherProfile } from "../hooks/useTeacherProfile";
import { useSchoolLookups } from "../../admin/School/hooks/useSchoolLookups";

import {
  fetchClassStudents,
  fetchAttendanceForClass,
  saveStudentAttendance,
} from "../services/teacherService";

import type {
  AttendanceStatus,
  StudentAttendance,
} from "../types/teacherTypes";


const todayString = (): string =>
  new Date().toISOString().slice(0, 10);


const inputClass =
  "h-11 w-full rounded-lg border border-slate-200 bg-slate-50/70 px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10";


const fullName = (student: {
  first_name: string;
  middle_name: string | null;
  last_name: string;
}): string =>
  [student.first_name, student.middle_name, student.last_name]
    .filter(Boolean)
    .join(" ");


const TeacherAttendancePage = () => {
  const { profile, assignments, loading: profileLoading } =
    useTeacherProfile();

  // Filter values — everything comes from the admin's
  // School Management + teacher assignments.
  const [className, setClassName] = useState("");
  const [section, setSection] = useState("");
  const [subject, setSubject] = useState("");
  const [date, setDate] = useState(todayString());

  const [students, setStudents] =
    useState<StudentAttendance[] | null>(null);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loadedLabel, setLoadedLabel] = useState("");

  // Distinct classes the teacher is assigned to (by the admin).
  const classOptions = useMemo(
    () =>
      Array.from(
        new Set(assignments.map((item) => item.className))
      ),
    [assignments]
  );

  // When there is only one possible value we "pre-select" it via an
  // effective value derived during render — this avoids setters in
  // effects and keeps the filters in sync automatically.
  const effectiveClassName =
    className || (classOptions.length === 1 ? classOptions[0] : "");

  // Sections of the selected class the teacher teaches.
  const sectionOptions = useMemo(
    () =>
      Array.from(
        new Set(
          assignments
            .filter(
              (item) => item.className === effectiveClassName
            )
            .map((item) => item.section ?? "")
            .filter(Boolean)
        )
      ),
    [assignments, effectiveClassName]
  );

  const effectiveSection =
    section ||
    (effectiveClassName && sectionOptions.length === 1
      ? sectionOptions[0]
      : "");

  // Subjects of the selected class + section the teacher teaches.
  const subjectOptions = useMemo(
    () =>
      Array.from(
        new Set(
          assignments
            .filter(
              (item) =>
                item.className === effectiveClassName &&
                (!effectiveSection ||
                  item.section === effectiveSection)
            )
            .map((item) => item.subject)
            .filter(Boolean)
        )
      ),
    [assignments, effectiveClassName, effectiveSection]
  );

  const effectiveSubject =
    subject ||
    (effectiveClassName &&
    effectiveSection &&
    subjectOptions.length === 1
      ? subjectOptions[0]
      : "");

  // Master list from School Management (used to resolve names -> ids).
  const { classes, sections, subjects, loading: schoolLoading } =
    useSchoolLookups();

  const classId =
    classes.find(
      (item) => item.class_name === effectiveClassName
    )?.id;

  const sectionId =
    sections.find(
      (item) =>
        item.class_id === classId &&
        item.section_name === effectiveSection
    )?.id;

  const subjectId =
    subjects.find(
      (item) => item.subject_name === effectiveSubject
    )?.id;


  const handleClassChange = (value: string) => {
    setClassName(value);
    setSection("");
    setSubject("");
    setStudents(null);
  };


  const handleSectionChange = (value: string) => {
    setSection(value);
    setSubject("");
    setStudents(null);
  };


  const handleLoadStudents = async () => {
    if (!effectiveClassName || !effectiveSection) {
      toast.error("Please select a class and section first.");
      return;
    }

    if (!effectiveSubject) {
      toast.error("Please select a subject first.");
      return;
    }

    if (!classId || !sectionId || !subjectId) {
      toast.error(
        "Class, section or subject is not configured yet. Ask the admin to set it up on School Management."
      );
      return;
    }

    const label = `${effectiveClassName}${
      effectiveSection ? ` - ${effectiveSection}` : ""
    } · ${effectiveSubject}`;

    setLoadingStudents(true);
    setStudents(null);

    try {
      // Real students added by the admin for that class + section.
      const rows = await fetchClassStudents(
        effectiveClassName,
        effectiveSection
      );

      // Pre-fill saved attendance for that class/section/subject/date.
      const existing = await fetchAttendanceForClass({
        classId,
        sectionId,
        subjectId,
        date,
      });

      const existingByStudent = new Map(
        existing.map((item) => [item.student_id, item.status])
      );

      const list: StudentAttendance[] = rows.map((row) => ({
        id: row.id,
        roll: row.roll_number ?? "",
        name: fullName(row),
        status:
          existingByStudent.get(row.id) === "absent"
            ? "Absent"
            : "Present",
      }));

      setStudents(list);
      setLoadedLabel(label);

      toast.success(
        `${list.length} students loaded for ${label}`
      );
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to load students."
      );
    } finally {
      setLoadingStudents(false);
    }
  };


  const setStatus = (id: string, status: AttendanceStatus) => {
    setStudents((prev) =>
      prev === null
        ? prev
        : prev.map((student) =>
            student.id === id
              ? { ...student, status }
              : student
          )
    );
  };


  const handleMarkAllPresent = () => {
    setStudents((prev) =>
      prev === null
        ? prev
        : prev.map((student) => ({
            ...student,
            status: "Present" as AttendanceStatus,
          }))
    );
  };


  const handleSave = async () => {
    if (!students || students.length === 0) {
      toast.error("Load students first.");
      return;
    }

    if (!profile) {
      toast.error("Teacher profile not found.");
      return;
    }

    setSaving(true);

    try {
      const rows = students.map((student) => ({
        student_id: student.id,
        teacher_id: profile.id,
        class_id: classId as string,
        section_id: sectionId as string,
        subject_id: subjectId ?? null,
        attendance_date: date,
        status:
          student.status === "Present"
            ? ("present" as const)
            : ("absent" as const),
      }));

      await saveStudentAttendance(rows);

      const present = students.filter(
        (student) => student.status === "Present"
      ).length;
      const absent = students.length - present;

      toast.success(
        `Attendance saved for ${loadedLabel} on ${date} — ${present} present, ${absent} absent`
      );
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to save attendance."
      );
    } finally {
      setSaving(false);
    }
  };


  const presentCount =
    students?.filter(
      (student) => student.status === "Present"
    ).length ?? 0;

  const absentCount =
    students === null ? 0 : students.length - presentCount;

  // No teacher profile (e.g. admin-created account not linked).
  if (!profileLoading && !profile) {
    return (
      <>
        <PageHeader
          title="Student Attendance"
          description="Mark attendance for your classes."
        />
        <Card className="text-center">
          <div className="flex flex-col items-center gap-2 px-4 py-10">
            <UserCheck size={28} className="text-slate-300" />
            <p className="text-sm font-medium text-slate-700">
              We could not find your teacher profile.
            </p>
            <p className="text-xs text-slate-500">
              Please contact the admin to link your account.
            </p>
          </div>
        </Card>
      </>
    );
  }

  return (
    <>
      <PageHeader
          title="Student Attendance"
          description="Pick a class, section, subject and date to take attendance."
        />

        {/* Filters */}
        <Card>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            <div>
              <label htmlFor="atClass" className="mb-2 block text-sm font-semibold text-slate-700">
                Class
              </label>
              <select
                id="atClass"
                value={effectiveClassName}
                onChange={(event) => handleClassChange(event.target.value)}
                className={inputClass}
              >
                <option value="">
                  {profileLoading || schoolLoading
                    ? "Loading classes..."
                    : "Select class"}
                </option>
                {classOptions.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="atSection" className="mb-2 block text-sm font-semibold text-slate-700">
                Section
              </label>
              <select
                id="atSection"
                value={effectiveSection}
                onChange={(event) => handleSectionChange(event.target.value)}
                disabled={!effectiveClassName}
                className={inputClass}
              >
                <option value="">Select section</option>
                {sectionOptions.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="atSubject" className="mb-2 block text-sm font-semibold text-slate-700">
                Subject
              </label>
              <select
                id="atSubject"
                value={effectiveSubject}
                onChange={(event) => {
                  setSubject(event.target.value);
                  setStudents(null);
                }}
                disabled={!effectiveSection}
                className={inputClass}
              >
                <option value="">Select subject</option>
                {subjectOptions.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="atDate" className="mb-2 block text-sm font-semibold text-slate-700">
                Date
              </label>
              <input
                id="atDate"
                type="date"
                value={date}
                onChange={(event) => {
                  setDate(event.target.value);
                  setStudents(null);
                }}
                className={inputClass}
              />
            </div>

            <div className="flex items-end">
              <button
                type="button"
                onClick={handleLoadStudents}
                disabled={loadingStudents || !classId || !sectionId || !subjectId}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
              >
                {loadingStudents ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Loading...
                  </>
                ) : (
                  <>
                    <UserCheck size={16} />
                    Load Students
                  </>
                )}
              </button>
            </div>
          </div>
        </Card>
      <div className="mt-6">
          {students === null ? (
            <div className="rounded-lg border border-dashed border-slate-300 bg-white p-10 text-center">
              <p className="text-sm font-semibold text-slate-700">
                Select the filters above and press Load Students.
              </p>
              <p className="mt-1 text-sm text-slate-500">
                The student list comes from the students added by the admin
                for the chosen class and section.
              </p>
            </div>
          ) : students.length === 0 ? (
            <div className="rounded-lg border border-dashed border-slate-300 bg-white p-10 text-center">
              <p className="text-sm font-semibold text-slate-700">
                No students found for {loadedLabel}.
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Ask the admin to add students to this class and section.
              </p>
            </div>
          ) : (
            <Card
              title={`${loadedLabel} · ${date}`}
              subtitle={`${students.length} students — ${presentCount} present, ${absentCount} absent`}
              className="overflow-hidden"
            >
              <div className="overflow-x-auto">
                <table className="w-full min-w-[520px] border-collapse text-sm">
                  <thead>
                    <tr>
                      <th className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Roll
                      </th>
                      <th className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Student
                      </th>
                      <th className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student) => (
                      <tr
                        key={student.id}
                        className="border-b border-slate-100 transition last:border-0"
                      >
                        <td className="px-4 py-3 font-semibold text-slate-400">
                          {student.roll}
                        </td>
                        <td className="px-4 py-3 font-semibold text-slate-900">
                          {student.name}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex justify-end">
                            <div className="inline-flex rounded-full bg-slate-100 p-1">
                              <button
                                type="button"
                                onClick={() =>
                                  setStatus(
                                    student.id,
                                    "Present"
                                  )
                                }
                                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                                  student.status === "Present"
                                    ? "bg-green-600 text-white"
                                    : "text-slate-500 hover:text-slate-700"
                                }`}
                              >
                                <span className="h-2 w-2 rounded-full bg-current" />
                                Present
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  setStatus(
                                    student.id,
                                    "Absent"
                                  )
                                }
                                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                                  student.status === "Absent"
                                    ? "bg-red-600 text-white"
                                    : "text-slate-500 hover:text-slate-700"
                                }`}
                              >
                                <span className="flex h-2 w-2 items-center justify-center rounded-full border-[1.5px] border-current" />
                                Absent
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={handleMarkAllPresent}
                  className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                >
                  Mark all present
                </button>

                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? "Saving..." : "Save Attendance"}
                </button>
              </div>
            </Card>
          )}
        </div>
    </>
  );
};

export default TeacherAttendancePage;