import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase.js'
import { TEAM_TIERS } from '../data/teams.js'
import { PLAYER_TIERS } from '../data/players.js'

export default function StatsPage() {
  const [entries, setEntries] = useState([])
  const [teamStats, setTeamStats] = useState({})
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('root')

  useEffect(() => {
    async function load() {
      const [{ data: e }, { data: ts }] = await Promise.all([
        supabase.from('entries').select('*'),
        supabase.from('team_stats').select('*'),
      ])
      setEntries(e || [])
      setTeamStats(Object.fromEntries((ts || []).map(t => [t.team_name, t])))
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return <div className="text-center py-24 text-gray-400">Loading...</div>

  const n = entries.length

  // Count picks per tier
  const teamCounts = {}
  const playerCounts = {}
  for (let i = 1; i <= 8; i++) teamCounts[i] = {}
  for (let i = 1; i <= 5; i++) playerCounts[i] = {}

  entries.forEach(e => {
    for (let i = 1; i <= 8; i++) {
      const v = e[`team_tier${i}`]
      if (v) teamCounts[i][v] = (teamCounts[i][v] || 0) + 1
    }
    for (let i = 1; i <= 5; i++) {
      const v = e[`player_tier${i}`]
      if (v) playerCounts[i][v] = (playerCounts[i][v] || 0) + 1
    }
  })

  // Most unique entries
  const uniqueness = entries.map(e => {
    let score = 0
    for (let i = 1; i <= 8; i++) {
      const v = e[`team_tier${i}`]
      if (v && teamCounts[i][v] <= 2) score++
    }
    for (let i = 1; i <= 5; i++) {
      const v = e[`player_tier${i}`]
      if (v && playerCounts[i][v] <= 2) score++
    }
    return { name: e.name, score }
  }).sort((a, b) => b.score - a.score)

  function Bar({ count, total }) {
    const pct = Math.round(count / total * 100)
    return (
      <div className="flex items-center gap-2 w-full">
        <div className="flex-1 bg-wc-dark rounded-full h-1.5">
          <div className="bg-wc-gold h-1.5 rounded-full" style={{ width: `${pct}%` }} />
        </div>
        <span className="text-xs text-gray-400 w-14 text-right">{count}/{total} ({pct}%)</span>
      </div>
    )
  }

  // Teams confirmed eliminated. 48-team format: top 2 per group + 8 best 3rd-place teams advance,
  // so a 3rd-place finisher is NOT eliminated until the cross-group tally is in — admin curates this set.
  const FORCE_ELIMINATED = new Set([
    'Haiti', 'Turkey', 'Tunisia', 'Jordan', 'Panama',
    'Czech Republic', 'Qatar', 'Scotland', 'South Korea', 'New Zealand',
    'Iran', 'Saudi Arabia', 'Uruguay', 'Curacao', 'Iraq', 'Uzbekistan',
    'South Africa', 'Japan', 'Germany', 'Ivory Coast', 'Netherlands', 'Sweden',
    'Ecuador', 'DR Congo', 'Senegal', 'Bosnia', 'Austria', 'Croatia', 'Algeria',
    'Australia', 'Cape Verde', 'Ghana', 'Canada', 'Paraguay', 'Brazil', 'Mexico',
    'Portugal', 'USA', 'Egypt',
  ])

  // Count how many entries have each team (across all tiers)
  const teamPickCounts = {}
  entries.forEach(e => {
    for (let i = 1; i <= 8; i++) {
      const v = e[`team_tier${i}`]
      if (v) teamPickCounts[v] = (teamPickCounts[v] || 0) + 1
    }
  })

  const isEliminated = (name) => FORCE_ELIMINATED.has(name)

  const aliveTeams = Object.entries(teamPickCounts)
    .map(([name, count]) => ({ name, count, s: teamStats[name] || {}, eliminated: isEliminated(name) }))
    .filter(t => !t.eliminated)
    .sort((a, b) => b.count - a.count)

  const eliminatedTeams = Object.entries(teamPickCounts)
    .map(([name, count]) => ({ name, count, eliminated: isEliminated(name) }))
    .filter(t => t.eliminated)
    .sort((a, b) => b.count - a.count)

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-wc-gold">Pool Stats</h2>
        <p className="text-gray-400 mt-1">{n} entries total</p>
      </div>

      <div className="flex gap-2">
        {[
          { key: 'root', label: '🎯 Who to Root For' },
          { key: 'picks', label: '📊 Pick Breakdown' },
          { key: 'unique', label: '🦄 Most Unique' },
        ].map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className={`px-3 py-1.5 rounded-lg font-medium text-sm transition-colors ${
              activeTab === tab.key ? 'bg-wc-gold text-black' : 'bg-wc-card border border-wc-border text-gray-400 hover:text-white'
            }`}>
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'root' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-bold mb-1">Still Alive</h3>
            <p className="text-gray-400 text-sm mb-4">Teams still in the tournament — the more entries that have them, the more the pool is rooting for them.</p>
            <div className="space-y-2">
              {aliveTeams.length === 0 && (
                <p className="text-gray-500 text-sm">No knockout data yet — check back once the group stage is complete.</p>
              )}
              {aliveTeams.map(({ name, count, s }) => {
                const pct = Math.round(count / n * 100)
                const isChampion = s.champion
                const round = isChampion ? '🏆 Champion'
                  : s.semi_final_wins > 0 ? 'Semifinal'
                  : s.quarter_final_wins > 0 ? 'Quarterfinal'
                  : s.round_of_16_wins > 0 ? 'Round of 16'
                  : s.round_of_32_wins > 0 ? 'Round of 32'
                  : s.knockout_advance ? 'Qualified'
                  : 'Group stage'
                return (
                  <div key={name} className="tier-card flex items-center gap-4">
                    <div className="w-36 shrink-0">
                      <div className="font-medium text-sm">{name}</div>
                      <div className="text-xs text-gray-500">{round}</div>
                    </div>
                    <div className="flex-1">
                      <div className="flex-1 bg-wc-dark rounded-full h-2">
                        <div className="bg-wc-gold h-2 rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                    <div className="text-sm font-bold text-wc-gold w-16 text-right">{count} entries</div>
                    <div className="text-xs text-gray-500 w-10 text-right">{pct}%</div>
                  </div>
                )
              })}
            </div>
          </div>

          {eliminatedTeams.length > 0 && (
            <div>
              <h3 className="text-lg font-bold mb-1 text-gray-500">Eliminated</h3>
              <div className="space-y-1">
                {eliminatedTeams.map(({ name, count }) => (
                  <div key={name} className="flex items-center justify-between px-3 py-2 rounded-lg bg-wc-card/50 border border-wc-border/30">
                    <span className="text-sm text-gray-500 line-through">{name}</span>
                    <span className="text-xs text-gray-600">{count} {count === 1 ? 'entry' : 'entries'} affected</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'picks' && (
        <div className="space-y-10">

      {/* Team picks by tier */}
      <div>
        <h3 className="text-xl font-bold mb-4 mt-4">Team Picks by Tier</h3>
        <div className="space-y-6">
          {TEAM_TIERS.map(tier => {
            const counts = teamCounts[tier.tier] || {}
            const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1])
            if (!sorted.length) return null
            const most = sorted[0]
            const least = sorted[sorted.length - 1]
            return (
              <div key={tier.tier} className="tier-card">
                <h4 className="font-semibold text-sm text-gray-400 mb-3">{tier.label}</h4>
                <div className="space-y-2">
                  {sorted.map(([name, count]) => {
                    const out = FORCE_ELIMINATED.has(name)
                    return (
                    <div key={name}>
                      <div className="flex justify-between text-sm mb-0.5">
                        <span className={`font-medium ${
                          out ? 'line-through text-gray-500' :
                          name === most[0] ? 'text-wc-gold' :
                          name === least[0] && sorted.length > 1 ? 'text-gray-500' : 'text-white'
                        }`}>
                          {name}
                          {!out && name === most[0] && <span className="ml-1 text-xs">👑</span>}
                          {!out && name === least[0] && sorted.length > 1 && <span className="ml-1 text-xs text-gray-600">← least</span>}
                          {out && <span className="ml-1 text-xs text-red-500 no-underline" title="Eliminated">✕</span>}
                        </span>
                      </div>
                      <Bar count={count} total={n} />
                    </div>
                  )})}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Player picks by tier */}
      <div>
        <h3 className="text-xl font-bold mb-4">Player Picks by Tier</h3>
        <div className="space-y-6">
          {PLAYER_TIERS.map(tier => {
            const counts = playerCounts[tier.tier] || {}
            const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1])
            if (!sorted.length) return null
            const most = sorted[0]
            const least = sorted[sorted.length - 1]
            return (
              <div key={tier.tier} className="tier-card">
                <h4 className="font-semibold text-sm text-gray-400 mb-3">{tier.label}</h4>
                <div className="space-y-2">
                  {sorted.map(([name, count]) => (
                    <div key={name}>
                      <div className="flex justify-between text-sm mb-0.5">
                        <span className={`font-medium ${
                          name === most[0] ? 'text-wc-gold' :
                          name === least[0] && sorted.length > 1 ? 'text-gray-500' : 'text-white'
                        }`}>
                          {name}
                          {name === most[0] && <span className="ml-1 text-xs">👑</span>}
                          {name === least[0] && sorted.length > 1 && <span className="ml-1 text-xs text-gray-600">← least</span>}
                        </span>
                      </div>
                      <Bar count={count} total={n} />
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      </div>
      )}

      {activeTab === 'unique' && (
      <div>
        <h3 className="text-xl font-bold mb-1">Most Unique Entries</h3>
        <p className="text-gray-400 text-sm mb-4">Entries with the most picks chosen by 2 or fewer other people</p>
        <div className="tier-card space-y-3">
          {uniqueness.slice(0, 10).map((u, i) => (
            <div key={u.name} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-gray-500 text-sm w-5">{i + 1}</span>
                <span className="font-medium">{u.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-32 bg-wc-dark rounded-full h-1.5">
                  <div className="bg-wc-gold h-1.5 rounded-full" style={{ width: `${u.score / 13 * 100}%` }} />
                </div>
                <span className="text-xs text-gray-400 w-16 text-right">{u.score}/13 unique</span>
              </div>
            </div>
          ))}
          {uniqueness.every(u => u.score === 0) && (
            <p className="text-gray-500 text-sm">Not enough entries yet to calculate uniqueness.</p>
          )}
        </div>
      </div>
      )}
    </div>
  )
}
