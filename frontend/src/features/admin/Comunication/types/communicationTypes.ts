export type NoticeCategory =
  | "General"
  | "Academic"
  | "Event"
  | "Staff";

export type PublishStatus =
  | "draft"
  | "published"
  | "scheduled"
  | "archived";

export type NoticePriority =
  | "low"
  | "normal"
  | "high"
  | "urgent";

export interface Notice {
  id: string;
  title: string;
  body: string;
  category: NoticeCategory;
  date: string;
  status: PublishStatus;
  priority: NoticePriority;
   attachment_url: string | null;
   attachment_name: string | null;
   created_by: string | null;
   created_at: string;
   updated_at: string;
}

export interface NewNoticeInput {
   title: string;
   body: string;
   category?: NoticeCategory;
   date: string;
   status?: PublishStatus;
   priority?: NoticePriority;
   attachment_url?: string;
   attachment_name?: string;
}

export type AnnouncementAudience =
  | "All"
   | "Students"
   | "Teachers"
   | "Parents";

export interface Announcement {
   id: string;
   title: string;
   body: string;
   audience: AnnouncementAudience;
   date: string;
   status: PublishStatus;
   priority: NoticePriority;
   attachment_url: string | null;
   attachment_name: string | null;
   created_by: string | null;
   created_at: string;
   updated_at: string;
}

export interface NewAnnouncementInput {
   title: string;
   body: string;
   audience?: AnnouncementAudience;
   date: string;
   status?: PublishStatus;
   priority?: NoticePriority;
   attachment_url?: string;
   attachment_name?: string;
}

export type EventStatus =
  | "draft"
   | "published"
   | "scheduled"
   | "cancelled"
   | "completed";

export interface SchoolEvent {
   id: string;
   title: string;
   description: string | null;
   date: string;
   time: string | null;
   location: string | null;
   status: EventStatus;
   organizer: string | null;
   attachment_url: string | null;
   attachment_name: string | null;
   created_by: string | null;
   created_at: string;
   updated_at: string;
}

export interface NewEventInput {
   title: string;
   description?: string;
   date: string;
   time?: string;
   location?: string;
   status?: EventStatus;
   organizer?: string;
   attachment_url?: string;
   attachment_name?: string;
}

export type CommunicationManagementView =
  | "notices"
   | "add-notice"
   | "add-announcement"
   | "add-event";