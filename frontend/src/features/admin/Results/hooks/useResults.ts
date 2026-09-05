import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import type {
  ResultExportOptions,
  ResultFilters,
  ResultReportRow,
  ResultStats,
  ResultSummaryRow,
  ExamOption,
  GradeScale,
} from "../types/resultTypes";
import {
  fetchExamOptions,
  fetchGradeScales,
  fetchResultReport,
  fetchResultSummaries,
  fetchResultSummariesForExport,
  updateResultsWorkflow,
} from "../services/resultServices";
import { currentAcademicYear } from "../utils/resultUtils";
import {
  buildResultsListPayload,
  buildStudentMarkSheetPayload,
} from "../utils/resultReports";
import { exportResultsPdf } from "../utils/resultPdf";

import type {
  StudentOption,
  TeacherOption,
} from "../../Attendance/types/attendanceTypes";
import {
  fetchStudentOptions,
  fetchTeacherOptions,
} from "../../Attendance/services/attendanceServices";

const EMPTY_FILTERS: ResultFilters = {
  academicYear: currentAcademicYear(),
  examId: "",
  classId: "",
  sectionId: "",
  resultStatus: "",
  workflowStatus: "",
  search: "",
  sortBy: "roll",
  sortDir: "asc",
};

const matchesSearch = (row: ResultSummaryRow, term: string): boolean => {
  const needle = term.trim().toLowerCase();

  if (!needle) {
    return true;
  }

  return (
    row.student_name.toLowerCase().includes(needle) ||
    String(row.roll_number ?? "").toLowerCase().includes(needle) ||
    String(row.admission_number ?? "").toLowerCase().includes(needle)
  );
};

const compareRows = (
  a: ResultSummaryRow,
  b: ResultSummaryRow,
  sortBy: ResultFilters["sortBy"]
): number => {
  switch (sortBy) {
    case "name":
      return a.student_name.localeCompare(b.student_name);
    case "percentage":
      return Number(a.percentage ?? 0) - Number(b.percentage ?? 0);
    case "recent":
      return a.result_id.localeCompare(b.result_id);
    case "roll":
    default: {
      const rollA = Number(a.roll_number ?? 0);
      const rollB = Number(b.roll_number ?? 0);
      return rollA - rollB;
    }
  }
};

export const useResults = () => {
  const [filters, setFilters] = useState<ResultFilters>(EMPTY_FILTERS);
  const [rows, setRows] = useState<ResultSummaryRow[]>([]);
  const [exams, setExams] = useState<ExamOption[]>([]);
  const [gradeScales, setGradeScales] = useState<GradeScale[]>([]);
  const [students, setStudents] = useState<StudentOption[]>([]);
  const [teachers, setTeachers] = useState<TeacherOption[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detailRows, setDetailRows] = useState<ResultReportRow[]>([]);
  const [detailLoading, setDetailLoading] = useState(false);
  const [actionBusy, setActionBusy] = useState(false);

  const [exportOpen, setExportOpen] = useState(false);
  const [gradeOpen, setGradeOpen] = useState(false);
  const [generating, setGenerating] = useState(false);

  // Lookups for filters + modals.
  useEffect(() => {
    let cancelled = false;

    Promise.all([
      fetchExamOptions(),
      fetchStudentOptions(),
      fetchTeacherOptions(),
      fetchGradeScales(),
    ])
      .then(([examList, studentList, teacherList, scaleList]) => {
        if (!cancelled) {
          setExams(examList);
          setStudents(studentList);
          setTeachers(teacherList);
          setGradeScales(scaleList);
        }
      })
      .catch(() => {
        // Modals degrade gracefully; the results table still works.
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const loadRows = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchResultSummaries(filters);
      setRows(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load results.");
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    void loadRows();
  }, [loadRows]);

  // Detail rows follow the selected result.
  useEffect(() => {
    if (!selectedId) {
      setDetailRows([]);
      return;
    }

    let cancelled = false;
    setDetailLoading(true);

    fetchResultReport(selectedId)
      .then((data) => {
        if (!cancelled) {
          setDetailRows(data);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setDetailRows([]);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setDetailLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [selectedId]);


  const setFilter = useCallback(
    (key: keyof ResultFilters, value: string) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const resetFilters = useCallback(() => {
    setFilters({ ...EMPTY_FILTERS, academicYear: currentAcademicYear() });
  }, []);

  const filteredRows = useMemo(() => {
    const list = rows.filter((row) => matchesSearch(row, filters.search));
    const sorted = [...list].sort((a, b) => compareRows(a, b, filters.sortBy));

    return filters.sortDir === "asc" ? sorted : sorted.reverse();
  }, [rows, filters.search, filters.sortBy, filters.sortDir]);

  const stats = useMemo<ResultStats>(() => {
    const total = filteredRows.length;
    const published = filteredRows.filter(
      (row) => row.workflow_status === "published"
    ).length;
    const pendingReview = filteredRows.filter(
      (row) => row.workflow_status === "submitted"
    ).length;
    const drafts = filteredRows.filter(
      (row) => row.workflow_status === "draft"
    ).length;
    const passed = filteredRows.filter(
      (row) => row.result_status === "pass"
    ).length;

    return {
      total,
      published,
      pendingReview,
      drafts,
      passPercentage: total > 0 ? Math.round((passed / total) * 10000) / 100 : 0,
    };
  }, [filteredRows]);

  const academicYears = useMemo(() => {
    const years = new Set<string>([currentAcademicYear()]);
    rows.forEach((row) => years.add(row.academic_year));
    return [...years].sort().reverse();
  }, [rows]);

  const selectedSummary = useMemo(
    () => filteredRows.find((row) => row.result_id === selectedId) ?? null,
    [filteredRows, selectedId]
  );

  // ==============================
  // WORKFLOW ACTIONS
  // ==============================

  const applyWorkflow = useCallback(
    async (
      resultId: string,
      update: Parameters<typeof updateResultsWorkflow>[1],
      successMessage: string
    ): Promise<boolean> => {
      setActionBusy(true);

      try {
        await updateResultsWorkflow([resultId], update);
        toast.success(successMessage);
        await loadRows();
        return true;
      } catch (err) {
        toast.error(
          err instanceof Error ? err.message : "Failed to update the result."
        );
        return false;
      } finally {
        setActionBusy(false);
      }
    },
    [loadRows]
  );

  const approveResult = useCallback(
    () =>
      selectedId
        ? applyWorkflow(
            selectedId,
            {
              workflow_status: "reviewed",
              reviewed_at: new Date().toISOString(),
            },
            "Result approved. Ready to publish."
          )
        : Promise.resolve(false),
    [selectedId, applyWorkflow]
  );

  const rejectResult = useCallback(
    (remark: string) =>
      selectedId
        ? applyWorkflow(
            selectedId,
            {
              workflow_status: "rejected",
              reviewed_at: new Date().toISOString(),
              remarks: remark || "Marks need correction.",
            },
            "Result rejected and sent back to the teacher."
          )
        : Promise.resolve(false),
    [selectedId, applyWorkflow]
  );

  const publishResult = useCallback(
    () =>
      selectedId
        ? applyWorkflow(
            selectedId,
            {
              workflow_status: "published",
              published_at: new Date().toISOString(),
            },
            "Result published."
          )
        : Promise.resolve(false),
    [selectedId, applyWorkflow]
  );


  // ==============================
  // PDF EXPORT
  // ==============================

  const generateExport = useCallback(
    async (options: ResultExportOptions): Promise<boolean> => {
      setGenerating(true);

      try {
        const summaries = await fetchResultSummariesForExport(options);

        if (summaries.length === 0) {
          toast.error("No results found for the selected scope.");
          return false;
        }

        if (options.scope === "student") {
          const detail = await fetchResultReport(summaries[0].result_id);
          const payload = buildStudentMarkSheetPayload(detail);

          if (!payload) {
            toast.error("This result has no marks to export yet.");
            return false;
          }

          exportResultsPdf(payload);
        } else {
          exportResultsPdf(buildResultsListPayload(summaries, options));
        }

        toast.success("Results report PDF downloaded.");
        return true;
      } catch (err) {
        toast.error(
          err instanceof Error
            ? err.message
            : "Failed to generate the results report."
        );
        return false;
      } finally {
        setGenerating(false);
      }
    },
    []
  );

  /** PDF of the result currently open in the details panel. */
  const downloadSelectedPdf = useCallback(() => {
    if (!selectedSummary) {
      return;
    }

    const payload = buildStudentMarkSheetPayload(detailRows);

    if (!payload) {
      toast.error("This result has no marks to export yet.");
      return;
    }

    exportResultsPdf(payload);
    toast.success("Mark sheet PDF downloaded.");
  }, [selectedSummary, detailRows]);

  /** Opens the browser print dialog with the current mark sheet. */
  const printSelected = useCallback(() => {
    if (!selectedSummary) {
      return;
    }

    const payload = buildStudentMarkSheetPayload(detailRows);

    if (!payload) {
      toast.error("This result has no marks to print yet.");
      return;
    }

    const rowsHtml = payload.sections
      .map(
        (section) => `
          <h3>${section.heading}</h3>
          <table>
            <thead><tr>${section.columns
              .map((column) => `<th>${column}</th>`)
              .join("")}</tr></thead>
            <tbody>
              ${
                section.rows.length > 0
                  ? section.rows
                      .map(
                        (row) =>
                          `<tr>${row
                            .map((cell) => `<td>${cell ?? "-"}</td>`)
                            .join("")}</tr>`
                      )
                      .join("")
                  : `<tr><td colspan="${section.columns.length}">No records.</td></tr>`
              }
            </tbody>
          </table>`
      )
      .join("");

    const win = window.open("", "_blank", "width=900,height=650");

    if (!win) {
      toast.error("Allow pop-ups to print the mark sheet.");
      return;
    }

    win.document.write(
      `<!doctype html><html><head><title>${payload.title}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 28px; color: #0f172a; }
        h1 { color: #4f46e5; font-size: 20px; margin: 0 0 4px; }
        h3 { font-size: 13px; margin: 18px 0 6px; }
        p { color: #475569; font-size: 12px; margin: 2px 0; }
        table { border-collapse: collapse; width: 100%; font-size: 11px; }
        th { background: #4f46e5; color: white; text-align: left; padding: 5px 7px; }
        td { border-bottom: 1px solid #e2e8f0; padding: 5px 7px; }
        tr:nth-child(even) td { background: #f8fafc; }
      </style></head><body>
      <h1>${payload.title}</h1>
      <p>${payload.subtitle}</p><p>${payload.meta}</p>
      ${rowsHtml}
      </body></html>`
    );

    win.document.close();
    win.focus();
    win.print();
  }, [selectedSummary, detailRows]);

  return {
    filters,
    setFilter,
    resetFilters,
    rows: filteredRows,
    stats,
    academicYears,
    exams,
    students,
    teachers,
    loading,
    error,
    selectedId,
    setSelectedId,
    selectedSummary,
    detailRows,
    detailLoading,
    actionBusy,
    approveResult,
    rejectResult,
    publishResult,
    exportOpen,
    setExportOpen,
    gradeOpen,
    setGradeOpen,
    gradeScales,
    generating,
    generateExport,
    downloadSelectedPdf,
    printSelected,
    refresh: loadRows,
  };
};

