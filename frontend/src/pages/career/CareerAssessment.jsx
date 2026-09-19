import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { careerRequest, CAREER_API } from '../../lib/careerApi'
import { 
  GraduationCap, 
  Heart, 
  Zap, 
  Target, 
  CheckCircle, 
  ArrowRight, 
  ArrowLeft,
  Save
} from 'lucide-react'


const CareerAssessment = () => {
  useAuth()
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const totalSteps = 7

  const [formData, setFormData] = useState({
    // Step 1: Education
    education_level: '',
    degree_program: '',
    current_semester: '',
    expected_graduation: '',
    employment_status: '',
    previous_experience: '',
    
    // Step 2: Interests
    interests: [],
    
    // Step 3: Activities/Strengths
    activities_strengths: [],
    
    // Step 4: Current Skills
    current_skills: [],
    
    // Step 5: Career Preferences
    preferred_industries: [],
    work_mode: '',
    work_style: '',
    priorities: {
      career_growth: 3,
      job_stability: 3,
      salary: 3,
      creativity: 3,
      work_life_balance: 3,
      social_impact: 3
    },
    
    // Step 6: Career Goal
    career_goal: '',
    
    // Step 7: Career Concern
    career_concern: ''
  })

  // Load existing assessment on mount
  useEffect(() => {
    loadExistingAssessment()
  }, [])

  const loadExistingAssessment = async () => {
    try {
      const response = await careerRequest({ url: `${CAREER_API}/assessment` })

      if (response.data.assessment) {
        setFormData(response.data.assessment)
      }
    } catch (error) {
      console.error('Error loading assessment:', error)
    }
  }

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleArrayToggle = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }))
  }

  const handleSkillChange = (index, field, value) => {
    setFormData(prev => {
      const newSkills = [...prev.current_skills]
      newSkills[index] = {
        ...newSkills[index],
        [field]: value
      }
      return { ...prev, current_skills: newSkills }
    })
  }

  const addSkill = () => {
    setFormData(prev => ({
      ...prev,
      current_skills: [...prev.current_skills, { skill: '', level: 'beginner' }]
    }))
  }

  const removeSkill = (index) => {
    setFormData(prev => ({
      ...prev,
      current_skills: prev.current_skills.filter((_, i) => i !== index)
    }))
  }

  const handlePriorityChange = (priority, value) => {
    setFormData(prev => ({
      ...prev,
      priorities: {
        ...prev.priorities,
        [priority]: value
      }
    }))
  }

  const saveProgress = async () => {
    setSaving(true)
    setError('')
    
    try {
      await careerRequest({ method: 'post', url: `${CAREER_API}/assessment`, data: { ...formData, status: 'in_progress' } })
      
      setSaving(false)
    } catch (error) {
      console.error('Error saving:', error)
      setError('Failed to save progress')
      setSaving(false)
    }
  }

  const validateStep = () => {
    switch (currentStep) {
      case 1:
        return formData.education_level && formData.degree_program && formData.employment_status
      case 2:
        return formData.interests.length > 0
      case 3:
        return formData.activities_strengths.length > 0
      case 4:
        return formData.current_skills.length > 0
      case 5:
        return formData.work_mode && formData.work_style
      case 6:
        return formData.career_goal
      case 7:
        return true // Career concern is optional
      default:
        return true
    }
  }

  const handleNext = async () => {
    if (!validateStep()) {
      setError('Please complete all required fields')
      return
    }

    setError('')
    await saveProgress()

    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
      window.scrollTo(0, 0)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      window.scrollTo(0, 0)
    }
  }

  const handleSubmit = async () => {
    if (!validateStep()) {
      setError('Please complete all required fields')
      return
    }

    setLoading(true)
    setError('')

    try {
      await careerRequest({ method: 'post', url: `${CAREER_API}/assessment`, data: { ...formData, status: 'completed' } })

      navigate('/career/results')
    } catch (error) {
      console.error('Error submitting assessment:', error)
      setError('Failed to submit assessment. Please try again.')
      setLoading(false)
    }
  }

  const interestOptions = [
    'Technology', 'AI/ML', 'Data Science', 'Cybersecurity', 'Design',
    'Business', 'Finance', 'Marketing', 'Engineering', 'Healthcare',
    'Education', 'Research', 'Entrepreneurship', 'Media/Writing', 'Social Impact'
  ]

  const activityOptions = [
    'Problem Solving', 'Programming', 'Designing', 'Research',
    'Communication', 'Teaching', 'Leadership', 'Analysis',
    'Creativity', 'Working with People', 'Working Independently', 'Building Products'
  ]

  const industryOptions = [
    'Technology', 'Finance', 'Healthcare', 'Education', 'Retail',
    'Manufacturing', 'Media', 'Consulting', 'Government', 'Nonprofit'
  ]

  const careerGoalOptions = [
    'Choose a career', 'Find internship', 'Find job', 'Improve skills',
    'Build portfolio', 'Freelance', 'Entrepreneurship', 'Change career', 'Unsure'
  ]

  const skillLevels = ['Beginner', 'Developing', 'Intermediate', 'Strong', 'Advanced']

  const renderProgressBar = () => (
    <div className="mb-8">
      <div className="flex justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">
          Step {currentStep} of {totalSteps}
        </span>
        <span className="text-sm font-medium text-gray-700">
          {Math.round((currentStep / totalSteps) * 100)}%
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-purple-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        />
      </div>
    </div>
  )

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-purple-100 p-3 rounded-xl">
                <GraduationCap className="text-purple-600" size={28} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Education & Experience</h2>
                <p className="text-gray-600">Tell us about your educational background</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Education Level *
              </label>
              <select
                value={formData.education_level}
                onChange={(e) => handleChange('education_level', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              >
                <option value="">Select education level</option>
                <option value="High School">High School</option>
                <option value="Undergraduate">Undergraduate</option>
                <option value="Graduate">Graduate</option>
                <option value="Postgraduate">Postgraduate</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Degree/Program *
              </label>
              <input
                type="text"
                value={formData.degree_program}
                onChange={(e) => handleChange('degree_program', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="e.g., Computer Science, Business Administration"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Semester/Year
              </label>
              <input
                type="text"
                value={formData.current_semester}
                onChange={(e) => handleChange('current_semester', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="e.g., Final Year, Semester 6"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expected Graduation
              </label>
              <input
                type="date"
                value={formData.expected_graduation}
                onChange={(e) => handleChange('expected_graduation', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Employment Status *
              </label>
              <select
                value={formData.employment_status}
                onChange={(e) => handleChange('employment_status', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              >
                <option value="">Select status</option>
                <option value="Student">Student</option>
                <option value="Working Student">Working Student</option>
                <option value="Employed">Employed</option>
                <option value="Unemployed">Unemployed</option>
                <option value="Self-Employed">Self-Employed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Previous Experience (Optional)
              </label>
              <textarea
                value={formData.previous_experience}
                onChange={(e) => handleChange('previous_experience', e.target.value)}
                rows="4"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Describe any relevant work experience, internships, or projects..."
              />
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-purple-100 p-3 rounded-xl">
                <Heart className="text-purple-600" size={28} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Your Interests</h2>
                <p className="text-gray-600">Select areas that interest you (select multiple)</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {interestOptions.map(interest => (
                <button
                  key={interest}
                  type="button"
                  onClick={() => handleArrayToggle('interests', interest)}
                  className={`px-4 py-3 rounded-lg border-2 transition ${
                    formData.interests.includes(interest)
                      ? 'border-purple-600 bg-purple-50 text-purple-700 font-medium'
                      : 'border-gray-300 hover:border-purple-300'
                  }`}
                >
                  {interest}
                </button>
              ))}
            </div>

            {formData.interests.length === 0 && (
              <p className="text-sm text-red-600">Please select at least one interest</p>
            )}
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-purple-100 p-3 rounded-xl">
                <Zap className="text-purple-600" size={28} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Activities & Strengths</h2>
                <p className="text-gray-600">What do you enjoy doing? (select multiple)</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {activityOptions.map(activity => (
                <button
                  key={activity}
                  type="button"
                  onClick={() => handleArrayToggle('activities_strengths', activity)}
                  className={`px-4 py-3 rounded-lg border-2 transition ${
                    formData.activities_strengths.includes(activity)
                      ? 'border-purple-600 bg-purple-50 text-purple-700 font-medium'
                      : 'border-gray-300 hover:border-purple-300'
                  }`}
                >
                  {activity}
                </button>
              ))}
            </div>

            {formData.activities_strengths.length === 0 && (
              <p className="text-sm text-red-600">Please select at least one activity</p>
            )}
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-purple-100 p-3 rounded-xl">
                <CheckCircle className="text-purple-600" size={28} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Current Skills</h2>
                <p className="text-gray-600">Add your skills and proficiency levels</p>
              </div>
            </div>

            <div className="space-y-4">
              {formData.current_skills.map((skill, index) => (
                <div key={index} className="flex gap-3">
                  <input
                    type="text"
                    value={skill.skill}
                    onChange={(e) => handleSkillChange(index, 'skill', e.target.value)}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Skill name (e.g., JavaScript, Communication)"
                  />
                  <select
                    value={skill.level}
                    onChange={(e) => handleSkillChange(index, 'level', e.target.value)}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    {skillLevels.map(level => (
                      <option key={level} value={level.toLowerCase()}>
                        {level}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => removeSkill(index)}
                    className="px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition"
                  >
                    Remove
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={addSkill}
                className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-purple-500 hover:text-purple-600 transition"
              >
                + Add Skill
              </button>
            </div>

            {formData.current_skills.length === 0 && (
              <p className="text-sm text-red-600">Please add at least one skill</p>
            )}
          </div>
        )

      case 5:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-purple-100 p-3 rounded-xl">
                <Target className="text-purple-600" size={28} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Career Preferences</h2>
                <p className="text-gray-600">Help us understand what you're looking for</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Industries (Optional)
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {industryOptions.map(industry => (
                  <button
                    key={industry}
                    type="button"
                    onClick={() => handleArrayToggle('preferred_industries', industry)}
                    className={`px-4 py-2 rounded-lg border-2 transition text-sm ${
                      formData.preferred_industries.includes(industry)
                        ? 'border-purple-600 bg-purple-50 text-purple-700 font-medium'
                        : 'border-gray-300 hover:border-purple-300'
                    }`}
                  >
                    {industry}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Work Mode Preference *
              </label>
              <div className="grid grid-cols-3 gap-3">
                {['remote', 'office', 'hybrid'].map(mode => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => handleChange('work_mode', mode)}
                    className={`px-4 py-3 rounded-lg border-2 transition capitalize ${
                      formData.work_mode === mode
                        ? 'border-purple-600 bg-purple-50 text-purple-700 font-medium'
                        : 'border-gray-300 hover:border-purple-300'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Work Style Preference *
              </label>
              <div className="grid grid-cols-3 gap-3">
                {['team', 'independent', 'mixed'].map(style => (
                  <button
                    key={style}
                    type="button"
                    onClick={() => handleChange('work_style', style)}
                    className={`px-4 py-3 rounded-lg border-2 transition capitalize ${
                      formData.work_style === style
                        ? 'border-purple-600 bg-purple-50 text-purple-700 font-medium'
                        : 'border-gray-300 hover:border-purple-300'
                    }`}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                How important are these factors? (1 = Not Important, 5 = Very Important)
              </label>
              <div className="space-y-4">
                {Object.entries({
                  career_growth: 'Career Growth',
                  job_stability: 'Job Stability',
                  salary: 'Salary',
                  creativity: 'Creativity',
                  work_life_balance: 'Work-Life Balance',
                  social_impact: 'Social Impact'
                }).map(([key, label]) => (
                  <div key={key}>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-700">{label}</span>
                      <span className="text-sm font-medium text-purple-600">
                        {formData.priorities[key]}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={formData.priorities[key]}
                      onChange={(e) => handlePriorityChange(key, parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )

      case 6:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-purple-100 p-3 rounded-xl">
                <Target className="text-purple-600" size={28} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Career Goal</h2>
                <p className="text-gray-600">What are you hoping to achieve?</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Primary Career Goal *
              </label>
              <select
                value={formData.career_goal}
                onChange={(e) => handleChange('career_goal', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              >
                <option value="">Select your goal</option>
                {careerGoalOptions.map(goal => (
                  <option key={goal} value={goal}>{goal}</option>
                ))}
              </select>
            </div>
          </div>
        )

      case 7:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-purple-100 p-3 rounded-xl">
                <Target className="text-purple-600" size={28} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Career Concern</h2>
                <p className="text-gray-600">Share any specific questions or concerns (optional)</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                What's your biggest career concern or question?
              </label>
              <textarea
                value={formData.career_concern}
                onChange={(e) => handleChange('career_concern', e.target.value)}
                rows="6"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="e.g., I'm not sure which programming language to focus on, or I'm concerned about job market demand in my field..."
              />
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
              <h3 className="font-semibold text-purple-900 mb-2">Ready to submit?</h3>
              <p className="text-sm text-purple-700">
                Once you submit, we'll analyze your responses and provide personalized career recommendations.
              </p>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="app-page">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          {renderProgressBar()}

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {renderStepContent()}

          <div className="flex justify-between mt-8 pt-6 border-t">
            <div>
              {currentStep > 1 && (
                <button
                  onClick={handleBack}
                  className="flex items-center gap-2 px-6 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition"
                  disabled={loading || saving}
                >
                  <ArrowLeft size={20} />
                  Back
                </button>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={saveProgress}
                disabled={saving || loading}
                className="flex items-center gap-2 px-6 py-3 text-purple-600 hover:bg-purple-50 rounded-lg transition"
              >
                <Save size={20} />
                {saving ? 'Saving...' : 'Save Progress'}
              </button>

              {currentStep < totalSteps ? (
                <button
                  onClick={handleNext}
                  disabled={!validateStep() || loading || saving}
                  className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                  <ArrowRight size={20} />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={loading || saving}
                  className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Submitting...' : 'Submit Assessment'}
                  <ArrowRight size={20} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CareerAssessment
