import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAssessment } from '../context/AssessmentContext'
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, Tooltip } from 'recharts'
import Confetti from '../components/Confetti'
import Logo from '../components/Logo'
import { ARCHETYPES, PRIORITIES } from '../data/archetypes'
import { TRACKS, ARCHETYPE_TRACKS } from '../data/tracks'
import { assignArchetype } from '../data/qualitativeQuestions'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

const PILLAR_NAMES = ['Strategy', 'Data & Tech', 'People', 'Processes', 'Governance']

const DIMENSIONS = [
  { key: 'D1', label: 'AI Awareness' },
  { key: 'D2', label: 'Tool Proficiency' },
  { key: 'D3', label: 'Prompt Ability' },
  { key: 'D4', label: 'Opportunity Spotting' },
  { key: 'D5', label: 'Workflow Integration' },
]

export default function Results() {
  const navigate = useNavigate()
  const reportRef = useRef(null)
  const { assessmentData } = useAssessment()
  const { path, intake, orgScores, individualScores, qualitativeScores } = assessmentData

  if (!orgScores && !individualScores && !qualitativeScores) {
    navigate('/')
    return null
  }

  const orgPct       = orgScores ? orgScores.overallPercentage : 50
  const capPct       = individualScores ? Math.round(individualScores.overallAverage * 25) : 62

  const archetype     = qualitativeScores ? assignArchetype(orgPct, capPct) : null
  const archetypeData = archetype ? ARCHETYPES[archetype] : null
  const priorities    = archetype ? PRIORITIES[archetype] : null
  const [expandedTrack, setExpandedTrack] = useState(null)
  const trackRecommendation = archetype ? ARCHETYPE_TRACKS[archetype] : null

  // Org-derived
  const pillarPcts   = orgScores ? orgScores.pillarScores.map(p => p.percentage) : []
  const minPct       = pillarPcts.length ? Math.min(...pillarPcts) : null
  const maxPct       = pillarPcts.length ? Math.max(...pillarPcts) : null
  const allEqual     = minPct === maxPct
  const radarData    = orgScores ? [
    { name: 'Strategy',    score: orgScores.pillarScores[0].percentage },
    { name: 'Data & Tech', score: orgScores.pillarScores[1].percentage },
    { name: 'People',      score: orgScores.pillarScores[2].percentage },
    { name: 'Processes',   score: orgScores.pillarScores[3].percentage },
    { name: 'Governance',  score: orgScores.pillarScores[4].percentage },
  ] : []

  // Individual-derived (capPct doubles as indPct for display)
  const indPct = capPct

  const handleDownloadPDF = async () => {
    const el = reportRef.current
    if (!el) return
    try {
      const canvas = await html2canvas(el, { scale: 2, useCORS: true, backgroundColor: '#f9fafb' })
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)
      pdf.save('PEOPLElogy-AI-Report-' + intake.firstName + '.pdf')
    } catch (err) {
      alert('PDF error: ' + err.message)
    }
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
      <div ref={reportRef} className="max-w-3xl mx-auto px-6 py-8 space-y-6">

        {/* BLOCK 1 — HEADER CARD */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h1 className="text-[#1B3A5C] font-black text-2xl">Your AI Readiness Report</h1>
          <p className="text-gray-500 text-sm">{intake.firstName} from {intake.organisation}</p>
          <p className="text-gray-400 text-xs">Open Day JB · 5 May 2026 · {new Date().toLocaleDateString()}</p>
        </div>

        {/* BLOCK 2 — ARCHETYPE BANNER */}
        {archetypeData && (
          <div className="bg-[#1B3A5C] rounded-3xl p-8 text-center">
            <span className="bg-[#00ADA9]/20 border border-[#00ADA9]/30 text-[#00ADA9] text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest mb-4 inline-block">
              YOUR AI PROFILE
            </span>
            <h2 className="font-black text-3xl mb-2" style={{ color: '#' + archetypeData.color }}>
              {archetype}
            </h2>
            <p className="text-white/70 text-base mb-4 max-w-xl mx-auto">
              {archetypeData.subtitle}
            </p>
            <div className="w-16 h-0.5 bg-[#00ADA9]/40 mx-auto mb-4" />
            <p className="text-white/60 text-sm leading-relaxed max-w-2xl mx-auto">
              {archetypeData.narrative}
            </p>
          </div>
        )}

        {/* BLOCK 3 — REALITY CHECK SCORES */}
        {qualitativeScores && (
          <div>
            <p className="text-[#00ADA9] text-xs font-bold uppercase tracking-widest mb-3">
              REALITY CHECK SCORES
            </p>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm text-center">
                <p className="text-gray-400 text-xs font-bold uppercase tracking-wide mb-2">OPERATIONAL READINESS</p>
                <p className="text-3xl font-black text-[#1B3A5C]">{qualitativeScores.operationalScore}%</p>
                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mt-3">
                  <div className="h-full bg-[#00ADA9] rounded-full" style={{ width: `${qualitativeScores.operationalScore}%` }} />
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm text-center">
                <p className="text-gray-400 text-xs font-bold uppercase tracking-wide mb-2">LEADERSHIP &amp; CULTURE</p>
                <p className="text-3xl font-black text-[#1B3A5C]">{qualitativeScores.leadershipScore}%</p>
                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mt-3">
                  <div className="h-full bg-[#00ADA9] rounded-full" style={{ width: `${qualitativeScores.leadershipScore}%` }} />
                </div>
              </div>
            </div>

            {(() => {
              const diff = qualitativeScores.operationalScore - qualitativeScores.leadershipScore
              if (diff < -10) return (
                <div className="rounded-xl p-4 text-sm bg-amber-50 border border-amber-200 text-amber-800">
                  Your operational processes are your biggest constraint. Your leadership wants to move but your systems and processes are not set up to support AI at scale. Process documentation and automation readiness should be your first investment.
                </div>
              )
              if (diff > 10) return (
                <div className="rounded-xl p-4 text-sm bg-purple-50 border border-purple-200 text-purple-800">
                  Leadership commitment is your biggest gap. Even with good processes, AI transformation stalls without active sponsorship from the top. The most important conversation in your organisation is not about technology — it is about strategic priority.
                </div>
              )
              return (
                <div className="rounded-xl p-4 text-sm bg-blue-50 border border-blue-200 text-blue-800">
                  Your operational readiness and leadership culture are broadly aligned. Your transformation challenge is raising the overall baseline across both dimensions simultaneously.
                </div>
              )
            })()}
          </div>
        )}

        {/* BLOCK 4 — ORG READINESS */}
        {orgScores && (
          <div>
            <p className="text-[#00ADA9] text-xs font-bold uppercase tracking-widest mb-3">
              ORGANISATION AI READINESS
            </p>

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

            <div className="grid grid-cols-5 gap-3 mb-4">
              {PILLAR_NAMES.map((name, i) => {
                const pct         = pillarPcts[i] ?? 0
                const isWeakest   = !allEqual && pct === minPct
                const isStrongest = !allEqual && pct === maxPct
                return (
                  <div
                    key={i}
                    className={`bg-white rounded-xl p-4 text-center border-2 ${isWeakest ? 'border-red-300' : isStrongest ? 'border-[#00ADA9]' : 'border-gray-100'}`}
                  >
                    <p className="text-[#1B3A5C] text-xs font-semibold mb-2 leading-tight">{name}</p>
                    <p className="text-2xl font-black text-[#1B3A5C] mb-2">{pct}%</p>
                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mb-2">
                      <div className="h-full bg-[#00ADA9] rounded-full" style={{ width: `${pct}%` }} />
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

            <div className="bg-white rounded-2xl p-5 border border-gray-100">
              <ResponsiveContainer width="100%" height={220}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#e5e7eb" />
                  <PolarAngleAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 11 }} />
                  <Radar dataKey="score" stroke="#00ADA9" fill="#00ADA9" fillOpacity={0.2} strokeWidth={2} />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {path === 'org' && (
              <div className="bg-[#E6FAF9] border border-[#00ADA9] rounded-2xl p-5 mt-4">
                <p className="text-[#1B3A5C] font-bold text-base mb-1">Also want to know your personal AI capability?</p>
                <p className="text-gray-600 text-sm mb-4">Take a 15-question personal assessment tailored to your role and cluster.</p>
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

        {/* BLOCK 5 — PERSONAL CAPABILITY */}
        {individualScores && (
          <div>
            <p className="text-[#00ADA9] text-xs font-bold uppercase tracking-widest mb-3">
              YOUR PERSONAL AI CAPABILITY
            </p>

            <div className="flex justify-center mb-4">
              <div className="bg-white border-2 border-[#00ADA9] rounded-2xl px-8 py-4 text-center">
                <div className="text-[#00ADA9] font-black text-3xl">
                  {individualScores.capabilityLabel}
                </div>
                <div className="text-gray-500 text-sm mt-1">
                  {indPct}% capability score
                </div>
              </div>
            </div>

            <div className="mb-4">
              {DIMENSIONS.map(d => {
                const pct = Math.round((individualScores.dimensionAverages?.[d.key] ?? 0) * 25)
                return (
                  <div key={d.key} className="bg-white rounded-xl p-4 border border-gray-100 mb-2">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[#1B3A5C] text-sm font-medium">{d.label}</span>
                      <span className="text-[#00ADA9] text-sm font-bold">{pct}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-[#00ADA9] rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                )
              })}
            </div>

            {individualScores.primaryLearningFocus && (
              <div className="bg-[#E6FAF9] border border-[#00ADA9] rounded-xl p-4 mb-4">
                <p className="text-[#00ADA9] font-bold text-sm mb-1">Your primary focus area:</p>
                <p className="text-[#1B3A5C] font-semibold text-lg">{individualScores.primaryLearningFocus}</p>
              </div>
            )}

            {(() => {
              const heatmapDimensions = [
                { name: 'AI Awareness',        pct: Math.round(individualScores.dimensionAverages.D1 * 25), desc: 'Understanding of AI concepts, tools and responsible use' },
                { name: 'Tool Proficiency',    pct: Math.round(individualScores.dimensionAverages.D2 * 25), desc: 'Daily usage of AI tools in your role' },
                { name: 'Prompt Ability',      pct: Math.round(individualScores.dimensionAverages.D3 * 25), desc: 'Quality and effectiveness of AI prompting' },
                { name: 'Opportunity Spotting',pct: Math.round(individualScores.dimensionAverages.D4 * 25), desc: 'Identifying AI opportunities in your work' },
                { name: 'Workflow Integration',pct: Math.round(individualScores.dimensionAverages.D5 * 25), desc: 'Embedding AI into daily work routines' },
              ]
              const barColor   = pct => pct >= 75 ? '#22C55E' : pct >= 50 ? '#F97316' : '#EF4444'
              const scoreColor = pct => pct >= 75 ? 'text-[#22C55E]' : pct >= 50 ? 'text-[#F97316]' : 'text-[#EF4444]'
              return (
                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm mb-4">
                  <p className="text-[#00ADA9] text-xs font-bold uppercase tracking-widest mb-4">SKILLS HEATMAP</p>
                  {heatmapDimensions.map(d => (
                    <div key={d.name} className="flex items-center gap-3 mb-3">
                      <span className="w-36 text-sm font-semibold text-[#1B3A5C] flex-shrink-0">{d.name}</span>
                      <div className="flex-1 bg-gray-100 rounded-full h-4 overflow-hidden">
                        <div className="h-4 rounded-full" style={{ width: `${d.pct}%`, backgroundColor: barColor(d.pct) }} />
                      </div>
                      <span className={`w-10 text-right text-sm font-bold ${scoreColor(d.pct)}`}>{d.pct}%</span>
                    </div>
                  ))}
                  <div className="flex gap-3 mt-2">
                    <span className="bg-[#22C55E]/15 text-[#22C55E] text-xs px-3 py-1 rounded-full">≥75% Strong</span>
                    <span className="bg-[#F97316]/15 text-[#F97316] text-xs px-3 py-1 rounded-full">50–74% Developing</span>
                    <span className="bg-[#EF4444]/15 text-[#EF4444] text-xs px-3 py-1 rounded-full">&lt;50% Needs Focus</span>
                  </div>
                </div>
              )
            })()}

            {path === 'individual' && (
              <div className="bg-[#e8edf3] border border-[#1B3A5C] rounded-2xl p-5">
                <p className="text-[#1B3A5C] font-bold text-base mb-1">See how your organisation compares?</p>
                <p className="text-gray-600 text-sm mb-4">Take the 25-question organisational readiness assessment for a full picture.</p>
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

        {/* BLOCK 6 — GAP ANALYSIS */}
        {path === 'full' && orgScores && individualScores && (() => {
          const gap    = orgPct - indPct
          const absGap = Math.abs(gap)
          return (
            <div>
              <p className="text-[#00ADA9] text-xs font-bold uppercase tracking-widest mb-3">GAP &amp; OPPORTUNITY MAP</p>
              <div className="bg-white rounded-2xl p-6 border border-gray-100">
                <div className="flex items-center justify-between gap-4 mb-6">
                  <div className="text-center flex-1">
                    <p className="text-gray-500 text-xs mb-1">Org Readiness</p>
                    <p className="text-[#1B3A5C] font-black text-4xl">{orgPct}%</p>
                    <p className="text-gray-400 text-xs mt-1">{orgScores.maturityLabel}</p>
                  </div>
                  <div className="text-center flex-shrink-0">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-black mx-auto
                      ${absGap <= 10 ? 'bg-green-100 text-green-600' : gap > 0 ? 'bg-amber-100 text-amber-600' : 'bg-[#E6FAF9] text-[#00ADA9]'}`}>
                      {absGap <= 10 ? '↔' : gap > 0 ? '↑' : '↓'}
                    </div>
                    <p className={`text-xs font-bold mt-1 ${absGap <= 10 ? 'text-green-600' : gap > 0 ? 'text-amber-600' : 'text-[#00ADA9]'}`}>
                      {absGap}pt
                    </p>
                  </div>
                  <div className="text-center flex-1">
                    <p className="text-gray-500 text-xs mb-1">Personal Capability</p>
                    <p className="text-[#00ADA9] font-black text-4xl">{indPct}%</p>
                    <p className="text-gray-400 text-xs mt-1">{individualScores.capabilityLabel}</p>
                  </div>
                </div>
                {gap > 20 ? (
                  <div className="rounded-xl p-4 border bg-amber-50 border-amber-200 text-amber-800 text-sm">
                    Your organisation's direction is ahead of your personal AI toolkit. Focus on building daily AI habits.
                  </div>
                ) : gap < -20 ? (
                  <div className="rounded-xl p-4 border bg-[#E6FAF9] border-[#00ADA9] text-[#1B3A5C] text-sm">
                    You are ahead of your organisation. Consider championing AI adoption internally.
                  </div>
                ) : (
                  <div className="rounded-xl p-4 border bg-blue-50 border-blue-200 text-blue-800 text-sm">
                    You are well aligned with your organisation's AI progress. Keep building.
                  </div>
                )}
              </div>
            </div>
          )
        })()}

        {/* BLOCK 7 — WHAT NEEDS TO HAPPEN */}
        <div>
          <p className="text-[#00ADA9] text-xs font-bold uppercase tracking-widest mb-3">
            WHAT YOU SHOULD DO FIRST
          </p>
          <div className="space-y-3">
            {(priorities || [
              { title: 'Define your AI strategy',  detail: 'A clear one-page commitment to where AI plays a role in your organisation.' },
              { title: 'Build daily AI habits',     detail: 'Consistent daily use of AI tools creates more change than any training programme.' },
              { title: 'Start with one process',    detail: 'Identify your highest-volume repetitive task and automate it first.' },
            ]).map((item, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-[#00ADA9] text-white font-bold text-sm flex items-center justify-center flex-shrink-0">
                  {i + 1}
                </div>
                <div>
                  <p className="text-[#1B3A5C] font-bold text-base mb-1">{item.title}</p>
                  <p className="text-gray-500 text-sm leading-relaxed">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* BLOCK 8 — CLOSING SCREEN */}
        <div className="bg-[#0D1F35] rounded-3xl p-8 text-center">
          {qualitativeScores?.q8BoldMove ? (
            <>
              <p className="text-white/50 text-sm mb-3">You said your bold AI move would be:</p>
              <p className="text-white italic font-semibold text-lg max-w-xl mx-auto mb-4 leading-relaxed">
                "{qualitativeScores.q8BoldMove}"
              </p>
              <p className="text-white/50 text-sm">
                That is a goal worth pursuing. The organisations that achieve it are the ones that start now — not the ones that wait for the perfect moment.
              </p>
            </>
          ) : (
            <p className="text-white/70 text-base max-w-xl mx-auto">
              You now know where you stand. Most organisations never get this far — they guess, they delay, they wait for someone else to move first. You have the data. What you do with it is the difference between organisations that lead and organisations that follow.
            </p>
          )}
          <p className="text-white/20 text-xs mt-6">
            This diagnostic was designed by PEOPLElogy — Malaysia's Digital Workforce Transformation company.
          </p>
        </div>

        {/* BLOCK 9 — ACTION BUTTONS */}
        <div className="flex gap-4 justify-center flex-wrap">
          <button
            type="button"
            onClick={handleDownloadPDF}
            className="bg-[#1B3A5C] hover:bg-[#0f2a42] text-white font-bold px-6 py-3 rounded-xl transition-colors"
          >
            Download My Report
          </button>
          {path !== 'full' && (
            <button
              type="button"
              onClick={() => navigate('/intake', { state: { path: 'full' } })}
              className="bg-[#00ADA9] hover:bg-[#008a87] text-white font-bold px-6 py-3 rounded-xl transition-colors"
            >
              Take Full Assessment
            </button>
          )}
          <button
            type="button"
            onClick={() => navigate('/')}
            className="border border-gray-200 text-gray-600 font-bold px-6 py-3 rounded-xl hover:bg-gray-50 transition-colors"
          >
            Return to Home
          </button>
        </div>

        {/* PDPA NOTE */}
        <p className="text-gray-300 text-xs text-center mt-4 pb-8">
          Your results are generated instantly. Individual data is never shared publicly. All data handled in accordance with PDPA 2010.
        </p>

      </div>
    </div>
  )
}
