const {
  nameToFitFormat,
  BetradarEventTeam,
  eventNameToCommon,
  BetradarEventWithPlayer,
  BetradarEventWithoutPlayer,
  Validate,
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

  ComposeEvents = () => {
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
                parseInt(event.text.split(" ").at(-1).split(":")[0]) + 1;
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
              typeof event.player !== "undefined" &&
              event.player.name.length > 3
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

  Compose = () => {
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
      ss: null,
      scores: {},
      stats: {},
      extra: {
        length: null,
        numberofperiods: null,
        periodlength: null,
      },
      events: [],
    };

    this.sources.forEach((source) => {
      switch (source.source) {
        case "bet365":
          //sport id
          const sport_id = source.data.sport_id;
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

          //TODO
          result.scores = source.data.scores;

          //TODO
          result.stats = source.data.stats;

          //TODO
          result.extra = source.data.extra;

          break;
        case "betradar":
          break;
      }
    });

    //Events
    result.events = this.ComposeEvents();

    return result;
  };
}

module.exports = StatisticsComposer;
