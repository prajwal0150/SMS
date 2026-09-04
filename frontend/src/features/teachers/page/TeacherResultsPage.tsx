import { useEffect, useState } from "react";
import { GraduationCap, Save } from "lucide-react";
import toast from "react-hot-toast";

import PageHeader from "../components/PageHeader";

import { useTeacherProfile } from "../hooks/useTeacherProfile";
import { useSchoolLookups } from "../../admin/School/hooks/useSchoolLookups";

import {
  computeGrade,
  fetchClassStudents,
  fetchExamResults,
  fetchExamsByClass,
  saveExamResults,
} from "../services/teacherService";

interface MarksRow {
  id: string;
  roll: string;
  name: string;
  marks: string;
  savedMarks: number | null;
  savedGrade: string | null;
}

const inputClasses =
  "w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400";

const GRADE_STYLES: Record<string, string> = {
  "A+": "bg-green-100 text-green-700",
  A: "bg-green-50 text-green-600",
  "B+": "bg-blue-50 text-blue-600",
  B: "bg-indigo-50 text-indigo-600",
  C: "bg-amber-50 text-amber-600",
  D: "bg-orange-50 text-orange-600",
  F: "bg-red-50 text-red-600",
};

const fullName = (row: {
  first_name: string | null;
  last_name: string | null;
}) =>
  [row.first_name, row.last_name]
    .filter(Boolean)
    .join(" ") || "Unnamed student";

const TeacherResultsPage = () => {
  const { profile } = useTeacherProfile();

  const { classes, sections, subjects, classSubjects } =
    useSchoolLookups();

  // Filters driven by the teacher's assigned
  // classes + School Management setup.
  const [className, setClassName] = useState("");
  const [section, setSection] = useState("");
  const [subject, setSubject] = useState("");
  const [examId, setExamId] = useState("");
  const [totalMarks, setTotalMarks] = useState("100");

  const [exams, setExams] = useState<
    Awaited<
      ReturnType<typeof fetchExamsByClass>
    >
  >([]);
  const [rows, setRows] = useState<MarksRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const classId = classes.find(
    (cls) => cls.class_name === className
  )?.id;

  // Section + subject options follow the chosen class.
  const sectionOptions = sections.filter(
    (item) => item.class_id === classId
  );

  const subjectOptions = classSubjects
    .filter((entry) => entry.class_id === classId)
    .map((entry) => entry.subjects?.subject_name)
    .filter((name): name is string => Boolean(name))
    .sort();

  const sectionId = sectionOptions.find(
    (item) => item.section_name === section
  )?.id;

  const resolvedSubjectId = subjects.find(
    (item) => item.subject_name === subject
  )?.id;

  // Load the exams the admin scheduled for the class
  // whenever the class or section changes.
  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      if (!className) {
        setExams([]);
        return;
      }

      try {
        const data = await fetchExamsByClass(
          className,
          section || undefined
        );

        if (!cancelled) {
          setExams(data);
        }
      } catch {
        if (!cancelled) {
          setExams([]);
        }
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [className, section]);

  const handleClassChange = (value: string) => {
    setClassName(value);
    setSection("");
    setSubject("");
    setExamId("");
    setRows([]);
  };

  const handleLoad = async () => {
    if (!className || !section || !subject) {
      toast.error(
        "Please select class, section and subject first."
      );
      return;
    }

    if (!examId) {
      toast.error("Please select an exam first.");
      return;
    }

    if (!classId || !sectionId || !resolvedSubjectId) {
      toast.error(
        "Class, section or subject is not configured yet. Ask the admin to set it up on School Management."
      );
      return;
    }

    setLoading(true);
    setRows([]);

    try {
      const [studentRows, saved] =
        await Promise.all([
          fetchClassStudents(className, section),
          fetchExamResults({
            examId,
            subjectId: resolvedSubjectId,
          }),
        ]);

      const savedByStudent = new Map(
        saved.map((item) => [
          item.student_id,
          item,
        ])
      );

      const list: MarksRow[] = studentRows.map(
        (row) => {
          const existing =
            savedByStudent.get(row.id);

          return {
            id: row.id,
            roll: row.roll_number ?? "",
            name: fullName(row),
            marks: existing
              ? String(existing.marks_obtained)
              : "",
            savedMarks: existing
              ? existing.marks_obtained
              : null,
            savedGrade: existing?.grade ?? null,
          };
        }
      );

      setRows(list);

      toast.success(
        `${list.length} students loaded for ${className} - ${section} · ${subject}`
      );
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to load students."
      );
    } finally {
      setLoading(false);
    }
  };

  const setMarks = (id: string, value: string) => {
    setRows((prev) =>
      prev.map((row) =>
        row.id === id
          ? { ...row, marks: value }
          : row
      )
    );
  };

  const handleSave = async () => {
    if (!profile) {
      toast.error("Teacher profile not found.");
      return;
    }

    if (
      !classId ||
      !sectionId ||
      !resolvedSubjectId ||
      !examId
    ) {
      toast.error("Select class, section, subject and exam first.");
      return;
    }

    const total = Number(totalMarks);

    if (!total || total <= 0) {
      toast.error(
        "Total marks must be greater than zero."
      );
      return;
    }

    const filled = rows.filter(
      (row) => row.marks !== ""
    );

    if (filled.length === 0) {
      toast.error("Enter marks for at least one student.");
      return;
    }

    const invalid = filled.find(
      (row) =>
        Number.isNaN(Number(row.marks)) ||
        Number(row.marks) < 0 ||
        Number(row.marks) > total
    );

    if (invalid) {
      toast.error(
        `Marks for ${invalid.name} must be between 0 and ${total}.`
      );
      return;
    }

    setSaving(true);

    try {
      await saveExamResults(
        filled.map((row) => ({
          student_id: row.id,
          teacher_id: profile.id,
          exam_id: examId,
          class_id: classId,
          section_id: sectionId,
          subject_id: resolvedSubjectId,
          marks_obtained: Number(row.marks),
          total_marks: total,
          grade: computeGrade(
            Number(row.marks),
            total
          ),
        }))
      );

      setRows((prev) =>
        prev.map((row) =>
          row.marks === ""
            ? row
            : {
                ...row,
                savedMarks: Number(row.marks),
                savedGrade: computeGrade(
                  Number(row.marks),
                  total
                ),
              }
        )
      );

      toast.success(
        `Results saved for ${filled.length} students.`
      );
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to save results."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <PageHeader
        title="Results"
        description="Enter marks for the exams scheduled by the admin."
      />

      <section className="rounded-lg border border-slate-200 bg-white p-6">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <label className="block">
            <span className="mb-1 block text-xs font-semibold text-slate-500">
              Class
            </span>
            <select
              value={className}
              onChange={(event) =>
                handleClassChange(
                  event.target.value
                )
              }
              className={inputClasses}
            >
              <option value="">
                Select class
              </option>
              {classes.map((item) => (
                <option
                  key={item.id}
                  value={item.class_name}
                >
                  {item.class_name}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-1 block text-xs font-semibold text-slate-500">
              Section
            </span>
            <select
              value={section}
              onChange={(event) => {
                setSection(
                  event.target.value
                );
                setExamId("");
                setRows([]);
              }}
              disabled={!className}
              className={inputClasses}
            >
              <option value="">
                {className
                  ? "Select section"
                  : "Choose class first"}
              </option>
              {sectionOptions.map((item) => (
                <option
                  key={item.id}
                  value={item.section_name}
                >
                  {item.section_name}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-1 block text-xs font-semibold text-slate-500">
              Subject
            </span>
            <select
              value={subject}
              onChange={(event) => {
                setSubject(
                  event.target.value
                );
                setRows([]);
              }}
              disabled={!className}
              className={inputClasses}
            >
              <option value="">
                {className
                  ? subjectOptions.length ===
                    0
                    ? "No subjects assigned to this class"
                    : "Select subject"
                  : "Choose class first"}
              </option>
              {subjectOptions.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-1 block text-xs font-semibold text-slate-500">
              Exam
            </span>
            <select
              value={examId}
              onChange={(event) => {
                setExamId(
                  event.target.value
                );
                setRows([]);
              }}
              disabled={!className}
              className={inputClasses}
            >
              <option value="">
                {className
                  ? exams.length === 0
                    ? "No exams scheduled for this class"
                    : "Select exam"
                  : "Choose class first"}
              </option>
              {exams.map((exam) => (
                <option
                  key={exam.id}
                  value={exam.id}
                >
                  {exam.name} (
                  {exam.start_date})
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-1 block text-xs font-semibold text-slate-500">
              Total marks
            </span>
            <input
              type="number"
              min={1}
              value={totalMarks}
              onChange={(event) =>
                setTotalMarks(
                  event.target.value
                )
              }
              className={inputClasses}
            />
          </label>

          <div className="flex items-end">
            <button
              type="button"
              onClick={handleLoad}
              disabled={loading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-50"
            >
              <GraduationCap size={16} />
              {loading
                ? "Loading..."
                : "Load students"}
            </button>
          </div>
        </div>
      </section>

      {rows.length > 0 && (
        <section className="mt-6 rounded-lg border border-slate-200 bg-white">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-6 py-4">
            <h3 className="font-bold text-slate-900">
              Marks sheet · {className} -{" "}
              {section} · {subject}
            </h3>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-50"
            >
              <Save size={16} />
              {saving
                ? "Saving..."
                : "Save results"}
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-400">
                  <th className="px-6 py-3 font-semibold">
                    Roll
                  </th>
                  <th className="px-6 py-3 font-semibold">
                    Student
                  </th>
                  <th className="px-6 py-3 font-semibold">
                    Marks
                  </th>
                  <th className="px-6 py-3 font-semibold">
                    Grade
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => {
                  const value = Number(
                    row.marks
                  );
                  const live =
                    row.marks !== "" &&
                    !Number.isNaN(value)
                      ? computeGrade(
                          value,
                          Number(totalMarks) ||
                            100
                        )
                      : null;

                  return (
                    <tr
                      key={row.id}
                      className="border-b border-slate-100 last:border-0"
                    >
                      <td className="px-6 py-3 font-medium text-slate-500">
                        {row.roll || "—"}
                      </td>
                      <td className="px-6 py-3 font-semibold text-slate-900">
                        {row.name}
                      </td>
                      <td className="px-6 py-3">
                        <input
                          type="number"
                          min={0}
                          max={
                            Number(
                              totalMarks
                            ) || 100
                          }
                          value={row.marks}
                          onChange={(
                            event
                          ) =>
                            setMarks(
                              row.id,
                              event
                                .target
                                .value
                            )
                          }
                          placeholder={`0 - ${
                            Number(
                              totalMarks
                            ) || 100
                          }`}
                          className="w-24 rounded-md border border-slate-300 px-2 py-1.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                        />
                      </td>
                      <td className="px-6 py-3">
                        {live ? (
                          <span
                            className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-bold ${GRADE_STYLES[live] ?? "bg-slate-100 text-slate-600"}`}
                          >
                            {live}
                          </span>
                        ) : row.savedGrade ? (
                          <span
                            className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-bold ${GRADE_STYLES[row.savedGrade] ?? "bg-slate-100 text-slate-600"}`}
                          >
                            {row.savedGrade}{" "}
                            (saved)
                          </span>
                        ) : (
                          <span className="text-xs text-slate-300">
                            —
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {rows.length === 0 && !loading && (
        <p className="mt-6 rounded-lg border border-dashed border-slate-300 bg-white py-10 text-center text-sm text-slate-400">
          Pick a class, section, subject and exam, then
          load the students added by the admin to enter
          marks.
        </p>
      )}
    </>
  );
};

export default TeacherResultsPage;
