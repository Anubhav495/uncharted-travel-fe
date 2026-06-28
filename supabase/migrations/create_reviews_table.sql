-- Legacy bootstrap migration. The canonical definition is in ../schema.sql.
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    booking_id UUID NOT NULL UNIQUE REFERENCES public.booking_requests(id) ON DELETE CASCADE,
    provider_id TEXT NOT NULL,
    provider_type TEXT NOT NULL CHECK (provider_type IN ('guide', 'company')),
    rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT CHECK (char_length(comment) <= 2000)
);
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
