import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase.js'
import { ALL_TEAMS } from '../data/teams.js'
import { ALL_PLAYERS } from '../data/players.js'

export default function ResultsPage() {
  const [teamStats, setTeamStats] = useState([])
  const [playerStats, setPlayerStats] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('teams')

  useEffect(() => {
    async function load() {
      const [{ data: ts }, { data: ps }] = await Promise.all([
        supabase.from('team_stats').select('*'),
        supabase.from('player_stats').select('*'),
      ])

      // Merge DB stats onto full master lists so every team/player always shows
      const tsMap = Object.fromEntries((ts || []).map(t => [t.team_name, t]))
      const psMap = Object.fromEntries((ps || []).map(p => [p.player_name, p]))

      const allTeams = ALL_TEAMS
        .filter(t => !t.easterEgg)
        .map(t => tsMap[t.name] || {
          team_name: t.name, odds: t.odds,
          group_wins: 0, group_draws: 0, group_losses: 0,
          group_winner: false, knockout_advance: false,
          round_of_32_wins: 0, round_of_16_wins: 0,
          quarter_final_wins: 0, semi_final_wins: 0,
          champion: false, upset_wins: 0,
        })

      const allPlayers = ALL_PLAYERS
        .filter(p => !p.easterEgg)
        .map(p => psMap[p.name] || {
          player_name: p.name, odds: p.odds,
          group_goals: 0, knockout_goals: 0,
        })

      setTeamStats(allTeams)
      setPlayerStats(allPlayers)
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return <div className="text-center py-24 text-gray-400">Loading results...</div>

  function teamStatus(t) {
    if (t.champion) return { label: '🏆 Champion', color: 'text-wc-gold' }
    if (t.semi_final_wins > 0) return { label: 'Semifinalist', color: 'text-purple-400' }
    if (t.quarter_final_wins > 0) return { label: 'Quarterfinalist', color: 'text-blue-400' }
    if (t.round_of_16_wins > 0) return { label: 'R16 winner', color: 'text-cyan-400' }
    if (t.round_of_32_wins > 0) return { label: 'R32 winner', color: 'text-teal-400' }
    if (t.knockout_advance) return { label: 'Qualified', color: 'text-green-400' }
    if (t.group_wins === 0 && t.group_draws === 0) return { label: 'Not started', color: 'text-gray-500' }
    return { label: 'Group stage', color: 'text-gray-400' }
  }

  return (
    <div>
      <h2 className="text-3xl font-bold text-wc-gold mb-6">Tournament Results</h2>

      <div className="flex gap-2 mb-6">
        {['teams', 'players'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
              activeTab === tab ? 'bg-wc-gold text-black' : 'bg-wc-card border border-wc-border text-gray-400 hover:text-white'
            }`}
          >
            {tab === 'teams' ? '⚽ Teams' : '🥅 Players'}
          </button>
        ))}
      </div>

      {activeTab === 'teams' && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-400 border-b border-wc-border">
                <th className="text-left py-2 px-3">Team</th>
                <th className="text-center py-2 px-2">W</th>
                <th className="text-center py-2 px-2">D</th>
                <th className="text-center py-2 px-2">L</th>
                <th className="text-center py-2 px-2">Upset Wins</th>
                <th className="text-left py-2 px-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {teamStats.map(t => {
                const status = teamStatus(t)
                return (
                  <tr key={t.id} className="border-b border-wc-border/40 hover:bg-wc-card/50">
                    <td className="py-2 px-3 font-medium">{t.team_name}</td>
                    <td className="py-2 px-2 text-center text-green-400">{t.group_wins}</td>
                    <td className="py-2 px-2 text-center text-yellow-400">{t.group_draws}</td>
                    <td className="py-2 px-2 text-center text-red-400">{t.group_losses}</td>
                    <td className="py-2 px-2 text-center text-wc-gold">{t.upset_wins || 0}</td>
                    <td className={`py-2 px-3 font-medium ${status.color}`}>{status.label}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          {teamStats.length === 0 && (
            <p className="text-center text-gray-400 py-12">No results yet — tournament hasn't started.</p>
          )}
        </div>
      )}

      {activeTab === 'players' && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-400 border-b border-wc-border">
                <th className="text-left py-2 px-3">Player</th>
                <th className="text-center py-2 px-3">Group Goals</th>
                <th className="text-center py-2 px-3">Knockout Goals</th>
                <th className="text-center py-2 px-3">Pool Points</th>
              </tr>
            </thead>
            <tbody>
              {playerStats.map(p => (
                <tr key={p.id} className="border-b border-wc-border/40 hover:bg-wc-card/50">
                  <td className="py-2 px-3 font-medium">{p.player_name}</td>
                  <td className="py-2 px-3 text-center">{p.group_goals}</td>
                  <td className="py-2 px-3 text-center">{p.knockout_goals}</td>
                  <td className="py-2 px-3 text-center font-bold text-wc-gold">
                    {((p.group_goals || 0) * 1 + (p.knockout_goals || 0) * 1.5).toFixed(1)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {playerStats.length === 0 && (
            <p className="text-center text-gray-400 py-12">No results yet — tournament hasn't started.</p>
          )}
        </div>
      )}
    </div>
  )
}
