import type { LucideIcon } from "lucide-react";

interface StatTileProps {
  label: string;
  value: string;
  sub?: string;
  icon: LucideIcon;
  iconClassName?: string;
}

const StatTile = ({
  label,
  value,
  sub,
  icon: Icon,
  iconClassName = "bg-indigo-500 text-white",
}: StatTileProps) => (
  <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5">
    <div
      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${iconClassName}`}
    >
      <Icon size={22} />
    </div>
    <div className="min-w-0">
      <p className="truncate text-xs font-medium text-slate-400">
        {label}
      </p>
      <p className="truncate text-lg font-bold leading-tight text-slate-900">
        {value}
      </p>
      {sub && (
        <p className="truncate text-[11px] text-slate-400">{sub}</p>
      )}
    </div>
  </div>
);

export default StatTile;