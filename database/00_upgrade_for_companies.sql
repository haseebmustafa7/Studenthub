-- COMPLETE UPGRADE: Add Company Support to StudentHub
-- This migration safely upgrades the database to support companies
-- Run this FIRST before anything else

-- ============================================================
-- STEP 1: UPGRADE PROFILES TABLE
-- ============================================================

-- Add company-specific columns to profiles
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS company_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS company_website VARCHAR(255),
ADD COLUMN IF NOT EXISTS company_description TEXT,
ADD COLUMN IF NOT EXISTS company_logo_url TEXT,
ADD COLUMN IF NOT EXISTS industry VARCHAR(100),
ADD COLUMN IF NOT EXISTS city VARCHAR(100),
ADD COLUMN IF NOT EXISTS country VARCHAR(100) DEFAULT 'Pakistan',
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS phone VARCHAR(20);

-- Update role constraint to include 'company'
-- Must drop the old constraint first
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_role_check 
CHECK (role IN ('student', 'admin', 'company'));

-- Make phone nullable if not already
ALTER TABLE profiles ALTER COLUMN phone DROP NOT NULL;

-- ============================================================
-- STEP 2: UPGRADE JOBS TABLE
-- ============================================================

-- Add new fields for company ownership and location
ALTER TABLE jobs 
ADD COLUMN IF NOT EXISTS company_id UUID REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS city VARCHAR(100),
ADD COLUMN IF NOT EXISTS country VARCHAR(100) DEFAULT 'Pakistan',
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 8),
ADD COLUMN IF NOT EXISTS longitude DECIMAL(11, 8),
ADD COLUMN IF NOT EXISTS skills TEXT,
ADD COLUMN IF NOT EXISTS currency VARCHAR(10) DEFAULT 'PKR',
ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'active',
ADD COLUMN IF NOT EXISTS approved_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS approved_by UUID REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS required_skills TEXT;

-- Add status constraint if not exists
DO $$ 
BEGIN
    ALTER TABLE jobs DROP CONSTRAINT IF EXISTS jobs_status_check;
    ALTER TABLE jobs ADD CONSTRAINT jobs_status_check 
    CHECK (status IN ('active', 'pending', 'rejected', 'paused'));
EXCEPTION WHEN OTHERS THEN
    -- Constraint might already exist or table locked, skip
    NULL;
END $$;

-- Set company_id for existing jobs to match created_by
UPDATE jobs SET company_id = created_by WHERE company_id IS NULL AND created_by IS NOT NULL;

-- Update job_type constraint to include 'contract'
ALTER TABLE jobs DROP CONSTRAINT IF EXISTS jobs_job_type_check;
ALTER TABLE jobs ADD CONSTRAINT jobs_job_type_check 
CHECK (job_type IN ('internship', 'full-time', 'part-time', 'contract'));

-- ============================================================
-- STEP 3: CREATE INDEXES FOR PERFORMANCE
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_jobs_city ON jobs(city);
CREATE INDEX IF NOT EXISTS idx_jobs_country ON jobs(country);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);
CREATE INDEX IF NOT EXISTS idx_jobs_company_id ON jobs(company_id);
CREATE INDEX IF NOT EXISTS idx_jobs_location ON jobs(latitude, longitude) WHERE latitude IS NOT NULL AND longitude IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_jobs_category ON jobs(category);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_city ON profiles(city);
CREATE INDEX IF NOT EXISTS idx_profiles_company_name ON profiles(company_name) WHERE company_name IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);

-- ============================================================
-- STEP 4: UPDATE RLS POLICIES
-- ============================================================

-- Enable RLS if not already enabled
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- ===== PROFILES POLICIES =====

-- Drop conflicting policies
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Allow users to insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;

-- New comprehensive policies
CREATE POLICY "Users can view their own profile"
    ON profiles FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
    ON profiles FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Allow viewing basic profile info for job listings
CREATE POLICY "Public can view company names"
    ON profiles FOR SELECT
    USING (role = 'company' AND company_name IS NOT NULL);

-- ===== JOBS POLICIES =====

-- Drop all existing job policies
DROP POLICY IF EXISTS "Anyone can view active jobs" ON jobs;
DROP POLICY IF EXISTS "Authenticated users can view jobs" ON jobs;
DROP POLICY IF EXISTS "Admins can insert jobs" ON jobs;
DROP POLICY IF EXISTS "Admins can update jobs" ON jobs;
DROP POLICY IF EXISTS "Admins can delete jobs" ON jobs;
DROP POLICY IF EXISTS "Companies and admins can insert jobs" ON jobs;
DROP POLICY IF EXISTS "Companies can update their own jobs" ON jobs;
DROP POLICY IF EXISTS "Companies can delete their own jobs" ON jobs;
DROP POLICY IF EXISTS "Companies can view their own jobs" ON jobs;

-- New job policies
-- SELECT: Public can see active/approved jobs, companies see their own, admins see all
CREATE POLICY "Public and authenticated users can view jobs"
    ON jobs FOR SELECT
    USING (
        (is_active = true AND status = 'active') OR 
        company_id = auth.uid() OR
        auth.uid() = created_by OR
        EXISTS (
            SELECT 1 FROM profiles
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

-- INSERT: Companies and admins can create jobs
CREATE POLICY "Companies and admins can insert jobs"
    ON jobs FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE user_id = auth.uid() 
            AND role IN ('admin', 'company')
        )
    );

-- UPDATE: Companies can update their own jobs, admins can update any
CREATE POLICY "Companies can update their own jobs, admins update any"
    ON jobs FOR UPDATE
    USING (
        company_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM profiles
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    )
    WITH CHECK (
        company_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM profiles
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

-- DELETE: Companies can delete their own jobs, admins can delete any
CREATE POLICY "Companies can delete their own jobs, admins delete any"
    ON jobs FOR DELETE
    USING (
        company_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM profiles
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

-- ===== APPLICATIONS POLICIES =====

-- Drop existing application policies
DROP POLICY IF EXISTS "Users can view their own applications" ON applications;
DROP POLICY IF EXISTS "Users can insert their own applications" ON applications;
DROP POLICY IF EXISTS "Users can update their own applications" ON applications;
DROP POLICY IF EXISTS "Admins can view all applications" ON applications;
DROP POLICY IF EXISTS "Admins can update applications" ON applications;

-- New application policies
-- SELECT: Students see their own, companies see apps for their jobs, admins see all
CREATE POLICY "Users can view relevant applications"
    ON applications FOR SELECT
    USING (
        user_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM jobs
            WHERE jobs.id = applications.job_id 
            AND jobs.company_id = auth.uid()
        ) OR
        EXISTS (
            SELECT 1 FROM profiles
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

-- INSERT: Students can apply
CREATE POLICY "Students can create applications"
    ON applications FOR INSERT
    WITH CHECK (
        auth.uid() = user_id AND
        EXISTS (
            SELECT 1 FROM profiles
            WHERE user_id = auth.uid() AND role = 'student'
        )
    );

-- UPDATE: Students can update their own, companies can update status for their jobs, admins can update any
CREATE POLICY "Relevant users can update applications"
    ON applications FOR UPDATE
    USING (
        user_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM jobs
            WHERE jobs.id = applications.job_id 
            AND jobs.company_id = auth.uid()
        ) OR
        EXISTS (
            SELECT 1 FROM profiles
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    )
    WITH CHECK (
        user_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM jobs
            WHERE jobs.id = applications.job_id 
            AND jobs.company_id = auth.uid()
        ) OR
        EXISTS (
            SELECT 1 FROM profiles
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

-- DELETE: Only students can delete their own applications, admins can delete any
CREATE POLICY "Users can delete their own applications"
    ON applications FOR DELETE
    USING (
        user_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM profiles
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

-- ===== SAVED JOBS POLICIES (if table exists) =====
DO $$ 
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE tablename = 'saved_jobs') THEN
        -- Drop existing policies
        DROP POLICY IF EXISTS "Users can view their saved jobs" ON saved_jobs;
        DROP POLICY IF EXISTS "Users can save jobs" ON saved_jobs;
        DROP POLICY IF EXISTS "Users can unsave jobs" ON saved_jobs;

        -- New policies
        CREATE POLICY "Users can view their saved jobs"
            ON saved_jobs FOR SELECT
            USING (auth.uid() = user_id);

        CREATE POLICY "Users can save jobs"
            ON saved_jobs FOR INSERT
            WITH CHECK (auth.uid() = user_id);

        CREATE POLICY "Users can unsave jobs"
            ON saved_jobs FOR DELETE
            USING (auth.uid() = user_id);
    END IF;
END $$;

-- ============================================================
-- STEP 5: CREATE HELPFUL VIEWS
-- ============================================================

-- View for public jobs (active and approved)
CREATE OR REPLACE VIEW public_jobs AS
SELECT 
    j.*,
    p.company_name as owner_company_name,
    p.company_logo_url as owner_logo_url
FROM jobs j
LEFT JOIN profiles p ON j.company_id = p.user_id
WHERE j.is_active = true 
AND j.status = 'active'
ORDER BY j.created_at DESC;

-- View for job statistics by company
CREATE OR REPLACE VIEW company_job_stats AS
SELECT 
    company_id,
    COUNT(*) as total_jobs,
    COUNT(*) FILTER (WHERE status = 'active') as active_jobs,
    COUNT(*) FILTER (WHERE status = 'pending') as pending_jobs,
    COUNT(*) FILTER (WHERE status = 'paused') as paused_jobs,
    COUNT(*) FILTER (WHERE status = 'rejected') as rejected_jobs
FROM jobs
GROUP BY company_id;

-- ============================================================
-- STEP 6: ADD HELPFUL COMMENTS
-- ============================================================

COMMENT ON COLUMN profiles.role IS 'User role: student (default), company, or admin';
COMMENT ON COLUMN profiles.company_name IS 'Company name for company accounts';
COMMENT ON COLUMN profiles.company_website IS 'Company official website URL';
COMMENT ON COLUMN profiles.company_description IS 'About the company';
COMMENT ON COLUMN profiles.industry IS 'Company industry/sector';
COMMENT ON COLUMN profiles.city IS 'City location';
COMMENT ON COLUMN profiles.country IS 'Country location';

COMMENT ON COLUMN jobs.company_id IS 'Reference to the company (user) that owns this job';
COMMENT ON COLUMN jobs.status IS 'Job status: active (published), pending (awaiting approval), paused (hidden by company), rejected (rejected by admin)';
COMMENT ON COLUMN jobs.city IS 'City where job is located';
COMMENT ON COLUMN jobs.latitude IS 'Latitude coordinate for map display';
COMMENT ON COLUMN jobs.longitude IS 'Longitude coordinate for map display';
COMMENT ON COLUMN jobs.skills IS 'Comma-separated list of required skills';
COMMENT ON COLUMN jobs.currency IS 'Salary currency (default PKR)';

-- ============================================================
-- SUCCESS MESSAGE
-- ============================================================

SELECT 
    '✅ DATABASE UPGRADED SUCCESSFULLY!' as status,
    'Companies can now register and post jobs!' as message,
    'Next: Refresh your app and try company registration' as next_step;
