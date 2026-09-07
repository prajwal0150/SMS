-- ============================================================
-- SCHOOL MANAGEMENT SYSTEM
-- RESULT MANAGEMENT
-- ============================================================
--
-- File:
-- supabase/Admin/result-management.sql
--
-- PURPOSE:
-- 1. Store student examination results
-- 2. Store subject-wise marks
-- 3. Teacher marks entry
-- 4. Draft / submitted / reviewed / published workflow
-- 5. Automatic result calculations
-- 6. Grade configuration
-- 7. Student result reports
-- 8. Class result reports
--
-- EXISTING TABLES USED:
--   public.exams
--   public.exam_schedules
--   public.students
--   public.teachers
--   public.school_classes
--   public.class_sections
--   public.subjects
--
-- NEW TABLES:
--   public.results
--   public.result_marks
--   public.grade_scales
--
-- NEW VIEWS:
--   public.result_report
--   public.result_summary
--   public.class_result_summary
--
-- ============================================================


-- ============================================================
-- 1. GRADE SCALES
-- ============================================================
--
-- Admin can configure the grading system.
--
-- Example:
-- A+ = 90-100
-- A  = 80-89
-- B+ = 70-79
-- B  = 60-69
-- C  = 50-59
-- D  = 40-49
-- F  = 0-39
--
-- ============================================================

create table if not exists public.grade_scales (
  id uuid primary key default gen_random_uuid(),

  grade text not null,

  min_percentage numeric(5,2) not null
    check (min_percentage >= 0 and min_percentage <= 100),

  max_percentage numeric(5,2) not null
    check (max_percentage >= 0 and max_percentage <= 100),

  description text,

  status text not null default 'active'
    check (status in ('active', 'inactive')),

  created_at timestamptz not null default now(),

  updated_at timestamptz not null default now(),

  check (min_percentage <= max_percentage),

  unique (grade)
);


-- ============================================================
-- 2. DEFAULT GRADE SCALES
-- ============================================================

insert into public.grade_scales
  (grade, min_percentage, max_percentage, description)
values
  ('A+', 90, 100, 'Excellent'),
  ('A', 80, 89.99, 'Very Good'),
  ('B+', 70, 79.99, 'Good'),
  ('B', 60, 69.99, 'Above Average'),
  ('C', 50, 59.99, 'Average'),
  ('D', 40, 49.99, 'Pass'),
  ('F', 0, 39.99, 'Fail')
on conflict (grade) do nothing;


-- ============================================================
-- 3. RESULTS TABLE
-- ============================================================
--
-- One row represents one student's complete result
-- for one examination.
--
-- Example:
--
-- Rahul Kumar
-- Mid Term Examination
-- Class 8-A
--
-- Total Marks     = 414
-- Maximum Marks   = 500
-- Percentage      = 82.80
-- Grade           = A
-- Result          = PASS
--
-- ============================================================

create table if not exists public.results (
  id uuid primary key default gen_random_uuid(),

  student_id uuid not null
    references public.students(id)
    on delete cascade,

  exam_id uuid not null
    references public.exams(id)
    on delete cascade,

  class_id uuid not null
    references public.school_classes(id)
    on delete restrict,

  section_id uuid not null
    references public.class_sections(id)
    on delete restrict,

  academic_year text not null,

  total_marks numeric(10,2) not null default 0,

  obtained_marks numeric(10,2) not null default 0,

  percentage numeric(5,2) not null default 0,

  grade text,

  result_status text not null default 'pass'
    check (
      result_status in ('pass', 'fail', 'absent', 'incomplete')
    ),

  workflow_status text not null default 'draft'
    check (
      workflow_status in (
        'draft',
        'submitted',
        'reviewed',
        'published',
        'rejected'
      )
    ),

  submitted_by uuid
    references public.teachers(id)
    on delete set null,

  reviewed_by uuid
    references auth.users(id)
    on delete set null,

  reviewed_at timestamptz,

  published_by uuid
    references auth.users(id)
    on delete set null,

  published_at timestamptz,

  remarks text,

  created_at timestamptz not null default now(),

  updated_at timestamptz not null default now(),

  unique (
    student_id,
    exam_id,
    academic_year
  )
);


-- ============================================================
-- 4. RESULT MARKS
-- ============================================================
--
-- One row represents one subject mark.
--
-- Example:
--
-- Result: Rahul Kumar - Mid Term
-- Subject: Mathematics
-- Maximum: 100
-- Pass: 33
-- Obtained: 78
-- Grade: A
--
-- ============================================================

create table if not exists public.result_marks (
  id uuid primary key default gen_random_uuid(),

  result_id uuid not null
    references public.results(id)
    on delete cascade,

  subject_id uuid not null
    references public.subjects(id)
    on delete restrict,

  teacher_id uuid
    references public.teachers(id)
    on delete set null,

  maximum_marks numeric(10,2) not null default 100
    check (maximum_marks > 0),

  pass_marks numeric(10,2) not null default 33
    check (pass_marks >= 0),

  obtained_marks numeric(10,2),

  grade text,

  remarks text,

  created_at timestamptz not null default now(),

  updated_at timestamptz not null default now(),

  unique (
    result_id,
    subject_id
  ),

  check (
    pass_marks <= maximum_marks
  ),

  check (
    obtained_marks is null
    or (
      obtained_marks >= 0
      and obtained_marks <= maximum_marks
    )
  )
);


-- ============================================================
-- 5. SAFETY COLUMNS FOR EXISTING RESULTS TABLE
-- ============================================================

alter table public.results
  add column if not exists student_id uuid;

alter table public.results
  add column if not exists exam_id uuid;

alter table public.results
  add column if not exists class_id uuid;

alter table public.results
  add column if not exists section_id uuid;

alter table public.results
  add column if not exists academic_year text;

alter table public.results
  add column if not exists total_marks numeric(10,2)
  default 0;

alter table public.results
  add column if not exists obtained_marks numeric(10,2)
  default 0;

alter table public.results
  add column if not exists percentage numeric(5,2)
  default 0;

alter table public.results
  add column if not exists grade text;

alter table public.results
  add column if not exists result_status text
  default 'pass';

alter table public.results
  add column if not exists workflow_status text
  default 'draft';

alter table public.results
  add column if not exists submitted_by uuid;

alter table public.results
  add column if not exists reviewed_by uuid;

alter table public.results
  add column if not exists reviewed_at timestamptz;

alter table public.results
  add column if not exists published_by uuid;

alter table public.results
  add column if not exists published_at timestamptz;

alter table public.results
  add column if not exists remarks text;

alter table public.results
  add column if not exists created_at timestamptz
  default now();

alter table public.results
  add column if not exists updated_at timestamptz
  default now();


-- ============================================================
-- 6. SAFETY COLUMNS FOR RESULT MARKS
-- ============================================================

alter table public.result_marks
  add column if not exists teacher_id uuid;

alter table public.result_marks
  add column if not exists maximum_marks numeric(10,2)
  default 100;

alter table public.result_marks
  add column if not exists pass_marks numeric(10,2)
  default 33;

alter table public.result_marks
  add column if not exists obtained_marks numeric(10,2);

alter table public.result_marks
  add column if not exists grade text;

alter table public.result_marks
  add column if not exists remarks text;

alter table public.result_marks
  add column if not exists created_at timestamptz
  default now();

alter table public.result_marks
  add column if not exists updated_at timestamptz
  default now();


-- ============================================================
-- 7. GRADE SCALE SAFETY COLUMNS
-- ============================================================

alter table public.grade_scales
  add column if not exists description text;

alter table public.grade_scales
  add column if not exists status text
  default 'active';

alter table public.grade_scales
  add column if not exists updated_at timestamptz
  default now();


-- ============================================================
-- 8. RESULT INDEXES
-- ============================================================

create index if not exists results_student_idx
on public.results(student_id);


create index if not exists results_exam_idx
on public.results(exam_id);


create index if not exists results_class_idx
on public.results(class_id);


create index if not exists results_section_idx
on public.results(section_id);


create index if not exists results_academic_year_idx
on public.results(academic_year);


create index if not exists results_workflow_status_idx
on public.results(workflow_status);


create index if not exists results_result_status_idx
on public.results(result_status);


-- ============================================================
-- 9. RESULT MARKS INDEXES
-- ============================================================

create index if not exists result_marks_result_idx
on public.result_marks(result_id);


create index if not exists result_marks_subject_idx
on public.result_marks(subject_id);


create index if not exists result_marks_teacher_idx
on public.result_marks(teacher_id);


-- ============================================================
-- 10. GRADE SCALE INDEX
-- ============================================================

create index if not exists grade_scales_percentage_idx
on public.grade_scales(
  min_percentage,
  max_percentage
);


-- ============================================================
-- 11. UPDATED_AT FUNCTION
-- ============================================================

create or replace function public.set_result_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;


-- ============================================================
-- 12. RESULTS UPDATED_AT TRIGGER
-- ============================================================

drop trigger if exists
results_updated_at
on public.results;


create trigger results_updated_at
before update
on public.results
for each row
execute function public.set_result_updated_at();


-- ============================================================
-- 13. RESULT MARKS UPDATED_AT TRIGGER
-- ============================================================

drop trigger if exists
result_marks_updated_at
on public.result_marks;


create trigger result_marks_updated_at
before update
on public.result_marks
for each row
execute function public.set_result_updated_at();


-- ============================================================
-- 14. GRADE SCALES UPDATED_AT TRIGGER
-- ============================================================

drop trigger if exists
grade_scales_updated_at
on public.grade_scales;


create trigger grade_scales_updated_at
before update
on public.grade_scales
for each row
execute function public.set_result_updated_at();


-- ============================================================
-- 15. AUTOMATIC SUBJECT GRADE FUNCTION
-- ============================================================
--
-- Calculates grade based on percentage.
--
-- ============================================================

create or replace function public.calculate_result_grade(
  percentage_value numeric
)
returns text
language plpgsql
stable
as $$
declare
  calculated_grade text;
begin

  select gs.grade
  into calculated_grade

  from public.grade_scales gs

  where gs.status = 'active'

    and percentage_value >= gs.min_percentage

    and percentage_value <= gs.max_percentage

  order by gs.min_percentage desc

  limit 1;

  return calculated_grade;

end;
$$;


-- ============================================================
-- 16. AUTOMATIC RESULT SUMMARY FUNCTION
-- ============================================================
--
-- Updates:
-- total_marks
-- obtained_marks
-- percentage
-- grade
-- result_status
--
-- whenever subject marks are inserted/updated/deleted.
--
-- ============================================================

create or replace function public.recalculate_result(
  result_uuid uuid
)
returns void
language plpgsql
as $$
declare

  max_total numeric := 0;
  obtained_total numeric := 0;
  calculated_percentage numeric := 0;
  calculated_grade text;

  has_failed_subject boolean := false;

  has_missing_marks boolean := false;

begin

  select
    coalesce(sum(rm.maximum_marks), 0),
    coalesce(sum(rm.obtained_marks), 0),

    bool_or(
      rm.obtained_marks is not null
      and rm.obtained_marks < rm.pass_marks
    ),

    bool_or(
      rm.obtained_marks is null
    )

  into
    max_total,
    obtained_total,
    has_failed_subject,
    has_missing_marks

  from public.result_marks rm

  where rm.result_id = result_uuid;


  if max_total > 0 then

    calculated_percentage :=
      round(
        (obtained_total / max_total) * 100,
        2
      );

  else

    calculated_percentage := 0;

  end if;


  calculated_grade :=
    public.calculate_result_grade(
      calculated_percentage
    );


  update public.results

  set

    total_marks = max_total,

    obtained_marks = obtained_total,

    percentage = calculated_percentage,

    grade = calculated_grade,

    result_status =
      case

        when has_missing_marks then
          'incomplete'

        when has_failed_subject then
          'fail'

        when max_total = 0 then
          'incomplete'

        else
          'pass'

      end,

    updated_at = now()

  where id = result_uuid;

end;
$$;


-- ============================================================
-- 17. RESULT MARKS TRIGGER FUNCTION
-- ============================================================

create or replace function public.result_marks_recalculate()
returns trigger
language plpgsql
as $$
begin

  if tg_op = 'DELETE' then

    perform public.recalculate_result(
      old.result_id
    );

    return old;

  end if;


  perform public.recalculate_result(
    new.result_id
  );


  return new;

end;
$$;


-- ============================================================
-- 18. RESULT MARKS TRIGGER
-- ============================================================

drop trigger if exists
result_marks_recalculate_trigger
on public.result_marks;


create trigger result_marks_recalculate_trigger

after insert or update or delete

on public.result_marks

for each row

execute function public.result_marks_recalculate();


-- ============================================================
-- 19. STUDENT RESULT REPORT
-- ============================================================
--
-- Detailed result information.
--
-- Used for:
--
-- Admin
--   Results
--     View Result
--
-- Student
--   Result
--
-- ============================================================

create or replace view public.result_report
with (security_invoker = true)
as
select

  r.id as result_id,

  -- Student
  r.student_id,

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
  r.class_id,

  c.class_name,

  -- Section
  r.section_id,

  cs.section_name,

  -- Exam
  r.exam_id,

  e.name as exam_name,

  -- Academic year
  r.academic_year,

  -- Result summary
  r.total_marks,

  r.obtained_marks,

  r.percentage,

  r.grade,

  r.result_status,

  r.workflow_status,

  r.remarks as result_remarks,

  -- Subject marks
  rm.id as result_mark_id,

  rm.subject_id,

  sub.subject_name,

  rm.teacher_id,

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

  rm.maximum_marks,

  rm.pass_marks,

  rm.obtained_marks as subject_obtained_marks,

  rm.grade as subject_grade,

  rm.remarks as subject_remarks,

  r.created_at,

  r.updated_at

from public.results r

join public.students s
  on s.id = r.student_id

join public.school_classes c
  on c.id = r.class_id

join public.class_sections cs
  on cs.id = r.section_id

join public.exams e
  on e.id = r.exam_id

left join public.result_marks rm
  on rm.result_id = r.id

left join public.subjects sub
  on sub.id = rm.subject_id

left join public.teachers t
  on t.id = rm.teacher_id;


-- ============================================================
-- 20. RESULT SUMMARY
-- ============================================================
--
-- One row per student per examination.
--
-- ============================================================

create or replace view public.result_summary
with (security_invoker = true)
as
select

  r.id as result_id,

  r.student_id,

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

  r.exam_id,

  e.name as exam_name,

  r.class_id,

  c.class_name,

  r.section_id,

  cs.section_name,

  r.academic_year,

  r.total_marks,

  r.obtained_marks,

  r.percentage,

  r.grade,

  r.result_status,

  r.workflow_status,

  count(rm.id) as subject_count

from public.results r

join public.students s
  on s.id = r.student_id

join public.exams e
  on e.id = r.exam_id

join public.school_classes c
  on c.id = r.class_id

join public.class_sections cs
  on cs.id = r.section_id

left join public.result_marks rm
  on rm.result_id = r.id

group by

  r.id,

  r.student_id,

  s.admission_number,

  s.roll_number,

  s.first_name,

  s.middle_name,

  s.last_name,

  r.exam_id,

  e.name,

  r.class_id,

  c.class_name,

  r.section_id,

  cs.section_name,

  r.academic_year,

  r.total_marks,

  r.obtained_marks,

  r.percentage,

  r.grade,

  r.result_status,

  r.workflow_status;


-- ============================================================
-- 21. CLASS RESULT SUMMARY
-- ============================================================
--
-- Used for:
--
-- Admin
--   Results
--     Overall / Class Results
--
-- ============================================================

create or replace view public.class_result_summary
with (security_invoker = true)
as
select

  r.exam_id,

  e.name as exam_name,

  r.class_id,

  c.class_name,

  r.section_id,

  cs.section_name,

  r.academic_year,

  count(distinct r.student_id)
    as total_students,

  count(distinct r.student_id)
    filter (
      where r.result_status = 'pass'
    ) as passed_students,

  count(distinct r.student_id)
    filter (
      where r.result_status = 'fail'
    ) as failed_students,

  count(distinct r.student_id)
    filter (
      where r.result_status = 'absent'
    ) as absent_students,

  count(distinct r.student_id)
    filter (
      where r.result_status = 'incomplete'
    ) as incomplete_students,

  round(
    avg(r.percentage),
    2
  ) as average_percentage,

  round(
    max(r.percentage),
    2
  ) as highest_percentage,

  round(
    min(r.percentage),
    2
  ) as lowest_percentage,

  round(
    (
      count(distinct r.student_id)
      filter (
        where r.result_status = 'pass'
      )::numeric

      /

      nullif(
        count(distinct r.student_id),
        0
      )

    ) * 100,
    2
  ) as pass_percentage

from public.results r

join public.exams e
  on e.id = r.exam_id

join public.school_classes c
  on c.id = r.class_id

join public.class_sections cs
  on cs.id = r.section_id

group by

  r.exam_id,

  e.name,

  r.class_id,

  c.class_name,

  r.section_id,

  cs.section_name,

  r.academic_year;


-- ============================================================
-- 22. RLS - GRADE SCALES
-- ============================================================

alter table public.grade_scales
enable row level security;


drop policy if exists
"grade_scales_select_demo"
on public.grade_scales;


drop policy if exists
"grade_scales_insert_demo"
on public.grade_scales;


drop policy if exists
"grade_scales_update_demo"
on public.grade_scales;


drop policy if exists
"grade_scales_delete_demo"
on public.grade_scales;


create policy
"grade_scales_select_demo"
on public.grade_scales
for select
using (true);


create policy
"grade_scales_insert_demo"
on public.grade_scales
for insert
with check (true);


create policy
"grade_scales_update_demo"
on public.grade_scales
for update
using (true)
with check (true);


create policy
"grade_scales_delete_demo"
on public.grade_scales
for delete
using (true);


-- ============================================================
-- 23. RLS - RESULTS
-- ============================================================

alter table public.results
enable row level security;


drop policy if exists
"results_select_demo"
on public.results;


drop policy if exists
"results_insert_demo"
on public.results;


drop policy if exists
"results_update_demo"
on public.results;


drop policy if exists
"results_delete_demo"
on public.results;


create policy
"results_select_demo"
on public.results
for select
using (true);


create policy
"results_insert_demo"
on public.results
for insert
with check (true);


create policy
"results_update_demo"
on public.results
for update
using (true)
with check (true);


create policy
"results_delete_demo"
on public.results
for delete
using (true);


-- ============================================================
-- 24. RLS - RESULT MARKS
-- ============================================================

alter table public.result_marks
enable row level security;


drop policy if exists
"result_marks_select_demo"
on public.result_marks;


drop policy if exists
"result_marks_insert_demo"
on public.result_marks;


drop policy if exists
"result_marks_update_demo"
on public.result_marks;


drop policy if exists
"result_marks_delete_demo"
on public.result_marks;


create policy
"result_marks_select_demo"
on public.result_marks
for select
using (true);


create policy
"result_marks_insert_demo"
on public.result_marks
for insert
with check (true);


create policy
"result_marks_update_demo"
on public.result_marks
for update
using (true)
with check (true);


create policy
"result_marks_delete_demo"
on public.result_marks
for delete
using (true);


-- ============================================================
-- 25. GRANTS
-- ============================================================

grant select, insert, update, delete
on public.grade_scales
to anon, authenticated;


grant select, insert, update, delete
on public.results
to anon, authenticated;


grant select, insert, update, delete
on public.result_marks
to anon, authenticated;


-- ============================================================
-- 26. REPORT VIEW GRANTS
-- ============================================================

grant select
on public.result_report
to anon, authenticated;


grant select
on public.result_summary
to anon, authenticated;


grant select
on public.class_result_summary
to anon, authenticated;


-- ============================================================
-- 27. POSTGREST SCHEMA CACHE RELOAD
-- ============================================================

notify pgrst, 'reload schema';


-- ============================================================
-- END OF RESULT MANAGEMENT
-- ============================================================