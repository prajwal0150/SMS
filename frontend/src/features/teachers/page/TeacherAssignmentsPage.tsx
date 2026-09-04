import { useEffect, useMemo, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

import PageHeader from "../components/PageHeader";

import { useTeacherProfile } from "../hooks/useTeacherProfile";
import { useSchoolLookups } from "../../admin/School/hooks/useSchoolLookups";

import {
  createClassAssignment,
  deleteClassAssignment,
  fetchClassAssignments,
  updateClassAssignmentStatus,
} from "../services/teacherService";
import type { ClassAssignmentRow } from "../services/teacherService";

import type { ClassAssignmentItem } from "../types/teacherTypes";

const STATUS_STYLES: Record<
  ClassAssignmentItem["status"],
  string
> = {
  Open: "bg-green-50 text-green-600",
  Grading: "bg-amber-50 text-amber-600",
  Closed: "bg-slate-100 text-slate-500",
};

const inputClasses =
  "w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400";

const TeacherAssignmentsPage = () => {
  const { profile } = useTeacherProfile();

  const { classes, sections, classSubjects } =
    useSchoolLookups();

  const [rows, setRows] = useState<
    ClassAssignmentItem[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  // Filters: class / section / subject / due date.
  const [fClass, setFClass] = useState("");
  const [fSection, setFSection] = useState("");
  const [fSubject, setFSubject] = useState("");
  const [fDueDate, setFDueDate] = useState("");

  // Create form fields.
  const [title, setTitle] = useState("");
  const [description, setDescription] =
    useState("");
  const [className, setClassName] = useState("");
  const [section, setSection] = useState("");
  const [subject, setSubject] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      if (!profile) {
        setRows([]);
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        const data =
          await fetchClassAssignments(
            profile.id
          );

        if (!cancelled) {
          setRows(data);
        }
      } catch (error) {
        if (!cancelled) {
          toast.error(
            error instanceof Error
              ? error.message
              : "Unable to load assignments."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [profile]);

  // Dropdown sources follow the class chosen in the form.
  const formClassId = classes.find(
    (item) => item.class_name === className
  )?.id;

  const formSections = sections.filter(
    (item) => item.class_id === formClassId
  );

  const formSubjects = classSubjects
    .filter(
      (entry) => entry.class_id === formClassId
    )
    .map((entry) => entry.subjects?.subject_name)
    .filter(
      (name): name is string => Boolean(name)
    )
    .sort();

  const filterClassId = classes.find(
    (item) => item.class_name === fClass
  )?.id;

  const filterSections = sections.filter(
    (item) => item.class_id === filterClassId
  );

  const filterSubjects = useMemo(
    () =>
      Array.from(
        new Set(
          rows
            .filter(
              (row) =>
                !fClass ||
                row.class_name === fClass
            )
            .map((row) => row.subject)
        )
      ).sort(),
    [rows, fClass]
  );

  const filtered = useMemo(
    () =>
      rows.filter(
        (row) =>
          (!fClass ||
            row.class_name === fClass) &&
          (!fSection ||
            row.section === fSection) &&
          (!fSubject ||
            row.subject === fSubject) &&
          (!fDueDate ||
            row.due_date === fDueDate)
      ),
    [rows, fClass, fSection, fSubject, fDueDate]
  );

  const openCount = rows.filter(
    (row) => row.status === "Open"
  ).length;

  const gradingCount = rows.filter(
    (row) => row.status === "Grading"
  ).length;

  const closedCount = rows.filter(
    (row) => row.status === "Closed"
  ).length;

  const handleCreate = async () => {
    if (!profile) {
      toast.error("Teacher profile not found.");
      return;
    }

    if (
      !title.trim() ||
      !className ||
      !subject ||
      !dueDate
    ) {
      toast.error(
        "Title, class, subject and due date are required."
      );
      return;
    }

    setSaving(true);

    try {
      const created =
        await createClassAssignment({
          teacher_id: profile.id,
          title: title.trim(),
          description: description.trim() || null,
          class_name: className,
          section: section || null,
          subject,
          due_date: dueDate,
        });

      setRows((prev) => [created, ...prev]);

      toast.success(
        `Assignment published for ${className}${
          section ? ` - ${section}` : ""
        } · ${subject}`
      );

      setTitle("");
      setDescription("");
      setClassName("");
      setSection("");
      setSubject("");
      setDueDate("");
      setShowForm(false);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to save the assignment."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleStatus = async (
    id: string,
    status: ClassAssignmentRow["status"]
  ) => {
    try {
      await updateClassAssignmentStatus(
        id,
        status
      );

      setRows((prev) =>
        prev.map((row) =>
          row.id === id
            ? { ...row, status }
            : row
        )
      );

      toast.success(
        `Assignment marked ${status.toLowerCase()}.`
      );
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to update the assignment."
      );
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteClassAssignment(id);

      setRows((prev) =>
        prev.filter((row) => row.id !== id)
      );

      toast.success("Assignment deleted.");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to delete the assignment."
      );
    }
  };

  return (
    <>
      <PageHeader
        title="Assignments"
        description="Create homework and track it class by class."
      />

      <div className="flex flex-wrap items-center gap-3">
        {[
          { label: "Open", value: openCount },
          { label: "Grading", value: gradingCount },
          { label: "Closed", value: closedCount },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2"
          >
            <p className="text-xs font-medium text-slate-400">
              {stat.label}
            </p>
            <p className="text-lg font-bold text-slate-900">
              {stat.value}
            </p>
          </div>
        ))}

        <button
          type="button"
          onClick={() => setShowForm((prev) => !prev)}
          className="ml-auto inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
        >
          <Plus size={16} />
          New Assignment
        </button>
      </div>

      {showForm && (
        <section className="mt-4 rounded-lg border border-slate-200 bg-white p-6">
          <h3 className="text-base font-bold text-slate-900">
            Create assignment
          </h3>

          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <label className="block">
              <span className="mb-1 block text-xs font-semibold text-slate-500">
                Title *
              </span>
              <input
                value={title}
                onChange={(event) =>
                  setTitle(event.target.value)
                }
                placeholder="e.g. Algebra worksheet 3"
                className={inputClasses}
              />
            </label>

            <label className="block">
              <span className="mb-1 block text-xs font-semibold text-slate-500">
                Class *
              </span>
              <select
                value={className}
                onChange={(event) => {
                  setClassName(event.target.value);
                  setSection("");
                  setSubject("");
                }}
                className={inputClasses}
              >
                <option value="">Select class</option>
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
                onChange={(event) =>
                  setSection(event.target.value)
                }
                disabled={!className}
                className={inputClasses}
              >
                <option value="">
                  {className
                    ? "Select section"
                    : "Choose class first"}
                </option>
                {formSections.map((item) => (
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
                Subject *
              </span>
              <select
                value={subject}
                onChange={(event) =>
                  setSubject(event.target.value)
                }
                disabled={!className}
                className={inputClasses}
              >
                <option value="">
                  {className
                    ? formSubjects.length === 0
                      ? "No subjects assigned to this class"
                      : "Select subject"
                    : "Choose class first"}
                </option>
                {formSubjects.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-1 block text-xs font-semibold text-slate-500">
                Due date *
              </span>
              <input
                type="date"
                value={dueDate}
                onChange={(event) =>
                  setDueDate(event.target.value)
                }
                className={inputClasses}
              />
            </label>

            <label className="block sm:col-span-2 lg:col-span-3">
              <span className="mb-1 block text-xs font-semibold text-slate-500">
                Description
              </span>
              <textarea
                value={description}
                onChange={(event) =>
                  setDescription(event.target.value)
                }
                rows={3}
                placeholder="Instructions for students..."
                className={inputClasses}
              />
            </label>
          </div>

          <div className="mt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleCreate}
              disabled={saving}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-50"
            >
              {saving
                ? "Publishing..."
                : "Publish assignment"}
            </button>
          </div>
        </section>
      )}

      <section className="mt-6 rounded-lg border border-slate-200 bg-white p-6">
        <h3 className="text-sm font-bold uppercase tracking-wide text-slate-400">
          Filters
        </h3>

        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <select
            value={fClass}
            onChange={(event) => {
              setFClass(event.target.value);
              setFSection("");
              setFSubject("");
            }}
            className={inputClasses}
          >
            <option value="">All classes</option>
            {Array.from(
              new Set(rows.map((row) => row.class_name))
            )
              .sort()
              .map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
          </select>

          <select
            value={fSection}
            onChange={(event) =>
              setFSection(event.target.value)
            }
            disabled={!fClass}
            className={inputClasses}
          >
            <option value="">All sections</option>
            {filterSections.map((item) => (
              <option
                key={item.id}
                value={item.section_name}
              >
                {item.section_name}
              </option>
            ))}
          </select>

          <select
            value={fSubject}
            onChange={(event) =>
              setFSubject(event.target.value)
            }
            className={inputClasses}
          >
            <option value="">All subjects</option>
            {filterSubjects.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>

          <input
            type="date"
            value={fDueDate}
            onChange={(event) =>
              setFDueDate(event.target.value)
            }
            className={inputClasses}
          />
        </div>

        <div className="mt-5 space-y-3">
          {loading ? (
            <p className="py-8 text-center text-sm text-slate-400">
              Loading assignments...
            </p>
          ) : filtered.length === 0 ? (
            <p className="py-8 text-center text-sm text-slate-400">
              No assignments match the selected
              filters.
            </p>
          ) : (
            filtered.map((row) => (
              <article
                key={row.id}
                className="rounded-lg border border-slate-200 p-4 transition hover:border-indigo-200"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="font-semibold text-slate-900">
                        {row.title}
                      </h4>
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_STYLES[row.status]}`}
                      >
                        {row.status}
                      </span>
                    </div>
                    <p className="mt-1 text-xs font-medium text-slate-500">
                      {row.class_name}
                      {row.section
                        ? ` - ${row.section}`
                        : ""}{" "}
                      · {row.subject} · Due{" "}
                      {row.due_date}
                    </p>
                    {row.description && (
                      <p className="mt-2 text-sm leading-6 text-slate-500">
                        {row.description}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={row.status}
                      onChange={(event) =>
                        handleStatus(
                          row.id,
                          event.target
                            .value as ClassAssignmentRow["status"]
                        )
                      }
                      className="rounded-md border border-slate-300 px-2 py-1.5 text-xs font-semibold text-slate-600"
                    >
                      <option value="Open">
                        Open
                      </option>
                      <option value="Grading">
                        Grading
                      </option>
                      <option value="Closed">
                        Closed
                      </option>
                    </select>

                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(row.id)
                      }
                      className="rounded-md border border-red-200 p-1.5 text-red-500 transition hover:bg-red-50"
                      aria-label="Delete assignment"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </section>
    </>
  );
};

export default TeacherAssignmentsPage;
