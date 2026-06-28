-- Canonical schema for a clean deployment. Browser clients have no direct table
-- policies; all application data access goes through authenticated Next.js APIs.

CREATE TABLE public.users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    last_login TIMESTAMPTZ
);

CREATE TABLE public.guides (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nextauth_user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT UNIQUE NOT NULL,
    country_code TEXT NOT NULL,
    city TEXT,
    state TEXT,
    years_experience TEXT,
    languages TEXT,
    profile_photo_url TEXT
);

CREATE TABLE public.guide_treks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    guide_id UUID NOT NULL REFERENCES public.guides(id) ON DELETE CASCADE,
    trek_name TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE TABLE public.booking_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    trek_title TEXT NOT NULL,
    guests INTEGER NOT NULL CHECK (guests BETWEEN 1 AND 20),
    approx_date TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending'
        CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    provider_id TEXT,
    provider_type TEXT CHECK (provider_type IN ('guide', 'company') OR provider_type IS NULL)
);

CREATE UNIQUE INDEX booking_requests_one_pending_trek
    ON public.booking_requests (user_id, trek_title) WHERE status = 'pending';

CREATE TABLE public.reviews (
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

CREATE TABLE public.user_profiles (
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

CREATE TABLE public.xp_transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_profile_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    action TEXT NOT NULL,
    xp_amount INTEGER NOT NULL CHECK (xp_amount > 0),
    reference_id UUID NOT NULL,
    reference_type TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    UNIQUE (action, reference_id)
);

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guide_treks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.xp_transactions ENABLE ROW LEVEL SECURITY;

CREATE FUNCTION public.level_for_xp(points INTEGER) RETURNS TEXT
LANGUAGE SQL IMMUTABLE
AS $$
    SELECT CASE WHEN points >= 1500 THEN 'platinum'
        WHEN points >= 750 THEN 'gold' WHEN points >= 250 THEN 'silver'
        WHEN points >= 1 THEN 'bronze' ELSE 'newcomer' END;
$$;

CREATE FUNCTION public.award_xp_once(
    p_user_id UUID, p_action TEXT, p_amount INTEGER,
    p_reference_id UUID, p_reference_type TEXT
) RETURNS BOOLEAN
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE profile_id UUID; inserted_count INTEGER;
BEGIN
    INSERT INTO user_profiles (user_id) VALUES (p_user_id)
    ON CONFLICT (user_id) DO NOTHING;
    SELECT id INTO profile_id FROM user_profiles WHERE user_id = p_user_id FOR UPDATE;
    INSERT INTO xp_transactions
        (user_profile_id, action, xp_amount, reference_id, reference_type)
    VALUES (profile_id, p_action, p_amount, p_reference_id, p_reference_type)
    ON CONFLICT (action, reference_id) DO NOTHING;
    GET DIAGNOSTICS inserted_count = ROW_COUNT;
    IF inserted_count = 1 THEN
        UPDATE user_profiles SET xp_points = xp_points + p_amount,
            level = level_for_xp(xp_points + p_amount), updated_at = timezone('utc', now())
        WHERE id = profile_id;
        RETURN TRUE;
    END IF;
    RETURN FALSE;
END;
$$;

CREATE FUNCTION public.award_review_xp(p_user_id UUID, p_review_id UUID)
RETURNS BOOLEAN LANGUAGE SQL SECURITY DEFINER SET search_path = public
AS $$ SELECT award_xp_once(p_user_id, 'review_submitted', 50, p_review_id, 'review'); $$;

CREATE FUNCTION public.award_completion_xp(p_user_id UUID, p_booking_id UUID)
RETURNS BOOLEAN LANGUAGE SQL SECURITY DEFINER SET search_path = public
AS $$ SELECT award_xp_once(p_user_id, 'trek_completed', 250, p_booking_id, 'booking'); $$;

REVOKE ALL ON FUNCTION public.award_xp_once(UUID, TEXT, INTEGER, UUID, TEXT) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.award_review_xp(UUID, UUID) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.award_completion_xp(UUID, UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.award_review_xp(UUID, UUID) TO service_role;
GRANT EXECUTE ON FUNCTION public.award_completion_xp(UUID, UUID) TO service_role;
