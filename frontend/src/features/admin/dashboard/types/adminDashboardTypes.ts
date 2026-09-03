export interface AdminNotice {
  id: string;
  title: string;
  date: string;
  category: "Academic" | "Event" | "Staff" | "General";
}

export interface AdminEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
}