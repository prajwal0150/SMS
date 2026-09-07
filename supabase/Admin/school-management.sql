-- ============================================================
-- SCHOOL MANAGEMENT
-- CLASS / SECTION / SUBJECT MANAGEMENT
-- ============================================================

-- ============================================================
-- 1. CLASSES
-- ============================================================

create table if not exists public.school_classes (
  id uuid primary key default gen_random_uuid(),

  class_name text not null,
  class_code text,

  academic_year text not null default '2026-2027',

  status text not null default 'active'
    check (status in ('active', 'inactive')),

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  unique (class_name, academic_year)
);


-- ============================================================
-- 2. SECTIONS
-- Each section belongs to one class
-- ============================================================

create table if not exists public.class_sections (
  id uuid primary key default gen_random_uuid(),

  class_id uuid not null
    references public.school_classes(id)
    on delete cascade,

  section_name text not null,

  class_teacher_id uuid
    references public.teachers(id)
    on delete set null,

  capacity integer not null default 50
    check (capacity > 0),

  status text not null default 'active'
    check (status in ('active', 'inactive')),

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  unique (class_id, section_name)
);


-- ============================================================
-- 3. SUBJECTS
-- Master list of subjects
-- ============================================================

create table if not exists public.subjects (
  id uuid primary key default gen_random_uuid(),

  subject_name text not null,
  subject_code text not null,

  description text,

  subject_type text not null default 'core'
    check (
      subject_type in (
        'core',
        'elective',
        'language',
        'practical',
        'activity'
      )
    ),

  status text not null default 'active'
    check (status in ('active', 'inactive')),

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  unique (subject_code)
);


-- ============================================================
-- 4. CLASS SUBJECTS
-- Defines which subjects belong to which class
-- ============================================================

create table if not exists public.class_subjects (
  id uuid primary key default gen_random_uuid(),

  class_id uuid not null
    references public.school_classes(id)
    on delete cascade,

  subject_id uuid not null
    references public.subjects(id)
    on delete cascade,

  is_compulsory boolean not null default true,

  weekly_periods integer not null default 5
    check (weekly_periods > 0),

  status text not null default 'active'
    check (status in ('active', 'inactive')),

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  unique (class_id, subject_id)
);


-- ============================================================
-- 5. INDEXES
-- ============================================================

create index if not exists school_classes_academic_year_idx
on public.school_classes(academic_year);

create index if not exists school_classes_status_idx
on public.school_classes(status);

create index if not exists class_sections_class_id_idx
on public.class_sections(class_id);

create index if not exists class_sections_teacher_id_idx
on public.class_sections(class_teacher_id);

create index if not exists class_sections_status_idx
on public.class_sections(status);

create index if not exists subjects_status_idx
on public.subjects(status);

create index if not exists class_subjects_class_id_idx
on public.class_subjects(class_id);

create index if not exists class_subjects_subject_id_idx
on public.class_subjects(subject_id);

create index if not exists class_subjects_status_idx
on public.class_subjects(status);


-- ============================================================
-- 6. ROW LEVEL SECURITY
-- Development/demo policies
-- ============================================================

alter table public.school_classes enable row level security;
alter table public.class_sections enable row level security;
alter table public.subjects enable row level security;
alter table public.class_subjects enable row level security;


-- Remove old policies if they already exist

drop policy if exists "school_classes_select" on public.school_classes;
drop policy if exists "school_classes_insert" on public.school_classes;
drop policy if exists "school_classes_update" on public.school_classes;
drop policy if exists "school_classes_delete" on public.school_classes;

drop policy if exists "class_sections_select" on public.class_sections;
drop policy if exists "class_sections_insert" on public.class_sections;
drop policy if exists "class_sections_update" on public.class_sections;
drop policy if exists "class_sections_delete" on public.class_sections;

drop policy if exists "subjects_select" on public.subjects;
drop policy if exists "subjects_insert" on public.subjects;
drop policy if exists "subjects_update" on public.subjects;
drop policy if exists "subjects_delete" on public.subjects;

drop policy if exists "class_subjects_select" on public.class_subjects;
drop policy if exists "class_subjects_insert" on public.class_subjects;
drop policy if exists "class_subjects_update" on public.class_subjects;
drop policy if exists "class_subjects_delete" on public.class_subjects;


-- ============================================================
-- 7. DEMO-OPEN POLICIES
-- ============================================================

create policy "school_classes_select"
on public.school_classes
for select
to anon, authenticated
using (true);

create policy "school_classes_insert"
on public.school_classes
for insert
to anon, authenticated
with check (true);

create policy "school_classes_update"
on public.school_classes
for update
to anon, authenticated
using (true)
with check (true);

create policy "school_classes_delete"
on public.school_classes
for delete
to anon, authenticated
using (true);


create policy "class_sections_select"
on public.class_sections
for select
to anon, authenticated
using (true);

create policy "class_sections_insert"
on public.class_sections
for insert
to anon, authenticated
with check (true);

create policy "class_sections_update"
on public.class_sections
for update
to anon, authenticated
using (true)
with check (true);

create policy "class_sections_delete"
on public.class_sections
for delete
to anon, authenticated
using (true);


create policy "subjects_select"
on public.subjects
for select
to anon, authenticated
using (true);

create policy "subjects_insert"
on public.subjects
for insert
to anon, authenticated
with check (true);

create policy "subjects_update"
on public.subjects
for update
to anon, authenticated
using (true)
with check (true);

create policy "subjects_delete"
on public.subjects
for delete
to anon, authenticated
using (true);


create policy "class_subjects_select"
on public.class_subjects
for select
to anon, authenticated
using (true);

create policy "class_subjects_insert"
on public.class_subjects
for insert
to anon, authenticated
with check (true);

create policy "class_subjects_update"
on public.class_subjects
for update
to anon, authenticated
using (true)
with check (true);

create policy "class_subjects_delete"
on public.class_subjects
for delete
to anon, authenticated
using (true);


-- ============================================================
-- 8. GRANTS
-- ============================================================

grant select, insert, update, delete
on public.school_classes
to anon, authenticated;

grant select, insert, update, delete
on public.class_sections
to anon, authenticated;

grant select, insert, update, delete
on public.subjects
to anon, authenticated;

grant select, insert, update, delete
on public.class_subjects
to anon, authenticated;


-- ============================================================
-- 9. SAMPLE CLASSES
-- ============================================================

insert into public.school_classes
  (class_name, class_code, academic_year)
values
  ('Class 1', 'C01', '2026-2027'),
  ('Class 2', 'C02', '2026-2027'),
  ('Class 3', 'C03', '2026-2027'),
  ('Class 4', 'C04', '2026-2027'),
  ('Class 5', 'C05', '2026-2027'),
  ('Class 6', 'C06', '2026-2027'),
  ('Class 7', 'C07', '2026-2027'),
  ('Class 8', 'C08', '2026-2027'),
  ('Class 9', 'C09', '2026-2027'),
  ('Class 10', 'C10', '2026-2027'),
  ('Class 11', 'C11', '2026-2027'),
  ('Class 12', 'C12', '2026-2027')
on conflict (class_name, academic_year)
do nothing;


-- ============================================================
-- 10. SAMPLE SUBJECTS
-- ============================================================

insert into public.subjects
  (subject_name, subject_code, subject_type)
values
  ('English', 'ENG', 'core'),
  ('Mathematics', 'MATH', 'core'),
  ('Science', 'SCI', 'core'),
  ('Social Science', 'SST', 'core'),
  ('Hindi', 'HIN', 'language'),
  ('Computer Science', 'COMP', 'practical'),
  ('Sanskrit', 'SANS', 'language'),
  ('Physics', 'PHY', 'core'),
  ('Chemistry', 'CHEM', 'core'),
  ('Biology', 'BIO', 'core'),
  ('Accountancy', 'ACC', 'core'),
  ('Business Studies', 'BST', 'core'),
  ('Economics', 'ECO', 'core')
on conflict (subject_code)
do nothing;


-- ============================================================
-- 11. SAMPLE SECTIONS
-- ============================================================

insert into public.class_sections
  (class_id, section_name, capacity)
select
  c.id,
  s.section_name,
  50
from public.school_classes c
cross join (
  values
    ('A'),
    ('B')
) as s(section_name)
where c.academic_year = '2026-2027'
on conflict (class_id, section_name)
do nothing;


-- ============================================================
-- 12. RELOAD SUPABASE SCHEMA CACHE
-- ============================================================

notify pgrst, 'reload schema';