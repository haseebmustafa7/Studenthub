import express from 'express'
import { supabase, isSupabaseConfigured } from '../config/supabase.js'
import { demoJobs, demoStore } from '../config/demoData.js'
import { authenticate, requireStudent, requireCompany } from '../middleware/auth.js'

const router = express.Router()

// Apply for a job
router.post('/', authenticate, requireStudent, async (req, res) => {
  try {
    if (!isSupabaseConfigured) {
      const { jobId, coverLetter, resumeUrl } = req.body || {}
      if (!jobId) return res.status(400).json({ error: 'Job ID is required' })
      const job = demoJobs.find(j => j.id === jobId)
      if (!job || job.is_active !== true || job.status !== 'active') return res.status(404).json({ error: 'This job is no longer accepting applications' })
      if (!demoStore.applications) demoStore.applications = new Map()
      const duplicate = [...demoStore.applications.values()].find(a => a.user_id === req.user.id && a.job_id === jobId)
      if (duplicate) return res.status(400).json({ error: 'You have already applied to this job' })
      const application = { id: `demo-application-${Date.now()}`, job_id: jobId, user_id: req.user.id, cover_letter: coverLetter || '', resume_url: resumeUrl || '', status: 'pending', applied_at: new Date().toISOString() }
      demoStore.applications.set(application.id, application)
      return res.status(201).json({ message: 'Application submitted successfully (demo mode)', application })
    }
    const { jobId, coverLetter, resumeUrl } = req.body || {}

    if (!jobId) {
      return res.status(400).json({ error: 'Job ID is required' })
    }

    const { data: job, error: jobError } = await supabase
      .from('jobs')
      .select('id, is_active, status')
      .eq('id', jobId)
      .maybeSingle()
    if (jobError) throw jobError
    if (!job || job.is_active !== true || job.status !== 'active') {
      return res.status(404).json({ error: 'This job is no longer accepting applications' })
    }

    // Check if already applied
    const { data: existing, error: existingError } = await supabase
      .from('applications')
      .select('id')
      .eq('job_id', jobId)
      .eq('user_id', req.user.id)
      .maybeSingle()
    if (existingError) throw existingError

    if (existing) {
      return res.status(400).json({ error: 'You have already applied to this job' })
    }

    // Create application
    const { data, error } = await supabase
      .from('applications')
      .insert({
        job_id: jobId,
        user_id: req.user.id,
        cover_letter: coverLetter || '',
        resume_url: resumeUrl || '',
        status: 'pending'
      })
      .select()
      .single()

    if (error) {
      if (error.code === '23505') return res.status(400).json({ error: 'You have already applied to this job' })
      return res.status(500).json({ error: error.message })
    }

    res.status(201).json({
      message: 'Application submitted successfully',
      application: data
    })
  } catch (error) {
    console.error('Apply error:', error)
    res.status(500).json({ error: 'Failed to submit application' })
  }
})


// Get applications for jobs owned by the authenticated company.
router.get('/company', authenticate, requireCompany, async (req, res) => {
  try {
    if (!isSupabaseConfigured) {
      const ownedJobIds = new Set(demoJobs.filter(j => j.company_id === req.user.id || j.created_by === req.user.id).map(j => j.id))
      const applications = [...(demoStore.applications?.values?.() || [])]
        .filter(a => ownedJobIds.has(a.job_id))
        .map(a => ({
          ...a,
          jobs: demoJobs.find(j => j.id === a.job_id) || null,
          profiles: demoStore.profiles.get(a.user_id) || null
        }))
      return res.json({ applications })
    }

    const { data: jobs, error: jobsError } = await supabase
      .from('jobs')
      .select('id')
      .eq('company_id', req.user.id)
    if (jobsError) throw jobsError

    const jobIds = (jobs || []).map(job => job.id)
    if (!jobIds.length) return res.json({ applications: [] })

    const { data: applications, error } = await supabase
      .from('applications')
      .select(`*, jobs (*), profiles (*)`)
      .in('job_id', jobIds)
      .order('applied_at', { ascending: false })
    if (error) throw error

    return res.json({ applications: applications || [] })
  } catch (error) {
    console.error('Get company applications error:', error)
    return res.status(500).json({ error: 'Failed to fetch company applications' })
  }
})

// Get user's applications
router.get('/', authenticate, requireStudent, async (req, res) => {
  try {
    if (!isSupabaseConfigured) return res.json([...(demoStore.applications?.values?.() || [])].filter(a => a.user_id === req.user.id))
    const { data: applications, error } = await supabase
      .from('applications')
      .select(`
        *,
        jobs (*)
      `)
      .eq('user_id', req.user.id)
      .order('applied_at', { ascending: false })

    if (error) {
      return res.status(500).json({ error: error.message })
    }

    res.json(applications)
  } catch (error) {
    console.error('Get applications error:', error)
    res.status(500).json({ error: 'Failed to fetch applications' })
  }
})

// Get single application
router.get('/:id', authenticate, requireStudent, async (req, res) => {
  try {
    const { id } = req.params
    if (!isSupabaseConfigured) {
      const application = demoStore.applications?.get?.(id)
      return application && application.user_id === req.user.id ? res.json(application) : res.status(404).json({ error: 'Application not found' })
    }

    const { data: application, error } = await supabase
      .from('applications')
      .select(`
        *,
        jobs (*)
      `)
      .eq('id', id)
      .eq('user_id', req.user.id)
      .single()

    if (error || !application) {
      return res.status(404).json({ error: 'Application not found' })
    }

    res.json(application)
  } catch (error) {
    console.error('Get application error:', error)
    res.status(500).json({ error: 'Failed to fetch application' })
  }
})

export default router
