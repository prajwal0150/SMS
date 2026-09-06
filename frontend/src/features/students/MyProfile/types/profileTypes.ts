// Everything the My Profile page renders about one student.
// Sourced from the student_profile / student_profile_summary
// views (supabase/Student/student-profile.sql), with the raw
// students table as a fallback.
export interface StudentProfileData {
  student_id: string;
  first_name: string;
  middle_name: string | null;
  last_name: string;
  photo_url: string | null;
  status: string;

  email: string | null;
  phone: string | null;

  admission_number: string;
  roll_number: string | null;

  class_name: string | null;
  section_name: string | null;
  class_teacher_name: string | null;
  academic_year: string | null;

  admission_year: number | null;
  admission_date: string | null;

  gender: string | null;
  date_of_birth: string | null;
  blood_group: string | null;
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

  total_subjects: number | null;
}

// Editable fields accepted by update_my_student_profile.
// Admission / academic fields are admin controlled and are
// deliberately not included.
export interface ProfileEditInput {
  first_name: string;
  middle_name: string | null;
  last_name: string;
  phone: string | null;
  gender: string | null;
  date_of_birth: string | null;
  blood_group: string | null;
  category: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  postal_code: string | null;
  father_name: string | null;
  mother_name: string | null;
  guardian_name: string | null;
  guardian_phone: string | null;
}

// Row of the student_documents table (uploaded by the admin).
export interface StudentDocument {
  id: string;
  document_type: string;
  document_name: string;
  file_url: string;
  created_at: string;
}
