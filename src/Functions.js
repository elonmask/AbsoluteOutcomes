const { parse } = require("nodemon/lib/cli");
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
};
