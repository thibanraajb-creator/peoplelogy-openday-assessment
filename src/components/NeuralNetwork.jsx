export default function NeuralNetwork() {
  return (
    <svg viewBox="0 0 500 500" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style={{ maxWidth: '480px', maxHeight: '480px' }}>
      <defs>
        <style>{`
          @keyframes radarSpin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          @keyframes ringPulse1 {
            0% { opacity: 0.08; r: 60; }
            50% { opacity: 0.18; r: 65; }
            100% { opacity: 0.08; r: 60; }
          }
          @keyframes ringPulse2 {
            0% { opacity: 0.06; r: 120; }
            50% { opacity: 0.14; r: 125; }
            100% { opacity: 0.06; r: 120; }
          }
          @keyframes ringPulse3 {
            0% { opacity: 0.05; r: 180; }
            50% { opacity: 0.12; r: 185; }
            100% { opacity: 0.05; r: 180; }
          }
          @keyframes ringPulse4 {
            0% { opacity: 0.04; r: 220; }
            50% { opacity: 0.09; r: 225; }
            100% { opacity: 0.04; r: 220; }
          }
          @keyframes sonarPing {
            0% { r: 0; opacity: 0.6; }
            100% { r: 230; opacity: 0; }
          }
          @keyframes sonarPing2 {
            0% { r: 0; opacity: 0.4; }
            100% { r: 230; opacity: 0; }
          }
          @keyframes dotPulse {
            0% { opacity: 0.4; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.3); }
            100% { opacity: 0.4; transform: scale(1); }
          }
          @keyframes labelFade {
            0% { opacity: 0.3; }
            50% { opacity: 0.8; }
            100% { opacity: 0.3; }
          }
          @keyframes sweepFade {
            0% { opacity: 0.7; }
            60% { opacity: 0.15; }
            100% { opacity: 0; }
          }
          @keyframes centrePulse {
            0% { r: 12; opacity: 1; }
            50% { r: 16; opacity: 0.8; }
            100% { r: 12; opacity: 1; }
          }
          @keyframes centreGlow {
            0% { r: 28; opacity: 0.15; }
            50% { r: 36; opacity: 0.35; }
            100% { r: 28; opacity: 0.15; }
          }
          .radar-sweep {
            transform-origin: 250px 250px;
            animation: radarSpin 4s linear infinite;
          }
          .sonar1 {
            transform-origin: 250px 250px;
            animation: sonarPing 4s ease-out infinite;
          }
          .sonar2 {
            transform-origin: 250px 250px;
            animation: sonarPing2 4s ease-out infinite;
            animation-delay: 2s;
          }
        `}</style>

        <radialGradient id="sweepGrad" cx="0%" cy="50%" r="100%">
          <stop offset="0%" stopColor="#00ADA9" stopOpacity="0.6"/>
          <stop offset="100%" stopColor="#00ADA9" stopOpacity="0"/>
        </radialGradient>

        <radialGradient id="centreGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#00ADA9" stopOpacity="1"/>
          <stop offset="100%" stopColor="#00ADA9" stopOpacity="0.4"/>
        </radialGradient>

        <radialGradient id="bgGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#00ADA9" stopOpacity="0.06"/>
          <stop offset="100%" stopColor="#00ADA9" stopOpacity="0"/>
        </radialGradient>

        <clipPath id="radarClip">
          <circle cx="250" cy="250" r="230"/>
        </clipPath>
      </defs>

      {/* Background glow */}
      <circle cx="250" cy="250" r="230" fill="url(#bgGlow)"/>

      {/* Outer boundary circle */}
      <circle cx="250" cy="250" r="228" fill="none" stroke="rgba(0,173,169,0.15)" strokeWidth="1"/>

      {/* Radar rings — static */}
      <circle cx="250" cy="250" r="60" fill="none" stroke="rgba(0,173,169,0.2)" strokeWidth="0.8" strokeDasharray="4 3"/>
      <circle cx="250" cy="250" r="120" fill="none" stroke="rgba(0,173,169,0.15)" strokeWidth="0.8" strokeDasharray="4 3"/>
      <circle cx="250" cy="250" r="180" fill="none" stroke="rgba(0,173,169,0.1)" strokeWidth="0.8" strokeDasharray="4 3"/>
      <circle cx="250" cy="250" r="228" fill="none" stroke="rgba(0,173,169,0.08)" strokeWidth="0.8"/>

      {/* Pulsing rings */}
      <circle cx="250" cy="250" r="60" fill="rgba(0,173,169,0.08)" stroke="none" style={{animation:'ringPulse1 3s ease-in-out infinite'}}/>
      <circle cx="250" cy="250" r="120" fill="rgba(0,173,169,0.05)" stroke="none" style={{animation:'ringPulse2 3s ease-in-out infinite', animationDelay:'0.5s'}}/>
      <circle cx="250" cy="250" r="180" fill="rgba(0,173,169,0.03)" stroke="none" style={{animation:'ringPulse3 3s ease-in-out infinite', animationDelay:'1s'}}/>

      {/* Cross hairs */}
      <line x1="250" y1="22" x2="250" y2="478" stroke="rgba(0,173,169,0.08)" strokeWidth="0.8"/>
      <line x1="22" y1="250" x2="478" y2="250" stroke="rgba(0,173,169,0.08)" strokeWidth="0.8"/>
      <line x1="88" y1="88" x2="412" y2="412" stroke="rgba(0,173,169,0.05)" strokeWidth="0.8"/>
      <line x1="412" y1="88" x2="88" y2="412" stroke="rgba(0,173,169,0.05)" strokeWidth="0.8"/>

      {/* Sonar ping circles */}
      <circle cx="250" cy="250" r="0" fill="none" stroke="rgba(0,173,169,0.5)" strokeWidth="2" className="sonar1"/>
      <circle cx="250" cy="250" r="0" fill="none" stroke="rgba(0,173,169,0.3)" strokeWidth="1.5" className="sonar2"/>

      {/* Radar sweep — clipped to circle */}
      <g clipPath="url(#radarClip)">
        <g className="radar-sweep">
          <path
            d="M250,250 L480,250 A230,230 0 0,0 250,20 Z"
            fill="url(#sweepGrad)"
            style={{animation:'sweepFade 4s linear infinite'}}
          />
          {/* Sweep leading edge */}
          <line x1="250" y1="250" x2="480" y2="250" stroke="rgba(0,173,169,0.9)" strokeWidth="1.5"/>
        </g>
      </g>

      {/* Pillar dots on ring intersections */}
      {/* Strategy — top */}
      <g style={{animation:'dotPulse 2.5s ease-in-out infinite', transformOrigin:'250px 70px'}}>
        <circle cx="250" cy="70" r="6" fill="#00ADA9" opacity="0.9"/>
        <circle cx="250" cy="70" r="12" fill="rgba(0,173,169,0.2)" stroke="rgba(0,173,169,0.4)" strokeWidth="0.8"/>
      </g>
      <text x="250" y="48" textAnchor="middle" fontSize="11" fontFamily="Inter,sans-serif" fontWeight="600" fill="rgba(255,255,255,0.7)" style={{animation:'labelFade 2.5s ease-in-out infinite'}}>Strategy</text>

      {/* Data — top right */}
      <g style={{animation:'dotPulse 2.5s ease-in-out infinite', animationDelay:'0.5s', transformOrigin:'410px 140px'}}>
        <circle cx="410" cy="140" r="6" fill="#5DCAA5" opacity="0.9"/>
        <circle cx="410" cy="140" r="12" fill="rgba(93,202,165,0.2)" stroke="rgba(93,202,165,0.4)" strokeWidth="0.8"/>
      </g>
      <text x="432" y="144" textAnchor="start" fontSize="11" fontFamily="Inter,sans-serif" fontWeight="600" fill="rgba(255,255,255,0.7)" style={{animation:'labelFade 2.5s ease-in-out infinite', animationDelay:'0.5s'}}>Data</text>

      {/* Process — bottom right */}
      <g style={{animation:'dotPulse 2.5s ease-in-out infinite', animationDelay:'1s', transformOrigin:'400px 370px'}}>
        <circle cx="400" cy="370" r="6" fill="#00ADA9" opacity="0.9"/>
        <circle cx="400" cy="370" r="12" fill="rgba(0,173,169,0.2)" stroke="rgba(0,173,169,0.4)" strokeWidth="0.8"/>
      </g>
      <text x="416" y="374" textAnchor="start" fontSize="11" fontFamily="Inter,sans-serif" fontWeight="600" fill="rgba(255,255,255,0.7)" style={{animation:'labelFade 2.5s ease-in-out infinite', animationDelay:'1s'}}>Process</text>

      {/* People — bottom left */}
      <g style={{animation:'dotPulse 2.5s ease-in-out infinite', animationDelay:'1.5s', transformOrigin:'100px 370px'}}>
        <circle cx="100" cy="370" r="6" fill="#5DCAA5" opacity="0.9"/>
        <circle cx="100" cy="370" r="12" fill="rgba(93,202,165,0.2)" stroke="rgba(93,202,165,0.4)" strokeWidth="0.8"/>
      </g>
      <text x="84" y="374" textAnchor="end" fontSize="11" fontFamily="Inter,sans-serif" fontWeight="600" fill="rgba(255,255,255,0.7)" style={{animation:'labelFade 2.5s ease-in-out infinite', animationDelay:'1.5s'}}>People</text>

      {/* Governance — top left */}
      <g style={{animation:'dotPulse 2.5s ease-in-out infinite', animationDelay:'2s', transformOrigin:'90px 140px'}}>
        <circle cx="90" cy="140" r="6" fill="#00ADA9" opacity="0.9"/>
        <circle cx="90" cy="140" r="12" fill="rgba(0,173,169,0.2)" stroke="rgba(0,173,169,0.4)" strokeWidth="0.8"/>
      </g>
      <text x="74" y="130" textAnchor="end" fontSize="11" fontFamily="Inter,sans-serif" fontWeight="600" fill="rgba(255,255,255,0.7)" style={{animation:'labelFade 2.5s ease-in-out infinite', animationDelay:'2s'}}>Governance</text>

      {/* Secondary dots — scattered on rings */}
      <circle cx="250" cy="130" r="3" fill="rgba(0,173,169,0.5)" style={{animation:'dotPulse 3s ease-in-out infinite', animationDelay:'0.3s'}}/>
      <circle cx="358" cy="184" r="3" fill="rgba(255,255,255,0.4)" style={{animation:'dotPulse 3s ease-in-out infinite', animationDelay:'0.8s'}}/>
      <circle cx="358" cy="316" r="3" fill="rgba(0,173,169,0.5)" style={{animation:'dotPulse 3s ease-in-out infinite', animationDelay:'1.3s'}}/>
      <circle cx="250" cy="370" r="3" fill="rgba(255,255,255,0.4)" style={{animation:'dotPulse 3s ease-in-out infinite', animationDelay:'1.8s'}}/>
      <circle cx="142" cy="316" r="3" fill="rgba(0,173,169,0.5)" style={{animation:'dotPulse 3s ease-in-out infinite', animationDelay:'2.3s'}}/>
      <circle cx="142" cy="184" r="3" fill="rgba(255,255,255,0.4)" style={{animation:'dotPulse 3s ease-in-out infinite', animationDelay:'2.8s'}}/>

      {/* Inner ring dots */}
      <circle cx="250" cy="190" r="2.5" fill="rgba(0,173,169,0.6)" style={{animation:'dotPulse 2s ease-in-out infinite', animationDelay:'0.4s'}}/>
      <circle cx="310" cy="250" r="2.5" fill="rgba(255,255,255,0.5)" style={{animation:'dotPulse 2s ease-in-out infinite', animationDelay:'1s'}}/>
      <circle cx="250" cy="310" r="2.5" fill="rgba(0,173,169,0.6)" style={{animation:'dotPulse 2s ease-in-out infinite', animationDelay:'1.6s'}}/>
      <circle cx="190" cy="250" r="2.5" fill="rgba(255,255,255,0.5)" style={{animation:'dotPulse 2s ease-in-out infinite', animationDelay:'0.7s'}}/>

      {/* Centre hub */}
      <circle cx="250" cy="250" r="30" fill="rgba(0,173,169,0.12)" style={{animation:'centreGlow 2s ease-in-out infinite'}}/>
      <circle cx="250" cy="250" r="18" fill="rgba(0,173,169,0.2)" stroke="rgba(0,173,169,0.5)" strokeWidth="1"/>
      <circle cx="250" cy="250" r="10" fill="url(#centreGrad)" style={{animation:'centrePulse 2s ease-in-out infinite'}}/>
      <circle cx="247" cy="247" r="3" fill="rgba(255,255,255,0.8)"/>

      {/* Tick marks on outer ring */}
      {Array.from({length: 36}).map((_, i) => {
        const angle = (i * 10 * Math.PI) / 180
        const inner = 222
        const outer = i % 9 === 0 ? 210 : 216
        const x1 = 250 + inner * Math.cos(angle)
        const y1 = 250 + inner * Math.sin(angle)
        const x2 = 250 + outer * Math.cos(angle)
        const y2 = 250 + outer * Math.sin(angle)
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={i % 9 === 0 ? 'rgba(0,173,169,0.5)' : 'rgba(0,173,169,0.2)'} strokeWidth={i % 9 === 0 ? 1.5 : 0.8}/>
      })}
    </svg>
  )
}
