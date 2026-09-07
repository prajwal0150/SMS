-- ============================================================
-- ACADEMIC MANAGEMENT
-- EduManage - School & College Management System
--
-- Includes:
--   1. Exams
--   2. Exam Schedules
--   3. Timetable
--   4. Holidays
--
-- Timetable is linked to teachers using teacher_id.
-- ============================================================


-- ============================================================
-- 1. EXAMS
-- ============================================================

create table if not exists public.exams (

  id uuid primary key default gen_random_uuid(),

  name text not null,

  description text,

  exam_type text not null default 'Term Exam'
    check (
      exam_type in (
        'Unit Test',
        'Term Exam',
        'Mid Term',
        'Half Yearly',
        'Annual',
        'Final',
        'Practical',
        'Other'
      )
    ),

  class_name text not null,

  section text,

  start_date date not null,

  end_date date,

  status text not null default 'upcoming'
    check (
      status in (
        'draft',
        'upcoming',
        'ongoing',
        'completed',
        'cancelled'
      )
    ),

  instructions text,

  created_by uuid
    references auth.users(id)
    on delete set null,

  created_at timestamptz not null default now(),

  updated_at timestamptz not null default now()
);


-- ============================================================
-- 2. EXAM SCHEDULES
-- ============================================================

create table if not exists public.exam_schedules (

  id uuid primary key default gen_random_uuid(),

  exam_id uuid not null
    references public.exams(id)
    on delete cascade,

  subject text not null,

  exam_date date not null,

  start_time time,

  end_time time,

  room text,

  max_marks numeric(6,2),

  passing_marks numeric(6,2),

  created_at timestamptz not null default now()
);


-- ============================================================
-- 3. TIMETABLE
-- ============================================================

create table if not exists public.timetable (

  id uuid primary key default gen_random_uuid(),

  -- Academic
  class_name text not null,

  section text,

  -- Day
  day_of_week text not null
    check (
      day_of_week in (
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday'
      )
    ),

  -- Period
  period_number integer not null,

  start_time time not null,

  end_time time not null,

  -- Subject
  subject text not null,

  -- Teacher relationship
  teacher_id uuid
    references public.teachers(id)
    on delete set null,

  -- Kept temporarily for existing/admin display data.
  -- New records should use teacher_id.
  teacher_name text,

  room text,

  academic_year text,

  created_at timestamptz not null default now(),

  updated_at timestamptz not null default now(),

  -- Prevent duplicate period for same class/day/year
  unique (
    class_name,
    section,
    day_of_week,
    period_number,
    academic_year
  )
);


-- ============================================================
-- 4. HOLIDAYS
-- ============================================================

create table if not exists public.holidays (

  id uuid primary key default gen_random_uuid(),

  name text not null,

  description text,

  start_date date not null,

  end_date date,

  occasion text,

  holiday_type text not null default 'Holiday'
    check (
      holiday_type in (
        'Holiday',
        'Vacation',
        'Festival',
        'National',
        'School Event',
        'Other'
      )
    ),

  applies_to text not null default 'Everyone'
    check (
      applies_to in (
        'Everyone',
        'Students',
        'Teachers',
        'Staff'
      )
    ),

  status text not null default 'upcoming'
    check (
      status in (
        'upcoming',
        'ongoing',
        'completed',
        'cancelled'
      )
    ),

  created_by uuid
    references auth.users(id)
    on delete set null,

  created_at timestamptz not null default now(),

  updated_at timestamptz not null default now()
);


-- ============================================================
-- INDEXES
-- ============================================================


-- Exams

create index if not exists exams_start_date_idx
on public.exams(start_date);

create index if not exists exams_class_idx
on public.exams(class_name);

create index if not exists exams_status_idx
on public.exams(status);

create index if not exists exams_type_idx
on public.exams(exam_type);


-- Exam schedules

create index if not exists exam_schedules_exam_id_idx
on public.exam_schedules(exam_id);

create index if not exists exam_schedules_date_idx
on public.exam_schedules(exam_date);


-- Timetable

create index if not exists timetable_class_idx
on public.timetable(class_name);

create index if not exists timetable_section_idx
on public.timetable(section);

create index if not exists timetable_day_idx
on public.timetable(day_of_week);

create index if not exists timetable_teacher_id_idx
on public.timetable(teacher_id);

create index if not exists timetable_academic_year_idx
on public.timetable(academic_year);


-- Holidays

create index if not exists holidays_start_date_idx
on public.holidays(start_date);

create index if not exists holidays_type_idx
on public.holidays(holiday_type);

create index if not exists holidays_status_idx
on public.holidays(status);


-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table public.exams enable row level security;

alter table public.exam_schedules enable row level security;

alter table public.timetable enable row level security;

alter table public.holidays enable row level security;


-- ============================================================
-- REMOVE EXISTING POLICIES
-- ============================================================


drop policy if exists "exams_select"
on public.exams;

drop policy if exists "exams_insert"
on public.exams;

drop policy if exists "exams_update"
on public.exams;

drop policy if exists "exams_delete"
on public.exams;


drop policy if exists "exam_schedules_select"
on public.exam_schedules;

drop policy if exists "exam_schedules_insert"
on public.exam_schedules;

drop policy if exists "exam_schedules_update"
on public.exam_schedules;

drop policy if exists "exam_schedules_delete"
on public.exam_schedules;


drop policy if exists "timetable_select"
on public.timetable;

drop policy if exists "timetable_insert"
on public.timetable;

drop policy if exists "timetable_update"
on public.timetable;

drop policy if exists "timetable_delete"
on public.timetable;


drop policy if exists "holidays_select"
on public.holidays;

drop policy if exists "holidays_insert"
on public.holidays;

drop policy if exists "holidays_update"
on public.holidays;

drop policy if exists "holidays_delete"
on public.holidays;


-- ============================================================
-- EXAMS POLICIES
-- DEMO / DEVELOPMENT
-- ============================================================

create policy "exams_select"
on public.exams
for select
to anon, authenticated
using (true);

create policy "exams_insert"
on public.exams
for insert
to anon, authenticated
with check (true);

create policy "exams_update"
on public.exams
for update
to anon, authenticated
using (true)
with check (true);

create policy "exams_delete"
on public.exams
for delete
to anon, authenticated
using (true);


-- ============================================================
-- EXAM SCHEDULE POLICIES
-- DEMO / DEVELOPMENT
-- ============================================================

create policy "exam_schedules_select"
on public.exam_schedules
for select
to anon, authenticated
using (true);

create policy "exam_schedules_insert"
on public.exam_schedules
for insert
to anon, authenticated
with check (true);

create policy "exam_schedules_update"
on public.exam_schedules
for update
to anon, authenticated
using (true)
with check (true);

create policy "exam_schedules_delete"
on public.exam_schedules
for delete
to anon, authenticated
using (true);


-- ============================================================
-- TIMETABLE POLICIES
-- DEMO / DEVELOPMENT
-- ============================================================

create policy "timetable_select"
on public.timetable
for select
to anon, authenticated
using (true);

create policy "timetable_insert"
on public.timetable
for insert
to anon, authenticated
with check (true);

create policy "timetable_update"
on public.timetable
for update
to anon, authenticated
using (true)
with check (true);

create policy "timetable_delete"
on public.timetable
for delete
to anon, authenticated
using (true);


-- ============================================================
-- HOLIDAYS POLICIES
-- DEMO / DEVELOPMENT
-- ============================================================

create policy "holidays_select"
on public.holidays
for select
to anon, authenticated
using (true);

create policy "holidays_insert"
on public.holidays
for insert
to anon, authenticated
with check (true);

create policy "holidays_update"
on public.holidays
for update
to anon, authenticated
using (true)
with check (true);

create policy "holidays_delete"
on public.holidays
for delete
to anon, authenticated
using (true);


-- ============================================================
-- DATA API PERMISSIONS
-- ============================================================

grant usage on schema public
to anon, authenticated;


grant select, insert, update, delete
on public.exams
to anon, authenticated;


grant select, insert, update, delete
on public.exam_schedules
to anon, authenticated;


grant select, insert, update, delete
on public.timetable
to anon, authenticated;


grant select, insert, update, delete
on public.holidays
to anon, authenticated;


-- ============================================================
-- SEED DATA
-- ============================================================


-- ============================================================
-- EXAMS
-- ============================================================

insert into public.exams
  (
    name,
    description,
    exam_type,
    class_name,
    section,
    start_date,
    end_date,
    status
  )
select
  v.name,
  v.description,
  v.exam_type,
  v.class_name,
  v.section,
  v.start_date::date,
  v.end_date::date,
  v.status
from (
  values
    (
      'First Term Examination',
      'Covers units 1-4 for all subjects.',
      'Term Exam',
      'Class 10',
      'A',
      '2026-09-15',
      '2026-09-20',
      'upcoming'
    ),
    (
      'Unit Test 2 - Mathematics',
      'Chapters 3 and 4.',
      'Unit Test',
      'Class 9',
      'B',
      '2026-09-08',
      '2026-09-09',
      'upcoming'
    ),
    (
      'Half Yearly Examination',
      'Scheduled for all sections of Class 8.',
      'Half Yearly',
      'Class 8',
      null,
      '2026-10-05',
      '2026-10-15',
      'draft'
    ),
    (
      'Science Practical Assessment',
      'Lab-based assessment.',
      'Practical',
      'Class 10',
      null,
      '2026-09-12',
      null,
      'ongoing'
    ),
    (
      'Annual Examination',
      'End of academic year examination.',
      'Annual',
      'Class 7',
      'A',
      '2027-03-10',
      '2027-03-20',
      'upcoming'
    )
) as v(
  name,
  description,
  exam_type,
  class_name,
  section,
  start_date,
  end_date,
  status
)
where not exists (
  select 1
  from public.exams e
  where e.name = v.name
);


-- ============================================================
-- TIMETABLE SEED DATA
-- ============================================================
--
-- NOTE:
-- teacher_id is intentionally NULL for these demo rows.
--
-- New timetable records created by Admin should always select
-- a real teacher and save teacher_id.
--
-- ============================================================

insert into public.timetable
  (
    class_name,
    section,
    day_of_week,
    period_number,
    start_time,
    end_time,
    subject,
    teacher_name,
    room
  )
values
  (
    'Class 10',
    'A',
    'Monday',
    1,
    '09:00',
    '09:45',
    'Mathematics',
    'Mr. Sharma',
    'Room 101'
  ),
  (
    'Class 10',
    'A',
    'Monday',
    2,
    '09:45',
    '10:30',
    'Science',
    'Mrs. Rao',
    'Room 101'
  ),
  (
    'Class 10',
    'A',
    'Tuesday',
    1,
    '09:00',
    '09:45',
    'English',
    'Ms. Fernandes',
    'Room 102'
  ),
  (
    'Class 9',
    'B',
    'Wednesday',
    2,
    '09:45',
    '10:30',
    'History',
    'Mr. Khan',
    'Room 203'
  ),
  (
    'Class 9',
    'B',
    'Thursday',
    3,
    '11:00',
    '11:45',
    'Geography',
    'Ms. Iyer',
    'Room 203'
  ),
  (
    'Class 8',
    'A',
    'Friday',
    1,
    '09:00',
    '09:45',
    'Mathematics',
    'Mr. Sharma',
    'Room 105'
  ),
  (
    'Class 8',
    'A',
    'Monday',
    3,
    '11:00',
    '11:45',
    'Computer Science',
    'Mr. Verma',
    'Lab 2'
  ),
  (
    'Class 7',
    'A',
    'Saturday',
    1,
    '09:00',
    '09:45',
    'Art',
    'Ms. D''Souza',
    'Art Room'
  ),
  (
    'Class 7',
    'A',
    'Wednesday',
    4,
    '12:00',
    '12:45',
    'Physical Education',
    'Coach Patel',
    'Ground'
  ),
  (
    'Class 6',
    'B',
    'Thursday',
    1,
    '09:00',
    '09:45',
    'Science',
    'Mrs. Rao',
    'Room 108'
  )
on conflict (
  class_name,
  section,
  day_of_week,
  period_number,
  academic_year
)
do nothing;


-- ============================================================
-- HOLIDAYS
-- ============================================================

insert into public.holidays
  (
    name,
    description,
    start_date,
    end_date,
    occasion,
    holiday_type,
    applies_to,
    status
  )
select
  v.name,
  v.description,
  v.start_date::date,
  v.end_date::date,
  v.occasion,
  v.holiday_type,
  v.applies_to,
  v.status
from (
  values
    (
      'Independence Day',
      'National holiday.',
      '2026-08-15',
      null,
      'Independence Day',
      'National',
      'Everyone',
      'upcoming'
    ),
    (
      'Teachers'' Day',
      'Celebration honoring teachers.',
      '2026-09-05',
      null,
      'Teachers Day',
      'School Event',
      'Teachers',
      'upcoming'
    ),
    (
      'Diwali Break',
      'School closed for Diwali.',
      '2026-11-08',
      '2026-11-12',
      'Diwali',
      'Vacation',
      'Everyone',
      'upcoming'
    ),
    (
      'Annual Sports Day',
      'Inter-house sports competitions.',
      '2026-12-18',
      null,
      'Sports Day',
      'School Event',
      'Everyone',
      'upcoming'
    ),
    (
      'Winter Break',
      'End of year vacation.',
      '2026-12-24',
      '2027-01-02',
      null,
      'Vacation',
      'Students',
      'upcoming'
    )
) as v(
  name,
  description,
  start_date,
  end_date,
  occasion,
  holiday_type,
  applies_to,
  status
)
where not exists (
  select 1
  from public.holidays h
  where h.name = v.name
);


-- ============================================================
-- RELOAD SUPABASE API SCHEMA
-- ============================================================

notify pgrst, 'reload schema';

-- ============================================
-- FIX EXISTING TIMETABLE TABLE
-- ============================================

-- Add teacher_id
alter table public.timetable
add column if not exists teacher_id uuid
references public.teachers(id)
on delete set null;

-- Add academic_year
alter table public.timetable
add column if not exists academic_year text;

-- Add created_by
alter table public.timetable
add column if not exists created_by uuid
references auth.users(id)
on delete set null;

-- Indexes
create index if not exists timetable_teacher_id_idx
on public.timetable(teacher_id);

create index if not exists timetable_academic_year_idx
on public.timetable(academic_year);

create index if not exists timetable_created_by_idx
on public.timetable(created_by);

-- Refresh Supabase API schema
notify pgrst, 'reload schema';

-- ============================================================
-- MIGRATE EXISTING TIMETABLE
-- ============================================================

update public.timetable t
set class_id = c.id
from public.school_classes c
where t.class_id is null
  and t.class_name = c.class_name;


update public.timetable t
set section_id = cs.id
from public.class_sections cs
where t.section_id is null
  and t.class_id = cs.class_id
  and t.section = cs.section_name;


update public.timetable t
set subject_id = s.id
from public.subjects s
where t.subject_id is null
  and lower(t.subject) = lower(s.subject_name);


notify pgrst, 'reload schema';

-- Notices
alter table public.notices
add column if not exists status text not null default 'published';

-- Announcements
alter table public.announcements
add column if not exists status text not null default 'published';

-- Events
alter table public.events
add column if not exists status text not null default 'published';

notify pgrst, 'reload schema';

-- ============================================
-- COMMUNICATION READ POLICIES
-- ============================================

alter table public.notices enable row level security;
alter table public.announcements enable row level security;
alter table public.events enable row level security;


drop policy if exists "teachers_can_view_published_notices"
on public.notices;

drop policy if exists "teachers_can_view_published_announcements"
on public.announcements;

drop policy if exists "teachers_can_view_published_events"
on public.events;


create policy "teachers_can_view_published_notices"
on public.notices
for select
to anon, authenticated
using (status = 'published');


create policy "teachers_can_view_published_announcements"
on public.announcements
for select
to anon, authenticated
using (status = 'published');


create policy "teachers_can_view_published_events"
on public.events
for select
to anon, authenticated
using (status = 'published');


grant select
on public.notices
to anon, authenticated;

grant select
on public.announcements
to anon, authenticated;

grant select
on public.events
to anon, authenticated;


notify pgrst, 'reload schema';