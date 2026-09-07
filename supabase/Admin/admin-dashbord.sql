-- ============================================================
-- ADMIN DASHBOARD REPORTING
-- EduManage - School & College Management System
--
-- PURPOSE:
--   Read-only reporting/aggregation for the Admin Dashboard.
--
-- IMPORTANT:
--   This file does NOT create management tables.
--   It creates reporting views over existing tables.
--
-- VERIFIED TABLES USED:
--   students
--   teachers
--   school_classes
--   class_sections
--   subjects
--   student_attendance
--   staff_attendance
--   notices
--   announcements
--   events
--
-- Academic-year source:
--   school_classes.academic_year
--
-- Attendance statuses:
--   present
--   absent
--   late
--   leave
--
-- Communication dates:
--   notices.date
--   announcements.date
--   events.date
--
-- ============================================================


-- ============================================================
-- 0. HELPER FUNCTION
-- ============================================================

create or replace function public.get_current_academic_year()
returns text
language sql
stable
as $$
  select coalesce(
    (
      select academic_year
      from public.school_classes
      where status = 'active'
      order by academic_year desc
      limit 1
    ),
    case
      when extract(month from current_date) >= 4
        then extract(year from current_date)::integer::text
             || '-'
             || (extract(year from current_date)::integer + 1)::text
      else
        (extract(year from current_date)::integer - 1)::text
        || '-'
        || extract(year from current_date)::integer::text
    end
  );
$$;


-- ============================================================
-- 1. MAIN DASHBOARD STATISTICS
-- ============================================================

create or replace view public.admin_dashboard_statistics
with (security_invoker = true)
as
select
  (
    select count(*)
    from public.students
    where status = 'active'
  )::bigint as active_students,

  (
    select count(*)
    from public.students
  )::bigint as total_students,

  (
    select count(*)
    from public.teachers
    where status = 'active'
  )::bigint as active_teachers,

  (
    select count(*)
    from public.teachers
  )::bigint as total_teachers,

  (
    select count(*)
    from public.school_classes
    where status = 'active'
  )::bigint as active_classes,

  (
    select count(*)
    from public.class_sections
    where status = 'active'
  )::bigint as active_sections,

  (
    select count(*)
    from public.subjects
    where status = 'active'
  )::bigint as active_subjects,

  (
    select count(*)
    from public.notices
    where status = 'published'
  )::bigint as published_notices,

  (
    select count(*)
    from public.announcements
    where status = 'published'
  )::bigint as published_announcements,

  (
    select count(*)
    from public.events
    where status = 'published'
  )::bigint as published_events,

  public.get_current_academic_year() as academic_year;


-- ============================================================
-- 2. SCHOOL OVERVIEW
-- ============================================================

create or replace view public.admin_dashboard_school_overview
with (security_invoker = true)
as
select
  public.get_current_academic_year() as academic_year,

  (
    select count(*)
    from public.students
    where status = 'active'
  )::bigint as students,

  (
    select count(*)
    from public.teachers
    where status = 'active'
  )::bigint as teachers,

  (
    select count(*)
    from public.school_classes
    where status = 'active'
  )::bigint as classes,

  (
    select count(*)
    from public.class_sections
    where status = 'active'
  )::bigint as sections,

  (
    select count(*)
    from public.subjects
    where status = 'active'
  )::bigint as subjects;


-- ============================================================
-- 3. STUDENTS BY CLASS
-- ============================================================

create or replace view public.admin_dashboard_students_by_class
with (security_invoker = true)
as
select
  sc.id as class_id,
  sc.class_name,
  sc.class_code,
  sc.academic_year,
  count(s.id)::bigint as total_students,
  count(s.id) filter (
    where s.status = 'active'
  )::bigint as active_students,
  count(s.id) filter (
    where s.status <> 'active'
  )::bigint as inactive_students
from public.school_classes sc
left join public.students s
  on s.class_id = sc.id
where sc.status = 'active'
group by
  sc.id,
  sc.class_name,
  sc.class_code,
  sc.academic_year
order by
  sc.class_name;


-- ============================================================
-- 4. STUDENTS BY SECTION
-- ============================================================

create or replace view public.admin_dashboard_students_by_section
with (security_invoker = true)
as
select
  cs.id as section_id,
  cs.class_id,
  sc.class_name,
  cs.section_name,
  cs.capacity,
  cs.status as section_status,
  count(s.id)::bigint as total_students,
  count(s.id) filter (
    where s.status = 'active'
  )::bigint as active_students,

  greatest(
    cs.capacity - count(s.id) filter (
      where s.status = 'active'
    ),
    0
  )::bigint as available_capacity

from public.class_sections cs

join public.school_classes sc
  on sc.id = cs.class_id

left join public.students s
  on s.section_id = cs.id

where cs.status = 'active'

group by
  cs.id,
  cs.class_id,
  sc.class_name,
  cs.section_name,
  cs.capacity,
  cs.status

order by
  sc.class_name,
  cs.section_name;


-- ============================================================
-- 5. STUDENT GENDER DISTRIBUTION
-- ============================================================

create or replace view public.admin_dashboard_student_gender
with (security_invoker = true)
as
select
  coalesce(gender, 'not_specified') as gender,
  count(*)::bigint as total_students
from public.students
where status = 'active'
group by gender
order by total_students desc;


-- ============================================================
-- 6. STUDENT CATEGORY DISTRIBUTION
-- ============================================================

create or replace view public.admin_dashboard_student_category
with (security_invoker = true)
as
select
  coalesce(nullif(trim(category), ''), 'Not Specified') as category,
  count(*)::bigint as total_students
from public.students
where status = 'active'
group by category
order by total_students desc;


-- ============================================================
-- 7. RTE STUDENTS
-- ============================================================

create or replace view public.admin_dashboard_rte_students
with (security_invoker = true)
as
select
  count(*) filter (
    where rte = true
  )::bigint as rte_students,

  count(*) filter (
    where rte = false
  )::bigint as non_rte_students,

  count(*)::bigint as total_students

from public.students
where status = 'active';


-- ============================================================
-- 8. ADMISSIONS SUMMARY
-- ============================================================

create or replace view public.admin_dashboard_admissions_summary
with (security_invoker = true)
as
select
  admission_year,
  count(*)::bigint as total_admissions,
  count(*) filter (
    where status = 'active'
  )::bigint as active_students,
  count(*) filter (
    where status = 'transferred'
  )::bigint as transferred_students,
  count(*) filter (
    where status = 'graduated'
  )::bigint as graduated_students,
  count(*) filter (
    where status = 'alumni'
  )::bigint as alumni_students
from public.students
group by admission_year
order by admission_year desc;


-- ============================================================
-- 9. CURRENT YEAR ADMISSIONS
-- ============================================================

create or replace view public.admin_dashboard_current_admissions
with (security_invoker = true)
as
select
  count(*)::bigint as total_admissions,

  count(*) filter (
    where status = 'active'
  )::bigint as active_admissions,

  count(*) filter (
    where gender = 'male'
  )::bigint as male_students,

  count(*) filter (
    where gender = 'female'
  )::bigint as female_students,

  count(*) filter (
    where gender = 'other'
  )::bigint as other_students

from public.students
where admission_year =
  extract(year from current_date)::integer;


-- ============================================================
-- 10. TODAY'S STUDENT ATTENDANCE
-- ============================================================

create or replace view public.admin_dashboard_today_attendance
with (security_invoker = true)
as
select
  current_date as attendance_date,

  count(*)::bigint as total_records,

  count(*) filter (
    where status = 'present'
  )::bigint as present_count,

  count(*) filter (
    where status = 'absent'
  )::bigint as absent_count,

  count(*) filter (
    where status = 'late'
  )::bigint as late_count,

  count(*) filter (
    where status = 'leave'
  )::bigint as leave_count,

  round(
    (
      count(*) filter (
        where status in ('present', 'late')
      )::numeric
      /
      nullif(count(*), 0)
    ) * 100,
    2
  ) as attendance_percentage

from public.student_attendance
where attendance_date = current_date;


-- ============================================================
-- 11. ATTENDANCE STATUS DISTRIBUTION
-- ============================================================

create or replace view public.admin_dashboard_attendance_status
with (security_invoker = true)
as
select
  status,
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

from public.student_attendance

group by status

order by total_records desc;


-- ============================================================
-- 12. DAILY ATTENDANCE TREND - LAST 30 DAYS
-- ============================================================

create or replace view public.admin_dashboard_attendance_trend
with (security_invoker = true)
as
select
  attendance_date,

  count(*)::bigint as total_records,

  count(*) filter (
    where status = 'present'
  )::bigint as present_count,

  count(*) filter (
    where status = 'absent'
  )::bigint as absent_count,

  count(*) filter (
    where status = 'late'
  )::bigint as late_count,

  count(*) filter (
    where status = 'leave'
  )::bigint as leave_count,

  round(
    (
      count(*) filter (
        where status in ('present', 'late')
      )::numeric
      /
      nullif(count(*), 0)
    ) * 100,
    2
  ) as attendance_percentage

from public.student_attendance

where attendance_date >= current_date - interval '29 days'
  and attendance_date <= current_date

group by attendance_date

order by attendance_date;


-- ============================================================
-- 13. CLASS-WISE TODAY ATTENDANCE
-- ============================================================

create or replace view public.admin_dashboard_class_attendance
with (security_invoker = true)
as
select
  sc.id as class_id,
  sc.class_name,
  cs.id as section_id,
  cs.section_name,

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

from public.school_classes sc

join public.class_sections cs
  on cs.class_id = sc.id

left join public.student_attendance sa
  on sa.class_id = sc.id
  and sa.section_id = cs.id
  and sa.attendance_date = current_date

where sc.status = 'active'
  and cs.status = 'active'

group by
  sc.id,
  sc.class_name,
  cs.id,
  cs.section_name

order by
  sc.class_name,
  cs.section_name;


-- ============================================================
-- 14. STUDENT ATTENDANCE SUMMARY
-- ============================================================

create or replace view public.admin_dashboard_student_attendance_summary
with (security_invoker = true)
as
select
  sa.student_id,

  s.admission_number,

  concat_ws(
    ' ',
    s.first_name,
    s.middle_name,
    s.last_name
  ) as student_name,

  sa.class_id,
  sc.class_name,

  sa.section_id,
  cs.section_name,

  count(*)::bigint as total_records,

  count(*) filter (
    where sa.status = 'present'
  )::bigint as present_count,

  count(*) filter (
    where sa.status = 'absent'
  )::bigint as absent_count,

  count(*) filter (
    where sa.status = 'late'
  )::bigint as late_count,

  count(*) filter (
    where sa.status = 'leave'
  )::bigint as leave_count,

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

left join public.school_classes sc
  on sc.id = sa.class_id

left join public.class_sections cs
  on cs.id = sa.section_id

group by
  sa.student_id,
  s.admission_number,
  s.first_name,
  s.middle_name,
  s.last_name,
  sa.class_id,
  sc.class_name,
  sa.section_id,
  cs.section_name;


-- ============================================================
-- 15. LOW ATTENDANCE STUDENTS
-- Threshold: below 75%
-- ============================================================

create or replace view public.admin_dashboard_low_attendance
with (security_invoker = true)
as
select
  student_id,
  admission_number,
  student_name,
  class_id,
  class_name,
  section_id,
  section_name,
  total_records,
  present_count,
  absent_count,
  late_count,
  leave_count,
  attendance_percentage
from public.admin_dashboard_student_attendance_summary
where attendance_percentage < 75
order by
  attendance_percentage asc,
  student_name;


-- ============================================================
-- 16. TEACHER / STAFF ATTENDANCE TODAY
-- ============================================================

create or replace view public.admin_dashboard_staff_attendance
with (security_invoker = true)
as
select
  current_date as attendance_date,

  count(*)::bigint as total_records,

  count(*) filter (
    where status = 'present'
  )::bigint as present_count,

  count(*) filter (
    where status = 'absent'
  )::bigint as absent_count,

  count(*) filter (
    where status = 'late'
  )::bigint as late_count,

  count(*) filter (
    where status = 'leave'
  )::bigint as leave_count,

  round(
    (
      count(*) filter (
        where status in ('present', 'late')
      )::numeric
      /
      nullif(count(*), 0)
    ) * 100,
    2
  ) as attendance_percentage

from public.staff_attendance
where date = current_date;


-- ============================================================
-- 17. TEACHER ATTENDANCE SUMMARY
-- ============================================================

create or replace view public.admin_dashboard_teacher_attendance
with (security_invoker = true)
as
select
  sa.teacher_id,

  concat_ws(
    ' ',
    t.first_name,
    t.last_name
  ) as teacher_name,

  t.email,
  t.subject as primary_subject,

  count(*)::bigint as total_records,

  count(*) filter (
    where sa.status = 'present'
  )::bigint as present_count,

  count(*) filter (
    where sa.status = 'absent'
  )::bigint as absent_count,

  count(*) filter (
    where sa.status = 'late'
  )::bigint as late_count,

  count(*) filter (
    where sa.status = 'leave'
  )::bigint as leave_count,

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
  t.email,
  t.subject;


-- ============================================================
-- 18. SUBJECT DISTRIBUTION
-- ============================================================

create or replace view public.admin_dashboard_subject_distribution
with (security_invoker = true)
as
select
  s.id as subject_id,
  s.subject_name,
  s.subject_code,
  s.subject_type,
  s.status,

  count(cs.id)::bigint as classes_using_subject

from public.subjects s

left join public.class_subjects cs
  on cs.subject_id = s.id
  and cs.status = 'active'

group by
  s.id,
  s.subject_name,
  s.subject_code,
  s.subject_type,
  s.status

order by
  s.subject_name;


-- ============================================================
-- 19. ACTIVE SUBJECT COUNT BY TYPE
-- ============================================================

create or replace view public.admin_dashboard_subject_types
with (security_invoker = true)
as
select
  subject_type,
  count(*)::bigint as total_subjects
from public.subjects
where status = 'active'
group by subject_type
order by total_subjects desc;


-- ============================================================
-- 20. TEACHER SUBJECT DISTRIBUTION
-- ============================================================

create or replace view public.admin_dashboard_teacher_subjects
with (security_invoker = true)
as
select
  subject,
  count(*)::bigint as total_teachers,
  count(*) filter (
    where status = 'active'
  )::bigint as active_teachers
from public.teachers
group by subject
order by total_teachers desc;


-- ============================================================
-- 21. TEACHER STATUS
-- ============================================================

create or replace view public.admin_dashboard_teacher_status
with (security_invoker = true)
as
select
  status,
  count(*)::bigint as total_teachers
from public.teachers
group by status
order by total_teachers desc;


-- ============================================================
-- 22. CLASS CAPACITY
-- ============================================================

create or replace view public.admin_dashboard_class_capacity
with (security_invoker = true)
as
select
  sc.id as class_id,
  sc.class_name,
  cs.id as section_id,
  cs.section_name,
  cs.capacity,

  count(s.id) filter (
    where s.status = 'active'
  )::bigint as enrolled_students,

  greatest(
    cs.capacity -
    count(s.id) filter (
      where s.status = 'active'
    ),
    0
  )::bigint as available_seats,

  case
    when cs.capacity > 0
    then round(
      (
        count(s.id) filter (
          where s.status = 'active'
        )::numeric
        / cs.capacity
      ) * 100,
      2
    )
    else 0
  end as occupancy_percentage

from public.class_sections cs

join public.school_classes sc
  on sc.id = cs.class_id

left join public.students s
  on s.section_id = cs.id

where sc.status = 'active'
  and cs.status = 'active'

group by
  sc.id,
  sc.class_name,
  cs.id,
  cs.section_name,
  cs.capacity

order by
  sc.class_name,
  cs.section_name;


-- ============================================================
-- 23. RECENT STUDENTS
-- ============================================================

create or replace view public.admin_dashboard_recent_students
with (security_invoker = true)
as
select
  s.id,
  s.admission_number,

  concat_ws(
    ' ',
    s.first_name,
    s.middle_name,
    s.last_name
  ) as student_name,

  s.email,
  s.phone,
  s.class_id,
  sc.class_name,
  s.section_id,
  cs.section_name,
  s.admission_year,
  s.admission_date,
  s.status,
  s.created_at

from public.students s

left join public.school_classes sc
  on sc.id = s.class_id

left join public.class_sections cs
  on cs.id = s.section_id

order by s.created_at desc
limit 10;


-- ============================================================
-- 24. PUBLISHED NOTICES
-- ============================================================

create or replace view public.admin_dashboard_notices
with (security_invoker = true)
as
select
  id,
  title,
  category,
  date,
  status,
  priority,
  created_at,
  updated_at
from public.notices
where status = 'published'
order by
  date desc,
  created_at desc;


-- ============================================================
-- 25. RECENT NOTICES
-- ============================================================

create or replace view public.admin_dashboard_recent_notices
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
  created_at,
  updated_at
from public.notices
order by
  date desc,
  created_at desc
limit 10;


-- ============================================================
-- 26. NOTICE SUMMARY
-- ============================================================

create or replace view public.admin_dashboard_notice_summary
with (security_invoker = true)
as
select
  status,
  priority,
  count(*)::bigint as total_notices
from public.notices
group by
  status,
  priority
order by
  status,
  priority;


-- ============================================================
-- 27. ANNOUNCEMENT SUMMARY
-- ============================================================

create or replace view public.admin_dashboard_announcement_summary
with (security_invoker = true)
as
select
  status,
  audience,
  count(*)::bigint as total_announcements
from public.announcements
group by
  status,
  audience
order by
  status,
  audience;


-- ============================================================
-- 28. RECENT ANNOUNCEMENTS
-- ============================================================

create or replace view public.admin_dashboard_recent_announcements
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
  created_at,
  updated_at
from public.announcements
order by
  date desc,
  created_at desc
limit 10;


-- ============================================================
-- 29. PUBLISHED EVENTS
-- ============================================================

create or replace view public.admin_dashboard_events
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
  created_at,
  updated_at
from public.events
where status = 'published'
order by
  date asc,
  created_at asc;


-- ============================================================
-- 30. EVENT SUMMARY
-- ============================================================

create or replace view public.admin_dashboard_event_summary
with (security_invoker = true)
as
select
  status,
  count(*)::bigint as total_events
from public.events
group by status
order by total_events desc;


-- ============================================================
-- 31. TODAY'S EVENTS
-- ============================================================

create or replace view public.admin_dashboard_today_events
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
where date = current_date
order by
  time nulls last,
  created_at asc;


-- ============================================================
-- 32. UPCOMING EVENTS
-- ============================================================

create or replace view public.admin_dashboard_upcoming_events
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
where date >= current_date
  and status = 'published'
order by
  date asc,
  time nulls last
limit 10;


-- ============================================================
-- 33. RECENT EVENTS
-- ============================================================

create or replace view public.admin_dashboard_recent_events
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
  created_at
from public.events
order by
  date desc,
  created_at desc
limit 10;


-- ============================================================
-- 34. COMMUNICATION OVERVIEW
-- ============================================================

create or replace view public.admin_dashboard_communication_overview
with (security_invoker = true)
as
select
  (
    select count(*)
    from public.notices
    where status = 'published'
  )::bigint as published_notices,

  (
    select count(*)
    from public.announcements
    where status = 'published'
  )::bigint as published_announcements,

  (
    select count(*)
    from public.events
    where status = 'published'
  )::bigint as published_events,

  (
    select count(*)
    from public.events
    where status = 'published'
      and date >= current_date
  )::bigint as upcoming_events;


-- ============================================================
-- 35. QUICK COUNTS
-- ============================================================

create or replace view public.admin_dashboard_quick_counts
with (security_invoker = true)
as
select
  (
    select count(*)
    from public.students
    where status = 'active'
  )::bigint as students,

  (
    select count(*)
    from public.teachers
    where status = 'active'
  )::bigint as teachers,

  (
    select count(*)
    from public.school_classes
    where status = 'active'
  )::bigint as classes,

  (
    select count(*)
    from public.class_sections
    where status = 'active'
  )::bigint as sections,

  (
    select count(*)
    from public.subjects
    where status = 'active'
  )::bigint as subjects,

  (
    select count(*)
    from public.notices
    where status = 'published'
  )::bigint as notices,

  (
    select count(*)
    from public.announcements
    where status = 'published'
  )::bigint as announcements,

  (
    select count(*)
    from public.events
    where status = 'published'
  )::bigint as events;


-- ============================================================
-- 36. ACADEMIC YEAR SUMMARY
-- ============================================================

create or replace view public.admin_dashboard_academic_year_summary
with (security_invoker = true)
as
select
  sc.academic_year,

  count(distinct sc.id)::bigint as total_classes,

  count(distinct cs.id)::bigint as total_sections,

  count(distinct s.id)::bigint as total_students,

  count(distinct s.id) filter (
    where s.status = 'active'
  )::bigint as active_students

from public.school_classes sc

left join public.class_sections cs
  on cs.class_id = sc.id

left join public.students s
  on s.class_id = sc.id

group by
  sc.academic_year

order by
  sc.academic_year desc;


-- ============================================================
-- 37. COMPLETE DASHBOARD SUMMARY
-- ============================================================

create or replace view public.admin_dashboard_complete_summary
with (security_invoker = true)
as
select
  public.get_current_academic_year() as academic_year,

  -- Students
  (
    select count(*)
    from public.students
    where status = 'active'
  )::bigint as active_students,

  (
    select count(*)
    from public.students
  )::bigint as total_students,

  -- Teachers
  (
    select count(*)
    from public.teachers
    where status = 'active'
  )::bigint as active_teachers,

  (
    select count(*)
    from public.teachers
  )::bigint as total_teachers,

  -- Academic structure
  (
    select count(*)
    from public.school_classes
    where status = 'active'
  )::bigint as active_classes,

  (
    select count(*)
    from public.class_sections
    where status = 'active'
  )::bigint as active_sections,

  (
    select count(*)
    from public.subjects
    where status = 'active'
  )::bigint as active_subjects,

  -- Communication
  (
    select count(*)
    from public.notices
    where status = 'published'
  )::bigint as published_notices,

  (
    select count(*)
    from public.announcements
    where status = 'published'
  )::bigint as published_announcements,

  (
    select count(*)
    from public.events
    where status = 'published'
  )::bigint as published_events,

  (
    select count(*)
    from public.events
    where status = 'published'
      and date >= current_date
  )::bigint as upcoming_events,

  -- Today's student attendance
  (
    select count(*)
    from public.student_attendance
    where attendance_date = current_date
  )::bigint as today_attendance_records,

  (
    select count(*)
    from public.student_attendance
    where attendance_date = current_date
      and status = 'present'
  )::bigint as today_present,

  (
    select count(*)
    from public.student_attendance
    where attendance_date = current_date
      and status = 'absent'
  )::bigint as today_absent,

  (
    select count(*)
    from public.student_attendance
    where attendance_date = current_date
      and status = 'late'
  )::bigint as today_late,

  (
    select count(*)
    from public.student_attendance
    where attendance_date = current_date
      and status = 'leave'
  )::bigint as today_leave;


-- ============================================================
-- 38. INDEXES FOR DASHBOARD QUERIES
-- ============================================================

create index if not exists students_status_idx
on public.students(status);

create index if not exists students_class_id_idx
on public.students(class_id);

create index if not exists students_section_id_idx
on public.students(section_id);

create index if not exists students_admission_year_idx
on public.students(admission_year);

create index if not exists teachers_status_idx
on public.teachers(status);

create index if not exists teachers_subject_idx
on public.teachers(subject);

create index if not exists school_classes_status_idx
on public.school_classes(status);

create index if not exists school_classes_academic_year_idx
on public.school_classes(academic_year);

create index if not exists class_sections_class_id_idx
on public.class_sections(class_id);

create index if not exists class_sections_status_idx
on public.class_sections(status);

create index if not exists subjects_status_idx
on public.subjects(status);

create index if not exists subjects_type_idx
on public.subjects(subject_type);

create index if not exists student_attendance_date_idx
on public.student_attendance(attendance_date);

create index if not exists student_attendance_class_date_idx
on public.student_attendance(class_id, attendance_date);

create index if not exists student_attendance_section_date_idx
on public.student_attendance(section_id, attendance_date);

create index if not exists student_attendance_student_date_idx
on public.student_attendance(student_id, attendance_date);

create index if not exists student_attendance_status_idx
on public.student_attendance(status);

create index if not exists staff_attendance_date_idx
on public.staff_attendance(date);

create index if not exists staff_attendance_teacher_date_idx
on public.staff_attendance(teacher_id, date);

-- Communication indexes already exist in communication-management.sql,
-- but IF NOT EXISTS makes these safe to run again.

create index if not exists notices_dashboard_date_idx
on public.notices(date desc);

create index if not exists notices_dashboard_status_date_idx
on public.notices(status, date desc);

create index if not exists announcements_dashboard_date_idx
on public.announcements(date desc);

create index if not exists announcements_dashboard_status_date_idx
on public.announcements(status, date desc);

create index if not exists events_dashboard_date_idx
on public.events(date asc);

create index if not exists events_dashboard_status_date_idx
on public.events(status, date asc);


-- ============================================================
-- 39. VIEW PERMISSIONS
-- ============================================================

grant select on public.admin_dashboard_statistics
to anon, authenticated;

grant select on public.admin_dashboard_school_overview
to anon, authenticated;

grant select on public.admin_dashboard_students_by_class
to anon, authenticated;

grant select on public.admin_dashboard_students_by_section
to anon, authenticated;

grant select on public.admin_dashboard_student_gender
to anon, authenticated;

grant select on public.admin_dashboard_student_category
to anon, authenticated;

grant select on public.admin_dashboard_rte_students
to anon, authenticated;

grant select on public.admin_dashboard_admissions_summary
to anon, authenticated;

grant select on public.admin_dashboard_current_admissions
to anon, authenticated;

grant select on public.admin_dashboard_today_attendance
to anon, authenticated;

grant select on public.admin_dashboard_attendance_status
to anon, authenticated;

grant select on public.admin_dashboard_attendance_trend
to anon, authenticated;

grant select on public.admin_dashboard_class_attendance
to anon, authenticated;

grant select on public.admin_dashboard_student_attendance_summary
to anon, authenticated;

grant select on public.admin_dashboard_low_attendance
to anon, authenticated;

grant select on public.admin_dashboard_staff_attendance
to anon, authenticated;

grant select on public.admin_dashboard_teacher_attendance
to anon, authenticated;

grant select on public.admin_dashboard_subject_distribution
to anon, authenticated;

grant select on public.admin_dashboard_subject_types
to anon, authenticated;

grant select on public.admin_dashboard_teacher_subjects
to anon, authenticated;

grant select on public.admin_dashboard_teacher_status
to anon, authenticated;

grant select on public.admin_dashboard_class_capacity
to anon, authenticated;

grant select on public.admin_dashboard_recent_students
to anon, authenticated;

grant select on public.admin_dashboard_notices
to anon, authenticated;

grant select on public.admin_dashboard_recent_notices
to anon, authenticated;

grant select on public.admin_dashboard_notice_summary
to anon, authenticated;

grant select on public.admin_dashboard_announcement_summary
to anon, authenticated;

grant select on public.admin_dashboard_recent_announcements
to anon, authenticated;

grant select on public.admin_dashboard_events
to anon, authenticated;

grant select on public.admin_dashboard_event_summary
to anon, authenticated;

grant select on public.admin_dashboard_today_events
to anon, authenticated;

grant select on public.admin_dashboard_upcoming_events
to anon, authenticated;

grant select on public.admin_dashboard_recent_events
to anon, authenticated;

grant select on public.admin_dashboard_communication_overview
to anon, authenticated;

grant select on public.admin_dashboard_quick_counts
to anon, authenticated;

grant select on public.admin_dashboard_academic_year_summary
to anon, authenticated;

grant select on public.admin_dashboard_complete_summary
to anon, authenticated;


-- ============================================================
-- 40. RELOAD SUPABASE DATA API SCHEMA
-- ============================================================

notify pgrst, 'reload schema';


-- ============================================================
-- END
-- ============================================================