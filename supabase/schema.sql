-- Create guides table
CREATE TABLE IF NOT EXISTS guides (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT NOT NULL,
    country_code TEXT NOT NULL,
    city TEXT,
    state TEXT,
    years_experience TEXT,
    languages TEXT,
    profile_photo_url TEXT,
    -- Note: In production, use Supabase Auth for password management
    -- This is a placeholder for the custom registration flow
    password_hash TEXT 
);

-- Create guide_treks junction table
CREATE TABLE IF NOT EXISTS guide_treks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    guide_id UUID REFERENCES guides(id) ON DELETE CASCADE,
    trek_name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE guides ENABLE ROW LEVEL SECURITY;
ALTER TABLE guide_treks ENABLE ROW LEVEL SECURITY;

-- Create policies (Open for insert for registration, read-only for public profiles)
CREATE POLICY "Enable insert for everyone" ON guides FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable read access for all users" ON guides FOR SELECT USING (true);

CREATE POLICY "Enable insert for everyone" ON guide_treks FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable read access for all users" ON guide_treks FOR SELECT USING (true);


create table booking_requests (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('Asia/Kolkata', now()) not null,
  full_name text not null,
  email text not null,
  phone text not null,
  trek_title text not null,
  guests integer not null,
  approx_date text not null,
  status text default 'pending'
);

ALTER TABLE booking_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable insert for everyone" ON booking_requests FOR INSERT WITH CHECK (true);

