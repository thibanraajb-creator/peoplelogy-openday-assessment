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
  TIERS,
  ALL_FRAMEWORKS,
} from '../data/safetyQuestions'

/* Tier detail from the programme document — used for the expanded block. */
const TIER_DETAIL = {
  1: {
    objective: 'Give every member of the organisation a working understanding of AI safety, digital trust, and resilience, and the habits to use AI safely and responsibly.',
    modules: [
      'Welcome & National Context',
      'Pillar 1 — AI Safety: When AI Gets It Wrong',
      'Pillar 2 — Digital Trust: Deepfakes, Identity & What to Believe',
      'Pillar 3 — Resilience: Securing AI & Staying Safe',
      'Applied — Safe & Responsible AI in Your Daily Work',
      'Closing — Your Safe-AI Commitments & National Alignment',
    ],
    outcomes: [
      'Recognise AI safety risks and when to question outputs',
      'Spot deepfake and identity threats',
      'Understand AI security and responsible use',
      'Apply safe practices in daily work',
    ],
  },
  2: {
    objective: 'Equip technical staff to test AI systems for safety, secure them against AI-specific threats, defend digital trust, and operate them resiliently.',
    modules: [
      'Day 1 — AI Safety Engineering: failure modes, red-teaming, guardrails',
      'Day 2 — Digital Trust & AI Security: securing the AI stack, OWASP LLM Top 10',
      'Day 2 — Deepfake & synthetic-media defence, e-KYC protection',
      'Day 3 — Threat modelling, monitoring, detection & response',
      'Day 3 — Secure deployment & AI security operations',
      'Hands-on labs each day, closing with an incident-response simulation',
    ],
    outcomes: [
      'Test AI systems for safety and robustness',
      'Conduct AI red-teaming',
      'Secure AI against OWASP LLM threats',
      'Detect deepfakes and defend identity',
      'Build AI incident detection and response',
    ],
  },
  3: {
    objective: "Enable leaders and governance officers to build, run, and lead an organisational AI governance posture aligned to Malaysia's national framework.",
    modules: [
      'Day 1 — The AI Governance Landscape: AIGE, NAIO, PDPA, NIST, ISO/IEC 42001',
      'Day 1 — Risk-based AI governance and control matching',
      'Day 1 — Roles, accountability & operating model',
      'Day 2 — Policies & assurance; third-party and vendor AI risk',
      'Day 2 — Leadership, board reporting & culture',
      'Hands-on: map your AI risk landscape, draft your governance roadmap',
    ],
    outcomes: [
      'Build an AI governance framework',
      'Apply AIGE and international standards',
      'Establish risk assessment and assurance',
      'Manage third-party AI risk',
      'Lead accountable AI adoption',
    ],
  },
}

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
  const metaBits = [sessionLabel, today].filter(Boolean)
  d.docHeader({
    title: 'AI Safety Capacity & Digital Trust',
    subtitle: [org ? `${name} from ${org}` : name, scores.clusterName]
      .filter(Boolean).join('  ·  '),
    meta: metaBits.join(' · '),
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
      // `short` is a hand-written descriptor. The previous version split the
      // long definition on an em-dash and truncated at 96 chars, which cut
      // mid-word and rendered nothing at all for Resilience (no em-dash).
      note: def ? def.short : undefined,
      badge: allEqual ? null
        : p.percentage === minP ? 'Focus Area'
        : p.percentage === maxP ? 'Strength' : null,
    })
  })
  d.space(3)

  /* ---------- URGENCY CALLOUT ---------- */
  const u = URGENCY_COPY[scores.urgency] || URGENCY_COPY.High
  d.calloutBox({ title: `${scores.urgency} priority`, text: u.text, accent: u.accent, tint: u.tint })

  /* ---------- PRIMARY FOCUS ----------
     Suppressed when the profile is flat (no genuine weakest pillar) and
     reframed at the top band. Previously a 100/100/100 respondent was
     told their weakest area was AI Safety and instructed to start
     verifying outputs — directly contradicting the Resilient band and
     the Maintain priority printed above it. */
  if (scores.primaryFocus && scores.primaryFocusDetail) {
    d.calloutBox({
      title: `Your priority: ${scores.primaryFocus}`,
      text: scores.primaryFocusDetail,
      accent: T.teal, tint: '#E6F7F6',
    })
  } else if (scores.capacityLabel === 'Resilient') {
    d.calloutBox({
      title: 'Your priority: sustain and extend',
      text: 'Your three pillars are evenly developed and all at a strong level. There is no single weak area to address. The priority is holding this standard as threats evolve, and extending the same practice to teams and functions that have not yet reached it.',
      accent: T.green, tint: '#E8F8EE',
    })
  } else {
    d.calloutBox({
      title: 'Your priority: build across all three pillars',
      text: 'Your three pillars are evenly developed, so there is no single weakest area to target first. Build capability across safety, trust, and resilience together rather than sequencing one ahead of the others.',
      accent: T.teal, tint: '#E6F7F6',
    })
  }

  /* ---------- RECOMMENDED TIER ---------- */
  const tier = scores.tier || TIERS[1]
  const detail = TIER_DETAIL[tier.number] || TIER_DETAIL[1]

  d.sectionLabel('Your Recommended Programme Tier')

  /* Show WHY this tier, in the participant's own terms. Asserting a tier
     without the reasoning gives the reader no way to judge whether the
     instrument understood them, and no answer when a colleague asks why
     they were placed differently. */
  if (scores.moduleLabel) {
    d.paragraph(
      'You answered the ' + String(scores.moduleLabel).toLowerCase() +
      ' question set — nine questions shared by all participants, plus six written specifically for your function.',
      { size: 8.4 }
    )
  }
  d.calloutBox({
    title: scores.tierBasis || 'Based on your role',
    text: scores.tierReason ||
      'Tier placement is determined by your role and governance responsibility, not by your score.',
    accent: scores.tierOverride ? T.navy : tier.color,
    tint: scores.tierOverride ? '#EEF2F7' : '#F2F5F9',
  })

  d.paragraph(
    'Your role determines WHICH tier. Your score determines HOW URGENTLY you should start — you scored ' +
    scores.overallPercentage + '%, placing you in the ' + scores.capacityLabel +
    ' band, which is a ' + String(scores.urgency).toLowerCase() + ' priority.',
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
  d.paragraph(
    'The tiers are stackable and may be taken independently. Your highlighted tier is the one written for your role — the others remain available to colleagues in those functions.',
    { size: 8.2 }
  )
  d.comparisonTable({
    highlight: [tier.number],
    countHeader: 'HOURS',
    rows: [1, 2, 3].map(n => ({
      number: n,
      name: TIERS[n].name,
      category: TIERS[n].duration,
      color: TIERS[n].color,
      audience: TIERS[n].audience,
      // was modules.length — printed "6" for all three tiers, which
      // told the reader nothing. Contact hours differentiate them.
      courseCount: TIERS[n].hours + 'h',
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
