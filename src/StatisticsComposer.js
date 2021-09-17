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

  constructor(sourcesArray) {
    this.sources = sourcesArray;
  }

  ComposeMatchInfo = () => {};

  ComposeEvents = () => {};

  static Compose = () => {};
}

module.exports = StatisticsComposer;
