import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAssessment } from '../context/AssessmentContext'
import { ORG_PILLARS as ORG_QUESTIONS, computeOrgScores } from '../data/orgQuestions'
import PillarCelebration from '../components/PillarCelebration'
import { supabase, SESSION_CODE } from '../lib/supabase'
import Logo from '../components/Logo'

const PILLARS = [
  { name: 'Strategy & Leadership',    description: "Evaluate your organisation's AI vision and leadership commitment.", colour: '#00ADA9' },
  { name: 'Data & Technology',        description: 'Assess your data infrastructure and technology readiness.',        colour: '#1B3A5C' },
  { name: 'People & Workforce',       description: 'Measure workforce AI awareness and capability.',                   colour: '#534AB7' },
  { name: 'Processes & AI Use Cases', description: 'Review process digitisation and AI adoption.',                    colour: '#BA7517' },
  { name: 'Governance & Risk',        description: 'Evaluate AI governance and responsible use practices.',            colour: '#3B6D11' },
]

const TAB_NAMES = ['Strategy', 'Data', 'People', 'Processes', 'Governance']

const LIKERT = [
  { value: 1, label: 'Not at all' },
  { value: 2, label: 'Rarely'     },
  { value: 3, label: 'Somewhat'   },
  { value: 4, label: 'Mostly'     },
  { value: 5, label: 'Fully'      },
]

export default function SurveyOrg() {
  const navigate = useNavigate()
  const { assessmentData, setOrgScores, setOrgResponseId } = useAssessment()
  const { path, intake } = assessmentData

  // Local answers: one array per pillar, sized to actual question count
  const [pillarAnswers, setPillarAnswers] = useState(
    ORG_QUESTIONS.map(p => Array(p.questions.length).fill(null))
  )
  const [currentPillar,   setCurrentPillar]   = useState(0)
  const [showCelebration, setShowCelebration] = useState(false)
  const [saving,          setSaving]          = useState(false)
  const [saveError,       setSaveError]       = useState(null)

  const pillar      = ORG_QUESTIONS[currentPillar]
  const answers     = pillarAnswers[currentPillar]
  const allAnswered = answers.every(a => a !== null)
  const answeredCount = answers.filter(a => a !== null).length
  const isLastPillar  = currentPillar === ORG_QUESTIONS.length - 1

  // Overall progress
  const totalAnswered   = pillarAnswers.flat().filter(a => a !== null).length
  const totalQuestions  = pillarAnswers.flat().length
  const progressPct     = totalQuestions > 0 ? Math.round((totalAnswered / totalQuestions) * 100) : 0

  const handleAnswer = (qIdx, value) => {
    setPillarAnswers(prev => {
      const next = prev.map(arr => [...arr])
      next[currentPillar][qIdx] = value
      return next
    })
    setSaveError(null)
  }

  const handleNext = () => {
    if (!allAnswered) return
    if (!isLastPillar) {
      setShowCelebration(true)
    } else {
      handleSubmit()
    }
  }

  const handleCelebrationComplete = () => {
    setShowCelebration(false)
    setCurrentPillar(prev => prev + 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSubmit = async () => {
    setSaving(true)
    setSaveError(null)

    // Object format for computeOrgScores
    const responsesObj = {}
    ORG_QUESTIONS.forEach((_, i) => {
      responsesObj[`pillar${i + 1}`] = pillarAnswers[i]
    })

    // Flat array padded to 5 per pillar (25 slots) for Supabase
    const orgResponses = []
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 5; j++) {
        orgResponses.push(pillarAnswers[i]?.[j] ?? null)
      }
    }

    const scores = computeOrgScores(responsesObj)
    setOrgScores(scores)

    const { data, error } = await supabase
      .from('openday_responses')
      .insert([{
        first_name:     intake.firstName,
        organisation:   intake.organisation,
        industry:       intake.industry,
        role_level:     intake.roleLevel,
        session_code:   SESSION_CODE,
        cycle:          1,
        submitted_at:   new Date().toISOString(),
        pillar1_score:  scores.pillarScores[0]?.sum,
        pillar2_score:  scores.pillarScores[1]?.sum,
        pillar3_score:  scores.pillarScores[2]?.sum,
        pillar4_score:  scores.pillarScores[3]?.sum,
        pillar5_score:  scores.pillarScores[4]?.sum,
        overall_score:  scores.overallPercentage,
        maturity_level: scores.maturityLevel,
        maturity_label: scores.maturityLabel,
        p1_q1: orgResponses[0],  p1_q2: orgResponses[1],  p1_q3: orgResponses[2],  p1_q4: orgResponses[3],  p1_q5: orgResponses[4],
        p2_q1: orgResponses[5],  p2_q2: orgResponses[6],  p2_q3: orgResponses[7],  p2_q4: orgResponses[8],  p2_q5: orgResponses[9],
        p3_q1: orgResponses[10], p3_q2: orgResponses[11], p3_q3: orgResponses[12], p3_q4: orgResponses[13], p3_q5: orgResponses[14],
        p4_q1: orgResponses[15], p4_q2: orgResponses[16], p4_q3: orgResponses[17], p4_q4: orgResponses[18], p4_q5: orgResponses[19],
        p5_q1: orgResponses[20], p5_q2: orgResponses[21], p5_q3: orgResponses[22], p5_q4: orgResponses[23], p5_q5: orgResponses[24],
      }])
      .select('id')
      .single()

    console.log('[SurveyOrg] Insert result:', data, error)

    if (error) {
      setSaveError('Save error: ' + error.message)
      setSaving(false)
      return
    }

    setSaving(false)

    if (path === 'org') {
      navigate('/results')
    } else {
      setOrgResponseId(data.id)
      navigate('/transition')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {showCelebration && (
        <PillarCelebration
          pillarNumber={currentPillar + 1}
          pillarName={PILLARS[currentPillar].name}
          onComplete={handleCelebrationComplete}
        />
      )}

      {/* Navbar */}
      <div className="bg-[#1B3A5C] px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Logo />
          <span className="text-white/60 text-sm">Organisation Readiness</span>
        </div>
      </div>

      {/* Pillar tabs */}
      <div className="bg-white border-b border-gray-100">
        <div className="flex gap-2 flex-wrap justify-center px-6 py-3">
          {PILLARS.map((_, i) => {
            const completed = i < currentPillar
            const current   = i === currentPillar
            return (
              <div
                key={i}
                className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold border transition-colors
                  ${completed
                    ? 'bg-[#E6FAF9] text-[#00ADA9] border-[#00ADA9]'
                    : current
                    ? 'bg-[#1B3A5C] text-white border-[#1B3A5C]'
                    : 'bg-white text-gray-400 border-gray-200'
                  }`}
              >
                {completed ? (
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <span>{i + 1}</span>
                )}
                {TAB_NAMES[i]}
              </div>
            )
          })}
        </div>
      </div>

      {/* Progress bar */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-2xl mx-auto px-6 py-3">
          <div className="flex justify-end mb-1">
            <span className="text-xs font-semibold" style={{ color: '#00ADA9' }}>{progressPct}%</span>
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

        {/* Pillar header card */}
        <div
          className="bg-white rounded-2xl p-6 mb-6 border border-gray-100"
          style={{ borderLeft: `4px solid ${PILLARS[currentPillar].colour}` }}
        >
          <p className="text-xs font-bold uppercase tracking-wide mb-1" style={{ color: '#00ADA9' }}>
            PILLAR {currentPillar + 1} OF 5
          </p>
          <h2 className="text-[#1B3A5C] font-bold text-xl mb-1">{PILLARS[currentPillar].name}</h2>
          <p className="text-gray-500 text-sm">{PILLARS[currentPillar].description}</p>
        </div>

        {/* Save error banner */}
        {saveError && (
          <div className="mb-5 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
            <p className="text-red-700 text-xs">{saveError}</p>
          </div>
        )}

        {/* Questions */}
        <div className="space-y-4">
          {pillar.questions.map((question, qi) => (
            <div key={qi} className="bg-white rounded-xl p-5 mb-4 border border-gray-100">
              <div className="flex items-start gap-2 mb-4">
                <span className="bg-[#E6FAF9] text-[#00ADA9] text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0 mt-0.5">
                  Q{currentPillar * 5 + qi + 1}
                </span>
                <p className="text-[#1B3A5C] font-medium text-sm leading-relaxed">{question}</p>
              </div>
              <div className="flex gap-2">
                {LIKERT.map(({ value, label }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => handleAnswer(qi, value)}
                    className={`flex flex-col items-center gap-1 py-3 rounded-xl border-2 flex-1 text-center transition-all duration-150
                      ${answers[qi] === value
                        ? 'border-[#00ADA9] bg-[#E6FAF9] text-[#00ADA9] font-bold'
                        : 'border-gray-200 bg-white text-gray-600 hover:border-[#00ADA9]/40'
                      }`}
                  >
                    <span className="text-base font-bold">{value}</span>
                    <span className="text-xs leading-tight hidden sm:block">{label}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Next / Submit button — visible once all answered */}
        {allAnswered && (
          <div className="mt-6">
            <button
              type="button"
              onClick={handleNext}
              disabled={saving}
              className="w-full bg-[#00ADA9] hover:bg-[#008a87] disabled:opacity-60 text-white font-bold py-4 rounded-xl transition-colors duration-200 text-base"
            >
              {saving ? 'Saving…' : isLastPillar ? 'Submit Assessment' : 'Next Pillar →'}
            </button>
          </div>
        )}

      </div>
    </div>
  )
}
