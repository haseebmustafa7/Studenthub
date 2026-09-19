import { useEffect, useMemo, useState } from 'react'
import { apiFetch } from '../../lib/api'
import { useNavigate } from 'react-router-dom'
import {
  Users,
  Star,
  Briefcase,
  Calendar,
  ArrowRight,
  Filter,
  Search,
  Award,
} from 'lucide-react'

// Local fallback profiles used only when the counseling API is unavailable.
const DEMO_COUNSELORS = [
  {
    id: 'demo-sarah-ahmed',
    full_name: 'Dr. Sarah Ahmed',
    title: 'Senior Career Counselor',
    email: 'sarah.ahmed@example.com',
    bio: 'Helps students build clear career plans and transition confidently into technology careers.',
    specializations: ['Software Engineering', 'Data Science', 'Career Transitions'],
    years_of_experience: 15,
    rating: 4.9,
    total_sessions: 320,
    hourly_rate: 60
  },
  {
    id: 'demo-ali-hassan',
    full_name: 'Ali Hassan',
    title: 'Career Development Specialist',
    email: 'ali.hassan@example.com',
    bio: 'Guides students toward business careers by combining skills assessment with practical career planning.',
    specializations: ['Business Analytics', 'Marketing', 'Resume Building'],
    years_of_experience: 8,
    rating: 4.8,
    total_sessions: 210,
    hourly_rate: 50
  },
  {
    id: 'demo-maria-khan',
    full_name: 'Maria Khan',
    title: 'Design & Creative Careers Advisor',
    email: 'maria.khan@example.com',
    bio: 'Supports creative students with portfolio strategy, design career choices, and professional positioning.',
    specializations: ['UI/UX Design', 'Graphic Design', 'Creative Careers'],
    years_of_experience: 10,
    rating: 4.9,
    total_sessions: 185,
    hourly_rate: 55
  },
  {
    id: 'demo-farhan-malik',
    full_name: 'Farhan Malik',
    title: 'Engineering & Technical Career Coach',
    email: 'farhan.malik@example.com',
    bio: 'Helps engineering students choose specializations and prepare for technical interviews and industry roles.',
    specializations: ['Engineering Careers', 'Technical Skills', 'Interview Preparation'],
    years_of_experience: 12,
    rating: 4.7,
    total_sessions: 240,
    hourly_rate: 65
  },
  {
    id: 'demo-aisha-raza',
    full_name: 'Aisha Raza',
    title: 'Finance & Leadership Career Coach',
    email: 'aisha.raza@example.com',
    bio: 'Works with students and early professionals on finance careers, leadership skills, and long-term growth plans.',
    specializations: ['Finance', 'Leadership', 'Career Planning'],
    years_of_experience: 9,
    rating: 4.8,
    total_sessions: 195,
    hourly_rate: 70
  }
]

const SPECIALIZATIONS = [
  'Software Engineering',
  'Data Science',
  'Product Management',
  'UI/UX Design',
  'Business Analytics',
  'Marketing',
  'Finance',
  'Engineering Careers'
]

const PRICE_RANGES = [
  { label: 'Under $50', max: 50 },
  { label: '$50 - $100', min: 50, max: 100 },
  { label: '$100 - $150', min: 100, max: 150 },
  { label: 'Over $150', min: 150 }
]

const Counselors = () => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSpecialization, setSelectedSpecialization] = useState('')
  const [selectedPriceRange, setSelectedPriceRange] = useState('')
  const [counselors, setCounselors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    apiFetch('/counseling/counselors')
      .then(async response => {
        const data = await response.json().catch(() => ({}))
        if (!response.ok) throw new Error(data.error || 'Unable to load counselors')
        if (active) setCounselors(data.counselors || [])
      })
      .catch(err => {
        if (active) { setError(err.message || 'Unable to load counselors'); setCounselors(DEMO_COUNSELORS) }
      })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])

  const filteredCounselors = useMemo(() => {
    return counselors.filter((counselor) => {
      const query = searchQuery.toLowerCase().trim()
      const matchesSearch = !query ||
        counselor.full_name.toLowerCase().includes(query) ||
        counselor.bio.toLowerCase().includes(query) ||
        counselor.specializations.some((spec) => spec.toLowerCase().includes(query))

      const matchesSpecialization = !selectedSpecialization ||
        counselor.specializations.includes(selectedSpecialization)

      const range = PRICE_RANGES.find((item) => item.label === selectedPriceRange)
      const matchesPrice = !range || (
        (range.min == null || counselor.hourly_rate >= range.min) &&
        (range.max == null || counselor.hourly_rate <= range.max)
      )

      return matchesSearch && matchesSpecialization && matchesPrice
    })
  }, [counselors, searchQuery, selectedSpecialization, selectedPriceRange])

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedSpecialization('')
    setSelectedPriceRange('')
  }

  const handleBookAppointment = (counselor) => navigate(`/career/book/${counselor.id}`)

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate('/career')}
          className="mb-6 inline-flex items-center text-gray-600 hover:text-primary transition"
        >
          <ArrowRight className="w-5 h-5 mr-2 rotate-180" />
          Back to Career Counselling
        </button>

        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <Users className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Expert Career Counselors</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose a counselor based on their specialization and request a one-to-one career counseling appointment.
          </p>
          {error && <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-800 rounded-full text-sm">{error} Showing available sample profiles while we retry.</div>}
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center mb-4">
            <Filter className="w-5 h-5 text-gray-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Find a Counselor</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Name or specialization..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Specialization</label>
              <select
                value={selectedSpecialization}
                onChange={(e) => setSelectedSpecialization(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">All Specializations</option>
                {SPECIALIZATIONS.map((spec) => <option key={spec} value={spec}>{spec}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
              <select
                value={selectedPriceRange}
                onChange={(e) => setSelectedPriceRange(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">All Prices</option>
                {PRICE_RANGES.map((range) => <option key={range.label} value={range.label}>{range.label}</option>)}
              </select>
            </div>
          </div>

          {(searchQuery || selectedSpecialization || selectedPriceRange) && (
            <button onClick={clearFilters} className="mt-4 text-sm text-primary hover:text-primary-dark transition">
              Clear all filters
            </button>
          )}
        </div>

        <div className="mb-6 text-gray-600">
          {loading ? 'Loading counselors…' : `Showing ${filteredCounselors.length} of ${counselors.length} counselors`}
        </div>

        {filteredCounselors.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No counselors found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your filters to see more results.</p>
            <button onClick={clearFilters} className="text-primary hover:text-primary-dark transition">
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCounselors.map((counselor) => (
              <div key={counselor.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition">
                <div className="bg-gradient-to-r from-primary to-primary-dark p-6 text-white">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-primary text-2xl font-bold mb-3">
                    {counselor.full_name.split(' ').map((name) => name[0]).join('')}
                  </div>
                  <h3 className="text-xl font-bold mb-1">{counselor.full_name}</h3>
                  <p className="text-sm opacity-90">{counselor.title}</p>
                </div>

                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <Star className="w-5 h-5 text-amber-500 fill-current mr-1" />
                    <span className="font-semibold text-gray-900 mr-2">{counselor.rating}</span>
                    <span className="text-sm text-gray-500">({counselor.total_sessions} sessions)</span>
                  </div>

                  <p className="text-gray-600 text-sm leading-relaxed mb-5">{counselor.bio}</p>

                  <div className="flex items-center text-gray-600 text-sm mb-4">
                    <Briefcase className="w-4 h-4 mr-2" />
                    {counselor.years_of_experience} years experience
                  </div>

                  <div className="mb-5">
                    <p className="text-sm font-semibold text-gray-900 mb-2">Specializations</p>
                    <div className="flex flex-wrap gap-2">
                      {counselor.specializations.map((spec) => (
                        <span key={spec} className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 mb-5 border-t border-gray-200">
                    <span className="text-sm text-gray-500">Session rate</span>
                    <span className="text-2xl font-bold text-primary">${counselor.hourly_rate}/hr</span>
                  </div>

                  <button
                    onClick={() => handleBookAppointment(counselor)}
                    className="w-full flex items-center justify-center px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition font-semibold"
                  >
                    <Calendar className="w-5 h-5 mr-2" />
                    Book Appointment
                  </button>
                  <p className="text-xs text-gray-500 text-center mt-2">
                    Choose a time and session type in StudentHub.
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-xl p-8 text-center">
          <Award className="w-12 h-12 text-primary mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Need help choosing?</h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Take our career assessment and use your results to decide which counseling specialization fits your goals best.
          </p>
          <button
            onClick={() => navigate('/career/assessment')}
            className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition font-semibold"
          >
            Take Career Assessment
            <ArrowRight className="w-5 h-5 ml-2" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default Counselors
