import {
  CalendarClock,
  ClipboardList,
  Sun,
} from "lucide-react";

import type {
  AcademicManagementView,
} from "../types/academicTypes";


interface AcademicActionsProps {
  view: AcademicManagementView;
  onChange: (view: AcademicManagementView) => void;
}

const baseButton =
  "inline-flex h-11 items-center gap-2 rounded-lg px-4 text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5";


const AcademicActions = ({
  view,
  onChange,
}: AcademicActionsProps) => (
  <div className="flex flex-wrap items-center gap-3">
    {/* Add Exam — primary action */}
    <button
      type="button"
      onClick={() => onChange("add-exam")}
      className={`${baseButton} bg-[#166534] text-white hover:bg-[#14532D] ${
        view === "add-exam" ? "ring-4 ring-[#166534]/15" : ""
      }`}
    >
      <ClipboardList size={17} />
      Add Exam
    </button>

    {/* Add Timetable */}
    <button
      type="button"
      onClick={() => onChange("add-timetable")}
      className={`${baseButton} ${
        view === "add-timetable"
          ? "border border-[#1E3A5F] bg-[#1E3A5F] text-white"
          : "border border-slate-200 bg-white text-slate-700 hover:border-[#1E3A5F]/40"
      }`}
    >
      <CalendarClock
        size={17}
        className={view === "add-timetable" ? "" : "text-[#1E3A5F]"}
      />
      Add Timetable
    </button>

    {/* Add Holiday */}
    <button
      type="button"
      onClick={() => onChange("add-holiday")}
      className={`${baseButton} ${
        view === "add-holiday"
          ? "border border-[#D4A017] bg-[#D4A017] text-[#1F2937]"
          : "border border-slate-200 bg-white text-slate-700 hover:border-[#D4A017]/50"
      }`}
    >
      <Sun
        size={17}
        className={view === "add-holiday" ? "" : "text-[#B8860B]"}
      />
      Add Holiday
    </button>
  </div>
);

export default AcademicActions;