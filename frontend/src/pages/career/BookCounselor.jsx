import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { apiRequest } from '../../lib/api'
import { 
  Calendar,
  Clock,
  DollarSign,
  Star,
  Shield,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  User,
  FileText
} from 'lucide-react'


const BookCounselor = () => {
  const { counselorId } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [counselor, setCounselor] = useState(null)
  const [availableSlots, setAvailableSlots] = useState([])

  const [formData, setFormData] = useState({
    scheduled_at: '',
    session_type: 'video',
    notes: '',
    consent_data_sharing: false
  })

  const [errors, setErrors] = useState({})

  useEffect(() => {
    fetchCounselor()
  }, [counselorId])

  useEffect(() => {
    if (formData.scheduled_at) fetchAvailableSlots(formData.scheduled_at.slice(0, 10))
  }, [formData.scheduled_at, counselorId])

  const fetchCounselor = async () => {
    try {
      setLoading(true)
      const response = await apiRequest({ method: 'GET', url: `/counseling/counselors/${counselorId}` })
      setCounselor(response.data.counselor || response.data)
    } catch (err) {
      console.error('Error fetching counselor:', err)
      setError('Failed to load counselor information')
    } finally {
      setLoading(false)
    }
  }

  const fetchAvailableSlots = async (date) => {
    try {
      if (!date) { setAvailableSlots([]); return }
      const response = await apiRequest({ method: 'GET', url: `/counseling/available-slots?counselor_id=${encodeURIComponent(counselorId)}&date=${encodeURIComponent(date)}` })
      setAvailableSlots(response.data.availableSlots || [])
    } catch (err) {
      console.error('Error fetching slots:', err)
      // Not critical, continue without slots
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.scheduled_at) {
      newErrors.scheduled_at = 'Please select a date and time'
    } else {
      const selectedDate = new Date(formData.scheduled_at)
      const now = new Date()
      if (selectedDate <= now) {
        newErrors.scheduled_at = 'Please select a future date and time'
      }
    }

    if (!formData.session_type) {
      newErrors.session_type = 'Please select a session type'
    }

    if (!formData.consent_data_sharing) {
      newErrors.consent_data_sharing = 'You must consent to data sharing to proceed'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    try {
      setSubmitting(true)
      setError('')

      const bookingData = {
        counselor_id: counselorId,
        scheduled_at: formData.scheduled_at,
        session_type: formData.session_type,
        notes: formData.notes || '',
        consent_data_sharing: formData.consent_data_sharing
      }

      await apiRequest({ method: 'POST', url: '/counseling/sessions', data: bookingData })

      setSuccess(true)
      
      // Redirect to sessions page after 2 seconds
      setTimeout(() => {
        navigate('/career/sessions')
      }, 2000)
    } catch (err) {
      console.error('Error booking session:', err)
      setError(err.response?.data?.error || 'Failed to book session. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Session Booked Successfully!
            </h2>
            <p className="text-gray-600 mb-6">
              Your session with {counselor?.full_name} has been confirmed. You'll receive a confirmation email shortly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/career/sessions')}
                className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition"
              >
                View My Sessions
              </button>
              <button
                onClick={() => navigate('/career/counselors')}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                Browse More Counselors
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!counselor) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-600">Counselor not found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/career/counselors')}
          className="flex items-center text-gray-600 hover:text-primary transition mb-6"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Counselors
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Counselor Info Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-6">
              <div className="text-center mb-6">
                <div className="w-24 h-24 bg-gradient-to-r from-primary to-primary-dark rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4">
                  {counselor.full_name.split(' ').map(n => n[0]).join('')}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  {counselor.full_name}
                </h3>
                {counselor.title && (
                  <p className="text-gray-600 text-sm">{counselor.title}</p>
                )}
              </div>

              {/* Rating */}
              {counselor.rating && (
                <div className="flex items-center justify-center mb-4 pb-4 border-b border-gray-200">
                  <Star className="w-5 h-5 text-yellow-500 fill-current mr-1" />
                  <span className="font-semibold text-gray-900 mr-2">{counselor.rating}</span>
                  <span className="text-sm text-gray-600">
                    ({counselor.total_sessions || 0} sessions)
                  </span>
                </div>
              )}

              {/* Specializations */}
              {counselor.specializations && counselor.specializations.length > 0 && (
                <div className="mb-4">
                  <div className="text-xs font-semibold text-gray-600 mb-2">Specializations</div>
                  <div className="flex flex-wrap gap-2">
                    {counselor.specializations.map((spec, idx) => (
                      <span 
                        key={idx}
                        className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Price */}
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <div className="text-sm text-gray-600 mb-1">Session Rate</div>
                <div className="text-3xl font-bold text-primary">
                  ${counselor.hourly_rate}
                  <span className="text-base text-gray-600 font-normal">/hour</span>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Book a Session
              </h2>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
                  <AlertCircle className="w-5 h-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Date and Time */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="w-4 h-4 inline mr-2" />
                    Preferred Date & Time *
                  </label>
                  <input
                    type="datetime-local"
                    name="scheduled_at"
                    value={formData.scheduled_at}
                    onChange={handleChange}
                    min={new Date().toISOString().slice(0, 16)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                      errors.scheduled_at ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.scheduled_at && (
                    <p className="mt-1 text-sm text-red-600">{errors.scheduled_at}</p>
                  )}
                  <p className="mt-2 text-xs text-gray-500">
                    The counselor will confirm the final time based on availability
                  </p>
                  {availableSlots.length > 0 && (
                    <div className="mt-3">
                      <p className="text-xs font-semibold text-gray-600 mb-2">Available times for this date</p>
                      <div className="flex flex-wrap gap-2">
                        {availableSlots.map(slot => (
                          <button key={slot.time} type="button" onClick={() => setFormData(prev => ({ ...prev, scheduled_at: `${prev.scheduled_at.slice(0, 10)}T${slot.time.slice(0, 5)}` }))} className="px-3 py-1.5 rounded-lg border border-gray-200 bg-gray-50 text-sm hover:border-primary hover:text-primary">{slot.display}</button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Session Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Clock className="w-4 h-4 inline mr-2" />
                    Session Type *
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {['video', 'phone', 'in_person'].map(type => (
                      <label 
                        key={type}
                        className={`flex items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition ${
                          formData.session_type === type 
                            ? 'border-primary bg-blue-50' 
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        <input
                          type="radio"
                          name="session_type"
                          value={type}
                          checked={formData.session_type === type}
                          onChange={handleChange}
                          className="sr-only"
                        />
                        <span className="font-medium text-gray-900 capitalize">
                          {type.replace('_', ' ')}
                        </span>
                      </label>
                    ))}
                  </div>
                  {errors.session_type && (
                    <p className="mt-1 text-sm text-red-600">{errors.session_type}</p>
                  )}
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FileText className="w-4 h-4 inline mr-2" />
                    Session Notes (Optional)
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Share any specific topics you'd like to discuss or questions you have..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    This helps the counselor prepare for your session
                  </p>
                </div>

                {/* Consent Checkbox */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <div className="flex items-start">
                    <Shield className="w-6 h-6 text-primary mr-3 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-2">
                        Data Sharing Consent
                      </h4>
                      <p className="text-sm text-gray-600 mb-4">
                        To provide personalized career guidance, your counselor will need access to your career assessment results, skill analysis, and learning progress. This information helps them understand your goals and provide tailored advice.
                      </p>
                      <label className="flex items-start cursor-pointer">
                        <input
                          type="checkbox"
                          name="consent_data_sharing"
                          checked={formData.consent_data_sharing}
                          onChange={handleChange}
                          className={`mt-1 w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary ${
                            errors.consent_data_sharing ? 'border-red-500' : ''
                          }`}
                        />
                        <span className="ml-3 text-sm text-gray-700">
                          I consent to sharing my career assessment data, skill analysis, and learning progress with this counselor for the purpose of receiving personalized career guidance.
                        </span>
                      </label>
                      {errors.consent_data_sharing && (
                        <p className="mt-2 text-sm text-red-600">{errors.consent_data_sharing}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 flex items-center justify-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                  >
                    {submitting ? (
                      <>
                        <Clock className="w-5 h-5 mr-2 animate-spin" />
                        Booking...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-5 h-5 mr-2" />
                        Confirm Booking
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate('/career/counselors')}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookCounselor
