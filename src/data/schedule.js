// Group stage matches from official FIFA schedule CSV (UTC dates converted to ET dates).
// Team names normalized to match teams.js.

// CSV name → teams.js name
const NAME_MAP = {
  'Korea Republic':           'South Korea',
  'Czechia':                  'Czech Republic',
  'Bosnia and Herzegovina':   'Bosnia',
  'Türkiye':                  'Turkey',
  "Côte d'Ivoire":            'Ivory Coast',
  'Curaçao':                  'Curacao',
  'Cabo Verde':               'Cape Verde',
  'IR Iran':                  'Iran',
  'Congo DR':                 'DR Congo',
}

function n(name) {
  return NAME_MAP[name] || name
}

// Dates are ET calendar dates (UTC date adjusted for ET offset where match crosses midnight ET)
export const GROUP_STAGE_MATCHES = [
  // Round 1
  { date: '2026-06-11', home: n('Mexico'),                        away: n('South Africa')            }, // match 1
  { date: '2026-06-11', home: n('Korea Republic'),                away: n('Czechia')                 }, // match 2 (UTC 06-12 02:00 = ET 06-11)
  { date: '2026-06-12', home: n('Canada'),                        away: n('Bosnia and Herzegovina')  }, // match 3
  { date: '2026-06-12', home: n('USA'),                           away: n('Paraguay')                }, // match 4 (UTC 06-13 01:00 = ET 06-12)
  { date: '2026-06-13', home: n('Qatar'),                         away: n('Switzerland')             }, // match 8
  { date: '2026-06-13', home: n('Brazil'),                        away: n('Morocco')                 }, // match 7
  { date: '2026-06-13', home: n('Haiti'),                         away: n('Scotland')                }, // match 5 (UTC 06-14 01:00 = ET 06-13)
  { date: '2026-06-13', home: n('Australia'),                     away: n('Türkiye')                 }, // match 6 (UTC 06-14 04:00 = ET 06-13)
  { date: '2026-06-14', home: n('Germany'),                       away: n('Curaçao')                 }, // match 10
  { date: '2026-06-14', home: n('Netherlands'),                   away: n('Japan')                   }, // match 11
  { date: '2026-06-13', home: n("Côte d'Ivoire"),                 away: n('Ecuador')                 }, // match 9 (UTC 06-14 23:00 = ET 06-13... actually 19:00 ET = same day)
  { date: '2026-06-14', home: n('Sweden'),                        away: n('Tunisia')                 }, // match 12 (UTC 06-15 02:00 = ET 06-14)
  { date: '2026-06-15', home: n('Spain'),                         away: n('Cabo Verde')              }, // match 14
  { date: '2026-06-15', home: n('Belgium'),                       away: n('Egypt')                   }, // match 16
  { date: '2026-06-15', home: n('Saudi Arabia'),                  away: n('Uruguay')                 }, // match 13
  { date: '2026-06-15', home: n('IR Iran'),                       away: n('New Zealand')             }, // match 15 (UTC 06-16 01:00 = ET 06-15)
  { date: '2026-06-16', home: n('France'),                        away: n('Senegal')                 }, // match 17
  { date: '2026-06-16', home: n('Iraq'),                          away: n('Norway')                  }, // match 18
  { date: '2026-06-16', home: n('Argentina'),                     away: n('Algeria')                 }, // match 19 (UTC 06-17 01:00 = ET 06-16)
  { date: '2026-06-16', home: n('Austria'),                       away: n('Jordan')                  }, // match 20 (UTC 06-17 04:00 = ET 06-16)
  { date: '2026-06-17', home: n('Portugal'),                      away: n('Congo DR')                }, // match 23
  { date: '2026-06-17', home: n('England'),                       away: n('Croatia')                 }, // match 22
  { date: '2026-06-17', home: n('Ghana'),                         away: n('Panama')                  }, // match 21
  { date: '2026-06-17', home: n('Uzbekistan'),                    away: n('Colombia')                }, // match 24 (UTC 06-18 02:00 = ET 06-17)

  // Round 2
  { date: '2026-06-18', home: n('Czechia'),                       away: n('South Africa')            }, // match 25
  { date: '2026-06-18', home: n('Switzerland'),                   away: n('Bosnia and Herzegovina')  }, // match 26
  { date: '2026-06-18', home: n('Canada'),                        away: n('Qatar')                   }, // match 27
  { date: '2026-06-18', home: n('Mexico'),                        away: n('Korea Republic')          }, // match 28 (UTC 06-19 01:00 = ET 06-18)
  { date: '2026-06-19', home: n('USA'),                           away: n('Australia')               }, // match 32
  { date: '2026-06-19', home: n('Scotland'),                      away: n('Morocco')                 }, // match 30
  { date: '2026-06-19', home: n('Brazil'),                        away: n('Haiti')                   }, // match 29 (UTC 06-20 01:00 = ET 06-19)
  { date: '2026-06-19', home: n('Türkiye'),                       away: n('Paraguay')                }, // match 31 (UTC 06-20 04:00 = ET 06-19)
  { date: '2026-06-20', home: n('Netherlands'),                   away: n('Sweden')                  }, // match 35
  { date: '2026-06-20', home: n('Germany'),                       away: n("Côte d'Ivoire")           }, // match 33
  { date: '2026-06-20', home: n('Ecuador'),                       away: n('Curaçao')                 }, // match 34 (UTC 06-21 00:00 = ET 06-20)
  { date: '2026-06-20', home: n('Tunisia'),                       away: n('Japan')                   }, // match 36 (UTC 06-21 04:00 = ET 06-20)
  { date: '2026-06-21', home: n('Spain'),                         away: n('Saudi Arabia')            }, // match 38
  { date: '2026-06-21', home: n('Belgium'),                       away: n('IR Iran')                 }, // match 39
  { date: '2026-06-21', home: n('Uruguay'),                       away: n('Cabo Verde')              }, // match 37
  { date: '2026-06-21', home: n('New Zealand'),                   away: n('Egypt')                   }, // match 40 (UTC 06-22 01:00 = ET 06-21)
  { date: '2026-06-22', home: n('Argentina'),                     away: n('Austria')                 }, // match 43
  { date: '2026-06-22', home: n('France'),                        away: n('Iraq')                    }, // match 42
  { date: '2026-06-22', home: n('Norway'),                        away: n('Senegal')                 }, // match 41 (UTC 06-23 00:00 = ET 06-22)
  { date: '2026-06-22', home: n('Jordan'),                        away: n('Algeria')                 }, // match 44 (UTC 06-23 03:00 = ET 06-22)
  { date: '2026-06-23', home: n('Portugal'),                      away: n('Uzbekistan')              }, // match 47
  { date: '2026-06-23', home: n('England'),                       away: n('Ghana')                   }, // match 45
  { date: '2026-06-23', home: n('Panama'),                        away: n('Croatia')                 }, // match 46
  { date: '2026-06-23', home: n('Colombia'),                      away: n('Congo DR')                }, // match 48 (UTC 06-24 02:00 = ET 06-23)

  // Round 3
  { date: '2026-06-24', home: n('Switzerland'),                   away: n('Canada')                  }, // match 51
  { date: '2026-06-24', home: n('Bosnia and Herzegovina'),        away: n('Qatar')                   }, // match 52
  { date: '2026-06-24', home: n('Scotland'),                      away: n('Brazil')                  }, // match 49
  { date: '2026-06-24', home: n('Morocco'),                       away: n('Haiti')                   }, // match 50
  { date: '2026-06-24', home: n('Czechia'),                       away: n('Mexico')                  }, // match 53 (UTC 06-25 01:00 = ET 06-24)
  { date: '2026-06-24', home: n('South Africa'),                  away: n('Korea Republic')          }, // match 54 (UTC 06-25 01:00 = ET 06-24)
  { date: '2026-06-25', home: n('Curaçao'),                       away: n("Côte d'Ivoire")           }, // match 55
  { date: '2026-06-25', home: n('Ecuador'),                       away: n('Germany')                 }, // match 56
  { date: '2026-06-25', home: n('Japan'),                         away: n('Sweden')                  }, // match 57
  { date: '2026-06-25', home: n('Tunisia'),                       away: n('Netherlands')             }, // match 58
  { date: '2026-06-25', home: n('Türkiye'),                       away: n('USA')                     }, // match 59 (UTC 06-26 02:00 = ET 06-25)
  { date: '2026-06-25', home: n('Paraguay'),                      away: n('Australia')               }, // match 60 (UTC 06-26 02:00 = ET 06-25)
  { date: '2026-06-26', home: n('Norway'),                        away: n('France')                  }, // match 61
  { date: '2026-06-26', home: n('Senegal'),                       away: n('Iraq')                    }, // match 62
  { date: '2026-06-26', home: n('Cabo Verde'),                    away: n('Saudi Arabia')            }, // match 65 (UTC 06-27 00:00 = ET 06-26)
  { date: '2026-06-26', home: n('Uruguay'),                       away: n('Spain')                   }, // match 66 (UTC 06-27 00:00 = ET 06-26)
  { date: '2026-06-26', home: n('Egypt'),                         away: n('IR Iran')                 }, // match 63 (UTC 06-27 03:00 = ET 06-26)
  { date: '2026-06-26', home: n('New Zealand'),                   away: n('Belgium')                 }, // match 64 (UTC 06-27 03:00 = ET 06-26)
  { date: '2026-06-27', home: n('Panama'),                        away: n('England')                 }, // match 67
  { date: '2026-06-27', home: n('Croatia'),                       away: n('Ghana')                   }, // match 68
  { date: '2026-06-27', home: n('Colombia'),                      away: n('Portugal')                }, // match 71
  { date: '2026-06-27', home: n('Congo DR'),                      away: n('Uzbekistan')              }, // match 72
  { date: '2026-06-27', home: n('Algeria'),                       away: n('Austria')                 }, // match 69 (UTC 06-28 02:00 = ET 06-27)
  { date: '2026-06-27', home: n('Jordan'),                        away: n('Argentina')               }, // match 70 (UTC 06-28 02:00 = ET 06-27)
]

// Returns group games remaining for a team as of today (ET date)
export function groupGamesRemaining(teamName) {
  const now = new Date()
  const etOffset = -4 * 60 // EDT = UTC-4
  const etNow = new Date(now.getTime() + (now.getTimezoneOffset() + etOffset) * 60000)
  etNow.setHours(0, 0, 0, 0)
  return GROUP_STAGE_MATCHES.filter(m => {
    const matchDate = new Date(m.date + 'T00:00:00')
    return (m.home === teamName || m.away === teamName) && matchDate >= etNow
  }).length
}

// Returns total group games remaining across all 8 picked teams for an entry
export function entryGroupGamesRemaining(entry) {
  let remaining = 0
  for (let i = 1; i <= 8; i++) {
    const team = entry[`team_tier${i}`]
    if (team) remaining += groupGamesRemaining(team)
  }
  return remaining
}
