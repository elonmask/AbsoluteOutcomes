const fullTimeResult = (statistics) => {
  //Outcomes with Common IDs
  const outcomes = {
    1001: "lose",
    1002: "lose",
    1003: "lose",
  };

  if (statistics.time_status === "3") {
    const homeScore = parseInt(statistics.ss.split("-")[0]);
    const awayScore = parseInt(statistics.ss.split("-")[1]);

    if (homeScore === awayScore) {
      outcomes["1002"] = "win";
    } else if (homeScore > awayScore) {
      outcomes["1001"] = "win";
    } else {
      outcomes["1003"] = "win";
    }

    return {
      CommonID: 1,
      LiveID: 1777,
      OddTypesID: 1,
      PrematchID: 40,
      Outcomes: outcomes,
    };
  } else {
    console.log("Wrong time status");
    return false;
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
        CommonID: 2,
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
      outcomes["14002"] = "lose";
    } else if (
      (!isHomeScored && !isAwayScored) ||
      (isHomeScored && !isAwayScored) ||
      (isAwayScored && !isHomeScored)
    ) {
      outcomes["14001"] = "lose";
      outcomes["14002"] = "win";
    }

    return {
      CommonID: 32,
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

module.exports = { fullTimeResult, HalfTimeFullTime, BothTeamsToScore };
