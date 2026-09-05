// A minimal exam shape used by the teacher
// results filters (from the `exams` table).
export interface TeacherExamOption {
  id: string;
  name: string;
  exam_type: string;
  class_name: string;
  section: string | null;
  start_date: string;
  end_date: string | null;
  status: string;
}

// One student row inside a marks sheet.
export interface MarksSheetStudent {
  studentId: string;
  roll: string;
  admissionNumber: string | null;
  name: string;
  obtainedMarks: number | null;
  remarks: string | null;
  workflowStatus:
    | "draft"
    | "submitted"
    | "reviewed"
    | "published"
    | "rejected"
    | null;
}

// The full marks sheet returned to the UI.
export interface MarksSheet {
  examId: string;
  classId: string;
  sectionId: string;
  subjectId: string;
  className: string;
  section: string;
  academicYear: string;
  maximumMarks: number;
  passMarks: number;
  students: MarksSheetStudent[];
}

// Input for fetching a marks sheet.
export interface FetchMarksSheetInput {
  examId: string;
  classId: string;
  sectionId: string;
  subjectId: string;
  className: string;
  section: string;
  academicYear: string;
}

// One student's marks entry.
export interface SubjectMarksEntry {
  studentId: string;
  obtainedMarks: number;
  remarks: string;
}

// Input for persisting (save/submit) marks.
export interface PersistMarksInput {
  examId: string;
  classId: string;
  sectionId: string;
  academicYear: string;
  subjectId: string;
  teacherId: string;
  maximumMarks: number;
  passMarks: number;
  entries: SubjectMarksEntry[];
  submit: boolean;
}

// Summary of one submitted mark group.
export interface MarkGroupSummary {
  key: string;
  className: string;
  sectionName: string;
  subjectName: string;
  examName: string;
  markedCount: number;
  workflow: {
    draft: number;
    submitted: number;
    reviewed: number;
    published: number;
    rejected: number;
  };
}
