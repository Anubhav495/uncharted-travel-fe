-- Legacy compatibility migration; providers may be static guide/company IDs.
ALTER TABLE public.booking_requests
ADD COLUMN IF NOT EXISTS provider_id TEXT,
ADD COLUMN IF NOT EXISTS provider_type TEXT;

ALTER TABLE public.booking_requests DROP CONSTRAINT IF EXISTS booking_requests_provider_id_fkey;
ALTER TABLE public.booking_requests
ALTER COLUMN provider_id TYPE TEXT USING provider_id::TEXT;

ALTER TABLE public.booking_requests DROP CONSTRAINT IF EXISTS booking_requests_provider_type_check;
ALTER TABLE public.booking_requests
ADD CONSTRAINT booking_requests_provider_type_check
CHECK (provider_type IN ('guide', 'company') OR provider_type IS NULL);
