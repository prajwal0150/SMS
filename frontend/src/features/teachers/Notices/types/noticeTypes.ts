// Unified feed shown on the teacher Notices page —
// combines everything the admin publishes on the
// Communication page (notices, announcements
// targeted at teachers, and events).
export type TeacherFeedItem = {
  kind: "Notice" | "Announcement" | "Event";
  id: string;
  title: string;
  body: string;
  date: string;
  // Category (notices) or audience (announcements).
  tag?: string;
  priority?: string;
  // Event-only details.
  time?: string | null;
  location?: string | null;
  organizer?: string | null;
};
