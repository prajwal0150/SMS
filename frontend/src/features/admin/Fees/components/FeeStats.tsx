import {
  IndianRupee,
  ReceiptText,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";

import Card from "../../dashboard/components/Card";
import StatCard from "../../dashboard/components/StatCard";

import type { FeeSummary } from "../types/feesTypes";


const formatCurrency = (value: number): string =>
  new Intl.NumberFormat("en-NP", {
    style: "currency",
    currency: "NPR",
    maximumFractionDigits: 0,
  }).format(value);


interface FeeStatsProps {
  summary: FeeSummary | null;
  loading: boolean;
}

const FeeStats = ({ summary, loading }: FeeStatsProps) => {
  if (loading || !summary) {
    return (
      <Card className="p-0">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="flex h-16 items-center gap-3 rounded-lg border border-slate-200 bg-white p-4"
            >
              <div className="h-10 w-10 shrink-0 animate-pulse rounded-lg bg-slate-200" />
              <div className="h-5 w-3/4 animate-pulse rounded bg-slate-200" />
            </div>
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-0">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard
          label="Total Students"
          value={summary.total_students}
          icon={Users}
          accent="bg-[#7C3AED]/10 text-[#7C3AED]"
        />
        <StatCard
          label="Total Outstanding"
          value={formatCurrency(summary.total_outstanding)}
          icon={IndianRupee}
          accent="bg-amber-500/10 text-amber-600"
        />
        <StatCard
          label="Today's Collection"
          value={formatCurrency(summary.today_collection)}
          icon={Wallet}
          accent="bg-emerald-500/10 text-emerald-600"
        />
        <StatCard
          label="Pending Invoices"
          value={summary.pending_invoices}
          icon={ReceiptText}
          accent="bg-blue-500/10 text-blue-600"
        />
        <StatCard
          label="Overdue Invoices"
          value={summary.overdue_invoices}
          icon={TrendingUp}
          accent={
            summary.overdue_invoices > 0
              ? "bg-red-500/10 text-red-600"
              : "bg-slate-300/10 text-slate-500"
          }
        />
      </div>
    </Card>
  );
};

export default FeeStats;
