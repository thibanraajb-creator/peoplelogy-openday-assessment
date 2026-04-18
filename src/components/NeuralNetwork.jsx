export default function NeuralNetwork() {
  const nodes = [
    // Large (r=12)
    { id: 1,  cx: 80,  cy: 90,  r: 12, fill: '#00ADA9',               delay: '0s',   label: 'Strategy' },
    { id: 2,  cx: 330, cy: 110, r: 12, fill: '#5DCAA5',               delay: '0.5s', label: 'Data' },
    { id: 3,  cx: 60,  cy: 290, r: 12, fill: '#5DCAA5',               delay: '1s',   label: 'People' },
    { id: 4,  cx: 355, cy: 300, r: 12, fill: '#00ADA9',               delay: '1.5s', label: 'Process' },
    { id: 5,  cx: 140, cy: 440, r: 12, fill: 'rgba(255,255,255,0.8)', delay: '2s',   label: 'Governance' },
    { id: 6,  cx: 280, cy: 450, r: 12, fill: '#00ADA9',               delay: '2.5s' },
    // Medium (r=8)
    { id: 7,  cx: 170, cy: 70,  r: 8,  fill: 'rgba(255,255,255,0.8)', delay: '0.3s' },
    { id: 8,  cx: 245, cy: 60,  r: 8,  fill: '#00ADA9',               delay: '0.8s' },
    { id: 9,  cx: 50,  cy: 180, r: 8,  fill: '#5DCAA5',               delay: '1.3s' },
    { id: 10, cx: 370, cy: 200, r: 8,  fill: '#00ADA9',               delay: '1.8s' },
    { id: 11, cx: 110, cy: 380, r: 8,  fill: '#5DCAA5',               delay: '0.6s' },
    { id: 12, cx: 310, cy: 390, r: 8,  fill: 'rgba(255,255,255,0.8)', delay: '2.3s' },
    { id: 13, cx: 200, cy: 490, r: 8,  fill: '#5DCAA5',               delay: '0.9s' },
    { id: 14, cx: 270, cy: 160, r: 8,  fill: '#00ADA9',               delay: '1.6s' },
    // Small (r=5)
    { id: 15, cx: 40,  cy: 55,  r: 5,  fill: 'rgba(255,255,255,0.8)', delay: '0.2s' },
    { id: 16, cx: 385, cy: 75,  r: 5,  fill: '#00ADA9',               delay: '0.7s' },
    { id: 17, cx: 25,  cy: 410, r: 5,  fill: '#5DCAA5',               delay: '1.2s' },
    { id: 18, cx: 385, cy: 420, r: 5,  fill: 'rgba(255,255,255,0.8)', delay: '1.7s' },
    { id: 19, cx: 190, cy: 22,  r: 5,  fill: '#00ADA9',               delay: '2.2s' },
    { id: 20, cx: 130, cy: 210, r: 5,  fill: '#5DCAA5',               delay: '2.7s' },
  ]

  const bgLines = [
    [80,90,  170,70],  [80,90,  50,180],  [170,70, 245,60],  [245,60, 330,110],
    [330,110,370,200], [50,180, 60,290],  [370,200,355,300], [60,290, 110,380],
    [355,300,310,390], [110,380,140,440], [310,390,280,450], [140,440,200,490],
    [280,450,200,490], [270,160,330,110], [270,160,370,200], [40,55,  80,90],
    [385,75, 330,110], [25,410, 60,290],  [385,420,355,300], [190,22, 245,60],
  ]

  const hubLines = [
    { x2: 80,  y2: 90,  dur: '3s' },
    { x2: 330, y2: 110, dur: '2s' },
    { x2: 60,  y2: 290, dur: '4s' },
    { x2: 355, y2: 300, dur: '5s' },
    { x2: 140, y2: 440, dur: '2.5s' },
  ]

  const particles = [
    { cx: 50,  cy: 50,  dur: '8s',  delay: '0s' },
    { cx: 100, cy: 30,  dur: '6s',  delay: '1s' },
    { cx: 160, cy: 45,  dur: '10s', delay: '2s' },
    { cx: 230, cy: 20,  dur: '7s',  delay: '0.5s' },
    { cx: 290, cy: 40,  dur: '9s',  delay: '1.5s' },
    { cx: 350, cy: 25,  dur: '6.5s',delay: '3s' },
    { cx: 380, cy: 60,  dur: '11s', delay: '0.8s' },
    { cx: 20,  cy: 80,  dur: '12s', delay: '2.5s' },
    { cx: 130, cy: 35,  dur: '8.5s',delay: '1.2s' },
  ]

  return (
    <svg viewBox="0 0 400 500" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <style>{`
        @keyframes pulse {
          from { transform: scale(1); }
          to   { transform: scale(1.18); }
        }
        @keyframes glow {
          from { opacity: 0.15; }
          to   { opacity: 0.6; }
        }
        @keyframes travel {
          from { stroke-dashoffset: 200; }
          to   { stroke-dashoffset: 0; }
        }
        @keyframes floatUp {
          from { transform: translateY(0); }
          to   { transform: translateY(-500px); }
        }
        .node-pulse {
          transform-box: fill-box;
          transform-origin: center;
          animation: pulse ease-in-out infinite alternate;
        }
        .hub-ring {
          animation: glow ease-in-out infinite alternate;
        }
      `}</style>

      {/* Background connections */}
      {bgLines.map(([x1, y1, x2, y2], i) => (
        <line
          key={i}
          x1={x1} y1={y1} x2={x2} y2={y2}
          stroke="rgba(0,173,169,0.2)"
          strokeWidth="1"
        />
      ))}

      {/* Animated hub connections */}
      {hubLines.map((l, i) => (
        <line
          key={i}
          x1={200} y1={250} x2={l.x2} y2={l.y2}
          stroke="rgba(0,173,169,0.85)"
          strokeWidth="1.5"
          strokeDasharray="10 5"
          style={{
            animation: `travel ${l.dur} linear infinite`,
          }}
        />
      ))}

      {/* Non-hub nodes with glow rings */}
      {nodes.map(n => (
        <g key={n.id}>
          <circle
            cx={n.cx} cy={n.cy} r={n.r * 1.8}
            fill="none"
            stroke={n.fill}
            strokeWidth="1"
            opacity="0.15"
          />
          <circle
            className="node-pulse"
            cx={n.cx} cy={n.cy} r={n.r}
            fill={n.fill}
            style={{ animationDuration: '2s', animationDelay: n.delay }}
          />
          {n.label && (
            <text
              x={n.cx + n.r + 4}
              y={n.cy + 4}
              fontSize="9"
              fill="rgba(255,255,255,0.55)"
              fontFamily="sans-serif"
            >
              {n.label}
            </text>
          )}
        </g>
      ))}

      {/* Central hub */}
      <g>
        <circle
          className="hub-ring"
          cx={200} cy={250} r={44}
          fill="none"
          stroke="rgba(0,173,169,0.4)"
          strokeWidth="1"
          style={{ animationDuration: '2.5s', animationDelay: '0.4s' }}
        />
        <circle
          className="hub-ring"
          cx={200} cy={250} r={32}
          fill="none"
          stroke="rgba(0,173,169,0.2)"
          strokeWidth="1"
          style={{ animationDuration: '2.5s', animationDelay: '0.2s' }}
        />
        <circle
          className="hub-ring"
          cx={200} cy={250} r={24}
          fill="none"
          stroke="rgba(0,173,169,0.1)"
          strokeWidth="1"
          style={{ animationDuration: '2.5s' }}
        />
        <circle
          className="node-pulse"
          cx={200} cy={250} r={18}
          fill="#00ADA9"
          style={{ animationDuration: '2s', animationDelay: '0.1s' }}
        />
      </g>

      {/* Particles */}
      {particles.map((p, i) => (
        <circle
          key={i}
          cx={p.cx} cy={p.cy} r={2}
          fill="rgba(255,255,255,0.4)"
          style={{
            animation: `floatUp ${p.dur} linear infinite`,
            animationDelay: p.delay,
          }}
        />
      ))}
    </svg>
  )
}
