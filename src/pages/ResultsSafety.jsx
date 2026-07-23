import { useNavigate, useLocation, Navigate } from 'react-router-dom'
import { useAssessment } from '../context/AssessmentContext'
import Confetti from '../components/Confetti'
import Logo from '../components/Logo'
import { TIER_DETAIL } from '../data/safetyTiers'
import { EVENT_LABEL } from '../data/eventConfig'

export default function ResultsSafety() {
  const navigate = useNavigate()
  const location = useLocation()
  const { assessmentData } = useAssessment()
  const { intake } = assessmentData

  const scores = location.state?.scores
  if (!scores) return <Navigate to="/" replace />

  const {
    pillarScores,
    overallPercentage,
    capacityLabel,
    capacityColor,
    capacitySummary,
    primaryFocus,
    primaryFocusDetail,
    urgency,
    tier,
    tierNumber,
  } = scores

  const pcts = pillarScores.map(p => p.percentage)
  const minPct = Math.min(...pcts)
  const maxPct = Math.max(...pcts)
  const allEqual = minPct === maxPct

  const detail = TIER_DETAIL[tierNumber] || TIER_DETAIL[1]

  const handleDownload = async () => {
    const { downloadSafetyReport } = await import('../lib/buildSafetyReport')
    downloadSafetyReport({ intake, scores, sessionLabel: EVENT_LABEL })
  }

  return (
    <div className="bg-gray-50 min-h-screen">

      {/* Navbar */}
      <div className="bg-[#1B3A5C] px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Logo height={36} />
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="bg-white/10 hover:bg-white/20 text-white rounded-lg p-2"
            >
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </button>
            <span className="text-white/60 text-sm">Your Results</span>
          </div>
        </div>
      </div>

      <Confetti />

      {/* Report */}
      <div className="max-w-3xl mx-auto px-6 py-8 space-y-6">

        {/* BLOCK 1 — HEADER */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h1 className="text-[#1B3A5C] font-black text-2xl">Your AI Safety Capacity Report</h1>
          <p className="text-gray-500 text-sm">{intake.firstName} from {intake.organisation}</p>
          <p className="text-gray-400 text-xs">{EVENT_LABEL} · {new Date().toLocaleDateString()}</p>
        </div>

        {/* BLOCK 2 — CAPACITY BAND HERO */}
        <div className="bg-[#1B3A5C] rounded-3xl p-8 text-center">
          <span className="bg-[#00ADA9]/20 border border-[#00ADA9]/30 text-[#00ADA9] text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest mb-4 inline-block">
            Your AI Safety Capacity
          </span>
          <h2 className="font-black text-3xl mb-2" style={{ color: capacityColor }}>
            {capacityLabel}
          </h2>
          <p className="text-white/70 text-base mb-4 max-w-xl mx-auto">
            {overallPercentage}% overall capacity · {urgency} priority
          </p>
          <div className="w-16 h-0.5 bg-[#00ADA9]/40 mx-auto mb-4" />
          <p className="text-white/60 text-sm leading-relaxed max-w-2xl mx-auto">
            {capacitySummary}
          </p>
        </div>

        {/* BLOCK 3 — CAPACITY BY PILLAR */}
        <div>
          <p className="text-[#00ADA9] text-xs font-bold uppercase tracking-widest mb-3">
            Capacity by Pillar
          </p>
          <div className="grid grid-cols-3 gap-3 mb-4">
            {pillarScores.map(p => {
              const isWeakest = !allEqual && p.percentage === minPct
              const isStrongest = !allEqual && p.percentage === maxPct
              return (
                <div
                  key={p.key}
                  className={`bg-white rounded-xl p-4 text-center border-2 ${isWeakest ? 'border-red-300' : isStrongest ? 'border-[#00ADA9]' : 'border-gray-100'}`}
                >
                  <p className="text-[#1B3A5C] text-xs font-semibold mb-2 leading-tight">{p.name}</p>
                  <p className="text-2xl font-black mb-2" style={{ color: p.color }}>{p.percentage}%</p>
                  <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mb-2">
                    <div className="h-full rounded-full" style={{ width: `${p.percentage}%`, backgroundColor: p.color }} />
                  </div>
                  {isWeakest && (
                    <span className="text-red-500 text-[10px] font-bold bg-red-50 px-2 py-0.5 rounded-full">Focus Area</span>
                  )}
                  {isStrongest && (
                    <span className="text-[#00ADA9] text-[10px] font-bold bg-[#E6FAF9] px-2 py-0.5 rounded-full">Strength</span>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* BLOCK 4 — PRIMARY FOCUS */}
        <div className="bg-[#E6FAF9] border border-[#00ADA9] rounded-2xl p-5">
          <p className="text-[#00ADA9] font-bold text-sm mb-1">Your priority: {primaryFocus}</p>
          <p className="text-[#1B3A5C] text-sm leading-relaxed">{primaryFocusDetail}</p>
        </div>

        {/* BLOCK 5 — RECOMMENDED TIER */}
        <div>
          <p className="text-[#00ADA9] text-xs font-bold uppercase tracking-widest mb-3">
            Your Recommended Programme Tier
          </p>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden" style={{ borderTop: `4px solid ${tier.color}` }}>
            <div className="p-6">
              <div className="flex items-center gap-2 flex-wrap mb-3">
                <span className="text-xs font-bold px-3 py-1 rounded-full text-white" style={{ background: tier.color }}>
                  Tier {tier.number}
                </span>
                <span className="text-xs font-medium px-3 py-1 rounded-full bg-gray-100 text-gray-600">
                  {tier.duration} · ~{tier.hours} contact hours
                </span>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#E6FAF9] text-[#00ADA9]">
                  RECOMMENDED
                </span>
              </div>
              <h3 className="text-[#1B3A5C] font-bold text-xl mb-1">{tier.name}</h3>
              <p className="text-gray-500 text-sm mb-1">{tier.focus}</p>
              <p className="text-gray-400 text-xs mb-5">For: {tier.audience}</p>

              <div className="mb-5">
                <p className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-2">Objective</p>
                <p className="text-sm text-gray-600 leading-relaxed">{detail.objective}</p>
              </div>

              <div className="mb-5">
                <p className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-2">Modules in this tier</p>
                <div className="grid grid-cols-1 gap-1.5">
                  {detail.modules.map((m, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm text-[#1B3A5C]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00ADA9] flex-shrink-0 mt-1.5" />
                      {m}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-2">What you will achieve</p>
                <div className="space-y-1">
                  {detail.outcomes.map((o, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm text-gray-600">
                      <svg className="w-4 h-4 text-[#00ADA9] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {o}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-[#F2F5F9] border-t border-gray-100 px-6 py-4">
              <p className="text-[#1B3A5C] text-sm font-semibold">{tier.certification}</p>
              <p className="text-gray-500 text-xs mt-1">
                Part of a stackable certification ladder — Certified AI Aware, Certified AI Safety &amp; Security Practitioner,
                and Certified AI Governance &amp; Leadership.
              </p>
            </div>
          </div>
        </div>

        {/* BLOCK 6 — ACTION BUTTONS */}
        <div className="flex gap-4 justify-center flex-wrap">
          <button
            type="button"
            onClick={handleDownload}
            className="bg-[#1B3A5C] hover:bg-[#0f2a42] text-white font-bold px-6 py-3 rounded-xl transition-colors"
          >
            Download My Report
          </button>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="border border-gray-200 text-gray-600 font-bold px-6 py-3 rounded-xl hover:bg-gray-50 transition-colors"
          >
            Return to Home
          </button>
        </div>

        {/* CLOSING NOTE */}
        <p className="text-gray-300 text-xs text-center mt-4 pb-8">
          This diagnostic was designed by PEOPLElogy Berhad. Your results are generated instantly.
          Individual data is never shared publicly. All data handled in accordance with PDPA 2010.
        </p>

      </div>
    </div>
  )
}
