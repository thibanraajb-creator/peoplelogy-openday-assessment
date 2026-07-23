import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAssessment } from '../context/AssessmentContext'
import {
  SAFETY_PILLARS,
  SAFETY_QUESTIONS,
  GOVERNANCE_QUESTION,
  computeSafetyScores,
} from '../data/safetyQuestions'
import { EVENT_LABEL } from '../data/eventConfig'
import { supabase, SESSION_CODE } from '../lib/supabase'
import Logo from '../components/Logo'

// Questions grouped by pillar, in the order the pillars are defined
const PILLAR_GROUPS = SAFETY_PILLARS.map(p => ({
  ...p,
  questions: SAFETY_QUESTIONS.filter(q => q.pillar === p.key),
}))

export default function SurveySafety() {
  const navigate = useNavigate()
  const { assessmentData } = useAssessment()
  const { intake } = assessmentData
  const cluster = intake.cluster || 'A'

  // responses: { [questionId]: optionIndex }; governance: option value string
  const [responses, setResponses] = useState({})
  const [governance, setGovernance] = useState(null)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState(null)

  useEffect(() => {
    if (!intake.firstName) navigate('/')
  }, [intake.firstName, navigate])

  const answeredCount = SAFETY_QUESTIONS.filter(q => responses[q.id] !== undefined).length
  const totalCount = SAFETY_QUESTIONS.length
  const allScoredAnswered = answeredCount === totalCount
  const allAnswered = allScoredAnswered && governance !== null

  // Governance question sits after the 15 scored questions
  const progressCount = answeredCount + (governance !== null ? 1 : 0)
  const progressPct = Math.round((progressCount / (totalCount + 1)) * 100)

  const selectOption = (questionId, optionIdx) => {
    setResponses(prev => ({ ...prev, [questionId]: optionIdx }))
    setSaveError(null)
  }

  const handleSubmit = async () => {
    if (!allAnswered) return
    setSaving(true)
    setSaveError(null)

    const scores = computeSafetyScores(responses, cluster, governance)

    const payload = {
      session_code:  SESSION_CODE,
      first_name:    intake.firstName,
      organisation:  intake.organisation,
      industry:      intake.industry,
      role_level:    intake.roleLevel,
      cluster,
      submitted_at:  new Date().toISOString(),
      ...scores.answers,                    // p1_q1 … p3_q5
      governance_role:  governance,
      safety_score:     scores.pillarScores[0].percentage,
      trust_score:      scores.pillarScores[1].percentage,
      resilience_score: scores.pillarScores[2].percentage,
      overall_score:    scores.overallPercentage,
      capacity_label:   scores.capacityLabel,
      weakest_pillar:   scores.weakestPillar,
      primary_focus:    scores.primaryFocus,
      recommended_tier: scores.tierNumber,
      urgency:          scores.urgency,
    }

    const { error } = await supabase
      .from('openday_safety')
      .insert([payload])
      .select('id')
      .single()

    console.log('[SurveySafety] Insert error:', error)
    if (error) {
      setSaveError('Save error: ' + error.message)
      setSaving(false)
      return
    }

    setSaving(false)
    navigate('/results/safety', { state: { scores } })
  }

  // Running question number across all scored questions
  let questionNumber = 0

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Navbar */}
      <div className="bg-[#1B3A5C] px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="bg-white/10 hover:bg-white/20 text-white rounded-lg p-2 flex items-center gap-2 text-sm font-medium"
            >
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </button>
            <Logo height={36} />
          </div>
          <span className="text-white/60 text-sm">AI Safety &amp; Digital Trust</span>
        </div>
      </div>

      {/* Progress bar — sticky */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-6 py-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#00ADA9]">
              {progressCount} of {totalCount + 1} answered
            </span>
            <span className="text-xs text-gray-500">{progressPct}%</span>
          </div>
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPct}%`, backgroundColor: '#00ADA9' }}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-6 py-8">

        {/* Intro */}
        <div className="mb-6">
          <p className="text-[#00ADA9] text-xs font-bold uppercase tracking-widest mb-1">
            {EVENT_LABEL}
          </p>
          <h1 className="text-[#1B3A5C] font-black text-2xl mb-1">AI Safety Capacity &amp; Digital Trust</h1>
          <p className="text-gray-500 text-sm">
            Three pillars — AI Safety, Digital Trust, and Resilience. Answer honestly; there are no right answers.
          </p>
        </div>

        {/* Save error banner */}
        {saveError && (
          <div className="mb-5 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
            <p className="text-red-700 text-xs">{saveError}</p>
          </div>
        )}

        {/* Pillar groups */}
        {PILLAR_GROUPS.map((pillar, pi) => (
          <div key={pillar.key} className="mb-8">
            {/* Pillar header */}
            <div
              className="bg-white rounded-2xl p-6 mb-4 border border-gray-100"
              style={{ borderLeft: `4px solid ${pillar.color}` }}
            >
              <p className="text-xs font-bold uppercase tracking-wide mb-1" style={{ color: pillar.color }}>
                Pillar {pi + 1} of {PILLAR_GROUPS.length}
              </p>
              <h2 className="text-[#1B3A5C] font-bold text-xl mb-1">{pillar.name}</h2>
              <p className="text-gray-500 text-sm">{pillar.definition}</p>
            </div>

            {/* Questions */}
            <div className="space-y-4">
              {pillar.questions.map(q => {
                questionNumber += 1
                const selected = responses[q.id]
                return (
                  <div key={q.id} className="bg-white rounded-xl p-5 border border-gray-100">
                    <div className="flex items-start gap-2 mb-4">
                      <span
                        className="text-white text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0 mt-0.5"
                        style={{ backgroundColor: pillar.color }}
                      >
                        Q{questionNumber}
                      </span>
                      <p className="text-[#1B3A5C] font-medium text-sm leading-relaxed">{q.text}</p>
                    </div>
                    <div className="space-y-3">
                      {q.options.map((opt, oi) => (
                        <button
                          key={oi}
                          type="button"
                          onClick={() => selectOption(q.id, oi)}
                          className={`w-full text-left px-5 py-4 rounded-xl border-2 transition-all duration-150 text-sm leading-relaxed
                            ${selected === oi
                              ? 'border-[#00ADA9] bg-[#E6FAF9] text-[#1B3A5C] font-medium'
                              : 'border-gray-200 bg-white text-gray-700 hover:border-[#00ADA9]/40 hover:bg-gray-50'
                            }`}
                        >
                          <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold mr-3
                            ${selected === oi ? 'bg-[#00ADA9] text-white' : 'bg-gray-100 text-gray-500'}`}>
                            {String.fromCharCode(65 + oi)}
                          </span>
                          {opt.text}
                        </button>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}

        {/* Governance routing question */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl p-6 mb-4 border border-gray-100" style={{ borderLeft: '4px solid #1B3A5C' }}>
            <p className="text-xs font-bold uppercase tracking-wide mb-1 text-[#1B3A5C]">Final question</p>
            <h2 className="text-[#1B3A5C] font-bold text-xl mb-1">Your role in AI governance</h2>
            <p className="text-gray-500 text-sm">This determines your recommended programme tier — it is not scored.</p>
          </div>

          <div className="bg-white rounded-xl p-5 border border-gray-100">
            <p className="text-[#1B3A5C] font-medium text-sm leading-relaxed mb-4">{GOVERNANCE_QUESTION.text}</p>
            <div className="space-y-3">
              {GOVERNANCE_QUESTION.options.map((opt, oi) => (
                <button
                  key={oi}
                  type="button"
                  onClick={() => { setGovernance(opt.value); setSaveError(null) }}
                  className={`w-full text-left px-5 py-4 rounded-xl border-2 transition-all duration-150 text-sm leading-relaxed
                    ${governance === opt.value
                      ? 'border-[#00ADA9] bg-[#E6FAF9] text-[#1B3A5C] font-medium'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-[#00ADA9]/40 hover:bg-gray-50'
                    }`}
                >
                  <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold mr-3
                    ${governance === opt.value ? 'bg-[#00ADA9] text-white' : 'bg-gray-100 text-gray-500'}`}>
                    {String.fromCharCode(65 + oi)}
                  </span>
                  {opt.text}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Submit */}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!allAnswered || saving}
          className={`w-full flex items-center justify-center gap-2 font-bold py-4 rounded-xl transition-all duration-200 text-base
            ${allAnswered && !saving
              ? 'bg-[#00ADA9] hover:bg-[#008a87] text-white'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
        >
          {saving ? 'Saving…' : allAnswered ? 'See My Safety Report' : `Answer all ${totalCount + 1} questions to continue`}
        </button>

      </div>
    </div>
  )
}
