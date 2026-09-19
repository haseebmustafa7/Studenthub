import { supabase, isSupabaseConfigured } from '../config/supabase.js'
import { demoStore } from '../config/demoData.js'

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) return res.status(401).json({ error: 'Authentication required' })
    const token = authHeader.slice(7).trim()
    if (!token) return res.status(401).json({ error: 'Authentication required' })

    if (!isSupabaseConfigured) {
      if (!token.startsWith('demo-token-')) return res.status(401).json({ error: 'Development authentication token is invalid' })
      const id = token.replace('demo-token-', '')
      const profile = demoStore.profiles.get(id)
      if (!profile) return res.status(401).json({ error: 'Development session is invalid' })
      req.user = { id, email: profile.email }
      req.profile = profile
      return next()
    }

    const { data: { user }, error } = await supabase.auth.getUser(token)
    if (error || !user) return res.status(401).json({ error: 'Invalid or expired token' })
    req.user = user
    next()
  } catch (error) {
    console.error('Authentication error:', error)
    return res.status(401).json({ error: 'Authentication failed' })
  }
}

const getProfile = async (userId) => {
  if (!isSupabaseConfigured) return demoStore.profiles.get(userId) || null
  const { data, error } = await supabase.from('profiles').select('*').eq('user_id', userId).maybeSingle()
  if (error) throw error
  return data
}

export const requireRole = (...roles) => async (req, res, next) => {
  try {
    const profile = await getProfile(req.user.id)
    if (!profile || !roles.includes(profile.role)) return res.status(403).json({ error: 'You do not have permission to perform this action' })
    req.profile = profile
    next()
  } catch (error) {
    console.error('Role check error:', error)
    return res.status(403).json({ error: 'Unable to verify account permissions' })
  }
}

export const requireAdmin = requireRole('admin')
export const requireCompany = requireRole('company')
export const requireStudent = requireRole('student')
