import { CalendarDays, MapPin, Trash2 } from "lucide-react";

import Card from "../../dashboard/components/Card";
import DataState from "./DataState";

import type { SchoolEvent, EventStatus } from "../types/communicationTypes";


interface EventsTableProps {
  events: SchoolEvent[];
  loading: boolean;
  onDelete: (id: string) => void;
   onReload: () => void;
}

const STATUS_STYLES: Record<EventStatus, string> = {
  draft: "bg-slate-100 text-slate-500",
   published: "bg-[#166534]/10 text-[#166534]",
   scheduled: "bg-[#1E3A5F]/10 text-[#1E3A5F]",
   cancelled: "bg-red-50 text-red-600",
   completed: "bg-indigo-50 text-indigo-600",
};


const EventsTable = ({
  events,
  loading,
  onDelete,
   onReload,
}: EventsTableProps) => (
  <Card
    title="Events"
    subtitle={`${events.length} upcoming events`}
    action={
      !loading && events.length > 0 ? (
        <span className="rounded-full bg-[#D4A017]/15 px-3 py-1 text-xs font-semibold text-[#8A6A0D]">
          {events.length} Total
        </span>
      ) : undefined
    }
    className="overflow-hidden"
  >
    {loading ? (
      <DataState loading onReload={onReload} />
    ) : events.length === 0 ? (
      <DataState message="No events yet. Use 'Add Event' to create the first one." />
    ) : (
      <div className="overflow-x-auto">
        <table className="w-full min-w-[680px] border-collapse text-sm">
          <thead>
            <tr>
              <th className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Event
              </th>
              <th className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Date / Time
              </th>
              <th className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Location
              </th>
              <th className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Status
              </th>
              <th className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr
                key={event.id}
                className="border-b border-slate-100 transition last:border-0 hover:bg-slate-50/60"
              >
                <td className="max-w-md px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#D4A017]/15 text-[#8A6A0D]">
                      <CalendarDays size={16} />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-slate-900">
                        {event.title}
                      </p>
                      <p className="mt-0.5 line-clamp-2 text-xs text-slate-500">
                        {event.description ?? ""}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-600">
                  <p>{event.date}</p>
                  {event.time && (
                    <p className="text-xs text-slate-400">{event.time}</p>
                  )}
                </td>
                <td className="px-4 py-3 text-slate-600">
                  <span className="inline-flex items-center gap-1 text-xs">
                    <MapPin size={12} className="shrink-0 text-slate-400" />
                    {event.location ?? "—"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_STYLES[event.status] ?? "bg-slate-100 text-slate-600"}`}
                  >
                    {event.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => onDelete(event.id)}
                      title="Delete event"
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

export default EventsTable;