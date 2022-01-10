const SetGameTotalPoints = (statistics, market) => {
  const setNumber = parseInt(market.specifiers.setnr);
  const gameNumber = parseInt(market.specifiers.gamenr);
  const total = parseFloat(market.specifiers.total);

  const player = market.name.includes("$competitor1") ? "home" : "away";

  if (Object.keys(statistics.periods).length >= setNumber) {
    let gamesCounter = 0;
    statistics.events.forEach((event, idx) => {
      if (event.text.includes(setNumber) && event.text.includes(" set")) {
        for (let i = idx; i < statistics.events.length - idx; i++) {
          if (
            statistics.events[i].text.includes(setNumber + 1) &&
            event.text.includes(" set")
          ) {
            break;
          }
          if (
            statistics.events[i].text.split(" ")[
            statistics.events[i].text.split(" ").length - 1
            ] === "Game"
          ) {
            gamesCounter++;
          }
          if (gamesCounter === gameNumber) {
            if (player === "home") {
              try {
                if (
                  total >
                  parseInt(statistics.events[i]?.extra?.game_points.home)
                ) {
                  market.outcomes[0].status = 2;
                  market.outcomes[1].status = 3;
                }
                if (
                  total <
                  parseInt(statistics.events[i]?.extra?.game_points.home)
                ) {
                  market.outcomes[0].status = 3;
                  market.outcomes[1].status = 2;
                }
              } catch (err) {
                console.log(err);
              }
            } else {
              try {
                if (
                  total >
                  parseInt(statistics.events[i]?.extra?.game_points.away)
                ) {
                  market.outcomes[0].status = 2;
                  market.outcomes[1].status = 3;
                }
                if (
                  total <
                  parseInt(statistics.events[i]?.extra?.game_points.away)
                ) {
                  market.outcomes[0].status = 3;
                  market.outcomes[1].status = 2;
                }
              } catch (err) {
                console.log(err);
              }
            }
          }
        }
        if (
          gamesCounter < gameNumber &&
          Object.keys(statistics.periods).length + 1 === setNumber
        ) {
          market.outcomes.forEach((outc) => {
            outc.status = 4;
          });
        }

        if (gamesCounter < gameNumber && statistics.time_status === "3") {
          market.outcomes.forEach((outc) => {
            outc.status = 4;
          });
        }
      }
    });
  }
};

const SetScoreAfterGames = (statistics, market) => {
  const setNumber = parseInt(market.specifiers.set);
  const gameNumber = parseInt(market.specifiers.game);

  if (Object.keys(statistics.periods).length >= setNumber) {
    let counter = 0;
    statistics.events.forEach((event) => {
      if (
        event.text.split(" ")[event.text.split(" ").length - 1] === "Game" &&
        event.text.includes("Score change tennis")
      ) {
        if (
          parseInt(event.extra.set_score.home) +
          parseInt(event.extra.set_score.away) +
          1 ===
          setNumber
        ) {
          counter++;
          if (counter === gameNumber) {
            market.outcomes.forEach((outcome) => {
              const betScore = outcome.outcome;
              const actualScore =
                event.extra.set_score.home + ":" + event.extra.set_score.away;

              if (betScore === actualScore) {
                outcome.status = 2;
              } else {
                outcome.status = 3;
              }
            });
          }
        }
      }
    });
    if (counter < gameNumber && statistics.time_status === "3") {
      market.outcomes.forEach((outcome) => {
        outcome.status = 3;
      });
    }
  }
};

const PlayerServiceGameTotalPoints = (statistics, market) => {
  const total = parseFloat(market.specifiers.total);
  const serviceGameNumber = parseInt(market.specifiers.gamenr);
  const player = market.name.includes("$competitor1") ? "home" : "away";
  const playerName = market.name.includes("$competitor1")
    ? statistics.home.name
    : statistics.away.name;

  let serviceCounter = 0;
  let extraData = null;
  statistics.events.forEach((event, idx) => {
    if (event.text === `service taken - ${playerName}`) {
      serviceCounter++;
      if (serviceCounter === serviceGameNumber) {
        for (let i = idx; i < statistics.events.length; i++) {
          if (statistics.events[i].text.includes("Game point")) {
            extraData = statistics.events[i].extra;
            break;
          }
        }
      }
    }
  });

  console.log(serviceCounter, extraData);
  if (serviceCounter >= serviceGameNumber && extraData !== null) {
    const actualPoints =
      player === "home"
        ? parseInt(extraData.game_points.home)
        : parseInt(extraData.game_points.away);
    if (actualPoints < total) {
      market.outcomes[0].status = 2;
      market.outcomes[1].status = 3;
    }

    if (actualPoints > total) {
      market.outcomes[1].status = 2;
      market.outcomes[0].status = 3;
    }
  }
};

const SetTotalGames = (statistics, market) => {
  const set = parseInt(market.specifiers.setnr);
  const total = parseFloat(market.specifiers.total);

  console.log("test");
  if (statistics.time_status !== "3") {
    if (Object.keys(statistics.periods).length >= set) {
      console.log("test");
      let gamesCounter = 0;
      statistics.events.forEach((event, idx) => {
        if (event.text.includes(set) && event.text.includes(" set")) {
          for (let i = idx; i < statistics.events.length - idx; i++) {
            console.log("test");
            if (
              statistics.events[i].text.includes(set + 1) &&
              event.text.includes(" set")
            ) {
              break;
            }
            if (
              statistics.events[i].text.split(" ")[
              statistics.events[i].text.split(" ").length - 1
              ] === "Game"
            ) {
              gamesCounter++;
            }
          }
        }
      });

      if (gamesCounter > total) {
        market.outcomes[1].status = 2;
        market.outcomes[0].status = 3;
      }
    }
  } else {
    if (Object.keys(statistics.periods).length >= set) {
      let gamesCounter = 0;
      statistics.events.forEach((event, idx) => {
        if (event.text.includes(set) && event.text.includes(" set")) {
          for (let i = idx; i < statistics.events.length - idx; i++) {
            if (
              statistics.events[i].text.includes(set + 1) &&
              event.text.includes(" set")
            ) {
              break;
            }
            if (
              statistics.events[i].text.split(" ")[
              statistics.events[i].text.split(" ").length - 1
              ] === "Game"
            ) {
              gamesCounter++;
            }
          }
        }
      });

      if (gamesCounter > total) {
        market.outcomes[1].status = 2;
        market.outcomes[0].status = 3;
      }
      if (gamesCounter < total) {
        market.outcomes[1].status = 3;
        market.outcomes[0].status = 2;
      }
    } else {
      market.outcomes[1].status = 4;
      market.outcomes[0].status = 4;
    }
  }
};

const TotalSets = (statistics, market) => {
  if (statistics.time_status !== "3") {
    const totalSetsInGame = Object.keys(statistics.periods).length;
    const total = parseFloat(market.specifiers.total);

    if (totalSetsInGame > total) {
      market.outcomes[0].status = 3;
      market.outcomes[1].status = 2;
    }
  } else {
    const totalSetsInGame = Object.keys(statistics.periods).length;
    const total = parseFloat(market.specifiers.total);

    if (totalSetsInGame < total) {
      market.outcomes[0].status = 2;
      market.outcomes[1].status = 3;
    }
    if (totalSetsInGame > total) {
      market.outcomes[0].status = 3;
      market.outcomes[1].status = 2;
    }
  }
};

const MatchBothPlayersWinSet = (statistics, market) => {
  if (statistics.time_status === "3") {
    if (
      statistics.result.home > statistics.result.away &&
      statistics.result.home > 1 &&
      statistics.result.away > 1
    ) {
      market.outcomes[0].status = 2;
      market.outcomes[1].status = 3;
    }
    if (
      statistics.result.away > statistics.result.home &&
      statistics.result.home > 1 &&
      statistics.result.away > 1
    ) {
      market.outcomes[0].status = 3;
      market.outcomes[1].status = 2;
    }
    if (!(statistics.result.home > 1) || !(statistics.result.away > 1)) {
      market.outcomes[0].status = 3;
      market.outcomes[1].status = 3;
    }
  }
};

const TwoWay = (statistics, market) => {
  if (statistics.time_status === "3") {
    const winner = statistics.result.winner;

    if (winner === "home") {
      market.outcomes[0].status = 2;
      market.outcomes[1].status = 3;
    }
    if (winner === "away") {
      market.outcomes[0].status = 3;
      market.outcomes[1].status = 2;
    }
  }
};

const calcScoreBeforeMin = (min, statistics) => {
  let homeScore = 0, awayScore = 0;
  const home = statistics.home.name;
  statistics.events.forEach((event) => {
    if (event.text.includes("Goal -")) {
      if (parseFloat(event.text.split('\'')[0]?.split(' - ')[2]) < parseFloat(min)) {
        if (event.text.includes(home)) {
          homeScore++;
        } else {
          awayScore++;
        }
      }
    }
  });
  return { homeScore, awayScore };
}

const TwoWayBeforeMin = (statistics, market) => {
  if (statistics.time_status === "3") {
    const { homeScore, awayScore } = calcScoreBeforeMin(min, statistics);

    if (homeScore > awayScore) {
      market.outcomes[0].status = 2;
      market.outcomes[1].status = 3;
    } else {
      if (homeScore < awayScore) {
        market.outcomes[0].status = 3;
        market.outcomes[1].status = 2;
      } else {
        market.outcomes[0].status = 4;
        market.outcomes[1].status = 4;
      }
    }
  }
};

const GameHandicap = (statistics, market) => {
  if (statistics.time_status === 3) {
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

const BothToWinSet = (statistics, market) => {
  if (statistics.time_status === "3") {
    if (statistics.result.home > 1 && statistics.result.away > 1) {
      market.outcomes[0].status = 2;
      market.outcomes[1].status = 3;
    } else {
      market.outcomes[0].status = 3;
      market.outcomes[1].status = 2;
    }
  } else {
    if (statistics.result.home > 1 && statistics.result.away > 1) {
      market.outcomes[0].status = 2;
      market.outcomes[1].status = 3;
    }
  }
};

const TotalGames = (statistics, market) => {
  const total = parseFloat(market.specifiers.total);
  if (statistics.time_status === "3") {
    let counter = 0;
    statistics.events.forEach((event) => {
      if (event.text.split(" ")[event.text.split(" ").length - 1] === "Game") {
        counter++;
      }
    });

    if (counter < total) {
      market.outcomes[0].status = 2;
      market.outcomes[1].status = 3;
    }
    if (counter > total) {
      market.outcomes[0].status = 3;
      market.outcomes[1].status = 2;
    }
  } else {
    let counter = 0;
    statistics.events.forEach((event) => {
      if (event.text.split(" ")[event.text.split(" ").length - 1] === "Game") {
        counter++;
      }
    });

    if (counter > total) {
      market.outcomes[0].status = 3;
      market.outcomes[1].status = 2;
    }
  }
};

const PlayerTotalGames = (statistics, market) => {
  const player = market.name.includes("competitor1")
    ? statistics.home.name
    : statistics.away.name;
  const total = parseFloat(market.specifiers.total);

  if (statistics.time_status === "3") {
    let counter = 0;
    statistics.events.forEach((event) => {
      if (
        event.text.split(" ")[event.text.split(" ").length - 1] === "Game" &&
        event.text.includes(player)
      ) {
        counter++;
      }
    });

    if (counter < total) {
      market.outcomes[0].status = 2;
      market.outcomes[1].status = 3;
    }
    if (counter > total) {
      market.outcomes[0].status = 3;
      market.outcomes[1].status = 2;
    }
  } else {
    let counter = 0;
    statistics.events.forEach((event) => {
      if (
        event.text.split(" ")[event.text.split(" ").length - 1] === "Game" &&
        event.text.includes(player)
      ) {
        counter++;
      }
    });

    if (counter > total) {
      market.outcomes[0].status = 3;
      market.outcomes[1].status = 2;
    }
  }
};

const PlayerToWinOneSet = (statistics, market) => {
  const player = market.name.includes("competitor1") ? "home" : "away";
  if (statistics.time_status === "3") {
    if (player === "home") {
      if (statistics.result.home > 0) {
        market.outcomes[0].status = 2;
        market.outcomes[1].status = 3;
      } else {
        market.outcomes[0].status = 3;
        market.outcomes[1].status = 2;
      }
    }

    if (player === "away") {
      if (statistics.result.away > 0) {
        market.outcomes[0].status = 2;
        market.outcomes[1].status = 3;
      } else {
        market.outcomes[0].status = 3;
        market.outcomes[1].status = 2;
      }
    }
  } else {
    if (player === "home") {
      if (statistics.result.home > 0) {
        market.outcomes[0].status = 2;
        market.outcomes[1].status = 3;
      }
    }

    if (player === "away") {
      if (statistics.result.away > 0) {
        market.outcomes[0].status = 2;
        market.outcomes[1].status = 3;
      }
    }
  }
};

const AnySetWillEndSix = (statistics, market) => {
  let isTrue = false;
  if (statistics.time_status === "3") {
    Object.keys(statistics.periods).forEach((period) => {
      if (
        (period.home === 6 && period.away === 0) ||
        (period.home === 0 && period.away === 6)
      ) {
        isTrue = true;
      }
    });

    if (isTrue) {
      market.outcomes[0].status = 2;
      market.outcomes[1].status = 3;
    } else {
      market.outcomes[0].status = 3;
      market.outcomes[1].status = 2;
    }
  } else {
    Object.keys(statistics.periods).forEach((period) => {
      if (
        (period.home === 6 && period.away === 0) ||
        (period.home === 0 && period.away === 6)
      ) {
        isTrue = true;
      }
    });

    if (isTrue) {
      market.outcomes[0].status = 2;
      market.outcomes[1].status = 3;
    }
  }
};

const SetWinner = (statistics, market) => {
  const setNumber = parseInt(market.specifiers.setnr);

  if (statistics.periods[`p${setNumber}`]) {
    const winner =
      statistics.periods[`p${setNumber}`].home >
        statistics.periods[`p${setNumber}`].away
        ? "home"
        : "away";

    if (winner === "home") {
      market.outcomes[0].status = 2;
      market.outcomes[1].status = 3;
    }
    if (winner === "away") {
      market.outcomes[0].status = 3;
      market.outcomes[1].status = 2;
    }
  }
};

const SetGameHandicap = (statistics, market) => {
  const setNumber = parseInt(market.specifiers.setnr);

  if (statistics.periods[`p${setNumber}`]) {
    market.outcomes.forEach((outcome) => {
      outcome.status = 3;
    });

    const handicap = parseFloat(market.specifiers.hcp.replace("+"));

    const homeResult = statistics.periods[`p${setNumber}`].home;
    const awayResult = statistics.periods[`p${setNumber}`].away;

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

const SetCorrectScore = (statistics, market) => {
  const setNumber = parseInt(market.specifiers.setnr);

  if (statistics.periods[`p${setNumber}`]) {
    const score =
      statistics.periods[`p${setNumber}`].home +
      ":" +
      statistics.periods[`p${setNumber}`].away;
    market.outcomes.forEach((outcome) => {
      if (outcome.outcome === score) {
        outcome.status = 2;
      } else {
        outcome.status = 3;
      }
    });
  }
};

module.exports = {
  SetGameTotalPoints,
  SetScoreAfterGames,
  PlayerServiceGameTotalPoints,
  SetTotalGames,
  TotalSets,
  MatchBothPlayersWinSet,
  TwoWay,
  TwoWayBeforeMin,
  GameHandicap,
  BothToWinSet,
  TotalGames,
  PlayerTotalGames,
  PlayerToWinOneSet,
  AnySetWillEndSix,
  SetWinner,
  SetGameHandicap,
  SetCorrectScore,
};
