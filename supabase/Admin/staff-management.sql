-- ============================================================
-- STAFF MANAGEMENT
-- EduManage - School & College Management System
--
-- Includes:
--   1. Teachers
--   2. Teacher Assignments
--   3. Staff Attendance
--   4. Teacher <-> Supabase Auth relationship
-- ============================================================


-- ============================================================
-- 1. TEACHERS
-- ============================================================

create table if not exists public.teachers (

  id uuid primary key default gen_random_uuid(),

  -- Supabase Auth user
  auth_user_id uuid
    references auth.users(id)
    on delete set null,

  first_name text not null,

  last_name text not null,

  email text unique not null,

  phone text,

  subject text not null,

  qualification text,

  join_date date,

  status text not null default 'active'
    check (
      status in (
        'active',
        'inactive'
      )
    ),

  created_at timestamptz not null default now(),

  updated_at timestamptz not null default now()
);


-- ============================================================
-- TEACHER AUTH INDEX
-- One Auth account can belong to only one teacher.
-- ============================================================

create unique index if not exists teachers_auth_user_id_idx
on public.teachers(auth_user_id);


-- ============================================================
-- 2. TEACHER ASSIGNMENTS
-- Teacher -> Class -> Section -> Subject
-- ============================================================

create table if not exists public.teacher_assignments (

  id uuid primary key default gen_random_uuid(),

  teacher_id uuid not null
    references public.teachers(id)
    on delete cascade,

  class_name text not null,

  section text not null,

  subject text not null,

  academic_year text,

  status text not null default 'active'
    check (
      status in (
        'active',
        'inactive'
      )
    ),

  created_at timestamptz not null default now(),

  updated_at timestamptz not null default now(),

  unique (
    teacher_id,
    class_name,
    section,
    subject,
    academic_year
  )
);


-- ============================================================
-- 3. STAFF ATTENDANCE
-- ============================================================

create table if not exists public.staff_attendance (

  id uuid primary key default gen_random_uuid(),

  teacher_id uuid not null
    references public.teachers(id)
    on delete cascade,

  date date not null,

  status text not null default 'present'
    check (
      status in (
        'present',
        'absent',
        'late',
        'leave'
      )
    ),

  created_at timestamptz not null default now(),

  unique (
    teacher_id,
    date
  )
);


-- ============================================================
-- INDEXES
-- ============================================================

create index if not exists teachers_email_idx
on public.teachers(email);

create index if not exists teachers_status_idx
on public.teachers(status);

create index if not exists teacher_assignments_teacher_idx
on public.teacher_assignments(teacher_id);

create index if not exists teacher_assignments_class_idx
on public.teacher_assignments(class_name);

create index if not exists teacher_assignments_section_idx
on public.teacher_assignments(section);

create index if not exists teacher_assignments_subject_idx
on public.teacher_assignments(subject);

create index if not exists staff_attendance_teacher_idx
on public.staff_attendance(teacher_id);

create index if not exists staff_attendance_date_idx
on public.staff_attendance(date);


-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table public.teachers enable row level security;

alter table public.teacher_assignments enable row level security;

alter table public.staff_attendance enable row level security;


-- ============================================================
-- REMOVE OLD POLICIES
-- Makes this file safe to re-run.
-- ============================================================

drop policy if exists "teachers_select"
on public.teachers;

drop policy if exists "teachers_insert"
on public.teachers;

drop policy if exists "teachers_update"
on public.teachers;

drop policy if exists "teachers_delete"
on public.teachers;


drop policy if exists "assignments_select"
on public.teacher_assignments;

drop policy if exists "assignments_insert"
on public.teacher_assignments;

drop policy if exists "assignments_update"
on public.teacher_assignments;

drop policy if exists "assignments_delete"
on public.teacher_assignments;


drop policy if exists "attendance_select"
on public.staff_attendance;

drop policy if exists "attendance_insert"
on public.staff_attendance;

drop policy if exists "attendance_update"
on public.staff_attendance;

drop policy if exists "attendance_delete"
on public.staff_attendance;


-- ============================================================
-- TEACHERS POLICIES
-- DEMO / DEVELOPMENT
-- ============================================================

create policy "teachers_select"
on public.teachers
for select
to anon, authenticated
using (true);


create policy "teachers_insert"
on public.teachers
for insert
to anon, authenticated
with check (true);


create policy "teachers_update"
on public.teachers
for update
to anon, authenticated
using (true)
with check (true);


create policy "teachers_delete"
on public.teachers
for delete
to anon, authenticated
using (true);


-- ============================================================
-- ASSIGNMENT POLICIES
-- DEMO / DEVELOPMENT
-- ============================================================

create policy "assignments_select"
on public.teacher_assignments
for select
to anon, authenticated
using (true);


create policy "assignments_insert"
on public.teacher_assignments
for insert
to anon, authenticated
with check (true);


create policy "assignments_update"
on public.teacher_assignments
for update
to anon, authenticated
using (true)
with check (true);


create policy "assignments_delete"
on public.teacher_assignments
for delete
to anon, authenticated
using (true);


-- ============================================================
-- STAFF ATTENDANCE POLICIES
-- DEMO / DEVELOPMENT
-- ============================================================

create policy "attendance_select"
on public.staff_attendance
for select
to anon, authenticated
using (true);


create policy "attendance_insert"
on public.staff_attendance
for insert
to anon, authenticated
with check (true);


create policy "attendance_update"
on public.staff_attendance
for update
to anon, authenticated
using (true)
with check (true);


create policy "attendance_delete"
on public.staff_attendance
for delete
to anon, authenticated
using (true);


-- ============================================================
-- DATA API PERMISSIONS
-- ============================================================

grant usage on schema public
to anon, authenticated;


grant select, insert, update, delete
on public.teachers
to anon, authenticated;


grant select, insert, update, delete
on public.teacher_assignments
to anon, authenticated;


grant select, insert, update, delete
on public.staff_attendance
to anon, authenticated;


-- ============================================================
-- RELOAD SUPABASE API SCHEMA
-- ============================================================

notify pgrst, 'reload schema';
-- ============================================================
-- MIGRATE EXISTING TEACHER ASSIGNMENTS
-- ============================================================

update public.teacher_assignments ta
set class_id = c.id
from public.school_classes c
where ta.class_id is null
  and ta.class_name = c.class_name;


update public.teacher_assignments ta
set section_id = cs.id
from public.class_sections cs
where ta.section_id is null
  and ta.class_id = cs.class_id
  and ta.section = cs.section_name;


update public.teacher_assignments ta
set subject_id = s.id
from public.subjects s
where ta.subject_id is null
  and lower(ta.subject) = lower(s.subject_name);