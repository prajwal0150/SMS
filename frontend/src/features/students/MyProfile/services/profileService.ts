import { supabase } from "../../../../lib/supabase";

import type {
  ProfileEditInput,
  StudentDocument,
  StudentProfileData,
} from "../types/profileTypes";

/**
 * My Profile service.
 *
 * Reads the logged in student's profile from the
 * student_profile / student_profile_summary views created by
 * supabase/Student/student-profile.sql, and falls back to a
 * direct read of the students table when those views are not
 * available (or the account predates them).
 */

const STUDENT_COLUMNS =
  "id, first_name, middle_name, last_name, email, phone, roll_number, admission_number, class_name, section, admission_year, admission_date, gender, date_of_birth, blood_group, category, rte, address, city, state, postal_code, father_name, mother_name, guardian_name, guardian_phone, photo_url, status";

const PHOTO_BUCKET = "student-photos";

export const MAX_PHOTO_BYTES = 5 * 1024 * 1024;

// Row of public.students used for fallback / backfill.
interface StudentRow {
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
  photo_url: string | null;
  status: string;
}

/**
 * The students row belonging to the logged in account -
 * matched by the linked auth account first, then by email
 * (the same strategy the student dashboard uses).
 */
const fetchStudentRow = async (): Promise<StudentRow | null> => {
  const { data: userData, error: userError } =
    await supabase.auth.getUser();

  if (userError || !userData.user) {
    return null;
  }

  const user = userData.user;

  // 1. Preferred lookup - the linked auth account.
  const { data: byId } = await supabase
    .from("students")
    .select(STUDENT_COLUMNS)
    .eq("auth_user_id", user.id)
    .maybeSingle();

  if (byId) {
    return byId as StudentRow;
  }

  // 2. Fallback - records linked by email only.
  if (!user.email) {
    return null;
  }

  const { data: byEmail } = await supabase
    .from("students")
    .select(STUDENT_COLUMNS)
    .ilike("email", user.email)
    .maybeSingle();

  return (byEmail as StudentRow) ?? null;
};

const toNumber = (value: unknown): number | null => {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const parsed = Number(value);

  return Number.isNaN(parsed) ? null : parsed;
};

// Map a student_profile view row (backfilled with the raw
// students row for legacy text columns) to the page model.
const profileFromView = (
  row: Record<string, unknown>,
  summary: Record<string, unknown> | null,
  student: StudentRow | null
): StudentProfileData => ({
  student_id: String(row.student_id ?? student?.id ?? ""),
  first_name: String(row.first_name ?? student?.first_name ?? ""),
  middle_name: (row.middle_name ?? student?.middle_name ?? null) as string | null,
  last_name: String(row.last_name ?? student?.last_name ?? ""),
  photo_url: (row.photo_url ?? student?.photo_url ?? null) as string | null,
  status: String(row.status ?? student?.status ?? "active"),
  email: (row.email ?? student?.email ?? null) as string | null,
  phone: (row.phone ?? student?.phone ?? null) as string | null,
  admission_number: String(
    row.admission_number ?? student?.admission_number ?? ""
  ),
  roll_number: (row.roll_number ?? student?.roll_number ?? null) as string | null,
  class_name: (row.class_name ?? student?.class_name ?? null) as string | null,
  section_name: (row.section_name ?? student?.section ?? null) as string | null,
  class_teacher_name: (row.class_teacher_name ??
    summary?.class_teacher_name ??
    null) as string | null,
  academic_year: (row.academic_year ??
    summary?.academic_year ??
    null) as string | null,
  admission_year: (row.admission_year ??
    student?.admission_year ??
    null) as number | null,
  admission_date: (row.admission_date ??
    student?.admission_date ??
    null) as string | null,
  gender: (row.gender ?? student?.gender ?? null) as string | null,
  date_of_birth: (row.date_of_birth ??
    student?.date_of_birth ??
    null) as string | null,
  blood_group: (row.blood_group ?? student?.blood_group ?? null) as string | null,
  category: (row.category ?? student?.category ?? null) as string | null,
  rte: Boolean(row.rte ?? student?.rte ?? false),
  address: (row.address ?? student?.address ?? null) as string | null,
  city: (row.city ?? student?.city ?? null) as string | null,
  state: (row.state ?? student?.state ?? null) as string | null,
  postal_code: (row.postal_code ?? student?.postal_code ?? null) as string | null,
  father_name: (row.father_name ?? student?.father_name ?? null) as string | null,
  mother_name: (row.mother_name ?? student?.mother_name ?? null) as string | null,
  guardian_name: (row.guardian_name ??
    student?.guardian_name ??
    null) as string | null,
  guardian_phone: (row.guardian_phone ??
    student?.guardian_phone ??
    null) as string | null,
  total_subjects: toNumber(summary?.total_subjects),
});

// The profile views are unavailable - build the profile from
// the raw students row instead.
const profileFromStudentRow = (
  student: StudentRow
): StudentProfileData => ({
  student_id: student.id,
  first_name: student.first_name,
  middle_name: student.middle_name,
  last_name: student.last_name,
  photo_url: student.photo_url,
  status: student.status,
  email: student.email,
  phone: student.phone,
  admission_number: student.admission_number,
  roll_number: student.roll_number,
  class_name: student.class_name,
  section_name: student.section,
  class_teacher_name: null,
  academic_year: null,
  admission_year: student.admission_year,
  admission_date: student.admission_date,
  gender: student.gender,
  date_of_birth: student.date_of_birth,
  blood_group: student.blood_group,
  category: student.category,
  rte: student.rte,
  address: student.address,
  city: student.city,
  state: student.state,
  postal_code: student.postal_code,
  father_name: student.father_name,
  mother_name: student.mother_name,
  guardian_name: student.guardian_name,
  guardian_phone: student.guardian_phone,
  total_subjects: null,
});


/**
 * Everything the My Profile page renders for the logged in
 * student, fetched in parallel.
 */
export const fetchStudentProfile =
  async (): Promise<StudentProfileData> => {
    const [profileResult, summaryResult, studentRow] =
      await Promise.all([
        supabase.from("student_profile").select("*").maybeSingle(),
        supabase.from("student_profile_summary").select("*").maybeSingle(),
        fetchStudentRow().catch(() => null),
      ]);

    const profileRow = profileResult.error
      ? null
      : (profileResult.data as Record<string, unknown> | null);

    const summaryRow = summaryResult.error
      ? null
      : (summaryResult.data as Record<string, unknown> | null);

    if (profileRow) {
      return profileFromView(profileRow, summaryRow, studentRow);
    }

    if (studentRow) {
      return profileFromStudentRow(studentRow);
    }

    throw new Error(
      "No student profile is linked to this account yet. Please contact the school office."
    );
  };

/**
 * Update the logged in student's profile through the
 * update_my_student_profile RPC. The RPC overwrites every
 * editable column, so unchanged fields are passed through
 * from the current profile.
 */
export const updateMyStudentProfile = async (
  profile: StudentProfileData,
  changes: Partial<ProfileEditInput> & { photo_url?: string } = {}
): Promise<void> => {
  const { error } = await supabase.rpc("update_my_student_profile", {
    p_first_name: changes.first_name ?? profile.first_name,
    p_middle_name: changes.middle_name !== undefined ? changes.middle_name : profile.middle_name,
    p_last_name: changes.last_name ?? profile.last_name,
    p_phone: changes.phone !== undefined ? changes.phone : profile.phone,
    p_gender: changes.gender !== undefined ? changes.gender : profile.gender,
    p_date_of_birth: changes.date_of_birth !== undefined ? changes.date_of_birth : profile.date_of_birth,
    p_blood_group: changes.blood_group !== undefined ? changes.blood_group : profile.blood_group,
    p_category: changes.category !== undefined ? changes.category : profile.category,
    p_address: changes.address !== undefined ? changes.address : profile.address,
    p_city: changes.city !== undefined ? changes.city : profile.city,
    p_state: changes.state !== undefined ? changes.state : profile.state,
    p_postal_code: changes.postal_code !== undefined ? changes.postal_code : profile.postal_code,
    p_father_name: changes.father_name !== undefined ? changes.father_name : profile.father_name,
    p_mother_name: changes.mother_name !== undefined ? changes.mother_name : profile.mother_name,
    p_guardian_name: changes.guardian_name !== undefined ? changes.guardian_name : profile.guardian_name,
    p_guardian_phone: changes.guardian_phone !== undefined ? changes.guardian_phone : profile.guardian_phone,
    p_photo_url: changes.photo_url !== undefined ? changes.photo_url : profile.photo_url,
  });

  if (error) {
    throw new Error(error.message);
  }
};

/**
 * Upload a new profile photo to the public student-photos
 * bucket and return its public URL.
 */
export const uploadStudentPhoto = async (
  studentId: string,
  file: File
): Promise<string> => {
  const extension =
    (file.name.split(".").pop() ?? "jpg").toLowerCase() || "jpg";

  const path = `${studentId}/photo-${Date.now()}.${extension}`;

  const { error } = await supabase.storage
    .from(PHOTO_BUCKET)
    .upload(path, file, {
      cacheControl: "3600",
      upsert: true,
      contentType: file.type || "image/jpeg",
    });

  if (error) {
    throw new Error(error.message);
  }

  const { data } = supabase.storage
    .from(PHOTO_BUCKET)
    .getPublicUrl(path);

  if (!data?.publicUrl) {
    throw new Error("Could not resolve the uploaded photo URL.");
  }

  return data.publicUrl;
};

/**
 * Change the password of the logged in auth account.
 */
export const changeStudentPassword = async (
  newPassword: string
): Promise<void> => {
  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) {
    throw new Error(error.message);
  }
};

/**
 * Documents the school has uploaded for this student.
 */
export const fetchStudentDocuments = async (
  studentId: string
): Promise<StudentDocument[]> => {
  const { data, error } = await supabase
    .from("student_documents")
    .select("id, document_type, document_name, file_url, created_at")
    .eq("student_id", studentId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as StudentDocument[];
};


