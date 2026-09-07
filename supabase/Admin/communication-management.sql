-- ============================================================
-- COMMUNICATION MANAGEMENT
-- EduManage - School & College Management System
--
-- Includes:
--   1. Notices
--   2. Announcements
--   3. Events
-- ============================================================


-- ============================================================
-- NOTICES
-- ============================================================

create table if not exists public.notices (

  id uuid primary key default gen_random_uuid(),

  title text not null,

  body text not null,

  category text not null default 'General'
    check (
      category in (
        'General',
        'Academic',
        'Event',
        'Staff'
      )
    ),

  date date not null,

  status text not null default 'published'
    check (
      status in (
        'draft',
        'published',
        'scheduled',
        'archived'
      )
    ),

  priority text not null default 'normal'
    check (
      priority in (
        'low',
        'normal',
        'high',
        'urgent'
      )
    ),

  attachment_url text,

  attachment_name text,

  created_by uuid references auth.users(id)
    on delete set null,

  created_at timestamptz not null default now(),

  updated_at timestamptz not null default now()
);


-- ============================================================
-- ANNOUNCEMENTS
-- ============================================================

create table if not exists public.announcements (

  id uuid primary key default gen_random_uuid(),

  title text not null,

  body text not null,

  audience text not null default 'All'
    check (
      audience in (
        'All',
        'Students',
        'Teachers',
        'Parents'
      )
    ),

  date date not null,

  status text not null default 'published'
    check (
      status in (
        'draft',
        'published',
        'scheduled',
        'archived'
      )
    ),

  priority text not null default 'normal'
    check (
      priority in (
        'low',
        'normal',
        'high',
        'urgent'
      )
    ),

  attachment_url text,

  attachment_name text,

  created_by uuid references auth.users(id)
    on delete set null,

  created_at timestamptz not null default now(),

  updated_at timestamptz not null default now()
);


-- ============================================================
-- EVENTS
-- ============================================================

create table if not exists public.events (

  id uuid primary key default gen_random_uuid(),

  title text not null,

  description text,

  date date not null,

  time text,

  location text,

  status text not null default 'published'
    check (
      status in (
        'draft',
        'published',
        'scheduled',
        'cancelled',
        'completed'
      )
    ),

  organizer text,

  attachment_url text,

  attachment_name text,

  created_by uuid references auth.users(id)
    on delete set null,

  created_at timestamptz not null default now(),

  updated_at timestamptz not null default now()
);


-- ============================================================
-- INDEXES
-- ============================================================

create index if not exists notices_date_idx
on public.notices(date desc);

create index if not exists notices_category_idx
on public.notices(category);

create index if not exists notices_status_idx
on public.notices(status);


create index if not exists announcements_date_idx
on public.announcements(date desc);

create index if not exists announcements_audience_idx
on public.announcements(audience);

create index if not exists announcements_status_idx
on public.announcements(status);


create index if not exists events_date_idx
on public.events(date asc);

create index if not exists events_status_idx
on public.events(status);


-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table public.notices enable row level security;

alter table public.announcements enable row level security;

alter table public.events enable row level security;


-- ============================================================
-- REMOVE OLD POLICIES
-- This allows you to safely run this SQL again.
-- ============================================================

drop policy if exists "notices_select"
on public.notices;

drop policy if exists "notices_insert"
on public.notices;

drop policy if exists "notices_update"
on public.notices;

drop policy if exists "notices_delete"
on public.notices;


drop policy if exists "announcements_select"
on public.announcements;

drop policy if exists "announcements_insert"
on public.announcements;

drop policy if exists "announcements_update"
on public.announcements;

drop policy if exists "announcements_delete"
on public.announcements;


drop policy if exists "events_select"
on public.events;

drop policy if exists "events_insert"
on public.events;

drop policy if exists "events_update"
on public.events;

drop policy if exists "events_delete"
on public.events;


-- ============================================================
-- NOTICES POLICIES
-- Demo stage
-- ============================================================

create policy "notices_select"
on public.notices
for select
to anon, authenticated
using (true);


create policy "notices_insert"
on public.notices
for insert
to anon, authenticated
with check (true);


create policy "notices_update"
on public.notices
for update
to anon, authenticated
using (true)
with check (true);


create policy "notices_delete"
on public.notices
for delete
to anon, authenticated
using (true);


-- ============================================================
-- ANNOUNCEMENTS POLICIES
-- ============================================================

create policy "announcements_select"
on public.announcements
for select
to anon, authenticated
using (true);


create policy "announcements_insert"
on public.announcements
for insert
to anon, authenticated
with check (true);


create policy "announcements_update"
on public.announcements
for update
to anon, authenticated
using (true)
with check (true);


create policy "announcements_delete"
on public.announcements
for delete
to anon, authenticated
using (true);


-- ============================================================
-- EVENTS POLICIES
-- ============================================================

create policy "events_select"
on public.events
for select
to anon, authenticated
using (true);


create policy "events_insert"
on public.events
for insert
to anon, authenticated
with check (true);


create policy "events_update"
on public.events
for update
to anon, authenticated
using (true)
with check (true);


create policy "events_delete"
on public.events
for delete
to anon, authenticated
using (true);


-- ============================================================
-- DATA API PERMISSIONS
-- ============================================================

grant usage on schema public
to anon, authenticated;


grant select, insert, update, delete
on public.notices
to anon, authenticated;


grant select, insert, update, delete
on public.announcements
to anon, authenticated;


grant select, insert, update, delete
on public.events
to anon, authenticated;


-- ============================================================
-- SEED DATA (optional)
-- ============================================================

insert into public.notices
  (title, body, category, date, status, priority)
values
  ('Parent-Teacher Meeting',
   'Annual parent-teacher meeting for all senior classes. Please ensure all grade sheetsand attendance records are up to date.',
   'Event', '2026-09-06', 'published', 'normal'),
  ('Staff Meeting - Friday',
   'Weekly staff meeting in the faculty lounge at 3 PM. Agenda: term plan and examination schedule.',
   'Staff', '2026-09-04', 'published', 'normal'),
  ('Mid-Term Exam Schedule',
   'Mid-term examinations start in late September. Submit question papers by mid-September.',
   'Academic', '2026-09-01', 'published', 'high'),
  ('Science Fair Registration',
   'Register your students for the annual science fair before mid-September.',
   'General', '2026-08-28', 'published', 'low')
on conflict do nothing;


insert into public.announcements
  (title, body, audience, date, status, priority)
values
  ('New Library Timings',
   'The school library remains open until evening on all working days from this week onwards.',
   'All', '2026-09-05', 'published', 'normal'),
  ('Sports Day Practice',
   'All students participating in Sports Day must attend the evening practice sessions.',
   'Students', '2026-09-03', 'published', 'normal'),
  ('Fee Payment Reminder',
   'Kindly clear the second installment fee before the end of September to avoid late charges.',
   'Parents', '2026-09-02', 'published', 'high'),
  ('Teacher Training Workshop',
   'There will be a professional development workshop on Saturday. Attendance is mandatory.',
   'Teachers', '2026-08-30', 'published', 'normal')
on conflict do nothing;


insert into public.events
  (title, description, date, time, location, status, organizer)
values
  ('Annual Sports Day',
   'Track and field events along with the march past ceremony.',
   '2026-09-18', '09:00', 'School Ground', 'published', 'Sports Department'),
  ('Science Exhibition',
   'Showcase of science projects by students from senior grades.',
   '2026-09-22', '10:30', 'Main Hall', 'published', 'Science Club'),
  ('Cultural Fest',
   'Annual cultural programme with music, dance and drama performances.',
   '2026-09-28', '17:00', 'Auditorium', 'published', 'Cultural Committee'),
  ('PTA Meeting',
   'Quarterly parent-teacher association meeting. All parents are requested to attend.',
   '2026-09-30', '15:00', 'Conference Room', 'published', 'PTA')
on conflict do nothing;


-- ============================================================
-- RELOAD SUPABASE API SCHEMA
-- ============================================================

notify pgrst, 'reload schema';
