
-- Table for tracking individual step completion (theory, quiz, challenge) per topic
CREATE TABLE public.topic_step_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  language TEXT NOT NULL,
  level INTEGER NOT NULL,
  step TEXT NOT NULL CHECK (step IN ('theory', 'quiz', 'challenge')),
  completed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, language, level, step)
);

ALTER TABLE public.topic_step_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own step progress"
  ON public.topic_step_progress FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own step progress"
  ON public.topic_step_progress FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Table for certificates
CREATE TABLE public.certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  language TEXT NOT NULL,
  course_name TEXT NOT NULL,
  student_name TEXT NOT NULL,
  certificate_id TEXT NOT NULL UNIQUE,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, language)
);

ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own certificates"
  ON public.certificates FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own certificates"
  ON public.certificates FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);
