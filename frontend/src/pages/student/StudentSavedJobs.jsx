import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Bookmark, MapPin, Briefcase, DollarSign, Clock, Trash2, Eye } from 'lucide-react'
import { supabase } from '../../config/supabase'
import { useAuth } from '../../context/AuthContext'

const StudentSavedJobs = () => {
  const { user } = useAuth()
  const [savedJobs, setSavedJobs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSavedJobs()
  }, [user])

  const fetchSavedJobs = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('saved_jobs')
        .select(`
          *,
          jobs (*)
        `)
        .eq('user_id', user.id)
        .order('saved_at', { ascending: false })

      if (error) throw error
      setSavedJobs(data || [])
    } catch (error) {
      console.error('Error fetching saved jobs:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUnsaveJob = async (savedJobId, jobId) => {
    try {
      const { error } = await supabase
        .from('saved_jobs')
        .delete()
        .eq('id', savedJobId)

      if (error) throw error

      setSavedJobs(savedJobs.filter(item => item.id !== savedJobId))
    } catch (error) {
      console.error('Error removing saved job:', error)
      alert('Failed to remove job. Please try again.')
    }
  }

  const formatSalary = (min, max) => {
    if (!min && !max) return null
    if (min && max) return `$${min.toLocaleString()} - $${max.toLocaleString()}`
    if (min) return `From $${min.toLocaleString()}`
    return `Up to $${max.toLocaleString()}`
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const seconds = Math.floor((now - date) / 1000)
    
    if (seconds < 60) return 'Just now'
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`
    return `${Math.floor(seconds / 604800)}w ago`
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
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Saved Jobs</h1>
            <p className="text-gray-600">Jobs you've bookmarked for later</p>
          </div>
          <div className="bg-primary bg-opacity-10 p-4 rounded-full">
            <Bookmark className="text-primary" size={32} />
          </div>
        </div>
      </div>

      {/* Saved Jobs Count */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between">
          <p className="text-lg text-gray-700">
            You have <span className="font-bold text-gray-900">{savedJobs.length}</span> saved jobs
          </p>
          {savedJobs.length > 0 && (
            <Link
              to="/jobs"
              className="text-primary hover:text-blue-600 font-medium"
            >
              Browse more jobs →
            </Link>
          )}
        </div>
      </div>

      {/* Saved Jobs Grid */}
      {savedJobs.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <Bookmark className="mx-auto text-gray-400 mb-4" size={64} />
          <h3 className="text-2xl font-semibold text-gray-900 mb-2">No saved jobs yet</h3>
          <p className="text-gray-600 mb-6">
            Start saving jobs you're interested in to view them here
          </p>
          <Link
            to="/jobs"
            className="inline-block bg-primary text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition"
          >
            Browse Jobs
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedJobs.map((savedJob) => (
            <div
              key={savedJob.id}
              className="bg-white rounded-lg shadow-md hover:shadow-xl transition p-6 relative"
            >
              {/* Remove Button */}
              <button
                onClick={() => handleUnsaveJob(savedJob.id, savedJob.job_id)}
                className="absolute top-4 right-4 p-2 hover:bg-red-50 rounded-full transition group"
                title="Remove from saved"
              >
                <Trash2 className="text-gray-400 group-hover:text-red-600" size={18} />
              </button>

              {/* Job Type Badge */}
              <div className="mb-4">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                  savedJob.jobs?.job_type === 'internship' ? 'bg-green-100 text-green-800' :
                  savedJob.jobs?.job_type === 'full-time' ? 'bg-blue-100 text-blue-800' :
                  'bg-purple-100 text-purple-800'
                }`}>
                  {savedJob.jobs?.job_type?.replace('-', ' ').toUpperCase()}
                </span>
              </div>

              {/* Company and Title */}
              <h3 className="text-xl font-semibold text-gray-900 mb-2 pr-8">
                {savedJob.jobs?.title}
              </h3>
              <p className="text-gray-600 font-medium mb-4">{savedJob.jobs?.company_name}</p>

              {/* Details */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin size={16} className="mr-2 flex-shrink-0" />
                  <span className="truncate">{savedJob.jobs?.location}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Briefcase size={16} className="mr-2 flex-shrink-0" />
                  <span className="capitalize">{savedJob.jobs?.work_mode}</span>
                </div>
                {(savedJob.jobs?.salary_min || savedJob.jobs?.salary_max) && (
                  <div className="flex items-center text-sm text-gray-600">
                    <DollarSign size={16} className="mr-2 flex-shrink-0" />
                    <span>{formatSalary(savedJob.jobs?.salary_min, savedJob.jobs?.salary_max)}</span>
                  </div>
                )}
                <div className="flex items-center text-sm text-gray-500">
                  <Clock size={16} className="mr-2 flex-shrink-0" />
                  <span>Saved {formatDate(savedJob.saved_at)}</span>
                </div>
              </div>

              {/* Category */}
              {savedJob.jobs?.category && (
                <div className="mb-4 pt-4 border-t border-gray-100">
                  <span className="text-xs text-gray-500">{savedJob.jobs.category}</span>
                </div>
              )}

              {/* Action Button */}
              <Link
                to={`/jobs/${savedJob.job_id}`}
                className="w-full flex items-center justify-center gap-2 bg-primary text-white py-2 rounded-lg hover:bg-blue-600 transition"
              >
                <Eye size={18} />
                View Details
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default StudentSavedJobs
