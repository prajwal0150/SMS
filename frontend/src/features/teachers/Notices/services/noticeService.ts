import { supabase } from "../../../../lib/supabase";

import type { TeacherFeedItem } from "../types/noticeTypes";

/**
 * Everything the admin publishes on the Communication
 * page, merged into one feed for the teacher Notices
 * page:
 *
 * - notices        -> shown when status = published
 * - announcements  -> shown when status = published and
 *                     audience is "All" or "Teachers"
 * - events         -> shown when status = published
 */
export const fetchTeacherFeed =
  async (): Promise<TeacherFeedItem[]> => {
    const [noticesRes, announcementsRes, eventsRes] =
      await Promise.all([
        supabase
          .from("notices")
          .select(
            "id, title, body, category, date, priority"
          )
          .eq("status", "published"),

        supabase
          .from("announcements")
          .select(
            "id, title, body, audience, date, priority"
          )
          .eq("status", "published")
          .in("audience", ["All", "Teachers"]),

        supabase
          .from("events")
          .select(
            "id, title, description, date, time, location, organizer"
          )
          .eq("status", "published"),
      ]);

    if (noticesRes.error) {
      throw new Error(noticesRes.error.message);
    }

    if (announcementsRes.error) {
      throw new Error(announcementsRes.error.message);
    }

    if (eventsRes.error) {
      throw new Error(eventsRes.error.message);
    }

    const feed: TeacherFeedItem[] = [
      ...(noticesRes.data ?? []).map((row) => ({
        kind: "Notice" as const,
        id: row.id,
        title: row.title,
        body: row.body,
        date: row.date,
        tag: row.category as string,
        priority: row.priority as string,
      })),

      ...(announcementsRes.data ?? []).map((row) => ({
        kind: "Announcement" as const,
        id: row.id,
        title: row.title,
        body: row.body,
        date: row.date,
        tag: row.audience as string,
        priority: row.priority as string,
      })),

      ...(eventsRes.data ?? []).map((row) => ({
        kind: "Event" as const,
        id: row.id,
        title: row.title,
        body: row.description ?? "",
        date: row.date,
        time: row.time as string | null,
        location: row.location as string | null,
        organizer: row.organizer as string | null,
      })),
    ];

    // Newest first.
    return feed.sort((a, b) =>
      b.date.localeCompare(a.date)
    );
  };
