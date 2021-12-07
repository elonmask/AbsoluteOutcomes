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

const CompetitorExactGoals = (statistics, market) => {

  const team = market.name.includes("competitor2") ? "away" : "home";
  const goals = statistics.result[team];



  market.outcomes.forEach((outcome) => {
    const exact = outcome.outcome.includes('+') ? 10000 : parseFloat(outcome.outcome);

    if (statistics.time_status !== "3") {
      if (goals > exact) {
        outcome.status = 3;
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

module.exports = {
  CompetitorTotal,
  CompetitorExactGoals,
  BothTeamsToScoreHockey,
  DoubleChanceHockey,
  DrawNoBetHockey,
  Handicap3WayHockey,
  HandicapHockey,
  TotalGoalsHockey
};
