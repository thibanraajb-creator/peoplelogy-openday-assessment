export default function Logo({ dark = false }) {
  return (
    <span className={`font-bold text-xl tracking-tight ${dark ? 'text-[#1B3A5C]' : 'text-white'}`}>
      <span className={dark ? 'text-[#1B3A5C]' : 'text-white'}>PEOPLE</span>
      <span style={{ color: '#00ADA9' }}>logy</span>
    </span>
  )
}
