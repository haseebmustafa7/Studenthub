import express from 'express'
import { supabase, isSupabaseConfigured } from '../config/supabase.js'
import { demoCounselors, demoStore } from '../config/demoData.js'
import { authenticate, requireStudent } from '../middleware/auth.js'

const router = express.Router()
const DAY_NAMES = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']

const normalizeCounselor = counselor => ({
  ...counselor,
  title: counselor.title || counselor.professional_title || '',
  specializations: counselor.specializations || counselor.expertise || [],
  years_of_experience: counselor.years_of_experience ?? counselor.experience_years ?? 0,
  availability: counselor.availability || {}
})

const getDemoSessions = () => demoStore.sessions || new Map()

const getCounselor = async id => {
  if (!isSupabaseConfigured) return demoCounselors.find(c => c.id === id) || null
  const { data, error } = await supabase.from('counselors').select('*').eq('id', id).eq('is_verified', true).maybeSingle()
  if (error) throw error
  return data ? normalizeCounselor(data) : null
}

const getAvailabilityForDate = (counselor, dateString) => {
  const date = new Date(`${dateString}T12:00:00`)
  const day = DAY_NAMES[date.getDay()]
  const raw = counselor?.availability?.[day] || counselor?.availability?.[day.slice(0, 3)] || []
  return Array.isArray(raw) ? raw : []
}

const slotIsAvailable = (counselor, dateString, timeString) => {
  const requested = String(timeString).slice(0, 5)
  return getAvailabilityForDate(counselor, dateString).some(range => {
    const match = String(range).match(/^(\d{2}:\d{2})-(\d{2}:\d{2})$/)
    if (!match) return false
    return requested >= match[1] && requested < match[2]
  })
}

router.get('/counselors', async (req, res) => {
  try {
    if (!isSupabaseConfigured) {
      let counselors = demoCounselors.filter(c => c.is_verified !== false && c.is_available !== false).map(normalizeCounselor)
      if (req.query.expertise) counselors = counselors.filter(c => c.specializations.some(s => s.toLowerCase() === String(req.query.expertise).toLowerCase()))
      return res.json({ counselors })
    }
    let query = supabase.from('counselors').select('*').eq('is_verified', true).eq('is_available', true).order('total_sessions', { ascending: false })
    if (req.query.expertise) query = query.contains('specializations', [req.query.expertise])
    const { data, error } = await query
    if (error) throw error
    return res.json({ counselors: (data || []).map(normalizeCounselor) })
  } catch (error) {
    console.error('Error fetching counselors:', error)
    return res.status(500).json({ error: 'Failed to fetch counselors' })
  }
})

router.get('/counselors/:id', async (req, res) => {
  try {
    const counselor = await getCounselor(req.params.id)
    if (!counselor) return res.status(404).json({ error: 'Counselor not found' })
    return res.json({ counselor: normalizeCounselor(counselor) })
  } catch (error) {
    console.error('Error fetching counselor:', error)
    return res.status(500).json({ error: 'Failed to fetch counselor details' })
  }
})

router.post('/sessions', authenticate, requireStudent, async (req, res) => {
  try {
    const { counselor_id, scheduled_at, duration = 60, session_type = 'video', notes = '', consent_data_sharing = false } = req.body || {}
    if (!counselor_id || !scheduled_at) return res.status(400).json({ error: 'counselor_id and scheduled_at are required' })
    if (!['video', 'phone', 'in_person'].includes(session_type)) return res.status(400).json({ error: 'Invalid session type' })
    const scheduledDate = new Date(scheduled_at)
    if (Number.isNaN(scheduledDate.getTime()) || scheduledDate <= new Date()) return res.status(400).json({ error: 'Please select a future session time' })

    const counselor = await getCounselor(counselor_id)
    if (!counselor) return res.status(404).json({ error: 'Counselor not found' })

    const date = scheduled_at.slice(0, 10)
    const time = scheduled_at.slice(11, 16)
    if (!slotIsAvailable(counselor, date, time)) return res.status(400).json({ error: 'Counselor is not available at this time' })

    if (!isSupabaseConfigured) {
      const sessions = getDemoSessions()
      const duplicate = [...sessions.values()].find(s => s.counselor_id === counselor_id && s.scheduled_at === scheduled_at && ['scheduled', 'confirmed'].includes(s.status))
      if (duplicate) return res.status(400).json({ error: 'This time slot is already booked' })
      const session = { id: `demo-session-${Date.now()}`, user_id: req.user.id, counselor_id, scheduled_at, duration: Number(duration) || 60, session_type, notes: String(notes).slice(0, 3000), consent_data_sharing: Boolean(consent_data_sharing), status: 'scheduled', rating: null, feedback: '', feedback_given: false, created_at: new Date().toISOString() }
      sessions.set(session.id, session)
      demoStore.sessions = sessions
      return res.status(201).json({ session, message: 'Counseling session booked successfully (demo mode)' })
    }

    const { data: existing, error: existingError } = await supabase.from('counseling_sessions').select('id').eq('counselor_id', counselor_id).eq('scheduled_at', scheduled_at).in('status', ['scheduled', 'confirmed']).maybeSingle()
    if (existingError) throw existingError
    if (existing) return res.status(400).json({ error: 'This time slot is already booked' })

    const { data: session, error } = await supabase.from('counseling_sessions').insert({ user_id: req.user.id, counselor_id, scheduled_at, duration: Number(duration) || 60, session_type, notes: String(notes).slice(0, 3000), consent_data_sharing: Boolean(consent_data_sharing), status: 'scheduled' }).select().single()
    if (error) throw error
    return res.status(201).json({ session, message: 'Counseling session booked successfully' })
  } catch (error) {
    console.error('Error creating session:', error)
    return res.status(500).json({ error: 'Failed to book counseling session' })
  }
})

router.get('/sessions', authenticate, requireStudent, async (req, res) => {
  try {
    if (!isSupabaseConfigured) {
      const sessions = [...getDemoSessions().values()].filter(s => s.user_id === req.user.id).sort((a, b) => new Date(b.scheduled_at) - new Date(a.scheduled_at)).map(s => ({ ...s, counselor: normalizeCounselor(demoCounselors.find(c => c.id === s.counselor_id) || {}) }))
      return res.json({ sessions })
    }
    let query = supabase.from('counseling_sessions').select('*, counselors (full_name, title, photo_url, specializations)').eq('user_id', req.user.id).order('scheduled_at', { ascending: false })
    if (req.query.status) query = query.eq('status', req.query.status)
    const { data, error } = await query
    if (error) throw error
    return res.json({ sessions: data || [] })
  } catch (error) {
    console.error('Error fetching sessions:', error)
    return res.status(500).json({ error: 'Failed to fetch counseling sessions' })
  }
})

router.get('/sessions/:id', authenticate, requireStudent, async (req, res) => {
  try {
    if (!isSupabaseConfigured) {
      const session = getDemoSessions().get(req.params.id)
      if (!session || session.user_id !== req.user.id) return res.status(404).json({ error: 'Session not found' })
      return res.json({ session: { ...session, counselor: normalizeCounselor(demoCounselors.find(c => c.id === session.counselor_id) || {}) } })
    }
    const { data, error } = await supabase.from('counseling_sessions').select('*, counselors (full_name, title, photo_url, bio, specializations)').eq('id', req.params.id).eq('user_id', req.user.id).maybeSingle()
    if (error) throw error
    if (!data) return res.status(404).json({ error: 'Session not found' })
    return res.json({ session: data })
  } catch (error) {
    console.error('Error fetching session:', error)
    return res.status(500).json({ error: 'Failed to fetch session details' })
  }
})

router.patch('/sessions/:id', authenticate, requireStudent, async (req, res) => {
  try {
    if (req.body?.status !== 'cancelled') return res.status(400).json({ error: 'Students can only cancel sessions' })
    if (!isSupabaseConfigured) {
      const session = getDemoSessions().get(req.params.id)
      if (!session || session.user_id !== req.user.id) return res.status(404).json({ error: 'Session not found' })
      session.status = 'cancelled'
      session.updated_at = new Date().toISOString()
      getDemoSessions().set(session.id, session)
      return res.json({ session, message: 'Session cancelled successfully' })
    }
    const { data, error } = await supabase.from('counseling_sessions').update({ status: 'cancelled', updated_at: new Date().toISOString() }).eq('id', req.params.id).eq('user_id', req.user.id).in('status', ['scheduled', 'confirmed']).select().maybeSingle()
    if (error) throw error
    if (!data) return res.status(404).json({ error: 'Session not found or already cancelled' })
    return res.json({ session: data, message: 'Session cancelled successfully' })
  } catch (error) {
    console.error('Error updating session:', error)
    return res.status(500).json({ error: 'Failed to cancel session' })
  }
})

router.post('/sessions/:id/feedback', authenticate, requireStudent, async (req, res) => {
  try {
    const rating = Number(req.body?.rating)
    const feedback = String(req.body?.feedback || req.body?.comments || '').slice(0, 3000)
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) return res.status(400).json({ error: 'Rating must be between 1 and 5' })
    if (!isSupabaseConfigured) {
      const session = getDemoSessions().get(req.params.id)
      if (!session || session.user_id !== req.user.id) return res.status(404).json({ error: 'Session not found' })
      if (session.status !== 'completed') return res.status(400).json({ error: 'Can only provide feedback for completed sessions' })
      session.rating = rating; session.feedback = feedback; session.feedback_given = true; session.updated_at = new Date().toISOString()
      getDemoSessions().set(session.id, session)
      return res.json({ session, message: 'Feedback submitted successfully' })
    }
    const { data: existing, error: checkError } = await supabase.from('counseling_sessions').select('status').eq('id', req.params.id).eq('user_id', req.user.id).maybeSingle()
    if (checkError) throw checkError
    if (!existing) return res.status(404).json({ error: 'Session not found' })
    if (existing.status !== 'completed') return res.status(400).json({ error: 'Can only provide feedback for completed sessions' })
    const { data, error } = await supabase.from('counseling_sessions').update({ rating, feedback, feedback_given: true, updated_at: new Date().toISOString() }).eq('id', req.params.id).eq('user_id', req.user.id).select().single()
    if (error) throw error
    return res.json({ session: data, message: 'Feedback submitted successfully' })
  } catch (error) {
    console.error('Error submitting feedback:', error)
    return res.status(500).json({ error: 'Failed to submit feedback' })
  }
})

router.get('/available-slots', async (req, res) => {
  try {
    const { counselor_id, date } = req.query
    if (!counselor_id || !date) return res.status(400).json({ error: 'counselor_id and date are required' })
    const counselor = await getCounselor(counselor_id)
    if (!counselor) return res.status(404).json({ error: 'Counselor not found' })
    const ranges = getAvailabilityForDate(counselor, date)
    const booked = new Set()

    if (isSupabaseConfigured) {
      const start = `${date}T00:00:00`
      const end = `${date}T23:59:59`
      const { data, error } = await supabase.from('counseling_sessions').select('scheduled_at').eq('counselor_id', counselor_id).gte('scheduled_at', start).lte('scheduled_at', end).in('status', ['scheduled', 'confirmed'])
      if (error) throw error
      ;(data || []).forEach(session => booked.add(new Date(session.scheduled_at).toISOString().slice(11, 16)))
    } else {
      ;[...getDemoSessions().values()].filter(s => s.counselor_id === counselor_id && s.scheduled_at.startsWith(date) && ['scheduled', 'confirmed'].includes(s.status)).forEach(s => booked.add(s.scheduled_at.slice(11, 16)))
    }

    const availableSlots = []
    ranges.forEach(range => {
      const match = String(range).match(/^(\d{2}):(\d{2})-(\d{2}):(\d{2})$/)
      if (!match) return
      let hour = Number(match[1])
      const endHour = Number(match[3])
      while (hour < endHour) {
        const time = `${String(hour).padStart(2, '0')}:00`
        if (!booked.has(time)) availableSlots.push({ time: `${time}:00`, display: `${hour % 12 || 12}:00 ${hour < 12 ? 'AM' : 'PM'}` })
        hour += 1
      }
    })
    return res.json({ availableSlots })
  } catch (error) {
    console.error('Error fetching available slots:', error)
    return res.status(500).json({ error: 'Failed to fetch available slots' })
  }
})

export default router
