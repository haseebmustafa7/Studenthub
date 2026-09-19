import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

export const isSupabaseConfigured = Boolean(
  url && key && !url.includes('your_supabase') && !key.includes('your_supabase')
)

// Keep the real Supabase client when credentials are present.
const realSupabase = isSupabaseConfigured ? createClient(url, key) : null

const STORAGE_KEY = 'studenthub_demo_db'
const SESSION_KEY = 'studenthub_demo_session'
const uid = () => `demo-${Math.random().toString(36).slice(2)}-${Date.now()}`

const seedJobs = [
  { id: 'demo-job-1', title: 'Frontend Developer Intern', company_name: 'Systems Limited', location: 'Lahore, Pakistan', city: 'Lahore', country: 'Pakistan', category: 'Web Development', job_type: 'internship', work_mode: 'hybrid', description: 'Build modern web interfaces with React and JavaScript.', salary_min: 25000, salary_max: 45000, latitude: 31.5204, longitude: 74.3587, is_active: true, status: 'active', created_at: new Date().toISOString() },
  { id: 'demo-job-2', title: 'Software Engineer', company_name: '10Pearls', location: 'Islamabad, Pakistan', city: 'Islamabad', country: 'Pakistan', category: 'Software Engineering', job_type: 'full-time', work_mode: 'on-site', description: 'Develop scalable software products and APIs.', salary_min: 120000, salary_max: 220000, latitude: 33.6844, longitude: 73.0479, is_active: true, status: 'active', created_at: new Date().toISOString() },
  { id: 'demo-job-3', title: 'Data Analyst', company_name: 'Netsol Technologies', location: 'Lahore, Pakistan', city: 'Lahore', country: 'Pakistan', category: 'Data Science', job_type: 'full-time', work_mode: 'hybrid', description: 'Analyze business data and create dashboards.', salary_min: 90000, salary_max: 160000, latitude: 31.4697, longitude: 74.2728, is_active: true, status: 'active', created_at: new Date().toISOString() },
  { id: 'demo-job-4', title: 'UI/UX Designer', company_name: 'Arbisoft', location: 'Lahore, Pakistan', city: 'Lahore', country: 'Pakistan', category: 'UI/UX', job_type: 'full-time', work_mode: 'remote', description: 'Design user-centered digital experiences.', salary_min: 80000, salary_max: 150000, latitude: 31.5497, longitude: 74.3436, is_active: true, status: 'active', created_at: new Date().toISOString() },
  { id: 'demo-job-5', title: 'Marketing Intern', company_name: 'Daraz', location: 'Karachi, Pakistan', city: 'Karachi', country: 'Pakistan', category: 'Marketing', job_type: 'internship', work_mode: 'on-site', description: 'Support digital marketing and growth campaigns.', salary_min: 20000, salary_max: 35000, latitude: 24.8607, longitude: 67.0011, is_active: true, status: 'active', created_at: new Date().toISOString() },
  { id: 'demo-job-6', title: 'Backend Developer', company_name: 'TRG Pakistan', location: 'Karachi, Pakistan', city: 'Karachi', country: 'Pakistan', category: 'Software Engineering', job_type: 'full-time', work_mode: 'hybrid', description: 'Build APIs and backend services.', salary_min: 110000, salary_max: 200000, latitude: 24.9068, longitude: 67.0822, is_active: true, status: 'active', created_at: new Date().toISOString() },
]

const initialDb = {
  profiles: [], jobs: seedJobs, applications: [], saved_jobs: [], career_assessments: [], career_matches: [], careers: [], skill_analyses: [], learning_roadmaps: [], counselors: [], counseling_sessions: [], counselor_availability: []
}

const readDb = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null')
    if (saved) return saved
  } catch {}
  localStorage.setItem(STORAGE_KEY, JSON.stringify(initialDb))
  return structuredClone(initialDb)
}
const writeDb = (db) => localStorage.setItem(STORAGE_KEY, JSON.stringify(db))

const matches = (row, filters) => filters.every(f => {
  const value = row?.[f.field]
  if (f.type === 'eq') return String(value) === String(f.value)
  if (f.type === 'in') return f.values.includes(value)
  if (f.type === 'contains') return Array.isArray(value) && f.values.every(v => value.includes(v))
  if (f.type === 'ilike') return String(value || '').toLowerCase().includes(String(f.value || '').toLowerCase())
  if (f.type === 'gte') return value >= f.value
  if (f.type === 'lte') return value <= f.value
  return true
})

class MockQuery {
  constructor(table) { this.table = table; this.filters = []; this.orderBy = null; this.limitN = null; this.rangeFrom = null; this.rangeTo = null; this.operation = 'select'; this.payload = null; this.returning = false }
  select(_columns = '*', options = {}) { this.returning = true; this.countRequested = options.count === 'exact'; return this }
  eq(field, value) { this.filters.push({ type: 'eq', field, value }); return this }
  in(field, values) { this.filters.push({ type: 'in', field, values }); return this }
  contains(field, values) { this.filters.push({ type: 'contains', field, values }); return this }
  or(expression) { this.orExpression = expression; return this }
  gte(field, value) { this.filters.push({ type: 'gte', field, value }); return this }
  lte(field, value) { this.filters.push({ type: 'lte', field, value }); return this }
  order(field, opts = {}) { this.orderBy = { field, ascending: opts.ascending !== false }; return this }
  limit(n) { this.limitN = Number(n); return this }
  range(from, to) { this.rangeFrom = Number(from); this.rangeTo = Number(to); return this }
  insert(payload) { this.operation = 'insert'; this.payload = Array.isArray(payload) ? payload : [payload]; return this }
  update(payload) { this.operation = 'update'; this.payload = payload; return this }
  upsert(payload) { this.operation = 'upsert'; this.payload = Array.isArray(payload) ? payload : [payload]; return this }
  delete() { this.operation = 'delete'; return this }
  single() { return this.execute().then(r => ({ data: Array.isArray(r.data) ? r.data[0] || null : r.data, error: r.error })) }
  maybeSingle() { return this.single() }
  then(resolve, reject) { return this.execute().then(resolve, reject) }
  async execute() {
    const db = readDb(); let rows = [...(db[this.table] || [])]
    if (this.operation === 'select') {
      rows = rows.filter(r => matches(r, this.filters))
      if (this.orExpression) {
        const terms = this.orExpression.split(',').map(s => s.trim())
        rows = rows.filter(row => terms.some(term => { const m = term.match(/([^.]*)\.ilike\.%(.+)%/); return m ? String(row[m[1]] || '').toLowerCase().includes(m[2].toLowerCase()) : true }))
      }
      if (this.orderBy) rows.sort((a,b) => (a[this.orderBy.field] > b[this.orderBy.field] ? 1 : a[this.orderBy.field] < b[this.orderBy.field] ? -1 : 0) * (this.orderBy.ascending ? 1 : -1))
      const count = rows.length
      if (this.rangeFrom !== null) rows = rows.slice(this.rangeFrom, this.rangeTo + 1)
      if (this.limitN !== null) rows = rows.slice(0, this.limitN)
      return { data: rows, error: null, count: this.countRequested ? count : null }
    }
    if (this.operation === 'insert') {
      const inserted = this.payload.map(item => ({ id: item.id || uid(), created_at: item.created_at || new Date().toISOString(), ...item }))
      db[this.table] = [...(db[this.table] || []), ...inserted]; writeDb(db); return { data: inserted, error: null }
    }
    if (this.operation === 'upsert') {
      const inserted = []
      for (const item of this.payload) {
        const existingIndex = (db[this.table] || []).findIndex(row => (item.user_id && row.user_id === item.user_id && item.career_id && row.career_id === item.career_id) || (item.user_id && !item.career_id && row.user_id === item.user_id))
        if (existingIndex >= 0) db[this.table][existingIndex] = { ...db[this.table][existingIndex], ...item }; else { const row = { id: item.id || uid(), created_at: new Date().toISOString(), ...item }; db[this.table].push(row); inserted.push(row) }
      }
      writeDb(db); return { data: inserted.length ? inserted : [db[this.table][0]], error: null }
    }
    if (this.operation === 'update') {
      const changed = []
      db[this.table] = (db[this.table] || []).map(row => { if (matches(row, this.filters)) { const next = { ...row, ...this.payload, updated_at: new Date().toISOString() }; changed.push(next); return next } return row })
      writeDb(db); return { data: changed, error: null }
    }
    if (this.operation === 'delete') { db[this.table] = (db[this.table] || []).filter(row => !matches(row, this.filters)); writeDb(db); return { data: null, error: null } }
    return { data: null, error: null }
  }
}

const mockAuth = {
  async getSession() { const session = JSON.parse(localStorage.getItem(SESSION_KEY) || 'null'); return { data: { session } } },
  onAuthStateChange(callback) { const handler = () => { const session = JSON.parse(localStorage.getItem(SESSION_KEY) || 'null'); callback('SIGNED_IN', session) }; window.addEventListener('studenthub-auth', handler); return { data: { subscription: { unsubscribe: () => window.removeEventListener('studenthub-auth', handler) } } } },
  async signInWithPassword({ email, password }) { const db = readDb(); let profile = db.profiles.find(p => p.email === email); if (!profile && email === 'demo@studenthub.com' && password === 'demo123') { profile = { user_id: 'demo-student', email, password, full_name: 'Demo Student', role: 'student', university: 'StudentHub Demo University', major: 'Computer Science', graduation_year: 2027 }; db.profiles.push(profile); writeDb(db) } if (!profile || profile.password !== password) return { data: null, error: { message: 'Invalid login credentials' } }; const session = { access_token: `demo-token-${profile.user_id}`, user: { id: profile.user_id, email } }; localStorage.setItem(SESSION_KEY, JSON.stringify(session)); window.dispatchEvent(new Event('studenthub-auth')); return { data: { user: session.user, session }, error: null } },
  async signUp({ email, password }) { const db = readDb(); if (db.profiles.some(p => p.email === email)) return { data: null, error: { message: 'User already registered' } }; const user = { id: uid(), email, _demo_password: password }; const session = { access_token: `demo-token-${user.id}`, user }; localStorage.setItem('studenthub_demo_pending_user', JSON.stringify(user)); localStorage.setItem(SESSION_KEY, JSON.stringify(session)); window.dispatchEvent(new Event('studenthub-auth')); return { data: { user, session }, error: null } },
  async signOut() { localStorage.removeItem(SESSION_KEY); window.dispatchEvent(new Event('studenthub-auth')); return { error: null } }
}

export const supabase = realSupabase || {
  auth: mockAuth,
  from: (table) => new MockQuery(table)
}
