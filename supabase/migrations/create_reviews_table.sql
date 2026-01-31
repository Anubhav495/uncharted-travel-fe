-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    guide_id UUID NOT NULL REFERENCES guides(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    booking_id UUID NOT NULL REFERENCES booking_requests(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    CONSTRAINT reviews_booking_id_key UNIQUE (booking_id), -- One review per booking
    CONSTRAINT reviews_user_guide_booking_unique UNIQUE (user_id, guide_id, booking_id) -- Redundant with booking_id unique but explicitly clear
);

-- Enable RLS
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Policies
-- 1. Read: Everyone can read reviews
CREATE POLICY "Enable read access for all users" ON reviews FOR SELECT USING (true);

-- 2. Insert/Update: Authenticated users can create/update their own reviews
-- Note: Additional verification (status='completed') will be handled in the API/Application layer 
-- or via a more complex RLS policy using a join, but simpler to keep basic RLS here.
CREATE POLICY "Users can create their own reviews" ON reviews FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews" ON reviews FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
