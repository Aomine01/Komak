-- KO'MAK+ Educational Center Survey Database
-- Updated for 11 questions
-- Option 1: CLEAN CREATION (Drop and recreate)
-- Run this block if you want to start fresh and delete all old responses

DROP TABLE IF EXISTS center_survey;

CREATE TABLE center_survey (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    
    -- Q1
    name TEXT NOT NULL,
    
    -- Q2
    center_location TEXT NOT NULL,
    
    -- Q3
    operating_status TEXT NOT NULL,
    operating_start_date TEXT, -- Only filled if status is 'yoq'
    
    -- Q4
    center_name TEXT NOT NULL,
    
    -- Q5
    student_count INTEGER NOT NULL CHECK (student_count >= 0),
    
    -- Q6
    employee_count INTEGER NOT NULL CHECK (employee_count >= 0),
    
    -- Q7
    problems_faced TEXT NOT NULL,
    
    -- Q8
    training_topics TEXT NOT NULL,
    
    -- Q9
    training_format TEXT NOT NULL,
    
    -- Q10
    mentor_preference TEXT NOT NULL,
    
    -- Q11
    suggestions TEXT NOT NULL
);

-- Create indexes for common filtering (IF NOT EXISTS handles duplicates)
CREATE INDEX IF NOT EXISTS idx_center_survey_created_at ON center_survey(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_center_survey_center_location ON center_survey(center_location);
CREATE INDEX IF NOT EXISTS idx_center_survey_operating_status ON center_survey(operating_status);

-- Disable RLS completely for public access (no policies needed)
ALTER TABLE center_survey DISABLE ROW LEVEL SECURITY;

-- Success message
SELECT 'Table created successfully! Form ready to accept 11-question submissions.' as status;


/*
-- Option 2: ALTER EXISTING TABLE (If you want to keep old data)
-- Only run the below commands if you don't use Option 1 above.

ALTER TABLE center_survey 
ADD COLUMN operating_start_date TEXT,
ADD COLUMN employee_count INTEGER DEFAULT 0,
ADD COLUMN problems_faced TEXT DEFAULT '',
ADD COLUMN training_topics TEXT DEFAULT '',
ADD COLUMN training_format TEXT DEFAULT '',
ADD COLUMN mentor_preference TEXT DEFAULT '',
ADD COLUMN suggestions TEXT DEFAULT '';
*/
