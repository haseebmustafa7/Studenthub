# StudentHub - Student Internship & Job Platform

[![React](https://img.shields.io/badge/React-18.2-blue)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-24.19-green)](https://nodejs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-purple)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-cyan)](https://tailwindcss.com/)

A modern, full-stack web platform connecting university students with internship and job opportunities. Built with React, Node.js, Express, and Supabase.

## 🌟 Features

### For Students
- **Browse Jobs**: Search and filter through internships and job postings
- **Smart Filters**: Filter by job type, work mode, location, and category
- **Job Applications**: Apply directly with resume and cover letter
- **Save Jobs**: Bookmark interesting opportunities for later
- **Track Applications**: Monitor application status in real-time
- **Profile Management**: Maintain professional profile with resume

### For Admins
- **Job Management**: Create, edit, and delete job postings
- **Application Review**: View and manage all student applications
- **Status Updates**: Update application status (pending, reviewed, shortlisted, rejected)
- **Dashboard Analytics**: View platform statistics and metrics
- **User Management**: Monitor registered students and activity

### Technical Features
- **Secure Authentication**: Email/password authentication via Supabase Auth
- **Role-Based Access**: Separate dashboards for students and admins
- **Real-time Updates**: Live data synchronization with Supabase
- **Responsive Design**: Mobile-first, fully responsive UI
- **RESTful API**: Clean, organized backend architecture
- **Row Level Security**: Database-level security policies

## 🚀 Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **React Router v6** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Icon library
- **Axios** - HTTP client
- **Supabase JS** - Database and auth client

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Supabase** - PostgreSQL database and authentication
- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing
- **Express Rate Limit** - API rate limiting

### Database
- **PostgreSQL** (via Supabase) - Relational database
- **Row Level Security** - Database-level access control

## 📋 Prerequisites

- Node.js v18+ and npm
- Supabase account (free tier)
- Git (recommended)

## 🛠️ Installation & Setup

### 1. Clone the Repository

```bash
cd c:\Users\HP\OneDrive\Desktop\student-job-website
```

### 2. Install Dependencies

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

### 3. Set Up Supabase

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project (wait 2-3 minutes for initialization)
3. Go to **Settings** → **API** and copy:
   - Project URL
   - `anon` public key
   - `service_role` key (click "Reveal")
   - JWT Secret (in JWT Settings)

### 4. Create Database Tables

1. In Supabase dashboard, go to **SQL Editor**
2. Open `SETUP_INSTRUCTIONS.md` and copy the complete SQL script
3. Run the SQL script to create all tables and policies

### 5. Create Admin User

1. In Supabase dashboard, go to **Authentication** → **Users**
2. Click "Add user" → "Create new user"
3. Email: `admin@studenthub.com` (or your preferred email)
4. Create a strong password
5. Check "Auto Confirm User"
6. Run this SQL to make them admin:

```sql
INSERT INTO profiles (user_id, full_name, role)
SELECT id, 'Admin User', 'admin'
FROM auth.users
WHERE email = 'admin@studenthub.com';
```

### 6. Configure Environment Variables

**Backend** - Create `backend/.env`:
```env
PORT=5000
NODE_ENV=development
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_KEY=your_service_role_key
SUPABASE_JWT_SECRET=your_jwt_secret
CORS_ORIGIN=http://localhost:5173
```

**Frontend** - Create `frontend/.env`:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_anon_public_key
VITE_API_URL=http://localhost:5000/api
```

### 7. Run the Application

**Start Backend (Terminal 1):**
```bash
cd backend
npm run dev
```

**Start Frontend (Terminal 2):**
```bash
cd frontend
npm run dev
```

### 8. Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000

## 👥 Usage

### As a Student

1. **Sign Up**: Create an account at `/register`
2. **Complete Profile**: Add your university, major, and resume
3. **Browse Jobs**: Visit `/jobs` to see available opportunities
4. **Apply**: Click on jobs and submit applications
5. **Track Progress**: View your applications in the dashboard

### As an Admin

1. **Login**: Use admin credentials at `/login`
2. **Post Jobs**: Navigate to Admin → Manage Jobs
3. **Review Applications**: Check Admin → Applications
4. **Update Status**: Change application statuses as you review

## 📁 Project Structure

```
student-job-website/
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   │   ├── common/      # Navbar, Footer
│   │   │   └── layouts/     # MainLayout, DashboardLayout
│   │   ├── pages/           # Page components
│   │   │   ├── admin/       # Admin dashboard pages
│   │   │   └── student/     # Student dashboard pages
│   │   ├── context/         # React Context (Auth)
│   │   ├── config/          # Supabase config
│   │   ├── routes/          # Route definitions
│   │   └── App.jsx          # Main app component
│   ├── index.html
│   └── package.json
│
├── backend/                  # Express backend
│   ├── src/
│   │   ├── config/          # Supabase config
│   │   ├── middleware/      # Auth middleware
│   │   ├── routes/          # API routes
│   │   │   ├── auth.js      # Authentication
│   │   │   ├── jobs.js      # Job endpoints
│   │   │   ├── applications.js
│   │   │   ├── profile.js
│   │   │   └── admin.js     # Admin endpoints
│   │   └── server.js        # Express app
│   └── package.json
│
├── PROJECT_SPEC.md          # Detailed specifications
├── SETUP_INSTRUCTIONS.md    # Setup guide
└── README.md                # This file
```

## 🗄️ Database Schema

### Tables

- **profiles** - User profile information
- **jobs** - Job and internship postings
- **applications** - Student applications to jobs
- **saved_jobs** - Bookmarked jobs

See `SETUP_INSTRUCTIONS.md` for complete schema with relationships and policies.

## 🔒 Security

- Row Level Security (RLS) enabled on all tables
- JWT-based authentication via Supabase
- Password hashing handled by Supabase Auth
- Input validation on all forms
- Rate limiting on API endpoints
- CORS protection
- Secure HTTP headers via Helmet
- Environment variables for secrets

## 🎨 Features Breakdown

### Authentication System
- Email/password registration and login
- Protected routes for authenticated users
- Role-based access (student/admin)
- Session management with Supabase

### Job Browsing
- Real-time search functionality
- Multi-criteria filtering
- Category-based browsing
- Pagination support
- Save jobs for later

### Application System
- One-click applications
- Resume upload via URL
- Optional cover letters
- Application status tracking
- Admin review workflow

### Admin Dashboard
- Platform statistics
- Job CRUD operations
- Application management
- Status updates
- User analytics

### Student Dashboard
- Application tracking
- Profile management
- Saved jobs collection
- Profile completion meter

## 🌐 API Endpoints

### Public Routes
- `GET /api/jobs` - List all jobs
- `GET /api/jobs/:id` - Get job details
- `POST /api/auth/register` - Student registration
- `POST /api/auth/login` - User login

### Protected Routes (Student)
- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update profile
- `POST /api/applications` - Submit application
- `GET /api/applications` - Get user's applications
- `POST /api/jobs/:id/save` - Save job
- `DELETE /api/jobs/:id/unsave` - Unsave job

### Protected Routes (Admin)
- `GET /api/admin/stats` - Dashboard statistics
- `POST /api/admin/jobs` - Create job
- `PUT /api/admin/jobs/:id` - Update job
- `DELETE /api/admin/jobs/:id` - Delete job
- `GET /api/admin/applications` - Get all applications
- `PUT /api/admin/applications/:id/status` - Update status

## 🚢 Deployment

### Frontend Deployment (Vercel - Free)

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Set environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_API_URL` (your backend URL)
5. Deploy

### Backend Deployment (Render - Free)

1. Go to [render.com](https://render.com)
2. Create new Web Service
3. Connect GitHub repository
4. Settings:
   - Build Command: `cd backend && npm install`
   - Start Command: `cd backend && npm start`
5. Set environment variables
6. Deploy

### Database (Supabase - Free)

Already hosted! No additional deployment needed.

## 🐛 Troubleshooting

### Port Already in Use
Change ports in `.env` files or kill existing processes.

### Supabase Connection Failed
- Verify `.env` files have correct credentials
- Check project is active in Supabase dashboard
- Ensure no extra spaces in environment variables

### Build Errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Database Errors
- Verify all SQL scripts ran successfully
- Check RLS policies are enabled
- Review Supabase logs in dashboard

## 📝 Development Notes

### Available Scripts

**Backend:**
- `npm start` - Start production server
- `npm run dev` - Start with hot reload

**Frontend:**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Code Quality
- Follow React best practices
- Use functional components and hooks
- Implement proper error handling
- Add loading states for async operations
- Keep components modular and reusable

## 🤝 Contributing

This is a complete, production-ready application. To extend it:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the MIT License.

## 👨‍💻 Author

Built as a complete full-stack demonstration project.

## 🙏 Acknowledgments

- React Team for the amazing framework
- Supabase for backend infrastructure
- Tailwind CSS for styling utilities
- Lucide for beautiful icons

## 📧 Support

For issues or questions:
1. Check `SETUP_INSTRUCTIONS.md` for detailed setup help
2. Review `PROJECT_SPEC.md` for technical specifications
3. Inspect browser console and backend logs for errors

---

**Made with ❤️ for students seeking their dream opportunities**
