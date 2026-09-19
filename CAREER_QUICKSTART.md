# Career Counselling - Quick Start Guide

## 🚀 SETUP (5-10 Minutes)

### Step 1: Get Gemini API Key
1. Go to Google AI Studio API Keys page
2. Sign in with Google account
3. Click "Create API Key"
4. Copy the key

### Step 2: Configure Backend
```bash
# Edit backend/.env
# Replace this line:
GEMINI_API_KEY=your_gemini_api_key_here

# With your actual key:
GEMINI_API_KEY=your_gemini_api_key
```

### Step 3: Run Database Migrations
1. Go to https://supabase.com
2. Open your project: https://sgnpfwjnyditwfyftqek.supabase.co
3. Go to SQL Editor
4. Run these files in order:

**File 1: `database/06_career_counselling_system.sql`**
- Creates 10 tables
- Sets up RLS policies
- Should show: "✅ CAREER COUNSELLING DATABASE CREATED SUCCESSFULLY!"

**File 2: `database/07_seed_career_catalog.sql`**
- Adds 12 careers
- Should show: "12 careers_added"

**File 3: `database/08_seed_counselors.sql`**
- Adds 4 counselors
- Should show: "4 counselors_added, availability_slots_added"

### Step 4: Start Servers
```bash
# Backend (already running)
cd backend
npm run dev
# Should show: 🚀 Server running on http://localhost:5000

# Frontend (already running)
cd frontend
npm run dev
# Should show: Local: http://localhost:5173/
```

## ✅ VERIFY SETUP

### Test 1: Check Database
In Supabase SQL Editor:
```sql
SELECT COUNT(*) FROM careers;
-- Should return: 12

SELECT COUNT(*) FROM counselors;
-- Should return: 4
```

### Test 2: Check Backend API
Open in browser or Postman:
```
http://localhost:5000/api/health
Should return: {"status":"ok","message":"StudentHub API is running"}

http://localhost:5000/api/career/careers
Should return: {"careers":[...]} with 12 careers

http://localhost:5000/api/counseling/counselors
Should return: {"counselors":[...]} with 4 counselors
```

### Test 3: Check Frontend
1. Open http://localhost:5173/
2. Register as a new student
3. Navigate to http://localhost:5173/career/assessment
4. You should see the assessment form

## 🎯 TEST COMPLETE FLOW

### Test Assessment Flow (Currently Implemented)
1. Go to http://localhost:5173/career/assessment
2. Complete Step 1 (Education)
   - Select education level
   - Enter degree program
   - Select employment status
   - Click "Next"
3. Complete Step 2 (Interests)
   - Select at least one interest
   - Click "Next"
4. Complete Step 3 (Activities)
   - Select at least one activity
   - Click "Next"
5. Complete Step 4 (Skills)
   - Click "Add Skill"
   - Enter a skill name
   - Select proficiency level
   - Click "Next"
6. Complete Step 5 (Preferences)
   - Select work mode (remote/office/hybrid)
   - Select work style (team/independent/mixed)
   - Adjust priority sliders
   - Click "Next"
7. Complete Step 6 (Career Goal)
   - Select a career goal
   - Click "Next"
8. Complete Step 7 (Career Concern)
   - Optionally enter a concern
   - Click "Submit Assessment"

**Expected**: Redirects to /career/results (page not created yet)

### Test Backend API (With Authentication)
You'll need an auth token. To get one:
1. Login on frontend
2. Open browser DevTools → Application → Local Storage
3. Find the auth token

Then test with curl or Postman:
```bash
# Replace YOUR_TOKEN with actual token
curl -X POST http://localhost:5000/api/career/matches/generate \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json"

# Expected: Career matches generated (if Gemini API key is valid)
# Or: Fallback matches (if Gemini fails)
```

## 📊 WHAT'S WORKING

### ✅ Backend (100% Complete)
- Database schema created
- RLS policies active
- Career catalog seeded (12 careers)
- Counselors seeded (4 counselors)
- Assessment API working
- Career matching API working (with AI + fallback)
- Skill analysis API working
- Roadmap generation API working
- Counselor booking API working
- Session management API working

### ✅ Frontend (10% Complete)
- Career Assessment form (7 steps, fully functional)
- Progress saving
- Validation
- Responsive design

### ❌ Frontend (Not Yet Created)
- Career Results page
- Skill Analysis page
- Learning Roadmap page
- Counselor Directory
- Counselor Booking
- Session Management
- Next Best Action component

## 🔧 TROUBLESHOOTING

### Issue: "Cannot find package '@google/genai'"
**Fix**:
```bash
cd backend
npm install @google/genai
npm run dev
```

### Issue: "Gemini API error"
**Possible causes**:
1. API key not configured → Edit backend/.env
2. Invalid API key → Get new key from Google AI Studio
3. API quota exceeded → Check Google Cloud Console
4. Network issue → System will use fallback matching

**Note**: System works with fallback even without Gemini API

### Issue: Database tables not found
**Fix**: Run migrations in Supabase SQL Editor:
1. `database/06_career_counselling_system.sql`
2. `database/07_seed_career_catalog.sql`
3. `database/08_seed_counselors.sql`

### Issue: Frontend pages show 404
**Current status**: Only `/career/assessment` is implemented
Other pages need to be created:
- `/career/results` → Not created yet
- `/career/skills/:id` → Not created yet
- `/career/roadmap/:id` → Not created yet
- `/career/counselors` → Not created yet

### Issue: Authentication not working
**Check**:
1. Supabase URL and keys in `.env` files
2. User is logged in
3. Token is valid
4. RLS policies allow access

## 📝 API ENDPOINTS REFERENCE

### Career Endpoints
```
GET    /api/career/assessment          - Get user's assessment
POST   /api/career/assessment          - Save/update assessment
POST   /api/career/matches/generate    - Generate AI career matches
GET    /api/career/matches             - Get user's matches
POST   /api/career/skills/analyze      - Analyze skills for career
GET    /api/career/skills/:career_id   - Get skill analysis
POST   /api/career/roadmap/generate    - Generate learning roadmap
GET    /api/career/roadmap/:career_id  - Get roadmap
PATCH  /api/career/roadmap/step/:id    - Update step status
GET    /api/career/careers             - Get all careers
GET    /api/career/careers/:id         - Get career details
```

### Counseling Endpoints
```
GET    /api/counseling/counselors              - Get counselors
GET    /api/counseling/counselors/:id          - Get counselor details
POST   /api/counseling/sessions                - Book session
GET    /api/counseling/sessions                - Get user's sessions
GET    /api/counseling/sessions/:id            - Get session details
PATCH  /api/counseling/sessions/:id            - Update session (cancel)
POST   /api/counseling/sessions/:id/feedback   - Submit feedback
GET    /api/counseling/available-slots         - Get available slots
```

## 🎯 NEXT DEVELOPMENT STEPS

### Priority 1: Career Results Page (2 hours)
Create `frontend/src/pages/career/CareerResults.jsx`:
- Fetch matches from `/api/career/matches`
- Display career cards with match strength
- Show reasons and supporting factors
- Add CTAs: "Analyze Skills", "Explore Career"

### Priority 2: Skill Analysis Page (1.5 hours)
Create `frontend/src/pages/career/SkillAnalysis.jsx`:
- Fetch skill analysis from `/api/career/skills/:id`
- Display current skills vs required skills
- Highlight top 3 priority gaps
- Add CTA: "Build Learning Roadmap"

### Priority 3: Learning Roadmap Page (2 hours)
Create `frontend/src/pages/career/LearningRoadmap.jsx`:
- Fetch roadmap from `/api/career/roadmap/:id`
- Display 6 phases with steps
- Allow marking steps complete
- Show progress percentage
- Add CTAs: "Continue Learning", "Explore Jobs"

### Priority 4: Counselor Components (2 hours)
Create:
- `frontend/src/pages/career/Counselors.jsx` - Directory
- `frontend/src/pages/career/BookCounselor.jsx` - Booking form
- `frontend/src/pages/career/MySessions.jsx` - Session list

### Priority 5: Routing & Integration (1 hour)
- Add routes to AppRoutes.jsx
- Update navigation
- Add links from dashboard
- Test end-to-end flow

## 💾 BACKUP REMINDER

Before making changes:
```bash
# Backup database
# In Supabase Dashboard → Database → Backups → Create Backup

# Backup code
git add .
git commit -m "Career Counselling - Backend complete, frontend in progress"
git push
```

## 📞 SUPPORT

If you encounter issues:
1. Check this guide's troubleshooting section
2. Review `CAREER_COUNSELLING_IMPLEMENTATION.md` for details
3. Check backend logs in terminal
4. Check browser console for frontend errors
5. Verify database tables in Supabase

---

**Status**: Backend ✅ Complete | Frontend 🚧 10% Complete  
**Current URLs**:
- Frontend: http://localhost:5173/
- Backend: http://localhost:5000/
- Assessment: http://localhost:5173/career/assessment

**What Works Now**:
- Career assessment form (save & submit)
- Backend APIs (all endpoints)
- Database with 12 careers + 4 counselors

**What's Next**:
- Create remaining frontend pages
- Add routing
- Test complete flow
- UI polish
