import type { LucideIcon } from "lucide-react";

export interface InfoRow {
  icon: LucideIcon;
  label: string;
  value: string;
}

interface InfoCardProps {
  /** Target for the tab scroll-to-section behaviour. */
  id?: string;
  title: string;
  icon: LucideIcon;
  rows: InfoRow[];
  highlighted?: boolean;
  className?: string;
}

/**
 * A titled card of label / value rows (Basic Information,
 * Address, Family Information, ...).
 */
const InfoCard = ({
  id,
  title,
  icon: Icon,
  rows,
  highlighted = false,
  className,
}: InfoCardProps) => (
  <section
    id={id}
    className={`rounded-xl border bg-white p-5 transition-all duration-300 ${
      highlighted
        ? "border-indigo-300 ring-2 ring-indigo-100"
        : "border-slate-200"
    } ${className ?? ""}`}
  >
    <header className="mb-4 flex items-center gap-2.5">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
        <Icon size={14} />
      </span>
      <h3 className="text-sm font-bold text-slate-800">{title}</h3>
    </header>

    <dl className="space-y-3.5">
      {rows.map(({ icon: RowIcon, label, value }) => (
        <div
          key={label}
          className="flex items-center justify-between gap-4"
        >
          <dt className="flex min-w-0 items-center gap-2 text-xs font-medium text-slate-400">
            <RowIcon size={13} className="shrink-0 text-slate-300" />
            <span className="truncate">{label}</span>
          </dt>
          <dd className="min-w-0 truncate text-right text-sm font-semibold text-slate-800">
            {value}
          </dd>
        </div>
      ))}
    </dl>
  </section>
);

export default InfoCard;
