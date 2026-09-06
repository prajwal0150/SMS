import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import type { Variants } from "motion/react";
import {
  Loader2,
  PencilLine,
  RefreshCw,
  Save,
  Send,
} from "lucide-react";
import toast from "react-hot-toast";

import { useTeacherProfile } from "../../hooks/useTeacherProfile";
import { useSchoolLookups } from "../../../admin/School/hooks/useSchoolLookups";
import {
  fetchExamsByClass,
  fetchMarksSheet,
  fetchTeacherMarkGroups,
  persistSubjectMarks,
} from "../services/resultService";
import type { MarkGroupSummary } from "../types/resultTypes";

type MarksTab = "create" | "submitted";

interface MarksRow {
  studentId: string;
  roll: string;
  admissionNumber: string | null;
  name: string;
  marks: string;
  remarks: string;
  workflow: "draft" | "submitted" | "reviewed" | "published" | "rejected" | null;
}

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

const inputClasses =
  "h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400";

const fieldLabel =
  "mb-1 block text-[11px] font-semibold text-slate-500";

const WORKFLOW_BADGES: Record<string, string> = {
  draft: "bg-slate-100 text-slate-600",
  submitted: "bg-amber-50 text-amber-600",
  reviewed: "bg-sky-50 text-sky-600",
  published: "bg-emerald-50 text-emerald-600",
  rejected: "bg-rose-50 text-rose-600",
};

const WORKFLOW_LABELS: Record<string, string> = {
  draft: "Draft",
  submitted: "Submitted",
  reviewed: "Approved",
  published: "Published",
  rejected: "Rejected",
};

const formatExamDate = (iso: string | null): string =>
  iso ? iso.slice(0, 10).split("-").reverse().join(" ") : "-";

const TeacherResultsPage = () => {
  const { profile } = useTeacherProfile();
  const { classes, sections, classSubjects } = useSchoolLookups();

  const [tab, setTab] = useState<MarksTab>("create");
  const [className, setClassName] = useState("");
  const [section, setSection] = useState("");
  const [subject, setSubject] = useState("");
  const [examId, setExamId] = useState("");
  const [maximumMarks, setMaximumMarks] = useState("100");
  const [passMarks, setPassMarks] = useState("33");

  const [exams, setExams] =
    useState<Awaited<ReturnType<typeof fetchExamsByClass>>>([]);
  const [rows, setRows] = useState<MarksRow[]>([]);
  const [sheetLoaded, setSheetLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState<"draft" | "submit" | null>(null);

  const [groups, setGroups] = useState<MarkGroupSummary[]>([]);
  const [groupsLoading, setGroupsLoading] = useState(false);

  const selectedClass = classes.find((item) => item.class_name === className);
  const classId = selectedClass?.id;
  const academicYear = selectedClass?.academic_year ?? "";

  const sectionOptions = useMemo(
    () => (classId ? sections.filter((s) => s.class_id === classId) : []),
    [classId, sections]
  );

  const selectedSection = sectionOptions.find((s) => s.section_name === section);
  const sectionId = selectedSection?.id;

  const subjectOptions = useMemo(() => {
    if (!classId) return [];
    return classSubjects
      .filter((s) => s.class_id === classId)
      .map((s) => s.subjects?.subject_name)
      .filter((name): name is string => Boolean(name))
      .sort();
  }, [classId, classSubjects]);

  const subjectId = useMemo(() => {
    if (!classId || !subject) return "";
    return classSubjects.find(
      (entry) => entry.class_id === classId && entry.subjects?.subject_name === subject
    )?.subject_id ?? "";
  }, [classId, subject, classSubjects]);

  useEffect(() => {
    if (!classId) { setExams([]); return; }
    let cancelled = false;
    fetchExamsByClass(className)
      .then((result) => { if (!cancelled) setExams(result); })
      .catch(() => { if (!cancelled) setExams([]); });
    return () => { cancelled = true; };
  }, [classId, className]);

  useEffect(() => {
    if (tab !== "submitted" || !profile) return;
    setGroupsLoading(true);
    fetchTeacherMarkGroups(profile.id)
      .then(setGroups)
      .catch(() => setGroups([]))
      .finally(() => setGroupsLoading(false));
  }, [tab, profile]);

  const updateRow = (studentId: string, patch: Partial<MarksRow>) => {
    setRows((prev) =>
      prev.map((row) => (row.studentId === studentId ? { ...row, ...patch } : row))
    );
  };

  const isRowLocked = (row: MarksRow): boolean =>
    row.workflow === "submitted" ||
    row.workflow === "reviewed" ||
    row.workflow === "published";
const handleLoadStudents = async () => {
    if (!classId || !sectionId || !subject || !examId) {
      toast.error("Please select class, section, subject, and exam.");
      return;
    }
    if (!subjectId) {
      toast.error("Could not resolve subject ID.");
      return;
    }
    setLoading(true);
    try {
      const sheet = await fetchMarksSheet({
        examId, classId, sectionId, subjectId,
        className, section, academicYear,
      });
      const mapped: MarksRow[] = sheet.students.map((s) => ({
        studentId: s.studentId,
        roll: s.roll,
        admissionNumber: s.admissionNumber,
        name: s.name,
        marks: s.obtainedMarks != null ? String(s.obtainedMarks) : "",
        remarks: s.remarks ?? "",
        workflow: s.workflowStatus,
      }));
      setRows(mapped);
      setSheetLoaded(true);
      toast.success(`Loaded ${mapped.length} students.`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to load students.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (mode: "draft" | "submit") => {
    if (!profile) { toast.error("Profile not loaded."); return; }
    if (!classId || !sectionId || !subject || !examId) {
      toast.error("Please complete the filters first.");
      return;
    }
    if (!subjectId) { toast.error("Could not resolve subject ID."); return; }
    if (rows.length === 0) { toast.error("No students to save."); return; }
    setSaving(mode);
    try {
      const count = await persistSubjectMarks({
        examId, classId, sectionId, subjectId,
        academicYear,
        maximumMarks: Number(maximumMarks) || 100,
        passMarks: Number(passMarks) || 0,
        teacherId: profile.id,
        entries: rows.map((row) => ({
          studentId: row.studentId,
          obtainedMarks: Number(row.marks) || 0,
          remarks: row.remarks,
        })),
        submit: mode === "submit",
      });
      toast.success(
        mode === "submit"
          ? `Submitted ${count} marks for review.`
          : `Saved ${count} marks as draft.`
      );
      if (mode === "submit") handleLoadStudents();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to save marks.");
    } finally {
      setSaving(null);
    }
  };

  const handleRefreshGroups = () => {
    if (!profile) return;
    setGroupsLoading(true);
    fetchTeacherMarkGroups(profile.id)
      .then(setGroups)
      .catch(() => setGroups([]))
      .finally(() => setGroupsLoading(false));
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="show"
      className="space-y-4"
    >
      {/* Compact header with tabs */}
      <motion.div
        variants={sectionVariants}
        className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"
      >
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-indigo-600">
            Teacher Portal
          </p>
          <h1 className="mt-0.5 truncate text-lg font-bold tracking-tight text-slate-900 sm:text-xl">
            Results & Marks
          </h1>
          <p className="mt-0.5 text-xs text-slate-500">
            Enter student marks by exam, class, section, and subject.
          </p>
        </div>

        <div className="flex shrink-0 gap-1.5 rounded-lg border border-slate-200 bg-slate-50 p-1">
          <button
            type="button"
            onClick={() => setTab("create")}
            className={`rounded-md px-3 py-1.5 text-[11px] font-semibold transition ${
              tab === "create"
                ? "bg-indigo-600 text-white"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Create
          </button>
          <button
            type="button"
            onClick={() => setTab("submitted")}
            className={`rounded-md px-3 py-1.5 text-[11px] font-semibold transition ${
              tab === "submitted"
                ? "bg-indigo-600 text-white"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Submitted
          </button>
        </div>
      </motion.div>
{/* Create tab */}
      {tab === "create" && (
        <motion.section
          variants={sectionVariants}
          className="rounded-lg border border-slate-200 bg-white p-4"
        >
          <h2 className="flex items-center gap-2 text-sm font-bold text-slate-900">
            <PencilLine size={14} className="text-indigo-600" />
            Marks Entry Filters
          </h2>
          <p className="mt-0.5 text-[11px] text-slate-400">
            Choose class, section, subject, exam, then load the
            student list.
          </p>

          <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-7">
            <div>
              <label htmlFor="rsClass" className={fieldLabel}>Class</label>
              <select
                id="rsClass"
                value={className}
                onChange={(event) => {
                  setClassName(event.target.value);
                  setSection(""); setSubject(""); setExamId("");
                  setRows([]); setSheetLoaded(false);
                }}
                className={inputClasses}
              >
                <option value="">Select class</option>
                {classes.map((item) => (
                  <option key={item.id} value={item.class_name}>{item.class_name}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="rsSection" className={fieldLabel}>Section</label>
              <select
                id="rsSection"
                value={section}
                onChange={(event) => {
                  setSection(event.target.value);
                  setSubject(""); setExamId("");
                  setRows([]); setSheetLoaded(false);
                }}
                disabled={!className}
                className={inputClasses}
              >
                <option value="">Select section</option>
                {sectionOptions.map((item) => (
                  <option key={item.id} value={item.section_name}>{item.section_name}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="rsSubject" className={fieldLabel}>Subject</label>
              <select
                id="rsSubject"
                value={subject}
                onChange={(event) => {
                  setSubject(event.target.value);
                  setExamId("");
                  setRows([]); setSheetLoaded(false);
                }}
                disabled={!section}
                className={inputClasses}
              >
                <option value="">Select subject</option>
                {subjectOptions.map((name) => (
                  <option key={name} value={name}>{name}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="rsExam" className={fieldLabel}>Exam</label>
              <select
                id="rsExam"
                value={examId}
                onChange={(event) => {
                  setExamId(event.target.value);
                  setRows([]); setSheetLoaded(false);
                }}
                disabled={!subject}
                className={inputClasses}
              >
                <option value="">Select exam</option>
                {exams.map((exam) => (
                  <option key={exam.id} value={exam.id}>
                    {exam.name}
                    {exam.start_date ? ` - ${formatExamDate(exam.start_date)}` : ""}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="rsMaxMarks" className={fieldLabel}>Max Marks</label>
              <input
                id="rsMaxMarks"
                type="number"
                min={0}
                value={maximumMarks}
                onChange={(event) => setMaximumMarks(event.target.value)}
                className={inputClasses}
              />
            </div>

            <div>
              <label htmlFor="rsPassMarks" className={fieldLabel}>Pass Marks</label>
              <input
                id="rsPassMarks"
                type="number"
                min={0}
                value={passMarks}
                onChange={(event) => setPassMarks(event.target.value)}
                className={inputClasses}
              />
            </div>

            <div className="flex items-end">
              <button
                type="button"
                onClick={handleLoadStudents}
                disabled={loading || !classId || !sectionId || !subject || !examId}
                className="flex h-9 w-full items-center justify-center gap-1.5 rounded-lg bg-indigo-600 px-3 text-xs font-semibold text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <><Loader2 size={13} className="animate-spin" /> Loading...</>
                ) : (
                  <><RefreshCw size={13} /> Load Sheet</>
                )}
              </button>
            </div>
          </div>
        </motion.section>
      )}
{tab === "create" && sheetLoaded && (
        <motion.section
          variants={sectionVariants}
          className="overflow-hidden rounded-lg border border-slate-200 bg-white"
        >
          {/* Sheet header */}
          <header className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 px-4 py-3">
            <div className="min-w-0">
              <h2 className="text-sm font-bold text-slate-900">Marks Sheet</h2>
              <p className="mt-0.5 text-[11px] font-medium text-slate-400">
                {rows.length} student{rows.length !== 1 ? "s" : ""} - Max: {maximumMarks} - Pass: {passMarks}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-1.5">
              <button
                type="button"
                onClick={() => handleSave("draft")}
                disabled={saving !== null}
                className="flex h-8 items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 text-[11px] font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-60"
              >
                {saving === "draft" ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
                Save Draft
              </button>
              <button
                type="button"
                onClick={() => handleSave("submit")}
                disabled={saving !== null}
                className="flex h-8 items-center gap-1 rounded-lg bg-indigo-600 px-2.5 text-[11px] font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-60"
              >
                {saving === "submit" ? <Loader2 size={12} className="animate-spin" /> : <Send size={12} />}
                Submit
              </button>
            </div>
          </header>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-xs">
              <thead>
                <tr className="bg-slate-50 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  <th className="px-3 py-2 text-left">Roll</th>
                  <th className="px-3 py-2 text-left">Adm No.</th>
                  <th className="px-3 py-2 text-left">Student</th>
                  <th className="px-3 py-2 text-left">Marks</th>
                  <th className="px-3 py-2 text-left">Remarks</th>
                  <th className="px-3 py-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {rows.map((row) => (
                  <tr key={row.studentId} className="transition-colors hover:bg-slate-50/70">
                    <td className="px-3 py-2 text-slate-400">{row.roll}</td>
                    <td className="px-3 py-2 text-slate-400">{row.admissionNumber ?? "-"}</td>
                    <td className="px-3 py-2 font-semibold text-slate-800">{row.name}</td>
                    <td className="px-3 py-2">
                      <input
                        type="number"
                        min={0}
                        max={Number(maximumMarks) || 999}
                        value={row.marks}
                        onChange={(event) => updateRow(row.studentId, { marks: event.target.value })}
                        disabled={isRowLocked(row)}
                        className="h-7 w-16 rounded-lg border border-slate-200 bg-white px-2 text-xs outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:bg-slate-50"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="text"
                        value={row.remarks}
                        onChange={(event) => updateRow(row.studentId, { remarks: event.target.value })}
                        disabled={isRowLocked(row)}
                        placeholder="Optional"
                        className="h-7 w-full min-w-[110px] rounded-lg border border-slate-200 bg-white px-2 text-xs outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:bg-slate-50"
                      />
                    </td>
                    <td className="px-3 py-2">
                      {row.workflow ? (
                        <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold ${WORKFLOW_BADGES[row.workflow] ?? "bg-slate-100 text-slate-600"}`}>
                          {WORKFLOW_LABELS[row.workflow] ?? row.workflow}
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {rows.length === 0 && (
            <p className="px-4 py-8 text-center text-xs text-slate-400">
              No students found for the selected class and section.
            </p>
          )}
        </motion.section>
      )}
{tab === "create" && !sheetLoaded && (
        <motion.div
          variants={sectionVariants}
          className="rounded-lg border-2 border-dashed border-slate-200 bg-slate-50/50 px-4 py-10 text-center"
        >
          <PencilLine size={26} className="mx-auto text-slate-400" />
          <p className="mt-2 text-sm font-medium text-slate-600">
            Select class, section, subject, exam, and click "Load Sheet"
            to begin entering marks.
          </p>
        </motion.div>
      )}

      {tab === "submitted" && (
        <motion.section
          variants={sectionVariants}
          className="overflow-hidden rounded-lg border border-slate-200 bg-white"
        >
          <header className="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-3">
            <div className="min-w-0">
              <h2 className="text-sm font-bold text-slate-900">
                Submitted Mark Groups
              </h2>
              <p className="mt-0.5 text-[11px] text-slate-400">
                Your previously submitted entries across exams and subjects
              </p>
            </div>
            <button
              type="button"
              onClick={handleRefreshGroups}
              disabled={groupsLoading}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 disabled:opacity-60"
              aria-label="Refresh"
            >
              <RefreshCw size={13} className={groupsLoading ? "animate-spin" : ""} />
            </button>
          </header>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-xs">
              <thead>
                <tr className="bg-slate-50 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  <th className="px-3 py-2 text-left">Class</th>
                  <th className="px-3 py-2 text-left">Section</th>
                  <th className="px-3 py-2 text-left">Subject</th>
                  <th className="px-3 py-2 text-left">Exam</th>
                  <th className="px-3 py-2 text-left">Students</th>
                  <th className="px-3 py-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {groups.map((group) => (
                  <tr key={group.key} className="transition-colors hover:bg-slate-50/70">
                    <td className="px-3 py-2 text-slate-600">{group.className}</td>
                    <td className="px-3 py-2 text-slate-600">{group.sectionName}</td>
                    <td className="px-3 py-2 font-semibold text-slate-800">{group.subjectName}</td>
                    <td className="px-3 py-2 text-slate-600">{group.examName}</td>
                    <td className="px-3 py-2 text-slate-400">{group.markedCount}</td>
                    <td className="px-3 py-2">
                      <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold ${group.workflow.submitted > 0 ? WORKFLOW_BADGES.submitted : WORKFLOW_BADGES.draft}`}>
                        {group.workflow.submitted > 0 ? "Submitted" : "Draft"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {groups.length === 0 && !groupsLoading && (
            <p className="px-4 py-8 text-center text-xs text-slate-400">
              You have not submitted any marks yet.
            </p>
          )}
        </motion.section>
      )}
    </motion.div>
  );
};

export default TeacherResultsPage;