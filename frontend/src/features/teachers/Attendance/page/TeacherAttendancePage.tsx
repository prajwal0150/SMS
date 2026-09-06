import { useMemo, useState } from "react";
import { motion } from "motion/react";
import type { Variants } from "motion/react";
import toast from "react-hot-toast";
import { Filter, Loader2, UserCheck } from "lucide-react";

import { useTeacherProfile } from "../../hooks/useTeacherProfile";
import { useSchoolLookups } from "../../../admin/School/hooks/useSchoolLookups";

import {
  fetchClassStudents,
  fetchAttendanceForClass,
  saveStudentAttendance,
} from "../services/attendanceService";

import type {
  AttendanceStatus,
  StudentAttendance,
} from "../types/attendanceTypes";

const todayString = (): string =>
  new Date().toISOString().slice(0, 10);

const inputClass =
  "h-9 w-full rounded-lg border border-slate-200 bg-slate-50/70 px-3 text-xs text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10";

const labelClass =
  "mb-1 block text-[11px] font-semibold text-slate-500";

/* Staggered fade-up entrance for the whole page. */
const pageVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: "easeOut" },
  },
};

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

  // Filter values - everything comes from the admin's
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
  // effective value derived during render - this avoids setters in
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
    } (${effectiveSubject})`;

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
        `Attendance saved for ${loadedLabel} on ${date} - ${present} present, ${absent} absent`
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
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-6 text-center">
        <p className="text-sm font-semibold text-amber-700">
          We could not find your teacher profile.
        </p>
        <p className="mt-1 text-xs text-amber-600">
          Please contact the admin to link your account.
        </p>
      </div>
    );
  }

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="show"
      className="space-y-4"
    >
      {/* Compact header */}
      <motion.div
        variants={sectionVariants}
        className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between"
      >
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-indigo-600">
            Teacher Portal
          </p>
          <h1 className="mt-0.5 truncate text-lg font-bold tracking-tight text-slate-900 sm:text-xl">
            Student Attendance
          </h1>
          <p className="mt-0.5 text-xs text-slate-500">
            Pick a class, section, subject and date to take
            attendance.
          </p>
        </div>
      </motion.div>

      {/* Compact filters */}
      <motion.section
        variants={sectionVariants}
        className="rounded-lg border border-slate-200 bg-white p-4"
      >
        <h2 className="flex items-center gap-2 text-sm font-bold text-slate-900">
          <Filter size={14} className="text-indigo-600" />
          Filters
        </h2>

        <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          <div>
            <label htmlFor="atClass" className={labelClass}>
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
            <label htmlFor="atSection" className={labelClass}>
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
            <label htmlFor="atSubject" className={labelClass}>
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
            <label htmlFor="atDate" className={labelClass}>
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
              className="flex h-9 w-full items-center justify-center gap-1.5 rounded-lg bg-indigo-600 px-4 text-xs font-semibold text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loadingStudents ? (
                <>
                  <Loader2 size={13} className="animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  <UserCheck size={13} />
                  Load Students
                </>
              )}
            </button>
          </div>
        </div>
      </motion.section>


      {/* Students */}
      <motion.div variants={sectionVariants}>
        {students === null ? (
          <div className="rounded-lg border border-dashed border-slate-200 bg-white px-4 py-8 text-center">
            <UserCheck size={24} className="mx-auto text-slate-300" />
            <p className="mt-2 text-sm font-semibold text-slate-700">
              Select the filters above and press Load Students.
            </p>
            <p className="mt-1 text-xs text-slate-400">
              The student list comes from the students added by the
              admin for the chosen class and section.
            </p>
          </div>
        ) : students.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-200 bg-white px-4 py-8 text-center">
            <p className="text-sm font-semibold text-slate-700">
              No students found for {loadedLabel}.
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Ask the admin to add students to this class and
              section.
            </p>
          </div>
        ) : (
          <section className="overflow-hidden rounded-lg border border-slate-200 bg-white">
            {/* Roster header */}
            <header className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 px-4 py-3">
              <div className="min-w-0">
                <h2 className="truncate text-sm font-bold text-slate-900">
                  {loadedLabel}
                </h2>
                <p className="mt-0.5 text-[11px] font-medium text-slate-400">
                  {date} - {students.length} students
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-1.5">
                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-600">
                  {presentCount} present
                </span>
                <span className="rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-semibold text-rose-600">
                  {absentCount} absent
                </span>
              </div>
            </header>

            {/* Roster table */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[480px] border-collapse text-sm">
                <thead>
                  <tr>
                    <th className="border-b border-slate-200 bg-slate-50 px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                      Roll
                    </th>
                    <th className="border-b border-slate-200 bg-slate-50 px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                      Student
                    </th>
                    <th className="border-b border-slate-200 bg-slate-50 px-3 py-2 text-right text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>

                  {students.map((student) => (
                    <tr
                      key={student.id}
                      className="border-b border-slate-50 transition-colors last:border-0 hover:bg-slate-50/70"
                    >
                      <td className="px-3 py-2 text-xs font-semibold text-slate-400">
                        {student.roll}
                      </td>
                      <td className="px-3 py-2 text-sm font-semibold text-slate-800">
                        {student.name}
                      </td>
                      <td className="px-3 py-2">
                        <div className="flex justify-end">
                          <div className="inline-flex rounded-full bg-slate-100 p-0.5">
                            <button
                              type="button"
                              onClick={() =>
                                setStatus(student.id, "Present")
                              }
                              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold transition-colors ${
                                student.status === "Present"
                                  ? "bg-emerald-600 text-white"
                                  : "text-slate-500 hover:text-slate-700"
                              }`}
                            >
                              <span className="h-1.5 w-1.5 rounded-full bg-current" />
                              Present
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                setStatus(student.id, "Absent")
                              }
                              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold transition-colors ${
                                student.status === "Absent"
                                  ? "bg-rose-600 text-white"
                                  : "text-slate-500 hover:text-slate-700"
                              }`}
                            >
                              <span className="flex h-1.5 w-1.5 items-center justify-center rounded-full border-[1.5px] border-current" />
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

            {/* Roster footer */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 px-4 py-3">
              <button
                type="button"
                onClick={handleMarkAllPresent}
                className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-50"
              >
                Mark all present
              </button>

              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? (
                  <>
                    <Loader2 size={13} className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <UserCheck size={13} />
                    Save Attendance
                  </>
                )}
              </button>
            </div>
          </section>
        )}
      </motion.div>
    </motion.div>
  );
};

export default TeacherAttendancePage;

