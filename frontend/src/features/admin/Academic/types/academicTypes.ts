export type ExamType =
  | "Unit Test"
  | "Term Exam"
  | "Mid Term"
  | "Half Yearly"
  | "Annual"
  | "Final"
  | "Practical"
  | "Other";

export type ExamStatus =
  | "draft"
  | "upcoming"
  | "ongoing"
  | "completed"
  | "cancelled";

export interface Exam {
  id: string;
  name: string;
  description: string | null;
  exam_type: ExamType;
  class_name: string;
  section: string | null;
  start_date: string;
  end_date: string | null;
  status: ExamStatus;
  instructions: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface NewExamInput {
  name: string;
  description?: string;
  exam_type?: ExamType;
  class_name: string;
  section?: string;
  start_date: string;
  end_date?: string;
  status?: ExamStatus;
  instructions?: string;
}

export type DayOfWeek =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";

export interface TimetableEntry {
  id: string;
  class_name: string;
  section: string | null;
  day_of_week: DayOfWeek;
  period_number: number;
  start_time: string;
  end_time: string;
  subject: string;
  teacher_id: string | null;
  teacher_name: string | null;
  room: string | null;
  created_at: string;
  updated_at: string;
}

export interface NewTimetableEntryInput {
  class_name: string;
  section?: string;
  day_of_week: DayOfWeek;
  period_number: number;
  start_time: string;
  end_time: string;
  subject: string;
  teacher_id?: string;
  teacher_name?: string;
  room?: string;
}

export type HolidayType =
  | "Holiday"
  | "Vacation"
  | "Festival"
  | "National"
  | "School Event"
  | "Other";

export type HolidayAppliesTo =
  | "Everyone"
  | "Students"
  | "Teachers"
  | "Staff";

export type HolidayStatus =
  | "upcoming"
  | "ongoing"
  | "completed"
  | "cancelled";

export interface Holiday {
  id: string;
  name: string;
  description: string | null;
  start_date: string;
  end_date: string | null;
  occasion: string | null;
  holiday_type: HolidayType;
  applies_to: HolidayAppliesTo;
  status: HolidayStatus;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface NewHolidayInput {
  name: string;
  description?: string;
  start_date: string;
  end_date?: string;
  occasion?: string;
  holiday_type?: HolidayType;
  applies_to?: HolidayAppliesTo;
  status?: HolidayStatus;
}

export type AcademicManagementView =
  | "overview"
  | "add-exam"
  | "add-timetable"
  | "add-holiday";