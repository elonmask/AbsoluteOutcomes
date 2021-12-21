// status 2 - win 3 - lose
const CompetitorTotal = (statistics, market) => {
  const total = parseFloat(market.specifiers.total);
  const team = market.name.includes("competitor2") ? "away" : "home";
  const currentTotal = statistics.result[team];

  if (statistics.time_status === "3") {
    if (currentTotal > total) {
      market.outcomes[1].status = 2;
      market.outcomes[0].status = 3;
    }
    if (currentTotal < total) {
      market.outcomes[0].status = 2;
      market.outcomes[1].status = 3;
    }
  } else {
    if (currentTotal > total) {
      market.outcomes[1].status = 2;
      market.outcomes[0].status = 3;
    }
  }
};

const CompetitorExactGoals = (statistics, market, isPeriod) => {
  const team = market.name.includes("competitor2") ? "away" : "home";
  let goals = statistics.result[team];
  if (isPeriod) {
    const period = parseFloat(market.specifiers.periodnr);
    goals = statistics.periods[`p${period}`][team];
  }
  market.outcomes.forEach((outcome) => {
    const exact = outcome.outcome.includes('+')
      ? parseFloat(outcome.outcome.split('+')[0])
      : parseFloat(outcome.outcome);

    if (statistics.time_status !== "3") {
      if (goals > exact) {
        outcome.status = 3;
      }
      if (exact === goals) {
        outcome.status = 2;
      }
      if (outcome.outcome.includes('+') && goals > exact) {
        outcome.status = 2;
      }
      return;
      ``
    } else {
      if (exact === goals) {
        outcome.status = 2;
      } else {
        outcome.status = 3;
      }
      if (outcome.outcome.includes('+') && goals > exact) {
        outcome.status = 2;
      }
    }
  });
};

const BothTeamsToScoreHockey = (statistics, market, isPeriod) => {
  if (statistics.time_status === "3") {
    market.outcomes.forEach((outcome) => {
      outcome.status = 3;
    });
    let homeScore = statistics.result.home;
    let awayScore = statistics.result.away;

    if (isPeriod) {
      const period = parseFloat(market.specifiers.periodnr);
      homeScore = statistics.periods[`p${period}`].home;
      awayScore = statistics.periods[`p${period}`].away;
    }


    if (homeScore > 0 && awayScore > 0) {
      market.outcomes[0].status = 2;
      market.outcomes[1].status = 3;
      return
    } else {
      market.outcomes[0].status = 3;
      market.outcomes[1].status = 2;
      return
    }
  } else { return }
}

const OddEven = (statistics, market, isPeriod) => {
  if (statistics.time_status === "3") {
    market.outcomes.forEach((outcome) => {
      outcome.status = 3;
    });
    let homeScore = statistics.result.home,
      awayScore = statistics.result.away;
    if (isPeriod) {
      const period = parseFloat(market.specifiers.periodnr);
      homeScore = statistics.periods[`p${period}`].home,
        awayScore = statistics.periods[`p${period}`].away;
    }

    if ((homeScore + awayScore) % 2 === 1) {
      market.outcomes[0].status = 2;
    } else {
      market.outcomes[1].status = 2;
    }
  } else { return }
}

const WhichTeamToScore = (statistics, market, inclOvertimes, isPeriod) => {
  if (statistics.time_status === "3") {
    market.outcomes.forEach((outcome) => {
      outcome.status = 3;
    });
    let homeScore = statistics.result.home,
      awayScore = statistics.result.away;
    if (!inclOvertimes) {
      homeScore = statistics.periods.ft.home;
      awayScore = statistics.periods.ft.away;
    }
    if (isPeriod) {
      const period = parseFloat(market.specifiers.periodnr);
      homeScore = statistics.periods[`p${period}`].home;
      awayScore = statistics.periods[`p${period}`].away;
    }
    if (homeScore > 0 && awayScore > 0) {
      if (!inclOvertimes) {
        market.outcomes[0].status = 2;
      } else {
        market.outcomes[2].status = 2;
      }
    } else {
      if (homeScore > 0) {
        if (!inclOvertimes) {
          market.outcomes[1].status = 2;
        } else {
          market.outcomes[0].status = 2;
        }
      } else {
        if (!inclOvertimes) {
          if (awayScore === 0) {
            market.outcomes[3].status = 2;
          } else {
            market.outcomes[2].status = 2;
          }
        } else {
          market.outcomes[1].status = 2;
        }
      }
    }
  } else {
    // TODO make in live
    return
  }
}

const ResultRestOfMatch = (statistics, market) => {
  if (statistics.time_status === "3") {
    market.outcomes.forEach((outcome) => {
      outcome.status = 3;
    });
    const homeScore = statistics.result.home,
      awayScore = statistics.result.away;
    const homeCurrent = parseFloat(market.specifiers.score.split(':')[0]),
      awayCurrent = parseFloat(market.specifiers.score.split(':')[1]);
    if (homeScore - homeCurrent > awayScore - awayCurrent) {
      market.outcomes[0].status = 2;
    } else {
      if (homeScore - homeCurrent === awayScore - awayCurrent) {
        market.outcomes[1].status = 2;
      } else {
        market.outcomes[2].status = 2;
      }
    }
  } else {
    // TODO live
    return
  }
}

const ResultRestOfPeriod = (statistics, market) => {
  if (statistics.time_status === "3") {
    market.outcomes.forEach((outcome) => {
      outcome.status = 3;
    });
    const periodnr = parseFloat(market.specifiers.periodnr);
    let homeScore = 0,
      awayScore = 0;
    for (const period of [1, 2, 3]) {
      if (period <= periodnr) {
        homeScore += parseFloat(statistics.periods[`p${period}`].home);
        awayScore += parseFloat(statistics.periods[`p${period}`].away);
      }
    }
    const homeCurrent = parseFloat(market.specifiers.score.split(':')[0]),
      awayCurrent = parseFloat(market.specifiers.score.split(':')[1]);
    // If we take away current score
    if (homeScore - homeCurrent > awayScore - awayCurrent) {
      market.outcomes[1].status = 2;
    } else {
      if (homeScore - homeCurrent === awayScore - awayCurrent) {
        market.outcomes[0].status = 2;
      } else {
        market.outcomes[2].status = 2;
      }
    }
  } else {
    // TODO live
    return
  }
}

const CompetitorCleanSheet = (statistics, market, inclOvertimes, isPeriod) => {
  if (statistics.time_status === "3") {
    market.outcomes.forEach((outcome) => {
      outcome.status = 3;
    });
    const team = market.name.includes("competitor2") ? "home" : "away";
    let currentScore = statistics.result[team];
    if (!inclOvertimes) {
      currentScore = statistics.periods.ft[team];
    }
    if (isPeriod) {
      const period = market.specifiers.periodnr;
      currentScore = statistics.periods[`p${period}`][team];
    }
    if (currentScore !== 0) {
      market.outcomes[1].status = 2;
    } else {
      market.outcomes[0].status = 2;
    }
  } else {
    // TODO live
    return
  }
}

const WhichTeamScoresGoal = (statistics, market) => {
  let pointNumber = parseInt(market.specifiers.pointnr);

  if (!pointNumber) {
    pointNumber = parseInt(market.specifiers.goalnr);
  }

  market.outcomes.forEach((outcome) => {
    outcome.status = 3;
  });

  let totalGoals = 0;
  let teamScorer = 'none';
  statistics.events.forEach((event) => {
    if (event.text.includes("Goal -")) {
      // TODO: Check if it's not extra time
      totalGoals++;

      if (totalGoals === pointNumber) {
        teamScorer = event.text.includes(statistics.home.name) ? 'competitor1' : 'competitor2';
      }
    }
  });
  market.outcomes.forEach((outcome) => {
    if (teamScorer === 'none' && outcome.outcome === 'none') {
      outcome.status = 2;
      return;
    }
    if (outcome.outcome.includes(teamScorer)) {
      outcome.status = 2;
    }
  });
}

const MatchWinnerTotalGoals = (statistics, market, inclOvertimes) => {
  if (statistics.time_status === "3") {
    const total = market.specifiers.total;
    market.outcomes.forEach((outcome) => {
      const team = outcome.outcome.includes("competitor1") ? "home" : "away";
      const otherTeam = outcome.outcome.includes("competitor1") ? "away" : "home";
      let currentScore = statistics.result[team];
      let otherScore = statistics.result[otherTeam];
      if (!inclOvertimes) {
        currentScore = statistics.periods.ft[team];
        otherScore = statistics.periods.ft[otherTeam];
      }
      const isUnder = outcome.outcome.includes("under");
      if (currentScore > otherScore) {
        if (isUnder) {
          if (currentScore > total) {
            outcome.status = 3;
          } else {
            outcome.status = 2;
          }
        } else {
          if (currentScore < total) {
            outcome.status = 3;
          } else {
            outcome.status = 2;
          }
        }
      } else {
        outcome.status = 3;
      }
    });
  } else {
    return
  }
}
const MatchWinnerBothTeamsToScore = (statistics, market, inclOvertimes) => {
  if (statistics.time_status === "3") {
    market.outcomes.forEach((outcome) => {
      const team = outcome.outcome.includes('competitor1')
        ? 'home'
        : outcome.outcome.includes('away')
          ? 'away'
          : 'draw';
      const yes = outcome.outcome.includes("yes");
      let homeScore = statistics.result.home;
      let awayScore = statistics.result.away;
      if (!inclOvertimes) {
        homeScore = statistics.periods.ft.home;
        awayScore = statistics.periods.ft.away;
      }
      if (team === 'home') {
        if (yes) {
          if (homeScore > awayScore && awayScore > 0) {
            outcome.status = 2;
          } else {
            outcome.status = 3;
          }
        } else {
          if (homeScore > awayScore && awayScore === 0) {
            outcome.status = 2;
          } else {
            outcome.status = 3;
          }
        }
      } else {
        if (team === 'away') {
          if (yes) {
            if (awayScore > homeScore && homeScore > 0) {
              outcome.status = 2;
            } else {
              outcome.status = 3;
            }
          } else {
            if (awayScore > homeScore && homeScore === 0) {
              outcome.status = 2;
            } else {
              outcome.status = 3;
            }
          }
        } else {
          // Draw exist so overtimes are excluded
          if (yes) {
            if (awayScore > 0 && homeScore > 0 && awayScore === homeScore) {
              outcome.status = 2;
            } else {
              outcome.status = 3;
            }
          } else {
            if (!(awayScore > 0 && homeScore === 0) && awayScore === homeScore) {
              outcome.status = 2;
            } else {
              outcome.status = 3;
            }
          }
        }
      }
    });
  } else {
    return
  }
}

const PeriodAndWinner = (statistics, market, inclOvertimes = false) => {
  if (statistics.time_status === "3") {
    market.outcomes.forEach((outcome) => {
      const winner = outcome.outcome.split('&')[1].includes("draw")
        ? "draw"
        : outcome.outcome.split('&')[1].includes("competitor1")
          ? "home" : "away";
      const periodWinner = outcome.outcome.split('&')[0].includes("draw")
        ? "draw"
        : outcome.outcome.split('&')[0].includes("competitor1")
          ? "home" : "away";

      let homeScore = 0,
        awayScore = 0;
      if (inclOvertimes) {
        homeScore = statistics.result.home;
        awayScore = statistics.result.away;
      } else {
        homeScore = statistics.periods.ft.home;
        awayScore = statistics.periods.ft.away;
      }
      const homePeriodScore = statistics.periods[`p${market.specifiers.periodnr}`].home;
      const awayPeriodScore = statistics.periods[`p${market.specifiers.periodnr}`].away;
      if (homeScore > awayScore) {
        if (winner === "home") {
          if (homePeriodScore > awayPeriodScore) {
            if (periodWinner === "home") {
              outcome.status = 2;
            } else {
              outcome.status = 3;
            }
          } else {
            if (homePeriodScore === awayPeriodScore) {
              if (periodWinner === "draw") {
                outcome.status = 2;
              } else {
                outcome.status = 3;
              }
            } else {
              if (periodWinner === "away") {
                outcome.status = 2;
              } else {
                outcome.status = 3;
              }
            }
          }
        } else {
          outcome.status = 3;
        }
      } else {
        if (winner === "away") {
          if (homePeriodScore > awayPeriodScore) {
            if (periodWinner === "home") {
              outcome.status = 2;
            } else {
              outcome.status = 3;
            }
          } else {
            if (homePeriodScore === awayPeriodScore) {
              if (periodWinner === "draw") {
                outcome.status = 2;
              } else {
                outcome.status = 3;
              }
            } else {
              if (periodWinner === "away") {
                outcome.status = 2;
              } else {
                outcome.status = 3;
              }
            }
          }
        } else {
          outcome.status = 3;
        }
      }
      if (winner === "draw" && homeScore === awayScore) {
        if (homePeriodScore > awayPeriodScore) {
          if (periodWinner === "home") {
            outcome.status = 2;
          } else {
            outcome.status = 3;
          }
        } else {
          if (homePeriodScore === awayPeriodScore) {
            if (periodWinner === "draw") {
              outcome.status = 2;
            } else {
              outcome.status = 3;
            }
          } else {
            if (periodWinner === "away") {
              outcome.status = 2;
            } else {
              outcome.status = 3;
            }
          }
        }
      }
    });
  } else {
    // TODO in live
    return
  }
}

const CompetitorNoBet = (statistics, market) => {
  if (statistics.time_status === "3") {
    const teamBanned = market.name.includes("competitor1") ? "home" : "away";
    const teamOutside = market.name.includes("competitor2") ? "home" : "away";
    const bannedScore = statistics.result[teamBanned];
    const outsiderScore = statistics.result[teamOutside];
    market.outcomes.forEach((outcome) => {
      if (outcome.outcome === "draw") {
        if (bannedScore === outsiderScore) {
          outcome.status = 2;
        } else {
          if (bannedScore > outsiderScore) { // if banned won -> return (status 4)
            outcome.status = 4;
          } else {
            outcome.status = 3;
          }
        }
      } else {
        if (bannedScore < outsiderScore) {
          outcome.status = 2;
        } else {
          if (bannedScore !== outsiderScore) { // if banned won -> return (status 4)
            outcome.status = 4;
          } else {
            outcome.status = 3;
          }
        }
      }
    })
  } else {
    return
  }
}

const DoubleChanceHockey = (statistics, market) => {
  if (statistics.time_status === "3") {
    market.outcomes.forEach((outcome) => {
      outcome.status = 3;
    });
    const homeScore = statistics.result.home,
      awayScore = statistics.result.away;
    if (homeScore > awayScore || homeScore === awayScore) {
      market.outcomes[0].status = 2;
    }
    if (awayScore > homeScore || homeScore === awayScore) {
      market.outcomes[2].status = 2;
    }
    if (homeScore > awayScore || awayScore > homeScore) {
      market.outcomes[1].status = 2;
    }
  } else { return }
}

const DrawNoBetHockey = (statistics, market, isPeriod) => {
  if (statistics.time_status === "3") {
    market.outcomes.forEach((outcome) => {
      outcome.status = 3;
    });
    let homeScore = statistics.result.home,
      awayScore = statistics.result.away;
    if (isPeriod) {
      const period = parseFloat(market.specifiers.periodnr);
      homeScore = statistics.periods[`p${period}`].home,
        awayScore = statistics.periods[`p${period}`].away;
    }
    if (homeScore > awayScore) {
      market.outcomes[0].status = 2;
    }
    if (awayScore > homeScore) {
      market.outcomes[1].status = 2;
    }
    if (homeScore === awayScore) {
      market.outcomes.forEach((outcome) => {
        outcome.status = 4;
      });
    }
  } else { return }
}

const Handicap3WayHockey = (statistics, market) => {
  let homeResult = statistics.periods.ft.home;
  let awayResult = statistics.periods.ft.away;
  if (market.name.includes('incl. overtime')) {
    homeResult = statistics.result.home;
    awayResult = statistics.result.away;
  }

  if (statistics.time_status === "3") {
    market.outcomes.forEach((outcome) => {
      outcome.status = 3;
    });

    if (market.specifiers.hcp.includes(':')) {
      const homeHC = parseFloat(market.specifiers.hcp.split(":")[0]);
      const awayHC = parseFloat(market.specifiers.hcp.split(":")[1]);
      const homeBetHcpResult = homeResult + homeHC;
      const awayBetHcpResult = awayResult + awayHC;

      if (homeBetHcpResult > awayBetHcpResult) {
        market.outcomes[0].status = 2;
      } else {
        if (homeBetHcpResult < awayBetHcpResult) {
          market.outcomes[2].status = 2;
        } else {
          market.outcomes[1].status = 2;
        }
      }
    } else {
      const handicap = parseFloat(market.specifiers.hcp.replace("+"));

      const homeBetHcp = market.outcomes[0].outcome.includes("+hcp") ? "+" : "-";
      const drawBetHcp = market.outcomes[1].outcome.includes("+hcp") ? "+" : "-";
      const awayBetHcp = market.outcomes[2].outcome.includes("+hcp") ? "+" : "-";

      //Home bet estimation
      if (homeBetHcp === "+") {
        const homeBetHcpResult = homeResult + handicap;

        if (homeBetHcpResult > awayResult) {
          market.outcomes[0].status = 2;
        }
      }
      if (homeBetHcp === "-") {
        const homeBetHcpResult = homeResult - handicap;

        if (homeBetHcpResult > awayResult) {
          market.outcomes[0].status = 2;
        }
      }

      //draw bet estimation
      if (drawBetHcp === "+" && homeBetHcp === "+") {
        const homeBetHcpResult = homeResult + handicap;
        console.log(homeBetHcpResult === awayResult);

        if (homeBetHcpResult === awayResult) {
          market.outcomes[1].status = 2;
        }
      }

      if (drawBetHcp === "+" && awayBetHcp === "+") {
        const awayBetHcpResult = awayResult + handicap;

        if (awayBetHcpResult === homeResult) {
          market.outcomes[1].status = 2;
        }
      }

      if (drawBetHcp === "-" && homeBetHcp === "-") {
        const homeBetHcpResult = homeResult - handicap;

        if (homeBetHcpResult === awayResult) {
          market.outcomes[1].status = 2;
        }
      }

      if (drawBetHcp === "-" && awayBetHcp === "-") {
        const awayBetHcpResult = awayResult - handicap;

        if (awayBetHcpResult === homeResult) {
          market.outcomes[1].status = 2;
        }
      }

      //Away bet estimation
      if (awayBetHcp === "+") {
        const awayBetHcpResult = awayResult + handicap;

        if (awayBetHcpResult > homeResult) {
          market.outcomes[2].status = 2;
        }
      }
      if (awayBetHcp === "-") {
        const awayBetHcpResult = awayResult - handicap;

        if (awayBetHcpResult > homeResult) {
          market.outcomes[2].status = 2;
        }
      }
    }
  } else { return }
}

const HandicapHockey = (statistics, market) => {
  if (statistics.time_status === "3") {
    market.outcomes.forEach((outcome) => {
      outcome.status = 3;
    });

    const handicap = parseFloat(market.specifiers.hcp.replace("+"));

    let homeResult = statistics.periods.ft.home;
    let awayResult = statistics.periods.ft.away;
    if (market.name.includes('incl. overtime')) {
      homeResult = statistics.result.home;
      awayResult = statistics.result.away;
    }

    const homeBetHcp = market.outcomes[0].outcome.includes("+hcp") ? "+" : "-";
    const awayBetHcp = market.outcomes[1].outcome.includes("+hcp") ? "+" : "-";

    //Home bet estimation
    if (homeBetHcp === "+") {
      const homeBetHcpResult = homeResult + handicap;

      if (homeBetHcpResult > awayResult) {
        market.outcomes[0].status = 2;
      }

      if (homeBetHcpResult === awayResult) {
        market.outcomes[0].status = 4;
      }
    }
    if (homeBetHcp === "-") {
      const homeBetHcpResult = homeResult - handicap;

      if (homeBetHcpResult > awayResult) {
        market.outcomes[0].status = 2;
      }

      if (homeBetHcpResult === awayResult) {
        market.outcomes[0].status = 4;
      }
    }

    //Away bet estimation
    if (awayBetHcp === "+") {
      const awayBetHcpResult = awayResult + handicap;

      if (awayBetHcpResult > homeResult) {
        market.outcomes[1].status = 2;
      }

      if (awayBetHcpResult === homeResult) {
        market.outcomes[1].status = 4;
      }
    }
    if (awayBetHcp === "-") {
      const awayBetHcpResult = awayResult - handicap;

      if (awayBetHcpResult > homeResult) {
        market.outcomes[1].status = 2;
      }

      if (awayBetHcpResult === homeResult) {
        market.outcomes[1].status = 4;
      }
    }
  } else { return }
}

const TotalGoalsHockey = (statistics, market) => {
  if (statistics.time_status === '3') {
    market.outcomes.forEach((outcome) => {
      outcome.status = 3;
    });
    const total = parseFloat(market.specifiers.total);
    let totalGoals = 0;

    statistics.events.forEach((event) => {
      if (event.text.includes("Goal -")) {
        // TODO: Check if it's not extra time
        totalGoals++;
      }
    });

    if (totalGoals < total) {
      market.outcomes[0].status = 2;
    }
    if (totalGoals > total) {
      market.outcomes[1].status = 2;
    }
    if (totalGoals === total) {
      market.outcomes[0].status = 4;
      market.outcomes[1].status = 4;
    }
  } else {
    return;
  }
}

const WinningMargin = (statistics, market) => {
  if (statistics.time_status === "3") {

    market.outcomes.forEach((outcome) => {
      const team = outcome.outcome.includes('draw')
        ? 'draw'
        : outcome.outcome.includes('competitor1')
          ? "home"
          : "away"

      if (team === "draw") {
        outcome.status = 3;
        return
      }

      const margin = outcome.outcome.split(' by ')[1];
      const marginValue = margin.includes('+') ? parseFloat(margin.split('+')[0]) : parseFloat(margin);

      const oponent = team === 'home' ? 'away' : 'home';
      let marginerScore = statistics.periods.ft[team];
      let oponentScore = statistics.periods.ft[oponent];
      if (market.name.includes('incl. overtime')) {
        marginerScore = statistics.result[team];
        oponentScore = statistics.result[oponent];
      }

      if (margin.includes('+')) {
        if (marginerScore - marginValue > oponentScore) {
          outcome.status = 2;
        } else {
          outcome.status = 3;
        }
      } else {
        if (marginerScore - marginValue === oponentScore) {
          outcome.status = 2;
        } else {
          outcome.status = 3;
        }
      }
    })
  } else {
    return
  }
}

const HighestScoringPeriod = (statistics, market) => {
  if (statistics.time_status === "3") {
    market.outcomes.forEach((outcome) => {
      outcome.status = 3;
    });
    const p1 = statistics.periods.p1.home + statistics.periods.p1.away;
    const p2 = statistics.periods.p2.home + statistics.periods.p2.away;
    const p3 = statistics.periods.p3.home + statistics.periods.p3.away;

    if (p1 > p2 && p1 > p3) {
      market.outcomes[0].status = 2;
    }
    if (p2 > p1 && p2 > p3) {
      market.outcomes[1].status = 2;
    }
    if (p3 > p2 && p3 > p1) {
      market.outcomes[2].status = 2;
    }
    if ((p2 === p1 && p2 >= p3) || (p2 === p3 && p2 >= p1) || (p1 === p3 && p1 >= p2)) {
      market.outcomes[3].status = 2;
    }
  } else {
    return
  }
}

const CompetitorHighestScoringPeriod = (statistics, market) => {
  if (statistics.time_status === "3") {
    market.outcomes.forEach((outcome) => {
      outcome.status = 3;
    });
    const team = market.name.includes('competitor1') ? 'home' : 'away';
    const p1 = statistics.periods.p1[team];
    const p2 = statistics.periods.p2[team];
    const p3 = statistics.periods.p3[team];

    if (p1 > p2 && p1 > p3) {
      market.outcomes[0].status = 2;
    }
    if (p2 > p1 && p2 > p3) {
      market.outcomes[1].status = 2;
    }
    if (p3 > p2 && p3 > p1) {
      market.outcomes[2].status = 2;
    }
    if ((p2 === p1 && p2 >= p3) || (p2 === p3 && p2 >= p1) || (p1 === p3 && p1 >= p2)) {
      market.outcomes[3].status = 2;
    }
  } else {
    return
  }
}

const ExactGoals = (statistics, market, isPeriod) => {
  if (statistics.time_status === "3") {
    market.outcomes.forEach((outcome) => {
      outcome.status = 3;
    });
    let goals = statistics.result.home + statistics.result.away;
    if (isPeriod) {
      const period = market.specifiers.periodnr;
      goals = statistics.periods[`p${period}`].home + statistics.periods[`p${period}`].away;
    }

    market.outcomes.forEach(outcome => {
      if (outcome.outcome.includes('+')) {
        const exact = parseFloat(outcome.outcome.split('+')[0]);
        if (goals >= exact) {
          outcome.status = 2;
        } else {
          outcome.status = 3;
        }
      } else {
        const exact = parseFloat(outcome.outcome);
        if (goals === exact) {
          outcome.status = 2;
        } else {
          outcome.status = 3;
        }
      }
    });
  } else {
    return
  }
}

const ToWinAllPeriods = (statistics, market) => {
  if (statistics.time_status === "3") {
    const team = market.name.includes('competitor1') ? 'home' : 'away';
    const oponent = market.name.includes('competitor1') ? 'away' : 'home';
    const p1Winner = statistics.periods.p1[team] > statistics.periods.p1[oponent];
    const p2Winner = statistics.periods.p2[team] > statistics.periods.p2[oponent];
    const p3Winner = statistics.periods.p3[team] > statistics.periods.p3[oponent];

    if (p1Winner && p2Winner && p3Winner) {
      market.outcomes[0].status = 2;
      market.outcomes[1].status = 3;
    } else {
      market.outcomes[1].status = 2;
      market.outcomes[0].status = 3;
    }

  } else {
    return
  }
}

const ToWinAnyPeriod = (statistics, market) => {
  if (statistics.time_status === "3") {
    const team = market.name.includes('competitor1') ? 'home' : 'away';
    const oponent = market.name.includes('competitor1') ? 'away' : 'home';
    const p1Winner = statistics.periods.p1[team] > statistics.periods.p1[oponent];
    const p2Winner = statistics.periods.p2[team] > statistics.periods.p2[oponent];
    const p3Winner = statistics.periods.p3[team] > statistics.periods.p3[oponent];

    if (p1Winner || p2Winner || p3Winner) {
      market.outcomes[0].status = 2;
      market.outcomes[1].status = 3;
    } else {
      market.outcomes[1].status = 2;
      market.outcomes[0].status = 3;
    }

  } else {
    return
  }
}

const ToScoreInAllPeriods = (statistics, market) => {
  if (statistics.time_status === "3") {
    const team = market.name.includes('competitor1') ? 'home' : 'away';
    const p1Scored = statistics.periods.p1[team] > 0;
    const p2Scored = statistics.periods.p2[team] > 0;
    const p3Scored = statistics.periods.p3[team] > 0;

    if (p1Scored && p2Scored && p3Scored) {
      market.outcomes[0].status = 2;
      market.outcomes[1].status = 3;
    } else {
      market.outcomes[1].status = 2;
      market.outcomes[0].status = 3;
    }

  } else {
    return
  }
}

const TotalGoalsPerPeriod = (statistics, market) => {
  if (statistics.time_status === "3") {
    const total = parseFloat(market.specifiers.total);
    const isOver = market.name.includes('over');
    const p1Goals = statistics.periods.p1.home + statistics.periods.p1.away;
    const p2Goals = statistics.periods.p2.home + statistics.periods.p2.away;
    const p3Goals = statistics.periods.p3.home + statistics.periods.p3.away;

    if (isOver) {
      if (p1Goals > total && p2Goals > total && p3Goals > total) {
        market.outcomes[0].status = 2;
        market.outcomes[1].status = 3;
      } else {
        market.outcomes[1].status = 2;
        market.outcomes[0].status = 3;
      }
    } else {
      if (p1Goals < total && p2Goals < total && p3Goals < total) {
        market.outcomes[0].status = 2;
        market.outcomes[1].status = 3;
      } else {
        market.outcomes[1].status = 2;
        market.outcomes[0].status = 3;
      }
    }

  } else {
    return
  }
}

const PeriodThreeWay = (statistics, market) => {
  if (statistics.time_status === "3") {
    const periodnr = parseFloat(market.specifiers.periodnr);
    const homeScore = statistics.periods[`p${periodnr}`].home,
      awayScore = statistics.periods[`p${periodnr}`].away;

    if (homeScore > awayScore) {
      market.outcomes[0].status = 2;
      market.outcomes[1].status = 3;
      market.outcomes[2].status = 3;
    } else {
      if (homeScore < awayScore) {
        market.outcomes[0].status = 3;
        market.outcomes[1].status = 3;
        market.outcomes[2].status = 2;
      } else {
        market.outcomes[0].status = 3;
        market.outcomes[1].status = 2;
        market.outcomes[2].status = 3;
      }
    }

  } else {
    return
  }
}

const PeriodGoal = (statistics, market) => {
  if (statistics.time_status === "3") {
    const periodnr = market.specifiers.periodnr;
    const goalnr = parseFloat(market.specifiers.goalnr);

    let periodAchieved = false, goalsCounter = 0;

    for (const event of statistics.events) {
      // finish if estimated
      if (market.outcomes[0].status !== 1) {
        break;
      }

      if (!periodAchieved && event.text.includes("period") && event.text[0] === periodnr) {
        periodAchieved = true;
        continue;
      }

      if (periodAchieved) {
        if (event.text.includes("Goal -")) {
          if ((goalsCounter + 1) === goalnr) {
            if (event.text.includes(statistics.home.name)) {
              market.outcomes[0].status = 2;
              market.outcomes[1].status = 3;
              market.outcomes[2].status = 3;
              break;
            } else {
              market.outcomes[0].status = 3;
              market.outcomes[1].status = 3;
              market.outcomes[2].status = 2;
              break;
            }
          } else {
            goalsCounter++;
            continue;
          }
        }
        if (event.text === 'Break') {
          market.outcomes[0].status = 3;
          market.outcomes[1].status = 2;
          market.outcomes[2].status = 3;
          break;
        }
      }
    }
  } else {
    return
  }
}

const PeriodHandicap = (statistics, market) => {
  if (statistics.time_status === "3") {
    market.outcomes.forEach((outcome) => {
      outcome.status = 3;
    });

    const handicap = parseFloat(market.specifiers.hcp.replace("+"));
    const period = parseFloat(market.specifiers.periodnr);

    const homeResult = statistics.periods[`p${period}`].home;
    const awayResult = statistics.periods[`p${period}`].away;

    if (market.outcomes.length === 2) {
      const homeBetHcp = market.outcomes[0].outcome.includes("+hcp") ? "+" : "-";
      const awayBetHcp = market.outcomes[1].outcome.includes("+hcp") ? "+" : "-";

      //Home bet estimation
      if (homeBetHcp === "+") {
        const homeBetHcpResult = homeResult + handicap;

        if (homeBetHcpResult > awayResult) {
          market.outcomes[0].status = 2;
        }

        if (homeBetHcpResult === awayResult) {
          market.outcomes[0].status = 4;
        }
      }
      if (homeBetHcp === "-") {
        const homeBetHcpResult = homeResult - handicap;

        if (homeBetHcpResult > awayResult) {
          market.outcomes[0].status = 2;
        }

        if (homeBetHcpResult === awayResult) {
          market.outcomes[0].status = 4;
        }
      }

      //Away bet estimation
      if (awayBetHcp === "+") {
        const awayBetHcpResult = awayResult + handicap;

        if (awayBetHcpResult > homeResult) {
          market.outcomes[1].status = 2;
        }

        if (awayBetHcpResult === homeResult) {
          market.outcomes[1].status = 4;
        }
      }
      if (awayBetHcp === "-") {
        const awayBetHcpResult = awayResult - handicap;

        if (awayBetHcpResult > homeResult) {
          market.outcomes[1].status = 2;
        }

        if (awayBetHcpResult === homeResult) {
          market.outcomes[1].status = 4;
        }
      }
    } else {
      if (market.specifiers.hcp.includes(':')) {
        const homeHC = parseFloat(market.specifiers.hcp.split(":")[0]);
        const awayHC = parseFloat(market.specifiers.hcp.split(":")[1]);
        const homeBetHcpResult = homeResult + homeHC;
        const awayBetHcpResult = awayResult + awayHC;

        if (homeBetHcpResult > awayBetHcpResult) {
          market.outcomes[0].status = 2;
        } else {
          if (homeBetHcpResult < awayBetHcpResult) {
            market.outcomes[2].status = 2;
          } else {
            market.outcomes[1].status = 2;
          }
        }
      } else {
        const homeBetHcp = market.outcomes[0].outcome.includes("+hcp") ? "+" : "-";
        const drawBetHcp = market.outcomes[1].outcome.includes("+hcp") ? "+" : "-";
        const awayBetHcp = market.outcomes[2].outcome.includes("+hcp") ? "+" : "-";
        //Home bet estimation
        if (homeBetHcp === "+") {
          const homeBetHcpResult = homeResult + handicap;

          if (homeBetHcpResult > awayResult) {
            market.outcomes[0].status = 2;
          }
        }
        if (homeBetHcp === "-") {
          const homeBetHcpResult = homeResult - handicap;

          if (homeBetHcpResult > awayResult) {
            market.outcomes[0].status = 2;
          }
        }

        //draw bet estimation
        if (drawBetHcp === "+" && homeBetHcp === "+") {
          const homeBetHcpResult = homeResult + handicap;
          console.log(homeBetHcpResult === awayResult);

          if (homeBetHcpResult === awayResult) {
            market.outcomes[1].status = 2;
          }
        }

        if (drawBetHcp === "+" && awayBetHcp === "+") {
          const awayBetHcpResult = awayResult + handicap;

          if (awayBetHcpResult === homeResult) {
            market.outcomes[1].status = 2;
          }
        }

        if (drawBetHcp === "-" && homeBetHcp === "-") {
          const homeBetHcpResult = homeResult - handicap;

          if (homeBetHcpResult === awayResult) {
            market.outcomes[1].status = 2;
          }
        }

        if (drawBetHcp === "-" && awayBetHcp === "-") {
          const awayBetHcpResult = awayResult - handicap;

          if (awayBetHcpResult === homeResult) {
            market.outcomes[1].status = 2;
          }
        }

        //Away bet estimation
        if (awayBetHcp === "+") {
          const awayBetHcpResult = awayResult + handicap;

          if (awayBetHcpResult > homeResult) {
            market.outcomes[2].status = 2;
          }
        }
        if (awayBetHcp === "-") {
          const awayBetHcpResult = awayResult - handicap;

          if (awayBetHcpResult > homeResult) {
            market.outcomes[2].status = 2;
          }
        }
      }
    }
  } else { return }
}

const PeriodTotalGoals = (statistics, market) => {
  if (statistics.time_status === "3") {
    const total = parseFloat(market.specifiers.total);
    const period = parseFloat(market.specifiers.periodnr);

    const isOver = market.name.includes('over');
    let totalGoals = statistics.periods[`p${period}`].home + statistics.periods[`p${period}`].away;
    if (market.name.includes('competitor')) {
      const team = market.name.includes('competitor1') ? 'home' : 'away';
      totalGoals = statistics.periods[`p${period}`][team];
    }

    if (isOver) {
      if (totalGoals > total) {
        market.outcomes[0].status = 2;
        market.outcomes[1].status = 3;
      } else {
        if (totalGoals < total) {
          market.outcomes[1].status = 2;
          market.outcomes[0].status = 3;
        } else {
          market.outcomes[1].status = 4;
          market.outcomes[0].status = 4;
        }
      }
    } else {
      if (totalGoals < total) {
        market.outcomes[0].status = 2;
        market.outcomes[1].status = 3;
      } else {
        if (totalGoals > total) {
          market.outcomes[1].status = 2;
          market.outcomes[0].status = 3;
        } else {
          market.outcomes[1].status = 4;
          market.outcomes[0].status = 4;
        }
      }
    }

  } else {
    return
  }
}

const CleanSheet = (statistics, market) => {
  if (statistics.time_status === "3") {
    const total = parseFloat(market.specifiers.total);
    const period = parseFloat(market.specifiers.periodnr);

    const isOver = market.name.includes('over');
    const totalGoals = statistics.periods[`p${period}`].home + statistics.periods.p1.away;

    if (isOver) {
      if (totalGoals > total) {
        market.outcomes[0].status = 2;
        market.outcomes[1].status = 3;
      } else {
        market.outcomes[1].status = 2;
        market.outcomes[0].status = 3;
      }
    } else {
      if (totalGoals < total) {
        market.outcomes[0].status = 2;
        market.outcomes[1].status = 3;
      } else {
        market.outcomes[1].status = 2;
        market.outcomes[0].status = 3;
      }
    }
  } else {
    return
  }
}

const Goal = (statistics, market) => {
  const goalnr = parseFloat(market.specifiers.goalnr);
  if (statistics.time_status === '3') {
    market.outcomes.forEach((outcome) => {
      outcome.status = 3;
    });

    let totalGoals = 0;
    let teamScorer = 'no goal';
    statistics.events.forEach((event) => {
      if (event.text.includes("Goal -")) {
        // TODO: Check if it's not extra time
        totalGoals++;

        if (totalGoals === goalnr) {
          teamScorer = event.text.includes(statistics.home.name) ? 'competitor1' : 'competitor2';
        }
      }
    });
    market.outcomes.forEach((outcome) => {
      if (teamScorer === 'no goal' && outcome.outcome === 'no goal') {
        outcome.status = 2;
        return;
      }
      if (outcome.outcome.split('&')[0].includes(teamScorer)) {
        outcome.status = 2;
      }
    });

  } else {
    return
  }
}

const GoalAndMatchbet = (statistics, market) => {
  const homeResult = statistics.result.home;
  const awayResult = statistics.result.away;

  const goalnr = parseFloat(market.specifiers.goalnr);
  if (statistics.time_status === '3') {
    market.outcomes.forEach((outcome) => {
      outcome.status = 3;
    });
    let totalGoals = 0;

    const matchbet = homeResult > awayResult
      ? 'competitor1'
      : homeResult < awayResult
        ? 'competitor2'
        : 'draw';
    let teamScorer = 'no goal';
    statistics.events.forEach((event) => {
      if (event.text.includes("Goal -")) {
        // TODO: Check if it's not extra time
        totalGoals++;

        if (totalGoals === goalnr) {
          teamScorer = event.text.includes(statistics.home.name) ? 'competitor1' : 'competitor2';
        }
      }
    });
    market.outcomes.forEach((outcome) => {
      if (teamScorer === 'no goal' && outcome.outcome === 'no goal') {
        outcome.status = 2;
        return;
      }
      if (outcome.outcome.includes('&') && outcome.outcome.split('&')[1].includes(matchbet)) {
        if (outcome.outcome.split('&')[0].includes(teamScorer)) {
          outcome.status = 2;
        }
      }
    });

  } else {
    return
  }
}

const CorrectScoreHockey = (statistics, market) => {
  for (const event of statistics.events) {
    if (event.text.includes('Goal') || event.text.includes('period')) {
      console.log(event.text);
    }
  }
  const homeResult = statistics.result.home;
  const awayResult = statistics.result.away;
  const correctScore = `${homeResult}:${awayResult}`;

  if (statistics.time_status === '3') {
    market.outcomes.forEach((outcome) => {
      outcome.status = 3;
    });

    market.outcomes.forEach((outcome) => {
      if (outcome.outcome === correctScore) {
        outcome.status = 2;
        return;
      }
    });

    if (!market.outcomes.some(outcome => outcome.status === 2)) {
      market.outcomes.forEach(outcome => {
        if (outcome.outcome === 'other') {
          outcome.status = 2;
          return;
        }
      })
    }
  } else {
    return
  }
}

const PeriodDoubleChance = (statistics, market) => {
  const period = parseFloat(market.specifiers.periodnr);
  const homeResult = statistics.periods[`p${period}`].home;
  const awayResult = statistics.periods[`p${period}`].away;

  if (statistics.time_status === '3') {
    market.outcomes.forEach((outcome) => {
      outcome.status = 3;
    });

    if (homeResult > awayResult) {
      market.outcomes[0].status = 2;
      market.outcomes[1].status = 2;
    } else {
      if (homeResult < awayResult) {
        market.outcomes[1].status = 2;
        market.outcomes[2].status = 2;
      } else {
        market.outcomes[0].status = 2;
        market.outcomes[2].status = 2;
      }
    }
  } else {
    // TODO est. on period end
    return
  }
}

module.exports = {
  CompetitorTotal,
  CompetitorExactGoals,
  BothTeamsToScoreHockey,
  DoubleChanceHockey,
  DrawNoBetHockey,
  Handicap3WayHockey,
  HandicapHockey,
  PeriodHandicap,
  TotalGoalsHockey,
  OddEven,
  WhichTeamToScore,
  ResultRestOfMatch,
  CompetitorCleanSheet,
  WhichTeamScoresGoal,
  MatchWinnerTotalGoals,
  MatchWinnerBothTeamsToScore,
  PeriodAndWinner,
  CompetitorNoBet,
  WinningMargin,
  HighestScoringPeriod,
  CompetitorHighestScoringPeriod,
  ExactGoals,
  ToWinAllPeriods,
  ToWinAnyPeriod,
  ToScoreInAllPeriods,
  TotalGoalsPerPeriod,
  PeriodThreeWay,
  PeriodGoal,
  PeriodTotalGoals,
  ResultRestOfPeriod,
  CleanSheet,
  Goal,
  GoalAndMatchbet,
  CorrectScoreHockey,
  PeriodDoubleChance
};
