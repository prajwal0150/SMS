import { supabase } from "../../../../lib/supabase";

import type {
  FetchMarksSheetInput,
  MarkGroupSummary,
  MarksSheet,
  PersistMarksInput,
  TeacherExamOption,
} from "../types/resultTypes";

/**
 * Fetch the exams available for a class (used to populate
 * the exam dropdown on the marks entry page).
 */
export const fetchExamsByClass = async (
  className: string,
  section?: string
): Promise<TeacherExamOption[]> => {
  let query = supabase
    .from("exams")
    .select("id, name, exam_type, class_name, section, start_date, end_date, status")
    .eq("class_name", className);

  if (section) {
    query = query.eq("section", section);
  }

  const { data, error } = await query.order("start_date", {
    ascending: false,
  });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((row) => ({
    id: row.id,
    name: row.name,
    exam_type: row.exam_type,
    class_name: row.class_name,
    section: row.section,
    start_date: row.start_date,
    end_date: row.end_date,
    status: row.status,
  }));
};

/**
 * Build the full marks sheet for a class + section + subject + exam.
 *
 * The results table is keyed per student (student_id + exam_id +
 * academic_year) and result_marks is keyed per subject
 * (result_id + subject_id), so existing marks are linked back to
 * students through the result join.
 */
export const fetchMarksSheet = async (
  input: FetchMarksSheetInput
): Promise<MarksSheet> => {
  const { examId, classId, sectionId, subjectId, className, section, academicYear } = input;

  // 1. Students in this class + section.
  const { data: studentsData, error: studentsError } = await supabase
    .from("students")
    .select("id, roll_number, admission_number, first_name, middle_name, last_name")
    .eq("class_id", classId)
    .eq("section_id", sectionId)
    .eq("status", "active")
    .order("roll_number", { ascending: true });

  if (studentsError) {
    throw new Error(studentsError.message);
  }

  // 2. Existing subject marks for this exam + subject, linked to the student.
  const { data: marksData, error: marksError } = await supabase
    .from("result_marks")
    .select("obtained_marks, remarks, maximum_marks, pass_marks, result:result_id(student_id, exam_id, workflow_status)")
    .eq("subject_id", subjectId)
    .eq("result.exam_id", examId);

  if (marksError) {
    throw new Error(marksError.message);
  }

  // 3. Index existing marks by student_id.
  const marksByStudent = new Map<
    string,
    {
      obtainedMarks: number | null;
      remarks: string | null;
      maximumMarks: number | null;
      passMarks: number | null;
      status: "draft" | "submitted" | "reviewed" | "published" | "rejected" | null;
    }
  >();

  (marksData ?? []).forEach((row: any) => {
    const result = Array.isArray(row.result) ? row.result[0] : row.result;
    if (result?.student_id) {
      marksByStudent.set(result.student_id, {
        obtainedMarks: row.obtained_marks,
        remarks: row.remarks,
        maximumMarks: row.maximum_marks,
        passMarks: row.pass_marks,
        status: (result.workflow_status as any) ?? null,
      });
    }
  });

  // 4. Max / pass marks: read from the last mark saved for the
  // subject (falling back to the standard 100 / 33 defaults).
  const existingMark = (marksData ?? []).find((row: any) => row.maximum_marks != null);
  const maximumMarks = existingMark?.maximum_marks != null
    ? Number(existingMark.maximum_marks)
    : 100;
  const passMarks = existingMark?.pass_marks != null
    ? Number(existingMark.pass_marks)
    : 33;

  return {
    examId,
    classId,
    sectionId,
    subjectId,
    className,
    section,
    academicYear,
    maximumMarks,
    passMarks,
    students: (studentsData ?? []).map((s) => {
      const existing = marksByStudent.get(s.id);
      return {
        studentId: s.id,
        roll: s.roll_number ?? "",
        admissionNumber: s.admission_number ?? null,
        name: [s.first_name, s.middle_name, s.last_name]
          .filter(Boolean)
          .join(" "),
        obtainedMarks: existing?.obtainedMarks ?? null,
        remarks: existing?.remarks ?? null,
        workflowStatus: existing?.status ?? null,
      };
    }),
  };
};


/**
 * Persist marks for one subject in one exam.
 *
 * One `results` row is created per student (keyed by
 * student_id + exam_id + academic_year) and one `result_marks`
 * row per subject per result. On submit the workflow is moved
 * to "submitted" so it appears on the Admin Results page for
 * review.
 */
export const persistSubjectMarks = async (
  input: PersistMarksInput
): Promise<number> => {
  const {
    examId,
    classId,
    sectionId,
    academicYear,
    subjectId,
    teacherId,
    maximumMarks,
    passMarks,
    entries,
    submit,
  } = input;

  const workflowStatus = submit ? "submitted" : "draft";
  const now = new Date().toISOString();
  let updated = 0;

  for (const entry of entries) {
    // 1. Find or create the per-student result row.
    const { data: existing, error: findError } = await supabase
      .from("results")
      .select("id")
      .eq("student_id", entry.studentId)
      .eq("exam_id", examId)
      .eq("academic_year", academicYear)
      .maybeSingle();

    if (findError) {
      throw new Error(findError.message);
    }

    let resultId: string;

    if (existing) {
      resultId = existing.id;

      const { error: updateError } = await supabase
        .from("results")
        .update({
          workflow_status: workflowStatus,
          submitted_by: teacherId,
          updated_at: now,
        })
        .eq("id", resultId);

      if (updateError) {
        throw new Error(updateError.message);
      }
    } else {
      const { data: created, error: insertError } = await supabase
        .from("results")
        .insert({
          student_id: entry.studentId,
          exam_id: examId,
          class_id: classId,
          section_id: sectionId,
          academic_year: academicYear,
          workflow_status: workflowStatus,
          submitted_by: teacherId,
        })
        .select("id")
        .single();

      if (insertError) {
        throw new Error(insertError.message);
      }

      resultId = created.id;
    }

    // 2. Upsert the subject mark for this result.
    const { error: marksError } = await supabase
      .from("result_marks")
      .upsert(
        {
          result_id: resultId,
          subject_id: subjectId,
          teacher_id: teacherId,
          maximum_marks: maximumMarks,
          pass_marks: passMarks,
          obtained_marks: entry.obtainedMarks,
          remarks: entry.remarks,
        },
        { onConflict: "result_id,subject_id" }
      );

    if (marksError) {
      throw new Error(marksError.message);
    }

    updated += 1;
  }

  return updated;
};

/**
 * Fetch the teacher's submitted mark groups (for the
 * "Submitted" tab on the results page).
 */
export const fetchTeacherMarkGroups = async (
  teacherId: string
): Promise<MarkGroupSummary[]> => {
  const { data, error } = await supabase
    .from("result_report")
    .select(
      "class_name, section_name, subject_name, exam_name, result_id, workflow_status"
    )
    .eq("teacher_id", teacherId);

  if (error) {
    throw new Error(error.message);
  }

  // Group by class + section + subject + exam.
  const groups = new Map<string, MarkGroupSummary>();

  (data ?? []).forEach((row: any) => {
    const key = `${row.class_name}|${row.section_name}|${row.subject_name}|${row.exam_name}`;

    if (!groups.has(key)) {
      groups.set(key, {
        key,
        className: row.class_name,
        sectionName: row.section_name,
        subjectName: row.subject_name,
        examName: row.exam_name,
        markedCount: 0,
        workflow: {
          draft: 0,
          submitted: 0,
          reviewed: 0,
          published: 0,
          rejected: 0,
        },
      });
    }

    const group = groups.get(key)!;
    group.markedCount += 1;

    const status = row.workflow_status as keyof MarkGroupSummary["workflow"];
    if (status in group.workflow) {
      group.workflow[status] += 1;
    }
  });

  return Array.from(groups.values());
};
