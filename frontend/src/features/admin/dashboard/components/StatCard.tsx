import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  accent?: string;
}

const StatCard = ({
  label,
  value,
  icon: Icon,
  accent = "bg-indigo-600/10 text-indigo-600",
}: StatCardProps) => (
  <div className="flex items-center gap-4 rounded-lg border border-slate-200 bg-white p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-200">
    <div
      className={`flex h-12 w-12 items-center justify-center rounded-lg ${accent}`}
    >
      <Icon size={22} />
    </div>
    <div>
      <p className="text-sm font-medium text-slate-500">
        {label}
      </p>
      <p className="text-2xl font-bold text-slate-900">
        {value}
      </p>
    </div>
  </div>
);

export default StatCard;