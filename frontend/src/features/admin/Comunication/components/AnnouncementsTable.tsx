import { Send, Trash2 } from "lucide-react";

import Card from "../../dashboard/components/Card";
import DataState from "./DataState";

import type {
  Announcement,
  AnnouncementAudience,
} from "../types/communicationTypes";


interface AnnouncementsTableProps {
  announcements: Announcement[];
  loading: boolean;
  onDelete: (id: string) => void;
  onReload: () => void;
}

const AUDIENCE_STYLES: Record<AnnouncementAudience, string> = {
  All: "bg-slate-100 text-slate-600",
  Students: "bg-indigo-50 text-indigo-600",
  Teachers: "bg-[#1E3A5F]/10 text-[#1E3A5F]",
   Parents: "bg-[#D4A017]/15 text-[#8A6A0D]",
};


const AnnouncementsTable = ({
  announcements,
  loading,
  onDelete,
  onReload,
}: AnnouncementsTableProps) => (
  <Card
    title="Announcements"
    subtitle={`${announcements.length} announcements`}
    action={
      !loading && announcements.length > 0 ? (
        <span className="rounded-full bg-[#1E3A5F]/10 px-3 py-1 text-xs font-semibold text-[#1E3A5F]">
          {announcements.length} Total
        </span>
      ) : undefined
    }
    className="overflow-hidden"
  >
    {loading ? (
      <DataState loading onReload={onReload} />
    ) : announcements.length === 0 ? (
      <DataState message="No announcements yet. Use 'Add Announcement' to create the first one." />
    ) : (
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-sm">
          <thead>
            <tr>
              <th className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Announcement
              </th>
              <th className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Audience
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
            {announcements.map((announcement) => (
              <tr
                key={announcement.id}
                className="border-b border-slate-100 transition last:border-0 hover:bg-slate-50/60"
              >
                <td className="max-w-md px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#1E3A5F]/10 text-[#1E3A5F]">
                      <Send size={16} />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-slate-900">
                        {announcement.title}
                      </p>
                      <p className="mt-0.5 line-clamp-2 text-xs text-slate-500">
                        {announcement.body}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${AUDIENCE_STYLES[announcement.audience] ?? "bg-slate-100 text-slate-600"}`}
                  >
                    {announcement.audience}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-600">
                  {announcement.date}
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => onDelete(announcement.id)}
                      title="Delete announcement"
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

export default AnnouncementsTable;