/**
 * buildParticipantReport.js
 * ---------------------------------------------------------------
 * ONE code path, THREE report variants:
 *
 *   path === 'org'        -> org blocks only   (no individual row)
 *   path === 'individual' -> individual only   (response_id is null)
 *   path === 'full'       -> both, in sequence
 *
 * Every section is gated on whether its data actually exists, so an
 * individual-only participant can never be handed a page of NaN%.
 * The old html2canvas approach hid this problem by photographing
 * whatever happened to be on screen.
 *
 * All copy below is verbatim from:
 *   src/data/archetypes.js, orgQuestions.js,
 *   individualQuestions.js, tracks.js, qualitativeQuestions.js
 * ---------------------------------------------------------------
 */

import { Doc, T } from './reportRenderer'

/* =============================================================
 * CONTENT CONSTANTS
 * If you change these in src/data/*, change them here too.
 * Better: import them directly from src/data and delete these.
 * ============================================================= */

export const PILLAR_LABELS = [
  'Strategy & Leadership',
  'Data & Technology Infrastructure',
  'People & Workforce Skills',
  'Processes & AI Use Cases',
  'Governance, Risk & Responsible AI',
]

export const DIMENSIONS = [
  { key: 'D1', col: 'd1_awareness_score',   label: 'AI Awareness',         note: 'Understanding of AI concepts, tools and responsible use' },
  { key: 'D2', col: 'd2_tool_score',        label: 'Tool Proficiency',     note: 'Daily usage of AI tools in your role' },
  { key: 'D3', col: 'd3_prompt_score',      label: 'Prompt Ability',       note: 'Quality and effectiveness of AI prompting' },
  { key: 'D4', col: 'd4_opportunity_score', label: 'Opportunity Spotting', note: 'Identifying AI opportunities in your work' },
  { key: 'D5', col: 'd5_workflow_score',    label: 'Workflow Integration', note: 'Embedding AI into daily work routines' },
]

export const TRACKS = [
  {
    number: 1, category: 'Foundation', name: 'AI Literacy',
    tagline: 'Building AI foundations for everyone', color: '#7C3AED',
    audience: 'All employees — non-technical staff, frontline workers, and support functions who need practical AI fluency in their day-to-day roles.',
    objective: 'Build foundational AI awareness and instil confident, responsible daily productivity usage across the entire workforce — regardless of technical background.',
    focus: 'Everyday AI fluency and safe, confident daily usage',
    courses: [
      'AI Literacy for the Modern Workplace',
      'Workplace Productivity — Copilot Mastery',
      'Workplace Productivity — Gemini Mastery',
      'Workplace Productivity — ChatGPT Mastery',
      'Prompt Engineering & Multi-Tool Gen AI',
    ],
    outcomes: [
      'Increased individual productivity',
      'Reduced manual and repetitive work',
      'Safe, confident, and ethical AI usage',
    ],
  },
  {
    number: 2, category: 'Productivity', name: 'AI Practitioner',
    tagline: 'AI across business functions', color: '#00ADA9',
    audience: 'Executives, functional managers, business analysts and operations teams. Department leads across all functions.',
    objective: 'Equip business teams to identify, design, and implement AI use cases that drive measurable improvements in their specific functional domains.',
    focus: 'Function-specific AI use cases with measurable business impact',
    courses: [
      'AI for Finance & Banking', 'AI for Fintech', 'AI for Manufacturing',
      'AI for Supply Chain', 'AI for Retail & E-Commerce', 'AI for Procurement',
      'AI for Healthcare', 'AI for Sales & Commercial', 'AI for Business Analyst',
      'AI for Customer Service', 'AI for Operations', 'AI for HR & Administration',
      'AI for Marketing', 'AI for Cybersecurity',
    ],
    outcomes: [
      'AI-driven productivity gains per function',
      'Measurable use case implementation',
      'Role-specific AI capability across the organisation',
    ],
  },
  {
    number: 3, category: 'Development', name: 'AI Builder',
    tagline: 'Engineering AI-powered solutions', color: '#059669',
    audience: 'Technical and innovation teams who design, build, and deploy AI tools and automations.',
    objective: 'Enable technical and innovation teams to design, build, and deploy production-ready AI tools, agents, and automations that solve real business problems.',
    focus: 'Building and deploying production AI tools and agents',
    courses: [
      'Advanced LLM, Agents & AI Engineering',
      'Python with AI Agents',
      'Building AI Agents with Claude',
      'Vibe Coding & Rapid Prototyping',
      'Automating Processes with n8n & AI',
    ],
    outcomes: [
      'Build internal AI tools and assistants',
      'Automate complex business workflows',
      'Deploy and manage AI agents at scale',
    ],
  },
  {
    number: 4, category: 'Strategy', name: 'AI Leadership',
    tagline: 'Driving organisation-wide transformation', color: '#F97316',
    audience: 'Board of Directors, C-Suite Executives, Senior Leaders and VPs.',
    objective: 'Equip senior leaders and board members with the strategic clarity, governance frameworks, and investment rationale needed to lead AI transformation.',
    focus: 'Strategy, governance and enterprise-wide AI roadmap',
    courses: [
      'AI Leader & Strategy',
      'AI for C-Suites & Management: Strategic Insights',
    ],
    outcomes: [
      'A clear actionable AI roadmap',
      'Robust AI governance framework',
      'Strategic alignment across the enterprise',
    ],
  },
]

export const ARCHETYPE_TRACKS = {
  'The Sleeping Organisation':  { primary: 1, secondary: 4 },
  'The Frustrated Innovator':   { primary: 1, secondary: 2 },
  'The Hollow Strategy':        { primary: 1, secondary: 2 },
  'The Cautious Mover':         { primary: 2, secondary: 1 },
  'The Untapped Asset':         { primary: 2, secondary: 3 },
  'The Broken Pipeline':        { primary: 1, secondary: 4 },
  'The Scaling Organisation':   { primary: 2, secondary: 3 },
  'The AI-Ready Organisation':  { primary: 3, secondary: 4 },
}

const HEATMAP_LEGEND = [
  { label: '>=75% Strong',        color: T.green,  tint: '#E8F8EE' },
  { label: '50-74% Developing',   color: T.orange, tint: '#FEF2E7' },
  { label: '<50% Needs Focus',    color: T.red,    tint: '#FDECEC' },
]

const DEFAULT_PRIORITIES = [
  { title: 'Define your AI strategy', desc: 'A clear one-page commitment to where AI plays a role in your organisation.' },
  { title: 'Build daily AI habits',   desc: 'Consistent daily use of AI tools creates more change than any training programme.' },
  { title: 'Start with one process',  desc: 'Identify your highest-volume repetitive task and automate it first.' },
]

/* =============================================================
 * CONDITIONAL COPY — mirrors Results.jsx exactly
 * ============================================================= */

function realityCheckCallout(operational, leadership) {
  const diff = operational - leadership
  if (diff < -10) return {
    accent: T.amber, tint: '#FEF9E7',
    text: 'Your operational processes are your biggest constraint. Your leadership wants to move but your systems and processes are not set up to support AI at scale. Process documentation and automation readiness should be your first investment.',
  }
  if (diff > 10) return {
    accent: T.purple, tint: '#F6F1FE',
    text: 'Leadership commitment is your biggest gap. Even with good processes, AI transformation stalls without active sponsorship from the top. The most important conversation in your organisation is not about technology — it is about strategic priority.',
  }
  return {
    accent: T.blue, tint: '#EFF6FF',
    text: 'Your operational readiness and leadership culture are broadly aligned. Your transformation challenge is raising the overall baseline across both dimensions simultaneously.',
  }
}

function gapCallout(orgPct, indPct) {
  const gap = orgPct - indPct
  const absGap = Math.abs(gap)
  const arrow = absGap <= 10 ? '<->' : gap > 0 ? 'UP' : 'DOWN'
  if (gap > 20) return {
    accent: T.amber, tint: '#FEF9E7', arrow, gap,
    text: "Your organisation's direction is ahead of your personal AI toolkit. Focus on building daily AI habits.",
  }
  if (gap < -20) return {
    accent: T.teal, tint: '#E6F7F6', arrow, gap,
    text: 'You are ahead of your organisation. Consider championing AI adoption internally.',
  }
  return {
    accent: T.blue, tint: '#EFF6FF', arrow, gap,
    text: "You are well aligned with your organisation's AI progress. Keep building.",
  }
}

/* =============================================================
 * MAIN BUILDER
 * =============================================================
 *
 * @param {object} data
 * @param {'org'|'individual'|'full'} data.path
 * @param {object} data.intake        { firstName, organisation, industry, roleLevel }
 * @param {object} [data.orgScores]   { overallPercentage, maturityLevel, maturityLabel, pillarScores:[{sum,percentage}] }
 * @param {object} [data.qualitative] { operationalScore, leadershipScore, q8BoldMove }
 * @param {object} [data.individual]  { overallAverage, capabilityLabel, dimensionAverages, primaryLearningFocus, secondaryLearningFocus }
 * @param {object} [data.archetype]   { name, subtitle, narrative, color, priorities:[{title,desc}] }
 * @param {string} [data.sessionLabel]
 */
export function buildParticipantReport(data) {
  const {
    path = 'full',
    intake = {},
    orgScores = null,
    qualitative = null,
    individual = null,
    archetype = null,
    sessionLabel = null,
  } = data

  const hasOrg = !!orgScores && (path === 'org' || path === 'full')
  const hasInd = !!individual && (path === 'individual' || path === 'full')
  const hasQual = !!qualitative &&
    Number.isFinite(qualitative.operationalScore) &&
    Number.isFinite(qualitative.leadershipScore)

  const name = intake.firstName || 'Participant'
  const org = intake.organisation || ''
  const today = new Date().toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric',
  })

  const d = new Doc({
    runningHeader: `AI Readiness Report — ${name}${org ? ` · ${org}` : ''}`,
    footerNote: 'PEOPLElogy · Confidential — individual results are never shared publicly',
  })

  /* ---------- HEADER ---------- */
  d.docHeader({
    title: 'Your AI Readiness Report',
    subtitle: org ? `${name} from ${org}` : name,
    meta: sessionLabel ? `${sessionLabel} · ${today}` : today,
  })

  /* ---------- BLOCK 1: ARCHETYPE (org + full) ---------- */
  if (archetype && hasOrg) {
    d.heroCard({
      eyebrow: 'Your AI Profile',
      headline: archetype.name,
      tagline: archetype.subtitle,
      body: archetype.narrative,
      accent: archetype.color ? `#${String(archetype.color).replace('#', '')}` : T.blue,
    })
  }

  /* ---------- BLOCK 2: REALITY CHECK (needs qualitative) ---------- */
  if (hasQual) {
    d.sectionLabel('Reality Check Scores')
    d.statCards([
      { label: 'Operational Readiness', value: Math.round(qualitative.operationalScore), color: T.teal },
      { label: 'Leadership & Culture',  value: Math.round(qualitative.leadershipScore),  color: T.teal },
    ])
    const cb = realityCheckCallout(qualitative.operationalScore, qualitative.leadershipScore)
    d.calloutBox(cb)
  }

  /* ---------- BLOCK 3: ORG PILLARS ---------- */
  if (hasOrg && Array.isArray(orgScores.pillarScores)) {
    d.sectionLabel('Organisational Readiness by Pillar')

    const pcts = orgScores.pillarScores.map(p =>
      Math.round(Number.isFinite(p.percentage) ? p.percentage : (p.sum / 25) * 100))
    const minP = Math.min(...pcts)
    const maxP = Math.max(...pcts)
    const allEqual = minP === maxP

    PILLAR_LABELS.forEach((label, i) => {
      const pct = pcts[i]
      d.barRow({
        label,
        value: pct,
        badge: allEqual ? null : pct === minP ? 'Focus Area' : pct === maxP ? 'Strength' : null,
      })
    })
    d.space(3)

    if (Number.isFinite(orgScores.overallPercentage)) {
      d.statCards([{
        label: `Overall Maturity — Level ${orgScores.maturityLevel}: ${orgScores.maturityLabel}`,
        value: Math.round(orgScores.overallPercentage),
        color: T.navy,
      }])
    }
  }

  /* ---------- BLOCK 4: PERSONAL CAPABILITY ---------- */
  if (hasInd) {
    const capPct = Math.round((individual.overallAverage || 0) * 25)

    d.sectionLabel('Your Personal AI Capability')
    d.tierBadge({
      label: individual.capabilityLabel || '—',
      sub: `${capPct}% capability score`,
    })

    const da = individual.dimensionAverages || {}
    DIMENSIONS.forEach(dim => {
      const raw = da[dim.key]
      if (!Number.isFinite(raw)) return          // gate: skip missing dimensions
      d.barRow({ label: dim.label, value: Math.round(raw * 25), note: dim.note })
    })
    d.space(2)
    d.legend(HEATMAP_LEGEND)

    /* learning focus — either can legitimately be null */
    if (individual.primaryLearningFocus) {
      d.calloutBox({
        title: 'Your primary focus area',
        text: individual.primaryLearningFocus,
        accent: T.teal, tint: '#E6F7F6',
      })
    }
    if (individual.secondaryLearningFocus) {
      d.calloutBox({
        title: 'Your secondary focus area',
        text: individual.secondaryLearningFocus,
        accent: T.navy, tint: '#EEF2F7',
      })
    }
  }

  /* ---------- BLOCK 5: GAP MAP (full only) ---------- */
  if (path === 'full' && hasOrg && hasInd) {
    const orgPct = Math.round(orgScores.overallPercentage)
    const indPct = Math.round((individual.overallAverage || 0) * 25)
    const g = gapCallout(orgPct, indPct)

    d.sectionLabel('Gap & Opportunity Map')
    d.statCards([
      { label: 'Organisation', value: orgPct, color: T.navy },
      { label: 'You',          value: indPct, color: T.teal },
    ])
    d.calloutBox({ text: g.text, accent: g.accent, tint: g.tint })
  }

  /* ---------- BLOCK 6: NEXT STEPS ---------- */
  const priorities = (archetype && archetype.priorities) || DEFAULT_PRIORITIES
  d.sectionLabel('What You Should Do First')
  d.numberedList(priorities)
  d.space(3)

  /* ---------- BLOCK 7: LEARNING PATHWAY ---------- */
  d.sectionLabel('Your Learning Pathway')
  d.paragraph(
    "Your assessment results map directly to PEOPLElogy's AI training tracks. Your recommended tracks are highlighted.",
    { size: 8.6 }
  )

  const rec = (archetype && ARCHETYPE_TRACKS[archetype.name]) || { primary: 1, secondary: 2 }
  const badged = [rec.primary, rec.secondary]

  /* Expand ONLY the two recommended tracks, in full.
     Expanding all four would turn a diagnostic into a brochure and
     quietly contradict the recommendation the assessment just made. */
  badged.forEach((num, i) => {
    const t = TRACKS.find(x => x.number === num)
    if (!t) return
    d.trackBlock({ track: t, badge: i === 0 ? 'RECOMMENDED' : 'ALSO RELEVANT' })
  })

  /* All four, compact — cross-sell catalogue without dilution. */
  d.space(1)
  d.sectionLabel('All four tracks at a glance', T.navy)
  d.comparisonTable({
    highlight: badged,
    rows: TRACKS.map(t => ({
      number: t.number,
      name: t.name,
      category: t.category,
      color: t.color,
      audience: t.audience,
      courseCount: t.courses.length,
      focus: t.focus,
    })),
  })
  d.calloutBox({
    text: "PEOPLElogy offers all 4 tracks as open enrolment and corporate programmes. Talk to us to build your organisation's learning roadmap.",
    accent: T.teal, tint: '#E6F7F6',
  })

  /* ---------- BLOCK 8: CLOSING QUOTE (only if they answered) ---------- */
  const bold = qualitative && qualitative.q8BoldMove
  if (bold && String(bold).trim()) {
    d.quotePanel({
      lead: 'You said your bold AI move would be:',
      quote: String(bold).trim(),
      response: 'That is a goal worth pursuing. The organisations that achieve it are the ones that start now — not the ones that wait for the perfect moment.',
      note: "This diagnostic was designed by PEOPLElogy — Malaysia's Digital Workforce Transformation company.",
    })
  } else {
    d.space(2)
    d.paragraph(
      "This diagnostic was designed by PEOPLElogy — Malaysia's Digital Workforce Transformation company. All data handled in accordance with PDPA 2010.",
      { size: 7.4, color: T.muted }
    )
  }

  return d
}

/* Convenience wrapper used by the Results page download button. */
export function downloadParticipantReport(data) {
  const d = buildParticipantReport(data)
  const safe = String(data?.intake?.firstName || 'participant')
    .replace(/[^a-z0-9]/gi, '-').toLowerCase()
  return d.save(`PEOPLElogy-AI-Report-${safe}.pdf`)
}
