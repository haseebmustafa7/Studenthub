-- ============================================================
-- SEED CAREER AND COUNSELOR DATA
-- Matches Node.js seed-data.js implementation
-- ============================================================

-- ============================================================
-- INSERT 12 CAREERS
-- ============================================================

INSERT INTO careers (
  title, 
  description, 
  category, 
  required_skills,
  typical_education,
  salary_range_min,
  salary_range_max,
  growth_outlook,
  typical_responsibilities,
  career_path,
  industry_trends
) VALUES
(
  'Software Engineer',
  'Design, develop, test, and maintain software applications and systems. Work with various programming languages and frameworks to solve technical problems.',
  'Technology',
  ARRAY['Programming', 'Problem Solving', 'Data Structures', 'Algorithms', 'Debugging', 'JavaScript', 'Python', 'Git', 'SQL'],
  'bachelors',
  60000,
  150000,
  'excellent',
  ARRAY['Write clean, maintainable code', 'Debug and fix software issues', 'Collaborate with team members', 'Review code', 'Document technical decisions'],
  ARRAY['Junior Developer', 'Software Engineer', 'Senior Engineer', 'Tech Lead', 'Engineering Manager'],
  ARRAY['AI/ML integration', 'Cloud computing', 'Microservices architecture', 'Remote work opportunities']
),
(
  'Data Scientist',
  'Analyze complex data sets to extract insights, build predictive models, and help organizations make data-driven decisions.',
  'Data Science',
  ARRAY['Python', 'Statistics', 'Machine Learning', 'Data Analysis', 'SQL', 'R', 'TensorFlow', 'Pandas'],
  'masters',
  70000,
  160000,
  'excellent',
  ARRAY['Clean and analyze data', 'Build machine learning models', 'Create visualizations', 'Present findings to stakeholders', 'Deploy models to production'],
  ARRAY['Data Analyst', 'Data Scientist', 'Senior Data Scientist', 'Lead Data Scientist', 'Chief Data Officer'],
  ARRAY['Deep learning applications', 'AutoML tools', 'Big data processing', 'Real-time analytics']
),
(
  'UI/UX Designer',
  'Create user-centered designs for digital products. Conduct user research, create wireframes and prototypes, and ensure excellent user experiences.',
  'Design',
  ARRAY['UI Design', 'UX Design', 'User Research', 'Wireframing', 'Prototyping', 'Figma', 'Adobe XD', 'HTML/CSS'],
  'bachelors',
  55000,
  130000,
  'good',
  ARRAY['Conduct user research', 'Create wireframes and mockups', 'Design user interfaces', 'Prototype interactions', 'Conduct usability testing'],
  ARRAY['Junior Designer', 'UI/UX Designer', 'Senior Designer', 'Lead Designer', 'Design Director'],
  ARRAY['Design systems', 'Accessibility focus', 'AI-assisted design', 'Motion design']
),
(
  'Product Manager',
  'Define product vision and strategy, prioritize features, and work with cross-functional teams to deliver successful products.',
  'Product Management',
  ARRAY['Product Strategy', 'Roadmapping', 'User Stories', 'Data Analysis', 'Communication', 'Agile', 'Stakeholder Management'],
  'bachelors',
  80000,
  170000,
  'excellent',
  ARRAY['Define product vision', 'Create product roadmap', 'Prioritize features', 'Work with engineering teams', 'Analyze product metrics', 'Communicate with stakeholders'],
  ARRAY['Associate PM', 'Product Manager', 'Senior PM', 'Group PM', 'VP of Product'],
  ARRAY['Data-driven decisions', 'Customer-centric approach', 'AI product features', 'Platform thinking']
),
(
  'Digital Marketing Specialist',
  'Develop and execute digital marketing campaigns across various channels to reach target audiences and drive business growth.',
  'Marketing',
  ARRAY['SEO', 'SEM', 'Social Media Marketing', 'Content Marketing', 'Analytics', 'Google Ads', 'Facebook Ads', 'Email Marketing'],
  'bachelors',
  45000,
  100000,
  'good',
  ARRAY['Plan marketing campaigns', 'Manage social media accounts', 'Optimize SEO', 'Run paid advertising', 'Analyze campaign performance', 'Create content strategy'],
  ARRAY['Marketing Coordinator', 'Digital Marketing Specialist', 'Marketing Manager', 'Marketing Director', 'CMO'],
  ARRAY['Influencer marketing', 'Video content', 'Marketing automation', 'Personalization']
),
(
  'Business Analyst',
  'Bridge the gap between business needs and technical solutions. Analyze processes, gather requirements, and recommend improvements.',
  'Business',
  ARRAY['Requirements Gathering', 'Data Analysis', 'Process Modeling', 'SQL', 'Excel', 'Communication', 'Problem Solving'],
  'bachelors',
  55000,
  120000,
  'good',
  ARRAY['Gather business requirements', 'Analyze business processes', 'Create documentation', 'Work with stakeholders', 'Support implementation', 'Identify improvements'],
  ARRAY['Junior Business Analyst', 'Business Analyst', 'Senior BA', 'Lead BA', 'Business Architecture Manager'],
  ARRAY['Process automation', 'Data analytics focus', 'Agile methodologies', 'Digital transformation']
),
(
  'Cybersecurity Analyst',
  'Protect organizations from cyber threats by monitoring systems, identifying vulnerabilities, and implementing security measures.',
  'Security',
  ARRAY['Network Security', 'Threat Analysis', 'Security Tools', 'Linux', 'Firewalls', 'Incident Response', 'Risk Assessment'],
  'bachelors',
  65000,
  140000,
  'excellent',
  ARRAY['Monitor security systems', 'Investigate security incidents', 'Implement security measures', 'Conduct vulnerability assessments', 'Create security policies', 'Train employees'],
  ARRAY['Security Analyst', 'Senior Security Analyst', 'Security Engineer', 'Security Architect', 'CISO'],
  ARRAY['Cloud security', 'Zero trust architecture', 'AI-powered threats', 'Compliance requirements']
),
(
  'Financial Analyst',
  'Analyze financial data, create reports, and provide insights to help businesses make informed financial decisions.',
  'Finance',
  ARRAY['Financial Modeling', 'Excel', 'Data Analysis', 'Forecasting', 'Reporting', 'Accounting', 'SQL'],
  'bachelors',
  60000,
  130000,
  'good',
  ARRAY['Create financial models', 'Analyze financial statements', 'Prepare reports', 'Forecast trends', 'Support budgeting', 'Present to management'],
  ARRAY['Junior Analyst', 'Financial Analyst', 'Senior Analyst', 'Finance Manager', 'CFO'],
  ARRAY['Automation tools', 'Real-time analytics', 'ESG reporting', 'FinTech integration']
),
(
  'Content Writer',
  'Create engaging written content for various platforms including websites, blogs, social media, and marketing materials.',
  'Writing',
  ARRAY['Writing', 'Editing', 'SEO', 'Research', 'Storytelling', 'Grammar', 'Content Strategy'],
  'bachelors',
  40000,
  85000,
  'moderate',
  ARRAY['Write articles and blog posts', 'Edit and proofread content', 'Conduct research', 'Optimize for SEO', 'Meet deadlines', 'Collaborate with marketing team'],
  ARRAY['Junior Writer', 'Content Writer', 'Senior Writer', 'Content Manager', 'Content Director'],
  ARRAY['AI writing tools', 'Video scripts', 'Podcast content', 'Thought leadership']
),
(
  'HR Manager',
  'Oversee human resources operations including recruitment, employee relations, compensation, and organizational development.',
  'Human Resources',
  ARRAY['Recruitment', 'Employee Relations', 'HR Policies', 'Communication', 'Conflict Resolution', 'Performance Management'],
  'bachelors',
  55000,
  120000,
  'moderate',
  ARRAY['Manage recruitment', 'Handle employee relations', 'Develop HR policies', 'Conduct performance reviews', 'Manage compensation', 'Support training'],
  ARRAY['HR Coordinator', 'HR Specialist', 'HR Manager', 'HR Director', 'CHRO'],
  ARRAY['HR technology', 'Remote work policies', 'DEI initiatives', 'Employee wellbeing']
),
(
  'Mobile App Developer',
  'Develop applications for mobile devices using native or cross-platform technologies. Focus on iOS and/or Android platforms.',
  'Technology',
  ARRAY['Mobile Development', 'Swift', 'Kotlin', 'React Native', 'Flutter', 'UI/UX', 'API Integration'],
  'bachelors',
  60000,
  145000,
  'excellent',
  ARRAY['Develop mobile applications', 'Test on multiple devices', 'Optimize performance', 'Integrate APIs', 'Publish to app stores', 'Fix bugs'],
  ARRAY['Junior Mobile Developer', 'Mobile Developer', 'Senior Mobile Developer', 'Mobile Architect', 'Mobile Engineering Manager'],
  ARRAY['Cross-platform frameworks', '5G optimization', 'AR/VR features', 'Progressive web apps']
),
(
  'Graphic Designer',
  'Create visual concepts and designs for various media including print, digital, and branding materials.',
  'Design',
  ARRAY['Adobe Photoshop', 'Illustrator', 'InDesign', 'Typography', 'Color Theory', 'Layout Design', 'Branding'],
  'bachelors',
  40000,
  95000,
  'moderate',
  ARRAY['Create visual designs', 'Design logos and branding', 'Prepare print materials', 'Edit photos', 'Maintain brand guidelines', 'Present concepts to clients'],
  ARRAY['Junior Graphic Designer', 'Graphic Designer', 'Senior Designer', 'Art Director', 'Creative Director'],
  ARRAY['Motion graphics', '3D design', 'AI design tools', 'Sustainable design']
)
ON CONFLICT DO NOTHING;

-- ============================================================
-- INSERT 4 COUNSELORS
-- ============================================================

INSERT INTO counselors (
  full_name,
  email,
  title,
  bio,
  specializations,
  years_of_experience,
  hourly_rate,
  rating,
  total_sessions,
  credentials,
  availability,
  is_verified
) VALUES
(
  'Dr. Sarah Johnson',
  'sarah.johnson@studenthub.com',
  'Senior Career Counselor',
  'With over 15 years of experience in career counseling, I specialize in helping students transition into tech careers. Former software engineer turned career coach.',
  ARRAY['Software Engineering', 'Data Science', 'Career Transitions', 'Tech Industry'],
  15,
  120.00,
  4.9,
  450,
  ARRAY['PhD in Career Development', 'Certified Career Coach', 'Former Software Engineer at Google'],
  '{"monday": ["09:00-17:00"], "tuesday": ["09:00-17:00"], "wednesday": ["09:00-17:00"], "thursday": ["09:00-17:00"], "friday": ["09:00-15:00"]}'::jsonb,
  true
),
(
  'Michael Chen',
  'michael.chen@studenthub.com',
  'Tech Career Advisor',
  'Passionate about helping students break into the tech industry. I provide practical advice on job search, interview prep, and career growth.',
  ARRAY['Product Management', 'UX Design', 'Career Strategy', 'Interview Preparation'],
  8,
  85.00,
  4.8,
  280,
  ARRAY['MBA from Stanford', 'Former Product Manager at Meta', 'Certified Career Development Facilitator'],
  '{"monday": ["10:00-18:00"], "wednesday": ["10:00-18:00"], "friday": ["10:00-18:00"], "saturday": ["09:00-13:00"]}'::jsonb,
  true
),
(
  'Emily Rodriguez',
  'emily.rodriguez@studenthub.com',
  'Business & Marketing Career Coach',
  'Helping students discover their path in business, marketing, and finance. I focus on identifying strengths and building actionable career plans.',
  ARRAY['Marketing', 'Business Analysis', 'Finance', 'Career Planning'],
  10,
  95.00,
  4.7,
  320,
  ARRAY['MBA in Marketing', 'Certified Professional Career Coach', '10+ years in Corporate Marketing'],
  '{"tuesday": ["09:00-17:00"], "thursday": ["09:00-17:00"], "saturday": ["10:00-16:00"]}'::jsonb,
  true
),
(
  'David Kim',
  'david.kim@studenthub.com',
  'Career Development Specialist',
  'I work with students at all stages of their career journey, from choosing a major to landing their dream job. My approach is practical and results-oriented.',
  ARRAY['General Career Guidance', 'Resume Building', 'Job Search Strategy', 'Career Assessment'],
  12,
  75.00,
  4.9,
  520,
  ARRAY['Master in Counseling Psychology', 'Certified Career Counselor', 'Former University Career Services Director'],
  '{"monday": ["09:00-17:00"], "tuesday": ["09:00-17:00"], "wednesday": ["09:00-17:00"], "thursday": ["09:00-17:00"], "friday": ["09:00-17:00"]}'::jsonb,
  true
)
ON CONFLICT (email) DO NOTHING;

-- ============================================================
-- VERIFICATION QUERIES
-- ============================================================

DO $$
DECLARE
  career_count INTEGER;
  counselor_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO career_count FROM careers;
  SELECT COUNT(*) INTO counselor_count FROM counselors;
  
  RAISE NOTICE '';
  RAISE NOTICE '✅ SEED DATA INSERTED SUCCESSFULLY!';
  RAISE NOTICE '';
  RAISE NOTICE '📊 Data Summary:';
  RAISE NOTICE '   - Careers: % rows', career_count;
  RAISE NOTICE '   - Counselors: % rows', counselor_count;
  RAISE NOTICE '';
  RAISE NOTICE '🎓 Career Categories:';
  RAISE NOTICE '   - Technology (3 careers)';
  RAISE NOTICE '   - Data Science (1 career)';
  RAISE NOTICE '   - Design (2 careers)';
  RAISE NOTICE '   - Product Management (1 career)';
  RAISE NOTICE '   - Marketing (1 career)';
  RAISE NOTICE '   - Business (1 career)';
  RAISE NOTICE '   - Security (1 career)';
  RAISE NOTICE '   - Finance (1 career)';
  RAISE NOTICE '   - Writing (1 career)';
  RAISE NOTICE '';
  RAISE NOTICE '👥 Counselors:';
  RAISE NOTICE '   - Dr. Sarah Johnson ($120/hr) - Tech specialist';
  RAISE NOTICE '   - Michael Chen ($85/hr) - Product & UX';
  RAISE NOTICE '   - Emily Rodriguez ($95/hr) - Business & Marketing';
  RAISE NOTICE '   - David Kim ($75/hr) - General career guidance';
  RAISE NOTICE '';
  RAISE NOTICE '🚀 Ready to test the application!';
END $$;
