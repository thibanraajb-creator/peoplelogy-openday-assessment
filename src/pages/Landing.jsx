import { useNavigate } from 'react-router-dom'
import Logo from '../components/Logo'

function NeuralNetwork() {
  return (
    <svg viewBox="0 0 400 500" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style={{maxWidth:'420px'}}>
      <defs>
        <style>{`
          @keyframes pulse { 0%{transform:scale(1);} 100%{transform:scale(1.18);} }
          @keyframes pulseHub { 0%{transform:scale(1);} 100%{transform:scale(1.1);} }
          @keyframes glow { 0%{opacity:0.15;} 100%{opacity:0.55;} }
          @keyframes travel { 0%{stroke-dashoffset:200;} 100%{stroke-dashoffset:0;} }
          @keyframes floatUp { 0%{transform:translateY(0px) translateX(0px);opacity:0.5;} 50%{transform:translateY(-250px) translateX(8px);opacity:0.3;} 100%{transform:translateY(-500px) translateX(0px);opacity:0;} }
        `}</style>
      </defs>

      {/* Background connections */}
      <line x1="200" y1="250" x2="75" y2="115" stroke="rgba(0,173,169,0.25)" strokeWidth="1"/>
      <line x1="200" y1="250" x2="325" y2="95" stroke="rgba(0,173,169,0.25)" strokeWidth="1"/>
      <line x1="200" y1="250" x2="355" y2="305" stroke="rgba(0,173,169,0.25)" strokeWidth="1"/>
      <line x1="200" y1="250" x2="75" y2="385" stroke="rgba(0,173,169,0.25)" strokeWidth="1"/>
      <line x1="200" y1="250" x2="200" y2="75" stroke="rgba(0,173,169,0.25)" strokeWidth="1"/>
      <line x1="75" y1="115" x2="200" y2="75" stroke="rgba(0,173,169,0.15)" strokeWidth="1"/>
      <line x1="325" y1="95" x2="200" y2="75" stroke="rgba(0,173,169,0.15)" strokeWidth="1"/>
      <line x1="355" y1="305" x2="325" y2="410" stroke="rgba(0,173,169,0.15)" strokeWidth="1"/>
      <line x1="75" y1="385" x2="150" y2="455" stroke="rgba(0,173,169,0.15)" strokeWidth="1"/>
      <line x1="75" y1="115" x2="45" y2="255" stroke="rgba(0,173,169,0.15)" strokeWidth="1"/>
      <line x1="45" y1="255" x2="75" y2="385" stroke="rgba(0,173,169,0.15)" strokeWidth="1"/>
      <line x1="325" y1="95" x2="375" y2="185" stroke="rgba(0,173,169,0.15)" strokeWidth="1"/>
      <line x1="375" y1="185" x2="355" y2="305" stroke="rgba(0,173,169,0.15)" strokeWidth="1"/>
      <line x1="130" y1="205" x2="75" y2="115" stroke="rgba(0,173,169,0.12)" strokeWidth="1"/>
      <line x1="130" y1="205" x2="200" y2="250" stroke="rgba(0,173,169,0.12)" strokeWidth="1"/>
      <line x1="275" y1="205" x2="325" y2="95" stroke="rgba(0,173,169,0.12)" strokeWidth="1"/>
      <line x1="275" y1="205" x2="200" y2="250" stroke="rgba(0,173,169,0.12)" strokeWidth="1"/>
      <line x1="260" y1="355" x2="355" y2="305" stroke="rgba(0,173,169,0.12)" strokeWidth="1"/>
      <line x1="260" y1="355" x2="200" y2="250" stroke="rgba(0,173,169,0.12)" strokeWidth="1"/>
      <line x1="140" y1="335" x2="75" y2="385" stroke="rgba(0,173,169,0.12)" strokeWidth="1"/>
      <line x1="140" y1="335" x2="200" y2="250" stroke="rgba(0,173,169,0.12)" strokeWidth="1"/>

      {/* Animated highlighted connections from hub */}
      <line x1="200" y1="250" x2="75" y2="115" stroke="rgba(0,173,169,0.85)" strokeWidth="1.5" strokeDasharray="10 5" style={{animation:'travel 3s linear infinite'}}/>
      <line x1="200" y1="250" x2="325" y2="95" stroke="rgba(0,173,169,0.85)" strokeWidth="1.5" strokeDasharray="10 5" style={{animation:'travel 4s linear infinite'}}/>
      <line x1="200" y1="250" x2="355" y2="305" stroke="rgba(0,173,169,0.85)" strokeWidth="1.5" strokeDasharray="10 5" style={{animation:'travel 2.5s linear infinite'}}/>
      <line x1="200" y1="250" x2="75" y2="385" stroke="rgba(0,173,169,0.85)" strokeWidth="1.5" strokeDasharray="10 5" style={{animation:'travel 3.5s linear infinite'}}/>
      <line x1="200" y1="250" x2="200" y2="75" stroke="rgba(0,173,169,0.85)" strokeWidth="1.5" strokeDasharray="10 5" style={{animation:'travel 2s linear infinite'}}/>

      {/* Central hub glow rings */}
      <circle cx="200" cy="250" r="44" fill="none" stroke="rgba(0,173,169,0.08)" strokeWidth="1" style={{animation:'glow 2.5s ease-in-out infinite alternate'}}/>
      <circle cx="200" cy="250" r="34" fill="none" stroke="rgba(0,173,169,0.15)" strokeWidth="1" style={{animation:'glow 2.5s ease-in-out infinite alternate',animationDelay:'0.4s'}}/>
      <circle cx="200" cy="250" r="25" fill="none" stroke="rgba(0,173,169,0.3)" strokeWidth="1" style={{animation:'glow 2.5s ease-in-out infinite alternate',animationDelay:'0.8s'}}/>

      {/* Central hub */}
      <circle cx="200" cy="250" r="18" fill="#00ADA9" style={{animation:'pulseHub 2.5s ease-in-out infinite alternate',transformOrigin:'200px 250px'}}/>
      <circle cx="200" cy="250" r="10" fill="rgba(255,255,255,0.3)"/>

      {/* Main nodes with glow rings */}
      {/* Strategy - top left */}
      <circle cx="75" cy="115" r="15" fill="rgba(0,173,169,0.12)" style={{animation:'glow 2s ease-in-out infinite alternate'}}/>
      <circle cx="75" cy="115" r="11" fill="#00ADA9" style={{animation:'pulse 1.8s ease-in-out infinite alternate',transformOrigin:'75px 115px',animationDelay:'0.2s'}}/>
      <text x="75" y="95" fontSize="9" fill="rgba(255,255,255,0.55)" textAnchor="middle" fontFamily="sans-serif">Strategy</text>

      {/* Data - top right */}
      <circle cx="325" cy="95" r="15" fill="rgba(93,202,165,0.12)" style={{animation:'glow 2s ease-in-out infinite alternate',animationDelay:'0.5s'}}/>
      <circle cx="325" cy="95" r="11" fill="#5DCAA5" style={{animation:'pulse 1.8s ease-in-out infinite alternate',transformOrigin:'325px 95px',animationDelay:'0.8s'}}/>
      <text x="325" y="75" fontSize="9" fill="rgba(255,255,255,0.55)" textAnchor="middle" fontFamily="sans-serif">Data</text>

      {/* Process - right */}
      <circle cx="355" cy="305" r="15" fill="rgba(0,173,169,0.12)" style={{animation:'glow 2s ease-in-out infinite alternate',animationDelay:'1s'}}/>
      <circle cx="355" cy="305" r="11" fill="#00ADA9" style={{animation:'pulse 1.8s ease-in-out infinite alternate',transformOrigin:'355px 305px',animationDelay:'1.4s'}}/>
      <text x="375" y="308" fontSize="9" fill="rgba(255,255,255,0.55)" textAnchor="start" fontFamily="sans-serif">Process</text>

      {/* People - bottom left */}
      <circle cx="75" cy="385" r="15" fill="rgba(93,202,165,0.12)" style={{animation:'glow 2s ease-in-out infinite alternate',animationDelay:'0.3s'}}/>
      <circle cx="75" cy="385" r="11" fill="#5DCAA5" style={{animation:'pulse 1.8s ease-in-out infinite alternate',transformOrigin:'75px 385px',animationDelay:'0.5s'}}/>
      <text x="75" y="408" fontSize="9" fill="rgba(255,255,255,0.55)" textAnchor="middle" fontFamily="sans-serif">People</text>

      {/* Governance - top */}
      <circle cx="200" cy="75" r="15" fill="rgba(0,173,169,0.12)" style={{animation:'glow 2s ease-in-out infinite alternate',animationDelay:'1.2s'}}/>
      <circle cx="200" cy="75" r="11" fill="#00ADA9" style={{animation:'pulse 1.8s ease-in-out infinite alternate',transformOrigin:'200px 75px',animationDelay:'1.6s'}}/>
      <text x="200" y="55" fontSize="9" fill="rgba(255,255,255,0.55)" textAnchor="middle" fontFamily="sans-serif">Governance</text>

      {/* Small secondary nodes */}
      <circle cx="45" cy="255" r="6" fill="rgba(255,255,255,0.6)" style={{animation:'pulse 2.2s ease-in-out infinite alternate',transformOrigin:'45px 255px',animationDelay:'0.4s'}}/>
      <circle cx="375" cy="185" r="6" fill="rgba(255,255,255,0.6)" style={{animation:'pulse 2.2s ease-in-out infinite alternate',transformOrigin:'375px 185px',animationDelay:'1.1s'}}/>
      <circle cx="325" cy="410" r="6" fill="rgba(255,255,255,0.6)" style={{animation:'pulse 2.2s ease-in-out infinite alternate',transformOrigin:'325px 410px',animationDelay:'0.7s'}}/>
      <circle cx="150" cy="455" r="6" fill="rgba(255,255,255,0.6)" style={{animation:'pulse 2.2s ease-in-out infinite alternate',transformOrigin:'150px 455px',animationDelay:'1.8s'}}/>
      <circle cx="130" cy="205" r="5" fill="rgba(93,202,165,0.8)" style={{animation:'pulse 2s ease-in-out infinite alternate',transformOrigin:'130px 205px',animationDelay:'0.9s'}}/>
      <circle cx="275" cy="205" r="5" fill="rgba(93,202,165,0.8)" style={{animation:'pulse 2s ease-in-out infinite alternate',transformOrigin:'275px 205px',animationDelay:'1.5s'}}/>
      <circle cx="260" cy="355" r="5" fill="rgba(93,202,165,0.8)" style={{animation:'pulse 2s ease-in-out infinite alternate',transformOrigin:'260px 355px',animationDelay:'0.4s'}}/>
      <circle cx="140" cy="335" r="5" fill="rgba(93,202,165,0.8)" style={{animation:'pulse 2s ease-in-out infinite alternate',transformOrigin:'140px 335px',animationDelay:'2s'}}/>

      {/* Floating particles */}
      <circle cx="95" cy="430" r="2" fill="rgba(255,255,255,0.45)" style={{animation:'floatUp 8s linear infinite'}}/>
      <circle cx="155" cy="400" r="2" fill="rgba(255,255,255,0.35)" style={{animation:'floatUp 10s linear infinite',animationDelay:'2s'}}/>
      <circle cx="235" cy="445" r="2" fill="rgba(255,255,255,0.45)" style={{animation:'floatUp 7s linear infinite',animationDelay:'4s'}}/>
      <circle cx="295" cy="420" r="2" fill="rgba(255,255,255,0.35)" style={{animation:'floatUp 9s linear infinite',animationDelay:'1s'}}/>
      <circle cx="345" cy="460" r="2" fill="rgba(255,255,255,0.4)" style={{animation:'floatUp 11s linear infinite',animationDelay:'3s'}}/>
      <circle cx="55" cy="340" r="2" fill="rgba(255,255,255,0.35)" style={{animation:'floatUp 6s linear infinite',animationDelay:'5s'}}/>
      <circle cx="180" cy="410" r="2" fill="rgba(0,173,169,0.6)" style={{animation:'floatUp 9s linear infinite',animationDelay:'1.5s'}}/>
      <circle cx="310" cy="370" r="2" fill="rgba(0,173,169,0.6)" style={{animation:'floatUp 7.5s linear infinite',animationDelay:'3.5s'}}/>
      <circle cx="120" cy="460" r="2" fill="rgba(93,202,165,0.5)" style={{animation:'floatUp 12s linear infinite',animationDelay:'0.5s'}}/>
    </svg>
  )
}

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

      {/* Hero — two column layout */}
      <section className="max-w-6xl mx-auto px-6 pt-8 pb-8">
        <div className="flex items-center gap-8">

          {/* Left column — text */}
          <div className="flex-1 text-left">
            <div className="inline-flex items-center gap-2 bg-[#00ADA9]/20 border border-[#00ADA9]/30 text-[#00ADA9] text-xs font-bold px-4 py-2 rounded-full uppercase tracking-widest mb-8">
              <span className="w-1.5 h-1.5 bg-[#00ADA9] rounded-full"></span>
              Powered by PEOPLElogy
            </div>

            <h1 className="text-5xl md:text-6xl font-extrabold text-white leading-tight mb-6">
              AI Readiness<br />
              <span className="text-[#00ADA9]">Assessment</span>
            </h1>

            <p className="text-white/70 text-lg max-w-xl mb-8 leading-relaxed">
              Discover where you and your organisation stand on AI adoption.
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

          {/* Right column — neural network */}
          <div className="hidden md:flex flex-shrink-0 items-center justify-center" style={{width:'380px',height:'420px'}}>
            <NeuralNetwork />
          </div>

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
            time="~10 minutes · 25 questions"
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
            time="~8 minutes · 15 questions"
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
            time="~18 minutes · 40 questions"
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
