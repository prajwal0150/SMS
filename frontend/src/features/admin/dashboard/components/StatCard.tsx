import type { LucideIcon } from "lucide-react";

import CountUp from "../../../../components/CountUp";

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
  <div className="flex animate-fade-up items-center gap-3 rounded-lg border border-slate-200 bg-white p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-200">
    <div
      className={`flex h-10 w-10 items-center justify-center rounded-lg ${accent}`}
    >
      <Icon size={18} />
    </div>
    <div>
      <p className="text-xs font-medium text-slate-500">
        {label}
      </p>
      <p className="text-base font-bold text-slate-900">
        {typeof value === "number" ? <CountUp value={value} /> : value}
      </p>
    </div>
  </div>
);

export default StatCard;