import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  CheckCircle2,
  Download,
  Settings2,
  Timer,
} from "lucide-react";

interface QuickActionsProps {
  onReviewPending: () => void;
  onPublishedResults: () => void;
  onGenerateClassReport: () => void;
  onGenerateReport: () => void;
  onGradeConfiguration: () => void;
  onExportAll: () => void;
}

interface Action {
  label: string;
  hint: string;
  icon: LucideIcon;
  onClick: () => void;
}

const QuickActions = ({
  onReviewPending,
  onPublishedResults,
  onGenerateClassReport,
  onGenerateReport,
  onGradeConfiguration,
  onExportAll,
}: QuickActionsProps) => {
  const actions: Action[] = [
    {
      label: "Review Pending Results",
      hint: "Submitted entries",
      icon: Timer,
      onClick: onReviewPending,
    },
    {
      label: "Approved Results",
      hint: "Ready to publish",
      icon: CheckCircle2,
      onClick: onPublishedResults,
    },
    {
      label: "Generate Class Report",
      hint: "Per-class breakdown",
      icon: BarChart3,
      onClick: onGenerateClassReport,
    },
    {
      label: "Grade Configuration",
      hint: "View grading system",
      icon: Settings2,
      onClick: onGradeConfiguration,
    },
    {
      label: "Export All Results",
      hint: "PDF download",
      icon: Download,
      onClick: onExportAll,
    },
  ];

  return (
    <div>
      <h3 className="mb-3 text-sm font-semibold text-slate-700">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
        {actions.map(({ label, hint, icon: Icon, onClick }) => (
          <button
            key={label}
            type="button"
            onClick={onClick}
            className="flex items-start gap-3 rounded-lg border border-slate-200 bg-white p-4 text-left transition hover:border-indigo-300 hover:shadow-sm"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
              <Icon size={17} />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-semibold text-slate-800">
                {label}
              </span>
              <span className="block truncate text-xs text-slate-400">
                {hint}
              </span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;