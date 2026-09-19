# StudentHub - Setup Instructions

## Prerequisites
✅ Node.js v24.19.0 - Installed
✅ npm - Installed

## Step 1: Install Dependencies

### Backend Installation
Open PowerShell or Command Prompt and run:

```powershell
cd "c:\Users\HP\OneDrive\Desktop\student-job-website\backend"
npm install
```

This will install:
- express
- cors
- helmet
- dotenv
- @supabase/supabase-js
- express-validator
- express-rate-limit

### Frontend Installation
In a new terminal window:

```powershell
cd "c:\Users\HP\OneDrive\Desktop\student-job-website\frontend"
npm install
```

This will install:
- react
- react-dom
- react-router-dom
- @supabase/supabase-js
- axios
- lucide-react
- vite
- tailwindcss
- @vitejs/plugin-react
- postcss
- autoprefixer

## Step 2: Set Up Supabase

### 2.1 Create Supabase Project
1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in (Free tier is sufficient)
3. Click "New Project"
4. Fill in:
   - Name: `studenthub`
   - Database Password: (create a strong password and save it)
   - Region: (choose closest to you)
   - Pricing Plan: Free
5. Click "Create new project" and wait for it to initialize (2-3 minutes)

### 2.2 Get Supabase Credentials
Once your project is ready:

1. Go to **Settings** (gear icon) → **API**
2. Copy these values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public** key (under Project API keys)
   - **service_role** key (under Project API keys - click "Reveal" to show it)

3. Go to **Settings** → **API** → **JWT Settings**
   - Copy the **JWT Secret**

### 2.3 Create Database Tables
1. In Supabase dashboard, go to **SQL Editor**
2. Click "New query"
3. Paste and run this SQL:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table
CREATE TABLE profiles (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    university VARCHAR(255),
    major VARCHAR(255),
    graduation_year INTEGER,
    phone VARCHAR(20),
    location VARCHAR(255),
    resume_url TEXT,
    bio TEXT,
    role VARCHAR(20) DEFAULT 'student' CHECK (role IN ('student', 'admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Jobs table
CREATE TABLE jobs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    company_logo_url TEXT,
    description TEXT NOT NULL,
    requirements TEXT,
    responsibilities TEXT,
    benefits TEXT,
    location VARCHAR(255) NOT NULL,
    job_type VARCHAR(50) CHECK (job_type IN ('internship', 'full-time', 'part-time')) NOT NULL,
    work_mode VARCHAR(50) CHECK (work_mode IN ('remote', 'on-site', 'hybrid')) DEFAULT 'on-site',
    salary_min INTEGER,
    salary_max INTEGER,
    category VARCHAR(100),
    application_deadline DATE,
    contact_email VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Applications table
CREATE TABLE applications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    job_id UUID REFERENCES jobs(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    resume_url TEXT,
    cover_letter TEXT,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'shortlisted', 'rejected')),
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(job_id, user_id)
);

-- Saved jobs table
CREATE TABLE saved_jobs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    job_id UUID REFERENCES jobs(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    saved_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(job_id, user_id)
);

-- Create indexes for better performance
CREATE INDEX idx_profiles_user_id ON profiles(user_id);
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_jobs_active ON jobs(is_active);
CREATE INDEX idx_jobs_type ON jobs(job_type);
CREATE INDEX idx_jobs_category ON jobs(category);
CREATE INDEX idx_applications_user_id ON applications(user_id);
CREATE INDEX idx_applications_job_id ON applications(job_id);
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_saved_jobs_user_id ON saved_jobs(user_id);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_jobs ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
    ON profiles FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Anyone can create a profile"
    ON profiles FOR INSERT
    WITH CHECK (true);

-- Jobs policies
CREATE POLICY "Anyone can view active jobs"
    ON jobs FOR SELECT
    USING (is_active = true OR auth.uid() = created_by);

CREATE POLICY "Admins can insert jobs"
    ON jobs FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Admins can update jobs"
    ON jobs FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Admins can delete jobs"
    ON jobs FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

-- Applications policies
CREATE POLICY "Users can view their own applications"
    ON applications FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create applications"
    ON applications FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all applications"
    ON applications FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Admins can update application status"
    ON applications FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

-- Saved jobs policies
CREATE POLICY "Users can view their saved jobs"
    ON saved_jobs FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can save jobs"
    ON saved_jobs FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unsave jobs"
    ON saved_jobs FOR DELETE
    USING (auth.uid() = user_id);
```

4. Click "Run" to execute the SQL

### 2.4 Create Admin User
1. In Supabase dashboard, go to **Authentication** → **Users**
2. Click "Add user" → "Create new user"
3. Fill in:
   - Email: `admin@studenthub.com` (or your preferred email)
   - Password: (create a strong password)
   - Auto Confirm User: ✅ Check this
4. Click "Create user"

5. Go to **SQL Editor** and run this query to make the user an admin:
```sql
-- Replace 'admin@studenthub.com' with your admin email
INSERT INTO profiles (user_id, full_name, role)
SELECT id, 'Admin User', 'admin'
FROM auth.users
WHERE email = 'admin@studenthub.com';
```

## Step 3: Configure Environment Variables

### Frontend Environment Variables
1. In the `frontend` folder, create a `.env` file
2. Copy the contents from `.env.example`
3. Fill in your Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key-here
VITE_API_URL=http://localhost:5000/api
```

### Backend Environment Variables
1. In the `backend` folder, create a `.env` file
2. Copy the contents from `.env.example`
3. Fill in your Supabase credentials:

```env
PORT=5000
NODE_ENV=development
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key-here
SUPABASE_JWT_SECRET=your-jwt-secret-here
CORS_ORIGIN=http://localhost:5173
```

⚠️ **IMPORTANT**: 
- Never commit `.env` files to version control
- The `.env` files are already in `.gitignore`
- Use the `service_role` key for backend (not the anon key)

## Step 4: Run the Application

### Start Backend Server
Open a terminal:

```powershell
cd "c:\Users\HP\OneDrive\Desktop\student-job-website\backend"
npm run dev
```

You should see:
```
🚀 Server running on http://localhost:5000
📝 Environment: development
```

### Start Frontend Development Server
Open a NEW terminal window:

```powershell
cd "c:\Users\HP\OneDrive\Desktop\student-job-website\frontend"
npm run dev
```

You should see:
```
VITE v5.x.x ready in xxx ms

➜  Local:   http://localhost:5173/
```

## Step 5: Access the Application

1. **Frontend**: Open [http://localhost:5173](http://localhost:5173) in your browser
2. **Backend API**: Backend is running at [http://localhost:5000](http://localhost:5000)

### Test the Application

#### As a Student:
1. Click "Sign Up"
2. Register with email and password
3. Browse jobs at `/jobs`
4. Apply for jobs
5. View your dashboard

#### As an Admin:
1. Login with the admin credentials you created
2. Go to Admin Dashboard
3. Add new jobs
4. View applications
5. Manage jobs

## Step 6: Add Sample Jobs (Optional)

To test the application, add some sample jobs:

1. Login as admin
2. Go to Admin Dashboard → Manage Jobs
3. Click "Add New Job"
4. Fill in the job details

Or use SQL Editor in Supabase:

```sql
INSERT INTO jobs (
    title, company_name, description, requirements, location, 
    job_type, work_mode, category, salary_min, salary_max
) VALUES
('Software Engineering Intern', 'TechCorp', 'Join our engineering team for a summer internship.', 'Computer Science student, JavaScript knowledge', 'San Francisco, CA', 'internship', 'hybrid', 'Engineering', 3000, 5000),
('Marketing Intern', 'StartupXYZ', 'Help us grow our brand and reach.', 'Marketing or Business major', 'Remote', 'internship', 'remote', 'Marketing', 2000, 3000),
('Data Analyst', 'DataCo', 'Analyze data and create insights.', 'Statistics or Data Science background, Python', 'New York, NY', 'full-time', 'on-site', 'Data Science', 60000, 80000);
```

## Troubleshooting

### Port Already in Use
If port 5173 or 5000 is already in use:

**Frontend**: Edit `frontend/vite.config.js` and change the port:
```js
server: {
  port: 3000, // Change this
}
```

**Backend**: Edit `backend/.env` and change:
```env
PORT=3000
```

### Supabase Connection Issues
- Double-check your `.env` files
- Ensure your Supabase project is active
- Verify the URLs and keys are correct (no extra spaces)

### Database Errors
- Make sure all SQL scripts ran successfully
- Check Supabase dashboard logs: Settings → Logs
- Verify RLS policies are enabled

### Module Not Found
```powershell
# Delete node_modules and reinstall
rm -r node_modules
npm install
```

## Next Steps

Once everything is working:

1. ✅ Test student registration and login
2. ✅ Test admin login
3. ✅ Add sample jobs as admin
4. ✅ Browse jobs as student
5. ✅ Apply for jobs
6. ✅ Check applications in admin dashboard

## Development Tips

- Backend runs with hot reload (changes restart server automatically)
- Frontend has HMR (Hot Module Replacement) - instant updates
- Check browser console for frontend errors
- Check terminal for backend errors
- Use Supabase dashboard to inspect database tables and data

## Need Help?

If you encounter issues:
1. Check the terminal output for error messages
2. Open browser DevTools (F12) and check Console tab
3. Review Supabase dashboard logs
4. Verify all environment variables are set correctly

---

**Ready to implement the remaining pages?** Let me know when Step 1-5 are complete, and I'll continue with creating all the page components!
