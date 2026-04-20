export default function Logo({ height = 40 }) {
  return (
    <a href="/" style={{ display: 'inline-block', cursor: 'pointer' }}>
      <img
        src="/peoplelogy-logo.png"
        alt="PEOPLElogy"
        style={{ height: height + 'px', width: 'auto', filter: 'brightness(0) invert(1)' }}
      />
    </a>
  )
}
