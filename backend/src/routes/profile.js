import express from 'express'
import { supabase, isSupabaseConfigured } from '../config/supabase.js'
import { demoStore } from '../config/demoData.js'
import { authenticate } from '../middleware/auth.js'

const router = express.Router()

// Get user profile
router.get('/', authenticate, async (req, res) => {
  try {
    if (!isSupabaseConfigured) {
      const profile = demoStore.profiles.get(req.user.id)
      return profile ? res.json(profile) : res.status(404).json({ error: 'Profile not found' })
    }
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', req.user.id)
      .single()

    if (error || !profile) {
      return res.status(404).json({ error: 'Profile not found' })
    }

    res.json(profile)
  } catch (error) {
    console.error('Get profile error:', error)
    res.status(500).json({ error: 'Failed to fetch profile' })
  }
})

// Update user profile
router.put('/', authenticate, async (req, res) => {
  try {
    if (!isSupabaseConfigured) {
      const profile = demoStore.profiles.get(req.user.id)
      if (!profile) return res.status(404).json({ error: 'Profile not found' })
      const body = req.body || {}
      const map = { fullName: 'full_name', university: 'university', major: 'major', graduationYear: 'graduation_year', phone: 'phone', location: 'location', bio: 'bio', resumeUrl: 'resume_url' }
      for (const [input, key] of Object.entries(map)) if (body[input] !== undefined) profile[key] = body[input]
      demoStore.profiles.set(req.user.id, profile)
      return res.json({ message: 'Profile updated successfully (demo mode)', profile })
    }
    const {
      fullName,
      university,
      major,
      graduationYear,
      phone,
      location,
      bio,
      resumeUrl
    } = req.body

    const updates = {}
    if (fullName !== undefined) updates.full_name = fullName
    if (university !== undefined) updates.university = university
    if (major !== undefined) updates.major = major
    if (graduationYear !== undefined) updates.graduation_year = graduationYear
    if (phone !== undefined) updates.phone = phone
    if (location !== undefined) updates.location = location
    if (bio !== undefined) updates.bio = bio
    if (resumeUrl !== undefined) updates.resume_url = resumeUrl

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('user_id', req.user.id)
      .select()
      .single()

    if (error) {
      return res.status(500).json({ error: error.message })
    }

    res.json({
      message: 'Profile updated successfully',
      profile: data
    })
  } catch (error) {
    console.error('Update profile error:', error)
    res.status(500).json({ error: 'Failed to update profile' })
  }
})

export default router
