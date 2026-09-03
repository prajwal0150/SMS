import { supabase } from "../../../../lib/supabase";

import type {
  Teacher,
  NewTeacherInput,
  TeacherAssignment,
  NewAssignmentInput,
  StaffAttendance,
  NewAttendanceInput,
} from "../types/staffManagmentTypes";


// ==============================
// TEACHERS
// ==============================

export const fetchTeachers =
  async (): Promise<Teacher[]> => {
    const { data, error } =
      await supabase
        .from("teachers")
        .select("*")
        .order("first_name", { ascending: true });

    if (error) {
      throw new Error(error.message);
    }

    return (data ?? []) as Teacher[];
  };


export const createTeacher = async (
  input: NewTeacherInput
): Promise<Teacher> => {
  const { data, error } =
    await supabase
      .from("teachers")
      .insert(input)
      .select()
      .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as Teacher;
};


export const deleteTeacher = async (
  id: string
): Promise<void> => {
  const { error } =
    await supabase
      .from("teachers")
      .delete()
      .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
};


// ==============================
// TEACHER ASSIGNMENTS
// ==============================

export const fetchAssignments =
  async (): Promise<TeacherAssignment[]> => {
    const { data, error } =
      await supabase
        .from("teacher_assignments")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return (data ?? []) as TeacherAssignment[];
  };


export const createAssignment = async (
  input: NewAssignmentInput
): Promise<TeacherAssignment> => {
  const { data, error } =
    await supabase
      .from("teacher_assignments")
      .insert(input)
      .select()
      .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as TeacherAssignment;
};


// ==============================
// STAFF ATTENDANCE
// ==============================

export const fetchAttendance =
  async (): Promise<StaffAttendance[]> => {
    const { data, error } =
      await supabase
        .from("staff_attendance")
        .select("*")
        .order("date", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return (data ?? []) as StaffAttendance[];
  };


export const markAttendance = async (
  input: NewAttendanceInput
): Promise<StaffAttendance> => {
  const { data, error } =
    await supabase
      .from("staff_attendance")
      .upsert(input, {
        onConflict: "teacher_id,date",
      })
      .select()
      .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as StaffAttendance;
};
