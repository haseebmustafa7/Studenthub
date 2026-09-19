# StudentHub Platform Transformation - Design Document

## Overview

This document outlines the technical design for transforming StudentHub from a job platform into a comprehensive 3-service career platform. The design preserves existing working functionality while adding Career Counselling and Student Discounts.

---

## Architecture Overview

### Current Architecture (Preserved)
```
┌─────────────────────────────────────────────┐
│  Frontend (React + Vite + Tailwind)         │
│  - Public pages (/, /jobs, /jobs/:id)       │
│  - Student dashboard (/dashboard/*)         │
│  - Company dashboard (/company/*)           │
│  - Admin dashboard (/admin/*)               │
└────────────────┬────────────────────────────┘
                 │ HTTP/REST
                 │
┌────────────────▼────────────────────────────┐
│  Backend (Express + Node.js)                │
│  - Auth routes                              │
│  - Job routes                               │
│  - Application routes                       │
│  - Profile routes                           │
│  - Admin routes                             │
└────────────────┬────────────────────────────┘
                 │ Supabase Client
                 │
┌────────────────▼────────────────────────────┐
│  Supabase                                   │
│  ├── PostgreSQL (with RLS)                  │
│  ├── Authentication                         │
│  └── Storage                                │
└─────────────────────────────────────────────┘
```

### Enhanced Architecture (New)
```
┌─────────────────────────────────────────────┐
│  Frontend                                   │
│  ├── Jobs & Internships (existing)          │
│  ├── Career Counselling (NEW)               │
│  │   ├── Assessment Flow                    │
│  │   ├── Results Dashboard                  │
│  │   ├── Skill Analysis                     │
│  │   ├── Gap Analysis                       │
│  │   ├── Learning Roadmap                   │
│  │   ├── What Should I Do Next? 🔥          │
│  │   └── Book Counselor                     │
│  └── Student Discounts (NEW)                │
│      ├── Marketplace                        │
│      ├── Discount Details                   │
│      └── Verification Flow                  │
└────────────────┬────────────────────────────┘
                 │
┌────────────────▼────────────────────────────┐
│  Backend                                    │
│  ├── Existing routes (preserved)            │
│  ├── Career routes (NEW)                    │
│  │   ├── /api/career/assessment             │
│  │   ├── /api/career/recommendations        │
│  │   ├── /api/career/skill-analysis         │
│  │   ├── /api/career/what-should-i-do-next  │
│  │   └── /api/career/counselors             │
│  ├── Discount routes (NEW)                  │
│  │   ├── /api/discounts                     │
│  │   └── /api/verification                  │
│  └── AI Service Layer (NEW)                 │
│      ├── LLM Client (OpenAI)                │
│      ├── Prompt Templates                   │
│      ├── Response Parser                    │
│      └── Recommendation Engine              │
└────────────────┬────────────────────────────┘
                 │
┌────────────────▼────────────────────────────┐
│  Supabase                                   │
│  ├── Existing tables (preserved)            │
│  ├── New tables (career, discounts)         │
│  └── New RLS policies                       │
└────────────────┬────────────────────────────┘
                 │
┌────────────────▼────────────────────────────┐
│  External Services                          │
│  ├── OpenAI API (GPT-4)                     │
│  ├── SMTP (email notifications)             │
│  └── Sentry (error tracking)                │
└─────────────────────────────────────────────┘
```

---

## Database Design

### New Tables

#### 1. career_assessments
**Purpose:** Store student career assessment responses

```sql
CREATE TABLE career_assessments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Assessment data (JSONB for flexibility)
    responses JSONB NOT NULL, -- Structured answers
    
    -- AI-generated results
    ai_analysis JSONB, -- Parsed AI response
    personality_type VARCHAR(50),
    strengths TEXT[],
    weaknesses TEXT[],
    recommended_careers TEXT[],
    confidence_score DECIMAL(3,2), -- 0.00 to 1.00
    
    -- Metadata
    status VARCHAR(20) DEFAULT 'completed' CHECK (status IN ('in_progress', 'completed')),
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_career_assessments_user_id ON career_assessments(user_id);
CREATE INDEX idx_career_assessments_completed_at ON career_assessments(completed_at DESC);

-- RLS Policies
ALTER TABLE career_assessments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own assessments"
    ON career_assessments FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own assessments"
    ON career_assessments FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own assessments"
    ON career_assessments FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);
```

#### 2. skill_profiles
**Purpose:** Track student skills and skill gaps

```sql
CREATE TABLE skill_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Skills data
    current_skills TEXT[], -- Skills user has
    target_skills TEXT[], -- Skills user wants
    skill_gaps TEXT[], -- Calculated: target - current
    
    -- Proficiency levels (optional)
    skill_levels JSONB, -- {"React": "intermediate", "Python": "beginner"}
    
    -- Metadata
    last_analyzed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- One profile per user
    UNIQUE(user_id)
);

-- Indexes
CREATE INDEX idx_skill_profiles_user_id ON skill_profiles(user_id);
CREATE INDEX idx_skill_profiles_current_skills ON skill_profiles USING GIN(current_skills);
CREATE INDEX idx_skill_profiles_target_skills ON skill_profiles USING GIN(target_skills);

-- RLS Policies
ALTER TABLE skill_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own skill profile"
    ON skill_profiles FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own skill profile"
    ON skill_profiles FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own skill profile"
    ON skill_profiles FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);
```

#### 3. career_recommendations
**Purpose:** Store AI-generated career recommendations

```sql
CREATE TABLE career_recommendations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    assessment_id UUID REFERENCES career_assessments(id),
    
    -- Recommendation data
    recommendation_type VARCHAR(50) NOT NULL, -- 'job', 'skill', 'course', 'action'
    title VARCHAR(255) NOT NULL,
    description TEXT,
    
    -- Scoring
    priority INTEGER DEFAULT 5, -- 1 (highest) to 10 (lowest)
    impact_score DECIMAL(5,2), -- 0-100
    effort_score DECIMAL(5,2), -- 0-100
    
    -- Additional metadata
    metadata JSONB, -- Flexible data (links, resources, etc.)
    
    -- Status
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'dismissed')),
    completed_at TIMESTAMPTZ,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_career_recommendations_user_id ON career_recommendations(user_id);
CREATE INDEX idx_career_recommendations_type ON career_recommendations(recommendation_type);
CREATE INDEX idx_career_recommendations_priority ON career_recommendations(priority, impact_score DESC);
CREATE INDEX idx_career_recommendations_status ON career_recommendations(status);

-- RLS Policies
ALTER TABLE career_recommendations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own recommendations"
    ON career_recommendations FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own recommendations"
    ON career_recommendations FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);
```

#### 4. counselor_profiles
**Purpose:** Store career counselor information

```sql
CREATE TABLE counselor_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Counselor info
    full_name VARCHAR(255) NOT NULL,
    photo_url TEXT,
    bio TEXT,
    specialization VARCHAR(100), -- e.g., "Software Engineering Careers"
    specializations TEXT[], -- Can have multiple
    
    -- Availability
    is_available BOOLEAN DEFAULT true,
    hourly_rate DECIMAL(10,2), -- Optional
    
    -- Stats
    total_sessions INTEGER DEFAULT 0,
    average_rating DECIMAL(3,2), -- Future: reviews
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(user_id)
);

-- Indexes
CREATE INDEX idx_counselor_profiles_available ON counselor_profiles(is_available);
CREATE INDEX idx_counselor_profiles_specialization ON counselor_profiles(specialization);

-- RLS Policies
ALTER TABLE counselor_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view available counselors"
    ON counselor_profiles FOR SELECT
    USING (is_available = true);

CREATE POLICY "Admins can insert counselor profiles"
    ON counselor_profiles FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Admins can update counselor profiles"
    ON counselor_profiles FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );
```

#### 5. counselor_sessions
**Purpose:** Track counselor booking sessions

```sql
CREATE TABLE counselor_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    counselor_id UUID NOT NULL REFERENCES counselor_profiles(id),
    
    -- Session details
    session_type VARCHAR(50) NOT NULL, -- 'career', 'resume', 'interview'
    status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled', 'no_show')),
    
    -- Scheduling
    scheduled_at TIMESTAMPTZ NOT NULL,
    duration_minutes INTEGER DEFAULT 60,
    
    -- Notes
    student_notes TEXT, -- What student wants to discuss
    counselor_notes TEXT, -- Counselor's session notes (private)
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_counselor_sessions_user_id ON counselor_sessions(user_id);
CREATE INDEX idx_counselor_sessions_counselor_id ON counselor_sessions(counselor_id);
CREATE INDEX idx_counselor_sessions_scheduled_at ON counselor_sessions(scheduled_at);
CREATE INDEX idx_counselor_sessions_status ON counselor_sessions(status);

-- RLS Policies
ALTER TABLE counselor_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view their own sessions"
    ON counselor_sessions FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Counselors can view their sessions"
    ON counselor_sessions FOR SELECT
    USING (
        counselor_id IN (
            SELECT id FROM counselor_profiles WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Students can book sessions"
    ON counselor_sessions FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Students and counselors can update sessions"
    ON counselor_sessions FOR UPDATE
    USING (
        auth.uid() = user_id OR
        counselor_id IN (
            SELECT id FROM counselor_profiles WHERE user_id = auth.uid()
        )
    );
```

#### 6. discount_partners
**Purpose:** Store companies offering student discounts

```sql
CREATE TABLE discount_partners (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Company info
    company_name VARCHAR(255) NOT NULL,
    logo_url TEXT,
    website VARCHAR(255),
    description TEXT,
    category VARCHAR(100), -- 'software', 'food', 'travel', etc.
    
    -- Verification
    is_verified BOOLEAN DEFAULT false,
    verified_at TIMESTAMPTZ,
    verified_by UUID REFERENCES auth.users(id),
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_discount_partners_category ON discount_partners(category);
CREATE INDEX idx_discount_partners_verified ON discount_partners(is_verified);

-- RLS Policies
ALTER TABLE discount_partners ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view verified partners"
    ON discount_partners FOR SELECT
    USING (is_verified = true);

CREATE POLICY "Admins can manage partners"
    ON discount_partners FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );
```

#### 7. discounts
**Purpose:** Store individual discount offers

```sql
CREATE TABLE discounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    partner_id UUID NOT NULL REFERENCES discount_partners(id) ON DELETE CASCADE,
    
    -- Discount info
    title VARCHAR(255) NOT NULL,
    description TEXT,
    
    -- Discount details
    discount_type VARCHAR(20) NOT NULL CHECK (discount_type IN ('percentage', 'fixed', 'free_trial')),
    discount_value DECIMAL(10,2), -- e.g., 20 for 20% or 20 for $20 off
    discount_code VARCHAR(50), -- Optional promo code
    
    -- Terms
    terms_conditions TEXT,
    how_to_redeem TEXT,
    
    -- Categorization
    category VARCHAR(100), -- 'software', 'food', 'travel', etc.
    
    -- Validity
    expiry_date DATE,
    is_active BOOLEAN DEFAULT true,
    
    -- Stats
    view_count INTEGER DEFAULT 0,
    click_count INTEGER DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_discounts_partner_id ON discounts(partner_id);
CREATE INDEX idx_discounts_category ON discounts(category);
CREATE INDEX idx_discounts_active ON discounts(is_active);
CREATE INDEX idx_discounts_expiry ON discounts(expiry_date) WHERE expiry_date IS NOT NULL;

-- RLS Policies
ALTER TABLE discounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active discounts"
    ON discounts FOR SELECT
    USING (is_active = true AND (expiry_date IS NULL OR expiry_date > CURRENT_DATE));

CREATE POLICY "Admins can manage discounts"
    ON discounts FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );
```

#### 8. student_verifications
**Purpose:** Track student verification status

```sql
CREATE TABLE student_verifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Verification data
    university_email VARCHAR(255),
    student_id_url TEXT, -- Uploaded ID card/enrollment letter
    
    -- Status
    verification_status VARCHAR(20) DEFAULT 'pending' CHECK (
        verification_status IN ('pending', 'verified', 'rejected', 'expired')
    ),
    
    -- Review
    reviewed_by UUID REFERENCES auth.users(id),
    reviewed_at TIMESTAMPTZ,
    rejection_reason TEXT,
    
    -- Expiry
    expires_at TIMESTAMPTZ, -- 1 year from verification
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Only one active verification per user
    UNIQUE(user_id)
);

-- Indexes
CREATE INDEX idx_student_verifications_user_id ON student_verifications(user_id);
CREATE INDEX idx_student_verifications_status ON student_verifications(verification_status);
CREATE INDEX idx_student_verifications_pending ON student_verifications(verification_status) 
    WHERE verification_status = 'pending';

-- RLS Policies
ALTER TABLE student_verifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own verification"
    ON student_verifications FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can submit verification"
    ON student_verifications FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their pending verification"
    ON student_verifications FOR UPDATE
    USING (auth.uid() = user_id AND verification_status = 'pending')
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all verifications"
    ON student_verifications FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Admins can update verifications"
    ON student_verifications FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );
```

#### 9. saved_discounts
**Purpose:** Track user-saved discounts

```sql
CREATE TABLE saved_discounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    discount_id UUID NOT NULL REFERENCES discounts(id) ON DELETE CASCADE,
    
    saved_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Unique constraint: user can't save same discount twice
    UNIQUE(user_id, discount_id)
);

-- Indexes
CREATE INDEX idx_saved_discounts_user_id ON saved_discounts(user_id);
CREATE INDEX idx_saved_discounts_discount_id ON saved_discounts(discount_id);

-- RLS Policies
ALTER TABLE saved_discounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their saved discounts"
    ON saved_discounts FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can save discounts"
    ON saved_discounts FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unsave discounts"
    ON saved_discounts FOR DELETE
    USING (auth.uid() = user_id);
```

---

## API Design

### Career Counselling APIs

#### POST /api/career/assessment/start
**Purpose:** Initialize new assessment  
**Auth:** Required (student)  
**Request:**
```json
{
  "assessment_type": "full" | "quick"
}
```
**Response:**
```json
{
  "assessment_id": "uuid",
  "questions": [
    {
      "id": "q1",
      "type": "multiple_choice" | "rating" | "text",
      "question": "What are your strongest skills?",
      "options": ["Programming", "Design", "..."]
    }
  ]
}
```

#### POST /api/career/assessment/submit
**Purpose:** Submit completed assessment  
**Auth:** Required (student)  
**Request:**
```json
{
  "assessment_id": "uuid",
  "responses": {
    "q1": ["Programming", "Problem Solving"],
    "q2": 4,
    "q3": "I want to become a software engineer..."
  }
}
```
**Response:**
```json
{
  "assessment_id": "uuid",
  "status": "completed",
  "ai_analysis": {
    "personality_type": "Analytical Builder",
    "strengths": ["..."],
    "weaknesses": ["..."],
    "recommended_careers": ["..."],
    "confidence_score": 0.87
  },
  "next_steps": {
    "view_results": "/dashboard/career/results",
    "view_recommendations": "/dashboard/career/recommendations"
  }
}
```

#### GET /api/career/recommendations
**Purpose:** Get personalized recommendations  
**Auth:** Required (student)  
**Query Params:** `?type=job|skill|course|action&status=active|completed`  
**Response:**
```json
{
  "recommendations": [
    {
      "id": "uuid",
      "type": "skill",
      "title": "Learn TypeScript",
      "description": "Required for 80% of jobs you're interested in",
      "priority": 1,
      "impact_score": 92,
      "effort_score": 35,
      "metadata": {
        "resources": ["course_url", "..."],
        "estimated_time": "2-3 weeks"
      }
    }
  ],
  "total": 15
}
```

#### GET /api/career/what-should-i-do-next
**Purpose:** Get single highest-impact action (WOW FEATURE)  
**Auth:** Required (student)  
**Response:**
```json
{
  "action": {
    "type": "apply_to_job",
    "title": "Apply to Software Engineering Internship at XYZ Corp",
    "reason": "You're 95% qualified and the deadline is in 3 days",
    "impact_score": 92,
    "effort_score": 15,
    "cta_text": "Apply Now",
    "cta_link": "/jobs/abc123"
  },
  "context": {
    "profile_completion": 85,
    "assessment_completed": true,
    "pending_applications": 3,
    "saved_jobs": 7
  }
}
```

#### GET /api/career/skill-analysis
**Purpose:** Get skill gap analysis  
**Auth:** Required (student)  
**Response:**
```json
{
  "current_skills": ["React", "JavaScript", "HTML", "CSS"],
  "target_skills": ["React", "TypeScript", "Node.js", "PostgreSQL"],
  "skill_gaps": ["TypeScript", "Node.js", "PostgreSQL"],
  "market_demand": {
    "TypeScript": { "demand_score": 95, "job_count": 234 },
    "Node.js": { "demand_score": 88, "job_count": 189 }
  },
  "recommendations": [
    {
      "skill": "TypeScript",
      "priority": 1,
      "reason": "Required by 80% of jobs you're interested in",
      "learning_resources": ["..."]
    }
  ]
}
```

#### GET /api/career/counselors
**Purpose:** Get available counselors  
**Auth:** Required (student)  
**Query Params:** `?specialization=software_engineering`  
**Response:**
```json
{
  "counselors": [
    {
      "id": "uuid",
      "name": "John Doe",
      "photo_url": "...",
      "bio": "10 years in software engineering recruiting...",
      "specialization": "Software Engineering Careers",
      "hourly_rate": 50,
      "average_rating": 4.8,
      "total_sessions": 127
    }
  ]
}
```

#### POST /api/career/counselors/:id/book
**Purpose:** Book counselor session  
**Auth:** Required (student)  
**Request:**
```json
{
  "session_type": "career",
  "scheduled_at": "2026-08-25T14:00:00Z",
  "duration_minutes": 60,
  "notes": "I want to discuss career options in AI/ML"
}
```
**Response:**
```json
{
  "session_id": "uuid",
  "status": "scheduled",
  "confirmation": "Booking confirmed! You'll receive an email soon."
}
```

### Student Discounts APIs

#### GET /api/discounts
**Purpose:** Browse all discounts  
**Auth:** Optional  
**Query Params:** `?category=software&page=1&limit=20`  
**Response:**
```json
{
  "discounts": [
    {
      "id": "uuid",
      "partner": {
        "name": "GitHub",
        "logo_url": "..."
      },
      "title": "GitHub Student Developer Pack",
      "description": "Free access to GitHub Pro and more",
      "discount_type": "free_trial",
      "category": "software",
      "expiry_date": "2027-12-31",
      "is_saved": false,
      "requires_verification": true
    }
  ],
  "total": 47,
  "page": 1,
  "pages": 3
}
```

#### GET /api/discounts/:id
**Purpose:** Get discount details  
**Auth:** Optional (code hidden if not verified)  
**Response:**
```json
{
  "id": "uuid",
  "partner": {
    "name": "GitHub",
    "logo_url": "...",
    "website": "https://github.com"
  },
  "title": "GitHub Student Developer Pack",
  "description": "Full description...",
  "discount_type": "free_trial",
  "discount_code": "STUDENT2026", // Hidden if not verified
  "terms_conditions": "...",
  "how_to_redeem": "...",
  "category": "software",
  "expiry_date": "2027-12-31",
  "is_saved": false,
  "view_count": 1234,
  "user_verification_status": "verified" | "pending" | "unverified"
}
```

#### POST /api/discounts/:id/save
**Purpose:** Save/bookmark discount  
**Auth:** Required (student)  
**Response:**
```json
{
  "message": "Discount saved successfully",
  "saved": true
}
```

#### DELETE /api/discounts/:id/save
**Purpose:** Unsave discount  
**Auth:** Required (student)  
**Response:**
```json
{
  "message": "Discount removed from saved",
  "saved": false
}
```

#### POST /api/verification/submit
**Purpose:** Submit student verification  
**Auth:** Required (student)  
**Request (multipart/form-data):**
```
university_email: student@university.edu
student_id_file: [uploaded file]
```
**Response:**
```json
{
  "verification_id": "uuid",
  "status": "pending",
  "message": "Verification submitted. We'll review within 24 hours.",
  "email_sent": true
}
```

#### GET /api/verification/status
**Purpose:** Check verification status  
**Auth:** Required (student)  
**Response:**
```json
{
  "status": "verified" | "pending" | "rejected" | "unverified",
  "verified_at": "2026-08-15T10:30:00Z",
  "expires_at": "2027-08-15T10:30:00Z",
  "rejection_reason": null,
  "can_resubmit": false
}
```

---

## AI Service Design

### LLM Client Wrapper
```javascript
// backend/src/services/ai/llmClient.js
import OpenAI from 'openai'

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function generateStructuredResponse(prompt, schema) {
  try {
    const response = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4-turbo-preview',
      messages: [
        { role: 'system', content: 'You are a career counselor AI.' },
        { role: 'user', content: prompt }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7
    })
    
    const content = response.choices[0].message.content
    const parsed = JSON.parse(content)
    
    // Validate against schema
    return schema.parse(parsed)
  } catch (error) {
    console.error('LLM error:', error)
    throw new Error('Failed to generate AI response')
  }
}
```

### Assessment Analysis Prompt
```javascript
// backend/src/services/ai/promptTemplates.js
export function buildAssessmentPrompt(userProfile, responses) {
  return `
You are a professional career counselor analyzing a student's career assessment.

Student Profile:
- Name: ${userProfile.full_name}
- Major: ${userProfile.major}
- University: ${userProfile.university}
- Graduation Year: ${userProfile.graduation_year}

Assessment Responses:
${JSON.stringify(responses, null, 2)}

Based on this information, provide a comprehensive career analysis.

Respond with JSON matching this schema:
{
  "personality_type": "string (e.g., 'Analytical Builder', 'Creative Problem Solver')",
  "strengths": ["string", "string", ...],
  "weaknesses": ["string", "string", ...],
  "recommended_careers": ["string", "string", ...],
  "recommended_skills": ["string", "string", ...],
  "confidence_score": number (0.0 to 1.0)
}
  `.trim()
}
```

### "What Should I Do Next?" Prompt
```javascript
export function buildNextActionPrompt(context) {
  return `
You are a career advisor AI helping a student decide their next action.

Student Context:
- Profile Completion: ${context.profileCompletion}%
- Assessment Completed: ${context.assessmentCompleted ? 'Yes' : 'No'}
- Recent Activity: ${context.recentActivity.join(', ')}
- Skill Gaps: ${context.skillGaps.join(', ')}
- Saved Jobs: ${context.savedJobs} (requirements: ${context.jobRequirements.join(', ')})
- Pending Applications: ${context.pendingApplications}
- Upcoming Deadlines: ${context.deadlines.map(d => `${d.title} (${d.daysUntil} days)`).join(', ')}

Analyze this context and recommend the SINGLE highest-impact action this student should take RIGHT NOW.

Consider:
1. Urgency (deadlines approaching)
2. Impact (how much this helps their career)
3. Effort required (realistic given their schedule)
4. Readiness (are they qualified/prepared)

Respond with JSON:
{
  "action_type": "apply_to_job" | "complete_assessment" | "learn_skill" | "update_profile" | "book_counselor",
  "title": "string (actionable title)",
  "reason": "string (why this is the highest-impact action right now)",
  "impact_score": number (0-100),
  "effort_score": number (0-100, lower is easier),
  "cta_text": "string (button text)",
  "cta_link": "string (URL path)"
}
  `.trim()
}
```

---

## Frontend Component Design

### Homepage Redesign

```jsx
// frontend/src/pages/Home.jsx
export default function Home() {
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-accent py-20">
        <div className="container mx-auto px-4 text-center text-white">
          <h1 className="text-5xl font-bold mb-4">
            Your Complete Career Companion
          </h1>
          <p className="text-xl mb-8">
            Find opportunities, get guidance, save money — all in one platform
          </p>
        </div>
      </section>

      {/* 3 Service Blocks */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Jobs & Internships */}
            <ServiceBlock
              icon={<Briefcase size={48} />}
              title="Jobs & Internships"
              description="Browse 1000+ opportunities from top companies. Find your perfect match with our map-based search."
              ctaText="Explore Jobs"
              ctaLink="/jobs"
              color="primary"
            />

            {/* Career Counselling */}
            <ServiceBlock
              icon={<Target size={48} />}
              title="Career Counselling"
              description="AI-powered career guidance. Get personalized recommendations and expert advice."
              ctaText="Start Assessment"
              ctaLink="/career/assessment"
              color="secondary"
            />

            {/* Student Discounts */}
            <ServiceBlock
              icon={<Tag size={48} />}
              title="Student Discounts"
              description="Exclusive deals on software, food, travel, and more. Verified students only."
              ctaText="Browse Discounts"
              ctaLink="/discounts"
              color="accent"
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <StatCard number="1000+" label="Active Jobs" />
            <StatCard number="500+" label="Companies" />
            <StatCard number="50+" label="Student Discounts" />
            <StatCard number="10k+" label="Students Helped" />
          </div>
        </div>
      </section>
    </MainLayout>
  )
}
```

### "What Should I Do Next?" Component

```jsx
// frontend/src/components/career/NextActionCard.jsx
export default function NextActionCard() {
  const { data, loading, error } = useNextAction() // Custom hook

  if (loading) return <Skeleton />
  if (error) return <ErrorMessage error={error} />
  if (!data) return null

  const { action } = data

  return (
    <div className="bg-gradient-to-r from-primary to-accent p-6 rounded-lg shadow-lg text-white">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Zap size={32} className="text-yellow-300" />
          <h3 className="text-2xl font-bold">What Should I Do Next?</h3>
        </div>
        <button className="text-white/80 hover:text-white">
          <RefreshCw size={20} />
        </button>
      </div>

      <h4 className="text-xl font-semibold mb-2">{action.title}</h4>
      <p className="text-white/90 mb-4">{action.reason}</p>

      <div className="flex items-center space-x-4 mb-4">
        <div className="flex items-center space-x-2">
          <TrendingUp size={18} />
          <span className="text-sm">Impact: {action.impact_score}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Clock size={18} />
          <span className="text-sm">Effort: {action.effort_score}</span>
        </div>
      </div>

      <Link
        to={action.cta_link}
        className="block w-full bg-white text-primary text-center py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
      >
        {action.cta_text} →
      </Link>
    </div>
  )
}
```

---

## Design System Updates

### New Color Additions
```css
/* Existing colors preserved */
--primary: #3B82F6;
--secondary: #10B981;
--accent: #8B5CF6;

/* New colors */
--career: #8B5CF6; /* Purple for career features */
--discount: #F59E0B; /* Amber for discounts */
--success: #10B981;
--warning: #F59E0B;
--error: #EF4444;
```

### New Component Patterns

**Service Block:**
```jsx
<div className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition">
  <div className="text-{color} mb-4">{icon}</div>
  <h3 className="text-2xl font-bold mb-2">{title}</h3>
  <p className="text-gray-600 mb-4">{description}</p>
  <button className="bg-{color} text-white px-6 py-2 rounded-lg">
    {ctaText}
  </button>
</div>
```

**Progress Card:**
```jsx
<div className="bg-white p-6 rounded-lg shadow-md">
  <h4 className="font-semibold mb-2">{title}</h4>
  <div className="w-full bg-gray-200 rounded-full h-3">
    <div className="bg-primary h-3 rounded-full" style={{width: `${percentage}%`}}></div>
  </div>
  <p className="text-sm text-gray-600 mt-2">{percentage}% complete</p>
</div>
```

---

## Security Considerations

### Authentication
- ✅ All existing auth preserved (Supabase Auth)
- ✅ Role-based access control maintained
- ✅ Session management unchanged

### Authorization (RLS)
- ✅ All new tables have RLS enabled
- ✅ Users can only access their own data
- ✅ Admins have appropriate elevated access
- ✅ Public data (discounts, counselors) properly exposed

### File Uploads
- ⚠️ Add file type whitelist validation
- ⚠️ Add file size limits (5MB)
- ⚠️ Scan for malware (future: ClamAV)

### API Security
- ⚠️ Add rate limiting (express-rate-limit)
- ⚠️ Add request validation (Zod schemas)
- ⚠️ Add CORS whitelist
- ⚠️ Add Helmet.js security headers

### AI Security
- Never send PII to AI unless necessary
- Sanitize user input before AI prompts
- Validate AI responses with schemas
- Log all AI interactions for audit

---

## Performance Optimizations

### Database
- All tables have proper indexes
- Use pagination on all list queries
- Use database views for complex queries
- Enable query caching where appropriate

### API
- Add Redis caching layer (future)
- Response compression (gzip)
- CDN for static assets
- API response caching

### Frontend
- Code splitting (React.lazy)
- Image lazy loading
- Bundle optimization
- Prefetching for critical routes

---

## Error Handling Strategy

### Frontend
```javascript
try {
  const response = await api.post('/career/assessment/submit', data)
  toast.success('Assessment submitted successfully!')
  navigate('/career/results')
} catch (error) {
  if (error.response?.status === 401) {
    toast.error('Please log in to continue')
    navigate('/login')
  } else if (error.response?.data?.message) {
    toast.error(error.response.data.message)
  } else {
    toast.error('Something went wrong. Please try again.')
    logErrorToSentry(error)
  }
}
```

### Backend
```javascript
// Global error handler
app.use((error, req, res, next) => {
  console.error('Error:', error)
  
  // Log to Sentry
  Sentry.captureException(error)
  
  // Send appropriate response
  if (error.status) {
    res.status(error.status).json({ message: error.message })
  } else {
    res.status(500).json({ 
      message: process.env.NODE_ENV === 'production' 
        ? 'Internal server error' 
        : error.message 
    })
  }
})
```

---

## Testing Strategy

### Unit Tests
- Test utility functions
- Test AI response parsers
- Test recommendation algorithms

### Integration Tests
- Test API endpoints
- Test database queries
- Test RLS policies

### E2E Tests (Future)
- Test complete user flows
- Test assessment submission
- Test discount browsing

---

## Deployment Considerations

### Environment Variables
```env
# Existing (preserved)
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# New
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4-turbo-preview
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
SENTRY_DSN=
REDIS_URL=
```

### Deployment Checklist
- [ ] Run database migrations
- [ ] Verify RLS policies
- [ ] Test all auth flows
- [ ] Configure environment variables
- [ ] Enable error tracking (Sentry)
- [ ] Set up monitoring
- [ ] Configure CORS properly
- [ ] Enable HTTPS
- [ ] Test on mobile devices

---

## Migration Plan

### Phase 1: Database
1. Run `00_upgrade_for_companies.sql` (if not already run)
2. Create new career tables
3. Create new discount tables
4. Verify all RLS policies
5. Seed initial data (demo jobs, sample discounts)

### Phase 2: Backend
1. Add AI service layer
2. Implement career APIs
3. Implement discount APIs
4. Add validation middleware
5. Add rate limiting
6. Test all endpoints

### Phase 3: Frontend
1. Redesign homepage
2. Build career assessment flow
3. Build recommendation dashboard
4. Build "What Should I Do Next?" component
5. Build discount marketplace
6. Build verification flow
7. Test all new flows

### Phase 4: Polish
1. Add loading states
2. Add empty states
3. Improve error messages
4. Mobile optimization
5. Accessibility audit
6. Performance optimization

---

## Conclusion

This design preserves all existing functionality while adding two major new feature sets (Career Counselling and Student Discounts). The architecture maintains the existing patterns and scales naturally with the new requirements.

**Key Design Decisions:**
- ✅ Structured AI (not just chatbot)
- ✅ Comprehensive RLS for security
- ✅ Reusable component patterns
- ✅ Clear API contracts
- ✅ Performance-first database design
- ✅ Mobile-responsive from the start

The design is ready for implementation following the phased approach outlined in the requirements document.
