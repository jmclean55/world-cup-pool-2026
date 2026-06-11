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
  const [teamPicks, setTeamPicks] = useState({})
  const [playerPicks, setPlayerPicks] = useState({})
  const [freddyVisible, setFreddyVisible] = useState(false)
  const [existingEntry, setExistingEntry] = useState(null)
  const [lookupName, setLookupName] = useState('')
  const [lookupEmail, setLookupEmail] = useState('')
  const [lookupError, setLookupError] = useState('')
  const [mode, setMode] = useState('new') // 'new' | 'edit-lookup' | 'edit-form'

  useEffect(() => {
    const now = new Date()
    if (now >= LOCK_TIME) { setLocked(true); return }
    supabase.from('settings').select('value').eq('key', 'picks_locked').single()
      .then(({ data }) => { if (data?.value === 'true') setLocked(true) })
    const ms = LOCK_TIME - now
    const t = setTimeout(() => setLocked(true), ms)
    return () => clearTimeout(t)
  }, [])

  async function handleLookup(e) {
    e.preventDefault()
    setLookupError('')
    const { data } = await supabase
      .from('entries')
      .select('*')
      .ilike('name', lookupName.trim())
      .single()
    if (!data) {
      setLookupError('No entry found with that name. Check the spelling and try again.')
      return
    }
    // Require email verification before allowing edits
    if (!data.email) {
      setLookupError('This entry has no email on file. Contact the commissioner to make changes.')
      return
    }
    if (data.email.toLowerCase() !== lookupEmail.trim().toLowerCase()) {
      setLookupError('Email does not match our records. Please try again.')
      return
    }
    // Pre-fill the form with existing picks
    setExistingEntry(data)
    setName(data.name)
    setEmail(data.email || '')
    setTeamPicks({
      1: data.team_tier1, 2: data.team_tier2, 3: data.team_tier3, 4: data.team_tier4,
      5: data.team_tier5, 6: data.team_tier6, 7: data.team_tier7, 8: data.team_tier8,
    })
    setPlayerPicks({
      1: data.player_tier1, 2: data.player_tier2, 3: data.player_tier3,
      4: data.player_tier4, 5: data.player_tier5,
    })
    setMode('edit-form')
  }

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
      team_tier1: teamPicks[1], team_tier2: teamPicks[2], team_tier3: teamPicks[3],
      team_tier4: teamPicks[4], team_tier5: teamPicks[5], team_tier6: teamPicks[6],
      team_tier7: teamPicks[7], team_tier8: teamPicks[8],
      player_tier1: playerPicks[1], player_tier2: playerPicks[2], player_tier3: playerPicks[3],
      player_tier4: playerPicks[4], player_tier5: playerPicks[5],
    }

    let err
    if (existingEntry) {
      // Update existing entry
      const { error: updateErr } = await supabase
        .from('entries')
        .update(payload)
        .eq('id', existingEntry.id)
      err = updateErr
    } else {
      const { error: insertErr } = await supabase.from('entries').insert(payload)
      err = insertErr
    }

    if (err) {
      setError('Something went wrong. Please try again.')
      setSubmitting(false)
      return
    }

    // Notify admin via Web3Forms
    const teamSummary = TEAM_TIERS.map(t => `T${t.tier}: ${teamPicks[t.tier]}`).join(', ')
    const playerSummary = PLAYER_TIERS.map(t => `P${t.tier}: ${playerPicks[t.tier]}`).join(', ')
    fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        access_key: 'cbdd066b-9202-4529-8ef2-3394906a0ee2',
        subject: existingEntry ? `Updated WC Pool Entry: ${name.trim()}` : `New WC Pool Entry: ${name.trim()}`,
        message: `${existingEntry ? 'Updated' : 'New'} entry from ${name.trim()}${email ? ` (${email})` : ''}.\n\nTeams: ${teamSummary}\n\nPlayers: ${playerSummary}`,
      }),
    }).catch(() => {})

    setSubmitted(true)
    setSubmitting(false)
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <div className="text-6xl">⚽</div>
        <h2 className="text-3xl font-bold text-wc-gold">
          {existingEntry ? 'Picks Updated!' : 'Picks Submitted!'}
        </h2>
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

  if (mode === 'edit-lookup') {
    return (
      <div className="max-w-md mx-auto pt-16">
        <button onClick={() => setMode('new')} className="text-gray-400 hover:text-white text-sm mb-6 flex items-center gap-1">
          ← Back
        </button>
        <h2 className="text-2xl font-bold text-wc-gold mb-2">Edit Your Picks</h2>
        <p className="text-gray-400 mb-6">Enter the name you used when you submitted your picks.</p>
        <form onSubmit={handleLookup} className="space-y-4">
          <input
            type="text"
            value={lookupName}
            onChange={e => setLookupName(e.target.value)}
            placeholder="Your name (as submitted)"
            className="w-full bg-wc-dark border border-wc-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-wc-gold"
            required
          />
          <input
            type="email"
            value={lookupEmail}
            onChange={e => setLookupEmail(e.target.value)}
            placeholder="Email address (to verify it's you)"
            className="w-full bg-wc-dark border border-wc-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-wc-gold"
            required
          />
          {lookupError && <p className="text-red-400 text-sm">{lookupError}</p>}
          <button type="submit" className="btn-primary w-full">Find My Picks</button>
        </form>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold text-wc-gold mb-2">
            {mode === 'edit-form' ? `Editing: ${existingEntry?.name}` : 'Submit Your Picks'}
          </h2>
          {mode === 'new' && (
            <button
              onClick={() => setMode('edit-lookup')}
              className="text-sm text-wc-gold hover:underline"
            >
              Already submitted? Edit your picks →
            </button>
          )}
          {mode === 'edit-form' && (
            <button onClick={() => { setMode('new'); setExistingEntry(null); setName(''); setEmail(''); setTeamPicks({}); setPlayerPicks({}) }}
              className="text-sm text-gray-400 hover:text-white">
              ← Cancel
            </button>
          )}
        </div>
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
              disabled={mode === 'edit-form'}
              className="w-full bg-wc-dark border border-wc-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-wc-gold disabled:opacity-50"
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
                      onClick={() => {
                        if (player.easterEgg) { setFreddyVisible(true); return }
                        setPlayerPicks(p => ({ ...p, [tier.tier]: player.name }))
                      }}
                      className={`rounded-lg px-3 py-2 text-sm text-left border transition-all ${
                        player.easterEgg
                          ? 'border-wc-border hover:border-yellow-500 bg-wc-dark opacity-75'
                          : playerPicks[tier.tier] === player.name
                          ? 'selected-team border-wc-gold'
                          : 'border-wc-border hover:border-gray-500 bg-wc-dark'
                      }`}
                    >
                      <div className="font-medium">{player.name}</div>
                      <div className="text-xs text-gray-500">{player.country}</div>
                      <div className="text-xs text-gray-400">
                        {player.easterEgg ? '🌟 Legend' : `+${player.odds.toLocaleString()}`}
                      </div>
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
            {submitting ? 'Saving...' : existingEntry ? 'Update Picks' : 'Submit Picks'}
          </button>
          {!canSubmit && name.trim() && (
            <p className="text-sm text-gray-400">
              {!allTeamsPicked && 'Pick a team from each tier. '}
              {!allPlayersPicked && 'Pick a player from each tier.'}
            </p>
          )}
        </div>
      </form>

      {freddyVisible && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          onClick={() => setFreddyVisible(false)}
        >
          <div className="text-center space-y-4 p-8" onClick={e => e.stopPropagation()}>
            <p className="text-2xl font-bold text-wc-gold">Nice try... 😂</p>
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTuijzHzR_3w6RLZ_1Ero1Pb-1NB1ig1ftShsxaUspU7g&s=10"
              alt="Freddy Adu"
              className="w-64 rounded-xl mx-auto shadow-2xl"
            />
            <p className="text-gray-400 text-sm">Freddy Adu is not eligible for this pool.</p>
            <button onClick={() => setFreddyVisible(false)} className="btn-primary">Close</button>
          </div>
        </div>
      )}
    </div>
  )
}
