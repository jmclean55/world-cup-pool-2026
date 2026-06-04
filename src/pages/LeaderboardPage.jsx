import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase.js'
import { TEAM_TIERS } from '../data/teams.js'
import { PLAYER_TIERS } from '../data/players.js'

export default function LeaderboardPage() {
  const [entries, setEntries] = useState([])
  const [teamStats, setTeamStats] = useState({})
  const [playerStats, setPlayerStats] = useState({})
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(null)

  useEffect(() => {
    async function load() {
      const [{ data: e }, { data: ts }, { data: ps }] = await Promise.all([
        supabase.from('entries').select('*').order('total_points', { ascending: false }),
        supabase.from('team_stats').select('*'),
        supabase.from('player_stats').select('*'),
      ])
      setEntries(e || [])
      setTeamStats(Object.fromEntries((ts || []).map(t => [t.team_name, t])))
      setPlayerStats(Object.fromEntries((ps || []).map(p => [p.player_name, p])))
      setLoading(false)
    }
    load()
  }, [])

  function getTeamPts(entry) { return entry.team_points || 0 }
  function getPlayerPts(entry) { return entry.player_points || 0 }

  function getEntryTeams(entry) {
    return [1,2,3,4,5,6,7,8].map(i => entry[`team_tier${i}`]).filter(Boolean)
  }
  function getEntryPlayers(entry) {
    return [1,2,3,4,5].map(i => entry[`player_tier${i}`]).filter(Boolean)
  }

  if (loading) return <div className="text-center py-24 text-gray-400">Loading leaderboard...</div>

  if (entries.length === 0) {
    return (
      <div className="text-center py-24">
        <div className="text-5xl mb-4">📋</div>
        <h2 className="text-2xl font-bold text-wc-gold mb-2">No Entries Yet</h2>
        <p className="text-gray-400">Be the first to submit your picks!</p>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-3xl font-bold text-wc-gold mb-6">Leaderboard</h2>
      <div className="space-y-2">
        {entries.map((entry, idx) => (
          <div key={entry.id} className="tier-card">
            <button
              className="w-full text-left"
              onClick={() => setExpanded(expanded === entry.id ? null : entry.id)}
            >
              <div className="flex items-center gap-4">
                <span className={`text-2xl font-black w-8 shrink-0 ${
                  idx === 0 ? 'text-wc-gold' : idx === 1 ? 'text-gray-300' : idx === 2 ? 'text-amber-600' : 'text-gray-500'
                }`}>
                  {idx + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-lg">{entry.name}</div>
                  <div className="text-xs text-gray-400">
                    Teams: {getTeamPts(entry).toFixed(1)} pts · Players: {getPlayerPts(entry).toFixed(1)} pts
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-2xl font-black text-wc-gold">{(entry.total_points || 0).toFixed(1)}</div>
                  <div className="text-xs text-gray-400">points</div>
                </div>
                <span className="text-gray-500 text-sm">{expanded === entry.id ? '▲' : '▼'}</span>
              </div>
            </button>

            {expanded === entry.id && (
              <div className="mt-4 pt-4 border-t border-wc-border grid sm:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-wc-gold mb-2 text-sm uppercase tracking-wide">Teams</h4>
                  {TEAM_TIERS.map((tier, i) => {
                    const pick = entry[`team_tier${tier.tier}`]
                    const stats = teamStats[pick] || {}
                    const pts = entry.team_points
                    return (
                      <div key={tier.tier} className="flex justify-between text-sm py-1.5 border-b border-wc-border/50 last:border-0">
                        <div>
                          <span className="text-gray-400 text-xs">T{tier.tier} </span>
                          <span className="font-medium">{pick}</span>
                          {stats.champion && <span className="ml-1 text-wc-gold text-xs">🏆</span>}
                          {stats.knockout_advance && !stats.champion && <span className="ml-1 text-xs text-green-400">KO</span>}
                        </div>
                      </div>
                    )
                  })}
                </div>
                <div>
                  <h4 className="font-semibold text-wc-gold mb-2 text-sm uppercase tracking-wide">Players</h4>
                  {PLAYER_TIERS.map(tier => {
                    const pick = entry[`player_tier${tier.tier}`]
                    const stats = playerStats[pick] || {}
                    const goals = (stats.group_goals || 0) + (stats.knockout_goals || 0)
                    return (
                      <div key={tier.tier} className="flex justify-between text-sm py-1.5 border-b border-wc-border/50 last:border-0">
                        <div>
                          <span className="text-gray-400 text-xs">T{tier.tier} </span>
                          <span className="font-medium">{pick}</span>
                        </div>
                        <span className="text-gray-400">{goals > 0 ? `${goals}G` : '—'}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
