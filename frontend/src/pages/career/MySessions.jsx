import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { apiRequest } from '../../lib/api'
import { 
  Calendar,
  Clock,
  User,
  Star,
  Video,
  Phone,
  MapPin,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  MessageSquare,
  Plus
} from 'lucide-react'


const MySessions = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [sessions, setSessions] = useState([])
  const [filter, setFilter] = useState('all') // all, upcoming, completed, cancelled
  const [showFeedbackModal, setShowFeedbackModal] = useState(false)
  const [selectedSession, setSelectedSession] = useState(null)
  const [feedback, setFeedback] = useState({ rating: 5, comments: '' })
  const [submittingFeedback, setSubmittingFeedback] = useState(false)

  useEffect(() => {
    fetchSessions()
  }, [])

  const fetchSessions = async () => {
    try {
      setLoading(true)
      setError('')
      
      const response = await apiRequest({ method: 'GET', url: '/counseling/sessions' })
      setSessions(response.data.sessions || [])
    } catch (err) {
      console.error('Error fetching sessions:', err)
      setError(err.response?.data?.error || 'Failed to fetch sessions')
    } finally {
      setLoading(false)
    }
  }

  const handleCancelSession = async (sessionId) => {
    if (!confirm('Are you sure you want to cancel this session?')) {
      return
    }

    try {
      await apiRequest({ method: 'PATCH', url: `/counseling/sessions/${sessionId}`, data: { status: 'cancelled' } })
      
      // Update local state
      setSessions(prev => prev.map(session => 
        session.id === sessionId 
          ? { ...session, status: 'cancelled' }
          : session
      ))
    } catch (err) {
      console.error('Error cancelling session:', err)
      setError('Failed to cancel session')
    }
  }

  const openFeedbackModal = (session) => {
    setSelectedSession(session)
    setShowFeedbackModal(true)
    setFeedback({ rating: 5, comments: '' })
  }

  const closeFeedbackModal = () => {
    setShowFeedbackModal(false)
    setSelectedSession(null)
    setFeedback({ rating: 5, comments: '' })
  }

  const handleSubmitFeedback = async () => {
    try {
      setSubmittingFeedback(true)
      
      await apiRequest({ method: 'POST', url: `/counseling/sessions/${selectedSession.id}/feedback`, data: feedback })
      
      // Update local state
      setSessions(prev => prev.map(session => 
        session.id === selectedSession.id 
          ? { ...session, feedback_given: true }
          : session
      ))
      
      closeFeedbackModal()
    } catch (err) {
      console.error('Error submitting feedback:', err)
      setError('Failed to submit feedback')
    } finally {
      setSubmittingFeedback(false)
    }
  }

  const getStatusIcon = (status) => {
    switch(status) {
      case 'completed': return <CheckCircle className="w-5 h-5 text-green-600" />
      case 'cancelled': return <XCircle className="w-5 h-5 text-red-600" />
      case 'scheduled':
      case 'confirmed': return <Clock className="w-5 h-5 text-blue-600" />
      default: return <AlertCircle className="w-5 h-5 text-gray-600" />
    }
  }

  const getStatusColor = (status) => {
    switch(status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      case 'scheduled':
      case 'confirmed': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getSessionTypeIcon = (type) => {
    switch(type) {
      case 'video': return <Video className="w-4 h-4" />
      case 'phone': return <Phone className="w-4 h-4" />
      case 'in_person': return <MapPin className="w-4 h-4" />
      default: return <Video className="w-4 h-4" />
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const filterSessions = () => {
    const now = new Date()
    
    switch(filter) {
      case 'upcoming':
        return sessions.filter(s => 
          ['scheduled', 'confirmed'].includes(s.status) && new Date(s.scheduled_at) > now
        )
      case 'completed':
        return sessions.filter(s => s.status === 'completed')
      case 'cancelled':
        return sessions.filter(s => s.status === 'cancelled')
      default:
        return sessions
    }
  }

  const filteredSessions = filterSessions()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              My Counseling Sessions
            </h1>
            <p className="text-gray-600">
              Manage and track your career counseling sessions
            </p>
          </div>
          <button
            onClick={() => navigate('/career/counselors')}
            className="flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition"
          >
            <Plus className="w-5 h-5 mr-2" />
            Book New Session
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
            <AlertCircle className="w-5 h-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Filters */}
        <div className="mb-6 flex flex-wrap gap-2">
          {[
            { value: 'all', label: 'All Sessions' },
            { value: 'upcoming', label: 'Upcoming' },
            { value: 'completed', label: 'Completed' },
            { value: 'cancelled', label: 'Cancelled' }
          ].map(option => (
            <button
              key={option.value}
              onClick={() => setFilter(option.value)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === option.value
                  ? 'bg-primary text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        {/* Sessions List */}
        {filteredSessions.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No sessions found
            </h3>
            <p className="text-gray-600 mb-6">
              {filter === 'all' 
                ? "You haven't booked any counseling sessions yet."
                : `You have no ${filter} sessions.`
              }
            </p>
            <button
              onClick={() => navigate('/career/counselors')}
              className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition"
            >
              <Plus className="w-5 h-5 mr-2" />
              Book Your First Session
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredSessions.map((session) => (
              <div 
                key={session.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start flex-1">
                      <div className="w-12 h-12 bg-gradient-to-r from-primary to-primary-dark rounded-full flex items-center justify-center text-white font-bold mr-4 flex-shrink-0">
                        {session.counselor?.full_name?.split(' ').map(n => n[0]).join('') || 'C'}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-1">
                          {session.counselor?.full_name || 'Counselor'}
                        </h3>
                        {session.counselor?.title && (
                          <p className="text-sm text-gray-600 mb-2">{session.counselor.title}</p>
                        )}
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="w-4 h-4 mr-2" />
                          {formatDate(session.scheduled_at)}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center ml-4">
                      {getStatusIcon(session.status)}
                      <span className={`ml-2 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(session.status)}`}>
                        {session.status?.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  {/* Session Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center text-sm text-gray-600">
                      {getSessionTypeIcon(session.session_type)}
                      <span className="ml-2 capitalize">{session.session_type?.replace('_', ' ')}</span>
                    </div>
                    {session.duration && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="w-4 h-4 mr-2" />
                        {session.duration} minutes
                      </div>
                    )}
                  </div>

                  {/* Notes */}
                  {session.notes && (
                    <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-start">
                        <FileText className="w-4 h-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="text-xs font-semibold text-blue-900 mb-1">Your Notes</div>
                          <p className="text-sm text-blue-800">{session.notes}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3">
                    {['scheduled', 'confirmed'].includes(session.status) && (
                      <button
                        onClick={() => handleCancelSession(session.id)}
                        className="px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition"
                      >
                        Cancel Session
                      </button>
                    )}
                    
                    {session.status === 'completed' && !session.feedback_given && (
                      <button
                        onClick={() => openFeedbackModal(session)}
                        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition flex items-center"
                      >
                        <Star className="w-4 h-4 mr-2" />
                        Leave Feedback
                      </button>
                    )}

                    {session.feedback_given && (
                      <div className="flex items-center text-sm text-green-600">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Feedback submitted
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Feedback Modal */}
        {showFeedbackModal && selectedSession && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Rate Your Session
              </h3>
              <p className="text-gray-600 mb-4">
                with {selectedSession.counselor?.full_name}
              </p>

              {/* Rating */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rating *
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(rating => (
                    <button
                      key={rating}
                      onClick={() => setFeedback(prev => ({ ...prev, rating }))}
                      className="focus:outline-none"
                    >
                      <Star 
                        className={`w-8 h-8 ${
                          rating <= feedback.rating 
                            ? 'text-yellow-500 fill-current' 
                            : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Comments */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Comments (Optional)
                </label>
                <textarea
                  value={feedback.comments}
                  onChange={(e) => setFeedback(prev => ({ ...prev, comments: e.target.value }))}
                  rows={4}
                  placeholder="Share your experience..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleSubmitFeedback}
                  disabled={submittingFeedback}
                  className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition disabled:opacity-50"
                >
                  {submittingFeedback ? 'Submitting...' : 'Submit Feedback'}
                </button>
                <button
                  onClick={closeFeedbackModal}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default MySessions
