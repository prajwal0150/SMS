export type StudentGender =
  | "male"
  | "female"
  | "other";

export type StudentStatus =
  | "active"
  | "inactive"
  | "transferred"
  | "graduated"
  | "alumni";

export type BloodGroup =
  | "A+"
  | "A-"
  | "B+"
  | "B-"
  | "AB+"
  | "AB-"
  | "O+"
  | "O-";

export interface Student {
  id: string;
  first_name: string;
  middle_name: string | null;
  last_name: string;
  email: string | null;
  phone: string | null;
  roll_number: string | null;
  admission_number: string;
  class_name: string;
  section: string | null;
  admission_year: number;
  admission_date: string | null;
  gender: StudentGender | null;
  date_of_birth: string | null;
  blood_group: BloodGroup | null;
  category: string | null;
  rte: boolean;
  address: string | null;
  city: string | null;
  state: string | null;
  postal_code: string | null;
  father_name: string | null;
  mother_name: string | null;
  guardian_name: string | null;
  guardian_phone: string | null;
  photo_url: string | null;
  status: StudentStatus;
  created_at: string;
  updated_at: string;
}

export interface NewStudentInput {
  first_name: string;
  middle_name?: string;
  last_name: string;
  email?: string;
  phone?: string;
  roll_number?: string;
  admission_number: string;
  class_name: string;
  section?: string;
  admission_year: number;
  admission_date?: string;
  gender?: StudentGender;
  date_of_birth?: string;
  blood_group?: BloodGroup;
  category?: string;
  rte?: boolean;
  address?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  father_name?: string;
  mother_name?: string;
  guardian_name?: string;
  guardian_phone?: string;
  photo_url?: string;
  status?: StudentStatus;
}

export interface PromotionInput {
  student_ids: string[];
  class_name: string;
  section?: string;
  academic_year?: string;
  notes?: string;
}

export interface StudentPromotion {
  id: string;
  student_id: string;
  from_class: string;
  from_section: string | null;
  to_class: string;
  to_section: string | null;
  academic_year: string;
  promoted_at: string;
  notes: string | null;
}

export interface StudentDocument {
  id: string;
  student_id: string;
  document_type: string;
  document_name: string;
  file_url: string;
  created_at: string;
}

export interface NewDocumentInput {
  student_id: string;
  document_type: string;
  document_name: string;
  file_url: string;
}

export type DocumentType =
  | "Birth Certificate"
  | "Aadhaar Card"
  | "Marksheet"
  | "Transfer Certificate"
  | "Passport Photo"
  | "Medical Report"
  | "Other";

export type StudentManagementView =
  | "students"
  | "add-student"
  | "promotion"
  | "documents";
