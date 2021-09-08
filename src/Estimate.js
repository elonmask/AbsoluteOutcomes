const {
  fullTimeResult,
  HalfTimeFullTime,
  BothTeamsToScore,
} = require("./Functions");

class Estimate {
  constructor(statistics, marketsToEstimate) {
    this.statistics = statistics;
    this.marketsToEstimate = marketsToEstimate;
    this.estimatedOutcomes = [];
  }

  AddResult = (marketResult) => {
    this.estimatedOutcomes.push(marketResult);
  };

  EstimateCommon = (id) => {
    switch (id) {
      case 10001:
        this.AddResult(fullTimeResult(this.statistics));
        break;
      case 10002:
        this.AddResult(HalfTimeFullTime(this.statistics));
        break;
      case 10032:
        this.AddResult(BothTeamsToScore(this.statistics));
        break;
    }
  };

  EstimateLive = (id) => {
    switch (id) {
      case 1777:
        this.AddResult(fullTimeResult(this.statistics));
        break;
      case 10560:
        this.AddResult(HalfTimeFullTime(this.statistics));
        break;
      case 10565:
        this.AddResult(BothTeamsToScore(this.statistics));
        break;
    }
  };

  EstimatePrematch = (id) => {
    switch (id) {
      case 40:
        this.AddResult(fullTimeResult(this.statistics));
        break;
      case 42:
        this.AddResult(HalfTimeFullTime(this.statistics));
        break;
      case 10150:
        this.AddResult(BothTeamsToScore(this.statistics));
        break;
    }
  };

  EstimateOddTypes = (id) => {
    switch (id) {
      case 1:
        this.AddResult(fullTimeResult(this.statistics));
        break;
      case 42:
        this.AddResult(HalfTimeFullTime(this.statistics));
        break;
      case 27:
        this.AddResult(BothTeamsToScore(this.statistics));
        break;
    }
  };

  EstimateMarket = (idType, id) => {
    switch (idType) {
      case "common":
        this.EstimateCommon(id);
        break;
      case "live":
        this.EstimateLive(id);
        break;
      case "odd_types":
        this.EstimateOddTypes(id);
        break;
      case "prematch":
        this.EstimatePrematch(id);
        break;
      default:
        console.log("Market's ID type not defined: ");
    }
  };

  GetResults = () => {
    return this.estimatedOutcomes;
  };

  Start = () => {
    this.marketsToEstimate.forEach((market) => {
      this.EstimateMarket(Object.keys(market)[0], Object.values(market)[0]);
    });

    console.log("Markets estimated.");
  };
}

module.exports = Estimate;
