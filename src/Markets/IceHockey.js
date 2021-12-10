// status 2 - win 3 - lose

const e = require("express");

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

const CompetitorExactGoals = (statistics, market) => {

  const team = market.name.includes("competitor2") ? "away" : "home";
  const goals = statistics.result[team];



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
      if (outcome.outcomes.includes('+') && goals > exact) {
        outcome.status = 2;
      }
      return;
    } else {
      if (exact === goals) {
        outcome.status = 2;
      } else {
        outcome.status = 3;
      }
    }
  });
};


const BothTeamsToScoreHockey = (statistics, market) => {
  if (statistics.time_status === "3") {
    market.outcomes.forEach((outcome) => {
      outcome.status = 3;
    });
    if (statistics.result.home > 0 && statistics.result.away > 0) {
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

const OddEven = (statistics, market) => {
  if (statistics.time_status === "3") {
    market.outcomes.forEach((outcome) => {
      outcome.status = 3;
    });
    const homeScore = statistics.result.home,
      awayScore = statistics.result.away;
    if ((homeScore + awayScore) % 2 === 1) {
      market.outcomes[0].status = 2;
    } else {
      market.outcomes[1].status = 2;
    }
  } else { return }
}

const WhichTeamToScore = (statistics, market) => {
  if (statistics.time_status === "3") {
    market.outcomes.forEach((outcome) => {
      outcome.status = 3;
    });
    const homeScore = statistics.result.home,
      awayScore = statistics.result.away;
    if (homeScore > 0 && awayScore > 0) {
      market.outcomes[2].status = 2;
    } else {
      if (homeScore > 0) {
        market.outcomes[0].status = 2;
      } else {
        market.outcomes[1].status = 2;
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

const CompetitorCleanSheet = (statistics, market) => {
  if (statistics.time_status === "3") {
    market.outcomes.forEach((outcome) => {
      outcome.status = 3;
    });
    const team = market.name.includes("competitor2") ? "home" : "away";
    const currentScore = statistics.result[team];
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

  // TODO fix goal scores first ?
  if (statistics.time_status === "3") {
    market.outcomes[1].status = 2;
    if (statistics.result.home >= pointNumber) {
      market.outcomes[0].status = 2;
    } else {
      market.outcomes[0].status = 3;
      market.outcomes[1].status = 3;
    }
    if (statistics.result.away >= pointNumber) {
      market.outcomes[2].status = 2;
    } else {
      market.outcomes[2].status = 3;
      market.outcomes[1].status = 3;
    }
  } else {
    market.outcomes[1].status = 2;
    if (statistics.result.home >= pointNumber) {
      market.outcomes[0].status = 2;
    } else {
      market.outcomes[0].status = 3;
      market.outcomes[1].status = 3;
    }
    if (statistics.result.away >= pointNumber) {
      market.outcomes[2].status = 2;
    } else {
      market.outcomes[2].status = 3;
      market.outcomes[1].status = 3;
    }
  }
}

const MatchWinnerTotalGoals = (statistics, market) => {
  if (statistics.time_status === "3") {
    const total = market.specifiers.total;
    market.outcomes.forEach((outcome) => {
      const team = outcome.outcome.includes("competitor1") ? "home" : "away";
      const otherTeam = outcome.outcome.includes("competitor1") ? "away" : "home";
      const currentScore = statistics.result[team];
      const otherScore = statistics.result[otherTeam];
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
const MatchWinnerBothTeamsToScore = (statistics, market) => {
  if (statistics.time_status === "3") {
    market.outcomes.forEach((outcome) => {
      const team = outcome.outcome.includes("competitor1") ? "home" : "away";
      const yes = outcome.outcome.includes("yes");
      const homeScore = statistics.result.home;
      const awayScore = statistics.result.away;
      if (team === "home") {
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
          outcome.status = 3;
        }
      } else {
        if (bannedScore < outsiderScore) {
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

const DrawNoBetHockey = (statistics, market) => {
  if (statistics.time_status === "3") {
    market.outcomes.forEach((outcome) => {
      outcome.status = 3;
    });
    const homeScore = statistics.result.home,
      awayScore = statistics.result.away;
    if (homeScore > awayScore) {
      market.outcomes[0].status = 2;
    }
    if (awayScore > homeScore) {
      market.outcomes[1].status = 2;
    }
    if (homeScore === awayScore) {
      market.outcomes.forEach((outcome) => {
        outcome.status = "Return";
      });
    }
  } else { return }
}

const Handicap3WayHockey = (statistics, market) => {
  if (statistics.time_status === "3") {
    market.outcomes.forEach((outcome) => {
      outcome.status = 3;
    });

    const handicap = parseFloat(market.specifiers.hcp.replace("+"));

    const homeResult = statistics.result.home;
    const awayResult = statistics.result.away;

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
  } else { return }
}

const HandicapHockey = (statistics, market) => {
  if (statistics.time_status === "3") {
    market.outcomes.forEach((outcome) => {
      outcome.status = 3;
    });

    const handicap = parseFloat(market.specifiers.hcp.replace("+"));

    const homeResult = statistics.result.home;
    const awayResult = statistics.result.away;

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
  const homeResult = statistics.result.home;
  const awayResult = statistics.result.away;

  if (
    parseInt(homeResult) + parseInt(awayResult) >=
    parseFloat(market.specifiers.total)
  ) {
    market.outcomes.forEach((outcome) => {
      outcome.status = 3;
    });
    const total = parseFloat(market.specifiers.total);
    let totalGoals = 0;

    statistics.events.forEach((event) => {
      if (event.text.includes(" Goal -")) {
        //Check if it's not extra time
        if (parseInt(event.text.split(" ")[0].replace("'", "")) < 90) {
          totalGoals++;
        }
      }
    });

    if (totalGoals < total) {
      market.outcomes[0].status = 2;
    }
    if (totalGoals > total) {
      market.outcomes[1].status = 2;
    }
  } else if (statistics.time_status === '3') {
    market.outcomes.forEach((outcome) => {
      outcome.status = 3;
    });
    const total = parseFloat(market.specifiers.total);
    let totalGoals = 0;

    statistics.events.forEach((event) => {
      if (event.text.includes(" Goal -")) {
        //Check if it's not extra time
        if (parseInt(event.text.split(" ")[0].replace("'", "")) < 90) {
          totalGoals++;
        }
      }
    });

    if (totalGoals < total) {
      market.outcomes[0].status = 2;
    }
    if (totalGoals > total) {
      market.outcomes[1].status = 2;
    }
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
      const marginerScore = statistics.result[team];
      const oponentScore = statistics.result[oponent];


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

const ExactGoals = (statistics, market) => {
  if (statistics.time_status === "3") {
    market.outcomes.forEach((outcome) => {
      outcome.status = 3;
    });
    const goals = statistics.result.home + statistics.result.away;

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

module.exports = {
  CompetitorTotal,
  CompetitorExactGoals,
  BothTeamsToScoreHockey,
  DoubleChanceHockey,
  DrawNoBetHockey,
  Handicap3WayHockey,
  HandicapHockey,
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
  ToWinAllPeriods
};
