# StudentHub - Setup & Launch Checklist

Use this checklist to set up and launch your StudentHub platform.

## 📋 Pre-Setup Checklist

- [ ] Node.js installed (v18 or higher)
- [ ] npm installed and working
- [ ] Code editor ready (VS Code recommended)
- [ ] Modern web browser (Chrome, Firefox, Edge)
- [ ] Internet connection available

---

## 🛠️ Setup Checklist

### Step 1: Install Dependencies
- [ ] Open terminal/PowerShell in project folder
- [ ] Navigate to backend: `cd backend`
- [ ] Run: `npm install`
- [ ] Wait for completion (2-3 minutes)
- [ ] Navigate to frontend: `cd ../frontend`
- [ ] Run: `npm install`
- [ ] Wait for completion (2-3 minutes)

### Step 2: Create Supabase Project
- [ ] Sign up at [supabase.com](https://supabase.com)
- [ ] Click "New Project"
- [ ] Enter project name: `studenthub`
- [ ] Create strong database password
- [ ] Select region (closest to you)
- [ ] Click "Create new project"
- [ ] Wait 2-3 minutes for initialization

### Step 3: Set Up Database
- [ ] Open Supabase dashboard
- [ ] Go to SQL Editor
- [ ] Open `SETUP_INSTRUCTIONS.md`
- [ ] Copy entire SQL script
- [ ] Paste into SQL Editor
- [ ] Click "Run"
- [ ] Verify "Success" message

### Step 4: Create Admin User
- [ ] In Supabase, go to Authentication → Users
- [ ] Click "Add user" → "Create new user"
- [ ] Email: `admin@studenthub.com`
- [ ] Create strong password (write it down!)
- [ ] Check "Auto Confirm User"
- [ ] Click "Create user"
- [ ] Go to SQL Editor and run admin creation query
- [ ] Verify admin profile created

### Step 5: Get Supabase Credentials
- [ ] Go to Settings → API
- [ ] Copy Project URL
- [ ] Copy anon public key
- [ ] Copy service_role key (click "Reveal")
- [ ] Go to Settings → API → JWT Settings
- [ ] Copy JWT Secret

### Step 6: Configure Backend
- [ ] Create file: `backend/.env`
- [ ] Add PORT=5000
- [ ] Add NODE_ENV=development
- [ ] Add SUPABASE_URL (paste from above)
- [ ] Add SUPABASE_SERVICE_KEY (paste from above)
- [ ] Add SUPABASE_JWT_SECRET (paste from above)
- [ ] Add CORS_ORIGIN=http://localhost:5173
- [ ] Save file

### Step 7: Configure Frontend
- [ ] Create file: `frontend/.env`
- [ ] Add VITE_SUPABASE_URL (paste from above)
- [ ] Add VITE_SUPABASE_ANON_KEY (paste from above)
- [ ] Add VITE_API_URL=http://localhost:5000/api
- [ ] Save file

### Step 8: Start Backend
- [ ] Open new terminal/PowerShell
- [ ] Navigate to backend: `cd backend`
- [ ] Run: `npm run dev`
- [ ] See message: "Server running on http://localhost:5000"
- [ ] Keep this terminal open

### Step 9: Start Frontend
- [ ] Open another terminal/PowerShell
- [ ] Navigate to frontend: `cd frontend`
- [ ] Run: `npm run dev`
- [ ] See message with Local URL
- [ ] Keep this terminal open

### Step 10: Access Application
- [ ] Open browser
- [ ] Go to: http://localhost:5173
- [ ] See StudentHub homepage
- [ ] No console errors in browser (F12)

---

## ✅ Testing Checklist

### Student Flow
- [ ] Click "Sign Up"
- [ ] Create student account
- [ ] Verify email confirmation (check if needed)
- [ ] Login with student account
- [ ] Complete profile (Dashboard → Profile)
- [ ] Add university, major, graduation year
- [ ] Add resume URL
- [ ] Save profile
- [ ] Go to "Browse Jobs"
- [ ] View job listings
- [ ] Use search functionality
- [ ] Try filters (job type, location, etc.)
- [ ] Click on a job
- [ ] View job details
- [ ] Click "Apply Now"
- [ ] Submit application
- [ ] Go to Dashboard → My Applications
- [ ] See application listed
- [ ] Test "Save Job" feature
- [ ] Go to Dashboard → Saved Jobs
- [ ] See saved job
- [ ] Remove saved job
- [ ] Logout

### Admin Flow
- [ ] Click "Login"
- [ ] Login with admin credentials
- [ ] See Admin Dashboard
- [ ] View statistics
- [ ] Click "Manage Jobs"
- [ ] Click "Post New Job"
- [ ] Fill in all required fields
- [ ] Submit job
- [ ] See job in list
- [ ] Click "Edit" on job
- [ ] Update job details
- [ ] Save changes
- [ ] Go to "Applications"
- [ ] See student application
- [ ] Click "Details"
- [ ] Update application status
- [ ] Close modal
- [ ] Logout

### Mobile Responsiveness
- [ ] Open browser DevTools (F12)
- [ ] Toggle device toolbar
- [ ] Test mobile view (375px width)
- [ ] Navigate all pages
- [ ] Test tablet view (768px width)
- [ ] Verify responsive design works
- [ ] Close DevTools

### Error Handling
- [ ] Try invalid login
- [ ] See error message
- [ ] Try registering with existing email
- [ ] See error message
- [ ] Submit form with missing fields
- [ ] See validation errors
- [ ] Test with network offline (if possible)
- [ ] See appropriate error messages

---

## 🚀 Production Deployment Checklist

### Before Deployment
- [ ] All features tested and working locally
- [ ] No console errors or warnings
- [ ] All environment variables documented
- [ ] Code pushed to GitHub repository
- [ ] README.md reviewed
- [ ] Database backup created

### Backend Deployment (Render)
- [ ] Sign up at [render.com](https://render.com)
- [ ] Create new Web Service
- [ ] Connect GitHub repository
- [ ] Configure build settings
- [ ] Set all environment variables
- [ ] Deploy backend
- [ ] Copy backend URL
- [ ] Test API endpoints

### Frontend Deployment (Vercel)
- [ ] Sign up at [vercel.com](https://vercel.com)
- [ ] Import GitHub repository
- [ ] Configure build settings
- [ ] Set environment variables
- [ ] Update VITE_API_URL with backend URL
- [ ] Deploy frontend
- [ ] Copy frontend URL
- [ ] Test deployed site

### Post-Deployment
- [ ] Update CORS_ORIGIN in backend
- [ ] Redeploy backend
- [ ] Add redirect URLs in Supabase
- [ ] Test student registration on live site
- [ ] Test admin login on live site
- [ ] Test job posting on live site
- [ ] Test job application on live site
- [ ] Test on mobile device
- [ ] Verify SSL certificate (HTTPS)
- [ ] Check analytics/monitoring

---

## 📝 Maintenance Checklist

### Weekly
- [ ] Review Supabase usage metrics
- [ ] Check application errors in logs
- [ ] Monitor user registrations
- [ ] Review job postings

### Monthly
- [ ] Backup database manually
- [ ] Review and update dependencies
- [ ] Check security advisories
- [ ] Monitor hosting service limits

### As Needed
- [ ] Respond to user feedback
- [ ] Fix reported bugs
- [ ] Add new features
- [ ] Update documentation

---

## 🐛 Troubleshooting Checklist

### Application Won't Start
- [ ] Verify Node.js is installed: `node --version`
- [ ] Verify npm is installed: `npm --version`
- [ ] Check for error messages in terminal
- [ ] Delete `node_modules` and reinstall
- [ ] Check port availability (5000, 5173)
- [ ] Restart computer if needed

### Database Connection Issues
- [ ] Verify Supabase project is active
- [ ] Check environment variables
- [ ] Verify no extra spaces in .env files
- [ ] Test connection in Supabase dashboard
- [ ] Check RLS policies are enabled
- [ ] Review Supabase logs

### Authentication Not Working
- [ ] Verify Supabase Auth is configured
- [ ] Check JWT secret is correct
- [ ] Verify user created in Supabase
- [ ] Check browser console for errors
- [ ] Clear browser cache and cookies
- [ ] Try incognito/private window

### Frontend/Backend Not Connecting
- [ ] Verify backend is running (terminal 1)
- [ ] Verify frontend is running (terminal 2)
- [ ] Check CORS_ORIGIN matches frontend URL
- [ ] Check VITE_API_URL points to backend
- [ ] Open browser DevTools → Network tab
- [ ] Look for failed API requests
- [ ] Check browser console for CORS errors

---

## 📊 Success Criteria

Your StudentHub is ready when:

- ✅ All tests in Testing Checklist pass
- ✅ No console errors in browser
- ✅ No errors in backend terminal
- ✅ Student can register and login
- ✅ Admin can post jobs
- ✅ Student can apply to jobs
- ✅ Applications appear in admin dashboard
- ✅ Mobile version looks good
- ✅ All documentation is clear

---

## 🎉 Launch Day Checklist

- [ ] Final test of all features
- [ ] Create demo jobs as admin
- [ ] Create demo student account
- [ ] Submit demo applications
- [ ] Take screenshots for promotion
- [ ] Share with target users
- [ ] Monitor for issues
- [ ] Collect initial feedback
- [ ] Celebrate! 🎊

---

## 📚 Additional Resources

- `QUICK_START.md` - Fast 10-minute setup
- `SETUP_INSTRUCTIONS.md` - Detailed setup guide
- `DEPLOYMENT.md` - Production deployment
- `README.md` - Full documentation
- `PROJECT_SUMMARY.md` - Project overview

---

**Good luck with your StudentHub platform!** 🚀

Remember: Take it step by step, check off each item, and don't skip steps!
