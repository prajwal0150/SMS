/**
 * Attendance report payload builders.
 *
 * Turn raw attendance rows + report options into the structure
 * consumed by exportAttendancePdf (see attendancePdf.ts).
 */

import type { AttendancePdfPayload } from "./attendancePdf";

import type {
  ReportOptions,
  StaffAttendanceRow,
  StudentAttendanceRow,
} from "../types/attendanceTypes";

import { capitalize, formatDisplayDate } from "./attendanceUtils";

interface StatusCounts {
  present: number;
  absent: number;
  late: number;
  leave: number;
}

/** "2026-09-01" + "2026-09-30" -> "01 Sep 2026 - 30 Sep 2026" */
const periodLabel = (options: ReportOptions): string =>
  options.fromDate === options.toDate
    ? formatDisplayDate(options.fromDate)
    : `${formatDisplayDate(options.fromDate)} - ${formatDisplayDate(options.toDate)}`;

const rateLabel = (attended: number, total: number): string =>
  total > 0 ? `${Math.round((attended / total) * 10000) / 100}%` : "0%";

const countStatuses = (rows: { status: string }[]): StatusCounts =>
  rows.reduce<StatusCounts>(
    (acc, row) => {
      if (row.status === "present") acc.present += 1;
      else if (row.status === "absent") acc.absent += 1;
      else if (row.status === "late") acc.late += 1;
      else if (row.status === "leave") acc.leave += 1;
      return acc;
    },
    { present: 0, absent: 0, late: 0, leave: 0 }
  );

/** Top strip of the PDF: Total / Present / Absent / Late / Leave / Rate. */
const summaryStrip = (rows: { status: string }[]) => {
  const counts = countStatuses(rows);
  const total = rows.length;

  return [
    { label: "Total Records", value: String(total) },
    { label: "Present", value: String(counts.present) },
    { label: "Absent", value: String(counts.absent) },
    { label: "Late", value: String(counts.late) },
    { label: "Leave", value: String(counts.leave) },
    {
      label: "Attendance Rate",
      value: rateLabel(counts.present + counts.late, total),
    },
  ];
};

/** One row per date: how many present / absent / late / leave. */
const dayTotalsSection = (
  rows: { attendance_date: string; status: string }[],
  heading: string
) => {
  const byDate = new Map<string, StatusCounts>();

  rows.forEach((row) => {
    const entry = byDate.get(row.attendance_date) ?? {
      present: 0,
      absent: 0,
      late: 0,
      leave: 0,
    };

    if (row.status === "present") entry.present += 1;
    else if (row.status === "absent") entry.absent += 1;
    else if (row.status === "late") entry.late += 1;
    else if (row.status === "leave") entry.leave += 1;

    byDate.set(row.attendance_date, entry);
  });

  return {
    heading,
    columns: ["Date", "Present", "Absent", "Late", "Leave", "Total", "Rate"],
    rows: [...byDate.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, counts]) => {
        const total =
          counts.present + counts.absent + counts.late + counts.leave;

        return [
          formatDisplayDate(date),
          counts.present,
          counts.absent,
          counts.late,
          counts.leave,
          total,
          rateLabel(counts.present + counts.late, total),
        ];
      }),
  };
};

const fileStamp = (options: ReportOptions): string =>
  `${options.fromDate}_to_${options.toDate}`;

export const buildStudentReportPayload = (
  rows: StudentAttendanceRow[],
  options: ReportOptions
): AttendancePdfPayload => ({
  fileName: `student-attendance-report_${fileStamp(options)}.pdf`,
  title: "Student Attendance Report",
  subtitle: options.label?.trim() ? options.label : "All students",
  period: periodLabel(options),
  summary: summaryStrip(rows),
  sections: [
    {
      heading: "Attendance Details",
      columns: [
        "Date",
        "Admission No.",
        "Roll",
        "Student",
        "Class",
        "Section",
        "Subject",
        "Marked By",
        "Status",
        "Remarks",
      ],
      rows: rows.map((row) => [
        formatDisplayDate(row.attendance_date),
        row.admission_number ?? "-",
        row.roll_number ?? "-",
        row.student_name,
        row.class_name ?? "-",
        row.section_name ?? "-",
        row.subject_name ?? "Daily",
        row.teacher_name ?? "-",
        capitalize(row.status),
        row.remarks ?? "-",
      ]),
    },
    dayTotalsSection(rows, "Day-wise Summary"),
  ],
});

export const buildStaffReportPayload = (
  rows: StaffAttendanceRow[],
  options: ReportOptions
): AttendancePdfPayload => ({
  fileName: `staff-attendance-report_${fileStamp(options)}.pdf`,
  title: "Staff Attendance Report",
  subtitle: options.label?.trim() ? options.label : "All staff",
  period: periodLabel(options),
  summary: summaryStrip(rows),
  sections: [
    {
      heading: "Attendance Details",
      columns: [
        "Date",
        "Teacher",
        "Email",
        "Primary Subject",
        "Qualification",
        "Status",
        "Remarks",
      ],
      rows: rows.map((row) => [
        formatDisplayDate(row.attendance_date),
        row.teacher_name,
        row.email ?? "-",
        row.primary_subject ?? "-",
        row.qualification ?? "-",
        capitalize(row.status),
        row.remarks ?? "-",
      ]),
    },
    dayTotalsSection(rows, "Day-wise Summary"),
  ],
});
