import express from 'express'
import { supabase } from '../config/supabase.js'
import { authenticate, requireAdmin } from '../middleware/auth.js'

const router = express.Router()

// All admin routes require authentication and admin role
router.use(authenticate)
router.use(requireAdmin)

// Get dashboard statistics
router.get('/stats', async (req, res) => {
  try {
    // Get total jobs
    const { count: totalJobs } = await supabase
      .from('jobs')
      .select('*', { count: 'exact', head: true })

    // Get active jobs
    const { count: activeJobs } = await supabase
      .from('jobs')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true)

    // Get total applications
    const { count: totalApplications } = await supabase
      .from('applications')
      .select('*', { count: 'exact', head: true })

    // Get total students
    const { count: totalStudents } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'student')

    res.json({
      totalJobs: totalJobs || 0,
      activeJobs: activeJobs || 0,
      totalApplications: totalApplications || 0,
      totalStudents: totalStudents || 0
    })
  } catch (error) {
    console.error('Get stats error:', error)
    res.status(500).json({ error: 'Failed to fetch statistics' })
  }
})

// Get all jobs (including inactive)
router.get('/jobs', async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query

    const from = (page - 1) * limit
    const to = from + limit - 1

    const { data: jobs, error, count } = await supabase
      .from('jobs')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to)

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
    console.error('Get admin jobs error:', error)
    res.status(500).json({ error: 'Failed to fetch jobs' })
  }
})

// Create new job
router.post('/jobs', async (req, res) => {
  try {
    const {
      title,
      companyName,
      companyLogoUrl,
      description,
      requirements,
      responsibilities,
      benefits,
      location,
      jobType,
      workMode,
      salaryMin,
      salaryMax,
      category,
      applicationDeadline,
      contactEmail
    } = req.body

    if (!title || !companyName || !description || !location || !jobType) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    const { data, error } = await supabase
      .from('jobs')
      .insert({
        title,
        company_name: companyName,
        company_logo_url: companyLogoUrl || '',
        description,
        requirements: requirements || '',
        responsibilities: responsibilities || '',
        benefits: benefits || '',
        location,
        job_type: jobType,
        work_mode: workMode || 'on-site',
        salary_min: salaryMin || null,
        salary_max: salaryMax || null,
        category: category || 'Other',
        application_deadline: applicationDeadline || null,
        contact_email: contactEmail || '',
        is_active: true,
        created_by: req.user.id
      })
      .select()
      .single()

    if (error) {
      return res.status(500).json({ error: error.message })
    }

    res.status(201).json({
      message: 'Job created successfully',
      job: data
    })
  } catch (error) {
    console.error('Create job error:', error)
    res.status(500).json({ error: 'Failed to create job' })
  }
})

// Update job
router.put('/jobs/:id', async (req, res) => {
  try {
    const { id } = req.params
    const {
      title,
      companyName,
      companyLogoUrl,
      description,
      requirements,
      responsibilities,
      benefits,
      location,
      jobType,
      workMode,
      salaryMin,
      salaryMax,
      category,
      applicationDeadline,
      contactEmail,
      isActive
    } = req.body

    const updates = {}
    if (title !== undefined) updates.title = title
    if (companyName !== undefined) updates.company_name = companyName
    if (companyLogoUrl !== undefined) updates.company_logo_url = companyLogoUrl
    if (description !== undefined) updates.description = description
    if (requirements !== undefined) updates.requirements = requirements
    if (responsibilities !== undefined) updates.responsibilities = responsibilities
    if (benefits !== undefined) updates.benefits = benefits
    if (location !== undefined) updates.location = location
    if (jobType !== undefined) updates.job_type = jobType
    if (workMode !== undefined) updates.work_mode = workMode
    if (salaryMin !== undefined) updates.salary_min = salaryMin
    if (salaryMax !== undefined) updates.salary_max = salaryMax
    if (category !== undefined) updates.category = category
    if (applicationDeadline !== undefined) updates.application_deadline = applicationDeadline
    if (contactEmail !== undefined) updates.contact_email = contactEmail
    if (isActive !== undefined) updates.is_active = isActive

    const { data, error } = await supabase
      .from('jobs')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return res.status(500).json({ error: error.message })
    }

    res.json({
      message: 'Job updated successfully',
      job: data
    })
  } catch (error) {
    console.error('Update job error:', error)
    res.status(500).json({ error: 'Failed to update job' })
  }
})

// Delete job
router.delete('/jobs/:id', async (req, res) => {
  try {
    const { id } = req.params

    const { error } = await supabase
      .from('jobs')
      .delete()
      .eq('id', id)

    if (error) {
      return res.status(500).json({ error: error.message })
    }

    res.json({ message: 'Job deleted successfully' })
  } catch (error) {
    console.error('Delete job error:', error)
    res.status(500).json({ error: 'Failed to delete job' })
  }
})

// Approve job
router.post('/jobs/:id/approve', async (req, res) => {
  try {
    const { id } = req.params

    const { data, error } = await supabase
      .from('jobs')
      .update({
        status: 'active',
        approved_at: new Date().toISOString(),
        approved_by: req.user.id
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return res.status(500).json({ error: error.message })
    }

    res.json({
      message: 'Job approved successfully',
      job: data
    })
  } catch (error) {
    console.error('Approve job error:', error)
    res.status(500).json({ error: 'Failed to approve job' })
  }
})

// Reject job
router.post('/jobs/:id/reject', async (req, res) => {
  try {
    const { id } = req.params

    const { data, error } = await supabase
      .from('jobs')
      .update({
        status: 'rejected'
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return res.status(500).json({ error: error.message })
    }

    res.json({
      message: 'Job rejected',
      job: data
    })
  } catch (error) {
    console.error('Reject job error:', error)
    res.status(500).json({ error: 'Failed to reject job' })
  }
})

// Get all applications
router.get('/applications', async (req, res) => {
  try {
    const { jobId, status, page = 1, limit = 20 } = req.query

    let query = supabase
      .from('applications')
      .select(`
        *,
        jobs (*),
        profiles (*)
      `, { count: 'exact' })
      .order('applied_at', { ascending: false })

    if (jobId) {
      query = query.eq('job_id', jobId)
    }

    if (status) {
      query = query.eq('status', status)
    }

    const from = (page - 1) * limit
    const to = from + limit - 1
    query = query.range(from, to)

    const { data: applications, error, count } = await query

    if (error) {
      return res.status(500).json({ error: error.message })
    }

    res.json({
      applications,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit)
      }
    })
  } catch (error) {
    console.error('Get applications error:', error)
    res.status(500).json({ error: 'Failed to fetch applications' })
  }
})

// Update application status
router.put('/applications/:id/status', async (req, res) => {
  try {
    const { id } = req.params
    const { status } = req.body

    if (!['pending', 'reviewed', 'shortlisted', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' })
    }

    const { data, error } = await supabase
      .from('applications')
      .update({ status })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return res.status(500).json({ error: error.message })
    }

    res.json({
      message: 'Application status updated successfully',
      application: data
    })
  } catch (error) {
    console.error('Update application status error:', error)
    res.status(500).json({ error: 'Failed to update application status' })
  }
})

export default router
