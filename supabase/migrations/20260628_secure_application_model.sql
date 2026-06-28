-- Align the database with the NextAuth-backed server API model.

ALTER TABLE public.guides DROP COLUMN IF EXISTS password_hash;
ALTER TABLE public.guides ADD COLUMN IF NOT EXISTS nextauth_user_id UUID;
ALTER TABLE public.guides DROP CONSTRAINT IF EXISTS guides_nextauth_user_id_fkey;
ALTER TABLE public.guides
    ADD CONSTRAINT guides_nextauth_user_id_fkey
    FOREIGN KEY (nextauth_user_id) REFERENCES public.users(id) ON DELETE SET NULL NOT VALID;

DROP POLICY IF EXISTS "Enable insert for everyone" ON public.guides;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.guides;
DROP POLICY IF EXISTS "Enable insert for everyone" ON public.guide_treks;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.guide_treks;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;

ALTER TABLE public.booking_requests ADD COLUMN IF NOT EXISTS provider_id TEXT;
ALTER TABLE public.booking_requests ADD COLUMN IF NOT EXISTS provider_type TEXT;
ALTER TABLE public.booking_requests DROP CONSTRAINT IF EXISTS booking_requests_provider_id_fkey;
ALTER TABLE public.booking_requests
    ALTER COLUMN provider_id TYPE TEXT USING provider_id::TEXT;
ALTER TABLE public.booking_requests DROP CONSTRAINT IF EXISTS booking_requests_provider_type_check;
ALTER TABLE public.booking_requests
    ADD CONSTRAINT booking_requests_provider_type_check
    CHECK (provider_type IN ('guide', 'company') OR provider_type IS NULL);
ALTER TABLE public.booking_requests DROP CONSTRAINT IF EXISTS booking_requests_user_id_fkey;
ALTER TABLE public.booking_requests
    ADD CONSTRAINT booking_requests_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE NOT VALID;
DROP POLICY IF EXISTS "Enable insert for everyone" ON public.booking_requests;

CREATE UNIQUE INDEX IF NOT EXISTS booking_requests_one_pending_trek
    ON public.booking_requests (user_id, trek_title)
    WHERE status = 'pending';

UPDATE public.booking_requests SET provider_id = 'guide-pritam-negi'
WHERE provider_type = 'guide' AND provider_id = 'g2';
UPDATE public.booking_requests SET provider_id = 'guide-aatish'
WHERE provider_type = 'guide' AND provider_id = 'g3' AND trek_title ILIKE '%Kareri%';
UPDATE public.booking_requests SET provider_id = 'guide-kapil-rawat'
WHERE provider_type = 'guide' AND provider_id = 'g3';

ALTER TABLE public.reviews ADD COLUMN IF NOT EXISTS provider_id TEXT;
ALTER TABLE public.reviews ADD COLUMN IF NOT EXISTS provider_type TEXT;
ALTER TABLE public.reviews ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now());
ALTER TABLE public.reviews DROP CONSTRAINT IF EXISTS reviews_provider_id_fkey;
ALTER TABLE public.reviews
    ALTER COLUMN provider_id TYPE TEXT USING provider_id::TEXT;

-- Backfill provider data from the associated booking where possible.
UPDATE public.reviews AS review
SET provider_id = COALESCE(review.provider_id, booking.provider_id),
    provider_type = COALESCE(review.provider_type, booking.provider_type)
FROM public.booking_requests AS booking
WHERE review.booking_id = booking.id
  AND (review.provider_id IS NULL OR review.provider_type IS NULL);

-- Older installations used guide_id; newer installations do not have it.
DO $migration$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'reviews' AND column_name = 'guide_id'
    ) THEN
        EXECUTE 'UPDATE public.reviews SET provider_id = guide_id::TEXT, provider_type = COALESCE(provider_type, ''guide'') WHERE provider_id IS NULL AND guide_id IS NOT NULL';
        EXECUTE 'ALTER TABLE public.reviews ALTER COLUMN guide_id DROP NOT NULL';
    END IF;
END;
$migration$;

-- Preserve incomplete legacy rows, but enforce non-null fields when all rows were backfilled.
DO $migration$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM public.reviews WHERE provider_id IS NULL) THEN
        ALTER TABLE public.reviews ALTER COLUMN provider_id SET NOT NULL;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM public.reviews WHERE provider_type IS NULL) THEN
        ALTER TABLE public.reviews ALTER COLUMN provider_type SET NOT NULL;
    END IF;
END;
$migration$;
ALTER TABLE public.reviews DROP CONSTRAINT IF EXISTS reviews_provider_type_check;
ALTER TABLE public.reviews
    ADD CONSTRAINT reviews_provider_type_check CHECK (provider_type IN ('guide', 'company'));
ALTER TABLE public.reviews DROP CONSTRAINT IF EXISTS reviews_user_id_fkey;
ALTER TABLE public.reviews
    ADD CONSTRAINT reviews_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE NOT VALID;

DROP POLICY IF EXISTS "Enable read access for all users" ON public.reviews;
DROP POLICY IF EXISTS "Users can create their own reviews" ON public.reviews;
DROP POLICY IF EXISTS "Users can update their own reviews" ON public.reviews;

CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
    display_name TEXT,
    avatar_url TEXT,
    xp_points INTEGER NOT NULL DEFAULT 0 CHECK (xp_points >= 0),
    level TEXT NOT NULL DEFAULT 'newcomer'
        CHECK (level IN ('newcomer', 'bronze', 'silver', 'gold', 'platinum')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.xp_transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_profile_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    action TEXT NOT NULL,
    xp_amount INTEGER NOT NULL CHECK (xp_amount > 0),
    reference_id UUID NOT NULL,
    reference_type TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    CONSTRAINT xp_transactions_action_reference_key UNIQUE (action, reference_id)
);
ALTER TABLE public.xp_transactions ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.level_for_xp(points INTEGER)
RETURNS TEXT
LANGUAGE SQL
IMMUTABLE
AS $$
    SELECT CASE
        WHEN points >= 1500 THEN 'platinum'
        WHEN points >= 750 THEN 'gold'
        WHEN points >= 250 THEN 'silver'
        WHEN points >= 1 THEN 'bronze'
        ELSE 'newcomer'
    END;
$$;

CREATE OR REPLACE FUNCTION public.award_xp_once(
    p_user_id UUID,
    p_action TEXT,
    p_amount INTEGER,
    p_reference_id UUID,
    p_reference_type TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    profile_id UUID;
    inserted_count INTEGER;
BEGIN
    INSERT INTO user_profiles (user_id)
    VALUES (p_user_id)
    ON CONFLICT (user_id) DO NOTHING;

    SELECT id INTO profile_id FROM user_profiles WHERE user_id = p_user_id FOR UPDATE;

    INSERT INTO xp_transactions (user_profile_id, action, xp_amount, reference_id, reference_type)
    VALUES (profile_id, p_action, p_amount, p_reference_id, p_reference_type)
    ON CONFLICT (action, reference_id) DO NOTHING;
    GET DIAGNOSTICS inserted_count = ROW_COUNT;

    IF inserted_count = 1 THEN
        UPDATE user_profiles
        SET xp_points = xp_points + p_amount,
            level = level_for_xp(xp_points + p_amount),
            updated_at = timezone('utc', now())
        WHERE id = profile_id;
        RETURN TRUE;
    END IF;
    RETURN FALSE;
END;
$$;

CREATE OR REPLACE FUNCTION public.award_review_xp(p_user_id UUID, p_review_id UUID)
RETURNS BOOLEAN LANGUAGE SQL SECURITY DEFINER SET search_path = public
AS $$ SELECT award_xp_once(p_user_id, 'review_submitted', 50, p_review_id, 'review'); $$;

CREATE OR REPLACE FUNCTION public.award_completion_xp(p_user_id UUID, p_booking_id UUID)
RETURNS BOOLEAN LANGUAGE SQL SECURITY DEFINER SET search_path = public
AS $$ SELECT award_xp_once(p_user_id, 'trek_completed', 250, p_booking_id, 'booking'); $$;

REVOKE ALL ON FUNCTION public.award_xp_once(UUID, TEXT, INTEGER, UUID, TEXT) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.award_review_xp(UUID, UUID) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.award_completion_xp(UUID, UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.award_review_xp(UUID, UUID) TO service_role;
GRANT EXECUTE ON FUNCTION public.award_completion_xp(UUID, UUID) TO service_role;
