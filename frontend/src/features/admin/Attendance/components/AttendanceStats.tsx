import { CheckCircle2, Clock, PieChart, Users, XCircle } from "lucide-react";

import type {
  AttendanceStats as AttendanceStatsData,
  AttendanceTab,
} from "../types/attendanceTypes";

interface AttendanceStatsProps {
  tab: AttendanceTab;
  stats: AttendanceStatsData;
}

const AttendanceStats = ({ tab, stats }: AttendanceStatsProps) => {
  const pct = (value: number) =>
    stats.total > 0
      ? `${Math.round((value / stats.total) * 10000) / 100}%`
      : "0%";

  const cards = [
    {
      key: "total",
      label: tab === "student" ? "Total Students" : "Total Staff",
      value: String(stats.total),
      sub: tab === "student" ? "All Students" : "All Staff",
      icon: Users,
      iconBg: "bg-indigo-50 text-indigo-600",
      cardBg: "bg-white",
      labelClass: "text-slate-500",
      valueClass: "text-slate-900",
      subClass: "text-slate-400",
    },
    {
      key: "present",
      label: "Present",
      value: String(stats.present),
      sub: pct(stats.present),
      icon: CheckCircle2,
      iconBg: "bg-emerald-100 text-emerald-600",
      cardBg: "bg-emerald-50/70",
      labelClass: "text-emerald-700",
      valueClass: "text-emerald-700",
      subClass: "text-emerald-500",
    },
    {
      key: "absent",
      label: "Absent",
      value: String(stats.absent),
      sub: pct(stats.absent),
      icon: XCircle,
      iconBg: "bg-rose-100 text-rose-600",
      cardBg: "bg-rose-50/70",
      labelClass: "text-rose-700",
      valueClass: "text-rose-700",
      subClass: "text-rose-500",
    },
    {
      key: "late",
      label: "Late",
      value: String(stats.late),
      sub: pct(stats.late),
      icon: Clock,
      iconBg: "bg-amber-100 text-amber-600",
      cardBg: "bg-amber-50/70",
      labelClass: "text-amber-700",
      valueClass: "text-amber-700",
      subClass: "text-amber-500",
    },
    {
      key: "rate",
      label: "Attendance Rate",
      value: `${stats.rate}%`,
      sub: "Overall Rate",
      icon: PieChart,
      iconBg: "bg-sky-100 text-sky-600",
      cardBg: "bg-white",
      labelClass: "text-sky-700",
      valueClass: "text-sky-700",
      subClass: "text-sky-400",
    },
  ];

  return (
    <section className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
      {cards.map((card) => (
        <div
          key={card.key}
          className={`flex items-center gap-3 rounded-xl border border-gray-100 p-4 shadow-sm ${card.cardBg}`}
        >
          <span
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${card.iconBg}`}
          >
            <card.icon size={20} />
          </span>
          <div className="min-w-0">
            <p className={`text-xs font-medium ${card.labelClass}`}>
              {card.label}
            </p>
            <p className={`text-xl font-bold ${card.valueClass}`}>
              {card.value}
            </p>
            <p className={`text-[11px] ${card.subClass}`}>{card.sub}</p>
          </div>
        </div>
      ))}
    </section>
  );
};

export default AttendanceStats;