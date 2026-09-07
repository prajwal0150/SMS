import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  Megaphone,
  Send,
  Siren,
} from "lucide-react";

import PageHeader from "../../dashboard/components/PageHeader";

import CommunicationActions from "../components/CommunicationActions";
import NoticesTable from "../components/NoticesTable";
import AnnouncementsTable from "../components/AnnouncementsTable";
import EventsTable from "../components/EventsTable";
import AddNoticeForm from "../components/AddNoticeForm";
import AddAnnouncementForm from "../components/AddAnnouncementForm";
import AddEventForm from "../components/AddEventForm";

import { useCommunication } from "../hooks/useCommunication";

import type {
  CommunicationManagementView,
} from "../types/communicationTypes";


interface CommunicationManagementPageProps {
  initialView?: CommunicationManagementView;
}

const VIEW_LABELS: Record<CommunicationManagementView, string> = {
  notices: "All Notices",
  "add-notice": "Add Notice",
  "add-announcement": "Add Announcement",
  "add-event": "Add Event",
};


const CommunicationManagementPage = ({
  initialView = "notices",
}: CommunicationManagementPageProps) => {
  const [view, setView] =
    useState<CommunicationManagementView>(initialView);

  const {
    notices,
    announcements,
    events,
    loading,
    saving,
    error,
    loadNotices,
    loadAnnouncements,
    loadEvents,
    handleCreateNotice,
    handleDeleteNotice,
    handleCreateAnnouncement,
    handleDeleteAnnouncement,
    handleCreateEvent,
    handleDeleteEvent,
  } = useCommunication();


  // Load everything so the stats and lists show live data.
  useEffect(() => {
    loadNotices();
    loadAnnouncements();
    loadEvents();
  }, [loadNotices, loadAnnouncements, loadEvents]);


  const stats = useMemo(
    () => [
      {
        label: "Total Notices",
        value: notices.length,
        icon: Megaphone,
        tint: "bg-[#166534]/10 text-[#166534]",
      },
      {
        label: "Announcements",
        value: announcements.length,
        icon: Send,
        tint: "bg-[#1E3A5F]/10 text-[#1E3A5F]",
      },
      {
        label: "Upcoming Events",
        value: events.length,
        icon: CalendarDays,
        tint: "bg-[#D4A017]/15 text-[#8A6A0D]",
      },
      {
        label: "Urgent Notices",
        value: notices.filter(
          (notice) => notice.priority === "urgent"
        ).length,
        icon: Siren,
        tint: "bg-red-50 text-red-600",
      },
    ],
    [notices, announcements, events]
  );


  return (
    <>
      <PageHeader
        title="Communication"
        description="Manage notices, announcements and events."
        actions={<CommunicationActions view={view} onChange={setView} />}
      />

      {/* Live stats from Supabase */}
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, tint }, index) => (
          <div
            key={label}
            className="flex animate-fade-up items-center gap-3 rounded-lg border border-slate-200 bg-white p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-200"
            style={{ animationDelay: `${index * 70}ms` }}
          >
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${tint}`}
            >
              <Icon size={18} />
            </div>

            <div className="min-w-0">
              <p className="truncate text-xs font-medium text-slate-500">
                {label}
              </p>
              <p className="text-base font-bold text-slate-900">
                {value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {view !== "notices" && (
        <div className="mt-4 flex animate-fade-up items-center justify-between rounded-lg border border-slate-200 bg-white px-4 py-2">
          <p className="text-xs font-semibold text-slate-900">
            {VIEW_LABELS[view]}
          </p>

          <button
            type="button"
            onClick={() => setView("notices")}
            className="flex items-center gap-1.5 rounded-lg text-xs font-semibold text-[#166534] transition-colors hover:text-[#14532D]"
          >
            <ArrowLeft size={15} />
            Back to Communication
          </button>
        </div>
      )}

      <div className="mt-4 space-y-4">
        {view === "notices" && (
          <>
            <NoticesTable
              notices={notices}
              loading={loading}
              error={error}
              onDelete={handleDeleteNotice}
              onReload={loadNotices}
            />

            <AnnouncementsTable
              announcements={announcements}
              loading={loading}
              onDelete={handleDeleteAnnouncement}
              onReload={loadAnnouncements}
            />

            <EventsTable
              events={events}
              loading={loading}
              onDelete={handleDeleteEvent}
              onReload={loadEvents}
            />
          </>
        )}

        {view === "add-notice" && (
          <AddNoticeForm
            saving={saving}
            onSave={handleCreateNotice}
          />
        )}

        {view === "add-announcement" && (
          <AddAnnouncementForm
            saving={saving}
            onSave={handleCreateAnnouncement}
          />
        )}

        {view === "add-event" && (
          <AddEventForm
            saving={saving}
            onSave={handleCreateEvent}
          />
        )}
      </div>
    </>
  );
};

export default CommunicationManagementPage;