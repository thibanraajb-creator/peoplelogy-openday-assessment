import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase, SESSION_CODE } from '../lib/supabase'
import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Tooltip, Cell, CartesianGrid,
} from 'recharts'
import Logo from '../components/Logo'

const MATURITY_LABELS = {
  1: 'Awareness', 2: 'Exploration', 3: 'Operational', 4: 'Integrated', 5: 'AI-Driven',
}
const MATURITY_COLORS = ['#ef4444', '#f97316', '#eab308', '#3b82f6', '#22c55e']
const CAPABILITY_ORDER = ['AI Beginner', 'AI Explorer', 'AI Practitioner', 'AI Integrator', 'AI Champion']
const CAP_COLORS = ['#ef4444', '#f97316', '#eab308', '#3b82f6', '#22c55e']

export default function Dashboard() {
  const navigate = useNavigate()
  const [orgData, setOrgData] = useState([])
  const [indData, setIndData] = useState([])
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState(null)
  const [activeTab, setActiveTab] = useState('org')
  const [fetchError, setFetchError] = useState(null)

  const fetchData = async () => {
    setLoading(true)
    setFetchError(null)
    try {
      console.log('[Dashboard] Fetching data for session:', SESSION_CODE)

      const orgRes = await supabase
        .from('openday_responses')
        .select('*')
        .eq('session_code', SESSION_CODE)
        .order('submitted_at', { ascending: false })

      console.log('[Dashboard] Org response:', orgRes)

      const indRes = await supabase
        .from('openday_individual_capability')
        .select('*')
        .eq('session_code', SESSION_CODE)
        .order('submitted_at', { ascending: false })

      console.log('[Dashboard] Individual response:', indRes)

      if (orgRes.error) {
        console.error('[Dashboard] Org fetch error:', orgRes.error)
        setFetchError(`Org data error: ${orgRes.error.message}`)
      }

      if (indRes.error) {
        console.error('[Dashboard] Individual fetch error:', indRes.error)
        setFetchError(prev => prev ? prev + ` | Ind error: ${indRes.error.message}` : `Ind error: ${indRes.error.message}`)
      }

      const org = orgRes.data || []
      const ind = indRes.data || []

      console.log('[Dashboard] Org rows:', org.length)
      console.log('[Dashboard] Ind rows:', ind.length)

      setOrgData(org)
      setIndData(ind)
      setLastUpdated(new Date())
      console.log('[DEBUG] orgData:', org?.length, 'indData:', ind?.length)
    } catch (err) {
      console.error('[Dashboard] Unexpected error:', err)
      setFetchError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  const totalResponses = orgData.length
  const avgMaturity = orgData.length > 0
    ? (orgData.reduce((a, b) => a + (b.maturity_level || 0), 0) / orgData.length).toFixed(1)
    : 0
  const totalIndividual = indData.length
  const champions = indData.filter(d => d.is_champion).length

  const pillarAvgs = [1, 2, 3, 4, 5].map(p => {
    const vals = orgData.map(d => d[`pillar${p}_score`] || 0)
    const avg = vals.length > 0 ? vals.reduce((a, b) => a + b, 0) / vals.length : 0
    const pct = Math.round((avg / 25) * 100)
    return { name: ['Strategy', 'Data & Tech', 'People', 'Processes', 'Governance'][p - 1], score: pct }
  })

  const maturityDist = [1, 2, 3, 4, 5].map(level => ({
    name: MATURITY_LABELS[level],
    count: orgData.filter(d => d.maturity_level === level).length,
    level,
  }))

  const industryMap = {}
  orgData.forEach(d => {
    const ind = d.industry || 'Unknown'
    industryMap[ind] = (industryMap[ind] || 0) + 1
  })
  const industryData = Object.entries(industryMap)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)

  const capDist = CAPABILITY_ORDER.map((label, i) => ({
    name: label,
    count: indData.filter(d => d.capability_label === label).length,
    color: CAP_COLORS[i],
  }))

  const roleCapMap = {}
  indData.forEach(d => {
    const role = d.role_level || 'Unknown'
    if (!roleCapMap[role]) roleCapMap[role] = []
    roleCapMap[role].push(d.overall_capability_score || 0)
  })
  const roleCap = Object.entries(roleCapMap)
    .map(([role, scores]) => ({
      name: role.split(' ')[0] + (role.includes('/') ? '/' + role.split('/')[1]?.trim().split(' ')[0] : ''),
      score: Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 25),
    }))
    .sort((a, b) => b.score - a.score)

  const dimAvgData = ['D1', 'D2', 'D3', 'D4', 'D5'].map((d, i) => {
    const key = ['d1_awareness_score', 'd2_tool_score', 'd3_prompt_score', 'd4_opportunity_score', 'd5_workflow_score'][i]
    const vals = indData.map(r => r[key] || 0)
    const avg = vals.length > 0 ? vals.reduce((a, b) => a + b, 0) / vals.length : 0
    return {
      name: ['Awareness', 'Tool Use', 'Prompts', 'Opportunity', 'Workflow'][i],
      score: Math.round(avg * 25),
    }
  })

  const liveFeed = [
    ...orgData.map(d => ({ ...d, type: 'org' })),
    ...indData.map(d => ({ ...d, type: 'ind' }))
  ]
    .map(d => ({
      firstName: d.first_name,
      organisation: d.organisation,
      maturityLevel: d.maturity_level ? `Level ${d.maturity_level}: ${MATURITY_LABELS[d.maturity_level]}` : null,
      capabilityLabel: d.capability_label || null,
      submittedAt: d.submitted_at,
      type: d.type,
    }))
    .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))
    .slice(0, 10)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-[#1B3A5C] px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="bg-white/10 hover:bg-white/20 text-white rounded-lg p-2 flex items-center gap-2 text-sm font-medium"
            >
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </button>
            <Logo />
          </div>
          <div className="flex items-center gap-4">
            {lastUpdated && (
              <span className="text-white/40 text-xs">
                Updated {lastUpdated.toLocaleTimeString()}
              </span>
            )}
            <button
              onClick={fetchData}
              disabled={loading}
              className="flex items-center gap-2 bg-[#00ADA9] hover:bg-[#008a87] disabled:opacity-60 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
            >
              <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#1B3A5C]">Live Dashboard</h1>
          <p className="text-gray-500 text-sm">Open Day JB · 5 May 2026 · Session JBOPEN2026</p>
        </div>

        {fetchError && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
            <p className="text-red-700 text-sm font-medium">Error: {fetchError}</p>
            <p className="text-red-500 text-xs mt-1">Check browser console for details.</p>
          </div>
        )}

        {loading ? (
          <div className="text-center py-24">
            <div className="w-8 h-8 border-4 border-[#00ADA9] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400 text-sm">Loading data...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { label: 'Org Responses', value: totalResponses },
                { label: 'Avg Maturity Level', value: avgMaturity },
                { label: 'Individual Assessments', value: totalIndividual },
                { label: 'AI Champions', value: champions },
              ].map((m, i) => (
                <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm text-center">
                  <div className="text-3xl font-black text-[#1B3A5C]">{m.value}</div>
                  <div className="text-gray-500 text-xs mt-1">{m.label}</div>
                </div>
              ))}
            </div>

            {orgData.length === 0 && indData.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
                <h3 className="text-[#1B3A5C] font-semibold mb-2">No responses yet</h3>
                <p className="text-gray-400 text-sm">Results will appear here as participants complete the assessment.</p>
                <p className="text-gray-300 text-xs mt-2">Session: {SESSION_CODE}</p>
              </div>
            ) : (
              <>
                <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-6 w-fit">
                  {['org', 'individual', 'feed'].map(tab => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                        activeTab === tab
                          ? 'bg-white text-[#1B3A5C] shadow-sm'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {tab === 'org'
                        ? `Organisation (${orgData.length})`
                        : tab === 'individual'
                        ? `Individual (${indData.length})`
                        : 'Live Feed'}
                    </button>
                  ))}
                </div>

                {activeTab === 'org' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                        <h3 className="text-sm font-semibold text-[#1B3A5C] mb-4">Average Pillar Scores</h3>
                        <ResponsiveContainer width="100%" height={220}>
                          <RadarChart data={pillarAvgs}>
                            <PolarGrid stroke="#e5e7eb" />
                            <PolarAngleAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 11 }} />
                            <Radar dataKey="score" stroke="#00ADA9" fill="#00ADA9" fillOpacity={0.2} strokeWidth={2} />
                            <Tooltip formatter={v => [`${v}%`]} />
                          </RadarChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                        <h3 className="text-sm font-semibold text-[#1B3A5C] mb-4">Maturity Level Distribution</h3>
                        <ResponsiveContainer width="100%" height={220}>
                          <BarChart data={maturityDist} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                            <YAxis tick={{ fontSize: 11 }} />
                            <Tooltip />
                            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                              {maturityDist.map((entry, i) => (
                                <Cell key={i} fill={MATURITY_COLORS[i]} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                      <h3 className="text-sm font-semibold text-[#1B3A5C] mb-4">Pillar Average Scores</h3>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                        {pillarAvgs.map((p, i) => (
                          <div key={i} className="text-center">
                            <div className="text-2xl font-black text-[#1B3A5C]">{p.score}%</div>
                            <div className="text-xs text-gray-500 mt-1">{p.name}</div>
                            <div className="w-full bg-gray-100 rounded-full h-1.5 mt-2">
                              <div className="bg-[#00ADA9] h-1.5 rounded-full" style={{ width: `${p.score}%` }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {industryData.length > 0 && (
                      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                        <h3 className="text-sm font-semibold text-[#1B3A5C] mb-4">Industry Breakdown</h3>
                        <ResponsiveContainer width="100%" height={Math.max(200, industryData.length * 35)}>
                          <BarChart data={industryData} layout="vertical" margin={{ top: 5, right: 30, left: 120, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                            <XAxis type="number" tick={{ fontSize: 11 }} />
                            <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={120} />
                            <Tooltip />
                            <Bar dataKey="count" fill="#1B3A5C" radius={[0, 4, 4, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'individual' && (
                  <div className="space-y-6">
                    {indData.length === 0 ? (
                      <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
                        <h3 className="text-[#1B3A5C] font-semibold mb-2">No individual assessments yet</h3>
                        <p className="text-gray-400 text-sm">Individual capability data will appear here once participants complete the personal assessment.</p>
                      </div>
                    ) : (
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                            <h3 className="text-sm font-semibold text-[#1B3A5C] mb-4">Capability Label Distribution</h3>
                            <ResponsiveContainer width="100%" height={220}>
                              <BarChart data={capDist} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                                <YAxis tick={{ fontSize: 11 }} />
                                <Tooltip />
                                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                                  {capDist.map((entry, i) => (
                                    <Cell key={i} fill={entry.color} />
                                  ))}
                                </Bar>
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                            <h3 className="text-sm font-semibold text-[#1B3A5C] mb-4">Average Dimension Scores</h3>
                            <ResponsiveContainer width="100%" height={220}>
                              <RadarChart data={dimAvgData}>
                                <PolarGrid stroke="#e5e7eb" />
                                <PolarAngleAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 11 }} />
                                <Radar dataKey="score" stroke="#00ADA9" fill="#00ADA9" fillOpacity={0.2} strokeWidth={2} />
                                <Tooltip formatter={v => [`${v}%`]} />
                              </RadarChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                        {roleCap.length > 0 && (
                          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                            <h3 className="text-sm font-semibold text-[#1B3A5C] mb-4">Average Capability by Role Level</h3>
                            <ResponsiveContainer width="100%" height={Math.max(200, roleCap.length * 40)}>
                              <BarChart data={roleCap} layout="vertical" margin={{ top: 5, right: 30, left: 100, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} />
                                <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={100} />
                                <Tooltip formatter={v => [`${v}%`]} />
                                <Bar dataKey="score" fill="#00ADA9" radius={[0, 4, 4, 0]} />
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}

                {activeTab === 'feed' && (
                  <div className="space-y-3">
                    {liveFeed.length === 0 ? (
                      <p className="text-gray-400 text-sm text-center py-10">No responses yet.</p>
                    ) : (
                      liveFeed.map((item, i) => (
                        <div key={i} className="bg-white rounded-xl px-5 py-4 border border-gray-100 shadow-sm flex items-center justify-between">
                          <div>
                            <span className="font-semibold text-[#1B3A5C]">{item.firstName}</span>
                            <span className="text-gray-500 text-sm ml-2">from {item.organisation}</span>
                            <span className="text-gray-300 text-xs ml-2">
                              {item.type === 'org' ? 'Org assessment' : 'Individual assessment'}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            {item.maturityLevel && (
                              <span className="text-xs bg-[#E6FAF9] text-[#00ADA9] font-semibold px-2 py-1 rounded-full">
                                {item.maturityLevel}
                              </span>
                            )}
                            {item.capabilityLabel && (
                              <span className="text-xs bg-[#e8edf3] text-[#1B3A5C] font-semibold px-2 py-1 rounded-full">
                                {item.capabilityLabel}
                              </span>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  )
}
