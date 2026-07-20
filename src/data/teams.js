export const TEAM_TIERS = [
  {
    tier: 1,
    label: 'Tier 1 — Favorites',
    teams: [
      { name: 'Spain', odds: 450 },
      { name: 'France', odds: 475 },
      { name: 'England', odds: 700 },
      { name: 'Portugal', odds: 900 },
      { name: 'Brazil', odds: 900 },
      { name: 'Argentina', odds: 900 },
    ],
  },
  {
    tier: 2,
    label: 'Tier 2 — Contenders',
    teams: [
      { name: 'Germany', odds: 1400 },
      { name: 'Netherlands', odds: 2000 },
      { name: 'Norway', odds: 3500 },
      { name: 'Colombia', odds: 4000 },
      { name: 'Belgium', odds: 4000 },
      { name: 'Morocco', odds: 5000 },
    ],
  },
  {
    tier: 3,
    label: 'Tier 3 — Dark Horses',
    teams: [
      { name: 'USA', odds: 6000 },
      { name: 'Switzerland', odds: 6500 },
      { name: 'Japan', odds: 6500 },
      { name: 'Uruguay', odds: 6500 },
      { name: 'Ecuador', odds: 8000 },
      { name: 'Mexico', odds: 8000 },
    ],
  },
  {
    tier: 4,
    label: 'Tier 4 — Sleepers',
    teams: [
      { name: 'Turkey', odds: 9000 },
      { name: 'Croatia', odds: 9000 },
      { name: 'Senegal', odds: 9000 },
      { name: 'Sweden', odds: 12000 },
      { name: 'Austria', odds: 15000 },
      { name: 'Scotland', odds: 20000 },
    ],
  },
  {
    tier: 5,
    label: 'Tier 5 — Long Shots',
    teams: [
      { name: 'Canada', odds: 20000 },
      { name: 'Czech Republic', odds: 25000 },
      { name: 'Ivory Coast', odds: 25000 },
      { name: 'Ghana', odds: 30000 },
      { name: 'Egypt', odds: 30000 },
      { name: 'Paraguay', odds: 30000 },
    ],
  },
  {
    tier: 6,
    label: 'Tier 6 — Underdogs',
    teams: [
      { name: 'Algeria', odds: 35000 },
      { name: 'South Korea', odds: 40000 },
      { name: 'Tunisia', odds: 50000 },
      { name: 'Bosnia', odds: 50000 },
      { name: 'Australia', odds: 60000 },
      { name: 'Iran', odds: 70000 },
    ],
  },
  {
    tier: 7,
    label: 'Tier 7 — Big Underdogs',
    teams: [
      { name: 'DR Congo', odds: 100000 },
      { name: 'South Africa', odds: 100000 },
      { name: 'Cape Verde', odds: 100000 },
      { name: 'Saudi Arabia', odds: 100000 },
      { name: 'Panama', odds: 100000 },
      { name: 'Uzbekistan', odds: 150000 },
    ],
  },
  {
    tier: 8,
    label: 'Tier 8 — Massive Underdogs',
    teams: [
      { name: 'Qatar', odds: 150000 },
      { name: 'New Zealand', odds: 150000 },
      { name: 'Iraq', odds: 150000 },
      { name: 'Haiti', odds: 250000 },
      { name: 'Curacao', odds: 250000 },
      { name: 'Jordan', odds: 250000 },
    ],
  },
]

export const ALL_TEAMS = TEAM_TIERS.flatMap(t => t.teams)

export function getTeamOdds(teamName) {
  const team = ALL_TEAMS.find(t => t.name === teamName)
  return team ? team.odds : 0
}

// Teams that can no longer earn points. Manual list because the 8-best-3rds
// rule in the 48-team format makes elimination non-derivable from W/L alone.
export const FORCE_ELIMINATED = new Set([
  'Haiti', 'Turkey', 'Tunisia', 'Jordan', 'Panama',
  'Czech Republic', 'Qatar', 'Scotland', 'South Korea', 'New Zealand',
  'Iran', 'Saudi Arabia', 'Uruguay', 'Curacao', 'Iraq', 'Uzbekistan',
  'South Africa', 'Japan', 'Germany', 'Ivory Coast', 'Netherlands', 'Sweden',
  'Ecuador', 'DR Congo', 'Senegal', 'Bosnia', 'Austria', 'Croatia', 'Algeria',
  'Australia', 'Cape Verde', 'Ghana', 'Canada', 'Paraguay', 'Brazil', 'Mexico',
  'Portugal', 'USA', 'Egypt', 'Colombia', 'Morocco', 'Belgium',
  'Norway', 'Switzerland',
  'France', 'England',
  'Argentina',
])

export function isTeamEliminated(teamName) {
  return FORCE_ELIMINATED.has(teamName)
}

// Countries with players still alive in the tournament. Update as teams
// are eliminated. Anyone not on this list is treated as eliminated for
// player-scoring purposes.
export const ACTIVE_PLAYER_COUNTRIES = new Set([
  'Spain',
])

export function isPlayerEliminated(country) {
  if (!country) return false
  return !ACTIVE_PLAYER_COUNTRIES.has(country)
}
