export default function Logo({ height = 36 }) {
  return (
    <a href="/" style={{ display: 'inline-flex', alignItems: 'center', cursor: 'pointer', textDecoration: 'none' }}>
      <img
        src="/peoplelogy-logo.png"
        alt="PEOPLElogy"
        style={{
          height: height + 'px',
          width: 'auto',
          filter: 'brightness(0) invert(1)',
          display: 'block'
        }}
        onError={(e) => {
          e.target.style.display = 'none'
          e.target.nextSibling.style.display = 'block'
        }}
      />
      <span style={{ display: 'none', fontWeight: '900', fontSize: '20px' }}>
        <span style={{ color: 'white' }}>PEOPLE</span>
        <span style={{ color: '#00ADA9' }}>logy</span>
      </span>
    </a>
  )
}
