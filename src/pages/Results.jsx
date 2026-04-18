import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAssessment } from '../context/AssessmentContext'
import Confetti from '../components/Confetti'
import Logo from '../components/Logo'
import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer,
} from 'recharts'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { QRCodeSVG as QRCode } from 'qrcode.react'

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
  const [downloading, setDownloading] = useState(false)

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

  // ── Recommendations ──────────────────────────────────────────────────────────
  const capLabel        = individualScores?.capabilityLabel || ''
  const industry        = intake.industry || ''
  const roleLevel       = intake.roleLevel || ''
  const primaryFunction = intake.primaryFunction || ''

  const recommendations = []

  // AI LITERACY — People pillar (index 2) < 50% OR Beginner/Explorer
  if ((pillarPcts[2] !== undefined && pillarPcts[2] < 50) ||
      capLabel === 'AI Beginner' || capLabel === 'AI Explorer') {
    recommendations.push({
      category: 'AI Literacy', colour: '#00ADA9',
      name: 'AI Literacy for the Modern Workplace',
      desc: 'Build foundational AI knowledge and practical skills for everyday workplace use.',
    })
    recommendations.push({
      category: 'AI Literacy', colour: '#00ADA9',
      name: 'Prompt Engineering & Multi-Tool Gen AI for Productivity',
      desc: 'Master prompt writing and multi-tool AI workflows to boost personal productivity.',
    })
  }

  // AI PRACTITIONER — Processes pillar (index 3) < 50% OR AI Practitioner
  if ((pillarPcts[3] !== undefined && pillarPcts[3] < 50) || capLabel === 'AI Practitioner') {
    let practCard
    if (industry === 'Financial Services & Banking' || industry === 'Insurance') {
      practCard = { name: 'AI for Finance & Banking Excellence', desc: 'Apply AI to transform financial services operations, analysis and customer experience.' }
    } else if (industry === 'Manufacturing & Engineering') {
      practCard = { name: 'AI for Manufacturing Excellence', desc: 'Leverage AI to optimise production, quality control and supply chain operations.' }
    } else if (industry === 'Logistics & Supply Chain') {
      practCard = { name: 'AI for Supply Chain Excellence', desc: 'Use AI to improve logistics efficiency, demand forecasting and inventory management.' }
    } else if (industry === 'Retail & Consumer') {
      practCard = { name: 'AI For Retail & E-Commerce Excellence', desc: 'Deploy AI for personalised customer experiences and retail operations.' }
    } else if (industry === 'Healthcare & Life Sciences') {
      practCard = { name: 'AI for Healthcare Excellence', desc: 'Apply AI to improve patient outcomes, diagnostics and healthcare administration.' }
    } else if (industry === 'Education & Training') {
      practCard = { name: 'AI for Education Excellence', desc: 'Integrate AI into learning design, delivery and learner engagement.' }
    } else if (industry === 'Technology & Digital') {
      practCard = { name: 'AI for Fintech Excellence', desc: 'Build AI capabilities for digital financial products and technology innovation.' }
    } else if (primaryFunction === 'Sales & Business Development') {
      practCard = { name: 'AI for Sales & Commercial Excellence', desc: 'Use AI to accelerate pipeline, proposals and client relationship management.' }
    } else if (primaryFunction === 'Operations & Process') {
      practCard = { name: 'AI for Operations Excellence', desc: 'Apply AI to streamline operations, reduce waste and improve process efficiency.' }
    } else if (primaryFunction === 'Human Resources & People') {
      practCard = { name: 'AI for HR & Administration Excellence', desc: 'Transform HR operations with AI-powered recruitment, onboarding and people analytics.' }
    } else if (primaryFunction === 'Marketing & Branding') {
      practCard = { name: 'AI for Marketing Excellence', desc: 'Use AI for content creation, campaign optimisation and audience targeting.' }
    } else if (primaryFunction === 'Technology & Digital') {
      practCard = { name: 'AI for Business Analyst Excellence', desc: 'Enhance analysis, requirements and insights delivery with AI tools.' }
    } else {
      practCard = { name: 'AI for Operations Excellence', desc: 'Apply AI to streamline operations, reduce waste and improve process efficiency.' }
    }
    recommendations.push({ category: 'AI Practitioner', colour: '#1B3A5C', ...practCard })
  }

  // AI BUILDER — Integrator/Champion OR Tech/Product function
  if (capLabel === 'AI Integrator' || capLabel === 'AI Champion' ||
      primaryFunction === 'Technology & Digital' || primaryFunction === 'Product & Innovation') {
    recommendations.push({
      category: 'AI Builder', colour: '#534AB7',
      name: 'Advanced LLM, Agents & AI Engineering',
      desc: 'Build production-grade AI systems, agents and LLM-powered applications.',
    })
    recommendations.push({
      category: 'AI Builder', colour: '#534AB7',
      name: 'AI Agents & Automation Building',
      desc: 'Design and deploy AI agents that automate complex workflows and decisions.',
    })
  }

  // AI LEADERSHIP — Strategy pillar (index 0) < 50% OR C-Suite/Director/VP
  if ((pillarPcts[0] !== undefined && pillarPcts[0] < 50) ||
      roleLevel.includes('C-Suite') || roleLevel.includes('Director') || roleLevel.includes('VP')) {
    recommendations.push({
      category: 'AI Leadership', colour: '#BA7517',
      name: 'AI Leader & Strategy',
      desc: 'Develop the strategic vision and leadership capabilities to drive AI transformation.',
    })
    recommendations.push({
      category: 'AI Leadership', colour: '#BA7517',
      name: 'AI for C-Suites & Management: Strategic Insights for Business Impact',
      desc: 'Equip executives with AI literacy and strategic frameworks for business impact.',
    })
  }

  // Minimum 2 fallback
  if (recommendations.length === 0) {
    recommendations.push({
      category: 'AI Literacy', colour: '#00ADA9',
      name: 'AI Literacy for the Modern Workplace',
      desc: 'Build foundational AI knowledge and practical skills for everyday workplace use.',
    })
    recommendations.push({
      category: 'AI Literacy', colour: '#00ADA9',
      name: 'Prompt Engineering & Multi-Tool Gen AI for Productivity',
      desc: 'Master prompt writing and multi-tool AI workflows to boost personal productivity.',
    })
  }

  const finalRecs = recommendations.slice(0, 4)

  // PDF handler
  const handleDownload = async () => {
    const el = reportRef.current
    if (!el) return
    setDownloading(true)
    try {
      const canvas = await html2canvas(el, { scale: 2, useCORS: true, backgroundColor: '#f9fafb' })
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)
      const fileName = 'PEOPLElogy-AI-Report-' + intake.firstName + '-' + new Date().toLocaleDateString().replace(/\//g, '-') + '.pdf'
      pdf.save(fileName)
    } catch (err) {
      console.error('PDF error:', err)
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">

      <Confetti />

      {/* Navbar */}
      <div className="bg-[#1B3A5C] px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
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
                const pct        = pillarPcts[i] ?? 0
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
                      ${isWeakest   ? 'text-red-500'   :
                        isStrongest ? 'text-[#00ADA9]' :
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

              <div className={`rounded-xl p-4 border
                ${absGap <= 20  ? 'bg-blue-50 border-blue-200'   :
                  gap > 20      ? 'bg-amber-50 border-amber-200' :
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

        {/* ── RECOMMENDATIONS ─────────────────────────────────────────── */}
        <div className="mb-8">
          <h2 className="text-[#1B3A5C] font-bold text-lg mb-4">
            What PEOPLElogy Can Help With
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {finalRecs.map((rec, i) => (
              <div key={i} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                <span
                  className="text-xs font-bold px-2 py-1 rounded-full text-white mb-2 inline-block"
                  style={{ backgroundColor: rec.colour }}
                >
                  {rec.category}
                </span>
                <p className="text-[#1B3A5C] font-bold text-base mt-1 mb-1">{rec.name}</p>
                <p className="text-gray-500 text-sm mb-3">{rec.desc}</p>
                <a
                  href="mailto:info@peoplelogy.com"
                  className="border border-[#00ADA9] text-[#00ADA9] text-sm px-4 py-2 rounded-xl hover:bg-[#E6FAF9] transition-colors inline-block"
                >
                  Find out more
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* ── CTA BANNER ──────────────────────────────────────────────── */}
        <div className="bg-[#1B3A5C] rounded-2xl p-6 text-center mb-6">
          <p className="text-white font-bold text-lg mb-2">
            Want a full AI Transformation Roadmap for your organisation?
          </p>
          <p className="text-white/60 text-sm mb-4">
            PEOPLElogy offers end-to-end AI transformation consulting, training and technology solutions tailored to your industry and maturity level.
          </p>
          <a
            href="mailto:info@peoplelogy.com"
            className="bg-[#00ADA9] hover:bg-[#008a87] text-white font-bold px-6 py-3 rounded-xl inline-block transition-colors"
          >
            Talk to PEOPLElogy
          </a>
        </div>

        {/* ── PDF + QR ────────────────────────────────────────────────── */}
        <div className="text-center mb-4">
          <button
            type="button"
            onClick={handleDownload}
            disabled={downloading}
            className="bg-[#1B3A5C] hover:bg-[#0f2a42] text-white font-bold px-6 py-3 rounded-xl flex items-center gap-2 mx-auto mb-4 disabled:opacity-60 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            {downloading ? 'Generating...' : 'Download My Report'}
          </button>
          <QRCode
            value={window.location.href}
            size={100}
            fgColor="#1B3A5C"
            bgColor="#ffffff"
          />
          <p className="text-gray-400 text-xs text-center mt-1">
            Scan to revisit your results on any device.
          </p>
        </div>

        {/* ── PDPA NOTE ───────────────────────────────────────────────── */}
        <p className="text-gray-300 text-xs text-center mt-4 pb-8">
          Your results are generated instantly. Individual data is never shared publicly. All data handled in accordance with PDPA 2010.
        </p>

      </div>
    </div>
  )
}
