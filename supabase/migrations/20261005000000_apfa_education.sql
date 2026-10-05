create table if not exists public.education_subjects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  position integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.education_courses (
  id uuid primary key default gen_random_uuid(),
  subject_id uuid not null references public.education_subjects(id) on delete cascade,
  title text not null,
  slug text not null unique,
  description text,
  position integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.education_lessons (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.education_courses(id) on delete cascade,
  title text not null,
  slug text not null,
  content text not null,
  position integer not null default 0,
  created_at timestamptz not null default now(),
  unique(course_id, slug)
);

create table if not exists public.education_lesson_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  lesson_id uuid not null references public.education_lessons(id) on delete cascade,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, lesson_id)
);

create index if not exists education_courses_subject_id_idx
  on public.education_courses(subject_id);

create index if not exists education_lessons_course_id_idx
  on public.education_lessons(course_id);

create index if not exists education_lesson_progress_user_id_idx
  on public.education_lesson_progress(user_id);

create index if not exists education_lesson_progress_lesson_id_idx
  on public.education_lesson_progress(lesson_id);

alter table public.education_subjects enable row level security;
alter table public.education_courses enable row level security;
alter table public.education_lessons enable row level security;
alter table public.education_lesson_progress enable row level security;

create policy "education subjects are publicly readable"
on public.education_subjects
for select
to anon, authenticated
using (true);

create policy "education courses are publicly readable"
on public.education_courses
for select
to anon, authenticated
using (true);

create policy "education lessons are publicly readable"
on public.education_lessons
for select
to anon, authenticated
using (true);
