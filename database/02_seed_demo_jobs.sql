-- Seed Demo Jobs for StudentHub
-- This script adds realistic Pakistani tech company jobs with locations
-- Safe to run multiple times (uses INSERT ... ON CONFLICT DO NOTHING pattern)

-- First, ensure we have a demo company user for these jobs
-- Note: In production, these would be created through company registration

-- Insert demo jobs (they will be associated with admin or a demo company account)
-- Using realistic Pakistani tech companies and locations

-- Lahore Jobs (Latitude: 31.5204, Longitude: 74.3587)
INSERT INTO jobs (
    title, company_name, description, requirements, responsibilities, benefits,
    location, city, country, latitude, longitude,
    job_type, work_mode, category, 
    salary_min, salary_max,
    skills, status, is_active,
    contact_email, application_deadline
) VALUES
(
    'Software Engineer Intern',
    'Systems Limited',
    'Join our engineering team for a summer internship working on cutting-edge enterprise solutions. You will work with experienced developers on real-world projects using modern technologies.',
    'Currently enrolled in Computer Science or Software Engineering program
• Strong understanding of OOP concepts
• Proficiency in Java or C#
• Basic understanding of databases (SQL)
• Good communication skills',
    '• Develop and test software modules
• Participate in code reviews
• Work with senior developers on feature development
• Document code and technical specifications
• Participate in daily stand-ups and sprint planning',
    '• Competitive stipend
• Mentorship from senior engineers
• Hands-on experience with enterprise projects
• Certificate of completion
• Potential for full-time employment',
    'DHA Phase 5, Lahore', 'Lahore', 'Pakistan', 31.4697, 74.3895,
    'internship', 'hybrid', 'Software Engineering',
    30000, 45000,
    'Java, C#, SQL, Git, Agile',
    'active', true,
    'careers@systemsltd.com',
    '2026-12-31'
),
(
    'Full Stack Web Developer',
    'NetSol Technologies',
    'We are looking for an experienced Full Stack Developer to join our dynamic team. You will be responsible for developing and maintaining web applications for our global clients in the automotive finance industry.',
    '• Bachelor''s degree in Computer Science or related field
• 2+ years of experience in web development
• Strong proficiency in React.js and Node.js
• Experience with RESTful APIs
• Knowledge of database design (PostgreSQL/MySQL)
• Understanding of CI/CD pipelines',
    '• Design and develop responsive web applications
• Build RESTful APIs and microservices
• Collaborate with UX/UI designers
• Write clean, maintainable code
• Optimize applications for performance
• Mentor junior developers',
    '• Competitive salary package
• Health insurance
• Annual performance bonuses
• Professional development opportunities
• Modern office environment
• Flexible working hours',
    'Arfa Software Technology Park, Lahore', 'Lahore', 'Pakistan', 31.4706, 74.2669,
    'full-time', 'on-site', 'Web Development',
    80000, 150000,
    'React, Node.js, PostgreSQL, Express, REST APIs, Docker, Git',
    'active', true,
    'hr@netsoltech.com',
    '2026-10-15'
),

-- Islamabad Jobs (Latitude: 33.6844, Longitude: 73.0479)
(
    'AI/ML Engineer',
    'i2c Inc.',
    'Exciting opportunity to work on machine learning models for payment processing and fraud detection systems. Join our AI team and work on challenging problems at scale.',
    '• Master''s degree or Bachelor''s with strong ML background
• 1-2 years of experience in ML/AI projects
• Strong Python programming skills
• Experience with TensorFlow or PyTorch
• Understanding of supervised and unsupervised learning
• Knowledge of data preprocessing and feature engineering',
    '• Develop and train machine learning models
• Implement fraud detection algorithms
• Optimize model performance
• Deploy models to production
• Collaborate with data scientists and engineers
• Research and implement latest ML techniques',
    '• Excellent salary package
• Stock options
• Health and life insurance
• Annual training budget
• International exposure
• Relocation assistance',
    'Evacuee Trust Complex, Islamabad', 'Islamabad', 'Pakistan', 33.7182, 73.0605,
    'full-time', 'hybrid', 'AI/ML',
    120000, 200000,
    'Python, TensorFlow, PyTorch, Scikit-learn, SQL, AWS, Machine Learning',
    'active', true,
    'careers@i2cinc.com',
    '2026-11-30'
),
(
    'Data Scientist Intern',
    'LMKR',
    'Join our data science team working on energy sector analytics. Great opportunity to learn data analysis, visualization, and machine learning in a supportive environment.',
    '• Currently pursuing degree in Data Science, Statistics, or Computer Science
• Strong foundation in statistics and mathematics
• Programming skills in Python or R
• Familiarity with data visualization tools
• Analytical mindset and problem-solving skills',
    '• Analyze large datasets from oil & gas operations
• Create data visualizations and dashboards
• Assist in building predictive models
• Prepare reports and presentations
• Learn industry-standard data science tools
• Collaborate with domain experts',
    '• Competitive internship stipend
• Real-world data science experience
• Access to cutting-edge tools
• Mentorship program
• Certificate of completion
• Networking opportunities',
    'I-9 Markaz, Islamabad', 'Islamabad', 'Pakistan', 33.6973, 73.0515,
    'internship', 'on-site', 'Data Science',
    25000, 35000,
    'Python, R, Pandas, NumPy, Matplotlib, SQL, Statistics',
    'active', true,
    'hr@lmkr.com',
    '2026-09-30'
),

-- Karachi Jobs (Latitude: 24.8607, Longitude: 67.0011)
(
    'Senior UI/UX Designer',
    'TPS Worldwide',
    'We are seeking a talented UI/UX Designer to create exceptional user experiences for our enterprise software products. You will work closely with product managers and developers to design intuitive interfaces.',
    '• 3-5 years of UI/UX design experience
• Strong portfolio demonstrating UX process
• Proficiency in Figma, Adobe XD, or Sketch
• Understanding of user-centered design principles
• Experience with design systems
• Knowledge of front-end technologies (HTML/CSS)',
    '• Design user interfaces for web and mobile applications
• Create wireframes, prototypes, and mockups
• Conduct user research and usability testing
• Develop and maintain design systems
• Collaborate with developers for implementation
• Present designs to stakeholders',
    '• Attractive salary package
• Health insurance
• Annual bonuses
• Creative work environment
• Latest design tools and equipment
• Professional growth opportunities',
    'Clifton Block 5, Karachi', 'Karachi', 'Pakistan', 24.8138, 67.0278,
    'full-time', 'hybrid', 'UI/UX',
    90000, 160000,
    'Figma, Adobe XD, Sketch, Prototyping, User Research, Design Systems',
    'active', true,
    'careers@tpsworldwide.com',
    '2026-10-31'
),

-- Rawalpindi Jobs (Latitude: 33.5651, Longitude: 73.0169)
(
    'Digital Marketing Specialist',
    'Inbox Business Technologies',
    'Looking for a creative and data-driven Digital Marketing Specialist to develop and execute marketing campaigns for our software products and services.',
    '• Bachelor''s degree in Marketing or related field
• 1-2 years of digital marketing experience
• Knowledge of SEO, SEM, and social media marketing
• Experience with Google Analytics and Ads
• Content creation and copywriting skills
• Understanding of email marketing',
    '• Plan and execute digital marketing campaigns
• Manage social media accounts
• Create engaging content for various platforms
• Analyze campaign performance metrics
• Optimize SEO and SEM strategies
• Collaborate with design and sales teams',
    '• Competitive salary
• Performance bonuses
• Health insurance
• Creative freedom
• Modern office
• Work-life balance',
    'Bahria Town Phase 7, Rawalpindi', 'Rawalpindi', 'Pakistan', 33.5225, 73.1246,
    'full-time', 'on-site', 'Marketing',
    50000, 80000,
    'SEO, SEM, Google Analytics, Social Media Marketing, Content Creation, Email Marketing',
    'active', true,
    'hr@inboxbiz.com',
    '2026-12-15'
),

-- Remote Jobs
(
    'QA Automation Engineer',
    'Devsinc',
    'Remote opportunity for a QA Automation Engineer to work on test automation frameworks for international clients. Join a fast-growing company with a culture of innovation.',
    '• Bachelor''s degree in Computer Science
• 2+ years of QA automation experience
• Strong knowledge of Selenium, Cypress, or similar tools
• Experience with API testing (Postman, REST Assured)
• Programming skills in Java, Python, or JavaScript
• Understanding of CI/CD pipelines',
    '• Design and implement test automation frameworks
• Write and maintain automated test scripts
• Perform API and UI testing
• Integrate tests with CI/CD pipelines
• Report and track bugs
• Collaborate with development teams',
    '• Fully remote work
• Competitive salary
• Annual increments
• Health insurance
• Learning and development budget
• International client exposure
• Flexible hours',
    'Remote - Work from anywhere in Pakistan', 'Remote', 'Pakistan', NULL, NULL,
    'full-time', 'remote', 'QA',
    70000, 120000,
    'Selenium, Cypress, Java, Python, API Testing, Postman, CI/CD, Agile',
    'active', true,
    'careers@devsinc.com',
    '2027-01-31'
),
(
    'Frontend Developer (Part-time)',
    'TkXel',
    'Part-time opportunity for a Frontend Developer to work on exciting web projects. Perfect for students or professionals looking for flexible hours. Build modern web applications with React and TypeScript.',
    '• Strong knowledge of HTML, CSS, JavaScript
• Experience with React.js
• Familiarity with TypeScript (preferred)
• Understanding of responsive design
• Basic Git knowledge
• Portfolio of previous work',
    '• Develop responsive web interfaces
• Implement designs from Figma/XD
• Write clean, reusable code
• Fix bugs and optimize performance
• Participate in code reviews
• Collaborate with remote team',
    '• Flexible part-time hours (20-25 hours/week)
• Competitive hourly rate
• Remote work
• Opportunity to transition to full-time
• Learn from experienced developers
• Work on diverse projects',
    'Remote - Flexible', 'Remote', 'Pakistan', NULL, NULL,
    'part-time', 'remote', 'Web Development',
    40000, 60000,
    'HTML, CSS, JavaScript, React, TypeScript, Git, Responsive Design',
    'active', true,
    'jobs@tkxel.com',
    '2026-11-15'
)
ON CONFLICT DO NOTHING;

-- Update statistics
SELECT 'Demo jobs seeded successfully!' as message,
       COUNT(*) as total_jobs
FROM jobs;

-- Show summary
SELECT 
    category,
    job_type,
    work_mode,
    COUNT(*) as count
FROM jobs
WHERE is_active = true
GROUP BY category, job_type, work_mode
ORDER BY category, job_type;
