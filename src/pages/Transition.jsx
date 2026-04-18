import { useNavigate } from 'react-router-dom'
import { useAssessment } from '../context/AssessmentContext'
import Logo from '../components/Logo'

const CLUSTER_NAMES = {
  A: 'Leaders & Strategy',
  B: 'Commercial & Client',
  C: 'Creative & Marketing',
  D: 'Technical & Delivery',
  E: 'L&D & People',
}

export default function Transition() {
  const navigate = useNavigate()
  const { assessmentData } = useAssessment()
  const { orgScores, intake } = assessmentData

  if (!orgScores) {
    navigate('/')
    return null
  }

  const { maturityLevel, maturityLabel } = orgScores
  const clusterName = CLUSTER_NAMES[intake.cluster] || 'Leaders & Strategy'

  return (
    <div className="min-h-screen bg-[#1B3A5C] flex flex-col">

      {/* Keyframe for checkmark scale-in */}
      <style>{`
        @keyframes scaleIn {
          from { transform: scale(0); opacity: 0; }
          to   { transform: scale(1); opacity: 1; }
        }
        .scale-in {
          animation: scaleIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
      `}</style>

      {/* Navbar */}
      <nav className="px-6 py-5 flex items-center justify-between max-w-2xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="bg-white/10 hover:bg-white/20 text-white rounded-lg p-2 flex items-center gap-2 text-sm font-medium"
          >
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </button>
          <Logo />
        </div>
        <span className="text-white/60 text-sm">Step 1 of 2 Complete</span>
      </nav>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="max-w-lg w-full text-center">

          {/* Animated checkmark */}
          <div className="scale-in w-20 h-20 bg-[#00ADA9]/20 border-2 border-[#00ADA9] rounded-full flex items-center justify-center mx-auto mb-6">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#00ADA9" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>

          {/* Maturity badge */}
          <div className="mb-4">
            <span className="bg-[#00ADA9] text-white font-bold px-6 py-2 rounded-full text-lg inline-block">
              Level {maturityLevel} — {maturityLabel}
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-white font-black text-3xl mb-3">Part 1 complete!</h1>
          <p className="text-white/70 text-base mb-8">
            Great work. Now let's understand your personal AI capability.
          </p>

          {/* Info box */}
          <div className="bg-white/10 border border-white/20 rounded-2xl p-6 mb-8 text-left">
            <p className="text-white font-bold text-lg mb-4">Part 2 — Your Personal AI Capability</p>

            {/* 3 pills */}
            <div className="flex gap-3 flex-wrap mb-4">
              <span className="bg-white/10 text-white/80 text-sm px-3 py-1.5 rounded-full">15 questions</span>
              <span className="bg-white/10 text-white/80 text-sm px-3 py-1.5 rounded-full">~8 minutes</span>
              <span className="bg-white/10 text-white/80 text-sm px-3 py-1.5 rounded-full">Tailored to your role</span>
            </div>

            {/* Cluster label */}
            <p className="text-white/60 text-sm">
              You are in the{' '}
              <span className="font-semibold" style={{ color: '#00ADA9' }}>{clusterName}</span>
            </p>
          </div>

          {/* Continue button */}
          <button
            onClick={() => navigate('/survey/individual')}
            className="bg-[#00ADA9] hover:bg-[#008a87] text-white font-bold py-4 px-8 rounded-xl text-lg w-full transition-colors duration-200"
          >
            Continue to Part 2 →
          </button>

        </div>
      </div>
    </div>
  )
}
