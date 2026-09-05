/**
 * Results report payload builders.
 *
 * Turn result rows + export options into the structure consumed by
 * exportResultsPdf (see resultPdf.ts).
 */

import type { ResultsPdfPayload } from "./resultPdf";

import type {
  ClassResultSummaryRow,
  ResultExportOptions,
  ResultReportRow,
  ResultSummaryRow,
} from "../types/resultTypes";

import {
  resultStatusLabel,
  workflowLabel,
} from "./resultUtils";

const stamp = (value: string): string => value.replace(/[^\w]+/g, "-");

const summaryStrip = (rows: ResultSummaryRow[]) => {
  const total = rows.length;
  const published = rows.filter((row) => row.workflow_status === "published").length;
  const passed = rows.filter((row) => row.result_status === "pass").length;
  const avg =
    total > 0
      ? rows.reduce((sum, row) => sum + Number(row.percentage ?? 0), 0) / total
      : 0;

  return [
    { label: "Total Results", value: String(total) },
    { label: "Published", value: String(published) },
    { label: "Passed", value: String(passed) },
    { label: "Failed", value: String(total - passed) },
    { label: "Pass Rate", value: total > 0 ? `${Math.round((passed / total) * 10000) / 100}%` : "0%" },
    { label: "Average Score", value: `${avg.toFixed(2)}%` },
  ];
};

const listSection = (rows: ResultSummaryRow[]) => ({
  heading: "Result Details",
  columns: [
    "Roll",
    "Admission No.",
    "Student",
    "Class",
    "Section",
    "Subjects",
    "Max Marks",
    "Obtained",
    "Percentage",
    "Grade",
    "Result",
    "Workflow",
  ],
  rows: rows.map((row) => [
    row.roll_number ?? "-",
    row.admission_number ?? "-",
    row.student_name,
    row.class_name ?? "-",
    row.section_name ?? "-",
    row.subject_count,
    row.total_marks,
    row.obtained_marks,
    `${Number(row.percentage ?? 0).toFixed(2)}%`,
    row.grade ?? "-",
    resultStatusLabel[row.result_status] ?? row.result_status,
    workflowLabel[row.workflow_status] ?? row.workflow_status,
  ]),
});

/** Whole exam / class export: one summary row per student. */
export const buildResultsListPayload = (
  rows: ResultSummaryRow[],
  options: ResultExportOptions
): ResultsPdfPayload => ({
  fileName: `results-report_${stamp(options.label)}.pdf`,
  title: "Results Report",
  subtitle: options.label,
  meta: `Generated from Results Management`,
  summary: summaryStrip(rows),
  sections: [listSection(rows)],
});

/** Single-student export: subject-wise mark sheet. */
export const buildStudentMarkSheetPayload = (
  rows: ResultReportRow[]
): ResultsPdfPayload | null => {
  const head = rows[0];

  if (!head) {
    return null;
  }

  const subjectSection = {
    heading: "Subject-wise Marks",
    columns: ["Subject", "Max Marks", "Pass Marks", "Obtained", "Grade", "Marked By", "Remarks"],
    rows: rows
      .filter((row) => row.result_mark_id)
      .map((row) => [
        row.subject_name ?? "-",
        row.maximum_marks ?? "-",
        row.pass_marks ?? "-",
        row.subject_obtained_marks ?? "-",
        row.subject_grade ?? "-",
        row.teacher_name ?? "-",
        row.subject_remarks ?? "-",
      ]),
  };

  const summary = [
    { label: "Total Marks", value: String(head.total_marks) },
    { label: "Obtained", value: String(head.obtained_marks) },
    { label: "Percentage", value: `${Number(head.percentage ?? 0).toFixed(2)}%` },
    { label: "Grade", value: head.grade ?? "-" },
    {
      label: "Result",
      value: resultStatusLabel[head.result_status] ?? head.result_status,
    },
    {
      label: "Workflow",
      value: workflowLabel[head.workflow_status] ?? head.workflow_status,
    },
  ];

  return {
    fileName: `mark-sheet_${stamp(head.student_name)}_${stamp(head.exam_name)}.pdf`,
    title: "Student Mark Sheet",
    subtitle: `${head.student_name} - ${head.class_name ?? ""} ${head.section_name ?? ""} (Roll ${head.roll_number ?? "-"})`,
    meta: `Exam: ${head.exam_name} | Session: ${head.academic_year}`,
    summary,
    sections: [subjectSection],
  };
};
/** Class / overall report: one row per exam + class + section aggregate. */
export const buildClassReportPayload = (
  rows: ClassResultSummaryRow[],
  label: string
): ResultsPdfPayload => {
  const totalStudents = rows.reduce(
    (sum, row) => sum + Number(row.total_students),
    0
  );
  const passed = rows.reduce(
    (sum, row) => sum + Number(row.passed_students),
    0
  );
  const avg =
    rows.length > 0
      ? rows.reduce(
          (sum, row) => sum + Number(row.average_percentage ?? 0),
          0
        ) / rows.length
      : 0;

  const summary = [
    { label: "Exam / Class Groups", value: String(rows.length) },
    { label: "Total Students", value: String(totalStudents) },
    { label: "Passed", value: String(passed) },
    { label: "Failed", value: String(totalStudents - passed) },
    {
      label: "Overall Pass Rate",
      value:
        totalStudents > 0
          ? `${Math.round((passed / totalStudents) * 10000) / 100}%`
          : "0%",
    },
    { label: "Average Score", value: `${avg.toFixed(2)}%` },
  ];

  return {
    fileName: `class-report_${stamp(label)}.pdf`,
    title: "Class Results Report",
    subtitle: label,
    meta: "Generated from Results Management",
    summary,
    sections: [
      {
        heading: "Class-wise Summary",
        columns: [
          "Exam",
          "Class",
          "Section",
          "Students",
          "Passed",
          "Failed",
          "Absent",
          "Incomplete",
          "Avg %",
          "Highest",
          "Lowest",
          "Pass %",
        ],
        rows: rows.map((row) => [
          row.exam_name,
          row.class_name ?? "-",
          row.section_name ?? "-",
          Number(row.total_students),
          Number(row.passed_students),
          Number(row.failed_students),
          Number(row.absent_students),
          Number(row.incomplete_students),
          `${Number(row.average_percentage ?? 0).toFixed(2)}%`,
          Number(row.highest_percentage),
          Number(row.lowest_percentage),
          `${Number(row.pass_percentage ?? 0).toFixed(2)}%`,
        ]),
      },
    ],
  };
};
