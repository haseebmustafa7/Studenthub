import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { apiFetch } from '../lib/api'
import { Briefcase, DollarSign, MapPin, Calendar, Mail, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react'

const CompanyPublishJob = () => {
  const { user, profile } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const editJobId = searchParams.get('edit')
  const isEditing = Boolean(editJobId)

  const [formData, setFormData] = useState({
    title: '',
    jobType: '',
    category: '',
    description: '',
    responsibilities: '',
    requirements: '',
    requiredSkills: '',
    benefits: '',
    workMode: '',
    country: 'Pakistan',
    city: '',
    address: '',
    latitude: '',
    longitude: '',
    salaryMin: '',
    salaryMax: '',
    currency: 'PKR',
    contactEmail: profile?.email || '',
    applicationDeadline: ''
  })

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [showPreview, setShowPreview] = useState(false)

  useEffect(() => {
    if (!editJobId) return
    let active = true
    apiFetch(`/jobs/${editJobId}`)
      .then(async response => {
        const data = await response.json().catch(() => ({}))
        if (!response.ok) throw new Error(data.error || 'Unable to load job')
        const job = data.job || data
        if (!active) return
        setFormData(prev => ({
          ...prev,
          title: job.title || '',
          jobType: job.job_type || '',
          category: job.category || '',
          description: job.description || '',
          responsibilities: job.responsibilities || '',
          requirements: job.requirements || '',
          requiredSkills: Array.isArray(job.required_skills) ? job.required_skills.join(', ') : (job.required_skills || job.skills || ''),
          benefits: job.benefits || '',
          workMode: job.work_mode || '',
          country: job.country || 'Pakistan',
          city: job.city || '',
          address: job.address || '',
          latitude: job.latitude ?? '',
          longitude: job.longitude ?? '',
          salaryMin: job.salary_min ?? '',
          salaryMax: job.salary_max ?? '',
          currency: job.currency || 'PKR',
          contactEmail: job.contact_email || profile?.email || '',
          applicationDeadline: job.application_deadline ? String(job.application_deadline).slice(0, 10) : ''
        }))
      })
      .catch(err => { if (active) setError(err.message || 'Unable to load job') })
    return () => { active = false }
  }, [editJobId, profile?.email])

  const jobTypes = ['internship', 'full-time', 'part-time', 'contract']
  const workModes = ['remote', 'hybrid', 'on-site']
  const categories = [
    'Software Engineering',
    'Web Development',
    'AI / Machine Learning',
    'Data Science',
    'Cyber Security',
    'UI/UX Design',
    'Graphic Design',
    'Marketing',
    'Finance',
    'Accounting',
    'HR',
    'Sales',
    'Business Development',
    'Engineering',
    'Operations',
    'Customer Support',
    'QA / Testing',
    'Other'
  ]

  const pakistaniCities = [
    'Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad',
    'Multan', 'Peshawar', 'Quetta', 'Sialkot', 'Gujranwala',
    'Hyderabad', 'Abbottabad', 'Bahawalpur', 'Sargodha', 'Sukkur'
  ]

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Validation
    if (!formData.title || !formData.jobType || !formData.category || !formData.description) {
      setError('Please fill in all required fields')
      setLoading(false)
      return
    }

    try {
      const jobData = {
        title: formData.title,
        companyName: profile?.company_name || profile?.full_name,
        companyLogoUrl: profile?.company_logo_url || '',
        description: formData.description,
        requirements: formData.requirements,
        responsibilities: formData.responsibilities,
        benefits: formData.benefits,
        location: `${formData.city}, ${formData.country}`,
        city: formData.city,
        country: formData.country,
        address: formData.address,
        latitude: formData.latitude ? parseFloat(formData.latitude) : null,
        longitude: formData.longitude ? parseFloat(formData.longitude) : null,
        jobType: formData.jobType,
        workMode: formData.workMode,
        requiredSkills: formData.requiredSkills,
        skills: formData.requiredSkills, // alias
        salaryMin: formData.salaryMin ? parseInt(formData.salaryMin) : null,
        salaryMax: formData.salaryMax ? parseInt(formData.salaryMax) : null,
        currency: formData.currency,
        category: formData.category,
        applicationDeadline: formData.applicationDeadline || null,
        contactEmail: formData.contactEmail,
        isActive: true,
        status: 'active', // or 'pending' if approval required
        companyId: user?.id
      }

      const response = await apiFetch(isEditing ? `/jobs/${editJobId}` : '/jobs', {
        method: isEditing ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jobData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to publish job')
      }

      setSuccess(true)
      setTimeout(() => {
        navigate('/company/dashboard')
      }, 2000)
    } catch (err) {
      console.error('Publish job error:', err)
      setError(err.message || 'Failed to publish job. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-green-100 p-3 rounded-full">
              <CheckCircle className="text-green-600" size={48} />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{isEditing ? 'Job Updated Successfully!' : 'Job Submitted Successfully!'}</h2>
          <p className="text-gray-600">{isEditing ? 'Your changes have been saved. Redirecting to your dashboard...' : 'Your job is waiting for admin approval. Redirecting to your dashboard...'}</p>
        </div>
      </div>
    )
  }

  if (showPreview) {
    return (
      <div className="app-page">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => setShowPreview(false)}
            className="flex items-center gap-2 text-primary hover:text-blue-600 mb-6"
          >
            <ArrowLeft size={20} />
            Back to Edit
          </button>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{formData.title}</h1>
            
            <div className="flex items-center gap-4 mb-6 text-gray-600">
              <span className="flex items-center gap-1">
                <Briefcase size={18} />
                {profile?.company_name || 'Your Company'}
              </span>
              <span className="flex items-center gap-1">
                <MapPin size={18} />
                {formData.city ? `${formData.city}, ${formData.country}` : 'Location TBD'}
              </span>
            </div>

            <div className="flex gap-2 mb-6">
              {formData.jobType && (
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  {formData.jobType}
                </span>
              )}
              {formData.workMode && (
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                  {formData.workMode}
                </span>
              )}
              {formData.category && (
                <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                  {formData.category}
                </span>
              )}
            </div>

            {formData.description && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{formData.description}</p>
              </div>
            )}

            {formData.responsibilities && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Responsibilities</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{formData.responsibilities}</p>
              </div>
            )}

            {formData.requirements && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Requirements</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{formData.requirements}</p>
              </div>
            )}

            {formData.benefits && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Benefits</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{formData.benefits}</p>
              </div>
            )}

            {(formData.salaryMin || formData.salaryMax) && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Salary Range</h3>
                <p className="text-gray-700">
                  {formData.currency} {formData.salaryMin?.toLocaleString()} - {formData.salaryMax?.toLocaleString()}
                </p>
              </div>
            )}

            <div className="flex gap-4 mt-8">
              <button
                onClick={() => setShowPreview(false)}
                className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Edit Job
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 px-6 py-3 bg-primary text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
              >
                {loading ? 'Publishing...' : 'Confirm & Publish'}
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="app-page">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/company/dashboard')}
            className="flex items-center gap-2 text-primary hover:text-blue-600 mb-4"
          >
            <ArrowLeft size={20} />
            Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Publish Your Job</h1>
          <p className="mt-2 text-gray-600">Fill in the details to post a new job opening</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
              <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={(e) => { e.preventDefault(); setShowPreview(true); }} className="space-y-8">
            {/* Job Information Section */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b">Job Information</h2>
              
              <div className="space-y-4">
                {/* Job Title */}
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                    Job Title *
                  </label>
                  <input
                    id="title"
                    name="title"
                    type="text"
                    required
                    value={formData.title}
                    onChange={handleChange}
                    className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="e.g., Senior Software Engineer"
                  />
                </div>

                {/* Job Type and Category */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="jobType" className="block text-sm font-medium text-gray-700 mb-2">
                      Job Type *
                    </label>
                    <select
                      id="jobType"
                      name="jobType"
                      required
                      value={formData.jobType}
                      onChange={handleChange}
                      className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="">Select Job Type</option>
                      {jobTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="workMode" className="block text-sm font-medium text-gray-700 mb-2">
                      Work Mode *
                    </label>
                    <select
                      id="workMode"
                      name="workMode"
                      required
                      value={formData.workMode}
                      onChange={handleChange}
                      className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="">Select Work Mode</option>
                      {workModes.map(mode => (
                        <option key={mode} value={mode}>{mode}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    id="category"
                    name="category"
                    required
                    value={formData.category}
                    onChange={handleChange}
                    className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Description */}
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                    Job Description *
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    required
                    rows="6"
                    value={formData.description}
                    onChange={handleChange}
                    className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Describe the role, team, and what makes this opportunity exciting..."
                  />
                </div>

                {/* Responsibilities */}
                <div>
                  <label htmlFor="responsibilities" className="block text-sm font-medium text-gray-700 mb-2">
                    Key Responsibilities
                  </label>
                  <textarea
                    id="responsibilities"
                    name="responsibilities"
                    rows="5"
                    value={formData.responsibilities}
                    onChange={handleChange}
                    className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="• List the main responsibilities&#10;• One per line&#10;• Be specific and clear"
                  />
                </div>

                {/* Requirements */}
                <div>
                  <label htmlFor="requirements" className="block text-sm font-medium text-gray-700 mb-2">
                    Requirements
                  </label>
                  <textarea
                    id="requirements"
                    name="requirements"
                    rows="5"
                    value={formData.requirements}
                    onChange={handleChange}
                    className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="• Required qualifications&#10;• Years of experience&#10;• Technical skills&#10;• Education requirements"
                  />
                </div>

                {/* Required Skills */}
                <div>
                  <label htmlFor="requiredSkills" className="block text-sm font-medium text-gray-700 mb-2">
                    Required Skills (comma-separated)
                  </label>
                  <input
                    id="requiredSkills"
                    name="requiredSkills"
                    type="text"
                    value={formData.requiredSkills}
                    onChange={handleChange}
                    className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="React, Node.js, TypeScript, PostgreSQL"
                  />
                </div>

                {/* Benefits */}
                <div>
                  <label htmlFor="benefits" className="block text-sm font-medium text-gray-700 mb-2">
                    Benefits & Perks
                  </label>
                  <textarea
                    id="benefits"
                    name="benefits"
                    rows="4"
                    value={formData.benefits}
                    onChange={handleChange}
                    className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="• Health insurance&#10;• Flexible hours&#10;• Learning budget&#10;• Remote work options"
                  />
                </div>
              </div>
            </div>

            {/* Location Section */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b">Location</h2>
              
              <div className="space-y-4">
                {/* City and Country */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                      City *
                    </label>
                    <select
                      id="city"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleChange}
                      className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="">Select City</option>
                      {pakistaniCities.map(city => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
                      Country *
                    </label>
                    <input
                      id="country"
                      name="country"
                      type="text"
                      required
                      value={formData.country}
                      onChange={handleChange}
                      className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                    Office Address
                  </label>
                  <input
                    id="address"
                    name="address"
                    type="text"
                    value={formData.address}
                    onChange={handleChange}
                    className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Street address for on-site roles"
                  />
                </div>

                {/* Coordinates for Map */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="latitude" className="block text-sm font-medium text-gray-700 mb-2">
                      Latitude (for map display)
                    </label>
                    <input
                      id="latitude"
                      name="latitude"
                      type="number"
                      step="0.000001"
                      value={formData.latitude}
                      onChange={handleChange}
                      className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="31.5204"
                    />
                  </div>

                  <div>
                    <label htmlFor="longitude" className="block text-sm font-medium text-gray-700 mb-2">
                      Longitude (for map display)
                    </label>
                    <input
                      id="longitude"
                      name="longitude"
                      type="number"
                      step="0.000001"
                      value={formData.longitude}
                      onChange={handleChange}
                      className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="74.3587"
                    />
                  </div>
                </div>
                <p className="text-sm text-gray-500">
                  Optional: Add coordinates to display job on map. You can find coordinates at{' '}
                  <a href="https://www.google.com/maps" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    Google Maps
                  </a>
                </p>
              </div>
            </div>

            {/* Salary Section */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b">Compensation</h2>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="salaryMin" className="block text-sm font-medium text-gray-700 mb-2">
                      Minimum Salary
                    </label>
                    <input
                      id="salaryMin"
                      name="salaryMin"
                      type="number"
                      value={formData.salaryMin}
                      onChange={handleChange}
                      className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="50000"
                    />
                  </div>

                  <div>
                    <label htmlFor="salaryMax" className="block text-sm font-medium text-gray-700 mb-2">
                      Maximum Salary
                    </label>
                    <input
                      id="salaryMax"
                      name="salaryMax"
                      type="number"
                      value={formData.salaryMax}
                      onChange={handleChange}
                      className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="100000"
                    />
                  </div>

                  <div>
                    <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-2">
                      Currency
                    </label>
                    <select
                      id="currency"
                      name="currency"
                      value={formData.currency}
                      onChange={handleChange}
                      className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="PKR">PKR</option>
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="GBP">GBP</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Application Section */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b">Application Details</h2>
              
              <div className="space-y-4">
                {/* Contact Email */}
                <div>
                  <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Email *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="text-gray-400" size={20} />
                    </div>
                    <input
                      id="contactEmail"
                      name="contactEmail"
                      type="email"
                      required
                      value={formData.contactEmail}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="hr@company.com"
                    />
                  </div>
                </div>

                {/* Application Deadline */}
                <div>
                  <label htmlFor="applicationDeadline" className="block text-sm font-medium text-gray-700 mb-2">
                    Application Deadline
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar className="text-gray-400" size={20} />
                    </div>
                    <input
                      id="applicationDeadline"
                      name="applicationDeadline"
                      type="date"
                      value={formData.applicationDeadline}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-6 border-t">
              <button
                type="button"
                onClick={() => navigate('/company/dashboard')}
                className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-primary text-white rounded-lg hover:bg-blue-600 font-semibold"
              >
                Preview Job
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CompanyPublishJob
