import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase.js'
import { TEAM_TIERS } from '../data/teams.js'
import { PLAYER_TIERS } from '../data/players.js'

const LOCK_TIME = new Date('2026-06-11T16:00:00Z')

export default function PicksPage() {
  const [locked, setLocked] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [teamPicks, setTeamPicks] = useState({})   // { tier: teamName }
  const [playerPicks, setPlayerPicks] = useState({}) // { tier: playerName }

  useEffect(() => {
    const now = new Date()
    if (now >= LOCK_TIME) { setLocked(true); return }
    // also check db setting
    supabase.from('settings').select('value').eq('key', 'picks_locked').single()
      .then(({ data }) => { if (data?.value === 'true') setLocked(true) })
    const ms = LOCK_TIME - now
    const t = setTimeout(() => setLocked(true), ms)
    return () => clearTimeout(t)
  }, [])

  const allTeamsPicked = TEAM_TIERS.every(t => teamPicks[t.tier])
  const allPlayersPicked = PLAYER_TIERS.every(t => playerPicks[t.tier])
  const canSubmit = name.trim() && allTeamsPicked && allPlayersPicked

  async function handleSubmit(e) {
    e.preventDefault()
    if (!canSubmit || locked) return
    setSubmitting(true)
    setError('')
    const payload = {
      name: name.trim(),
      email: email.trim() || null,
      team_tier1: teamPicks[1],
      team_tier2: teamPicks[2],
      team_tier3: teamPicks[3],
      team_tier4: teamPicks[4],
      team_tier5: teamPicks[5],
      team_tier6: teamPicks[6],
      team_tier7: teamPicks[7],
      team_tier8: teamPicks[8],
      player_tier1: playerPicks[1],
      player_tier2: playerPicks[2],
      player_tier3: playerPicks[3],
      player_tier4: playerPicks[4],
      player_tier5: playerPicks[5],
    }
    const { error: err } = await supabase.from('entries').insert(payload)
    if (err) {
      setError('Something went wrong. Please try again.')
    } else {
      setSubmitted(true)
    }
    setSubmitting(false)
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <div className="text-6xl">⚽</div>
        <h2 className="text-3xl font-bold text-wc-gold">Picks Submitted!</h2>
        <p className="text-gray-400">Good luck, {name}! Check the leaderboard once the tournament starts.</p>
        <div className="tier-card mt-4 w-full max-w-md">
          <h3 className="font-bold mb-3 text-wc-gold">Your Teams</h3>
          {TEAM_TIERS.map(t => (
            <div key={t.tier} className="flex justify-between text-sm py-1 border-b border-wc-border last:border-0">
              <span className="text-gray-400">{t.label}</span>
              <span className="font-medium">{teamPicks[t.tier]}</span>
            </div>
          ))}
          <h3 className="font-bold mt-4 mb-3 text-wc-gold">Your Players</h3>
          {PLAYER_TIERS.map(t => (
            <div key={t.tier} className="flex justify-between text-sm py-1 border-b border-wc-border last:border-0">
              <span className="text-gray-400">{t.label}</span>
              <span className="font-medium">{playerPicks[t.tier]}</span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (locked) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <div className="text-6xl">🔒</div>
        <h2 className="text-3xl font-bold text-red-400">Picks Are Locked</h2>
        <p className="text-gray-400">The tournament has started. Check the leaderboard!</p>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-wc-gold mb-2">Submit Your Picks</h2>
        <p className="text-gray-400">
          Pick <strong className="text-white">1 team per tier</strong> and <strong className="text-white">1 player per tier</strong>.
          Picks lock at tournament kickoff — <span className="text-wc-gold">June 11, 2026 at noon ET</span>.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Identity */}
        <div className="tier-card space-y-4">
          <h3 className="font-bold text-lg">Your Info</h3>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Name *</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Your name"
              className="w-full bg-wc-dark border border-wc-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-wc-gold"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Email (optional)</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="For result notifications"
              className="w-full bg-wc-dark border border-wc-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-wc-gold"
            />
          </div>
        </div>

        {/* Team picks */}
        <div>
          <h3 className="text-xl font-bold mb-4">⚽ Team Picks <span className="text-sm font-normal text-gray-400">— 1 per tier</span></h3>
          <div className="space-y-4">
            {TEAM_TIERS.map(tier => (
              <div key={tier.tier} className="tier-card">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold">{tier.label}</h4>
                  {teamPicks[tier.tier] && (
                    <span className="text-wc-gold text-sm font-medium">✓ {teamPicks[tier.tier]}</span>
                  )}
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {tier.teams.map(team => (
                    <button
                      key={team.name}
                      type="button"
                      onClick={() => setTeamPicks(p => ({ ...p, [tier.tier]: team.name }))}
                      className={`rounded-lg px-3 py-2 text-sm text-left border transition-all ${
                        teamPicks[tier.tier] === team.name
                          ? 'selected-team border-wc-gold'
                          : 'border-wc-border hover:border-gray-500 bg-wc-dark'
                      }`}
                    >
                      <div className="font-medium">{team.name}</div>
                      <div className="text-xs text-gray-400">+{team.odds.toLocaleString()}</div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Player picks */}
        <div>
          <h3 className="text-xl font-bold mb-1">🥅 Player Picks <span className="text-sm font-normal text-gray-400">— 1 per tier</span></h3>
          <p className="text-sm text-gray-400 mb-4">+1 pt/goal (group stage) · +1.5 pts/goal (knockout)</p>
          <div className="space-y-4">
            {PLAYER_TIERS.map(tier => (
              <div key={tier.tier} className="tier-card">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold">{tier.label}</h4>
                  {playerPicks[tier.tier] && (
                    <span className="text-wc-gold text-sm font-medium">✓ {playerPicks[tier.tier]}</span>
                  )}
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {tier.players.map(player => (
                    <button
                      key={player.name}
                      type="button"
                      onClick={() => setPlayerPicks(p => ({ ...p, [tier.tier]: player.name }))}
                      className={`rounded-lg px-3 py-2 text-sm text-left border transition-all ${
                        playerPicks[tier.tier] === player.name
                          ? 'selected-team border-wc-gold'
                          : 'border-wc-border hover:border-gray-500 bg-wc-dark'
                      }`}
                    >
                      <div className="font-medium">{player.name}</div>
                      <div className="text-xs text-gray-500">{player.country}</div>
                      <div className="text-xs text-gray-400">+{player.odds.toLocaleString()}</div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <div className="flex items-center gap-4 pb-8">
          <button type="submit" className="btn-primary text-lg px-8 py-3" disabled={!canSubmit || submitting}>
            {submitting ? 'Submitting...' : 'Submit Picks'}
          </button>
          {!canSubmit && name.trim() && (
            <p className="text-sm text-gray-400">
              {!allTeamsPicked && 'Pick a team from each tier. '}
              {!allPlayersPicked && 'Pick a player from each tier.'}
            </p>
          )}
        </div>
      </form>
    </div>
  )
}
