/** Small date / status helpers shared across the Attendance feature. */

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const toISODate = (date: Date): string => {
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 10);
};

export const todayISO = (): string => toISODate(new Date());

export const monthStartISO = (): string => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;
};

/** "2026-09-04" -> "04 Sep 2026" */
export const formatDisplayDate = (
  iso: string | null | undefined
): string => {
  if (!iso) return "-";
  const parts = iso.slice(0, 10).split("-");
  if (parts.length !== 3) return iso;
  const [year, month, day] = parts;
  const monthLabel = MONTHS[Number(month) - 1] ?? month;
  return `${day} ${monthLabel} ${year}`;
};

export const capitalize = (value: string): string =>
  value.charAt(0).toUpperCase() + value.slice(1);

export const statusBadgeClass: Record<string, string> = {
  present: "bg-emerald-50 text-emerald-600",
  absent: "bg-rose-50 text-rose-600",
  late: "bg-amber-50 text-amber-600",
  leave: "bg-sky-50 text-sky-600",
};

export const percentageColor = (value: number | null | undefined): string => {
  if (value === null || value === undefined) return "text-slate-400";
  if (value >= 90) return "text-emerald-600";
  if (value >= 75) return "text-amber-600";
  return "text-rose-600";
};

export const barColor = (value: number | null | undefined): string => {
  if (value === null || value === undefined) return "bg-slate-300";
  if (value >= 90) return "bg-emerald-500";
  if (value >= 75) return "bg-amber-400";
  return "bg-rose-500";
};