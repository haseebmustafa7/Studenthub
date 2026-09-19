-- StudentHub Phase 1: authentication, ownership and RLS hardening.
-- Run this AFTER the existing company/career migrations.
-- Backend uses the Supabase service role for privileged writes, so no broad
-- "service role" RLS policy is needed (service_role bypasses RLS).

-- ---------------------------------------------------------------------------
-- PROFILES
-- ---------------------------------------------------------------------------
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Public can view company names" ON profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;

-- Profile creation is server-owned. Users may read/update only their own profile.
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- JOBS
-- ---------------------------------------------------------------------------
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Companies and admins can insert jobs" ON jobs;
CREATE POLICY "Companies and admins can insert jobs"
  ON jobs FOR INSERT
  WITH CHECK (
    company_id = auth.uid()
    AND created_by = auth.uid()
    AND EXISTS (
      SELECT 1 FROM profiles
      WHERE user_id = auth.uid() AND role IN ('admin', 'company')
    )
  );

DROP POLICY IF EXISTS "Companies can update their own jobs, admins update any" ON jobs;
CREATE POLICY "Companies can update their own jobs, admins update any"
  ON jobs FOR UPDATE
  USING (
    company_id = auth.uid()
    OR EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin')
  )
  WITH CHECK (
    company_id = auth.uid()
    OR EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin')
  );

DROP POLICY IF EXISTS "Companies can delete their own jobs, admins delete any" ON jobs;
CREATE POLICY "Companies can delete their own jobs, admins delete any"
  ON jobs FOR DELETE
  USING (
    company_id = auth.uid()
    OR EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin')
  );

-- ---------------------------------------------------------------------------
-- CAREER CATALOG / COUNSELORS
-- ---------------------------------------------------------------------------
ALTER TABLE careers ENABLE ROW LEVEL SECURITY;
ALTER TABLE counselors ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role can manage careers" ON careers;
DROP POLICY IF EXISTS "Service role can manage counselors" ON counselors;
DROP POLICY IF EXISTS "Anyone can view active careers" ON careers;
DROP POLICY IF EXISTS "Anyone can view verified counselors" ON counselors;

CREATE POLICY "Anyone can view active careers"
  ON careers FOR SELECT
  USING (is_active = true);

CREATE POLICY "Anyone can view verified counselors"
  ON counselors FOR SELECT
  USING (is_verified = true AND is_available = true);

-- Privileged career/counselor writes are performed by the backend service role.
-- No client INSERT/UPDATE/DELETE policy is intentionally created.

-- ---------------------------------------------------------------------------
-- Helpful constraints / indexes
-- ---------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_jobs_company_status ON jobs(company_id, status);
CREATE INDEX IF NOT EXISTS idx_applications_user_job ON applications(user_id, job_id);

-- The backend already rejects duplicate applications. A unique constraint should
-- be added only after checking/cleaning any historical duplicate rows, so this
-- hardening migration never destroys or silently rewrites existing data.
