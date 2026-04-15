export const ORG_PILLARS = [
  {
    id: 1,
    name: 'Strategy & Leadership',
    description: 'How well is AI embedded into your organisational direction and leadership vision?',
    questions: [
      'Your organisation has a clearly defined AI strategy aligned with overall business objectives.',
      'AI is recognised by leadership as a key driver of innovation and competitive advantage.',
      'Senior leadership actively champions AI adoption within your organisation.',
      'Your organisation has a formal roadmap or plan for AI adoption over the next 2–3 years.',
    ],
  },
  {
    id: 2,
    name: 'Data & Technology Infrastructure',
    description: 'How prepared is your organisation\'s data and technology foundation for AI?',
    questions: [
      'Most of your organisation\'s operational data is digitised and stored in electronic systems.',
      'Relevant business data is accessible across departments when needed.',
      'Your organisation uses modern IT infrastructure such as cloud platforms or scalable computing.',
      'Your organisation has the computing capability required for advanced analytics or AI workloads.',
    ],
  },
  {
    id: 3,
    name: 'People & Workforce Skills',
    description: 'How AI-capable and digitally skilled is your organisation\'s workforce?',
    questions: [
      'Employees in your organisation have a basic understanding of AI and its potential business impact.',
      'Your organisation provides structured AI training or digital skills development programs.',
      'Managers are able to identify opportunities where AI can improve processes or decision-making.',
      'Your organisation encourages continuous learning and professional development in digital technologies.',
    ],
  },
  {
    id: 4,
    name: 'Processes & AI Use Cases',
    description: 'How well are your business processes digitised and AI-integrated?',
    questions: [
      'Most of your organisation\'s core business processes are digitised and supported by digital systems.',
      'Your organisation has identified specific business areas where AI could improve efficiency.',
      'Your organisation has conducted AI or advanced analytics pilot projects.',
      'AI tools are embedded into daily workflows or business applications in your organisation.',
    ],
  },
  {
    id: 5,
    name: 'Governance, Risk & Responsible AI',
    description: 'How mature is your organisation\'s approach to responsible and governed AI use?',
    questions: [
      'Your organisation has a defined governance structure overseeing AI initiatives.',
      'Your organisation complies with data protection regulations and privacy laws.',
      'Your organisation has processes to assess risks associated with AI systems.',
      'AI decisions in your organisation are designed to be transparent and explainable where appropriate.',
    ],
  },
]

export const LIKERT_LABELS = [
  { value: 1, label: 'Not at all' },
  { value: 2, label: 'Rarely' },
  { value: 3, label: 'Somewhat' },
  { value: 4, label: 'Mostly' },
  { value: 5, label: 'Fully' },
]

export function computeOrgScores(responses) {
  const pillarScores = []
  for (let i = 1; i <= 5; i++) {
    const answers = responses[`pillar${i}`]
    const sum = answers.reduce((acc, v) => acc + (v || 0), 0)
    const percentage = (sum / 20) * 100
    pillarScores.push({
      pillar: i,
      name: ORG_PILLARS[i - 1].name,
      sum,
      percentage: Math.round(percentage),
    })
  }

  const overallPercentage = Math.round(
    pillarScores.reduce((acc, p) => acc + p.percentage, 0) / 5
  )

  let maturityLevel, maturityLabel
  if (overallPercentage <= 20) {
    maturityLevel = 1; maturityLabel = 'Awareness'
  } else if (overallPercentage <= 40) {
    maturityLevel = 2; maturityLabel = 'Exploration'
  } else if (overallPercentage <= 60) {
    maturityLevel = 3; maturityLabel = 'Operational'
  } else if (overallPercentage <= 80) {
    maturityLevel = 4; maturityLabel = 'Integrated'
  } else {
    maturityLevel = 5; maturityLabel = 'AI-Driven Enterprise'
  }

  const weakestPillar = pillarScores.reduce((min, p) => p.percentage < min.percentage ? p : min)
  const strongestPillar = pillarScores.reduce((max, p) => p.percentage > max.percentage ? p : max)

  return {
    pillarScores,
    overallPercentage,
    maturityLevel,
    maturityLabel,
    weakestPillar,
    strongestPillar,
  }
}
