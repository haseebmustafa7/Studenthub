import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { careerRequest, CAREER_API } from '../../lib/careerApi'
import { Target, CheckCircle, AlertCircle, ArrowRight, RefreshCw, Sparkles } from 'lucide-react'

export default function SkillAnalysis() {
  const { careerId: routeCareerId } = useParams()
  const nav = useNavigate()
  const [careerId, setCareerId] = useState(routeCareerId || '')
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [analysis, setAnalysis] = useState(null)
  const [career, setCareer] = useState(null)
  const [matches, setMatches] = useState([])
  const [error, setError] = useState('')

  const load = async (selectedCareerId = routeCareerId) => {
    try {
      setLoading(true)
      setError('')

      let resolvedCareerId = selectedCareerId
      if (!resolvedCareerId) {
        const matchesResponse = await careerRequest({ url: `${CAREER_API}/matches` })
        const availableMatches = matchesResponse.data.matches || []
        setMatches(availableMatches)
        resolvedCareerId = availableMatches[0]?.career_id || ''
        if (!resolvedCareerId) {
          nav('/career/assessment')
          return
        }
        setCareerId(resolvedCareerId)
      }

      const response = await careerRequest({ url: `${CAREER_API}/skills/${resolvedCareerId}` })
      setAnalysis(response.data.analysis)
      setCareer(response.data.career)
    } catch (e) {
      setError(e.response?.data?.error || 'Unable to load skill analysis')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load(routeCareerId)
  }, [routeCareerId])

  const analyze = async () => {
    try {
      setBusy(true)
      setError('')
      await careerRequest({
        method: 'post',
        url: `${CAREER_API}/skills/analyze`,
        data: { career_id: careerId }
      })
      await load(careerId)
    } catch (e) {
      setError(e.response?.data?.error || 'Unable to analyze skills')
    } finally {
      setBusy(false)
    }
  }

  const chooseCareer = (id) => {
    setCareerId(id)
    nav(`/career/skills/${id}`)
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading your skill analysis...</div>
  }

  const gaps = analysis?.skill_gaps || []
  const strengths = analysis?.matching_skills || []
  const matchPercent = Math.round((strengths.length / Math.max(1, strengths.length + gaps.length)) * 100)

  if (!analysis) {
    return (
      <div className="app-page">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white shadow rounded-xl p-8 text-center">
            <Target className="w-12 h-12 mx-auto text-primary mb-3" />
            <h1 className="text-2xl font-bold">AI Skill Analysis</h1>
            <p className="my-3 text-gray-600">
              Compare your current skills with your recommended career and discover exactly what you should learn next.
            </p>

            {matches.length > 0 && (
              <div className="max-w-md mx-auto text-left mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-2">Target career</label>
                <select
                  value={careerId}
                  onChange={(e) => chooseCareer(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                >
                  {matches.map((match) => (
                    <option key={match.career_id} value={match.career_id}>
                      {match.careers?.title || 'Recommended career'}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {error && <p className="text-red-600 mb-4">{error}</p>}
            <button disabled={busy || !careerId} onClick={analyze} className="px-6 py-3 bg-primary text-white rounded-lg">
              {busy ? <><RefreshCw className="inline w-5 animate-spin mr-2" />Analyzing...</> : <><Sparkles className="inline w-5 mr-2" />Analyze My Skills</>}
            </button>
            <div className="mt-4">
              <button onClick={() => nav('/career/assessment')} className="text-primary font-medium">Review Career Assessment</button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="app-page">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-6">
          <div>
            <h1 className="text-3xl font-bold">AI Skill Analysis</h1>
            <p className="text-gray-600">Target career: {career?.title}</p>
          </div>
          <button onClick={analyze} disabled={busy} className="px-4 py-2 border bg-white rounded-lg">
            {busy ? 'Analyzing...' : 'Refresh AI Analysis'}
          </button>
        </div>

        {error && <p className="text-red-600 mb-4">{error}</p>}

        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-5 rounded-xl shadow"><b className="text-3xl text-green-600">{strengths.length}</b><p>Matching Skills</p></div>
          <div className="bg-white p-5 rounded-xl shadow"><b className="text-3xl text-orange-600">{gaps.length}</b><p>Skills to Develop</p></div>
          <div className="bg-white p-5 rounded-xl shadow"><b className="text-3xl text-primary">{matchPercent}%</b><p>Current Match</p></div>
        </div>

        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <h2 className="text-xl font-bold mb-3"><CheckCircle className="inline text-green-600 mr-2" />Your Strengths</h2>
          <div className="flex flex-wrap gap-2">
            {strengths.length ? strengths.map((skill) => <span key={skill} className="px-3 py-1 bg-green-50 text-green-700 rounded-full">{skill}</span>) : <p className="text-gray-500">No matching skills identified yet.</p>}
          </div>
          {analysis.summary && <p className="mt-4 text-gray-600">{analysis.summary}</p>}
        </div>

        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <h2 className="text-xl font-bold mb-4"><AlertCircle className="inline text-orange-600 mr-2" />Personalized Skill Gaps</h2>
          <div className="space-y-4">
            {gaps.length ? gaps.map((gap, i) => (
              <div key={`${gap.skill}-${i}`} className="border rounded-lg p-4">
                <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
                  <b>{gap.skill}</b>
                  <span className="capitalize font-medium">{gap.priority || 'medium'} priority</span>
                </div>
                <p className="text-gray-600 mt-2">{gap.reason}</p>
                <p className="text-sm mt-2">Current: {gap.current_level || 'Not assessed'} · Target: {gap.target_level || 'Intermediate'} · Estimated: {gap.estimated_learning_time || 'Self-paced'}</p>
                {gap.learning_resources?.length > 0 && <p className="text-sm mt-2">Start with: {gap.learning_resources.join(' • ')}</p>}
              </div>
            )) : <p className="text-gray-500">No major skill gaps identified.</p>}
          </div>
        </div>

        {analysis.next_actions?.length > 0 && (
          <div className="bg-white rounded-xl shadow p-6 mb-6">
            <h2 className="text-xl font-bold mb-3">Recommended Next Actions</h2>
            <ul className="list-disc ml-5 space-y-2 text-gray-700">
              {analysis.next_actions.map((action, i) => <li key={i}>{action}</li>)}
            </ul>
          </div>
        )}

        <button onClick={() => nav(`/career/roadmap/${careerId}`)} className="px-6 py-3 bg-primary text-white rounded-lg">
          Generate My Learning Roadmap <ArrowRight className="inline w-5" />
        </button>
      </div>
    </div>
  )
}
