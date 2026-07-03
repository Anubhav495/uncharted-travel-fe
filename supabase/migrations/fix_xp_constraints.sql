ALTER TABLE public.user_profiles DROP CONSTRAINT IF EXISTS user_profiles_user_id_key;
ALTER TABLE public.user_profiles ADD CONSTRAINT user_profiles_user_id_key UNIQUE (user_id);

ALTER TABLE public.xp_transactions DROP CONSTRAINT IF EXISTS xp_transactions_action_reference_key;
ALTER TABLE public.xp_transactions ADD CONSTRAINT xp_transactions_action_reference_key UNIQUE (action, reference_id);

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
    ON CONFLICT ON CONSTRAINT user_profiles_user_id_key DO NOTHING;

    SELECT id INTO profile_id FROM user_profiles WHERE user_id = p_user_id FOR UPDATE;

    INSERT INTO xp_transactions (user_profile_id, action, xp_amount, reference_id, reference_type)
    VALUES (profile_id, p_action, p_amount, p_reference_id, p_reference_type)
    ON CONFLICT ON CONSTRAINT xp_transactions_action_reference_key DO NOTHING;
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
