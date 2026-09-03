import { supabase } from "../../../../lib/supabase";

import type {
  Student,
  NewStudentInput,
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
  input: NewStudentInput
): Promise<Student> => {
  const { data, error } =
    await supabase
      .from("students")
      .insert(input)
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
