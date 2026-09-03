import {
  CalendarPlus,
  Megaphone,
  Send,
} from "lucide-react";

import type {
  CommunicationManagementView,
} from "../types/communicationTypes";


interface CommunicationActionsProps {
  view: CommunicationManagementView;
  onChange: (view: CommunicationManagementView) => void;
}

const baseButton =
  "inline-flex h-11 items-center gap-2 rounded-lg px-4 text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5";


const CommunicationActions = ({
  view,
  onChange,
}: CommunicationActionsProps) => (
  <div className="flex flex-wrap items-center gap-3">
    {/* Add Notice — primary action */}
    <button
      type="button"
      onClick={() => onChange("add-notice")}
      className={`${baseButton} bg-[#166534] text-white hover:bg-[#14532D] ${
        view === "add-notice" ? "ring-4 ring-[#166534]/15" : ""
      }`}
    >
      <Megaphone size={17} />
      Add Notice
    </button>

    {/* Add Announcement */}
    <button
      type="button"
      onClick={() => onChange("add-announcement")}
      className={`${baseButton} ${
        view === "add-announcement"
          ? "border border-[#1E3A5F] bg-[#1E3A5F] text-white"
          : "border border-slate-200 bg-white text-slate-700 hover:border-[#1E3A5F]/40"
      }`}
    >
      <Send
        size={17}
        className={view === "add-announcement" ? "" : "text-[#1E3A5F]"}
      />
      Add Announcement
    </button>

    {/* Add Event */}
    <button
      type="button"
      onClick={() => onChange("add-event")}
      className={`${baseButton} ${
        view === "add-event"
          ? "border border-[#D4A017] bg-[#D4A017] text-[#1F2937]"
          : "border border-slate-200 bg-white text-slate-700 hover:border-[#D4A017]/50"
      }`}
    >
      <CalendarPlus
        size={17}
        className={view === "add-event" ? "" : "text-[#B8860B]"}
      />
      Add Event
    </button>
  </div>
);

export default CommunicationActions;