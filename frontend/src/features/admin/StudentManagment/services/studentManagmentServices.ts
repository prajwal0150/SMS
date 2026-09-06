import { supabase } from "../../../../lib/supabase";

import type {
  Student,
  CreateStudentInput,
  PromotionInput,
  StudentPromotion,
  StudentDocument,
  NewDocumentInput,
} from "../types/studentManagmentTypes";


// ==============================
// STUDENTS
// ==============================

export const fetchStudents =
  async (): Promise<Student[]> => {
    const { data, error } =
      await supabase
        .from("students")
        .select("*")
        .order("first_name", { ascending: true });

    if (error) {
      throw new Error(error.message);
    }

    return (data ?? []) as Student[];
  };


export const createStudent = async (
  input: CreateStudentInput
): Promise<Student> => {
  // A login account cannot be created without an email.
  if (!input.email) {
    throw new Error(
      "Student email is required to create their login account."
    );
  }

  // 1. Remember the admin's current session so it can be
  // restored after the sign up below.
  const { data: sessionData } =
    await supabase.auth.getSession();

  const adminSession =
    sessionData?.session ?? null;

  // 2. Create the student's real login account
  // (Supabase auth user with email + password).
  const { data: authData, error: authError } =
    await supabase.auth.signUp({
      email: input.email,
      password: input.password,

      options: {
        data: {
          full_name: [
            input.first_name,
            input.middle_name,
            input.last_name,
          ]
            .filter(Boolean)
            .join(" "),
          role: "student",
        },
      },
    });

  if (authError) {
    throw new Error(authError.message);
  }

  if (!authData.user) {
    throw new Error(
      "Student login account could not be created."
    );
  }

  // 3. If sign up also signed the browser in as the new
  // student (email auto-confirm enabled), restore the
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

  // 4. Insert the student row linked to the auth user.
  // The password is only used for the login account -
  // it is never stored in the students table.
  const { data, error } =
    await supabase
      .from("students")
      .insert({
        first_name: input.first_name,
        middle_name: input.middle_name ?? null,
        last_name: input.last_name,
        email: input.email,
        phone: input.phone ?? null,
        roll_number: input.roll_number ?? null,
        admission_number: input.admission_number,
        class_name: input.class_name,
        class_id: input.class_id ?? null,
        section: input.section ?? null,
        section_id: input.section_id ?? null,
        admission_year: input.admission_year,
        admission_date: input.admission_date ?? null,
        gender: input.gender ?? null,
        date_of_birth: input.date_of_birth ?? null,
        blood_group: input.blood_group ?? null,
        category: input.category ?? null,
        rte: input.rte ?? false,
        address: input.address ?? null,
        city: input.city ?? null,
        state: input.state ?? null,
        postal_code: input.postal_code ?? null,
        father_name: input.father_name ?? null,
        mother_name: input.mother_name ?? null,
        guardian_name: input.guardian_name ?? null,
        guardian_phone: input.guardian_phone ?? null,
        photo_url: input.photo_url ?? null,
        status: input.status ?? "active",
        auth_user_id: authData.user.id,
      })
      .select()
      .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as Student;
};


export const deleteStudent = async (
  id: string
): Promise<void> => {
  const { error } =
    await supabase
      .from("students")
      .delete()
      .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
};


// ==============================
// STUDENT PROMOTIONS
// ==============================

export const fetchPromotions =
  async (): Promise<StudentPromotion[]> => {
    const { data, error } =
      await supabase
        .from("student_promotions")
        .select("*")
        .order("promoted_at", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return (data ?? []) as StudentPromotion[];
  };


export const promoteStudents = async (
  input: PromotionInput
): Promise<void> => {
  // Resolve each student's current class/section so the history
  // rows are recorded against the latest database values.
  const { data: current, error: fetchError } =
    await supabase
      .from("students")
      .select("id, class_name, section")
      .in("id", input.student_ids);

  if (fetchError) {
    throw new Error(fetchError.message);
  }

  const rows = (current ?? []).map((student) => ({
    student_id: student.id,
    from_class: student.class_name,
    from_section: student.section ?? null,
    to_class: input.class_name,
    to_section: input.section ?? null,
    academic_year: input.academic_year ?? "2026-27",
    notes: input.notes ?? null,
  }));

  const [
    { error: updateError },
    { error: insertError },
  ] = await Promise.all([
    supabase
      .from("students")
      .update({
        class_name: input.class_name,
        section: input.section ?? null,
      })
      .in("id", input.student_ids),

    supabase
      .from("student_promotions")
      .insert(rows),
  ]);

  if (updateError) {
    throw new Error(updateError.message);
  }

  if (insertError) {
    throw new Error(insertError.message);
  }
};


// ==============================
// STUDENT DOCUMENTS
// ==============================

export const fetchDocuments =
  async (): Promise<StudentDocument[]> => {
    const { data, error } =
      await supabase
        .from("student_documents")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return (data ?? []) as StudentDocument[];
  };


export const createDocument = async (
  input: NewDocumentInput
): Promise<StudentDocument> => {
  const { data, error } =
    await supabase
      .from("student_documents")
      .insert(input)
      .select()
      .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as StudentDocument;
};


export const deleteDocument = async (
  id: string
): Promise<void> => {
  const { error } =
    await supabase
      .from("student_documents")
      .delete()
      .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
};
