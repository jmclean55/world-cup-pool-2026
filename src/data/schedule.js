// All 48 group stage matches. Dates are ET (midnight = day boundary).
// Team names must match exactly what's in teams.js.
export const GROUP_STAGE_MATCHES = [
  // Group A
  { date: '2026-06-11', home: 'Mexico',       away: 'South Africa' },
  { date: '2026-06-12', home: 'Uruguay',       away: 'Ecuador'      },
  { date: '2026-06-15', home: 'South Africa',  away: 'Ecuador'      },
  { date: '2026-06-15', home: 'Mexico',        away: 'Uruguay'      },
  { date: '2026-06-19', home: 'Ecuador',       away: 'Mexico'       },
  { date: '2026-06-19', home: 'South Africa',  away: 'Uruguay'      },

  // Group B
  { date: '2026-06-12', home: 'Canada',        away: 'Romania'      },
  { date: '2026-06-13', home: 'Morocco',       away: 'Croatia'      },
  { date: '2026-06-16', home: 'Romania',       away: 'Morocco'      },
  { date: '2026-06-16', home: 'Croatia',       away: 'Canada'       },
  { date: '2026-06-20', home: 'Morocco',       away: 'Canada'       },
  { date: '2026-06-20', home: 'Croatia',       away: 'Romania'      },

  // Group C
  { date: '2026-06-12', home: 'Germany',       away: 'Japan'        },
  { date: '2026-06-13', home: 'Colombia',      away: 'Ivory Coast'  },
  { date: '2026-06-16', home: 'Ivory Coast',   away: 'Japan'        },
  { date: '2026-06-17', home: 'Germany',       away: 'Colombia'     },
  { date: '2026-06-21', home: 'Japan',         away: 'Colombia'     },
  { date: '2026-06-21', home: 'Ivory Coast',   away: 'Germany'      },

  // Group D
  { date: '2026-06-12', home: 'USA',           away: 'Paraguay'     },
  { date: '2026-06-13', home: 'Ghana',         away: 'Panama'       },
  { date: '2026-06-17', home: 'Paraguay',      away: 'Ghana'        },
  { date: '2026-06-17', home: 'Panama',        away: 'USA'          },
  { date: '2026-06-21', home: 'Ghana',         away: 'USA'          },
  { date: '2026-06-21', home: 'Paraguay',      away: 'Panama'       },

  // Group E
  { date: '2026-06-13', home: 'Spain',         away: 'Brazil'       },
  { date: '2026-06-14', home: 'Japan',         away: 'Czech Republic'},
  { date: '2026-06-17', home: 'Brazil',        away: 'Czech Republic'},
  { date: '2026-06-18', home: 'Spain',         away: 'Japan'        },
  { date: '2026-06-22', home: 'Czech Republic',away: 'Spain'        },
  { date: '2026-06-22', home: 'Brazil',        away: 'Japan'        },

  // Group F
  { date: '2026-06-14', home: 'France',        away: 'Algeria'      },
  { date: '2026-06-14', home: 'Belgium',       away: 'Uzbekistan'   },
  { date: '2026-06-18', home: 'Algeria',       away: 'Belgium'      },
  { date: '2026-06-18', home: 'Uzbekistan',    away: 'France'       },
  { date: '2026-06-22', home: 'Belgium',       away: 'France'       },
  { date: '2026-06-22', home: 'Uzbekistan',    away: 'Algeria'      },

  // Group G
  { date: '2026-06-14', home: 'Portugal',      away: 'Iraq'         },
  { date: '2026-06-15', home: 'Iran',          away: 'Austria'      },
  { date: '2026-06-18', home: 'Iraq',          away: 'Iran'         },
  { date: '2026-06-19', home: 'Portugal',      away: 'Austria'      },
  { date: '2026-06-23', home: 'Austria',       away: 'Iraq'         },
  { date: '2026-06-23', home: 'Iran',          away: 'Portugal'     },

  // Group H
  { date: '2026-06-15', home: 'Argentina',     away: 'Saudi Arabia' },
  { date: '2026-06-15', home: 'Australia',     away: 'DR Congo'     },
  { date: '2026-06-19', home: 'Saudi Arabia',  away: 'Australia'    },
  { date: '2026-06-19', home: 'DR Congo',      away: 'Argentina'    },
  { date: '2026-06-23', home: 'Australia',     away: 'Argentina'    },
  { date: '2026-06-23', home: 'DR Congo',      away: 'Saudi Arabia' },

  // Group I
  { date: '2026-06-15', home: 'England',       away: 'Tunisia'      },
  { date: '2026-06-16', home: 'Netherlands',   away: 'Senegal'      },
  { date: '2026-06-19', home: 'Tunisia',       away: 'Netherlands'  },
  { date: '2026-06-20', home: 'Senegal',       away: 'England'      },
  { date: '2026-06-24', home: 'Netherlands',   away: 'England'      },
  { date: '2026-06-24', home: 'Senegal',       away: 'Tunisia'      },

  // Group J
  { date: '2026-06-16', home: 'Norway',        away: 'Turkey'       },
  { date: '2026-06-16', home: 'Panama',        away: 'Bosnia'       },
  { date: '2026-06-20', home: 'Turkey',        away: 'Panama'       },
  { date: '2026-06-20', home: 'Bosnia',        away: 'Norway'       },
  { date: '2026-06-24', home: 'Panama',        away: 'Norway'       },
  { date: '2026-06-24', home: 'Bosnia',        away: 'Turkey'       },

  // Group K
  { date: '2026-06-16', home: 'Sweden',        away: 'Paraguay'     },
  { date: '2026-06-17', home: 'South Korea',   away: 'Cape Verde'   },
  { date: '2026-06-20', home: 'Cape Verde',    away: 'Sweden'       },
  { date: '2026-06-21', home: 'South Korea',   away: 'Paraguay'     },
  { date: '2026-06-25', home: 'Paraguay',      away: 'Cape Verde'   },
  { date: '2026-06-25', home: 'Sweden',        away: 'South Korea'  },

  // Group L
  { date: '2026-06-17', home: 'New Zealand',   away: 'Curacao'      },
  { date: '2026-06-17', home: 'Qatar',         away: 'Haiti'        },
  { date: '2026-06-21', home: 'Curacao',       away: 'Qatar'        },
  { date: '2026-06-21', home: 'Haiti',         away: 'New Zealand'  },
  { date: '2026-06-25', home: 'Qatar',         away: 'New Zealand'  },
  { date: '2026-06-25', home: 'Haiti',         away: 'Curacao'      },
]

// Returns the number of group stage games remaining for a team as of today
export function groupGamesRemaining(teamName) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return GROUP_STAGE_MATCHES.filter(m => {
    const matchDate = new Date(m.date + 'T00:00:00')
    return (m.home === teamName || m.away === teamName) && matchDate >= today
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
