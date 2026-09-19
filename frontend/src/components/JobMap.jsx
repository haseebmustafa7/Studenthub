import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { MapPin, Briefcase, DollarSign, Building2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { googleMapsSearchUrl } from '../lib/googleMaps'

// Fix for default marker icons in Leaflet with Webpack/Vite
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

// Component to update map center when user location changes
function MapUpdater({ center }) {
  const map = useMap()
  
  useEffect(() => {
    if (center) {
      map.setView(center, 11)
    }
  }, [center, map])
  
  return null
}

const JobMap = ({ jobs, userLocation, selectedJob, onJobSelect }) => {
  // Default center (Pakistan)
  const defaultCenter = [30.3753, 69.3451]
  const mapCenter = userLocation || defaultCenter
  const zoom = userLocation ? 11 : 6

  return (
    <div className="w-full h-full rounded-lg overflow-hidden shadow-lg">
      <MapContainer
        center={mapCenter}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapUpdater center={userLocation} />

        {/* User location marker */}
        {userLocation && (
          <Marker position={userLocation} icon={L.icon({
            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
          })}>
            <Popup>
              <div className="p-2">
                <p className="font-semibold">Your Location</p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Job markers */}
        {jobs
          .filter(job => job.latitude && job.longitude)
          .map(job => (
            <Marker
              key={job.id}
              position={[job.latitude, job.longitude]}
              icon={L.icon({
                iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41]
              })}
              eventHandlers={{
                click: () => onJobSelect && onJobSelect(job)
              }}
            >
              <Popup maxWidth={300}>
                <div className="p-3">
                  <h3 className="font-bold text-lg mb-2">{job.title}</h3>
                  
                  <div className="space-y-2 mb-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <Building2 size={16} className="mr-2" />
                      {job.company_name}
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin size={16} className="mr-2" />
                      {job.city}, {job.country}
                    </div>
                    
                    {job.salary_min && (
                      <div className="flex items-center text-sm text-gray-600">
                        <DollarSign size={16} className="mr-2" />
                        PKR {job.salary_min?.toLocaleString()} - {job.salary_max?.toLocaleString()}
                      </div>
                    )}
                    
                    <div className="flex gap-2 flex-wrap">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                        {job.job_type}
                      </span>
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                        {job.work_mode}
                      </span>
                    </div>
                  </div>
                  
                  <Link
                    to={`/jobs/${job.id}`}
                    className="block w-full bg-primary text-white text-center py-2 rounded-lg hover:bg-blue-600 transition text-sm font-semibold"
                  >
                    View Details
                  </Link>
                  <a
                    href={googleMapsSearchUrl(job)}
                    target="_blank"
                    rel="noreferrer"
                    className="block w-full mt-2 border border-gray-300 text-gray-700 text-center py-2 rounded-lg hover:bg-gray-50 transition text-sm font-semibold"
                  >
                    Open in Google Maps
                  </a>
                </div>
              </Popup>
            </Marker>
          ))}
      </MapContainer>
    </div>
  )
}

export default JobMap
