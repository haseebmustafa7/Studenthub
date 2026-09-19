import axios from 'axios'
import { supabase } from '../config/supabase'

const raw = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/$/, '')
export const API_URL = raw.endsWith('/api') ? raw : `${raw}/api`

export async function apiRequest(config = {}) {
  const { data: { session } = {} } = await supabase.auth.getSession()
  return axios({
    ...config,
    url: config.url?.startsWith('http') ? config.url : `${API_URL}${config.url || ''}`,
    headers: {
      ...(config.headers || {}),
      ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {})
    }
  })
}

export async function apiFetch(path, options = {}) {
  const { data: { session } = {} } = await supabase.auth.getSession()
  const headers = new Headers(options.headers || {})
  if (session?.access_token) headers.set('Authorization', `Bearer ${session.access_token}`)
  if (options.body && typeof options.body === 'string' && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }
  return fetch(`${API_URL}${path.startsWith('/') ? path : `/${path}`}`, { ...options, headers })
}
