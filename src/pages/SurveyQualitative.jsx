import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAssessment } from '../context/AssessmentContext'
import { QUALITATIVE_QUESTIONS, computeQualitativeScores } from '../data/qualitativeQuestions'
import { supabase, SESSION_CODE } from '../lib/supabase'
import Logo from '../components/Logo'

export default function SurveyQualitative() {
  const navigate = useNavigate()
  const { assessmentData, setQualitativeScores } = useAssessment()

  const [currentQ,     setCurrentQ]     = useState(0)
  const [saving,       setSaving]       = useState(false)
  const [saveError,    setSaveError]    = useState(null)
  const [localResponses, setLocalResponses] = useState({
    q1: null, q2: null, q3: null, q4: null,
    q5: null, q6: null, q7: null, q8: null,
  })

  useEffect(() => {
    if (!assessmentData.intake.firstName) navigate('/')
  }, [assessmentData.intake.firstName, navigate])

  const question = QUALITATIVE_QUESTIONS[currentQ]
  const response = localResponses[question.id]
  const isLast   = currentQ === QUALITATIVE_QUESTIONS.length - 1

  const setResponse = (value) => {
    setLocalResponses(prev => ({ ...prev, [question.id]: value }))
    setSaveError(null)
  }

  const handleMultiToggle = (idx) => {
    const current = Array.isArray(response) ? response : []
    if (current.includes(idx)) {
      setResponse(current.filter(i => i !== idx))
    } else if (current.length >= (question.maxSelect || 2)) {
      setResponse([...current.slice(1), idx])
    } else {
      setResponse([...current, idx])
    }
  }

  const isAnswered = () => {
    if (question.type === 'single_select') return response !== null && response !== undefined
    if (question.type === 'multi_select')  return Array.isArray(response) && response.length > 0
    if (question.type === 'open_text')     return true
    return false
  }

  const getAnswerText = (questionIndex) => {
    const q = QUALITATIVE_QUESTIONS[questionIndex]
    const r = localResponses[q.id]
    if (r === null || r === undefined) return null
    if (q.type === 'single_select') return q.options[r]?.text ?? null
    if (q.type === 'multi_select')  return Array.isArray(r) ? r.map(i => q.options[i]?.text).filter(Boolean).join(', ') : null
    if (q.type === 'open_text')     return r || null
    return null
  }

  const handleNext = async () => {
    if (!isAnswered()) return

    if (!isLast) {
      setCurrentQ(prev => prev + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    setSaving(true)
    setSaveError(null)

    const scores = computeQualitativeScores(localResponses)
    setQualitativeScores(scores)

    const payload = {
      session_code:                SESSION_CODE,
      first_name:                  assessmentData.intake.firstName,
      organisation:                assessmentData.intake.organisation,
      industry:                    assessmentData.intake.industry,
      role_level:                  assessmentData.intake.roleLevel,
      submitted_at:                new Date().toISOString(),
      q1_process_waste:            getAnswerText(0),
      q2_ai_initiative:            getAnswerText(1),
      q3_bottleneck:               getAnswerText(2),
      q4_automation_readiness:     getAnswerText(3),
      q5_leadership:               getAnswerText(4),
      q6_data_problem:             getAnswerText(5),
      q7_people_problem:           getAnswerText(6),
      q8_bold_move:                localResponses.q8 || null,
      operational_readiness_score: scores.operationalScore,
      leadership_culture_score:    scores.leadershipScore,
      archetype:                   scores.archetype,
    }

    const { error: qualError } = await supabase
      .from('openday_qualitative')
      .insert([payload])

    console.log('[SurveyQualitative] Insert error:', qualError)
    if (qualError) {
      setSaveError('Save error: ' + qualError.message)
    }

    setSaving(false)

    const path = assessmentData.path
    if (path === 'individual') {
      navigate('/survey/individual')
    } else if (path === 'full') {
      navigate('/transition')
    } else {
      navigate('/results')
    }
  }

  const progressPct = Math.round((currentQ / 8) * 100)

  return (
    <div className="min-h-screen bg-[#1B3A5C]">

      {/* Navbar */}
      <div className="px-6 py-4" style={{ background: '#0D1F35' }}>
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Logo height={36} />
          <span className="text-white/60 text-sm">Reality Check</span>
        </div>
      </div>

      {/* Progress bar — sticky */}
      <div className="sticky top-0 z-10 border-b border-white/10" style={{ background: '#0D1F35' }}>
        <div className="max-w-2xl mx-auto px-6 py-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#00ADA9]">
              Question {currentQ + 1} of 8
            </span>
            <span className="text-xs text-white/50">{progressPct}%</span>
          </div>
          <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPct}%`, backgroundColor: '#00ADA9' }}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-6 py-8">

        {/* Intro card — first question only */}
        {currentQ === 0 && (
          <div className="mb-4 rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <p className="text-[#00ADA9] text-xs font-bold uppercase tracking-widest mb-2">REALITY CHECK</p>
            <p className="text-white font-bold text-lg mb-1">The questions that follow have no right answers.</p>
            <p className="text-white/60 text-sm">Answer honestly. The more honest you are, the more useful your results will be.</p>
          </div>
        )}

        {/* Question badge */}
        <div className="mb-6">
          <span className="inline-flex items-center bg-[#00ADA9]/20 text-[#00ADA9] text-xs font-bold px-3 py-1.5 rounded-full">
            Q{currentQ + 1} of 8
          </span>
        </div>

        {/* Save error banner */}
        {saveError && (
          <div className="mb-4 rounded-xl px-4 py-3" style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)' }}>
            <p className="text-red-300 text-xs">{saveError}</p>
          </div>
        )}

        {/* Question card */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-white/10 mb-6">
          <h2 className="text-[#1B3A5C] font-bold text-base leading-relaxed mb-6">
            {question.question}
          </h2>

          {/* Single select */}
          {question.type === 'single_select' && (
            <div className="space-y-3">
              {question.options.map((opt, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setResponse(i)}
                  className={`w-full text-left px-5 py-4 rounded-xl border-2 transition-all duration-150 text-sm leading-relaxed
                    ${response === i
                      ? 'border-[#00ADA9] bg-[#E6FAF9] text-[#1B3A5C] font-medium'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-[#00ADA9]/40 hover:bg-gray-50'
                    }`}
                >
                  <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold mr-3 flex-shrink-0
                    ${response === i ? 'bg-[#00ADA9] text-white' : 'bg-gray-100 text-gray-500'}`}>
                    {String.fromCharCode(65 + i)}
                  </span>
                  {opt.text}
                </button>
              ))}
            </div>
          )}

          {/* Multi select */}
          {question.type === 'multi_select' && (
            <div className="space-y-3">
              <p className="text-gray-500 text-xs mb-2">Select up to {question.maxSelect}</p>
              {question.options.map((opt, i) => {
                const selected   = Array.isArray(response) ? response : []
                const isSelected = selected.includes(i)
                const isDisabled = !isSelected && selected.length >= (question.maxSelect || 2)
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => !isDisabled && handleMultiToggle(i)}
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
          )}

          {/* Open text */}
          {question.type === 'open_text' && (
            <textarea
              value={response || ''}
              onChange={e => setResponse(e.target.value)}
              placeholder={question.placeholder || 'Type your answer here...'}
              rows={4}
              className="w-full px-4 py-3 rounded-xl text-sm resize-none transition-all duration-200 focus:outline-none placeholder-white/30"
              style={{
                background:  '#0D1F35',
                border:      '2px solid rgba(255,255,255,0.2)',
                color:       'white',
              }}
              onFocus={e  => { e.target.style.borderColor = '#00ADA9' }}
              onBlur={e   => { e.target.style.borderColor = 'rgba(255,255,255,0.2)' }}
            />
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => { setCurrentQ(prev => prev - 1); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
            disabled={currentQ === 0}
            className="rounded-xl px-4 py-3 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.7)' }}
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
                : 'text-gray-400 cursor-not-allowed'
              }`}
            style={!isAnswered() || saving ? { background: 'rgba(255,255,255,0.1)' } : {}}
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
                See My Full Results
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
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
