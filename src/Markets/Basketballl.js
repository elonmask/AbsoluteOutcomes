const { mark } = require("yarn/lib/cli");
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
  const pointNumber = parseInt(market.specifiers.pointnr);

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
};
