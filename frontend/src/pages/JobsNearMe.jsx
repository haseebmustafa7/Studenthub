import { useState, useEffect } from 'react'
import JobMap from '../components/JobMap'
import { 
  MapPin, Navigation, Search, Filter, Briefcase, 
  Building2, DollarSign, Clock, AlertCircle 
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { googleMapsSearchUrl } from '../lib/googleMaps'

const JobsNearMe = () => {
  const [jobs, setJobs] = useState([])
  const [filteredJobs, setFilteredJobs] = useState([])
  const [userLocation, setUserLocation] = useState(null)
  const [loading, setLoading] = useState(true)
  const [locationError, setLocationError] = useState('')
  const [distance, setDistance] = useState(25) // km
  const [selectedJob, setSelectedJob] = useState(null)
  const [filters, setFilters] = useState({
    category: '',
    jobType: '',
    workMode: ''
  })

  useEffect(() => {
    fetchJobs()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [jobs, userLocation, distance, filters])

  const fetchJobs = async () => {
    try {
      const response = await apiFetch('/jobs')
      const data = await response.json()
      
      if (data.jobs) {
        setJobs(data.jobs.filter(job => job.is_active && job.status === 'active'))
      }
    } catch (error) {
      console.error('Error fetching jobs:', error)
    } finally {
      setLoading(false)
    }
  }

  const requestLocation = () => {
    setLocationError('')
    
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser')
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = [position.coords.latitude, position.coords.longitude]
        setUserLocation(location)
      },
      (error) => {
        switch(error.code) {
          case error.PERMISSION_DENIED:
            setLocationError('Location permission denied. Please enable location access in your browser.')
            break
          case error.POSITION_UNAVAILABLE:
            setLocationError('Location information unavailable.')
            break
          case error.TIMEOUT:
            setLocationError('Location request timed out.')
            break
          default:
            setLocationError('An unknown error occurred.')
        }
      }
    )
  }

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    // Haversine formula
    const R = 6371 // Radius of Earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLon = (lon2 - lon1) * Math.PI / 180
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c
  }

  const applyFilters = () => {
    let filtered = [...jobs]

    // Apply category filter
    if (filters.category) {
      filtered = filtered.filter(job => job.category === filters.category)
    }

    // Apply job type filter
    if (filters.jobType) {
      filtered = filtered.filter(job => job.job_type === filters.jobType)
    }

    // Apply work mode filter
    if (filters.workMode) {
      filtered = filtered.filter(job => job.work_mode === filters.workMode)
    }

    // Apply distance filter if user location is available
    if (userLocation) {
      filtered = filtered
        .map(job => {
          if (job.latitude && job.longitude) {
            const dist = calculateDistance(
              userLocation[0], userLocation[1],
              job.latitude, job.longitude
            )
            return { ...job, distance: dist }
          }
          return { ...job, distance: null }
        })
        .filter(job => job.distance === null || job.distance <= distance)
        .sort((a, b) => {
          if (a.distance === null) return 1
          if (b.distance === null) return -1
          return a.distance - b.distance
        })
    }

    setFilteredJobs(filtered)
  }

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const resetFilters = () => {
    setFilters({
      category: '',
      jobType: '',
      workMode: ''
    })
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
      {/* Header */}
      <div className="bg-primary text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold mb-2">Find Jobs Near You</h1>
          <p className="text-blue-100">Discover opportunities in your area using our interactive map</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Location Controls */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <button
              onClick={requestLocation}
              className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition flex items-center gap-2"
            >
              <Navigation size={20} />
              Use My Location
            </button>

            {userLocation && (
              <div className="flex items-center gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Distance Range
                  </label>
                  <select
                    value={distance}
                    onChange={(e) => setDistance(Number(e.target.value))}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value={5}>Within 5 km</option>
                    <option value={10}>Within 10 km</option>
                    <option value={25}>Within 25 km</option>
                    <option value={50}>Within 50 km</option>
                    <option value={100}>Within 100 km</option>
                  </select>
                </div>
              </div>
            )}

            {locationError && (
              <div className="flex items-start gap-2 text-red-600 bg-red-50 p-3 rounded-lg">
                <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
                <p className="text-sm">{locationError}</p>
              </div>
            )}
          </div>

          {/* Filters */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center gap-2 mb-4">
              <Filter size={20} className="text-gray-600" />
              <h3 className="font-semibold text-gray-900">Filter Jobs</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">All Categories</option>
                  <option value="Software Engineering">Software Engineering</option>
                  <option value="Web Development">Web Development</option>
                  <option value="AI/ML">AI/ML</option>
                  <option value="Data Science">Data Science</option>
                  <option value="UI/UX">UI/UX</option>
                  <option value="Marketing">Marketing</option>
                  <option value="QA">QA</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Type
                </label>
                <select
                  value={filters.jobType}
                  onChange={(e) => handleFilterChange('jobType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">All Types</option>
                  <option value="internship">Internship</option>
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Work Mode
                </label>
                <select
                  value={filters.workMode}
                  onChange={(e) => handleFilterChange('workMode', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">All Modes</option>
                  <option value="remote">Remote</option>
                  <option value="hybrid">Hybrid</option>
                  <option value="on-site">On-site</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={resetFilters}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Map and Job List */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-4" style={{ height: '600px' }}>
              <JobMap 
                jobs={filteredJobs}
                userLocation={userLocation}
                selectedJob={selectedJob}
                onJobSelect={setSelectedJob}
              />
            </div>
          </div>

          {/* Job List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-4 max-h-[600px] overflow-y-auto">
              <h3 className="font-bold text-lg mb-4">
                {filteredJobs.length} Jobs Found
              </h3>

              {filteredJobs.length === 0 ? (
                <div className="text-center py-8">
                  <Briefcase className="mx-auto text-gray-400 mb-3" size={48} />
                  <p className="text-gray-600">No jobs found in this area</p>
                  <p className="text-sm text-gray-500 mt-2">Try adjusting your filters or distance range</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredJobs.map(job => (
                    <Link
                      key={job.id}
                      to={`/jobs/${job.id}`}
                      className="block border border-gray-200 rounded-lg p-4 hover:border-primary hover:shadow-md transition"
                    >
                      <h4 className="font-semibold text-gray-900 mb-2">{job.title}</h4>
                      
                      <div className="space-y-1 text-sm text-gray-600 mb-3">
                        <div className="flex items-center">
                          <Building2 size={14} className="mr-2" />
                          {job.company_name}
                        </div>
                        
                        <div className="flex items-center">
                          <MapPin size={14} className="mr-2" />
                          {job.city || job.location}
                          {job.distance && (
                            <span className="ml-2 text-primary font-medium">
                              ({job.distance.toFixed(1)} km away)
                            </span>
                          )}
                        </div>
                        
                        {job.salary_min && (
                          <div className="flex items-center">
                            <DollarSign size={14} className="mr-2" />
                            PKR {job.salary_min?.toLocaleString()} - {job.salary_max?.toLocaleString()}
                          </div>
                        )}
                      </div>
                      
                      <a href={googleMapsSearchUrl(job)} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="inline-flex items-center text-sm font-semibold text-primary hover:text-blue-600 mb-2">Open in Google Maps →</a>
                      <div className="flex gap-2 flex-wrap">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                          {job.job_type}
                        </span>
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                          {job.work_mode}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default JobsNearMe
