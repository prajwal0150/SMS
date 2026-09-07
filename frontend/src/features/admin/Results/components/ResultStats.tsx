import type { LucideIcon } from "lucide-react";
import {
  Award,
  CheckCircle2,
  ClipboardList,
  Clock,
  TrendingUp,
} from "lucide-react";

import type { ResultStats as ResultStatsData } from "../types/resultTypes";

interface ResultStatsProps {
  stats: ResultStatsData;
  loading: boolean;
}

interface StatCard {
  label: string;
  value: string;
  hint: string;
  icon: LucideIcon;
  valueClass: string;
  bgClass: string;
}

const ResultStats = ({ stats, loading }: ResultStatsProps) => {
  const cards: StatCard[] = [
    {
      label: "Total Results",
      value: String(stats.total),
      hint: "All examinations",
      icon: ClipboardList,
      valueClass: "text-slate-900",
      bgClass: "bg-indigo-50 text-indigo-600",
    },
    {
      label: "Published",
      value: String(stats.published),
      hint: "Live for students",
      icon: CheckCircle2,
      valueClass: "text-emerald-600",
      bgClass: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "Pending Review",
      value: String(stats.pendingReview),
      hint: "Submitted by teachers",
      icon: Clock,
      valueClass: "text-amber-600",
      bgClass: "bg-amber-50 text-amber-600",
    },
    {
      label: "Drafts",
      value: String(stats.drafts),
      hint: "Not yet submitted",
      icon: Award,
      valueClass: "text-sky-600",
      bgClass: "bg-sky-50 text-sky-600",
    },
    {
      label: "Pass Percentage",
      value: `${stats.passPercentage.toFixed(2)}%`,
      hint: "Overall pass rate",
      icon: TrendingUp,
      valueClass: "text-violet-600",
      bgClass: "bg-violet-50 text-violet-600",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
      {cards.map(({ label, value, hint, icon: Icon, valueClass, bgClass }) => (
        <div
          key={label}
          className="flex animate-fade-up items-center gap-3 rounded-lg border border-slate-200 bg-white p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-200"
        >
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${bgClass}`}
          >
            <Icon size={18} />
          </div>
          <div className="min-w-0">
            <p className="truncate text-xs font-medium text-slate-500">
              {label}
            </p>
            <p
              className={`mt-0.5 truncate text-base font-bold leading-tight ${valueClass}`}
            >
              {loading ? "..." : value}
            </p>
            <p className="truncate text-[11px] text-slate-400">{hint}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ResultStats;