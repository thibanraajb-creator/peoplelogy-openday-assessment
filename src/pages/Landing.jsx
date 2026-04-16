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
      <div style={{display: 'flex', alignItems: 'center', minHeight: '500px', padding: '40px 32px', background: '#1B3A5C'}}>

        {/* Left column - text */}
        <div style={{flex: '0 0 55%', paddingRight: '40px'}}>
          <div className="inline-flex items-center gap-2 bg-[#00ADA9]/20 border border-[#00ADA9]/30 text-[#00ADA9] text-xs font-bold px-4 py-2 rounded-full uppercase tracking-widest mb-8">
            <span className="w-1.5 h-1.5 bg-[#00ADA9] rounded-full"></span>
            Powered by PEOPLElogy
          </div>

          <h1 className="text-5xl md:text-6xl font-extrabold text-white leading-tight mb-6">
            AI Readiness<br />
            <span className="text-[#00ADA9]">Assessment</span>
          </h1>

          <p className="text-white/70 text-lg mb-8 leading-relaxed">
            Discover where you and your organisation stand on AI adoption.<br />
            Get your personal report instantly.
          </p>

          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white/90 text-sm font-medium px-5 py-2.5 rounded-full">
            <svg className="w-4 h-4 text-[#00ADA9]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Open Day JB · 5 May 2026 · Johor Bahru
          </div>
        </div>

        {/* Right column - neural network */}
        <div style={{flex: '0 0 45%', display: 'flex', justifyContent: 'center', alignItems: 'center'}} className="hidden-mobile">
          <svg viewBox="0 0 400 500" width="400" height="500" xmlns="http://www.w3.org/2000/svg">
            <style>{`
              @keyframes pulse { 0%{transform:scale(1)} 100%{transform:scale(1.15)} }
              @keyframes glow { 0%{opacity:0.2} 100%{opacity:0.6} }
              @keyframes float1 { 0%{transform:translateY(0)} 100%{transform:translateY(-500px)} }
              @keyframes travel { 0%{stroke-dashoffset:200} 100%{stroke-dashoffset:0} }
            `}</style>

            {/* Background connections */}
            <line x1="200" y1="250" x2="80" y2="120" stroke="rgba(0,173,169,0.3)" strokeWidth="1"/>
            <line x1="200" y1="250" x2="320" y2="100" stroke="rgba(0,173,169,0.3)" strokeWidth="1"/>
            <line x1="200" y1="250" x2="350" y2="300" stroke="rgba(0,173,169,0.3)" strokeWidth="1"/>
            <line x1="200" y1="250" x2="80" y2="380" stroke="rgba(0,173,169,0.3)" strokeWidth="1"/>
            <line x1="200" y1="250" x2="200" y2="80" stroke="rgba(0,173,169,0.3)" strokeWidth="1"/>
            <line x1="80" y1="120" x2="200" y2="80" stroke="rgba(0,173,169,0.2)" strokeWidth="1"/>
            <line x1="320" y1="100" x2="200" y2="80" stroke="rgba(0,173,169,0.2)" strokeWidth="1"/>
            <line x1="350" y1="300" x2="320" y2="400" stroke="rgba(0,173,169,0.2)" strokeWidth="1"/>
            <line x1="80" y1="380" x2="150" y2="450" stroke="rgba(0,173,169,0.2)" strokeWidth="1"/>
            <line x1="80" y1="120" x2="50" y2="250" stroke="rgba(0,173,169,0.2)" strokeWidth="1"/>
            <line x1="50" y1="250" x2="80" y2="380" stroke="rgba(0,173,169,0.2)" strokeWidth="1"/>
            <line x1="320" y1="100" x2="370" y2="180" stroke="rgba(0,173,169,0.2)" strokeWidth="1"/>
            <line x1="370" y1="180" x2="350" y2="300" stroke="rgba(0,173,169,0.2)" strokeWidth="1"/>

            {/* Highlighted connections from hub */}
            <line x1="200" y1="250" x2="80" y2="120" stroke="rgba(0,173,169,0.9)" strokeWidth="1.5" strokeDasharray="8 4" style={{animation:'travel 3s linear infinite'}}/>
            <line x1="200" y1="250" x2="320" y2="100" stroke="rgba(0,173,169,0.9)" strokeWidth="1.5" strokeDasharray="8 4" style={{animation:'travel 4s linear infinite'}}/>
            <line x1="200" y1="250" x2="350" y2="300" stroke="rgba(0,173,169,0.9)" strokeWidth="1.5" strokeDasharray="8 4" style={{animation:'travel 2.5s linear infinite'}}/>
            <line x1="200" y1="250" x2="80" y2="380" stroke="rgba(0,173,169,0.9)" strokeWidth="1.5" strokeDasharray="8 4" style={{animation:'travel 3.5s linear infinite'}}/>
            <line x1="200" y1="250" x2="200" y2="80" stroke="rgba(0,173,169,0.9)" strokeWidth="1.5" strokeDasharray="8 4" style={{animation:'travel 2s linear infinite'}}/>

            {/* Central hub glow rings */}
            <circle cx="200" cy="250" r="42" fill="none" stroke="rgba(0,173,169,0.1)" strokeWidth="1" style={{animation:'glow 2s ease-in-out infinite alternate'}}/>
            <circle cx="200" cy="250" r="32" fill="none" stroke="rgba(0,173,169,0.2)" strokeWidth="1" style={{animation:'glow 2s ease-in-out infinite alternate', animationDelay:'0.3s'}}/>
            <circle cx="200" cy="250" r="24" fill="none" stroke="rgba(0,173,169,0.4)" strokeWidth="1" style={{animation:'glow 2s ease-in-out infinite alternate', animationDelay:'0.6s'}}/>

            {/* Central hub */}
            <circle cx="200" cy="250" r="18" fill="#00ADA9" style={{animation:'pulse 2s ease-in-out infinite alternate'}}/>

            {/* Outer nodes with glow */}
            <circle cx="80" cy="120" r="14" fill="rgba(0,173,169,0.15)"/>
            <circle cx="80" cy="120" r="10" fill="#00ADA9" style={{animation:'pulse 1.5s ease-in-out infinite alternate', animationDelay:'0.2s'}}/>

            <circle cx="320" cy="100" r="14" fill="rgba(0,173,169,0.15)"/>
            <circle cx="320" cy="100" r="10" fill="#5DCAA5" style={{animation:'pulse 1.5s ease-in-out infinite alternate', animationDelay:'0.8s'}}/>

            <circle cx="350" cy="300" r="14" fill="rgba(0,173,169,0.15)"/>
            <circle cx="350" cy="300" r="10" fill="#00ADA9" style={{animation:'pulse 1.5s ease-in-out infinite alternate', animationDelay:'1.4s'}}/>

            <circle cx="80" cy="380" r="14" fill="rgba(0,173,169,0.15)"/>
            <circle cx="80" cy="380" r="10" fill="#5DCAA5" style={{animation:'pulse 1.5s ease-in-out infinite alternate', animationDelay:'0.5s'}}/>

            <circle cx="200" cy="80" r="14" fill="rgba(0,173,169,0.15)"/>
            <circle cx="200" cy="80" r="10" fill="#00ADA9" style={{animation:'pulse 1.5s ease-in-out infinite alternate', animationDelay:'1.1s'}}/>

            {/* Small nodes */}
            <circle cx="50" cy="250" r="6" fill="rgba(255,255,255,0.7)" style={{animation:'pulse 2s ease-in-out infinite alternate', animationDelay:'0.3s'}}/>
            <circle cx="370" cy="180" r="6" fill="rgba(255,255,255,0.7)" style={{animation:'pulse 2s ease-in-out infinite alternate', animationDelay:'1.2s'}}/>
            <circle cx="320" cy="400" r="6" fill="rgba(255,255,255,0.7)" style={{animation:'pulse 2s ease-in-out infinite alternate', animationDelay:'0.7s'}}/>
            <circle cx="150" cy="450" r="6" fill="rgba(255,255,255,0.7)" style={{animation:'pulse 2s ease-in-out infinite alternate', animationDelay:'1.8s'}}/>
            <circle cx="130" cy="200" r="5" fill="rgba(93,202,165,0.8)" style={{animation:'pulse 2s ease-in-out infinite alternate', animationDelay:'0.9s'}}/>
            <circle cx="280" cy="200" r="5" fill="rgba(93,202,165,0.8)" style={{animation:'pulse 2s ease-in-out infinite alternate', animationDelay:'1.5s'}}/>
            <circle cx="260" cy="350" r="5" fill="rgba(93,202,165,0.8)" style={{animation:'pulse 2s ease-in-out infinite alternate', animationDelay:'0.4s'}}/>
            <circle cx="140" cy="330" r="5" fill="rgba(93,202,165,0.8)" style={{animation:'pulse 2s ease-in-out infinite alternate', animationDelay:'2.1s'}}/>

            {/* Floating particles */}
            <circle cx="100" cy="400" r="2" fill="rgba(255,255,255,0.4)" style={{animation:'float1 8s linear infinite'}}/>
            <circle cx="160" cy="350" r="2" fill="rgba(255,255,255,0.4)" style={{animation:'float1 10s linear infinite', animationDelay:'2s'}}/>
            <circle cx="240" cy="420" r="2" fill="rgba(255,255,255,0.4)" style={{animation:'float1 7s linear infinite', animationDelay:'4s'}}/>
            <circle cx="300" cy="380" r="2" fill="rgba(255,255,255,0.4)" style={{animation:'float1 9s linear infinite', animationDelay:'1s'}}/>
            <circle cx="340" cy="460" r="2" fill="rgba(255,255,255,0.4)" style={{animation:'float1 11s linear infinite', animationDelay:'3s'}}/>
            <circle cx="60" cy="300" r="2" fill="rgba(255,255,255,0.4)" style={{animation:'float1 6s linear infinite', animationDelay:'5s'}}/>

            {/* Pillar labels */}
            <text x="55" y="108" fontSize="9" fill="rgba(255,255,255,0.5)" textAnchor="middle">Strategy</text>
            <text x="320" y="88" fontSize="9" fill="rgba(255,255,255,0.5)" textAnchor="middle">Data</text>
            <text x="370" y="300" fontSize="9" fill="rgba(255,255,255,0.5)" textAnchor="middle">Process</text>
            <text x="65" y="395" fontSize="9" fill="rgba(255,255,255,0.5)" textAnchor="middle">People</text>
            <text x="200" y="68" fontSize="9" fill="rgba(255,255,255,0.5)" textAnchor="middle">Governance</text>
          </svg>
        </div>

      </div>

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
