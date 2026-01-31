-- Add guide_id and start_date columns to booking_requests table

ALTER TABLE booking_requests
ADD COLUMN IF NOT EXISTS guide_id UUID REFERENCES guides(id),
ADD COLUMN IF NOT EXISTS start_date DATE;

-- Update RLS policies if necessary (assuming existing ones apply)
-- If we need to filter bookings by guide_id for the guide dashboard later, we'll add policies then.
