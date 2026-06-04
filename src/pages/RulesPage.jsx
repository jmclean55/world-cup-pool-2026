import { SCORING } from '../data/scoring.js'

export default function RulesPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-wc-gold mb-2">How It Works</h2>
        <p className="text-gray-400">
          Pick 1 team from each of the 8 tiers and 1 player from each of the 5 player tiers.
          You earn points based on how your picks perform throughout the tournament.
        </p>
      </div>

      <div className="tier-card">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">⚽ Team Points</h3>
        <div className="space-y-2 text-sm">
          {[
            ['Group stage win', `+${SCORING.groupWin} pts`],
            ['Group stage draw', `+${SCORING.groupDraw} pt`],
            ['Win the group (finish 1st)', `+${SCORING.groupWinnerBonus} pts`],
            ['Advance to knockout stage', `+${SCORING.knockoutAdvance} pt`],
            ['Longer odds team wins (group stage)', `+${SCORING.upsetBonus} pt bonus`],
            ['Win Round of 32 match', `+${SCORING.roundOf32Win} pts`],
            ['Win Round of 16 match', `+${SCORING.roundOf16Win} pts`],
            ['Win Quarterfinal', `+${SCORING.quarterFinalWin} pts`],
            ['Win Semifinal', `+${SCORING.semiFinalWin} pts`],
            ['Win the World Cup', `+${SCORING.champion} pts`],
          ].map(([desc, pts]) => (
            <div key={desc} className="flex justify-between items-center py-1.5 border-b border-wc-border/50 last:border-0">
              <span className="text-gray-300">{desc}</span>
              <span className="font-bold text-wc-gold">{pts}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="tier-card">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">🥅 Player Points</h3>
        <div className="space-y-2 text-sm">
          {[
            ['Goal scored in group stage', `+${SCORING.playerGroupGoal} pt`],
            ['Goal scored in knockout stage', `+${SCORING.playerKnockoutGoal} pts`],
          ].map(([desc, pts]) => (
            <div key={desc} className="flex justify-between items-center py-1.5 border-b border-wc-border/50 last:border-0">
              <span className="text-gray-300">{desc}</span>
              <span className="font-bold text-wc-gold">{pts}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="tier-card">
        <h3 className="text-lg font-bold mb-3">🏆 Team Tiers</h3>
        <p className="text-sm text-gray-400 mb-3">Teams are split into 8 tiers of 6 based on DraftKings World Cup winner odds. Pick 1 from each tier.</p>
        <div className="grid grid-cols-2 gap-x-8 gap-y-1 text-sm">
          {[
            ['Tier 1', '+450 to +900', 'Favorites'],
            ['Tier 2', '+1400 to +5000', 'Contenders'],
            ['Tier 3', '+6000 to +8000', 'Dark Horses'],
            ['Tier 4', '+9000 to +20000', 'Sleepers'],
            ['Tier 5', '+20000 to +30000', 'Long Shots'],
            ['Tier 6', '+35000 to +70000', 'Underdogs'],
            ['Tier 7', '+100000 to +150000', 'Big Underdogs'],
            ['Tier 8', '+150000 to +250000', 'Massive Underdogs'],
          ].map(([tier, range, label]) => (
            <div key={tier} className="py-1.5 border-b border-wc-border/30">
              <span className="text-wc-gold font-semibold">{tier}</span>
              <span className="text-gray-400 ml-2 text-xs">{label}</span>
              <div className="text-xs text-gray-500">{range}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="tier-card">
        <h3 className="text-lg font-bold mb-3">🎯 Player Tiers</h3>
        <p className="text-sm text-gray-400 mb-3">Players split into 5 tiers based on DraftKings Top Goalscorer odds. Pick 1 from each tier.</p>
        <div className="space-y-1 text-sm">
          {[
            ['Tier 1', 'Mbappe, Kane, Haaland', '+600–+1400'],
            ['Tier 2', 'Messi, Oyarzabal, Yamal, Ronaldo, Vinicius Jr, Raphinha, Dembele', '+1600–+3000'],
            ['Tier 3', '20 players at +3500–+5000', '+3500–+5000'],
            ['Tier 4', '16 players at +6500', '+6500'],
            ['Tier 5', '14 players at +8000–+10000', '+8000–+10000'],
          ].map(([tier, players, range]) => (
            <div key={tier} className="py-1.5 border-b border-wc-border/30">
              <div className="flex justify-between">
                <span className="text-wc-gold font-semibold">{tier}</span>
                <span className="text-gray-500 text-xs">{range}</span>
              </div>
              <div className="text-gray-400 text-xs mt-0.5">{players}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="tier-card border-wc-gold/30">
        <h3 className="text-lg font-bold mb-2">📅 Deadline</h3>
        <p className="text-gray-300 text-sm">Picks lock automatically at <strong className="text-wc-gold">June 11, 2026 at 12:00 PM ET</strong> — the start of the first match.</p>
      </div>

      <div className="tier-card border-green-500/30">
        <h3 className="text-lg font-bold mb-2">💵 Buy-In</h3>
        <p className="text-gray-300 text-sm">Entry fee is <strong className="text-white">$25</strong>. Send via Venmo to <strong className="text-green-400">@jmclean23</strong>.</p>
      </div>
    </div>
  )
}
