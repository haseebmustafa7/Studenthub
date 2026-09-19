import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { AlertCircle, ArrowLeft, Briefcase, FileText, Mail, Users } from 'lucide-react'
import { apiFetch } from '../lib/api'
import { Badge, Button, Card, Container, Page, SectionHeading, Skeleton } from '../components/common/UI'

export default function CompanyApplications() {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('all')

  const load = async () => {
    try {
      setLoading(true)
      setError('')
      const response = await apiFetch('/applications/company')
      const data = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(data.error || 'Unable to load applications')
      setApplications(data.applications || [])
    } catch (err) {
      setError(err.message || 'Unable to load applications')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const filtered = useMemo(() => (
    filter === 'all' ? applications : applications.filter(application => application.status === filter)
  ), [applications, filter])

  if (loading) {
    return <Page><Container><div className="space-y-4"><Skeleton className="h-10 w-64" /><Skeleton className="h-24 w-full" /><Skeleton className="h-48 w-full" /></div></Container></Page>
  }

  return (
    <Page>
      <Container className="space-y-5">
        <Link to="/company/dashboard" className="arrow-link"><ArrowLeft size={16} />Back to dashboard</Link>
        <SectionHeading
          eyebrow="Hiring pipeline"
          title="Applications"
          description="Review applications submitted to your company jobs."
          action={<Button variant="secondary" onClick={load}>Refresh</Button>}
        />

        {error && <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 flex gap-2"><AlertCircle size={18} />{error}</div>}

        <div className="flex flex-wrap gap-2">
          {['all', 'pending', 'reviewed', 'shortlisted', 'rejected'].map(status => (
            <button key={status} onClick={() => setFilter(status)} className={`px-3 py-2 rounded-lg text-sm font-bold capitalize border ${filter === status ? 'bg-primary text-white border-primary' : 'bg-white text-gray-600 border-gray-200'}`}>
              {status}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <Card className="text-center py-14">
            <Users className="mx-auto text-gray-300" size={48} />
            <h2 className="text-xl font-black mt-4">No applications yet</h2>
            <p className="text-gray-500 mt-2">Applications for your jobs will appear here.</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {filtered.map(application => {
              const applicant = application.profiles || {}
              const job = application.jobs || {}
              const tone = application.status === 'shortlisted' ? 'success' : application.status === 'rejected' ? 'danger' : application.status === 'pending' ? 'warning' : 'primary'
              return (
                <Card key={application.id}>
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge tone={tone}>{application.status || 'pending'}</Badge>
                        <span className="text-xs text-gray-400">{application.applied_at ? new Date(application.applied_at).toLocaleString() : 'Date unavailable'}</span>
                      </div>
                      <h2 className="text-lg font-black mt-2">{applicant.full_name || applicant.email || 'Student applicant'}</h2>
                      <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-500">
                        <span className="inline-flex items-center gap-1"><Briefcase size={14} />{job.title || 'Job'}</span>
                        {applicant.email && <span className="inline-flex items-center gap-1"><Mail size={14} />{applicant.email}</span>}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {application.resume_url && <a className="ui-btn ui-btn-secondary" href={application.resume_url} target="_blank" rel="noreferrer"><FileText size={15} />Resume</a>}
                      <Link className="ui-btn ui-btn-primary" to={`/jobs/${application.job_id}`}>View job</Link>
                    </div>
                  </div>
                  {application.cover_letter && <div className="mt-4 p-4 rounded-xl bg-gray-50 border border-gray-100"><p className="text-xs font-black uppercase tracking-wider text-gray-400 mb-2">Cover letter</p><p className="text-sm text-gray-600 whitespace-pre-wrap leading-6">{application.cover_letter}</p></div>}
                </Card>
              )
            })}
          </div>
        )}
      </Container>
    </Page>
  )
}
