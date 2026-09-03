import { supabase } from "../../../../lib/supabase";

import type {
  Exam,
  NewExamInput,
  TimetableEntry,
  NewTimetableEntryInput,
  Holiday,
  NewHolidayInput,
} from "../types/academicTypes";


const getCurrentUserId = async (): Promise<string | undefined> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user?.id;
};


// ==============================
// EXAMS
// ==============================

export const fetchExams =
  async (): Promise<Exam[]> => {
    const { data, error } =
      await supabase
        .from("exams")
        .select("*")
        .order("start_date", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return (data ?? []) as Exam[];
  };


export const createExam = async (
  input: NewExamInput
): Promise<Exam> => {
  const createdBy = await getCurrentUserId();

  const { data, error } =
    await supabase
      .from("exams")
      .insert({ ...input, created_by: createdBy ?? null })
      .select()
      .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as Exam;
};


export const deleteExam = async (
  id: string
): Promise<void> => {
  const { error } =
    await supabase
      .from("exams")
      .delete()
      .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
};


// ==============================
// TIMETABLE
// ==============================

export const fetchTimetable =
  async (): Promise<TimetableEntry[]> => {
    const { data, error } =
      await supabase
        .from("timetable")
        .select("*")
        .order("day_of_week", { ascending: true })
        .order("period_number", { ascending: true });

    if (error) {
      throw new Error(error.message);
    }

    return (data ?? []) as TimetableEntry[];
  };


export const createTimetableEntry = async (
  input: NewTimetableEntryInput
): Promise<TimetableEntry> => {
  const createdBy = await getCurrentUserId();

  const { data, error } =
    await supabase
      .from("timetable")
      .insert({ ...input, created_by: createdBy ?? null })
      .select()
      .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as TimetableEntry;
};


export const deleteTimetableEntry = async (
  id: string
): Promise<void> => {
  const { error } =
    await supabase
      .from("timetable")
      .delete()
      .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
};


// ==============================
// HOLIDAYS
// ==============================

export const fetchHolidays =
  async (): Promise<Holiday[]> => {
    const { data, error } =
      await supabase
        .from("holidays")
        .select("*")
        .order("start_date", { ascending: true });

    if (error) {
      throw new Error(error.message);
    }

    return (data ?? []) as Holiday[];
  };


export const createHoliday = async (
  input: NewHolidayInput
): Promise<Holiday> => {
  const createdBy = await getCurrentUserId();

  const { data, error } =
    await supabase
      .from("holidays")
      .insert({ ...input, created_by: createdBy ?? null })
      .select()
      .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as Holiday;
};


export const deleteHoliday = async (
  id: string
): Promise<void> => {
  const { error } =
    await supabase
      .from("holidays")
      .delete()
      .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
};