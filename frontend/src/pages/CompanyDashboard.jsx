import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { apiFetch } from '../lib/api'
import { 
  Briefcase, PlusCircle, Edit, Trash2, Eye, Users, 
  CheckCircle, XCircle, Clock, MapPin, DollarSign 
} from 'lucide-react'

const CompanyDashboard = () => {
  const { profile, user } = useAuth()
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalJobs: 0,
    activeJobs: 0,
    pendingJobs: 0,
    totalApplications: 0
  })

  useEffect(() => {
    fetchCompanyJobs()
  }, [user])

  const fetchCompanyJobs = async () => {
    try {
      const [jobsResponse, applicationsResponse] = await Promise.all([
        apiFetch(`/jobs?company_id=${encodeURIComponent(user?.id || '')}`),
        apiFetch('/applications/company')
      ])
      const data = await jobsResponse.json().catch(() => ({}))
      const applicationsData = await applicationsResponse.json().catch(() => ({}))
      if (!jobsResponse.ok) throw new Error(data.error || 'Unable to load company jobs')
      if (!applicationsResponse.ok) throw new Error(applicationsData.error || 'Unable to load company applications')
      
      if (data.jobs) {
        setJobs(data.jobs)
        
        // Calculate stats
        const active = data.jobs.filter(j => j.status === 'active').length
        const pending = data.jobs.filter(j => j.status === 'pending').length
        const totalApps = (applicationsData.applications || []).length
        
        setStats({
          totalJobs: data.jobs.length,
          activeJobs: active,
          pendingJobs: pending,
          totalApplications: totalApps
        })
      }
    } catch (error) {
      console.error('Error fetching jobs:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteJob = async (jobId) => {
    if (!confirm('Are you sure you want to delete this job?')) return

    try {
      const response = await apiFetch(`/jobs/${jobId}`, {
        method: 'DELETE',
        headers: {
                  }
      })

      if (response.ok) {
        fetchCompanyJobs()
      }
    } catch (error) {
      console.error('Error deleting job:', error)
    }
  }

  const handleToggleStatus = async (jobId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'paused' : 'active'
    
    try {
      const response = await apiFetch(`/jobs/${jobId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
                  },
        body: JSON.stringify({ status: newStatus })
      })

      if (response.ok) {
        fetchCompanyJobs()
      }
    } catch (error) {
      console.error('Error updating job:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="app-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Company Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Welcome back, {profile?.company_name || profile?.full_name}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Jobs</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalJobs}</p>
              </div>
              <Briefcase className="text-primary" size={32} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Jobs</p>
                <p className="text-2xl font-bold text-green-600">{stats.activeJobs}</p>
              </div>
              <CheckCircle className="text-green-600" size={32} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Approval</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pendingJobs}</p>
              </div>
              <Clock className="text-yellow-600" size={32} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Applications</p>
                <p className="text-2xl font-bold text-blue-600">{stats.totalApplications}</p>
              </div>
              <Users className="text-blue-600" size={32} />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mb-6 flex flex-wrap gap-4">
          <Link
            to="/company/jobs/new"
            className="bg-primary text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-blue-600 transition flex items-center gap-3 shadow-lg"
          >
            <PlusCircle size={24} />
            Publish Your Jobs
          </Link>
          <Link
            to="/company/applications"
            className="bg-white text-gray-700 px-6 py-4 rounded-lg font-semibold hover:bg-gray-50 transition border-2 border-gray-300 flex items-center gap-2"
          >
            <Users size={20} />
            View Applications
          </Link>
        </div>

        {/* Jobs Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Your Posted Jobs</h2>
          </div>

          {jobs.length === 0 ? (
            <div className="p-12 text-center">
              <Briefcase className="mx-auto text-gray-400 mb-4" size={48} />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs posted yet</h3>
              <p className="text-gray-600 mb-6">Start by posting your first job opportunity</p>
              <Link
                to="/company/jobs/new"
                className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition"
              >
                <PlusCircle size={20} />
                Post Your First Job
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Job Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Applications
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {jobs.map((job) => (
                    <tr key={job.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{job.title}</div>
                            <div className="text-sm text-gray-500">{job.category}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-500">
                          <MapPin size={14} className="mr-1" />
                          {job.city || job.location}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">{job.job_type}</span>
                        <br />
                        <span className="text-xs text-gray-500">{job.work_mode}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${job.status === 'active' ? 'bg-green-100 text-green-800' : 
                            job.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            job.status === 'paused' ? 'bg-gray-100 text-gray-800' :
                            'bg-red-100 text-red-800'}`}>
                          {job.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {job.application_count || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <Link
                            to={`/jobs/${job.id}`}
                            className="text-primary hover:text-blue-600"
                            title="View"
                          >
                            <Eye size={18} />
                          </Link>
                          <Link
                            to={`/company/jobs/new?edit=${encodeURIComponent(job.id)}`}
                            className="text-gray-600 hover:text-gray-900"
                            title="Edit"
                          >
                            <Edit size={18} />
                          </Link>
                          {job.status === 'active' && (
                            <button
                              onClick={() => handleToggleStatus(job.id, job.status)}
                              className="text-yellow-600 hover:text-yellow-700"
                              title="Pause"
                            >
                              <Clock size={18} />
                            </button>
                          )}
                          {job.status === 'paused' && (
                            <button
                              onClick={() => handleToggleStatus(job.id, job.status)}
                              className="text-green-600 hover:text-green-700"
                              title="Activate"
                            >
                              <CheckCircle size={18} />
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteJob(job.id)}
                            className="text-red-600 hover:text-red-700"
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CompanyDashboard
