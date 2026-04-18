import { useEffect, useState } from 'react'

export default function PillarCelebration({ pillarNumber, pillarName, onComplete }) {
  const [opacity, setOpacity] = useState(0)

  useEffect(() => {
    const fadeIn   = setTimeout(() => setOpacity(1), 10)
    const fadeOut  = setTimeout(() => setOpacity(0), 1200)
    const complete = setTimeout(() => onComplete?.(), 1500)
    return () => {
      clearTimeout(fadeIn)
      clearTimeout(fadeOut)
      clearTimeout(complete)
    }
  }, [onComplete])

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(27, 58, 92, 0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 50,
        opacity,
        transition: 'opacity 0.3s ease',
        pointerEvents: 'none',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <svg width="88" height="88" viewBox="0 0 88 88" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="44" cy="44" r="42" stroke="#00ADA9" strokeWidth="3" fill="none" />
          <path
            d="M26 44l13 13 24-26"
            stroke="#00ADA9"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <p style={{ color: '#ffffff', fontSize: '1.375rem', fontWeight: '700', marginTop: '1rem', marginBottom: '0.375rem' }}>
          Pillar {pillarNumber} Complete
        </p>
        <p style={{ color: '#00ADA9', fontSize: '1rem' }}>
          {pillarName}
        </p>
      </div>
    </div>
  )
}
