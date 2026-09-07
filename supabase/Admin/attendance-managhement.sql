-- ============================================================
-- SCHOOL MANAGEMENT SYSTEM
-- ATTENDANCE MANAGEMENT
-- ============================================================
--
-- File:
-- supabase/Admin/attendance-management.sql
--
-- PURPOSE:
-- 1. Student Attendance
-- 2. Staff / Teacher Attendance
-- 3. Attendance Reports
-- 4. Student Reports
-- 5. Teacher Reports
-- 6. Monthly Attendance
-- 7. Low Attendance Students
--
-- EXISTING TABLES USED:
--   public.students
--   public.teachers
--   public.school_classes
--   public.class_sections
--   public.subjects
--   public.staff_attendance
--
-- NEW TABLE:
--   public.student_attendance
--
-- NEW VIEWS:
--   public.student_attendance_report
--   public.student_attendance_summary
--   public.class_attendance_summary
--   public.teacher_attendance_report
--   public.teacher_attendance_summary
--   public.student_monthly_attendance
--   public.low_attendance_students
--
-- ============================================================


-- ============================================================
-- 1. STUDENT ATTENDANCE TABLE
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
-- 2. STUDENT ATTENDANCE SAFETY COLUMNS
--
-- These make the script safer if the table already exists.
-- ============================================================

alter table public.student_attendance
  add column if not exists teacher_id uuid;

alter table public.student_attendance
  add column if not exists class_id uuid;

alter table public.student_attendance
  add column if not exists section_id uuid;

alter table public.student_attendance
  add column if not exists subject_id uuid;

alter table public.student_attendance
  add column if not exists attendance_date date;

alter table public.student_attendance
  add column if not exists status text;

alter table public.student_attendance
  add column if not exists remarks text;

alter table public.student_attendance
  add column if not exists created_at timestamptz
  default now();

alter table public.student_attendance
  add column if not exists updated_at timestamptz
  default now();


-- ============================================================
-- 3. STAFF / TEACHER ATTENDANCE
--
-- IMPORTANT:
-- This table already exists in your project.
-- We DO NOT create another table.
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

  unique (teacher_id, date)
);


-- Add optional fields if your existing table doesn't have them.

alter table public.staff_attendance
  add column if not exists remarks text;

alter table public.staff_attendance
  add column if not exists updated_at timestamptz
  default now();


-- ============================================================
-- 4. STUDENT ATTENDANCE INDEXES
-- ============================================================

create index if not exists student_attendance_student_idx
on public.student_attendance(student_id);


create index if not exists student_attendance_teacher_idx
on public.student_attendance(teacher_id);


create index if not exists student_attendance_class_idx
on public.student_attendance(class_id);


create index if not exists student_attendance_section_idx
on public.student_attendance(section_id);


create index if not exists student_attendance_subject_idx
on public.student_attendance(subject_id);


create index if not exists student_attendance_date_idx
on public.student_attendance(attendance_date);


create index if not exists student_attendance_class_date_idx
on public.student_attendance(
  class_id,
  section_id,
  attendance_date
);


create index if not exists student_attendance_student_date_idx
on public.student_attendance(
  student_id,
  attendance_date
);


-- ============================================================
-- 5. STAFF ATTENDANCE INDEXES
-- ============================================================

create index if not exists staff_attendance_teacher_idx
on public.staff_attendance(teacher_id);


create index if not exists staff_attendance_date_idx
on public.staff_attendance(date);


create index if not exists staff_attendance_teacher_date_idx
on public.staff_attendance(
  teacher_id,
  date
);


-- ============================================================
-- 6. PREVENT DUPLICATE STUDENT ATTENDANCE
--
-- One student:
--   one date
--   one subject
--
-- If subject_id is NULL, it represents general/daily attendance.
-- ============================================================

create unique index if not exists
student_attendance_student_date_subject_idx
on public.student_attendance (
  student_id,
  attendance_date,
  coalesce(
    subject_id,
    '00000000-0000-0000-0000-000000000000'::uuid
  )
);


-- ============================================================
-- 7. UPDATED_AT FUNCTION
-- ============================================================

create or replace function public.set_attendance_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;


-- ============================================================
-- 8. STUDENT ATTENDANCE UPDATED_AT TRIGGER
-- ============================================================

drop trigger if exists
student_attendance_updated_at
on public.student_attendance;


create trigger student_attendance_updated_at
before update
on public.student_attendance
for each row
execute function public.set_attendance_updated_at();


-- ============================================================
-- 9. STAFF ATTENDANCE UPDATED_AT TRIGGER
-- ============================================================

drop trigger if exists
staff_attendance_updated_at
on public.staff_attendance;


create trigger staff_attendance_updated_at
before update
on public.staff_attendance
for each row
execute function public.set_attendance_updated_at();


-- ============================================================
-- 10. STUDENT ATTENDANCE RLS
-- ============================================================

alter table public.student_attendance
enable row level security;


-- Remove previous policies if they exist.

drop policy if exists
"student_attendance_select_demo"
on public.student_attendance;


drop policy if exists
"student_attendance_insert_demo"
on public.student_attendance;


drop policy if exists
"student_attendance_update_demo"
on public.student_attendance;


drop policy if exists
"student_attendance_delete_demo"
on public.student_attendance;


-- Development policies.
--
-- NOTE:
-- These are open for development/testing.
-- Replace them with role-based policies before production.

create policy
"student_attendance_select_demo"
on public.student_attendance
for select
using (true);


create policy
"student_attendance_insert_demo"
on public.student_attendance
for insert
with check (true);


create policy
"student_attendance_update_demo"
on public.student_attendance
for update
using (true)
with check (true);


create policy
"student_attendance_delete_demo"
on public.student_attendance
for delete
using (true);


-- ============================================================
-- 11. STAFF ATTENDANCE RLS
-- ============================================================

alter table public.staff_attendance
enable row level security;


drop policy if exists
"staff_attendance_select_demo"
on public.staff_attendance;


drop policy if exists
"staff_attendance_insert_demo"
on public.staff_attendance;


drop policy if exists
"staff_attendance_update_demo"
on public.staff_attendance;


drop policy if exists
"staff_attendance_delete_demo"
on public.staff_attendance;


create policy
"staff_attendance_select_demo"
on public.staff_attendance
for select
using (true);


create policy
"staff_attendance_insert_demo"
on public.staff_attendance
for insert
with check (true);


create policy
"staff_attendance_update_demo"
on public.staff_attendance
for update
using (true)
with check (true);


create policy
"staff_attendance_delete_demo"
on public.staff_attendance
for delete
using (true);


-- ============================================================
-- 12. TABLE GRANTS
-- ============================================================

grant select, insert, update, delete
on public.student_attendance
to anon, authenticated;


grant select, insert, update, delete
on public.staff_attendance
to anon, authenticated;


-- ============================================================
-- 13. STUDENT ATTENDANCE REPORT
--
-- Used for:
--
-- Admin
--   Attendance
--     Reports
--       Student Report
--
-- Contains complete daily attendance information.
-- ============================================================

create or replace view public.student_attendance_report
with (security_invoker = true)
as
select

  sa.id,

  -- Student
  sa.student_id,

  s.admission_number,

  s.roll_number,

  trim(
    concat(
      s.first_name,
      ' ',
      coalesce(s.middle_name || ' ', ''),
      s.last_name
    )
  ) as student_name,

  -- Class
  sa.class_id,

  c.class_name,

  -- Section
  sa.section_id,

  cs.section_name,

  -- Subject
  sa.subject_id,

  sub.subject_name,

  -- Teacher
  sa.teacher_id,

  case
    when t.id is not null then
      trim(
        concat(
          t.first_name,
          ' ',
          t.last_name
        )
      )
    else null
  end as teacher_name,

  -- Attendance
  sa.attendance_date,

  sa.status,

  sa.remarks,

  sa.created_at,

  sa.updated_at

from public.student_attendance sa

join public.students s
  on s.id = sa.student_id

join public.school_classes c
  on c.id = sa.class_id

join public.class_sections cs
  on cs.id = sa.section_id

left join public.subjects sub
  on sub.id = sa.subject_id

left join public.teachers t
  on t.id = sa.teacher_id;


-- ============================================================
-- 14. STUDENT ATTENDANCE SUMMARY
--
-- Used for:
-- Specific Student Report
--
-- Gives:
-- Total
-- Present
-- Absent
-- Late
-- Leave
-- Attendance %
-- ============================================================

create or replace view public.student_attendance_summary
with (security_invoker = true)
as
select

  sa.student_id,

  s.admission_number,

  s.roll_number,

  trim(
    concat(
      s.first_name,
      ' ',
      coalesce(s.middle_name || ' ', ''),
      s.last_name
    )
  ) as student_name,

  sa.class_id,

  c.class_name,

  sa.section_id,

  cs.section_name,

  count(*) as total_days,

  count(*) filter (
    where sa.status = 'present'
  ) as present_days,

  count(*) filter (
    where sa.status = 'absent'
  ) as absent_days,

  count(*) filter (
    where sa.status = 'late'
  ) as late_days,

  count(*) filter (
    where sa.status = 'leave'
  ) as leave_days,

  round(
    (
      count(*) filter (
        where sa.status in ('present', 'late')
      )::numeric
      /
      nullif(count(*), 0)
    ) * 100,
    2
  ) as attendance_percentage

from public.student_attendance sa

join public.students s
  on s.id = sa.student_id

join public.school_classes c
  on c.id = sa.class_id

join public.class_sections cs
  on cs.id = sa.section_id

group by

  sa.student_id,

  s.admission_number,

  s.roll_number,

  s.first_name,

  s.middle_name,

  s.last_name,

  sa.class_id,

  c.class_name,

  sa.section_id,

  cs.section_name;


-- ============================================================
-- 15. CLASS / SECTION ATTENDANCE SUMMARY
--
-- Used for:
-- Admin -> Attendance -> Reports -> Overall Report
--
-- Can be filtered from React by:
-- class_id
-- section_id
-- subject_id
-- date range
-- ============================================================

create or replace view public.class_attendance_summary
with (security_invoker = true)
as
select

  sa.class_id,

  c.class_name,

  sa.section_id,

  cs.section_name,

  sa.subject_id,

  sub.subject_name,

  count(*) as total_records,

  count(distinct sa.student_id) as total_students,

  count(*) filter (
    where sa.status = 'present'
  ) as present_records,

  count(*) filter (
    where sa.status = 'absent'
  ) as absent_records,

  count(*) filter (
    where sa.status = 'late'
  ) as late_records,

  count(*) filter (
    where sa.status = 'leave'
  ) as leave_records,

  round(
    (
      count(*) filter (
        where sa.status in ('present', 'late')
      )::numeric
      /
      nullif(count(*), 0)
    ) * 100,
    2
  ) as attendance_percentage,

  min(sa.attendance_date)
    as first_attendance_date,

  max(sa.attendance_date)
    as last_attendance_date

from public.student_attendance sa

join public.school_classes c
  on c.id = sa.class_id

join public.class_sections cs
  on cs.id = sa.section_id

left join public.subjects sub
  on sub.id = sa.subject_id

group by

  sa.class_id,

  c.class_name,

  sa.section_id,

  cs.section_name,

  sa.subject_id,

  sub.subject_name;


-- ============================================================
-- 16. TEACHER ATTENDANCE REPORT
--
-- Used for:
-- Admin -> Attendance -> Reports -> Teacher Report
--
-- Uses EXISTING staff_attendance table.
-- ============================================================

create or replace view public.teacher_attendance_report
with (security_invoker = true)
as
select

  sa.id,

  sa.teacher_id,

  trim(
    concat(
      t.first_name,
      ' ',
      t.last_name
    )
  ) as teacher_name,

  t.email,

  t.phone,

  t.subject as primary_subject,

  t.qualification,

  t.join_date,

  sa.date as attendance_date,

  sa.status,

  sa.remarks,

  sa.created_at,

  sa.updated_at

from public.staff_attendance sa

join public.teachers t
  on t.id = sa.teacher_id;


-- ============================================================
-- 17. TEACHER ATTENDANCE SUMMARY
--
-- Gives:
-- Total
-- Present
-- Absent
-- Late
-- Leave
-- Attendance %
-- ============================================================

create or replace view public.teacher_attendance_summary
with (security_invoker = true)
as
select

  sa.teacher_id,

  trim(
    concat(
      t.first_name,
      ' ',
      t.last_name
    )
  ) as teacher_name,

  t.email,

  count(*) as total_days,

  count(*) filter (
    where sa.status = 'present'
  ) as present_days,

  count(*) filter (
    where sa.status = 'absent'
  ) as absent_days,

  count(*) filter (
    where sa.status = 'late'
  ) as late_days,

  count(*) filter (
    where sa.status = 'leave'
  ) as leave_days,

  round(
    (
      count(*) filter (
        where sa.status in ('present', 'late')
      )::numeric
      /
      nullif(count(*), 0)
    ) * 100,
    2
  ) as attendance_percentage

from public.staff_attendance sa

join public.teachers t
  on t.id = sa.teacher_id

group by

  sa.teacher_id,

  t.first_name,

  t.last_name,

  t.email;


-- ============================================================
-- 18. MONTHLY STUDENT ATTENDANCE
--
-- Used for:
-- Student report monthly chart
-- ============================================================

create or replace view public.student_monthly_attendance
with (security_invoker = true)
as
select

  sa.student_id,

  trim(
    concat(
      s.first_name,
      ' ',
      coalesce(s.middle_name || ' ', ''),
      s.last_name
    )
  ) as student_name,

  sa.class_id,

  c.class_name,

  sa.section_id,

  cs.section_name,

  date_trunc(
    'month',
    sa.attendance_date
  )::date as month,

  count(*) as total_days,

  count(*) filter (
    where sa.status = 'present'
  ) as present_days,

  count(*) filter (
    where sa.status = 'absent'
  ) as absent_days,

  count(*) filter (
    where sa.status = 'late'
  ) as late_days,

  count(*) filter (
    where sa.status = 'leave'
  ) as leave_days,

  round(
    (
      count(*) filter (
        where sa.status in ('present', 'late')
      )::numeric
      /
      nullif(count(*), 0)
    ) * 100,
    2
  ) as attendance_percentage

from public.student_attendance sa

join public.students s
  on s.id = sa.student_id

join public.school_classes c
  on c.id = sa.class_id

join public.class_sections cs
  on cs.id = sa.section_id

group by

  sa.student_id,

  s.first_name,

  s.middle_name,

  s.last_name,

  sa.class_id,

  c.class_name,

  sa.section_id,

  cs.section_name,

  date_trunc(
    'month',
    sa.attendance_date
  );


-- ============================================================
-- 19. LOW ATTENDANCE STUDENTS
--
-- Default threshold:
-- Below 75%
-- ============================================================

create or replace view public.low_attendance_students
with (security_invoker = true)
as
select *

from public.student_attendance_summary

where attendance_percentage < 75;


-- ============================================================
-- 20. REPORT VIEW GRANTS
-- ============================================================

grant select
on public.student_attendance_report
to anon, authenticated;


grant select
on public.student_attendance_summary
to anon, authenticated;


grant select
on public.class_attendance_summary
to anon, authenticated;


grant select
on public.teacher_attendance_report
to anon, authenticated;


grant select
on public.teacher_attendance_summary
to anon, authenticated;


grant select
on public.student_monthly_attendance
to anon, authenticated;


grant select
on public.low_attendance_students
to anon, authenticated;


-- ============================================================
-- 21. SCHEMA CACHE RELOAD
-- ============================================================

notify pgrst, 'reload schema';


-- ============================================================
-- END OF ATTENDANCE MANAGEMENT
-- ============================================================