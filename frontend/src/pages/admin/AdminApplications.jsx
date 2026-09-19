import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FileText, Eye, Mail, Phone, Calendar, MapPin, User, ExternalLink } from 'lucide-react'
import { supabase } from '../../config/supabase'

const AdminApplications = () => {
  const [applications, setApplications] = useState([])
  const [filteredApplications, setFilteredApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedApplication, setSelectedApplication] = useState(null)

  useEffect(() => {
    fetchApplications()
  }, [])

  useEffect(() => {
    filterApplications()
  }, [applications, statusFilter])

  const fetchApplications = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('applications')
        .select(`
          *,
          jobs (*),
          profiles (*)
        `)
        .order('applied_at', { ascending: false })

      if (error) throw error
      setApplications(data || [])
    } catch (error) {
      console.error('Error fetching applications:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterApplications = () => {
    if (statusFilter === 'all') {
      setFilteredApplications(applications)
    } else {
      setFilteredApplications(applications.filter(app => app.status === statusFilter))
    }
  }

  const updateApplicationStatus = async (applicationId, newStatus) => {
    try {
      const { error } = await supabase
        .from('applications')
        .update({ status: newStatus })
        .eq('id', applicationId)

      if (error) throw error

      setApplications(applications.map(app => 
        app.id === applicationId ? { ...app, status: newStatus } : app
      ))

      if (selectedApplication?.id === applicationId) {
        setSelectedApplication({ ...selectedApplication, status: newStatus })
      }
    } catch (error) {
      console.error('Error updating application status:', error)
      alert('Failed to update status. Please try again.')
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'reviewed':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'shortlisted':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const statusCounts = {
    all: applications.length,
    pending: applications.filter(app => app.status === 'pending').length,
    reviewed: applications.filter(app => app.status === 'reviewed').length,
    shortlisted: applications.filter(app => app.status === 'shortlisted').length,
    rejected: applications.filter(app => app.status === 'rejected').length
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Applications</h1>
        <p className="text-gray-600">Review and manage student applications</p>
      </div>

      {/* Status Filters */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <button
          onClick={() => setStatusFilter('all')}
          className={`p-4 rounded-lg border-2 transition ${
            statusFilter === 'all'
              ? 'border-primary bg-blue-50'
              : 'border-gray-200 bg-white hover:border-gray-300'
          }`}
        >
          <p className="text-2xl font-bold text-gray-900">{statusCounts.all}</p>
          <p className="text-sm text-gray-600">All</p>
        </button>

        <button
          onClick={() => setStatusFilter('pending')}
          className={`p-4 rounded-lg border-2 transition ${
            statusFilter === 'pending'
              ? 'border-yellow-500 bg-yellow-50'
              : 'border-gray-200 bg-white hover:border-gray-300'
          }`}
        >
          <p className="text-2xl font-bold text-yellow-700">{statusCounts.pending}</p>
          <p className="text-sm text-gray-600">Pending</p>
        </button>

        <button
          onClick={() => setStatusFilter('reviewed')}
          className={`p-4 rounded-lg border-2 transition ${
            statusFilter === 'reviewed'
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-200 bg-white hover:border-gray-300'
          }`}
        >
          <p className="text-2xl font-bold text-blue-700">{statusCounts.reviewed}</p>
          <p className="text-sm text-gray-600">Reviewed</p>
        </button>

        <button
          onClick={() => setStatusFilter('shortlisted')}
          className={`p-4 rounded-lg border-2 transition ${
            statusFilter === 'shortlisted'
              ? 'border-green-500 bg-green-50'
              : 'border-gray-200 bg-white hover:border-gray-300'
          }`}
        >
          <p className="text-2xl font-bold text-green-700">{statusCounts.shortlisted}</p>
          <p className="text-sm text-gray-600">Shortlisted</p>
        </button>

        <button
          onClick={() => setStatusFilter('rejected')}
          className={`p-4 rounded-lg border-2 transition ${
            statusFilter === 'rejected'
              ? 'border-red-500 bg-red-50'
              : 'border-gray-200 bg-white hover:border-gray-300'
          }`}
        >
          <p className="text-2xl font-bold text-red-700">{statusCounts.rejected}</p>
          <p className="text-sm text-gray-600">Rejected</p>
        </button>
      </div>

      {/* Applications List */}
      <div className="bg-white rounded-lg shadow-md p-6">
        {filteredApplications.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="mx-auto text-gray-400 mb-4" size={64} />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {applications.length === 0 ? 'No applications yet' : 'No applications found'}
            </h3>
            <p className="text-gray-600">
              {applications.length === 0 
                ? 'Applications will appear here once students start applying'
                : 'Try adjusting your filter'
              }
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredApplications.map((application) => (
              <div
                key={application.id}
                className="border border-gray-200 rounded-lg p-6 hover:border-primary transition"
              >
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {application.profiles?.full_name}
                        </h3>
                        <p className="text-gray-600">
                          Applied for: <Link to={`/jobs/${application.job_id}`} className="text-primary hover:underline">
                            {application.jobs?.title}
                          </Link>
                        </p>
                        <p className="text-sm text-gray-500">
                          {application.jobs?.company_name}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600 mb-4">
                      {application.profiles?.university && (
                        <div className="flex items-center gap-2">
                          <MapPin size={16} />
                          <span>{application.profiles.university}</span>
                        </div>
                      )}
                      {application.profiles?.major && (
                        <div className="flex items-center gap-2">
                          <User size={16} />
                          <span>{application.profiles.major}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Calendar size={16} />
                        <span>Applied on {formatDate(application.applied_at)}</span>
                      </div>
                      {application.profiles?.graduation_year && (
                        <div className="flex items-center gap-2">
                          <Calendar size={16} />
                          <span>Graduates {application.profiles.graduation_year}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(application.status)}`}>
                        <span className="capitalize">{application.status}</span>
                      </span>
                      
                      {application.resume_url && (
                        <a
                          href={application.resume_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-3 py-1 border border-gray-300 rounded-full text-sm hover:bg-gray-50 transition"
                        >
                          <FileText size={14} />
                          View Resume
                          <ExternalLink size={12} />
                        </a>
                      )}
                    </div>

                    {application.cover_letter && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <p className="text-sm font-medium text-gray-700 mb-2">Cover Letter:</p>
                        <p className="text-sm text-gray-600 whitespace-pre-line">
                          {application.cover_letter}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex lg:flex-col gap-2">
                    <select
                      value={application.status}
                      onChange={(e) => updateApplicationStatus(application.id, e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="pending">Pending</option>
                      <option value="reviewed">Reviewed</option>
                      <option value="shortlisted">Shortlisted</option>
                      <option value="rejected">Rejected</option>
                    </select>

                    <button
                      onClick={() => setSelectedApplication(application)}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition flex items-center gap-2 justify-center"
                    >
                      <Eye size={16} />
                      Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Application Detail Modal */}
      {selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Application Details</h2>
                <button
                  onClick={() => setSelectedApplication(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Applicant Info */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Applicant Information</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-700">
                    <User size={18} />
                    <strong>Name:</strong> {selectedApplication.profiles?.full_name}
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Mail size={18} />
                    <strong>Email:</strong> {selectedApplication.profiles?.user_id}
                  </div>
                  {selectedApplication.profiles?.phone && (
                    <div className="flex items-center gap-2 text-gray-700">
                      <Phone size={18} />
                      <strong>Phone:</strong> {selectedApplication.profiles.phone}
                    </div>
                  )}
                  {selectedApplication.profiles?.university && (
                    <div className="flex items-center gap-2 text-gray-700">
                      <MapPin size={18} />
                      <strong>University:</strong> {selectedApplication.profiles.university}
                    </div>
                  )}
                  {selectedApplication.profiles?.major && (
                    <div className="text-gray-700">
                      <strong>Major:</strong> {selectedApplication.profiles.major}
                    </div>
                  )}
                  {selectedApplication.profiles?.graduation_year && (
                    <div className="text-gray-700">
                      <strong>Graduation Year:</strong> {selectedApplication.profiles.graduation_year}
                    </div>
                  )}
                </div>
              </div>

              {/* Job Info */}
              <div className="pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Job Details</h3>
                <div className="space-y-2 text-gray-700">
                  <div><strong>Position:</strong> {selectedApplication.jobs?.title}</div>
                  <div><strong>Company:</strong> {selectedApplication.jobs?.company_name}</div>
                  <div><strong>Location:</strong> {selectedApplication.jobs?.location}</div>
                  <div><strong>Type:</strong> <span className="capitalize">{selectedApplication.jobs?.job_type?.replace('-', ' ')}</span></div>
                  <Link
                    to={`/jobs/${selectedApplication.job_id}`}
                    className="inline-flex items-center gap-2 text-primary hover:text-blue-600 mt-2"
                  >
                    View Job Posting
                    <ExternalLink size={16} />
                  </Link>
                </div>
              </div>

              {/* Resume */}
              {selectedApplication.resume_url && (
                <div className="pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Resume</h3>
                  <a
                    href={selectedApplication.resume_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition"
                  >
                    <FileText size={18} />
                    View Resume
                    <ExternalLink size={16} />
                  </a>
                </div>
              )}

              {/* Cover Letter */}
              {selectedApplication.cover_letter && (
                <div className="pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Cover Letter</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-700 whitespace-pre-line">
                      {selectedApplication.cover_letter}
                    </p>
                  </div>
                </div>
              )}

              {/* Status Update */}
              <div className="pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Update Status</h3>
                <div className="flex gap-2">
                  <select
                    value={selectedApplication.status}
                    onChange={(e) => updateApplicationStatus(selectedApplication.id, e.target.value)}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="pending">Pending</option>
                    <option value="reviewed">Reviewed</option>
                    <option value="shortlisted">Shortlisted</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Applied on {formatDate(selectedApplication.applied_at)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminApplications
