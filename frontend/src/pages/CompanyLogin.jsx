import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { apiFetch } from '../lib/api'
import { Building2, Mail, Lock, AlertCircle } from 'lucide-react'
import { Logo } from '../components/branding/Logo'

const CompanyLogin = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { signIn } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { session } = await signIn(email, password)
      
      if (!session) {
        setError('Login failed. If you just registered, please check your email to confirm your account first.')
        setLoading(false)
        return
      }
      
      if (session) {
        // Get user profile to check role
        const response = await apiFetch('/auth/me')
        
        if (response.ok) {
          const data = await response.json()
          
          // Verify it's actually a company account
          if (data.profile?.role !== 'company') {
            setError('This is not a company account. Please use the student or admin login.')
            setLoading(false)
            return
          }
          
          navigate('/company/dashboard')
        } else {
          setError('Failed to load profile. Please try again.')
        }
      }
    } catch (err) {
      console.error('Login error:', err)
      if (err.message?.includes('Email not confirmed')) {
        setError('Please confirm your email address before logging in. Check your inbox for a confirmation link.')
      } else if (err.message?.includes('Invalid login credentials')) {
        setError('Invalid email or password. Please try again.')
      } else {
        setError(err.message || 'Failed to login. Please check your credentials.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Logo to="/" size={54} compact />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Company Login</h2>
          <p className="mt-2 text-gray-600">Sign in to your company account</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-lg shadow-xl p-8">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
              <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Company Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="text-gray-400" size={20} />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="hr@company.com"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="text-gray-400" size={20} />
                </div>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Don't have a company account?</span>
              </div>
            </div>
          </div>

          {/* Sign Up Link */}
          <div className="mt-6 text-center space-y-2">
            <Link
              to="/company/register"
              className="block text-primary hover:text-blue-600 font-medium"
            >
              Register your company
            </Link>
            <Link
              to="/login"
              className="block text-gray-600 hover:text-gray-800 text-sm"
            >
              Student login instead
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CompanyLogin
