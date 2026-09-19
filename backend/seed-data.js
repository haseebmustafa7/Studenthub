// Seed Career and Counselor Data
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: './.env' })

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

// Career data
const careers = [
  {
    title: 'Software Engineer',
    description: 'Design, develop, test, and maintain software applications and systems. Work with various programming languages and frameworks to solve technical problems.',
    category: 'Technology',
    required_skills: ['Programming', 'Problem Solving', 'Data Structures', 'Algorithms', 'Debugging', 'JavaScript', 'Python', 'Git', 'SQL'],
    typical_education: 'bachelors',
    salary_range_min: 60000,
    salary_range_max: 150000,
    growth_outlook: 'excellent',
    typical_responsibilities: ['Write clean, maintainable code', 'Debug and fix software issues', 'Collaborate with team members', 'Review code', 'Document technical decisions'],
    career_path: ['Junior Developer', 'Software Engineer', 'Senior Engineer', 'Tech Lead', 'Engineering Manager'],
    industry_trends: ['AI/ML integration', 'Cloud computing', 'Microservices architecture', 'Remote work opportunities']
  },
  {
    title: 'Data Scientist',
    description: 'Analyze complex data sets to extract insights, build predictive models, and help organizations make data-driven decisions.',
    category: 'Data Science',
    required_skills: ['Python', 'Statistics', 'Machine Learning', 'Data Analysis', 'SQL', 'R', 'TensorFlow', 'Pandas'],
    typical_education: 'masters',
    salary_range_min: 70000,
    salary_range_max: 160000,
    growth_outlook: 'excellent',
    typical_responsibilities: ['Clean and analyze data', 'Build machine learning models', 'Create visualizations', 'Present findings to stakeholders', 'Deploy models to production'],
    career_path: ['Data Analyst', 'Data Scientist', 'Senior Data Scientist', 'Lead Data Scientist', 'Chief Data Officer'],
    industry_trends: ['Deep learning applications', 'AutoML tools', 'Big data processing', 'Real-time analytics']
  },
  {
    title: 'UI/UX Designer',
    description: 'Create user-centered designs for digital products. Conduct user research, create wireframes and prototypes, and ensure excellent user experiences.',
    category: 'Design',
    required_skills: ['UI Design', 'UX Design', 'User Research', 'Wireframing', 'Prototyping', 'Figma', 'Adobe XD', 'HTML/CSS'],
    typical_education: 'bachelors',
    salary_range_min: 55000,
    salary_range_max: 130000,
    growth_outlook: 'good',
    typical_responsibilities: ['Conduct user research', 'Create wireframes and mockups', 'Design user interfaces', 'Prototype interactions', 'Conduct usability testing'],
    career_path: ['Junior Designer', 'UI/UX Designer', 'Senior Designer', 'Lead Designer', 'Design Director'],
    industry_trends: ['Design systems', 'Accessibility focus', 'AI-assisted design', 'Motion design']
  },
  {
    title: 'Product Manager',
    description: 'Define product vision and strategy, prioritize features, and work with cross-functional teams to deliver successful products.',
    category: 'Product Management',
    required_skills: ['Product Strategy', 'Roadmapping', 'User Stories', 'Data Analysis', 'Communication', 'Agile', 'Stakeholder Management'],
    typical_education: 'bachelors',
    salary_range_min: 80000,
    salary_range_max: 170000,
    growth_outlook: 'excellent',
    typical_responsibilities: ['Define product vision', 'Create product roadmap', 'Prioritize features', 'Work with engineering teams', 'Analyze product metrics', 'Communicate with stakeholders'],
    career_path: ['Associate PM', 'Product Manager', 'Senior PM', 'Group PM', 'VP of Product'],
    industry_trends: ['Data-driven decisions', 'Customer-centric approach', 'AI product features', 'Platform thinking']
  },
  {
    title: 'Digital Marketing Specialist',
    description: 'Develop and execute digital marketing campaigns across various channels to reach target audiences and drive business growth.',
    category: 'Marketing',
    required_skills: ['SEO', 'SEM', 'Social Media Marketing', 'Content Marketing', 'Analytics', 'Google Ads', 'Facebook Ads', 'Email Marketing'],
    typical_education: 'bachelors',
    salary_range_min: 45000,
    salary_range_max: 100000,
    growth_outlook: 'good',
    typical_responsibilities: ['Plan marketing campaigns', 'Manage social media accounts', 'Optimize SEO', 'Run paid advertising', 'Analyze campaign performance', 'Create content strategy'],
    career_path: ['Marketing Coordinator', 'Digital Marketing Specialist', 'Marketing Manager', 'Marketing Director', 'CMO'],
    industry_trends: ['Influencer marketing', 'Video content', 'Marketing automation', 'Personalization']
  },
  {
    title: 'Business Analyst',
    description: 'Bridge the gap between business needs and technical solutions. Analyze processes, gather requirements, and recommend improvements.',
    category: 'Business',
    required_skills: ['Requirements Gathering', 'Data Analysis', 'Process Modeling', 'SQL', 'Excel', 'Communication', 'Problem Solving'],
    typical_education: 'bachelors',
    salary_range_min: 55000,
    salary_range_max: 120000,
    growth_outlook: 'good',
    typical_responsibilities: ['Gather business requirements', 'Analyze business processes', 'Create documentation', 'Work with stakeholders', 'Support implementation', 'Identify improvements'],
    career_path: ['Junior Business Analyst', 'Business Analyst', 'Senior BA', 'Lead BA', 'Business Architecture Manager'],
    industry_trends: ['Process automation', 'Data analytics focus', 'Agile methodologies', 'Digital transformation']
  },
  {
    title: 'Cybersecurity Analyst',
    description: 'Protect organizations from cyber threats by monitoring systems, identifying vulnerabilities, and implementing security measures.',
    category: 'Security',
    required_skills: ['Network Security', 'Threat Analysis', 'Security Tools', 'Linux', 'Firewalls', 'Incident Response', 'Risk Assessment'],
    typical_education: 'bachelors',
    salary_range_min: 65000,
    salary_range_max: 140000,
    growth_outlook: 'excellent',
    typical_responsibilities: ['Monitor security systems', 'Investigate security incidents', 'Implement security measures', 'Conduct vulnerability assessments', 'Create security policies', 'Train employees'],
    career_path: ['Security Analyst', 'Senior Security Analyst', 'Security Engineer', 'Security Architect', 'CISO'],
    industry_trends: ['Cloud security', 'Zero trust architecture', 'AI-powered threats', 'Compliance requirements']
  },
  {
    title: 'Financial Analyst',
    description: 'Analyze financial data, create reports, and provide insights to help businesses make informed financial decisions.',
    category: 'Finance',
    required_skills: ['Financial Modeling', 'Excel', 'Data Analysis', 'Forecasting', 'Reporting', 'Accounting', 'SQL'],
    typical_education: 'bachelors',
    salary_range_min: 60000,
    salary_range_max: 130000,
    growth_outlook: 'good',
    typical_responsibilities: ['Create financial models', 'Analyze financial statements', 'Prepare reports', 'Forecast trends', 'Support budgeting', 'Present to management'],
    career_path: ['Junior Analyst', 'Financial Analyst', 'Senior Analyst', 'Finance Manager', 'CFO'],
    industry_trends: ['Automation tools', 'Real-time analytics', 'ESG reporting', 'FinTech integration']
  },
  {
    title: 'Content Writer',
    description: 'Create engaging written content for various platforms including websites, blogs, social media, and marketing materials.',
    category: 'Writing',
    required_skills: ['Writing', 'Editing', 'SEO', 'Research', 'Storytelling', 'Grammar', 'Content Strategy'],
    typical_education: 'bachelors',
    salary_range_min: 40000,
    salary_range_max: 85000,
    growth_outlook: 'moderate',
    typical_responsibilities: ['Write articles and blog posts', 'Edit and proofread content', 'Conduct research', 'Optimize for SEO', 'Meet deadlines', 'Collaborate with marketing team'],
    career_path: ['Junior Writer', 'Content Writer', 'Senior Writer', 'Content Manager', 'Content Director'],
    industry_trends: ['AI writing tools', 'Video scripts', 'Podcast content', 'Thought leadership']
  },
  {
    title: 'HR Manager',
    description: 'Oversee human resources operations including recruitment, employee relations, compensation, and organizational development.',
    category: 'Human Resources',
    required_skills: ['Recruitment', 'Employee Relations', 'HR Policies', 'Communication', 'Conflict Resolution', 'Performance Management'],
    typical_education: 'bachelors',
    salary_range_min: 55000,
    salary_range_max: 120000,
    growth_outlook: 'moderate',
    typical_responsibilities: ['Manage recruitment', 'Handle employee relations', 'Develop HR policies', 'Conduct performance reviews', 'Manage compensation', 'Support training'],
    career_path: ['HR Coordinator', 'HR Specialist', 'HR Manager', 'HR Director', 'CHRO'],
    industry_trends: ['HR technology', 'Remote work policies', 'DEI initiatives', 'Employee wellbeing']
  },
  {
    title: 'Mobile App Developer',
    description: 'Develop applications for mobile devices using native or cross-platform technologies. Focus on iOS and/or Android platforms.',
    category: 'Technology',
    required_skills: ['Mobile Development', 'Swift', 'Kotlin', 'React Native', 'Flutter', 'UI/UX', 'API Integration'],
    typical_education: 'bachelors',
    salary_range_min: 60000,
    salary_range_max: 145000,
    growth_outlook: 'excellent',
    typical_responsibilities: ['Develop mobile applications', 'Test on multiple devices', 'Optimize performance', 'Integrate APIs', 'Publish to app stores', 'Fix bugs'],
    career_path: ['Junior Mobile Developer', 'Mobile Developer', 'Senior Mobile Developer', 'Mobile Architect', 'Mobile Engineering Manager'],
    industry_trends: ['Cross-platform frameworks', '5G optimization', 'AR/VR features', 'Progressive web apps']
  },
  {
    title: 'Graphic Designer',
    description: 'Create visual concepts and designs for various media including print, digital, and branding materials.',
    category: 'Design',
    required_skills: ['Adobe Photoshop', 'Illustrator', 'InDesign', 'Typography', 'Color Theory', 'Layout Design', 'Branding'],
    typical_education: 'bachelors',
    salary_range_min: 40000,
    salary_range_max: 95000,
    growth_outlook: 'moderate',
    typical_responsibilities: ['Create visual designs', 'Design logos and branding', 'Prepare print materials', 'Edit photos', 'Maintain brand guidelines', 'Present concepts to clients'],
    career_path: ['Junior Graphic Designer', 'Graphic Designer', 'Senior Designer', 'Art Director', 'Creative Director'],
    industry_trends: ['Motion graphics', '3D design', 'AI design tools', 'Sustainable design']
  }
]

// Counselor data
const counselors = [
  {
    full_name: 'Dr. Sarah Johnson',
    email: 'sarah.johnson@studenthub.com',
    title: 'Senior Career Counselor',
    bio: 'With over 15 years of experience in career counseling, I specialize in helping students transition into tech careers. Former software engineer turned career coach.',
    specializations: ['Software Engineering', 'Data Science', 'Career Transitions', 'Tech Industry'],
    years_of_experience: 15,
    hourly_rate: 120,
    rating: 4.9,
    total_sessions: 450,
    credentials: ['PhD in Career Development', 'Certified Career Coach', 'Former Software Engineer at Google'],
    availability: { monday: ['09:00-17:00'], tuesday: ['09:00-17:00'], wednesday: ['09:00-17:00'], thursday: ['09:00-17:00'], friday: ['09:00-15:00'] }
  },
  {
    full_name: 'Michael Chen',
    email: 'michael.chen@studenthub.com',
    title: 'Tech Career Advisor',
    bio: 'Passionate about helping students break into the tech industry. I provide practical advice on job search, interview prep, and career growth.',
    specializations: ['Product Management', 'UX Design', 'Career Strategy', 'Interview Preparation'],
    years_of_experience: 8,
    hourly_rate: 85,
    rating: 4.8,
    total_sessions: 280,
    credentials: ['MBA from Stanford', 'Former Product Manager at Meta', 'Certified Career Development Facilitator'],
    availability: { monday: ['10:00-18:00'], wednesday: ['10:00-18:00'], friday: ['10:00-18:00'], saturday: ['09:00-13:00'] }
  },
  {
    full_name: 'Emily Rodriguez',
    email: 'emily.rodriguez@studenthub.com',
    title: 'Business & Marketing Career Coach',
    bio: 'Helping students discover their path in business, marketing, and finance. I focus on identifying strengths and building actionable career plans.',
    specializations: ['Marketing', 'Business Analysis', 'Finance', 'Career Planning'],
    years_of_experience: 10,
    hourly_rate: 95,
    rating: 4.7,
    total_sessions: 320,
    credentials: ['MBA in Marketing', 'Certified Professional Career Coach', '10+ years in Corporate Marketing'],
    availability: { tuesday: ['09:00-17:00'], thursday: ['09:00-17:00'], saturday: ['10:00-16:00'] }
  },
  {
    full_name: 'David Kim',
    email: 'david.kim@studenthub.com',
    title: 'Career Development Specialist',
    bio: 'I work with students at all stages of their career journey, from choosing a major to landing their dream job. My approach is practical and results-oriented.',
    specializations: ['General Career Guidance', 'Resume Building', 'Job Search Strategy', 'Career Assessment'],
    years_of_experience: 12,
    hourly_rate: 75,
    rating: 4.9,
    total_sessions: 520,
    credentials: ['Master in Counseling Psychology', 'Certified Career Counselor', 'Former University Career Services Director'],
    availability: { monday: ['09:00-17:00'], tuesday: ['09:00-17:00'], wednesday: ['09:00-17:00'], thursday: ['09:00-17:00'], friday: ['09:00-17:00'] }
  }
]

async function seedData() {
  console.log('🌱 Starting data seeding...\n')
  
  // Check if data already exists
  const { count: existingCareers } = await supabase
    .from('careers')
    .select('*', { count: 'exact', head: true })
  
  const { count: existingCounselors } = await supabase
    .from('counselors')
    .select('*', { count: 'exact', head: true })
  
  if (existingCareers > 0 || existingCounselors > 0) {
    console.log(`⚠️  Data already exists: ${existingCareers} careers, ${existingCounselors} counselors`)
    console.log('   Skipping seeding to avoid duplicates.')
    console.log('   If you want to reseed, manually delete existing data first.')
    return
  }
  
  // Insert careers one by one
  console.log('📚 Inserting careers...')
  let successCount = 0
  for (const career of careers) {
    const { error } = await supabase
      .from('careers')
      .insert(career)
    
    if (error) {
      console.error(`❌ Error inserting "${career.title}":`, error.message)
    } else {
      successCount++
      process.stdout.write('.')
    }
  }
  console.log(`\n✅ Inserted ${successCount}/${careers.length} careers`)
  
  // Insert counselors one by one
  console.log('\n👥 Inserting counselors...')
  successCount = 0
  for (const counselor of counselors) {
    const { error } = await supabase
      .from('counselors')
      .insert(counselor)
    
    if (error) {
      console.error(`❌ Error inserting "${counselor.full_name}":`, error.message)
    } else {
      successCount++
      process.stdout.write('.')
    }
  }
  console.log(`\n✅ Inserted ${successCount}/${counselors.length} counselors`)
  
  // Verify
  console.log('\n🔍 Verifying data...')
  const { count: careerCount } = await supabase
    .from('careers')
    .select('*', { count: 'exact', head: true })
  
  const { count: counselorCount } = await supabase
    .from('counselors')
    .select('*', { count: 'exact', head: true })
  
  console.log(`   Careers in database: ${careerCount}`)
  console.log(`   Counselors in database: ${counselorCount}`)
  
  console.log('\n✅ Data seeding complete!')
}

seedData()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('\n❌ Seeding failed:', err.message)
    process.exit(1)
  })
