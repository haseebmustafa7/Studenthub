import { createContext, useContext, useState, useEffect } from 'react'
import { supabase, isSupabaseConfigured } from '../config/supabase'
import { API_URL } from '../lib/api'

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [session, setSession] = useState(null)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) {
        void fetchProfile(session.user.id)
      } else {
        setLoading(false)
      }
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) {
        void fetchProfile(session.user.id)
      } else {
        setProfile(null)
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const fetchProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (error) throw error
      setProfile(data)
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (email, password, userData) => {
    // In production, create both the Auth user and profile on the server.
    // The server uses the Supabase service role key and therefore does not
    // depend on a client session that may not exist when email confirmation is enabled.
    if (isSupabaseConfigured) {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          fullName: userData.fullName,
          role: userData.role || 'student',
          university: userData.university,
          major: userData.major,
          graduationYear: userData.graduationYear,
          companyName: userData.companyName,
          website: userData.website,
          description: userData.description,
          logoUrl: userData.logoUrl,
          industry: userData.industry,
          city: userData.city,
          country: userData.country,
          address: userData.address,
          phone: userData.phone,
        })
      })
      const result = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(result.error || 'Registration failed')

      if (result.session) {
        const { error: sessionError } = await supabase.auth.setSession(result.session)
        if (sessionError) throw sessionError
        setSession(result.session)
        setUser(result.session.user)
        setProfile(result.profile || null)
      }
      return result
    }

    // Development-only local demo mode.
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${window.location.origin}/dashboard`, data: { full_name: userData.fullName } }
    })
    if (error) throw error
    if (data.user) {
      const profileData = {
        user_id: data.user.id,
        email,
        full_name: userData.fullName,
        role: userData.role || 'student',
        password,
        ...(userData.role === 'student' || !userData.role ? {
          university: userData.university || '',
          major: userData.major || '',
          graduation_year: userData.graduationYear || null,
        } : {}),
        ...(userData.role === 'company' ? {
          company_name: userData.companyName || '',
          company_website: userData.website || '',
          company_description: userData.description || '',
          company_logo_url: userData.logoUrl || '',
          industry: userData.industry || '',
          city: userData.city || '',
          country: userData.country || 'Pakistan',
          address: userData.address || '',
          phone: userData.phone || '',
        } : {}),
      }
      const { error: profileError } = await supabase.from('profiles').insert(profileData)
      if (profileError) throw new Error(`Profile creation failed: ${profileError.message}`)
      setProfile(profileData)
    }
    return data
  }

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error
    return data
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    setUser(null)
    setProfile(null)
    setSession(null)
  }

  const value = {
    user,
    profile,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    isAdmin: profile?.role === 'admin',
    isCompany: profile?.role === 'company',
    isStudent: profile?.role === 'student',
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
