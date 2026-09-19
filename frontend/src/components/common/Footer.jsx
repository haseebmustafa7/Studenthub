import { Link } from 'react-router-dom'
import { Mail, MapPin, Phone } from 'lucide-react'
import { Logo } from '../branding/Logo'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="mb-4"><Logo to="/" size={42} dark /></div>
            <p className="text-sm">
              Turning career uncertainty into an actionable career path with AI-powered guidance.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-primary transition">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/jobs" className="hover:text-primary transition">
                  Browse Jobs
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-primary transition">
                  Sign Up
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-primary transition">
                  Login
                </Link>
              </li>
            </ul>
          </div>

          {/* For Students */}
          <div>
            <h3 className="text-white font-semibold mb-4">For Students</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/jobs?jobType=internship" className="hover:text-primary transition">
                  Internships
                </Link>
              </li>
              <li>
                <Link to="/jobs?jobType=full-time" className="hover:text-primary transition">
                  Full-time Jobs
                </Link>
              </li>
              <li>
                <Link to="/jobs?jobType=part-time" className="hover:text-primary transition">
                  Part-time Jobs
                </Link>
              </li>
              <li>
                <Link to="/jobs?workMode=remote" className="hover:text-primary transition">
                  Remote Jobs
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center space-x-2">
                <Mail size={16} />
                <span>support@studenthub.com</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone size={16} />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center space-x-2">
                <MapPin size={16} />
                <span>123 University Ave</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center">
          <p>&copy; {currentYear} StudentHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
