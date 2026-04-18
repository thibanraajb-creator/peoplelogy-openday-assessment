export const DIMENSIONS = {
  D1: 'AI Awareness',
  D2: 'Tool Use',
  D3: 'Prompt Ability',
  D4: 'Opportunity Spotting',
  D5: 'Workflow Integration',
}

export const DIMENSION_KEYS = ['D1', 'D2', 'D3', 'D4', 'D5']

export const CAPABILITY_LABELS = [
  { min: 1.0, max: 1.5, label: 'AI Beginner' },
  { min: 1.5, max: 2.5, label: 'AI Explorer' },
  { min: 2.5, max: 3.2, label: 'AI Practitioner' },
  { min: 3.2, max: 3.7, label: 'AI Integrator' },
  { min: 3.7, max: 4.0, label: 'AI Champion' },
]

export const LEARNING_FOCUS = {
  D1: 'AI fundamentals and tool awareness',
  D2: 'Daily AI tool habit building',
  D3: 'Prompt engineering skills',
  D4: 'AI opportunity identification in your role',
  D5: 'Workflow automation and redesign',
}

export const CLUSTER_NAMES = {
  A: 'Leaders & Strategy',
  B: 'Commercial & Client',
  C: 'Creative & Marketing',
  D: 'Technical & Delivery',
  E: 'L&D & People',
}

export function getCapabilityLabel(score) {
  for (const cap of CAPABILITY_LABELS) {
    if (score >= cap.min && score <= cap.max) return cap.label
  }
  if (score < 1.0) return 'AI Beginner'
  return 'AI Champion'
}

export function assignCluster(roleLevel, primaryFunction) {
  const leaderRoles = ['C-Suite / Board (CEO, COO, CFO, CTO)', 'Director / VP']
  if (leaderRoles.includes(roleLevel)) return 'A'

  const map = {
    'Strategy & Leadership': 'A',
    'Human Resources & People': 'A',
    'Finance & Accounting': 'A',
    'Sales & Business Development': 'B',
    'Operations & Process': 'B',
    'Marketing & Branding': 'C',
    'Technology & Digital': 'D',
    'Product & Innovation': 'D',
    'Learning & Development': 'E',
    'Others': 'B',
  }
  return map[primaryFunction] || 'B'
}

// ─── CLUSTER A ────────────────────────────────────────────────────────────────

const CLUSTER_A = [
  {
    id: 1,
    dimension: 'D1',
    type: 'single_select',
    question: 'When a team member suggests using AI for a new task, how do you typically respond?',
    options: [
      { text: 'Approve without needing context', score: 2 },
      { text: 'Ask for the use case and data classification first', score: 4 },
      { text: 'I am usually unsure what to do', score: 1 },
      { text: 'I usually decline until there is a formal process', score: 1 },
    ],
  },
  {
    id: 2,
    dimension: 'D2',
    type: 'single_select',
    question: 'In the past month, how often have you personally used an AI tool such as Claude, Copilot or ChatGPT?',
    options: [
      { text: 'Never', score: 1 },
      { text: '1 to 2 times', score: 2 },
      { text: 'Weekly', score: 3 },
      { text: 'Daily', score: 4 },
    ],
  },
  {
    id: 3,
    dimension: 'D3',
    type: 'single_select',
    question: 'When you use an AI tool, how do you usually interact with it?',
    options: [
      { text: 'I type short one-line questions', score: 1 },
      { text: 'I give detailed context and instructions', score: 4 },
      { text: 'I copy prompts from others', score: 2 },
      { text: 'I have not used one yet', score: 1 },
    ],
  },
  {
    id: 4,
    dimension: 'D4',
    type: 'single_select',
    question: 'Think of your biggest time drain this week. Could AI have helped reduce it?',
    options: [
      { text: 'Yes, I know exactly how', score: 4 },
      { text: 'Possibly, but I am unsure how', score: 2 },
      { text: 'I do not think so', score: 1 },
      { text: 'I have not thought about it', score: 1 },
    ],
  },
  {
    id: 5,
    dimension: 'D4',
    type: 'multi_select',
    question: 'A department head asks you to approve an AI pilot. What do you need before deciding?',
    options: [
      { text: 'ROI estimate' },
      { text: 'Data security review' },
      { text: 'Tool compliance check' },
      { text: 'Team training plan' },
      { text: 'I would approve immediately' },
    ],
    scoreLogic: (selectedTexts) => {
      if (selectedTexts.includes('I would approve immediately') && selectedTexts.length === 1) return 1
      const validCount = selectedTexts.filter(t => t !== 'I would approve immediately').length
      if (validCount >= 3) return 4
      if (validCount === 2) return 3
      if (validCount === 1) return 2
      return 1
    },
  },
  {
    id: 6,
    dimension: 'D1',
    type: 'single_select',
    question: 'How aware are you of AI governance policies in your organisation?',
    options: [
      { text: 'Very aware, I helped create them', score: 4 },
      { text: 'I know they exist and have read them', score: 3 },
      { text: 'I know they exist but have not read them', score: 2 },
      { text: 'I was not aware we had any', score: 1 },
    ],
  },
  {
    id: 7,
    dimension: 'D5',
    type: 'single_select',
    question: 'Have you personally changed how you do any part of your job because of AI in the last 3 months?',
    options: [
      { text: 'Yes, significantly', score: 4 },
      { text: 'Yes, small changes', score: 3 },
      { text: 'Not yet, but planning to', score: 2 },
      { text: 'No', score: 1 },
    ],
  },
  {
    id: 8,
    dimension: 'D2',
    type: 'multi_select',
    question: 'Which AI tools have you personally used for work in the last month?',
    options: [
      { text: 'Claude' },
      { text: 'ChatGPT' },
      { text: 'Copilot' },
      { text: 'Adobe AI' },
      { text: 'Gemini' },
      { text: 'None' },
      { text: 'Other' },
    ],
    scoreLogic: (selectedTexts) => {
      if (selectedTexts.includes('None') && selectedTexts.length === 1) return 1
      const validCount = selectedTexts.filter(t => t !== 'None').length
      if (validCount >= 3) return 4
      if (validCount === 2) return 3
      if (validCount === 1) return 2
      return 1
    },
  },
  {
    id: 9,
    dimension: 'D4',
    type: 'single_select',
    question: 'Your team spends 3 hours weekly compiling a report manually. What is your next step?',
    options: [
      { text: 'Ask IT to investigate AI options', score: 3 },
      { text: 'Try it myself first', score: 4 },
      { text: 'Raise it in the next team meeting', score: 2 },
      { text: 'Wait for a formal process', score: 1 },
    ],
  },
  {
    id: 10,
    dimension: 'D5',
    type: 'single_select',
    question: 'How confident are you explaining to your team what AI should and should not be used for?',
    options: [
      { text: 'Very confident', score: 4 },
      { text: 'Somewhat confident', score: 3 },
      { text: 'Not very confident', score: 2 },
      { text: 'Not at all confident', score: 1 },
    ],
  },
  {
    id: 11,
    dimension: 'D1',
    type: 'single_select',
    question: "How would you describe your organisation's current AI maturity level?",
    options: [
      { text: 'We have a clear AI strategy being executed', score: 4 },
      { text: 'We are running some AI pilots', score: 3 },
      { text: 'We are discussing AI but nothing formal yet', score: 2 },
      { text: 'We have not started thinking about AI', score: 1 },
    ],
  },
  {
    id: 12,
    dimension: 'D3',
    type: 'single_select',
    question: 'You need to brief your team on responsible AI use. How do you prepare?',
    options: [
      { text: 'I use AI to help draft the briefing with clear governance context', score: 4 },
      { text: 'I research best practices then write it myself', score: 3 },
      { text: 'I forward something I found online', score: 2 },
      { text: 'I would not know where to start', score: 1 },
    ],
  },
  {
    id: 13,
    dimension: 'D5',
    type: 'single_select',
    question: 'Has your organisation implemented any AI-powered automation in the last 12 months?',
    options: [
      { text: 'Yes, multiple processes automated', score: 4 },
      { text: 'Yes, one process', score: 3 },
      { text: 'We are planning to', score: 2 },
      { text: 'No', score: 1 },
    ],
  },
  {
    id: 14,
    dimension: 'D2',
    type: 'single_select',
    question: 'How comfortable are you using Microsoft Copilot across Word, Outlook, Excel and Teams?',
    options: [
      { text: 'Very comfortable, use it daily', score: 4 },
      { text: 'Some experience', score: 3 },
      { text: 'Tried it once or twice', score: 2 },
      { text: 'Never used it', score: 1 },
    ],
  },
  {
    id: 15,
    dimension: 'D4',
    type: 'open_text',
    question: 'What is the single biggest AI opportunity you see for your organisation in the next 12 months?',
    placeholder: 'Describe the opportunity...',
  },
]

// ─── CLUSTER B ────────────────────────────────────────────────────────────────

const CLUSTER_B = [
  {
    id: 1,
    dimension: 'D2',
    type: 'single_select',
    question: 'When writing a client proposal or email, do you use AI to help draft, structure or refine it?',
    options: [
      { text: 'Always', score: 4 },
      { text: 'Sometimes', score: 3 },
      { text: 'Rarely', score: 2 },
      { text: 'Never tried it', score: 1 },
    ],
  },
  {
    id: 2,
    dimension: 'D3',
    type: 'single_select',
    question: 'You need to write a proposal for a new client in an unfamiliar industry. How do you use AI?',
    options: [
      { text: 'Ask AI to write it from scratch without context', score: 2 },
      { text: 'Give AI context, structure and constraints, then refine', score: 4 },
      { text: 'Use AI for research only, write manually', score: 2 },
      { text: 'I do not use AI for this', score: 1 },
    ],
  },
  {
    id: 3,
    dimension: 'D1',
    type: 'single_select',
    question: 'A client asks if you use AI to generate proposal content. How do you respond?',
    options: [
      { text: 'Deny it', score: 1 },
      { text: 'Confirm it and explain the process', score: 4 },
      { text: 'I am unsure what to say', score: 1 },
      { text: 'Change the topic', score: 1 },
    ],
  },
  {
    id: 4,
    dimension: 'D2',
    type: 'single_select',
    question: 'How often do you use AI for research or gathering background on clients or industries?',
    options: [
      { text: 'Daily', score: 4 },
      { text: 'Weekly', score: 3 },
      { text: 'Occasionally', score: 2 },
      { text: 'Never', score: 1 },
    ],
  },
  {
    id: 5,
    dimension: 'D5',
    type: 'multi_select',
    question: 'Which of these have you actually done using AI in the past month?',
    options: [
      { text: 'Drafted a proposal' },
      { text: 'Summarised a meeting' },
      { text: 'Researched a client' },
      { text: 'Created a report' },
      { text: 'Replied to a client email' },
      { text: 'None' },
    ],
    scoreLogic: (selectedTexts) => {
      if (selectedTexts.includes('None') && selectedTexts.length === 1) return 1
      const validCount = selectedTexts.filter(t => t !== 'None').length
      if (validCount >= 4) return 4
      if (validCount >= 2) return 3
      if (validCount === 1) return 2
      return 1
    },
  },
  {
    id: 6,
    dimension: 'D3',
    type: 'single_select',
    question: 'You paste a client brief into an AI tool and get a generic unhelpful response. What do you do?',
    options: [
      { text: 'Give up and write manually', score: 1 },
      { text: 'Refine the prompt with more specific context', score: 4 },
      { text: 'Try a different tool', score: 2 },
      { text: 'Ask a colleague to do it', score: 1 },
    ],
  },
  {
    id: 7,
    dimension: 'D4',
    type: 'open_text',
    question: 'Which of your current weekly tasks do you think AI could reduce the most time on?',
    placeholder: 'Describe the task...',
  },
  {
    id: 8,
    dimension: 'D1',
    type: 'single_select',
    question: 'You receive an AI-generated summary of a client call. How much do you trust it?',
    options: [
      { text: 'Fully trust it and send immediately', score: 1 },
      { text: 'Trust it but verify the key points', score: 4 },
      { text: 'Review everything before using', score: 3 },
      { text: 'I would not use AI for this', score: 2 },
    ],
  },
  {
    id: 9,
    dimension: 'D2',
    type: 'single_select',
    question: 'How comfortable are you using Copilot inside Microsoft 365?',
    options: [
      { text: 'Very comfortable, use it daily', score: 4 },
      { text: 'Some experience', score: 3 },
      { text: 'Tried it once or twice', score: 2 },
      { text: 'Never used it', score: 1 },
    ],
  },
  {
    id: 10,
    dimension: 'D5',
    type: 'single_select',
    question: 'Estimate how many hours per week you save by using AI tools in your role.',
    options: [
      { text: '0 hours', score: 1 },
      { text: 'Less than 1 hour', score: 2 },
      { text: '1 to 3 hours', score: 3 },
      { text: 'More than 3 hours', score: 4 },
    ],
  },
  {
    id: 11,
    dimension: 'D3',
    type: 'single_select',
    question: 'When using AI to write a client-facing document, what do you always include in your prompt?',
    options: [
      { text: 'Client name, industry, tone, format and desired outcome', score: 4 },
      { text: 'Topic and rough structure', score: 3 },
      { text: 'Paste previous draft and ask to improve', score: 2 },
      { text: 'Describe in plain language', score: 1 },
    ],
  },
  {
    id: 12,
    dimension: 'D4',
    type: 'single_select',
    question: 'How often do you identify new AI use cases in your sales or client work?',
    options: [
      { text: 'Regularly', score: 4 },
      { text: 'Occasionally', score: 3 },
      { text: 'Rarely', score: 2 },
      { text: 'Never', score: 1 },
    ],
  },
  {
    id: 13,
    dimension: 'D1',
    type: 'single_select',
    question: 'How confident are you discussing AI capabilities and limitations with a client?',
    options: [
      { text: 'Very confident, can advise on AI strategy', score: 4 },
      { text: 'Somewhat confident, know the basics', score: 3 },
      { text: 'Not very confident, avoid the topic', score: 2 },
      { text: 'Not at all confident', score: 1 },
    ],
  },
  {
    id: 14,
    dimension: 'D5',
    type: 'single_select',
    question: 'Have you redesigned any part of your sales or client process because of AI in the last 6 months?',
    options: [
      { text: 'Yes, significantly', score: 4 },
      { text: 'Yes, small changes', score: 3 },
      { text: 'Planning to', score: 2 },
      { text: 'No', score: 1 },
    ],
  },
  {
    id: 15,
    dimension: 'D2',
    type: 'single_select',
    question: 'Which AI tool do you use most for client or commercial work?',
    options: [
      { text: 'Claude', score: 4 },
      { text: 'ChatGPT', score: 3 },
      { text: 'Copilot', score: 3 },
      { text: 'I do not use any AI tools for client work', score: 1 },
    ],
  },
]

// ─── CLUSTER C ────────────────────────────────────────────────────────────────

const CLUSTER_C = [
  {
    id: 1,
    dimension: 'D2',
    type: 'multi_select',
    question: 'Which AI tools do you currently use for creative or marketing work?',
    options: [
      { text: 'Claude' },
      { text: 'ChatGPT' },
      { text: 'Adobe Firefly' },
      { text: 'Canva AI' },
      { text: 'Copilot' },
      { text: 'None' },
      { text: 'Other' },
    ],
    scoreLogic: (selectedTexts) => {
      if (selectedTexts.includes('None') && selectedTexts.length === 1) return 1
      const validCount = selectedTexts.filter(t => t !== 'None').length
      if (validCount >= 3) return 4
      if (validCount === 2) return 3
      if (validCount === 1) return 2
      return 1
    },
  },
  {
    id: 2,
    dimension: 'D3',
    type: 'single_select',
    question: 'You need 10 social media posts for the month. How do you use AI?',
    options: [
      { text: 'Generate all 10 and post directly without editing', score: 2 },
      { text: 'Generate drafts with brand context, edit each one', score: 4 },
      { text: 'Use AI for ideas only, write manually', score: 2 },
      { text: 'I do not use AI for this', score: 1 },
    ],
  },
  {
    id: 3,
    dimension: 'D5',
    type: 'single_select',
    question: 'Has AI changed how you produce content in the last 3 months?',
    options: [
      { text: 'Yes, significantly faster and better quality', score: 4 },
      { text: 'Yes, some improvement', score: 3 },
      { text: 'Minimal change', score: 2 },
      { text: 'Not yet', score: 1 },
    ],
  },
  {
    id: 4,
    dimension: 'D1',
    type: 'single_select',
    question: 'AI-generated content goes out and receives criticism for being generic. What went wrong?',
    options: [
      { text: 'The prompt lacked brand voice and audience context', score: 4 },
      { text: 'AI is not good enough for creative work yet', score: 1 },
      { text: 'The reviewer should have caught it before publishing', score: 2 },
      { text: 'AI-generated content is always generic', score: 1 },
    ],
  },
  {
    id: 5,
    dimension: 'D3',
    type: 'single_select',
    question: 'When prompting AI for creative content, how do you ensure it matches your brand voice?',
    options: [
      { text: 'I include brand guidelines and tone examples in the prompt', score: 4 },
      { text: 'I edit the output to match tone after generating', score: 3 },
      { text: 'I do not, I adjust manually after', score: 2 },
      { text: 'I am not sure how to do this', score: 1 },
    ],
  },
  {
    id: 6,
    dimension: 'D4',
    type: 'multi_select',
    question: 'Which tasks in your role take most time but could be AI-assisted? Select top 2.',
    options: [
      { text: 'Writing copy' },
      { text: 'Creating visuals' },
      { text: 'Monthly reporting' },
      { text: 'Campaign planning' },
      { text: 'Social media scheduling' },
      { text: 'Email drafting' },
    ],
    maxSelect: 2,
    scoreLogic: (selectedTexts) => {
      if (selectedTexts.length >= 2) return 4
      if (selectedTexts.length === 1) return 2
      return 1
    },
  },
  {
    id: 7,
    dimension: 'D2',
    type: 'single_select',
    question: 'How often do you use AI image or visual generation tools in your work?',
    options: [
      { text: 'Daily', score: 4 },
      { text: 'Weekly', score: 3 },
      { text: 'Occasionally', score: 2 },
      { text: 'Never used one', score: 1 },
    ],
  },
  {
    id: 8,
    dimension: 'D5',
    type: 'open_text',
    question: 'Describe the last time you used AI to complete a creative task faster than manually. Type "not yet" if you have not.',
    placeholder: 'Describe the experience or type "not yet"...',
  },
  {
    id: 9,
    dimension: 'D1',
    type: 'single_select',
    question: 'You are about to use AI to generate an image for a client campaign. What do you check first?',
    options: [
      { text: 'Copyright status and data classification', score: 4 },
      { text: 'Whether the prompt quality is good', score: 3 },
      { text: 'Client approval', score: 2 },
      { text: 'Nothing, I just use it', score: 1 },
    ],
  },
  {
    id: 10,
    dimension: 'D4',
    type: 'single_select',
    question: 'If an AI tool could auto-generate your monthly content calendar from a brief, how would you use it?',
    options: [
      { text: 'Use it directly as the final calendar', score: 2 },
      { text: 'Use it as a strong starting draft to refine', score: 4 },
      { text: 'Use it only for initial ideas', score: 3 },
      { text: 'I would not trust it', score: 1 },
    ],
  },
  {
    id: 11,
    dimension: 'D3',
    type: 'single_select',
    question: 'How do you brief AI when creating a campaign concept for a new product launch?',
    options: [
      { text: 'Target audience, key message, tone, format and examples of good campaigns', score: 4 },
      { text: 'Describe the product and ask for ideas', score: 3 },
      { text: 'Ask for a generic campaign idea', score: 2 },
      { text: 'I do not use AI for campaign concepting', score: 1 },
    ],
  },
  {
    id: 12,
    dimension: 'D2',
    type: 'single_select',
    question: 'How often do you use AI to repurpose content across different formats?',
    options: [
      { text: 'Regularly, it is part of my workflow', score: 4 },
      { text: 'Sometimes', score: 3 },
      { text: 'Rarely', score: 2 },
      { text: 'Never', score: 1 },
    ],
  },
  {
    id: 13,
    dimension: 'D5',
    type: 'single_select',
    question: 'Has your content output volume increased because of AI tools in the last 3 months?',
    options: [
      { text: 'Yes, significantly more output', score: 4 },
      { text: 'Yes, slightly more', score: 3 },
      { text: 'Same volume', score: 2 },
      { text: 'I have not used AI for content yet', score: 1 },
    ],
  },
  {
    id: 14,
    dimension: 'D1',
    type: 'single_select',
    question: 'How do you ensure AI-generated content is accurate and not misleading before publishing?',
    options: [
      { text: 'I always fact-check, edit for accuracy and have it reviewed', score: 4 },
      { text: 'I read through it carefully before publishing', score: 3 },
      { text: 'I trust the AI output and publish directly', score: 1 },
      { text: 'I only use AI for visuals, not written content', score: 2 },
    ],
  },
  {
    id: 15,
    dimension: 'D4',
    type: 'single_select',
    question: 'Which AI capability would create the most value in your marketing or creative role?',
    options: [
      { text: 'Automated content calendar generation', score: 3 },
      { text: 'AI-powered audience targeting and personalisation', score: 4 },
      { text: 'Visual and image generation', score: 3 },
      { text: 'I am not sure yet', score: 2 },
    ],
  },
]

// ─── Exports ──────────────────────────────────────────────────────────────────

export const CLUSTER_QUESTIONS = {
  A: CLUSTER_A,
  B: CLUSTER_B,
  C: CLUSTER_C,
}

// ─── Scoring ──────────────────────────────────────────────────────────────────

function scoreOpenText(response) {
  if (!response) return 1
  const trimmed = String(response).trim().toLowerCase()
  if (trimmed === '' || trimmed === 'not yet') return 1
  return 3
}

export function computeIndividualScores(responses, cluster) {
  const questions = CLUSTER_QUESTIONS[cluster]
  if (!questions) return null

  const dimensionBuckets = { D1: [], D2: [], D3: [], D4: [], D5: [] }

  questions.forEach((q, index) => {
    const response = responses[index]
    let score = null

    if (q.type === 'single_select') {
      if (response !== null && response !== undefined) {
        score = q.options[response]?.score ?? null
      }
    } else if (q.type === 'multi_select') {
      if (Array.isArray(response) && response.length > 0) {
        const selectedTexts = response.map(i => q.options[i]?.text).filter(Boolean)
        score = q.scoreLogic ? q.scoreLogic(selectedTexts) : null
      }
    } else if (q.type === 'open_text') {
      score = scoreOpenText(response)
    }

    if (score !== null && dimensionBuckets[q.dimension]) {
      dimensionBuckets[q.dimension].push(score)
    }
  })

  const dimensionAverages = {}
  for (const dim of DIMENSION_KEYS) {
    const bucket = dimensionBuckets[dim]
    dimensionAverages[dim] = bucket.length > 0
      ? bucket.reduce((a, b) => a + b, 0) / bucket.length
      : 0
  }

  const nonZero = Object.values(dimensionAverages).filter(v => v > 0)
  const overallAverage = nonZero.length > 0
    ? nonZero.reduce((a, b) => a + b, 0) / nonZero.length
    : 0

  const capabilityLabel = getCapabilityLabel(overallAverage)

  // Find lowest and second-lowest scoring dimensions
  const sorted = DIMENSION_KEYS
    .filter(d => dimensionAverages[d] > 0)
    .sort((a, b) => dimensionAverages[a] - dimensionAverages[b])

  const primaryLearningFocus = sorted[0] ? LEARNING_FOCUS[sorted[0]] : null
  const secondaryLearningFocus = sorted[1] ? LEARNING_FOCUS[sorted[1]] : null

  return {
    dimensionAverages,
    overallAverage,
    capabilityLabel,
    primaryLearningFocus,
    secondaryLearningFocus,
    isChampion: capabilityLabel === 'AI Champion',
  }
}
