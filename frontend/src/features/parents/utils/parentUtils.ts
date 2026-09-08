// ============================================================
// FORMATTING HELPERS
// ============================================================

const nprFormatter =
  new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

/** Formats an amount as NPR. Example: "NPR 12,345.50" */
export const formatNpr = (value: number | null | undefined): string => {
  const amount = Number(value ?? 0);

  return `NPR ${nprFormatter.format(amount)}`;
};

/** "2026-01-05" -> "05 Jan 2026" */
export const formatDate = (
  value: string | null | undefined
): string => {
  if (!value) {
    return "—";
  }

  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
};

/** "10:15:00" -> "10:15 AM" */
export const formatTime = (
  value: string | null | undefined
): string => {
  if (!value) {
    return "—";
  }

  const [hoursPart, minutesPart] = value.split(":");
  const hours = Number(hoursPart);

  if (Number.isNaN(hours)) {
    return value;
  }

  const suffix = hours >= 12 ? "PM" : "AM";
  const hour12 = hours % 12 === 0 ? 12 : hours % 12;

  return `${hour12}:${minutesPart ?? "00"} ${suffix}`;
};

// ============================================================
// STATUS HELPERS
// ============================================================

export const ATTENDANCE_LABELS: Record<string, string> = {
  present: "Present",
  absent: "Absent",
  late: "Late",
  leave: "Leave",
};

export const FEE_STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  partial: "Partial",
  paid: "Paid",
  waived: "Waived",
};

export const INVOICE_STATUS_LABELS: Record<string, string> = {
  draft: "Draft",
  unpaid: "Unpaid",
  partial: "Partially paid",
  paid: "Paid",
  overdue: "Overdue",
  cancelled: "Cancelled",
};

export const DAY_ORDER = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

/** First letter uppercased, e.g. "present" -> "Present" */
export const titleCase = (value: string | null | undefined): string =>
  !value ? "—" : value.charAt(0).toUpperCase() + value.slice(1);