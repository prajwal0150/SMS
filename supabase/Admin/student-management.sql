-- ============================================================
-- STUDENT MANAGEMENT
-- EduManage - School & College Management System
-- ============================================================


-- ============================================================
-- STUDENTS
-- ============================================================

create table if not exists public.students (
  id uuid primary key default gen_random_uuid(),

  -- Identity
  first_name text not null,
  middle_name text,
  last_name text not null,

  -- Contact
  email text,
  phone text,

  -- Student identification
  roll_number text,
  admission_number text unique not null,

  -- Academic
  class_name text not null,
  section text,
  admission_year integer not null,
  admission_date date,

  -- Personal
  gender text
    check (gender in ('male', 'female', 'other')),

  date_of_birth date,

  blood_group text
    check (
      blood_group in (
        'A+',
        'A-',
        'B+',
        'B-',
        'AB+',
        'AB-',
        'O+',
        'O-'
      )
    ),

  category text,

  -- Government / education information
  rte boolean not null default false,

  -- Address
  address text,
  city text,
  state text,
  postal_code text,

  -- Parent / Guardian
  father_name text,
  mother_name text,
  guardian_name text,
  guardian_phone text,

  -- Student photo
  photo_url text,

  -- Status
  status text not null default 'active'
    check (
      status in (
        'active',
        'inactive',
        'transferred',
        'graduated',
        'alumni'
      )
    ),

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);


-- ============================================================
-- STUDENT DOCUMENTS
-- ============================================================

create table if not exists public.student_documents (
  id uuid primary key default gen_random_uuid(),

  student_id uuid not null
    references public.students(id)
    on delete cascade,

  document_type text not null,

  document_name text not null,

  file_url text not null,

  created_at timestamptz not null default now()
);


-- ============================================================
-- STUDENT PROMOTIONS
-- ============================================================

create table if not exists public.student_promotions (
  id uuid primary key default gen_random_uuid(),

  student_id uuid not null
    references public.students(id)
    on delete cascade,

  from_class text not null,
  from_section text,

  to_class text not null,
  to_section text,

  academic_year text not null,

  promoted_at timestamptz not null default now(),

  notes text
);


-- ============================================================
-- INDEXES
-- ============================================================

create index if not exists students_first_name_idx
on public.students(first_name);

create index if not exists students_last_name_idx
on public.students(last_name);

create index if not exists students_roll_number_idx
on public.students(roll_number);

create index if not exists students_admission_number_idx
on public.students(admission_number);

create index if not exists students_class_idx
on public.students(class_name);

create index if not exists students_section_idx
on public.students(section);

create index if not exists students_gender_idx
on public.students(gender);

create index if not exists students_status_idx
on public.students(status);

create index if not exists students_admission_year_idx
on public.students(admission_year);


-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table public.students enable row level security;
alter table public.student_documents enable row level security;
alter table public.student_promotions enable row level security;


-- ============================================================
-- STUDENTS POLICIES
-- Demo policies
-- ============================================================

create policy "students_select_demo"
on public.students
for select
to anon, authenticated
using (true);

create policy "students_insert_demo"
on public.students
for insert
to anon, authenticated
with check (true);

create policy "students_update_demo"
on public.students
for update
to anon, authenticated
using (true)
with check (true);

create policy "students_delete_demo"
on public.students
for delete
to anon, authenticated
using (true);


-- ============================================================
-- DOCUMENT POLICIES
-- ============================================================

create policy "student_documents_select_demo"
on public.student_documents
for select
to anon, authenticated
using (true);

create policy "student_documents_insert_demo"
on public.student_documents
for insert
to anon, authenticated
with check (true);

create policy "student_documents_update_demo"
on public.student_documents
for update
to anon, authenticated
using (true)
with check (true);

create policy "student_documents_delete_demo"
on public.student_documents
for delete
to anon, authenticated
using (true);


-- ============================================================
-- PROMOTION POLICIES
-- ============================================================

create policy "student_promotions_select_demo"
on public.student_promotions
for select
to anon, authenticated
using (true);

create policy "student_promotions_insert_demo"
on public.student_promotions
for insert
to anon, authenticated
with check (true);

create policy "student_promotions_update_demo"
on public.student_promotions
for update
to anon, authenticated
using (true)
with check (true);

create policy "student_promotions_delete_demo"
on public.student_promotions
for delete
to anon, authenticated
using (true);


-- ============================================================
-- DATA API PERMISSIONS
-- ============================================================

grant usage on schema public
to anon, authenticated;

grant select, insert, update, delete
on public.students
to anon, authenticated;

grant select, insert, update, delete
on public.student_documents
to anon, authenticated;

grant select, insert, update, delete
on public.student_promotions
to anon, authenticated;

insert into storage.buckets (id, name, public)
values
  ('student-photos', 'student-photos', true),
  ('student-documents', 'student-documents', false)
on conflict (id) do nothing;
-- ============================================================
-- SEED DATA (optional, idempotent by admission_number)
-- ============================================================

insert into public.students
  (admission_number, roll_number, first_name, middle_name, last_name,
   email, phone, gender, date_of_birth, class_name, section,
   admission_year, admission_date, blood_group, category, rte,
   address, city, state, postal_code,
   father_name, mother_name, guardian_name, guardian_phone, status)
values
  ('ADM-2023-001', '01', 'Aarav',   '', 'Sharma', 'aarav.sharma@example.com',   '9876543210', 'male',   '2013-04-12', 'Class 8-A',  'A', 2023, '2023-04-01', 'B+',  'General',      false, '12 Gandhi Road',  'Mumbai',     'Maharashtra', '400001', 'Rajesh Sharma', 'Sunita Sharma', 'Rajesh Sharma', '9123456780', 'active'),
  ('ADM-2023-002', '02', 'Ananya',  '', 'Iyer',   'ananya.iyer@example.com',    '9876543211', 'female', '2013-07-23', 'Class 8-B',  'B', 2023, '2023-04-01', 'A+',  'General',      false, '45 Lake View',    'Pune',       'Maharashtra', '411001', 'Karthik Iyer',  'Priya Iyer',    'Priya Iyer',    '9123456781', 'active'),
  ('ADM-2023-003', '03', 'Rohan',   '', 'Verma',  'rohan.verma@example.com',    '9876543212', 'male',   '2013-01-30', 'Class 8-A',  'A', 2023, '2023-04-01', 'O+',  'OBC',          true,  '8 Nehru Nagar',   'Delhi',      'Delhi',       '110001', 'Sunil Verma',   'Kavita Verma',  'Sunil Verma',   '9123456782', 'active'),
  ('ADM-2023-004', '01', 'Meera',   '', 'Nair',   'meera.nair@example.com',     '9876543213', 'female', '2013-09-11', 'Class 9-A',  'A', 2022, '2022-04-01', 'AB+', 'General',      false, '77 Marine Drive', 'Kochi',      'Kerala',      '682001', 'Anil Nair',     'Rema Nair',     'Anil Nair',     '9123456783', 'active'),
  ('ADM-2023-005', '02', 'Kabir',   '', 'Mehta',  'kabir.mehta@example.com',    '9876543214', 'male',   '2012-11-05', 'Class 9-B',  'B', 2022, '2022-04-01', 'B-',  'General',      false, '21 MG Road',     'Ahmedabad',   'Gujarat',     '380001', 'Manish Mehta',  'Nita Mehta',    'Manish Mehta',  '9123456784', 'active'),
  ('ADM-2023-006', '03', 'Ishita',  '', 'Rao',    'ishita.rao@example.com',     '9876543215', 'female', '2012-05-19', 'Class 9-A',  'A', 2022, '2022-04-01', 'O-',  'General',      false, '56 Residency Road','Bengaluru', 'Karnataka',   '560001', 'Kiran Rao',     'Asha Rao',      'Kiran Rao',     '9123456785', 'active'),
  ('ADM-2023-007', '01', 'Arjun',   '', 'Singh',  'arjun.singh@example.com',    '9876543216', 'male',   '2012-08-02', 'Class 9-B',  'B', 2022, '2022-04-01', 'A-',  'SC',           false, '3 Green Park',    'Chandigarh',  'Chandigarh',  '160001', 'Harpreet Singh','Gurmeet Kaur', 'Harpreet Singh','9123456786', 'inactive'),
  ('ADM-2022-008', '02', 'Diya',    '', 'Patel',  'diya.patel@example.com',     '9876543217', 'female', '2011-03-27', 'Class 10-A', 'A', 2021, '2021-04-01', 'B+',  'General',      false, '14 Station Road', 'Surat',      'Gujarat',     '395001', 'Nilesh Patel',  'Rekha Patel',   'Nilesh Patel',  '9123456787', 'active'),
  ('ADM-2022-009', '03', 'Vivaan',  '', 'Gupta',  'vivaan.gupta@example.com',   '9876543218', 'male',   '2011-12-14', 'Class 10-B', 'B', 2021, '2021-04-01', 'AB-', 'General',      false, '92 Ashok Nagar',  'Jaipur',      'Rajasthan',   '302001', 'Rakesh Gupta',  'Manju Gupta',   'Rakesh Gupta',  '9123456788', 'active'),
  ('ADM-2022-010', '01', 'Sara',    '', 'Khan',   'sara.khan@example.com',      '9876543219', 'female', '2011-06-08', 'Class 10-A', 'A', 2021, '2021-04-01', 'O+',  'Minority',     false, '5 Zamrudpur',     'Lucknow',     'Uttar Pradesh','226001', 'Imran Khan',    'Farah Khan',    'Imran Khan',    '9123456789', 'transferred')
on conflict (admission_number) do nothing;


-- ============================================================
-- RELOAD SUPABASE API SCHEMA
-- ============================================================

notify pgrst, 'reload schema';
-- ============================================================
-- MIGRATE EXISTING STUDENTS
-- ============================================================

-- class_id: exact name match first, then combined formats
-- like "Class 9-A" where class and section were saved as a
-- single string. The newest academic year wins when a class
-- name exists in more than one year.
update public.students s
set class_id = c.id
from (
  select distinct on (class_name) id, class_name
  from public.school_classes
  order by class_name, academic_year desc
) c
where s.class_id is null
  and (
    s.class_name = c.class_name
    or s.class_name = c.class_name || '-' || coalesce(s.section, '')
    or s.class_name like c.class_name || '-%'
  );


update public.students s
set section_id = cs.id
from public.class_sections cs
join public.school_classes c
  on c.id = cs.class_id
where s.section_id is null
  and s.class_id = cs.class_id
  and s.section = cs.section_name;

  -- ============================================================
-- TEACHER PANEL / STUDENT ATTENDANCE
-- ============================================================

create table if not exists public.student_attendance (
  id uuid primary key default gen_random_uuid(),

  student_id uuid not null
    references public.students(id)
    on delete cascade,

  teacher_id uuid
    references public.teachers(id)
    on delete set null,

  class_id uuid not null
    references public.school_classes(id)
    on delete restrict,

  section_id uuid not null
    references public.class_sections(id)
    on delete restrict,

  subject_id uuid
    references public.subjects(id)
    on delete set null,

  attendance_date date not null,

  status text not null default 'present'
    check (
      status in (
        'present',
        'absent',
        'late',
        'leave'
      )
    ),

  remarks text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);


-- ============================================================
-- INDEXES
-- ============================================================

create index if not exists student_attendance_student_id_idx
on public.student_attendance(student_id);

create index if not exists student_attendance_teacher_id_idx
on public.student_attendance(teacher_id);

create index if not exists student_attendance_class_id_idx
on public.student_attendance(class_id);

create index if not exists student_attendance_section_id_idx
on public.student_attendance(section_id);

create index if not exists student_attendance_subject_id_idx
on public.student_attendance(subject_id);

create index if not exists student_attendance_date_idx
on public.student_attendance(attendance_date);


-- ============================================================
-- PREVENT DUPLICATE ATTENDANCE
--
-- One student can have:
-- one attendance record per day per subject.
--
-- If subject_id is NULL, it is treated as one daily attendance.
-- ============================================================

create unique index if not exists
student_attendance_student_date_subject_idx
on public.student_attendance (
  student_id,
  attendance_date,
  coalesce(subject_id, '00000000-0000-0000-0000-000000000000'::uuid)
);


-- ============================================================
-- RLS
-- ============================================================

alter table public.student_attendance enable row level security;


drop policy if exists "student_attendance_select"
on public.student_attendance;

drop policy if exists "student_attendance_insert"
on public.student_attendance;

drop policy if exists "student_attendance_update"
on public.student_attendance;

drop policy if exists "student_attendance_delete"
on public.student_attendance;


-- Development/demo policies
create policy "student_attendance_select"
on public.student_attendance
for select
to anon, authenticated
using (true);

create policy "student_attendance_insert"
on public.student_attendance
for insert
to anon, authenticated
with check (true);

create policy "student_attendance_update"
on public.student_attendance
for update
to anon, authenticated
using (true)
with check (true);

create policy "student_attendance_delete"
on public.student_attendance
for delete
to anon, authenticated
using (true);


grant select, insert, update, delete
on public.student_attendance
to anon, authenticated;


notify pgrst, 'reload schema';

-- ============================================================
-- STUDENT AUTHENTICATION
-- ============================================================

alter table public.students
add column if not exists auth_user_id uuid
references auth.users(id)
on delete set null;

create unique index if not exists students_auth_user_id_idx
on public.students(auth_user_id);

create unique index if not exists students_email_unique_idx
on public.students(lower(email))
where email is not null;

notify pgrst, 'reload schema';