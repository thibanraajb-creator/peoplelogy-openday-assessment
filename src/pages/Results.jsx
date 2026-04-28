import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAssessment } from '../context/AssessmentContext'
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, Tooltip } from 'recharts'
import Confetti from '../components/Confetti'
import Logo from '../components/Logo'
import { ARCHETYPES, PRIORITIES } from '../data/archetypes'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

export default function Results() {
  const navigate = useNavigate()
  const reportRef = useRef(null)
  const { assessmentData } = useAssessment()
  const { path, intake, orgScores, individualScores, qualitativeScores } = assessmentData

  if (!orgScores && !individualScores && !qualitativeScores) {
    navigate('/')
    return null
  }

  const archetype = qualitativeScores?.archetype || null
  const archetypeData = archetype ? ARCHETYPES[archetype] : null
  const priorities = archetype ? PRIORITIES[archetype] : null

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
            <h2
              className="font-black text-3xl mb-2"
              style={{ color: '#' + archetypeData.color }}
            >
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
              {/* Operational Readiness */}
              <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm text-center">
                <p className="text-gray-400 text-xs font-bold uppercase tracking-wide mb-2">
                  OPERATIONAL READINESS
                </p>
                <p className="text-3xl font-black text-[#1B3A5C]">
                  {qualitativeScores.operationalScore}%
                </p>
                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mt-3">
                  <div
                    className="h-full bg-[#00ADA9] rounded-full"
                    style={{ width: `${qualitativeScores.operationalScore}%` }}
                  />
                </div>
              </div>

              {/* Leadership & Culture */}
              <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm text-center">
                <p className="text-gray-400 text-xs font-bold uppercase tracking-wide mb-2">
                  LEADERSHIP &amp; CULTURE
                </p>
                <p className="text-3xl font-black text-[#1B3A5C]">
                  {qualitativeScores.leadershipScore}%
                </p>
                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mt-3">
                  <div
                    className="h-full bg-[#00ADA9] rounded-full"
                    style={{ width: `${qualitativeScores.leadershipScore}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Contextual insight */}
            {(() => {
              const opScore = qualitativeScores.operationalScore
              const lcScore = qualitativeScores.leadershipScore
              const diff = opScore - lcScore
              if (diff < -10) {
                return (
                  <div className="rounded-xl p-4 text-sm bg-amber-50 border border-amber-200 text-amber-800">
                    Your operational processes are your biggest constraint. Your leadership wants to move but your systems and processes are not set up to support AI at scale. Process documentation and automation readiness should be your first investment.
                  </div>
                )
              }
              if (diff > 10) {
                return (
                  <div className="rounded-xl p-4 text-sm bg-purple-50 border border-purple-200 text-purple-800">
                    Leadership commitment is your biggest gap. Even with good processes, AI transformation stalls without active sponsorship from the top. The most important conversation in your organisation is not about technology — it is about strategic priority.
                  </div>
                )
              }
              return (
                <div className="rounded-xl p-4 text-sm bg-blue-50 border border-blue-200 text-blue-800">
                  Your operational readiness and leadership culture are broadly aligned. Your transformation challenge is raising the overall baseline across both dimensions simultaneously.
                </div>
              )
            })()}
          </div>
        )}

      </div>
    </div>
  )
}
