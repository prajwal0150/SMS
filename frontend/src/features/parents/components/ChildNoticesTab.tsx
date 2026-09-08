import { Megaphone } from "lucide-react";

import DataStates from "../components/DataStates";
import useChildSection from "../hooks/useChildSection";
import { fetchParentNotices } from "../services/parentService";
import { formatDate, titleCase } from "../utils/parentUtils";

const PRIORITY_TONES: Record<string, string> = {
  low: "bg-slate-100 text-slate-500",
  normal: "bg-sky-50 text-sky-700",
  high: "bg-amber-50 text-amber-700",
  urgent: "bg-rose-50 text-rose-700",
};

interface ChildNoticesTabProps {
  studentId: string;
}

const ChildNoticesTab = ({ studentId }: ChildNoticesTabProps) => {
  const { loading, error, rows } = useChildSection(
    studentId,
    fetchParentNotices
  );

  return (
    <div className="space-y-3">
      <DataStates
        isLoading={loading}
        error={error}
        empty={
          rows.length === 0
            ? "There are no published notices right now."
            : undefined
        }
      />

      {!loading && !error && rows.length > 0 && (
        <>
          {rows.map((notice) => (
            <article
              key={notice.notice_id}
              className="rounded-lg border border-slate-200 bg-white p-5"
            >
              <div className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                  <Megaphone size={16} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900">
                      {notice.title}
                    </h3>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                        PRIORITY_TONES[notice.priority] ??
                        "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {titleCase(notice.priority)}
                    </span>
                  </div>
                  <p className="mt-0.5 text-[11px] text-slate-400">
                    {formatDate(notice.notice_date)} ·{" "}
                    {notice.category ?? "General"}
                  </p>
                  <p className="mt-2 whitespace-pre-line text-sm text-slate-600">
                    {notice.body}
                  </p>
                  {notice.attachment_name && (
                    <a
                      href={notice.attachment_url ?? "#"}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-2 inline-block text-xs font-semibold text-indigo-600 hover:underline"
                    >
                      Attachment: {notice.attachment_name}
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}
        </>
      )}
    </div>
  );
};

export default ChildNoticesTab;