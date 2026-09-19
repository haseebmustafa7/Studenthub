# 🚀 QUICK START GUIDE

## Your servers are already running! ✅

- **Backend:** http://localhost:5000 ✅
- **Frontend:** http://localhost:5173 ✅

## ⚡ 3 STEPS TO GET STARTED

### STEP 1: Run Database Migration (2 minutes)

1. Open https://app.supabase.com
2. Select your project
3. Click **SQL Editor** (left sidebar)
4. Click **New Query**
5. Open this file: `database/01_add_company_features.sql`
6. Copy ENTIRE contents
7. Paste into Supabase SQL Editor
8. Click **Run** or press Ctrl+Enter
9. Wait for "Migration completed successfully!" message

### STEP 2: Add Demo Jobs (1 minute)

1. Still in SQL Editor
2. Click **New Query** again
3. Open this file: `database/02_seed_demo_jobs.sql`
4. Copy ENTIRE contents
5. Paste into Supabase SQL Editor
6. Click **Run** or press Ctrl+Enter
7. Wait for "Demo jobs seeded successfully!" message

### STEP 3: Fix Authentication (30 seconds)

1. In Supabase dashboard
2. Click **Authentication** (left sidebar)
3. Click **Providers**
4. Click on **Email** provider
5. Find **"Confirm email"** checkbox
6. **UNCHECK** this box ⬜
7. Click **Save**

**Done! 🎉**

---

## 🌐 NOW OPEN IN CHROME:

http://localhost:5173

---

## ✅ TEST IT:

### Test 1: Register Student
1. Click "Sign Up"
2. Fill form
3. Submit
4. Should immediately login and see dashboard

### Test 2: View Jobs
1. Click "Jobs" in navbar
2. Should see 10 demo jobs
3. Try search and filters

### Test 3: Map View
1. Click "Jobs Near Me" in navbar
2. Click "Use My Location"
3. Grant permission
4. See jobs on map!

### Test 4: Register Company
1. Logout
2. Go to: http://localhost:5173/company/register
3. Fill company form
4. Submit
5. Should see company dashboard

---

## 📋 WHAT YOU GET:

### 10 Demo Jobs:
- ✅ Software Engineer Intern (Lahore)
- ✅ Full Stack Developer (Lahore)
- ✅ AI/ML Engineer (Islamabad)
- ✅ Data Scientist Intern (Islamabad)
- ✅ UI/UX Designer (Karachi)
- ✅ Digital Marketing (Rawalpindi)
- ✅ QA Engineer (Remote)
- ✅ Frontend Developer (Remote)

### 3 User Types:
- 👨‍🎓 **Students:** Browse, save, apply to jobs
- 🏢 **Companies:** Post and manage jobs
- 👨‍💼 **Admin:** Approve jobs, manage platform

### Map Features:
- 🗺️ Interactive OpenStreetMap
- 📍 Your location marker
- 📌 Job location markers
- 📏 Distance calculation
- 🔍 Distance filters (5km - 100km)

---

## 🐛 TROUBLESHOOTING:

### Still can't login after registration?
→ Did you UNCHECK "Confirm email" in Step 3?

### Jobs page is empty?
→ Did you run the seed script in Step 2?

### Map doesn't show jobs?
→ Click "Use My Location" and grant permission

### Company dashboard empty?
→ Post a job first!

---

## 📞 NEED HELP?

Check these files for detailed guides:
- `AUTHENTICATION_FIX.md` - Auth issue details
- `IMPLEMENTATION_COMPLETE.md` - Full feature list
- `database/README.md` - Database migration guide

---

## 🎯 THAT'S IT!

**Total time:** ~5 minutes  
**Result:** Fully functional StudentHub platform with map-based job search! 🚀
