import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  Clock,
  MapPin,
  Megaphone,
  User,
} from "lucide-react";
import toast from "react-hot-toast";

import PageHeader from "../../components/PageHeader";

import { fetchTeacherFeed } from "../services/noticeService";

import type { TeacherFeedItem } from "../types/noticeTypes";

type FeedFilter = "All" | TeacherFeedItem["kind"];

const FILTERS: FeedFilter[] = [
  "All",
  "Notice",
  "Announcement",
  "Event",
];

const FILTER_LABELS: Record<FeedFilter, string> = {
  All: "All",
  Notice: "Notices",
  Announcement: "Announcements",
  Event: "Events",
};

const KIND_STYLES: Record<
  TeacherFeedItem["kind"],
  string
> = {
  Notice: "bg-indigo-50 text-indigo-700",
  Announcement: "bg-sky-50 text-sky-700",
  Event: "bg-green-50 text-green-600",
};

const PRIORITY_STYLES: Record<string, string> = {
  urgent: "bg-red-50 text-red-600",
  high: "bg-orange-50 text-orange-600",
};

const TeacherNoticesPage = () => {
  const [feed, setFeed] = useState<
    TeacherFeedItem[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] =
    useState<FeedFilter>("All");

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const items = await fetchTeacherFeed();

        if (!cancelled) {
          setFeed(items);
        }
      } catch (error) {
        if (!cancelled) {
          toast.error(
            error instanceof Error
              ? error.message
              : "Unable to load the feed."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  const counts = useMemo(
    () => ({
      All: feed.length,
      Notice: feed.filter(
        (item) => item.kind === "Notice"
      ).length,
      Announcement: feed.filter(
        (item) => item.kind === "Announcement"
      ).length,
      Event: feed.filter(
        (item) => item.kind === "Event"
      ).length,
    }),
    [feed]
  );

  const visible =
    filter === "All"
      ? feed
      : feed.filter((item) => item.kind === filter);

  return (
    <>
      <PageHeader
        title="Notices"
        description="Notices, announcements and events published by the school admin."
      />

      <div className="mb-5 flex flex-wrap gap-2">
        {FILTERS.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setFilter(option)}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
              filter === option
                ? "bg-indigo-600 text-white shadow-sm"
                : "border border-slate-200 bg-white text-slate-500 hover:border-indigo-200 hover:text-indigo-600"
            }`}
          >
            {FILTER_LABELS[option]} (
            {counts[option]})
          </button>
        ))}
      </div>

      {loading ? (
        <p className="rounded-lg border border-slate-200 bg-white py-10 text-center text-sm text-slate-400">
          Loading...
        </p>
      ) : visible.length === 0 ? (
        <p className="rounded-lg border border-dashed border-slate-300 bg-white py-10 text-center text-sm text-slate-400">
          {filter === "All"
            ? "Nothing has been published yet."
            : `No ${FILTER_LABELS[filter].toLowerCase()} published yet.`}
        </p>
      ) : (
        <div className="space-y-4">
          {visible.map((item) => (
            <section
              key={`${item.kind}-${item.id}`}
              className="rounded-lg border border-slate-200 bg-white p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-200"
            >
              <div className="flex flex-wrap items-center gap-3">
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${KIND_STYLES[item.kind]}`}
                >
                  {item.kind}
                </span>

                {item.tag && (
                  <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                    {item.tag}
                  </span>
                )}

                {item.priority &&
                  PRIORITY_STYLES[item.priority] && (
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${PRIORITY_STYLES[item.priority]}`}
                    >
                      {item.priority} priority
                    </span>
                  )}

                <span className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
                  <CalendarDays size={14} />
                  {item.date}
                </span>
              </div>

              <h3 className="mt-3 flex items-center gap-2 text-lg font-bold text-slate-900">
                <Megaphone
                  size={18}
                  className="shrink-0 text-indigo-600"
                />
                {item.title}
              </h3>

              {item.body && (
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {item.body}
                </p>
              )}

              {item.kind === "Event" &&
                (item.time ||
                  item.location ||
                  item.organizer) && (
                  <div className="mt-3 flex flex-wrap gap-4 text-xs font-medium text-slate-500">
                    {item.time && (
                      <span className="flex items-center gap-1.5">
                        <Clock
                          size={13}
                          className="text-indigo-500"
                        />
                        {item.time}
                      </span>
                    )}
                    {item.location && (
                      <span className="flex items-center gap-1.5">
                        <MapPin
                          size={13}
                          className="text-indigo-500"
                        />
                        {item.location}
                      </span>
                    )}
                    {item.organizer && (
                      <span className="flex items-center gap-1.5">
                        <User
                          size={13}
                          className="text-indigo-500"
                        />
                        {item.organizer}
                      </span>
                    )}
                  </div>
                )}
            </section>
          ))}
        </div>
      )}
    </>
  );
};

export default TeacherNoticesPage;

