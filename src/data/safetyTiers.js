/**
 * safetyTiers.js
 * ---------------------------------------------------------------
 * Tier detail (objective / modules / outcomes) for the AI Safety
 * Capacity & Digital Trust programme.
 *
 * Kept in its own dependency-free data module so both the PDF builder
 * (buildSafetyReport.js) and the on-screen results page can render it
 * from a single source — without the results page pulling in jsPDF.
 * ---------------------------------------------------------------
 */

export const TIER_DETAIL = {
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
