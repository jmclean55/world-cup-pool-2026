export const SCORING = {
  groupWin: 3,
  groupDraw: 1,
  groupWinnerBonus: 2,
  knockoutAdvance: 1,
  roundOf32Win: 3,
  roundOf16Win: 5,
  quarterFinalWin: 8,
  semiFinalWin: 13,
  champion: 21,
  upsetBonus: 1,        // longer-odds team wins group stage match
  playerGroupGoal: 1,
  playerKnockoutGoal: 1.5,
}

export function calcTeamPoints(teamData) {
  let pts = 0
  pts += (teamData.groupWins || 0) * SCORING.groupWin
  pts += (teamData.groupDraws || 0) * SCORING.groupDraw
  pts += (teamData.groupWinnerBonus || 0) * SCORING.groupWinnerBonus
  pts += (teamData.knockoutAdvance || 0) * SCORING.knockoutAdvance
  pts += (teamData.roundOf32Wins || 0) * SCORING.roundOf32Win
  pts += (teamData.roundOf16Wins || 0) * SCORING.roundOf16Win
  pts += (teamData.quarterFinalWins || 0) * SCORING.quarterFinalWin
  pts += (teamData.semiFinalWins || 0) * SCORING.semiFinalWin
  pts += (teamData.champion ? SCORING.champion : 0)
  pts += (teamData.upsetWins || 0) * SCORING.upsetBonus
  return pts
}

export function calcPlayerPoints(playerData) {
  let pts = 0
  pts += (playerData.groupGoals || 0) * SCORING.playerGroupGoal
  pts += (playerData.knockoutGoals || 0) * SCORING.playerKnockoutGoal
  return pts
}
