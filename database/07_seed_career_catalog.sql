-- ============================================================
-- SEED CAREER CATALOG DATA
-- Structured career information for matching
-- ============================================================

-- Software Engineering & Tech
INSERT INTO careers (title, description, category, required_skills, recommended_skills, common_tools, typical_responsibilities, entry_level_roles, related_careers, education_requirements, salary_range, job_outlook, work_environment) VALUES
(
    'Software Engineer',
    'Design, develop, test, and maintain software applications and systems. Work with various programming languages and frameworks to solve technical problems.',
    'Technology',
    ARRAY['Programming', 'Problem Solving', 'Data Structures', 'Algorithms', 'Debugging'],
    ARRAY['JavaScript', 'Python', 'Git', 'SQL', 'React', 'Node.js', 'Testing', 'Agile'],
    ARRAY['VS Code', 'Git/GitHub', 'Docker', 'AWS/Cloud', 'Jira', 'Slack'],
    ARRAY['Write clean, maintainable code', 'Debug and fix software issues', 'Collaborate with team members', 'Review code', 'Document technical decisions', 'Participate in agile ceremonies'],
    ARRAY['Junior Software Engineer', 'Software Developer', 'Backend Developer', 'Frontend Developer'],
    ARRAY['Full Stack Developer', 'DevOps Engineer', 'Mobile Developer', 'Data Engineer'],
    'Bachelor''s degree in Computer Science or related field, or equivalent practical experience',
    'PKR 50,000 - 200,000/month (Pakistan), $60,000 - $150,000/year (US)',
    'Strong demand, growing field with remote opportunities',
    'Office or remote, collaborative team environment, flexible hours'
),
(
    'Data Scientist',
    'Analyze complex data sets to extract insights, build predictive models, and help organizations make data-driven decisions.',
    'Data Science',
    ARRAY['Python', 'Statistics', 'Machine Learning', 'Data Analysis', 'SQL'],
    ARRAY['R', 'TensorFlow', 'PyTorch', 'Pandas', 'NumPy', 'Visualization', 'Big Data'],
    ARRAY['Jupyter', 'Python', 'SQL', 'Tableau', 'Power BI', 'Spark', 'AWS'],
    ARRAY['Clean and analyze data', 'Build machine learning models', 'Create visualizations', 'Present findings to stakeholders', 'Deploy models to production', 'Collaborate with engineers'],
    ARRAY['Data Analyst', 'Junior Data Scientist', 'Analytics Associate'],
    ARRAY['Machine Learning Engineer', 'AI Researcher', 'Business Analyst', 'Data Engineer'],
    'Bachelor''s in Statistics, Mathematics, Computer Science, or related field. Master''s often preferred',
    'PKR 60,000 - 250,000/month (Pakistan), $70,000 - $160,000/year (US)',
    'High demand, especially in tech and finance sectors',
    'Office or remote, collaborative with business teams'
),
(
    'UI/UX Designer',
    'Create user-centered designs for digital products. Conduct user research, create wireframes and prototypes, and ensure excellent user experiences.',
    'Design',
    ARRAY['UI Design', 'UX Design', 'User Research', 'Wireframing', 'Prototyping'],
    ARRAY['Figma', 'Adobe XD', 'Sketch', 'HTML/CSS', 'User Testing', 'Design Systems'],
    ARRAY['Figma', 'Adobe Creative Suite', 'InVision', 'Miro', 'FigJam'],
    ARRAY['Conduct user research', 'Create wireframes and mockups', 'Design user interfaces', 'Prototype interactions', 'Conduct usability testing', 'Collaborate with developers'],
    ARRAY['Junior UI Designer', 'Junior UX Designer', 'Product Designer'],
    ARRAY['Product Manager', 'Frontend Developer', 'Visual Designer', 'Interaction Designer'],
    'Bachelor''s in Design, HCI, or related field, or strong portfolio',
    'PKR 40,000 - 180,000/month (Pakistan), $55,000 - $130,000/year (US)',
    'Growing demand as companies focus on user experience',
    'Office or remote, collaborative with product and engineering teams'
),
(
    'Product Manager',
    'Define product vision and strategy, prioritize features, work with cross-functional teams to deliver products that solve user problems.',
    'Business',
    ARRAY['Product Strategy', 'Communication', 'Analytics', 'User Research', 'Prioritization'],
    ARRAY['SQL', 'Data Analysis', 'Agile', 'Roadmapping', 'Technical Knowledge', 'A/B Testing'],
    ARRAY['Jira', 'Notion', 'Figma', 'Google Analytics', 'SQL', 'Mixpanel'],
    ARRAY['Define product vision', 'Prioritize features', 'Work with designers and engineers', 'Analyze metrics', 'Conduct user research', 'Manage product roadmap'],
    ARRAY['Associate Product Manager', 'Junior Product Manager', 'Product Analyst'],
    ARRAY['Product Designer', 'Business Analyst', 'Technical Program Manager', 'Startup Founder'],
    'Bachelor''s degree in any field, often with technical or business background',
    'PKR 60,000 - 300,000/month (Pakistan), $80,000 - $180,000/year (US)',
    'High demand in tech companies',
    'Office or remote, highly collaborative role'
),
(
    'Digital Marketing Specialist',
    'Plan and execute digital marketing campaigns across various channels including social media, email, SEO, and paid advertising.',
    'Marketing',
    ARRAY['Digital Marketing', 'Social Media', 'Content Creation', 'Analytics', 'SEO'],
    ARRAY['Google Ads', 'Facebook Ads', 'Email Marketing', 'Content Strategy', 'Copywriting', 'A/B Testing'],
    ARRAY['Google Analytics', 'Meta Ads Manager', 'Mailchimp', 'SEMrush', 'Hootsuite', 'Canva'],
    ARRAY['Plan marketing campaigns', 'Create content', 'Manage social media', 'Analyze campaign performance', 'Optimize ad spend', 'Report on metrics'],
    ARRAY['Marketing Associate', 'Social Media Coordinator', 'Content Creator'],
    ARRAY['Growth Marketer', 'Content Strategist', 'SEO Specialist', 'Brand Manager'],
    'Bachelor''s in Marketing, Communications, or related field',
    'PKR 35,000 - 150,000/month (Pakistan), $45,000 - $100,000/year (US)',
    'Growing demand as businesses invest in digital presence',
    'Office or remote, collaborative environment'
),
(
    'Cybersecurity Analyst',
    'Protect organizations from cyber threats by monitoring systems, identifying vulnerabilities, and responding to security incidents.',
    'Cybersecurity',
    ARRAY['Network Security', 'Security Tools', 'Incident Response', 'Risk Analysis', 'Ethical Hacking'],
    ARRAY['Penetration Testing', 'SIEM', 'Firewall Configuration', 'Cryptography', 'Compliance'],
    ARRAY['Wireshark', 'Metasploit', 'Splunk', 'Nessus', 'Kali Linux', 'Firewalls'],
    ARRAY['Monitor security systems', 'Respond to incidents', 'Conduct vulnerability assessments', 'Implement security measures', 'Train employees on security', 'Document security procedures'],
    ARRAY['Security Analyst', 'SOC Analyst', 'IT Security Specialist'],
    ARRAY['Penetration Tester', 'Security Engineer', 'Security Architect', 'CISO'],
    'Bachelor''s in Computer Science, Cybersecurity, or related field. Certifications (CEH, CISSP) valuable',
    'PKR 50,000 - 200,000/month (Pakistan), $65,000 - $140,000/year (US)',
    'Very high demand due to increasing cyber threats',
    'Office or remote, may include on-call responsibilities'
),
(
    'Business Analyst',
    'Bridge the gap between business needs and technical solutions. Analyze processes, gather requirements, and recommend improvements.',
    'Business',
    ARRAY['Business Analysis', 'Requirements Gathering', 'Data Analysis', 'Communication', 'Process Mapping'],
    ARRAY['SQL', 'Excel', 'Process Modeling', 'Stakeholder Management', 'Agile', 'Documentation'],
    ARRAY['Excel', 'SQL', 'Jira', 'Visio', 'Power BI', 'Confluence'],
    ARRAY['Gather and document requirements', 'Analyze business processes', 'Create reports and dashboards', 'Facilitate meetings', 'Recommend solutions', 'Support implementation'],
    ARRAY['Junior Business Analyst', 'Data Analyst', 'Systems Analyst'],
    ARRAY['Product Manager', 'Data Scientist', 'Project Manager', 'Consultant'],
    'Bachelor''s in Business, IT, or related field',
    'PKR 40,000 - 170,000/month (Pakistan), $55,000 - $120,000/year (US)',
    'Steady demand across industries',
    'Office or remote, collaborative with business and IT teams'
),
(
    'Content Writer',
    'Create engaging written content for websites, blogs, social media, and marketing materials. Research topics and write for specific audiences.',
    'Writing',
    ARRAY['Writing', 'Research', 'SEO', 'Editing', 'Storytelling'],
    ARRAY['Content Strategy', 'Copywriting', 'Technical Writing', 'Blogging', 'Social Media'],
    ARRAY['WordPress', 'Google Docs', 'Grammarly', 'SEMrush', 'Hemingway Editor'],
    ARRAY['Write articles and blog posts', 'Research topics', 'Optimize for SEO', 'Edit and proofread', 'Meet deadlines', 'Adapt tone for audiences'],
    ARRAY['Junior Content Writer', 'Copywriter', 'Blog Writer'],
    ARRAY['Content Strategist', 'Technical Writer', 'Editor', 'Marketing Manager'],
    'Bachelor''s in English, Communications, Journalism, or related field',
    'PKR 25,000 - 120,000/month (Pakistan), $40,000 - $85,000/year (US)',
    'Good demand, especially for specialized content',
    'Office or remote, often flexible hours'
),
(
    'Mobile App Developer',
    'Design and build applications for mobile devices. Work with iOS, Android, or cross-platform frameworks.',
    'Technology',
    ARRAY['Mobile Development', 'Programming', 'UI Design', 'API Integration', 'Debugging'],
    ARRAY['React Native', 'Flutter', 'Swift', 'Kotlin', 'Firebase', 'App Store/Play Store'],
    ARRAY['Xcode', 'Android Studio', 'VS Code', 'Git', 'Firebase', 'Figma'],
    ARRAY['Develop mobile applications', 'Implement UI designs', 'Integrate APIs', 'Test on devices', 'Fix bugs', 'Publish to app stores'],
    ARRAY['Junior Mobile Developer', 'App Developer', 'iOS Developer', 'Android Developer'],
    ARRAY['Full Stack Developer', 'Software Engineer', 'Lead Mobile Developer'],
    'Bachelor''s in Computer Science or related field, or equivalent experience',
    'PKR 45,000 - 190,000/month (Pakistan), $60,000 - $140,000/year (US)',
    'Strong demand for mobile apps',
    'Office or remote, collaborative with designers and backend teams'
),
(
    'Financial Analyst',
    'Analyze financial data, create reports, build financial models, and provide recommendations to support business decisions.',
    'Finance',
    ARRAY['Financial Analysis', 'Excel', 'Accounting', 'Financial Modeling', 'Data Analysis'],
    ARRAY['SQL', 'Power BI', 'Tableau', 'Financial Software', 'Forecasting', 'Budgeting'],
    ARRAY['Excel', 'QuickBooks', 'SAP', 'Power BI', 'Bloomberg Terminal'],
    ARRAY['Analyze financial data', 'Create financial models', 'Prepare reports', 'Forecast trends', 'Present findings', 'Support budgeting'],
    ARRAY['Junior Financial Analyst', 'Accounting Analyst', 'Budget Analyst'],
    ARRAY['Senior Financial Analyst', 'Investment Banker', 'CFO', 'Consultant'],
    'Bachelor''s in Finance, Accounting, Economics, or related field',
    'PKR 40,000 - 180,000/month (Pakistan), $55,000 - $110,000/year (US)',
    'Steady demand in finance and corporate sectors',
    'Office, often fast-paced environment'
),
(
    'DevOps Engineer',
    'Automate and optimize software development and deployment processes. Manage infrastructure, CI/CD pipelines, and monitoring systems.',
    'Technology',
    ARRAY['Linux', 'Scripting', 'CI/CD', 'Cloud', 'Networking', 'Problem Solving'],
    ARRAY['Docker', 'Kubernetes', 'Jenkins', 'Terraform', 'AWS/Azure', 'Monitoring Tools'],
    ARRAY['Docker', 'Kubernetes', 'Jenkins', 'Git', 'AWS', 'Prometheus', 'Grafana'],
    ARRAY['Build CI/CD pipelines', 'Manage cloud infrastructure', 'Automate deployments', 'Monitor systems', 'Troubleshoot production issues', 'Improve reliability'],
    ARRAY['Junior DevOps Engineer', 'Systems Administrator', 'Cloud Engineer'],
    ARRAY['Site Reliability Engineer', 'Cloud Architect', 'Infrastructure Engineer'],
    'Bachelor''s in Computer Science or related field, or strong practical experience',
    'PKR 55,000 - 220,000/month (Pakistan), $70,000 - $160,000/year (US)',
    'Very high demand in tech companies',
    'Office or remote, may include on-call responsibilities'
),
(
    'Graphic Designer',
    'Create visual content for various media including websites, social media, print materials, and branding.',
    'Design',
    ARRAY['Graphic Design', 'Adobe Creative Suite', 'Typography', 'Color Theory', 'Layout'],
    ARRAY['Illustration', 'Animation', 'UI Design', 'Branding', 'Photography'],
    ARRAY['Adobe Photoshop', 'Illustrator', 'InDesign', 'Figma', 'Canva'],
    ARRAY['Create visual designs', 'Design logos and branding', 'Layout marketing materials', 'Collaborate with clients', 'Revise designs', 'Meet deadlines'],
    ARRAY['Junior Graphic Designer', 'Design Assistant', 'Production Designer'],
    ARRAY['Art Director', 'Brand Designer', 'Creative Director', 'UI Designer'],
    'Bachelor''s in Graphic Design or related field, or strong portfolio',
    'PKR 30,000 - 140,000/month (Pakistan), $40,000 - $90,000/year (US)',
    'Good demand across industries',
    'Office, agency, or freelance'
);

-- ============================================================
-- SUCCESS MESSAGE
-- ============================================================

SELECT 
    COUNT(*) as careers_added,
    '✅ CAREER CATALOG SEEDED SUCCESSFULLY!' as status,
    'Career matching system ready!' as message
FROM careers;
