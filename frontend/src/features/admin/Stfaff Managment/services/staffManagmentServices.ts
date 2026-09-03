import { supabase } from "../../../../lib/supabase";

import type {
  Teacher,
  CreateTeacherInput,
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
  input: CreateTeacherInput
): Promise<Teacher> => {
  // 1. Remember the admin's current session so it can be
  // restored after the sign up below.
  const { data: sessionData } =
    await supabase.auth.getSession();

  const adminSession =
    sessionData?.session ?? null;

  // 2. Create the teacher's real login account
  // (Supabase auth user with email + password).
  const { data: authData, error: authError } =
    await supabase.auth.signUp({
      email: input.email,
      password: input.password,

      options: {
        data: {
          full_name:
            `${input.first_name} ${input.last_name}`.trim(),
          role: "teacher",
        },
      },
    });

  if (authError) {
    throw new Error(authError.message);
  }

  if (!authData.user) {
    throw new Error(
      "Teacher login account could not be created."
    );
  }

  // 3. If sign up also signed the browser in as the new
  // teacher (email auto-confirm enabled), restore the
  // admin's session so the admin stays logged in.
  if (authData.session) {
    await supabase.auth.signOut();

    if (adminSession) {
      await supabase.auth.setSession({
        access_token: adminSession.access_token,
        refresh_token: adminSession.refresh_token,
      });
    }
  }

  // 4. Insert the teacher row linked to the auth user.
  const { data, error } =
    await supabase
      .from("teachers")
      .insert({
        first_name: input.first_name,
        last_name: input.last_name,
        email: input.email,
        phone: input.phone,
        subject: input.subject,
        qualification: input.qualification,
        join_date: input.join_date,
        status: input.status,
        auth_user_id: authData.user.id,
      })
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
