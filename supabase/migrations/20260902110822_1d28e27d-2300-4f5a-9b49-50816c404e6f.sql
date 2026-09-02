CREATE TYPE public.app_role AS ENUM ('STUDENT','PARENT','COACH','ADMIN');
CREATE TYPE public.subscription_plan AS ENUM ('FREE','PREMIUM','ELITE');
CREATE TYPE public.subscription_status AS ENUM ('ACTIVE','EXPIRED','CANCELLED');
CREATE TYPE public.subject_enum AS ENUM ('MATHEMATICS','SCIENCE','ENGLISH','LANGUAGES','COMPUTER_STUDIES','PHYSICAL_EDUCATION');
CREATE TYPE public.level_enum AS ENUM ('BEGINNER','INTERMEDIATE','ADVANCED');

CREATE OR REPLACE FUNCTION public.update_updated_at_column() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$ LANGUAGE plpgsql SET search_path = public;

CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  full_name TEXT NOT NULL DEFAULT '',
  phone TEXT,
  date_of_birth DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own profile" ON public.profiles FOR ALL TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE TRIGGER profiles_updated BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  role public.app_role NOT NULL DEFAULT 'STUDENT',
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "read own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE TABLE public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users ON DELETE CASCADE,
  plan public.subscription_plan NOT NULL DEFAULT 'FREE',
  status public.subscription_status NOT NULL DEFAULT 'ACTIVE',
  start_date TIMESTAMPTZ NOT NULL DEFAULT now(),
  end_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.subscriptions TO authenticated;
GRANT ALL ON public.subscriptions TO service_role;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own subscription" ON public.subscriptions FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER subs_updated BEFORE UPDATE ON public.subscriptions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE FUNCTION public.handle_new_user() RETURNS TRIGGER
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, phone)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name',''), NEW.raw_user_meta_data->>'phone')
  ON CONFLICT (id) DO NOTHING;
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'STUDENT') ON CONFLICT DO NOTHING;
  INSERT INTO public.subscriptions (user_id) VALUES (NEW.id) ON CONFLICT DO NOTHING;
  RETURN NEW;
END; $$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE TABLE public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  subject public.subject_enum NOT NULL,
  level public.level_enum NOT NULL DEFAULT 'BEGINNER',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.courses TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.courses TO authenticated;
GRANT ALL ON public.courses TO service_role;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "courses public read" ON public.courses FOR SELECT USING (true);

CREATE TABLE public.lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES public.courses ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL DEFAULT '',
  video_url TEXT,
  "order" INT NOT NULL DEFAULT 1,
  duration INT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.lessons TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.lessons TO authenticated;
GRANT ALL ON public.lessons TO service_role;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "lessons public read" ON public.lessons FOR SELECT USING (true);

CREATE TABLE public.enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES public.courses ON DELETE CASCADE,
  progress REAL NOT NULL DEFAULT 0,
  completed BOOLEAN NOT NULL DEFAULT false,
  enrolled_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_accessed TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, course_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.enrollments TO authenticated;
GRANT ALL ON public.enrollments TO service_role;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own enrollments" ON public.enrollments FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES public.lessons ON DELETE CASCADE,
  completed BOOLEAN NOT NULL DEFAULT false,
  completed_at TIMESTAMPTZ,
  time_spent INT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, lesson_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.progress TO authenticated;
GRANT ALL ON public.progress TO service_role;
ALTER TABLE public.progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own progress" ON public.progress FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER progress_updated BEFORE UPDATE ON public.progress FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id UUID NOT NULL REFERENCES public.lessons ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  passing_score INT NOT NULL DEFAULT 70,
  time_limit INT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.quizzes TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.quizzes TO authenticated;
GRANT ALL ON public.quizzes TO service_role;
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "quizzes public read" ON public.quizzes FOR SELECT USING (true);

CREATE TABLE public.questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id UUID NOT NULL REFERENCES public.quizzes ON DELETE CASCADE,
  text TEXT NOT NULL,
  options TEXT[] NOT NULL DEFAULT '{}',
  correct_answer TEXT NOT NULL,
  explanation TEXT,
  "order" INT NOT NULL DEFAULT 1,
  points INT NOT NULL DEFAULT 1
);
GRANT SELECT ON public.questions TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.questions TO authenticated;
GRANT ALL ON public.questions TO service_role;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "questions public read" ON public.questions FOR SELECT USING (true);

CREATE TABLE public.quiz_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  quiz_id UUID NOT NULL REFERENCES public.quizzes ON DELETE CASCADE,
  score INT NOT NULL DEFAULT 0,
  passed BOOLEAN NOT NULL DEFAULT false,
  answers JSONB NOT NULL DEFAULT '{}',
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.quiz_attempts TO authenticated;
GRANT ALL ON public.quiz_attempts TO service_role;
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own attempts" ON public.quiz_attempts FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT INSERT ON public.contact_messages TO anon, authenticated;
GRANT ALL ON public.contact_messages TO service_role;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone can send message" ON public.contact_messages FOR INSERT WITH CHECK (true);

CREATE TABLE public.screening_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT,
  phone TEXT NOT NULL,
  age_group TEXT NOT NULL,
  date_of_birth DATE,
  position TEXT,
  guardian_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT INSERT ON public.screening_registrations TO anon, authenticated;
GRANT ALL ON public.screening_registrations TO service_role;
ALTER TABLE public.screening_registrations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone can register" ON public.screening_registrations FOR INSERT WITH CHECK (true);

INSERT INTO public.courses (id, title, description, subject, level) VALUES
 ('11111111-1111-4111-8111-111111111111','Mathematics','Numbers, algebra, geometry, and beyond.','MATHEMATICS','BEGINNER'),
 ('22222222-2222-4222-8222-222222222222','Science','Physics, chemistry, biology, and discovery.','SCIENCE','BEGINNER'),
 ('33333333-3333-4333-8333-333333333333','English','Language, literature, and communication.','ENGLISH','BEGINNER'),
 ('44444444-4444-4444-8444-444444444444','Languages','French, Spanish, and global communication.','LANGUAGES','BEGINNER'),
 ('55555555-5555-4555-8555-555555555555','Computer Studies','Coding, technology, and digital skills.','COMPUTER_STUDIES','BEGINNER');

INSERT INTO public.lessons (id, course_id, title, content, "order", duration) VALUES
 ('a1111111-1111-4111-8111-111111111111','11111111-1111-4111-8111-111111111111','Foundations of Algebra','Variables, expressions and solving simple equations step by step.',1,30),
 ('a1111111-1111-4111-8111-111111111112','11111111-1111-4111-8111-111111111111','Geometry Essentials','Angles, triangles, circles and the rules that govern them.',2,35),
 ('a2222222-2222-4222-8222-222222222221','22222222-2222-4222-8222-222222222222','Forces and Motion','Newton''s laws applied to sport, sprinting and ball flight.',1,30),
 ('a2222222-2222-4222-8222-222222222222','22222222-2222-4222-8222-222222222222','The Human Body','Muscles, energy systems and recovery for young athletes.',2,30),
 ('a3333333-3333-4333-8333-333333333331','33333333-3333-4333-8333-333333333333','Grammar Fundamentals','Sentence structure, tenses and clear written communication.',1,25),
 ('a3333333-3333-4333-8333-333333333332','33333333-3333-4333-8333-333333333333','Speaking with Confidence','Interviews, press conferences and public speaking.',2,25),
 ('a4444444-4444-4444-8444-444444444441','44444444-4444-4444-8444-444444444444','French for Footballers','Essential French for training abroad and trials in Europe.',1,30),
 ('a5555555-5555-4555-8555-555555555551','55555555-5555-4555-8555-555555555555','Digital Literacy','Computers, the internet and staying safe online.',1,25),
 ('a5555555-5555-4555-8555-555555555552','55555555-5555-4555-8555-555555555555','Intro to Coding','Your first lines of code and how software thinks.',2,40);

INSERT INTO public.quizzes (id, lesson_id, title, description, passing_score) VALUES
 ('b1111111-1111-4111-8111-111111111111','a1111111-1111-4111-8111-111111111111','Algebra Check','Test your grasp of basic algebra.',70),
 ('b2222222-2222-4222-8222-222222222221','a2222222-2222-4222-8222-222222222221','Forces Check','Test your grasp of forces and motion.',70);

INSERT INTO public.questions (quiz_id, text, options, correct_answer, "order") VALUES
 ('b1111111-1111-4111-8111-111111111111','Solve for x: 2x + 6 = 14', ARRAY['2','4','6','8'],'4',1),
 ('b1111111-1111-4111-8111-111111111111','Simplify: 3a + 5a', ARRAY['8a','15a','2a','a8'],'8a',2),
 ('b1111111-1111-4111-8111-111111111111','If x = 3, what is x squared?', ARRAY['6','9','12','3'],'9',3),
 ('b2222222-2222-4222-8222-222222222221','Which law states every action has an equal and opposite reaction?', ARRAY['First','Second','Third','Fourth'],'Third',1),
 ('b2222222-2222-4222-8222-222222222221','Force equals mass times what?', ARRAY['Velocity','Acceleration','Distance','Energy'],'Acceleration',2);