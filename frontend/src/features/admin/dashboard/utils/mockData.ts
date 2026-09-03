import type {
  AdminNotice,
  AdminEvent,
} from "../types/adminDashboardTypes";


// ==============================
// ACADEMY OVERVIEW
// ==============================

export const academyStats = {
  students: 2450,
  teachers: 96,
  classes: 32,
  subjects: 14,
};


// ==============================
// NOTICES
// ==============================

export const adminNotices: AdminNotice[] = [
  { id: "an1", title: "Mid-Term Examination Schedule Released", date: "2026-09-04", category: "Academic" },
  { id: "an2", title: "Annual Sports Day - 25 September", date: "2026-09-02", category: "Event" },
  { id: "an3", title: "Staff Meeting Rescheduled to Friday 3 PM", date: "2026-09-01", category: "Staff" },
  { id: "an4", title: "New Library Books Catalogue Uploaded", date: "2026-08-29", category: "General" },
  { id: "an5", title: "Parent-Teacher Meeting - Grades 8 to 10", date: "2026-08-27", category: "Event" },
];


// ==============================
// EVENTS
// ==============================

export const adminEvents: AdminEvent[] = [
  { id: "ae1", title: "Staff Meeting", date: "2026-09-05", time: "15:00", location: "Faculty Lounge" },
  { id: "ae2", title: "Science Exhibition", date: "2026-09-12", time: "10:00", location: "Main Hall" },
  { id: "ae3", title: "PTA Orientation", date: "2026-09-18", time: "17:30", location: "Auditorium" },
  { id: "ae4", title: "Annual Sports Day", date: "2026-09-25", time: "09:00", location: "Sports Ground" },
];