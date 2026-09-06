import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import type { Variants } from "motion/react";
import {
  Filter,
  Loader2,
  Plus,
  Trash2,
} from "lucide-react";
import toast from "react-hot-toast";

import { useTeacherProfile } from "../../hooks/useTeacherProfile";
import { useSchoolLookups } from "../../../admin/School/hooks/useSchoolLookups";

import {
  createClassAssignment,
  deleteClassAssignment,
  fetchClassAssignments,
  updateClassAssignmentStatus,
} from "../services/assignmentService";
import type {
  ClassAssignmentItem,
  ClassAssignmentRow,
} from "../types/assignmentTypes";

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

const STATUS_STYLES: Record<
  ClassAssignmentItem["status"],
  string
> = {
  Open: "bg-emerald-50 text-emerald-600",
  Grading: "bg-amber-50 text-amber-600",
  Closed: "bg-slate-100 text-slate-500",
};

const STATUS_DOTS: Record<
  ClassAssignmentItem["status"],
  string
> = {
  Open: "bg-emerald-500",
  Grading: "bg-amber-500",
  Closed: "bg-slate-300",
};

const inputClasses =
  "h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400";

const labelClass =
  "mb-1 block text-[11px] font-semibold text-slate-500";

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
  const [description, setDescription] = useState("");
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
        const data = await fetchClassAssignments(profile.id);

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
    .filter((entry) => entry.class_id === formClassId)
    .map((entry) => entry.subjects?.subject_name)
    .filter((name): name is string => Boolean(name))
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
              (row) => !fClass || row.class_name === fClass
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
          (!fClass || row.class_name === fClass) &&
          (!fSection || row.section === fSection) &&
          (!fSubject || row.subject === fSubject) &&
          (!fDueDate || row.due_date === fDueDate)
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

    if (!title.trim() || !className || !subject || !dueDate) {
      toast.error(
        "Title, class, subject and due date are required."
      );
      return;
    }

    setSaving(true);

    try {
      const created = await createClassAssignment({
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
        } (${subject})`
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
      await updateClassAssignmentStatus(id, status);

      setRows((prev) =>
        prev.map((row) =>
          row.id === id ? { ...row, status } : row
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
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="show"
      className="space-y-4"
    >
      {/* Compact header with status chips */}
      <motion.div
        variants={sectionVariants}
        className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between"
      >
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-indigo-600">
            Teacher Portal
          </p>
          <h1 className="mt-0.5 truncate text-lg font-bold tracking-tight text-slate-900 sm:text-xl">
            Assignments
          </h1>
          <p className="mt-0.5 text-xs text-slate-500">
            Create homework and track it class by class.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {[
            { label: "Open", value: openCount },
            { label: "Grading", value: gradingCount },
            { label: "Closed", value: closedCount },
          ].map((stat) => (
            <span
              key={stat.label}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[11px] font-semibold text-slate-500"
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  STATUS_DOTS[
                    stat.label as ClassAssignmentItem["status"]
                  ]
                }`}
              />
              {stat.label} {stat.value}
            </span>
          ))}

          <button
            type="button"
            onClick={() => setShowForm((prev) => !prev)}
            className="flex h-9 items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 text-xs font-semibold text-white transition-colors hover:bg-indigo-700"
          >
            <Plus size={14} />
            New Assignment
          </button>
        </div>
      </motion.div>


      {/* Create form */}
      {showForm && (
        <motion.section
          variants={sectionVariants}
          className="rounded-lg border border-slate-200 bg-white p-4"
        >
          <h2 className="text-sm font-bold text-slate-900">
            Create assignment
          </h2>

          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <label className="block">
              <span className={labelClass}>Title *</span>
              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="e.g. Algebra worksheet 3"
                className={inputClasses}
              />
            </label>

            <label className="block">
              <span className={labelClass}>Class *</span>
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
                  <option key={item.id} value={item.class_name}>
                    {item.class_name}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className={labelClass}>Section</span>
              <select
                value={section}
                onChange={(event) => setSection(event.target.value)}
                disabled={!className}
                className={inputClasses}
              >
                <option value="">
                  {className
                    ? "Select section"
                    : "Choose class first"}
                </option>
                {formSections.map((item) => (
                  <option key={item.id} value={item.section_name}>
                    {item.section_name}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className={labelClass}>Subject *</span>
              <select
                value={subject}
                onChange={(event) => setSubject(event.target.value)}
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
              <span className={labelClass}>Due date *</span>
              <input
                type="date"
                value={dueDate}
                onChange={(event) => setDueDate(event.target.value)}
                className={inputClasses}
              />
            </label>

            <label className="block sm:col-span-2 lg:col-span-3">
              <span className={labelClass}>Description</span>
              <textarea
                value={description}
                onChange={(event) =>
                  setDescription(event.target.value)
                }
                rows={2}
                placeholder="Instructions for students..."
                className={`${inputClasses} h-auto py-2`}
              />
            </label>
          </div>

          <div className="mt-3 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="h-9 rounded-lg border border-slate-200 px-3.5 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleCreate}
              disabled={saving}
              className="flex h-9 items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 text-xs font-semibold text-white transition-colors hover:bg-indigo-700 disabled:opacity-60"
            >
              {saving && (
                <Loader2 size={13} className="animate-spin" />
              )}
              {saving ? "Publishing..." : "Publish assignment"}
            </button>
          </div>
        </motion.section>
      )}


      {/* Filters */}
      <motion.section
        variants={sectionVariants}
        className="rounded-lg border border-slate-200 bg-white p-4"
      >
        <h2 className="flex items-center gap-2 text-sm font-bold text-slate-900">
          <Filter size={14} className="text-indigo-600" />
          Filters
        </h2>

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
            onChange={(event) => setFSection(event.target.value)}
            disabled={!fClass}
            className={inputClasses}
          >
            <option value="">All sections</option>
            {filterSections.map((item) => (
              <option key={item.id} value={item.section_name}>
                {item.section_name}
              </option>
            ))}
          </select>

          <select
            value={fSubject}
            onChange={(event) => setFSubject(event.target.value)}
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
            onChange={(event) => setFDueDate(event.target.value)}
            className={inputClasses}
          />
        </div>
      </motion.section>

      {/* Assignment list */}
      <div className="space-y-2.5">
        {loading ? (
          <p className="rounded-lg border border-slate-200 bg-white py-8 text-center text-xs text-slate-400">
            Loading assignments...
          </p>
        ) : filtered.length === 0 ? (
          <p className="rounded-lg border border-dashed border-slate-200 bg-white py-8 text-center text-xs text-slate-400">
            No assignments match the selected filters.
          </p>
        ) : (
          filtered.map((row) => (
            <article
              key={row.id}
              className="animate-fade-up rounded-lg border border-slate-200 bg-white p-3.5 transition-colors hover:border-indigo-200"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="truncate text-sm font-semibold text-slate-900">
                      {row.title}
                    </h3>
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${STATUS_STYLES[row.status]}`}
                    >
                      {row.status}
                    </span>
                  </div>
                  <p className="mt-1 truncate text-[11px] font-medium text-slate-400">
                    {row.class_name}
                    {row.section ? ` - ${row.section}` : ""} -{" "}
                    {row.subject} - Due {row.due_date}
                  </p>
                  {row.description && (
                    <p className="mt-1.5 text-xs leading-5 text-slate-500">
                      {row.description}
                    </p>
                  )}
                </div>

                <div className="flex shrink-0 items-center gap-1.5">
                  <select
                    value={row.status}
                    onChange={(event) =>
                      handleStatus(
                        row.id,
                        event.target
                          .value as ClassAssignmentRow["status"]
                      )
                    }
                    className="h-7 rounded-lg border border-slate-200 bg-white px-1.5 text-[11px] font-semibold text-slate-600 outline-none transition focus:border-indigo-500"
                  >
                    <option value="Open">Open</option>
                    <option value="Grading">Grading</option>
                    <option value="Closed">Closed</option>
                  </select>

                  <button
                    type="button"
                    onClick={() => handleDelete(row.id)}
                    className="rounded-lg border border-red-200 p-1.5 text-red-500 transition-colors hover:bg-red-50"
                    aria-label="Delete assignment"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </article>
          ))
        )}
      </div>
    </motion.div>
  );
};

export default TeacherAssignmentsPage;

