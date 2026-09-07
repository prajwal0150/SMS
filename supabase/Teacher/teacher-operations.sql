-- ============================================================
-- TEACHER OPERATIONS
-- EduManage - School & College Management System
--
-- Tables used by the teacher panel:
--   1. class_assignments  (homework / assignments created by teachers)
--   2. exam_results       (marks entered by teachers for exams)
-- ============================================================


-- ============================================================
-- 1. CLASS ASSIGNMENTS (homework / assignments)
-- ============================================================

create table if not exists public.class_assignments (

  id uuid primary key default gen_random_uuid(),

  teacher_id uuid
    not null
    references public.teachers(id)
    on delete cascade,

  title text not null,

  description text,

  class_name text not null,

  section text,

  subject text not null,

  due_date date not null,

  status text not null default 'Open'
    check (
      status in (
        'Open',
        'Grading',
        'Closed'
      )
    ),

  created_at timestamptz not null default now(),

  updated_at timestamptz not null default now()
);


create index if not exists class_assignments_teacher_idx
on public.class_assignments(teacher_id);

create index if not exists class_assignments_class_idx
on public.class_assignments(class_name);

create index if not exists class_assignments_section_idx
on public.class_assignments(section);

create index if not exists class_assignments_subject_idx
on public.class_assignments(subject);

create index if not exists class_assignments_due_date_idx
on public.class_assignments(due_date);


-- ============================================================
-- 2. EXAM RESULTS (marks entered by teachers)
-- ============================================================

create table if not exists public.exam_results (

  id uuid primary key default gen_random_uuid(),

  exam_id uuid
    not null
    references public.exams(id)
    on delete cascade,

  student_id uuid
    not null
    references public.students(id)
    on delete cascade,

  class_id uuid
    references public.school_classes(id)
    on delete set null,

  section_id uuid
    references public.class_sections(id)
    on delete set null,

  subject_id uuid
    references public.subjects(id)
    on delete set null,

  marks_obtained numeric not null default 0,

  total_marks numeric not null default 100,

  grade text,

  teacher_id uuid
    references public.teachers(id)
    on delete set null,

  created_at timestamptz not null default now(),

  updated_at timestamptz not null default now()
);


create index if not exists exam_results_exam_idx
on public.exam_results(exam_id);

create index if not exists exam_results_student_idx
on public.exam_results(student_id);

create index if not exists exam_results_class_idx
on public.exam_results(class_id);

create index if not exists exam_results_section_idx
on public.exam_results(section_id);

create index if not exists exam_results_subject_idx
on public.exam_results(subject_id);

create unique index if not exists
  exam_results_student_exam_subject_idx
on public.exam_results(student_id, exam_id, subject_id);


-- ============================================================
-- ROW LEVEL SECURITY (demo — permissive like the other modules)
-- ============================================================

alter table public.class_assignments enable row level security;

alter table public.exam_results enable row level security;


create policy "class_assignments_select"
on public.class_assignments
for select
to anon, authenticated
using (true);


create policy "class_assignments_insert"
on public.class_assignments
for insert
to anon, authenticated
with check (true);


create policy "class_assignments_update"
on public.class_assignments
for update
to anon, authenticated
using (true)
with check (true);


create policy "class_assignments_delete"
on public.class_assignments
for delete
to anon, authenticated
using (true);


create policy "exam_results_select"
on public.exam_results
for select
to anon, authenticated
using (true);


create policy "exam_results_insert"
on public.exam_results
for insert
to anon, authenticated
with check (true);


create policy "exam_results_update"
on public.exam_results
for update
to anon, authenticated
using (true)
with check (true);


create policy "exam_results_delete"
on public.exam_results
for delete
to anon, authenticated
using (true);


-- ============================================================
-- DATA API PERMISSIONS
-- ============================================================

grant usage on schema public
to anon, authenticated;


grant select, insert, update, delete
on public.class_assignments
to anon, authenticated;


grant select, insert, update, delete
on public.exam_results
to anon, authenticated;


-- ============================================================
-- RELOAD SUPABASE API SCHEMA
-- ============================================================

notify pgrst, 'reload schema';