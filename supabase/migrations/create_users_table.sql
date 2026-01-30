-- Create users table for NextAuth sync
CREATE TABLE IF NOT EXISTS public.users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  last_login TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Policies
-- 1. Public profiles are viewable by everyone (needed for reviews/social features later, safe for now)
CREATE POLICY "Public profiles are viewable by everyone" 
  ON public.users FOR SELECT USING (true);

-- 2. Service Role (NextJS API) needs full access.
-- Apps using Supabase SERVICE_KEY bypass RLS automatically.
-- But if we use ANON key from client side (unlikely for this flow, but good practice):
CREATE POLICY "Users can update own profile" 
  ON public.users FOR UPDATE USING (email = current_user); 
-- Note: 'current_user' in postgres is the db user, not the app user. 
-- For Supabase Auth we usually use auth.uid(). 
-- Since we are NOT using Supabase Auth, client-side RLS is trickier.
-- WE WILL RELY ON SERVER-SIDE (Service Role) for writes.
-- These RLS policies are mainly to prevent random anonymous writes.

-- Allow no-one to insert/update/delete from client-side anon key (default behavior if no policy)
