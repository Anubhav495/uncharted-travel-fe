CREATE TABLE IF NOT EXISTS public.provider_support_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    provider_name TEXT NOT NULL CHECK (char_length(btrim(provider_name)) BETWEEN 2 AND 100),
    provider_key TEXT NOT NULL CHECK (char_length(provider_key) BETWEEN 1 AND 200),
    trek_slug TEXT NOT NULL CHECK (char_length(trek_slug) BETWEEN 1 AND 80),
    notes TEXT CHECK (char_length(notes) <= 1000),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewing', 'supported', 'declined')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    UNIQUE (user_id, provider_key)
);

ALTER TABLE public.provider_support_requests ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.provider_support_requests FROM anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON public.provider_support_requests TO service_role;
