insert into public.education_subjects (name, slug, description, position)
values
  (
    'Data & Computing',
    'data-computing',
    'Data science, computing, and practical data skills.',
    1
  ),
  (
    'Artificial Intelligence',
    'artificial-intelligence',
    'Artificial intelligence, machine learning, and generative AI.',
    2
  ),
  (
    'Cybersecurity',
    'cybersecurity',
    'Foundational cybersecurity knowledge and practical security skills.',
    3
  )
on conflict (slug) do update
set
  name = excluded.name,
  description = excluded.description,
  position = excluded.position;

insert into public.education_courses
  (subject_id, title, slug, description, position)
select
  s.id,
  v.title,
  v.slug,
  v.description,
  v.position
from (
  values
    (
      'data-computing',
      'Data Science for Beginners',
      'data-science',
      'Data Science for Beginners - A Curriculum',
      1
    ),
    (
      'artificial-intelligence',
      'Artificial Intelligence for Beginners',
      'artificial-intelligence',
      'Artificial Intelligence for Beginners - A Curriculum',
      1
    ),
    (
      'artificial-intelligence',
      'Machine Learning for Beginners',
      'machine-learning',
      'Machine Learning for Beginners - A Curriculum',
      2
    ),
    (
      'artificial-intelligence',
      'Generative AI for Beginners',
      'generative-ai',
      'Generative AI for Beginners - A Course',
      3
    ),
    (
      'cybersecurity',
      'Cybersecurity for Beginners',
      'cybersecurity',
      'Cybersecurity for Beginners - A Curriculum',
      1
    )
) as v(subject_slug, title, slug, description, position)
join public.education_subjects s
  on s.slug = v.subject_slug
on conflict (slug) do update
set
  subject_id = excluded.subject_id,
  title = excluded.title,
  description = excluded.description,
  position = excluded.position;
