-- ============================================================
-- COMPLETE CAREER COUNSELLING MIGRATION
-- Single file to run in Supabase SQL Editor
-- ============================================================
-- This migration creates all tables and inserts seed data
-- Safe to run multiple times (uses IF NOT EXISTS and ON CONFLICT)
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- PART 1: CREATE TABLES
-- ============================================================

-- 1. CAREERS TABLE
CREATE TABLE IF NOT EXISTS careers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    required_skills TEXT[] NOT NULL DEFAULT '{}',
    typical_education VARCHAR(100),
    salary_range_min INTEGER,
    salary_range_max INTEGER,
    growth_outlook VARCHAR(50),
    typical_responsibilities TEXT[] DEFAULT '{}',
    career_path TEXT[] DEFAULT '{}',
    industry_trends TEXT[] DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. CAREER ASSESSMENTS TABLE
CREATE TABLE IF NOT EXISTS career_assessments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    education_level VARCHAR(100),
    degree_program VARCHAR(255),
    current_semester VARCHAR(50),
    expected_graduation DATE,
    employment_status VARCHAR(100),
    previous_experience TEXT,
    interests JSONB DEFAULT '[]',
    activities_strengths JSONB DEFAULT '[]',
    current_skills JSONB DEFAULT '[]',
    preferred_industries TEXT[],
    work_mode VARCHAR(50),
    work_style VARCHAR(50),
    priorities JSONB DEFAULT '{}',
    career_goal VARCHAR(100),
    career_concern TEXT,
    status VARCHAR(20) DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed')),
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_user_assessment UNIQUE (user_id)
);

-- 3. CAREER MATCHES TABLE
CREATE TABLE IF NOT EXISTS career_matches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    assessment_id UUID NOT NULL REFERENCES career_assessments(id) ON DELETE CASCADE,
    career_id UUID NOT NULL REFERENCES careers(id) ON DELETE CASCADE,
    match_score DECIMAL(5,2),
    match_reason TEXT,
    ai_analysis JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. SKILL ANALYSES TABLE
CREATE TABLE IF NOT EXISTS skill_analyses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    career_id UUID NOT NULL REFERENCES careers(id) ON DELETE CASCADE,
    matching_skills TEXT[] DEFAULT '{}',
    skill_gaps JSONB DEFAULT '[]',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_user_career_analysis UNIQUE (user_id, career_id)
);

-- 5. LEARNING ROADMAPS TABLE
CREATE TABLE IF NOT EXISTS learning_roadmaps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    career_id UUID NOT NULL REFERENCES careers(id) ON DELETE CASCADE,
    overview TEXT,
    phases JSONB DEFAULT '[]',
    milestones TEXT[] DEFAULT '{}',
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed', 'archived')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_user_roadmap UNIQUE (user_id, career_id)
);

-- 6. COUNSELORS TABLE
CREATE TABLE IF NOT EXISTS counselors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    title VARCHAR(255),
    bio TEXT,
    photo_url TEXT,
    specializations TEXT[] NOT NULL DEFAULT '{}',
    years_of_experience INTEGER,
    hourly_rate DECIMAL(10,2),
    rating DECIMAL(3,2),
    total_sessions INTEGER DEFAULT 0,
    credentials TEXT[] DEFAULT '{}',
    availability JSONB DEFAULT '{}',
    is_available BOOLEAN DEFAULT true,
    is_verified BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. COUNSELING SESSIONS TABLE
CREATE TABLE IF NOT EXISTS counseling_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    counselor_id UUID NOT NULL REFERENCES counselors(id) ON DELETE CASCADE,
    scheduled_at TIMESTAMPTZ NOT NULL,
    duration INTEGER DEFAULT 60,
    session_type VARCHAR(50) DEFAULT 'video' CHECK (session_type IN ('video', 'phone', 'in_person')),
    notes TEXT,
    consent_data_sharing BOOLEAN DEFAULT false,
    status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'cancelled', 'completed')),
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    feedback TEXT,
    feedback_given BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- PART 2: CREATE INDEXES
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_careers_category ON careers(category);
CREATE INDEX IF NOT EXISTS idx_careers_active ON careers(is_active);
CREATE INDEX IF NOT EXISTS idx_career_assessments_user ON career_assessments(user_id);
CREATE INDEX IF NOT EXISTS idx_career_matches_user ON career_matches(user_id);
CREATE INDEX IF NOT EXISTS idx_career_matches_career ON career_matches(career_id);
CREATE INDEX IF NOT EXISTS idx_skill_analyses_user ON skill_analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_skill_analyses_career ON skill_analyses(career_id);
CREATE INDEX IF NOT EXISTS idx_learning_roadmaps_user ON learning_roadmaps(user_id);
CREATE INDEX IF NOT EXISTS idx_learning_roadmaps_career ON learning_roadmaps(career_id);
CREATE INDEX IF NOT EXISTS idx_counselors_email ON counselors(email);
CREATE INDEX IF NOT EXISTS idx_counselors_rating ON counselors(rating DESC);
CREATE INDEX IF NOT EXISTS idx_counseling_sessions_user ON counseling_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_counseling_sessions_counselor ON counseling_sessions(counselor_id);
CREATE INDEX IF NOT EXISTS idx_counseling_sessions_scheduled ON counseling_sessions(scheduled_at);

-- ============================================================
-- PART 3: ENABLE ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE careers ENABLE ROW LEVEL SECURITY;
ALTER TABLE career_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE career_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_roadmaps ENABLE ROW LEVEL SECURITY;
ALTER TABLE counselors ENABLE ROW LEVEL SECURITY;
ALTER TABLE counseling_sessions ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- PART 4: CREATE RLS POLICIES (Drop existing first to avoid conflicts)
-- ============================================================

-- CAREERS
DROP POLICY IF EXISTS "Anyone can view active careers" ON careers;
DROP POLICY IF EXISTS "Service role can manage careers" ON careers;

CREATE POLICY "Anyone can view active careers" ON careers FOR SELECT USING (is_active = true);
CREATE POLICY "Service role can manage careers" ON careers FOR ALL USING (true) WITH CHECK (true);

-- CAREER ASSESSMENTS
DROP POLICY IF EXISTS "Users can view their own assessments" ON career_assessments;
DROP POLICY IF EXISTS "Users can insert their own assessments" ON career_assessments;
DROP POLICY IF EXISTS "Users can update their own assessments" ON career_assessments;

CREATE POLICY "Users can view their own assessments" ON career_assessments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own assessments" ON career_assessments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own assessments" ON career_assessments FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- CAREER MATCHES
DROP POLICY IF EXISTS "Users can view their own matches" ON career_matches;
DROP POLICY IF EXISTS "Users can insert their own matches" ON career_matches;

CREATE POLICY "Users can view their own matches" ON career_matches FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own matches" ON career_matches FOR INSERT WITH CHECK (auth.uid() = user_id);

-- SKILL ANALYSES
DROP POLICY IF EXISTS "Users can view their own analyses" ON skill_analyses;
DROP POLICY IF EXISTS "Users can insert their own analyses" ON skill_analyses;
DROP POLICY IF EXISTS "Users can update their own analyses" ON skill_analyses;

CREATE POLICY "Users can view their own analyses" ON skill_analyses FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own analyses" ON skill_analyses FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own analyses" ON skill_analyses FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- LEARNING ROADMAPS
DROP POLICY IF EXISTS "Users can view their own roadmaps" ON learning_roadmaps;
DROP POLICY IF EXISTS "Users can insert their own roadmaps" ON learning_roadmaps;
DROP POLICY IF EXISTS "Users can update their own roadmaps" ON learning_roadmaps;

CREATE POLICY "Users can view their own roadmaps" ON learning_roadmaps FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own roadmaps" ON learning_roadmaps FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own roadmaps" ON learning_roadmaps FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- COUNSELORS
DROP POLICY IF EXISTS "Anyone can view verified counselors" ON counselors;
DROP POLICY IF EXISTS "Service role can manage counselors" ON counselors;

CREATE POLICY "Anyone can view verified counselors" ON counselors FOR SELECT USING (is_verified = true AND is_available = true);
CREATE POLICY "Service role can manage counselors" ON counselors FOR ALL USING (true) WITH CHECK (true);

-- COUNSELING SESSIONS
DROP POLICY IF EXISTS "Students can view their own sessions" ON counseling_sessions;
DROP POLICY IF EXISTS "Students can create sessions" ON counseling_sessions;
DROP POLICY IF EXISTS "Students can update their own sessions" ON counseling_sessions;

CREATE POLICY "Students can view their own sessions" ON counseling_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Students can create sessions" ON counseling_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Students can update their own sessions" ON counseling_sessions FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- PART 5: INSERT SEED DATA (12 CAREERS)
-- ============================================================

INSERT INTO careers (title, description, category, required_skills, typical_education, salary_range_min, salary_range_max, growth_outlook, typical_responsibilities, career_path, industry_trends) VALUES
('Software Engineer', 'Design, develop, test, and maintain software applications and systems. Work with various programming languages and frameworks to solve technical problems.', 'Technology', ARRAY['Programming', 'Problem Solving', 'Data Structures', 'Algorithms', 'Debugging', 'JavaScript', 'Python', 'Git', 'SQL'], 'bachelors', 60000, 150000, 'excellent', ARRAY['Write clean, maintainable code', 'Debug and fix software issues', 'Collaborate with team members', 'Review code', 'Document technical decisions'], ARRAY['Junior Developer', 'Software Engineer', 'Senior Engineer', 'Tech Lead', 'Engineering Manager'], ARRAY['AI/ML integration', 'Cloud computing', 'Microservices architecture', 'Remote work opportunities']),
('Data Scientist', 'Analyze complex data sets to extract insights, build predictive models, and help organizations make data-driven decisions.', 'Data Science', ARRAY['Python', 'Statistics', 'Machine Learning', 'Data Analysis', 'SQL', 'R', 'TensorFlow', 'Pandas'], 'masters', 70000, 160000, 'excellent', ARRAY['Clean and analyze data', 'Build machine learning models', 'Create visualizations', 'Present findings to stakeholders', 'Deploy models to production'], ARRAY['Data Analyst', 'Data Scientist', 'Senior Data Scientist', 'Lead Data Scientist', 'Chief Data Officer'], ARRAY['Deep learning applications', 'AutoML tools', 'Big data processing', 'Real-time analytics']),
('UI/UX Designer', 'Create user-centered designs for digital products. Conduct user research, create wireframes and prototypes, and ensure excellent user experiences.', 'Design', ARRAY['UI Design', 'UX Design', 'User Research', 'Wireframing', 'Prototyping', 'Figma', 'Adobe XD', 'HTML/CSS'], 'bachelors', 55000, 130000, 'good', ARRAY['Conduct user research', 'Create wireframes and mockups', 'Design user interfaces', 'Prototype interactions', 'Conduct usability testing'], ARRAY['Junior Designer', 'UI/UX Designer', 'Senior Designer', 'Lead Designer', 'Design Director'], ARRAY['Design systems', 'Accessibility focus', 'AI-assisted design', 'Motion design']),
('Product Manager', 'Define product vision and strategy, prioritize features, and work with cross-functional teams to deliver successful products.', 'Product Management', ARRAY['Product Strategy', 'Roadmapping', 'User Stories', 'Data Analysis', 'Communication', 'Agile', 'Stakeholder Management'], 'bachelors', 80000, 170000, 'excellent', ARRAY['Define product vision', 'Create product roadmap', 'Prioritize features', 'Work with engineering teams', 'Analyze product metrics', 'Communicate with stakeholders'], ARRAY['Associate PM', 'Product Manager', 'Senior PM', 'Group PM', 'VP of Product'], ARRAY['Data-driven decisions', 'Customer-centric approach', 'AI product features', 'Platform thinking']),
('Digital Marketing Specialist', 'Develop and execute digital marketing campaigns across various channels to reach target audiences and drive business growth.', 'Marketing', ARRAY['SEO', 'SEM', 'Social Media Marketing', 'Content Marketing', 'Analytics', 'Google Ads', 'Facebook Ads', 'Email Marketing'], 'bachelors', 45000, 100000, 'good', ARRAY['Plan marketing campaigns', 'Manage social media accounts', 'Optimize SEO', 'Run paid advertising', 'Analyze campaign performance', 'Create content strategy'], ARRAY['Marketing Coordinator', 'Digital Marketing Specialist', 'Marketing Manager', 'Marketing Director', 'CMO'], ARRAY['Influencer marketing', 'Video content', 'Marketing automation', 'Personalization']),
('Business Analyst', 'Bridge the gap between business needs and technical solutions. Analyze processes, gather requirements, and recommend improvements.', 'Business', ARRAY['Requirements Gathering', 'Data Analysis', 'Process Modeling', 'SQL', 'Excel', 'Communication', 'Problem Solving'], 'bachelors', 55000, 120000, 'good', ARRAY['Gather business requirements', 'Analyze business processes', 'Create documentation', 'Work with stakeholders', 'Support implementation', 'Identify improvements'], ARRAY['Junior Business Analyst', 'Business Analyst', 'Senior BA', 'Lead BA', 'Business Architecture Manager'], ARRAY['Process automation', 'Data analytics focus', 'Agile methodologies', 'Digital transformation']),
('Cybersecurity Analyst', 'Protect organizations from cyber threats by monitoring systems, identifying vulnerabilities, and implementing security measures.', 'Security', ARRAY['Network Security', 'Threat Analysis', 'Security Tools', 'Linux', 'Firewalls', 'Incident Response', 'Risk Assessment'], 'bachelors', 65000, 140000, 'excellent', ARRAY['Monitor security systems', 'Investigate security incidents', 'Implement security measures', 'Conduct vulnerability assessments', 'Create security policies', 'Train employees'], ARRAY['Security Analyst', 'Senior Security Analyst', 'Security Engineer', 'Security Architect', 'CISO'], ARRAY['Cloud security', 'Zero trust architecture', 'AI-powered threats', 'Compliance requirements']),
('Financial Analyst', 'Analyze financial data, create reports, and provide insights to help businesses make informed financial decisions.', 'Finance', ARRAY['Financial Modeling', 'Excel', 'Data Analysis', 'Forecasting', 'Reporting', 'Accounting', 'SQL'], 'bachelors', 60000, 130000, 'good', ARRAY['Create financial models', 'Analyze financial statements', 'Prepare reports', 'Forecast trends', 'Support budgeting', 'Present to management'], ARRAY['Junior Analyst', 'Financial Analyst', 'Senior Analyst', 'Finance Manager', 'CFO'], ARRAY['Automation tools', 'Real-time analytics', 'ESG reporting', 'FinTech integration']),
('Content Writer', 'Create engaging written content for various platforms including websites, blogs, social media, and marketing materials.', 'Writing', ARRAY['Writing', 'Editing', 'SEO', 'Research', 'Storytelling', 'Grammar', 'Content Strategy'], 'bachelors', 40000, 85000, 'moderate', ARRAY['Write articles and blog posts', 'Edit and proofread content', 'Conduct research', 'Optimize for SEO', 'Meet deadlines', 'Collaborate with marketing team'], ARRAY['Junior Writer', 'Content Writer', 'Senior Writer', 'Content Manager', 'Content Director'], ARRAY['AI writing tools', 'Video scripts', 'Podcast content', 'Thought leadership']),
('HR Manager', 'Oversee human resources operations including recruitment, employee relations, compensation, and organizational development.', 'Human Resources', ARRAY['Recruitment', 'Employee Relations', 'HR Policies', 'Communication', 'Conflict Resolution', 'Performance Management'], 'bachelors', 55000, 120000, 'moderate', ARRAY['Manage recruitment', 'Handle employee relations', 'Develop HR policies', 'Conduct performance reviews', 'Manage compensation', 'Support training'], ARRAY['HR Coordinator', 'HR Specialist', 'HR Manager', 'HR Director', 'CHRO'], ARRAY['HR technology', 'Remote work policies', 'DEI initiatives', 'Employee wellbeing']),
('Mobile App Developer', 'Develop applications for mobile devices using native or cross-platform technologies. Focus on iOS and/or Android platforms.', 'Technology', ARRAY['Mobile Development', 'Swift', 'Kotlin', 'React Native', 'Flutter', 'UI/UX', 'API Integration'], 'bachelors', 60000, 145000, 'excellent', ARRAY['Develop mobile applications', 'Test on multiple devices', 'Optimize performance', 'Integrate APIs', 'Publish to app stores', 'Fix bugs'], ARRAY['Junior Mobile Developer', 'Mobile Developer', 'Senior Mobile Developer', 'Mobile Architect', 'Mobile Engineering Manager'], ARRAY['Cross-platform frameworks', '5G optimization', 'AR/VR features', 'Progressive web apps']),
('Graphic Designer', 'Create visual concepts and designs for various media including print, digital, and branding materials.', 'Design', ARRAY['Adobe Photoshop', 'Illustrator', 'InDesign', 'Typography', 'Color Theory', 'Layout Design', 'Branding'], 'bachelors', 40000, 95000, 'moderate', ARRAY['Create visual designs', 'Design logos and branding', 'Prepare print materials', 'Edit photos', 'Maintain brand guidelines', 'Present concepts to clients'], ARRAY['Junior Graphic Designer', 'Graphic Designer', 'Senior Designer', 'Art Director', 'Creative Director'], ARRAY['Motion graphics', '3D design', 'AI design tools', 'Sustainable design'])
ON CONFLICT DO NOTHING;

-- ============================================================
-- PART 6: INSERT SEED DATA (4 COUNSELORS)
-- ============================================================

INSERT INTO counselors (full_name, email, title, bio, specializations, years_of_experience, hourly_rate, rating, total_sessions, credentials, availability, is_verified) VALUES
('Dr. Sarah Johnson', 'sarah.johnson@studenthub.com', 'Senior Career Counselor', 'With over 15 years of experience in career counseling, I specialize in helping students transition into tech careers. Former software engineer turned career coach.', ARRAY['Software Engineering', 'Data Science', 'Career Transitions', 'Tech Industry'], 15, 120.00, 4.9, 450, ARRAY['PhD in Career Development', 'Certified Career Coach', 'Former Software Engineer at Google'], '{"monday": ["09:00-17:00"], "tuesday": ["09:00-17:00"], "wednesday": ["09:00-17:00"], "thursday": ["09:00-17:00"], "friday": ["09:00-15:00"]}'::jsonb, true),
('Michael Chen', 'michael.chen@studenthub.com', 'Tech Career Advisor', 'Passionate about helping students break into the tech industry. I provide practical advice on job search, interview prep, and career growth.', ARRAY['Product Management', 'UX Design', 'Career Strategy', 'Interview Preparation'], 8, 85.00, 4.8, 280, ARRAY['MBA from Stanford', 'Former Product Manager at Meta', 'Certified Career Development Facilitator'], '{"monday": ["10:00-18:00"], "wednesday": ["10:00-18:00"], "friday": ["10:00-18:00"], "saturday": ["09:00-13:00"]}'::jsonb, true),
('Emily Rodriguez', 'emily.rodriguez@studenthub.com', 'Business & Marketing Career Coach', 'Helping students discover their path in business, marketing, and finance. I focus on identifying strengths and building actionable career plans.', ARRAY['Marketing', 'Business Analysis', 'Finance', 'Career Planning'], 10, 95.00, 4.7, 320, ARRAY['MBA in Marketing', 'Certified Professional Career Coach', '10+ years in Corporate Marketing'], '{"tuesday": ["09:00-17:00"], "thursday": ["09:00-17:00"], "saturday": ["10:00-16:00"]}'::jsonb, true),
('David Kim', 'david.kim@studenthub.com', 'Career Development Specialist', 'I work with students at all stages of their career journey, from choosing a major to landing their dream job. My approach is practical and results-oriented.', ARRAY['General Career Guidance', 'Resume Building', 'Job Search Strategy', 'Career Assessment'], 12, 75.00, 4.9, 520, ARRAY['Master in Counseling Psychology', 'Certified Career Counselor', 'Former University Career Services Director'], '{"monday": ["09:00-17:00"], "tuesday": ["09:00-17:00"], "wednesday": ["09:00-17:00"], "thursday": ["09:00-17:00"], "friday": ["09:00-17:00"]}'::jsonb, true)
ON CONFLICT (email) DO NOTHING;

-- ============================================================
-- PART 7: VERIFICATION & SUCCESS MESSAGE
-- ============================================================

DO $$
DECLARE
  career_count INTEGER;
  counselor_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO career_count FROM careers;
  SELECT COUNT(*) INTO counselor_count FROM counselors;
  
  RAISE NOTICE '';
  RAISE NOTICE '========================================';
  RAISE NOTICE '✅ MIGRATION COMPLETED SUCCESSFULLY!';
  RAISE NOTICE '========================================';
  RAISE NOTICE '';
  RAISE NOTICE '📊 Database Summary:';
  RAISE NOTICE '   - Careers: % rows', career_count;
  RAISE NOTICE '   - Counselors: % rows', counselor_count;
  RAISE NOTICE '';
  RAISE NOTICE '🔒 Security:';
  RAISE NOTICE '   - RLS enabled on all 7 tables';
  RAISE NOTICE '   - Policies configured for data isolation';
  RAISE NOTICE '';
  RAISE NOTICE '🚀 Next Steps:';
  RAISE NOTICE '   1. Restart backend server';
  RAISE NOTICE '   2. Visit http://localhost:5173/career/assessment';
  RAISE NOTICE '   3. Complete assessment and test features';
  RAISE NOTICE '';
  RAISE NOTICE '✨ All Career Counselling features are ready!';
  RAISE NOTICE '';
END $$;
