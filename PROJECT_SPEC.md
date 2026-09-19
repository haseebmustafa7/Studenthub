# StudentHub - Project Specification

## 1. Project Overview

**Project Name:** StudentHub  
**Description:** A modern full-stack student internship and job platform that connects university students with internship and job opportunities.  
**Target Users:** University students seeking internships and jobs, and administrators managing job postings.

## 2. Technology Stack

### Frontend
- **Framework:** React 18+
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **State Management:** React Context API / Zustand
- **Routing:** React Router v6
- **HTTP Client:** Axios
- **UI Components:** Custom components with Tailwind CSS
- **Icons:** Lucide React / React Icons

### Backend
- **Runtime:** Node.js (v18+)
- **Framework:** Express.js
- **Authentication:** Supabase Auth
- **Database:** PostgreSQL (via Supabase)
- **ORM/Client:** Supabase JS Client
- **Environment Variables:** dotenv
- **Security:** helmet, cors, express-rate-limit
- **Validation:** express-validator / joi

### Database & Services
- **Database:** Supabase PostgreSQL (Free tier)
- **Authentication:** Supabase Auth (Free tier)
- **Storage:** Supabase Storage (for resume uploads - Free tier)
- **Hosting Options:** 
  - Frontend: Vercel / Netlify (Free tier)
  - Backend: Railway / Render (Free tier)

## 3. Core Features

### 3.1 User Authentication & Authorization
- **Student Registration**
  - Email and password registration
  - Email verification
  - Profile creation (name, university, major, graduation year)
  
- **Student Login**
  - Email/password login
  - Password reset functionality
  - Session management
  
- **Admin Authentication**
  - Separate admin login
  - Role-based access control
  - Admin-only routes protection

### 3.2 Student Features

#### Job/Internship Browsing
- View all available jobs and internships
- Infinite scroll or pagination
- Job card with key information:
  - Company name and logo
  - Job title
  - Location (Remote/Hybrid/On-site)
  - Job type (Internship/Full-time/Part-time)
  - Salary range (optional)
  - Posted date
  - Application deadline

#### Search & Filtering
- **Search:** By job title, company, or keywords
- **Filters:**
  - Job Type (Internship, Full-time, Part-time)
  - Location (City, Remote, Hybrid)
  - Industry/Category
  - Posted date (Last 24 hours, Last week, Last month)
  - Salary range
- **Sorting:**
  - Most recent
  - Application deadline
  - Relevance

#### Job Details Page
- Complete job description
- Requirements and qualifications
- Responsibilities
- Benefits
- Application deadline
- Contact information
- Apply button
- Share job functionality
- Save job for later

#### Job Application
- One-click apply (using profile information)
- Resume upload (PDF)
- Cover letter (optional text area)
- Application tracking
- View application status

#### Student Dashboard
- Profile management
- Update personal information
- Upload/update resume
- View applied jobs
- Track application status
- Saved jobs list

### 3.3 Admin Features

#### Admin Dashboard
- Overview statistics:
  - Total jobs posted
  - Total applications
  - Active jobs
  - Total registered students
  
#### Job Management
- **Add New Job**
  - Job title
  - Company name
  - Company logo URL
  - Job description (rich text)
  - Requirements
  - Location
  - Job type
  - Salary range
  - Application deadline
  - Contact email
  - Category/Industry
  
- **Edit Job**
  - Update any job field
  - Change job status (active/inactive)
  
- **Delete Job**
  - Soft delete with confirmation
  
- **View Applications**
  - List all applications for each job
  - Filter by status
  - View applicant details
  - Update application status (Pending, Reviewed, Shortlisted, Rejected)

## 4. Database Schema

### Tables

#### users
```sql
id: UUID (Primary Key)
email: VARCHAR(255) UNIQUE NOT NULL
role: ENUM('student', 'admin') DEFAULT 'student'
created_at: TIMESTAMP
```

#### profiles
```sql
id: UUID (Primary Key)
user_id: UUID (Foreign Key -> users.id)
full_name: VARCHAR(255)
university: VARCHAR(255)
major: VARCHAR(255)
graduation_year: INTEGER
phone: VARCHAR(20)
location: VARCHAR(255)
resume_url: TEXT
bio: TEXT
created_at: TIMESTAMP
updated_at: TIMESTAMP
```

#### jobs
```sql
id: UUID (Primary Key)
title: VARCHAR(255) NOT NULL
company_name: VARCHAR(255) NOT NULL
company_logo_url: TEXT
description: TEXT NOT NULL
requirements: TEXT
responsibilities: TEXT
benefits: TEXT
location: VARCHAR(255)
job_type: ENUM('internship', 'full-time', 'part-time')
work_mode: ENUM('remote', 'on-site', 'hybrid')
salary_min: INTEGER
salary_max: INTEGER
category: VARCHAR(100)
application_deadline: DATE
contact_email: VARCHAR(255)
is_active: BOOLEAN DEFAULT true
created_by: UUID (Foreign Key -> users.id)
created_at: TIMESTAMP
updated_at: TIMESTAMP
```

#### applications
```sql
id: UUID (Primary Key)
job_id: UUID (Foreign Key -> jobs.id)
user_id: UUID (Foreign Key -> users.id)
resume_url: TEXT
cover_letter: TEXT
status: ENUM('pending', 'reviewed', 'shortlisted', 'rejected') DEFAULT 'pending'
applied_at: TIMESTAMP
updated_at: TIMESTAMP
UNIQUE(job_id, user_id)
```

#### saved_jobs
```sql
id: UUID (Primary Key)
job_id: UUID (Foreign Key -> jobs.id)
user_id: UUID (Foreign Key -> users.id)
saved_at: TIMESTAMP
UNIQUE(job_id, user_id)
```

## 5. API Endpoints

### Authentication
- `POST /api/auth/register` - Student registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password
- `GET /api/auth/me` - Get current user

### Jobs (Public)
- `GET /api/jobs` - Get all jobs (with filters, search, pagination)
- `GET /api/jobs/:id` - Get single job details
- `GET /api/jobs/categories` - Get all job categories

### Jobs (Student - Protected)
- `POST /api/jobs/:id/apply` - Apply for a job
- `GET /api/jobs/:id/check-application` - Check if already applied
- `POST /api/jobs/:id/save` - Save job for later
- `DELETE /api/jobs/:id/unsave` - Remove from saved jobs
- `GET /api/jobs/saved` - Get saved jobs

### Applications (Student - Protected)
- `GET /api/applications` - Get user's applications
- `GET /api/applications/:id` - Get single application details

### Profile (Student - Protected)
- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update profile
- `POST /api/profile/resume` - Upload resume

### Admin Jobs (Admin - Protected)
- `POST /api/admin/jobs` - Create new job
- `PUT /api/admin/jobs/:id` - Update job
- `DELETE /api/admin/jobs/:id` - Delete job
- `GET /api/admin/jobs` - Get all jobs (including inactive)

### Admin Applications (Admin - Protected)
- `GET /api/admin/applications` - Get all applications
- `GET /api/admin/jobs/:id/applications` - Get applications for specific job
- `PUT /api/admin/applications/:id/status` - Update application status

### Admin Dashboard (Admin - Protected)
- `GET /api/admin/stats` - Get dashboard statistics

## 6. UI/UX Requirements

### Design Principles
- Clean and modern interface
- Student-friendly color scheme (blue, green, purple tones)
- Intuitive navigation
- Fast loading times
- Accessible (WCAG 2.1 Level AA)

### Responsive Design
- Mobile-first approach
- Breakpoints:
  - Mobile: 320px - 767px
  - Tablet: 768px - 1023px
  - Desktop: 1024px+
- Touch-friendly buttons and links
- Collapsible navigation on mobile

### Key Pages

#### Landing/Home Page
- Hero section with search bar
- Featured jobs
- Job categories
- Call-to-action buttons
- Footer with links

#### Jobs Listing Page
- Search bar and filters sidebar
- Job cards grid/list view
- Pagination or infinite scroll
- No results state

#### Job Detail Page
- Job information
- Apply button (prominent)
- Share and save buttons
- Related jobs section

#### Student Dashboard
- Side navigation
- Profile overview
- Applied jobs table
- Saved jobs section

#### Admin Dashboard
- Analytics cards
- Jobs management table
- Application management
- Quick actions

### Color Scheme (Suggestion)
- Primary: #3B82F6 (Blue)
- Secondary: #10B981 (Green)
- Accent: #8B5CF6 (Purple)
- Background: #F9FAFB (Light gray)
- Text: #111827 (Dark gray)
- Error: #EF4444 (Red)
- Success: #10B981 (Green)

## 7. Security Requirements

### Authentication & Authorization
- JWT tokens for session management
- HTTP-only cookies for token storage
- Role-based access control (RBAC)
- Protected routes on frontend and backend
- Admin routes restricted to admin users only

### Data Protection
- Password hashing (handled by Supabase)
- Input validation and sanitization
- SQL injection prevention
- XSS protection
- CORS configuration
- Rate limiting on API endpoints
- File upload validation (size, type)

### Best Practices
- HTTPS only in production
- Environment variables for secrets
- Secure headers (helmet.js)
- Content Security Policy
- Regular dependency updates

## 8. Performance Requirements

### Frontend
- Initial load time < 3 seconds
- Time to Interactive < 5 seconds
- Lighthouse score > 90
- Optimized images (lazy loading)
- Code splitting
- Bundle size optimization

### Backend
- API response time < 500ms
- Database query optimization
- Caching strategy (if needed)
- Efficient pagination

## 9. Development Phases

### Phase 1: Project Setup & Authentication
1. Initialize React + Vite project
2. Initialize Express backend
3. Set up Supabase project
4. Configure database schema
5. Implement authentication (registration, login, logout)
6. Set up routing and protected routes

### Phase 2: Core Student Features
1. Jobs listing page with search and filters
2. Job detail page
3. Job application functionality
4. Student profile management
5. Application tracking

### Phase 3: Admin Dashboard
1. Admin authentication
2. Job CRUD operations
3. Application management
4. Dashboard statistics

### Phase 4: Polish & Deployment
1. Responsive design refinement
2. Error handling and loading states
3. Testing
4. Deployment setup
5. Documentation

## 10. Project Structure

### Frontend Structure
```
frontend/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── common/
│   │   ├── jobs/
│   │   ├── auth/
│   │   ├── dashboard/
│   │   └── admin/
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Jobs.jsx
│   │   ├── JobDetail.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Dashboard.jsx
│   │   └── admin/
│   ├── context/
│   ├── hooks/
│   ├── services/
│   ├── utils/
│   ├── App.jsx
│   └── main.jsx
├── package.json
└── vite.config.js
```

### Backend Structure
```
backend/
├── src/
│   ├── config/
│   │   └── supabase.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── adminAuth.js
│   │   └── validation.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── jobs.js
│   │   ├── applications.js
│   │   ├── profile.js
│   │   └── admin.js
│   ├── controllers/
│   ├── utils/
│   └── server.js
├── package.json
└── .env.example
```

## 11. Environment Variables

### Frontend (.env)
```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_API_URL=http://localhost:5000/api
```

### Backend (.env)
```
PORT=5000
NODE_ENV=development
SUPABASE_URL=
SUPABASE_SERVICE_KEY=
SUPABASE_JWT_SECRET=
CORS_ORIGIN=http://localhost:5173
```

## 12. Testing Strategy

### Frontend Testing
- Component testing (React Testing Library)
- Integration testing
- E2E testing (optional - Playwright/Cypress)

### Backend Testing
- API endpoint testing (Jest/Supertest)
- Authentication flow testing
- Database operation testing

## 13. Deployment Strategy

### Frontend Deployment (Vercel - Free Tier)
- Connect GitHub repository
- Auto-deploy on push to main
- Environment variables configuration
- Custom domain (optional)

### Backend Deployment (Render - Free Tier)
- Connect GitHub repository
- Auto-deploy on push to main
- Environment variables configuration
- Keep-alive strategy (free tier sleeps after inactivity)

### Database (Supabase - Free Tier)
- Already hosted
- Automatic backups
- 500MB database storage
- 2GB file storage

## 14. Future Enhancements (Post-MVP)

- Email notifications
- Advanced analytics for students
- Company profiles
- Real-time chat with recruiters
- Resume builder
- Job recommendations based on profile
- Social login (Google, LinkedIn)
- Interview scheduling
- Skill assessments
- Bookmarking and notes
- Job alerts via email

## 15. Success Metrics

- User registration rate
- Job application conversion rate
- Average time on site
- Page load performance
- Mobile vs desktop usage
- Most popular job categories
- Search effectiveness

---

## Next Steps

1. Review and approve this specification
2. Set up development environment
3. Create Supabase project and configure database
4. Initialize frontend and backend projects
5. Begin Phase 1 development

---

**Document Version:** 1.0  
**Last Updated:** August 19, 2026  
**Author:** StudentHub Development Team
