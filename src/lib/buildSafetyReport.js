/**
 * buildSafetyReport.js
 * ---------------------------------------------------------------
 * PDF report for the AI Safety Capacity & Digital Trust diagnostic.
 *
 * Reuses reportRenderer.js entirely — no new primitives needed.
 * Output: ~3 pages, ~20KB, vector text, zero network calls.
 *
 * Brand: PEOPLElogy Berhad.
 * ---------------------------------------------------------------
 */

import { Doc, T } from './reportRenderer'
import {
  SAFETY_PILLARS,
  SAFETY_QUESTIONS,
  TIERS,
  ALL_FRAMEWORKS,
} from '../data/safetyQuestions'
import { TIER_DETAIL } from '../data/safetyTiers'

/* TIER_DETAIL (objective / modules / outcomes) lives in
   ../data/safetyTiers so the on-screen results page can render it
   without importing this jsPDF-backed module. Re-exported here for
   any existing importers. */
export { TIER_DETAIL }

const URGENCY_COPY = {
  Immediate: {
    accent: T.red, tint: '#FDECEC',
    text: 'Your organisation currently has little to fall back on if an AI-related failure or attack occurs. The fastest route to reducing that exposure is organisation-wide awareness — it is the lowest-cost intervention with the largest immediate effect.',
  },
  High: {
    accent: T.orange, tint: '#FEF2E7',
    text: 'The risks are recognised but the practices are inconsistent. Awareness alone will not hold under pressure; the priority is turning informal habits into documented, owned practice.',
  },
  Moderate: {
    accent: T.blue, tint: '#EFF6FF',
    text: 'You have real controls in place. The gap now is assurance — being able to demonstrate and evidence what you do, not just describe it. That is a governance and practitioner capability, not an awareness one.',
  },
  Maintain: {
    accent: T.green, tint: '#E8F8EE',
    text: 'Your posture is strong relative to most organisations. The priority shifts from building capability to sustaining it — keeping pace as threats evolve, and extending the same standard across the wider organisation.',
  },
}

/**
 * @param {object} data
 * @param {object} data.intake  { firstName, organisation, industry, roleLevel, cluster }
 * @param {object} data.scores  return value of computeSafetyScores()
 * @param {object} [data.responses] raw { s1: idx, ... } for the answer appendix
 * @param {string} [data.sessionLabel]
 */
export function buildSafetyReport(data) {
  const { intake = {}, scores, responses = {}, sessionLabel = 'National AI Exhibition' } = data
  if (!scores) throw new Error('buildSafetyReport requires scores')

  const name = intake.firstName || 'Participant'
  const org = intake.organisation || ''
  const today = new Date().toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric',
  })

  const d = new Doc({
    runningHeader: `AI Safety Capacity Report — ${name}${org ? ` · ${org}` : ''}`,
    footerNote: 'PEOPLElogy Berhad · Confidential — individual results are never shared publicly',
  })

  /* ---------- HEADER ---------- */
  d.docHeader({
    title: 'AI Safety Capacity & Digital Trust',
    subtitle: org ? `${name} from ${org}` : name,
    meta: `${sessionLabel} · ${today}`,
  })

  /* ---------- HERO: capacity band ---------- */
  d.heroCard({
    eyebrow: 'Your AI Safety Capacity',
    headline: scores.capacityLabel,
    tagline: `${scores.overallPercentage}% overall capacity · ${scores.urgency} priority`,
    body: scores.capacitySummary,
    accent: scores.capacityColor,
  })

  /* ---------- THREE PILLARS ---------- */
  d.sectionLabel('Capacity by Pillar')

  const pcts = scores.pillarScores.map(p => p.percentage)
  const minP = Math.min(...pcts)
  const maxP = Math.max(...pcts)
  const allEqual = minP === maxP

  scores.pillarScores.forEach(p => {
    const def = SAFETY_PILLARS.find(x => x.key === p.key)
    d.barRow({
      label: p.name,
      value: p.percentage,
      note: def ? def.definition.split('—')[1]?.trim().slice(0, 96) : undefined,
      badge: allEqual ? null
        : p.percentage === minP ? 'Focus Area'
        : p.percentage === maxP ? 'Strength' : null,
    })
  })
  d.space(3)

  /* ---------- URGENCY CALLOUT ---------- */
  const u = URGENCY_COPY[scores.urgency] || URGENCY_COPY.High
  d.calloutBox({ title: `${scores.urgency} priority`, text: u.text, accent: u.accent, tint: u.tint })

  /* ---------- PRIMARY FOCUS ---------- */
  d.calloutBox({
    title: `Your priority: ${scores.primaryFocus}`,
    text: scores.primaryFocusDetail,
    accent: T.teal, tint: '#E6F7F6',
  })

  /* ---------- RECOMMENDED TIER ---------- */
  const tier = scores.tier || TIERS[1]
  const detail = TIER_DETAIL[tier.number] || TIER_DETAIL[1]

  d.sectionLabel('Your Recommended Programme Tier')
  d.paragraph(
    'Tier placement is determined by your role and governance responsibility, not by your score. Your score determines how urgently you should start.',
    { size: 8.6 }
  )

  d.trackBlock({
    track: {
      number: tier.number,
      category: tier.duration,
      name: tier.name,
      tagline: tier.focus,
      color: tier.color,
      objective: detail.objective,
      audience: tier.audience,
      courses: detail.modules,
      outcomes: detail.outcomes,
    },
    badge: 'RECOMMENDED',
  })

  d.calloutBox({
    title: tier.certification,
    text: `${tier.duration} · approximately ${tier.hours} contact hours. Part of a stackable certification ladder: Certified AI Aware, Certified AI Safety & Security Practitioner, and Certified AI Governance & Leadership — approximately 42 hours across the full programme.`,
    accent: tier.color, tint: '#F2F5F9',
  })

  /* ---------- FULL LADDER ---------- */
  d.space(1)
  d.sectionLabel('The Full Capability Ladder', T.navy)
  d.comparisonTable({
    highlight: [tier.number],
    rows: [1, 2, 3].map(n => ({
      number: n,
      name: TIERS[n].name,
      category: TIERS[n].duration,
      color: TIERS[n].color,
      audience: TIERS[n].audience,
      courseCount: TIER_DETAIL[n].modules.length,
      focus: TIERS[n].focus,
    })),
  })

  /* ---------- FRAMEWORK TRACEABILITY ----------
     This is the credibility layer. For a national audience, the
     question is always "what is this measured against". */
  d.sectionLabel('Frameworks This Assessment Is Measured Against', T.navy)
  d.paragraph(
    'Every question in this diagnostic maps to a module in the Building AI Safety Capacity & Digital Trust Resilience programme and to one or more of the following national and international references.',
    { size: 8.4 }
  )
  d.numberedList(
    ALL_FRAMEWORKS.map(f => ({ title: f, desc: '' })),
    T.navy
  )

  d.space(2)
  d.paragraph(
    'This diagnostic was designed by PEOPLElogy Berhad. All data handled in accordance with PDPA 2010. Individual results are never shared publicly.',
    { size: 7.4, color: T.muted }
  )

  return d
}

export function downloadSafetyReport(data) {
  const d = buildSafetyReport(data)
  const safe = String(data?.intake?.firstName || 'participant')
    .replace(/[^a-z0-9]/gi, '-').toLowerCase()
  return d.save(`PEOPLElogy-AI-Safety-Report-${safe}.pdf`)
}
