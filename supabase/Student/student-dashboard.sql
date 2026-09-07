-- ============================================================
-- STUDENT DASHBOARD REPORTING
-- EduManage - School & College Management System
--
-- PURPOSE:
--   Dashboard/reporting views for the currently authenticated
--   student.
--
-- AUTHENTICATION:
--   auth.uid()
--       â†“
--   students.auth_user_id
--
-- IMPORTANT:
--   This file does NOT store passwords.
--   Student authentication is handled by Supabase Auth.
--
-- VERIFIED TABLES USED:
--   students
--   school_classes
--   class_sections
--   subjects
--   class_subjects
--   student_attendance
--   timetable
--   notices
--   announcements
--   events
--
-- ============================================================


-- ============================================================
-- 1. STUDENT PROFILE
-- ============================================================

create or replace view public.student_dashboard_profile
with (security_invoker = true)
as
select
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
  ) as student_name,

  s.email,
  s.phone,

  s.admission_number,
  s.roll_number,

  s.class_id,
  coalesce(
    sc.class_name,
    s.class_name
  ) as class_name,
  sc.class_code,
  sc.academic_year,

  s.section_id,
  coalesce(
    cs.section_name,
    s.section
  ) as section_name,

  cs.class_teacher_id,

  case
    when cs.class_teacher_id is not null
    then concat_ws(
      ' ',
      ct.first_name,
      ct.last_name
    )
    else null
  end as class_teacher_name,

  s.admission_year,
  s.admission_date,

  s.gender,
  s.date_of_birth,
  s.blood_group,
  s.category,
  s.rte,

  s.address,
  s.city,
  s.state,
  s.postal_code,

  s.father_name,
  s.mother_name,
  s.guardian_name,
  s.guardian_phone,

  s.photo_url,

  s.status,
  s.created_at,
  s.updated_at

from public.students s

left join public.school_classes sc
  on sc.id = s.class_id

left join public.class_sections cs
  on cs.id = s.section_id

left join public.teachers ct
  on ct.id = cs.class_teacher_id

where s.auth_user_id = auth.uid();


-- ============================================================
-- 2. STUDENT SUBJECTS
-- ============================================================

create or replace view public.student_dashboard_subjects
with (security_invoker = true)
as
select
  s.id as student_id,

  sub.id as subject_id,
  sub.subject_name,
  sub.subject_code,
  sub.subject_type,
  sub.description,

  cs.is_compulsory,
  cs.weekly_periods

from public.students s

join public.class_subjects cs
  on cs.class_id = s.class_id

join public.subjects sub
  on sub.id = cs.subject_id

where s.auth_user_id = auth.uid()
  and s.status = 'active'
  and cs.status = 'active'
  and sub.status = 'active'

order by
  sub.subject_name;


-- ============================================================
-- 3. STUDENT SUBJECT COUNT
-- ============================================================

create or replace view public.student_dashboard_subject_count
with (security_invoker = true)
as
select
  s.id as student_id,

  count(cs.id)::bigint as total_subjects,

  count(cs.id) filter (
    where cs.is_compulsory = true
  )::bigint as compulsory_subjects,

  count(cs.id) filter (
    where cs.is_compulsory = false
  )::bigint as optional_subjects

from public.students s

left join public.class_subjects cs
  on cs.class_id = s.class_id
  and cs.status = 'active'

left join public.subjects sub
  on sub.id = cs.subject_id
  and sub.status = 'active'

where s.auth_user_id = auth.uid()

group by s.id;


-- ============================================================
-- 4. TODAY'S ATTENDANCE
-- ============================================================

create or replace view public.student_dashboard_today_attendance
with (security_invoker = true)
as
select
  s.id as student_id,

  current_date as attendance_date,

  count(sa.id)::bigint as total_periods,

  count(sa.id) filter (
    where sa.status = 'present'
  )::bigint as present_count,

  count(sa.id) filter (
    where sa.status = 'absent'
  )::bigint as absent_count,

  count(sa.id) filter (
    where sa.status = 'late'
  )::bigint as late_count,

  count(sa.id) filter (
    where sa.status = 'leave'
  )::bigint as leave_count,

  round(
    (
      count(sa.id) filter (
        where sa.status in ('present', 'late')
      )::numeric
      /
      nullif(count(sa.id), 0)
    ) * 100,
    2
  ) as attendance_percentage

from public.students s

left join public.student_attendance sa
  on sa.student_id = s.id
  and sa.attendance_date = current_date

where s.auth_user_id = auth.uid()

group by s.id;


-- ============================================================
-- 5. TODAY'S ATTENDANCE DETAILS
-- ============================================================

create or replace view public.student_dashboard_today_attendance_details
with (security_invoker = true)
as
select
  sa.id as attendance_id,

  sa.student_id,

  sa.attendance_date,

  sa.status,
  sa.remarks,

  sa.subject_id,
  sub.subject_name,
  sub.subject_code,

  sa.teacher_id,

  case
    when t.id is not null
    then concat_ws(
      ' ',
      t.first_name,
      t.last_name
    )
    else null
  end as teacher_name

from public.student_attendance sa

join public.students s
  on s.id = sa.student_id

left join public.subjects sub
  on sub.id = sa.subject_id

left join public.teachers t
  on t.id = sa.teacher_id

where s.auth_user_id = auth.uid()
  and sa.attendance_date = current_date

order by
  sa.subject_id;


-- ============================================================
-- 6. CURRENT MONTH ATTENDANCE
-- ============================================================

create or replace view public.student_dashboard_monthly_attendance
with (security_invoker = true)
as
select
  s.id as student_id,

  date_trunc(
    'month',
    current_date
  )::date as month_start,

  count(sa.id)::bigint as total_records,

  count(sa.id) filter (
    where sa.status = 'present'
  )::bigint as present_count,

  count(sa.id) filter (
    where sa.status = 'absent'
  )::bigint as absent_count,

  count(sa.id) filter (
    where sa.status = 'late'
  )::bigint as late_count,

  count(sa.id) filter (
    where sa.status = 'leave'
  )::bigint as leave_count,

  round(
    (
      count(sa.id) filter (
        where sa.status in ('present', 'late')
      )::numeric
      /
      nullif(count(sa.id), 0)
    ) * 100,
    2
  ) as attendance_percentage

from public.students s

left join public.student_attendance sa
  on sa.student_id = s.id
  and sa.attendance_date >=
      date_trunc('month', current_date)::date
  and sa.attendance_date <
      (
        date_trunc('month', current_date)
        + interval '1 month'
      )::date

where s.auth_user_id = auth.uid()

group by s.id;


-- ============================================================
-- 7. OVERALL ATTENDANCE
-- ============================================================

create or replace view public.student_dashboard_overall_attendance
with (security_invoker = true)
as
select
  s.id as student_id,

  count(sa.id)::bigint as total_records,

  count(sa.id) filter (
    where sa.status = 'present'
  )::bigint as present_count,

  count(sa.id) filter (
    where sa.status = 'absent'
  )::bigint as absent_count,

  count(sa.id) filter (
    where sa.status = 'late'
  )::bigint as late_count,

  count(sa.id) filter (
    where sa.status = 'leave'
  )::bigint as leave_count,

  round(
    (
      count(sa.id) filter (
        where sa.status in ('present', 'late')
      )::numeric
      /
      nullif(count(sa.id), 0)
    ) * 100,
    2
  ) as attendance_percentage

from public.students s

left join public.student_attendance sa
  on sa.student_id = s.id

where s.auth_user_id = auth.uid()

group by s.id;


-- ============================================================
-- 8. ATTENDANCE TREND - LAST 30 DAYS
-- ============================================================

create or replace view public.student_dashboard_attendance_trend
with (security_invoker = true)
as
select
  sa.attendance_date,

  count(sa.id)::bigint as total_records,

  count(sa.id) filter (
    where sa.status = 'present'
  )::bigint as present_count,

  count(sa.id) filter (
    where sa.status = 'absent'
  )::bigint as absent_count,

  count(sa.id) filter (
    where sa.status = 'late'
  )::bigint as late_count,

  count(sa.id) filter (
    where sa.status = 'leave'
  )::bigint as leave_count,

  round(
    (
      count(sa.id) filter (
        where sa.status in ('present', 'late')
      )::numeric
      /
      nullif(count(sa.id), 0)
    ) * 100,
    2
  ) as attendance_percentage

from public.student_attendance sa

join public.students s
  on s.id = sa.student_id

where s.auth_user_id = auth.uid()
  and sa.attendance_date >= current_date - interval '29 days'
  and sa.attendance_date <= current_date

group by
  sa.attendance_date

order by
  sa.attendance_date;


-- ============================================================
-- 9. ATTENDANCE BY SUBJECT
-- ============================================================

create or replace view public.student_dashboard_subject_attendance
with (security_invoker = true)
as
select
  sa.subject_id,

  sub.subject_name,
  sub.subject_code,

  count(sa.id)::bigint as total_records,

  count(sa.id) filter (
    where sa.status = 'present'
  )::bigint as present_count,

  count(sa.id) filter (
    where sa.status = 'absent'
  )::bigint as absent_count,

  count(sa.id) filter (
    where sa.status = 'late'
  )::bigint as late_count,

  count(sa.id) filter (
    where sa.status = 'leave'
  )::bigint as leave_count,

  round(
    (
      count(sa.id) filter (
        where sa.status in ('present', 'late')
      )::numeric
      /
      nullif(count(sa.id), 0)
    ) * 100,
    2
  ) as attendance_percentage

from public.student_attendance sa

join public.students s
  on s.id = sa.student_id

left join public.subjects sub
  on sub.id = sa.subject_id

where s.auth_user_id = auth.uid()

group by
  sa.subject_id,
  sub.subject_name,
  sub.subject_code

order by
  sub.subject_name;


-- ============================================================
-- 10. STUDENT TIMETABLE
-- ============================================================

create or replace view public.student_dashboard_timetable
with (security_invoker = true)
as
select
  tt.id as timetable_id,

  s.id as student_id,

  tt.class_id,
  coalesce(
    sc.class_name,
    s.class_name
  ) as class_name,

  tt.section_id,
  coalesce(
    cs.section_name,
    s.section
  ) as section_name,

  tt.academic_year,

  tt.day_of_week,

  tt.period_number,

  tt.start_time,
  tt.end_time,

  tt.subject_id,

  coalesce(
    sub.subject_name,
    tt.subject
  ) as subject_name,

  sub.subject_code,

  tt.teacher_id,

  case
    when t.id is not null
    then concat_ws(
      ' ',
      t.first_name,
      t.last_name
    )
    else tt.teacher_name
  end as teacher_name,

  tt.room,

  tt.created_at,
  tt.updated_at

from public.students s

join public.timetable tt
  on (
    tt.class_id = s.class_id
    or (
      tt.class_id is null
      and tt.class_name = sc.class_name
    )
  )
  and (
    tt.section_id = s.section_id
    or (
      tt.section_id is null
      and (
        tt.section is null
        or tt.section = cs.section_name
      )
    )
  )

left join public.school_classes sc
  on sc.id = s.class_id

left join public.class_sections cs
  on cs.id = s.section_id

left join public.subjects sub
  on sub.id = tt.subject_id

left join public.teachers t
  on t.id = tt.teacher_id

where s.auth_user_id = auth.uid()

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
  tt.period_number;


-- ============================================================
-- 11. TODAY'S TIMETABLE
-- ============================================================

create or replace view public.student_dashboard_today_timetable
with (security_invoker = true)
as
select
  tt.timetable_id,
  tt.student_id,

  tt.class_name,
  tt.section_name,

  tt.day_of_week,
  tt.period_number,

  tt.start_time,
  tt.end_time,

  tt.subject_id,
  tt.subject_name,
  tt.subject_code,

  tt.teacher_id,
  tt.teacher_name,

  tt.room,

  case
    when current_time < tt.start_time
      then 'upcoming'

    when current_time >= tt.start_time
      and current_time <= tt.end_time
      then 'ongoing'

    else 'completed'
  end as period_status

from public.student_dashboard_timetable tt

where tt.day_of_week =
  trim(to_char(current_date, 'Day'))

order by
  tt.period_number;


-- ============================================================
-- 12. UPCOMING EVENTS
-- ============================================================

create or replace view public.student_dashboard_upcoming_events
with (security_invoker = true)
as
select
  id,
  title,
  description,
  date,
  time,
  location,
  status,
  organizer,
  attachment_url,
  attachment_name

from public.events

where status = 'published'
  and date >= current_date

order by
  date asc,
  time nulls last,
  created_at asc

limit 10;


-- ============================================================
-- 13. TODAY'S EVENTS
-- ============================================================

create or replace view public.student_dashboard_today_events
with (security_invoker = true)
as
select
  id,
  title,
  description,
  date,
  time,
  location,
  status,
  organizer

from public.events

where status = 'published'
  and date = current_date

order by
  time nulls last,
  created_at asc;


-- ============================================================
-- 14. LATEST PUBLISHED NOTICES
-- ============================================================

create or replace view public.student_dashboard_notices
with (security_invoker = true)
as
select
  id,
  title,
  body,
  category,
  date,
  status,
  priority,
  attachment_url,
  attachment_name,
  created_at

from public.notices

where status = 'published'

order by
  date desc,
  created_at desc

limit 10;


-- ============================================================
-- 15. LATEST ANNOUNCEMENTS
-- ============================================================

create or replace view public.student_dashboard_announcements
with (security_invoker = true)
as
select
  id,
  title,
  body,
  audience,
  date,
  status,
  priority,
  attachment_url,
  attachment_name,
  created_at

from public.announcements

where status = 'published'
  and audience in (
    'All',
    'Students'
  )

order by
  date desc,
  created_at desc

limit 10;


-- ============================================================
-- 16. STUDENT DASHBOARD SUMMARY
-- ============================================================

create or replace view public.student_dashboard_summary
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

  s.email,

  sc.id as class_id,
  coalesce(
    sc.class_name,
    s.class_name
  ) as class_name,
  sc.class_code,
  sc.academic_year,

  cs.id as section_id,
  coalesce(
    cs.section_name,
    s.section
  ) as section_name,

  (
    select count(*)
    from public.class_subjects csub
    join public.subjects sub
      on sub.id = csub.subject_id
    where csub.class_id = s.class_id
      and csub.status = 'active'
      and sub.status = 'active'
  )::bigint as total_subjects,

  (
    select count(*)
    from public.student_attendance sa
    where sa.student_id = s.id
      and sa.attendance_date = current_date
  )::bigint as today_periods,

  (
    select count(*)
    from public.student_attendance sa
    where sa.student_id = s.id
      and sa.attendance_date = current_date
      and sa.status = 'present'
  )::bigint as today_present,

  (
    select count(*)
    from public.student_attendance sa
    where sa.student_id = s.id
      and sa.attendance_date = current_date
      and sa.status = 'absent'
  )::bigint as today_absent,

  (
    select count(*)
    from public.student_attendance sa
    where sa.student_id = s.id
      and sa.attendance_date = current_date
      and sa.status = 'late'
  )::bigint as today_late,

  (
    select count(*)
    from public.student_attendance sa
    where sa.student_id = s.id
      and sa.attendance_date = current_date
      and sa.status = 'leave'
  )::bigint as today_leave,

  (
    select round(
      (
        count(*) filter (
          where sa.status in ('present', 'late')
        )::numeric
        /
        nullif(count(*), 0)
      ) * 100,
      2
    )
    from public.student_attendance sa
    where sa.student_id = s.id
      and sa.attendance_date >=
          date_trunc('month', current_date)::date
      and sa.attendance_date <
          (
            date_trunc('month', current_date)
            + interval '1 month'
          )::date
  ) as monthly_attendance_percentage,

  (
    select round(
      (
        count(*) filter (
          where sa.status in ('present', 'late')
        )::numeric
        /
        nullif(count(*), 0)
      ) * 100,
      2
    )
    from public.student_attendance sa
    where sa.student_id = s.id
  ) as overall_attendance_percentage,

  (
    select count(*)
    from public.events e
    where e.status = 'published'
      and e.date >= current_date
  )::bigint as upcoming_events_count,

  (
    select count(*)
    from public.notices n
    where n.status = 'published'
  )::bigint as published_notices_count

from public.students s

left join public.school_classes sc
  on sc.id = s.class_id

left join public.class_sections cs
  on cs.id = s.section_id

where s.auth_user_id = auth.uid();


-- ============================================================
-- 17. STUDENT ATTENDANCE STATUS
-- ============================================================

create or replace view public.student_dashboard_attendance_status
with (security_invoker = true)
as
select
  sa.status,
  count(*)::bigint as total_records,

  round(
    (
      count(*)::numeric
      /
      nullif(
        sum(count(*)) over (),
        0
      )
    ) * 100,
    2
  ) as percentage

from public.student_attendance sa

join public.students s
  on s.id = sa.student_id

where s.auth_user_id = auth.uid()

group by
  sa.status

order by
  total_records desc;


-- ============================================================
-- 18. RECENT ATTENDANCE
-- ============================================================

create or replace view public.student_dashboard_recent_attendance
with (security_invoker = true)
as
select
  sa.id as attendance_id,

  sa.attendance_date,

  sa.status,
  sa.remarks,

  sa.subject_id,
  sub.subject_name,
  sub.subject_code,

  sa.teacher_id,

  case
    when t.id is not null
    then concat_ws(
      ' ',
      t.first_name,
      t.last_name
    )
    else null
  end as teacher_name

from public.student_attendance sa

join public.students s
  on s.id = sa.student_id

left join public.subjects sub
  on sub.id = sa.subject_id

left join public.teachers t
  on t.id = sa.teacher_id

where s.auth_user_id = auth.uid()

order by
  sa.attendance_date desc,
  sa.created_at desc

limit 20;


-- ============================================================
-- 19. DASHBOARD NOTIFICATION COUNT
-- ============================================================

create or replace view public.student_dashboard_notification_count
with (security_invoker = true)
as
select
  (
    select count(*)
    from public.notices
    where status = 'published'
  )::bigint as notices_count,

  (
    select count(*)
    from public.announcements
    where status = 'published'
      and audience in ('All', 'Students')
  )::bigint as announcements_count,

  (
    select count(*)
    from public.events
    where status = 'published'
      and date >= current_date
  )::bigint as upcoming_events_count;


-- ============================================================
-- 20. COMPLETE STUDENT DASHBOARD DATA
-- ============================================================

create or replace view public.student_dashboard_complete
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
  s.email,

  coalesce(
    sc.class_name,
    s.class_name
  ) as class_name,
  coalesce(
    cs.section_name,
    s.section
  ) as section_name,

  sc.academic_year,

  (
    select count(*)
    from public.class_subjects csub
    join public.subjects sub
      on sub.id = csub.subject_id
    where csub.class_id = s.class_id
      and csub.status = 'active'
      and sub.status = 'active'
  )::bigint as total_subjects,

  -- Current month attendance
  (
    select round(
      (
        count(*) filter (
          where sa.status in ('present', 'late')
        )::numeric
        /
        nullif(count(*), 0)
      ) * 100,
      2
    )
    from public.student_attendance sa
    where sa.student_id = s.id
      and sa.attendance_date >=
          date_trunc('month', current_date)::date
      and sa.attendance_date <
          (
            date_trunc('month', current_date)
            + interval '1 month'
          )::date
  ) as monthly_attendance,

  -- Overall attendance
  (
    select round(
      (
        count(*) filter (
          where sa.status in ('present', 'late')
        )::numeric
        /
        nullif(count(*), 0)
      ) * 100,
      2
    )
    from public.student_attendance sa
    where sa.student_id = s.id
  ) as overall_attendance,

  -- Today's attendance
  (
    select count(*)
    from public.student_attendance sa
    where sa.student_id = s.id
      and sa.attendance_date = current_date
  )::bigint as today_total,

  (
    select count(*)
    from public.student_attendance sa
    where sa.student_id = s.id
      and sa.attendance_date = current_date
      and sa.status = 'present'
  )::bigint as today_present,

  (
    select count(*)
    from public.student_attendance sa
    where sa.student_id = s.id
      and sa.attendance_date = current_date
      and sa.status = 'absent'
  )::bigint as today_absent,

  (
    select count(*)
    from public.student_attendance sa
    where sa.student_id = s.id
      and sa.attendance_date = current_date
      and sa.status = 'late'
  )::bigint as today_late,

  (
    select count(*)
    from public.student_attendance sa
    where sa.student_id = s.id
      and sa.attendance_date = current_date
      and sa.status = 'leave'
  )::bigint as today_leave,

  -- Communication
  (
    select count(*)
    from public.notices
    where status = 'published'
  )::bigint as notices_count,

  (
    select count(*)
    from public.announcements
    where status = 'published'
      and audience in ('All', 'Students')
  )::bigint as announcements_count,

  (
    select count(*)
    from public.events
    where status = 'published'
      and date >= current_date
  )::bigint as upcoming_events_count

from public.students s

left join public.school_classes sc
  on sc.id = s.class_id

left join public.class_sections cs
  on cs.id = s.section_id

where s.auth_user_id = auth.uid();


-- ============================================================
-- 21. REQUIRED INDEXES
-- ============================================================

create index if not exists students_auth_user_id_dashboard_idx
on public.students(auth_user_id);

create index if not exists student_attendance_student_date_dashboard_idx
on public.student_attendance(
  student_id,
  attendance_date
);

create index if not exists student_attendance_student_subject_dashboard_idx
on public.student_attendance(
  student_id,
  subject_id
);

create index if not exists timetable_class_section_day_dashboard_idx
on public.timetable(
  class_id,
  section_id,
  day_of_week,
  period_number
);

create index if not exists timetable_class_section_year_dashboard_idx
on public.timetable(
  class_id,
  section_id,
  academic_year
);

create index if not exists class_subjects_class_status_dashboard_idx
on public.class_subjects(
  class_id,
  status
);

create index if not exists notices_status_date_dashboard_idx
on public.notices(
  status,
  date desc
);

create index if not exists announcements_status_audience_date_dashboard_idx
on public.announcements(
  status,
  audience,
  date desc
);

create index if not exists events_status_date_dashboard_idx
on public.events(
  status,
  date asc
);


-- ============================================================
-- 22. VIEW PERMISSIONS
-- ============================================================

grant select on public.student_dashboard_profile
to authenticated;

grant select on public.student_dashboard_subjects
to authenticated;

grant select on public.student_dashboard_subject_count
to authenticated;

grant select on public.student_dashboard_today_attendance
to authenticated;

grant select on public.student_dashboard_today_attendance_details
to authenticated;

grant select on public.student_dashboard_monthly_attendance
to authenticated;

grant select on public.student_dashboard_overall_attendance
to authenticated;

grant select on public.student_dashboard_attendance_trend
to authenticated;

grant select on public.student_dashboard_subject_attendance
to authenticated;

grant select on public.student_dashboard_timetable
to authenticated;

grant select on public.student_dashboard_today_timetable
to authenticated;

grant select on public.student_dashboard_upcoming_events
to authenticated;

grant select on public.student_dashboard_today_events
to authenticated;

grant select on public.student_dashboard_notices
to authenticated;

grant select on public.student_dashboard_announcements
to authenticated;

grant select on public.student_dashboard_summary
to authenticated;

grant select on public.student_dashboard_attendance_status
to authenticated;

grant select on public.student_dashboard_recent_attendance
to authenticated;

grant select on public.student_dashboard_notification_count
to authenticated;

grant select on public.student_dashboard_complete
to authenticated;


-- ============================================================
-- 23. RELOAD SUPABASE DATA API
-- ============================================================

notify pgrst, 'reload schema';


-- ============================================================
-- END STUDENT DASHBOARD
-- ============================================================

-- ============================================================
-- STUDENT DASHBOARD
-- EduManage - School & College Management System
--
-- Uses:
--   students
--   school_classes
--   class_sections
--   teachers
--   subjects
--   class_subjects
--   student_attendance
--   timetable
--   notices
--   announcements
--   events
--
-- Student is identified by:
--
--   auth.uid()
--        â†“
--   students.auth_user_id
--
-- ============================================================


-- ============================================================
-- 1. STUDENT PROFILE
-- ============================================================

create or replace view public.student_dashboard_profile
with (security_invoker = true)
as
select
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
  ) as student_name,

  s.email,
  s.phone,

  s.admission_number,
  s.roll_number,

  s.class_id,
  coalesce(
    sc.class_name,
    s.class_name
  ) as class_name,
  sc.class_code,
  sc.academic_year,

  s.section_id,
  coalesce(
    cs.section_name,
    s.section
  ) as section_name,

  cs.class_teacher_id,

  case
    when ct.id is not null then
      concat_ws(
        ' ',
        ct.first_name,
        ct.last_name
      )
    else null
  end as class_teacher_name,

  s.admission_year,
  s.admission_date,

  s.gender,
  s.date_of_birth,
  s.blood_group,
  s.category,
  s.rte,

  s.address,
  s.city,
  s.state,
  s.postal_code,

  s.father_name,
  s.mother_name,
  s.guardian_name,
  s.guardian_phone,

  s.photo_url,

  s.status,
  s.created_at,
  s.updated_at

from public.students s

left join public.school_classes sc
  on sc.id = s.class_id

left join public.class_sections cs
  on cs.id = s.section_id

left join public.teachers ct
  on ct.id = cs.class_teacher_id

where s.auth_user_id = auth.uid();


-- ============================================================
-- 2. STUDENT SUBJECTS
-- ============================================================

create or replace view public.student_dashboard_subjects
with (security_invoker = true)
as
select
  s.id as student_id,

  sub.id as subject_id,
  sub.subject_name,
  sub.subject_code,
  sub.subject_type,
  sub.description,

  cs.is_compulsory,
  cs.weekly_periods

from public.students s

join public.class_subjects cs
  on cs.class_id = s.class_id

join public.subjects sub
  on sub.id = cs.subject_id

where s.auth_user_id = auth.uid()
  and s.status = 'active'
  and cs.status = 'active'
  and sub.status = 'active'

order by
  sub.subject_name;


-- ============================================================
-- 3. SUBJECT COUNT
-- ============================================================

create or replace view public.student_dashboard_subject_count
with (security_invoker = true)
as
select
  s.id as student_id,

  count(cs.id)::bigint as total_subjects,

  count(cs.id) filter (
    where cs.is_compulsory = true
  )::bigint as compulsory_subjects,

  count(cs.id) filter (
    where cs.is_compulsory = false
  )::bigint as optional_subjects

from public.students s

left join public.class_subjects cs
  on cs.class_id = s.class_id
  and cs.status = 'active'

left join public.subjects sub
  on sub.id = cs.subject_id
  and sub.status = 'active'

where s.auth_user_id = auth.uid()

group by
  s.id;


-- ============================================================
-- 4. TODAY'S ATTENDANCE
-- ============================================================

create or replace view public.student_dashboard_today_attendance
with (security_invoker = true)
as
select
  s.id as student_id,

  current_date as attendance_date,

  count(sa.id)::bigint as total_periods,

  count(sa.id) filter (
    where sa.status = 'present'
  )::bigint as present_count,

  count(sa.id) filter (
    where sa.status = 'absent'
  )::bigint as absent_count,

  count(sa.id) filter (
    where sa.status = 'late'
  )::bigint as late_count,

  count(sa.id) filter (
    where sa.status = 'leave'
  )::bigint as leave_count,

  round(
    (
      count(sa.id) filter (
        where sa.status in ('present', 'late')
      )::numeric
      /
      nullif(count(sa.id), 0)
    ) * 100,
    2
  ) as attendance_percentage

from public.students s

left join public.student_attendance sa
  on sa.student_id = s.id
  and sa.attendance_date = current_date

where s.auth_user_id = auth.uid()

group by
  s.id;


-- ============================================================
-- 5. TODAY'S ATTENDANCE DETAILS
-- ============================================================

create or replace view public.student_dashboard_today_attendance_details
with (security_invoker = true)
as
select
  sa.id as attendance_id,

  sa.student_id,
  sa.attendance_date,

  sa.status,
  sa.remarks,

  sa.subject_id,
  sub.subject_name,
  sub.subject_code,

  sa.teacher_id,

  case
    when t.id is not null then
      concat_ws(
        ' ',
        t.first_name,
        t.last_name
      )
    else null
  end as teacher_name

from public.student_attendance sa

join public.students s
  on s.id = sa.student_id

left join public.subjects sub
  on sub.id = sa.subject_id

left join public.teachers t
  on t.id = sa.teacher_id

where s.auth_user_id = auth.uid()
  and sa.attendance_date = current_date

order by
  sub.subject_name;


-- ============================================================
-- 6. CURRENT MONTH ATTENDANCE
-- ============================================================

create or replace view public.student_dashboard_monthly_attendance
with (security_invoker = true)
as
select
  s.id as student_id,

  date_trunc(
    'month',
    current_date
  )::date as month_start,

  count(sa.id)::bigint as total_records,

  count(sa.id) filter (
    where sa.status = 'present'
  )::bigint as present_count,

  count(sa.id) filter (
    where sa.status = 'absent'
  )::bigint as absent_count,

  count(sa.id) filter (
    where sa.status = 'late'
  )::bigint as late_count,

  count(sa.id) filter (
    where sa.status = 'leave'
  )::bigint as leave_count,

  round(
    (
      count(sa.id) filter (
        where sa.status in ('present', 'late')
      )::numeric
      /
      nullif(count(sa.id), 0)
    ) * 100,
    2
  ) as attendance_percentage

from public.students s

left join public.student_attendance sa
  on sa.student_id = s.id
  and sa.attendance_date >=
      date_trunc('month', current_date)::date
  and sa.attendance_date <
      (
        date_trunc('month', current_date)
        + interval '1 month'
      )::date

where s.auth_user_id = auth.uid()

group by
  s.id;


-- ============================================================
-- 7. OVERALL ATTENDANCE
-- ============================================================

create or replace view public.student_dashboard_overall_attendance
with (security_invoker = true)
as
select
  s.id as student_id,

  count(sa.id)::bigint as total_records,

  count(sa.id) filter (
    where sa.status = 'present'
  )::bigint as present_count,

  count(sa.id) filter (
    where sa.status = 'absent'
  )::bigint as absent_count,

  count(sa.id) filter (
    where sa.status = 'late'
  )::bigint as late_count,

  count(sa.id) filter (
    where sa.status = 'leave'
  )::bigint as leave_count,

  round(
    (
      count(sa.id) filter (
        where sa.status in ('present', 'late')
      )::numeric
      /
      nullif(count(sa.id), 0)
    ) * 100,
    2
  ) as attendance_percentage

from public.students s

left join public.student_attendance sa
  on sa.student_id = s.id

where s.auth_user_id = auth.uid()

group by
  s.id;


-- ============================================================
-- 8. ATTENDANCE TREND - LAST 30 DAYS
-- ============================================================

create or replace view public.student_dashboard_attendance_trend
with (security_invoker = true)
as
select
  sa.attendance_date,

  count(sa.id)::bigint as total_records,

  count(sa.id) filter (
    where sa.status = 'present'
  )::bigint as present_count,

  count(sa.id) filter (
    where sa.status = 'absent'
  )::bigint as absent_count,

  count(sa.id) filter (
    where sa.status = 'late'
  )::bigint as late_count,

  count(sa.id) filter (
    where sa.status = 'leave'
  )::bigint as leave_count,

  round(
    (
      count(sa.id) filter (
        where sa.status in ('present', 'late')
      )::numeric
      /
      nullif(count(sa.id), 0)
    ) * 100,
    2
  ) as attendance_percentage

from public.student_attendance sa

join public.students s
  on s.id = sa.student_id

where s.auth_user_id = auth.uid()
  and sa.attendance_date >= current_date - interval '29 days'
  and sa.attendance_date <= current_date

group by
  sa.attendance_date

order by
  sa.attendance_date;


-- ============================================================
-- 9. ATTENDANCE BY SUBJECT
-- ============================================================

create or replace view public.student_dashboard_subject_attendance
with (security_invoker = true)
as
select
  sa.subject_id,

  sub.subject_name,
  sub.subject_code,

  count(sa.id)::bigint as total_records,

  count(sa.id) filter (
    where sa.status = 'present'
  )::bigint as present_count,

  count(sa.id) filter (
    where sa.status = 'absent'
  )::bigint as absent_count,

  count(sa.id) filter (
    where sa.status = 'late'
  )::bigint as late_count,

  count(sa.id) filter (
    where sa.status = 'leave'
  )::bigint as leave_count,

  round(
    (
      count(sa.id) filter (
        where sa.status in ('present', 'late')
      )::numeric
      /
      nullif(count(sa.id), 0)
    ) * 100,
    2
  ) as attendance_percentage

from public.student_attendance sa

join public.students s
  on s.id = sa.student_id

left join public.subjects sub
  on sub.id = sa.subject_id

where s.auth_user_id = auth.uid()

group by
  sa.subject_id,
  sub.subject_name,
  sub.subject_code

order by
  sub.subject_name;


-- ============================================================
-- 10. STUDENT TIMETABLE
-- ============================================================
--
-- IMPORTANT:
-- school_classes and class_sections are joined BEFORE timetable.
-- This fixes the previous SQL error.
-- ============================================================

create or replace view public.student_dashboard_timetable
with (security_invoker = true)
as
select
  tt.id as timetable_id,

  s.id as student_id,

  tt.class_id,
  coalesce(
    sc.class_name,
    s.class_name
  ) as class_name,

  tt.section_id,
  coalesce(
    cs.section_name,
    s.section
  ) as section_name,

  tt.academic_year,

  tt.day_of_week,

  tt.period_number,

  tt.start_time,
  tt.end_time,

  tt.subject_id,

  coalesce(
    sub.subject_name,
    tt.subject
  ) as subject_name,

  sub.subject_code,

  tt.teacher_id,

  case
    when t.id is not null then
      concat_ws(
        ' ',
        t.first_name,
        t.last_name
      )
    else tt.teacher_name
  end as teacher_name,

  tt.room,

  tt.created_at,
  tt.updated_at

from public.students s

left join public.school_classes sc
  on sc.id = s.class_id

left join public.class_sections cs
  on cs.id = s.section_id

join public.timetable tt
  on (
    tt.class_id = s.class_id

    or (
      tt.class_id is null
      and tt.class_name = sc.class_name
    )
  )

  and (
    tt.section_id = s.section_id

    or (
      tt.section_id is null
      and (
        tt.section is null
        or tt.section = cs.section_name
      )
    )
  )

left join public.subjects sub
  on sub.id = tt.subject_id

left join public.teachers t
  on t.id = tt.teacher_id

where s.auth_user_id = auth.uid()

order by
  case tt.day_of_week
    when 'Monday' then 1
    when 'Tuesday' then 2
    when 'Wednesday' then 3
    when 'Thursday' then 4
    when 'Friday' then 5
    when 'Saturday' then 6
    when 'Sunday' then 7
    else 8
  end,
  tt.period_number;


-- ============================================================
-- 11. TODAY'S TIMETABLE
-- ============================================================

create or replace view public.student_dashboard_today_timetable
with (security_invoker = true)
as
select
  tt.timetable_id,
  tt.student_id,

  tt.class_name,
  tt.section_name,

  tt.day_of_week,
  tt.period_number,

  tt.start_time,
  tt.end_time,

  tt.subject_id,
  tt.subject_name,
  tt.subject_code,

  tt.teacher_id,
  tt.teacher_name,

  tt.room,

  case
    when current_time < tt.start_time
      then 'upcoming'

    when current_time >= tt.start_time
      and current_time <= tt.end_time
      then 'ongoing'

    else 'completed'
  end as period_status

from public.student_dashboard_timetable tt

where tt.day_of_week =
  trim(to_char(current_date, 'Day'))

order by
  tt.period_number;


-- ============================================================
-- 12. UPCOMING EVENTS
-- ============================================================

create or replace view public.student_dashboard_upcoming_events
with (security_invoker = true)
as
select
  id,
  title,
  description,
  date,
  time,
  location,
  status,
  organizer,
  attachment_url,
  attachment_name,
  created_at

from public.events

where status = 'published'
  and date >= current_date

order by
  date asc,
  time nulls last,
  created_at asc

limit 10;


-- ============================================================
-- 13. TODAY'S EVENTS
-- ============================================================

create or replace view public.student_dashboard_today_events
with (security_invoker = true)
as
select
  id,
  title,
  description,
  date,
  time,
  location,
  status,
  organizer,
  attachment_url,
  attachment_name

from public.events

where status = 'published'
  and date = current_date

order by
  time nulls last,
  created_at asc;


-- ============================================================
-- 14. LATEST NOTICES
-- ============================================================

create or replace view public.student_dashboard_notices
with (security_invoker = true)
as
select
  id,
  title,
  body,
  category,
  date,
  status,
  priority,
  attachment_url,
  attachment_name,
  created_at

from public.notices

where status = 'published'

order by
  date desc,
  created_at desc

limit 10;


-- ============================================================
-- 15. LATEST ANNOUNCEMENTS
-- ============================================================

create or replace view public.student_dashboard_announcements
with (security_invoker = true)
as
select
  id,
  title,
  body,
  audience,
  date,
  status,
  priority,
  attachment_url,
  attachment_name,
  created_at

from public.announcements

where status = 'published'
  and audience in (
    'All',
    'Students'
  )

order by
  date desc,
  created_at desc

limit 10;


-- ============================================================
-- 16. ATTENDANCE STATUS
-- ============================================================

create or replace view public.student_dashboard_attendance_status
with (security_invoker = true)
as
select
  sa.status,

  count(*)::bigint as total_records,

  round(
    (
      count(*)::numeric
      /
      nullif(
        sum(count(*)) over (),
        0
      )
    ) * 100,
    2
  ) as percentage

from public.student_attendance sa

join public.students s
  on s.id = sa.student_id

where s.auth_user_id = auth.uid()

group by
  sa.status

order by
  total_records desc;


-- ============================================================
-- 17. RECENT ATTENDANCE
-- ============================================================

create or replace view public.student_dashboard_recent_attendance
with (security_invoker = true)
as
select
  sa.id as attendance_id,

  sa.attendance_date,

  sa.status,
  sa.remarks,

  sa.subject_id,
  sub.subject_name,
  sub.subject_code,

  sa.teacher_id,

  case
    when t.id is not null then
      concat_ws(
        ' ',
        t.first_name,
        t.last_name
      )
    else null
  end as teacher_name

from public.student_attendance sa

join public.students s
  on s.id = sa.student_id

left join public.subjects sub
  on sub.id = sa.subject_id

left join public.teachers t
  on t.id = sa.teacher_id

where s.auth_user_id = auth.uid()

order by
  sa.attendance_date desc,
  sa.created_at desc

limit 20;


-- ============================================================
-- 18. NOTIFICATION COUNTS
-- ============================================================

create or replace view public.student_dashboard_notification_count
with (security_invoker = true)
as
select
  (
    select count(*)
    from public.notices
    where status = 'published'
  )::bigint as notices_count,

  (
    select count(*)
    from public.announcements
    where status = 'published'
      and audience in ('All', 'Students')
  )::bigint as announcements_count,

  (
    select count(*)
    from public.events
    where status = 'published'
      and date >= current_date
  )::bigint as upcoming_events_count;


-- ============================================================
-- 19. STUDENT DASHBOARD SUMMARY
-- ============================================================

create or replace view public.student_dashboard_summary
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
  s.email,

  sc.id as class_id,
  coalesce(
    sc.class_name,
    s.class_name
  ) as class_name,
  sc.class_code,
  sc.academic_year,

  cs.id as section_id,
  coalesce(
    cs.section_name,
    s.section
  ) as section_name,

  (
    select count(*)
    from public.class_subjects csub

    join public.subjects sub
      on sub.id = csub.subject_id

    where csub.class_id = s.class_id
      and csub.status = 'active'
      and sub.status = 'active'
  )::bigint as total_subjects,

  (
    select count(*)
    from public.student_attendance sa
    where sa.student_id = s.id
      and sa.attendance_date = current_date
  )::bigint as today_periods,

  (
    select count(*)
    from public.student_attendance sa
    where sa.student_id = s.id
      and sa.attendance_date = current_date
      and sa.status = 'present'
  )::bigint as today_present,

  (
    select count(*)
    from public.student_attendance sa
    where sa.student_id = s.id
      and sa.attendance_date = current_date
      and sa.status = 'absent'
  )::bigint as today_absent,

  (
    select count(*)
    from public.student_attendance sa
    where sa.student_id = s.id
      and sa.attendance_date = current_date
      and sa.status = 'late'
  )::bigint as today_late,

  (
    select count(*)
    from public.student_attendance sa
    where sa.student_id = s.id
      and sa.attendance_date = current_date
      and sa.status = 'leave'
  )::bigint as today_leave,

  (
    select round(
      (
        count(*) filter (
          where sa.status in ('present', 'late')
        )::numeric
        /
        nullif(count(*), 0)
      ) * 100,
      2
    )

    from public.student_attendance sa

    where sa.student_id = s.id
      and sa.attendance_date >=
          date_trunc(
            'month',
            current_date
          )::date

      and sa.attendance_date <
          (
            date_trunc(
              'month',
              current_date
            )
            + interval '1 month'
          )::date
  ) as monthly_attendance_percentage,

  (
    select round(
      (
        count(*) filter (
          where sa.status in ('present', 'late')
        )::numeric
        /
        nullif(count(*), 0)
      ) * 100,
      2
    )

    from public.student_attendance sa

    where sa.student_id = s.id
  ) as overall_attendance_percentage,

  (
    select count(*)
    from public.events e

    where e.status = 'published'
      and e.date >= current_date
  )::bigint as upcoming_events_count,

  (
    select count(*)
    from public.notices n

    where n.status = 'published'
  )::bigint as published_notices_count

from public.students s

left join public.school_classes sc
  on sc.id = s.class_id

left join public.class_sections cs
  on cs.id = s.section_id

where s.auth_user_id = auth.uid();


-- ============================================================
-- 20. COMPLETE DASHBOARD SUMMARY
-- ============================================================

create or replace view public.student_dashboard_complete
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
  s.email,

  coalesce(
    sc.class_name,
    s.class_name
  ) as class_name,
  coalesce(
    cs.section_name,
    s.section
  ) as section_name,

  sc.academic_year,

  (
    select count(*)

    from public.class_subjects csub

    join public.subjects sub
      on sub.id = csub.subject_id

    where csub.class_id = s.class_id
      and csub.status = 'active'
      and sub.status = 'active'
  )::bigint as total_subjects,

  (
    select round(
      (
        count(*) filter (
          where sa.status in ('present', 'late')
        )::numeric
        /
        nullif(count(*), 0)
      ) * 100,
      2
    )

    from public.student_attendance sa

    where sa.student_id = s.id

      and sa.attendance_date >=
          date_trunc(
            'month',
            current_date
          )::date

      and sa.attendance_date <
          (
            date_trunc(
              'month',
              current_date
            )
            + interval '1 month'
          )::date
  ) as monthly_attendance,

  (
    select round(
      (
        count(*) filter (
          where sa.status in ('present', 'late')
        )::numeric
        /
        nullif(count(*), 0)
      ) * 100,
      2
    )

    from public.student_attendance sa

    where sa.student_id = s.id
  ) as overall_attendance,

  (
    select count(*)

    from public.student_attendance sa

    where sa.student_id = s.id
      and sa.attendance_date = current_date
  )::bigint as today_total,

  (
    select count(*)

    from public.student_attendance sa

    where sa.student_id = s.id
      and sa.attendance_date = current_date
      and sa.status = 'present'
  )::bigint as today_present,

  (
    select count(*)

    from public.student_attendance sa

    where sa.student_id = s.id
      and sa.attendance_date = current_date
      and sa.status = 'absent'
  )::bigint as today_absent,

  (
    select count(*)

    from public.student_attendance sa

    where sa.student_id = s.id
      and sa.attendance_date = current_date
      and sa.status = 'late'
  )::bigint as today_late,

  (
    select count(*)

    from public.student_attendance sa

    where sa.student_id = s.id
      and sa.attendance_date = current_date
      and sa.status = 'leave'
  )::bigint as today_leave,

  (
    select count(*)

    from public.notices

    where status = 'published'
  )::bigint as notices_count,

  (
    select count(*)

    from public.announcements

    where status = 'published'
      and audience in ('All', 'Students')
  )::bigint as announcements_count,

  (
    select count(*)

    from public.events

    where status = 'published'
      and date >= current_date
  )::bigint as upcoming_events_count

from public.students s

left join public.school_classes sc
  on sc.id = s.class_id

left join public.class_sections cs
  on cs.id = s.section_id

where s.auth_user_id = auth.uid();


-- ============================================================
-- 21. INDEXES
-- ============================================================

create index if not exists students_auth_user_id_dashboard_idx
on public.students(auth_user_id);

create index if not exists student_attendance_student_date_dashboard_idx
on public.student_attendance(
  student_id,
  attendance_date
);

create index if not exists student_attendance_student_subject_dashboard_idx
on public.student_attendance(
  student_id,
  subject_id
);

create index if not exists timetable_class_section_day_dashboard_idx
on public.timetable(
  class_id,
  section_id,
  day_of_week,
  period_number
);

create index if not exists timetable_class_section_year_dashboard_idx
on public.timetable(
  class_id,
  section_id,
  academic_year
);

create index if not exists class_subjects_class_status_dashboard_idx
on public.class_subjects(
  class_id,
  status
);

create index if not exists notices_status_date_dashboard_idx
on public.notices(
  status,
  date desc
);

create index if not exists announcements_status_audience_date_dashboard_idx
on public.announcements(
  status,
  audience,
  date desc
);

create index if not exists events_status_date_dashboard_idx
on public.events(
  status,
  date asc
);


-- ============================================================
-- 22. VIEW PERMISSIONS
-- ============================================================

grant select on public.student_dashboard_profile
to authenticated;

grant select on public.student_dashboard_subjects
to authenticated;

grant select on public.student_dashboard_subject_count
to authenticated;

grant select on public.student_dashboard_today_attendance
to authenticated;

grant select on public.student_dashboard_today_attendance_details
to authenticated;

grant select on public.student_dashboard_monthly_attendance
to authenticated;

grant select on public.student_dashboard_overall_attendance
to authenticated;

grant select on public.student_dashboard_attendance_trend
to authenticated;

grant select on public.student_dashboard_subject_attendance
to authenticated;

grant select on public.student_dashboard_timetable
to authenticated;

grant select on public.student_dashboard_today_timetable
to authenticated;

grant select on public.student_dashboard_upcoming_events
to authenticated;

grant select on public.student_dashboard_today_events
to authenticated;

grant select on public.student_dashboard_notices
to authenticated;

grant select on public.student_dashboard_announcements
to authenticated;

grant select on public.student_dashboard_attendance_status
to authenticated;

grant select on public.student_dashboard_recent_attendance
to authenticated;

grant select on public.student_dashboard_notification_count
to authenticated;

grant select on public.student_dashboard_summary
to authenticated;

grant select on public.student_dashboard_complete
to authenticated;


-- ============================================================
-- 23. RELOAD SUPABASE API SCHEMA
-- ============================================================

notify pgrst, 'reload schema';


-- ============================================================
-- END
-- ============================================================
