import {
  FileText,
  GraduationCap,
  UserPlus,
} from "lucide-react";

import type {
  StudentManagementView,
} from "../types/studentManagmentTypes";


interface StudentManagementActionsProps {
  view: StudentManagementView;
  onChange: (view: StudentManagementView) => void;
}

const baseButton =
  "inline-flex h-11 items-center gap-2 rounded-lg px-4 text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5";


const StudentManagementActions = ({
  view,
  onChange,
}: StudentManagementActionsProps) => (
  <div className="flex flex-wrap items-center gap-3">
    {/* Add Student — primary action */}
    <button
      type="button"
      onClick={() => onChange("add-student")}
      className={`${baseButton} bg-[#166534] text-white hover:bg-[#14532D] ${
        view === "add-student" ? "ring-4 ring-[#166534]/15" : ""
      }`}
    >
      <UserPlus size={17} />
      Add Student
    </button>

    {/* Promotion */}
    <button
      type="button"
      onClick={() => onChange("promotion")}
      className={`${baseButton} ${
        view === "promotion"
          ? "border border-[#1E3A5F] bg-[#1E3A5F] text-white"
          : "border border-slate-200 bg-white text-slate-700 hover:border-[#1E3A5F]/40"
      }`}
    >
      <GraduationCap
        size={17}
        className={view === "promotion" ? "" : "text-[#1E3A5F]"}
      />
      Promotion
    </button>

    {/* Documents */}
    <button
      type="button"
      onClick={() => onChange("documents")}
      className={`${baseButton} ${
        view === "documents"
          ? "border border-[#D4A017] bg-[#D4A017] text-[#1F2937]"
          : "border border-slate-200 bg-white text-slate-700 hover:border-[#D4A017]/50"
      }`}
    >
      <FileText
        size={17}
        className={view === "documents" ? "" : "text-[#B8860B]"}
      />
      Documents
    </button>
  </div>
);

export default StudentManagementActions;