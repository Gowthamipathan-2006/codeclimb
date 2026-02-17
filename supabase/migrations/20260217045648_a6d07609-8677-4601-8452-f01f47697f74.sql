
-- Cache table for AI-generated level content
CREATE TABLE public.level_content_cache (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  language TEXT NOT NULL,
  level INTEGER NOT NULL,
  content JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(language, level)
);

-- Public read access (content is the same for everyone)
ALTER TABLE public.level_content_cache ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Level content is publicly readable"
ON public.level_content_cache FOR SELECT
USING (true);
