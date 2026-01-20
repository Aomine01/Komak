# ⚠️ CRITICAL: Database Table Missing

## Current Status

✅ **Supabase credentials configured correctly**
✅ **Application connects to Supabase successfully**
❌ **Database table `applications` does not exist yet**

## Error Message

When you submit the form, you see:
```
Xatolik yuz berdi. Iltimos, keyinroq urinib ko'ring.
```

Console shows:
```
PGRST205: Could not find the relation 'public.applications'
```

## Solution: Create the Database Table

### Step 1: Go to Supabase SQL Editor

1. Open your Supabase project: https://supabase.com/dashboard/project/tbfajuryfbbiqpykzvra
2. Click **SQL Editor** in the left sidebar
3. Click **New Query**

### Step 2: Copy and Run This SQL

```sql
-- =====================================================
-- KO'MAK LOYIHASI - Database Schema
-- =====================================================

-- 1. Create applications table
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

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- 3. Create policy to allow public INSERT (for form submissions)
CREATE POLICY "Allow public insert" 
ON public.applications 
FOR INSERT 
TO anon 
WITH CHECK (true);

-- 4. Create policy to allow authenticated SELECT (for admin viewing)
CREATE POLICY "Allow authenticated read" 
ON public.applications 
FOR SELECT 
TO authenticated 
USING (true);

-- 5. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_applications_created_at 
ON public.applications(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_applications_region 
ON public.applications(region);
```

### Step 3: Click "Run" (or press Ctrl+Enter)

You should see:
```
Success. No rows returned
```

### Step 4: Verify Table Creation

Click **Table Editor** in the left sidebar and you should see `applications` table.

### Step 5: Test Your Application

1. Go back to http://localhost:3000
2. Fill out the form with valid data
3. Click **Yuborish**
4. You should now see: **"Muvaffaqiyatli yuborildi!"** (Success!)

## What Happens After Success

✅ Form clears automatically
✅ Success message appears
✅ 60-second cooldown activates
✅ Data appears in Supabase Table Editor

## Troubleshooting

**Q: Still getting error after creating table?**
- Check that the table name is exactly `applications` (lowercase)
- Verify the RLS policy was created: Check Authentication > Policies

**Q: Want to view submitted data?**
- Go to **Table Editor** → **applications**
- You'll see all submissions with timestamps

**Q: Need to delete test data?**
```sql
DELETE FROM public.applications WHERE full_name LIKE '%test%';
```

## Next Steps After Table Creation

Once the table is created and working:

1. ✅ Test a real submission
2. ✅ Verify data appears in Table Editor
3. ✅ Test the cooldown (try submitting twice)
4. ✅ Test validation (try invalid phone, age, etc.)
5. 🚀 Deploy to production (Vercel/Netlify)

---

**Need more help?** See the complete guide in `SUPABASE_SETUP.md`
