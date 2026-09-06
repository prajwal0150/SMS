import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import type { Variants } from "motion/react";
import {
  CalendarDays,
  Clock,
  MapPin,
  Megaphone,
  User,
} from "lucide-react";

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
  Event: "bg-emerald-50 text-emerald-600",
};

const PRIORITY_STYLES: Record<string, string> = {
  urgent: "bg-rose-50 text-rose-600",
  high: "bg-orange-50 text-orange-600",
};

/* Staggered fade-up entrance for the whole page. */
const pageVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: "easeOut" },
  },
};

const TeacherNoticesPage = () => {
  const [feed, setFeed] = useState<TeacherFeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedError, setFeedError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FeedFilter>("All");

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const items = await fetchTeacherFeed();

        if (!cancelled) {
          setFeed(items);
          setFeedError(null);
        }
      } catch (error) {
        if (!cancelled) {
          setFeed([]);
          setFeedError(
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
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="show"
      className="space-y-4"
    >
      {/* Compact header */}
      <motion.div
        variants={sectionVariants}
        className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"
      >
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-indigo-600">
            Teacher Portal
          </p>
          <h1 className="mt-0.5 truncate text-lg font-bold tracking-tight text-slate-900 sm:text-xl">
            Notices
          </h1>
          <p className="mt-0.5 text-xs text-slate-500">
            Notices, announcements and events published by the
            school admin.
          </p>
        </div>

        <span className="w-fit shrink-0 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-semibold text-slate-500">
          {visible.length}{" "}
          {visible.length === 1 ? "item" : "items"}
        </span>
      </motion.div>

      {/* Filter pills */}
      <motion.div
        variants={sectionVariants}
        className="flex flex-wrap gap-1.5"
      >
        {FILTERS.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setFilter(option)}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold transition ${
              filter === option
                ? "bg-indigo-600 text-white"
                : "border border-slate-200 bg-white text-slate-500 hover:border-indigo-200 hover:text-indigo-600"
            }`}
          >
            {FILTER_LABELS[option]}
            <span
              className={`flex h-4.5 min-w-[18px] items-center justify-center rounded-full px-1.5 text-[10px] font-bold leading-none ${
                filter === option
                  ? "bg-white text-indigo-700"
                  : "bg-indigo-100 text-indigo-700"
              }`}
            >
              {(counts[option] ?? 0)}
            </span>
          </button>
        ))}
      </motion.div>
{/* Feed */}
      {loading ? (
        <motion.div
          variants={sectionVariants}
          className="rounded-lg border border-slate-200 bg-white py-8 text-center text-xs text-slate-400"
        >
          Loading...
        </motion.div>
      ) : feedError ? (
        <motion.div
          variants={sectionVariants}
          className="rounded-lg border border-red-200 bg-red-50 p-4 text-center"
        >
          <p className="text-sm font-semibold text-red-700">
            Could not load the feed.
          </p>
          <p className="mt-1 break-all text-xs text-red-600">
            {feedError}
          </p>
        </motion.div>
      ) : visible.length === 0 ? (
        <motion.div
          variants={sectionVariants}
          className="rounded-lg border border-dashed border-slate-200 bg-white py-8 text-center"
        >
          <Megaphone size={24} className="mx-auto text-slate-300" />
          <p className="mt-2 text-sm font-medium text-slate-700">
            {feed.length === 0
              ? "Nothing has been published yet."
              : `No ${FILTER_LABELS[filter].toLowerCase()} published yet.`}
          </p>
        </motion.div>
      ) : (
        <div className="space-y-2.5">
          {visible.map((item) => (
            <section
              key={`${item.kind}-${item.id}`}
              className="animate-fade-up rounded-lg border border-slate-200 bg-white p-4 transition-colors hover:border-indigo-200"
            >
              {/* Meta chips */}
              <div className="flex flex-wrap items-center gap-1.5">
                <span
                  className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${KIND_STYLES[item.kind]}`}
                >
                  {item.kind}
                </span>

                {item.tag && (
                  <span className="inline-flex rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                    {item.tag}
                  </span>
                )}

                {item.priority &&
                  PRIORITY_STYLES[item.priority] && (
                  <span
                    className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${PRIORITY_STYLES[item.priority]}`}
                  >
                    {item.priority} priority
                  </span>
                )}

                <span className="flex items-center gap-1 text-[11px] font-medium text-slate-400">
                  <CalendarDays size={11} />
                  {item.date}
                </span>
              </div>

              {/* Title */}
              <h3 className="mt-2.5 flex items-center gap-2 text-sm font-bold text-slate-900">
                <Megaphone
                  size={14}
                  className="shrink-0 text-indigo-600"
                />
                {item.title}
              </h3>

              {/* Body */}
              {item.body && (
                <p className="mt-1.5 text-xs leading-5 text-slate-500">
                  {item.body}
                </p>
              )}

              {/* Event meta */}
              {item.kind === "Event" &&
                (item.time ||
                  item.location ||
                  item.organizer) && (
                  <div className="mt-2.5 flex flex-wrap gap-3 text-[11px] font-medium text-slate-500">
                    {item.time && (
                      <span className="flex items-center gap-1">
                        <Clock
                          size={11}
                          className="text-indigo-500"
                        />
                        {item.time}
                      </span>
                    )}
                    {item.location && (
                      <span className="flex items-center gap-1">
                        <MapPin
                          size={11}
                          className="text-indigo-500"
                        />
                        {item.location}
                      </span>
                    )}
                    {item.organizer && (
                      <span className="flex items-center gap-1">
                        <User
                          size={11}
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
    </motion.div>
  );
};

export default TeacherNoticesPage;