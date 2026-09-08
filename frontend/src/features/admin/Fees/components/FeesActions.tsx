import {
  BarChart3,
  IndianRupee,
  Layers,
  Receipt,
  Users,
} from "lucide-react";

import type { FeesManagementView } from "../types/feesTypes";


interface FeesActionsProps {
  view: FeesManagementView;
  onChange: (view: FeesManagementView) => void;
}

const baseButton =
  "inline-flex h-11 items-center gap-2 rounded-lg px-4 text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5";


const FeesActions = ({ view, onChange }: FeesActionsProps) => (
  <div className="flex flex-wrap items-center gap-3">
    <button
      type="button"
      onClick={() => onChange("overview")}
      className={`${baseButton} ${
        view === "overview"
          ? "bg-[#7C3AED] text-white"
          : "border border-slate-200 bg-white text-slate-700 hover:border-[#7C3AED]/40"
      }`}
    >
      <BarChart3 size={17} />
      Overview
    </button>

    <button
      type="button"
      onClick={() => onChange("categories")}
      className={`${baseButton} ${
        view === "categories"
          ? "bg-[#7C3AED] text-white"
          : "border border-slate-200 bg-white text-slate-700 hover:border-[#7C3AED]/40"
      }`}
    >
      <Layers size={17} />
      Categories
    </button>

    <button
      type="button"
      onClick={() => onChange("structures")}
      className={`${baseButton} ${
        view === "structures"
          ? "bg-[#7C3AED] text-white"
          : "border border-slate-200 bg-white text-slate-700 hover:border-[#7C3AED]/40"
      }`}
    >
      <IndianRupee size={17} />
      Structures
    </button>

    <button
      type="button"
      onClick={() => onChange("student-fees")}
      className={`${baseButton} ${
        view === "student-fees"
          ? "bg-[#7C3AED] text-white"
          : "border border-slate-200 bg-white text-slate-700 hover:border-[#7C3AED]/40"
      }`}
    >
      <Users size={17} />
      Student Fees
    </button>

    <button
      type="button"
      onClick={() => onChange("invoices")}
      className={`${baseButton} ${
        view === "invoices"
          ? "bg-[#7C3AED] text-white"
          : "border border-slate-200 bg-white text-slate-700 hover:border-[#7C3AED]/40"
      }`}
    >
      <Receipt size={17} />
      Invoices
    </button>

    <button
      type="button"
      onClick={() => onChange("payments")}
      className={`${baseButton} ${
        view === "payments"
          ? "bg-[#7C3AED] text-white"
          : "border border-slate-200 bg-white text-slate-700 hover:border-[#7C3AED]/40"
      }`}
    >
      <IndianRupee size={17} />
      Payments
    </button>
  </div>
);

export default FeesActions;
