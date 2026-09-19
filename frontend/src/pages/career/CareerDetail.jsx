import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { careerRequest } from '../../lib/careerApi'
import { 
  Briefcase,
  DollarSign,
  TrendingUp,
  MapPin,
  GraduationCap,
  CheckCircle,
  Target,
  BookOpen,
  Users,
  ArrowLeft,
  ArrowRight,
  AlertCircle,
  Award,
  Zap
} from 'lucide-react'


const CareerDetail = () => {
  const { careerId } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [career, setCareer] = useState(null)

  useEffect(() => {
    fetchCareer()
  }, [careerId])

  const fetchCareer = async () => {
    try {
      setLoading(true)
      setError('')
      
      const response = await careerRequest({ method: 'GET', url: `/careers/${careerId}` })
      
      setCareer(response.data)
    } catch (err) {
      console.error('Error fetching career:', err)
      setError(err.response?.data?.error || 'Failed to fetch career details')
    } finally {
      setLoading(false)
    }
  }

  const handleViewSkillAnalysis = () => {
    navigate(`/career/skills/${careerId}`)
  }

  const handleViewRoadmap = () => {
    navigate(`/career/roadmap/${careerId}`)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!career) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Career Not Found</h2>
          <p className="text-gray-600 mb-6">The career you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/career/results')}
            className="text-primary hover:text-primary-dark transition"
          >
            ← Back to Career Matches
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/career/results')}
          className="flex items-center text-gray-600 hover:text-primary transition mb-6"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Career Matches
        </button>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
            <AlertCircle className="w-5 h-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Career Header */}
        <div className="bg-gradient-to-r from-primary to-primary-dark rounded-xl p-8 text-white mb-8">
          <div className="flex items-center mb-4">
            <Briefcase className="w-12 h-12 mr-4" />
            <div>
              <h1 className="text-4xl font-bold mb-2">{career.title}</h1>
              {career.category && (
                <span className="inline-block px-3 py-1 bg-white bg-opacity-20 rounded-full text-sm">
                  {career.category}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Key Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center mb-3">
              <DollarSign className="w-8 h-8 text-green-600 mr-3" />
              <div>
                <div className="text-sm text-gray-600">Salary Range</div>
                <div className="text-xl font-bold text-gray-900">
                  ${career.salary_range_min?.toLocaleString()} - ${career.salary_range_max?.toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center mb-3">
              <TrendingUp className="w-8 h-8 text-blue-600 mr-3" />
              <div>
                <div className="text-sm text-gray-600">Growth Outlook</div>
                <div className="text-xl font-bold text-gray-900 capitalize">
                  {career.growth_outlook}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center mb-3">
              <GraduationCap className="w-8 h-8 text-purple-600 mr-3" />
              <div>
                <div className="text-sm text-gray-600">Education Level</div>
                <div className="text-xl font-bold text-gray-900 capitalize">
                  {career.typical_education?.replace('_', ' ')}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Career</h2>
          <p className="text-gray-700 leading-relaxed">{career.description}</p>
        </div>

        {/* Required Skills */}
        {career.required_skills && career.required_skills.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <div className="flex items-center mb-6">
              <Zap className="w-6 h-6 text-primary mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">Required Skills</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {career.required_skills.map((skill, index) => (
                <div 
                  key={index}
                  className="flex items-center p-4 bg-blue-50 border border-blue-200 rounded-lg"
                >
                  <CheckCircle className="w-5 h-5 text-primary mr-3 flex-shrink-0" />
                  <span className="text-gray-900 font-medium">{skill}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Typical Responsibilities */}
        {career.typical_responsibilities && career.typical_responsibilities.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <div className="flex items-center mb-6">
              <Target className="w-6 h-6 text-primary mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">Key Responsibilities</h2>
            </div>
            <ul className="space-y-3">
              {career.typical_responsibilities.map((responsibility, index) => (
                <li key={index} className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-700">{responsibility}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Career Path */}
        {career.career_path && career.career_path.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <div className="flex items-center mb-6">
              <Award className="w-6 h-6 text-primary mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">Career Progression</h2>
            </div>
            <div className="space-y-4">
              {career.career_path.map((step, index) => (
                <div key={index} className="flex items-start">
                  <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold mr-4 flex-shrink-0">
                    {index + 1}
                  </div>
                  <div className="flex-1 pt-1">
                    <p className="text-gray-900 font-medium">{step}</p>
                  </div>
                  {index < career.career_path.length - 1 && (
                    <ArrowRight className="w-5 h-5 text-gray-400 ml-4 mt-1" />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Industry Trends */}
        {career.industry_trends && career.industry_trends.length > 0 && (
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-8 mb-8">
            <div className="flex items-center mb-6">
              <TrendingUp className="w-6 h-6 text-primary mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">Industry Trends</h2>
            </div>
            <ul className="space-y-3">
              {career.industry_trends.map((trend, index) => (
                <li key={index} className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-800">{trend}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <button
            onClick={handleViewSkillAnalysis}
            className="flex items-center justify-center px-6 py-4 bg-white border-2 border-primary text-primary rounded-xl hover:bg-blue-50 transition font-semibold"
          >
            <Target className="w-6 h-6 mr-3" />
            <div className="text-left">
              <div className="text-lg">Analyze Your Skills</div>
              <div className="text-sm font-normal opacity-80">See how you match up</div>
            </div>
          </button>

          <button
            onClick={handleViewRoadmap}
            className="flex items-center justify-center px-6 py-4 bg-white border-2 border-primary text-primary rounded-xl hover:bg-blue-50 transition font-semibold"
          >
            <BookOpen className="w-6 h-6 mr-3" />
            <div className="text-left">
              <div className="text-lg">Get Learning Roadmap</div>
              <div className="text-sm font-normal opacity-80">Step-by-step guidance</div>
            </div>
          </button>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-primary to-primary-dark rounded-xl p-8 text-white text-center">
          <Users className="w-12 h-12 mx-auto mb-4 opacity-90" />
          <h3 className="text-2xl font-bold mb-4">
            Ready to Start Your Journey?
          </h3>
          <p className="text-lg mb-6 opacity-90">
            Connect with expert career counselors who specialize in {career.title} to get personalized guidance.
          </p>
          <button
            onClick={() => navigate('/career/counselors')}
            className="inline-flex items-center px-6 py-3 bg-white text-primary rounded-lg hover:bg-gray-100 transition font-semibold"
          >
            <Users className="w-5 h-5 mr-2" />
            Find a Career Counselor
            <ArrowRight className="w-5 h-5 ml-2" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default CareerDetail
