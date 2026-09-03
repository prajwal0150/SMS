import { supabase } from "../../../lib/supabase";

import type {
  TeacherProfile,
  TeacherClassAssignment,
  TeacherTimetableEntry,
} from "../types/teacherTypes";


// ==============================
// TEACHER PROFILE
// ==============================

export const fetchTeacherProfile = async (
  email: string
): Promise<TeacherProfile | null> => {
  const { data, error } =
    await supabase
      .from("teachers")
      .select("*")
      .eq("email", email)
      .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    return null;
  }

  return {
    id: data.id,
    firstName: data.first_name,
    lastName: data.last_name,
    email: data.email,
    subject: data.subject,
    status: data.status,
  };
};


// ==============================
// TEACHER CLASS ASSIGNMENTS
// ==============================

export const fetchTeacherAssignments = async (
  teacherId: string
): Promise<TeacherClassAssignment[]> => {
  const { data, error } =
    await supabase
      .from("teacher_assignments")
      .select("*")
      .eq("teacher_id", teacherId)
      .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((row) => ({
    id: row.id,
    className: row.class_name,
    section: row.section,
    subject: row.subject,
  }));
};


// ==============================
// TEACHER TIMETABLE
// ==============================

export const fetchTeacherTimetable = async (
  teacherId: string
): Promise<TeacherTimetableEntry[]> => {
  const { data, error } =
    await supabase
      .from("timetable")
      .select("*")
      .eq("teacher_id", teacherId);

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((row) => ({
    id: row.id,
    day: row.day_of_week,
    period: row.period_number,
    startTime: row.start_time,
    endTime: row.end_time,
    subject: row.subject,
    className: row.class_name,
    section: row.section,
    room: row.room,
  }));
};
