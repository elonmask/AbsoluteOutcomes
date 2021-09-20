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
    //TODO
    return [];
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
