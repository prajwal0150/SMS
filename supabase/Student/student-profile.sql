-- ============================================================
-- STUDENT PROFILE MANAGEMENT
-- EduManage - School & College Management System
--
-- Uses existing public.students table.
--
-- Authentication:
--   auth.users.id
--        ↓
--   students.auth_user_id
--
-- The student's password is NEVER stored in students.
-- Password authentication is handled by Supabase Auth.
-- ============================================================


-- ============================================================
-- 1. MAKE SURE STUDENTS CAN BE LINKED TO SUPABASE AUTH
-- ============================================================

alter table public.students
add column if not exists auth_user_id uuid
references auth.users(id)
on delete set null;


-- One Supabase Auth account can belong to only one student.
create unique index if not exists
students_auth_user_id_unique_idx
on public.students(auth_user_id)
where auth_user_id is not null;


-- ============================================================
-- 2. PROFILE UPDATE TIMESTAMP
-- ============================================================

create or replace function public.set_student_profile_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;


drop trigger if exists
students_profile_updated_at
on public.students;


create trigger students_profile_updated_at
before update on public.students
for each row
execute function public.set_student_profile_updated_at();


-- ============================================================
-- 3. STUDENT PROFILE VIEW
-- ============================================================
--
-- Returns the currently logged-in student's profile.
--
-- React can simply call:
--
-- supabase
--   .from("student_profile")
--   .select("*")
--   .single()
--
-- ============================================================

create or replace view public.student_profile
with (security_invoker = true)
as
select

  -- ==========================================================
  -- BASIC IDENTIFICATION
  -- ==========================================================

  s.id as student_id,

  s.auth_user_id,

  s.first_name,
  s.middle_name,
  s.last_name,

  concat_ws(
    ' ',
    s.first_name,
    s.middle_name,
    s.last_name
  ) as full_name,

  s.photo_url,

  s.status,


  -- ==========================================================
  -- CONTACT
  -- ==========================================================

  s.email,
  s.phone,


  -- ==========================================================
  -- ACADEMIC
  -- ==========================================================

  s.admission_number,
  s.roll_number,

  s.class_id,
  sc.class_name,
  sc.class_code,

  s.section_id,
  cs.section_name,

  sc.academic_year,

  cs.class_teacher_id,

  case
    when teacher.id is not null then
      concat_ws(
        ' ',
        teacher.first_name,
        teacher.last_name
      )
    else null
  end as class_teacher_name,


  -- ==========================================================
  -- ADMISSION
  -- ==========================================================

  s.admission_year,
  s.admission_date,


  -- ==========================================================
  -- PERSONAL INFORMATION
  -- ==========================================================

  s.gender,
  s.date_of_birth,
  s.blood_group,
  s.category,
  s.rte,


  -- ==========================================================
  -- ADDRESS
  -- ==========================================================

  s.address,
  s.city,
  s.state,
  s.postal_code,


  -- ==========================================================
  -- FAMILY
  -- ==========================================================

  s.father_name,
  s.mother_name,
  s.guardian_name,
  s.guardian_phone,


  -- ==========================================================
  -- TIMESTAMPS
  -- ==========================================================

  s.created_at,
  s.updated_at

from public.students s

left join public.school_classes sc
  on sc.id = s.class_id

left join public.class_sections cs
  on cs.id = s.section_id

left join public.teachers teacher
  on teacher.id = cs.class_teacher_id

where s.auth_user_id = auth.uid();


-- ============================================================
-- 4. PROFILE SUMMARY
-- ============================================================
--
-- Useful for the top cards shown in your UI:
--
-- Class
-- Roll Number
-- Total Subjects
-- Academic Year
--
-- ============================================================

create or replace view public.student_profile_summary
with (security_invoker = true)
as
select

  s.id as student_id,

  concat_ws(
    ' ',
    s.first_name,
    s.middle_name,
    s.last_name
  ) as student_name,

  s.photo_url,

  s.admission_number,
  s.roll_number,

  sc.class_name,
  sc.class_code,

  cs.section_name,

  sc.academic_year,


  -- Total active subjects
  (
    select count(*)

    from public.class_subjects class_subject

    join public.subjects subject
      on subject.id = class_subject.subject_id

    where class_subject.class_id = s.class_id

      and class_subject.status = 'active'

      and subject.status = 'active'

  )::bigint as total_subjects,


  -- Class teacher
  case
    when teacher.id is not null then
      concat_ws(
        ' ',
        teacher.first_name,
        teacher.last_name
      )
    else null
  end as class_teacher_name,


  s.status,

  s.created_at,
  s.updated_at

from public.students s

left join public.school_classes sc
  on sc.id = s.class_id

left join public.class_sections cs
  on cs.id = s.section_id

left join public.teachers teacher
  on teacher.id = cs.class_teacher_id

where s.auth_user_id = auth.uid();


-- ============================================================
-- 5. PROFILE SUBJECTS
-- ============================================================

create or replace view public.student_profile_subjects
with (security_invoker = true)
as
select

  s.id as student_id,

  subject.id as subject_id,

  subject.subject_name,
  subject.subject_code,

  subject.subject_type,

  class_subject.is_compulsory,

  class_subject.weekly_periods

from public.students s

join public.class_subjects class_subject
  on class_subject.class_id = s.class_id

join public.subjects subject
  on subject.id = class_subject.subject_id

where s.auth_user_id = auth.uid()

  and class_subject.status = 'active'

  and subject.status = 'active'

order by
  subject.subject_name;


-- ============================================================
-- 6. FAMILY INFORMATION VIEW
-- ============================================================

create or replace view public.student_profile_family
with (security_invoker = true)
as
select

  s.id as student_id,

  s.father_name,
  s.mother_name,
  s.guardian_name,
  s.guardian_phone

from public.students s

where s.auth_user_id = auth.uid();


-- ============================================================
-- 7. ACADEMIC INFORMATION VIEW
-- ============================================================

create or replace view public.student_profile_academic
with (security_invoker = true)
as
select

  s.id as student_id,

  s.admission_number,
  s.roll_number,

  s.admission_year,
  s.admission_date,

  sc.id as class_id,
  sc.class_name,
  sc.class_code,

  cs.id as section_id,
  cs.section_name,

  sc.academic_year,

  case
    when teacher.id is not null then
      concat_ws(
        ' ',
        teacher.first_name,
        teacher.last_name
      )
    else null
  end as class_teacher_name

from public.students s

left join public.school_classes sc
  on sc.id = s.class_id

left join public.class_sections cs
  on cs.id = s.section_id

left join public.teachers teacher
  on teacher.id = cs.class_teacher_id

where s.auth_user_id = auth.uid();


-- ============================================================
-- 8. STUDENT PROFILE UPDATE FUNCTION
-- ============================================================
--
-- This allows the student to update ONLY fields that should
-- normally be editable from the Student Portal.
--
-- The student CANNOT change:
--
--   admission_number
--   roll_number
--   class_id
--   section_id
--   admission_year
--   admission_date
--   status
--   auth_user_id
--
-- Those are controlled by the school/admin.
--
-- ============================================================

create or replace function public.update_my_student_profile(
  p_first_name text default null,
  p_middle_name text default null,
  p_last_name text default null,
  p_phone text default null,
  p_gender text default null,
  p_date_of_birth date default null,
  p_blood_group text default null,
  p_category text default null,
  p_address text default null,
  p_city text default null,
  p_state text default null,
  p_postal_code text default null,
  p_father_name text default null,
  p_mother_name text default null,
  p_guardian_name text default null,
  p_guardian_phone text default null,
  p_photo_url text default null
)
returns public.students
language plpgsql
security invoker
as $$
declare
  updated_student public.students;
begin

  update public.students

  set
    first_name = coalesce(p_first_name, first_name),

    middle_name = p_middle_name,

    last_name = coalesce(p_last_name, last_name),

    phone = p_phone,

    gender = p_gender,

    date_of_birth = p_date_of_birth,

    blood_group = p_blood_group,

    category = p_category,

    address = p_address,

    city = p_city,

    state = p_state,

    postal_code = p_postal_code,

    father_name = p_father_name,

    mother_name = p_mother_name,

    guardian_name = p_guardian_name,

    guardian_phone = p_guardian_phone,

    photo_url = p_photo_url,

    updated_at = now()

  where auth_user_id = auth.uid()

  returning * into updated_student;


  if updated_student.id is null then

    raise exception
      'Student profile not found for authenticated user';

  end if;


  return updated_student;

end;
$$;


-- ============================================================
-- 9. ROW LEVEL SECURITY
-- ============================================================

alter table public.students
enable row level security;


-- Remove previous student self-service policies if they exist.

drop policy if exists
"students_profile_select_own"
on public.students;


drop policy if exists
"students_profile_update_own"
on public.students;


-- ============================================================
-- 10. STUDENT CAN VIEW OWN PROFILE
-- ============================================================

create policy
"students_profile_select_own"

on public.students

for select

to authenticated

using (
  auth_user_id = auth.uid()
);


-- ============================================================
-- 11. STUDENT CAN UPDATE OWN PROFILE
-- ============================================================
--
-- IMPORTANT:
-- This policy protects the row, but students could still
-- attempt to modify admin-controlled columns if direct UPDATE
-- permissions are granted.
--
-- Therefore the recommended frontend approach is to use:
--
--   update_my_student_profile()
--
-- rather than direct UPDATE on students.
--
-- ============================================================

create policy
"students_profile_update_own"

on public.students

for update

to authenticated

using (
  auth_user_id = auth.uid()
)

with check (
  auth_user_id = auth.uid()
);


-- ============================================================
-- 12. FUNCTION PERMISSION
-- ============================================================

grant execute
on function public.update_my_student_profile(
  text,
  text,
  text,
  text,
  text,
  date,
  text,
  text,
  text,
  text,
  text,
  text,
  text,
  text,
  text,
  text,
  text
)
to authenticated;


-- ============================================================
-- 13. VIEW PERMISSIONS
-- ============================================================

grant select
on public.student_profile
to authenticated;


grant select
on public.student_profile_summary
to authenticated;


grant select
on public.student_profile_subjects
to authenticated;


grant select
on public.student_profile_family
to authenticated;


grant select
on public.student_profile_academic
to authenticated;


-- ============================================================
-- 14. INDEXES
-- ============================================================

create index if not exists
students_profile_class_section_idx

on public.students(
  class_id,
  section_id
);


create index if not exists
students_profile_status_idx

on public.students(
  status
);


-- ============================================================
-- 15. SUPABASE API SCHEMA RELOAD
-- ============================================================

notify pgrst, 'reload schema';


-- ============================================================
-- END STUDENT PROFILE MANAGEMENT
-- ============================================================