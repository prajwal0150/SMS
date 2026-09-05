import { supabase } from "../../../../lib/supabase";

import type { ClassAssignmentItem } from "../types/assignmentTypes";

/**
 * Fetch all class assignments for a teacher.
 */
export const fetchClassAssignments = async (
  teacherId: string
): Promise<ClassAssignmentItem[]> => {
  const { data, error } = await supabase
    .from("class_assignments")
    .select("*")
    .eq("teacher_id", teacherId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((row) => ({
    id: row.id,
    teacher_id: row.teacher_id,
    title: row.title,
    description: row.description,
    class_name: row.class_name,
    section: row.section,
    subject: row.subject,
    due_date: row.due_date,
    status: row.status,
    created_at: row.created_at,
  }));
};

/**
 * Create a new class assignment.
 */
export const createClassAssignment = async (input: {
  teacher_id: string;
  title: string;
  description?: string | null;
  class_name: string;
  section?: string | null;
  subject: string;
  due_date: string;
  status?: string;
}): Promise<ClassAssignmentItem> => {
  const { data, error } = await supabase
    .from("class_assignments")
    .insert({
      teacher_id: input.teacher_id,
      title: input.title,
      description: input.description ?? null,
      class_name: input.class_name,
      section: input.section ?? null,
      subject: input.subject,
      due_date: input.due_date,
      status: input.status ?? "Open",
    })
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return {
    id: data.id,
    teacher_id: data.teacher_id,
    title: data.title,
    description: data.description,
    class_name: data.class_name,
    section: data.section,
    subject: data.subject,
    due_date: data.due_date,
    status: data.status,
    created_at: data.created_at,
  };
};

/**
 * Delete a class assignment.
 */
export const deleteClassAssignment = async (
  id: string
): Promise<void> => {
  const { error } = await supabase
    .from("class_assignments")
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
};

/**
 * Update a class assignment's status.
 */
export const updateClassAssignmentStatus = async (
  id: string,
  status: "Open" | "Grading" | "Closed"
): Promise<void> => {
  const { error } = await supabase
    .from("class_assignments")
    .update({ status })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
};

