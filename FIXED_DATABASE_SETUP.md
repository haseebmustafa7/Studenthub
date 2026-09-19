

# ✅ Career Counselling Database - FIXED AND READY

## 🔍 Problem Identified

**Root Cause**: Schema mismatch between:
- Migration file (`06_career_counselling_system.sql`) - had old column names
- Backend implementation - expected different columns
- Seed data - used yet another structure

**Specific Issues**:
1. ❌ `careers` table had `education_requirements`, `salary_range` (text), `job_outlook`
2. ✅ Backend/Frontend expect `typical_education`, `salary_range_min/max` (integers), `growth_outlook`
3. ❌ `counselors` table had `expertise`, `professional_title`
4. ✅ Backend/Frontend expect `specializations`, `title`, `hourly_rate`, `rating`

---

## ✅ Solution Implemented

Created **3 new migration files**:

### 1. `database/06_career_counselling_system_FIXED.sql`
- Complete schema matching actual implementation
- All 7 tables with correct column names and types
- Proper indexes and constraints
- RLS policies for data security

### 2. `database/07_seed_career_data_FIXED.sql`
- 12 careers with correct structure
- 4 counselors with correct structure  
- Verification queries

### 3. `database/APPLY_THIS_MIGRATION.sql` ⭐ **USE THIS ONE**
- **Single consolidated file**
- Creates all tables + inserts seed data
- Safe to run multiple times
- Ready for Supabase SQL Editor

---

## 🚀 HOW TO FIX YOUR DATABASE

### Option 1: Supabase SQL Editor (RECOMMENDED)

**Step 1**: Go to Supabase
1. Open: https://supabase.com/dashboard
2. Select your project: `sgnpfwjnyditwfyftqek`
3. Click **"SQL Editor"** in left sidebar
4. Click **"New query"**

**Step 2**: Run Migration
1. Open `database/APPLY_THIS_MIGRATION.sql` in VS Code
2. Copy ALL content (Ctrl+A, Ctrl+C)
3. Paste into Supabase SQL Editor
4. Click **"Run"** or press `Ctrl+Enter`
5. Wait for success message (15-20 seconds)

**Step 3**: Verify Success
You should see in the output:
```
✅ MIGRATION COMPLETED SUCCESSFULLY!
📊 Database Summary:
   - Careers: 12 rows
   - Counselors: 4 rows
```

---

### Option 2: Using Supabase CLI (If configured)

```bash
# If you have Supabase CLI installed
supabase db reset  # Reset database (warning: deletes all data)
supabase db push   # Apply migrations
```

---

## 📊 What Gets Created

### Tables (7 total):

1. **careers** - 12 rows
   - Columns: `title`, `description`, `category`, `required_skills`, `typical_education`, `salary_range_min`, `salary_range_max`, `growth_outlook`, `typical_responsibilities`, `career_path`, `industry_trends`

2. **career_assessments** - User data
   - Student career assessment responses
   - One per user (unique constraint)

3. **career_matches** - User data
   - AI-generated career recommendations
   - Links students to matched careers

4. **skill_analyses** - User data
   - Skill gap analysis per career
   - Shows matching skills and gaps

5. **learning_roadmaps** - User data
   - Personalized learning plans
   - Stores phases and milestones as JSONB

6. **counselors** - 4 rows
   - Columns: `full_name`, `email`, `title`, `bio`, `specializations`, `years_of_experience`, `hourly_rate`, `rating`, `total_sessions`, `credentials`, `availability`

7. **counseling_sessions** - User data
   - Session bookings
   - Includes consent tracking

### Security (RLS):
- ✅ Students can only see their own assessment data
- ✅ Students can only see their own matches/analyses/roadmaps
- ✅ Students can only see their own sessions
- ✅ Everyone can view active careers
- ✅ Everyone can view verified counselors

---

## 🧪 Testing After Migration

### Step 1: Restart Backend
```bash
# Stop backend (Ctrl+C in terminal)
cd backend
npm run dev
```

### Step 2: Test Career API
Open new terminal:
```bash
curl http://localhost:5000/api/career/careers
```

**Expected**: JSON array with 12 careers

### Step 3: Test Counselors API
```bash
curl http://localhost:5000/api/counseling/counselors
```

**Expected**: JSON array with 4 counselors

### Step 4: Test Frontend
1. Open: http://localhost:5173
2. Login/Register as student
3. Go to: http://localhost:5173/career/assessment
4. Complete assessment (all 7 steps)
5. Generate career matches
6. View results!

---

## 📁 Schema Details

### careers Table
```sql
- id: UUID (primary key)
- title: VARCHAR(255)
- description: TEXT
- category: VARCHAR(100)
- required_skills: TEXT[] (array)
- typical_education: VARCHAR(100) -- 'bachelors', 'masters', etc.
- salary_range_min: INTEGER
- salary_range_max: INTEGER
- growth_outlook: VARCHAR(50) -- 'excellent', 'good', 'moderate'
- typical_responsibilities: TEXT[] (array)
- career_path: TEXT[] (array)
- industry_trends: TEXT[] (array)
- is_active: BOOLEAN
- created_at: TIMESTAMPTZ
- updated_at: TIMESTAMPTZ
```

### counselors Table
```sql
- id: UUID (primary key)
- full_name: VARCHAR(255)
- email: VARCHAR(255) UNIQUE
- title: VARCHAR(255)
- bio: TEXT
- specializations: TEXT[] (array)
- years_of_experience: INTEGER
- hourly_rate: DECIMAL(10,2)
- rating: DECIMAL(3,2) -- 0.0 to 5.0
- total_sessions: INTEGER
- credentials: TEXT[] (array)
- availability: JSONB -- {"monday": ["09:00-17:00"], ...}
- is_verified: BOOLEAN
- is_available: BOOLEAN
```

---

## 🔧 If You Get Errors

### Error: "relation careers already exists"
**Solution**: The tables exist but might have wrong schema. Two options:

**Option A - Drop and Recreate** (⚠️ Deletes existing data):
```sql
-- Run this FIRST in SQL Editor
DROP TABLE IF EXISTS counseling_sessions CASCADE;
DROP TABLE IF EXISTS counselors CASCADE;
DROP TABLE IF EXISTS learning_roadmaps CASCADE;
DROP TABLE IF EXISTS skill_analyses CASCADE;
DROP TABLE IF EXISTS career_matches CASCADE;
DROP TABLE IF EXISTS career_assessments CASCADE;
DROP TABLE IF EXISTS careers CASCADE;

-- Then run APPLY_THIS_MIGRATION.sql
```

**Option B - Keep Existing Data** (Advanced):
- Manually add missing columns with ALTER TABLE
- Migrate data to new structure
- Not recommended unless you have production data

### Error: "Could not find table in schema cache"
**Solution**: This is a Supabase caching issue
1. The tables ARE created (verify in Supabase Table Editor)
2. Restart your backend server
3. Wait 30 seconds for cache refresh
4. Try API calls again

### Error: "permission denied"
**Solution**: RLS policy issue
- Make sure you're logged in as a student
- Check `auth.uid()` is set correctly
- Verify RLS policies were created (check SQL Editor output)

---

## ✅ Verification Checklist

After running migration:

- [ ] No errors in SQL Editor output
- [ ] See "MIGRATION COMPLETED SUCCESSFULLY" message
- [ ] Careers count: 12
- [ ] Counselors count: 4
- [ ] Backend API returns careers (curl test)
- [ ] Backend API returns counselors (curl test)
- [ ] Frontend assessment page loads
- [ ] Can complete assessment without errors
- [ ] Can generate career matches
- [ ] Can view career results
- [ ] Can book counselor session

---

## 📝 Seed Data Summary

### 12 Careers Inserted:
1. Software Engineer ($60k-$150k) - Technology
2. Data Scientist ($70k-$160k) - Data Science
3. UI/UX Designer ($55k-$130k) - Design
4. Product Manager ($80k-$170k) - Product Management
5. Digital Marketing Specialist ($45k-$100k) - Marketing
6. Business Analyst ($55k-$120k) - Business
7. Cybersecurity Analyst ($65k-$140k) - Security
8. Financial Analyst ($60k-$130k) - Finance
9. Content Writer ($40k-$85k) - Writing
10. HR Manager ($55k-$120k) - Human Resources
11. Mobile App Developer ($60k-$145k) - Technology
12. Graphic Designer ($40k-$95k) - Design

### 4 Counselors Inserted:
1. **Dr. Sarah Johnson** - $120/hr
   - Senior Career Counselor
   - Specializations: Software Engineering, Data Science, Tech Industry
   - Rating: 4.9/5.0
   - Experience: 15 years

2. **Michael Chen** - $85/hr
   - Tech Career Advisor
   - Specializations: Product Management, UX Design, Career Strategy
   - Rating: 4.8/5.0
   - Experience: 8 years

3. **Emily Rodriguez** - $95/hr
   - Business & Marketing Career Coach
   - Specializations: Marketing, Business Analysis, Finance
   - Rating: 4.7/5.0
   - Experience: 10 years

4. **David Kim** - $75/hr
   - Career Development Specialist
   - Specializations: General Guidance, Resume Building, Job Search
   - Rating: 4.9/5.0
   - Experience: 12 years

---

## 🎯 Next Actions

1. ✅ **Run migration** in Supabase SQL Editor
2. ✅ **Restart backend** server
3. ✅ **Test API endpoints** with curl
4. ✅ **Visit frontend** and complete assessment
5. ✅ **Test complete flow** end-to-end
6. 🎉 **Start using** Career Counselling features!

---

## 📞 Support

If issues persist:
1. Check backend logs for specific errors
2. Verify Supabase connection (SUPABASE_URL in .env)
3. Ensure service role key has correct permissions
4. Check browser console for frontend errors

**Backend is running on**: http://localhost:5000  
**Frontend is running on**: http://localhost:5173

---

**Status**: ✅ READY TO APPLY  
**File to use**: `database/APPLY_THIS_MIGRATION.sql`  
**Time to complete**: 2 minutes  
**Risk**: Low (safe to run multiple times)

