-- =====================================================
-- KO'MAK LOYIHASI - Database Setup Script
-- Copy and paste this entire script into Supabase SQL Editor
-- =====================================================

-- 1. Create the applications table
CREATE TABLE IF NOT EXISTS public.applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  age INTEGER NOT NULL CHECK (age >= 14 AND age <= 35),
  phone TEXT NOT NULL,
  region TEXT NOT NULL,
  district TEXT NOT NULL,
  planning_center BOOLEAN NOT NULL,
  center_directions TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3. Attach trigger to applications table
CREATE TRIGGER update_applications_updated_at
BEFORE UPDATE ON public.applications
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- 5. Create RLS policy: Allow public INSERT (for form submissions)
CREATE POLICY "Allow public insert" 
ON public.applications 
FOR INSERT 
TO anon 
WITH CHECK (true);

-- 6. Create RLS policy: Allow authenticated SELECT (for admin viewing)
CREATE POLICY "Allow authenticated read" 
ON public.applications 
FOR SELECT 
TO authenticated 
USING (true);

-- 7. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_applications_created_at 
ON public.applications(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_applications_region 
ON public.applications(region);

CREATE INDEX IF NOT EXISTS idx_applications_planning_center 
ON public.applications(planning_center);

-- =====================================================
-- Verification Query (Optional - run after the above)
-- =====================================================

-- Check if table was created successfully
SELECT 
  table_name, 
  column_name, 
  data_type, 
  is_nullable
FROM information_schema.columns
WHERE table_name = 'applications'
ORDER BY ordinal_position;
