// Group stage matches from official FIFA CSV. Kickoff times are UTC ISO strings.
// Team names normalized to match teams.js.

export const GROUP_STAGE_MATCHES = [
  // Round 1
  { kickoff: '2026-06-11T19:00:00Z', home: 'Mexico',         away: 'South Africa'   },
  { kickoff: '2026-06-12T02:00:00Z', home: 'South Korea',    away: 'Czech Republic' },
  { kickoff: '2026-06-12T19:00:00Z', home: 'Canada',         away: 'Bosnia'         },
  { kickoff: '2026-06-13T01:00:00Z', home: 'USA',            away: 'Paraguay'       },
  { kickoff: '2026-06-13T19:00:00Z', home: 'Qatar',          away: 'Switzerland'    },
  { kickoff: '2026-06-13T22:00:00Z', home: 'Brazil',         away: 'Morocco'        },
  { kickoff: '2026-06-14T01:00:00Z', home: 'Haiti',          away: 'Scotland'       },
  { kickoff: '2026-06-14T04:00:00Z', home: 'Australia',      away: 'Turkey'         },
  { kickoff: '2026-06-14T17:00:00Z', home: 'Germany',        away: 'Curacao'        },
  { kickoff: '2026-06-14T20:00:00Z', home: 'Netherlands',    away: 'Japan'          },
  { kickoff: '2026-06-14T23:00:00Z', home: 'Ivory Coast',    away: 'Ecuador'        },
  { kickoff: '2026-06-15T02:00:00Z', home: 'Sweden',         away: 'Tunisia'        },
  { kickoff: '2026-06-15T16:00:00Z', home: 'Spain',          away: 'Cape Verde'     },
  { kickoff: '2026-06-15T19:00:00Z', home: 'Belgium',        away: 'Egypt'          },
  { kickoff: '2026-06-15T22:00:00Z', home: 'Saudi Arabia',   away: 'Uruguay'        },
  { kickoff: '2026-06-16T01:00:00Z', home: 'Iran',           away: 'New Zealand'    },
  { kickoff: '2026-06-16T19:00:00Z', home: 'France',         away: 'Senegal'        },
  { kickoff: '2026-06-16T22:00:00Z', home: 'Iraq',           away: 'Norway'         },
  { kickoff: '2026-06-17T01:00:00Z', home: 'Argentina',      away: 'Algeria'        },
  { kickoff: '2026-06-17T04:00:00Z', home: 'Austria',        away: 'Jordan'         },
  { kickoff: '2026-06-17T17:00:00Z', home: 'Portugal',       away: 'DR Congo'       },
  { kickoff: '2026-06-17T20:00:00Z', home: 'England',        away: 'Croatia'        },
  { kickoff: '2026-06-17T23:00:00Z', home: 'Ghana',          away: 'Panama'         },
  { kickoff: '2026-06-18T02:00:00Z', home: 'Uzbekistan',     away: 'Colombia'       },

  // Round 2
  { kickoff: '2026-06-18T16:00:00Z', home: 'Czech Republic', away: 'South Africa'   },
  { kickoff: '2026-06-18T19:00:00Z', home: 'Switzerland',    away: 'Bosnia'         },
  { kickoff: '2026-06-18T22:00:00Z', home: 'Canada',         away: 'Qatar'          },
  { kickoff: '2026-06-19T01:00:00Z', home: 'Mexico',         away: 'South Korea'    },
  { kickoff: '2026-06-19T19:00:00Z', home: 'USA',            away: 'Australia'      },
  { kickoff: '2026-06-19T22:00:00Z', home: 'Scotland',       away: 'Morocco'        },
  { kickoff: '2026-06-20T01:00:00Z', home: 'Brazil',         away: 'Haiti'          },
  { kickoff: '2026-06-20T04:00:00Z', home: 'Turkey',         away: 'Paraguay'       },
  { kickoff: '2026-06-20T17:00:00Z', home: 'Netherlands',    away: 'Sweden'         },
  { kickoff: '2026-06-20T20:00:00Z', home: 'Germany',        away: 'Ivory Coast'    },
  { kickoff: '2026-06-21T00:00:00Z', home: 'Ecuador',        away: 'Curacao'        },
  { kickoff: '2026-06-21T04:00:00Z', home: 'Tunisia',        away: 'Japan'          },
  { kickoff: '2026-06-21T16:00:00Z', home: 'Spain',          away: 'Saudi Arabia'   },
  { kickoff: '2026-06-21T19:00:00Z', home: 'Belgium',        away: 'Iran'           },
  { kickoff: '2026-06-21T22:00:00Z', home: 'Uruguay',        away: 'Cape Verde'     },
  { kickoff: '2026-06-22T01:00:00Z', home: 'New Zealand',    away: 'Egypt'          },
  { kickoff: '2026-06-22T17:00:00Z', home: 'Argentina',      away: 'Austria'        },
  { kickoff: '2026-06-22T21:00:00Z', home: 'France',         away: 'Iraq'           },
  { kickoff: '2026-06-23T00:00:00Z', home: 'Norway',         away: 'Senegal'        },
  { kickoff: '2026-06-23T03:00:00Z', home: 'Jordan',         away: 'Algeria'        },
  { kickoff: '2026-06-23T17:00:00Z', home: 'Portugal',       away: 'Uzbekistan'     },
  { kickoff: '2026-06-23T20:00:00Z', home: 'England',        away: 'Ghana'          },
  { kickoff: '2026-06-23T23:00:00Z', home: 'Panama',         away: 'Croatia'        },
  { kickoff: '2026-06-24T02:00:00Z', home: 'Colombia',       away: 'DR Congo'       },

  // Round 3
  { kickoff: '2026-06-24T19:00:00Z', home: 'Switzerland',    away: 'Canada'         },
  { kickoff: '2026-06-24T19:00:00Z', home: 'Bosnia',         away: 'Qatar'          },
  { kickoff: '2026-06-24T22:00:00Z', home: 'Scotland',       away: 'Brazil'         },
  { kickoff: '2026-06-24T22:00:00Z', home: 'Morocco',        away: 'Haiti'          },
  { kickoff: '2026-06-25T01:00:00Z', home: 'Czech Republic', away: 'Mexico'         },
  { kickoff: '2026-06-25T01:00:00Z', home: 'South Africa',   away: 'South Korea'    },
  { kickoff: '2026-06-25T20:00:00Z', home: 'Curacao',        away: 'Ivory Coast'    },
  { kickoff: '2026-06-25T20:00:00Z', home: 'Ecuador',        away: 'Germany'        },
  { kickoff: '2026-06-25T23:00:00Z', home: 'Japan',          away: 'Sweden'         },
  { kickoff: '2026-06-25T23:00:00Z', home: 'Tunisia',        away: 'Netherlands'    },
  { kickoff: '2026-06-26T02:00:00Z', home: 'Turkey',         away: 'USA'            },
  { kickoff: '2026-06-26T02:00:00Z', home: 'Paraguay',       away: 'Australia'      },
  { kickoff: '2026-06-26T19:00:00Z', home: 'Norway',         away: 'France'         },
  { kickoff: '2026-06-26T19:00:00Z', home: 'Senegal',        away: 'Iraq'           },
  { kickoff: '2026-06-27T00:00:00Z', home: 'Cape Verde',     away: 'Saudi Arabia'   },
  { kickoff: '2026-06-27T00:00:00Z', home: 'Uruguay',        away: 'Spain'          },
  { kickoff: '2026-06-27T03:00:00Z', home: 'Egypt',          away: 'Iran'           },
  { kickoff: '2026-06-27T03:00:00Z', home: 'New Zealand',    away: 'Belgium'        },
  { kickoff: '2026-06-27T21:00:00Z', home: 'Panama',         away: 'England'        },
  { kickoff: '2026-06-27T21:00:00Z', home: 'Croatia',        away: 'Ghana'          },
  { kickoff: '2026-06-27T23:30:00Z', home: 'Colombia',       away: 'Portugal'       },
  { kickoff: '2026-06-27T23:30:00Z', home: 'DR Congo',       away: 'Uzbekistan'     },
  { kickoff: '2026-06-28T02:00:00Z', home: 'Algeria',        away: 'Austria'        },
  { kickoff: '2026-06-28T02:00:00Z', home: 'Jordan',         away: 'Argentina'      },
]

// A match counts as "remaining" only if it hasn't kicked off yet
export function groupGamesRemaining(teamName) {
  const now = new Date()
  return GROUP_STAGE_MATCHES.filter(m =>
    (m.home === teamName || m.away === teamName) && new Date(m.kickoff) > now
  ).length
}

export function entryGroupGamesRemaining(entry) {
  let remaining = 0
  for (let i = 1; i <= 8; i++) {
    const team = entry[`team_tier${i}`]
    if (team) remaining += groupGamesRemaining(team)
  }
  return remaining
}
