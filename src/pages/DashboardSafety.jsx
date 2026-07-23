/**
 * DashboardSafety.jsx
 * ---------------------------------------------------------------
 * Dedicated cohort dashboard for the AI Safety Capacity & Digital
 * Trust diagnostic. Built for a projector at a national exhibition.
 *
 * DESIGN DECISIONS THAT MATTER:
 *
 * 1. LIVE and ILLUSTRATIVE data are separated and labelled.
 *    The seeded cohort is simulated. Ministry officials cite numbers
 *    they see on screens, so nothing here may imply that simulated
 *    data is a real national survey. Live submissions are counted
 *    and displayed separately and prominently.
 *
 * 2. No chart library. Plain divs and CSS. Zero dependency risk on
 *    exhibition wifi, renders identically on any projector.
 *
 * 3. Auto-refreshes every 20s so a delegate's own submission appears
 *    while they are still standing there.
 *
 * 4. Large type. Readable from three metres.
 * ---------------------------------------------------------------
 */

import { useState, useEffect, useCallback } from 'react'
import { supabase, SESSION_CODE } from '../lib/supabase'

const PILLARS = [
  { key: 'safety_score',     name: 'AI Safety',     color: '#00ADA9' },
  { key: 'trust_score',      name: 'Digital Trust', color: '#3B82F6' },
  { key: 'resilience_score', name: 'Resilience',    color: '#7C3AED' },
]

const BANDS = [
  { label: 'Resilient', color: '#22C55E' },
  { label: 'Managed',   color: '#3B82F6' },
  { label: 'Aware',     color: '#F97316' },
  { label: 'Exposed',   color: '#EF4444' },
]

const CLUSTERS = {
  A: 'Leaders & Strategy',
  B: 'Commercial & Client',
  C: 'Creative & Marketing',
  D: 'Technical & Delivery',
  E: 'L&D & People',
}

const TIERS = {
  1: { name: 'Tier 1 — Awareness & Literacy',    color: '#00ADA9', duration: '1 day' },
  2: { name: 'Tier 2 — Practitioner',            color: '#3B82F6', duration: '3 days' },
  3: { name: 'Tier 3 — Governance & Leadership', color: '#7C3AED', duration: '2 days' },
}

/* A row is ILLUSTRATIVE if its answer columns hold the seed marker.
   Live submissions write real option text. */
const isSeeded = (r) => r.p1_q1 === 'seeded'

const avg = (rows, key) =>
  rows.length ? Math.round(rows.reduce((a, r) => a + (Number(r[key]) || 0), 0) / rows.length) : 0

export default function DashboardSafety() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastUpdate, setLastUpdate] = useState(null)

  const load = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('openday_safety')
        .select('*')
        .eq('session_code', SESSION_CODE)
        .order('submitted_at', { ascending: false })
      if (error) throw error
      setRows(data || [])
      setError(null)
      setLastUpdate(new Date())
    } catch (e) {
      setError(e.message || 'Could not load data')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
    const t = setInterval(load, 20000)   // live refresh during the demo
    return () => clearInterval(t)
  }, [load])

  const live = rows.filter(r => !isSeeded(r))
  const all = rows

  /* ---------- aggregates ---------- */
  const pillarAvgs = PILLARS.map(p => ({ ...p, value: avg(all, p.key) }))
  const overall = avg(all, 'overall_score')

  const weakestPillar = pillarAvgs.reduce((lo, p) => (p.value < lo.value ? p : lo), pillarAvgs[0])
  const strongestPillar = pillarAvgs.reduce((hi, p) => (p.value > hi.value ? p : hi), pillarAvgs[0])
  const spread = strongestPillar.value - weakestPillar.value

  const bandCounts = BANDS.map(b => {
    const n = all.filter(r => r.capacity_label === b.label).length
    return { ...b, n, pct: all.length ? Math.round((n / all.length) * 100) : 0 }
  })

  const clusterRows = Object.entries(CLUSTERS).map(([k, name]) => {
    const sub = all.filter(r => r.cluster === k)
    return {
      key: k, name, n: sub.length,
      safety: avg(sub, 'safety_score'),
      trust: avg(sub, 'trust_score'),
      resilience: avg(sub, 'resilience_score'),
      overall: avg(sub, 'overall_score'),
    }
  }).sort((a, b) => b.overall - a.overall)

  const tierCounts = [1, 2, 3].map(t => {
    const n = all.filter(r => Number(r.recommended_tier) === t).length
    return { tier: t, ...TIERS[t], n, pct: all.length ? Math.round((n / all.length) * 100) : 0 }
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F1E33] flex items-center justify-center">
        <p className="text-white/60 text-lg">Loading cohort data…</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0F1E33] text-white px-6 py-6">
      <div className="max-w-[1500px] mx-auto">

        {/* ---------- HEADER ---------- */}
        <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
          <div>
            <p className="text-[#00ADA9] text-xs font-bold tracking-[0.2em] uppercase mb-1">
              PEOPLElogy Berhad
            </p>
            <h1 className="text-3xl font-bold leading-tight">
              AI Safety Capacity &amp; Digital Trust
            </h1>
            <p className="text-white/50 text-sm mt-1">
              National cohort diagnostic · measured against AIGE, NAIO,
              CyberSecurity Malaysia, PDPA, NIST AI RMF, ISO/IEC 42001, OWASP LLM Top 10
            </p>
          </div>

          {/* live vs illustrative — the integrity panel */}
          <div className="flex gap-3">
            <div className="bg-[#00ADA9]/15 border border-[#00ADA9]/40 rounded-xl px-5 py-3 text-center">
              <p className="text-[10px] font-bold tracking-widest text-[#00ADA9] uppercase">
                Live today
              </p>
              <p className="text-4xl font-bold text-[#00ADA9] leading-none mt-1">
                {live.length}
              </p>
              <p className="text-[10px] text-white/40 mt-1">real submissions</p>
            </div>
            <div className="bg-white/5 border border-white/15 rounded-xl px-5 py-3 text-center">
              <p className="text-[10px] font-bold tracking-widest text-white/40 uppercase">
                Illustrative
              </p>
              <p className="text-4xl font-bold text-white/70 leading-none mt-1">
                {all.length - live.length}
              </p>
              <p className="text-[10px] text-white/40 mt-1">simulated cohort</p>
            </div>
          </div>
        </div>

        {/* ---------- INTEGRITY BANNER ----------
            Non-negotiable. Simulated figures must never be mistaken
            for a real national survey. */}
        <div className="bg-amber-400/10 border border-amber-400/40 rounded-lg px-4 py-2.5 mb-6 flex items-start gap-3">
          <span className="text-amber-400 text-lg leading-none mt-0.5">&#9888;</span>
          <p className="text-amber-100/90 text-sm">
            <span className="font-bold">Illustrative cohort.</span>{' '}
            Figures below combine {live.length} live submission{live.length === 1 ? '' : 's'} with
            a simulated cohort of {all.length - live.length} respondents, shown to demonstrate
            the instrument at population scale. These are not results of a national survey.
          </p>
        </div>

        {error && (
          <div className="bg-red-500/15 border border-red-500/40 rounded-lg px-4 py-2.5 mb-6">
            <p className="text-red-200 text-sm">{error}</p>
          </div>
        )}

        {/* ---------- HEADLINE ROW ---------- */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-5">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <p className="text-[10px] font-bold tracking-widest text-white/40 uppercase mb-2">
              Overall capacity
            </p>
            <p className="text-6xl font-bold leading-none">{overall}<span className="text-2xl text-white/40">%</span></p>
            <p className="text-white/40 text-xs mt-2">{all.length} respondents</p>
          </div>

          {pillarAvgs.map(p => (
            <div key={p.key} className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <p className="text-[10px] font-bold tracking-widest uppercase mb-2" style={{ color: p.color }}>
                {p.name}
              </p>
              <p className="text-6xl font-bold leading-none">
                {p.value}<span className="text-2xl text-white/40">%</span>
              </p>
              <div className="h-2 rounded-full bg-white/10 mt-3 overflow-hidden">
                <div className="h-full rounded-full transition-all duration-700"
                     style={{ width: `${p.value}%`, background: p.color }} />
              </div>
            </div>
          ))}
        </div>

        {/* ---------- THE FINDING ---------- */}
        <div className="bg-gradient-to-r from-[#3B82F6]/15 to-transparent border-l-4 border-[#3B82F6] rounded-r-2xl px-6 py-5 mb-6">
          <p className="text-[10px] font-bold tracking-widest text-[#3B82F6] uppercase mb-2">
            The capability gap
          </p>
          <p className="text-xl leading-relaxed">
            <span className="font-bold">{weakestPillar.name}</span> is the weakest pillar at{' '}
            <span className="font-bold" style={{ color: weakestPillar.color }}>{weakestPillar.value}%</span>
            {spread > 0 && (
              <> — <span className="font-bold">{spread} points</span> below {strongestPillar.name}.</>
            )}
            {weakestPillar.key === 'trust_score' && (
              <span className="text-white/60">
                {' '}Organisations are thinking about whether AI is <em>reliable</em>, and far less
                about whether what they see and hear is <em>real</em>. Deepfake-enabled fraud is
                already active in Malaysia.
              </span>
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* ---------- CAPACITY DISTRIBUTION ---------- */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <p className="text-[10px] font-bold tracking-widest text-white/40 uppercase mb-4">
              Capacity distribution
            </p>
            {bandCounts.map(b => (
              <div key={b.label} className="mb-4 last:mb-0">
                <div className="flex justify-between items-baseline mb-1.5">
                  <span className="text-sm font-semibold" style={{ color: b.color }}>{b.label}</span>
                  <span className="text-sm text-white/70">
                    <span className="font-bold text-white">{b.n}</span>
                    <span className="text-white/40 text-xs ml-1.5">{b.pct}%</span>
                  </span>
                </div>
                <div className="h-2.5 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700"
                       style={{ width: `${b.pct}%`, background: b.color }} />
                </div>
              </div>
            ))}
          </div>

          {/* ---------- BY FUNCTION ---------- */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <p className="text-[10px] font-bold tracking-widest text-white/40 uppercase mb-4">
              Capacity by function
            </p>
            {clusterRows.map(c => (
              <div key={c.key} className="mb-3.5 last:mb-0">
                <div className="flex justify-between items-baseline mb-1.5">
                  <span className="text-sm font-medium text-white/85">{c.name}</span>
                  <span className="text-sm font-bold">{c.overall}%
                    <span className="text-white/30 text-xs font-normal ml-1.5">n={c.n}</span>
                  </span>
                </div>
                <div className="flex gap-1 h-2">
                  {PILLARS.map(p => {
                    const v = p.key === 'safety_score' ? c.safety
                            : p.key === 'trust_score' ? c.trust : c.resilience
                    return (
                      <div key={p.key} className="flex-1 rounded-full bg-white/10 overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-700"
                             style={{ width: `${v}%`, background: p.color }} />
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
            <div className="flex gap-3 mt-4 pt-3 border-t border-white/10">
              {PILLARS.map(p => (
                <span key={p.key} className="flex items-center gap-1.5 text-[10px] text-white/50">
                  <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
                  {p.name}
                </span>
              ))}
            </div>
          </div>

          {/* ---------- TIER DEMAND ----------
              This is the procurement number: how many people need
              which tier. It sizes the programme in headcount. */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <p className="text-[10px] font-bold tracking-widest text-white/40 uppercase mb-1">
              Programme demand
            </p>
            <p className="text-[11px] text-white/40 mb-4">
              Tier is determined by role, not score
            </p>
            {tierCounts.map(t => (
              <div key={t.tier} className="mb-4 last:mb-0">
                <div className="flex justify-between items-baseline mb-1">
                  <span className="text-sm font-semibold" style={{ color: t.color }}>
                    {t.name}
                  </span>
                </div>
                <div className="flex items-baseline gap-2 mb-1.5">
                  <span className="text-3xl font-bold leading-none">{t.n}</span>
                  <span className="text-white/40 text-sm">people · {t.pct}% · {t.duration}</span>
                </div>
                <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700"
                       style={{ width: `${t.pct}%`, background: t.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ---------- LIVE FEED ---------- */}
        {live.length > 0 && (
          <div className="bg-[#00ADA9]/10 border border-[#00ADA9]/30 rounded-2xl p-5 mt-5">
            <p className="text-[10px] font-bold tracking-widest text-[#00ADA9] uppercase mb-3">
              Live submissions today
            </p>
            <div className="flex flex-wrap gap-2">
              {live.slice(0, 16).map(r => (
                <div key={r.id}
                     className="bg-white/10 rounded-lg px-3 py-2 flex items-center gap-2.5">
                  <span className="text-sm font-medium">{r.first_name || 'Participant'}</span>
                  <span className="text-white/35 text-xs">{r.organisation}</span>
                  <span className="text-sm font-bold"
                        style={{ color: BANDS.find(b => b.label === r.capacity_label)?.color || '#fff' }}>
                    {r.overall_score}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ---------- FOOTER ---------- */}
        <div className="flex justify-between items-center mt-6 pt-4 border-t border-white/10">
          <p className="text-white/30 text-[11px]">
            PEOPLElogy Berhad · Individual results are never shared publicly ·
            All data handled in accordance with PDPA 2010
          </p>
          <p className="text-white/30 text-[11px]">
            {lastUpdate && `Updated ${lastUpdate.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })} · refreshes automatically`}
          </p>
        </div>
      </div>
    </div>
  )
}
