export const ORG_QUESTIONS = [
  // PILLAR 1 — Strategy & Leadership (0-4)
  'Your organisation has a clearly defined AI strategy aligned with overall business objectives.',
  'AI is recognised by leadership as a key driver of innovation and competitive advantage.',
  'Senior leadership actively champions AI adoption within your organisation.',
  'Your organisation has a formal roadmap or plan for AI adoption over the next 2 to 3 years.',
  'There is a designated executive sponsor or AI champion responsible for driving AI initiatives in your organisation.',
  // PILLAR 2 — Data & Technology Infrastructure (5-9)
  'Most of your organisation\'s operational data is digitised and stored in electronic systems.',
  'Relevant business data is accessible across departments when needed.',
  'Your organisation uses modern IT infrastructure such as cloud platforms or scalable computing environments.',
  'Your organisation has the computing capability required for advanced analytics or AI workloads.',
  'Your organisation maintains data governance policies covering data usage, ownership, and access.',
  // PILLAR 3 — People & Workforce Skills (10-14)
  'Employees in your organisation have a basic understanding of AI and its potential business impact.',
  'Your organisation provides structured AI training or digital skills development programs.',
  'Managers are able to identify opportunities where AI can improve processes or decision-making.',
  'Your organisation encourages continuous learning and professional development in digital technologies.',
  'Your organisation has a strategy for building future AI and digital capabilities in the workforce.',
  // PILLAR 4 — Processes & AI Use Cases (15-19)
  'Most of your organisation\'s core business processes are digitised and supported by digital systems.',
  'Your organisation has identified specific business areas where AI could improve efficiency or decision-making.',
  'Your organisation has conducted AI or advanced analytics pilot projects.',
  'AI tools are embedded into daily workflows or business applications in your organisation.',
  'Your organisation has a process to evaluate and prioritise AI use cases based on business value.',
  // PILLAR 5 — Governance, Risk & Responsible AI (20-24)
  'Your organisation has a defined governance structure overseeing AI initiatives.',
  'Your organisation complies with data protection regulations and privacy laws.',
  'Your organisation has processes to assess risks associated with AI systems.',
  'AI decisions in your organisation are designed to be transparent and explainable where appropriate.',
  'Your organisation considers ethical implications when deploying AI systems.',
]

export const PILLAR_INFO = [
  {
    name: 'Strategy & Leadership',
    description: 'AI vision, executive sponsorship, and strategic roadmap',
    icon: '🎯',
  },
  {
    name: 'Data & Technology Infrastructure',
    description: 'Data readiness, IT systems, and computing capability',
    icon: '🏗️',
  },
  {
    name: 'People & Workforce Skills',
    description: 'AI literacy, training programs, and capability building',
    icon: '👥',
  },
  {
    name: 'Processes & AI Use Cases',
    description: 'Digitisation, AI pilots, and workflow integration',
    icon: '⚙️',
  },
  {
    name: 'Governance, Risk & Responsible AI',
    description: 'Oversight, compliance, ethics, and risk management',
    icon: '🛡️',
  },
]

const MATURITY_LEVELS = [
  { min: 0, max: 20, level: 1, label: 'Awareness' },
  { min: 21, max: 40, level: 2, label: 'Exploration' },
  { min: 41, max: 60, level: 3, label: 'Operational' },
  { min: 61, max: 80, level: 4, label: 'Integrated' },
  { min: 81, max: 100, level: 5, label: 'AI-Driven Enterprise' },
]

function getMaturity(pct) {
  for (const m of MATURITY_LEVELS) {
    if (pct <= m.max) return { maturityLevel: m.level, maturityLabel: m.label }
  }
  return { maturityLevel: 5, maturityLabel: 'AI-Driven Enterprise' }
}

export function computeOrgScores(responses) {
  const p1 = responses.slice(0, 5).reduce((a, b) => a + (b || 0), 0)
  const p2 = responses.slice(5, 10).reduce((a, b) => a + (b || 0), 0)
  const p3 = responses.slice(10, 15).reduce((a, b) => a + (b || 0), 0)
  const p4 = responses.slice(15, 20).reduce((a, b) => a + (b || 0), 0)
  const p5 = responses.slice(20, 25).reduce((a, b) => a + (b || 0), 0)

  const p1Pct = Math.round((p1 / 25) * 100)
  const p2Pct = Math.round((p2 / 25) * 100)
  const p3Pct = Math.round((p3 / 25) * 100)
  const p4Pct = Math.round((p4 / 25) * 100)
  const p5Pct = Math.round((p5 / 25) * 100)

  const overallScore = Math.round((p1Pct + p2Pct + p3Pct + p4Pct + p5Pct) / 5)
  const { maturityLevel, maturityLabel } = getMaturity(overallScore)

  return {
    pillar1Score: p1,
    pillar2Score: p2,
    pillar3Score: p3,
    pillar4Score: p4,
    pillar5Score: p5,
    pillar1Pct: p1Pct,
    pillar2Pct: p2Pct,
    pillar3Pct: p3Pct,
    pillar4Pct: p4Pct,
    pillar5Pct: p5Pct,
    overallScore,
    maturityLevel,
    maturityLabel,
  }
}
