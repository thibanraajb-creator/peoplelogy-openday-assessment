import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAssessment } from '../context/AssessmentContext'
import { CLUSTER_QUESTIONS, computeIndividualScores } from '../data/individualQuestions'
import { supabase, SESSION_CODE } from '../lib/supabase'
import Logo from '../components/Logo'

// ── Answer input components ───────────────────────────────────────────────────

function SingleSelect({ options, selected, onSelect }) {
  return (
    <div className="space-y-3">
      {options.map((opt, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onSelect(i)}
          className={`w-full text-left px-5 py-4 rounded-xl border-2 transition-all duration-150 text-sm leading-relaxed
            ${selected === i
              ? 'border-[#00ADA9] bg-[#E6FAF9] text-[#1B3A5C] font-medium'
              : 'border-gray-200 bg-white text-gray-700 hover:border-[#00ADA9]/40 hover:bg-gray-50'
            }`}
        >
          <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold mr-3
            ${selected === i ? 'bg-[#00ADA9] text-white' : 'bg-gray-100 text-gray-500'}`}>
            {String.fromCharCode(65 + i)}
          </span>
          {opt.text}
        </button>
      ))}
    </div>
  )
}

function MultiSelect({ options, selected, onToggle, maxSelect }) {
  return (
    <div className="space-y-3">
      {maxSelect && (
        <p className="text-xs text-gray-500 mb-2">Select up to {maxSelect}</p>
      )}
      {options.map((opt, i) => {
        const isSelected = selected.includes(i)
        const isDisabled = maxSelect && !isSelected && selected.length >= maxSelect
        return (
          <button
            key={i}
            type="button"
            onClick={() => !isDisabled && onToggle(i)}
            disabled={isDisabled}
            className={`w-full text-left px-5 py-4 rounded-xl border-2 transition-all duration-150 text-sm leading-relaxed
              ${isSelected
                ? 'border-[#00ADA9] bg-[#E6FAF9] text-[#1B3A5C] font-medium'
                : isDisabled
                ? 'border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed'
                : 'border-gray-200 bg-white text-gray-700 hover:border-[#00ADA9]/40 hover:bg-gray-50'
              }`}
          >
            <span className={`inline-flex items-center justify-center w-5 h-5 rounded border-2 mr-3 transition-colors flex-shrink-0
              ${isSelected ? 'bg-[#00ADA9] border-[#00ADA9]' : 'border-gray-300'}`}>
              {isSelected && (
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </span>
            {opt.text}
          </button>
        )
      })}
    </div>
  )
}

function OpenText({ value, onChange, placeholder }) {
  return (
    <textarea
      value={value || ''}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder || 'Type your answer here...'}
      rows={4}
      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00ADA9] focus:border-transparent outline-none text-gray-800 resize-none text-sm transition-all duration-200"
    />
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function SurveyIndividual() {
  const navigate = useNavigate()
  const { assessmentData, setIndividualScores } = useAssessment()

  const cluster   = assessmentData.intake.cluster || 'A'
  const questions = CLUSTER_QUESTIONS[cluster] || CLUSTER_QUESTIONS.A

  const [responses,  setResponses]  = useState(Array(15).fill(null))
  const [currentQ,   setCurrentQ]   = useState(0)
  const [saving,     setSaving]     = useState(false)
  const [saveError,  setSaveError]  = useState(null)

  useEffect(() => {
    if (!assessmentData.intake.firstName) navigate('/')
  }, [assessmentData.intake.firstName, navigate])

  const question = questions[currentQ]
  const response = responses[currentQ]
  const isLast   = currentQ === questions.length - 1

  const isAnswered = () => {
    if (question.type === 'single_select') return response !== null && response !== undefined
    if (question.type === 'multi_select')  return Array.isArray(response) && response.length > 0
    if (question.type === 'open_text')     return true   // optional
    return false
  }

  const setResponse = (value) => {
    setResponses(prev => {
      const next = [...prev]
      next[currentQ] = value
      return next
    })
    setSaveError(null)
  }

  const handleMultiToggle = (idx) => {
    const current = Array.isArray(response) ? response : []
    if (current.includes(idx)) {
      setResponse(current.filter(i => i !== idx))
    } else if (question.maxSelect && current.length >= question.maxSelect) {
      setResponse([...current.slice(1), idx])
    } else {
      setResponse([...current, idx])
    }
  }

  const handleNext = async () => {
    if (!isAnswered()) return

    if (!isLast) {
      setCurrentQ(prev => prev + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    // ── Save logic ────────────────────────────────────────────────────────────
    setSaving(true)
    setSaveError(null)

    const scores = computeIndividualScores(responses, cluster)
    setIndividualScores(scores)

    const answerFields = {}
    questions.forEach((q, i) => {
      const r = responses[i]
      if (r === null || r === undefined) {
        answerFields['l2_q' + (i + 1)] = null
      } else if (Array.isArray(r)) {
        answerFields['l2_q' + (i + 1)] = r.map(idx => q.options?.[idx]?.text || String(idx)).join(', ')
      } else if (typeof r === 'number') {
        answerFields['l2_q' + (i + 1)] = q.options?.[r]?.text || String(r)
      } else {
        answerFields['l2_q' + (i + 1)] = String(r)
      }
    })

    const payload = {
      response_id:              assessmentData.orgResponseId || null,
      first_name:               assessmentData.intake.firstName,
      organisation:             assessmentData.intake.organisation,
      industry:                 assessmentData.intake.industry,
      role_level:               assessmentData.intake.roleLevel,
      cluster,
      session_code:             SESSION_CODE,
      cycle:                    1,
      submitted_at:             new Date().toISOString(),
      d1_awareness_score:       scores.dimensionAverages.D1,
      d2_tool_score:            scores.dimensionAverages.D2,
      d3_prompt_score:          scores.dimensionAverages.D3,
      d4_opportunity_score:     scores.dimensionAverages.D4,
      d5_workflow_score:        scores.dimensionAverages.D5,
      overall_capability_score: scores.overallAverage,
      capability_label:         scores.capabilityLabel,
      primary_learning_focus:   scores.primaryLearningFocus,
      secondary_learning_focus: scores.secondaryLearningFocus,
      is_champion:              scores.isChampion,
      ...answerFields,
    }

    console.log('[SurveyIndividual] Inserting payload:', JSON.stringify(payload))
    console.log('[DEBUG] Full payload being sent:', JSON.stringify(payload, null, 2))

    console.log('[DEBUG] REBUILD - cluster value:', cluster, '| type:', typeof cluster)
    console.log('[DEBUG] scores:', JSON.stringify(scores))
    console.log('[DEBUG] intake:', JSON.stringify(assessmentData.intake))

    const { error: indError } = await supabase
      .from('openday_individual_capability')
      .insert([payload])

    console.log('[SurveyIndividual] Insert error:', indError)
    if (indError) {
      setSaveError('Save error: ' + indError.message)
      setSaving(false)
      return
    }

    setSaving(false)
    navigate('/results')
  }

  const progressPct = Math.round((currentQ / 15) * 100)

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
          <span className="text-white/60 text-sm">Personal AI Capability</span>
        </div>
      </div>

      {/* Progress bar — sticky */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-6 py-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#00ADA9]">
              Question {currentQ + 1} of 15
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

        {/* Question badge */}
        <div className="mb-6">
          <span className="inline-flex items-center bg-[#E6FAF9] text-[#00ADA9] text-xs font-bold px-3 py-1.5 rounded-full">
            Q{currentQ + 1} of 15
          </span>
        </div>

        {/* Save error banner */}
        {saveError && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
            <p className="text-red-700 text-xs">{saveError}</p>
          </div>
        )}

        {/* Question card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
          <h2 className="text-[#1B3A5C] font-semibold text-base leading-relaxed mb-6">
            {question.question}
          </h2>

          {question.type === 'single_select' && (
            <SingleSelect
              options={question.options}
              selected={response}
              onSelect={(i) => setResponse(i)}
            />
          )}

          {question.type === 'multi_select' && (
            <MultiSelect
              options={question.options}
              selected={Array.isArray(response) ? response : []}
              onToggle={handleMultiToggle}
              maxSelect={question.maxSelect}
            />
          )}

          {question.type === 'open_text' && (
            <OpenText
              value={response}
              onChange={(v) => setResponse(v)}
              placeholder={question.placeholder}
            />
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => { setCurrentQ(prev => prev - 1); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
            disabled={currentQ === 0}
            className="border border-gray-200 text-gray-500 rounded-xl px-4 py-3 disabled:opacity-40 disabled:cursor-not-allowed hover:border-gray-300 transition-colors"
          >
            ← Back
          </button>

          <button
            type="button"
            onClick={handleNext}
            disabled={!isAnswered() || saving}
            className={`flex-1 flex items-center justify-center gap-2 font-bold py-4 rounded-xl transition-all duration-200 text-base
              ${isAnswered() && !saving
                ? 'bg-[#00ADA9] hover:bg-[#008a87] text-white'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
          >
            {saving ? (
              <>
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Saving…
              </>
            ) : isLast ? (
              <>
                See My Results
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </>
            ) : (
              'Next →'
            )}
          </button>
        </div>

      </div>
    </div>
  )
}
