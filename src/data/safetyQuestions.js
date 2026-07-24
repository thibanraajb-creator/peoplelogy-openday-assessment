/**
 * safetyQuestions.js  (v2 — shared core + role module)
 * ---------------------------------------------------------------
 * AI Safety Capacity & Digital Trust diagnostic.
 *
 * ARCHITECTURE
 *   9 CORE questions   — identical for everyone, 3 per pillar.
 *                        These produce the comparable national score.
 *                        Without them, respondents answering different
 *                        questions cannot be aggregated and the cohort
 *                        dashboard loses its headline figure.
 *
 *   6 ROLE questions   — 2 per pillar, drawn from one of three modules
 *                        matched to the participant's function. These
 *                        give depth appropriate to the role and make the
 *                        tier recommendation coherent with what was asked.
 *
 *   1 ROUTING question — governance responsibility (not scored).
 *
 *   Total 16 questions. Completion time unchanged.
 *
 * SCORING
 *   core pillar   — 3 questions, sum 3-12  -> (sum-3)/9*100
 *   pillar total  — 5 questions, sum 5-20  -> (sum-5)/15*100
 *   Both use TRUE 0-100 normalisation. Never sum/max*100.
 * ---------------------------------------------------------------
 */

export const SAFETY_PILLARS = [
  { key: 'P1', name: 'AI Safety', abbr: 'Safety', color: '#00ADA9',
    short: 'Reliable outputs, human oversight, and control',
    definition: 'Ensuring AI systems behave reliably and do not cause harm — managing bias, hallucination, and unsafe or unreliable outputs, and keeping meaningful human oversight and control.' },
  { key: 'P2', name: 'Digital Trust', abbr: 'Trust', color: '#3B82F6',
    short: 'Deepfakes, identity, provenance, and data integrity',
    definition: 'Preserving trust in identity, content, and transactions in an era of deepfakes and synthetic media — through verification, provenance, and data integrity.' },
  { key: 'P3', name: 'Resilience', abbr: 'Resilience', color: '#7C3AED',
    short: 'Securing AI, detecting incidents, and recovering',
    definition: 'The operational capacity to secure AI systems and to withstand, detect, respond to, and recover from AI-related threats and failures.' },
]

/* =============================================================
   CORE — 9 questions, answered by everyone.
   Deliberately answerable by any role, so a frontline officer and a
   security engineer produce comparable numbers.
   ============================================================= */
export const CORE_QUESTIONS = [
  {
    id: 'c_s1', pillar: 'P1', col: 'p1_q1',
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
    id: 'c_s2', pillar: 'P1', col: 'p1_q2',
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
    id: 'c_s3', pillar: 'P1', col: 'p1_q3',
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
    id: 'c_t1', pillar: 'P2', col: 'p2_q1',
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
    id: 'c_t2', pillar: 'P2', col: 'p2_q2',
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
    id: 'c_t3', pillar: 'P2', col: 'p2_q3',
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
  {
    id: 'c_r1', pillar: 'P3', col: 'p3_q1',
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
    id: 'c_r2', pillar: 'P3', col: 'p3_q2',
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
    id: 'c_r3', pillar: 'P3', col: 'p3_q3',
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
]

/* =============================================================
   ROLE MODULES — 6 questions each, 2 per pillar.
   A participant answers exactly one module.
   ============================================================= */

const MODULE_T1 = [
  { id: 'm_s1', pillar: 'P1', col: 'p1_q4',
    module: 'Tier 1 · Applied — Practical safe-use habits aligned to responsible-AI principles',
    frameworks: ['AIGE'],
    text: 'When you use AI for something that reaches a customer, colleague, or the public — do you check it first?',
    options: [
      { text: 'Always — I read every AI-assisted output before it goes anywhere', score: 4 },
      { text: 'Usually — though I check less carefully when I am busy', score: 3 },
      { text: 'Sometimes — mainly when the task feels important', score: 2 },
      { text: 'Rarely — if it reads well, I send it', score: 1 },
    ] },
  { id: 'm_s2', pillar: 'P1', col: 'p1_q5',
    module: "Tier 1 · Applied — Your organisation's AI acceptable-use basics",
    frameworks: ['AIGE', 'PDPA'],
    text: 'Do you know what your organisation permits and prohibits when using AI at work?',
    options: [
      { text: 'Yes — I have read the guidance and could explain it to a colleague', score: 4 },
      { text: 'Broadly — I know the general expectations but not the detail', score: 3 },
      { text: 'Not really — I follow my own judgement', score: 2 },
      { text: 'No — I am not aware of any guidance', score: 1 },
    ] },
  { id: 'm_t1', pillar: 'P2', col: 'p2_q4',
    module: 'Tier 1 · Pillar 2 — Verifying what you see and hear: simple verification habits',
    frameworks: ['CyberSecurity Malaysia'],
    text: 'Before forwarding a video, voice note, or document that seems surprising or urgent — what do you do?',
    options: [
      { text: 'Check the original source myself before passing it on', score: 4 },
      { text: 'Usually pause and think about it, but do not always verify', score: 3 },
      { text: 'Forward it and let others judge', score: 2 },
      { text: 'I have not thought of this as something to check', score: 1 },
    ] },
  { id: 'm_t2', pillar: 'P2', col: 'p2_q5',
    module: 'Tier 1 · Pillar 2 — Deepfakes, voice cloning, and synthetic identity',
    frameworks: ['CyberSecurity Malaysia'],
    text: 'If you suspected a message or call was AI-generated impersonation, would you know what to do next?',
    options: [
      { text: 'Yes — I would stop, verify separately, and report it to the right person', score: 4 },
      { text: 'I would verify separately, but I am not sure who to report it to', score: 3 },
      { text: 'I would probably just ignore it', score: 2 },
      { text: 'I would not know how to tell in the first place', score: 1 },
    ] },
  { id: 'm_r1', pillar: 'P3', col: 'p3_q4',
    module: 'Tier 1 · Pillar 3 — Protecting data and privacy when using AI tools',
    frameworks: ['PDPA'],
    text: 'Have you ever entered work information into a public AI tool without checking whether it was sensitive?',
    options: [
      { text: 'No — I check what I am entering every time', score: 4 },
      { text: 'Possibly — I am usually careful but have not always checked', score: 3 },
      { text: 'Yes — I have done it without thinking about it', score: 2 },
      { text: 'I would not know what counts as sensitive', score: 1 },
    ] },
  { id: 'm_r2', pillar: 'P3', col: 'p3_q5',
    module: 'Tier 1 · Pillar 3 — Spotting, reporting, and responding to AI-related incidents',
    frameworks: ['CyberSecurity Malaysia'],
    text: 'If a colleague told you an AI tool had done something harmful, how would you respond?',
    options: [
      { text: 'Report it through the proper channel and make sure it is recorded', score: 4 },
      { text: 'Tell my manager and leave it with them', score: 3 },
      { text: 'Suggest they stop using the tool and leave it there', score: 2 },
      { text: 'I would not be sure it needed action', score: 1 },
    ] },
]

const MODULE_T2 = [
  { id: 'm_s1', pillar: 'P1', col: 'p1_q4',
    module: 'Tier 2 Day 1 — AI red-teaming: adversarial prompting and jailbreak testing',
    frameworks: ['NIST AI RMF', 'OWASP LLM Top 10'],
    text: 'Has any AI system in your organisation been deliberately probed for unsafe, biased, or leaking behaviour?',
    options: [
      { text: 'Yes — structured red-teaming with documented findings and severity ratings', score: 4 },
      { text: 'Yes — informal testing by individuals, not systematically recorded', score: 3 },
      { text: 'No — we test that it works, not that it fails safely', score: 2 },
      { text: 'No — and we would not know how to begin', score: 1 },
    ] },
  { id: 'm_s2', pillar: 'P1', col: 'p1_q5',
    module: 'Tier 2 Day 1 — Guardrails, safe-by-design controls, and acceptance criteria',
    frameworks: ['NIST AI RMF', 'ISO/IEC 42001'],
    text: 'Do the AI systems you work on have input/output guardrails and defined human-escalation points?',
    options: [
      { text: 'Yes — guardrails, content filters, and escalation paths designed in by risk level', score: 4 },
      { text: 'Partly — some filtering exists but escalation is not formally defined', score: 3 },
      { text: 'No — we rely on vendor or model-provider defaults', score: 2 },
      { text: 'No — and I am not sure what controls are in place', score: 1 },
    ] },
  { id: 'm_t1', pillar: 'P2', col: 'p2_q4',
    module: 'Tier 2 Day 2 — Content provenance, watermarking, and authentication standards',
    frameworks: ['AIGE', 'CyberSecurity Malaysia'],
    text: 'Does your organisation implement provenance, watermarking, or authentication for content it produces or receives?',
    options: [
      { text: 'Yes — implemented and verified for sensitive content', score: 4 },
      { text: 'In progress — an approach is selected but not yet deployed', score: 3 },
      { text: 'No — discussed, but no technical action taken', score: 2 },
      { text: 'No — this has not been raised as an engineering concern', score: 1 },
    ] },
  { id: 'm_t2', pillar: 'P2', col: 'p2_q5',
    module: 'Tier 2 Day 2 — Defending identity verification and e-KYC processes',
    frameworks: ['PDPA', 'CyberSecurity Malaysia'],
    text: 'Have your identity verification or e-KYC processes been tested against synthetic identity and deepfake attacks?',
    options: [
      { text: 'Yes — tested specifically against synthetic media, with mitigations implemented', score: 4 },
      { text: 'Assessed on paper but not actively tested', score: 3 },
      { text: 'No — our verification predates this threat and has not been revisited', score: 2 },
      { text: 'We do not perform remote identity verification, or I do not know', score: 1 },
    ] },
  { id: 'm_r1', pillar: 'P3', col: 'p3_q4',
    module: 'Tier 2 Day 3 — Threat modelling for AI systems',
    frameworks: ['NIST AI RMF', 'OWASP LLM Top 10'],
    text: 'Has the attack surface of your AI-enabled services been mapped and prioritised?',
    options: [
      { text: 'Yes — threat modelled, risks prioritised, mitigations designed and tracked', score: 4 },
      { text: 'Partly — risks identified but not systematically modelled', score: 3 },
      { text: 'No — AI systems are covered by our general security process only', score: 2 },
      { text: 'No — AI-specific threats are not part of our security work', score: 1 },
    ] },
  { id: 'm_r2', pillar: 'P3', col: 'p3_q5',
    module: 'Tier 2 Day 3 — Monitoring, detection and response: abuse, drift, and data leakage',
    frameworks: ['NIST AI RMF', 'ISO/IEC 42001', 'OWASP LLM Top 10'],
    text: 'Are your AI systems monitored in production for abuse, drift, and data leakage?',
    options: [
      { text: 'Yes — logged and monitored, with anomaly detection and a defined response', score: 4 },
      { text: 'Logged, but not actively monitored for AI-specific problems', score: 3 },
      { text: 'No — we monitor availability and performance only', score: 2 },
      { text: 'No — once deployed, we assume behaviour remains stable', score: 1 },
    ] },
]

const MODULE_T3 = [
  { id: 'm_s1', pillar: 'P1', col: 'p1_q4',
    module: 'Tier 3 Day 1 — Risk-based AI governance: classifying use cases by risk and impact',
    frameworks: ['AIGE', 'NIST AI RMF', 'ISO/IEC 42001'],
    text: 'Are AI use cases in your organisation classified by risk, with controls matched to the level of risk?',
    options: [
      { text: 'Yes — a risk classification exists and determines the controls applied', score: 4 },
      { text: 'Partly — higher-risk uses get more scrutiny, but not through a formal framework', score: 3 },
      { text: 'No — all AI use is treated the same way', score: 2 },
      { text: 'No — we do not have visibility of where AI is being used', score: 1 },
    ] },
  { id: 'm_s2', pillar: 'P1', col: 'p1_q5',
    module: 'Tier 3 Day 2 — AI assurance: risk assessment, impact assessment, and audit',
    frameworks: ['ISO/IEC 42001', 'NIST AI RMF'],
    text: 'Could your organisation demonstrate — to an auditor or regulator — that its AI systems are being used safely?',
    options: [
      { text: 'Yes — documented assessments, evidence, and an audit trail exist', score: 4 },
      { text: 'Partly — we could assemble evidence, but it is not maintained routinely', score: 3 },
      { text: 'No — we could describe our practices but not evidence them', score: 2 },
      { text: 'No — this has not been considered', score: 1 },
    ] },
  { id: 'm_t1', pillar: 'P2', col: 'p2_q4',
    module: 'Tier 3 Day 2 — Embedding safety and trust requirements into policy',
    frameworks: ['AIGE', 'PDPA'],
    text: 'Does organisational policy address verification of identity and content in an era of synthetic media?',
    options: [
      { text: 'Yes — policy explicitly covers verification, provenance, and impersonation risk', score: 4 },
      { text: 'Partly — policy exists but predates synthetic media as a threat', score: 3 },
      { text: 'No — this is handled operationally, not by policy', score: 2 },
      { text: 'No — it has not been raised at policy level', score: 1 },
    ] },
  { id: 'm_t2', pillar: 'P2', col: 'p2_q5',
    module: 'Tier 3 Day 2 — Managing third-party and vendor AI risk',
    frameworks: ['ISO/IEC 42001', 'PDPA'],
    text: 'When you procure AI capability, is vendor safety, security, and data practice assessed before contracting?',
    options: [
      { text: 'Yes — formal due diligence, contractual obligations, and ongoing oversight', score: 4 },
      { text: 'Yes at procurement, but with little ongoing oversight afterwards', score: 3 },
      { text: 'Informally — we rely on vendor assurances and reputation', score: 2 },
      { text: 'No — AI vendors are procured like any other software', score: 1 },
    ] },
  { id: 'm_r1', pillar: 'P3', col: 'p3_q4',
    module: 'Tier 3 Day 1 — Roles, accountability, escalation, and decision rights',
    frameworks: ['AIGE', 'ISO/IEC 42001'],
    text: 'If an AI system caused material harm tomorrow, is it clear who in your organisation is accountable?',
    options: [
      { text: 'Yes — accountability, escalation, and decision rights are documented and understood', score: 4 },
      { text: 'Broadly — people would work it out, but it is not written down', score: 3 },
      { text: 'No — it would likely fall to IT by default', score: 2 },
      { text: 'No — and this would become a serious problem in the moment', score: 1 },
    ] },
  { id: 'm_r2', pillar: 'P3', col: 'p3_q5',
    module: 'Tier 3 Day 2 — Board and stakeholder reporting on AI risk and posture',
    frameworks: ['ISO/IEC 42001', 'NIST AI RMF'],
    text: 'Does your board or senior leadership receive regular reporting on AI risk and posture?',
    options: [
      { text: 'Yes — regular structured reporting against agreed measures', score: 4 },
      { text: 'Occasionally — when something prompts it', score: 3 },
      { text: 'No — AI is reported only within general technology updates', score: 2 },
      { text: 'No — AI risk does not reach board level', score: 1 },
    ] },
]

export const ROLE_MODULES = { 1: MODULE_T1, 2: MODULE_T2, 3: MODULE_T3 }

export const MODULE_LABELS = {
  1: 'Everyday practice',
  2: 'Technical practice',
  3: 'Governance practice',
}

/* Routing question — not scored. */
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

/* =============================================================
   BANDS / TIERS / ROUTING
   ============================================================= */

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

const CLUSTER_TIER = { A: 3, B: 1, C: 1, D: 2, E: 1 }

export const CLUSTER_NAMES = {
  A: 'Leaders & Strategy',
  B: 'Commercial & Client',
  C: 'Creative & Marketing',
  D: 'Technical & Delivery',
  E: 'L&D & People',
}

export function assignTier(cluster, governance) {
  if (governance === 'owns') return 3
  return CLUSTER_TIER[cluster] || 1
}

/**
 * Which role module a participant answers.
 *
 * Must be resolvable BEFORE the questions render. Governance ownership
 * is asked at the END of the survey, so the module comes from cluster
 * alone. A governance owner sitting in a Tier 1 cluster therefore
 * answers the Tier 1 module but is recommended Tier 3 — the report
 * states that explicitly rather than leaving the mismatch unexplained.
 */
export function selectModule(cluster) {
  return CLUSTER_TIER[cluster] || 1
}

export function explainTier(cluster, governance, tierNumber, moduleNumber) {
  const roleName = CLUSTER_NAMES[cluster] || 'your role'
  const override = governance === 'owns'

  if (override && moduleNumber !== tierNumber) {
    return {
      basis: 'Based on your governance responsibility',
      reason: `You selected ${roleName}, and answered the ${String(MODULE_LABELS[moduleNumber]).toLowerCase()} questions written for that function. You also hold formal responsibility for how AI is approved, governed, or used. Governance ownership takes precedence: if you are accountable for AI decisions, you need the governance curriculum regardless of which function you sit in.`,
      override: true,
    }
  }
  if (override) {
    return {
      basis: 'Based on your role and governance responsibility',
      reason: `You selected ${roleName} and hold formal responsibility for how AI is approved, governed, or used. Both point to Tier 3 — the tier written for the people who own AI decisions rather than execute them.`,
      override: true,
    }
  }

  const REASONS = {
    A: `You selected ${roleName}, so you answered the governance-level questions — risk classification, assurance, accountability, and board reporting. Tier 3 is written for decision-makers, governance officers, and policy and risk leads.`,
    D: `You selected ${roleName}, so you answered the technical questions — red-teaming, guardrails, threat modelling, and production monitoring. Tier 2 is written for IT, security, risk, data, and development professionals, and is the only tier with hands-on labs.`,
    B: `You selected ${roleName}, so you answered the everyday-practice questions — verification habits, acceptable use, and incident reporting. Tier 1 gives every member of the organisation a working understanding of AI safety, digital trust, and resilience, and assumes no prior AI experience.`,
  }
  REASONS.C = REASONS.B
  REASONS.E = REASONS.B

  return {
    basis: `Based on your role: ${roleName}`,
    reason: REASONS[cluster] || REASONS.B,
    override: false,
  }
}

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

/* =============================================================
   ASSEMBLY + SCORING
   ============================================================= */

/** Full ordered question list for a cluster: 9 core then 6 role. */
export function getQuestionsFor(cluster) {
  return [...CORE_QUESTIONS, ...ROLE_MODULES[selectModule(cluster)]]
}

export function computeSafetyScores(responses = {}, cluster = 'A', governance = 'none') {
  const moduleNumber = selectModule(cluster)
  const roleQs = ROLE_MODULES[moduleNumber]

  const answers = {}
  const coreSums = { P1: 0, P2: 0, P3: 0 }
  const totalSums = { P1: 0, P2: 0, P3: 0 }

  CORE_QUESTIONS.forEach(q => {
    const o = q.options[responses[q.id]]
    const sc = o?.score ?? 1
    answers[q.col] = o?.text ?? null
    coreSums[q.pillar] += sc
    totalSums[q.pillar] += sc
  })
  roleQs.forEach(q => {
    const o = q.options[responses[q.id]]
    const sc = o?.score ?? 1
    answers[q.col] = o?.text ?? null
    totalSums[q.pillar] += sc
  })

  const clamp = (v) => Math.max(0, Math.min(100, v))
  const corePct  = (sum) => clamp(Math.round(((sum - 3) / 9) * 100))   // 3 qs
  const totalPct = (sum) => clamp(Math.round(((sum - 5) / 15) * 100))  // 5 qs

  const pillarScores = SAFETY_PILLARS.map(p => ({
    key: p.key, name: p.name, abbr: p.abbr, color: p.color,
    sum: totalSums[p.key],
    percentage: totalPct(totalSums[p.key]),
    corePercentage: corePct(coreSums[p.key]),
  }))

  const overallPercentage = Math.round(
    pillarScores.reduce((a, p) => a + p.percentage, 0) / pillarScores.length)
  const coreOverallPercentage = Math.round(
    pillarScores.reduce((a, p) => a + p.corePercentage, 0) / pillarScores.length)

  const band = getCapacityBand(overallPercentage)

  const weakest = pillarScores.reduce((lo, p) => (p.percentage < lo.percentage ? p : lo), pillarScores[0])
  const strongest = pillarScores.reduce((hi, p) => (p.percentage > hi.percentage ? p : hi), pillarScores[0])
  const isFlat = strongest.percentage === weakest.percentage

  const tierNumber = assignTier(cluster, governance)
  const tx = explainTier(cluster, governance, tierNumber, moduleNumber)

  const urgency =
    overallPercentage < 25 ? 'Immediate' :
    overallPercentage < 50 ? 'High' :
    overallPercentage < 75 ? 'Moderate' : 'Maintain'

  return {
    pillarScores,
    overallPercentage,
    coreOverallPercentage,        // cross-role comparable figure for the dashboard
    capacityLabel: band.label,
    capacityColor: band.color,
    capacitySummary: band.summary,
    weakestPillar: isFlat ? null : weakest.key,
    weakestPillarName: isFlat ? null : weakest.name,
    strongestPillarName: isFlat ? null : strongest.name,
    isFlat,
    primaryFocus: isFlat ? null : PILLAR_FOCUS[weakest.key],
    primaryFocusDetail: isFlat ? null : PILLAR_FOCUS_DETAIL[weakest.key],
    tierNumber,
    tier: TIERS[tierNumber],
    tierBasis: tx.basis,
    tierReason: tx.reason,
    tierOverride: tx.override,
    urgency,
    moduleNumber,
    moduleLabel: MODULE_LABELS[moduleNumber],
    clusterName: CLUSTER_NAMES[cluster] || null,
    governance,
    answers,
  }
}

export const ALL_FRAMEWORKS = [
  'National Guidelines on AI Governance & Ethics (AIGE)',
  'NAIO & AI Technology Action Plan 2026-2030',
  'CyberSecurity Malaysia guidance',
  'Personal Data Protection Act (PDPA)',
  'NIST AI Risk Management Framework',
  'ISO/IEC 42001',
  'OWASP Top 10 for LLM Applications',
]
