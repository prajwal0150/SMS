import { useMemo, useState } from "react";
import { motion } from "motion/react";
import type { Variants } from "motion/react";
import { Clock, FileText, Loader2 } from "lucide-react";

import { useStudentAssignments } from "../hooks/useStudentAssignments";

import type { StudentAssignmentStatus } from "../types/assignmentTypes";

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

/* Status chip styles - compact, soft colour palette. */
const STATUS_CHIPS: Record<StudentAssignmentStatus, string> = {
  pending: "bg-slate-50 text-slate-600",
  submitted: "bg-emerald-50 text-emerald-600",
  overdue: "bg-rose-50 text-rose-600",
};

const STATUS_DOTS: Record<StudentAssignmentStatus, string> = {
  pending: "bg-slate-400",
  submitted: "bg-emerald-500",
  overdue: "bg-rose-500",
};

const FILTERS: {
  key: StudentAssignmentStatus | "all";
  label: string;
}[] = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "submitted", label: "Submitted" },
  { key: "overdue", label: "Overdue" },
];

const StudentAssignmentsPage = () => {
  const { classInfo, assignments, loading, error } =
    useStudentAssignments();

  const [activeFilter, setActiveFilter] = useState<
    StudentAssignmentStatus | "all"
  >("all");

  const counts = useMemo(() => {
    const next: Record<StudentAssignmentStatus, number> = {
      pending: 0,
      submitted: 0,
      overdue: 0,
    };

    assignments.forEach((a) => {
      next[a.studentStatus] = (next[a.studentStatus] ?? 0) + 1;
    });

    return next;
  }, [assignments]);

  const filtered = useMemo(() => {
    if (activeFilter === "all") {
      return assignments;
    }

    return assignments.filter((a) => a.studentStatus === activeFilter);
  }, [assignments, activeFilter]);

  const classLabel = useMemo(() => {
    if (loading || !classInfo) {
      return null;
    }

    const parts: string[] = [];

    if (classInfo.class_name) {
      parts.push(classInfo.class_name);
    }

    if (classInfo.section_name) {
      parts.push(classInfo.section_name);
    }

    return parts.length ? parts.join(" • ") : null;
  }, [classInfo, loading]);

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="show"
      className="space-y-4"
    >
      {/* ---- Header ---- */}
      <motion.section variants={sectionVariants}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-xl font-semibold text-slate-900">
              Assignments
            </h1>
            <p className="mt-0.5 text-xs text-slate-500">
              Stay updated with your academic tasks
            </p>
          </div>

          {classLabel ? (
            <span className="inline-flex items-center gap-1 rounded-lg bg-indigo-50 px-2.5 py-1 text-[11px] font-medium text-indigo-700">
              Class {classLabel}
            </span>
          ) : null}
        </div>
      </motion.section>

      {/* ---- Error ---- */}
      {error ? (
        <motion.p
          variants={sectionVariants}
          className="rounded-lg border border-rose-200 bg-rose-50 py-3 text-center text-xs text-rose-700"
        >
          {error}
        </motion.p>
      ) : null}

      {/* ---- Filters ---- */}
      <motion.section variants={sectionVariants} className="flex items-center gap-1.5">
        {FILTERS.map((f) => {
          const count = f.key === "all" ? assignments.length : counts[f.key];
          const selected = activeFilter === f.key;

          return (
            <button
              key={f.key}
              type="button"
              onClick={() => setActiveFilter(f.key)}
              className={
                selected
                  ? "rounded-lg bg-indigo-600 px-3 py-1.5 text-[11px] font-semibold text-white"
                  : "rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-medium text-slate-600 transition-colors hover:border-slate-300"
              }
            >
              {f.label}
              <span className={selected ? "ml-1 text-white/80" : "ml-1 text-slate-400"}>
                ({count})
                            </span>
            </button>
          );
        })}
      </motion.section>

      {/* ---- Assignment list ---- */}
      <motion.section variants={sectionVariants} className="space-y-2.5">
        {loading ? (
          <p className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white py-8 text-center text-xs text-slate-400">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading assignments...
          </p>
        ) : filtered.length === 0 ? (
          <p className="rounded-lg border border-dashed border-slate-200 bg-white py-8 text-center text-xs text-slate-400">
            No assignments match the selected filter.
          </p>
        ) : (
          filtered.map((row) => (
            <article
              key={row.id}
              className="animate-fade-up rounded-lg border border-slate-200 bg-white p-3.5 transition-colors hover:border-indigo-200"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                {/* Main content */}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center justify-center rounded-md bg-indigo-50 p-1 text-indigo-600">
                      <FileText className="h-3.5 w-3.5" />
                    </span>
                    <span className="text-sm font-semibold text-slate-900">
                      {row.subject}
                    </span>
                    <time
                      dateTime={row.due_date}
                      className="ml-auto text-[11px] text-slate-400"
                    >
                      Due{" "}
                      {new Date(row.due_date).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                      })}
                    </time>
                  </div>

                  <h3 className="mt-1 text-sm font-semibold text-slate-900">
                    {row.title}
                  </h3>

                  {row.description ? (
                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      {row.description}
                    </p>
                  ) : null}

                  {row.teacher_name ? (
                    <p className="mt-1.5 text-[11px] text-slate-400">
                      Assigned by: {row.teacher_name}
                    </p>
                  ) : null}
                </div>

                {/* Status + action */}
                <div className="flex shrink-0 flex-col items-end gap-2.5">
                  <span
                    className={
                      "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-semibold " +
                      STATUS_CHIPS[row.studentStatus]
                    }
                  >
                    <span
                      className={
                        "h-1.5 w-1.5 rounded-full " +
                        STATUS_DOTS[row.studentStatus]
                      }
                    />
                    {row.studentStatus === "pending"
                      ? "Pending"
                      : row.studentStatus === "submitted"
                        ? "Submitted"
                        : "Overdue"}
                  </span>

                  <button
                    type="button"
                    onClick={() => {
                      void row;
                    }}
                    className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-medium text-slate-700 transition-colors hover:bg-slate-50"
                  >
                    <Clock className="h-3 w-3" />
                    View Assignment
                  </button>
                </div>
              </div>
            </article>
          ))
        )}
      </motion.section>
    </motion.div>
  );
};

export default StudentAssignmentsPage;

