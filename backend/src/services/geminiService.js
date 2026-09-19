import crypto from 'node:crypto'
import dotenv from 'dotenv'
import { GoogleGenAI } from '@google/genai'

dotenv.config()

const MODEL = process.env.GEMINI_MODEL || 'gemini-3.6-flash'
const TIMEOUT_MS = Number(process.env.GEMINI_TIMEOUT_MS || 30000)
const CACHE_TTL_MS = Number(process.env.GEMINI_CACHE_TTL_MS || 10 * 60 * 1000)
const MAX_CACHE_ENTRIES = Number(process.env.GEMINI_CACHE_MAX_ENTRIES || 200)

const cache = new Map()
let aiClient = null

export class GeminiServiceError extends Error {
  constructor(message, code = 'AI_UNAVAILABLE', status = 503) {
    super(message)
    this.name = 'GeminiServiceError'
    this.code = code
    this.status = status
  }
}

function getClient() {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey || apiKey.startsWith('your_')) {
    throw new GeminiServiceError('Gemini AI is not configured', 'AI_NOT_CONFIGURED', 503)
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({ apiKey, httpOptions: { timeout: TIMEOUT_MS } })
  }
  return aiClient
}

function cacheKey(operation, input) {
  return crypto.createHash('sha256').update(`${operation}:${JSON.stringify(input)}`).digest('hex')
}

function getCached(key) {
  const item = cache.get(key)
  if (!item) return null
  if (item.expiresAt <= Date.now()) {
    cache.delete(key)
    return null
  }
  return structuredClone(item.value)
}

function setCached(key, value) {
  if (cache.size >= MAX_CACHE_ENTRIES) {
    const oldest = cache.keys().next().value
    if (oldest) cache.delete(oldest)
  }
  cache.set(key, { value: structuredClone(value), expiresAt: Date.now() + CACHE_TTL_MS })
}

function text(value, fallback = '') {
  return typeof value === 'string' ? value.trim() : fallback
}

function stringArray(value) {
  return Array.isArray(value) ? value.filter(v => typeof v === 'string').map(v => v.trim()).filter(Boolean) : []
}

function validateCareerMatches(data, allowedIds) {
  if (!data || !Array.isArray(data.matches)) throw new GeminiServiceError('Gemini returned an invalid career-match response', 'AI_INVALID_RESPONSE', 502)
  const matches = data.matches.filter(m => m && allowedIds.has(m.career_id)).map(m => ({
    career_id: m.career_id,
    match_score: Math.max(0, Math.min(100, Number.isFinite(Number(m.match_score)) ? Number(m.match_score) : 0)),
    match_reason: text(m.match_reason, 'Potential fit based on the assessment.'),
    reasons: stringArray(m.reasons),
    supporting_factors: stringArray(m.supporting_factors),
    concerns: stringArray(m.concerns),
    recommended_next_action: text(m.recommended_next_action, 'Review this career and its required skills.')
  }))
  if (!matches.length) throw new GeminiServiceError('Gemini returned no valid career matches', 'AI_INVALID_RESPONSE', 502)
  return { matches: matches.slice(0, 5) }
}

function validateSkillAnalysis(data) {
  if (!data || !Array.isArray(data.matching_skills) || !Array.isArray(data.skill_gaps)) {
    throw new GeminiServiceError('Gemini returned an invalid skill-analysis response', 'AI_INVALID_RESPONSE', 502)
  }
  const allowedPriority = new Set(['high', 'medium', 'low'])
  const allowedLevel = new Set(['beginner', 'developing', 'intermediate', 'strong', 'advanced', null])
  const gaps = data.skill_gaps.filter(g => g && typeof g.skill === 'string' && g.skill.trim()).map(g => ({
    skill: g.skill.trim(),
    priority: allowedPriority.has(g.priority) ? g.priority : 'medium',
    current_level: allowedLevel.has(g.current_level) ? g.current_level : null,
    target_level: ['developing', 'intermediate', 'strong', 'advanced'].includes(g.target_level) ? g.target_level : 'intermediate',
    reason: text(g.reason, 'This skill is useful for the selected career.'),
    learning_resources: stringArray(g.learning_resources),
    estimated_learning_time: text(g.estimated_learning_time, '2-4 weeks')
  }))
  return {
    matching_skills: stringArray(data.matching_skills),
    skill_gaps: gaps,
    summary: text(data.summary, 'Focus on the highest-priority skill gaps first.'),
    next_actions: stringArray(data.next_actions)
  }
}

function validateRoadmap(data, careerTitle) {
  if (!data || !Array.isArray(data.milestones) || !Array.isArray(data.phases)) {
    throw new GeminiServiceError('Gemini returned an invalid learning-roadmap response', 'AI_INVALID_RESPONSE', 502)
  }
  const phases = data.phases.filter(p => p && typeof p.name === 'string').slice(0, 6).map((p, phaseIndex) => ({
    name: p.name.trim(),
    description: text(p.description, 'Build the skills needed for the next stage.'),
    duration: text(p.duration, '2-4 weeks'),
    steps: Array.isArray(p.steps) ? p.steps.filter(s => s && typeof s.title === 'string').slice(0, 8).map((s, stepIndex) => ({
      id: text(s.id, `phase-${phaseIndex + 1}-step-${stepIndex + 1}`).replace(/[^a-zA-Z0-9_-]/g, '-').slice(0, 80),
      title: s.title.trim(),
      skill: text(s.skill, 'Career readiness'),
      objective: text(s.objective, 'Build practical ability through focused practice.'),
      practice_activity: text(s.practice_activity, 'Practice the skill with guided exercises.'),
      project_recommendation: text(s.project_recommendation, `Build a small project related to ${careerTitle}.`),
      status: s.status === 'completed' ? 'completed' : 'not_started'
    })) : []
  }))
  if (!phases.length) throw new GeminiServiceError('Gemini returned no valid roadmap phases', 'AI_INVALID_RESPONSE', 502)
  return {
    overview: text(data.overview, `Personalized roadmap for ${careerTitle}`),
    milestones: stringArray(data.milestones).slice(0, 10),
    phases
  }
}

async function generateStructured({ operation, prompt, schema, input }) {
  const key = cacheKey(operation, input)
  const cached = getCached(key)
  if (cached) return cached

  let response
  try {
    response = await getClient().models.generateContent({
      model: MODEL,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseJsonSchema: schema
      }
    })
  } catch (error) {
    const status = Number(error?.status || error?.code || 0)
    const message = String(error?.message || error)
    if (status === 429 || /429|resource.?exhausted|rate limit/i.test(message)) {
      throw new GeminiServiceError('Gemini is temporarily rate limited', 'AI_RATE_LIMITED', 429)
    }
    if (/timeout|timed out|aborted|deadline/i.test(message)) {
      throw new GeminiServiceError('Gemini request timed out', 'AI_TIMEOUT', 504)
    }
    if (/api.?key|unauthenticated|permission|403/i.test(message)) {
      throw new GeminiServiceError('Gemini authentication failed', 'AI_AUTH_ERROR', 503)
    }
    throw new GeminiServiceError('Gemini is temporarily unavailable', 'AI_UNAVAILABLE', 503)
  }

  let parsed
  try {
    parsed = JSON.parse(response?.text || '')
  } catch {
    throw new GeminiServiceError('Gemini returned invalid structured data', 'AI_INVALID_RESPONSE', 502)
  }

  setCached(key, parsed)
  return parsed
}

const careerMatchSchema = {
  type: 'object',
  properties: {
    matches: { type: 'array', items: { type: 'object', properties: {
      career_id: { type: 'string' }, match_score: { type: 'number', minimum: 0, maximum: 100 },
      match_reason: { type: 'string' }, reasons: { type: 'array', items: { type: 'string' } },
      supporting_factors: { type: 'array', items: { type: 'string' } }, concerns: { type: 'array', items: { type: 'string' } },
      recommended_next_action: { type: 'string' }
    }, required: ['career_id', 'match_score', 'match_reason', 'reasons', 'supporting_factors', 'concerns', 'recommended_next_action'], additionalProperties: false } }
  },
  required: ['matches'], additionalProperties: false
}

const skillAnalysisSchema = {
  type: 'object',
  properties: {
    matching_skills: { type: 'array', items: { type: 'string' } },
    skill_gaps: { type: 'array', items: { type: 'object', properties: {
      skill: { type: 'string' }, priority: { type: 'string', enum: ['high', 'medium', 'low'] },
      current_level: { type: ['string', 'null'], enum: ['beginner', 'developing', 'intermediate', 'strong', 'advanced', null] },
      target_level: { type: 'string', enum: ['developing', 'intermediate', 'strong', 'advanced'] },
      reason: { type: 'string' }, learning_resources: { type: 'array', items: { type: 'string' } }, estimated_learning_time: { type: 'string' }
    }, required: ['skill', 'priority', 'current_level', 'target_level', 'reason', 'learning_resources', 'estimated_learning_time'], additionalProperties: false } },
    summary: { type: 'string' }, next_actions: { type: 'array', items: { type: 'string' } }
  },
  required: ['matching_skills', 'skill_gaps', 'summary', 'next_actions'], additionalProperties: false
}

const roadmapSchema = {
  type: 'object',
  properties: {
    overview: { type: 'string' }, milestones: { type: 'array', items: { type: 'string' } },
    phases: { type: 'array', items: { type: 'object', properties: {
      name: { type: 'string' }, description: { type: 'string' }, duration: { type: 'string' },
      steps: { type: 'array', items: { type: 'object', properties: {
        id: { type: 'string' }, title: { type: 'string' }, skill: { type: 'string' }, objective: { type: 'string' },
        practice_activity: { type: 'string' }, project_recommendation: { type: 'string' }, status: { type: 'string', enum: ['not_started', 'completed'] }
      }, required: ['id', 'title', 'skill', 'objective', 'practice_activity', 'project_recommendation', 'status'], additionalProperties: false } }
    }, required: ['name', 'description', 'duration', 'steps'], additionalProperties: false } }
  }, required: ['overview', 'milestones', 'phases'], additionalProperties: false
}

export async function generateCareerMatches(a, careers) {
  const options = careers.map(c => ({ id: c.id, title: c.title, category: c.category, required_skills: c.required_skills || [], description: c.description }))
  const data = await generateStructured({
    operation: 'career-matches', input: { a, options }, schema: careerMatchSchema,
    prompt: `You are a careful career advisor. Choose 3 to 5 careers ONLY from the provided list. Scores are estimates, not facts. Student profile: ${JSON.stringify(a)}. Careers: ${JSON.stringify(options)}`
  })
  return validateCareerMatches(data, new Set(options.map(c => c.id))).matches
}

export async function generateSkillAnalysis(a, career) {
  const target = { title: career.title, required_skills: career.required_skills || [], recommended_skills: career.recommended_skills || [] }
  const data = await generateStructured({
    operation: 'skill-analysis', input: { a, target }, schema: skillAnalysisSchema,
    prompt: `You are a career skills analyst. Compare the student's skills with the target career. Do not invent certifications or URLs. Student assessment: ${JSON.stringify(a)}. Target career: ${JSON.stringify(target)}`
  })
  return validateSkillAnalysis(data)
}

export async function generateLearningRoadmap(student, career) {
  const target = { title: career.title, required_skills: career.required_skills || [], recommended_skills: career.recommended_skills || [] }
  const data = await generateStructured({
    operation: 'learning-roadmap', input: { student, target }, schema: roadmapSchema,
    prompt: `You are an expert learning planner. Create a realistic personalized 4-6 phase roadmap based on skill gaps. Include projects, portfolio and interview/job preparation where relevant. Student data: ${JSON.stringify(student)}. Target career: ${JSON.stringify(target)}`
  })
  return validateRoadmap(data, career.title)
}

export function getFallbackCareerMatches(a, careers) {
  const textValue = JSON.stringify(a).toLowerCase()
  return careers.slice(0, 5).map((c, i) => {
    const skills = (c.required_skills || []).filter(s => textValue.includes(String(s).toLowerCase())).length
    return { career_id: c.id, match_score: Math.max(45, Math.min(90, 55 + skills * 10 - i * 3)), match_reason: `Recommended based on the skills, interests and preferences in your assessment. Explore ${c.title} further to validate the fit.`, reasons: ['Matches parts of your stated profile'], supporting_factors: [], concerns: [], recommended_next_action: `Review the required skills for ${c.title}` }
  })
}

export function getGeminiStatus() {
  return { configured: Boolean(process.env.GEMINI_API_KEY && !process.env.GEMINI_API_KEY.startsWith('your_')), model: MODEL }
}

// Phase 3: Career Intelligence layer. All new AI features use the same structured pipeline above.
const careerTwinSchema = { type:'object', properties:{ headline:{type:'string'}, strengths:{type:'array',items:{type:'string'}}, motivators:{type:'array',items:{type:'string'}}, work_style:{type:'string'}, best_fit_environments:{type:'array',items:{type:'string'}}, emerging_skills:{type:'array',items:{type:'string'}}, risks:{type:'array',items:{type:'string'}}, next_90_days:{type:'array',items:{type:'string'}}, identity_statement:{type:'string'} }, required:['headline','strengths','motivators','work_style','best_fit_environments','emerging_skills','risks','next_90_days','identity_statement'], additionalProperties:false }
const readinessSchema = { type:'object', properties:{ overall_score:{type:'number',minimum:0,maximum:100}, dimensions:{type:'array',items:{type:'object',properties:{name:{type:'string'},score:{type:'number',minimum:0,maximum:100},evidence:{type:'array',items:{type:'string'}},next_step:{type:'string'}},required:['name','score','evidence','next_step'],additionalProperties:false}}, top_gaps:{type:'array',items:{type:'string'}}, fastest_wins:{type:'array',items:{type:'string'}}, verdict:{type:'string'} }, required:['overall_score','dimensions','top_gaps','fastest_wins','verdict'], additionalProperties:false }
const jobMatchSchema = { type:'object', properties:{ overall_score:{type:'number',minimum:0,maximum:100}, verdict:{type:'string'}, factors:{type:'array',items:{type:'object',properties:{name:{type:'string'},score:{type:'number',minimum:0,maximum:100},weight:{type:'number',minimum:0,maximum:100},evidence:{type:'string'},improvement:{type:'string'}},required:['name','score','weight','evidence','improvement'],additionalProperties:false}}, strengths:{type:'array',items:{type:'string'}}, gaps:{type:'array',items:{type:'string'}}, actions:{type:'array',items:{type:'string'}} }, required:['overall_score','verdict','factors','strengths','gaps','actions'], additionalProperties:false }
const gapSchema = { type:'object', properties:{ readiness_percent:{type:'number',minimum:0,maximum:100}, matches:{type:'array',items:{type:'string'}}, gaps:{type:'array',items:{type:'object',properties:{skill:{type:'string'},priority:{type:'string',enum:['high','medium','low']},current_level:{type:'string'},target_level:{type:'string'},why_it_matters:{type:'string'},proof_to_build:{type:'string'}},required:['skill','priority','current_level','target_level','why_it_matters','proof_to_build'],additionalProperties:false}}, action_plan:{type:'array',items:{type:'string'}} }, required:['readiness_percent','matches','gaps','action_plan'], additionalProperties:false }
const copilotSchema = { type:'object', properties:{ fit_summary:{type:'string'}, tailored_resume_bullets:{type:'array',items:{type:'string'}}, cover_letter:{type:'string'}, evidence_to_highlight:{type:'array',items:{type:'string'}}, missing_evidence:{type:'array',items:{type:'string'}}, application_checklist:{type:'array',items:{type:'string'}} }, required:['fit_summary','tailored_resume_bullets','cover_letter','evidence_to_highlight','missing_evidence','application_checklist'], additionalProperties:false }
const interviewSchema = { type:'object', properties:{ question:{type:'string'}, category:{type:'string'}, difficulty:{type:'string',enum:['easy','medium','hard']}, what_good_answers_show:{type:'array',items:{type:'string'}}, evaluation:{type:'object',properties:{score:{type:'number',minimum:0,maximum:100},strengths:{type:'array',items:{type:'string'}},improvements:{type:'array',items:{type:'string'}},better_answer:{type:'string'}},required:['score','strengths','improvements','better_answer'],additionalProperties:false}, next_question:{type:'string'} }, required:['question','category','difficulty','what_good_answers_show','evaluation','next_question'], additionalProperties:false }
const whatIfSchema = { type:'object', properties:{ scenario_title:{type:'string'}, projected_score:{type:'number',minimum:0,maximum:100}, score_change:{type:'number',minimum:-100,maximum:100}, assumptions:{type:'array',items:{type:'string'}}, benefits:{type:'array',items:{type:'string'}}, tradeoffs:{type:'array',items:{type:'string'}}, next_actions:{type:'array',items:{type:'string'}}, recommendation:{type:'string'} }, required:['scenario_title','projected_score','score_change','assumptions','benefits','tradeoffs','next_actions','recommendation'], additionalProperties:false }
const radarSchema = { type:'object', properties:{ summary:{type:'string'}, opportunities:{type:'array',items:{type:'object',properties:{title:{type:'string'},type:{type:'string'},reason:{type:'string'},fit_score:{type:'number',minimum:0,maximum:100},action:{type:'string'}},required:['title','type','reason','fit_score','action'],additionalProperties:false}}, watch_next:{type:'array',items:{type:'string'}} }, required:['summary','opportunities','watch_next'], additionalProperties:false }
const journeySchema = { type:'object', properties:{ north_star:{type:'string'}, current_stage:{type:'string'}, progress_percent:{type:'number',minimum:0,maximum:100}, stages:{type:'array',items:{type:'object',properties:{name:{type:'string'},status:{type:'string',enum:['done','current','next','locked']},headline:{type:'string'},actions:{type:'array',items:{type:'string'}}},required:['name','status','headline','actions'],additionalProperties:false}}, weekly_focus:{type:'array',items:{type:'string'}}, celebration:{type:'string'} }, required:['north_star','current_stage','progress_percent','stages','weekly_focus','celebration'], additionalProperties:false }

const validateTextList = (value, max=8) => stringArray(value).slice(0,max)
function validateTwin(d){ if(!d?.headline) throw new GeminiServiceError('Invalid career twin response','AI_INVALID_RESPONSE',502); return {...d,strengths:validateTextList(d.strengths),motivators:validateTextList(d.motivators),best_fit_environments:validateTextList(d.best_fit_environments),emerging_skills:validateTextList(d.emerging_skills),risks:validateTextList(d.risks),next_90_days:validateTextList(d.next_90_days),headline:text(d.headline),work_style:text(d.work_style),identity_statement:text(d.identity_statement)} }
function validateReadiness(d){ if(!Array.isArray(d?.dimensions)) throw new GeminiServiceError('Invalid readiness response','AI_INVALID_RESPONSE',502); return {...d,overall_score:Math.max(0,Math.min(100,Number(d.overall_score)||0)),dimensions:d.dimensions.slice(0,8).map(x=>({name:text(x.name,'Readiness'),score:Math.max(0,Math.min(100,Number(x.score)||0)),evidence:validateTextList(x.evidence,5),next_step:text(x.next_step,'Keep building evidence.')})),top_gaps:validateTextList(d.top_gaps),fastest_wins:validateTextList(d.fastest_wins),verdict:text(d.verdict,'Keep building practical evidence toward your target role.')} }
function validateMatch(d){ if(!Array.isArray(d?.factors)) throw new GeminiServiceError('Invalid job match response','AI_INVALID_RESPONSE',502); return {...d,overall_score:Math.max(0,Math.min(100,Number(d.overall_score)||0)),verdict:text(d.verdict),factors:d.factors.slice(0,8).map(x=>({name:text(x.name,'Fit'),score:Math.max(0,Math.min(100,Number(x.score)||0)),weight:Math.max(0,Math.min(100,Number(x.weight)||0)),evidence:text(x.evidence),improvement:text(x.improvement)})),strengths:validateTextList(d.strengths),gaps:validateTextList(d.gaps),actions:validateTextList(d.actions)} }
function validateGap(d){ if(!Array.isArray(d?.gaps)) throw new GeminiServiceError('Invalid gap response','AI_INVALID_RESPONSE',502); return {...d,readiness_percent:Math.max(0,Math.min(100,Number(d.readiness_percent)||0)),matches:validateTextList(d.matches,15),gaps:d.gaps.slice(0,12).map(x=>({skill:text(x.skill),priority:['high','medium','low'].includes(x.priority)?x.priority:'medium',current_level:text(x.current_level,'unknown'),target_level:text(x.target_level,'working'),why_it_matters:text(x.why_it_matters),proof_to_build:text(x.proof_to_build)})).filter(x=>x.skill),action_plan:validateTextList(d.action_plan,10)} }
function validateCopilot(d){ if(!d?.cover_letter) throw new GeminiServiceError('Invalid application copilot response','AI_INVALID_RESPONSE',502); return {...d,fit_summary:text(d.fit_summary),tailored_resume_bullets:validateTextList(d.tailored_resume_bullets,8),cover_letter:text(d.cover_letter),evidence_to_highlight:validateTextList(d.evidence_to_highlight,8),missing_evidence:validateTextList(d.missing_evidence,8),application_checklist:validateTextList(d.application_checklist,10)} }
function validateInterview(d){ if(!d?.question||!d?.evaluation) throw new GeminiServiceError('Invalid interview response','AI_INVALID_RESPONSE',502); return {...d,question:text(d.question),category:text(d.category,'General'),difficulty:['easy','medium','hard'].includes(d.difficulty)?d.difficulty:'medium',what_good_answers_show:validateTextList(d.what_good_answers_show,6),evaluation:{score:Math.max(0,Math.min(100,Number(d.evaluation.score)||0)),strengths:validateTextList(d.evaluation.strengths,6),improvements:validateTextList(d.evaluation.improvements,6),better_answer:text(d.evaluation.better_answer)},next_question:text(d.next_question)} }
function validateWhatIf(d){ if(!d?.scenario_title) throw new GeminiServiceError('Invalid what-if response','AI_INVALID_RESPONSE',502); return {...d,scenario_title:text(d.scenario_title),projected_score:Math.max(0,Math.min(100,Number(d.projected_score)||0)),score_change:Math.max(-100,Math.min(100,Number(d.score_change)||0)),assumptions:validateTextList(d.assumptions),benefits:validateTextList(d.benefits),tradeoffs:validateTextList(d.tradeoffs),next_actions:validateTextList(d.next_actions),recommendation:text(d.recommendation)} }
function validateRadar(d){ if(!Array.isArray(d?.opportunities)) throw new GeminiServiceError('Invalid opportunity radar response','AI_INVALID_RESPONSE',502); return {...d,summary:text(d.summary),opportunities:d.opportunities.slice(0,8).map(x=>({title:text(x.title),type:text(x.type,'Opportunity'),reason:text(x.reason),fit_score:Math.max(0,Math.min(100,Number(x.fit_score)||0)),action:text(x.action)})).filter(x=>x.title),watch_next:validateTextList(d.watch_next)} }
function validateJourney(d){ if(!Array.isArray(d?.stages)) throw new GeminiServiceError('Invalid journey response','AI_INVALID_RESPONSE',502); return {...d,north_star:text(d.north_star),current_stage:text(d.current_stage),progress_percent:Math.max(0,Math.min(100,Number(d.progress_percent)||0)),stages:d.stages.slice(0,10).map(x=>({name:text(x.name),status:['done','current','next','locked'].includes(x.status)?x.status:'next',headline:text(x.headline),actions:validateTextList(x.actions,6)})).filter(x=>x.name),weekly_focus:validateTextList(d.weekly_focus,7),celebration:text(d.celebration)} }

export async function generateCareerTwin(input){ const d=await generateStructured({operation:'career-twin',input,schema:careerTwinSchema,prompt:`Create a career twin: a concise evidence-based profile of how this student is likely to work, what motivates them, where they fit, and what could derail them. Do not invent credentials. Student data: ${JSON.stringify(input)}`}); return validateTwin(d) }
export async function generateCareerReadiness(input){ const d=await generateStructured({operation:'career-readiness',input,schema:readinessSchema,prompt:`Score career readiness from 0-100 for the target role. Use only supplied evidence. Dimensions should cover skills, evidence/projects, application readiness, interview readiness, and direction. Student/career/job data: ${JSON.stringify(input)}`}); return validateReadiness(d) }
export async function generateExplainableJobMatch(input){ const d=await generateStructured({operation:'job-match',input,schema:jobMatchSchema,prompt:`Explain a job match score for this student and job. Use weighted factors, evidence from supplied data, and concrete improvements. Never invent experience. Data: ${JSON.stringify(input)}`}); return validateMatch(d) }
export async function generateJobSkillGap(input){ const d=await generateStructured({operation:'job-skill-gap',input,schema:gapSchema,prompt:`Compare the student's current skills with this specific job. Identify matches and the smallest high-impact gaps. Suggest proof the student can build. Data: ${JSON.stringify(input)}`}); return validateGap(d) }
export async function generateApplicationCopilot(input){ const d=await generateStructured({operation:'application-copilot',input,schema:copilotSchema,prompt:`Act as an ethical application copilot. Tailor a truthful application to the job using only supplied student evidence. Never invent employers, degrees, metrics, projects or certifications. Data: ${JSON.stringify(input)}`}); return validateCopilot(d) }
export async function generateInterviewTurn(input){ const d=await generateStructured({operation:'interview-simulator',input,schema:interviewSchema,prompt:`Run a realistic job interview. If answer is present, evaluate it fairly and then ask the next question. If no answer is present, ask the first question. Target role and context: ${JSON.stringify(input)}`}); return validateInterview(d) }
export async function generateCareerWhatIf(input){ const d=await generateStructured({operation:'career-what-if',input,schema:whatIfSchema,prompt:`Simulate a career what-if scenario using transparent assumptions. Estimate directional impact on readiness, not guaranteed outcomes. Data: ${JSON.stringify(input)}`}); return validateWhatIf(d) }
export async function generateOpportunityRadar(input){ const d=await generateStructured({operation:'opportunity-radar',input,schema:radarSchema,prompt:`Create an opportunity radar from the supplied jobs and career target. Rank opportunities by fit and explain why. Do not invent jobs. Data: ${JSON.stringify(input)}`}); return validateRadar(d) }
export async function generateCareerJourney(input){ const d=await generateStructured({operation:'career-journey',input,schema:journeySchema,prompt:`Create a motivating but realistic career journey connecting assessment, career twin, skill gaps, roadmap, job match, application, interview and readiness. Current state: ${JSON.stringify(input)}`}); return validateJourney(d) }
