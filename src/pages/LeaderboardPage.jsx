import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase.js'
import { TEAM_TIERS } from '../data/teams.js'
import { PLAYER_TIERS } from '../data/players.js'
import { SCORING } from '../data/scoring.js'
import { entryGroupGamesRemaining } from '../data/schedule.js'

function calcTeamPts(s) {
  if (!s) return 0
  return (s.group_wins || 0) * SCORING.groupWin
    + (s.group_draws || 0) * SCORING.groupDraw
    + (s.group_winner ? SCORING.groupWinnerBonus : 0)
    + (s.knockout_advance ? SCORING.knockoutAdvance : 0)
    + (s.round_of_32_wins || 0) * SCORING.roundOf32Win
    + (s.round_of_16_wins || 0) * SCORING.roundOf16Win
    + (s.quarter_final_wins || 0) * SCORING.quarterFinalWin
    + (s.semi_final_wins || 0) * SCORING.semiFinalWin
    + (s.champion ? SCORING.champion : 0)
    + (s.upset_wins || 0) * SCORING.upsetBonus
}

const LOCK_TIME = new Date('2026-06-11T19:00:00Z')
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'admin123'

// Names who have paid — update this list as payments come in
const PAID_NAMES = [
  'tommy carey',
  'krooster',
  'michael madiraca',
  'paul f',
  'gary',
  'liz',
  'brian',
  'robbo',
  'olivia cat',
  'illiyaan',
  'kirk',
  'travis',
  'wyatt',
  'will',
]

function hasPaid(name) {
  return PAID_NAMES.some(p => name?.toLowerCase().includes(p.toLowerCase()))
}

export default function LeaderboardPage() {
  const [entries, setEntries] = useState([])
  const [teamStats, setTeamStats] = useState({})
  const [playerStats, setPlayerStats] = useState({})
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(null)
  const [adminPw, setAdminPw] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)
  const [showAdminLogin, setShowAdminLogin] = useState(false)

  const picksRevealed = new Date() >= LOCK_TIME || isAdmin

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
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-wc-gold">Leaderboard</h2>
        {!picksRevealed && !isAdmin && (
          <button
            onClick={() => setShowAdminLogin(v => !v)}
            className="text-xs text-gray-500 hover:text-gray-300"
          >
            Commish login
          </button>
        )}
      </div>

      {/* Commish login */}
      {showAdminLogin && !isAdmin && (
        <div className="tier-card mb-6 max-w-sm flex gap-2 items-center">
          <input
            type="password"
            value={adminPw}
            onChange={e => setAdminPw(e.target.value)}
            placeholder="Admin password"
            className="flex-1 bg-wc-dark border border-wc-border rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:border-wc-gold"
          />
          <button
            onClick={() => {
              if (adminPw === ADMIN_PASSWORD) { setIsAdmin(true); setShowAdminLogin(false) }
              else setAdminPw('')
            }}
            className="btn-primary text-sm py-1.5"
          >
            View
          </button>
        </div>
      )}

      {/* Pre-kickoff banner */}
      {!picksRevealed && (
        <div className="tier-card border-yellow-600/40 bg-yellow-900/10 mb-6 text-center py-4">
          <p className="text-yellow-400 font-medium">🔒 Picks are hidden until tournament kickoff on June 11</p>
          <p className="text-gray-400 text-sm mt-1">You can see who entered, but not what they picked.</p>
        </div>
      )}

      {/* Payment legend */}
      <div className="text-xs text-gray-500 mb-4 flex items-center gap-1.5">
        <span className="text-green-400">✓</span>
        <span>= entry fee received</span>
      </div>

      <div className="space-y-2">
        {entries.map((entry, idx) => (
          <div key={entry.id} className="tier-card">
            <button
              className="w-full text-left"
              onClick={() => picksRevealed && setExpanded(expanded === entry.id ? null : entry.id)}
            >
              <div className="flex items-center gap-4">
                <span className={`text-2xl font-black w-8 shrink-0 ${
                  idx === 0 ? 'text-wc-gold' : idx === 1 ? 'text-gray-300' : idx === 2 ? 'text-amber-600' : 'text-gray-500'
                }`}>
                  {idx + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-lg flex items-center gap-2">
                    {entry.name}
                    {hasPaid(entry.name) && (
                      <span className="text-green-400 text-sm font-normal" title="Entry fee received">✓</span>
                    )}
                  </div>
                  {picksRevealed ? (
                    <div className="text-xs text-gray-400">
                      Teams: {getTeamPts(entry).toFixed(1)} pts · Players: {getPlayerPts(entry).toFixed(1)} pts
                      <span className="ml-2 text-gray-500">· {entryGroupGamesRemaining(entry)} group games left</span>
                    </div>
                  ) : (
                    <div className="text-xs text-gray-500">Picks hidden until kickoff</div>
                  )}
                </div>
                {picksRevealed && (
                  <div className="text-right shrink-0">
                    <div className="text-2xl font-black text-wc-gold">{(entry.total_points || 0).toFixed(1)}</div>
                    <div className="text-xs text-gray-400">points</div>
                  </div>
                )}
                {picksRevealed && (
                  <span className="text-gray-500 text-sm">{expanded === entry.id ? '▲' : '▼'}</span>
                )}
              </div>
            </button>

            {picksRevealed && expanded === entry.id && (
              <div className="mt-4 pt-4 border-t border-wc-border grid sm:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-wc-gold mb-2 text-sm uppercase tracking-wide">Teams</h4>
                  {TEAM_TIERS.map(tier => {
                    const pick = entry[`team_tier${tier.tier}`]
                    const stats = teamStats[pick] || {}
                    const pts = calcTeamPts(stats)
                    return (
                      <div key={tier.tier} className="flex justify-between text-sm py-1.5 border-b border-wc-border/50 last:border-0">
                        <div>
                          <span className="text-gray-400 text-xs">T{tier.tier} </span>
                          <span className="font-medium">{pick}</span>
                          {stats.champion && <span className="ml-1 text-wc-gold text-xs">🏆</span>}
                          {stats.knockout_advance && !stats.champion && <span className="ml-1 text-xs text-green-400">KO</span>}
                        </div>
                        <span className="text-gray-400">{pts > 0 ? `${pts}pts` : '—'}</span>
                      </div>
                    )
                  })}
                </div>
                <div>
                  <h4 className="font-semibold text-wc-gold mb-2 text-sm uppercase tracking-wide">Players</h4>
                  {PLAYER_TIERS.map(tier => {
                    const pick = entry[`player_tier${tier.tier}`]
                    const stats = playerStats[pick] || {}
                    const pts = (stats.group_goals || 0) * SCORING.playerGroupGoal
                      + (stats.knockout_goals || 0) * SCORING.playerKnockoutGoal
                    return (
                      <div key={tier.tier} className="flex justify-between text-sm py-1.5 border-b border-wc-border/50 last:border-0">
                        <div>
                          <span className="text-gray-400 text-xs">T{tier.tier} </span>
                          <span className="font-medium">{pick}</span>
                        </div>
                        <span className="text-gray-400">{pts > 0 ? `${pts.toFixed(1)}pts` : '—'}</span>
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
