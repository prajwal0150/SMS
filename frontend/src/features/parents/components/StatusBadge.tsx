import type { ReactNode } from "react";

const TONES: Record<string, string> = {
  green: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  red: "bg-rose-50 text-rose-700 ring-rose-200",
  amber: "bg-amber-50 text-amber-700 ring-amber-200",
  blue: "bg-sky-50 text-sky-700 ring-sky-200",
  slate: "bg-slate-100 text-slate-600 ring-slate-200",
};

interface StatusBadgeProps {
  label: string;
  icon?: ReactNode;
  tone?: string;
}

/** Small status/pill badge used across the parent portal. */
const StatusBadge = ({ label, icon, tone = "slate" }: StatusBadgeProps) => (
  <span
    className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1 ring-inset ${
      TONES[tone] ?? TONES.slate
    }`}
  >
    {icon}
    {label}
  </span>
);

export default StatusBadge;