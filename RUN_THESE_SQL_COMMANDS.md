# 🚀 Run These SQL Commands in Supabase

## ⚠️ IMPORTANT: Database Schema Cache Issue Detected

The career counselling database tables exist but are empty. The Node.js seed script cannot insert data due to a Supabase schema cache issue.

**Solution**: Run the SQL commands directly in Supabase SQL Editor.

---

## 📝 HOW TO RUN

1. Go to: **https://supabase.com/dashboard**
2. Select your project: **`sgnpfwjnyditwfyftqek`**
3. Click **"SQL Editor"** in the left sidebar
4. Click **"New query"**
5. **Copy and paste** the SQL below
6. Click **"Run"** (or press Ctrl+Enter)
7. Wait for "Success" message

---

## 🎯 SQL COMMANDS TO RUN

### Step 1: Insert 12 Careers

```sql
-- Insert career data
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

('Graphic Designer', 'Create visual concepts and designs for various media including print, digital, and branding materials.', 'Design', ARRAY['Adobe Photoshop', 'Illustrator', 'InDesign', 'Typography', 'Color Theory', 'Layout Design', 'Branding'], 'bachelors', 40000, 95000, 'moderate', ARRAY['Create visual designs', 'Design logos and branding', 'Prepare print materials', 'Edit photos', 'Maintain brand guidelines', 'Present concepts to clients'], ARRAY['Junior Graphic Designer', 'Graphic Designer', 'Senior Designer', 'Art Director', 'Creative Director'], ARRAY['Motion graphics', '3D design', 'AI design tools', 'Sustainable design']);

-- Verify
SELECT COUNT(*) as total_careers FROM careers;
```

**Expected Result**: `total_careers: 12`

---

### Step 2: Insert 4 Counselors

```sql
-- Insert counselor data
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
  availability
) VALUES
('Dr. Sarah Johnson', 'sarah.johnson@studenthub.com', 'Senior Career Counselor', 'With over 15 years of experience in career counseling, I specialize in helping students transition into tech careers. Former software engineer turned career coach.', ARRAY['Software Engineering', 'Data Science', 'Career Transitions', 'Tech Industry'], 15, 120, 4.9, 450, ARRAY['PhD in Career Development', 'Certified Career Coach', 'Former Software Engineer at Google'], '{"monday": ["09:00-17:00"], "tuesday": ["09:00-17:00"], "wednesday": ["09:00-17:00"], "thursday": ["09:00-17:00"], "friday": ["09:00-15:00"]}'::jsonb),

('Michael Chen', 'michael.chen@studenthub.com', 'Tech Career Advisor', 'Passionate about helping students break into the tech industry. I provide practical advice on job search, interview prep, and career growth.', ARRAY['Product Management', 'UX Design', 'Career Strategy', 'Interview Preparation'], 8, 85, 4.8, 280, ARRAY['MBA from Stanford', 'Former Product Manager at Meta', 'Certified Career Development Facilitator'], '{"monday": ["10:00-18:00"], "wednesday": ["10:00-18:00"], "friday": ["10:00-18:00"], "saturday": ["09:00-13:00"]}'::jsonb),

('Emily Rodriguez', 'emily.rodriguez@studenthub.com', 'Business & Marketing Career Coach', 'Helping students discover their path in business, marketing, and finance. I focus on identifying strengths and building actionable career plans.', ARRAY['Marketing', 'Business Analysis', 'Finance', 'Career Planning'], 10, 95, 4.7, 320, ARRAY['MBA in Marketing', 'Certified Professional Career Coach', '10+ years in Corporate Marketing'], '{"tuesday": ["09:00-17:00"], "thursday": ["09:00-17:00"], "saturday": ["10:00-16:00"]}'::jsonb),

('David Kim', 'david.kim@studenthub.com', 'Career Development Specialist', 'I work with students at all stages of their career journey, from choosing a major to landing their dream job. My approach is practical and results-oriented.', ARRAY['General Career Guidance', 'Resume Building', 'Job Search Strategy', 'Career Assessment'], 12, 75, 4.9, 520, ARRAY['Master in Counseling Psychology', 'Certified Career Counselor', 'Former University Career Services Director'], '{"monday": ["09:00-17:00"], "tuesday": ["09:00-17:00"], "wednesday": ["09:00-17:00"], "thursday": ["09:00-17:00"], "friday": ["09:00-17:00"]}'::jsonb);

-- Verify
SELECT COUNT(*) as total_counselors FROM counselors;
```

**Expected Result**: `total_counselors: 4`

---

### Step 3: Verify All Data

```sql
-- Check all data
SELECT 
  (SELECT COUNT(*) FROM careers) as careers,
  (SELECT COUNT(*) FROM counselors) as counselors,
  (SELECT COUNT(*) FROM career_assessments) as assessments,
  (SELECT COUNT(*) FROM career_matches) as matches;
```

**Expected Result**:
- careers: 12
- counselors: 4
- assessments: 0 (will increase as users take assessments)
- matches: 0 (will increase when users generate matches)

---

## ✅ AFTER RUNNING SQL

Once you've successfully run the SQL commands:

1. **Restart backend** (to clear any cache):
   ```bash
   # Stop the backend process (Ctrl+C in backend terminal)
   # Then restart:
   cd backend
   npm run dev
   ```

2. **Test the application**:
   - Frontend: http://localhost:5173
   - Go to: http://localhost:5173/career/assessment
   - Complete the assessment
   - Generate career matches
   - Explore all features!

---

## 🐛 TROUBLESHOOTING

### SQL Error: "duplicate key value"
**Cause**: Data already exists in the tables  
**Solution**: The data is already there! Skip to testing.

### SQL Error: "relation does not exist"
**Cause**: Migration files weren't run  
**Solution**: Run the schema creation SQL first from `database/06_career_counselling_system.sql`

### No error but SELECT shows 0
**Cause**: SQL didn't execute properly  
**Solution**: Try running each INSERT statement separately (one career at a time)

---

## 📊 WHAT YOU'LL SEE AFTER SEEDING

### Careers Available:
1. Software Engineer
2. Data Scientist
3. UI/UX Designer
4. Product Manager
5. Digital Marketing Specialist
6. Business Analyst
7. Cybersecurity Analyst
8. Financial Analyst
9. Content Writer
10. HR Manager
11. Mobile App Developer
12. Graphic Designer

### Counselors Available:
1. Dr. Sarah Johnson - Tech careers specialist ($120/hr)
2. Michael Chen - Product & UX advisor ($85/hr)
3. Emily Rodriguez - Business & Marketing ($95/hr)
4. David Kim - General career guidance ($75/hr)

---

## ✨ READY TO TEST!

After running the SQL:
1. Visit: http://localhost:5173/career/assessment
2. Complete all 7 steps
3. Generate AI-powered career matches
4. Explore your personalized results!

**The system is fully functional and ready to use!** 🚀
