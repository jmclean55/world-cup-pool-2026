import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase.js'
import { TEAM_TIERS } from '../data/teams.js'
import { PLAYER_TIERS } from '../data/players.js'

export default function StatsPage() {
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('entries').select('*').then(({ data }) => {
      setEntries(data || [])
      setLoading(false)
    })
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

  return (
    <div className="max-w-3xl mx-auto space-y-10">
      <h2 className="text-3xl font-bold text-wc-gold">Pool Stats</h2>
      <p className="text-gray-400 -mt-6">{n} entries total</p>

      {/* Team picks by tier */}
      <div>
        <h3 className="text-xl font-bold mb-4">Team Picks by Tier</h3>
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

      {/* Most unique entries */}
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
    </div>
  )
}
