import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Logo from '../components/Logo'
import NeuralNetwork from '../components/NeuralNetwork'
import { supabase, SESSION_CODE } from '../lib/supabase'

const FULL_TEXT = 'AI Readiness\nAssessment'
const CARD_GLASS = {
  background: 'rgba(255,255,255,0.1)',
  border: '1px solid rgba(255,255,255,0.2)',
  borderRadius: '20px',
  boxShadow: '0 4px 24px rgba(0,0,0,0.2)',
  padding: '28px',
}

// ── Icons ────────────────────────────────────────────────────────────────────

function BuildingIcon() {
  return (
    <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="#00ADA9" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  )
}

function PersonIcon() {
  return (
    <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="#00ADA9" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  )
}

function ChartIcon() {
  return (
    <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="#00ADA9" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  )
}

function LocationIcon() {
  return (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#00ADA9" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )
}

// ── Stat pill ────────────────────────────────────────────────────────────────

function StatPill({ value, label }) {
  return (
    <div className="flex flex-col items-center border border-[#00ADA9] rounded-full px-4 py-2">
      <span className="text-[#00ADA9] font-bold text-lg leading-tight">{value}</span>
      <span className="text-white/60 text-xs">{label}</span>
    </div>
  )
}

// ── Path card ────────────────────────────────────────────────────────────────

function PathCard({ icon, title, description, time, buttonText, badge, glow, buttonStyle, onClick }) {
  return (
    <div className="relative flex flex-col" style={{ ...(glow ? { animation: 'glowPulse 2s ease-in-out infinite alternate', outline: '2px solid #00ADA9' } : {}), ...CARD_GLASS }}>
      {badge && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#00ADA9] text-white text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">
          {badge}
        </span>
      )}
      <div className="flex items-center justify-center w-14 h-14 bg-[#00ADA9]/20 rounded-xl mb-5">
        {icon}
      </div>
      <h3 className="text-white font-bold text-xl mb-3">{title}</h3>
      <p className="text-white/60 text-sm leading-relaxed flex-1 mb-5">{description}</p>
      <div className="mb-5">
        <span className="inline-block bg-white/10 text-white/70 text-xs rounded-full px-3 py-1">
          {time}
        </span>
      </div>
      <button
        onClick={onClick}
        className="w-full font-bold py-3 rounded-xl transition-colors duration-200 text-white text-sm"
        style={buttonStyle}
      >
        {buttonText}
      </button>
    </div>
  )
}

// ── Main page ────────────────────────────────────────────────────────────────

export default function Landing() {
  const navigate = useNavigate()

  // Typing animation
  const [typed, setTyped] = useState(0)
  const [cursorVisible, setCursorVisible] = useState(true)
  const done = typed >= FULL_TEXT.length

  useEffect(() => {
    if (typed < FULL_TEXT.length) {
      const t = setTimeout(() => setTyped(t => t + 1), 75)
      return () => clearTimeout(t)
    }
  }, [typed])

  // Cursor blink after typing finishes
  useEffect(() => {
    if (!done) return
    const t = setInterval(() => setCursorVisible(v => !v), 530)
    return () => clearInterval(t)
  }, [done])

  // Live counters
  const [orgCount, setOrgCount] = useState(0)
  const [indCount, setIndCount] = useState(0)
  const [championCount, setChampionCount] = useState(0)

  async function fetchCounts() {
    const [{ count: org }, { count: ind }, { count: champ }] = await Promise.all([
      supabase
        .from('openday_responses')
        .select('*', { count: 'exact', head: true })
        .eq('session_code', SESSION_CODE),
      supabase
        .from('openday_individual_capability')
        .select('*', { count: 'exact', head: true })
        .eq('session_code', SESSION_CODE),
      supabase
        .from('openday_individual_capability')
        .select('*', { count: 'exact', head: true })
        .eq('session_code', SESSION_CODE)
        .eq('is_champion', true),
    ])
    setOrgCount(org ?? 0)
    setIndCount(ind ?? 0)
    setChampionCount(champ ?? 0)
  }

  useEffect(() => {
    fetchCounts()
    const interval = setInterval(fetchCounts, 30000)
    return () => clearInterval(interval)
  }, [])

  const handleStart = (path) => navigate('/intake', { state: { path } })

  // Render typed text as two lines
  const sliced = FULL_TEXT.slice(0, typed)
  const [line1, line2] = sliced.split('\n')
  const totalShown = orgCount + indCount
  const hasActivity = totalShown > 0 || championCount > 0

  return (
    <div className="min-h-screen bg-[#1B3A5C]">
      {/* Injected keyframes */}
      <style>{`
        @keyframes glowPulse {
          from { opacity: 0.7; }
          to   { opacity: 1; }
        }
        @keyframes dotPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.4; transform: scale(0.7); }
        }
      `}</style>

      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-5 max-w-6xl mx-auto">
        <Logo />
        <span className="text-white/70 text-sm">Open Day JB · 5 May 2026</span>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-8 pb-10">
        <div className="flex items-center gap-8">

          {/* Left column */}
          <div className="flex-1">
            {/* Pill */}
            <div className="inline-flex items-center gap-2 bg-[#00ADA9]/20 border border-[#00ADA9]/30 text-[#00ADA9] text-xs font-bold px-4 py-2 rounded-full uppercase tracking-widest mb-8">
              <span
                className="w-1.5 h-1.5 bg-[#00ADA9] rounded-full"
                style={{ animation: 'dotPulse 1.4s ease-in-out infinite' }}
              />
              Powered by PEOPLElogy
            </div>

            {/* Typing title */}
            <h1 className="text-5xl font-black text-white leading-tight mb-6 min-h-[7rem]">
              {line1 ?? ''}
              {line1 !== undefined && line2 !== undefined && <br />}
              {line2 ?? ''}
              <span
                className="inline-block w-[3px] h-[0.85em] bg-white ml-1 align-middle"
                style={{ opacity: cursorVisible ? 1 : 0, transition: 'opacity 0.1s' }}
              />
            </h1>

            {/* Subtitle */}
            <p className="text-white/70 text-lg max-w-xl mb-8 leading-relaxed">
              Discover where you and your organisation stand on AI adoption.
              Get your personal report instantly.
            </p>

            {/* Event badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white/90 text-sm font-medium px-5 py-2.5 rounded-full mb-8">
              <LocationIcon />
              Open Day JB · 5 May 2026 · Johor Bahru
            </div>

            {/* Live counters */}
            <div>
              {hasActivity ? (
                <div className="flex flex-wrap gap-3">
                  <StatPill value={totalShown} label="assessments completed" />
                  <StatPill value={orgCount} label="organisations assessed" />
                  <StatPill value={championCount} label="AI Champions identified" />
                </div>
              ) : (
                <p className="text-white/50 text-sm italic">Be the first to take the assessment today.</p>
              )}
            </div>
          </div>

          {/* Right column — neural network */}
          <div
            className="hidden md:flex flex-shrink-0 items-center justify-center"
            style={{ width: '380px', height: '420px' }}
          >
            <NeuralNetwork />
          </div>

        </div>
      </section>

      {/* Path cards */}
      <section className="max-w-6xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <PathCard
            icon={<BuildingIcon />}
            title="My Organisation's Readiness"
            description="Evaluate how ready your organisation is to adopt and scale AI across strategy, data, people, processes and governance."
            time="~10 minutes · 25 questions"
            buttonText="Start Org Assessment"
            buttonStyle={{ backgroundColor: '#00ADA9' }}
            onClick={() => handleStart('org')}
          />
          <PathCard
            icon={<PersonIcon />}
            title="My Personal AI Capability"
            description="Discover your individual AI skill level — how you currently use AI tools, write prompts, and identify opportunities in your role."
            time="~8 minutes · 15 questions"
            buttonText="Start Personal Assessment"
            badge="MOST POPULAR"
            glow
            buttonStyle={{ backgroundColor: '#00ADA9' }}
            onClick={() => handleStart('individual')}
          />
          <PathCard
            icon={<ChartIcon />}
            title="Full AI Readiness Assessment"
            description="The complete picture. Assess both your organisation's readiness and your personal AI capability. Get a comprehensive gap analysis."
            time="~18 minutes · 40 questions"
            buttonText="Start Full Assessment"
            buttonStyle={{
              backgroundColor: '#1B3A5C',
              border: '1px solid #00ADA9',
            }}
            onClick={() => handleStart('full')}
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-6 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-white/40 text-xs leading-relaxed max-w-2xl mx-auto">
            All data collected is handled in accordance with Malaysia's Personal Data Protection Act (PDPA) 2010.
            PEOPLElogy Berhad does not sell or share your personal data.
          </p>
          <div className="mt-4 flex items-center justify-center gap-4">
            <a href="/dashboard" className="text-white/30 hover:text-white/60 text-xs transition-colors">
              Live Dashboard
            </a>
            <span className="text-white/20">·</span>
            <a href="/facilitator-jb2026" className="text-white/30 hover:text-white/60 text-xs transition-colors">
              Facilitator Screen
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
