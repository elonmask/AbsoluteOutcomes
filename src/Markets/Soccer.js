const { ThreeWay, WhichTeamScoresPoint, BothTeamsToScoreBasket } = require("./Basketball");
const { CompetitorTotal,
  DoubleChanceHockey,
  DrawNoBetHockey,
  Handicap3WayHockey,
  HandicapHockey,
  BothTeamsToScoreHockey,
  TotalGoalsHockey,
  WhichTeamScoresGoal
} = require("./IceHockey");

const isFullTimeEnded = (statistics) => {
  if (statistics.time_status === "3") {
    return true;
  }
  if (statistics.scores?.["1"] && statistics.scores?.["2"]) {
    return statistics.time_status === "3";
  } else {
    return false;
  }
};

const fullTimeResult = (statistics, market) => {
  if (statistics.result?.home) {
    return ThreeWay(statistics, market);
  }
  if (isFullTimeEnded(statistics)) {
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
  }
};

const WhichTeamToScoreNGoal = (statistics, market) => {
  if (statistics.sport_id === '4') {
    return WhichTeamScoresGoal(statistics, market);
  }
  if (
    parseInt(statistics.ss.split("-")[0]) >=
    parseInt(market.specifiers.goalnr) ||
    parseInt(statistics.ss.split("-")[1]) >= parseInt(market.specifiers.goalnr)
  ) {
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
          event.text.split(" - ")[2].replace("(", "").replace(")", "") ===
            homeTeam
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
      //if (fullTimeEnded) {
      market.outcomes[1].status = 2;
      //}
    }

    console.log("N Goal market estimated.");
  } else if (isFullTimeEnded(statistics)) {
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
          event.text.split(" - ")[2].replace("(", "").replace(")", "") ===
            homeTeam
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
      //if (fullTimeEnded) {
      market.outcomes[1].status = 2;
      //}
    }

    console.log("N Goal market estimated.");
  }
};

const DoubleChance = (statistics, market) => {
  if (statistics.sport_id === '4') {
    return DoubleChanceHockey(statistics, market);
  }

  if (isFullTimeEnded(statistics)) {
    market.outcomes.forEach((outcome) => {
      outcome.status = 3;
    });
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
  if (statistics.sport_id === '4') {
    return DrawNoBetHockey(statistics, market);
  }

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
  if (statistics.scores["1"] && statistics.scores["2"]) {
    market.outcomes.forEach((outcome) => {
      outcome.status = 3;
    });

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
  if (statistics.sport_id === '4') {
    return Handicap3WayHockey(statistics, market);
  }
  if (isFullTimeEnded(statistics)) {
    market.outcomes.forEach((outcome) => {
      outcome.status = 3;
    });

    const handicap = parseFloat(market.specifiers.hcp.replace("+"));

    const homeResult = parseInt(statistics.ss.split("-")[0]);
    const awayResult = parseInt(statistics.ss.split("-")[1]);

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
  if (
    parseInt(statistics.stats.goals[0]) > 0 &&
    parseInt(statistics.stats.goals[1]) > 0 &&
    parseInt(statistics.stats.goals[0]) + parseInt(statistics.stats.goals[1]) >=
    parseFloat(market.specifiers.total)
  ) {
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
  } else if (isFullTimeEnded(statistics)) {
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
  if (
    parseInt(statistics.ss.split("-")[0]) > 0 ||
    parseInt(statistics.ss.split("-")[1]) > 0
  ) {
    const marketBetTeam =
      market.outcomes[0].outcomeId === "1039002" ? "home" : "away";

    const homeResult = parseInt(statistics.ss.split("-")[0]);
    const awayResult = parseInt(statistics.ss.split("-")[1]);

    if (marketBetTeam === "home") {
      if (isFullTimeEnded(statistics)) {
        market.outcomes.forEach((outcome) => {
          outcome.status = 3;
        });

        if (homeResult > awayResult && awayResult === 0) {
          market.outcomes[0].status = 2;
        } else {
          market.outcomes[1].status = 2;
        }
      } else {
        if (awayResult > 0) {
          market.outcomes[0].status = 3;
          market.outcomes[1].status = 2;
        }
      }
    }

    if (marketBetTeam === "away") {
      if (isFullTimeEnded(statistics)) {
        market.outcomes.forEach((outcome) => {
          outcome.status = 3;
        });

        if (awayResult > homeResult && homeResult === 0) {
          market.outcomes[0].status = 2;
        } else {
          market.outcomes[1].status = 2;
        }
      } else {
        if (homeResult > 0) {
          market.outcomes[0].status = 3;
          market.outcomes[1].status = 2;
        }
      }
    }
  }
};

const Handicap = (statistics, market) => {
  if (statistics.sport_id === '4') {
    return HandicapHockey(statistics, market);
  }

  if (isFullTimeEnded(statistics)) {
    market.outcomes.forEach((outcome) => {
      outcome.status = 3;
    });

    const handicap = parseFloat(market.specifiers.hcp.replace("+"));

    const homeResult = parseInt(statistics.ss.split("-")[0]);
    const awayResult = parseInt(statistics.ss.split("-")[1]);

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
  if (statistics.sport_id === '4') {
    return TotalGoalsHockey(statistics, market);
  }
  if (
    parseInt(statistics.stats.goals[0]) + parseInt(statistics.stats.goals[1]) >=
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
  } else if (isFullTimeEnded(statistics)) {
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
};

const BothToScoreNoDraw = (statistics, market) => {
  if (
    parseInt(statistics.stats.goals[0]) > 0 &&
    parseInt(statistics.stats.goals[1]) > 0
  ) {
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
  } else if (isFullTimeEnded(statistics)) {
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
  if (statistics.result?.home) {
    return CompetitorTotal(statistics, market);
  }
  const homeTeam = statistics.home.name;
  const total = parseFloat(market.specifiers.total);

  if (market.outcomes[0].outcomeId === "18002") {
    if (isFullTimeEnded(statistics)) {
      market.outcomes.forEach((outcome) => {
        outcome.status = 3;
      });

      let totalGoals = parseInt(statistics.stats.goals[0]);
      /*statistics.events.forEach((event) => {
          if (event.text.includes(" Goal -")) {
            const teamScored =
              event.text
                .split(" - ")[2]
                .split(" ")[1]
                .replace("(", "")
                .replace(")", "") === homeTeam
                ? "home"
                : "away";

            //Check if it's not extra time
            if (parseInt(event.text.split(" ")[0].replace("'", "")) < 90) {
              if (teamScored === "home") {
                totalGoals++;
              }
            }
          }
        });*/

      if (totalGoals < total) {
        market.outcomes[0].status = 2;
      }

      if (totalGoals > total) {
        market.outcomes[1].status = 2;
      }
    } else {
      if (
        parseInt(statistics.stats.goals[0]) >=
        parseFloat(market.specifiers.total)
      ) {
        market.outcomes.forEach((outcome) => {
          outcome.status = 3;
        });

        let totalGoals = parseInt(statistics.stats.goals[0]);
        /*statistics.events.forEach((event) => {
          if (event.text.includes(" Goal -")) {
            const teamScored =
              event.text
                .split(" - ")[2]
                .split(" ")[1]
                .replace("(", "")
                .replace(")", "") === homeTeam
                ? "home"
                : "away";

            //Check if it's not extra time
            if (parseInt(event.text.split(" ")[0].replace("'", "")) < 90) {
              if (teamScored === "home") {
                totalGoals++;
              }
            }
          }
        });*/

        if (totalGoals < total) {
          market.outcomes[0].status = 2;
        }

        if (totalGoals > total) {
          market.outcomes[1].status = 2;
        }
      }
    }
  }

  if (market.outcomes[0].outcomeId === "19002") {
    if (isFullTimeEnded(statistics)) {
      market.outcomes.forEach((outcome) => {
        outcome.status = 3;
      });
      let totalGoals = parseInt(statistics.stats.goals[1]);
      /*statistics.events.forEach((event) => {
          if (event.text.includes(" Goal -")) {
            const teamScored =
              event.text
                .split(" - ")[2]
                .split(" ")[1]
                .replace("(", "")
                .replace(")", "") === homeTeam
                ? "home"
                : "away";

            //Check if it's not extra time
            if (parseInt(event.text.split(" ")[0].replace("'", "")) < 90) {
              if (teamScored === "away") {
                totalGoals++;
              }
            }
          }
        });*/

      if (totalGoals < total) {
        market.outcomes[0].status = 2;
      }

      if (totalGoals > total) {
        market.outcomes[1].status = 2;
      }
    } else {
      if (
        parseInt(statistics.stats.goals[1]) >=
        parseFloat(market.specifiers.total)
      ) {
        market.outcomes.forEach((outcome) => {
          outcome.status = 3;
        });
        let totalGoals = parseInt(statistics.stats.goals[1]);
        /*statistics.events.forEach((event) => {
          if (event.text.includes(" Goal -")) {
            const teamScored =
              event.text
                .split(" - ")[2]
                .split(" ")[1]
                .replace("(", "")
                .replace(")", "") === homeTeam
                ? "home"
                : "away";

            //Check if it's not extra time
            if (parseInt(event.text.split(" ")[0].replace("'", "")) < 90) {
              if (teamScored === "away") {
                totalGoals++;
              }
            }
          }
        });*/

        if (totalGoals < total) {
          market.outcomes[0].status = 2;
        }

        if (totalGoals > total) {
          market.outcomes[1].status = 2;
        }
      }
    }
  }
};

const OneMinuteEvents = (statistics, market) => {
  market.outcomes.forEach((outcome) => {
    outcome.status = 3;
  });

  const period = market.specifiers.period;
  const min = parseInt(
    period.split(" ")[0].split(":")[0].split()[0] === "0"
      ? period.split(" ")[0].split(":")[0].replace("0", "")
      : period.split(" ")[0].split(":")[0]
  );
  const max = min + 1;

  let goalScored = false;
  let cornerAwarded = false;
  let cardAwarded = false;

  statistics.events.forEach((event) => {
    if (event.text.split(" ")[0].includes("'")) {
      const eventMinute = parseInt(event.text.split(" ")[0].replace("'", ""));

      if (min <= eventMinute <= max) {
        if (event.text.includes(" Goal -")) {
          market.outcomes[0].status = 2;
          goalScored = true;
        }

        if (event.text.includes(" Corner -")) {
          market.outcomes[1].status = 2;
          cornerAwarded = true;
        }

        if (event.text.includes(" Card -")) {
          market.outcomes[2].status = 2;
          cardAwarded = true;
        }
      }
    }
  });

  if (!goalScored) {
    market.outcomes[7].status = 2;
  }

  if (!cornerAwarded) {
    market.outcomes[8].status = 2;
  }

  if (!cardAwarded) {
    market.outcomes[9].status = 2;
  }
};

const BothToScoreInBothHalves = (statistics, market) => {
  if (
    statistics.scores["1"] &&
    statistics.scores["2"] &&
    statistics.scores["1"].home > 0 &&
    statistics.scores["1"].away > 0 &&
    statistics.scores["2"].home > 0 &&
    statistics.scores["2"].away > 0
  ) {
    market.outcomes.forEach((outcome) => {
      outcome.status = 3;
    });

    const homeTeam = statistics.home.name;
    const awayTeam = statistics.away.name;

    let homeScoredInFirst = false;
    let homeScoredInSecond = false;

    let awayScoredInFirst = false;
    let awayScoredInSecond = false;

    statistics.events.forEach((event) => {
      if (
        event.text.includes(" Goal -") &&
        parseInt(event.text.split(" ")[0].replace("'", "")) <= 45
      ) {
        if (event.text.includes(homeTeam)) {
          homeScoredInFirst = true;
        }

        if (event.text.includes(awayTeam)) {
          awayScoredInFirst = true;
        }
      }

      if (
        event.text.includes(" Goal -") &&
        parseInt(event.text.split(" ")[0].replace("'", "")) >= 45 < 90
      ) {
        if (event.text.includes(homeTeam)) {
          homeScoredInSecond = true;
        }

        if (event.text.includes(awayTeam)) {
          awayScoredInSecond = true;
        }
      }
    });

    if (
      homeScoredInFirst &&
      homeScoredInSecond &&
      awayScoredInFirst &&
      awayScoredInSecond
    ) {
      market.outcomes[0].status = 2;
    } else {
      market.outcomes[1].status = 2;
    }
  } else if (isFullTimeEnded(statistics)) {
    market.outcomes.forEach((outcome) => {
      outcome.status = 3;
    });

    const homeTeam = statistics.home.name;
    const awayTeam = statistics.away.name;

    let homeScoredInFirst = false;
    let homeScoredInSecond = false;

    let awayScoredInFirst = false;
    let awayScoredInSecond = false;

    statistics.events.forEach((event) => {
      if (
        event.text.includes(" Goal -") &&
        parseInt(event.text.split(" ")[0].replace("'", "")) <= 45
      ) {
        if (event.text.includes(homeTeam)) {
          homeScoredInFirst = true;
        }

        if (event.text.includes(awayTeam)) {
          awayScoredInFirst = true;
        }
      }

      if (
        event.text.includes(" Goal -") &&
        parseInt(event.text.split(" ")[0].replace("'", "")) >= 45 < 90
      ) {
        if (event.text.includes(homeTeam)) {
          homeScoredInSecond = true;
        }

        if (event.text.includes(awayTeam)) {
          awayScoredInSecond = true;
        }
      }
    });

    if (
      homeScoredInFirst &&
      homeScoredInSecond &&
      awayScoredInFirst &&
      awayScoredInSecond
    ) {
      market.outcomes[0].status = 2;
    } else {
      market.outcomes[1].status = 2;
    }
  }
};

const TotalGoalsOddEven = (statistics, market) => {
  if (isFullTimeEnded(statistics)) {
    market.outcomes.forEach((outcome) => {
      outcome.status = 3;
    });

    let totalGoals = 0;

    statistics.events.forEach((event) => {
      if (
        event.text.includes(" Goal -") &&
        parseInt(event.text.split(" ")[0].replace("'", "")) < 90
      ) {
        totalGoals++;
      }
    });

    console.log(totalGoals);

    if (totalGoals % 2 === 1) {
      market.outcomes[0].status = 2;
    }

    if (totalGoals % 2 === 0) {
      market.outcomes[1].status = 2;
    }
  }
};

const HalfTimeFullTime = (statistics, market) => {
  if (isFullTimeEnded(statistics)) {
    market.outcomes.forEach((outcome) => {
      outcome.status = 3;
    });

    const halfTimeWinner =
      statistics.scores["1"].home > statistics.scores["1"].away
        ? "home"
        : statistics.scores["1"].home < statistics.scores["1"].away
          ? "away"
          : "draw";
    const fullTimeWinner =
      statistics.scores["2"].home > statistics.scores["2"].away
        ? "home"
        : statistics.scores["2"].home < statistics.scores["2"].away
          ? "away"
          : "draw";

    if (halfTimeWinner === "home" && fullTimeWinner === "home") {
      market.outcomes[0].status = 2;
    }

    if (halfTimeWinner === "home" && fullTimeWinner === "draw") {
      market.outcomes[1].status = 2;
    }

    if (halfTimeWinner === "home" && fullTimeWinner === "away") {
      market.outcomes[2].status = 2;
    }

    if (halfTimeWinner === "draw" && fullTimeWinner === "home") {
      market.outcomes[3].status = 2;
    }

    if (halfTimeWinner === "draw" && fullTimeWinner === "draw") {
      market.outcomes[4].status = 2;
    }

    if (halfTimeWinner === "draw" && fullTimeWinner === "away") {
      market.outcomes[5].status = 2;
    }

    if (halfTimeWinner === "away" && fullTimeWinner === "home") {
      market.outcomes[6].status = 2;
    }

    if (halfTimeWinner === "away" && fullTimeWinner === "draw") {
      market.outcomes[7].status = 2;
    }

    if (halfTimeWinner === "away" && fullTimeWinner === "away") {
      market.outcomes[8].status = 2;
    }
  }
};

const BothTeamsToScore = (statistics, market) => {
  if (statistics.result?.home) {
    if (statistics.sport_id === '4') {
      return BothTeamsToScoreHockey(statistics, market);
    } else {
      return BothTeamsToScoreBasket(statistics, market);
    }
  }
  if (
    parseInt(statistics.stats.goals[0]) > 0 &&
    parseInt(statistics.stats.goals[1]) > 0
  ) {
    market.outcomes.forEach((outcome) => {
      outcome.status = 3;
    });
    const isHomeScored = parseInt(statistics.ss.split("-")[0]) > 0;
    const isAwayScored = parseInt(statistics.ss.split("-")[1]) > 0;

    if (isHomeScored && isAwayScored) {
      market.outcomes[0].status = 2;
    } else {
      market.outcomes[1].status = 2;
    }
  } else if (isFullTimeEnded(statistics)) {
    market.outcomes.forEach((outcome) => {
      outcome.status = 3;
    });
    const isHomeScored = parseInt(statistics.ss.split("-")[0]) > 0;
    const isAwayScored = parseInt(statistics.ss.split("-")[1]) > 0;

    if (isHomeScored && isAwayScored) {
      market.outcomes[0].status = 2;
    } else {
      market.outcomes[1].status = 2;
    }
  }
};

const BothTeamsToScoreHalfTime = (statistics, market) => {
  if (
    parseInt(statistics.stats.goals[0]) > 0 &&
    parseInt(statistics.stats.goals[1]) > 0
  ) {
    let awayScored = false;
    let homeScored = false;
    statistics.events.forEach((event) => {
      if (
        event.text.includes("- Goal -") &&
        parseInt(event.text.split(" ")[0].replace("'", "")) < 45
      ) {
        if (event.text.includes(statistics.home.name)) {
          homeScored = true;
        }
        if (event.text.includes(statistics.away.name)) {
          awayScored = true;
        }
      }
    });

    if (awayScored && homeScored) {
      market.outcomes.forEach((outcome) => {
        outcome.status = 3;
      });
      market.outcomes[0].status = 2;
      market.outcomes[1].status = 3;
    }
  }
};

const FromTo3WayResult = (statistics, market) => {
  if (isFullTimeEnded(statistics)) {
    market.outcomes.forEach((outcome) => {
      outcome.status = 3;
    });

    const homeTeam = statistics.home.name;
    const awayTeam = statistics.away.name;

    const from = market.specifiers.from;
    const to = market.specifiers.to;

    let homeGoals = 0;
    let awayGoals = 0;

    statistics.events.forEach((event) => {
      if (event.text.includes("- Goal -") && event.text.includes(homeTeam)) {
        if (
          parseInt(event.text.split(" ")[0].replace("'", "")) >=
          parseInt(from) &&
          parseInt(event.text.split(" ")[0].replace("'", "")) <= parseInt(to)
        ) {
          homeGoals++;
        }
      }
      if (event.text.includes("- Goal -") && event.text.includes(awayTeam)) {
        if (
          parseInt(event.text.split(" ")[0].replace("'", "")) >=
          parseInt(from) &&
          parseInt(event.text.split(" ")[0].replace("'", "")) <= parseInt(to)
        ) {
          awayGoals++;
        }
      }
    });
    if (homeGoals > awayGoals) {
      market.outcomes[0].status = 2;
    }

    if (awayGoals > homeGoals) {
      market.outcomes[2].status = 2;
    }

    if (homeGoals === awayGoals) {
      market.outcomes[1].status = 2;
    }
  } else {
    if (
      parseInt(
        statistics.events[statistics.events.length - 1].text
          .split(" ")[0]
          .replace("'", "")
      ) >= parseInt(market.specifiers.to)
    ) {
      market.outcomes.forEach((outcome) => {
        outcome.status = 3;
      });

      const homeTeam = statistics.home.name;
      const awayTeam = statistics.away.name;

      const from = market.specifiers.from;
      const to = market.specifiers.to;

      let homeGoals = 0;
      let awayGoals = 0;

      statistics.events.forEach((event) => {
        if (event.text.includes("- Goal -") && event.text.includes(homeTeam)) {
          if (
            parseInt(event.text.split(" ")[0].replace("'", "")) >=
            parseInt(from) &&
            parseInt(event.text.split(" ")[0].replace("'", "")) <= parseInt(to)
          ) {
            homeGoals++;
          }
        }
        if (event.text.includes("- Goal -") && event.text.includes(awayTeam)) {
          if (
            parseInt(event.text.split(" ")[0].replace("'", "")) >=
            parseInt(from) &&
            parseInt(event.text.split(" ")[0].replace("'", "")) <= parseInt(to)
          ) {
            awayGoals++;
          }
        }
      });
      if (homeGoals > awayGoals) {
        market.outcomes[0].status = 2;
      }

      if (awayGoals > homeGoals) {
        market.outcomes[2].status = 2;
      }

      if (homeGoals === awayGoals) {
        market.outcomes[1].status = 2;
      }
    }
  }
};

const GoalBetween = (statistics, market) => {
  if (isFullTimeEnded(statistics)) {
    market.outcomes.forEach((outcome) => {
      outcome.status = 3;
    });

    const from = market.specifiers.from;
    const to = market.specifiers.to;
    let goals = 0;

    statistics.events.forEach((event) => {
      if (event.text.includes("- Goal -")) {
        if (
          parseInt(event.text.split(" ")[0].replace("'", "")) >=
          parseInt(from) &&
          parseInt(event.text.split(" ")[0].replace("'", "")) <= parseInt(to)
        ) {
          goals++;
        }
      }
    });

    if (goals > 0) {
      market.outcomes[0].status = 2;
    }

    if (goals === 0) {
      market.outcomes[1].status = 2;
    }
  } else {
    if (
      parseInt(
        statistics.events[statistics.events.length - 1].text
          .split(" ")[0]
          .replace("'", "")
      ) >= parseInt(market.specifiers.to)
    ) {
      market.outcomes.forEach((outcome) => {
        outcome.status = 3;
      });

      const from = market.specifiers.from;
      const to = market.specifiers.to;
      let goals = 0;

      statistics.events.forEach((event) => {
        if (event.text.includes("- Goal -")) {
          if (
            parseInt(event.text.split(" ")[0].replace("'", "")) >=
            parseInt(from) &&
            parseInt(event.text.split(" ")[0].replace("'", "")) <= parseInt(to)
          ) {
            goals++;
          }
        }
      });

      if (goals > 0) {
        market.outcomes[0].status = 2;
      }

      if (goals === 0) {
        market.outcomes[1].status = 2;
      }
    }
  }
};

const HalftimeMinuteResult = (statistics, market) => {
  if (isFullTimeEnded(statistics)) {
    market.outcomes.forEach((outcome) => {
      outcome.status = 3;
    });

    const homeTeam = statistics.home.name;
    const awayTeam = statistics.away.name;

    let homeGoals = 0;
    let awayGoals = 0;

    const minute = parseInt(market.specifiers.minute);
    statistics.events.forEach((event) => {
      if (event.text.includes("- Goal -") && event.text.includes(homeTeam)) {
        if (parseInt(event.text.split(" ")[0].replace("'", "")) <= minute) {
          homeGoals++;
        }
      }
      if (event.text.includes("- Goal -") && event.text.includes(awayTeam)) {
        if (parseInt(event.text.split(" ")[0].replace("'", "")) <= minute) {
          awayGoals++;
        }
      }
    });

    if (homeGoals > awayGoals) {
      market.outcomes[0].status = 2;
    }

    if (awayGoals > homeGoals) {
      market.outcomes[2].status = 2;
    }

    if (awayGoals === homeGoals) {
      market.outcomes[1].status = 2;
    }
  } else {
    if (
      parseInt(
        statistics.events[statistics.events.length - 1].text
          .split(" ")[0]
          .replace("'", "")
      ) >= parseInt(market.specifiers.minute)
    ) {
      market.outcomes.forEach((outcome) => {
        outcome.status = 3;
      });

      const homeTeam = statistics.home.name;
      const awayTeam = statistics.away.name;

      let homeGoals = 0;
      let awayGoals = 0;

      const minute = parseInt(market.specifiers.minute);
      statistics.events.forEach((event) => {
        if (event.text.includes("- Goal -") && event.text.includes(homeTeam)) {
          if (parseInt(event.text.split(" ")[0].replace("'", "")) <= minute) {
            homeGoals++;
          }
        }
        if (event.text.includes("- Goal -") && event.text.includes(awayTeam)) {
          if (parseInt(event.text.split(" ")[0].replace("'", "")) <= minute) {
            awayGoals++;
          }
        }
      });

      if (homeGoals > awayGoals) {
        market.outcomes[0].status = 2;
      }

      if (awayGoals > homeGoals) {
        market.outcomes[2].status = 2;
      }

      if (awayGoals === homeGoals) {
        market.outcomes[1].status = 2;
      }
    }
  }
};

const SecondHTotalGoalsOverUnder = (statistics, market) => {
  if (statistics.scores["2"]) {
    market.outcomes.forEach((outcome) => {
      outcome.status = 3;
    });

    const total = parseFloat(market.specifiers.total);
    let goals = 0;

    statistics.events.forEach((event) => {
      if (event.text.includes("- Goal -")) {
        if (
          parseInt(event.text.split(" ")[0].replace("'", "")) > 45 &&
          parseInt(event.text.split(" ")[0].replace("'", "")) < 90
        ) {
          goals++;
        }
      }
    });

    if (goals > total) {
      market.outcomes[1].status = 2;
    }

    if (goals < total) {
      market.outcomes[0].status = 2;
    }
  }
};

const TeamToScoreLast = (statistics, market) => {
  if (isFullTimeEnded(statistics)) {
    market.outcomes.forEach((outcome) => {
      outcome.status = 3;
    });

    const homeTeam = statistics.home.name;
    const awayTeam = statistics.away.name;

    const goalsArr = [];

    statistics.events.forEach((event) => {
      if (event.text.includes("- Goal -")) {
        goalsArr.push(event.text);
      }
    });

    if (goalsArr.length > 0) {
      const lastGoal = goalsArr[goalsArr.length - 1];

      if (lastGoal.includes(homeTeam)) {
        market.outcomes[0].status = 2;
      }

      if (lastGoal.includes(awayTeam)) {
        market.outcomes[2].status = 2;
      }
    } else {
      market.outcomes[1].status = 2;
    }
  }
};

const ToScoreInBoth = (statistics, market) => {
  if (statistics.scores["1"] && statistics.scores["2"]) {
    market.outcomes.forEach((outcome) => {
      outcome.status = 3;
    });

    const homeScoredBoth =
      statistics.scores["1"].home > 0 && statistics.scores["2"].home > 0;
    const awayScoredBoth =
      statistics.scores["1"].away > 0 && statistics.scores["2"].away > 0;

    if (homeScoredBoth) {
      market.outcomes[0].status = 2;
    }

    if (awayScoredBoth) {
      market.outcomes[1].status = 2;
    }
  }
};

const ToWinBoth = (statistics, market) => {
  if (isFullTimeEnded(statistics)) {
    market.outcomes.forEach((outcome) => {
      outcome.status = 3;
    });

    const homeWinBoth =
      statistics.scores["1"].home > statistics.scores["1"].away &&
      statistics.scores["2"].home > statistics.scores["2"].away;
    const awayWinBoth =
      statistics.scores["1"].away > statistics.scores["1"].home &&
      statistics.scores["2"].away > statistics.scores["2"].home;

    if (homeWinBoth) {
      market.outcomes[0].status = 2;
    }

    if (awayWinBoth) {
      market.outcomes[0].status = 2;
    }
  }
};

const HighestScoringHalf = (statistics, market) => {
  if (isFullTimeEnded(statistics)) {
    market.outcomes.forEach((outcome) => {
      outcome.status = 3;
    });
    const firstScore =
      statistics.scores["1"].home + statistics.scores["1"].away;
    const secondScore =
      statistics.scores["2"].home + statistics.scores["2"].away;

    if (firstScore > secondScore) {
      market.outcomes[0].status = 2;
    }

    if (secondScore > firstScore) {
      market.outcomes[2].status = 2;
    }

    if (firstScore === secondScore) {
      market.outcomes[1].status = 2;
    }
  }
};

const ToWinEitherHalf = (statistics, market) => {
  if (isFullTimeEnded(statistics)) {
    market.outcomes.forEach((outcome) => {
      outcome.status = 3;
    });

    const homeWonEither =
      statistics.scores["1"].home > statistics.scores["1"].away ||
      statistics.scores["2"].home > statistics.scores["2"].away;
    const awayWonEither =
      statistics.scores["1"].away > statistics.scores["1"].home ||
      statistics.scores["2"].away > statistics.scores["2"].home;

    if (homeWonEither) {
      market.outcomes[0].status = 2;
    }

    if (awayWonEither) {
      market.outcomes[1].status = 2;
    }
  }
};

const HalfTime3Way = (statistics, market) => {
  if (
    statistics.scores["1"] &&
    parseInt(
      statistics.events[statistics.events.length - 1].text
        .split(" ")[0]
        .replace("'")
    ) >= 45
  ) {
    market.outcomes.forEach((outcome) => {
      outcome.status = 3;
    });

    const winner =
      statistics.scores["1"].home > statistics.scores["1"].away
        ? "home"
        : statistics.scores["1"].away > statistics.scores["1"].home
          ? "away"
          : "draw";

    if (winner === "home") {
      market.outcomes[0].status = 2;
    }

    if (winner === "away") {
      market.outcomes[2].status = 2;
    }

    if (winner === "draw") {
      market.outcomes[1].status = 2;
    }
  }
};

const SecondHalf3Way = (statistics, market) => {
  if (
    statistics.scores["2"] &&
    parseInt(
      statistics.events[statistics.events.length - 1].text
        .split(" ")[0]
        .replace("'")
    ) >= 45
  ) {
    market.outcomes.forEach((outcome) => {
      outcome.status = 3;
    });

    const winner =
      statistics.scores["2"].home > statistics.scores["2"].away
        ? "home"
        : statistics.scores["2"].away > statistics.scores["2"].home
          ? "away"
          : "draw";

    if (winner === "home") {
      market.outcomes[0].status = 2;
    }

    if (winner === "away") {
      market.outcomes[2].status = 2;
    }

    if (winner === "draw") {
      market.outcomes[1].status = 2;
    }
  }
};

const CorrectScore = (statistics, market) => {
  if (statistics.sport_id === '4') {
    return CorrectScore(statistics, market);
  }
  if (isFullTimeEnded(statistics)) {
    const score = statistics.ss.replace("-", ":");
    market.outcomes.forEach((outcome) => {
      if (outcome.outcome === score) {
        outcome.status = 2;
      } else {
        outcome.status = 3;
      }
    });
  }
};

const AnyTimeCorrectScore = (statistics, market) => {
  const score = statistics.ss.replace("-", ":");

  if (isFullTimeEnded(statistics)) {
    market.outcomes.forEach((outcome) => {
      if (
        outcome.outcome === score ||
        (parseInt(score.split(":")[0]) <=
          parseInt(outcome.outcome.split(":")[0]) &&
          parseInt(score.split(":")[1]) <=
          parseInt(outcome.outcome.split(":")[1]))
      ) {
        outcome.status = 2;
      } else {
        outcome.status = 3;
      }
    });
  } else {
    market.outcomes.forEach((outcome) => {
      if (
        outcome.outcome === score ||
        (parseInt(outcome.outcome.split(":")[0]) <=
          parseInt(score.split(":")[0]) &&
          parseInt(outcome.outcome.split(":")[1]) <=
          parseInt(score.split(":")[1]))
      ) {
        outcome.status = 2;
      }
    });
  }
};

const HalfTimeAnyTimeCorrectScore = (statistics, market) => {
  if (isFullTimeEnded(statistics)) {
    market.outcomes.forEach((outcome) => {
      if (
        outcome.outcome ===
        `${statistics.scores["1"].home}:${statistics.scores["1"].away}` ||
        (parseInt(outcome.outcome.split(":")[0]) <=
          statistics.scores["1"].home &&
          parseInt(outcome.outcome.split(":")[1]) <=
          statistics.scores["1"].away)
      ) {
        outcome.status = 2;
      } else {
        outcome.status = 3;
      }
    });
  } else if (statistics.scores["1"]) {
    market.outcomes.forEach((outcome) => {
      if (
        outcome.outcome ===
        `${statistics.scores["1"].home}:${statistics.scores["1"].away}` ||
        (parseInt(outcome.outcome.split(":")[0]) <=
          statistics.scores["1"].home &&
          parseInt(outcome.outcome.split(":")[1]) <=
          statistics.scores["1"].away)
      ) {
        outcome.status = 2;
      }
    });
  }
};

const HalfTimeCorrectScore = (statistics, market) => {
  if (isFullTimeEnded(statistics)) {
    market.outcomes.forEach((outcome) => {
      if (
        outcome.outcome ===
        `${statistics.scores["1"].home}:${statistics.scores["1"].away}` ||
        (parseInt(outcome.outcome.split(":")[0]) <=
          statistics.scores["1"].home &&
          parseInt(outcome.outcome.split(":")[1]) <=
          statistics.scores["1"].away)
      ) {
        outcome.status = 2;
      } else {
        outcome.status = 3;
      }
    });
  } else if (
    statistics.scores["1"] &&
    parseInt(
      statistics.events[statistics.events.length - 1].text
        .split(" ")[0]
        .replace("'", "")
    ) > 45
  ) {
    market.outcomes.forEach((outcome) => {
      if (
        outcome.outcome ===
        `${statistics.scores["1"].home}:${statistics.scores["1"].away}` ||
        (parseInt(outcome.outcome.split(":")[0]) <=
          statistics.scores["1"].home &&
          parseInt(outcome.outcome.split(":")[1]) <=
          statistics.scores["1"].away)
      ) {
        outcome.status = 2;
      }
    });
  }
};

const SecondHalfAnyTimeCorrectScore = (statistics, market) => {
  if (isFullTimeEnded(statistics)) {
    market.outcomes.forEach((outcome) => {
      if (
        outcome.outcome ===
        `${statistics.scores["2"].home}:${statistics.scores["2"].away}` ||
        (parseInt(outcome.outcome.split(":")[0]) <=
          statistics.scores["2"].home &&
          parseInt(outcome.outcome.split(":")[1]) <=
          statistics.scores["2"].away)
      ) {
        outcome.status = 2;
      } else {
        outcome.status = 3;
      }
    });
  }
};

const HalfTimeDoubleChance = (statistics, market) => {
  if (
    statistics.scores["1"] &&
    parseInt(
      statistics.events[statistics.events.length - 1].text
        .split(" ")[0]
        .replace("'")
    ) >= 45
  ) {
    market.outcomes.forEach((outcome) => {
      outcome.status = 3;
    });

    const homeScore = parseInt(statistics.scores["1"].home);
    const awayScore = parseInt(statistics.scores["1"].away);

    if (homeScore > awayScore || homeScore === awayScore) {
      market.outcomes[0].status = 2;
    }
    if (awayScore > homeScore || homeScore === awayScore) {
      market.outcomes[2].status = 2;
    }
    if (homeScore > awayScore || awayScore > homeScore) {
      market.outcomes[1].status = 2;
    }
  }
};

const SecondHalfDoubleChance = (statistics, market) => {
  if (
    statistics.scores["2"] &&
    parseInt(
      statistics.events[statistics.events.length - 1].text
        .split(" ")[0]
        .replace("'")
    ) >= 45
  ) {
    market.outcomes.forEach((outcome) => {
      outcome.status = 3;
    });

    const homeScore = parseInt(statistics.scores["2"].home);
    const awayScore = parseInt(statistics.scores["2"].away);

    if (homeScore > awayScore || homeScore === awayScore) {
      market.outcomes[0].status = 2;
    }
    if (awayScore > homeScore || homeScore === awayScore) {
      market.outcomes[2].status = 2;
    }
    if (homeScore > awayScore || awayScore > homeScore) {
      market.outcomes[1].status = 2;
    }
  }
};

const TeamToScore = (statistics, market) => {
  if (
    parseInt(statistics.ss.split("-")[0]) > 0 ||
    parseInt(statistics.ss.split("-")[1]) > 0
  ) {
    market.outcomes.forEach((outcome) => {
      outcome.status = 3;
    });

    if (parseInt(statistics.ss.split("-")[0]) > 0) {
      market.outcomes[0].status = 2;
    }

    if (parseInt(statistics.ss.split("-")[1]) > 0) {
      market.outcomes[1].status = 2;
    }
  }
};

const HalfTimeTotalGoals = (statistics, market) => {
  if (
    statistics.scores["1"] &&
    parseInt(statistics.stats.goals[0]) + parseInt(statistics.stats.goals[1]) >=
    parseFloat(market.specifiers.total)
  ) {
    market.outcomes.forEach((outcome) => {
      outcome.status = 3;
    });

    const total = parseInt(market.specifiers.total);
    const goalsArr = [];

    statistics.events.forEach((event) => {
      if (
        event.text.includes("- Goal -") &&
        parseInt(event.text.split(" ")[0].replace("'", "")) < 45
      ) {
        goalsArr.push(event);
      }
    });

    if (goalsArr.length > total) {
      market.outcomes[1].status = 2;
    }

    if (goalsArr.length < total) {
      market.outcomes[0].status = 2;
    }
  } else if (isFullTimeEnded(statistics)) {
    market.outcomes.forEach((outcome) => {
      outcome.status = 3;
    });

    const total = parseInt(market.specifiers.total);
    const goalsArr = [];

    statistics.events.forEach((event) => {
      if (
        event.text.includes("- Goal -") &&
        parseInt(event.text.split(" ")[0].replace("'", "")) < 45
      ) {
        goalsArr.push(event);
      }
    });

    if (goalsArr.length > total) {
      market.outcomes[1].status = 2;
    }

    if (goalsArr.length < total) {
      market.outcomes[0].status = 2;
    }
  }
};

const SecondTimeTotalGoals = (statistics, market) => {
  if (
    statistics.scores["2"] &&
    parseInt(statistics.scores["2"].home) +
    parseInt(statistics.scores["2"].away) >=
    parseFloat(market.specifiers.total)
  ) {
    market.outcomes.forEach((outcome) => {
      outcome.status = 3;
    });

    const total = parseFloat(market.specifiers.total);
    const goalsArr = [];

    statistics.events.forEach((event) => {
      if (
        parseInt(event.text.split(" ")[0].replace("'", "")) >= 45 &&
        parseInt(event.text.split(" ")[0].replace("'", "")) < 90
      ) {
        goalsArr.push(event);
      }
    });

    if (goalsArr.length > total) {
      market.outcomes[1].status = 2;
    }

    if (goalsArr.length < total) {
      market.outcomes[0].status = 2;
    }
  } else if (isFullTimeEnded(statistics)) {
    market.outcomes.forEach((outcome) => {
      outcome.status = 3;
    });

    const total = parseFloat(market.specifiers.total);
    const goalsArr = [];

    statistics.events.forEach((event) => {
      if (
        parseInt(event.text.split(" ")[0].replace("'", "")) >= 45 &&
        parseInt(event.text.split(" ")[0].replace("'", "")) < 90
      ) {
        goalsArr.push(event);
      }
    });

    if (goalsArr.length > total) {
      market.outcomes[1].status = 2;
    }

    if (goalsArr.length < total) {
      market.outcomes[0].status = 2;
    }
  }
};

const NumberOfGoals = (statistics, market) => {
  if (isFullTimeEnded(statistics)) {
    market.outcomes.forEach((outcome) => {
      outcome.status = 3;
    });

    let totalGoals = 0;

    statistics.events.forEach((event) => {
      if (event.text.includes(" Goal -")) {
        //Check if it's not extra time
        if (parseInt(event.text.split(" ")[0].replace("'", "")) < 90) {
          totalGoals++;
        }
      }
    });

    if (totalGoals === 0 || totalGoals === 1) {
      market.outcomes[0].status = 2;
    }

    if (totalGoals === 2 || totalGoals === 3) {
      market.outcomes[1].status = 2;
    }

    if (totalGoals === 4 || totalGoals > 4) {
      market.outcomes[2].status = 2;
    }
  }
};

const HalfTimeResultTotal = (statistics, market) => {
  if (
    statistics.scores["1"] &&
    parseInt(
      statistics.events[statistics.events.length - 1].text
        .split(" ")[0]
        .replace("'", "")
    ) >= 45
  ) {
    const total = parseFloat(market.specifiers.total);
    const winner =
      statistics.scores["1"].home > statistics.scores["1"].away
        ? "home"
        : statistics.scores["1"].home === statistics.scores["1"].away
          ? "draw"
          : "away";
    let totalGoals = 0;
    statistics.events.forEach((event) => {
      if (
        event.text.includes("- Goal -") &&
        parseInt(event.text.split(" ")[0].replace("'", "")) < 45
      ) {
        totalGoals++;
      }
    });

    market.outcomes.forEach((outcome) => {
      outcome.status = 3;
    });

    if (winner === "home" && totalGoals < total) {
      market.outcomes[0].status = 2;
    }

    if (winner === "home" && totalGoals > total) {
      market.outcomes[1].status = 2;
    }

    if (winner === "draw" && totalGoals < total) {
      market.outcomes[2].status = 2;
    }

    if (winner === "draw" && totalGoals > total) {
      market.outcomes[3].status = 2;
    }

    if (winner === "away" && totalGoals < total) {
      market.outcomes[4].status = 2;
    }

    if (winner === "away" && totalGoals > total) {
      market.outcomes[5].status = 2;
    }
  }
};

const SecondHalfResultTotal = (statistics, market) => {
  if (
    statistics.scores["2"] &&
    parseInt(
      statistics.events[statistics.events.length - 1].text
        .split(" ")[0]
        .replace("'", "")
    ) >= 45
  ) {
    const total = parseFloat(market.specifiers.total);
    const winner =
      statistics.scores["2"].home > statistics.scores["2"].away
        ? "home"
        : statistics.scores["2"].home === statistics.scores["2"].away
          ? "draw"
          : "away";
    let totalGoals = 0;
    statistics.events.forEach((event) => {
      if (
        event.text.includes("- Goal -") &&
        parseInt(event.text.split(" ")[0].replace("'", "")) >= 45
      ) {
        totalGoals++;
      }
    });

    market.outcomes.forEach((outcome) => {
      outcome.status = 3;
    });

    if (winner === "home" && totalGoals < total) {
      market.outcomes[0].status = 2;
    }

    if (winner === "home" && totalGoals > total) {
      market.outcomes[1].status = 2;
    }

    if (winner === "draw" && totalGoals < total) {
      market.outcomes[2].status = 2;
    }

    if (winner === "draw" && totalGoals > total) {
      market.outcomes[3].status = 2;
    }

    if (winner === "away" && totalGoals < total) {
      market.outcomes[4].status = 2;
    }

    if (winner === "away" && totalGoals > total) {
      market.outcomes[5].status = 2;
    }
  }
};

const GoalScorer = (statistics, market) => {
  const goalnr = parseInt(market.specifiers.goalnr);
  let goalCounter = 0;
  if (
    parseInt(statistics.stats.goals[0]) + parseInt(statistics.stats.goals[1]) >=
    goalnr
  ) {
    statistics.events.forEach((event) => {
      if (event.text.includes("- Goal -")) {
        goalCounter++;

        if (goalCounter === goalnr) {
          const scorer = event.text
            .split(" - ")[2]
            .replace(statistics.home.name)
            .replace(statistics.away.name)
            .replace(" (", "")
            .replace(")", "");

          market.outcomes.forEach((outcome) => {
            if (
              scorer.includes(outcome.outcome) ||
              scorer === outcome.outcome
            ) {
              outcome.status = 2;
            } else {
              outcome.status = 3;
            }
          });
        }
      }
    });
  }
};

const HalfTimeTeamTotalGoals = (statistics, market) => {
  const homeTeam = statistics.home.name;
  const total = parseFloat(market.specifiers.total);

  if (isFullTimeEnded(statistics)) {
    if (statistics.scores["1"]) {
      if (market.outcomes[0].outcomeId === "63002") {
        market.outcomes.forEach((outcome) => {
          outcome.status = 3;
        });

        let totalGoals = parseInt(statistics.scores["1"].home);
        /*statistics.events.forEach((event) => {
            if (event.text.includes("- Goal -")) {
              const teamScored =
                event.text
                  .split(" - ")[2]
                  .split(" ")[1]
                  .replace("(", "")
                  .replace(")", "") === homeTeam
                  ? "home"
                  : "away";

              //Check if it's not extra time
              if (parseInt(event.text.split(" ")[0].replace("'", "")) < 45) {
                if (teamScored === "home") {
                  totalGoals++;
                }
              }
            }
          });*/

        console.log("Total goals: ", totalGoals);
        if (totalGoals < total) {
          market.outcomes[0].status = 2;
        }

        if (totalGoals > total) {
          market.outcomes[1].status = 2;
        }
      }

      if (market.outcomes[0].outcomeId === "64002") {
        market.outcomes.forEach((outcome) => {
          outcome.status = 3;
        });
        let totalGoals = parseInt(statistics.scores["1"].away);
        /*statistics.events.forEach((event) => {
            if (event.text.includes(" Goal -")) {
              const teamScored =
                event.text
                  .split(" - ")[2]
                  .split(" ")[1]
                  .replace("(", "")
                  .replace(")", "") === homeTeam
                  ? "home"
                  : "away";

              //Check if it's not extra time
              if (parseInt(event.text.split(" ")[0].replace("'", "")) < 45) {
                if (teamScored === "away") {
                  totalGoals++;
                }
              }
            }
          });*/

        if (totalGoals < total) {
          market.outcomes[0].status = 2;
        }

        if (totalGoals > total) {
          market.outcomes[1].status = 2;
        }
      }
    }
  } else {
    if (statistics.scores["1"]) {
      if (market.outcomes[0].outcomeId === "63002") {
        if (
          parseInt(statistics.scores["1"].home) >=
          parseFloat(market.specifiers.total)
        ) {
          market.outcomes.forEach((outcome) => {
            outcome.status = 3;
          });

          let totalGoals = parseInt(statistics.scores["1"].home);
          /*statistics.events.forEach((event) => {
            if (event.text.includes("- Goal -")) {
              const teamScored =
                event.text
                  .split(" - ")[2]
                  .split(" ")[1]
                  .replace("(", "")
                  .replace(")", "") === homeTeam
                  ? "home"
                  : "away";

              //Check if it's not extra time
              if (parseInt(event.text.split(" ")[0].replace("'", "")) < 45) {
                if (teamScored === "home") {
                  totalGoals++;
                }
              }
            }
          });*/

          console.log("Total goals: ", totalGoals);
          if (totalGoals < total) {
            market.outcomes[0].status = 2;
          }

          if (totalGoals > total) {
            market.outcomes[1].status = 2;
          }
        }
      }

      if (market.outcomes[0].outcomeId === "64002") {
        if (
          parseInt(statistics.scores["1"].away) >=
          parseFloat(market.specifiers.total)
        ) {
          market.outcomes.forEach((outcome) => {
            outcome.status = 3;
          });
          let totalGoals = parseInt(statistics.scores["1"].away);
          /*statistics.events.forEach((event) => {
            if (event.text.includes(" Goal -")) {
              const teamScored =
                event.text
                  .split(" - ")[2]
                  .split(" ")[1]
                  .replace("(", "")
                  .replace(")", "") === homeTeam
                  ? "home"
                  : "away";

              //Check if it's not extra time
              if (parseInt(event.text.split(" ")[0].replace("'", "")) < 45) {
                if (teamScored === "away") {
                  totalGoals++;
                }
              }
            }
          });*/

          if (totalGoals < total) {
            market.outcomes[0].status = 2;
          }

          if (totalGoals > total) {
            market.outcomes[1].status = 2;
          }
        }
      }
    }
  }
};

const SecondHalfTeamTotalGoals = (statistics, market) => {
  const homeTeam = statistics.home.name;
  const total = parseFloat(market.specifiers.total);

  if (isFullTimeEnded(statistics)) {
    if (statistics.scores["2"]) {
      if (market.outcomes[0].outcomeId === "63002") {
        market.outcomes.forEach((outcome) => {
          outcome.status = 3;
        });

        let totalGoals = parseInt(statistics.scores["1"].home);
        /*statistics.events.forEach((event) => {
            if (event.text.includes("- Goal -")) {
              const teamScored =
                event.text
                  .split(" - ")[2]
                  .split(" ")[1]
                  .replace("(", "")
                  .replace(")", "") === homeTeam
                  ? "home"
                  : "away";

              //Check if it's not extra time
              if (parseInt(event.text.split(" ")[0].replace("'", "")) < 45) {
                if (teamScored === "home") {
                  totalGoals++;
                }
              }
            }
          });*/

        console.log("Total goals: ", totalGoals);
        if (totalGoals < total) {
          market.outcomes[0].status = 2;
        }

        if (totalGoals > total) {
          market.outcomes[1].status = 2;
        }
      }

      if (market.outcomes[0].outcomeId === "64002") {
        market.outcomes.forEach((outcome) => {
          outcome.status = 3;
        });
        let totalGoals = parseInt(statistics.scores["1"].away);
        /*statistics.events.forEach((event) => {
            if (event.text.includes(" Goal -")) {
              const teamScored =
                event.text
                  .split(" - ")[2]
                  .split(" ")[1]
                  .replace("(", "")
                  .replace(")", "") === homeTeam
                  ? "home"
                  : "away";

              //Check if it's not extra time
              if (parseInt(event.text.split(" ")[0].replace("'", "")) < 45) {
                if (teamScored === "away") {
                  totalGoals++;
                }
              }
            }
          });*/

        if (totalGoals < total) {
          market.outcomes[0].status = 2;
        }

        if (totalGoals > total) {
          market.outcomes[1].status = 2;
        }
      }
    }
  } else {
    if (statistics.scores["2"]) {
      if (market.outcomes[0].outcomeId === "83002") {
        if (
          parseInt(statistics.scores["2"].home) >=
          parseFloat(market.specifiers.total)
        ) {
          market.outcomes.forEach((outcome) => {
            outcome.status = 3;
          });

          let totalGoals = parseInt(statistics.scores["2"].home);
          /*statistics.events.forEach((event) => {
            if (event.text.includes("- Goal -")) {
              const teamScored =
                event.text
                  .split(" - ")[2]
                  .split(" ")[1]
                  .replace("(", "")
                  .replace(")", "") === homeTeam
                  ? "home"
                  : "away";

              //Check if it's not extra time
              if (parseInt(event.text.split(" ")[0].replace("'", "")) < 45) {
                if (teamScored === "home") {
                  totalGoals++;
                }
              }
            }
          });*/

          console.log("Total goals: ", totalGoals);
          if (totalGoals < total) {
            market.outcomes[0].status = 2;
          }

          if (totalGoals > total) {
            market.outcomes[1].status = 2;
          }
        }
      }

      if (market.outcomes[0].outcomeId === "84002") {
        if (
          parseInt(statistics.scores["2"].away) >=
          parseFloat(market.specifiers.total)
        ) {
          market.outcomes.forEach((outcome) => {
            outcome.status = 3;
          });
          let totalGoals = parseInt(statistics.scores["2"].away);
          /*statistics.events.forEach((event) => {
            if (event.text.includes(" Goal -")) {
              const teamScored =
                event.text
                  .split(" - ")[2]
                  .split(" ")[1]
                  .replace("(", "")
                  .replace(")", "") === homeTeam
                  ? "home"
                  : "away";

              //Check if it's not extra time
              if (parseInt(event.text.split(" ")[0].replace("'", "")) < 45) {
                if (teamScored === "away") {
                  totalGoals++;
                }
              }
            }
          });*/

          if (totalGoals < total) {
            market.outcomes[0].status = 2;
          }

          if (totalGoals > total) {
            market.outcomes[1].status = 2;
          }
        }
      }
    }
  }
};

const TotalGoalsInFirst10Minutes = (statistics, market) => {
  if (
    parseInt(
      statistics.events[statistics.events.length - 1].text
        .split(" ")[0]
        .replace("'", "")
    ) >= 10
  ) {
    market.outcomes.forEach((outcome) => {
      outcome.status = 3;
    });
    let totalGoals = 0;
    statistics.events.forEach((event) => {
      if (
        event.text.includes("- Goal -") &&
        parseInt(event.text.split(" ")[0].replace("'", "")) <= 10
      ) {
        totalGoals++;
      }
    });
    const total = parseFloat(market.specifiers.sbv);

    if (totalGoals < total) {
      market.outcomes[0].status = 2;
    }

    if (totalGoals > total) {
      market.outcomes[1].status = 2;
    }
  }
};

const TotalThrowInsInFirst10Minutes = (statistics, market) => {
  if (
    parseInt(
      statistics.events[statistics.events.length - 1].text
        .split(" ")[0]
        .replace("'", "")
    ) >= 10
  ) {
    market.outcomes.forEach((outcome) => {
      outcome.status = 3;
    });
    let totalThrowIns = 0;
    statistics.events.forEach((event) => {
      if (
        event.text.includes("- Throw-in -") &&
        parseInt(event.text.split(" ")[0].replace("'", "")) <= 10
      ) {
        totalThrowIns++;
      }
    });
    const total = parseFloat(market.specifiers.sbv);

    if (totalThrowIns < total) {
      market.outcomes[0].status = 2;
    }

    if (totalThrowIns > total) {
      market.outcomes[1].status = 2;
    }
  }
};

const TeamTotalSaves = (statistics, market) => {
  const total = parseFloat(market.specifiers.sbv);
  const bettingTeam =
    market.outcomes[0].outcomeId === "5000000730" ? "home" : "away";

  if (isFullTimeEnded(statistics)) {
    if (
      parseInt(statistics.stats.saves[bettingTeam === "home" ? 0 : 1]) < total
    ) {
      market.outcomes[0].status = 2;
      market.outcomes[1].status = 3;
    }

    if (
      parseInt(statistics.stats.saves[bettingTeam === "home" ? 0 : 1]) > total
    ) {
      market.outcomes[0].status = 3;
      market.outcomes[1].status = 2;
    }
  } else {
    if (
      parseInt(statistics.stats.saves[bettingTeam === "home" ? 0 : 1]) > total
    ) {
      market.outcomes[0].status = 3;
      market.outcomes[1].status = 2;
    }
  }
};

const TotalSaves = (statistics, market) => {
  const total = parseFloat(market.specifiers.sbv);
  const totalSaves =
    parseInt(statistics.stats.saves[0]) + parseInt(statistics.stats.saves[1]);

  if (isFullTimeEnded(statistics)) {
    if (totalSaves < total) {
      market.outcomes[0].status = 2;
      market.outcomes[1].status = 3;
    }
    if (totalSaves > total) {
      market.outcomes[0].status = 3;
      market.outcomes[1].status = 2;
    }
  } else {
    if (totalSaves > total) {
      market.outcomes[0].status = 3;
      market.outcomes[1].status = 2;
    }
  }
};

const HalfTimeTeamTotalThrowIns = (statistics, market) => {
  const total = parseFloat(market.specifiers.sbv);
  const bettingTeam =
    market.outcomes[0].outcomeId === "5000000700" ? "away" : "home";
  let totalThrowIns = 0;

  statistics.events.forEach((event) => {
    if (
      event.text.includes("- Throw-in - ") &&
      event.text.includes(
        bettingTeam === "home" ? statistics.home.name : statistics.away.name
      ) &&
      parseInt(event.text.split(" ")[0].replace("'", "")) < 45
    ) {
      totalThrowIns++;
    }
  });

  if (isFullTimeEnded(statistics)) {
    if (totalThrowIns < total) {
      market.outcomes[0].status = 2;
      market.outcomes[1].status = 3;
    }
    if (totalThrowIns > total) {
      market.outcomes[0].status = 3;
      market.outcomes[1].status = 2;
    }
  } else {
    if (totalThrowIns > total) {
      market.outcomes[0].status = 3;
      market.outcomes[1].status = 2;
    }
  }
};

const HalfTimeTeamTotalShots = (statistics, market) => {
  const total = parseFloat(market.specifiers.sbv);
  const bettingTeam =
    market.outcomes[0].outcomeId === "5000000660" ? "away" : "home";
  let totalShots = 0;

  statistics.events.forEach((event) => {
    if (
      event.text.includes("- Shot off") ||
      (event.text.includes("- Shot on") &&
        event.text.includes(
          bettingTeam === "home" ? statistics.home.name : statistics.away.name
        ) &&
        parseInt(event.text.split(" ")[0].replace("'", "")) < 45)
    ) {
      totalShots++;
    }
  });

  if (isFullTimeEnded(statistics)) {
    if (totalShots < total) {
      market.outcomes[0].status = 2;
      market.outcomes[1].status = 3;
    }
    if (totalShots > total) {
      market.outcomes[0].status = 3;
      market.outcomes[1].status = 2;
    }
  } else {
    if (totalShots > total) {
      market.outcomes[0].status = 3;
      market.outcomes[1].status = 2;
    }
  }
};

const TotalCorners = (statistics, market) => {
  const total = parseFloat(market.specifiers.total);
  const totalCorners =
    parseInt(statistics.stats.corners[0]) +
    parseInt(statistics.stats.corners[1]);

  if (isFullTimeEnded(statistics)) {
    if (totalCorners < total) {
      market.outcomes[0].status = 2;
      market.outcomes[1].status = 3;
    }
    if (totalCorners > total) {
      market.outcomes[0].status = 3;
      market.outcomes[1].status = 2;
    }
  } else {
    if (totalCorners > total) {
      market.outcomes[0].status = 3;
      market.outcomes[1].status = 2;
    }
  }
};

const TeamTotalCorners = (statistics, market) => {
  const total = parseFloat(market.specifiers.total);
  const bettingTeam =
    market.outcomes[0].outcomeId === "157002" ? "home" : "away";
  const totalCorners = parseInt(
    statistics.stats.corners[bettingTeam === "home" ? 0 : 1]
  );

  if (isFullTimeEnded(statistics)) {
    if (totalCorners < total) {
      market.outcomes[0].status = 2;
      market.outcomes[1].status = 3;
    }
    if (totalCorners > total) {
      market.outcomes[0].status = 3;
      market.outcomes[1].status = 2;
    }
  } else {
    if (totalCorners > total) {
      market.outcomes[0].status = 3;
      market.outcomes[1].status = 2;
    }
  }
};

const TotalOffsides = (statistics, market) => {
  const total = parseFloat(market.specifiers.sbv);
  const totalOffsides =
    parseInt(statistics.stats.offsides[0]) +
    parseInt(statistics.stats.offsides[1]);

  if (isFullTimeEnded(statistics)) {
    if (totalOffsides < total) {
      market.outcomes[0].status = 2;
      market.outcomes[1].status = 3;
    }
    if (totalOffsides > total) {
      market.outcomes[0].status = 3;
      market.outcomes[1].status = 2;
    }
  } else {
    if (totalOffsides > total) {
      market.outcomes[0].status = 3;
      market.outcomes[1].status = 2;
    }
  }
};

const TotalShotsOnGoal = (statistics, market) => {
  const total = parseFloat(market.specifiers.sbv);
  const totalShotsOnGoal =
    parseInt(statistics.stats.on_target[0]) +
    parseInt(statistics.stats.on_target[1]);

  if (isFullTimeEnded(statistics)) {
    if (totalShotsOnGoal < total) {
      market.outcomes[0].status = 2;
      market.outcomes[1].status = 3;
    }
    if (totalShotsOnGoal > total) {
      market.outcomes[0].status = 3;
      market.outcomes[1].status = 2;
    }
  } else {
    if (totalShotsOnGoal > total) {
      market.outcomes[0].status = 3;
      market.outcomes[1].status = 2;
    }
  }
};

const HalfTimeTotalShotsOnGoal = (statistics, market) => {
  if (
    statistics.scores["1"] &&
    parseInt(statistics.stats.on_target[0]) +
    parseInt(statistics.stats.on_target[1]) >=
    parseFloat(market.specifiers.total)
  ) {
    market.outcomes.forEach((outcome) => {
      outcome.status = 3;
    });

    const total = parseInt(market.specifiers.total);
    const shotsArr = [];

    statistics.events.forEach((event) => {
      if (
        event.text.includes("- Shot on target -") &&
        parseInt(event.text.split(" ")[0].replace("'", "")) < 45
      ) {
        shotsArr.push(event);
      }
    });

    if (shotsArr.length > total) {
      market.outcomes[1].status = 2;
    }

    if (shotsArr.length < total) {
      market.outcomes[0].status = 2;
    }
  } else if (isFullTimeEnded(statistics)) {
    market.outcomes.forEach((outcome) => {
      outcome.status = 3;
    });

    const total = parseInt(market.specifiers.total);
    const shotsArr = [];

    statistics.events.forEach((event) => {
      if (
        event.text.includes("- Shot on target -") &&
        parseInt(event.text.split(" ")[0].replace("'", "")) < 45
      ) {
        shotsArr.push(event);
      }
    });

    if (shotsArr.length > total) {
      market.outcomes[1].status = 2;
    }

    if (shotsArr.length < total) {
      market.outcomes[0].status = 2;
    }
  }
};

const FirstToScore = (statistics, market) => {
  if (
    parseInt(statistics.stats.goals[0]) > 0 ||
    parseInt(statistics.stats.goals[1]) > 0
  ) {
    let goalsCounter = 0;
    statistics.events.forEach((event) => {
      if (event.text.includes("- Goal -") && goalsCounter === 0) {
        goalsCounter = 1;
        const scorer = event.text
          .split(" - ")[2]
          .replace(statistics.home.name)
          .replace(statistics.away.name)
          .replace(" (", "")
          .replace(")", "");

        console.log("SCORER:::::::", scorer);

        market.outcomes.forEach((outcome) => {
          if (scorer.includes(outcome.outcome) || scorer === outcome.outcome) {
            outcome.status = 2;
          } else {
            outcome.status = 3;
          }
        });
      }
    });
  }
};

const ToScoreTwoOrMoreGoals = (statistics, market) => {
  if (isFullTimeEnded(statistics)) {
    market.outcomes.forEach((outcome) => {
      const Player = outcome.outcome;
      let score = 0;

      statistics.events.forEach((event) => {
        if (event.text.includes("- Goal -")) {
          const scorer = event.text
            .split(" - ")[2]
            .replace(statistics.home.name)
            .replace(statistics.away.name)
            .replace(" (", "")
            .replace(")", "");
          if (scorer.includes(Player)) {
            score++;
          }
        }
      });

      if (score >= 2) {
        outcome.status = 2;
      } else {
        outcome.status = 3;
      }
    });
  } else {
    if (
      parseInt(statistics.stats.goals[0]) >= 2 ||
      parseInt(statistics.stats.goals[1]) >= 2
    ) {
      market.outcomes.forEach((outcome) => {
        const Player = outcome.outcome;
        let score = 0;

        statistics.events.forEach((event) => {
          if (event.text.includes("- Goal -")) {
            const scorer = event.text
              .split(" - ")[2]
              .replace(statistics.home.name)
              .replace(statistics.away.name)
              .replace(" (", "")
              .replace(")", "");
            if (scorer.includes(Player)) {
              score++;
            }
          }
        });

        if (score >= 2) {
          outcome.status = 2;
        }
      });
    }
  }
};

const TimeOfTeamFirstGoal = (statistics, market) => {
  //TODO
  /*if (isFullTimeEnded(statistics)) {
  } else {
    if (parseInt(statistics.stats.goals[0]) > 0 || parseInt(statistics.stats.goals[1]) > 0) {
      if (parseInt(statistics.stats.goals[0]) > 0) {

      }
      if (parseInt(statistics.stats.goals[1]) > 0) {

      }
    }
  }*/
};

const HalfTimeGoals = (statistics, market) => {
  if (
    parseInt(
      statistics.events[statistics.events.length - 1].text
        .split(" ")[0]
        .replace("'", "")
    ) > 45
  ) {
    market.outcomes.forEach((outcome) => {
      outcome.status = 3;
    });
    let totalGoals = 0;
    statistics.events.forEach((event) => {
      if (
        event.text.includes("- Goal -") &&
        parseInt(event.text.split(" ")[0].replace("'", "")) < 45
      ) {
        totalGoals++;
      }
    });

    if (totalGoals === 1) {
      market.outcomes[0].status = 2;
    }

    if (totalGoals === 2) {
      market.outcomes[1].status = 2;
    }

    if (totalGoals >= 3) {
      market.outcomes[2].status = 2;
    }

    if (totalGoals === 0) {
      market.outcomes[3].status = 2;
    }
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
  OneMinuteEvents,
  BothToScoreInBothHalves,
  TotalGoalsOddEven,
  FromTo3WayResult,
  GoalBetween,
  HalftimeMinuteResult,
  SecondHTotalGoalsOverUnder,
  TeamToScoreLast,
  ToScoreInBoth,
  ToWinBoth,
  HighestScoringHalf,
  ToWinEitherHalf,
  HalfTime3Way,
  CorrectScore,
  HalfTimeDoubleChance,
  TeamToScore,
  HalfTimeTotalGoals,
  NumberOfGoals,
  AnyTimeCorrectScore,
  HalfTimeAnyTimeCorrectScore,
  HalfTimeResultTotal,
  GoalScorer,
  HalfTimeTeamTotalGoals,
  SecondHalf3Way,
  SecondHalfAnyTimeCorrectScore,
  SecondHalfDoubleChance,
  SecondTimeTotalGoals,
  SecondHalfResultTotal,
  SecondHalfTeamTotalGoals,
  BothTeamsToScoreHalfTime,
  HalfTimeCorrectScore,
  TotalGoalsInFirst10Minutes,
  TotalThrowInsInFirst10Minutes,
  TeamTotalSaves,
  TotalSaves,
  HalfTimeTeamTotalThrowIns,
  HalfTimeTeamTotalShots,
  TotalCorners,
  TeamTotalCorners,
  TotalOffsides,
  TotalShotsOnGoal,
  HalfTimeTotalShotsOnGoal,
  FirstToScore,
  ToScoreTwoOrMoreGoals,
  HalfTimeGoals,
};
