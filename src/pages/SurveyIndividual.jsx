import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAssessment } from '../context/AssessmentContext'
import { CLUSTER_QUESTIONS, computeIndividualScores } from '../data/individualQuestions'
import { supabase, SESSION_CODE } from '../lib/supabase'
import Logo from '../components/Logo'

// Target table: openday_individual_capability
const INDIVIDUAL_TABLE = 'openday_individual_capability'

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
            <span className={`inline-flex items-center justify-center w-5 h-5 rounded border-2 mr-3 transition-colors
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
      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00ADA9] focus:border-transparent transition-all duration-200 text-gray-800 resize-none text-sm"
    />
  )
}

export default function SurveyIndividual() {
  const navigate = useNavigate()
  const {
    assessmentData,
    updateIndividualResponse,
    setIndividualScores,
    setIndividualResponseId,
  } = useAssessment()

  const { path, intake, orgResponseId, individualResponses } = assessmentData
  const cluster = intake.cluster || 'A'
  const questions = CLUSTER_QUESTIONS[cluster] || CLUSTER_QUESTIONS.A

  const [currentQ, setCurrentQ] = useState(0)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState(null)

  useEffect(() => {
    if (!intake.firstName) navigate('/')
  }, [intake.firstName, navigate])

  const question = questions[currentQ]
  const response = individualResponses[currentQ]
  const isLast = currentQ === questions.length - 1

  const isAnswered = () => {
    if (question.type === 'single_select') return response !== null && response !== undefined
    if (question.type === 'multi_select') return Array.isArray(response) && response.length > 0
    if (question.type === 'open_text') return typeof response === 'string' && response.trim().length > 0
    return false
  }

  const handleSingleSelect = (index) => {
    updateIndividualResponse(currentQ, index)
    setSaveError(null)
  }

  const handleMultiToggle = (index) => {
    const current = Array.isArray(response) ? response : []
    if (current.includes(index)) {
      updateIndividualResponse(currentQ, current.filter(i => i !== index))
    } else {
      if (question.maxSelect && current.length >= question.maxSelect) {
        updateIndividualResponse(currentQ, [...current.slice(1), index])
      } else {
        updateIndividualResponse(currentQ, [...current, index])
      }
    }
    setSaveError(null)
  }

  const handleOpenText = (text) => {
    updateIndividualResponse(currentQ, text)
    setSaveError(null)
  }

  const handleNext = async () => {
    if (!isAnswered()) return

    if (!isLast) {
      setCurrentQ(prev => prev + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    // Final question — compute scores and save to openday_individual_capability
    setSaving(true)
    setSaveError(null)

    try {
      // Compute dimension and capability scores from all responses
      const scores = computeIndividualScores(individualResponses, cluster)
      setIndividualScores(scores)

      // Build l2_q1 through l2_q15 answer text fields
      const answerFields = {}
      questions.forEach((q, i) => {
        const r = individualResponses[i]
        if (r === null || r === undefined) {
          answerFields[`l2_q${i + 1}`] = null
        } else if (Array.isArray(r)) {
          // multi_select: store selected option texts joined
          const texts = r.map(idx => q.options?.[idx]?.text || String(idx))
          answerFields[`l2_q${i + 1}`] = texts.join(', ')
        } else if (typeof r === 'number') {
          // single_select: store the selected option text
          answerFields[`l2_q${i + 1}`] = q.options?.[r]?.text || String(r)
        } else {
          // open_text: store raw string
          answerFields[`l2_q${i + 1}`] = String(r)
        }
      })

      // Build the full payload for openday_individual_capability
      const payload = {
        // For full path: links to the org response row via UUID
        // For individual-only path: null (no org response exists)
        response_id: orgResponseId || null,

        // Participant details from intake form
        first_name: intake.firstName,
        organisation: intake.organisation,
        industry: intake.industry,
        role_level: intake.roleLevel,
        cluster,                        // A | B | C | D | E

        // Session metadata
        session_code: SESSION_CODE,     // 'JBOPEN2026'
        cycle: 1,

        // Dimension scores (1–4 scale averages)
        d1_awareness_score: scores.dimensionAverages.D1,
        d2_tool_use_score: scores.dimensionAverages.D2,
        d3_prompt_ability_score: scores.dimensionAverages.D3,
        d4_opportunity_score: scores.dimensionAverages.D4,
        d5_workflow_score: scores.dimensionAverages.D5,

        // Overall capability score (1–4 scale average)
        overall_capability_score: scores.overallAverage,

        // Derived labels and learning focus
        capability_label: scores.capabilityLabel,
        primary_learning_focus: scores.primaryLearningFocus,
        secondary_learning_focus: scores.secondaryLearningFocus,
        is_champion: scores.isChampion,

        // Raw answer text for all 15 questions (l2_q1 – l2_q15)
        ...answerFields,

        submitted_at: new Date().toISOString(),
      }

      console.log('[DEBUG] About to insert payload:', JSON.stringify(payload))
      const { data, error } = await supabase
        .from(INDIVIDUAL_TABLE)
        .insert(payload)
        .select('id')
        .single()

      console.log('[DEBUG] Insert result - data:', data, 'error:', error)
      if (error) {
        alert('Save error: ' + error.message + ' | Code: ' + error.code)
      }

      if (error) {
        setSaveError(`Could not save your responses: ${error.message}`)
        return
      }

      if (data?.id) {
        setIndividualResponseId(data.id)
      }
    } catch (err) {
      console.error('[SurveyIndividual] Unexpected error:', err)
      setSaveError('An unexpected error occurred. Please try again.')
      return
    } finally {
      setSaving(false)
    }

    navigate('/results')
  }

  const handleBack = () => {
    if (currentQ > 0) {
      setCurrentQ(prev => prev - 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#1B3A5C] px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Logo />
          <span className="text-white/60 text-sm hidden sm:block">Personal AI Capability</span>
        </div>
      </div>

      {/* Progress */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-6 py-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#00ADA9]">
              Question {currentQ + 1} of {questions.length}
            </span>
            <span className="text-xs text-gray-500">{Math.round((currentQ / questions.length) * 100)}% complete</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2">
            <div
              className="bg-[#00ADA9] h-2 rounded-full transition-all duration-500"
              style={{ width: `${(currentQ / questions.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-6 py-8 fade-in">
        {/* Question badge */}
        <div className="mb-6">
          <span className="inline-flex items-center gap-1.5 bg-[#E6FAF9] text-[#00ADA9] text-xs font-bold px-3 py-1.5 rounded-full">
            Q{currentQ + 1} of {questions.length}
          </span>
        </div>

        {/* Save error banner */}
        {saveError && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-start gap-3">
            <svg className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-red-700 text-xs">{saveError}</p>
              <button
                type="button"
                onClick={() => navigate('/results')}
                className="text-xs text-red-500 underline mt-1.5 hover:text-red-700"
              >
                Continue without saving →
              </button>
            </div>
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
              onSelect={handleSingleSelect}
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
              onChange={handleOpenText}
              placeholder={question.placeholder}
            />
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={handleBack}
            disabled={currentQ === 0}
            className={`flex items-center gap-2 font-medium py-3 px-4 rounded-xl border transition-colors
              ${currentQ === 0
                ? 'border-gray-100 text-gray-300 cursor-not-allowed'
                : 'border-gray-200 text-gray-500 hover:text-[#1B3A5C] hover:border-gray-300'
              }`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>

          <button
            type="button"
            onClick={handleNext}
            disabled={!isAnswered() || saving}
            className={`flex-1 flex items-center justify-center gap-2 font-bold py-4 px-6 rounded-xl transition-all duration-200 text-base
              ${isAnswered() && !saving
                ? 'bg-[#00ADA9] hover:bg-[#008a87] text-white shadow-md'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
          >
            {saving ? (
              <>
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Saving...
              </>
            ) : isLast ? (
              <>
                See My Results
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </>
            ) : (
              <>
                Next
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
