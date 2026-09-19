# StudentHub Platform Transformation - Requirements

## Project Vision

Transform the existing StudentHub job platform into a comprehensive student career and support platform offering three core services:

1. **Jobs & Internships** (80% complete - enhance existing)
2. **Career Counselling** (new - AI-powered guidance)
3. **Student Discounts** (new - verified student deals)

## Core Principles

### Design Philosophy
- **IMPACT > UX > INNOVATION > RELIABILITY > VISUAL POLISH**
- "Real startup product, not a student CRUD project"
- Every feature must answer: "What decision does this help the student make?"
- Preserve existing working functionality
- Reuse existing components, APIs, database structures

### Technical Constraints
- Must NOT blindly rewrite existing code
- Must maintain backward compatibility with existing data
- Must preserve working student/company/admin flows
- Must maintain security (RLS policies)
- Free/low-cost tools preferred (no paid APIs unless necessary)

## User Roles

### 1. Student (Primary User)
**Existing Access:**
- Browse and search jobs
- Apply to jobs with resume + cover letter
- Track application status
- Save jobs for later
- View jobs on map ("Jobs Near Me")
- Manage profile (university, major, graduation year)

**New Access Required:**
- Complete career assessment
- View personalized recommendations
- Access learning roadmap
- See "What Should I Do Next?" feature
- Book counselor sessions
- Browse student discounts
- Verify student status
- Save favorite discounts

### 2. Company (Secondary User)
**Existing Access:**
- Post jobs with full details
- Manage own jobs (edit, pause, delete)
- View applications for own jobs
- Update application status
- Manage company profile

**No Changes Required** - Company functionality already complete

### 3. Admin (System Manager)
**Existing Access:**
- Approve/reject company-posted jobs
- View all users, jobs, applications
- System-wide oversight

**New Access Required:**
- Approve/reject student verifications
- Manage discount partners
- View analytics dashboard
- Manage counselor profiles

## Functional Requirements

### FR1: Homepage Redesign
**Priority:** High  
**Status:** New Feature

**Requirements:**
- Homepage must prominently display exactly 3 service blocks
- Each block must have: icon, title, description, CTA button
- Layout must be responsive (mobile/tablet/desktop)
- Navigation must include links to all 3 services
- Design must feel like a "real startup product"

**Acceptance Criteria:**
- [ ] 3 service blocks visible above the fold
- [ ] Each service has clear value proposition
- [ ] CTAs lead to correct pages
- [ ] Mobile-responsive layout
- [ ] Professional, modern design

---

### FR2: Career Counselling - Assessment
**Priority:** High  
**Status:** New Feature

**Requirements:**
- Structured career assessment questionnaire (not chatbot)
- Multi-step form with progress indicator
- Questions about: skills, interests, career goals, experience
- Save partial progress
- AI analysis of responses
- Display results in visual format
- Store assessment history

**Assessment Questions:**
1. Current Skills (multi-select)
2. Interest Areas (rating scale)
3. Career Goals (text + predefined options)
4. Work Style Preferences
5. Strengths & Weaknesses
6. Experience Level
7. Availability (full-time/part-time/internship)

**Acceptance Criteria:**
- [ ] Assessment can be started from dashboard
- [ ] Progress saved automatically
- [ ] Assessment can be resumed
- [ ] AI generates insights from responses
- [ ] Results displayed with visualizations
- [ ] Assessment can be retaken

---

### FR3: Career Counselling - Skill Analysis
**Priority:** High  
**Status:** New Feature

**Requirements:**
- Display current skills from profile + assessment
- Compare against market demand (job postings data)
- Identify skill gaps
- Show skill proficiency levels
- Recommend skills to learn next
- Visual skill map/chart

**Data Sources:**
1. User's self-reported skills
2. Job market data (from jobs table)
3. Industry trends (AI-generated or manual)

**Acceptance Criteria:**
- [ ] Current skills displayed clearly
- [ ] Gap analysis shows missing skills
- [ ] Recommendations prioritized by impact
- [ ] Visual representation (charts/graphs)
- [ ] Can drill down into specific skills

---

### FR4: Career Counselling - Gap Analysis
**Priority:** Medium  
**Status:** New Feature

**Requirements:**
- Identify gaps between current state and career goals
- Show: skill gaps, experience gaps, education gaps
- Provide actionable steps to close each gap
- Estimate time/effort required
- Link to learning resources

**Gap Types:**
- **Skill Gaps:** Missing technical/soft skills
- **Experience Gaps:** Lack of project/work experience
- **Education Gaps:** Missing certifications/courses
- **Network Gaps:** Lack of industry connections

**Acceptance Criteria:**
- [ ] All gap types identified
- [ ] Each gap has recommended actions
- [ ] Time estimates provided
- [ ] Resources linked (courses, projects, jobs)
- [ ] Can mark gaps as "working on it"

---

### FR5: Career Counselling - Learning Roadmap
**Priority:** Medium  
**Status:** New Feature

**Requirements:**
- Personalized learning path based on goals + gaps
- Timeline view (weeks/months)
- Milestones and checkpoints
- Recommended courses, projects, jobs
- Track progress on roadmap
- Update roadmap as goals change

**Roadmap Structure:**
```
Short-term (1-3 months)
├── Learn React.js (4 weeks)
├── Build portfolio project (3 weeks)
└── Apply to internships (ongoing)

Medium-term (3-6 months)
├── Complete internship
├── Learn TypeScript
└── Contribute to open source

Long-term (6-12 months)
├── Build full-stack project
├── Prepare for interviews
└── Apply to full-time jobs
```

**Acceptance Criteria:**
- [ ] Roadmap generated from assessment + goals
- [ ] Visual timeline display
- [ ] Can mark items as complete
- [ ] Progress percentage calculated
- [ ] Roadmap updates when profile changes

---

### FR6: Career Counselling - "What Should I Do Next?" 🔥 WOW FEATURE
**Priority:** CRITICAL  
**Status:** New Feature

**Requirements:**
- Prominent card on student dashboard
- AI analyzes current context and recommends SINGLE highest-impact action
- Context includes: profile completion, recent activity, deadlines, skill gaps, assessment results
- Recommendation must be actionable with direct link
- Updates in real-time as context changes
- Shows: action, reason (why), impact score, effort score

**Example Outputs:**
- "Apply to Software Engineering Internship at XYZ" (deadline in 3 days, 95% qualified)
- "Complete Your Career Assessment" (unlock personalized recommendations)
- "Learn TypeScript" (required for 80% of jobs you're interested in)
- "Update Your Resume" (profile only 60% complete)

**AI Prompt Structure:**
```
Context:
- Profile: {completion_percentage}%, missing {missing_fields}
- Recent Activity: {last_5_actions}
- Assessment: {completed? results_summary}
- Skill Gaps: {top_3_gaps}
- Saved Jobs: {count}, requirements: {common_skills}
- Applications: {count}, statuses: {breakdown}
- Upcoming Deadlines: {next_3_deadlines}

Generate the SINGLE highest-impact action this student should take RIGHT NOW.
Consider urgency, impact, and effort required.

Output JSON:
{
  "action_type": "apply_to_job" | "complete_assessment" | "learn_skill" | "update_profile",
  "title": "...",
  "reason": "...",
  "impact_score": 0-100,
  "effort_score": 0-100,
  "cta_text": "...",
  "cta_link": "..."
}
```

**Acceptance Criteria:**
- [ ] Visible prominently on dashboard (top card)
- [ ] Updates at least once per hour
- [ ] Recommendation is actionable
- [ ] CTA button works
- [ ] Shows why this action matters
- [ ] Impact/effort scores make sense

---

### FR7: Career Counselling - Human Counselors
**Priority:** Low  
**Status:** New Feature

**Requirements:**
- Directory of career counselors
- Counselor profiles: photo, bio, specialization, availability
- Booking system with calendar
- Session types: career guidance, resume review, interview prep
- Session history
- Email notifications for bookings

**Counselor Profile:**
- Name, photo
- Specialization (e.g., "Software Engineering Careers")
- Bio
- Availability (calendar)
- Hourly rate (optional)
- Reviews (future)

**Acceptance Criteria:**
- [ ] Can browse counselors
- [ ] Can filter by specialization
- [ ] Can view availability
- [ ] Can book session
- [ ] Email confirmation sent
- [ ] Session appears in dashboard

---

### FR8: Student Discounts - Marketplace
**Priority:** High  
**Status:** New Feature

**Requirements:**
- Browse all active student discounts
- Categories: Software, Food & Dining, Travel, Entertainment, Shopping, Education
- Filter by category
- Search by keyword
- Display: company logo, discount title, discount value, expiry date
- Click to view full details
- Save/bookmark discounts

**Discount Card Display:**
- Company logo
- Discount title
- Discount type (%, fixed amount, free trial)
- Discount value
- Category badge
- Expiry date
- "View Details" button
- "Save" button (if not saved)

**Acceptance Criteria:**
- [ ] All active discounts displayed
- [ ] Category filtering works
- [ ] Search works
- [ ] Can save discounts
- [ ] Can view full details
- [ ] Mobile-responsive grid

---

### FR9: Student Discounts - Discount Details
**Priority:** Medium  
**Status:** New Feature

**Requirements:**
- Full discount information page
- Display: company info, discount description, terms & conditions, how to redeem
- Discount code (revealed after verification)
- "Get Discount" CTA button
- Verification requirement indicator
- Related discounts

**Discount Details Page:**
- Company name, logo, website
- Full discount description
- Discount type + value
- Discount code (if applicable)
- Terms & conditions
- Expiry date
- "Verify Student Status" CTA (if not verified)
- "Copy Code" button (if verified)
- "Visit Website" button

**Acceptance Criteria:**
- [ ] All discount info visible
- [ ] Discount code hidden until verified
- [ ] Can copy code easily
- [ ] Terms readable
- [ ] External link works
- [ ] Related discounts suggested

---

### FR10: Student Discounts - Student Verification
**Priority:** High  
**Status:** New Feature

**Requirements:**
- Student verification flow
- Upload student ID card or enrollment letter
- Verify university email address
- Admin approval required
- Verification status displayed
- Verification expires after 1 year

**Verification Process:**
1. Student uploads ID + enters university email
2. System sends verification email
3. Student confirms email
4. Admin reviews ID upload
5. Admin approves/rejects
6. Student receives notification

**Verification Status:**
- **Unverified:** Can browse discounts, cannot access codes
- **Pending:** Submitted, awaiting admin approval
- **Verified:** Full access to all discounts
- **Rejected:** Can resubmit with different documents
- **Expired:** Need to re-verify

**Acceptance Criteria:**
- [ ] Upload flow works
- [ ] Email verification works
- [ ] Admin can approve/reject
- [ ] Status displayed in profile
- [ ] Verification expires after 1 year
- [ ] Can resubmit if rejected

---

### FR11: Admin - Discount Management
**Priority:** Medium  
**Status:** New Feature

**Requirements:**
- Admin interface to manage discount partners
- Add/edit/delete discount partners
- Add/edit/delete discounts
- Approve/reject student verifications
- View verification submissions
- View discount usage analytics

**Admin Features:**
- Partner CRUD
- Discount CRUD
- Verification queue
- Analytics dashboard (view counts, clicks, redemptions)

**Acceptance Criteria:**
- [ ] Can add new partners
- [ ] Can create discounts
- [ ] Verification queue visible
- [ ] Can approve/reject verifications
- [ ] Usage stats visible
- [ ] Can deactivate expired discounts

---

## Non-Functional Requirements

### NFR1: Performance
- Page load time < 3 seconds (desktop)
- API response time < 500ms (p95)
- Mobile Lighthouse score > 90
- Support 1000+ concurrent users

### NFR2: Security
- All data protected by RLS policies
- No user can access another user's private data
- File uploads validated (type, size)
- API rate limiting enabled
- Sensitive data encrypted
- HTTPS enforced

### NFR3: Scalability
- Database indexed properly
- Pagination on all list endpoints
- Caching for expensive queries
- Lazy loading for images
- Code splitting for frontend

### NFR4: Accessibility
- WCAG 2.1 AA compliance
- Keyboard navigation
- Screen reader support
- Alt text on images
- Proper ARIA labels

### NFR5: Reliability
- 99.9% uptime target
- Graceful error handling
- Fallbacks for AI failures
- Data backup daily
- Error logging (Sentry)

### NFR6: Maintainability
- Code documented
- Consistent code style
- Reusable components
- Environment-based config
- Clear folder structure

### NFR7: Cost Efficiency
- Use free/open-source tools where possible
- Optimize AI API usage (caching, rate limits)
- Use Leaflet + OpenStreetMap (not Google Maps)
- Self-host where feasible

---

## Technical Requirements

### TR1: Frontend Stack
- React 18 + Vite
- Tailwind CSS 3.4
- React Router v6
- React Context for state
- Axios for HTTP
- Leaflet for maps

### TR2: Backend Stack
- Node.js + Express
- Supabase (PostgreSQL + Auth + Storage)
- OpenAI API (GPT-4 Turbo)
- Multer for file uploads

### TR3: Database
- PostgreSQL via Supabase
- Row Level Security enabled
- Migrations in `database/` folder
- Indexes on frequently queried fields

### TR4: AI/ML
- OpenAI GPT-4 Turbo for AI generation
- Structured outputs (JSON mode)
- OpenAI embeddings for semantic matching
- pgvector for vector storage (if needed)

### TR5: Authentication
- Supabase Auth
- Role-based access control (student/company/admin)
- Email/password + OAuth (optional)
- Session management

### TR6: File Storage
- Supabase Storage
- Resume uploads (PDF, DOCX)
- Student ID uploads (JPG, PNG, PDF)
- Company logos (JPG, PNG)
- Max 5MB per file

---

## User Stories

### Student User Stories

**US1:** As a student, I want to see 3 clear service options on the homepage so I know what the platform offers.

**US2:** As a student, I want to complete a career assessment so I can get personalized guidance.

**US3:** As a student, I want to see my skill gaps so I know what to learn next.

**US4:** As a student, I want a personalized learning roadmap so I have a clear path to my career goals.

**US5:** As a student, I want to see "What Should I Do Next?" on my dashboard so I always know my highest-impact action.

**US6:** As a student, I want to browse student discounts so I can save money.

**US7:** As a student, I want to verify my student status so I can access exclusive discounts.

**US8:** As a student, I want to book a session with a career counselor so I can get expert advice.

**US9:** As a student, I want all my existing job features to still work (apply, save, search, map).

### Company User Stories

**US10:** As a company, I want all my existing features to continue working without disruption.

**US11:** As a company, I want students using the platform to be more qualified (thanks to career counselling).

### Admin User Stories

**US12:** As an admin, I want to approve/reject student verifications so only real students access discounts.

**US13:** As an admin, I want to manage discount partners so the marketplace stays up-to-date.

**US14:** As an admin, I want to view analytics so I understand platform usage.

**US15:** As an admin, I want all existing admin features to continue working.

---

## Out of Scope (Not in Initial Release)

- Mobile native apps (iOS/Android)
- Real-time chat between students and counselors
- Video call integration
- Resume builder tool
- Job recommendation emails
- Social features (student community, forums)
- Gamification (badges, points)
- Multi-language support
- Dark mode
- AI resume review (future phase)
- Career roadmap sharing (future phase)
- Discount referral program (future phase)

---

## Success Criteria

### Phase 0 (Complete)
- ✅ Repository inspected
- ✅ Analysis report created
- ✅ Spec structure created

### Phase 1
- All existing features work end-to-end
- Company can register → post job → receive application
- Student can register → browse → apply
- Map shows jobs correctly
- Demo jobs visible

### Phase 2
- Homepage displays 3 services prominently
- Navigation includes all services
- Professional, startup-quality design
- Mobile responsive

### Phase 3-5
- Career assessment completable
- AI generates recommendations
- "What Should I Do Next?" prominent in dashboard
- Skill analysis + gap analysis visible
- Learning roadmap generated

### Phase 6-7
- Student discounts browsable
- Verification flow works
- Discount codes accessible after verification
- Admin can manage partners/discounts

### Phase 8-9
- Performance metrics met
- Security audit passed
- Analytics tracking
- Error monitoring enabled

---

## Dependencies & Integrations

### External Services
- **Supabase:** Database, Auth, Storage (already integrated)
- **OpenAI:** GPT-4 API for AI features (new)
- **Email Service:** SMTP for notifications (new)
- **Sentry:** Error tracking (new)

### Internal Dependencies
- Frontend depends on Backend API
- Backend depends on Supabase
- AI features depend on OpenAI API
- Discounts depend on verification system
- "What Should I Do Next?" depends on assessment data

---

## Assumptions

1. Database migrations can be run without data loss
2. OpenAI API costs are acceptable (~$20-50/month for MVP)
3. Admin will manually manage discount partners initially
4. Email service is available (SMTP)
5. Existing Supabase project has sufficient quota
6. Users have modern browsers (last 2 versions)
7. Internet connection required (no offline mode)

---

## Constraints

1. Must preserve existing working functionality
2. Must use existing tech stack (React, Express, Supabase)
3. Must not require paid APIs unless absolutely necessary
4. Must complete within reasonable timeline (phases)
5. Must maintain security (RLS policies)
6. Must be mobile-responsive
7. Budget constraints (use free tier services where possible)

---

## Risks

### High Risk
- AI API costs could exceed budget
- Database migrations could cause data issues
- Scope creep (3 major features)

### Medium Risk
- AI quality inconsistency
- Performance degradation
- User adoption of new features

### Low Risk
- Existing features breaking
- Mobile UX issues
- Partner acquisition (can seed data)

---

## Glossary

- **RLS:** Row Level Security (PostgreSQL data isolation)
- **CTA:** Call to Action (button/link)
- **MVP:** Minimum Viable Product
- **LLM:** Large Language Model (AI)
- **WOW Feature:** Standout feature that makes users excited
- **Gap Analysis:** Identifying what's missing to reach goals
- **Skill Map:** Visual representation of skills
- **Roadmap:** Planned path to achieve goals
