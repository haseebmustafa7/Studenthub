-- ============================================================
-- CAREER COUNSELLING SYSTEM - FIXED MIGRATION
-- Matches actual backend/frontend implementation
-- ============================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- 1. CAREER CATALOG (Fixed schema)
-- ============================================================

CREATE TABLE IF NOT EXISTS careers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    
    -- Skills (arrays match seed data)
    required_skills TEXT[] NOT NULL DEFAULT '{}',
    
    -- Education & Salary (match seed data structure)
    typical_education VARCHAR(100), -- 'bachelors', 'masters', 'phd', 'associate', 'high_school'
    salary_range_min INTEGER,
    salary_range_max INTEGER,
    growth_outlook VARCHAR(50), -- 'excellent', 'good', 'moderate', 'limited'
    
    -- Career details (arrays match seed data)
    typical_responsibilities TEXT[] DEFAULT '{}',
    career_path TEXT[] DEFAULT '{}',
    industry_trends TEXT[] DEFAULT '{}',
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_careers_category ON careers(category);
CREATE INDEX IF NOT EXISTS idx_careers_active ON careers(is_active);
CREATE INDEX IF NOT EXISTS idx_careers_education ON careers(typical_education);

-- ============================================================
-- 2. CAREER ASSESSMENTS
-- ============================================================

CREATE TABLE IF NOT EXISTS career_assessments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Education
    education_level VARCHAR(100),
    degree_program VARCHAR(255),
    current_semester VARCHAR(50),
    expected_graduation DATE,
    employment_status VARCHAR(100),
    previous_experience TEXT,
    
    -- Interests (JSON array)
    interests JSONB DEFAULT '[]',
    
    -- Activities/Strengths (JSON array)
    activities_strengths JSONB DEFAULT '[]',
    
    -- Current Skills (JSON array of {skill, level})
    current_skills JSONB DEFAULT '[]',
    
    -- Career Preferences
    preferred_industries TEXT[],
    work_mode VARCHAR(50), -- remote, office, hybrid
    work_style VARCHAR(50), -- team, independent, mixed
    priorities JSONB DEFAULT '{}', 
    
    -- Career Goal
    career_goal VARCHAR(100),
    career_concern TEXT,
    
    -- Status
    status VARCHAR(20) DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed')),
    completed_at TIMESTAMPTZ,
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT unique_user_assessment UNIQUE (user_id)
);

CREATE INDEX IF NOT EXISTS idx_career_assessments_user ON career_assessments(user_id);
CREATE INDEX IF NOT EXISTS idx_career_assessments_status ON career_assessments(status);

-- ============================================================
-- 3. CAREER MATCHES
-- ============================================================

CREATE TABLE IF NOT EXISTS career_matches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    assessment_id UUID NOT NULL REFERENCES career_assessments(id) ON DELETE CASCADE,
    career_id UUID NOT NULL REFERENCES careers(id) ON DELETE CASCADE,
    
    -- Match Analysis (matches backend implementation)
    match_score DECIMAL(5,2), -- 0-100
    match_reason TEXT, -- Single text field (not array)
    
    -- AI Analysis
    ai_analysis JSONB,
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_career_matches_user ON career_matches(user_id);
CREATE INDEX IF NOT EXISTS idx_career_matches_assessment ON career_matches(assessment_id);
CREATE INDEX IF NOT EXISTS idx_career_matches_career ON career_matches(career_id);
CREATE INDEX IF NOT EXISTS idx_career_matches_score ON career_matches(match_score DESC);

-- ============================================================
-- 4. SKILL ANALYSES (matches backend endpoint)
-- ============================================================

CREATE TABLE IF NOT EXISTS skill_analyses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    career_id UUID NOT NULL REFERENCES careers(id) ON DELETE CASCADE,
    
    -- Skill comparison results
    matching_skills TEXT[] DEFAULT '{}',
    skill_gaps JSONB DEFAULT '[]', -- [{skill, priority, learning_resources, estimated_learning_time}]
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT unique_user_career_analysis UNIQUE (user_id, career_id)
);

CREATE INDEX IF NOT EXISTS idx_skill_analyses_user ON skill_analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_skill_analyses_career ON skill_analyses(career_id);

-- ============================================================
-- 5. LEARNING ROADMAPS (matches backend structure)
-- ============================================================

CREATE TABLE IF NOT EXISTS learning_roadmaps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    career_id UUID NOT NULL REFERENCES careers(id) ON DELETE CASCADE,
    
    -- Roadmap Details
    overview TEXT,
    phases JSONB DEFAULT '[]', -- Array of phase objects with steps
    milestones TEXT[] DEFAULT '{}',
    
    -- Status
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed', 'archived')),
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT unique_user_roadmap UNIQUE (user_id, career_id)
);

CREATE INDEX IF NOT EXISTS idx_learning_roadmaps_user ON learning_roadmaps(user_id);
CREATE INDEX IF NOT EXISTS idx_learning_roadmaps_career ON learning_roadmaps(career_id);
CREATE INDEX IF NOT EXISTS idx_learning_roadmaps_status ON learning_roadmaps(status);

-- ============================================================
-- 6. COUNSELORS (Fixed schema to match seed data)
-- ============================================================

CREATE TABLE IF NOT EXISTS counselors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    
    -- Profile (matches seed data exactly)
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    title VARCHAR(255),
    bio TEXT,
    photo_url TEXT,
    
    -- Expertise (matches seed data)
    specializations TEXT[] NOT NULL DEFAULT '{}',
    years_of_experience INTEGER,
    hourly_rate DECIMAL(10,2),
    rating DECIMAL(3,2), -- 0.0 to 5.0
    total_sessions INTEGER DEFAULT 0,
    credentials TEXT[] DEFAULT '{}',
    
    -- Availability (JSONB matching seed data structure)
    availability JSONB DEFAULT '{}',
    
    -- Status
    is_available BOOLEAN DEFAULT true,
    is_verified BOOLEAN DEFAULT true, -- Default true for seed data
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_counselors_email ON counselors(email);
CREATE INDEX IF NOT EXISTS idx_counselors_available ON counselors(is_available);
CREATE INDEX IF NOT EXISTS idx_counselors_verified ON counselors(is_verified);
CREATE INDEX IF NOT EXISTS idx_counselors_rating ON counselors(rating DESC);
CREATE INDEX IF NOT EXISTS idx_counselors_specializations ON counselors USING GIN(specializations);

-- ============================================================
-- 7. COUNSELING SESSIONS (matches backend implementation)
-- ============================================================

CREATE TABLE IF NOT EXISTS counseling_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    counselor_id UUID NOT NULL REFERENCES counselors(id) ON DELETE CASCADE,
    
    -- Session Details
    scheduled_at TIMESTAMPTZ NOT NULL,
    duration INTEGER DEFAULT 60, -- minutes
    session_type VARCHAR(50) DEFAULT 'video' CHECK (session_type IN ('video', 'phone', 'in_person')),
    notes TEXT,
    
    -- Data Sharing Consent
    consent_data_sharing BOOLEAN DEFAULT false,
    
    -- Status
    status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'cancelled', 'completed')),
    
    -- Feedback
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    feedback TEXT,
    feedback_given BOOLEAN DEFAULT false,
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_counseling_sessions_user ON counseling_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_counseling_sessions_counselor ON counseling_sessions(counselor_id);
CREATE INDEX IF NOT EXISTS idx_counseling_sessions_scheduled ON counseling_sessions(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_counseling_sessions_status ON counseling_sessions(status);

-- ============================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE careers ENABLE ROW LEVEL SECURITY;
ALTER TABLE career_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE career_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_roadmaps ENABLE ROW LEVEL SECURITY;
ALTER TABLE counselors ENABLE ROW LEVEL SECURITY;
ALTER TABLE counseling_sessions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Anyone can view active careers" ON careers;
DROP POLICY IF EXISTS "Admins can manage careers" ON careers;
DROP POLICY IF EXISTS "Users can view their own assessments" ON career_assessments;
DROP POLICY IF EXISTS "Users can insert their own assessments" ON career_assessments;
DROP POLICY IF EXISTS "Users can update their own assessments" ON career_assessments;
DROP POLICY IF EXISTS "Users can view their own matches" ON career_matches;
DROP POLICY IF EXISTS "Users can insert their own matches" ON career_matches;
DROP POLICY IF EXISTS "Users can view their own analyses" ON skill_analyses;
DROP POLICY IF EXISTS "Users can insert their own analyses" ON skill_analyses;
DROP POLICY IF EXISTS "Users can update their own analyses" ON skill_analyses;
DROP POLICY IF EXISTS "Users can view their own roadmaps" ON learning_roadmaps;
DROP POLICY IF EXISTS "Users can insert their own roadmaps" ON learning_roadmaps;
DROP POLICY IF EXISTS "Users can update their own roadmaps" ON learning_roadmaps;
DROP POLICY IF EXISTS "Anyone can view verified counselors" ON counselors;
DROP POLICY IF EXISTS "Admins can manage counselors" ON counselors;
DROP POLICY IF EXISTS "Students can view their own sessions" ON counseling_sessions;
DROP POLICY IF EXISTS "Students can create sessions" ON counseling_sessions;
DROP POLICY IF EXISTS "Students can update their own sessions" ON counseling_sessions;
DROP POLICY IF EXISTS "Admins can manage all sessions" ON counseling_sessions;

-- ===== CAREERS =====
CREATE POLICY "Anyone can view active careers"
    ON careers FOR SELECT
    USING (is_active = true);

CREATE POLICY "Service role can manage careers"
    ON careers FOR ALL
    USING (true)
    WITH CHECK (true);

-- ===== CAREER ASSESSMENTS =====
CREATE POLICY "Users can view their own assessments"
    ON career_assessments FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own assessments"
    ON career_assessments FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own assessments"
    ON career_assessments FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- ===== CAREER MATCHES =====
CREATE POLICY "Users can view their own matches"
    ON career_matches FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own matches"
    ON career_matches FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- ===== SKILL ANALYSES =====
CREATE POLICY "Users can view their own analyses"
    ON skill_analyses FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own analyses"
    ON skill_analyses FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own analyses"
    ON skill_analyses FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- ===== LEARNING ROADMAPS =====
CREATE POLICY "Users can view their own roadmaps"
    ON learning_roadmaps FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own roadmaps"
    ON learning_roadmaps FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own roadmaps"
    ON learning_roadmaps FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- ===== COUNSELORS =====
CREATE POLICY "Anyone can view verified counselors"
    ON counselors FOR SELECT
    USING (is_verified = true AND is_available = true);

CREATE POLICY "Service role can manage counselors"
    ON counselors FOR ALL
    USING (true)
    WITH CHECK (true);

-- ===== COUNSELING SESSIONS =====
CREATE POLICY "Students can view their own sessions"
    ON counseling_sessions FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Students can create sessions"
    ON counseling_sessions FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Students can update their own sessions"
    ON counseling_sessions FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- GRANT PERMISSIONS TO SERVICE ROLE
-- ============================================================

-- Grant all permissions to service role for bypassing RLS
GRANT ALL ON careers TO service_role;
GRANT ALL ON career_assessments TO service_role;
GRANT ALL ON career_matches TO service_role;
GRANT ALL ON skill_analyses TO service_role;
GRANT ALL ON learning_roadmaps TO service_role;
GRANT ALL ON counselors TO service_role;
GRANT ALL ON counseling_sessions TO service_role;

-- Grant usage on sequences
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO service_role;

-- ============================================================
-- UPDATE TIMESTAMPS TRIGGER
-- ============================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all tables with updated_at
DROP TRIGGER IF EXISTS update_careers_updated_at ON careers;
CREATE TRIGGER update_careers_updated_at
    BEFORE UPDATE ON careers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_career_assessments_updated_at ON career_assessments;
CREATE TRIGGER update_career_assessments_updated_at
    BEFORE UPDATE ON career_assessments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_career_matches_updated_at ON career_matches;
CREATE TRIGGER update_career_matches_updated_at
    BEFORE UPDATE ON career_matches
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_skill_analyses_updated_at ON skill_analyses;
CREATE TRIGGER update_skill_analyses_updated_at
    BEFORE UPDATE ON skill_analyses
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_learning_roadmaps_updated_at ON learning_roadmaps;
CREATE TRIGGER update_learning_roadmaps_updated_at
    BEFORE UPDATE ON learning_roadmaps
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_counselors_updated_at ON counselors;
CREATE TRIGGER update_counselors_updated_at
    BEFORE UPDATE ON counselors
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_counseling_sessions_updated_at ON counseling_sessions;
CREATE TRIGGER update_counseling_sessions_updated_at
    BEFORE UPDATE ON counseling_sessions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- COMMENTS
-- ============================================================

COMMENT ON TABLE careers IS 'Career catalog with structured information - FIXED schema matching implementation';
COMMENT ON TABLE career_assessments IS 'Student career assessments';
COMMENT ON TABLE career_matches IS 'AI-generated career matches';
COMMENT ON TABLE skill_analyses IS 'Skill gap analyses for careers';
COMMENT ON TABLE learning_roadmaps IS 'Personalized learning roadmaps';
COMMENT ON TABLE counselors IS 'Career counselor profiles - FIXED schema';
COMMENT ON TABLE counseling_sessions IS 'Counseling session bookings - FIXED schema';

-- ============================================================
-- SUCCESS MESSAGE
-- ============================================================

DO $$
BEGIN
    RAISE NOTICE '✅ CAREER COUNSELLING DATABASE SCHEMA FIXED!';
    RAISE NOTICE '   - 7 tables created with correct columns';
    RAISE NOTICE '   - Indexes and constraints applied';
    RAISE NOTICE '   - RLS policies configured';
    RAISE NOTICE '   - Triggers for timestamps created';
    RAISE NOTICE '';
    RAISE NOTICE '📊 Tables created:';
    RAISE NOTICE '   1. careers (with salary_range_min/max, typical_education, growth_outlook)';
    RAISE NOTICE '   2. career_assessments';
    RAISE NOTICE '   3. career_matches';
    RAISE NOTICE '   4. skill_analyses';
    RAISE NOTICE '   5. learning_roadmaps';
    RAISE NOTICE '   6. counselors (with specializations, rating, hourly_rate)';
    RAISE NOTICE '   7. counseling_sessions';
    RAISE NOTICE '';
    RAISE NOTICE '🔒 Security: RLS enabled on all tables';
    RAISE NOTICE '';
    RAISE NOTICE '🚀 Next step: Run seed data scripts';
END $$;
