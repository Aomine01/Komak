-- =====================================================
-- WORKING FIX: RLS Policy for KO'MAK LOYIHASI
-- This version uses PUBLIC role (works for form submissions)
-- =====================================================

-- 1. Make sure RLS is enabled
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- 2. Drop ALL existing policies (clean slate)
DROP POLICY IF EXISTS "Allow public insert" ON public.applications;
DROP POLICY IF EXISTS "Enable insert for anon users" ON public.applications;
DROP POLICY IF EXISTS "Enable read for authenticated users" ON public.applications;
DROP POLICY IF EXISTS "Allow authenticated read" ON public.applications;
DROP POLICY IF EXISTS "public_insert_policy" ON public.applications;
DROP POLICY IF EXISTS "public_select_policy" ON public.applications;

-- 3. Create permissive policy for INSERT (allows form submissions)
CREATE POLICY "public_insert_policy"
ON public.applications
FOR INSERT
TO public
WITH CHECK (true);

-- 4. Create permissive policy for SELECT (allows reading data)
CREATE POLICY "public_select_policy"
ON public.applications
FOR SELECT
TO public
USING (true);

-- =====================================================
-- Verification Query (Optional - run after the above)
-- =====================================================

-- Check that policies were created successfully
SELECT 
  policyname,
  cmd,
  roles
FROM pg_policies
WHERE tablename = 'applications';
