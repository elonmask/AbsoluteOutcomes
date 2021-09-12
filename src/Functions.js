const { parse } = require("nodemon/lib/cli");

const isFullTimeEnded = (statistics) => {
  if (statistics.scores["1"] && statistics.scores["2"]) {
    return statistics.time_status === "3";
  } else {
    return false;
  }
};

const fullTimeResult = (statistics, market) => {
  if (statistics.time_status === "3") {
    market.outcomes.forEach((outcome) => {
      outcome.status = 3;
    });

    const homeScore = parseInt(statistics.ss.split("-")[0]);
    const awayScore = parseInt(statistics.ss.split("-")[1]);

    if (homeScore === awayScore) {
      market.outcomes[0].status = 2;
    } else if (homeScore > awayScore) {
      market.outcomes[1].status = 2;
    } else {
      market.outcomes[2].status = 2;
    }
    console.log("Full Time Result estimated.");
  } else {
    console.log("Wrong time status for Full Time Result estimation.");
    return false;
  }
};

const WhichTeamToScoreNGoal = (statistics, market) => {
  market.outcomes.forEach((outcome) => {
    outcome.status = 3;
  });

  const goalNumber = parseInt(market.specifiers.goalnr);
  const homeTeam = statistics.home.name;
  const awayTeam = statistics.away.name;

  //TODO
  /*Доработать обработку автогола. Автогол приносит очко команде соперника*/
  let homeGoals = 0;
  let awayGoals = 0;
  let fullTimeEnded = false;

  statistics.events.forEach((event) => {
    if (event.text.includes(" Goal -")) {
      const teamScored =
        event.text.split(" ")[6].replace("(", "").replace(")", "") === homeTeam
          ? "home"
          : "away";

      //Check if it's not extra time
      if (parseInt(event.text.split(" ")[0].replace("'", "")) < 90) {
        if (teamScored === "home") {
          homeGoals++;
        } else if (teamScored === "away") {
          awayGoals++;
        }
      }
    } else if (event.text.includes("Score After Full Time")) {
      fullTimeEnded = true;
    }
  });

  if (homeGoals >= goalNumber) {
    market.outcomes[0].status = 2;
  } else if (awayGoals >= goalNumber) {
    market.outcomes[2].status = 2;
  } else {
    if (fullTimeEnded) {
      market.outcomes[1].status = 2;
    }
  }

  console.log("N Goal market estimated.");
};

const DoubleChance = (statistics, market) => {
  market.outcomes.forEach((outcome) => {
    outcome.status = 3;
  });

  if (statistics.time_status === "3") {
    const homeScore =
      parseInt(statistics.scores["1"].home) +
      parseInt(statistics.scores["2"].home);
    const awayScore =
      parseInt(statistics.scores["1"].away) +
      parseInt(statistics.scores["2"].away);

    if (homeScore > awayScore || homeScore === awayScore) {
      market.outcomes[0].status = 2;
    }
    if (awayScore > homeScore || homeScore === awayScore) {
      market.outcomes[2].status = 2;
    }
    if (homeScore > awayScore || awayScore > homeScore) {
      market.outcomes[1].status = 2;
    }

    console.log("Double chance market estimated.");
  }
};

const CorrectScoreComninations = (statistics, market) => {
  let nonCombinationReached = true;
  if (isFullTimeEnded(statistics)) {
    market.outcomes.forEach((outcome) => {
      outcome.status = 3;
      const competitorSpec = outcome.outcome
        .split(" ")[0]
        .includes("$competitor1")
        ? 1
        : 2;
      const scores = [];

      outcome.outcome.split(" ").forEach((item, idx) => {
        if (item.includes(":")) {
          scores.push({
            home: parseInt(item.split(":")[competitorSpec === 1 ? 0 : 1]),
            away: parseInt(item.split(":")[competitorSpec === 1 ? 1 : 0]),
          });
        }
      });

      const homeScore = parseInt(statistics.ss.split("-")[0]);
      const awayScore = parseInt(statistics.ss.split("-")[1]);

      if (scores.length === 3) {
        scores.forEach((score) => {
          if (score.home === homeScore && score.away === awayScore) {
            outcome.status = 2;
            nonCombinationReached = false;
          }
        });
      }

      if (outcome.outcomeId === "1034005") {
        if (homeScore > awayScore && nonCombinationReached === true) {
          outcome.status = 2;
        } else {
          outcome.status = 3;
        }
      }

      if (outcome.outcomeId === "1034009") {
        if (awayScore > homeScore && nonCombinationReached === true) {
          outcome.status = 2;
        } else {
          outcome.status = 3;
        }
      }

      if (outcome.outcomeId === "1034004") {
        const betScoreFirst = {
          home: parseInt(outcome.outcome.split(" ")[0].split(":")[0]),
          away: parseInt(outcome.outcome.split(" ")[0].split(":")[1]),
        };

        const betScoreSecond = {
          home: parseInt(outcome.outcome.split(" ")[2].split(":")[0]),
          away: parseInt(outcome.outcome.split(" ")[2].split(":")[1]),
        };

        if (
          betScoreFirst.home === homeScore &&
          betScoreFirst.away === awayScore
        ) {
          outcome.status = 2;
        }

        if (
          betScoreSecond.home === homeScore &&
          betScoreSecond.away === awayScore
        ) {
          outcome.status = 2;
        }
      }

      if (homeScore === awayScore && outcome.outcomeId === "1034010") {
        outcome.status = 2;
      }
    });
  } else {
    console.log("Full Time not Ended");
  }
};

const DrawNoBet = (statistics, market) => {
  if (isFullTimeEnded(statistics)) {
    market.outcomes.forEach((outcome) => {
      outcome.status = 3;
    });
    const homeScore = parseInt(statistics.ss.split("-")[0]);
    const awayScore = parseInt(statistics.ss.split("-")[1]);

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
  }
};

const GoalScoredInBoth = (statistics, market) => {
  market.outcomes.forEach((outcome) => {
    outcome.status = 3;
  });

  if (
    statistics.scores["1"] &&
    statistics.scores["2"] &&
    isFullTimeEnded(statistics)
  ) {
    let goalInFirtsHalf = false;
    let goalInSecondHalf = false;

    statistics.events.forEach((event) => {
      if (event.text.includes(" Goal -")) {
        const time = parseInt(event.text.split(" ")[0].replace("'", ""));
        console.log(time);
        if (time < 45) {
          goalInFirtsHalf = true;
        }
        if (time > 45 && time < 90) {
          goalInSecondHalf = true;
        }
      }
    });

    console.log(goalInFirtsHalf, goalInSecondHalf);

    if (goalInSecondHalf && goalInFirtsHalf) {
      market.outcomes[0].status = 2;
    } else {
      market.outcomes[1].status = 2;
    }
  }
};

const MatchBetBothScore = (statistics, market) => {
  if (isFullTimeEnded(statistics)) {
    market.outcomes.forEach((outcome) => {
      outcome.status = 3;
    });
    const fullTimeWinner =
      parseInt(statistics.scores["2"].home) >
      parseInt(statistics.scores["2"].away)
        ? "home"
        : parseInt(statistics.scores["2"].away) >
          parseInt(statistics.scores["2"].home)
        ? "away"
        : parseInt(statistics.scores["2"].home) ===
          parseInt(statistics.scores["2"].home)
        ? "draw"
        : "undefined";

    if (fullTimeWinner !== "undefined") {
      let homeScored = false;
      let awayScored = false;

      statistics.events.forEach((event) => {
        if (event.text.includes(" Goal -")) {
          if (event.text.includes(statistics.home.name)) {
            homeScored = true;
          }
          if (event.text.includes(statistics.away.name)) {
            awayScored = true;
          }
        }
      });

      const bothScored = homeScored && awayScored;

      if (fullTimeWinner === "home" && bothScored) {
        market.outcomes[0].status = 2;
      }
      if (fullTimeWinner === "draw" && bothScored) {
        market.outcomes[1].status = 2;
      }
      if (fullTimeWinner === "away" && bothScored) {
        market.outcomes[2].status = 2;
      }
    }
  }
};

const WinOver = (statistics, market) => {
  //TODO
  //статус при возврате
  if (isFullTimeEnded(statistics)) {
    market.outcomes.forEach((outcome) => {
      outcome.status = 3;
    });
    const total = parseFloat(market.specifiers.total);

    const homeResult = parseInt(statistics.scores["2"].home);
    const awayResult = parseInt(statistics.scores["2"].away);

    if (homeResult > awayResult) {
      if (homeResult - awayResult >= total) {
        market.outcomes[1].status = 2;
      }
    }
    if (awayResult > homeResult) {
      if (awayResult - homeResult >= total) {
        market.outcomes[0].status = 2;
      }
    }
  }
};

const Handicap3Way = (statistics, market) => {
  market.outcomes.forEach((outcome) => {
    outcome.status = 3;
  });

  const handicap = parseFloat(market.specifiers.hcp.replace("+"));

  if (isFullTimeEnded(statistics)) {
    const homeResult = parseInt(statistics.scores["2"].home);
    const awayResult = parseInt(statistics.scores["2"].away);

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
};

const BothToScoreTotalGoals = (statistics, market) => {
  if (isFullTimeEnded(statistics)) {
    market.outcomes.forEach((outcome) => {
      outcome.status = 3;
    });

    const total = parseFloat(market.specifiers.total);

    const homeTeam = statistics.home.name;
    const awayTeam = statistics.away.name;

    let homeScored = false;
    let awayScored = false;

    let totalGoals = 0;

    statistics.events.forEach((event) => {
      if (event.text.includes(" Goal -")) {
        const teamScored =
          event.text.split(" ")[6].replace("(", "").replace(")", "") ===
          homeTeam
            ? "home"
            : "away";

        //Check if it's not extra time
        if (parseInt(event.text.split(" ")[0].replace("'", "")) < 90) {
          totalGoals++;
          if (teamScored === "home") {
            homeScored = true;
          } else if (teamScored === "away") {
            awayScored = true;
          }
        }
      }
    });

    if (homeScored && awayScored) {
      if (totalGoals < total) {
        market.outcomes[0].status = 2;
      }
      if (totalGoals > total) {
        market.outcomes[1].status = 2;
      }
    } else {
      if (totalGoals < total) {
        market.outcomes[2].status = 2;
      }
      if (totalGoals > total) {
        market.outcomes[3].status = 2;
      }
    }
  }
};

const ToWinToNil = (statistics, market) => {
  if (isFullTimeEnded(statistics)) {
    market.outcomes.forEach((outcome) => {
      outcome.status = 3;
    });

    const marketBetTeam =
      market.outcomes[0].outcomeId === "1039002" ? "home" : "away";

    const homeResult = parseInt(statistics.scores["2"].home);
    const awayResult = parseInt(statistics.scores["2"].away);

    if (marketBetTeam === "home") {
      if (homeResult > awayResult && awayResult === 0) {
        market.outcomes[0].status = 2;
      } else {
        market.outcomes[1].status = 2;
      }
    }

    if (marketBetTeam === "away") {
      if (awayResult > homeResult && homeResult === 0) {
        market.outcomes[0].status = 2;
      } else {
        market.outcomes[1].status = 2;
      }
    }
  }
};

const Handicap = (statistics, market) => {
  market.outcomes.forEach((outcome) => {
    outcome.status = 3;
  });

  const handicap = parseFloat(market.specifiers.hcp.replace("+"));

  if (isFullTimeEnded(statistics)) {
    const homeResult = parseInt(statistics.scores["2"].home);
    const awayResult = parseInt(statistics.scores["2"].away);

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
  }
};

const TotalGoals = (statistics, market) => {
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
};

const BothToScoreNoDraw = (statistics, market) => {
  if (isFullTimeEnded(statistics)) {
    market.outcomes.forEach((outcome) => {
      outcome.status = 3;
    });

    const homeTeam = statistics.home.name;
    const awayTeam = statistics.away.name;

    let homeScored = false;
    let awayScored = false;

    statistics.events.forEach((event) => {
      if (event.text.includes(" Goal -")) {
        const teamScored =
          event.text.split(" ")[6].replace("(", "").replace(")", "") ===
          homeTeam
            ? "home"
            : "away";

        //Check if it's not extra time
        if (parseInt(event.text.split(" ")[0].replace("'", "")) < 90) {
          if (teamScored === "home") {
            homeScored = true;
          } else if (teamScored === "away") {
            awayScored = true;
          }
        }
      }
    });

    const homeResult = parseInt(statistics.scores["2"].home);
    const awayResult = parseInt(statistics.scores["2"].away);

    const draw = homeResult === awayResult;

    if (homeScored && awayScored && !draw) {
      market.outcomes[0].status = 2;
    } else {
      market.outcomes[1].status = 2;
    }
  }
};

const TeamTotalGoals = (statistics, market) => {
  if (isFullTimeEnded(statistics)) {
    market.outcomes.forEach((outcome) => {
      outcome.status = 3;
    });

    const homeTeam = statistics.home.name;
    const total = parseFloat(market.specifiers.total);

    if (market.outcomes[0].outcomeId === "18002") {
      let totalGoals = 0;
      statistics.events.forEach((event) => {
        if (event.text.includes(" Goal -")) {
          const teamScored =
            event.text.split(" ")[6].replace("(", "").replace(")", "") ===
            homeTeam
              ? "home"
              : "away";

          //Check if it's not extra time
          if (parseInt(event.text.split(" ")[0].replace("'", "")) < 90) {
            if (teamScored === "home") {
              totalGoals++;
            }
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

    if (market.outcomes[0].outcomeId === "19002") {
      let totalGoals = 0;
      statistics.events.forEach((event) => {
        if (event.text.includes(" Goal -")) {
          const teamScored =
            event.text.split(" ")[6].replace("(", "").replace(")", "") ===
            homeTeam
              ? "home"
              : "away";

          //Check if it's not extra time
          if (parseInt(event.text.split(" ")[0].replace("'", "")) < 90) {
            if (teamScored === "away") {
              totalGoals++;
            }
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
};

const HalfTimeFullTime = (statistics) => {
  const outcomes = {
    2001: "lose",
    2002: "lose",
    2003: "lose",
    2004: "lose",
    2005: "lose",
    2006: "lose",
    2007: "lose",
    2008: "lose",
    2009: "lose",
  };

  if (statistics.time_status === "3") {
    const firstHalfResults =
      statistics.scores[Object.keys(statistics.scores)[0]];

    const firstHalfWinner =
      parseInt(firstHalfResults.home) > parseInt(firstHalfResults.away)
        ? "home"
        : parseInt(firstHalfResults.home) < parseInt(firstHalfResults.away)
        ? "away"
        : parseInt(firstHalfResults.home) === parseInt(firstHalfResults.away)
        ? "draw"
        : "undefined";

    if (firstHalfWinner !== "undefined") {
      const fullTimeWinner =
        parseInt(statistics.ss.split()[0]) > parseInt(statistics.ss.split()[1])
          ? "home"
          : parseInt(statistics.ss.split()[0]) ===
            parseInt(statistics.ss.split()[1])
          ? "draw"
          : "away";

      switch (true) {
        case firstHalfWinner === "home" && fullTimeWinner === "home":
          outcomes["2001"] = "win";
          break;
        case firstHalfWinner === "home" && fullTimeWinner === "draw":
          outcomes["2002"] = "win";
          break;
        case firstHalfWinner === "home" && fullTimeWinner === "away":
          outcomes["2003"] = "win";
          break;
        case firstHalfWinner === "draw" && fullTimeWinner === "home":
          outcomes["2004"] = "win";
          break;
        case firstHalfWinner === "draw" && fullTimeWinner === "draw":
          outcomes["2005"] = "win";
          break;
        case firstHalfWinner === "draw" && fullTimeWinner === "away":
          outcomes["2006"] = "win";
          break;
        case firstHalfWinner === "away" && fullTimeWinner === "home":
          outcomes["2007"] = "win";
          break;
        case firstHalfWinner === "away" && fullTimeWinner === "draw":
          outcomes["2008"] = "win";
          break;
        case firstHalfWinner === "away" && fullTimeWinner === "away":
          outcomes["2009"] = "win";
          break;
        default:
          console.log("Error");
          return false;
      }

      return {
        CommonID: 10002,
        LiveID: 10560,
        OddTypesID: 42,
        PrematchID: 42,
        Outcomes: outcomes,
      };
    } else {
      console.log("First half winner undefined");
      return false;
    }
  } else {
    console.log("Wrong time status");
    return false;
  }
};

const BothTeamsToScore = (statistics) => {
  const outcomes = {
    14001: "lose",
    14002: "lose",
  };

  if (statistics.time_status === "3") {
    const isHomeScored = parseInt(statistics.ss.split()[0]) > 0;
    const isAwayScored = parseInt(statistics.ss.split()[1]) > 0;

    if (isHomeScored && isAwayScored) {
      outcomes["14001"] = "win";
    } else if (
      (!isHomeScored && !isAwayScored) ||
      (isHomeScored && !isAwayScored) ||
      (isAwayScored && !isHomeScored)
    ) {
      outcomes["14002"] = "win";
    }

    return {
      CommonID: 10032,
      LiveID: 10565,
      OddTypesID: 27,
      PrematchID: 10150,
      Outcomes: outcomes,
    };
  } else {
    console.log("Wrong time status");
    return false;
  }
};

module.exports = {
  fullTimeResult,
  HalfTimeFullTime,
  BothTeamsToScore,
  WhichTeamToScoreNGoal,
  DoubleChance,
  CorrectScoreComninations,
  DrawNoBet,
  GoalScoredInBoth,
  MatchBetBothScore,
  WinOver,
  Handicap3Way,
  BothToScoreTotalGoals,
  ToWinToNil,
  Handicap,
  TotalGoals,
  BothToScoreNoDraw,
  TeamTotalGoals,
};
