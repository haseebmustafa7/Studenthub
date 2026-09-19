import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Briefcase, Users, FileText, TrendingUp, Plus, Eye } from 'lucide-react'
import { supabase } from '../../config/supabase'

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalJobs: 0,
    activeJobs: 0,
    totalApplications: 0,
    totalStudents: 0
  })
  const [recentJobs, setRecentJobs] = useState([])
  const [recentApplications, setRecentApplications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)

      // Fetch jobs stats
      const { count: totalJobs } = await supabase
        .from('jobs')
        .select('*', { count: 'exact', head: true })

      const { count: activeJobs } = await supabase
        .from('jobs')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true)

      // Fetch applications stats
      const { count: totalApplications } = await supabase
        .from('applications')
        .select('*', { count: 'exact', head: true })

      // Fetch students stats
      const { count: totalStudents } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'student')

      setStats({
        totalJobs: totalJobs || 0,
        activeJobs: activeJobs || 0,
        totalApplications: totalApplications || 0,
        totalStudents: totalStudents || 0
      })

      // Fetch recent jobs
      const { data: jobs } = await supabase
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5)

      setRecentJobs(jobs || [])

      // Fetch recent applications
      const { data: applications } = await supabase
        .from('applications')
        .select(`
          *,
          jobs (*),
          profiles (*)
        `)
        .order('applied_at', { ascending: false })
        .limit(5)

      setRecentApplications(applications || [])
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'reviewed':
        return 'bg-blue-100 text-blue-800'
      case 'shortlisted':
        return 'bg-green-100 text-green-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary to-blue-700 rounded-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-blue-100">Manage jobs, applications, and monitor platform activity</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <Briefcase className="text-primary" size={24} />
            </div>
            <TrendingUp className="text-green-500" size={20} />
          </div>
          <p className="text-gray-600 text-sm mb-1">Total Jobs</p>
          <p className="text-3xl font-bold text-gray-900">{stats.totalJobs}</p>
          <p className="text-sm text-gray-500 mt-2">{stats.activeJobs} active</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-green-100 p-3 rounded-full">
              <FileText className="text-green-600" size={24} />
            </div>
            <TrendingUp className="text-green-500" size={20} />
          </div>
          <p className="text-gray-600 text-sm mb-1">Applications</p>
          <p className="text-3xl font-bold text-gray-900">{stats.totalApplications}</p>
          <Link to="/admin/applications" className="text-sm text-primary hover:text-blue-600 mt-2 inline-block">
            View all →
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-purple-100 p-3 rounded-full">
              <Users className="text-purple-600" size={24} />
            </div>
            <TrendingUp className="text-green-500" size={20} />
          </div>
          <p className="text-gray-600 text-sm mb-1">Students</p>
          <p className="text-3xl font-bold text-gray-900">{stats.totalStudents}</p>
          <p className="text-sm text-gray-500 mt-2">Registered users</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-yellow-100 p-3 rounded-full">
              <TrendingUp className="text-yellow-600" size={24} />
            </div>
            <TrendingUp className="text-green-500" size={20} />
          </div>
          <p className="text-gray-600 text-sm mb-1">Success Rate</p>
          <p className="text-3xl font-bold text-gray-900">
            {stats.totalApplications > 0 
              ? Math.round((stats.totalApplications / stats.totalJobs) * 10) 
              : 0}%
          </p>
          <p className="text-sm text-gray-500 mt-2">Application rate</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/admin/jobs?action=create"
            className="flex items-center gap-3 p-4 border-2 border-dashed border-primary rounded-lg hover:bg-blue-50 transition group"
          >
            <div className="bg-primary p-2 rounded-full">
              <Plus className="text-white" size={20} />
            </div>
            <div>
              <p className="font-semibold text-gray-900 group-hover:text-primary">Post New Job</p>
              <p className="text-sm text-gray-600">Add a new opportunity</p>
            </div>
          </Link>

          <Link
            to="/admin/jobs"
            className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-primary hover:bg-blue-50 transition"
          >
            <Briefcase className="text-primary" size={24} />
            <div>
              <p className="font-semibold text-gray-900">Manage Jobs</p>
              <p className="text-sm text-gray-600">Edit or delete jobs</p>
            </div>
          </Link>

          <Link
            to="/admin/applications"
            className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-primary hover:bg-blue-50 transition"
          >
            <FileText className="text-primary" size={24} />
            <div>
              <p className="font-semibold text-gray-900">Review Applications</p>
              <p className="text-sm text-gray-600">Manage submissions</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Jobs */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">Recent Jobs</h2>
            <Link to="/admin/jobs" className="text-primary hover:text-blue-600 text-sm font-medium">
              View all →
            </Link>
          </div>
          
          {recentJobs.length === 0 ? (
            <div className="text-center py-8">
              <Briefcase className="mx-auto text-gray-400 mb-3" size={48} />
              <p className="text-gray-600">No jobs posted yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentJobs.map((job) => (
                <div
                  key={job.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-primary transition"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{job.title}</h3>
                    <p className="text-sm text-gray-600">{job.company_name}</p>
                    <p className="text-xs text-gray-500 mt-1">{formatDate(job.created_at)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      job.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {job.is_active ? 'Active' : 'Inactive'}
                    </span>
                    <Link to={`/jobs/${job.id}`} className="text-primary hover:text-blue-600">
                      <Eye size={18} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Applications */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">Recent Applications</h2>
            <Link to="/admin/applications" className="text-primary hover:text-blue-600 text-sm font-medium">
              View all →
            </Link>
          </div>
          
          {recentApplications.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="mx-auto text-gray-400 mb-3" size={48} />
              <p className="text-gray-600">No applications yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentApplications.map((app) => (
                <div
                  key={app.id}
                  className="p-4 border border-gray-200 rounded-lg hover:border-primary transition"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-sm">{app.profiles?.full_name}</h3>
                      <p className="text-xs text-gray-600">{app.jobs?.title}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-semibold capitalize ${getStatusColor(app.status)}`}>
                      {app.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">{formatDate(app.applied_at)}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
