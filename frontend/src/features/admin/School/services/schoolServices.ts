import { supabase } from "../../../../lib/supabase";

import type {
  AttachSubjectInput,
  ClassSection,
  ClassSubject,
  NewClassInput,
  NewSectionInput,
  NewSubjectInput,
  SchoolClass,
  Subject,
} from "../types/schoolTypes";


// ==============================
// CLASSES
// ==============================

export const fetchClasses = async (): Promise<SchoolClass[]> => {
  const { data, error } =
    await supabase
      .from("school_classes")
      .select("*")
      .order("class_name", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as SchoolClass[];
};


export const createClass = async (
  input: NewClassInput
): Promise<SchoolClass> => {
  const { data, error } =
    await supabase
      .from("school_classes")
      .insert({ ...input, academic_year: input.academic_year ?? "2026-2027" })
      .select()
      .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as SchoolClass;
};


export const deleteClass = async (id: string): Promise<void> => {
  const { error } =
    await supabase
      .from("school_classes")
      .delete()
      .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
};


// ==============================
// SECTIONS
// ==============================

export const fetchSections = async (): Promise<ClassSection[]> => {
  const { data, error } =
    await supabase
      .from("class_sections")
      .select("*")
      .order("section_name", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as ClassSection[];
};


export const createSection = async (
  input: NewSectionInput
): Promise<ClassSection> => {
  const { data, error } =
    await supabase
      .from("class_sections")
      .insert(input)
      .select()
      .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as ClassSection;
};


export const deleteSection = async (id: string): Promise<void> => {
  const { error } =
    await supabase
      .from("class_sections")
      .delete()
      .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
};


// ==============================
// SUBJECTS (master list)
// ==============================

export const fetchSubjects = async (): Promise<Subject[]> => {
  const { data, error } =
    await supabase
      .from("subjects")
      .select("*")
      .order("subject_name", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as Subject[];
};


export const createSubject = async (
  input: NewSubjectInput
): Promise<Subject> => {
  const { data, error } =
    await supabase
      .from("subjects")
      .insert(input)
      .select()
      .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as Subject;
};


// ==============================
// CLASS SUBJECTS (subjects of a class)
// ==============================

export const fetchClassSubjects = async (
  classId: string
): Promise<ClassSubject[]> => {
  const { data, error } =
    await supabase
      .from("class_subjects")
      .select("*, subjects(*)")
      .eq("class_id", classId)
      .order("created_at", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as ClassSubject[];
};


export const assignSubjectToClass = async (
  input: AttachSubjectInput
): Promise<ClassSubject> => {
  const { data, error } =
    await supabase
      .from("class_subjects")
      .insert({
        class_id: input.class_id,
        subject_id: input.subject_id,
        is_compulsory: input.is_compulsory ?? true,
        weekly_periods: input.weekly_periods ?? 5,
      })
      .select("*, subjects(*)")
      .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as ClassSubject;
};


export const removeClassSubject = async (id: string): Promise<void> => {
  const { error } =
    await supabase
      .from("class_subjects")
      .delete()
      .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
};