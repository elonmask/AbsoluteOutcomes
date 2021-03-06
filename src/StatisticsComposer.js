const {
  nameToFitFormat,
  BetradarEventTeam,
  eventNameToCommon,
  BetradarEventWithPlayer,
  BetradarEventWithoutPlayer,
  Validate,
  BetradarTennisEventTeam,
  BetradarTennisEvent,
  BetradarBasketEventTeam,
  BetradarBasketEvent,
  BetradarBaseballEventTeam,
  BetradarBaseballEvent,
  BetradarRugbyEventTeam,
  BetradarRugbyEvent,
} = require("./utils/utils");

class StatisticsComposer {
  /*
  sourcesArray - Array of different statistic object.
  Each object has this structure:

  //bet365 example
  {
    source: "bet365",
    data: statistics
  }

  */

  constructor(sourcesArray = []) {
    this.sources = sourcesArray;
  }

  ComposeEventsSoccer = () => {
    //Buffer to store all events
    const eventsBuffer = [];

    /*
    Example of events in Buffer:
    {
      data: "Corner",
      confirmations: 2,
      confirmable: true
    },
    {
      data: "Throw In",
      confirmations: 1,
      confirmable: true,
    },
    {
      data: "Match about to start",
      confirmable: false,
    }
    * */

    this.sources.forEach((source) => {
      switch (source.source) {
        case "bet365":
          source.data.events.forEach((event) => {
            if (event.text.split(" ")[0].includes(":")) {
              //Handle mm:ss - mm:ss statistics
              const minute =
                parseInt(
                  event.text
                    .split(" ")
                  [event.text.split(" ").length - 1].split(":")[0]
                ) + 1;
              eventsBuffer.push({
                data: minute + "' - " + event.text,
                confirmations: 1,
                confirmable: false,
              });
            }
            if (event.text.split(" ")[0].includes("'")) {
              const eventData = nameToFitFormat(event.text);

              const bufferValue = eventsBuffer.find(
                (event) =>
                  event.data === eventData ||
                  (event.data.split(" ")[0] === eventData.split(" ")[0] &&
                    event.data.split(" ")[2] === eventData.split(" ")[2])
              );
              if (typeof bufferValue !== "undefined") {
                //Event exist in buffer
                if (bufferValue.confirmable) {
                  if (eventData.length > bufferValue.data.length) {
                    bufferValue.data = eventData;
                    bufferValue.confirmations++;
                  } else {
                    bufferValue.confirmations++;
                  }
                }
              } else {
                //Event is not in buffer
                eventsBuffer.push({
                  data: eventData,
                  confirmations: 1,
                  confirmable: true,
                });
              }
            }
          });
          break;
        case "betradar":
          source.data.events.forEach((event) => {
            if (
              (typeof event.player !== "undefined" &&
                event.player.name.length > 3) ||
              (typeof event.scorer !== "undefined" &&
                event.scorer.name.length > 3)
            ) {
              const team = BetradarEventTeam(event, source);
              const eventData = eventNameToCommon(
                BetradarEventWithPlayer(event, team)
              );

              const bufferValue = eventsBuffer.find(
                (event) =>
                  event.data === eventData ||
                  (event.data.split(" ")[0] === eventData.split(" ")[0] &&
                    event.data.split(" ")[2] === eventData.split(" ")[2])
              );
              if (typeof bufferValue !== "undefined") {
                //Event exist in buffer
                if (bufferValue.confirmable) {
                  if (eventData.length > bufferValue.data.length) {
                    bufferValue.data = eventData;
                    bufferValue.confirmations++;
                  } else {
                    bufferValue.confirmations++;
                  }
                }
              } else {
                //Event is not in buffer
                eventsBuffer.push({
                  data: eventData,
                  confirmations: 1,
                  confirmable: event.time > 0,
                });
              }
            } else {
              const team = BetradarEventTeam(event, source);
              const eventData = eventNameToCommon(
                BetradarEventWithoutPlayer(event, team)
              );

              const bufferValue = eventsBuffer.find(
                (event) =>
                  event.data === eventData ||
                  (event.data.split(" ")[0] === eventData.split(" ")[0] &&
                    event.data.split(" ")[2] === eventData.split(" ")[2])
              );
              if (typeof bufferValue !== "undefined") {
                //Event exist in buffer
                if (bufferValue.confirmable) {
                  if (eventData.length > bufferValue.data.length) {
                    bufferValue.data = eventData;
                    bufferValue.confirmations++;
                  } else {
                    bufferValue.confirmations++;
                  }
                }
              } else {
                //Event is not in buffer
                if (event.time > 0) {
                  eventsBuffer.push({
                    data: eventData,
                    confirmations: 1,
                    confirmable: event.time > 0,
                  });
                }
              }
            }
          });
          break;
      }
    });

    //Sort events by time
    eventsBuffer.sort((a, b) => {
      if (
        parseInt(a.data.split(" ")[0].replace("'", "")) <
        parseInt(b.data.split(" ")[0].replace("'", ""))
      ) {
        return -1;
      }
      if (
        parseInt(a.data.split(" ")[0].replace("'", "")) >
        parseInt(b.data.split(" ")[0].replace("'", ""))
      ) {
        return 1;
      }
      return 0;
    });

    const result = [];

    /*
     * validity: 1 - Event was confirmed by all sources
     * validuty: 2 - Event was confirmed by 50% sources
     * validity: 3 - Event was confirmed by less then 50% sources
     * */
    eventsBuffer.forEach((event) => {
      const validity = Validate(this.sources, event);
      const info =
        validity === 1
          ? "Confirmed by all sources"
          : validity === 2
            ? "Confirmed by 50% sources"
            : validity === 3
              ? "Confirmed by less then 50% sources"
              : "";
      result.push({
        text: event.data,
        validity: validity,
        info: info,
      });
    });

    return result;
  };
  ComposeEventsTennis = () => {
    const eventsBuffer = [];

    this.sources.forEach((source) => {
      switch (source.source) {
        case "bet365":
          //TODO
          break;
        case "betradar":
          source.data.events.forEach((event) => {
            const player = BetradarTennisEventTeam(event, source);
            const eventData = BetradarTennisEvent(event, player);

            const bufferValue = eventsBuffer.find(
              (event) => event.data === eventData
            );

            if (typeof bufferValue !== "undefined") {
              //Event exist in buffer
              if (bufferValue.confirmable) {
                if (eventData.length > bufferValue.data.length) {
                  bufferValue.data = eventData;
                  bufferValue.confirmations++;
                } else {
                  bufferValue.confirmations++;
                }
              }
            } else {
              //Event is not in buffer
              if (
                eventData.includes("periodscore") ||
                eventData.includes("Score change tennis")
              ) {
                eventsBuffer.push({
                  data: eventData,
                  extra: {
                    set_score: event.set_score,
                    game_score: event.game_score,
                    game_points: event.game_points,
                    service: event.service,
                  },
                  confirmations: 1,
                  confirmable: event.time > 0,
                });
              } else {
                eventsBuffer.push({
                  data: eventData,
                  confirmations: 1,
                  confirmable: event.time > 0,
                });
              }
            }
          });
      }
    });

    const result = [];

    /*
     * validity: 1 - Event was confirmed by all sources
     * validuty: 2 - Event was confirmed by 50% sources
     * validity: 3 - Event was confirmed by less then 50% sources
     * */
    eventsBuffer.forEach((event) => {
      const validity = Validate(this.sources, event);
      const info =
        validity === 1
          ? "Confirmed by all sources"
          : validity === 2
            ? "Confirmed by 50% sources"
            : validity === 3
              ? "Confirmed by less then 50% sources"
              : "";
      if (
        typeof event.extra !== "undefined" &&
        event.extra !== null &&
        Object.keys(event.extra).length > 1
      ) {
        result.push({
          text: event.data,
          extra: event.extra || null,
          validity: validity,
          info: info,
        });
      } else {
        result.push({
          text: event.data,
          extra: null,
          validity: validity,
          info: info,
        });
      }
    });

    return result;
  };
  ComposeEventsBasketball = () => {
    const eventsBuffer = [];

    this.sources.forEach((source) => {
      switch (source.source) {
        case "bet365":
          //TODO
          break;
        case "betradar":
          source.data.events.forEach((event) => {
            const player = BetradarBasketEventTeam(event, source);
            const eventData = BetradarBasketEvent(event, player);

            const bufferValue = eventsBuffer.find(
              (event) => event.data === eventData
            );

            if (typeof bufferValue !== "undefined") {
              //Event exist in buffer
              if (bufferValue.confirmable) {
                if (eventData.length > bufferValue.data.length) {
                  bufferValue.data = eventData;
                  bufferValue.confirmations++;
                } else {
                  bufferValue.confirmations++;
                }
              }
            } else {
              //Event is not in buffer
              if (event.type === "goal") {
                eventsBuffer.push({
                  data: eventData,
                  extra: event.result,
                  confirmations: 1,
                  confirmable: event.time > 0,
                });
              } else {
                eventsBuffer.push({
                  data: eventData,
                  confirmations: 1,
                  confirmable: event.time > 0,
                });
              }
            }
          });
      }
    });

    const result = [];

    /*
     * validity: 1 - Event was confirmed by all sources
     * validuty: 2 - Event was confirmed by 50% sources
     * validity: 3 - Event was confirmed by less then 50% sources
     * */
    eventsBuffer.forEach((event) => {
      const validity = Validate(this.sources, event);
      const info =
        validity === 1
          ? "Confirmed by all sources"
          : validity === 2
            ? "Confirmed by 50% sources"
            : validity === 3
              ? "Confirmed by less then 50% sources"
              : "";
      if (
        typeof event.extra !== "undefined" &&
        event.extra !== null &&
        Object.keys(event.extra).length > 1
      ) {
        result.push({
          text: event.data,
          extra: event.extra || null,
          validity: validity,
          info: info,
        });
      } else {
        result.push({
          text: event.data,
          extra: null,
          validity: validity,
          info: info,
        });
      }
    });

    return result;
  };
  ComposeEventsBaseball = () => {
    const eventsBuffer = [];

    this.sources.forEach((source) => {
      switch (source.source) {
        case "bet365":
          //TODO
          break;
        case "betradar":
          source.data.events.forEach((event) => {
            const player = BetradarBaseballEventTeam(event, source);
            const eventData = BetradarBaseballEvent(event, player);

            const bufferValue = eventsBuffer.find(
              (event) => event.data === eventData
            );

            if (typeof bufferValue !== "undefined") {
              //Event exist in buffer
              if (bufferValue.confirmable) {
                if (eventData.length > bufferValue.data.length) {
                  bufferValue.data = eventData;
                  bufferValue.confirmations++;
                } else {
                  bufferValue.confirmations++;
                }
              }
            } else {
              //Event is not in buffer
              if (event.type === "goal") {
                eventsBuffer.push({
                  data: eventData,
                  extra: event.result,
                  confirmations: 1,
                  confirmable: event.time > 0,
                });
              } else {
                eventsBuffer.push({
                  data: eventData,
                  confirmations: 1,
                  confirmable: event.time > 0,
                });
              }
            }
          });
      }
    });

    const result = [];

    /*
     * validity: 1 - Event was confirmed by all sources
     * validuty: 2 - Event was confirmed by 50% sources
     * validity: 3 - Event was confirmed by less then 50% sources
     * */
    eventsBuffer.forEach((event) => {
      const validity = Validate(this.sources, event);
      const info =
        validity === 1
          ? "Confirmed by all sources"
          : validity === 2
            ? "Confirmed by 50% sources"
            : validity === 3
              ? "Confirmed by less then 50% sources"
              : "";
      if (
        typeof event.extra !== "undefined" &&
        event.extra !== null &&
        Object.keys(event.extra).length > 1
      ) {
        result.push({
          text: event.data,
          extra: event.extra || null,
          validity: validity,
          info: info,
        });
      } else {
        result.push({
          text: event.data,
          extra: null,
          validity: validity,
          info: info,
        });
      }
    });

    //Sorting by timestamp
    const formatted = [];
    for (let i = 0; i < result.length; ++i) {
      if (
        result[i].text.split(" - ")[1].includes(" ") ||
        result[i].text.split(" - ")[0].includes("Goal")
      ) {
        result[i].eventTime = new Date(
          parseInt(result[i].text.split(" - ")[2]) * 1000
        );
        formatted.push(result[i]);
      } else {
        result[i].eventTime = new Date(
          parseInt(result[i].text.split(" - ")[1]) * 1000
        );
        formatted.push(result[i]);
      }
    }
    return formatted
      .sort(function (x, y) {
        return y.eventTime - x.eventTime;
      })
      .reverse();
  };
  ComposeEventsRugby = () => {
    const eventsBuffer = [];

    this.sources.forEach((source) => {
      switch (source.source) {
        case "bet365":
          //TODO
          break;
        case "betradar":
          source.data.events.forEach((event) => {
            const player = BetradarRugbyEventTeam(event, source);
            const eventData = BetradarRugbyEvent(event, player);

            const bufferValue = eventsBuffer.find(
              (event) => event.data === eventData
            );

            if (typeof bufferValue !== "undefined") {
              //Event exist in buffer
              if (bufferValue.confirmable) {
                if (eventData.length > bufferValue.data.length) {
                  bufferValue.data = eventData;
                  bufferValue.confirmations++;
                } else {
                  bufferValue.confirmations++;
                }
              }
            } else {
              //Event is not in buffer
              if (event.result) {
                eventsBuffer.push({
                  data: eventData,
                  extra: event.result,
                  timestamp: event.updated_uts,
                  confirmations: 1,
                  confirmable: event.time > 0,
                });
              } else {
                eventsBuffer.push({
                  data: eventData,
                  timestamp: event.updated_uts,
                  confirmations: 1,
                  confirmable: event.time > 0,
                });
              }
            }
          });
      }
    });

    const result = [];

    /*
     * validity: 1 - Event was confirmed by all sources
     * validuty: 2 - Event was confirmed by 50% sources
     * validity: 3 - Event was confirmed by less then 50% sources
     * */
    eventsBuffer.forEach((event) => {
      const validity = Validate(this.sources, event);
      const info =
        validity === 1
          ? "Confirmed by all sources"
          : validity === 2
          ? "Confirmed by 50% sources"
          : validity === 3
          ? "Confirmed by less then 50% sources"
          : "";
      if (
        typeof event.extra !== "undefined" &&
        event.extra !== null &&
        Object.keys(event.extra).length > 1
      ) {
        result.push({
          text: event.data,
          extra: event.extra || null,
          timestamp: event.timestamp,
          validity: validity,
          info: info,
        });
      } else {
        result.push({
          text: event.data,
          extra: null,
          timestamp: event.timestamp,
          validity: validity,
          info: info,
        });
      }
    });

    return result;
  };

  ComposeSoccer = () => {
    const result = {
      sport_id: null,
      //time: null,
      time_status: null,
      home: {
        name: null,
      },
      away: {
        name: null,
      },
      ss: null,
      scores: {},
      stats: {
        attacks: ["0", "0"],
        ball_safe: ["0", "0"],
        corners: ["0", "0"],
        corner_h: ["0", "0"],
        dangerous_attacks: ["0", "0"],
        fouls: ["0", "0"],
        freekicks: ["0", "0"],
        goalattempts: ["0", "0"],
        goalkicks: ["0", "0"],
        goals: ["0", "0"],
        injuries: ["0", "0"],
        offsides: ["0", "0"],
        off_target: ["0", "0"],
        on_target: ["0", "0"],
        penalties: ["0", "0"],
        possession_rt: ["0", "0"],
        redcards: ["0", "0"],
        saves: ["0", "0"],
        shots_blocked: ["0", "0"],
        substitutions: ["0", "0"],
        throwins: ["0", "0"],
        yellowcards: ["0", "0"],
        yellowred_cards: ["0", "0"],
      },
      /* extra: {
        length: null,
        numberofperiods: null,
        periodlength: null,
      },*/
      events: [],
    };

    this.sources.forEach((source) => {
      switch (source.source) {
        case "bet365":
          //sport id
          const sport_id = source.data.sport_id?.toString();
          if (result.sport_id === null) {
            result.sport_id = sport_id;
          } else {
            if (result.sport_id !== sport_id) {
              result.sport_id = "not_defined";
            }
          }

          //time
          const time = source.data.time;
          if (result.time === null) {
            result.time = time;
          } else {
            if (result.time !== time) {
              result.time = "not_defined";
            }
          }

          //time status
          const time_status =
            source.data.time_status === "3" ? "3" : "not_ended";
          if (result.time_status === null) {
            result.time_status = time_status;
          } else {
            if (result.time_status !== time_status) {
              result.time_status = "not_defined";
            }
          }

          const homeName = source.data.home.name;
          if (result.home.name === null) {
            result.home.name = homeName;
          } else {
            if (result.home.name !== homeName) {
              result.home.name = "not_defined";
            }
          }

          const awayName = source.data.away.name;
          if (result.away.name === null) {
            result.away.name = awayName;
          } else {
            if (result.away.name !== awayName) {
              result.away.name = "not_defined";
            }
          }

          const score = source.data.ss;
          if (result.ss === null) {
            result.ss = score;
          } else {
            if (result.ss !== score) {
              result.ss = "not_defined";
            }
          }

          result.scores = source.data.scores;

          result.stats = source.data.stats;

          result.extra = source.data.extra;

          break;
        case "betradar":
          const sport_id_ = source.data.match._sid.toString();
          if (result.sport_id === null) {
            result.sport_id = sport_id_;
          } else {
            if (result.sport_id !== sport_id_) {
              result.sport_id = "not_defined";
            }
          }

          //time
          /*const time = source.data.time;
          if (result.time === null) {
            result.time = time;
          } else {
            if (result.time !== time) {
              result.time = "not_defined";
            }
          }*/

          //time status
          const time_status_ =
            source.data.match.status.name === "Ended" ? "3" : "not_ended";
          if (result.time_status === null) {
            result.time_status = time_status_;
          } else {
            if (result.time_status !== time_status_) {
              result.time_status = "not_defined";
            }
          }

          const homeName_ = source.data.match.teams.home.name;
          if (result.home.name === null) {
            result.home.name = homeName_;
          } else {
            if (result.home.name !== homeName_) {
              result.home.name = "not_defined";
            }
          }

          const awayName_ = source.data.match.teams.away.name;
          if (result.away.name === null) {
            result.away.name = awayName_;
          } else {
            if (result.away.name !== awayName_) {
              result.away.name = "not_defined";
            }
          }

          const score_ = `${source.data.match.result.home}-${source.data.match.result.away}`;
          if (result.ss === null) {
            result.ss = score_;
          } else {
            if (result.ss !== score_) {
              result.ss = "not_defined";
            }
          }

          //scores
          if (result.time_status === "3") {
            source.data.match.periods?.p1
              ? (result.scores["1"] = source.data.match.periods.p1)
              : "";
            source.data.match.periods?.ft
              ? (result.scores["2"] = source.data.match.periods.ft)
              : "";
          } else {
            if (source.data.match.status.name === "1st half") {
              result.scores["1"] = {
                home: parseInt(result.ss.split("-")[0]),
                away: parseInt(result.ss.split("-")[1]),
              };
            } else if (source.data.match.status.name === "2nd half") {
            }
          }
          break;
      }
    });

    //Events
    result.events = this.ComposeEventsSoccer();

    //Stats
    result.events.forEach((event) => {
      const addToStats = (statType, eventTeam) => {
        if (eventTeam === "home") {
          result.stats[statType][0] = (
            parseInt(result.stats[statType][0]) + 1
          ).toString();
        }

        if (eventTeam === "away") {
          result.stats[statType][1] = (
            parseInt(result.stats[statType][1]) + 1
          ).toString();
        }
      };

      //TODO - Attacks
      result.stats.attacks[0] = "-";
      result.stats.attacks[1] = "-";
      //TODO - ball_safe
      result.stats.ball_safe[0] = "-";
      result.stats.ball_safe[1] = "-";
      //TODO - corner_h
      result.stats.corner_h[0] = "-";
      result.stats.corner_h[1] = "-";
      //TODO - dangerous attacks
      result.stats.dangerous_attacks[0] = "-";
      result.stats.dangerous_attacks[1] = "-";
      //TODO - fouls
      result.stats.fouls[0] = "-";
      result.stats.fouls[1] = "-";
      //TODO - goal attempts
      result.stats.goalattempts[0] = "-";
      result.stats.goalattempts[1] = "-";
      //TODO - possesion_rt
      result.stats.possession_rt[0] = "-";
      result.stats.possession_rt[1] = "-";

      const eventText = event.text;
      const eventTeam = event.text
        .split(" - ")
      [event.text.split(" - ").length - 1].includes(result.home.name)
        ? "home"
        : "away";

      //Corners
      if (eventText.includes("Corner")) {
        addToStats("corners", eventTeam);
      }

      if (eventText.includes("Freekick")) {
        addToStats("freekicks", eventTeam);
      }

      if (eventText.includes("Goal kick")) {
        addToStats("goalkicks", eventTeam);
      }

      if (eventText.includes(" - Goal - ")) {
        addToStats("goals", eventTeam);
      }

      if (eventText.includes("injured")) {
        addToStats("injuries", eventTeam);
      }

      if (eventText.includes("Offside")) {
        addToStats("offsides", eventTeam);
      }

      if (eventText.includes("Shot off target")) {
        addToStats("off_target", eventTeam);
      }

      if (eventText.includes("Shot on target")) {
        addToStats("on_target", eventTeam);
      }

      if (eventText.includes("Penalty")) {
        addToStats("penalties", eventTeam);
      }

      if (eventText.includes("Red Card")) {
        addToStats("redcards", eventTeam);
      }

      if (eventText.includes("save")) {
        addToStats("saves", eventTeam);
      }

      if (eventText.includes("Shot blocked")) {
        addToStats("shots_blocked", eventTeam);
      }

      if (eventText.includes("Substitution")) {
        addToStats("substitutions", eventTeam);
      }

      if (eventText.includes("Throw-in")) {
        addToStats("throwins", eventTeam);
      }

      if (eventText.includes("Yellow Card")) {
        addToStats("yellowcards", eventTeam);
      }

      if (eventText.includes("Card")) {
        addToStats("yellowred_cards", eventTeam);
      }
    });

    return result;
  };
  ComposeTennis = () => {
    const result = {
      sport_id: null,
      //time: null,
      time_status: null,
      home: {
        name: null,
      },
      away: {
        name: null,
      },
      result: null,
      periods: null,
      events: [],
    };

    this.sources.forEach((source) => {
      switch (source.source) {
        case "betradar":
          const sport_id_ = source.data.match._sid.toString();
          if (result.sport_id === null) {
            result.sport_id = sport_id_;
          } else {
            if (result.sport_id !== sport_id_) {
              result.sport_id = "not_defined";
            }
          }

          //time status
          if (source.data.match.timeinfo.running === true) {
            result.time_status = "not_ended";
          } else {
            result.time_status = "3";
          }

          //home
          result.home.name = source.data.match.teams.home.name;
          //away
          result.away.name = source.data.match.teams.away.name;

          //result
          result.result = source.data.match.result;
          //periods
          result.periods = source.data.match.periods;

          //events
          result.events = this.ComposeEventsTennis();
      }
    });
    return result;
  };
  ComposeLikeBasketball = () => {
    const result = {
      sport_id: null,
      //time: null,
      time_status: null,
      home: {
        name: null,
      },
      away: {
        name: null,
      },
      result: null,
      periods: null,
      events: [],
    };

    this.sources.forEach((source) => {
      switch (source.source) {
        case "betradar":
          const sport_id_ = source.data.match._sid.toString();
          if (result.sport_id === null) {
            result.sport_id = sport_id_;
          } else {
            if (result.sport_id !== sport_id_) {
              result.sport_id = "not_defined";
            }
          }

          //time status
          if (source.data.match.timeinfo.running === true) {
            result.time_status = "not_ended";
          } else {
            result.time_status = "3";
          }

          //home
          result.home.name = source.data.match.teams.home.name;
          //away
          result.away.name = source.data.match.teams.away.name;

          //result
          result.result = source.data.match.result;
          //periods
          result.periods = source.data.match.periods;

          //events
          result.events = this.ComposeEventsBasketball();
      }
    });
    return result;
  };
  ComposeBaseball = () => {
    const result = {
      sport_id: null,
      time: null,
      time_status: null,
      home: {
        name: null,
      },
      away: {
        name: null,
      },
      result: null,
      periods: null,
      overtimeperiods: null,
      events: [],
    };

    this.sources.forEach((source) => {
      switch (source.source) {
        case "betradar":
          const sport_id_ = source.data.match._sid.toString();
          if (result.sport_id === null) {
            result.sport_id = sport_id_;
          } else {
            if (result.sport_id !== sport_id_) {
              result.sport_id = "not_defined";
            }
          }

          //time status
          if (source.data.match.result?.winner) {
            result.time_status = "3";
          } else {
            result.time_status = "not_ended";
          }

          //time
          result.time = source.data.time;
          //delete result.time["_doc"];

          //home
          result.home.name = source.data.match.teams.home.name;
          //away
          result.away.name = source.data.match.teams.away.name;

          //result
          result.result = source.data.match.result;
          //periods
          result.periods = source.data.match.periods;
          //extratime
          result.overtimeperiods = source.data.match.overtimeperiods;
          //events
          result.events = this.ComposeEventsBaseball();
      }
    });
    return result;
  };
  ComposeRugby = () => {
    const result = {
      sport_id: null,
      time: null,
      time_status: null,
      home: {
        name: null,
      },
      away: {
        name: null,
      },
      result: null,
      periods: null,
      events: [],
    };

    this.sources.forEach((source) => {
      switch (source.source) {
        case "betradar":
          const sport_id_ = source.data.match._sid.toString();
          if (result.sport_id === null) {
            result.sport_id = sport_id_;
          } else {
            if (result.sport_id !== sport_id_) {
              result.sport_id = "not_defined";
            }
          }

          //time status
          if (source.data.match.result?.winner) {
            result.time_status = "3";
          } else {
            result.time_status = "not_ended";
          }

          //time
          result.time = source.data.match.time;
          //result.time["_doc"];

          //home
          result.home.name = source.data.match.teams.home.name;
          //away
          result.away.name = source.data.match.teams.away.name;

          //result
          result.result = source.data.match.result;
          //periods
          result.periods = source.data.match.periods;
          //events
          result.events = this.ComposeEventsRugby();
      }
    });
    return result;
  };

  Compose = (sportID) => {
    switch (sportID) {
      case 1:
        return this.ComposeSoccer();
      case 5:
      case 23:
        return this.ComposeTennis();
      case 2:
      case 4:
        return this.ComposeLikeBasketball();
      case 3:
        return this.ComposeBaseball();
      case 12:
        return this.ComposeRugby();
    }
  };
}

module.exports = StatisticsComposer;
