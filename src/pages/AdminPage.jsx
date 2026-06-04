import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase.js'
import { ALL_TEAMS, getTeamOdds } from '../data/teams.js'
import { ALL_PLAYERS } from '../data/players.js'
import { calcTeamPoints, calcPlayerPoints } from '../data/scoring.js'

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'admin123'

export default function AdminPage() {
  const [authed, setAuthed] = useState(false)
  const [pw, setPw] = useState('')
  const [pwError, setPwError] = useState('')

  const [teamStats, setTeamStats] = useState({})
  const [playerStats, setPlayerStats] = useState({})
  const [entries, setEntries] = useState([])
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState('')
  const [activeTab, setActiveTab] = useState('teams')
  const [picksLocked, setPicksLocked] = useState(false)

  function login(e) {
    e.preventDefault()
    if (pw === ADMIN_PASSWORD) { setAuthed(true) }
    else { setPwError('Incorrect password') }
  }

  useEffect(() => {
    if (!authed) return
    async function load() {
      const [{ data: ts }, { data: ps }, { data: en }, { data: settings }] = await Promise.all([
        supabase.from('team_stats').select('*'),
        supabase.from('player_stats').select('*'),
        supabase.from('entries').select('*'),
        supabase.from('settings').select('*'),
      ])

      // Merge DB stats with full team/player lists so every team shows up
      const tsMap = Object.fromEntries((ts || []).map(t => [t.team_name, t]))
      const psMap = Object.fromEntries((ps || []).map(p => [p.player_name, p]))

      const teamDefaults = {}
      ALL_TEAMS.forEach(t => {
        teamDefaults[t.name] = tsMap[t.name] || {
          team_name: t.name, odds: t.odds,
          group_wins: 0, group_draws: 0, group_losses: 0,
          group_winner: false, knockout_advance: false,
          round_of_32_wins: 0, round_of_16_wins: 0,
          quarter_final_wins: 0, semi_final_wins: 0,
          champion: false, upset_wins: 0,
        }
      })

      const playerDefaults = {}
      ALL_PLAYERS.forEach(p => {
        playerDefaults[p.name] = psMap[p.name] || {
          player_name: p.name, odds: p.odds,
          group_goals: 0, knockout_goals: 0,
        }
      })

      setTeamStats(teamDefaults)
      setPlayerStats(playerDefaults)
      setEntries(en || [])
      const lockSetting = (settings || []).find(s => s.key === 'picks_locked')
      setPicksLocked(lockSetting?.value === 'true')
    }
    load()
  }, [authed])

  function updateTeam(name, field, value) {
    setTeamStats(prev => ({
      ...prev,
      [name]: { ...prev[name], [field]: value },
    }))
  }

  function updatePlayer(name, field, value) {
    setPlayerStats(prev => ({
      ...prev,
      [name]: { ...prev[name], [field]: value },
    }))
  }

  async function saveAll() {
    setSaving(true)
    setSaved('')

    // Upsert team stats
    const teamRows = Object.values(teamStats).map(t => ({
      team_name: t.team_name,
      odds: t.odds,
      group_wins: Number(t.group_wins) || 0,
      group_draws: Number(t.group_draws) || 0,
      group_losses: Number(t.group_losses) || 0,
      group_winner: Boolean(t.group_winner),
      knockout_advance: Boolean(t.knockout_advance),
      round_of_32_wins: Number(t.round_of_32_wins) || 0,
      round_of_16_wins: Number(t.round_of_16_wins) || 0,
      quarter_final_wins: Number(t.quarter_final_wins) || 0,
      semi_final_wins: Number(t.semi_final_wins) || 0,
      champion: Boolean(t.champion),
      upset_wins: Number(t.upset_wins) || 0,
    }))

    const playerRows = Object.values(playerStats).map(p => ({
      player_name: p.player_name,
      odds: p.odds,
      group_goals: Number(p.group_goals) || 0,
      knockout_goals: Number(p.knockout_goals) || 0,
    }))

    await Promise.all([
      supabase.from('team_stats').upsert(teamRows, { onConflict: 'team_name' }),
      supabase.from('player_stats').upsert(playerRows, { onConflict: 'player_name' }),
    ])

    // Recalculate points for every entry
    const updatedEntries = entries.map(entry => {
      let teamPts = 0
      let playerPts = 0

      for (let i = 1; i <= 8; i++) {
        const teamName = entry[`team_tier${i}`]
        if (teamName && teamStats[teamName]) {
          teamPts += calcTeamPoints(teamStats[teamName])
        }
      }
      for (let i = 1; i <= 5; i++) {
        const playerName = entry[`player_tier${i}`]
        if (playerName && playerStats[playerName]) {
          playerPts += calcPlayerPoints(playerStats[playerName])
        }
      }

      return { id: entry.id, team_points: teamPts, player_points: playerPts }
    })

    for (const e of updatedEntries) {
      await supabase.from('entries').update({
        team_points: e.team_points,
        player_points: e.player_points,
      }).eq('id', e.id)
    }

    setSaving(false)
    setSaved(`Saved at ${new Date().toLocaleTimeString()}`)
  }

  async function toggleLock() {
    const newVal = !picksLocked
    await supabase.from('settings').upsert({ key: 'picks_locked', value: String(newVal) }, { onConflict: 'key' })
    setPicksLocked(newVal)
  }

  if (!authed) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <div className="tier-card w-full max-w-sm space-y-4">
          <h2 className="text-xl font-bold text-wc-gold">Admin Login</h2>
          <form onSubmit={login} className="space-y-4">
            <input
              type="password"
              value={pw}
              onChange={e => setPw(e.target.value)}
              placeholder="Password"
              className="w-full bg-wc-dark border border-wc-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-wc-gold"
            />
            {pwError && <p className="text-red-400 text-sm">{pwError}</p>}
            <button type="submit" className="btn-primary w-full">Login</button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-wc-gold">Admin Panel</h2>
        <div className="flex items-center gap-3">
          <button
            onClick={toggleLock}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              picksLocked
                ? 'bg-red-900/50 border border-red-700 text-red-300 hover:bg-red-800/50'
                : 'bg-green-900/50 border border-green-700 text-green-300 hover:bg-green-800/50'
            }`}
          >
            {picksLocked ? '🔒 Picks Locked' : '🔓 Picks Open'}
          </button>
          <button onClick={saveAll} disabled={saving} className="btn-primary">
            {saving ? 'Saving...' : 'Save & Recalculate'}
          </button>
          {saved && <span className="text-green-400 text-sm">{saved}</span>}
        </div>
      </div>

      <div className="flex gap-2 mb-6">
        {['teams', 'players', 'entries'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
              activeTab === tab ? 'bg-wc-gold text-black' : 'bg-wc-card border border-wc-border text-gray-400 hover:text-white'
            }`}
          >
            {tab === 'teams' ? '⚽ Teams' : tab === 'players' ? '🥅 Players' : '📋 Entries'}
          </button>
        ))}
      </div>

      {activeTab === 'teams' && (
        <div className="space-y-1">
          <div className="grid grid-cols-[1fr_repeat(3,3rem)_repeat(2,5rem)_repeat(4,3.5rem)_4rem] gap-2 text-xs text-gray-500 px-3 py-1">
            <span>Team</span><span className="text-center">W</span><span className="text-center">D</span><span className="text-center">L</span>
            <span className="text-center">1st</span><span className="text-center">KO</span>
            <span className="text-center">R32</span><span className="text-center">R16</span><span className="text-center">QF</span><span className="text-center">SF</span>
            <span className="text-center">🏆</span>
          </div>
          {ALL_TEAMS.map(t => {
            const s = teamStats[t.name] || {}
            return (
              <div key={t.name} className="tier-card grid grid-cols-[1fr_repeat(3,3rem)_repeat(2,5rem)_repeat(4,3.5rem)_4rem] gap-2 items-center py-2">
                <span className="font-medium text-sm truncate">{t.name}</span>
                {['group_wins','group_draws','group_losses'].map(f => (
                  <input key={f} type="number" min="0" max="9" value={s[f] || 0}
                    onChange={e => updateTeam(t.name, f, parseInt(e.target.value) || 0)}
                    className="w-full bg-wc-dark border border-wc-border rounded px-1 py-1 text-center text-sm focus:outline-none focus:border-wc-gold"
                  />
                ))}
                {[['group_winner','1st'],['knockout_advance','KO']].map(([f, label]) => (
                  <button key={f} onClick={() => updateTeam(t.name, f, !s[f])}
                    className={`rounded px-2 py-1 text-xs font-medium transition-colors ${s[f] ? 'bg-green-600 text-white' : 'bg-wc-dark border border-wc-border text-gray-500'}`}
                  >{label}</button>
                ))}
                {['round_of_32_wins','round_of_16_wins','quarter_final_wins','semi_final_wins'].map(f => (
                  <input key={f} type="number" min="0" max="9" value={s[f] || 0}
                    onChange={e => updateTeam(t.name, f, parseInt(e.target.value) || 0)}
                    className="w-full bg-wc-dark border border-wc-border rounded px-1 py-1 text-center text-sm focus:outline-none focus:border-wc-gold"
                  />
                ))}
                <button onClick={() => updateTeam(t.name, 'champion', !s.champion)}
                  className={`rounded px-2 py-1 text-xs font-medium transition-colors ${s.champion ? 'bg-wc-gold text-black' : 'bg-wc-dark border border-wc-border text-gray-500'}`}
                >🏆</button>
              </div>
            )
          })}
        </div>
      )}

      {activeTab === 'players' && (
        <div className="space-y-1">
          <div className="grid grid-cols-[1fr_8rem_8rem] gap-4 text-xs text-gray-500 px-3 py-1">
            <span>Player</span><span className="text-center">Group Goals</span><span className="text-center">Knockout Goals</span>
          </div>
          {ALL_PLAYERS.map(p => {
            const s = playerStats[p.name] || {}
            return (
              <div key={p.name} className="tier-card grid grid-cols-[1fr_8rem_8rem] gap-4 items-center py-2">
                <span className="font-medium text-sm">{p.name}</span>
                <input type="number" min="0" step="1" value={s.group_goals || 0}
                  onChange={e => updatePlayer(p.name, 'group_goals', parseInt(e.target.value) || 0)}
                  className="bg-wc-dark border border-wc-border rounded px-2 py-1 text-center text-sm focus:outline-none focus:border-wc-gold"
                />
                <input type="number" min="0" step="1" value={s.knockout_goals || 0}
                  onChange={e => updatePlayer(p.name, 'knockout_goals', parseInt(e.target.value) || 0)}
                  className="bg-wc-dark border border-wc-border rounded px-2 py-1 text-center text-sm focus:outline-none focus:border-wc-gold"
                />
              </div>
            )
          })}
        </div>
      )}

      {activeTab === 'entries' && (
        <div className="space-y-2">
          <p className="text-gray-400 text-sm mb-4">{entries.length} entries submitted</p>
          {entries.map(e => (
            <div key={e.id} className="tier-card">
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-bold">{e.name}</span>
                  {e.email && <span className="text-gray-400 text-sm ml-2">{e.email}</span>}
                </div>
                <span className="text-wc-gold font-bold">{(e.total_points || 0).toFixed(1)} pts</span>
              </div>
              <div className="mt-2 grid grid-cols-2 gap-x-8 gap-y-0.5 text-xs text-gray-400">
                {[1,2,3,4,5,6,7,8].map(i => (
                  <span key={i}>T{i}: <span className="text-white">{e[`team_tier${i}`]}</span></span>
                ))}
                {[1,2,3,4,5].map(i => (
                  <span key={i}>P{i}: <span className="text-white">{e[`player_tier${i}`]}</span></span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
