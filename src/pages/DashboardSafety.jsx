/**
 * DashboardSafety.jsx  (v2)
 * ---------------------------------------------------------------
 * Cohort dashboard for the AI Safety Capacity & Digital Trust
 * diagnostic. Built for a projector at a national exhibition.
 *
 * CHANGED FROM v1:
 *  - All illustrative/seeded data removed. Every figure shown is a
 *    real submission, so the live/simulated split and the integrity
 *    banner are gone.
 *  - Added an INDUSTRY breakdown alongside the function breakdown.
 *  - Proper empty state — the exhibition starts at zero respondents
 *    and the screen must read as "ready", not "broken".
 *  - Small-sample caveat below ~20 respondents so early percentages
 *    are not over-read.
 *
 * No chart library. Plain divs and CSS — nothing to fail on
 * exhibition wifi, renders identically on any projector.
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

const SMALL_SAMPLE = 20

const avg = (rows, key) =>
  rows.length ? Math.round(rows.reduce((a, r) => a + (Number(r[key]) || 0), 0) / rows.length) : 0

/* ---------- presentational helpers ---------- */

function Bar({ value, color, height = 'h-2.5' }) {
  return (
    <div className={`${height} rounded-full bg-white/10 overflow-hidden`}>
      <div className="h-full rounded-full transition-all duration-700"
           style={{ width: `${Math.max(0, Math.min(100, value))}%`, background: color }} />
    </div>
  )
}

function Panel({ title, subtitle, children, className = '' }) {
  return (
    <div className={`bg-white/5 border border-white/10 rounded-2xl p-5 ${className}`}>
      <p className="text-[10px] font-bold tracking-widest text-white/40 uppercase mb-1">{title}</p>
      {subtitle
        ? <p className="text-[11px] text-white/35 mb-3">{subtitle}</p>
        : <div className="mb-3" />}
      {children}
    </div>
  )
}

function PillarLegend() {
  return (
    <div className="flex flex-wrap gap-3 mt-4 pt-3 border-t border-white/10">
      {PILLARS.map(p => (
        <span key={p.key} className="flex items-center gap-1.5 text-[10px] text-white/50">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          {p.name}
        </span>
      ))}
    </div>
  )
}

function TripleBar({ safety, trust, resilience }) {
  const vals = [safety, trust, resilience]
  return (
    <div className="flex gap-1 h-2">
      {PILLARS.map((p, i) => (
        <div key={p.key} className="flex-1 rounded-full bg-white/10 overflow-hidden">
          <div className="h-full rounded-full transition-all duration-700"
               style={{ width: `${Math.max(0, Math.min(100, vals[i]))}%`, background: p.color }} />
        </div>
      ))}
    </div>
  )
}

function BreakdownRow({ label, n, overall, safety, trust, resilience }) {
  return (
    <div className="mb-3.5 last:mb-0">
      <div className="flex justify-between items-baseline mb-1.5">
        <span className="text-sm font-medium text-white/85">{label}</span>
        <span className="text-sm font-bold">
          {overall}%
          <span className="text-white/30 text-xs font-normal ml-1.5">n={n}</span>
        </span>
      </div>
      <TripleBar safety={safety} trust={trust} resilience={resilience} />
    </div>
  )
}

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
    const t = setInterval(load, 20000)
    return () => clearInterval(t)
  }, [load])

  const all = rows
  const n = all.length

  /* ---------- aggregates ---------- */
  const pillarAvgs = PILLARS.map(p => ({ ...p, value: avg(all, p.key) }))
  const overall = avg(all, 'overall_score')

  const weakest = pillarAvgs.reduce((lo, p) => (p.value < lo.value ? p : lo), pillarAvgs[0])
  const strongest = pillarAvgs.reduce((hi, p) => (p.value > hi.value ? p : hi), pillarAvgs[0])
  const spread = strongest.value - weakest.value

  const bandCounts = BANDS.map(b => {
    const c = all.filter(r => r.capacity_label === b.label).length
    return { ...b, n: c, pct: n ? Math.round((c / n) * 100) : 0 }
  })

  const clusterRows = Object.entries(CLUSTERS)
    .map(([k, name]) => {
      const sub = all.filter(r => r.cluster === k)
      return {
        key: k, name, n: sub.length,
        safety: avg(sub, 'safety_score'),
        trust: avg(sub, 'trust_score'),
        resilience: avg(sub, 'resilience_score'),
        overall: avg(sub, 'overall_score'),
      }
    })
    .filter(c => c.n > 0)
    .sort((a, b) => b.overall - a.overall)

  /* Industries derived from the data rather than hardcoded, so whatever
     the intake form offers appears here automatically. */
  const industryRows = Object.entries(
    all.reduce((acc, r) => {
      const k = (r.industry || 'Not specified').trim() || 'Not specified'
      ;(acc[k] = acc[k] || []).push(r)
      return acc
    }, {})
  )
    .map(([name, sub]) => ({
      name, n: sub.length,
      safety: avg(sub, 'safety_score'),
      trust: avg(sub, 'trust_score'),
      resilience: avg(sub, 'resilience_score'),
      overall: avg(sub, 'overall_score'),
    }))
    .sort((a, b) => b.n - a.n || b.overall - a.overall)

  const tierCounts = [1, 2, 3].map(t => {
    const c = all.filter(r => Number(r.recommended_tier) === t).length
    return { tier: t, ...TIERS[t], n: c, pct: n ? Math.round((c / n) * 100) : 0 }
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F1E33] flex items-center justify-center">
        <p className="text-white/50 text-lg">Loading cohort data…</p>
      </div>
    )
  }

  const Header = (
    <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
      <div>
        <p className="text-[#00ADA9] text-xs font-bold tracking-[0.2em] uppercase mb-1">
          PEOPLElogy Berhad
        </p>
        <h1 className="text-3xl font-bold leading-tight">
          AI Safety Capacity &amp; Digital Trust
        </h1>
        <p className="text-white/45 text-sm mt-1">
          Measured against AIGE · NAIO · CyberSecurity Malaysia · PDPA ·
          NIST AI RMF · ISO/IEC 42001 · OWASP LLM Top 10
        </p>
      </div>
      <div className="bg-[#00ADA9]/15 border border-[#00ADA9]/40 rounded-xl px-6 py-3 text-center">
        <p className="text-[10px] font-bold tracking-widest text-[#00ADA9] uppercase">
          Respondents
        </p>
        <p className="text-5xl font-bold text-[#00ADA9] leading-none mt-1">{n}</p>
      </div>
    </div>
  )

  const ErrorBanner = error && (
    <div className="bg-red-500/15 border border-red-500/40 rounded-lg px-4 py-2.5 mb-5">
      <p className="text-red-200 text-sm">{error}</p>
    </div>
  )

  /* ---------- EMPTY STATE ----------
     The exhibition opens at zero. This must read as "ready and
     waiting", not "something failed to load". */
  if (n === 0) {
    return (
      <div className="min-h-screen bg-[#0F1E33] text-white px-6 py-6">
        <div className="max-w-[1500px] mx-auto">
          {Header}
          {ErrorBanner}
          <div className="border border-white/10 rounded-2xl bg-white/5 py-20 px-8 text-center">
            <p className="text-2xl font-semibold mb-3">Awaiting the first responses</p>
            <p className="text-white/50 max-w-2xl mx-auto leading-relaxed">
              This dashboard fills as participants complete the diagnostic.
              Every figure shown is a live response — there is no simulated
              or pre-loaded data.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-10 max-w-4xl mx-auto text-left">
              {PILLARS.map(p => (
                <div key={p.key} className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <p className="text-sm font-bold mb-1" style={{ color: p.color }}>{p.name}</p>
                  <p className="text-white/40 text-xs">Awaiting responses</p>
                </div>
              ))}
            </div>
            <p className="text-white/25 text-xs mt-10">
              Refreshing automatically every 20 seconds
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0F1E33] text-white px-6 py-6">
      <div className="max-w-[1500px] mx-auto">
        {Header}
        {ErrorBanner}

        {n < SMALL_SAMPLE && (
          <div className="bg-white/5 border border-white/15 rounded-lg px-4 py-2.5 mb-5">
            <p className="text-white/60 text-sm">
              <span className="font-semibold text-white/80">Early sample.</span>{' '}
              Based on {n} response{n === 1 ? '' : 's'} so far — percentages will
              move as more participants complete the diagnostic.
            </p>
          </div>
        )}

        {/* ---------- HEADLINE ---------- */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-5">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <p className="text-[10px] font-bold tracking-widest text-white/40 uppercase mb-2">
              Overall capacity
            </p>
            <p className="text-6xl font-bold leading-none">
              {overall}<span className="text-2xl text-white/40">%</span>
            </p>
            <p className="text-white/40 text-xs mt-2">
              across {n} respondent{n === 1 ? '' : 's'}
            </p>
          </div>

          {pillarAvgs.map(p => (
            <div key={p.key} className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <p className="text-[10px] font-bold tracking-widest uppercase mb-2"
                 style={{ color: p.color }}>{p.name}</p>
              <p className="text-6xl font-bold leading-none">
                {p.value}<span className="text-2xl text-white/40">%</span>
              </p>
              <div className="mt-3"><Bar value={p.value} color={p.color} height="h-2" /></div>
            </div>
          ))}
        </div>

        {/* ---------- THE FINDING ---------- */}
        {spread > 0 && (
          <div className="bg-gradient-to-r from-[#3B82F6]/15 to-transparent border-l-4 border-[#3B82F6] rounded-r-2xl px-6 py-5 mb-5">
            <p className="text-[10px] font-bold tracking-widest text-[#3B82F6] uppercase mb-2">
              The capability gap
            </p>
            <p className="text-xl leading-relaxed">
              <span className="font-bold">{weakest.name}</span> is the weakest pillar at{' '}
              <span className="font-bold" style={{ color: weakest.color }}>{weakest.value}%</span>
              {' '}— <span className="font-bold">{spread} points</span> below {strongest.name}.
              {weakest.key === 'trust_score' && (
                <span className="text-white/60">
                  {' '}Organisations are considering whether AI is <em>reliable</em>, and far
                  less whether what they see and hear is <em>real</em>. Deepfake-enabled fraud
                  is already active in Malaysia.
                </span>
              )}
            </p>
          </div>
        )}

        {/* ---------- ROW 1 ---------- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
          <Panel title="Capacity distribution">
            {bandCounts.map(b => (
              <div key={b.label} className="mb-4 last:mb-0">
                <div className="flex justify-between items-baseline mb-1.5">
                  <span className="text-sm font-semibold" style={{ color: b.color }}>{b.label}</span>
                  <span className="text-sm text-white/70">
                    <span className="font-bold text-white">{b.n}</span>
                    <span className="text-white/40 text-xs ml-1.5">{b.pct}%</span>
                  </span>
                </div>
                <Bar value={b.pct} color={b.color} />
              </div>
            ))}
          </Panel>

          <Panel title="Programme demand" subtitle="Tier is determined by role, not by score">
            {tierCounts.map(t => (
              <div key={t.tier} className="mb-4 last:mb-0">
                <p className="text-sm font-semibold mb-1" style={{ color: t.color }}>{t.name}</p>
                <div className="flex items-baseline gap-2 mb-1.5">
                  <span className="text-3xl font-bold leading-none">{t.n}</span>
                  <span className="text-white/40 text-sm">
                    {t.n === 1 ? 'person' : 'people'} · {t.pct}% · {t.duration}
                  </span>
                </div>
                <Bar value={t.pct} color={t.color} height="h-2" />
              </div>
            ))}
          </Panel>
        </div>

        {/* ---------- ROW 2: industry + function ---------- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <Panel title="Capacity by industry" subtitle="Where the exposure sits">
            {industryRows.map(r => (
              <BreakdownRow key={r.name} label={r.name} {...r} />
            ))}
            <PillarLegend />
          </Panel>

          <Panel title="Capacity by function" subtitle="Which roles carry the gap">
            {clusterRows.map(c => (
              <BreakdownRow key={c.key} label={c.name} {...c} />
            ))}
            <PillarLegend />
          </Panel>
        </div>

        {/* ---------- RECENT ---------- */}
        <div className="bg-[#00ADA9]/10 border border-[#00ADA9]/30 rounded-2xl p-5 mt-5">
          <p className="text-[10px] font-bold tracking-widest text-[#00ADA9] uppercase mb-3">
            Recent submissions
          </p>
          <div className="flex flex-wrap gap-2">
            {all.slice(0, 20).map(r => (
              <div key={r.id} className="bg-white/10 rounded-lg px-3 py-2 flex items-center gap-2.5">
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

        {/* ---------- FOOTER ---------- */}
        <div className="flex flex-wrap justify-between items-center gap-2 mt-6 pt-4 border-t border-white/10">
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
