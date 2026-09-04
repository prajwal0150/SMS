import { supabase } from "../../../lib/supabase";

import type {
  TeacherProfile,
  TeacherClassAssignment,
  TeacherTimetableEntry,
  TeacherFeedItem,
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


// ==============================
// STUDENT ATTENDANCE
// ==============================

export interface StudentRow {
  id: string;
  roll_number: string | null;
  first_name: string;
  middle_name: string | null;
  last_name: string;
}


/**
 * Real student list added by the admin for a class + section.
 */
export const fetchClassStudents = async (
  className: string,
  section: string
): Promise<StudentRow[]> => {
  const { data, error } =
    await supabase
      .from("students")
      .select(
        "id, roll_number, first_name, middle_name, last_name"
      )
      .eq("class_name", className)
      .eq("section", section)
      .eq("status", "active")
      .order("roll_number", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as StudentRow[];
};


export interface ExistingAttendanceRow {
  id: string;
  student_id: string;
  status: string;
}


/**
 * Existing attendance already saved for a class / section /
 * subject / date so the teacher can pre-fill the list.
 */
export const fetchAttendanceForClass = async ({
  classId,
  sectionId,
  subjectId,
  date,
}: {
  classId: string;
  sectionId: string;
  subjectId: string;
  date: string;
}): Promise<ExistingAttendanceRow[]> => {
  const { data, error } =
    await supabase
      .from("student_attendance")
      .select("id, student_id, status")
      .eq("class_id", classId)
      .eq("section_id", sectionId)
      .eq("subject_id", subjectId)
      .eq("attendance_date", date);

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as ExistingAttendanceRow[];
};


export interface AttendanceSaveRow {
  student_id: string;
  teacher_id: string;
  class_id: string;
  section_id: string;
  subject_id: string | null;
  attendance_date: string;
  status: "present" | "absent";
}


/**
 * Upserts attendance records. Existing rows (same student +
 * date + subject) are updated, new rows are inserted, which
 * keeps the unique index happy.
 */
export const saveStudentAttendance = async (
  rows: AttendanceSaveRow[]
): Promise<void> => {
  if (rows.length === 0) {
    return;
  }

  const studentIds = rows.map((row) => row.student_id);
  const first = rows[0];

  const { data: existing, error: fetchError } =
    await supabase
      .from("student_attendance")
      .select("id, student_id")
      .in("student_id", studentIds)
      .eq("attendance_date", first.attendance_date)
      .eq("subject_id", first.subject_id);

  if (fetchError) {
    throw new Error(fetchError.message);
  }

  const existingByStudent = new Map<string, string>(
    (existing ?? []).map((row) => [
      row.student_id,
      row.id,
    ])
  );

  const toUpdate = rows
    .filter((row) => existingByStudent.has(row.student_id))
    .map((row) => ({
      id: existingByStudent.get(row.student_id) as string,
      status: row.status,
    }));

  const toInsert = rows
    .filter((row) => !existingByStudent.has(row.student_id))
    .map((row) => ({
      student_id: row.student_id,
      teacher_id: row.teacher_id,
      class_id: row.class_id,
      section_id: row.section_id,
      subject_id: row.subject_id,
      attendance_date: row.attendance_date,
      status: row.status,
    }));

  const operations: Array<() => Promise<void>> = [];

  if (toUpdate.length > 0) {
    toUpdate.forEach((row) => {
      operations.push(async () => {
        const { error } =
          await supabase
            .from("student_attendance")
            .update({ status: row.status })
            .eq("id", row.id);

        if (error) {
          throw new Error(error.message);
        }
      });
    });
  }

  if (toInsert.length > 0) {
    operations.push(async () => {
      const { error } =
        await supabase
          .from("student_attendance")
          .insert(toInsert);

      if (error) {
        throw new Error(error.message);
      }
    });
  }

  await Promise.all(
    operations.map((operation) => operation())
  );
};


// ==============================
// EXAMS (for teacher results)
// ==============================

/**
 * Exams the admin scheduled for a class
 * (optionally narrowed to one section).
 */
export const fetchExamsByClass = async (
  className: string,
  section?: string
): Promise<
  {
    id: string;
    name: string;
    exam_type: string;
    class_name: string;
    section: string | null;
    start_date: string;
    end_date: string | null;
    status: string;
  }[]
> => {
  let query = supabase
    .from("exams")
    .select(
      "id, name, exam_type, class_name, section, start_date, end_date, status"
    )
    .eq("class_name", className)
    .order("start_date", { ascending: false });

  if (section) {
    query = query.eq("section", section);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as {
    id: string;
    name: string;
    exam_type: string;
    class_name: string;
    section: string | null;
    start_date: string;
    end_date: string | null;
    status: string;
  }[];
};


// ==============================
// CLASS ASSIGNMENTS (homework)
// ==============================

export interface ClassAssignmentRow {
  id: string;
  teacher_id: string;
  title: string;
  description: string | null;
  class_name: string;
  section: string | null;
  subject: string;
  due_date: string;
  status: "Open" | "Grading" | "Closed";
  created_at: string;
}


/**
 * All homework / assignments created by this teacher.
 */
export const fetchClassAssignments = async (
  teacherId: string
): Promise<ClassAssignmentRow[]> => {
  const { data, error } =
    await supabase
      .from("class_assignments")
      .select("*")
      .eq("teacher_id", teacherId)
      .order("due_date", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as ClassAssignmentRow[];
};


export const createClassAssignment = async (
  input: {
    teacher_id: string;
    title: string;
    description?: string | null;
    class_name: string;
    section?: string | null;
    subject: string;
    due_date: string;
  }
): Promise<ClassAssignmentRow> => {
  const { data, error } =
    await supabase
      .from("class_assignments")
      .insert(input)
      .select()
      .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as ClassAssignmentRow;
};


export const updateClassAssignmentStatus = async (
  id: string,
  status: "Open" | "Grading" | "Closed"
): Promise<void> => {
  const { error } =
    await supabase
      .from("class_assignments")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
};


export const deleteClassAssignment = async (
  id: string
): Promise<void> => {
  const { error } =
    await supabase
      .from("class_assignments")
      .delete()
      .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
};


// ==============================
// EXAM RESULTS
// ==============================

export interface ExamResultRow {
  id: string;
  student_id: string;
  marks_obtained: number;
  total_marks: number;
  grade: string | null;
}


/**
 * Saved marks for one exam + class / section / subject,
 * used to pre-fill the marks sheet.
 */
export const fetchExamResults = async ({
  examId,
  subjectId,
}: {
  examId: string;
  subjectId: string;
}): Promise<ExamResultRow[]> => {
  const { data, error } =
    await supabase
      .from("exam_results")
      .select(
        "id, student_id, marks_obtained, total_marks, grade"
      )
      .eq("exam_id", examId)
      .eq("subject_id", subjectId);

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as ExamResultRow[];
};


export interface ExamResultSaveRow {
  student_id: string;
  teacher_id: string;
  exam_id: string;
  class_id: string;
  section_id: string;
  subject_id: string;
  marks_obtained: number;
  total_marks: number;
  grade: string;
}


/**
 * Upserts marks. Existing rows (same student + exam +
 * subject) are updated, new rows are inserted, which keeps
 * the unique index happy.
 */
export const saveExamResults = async (
  rows: ExamResultSaveRow[]
): Promise<void> => {
  if (rows.length === 0) {
    return;
  }

  const studentIds = rows.map((row) => row.student_id);
  const first = rows[0];

  const { data: existing, error: fetchError } =
    await supabase
      .from("exam_results")
      .select("id, student_id")
      .in("student_id", studentIds)
      .eq("exam_id", first.exam_id)
      .eq("subject_id", first.subject_id);

  if (fetchError) {
    throw new Error(fetchError.message);
  }

  const existingByStudent = new Map<string, string>(
    (existing ?? []).map((row) => [
      row.student_id,
      row.id,
    ])
  );

  const toUpdate = rows
    .filter((row) => existingByStudent.has(row.student_id))
    .map((row) => ({
      id: existingByStudent.get(row.student_id) as string,
      marks_obtained: row.marks_obtained,
      total_marks: row.total_marks,
      grade: row.grade,
      updated_at: new Date().toISOString(),
    }));

  const toInsert = rows
    .filter((row) => !existingByStudent.has(row.student_id))
    .map((row) => ({
      student_id: row.student_id,
      teacher_id: row.teacher_id,
      exam_id: row.exam_id,
      class_id: row.class_id,
      section_id: row.section_id,
      subject_id: row.subject_id,
      marks_obtained: row.marks_obtained,
      total_marks: row.total_marks,
      grade: row.grade,
    }));

  if (toUpdate.length > 0) {
    const { error } =
      await supabase
        .from("exam_results")
        .upsert(toUpdate);

    if (error) {
      throw new Error(error.message);
    }
  }

  if (toInsert.length > 0) {
    const { error } =
      await supabase
        .from("exam_results")
        .insert(toInsert);

    if (error) {
      throw new Error(error.message);
    }
  }
};


/**
 * Letter grade from a percentage score.
 */
export const computeGrade = (
  marks: number,
  total: number
): string => {
  if (total <= 0) {
    return "F";
  }

  const percent = (marks / total) * 100;

  if (percent >= 90) return "A+";
  if (percent >= 80) return "A";
  if (percent >= 70) return "B+";
  if (percent >= 60) return "B";
  if (percent >= 50) return "C";
  if (percent >= 40) return "D";
  return "F";
};


// ==============================
// TEACHER FEED
// (notices + announcements + events)
// ==============================

/**
 * Everything the admin publishes on the Communication
 * page, merged into one feed for the teacher Notices
 * page:
 *
 * - notices        -> shown when status = published
 * - announcements  -> shown when status = published and
 *                     audience is "All" or "Teachers"
 * - events         -> shown when status = published
 */
export const fetchTeacherFeed =
  async (): Promise<TeacherFeedItem[]> => {
    const [noticesRes, announcementsRes, eventsRes] =
      await Promise.all([
        supabase
          .from("notices")
          .select(
            "id, title, body, category, date, priority"
          )
          .eq("status", "published"),

        supabase
          .from("announcements")
          .select(
            "id, title, body, audience, date, priority"
          )
          .eq("status", "published")
          .in("audience", ["All", "Teachers"]),

        supabase
          .from("events")
          .select(
            "id, title, description, date, time, location, organizer"
          )
          .eq("status", "published"),
      ]);

    if (noticesRes.error) {
      throw new Error(noticesRes.error.message);
    }

    if (announcementsRes.error) {
      throw new Error(announcementsRes.error.message);
    }

    if (eventsRes.error) {
      throw new Error(eventsRes.error.message);
    }

    const feed: TeacherFeedItem[] = [
      ...(noticesRes.data ?? []).map((row) => ({
        kind: "Notice" as const,
        id: row.id,
        title: row.title,
        body: row.body,
        date: row.date,
        tag: row.category as string,
        priority: row.priority as string,
      })),

      ...(announcementsRes.data ?? []).map((row) => ({
        kind: "Announcement" as const,
        id: row.id,
        title: row.title,
        body: row.body,
        date: row.date,
        tag: row.audience as string,
        priority: row.priority as string,
      })),

      ...(eventsRes.data ?? []).map((row) => ({
        kind: "Event" as const,
        id: row.id,
        title: row.title,
        body: row.description ?? "",
        date: row.date,
        time: row.time as string | null,
        location: row.location as string | null,
        organizer: row.organizer as string | null,
      })),
    ];

    // Newest first.
    return feed.sort((a, b) =>
      b.date.localeCompare(a.date)
    );
  };


// ==============================
// STUDENT COUNTS
// ==============================

/**
 * Number of active students the admin added for a
 * class + section (used for dashboard stats).
 */
export const fetchStudentCountFor = async (
  className: string,
  section: string
): Promise<number> => {
  const { count, error } =
    await supabase
      .from("students")
      .select("id", { count: "exact", head: true })
      .eq("class_name", className)
      .eq("section", section)
      .eq("status", "active");

  if (error) {
    throw new Error(error.message);
  }

  return count ?? 0;
};
