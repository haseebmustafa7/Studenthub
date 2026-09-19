import express from 'express'
import { supabase, isSupabaseConfigured } from '../config/supabase.js'
import { demoStore } from '../config/demoData.js'
import { authenticate } from '../middleware/auth.js'

const router = express.Router()
const allowedPublicRoles = new Set(['student', 'company'])

const normalizeEmail = (email) => String(email || '').trim().toLowerCase()

router.post('/register', async (req, res) => {
  try {
    const {
      email, password, fullName, role = 'student', university, major, graduationYear,
      companyName, website, description, logoUrl, industry, city, country, address, phone
    } = req.body || {}
    const normalizedEmail = normalizeEmail(email)

    if (!normalizedEmail || !password || !fullName) return res.status(400).json({ error: 'Email, password and full name are required' })
    if (!/^\S+@\S+\.\S+$/.test(normalizedEmail)) return res.status(400).json({ error: 'Please provide a valid email address' })
    if (String(password).length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters' })
    if (!allowedPublicRoles.has(role)) return res.status(400).json({ error: 'Invalid account type' })
    if (role === 'company' && !String(companyName || '').trim()) return res.status(400).json({ error: 'Company name is required' })

    if (!isSupabaseConfigured) {
      if ([...demoStore.profiles.values()].some(p => p.email === normalizedEmail)) return res.status(400).json({ error: 'User already registered' })
      const id = `demo-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
      const profile = {
        user_id: id, email: normalizedEmail, password, full_name: fullName.trim(), role,
        university: university || '', major: major || '', graduation_year: graduationYear || null,
        company_name: companyName || '', company_website: website || '', company_description: description || '',
        company_logo_url: logoUrl || '', industry: industry || '', city: city || '', country: country || 'Pakistan',
        address: address || '', phone: phone || ''
      }
      demoStore.profiles.set(id, profile)
      const user = { id, email: normalizedEmail }
      const session = { access_token: `demo-token-${id}`, user }
      return res.status(201).json({ message: 'Registration successful (development demo mode)', user, session, profile })
    }

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: normalizedEmail,
      password: String(password),
      options: { data: { full_name: fullName.trim(), requested_role: role } }
    })
    if (authError) return res.status(400).json({ error: authError.message })
    if (!authData.user) return res.status(500).json({ error: 'Authentication account was not created' })

    const profile = {
      user_id: authData.user.id,
      email: normalizedEmail,
      full_name: fullName.trim(),
      role,
      university: university || '',
      major: major || '',
      graduation_year: graduationYear || null,
      company_name: role === 'company' ? (companyName || '') : null,
      company_website: role === 'company' ? (website || '') : null,
      company_description: role === 'company' ? (description || '') : null,
      company_logo_url: role === 'company' ? (logoUrl || '') : null,
      industry: role === 'company' ? (industry || '') : null,
      city: city || '',
      country: country || 'Pakistan',
      address: address || '',
      phone: phone || ''
    }

    const { error: profileError } = await supabase.from('profiles').insert(profile)
    if (profileError) {
      console.error('Profile creation error:', profileError)
      // Remove the Auth user if profile creation failed so we never leave an orphan account.
      await supabase.auth.admin.deleteUser(authData.user.id)
      return res.status(500).json({ error: 'Failed to create profile. Please try again.' })
    }

    return res.status(201).json({
      message: authData.session ? 'Registration successful' : 'Registration successful. Please confirm your email before logging in.',
      user: authData.user,
      session: authData.session,
      profile
    })
  } catch (error) {
    console.error('Registration error:', error)
    return res.status(500).json({ error: 'Registration failed' })
  }
})

router.post('/login', async (req, res) => {
  try {
    const email = normalizeEmail(req.body?.email)
    const password = req.body?.password
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' })

    if (!isSupabaseConfigured) {
      const profile = [...demoStore.profiles.values()].find(p => p.email === email && p.password === password)
      if (!profile && email === 'demo@studenthub.com' && password === 'demo123') {
        const demo = { user_id: 'demo-student', email, password, full_name: 'Demo Student', role: 'student', university: 'StudentHub Demo University', major: 'Computer Science', graduation_year: 2027 }
        demoStore.profiles.set(demo.user_id, demo)
        return res.json({ message: 'Login successful (development demo mode)', user: { id: demo.user_id, email }, session: { access_token: `demo-token-${demo.user_id}`, user: { id: demo.user_id, email } }, profile: demo })
      }
      if (!profile) return res.status(401).json({ error: 'Invalid email or password' })
      const user = { id: profile.user_id, email: profile.email }
      return res.json({ message: 'Login successful (development demo mode)', user, session: { access_token: `demo-token-${profile.user_id}`, user }, profile })
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) return res.status(401).json({ error: error.message })

    const { data: profile, error: profileError } = await supabase.from('profiles').select('*').eq('user_id', data.user.id).maybeSingle()
    if (profileError) return res.status(500).json({ error: 'Failed to load account profile' })
    if (!profile) return res.status(403).json({ error: 'Account profile is incomplete. Please contact support.' })

    return res.json({ message: 'Login successful', user: data.user, session: data.session, profile })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ error: 'Login failed' })
  }
})

router.get('/me', authenticate, async (req, res) => {
  try {
    if (!isSupabaseConfigured) {
      const profile = demoStore.profiles.get(req.user.id)
      if (!profile) return res.status(404).json({ error: 'Profile not found' })
      return res.json({ user: req.user, profile })
    }
    const { data: profile, error } = await supabase.from('profiles').select('*').eq('user_id', req.user.id).maybeSingle()
    if (error) throw error
    if (!profile) return res.status(404).json({ error: 'Profile not found' })
    return res.json({ user: req.user, profile })
  } catch (error) {
    console.error('Get user error:', error)
    res.status(500).json({ error: 'Failed to get user data' })
  }
})

router.post('/logout', authenticate, async (req, res) => {
  // Supabase access tokens are stateless; the browser must clear its session.
  // We intentionally do not invalidate every session for the user from a server route.
  return res.json({ message: 'Logout successful' })
})

export default router
