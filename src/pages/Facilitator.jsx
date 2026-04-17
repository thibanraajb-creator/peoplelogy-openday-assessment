import { useState, useEffect, useRef } from 'react'
import { supabase, SESSION_CODE } from '../lib/supabase'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Cell, ResponsiveContainer, CartesianGrid,
} from 'recharts'

const MATURITY_LABELS = {
  1: 'Awareness', 2: 'Exploration', 3: 'Operational', 4: 'Integrated', 5: 'AI-Driven',
}
const MATURITY_COLORS = ['#ef4444', '#f97316', '#eab308', '#3b82f6', '#22c55e']
const CAPABILITY_ORDER = ['AI Beginner', 'AI Explorer', 'AI Practitioner', 'AI Integrator', 'AI Champion']
const CAP_COLORS = ['#ef4444', '#f97316', '#eab308', '#3b82f6', '#22c55e']

const PILLAR_NAMES = ['Strategy & Leadership', 'Data & Technology', 'People & Skills', 'Processes & AI', 'Governance & Risk']

function BigStat({ value, label, color = '#00ADA9' }) {
  return (
    <div className="flex flex-col items-center justify-center bg-white/5 border border-white/10 rounded-2xl p-6">
      <div className="font-black leading-none mb-2" style={{ fontSize: '4rem', color }}>{value}</div>
      <div className="text-white/60 text-sm font-medium text-center">{label}</div>
    </div>
  )
}

export default function Facilitator() {
  const [orgData, setOrgData] = useState([])
  const [indData, setIndData] = useState([])
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState(null)
  const [fetchError, setFetchError] = useState(null)
  const [debugInfo, setDebugInfo] = useState(null)
  const tickerRef = useRef(null)

  const fetchData = async () => {
    setLoading(true)
    setFetchError(null)

    const { data: orgData, error: orgError } = await supabase
      .from('openday_responses')
      .select('*')
      .eq('session_code', SESSION_CODE)
    const { data: indData, error: indError } = await supabase
      .from('openday_individual_capability')
      .select('*')
      .eq('session_code', SESSION_CODE)

    console.log('Org data:', orgData, orgError)
    console.log('Individual data:', indData, indError)

    const errors = []
    if (orgError) errors.push(`openday_responses: ${orgError.message} (code ${orgError.code})`)
    if (indError) errors.push(`openday_individual_capability: ${indError.message} (code ${indError.code})`)
    if (errors.length > 0) setFetchError(errors.join(' | '))

    const orgRows = orgData || []
    const indRows = indData || []

    setOrgData(orgRows)
    setIndData(indRows)
    setDebugInfo({
      orgRows: orgRows.length,
      indRows: indRows.length,
      orgError: orgError?.message || null,
      indError: indError?.message || null,
    })
    setLastUpdated(new Date())
    setLoading(false)
  }

  useEffect(() => { fetchData() }, [])

  // Stats
  const totalResponses = orgData.length + indData.filter(d => !d.response_id).length
  const orgOnly = orgData.filter(d => !indData.find(i => i.response_id === d.id)).length
  const indOnly = indData.filter(d => !d.response_id).length
  const fullCount = indData.filter(d => d.response_id).length
  const champions = indData.filter(d => d.is_champion).length

  // Path breakdown
  const pathData = [
    { name: 'Org Only', count: orgOnly },
    { name: 'Individual Only', count: indOnly },
    { name: 'Full Assessment', count: fullCount },
  ]

  // Maturity distribution
  const maturityDist = [1, 2, 3, 4, 5].map(level => ({
    name: `L${level}: ${MATURITY_LABELS[level]}`,
    count: orgData.filter(d => d.maturity_level === level).length,
    level,
  }))

  // Capability distribution
  const capDist = CAPABILITY_ORDER.map((label, i) => ({
    name: label.replace('AI ', ''),
    count: indData.filter(d => d.capability_label === label).length,
    color: CAP_COLORS[i],
  }))

  // Top 3 weakest pillars
  const pillarTotals = [1, 2, 3, 4, 5].map(p => {
    const vals = orgData.map(d => d[`pillar${p}_score`] || 0)
    const avg = vals.length > 0 ? (vals.reduce((a, b) => a + b, 0) / vals.length) : 0
    return { pillar: p, name: PILLAR_NAMES[p - 1], avgPct: Math.round((avg / 25) * 100) }
  })
  const weakest3 = [...pillarTotals].sort((a, b) => a.avgPct - b.avgPct).slice(0, 3)

  // Industry breakdown
  const industryMap = {}
  orgData.forEach(d => {
    const ind = d.industry || 'Unknown'
    industryMap[ind] = (industryMap[ind] || 0) + 1
  })
  const industryData = Object.entries(industryMap)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8)

  // Ticker items
  const tickerItems = [...orgData, ...indData]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 20)
    .map(d => {
      if (d.maturity_level) {
        return `${d.first_name} from ${d.organisation} just completed · Maturity Level ${d.maturity_level}: ${MATURITY_LABELS[d.maturity_level]}`
      }
      return `${d.first_name} from ${d.organisation} just completed · ${d.capability_label}`
    })

  const isEmpty = orgData.length === 0 && indData.length === 0

  return (
    <div className="min-h-screen bg-[#0f1f35] text-white" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Top bar */}
      <div className="flex items-center justify-between px-8 py-5 border-b border-white/10">
        <span className="font-black text-2xl">
          PEOPLE<span style={{ color: '#00ADA9' }}>logy</span>
        </span>
        <span className="text-white/70 text-lg font-semibold">Open Day JB · 5 May 2026</span>
        <div className="flex items-center gap-4">
          {lastUpdated && (
            <span className="text-white/30 text-sm">
              {lastUpdated.toLocaleTimeString()}
            </span>
          )}
          <button
            onClick={fetchData}
            disabled={loading}
            className="flex items-center gap-2 bg-[#00ADA9] hover:bg-[#008a87] disabled:opacity-60 text-white font-bold px-5 py-2.5 rounded-xl transition-colors text-sm"
          >
            <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="flex items-center justify-center h-[80vh]">
          <div className="text-center">
            <svg className="animate-spin w-10 h-10 text-[#00ADA9] mx-auto mb-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <p className="text-white/50 text-lg">Loading…</p>
          </div>
        </div>
      )}

      {/* Error banner */}
      {!loading && fetchError && (
        <div className="mx-8 mt-6 bg-red-900/30 border border-red-500/40 rounded-xl px-5 py-4">
          <p className="text-red-300 text-sm font-semibold mb-1">Supabase query error — RLS may be blocking SELECT</p>
          <p className="text-red-400 text-xs font-mono">{fetchError}</p>
          <p className="text-red-500/70 text-xs mt-2">
            Run in Supabase SQL editor: CREATE POLICY "anon select" ON openday_responses FOR SELECT USING (true);
          </p>
        </div>
      )}

      {/* Debug row counts — always shown after fetch */}
      {!loading && debugInfo && (
        <div className="mx-8 mt-4 flex flex-wrap gap-6 text-xs text-white/30">
          <span>Session: <strong className="text-white/60">{SESSION_CODE}</strong></span>
          <span>openday_responses: <strong className={debugInfo.orgError ? 'text-red-400' : 'text-[#00ADA9]'}>{debugInfo.orgError ? `ERROR — ${debugInfo.orgError}` : `${debugInfo.orgRows} rows`}</strong></span>
          <span>openday_individual_capability: <strong className={debugInfo.indError ? 'text-red-400' : 'text-[#00ADA9]'}>{debugInfo.indError ? `ERROR — ${debugInfo.indError}` : `${debugInfo.indRows} rows`}</strong></span>
        </div>
      )}

      {!loading && isEmpty ? (
        <div className="flex items-center justify-center h-[70vh]">
          <div className="text-center">
            <div className="text-8xl font-black text-white/10 mb-4">0</div>
            <h2 className="text-white/50 text-2xl font-semibold mb-2">
              {fetchError ? 'Data load error — see above' : 'Waiting for responses'}
            </h2>
            <p className="text-white/30 text-base">
              {fetchError
                ? 'Check Supabase RLS policies for SELECT access with anon key.'
                : `No submissions found for session code ${SESSION_CODE}.`}
            </p>
          </div>
        </div>
      ) : !loading && (
        <div className="px-8 py-6">
          {/* Big stats */}
          <div className="grid grid-cols-4 gap-5 mb-8">
            <BigStat value={orgData.length + indData.length} label="Total Completions" color="#00ADA9" />
            <BigStat value={orgData.length} label="Org Assessments" color="#60a5fa" />
            <BigStat value={indData.length} label="Individual Assessments" color="#a78bfa" />
            <BigStat value={champions} label="AI Champions" color="#fbbf24" />
          </div>

          {/* Path breakdown + Maturity */}
          <div className="grid grid-cols-3 gap-6 mb-8">
            {/* Path breakdown */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <h3 className="text-white/70 text-sm font-semibold uppercase tracking-wide mb-4">Assessment Paths</h3>
              <div className="space-y-3">
                {pathData.map((p, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="text-white/70">{p.name}</span>
                      <span className="text-white font-bold text-lg">{p.count}</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div
                        className="h-2 rounded-full bg-[#00ADA9]"
                        style={{ width: `${totalResponses > 0 ? (p.count / totalResponses) * 100 : 0}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Maturity distribution */}
            <div className="col-span-2 bg-white/5 border border-white/10 rounded-2xl p-5">
              <h3 className="text-white/70 text-sm font-semibold uppercase tracking-wide mb-4">Org Maturity Distribution</h3>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={maturityDist} layout="vertical" margin={{ top: 0, right: 30, left: 10, bottom: 0 }}>
                  <XAxis type="number" tick={{ fill: '#ffffff60', fontSize: 12 }} />
                  <YAxis dataKey="name" type="category" tick={{ fill: '#ffffff90', fontSize: 12 }} width={120} />
                  <Tooltip
                    contentStyle={{ background: '#1B3A5C', border: 'none', borderRadius: '8px' }}
                    labelStyle={{ color: '#fff' }}
                  />
                  <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                    {maturityDist.map((entry, i) => (
                      <Cell key={i} fill={MATURITY_COLORS[i]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Capability + Weakest pillars */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            {/* Capability distribution */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <h3 className="text-white/70 text-sm font-semibold uppercase tracking-wide mb-4">Personal Capability Distribution</h3>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={capDist} layout="vertical" margin={{ top: 0, right: 30, left: 10, bottom: 0 }}>
                  <XAxis type="number" tick={{ fill: '#ffffff60', fontSize: 12 }} />
                  <YAxis dataKey="name" type="category" tick={{ fill: '#ffffff90', fontSize: 12 }} width={90} />
                  <Tooltip
                    contentStyle={{ background: '#1B3A5C', border: 'none', borderRadius: '8px' }}
                    labelStyle={{ color: '#fff' }}
                  />
                  <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                    {capDist.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Top 3 weakest pillars */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <h3 className="text-white/70 text-sm font-semibold uppercase tracking-wide mb-4">Top 3 Areas Needing Focus</h3>
              <div className="space-y-3">
                {weakest3.map((p, i) => (
                  <div key={i} className="flex items-center gap-3 bg-red-900/20 border border-red-500/20 rounded-xl p-3">
                    <span className="w-8 h-8 rounded-full bg-red-500/30 text-red-400 text-xs font-bold flex items-center justify-center flex-shrink-0">
                      #{i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="text-white text-sm font-semibold truncate">{p.name}</div>
                      <div className="text-red-400 text-xs">Avg: {p.avgPct}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Industry breakdown */}
          {industryData.length > 0 && (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-8">
              <h3 className="text-white/70 text-sm font-semibold uppercase tracking-wide mb-4">Industries in the Room</h3>
              <ResponsiveContainer width="100%" height={Math.max(160, industryData.length * 30)}>
                <BarChart data={industryData} layout="vertical" margin={{ top: 0, right: 30, left: 10, bottom: 0 }}>
                  <XAxis type="number" tick={{ fill: '#ffffff60', fontSize: 12 }} />
                  <YAxis dataKey="name" type="category" tick={{ fill: '#ffffff90', fontSize: 12 }} width={160} />
                  <Tooltip
                    contentStyle={{ background: '#1B3A5C', border: 'none', borderRadius: '8px' }}
                    labelStyle={{ color: '#fff' }}
                  />
                  <Bar dataKey="count" fill="#00ADA9" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      )}

      {/* Live ticker */}
      {tickerItems.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-[#00ADA9]/90 backdrop-blur border-t border-[#00ADA9] py-3 overflow-hidden">
          <div className="ticker-animation whitespace-nowrap inline-block">
            {[...tickerItems, ...tickerItems].map((item, i) => (
              <span key={i} className="inline-block text-white text-sm font-medium mx-8">
                <span className="text-white/60 mr-2">●</span>
                {item}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
