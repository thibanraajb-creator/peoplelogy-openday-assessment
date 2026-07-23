/**
 * safetyQuestions.js
 * ---------------------------------------------------------------
 * AI Safety Capacity & Digital Trust Readiness — third assessment path.
 *
 * 15 scored questions (5 per pillar) + 1 routing question.
 * Tier routing reuses intake.cluster (A-E) — no new intake field.
 *
 * Source: "Building AI Safety Capacity & Digital Trust Resilience"
 * three-pillar tiered programme (PEOPLElogy Berhad).
 *
 * SCORING NOTE: pillar percentage uses TRUE 0-100 normalisation,
 *   (sum - 5) / 15 * 100
 * NOT sum/20*100. The org path uses the un-normalised form, which
 * makes its bottom tier mathematically unreachable. Do not repeat it.
 * ---------------------------------------------------------------
 */

export const SAFETY_PILLARS = [
  {
    key: 'P1',
    name: 'AI Safety',
    short: 'Safety',
    color: '#00ADA9',
    definition: 'Ensuring AI systems behave reliably and do not cause harm — managing bias, hallucination, and unsafe or unreliable outputs, and keeping meaningful human oversight and control.',
  },
  {
    key: 'P2',
    name: 'Digital Trust',
    short: 'Trust',
    color: '#3B82F6',
    definition: 'Preserving trust in identity, content, and transactions in an era of deepfakes and synthetic media — through verification, provenance, and data integrity.',
  },
  {
    key: 'P3',
    name: 'Resilience',
    short: 'Resilience',
    color: '#7C3AED',
    definition: 'The operational capacity to secure AI systems and to withstand, detect, respond to, and recover from AI-related threats and failures.',
  },
]

/* Every question carries `module` and `frameworks` so the report can
   print framework traceability. For a ministry audience this is what
   separates a validated instrument from a survey. */
export const SAFETY_QUESTIONS = [
  /* ---------------- PILLAR 1 — AI SAFETY ---------------- */
  {
    id: 's1', pillar: 'P1', col: 'p1_q1',
    module: 'Tier 1 · Pillar 1 — How AI fails: bias, hallucination, and unreliable outputs',
    frameworks: ['AIGE'],
    text: 'Have you ever received an AI output that was confidently stated but factually wrong?',
    options: [
      { text: 'Yes — and I know how to check for it before I rely on anything', score: 4 },
      { text: 'Yes — I have noticed it, but I do not have a consistent way to catch it', score: 3 },
      { text: 'I am not sure — I have not looked closely at whether outputs were correct', score: 2 },
      { text: 'No — I generally assume AI outputs are accurate', score: 1 },
    ],
  },
  {
    id: 's2', pillar: 'P1', col: 'p1_q2',
    module: 'Tier 1 · Pillar 1 — Why human oversight and judgment remain essential',
    frameworks: ['AIGE', 'NIST AI RMF'],
    text: 'Before an AI-generated output is used in a decision, document, or communication that leaves your team — what happens?',
    options: [
      { text: 'A named person reviews and is accountable for it before it goes out', score: 4 },
      { text: 'It is usually reviewed, but informally and depending on who is involved', score: 3 },
      { text: 'It is reviewed only if someone happens to be uncertain about it', score: 2 },
      { text: 'It generally goes out as produced', score: 1 },
    ],
  },
  {
    id: 's3', pillar: 'P1', col: 'p1_q3',
    module: 'Tier 1 · Pillar 1 — Recognising when to trust, and when to question, an AI output',
    frameworks: ['AIGE'],
    text: 'How confident are you in judging when an AI output should NOT be trusted?',
    options: [
      { text: 'Very confident — I know the specific situations where these systems are unreliable', score: 4 },
      { text: 'Reasonably confident — I can usually tell when something looks wrong', score: 3 },
      { text: 'Not very confident — I would struggle to say when to be sceptical', score: 2 },
      { text: 'I have not thought about it — I have no clear basis for judging', score: 1 },
    ],
  },
  {
    id: 's4', pillar: 'P1', col: 'p1_q4',
    module: 'Tier 2 Day 1 — Establishing acceptance criteria and human-in-the-loop checkpoints',
    frameworks: ['NIST AI RMF', 'ISO/IEC 42001'],
    text: 'Does your organisation define what "good enough" means before an AI tool is used for anything consequential?',
    options: [
      { text: 'Yes — there are documented acceptance criteria and checkpoints by risk level', score: 4 },
      { text: 'Partly — some teams have set standards, but it is not organisation-wide', score: 3 },
      { text: 'No — but there is an informal sense of where AI should not be used', score: 2 },
      { text: 'No — AI tools are used wherever people find them useful', score: 1 },
    ],
  },
  {
    id: 's5', pillar: 'P1', col: 'p1_q5',
    module: 'Tier 2 Day 1 — Guardrails, safe-by-design controls, and safety testing in the lifecycle',
    frameworks: ['NIST AI RMF', 'ISO/IEC 42001'],
    text: 'When your organisation adopts a new AI tool or feature, is it tested for unsafe or biased behaviour before people use it?',
    options: [
      { text: 'Yes — there is a structured safety evaluation, including adversarial testing', score: 4 },
      { text: 'Somewhat — it is trialled and reviewed, but not tested for unsafe behaviour specifically', score: 3 },
      { text: 'Rarely — tools are adopted based on usefulness and vendor assurances', score: 2 },
      { text: 'Never — or I do not know whether this happens', score: 1 },
    ],
  },

  /* ---------------- PILLAR 2 — DIGITAL TRUST ---------------- */
  {
    id: 't1', pillar: 'P2', col: 'p2_q1',
    module: 'Tier 1 · Pillar 2 — Deepfakes, voice cloning, and synthetic identity explained',
    frameworks: ['CyberSecurity Malaysia'],
    text: 'How confident are you that you could recognise a deepfake video or a cloned voice of someone you know?',
    options: [
      { text: 'Confident — and I know that appearance alone is no longer sufficient proof', score: 4 },
      { text: 'Somewhat confident — I would probably notice something felt wrong', score: 3 },
      { text: 'Not confident — I think I would likely be fooled', score: 2 },
      { text: 'I have not seriously considered that this could happen to me', score: 1 },
    ],
  },
  {
    id: 't2', pillar: 'P2', col: 'p2_q2',
    module: 'Tier 1 · Pillar 2 — Real threats in Malaysia: deepfake scams and executive impersonation',
    frameworks: ['CyberSecurity Malaysia'],
    text: 'If you received an urgent voice message or video call from a senior leader instructing you to make a payment or release information — what would you do?',
    options: [
      { text: 'Verify through a separate known channel before acting, every time — this is standard practice for me', score: 4 },
      { text: 'Probably verify, though I might not if it seemed clearly genuine and urgent', score: 3 },
      { text: 'Likely act on it — a voice or video from someone I know is convincing', score: 2 },
      { text: 'Act on it — that is how instructions normally reach me', score: 1 },
    ],
  },
  {
    id: 't3', pillar: 'P2', col: 'p2_q3',
    module: 'Tier 1 · Pillar 2 / Tier 2 Day 2 — Provenance, watermarking, and authentication standards',
    frameworks: ['AIGE', 'CyberSecurity Malaysia'],
    text: 'Does your organisation have any way of establishing where a document, image, or recording actually came from?',
    options: [
      { text: 'Yes — we use provenance, watermarking, or authentication standards for sensitive content', score: 4 },
      { text: 'Partly — some content is verified, but there is no consistent method', score: 3 },
      { text: 'No — but we recognise it is becoming a problem', score: 2 },
      { text: 'No — and it has not come up as a concern', score: 1 },
    ],
  },
  {
    id: 't4', pillar: 'P2', col: 'p2_q4',
    module: 'Tier 2 Day 2 — Defending identity verification and e-KYC processes',
    frameworks: ['PDPA', 'CyberSecurity Malaysia'],
    text: "Does your organisation verify a person's identity remotely — onboarding, e-KYC, account access, or approvals?",
    options: [
      { text: 'Yes — and our verification has been assessed specifically against synthetic identity and deepfake risk', score: 4 },
      { text: 'Yes — and we have discussed the risk, but not formally assessed it', score: 3 },
      { text: 'Yes — and we have not considered whether AI-generated identity could defeat it', score: 2 },
      { text: 'I do not know how identity is verified in my organisation', score: 1 },
    ],
  },
  {
    id: 't5', pillar: 'P2', col: 'p2_q5',
    module: 'Tier 1 · Pillar 2 — Real threats in Malaysia',
    frameworks: ['CyberSecurity Malaysia', 'NAIO'],
    text: 'How aware is your organisation of AI-enabled fraud already affecting Malaysian organisations?',
    options: [
      { text: 'Well aware — we track it and have briefed our people on specific cases', score: 4 },
      { text: 'Somewhat aware — leadership knows, but it has not reached most staff', score: 3 },
      { text: 'Vaguely aware — we have seen news coverage but taken no action', score: 2 },
      { text: 'Not aware — this is not something we have discussed', score: 1 },
    ],
  },

  /* ---------------- PILLAR 3 — RESILIENCE ---------------- */
  {
    id: 'r1', pillar: 'P3', col: 'p3_q1',
    module: "Tier 1 · Pillar 3 — AI-powered attacks and the risk of unmanaged 'shadow AI' at work",
    frameworks: ['AIGE', 'PDPA'],
    text: 'Do you know which AI tools your colleagues are using for work?',
    options: [
      { text: 'Yes — there is an approved list and people generally stay within it', score: 4 },
      { text: 'Roughly — there is guidance, but people also use tools outside it', score: 3 },
      { text: 'No — people use whatever they find, and nobody tracks it', score: 2 },
      { text: 'No — and there is no guidance on what is or is not permitted', score: 1 },
    ],
  },
  {
    id: 'r2', pillar: 'P3', col: 'p3_q2',
    module: 'Tier 1 · Pillar 3 — Protecting data and privacy when using AI tools',
    frameworks: ['PDPA', 'ISO/IEC 42001'],
    text: 'Is there a clear rule about what information must never be entered into a public AI tool?',
    options: [
      { text: 'Yes — the rule is documented, people know it, and it is enforced', score: 4 },
      { text: 'Yes — but it is informal and not consistently followed', score: 3 },
      { text: 'No — people use their own judgement', score: 2 },
      { text: 'No — and I am not certain what would count as sensitive here', score: 1 },
    ],
  },
  {
    id: 'r3', pillar: 'P3', col: 'p3_q3',
    module: 'Tier 1 · Pillar 3 — Spotting, reporting, and responding to AI-related incidents',
    frameworks: ['CyberSecurity Malaysia', 'NIST AI RMF'],
    text: 'If an AI tool leaked confidential information or produced a harmful output, would you know what to do?',
    options: [
      { text: 'Yes — there is a defined reporting route and I know how to use it', score: 4 },
      { text: 'Probably — I would raise it with my manager or IT', score: 3 },
      { text: 'I would not be sure who to tell or whether it warranted reporting', score: 2 },
      { text: 'I would probably not recognise it as an incident', score: 1 },
    ],
  },
  {
    id: 'r4', pillar: 'P3', col: 'p3_q4',
    module: 'Tier 2 Day 3 — Building an AI incident-response process; recovery and continuity',
    frameworks: ['NIST AI RMF', 'ISO/IEC 42001', 'CyberSecurity Malaysia'],
    text: 'Does your organisation have a plan for responding to an AI-related security incident?',
    options: [
      { text: 'Yes — documented, owned, and tested or rehearsed', score: 4 },
      { text: 'Yes — it exists on paper but has never been exercised', score: 3 },
      { text: 'No — we would handle it under our general IT incident process', score: 2 },
      { text: 'No — and I do not think anyone owns this', score: 1 },
    ],
  },
  {
    id: 'r5', pillar: 'P3', col: 'p3_q5',
    module: 'Tier 2 Day 3 — Logging, monitoring, and anomaly detection; detecting abuse, drift, and leakage',
    frameworks: ['NIST AI RMF', 'ISO/IEC 42001', 'OWASP LLM Top 10'],
    text: 'Does your organisation monitor how AI systems are behaving once they are in use?',
    options: [
      { text: 'Yes — we log and monitor for abuse, drift, and data leakage', score: 4 },
      { text: 'Partly — usage is logged but not actively monitored for problems', score: 3 },
      { text: 'No — once a tool is deployed we assume it keeps working as expected', score: 2 },
      { text: 'I do not know whether anything is monitored', score: 1 },
    ],
  },
]

/* Routing question — NOT scored. Cluster (A-E) comes free from intake. */
export const GOVERNANCE_QUESTION = {
  id: 'gov',
  text: 'Do you hold any formal responsibility for how AI is approved, governed, or used in your organisation?',
  options: [
    { text: 'Yes — this is explicitly part of my role', value: 'owns' },
    { text: 'Partly — I am consulted but do not own it', value: 'consulted' },
    { text: 'No — but I would like to understand it', value: 'interested' },
    { text: 'No — it sits well outside my role', value: 'none' },
  ],
}

/* ---------------- CAPACITY BANDS ---------------- */
export const CAPACITY_BANDS = [
  { min: 75, max: 100, label: 'Resilient', color: '#22C55E',
    summary: 'Safety, trust, and resilience are governed, tested, and owned. The priority now is sustaining the capability and extending it across the wider organisation.' },
  { min: 50, max: 74,  label: 'Managed',   color: '#3B82F6',
    summary: 'Controls exist and are generally followed, but they are not systematically assured. The gap is between practice and evidence — you can describe what you do, but not yet demonstrate it.' },
  { min: 25, max: 49,  label: 'Aware',     color: '#F97316',
    summary: 'The risks are recognised but practice is inconsistent and undocumented. Awareness without structure does not survive contact with a real incident.' },
  { min: 0,  max: 24,  label: 'Exposed',   color: '#EF4444',
    summary: 'There are no meaningful safeguards in place. This is not a criticism — it is the position most organisations are in. It is also the position that changes fastest with structured capability building.' },
]

export function getCapacityBand(pct) {
  return CAPACITY_BANDS.find(b => pct >= b.min && pct <= b.max) || CAPACITY_BANDS[3]
}

/* ---------------- TIER ROUTING ---------------- */
export const TIERS = {
  1: { number: 1, name: 'Awareness & Literacy', duration: '1 day', hours: 7,
       certification: 'Certified AI Aware', color: '#00ADA9',
       audience: 'All staff, general officers, and leaders',
       focus: 'Understand safety, trust, and resilience and apply safe everyday practices' },
  2: { number: 2, name: 'Practitioner', duration: '3 days', hours: 21,
       certification: 'Certified AI Safety & Security Practitioner', color: '#3B82F6',
       audience: 'IT, security, risk, data, and development professionals',
       focus: 'Test, secure, and operate AI systems safely and resiliently' },
  3: { number: 3, name: 'Governance & Leadership', duration: '2 days', hours: 14,
       certification: 'Certified AI Governance & Leadership', color: '#7C3AED',
       audience: 'Decision-makers, governance officers, policy and risk leads',
       focus: 'Govern and lead organisational AI safety, trust, and resilience' },
}

/* Cluster (A-E) already captured at intake — reused, no new question. */
const CLUSTER_TIER = { A: 3, B: 1, C: 1, D: 2, E: 1 }

export function assignTier(cluster, governance) {
  // Governance ownership overrides cluster — a risk or compliance lead
  // may sit in any cluster but belongs in Tier 3.
  if (governance === 'owns') return 3
  return CLUSTER_TIER[cluster] || 1
}

/* ---------------- WEAKEST-PILLAR FOCUS ---------------- */
export const PILLAR_FOCUS = {
  P1: 'Output verification and human oversight',
  P2: 'Deepfake defence and identity verification',
  P3: 'AI incident detection and response',
}

export const PILLAR_FOCUS_DETAIL = {
  P1: 'Your weakest area is confidence in AI outputs. Build the habit of verifying before acting, and define who is accountable when an AI-assisted decision goes wrong.',
  P2: 'Your weakest area is trust in what you see and hear. Establish out-of-band verification for any instruction involving money, access, or identity — this is the single highest-value control available to you.',
  P3: 'Your weakest area is what happens when something goes wrong. Know which AI tools are in use, what must never be entered into them, and who to tell when an incident occurs.',
}

/* ---------------- SCORING ---------------- */

/**
 * @param {object} responses  { s1: <optionIndex>, ..., r5: <optionIndex> }
 * @param {string} cluster    'A'..'E' from intake
 * @param {string} governance value from GOVERNANCE_QUESTION
 */
export function computeSafetyScores(responses = {}, cluster = 'A', governance = 'none') {
  const pillarSums = { P1: 0, P2: 0, P3: 0 }
  const pillarCounts = { P1: 0, P2: 0, P3: 0 }
  const answers = {}

  SAFETY_QUESTIONS.forEach(q => {
    const idx = responses[q.id]
    const score = q.options[idx]?.score ?? 1   // unanswered floors at 1
    answers[q.col] = q.options[idx]?.text ?? null
    pillarSums[q.pillar] += score
    pillarCounts[q.pillar] += 1
  })

  // TRUE 0-100 normalisation. 5 questions x 1-4 -> sum 5-20.
  const pct = (sum) => Math.round(((sum - 5) / 15) * 100)

  const pillarScores = SAFETY_PILLARS.map(p => ({
    key: p.key,
    name: p.name,
    short: p.short,
    color: p.color,
    sum: pillarSums[p.key],
    percentage: Math.max(0, Math.min(100, pct(pillarSums[p.key]))),
  }))

  const overallPercentage = Math.round(
    pillarScores.reduce((a, p) => a + p.percentage, 0) / pillarScores.length
  )

  const band = getCapacityBand(overallPercentage)

  // weakest pillar drives the headline recommendation
  const weakest = pillarScores.reduce((lo, p) => (p.percentage < lo.percentage ? p : lo), pillarScores[0])
  const strongest = pillarScores.reduce((hi, p) => (p.percentage > hi.percentage ? p : hi), pillarScores[0])

  const tierNumber = assignTier(cluster, governance)

  const urgency =
    overallPercentage < 25 ? 'Immediate' :
    overallPercentage < 50 ? 'High' :
    overallPercentage < 75 ? 'Moderate' : 'Maintain'

  return {
    pillarScores,
    overallPercentage,
    capacityLabel: band.label,
    capacityColor: band.color,
    capacitySummary: band.summary,
    weakestPillar: weakest.key,
    weakestPillarName: weakest.name,
    strongestPillarName: strongest.name,
    primaryFocus: PILLAR_FOCUS[weakest.key],
    primaryFocusDetail: PILLAR_FOCUS_DETAIL[weakest.key],
    tierNumber,
    tier: TIERS[tierNumber],
    urgency,
    governance,
    answers,   // { p1_q1: '<option text>', ... } ready for insert
  }
}

/* Distinct frameworks touched by the instrument — printed on the report. */
export const ALL_FRAMEWORKS = [
  'National Guidelines on AI Governance & Ethics (AIGE)',
  'NAIO & AI Technology Action Plan 2026-2030',
  'CyberSecurity Malaysia guidance',
  'Personal Data Protection Act (PDPA)',
  'NIST AI Risk Management Framework',
  'ISO/IEC 42001',
  'OWASP Top 10 for LLM Applications',
]
