import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAssessment } from '../context/AssessmentContext'
import { DIMENSIONS, DIMENSION_KEYS } from '../data/individualQuestions'
import { ORG_PILLARS } from '../data/orgQuestions'
import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, Tooltip,
} from 'recharts'
import { QRCodeSVG } from 'qrcode.react'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import Logo from '../components/Logo'

const MATURITY_COLORS = {
  1: { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200', hex: '#ef4444' },
  2: { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-200', hex: '#f97316' },
  3: { bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-200', hex: '#eab308' },
  4: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200', hex: '#3b82f6' },
  5: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200', hex: '#22c55e' },
}

const CAPABILITY_COLORS = {
  'AI Beginner': { bg: 'bg-red-100', text: 'text-red-700' },
  'AI Explorer': { bg: 'bg-orange-100', text: 'text-orange-700' },
  'AI Practitioner': { bg: 'bg-yellow-100', text: 'text-yellow-700' },
  'AI Integrator': { bg: 'bg-blue-100', text: 'text-blue-700' },
  'AI Champion': { bg: 'bg-green-100', text: 'text-green-700' },
}

function PillarCard({ pillar, score, isWeakest, isStrongest }) {
  return (
    <div className={`rounded-xl p-4 border-2 ${
      isWeakest ? 'border-red-300 bg-red-50' :
      isStrongest ? 'border-[#00ADA9] bg-[#E6FAF9]' :
      'border-gray-100 bg-white'
    }`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-semibold text-[#1B3A5C]">{pillar.name}</span>
        <div className="flex items-center gap-2">
          {isWeakest && (
            <span className="text-xs font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded-full">Focus area</span>
          )}
          {isStrongest && (
            <span className="text-xs font-bold text-[#00ADA9] bg-[#E6FAF9] px-2 py-0.5 rounded-full">Strength</span>
          )}
          <span className={`text-sm font-bold ${
            isWeakest ? 'text-red-600' : isStrongest ? 'text-[#00ADA9]' : 'text-[#1B3A5C]'
          }`}>{score}%</span>
        </div>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2.5">
        <div
          className={`h-2.5 rounded-full transition-all duration-1000 ${
            isWeakest ? 'bg-red-400' : isStrongest ? 'bg-[#00ADA9]' : 'bg-[#1B3A5C]'
          }`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  )
}

function DimensionBar({ label, score, isLowest }) {
  const pct = Math.round(score * 25)
  return (
    <div className={`rounded-xl p-4 border ${isLowest ? 'border-orange-200 bg-orange-50' : 'border-gray-100 bg-white'}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-[#1B3A5C]">{label}</span>
        <span className={`text-sm font-bold ${isLowest ? 'text-orange-600' : 'text-[#1B3A5C]'}`}>
          {pct}%
        </span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-1000 ${isLowest ? 'bg-orange-400' : 'bg-[#00ADA9]'}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

function RecommendationCard({ title, body, cta = 'Talk to us', link = 'mailto:info@peoplelogy.com' }) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-[#E6FAF9] flex items-center justify-center flex-shrink-0">
          <svg className="w-5 h-5 text-[#00ADA9]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <div className="flex-1">
          <h4 className="font-bold text-[#1B3A5C] mb-2">{title}</h4>
          <p className="text-gray-600 text-sm leading-relaxed mb-4">{body}</p>
          <a
            href={link}
            className="inline-flex items-center gap-2 bg-[#00ADA9] hover:bg-[#008a87] text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            {cta}
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  )
}

const ORG_RECOMMENDATIONS = {
  'Strategy & Leadership': {
    title: 'AI Strategy & Leadership Alignment',
    body: 'PEOPLElogy offers executive-level AI transformation programmes designed to align leadership teams and build a clear AI vision. [Programme details to be added]',
  },
  'Data & Technology Infrastructure': {
    title: 'Data & Technology Readiness',
    body: 'Our technology readiness assessment and advisory services help organisations build the data infrastructure needed for AI. [Programme details to be added]',
  },
  'People & Workforce Skills': {
    title: 'AI Workforce Development',
    body: "PEOPLElogy's AI literacy and workforce capability programmes build the skills your people need to work effectively with AI. [Programme details to be added]",
  },
  'Processes & AI Use Cases': {
    title: 'AI Use Case Identification',
    body: 'Our facilitated AI use case workshops help organisations identify, prioritise and pilot the highest-value AI opportunities. [Programme details to be added]',
  },
  'Governance, Risk & Responsible AI': {
    title: 'AI Governance & Policy',
    body: 'PEOPLElogy helps organisations build responsible AI governance frameworks aligned to PDPA and industry best practices. [Programme details to be added]',
  },
}

export default function Results() {
  const navigate = useNavigate()
  const { assessmentData } = useAssessment()
  const { path, intake, orgScores, individualScores } = assessmentData
  const reportRef = useRef(null)
  const [downloading, setDownloading] = useState(false)
  const [currentUrl, setCurrentUrl] = useState('')

  useEffect(() => {
    setCurrentUrl(window.location.href)
    if (!intake.firstName) navigate('/')
  }, [intake.firstName, navigate])

  const handleDownload = async () => {
    if (!reportRef.current) return
    setDownloading(true)

    try {
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#f9fafb',
        logging: false,
      })

      const imgData = canvas.toDataURL('image/jpeg', 0.95)
      const pdf = new jsPDF('p', 'mm', 'a4')

      const pageWidth = pdf.internal.pageSize.getWidth()
      const pageHeight = pdf.internal.pageSize.getHeight()
      const imgWidth = canvas.width
      const imgHeight = canvas.height
      const ratio = imgWidth / imgHeight
      const pdfImgWidth = pageWidth - 20
      const pdfImgHeight = pdfImgWidth / ratio

      let position = 10
      let remainingHeight = pdfImgHeight

      pdf.addImage(imgData, 'JPEG', 10, position, pdfImgWidth, pdfImgHeight)

      if (pdfImgHeight > pageHeight - 20) {
        let pageCount = Math.ceil(pdfImgHeight / (pageHeight - 20))
        for (let i = 1; i < pageCount; i++) {
          pdf.addPage()
          pdf.addImage(imgData, 'JPEG', 10, -(pageHeight - 20) * i + 10, pdfImgWidth, pdfImgHeight)
        }
      }

      pdf.save(`PEOPLElogy-AI-Readiness-${intake.firstName}-${new Date().toISOString().split('T')[0]}.pdf`)
    } catch (err) {
      console.error('PDF generation failed:', err)
    } finally {
      setDownloading(false)
    }
  }

  const today = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
  const showOrg = path === 'org' || path === 'full'
  const showIndividual = path === 'individual' || path === 'full'
  const showGap = path === 'full' && orgScores && individualScores

  const orgPct = orgScores?.overallPercentage || 0
  const indPct = individualScores?.overallPercentage || 0
  const gap = orgPct - indPct

  let gapMessage = ''
  if (showGap) {
    if (gap > 20) {
      gapMessage = "Your organisation's direction is ahead of your personal AI toolkit. Focus on building daily AI habits."
    } else if (gap < -20) {
      gapMessage = 'You are ahead of your organisation. Consider championing AI adoption internally.'
    } else {
      gapMessage = "You are well aligned with your organisation's AI progress. Keep building."
    }
  }

  // Recommendations
  const recommendations = []
  if (showOrg && orgScores) {
    const weakPillarName = orgScores.weakestPillar?.name
    const rec = ORG_RECOMMENDATIONS[weakPillarName]
    if (rec) recommendations.push(rec)
  }
  if (showIndividual && individualScores) {
    const label = individualScores.capabilityLabel
    if (label === 'AI Beginner' || label === 'AI Explorer') {
      recommendations.push({
        title: 'AI Literacy Programme',
        body: "Build your personal AI capability with PEOPLElogy's structured AI literacy programme designed for working professionals. [Programme details to be added]",
        cta: 'Find out more',
      })
    }
  }

  // Radar data for org
  const radarData = orgScores?.pillarScores.map(p => ({
    pillar: p.name.split(' ')[0],
    fullName: p.name,
    score: p.percentage,
  })) || []

  // Dimension data for individual
  const dimData = individualScores ? DIMENSION_KEYS.map(d => ({
    key: d,
    label: DIMENSIONS[d],
    score: individualScores.dimensionAverages[d] || 0,
    isLowest: d === individualScores.lowestDim,
  })) : []

  const maturityColor = MATURITY_COLORS[orgScores?.maturityLevel] || MATURITY_COLORS[3]
  const capabilityColor = CAPABILITY_COLORS[individualScores?.capabilityLabel] || CAPABILITY_COLORS['AI Explorer']

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#1B3A5C] px-6 py-4 print:hidden">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Logo />
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="flex items-center gap-2 bg-[#00ADA9] hover:bg-[#008a87] disabled:opacity-60 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            {downloading ? (
              <>
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Generating PDF...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download Report
              </>
            )}
          </button>
        </div>
      </div>

      {/* Report content (captured for PDF) */}
      <div ref={reportRef} className="max-w-3xl mx-auto px-4 py-8">
        {/* Report header */}
        <div className="bg-[#1B3A5C] rounded-2xl p-6 mb-6 text-white">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="font-bold text-lg">
                  PEOPLE<span style={{color:'#00ADA9'}}>logy</span>
                </span>
                <span className="text-white/40 text-sm">·</span>
                <span className="text-white/60 text-sm">AI Readiness Report</span>
              </div>
              <h1 className="text-2xl font-bold mb-1">
                {intake.firstName}'s AI Readiness Report
              </h1>
              <p className="text-white/70 text-sm">{intake.organisation}</p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-white/20 flex flex-wrap gap-4 text-xs text-white/60">
            <span>Generated: {today}</span>
            <span>Open Day JB · 5 May 2026</span>
            <span>Session: JBOPEN2026</span>
          </div>
        </div>

        {/* Section 1: Org Readiness */}
        {showOrg && orgScores && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-[#1B3A5C] mb-5 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-[#1B3A5C] text-white text-xs flex items-center justify-center font-bold">1</span>
              Organisation AI Readiness
            </h2>

            {/* Score hero */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-4">
              <div className="flex items-center gap-6 flex-wrap">
                <div className="text-center">
                  <div className="text-5xl font-black text-[#1B3A5C]">{orgScores.overallPercentage}%</div>
                  <div className="text-gray-500 text-xs mt-1">Overall Score</div>
                </div>
                <div>
                  <div className={`inline-flex items-center gap-2 border-2 px-4 py-2 rounded-xl ${maturityColor.bg} ${maturityColor.text} ${maturityColor.border}`}>
                    <span className="font-black text-lg">Level {orgScores.maturityLevel}</span>
                    <span className="font-semibold">— {orgScores.maturityLabel}</span>
                  </div>
                  <p className="text-gray-500 text-xs mt-2">AI Maturity Level</p>
                </div>
              </div>
            </div>

            {/* Radar + Pillars */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                <h3 className="text-sm font-semibold text-[#1B3A5C] mb-3">Pillar Scores</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="#e5e7eb" />
                    <PolarAngleAxis
                      dataKey="pillar"
                      tick={{ fill: '#6b7280', fontSize: 11 }}
                    />
                    <Radar
                      dataKey="score"
                      stroke="#00ADA9"
                      fill="#00ADA9"
                      fillOpacity={0.2}
                      strokeWidth={2}
                    />
                    <Tooltip
                      formatter={(val, name, props) => [`${val}%`, props.payload.fullName]}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-3">
                {orgScores.pillarScores.map((ps, i) => (
                  <PillarCard
                    key={i}
                    pillar={ORG_PILLARS[i]}
                    score={ps.percentage}
                    isWeakest={orgScores.weakestPillar.pillar === ps.pillar}
                    isStrongest={orgScores.strongestPillar.pillar === ps.pillar}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Section 2: Individual Capability */}
        {showIndividual && individualScores && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-[#1B3A5C] mb-5 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-[#1B3A5C] text-white text-xs flex items-center justify-center font-bold">
                {showOrg ? '2' : '1'}
              </span>
              Personal AI Capability
            </h2>

            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-4">
              <div className="flex items-center gap-6 flex-wrap">
                <div className="text-center">
                  <div className="text-5xl font-black text-[#1B3A5C]">{individualScores.overallPercentage}%</div>
                  <div className="text-gray-500 text-xs mt-1">Capability Score</div>
                </div>
                <div>
                  <div className={`inline-flex items-center px-4 py-2 rounded-xl font-bold text-lg ${capabilityColor.bg} ${capabilityColor.text}`}>
                    {individualScores.capabilityLabel}
                  </div>
                  <p className="text-gray-500 text-xs mt-2">AI Capability Level</p>
                </div>
              </div>
            </div>

            <div className="space-y-3 mb-4">
              {dimData.map(d => (
                <DimensionBar
                  key={d.key}
                  label={d.label}
                  score={d.score}
                  isLowest={d.isLowest}
                />
              ))}
            </div>

            <div className="bg-[#E6FAF9] border border-[#00ADA9]/20 rounded-xl p-4">
              <p className="text-xs font-semibold text-[#00ADA9] uppercase tracking-wide mb-1">Primary Learning Focus</p>
              <p className="text-[#1B3A5C] font-medium text-sm">{individualScores.primaryLearningFocus}</p>
              {individualScores.secondaryLearningFocus && (
                <p className="text-gray-500 text-xs mt-2">Secondary: {individualScores.secondaryLearningFocus}</p>
              )}
            </div>
          </div>
        )}

        {/* Section 3: Gap Analysis */}
        {showGap && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-[#1B3A5C] mb-5 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-[#1B3A5C] text-white text-xs flex items-center justify-center font-bold">3</span>
              Gap Analysis
            </h2>

            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-4">
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div className="text-center">
                  <div className="text-4xl font-black text-[#1B3A5C]">{orgPct}%</div>
                  <div className="text-gray-500 text-sm mt-1">Org Readiness</div>
                  <div className={`text-xs font-medium mt-1 ${maturityColor.text}`}>
                    Level {orgScores.maturityLevel}: {orgScores.maturityLabel}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-black text-[#00ADA9]">{indPct}%</div>
                  <div className="text-gray-500 text-sm mt-1">Personal Capability</div>
                  <div className={`text-xs font-medium mt-1 ${capabilityColor.text}`}>
                    {individualScores.capabilityLabel}
                  </div>
                </div>
              </div>

              <div className={`rounded-xl p-4 border ${
                Math.abs(gap) <= 20 ? 'bg-green-50 border-green-200' :
                gap > 20 ? 'bg-orange-50 border-orange-200' : 'bg-blue-50 border-blue-200'
              }`}>
                <div className="flex items-start gap-3">
                  <svg className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                    Math.abs(gap) <= 20 ? 'text-green-600' :
                    gap > 20 ? 'text-orange-600' : 'text-blue-600'
                  }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className={`text-sm font-medium ${
                    Math.abs(gap) <= 20 ? 'text-green-800' :
                    gap > 20 ? 'text-orange-800' : 'text-blue-800'
                  }`}>{gapMessage}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Section 4: Recommendations */}
        {recommendations.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-[#1B3A5C] mb-5 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-[#1B3A5C] text-white text-xs flex items-center justify-center font-bold">
                {showGap ? '4' : showOrg && showIndividual ? '3' : '2'}
              </span>
              What PEOPLElogy Can Help With
            </h2>
            <div className="space-y-4">
              {recommendations.map((rec, i) => (
                <RecommendationCard key={i} {...rec} />
              ))}
            </div>
          </div>
        )}

        {/* QR + Download */}
        <div className="bg-[#1B3A5C] rounded-2xl p-6 text-center">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
            <div>
              <div className="bg-white p-3 rounded-xl inline-block mb-3">
                {currentUrl && (
                  <QRCodeSVG
                    value={currentUrl}
                    size={100}
                    fgColor="#1B3A5C"
                    bgColor="#ffffff"
                  />
                )}
              </div>
              <p className="text-white/60 text-xs">Scan to revisit your results</p>
            </div>

            <div className="flex-1 max-w-xs">
              <h3 className="text-white font-bold text-lg mb-2">Download Your Report</h3>
              <p className="text-white/60 text-sm mb-4">
                Save a PDF copy of your full AI Readiness Report.
              </p>
              <button
                onClick={handleDownload}
                disabled={downloading}
                className="w-full bg-[#00ADA9] hover:bg-[#008a87] disabled:opacity-60 text-white font-bold py-3 px-6 rounded-xl transition-colors text-sm"
              >
                {downloading ? 'Generating...' : 'Download My Report (PDF)'}
              </button>
            </div>
          </div>

          <p className="text-white/30 text-xs mt-6">
            Your results are generated instantly. Individual data is never shared publicly.
            Handled in accordance with Malaysia's PDPA 2010.
          </p>
          <p className="text-white/40 text-xs mt-2">
            PEOPLElogy Berhad · AI Transformation · Open Day JB 2026 · info@peoplelogy.com
          </p>
        </div>
      </div>

      {/* Start again */}
      <div className="max-w-3xl mx-auto px-4 pb-10 text-center">
        <button
          onClick={() => navigate('/')}
          className="text-gray-400 hover:text-[#1B3A5C] text-sm underline"
        >
          Start a new assessment
        </button>
      </div>
    </div>
  )
}
