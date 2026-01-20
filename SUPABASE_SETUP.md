# SUPABASE DATABASE SETUP

Complete SQL script to set up the database for KO'MAK LOYIHASI.

## Instructions

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Create a new query
4. Copy and paste the script below
5. Click **Run** or press `Ctrl+Enter`

---

## SQL Script

```sql
-- =====================================================
-- KO'MAK LOYIHASI - Database Schema
-- =====================================================

-- 1. Create applications table
CREATE TABLE IF NOT EXISTS applications (
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
BEFORE UPDATE ON applications
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- 4. Enable Row Level Security (RLS)
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- 5. Create RLS policies

-- Allow anyone to INSERT (for public form submissions)
CREATE POLICY "Allow public insert" 
ON applications 
FOR INSERT 
TO anon 
WITH CHECK (true);

-- Allow authenticated users to SELECT (for admin dashboard)
CREATE POLICY "Allow authenticated read" 
ON applications 
FOR SELECT 
TO authenticated 
USING (true);

-- Optionally: Allow authenticated users to UPDATE/DELETE
CREATE POLICY "Allow authenticated update" 
ON applications 
FOR UPDATE 
TO authenticated 
USING (true);

CREATE POLICY "Allow authenticated delete" 
ON applications 
FOR DELETE 
TO authenticated 
USING (true);

-- 6. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_applications_created_at 
ON applications(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_applications_region 
ON applications(region);

CREATE INDEX IF NOT EXISTS idx_applications_planning_center 
ON applications(planning_center);

-- 7. Create view for analytics (optional)
CREATE OR REPLACE VIEW applications_summary AS
SELECT 
  region,
  COUNT(*) as total_applications,
  COUNT(*) FILTER (WHERE planning_center = true) as planning_center_count,
  AVG(age)::NUMERIC(10,2) as average_age,
  MAX(created_at) as latest_application
FROM applications
GROUP BY region
ORDER BY total_applications DESC;

-- Grant SELECT on view to authenticated users
GRANT SELECT ON applications_summary TO authenticated;

-- =====================================================
-- Verification Queries
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

-- Verify RLS is enabled
SELECT 
  schemaname, 
  tablename, 
  rowsecurity
FROM pg_tables
WHERE tablename = 'applications';

-- List all policies
SELECT 
  policyname, 
  permissive, 
  roles, 
  cmd
FROM pg_policies
WHERE tablename = 'applications';
```

---

## Expected Output

After running the script, you should see:

1. ✅ Table `applications` created
2. ✅ 8 columns: id, full_name, age, phone, region, district, planning_center, center_directions
3. ✅ RLS enabled
4. ✅ 4 policies created (insert for anon, select/update/delete for authenticated)
5. ✅ 3 indexes created

---

## Testing the Setup

After running the SQL script, test with this INSERT query:

```sql
-- Test insert (should succeed)
INSERT INTO applications (
  full_name,
  age,
  phone,
  region,
  district,
  planning_center,
  center_directions
) VALUES (
  'Test User',
  25,
  '+998 90 123 45 67',
  'Toshkent shahri',
  'Chilonzor',
  true,
  ARRAY['IT / dasturlash', 'Chet tillari']
);

-- Verify insert
SELECT * FROM applications ORDER BY created_at DESC LIMIT 1;

-- Clean up test data
DELETE FROM applications WHERE full_name = 'Test User';
```

---

## Troubleshooting

**Error: "relation 'applications' already exists"**
- The table already exists. You can drop it first: `DROP TABLE applications CASCADE;`
- Then re-run the script

**Error: "permission denied for table applications"**
- Check your Supabase user role
- Verify RLS policies are correctly set

**Form submissions not appearing:**
1. Check RLS policy for INSERT: `SELECT * FROM pg_policies WHERE tablename = 'applications' AND cmd = 'INSERT'`
2. Verify the policy allows `anon` role
3. Check Supabase logs for errors

---

## Next Steps

1. ✅ Run this SQL script in Supabase SQL Editor
2. ✅ Verify table creation in Table Editor
3. ✅ Test with a manual INSERT query
4. ✅ Configure `.env` file in your app
5. ✅ Start the development server: `npm run dev`

---

Built for KO'MAK LOYIHASI with 🔒 Security First
