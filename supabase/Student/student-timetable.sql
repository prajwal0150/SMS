-- ============================================================
-- STUDENT TIMETABLE
-- EduManage - School & College Management System
--
-- Student Portal → Timetable
--
-- Uses existing tables:
--   students
--   school_classes
--   class_sections
--   subjects
--   teachers
--   timetable
--
-- Does NOT create a duplicate timetable table.
-- ============================================================


-- ============================================================
-- 1. INDEXES ON EXISTING TIMETABLE
-- ============================================================

create index if not exists timetable_student_class_idx
on public.timetable(class_id);

create index if not exists timetable_student_section_idx
on public.timetable(section_id);

create index if not exists timetable_student_subject_idx
on public.timetable(subject_id);

create index if not exists timetable_student_teacher_idx
on public.timetable(teacher_id);

create index if not exists timetable_student_academic_year_idx
on public.timetable(academic_year);

create index if not exists timetable_student_day_period_idx
on public.timetable(
  day_of_week,
  period_number
);


-- ============================================================
-- 2. STUDENT WEEKLY TIMETABLE
-- ============================================================
--
-- Main view for:
--
-- Monday
-- Tuesday
-- Wednesday
-- Thursday
-- Friday
-- Saturday
--
-- The student only gets timetable records matching:
--
-- students.auth_user_id = auth.uid()
--
-- ============================================================

create or replace view public.student_timetable
with (security_invoker = true)
as

select

  -- ==========================================================
  -- TIMETABLE
  -- ==========================================================

  tt.id as timetable_id,

  tt.day_of_week,

  case tt.day_of_week

    when 'Monday' then 1
    when 'Tuesday' then 2
    when 'Wednesday' then 3
    when 'Thursday' then 4
    when 'Friday' then 5
    when 'Saturday' then 6
    when 'Sunday' then 7

  end as day_order,

  tt.period_number,

  tt.start_time,

  tt.end_time,

  tt.room,

  tt.academic_year,

  tt.created_at,

  tt.updated_at,


  -- ==========================================================
  -- SUBJECT
  -- ==========================================================

  tt.subject_id,

  coalesce(
    sub.subject_name,
    tt.subject
  ) as subject_name,

  sub.subject_code,

  sub.subject_type,


  -- ==========================================================
  -- TEACHER
  -- ==========================================================

  tt.teacher_id,

  case

    when teacher.id is not null then

      concat_ws(
        ' ',
        teacher.first_name,
        teacher.last_name
      )

    else tt.teacher_name

  end as teacher_name,


  -- ==========================================================
  -- CLASS
  -- ==========================================================

  tt.class_id,

  coalesce(
    sc.class_name,
    tt.class_name
  ) as class_name,

  sc.class_code,


  -- ==========================================================
  -- SECTION
  -- ==========================================================

  tt.section_id,

  coalesce(
    cs.section_name,
    tt.section
  ) as section_name,


  -- ==========================================================
  -- STUDENT
  -- ==========================================================

  s.id as student_id,

  concat_ws(
    ' ',
    s.first_name,
    s.middle_name,
    s.last_name
  ) as student_name


from public.students s

join public.timetable tt

  on

    -- Preferred new ID-based relationship
    (
      tt.class_id = s.class_id
      and
      (
        tt.section_id = s.section_id
        or tt.section_id is null
      )
    )

    -- Legacy timetable compatibility
    or

    (
      tt.class_id is null

      and tt.class_name = s.class_name

      and (
        tt.section = s.section
        or tt.section is null
      )
    )


left join public.school_classes sc
  on sc.id = tt.class_id


left join public.class_sections cs
  on cs.id = tt.section_id


left join public.subjects sub
  on sub.id = tt.subject_id


left join public.teachers teacher
  on teacher.id = tt.teacher_id


where

  s.auth_user_id = auth.uid()

  and s.status = 'active'


order by

  case tt.day_of_week

    when 'Monday' then 1
    when 'Tuesday' then 2
    when 'Wednesday' then 3
    when 'Thursday' then 4
    when 'Friday' then 5
    when 'Saturday' then 6
    when 'Sunday' then 7

  end,

  tt.period_number,

  tt.start_time;


-- ============================================================
-- 3. TODAY'S TIMETABLE
-- ============================================================
--
-- Useful for:
--
-- Student Dashboard
-- Today's Classes
-- Quick timetable widget
--
-- ============================================================

create or replace view public.student_timetable_today
with (security_invoker = true)
as

select *

from public.student_timetable

where day_of_week = case extract(
  dow from current_date
)

  when 0 then 'Sunday'
  when 1 then 'Monday'
  when 2 then 'Tuesday'
  when 3 then 'Wednesday'
  when 4 then 'Thursday'
  when 5 then 'Friday'
  when 6 then 'Saturday'

end

order by
  period_number,
  start_time;


-- ============================================================
-- 4. STUDENT TIMETABLE SUMMARY
-- ============================================================
--
-- Useful for the top of the timetable page:
--
-- Class
-- Section
-- Academic Year
-- Total Weekly Periods
-- Today's Classes
--
-- ============================================================

create or replace view public.student_timetable_summary
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


  -- ==========================================================
  -- CLASS
  -- ==========================================================

  s.class_id,

  coalesce(
    sc.class_name,
    s.class_name
  ) as class_name,

  sc.class_code,


  -- ==========================================================
  -- SECTION
  -- ==========================================================

  s.section_id,

  coalesce(
    cs.section_name,
    s.section
  ) as section_name,


  -- ==========================================================
  -- ACADEMIC YEAR
  -- ==========================================================

  coalesce(
    sc.academic_year,
    (
      select tt.academic_year

      from public.timetable tt

      where tt.class_id = s.class_id

      limit 1
    )
  ) as academic_year,


  -- ==========================================================
  -- WEEKLY PERIODS
  -- ==========================================================

  (
    select count(*)

    from public.timetable tt

    where

      (
        tt.class_id = s.class_id

        and (
          tt.section_id = s.section_id
          or tt.section_id is null
        )
      )

      or

      (
        tt.class_id is null

        and tt.class_name = s.class_name

        and (
          tt.section = s.section
          or tt.section is null
        )
      )

  )::bigint as total_weekly_periods,


  -- ==========================================================
  -- TODAY'S PERIODS
  -- ==========================================================

  (
    select count(*)

    from public.timetable tt

    where

      (

        (
          tt.class_id = s.class_id

          and (
            tt.section_id = s.section_id
            or tt.section_id is null
          )
        )

        or

        (
          tt.class_id is null

          and tt.class_name = s.class_name

          and (
            tt.section = s.section
            or tt.section is null
          )
        )

      )

      and tt.day_of_week = case extract(
        dow from current_date
      )

        when 0 then 'Sunday'
        when 1 then 'Monday'
        when 2 then 'Tuesday'
        when 3 then 'Wednesday'
        when 4 then 'Thursday'
        when 5 then 'Friday'
        when 6 then 'Saturday'

      end

  )::bigint as today_periods


from public.students s

left join public.school_classes sc
  on sc.id = s.class_id

left join public.class_sections cs
  on cs.id = s.section_id

where

  s.auth_user_id = auth.uid()

  and s.status = 'active';


-- ============================================================
-- 5. TIMETABLE BY DAY
-- ============================================================
--
-- Useful when the React UI displays seven day cards.
--
-- ============================================================

create or replace view public.student_timetable_by_day
with (security_invoker = true)
as

select

  day_of_week,

  day_order,

  count(*)::bigint as total_periods,

  min(start_time) as first_period_start,

  max(end_time) as last_period_end

from public.student_timetable

group by

  day_of_week,
  day_order

order by
  day_order;


-- ============================================================
-- 6. CURRENT CLASS / SECTION
-- ============================================================
--
-- Gives the Student Portal a simple profile header.
--
-- ============================================================

create or replace view public.student_timetable_class
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

  coalesce(
    sc.class_name,
    s.class_name
  ) as class_name,

  coalesce(
    cs.section_name,
    s.section
  ) as section_name,

  sc.class_code,

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

  end as class_teacher_name

from public.students s

left join public.school_classes sc
  on sc.id = s.class_id

left join public.class_sections cs
  on cs.id = s.section_id

left join public.teachers teacher
  on teacher.id = cs.class_teacher_id

where

  s.auth_user_id = auth.uid()

  and s.status = 'active';


-- ============================================================
-- 7. ROW LEVEL SECURITY
-- ============================================================
--
-- The student timetable views use:
--
--   students.auth_user_id = auth.uid()
--
-- Students should only read their timetable through the
-- Student Portal views.
--
-- ============================================================

alter table public.timetable
enable row level security;


-- ============================================================
-- 8. STUDENT TIMETABLE SELECT POLICY
-- ============================================================
--
-- This policy allows authenticated students to read timetable
-- rows belonging to their class/section.
--
-- ============================================================

drop policy if exists
"timetable_student_select_own"

on public.timetable;


create policy
"timetable_student_select_own"

on public.timetable

for select

to authenticated

using (

  exists (

    select 1

    from public.students s

    where

      s.auth_user_id = auth.uid()

      and s.status = 'active'

      and

      (

        (
          timetable.class_id = s.class_id

          and
          (
            timetable.section_id = s.section_id
            or timetable.section_id is null
          )
        )

        or

        (
          timetable.class_id is null

          and timetable.class_name = s.class_name

          and
          (
            timetable.section = s.section
            or timetable.section is null
          )
        )

      )

  )

);


-- ============================================================
-- 9. VIEW PERMISSIONS
-- ============================================================

grant select
on public.student_timetable
to authenticated;


grant select
on public.student_timetable_today
to authenticated;


grant select
on public.student_timetable_summary
to authenticated;


grant select
on public.student_timetable_by_day
to authenticated;


grant select
on public.student_timetable_class
to authenticated;


-- ============================================================
-- 10. TABLE PERMISSION
-- ============================================================
--
-- Student needs SELECT because the views use
-- security_invoker = true.
--
-- ============================================================

grant select
on public.timetable
to authenticated;


-- ============================================================
-- 11. SUPABASE API SCHEMA RELOAD
-- ============================================================

notify pgrst, 'reload schema';


-- ============================================================
-- END STUDENT TIMETABLE
-- ============================================================