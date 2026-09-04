export type SchoolRecordStatus = "active" | "inactive";

export type SubjectType =
  | "core"
  | "elective"
  | "language"
  | "practical"
  | "activity";

// ==============================
// CLASSES
// ==============================

export interface SchoolClass {
  id: string;
  class_name: string;
  class_code: string | null;
  academic_year: string;
  status: SchoolRecordStatus;
  created_at: string;
  updated_at: string;
}

export interface NewClassInput {
  class_name: string;
  class_code?: string;
  academic_year?: string;
  status?: SchoolRecordStatus;
}

// ==============================
// SECTIONS
// ==============================

export interface ClassSection {
  id: string;
  class_id: string;
  section_name: string;
  class_teacher_id: string | null;
  capacity: number;
  status: SchoolRecordStatus;
  created_at: string;
  updated_at: string;
}

export interface NewSectionInput {
  class_id: string;
  section_name: string;
  capacity?: number;
  status?: SchoolRecordStatus;
}

// ==============================
// SUBJECTS (master list)
// ==============================

export interface Subject {
  id: string;
  subject_name: string;
  subject_code: string;
  description: string | null;
  subject_type: SubjectType;
  status: SchoolRecordStatus;
  created_at: string;
  updated_at: string;
}

export interface NewSubjectInput {
  subject_name: string;
  subject_code: string;
  description?: string;
  subject_type?: SubjectType;
  status?: SchoolRecordStatus;
}

// ==============================
// CLASS SUBJECTS (subject assigned to a class)
// ==============================

export interface ClassSubject {
  id: string;
  class_id: string;
  subject_id: string;
  is_compulsory: boolean;
  weekly_periods: number;
  status: SchoolRecordStatus;
  created_at: string;
  updated_at: string;
  subjects?: Subject;
}

export interface AttachSubjectInput {
  class_id: string;
  subject_id: string;
  is_compulsory?: boolean;
  weekly_periods?: number;
  newSubject?: NewSubjectInput;
}