const { HandicapWithDraw, ThreeWay } = require("./Markets/Basketball");
const { Total3Way, PeriodMoneyLine, PeriodHandicap, PeriodTotalGoals } = require("./Markets/IceHockey");
const { Handicap, TotalGoals } = require("./Markets/Soccer");
const { TwoWay } = require("./Markets/Tennis");

class Estimate {
  constructor(statistics, marketsToEstimate) {
    this.statistics = statistics;
    this.marketsToEstimate = marketsToEstimate;
  }

  EstimateMarket = (market) => {
    const commonId = market.commonId;

    switch (commonId) {
      case "40001":
        Handicap(this.statistics, market);
        break;
      case "40002":
        TotalGoals(this.statistics, market);
        break;
      case "40003":
        TwoWay(this.statistics, market);
        break;
      case "40004":
        HandicapWithDraw(this.statistics, market);
        break;
      case "40005":
      case "4005":
        Total3Way(this.statistics, market);
        break;
      case "40006":
        ThreeWay(this.statistics, market);
        break;
      case "40007":
        PeriodHandicap(this.statistics, market);
        break;
      case "40008":
        PeriodTotalGoals(this.statistics, market);
        break;
      case "40009":
        PeriodMoneyLine(this.statistics, market);
        break;
      case "40010":
        Total3Way(this.statistics, market, true);
        break;
      case "40011":
        PeriodMoneyLine(this.statistics, market);
        break;
      case "40012":
        Handicap(this.statistics, market, 10);
        break;
      case "40013":
        TotalGoals(this.statistics, market, 10);
        break;
    }
  }

  Start = () => {
    this.marketsToEstimate.forEach((market) => {
      this.EstimateMarket(market);
    });
  };
}

module.exports = Estimate;