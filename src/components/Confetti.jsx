import { useMemo } from 'react'

const COLOURS = ['#00ADA9', '#1B3A5C', '#ffffff', '#5DCAA5']

function rand(min, max) {
  return Math.random() * (max - min) + min
}

export default function Confetti() {
  const pieces = useMemo(() => (
    Array.from({ length: 40 }, (_, i) => ({
      id: i,
      colour: COLOURS[i % COLOURS.length],
      size: rand(6, 12),
      left: rand(0, 100),
      duration: rand(2, 4),
      delay: rand(0, 1.5),
      rotation: rand(0, 360),
      drift: rand(-60, 60),
    }))
  ), [])

  return (
    <>
      <style>{`
        @keyframes confettiFall {
          0%   { transform: translateY(-20px) rotate(0deg) translateX(0); opacity: 1; }
          80%  { opacity: 1; }
          100% { transform: translateY(100vh) rotate(var(--rot)) translateX(var(--drift)); opacity: 0; }
        }
      `}</style>
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 100,
          overflow: 'hidden',
        }}
      >
        {pieces.map(p => (
          <div
            key={p.id}
            style={{
              position: 'absolute',
              top: 0,
              left: `${p.left}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              backgroundColor: p.colour,
              borderRadius: p.id % 3 === 0 ? '50%' : '2px',
              '--rot': `${p.rotation}deg`,
              '--drift': `${p.drift}px`,
              animation: `confettiFall ${p.duration}s ${p.delay}s ease-in forwards`,
            }}
          />
        ))}
      </div>
    </>
  )
}
