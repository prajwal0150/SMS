import { CalendarCheck, ClipboardList, UserPlus } from "lucide-react";

import type {
  StaffManagementView,
} from "../types/staffManagmentTypes";


interface StaffManagementActionsProps {
  view: StaffManagementView;
  onChange: (view: StaffManagementView) => void;
}

const baseButton =
  "inline-flex h-11 items-center gap-2 rounded-lg px-4 text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5";


const StaffManagementActions = ({
  view,
  onChange,
}: StaffManagementActionsProps) => (
  <div className="flex flex-wrap items-center gap-3">
    {/* Add Teacher — primary action */}
    <button
      type="button"
      onClick={() => onChange("add-teacher")}
      className={`${baseButton} bg-[#166534] text-white hover:bg-[#14532D] ${
        view === "add-teacher" ? "ring-4 ring-[#166534]/15" : ""
      }`}
    >
      <UserPlus size={17} />
      Add Teacher
    </button>

    {/* Assignments */}
    <button
      type="button"
      onClick={() => onChange("assignments")}
      className={`${baseButton} ${
        view === "assignments"
          ? "border border-[#1E3A5F] bg-[#1E3A5F] text-white"
          : "border border-slate-200 bg-white text-slate-700 hover:border-[#1E3A5F]/40"
      }`}
    >
      <ClipboardList
        size={17}
        className={view === "assignments" ? "" : "text-[#1E3A5F]"}
      />
      Assignments
    </button>

    {/* Attendance */}
    <button
      type="button"
      onClick={() => onChange("attendance")}
      className={`${baseButton} ${
        view === "attendance"
          ? "border border-[#D4A017] bg-[#D4A017] text-[#1F2937]"
          : "border border-slate-200 bg-white text-slate-700 hover:border-[#D4A017]/50"
      }`}
    >
      <CalendarCheck
        size={17}
        className={view === "attendance" ? "" : "text-[#B8860B]"}
      />
      Attendance
    </button>
  </div>
);

export default StaffManagementActions;