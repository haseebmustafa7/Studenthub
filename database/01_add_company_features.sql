-- Migration: Add Company Features and Location Support
-- This migration safely adds company functionality without breaking existing data

-- Step 1: Add new columns to profiles table for company support
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS company_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS company_website VARCHAR(255),
ADD COLUMN IF NOT EXISTS company_description TEXT,
ADD COLUMN IF NOT EXISTS company_logo_url TEXT,
ADD COLUMN IF NOT EXISTS industry VARCHAR(100),
ADD COLUMN IF NOT EXISTS city VARCHAR(100),
ADD COLUMN IF NOT EXISTS country VARCHAR(100) DEFAULT 'Pakistan';

-- Step 2: Update role check constraint to include 'company'
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_role_check 
CHECK (role IN ('student', 'admin', 'company'));

-- Step 3: Add new columns to jobs table
ALTER TABLE jobs 
ADD COLUMN IF NOT EXISTS city VARCHAR(100),
ADD COLUMN IF NOT EXISTS country VARCHAR(100) DEFAULT 'Pakistan',
ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 8),
ADD COLUMN IF NOT EXISTS longitude DECIMAL(11, 8),
ADD COLUMN IF NOT EXISTS skills TEXT,
ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'pending', 'rejected', 'paused')),
ADD COLUMN IF NOT EXISTS approved_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS approved_by UUID REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS company_id UUID REFERENCES auth.users(id);

-- Step 4: Set company_id for existing jobs to match created_by
UPDATE jobs SET company_id = created_by WHERE company_id IS NULL;

-- Step 5: Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_jobs_city ON jobs(city);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);
CREATE INDEX IF NOT EXISTS idx_jobs_company_id ON jobs(company_id);
CREATE INDEX IF NOT EXISTS idx_jobs_location ON jobs(latitude, longitude) WHERE latitude IS NOT NULL AND longitude IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_city ON profiles(city);

-- Step 6: Update RLS policies for company access

-- Drop existing policies that might conflict
DROP POLICY IF EXISTS "Admins can insert jobs" ON jobs;
DROP POLICY IF EXISTS "Admins can update jobs" ON jobs;
DROP POLICY IF EXISTS "Admins can delete jobs" ON jobs;

-- New policy: Companies and admins can insert jobs
CREATE POLICY "Companies and admins can insert jobs"
    ON jobs FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE user_id = auth.uid() 
            AND role IN ('admin', 'company')
        )
    );

-- New policy: Companies can update their own jobs, admins can update any
CREATE POLICY "Companies can update their own jobs"
    ON jobs FOR UPDATE
    USING (
        company_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM profiles
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

-- New policy: Companies can delete their own jobs, admins can delete any
CREATE POLICY "Companies can delete their own jobs"
    ON jobs FOR DELETE
    USING (
        company_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM profiles
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

-- New policy: Companies can view their own jobs including pending ones
CREATE POLICY "Companies can view their own jobs"
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

-- Step 7: Add helpful comments
COMMENT ON COLUMN jobs.city IS 'City where the job is located';
COMMENT ON COLUMN jobs.latitude IS 'Latitude for map display';
COMMENT ON COLUMN jobs.longitude IS 'Longitude for map display';
COMMENT ON COLUMN jobs.status IS 'Job status: active, pending (awaiting approval), rejected, paused';
COMMENT ON COLUMN jobs.company_id IS 'Reference to the company that owns this job';
COMMENT ON COLUMN profiles.role IS 'User role: student, company, or admin';

-- Step 8: Create a view for public jobs (active and approved)
CREATE OR REPLACE VIEW public_jobs AS
SELECT * FROM jobs 
WHERE is_active = true 
AND status = 'active'
ORDER BY created_at DESC;

-- Migration complete
SELECT 'Migration completed successfully! Company features added.' as message;
