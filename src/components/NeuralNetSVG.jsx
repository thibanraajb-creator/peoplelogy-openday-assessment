const NODES = [
  { x: 200, y: 250, r: 18, color: '#00ADA9',               delay: 0.0, dur: 3.0 }, // 0 hub
  { x: 85,  y: 108, r: 12, color: '#00ADA9',               delay: 0.3, dur: 2.2 }, // 1 Strategy
  { x: 318, y: 82,  r: 12, color: '#5DCAA5',               delay: 0.8, dur: 2.4 }, // 2 Data
  { x: 58,  y: 345, r: 12, color: '#00ADA9',               delay: 1.5, dur: 1.9 }, // 3 People
  { x: 342, y: 372, r: 12, color: '#5DCAA5',               delay: 2.0, dur: 2.1 }, // 4 Process
  { x: 197, y: 455, r: 12, color: '#00ADA9',               delay: 2.5, dur: 2.3 }, // 5 Governance
  { x: 143, y: 178, r: 8,  color: 'rgba(255,255,255,0.8)', delay: 0.5, dur: 1.8 }, // 6
  { x: 278, y: 155, r: 8,  color: 'rgba(255,255,255,0.8)', delay: 1.0, dur: 2.0 }, // 7
  { x: 117, y: 308, r: 8,  color: 'rgba(255,255,255,0.8)', delay: 1.8, dur: 1.7 }, // 8
  { x: 303, y: 318, r: 8,  color: 'rgba(255,255,255,0.8)', delay: 2.2, dur: 2.4 }, // 9
  { x: 218, y: 378, r: 8,  color: 'rgba(255,255,255,0.8)', delay: 2.8, dur: 1.9 }, // 10
  { x: 45,  y: 215, r: 5,  color: '#5DCAA5',               delay: 0.2, dur: 1.6 }, // 11
  { x: 362, y: 237, r: 5,  color: '#00ADA9',               delay: 0.9, dur: 2.1 }, // 12
  { x: 173, y: 62,  r: 5,  color: 'rgba(255,255,255,0.8)', delay: 1.3, dur: 1.8 }, // 13
  { x: 327, y: 197, r: 5,  color: '#5DCAA5',               delay: 1.7, dur: 2.0 }, // 14
  { x: 78,  y: 428, r: 5,  color: 'rgba(255,255,255,0.8)', delay: 2.1, dur: 1.9 }, // 15
  { x: 372, y: 128, r: 5,  color: '#00ADA9',               delay: 2.4, dur: 2.2 }, // 16
  { x: 28,  y: 278, r: 5,  color: 'rgba(255,255,255,0.8)', delay: 1.1, dur: 1.7 }, // 17
  { x: 253, y: 42,  r: 5,  color: '#5DCAA5',               delay: 0.6, dur: 2.3 }, // 18
  { x: 148, y: 447, r: 5,  color: 'rgba(255,255,255,0.8)', delay: 2.9, dur: 1.8 }, // 19
]

const CONNECTIONS = [
  // 5 highlighted from hub
  { a: 0, b: 1,  hl: true,  dur: 2.5, delay: 0.0 },
  { a: 0, b: 2,  hl: true,  dur: 3.0, delay: 0.5 },
  { a: 0, b: 3,  hl: true,  dur: 2.8, delay: 1.0 },
  { a: 0, b: 4,  hl: true,  dur: 3.2, delay: 0.3 },
  { a: 0, b: 5,  hl: true,  dur: 2.3, delay: 0.8 },
  // 23 regular
  { a: 1,  b: 6,  hl: false, dur: 2.0, delay: 0.2 },
  { a: 1,  b: 13, hl: false, dur: 2.5, delay: 0.7 },
  { a: 2,  b: 7,  hl: false, dur: 3.0, delay: 1.2 },
  { a: 2,  b: 16, hl: false, dur: 2.2, delay: 0.4 },
  { a: 2,  b: 18, hl: false, dur: 3.5, delay: 0.9 },
  { a: 3,  b: 8,  hl: false, dur: 2.8, delay: 1.5 },
  { a: 3,  b: 11, hl: false, dur: 2.1, delay: 0.6 },
  { a: 4,  b: 9,  hl: false, dur: 3.3, delay: 1.1 },
  { a: 4,  b: 14, hl: false, dur: 2.4, delay: 0.8 },
  { a: 5,  b: 10, hl: false, dur: 2.9, delay: 1.3 },
  { a: 5,  b: 15, hl: false, dur: 2.0, delay: 0.5 },
  { a: 5,  b: 19, hl: false, dur: 3.1, delay: 1.8 },
  { a: 6,  b: 8,  hl: false, dur: 2.3, delay: 0.3 },
  { a: 6,  b: 7,  hl: false, dur: 2.7, delay: 1.0 },
  { a: 7,  b: 14, hl: false, dur: 2.5, delay: 0.6 },
  { a: 8,  b: 17, hl: false, dur: 3.0, delay: 1.4 },
  { a: 9,  b: 12, hl: false, dur: 2.2, delay: 0.9 },
  { a: 10, b: 19, hl: false, dur: 2.8, delay: 1.6 },
  { a: 11, b: 17, hl: false, dur: 3.5, delay: 0.2 },
  { a: 13, b: 18, hl: false, dur: 4.0, delay: 1.1 },
  { a: 14, b: 16, hl: false, dur: 2.6, delay: 0.7 },
  { a: 15, b: 19, hl: false, dur: 3.2, delay: 1.9 },
  { a: 12, b: 9,  hl: false, dur: 2.4, delay: 0.4 },
]

const LABELS = [
  { ni: 1, text: 'Strategy',   anchor: 'middle', dx: 0,   dy: -20 },
  { ni: 2, text: 'Data',       anchor: 'middle', dx: 0,   dy: -20 },
  { ni: 3, text: 'People',     anchor: 'start',  dx: 18,  dy: 4   },
  { ni: 4, text: 'Process',    anchor: 'end',    dx: -18, dy: 4   },
  { ni: 5, text: 'Governance', anchor: 'middle', dx: 0,   dy: 24  },
]

const PARTICLES = [
  { x: 62,  y: 470, dur: 8,  delay: 0.0 },
  { x: 128, y: 485, dur: 10, delay: 1.5 },
  { x: 195, y: 460, dur: 7,  delay: 3.0 },
  { x: 270, y: 478, dur: 11, delay: 0.5 },
  { x: 338, y: 465, dur: 9,  delay: 2.0 },
  { x: 95,  y: 492, dur: 12, delay: 4.0 },
  { x: 165, y: 450, dur: 6,  delay: 1.0 },
  { x: 305, y: 480, dur: 8,  delay: 3.5 },
  { x: 372, y: 468, dur: 10, delay: 2.5 },
]

const CSS = `
  @keyframes pulse {
    from { transform: scale(1); }
    to   { transform: scale(1.15); }
  }
  @keyframes travel {
    from { stroke-dashoffset: 100; }
    to   { stroke-dashoffset: 0; }
  }
  @keyframes float {
    0%   { transform: translateY(0px);    opacity: 0; }
    12%  { opacity: 0.4; }
    88%  { opacity: 0.4; }
    100% { transform: translateY(-540px); opacity: 0; }
  }
  @keyframes glow {
    from { opacity: 0.5; }
    to   { opacity: 1; }
  }
`

export default function NeuralNetSVG() {
  const n = (i) => NODES[i]

  return (
    <svg
      viewBox="0 0 400 500"
      className="w-full h-full"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <style>{CSS}</style>

      {/* Static connection lines */}
      {CONNECTIONS.map((c, i) => (
        <line
          key={`sl-${i}`}
          x1={n(c.a).x} y1={n(c.a).y}
          x2={n(c.b).x} y2={n(c.b).y}
          stroke={c.hl ? 'rgba(0,173,169,0.8)' : 'rgba(0,173,169,0.3)'}
          strokeWidth={c.hl ? 1.5 : 1}
        />
      ))}

      {/* Hub concentric glow rings */}
      <g style={{ animation: 'glow 3s ease-in-out infinite alternate' }}>
        <circle cx={200} cy={250} r={42} fill="none" stroke="#00ADA9" strokeWidth={1}   opacity={0.10} />
        <circle cx={200} cy={250} r={32} fill="none" stroke="#00ADA9" strokeWidth={1.5} opacity={0.25} />
        <circle cx={200} cy={250} r={24} fill="none" stroke="#00ADA9" strokeWidth={2}   opacity={0.40} />
      </g>

      {/* Nodes — glow ring + filled circle, hub (i=0) skips own glow ring */}
      {NODES.map((node, i) => {
        const glowR = node.r + (node.r >= 12 ? 7 : node.r >= 8 ? 5 : 4)
        return (
          <g
            key={`node-${i}`}
            style={{
              transformBox: 'fill-box',
              transformOrigin: 'center',
              animation: `pulse ${node.dur}s ease-in-out ${node.delay}s infinite alternate`,
            }}
          >
            {i !== 0 && (
              <circle cx={node.x} cy={node.y} r={glowR} fill={node.color} opacity={0.2} />
            )}
            <circle cx={node.x} cy={node.y} r={node.r} fill={node.color} />
          </g>
        )
      })}

      {/* Pillar labels */}
      {LABELS.map((lbl, i) => (
        <text
          key={`lbl-${i}`}
          x={n(lbl.ni).x + lbl.dx}
          y={n(lbl.ni).y + lbl.dy}
          fill="rgba(255,255,255,0.5)"
          fontSize={9}
          textAnchor={lbl.anchor}
          fontFamily="system-ui, -apple-system, sans-serif"
        >
          {lbl.text}
        </text>
      ))}

      {/* Travelling bright dots along connections */}
      {CONNECTIONS.map((c, i) => (
        <path
          key={`td-${i}`}
          d={`M ${n(c.a).x} ${n(c.a).y} L ${n(c.b).x} ${n(c.b).y}`}
          fill="none"
          stroke="rgba(255,255,255,0.85)"
          strokeWidth={1.5}
          pathLength={100}
          strokeDasharray="3 97"
          style={{ animation: `travel ${c.dur}s linear ${c.delay}s infinite` }}
        />
      ))}

      {/* Floating particles drifting upward */}
      {PARTICLES.map((p, i) => (
        <circle
          key={`pt-${i}`}
          cx={p.x}
          cy={p.y}
          r={2}
          fill="rgba(255,255,255,0.4)"
          style={{ animation: `float ${p.dur}s linear ${p.delay}s infinite` }}
        />
      ))}
    </svg>
  )
}
