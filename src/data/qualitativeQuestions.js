export const QUALITATIVE_QUESTIONS = [
  {
    id: 'q1',
    dimension: 'operational',
    type: 'single_select',
    question: "Think about your team's most repetitive weekly task. Be honest — how many hours does it consume across your entire team?",
    options: [
      { text: 'Less than 2 hours — we are fairly efficient',                          opScore: 4 },
      { text: '2 to 5 hours — it is manageable but not ideal',                        opScore: 3 },
      { text: '5 to 10 hours — it is a real drain we have accepted',                  opScore: 2 },
      { text: 'More than 10 hours — it is a significant problem nobody has solved',   opScore: 1 },
    ],
  },
  {
    id: 'q2',
    dimension: 'operational',
    type: 'single_select',
    question: 'Has your organisation launched an AI or digital transformation initiative in the last 2 years?',
    options: [
      { text: 'Yes — it is live and delivering measurable value',    opScore: 4 },
      { text: 'Yes — but it stalled or was quietly abandoned',       opScore: 2 },
      { text: 'We discussed it seriously but never started',         opScore: 2 },
      { text: 'We have not considered it yet',                       opScore: 1 },
    ],
  },
  {
    id: 'q3',
    dimension: 'operational',
    type: 'multi_select',
    maxSelect: 2,
    question: 'What is honestly the biggest barrier stopping your organisation from moving faster with AI? Select your top 2.',
    options: [
      { text: 'No clear AI strategy or vision from leadership',              opScore: 1 },
      { text: 'Our people do not have the skills or confidence',             opScore: 1 },
      { text: 'Our data is not clean accessible or trustworthy',             opScore: 1 },
      { text: 'Leadership does not treat it as a priority',                  opScore: 1 },
      { text: 'We do not know where to start',                               opScore: 1 },
      { text: 'We are waiting for someone else to figure it out first',      opScore: 0 },
    ],
  },
  {
    id: 'q4',
    dimension: 'operational',
    type: 'single_select',
    question: 'If you had a fully built AI automation tool for your biggest process bottleneck — what would realistically happen in your organisation?',
    options: [
      { text: 'We would deploy it immediately — our processes are documented and ready',          opScore: 4 },
      { text: 'We would run a careful pilot first — we need evidence before committing',          opScore: 3 },
      { text: 'We would need multiple layers of approval before touching any process',            opScore: 2 },
      { text: 'Honestly — our processes are not documented enough to automate anything yet',      opScore: 1 },
    ],
  },
  {
    id: 'q5',
    dimension: 'leadership',
    type: 'single_select',
    question: "How would you honestly describe your senior leadership's relationship with AI right now?",
    options: [
      { text: 'They are actively driving AI adoption — it is a strategic priority',                 lcScore: 4 },
      { text: 'They are supportive but not actively involved — it is delegated downward',           lcScore: 3 },
      { text: 'They are cautiously watching what competitors do before committing',                 lcScore: 2 },
      { text: 'They see AI as an IT issue not a business strategy issue',                           lcScore: 1 },
      { text: 'They are skeptical or resistant — they see more risk than opportunity',              lcScore: 1 },
    ],
  },
  {
    id: 'q6',
    dimension: 'leadership',
    type: 'single_select',
    question: 'When you need data to make a business decision — how easy is it to get the right data quickly?',
    options: [
      { text: 'Very easy — data is centralised clean and accessible within hours',    lcScore: 4 },
      { text: 'Manageable — it takes a few days and some manual work',                lcScore: 3 },
      { text: 'Difficult — data is scattered across systems and departments',         lcScore: 2 },
      { text: 'Nearly impossible — we make most decisions without reliable data',     lcScore: 1 },
      { text: 'We do not use data systematically to make decisions',                  lcScore: 1 },
    ],
  },
  {
    id: 'q7',
    dimension: 'leadership',
    type: 'single_select',
    question: 'After an AI training session — what typically happens in your organisation?',
    options: [
      { text: 'People apply what they learned immediately and build new habits',                    lcScore: 4 },
      { text: 'People apply it for a few weeks then revert to old ways',                           lcScore: 2 },
      { text: 'People found it interesting but did not change how they work',                      lcScore: 1 },
      { text: 'We have not run any AI training yet',                                               lcScore: 2 },
      { text: 'Training is rarely translated into actual behaviour change in our organisation',     lcScore: 1 },
    ],
  },
  {
    id: 'q8',
    dimension: 'open',
    type: 'open_text',
    question: 'If your organisation made one bold AI move in the next 12 months — what would it be?',
    placeholder: 'Share your thoughts in 1-2 sentences...',
  },
]

// Index positions for q3 options
const Q3_WAITING_IDX   = 5   // "We are waiting for someone else..."
const Q3_SKILL_DATA    = [1, 2]  // skills, data
const Q3_STRATEGY_LEAD = [0, 3, 4]  // strategy, leadership, don't know where to start

function scoreQ3(selected) {
  if (!Array.isArray(selected) || selected.length === 0) return 1
  if (selected.includes(Q3_WAITING_IDX)) return 1
  const allSkillOrData = selected.every(i => Q3_SKILL_DATA.includes(i))
  if (allSkillOrData) return 4
  return 2
}

function assignArchetype(orgPct, capPct) {
  if (orgPct < 40 && capPct < 60)                              return 'The Sleeping Organisation'
  if (orgPct < 40 && capPct >= 60)                             return 'The Frustrated Innovator'
  if (orgPct >= 40 && orgPct < 65 && capPct < 60)             return 'The Hollow Strategy'
  if (orgPct >= 40 && orgPct < 65 && capPct >= 60 && capPct < 75) return 'The Cautious Mover'
  if (orgPct >= 40 && orgPct < 65 && capPct >= 75)            return 'The Untapped Asset'
  if (orgPct >= 65 && capPct < 60)                            return 'The Broken Pipeline'
  if (orgPct >= 65 && capPct >= 60 && capPct < 80)            return 'The Scaling Organisation'
  if (orgPct >= 65 && capPct >= 80)                           return 'The AI-Ready Organisation'
  return 'The Cautious Mover'
}

export function computeQualitativeScores(responses, orgOverallPercentage, individualOverallAverage) {
  const q1 = QUALITATIVE_QUESTIONS[0].options[responses.q1]?.opScore ?? 1
  const q2 = QUALITATIVE_QUESTIONS[1].options[responses.q2]?.opScore ?? 1
  const q3 = scoreQ3(responses.q3)
  const q4 = QUALITATIVE_QUESTIONS[3].options[responses.q4]?.opScore ?? 1

  const operationalScore = Math.round(((q1 + q2 + q3 + q4) / 16) * 100)

  const q5 = QUALITATIVE_QUESTIONS[4].options[responses.q5]?.lcScore ?? 1
  const q6 = QUALITATIVE_QUESTIONS[5].options[responses.q6]?.lcScore ?? 1
  const q7 = QUALITATIVE_QUESTIONS[6].options[responses.q7]?.lcScore ?? 1

  const leadershipScore = Math.round(((q5 + q6 + q7) / 12) * 100)

  // capPct: individual overall average is 1-4 scale, convert to 0-100
  const capPct = Math.round((individualOverallAverage ?? 1) * 25)
  const orgPct = orgOverallPercentage ?? 0

  const archetype = assignArchetype(orgPct, capPct)

  return {
    operationalScore,
    leadershipScore,
    archetype,
    q8BoldMove: responses.q8 ?? null,
  }
}
