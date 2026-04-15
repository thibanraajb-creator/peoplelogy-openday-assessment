import { useNavigate } from 'react-router-dom'
import Logo from '../components/Logo'

function PathCard({ icon, title, description, time, buttonText, badge, onClick }) {
  return (
    <div className="relative flex flex-col bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow duration-300">
      {badge && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="bg-[#00ADA9] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide whitespace-nowrap">
            {badge}
          </span>
        </div>
      )}
      <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-[#E6FAF9] mb-5">
        {icon}
      </div>
      <h3 className="text-[#1B3A5C] font-bold text-xl mb-3">{title}</h3>
      <p className="text-gray-600 text-sm leading-relaxed flex-1 mb-5">{description}</p>
      <div className="mb-5">
        <span className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-600 text-xs font-medium px-3 py-1.5 rounded-full">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {time}
        </span>
      </div>
      <button
        onClick={onClick}
        className="w-full bg-[#00ADA9] hover:bg-[#008a87] text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200 text-sm"
      >
        {buttonText}
      </button>
    </div>
  )
}

export default function Landing() {
  const navigate = useNavigate()

  const handleStart = (path) => {
    navigate('/intake', { state: { path } })
  }

  return (
    <div className="min-h-screen bg-[#1B3A5C]">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-5 max-w-6xl mx-auto">
        <Logo />
        <span className="text-white/70 text-sm font-medium">Open Day JB · 5 May 2026</span>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-12 pb-16 text-center">
        <div className="inline-flex items-center gap-2 bg-[#00ADA9]/20 border border-[#00ADA9]/30 text-[#00ADA9] text-xs font-bold px-4 py-2 rounded-full uppercase tracking-widest mb-8">
          <span className="w-1.5 h-1.5 bg-[#00ADA9] rounded-full"></span>
          Powered by PEOPLElogy
        </div>

        <h1 className="text-5xl md:text-6xl font-extrabold text-white leading-tight mb-6">
          AI Readiness<br />
          <span className="text-[#00ADA9]">Assessment</span>
        </h1>

        <p className="text-white/70 text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
          Discover where you and your organisation stand on AI adoption.<br className="hidden md:block" />
          Get your personal report instantly.
        </p>

        <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white/90 text-sm font-medium px-5 py-2.5 rounded-full">
          <svg className="w-4 h-4 text-[#00ADA9]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Open Day JB · 5 May 2026 · Johor Bahru
        </div>
      </section>

      {/* Path Cards */}
      <section className="max-w-6xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-4">
          {/* Card 1 — Org */}
          <PathCard
            icon={
              <svg className="w-7 h-7 text-[#00ADA9]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            }
            title="My Organisation's Readiness"
            description="Evaluate how ready your organisation is to adopt and scale AI across strategy, data, people, processes and governance."
            time="~8 minutes · 20 questions"
            buttonText="Start Org Assessment"
            onClick={() => handleStart('org')}
          />

          {/* Card 2 — Individual (featured) */}
          <PathCard
            icon={
              <svg className="w-7 h-7 text-[#00ADA9]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            }
            title="My Personal AI Capability"
            description="Discover your individual AI skill level — how you currently use AI tools, write prompts, and identify opportunities in your role."
            time="~5 minutes · 10 questions"
            buttonText="Start Personal Assessment"
            badge="Most Popular"
            onClick={() => handleStart('individual')}
          />

          {/* Card 3 — Full */}
          <PathCard
            icon={
              <svg className="w-7 h-7 text-[#00ADA9]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            }
            title="Full AI Readiness Assessment"
            description="The complete picture. Assess both your organisation's readiness and your personal AI capability. Get a comprehensive gap analysis."
            time="~12 minutes · 30 questions"
            buttonText="Start Full Assessment"
            onClick={() => handleStart('full')}
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-white/50 text-xs leading-relaxed max-w-2xl mx-auto">
            All data collected is handled in accordance with Malaysia's Personal Data Protection Act (PDPA) 2010.
            PEOPLElogy Berhad does not sell or share your personal data.
          </p>
          <div className="mt-4 flex items-center justify-center gap-4">
            <a href="/dashboard" className="text-white/40 hover:text-white/70 text-xs transition-colors">Live Dashboard</a>
            <span className="text-white/20">·</span>
            <a href="/facilitator-jb2026" className="text-white/40 hover:text-white/70 text-xs transition-colors">Facilitator Screen</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
