-- ============================================================
-- SEED COUNSELOR DATA
-- Professional career counselors (realistic but sample data)
-- ============================================================

-- Insert sample counselors
INSERT INTO counselors (full_name, professional_title, bio, expertise, experience_years, languages, education, certifications, is_available, is_verified, verified_at) VALUES
(
    'Dr. Sarah Ahmed',
    'Senior Career Counselor - Technology Careers',
    'With over 15 years of experience in career counseling, I specialize in helping students navigate technology careers. I have guided hundreds of students in finding their path in software engineering, data science, and related fields.',
    ARRAY['Software Engineering', 'Data Science', 'Career Transitions', 'Interview Preparation', 'Tech Industry'],
    15,
    ARRAY['English', 'Urdu'],
    'PhD in Educational Psychology, MS in Computer Science',
    ARRAY['Certified Career Counselor (CCC)', 'Professional Certified Coach (PCC)'],
    true,
    true,
    NOW() - INTERVAL '6 months'
),
(
    'Ali Hassan',
    'Career Development Specialist',
    'I help students discover their strengths and align them with meaningful career paths. My background in business and psychology allows me to provide holistic career guidance.',
    ARRAY['Career Exploration', 'Business Careers', 'Marketing', 'Skill Development', 'Resume Building'],
    8,
    ARRAY['English', 'Urdu', 'Punjabi'],
    'MS in Organizational Psychology, MBA',
    ARRAY['Certified Career Development Facilitator (CCDF)'],
    true,
    true,
    NOW() - INTERVAL '3 months'
),
(
    'Maria Khan',
    'Design & Creative Careers Advisor',
    'As a former UX designer turned career counselor, I help creative students find their niche in design, content creation, and digital media.',
    ARRAY['UI/UX Design', 'Graphic Design', 'Creative Careers', 'Portfolio Development'],
    10,
    ARRAY['English', 'Urdu'],
    'MA in Design, BFA in Visual Arts',
    ARRAY['Certified Career Counselor (CCC)'],
    true,
    true,
    NOW() - INTERVAL '4 months'
),
(
    'Farhan Malik',
    'Engineering & Technical Career Coach',
    'I guide engineering students in choosing specializations and preparing for technical careers. My industry experience helps students understand real-world requirements.',
    ARRAY['Engineering Careers', 'Technical Skills', 'Career Planning', 'Industry Insights'],
    12,
    ARRAY['English', 'Urdu'],
    'MS in Electrical Engineering, MBA',
    ARRAY['Professional Certified Coach (PCC)'],
    true,
    true,
    NOW() - INTERVAL '5 months'
);

-- Insert availability for Dr. Sarah Ahmed (counselor_id will be the first inserted counselor)
INSERT INTO counselor_availability (counselor_id, day_of_week, start_time, end_time, is_active)
SELECT 
    id,
    day,
    '09:00'::TIME,
    '17:00'::TIME,
    true
FROM counselors
CROSS JOIN (SELECT generate_series(1, 5) as day) days -- Monday to Friday
WHERE full_name = 'Dr. Sarah Ahmed';

-- Insert availability for Ali Hassan
INSERT INTO counselor_availability (counselor_id, day_of_week, start_time, end_time, is_active)
SELECT 
    id,
    day,
    '10:00'::TIME,
    '18:00'::TIME,
    true
FROM counselors
CROSS JOIN (SELECT generate_series(1, 5) as day) days
WHERE full_name = 'Ali Hassan';

-- Insert availability for Maria Khan
INSERT INTO counselor_availability (counselor_id, day_of_week, start_time, end_time, is_active)
SELECT 
    id,
    day,
    '14:00'::TIME,
    '20:00'::TIME,
    true
FROM counselors
CROSS JOIN (SELECT generate_series(1, 6) as day) days -- Monday to Saturday
WHERE full_name = 'Maria Khan';

-- Insert availability for Farhan Malik
INSERT INTO counselor_availability (counselor_id, day_of_week, start_time, end_time, is_active)
SELECT 
    id,
    day,
    '08:00'::TIME,
    '16:00'::TIME,
    true
FROM counselors
CROSS JOIN (SELECT generate_series(1, 5) as day) days
WHERE full_name = 'Farhan Malik';

-- ============================================================
-- SUCCESS MESSAGE
-- ============================================================

SELECT 
    (SELECT COUNT(*) FROM counselors) as counselors_added,
    (SELECT COUNT(*) FROM counselor_availability) as availability_slots_added,
    '✅ COUNSELOR DATA SEEDED SUCCESSFULLY!' as status,
    'Students can now book counseling sessions!' as message;
