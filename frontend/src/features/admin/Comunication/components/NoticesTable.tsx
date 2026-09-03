import { Megaphone, Trash2 } from "lucide-react";

import Card from "../../dashboard/components/Card";
import DataState from "./DataState";

import type { Notice, NoticeCategory } from "../types/communicationTypes";


interface NoticesTableProps {
  notices: Notice[];
  loading: boolean;
  error: string | null;
  onDelete: (id: string) => void;
  onReload: () => void;
}

const CATEGORY_STYLES: Record<NoticeCategory, string> = {
  General: "bg-slate-100 text-slate-600",
  Academic: "bg-indigo-50 text-indigo-600",
  Event: "bg-[#D4A017]/15 text-[#8A6A0D]",
  Staff: "bg-[#1E3A5F]/10 text-[#1E3A5F]",
};


const NoticesTable = ({
  notices,
  loading,
  error,
  onDelete,
  onReload,
}: NoticesTableProps) => (
  <Card
    title="Notices"
    subtitle={`${notices.length} published notices`}
    action={
      !loading && !error && notices.length > 0 ? (
        <span className="rounded-full bg-[#166534]/10 px-3 py-1 text-xs font-semibold text-[#166534]">
          {notices.length} Total
        </span>
      ) : undefined
    }
    className="overflow-hidden"
  >
    {loading ? (
      <DataState loading onReload={onReload} />
    ) : error ? (
      <DataState error={error} onReload={onReload} />
    ) : notices.length === 0 ? (
      <DataState message="No notices yet. Use 'Add Notice' to create the first one." />
    ) : (
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-sm">
          <thead>
            <tr>
              <th className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Notice
              </th>
              <th className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Category
              </th>
              <th className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Date
              </th>
              <th className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {notices.map((notice) => (
              <tr
                key={notice.id}
                className="border-b border-slate-100 transition last:border-0 hover:bg-slate-50/60"
              >
                <td className="max-w-md px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#166534]/10 text-[#166534]">
                      <Megaphone size={16} />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-slate-900">
                        {notice.title}
                      </p>
                      <p className="mt-0.5 line-clamp-2 text-xs text-slate-500">
                        {notice.body}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${CATEGORY_STYLES[notice.category] ?? "bg-slate-100 text-slate-600"}`}
                  >
                    {notice.category}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-600">
                  {notice.date}
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => onDelete(notice.id)}
                      title="Delete notice"
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </Card>
);

export default NoticesTable;