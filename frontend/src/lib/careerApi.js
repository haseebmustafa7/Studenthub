import axios from 'axios'
import { supabase } from '../config/supabase'
import { API_URL } from './api'

export const CAREER_API = `${API_URL}/career`

export async function careerRequest(config = {}) {
  const { data: { session } = {} } = await supabase.auth.getSession()
  return axios({
    ...config,
    url: config.url?.startsWith('http') ? config.url : `${CAREER_API}${config.url || ''}`,
    headers: {
      ...(config.headers || {}),
      ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {})
    }
  })
}
