import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAssessment } from '../context/AssessmentContext'
import { ORG_PILLARS, LIKERT_LABELS, computeOrgScores } from '../data/orgQuestions'
import { supabase, SESSION_CODE } from '../lib/supabase'
import Logo from '../components/Logo'

// Target table: openday_responses
const ORG_TABLE = 'openday_responses'

function LikertButton({ value, label, selected, onClick }) {
  return (
    <button
      type="button"
      onClick={() => onClick(value)}
      className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all duration-150 flex-1 min-w-0
        ${selected
          ? 'border-[#00ADA9] bg-[#00ADA9] text-white shadow-md'
          : 'border-gray-200 bg-white text-gray-600 hover:border-[#00ADA9] hover:bg-[#E6FAF9]'
        }`}
    >
      <span className="text-lg font-bold">{value}</span>
      <span className="text-xs font-medium text-center leading-tight hidden sm:block">{label}</span>
    </button>
  )
}

export default function SurveyOrg() {
  const navigate = useNavigate()
  const { assessmentData, updateOrgResponses, setOrgScores, setOrgResponseId } = useAssessment()
  const { path, intake, orgResponses } = assessmentData

  const [currentPillar, setCurrentPillar] = useState(0) // 0-indexed
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState(null)

  useEffect(() => {
    if (!intake.firstName) navigate('/')
  }, [intake.firstName, navigate])

  const pillar = ORG_PILLARS[currentPillar]
  const pillarKey = `pillar${pillar.id}`
  const answers = orgResponses[pillarKey]
  const allAnswered = answers.every(a => a !== null)
  const answeredCount = answers.filter(a => a !== null).length
  const isLastPillar = currentPillar === ORG_PILLARS.length - 1

  const handleAnswer = (questionIndex, score) => {
    updateOrgResponses(pillar.id, questionIndex, score)
    setSaveError(null)
  }

  const handleNext = async () => {
    if (!allAnswered) return

    if (!isLastPillar) {
      setCurrentPillar(prev => prev + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    // Final pillar — compute scores and save to openday_responses
    setSaving(true)
    setSaveError(null)

    try {
      const finalResponses = { ...orgResponses }
      const scores = computeOrgScores(finalResponses)
      setOrgScores(scores)

      // Build p1_q1 through p5_q5 individual question score fields
      const questionFields = {}
      for (let p = 1; p <= 5; p++) {
        const pAnswers = finalResponses[`pillar${p}`]
        pAnswers.forEach((ans, qi) => {
          questionFields[`p${p}_q${qi + 1}`] = ans
        })
      }

      // Build the full payload for openday_responses
      const payload = {
        // Participant details from intake form
        first_name: intake.firstName,
        organisation: intake.organisation,
        industry: intake.industry,
        role_level: intake.roleLevel,

        // Session metadata
        session_code: SESSION_CODE,   // 'JBOPEN2026'
        cycle: 1,

        // Pillar raw sums (each out of 25)
        pillar1_score: finalResponses.pillar1.reduce((a, b) => a + (b || 0), 0),
        pillar2_score: finalResponses.pillar2.reduce((a, b) => a + (b || 0), 0),
        pillar3_score: finalResponses.pillar3.reduce((a, b) => a + (b || 0), 0),
        pillar4_score: finalResponses.pillar4.reduce((a, b) => a + (b || 0), 0),
        pillar5_score: finalResponses.pillar5.reduce((a, b) => a + (b || 0), 0),

        // Derived scores and labels
        overall_score: scores.overallPercentage,
        maturity_level: scores.maturityLevel,
        maturity_label: scores.maturityLabel,

        // Individual question scores (p1_q1 – p5_q5)
        ...questionFields,
      }

      // INSERT into openday_responses
      console.log('[SurveyOrg] Inserting into', ORG_TABLE, payload)
      const { data, error } = await supabase
        .from(ORG_TABLE)
        .insert(payload)
        .select('id')
        .single()

      if (error) {
        console.error('[SurveyOrg] Supabase insert error:', error)
        setSaveError(`Could not save your responses: ${error.message}`)
        return
      }

      console.log('[SurveyOrg] Successfully saved to', ORG_TABLE, 'id:', data.id)
      if (data?.id) {
        // Store the UUID so SurveyIndividual can link to it via response_id (full path)
        setOrgResponseId(data.id)
      }
    } catch (err) {
      console.error('[SurveyOrg] Unexpected error:', err)
      setSaveError('An unexpected error occurred. Please try again.')
      return
    } finally {
      setSaving(false)
    }

    if (path === 'full') {
      navigate('/transition')
    } else {
      navigate('/results')
    }
  }

  const handleBack = () => {
    if (currentPillar > 0) {
      setCurrentPillar(prev => prev - 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#1B3A5C] px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Logo />
          <span className="text-white/60 text-sm hidden sm:block">Organisation Readiness</span>
        </div>
      </div>

      {/* Progress */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-6 py-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#00ADA9]">
              Pillar {currentPillar + 1} of {ORG_PILLARS.length}
            </span>
            <span className="text-xs text-gray-500">
              {answeredCount}/{pillar.questions.length} answered
            </span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2">
            <div
              className="bg-[#00ADA9] h-2 rounded-full transition-all duration-500"
              style={{ width: `${((currentPillar * 5 + answeredCount) / 25) * 100}%` }}
            />
          </div>
          {/* Pillar progress dots */}
          <div className="flex gap-1 mt-2 justify-center">
            {ORG_PILLARS.map((p, i) => (
              <div
                key={p.id}
                className={`h-1.5 rounded-full transition-all duration-300 flex-1 ${
                  i < currentPillar
                    ? 'bg-[#00ADA9]'
                    : i === currentPillar
                    ? 'bg-[#00ADA9]/60'
                    : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-6 py-8 fade-in">
        {/* Pillar header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-[#E6FAF9] text-[#00ADA9] text-xs font-bold px-3 py-1.5 rounded-full mb-3">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Pillar {pillar.id}: {pillar.name}
          </div>
          <p className="text-gray-600 text-sm">{pillar.description}</p>
        </div>

        {/* Save error banner */}
        {saveError && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-start gap-3">
            <svg className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-red-700 text-xs">{saveError}</p>
              <button
                type="button"
                onClick={() => path === 'full' ? navigate('/transition') : navigate('/results')}
                className="text-xs text-red-500 underline mt-1.5 hover:text-red-700"
              >
                Continue without saving →
              </button>
            </div>
          </div>
        )}

        {/* Questions */}
        <div className="space-y-8">
          {pillar.questions.map((question, qi) => (
            <div key={qi} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <p className="text-[#1B3A5C] font-medium mb-5 leading-relaxed">
                <span className="text-[#00ADA9] font-bold mr-2">Q{qi + 1}.</span>
                {question}
              </p>

              <div className="flex gap-2">
                {LIKERT_LABELS.map(({ value, label }) => (
                  <LikertButton
                    key={value}
                    value={value}
                    label={label}
                    selected={answers[qi] === value}
                    onClick={(v) => handleAnswer(qi, v)}
                  />
                ))}
              </div>

              <div className="flex justify-between mt-2 px-1 sm:hidden">
                <span className="text-xs text-gray-400">Not at all</span>
                <span className="text-xs text-gray-400">Fully</span>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation */}
        <div className="mt-8 flex items-center gap-4">
          {currentPillar > 0 && (
            <button
              type="button"
              onClick={handleBack}
              className="flex items-center gap-2 text-gray-500 hover:text-[#1B3A5C] font-medium py-3 px-4 rounded-xl border border-gray-200 hover:border-gray-300 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>
          )}
          <button
            type="button"
            onClick={handleNext}
            disabled={!allAnswered || saving}
            className={`flex-1 flex items-center justify-center gap-2 font-bold py-4 px-6 rounded-xl transition-all duration-200 text-base
              ${allAnswered && !saving
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
            ) : isLastPillar ? (
              <>
                Complete & See Results
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </>
            ) : (
              <>
                Next: {ORG_PILLARS[currentPillar + 1]?.name}
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </>
            )}
          </button>
        </div>

        {!allAnswered && (
          <p className="text-center text-xs text-gray-400 mt-3">
            Answer all {pillar.questions.length} questions to continue
          </p>
        )}
      </div>
    </div>
  )
}
