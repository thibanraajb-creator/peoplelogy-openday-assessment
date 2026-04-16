// Dimension labels
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

export function getCapabilityLabel(score) {
  for (const cap of CAPABILITY_LABELS) {
    if (score >= cap.min && score <= cap.max) return cap.label
  }
  if (score < 1.0) return 'AI Beginner'
  return 'AI Champion'
}

// CLUSTER A
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
    question: 'In the past month, how often have you personally used an AI tool (Claude, Copilot, ChatGPT) in your work?',
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
    scoreLogic: (selected) => {
      if (selected.includes('I would approve immediately') && selected.length === 1) return 1
      const validCount = selected.filter(s => s !== 'I would approve immediately').length
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
    question: 'How aware are you of AI governance policies or guidelines in your organisation?',
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
      { text: 'Not yet but planning to', score: 2 },
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
    scoreLogic: (selected) => {
      if (selected.includes('None') && selected.length === 1) return 1
      const validCount = selected.filter(s => s !== 'None').length
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
    question: 'How would you describe your organisation\'s current AI maturity level?',
    options: [
      { text: 'We have a clear AI strategy and it is being executed', score: 4 },
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
    defaultScore: 3,
  },
]

// CLUSTER B
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
    scoreLogic: (selected) => {
      if (selected.includes('None') && selected.length === 1) return 1
      const validCount = selected.filter(s => s !== 'None').length
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
    defaultScore: 3,
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
    question: 'How comfortable are you using Copilot inside Microsoft 365 (Word, Outlook, Teams)?',
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
      { text: 'Regularly, I am always looking', score: 4 },
      { text: 'Occasionally when something obvious comes up', score: 3 },
      { text: 'Rarely, I stick to what I know', score: 2 },
      { text: 'Never thought about it', score: 1 },
    ],
  },
  {
    id: 13,
    dimension: 'D1',
    type: 'single_select',
    question: 'How confident are you discussing AI capabilities and limitations with a client?',
    options: [
      { text: 'Very confident, I can advise clients on AI strategy', score: 4 },
      { text: 'Somewhat confident, I know the basics', score: 3 },
      { text: 'Not very confident, I avoid the topic', score: 2 },
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

// CLUSTER C
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
    scoreLogic: (selected) => {
      if (selected.includes('None') && selected.length === 1) return 1
      const validCount = selected.filter(s => s !== 'None').length
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
    question: 'Which tasks in your role take most time but could be AI-assisted? (select top 2)',
    options: [
      { text: 'Writing copy' },
      { text: 'Creating visuals' },
      { text: 'Monthly reporting' },
      { text: 'Campaign planning' },
      { text: 'Social media scheduling' },
      { text: 'Email drafting' },
    ],
    scoreLogic: (selected) => {
      if (selected.length >= 2) return 4
      if (selected.length === 1) return 2
      return 1
    },
    maxSelect: 2,
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
    placeholder: 'Describe your experience or type "not yet"...',
    scoreLogic: (text) => {
      if (!text) return 1
      if (text.toLowerCase().trim() === 'not yet') return 1
      if (text.trim().length > 20) return 4
      return 3
    },
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
    question: 'How often do you use AI to repurpose content across different formats such as blog to social or video to caption?',
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
      { text: 'I only use AI for visuals not written content', score: 2 },
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

// CLUSTER D
const CLUSTER_D = [
  {
    id: 1,
    dimension: 'D2',
    type: 'multi_select',
    question: 'Which AI-assisted tools have you used in the past month?',
    options: [
      { text: 'Claude' },
      { text: 'GitHub Copilot' },
      { text: 'ChatGPT' },
      { text: 'Cursor' },
      { text: 'Notion AI' },
      { text: 'n8n or Make' },
      { text: 'None' },
      { text: 'Other' },
    ],
    scoreLogic: (selected) => {
      if (selected.includes('None') && selected.length === 1) return 1
      const validCount = selected.filter(s => s !== 'None').length
      if (validCount >= 3) return 4
      if (validCount === 2) return 3
      if (validCount === 1) return 2
      return 1
    },
  },
  {
    id: 2,
    dimension: 'D5',
    type: 'single_select',
    question: 'Have you built, automated or improved any workflow using AI in the last 3 months?',
    options: [
      { text: 'Yes, multiple workflows', score: 4 },
      { text: 'Yes, one workflow', score: 3 },
      { text: 'In progress', score: 2 },
      { text: 'Not yet', score: 1 },
    ],
  },
  {
    id: 3,
    dimension: 'D3',
    type: 'single_select',
    question: 'When using AI for technical tasks, how do you structure your prompt?',
    options: [
      { text: 'I include role, context, constraints and output format', score: 4 },
      { text: 'I describe what I want in plain language', score: 2 },
      { text: 'I paste code and ask it to fix without context', score: 1 },
      { text: 'I do not use AI for technical work', score: 1 },
    ],
  },
  {
    id: 4,
    dimension: 'D4',
    type: 'open_text',
    question: 'Which engineering or product task in your role is most repetitive and could be automated with AI?',
    placeholder: 'Describe the task...',
    defaultScore: 3,
  },
  {
    id: 5,
    dimension: 'D1',
    type: 'single_select',
    question: 'A stakeholder asks you to add AI to an existing product feature. What is your first question?',
    options: [
      { text: 'What specific problem are we solving with AI?', score: 4 },
      { text: 'What is the budget?', score: 2 },
      { text: 'Which AI tool should we use?', score: 2 },
      { text: 'I would start building a prototype immediately', score: 3 },
    ],
  },
  {
    id: 6,
    dimension: 'D5',
    type: 'single_select',
    question: 'How comfortable are you integrating an AI API into a product or internal tool?',
    options: [
      { text: 'Very comfortable, I have done it before', score: 4 },
      { text: 'Some experience, could do it with reference', score: 3 },
      { text: 'I would need significant guidance', score: 2 },
      { text: 'No experience at all', score: 1 },
    ],
  },
  {
    id: 7,
    dimension: 'D3',
    type: 'single_select',
    question: 'You need AI to produce structured JSON from unstructured text. Can you write a prompt that reliably does this?',
    options: [
      { text: 'Yes, confidently', score: 4 },
      { text: 'I would attempt it with some trial and error', score: 3 },
      { text: 'I am not sure how to approach this', score: 2 },
      { text: 'No', score: 1 },
    ],
  },
  {
    id: 8,
    dimension: 'D2',
    type: 'single_select',
    question: 'How often do you use AI to assist with documentation, specs or technical writing?',
    options: [
      { text: 'Daily', score: 4 },
      { text: 'Weekly', score: 3 },
      { text: 'Occasionally', score: 2 },
      { text: 'Never', score: 1 },
    ],
  },
  {
    id: 9,
    dimension: 'D4',
    type: 'single_select',
    question: 'You are scoping a new internal tool. At what stage do you consider AI capabilities?',
    options: [
      { text: 'From the very start, it is a default consideration', score: 4 },
      { text: 'During design phase if it seems to fit', score: 3 },
      { text: 'Only if a stakeholder requests it', score: 2 },
      { text: 'I have not built with AI yet', score: 1 },
    ],
  },
  {
    id: 10,
    dimension: 'D1',
    type: 'single_select',
    question: 'A junior team member asks if they can use ChatGPT to write production code. What is your response?',
    options: [
      { text: 'Yes, with mandatory code review', score: 4 },
      { text: 'Yes, without restriction', score: 1 },
      { text: 'No, it is a security risk', score: 2 },
      { text: 'It depends on the data classification of the codebase', score: 4 },
    ],
  },
  {
    id: 11,
    dimension: 'D3',
    type: 'single_select',
    question: 'How do you use AI to speed up code review or debugging?',
    options: [
      { text: 'I paste the code with full context and ask AI to identify issues and suggest fixes', score: 4 },
      { text: 'I ask AI to explain what the code does', score: 3 },
      { text: 'I only use AI for writing new code not reviewing', score: 2 },
      { text: 'I do not use AI for code review', score: 1 },
    ],
  },
  {
    id: 12,
    dimension: 'D5',
    type: 'single_select',
    question: 'Have you used AI to generate or improve technical documentation or API specs?',
    options: [
      { text: 'Yes, regularly', score: 4 },
      { text: 'Yes, occasionally', score: 3 },
      { text: 'Not yet but planning to', score: 2 },
      { text: 'No', score: 1 },
    ],
  },
  {
    id: 13,
    dimension: 'D2',
    type: 'single_select',
    question: 'How proficient are you with prompt engineering for technical outputs such as code, data transformation or system design?',
    options: [
      { text: 'Very proficient, I write structured multi-step prompts', score: 4 },
      { text: 'Intermediate, I can get good results with some iteration', score: 3 },
      { text: 'Basic, I write simple prompts and get mixed results', score: 2 },
      { text: 'Beginner, I am still learning how to prompt effectively', score: 1 },
    ],
  },
  {
    id: 14,
    dimension: 'D4',
    type: 'single_select',
    question: 'Which AI capability would add the most value to your technical role?',
    options: [
      { text: 'AI-assisted code generation and review', score: 4 },
      { text: 'Automated testing and QA', score: 4 },
      { text: 'AI for system architecture design', score: 3 },
      { text: 'I am not sure yet', score: 2 },
    ],
  },
  {
    id: 15,
    dimension: 'D1',
    type: 'single_select',
    question: 'How do you stay updated on new AI tools and capabilities relevant to your technical role?',
    options: [
      { text: 'I actively experiment with new tools and follow AI research', score: 4 },
      { text: 'I read articles and follow industry news', score: 3 },
      { text: 'I learn when my team or manager shares something', score: 2 },
      { text: 'I do not actively follow AI developments', score: 1 },
    ],
  },
]

// CLUSTER E
const CLUSTER_E = [
  {
    id: 1,
    dimension: 'D2',
    type: 'single_select',
    question: 'Do you use AI to help design, write or improve training content or facilitation materials?',
    options: [
      { text: 'Yes, regularly', score: 4 },
      { text: 'Occasionally', score: 3 },
      { text: 'Tried it once', score: 2 },
      { text: 'Never', score: 1 },
    ],
  },
  {
    id: 2,
    dimension: 'D3',
    type: 'single_select',
    question: 'You need to create a session plan for a leadership workshop. How do you use AI?',
    options: [
      { text: 'Ask AI to generate a full plan with no context', score: 2 },
      { text: 'Give AI the objectives, audience and format, then refine', score: 4 },
      { text: 'Use AI for activity ideas only, write the plan manually', score: 2 },
      { text: 'I do not use AI for session planning', score: 1 },
    ],
  },
  {
    id: 3,
    dimension: 'D4',
    type: 'multi_select',
    question: 'Which part of your L&D role could AI most meaningfully improve?',
    options: [
      { text: 'Content writing' },
      { text: 'Assessment design' },
      { text: 'Participant communication' },
      { text: 'Post-programme reports' },
      { text: 'Facilitation prep' },
      { text: 'None' },
    ],
    scoreLogic: (selected) => {
      if (selected.includes('None') && selected.length === 1) return 1
      const validCount = selected.filter(s => s !== 'None').length
      if (validCount >= 3) return 4
      if (validCount === 2) return 3
      if (validCount === 1) return 2
      return 1
    },
  },
  {
    id: 4,
    dimension: 'D1',
    type: 'single_select',
    question: 'A participant asks during a workshop whether AI will replace their job. How confident are you answering clearly?',
    options: [
      { text: 'Very confident, I have a clear and balanced answer', score: 4 },
      { text: 'Somewhat confident', score: 3 },
      { text: 'Not very confident', score: 2 },
      { text: 'Not at all confident', score: 1 },
    ],
  },
  {
    id: 5,
    dimension: 'D5',
    type: 'single_select',
    question: 'Have you used AI to generate or improve a post-programme report in the last 3 months?',
    options: [
      { text: 'Yes', score: 4 },
      { text: 'No but I am planning to', score: 2 },
      { text: 'No', score: 1 },
      { text: 'I did not know I could do this', score: 1 },
    ],
  },
  {
    id: 6,
    dimension: 'D3',
    type: 'single_select',
    question: 'You want AI to write 5 scenario-based assessment questions for a leadership module. What do you include in your prompt?',
    options: [
      { text: 'Module topic, learning objectives, audience and desired format', score: 4 },
      { text: 'Just the module topic', score: 2 },
      { text: 'The full module content without structure', score: 2 },
      { text: 'I would not know what to include', score: 1 },
    ],
  },
  {
    id: 7,
    dimension: 'D2',
    type: 'single_select',
    question: 'Have you used Copilot in Word or PowerPoint to speed up building training decks?',
    options: [
      { text: 'Yes, regularly', score: 4 },
      { text: 'Tried it a few times', score: 3 },
      { text: 'I know it exists but have not tried it', score: 2 },
      { text: 'I was not aware of this feature', score: 1 },
    ],
  },
  {
    id: 8,
    dimension: 'D4',
    type: 'single_select',
    question: 'How much of your content writing could realistically be first-drafted by AI?',
    options: [
      { text: 'Most of it', score: 4 },
      { text: 'About half', score: 3 },
      { text: 'A small portion only', score: 2 },
      { text: 'None, it needs to be fully human-written', score: 1 },
    ],
  },
  {
    id: 9,
    dimension: 'D1',
    type: 'single_select',
    question: 'A client asks whether their programme content was AI-generated. What is the right response?',
    options: [
      { text: 'Be transparent and explain the AI-assisted process and governance', score: 4 },
      { text: 'Avoid confirming or denying', score: 1 },
      { text: 'Say no', score: 1 },
      { text: 'It depends on the client relationship', score: 2 },
    ],
  },
  {
    id: 10,
    dimension: 'D5',
    type: 'open_text',
    question: 'If you had 1 hour per week to learn AI tools for your role, what would you focus on first?',
    placeholder: 'Describe what you would focus on...',
    defaultScore: 3,
  },
  {
    id: 11,
    dimension: 'D3',
    type: 'single_select',
    question: 'How do you currently use AI to personalise learning experiences for different participant groups?',
    options: [
      { text: 'I use AI to create tailored content variants for different roles and levels', score: 4 },
      { text: 'I use AI to suggest personalisation ideas then implement manually', score: 3 },
      { text: 'I do not personalise, one version for all', score: 2 },
      { text: 'I have not thought about using AI for personalisation', score: 1 },
    ],
  },
  {
    id: 12,
    dimension: 'D2',
    type: 'single_select',
    question: 'How often do you use AI to generate icebreakers, activities or energisers for your training sessions?',
    options: [
      { text: 'Regularly, AI is part of my session design toolkit', score: 4 },
      { text: 'Occasionally', score: 3 },
      { text: 'Rarely', score: 2 },
      { text: 'Never', score: 1 },
    ],
  },
  {
    id: 13,
    dimension: 'D5',
    type: 'single_select',
    question: 'Have you built any AI-assisted learning tools or resources for your participants in the last 6 months?',
    options: [
      { text: 'Yes, multiple', score: 4 },
      { text: 'Yes, one', score: 3 },
      { text: 'Planning to', score: 2 },
      { text: 'No', score: 1 },
    ],
  },
  {
    id: 14,
    dimension: 'D1',
    type: 'single_select',
    question: 'How confident are you facilitating a session specifically about AI literacy for non-technical staff?',
    options: [
      { text: 'Very confident, I have done it before', score: 4 },
      { text: 'Fairly confident, I could prepare and deliver it', score: 3 },
      { text: 'Not very confident, I would need support', score: 2 },
      { text: 'Not at all confident', score: 1 },
    ],
  },
  {
    id: 15,
    dimension: 'D4',
    type: 'single_select',
    question: 'Which AI application would most transform your L&D practice?',
    options: [
      { text: 'AI that generates complete course content from a learning brief', score: 4 },
      { text: 'AI that personalises learning paths for each learner automatically', score: 4 },
      { text: 'AI that analyses learner performance and recommends interventions', score: 3 },
      { text: 'I am not sure yet', score: 2 },
    ],
  },
]

export const CLUSTER_QUESTIONS = {
  A: CLUSTER_A,
  B: CLUSTER_B,
  C: CLUSTER_C,
  D: CLUSTER_D,
  E: CLUSTER_E,
}

export const CLUSTER_NAMES = {
  A: 'Leaders & Strategy',
  B: 'Commercial & Client',
  C: 'Creative & Marketing',
  D: 'Technical & Delivery',
  E: 'L&D & People',
}

export function assignCluster(roleLevel, primaryFunction) {
  const leaderRoles = ['C-Suite / Board (CEO, COO, CFO, CTO)', 'Director / VP']
  if (leaderRoles.includes(roleLevel)) return 'A'

  const functionMap = {
    'Strategy & Leadership': 'A',
    'Human Resources & People': 'A',
    'Finance & Accounting': 'A',
    'Sales & Business Development': 'B',
    'Operations & Process': 'B',
    'Community': 'B',
    'Marketing & Branding': 'C',
    'Technology & Digital': 'D',
    'Product & Innovation': 'D',
    'Learning & Development': 'E',
    'Others': 'B',
  }

  return functionMap[primaryFunction] || 'B'
}

export function computeIndividualScores(responses, cluster) {
  const questions = CLUSTER_QUESTIONS[cluster]
  const dimensionScores = { D1: [], D2: [], D3: [], D4: [], D5: [] }

  questions.forEach((q, index) => {
    const response = responses[index]
    let score = null

    if (q.type === 'single_select' && response !== null) {
      score = q.options[response]?.score || null
    } else if (q.type === 'multi_select' && Array.isArray(response)) {
      const selectedTexts = response.map(i => q.options[i]?.text).filter(Boolean)
      score = q.scoreLogic ? q.scoreLogic(selectedTexts) : null
    } else if (q.type === 'open_text' && response !== null) {
      if (q.scoreLogic) {
        score = q.scoreLogic(response)
      } else {
        score = q.defaultScore || 3
      }
    }

    if (score !== null) {
      dimensionScores[q.dimension].push(score)
    }
  })

  const dimensionAverages = {}
  for (const dim of DIMENSION_KEYS) {
    const scores = dimensionScores[dim]
    if (scores.length > 0) {
      dimensionAverages[dim] = scores.reduce((a, b) => a + b, 0) / scores.length
    } else {
      dimensionAverages[dim] = 0
    }
  }

  const allScores = Object.values(dimensionAverages).filter(s => s > 0)
  const overallAverage = allScores.length > 0
    ? allScores.reduce((a, b) => a + b, 0) / allScores.length
    : 0

  const capabilityLabel = getCapabilityLabel(overallAverage)
  const overallPercentage = Math.round(overallAverage * 25)

  // Find lowest dimension
  let lowestDim = DIMENSION_KEYS[0]
  let lowestScore = dimensionAverages[DIMENSION_KEYS[0]]
  let secondLowestDim = null
  let secondLowestScore = Infinity

  for (const dim of DIMENSION_KEYS) {
    if (dimensionAverages[dim] < lowestScore) {
      secondLowestDim = lowestDim
      secondLowestScore = lowestScore
      lowestDim = dim
      lowestScore = dimensionAverages[dim]
    } else if (dimensionAverages[dim] < secondLowestScore && dim !== lowestDim) {
      secondLowestDim = dim
      secondLowestScore = dimensionAverages[dim]
    }
  }

  const primaryLearningFocus = LEARNING_FOCUS[lowestDim]
  const secondaryLearningFocus = secondLowestDim ? LEARNING_FOCUS[secondLowestDim] : null

  return {
    dimensionAverages,
    dimensionScores,
    overallAverage,
    overallPercentage,
    capabilityLabel,
    primaryLearningFocus,
    secondaryLearningFocus,
    lowestDim,
    secondLowestDim,
    isChampion: capabilityLabel === 'AI Champion',
  }
}
