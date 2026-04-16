import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAssessment } from '../context/AssessmentContext'
import { CLUSTER_NAMES } from '../data/individualQuestions'
import Logo from '../components/Logo'

const MATURITY_COLORS = {
  1: 'bg-red-100 text-red-700 border-red-200',
  2: 'bg-orange-100 text-orange-700 border-orange-200',
  3: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  4: 'bg-blue-100 text-blue-700 border-blue-200',
  5: 'bg-green-100 text-green-700 border-green-200',
}

export default function Transition() {
  const navigate = useNavigate()
  const { assessmentData } = useAssessment()
  const { orgScores, intake, path } = assessmentData

  useEffect(() => {
    if (!orgScores || path !== 'full') {
      navigate('/')
    }
  }, [orgScores, path, navigate])

  if (!orgScores) return null

  const { maturityLevel, maturityLabel } = orgScores
  const clusterName = CLUSTER_NAMES[intake.cluster]
  const colorClass = MATURITY_COLORS[maturityLevel] || MATURITY_COLORS[3]

  return (
    <div className="min-h-screen bg-[#1B3A5C] flex flex-col">
      <nav className="px-6 py-5 max-w-2xl mx-auto w-full flex items-center justify-between">
        <Logo />
      </nav>

      <div className="flex-1 flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center">
          {/* Checkmark animation */}
          <div className="flex items-center justify-center w-20 h-20 rounded-full bg-[#00ADA9]/20 border-2 border-[#00ADA9]/40 mx-auto mb-8">
            <svg className="w-10 h-10 text-[#00ADA9]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>

          <h1 className="text-3xl font-bold text-white mb-3">Part 1 complete</h1>
          <p className="text-white/70 text-lg mb-8">
            Great work. Now let's understand your personal AI capability.
          </p>

          {/* Maturity badge */}
          <div className={`inline-flex items-center gap-2 border px-5 py-2.5 rounded-full mb-8 ${colorClass}`}>
            <span className="font-bold text-sm">Level {maturityLevel} — {maturityLabel}</span>
          </div>

          {/* Info box */}
          <div className="bg-white/10 border border-white/20 rounded-2xl p-6 mb-8 text-left">
            <h3 className="text-white font-bold text-base mb-4">Part 2: Your Personal AI Capability</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#00ADA9]/20 flex items-center justify-center">
                  <svg className="w-4 h-4 text-[#00ADA9]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-white/80 text-sm">15 questions tailored to your role</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#00ADA9]/20 flex items-center justify-center">
                  <svg className="w-4 h-4 text-[#00ADA9]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-white/80 text-sm">~5 minutes</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#00ADA9]/20 flex items-center justify-center">
                  <svg className="w-4 h-4 text-[#00ADA9]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <span className="text-white/60 text-xs">Your Cluster</span>
                  <span className="text-white font-semibold text-sm ml-2">{clusterName}</span>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate('/survey/individual')}
            className="w-full bg-[#00ADA9] hover:bg-[#008a87] text-white font-bold py-4 px-8 rounded-xl transition-colors duration-200 text-base"
          >
            Continue to Part 2 →
          </button>
        </div>
      </div>
    </div>
  )
}
