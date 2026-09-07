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
  <div className="flex animate-fade-up items-center gap-3 rounded-lg border border-slate-200 bg-white p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-200">
    <div
      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${iconClassName}`}
    >
      <Icon size={18} />
    </div>
    <div className="min-w-0">
      <p className="truncate text-xs font-medium text-slate-400">
        {label}
      </p>
      <p className="truncate text-base font-bold leading-tight text-slate-900">
        {value}
      </p>
      {sub && (
        <p className="truncate text-[11px] text-slate-400">{sub}</p>
      )}
    </div>
  </div>
);

export default StatTile;