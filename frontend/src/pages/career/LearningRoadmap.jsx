import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { careerRequest, CAREER_API } from '../../lib/careerApi'
import { BookOpen, RefreshCw, ChevronDown, ChevronUp, CheckCircle2, Circle, Sparkles } from 'lucide-react'

export default function LearningRoadmap() {
  const { careerId: routeCareerId } = useParams()
  const nav = useNavigate()
  const [careerId, setCareerId] = useState(routeCareerId || '')
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [roadmap, setRoadmap] = useState(null)
  const [career, setCareer] = useState(null)
  const [matches, setMatches] = useState([])
  const [error, setError] = useState('')
  const [openPhases, setOpenPhases] = useState({})

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

      const response = await careerRequest({ url: `${CAREER_API}/roadmap/${resolvedCareerId}` })
      setRoadmap(response.data.roadmap)
      setCareer(response.data.career)
      if (response.data.roadmap?.phases) {
        setOpenPhases(Object.fromEntries(response.data.roadmap.phases.map((_, i) => [i, true])))
      }
    } catch (e) {
      setError(e.response?.data?.error || 'Unable to load roadmap')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load(routeCareerId) }, [routeCareerId])

  const generate = async () => {
    try {
      setBusy(true)
      setError('')
      await careerRequest({ method: 'post', url: `${CAREER_API}/roadmap/generate`, data: { career_id: careerId } })
      await load(careerId)
    } catch (e) {
      setError(e.response?.data?.error || 'Unable to generate roadmap')
    } finally {
      setBusy(false)
    }
  }

  const phases = roadmap?.phases || []
  const totalSteps = useMemo(() => phases.reduce((sum, phase) => sum + (phase.steps?.length || 0), 0), [phases])
  const completedSteps = useMemo(() => phases.reduce((sum, phase) => sum + (phase.steps || []).filter(step => step.status === 'completed').length, 0), [phases])
  const progress = totalSteps ? Math.round((completedSteps / totalSteps) * 100) : 0

  const toggleStep = async (phaseIndex, stepIndex) => {
    try {
      const step = phases[phaseIndex]?.steps?.[stepIndex]
      if (!step) return
      const nextStatus = step.status === 'completed' ? 'not_started' : 'completed'
      const response = await careerRequest({
        method: 'patch',
        url: `${CAREER_API}/roadmap/step/${encodeURIComponent(step.id || `${phaseIndex}-${stepIndex}`)}`,
        data: { career_id: careerId, phase_index: phaseIndex, step_index: stepIndex, status: nextStatus }
      })
      setRoadmap(response.data.roadmap)
    } catch (e) {
      setError(e.response?.data?.error || 'Unable to update progress')
    }
  }

  const chooseCareer = (id) => {
    setCareerId(id)
    nav(`/career/roadmap/${id}`)
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading your learning roadmap...</div>

  if (!roadmap) {
    return (
      <div className="app-page">
        <div className="max-w-3xl mx-auto bg-white shadow rounded-xl p-8 text-center">
          <BookOpen className="w-12 h-12 mx-auto text-primary mb-3" />
          <h1 className="text-2xl font-bold">Personalized Learning Roadmap</h1>
          <p className="my-3 text-gray-600">Generate a Gemini-powered roadmap using your career assessment and skill gaps.</p>
          {matches.length > 0 && (
            <select value={careerId} onChange={(e) => chooseCareer(e.target.value)} className="w-full max-w-md px-4 py-3 border border-gray-300 rounded-lg mb-4">
              {matches.map(match => <option key={match.career_id} value={match.career_id}>{match.careers?.title || 'Recommended career'}</option>)}
            </select>
          )}
          {error && <p className="text-red-600 mb-4">{error}</p>}
          <div>
            <button disabled={busy || !careerId} onClick={generate} className="px-6 py-3 bg-primary text-white rounded-lg">
              {busy ? <><RefreshCw className="inline w-5 animate-spin mr-2" />Generating...</> : <><Sparkles className="inline w-5 mr-2" />Generate My Roadmap</>}
            </button>
          </div>
          <button onClick={() => nav('/career/skills')} className="mt-4 text-primary font-medium">Review Skill Analysis</button>
        </div>
      </div>
    )
  }

  return (
    <div className="app-page">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold">Your Learning Roadmap</h1>
            <p className="text-gray-600">{career?.title}</p>
          </div>
          <button onClick={generate} disabled={busy} className="px-4 py-2 border bg-white rounded-lg">
            {busy ? 'Refreshing...' : 'Regenerate with AI'}
          </button>
        </div>

        {error && <p className="text-red-600 mb-4">{error}</p>}

        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <div className="flex justify-between mb-2"><b>Overall Progress</b><b>{progress}%</b></div>
          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden"><div className="h-full bg-primary transition-all" style={{ width: `${progress}%` }} /></div>
          <p className="text-sm text-gray-500 mt-2">{completedSteps} of {totalSteps} learning items completed</p>
          {roadmap.overview && <p className="text-gray-600 mt-4">{roadmap.overview}</p>}
        </div>

        {roadmap.milestones?.length > 0 && (
          <div className="bg-white rounded-xl shadow p-6 mb-6">
            <h2 className="font-bold text-lg mb-2">Milestones</h2>
            <ul className="list-disc ml-5 space-y-1">{roadmap.milestones.map((milestone, i) => <li key={i}>{milestone}</li>)}</ul>
          </div>
        )}

        <div className="space-y-5">
          {phases.map((phase, phaseIndex) => {
            const isOpen = openPhases[phaseIndex] !== false
            return (
              <div key={phaseIndex} className="bg-white rounded-xl shadow overflow-hidden">
                <button onClick={() => setOpenPhases(prev => ({ ...prev, [phaseIndex]: !isOpen }))} className="w-full text-left p-6 flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold">Phase {phaseIndex + 1}: {phase.name}</h2>
                    <p className="text-gray-600">{phase.description} {phase.duration ? `· ${phase.duration}` : ''}</p>
                  </div>
                  {isOpen ? <ChevronUp /> : <ChevronDown />}
                </button>

                {isOpen && <div className="px-6 pb-6 space-y-3">
                  {(phase.steps || []).map((step, stepIndex) => {
                    const complete = step.status === 'completed'
                    return (
                      <div key={step.id || stepIndex} className={`border rounded-lg p-4 ${complete ? 'bg-green-50 border-green-200' : ''}`}>
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2"><b>{step.title}</b><span className="text-xs px-2 py-1 bg-gray-100 rounded-full">{step.skill}</span></div>
                            <p className="text-sm mt-2"><b>Objective:</b> {step.objective}</p>
                            <p className="text-sm mt-1"><b>Practice:</b> {step.practice_activity}</p>
                            <p className="text-sm mt-1"><b>Project:</b> {step.project_recommendation}</p>
                          </div>
                          <button onClick={() => toggleStep(phaseIndex, stepIndex)} className="shrink-0 text-primary" title={complete ? 'Mark incomplete' : 'Mark complete'}>
                            {complete ? <CheckCircle2 className="w-7 h-7 text-green-600" /> : <Circle className="w-7 h-7" />}
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
