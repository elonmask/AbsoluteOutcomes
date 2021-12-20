const FirstHalfTeamTotal = (statistics, market) => {
  const total = parseFloat(market.specifiers.total);
  const team = market.name.includes("competitor2") ? "away" : "home";

  if (statistics.periods["p3"]) {
    market.outcomes.forEach((market) => {
      market.status = 3;
    });
    const halfScore =
      team === "home"
        ? statistics.periods["p1"].home + statistics.periods["p2"].home
        : statistics.periods["p1"].away + statistics.periods["p2"].away;
    if (halfScore > total) {
      market.outcomes[1].status = 2;
    }
    if (halfScore < total) {
      market.outcomes[0].status = 2;
    }
  } else {
    const currentScore =
      team === "home" ? statistics.result.home : statistics.result.away;
    if (currentScore > total) {
      market.outcomes[1].status = 2;
      market.outcomes[0].status = 3;
    }
  }
};
const ThreeWay = (statistics, market) => {
  if (statistics.time_status === "3") {
    market.outcomes.forEach((market) => {
      market.status = 3;
    });
    const homeScore = statistics.result.home;
    const awayScore = statistics.result.away;

    const winner =
      homeScore > awayScore
        ? "home"
        : awayScore > homeScore
          ? "away"
          : homeScore === awayScore
            ? "draw"
            : "";
    switch (winner) {
      case "home":
        market.outcomes[0].status = 2;
        break;
      case "away":
        market.outcomes[2].status = 2;
        break;
      case "draw":
        market.outcomes[1].status = 2;
    }
  }
};
const HalftimeOddEven = (statistics, market) => {
  if (statistics.periods["p3"]) {
    market.outcomes.forEach((outcome) => {
      outcome.status = 3;
    });

    const totalScore =
      statistics.periods["p1"].home +
      statistics.periods["p1"].away +
      statistics.periods["p2"].home +
      statistics.periods["p2"].away;

    if (totalScore % 2 === 1) {
      market.outcomes[0].status = 2;
    }

    if (totalScore % 2 === 0) {
      market.outcomes[1].status = 2;
    }
  }
};
const SecondHalfThreeWay = (statistics, market) => {
  if (statistics.time_status === "3") {
    market.outcomes.forEach((market) => {
      market.status = 3;
    });
    const homeScore =
      statistics.periods["p3"].home + statistics.periods["p4"].home;
    const awayScore =
      statistics.periods["p3"].away + statistics.periods["p4"].away;

    const winner =
      homeScore > awayScore
        ? "home"
        : awayScore > homeScore
          ? "away"
          : homeScore === awayScore
            ? "draw"
            : "";
    switch (winner) {
      case "home":
        market.outcomes[0].status = 2;
        break;
      case "away":
        market.outcomes[2].status = 2;
        break;
      case "draw":
        market.outcomes[1].status = 2;
    }
  }
};
const MatchWinner = (statistics, market) => {
  if (statistics.time_status === "3") {
    market.outcomes.forEach((market) => {
      market.status = 3;
    });
    const homeScore = statistics.result.home;
    const awayScore = statistics.result.away;

    const winner =
      homeScore > awayScore
        ? "home"
        : awayScore > homeScore
          ? "away"
          : homeScore === awayScore
            ? "draw"
            : "";

    switch (winner) {
      case "home":
        market.outcomes[0].status = 2;
        break;
      case "away":
        market.outcomes[1].status = 2;
        break;
    }
  }
};

const HandicapWithDraw = (statistics, market) => {
  if (statistics.time_status === "3") {
    market.outcomes.forEach((outcome) => {
      outcome.status = 3;
    });

    const handicap = parseFloat(market.specifiers.hcp.replace("0:", ""));

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

const SecondHalfDrawNoBet = (statistics, market) => {
  if (statistics.time_status === "3") {
    market.outcomes.forEach((market) => {
      market.status = 3;
    });
    const homeScore =
      statistics.periods["p3"].home + statistics.periods["p4"].home;
    const awayScore =
      statistics.periods["p3"].away + statistics.periods["p4"].away;

    const winner =
      homeScore > awayScore
        ? "home"
        : awayScore > homeScore
          ? "away"
          : homeScore === awayScore
            ? "draw"
            : "";
    switch (winner) {
      case "home":
        market.outcomes[0].status = 2;
        break;
      case "away":
        market.outcomes[2].status = 2;
        break;
      case "draw":
        market.outcomes.forEach((market) => {
          market.status = 4;
        });
    }
  }
};

const WillThereBeOvertime = (statistics, market) => {
  // Ice hockey
  if (statistics.sport_id === '4') {
    const fullTimeIdx = statistics.events.findIndex((event) => event.text === 'Full Time');
    console.log(`fullTime idx`, fullTimeIdx);
    if (statistics.events[fullTimeIdx + 1].text === 'Match end') {
      market.outcomes[0].status = 3;
      market.outcomes[1].status = 2;
    } else {
      market.outcomes[0].status = 2;
      market.outcomes[1].status = 3;
    }
    return;
  }

  // Basketball
  let lastEventTime = null;
  statistics.events.forEach((event) => {
    if (event.text[event.text.length - 1] === "'") {
      lastEventTime = parseInt(
        event.text.split(" ")[event.text.split(" ").length - 1].replace("'", "")
      );
    }
  });

  if (statistics.time_status === "3") {
    if (lastEventTime > 40) {
      market.outcomes[0].status = 2;
      market.outcomes[1].status = 3;
    }
    if (lastEventTime <= 40) {
      market.outcomes[0].status = 3;
      market.outcomes[1].status = 2;
    }
  } else {
    if (lastEventTime > 40) {
      market.outcomes[0].status = 2;
      market.outcomes[1].status = 3;
    }
  }
};

const WhichTeamScoresPoint = (statistics, market) => {
  let pointNumber = parseInt(market.specifiers.pointnr);

  if (!pointNumber) {
    pointNumber = parseInt(market.specifiers.goalnr);
    console.log("pointNumber", pointNumber);
  }

  if (statistics.time_status === "3") {
    if (statistics.result.home >= pointNumber) {
      market.outcomes[0].status = 2;
    } else {
      market.outcomes[0].status = 3;
    }
    if (statistics.result.away >= pointNumber) {
      market.outcomes[1].status = 2;
    } else {
      market.outcomes[1].status = 3;
    }
  } else {
    if (statistics.result.home >= pointNumber) {
      market.outcomes[0].status = 2;
    }
    if (statistics.result.away >= pointNumber) {
      market.outcomes[1].status = 2;
    }
  }
};

const SecondHalfHandicap = (statistics, market) => {
  if (statistics.time_status === "3") {
    market.outcomes.forEach((outcome) => {
      outcome.status = 3;
    });

    const handicap = parseFloat(market.specifiers.hcp.replace("+"));

    const homeResult =
      statistics.periods["p3"].home + statistics.periods["p4"].home;
    const awayResult =
      statistics.periods["p3"].away + statistics.periods["p4"].away;

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

const Total = (statistics, market) => {
  const total = parseFloat(market.specifiers.total);
  const currentTotal = statistics.result.home + statistics.result.away;

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

const WinnerTotal = (statistics, market) => {
  if (statistics.time_status === "3") {
    market.outcomes.forEach((outcome) => {
      outcome.status = 3;
    });

    const winner = statistics.result.winner;
    const total = parseFloat(market.specifiers.total);
    const actualTotal = statistics.result.home + statistics.result.away;

    if (winner === "home" && actualTotal < total) {
      market.outcomes[0].status = 2;
    }
    if (winner === "home" && actualTotal > total) {
      market.outcomes[1].status = 2;
    }
    if (winner === "away" && actualTotal < total) {
      market.outcomes[2].status = 2;
    }
    if (winner === "away" && actualTotal > total) {
      market.outcomes[3].status = 2;
    }
  }
};

const HandicapTwoWay = (statistics, market) => {
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
  }
};

const SecondHalfTotal = (statistics, market) => {
  const total = parseFloat(market.specifiers.total);

  if (statistics.time_status === "3") {
    const actualTotal =
      statistics.periods["p1"].home +
      statistics.periods["p2"].home +
      statistics.periods["p1"].away +
      statistics.periods["p2"].away;
    if (actualTotal > total) {
      market.outcomes[0].status = 3;
      market.outcomes[1].status = 2;
    }
    if (actualTotal < total) {
      market.outcomes[0].status = 2;
      market.outcomes[1].status = 3;
    }
  } else {
    if (statistics.periods["p3"]) {
      const actualTotal =
        statistics.periods["p1"].home +
        statistics.periods["p2"].home +
        statistics.periods["p1"].away +
        statistics.periods["p2"].away;

      if (actualTotal > total) {
        market.outcomes[0].status = 3;
        market.outcomes[1].status = 2;
      }
      if (actualTotal < total) {
        market.outcomes[0].status = 2;
        market.outcomes[1].status = 3;
      }
    } else {
      if (statistics.periods["p1"] && statistics.periods["p2"]) {
        const actualTotal =
          statistics.periods["p1"].home +
          statistics.periods["p2"].home +
          statistics.periods["p1"].away +
          statistics.periods["p2"].away;

        if (actualTotal > total) {
          market.outcomes[0].status = 3;
          market.outcomes[1].status = 2;
        }
      }
    }
  }
};

const SecondHalfTotalOddEven = (statistics, market) => {
  if (statistics.time_status === "3") {
    market.outcomes.forEach((outcome) => {
      outcome.status = 3;
    });

    const totalScore =
      statistics.periods["p3"].home +
      statistics.periods["p3"].away +
      statistics.periods["p4"].home +
      statistics.periods["p4"].away;

    if (totalScore % 2 === 1) {
      market.outcomes[0].status = 2;
    }

    if (totalScore % 2 === 0) {
      market.outcomes[1].status = 2;
    }
  }
};

const Total3Way = (statistics, market) => {
  const total = parseFloat(market.specifiers.total);
  const currentTotal = statistics.result.home + statistics.result.away;

  if (statistics.time_status === "3") {
    market.outcomes.forEach((outcome) => {
      outcome.status = 3;
    });
    if (currentTotal > total) {
      market.outcomes[2].status = 2;
    }
    if (currentTotal < total) {
      market.outcomes[0].status = 2;
    }
    if (currentTotal === total) {
      market.outcomes[1].status = 2;
    }
  } else {
    if (currentTotal > total) {
      market.outcomes[1].status = 2;
      market.outcomes[0].status = 3;
    }
    if (currentTotal === total) {
      market.outcomes[1].status = 2;
    }
  }
};

const CompetitorTotal = (statistics, market) => {
  const team = market.name.includes("competitor1") ? "home" : "away";
  const total = parseFloat(market.specifiers.total);

  if (statistics.time_status === "3") {
    const actualTotal =
      team === "home" ? statistics.result.home : statistics.result.away;

    if (actualTotal < total) {
      market.outcomes[0].status = 2;
      market.outcomes[1].status = 3;
    }
    if (actualTotal > total) {
      market.outcomes[0].status = 3;
      market.outcomes[1].status = 2;
    }
  } else {
    const actualTotal =
      team === "home" ? statistics.result.home : statistics.result.away;
    if (actualTotal > total) {
      market.outcomes[0].status = 3;
      market.outcomes[1].status = 2;
    }
  }
};

const TotalOddEven = (statistics, market) => {
  if (statistics.time_status === "3") {
    market.outcomes.forEach((outcome) => {
      outcome.status = 3;
    });

    const totalScore = statistics.result.home + statistics.result.away;

    if (totalScore % 2 === 1) {
      market.outcomes[0].status = 2;
    }

    if (totalScore % 2 === 0) {
      market.outcomes[1].status = 2;
    }
  }
};

const WhichTeamRaceToPoints = (statistics, market) => {
  const pontNr = parseInt(market.specifiers.pointnr);
  let homeScore = 0;
  let awayScore = 0;
  let firstWinner = null;
  statistics.events.forEach((event) => {
    if (
      event.text.includes("pt scored") &&
      homeScore < pontNr &&
      awayScore < pontNr
    ) {
      homeScore = event.extra.home;
      awayScore = event.extra.away;

      if (homeScore >= pontNr) {
        firstWinner = "home";
      }
      if (awayScore >= pontNr) {
        firstWinner = "away";
      }
    }
  });

  if (firstWinner === "home") {
    market.outcomes[0].status = 2;
    market.outcomes[1].status = 3;
  }
  if (firstWinner === "away") {
    market.outcomes[0].status = 3;
    market.outcomes[1].status = 2;
  }
};

const QuarterHandicap = (statistics, market) => {
  const quarterNumber = parseInt(market.specifiers.quarternr);
  if (
    statistics.periods[`p${quarterNumber}`] && quarterNumber !== 4
      ? statistics.periods[`p${quarterNumber + 1}`]
      : statistics.periods["ft"]
  ) {
    market.outcomes.forEach((outcome) => {
      outcome.status = 3;
    });

    const handicap = parseFloat(market.specifiers.hcp.replace("+"));

    const homeResult = statistics.periods[`p${quarterNumber}`].home;
    const awayResult = statistics.periods[`p${quarterNumber}`].away;

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

const QuarterOddEven = (statistics, market) => {
  const quarterNumber = parseInt(market.specifiers.quarternr);
  if (
    statistics.periods[`p${quarterNumber}`] && quarterNumber !== 4
      ? statistics.periods[`p${quarterNumber + 1}`]
      : statistics.periods["ft"]
  ) {
    market.outcomes.forEach((outcome) => {
      outcome.status = 3;
    });

    const homeResult = statistics.periods[`p${quarterNumber}`].home;
    const awayResult = statistics.periods[`p${quarterNumber}`].away;
    const totalScore = homeResult + awayResult;

    if (totalScore % 2 === 1) {
      market.outcomes[0].status = 2;
    }

    if (totalScore % 2 === 0) {
      market.outcomes[1].status = 2;
    }
  }
};

const Quarter3Way = (statistics, market) => {
  const quarterNumber = parseInt(market.specifiers.quarternr);
  if (
    statistics.periods[`p${quarterNumber}`] && quarterNumber !== 4
      ? statistics.periods[`p${quarterNumber + 1}`]
      : statistics.periods["ft"]
  ) {
    market.outcomes.forEach((outcome) => {
      outcome.status = 3;
    });

    const homeResult = statistics.periods[`p${quarterNumber}`].home;
    const awayResult = statistics.periods[`p${quarterNumber}`].away;

    if (homeResult > awayResult) {
      market.outcomes[0].status = 2;
    }
    if (awayResult > homeResult) {
      market.outcomes[2].status = 2;
    }
    if (homeResult === awayResult) {
      market.outcomes[1].status = 2;
    }
  }
};

const QuarterTotal = (statistics, market) => {
  const quarterNumber = parseInt(market.specifiers.quarternr);
  const total = parseFloat(market.specifiers.total);
  if (
    statistics.periods[`p${quarterNumber}`] && quarterNumber !== 4
      ? statistics.periods[`p${quarterNumber + 1}`]
      : statistics.periods["ft"]
  ) {
    market.outcomes.forEach((outcome) => {
      outcome.status = 3;
    });

    const homeResult = statistics.periods[`p${quarterNumber}`].home;
    const awayResult = statistics.periods[`p${quarterNumber}`].away;

    const actualTotal = homeResult + awayResult;

    if (actualTotal < total) {
      market.outcomes[0].status = 2;
    }
    if (actualTotal > total) {
      market.outcomes[1].status = 2;
    }
  }
};

/////

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

const BothTeamsToScoreBasket = (statistics, market) => {
  market.outcomes.forEach((outcome) => {
    outcome.status = 3;
  });
  if (
    parseInt(statistics.stats.goals[0]) > 0 &&
    parseInt(statistics.stats.goals[1]) > 0
  ) {
    const isHomeScored = parseInt(statistics.ss.split("-")[0]) > 0;
    const isAwayScored = parseInt(statistics.ss.split("-")[1]) > 0;

    if (isHomeScored && isAwayScored) {
      market.outcomes[0].status = 2;
    } else {
      market.outcomes[1].status = 2;
    }
  } else if (isFullTimeEnded(statistics)) {
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

module.exports = {
  FirstHalfTeamTotal,
  ThreeWay,
  HalftimeOddEven,
  SecondHalfThreeWay,
  MatchWinner,
  HandicapWithDraw,
  SecondHalfDrawNoBet,
  WillThereBeOvertime,
  WhichTeamScoresPoint,
  SecondHalfHandicap,
  Total,
  WinnerTotal,
  HandicapTwoWay,
  SecondHalfTotal,
  SecondHalfTotalOddEven,
  Total3Way,
  CompetitorTotal,
  TotalOddEven,
  WhichTeamRaceToPoints,
  QuarterHandicap,
  QuarterOddEven,
  Quarter3Way,
  QuarterTotal,
  BothToScoreInBothHalves,
  TotalGoalsOddEven,
  HalfTimeFullTime,
  BothTeamsToScoreBasket,
  BothTeamsToScoreHalfTime,
  FromTo3WayResult,
};
