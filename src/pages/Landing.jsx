import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Logo from '../components/Logo'
import NeuralNetwork from '../components/NeuralNetwork'
import { supabase, SESSION_CODE } from '../lib/supabase'

const FULL_TEXT = 'AI Readiness'

// ── Icons ────────────────────────────────────────────────────────────────────

function BuildingIcon() {
  return (
    <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="#00ADA9" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  )
}

function PersonIcon() {
  return (
    <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="#00ADA9" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  )
}

function ChartIcon() {
  return (
    <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="#00ADA9" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  )
}

function ShieldIcon() {
  return (
    <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="#00ADA9" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  )
}

function LocationIcon() {
  return (
    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )
}

// ── Path card ────────────────────────────────────────────────────────────────

function PathCard({ icon, title, description, time, buttonText, badge, glow, onClick }) {
  const [hovered, setHovered] = useState(false)
  const [btnHovered, setBtnHovered] = useState(false)

  const buttonStyle = glow
    ? {
        background: btnHovered ? '#00c4c0' : '#00ADA9',
        border: '1px solid transparent',
        color: 'white',
        width: '100%',
        fontWeight: 'bold',
        paddingTop: '14px',
        paddingBottom: '14px',
        borderRadius: '12px',
        transition: 'all 0.2s',
        fontSize: '14px',
        cursor: 'pointer',
      }
    : {
        background: btnHovered ? '#00ADA9' : 'transparent',
        border: btnHovered ? '1px solid #00ADA9' : '1px solid rgba(255,255,255,0.3)',
        color: 'white',
        width: '100%',
        fontWeight: 'bold',
        paddingTop: '14px',
        paddingBottom: '14px',
        borderRadius: '12px',
        transition: 'all 0.2s',
        fontSize: '14px',
        cursor: 'pointer',
      }

  return (
    <div
      className="relative flex flex-col rounded-2xl overflow-hidden cursor-pointer"
      style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.07), rgba(255,255,255,0.03))',
        border: hovered
          ? '1px solid rgba(0,173,169,0.6)'
          : glow
          ? '1px solid rgba(0,173,169,0.4)'
          : '1px solid rgba(255,255,255,0.08)',
        boxShadow: hovered
          ? '0 8px 40px rgba(0,0,0,0.4), 0 0 20px rgba(0,173,169,0.15)'
          : glow
          ? '0 4px 24px rgba(0,0,0,0.3), 0 0 30px rgba(0,173,169,0.1)'
          : '0 4px 24px rgba(0,0,0,0.2)',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        transition: 'transform 300ms ease, box-shadow 300ms ease, border-color 300ms ease',
        animation: glow ? 'glowBorder 3s ease-in-out infinite' : undefined,
        minHeight: '360px',
        padding: '32px',
        paddingBottom: '32px',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Gradient top accent for Most Popular */}
      {glow && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: 'linear-gradient(90deg, #00ADA9, #00e5e0, #00ADA9)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 2s linear infinite',
          }}
        />
      )}

      {badge && (
        <span
          className="absolute -top-3.5 left-1/2 -translate-x-1/2 text-white text-xs font-bold px-4 py-1.5 rounded-full whitespace-nowrap"
          style={{
            background: 'linear-gradient(90deg, #00ADA9, #00c4c0)',
            boxShadow: '0 4px 15px rgba(0,173,169,0.4)',
          }}
        >
          {badge}
        </span>
      )}

      {/* Icon */}
      <div
        className="flex items-center justify-center w-14 h-14 rounded-xl mb-6 flex-shrink-0"
        style={{ background: 'rgba(0,173,169,0.15)', border: '1px solid rgba(0,173,169,0.2)' }}
      >
        {icon}
      </div>

      <h3 className="text-white font-bold text-xl mb-3 leading-snug">{title}</h3>
      <p className="text-white/50 text-sm leading-relaxed flex-1 mb-5">{description}</p>

      <div className="mb-6">
        <span
          className="inline-block text-white/40 text-xs rounded-full px-3 py-1"
          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          {time}
        </span>
      </div>

      <button
        onClick={onClick}
        style={buttonStyle}
        onMouseEnter={() => setBtnHovered(true)}
        onMouseLeave={() => setBtnHovered(false)}
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
      const t = setTimeout(() => setTyped(t => t + 1), 70)
      return () => clearTimeout(t)
    }
  }, [typed])

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

  const sliced = FULL_TEXT.slice(0, typed)
  const totalShown = orgCount + indCount
  const hasActivity = totalShown > 0 || championCount > 0

  return (
    <div style={{ background: '#0a1628', minHeight: '100vh' }}>
      {/* Keyframes */}
      <style>{`
        @keyframes glowBorder {
          0%, 100% { box-shadow: 0 4px 24px rgba(0,0,0,0.3), 0 0 20px rgba(0,173,169,0.08); }
          50%       { box-shadow: 0 4px 24px rgba(0,0,0,0.3), 0 0 40px rgba(0,173,169,0.2); }
        }
        @keyframes dotPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.4; transform: scale(0.7); }
        }
        @keyframes shimmer {
          0%   { background-position: 200% center; }
          100% { background-position: -200% center; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.6s ease forwards; }
      `}</style>

      {/* Sticky blurred navbar */}
      <nav
        className="sticky top-0 z-50 flex items-center justify-between px-8 py-4 max-w-7xl mx-auto"
        style={{
          background: 'rgba(10,22,40,0.8)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
        }}
      >
        <Logo height={36} />
        <span
          className="text-xs font-semibold px-4 py-1.5 rounded-full"
          style={{
            background: 'rgba(0,173,169,0.15)',
            border: '1px solid rgba(0,173,169,0.3)',
            color: '#00ADA9',
          }}
        >
          Open Day JB · 5 May 2026
        </span>
      </nav>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-8 pt-16 pb-12 relative">
        {/* Radial glow behind hero */}
        <div
          style={{
            position: 'absolute',
            top: '10%',
            left: '-10%',
            width: '600px',
            height: '500px',
            background: 'radial-gradient(ellipse, rgba(0,173,169,0.1) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '0%',
            right: '-5%',
            width: '400px',
            height: '400px',
            background: 'radial-gradient(ellipse, rgba(0,173,169,0.06) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        <div className="flex items-center gap-12 relative">
          {/* Left column */}
          <div className="flex-1 fade-up">
            {/* Pulsing dot pill */}
            <div
              className="inline-flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-full uppercase tracking-widest mb-10"
              style={{
                background: 'rgba(0,173,169,0.12)',
                border: '1px solid rgba(0,173,169,0.25)',
                color: '#00ADA9',
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: '#00ADA9', animation: 'dotPulse 1.4s ease-in-out infinite' }}
              />
              Powered by PEOPLElogy
            </div>

            {/* Typing title */}
            <h1 className="font-black text-white leading-tight mb-6" style={{ fontSize: '3.75rem', minHeight: '5rem' }}>
              {sliced}
              <span
                className="inline-block w-[3px] bg-white ml-1 align-middle"
                style={{
                  height: '0.8em',
                  opacity: cursorVisible ? 1 : 0,
                  transition: 'opacity 0.1s',
                }}
              />
            </h1>

            {/* Subtitle */}
            <p className="text-lg mb-8 leading-relaxed max-w-lg" style={{ color: 'rgba(255,255,255,0.5)' }}>
              Discover where you and your organisation stand on AI adoption.
              Get your personal report instantly.
            </p>

            {/* Location badge */}
            <div
              className="inline-flex items-center gap-2 text-sm font-medium px-5 py-2.5 rounded-full mb-10"
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'rgba(255,255,255,0.7)',
              }}
            >
              <LocationIcon />
              Open Day JB · 5 May 2026 · Johor Bahru
            </div>

            {/* Live counter stat bar */}
            <div
              className="rounded-2xl px-8 py-5"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              {hasActivity ? (
                <div className="flex items-center gap-0">
                  {[
                    { value: totalShown,    label: 'assessments completed' },
                    { value: orgCount,      label: 'organisations assessed' },
                    { value: championCount, label: 'AI Champions identified' },
                  ].map((stat, i) => (
                    <div key={i} className="flex items-center flex-1">
                      <div className="flex-1 text-center">
                        <div className="font-black text-2xl" style={{ color: '#00ADA9' }}>{stat.value}</div>
                        <div className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>{stat.label}</div>
                      </div>
                      {i < 2 && (
                        <div style={{ width: '1px', height: '40px', background: 'rgba(255,255,255,0.1)', flexShrink: 0 }} />
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-sm italic" style={{ color: 'rgba(255,255,255,0.3)' }}>
                  Be the first to take the assessment today.
                </p>
              )}
            </div>
          </div>

          {/* Right column — neural network */}
          <div
            className="hidden md:flex flex-shrink-0 items-center justify-center"
            style={{ width: '480px', height: '520px' }}
          >
            <NeuralNetwork />
          </div>
        </div>
      </section>

      {/* Section label */}
      <div className="max-w-7xl mx-auto px-8 mb-6">
        <div className="flex items-center gap-4">
          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.06)' }} />
          <span className="text-xs font-bold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.25)' }}>
            Choose your assessment path
          </span>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.06)' }} />
        </div>
      </div>

      {/* Path cards */}
      <section className="max-w-7xl mx-auto px-8 pb-20" style={{ marginTop: '48px' }}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <PathCard
            icon={<BuildingIcon />}
            title="My Organisation's Readiness"
            description="Evaluate how ready your organisation is to adopt and scale AI across strategy, data, people, processes and governance."
            time="~10 minutes · 25 questions"
            buttonText="Start Org Assessment →"
            onClick={() => handleStart('org')}
          />
          <PathCard
            icon={<PersonIcon />}
            title="My Personal AI Capability"
            description="Discover your individual AI skill level — how you currently use AI tools, write prompts, and identify opportunities in your role."
            time="~8 minutes · 15 questions"
            buttonText="Start Personal Assessment →"
            badge="MOST POPULAR"
            glow
            onClick={() => handleStart('individual')}
          />
          <PathCard
            icon={<ChartIcon />}
            title="Full AI Readiness"
            description="The complete picture. Assess both your organisation's readiness and your personal AI capability. Get a comprehensive gap analysis."
            time="~18 minutes · 40 questions"
            buttonText="Start Full Assessment →"
            onClick={() => handleStart('full')}
          />
          <PathCard
            icon={<ShieldIcon />}
            title="AI Safety Capacity & Digital Trust"
            description="Assess your readiness across AI safety, digital trust, and resilience — deepfake defence, output verification, and AI incident response."
            time="16 questions · about 7 minutes"
            buttonText="Start Safety Assessment →"
            onClick={() => handleStart('safety')}
          />
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '24px' }}>
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-xs leading-relaxed max-w-2xl mx-auto" style={{ color: 'rgba(255,255,255,0.2)' }}>
            All data collected is handled in accordance with Malaysia's Personal Data Protection Act (PDPA) 2010.
            PEOPLElogy Berhad does not sell or share your personal data.
          </p>
          <div className="mt-4 flex items-center justify-center gap-4">
            <a
              href="/dashboard"
              className="text-xs transition-colors"
              style={{ color: 'rgba(255,255,255,0.2)' }}
              onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.2)'}
            >
              Live Dashboard
            </a>
            <span style={{ color: 'rgba(255,255,255,0.1)' }}>·</span>
            <a
              href="/facilitator-jb2026"
              className="text-xs transition-colors"
              style={{ color: 'rgba(255,255,255,0.2)' }}
              onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.2)'}
            >
              Facilitator Screen
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
