import express from 'express'
import { supabase, isSupabaseConfigured } from '../config/supabase.js'
import { demoJobs } from '../config/demoData.js'
import { authenticate, requireCompany } from '../middleware/auth.js'

const router = express.Router()

// Get all active jobs with filters
router.get('/', async (req, res) => {
  try {
    if (!isSupabaseConfigured) {
      const { search, jobType, workMode, category, location, page = 1, limit = 12 } = req.query
      let jobs = [...demoJobs]
      if (req.query.company_id) {
        const token = req.headers.authorization?.startsWith('Bearer ') ? req.headers.authorization.slice(7).trim() : ''
        if (!token.startsWith('demo-token-')) return res.status(401).json({ error: 'Authentication required' })
        const ownerId = token.replace('demo-token-', '')
        if (ownerId !== String(req.query.company_id)) return res.status(403).json({ error: 'You can only view your own company jobs' })
        jobs = jobs.filter(j => j.company_id === ownerId || j.created_by === ownerId)
      } else {
        jobs = jobs.filter(j => j.is_active === true && j.status === 'active')
      }
      if (search) jobs = jobs.filter(j => `${j.title} ${j.company_name} ${j.description}`.toLowerCase().includes(String(search).toLowerCase()))
      if (jobType) jobs = jobs.filter(j => j.job_type === jobType)
      if (workMode) jobs = jobs.filter(j => j.work_mode === workMode)
      if (category) jobs = jobs.filter(j => j.category === category)
      if (location) jobs = jobs.filter(j => `${j.location} ${j.city}`.toLowerCase().includes(String(location).toLowerCase()))
      const total = jobs.length; const from = (Number(page) - 1) * Number(limit); jobs = jobs.slice(from, from + Number(limit))
      return res.json({ jobs, pagination: { total, page: Number(page), limit: Number(limit), totalPages: Math.ceil(total / Number(limit)) } })
    }
    const { 
      search, 
      jobType, 
      workMode, 
      category, 
      location,
      company_id,
      page = 1, 
      limit = 12 
    } = req.query

    let query = supabase
      .from('jobs')
      .select('*', { count: 'exact' })

    // If company_id is provided, show all jobs for that company (including pending)
    // Otherwise, only show active approved jobs
    if (company_id) {
      // Company dashboards may only inspect their own jobs. Public callers must not
      // be able to use this parameter to enumerate another company's private jobs.
      if (!req.headers.authorization) return res.status(401).json({ error: 'Authentication required' })
      // Verify the bearer token and ownership before returning non-public jobs.
      const authHeader = req.headers.authorization
      const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : ''
      if (!token) return res.status(401).json({ error: 'Authentication required' })
      let ownerId
      if (!isSupabaseConfigured && token.startsWith('demo-token-')) ownerId = token.replace('demo-token-', '')
      else if (isSupabaseConfigured) {
        const { data: { user }, error: authError } = await supabase.auth.getUser(token)
        if (authError || !user) return res.status(401).json({ error: 'Invalid or expired token' })
        ownerId = user.id
      }
      if (ownerId !== company_id) return res.status(403).json({ error: 'You can only view your own company jobs' })
      query = query.eq('company_id', company_id)
    } else {
      query = query.eq('is_active', true).eq('status', 'active')
    }

    query = query.order('created_at', { ascending: false })

    // Apply filters
    if (search) {
      query = query.or(`title.ilike.%${search}%,company_name.ilike.%${search}%,description.ilike.%${search}%`)
    }

    if (jobType) {
      query = query.eq('job_type', jobType)
    }

    if (workMode) {
      query = query.eq('work_mode', workMode)
    }

    if (category) {
      query = query.eq('category', category)
    }

    if (location) {
      query = query.or(`location.ilike.%${location}%,city.ilike.%${location}%`)
    }

    // Pagination
    const from = (page - 1) * limit
    const to = from + limit - 1
    query = query.range(from, to)

    const { data: jobs, error, count } = await query

    if (error) {
      return res.status(500).json({ error: error.message })
    }

    res.json({
      jobs,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit)
      }
    })
  } catch (error) {
    console.error('Get jobs error:', error)
    res.status(500).json({ error: 'Failed to fetch jobs' })
  }
})

// Get job categories
router.get('/meta/categories', async (req, res) => {
  try {
    if (!isSupabaseConfigured) return res.json([...new Set(demoJobs.map(j => j.category))])
    const { data: jobs, error } = await supabase
      .from('jobs')
      .select('category')
      .eq('is_active', true)

    if (error) {
      return res.status(500).json({ error: error.message })
    }

    const categories = [...new Set(jobs.map(job => job.category).filter(Boolean))]
    
    res.json(categories)
  } catch (error) {
    console.error('Get categories error:', error)
    res.status(500).json({ error: 'Failed to fetch categories' })
  }
})


// Get single job
router.get('/:id', async (req, res) => {
  try {
    if (!isSupabaseConfigured) { const job = demoJobs.find(j => j.id === req.params.id); return job ? res.json(job) : res.status(404).json({ error: 'Job not found' }) }
    const { id } = req.params

    const { data: job, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('id', id)
      .maybeSingle()

    if (error || !job) return res.status(404).json({ error: 'Job not found' })

    // Only approved active jobs are public. Pending/paused/rejected jobs are
    // visible to their owning company or an admin after authentication.
    if (!(job.is_active === true && job.status === 'active')) {
      const authHeader = req.headers.authorization
      if (!authHeader?.startsWith('Bearer ')) return res.status(404).json({ error: 'Job not found' })
      const token = authHeader.slice(7).trim()
      const { data: { user }, error: authError } = await supabase.auth.getUser(token)
      if (authError || !user) return res.status(404).json({ error: 'Job not found' })
      if (job.company_id !== user.id) {
        const { data: adminProfile } = await supabase.from('profiles').select('role').eq('user_id', user.id).maybeSingle()
        if (adminProfile?.role !== 'admin') return res.status(404).json({ error: 'Job not found' })
      }
    }

    res.json(job)
  } catch (error) {
    console.error('Get job error:', error)
    res.status(500).json({ error: 'Failed to fetch job' })
  }
})

// Company job creation. Ownership is always derived from the authenticated account.
router.post('/', authenticate, requireCompany, async (req, res) => {
  try {
    const body = req.body || {}
    if (!String(body.title || '').trim() || !String(body.description || '').trim()) return res.status(400).json({ error: 'Job title and description are required' })
    if (!isSupabaseConfigured) {
      const job = { ...body, id: `demo-company-job-${Date.now()}`, company_id: req.user.id, created_by: req.user.id, is_active: false, status: 'pending', company_name: req.profile.company_name || req.profile.full_name, created_at: new Date().toISOString() }
      demoJobs.push(job)
      return res.status(201).json({ message: 'Job submitted for approval (demo mode)', job })
    }
    const payload = {
      title: String(body.title).trim(), company_name: req.profile.company_name || req.profile.full_name,
      company_logo_url: body.companyLogoUrl || req.profile.company_logo_url || null, description: body.description,
      requirements: body.requirements || '', responsibilities: body.responsibilities || '', benefits: body.benefits || '',
      location: body.location || '', city: body.city || null, country: body.country || 'Pakistan', address: body.address || null,
      latitude: body.latitude ?? null, longitude: body.longitude ?? null, job_type: body.jobType, work_mode: body.workMode || null,
      skills: body.skills || body.requiredSkills || null, required_skills: body.requiredSkills || body.skills || null,
      salary_min: body.salaryMin ?? null, salary_max: body.salaryMax ?? null, currency: body.currency || 'PKR',
      category: body.category || null, application_deadline: body.applicationDeadline || null, contact_email: body.contactEmail || req.profile.email,
      is_active: false, status: 'pending', company_id: req.user.id, created_by: req.user.id
    }
    const { data, error } = await supabase.from('jobs').insert(payload).select().single()
    if (error) throw error
    return res.status(201).json({ message: 'Job submitted for approval', job: data })
  } catch (error) {
    console.error('Company create job error:', error)
    return res.status(500).json({ error: 'Failed to create job' })
  }
})

// Company can update only its own jobs. Admin management remains under /api/admin.
router.put('/:id', authenticate, requireCompany, async (req, res) => {
  try {
    if (!isSupabaseConfigured) {
      const job = demoJobs.find(j => j.id === req.params.id && (j.company_id === req.user.id || j.created_by === req.user.id))
      if (!job) return res.status(404).json({ error: 'Job not found' })
      const map = { title:'title', description:'description', requirements:'requirements', responsibilities:'responsibilities', benefits:'benefits', location:'location', city:'city', country:'country', address:'address', latitude:'latitude', longitude:'longitude', jobType:'job_type', workMode:'work_mode', requiredSkills:'required_skills', skills:'skills', salaryMin:'salary_min', salaryMax:'salary_max', currency:'currency', category:'category', applicationDeadline:'application_deadline' }
      for (const [input, key] of Object.entries(map)) if (req.body?.[input] !== undefined) job[key] = req.body[input]
      if (req.body?.status !== undefined) { if (!['active', 'paused'].includes(req.body.status)) return res.status(400).json({ error: 'Companies may only set active or paused status' }); job.status = req.body.status; job.is_active = req.body.status === 'active' }
      job.updated_at = new Date().toISOString()
      return res.json({ message: 'Job updated successfully (demo mode)', job })
    }
    const updates = {}
    const map = { title:'title', description:'description', requirements:'requirements', responsibilities:'responsibilities', benefits:'benefits', location:'location', city:'city', country:'country', address:'address', latitude:'latitude', longitude:'longitude', jobType:'job_type', workMode:'work_mode', requiredSkills:'required_skills', skills:'skills', salaryMin:'salary_min', salaryMax:'salary_max', currency:'currency', category:'category', applicationDeadline:'application_deadline' }
    for (const [input, column] of Object.entries(map)) if (req.body?.[input] !== undefined) updates[column] = req.body[input]
    if (req.body?.status !== undefined) {
      if (!['active', 'paused'].includes(req.body.status)) return res.status(400).json({ error: 'Companies may only set active or paused status' })
      updates.status = req.body.status
      updates.is_active = req.body.status === 'active'
    }
    const { data, error } = await supabase.from('jobs').update(updates).eq('id', req.params.id).eq('company_id', req.user.id).select().single()
    if (error || !data) return res.status(error ? 500 : 404).json({ error: error?.message || 'Job not found' })
    return res.json({ message: 'Job updated successfully', job: data })
  } catch (error) {
    console.error('Company update job error:', error)
    return res.status(500).json({ error: 'Failed to update job' })
  }
})

router.delete('/:id', authenticate, requireCompany, async (req, res) => {
  try {
    if (!isSupabaseConfigured) {
      const index = demoJobs.findIndex(j => j.id === req.params.id && (j.company_id === req.user.id || j.created_by === req.user.id))
      if (index === -1) return res.status(404).json({ error: 'Job not found' })
      demoJobs.splice(index, 1)
      return res.json({ message: 'Job deleted successfully (demo mode)' })
    }
    const { data, error } = await supabase.from('jobs').delete().eq('id', req.params.id).eq('company_id', req.user.id).select('id').maybeSingle()
    if (error) throw error
    if (!data) return res.status(404).json({ error: 'Job not found' })
    return res.json({ message: 'Job deleted successfully' })
  } catch (error) {
    console.error('Company delete job error:', error)
    return res.status(500).json({ error: 'Failed to delete job' })
  }
})

// Check if user already applied
router.get('/:id/check-application', authenticate, async (req, res) => {
  try {
    if (!isSupabaseConfigured) return res.json({ hasApplied: false })
    const { id } = req.params

    const { data, error } = await supabase
      .from('applications')
      .select('id')
      .eq('job_id', id)
      .eq('user_id', req.user.id)
      .single()

    if (error && error.code !== 'PGRST116') {
      return res.status(500).json({ error: error.message })
    }

    res.json({ hasApplied: !!data })
  } catch (error) {
    console.error('Check application error:', error)
    res.status(500).json({ error: 'Failed to check application status' })
  }
})

// Save job
router.post('/:id/save', authenticate, async (req, res) => {
  try {
    if (!isSupabaseConfigured) return res.status(201).json({ message: 'Job saved successfully (demo mode)', data: { id: `saved-${Date.now()}`, job_id: req.params.id, user_id: req.user.id } })
    const { id } = req.params

    const { data, error } = await supabase
      .from('saved_jobs')
      .insert({
        job_id: id,
        user_id: req.user.id
      })
      .select()
      .single()

    if (error) {
      if (error.code === '23505') {
        return res.status(400).json({ error: 'Job already saved' })
      }
      return res.status(500).json({ error: error.message })
    }

    res.status(201).json({ message: 'Job saved successfully', data })
  } catch (error) {
    console.error('Save job error:', error)
    res.status(500).json({ error: 'Failed to save job' })
  }
})

// Unsave job
router.delete('/:id/unsave', authenticate, async (req, res) => {
  try {
    if (!isSupabaseConfigured) return res.json({ message: 'Job unsaved successfully (demo mode)' })
    const { id } = req.params

    const { error } = await supabase
      .from('saved_jobs')
      .delete()
      .eq('job_id', id)
      .eq('user_id', req.user.id)

    if (error) {
      return res.status(500).json({ error: error.message })
    }

    res.json({ message: 'Job unsaved successfully' })
  } catch (error) {
    console.error('Unsave job error:', error)
    res.status(500).json({ error: 'Failed to unsave job' })
  }
})

// Get saved jobs
router.get('/saved/list', authenticate, async (req, res) => {
  try {
    if (!isSupabaseConfigured) return res.json([])
    const { data: savedJobs, error } = await supabase
      .from('saved_jobs')
      .select(`
        *,
        jobs (*)
      `)
      .eq('user_id', req.user.id)
      .order('saved_at', { ascending: false })

    if (error) {
      return res.status(500).json({ error: error.message })
    }

    res.json(savedJobs.map(item => item.jobs))
  } catch (error) {
    console.error('Get saved jobs error:', error)
    res.status(500).json({ error: 'Failed to fetch saved jobs' })
  }
})

export default router
