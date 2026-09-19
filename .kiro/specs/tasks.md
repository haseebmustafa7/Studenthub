# StudentHub Platform Transformation - Implementation Tasks

## Task Organization

Tasks are organized by implementation phase. Each phase builds on the previous one. Tasks marked with 🔴 are critical path items.

---

## PHASE 1: Stabilize & Verify (NEXT)
**Priority:** RELIABILITY  
**Duration:** 1-2 days  
**Goal:** Ensure all existing functionality works before building new features

### Task 1.1: Verify Database Migrations 🔴
**Status:** Not Started  
**Dependencies:** None  
**Estimated Time:** 1 hour

**Steps:**
1. Connect to Supabase dashboard
2. Check if `profiles` table has company fields (company_name, company_website, etc.)
3. Check if `jobs` table has location fields (city, country, latitude, longitude)
4. Check if role constraint includes 'company'
5. If missing, run `database/00_upgrade_for_companies.sql` in Supabase SQL Editor
6. Verify no errors in migration
7. Document migration status

**Acceptance Criteria:**
- [ ] Database schema matches design document
- [ ] All migrations run successfully
- [ ] No data loss

---

### Task 1.2: Test Student Registration & Login
**Status:** Not Started  
**Dependencies:** 1.1  
**Estimated Time:** 30 minutes

**Steps:**
1. Open frontend in browser
2. Navigate to `/register`
3. Fill student registration form
4. Submit registration
5. Check Supabase Auth dashboard for new user
6. Check profiles table for new profile with role='student'
7. Log out
8. Log in with same credentials
9. Verify student dashboard loads
10. Document any errors

**Acceptance Criteria:**
- [ ] Student can register successfully
- [ ] Profile created with role='student'
- [ ] Student can log in
- [ ] Student dashboard displays
- [ ] No console errors

---

### Task 1.3: Test Company Registration & Login 🔴
**Status:** Not Started  
**Dependencies:** 1.1  
**Estimated Time:** 30 minutes

**Steps:**
1. Navigate to `/company/register`
2. Fill company registration form (company name, email, password, website, industry, etc.)
3. Submit registration
4. Check for success/error message
5. If error "Failed to create profile", check:
   - Browser console for actual error
   - Network tab for API response
   - Supabase logs
   - RLS policies
6. Fix any issues found
7. Verify profile created with role='company'
8. Log out and log in
9. Verify company dashboard loads

**Acceptance Criteria:**
- [ ] Company can register successfully
- [ ] No "Failed to create profile" error
- [ ] Profile created with role='company'
- [ ] Company can log in
- [ ] Company dashboard displays
- [ ] Actual error shown in development (not generic message)

---

### Task 1.4: Test Company Job Posting Flow
**Status:** Not Started  
**Dependencies:** 1.3  
**Estimated Time:** 1 hour

**Steps:**
1. Log in as company
2. Navigate to "Publish Your Jobs" or `/company/jobs/new`
3. Fill job posting form
4. Submit job
5. Verify job appears in company's "My Jobs"
6. Check job status (active/pending)
7. Edit job
8. Verify changes saved
9. Check if job visible publicly (if status=active)
10. Verify students can see job

**Acceptance Criteria:**
- [ ] Company can create job
- [ ] Job saved to database
- [ ] Job appears in "My Jobs"
- [ ] Company can edit own job
- [ ] Company cannot edit other company's jobs
- [ ] Job visibility respects status

---

### Task 1.5: Test Student Job Application Flow
**Status:** Not Started  
**Dependencies:** 1.2, 1.4  
**Estimated Time:** 30 minutes

**Steps:**
1. Log in as student
2. Navigate to `/jobs`
3. Click on a job
4. Click "Apply"
5. Upload resume
6. Write cover letter
7. Submit application
8. Verify application appears in "My Applications"
9. Log in as company (job owner)
10. Verify application appears in company's applications list
11. Company updates application status
12. Log in as student again
13. Verify status update visible

**Acceptance Criteria:**
- [ ] Student can apply to job
- [ ] Application saved
- [ ] Resume uploaded successfully
- [ ] Company can see application
- [ ] Company can update status
- [ ] Student sees status update
- [ ] RLS policies working (students only see own applications)

---

### Task 1.6: Test Map Functionality
**Status:** Not Started  
**Dependencies:** 1.4  
**Estimated Time:** 30 minutes

**Steps:**
1. Navigate to `/jobs-near-me`
2. Verify map loads (Leaflet + OpenStreetMap)
3. Click "Find Jobs Near Me"
4. Allow location permission
5. Verify user location marker appears
6. Verify job markers appear (jobs with lat/lng)
7. Click on job marker
8. Verify job details popup shows
9. Click marker link to job details page
10. Test distance filters (5km, 10km, 25km, etc.)

**Acceptance Criteria:**
- [ ] Map loads without errors
- [ ] Job markers visible
- [ ] User location detection works
- [ ] Distance filters work
- [ ] Job details popup functional
- [ ] No paid API required (OpenStreetMap only)

---

### Task 1.7: Seed Demo Jobs 🔴
**Status:** Not Started  
**Dependencies:** 1.1  
**Estimated Time:** 30 minutes

**Steps:**
1. Review `database/02_seed_demo_jobs.sql`
2. Verify jobs have latitude/longitude (for map)
3. Verify jobs have realistic Pakistani locations
4. Verify jobs have varied categories (Software, Design, Marketing, etc.)
5. Run seed script in Supabase SQL Editor
6. Verify 8-10 demo jobs created
7. Navigate to `/jobs` page
8. Verify demo jobs visible
9. Navigate to `/jobs-near-me`
10. Verify demo jobs appear on map

**Acceptance Criteria:**
- [ ] 8-10 demo jobs created
- [ ] Jobs have valid lat/lng
- [ ] Jobs visible in jobs list
- [ ] Jobs visible on map
- [ ] Varied categories and job types
- [ ] Realistic data (not obviously fake)

---

### Task 1.8: Test Admin Approval Flow
**Status:** Not Started  
**Dependencies:** 1.4  
**Estimated Time:** 30 minutes

**Steps:**
1. Create admin user (if not exists)
2. Log in as admin
3. Navigate to admin dashboard
4. View all jobs
5. Find pending job
6. Approve job
7. Verify job status changes to 'active'
8. Verify job now visible publicly
9. Test reject flow
10. Verify rejected job not visible publicly

**Acceptance Criteria:**
- [ ] Admin can view all jobs
- [ ] Admin can approve jobs
- [ ] Admin can reject jobs
- [ ] Status updates reflected
- [ ] Public visibility correct

---

### Task 1.9: Document Bugs & Issues
**Status:** Not Started  
**Dependencies:** All Phase 1 tasks  
**Estimated Time:** 30 minutes

**Steps:**
1. Compile list of all bugs found during testing
2. Create GitHub issues for each bug
3. Prioritize bugs (critical, high, medium, low)
4. Document workarounds if any
5. Update PHASE_0_ANALYSIS_REPORT.md with findings
6. Create PHASE_1_TEST_REPORT.md

**Deliverables:**
- List of bugs with severity
- GitHub issues created
- Test report document

---

## PHASE 2: Homepage Redesign
**Priority:** IMPACT  
**Duration:** 2-3 days  
**Goal:** Transform homepage to showcase 3 services

### Task 2.1: Design Service Block Components
**Status:** Not Started  
**Dependencies:** None  
**Estimated Time:** 2 hours

**Steps:**
1. Create `ServiceBlock.jsx` component
2. Props: icon, title, description, ctaText, ctaLink, color
3. Implement responsive design (mobile, tablet, desktop)
4. Add hover effects
5. Use Tailwind utility classes
6. Create variants for different colors (primary, secondary, accent)
7. Add Lucide icons
8. Test component in isolation

**Deliverables:**
- `frontend/src/components/home/ServiceBlock.jsx`

---

### Task 2.2: Create New Homepage Layout
**Status:** Not Started  
**Dependencies:** 2.1  
**Estimated Time:** 3 hours

**Steps:**
1. Backup existing `Home.jsx`
2. Create new hero section
3. Add 3 service blocks section
4. Add stats section (jobs, companies, discounts, students)
5. Add testimonials section (optional)
6. Add CTA section
7. Ensure mobile responsive
8. Test on mobile devices

**Deliverables:**
- Updated `frontend/src/pages/Home.jsx`

---

### Task 2.3: Update Navigation
**Status:** Not Started  
**Dependencies:** None  
**Estimated Time:** 1 hour

**Steps:**
1. Update `Navbar.jsx`
2. Add "Career Counselling" link
3. Add "Student Discounts" link
4. Ensure mobile menu includes new links
5. Update active link highlighting
6. Test navigation on all pages

**Deliverables:**
- Updated `frontend/src/components/common/Navbar.jsx`

---

### Task 2.4: Create Placeholder Pages for New Services
**Status:** Not Started  
**Dependencies:** None  
**Estimated Time:** 1 hour

**Steps:**
1. Create `/career` route (placeholder)
2. Create `/career/assessment` route (placeholder)
3. Create `/discounts` route (placeholder)
4. Add "Coming Soon" messages
5. Add links back to homepage
6. Test routing

**Deliverables:**
- `frontend/src/pages/career/CareerHome.jsx`
- `frontend/src/pages/discounts/DiscountHome.jsx`

---

### Task 2.5: Update Branding & Messaging
**Status:** Not Started  
**Dependencies:** None  
**Estimated Time:** 1 hour

**Steps:**
1. Update hero tagline
2. Update footer content
3. Update meta tags (title, description)
4. Update about/mission text
5. Ensure "startup" quality feel

**Deliverables:**
- Updated copy throughout frontend

---

## PHASE 3: Career Counselling - Database & Backend
**Priority:** INNOVATION + IMPACT  
**Duration:** 3-4 days

### Task 3.1: Create Career Tables Migration 🔴
**Status:** Not Started  
**Dependencies:** Phase 1 complete  
**Estimated Time:** 2 hours

**Steps:**
1. Create `database/03_career_tables.sql`
2. Add `career_assessments` table
3. Add `skill_profiles` table
4. Add `career_recommendations` table
5. Add `counselor_profiles` table
6. Add `counselor_sessions` table
7. Add all indexes
8. Add all RLS policies
9. Test migration in local/staging
10. Run migration in Supabase

**Deliverables:**
- `database/03_career_tables.sql`

---

### Task 3.2: Set Up OpenAI Integration 🔴
**Status:** Not Started  
**Dependencies:** None  
**Estimated Time:** 2 hours

**Steps:**
1. Install `openai` npm package in backend
2. Create `backend/src/services/ai/llmClient.js`
3. Add `OPENAI_API_KEY` to `.env`
4. Implement `generateStructuredResponse()` function
5. Add error handling
6. Add retry logic
7. Test with sample prompt

**Deliverables:**
- `backend/src/services/ai/llmClient.js`

---

### Task 3.3: Create AI Prompt Templates
**Status:** Not Started  
**Dependencies:** 3.2  
**Estimated Time:** 3 hours

**Steps:**
1. Create `backend/src/services/ai/promptTemplates.js`
2. Design assessment analysis prompt
3. Design skill gap analysis prompt
4. Design recommendation generation prompt
5. Design "What Should I Do Next?" prompt
6. Test each prompt with OpenAI Playground
7. Refine prompts based on output quality

**Deliverables:**
- `backend/src/services/ai/promptTemplates.js`

---

### Task 3.4: Create Assessment Service
**Status:** Not Started  
**Dependencies:** 3.1, 3.2, 3.3  
**Estimated Time:** 4 hours

**Steps:**
1. Create `backend/src/services/assessmentService.js`
2. Implement `startAssessment(userId, type)`
3. Implement `submitAssessment(assessmentId, responses)`
4. Implement `analyzeAssessment(responses)` (calls AI)
5. Implement `getAssessmentResults(assessmentId)`
6. Add Zod schemas for validation
7. Add error handling
8. Write unit tests

**Deliverables:**
- `backend/src/services/assessmentService.js`

---

### Task 3.5: Create Career API Routes 🔴
**Status:** Not Started  
**Dependencies:** 3.4  
**Estimated Time:** 3 hours

**Steps:**
1. Create `backend/src/routes/career.js`
2. Implement `POST /api/career/assessment/start`
3. Implement `POST /api/career/assessment/submit`
4. Implement `GET /api/career/assessment/:id`
5. Implement `GET /api/career/recommendations`
6. Implement `GET /api/career/skill-analysis`
7. Add auth middleware
8. Add role checks (student only)
9. Add request validation
10. Test all endpoints with Postman

**Deliverables:**
- `backend/src/routes/career.js`

---

### Task 3.6: Implement Recommendation Engine
**Status:** Not Started  
**Dependencies:** 3.1, 3.3  
**Estimated Time:** 4 hours

**Steps:**
1. Create `backend/src/services/recommendationService.js`
2. Implement job matching algorithm (deterministic + AI)
3. Implement skill recommendation algorithm
4. Implement course recommendation algorithm
5. Implement action recommendation algorithm
6. Add priority scoring
7. Add impact/effort calculation
8. Test with sample data

**Deliverables:**
- `backend/src/services/recommendationService.js`

---

### Task 3.7: Implement "What Should I Do Next?" API 🔴
**Status:** Not Started  
**Dependencies:** 3.6  
**Estimated Time:** 3 hours

**Steps:**
1. Implement `GET /api/career/what-should-i-do-next`
2. Gather user context (profile, activity, gaps, deadlines)
3. Call AI with context
4. Parse and validate AI response
5. Cache response (1 hour TTL)
6. Add error fallbacks
7. Test with various user states

**Deliverables:**
- Endpoint in `backend/src/routes/career.js`
- Service function in `backend/src/services/recommendationService.js`

---

## PHASE 4: Career Counselling - Frontend
**Priority:** UX + IMPACT  
**Duration:** 4-5 days

### Task 4.1: Create Assessment Question Set
**Status:** Not Started  
**Dependencies:** None  
**Estimated Time:** 2 hours

**Steps:**
1. Design 10-15 assessment questions
2. Mix question types (multiple choice, rating scale, text)
3. Cover: skills, interests, goals, experience, work style
4. Create JSON structure
5. Review for clarity and relevance

**Deliverables:**
- Assessment questions data file

---

### Task 4.2: Build Assessment Flow UI
**Status:** Not Started  
**Dependencies:** 4.1, 3.5  
**Estimated Time:** 6 hours

**Steps:**
1. Create `frontend/src/pages/career/Assessment.jsx`
2. Build multi-step form component
3. Add progress indicator
4. Implement form validation
5. Add "Save & Continue Later" functionality
6. Connect to backend API
7. Handle loading/error states
8. Add animations/transitions
9. Test on mobile

**Deliverables:**
- `frontend/src/pages/career/Assessment.jsx`
- `frontend/src/components/career/AssessmentStep.jsx`

---

### Task 4.3: Build Assessment Results Page
**Status:** Not Started  
**Dependencies:** 4.2  
**Estimated Time:** 4 hours

**Steps:**
1. Create `frontend/src/pages/career/AssessmentResults.jsx`
2. Display personality type
3. Display strengths (visual list)
4. Display weaknesses
5. Display recommended careers
6. Add charts/visualizations (recharts)
7. Add "View Recommendations" CTA
8. Add "Retake Assessment" option

**Deliverables:**
- `frontend/src/pages/career/AssessmentResults.jsx`

---

### Task 4.4: Build Skill Analysis Page
**Status:** Not Started  
**Dependencies:** 3.5  
**Estimated Time:** 4 hours

**Steps:**
1. Create `frontend/src/pages/career/SkillAnalysis.jsx`
2. Display current skills (tags/badges)
3. Display skill gaps
4. Display market demand for each skill
5. Add skill proficiency indicators
6. Add recommendations section
7. Add "Learn This Skill" CTAs

**Deliverables:**
- `frontend/src/pages/career/SkillAnalysis.jsx`

---

### Task 4.5: Build Gap Analysis Page
**Status:** Not Started  
**Dependencies:** 3.5  
**Estimated Time:** 3 hours

**Steps:**
1. Create `frontend/src/pages/career/GapAnalysis.jsx`
2. Display all gap types (skills, experience, education)
3. For each gap, show recommended actions
4. Add time/effort estimates
5. Add resource links
6. Add "Mark as Working On It" functionality

**Deliverables:**
- `frontend/src/pages/career/GapAnalysis.jsx`

---

### Task 4.6: Build Learning Roadmap Page
**Status:** Not Started  
**Dependencies:** 3.5  
**Estimated Time:** 5 hours

**Steps:**
1. Create `frontend/src/pages/career/Roadmap.jsx`
2. Build timeline component
3. Display short-term, medium-term, long-term sections
4. Add milestones
5. Add checkboxes for completion
6. Add progress percentage
7. Add "Update Roadmap" functionality
8. Add visualization (Gantt-style or timeline)

**Deliverables:**
- `frontend/src/pages/career/Roadmap.jsx`
- `frontend/src/components/career/Timeline.jsx`

---

### Task 4.7: Build "What Should I Do Next?" Component 🔴
**Status:** Not Started  
**Dependencies:** 3.7  
**Estimated Time:** 3 hours

**Steps:**
1. Create `frontend/src/components/career/NextActionCard.jsx`
2. Fetch data from API
3. Display action title prominently
4. Display reason (why this action)
5. Display impact/effort scores
6. Add CTA button with link
7. Add refresh button
8. Add auto-refresh (every hour)
9. Style with gradient background
10. Make it stand out (WOW factor)

**Deliverables:**
- `frontend/src/components/career/NextActionCard.jsx`

---

### Task 4.8: Update Student Dashboard with Career Features
**Status:** Not Started  
**Dependencies:** 4.7  
**Estimated Time:** 2 hours

**Steps:**
1. Add "What Should I Do Next?" card at top
2. Add "Career Assessment" card
3. Add "My Recommendations" section
4. Add navigation links to all career pages
5. Test layout on mobile

**Deliverables:**
- Updated `frontend/src/pages/dashboard/Dashboard.jsx`

---

### Task 4.9: Build Counselor Directory
**Status:** Not Started  
**Dependencies:** 3.1  
**Estimated Time:** 3 hours

**Steps:**
1. Create `frontend/src/pages/career/Counselors.jsx`
2. Display counselor cards (photo, name, specialization, rating)
3. Add filter by specialization
4. Add "Book Session" button
5. Connect to backend API

**Deliverables:**
- `frontend/src/pages/career/Counselors.jsx`

---

### Task 4.10: Build Counselor Booking Flow
**Status:** Not Started  
**Dependencies:** 4.9  
**Estimated Time:** 4 hours

**Steps:**
1. Create booking modal/page
2. Add calendar component (react-datepicker)
3. Display available time slots
4. Add session type selector
5. Add notes field
6. Submit booking
7. Display confirmation
8. Send email notification (backend)

**Deliverables:**
- `frontend/src/components/career/BookingModal.jsx`

---

## PHASE 5: Student Discounts - Database & Backend
**Priority:** IMPACT  
**Duration:** 2-3 days

### Task 5.1: Create Discounts Tables Migration 🔴
**Status:** Not Started  
**Dependencies:** Phase 1 complete  
**Estimated Time:** 2 hours

**Steps:**
1. Create `database/04_discounts_tables.sql`
2. Add `discount_partners` table
3. Add `discounts` table
4. Add `student_verifications` table
5. Add `saved_discounts` table
6. Add all indexes
7. Add all RLS policies
8. Test migration
9. Run migration in Supabase

**Deliverables:**
- `database/04_discounts_tables.sql`

---

### Task 5.2: Seed Demo Discounts
**Status:** Not Started  
**Dependencies:** 5.1  
**Estimated Time:** 2 hours

**Steps:**
1. Create `database/05_seed_demo_discounts.sql`
2. Add 20-30 realistic discount partners
3. Add 50+ discounts across categories
4. Include popular brands (GitHub, Spotify, Notion, etc.)
5. Add expiry dates (varied)
6. Run seed script

**Deliverables:**
- `database/05_seed_demo_discounts.sql`

---

### Task 5.3: Create Discount API Routes 🔴
**Status:** Not Started  
**Dependencies:** 5.1  
**Estimated Time:** 3 hours

**Steps:**
1. Create `backend/src/routes/discounts.js`
2. Implement `GET /api/discounts` (with pagination, filtering)
3. Implement `GET /api/discounts/:id`
4. Implement `POST /api/discounts/:id/save`
5. Implement `DELETE /api/discounts/:id/save`
6. Implement `GET /api/discounts/saved`
7. Add auth middleware
8. Add request validation
9. Test all endpoints

**Deliverables:**
- `backend/src/routes/discounts.js`

---

### Task 5.4: Create Verification API Routes 🔴
**Status:** Not Started  
**Dependencies:** 5.1  
**Estimated Time:** 3 hours

**Steps:**
1. Create `backend/src/routes/verification.js`
2. Implement `POST /api/verification/submit` (with file upload)
3. Implement `GET /api/verification/status`
4. Implement `PUT /api/verification/approve/:id` (admin only)
5. Implement `PUT /api/verification/reject/:id` (admin only)
6. Add file upload validation (type, size)
7. Add email notification on status change
8. Test all endpoints

**Deliverables:**
- `backend/src/routes/verification.js`

---

### Task 5.5: Implement Email Notifications
**Status:** Not Started  
**Dependencies:** None  
**Estimated Time:** 3 hours

**Steps:**
1. Install nodemailer
2. Create `backend/src/services/emailService.js`
3. Configure SMTP
4. Create email templates (verification submitted, approved, rejected)
5. Implement `sendVerificationSubmitted()`
6. Implement `sendVerificationApproved()`
7. Implement `sendVerificationRejected()`
8. Test emails

**Deliverables:**
- `backend/src/services/emailService.js`

---

## PHASE 6: Student Discounts - Frontend
**Priority:** UX  
**Duration:** 3-4 days

### Task 6.1: Build Discount Marketplace Page 🔴
**Status:** Not Started  
**Dependencies:** 5.3  
**Estimated Time:** 5 hours

**Steps:**
1. Create `frontend/src/pages/discounts/DiscountMarketplace.jsx`
2. Display discount cards in grid
3. Add category filter
4. Add search bar
5. Add pagination
6. Show discount badge (%, fixed, free trial)
7. Show expiry date
8. Add "Save" button
9. Connect to backend API
10. Test on mobile

**Deliverables:**
- `frontend/src/pages/discounts/DiscountMarketplace.jsx`
- `frontend/src/components/discounts/DiscountCard.jsx`

---

### Task 6.2: Build Discount Details Page
**Status:** Not Started  
**Dependencies:** 5.3  
**Estimated Time:** 3 hours

**Steps:**
1. Create `frontend/src/pages/discounts/DiscountDetails.jsx`
2. Display full discount info
3. Display partner info
4. Show discount code (hidden if not verified)
5. Show "Verify Student Status" CTA (if not verified)
6. Show "Copy Code" button (if verified)
7. Show terms & conditions
8. Add "Visit Website" button
9. Add related discounts section

**Deliverables:**
- `frontend/src/pages/discounts/DiscountDetails.jsx`

---

### Task 6.3: Build Student Verification Flow 🔴
**Status:** Not Started  
**Dependencies:** 5.4  
**Estimated Time:** 4 hours

**Steps:**
1. Create `frontend/src/pages/discounts/VerifyStudent.jsx`
2. Add university email input
3. Add student ID file upload
4. Add form validation
5. Submit to backend
6. Display success message
7. Display verification status
8. Add re-submission flow (if rejected)

**Deliverables:**
- `frontend/src/pages/discounts/VerifyStudent.jsx`

---

### Task 6.4: Build Verification Status Component
**Status:** Not Started  
**Dependencies:** 6.3  
**Estimated Time:** 2 hours

**Steps:**
1. Create `frontend/src/components/discounts/VerificationStatus.jsx`
2. Display current status (unverified, pending, verified, expired)
3. Display expiry date (if verified)
4. Display rejection reason (if rejected)
5. Add "Resubmit" button (if rejected/expired)

**Deliverables:**
- `frontend/src/components/discounts/VerificationStatus.jsx`

---

### Task 6.5: Build Saved Discounts Page
**Status:** Not Started  
**Dependencies:** 5.3  
**Estimated Time:** 2 hours

**Steps:**
1. Create `frontend/src/pages/discounts/SavedDiscounts.jsx`
2. Display saved discount cards
3. Add "Remove" button
4. Add empty state ("No saved discounts yet")
5. Connect to backend API

**Deliverables:**
- `frontend/src/pages/discounts/SavedDiscounts.jsx`

---

### Task 6.6: Add Admin Verification Queue
**Status:** Not Started  
**Dependencies:** 5.4  
**Estimated Time:** 3 hours

**Steps:**
1. Create `frontend/src/pages/admin/VerificationQueue.jsx`
2. Display pending verifications
3. Show student info, uploaded ID
4. Add "Approve" button
5. Add "Reject" button (with reason input)
6. Connect to backend API
7. Test approve/reject flow

**Deliverables:**
- `frontend/src/pages/admin/VerificationQueue.jsx`

---

### Task 6.7: Add Admin Discount Management
**Status:** Not Started  
**Dependencies:** 5.3  
**Estimated Time:** 4 hours

**Steps:**
1. Create `frontend/src/pages/admin/ManageDiscounts.jsx`
2. Display all discounts
3. Add "Create Discount" button
4. Add "Edit" and "Delete" buttons
5. Build discount form modal
6. Build partner form modal
7. Connect to backend CRUD APIs
8. Test all CRUD operations

**Deliverables:**
- `frontend/src/pages/admin/ManageDiscounts.jsx`

---

## PHASE 7: Polish & Optimization
**Priority:** VISUAL POLISH + RELIABILITY  
**Duration:** 3-5 days

### Task 7.1: Add Loading States Everywhere
**Status:** Not Started  
**Dependencies:** All features complete  
**Estimated Time:** 4 hours

**Steps:**
1. Audit all pages for loading states
2. Add skeleton screens where appropriate
3. Add spinners for quick actions
4. Use consistent loading patterns
5. Test slow network conditions

**Deliverables:**
- Loading states on all pages

---

### Task 7.2: Add Empty States
**Status:** Not Started  
**Dependencies:** All features complete  
**Estimated Time:** 3 hours

**Steps:**
1. Audit all pages for empty states
2. Add helpful messages
3. Add CTAs to populate data
4. Add illustrations (optional)
5. Test with empty user accounts

**Deliverables:**
- Empty states on all list pages

---

### Task 7.3: Improve Error Messages
**Status:** Not Started  
**Dependencies:** None  
**Estimated Time:** 3 hours

**Steps:**
1. Audit all error handling
2. Replace generic messages with specific ones
3. Add actionable suggestions
4. Test error scenarios
5. Add toast notifications (react-hot-toast)

**Deliverables:**
- User-friendly error messages throughout app

---

### Task 7.4: Add Pagination to All Lists
**Status:** Not Started  
**Dependencies:** None  
**Estimated Time:** 4 hours

**Steps:**
1. Implement pagination on jobs list
2. Implement pagination on applications list
3. Implement pagination on discounts list
4. Implement pagination on recommendations list
5. Add "Load More" buttons
6. Test with large datasets

**Deliverables:**
- Pagination on all list endpoints

---

### Task 7.5: Optimize Images
**Status:** Not Started  
**Dependencies:** None  
**Estimated Time:** 2 hours

**Steps:**
1. Audit all images
2. Convert to WebP where possible
3. Add lazy loading
4. Add proper alt text
5. Optimize image sizes
6. Test page load speed

**Deliverables:**
- Optimized images throughout app

---

### Task 7.6: Implement Code Splitting
**Status:** Not Started  
**Dependencies:** None  
**Estimated Time:** 3 hours

**Steps:**
1. Identify large route components
2. Use React.lazy() for route-level splitting
3. Add Suspense boundaries
4. Test bundle sizes (npm run build)
5. Verify code splitting in production

**Deliverables:**
- Code-split routes

---

### Task 7.7: Accessibility Audit
**Status:** Not Started  
**Dependencies:** All features complete  
**Estimated Time:** 4 hours

**Steps:**
1. Run Lighthouse accessibility audit
2. Fix ARIA label issues
3. Ensure keyboard navigation works
4. Test with screen reader
5. Fix color contrast issues
6. Add focus indicators
7. Re-run audit

**Deliverables:**
- Lighthouse accessibility score > 90

---

### Task 7.8: Mobile UX Improvements
**Status:** Not Started  
**Dependencies:** All features complete  
**Estimated Time:** 4 hours

**Steps:**
1. Test all pages on mobile device
2. Fix layout issues
3. Improve touch targets
4. Optimize mobile navigation
5. Test on iOS and Android
6. Test various screen sizes

**Deliverables:**
- Smooth mobile experience

---

### Task 7.9: Performance Optimization
**Status:** Not Started  
**Dependencies:** All features complete  
**Estimated Time:** 5 hours

**Steps:**
1. Run Lighthouse performance audit
2. Optimize bundle size
3. Add response compression (backend)
4. Optimize database queries
5. Add indexes where needed
6. Test with slow 3G
7. Re-run audit

**Deliverables:**
- Lighthouse performance score > 90

---

### Task 7.10: Security Hardening
**Status:** Not Started  
**Dependencies:** None  
**Estimated Time:** 4 hours

**Steps:**
1. Add rate limiting (express-rate-limit)
2. Add Helmet.js for security headers
3. Add request validation (Zod schemas)
4. Audit RLS policies
5. Add CORS whitelist
6. Add CSP headers
7. Test security with OWASP ZAP (optional)

**Deliverables:**
- Hardened security

---

## PHASE 8: Analytics & Monitoring
**Priority:** RELIABILITY  
**Duration:** 2-3 days

### Task 8.1: Set Up Error Tracking (Sentry) 🔴
**Status:** Not Started  
**Dependencies:** None  
**Estimated Time:** 2 hours

**Steps:**
1. Create Sentry account
2. Install @sentry/react and @sentry/node
3. Configure Sentry in frontend
4. Configure Sentry in backend
5. Test error reporting
6. Set up alerts

**Deliverables:**
- Sentry integrated

---

### Task 8.2: Add User Analytics
**Status:** Not Started  
**Dependencies:** None  
**Estimated Time:** 3 hours

**Steps:**
1. Create `user_events` table
2. Implement event tracking API
3. Track key events (page views, job views, applications, assessments)
4. Add frontend tracking calls
5. Test event tracking

**Deliverables:**
- User events tracked

---

### Task 8.3: Build Admin Analytics Dashboard
**Status:** Not Started  
**Dependencies:** 8.2  
**Estimated Time:** 5 hours

**Steps:**
1. Create `frontend/src/pages/admin/Analytics.jsx`
2. Display user stats (total, active, new)
3. Display job stats
4. Display application stats
5. Display discount stats
6. Add charts (recharts)
7. Add date range filters

**Deliverables:**
- `frontend/src/pages/admin/Analytics.jsx`

---

### Task 8.4: Set Up Uptime Monitoring
**Status:** Not Started  
**Dependencies:** None  
**Estimated Time:** 1 hour

**Steps:**
1. Create UptimeRobot account (or similar)
2. Add monitors for frontend URL
3. Add monitors for backend health endpoint
4. Set up email/SMS alerts
5. Test alerts

**Deliverables:**
- Uptime monitoring active

---

### Task 8.5: Add API Logging
**Status:** Not Started  
**Dependencies:** None  
**Estimated Time:** 2 hours

**Steps:**
1. Install winston
2. Create logger configuration
3. Add request logging middleware
4. Add error logging
5. Add log rotation
6. Test logging

**Deliverables:**
- Comprehensive API logging

---

## PHASE 9: Testing & Documentation
**Priority:** RELIABILITY  
**Duration:** 2-3 days

### Task 9.1: Write API Documentation
**Status:** Not Started  
**Dependencies:** All APIs complete  
**Estimated Time:** 4 hours

**Steps:**
1. Document all API endpoints
2. Add request/response examples
3. Document authentication
4. Document error codes
5. Use Postman or Swagger for docs

**Deliverables:**
- API_DOCUMENTATION.md

---

### Task 9.2: Write User Guide
**Status:** Not Started  
**Dependencies:** All features complete  
**Estimated Time:** 3 hours

**Steps:**
1. Create USER_GUIDE.md
2. Document student workflows
3. Document company workflows
4. Document admin workflows
5. Add screenshots
6. Explain all features

**Deliverables:**
- USER_GUIDE.md

---

### Task 9.3: Write Deployment Guide
**Status:** Not Started  
**Dependencies:** None  
**Estimated Time:** 2 hours

**Steps:**
1. Create DEPLOYMENT_GUIDE.md
2. Document environment setup
3. Document database migration process
4. Document deployment steps
5. Document troubleshooting

**Deliverables:**
- DEPLOYMENT_GUIDE.md

---

### Task 9.4: End-to-End Testing
**Status:** Not Started  
**Dependencies:** All features complete  
**Estimated Time:** 6 hours

**Steps:**
1. Test complete student flow (register → assess → apply → discounts)
2. Test complete company flow (register → post job → manage applications)
3. Test complete admin flow (approve jobs → verify students → view analytics)
4. Test on multiple devices
5. Test on multiple browsers
6. Document bugs
7. Fix critical bugs

**Deliverables:**
- Bug report
- Fixed critical bugs

---

### Task 9.5: Create Final Demo Video
**Status:** Not Started  
**Dependencies:** All features complete  
**Estimated Time:** 2 hours

**Steps:**
1. Record screen while using app
2. Show all 3 services
3. Highlight "What Should I Do Next?" feature
4. Show student verification flow
5. Show company job posting
6. Edit video
7. Add voiceover/music (optional)

**Deliverables:**
- Demo video (5-10 minutes)

---

## Task Summary by Priority

### Critical Path Tasks (Must Complete)
- 1.1: Verify Database Migrations
- 1.3: Test Company Registration
- 1.7: Seed Demo Jobs
- 3.1: Create Career Tables
- 3.2: Set Up OpenAI Integration
- 3.5: Create Career API Routes
- 3.7: Implement "What Should I Do Next?"
- 4.7: Build "What Should I Do Next?" Component
- 5.1: Create Discounts Tables
- 5.3: Create Discount API Routes
- 5.4: Create Verification API Routes
- 6.1: Build Discount Marketplace
- 6.3: Build Verification Flow
- 8.1: Set Up Error Tracking

### High Priority Tasks
- All Phase 1 tasks (stabilization)
- All Phase 2 tasks (homepage)
- Most Phase 3-6 tasks (core features)

### Medium Priority Tasks
- Counselor booking features
- Admin analytics
- Performance optimizations

### Low Priority Tasks
- Advanced visualizations
- Demo video
- Additional documentation

---

## Estimated Total Time

- Phase 1: 5-7 hours
- Phase 2: 8-10 hours
- Phase 3: 20-25 hours
- Phase 4: 30-35 hours
- Phase 5: 13-16 hours
- Phase 6: 23-27 hours
- Phase 7: 26-32 hours
- Phase 8: 13-16 hours
- Phase 9: 17-21 hours

**Total: 155-189 hours (approximately 4-5 weeks full-time)**

---

## Next Steps

1. Review and approve this task list
2. Begin Phase 1 (Stabilization)
3. Complete Phase 1 before moving to Phase 2
4. After each phase, review and adjust plan if needed
5. Track progress using GitHub Projects or similar tool

---

**Document Status:** Ready for Implementation  
**Last Updated:** August 19, 2026
