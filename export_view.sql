-- =====================================================
-- CSV EXPORT FIX: Better Formatted View for Excel
-- =====================================================

-- Create a view that formats data nicely for CSV export
CREATE OR REPLACE VIEW applications_export AS
SELECT 
  id::text as "ID",
  full_name as "To'liq Ism (Full Name)",
  age::text as "Yosh (Age)",
  phone as "Telefon (Phone)",
  region as "Viloyat (Region)",
  district as "Tuman/Shahar (District)",
  CASE 
    WHEN planning_center = true THEN 'Ha'
    WHEN planning_center = false THEN 'Yo''q'
    ELSE 'N/A'
  END as "Markaz Ochish (Planning Center)",
  array_to_string(center_directions, ', ') as "Yo''nalishlar (Directions)",
  to_char(created_at, 'YYYY-MM-DD HH24:MI:SS') as "Yaratilgan Sana (Created Date)"
FROM public.applications
ORDER BY created_at DESC;

-- =====================================================
-- How to Use This View
-- =====================================================

-- After creating this view, export it from Supabase:
-- 1. Go to Table Editor
-- 2. Click on "applications_export" view
-- 3. Click "Export" > "Export CSV"
-- 4. Open in Excel - columns should separate properly

-- Or query it directly:
SELECT * FROM applications_export;
