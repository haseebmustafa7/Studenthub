-- ============================================================
-- CAREER COUNSELLING SYSTEM
-- Complete database schema for StudentHub Career Counselling
-- ============================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- 1. CAREER CATALOG
-- ============================================================

CREATE TABLE IF NOT EXISTS careers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    required_skills TEXT[] NOT NULL DEFAULT '{}',
    recommended_skills TEXT[] DEFAULT '{}',
    common_tools TEXT[] DEFAULT '{}',
    typical_responsibilities TEXT[] DEFAULT '{}',
    entry_level_roles TEXT[] DEFAULT '{}',
    related_careers TEXT[] DEFAULT '{}',
    education_requirements TEXT,
    salary_range TEXT,
    job_outlook TEXT,
    work_environment TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_careers_category ON careers(category);
CREATE INDEX idx_careers_active ON careers(is_active);

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
    
    -- Interests (stored as JSON array)
    interests JSONB DEFAULT '[]',
    
    -- Activities/Strengths (stored as JSON array)
    activities_strengths JSONB DEFAULT '[]',
    
    -- Current Skills (stored as JSON array of {skill, level})
    current_skills JSONB DEFAULT '[]',
    
    -- Career Preferences
    preferred_industries TEXT[],
    work_mode VARCHAR(50), -- remote, office, hybrid
    work_style VARCHAR(50), -- team, independent, mixed
    priorities JSONB DEFAULT '{}', -- career_growth, job_stability, salary, creativity, work_life_balance, social_impact
    
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

CREATE INDEX idx_career_assessments_user ON career_assessments(user_id);
CREATE INDEX idx_career_assessments_status ON career_assessments(status);
CREATE INDEX idx_career_assessments_completed ON career_assessments(completed_at DESC) WHERE completed_at IS NOT NULL;

-- ============================================================
-- 3. CAREER MATCHES
-- ============================================================

CREATE TABLE IF NOT EXISTS career_matches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    assessment_id UUID NOT NULL REFERENCES career_assessments(id) ON DELETE CASCADE,
    career_id UUID NOT NULL REFERENCES careers(id) ON DELETE CASCADE,
    
    -- Match Analysis
    match_strength VARCHAR(50) NOT NULL, -- strong, potential, consider
    match_score DECIMAL(5,2), -- Optional numeric score 0-100
    reasons TEXT[] NOT NULL DEFAULT '{}',
    supporting_factors TEXT[] DEFAULT '{}',
    concerns TEXT[] DEFAULT '{}',
    recommended_next_action TEXT,
    
    -- AI Analysis
    ai_analysis JSONB, -- Full AI response for reference
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_career_matches_user ON career_matches(user_id);
CREATE INDEX idx_career_matches_assessment ON career_matches(assessment_id);
CREATE INDEX idx_career_matches_career ON career_matches(career_id);
CREATE INDEX idx_career_matches_strength ON career_matches(match_strength);

-- ============================================================
-- 4. STUDENT SKILLS PROFILE
-- ============================================================

CREATE TABLE IF NOT EXISTS student_skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    career_id UUID REFERENCES careers(id),
    
    -- Current Skills
    current_skills JSONB NOT NULL DEFAULT '[]', -- [{skill, level, category}]
    
    -- Target Skills (from selected career)
    target_skills JSONB DEFAULT '[]',
    
    -- Skill Gaps (calculated)
    skill_gaps JSONB DEFAULT '[]', -- [{skill, current_level, target_level, priority, reason}]
    priority_gaps TEXT[] DEFAULT '{}', -- Top 3 priority skills
    
    -- Analysis
    last_analyzed_at TIMESTAMPTZ,
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT unique_user_skills UNIQUE (user_id, career_id)
);

CREATE INDEX idx_student_skills_user ON student_skills(user_id);
CREATE INDEX idx_student_skills_career ON student_skills(career_id);

-- ============================================================
-- 5. LEARNING ROADMAPS
-- ============================================================

CREATE TABLE IF NOT EXISTS learning_roadmaps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    career_id UUID NOT NULL REFERENCES careers(id),
    student_skills_id UUID REFERENCES student_skills(id),
    
    -- Roadmap Details
    title VARCHAR(255) NOT NULL,
    description TEXT,
    career_goal TEXT,
    estimated_duration VARCHAR(100), -- e.g., "6 months"
    
    -- Progress
    total_steps INTEGER DEFAULT 0,
    completed_steps INTEGER DEFAULT 0,
    progress_percentage DECIMAL(5,2) DEFAULT 0,
    
    -- Status
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed', 'archived')),
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT unique_user_roadmap UNIQUE (user_id, career_id)
);

CREATE INDEX idx_learning_roadmaps_user ON learning_roadmaps(user_id);
CREATE INDEX idx_learning_roadmaps_career ON learning_roadmaps(career_id);
CREATE INDEX idx_learning_roadmaps_status ON learning_roadmaps(status);

-- ============================================================
-- 6. ROADMAP STEPS
-- ============================================================

CREATE TABLE IF NOT EXISTS roadmap_steps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    roadmap_id UUID NOT NULL REFERENCES learning_roadmaps(id) ON DELETE CASCADE,
    
    -- Step Details
    phase VARCHAR(50) NOT NULL, -- foundation, core_skills, practice, portfolio, career_prep, job_application
    step_number INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    skill VARCHAR(255) NOT NULL,
    
    -- Skill Levels
    current_level VARCHAR(50),
    target_level VARCHAR(50) NOT NULL,
    
    -- Content
    why_it_matters TEXT,
    learning_objective TEXT NOT NULL,
    practice_activity TEXT,
    project_recommendation TEXT,
    
    -- Resources
    resources JSONB DEFAULT '[]', -- [{title, url, type}]
    
    -- Status
    status VARCHAR(20) DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed')),
    completed_at TIMESTAMPTZ,
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_roadmap_steps_roadmap ON roadmap_steps(roadmap_id);
CREATE INDEX idx_roadmap_steps_phase ON roadmap_steps(phase);
CREATE INDEX idx_roadmap_steps_status ON roadmap_steps(status);
CREATE INDEX idx_roadmap_steps_order ON roadmap_steps(roadmap_id, phase, step_number);

-- ============================================================
-- 7. COUNSELORS
-- ============================================================

CREATE TABLE IF NOT EXISTS counselors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    
    -- Profile
    full_name VARCHAR(255) NOT NULL,
    professional_title VARCHAR(255),
    bio TEXT,
    photo_url TEXT,
    
    -- Expertise
    expertise TEXT[] NOT NULL DEFAULT '{}',
    experience_years INTEGER,
    languages TEXT[] DEFAULT '{"English"}',
    
    -- Education/Credentials
    education TEXT,
    certifications TEXT[] DEFAULT '{}',
    
    -- Availability
    is_available BOOLEAN DEFAULT true,
    
    -- Verification
    is_verified BOOLEAN DEFAULT false,
    verified_at TIMESTAMPTZ,
    verified_by UUID REFERENCES auth.users(id),
    
    -- Stats
    total_sessions INTEGER DEFAULT 0,
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_counselors_available ON counselors(is_available);
CREATE INDEX idx_counselors_verified ON counselors(is_verified);
CREATE INDEX idx_counselors_expertise ON counselors USING GIN(expertise);

-- ============================================================
-- 8. COUNSELOR AVAILABILITY
-- ============================================================

CREATE TABLE IF NOT EXISTS counselor_availability (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    counselor_id UUID NOT NULL REFERENCES counselors(id) ON DELETE CASCADE,
    
    -- Day/Time
    day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6), -- 0=Sunday, 6=Saturday
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT valid_time_range CHECK (end_time > start_time)
);

CREATE INDEX idx_counselor_availability_counselor ON counselor_availability(counselor_id);
CREATE INDEX idx_counselor_availability_day ON counselor_availability(day_of_week);
CREATE INDEX idx_counselor_availability_active ON counselor_availability(is_active);

-- ============================================================
-- 9. COUNSELING SESSIONS
-- ============================================================

CREATE TABLE IF NOT EXISTS counseling_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    counselor_id UUID NOT NULL REFERENCES counselors(id) ON DELETE CASCADE,
    
    -- Session Details
    session_date DATE NOT NULL,
    session_time TIME NOT NULL,
    duration_minutes INTEGER DEFAULT 60,
    session_topic VARCHAR(100) NOT NULL, -- career_selection, skill_development, internship, job_preparation, cv_resume, interview, career_change, other
    student_message TEXT,
    
    -- Data Sharing
    share_assessment_summary BOOLEAN DEFAULT false,
    assessment_summary JSONB, -- Shared summary if consent given
    
    -- Status
    status VARCHAR(20) DEFAULT 'requested' CHECK (status IN ('requested', 'confirmed', 'declined', 'cancelled', 'completed')),
    status_updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Notes
    counselor_notes TEXT, -- Private notes by counselor
    session_outcome TEXT,
    
    -- Feedback
    student_rating INTEGER CHECK (student_rating >= 1 AND student_rating <= 5),
    student_feedback TEXT,
    feedback_submitted_at TIMESTAMPTZ,
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_counseling_sessions_user ON counseling_sessions(user_id);
CREATE INDEX idx_counseling_sessions_counselor ON counseling_sessions(counselor_id);
CREATE INDEX idx_counseling_sessions_date ON counseling_sessions(session_date, session_time);
CREATE INDEX idx_counseling_sessions_status ON counseling_sessions(status);

-- ============================================================
-- 10. USER CONSENT RECORDS
-- ============================================================

CREATE TABLE IF NOT EXISTS user_consent (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    consent_type VARCHAR(100) NOT NULL, -- share_with_counselor, data_processing, etc.
    consent_given BOOLEAN NOT NULL,
    related_session_id UUID REFERENCES counseling_sessions(id),
    
    -- Context
    consent_context JSONB, -- Additional context about consent
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_user_consent_user ON user_consent(user_id);
CREATE INDEX idx_user_consent_type ON user_consent(consent_type);
CREATE INDEX idx_user_consent_session ON user_consent(related_session_id);

-- ============================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE careers ENABLE ROW LEVEL SECURITY;
ALTER TABLE career_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE career_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_roadmaps ENABLE ROW LEVEL SECURITY;
ALTER TABLE roadmap_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE counselors ENABLE ROW LEVEL SECURITY;
ALTER TABLE counselor_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE counseling_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_consent ENABLE ROW LEVEL SECURITY;

-- ===== CAREERS =====
-- Anyone can view active careers
CREATE POLICY "Anyone can view active careers"
    ON careers FOR SELECT
    USING (is_active = true);

-- Admins can manage careers
CREATE POLICY "Admins can manage careers"
    ON careers FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

-- ===== CAREER ASSESSMENTS =====
-- Users can view their own assessments
CREATE POLICY "Users can view their own assessments"
    ON career_assessments FOR SELECT
    USING (auth.uid() = user_id);

-- Users can insert their own assessments
CREATE POLICY "Users can insert their own assessments"
    ON career_assessments FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Users can update their own assessments
CREATE POLICY "Users can update their own assessments"
    ON career_assessments FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- ===== CAREER MATCHES =====
-- Users can view their own matches
CREATE POLICY "Users can view their own matches"
    ON career_matches FOR SELECT
    USING (auth.uid() = user_id);

-- Users can insert their own matches
CREATE POLICY "Users can insert their own matches"
    ON career_matches FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- ===== STUDENT SKILLS =====
-- Users can view their own skills
CREATE POLICY "Users can view their own skills"
    ON student_skills FOR SELECT
    USING (auth.uid() = user_id);

-- Users can insert their own skills
CREATE POLICY "Users can insert their own skills"
    ON student_skills FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Users can update their own skills
CREATE POLICY "Users can update their own skills"
    ON student_skills FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- ===== LEARNING ROADMAPS =====
-- Users can view their own roadmaps
CREATE POLICY "Users can view their own roadmaps"
    ON learning_roadmaps FOR SELECT
    USING (auth.uid() = user_id);

-- Users can insert their own roadmaps
CREATE POLICY "Users can insert their own roadmaps"
    ON learning_roadmaps FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Users can update their own roadmaps
CREATE POLICY "Users can update their own roadmaps"
    ON learning_roadmaps FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- ===== ROADMAP STEPS =====
-- Users can view their own roadmap steps
CREATE POLICY "Users can view their own roadmap steps"
    ON roadmap_steps FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM learning_roadmaps
            WHERE learning_roadmaps.id = roadmap_steps.roadmap_id
            AND learning_roadmaps.user_id = auth.uid()
        )
    );

-- Users can update their own roadmap steps
CREATE POLICY "Users can update their own roadmap steps"
    ON roadmap_steps FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM learning_roadmaps
            WHERE learning_roadmaps.id = roadmap_steps.roadmap_id
            AND learning_roadmaps.user_id = auth.uid()
        )
    );

-- ===== COUNSELORS =====
-- Anyone can view verified and available counselors
CREATE POLICY "Anyone can view verified counselors"
    ON counselors FOR SELECT
    USING (is_verified = true AND is_available = true);

-- Admins can manage counselors
CREATE POLICY "Admins can manage counselors"
    ON counselors FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

-- ===== COUNSELOR AVAILABILITY =====
-- Anyone can view active availability
CREATE POLICY "Anyone can view availability"
    ON counselor_availability FOR SELECT
    USING (is_active = true);

-- Admins can manage availability
CREATE POLICY "Admins can manage availability"
    ON counselor_availability FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

-- ===== COUNSELING SESSIONS =====
-- Students can view their own sessions
CREATE POLICY "Students can view their own sessions"
    ON counseling_sessions FOR SELECT
    USING (auth.uid() = user_id);

-- Students can create sessions
CREATE POLICY "Students can create sessions"
    ON counseling_sessions FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Students can update their own sessions (for cancellation, feedback)
CREATE POLICY "Students can update their own sessions"
    ON counseling_sessions FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Admins can view and manage all sessions
CREATE POLICY "Admins can manage all sessions"
    ON counseling_sessions FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

-- ===== USER CONSENT =====
-- Users can view their own consent records
CREATE POLICY "Users can view their own consent"
    ON user_consent FOR SELECT
    USING (auth.uid() = user_id);

-- Users can insert their own consent
CREATE POLICY "Users can insert their own consent"
    ON user_consent FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- FUNCTIONS
-- ============================================================

-- Function to update roadmap progress
CREATE OR REPLACE FUNCTION update_roadmap_progress()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE learning_roadmaps
    SET 
        completed_steps = (
            SELECT COUNT(*) 
            FROM roadmap_steps 
            WHERE roadmap_id = NEW.roadmap_id 
            AND status = 'completed'
        ),
        progress_percentage = (
            SELECT (COUNT(*) FILTER (WHERE status = 'completed')::DECIMAL / 
                   NULLIF(COUNT(*)::DECIMAL, 0) * 100)
            FROM roadmap_steps 
            WHERE roadmap_id = NEW.roadmap_id
        ),
        updated_at = NOW()
    WHERE id = NEW.roadmap_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update roadmap progress
DROP TRIGGER IF EXISTS trigger_update_roadmap_progress ON roadmap_steps;
CREATE TRIGGER trigger_update_roadmap_progress
AFTER UPDATE OF status ON roadmap_steps
FOR EACH ROW
WHEN (OLD.status IS DISTINCT FROM NEW.status)
EXECUTE FUNCTION update_roadmap_progress();

-- Function to update counselor session count
CREATE OR REPLACE FUNCTION update_counselor_stats()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
        UPDATE counselors
        SET total_sessions = total_sessions + 1
        WHERE id = NEW.counselor_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update counselor stats
DROP TRIGGER IF EXISTS trigger_update_counselor_stats ON counseling_sessions;
CREATE TRIGGER trigger_update_counselor_stats
AFTER UPDATE OF status ON counseling_sessions
FOR EACH ROW
EXECUTE FUNCTION update_counselor_stats();

-- ============================================================
-- COMMENTS
-- ============================================================

COMMENT ON TABLE careers IS 'Career catalog with structured information about available careers';
COMMENT ON TABLE career_assessments IS 'Student career assessments capturing education, interests, skills, and preferences';
COMMENT ON TABLE career_matches IS 'AI-generated career matches based on assessment data';
COMMENT ON TABLE student_skills IS 'Student skill profiles and gap analysis';
COMMENT ON TABLE learning_roadmaps IS 'Personalized learning roadmaps for career development';
COMMENT ON TABLE roadmap_steps IS 'Individual steps in a learning roadmap';
COMMENT ON TABLE counselors IS 'Career counselor profiles';
COMMENT ON TABLE counselor_availability IS 'Counselor availability schedule';
COMMENT ON TABLE counseling_sessions IS 'One-on-one counseling session bookings';
COMMENT ON TABLE user_consent IS 'User consent records for data sharing';

-- ============================================================
-- SUCCESS MESSAGE
-- ============================================================

SELECT 
    '✅ CAREER COUNSELLING DATABASE CREATED SUCCESSFULLY!' as status,
    'All tables, indexes, RLS policies, and functions are ready!' as message,
    'Next: Seed career catalog data' as next_step;
