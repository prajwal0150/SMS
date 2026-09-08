import { BookOpen, CalendarClock } from "lucide-react";

import DataStates from "../components/DataStates";
import StatusBadge from "../components/StatusBadge";
import useChildSection from "../hooks/useChildSection";
import { fetchChildAssignments } from "../services/parentService";
import { formatDate } from "../utils/parentUtils";

const ASSIGNMENT_TONES = {
  Open: "green",
  Grading: "amber",
  Closed: "slate",
} as const;

interface ChildHomeworkTabProps {
  studentId: string;
}

const ChildHomeworkTab = ({ studentId }: ChildHomeworkTabProps) => {
  const { loading, error, rows } = useChildSection(
    studentId,
    fetchChildAssignments
  );

  return (
    <div className="space-y-3">
      <div className="px-1">
        <DataStates
          isLoading={loading}
          error={error}
          empty={
            rows.length === 0
              ? "No homework has been assigned to this child's class yet."
              : undefined
          }
        />
      </div>

      {!loading && !error && rows.length > 0 && (
        <>
          {rows.map((assignment) => (
            <article
              key={assignment.assignment_id}
              className="rounded-lg border border-slate-200 bg-white p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-sky-50 text-sky-600">
                    <BookOpen size={18} />
                  </span>
                  <div>
                    <p className="text-sm font-bold text-slate-900">
                      {assignment.title}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      {assignment.subject} · {assignment.class_name}
                      {assignment.section
                        ? ` - ${assignment.section}`
                        : ""}
                      {assignment.teacher_name
                        ? ` · ${assignment.teacher_name}`
                        : ""}
                    </p>
                  </div>
                </div>
                <StatusBadge
                  label={assignment.status}
                  tone={ASSIGNMENT_TONES[assignment.status] as string}
                />
              </div>

              {assignment.description && (
                <p className="mt-3 text-sm text-slate-600">
                  {assignment.description}
                </p>
              )}

              <p className="mt-3 flex items-center gap-1.5 text-xs text-slate-400">
                <CalendarClock size={13} />
                Due on {formatDate(assignment.due_date)}
              </p>
            </article>
          ))}
        </>
      )}
    </div>
  );
};

export default ChildHomeworkTab;