import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAssessment } from '../context/AssessmentContext'
import Confetti from '../components/Confetti'
import Logo from '../components/Logo'
import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer,
} from 'recharts'

const PILLAR_DISPLAY = ['Strategy', 'Data & Tech', 'People', 'Processes', 'Governance']

const DIMENSIONS = [
  { key: 'D1', label: 'AI Awareness' },
  { key: 'D2', label: 'Tool Proficiency' },
  { key: 'D3', label: 'Prompt Ability' },
  { key: 'D4', label: 'Opportunity Spotting' },
  { key: 'D5', label: 'Workflow Integration' },
]

export default function Results() {
  const navigate = useNavigate()
  const { assessmentData } = useAssessment()
  const { path, intake, orgScores, individualScores } = assessmentData
  const reportRef = useRef(null)

  if (!orgScores && !individualScores) {
    navigate('/')
    return null
  }

  const showOrg        = path === 'org'  || path === 'full'
  const showIndividual = path === 'individual' || path === 'full'
  const showGap        = path === 'full' && orgScores && individualScores

  // Org derived values
  const pillarPcts = orgScores
    ? orgScores.pillarScores.map(p => p.percentage)
    : []
  const orgPct = orgScores?.overallPercentage ?? 0

  const weakestIdx  = pillarPcts.length
    ? pillarPcts.indexOf(Math.min(...pillarPcts))
    : -1
  const strongestIdx = pillarPcts.length
    ? pillarPcts.indexOf(Math.max(...pillarPcts))
    : -1

  const radarData = PILLAR_DISPLAY.map((name, i) => ({
    name,
    score: pillarPcts[i] ?? 0,
  }))

  // Individual derived values
  const indPct = individualScores
    ? Math.round(individualScores.overallAverage * 25)
    : 0

  const dimScores = DIMENSIONS.map(d => ({
    ...d,
    pct: individualScores
      ? Math.round((individualScores.dimensionAverages[d.key] ?? 0) * 25)
      : 0,
  }))

  // Gap
  const gap    = orgPct - indPct
  const absGap = Math.abs(gap)

  const today = new Date().toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric',
  })

  return (
    <div className="min-h-screen bg-gray-50">

      <Confetti />

      {/* Navbar */}
      <div className="bg-[#1B3A5C] px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Logo />
          <span className="text-white/60 text-sm">Your Results</span>
        </div>
      </div>

      {/* Report */}
      <div ref={reportRef} className="max-w-3xl mx-auto px-6 py-8">

        {/* Header card */}
        <div className="bg-white rounded-2xl p-6 mb-6 border border-gray-100">
          <h1 className="text-[#1B3A5C] font-black text-2xl mb-1">
            Your AI Readiness Report
          </h1>
          <p className="text-gray-500 text-sm mb-2">
            {intake.firstName} from {intake.organisation}
          </p>
          <p className="text-gray-400 text-xs">
            Open Day JB · 5 May 2026 · {today}
          </p>
        </div>

        {/* ── ORG SECTION ─────────────────────────────────────────────── */}
        {showOrg && orgScores && (
          <div className="mb-8">

            {/* Section label */}
            <p className="text-[#00ADA9] font-bold text-xs uppercase tracking-widest mb-4">
              Organisation AI Readiness
            </p>

            {/* Maturity badge */}
            <div className="flex justify-center mb-4">
              <div className="bg-[#1B3A5C] rounded-2xl px-8 py-4 text-center inline-block">
                <div className="text-[#00ADA9] font-black text-4xl leading-tight">
                  Level {orgScores.maturityLevel}
                </div>
                <div className="text-white font-bold text-xl mt-1">
                  {orgScores.maturityLabel}
                </div>
                <div className="text-white/60 text-sm mt-1">
                  {orgPct}% overall readiness
                </div>
              </div>
            </div>

            {/* 5 pillar cards */}
            <div className="grid grid-cols-5 gap-3 mb-4">
              {PILLAR_DISPLAY.map((name, i) => {
                const pct       = pillarPcts[i] ?? 0
                const isWeakest   = i === weakestIdx
                const isStrongest = i === strongestIdx
                return (
                  <div
                    key={i}
                    className={`bg-white border-2 rounded-xl p-4 text-center transition-colors
                      ${isWeakest   ? 'border-red-400'   :
                        isStrongest ? 'border-[#00ADA9]' :
                        'border-gray-100'}`}
                  >
                    <p className="text-[#1B3A5C] text-xs font-semibold mb-2 leading-tight">
                      {name}
                    </p>
                    <p className={`font-black text-xl mb-2
                      ${isWeakest   ? 'text-red-500'    :
                        isStrongest ? 'text-[#00ADA9]'  :
                        'text-[#1B3A5C]'}`}>
                      {pct}%
                    </p>
                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mb-2">
                      <div
                        className={`h-full rounded-full transition-all duration-700
                          ${isWeakest   ? 'bg-red-400'   :
                            isStrongest ? 'bg-[#00ADA9]' :
                            'bg-[#1B3A5C]'}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    {isWeakest && (
                      <span className="text-red-500 text-[10px] font-bold bg-red-50 px-2 py-0.5 rounded-full">
                        Focus Area
                      </span>
                    )}
                    {isStrongest && (
                      <span className="text-[#00ADA9] text-[10px] font-bold bg-[#E6FAF9] px-2 py-0.5 rounded-full">
                        Strength
                      </span>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Radar chart */}
            <div className="bg-white rounded-2xl p-5 border border-gray-100 mb-4">
              <ResponsiveContainer width="100%" height={220}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#e5e7eb" />
                  <PolarAngleAxis
                    dataKey="name"
                    tick={{ fill: '#6b7280', fontSize: 11 }}
                  />
                  <Radar
                    dataKey="score"
                    stroke="#00ADA9"
                    fill="#00ADA9"
                    fillOpacity={0.2}
                    strokeWidth={2}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* Org-only upsell */}
            {path === 'org' && (
              <div className="bg-[#E6FAF9] border border-[#00ADA9] rounded-2xl p-5 mb-6">
                <p className="text-[#1B3A5C] font-bold text-base mb-1">
                  Also want to know your personal AI capability?
                </p>
                <p className="text-gray-600 text-sm mb-4">
                  Take a 15-question personal assessment tailored to your role and cluster.
                </p>
                <button
                  type="button"
                  onClick={() => navigate('/intake', { state: { path: 'individual' } })}
                  className="bg-[#00ADA9] hover:bg-[#008a87] text-white font-bold px-6 py-3 rounded-xl text-sm transition-colors"
                >
                  Assess My Capability →
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── INDIVIDUAL SECTION ──────────────────────────────────────── */}
        {showIndividual && individualScores && (
          <div className="mb-8">

            {/* Section label */}
            <p className="text-[#00ADA9] font-bold text-xs uppercase tracking-widest mb-4">
              Your Personal AI Capability
            </p>

            {/* Capability badge */}
            <div className="flex justify-center mb-4">
              <div className="bg-white border-2 border-[#00ADA9] rounded-2xl px-8 py-4 text-center">
                <div className="text-[#00ADA9] font-black text-3xl leading-tight">
                  {individualScores.capabilityLabel}
                </div>
                <div className="text-gray-500 text-sm mt-1">
                  {indPct}% capability score
                </div>
              </div>
            </div>

            {/* 5 dimension bars */}
            <div className="space-y-3 mb-4">
              {dimScores.map(d => (
                <div key={d.key} className="bg-white rounded-xl p-4 border border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[#1B3A5C] text-sm font-medium">{d.label}</span>
                    <span className="text-[#00ADA9] text-sm font-bold">{d.pct}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#00ADA9] rounded-full transition-all duration-700"
                      style={{ width: `${d.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Primary learning focus */}
            {individualScores.primaryLearningFocus && (
              <div className="bg-[#E6FAF9] border border-[#00ADA9] rounded-xl p-4 mb-4">
                <p className="text-[#00ADA9] font-bold text-sm mb-1">Your focus area:</p>
                <p className="text-[#1B3A5C] font-semibold text-lg">
                  {individualScores.primaryLearningFocus}
                </p>
              </div>
            )}

            {/* Individual-only upsell */}
            {path === 'individual' && (
              <div className="bg-[#e8edf3] border border-[#1B3A5C] rounded-2xl p-5 mb-6">
                <p className="text-[#1B3A5C] font-bold text-base mb-1">
                  See how your organisation compares?
                </p>
                <p className="text-gray-600 text-sm mb-4">
                  Take the 25-question organisational readiness assessment for a full picture.
                </p>
                <button
                  type="button"
                  onClick={() => navigate('/intake', { state: { path: 'org' } })}
                  className="bg-[#1B3A5C] hover:bg-[#16304d] text-white font-bold px-6 py-3 rounded-xl text-sm transition-colors"
                >
                  Assess My Organisation →
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── GAP ANALYSIS ────────────────────────────────────────────── */}
        {showGap && (
          <div className="mb-8">

            <p className="text-[#00ADA9] font-bold text-xs uppercase tracking-widest mb-4">
              Gap Analysis
            </p>

            <div className="bg-white rounded-2xl p-6 border border-gray-100 mb-4">

              {/* Three numbers */}
              <div className="flex items-center justify-between gap-4 mb-6">

                <div className="text-center flex-1">
                  <p className="text-gray-500 text-xs mb-1">Org Readiness</p>
                  <p className="text-[#1B3A5C] font-black text-4xl">{orgPct}%</p>
                  <p className="text-gray-400 text-xs mt-1">{orgScores.maturityLabel}</p>
                </div>

                <div className="text-center flex-shrink-0">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-black mx-auto
                    ${absGap <= 20 ? 'bg-green-100 text-green-600' :
                      gap > 0      ? 'bg-amber-100 text-amber-600' :
                                     'bg-[#E6FAF9] text-[#00ADA9]'}`}>
                    {absGap <= 20 ? '↔' : gap > 0 ? '↑' : '↓'}
                  </div>
                  <p className={`text-xs font-bold mt-1
                    ${absGap <= 20 ? 'text-green-600' :
                      gap > 0      ? 'text-amber-600' :
                                     'text-[#00ADA9]'}`}>
                    {absGap}pt
                  </p>
                </div>

                <div className="text-center flex-1">
                  <p className="text-gray-500 text-xs mb-1">Personal Capability</p>
                  <p className="text-[#00ADA9] font-black text-4xl">{indPct}%</p>
                  <p className="text-gray-400 text-xs mt-1">{individualScores.capabilityLabel}</p>
                </div>

              </div>

              {/* Interpretation card */}
              <div className={`rounded-xl p-4 border
                ${absGap <= 20  ? 'bg-blue-50 border-blue-200'    :
                  gap > 20      ? 'bg-amber-50 border-amber-200'  :
                                  'bg-green-50 border-green-200'}`}>
                <p className={`text-sm font-medium
                  ${absGap <= 20  ? 'text-blue-800'   :
                    gap > 20      ? 'text-amber-800'  :
                                    'text-green-800'}`}>
                  {gap > 20
                    ? "Your organisation's direction is ahead of your personal AI toolkit. Focus on building daily AI habits."
                    : gap < -20
                    ? 'You are ahead of your organisation. Consider championing AI adoption internally.'
                    : "You are well aligned with your organisation's AI progress. Keep building."}
                </p>
              </div>

            </div>
          </div>
        )}

        {/* TODO: RECOMMENDATIONS PDF QR PDPA TO BE ADDED IN NEXT PHASE */}

      </div>
    </div>
  )
}
