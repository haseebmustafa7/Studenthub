import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// Layouts
import MainLayout from '../components/layouts/MainLayout'
import DashboardLayout from '../components/layouts/DashboardLayout'

// Pages
import Home from '../pages/Home'
import About from '../pages/About'
import Contact from '../pages/Contact'
import Career from '../pages/Career'
import Discounts from '../pages/Discounts'
import Jobs from '../pages/Jobs'
import JobDetail from '../pages/JobDetail'
import JobsNearMe from '../pages/JobsNearMe'
import Login from '../pages/Login'
import Register from '../pages/Register'
import CompanyLogin from '../pages/CompanyLogin'
import CompanyRegister from '../pages/CompanyRegister'
import CompanyDashboard from '../pages/CompanyDashboard'
import CompanyPublishJob from '../pages/CompanyPublishJob'
import CompanyApplications from '../pages/CompanyApplications'
import StudentDashboard from '../pages/student/StudentDashboard'
import StudentProfile from '../pages/student/StudentProfile'
import StudentApplications from '../pages/student/StudentApplications'
import StudentSavedJobs from '../pages/student/StudentSavedJobs'
import AdminDashboard from '../pages/admin/AdminDashboard'
import AdminJobs from '../pages/admin/AdminJobs'
import AdminApplications from '../pages/admin/AdminApplications'
import NotFound from '../pages/NotFound'

// Career Counselling Pages
import CareerAssessment from '../pages/career/CareerAssessment'
import CareerResults from '../pages/career/CareerResults'
import SkillAnalysis from '../pages/career/SkillAnalysis'
import LearningRoadmap from '../pages/career/LearningRoadmap'
import Counselors from '../pages/career/Counselors'
import BookCounselor from '../pages/career/BookCounselor'
import MySessions from '../pages/career/MySessions'
import CareerDetail from '../pages/career/CareerDetail'
import CareerJourney from '../pages/career/CareerJourney'
import ApplicationCopilot from '../pages/career/ApplicationCopilot'
import InterviewSimulator from '../pages/career/InterviewSimulator'

// Protected Route Components
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  }

  return user ? children : <Navigate to="/login" />
}

const AdminRoute = ({ children }) => {
  const { user, profile, loading } = useAuth()

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  }

  return user && profile?.role === 'admin' ? children : <Navigate to="/" />
}

const CompanyRoute = ({ children }) => {
  const { user, profile, loading } = useAuth()

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  }

  return user && profile?.role === 'company' ? children : <Navigate to="/company/login" />
}

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/career" element={<Career />} />
        <Route path="/discounts" element={<Discounts />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/jobs/:id" element={<JobDetail />} />
        <Route path="/jobs-near-me" element={<JobsNearMe />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/company/login" element={<CompanyLogin />} />
        <Route path="/company/register" element={<CompanyRegister />} />
      </Route>

      {/* Student Routes */}
      <Route element={
        <ProtectedRoute>
          <DashboardLayout />
        </ProtectedRoute>
      }>
        <Route path="/dashboard" element={<StudentDashboard />} />
        <Route path="/dashboard/profile" element={<StudentProfile />} />
        <Route path="/dashboard/applications" element={<StudentApplications />} />
        <Route path="/dashboard/saved" element={<StudentSavedJobs />} />
      </Route>

      {/* Career Counselling Routes - Protected */}
      <Route element={<MainLayout />}>
        <Route path="/career/journey" element={<ProtectedRoute><CareerJourney /></ProtectedRoute>} />
        <Route path="/career/application-copilot/:jobId" element={<ProtectedRoute><ApplicationCopilot /></ProtectedRoute>} />
        <Route path="/career/interview" element={<ProtectedRoute><InterviewSimulator /></ProtectedRoute>} />
        <Route path="/career/assessment" element={
          <ProtectedRoute>
            <CareerAssessment />
          </ProtectedRoute>
        } />
        <Route path="/career/results" element={
          <ProtectedRoute>
            <CareerResults />
          </ProtectedRoute>
        } />
        <Route path="/career/skills/:careerId?" element={
          <ProtectedRoute>
            <SkillAnalysis />
          </ProtectedRoute>
        } />
        <Route path="/career/roadmap/:careerId?" element={
          <ProtectedRoute>
            <LearningRoadmap />
          </ProtectedRoute>
        } />
        <Route path="/career/detail/:careerId" element={
          <ProtectedRoute>
            <CareerDetail />
          </ProtectedRoute>
        } />
        <Route path="/career/counselors" element={<Counselors />} />
        <Route path="/career/book/:counselorId" element={
          <ProtectedRoute>
            <BookCounselor />
          </ProtectedRoute>
        } />
        <Route path="/career/sessions" element={
          <ProtectedRoute>
            <MySessions />
          </ProtectedRoute>
        } />
        <Route path="/career/counselor/:counselorId" element={
          <ProtectedRoute>
            <Counselors />
          </ProtectedRoute>
        } />
      </Route>

      {/* Company Routes */}
      <Route path="/company/dashboard" element={
        <CompanyRoute>
          <CompanyDashboard />
        </CompanyRoute>
      } />
      <Route path="/company/jobs/new" element={
        <CompanyRoute>
          <CompanyPublishJob />
        </CompanyRoute>
      } />
      <Route path="/company/applications" element={
        <CompanyRoute>
          <CompanyApplications />
        </CompanyRoute>
      } />

      {/* Admin Routes */}
      <Route path="/admin" element={
        <AdminRoute>
          <DashboardLayout />
        </AdminRoute>
      }>
        <Route index element={<AdminDashboard />} />
        <Route path="jobs" element={<AdminJobs />} />
        <Route path="applications" element={<AdminApplications />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default AppRoutes
